import React, {useContext, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {createProduct, updateProduct} from "../api/mutations";
import config from "../aws-exports";
import Amplify, {API, Auth, Storage} from "aws-amplify";
import {v4 as uuidv4} from 'uuid';
import {getUser, listProducts, productByOwner} from "../api/queries";
import {deleteProduct} from "../api/mutations";
import {useForm} from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from "yup";
import NotificationMessage from "../components/NotificationMessage";
import {AuthStateContext} from "../context/auth";
import Loader from "../components/Loader";
import PageMessage from "../components/PageMessage";

import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import {ProducerContext} from "../context/producers";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const {
    aws_user_files_s3_bucket_region: region, aws_user_files_s3_bucket: bucket
} = config

const Schema = yup.object({
    title: yup.string(),
    description: yup.string(),
    price: yup.string(),
    originalFile: yup.mixed(),
    sampleAudio: yup.mixed(),
    coverPhoto: yup.mixed(),

}).required();


const MyBeats = () => {


    const {register, handleSubmit, reset, formState: {errors}} = useForm({resolver: yupResolver(Schema)});

    const [showModal, setShowModal] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [image, setImage] = useState(null);
    const [picture, setPicture] = useState(null);

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const {user} = useContext(AuthStateContext);
    const {producers} = useContext(ProducerContext);
    const [selected, setSelected] = useState({})

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            if (user.role === 'Admin') {
                const {data} = await API.graphql({
                    query: listProducts,
                    variables: {filter: {deleted: {eq: false}}},
                    authMode: "AMAZON_COGNITO_USER_POOLS"
                });
                const products = data.listProducts.items;
                setProducts(products);
            } else {
                const {data} = await API.graphql({
                    query: productByOwner, variables: {owner: user.id, filter: {deleted: {eq: false}}}, authMode: "AMAZON_COGNITO_USER_POOLS"
                });
                const products = data.productByOwner.items;
                setProducts(products);
            }
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteBeat = async (e, productId) => {
        e.preventDefault();
        try {
            await API.graphql({
                query: updateProduct,
                variables: {input: {id: productId, deleted: true}},
                authMode: "AMAZON_COGNITO_USER_POOLS"
            });
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    };

    const onBeatSave = async (productDetails) => {
        console.log("Product details: ", productDetails);
        try {
            // Check if user has a connected account before allowing to save the beat
            const user = await Amplify.Auth.currentAuthenticatedUser({});
            const {data} = await API.graphql({
                query: getUser, variables: {id: user.attributes.sub}, authMode: "AMAZON_COGNITO_USER_POOLS"
            });
            const userDetails = data.getUser;
            console.log(userDetails);
            if (!userDetails.stripeAccount || userDetails.stripeAccountStatus !== 'details_submitted') {
                alert("You need to create a stripe account before adding beats. Please use the link sent to your email address in order to create the account. If you did not receive the email, please contact the Admin.");
                return
            }
            // Save cover photo
            setLoading(true);
            setShowModal(false);
            const coverPhotoUrl = await handleFileUpload(picture, 'covers', 'public')
            // Save sample file
            const sampleAudioUrl = await handleFileUpload(productDetails.sampleAudio[0], 'samples', 'public')
            // Save original file
            const originalFileUrl = await handleFileUpload(productDetails.originalFile[0], 'beats', 'protected')
            if (!productDetails.title || !productDetails.price) return
            productDetails = {
                ...productDetails,
                price: parseFloat(productDetails.price),
                owner: user.attributes.sub,
                coverPhoto: coverPhotoUrl,
                sampleAudio: sampleAudioUrl,
                originalFile: originalFileUrl,
            }
            await API.graphql({
                query: createProduct, variables: {input: productDetails}, authMode: "AMAZON_COGNITO_USER_POOLS"
            });
            reset();
            window.location.reload();
            setShowNotification(true);
            setLoading(false);
        } catch (err) {
            console.log('error creating product:', err)
        }
    }

    const onChangePicture = async (e) => {
        if (e.target.files[0]) {
            console.log("picture: ", e.target.files);
            setPicture(e.target.files[0]);
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setImage(reader.result);
            });
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    const handleFileUpload = async (file, fileType, accessLevel) => {
        const credentials = await Auth.currentUserCredentials();
        const extension = file.name.split(".")[1];
        const name = file.name.split(".")[0];
        const key = `${fileType}/${uuidv4()}${name}.${extension}`;
        try {
            // Upload the file to s3 with public access level.
            await Storage.put(key, file, {
                level: accessLevel, contentType: file.type
            });
            let url = `https://${bucket}.s3.${region}.amazonaws.com/${accessLevel}/${key}`;
            if (accessLevel === 'protected' || accessLevel === 'private') url = `${accessLevel},${credentials.identityId},${key}`;
            return url;
        } catch (err) {
            console.log(err);
        }
    }

    const onSelectProducer = async (event) => {
        setSelected(event);
        const {data} = await API.graphql({
            query: listProducts, variables: {filter: {owner: {eq: event.id}}}, authMode: "AMAZON_COGNITO_USER_POOLS"
        });
        const products = data.listProducts.items;
        setProducts(products);
    }

    return (
        <>
            <div className="sm:flex float-right space-x-2 mt-4 pr-16 ">
                {/*producers dropdown start*/}
                {user.role === 'Admin' ?
                    <Listbox value={selected} onChange={event => onSelectProducer(event)}>
                        {({open}) => (
                            <>

                                <div className="mt-1 relative ">
                                    <Listbox.Button
                                        className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                          <span className="flex items-center">
                            <img src={selected.picture} alt="" className="flex-shrink-0 h-6 w-6 rounded-full"/>
                            <span className="ml-3 block truncate">{`${selected.firstName} ${selected.lastName}`}</span>
                          </span>
                                        <span
                                            className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
              </span>
                                    </Listbox.Button>

                                    <Transition
                                        show={open}
                                        as={Fragment}
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <Listbox.Options
                                            className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                            {producers.map((person) => (
                                                <Listbox.Option
                                                    key={person.id}
                                                    className={({active}) =>
                                                        classNames(
                                                            active ? 'text-white bg-indigo-600' : 'text-gray-900',
                                                            'cursor-default select-none relative py-2 pl-3 pr-9'
                                                        )
                                                    }
                                                    value={person}
                                                >
                                                    {({selected, active}) => (
                                                        <>
                                                            <div className="flex items-center">
                                                                <img src={person.picture} alt=""
                                                                     className="flex-shrink-0 h-6 w-6 rounded-full"/>
                                                                <span
                                                                    className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                                                                >
                            {`${person.firstName} ${person.lastName}`}
                          </span>
                                                            </div>

                                                            {selected ? (
                                                                <span
                                                                    className={classNames(
                                                                        active ? 'text-white' : 'text-indigo-600',
                                                                        'absolute inset-y-0 right-0 flex items-center pr-4'
                                                                    )}
                                                                >
                            <CheckIcon className="h-5 w-5" aria-hidden="true"/>
                          </span>
                                                            ) : null}
                                                        </>
                                                    )}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Listbox>
                    : null
                }
                {/*producers dropdown end*/}

                <button onClick={() => setShowModal(true)}
                        className="mt-4 sm:mt-0 inline-flex items-start justify-start px-6 py-3 bg-indigo-700 hover:bg-indigo-600 focus:outline-none rounded">
                    <p className="text-sm font-medium leading-none text-white">Add Beat</p>
                </button>
            </div>
            {loading && <Loader loading={loading}/>}

            <div className="  py-10  px-6 mt-16 ">


                {products.length && !loading ?
                    <div className="-my-2  sm:-mx-4 lg:-mx-4 sm:mx-auto  ">
                        <div
                            className="mt-8 grid  gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-16 md:grid-cols-3 md:ml-12 sm:ml-16">
                            {products.map((product) => (<div>
                                <div onClick={() => {
                                    navigate(`/dashboard/beats/${product.id}`)
                                }}>
                                    <div key={product.id} className="group relative">
                                        <div
                                            className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md  group-hover:opacity-75 lg:h-80 lg:aspect-none">
                                            <img
                                                src={product.coverPhoto}
                                                alt={product.title}
                                                className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                                            />
                                        </div>
                                        <div className="mt-4 flex justify-between">
                                            <div>
                                                <h3 className="text-sm text-gray-700">
                                                    <a href={product.href}>
                                                        <span aria-hidden="true" className="absolute inset-0"/>
                                                        {product.title}
                                                    </a>
                                                </h3>
                                                {/*<p className="mt-1 text-sm text-gray-500">{product.description}</p>*/}
                                            </div>
                                            <p className="text-sm font-medium text-gray-900">${product.price}</p>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                    <button onClick={(e) => deleteBeat(e, product.id)}>Delete</button>
                                </div>
                            </div>))}
                        </div>
                    </div> :
                    <PageMessage mainMessage="Ohh!" subMessage="Please add your products"
                                 onClick={() => setShowModal(true)}/>
                }

                {showModal ? (<>
                    {/*<div className="w-full h-full bg-black bg-opacity-90 top-0 overflow-y-auto overflow-x-hidden fixed sticky-0" id="chec-div">*/}
                    <div
                        className="w-full h-full bg-black bg-opacity-90 top-0 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed sticky-0 inset-0 z-40 outline-none focus:outline-none">
                        <div className="md:grid md:grid-cols-3 md:gap-6">


                            <div className="mt-5 md:mt-0 md:col-span-2">
                                <form onSubmit={handleSubmit(onBeatSave)}>
                                    <div className="shadow sm:rounded-md sm:overflow-hidden">
                                        <div className="px-4 py-5 bg-white space-y-6 sm:p-6">

                                            <div className="grid grid-cols-3 gap-6">
                                                <div className="col-span-3 sm:col-span-2">
                                                    <label htmlFor="title"
                                                           className="block text-sm font-medium text-gray-700">
                                                        Title
                                                    </label>
                                                    <div className="mt-1 flex rounded-md shadow-sm">

                                                        <input
                                                            type="text"
                                                            name="title"
                                                            id="title"
                                                            className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                            placeholder="Type the title"
                                                            {...register("title", {required: true})}
                                                        />

                                                    </div>
                                                    <p className="text-red-500 text-sm">{errors.title?.message}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <label htmlFor="description"
                                                       className="block text-sm font-medium text-gray-700">
                                                    Description
                                                </label>
                                                <div className="mt-1">
                      <textarea
                          id="description"
                          name="description"
                          rows={3}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                          placeholder="Type the description of the beat"
                          defaultValue={''}
                          {...register('description')}

                      />
                                                    <p className="text-red-500 text-sm">{errors.description?.message}</p>
                                                </div>

                                            </div>


                                            <div className="grid grid-cols-3 gap-6">
                                                <div className="col-span-3 sm:col-span-2">
                                                    <label htmlFor="price"
                                                           className="block text-sm font-medium text-gray-700">
                                                        Price
                                                    </label>
                                                    <div className="mt-1 flex rounded-md shadow-sm">

                                                        <input
                                                            type="text"
                                                            name="price"
                                                            id="price"
                                                            className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                            placeholder="Type the price"
                                                            {...register('price')}                                                     />


                                                    </div>
                                                    <p className="text-red-500 text-sm">{errors.price?.message}</p>
                                                </div>
                                            </div>

                                            <div className="mb-3 w-96">
                                                <label htmlFor="beat"
                                                       className="block text-sm font-medium text-gray-700">Original
                                                    File</label>
                                                <input className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border
                                                border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                                       type="file" id="beat"
                                                       {...register('originalFile')} />
                                                <p className="text-red-500 text-sm ">{errors.originalFile?.message}</p>

                                            </div>
                                            <div className="mb-3 w-96">
                                                <label htmlFor="beat"
                                                       className="block text-sm font-medium text-gray-700">Sample Audio
                                                    File</label>
                                                <input className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border
                                                border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                                       type="file" id="beat"
                                                       accept=" audio/*"
                                                       {...register('sampleAudio')}
                                                />
                                                <p className="text-red-500 text-sm">{errors.sampleAudio?.message}</p>
                                            </div>


                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Cover
                                                    photo</label>
                                                <div
                                                    className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                                    {image ? <div
                                                        className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                                                        <img
                                                            src={image}
                                                            alt="uploaded image"
                                                            className="w-30 h-30 object-center object-cover lg:w-full lg:h-full"
                                                        />
                                                    </div> : <div className="space-y-1 text-center">
                                                        <svg
                                                            className="mx-auto h-12 w-12 text-gray-400"
                                                            stroke="currentColor"
                                                            fill="none"
                                                            viewBox="0 0 48 48"
                                                            aria-hidden="true"
                                                        >
                                                            <path
                                                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                                strokeWidth={2}
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>

                                                        <div className="flex text-sm text-gray-600">
                                                            <label
                                                                htmlFor="file-upload"
                                                                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                                            >
                                                                <span>Upload a file</span>
                                                                <input id="file-upload" name="file-upload"
                                                                       type="file"
                                                                       className="sr-only"
                                                                       onChange={(e) => onChangePicture(e)}

                                                                />

                                                            </label>
                                                            <p className="pl-1">or drag and drop</p>
                                                        </div>
                                                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to
                                                            10MB</p>
                                                    </div>}
                                                </div>
                                                <p className="text-red-500 text-sm">{errors.coverPhoto?.message}</p>
                                            </div>

                                        </div>
                                        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                            <button
                                                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                type="button"
                                                onClick={() => setShowModal(false)}
                                            >
                                                Close
                                            </button>
                                            <button
                                                type="submit"
                                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </>) : null}
                {showNotification ? <NotificationMessage/> : null}
            </div>
        </>
    );
}

export default  MyBeats;

