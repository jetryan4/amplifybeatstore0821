import React, {useEffect, useState} from 'react'
import {Link, useParams} from "react-router-dom";
import {API, Storage} from "aws-amplify";
import {getOrder, getProduct} from "../api/queries";

const OrderDetails = () => {
    const {id} = useParams();
    const [order, setOrder] = useState([]);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [orderLoaded, setOrderLoaded] = useState(false);

    useEffect(() => {
        fetchOrder();
    }, [orderLoaded]);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            // Switch authMode to AMAZON_COGNITO_USER_POOLS for owner access
            const {data} = await API.graphql({
                query: getOrder, variables: {id: id}, authMode: "API_KEY"
            });
            let order = data.getOrder;
            setOrder(order);
            setOrderLoaded(true);
            await fetchProducts();
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            // Switch authMode to AMAZON_COGNITO_USER_POOLS for owner access
            const items = order.products.items;

            const productList = [];
            for (const item of items) {
                const productID = item.productID;
                const {data} = await API.graphql({
                    query: getProduct, variables: {id: productID}, authMode: "API_KEY"
                });
                const product = data.getProduct;
                productList.push(product);
            }
            setProducts(productList);
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const generateSignedUrl = async (e, originalFile) => {
        e.preventDefault();
        try {
            const s3ObjectArray = originalFile.split(",");
            const result = await Storage.get(s3ObjectArray[2], {
                level: s3ObjectArray[0], identityId: s3ObjectArray[1], expires: 3600 * 24, download: true
            });
            const fileName = s3ObjectArray[2].split("/")[1];
            downloadBlob(result.Body, fileName);
        } catch (err) {
            console.log(err);
        }
    };

    const downloadBlob = (blob, filename) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || 'download';
        const clickHandler = () => {
            setTimeout(() => {
                URL.revokeObjectURL(url);
                a.removeEventListener('click', clickHandler);
            }, 150);
        };
        a.addEventListener('click', clickHandler, false);
        a.click();
        return a;
    }

    return (<div className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
            <div className="flex justify-start item-start space-y-2 flex-col ">
                <h1 className="text-3xl lg:text-4xl font-semibold leading-7 lg:leading-9  text-gray-800">Order-
                    {order.chargeId}</h1>
                <p className="text-base font-medium leading-6 text-gray-600">{order.date}</p>
            </div>
            <div
                className="mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch  w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
                <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
                    <div
                        className="flex flex-col justify-start items-start bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
                        <p className="text-lg md:text-xl font-semibold leading-6 xl:leading-5 text-gray-800">Customer’s
                            Cart</p>

                        {/*Start iterating products*/}
                        {products.map((item) => (<div
                                className="mt-4 md:mt-6 flex  flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full ">
                                <div className="pb-4 md:pb-8 w-full md:w-40">

                                    <img className="w-full" src={item.coverPhoto}
                                         alt="dress"/>
                                </div>
                                <div
                                    className="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full  pb-8 space-y-4 md:space-y-0">
                                    <div className="w-full flex flex-col justify-start items-start space-y-8">
                                        <h3 className="text-xl xl:text-2xl font-semibold leading-6 text-gray-800">
                                            {item.title}</h3>
                                        <div className="flex justify-start items-start flex-col space-y-2">
                                            <p className="text-sm leading-none text-gray-800">
                                                <span className="text-gray-300">Description: </span> {item.description}
                                            </p>

                                        </div>
                                    </div>
                                    <div className="flex justify-between space-x-8 items-start w-full">
                                        <p className="text-base xl:text-lg leading-6">
                                            ${item.price}
                                        </p>
                                        <p className="text-base xl:text-lg leading-6 text-gray-800">1</p>
                                        <p className="text-base xl:text-lg font-semibold leading-6 text-gray-800">${(item.price)}</p>

                                    </div>

                                </div>
                                <div
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                    <button onClick={(e) => generateSignedUrl(e, item.originalFile)}>Download</button>
                                </div>
                            </div>))}
                        {/*    End Iterating products*/}


                    </div>
                    <div
                        className="flex justify-center md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
                        <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 space-y-6   ">
                            <h3 className="text-xl font-semibold leading-5 text-gray-800">Summary</h3>
                            <div
                                className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                                <div className="flex justify-between  w-full">
                                    <p className="text-base leading-4 text-gray-800">Subtotal</p>
                                    <p className="text-base leading-4 text-gray-600">${order.total}</p>
                                </div>
                                <div className="flex justify-between items-center w-full">
                                    <p className="text-base leading-4 text-gray-800">
                                        Discount
                                    </p>
                                    <p className="text-base leading-4 text-gray-600">- (0%)</p>
                                </div>

                            </div>
                            <div className="flex justify-between items-center w-full">
                                <p className="text-base font-semibold leading-4 text-gray-800">Total</p>
                                <p className="text-base font-semibold leading-4 text-gray-600">${order.total}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="bg-gray-50 w-full xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col ">
                    <h3 className="text-xl font-semibold leading-5 text-gray-800">Customer</h3>
                    <div
                        className="flex  flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0 ">
                        <div className="flex flex-col justify-start items-start flex-shrink-0">
                            <div
                                className="flex justify-center  w-full  md:justify-start items-center space-x-4 py-8 border-b border-gray-200">
                                <div>Customer ID</div>
                                <div className=" flex justify-start items-start flex-col space-y-2">
                                    <p className="text-base font-semibold leading-4 text-left text-gray-800">
                                        {order.owner}
                                    </p>

                                </div>
                            </div>

                            <div
                                className="flex justify-center  md:justify-start items-center space-x-4 py-4 border-b border-gray-200 w-full">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z"
                                        stroke="#1F2937" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M3 7L12 13L21 7" stroke="#1F2937" strokeLinecap="round"
                                          strokeLinejoin="round"/>
                                </svg>
                                <p className="cursor-pointer text-sm leading-5 text-gray-800">{order.email}</p>
                            </div>
                        </div>
                        <div className="flex justify-between xl:h-full  items-stretch w-full flex-col mt-6 md:mt-0">
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default OrderDetails
