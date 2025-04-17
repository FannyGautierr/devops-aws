import json
import boto3
import requests
from datetime import datetime
import os

def handler(event, context):
    print('received event:')
    print(event)
    
    apod_url = "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY"
    
    try:
        response = requests.get(apod_url)
        print('Response from NASA API:', response)
        response.raise_for_status() 
        apod_data = response.json()

        apod_data['retrieved_at'] = datetime.now().isoformat()
        apod_data['id'] = apod_data['date'] 
        
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table(os.environ['STORAGE_NASA_NAME'])
        
        table.put_item(
            Item={
            'id': apod_data['id'],
            'title': apod_data['title'],
            'explanation': apod_data['explanation'],
            'url': apod_data['url'],
            }
        )
        print('APOD data stored in DynamoDB:', apod_data)
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps({
                'message': 'NASA Picture of the Day retrieved and stored successfully',
                'data': apod_data
            })
        }
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps({
                'message': f'Error retrieving NASA Picture of the Day: {str(e)}'
            })
        }