import styles from "./AddressForm.module.css";
import React from "react";
import {useForm} from "react-hook-form";
import ButtonSmall from "../../Buttons/ButtonSmall/ButtonSmall";


export default function AddressForm({onSubmit, backendError, onClick}) {
    const {register, handleSubmit, formState: {errors}} = useForm();
    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                <ButtonSmall title="X" onClick={onClick}/>
                <label htmlFor="street-name">
                    Streetname:
                    <div className={styles.error}>{errors?.streetName?.message} </div>
                    <input
                        name="streetName"
                        id="street-name"
                        type="text"
                        {...register("streetName", {
                            required: "This field is required",
                            minLength: {value: 4, message: "Street name must be at least 4 characters long."}
                        })}/>
                </label>
                <label htmlFor="house-number">
                    House nr.:
                    <div className={styles.error}>{errors?.houseNumber?.message} </div>
                    <input
                        name="houseNumber"
                        id="house-number"
                        type="text"
                        {...register("houseNumber", {
                            required: "This field is required",
                            minLength: {value: 1, message: "House nr must be at least 1 character long."}
                        })}/>
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
                            minLength: {value: 6, message: "Postal code must be at least 6 characters long."}
                        })}/>
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
                            minLength: {value: 3, message: "City must be at least 3 characters long."}
                        })}/>
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
                            minLength: {value: 3, message: "Country must be at least 3 characters long."}
                        })}/>
                </label>
                {backendError && backendError.map(error => <div className={styles["error-big"]}>{error}</div>)}
                <div className={styles["submit-button"]}>
                <ButtonSmall
                    type="submit"
                    title="Add address"
                />
                </div>
            </form>
        </div>)
}