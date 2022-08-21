import React, {useState} from 'react'
import Amplify from "aws-amplify";
import {v4 as uuidv4} from 'uuid';
import {API, graphqlOperation, Storage} from "aws-amplify";
import {withAuthenticator} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import {createProduct} from '../api/mutations'
import config from '../aws-exports'
import {customAuthComponent} from "../components/CustomAuthComponent";

Amplify.configure(config);
const {
    aws_user_files_s3_bucket_region: region, aws_user_files_s3_bucket: bucket
} = config


const Admin = () => {
    const [image, setImage] = useState(null);
    let [productDetails, setProductDetails] = useState({title: "", description: "", image: "", author: "", price: ""});

    const handleSubmit = async (e) => {
        const user = await Amplify.Auth.currentAuthenticatedUser({});
        e.preventDefault();
        try {
            if (!productDetails.title || !productDetails.price) return
            productDetails = {...productDetails}
            setProductDetails(productDetails);
            await API.graphql({
                query: createProduct, variables: {input: productDetails}, authMode: "AMAZON_COGNITO_USER_POOLS"
            });
            setProductDetails({title: "", description: "", image: "", author: "", price: ""});
        } catch (err) {
            console.log('error creating todo:', err)
        }
    }

    const handleImageUpload = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        const extension = file.name.split(".")[1];
        const name = file.name.split(".")[0];
        const key = `images/${uuidv4()}${name}.${extension}`;
        const url = `https://${bucket}.s3.${region}.amazonaws.com/public/${key}`
        try {
            // Upload the file to s3 with public access level. 
            await Storage.put(key, file, {
                level: 'public', contentType: file.type
            });
            // Retrieve the uploaded file to display
            const image = await Storage.get(key, {level: 'public'})
            setImage(image);
            setProductDetails({...productDetails, image: url});
        } catch (err) {
            console.log(err);
        }
    }

    return (<section className="admin-wrapper">
            <section>
                <header className="form-header">
                    <h3>Add New Beat</h3>
                </header>
                <form className="form-wrapper" onSubmit={handleSubmit}>
                    <div className="form-image">
                        {image ? <img className="image-preview" src={image} alt=""/> : <input
                            type="file"
                            accept="image/jpg"
                            onChange={(e) => handleImageUpload(e)}/>}

                    </div>
                    <div className="form-fields">
                        <div className="title-form">
                            <p><label htmlFor="title">Title</label></p>
                            <p><input
                                name="email"
                                type="title"
                                placeholder="Type the title"
                                onChange={(e) => setProductDetails({...productDetails, title: e.target.value})}
                                required
                            /></p>
                        </div>
                        <div className="description-form">
                            <p><label htmlFor="description">Description</label></p>
                            <p><textarea
                                name="description"
                                type="text"
                                rows="8"
                                placeholder="Type the description of the Beat"
                                onChange={(e) => setProductDetails({...productDetails, description: e.target.value})}
                                required
                            /></p>
                        </div>
                        <div className="author-form">
                            <p><label htmlFor="author">Author</label></p>
                            <p><input
                                name="author"
                                type="text"
                                placeholder="Type the author's name"
                                onChange={(e) => setProductDetails({...productDetails, author: e.target.value})}
                                required
                            /></p>
                        </div>
                        <div className="price-form">
                            <p><label htmlFor="price">Price ($)</label>
                                <input
                                    name="price"
                                    type="text"
                                    placeholder="What is the Price of the beat (USD)"
                                    onChange={(e) => setProductDetails({...productDetails, price: e.target.value})}
                                    required
                                /></p>
                        </div>
                        <div className="featured-form">
                            <p><label>Featured?</label>
                                <input type="checkbox"
                                       className="featured-checkbox"
                                       checked={productDetails.featured}
                                       onChange={() => setProductDetails({
                                           ...productDetails, featured: !productDetails.featured
                                       })}
                                />
                            </p>
                        </div>
                        <div className="submit-form">
                            <button className="btn" type="submit">Submit</button>
                        </div>
                    </div>
                </form>
            </section>
        </section>)
}

export default withAuthenticator(Admin, customAuthComponent)
