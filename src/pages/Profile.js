import React, {useContext, useState} from 'react';
import {AuthContext} from "../context/AuthContext";
import {useHistory} from "react-router-dom"
import styles from "./Profile.module.css";
import {useForm} from "react-hook-form";
import axios from "axios";
import AddressForm from "../components/AddressForm";
import VenueForm from "../components/VenueForm";

function Profile() {
    const history = useHistory();
    const { user, logout } = useContext(AuthContext);
    const [addressAdd, setAddressAdd] = useState(false);
    const [addressChange, setAddressChange] = useState(false);
    const [passwordChange, setPasswordChange] = useState(false);
    const [venueAdd, setVenueAdd] = useState(false);
    const [backendError, setBackenderror] = useState([]);
    const { register, handleSubmit, formState: { errors } } = useForm();
    console.log(user)

    async function onSubmit(data) {
        try{
            if(!addressChange && !passwordChange){const addAddress = await axios.post(`http://localhost:8080/users/${user.username}/addresses`, {
                streetName : data.streetName,
                houseNumber : data.houseNumber,
                postalCode : data.postalCode,
                city : data.city,
                country: data.country
            })}
            if(addressChange && !passwordChange){   const changeAddress = await axios.put(`http://localhost:8080/users/${user.username}/addresses/${user.address.id}`,{
                    streetName : data.streetName,
                    houseNumber : data.houseNumber,
                    postalCode : data.postalCode,
                    city : data.city,
                    country: data.country
                })}
            if(passwordChange){
                const updatePassword = await axios.put(`http://localhost:8080/users/${user.username}/changepassword`, {
                    passwordValidation: data.passwordValidation,
                    password: data.password,
                    repeatedPassword: data.repeatedPassword
                })
            }
            /*if(passwordChange){logout}*/
            window.location.reload(false);
        }
        catch(e){
            console.error(e);
            setBackenderror([e.response.data.message]);
        }
    }
    return (
        <div className={styles.container}>
            <fieldset className={styles.profile}>
                <h1>Profile of {user && user.username}</h1>
                <span><p>Name: </p>  {user && user.firstName} {user && user.lastName}</span>
                <span><p> Email:</p> {user && user.emailAddress}</span>
                {user.authorities[0].authority === "ROLE_USERSNORMAL" && <>
                <span><p> Account type: </p> Normal user </span> </>}
                {user.authorities[0].authority === "ROLE_USERSOWNER" && <>
                <span> <p> Account type: </p> Venue owner </span> </>}
                {user.address !== null &&
                    <>
                    <span><p> Streetname:</p> {user.address.streetName}</span>
                    <span><p> Housenr.:</p> {user.address.houseNumber}</span>
                    <span><p> Postal code:</p> {user.address.postalCode}</span>
                    <span><p> City:</p> {user.address.city}</span>
                    <span><p> Country:</p> {user.address.country}</span>
                    </>}
                    {!addressAdd && user.address === null && !passwordChange && <button onClick={()=> setAddressAdd(true)}> Add Address</button>}
                    {addressAdd &&  <button onClick={()=> setAddressAdd(false)}> Add later</button>}
                    {user.authorities[0].authority === "ROLE_USERSOWNER" && <button onClick={()=> setVenueAdd(true)}> Add venue </button>}
                    {user.address !== null && !addressChange && <button onClick={()=> setAddressChange(true)}> Change address</button> }
                    {addressChange && <h1>Fill in your new address</h1>}

                {addressAdd | addressChange ?
                    <AddressForm
                        onSubmit = {onSubmit}
                        backendError = {backendError}
                    /> : null}
                {!addressChange && !addressAdd && !passwordChange &&<button onClick={()=> setPasswordChange(true)}>Change password</button>}
                {passwordChange &&
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
                        <button type="submit">
                            Change password
                        </button>
                    </form>}
                        {venueAdd &&
                            <VenueForm
                                username={user.username}
                            />
                        }
                        {user.authorities[0].authority === "ROLE_USERSOWNER" &&<>
                            <h1>Registered venues for {user.username}:</h1>

                            {user.venueList.map((venue)=> { return <div className={styles.venue}>
                                    <span><h2> {venue.venueName}</h2></span>
                                {venue.image && <img src={venue.image} alt="venue-image" width="220px" height="170px"/>}

                                <span><p> Capacity: </p>{venue.capacity}</span>
                                <h2> Venue address:</h2>
                                    <span><p> Streetname:</p> {venue.address.streetName}</span>
                                    <span><p> Housenr.:</p> {venue.address.houseNumber}</span>
                                    <span><p> Postal code:</p> {venue.address.postalCode}</span>
                                    <span><p> City:</p> {venue.address.city}</span>
                                    <span><p> Country:</p> {venue.address.country}</span>
                                </div>
                            }
                            )}
                        </>
                        }
            </fieldset>
        </div>
    )
}
export default Profile;