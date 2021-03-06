import {useForm} from "react-hook-form";
import React, {useState, useContext} from "react";
import axios from "axios";
import {AuthContext} from "../../../context/AuthContext";
import styles from "./PasswordChange.module.css"
import ButtonSmall from "../../Buttons/ButtonSmall/ButtonSmall";

function PasswordChange(){
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [backendError, setBackendError] = useState("");
    const {user} = useContext(AuthContext);
    const [succes, toggleSucces] = useState(false);
    const Token = localStorage.getItem('jwt');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`
    }

    async function onSubmit(data){
        try{
            const updatePassword = await axios.put(`http://localhost:8080/changepassword/${user.username}`, {
                passwordValidation: data.passwordValidation,
                password: data.password,
                repeatedPassword: data.repeatedPassword
            }, {
                headers:headers
            })
            toggleSucces(true);
            setTimeout(()=>window.location.reload(false), 2000)
        }
        catch (e){
            console.log(e)
            console.error(e)
            setBackendError(e.response.data.message)
        }
    }
return(
    <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="password-validation">
            Old password:
            <div className={styles.error}>{errors?.passwordValidation?.message} </div>
            <input
                name="passwordValidation"
                id="password-validation"
                type="password"
                {...register("passwordValidation", {required: "This field is required",
                minLength: {value: 8, message:"Password must be between 8 and 15 characters long"},
                maxLength: {value:15}, message:"Password must be between 8 and 15 characters long"})}
            />
        </label>
        <label htmlFor="password">
            New password:
            <div className={styles.error}>{errors?.password?.message} </div>
            <input
                name="password"
                id="password"
                type="password"
                {...register("password", {required: "This field is required",
                minLength: {value: 8, message:"Password must be between 8 and 15 characters long"},
                maxLength: {value:15}, message:"Password must be between 8 and 15 characters long"})}
            />
        </label>
        <label htmlFor="repeated-password">
            Repeat new password:
            <div className={styles.error}>{errors?.repeatedPassword?.message} </div>
            <input
                name="repeatedPassword"
                id="repeated-password"
                type="password"
                {...register("repeatedPassword", {required: "This field is required",
                minLength: {value: 8, message:"Password must be between 8 and 15 characters long"},
                maxLength: {value:15}, message:"Password must be between 8 and 15 characters long"})}
            />
        </label>
        {backendError && <div className={styles["backend-error"]}>{backendError}</div>}
            <ButtonSmall
                type="submit"
                title="Change password"
            />
        {succes && <div className={styles.succes}> PASSWORD SUCCESFULLY CHANGED! </div> }
</form>
    )
}

export default PasswordChange;