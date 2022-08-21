import React, {useContext, useEffect, useState} from 'react'
import {useNavigate, useParams} from "react-router-dom";
import PageMessage from "../components/PageMessage";
import Loader from "../components/Loader";
import {API} from "aws-amplify";
import {getUser, productByOwner} from "../api/queries";
import {ProducerContext} from "../context/producers";


const Products = () => {
    const {id} = useParams();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState({});
    const navigate = useNavigate();


    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const {data} = await API.graphql({
                query: productByOwner, variables: {owner: id, filter: {deleted: {eq: false}}}, authMode: "AMAZON_COGNITO_USER_POOLS"
            });
            const products = data.productByOwner.items;
            setProducts(products);
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchUser = async () => {
        try {
            setLoading(true);
            const {data} = await API.graphql({
                query: getUser, variables: {id: id}, authMode: "AMAZON_COGNITO_USER_POOLS"
            });
            const user = data.getUser;
            setUser(user);
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            {loading ?
                <Loader loading={loading}/> :
                products.length ?
                    <>
                        <div
                            className=" mx-auto mt-8 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
                            <div className="flex flex-col items-center pb-10 mt-8">
                                <img className="mb-3 w-24 h-24 rounded-full shadow-lg"
                                     src={user.picture} alt="Bonnie image"/>
                                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{`${user.firstName} ${user.lastName}`}</h5>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{user.country}</span>

                            </div>
                        </div>
                        <div className="bg-white">
                            <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">

                                <div
                                    className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                                    {products.map((product) => (<div onClick={() => {
                                        navigate(`/products/${product.id}`)
                                    }}>
                                        <div key={product.id} className="group relative">
                                            <div
                                                className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                                                <img
                                                    src={product.coverPhoto}
                                                    alt={product.title}
                                                    className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                                                />
                                            </div>
                                            <div className="mt-4 flex justify-between">
                                                <div>
                                                    <h3 className="text-sm text-gray-700">
                                                        {/*<a href={product.href}>
                                            <span aria-hidden="true" className="absolute inset-0" />
                                            {product.title}
                                        </a>*/}
                                                        <div to={`${product.id}`}
                                                             className="text-sm text-gray-700">details
                                                        </div>
                                                        &nbsp; <b>{product.title}</b>
                                                    </h3>
                                                    <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                                                </div>
                                                <p className="text-sm font-medium text-gray-900">${product.price}</p>
                                            </div>
                                        </div>
                                    </div>))}
                                </div>
                            </div>
                        </div>
                    </>
                     :
                    <PageMessage subMessage="No products found"/>
            }
        </>
        )
}

export default Products
