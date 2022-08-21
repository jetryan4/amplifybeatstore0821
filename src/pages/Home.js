import React, {useContext} from "react";
import {Link, useNavigate} from "react-router-dom";
import {InboxIcon, UsersIcon} from "@heroicons/react/outline";

import heroVideo from "../assets/shum-video.mp4";
import {ProductContext} from "../context/products";
import {ProducerContext} from "../context/producers";

const features = [{
    name: "Step 1",
    description: "Create your free Producer Account.",
    icon: UsersIcon,
}, {
    name: "Step 2",
    description: "Upload beat samples and submit for approval.",
    icon: UsersIcon,
}, {
    name: "Step 3",
    description: "Congratulations! You can now customize your public producer profile and upload beats for sale.",
    icon: UsersIcon,
}, {
    name: "Step 4",
    description: "Sit back and collect revenue as artists purchase beats, with no contracts or paperwork involved.",
    icon: UsersIcon,
},

];

const Home = () => {

    const {producers} = useContext(ProducerContext);
    const {products} = useContext(ProductContext);
    const navigate = useNavigate();

    const gotoProfile = () => {
        navigate('/profile');
    }

    return (<div className="bg-white">
            {/* Hero section */}
            <div className="">
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gray-100"/>
                <div className="">
                    <div className="relative shadow-xl sm:overflow-hidden">
                        <div className="absolute inset-0">
                            <video className="h-full w-full object-cover" loop autoPlay muted>
                                <source src={heroVideo} type="video/mp4"/>
                            </video>
                            <div
                                className="absolute inset-0 bg-gradient-to-r from-purple-800 to-indigo-700 mix-blend-multiply"/>
                        </div>
                        <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
                            <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                                <span className="block text-white">RANKIN RECORDS</span>
                                <span className="block text-indigo-400">
                  YOUNG. TALENTED. GROWING.
                </span>
                            </h1>

                            <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
                                <div
                                    className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
                                    <a
                                        onClick={gotoProfile}
                                        href="#"
                                        className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 sm:px-8"
                                    >
                                        Get started
                                    </a>
                                    <a
                                        href="#"
                                        className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-500 bg-opacity-60 hover:bg-opacity-70 sm:px-8"
                                    >
                                        Live demo
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Alternating Feature Sections */}
            <div className="relative overflow-hidden" id="roasterSection">
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-gray-100"
                />
                <div className="relative">
                    <div className="lg:max-w-full lg:px-8 lg:grid lg:grid-cols-1 lg:grid-flow-col-dense lg:gap-24">
                        <div className="lg:mx-24 max-w-xl mx-auto sm:px-6 lg:py-16 lg:max-w-none lg:mx-0 lg:px-0">
                            <div>
                                <div>
                  <span
                      className="h-12 w-12 rounded-md flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600">
                    <InboxIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                    />
                  </span>
                                </div>
                                <div className="mt-6">
                                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                                        ROASTER
                                    </h2>
                                    <p className="mt-4 text-lg text-gray-500">
                                        A small description of the team and the values of our
                                        members.
                                    </p>
                                </div>

                                <div className="relative">
                                    <div className="relative">
                                        <div
                                            className="mt-12 mx-auto max-w-md px-4 grid lg:grid-cols-5 gap-8 sm:max-w-lg sm:px-6 lg:px-8 lg:max-w-7xl">
                                            {producers.map((roaster) => (<div

                                                    className="flex flex-col rounded-md shadow-sm overflow-hidden transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110 ..."
                                                >
                                                <a href={`/roster/${roaster.id}`}>
                                                    <div className="flex-shrink-0">
                                                        <img
                                                            className="h-48 w-full object-cover"
                                                            src={roaster.picture}
                                                            alt=""
                                                        />
                                                    </div>
                                                    <div
                                                        className="flex-1 bg-gray-700 p-6 flex flex-col justify-between rounded-md">
                                                        <div>
                                                            <p className="text-sm font-semibold text-white">
                                                                {`${roaster.firstName} ${roaster.lastName}`}
                                                            </p>
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-white">
                                                                <Link to="/" className="hover:underline">
                                                                    {roaster.email}
                                                                </Link>
                                                            </p>
                                                            <Link to="/" className="block mt-2">
                                                                <p className="text-xl font-semibold text-white">
                                                                    {roaster.country}
                                                                </p>
                                                            </Link>
                                                        </div>
                                                    </div>

                                                </a>

                                                </div>))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Alternating Feature Sections */}
            <div className="relative overflow-hidden" id="productsSection">
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-gray-100"
                />
                <div className="relative">
                    <div className="lg:max-w-full lg:px-8 lg:grid lg:grid-cols-1 lg:grid-flow-col-dense lg:gap-24">
                        <div className="lg:mx-24 max-w-xl mx-auto sm:px-6 lg:py-16 lg:max-w-none lg:mx-0 lg:px-0">
                            <div>
                                <div>
                  <span
                      className="h-12 w-12 rounded-md flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600">
                    <InboxIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                    />
                  </span>
                                </div>
                                <div className="mt-6">
                                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                                        PRODUCTS
                                    </h2>
                                    <p className="mt-4 text-lg text-gray-500">
                                        A small description of our products in Rankin Records.
                                    </p>
                                </div>


                                <div className="relative py-4">
                                    <div className="relative">
                                        <div
                                            className="text-center mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl">
                                            <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
                                                BEATS
                                            </p>
                                            <p className="mt-5 mx-auto max-w-prose text-xl text-gray-500">
                                                a short description of our products
                                            </p>
                                        </div>

                                        <div className="bg-white">
                                            <div
                                                className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">

                                                <div
                                                    className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                                                    {products.map((product) => (<Link to={`products/${product.id}`}>
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
                                                                            <Link to={`products/${product.id}`}
                                                                                  className="text-sm text-gray-700">details</Link>
                                                                            &nbsp; <b>{product.title}</b>
                                                                        </h3>
                                                                        <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                                                                    </div>
                                                                    <p className="text-sm font-medium text-gray-900">${product.price}</p>
                                                                </div>
                                                            </div>
                                                        </Link>))}
                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gradient Feature Section */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-600" id="aboutusSection">
                <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 sm:pt-20 sm:pb-24 lg:max-w-7xl lg:pt-24 lg:px-8">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">
                        HOW IT WORKS?
                    </h2>
                    <p className="mt-4 max-w-3xl text-lg text-purple-200">
                        It is as easy as you can imagine.
                    </p>
                    <div
                        className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16">
                        {features.map((feature) => (<div key={feature.name}>
                                <div>
                  <span className="flex items-center justify-center h-12 w-12 rounded-md bg-white bg-opacity-10">
                    <feature.icon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                    />
                  </span>
                                </div>
                                <div className="mt-6">
                                    <h3 className="text-lg font-medium text-white">
                                        {feature.name}
                                    </h3>
                                    <p className="mt-2 text-base text-purple-200">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>))}
                    </div>
                </div>
            </div>


            {/* Logo Cloud */}
            {/*<div className="bg-gray-100">*/}
            {/*    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">*/}
            {/*        <p className="text-center text-sm font-semibold uppercase text-gray-500 tracking-wide">*/}
            {/*            Trusted by over 5 very average small businesses*/}
            {/*        </p>*/}
            {/*        <div className="mt-6 grid grid-cols-2 gap-8 md:grid-cols-6 lg:grid-cols-5">*/}
            {/*            <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">*/}
            {/*                <img*/}
            {/*                    className="h-12"*/}
            {/*                    src="https://tailwindui.com/img/logos/tuple-logo-gray-400.svg"*/}
            {/*                    alt="Tuple"*/}
            {/*                />*/}
            {/*            </div>*/}
            {/*            <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">*/}
            {/*                <img*/}
            {/*                    className="h-12"*/}
            {/*                    src="https://tailwindui.com/img/logos/mirage-logo-gray-400.svg"*/}
            {/*                    alt="Mirage"*/}
            {/*                />*/}
            {/*            </div>*/}
            {/*            <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">*/}
            {/*                <img*/}
            {/*                    className="h-12"*/}
            {/*                    src="https://tailwindui.com/img/logos/statickit-logo-gray-400.svg"*/}
            {/*                    alt="StaticKit"*/}
            {/*                />*/}
            {/*            </div>*/}
            {/*            <div className="col-span-1 flex justify-center md:col-span-2 md:col-start-2 lg:col-span-1">*/}
            {/*                <img*/}
            {/*                    className="h-12"*/}
            {/*                    src="https://tailwindui.com/img/logos/transistor-logo-gray-400.svg"*/}
            {/*                    alt="Transistor"*/}
            {/*                />*/}
            {/*            </div>*/}
            {/*            <div className="col-span-2 flex justify-center md:col-span-2 md:col-start-4 lg:col-span-1">*/}
            {/*                <img*/}
            {/*                    className="h-12"*/}
            {/*                    src="https://tailwindui.com/img/logos/workcation-logo-gray-400.svg"*/}
            {/*                    alt="Workcation"*/}
            {/*                />*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}


            {/* Stats section */}
            {/*<div className="relative bg-gray-900">*/}
            {/*    <div className="h-80 absolute inset-x-0 bottom-0 xl:top-0 xl:h-full">*/}
            {/*        <div className="h-full w-full xl:grid xl:grid-cols-2">*/}
            {/*            <div className="h-full xl:relative xl:col-start-2">*/}
            {/*                <img*/}
            {/*                    className="h-full w-full object-cover opacity-25 xl:absolute xl:inset-0"*/}
            {/*                    src="https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2830&q=80&sat=-100"*/}
            {/*                    alt="People working on laptops"*/}
            {/*                />*/}
            {/*                <div*/}
            {/*                    aria-hidden="true"*/}
            {/*                    className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-gray-900 xl:inset-y-0 xl:left-0 xl:h-full xl:w-32 xl:bg-gradient-to-r"*/}
            {/*                />*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}

            {/*    <div*/}
            {/*        className="max-w-4xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8 xl:grid xl:grid-cols-2 xl:grid-flow-col-dense xl:gap-x-8">*/}
            {/*        <div className="relative pt-12 pb-64 sm:pt-24 sm:pb-64 xl:col-start-1 xl:pb-24">*/}
            {/*            <p className="mt-3 text-3xl font-extrabold text-white">*/}
            {/*                WHY JOIN US*/}
            {/*            </p>*/}
            {/*            <p className="mt-5 text-lg text-gray-300">*/}
            {/*                Rhoncus sagittis risus arcu erat lectus bibendum. Ut in adipiscing*/}
            {/*                quis in viverra tristique sem. Ornare feugiat viverra eleifend*/}
            {/*                fusce orci in quis amet. Sit in et vitae tortor, massa. Dapibus*/}
            {/*                laoreet amet lacus nibh integer quis. Eu vulputate diam sit tellus*/}
            {/*                quis at.*/}
            {/*            </p>*/}
            {/*            <div className="mt-12 grid grid-cols-1 gap-y-12 gap-x-6 sm:grid-cols-2">*/}
            {/*                {metrics.map((item) => (*/}
            {/*                    <p key={item.id}>*/}
            {/*      <span className="block text-2xl font-bold text-white">*/}
            {/*        {item.stat}*/}
            {/*      </span>*/}
            {/*                        <span className="mt-1 block text-base text-gray-300">*/}
            {/*        <span className="font-medium text-white">*/}
            {/*          {item.emphasis}*/}
            {/*        </span>{" "}*/}
            {/*                            {item.rest}*/}
            {/*      </span>*/}
            {/*                    </p>*/}
            {/*                ))}*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* CTA Section */}
            <div className="bg-white">
                <div
                    className="max-w-4xl mx-auto py-16 px-4 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 lg:flex lg:items-center lg:justify-between">
                    <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        <span className="block">Ready to get started?</span>
                        <span
                            className="block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Get in touch or create an account.
            </span>
                    </h2>
                    <div className="mt-6 space-y-4 sm:space-y-0 sm:flex sm:space-x-5">
                        <Link
                            to="/profile"
                            className="flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 bg-origin-border px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white hover:from-purple-700 hover:to-indigo-700"
                        >
                            Sign Up
                        </Link>
                        <Link
                            to="/profile"
                            className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-800 bg-indigo-50 hover:bg-indigo-100"
                        >
                            Log In
                        </Link>
                    </div>
                </div>
            </div>

            <div>
                <section className="py-20 2xl:py-40 bg-gray-700">
                    <div className="container px-4 mx-auto">
                        <div className="flex flex-wrap -mx-4 pb-24 mb-16 border-b border-gray-400">
                            <div className="w-full lg:w-2/5 px-4 mb-16 lg:mb-0">
                                <span className="text-lg text-blue-400 font-bold">We&apos;re Rankine Records</span>
                                <h2 className="max-w-sm mt-8 mb-12 text-5xl text-white font-bold font-heading">Thank you
                                    for your time</h2>
                                <p className="mb-16 text-gray-300">The brown fox jumps over the lazy dog.</p>
                                <div><a
                                    className="inline-block mb-4 sm:mb-0 sm:mr-4 py-4 px-12 text-white font-bold bg-blue-500 hover:bg-blue-600 rounded-full transition duration-200"
                                    href="#">Active demo</a><a
                                    className="inline-block px-12 py-4 text-white font-bold border border-gray-200 hover:border-white rounded-full"
                                    href="#">Contact</a></div>
                            </div>
                            <div className="w-full lg:w-3/5 px-4">
                                <div className="flex flex-wrap -mx-4">
                                    <div className="w-full md:w-1/2 lg:w-1/3 px-4 mb-16 lg:mb-0">
                                        <ul className="text-lg">
                                            <li className="mb-6"><a className="text-gray-200 hover:text-gray-100"
                                                                    href="#">Hello</a></li>
                                            <li className="mb-6"><a className="text-gray-200 hover:text-gray-100"
                                                                    href="#">Story</a></li>
                                            <li className="mb-6"><a className="text-gray-200 hover:text-gray-100"
                                                                    href="#">Pricing</a></li>
                                            <li><a className="text-gray-200 hover:text-gray-100" href="#">Applications</a></li>
                                        </ul>
                                    </div>
                                    <div className="w-full md:w-1/2 lg:w-1/3 px-4 mb-16 lg:mb-0">
                                        <ul className="text-lg">
                                            <li className="mb-6"><a className="text-gray-200 hover:text-gray-100"
                                                                    href="#">Stats</a></li>
                                            <li className="mb-6"><a className="text-gray-200 hover:text-gray-100"
                                                                    href="#">Blog</a></li>
                                            <li className="mb-6"><a className="text-gray-200 hover:text-gray-100"
                                                                    href="#">Contact</a></li>
                                            <li><a className="text-gray-200 hover:text-gray-100" href="#">Testimonials</a></li>
                                        </ul>
                                    </div>
                                    <div className="w-full lg:w-1/3 px-4">
                                        <ul className="text-lg">
                                            <li className="mb-6"><a className="text-gray-200 hover:text-gray-100"
                                                                    href="#">New account</a></li>
                                            <li className="mb-6"><a className="text-gray-200 hover:text-gray-100"
                                                                    href="/profile">Log in</a></li>
                                            <li className="mb-6"><a className="text-gray-200 hover:text-gray-100"
                                                                    href="/policies">Privacy Policy</a></li>
                                            <li><a className="text-gray-200 hover:text-gray-100" href="#">Cookies</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="md:flex justify-between">
                            <p className="text-lg text-gray-200 mb-8 md:mb-0" >&copy; 2022 Rankine Records. All rights
                                reserved.</p>

                        </div>
                    </div>
                </section>
            </div>


        </div>



   )
}

export default Home;
