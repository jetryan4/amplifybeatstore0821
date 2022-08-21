/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	SECRET_KEY
	WEBHOOK_SECRET
	API_BEATSTORE_USER_TABLE_NAME
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({convertEmptyValues: true});

const stripe = require('stripe')(process.env.SECRET_KEY, {
    apiVersion: '2020-08-27'
});

const SUBSCRIPTION_TABLE_NAME = process.env.SUBSCRIPTION_TABLE_NAME;
const API_BEATSTORE_USER_TABLE_NAME = process.env.API_BEATSTORE_USER_TABLE_NAME;

exports.handler = async (event) => {
    console.log(event);
    const webhookSecret = process.env.WEBHOOK_SECRET;
    //console.log(`webhook secret -------- ${webhookSecret}`);
    let response = '';
    try {
        const sig = event?.headers['Stripe-Signature'];
        //console.log(`signature---------${sig}`);

        const stripeEvent = stripe.webhooks.constructEvent(event.body, sig, webhookSecret);
        console.log(`Stripe event: ${JSON.stringify(stripeEvent)}`);
        const eventType = stripeEvent.type ? stripeEvent.type : '';
        console.log(`Event Type: ${eventType}`);
        switch (eventType) {
            case 'account.updated':
                console.log(`stripeEvent data  object: ${JSON.stringify(stripeEvent.data.object)}`);
                const {
                    id,
                    details_submitted
                } = stripeEvent.data.object;
                let stripeAccountStatus = "rejected";
                if (details_submitted) stripeAccountStatus = "details_submitted";
                const getCredentials = await docClient
                    .query({
                        TableName: API_BEATSTORE_USER_TABLE_NAME,
                        IndexName: "byStripeAccount",
                        KeyConditions: {
                            stripeAccount: {
                                ComparisonOperator: "EQ",
                                AttributeValueList: [id],
                            }
                        }
                    })
                    .promise();
                console.log(`User returned: ${JSON.stringify(getCredentials.Items)}`)

                const userUpdatedItem = {
                    TableName: API_BEATSTORE_USER_TABLE_NAME,
                    Key: {id: getCredentials.Items[0].id},
                    UpdateExpression: 'set #stripeAccountStatus = :stripeAccountStatus',
                    ExpressionAttributeNames: {
                        '#stripeAccountStatus': 'stripeAccountStatus'
                    },
                    ExpressionAttributeValues: {
                        ':stripeAccountStatus': stripeAccountStatus
                    }
                };
                await docClient.update(userUpdatedItem).promise();
                break;
            default:
                console.log('Unhandled event type');
                console.log(`stripeEvent data  object: ${stripeEvent.data.object}`);
                break;
        }
    } catch (e) {
        console.error('Error: ', e);
        response = `Error occurred: ${e}`;
    }
    return response;
};