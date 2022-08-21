import React, {useEffect, useState} from "react";
import {API} from "aws-amplify";
import {userByRole} from "../api/queries";

const ProducerContext = React.createContext();

const ProducerProvider = ({children}) => {
    const [producers, setProducers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProducers();
    }, []);

    const fetchProducers = async () => {
        try {
            setLoading(true);
            // Switch authMode to API_KEY for public access
            const {data} = await API.graphql({
                query: userByRole, variables: {role: 'Producer'}, authMode: "API_KEY"
            });
            const producers = data.userByRole.items;
            console.log(`producers: ${producers}`)
            setProducers(producers);
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    return (<ProducerContext.Provider value={{producers, loading}}>
            {children}
        </ProducerContext.Provider>);
};

export {ProducerContext, ProducerProvider};
