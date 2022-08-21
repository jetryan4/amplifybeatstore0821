import React, {useEffect, useState} from "react";
import {API} from "aws-amplify";
import {getProduct} from "../api/queries";

const ProductDetailContext = React.createContext();

const ProductDetailProvider = ({children}) => {
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProduct();
    }, []);

    // const checkout = async (orderDetails) => {
    //   const payload = {
    //     id: uuidv4(),
    //     ...orderDetails
    //   };
    //   try {
    //     await API.graphql(graphqlOperation(processOrder, { input: payload }));
    //     console.log("Order is successful");
    //   } catch (err) {
    //     console.log(err);
    //   }
    // };

    const fetchProduct = async () => {
        try {
            setLoading(true);
            // Switch authMode to API_KEY for public access
            const {data} = await API.graphql({
                query: getProduct, authMode: "AMAZON_COGNITO_USER_POOLS"
            });
            const product = data.getProduct;
            setProduct(product);
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    return (<ProductDetailContext.Provider value={{product, loading}}>
            {children}
        </ProductDetailContext.Provider>);
};

export {ProductDetailContext, ProductDetailProvider};
