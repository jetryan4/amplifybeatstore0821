import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
// Amplify
import Amplify from "aws-amplify";
import {Authenticator} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

// Pages
import Home from "./pages/Home"
import Error from "./pages/Error";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ProductDetails from "./pages/ProductDetails";
import Admin from './pages/Admin';
import UserProfile from './pages/UserProfile'
import AddProduct from './pages/AddProducts'
// Components
import Header from "./components/Header"
// Amplify Configurations
import awsExports from "./aws-exports";
import Dashboard from "./pages/Dashboard";
import About from "./pages/AboutUs";
import Roster from "./pages/Roster";
import MyBeats from "./pages/MyBeats";
import OrderDetails from "./pages/OrderDetails";
import Orders from "./pages/Orders";
import PaymentStatus from "./pages/PaymentStatus";
import ProducerDetails from "./pages/ProducerDetails";
import UserPolicies from "./pages/UserPolicies";

Amplify.configure(awsExports);

const App = () => {

    return (
        <BrowserRouter>
            <Header/>
            <Routes>
                {/*UnProtected Routes*/}
                <Route path='/' element={<Home/>}/>
                <Route path='/roster' element={<Roster/>}/>
                <Route path='/roster/:id' element={<ProducerDetails/>}/>
                <Route path='/products/:id' element={<ProductDetails isDashboard={false}/>}/>
                <Route path='/products' element={<Products/>}/>
                <Route path='/about' element={<About/>}/>
                <Route path='/policies' element={<UserPolicies/>}/>
                <Route path='/cart' element={<Cart/>}/>
                <Route path='/checkout' element={<Checkout/>}/>
                <Route path='*' element={<Error/>}/>
                <Route path='/payment/status' element={<PaymentStatus/>}/>
                {/*<Route path='/dashboard/products/:id' element={<ProductDetails/>} />*/}

                {/*Protected Routes*/}
                <Route path='/dashboard/*' element={<Dashboard/>}/>
                <Route path='/beats/:id' element={<MyBeats/>}/>
                <Route path='/profile' element={<UserProfile/>}/>
                <Route path='/orders' element={<Orders/>}/>
                <Route path='/orders/:id' element={<OrderDetails/>}/>
                <Route path='/admin' element={<Admin/>}/>
            </Routes>
        </BrowserRouter>);
}

export default App;
