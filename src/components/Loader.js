import React from "react";

import {css} from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const Loader = (props) => {
    return (
    <>
        {
            props.loading ?
            <div className="flex h-screen z-50">
                <div className="m-auto">
                    <ClipLoader color={props.color || '#ffffff'} loading={props.loading} css={override}
                                size={props.size || 150}/>
                </div>
            </div> : null
        }
    </>

    );
}

export default Loader;
