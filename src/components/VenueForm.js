import React, {useState} from 'react';
import {useForm} from "react-hook-form";
import styles from "../pages/Register.module.css";
import axios from "axios";

function VenueForm({username}) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [fileDisabled, toggleFileDisabled] = useState(false);
    const [imageDisabled, toggleImageDisabled] = useState(false);
    const [backendError, setBackendError] = useState([]);
    const [image, setImage] = useState("");

    async function onSubmit(data){
        try{const addVenue = await axios.post(`http://localhost:8080/usersOwner/${username}/venues`, {
            venueName: data.venueName,
            capacity: data.capacity,
            image: image || data.image,

        })
        const getVenueId = await axios.get(`http://localhost:8080/usersOwner/${username}/venues/id`)
        const addAddressToVenue = await axios.post(`http://localhost:8080/usersOwner/${username}/venues/${getVenueId.data}/address`, {
            streetName: data.streetName,
            houseNumber: data.houseNumber,
            postalCode: data.postalCode,
            city: data.city,
            country: data.country
        })
            window.location.reload(false);
        }
        catch (e){
            setBackendError([e.response.data.message])
            console.error(e)
        }
    }
    function uploadImage(e) {
        const files = e.target.files[0];
        const formData = new FormData();
        const fileSize = files.size;
        if (fileSize >= 5000000){
            setBackendError(["Uploaded file size exceeds 5MB"])
        } else {
            formData.append("upload_preset", "livelyupload");
            formData.append("file", files);

            axios.post(`https://api.cloudinary.com/v1_1/dhqkuww2g/image/upload`, formData)
                .then(res => setImage(res.data.secure_url))
                .catch(err => console.log(err));
        }}
    return (
    <form onSubmit={handleSubmit(onSubmit)}>
         <fieldset>
            <p>Please fill in venue information here</p>
            <label htmlFor="venue-name">
                Venue name:
            <div className={styles.error}>{errors?.venueName?.message} </div>
                <input
                name="venueName"
                id="venue-name"
                type="text"
                {...register("venueName", {required: "This field is required"})}
                />
            </label>
            <label htmlFor="capacity">
                Capacity:
            <div className={styles.error}>{errors?.capacity?.message} </div>
            <input
            name="capacity"
            id="capacity"
            type="int"
            {...register("capacity", {required: "This field is required",
                maxLength:{value: 6}, message: "Capacity must be up to 6 characters long"})}
            />
            </label>
                <h1>Location:</h1>
            <label htmlFor="venue-street-name">
                Street name:
            <div className={styles.error}>{errors?.streetName?.message} </div>
            <input
                name="streetName"
                id="venue-street-name"
                type="text"
                {...register("streetName", {required: "This field is required"})}
            />
            </label>
            <label htmlFor="venue-house-nr">
                House number:
            <div className={styles.error}>{errors?.houseNumber?.message} </div>
            <input
                name="houseNumber"
                id="venue-house-nr"
                type="text"
                {...register("houseNumber", {required: "This field is required",
                    maxLength:{value: 4}, message: "Housenr must be up to 4 characters long"})}
            />
            </label>
            <label htmlFor="postal-code">
                Postal code:
            <div className={styles.error}>{errors?.postalCode?.message} </div>
            <input
                name="postalCode"
                id="postal-code"
                type="text"
                {...register("postalCode", {required: "This field is required",
                    maxLength:{value: 8}, message: "Postal code must be up to 8 characters long"})}
            />
            </label>
            <label htmlFor="city">
                City:
            <div className={styles.error}>{errors?.city?.message} </div>
                <input
                    name="city"
                    id="city"
                    type="text"
                    {...register("city", {required: "This field is required",
                    maxLength:{value: 40}, message: "City must be up to 40 characters long"})}
                />
            </label>
            <label htmlFor="country">
                Country:
            <div className={styles.error}>{errors?.country?.message} </div>
                <input
                    name="country"
                    id="country"
                    type="text"
                    {...register("country", {required: "This field is required",
                    maxLength:{value: 40}, message: "Country must be up to 40 characters long"})}
                />
            </label>
            <label htmlFor="file">
                Upload picture (maximum size= 5MB):
            <div className={styles.error}>{errors?.file?.message} </div>
                <input
                    disabled={fileDisabled}
                    name="file"
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={(event => uploadImage(event))}
                    onInput={toggleImageDisabled}
                />
            </label>
            <label htmlFor="image-url">
                Or add picture url:
            <div className={styles.error}>{errors?.image?.message} </div>
                <input
                    name="image"
                    id="image-url"
                    type="text"
                    onInput={toggleFileDisabled}
                    {...register("image")}
                />
            </label>
            {backendError && backendError.map(error=> <div className={styles["error-big"]}>{error}</div>)}
            <button type="submit"> Add venue</button>
        </fieldset>
    </form>
    )
}

export default VenueForm;
