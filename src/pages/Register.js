import React, {useState} from 'react';
import {useHistory} from "react-router-dom";
import {useForm} from "react-hook-form";
import axios from "axios";
import styles from "./CSS/Register.module.css";
import LoadingAnimation from "../components/LoadingAnimation/LoadingAnimation";

function Register() {
    const history = useHistory()
    const [succes, toggleSucces] = useState(false);
    const [userType, setUserType] = useState(null);
    const [backendError, setBackendError] = useState([]);
    const [className, setClassName] = useState(`${styles["register-form"]}`);
    const [formClassName, setFormClassName] = useState(`${styles["fieldsetafter"]}`)
    const [userOwner, setUserOwner] = useState(false);
    const [succesText, toggleSuccesText] = useState(false);
    const {register, handleSubmit, formState: {errors}} = useForm();

    async function onSubmit(data) {
        try {
            /*Endpoints voor beide soorten accounts, bepaald door de userType state*/
            const postData = await axios.post(`http://localhost:8080/adduser/${userType}`, {
                username: data.username,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
                emailAddress: data.emailAddress,
                repeatedPassword: data.repeatedPassword
            })
            toggleSucces(true);
            setTimeout(() => {
                toggleSuccesText(true)
            }, 2000)
            setTimeout(() => {
                history.push("/login")
            }, 4000)
        } catch (e) {
            setBackendError([e.response.data.message]);
            console.error(e);
        }
    }

    return (
        <div className={styles.container}>
            {/*Hier wordt de keuze gemaakt tussen een gewone account en een account voor horeca eigenaren dmv de userType state. In de backend
             wordt er onderscheid gemaakt tussen beide accountsoorten dus op basis van deze state wordt de postData endpoint bepaald. Als er gekozen
            wordt voor een eigenaarsaccount dan wordt ook de userOwner state op true gezet en zijn de relevante endpoints bereikbaar.*/}
            {!userType && !userOwner &&
            <div className={styles["register-choice"]}>
                <button
                    type="submit"
                    onClick={() => setUserType("usersNormal") & setFormClassName(`${styles["form-container"]}`)}
                >
                    REGISTER AS USER
                </button>
                <button
                    type="submit"
                    onClick={() => setUserType("usersOwner") & setUserOwner(true) & setFormClassName(`${styles["form-container"]}`)}
                >
                    REGISTER AS VENUE OWNER
                </button>
            </div>}
            <form
                className={formClassName}
                onSubmit={handleSubmit(onSubmit)}
            >
                {userType &&
                <fieldset className={className}>
                    {/*<button
                        onClick={()=>setUserType(null) & setUserOwner(false) & setFormClassName(`${styles.fieldsetafter}`)}
                        onKeyUp={null}
                    >
                        Back
                    </button>*/}
                    <h2> Please fill in your details here </h2>
                    <label htmlFor="username">
                        Username
                        <div className={styles.error}>{errors?.username?.message} </div>
                        <input
                            name="username"
                            placeholder="Your username will be visible to other users on the platform"
                            id="username"
                            type="text"
                            {...register("username", {
                                required: "Username is required",
                                minLength: {value: 4, message: "Username must be at least 4 characters long."}
                            })}/>
                    </label>
                    <label htmlFor="first-name">
                        First name:
                        <div className={styles.error}>{errors?.firstName?.message} </div>
                        <input
                            name="firstName"
                            id="first-name"
                            type="text"
                            {...register("firstName", {required: "This field is required"})}
                        />
                    </label>
                    <label htmlFor="last-name">
                        Last name:
                        <div className={styles.error}>{errors?.lastName?.message} </div>
                        <input
                            name="lastName"
                            id="last-name"
                            type="text"
                            {...register("lastName", {required: "This field is required"})}
                        />
                    </label>
                    <label htmlFor="email">
                        E-mail:
                        <div className={styles.error}>{errors?.emailAddress?.message} </div>
                        <input
                            name="email"
                            id="email"
                            type="email"
                            {...register("emailAddress", {required: "This field is required"})}
                        />
                    </label>
                    <label htmlFor="password">
                        Password:
                        <div className={styles.error}>{errors?.password?.message} </div>
                        <input
                            name="password"
                            id="password"
                            type="password"
                            {...register("password", {
                                required: "This field is required",
                                minLength: {value: 8, message: "Password must be between 8 and 15 characters long"},
                                maxLength: {value: 15}, message: "Password must be between 8 and 15 characters long"
                            })}
                        />
                    </label>
                    <label htmlFor="repeated-password">
                        Repeat Password:
                        <div className={styles.error}>{errors?.repeatedPassword?.message} </div>
                        <input
                            name="repeatedPassword"
                            id="repeated-password"
                            type="password"
                            {...register("repeatedPassword", {
                                required: "This field is required",
                                minLength: {value: 8, message: "Password must be between 8 and 15 characters long"},
                                maxLength: {value: 15}, message: "Password must be between 8 and 15 characters long"
                            })}
                        />
                    </label>
                    <button type="submit">
                        Register and continue to website
                    </button>
                    {backendError && backendError.map(error => <div className={styles["error-big"]}>{error}</div>)}
                    {succes && <div className={styles.succes}>
                        {!succesText && <LoadingAnimation/>}
                        {succesText && <p>You have succesfully registered. Redirecting to login page....</p>}
                    </div>}
                </fieldset>
                }
            </form>
        </div>
    )
}

export default Register;