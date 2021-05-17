import React ,{useState, useEffect} from 'react';
import {useHistory} from "react-router-dom";
import {useForm} from "react-hook-form";
import axios from "axios";
import styles from "./Register.module.css"


function Register() {
    const history = useHistory()
    const [succes, toggleSucces] = useState(false);
    const [userType, setUserType] = useState(null);
    const [backendError, setBackendError] = useState([]);
    const [addVenue, setAddVenue] = useState(false);
    const [className, setClassName] = useState(`${styles.fieldset}`);
    const [userOwner, setUserOwner] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();

    async function onSubmit(data)    {
        try {
            /*Endpoints voor beide soorten accounts, bepaald door de userType state*/
            const postData = await axios.post(`http://localhost:8080/${userType}`, {
                username: data.username,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
                emailAddress: data.emailAddress,
                repeatedPassword: data.repeatedPassword
            })
            const addAuthorities = await axios.post(`http://localhost:8080/users/${data.username}/authorities`, {
                username: data.username,
                authority: `ROLE_${userType.toUpperCase()}`
            })
            /*Endpoints voor horeca-eigenaren:*/
            if (userOwner) {
            const addVenue = await axios.post(`http://localhost:8080/usersOwner/${data.username}/venues`, {
                venueName: data.venueName
            })
            const getVenueId = await axios.get(`http://localhost:8080/usersOwner/${data.username}/venues/id`)
            console.log(getVenueId)
            const addAddressToVenue = await axios.post(`http://localhost:8080/usersOwner/${data.username}/venues/${getVenueId.data}/address`, {
                streetName: data.streetName
            })}
            history.push("/login");
            toggleSucces(true);
        } catch(e) {
            setBackendError([e.response.data.message]);
            console.error(e);
        }
    }
    return(
        <>
            {/*Hier wordt de keuze gemaakt tussen een gewone account en een account voor horeca eigenaren dmv de userType state. In de backend
             wordt er onderscheid gemaakt tussen beide accountsoorten dus op basis van deze state wordt de postData endpoint bepaald. Als er gekozen
            wordt voor een eigenaarsaccount dan wordt ook de userOwner state op true gezet en zijn de relevante endpoints bereikbaar. Bovendien
            kan de eigenaar dan zijn horecalocatie alvast toevoegen of ervoor kiezen om dit later te doen.*/}
            {!userType && !userOwner &&
            <div className={styles["register-choice"]}>
            <button
                type="submit"
                onClick={()=> setUserType("usersNormal")}
            >
                REGISTER AS USER
            </button>
            <button
                type="submit"
                onClick={()=> setUserType("usersOwner") & setUserOwner(true)}
            >
                REGISTER AS VENUE OWNER
            </button>
            </div>}

            {userType  &&
            <div className={styles.container}>
            <form
                className={styles["register-normal-user"]}
                onSubmit={handleSubmit(onSubmit)}
            >
                <fieldset className={className}>
                    <button
                        onClick={()=>setUserType(null) & setUserOwner(false)}
                        onKeyUp={null}
                    >Back</button>

                    <h2> Please fill in your details here </h2>
                    <label htmlFor="username">
                        Username:
                        <div className={styles.error}>{errors?.username?.message} </div>
                        <input
                            name="username"
                            id="username"

                            type="text"
                            {...register("username", {required: "Username is required",
                                minLength: {value: 4, message:"Username must be at least 4 characters long."}})}/>
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
                            {...register("password", {required: "This field is required",
                                minLength: {value: 8, message:"Password must be between 8 and 15 characters long"},
                            maxLength: {value:15}, message:"Password must be between 8 and 15 characters long"})}
                        />
                    </label>
                    <label htmlFor="repeated-password">
                        Repeat Password:
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
                    {/*Als er gekozen is voor een eigenaaraccount wordt er hieronder een extra button toegevoegd waarmee
                     men een horecalocatie kan toevoegen. Een extra fieldset voor het invullen van de gegevens
                     verschijnt naast de bestaande fieldset na een klik op de button. Mocht de gebruiker zich bedenken
                     dan kan hij alsnog ervoor kiezen om het later te doen dmv de 'add later' button. */}
                {userOwner && !addVenue && <div><p>Venues can be added after registration or click the button below:
                </p><button
                    onClick={()=>setAddVenue(true) & setClassName(`${styles.fieldsetafter}`)}>
                    Add venue
                </button></div>}

                {addVenue && <fieldset className={styles["add-venue"]}>
                    {addVenue && <div><button className={styles.addlater} onClick={()=>setAddVenue(false) & setClassName(`${styles.fieldset}`)}> Add later</button></div>}
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
                </fieldset>
                    }
                    <button
                        type="submit"
                    >
                        REGISTER
                    </button>
                    {backendError && backendError.map(error=> <div className={styles["error-big"]}>{error}</div>)}
                    {succes && <p>You are ready to use Lively!</p>}
                </fieldset>
            </form>
            </div>}
        </>  )
}

export default Register;