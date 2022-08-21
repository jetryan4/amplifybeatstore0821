import {useNavigate} from "react-router-dom";

const PageMessage = (props) => {
    const navigate = useNavigate();

    return (<div className="flex items-center justify-center w-screen h-screen bg-indigo-50">
        <div className="px-40 py-20 bg-white rounded-md shadow-xl">
            <div className="flex flex-col items-center">
                <h1 className="font-bold text-blue-600 text-5xl">{props.errorCode || ''}</h1>

                <h6 className="mb-2 text-2xl font-bold text-center text-gray-800 md:text-3xl">
                    <span
                        className="text-red-500">{props.mainMessage || 'Sorry!'}</span> {props.subMessage || 'No items found'}
                </h6>

                <p className="mb-8 text-center text-gray-500 md:text-lg">
                    {props.messageDescription || 'Please stay in touch! We will update the site as soon as possible'}
                </p>
                <a
                    href="#"
                    className="px-6 py-2 text-sm font-semibold text-blue-800 bg-blue-100"
                    onClick={() => navigate('/')}
                >Go home</a
                >
            </div>
        </div>
    </div>);
}

export default PageMessage;
