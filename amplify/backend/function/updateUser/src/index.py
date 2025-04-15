import json
import os

import boto3

def handler(event, context):
    print(event)
    
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(os.environ['STORAGE_USERS_NAME'])
    
    try:
        response = table.update_item(
            Key={
                'id': event['id'] 
            },
            UpdateExpression="SET #name = :name, #email = :email",
            ExpressionAttributeNames={
                '#name': 'name', 
                '#email': 'email'
            },
            ExpressionAttributeValues={
                ':name': event['name'],
                ':email': event['email']
            },
            ReturnValues="UPDATED_NEW"
        )
        
        print('Update response:', response)
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps({
                'message': 'User updated successfully',
                'updatedAttributes': response.get('Attributes', {})
            })
        }
    except Exception as e:
        print('Error updating user:', e)
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps({'message': 'Error updating user', 'error': str(e)})
        }