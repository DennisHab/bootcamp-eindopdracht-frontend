import React, {useContext, useState} from 'react';
import {AuthContext} from "../context/AuthContext";
import {useHistory} from "react-router-dom"
import styles from "./Profile.module.css";
import {useForm} from "react-hook-form";
import axios from "axios";
import AddressForm from "../components/AddressForm";
import VenueForm from "../components/VenueForm";
import EventForm from "../components/EventForm";
import PasswordChange from "../components/PasswordChange";

function Profile() {
    const history = useHistory();
    const {user, logout} = useContext(AuthContext);
    const [addressAdd, setAddressAdd] = useState(false);
    const [addressChange, setAddressChange] = useState(false);

    const [venueAdd, setVenueAdd] = useState(false);
    const [backendError, setBackenderror] = useState([]);
    const {register, handleSubmit, formState: {errors}} = useForm();
    const [addEvent, toggleAddEvent] = useState(false);
    const [currentTab, setCurrentTab] = useState("profile");
    const [passwordChange, togglePasswordChange] = useState(false);


    async function onSubmit(data) {
        try {
            if (!addressChange) {
                const addAddress = await axios.post(`http://localhost:8080/users/${user.username}/addresses`, {
                    streetName: data.streetName,
                    houseNumber: data.houseNumber,
                    postalCode: data.postalCode,
                    city: data.city,
                    country: data.country
                })
            }
            if (addressChange) {
                const changeAddress = await axios.put(`http://localhost:8080/users/${user.username}/addresses/${user.address.id}`, {
                    streetName: data.streetName,
                    houseNumber: data.houseNumber,
                    postalCode: data.postalCode,
                    city: data.city,
                    country: data.country
                })
            }
            window.location.reload(false);
        } catch (e) {
            console.error(e);
            setBackenderror([e.response.data.message]);
        }
    }


    return (
        <div className={styles.container}>
            <div className={styles["navigation-bar"]}>
                <button value="profile" onClick={(e) => setCurrentTab(e.target.value)}> My Profile</button>
                <button value="password" onClick={(e) => setCurrentTab(e.target.value)}>Change password</button>
                {user.authorities[0].authority === "ROLE_USERSOWNER" && <>
                    <button value="venues" onClick={(e) => setCurrentTab(e.target.value)}> My Venues</button>
                    <button value="events" onClick={(e) => setCurrentTab(e.target.value)}> My Events</button>
                </>}
                {user.authorities[0].authority === "ROLE_USERSNORMAL" && <>
                    <button value="favEvents" onClick={(e) => setCurrentTab(e.target.value)}> My Favourite Events
                    </button>
                    <button value="reviews" onClick={(e) => setCurrentTab(e.target.value)}> My reviews</button>
                </>}
            </div>
            {currentTab === "profile" &&
            <fieldset className={styles.profile}>
                <div className={styles["profile-header"]}>
                    <h1>Profile of {user && user.username}</h1>
                </div>
                <div className={styles["profile-table"]}>
                    <table>
                        <tr>
                            <td>First name: </td>
                            <td>{user.firstName}</td>
                        </tr>
                        <tr>
                            <td>Second name:</td>
                            <td>{user.lastName}</td>

                        </tr>
                        <tr>
                            <td>E-mail:</td>
                            <td>{user.emailAddress}</td>
                        </tr>
                    </table>
                </div>
                <div className={styles["profile-options"]}>
                    {!addressAdd ?
                    <button onClick={()=>setAddressAdd(true)}>
                        Add address to profile
                    </button> :
                    <button onClick={()=>setAddressAdd(false)}>
                        Add later
                    </button>

                    }
                    <button onClick={()=>setAddressAdd(true)}>
                        Add address to profile
                    </button>

                    <button onClick={()=>setAddressChange(true)}>
                        Change address
                    </button>

                </div>
                {addressChange | addressAdd &&
                <div className={styles["address-form"]}>
                    <AddressForm
                        onSubmit={onSubmit}
                        backendError={backendError}
                    />
                </div>
                }

            </fieldset>}
            {currentTab === "password" &&
            <div className={styles["password-change"]}>
                <PasswordChange/>
            </div>
            }
        </div>)
}
export default Profile;






