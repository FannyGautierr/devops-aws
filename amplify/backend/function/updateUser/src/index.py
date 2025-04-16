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
        
        # Build update expression and attribute values dynamically
        update_expression = "SET #name = :name, #email = :email"
        expression_attribute_names = {
            '#name': 'name', 
            '#email': 'email'
        }
        expression_attribute_values = {
            ':name': body['name'],
            ':email': body['email'],
        }
        
        # Add avatarKey and avatarUrl if they exist in the request
        if 'avatarKey' in body and body['avatarKey']:
            update_expression += ", #avatarKey = :avatarKey"
            expression_attribute_names['#avatarKey'] = 'avatarKey'
            expression_attribute_values[':avatarKey'] = body['avatarKey']
            
        if 'avatarUrl' in body and body['avatarUrl']:
            update_expression += ", #avatarUrl = :avatarUrl"
            expression_attribute_names['#avatarUrl'] = 'avatarUrl'
            expression_attribute_values[':avatarUrl'] = body['avatarUrl']
        
        response = table.update_item(
            Key={
                # 'id': event['id'] 
                'id': event['requestContext']['identity']['cognitoAuthenticationProvider'].split(':CognitoSignIn:')[1].split('/')[0]
            },
            UpdateExpression=update_expression,
            ExpressionAttributeNames=expression_attribute_names,
            ExpressionAttributeValues=expression_attribute_values,
            ReturnValues="ALL_NEW"  # Return all attributes of the updated item
        )
        
        print('Update response:', response)
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps(response.get('Attributes', {}))
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