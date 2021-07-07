import React, {useContext, useState} from 'react';
import {Link, useHistory} from "react-router-dom";
import {useForm} from "react-hook-form";
import axios from "axios";
import styles from "./CSS/Login.module.css";
import {AuthContext} from "../context/AuthContext";
import LoadingAnimation from "../components/LoadingAnimation/LoadingAnimation";

function Login() {
    const {login} = useContext(AuthContext);
    const {register, handleSubmit, formState: {errors}} = useForm();
    const [backendError, setBackEndError] = useState([]);
    const [succes, toggleSucces] = useState(false);

    async function onSubmit(data) {
        try {
            const postData = await axios.post("http://localhost:8080/authenticate", {
                username: data.username,
                password: data.password
            })
            toggleSucces(true);
            setTimeout(() => login(postData.data.jwt), 2000)
        } catch (e) {
            setBackEndError([e.response.data.message]);
            console.error(e);
        }
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={styles.container}>
            <fieldset className={styles.fieldset}>
                <label htmlFor="username">
                    <div className={styles.error}>{errors?.username?.message} </div>
                    <input
                        placeholder="Username"
                        name="username"
                        id="username"
                        type="text"
                        {...register("username", {required: "This field is required"})}
                    />
                </label>
                <label htmlFor="password">
                    <div className={styles.error}>{errors?.password?.message} </div>
                    <input
                        placeholder="Password"
                        name="password"
                        id="password"
                        type="password"
                        {...register("password", {required: "This field is required"})}
                    />
                </label>
                {backendError && backendError.map(error => <div className={styles["error-big"]}>{error}</div>)}
                <button
                    type="submit"
                >
                    Login
                </button>
                Dont have a account? Register <Link to={"/register"}><b> here </b></Link>
                {succes && <div className={styles.succes}><LoadingAnimation/></div>}
            </fieldset>

        </form>
    )
}

export default Login;