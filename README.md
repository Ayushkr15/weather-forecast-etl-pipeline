# Weather Forecast ETL Pipeline

## Overview
This project implements an ETL (Extract , Transform , Load) pipeline using AWS services to fetch data from [Yahoo weather API](https://rapidapi.com/apishub/api/yahoo-weather5) , process it , and store data and push data to AWS API Gateway and calling it from frontend. The project shows weather forcast for mumbai city which get automatically updates each day with AWS trigger.

## Architecture
The pipeline follows a structured ETL process:
  1. **Extract:** AWS Lambda extracts data from the Spotify API.
  2. **Transform:** The extracted data is processed and structured using AWS Lambda.
  3. **Load:** Transformed data is stored in Amazon S3, with schema inference using AWS Glue, enabling querying through Amazon Athena.
  4. **API Gateway**
  5. **Frontend**

### Architecture Diagram
![weather](https://github.com/user-attachments/assets/e0933cd8-8e3a-4529-84c3-9c3867527658)

## Tech Stack
- AWS Services: Lambda, S3, Glue, Athena, CloudWatch , API Gateway
- Programming Language: Python , React , Html , CSS
- Yahoo Weather API: Weather Forcast Data
- Data Processing: Pandas, JSON , numpy

## Folder Structure
```
weather_etl_pipeline/
├── backend/
      ├── lambda_function/
                ├── get_weather_data.py               # AWS Lambda function to extract data and push to API
                ├── weather_data_extract_lambda.py    # AWS Lambda function to extract data from weather API
                ├── weather_data_transform_lambda.py  # AWS Lambda function to transform data 
├── frontend/
      ├── public/
            ├── index.html
            ├── Favicon files
      ├── src/
            ├── App.js   # React Code
            ├── index.js
            ├── App.css
      ├── package-lock.json
      ├── package.json
├── pipeline/
      ├── weather data pipeline project.ipynb     
├── README.md                                         # Project documentation
```

## ☁️ AWS Components
- Amazon CloudWatch: ⏰ Triggers the Lambda function to extract Spotify data on a schedule.
- AWS Lambda (Extraction): 🏗️ Fetches raw playlist data from the Spotify API and stores it in S3.
- Amazon S3 (Raw Storage): 📦 Stores extracted JSON data.
- AWS Lambda (Transformation): 🔄 Processes and structures the data into tables (Albums, Artists, Songs).
- Amazon S3 (Processed Storage): 📂 Stores the transformed CSV data.
- AWS Glue Crawler: 🔍 Infers the schema of transformed data.
- AWS Glue Data Catalog: 📖 Stores metadata for querying in Athena.
- Amazon Athena: 📊 Enables SQL-based querying of processed Spotify data.
- Amazon API Gateway: 📖 An API Gateway routes requests to backend services, managing security and load balancing
















