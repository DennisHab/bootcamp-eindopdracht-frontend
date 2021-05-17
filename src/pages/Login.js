import React ,{useState} from 'react';
import {useHistory} from "react-router-dom";
import {useForm} from "react-hook-form";
import axios from "axios";
import styles from "./Login.module.css"

function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const history = useHistory();
    const [succes, toggleSucces] = useState(false);

    async function onSubmit(data) {
        console.log(data)
        try{
            const postData = await axios.post("http://localhost:8080/authenticate", {
                username: data.username,
                password: data.password
            }, {
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                }, body: JSON.stringify(data)})
            console.log(postData)
            history.push("/");
            toggleSucces(true);
        }
        catch(e) {
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