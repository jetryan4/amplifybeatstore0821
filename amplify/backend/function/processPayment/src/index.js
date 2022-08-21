const { CognitoIdentityServiceProvider } = require("aws-sdk");
const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();
const USER_POOL_ID = process.env.USER_POOL_ID;
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const AWS = require("aws-sdk");
const documentClient = new AWS.DynamoDB.DocumentClient();

const PRODUCT_TABLE = process.env.API_BEATSTORE_PRODUCT_TABLE_NAME;
const USER_TABLE = process.env.API_BEATSTORE_USER_TABLE_NAME;

/*
 * Get the total price of the order
 * Charge the customer
 */
exports.handler = async (event) => {
    let chargeStatus = "succeeded";
    let {id, cart, total, userId, email} = event.arguments.input;
    let updatedCartItems = [];
    try {
        for (let cartItem of cart) {
            console.log(cartItem);
            // Get product
            const productParams = {
                TableName: PRODUCT_TABLE,
                Key: {
                    id: cartItem.id
                }
            };
            const productItem = await documentClient.get(productParams).promise();
            const product = productItem.Item;
            console.log(product);
            // Get producer
            const producerParams = {
                TableName: USER_TABLE,
                Key: {
                    id: product.owner
                }
            };
            const producerItem = await documentClient.get(producerParams).promise();
            const producer = producerItem.Item;
            console.log(producer);
            // Create charge
            let chargeItem = {
                amount: cartItem.price * cartItem.amount * 100,
                currency: "usd",
                source: cartItem.token,
                description: `Order ${new Date()} ${email}`

            };
            if (producer.stripeAccount) {
                chargeItem = {
                    ...chargeItem,
                    transfer_data: {
                        amount: cartItem.price * cartItem.amount * producer.stripeSplitPercentage,
                        destination: producer.stripeAccount
                    }
                }
            }
            const chargeResponse = await stripe.charges.create(chargeItem);
            console.log(JSON.stringify(chargeResponse));
            cartItem = {
                ...cartItem,
                chargeId: chargeResponse.id,
                chargeStatus: chargeResponse.status,
                chargeDate: chargeResponse.created
            }
            console.log(cartItem);
            updatedCartItems.push(cartItem);
        }
    } catch (err) {
        chargeStatus = "failed";
        console.log(err);
        //throw new Error(err);
    }
    return {id, cart: updatedCartItems, total, userId, email, chargeStatus};
};