# import json

# def handler(event, context):
#   print('received event:')
#   print(event)
  
#   return {
#       'statusCode': 200,
#       'headers': {
#           'Access-Control-Allow-Headers': '*',
#           'Access-Control-Allow-Origin': '*',
#           'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
#       },
#       'body': json.dumps('Hello from your new Amplify Python lambda!')
#   }

# import json
# import os

# import boto3

# def handler(event, context):  
#   print(event)
#   dynamodb = boto3.resource('dynamodb')
#   table = dynamodb.Table(os.environ['STORAGE_ADDRESS_NAME'])
#   table.put_item(
#         Item={
#             'id': event['id'],
#             'user_id': event['user_id'],
#             'address': event['address'],
#             'city': event['city'],
#             'state': event['state'],
#             'country': event['country'],
#             'postal_code': event['postal_code'],
#         }
#   )
  
#   print('received event:')
#   print(event)
  
#   return {
#       'statusCode': 200,
#       'headers': {
#           'Access-Control-Allow-Headers': '*',
#           'Access-Control-Allow-Origin': '*',
#           'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
#       },
#       'body': json.dumps('User created successfully')
#   }

import json
import os
import uuid

import boto3

def handler(event, context):
    print('received event:')
    print(event)
    
    # Check if the event is from API Gateway (has 'body' key)
    if 'body' in event:
        try:
            # Parse the request body
            body = json.loads(event['body'])
        except json.JSONDecodeError:
            return create_response(400, {'error': 'Invalid request body'})
    else:
        # Direct Lambda invocation (for testing or internal calls)
        body = event
    
    # Get Cognito identity ID if available
    user_id = None
    if event.get('requestContext', {}).get('identity', {}).get('cognitoIdentityId'):
        user_id = event['requestContext']['identity']['cognitoAuthenticationProvider'].split(':CognitoSignIn:')[1].split('/')[0]
    
    if not user_id:
        return create_response(400, {'error': 'Not authenticated user'})
    
    try:
        # Generate a unique ID for the address if not provided
        address_id = body.get('id', str(uuid.uuid4()))
        
        # Prepare address item
        address_item = {
            'id': address_id,
            'user_id': user_id,
            'address': body.get('address', ''),
            'city': body.get('city', ''),
            'state': body.get('state', ''),
            'country': body.get('country', ''),
            'postal_code': body.get('postal_code', '')
        }
        
        # Store in DynamoDB
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table(os.environ['STORAGE_ADDRESS_NAME'])
        table.put_item(Item=address_item)
        
        return create_response(201, {
            'message': 'Address created successfully',
            'address': address_item
        })
    except Exception as e:
        print(f"Error: {e}")
        return create_response(500, {'error': 'Internal server error'})

def create_response(status_code, body):
    """Create a standardized API response"""
    return {
        'statusCode': status_code,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE'
        },
        'body': json.dumps(body)
    }