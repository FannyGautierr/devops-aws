/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const { LambdaClient, InvokeCommand } = require('@aws-sdk/client-lambda');
const lambdaClient = new LambdaClient();

exports.handler = async (event, context) => {
  console.log(event);
  const uuid = event.userName;
  const email = event.email;
  const name = event.name;

  const FunctionName = process.env.FUNCTION_CREATEUSER_NAME;

  const asyncLambdaParams = {
    FunctionName: FunctionName,
    InvocationType: 'Event',
    Payload: JSON.stringify({ uuid, email, name }),
  };

  const command = new InvokeCommand(asyncLambdaParams);
  await lambdaClient.send(command);

  return event;
};
