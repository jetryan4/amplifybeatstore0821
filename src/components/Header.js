import React, {useContext, useEffect, useState, Fragment} from 'react';
import Amplify from "aws-amplify";
import {useNavigate} from "react-router-dom";
import {Disclosure, Menu, Transition} from '@headlessui/react'
import {MenuIcon, XIcon, ShoppingBagIcon} from '@heroicons/react/outline'
import {CartStateContext, CartDispatchContext, toggleCartPopup} from "../context/cart";

import logo from "../assets/logo_new_black.png";
import {AuthStateContext, AuthDispatchContext, signOut} from "../context/auth";
import Cart from "../pages/Cart";
import defaultPropPic from "../assets/default-profile.png";

const navigation = [
    {name: 'Home', href: '/', current: true},
    {name: 'Roster', href: '/roster', current: false},
    {name: 'Beats', href: '/products', current: false},
    {name: 'About us', href: '/about', current: false}
]

const userNavigation = [
    {name: 'dashboard', href: '/dashboard', public: false},
    {name: 'Your Profile', href: '/profile', public: true},
    {name: 'Orders', href: '/orders', public: true},
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const Header = () => {

    const navigate = useNavigate();
    const {items: cartItems, isCartOpen} = useContext(CartStateContext);
    const cartDispatch = useContext(CartDispatchContext);
    const authDispatch = useContext(AuthDispatchContext);
    const {user} = useContext(AuthStateContext);
    const cartQuantity = cartItems.length;
    const cartTotal = cartItems
        .map((item) => item.price * item.quantity)
        .reduce((prev, current) => prev + current, 0);



    const logout = async () => {
        Amplify.Auth.signOut()
            .then(data => {
                signOut(authDispatch);
                navigate("/")
            })
            .catch(err => console.log(err));
    }

    const handleCartButton = (event) => {
        event.preventDefault();
        return toggleCartPopup(cartDispatch);
    };

    const showItem = (item) => {
        const role = user.role;
        if (!item.public && role && role === 'Admin' || role === 'Producer') return true; else return item.public;
    };

    return (<>
            <div className="min-h-full">
                <Disclosure as="nav" className="bg-gray-800">
                    {({open}) => (<>
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="flex items-center justify-between h-16">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <img
                                                className="h-12 w-12 rounded-full"
                                                src={logo}
                                                alt="Rankine Records"
                                            />
                                        </div>
                                        <div className="hidden md:block">
                                            <div className="ml-10 flex items-baseline space-x-4">
                                                {navigation.map((item) => {
                                                    const isCurrentTab = (item.href === `/${window.location.pathname.split('/')[1]}`);
                                                    return (<a
                                                        key={item.name}
                                                        href={item.href}
                                                        className={classNames(isCurrentTab ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'px-3 py-2 rounded-md text-sm font-medium')}
                                                        aria-current={isCurrentTab ? 'page' : undefined}
                                                    >
                                                        {item.name}
                                                    </a>)})}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="ml-4 flex items-center md:ml-6">
                                            {cartQuantity ? (<div
                                                    className="w-6 h-6 text-center font-bold text-gray-700 rounded-full bg-white">{cartQuantity}</div>

                                            ) : ("")}
                                            <button
                                                type="button"
                                                className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white"
                                            >
                                                <span className="sr-only">View Cart</span>
                                                <ShoppingBagIcon className="h-8 w-8" aria-hidden="true"
                                                                 onClick={handleCartButton}/>
                                            </button>

                                            {/* Profile dropdown */}
                                            <Menu as="div" className="ml-3 relative">
                                                {user && user.email ? <Menu.Button
                                                    className="max-w-xs bg-gray-800 rounded-full flex items-center">
                                                    <span className="sr-only">Open user menu</span>
                                                    <img
                                                        className="h-8 w-8 rounded-full  text-sm hover:ring hover:ring-white"
                                                        src={user.picture ? user.picture : defaultPropPic}
                                                        alt=""/>
                                                    <div className="ml-3">
                                                        <div
                                                            className="text-base font-medium leading-none text-white">{user.name}</div>
                                                        <div
                                                            className="text-sm font-medium leading-none text-gray-400">{user.email}</div>
                                                    </div>
                                                </Menu.Button> : <Menu.Button
                                                    className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm"
                                                >
                                                    <span className="sr-only">Open user menu</span>
                                                    <a
                                                        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                                        onClick={() => navigate('/profile')}
                                                    >
                                                        Sign In
                                                    </a>
                                                </Menu.Button>}

                                                {user && user.email ? <Transition
                                                    as={Fragment}
                                                    enter="transition ease-out duration-100"
                                                    enterFrom="transform opacity-0 scale-95"
                                                    enterTo="transform opacity-100 scale-100"
                                                    leave="transition ease-in duration-75"
                                                    leaveFrom="transform opacity-100 scale-100"
                                                    leaveTo="transform opacity-0 scale-95"
                                                >
                                                    <Menu.Items
                                                        className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                                        {userNavigation.map((item) => showItem(item) ?
                                                            <Menu.Item key={item.name}>
                                                                {({active}) => <a
                                                                    href={item.href}
                                                                    className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                                >
                                                                    {item.name}
                                                                </a>}
                                                            </Menu.Item> : <></>)}
                                                        <Menu.Item key="Sign Out">
                                                            {({active}) => <a onClick={logout}
                                                                              href="#"
                                                                              className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                            >
                                                                Sign Out
                                                            </a>}
                                                        </Menu.Item>
                                                    </Menu.Items>
                                                </Transition> : null}
                                            </Menu>
                                        </div>
                                    </div>
                                    <div className="-mr-2 flex md:hidden">
                                        {/* Mobile menu button */}
                                        <Disclosure.Button
                                            className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                            <span className="sr-only">Open main menu</span>
                                            {open ? (<XIcon className="block h-6 w-6" aria-hidden="true"/>) : (
                                                <MenuIcon className="block h-6 w-6" aria-hidden="true"/>)}
                                        </Disclosure.Button>
                                    </div>
                                </div>
                            </div>

                            <Disclosure.Panel className="md:hidden">
                                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                                    {navigation.map((item) =>{
                                        const isCurrentTab = (item.href === `/${window.location.pathname.split('/')[1]}`);
                                        return(<Disclosure.Button
                                            key={item.name}
                                            as="a"
                                            href={item.href}
                                            className={classNames(isCurrentTab ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'block px-3 py-2 rounded-md text-base font-medium')}
                                            aria-current={isCurrentTab ? 'page' : undefined}
                                        >
                                            {item.name}
                                        </Disclosure.Button>)})}
                                </div>
                                {user && user.email ? <div className="pt-4 pb-3 border-t border-gray-700">
                                    <div className="flex items-center px-5">
                                        <div className="flex-shrink-0">
                                            <img className="h-10 w-10 rounded-full" src={user.picture} alt=""/>
                                        </div>
                                        <div className="ml-3">
                                            <div
                                                className="text-base font-medium leading-none text-white">{user.name}</div>
                                            <div
                                                className="text-sm font-medium leading-none text-gray-400">{user.email}</div>
                                        </div>

                                        <button
                                            type="button"
                                            className="ml-auto bg-gray-800 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                                        >
                                            <span className="sr-only">View Cart</span>
                                            <ShoppingBagIcon className="h-6 w-6" aria-hidden="true"
                                                             onClick={handleCartButton}/>
                                        </button>
                                    </div>
                                    <div className="mt-3 px-2 space-y-1">
                                        {userNavigation.map((item) => showItem(item) ? <Disclosure.Button
                                            key={item.name}
                                            as="a"
                                            href={item.href}
                                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                                        >
                                            {item.name}
                                        </Disclosure.Button> : <></>)}
                                        <Disclosure.Button onClick={logout}
                                                           key="Sign Out"
                                                           href="#"
                                                           as="a"
                                                           className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                                        >
                                            Sign Out
                                        </Disclosure.Button>
                                        ))}
                                    </div>
                                </div> : null}

                            </Disclosure.Panel>

                        </>)}
                </Disclosure>
            </div>
            <Cart/>
        </>
    )
}

export default Header
