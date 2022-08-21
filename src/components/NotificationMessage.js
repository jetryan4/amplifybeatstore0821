import React, {useState} from "react";

const NotificationMessage = (props) => {
    const [show, setShow] = useState(true);

    return (<>
            {show ? <div
                className="absolute top-20 right-5 flex items-center w-full max-w-xs p-4 space-x-4 bg-white rounded-lg border-gray-300 border p-3 shadow-lg dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800">
                <div className="flex flex-row">
                    <div className="px-2">
                        <svg width="24" height="24" viewBox="0 0 1792 1792" fill="#44C997"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M1299 813l-422 422q-19 19-45 19t-45-19l-294-294q-19-19-19-45t19-45l102-102q19-19 45-19t45 19l147 147 275-275q19-19 45-19t45 19l102 102q19 19 19 45t-19 45zm141 83q0-148-73-273t-198-198-273-73-273 73-198 198-73 273 73 273 198 198 273 73 273-73 198-198 73-273zm224 0q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z"/>
                        </svg>
                    </div>
                    <div className="ml-2 mr-6">
                        <span className="font-semibold">{props.message || 'Successfully Saved!'}</span>
                        <span className="block text-gray-500">{props.description || ''}</span>
                    </div>
                    <button type="button"
                            onClick={() => setShow(false)}
                            className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-full focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                            data-collapse-toggle="toast-interactive" aria-label="Close">
                        <span className="sr-only">Close</span>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                             xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clip-rule="evenodd"></path>
                        </svg>
                    </button>
                </div>
            </div> : null}
        </>);
}

export default NotificationMessage;
