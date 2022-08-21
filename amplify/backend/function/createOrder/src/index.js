const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");
const documentClient = new AWS.DynamoDB.DocumentClient();
const ses = new AWS.SES({ region: process.env.REGION });
const s3 = new AWS.S3({region: process.env.REGION});

const ORDER_TABLE = process.env.API_BEATSTORE_ORDER_TABLE_NAME;
const ORDER_TYPE = "Order";
const PRODUCT_ORDER_TABLE = process.env.API_BEATSTORE_PRODUCT_ORDER_TABLE_NAME;
const PRODUCT_TABLE = process.env.API_BEATSTORE_PRODUCT_TABLE_NAME;
const PRODUCT_ORDER_TYPE = "ProductOrder";

const createOrder = async (payload) => {
    const {id, userId, email, total} = payload;
    const params = {
        TableName: ORDER_TABLE,
        Item: {
            __typename: ORDER_TYPE,
            id: id,
            email: email,
            owner: userId,
            chargeId: uuidv4(),
            date: new Date().toISOString(),
            total: total,
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString()
        }
    };
    console.log(params);
    await documentClient.put(params).promise();
};

const createProductOrder = async (payload) => {
    let productOrders = [];
    for (i = 0; i < payload.cart.length; i++) {
        const cartItem = payload.cart[i];
        console.log(cartItem);
        productOrders.push({
            PutRequest: {
                Item: {
                    __typename: PRODUCT_ORDER_TYPE,
                    id: uuidv4(),
                    productID: cartItem.id,
                    orderID: payload.id,
                    chargeId: cartItem.chargeId,
                    chargeStatus: cartItem.chargeStatus,
                    chargeDate: new Date(cartItem.chargeDate * 1000).toISOString(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            }
        });
    }
    let params = {
        RequestItems: {}
    };
    params["RequestItems"][PRODUCT_ORDER_TABLE] = productOrders;
    console.log(params);
    await documentClient.batchWrite(params).promise();
};

/*
 * Get order details from processPayment lambda
 * Create an order
 * Link products to the order - Users can see the past orders and admins can view orders by user
 * Email the invoice (Will be added later)
 */
exports.handler = async (event) => {
    try {
        let payload = event.prev.result;
        console.log(payload);
        if (payload.chargeStatus === "succeeded") {
            // create a new order
            await createOrder(payload);
            // links products with the order
            await createProductOrder(payload);
            // Send download link via email
            await sendEmail(payload.email, payload.userId, payload.cart);
            return "SUCCESS";
        }
        return "FAILED";
    } catch (err) {
        console.log(err);
        return new Error(err);
    }
};

const sendEmail = async (email, userId, cart) => {
    // Get download links
    let downloadLinks = [];
    let downloadLinksHtml = ``;
    cart.forEach( item => {
        downloadLinks.push(item.signedUrl);
        downloadLinksHtml = downloadLinksHtml.concat(`<li><a href=${item.signedUrl}>${item.title}</a></li>`)
    })

    const title = `Your Beat Is Ready to Download!`;
    const text1 = `Your purchase has been successful. Please download your purchased item using the link bellow.`;
    let text2 = `If the link has been expired, you can always generate a new download link by going to the orders page at any time.`;
    if (userId) {
        text2 = `If the link has been expired, please contact us in order to provide you a new download link`;
    }

    const textBody = `Hello,\n${text1}\n${downloadLinks.join('\r\n')}\n${text2}`;

    const htmlBody = `<html>
                      <div>
                        <div ${bodyStyle}>
                            <p>Hello,</p>
                            <p>${text1}</p>
                            ${downloadLinksHtml}
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
