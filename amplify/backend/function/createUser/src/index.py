import json
import os

import boto3

def handler(event, context):  
  dynamodb = boto3.resource('dynamodb')
  table = dynamodb.Table(os.environ['STORAGE_USERS_NAME'])
  table.put_item(
        Item={
            'uuid': event['uuid'],
            'email': event['email'],
            'name': event['name'],
        }
  )
  
  print('received event:')
  print(event)
  
  return {
      'statusCode': 200,
      'headers': {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
      },
      'body': json.dumps('User created successfully')
  }