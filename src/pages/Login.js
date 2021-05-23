import React ,{useState, useContext} from 'react';
import {useHistory} from "react-router-dom";
import {set, useForm} from "react-hook-form";
import axios from "axios";
import styles from "./Login.module.css";
import {AuthContext} from "../context/AuthContext";

function Login() {
    const { login } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [backendError, setBackEndError] = useState([]);
    const history = useHistory();
    const [succes, toggleSucces] = useState(false);

    async function onSubmit(data) {
        try{
            const postData = await axios.post("http://localhost:8080/authenticate", {
                username: data.username,
                password: data.password
            })
            login(postData.data.jwt);
        }
        catch(e) {
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
                    Username:
                    <div className={styles.error}>{errors?.username?.message} </div>
                    <input
                        name="username"
                        id="username"
                        type="text"
                        {...register("username", {required: "This field is required"})}
                    />
                </label>
                <label htmlFor="password">
                    Password:
                    <div className={styles.error}>{errors?.password?.message} </div>
                    <input
                        name="password"
                        id="password"
                        type="password"
                        {...register("password", {required: "This field is required"})}
                    />
                </label>
                {backendError && backendError.map(error=> <div className={styles["error-big"]}>{error}</div>)}
                <button
                    type="submit"
                >
                    Login
                </button>
            </fieldset>

    </form>
    )
}

export default Login;