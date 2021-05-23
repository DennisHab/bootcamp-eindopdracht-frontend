import React, {useState, useContext} from "react";
import {useForm} from "react-hook-form";
import {AuthContext} from "../context/AuthContext";
import styles from "./AddressForm.module.css";

function EventForm() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    return(
        <div className="container">
            <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset>
                    <label htmlFor="event-name">
                        <div className={styles.error}>{errors?.name?.message} </div>
                        <input
                            name="name"
                            id="event-name"
                            type="text"
                            {...register("name", {required: "This field is required",
                                minLength: {value: 4, message:"Event name must be between 4 and 25 characters."},
                                maxLength: {value: 25, message:"Event name must be between 4 and 25 characters."}})}/>
                        />
                    </label>
                    <label htmlFor="event-type">
                        <select id="event-type" name="type" size="3">
                            <option value="Themed party">Themed party</option>
                            <option value="Live music">Live music</option>
                            <option value="Open stage">Open stage</option>
                        </select>
                    </label>
                </fieldset>
            </form>
        </div>
    )
}
