import React, {useEffect, useState} from "react";
import {withAuthenticator} from '@aws-amplify/ui-react';
import {Routes, Route} from "react-router-dom";
import Producers from "./Producers";
import SideBar from "../components/SideBar";
import Error from "./Error";
import Users from "./Users";
import MyBeats from "./MyBeats";
import ProductDetails from "./ProductDetails";
import Amplify from "aws-amplify";
import {customAuthComponent} from "../components/CustomAuthComponent";


const Dashboard = () => {

    const [userGroups, setUserGroups] = useState([null]);
    useEffect(() => {
        getUserGroups();
    }, [userGroups]);

    const getUserGroups = async () => {
        const loggedInUser = await Amplify.Auth.currentAuthenticatedUser({});
        const groups = loggedInUser?.signInUserSession?.accessToken?.payload['cognito:groups'];
        setUserGroups(groups);
    };

    return (<div  className="grid grid-cols-12 ">
        <div className="col-span-1">
            <SideBar userGroups={userGroups}/>
        </div >
        <div className="col-span-11 ">
            <Routes>
                <Route path='/' element={<MyBeats/>}/>
                <Route path='/beats' element={<MyBeats/>}/>
                <Route path='/beats/:id' element={<ProductDetails isDashboard={true}/>}/>
                {(userGroups && userGroups.includes('Admin')) && <>
                    <Route path='/producers' element={<Producers/>}/>
                    <Route path='/users' element={<Users/>}/>
                    <Route path='*' element={<Error/>}/>
                </>}
            </Routes>
        </div>


        </div>);
}

export default withAuthenticator(Dashboard, customAuthComponent);
