import json
import os

import boto3
from boto3.dynamodb.conditions import Key

def handler(event, context):
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
    table = dynamodb.Table(os.environ['STORAGE_USERS_NAME'])
    table_address = dynamodb.Table(os.environ['STORAGE_ADDRESS_NAME'])
    
    try:
        response = table.get_item(
            Key={
                'id': user_id
            }
        )

        response_address = table_address.query(
            IndexName= 'user_ids',
            KeyConditionExpression=Key('user_id').eq(user_id)
        )
        print('Response from DynamoDB:', response_address)
        if 'Item' in response:
            user = response['Item']
            print('User retrieved successfully:', user)
            
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                },
                'body': json.dumps({
                    'message': 'User retrieved successfully',
                    'user': user,
                    'address': response_address['Items']
                })
            }
        else:
            return {
                'statusCode': 404,
                'headers': {
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                },
                'body': json.dumps({
                    'message': 'User not found'
                })
            }
    except Exception as e:
        print('Error retrieving user:', e)
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps({'message': 'Error retrieving user', 'error': str(e)})
        }
