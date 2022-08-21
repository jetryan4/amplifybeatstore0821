import React, {useContext} from 'react'
import {useNavigate} from "react-router-dom";
import {ProductContext} from '../context/products';
import PageMessage from "../components/PageMessage";
import Loader from "../components/Loader";


const Products = () => {
    const {products, loading} = useContext(ProductContext);
    const navigate = useNavigate();

    return (
        <>
            {loading ?
                <Loader loading={loading}/> :
                products.length ?
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
                    </div> :
                    <PageMessage subMessage="No products found"/>
            }
        </>
        )
}

export default Products
