import React from 'react';
import ReactDOM from 'react-dom';
import {ProductProvider} from "./context/products";
import {ProducerProvider} from "./context/producers";
import {UserProvider} from "./context/users";
import CartProvider from './context/cart';
import CheckoutProvider from "./context/checkout";
import AuthProvider from "./context/auth";
import {ProfileProvider} from "./context/profile";

import App from './App';
import './index.css';
import CommonProvider from "./context/common";

ReactDOM.render(
    <AuthProvider>
        <CommonProvider>
            <ProfileProvider>
                <UserProvider>
                    <ProducerProvider>
                        <CartProvider>
                            <ProductProvider>
                                <CheckoutProvider>
                                    <React.StrictMode>
                                        <App/>
                                    </React.StrictMode>
                                </CheckoutProvider>
                            </ProductProvider>
                        </CartProvider>
                    </ProducerProvider>
                </UserProvider>
            </ProfileProvider>
        </CommonProvider>
    </AuthProvider>, document.getElementById('root'));
