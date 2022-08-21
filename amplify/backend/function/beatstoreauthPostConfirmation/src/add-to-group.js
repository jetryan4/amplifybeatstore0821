/* eslint-disable-line */ const aws = require('aws-sdk');

// aws dynamodb
const ddb = new aws.DynamoDB();

const cognitoidentityserviceprovider = new aws.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
});

exports.handler = async event => {
  console.log(event);
  const groupParams = {
    GroupName: process.env.GROUP,
    UserPoolId: event.userPoolId,
  };
  const addUserParams = {
    GroupName: process.env.GROUP,
    UserPoolId: event.userPoolId,
    Username: event.userName,
  };
  /**
   * Check if the group exists; if it doesn't, create it.
   */
  try {
    await cognitoidentityserviceprovider.getGroup(groupParams).promise();
  } catch (e) {
    await cognitoidentityserviceprovider.createGroup(groupParams).promise();
  }
  /**
   * Then, add the user to the group.
   */
  await cognitoidentityserviceprovider.adminAddUserToGroup(addUserParams).promise();
  /**
   * Then, save the user details to the user table.
   */
  let date = new Date();
  let params = {
    Item: {
      'id': {S: event.request.userAttributes.sub},
      '__typename': {S: 'User'},
      'email': {S: event.request.userAttributes.email},
      'role': {S: process.env.GROUP},
      'status': {S: 'ACTIVE'},
      'createdAt': {S: date.toISOString()},
      'updatedAt': {S: date.toISOString()},
    },
    TableName: process.env.API_BEATSTORE_USER_TABLE_NAME
  };
  // Call DynamoDB
  try {
    const putItemOutput = await ddb.putItem(params).promise()
    console.log(`Success: ${JSON.stringify(putItemOutput)}`);
  } catch (err) {
    console.log("Error", err);
  }
  return event;
};