import React, {useEffect, useState} from "react";
import Amplify, {API} from "aws-amplify";
import {getUser} from "../api/queries";

const ProfileContext = React.createContext({
    profile: {}, loading: false
});

const ProfileProvider = ({children}) => {
    const [profile, setProfile] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const user = await Amplify.Auth.currentAuthenticatedUser({});
        try {
            setLoading(true);
            const {data} = await API.graphql({
                query: getUser, variables: {id: user.username}, authMode: "AMAZON_COGNITO_USER_POOLS"
            });
            const profile = data.getUser;
            console.log(`profile: ${profile}`)
            setProfile(profile);
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    return (<ProfileContext.Provider value={{profile, loading}}>
        {children}
    </ProfileContext.Provider>);
};

export {ProfileContext, ProfileProvider};
