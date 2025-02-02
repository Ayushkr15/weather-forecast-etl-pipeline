import json
import pandas as pd 
import boto3
from datetime import datetime
from io import StringIO

S3_BUCKET = "weather-etl-project"
S3_RAW_FOLDER = "raw_data/to_process/"
S3_PROCESSED_FOLDER = "raw_data/processed/"
S3_TRANSFORMED_FORECAST = "transformed_data/forecast_data/"
S3_TRANSFORMED_WIND = "transformed_data/wind_data/"


def lambda_handler(event, context):
    s3 = boto3.client("s3")

    weather_files = s3.list_objects_v2(Bucket=S3_BUCKET, Prefix=S3_RAW_FOLDER).get("Contents", [])

    for file in weather_files:
        file_key = file["Key"]
        if file_key.endswith(".json"):
            response = s3.get_object(Bucket=S3_BUCKET, Key=file_key)
            weather_data = json.loads(response["Body"].read())

            forecast_list = weather_data.get('forecasts', [])
            wind_data = weather_data.get("current_observation", {}).get("wind",{})

            forcast_df = pd.DataFrame(forecast_list)

            forcast_df["wind_speed"] = wind_data.get("speed", None)
            forcast_df["wind_direction"] = wind_data.get("direction", None)
            forcast_df["wind_chill"] = wind_data.get("chill", None)

            forcast_df['date'] = pd.to_datetime(forcast_df['date'], unit='s').dt.date
            forcast_df.rename(columns={'high': 'max_temp', 'low': 'min_temp', 'text': 'weather_condition'}, inplace=True)

            forcast_df['max_temp'] = (forcast_df['max_temp'] - 32) * 5.0/9.0
            forcast_df['min_temp'] = (forcast_df['min_temp'] - 32) * 5.0/9.0

            forecast_buffer = StringIO()
            forcast_df.to_csv(forecast_buffer, index=False)
            s3.put_object(Bucket=S3_BUCKET, Key=f"{S3_TRANSFORMED_FORECAST}forecast_{datetime.now().strftime('%Y%m%d%H%M%S')}.csv", Body=forecast_buffer.getvalue())

            if wind_data:
                wind_df = pd.DataFrame([wind_data])
                wind_buffer = StringIO()
                wind_df.to_csv(wind_buffer, index=False)
                s3.put_object(Bucket=S3_BUCKET, Key=f"{S3_TRANSFORMED_WIND}wind_{datetime.now().strftime('%Y%m%d%H%M%S')}.csv", Body=wind_buffer.getvalue())
            else:
                print("WARNING: No wind data found in JSON!")

            s3.copy_object(Bucket=S3_BUCKET, CopySource={"Bucket": S3_BUCKET, "Key": file_key}, Key=f"{S3_PROCESSED_FOLDER}{file_key.split('/')[-1]}")
            s3.delete_object(Bucket=S3_BUCKET, Key=file_key)

    return {"statusCode": 200, "body": "Weather data transformed and stored in S3"}