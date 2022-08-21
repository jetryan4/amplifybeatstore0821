import React, {useEffect, useState} from "react";
import {API} from "aws-amplify";
import {userByRole} from "../api/queries";

const UserContext = React.createContext();

const UserProvider = ({children}) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            // Switch authMode to API_KEY for public access
            const {data} = await API.graphql({
                query: userByRole, variables: {role: 'User'}, authMode: "API_KEY"
            });
            const users = data.userByRole.items;
            console.log(`users: ${users}`)
            setUsers(users);
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    return (<UserContext.Provider value={{users, loading}}>
            {children}
        </UserContext.Provider>);
};

export {UserContext, UserProvider};
