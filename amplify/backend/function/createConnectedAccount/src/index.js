/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STRIPE_SECRET_KEY
Amplify Params - DO NOT EDIT */
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const ses = new AWS.SES({ region: process.env.REGION });
const USER_TABLE_NAME = process.env.USER_TABLE_NAME;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (payload) => {
    console.log(payload);
    const {userId, email} = payload.arguments.input;
    console.log(userId);
    console.log(email);
    try {
        const account = await stripe.accounts.create({type: 'express'});
        console.log(account);
        const userUpdatedItem = {
            TableName:USER_TABLE_NAME,
            Key: {id: userId},
            UpdateExpression: 'set #stripeAccount = :stripeAccount, #stripeAccountStatus = :stripeAccountStatus',
            ExpressionAttributeNames: {
                '#stripeAccount': 'stripeAccount',
                '#stripeAccountStatus': 'stripeAccountStatus'
            },
            ExpressionAttributeValues: {
                ':stripeAccount': account.id,
                ':stripeAccountStatus': 'account_onboarding'
            }
        };
        console.log(userUpdatedItem);
        await docClient.update(userUpdatedItem).promise();
        const accountLink = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: process.env.STRIPE_ACCOUNT_REFRESH_URL,
            return_url: process.env.STRIPE_ACCOUNT_RETURN_URL,
            type: 'account_onboarding',
        });
        console.log(accountLink);
        await sendEmail(email, userId, accountLink.url);
        return "SUCCESS";
    } catch (err) {
        throw new Error(err);
    }
};

const sendEmail = async (email, userId, url) => {
    const title = `Congratulations! You have been promoted.`;
    const text1 = `You have been promoted as a Producer. Please associate/create your stripe account using the link bellow in order to earn from your product sales.`;
    let text2 = `If the link has been expired, please contact us in order to provide you a new link`;

    const textBody = `Hello,\n${text1}\n${url}\n${text2}`;

    const htmlBody = `<html>
                      <div>
                        <div ${bodyStyle}>
                            <p>Hello,</p>
                            <p>${text1}</p>
                            ${url}
                            <p>${text2}</p>
                        </div>
                        <div>
                            ${footer}
                        </div>
                      </div>
                   </html>`;

    const params = {
        Destination: {
            ToAddresses: [email],
        },
        Message: {
            Body: {
                Text: {
                    Charset: 'UTF-8',
                    Data: textBody || '',
                },
                Html: {
                    Charset: 'UTF-8',
                    Data: htmlBody || '',
                },
            },
            Subject: {
                Charset: 'UTF-8',
                Data: title,
            },
        },
        Source: 'kokila@qriomatrix.com',
    };

    const data = await ses.sendEmail(params).promise();
    console.log(`data: ${JSON.stringify(data)}`)
    return data.MessageId;
};

const footer = `
<div style="left: 0px; display: flex; flex-direction: column; background-color: white; align-items: center; justify-content: center; margin-top: 30px">
    <div style="height: 50px; width: 800px; display: flex; flex-direction: column; background-color: rgb(35, 45, 97); align-items: center; justify-content: center;">
        <div style="color: white; font-size: 12px;">© 2022 Rankine Records - All Rights Reserved</div>
    </div>
</div>
`;
const bodyStyle = `style="margin-top: 15px; margin-right: 15px; font-size: 18px; color: rgb(86, 95, 143); text-align: left;"`;
