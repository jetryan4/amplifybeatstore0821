import React, {useContext, useEffect, useRef, useState} from 'react'
import {v4 as uuidv4} from 'uuid';
import Amplify, {API, Storage} from "aws-amplify";
import {useForm} from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {withAuthenticator} from '@aws-amplify/ui-react';
import AvatarEditor from 'react-avatar-editor'
import {updateUser} from '../api/mutations'
import config from '../aws-exports'
import {AuthDispatchContext, signIn} from "../context/auth";
import {getUser} from "../api/queries";
import {customAuthComponent} from "../components/CustomAuthComponent";
import defaultPropPic from "../assets/default-profile.png";
import Loader from "../components/Loader";

const {
    aws_user_files_s3_bucket_region: region, aws_user_files_s3_bucket: bucket
} = config

const schema = yup.object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
    gender: yup.string().required(),
    country: yup.string().required(),
}).required();

const UserProfile = () => {
    const authDispatch = useContext(AuthDispatchContext);
    const [image, setImage] = useState(null);
    const [picture, setPicture] = useState(null);
    const [isLodaing, setLoading] = useState(false);
    const {register, handleSubmit, setValue, formState: {errors}} = useForm({resolver: yupResolver(schema)});
    const editor = useRef(null);

    useEffect(() => {
        getLoginUser();
    }, []);

    const getLoginUser = async () => {
        try {
            const user = await Amplify.Auth.currentAuthenticatedUser({});
            if (user) {
                const {data} = await API.graphql({
                    query: getUser, variables: {id: user.username}, authMode: "AMAZON_COGNITO_USER_POOLS"
                });
                const userData = data.getUser;
                console.log(`userData: ${userData}`)
                await setUserProfileData(userData)
                signIn(authDispatch, userData);
            }
        } catch (e) {
            console.log(`Error occurred loading the login user, ${e}`)
        }
    }

    const setUserProfileData = async (userData) => {
        const fields = ['firstName', 'lastName', 'email', 'gender', 'country'];
        fields.forEach(field => setValue(field, userData[field]));
        setPicture(userData.picture);
    }

    const onProfileSave = async (data) => {

        console.log(data)
        const user = await Amplify.Auth.currentAuthenticatedUser({});
        // Save profile picture
        let coverPhotoUrl
        if (picture && editor.current) {
            const dataUrl = editor.current.getImage().toDataURL()
            const result = await fetch(dataUrl)
            const blob = await result.blob()
            setLoading(true);

            coverPhotoUrl = await handleFileUpload(picture, blob, 'images', 'public')
        }
        setLoading(true);

        try {
            const updateUserData = {...data, id: user.username, picture: coverPhotoUrl}
            await API.graphql({
                query: updateUser, variables: {input: updateUserData}, authMode: "AMAZON_COGNITO_USER_POOLS"
            });

            window.location.reload();
        } catch (err) {
            console.log('error updating user:', err)
        }
    }

    const handleFileUpload = async (file, blob, fileType, accessLevel) => {
        try {
            let url;
            if (file.name) {
                const user = await Amplify.Auth.currentAuthenticatedUser({});
                const extension = file.name.split(".")[1];
                const name = file.name.split(".")[0];
                const key = `${fileType}/${uuidv4()}${name}.${extension}`;
                url = `https://${bucket}.s3.${region}.amazonaws.com/${accessLevel}/${key}`

                await Storage.put(key, blob, {
                    level: accessLevel, contentType: file.type
                });
            }
            return url
        } catch (err) {
            console.log(err);
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

    return (<>
            {isLodaing ?
                <Loader loading={isLodaing}/> :
                <div className="flex items-center justify-center ">
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg w-3/4  justify-center">
                        <div>
                            <div className="text-gray-500 flex items-center justify-center  text-sm mt-4 ">
                                <h1 className="text-2xl font-normal leading-normal mt-0 mb-2 text-pink-800">My
                                    Profile</h1>
                            </div>

                            <div className=" flex items-center justify-center mt-8  ">
                                {image ?
                                    <AvatarEditor ref={editor} image={picture} width={250} height={250} border={50}
                                                  scale={1.2} borderRadius={200}/>
                                    :
                                    <img className="max-auto w-auto h-40 rounded-full"
                                         src={picture ? picture : defaultPropPic} alt="new"/>
                                }
                            </div>

                            <div className="flex text-sm text-gray-600 items-center justify-center">
                                <label htmlFor="file-upload"
                                       className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                    <span>Change picture</span>
                                    <input className="form-control
                                                        block
                                                        w-full
                                                        px-3
                                                        py-1.5
                                                        text-base
                                                        font-normal
                                                        text-gray-700
                                                        bg-white bg-clip-padding
                                                        border border-solid border-gray-300
                                                        rounded
                                                        transition
                                                        ease-in-out
                                                        m-0
                                                        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                           type="file" id="formFile" onChange={(e) => onChangePicture(e)}/>
                                </label>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 mt-8">
                            <dl>
                                <form onSubmit={handleSubmit(onProfileSave)}>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                                        <input className="bg-gray-200" type="text" readOnly {...register('email')}/>
                                        <div className="mb-3 text-normal text-red-500 ">{errors.email?.message}</div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">First Name</dt>
                                        <input type="text" {...register('firstName')}/>
                                        <div
                                            className="mb-3 text-normal text-red-500 ">{errors.firstName?.message}</div>
                                    </div>
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Last Name</dt>
                                        <input type="text" {...register('lastName')}/>
                                        <div className="mb-3 text-normal text-red-500 ">{errors.lastName?.message}</div>
                                    </div>
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Gender</dt>
                                        <input type="text" {...register('gender')}/>
                                        <div className="mb-3 text-normal text-red-500 ">{errors.gender?.message}</div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Country</dt>
                                        <input type="text" {...register('country')}/>
                                        <div className="mb-3 text-normal text-red-500 ">{errors.country?.message}</div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500 px-2 py-1"></dt>
                                        <button type="submit"
                                                className="inline-flex items-center justify-center py-2 px-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </dl>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}

export default withAuthenticator(UserProfile, customAuthComponent);
