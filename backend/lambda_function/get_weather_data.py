import boto3
import json
import time

athena_client = boto3.client("athena")

DATABASE = "weather_data_db"
TABLE = "forecast_data"
S3_OUTPUT = "s3://weather-etl-project/athena-query-results/"

def get_query_results(query_execution_id):
    """Waits for query execution to complete and retrieves results."""
    while True:
        response = athena_client.get_query_execution(QueryExecutionId=query_execution_id)
        state = response["QueryExecution"]["Status"]["State"]

        if state in ["SUCCEEDED", "FAILED", "CANCELLED"]:
            break
        time.sleep(2)  # Wait for the query to complete

    if state == "SUCCEEDED":
        result_response = athena_client.get_query_results(QueryExecutionId=query_execution_id)
        rows = result_response["ResultSet"]["Rows"]

        # Parse the result set
        results = []
        for row in rows[1:]:  # Skip the header row
            results.append({
                "date": row["Data"][0]["VarCharValue"],
                "max_temp": row["Data"][1]["VarCharValue"],
                "min_temp": row["Data"][2]["VarCharValue"],
                "weather_condition": row["Data"][3]["VarCharValue"],
            })

        return results
    else:
        return {"error": f"Query failed with state: {state}"}

def lambda_handler(event, context):
    query = f"SELECT date, max_temp, min_temp, weather_condition FROM {DATABASE}.{TABLE} ORDER BY date DESC LIMIT 7;"

    response = athena_client.start_query_execution(
        QueryString=query,
        QueryExecutionContext={"Database": DATABASE},
        ResultConfiguration={"OutputLocation": S3_OUTPUT}
    )

    query_execution_id = response["QueryExecutionId"]
    
    # Fetch query results
    weather_data = get_query_results(query_execution_id)

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
        "body": json.dumps(weather_data),
    }
