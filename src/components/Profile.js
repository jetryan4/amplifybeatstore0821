import React, {useContext, useEffect, useState} from 'react'
import {v4 as uuidv4} from 'uuid';
import Amplify, {API, graphqlOperation, Storage} from "aws-amplify";
import {useForm} from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';

import {updateUser} from '../api/mutations'
import config from '../aws-exports'
import {ProfileContext} from '../context/profile';

const {
    aws_user_files_s3_bucket_region: region, aws_user_files_s3_bucket: bucket
} = config


const schema = yup.object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    emailAddress: yup.string().email().required(),
    gender: yup.string().required(),
    country: yup.string().required(),
}).required();

const Profile = () => {
    const {profile} = useContext(ProfileContext);
    const [image, setImage] = useState(profile.picture);
    const [user, setUser] = useState({});
    const {register, handleSubmit, setValue, formState: {errors}} = useForm({resolver: yupResolver(schema)});

    const onProfileSave = async (data) => {
        console.log(data)
        const user = await Amplify.Auth.currentAuthenticatedUser({});
        try {
            const updateUserData = {...data, id: user.username}
            await API.graphql({
                query: updateUser, variables: {input: updateUserData}, authMode: "AMAZON_COGNITO_USER_POOLS"
            });
        } catch (err) {
            console.log('error updating user:', err)
        }
    }

    useEffect(() => {
        // get user and set form fields
        const fields = ['firstName', 'lastName', 'emailAddress', 'gender', 'country'];
        fields.forEach(field => setValue(field, profile[field]));
        setUser(profile);
    }, []);

    const handleImageUpload = async (e) => {
        e.preventDefault();
        const user = await Amplify.Auth.currentAuthenticatedUser({});
        const file = e.target.files[0];
        const extension = file.name.split(".")[1];
        const name = file.name.split(".")[0];
        const key = `images/${uuidv4()}${name}.${extension}`;
        const url = `https://${bucket}.s3.${region}.amazonaws.com/protected/${user.username}/${key}`
        try {
            // Upload the file to s3 with public access level.
            await Storage.put(key, file, {
                level: 'protected', contentType: file.type
            });
            // Retrieve the uploaded file to display
            const image = await Storage.get(key, {level: 'protected'})
            setImage(image);
        } catch (err) {
            console.log(err);
        }
    }

    return (<div className="flex items-center justify-center ">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg w-3/4  justify-center">

                <div>

                    <div className="text-gray-500 flex items-center justify-center  text-sm mt-4 ">
                        <h1>My Profile</h1>
                    </div>
                    <div className=" flex items-center justify-center mt-8  ">
                        {image ? <img className="max-auto w-auto h-40 rounded-full" src={image} alt=""/> :
                            <img className="max-auto w-auto h-40 rounded-full"
                                 src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                 alt="new"/>}
                    </div>
                </div>
                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Profile photo</label>
                        <div
                            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
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
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only"
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="border-t border-gray-200 mt-8">
                    <dl>
                        <form onSubmit={handleSubmit(onProfileSave)}>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">First Name</dt>
                                <input type="text" {...register('firstName')}/>
                                <div className="mb-3 text-normal text-red-500 ">{errors.firstName?.message}</div>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Last Name</dt>
                                <input type="text" {...register('lastName')}/>
                                <div className="mb-3 text-normal text-red-500 ">{errors.lastName?.message}</div>
                            </div>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                                <input type="text" {...register('emailAddress')}/>
                                <div className="mb-3 text-normal text-red-500 ">{errors.emailAddress?.message}</div>
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
                            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                <button
                                    type="submit"
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </dl>
                </div>
            </div>

        </div>

    );
}

export default Profile;
