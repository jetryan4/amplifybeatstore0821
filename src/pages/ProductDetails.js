import React, {useContext, useEffect} from "react";
import {useParams} from "react-router-dom";
import {CartDispatchContext, addToCart} from "../context/cart";
import {getProduct} from "../api/queries";

import {useState} from 'react'
import {API, Storage} from "aws-amplify";
import AudioWave from "../components/AudioWave";

const ProductDetails = (props) => {
    const {id} = useParams();
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        fetchProduct();
    }, []);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            // Switch authMode to API_KEY for public access
            const {data} = await API.graphql({
                query: getProduct, authMode: "API_KEY", variables: {id}
            });
            const product = data.getProduct;
            setProduct(product);
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    // const { products } = useContext(ProductDetailContext());

    const [isAdded, setIsAdded] = useState(false);
    const dispatch = useContext(CartDispatchContext);

    const handleAddToCart = () => {
        generateSignedUrl(product.originalFile).then(data => {
            //const cartItems = [...cart, { id, title, image, price, signedUrl:data, amount: 1 }];
            //setCart(cartItems);
            const item = {...product, signedUrl: data, quantity: 1};
            addToCart(dispatch, item);
            setIsAdded(true);
            setTimeout(() => {
                setIsAdded(false);
            }, 3500);
        }).catch(err => console.log(err));

    };

    const generateSignedUrl = async (originalFile) => {
        try {
            const s3ObjectArray = originalFile.split(",");
            const url = await Storage.get(s3ObjectArray[2], {
                level: s3ObjectArray[0], identityId: s3ObjectArray[1], expires: 3600 * 24
            });
            return url;
        } catch (err) {
            console.log(err);
        }
    };

    // const { image: url, title, description, author, price } = product;

    return (

        <div className="bg-white">
            <div className="pt-6">
                <nav aria-label="product">
                    <ol role="list"
                        className="max-w-2xl mx-auto px-4 flex items-center space-x-2 sm:px-6 lg:max-w-7xl lg:px-8">
                        <li key={product.id}>
                            <div className="flex items-center">
                                <a href={product.href} className="mr-2 text-sm font-medium text-gray-900">
                                    {product.name}
                                </a>
                                <svg
                                    width={16}
                                    height={20}
                                    viewBox="0 0 16 20"
                                    fill="currentColor"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                    className="w-4 h-5 text-gray-300"
                                >
                                    <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z"/>
                                </svg>
                            </div>
                        </li>
                        <li className="text-sm">
                            <a href={product.href} aria-current="page"
                               className="font-medium text-gray-500 hover:text-gray-600">
                                {product.name}
                            </a>
                        </li>
                    </ol>
                </nav>

                {/* Image gallery */}
                <div className="mt-6 max-w-2xl mx-auto sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-3 lg:gap-x-8">
                    <div className="hidden aspect-w-3 aspect-h-4 rounded-lg overflow-hidden lg:block">
                        <img
                            src={product.coverPhoto}
                            alt={product.title}
                            className="w-full h-full object-center object-cover"
                        />
                    </div>
                    <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
                        <div className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden">

                        </div>
                        <div className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden">
                            <AudioWave audio={product.sampleAudio}/>
                        </div>
                    </div>
                </div>

                {/* Product info */}
                <div
                    className="max-w-2xl mx-auto pt-10 pb-16 px-4 sm:px-6 lg:max-w-7xl lg:pt-16 lg:pb-24 lg:px-8 lg:grid lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8">
                    <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">{product.title}</h1>
                    </div>

                    {/* Options */}
                    <div className="mt-4 lg:mt-0 lg:row-span-3">
                        <h2 className="sr-only">Product information</h2>
                        <p className="text-3xl text-gray-900">${product.price}</p>

                    </div>

                    <div className="py-10 lg:pt-6 lg:pb-16 lg:col-start-1 lg:col-span-2 lg:pr-8">
                        {/* Description and details */}
                        <div>
                            <h3 className="sr-only">Description</h3>

                            <div className="space-y-6">
                                <p className="text-base text-gray-900">{product.description}</p>
                            </div>
                        </div>

                        <div className="mt-10">
                            <h2 className="text-sm font-medium text-gray-900">Details</h2>

                            <div className="mt-4 space-y-6">
                                <p className="text-sm text-gray-600">{product.details}</p>
                            </div>
                        </div>

                        {!props.isDashboard ? <div className="mt-10">
                            <h2 className="text-sm font-medium text-gray-900">
                                <button
                                    className="inline-flex flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-700 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    type="button"
                                    onClick={handleAddToCart}
                                >
                                    Add To Cart
                                </button>
                            </h2>
                        </div> : null}
                    </div>
                </div>
            </div>
        </div>);
};

export default ProductDetails;
