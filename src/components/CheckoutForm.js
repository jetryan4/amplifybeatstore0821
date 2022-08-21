import React, {useContext, useEffect, useState} from "react";
import {CardElement, useElements, useStripe} from "@stripe/react-stripe-js";
import {CartDispatchContext, CartStateContext, clearCart} from "../context/cart";
import {checkout, CheckoutDispatchContext, CheckoutStateContext} from "../context/checkout";
import {AuthStateContext} from "../context/auth";

import PageMessage from "./PageMessage";
import Loader from "./Loader";

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            color: "#32325d",
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: "anti-aliased",
            fontSize: "16px",
            "::placeholder": {
                color: "#aab7c4"
            }
        }, invalid: {
            color: "#fa755a", iconColor: "#fa755a"
        }
    }
};

const CheckoutForm = () => {
    const {user} = useContext(AuthStateContext);
    const {items} = useContext(CartStateContext);
    const {status} = useContext(CheckoutStateContext);
    const checkoutDispatch = useContext(CheckoutDispatchContext);
    const cartDispatch = useContext(CartDispatchContext);
    let total = 0;
    const cart = items.map((item) => {
        total = total + item.price;
        return {
            id: item.id,
            title: item.title,
            image: item.coverPhoto,
            price: item.price,
            amount: item.quantity,
            signedUrl: item.signedUrl
        }
    });
    const [orderDetails, setOrderDetails] = useState({cart, total, address: null, token: null});
    const [error, setError] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(false);
    const [emailError, setEmailError] = useState(null);
    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        if (orderDetails.token) {
            processCheckout(orderDetails);
            clearCart(cartDispatch);
        }
    }, [orderDetails]);

    const processCheckout = async (orderDetails) => {
        await checkout(checkoutDispatch, user.id, orderDetails);
    }

    // Handle real-time validation errors from the card Element.
    const handleChange = (event) => {
        if (event.error) {
            setError(event.error.message);
        } else {
            setError(null);
        }
    };

    const validateEmail = (event) => {
        const confirmEmail = document.getElementById("confirm-email").value;
        const email = document.getElementById("checkout-address").value;

        if (confirmEmail != email) {
            setEmailError("Email does not match.");
        } else {
            setEmailError("");
        }
    }

    // Handle form submission.
    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(orderDetails);

        if (document.getElementById("confirm-email").value == "") {
            setEmailError("Please enter email");
        }

        if (!emailError) {
            let updatedCartItems = [];
            for (let cartItem of orderDetails.cart) {
                const card = elements.getElement(CardElement);
                const result = await stripe.createToken(card);

                if (result.error) {
                    // Inform the user if there was an error.
                    setError(result.error.message);
                } else {
                    setError(null);
                    // Send the token to your server.
                    const token = result.token;
                    cartItem = {...cartItem, token: token.id}
                    updatedCartItems.push(cartItem);
                    setPaymentStatus(true);
                }
            }
            if (paymentStatus) {
                orderDetails.cart = updatedCartItems;
                setOrderDetails({...orderDetails, token: orderDetails.cart[0].token});
                console.log(orderDetails);
            }
        }
    };

    return (
        <>
            {
                {
                    'not-started':
                        <div className="border-t border-gray-200 mt-8 ">
                            <div>
                                <label
                                    className="block text-2xl font-medium text-gray-700 flex items-center justify-center ">Time
                                    to
                                    Checkout</label>
                            </div>

                            <form onSubmit={handleSubmit} className="mt-8   ">
                                <div className="col-span-6 sm:col-span-3">
                                    <div className=" px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <label htmlFor="checkout-address"
                                               className="block text-sm font-medium text-gray-700">Email</label>
                                        <input id="checkout-address" type="text" onChange={(e) => setOrderDetails({
                                            ...orderDetails,
                                            email: e.target.value
                                        })} onChange={(e) => validateEmail(e)}/>

                                        <div className="text-red-600" role="alert"> {emailError}</div>

                                    </div>

                                    <div className=" px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <label htmlFor="checkout-address"
                                               className="block text-sm font-medium text-gray-700">Confirm
                                            Email</label>

                                        <input id="confirm-email" type="text" onChange={(e) => validateEmail(e)}/>
                                        <div className="text-red-600" role="alert"> {emailError}</div>
                                    </div>
                                    <div className=" px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 mt-8">
                                        <label htmlFor="stripe-element"
                                               className="block text-sm font-medium text-gray-700"> Credit or debit
                                            card </label>

                                        <div style={{border: '1px solid gray '}}>
                                            <CardElement id="stripe-element" options={CARD_ELEMENT_OPTIONS}
                                                         onChange={handleChange}/>
                                        </div>
                                        <div className="py-2 text-red-600" role="alert"> {error}</div>

                                    </div>


                                    <div className="px-4 py-3  text-center sm:px-6 mt-16 ">
                                        <button type="submit"
                                                className="inline-flex flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                            Submit Payment
                                        </button>
                                    </div>
                                </div>
                            </form>

                        </div>,
                    'processing': <Loader/>,
                    'success':
                        <PageMessage errorCode="SUCCESS" mainMessage="Thank You!."
                                     subMessage="We’ve confirmed your payment."
                                     messageDescription="You can find more details by visiting."/>,
                    'failed':
                        <PageMessage errorCode="FAILED" mainMessage="Sorry!."
                                     subMessage="There is a problem with your payment."
                                     messageDescription="You can find more details by visiting."/>
                }[status]
            }
        </>
    );
};

export default CheckoutForm;
