import React, {useContext} from 'react'
import {ProducerContext} from '../context/producers';
import Amplify, {API} from "aws-amplify";
import {updateUser} from "../api/mutations";
import Loader from "../components/Loader";
import {navigate, useNavigate, useParams} from "react-router-dom";

const Producers = () => {
    const {producers, loading} = useContext(ProducerContext);
    const navigate =useNavigate();



    const demoteUser = async (userId) => {
        try {
            let apiName = 'AdminQueries';
            let path = '/removeUserFromGroup';
            let params = {
                body: {
                    "username": userId, "groupname": "Producer"
                }, headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${(await Amplify.Auth.currentSession()).getAccessToken().getJwtToken()}`
                }
            }
            const res = await API.post(apiName, path, params);
            if (res.message) {
                await API.graphql({
                    query: updateUser,
                    variables: {input: {id: userId, role: 'User'}},
                    authMode: "AMAZON_COGNITO_USER_POOLS"
                });
                window.location.reload();
            }
            console.log("Remove from group is successful", JSON.stringify(res));
        } catch (err) {
            console.log(err);
        }
    };

    const disableUser = async (userId) => {
        try {
            const apiName = 'AdminQueries';
            const path = '/disableUser';
            const params = {
                body: {
                    "username": userId
                }, headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${(await Amplify.Auth.currentSession()).getAccessToken().getJwtToken()}`
                }
            }
            const res = await API.post(apiName, path, params);
            if (res.message) {
                await API.graphql({
                    query: updateUser,
                    variables: {input: {id: userId, status: 'INACTIVE'}},
                    authMode: "AMAZON_COGNITO_USER_POOLS"
                });
                window.location.reload();
            }
            console.log("User disable successful", JSON.stringify(res));
        } catch (err) {
            console.log(err);
        }
    };

    const enableUser = async (userId) => {
        try {
            const apiName = 'AdminQueries';
            const path = '/enableUser';
            const params = {
                body: {
                    "username": userId
                }, headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${(await Amplify.Auth.currentSession()).getAccessToken().getJwtToken()}`
                }
            }
            const res = await API.post(apiName, path, params);
            if (res.message) {
                await API.graphql({
                    query: updateUser,
                    variables: {input: {id: userId, status: 'ACTIVE'}},
                    authMode: "AMAZON_COGNITO_USER_POOLS"
                });
                window.location.reload();
            }
            console.log("User enable successful", JSON.stringify(res));
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
        {loading && <Loader loading={loading}/>}
        <div className=" py-10 md:ml-20 sm:ml-16 xl:mr-8 ">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 ">
                    <div className="shadow  border-b border-gray-200 sm:rounded-lg xl:mr-8 ">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Name
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Email
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Status
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Role
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {producers.map((person) => (
                                    <tr key={person.email}
                                     >


                                            <td  className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">

                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <img className="h-10 w-10 rounded-full" src={person.picture} alt=""/>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div
                                                            className="text-sm font-medium text-gray-900">{person.firstName} {person.lastName}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{person.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                      <span
                          className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {person.status}
                      </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{person.role}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                    type="button"
                                                    onClick={() => demoteUser(person.id)}
                                                >
                                                    Demote
                                                </button>
                                                &nbsp;
                                                {person.status === "ACTIVE" ? <button
                                                    className="text-red-600 hover:text-red-900"
                                                    type="button"
                                                    onClick={() => disableUser(person.id)}
                                                >
                                                    Disable
                                                </button> : <button
                                                    className="text-green-600 hover:text-green-900"
                                                    type="button"
                                                    onClick={() => enableUser(person.id)}
                                                >
                                                    Enable
                                                </button>}
                                            </td>




                                    </tr>

                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        </>
            );
}

export default Producers;
