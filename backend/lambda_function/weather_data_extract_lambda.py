import json
import requests
import boto3
from datetime import datetime
import os

API_KEY = os.environ.get("RAPIDAPI_WEATHER_KEY")
API_URL = "https://yahoo-weather5.p.rapidapi.com/weather"
headers = {
    "x-rapidapi-key": API_KEY,
    "x-rapidapi-host": "yahoo-weather5.p.rapidapi.com"
}

S3_BUCKET = "weather-etl-project"
S3_RAW_FOLDER = "raw_data/to_process/"

def lambda_handler(event, context):
    location = event.get("location", "Mumbai")
    params = {"location": location, "format": "json", "u": "f"}

    try:
        response = requests.get(API_URL, headers=headers, params=params)
        weather_data = response.json()

        s3 = boto3.client("s3")
        file_name = f"weather_raw_{location}_{datetime.now().strftime('%Y%m%d%H%M%S')}.json"
        s3.put_object(
            Bucket=S3_BUCKET, 
            Key=f"{S3_RAW_FOLDER}{file_name}", 
            Body=json.dumps(weather_data)
        )
        return {"statusCode": 200, "body": f"Weather data saved to S3: {file_name}"}
        
    except Exception as e:
        return {"statusCode": 500, "body": f"Error: {str(e)}"}