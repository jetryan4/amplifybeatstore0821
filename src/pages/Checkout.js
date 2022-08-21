import React from 'react'
// Amplify
import Amplify from "aws-amplify";
import '@aws-amplify/ui-react/styles.css';

import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';
import CheckoutForm from "../components/CheckoutForm";

// Amplify Configurations
import awsExports from "../aws-exports";

Amplify.configure(awsExports);

const Checkout = () => {
    // TODO - public key needs to be updated
    const stripePromise = loadStripe('pk_test_51JyWt6E1PKsLl8ZQrrVZ68dr8P1dFrYRiXJEzY2Jy4SFareu0o363loaLfmWcriTGcAKU7CJhdr7dwToAS5DyYyZ00BDP6lFs7');
    const options = {
        appearance: {
            theme: 'stripe', variables: {
                colorPrimary: '#0570de',
                colorBackground: '#ffffff',
                colorText: '#30313d',
                colorDanger: '#df1b41',
                fontFamily: 'Ideal Sans, system-ui, sans-serif',
                spacingUnit: '2px',
                borderRadius: '4px', // See all possible variables below
            }
        }
    };

    return (<section className="checkout-wrapper">
            <Elements stripe={stripePromise} options={options}>
                <section>
                    <CheckoutForm/>
                </section>
            </Elements>
        </section>)
}

export default Checkout
