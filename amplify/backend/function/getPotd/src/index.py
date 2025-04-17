import json
import boto3
from boto3.dynamodb.conditions import Key
import os
from datetime import datetime, timedelta

def handler(event, context):
  print('received event:')
  print(event)

  try:
    user_id = event['requestContext']['identity']['cognitoAuthenticationProvider'].split(':CognitoSignIn:')[1].split('/')[0]
    print(f"Authenticated user ID (sub): {user_id}")

  except Exception as e:
        print('Error extracting user from event:', e)
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps({'message': 'Invalid request context', 'error': str(e)})
        }
  
  dynamodb = boto3.resource('dynamodb')
  table = dynamodb.Table(os.environ['STORAGE_NASA_NAME'])
  
  # Get today's date in YYYY-MM-DD format
  today_date = datetime.now()
  today = today_date.strftime('%Y-%m-%d')
  
  try:
    # Query the DynamoDB table with today's date as the id
    response = table.get_item(
      Key={
        'id': today
      }
    )
    
    # Check if item exists
    if 'Item' in response:
      potd = response['Item']
      return {
          'statusCode': 200,
          'headers': {
              'Access-Control-Allow-Headers': '*',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
          },
          'body': json.dumps(potd)
      }
    else:
      # If today's picture doesn't exist, try to get yesterday's
      yesterday_date = today_date - timedelta(days=1)
      yesterday = yesterday_date.strftime('%Y-%m-%d')
      
      yesterday_response = table.get_item(
        Key={
          'id': yesterday
        }
      )
      
      if 'Item' in yesterday_response:
        potd = yesterday_response['Item']
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps(potd)
        }
      else:
        return {
            'statusCode': 404,
            'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps({'message': f'No picture of the day found for today ({today}) or yesterday ({yesterday})'})
        }
      
  except Exception as e:
    print('Error retrieving picture of the day:', e)
    return {
        'statusCode': 500,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': json.dumps({'message': 'Error retrieving picture of the day', 'error': str(e)})
    }