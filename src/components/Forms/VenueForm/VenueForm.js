import React, {useState} from 'react';
import {useForm} from "react-hook-form";
import styles from "./VenueForm.module.css";
import axios from "axios";
import ButtonSmall from "../../Buttons/ButtonSmall/ButtonSmall";
import ButtonLarge from "../../Buttons/ButtonLarge/ButtonLarge";

function VenueForm({username, onClick}) {
    const {register, handleSubmit, formState: {errors}} = useForm();
    const [backendError, setBackendError] = useState([]);
    const Token = localStorage.getItem('jwt');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`
    }

    async function onSubmit(data) {
        try {
            const addVenue = await axios.post(`http://localhost:8080/userOwner/${username}/venues`, {
                venueName: data.venueName,
                capacity: data.capacity,
                facebook: data.facebook,
                instagram: data.instagram,
                website: data.website,
                address: {
                    streetName: data.streetName,
                    houseNumber: data.houseNumber,
                    postalCode: data.postalCode,
                    city: data.city,
                    country: data.country
                }

            }, {
                headers: headers
            })
            window.location.reload(false);
        } catch (e) {
            setBackendError([e.response.data.message])
            console.error(e)
        }
    }

    return (
        <div className={styles.container}>
            <ButtonSmall title="X" onClick={onClick}/>
            <p>Please fill in venue information here</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles["venue-form"]}>
                    <fieldset className={styles["form-left"]}>
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
                                {...register("capacity", {
                                    required: "This field is required",
                                    maxLength: {value: 6}, message: "Capacity must be up to 6 characters long"
                                })}
                            />
                        </label>
                        <h1>Social media:</h1>
                        <label htmlFor="facebook-page">
                            Facebook:
                            <div className={styles.error}>{errors?.facebook?.message} </div>
                            <input
                                name="facebook"
                                id="facebook-page"
                                type="text"
                                {...register("facebook", {
                                    maxLength: 100,
                                    message: "Length can't exceed 100 characters"
                                })}
                            />
                        </label>
                        <label htmlFor="instagram-page">
                            Instagram:
                            <div className={styles.error}>{errors?.instagram?.message} </div>
                            <input
                                name="instagram"
                                id="instagram-page"
                                type="text"
                                {...register("instagram", {
                                    maxLength: 100,
                                    message: "Length can't exceed 100 characters"
                                })}
                            />
                        </label>
                        <label htmlFor="website">
                            Website:
                            <div className={styles.error}>{errors?.website?.message} </div>
                            <input
                                name="website"
                                id="website"
                                type="text"
                                {...register("website", {
                                    maxLength: 100,
                                    message: "Length can't exceed 100 characters"
                                })}
                            />
                        </label>

                    </fieldset>
                    <fieldset className={styles["form-right"]}>
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
                                type="int"
                                {...register("houseNumber", {
                                    required: "This field is required",
                                    maxLength: {value: 4}, message: "Housenr must be up to 4 characters long"
                                })}
                            />
                        </label>

                        <label htmlFor="postal-code">
                            Postal code:
                            <div className={styles.error}>{errors?.postalCode?.message} </div>
                            <input
                                name="postalCode"
                                id="postal-code"
                                type="text"
                                {...register("postalCode", {
                                    required: "This field is required",
                                    maxLength: {value: 8}, message: "Postal code must be up to 8 characters long"
                                })}
                            />
                        </label>
                        <label htmlFor="city">
                            City:
                            <div className={styles.error}>{errors?.city?.message} </div>
                            <input
                                name="city"
                                id="city"
                                type="text"
                                {...register("city", {
                                    required: "This field is required",
                                    maxLength: {value: 40}, message: "City must be up to 40 characters long"
                                })}
                            />
                        </label>
                        <label htmlFor="country">
                            Country:
                            <div className={styles.error}>{errors?.country?.message} </div>
                            <input
                                name="country"
                                id="country"
                                type="text"
                                {...register("country", {
                                    required: "This field is required",
                                    maxLength: {value: 40}, message: "Country must be up to 40 characters long"
                                })}
                            />
                        </label>
                    </fieldset>

                </div>
                {backendError && backendError.map(error => <div className={styles["error-big"]}>{error}</div>)}
                <ButtonLarge
                    type="submit"
                    title="Add venue"
                />
            </form>
        </div>
    )
}

export default VenueForm;
