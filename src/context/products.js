import React, {useContext, useEffect, useState} from "react";
import {API, graphqlOperation} from "aws-amplify";
import {v4 as uuidv4} from "uuid";
import {listProducts, getUser} from "../api/queries";
import {processOrder} from "../api/mutations";
import {ProfileContext} from "./profile";

const ProductContext = React.createContext();

const ProductProvider = ({children}) => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            // Switch authMode to API_KEY for public access
            const {data} = await API.graphql({
                query: listProducts,
                variables: {filter: {deleted: {eq: false}}},
                authMode: "API_KEY"
            });
            const products = data.listProducts.items;
            setProducts(products);
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <ProductContext.Provider value={{products, loading}}>
            {children}
        </ProductContext.Provider>
    );
};

export {ProductContext, ProductProvider};
