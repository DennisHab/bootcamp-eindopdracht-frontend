import React ,{useState, useEffect} from 'react';
import {useHistory} from "react-router-dom";
import {useForm} from "react-hook-form";
import axios from "axios";
import styles from "./Register.module.css";
import VenueForm from "../components/VenueForm";

function Register() {
    const history = useHistory()
    const [succes, toggleSucces] = useState(false);
    const [userType, setUserType] = useState(null);
    const [backendError, setBackendError] = useState([]);
    const [addVenue, setAddVenue] = useState(false);
    const [className, setClassName] = useState(`${styles["register-form"]}`);
    const [formClassName, setFormClassName] = useState(`${styles["fieldsetafter"]}`)
    const [userOwner, setUserOwner] = useState(false);
    const [image, setImage] = useState('');
    const [fileDisabled, toggleFileDisabled] = useState(false);
    const [imageDisabled, toggleImageDisabled] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();

    function uploadImage(e) {
        const files = e.target.files[0];
        const formData = new FormData();
        const fileSize = files.size;
        if (fileSize >= 5000000){
            setBackendError(["Uploaded file size exceeds 5MB"])
        } else {
            formData.append("upload_preset", "livelyupload");
            formData.append("file", files);

            axios.post(`https://api.cloudinary.com/v1_1/dhqkuww2g/image/upload`, formData)
                .then(res => setImage(res.data.secure_url))
                .catch(err => console.log(err));
        }}

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
            if(userOwner && addVenue){
            const addVenue = await axios.post(`http://localhost:8080/usersOwner/${data.username}/venues`, {
                venueName: data.venueName,
                capacity: data.capacity,
                image: image || data.image,
            })
            const getVenueId = await axios.get(`http://localhost:8080/usersOwner/${data.username}/venues/id`)
            const addAddressToVenue = await axios.post(`http://localhost:8080/usersOwner/${data.username}/venues/${getVenueId.data}/address`, {
                streetName: data.streetName,
                houseNumber: data.houseNumber,
                postalCode: data.postalCode,
                city: data.city,
                country: data.country
            })
            }
            toggleSucces(true);
            setTimeout(()=> {history.push("/login")}, 3000)

        } catch(e) {
            setBackendError([e.response.data.message]);
            console.error(e);
        }
    }
    return(
        <div className={styles.container}>
            {/*Hier wordt de keuze gemaakt tussen een gewone account en een account voor horeca eigenaren dmv de userType state. In de backend
             wordt er onderscheid gemaakt tussen beide accountsoorten dus op basis van deze state wordt de postData endpoint bepaald. Als er gekozen
            wordt voor een eigenaarsaccount dan wordt ook de userOwner state op true gezet en zijn de relevante endpoints bereikbaar. Bovendien
            kan de eigenaar dan zijn horecalocatie alvast toevoegen of ervoor kiezen om dit later te doen.*/}
            {!userType && !userOwner &&
            <div className={styles["register-choice"]}>
            <button
                type="submit"
                onClick={()=> setUserType("usersNormal") & setFormClassName(`${styles["form-container"]}`)}
            >
                REGISTER AS USER
            </button>
            <button
                type="submit"
                onClick={()=> setUserType("usersOwner") & setUserOwner(true) & setFormClassName(`${styles["form-container"]}`)}
            >
                REGISTER AS VENUE OWNER
            </button>
            </div>}
            <form
                className={formClassName}
                onSubmit={handleSubmit(onSubmit)}
            >
            {userType  && !addVenue &&
                <fieldset className={className}>
                    <button
                        onClick={()=>setUserType(null) & setUserOwner(false) & setFormClassName(`${styles.fieldsetafter}`)}
                        onKeyUp={null}
                    >
                        Back
                    </button>
                    <h2> Please fill in your details here </h2>
                    <label htmlFor="username">
                        Username
                        <div className={styles.error}>{errors?.username?.message} </div>
                        <input
                            name="username"
                            placeholder="Your username will be visible to other users on the platform"
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
                    onClick={()=> setAddVenue(true) & setClassName(`${styles.fieldsetafter}`)}>
                    Add venue
                </button>
                </div>}
                    <button type="submit">
                    Register and continue to website
                    </button>
                {backendError && backendError.map(error=> <div className={styles["error-big"]}>{error}</div>)}
                    {succes && <div className={styles.succes}>You have succesfully registered. Redirecting to login page....</div> }
                    </fieldset>

            }
                {addVenue && <fieldset className={styles["add-venue"]}>
                    {addVenue && <div><button className={styles.addlater} onClick={()=>setAddVenue(false) & setClassName(`${styles["register-form"]}`)}> Add later</button></div>}
                    <p>Please fill in venue information here. Fields marked with "*" are required</p>
                    <label htmlFor="venue-name">
                        Venue name*
                        <div className={styles.error}>{errors?.venueName?.message} </div>
                        <input
                            name="venueName"
                            id="venue-name"
                            type="text"
                            {...register("venueName", {required: "This field is required"})}
                        />
                    </label>
                    <label htmlFor="capacity">
                        Capacity*
                        <div className={styles.error}>{errors?.capacity?.message} </div>
                        <input
                            name="capacity"
                            id="capacity"
                            type="int"
                            {...register("capacity", {required: "This field is required",
                                maxLength:{value: 6}, message: "Capacity must be up to 6 characters long"})}
                        />
                    </label>
                    <h1>Location:</h1>
                    <label htmlFor="venue-street-name">
                        Street name*
                        <div className={styles.error}>{errors?.streetName?.message} </div>
                        <input
                            name="streetName"
                            id="venue-street-name"
                            type="text"
                            {...register("streetName", {required: "This field is required"})}
                        />
                    </label>
                    <label htmlFor="venue-house-nr">
                        House number*
                        <div className={styles.error}>{errors?.houseNumber?.message} </div>
                        <input
                            name="houseNumber"
                            id="venue-house-nr"
                            type="text"
                            {...register("houseNumber", {required: "This field is required",
                                maxLength:{value: 4}, message: "Housenr must be up to 4 characters long"})}
                        />
                    </label>
                    <label htmlFor="postal-code">
                        Postal code:
                        <div className={styles.error}>{errors?.postalCode?.message} </div>
                        <input
                            name="postalCode"
                            id="postal-code"
                            type="text"
                            {...register("postalCode", {maxLength:8, message: "Postal code must be up to 8 characters long"})}
                        />
                    </label>
                    <label htmlFor="city">
                        City*
                        <div className={styles.error}>{errors?.city?.message} </div>
                        <input
                            name="city"
                            id="city"
                            type="text"
                            {...register("city", {required: "This field is required",
                                maxLength:{value: 40}, message: "City must be up to 40 characters long"})}
                        />
                    </label>
                    <label htmlFor="country">
                        Country:
                        <div className={styles.error}>{errors?.country?.message} </div>
                        <input
                            name="country"
                            id="country"
                            type="text"
                            {...register("country", {maxLength: 40, message: "Country must be up to 40 characters long"})}
                        />
                    </label>
                    <label htmlFor="file">
                        Upload picture (maximum size= 5MB):
                        <div className={styles.error}>{errors?.file?.message} </div>
                        <input
                            disabled={fileDisabled}
                            name="file"
                            type="file"
                            accept=".png,.jpg,.jpeg"
                            onChange={(event => uploadImage(event))}
                            onInput={toggleImageDisabled}
                        />
                    </label>
                    <label htmlFor="image-url">
                        Or add picture url:
                        <div className={styles.error}>{errors?.image?.message} </div>
                        <input
                            name="image"
                            id="image-url"
                            type="text"
                            onInput={toggleFileDisabled}
                            {...register("image")}
                        />
                    </label>
                    {backendError && backendError.map(error=> <div className={styles["error-big"]}>{error}</div>)}
                    {succes && <div className={styles.succes}>You have succesfully registered. Redirecting to login page....</div> }
                    <button type="submit"> Add venue and register</button>
                    </fieldset>
                }
            </form>


                </div>)
}

export default Register;