import json
import os

import boto3

def handler(event, context):
    print(event)
    
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(os.environ['STORAGE_USERS_NAME'])
    
    try:
        print('Event:', event)
        if isinstance(event['body'], str):
            body = json.loads(event['body'])
        else:
            body = event['body']
        
        response = table.update_item(
            Key={
                # 'id': event['id'] 
                'id': event['requestContext']['identity']['cognitoAuthenticationProvider'].split(':CognitoSignIn:')[1].split('/')[0]
            },
            UpdateExpression="SET #name = :name, #email = :email",
            ExpressionAttributeNames={
                '#name': 'name', 
                '#email': 'email'
            },
            ExpressionAttributeValues={
                ':name': body['name'],
                ':email': body['email'],
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