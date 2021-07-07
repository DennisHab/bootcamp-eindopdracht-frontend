import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from "../context/AuthContext";
import styles from "./CSS/Profile.module.css";
import axios from "axios";
import AddressForm from "../components/Forms/AddressForm/AddressForm";
import VenueForm from "../components/Forms/VenueForm/VenueForm";
import ButtonLarge from "../components/Buttons/ButtonLarge/ButtonLarge";
import PasswordChange from "../components/Forms/PasswordChange/PasswordChange";
import VenueCard from "../components/Cards/VenueCard/VenueCard";
import EventCard from "../components/Cards/EventCard/EventCard";
import ReviewCard from "../components/Cards/ReviewCard/ReviewCard";
import RemoveAccount from "../helpers/RemoveAccount"
import ButtonSmall from "../components/Buttons/ButtonSmall/ButtonSmall";
import ButtonWithConfirmation from "../components/Buttons/ButtonWithConfirmation/ButtonWithConfirmation";

function Profile() {
    const {user, logout} = useContext(AuthContext);
    const [addressAdd, setAddressAdd] = useState(false);
    const [addressChange, setAddressChange] = useState(false);
    const [venueAdd, setVenueAdd] = useState(false);
    const [addEvent, toggleAddEvent] = useState(false);
    const [addImage, toggleAddImage] = useState(false);
    const [deleteVenue, toggleDeleteVenue] = useState(false);
    const [backendError, setBackenderror] = useState([]);
    const [currentTab, setCurrentTab] = useState("profile");
    const [userEvents, setUserEvents] = useState([]);
    const [filterEvents, toggleFilterEvents] = useState(false)
    const Token = localStorage.getItem('jwt');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`
    }

    //AddUserEvents wordt aangeroepen om alle events van de ingelogde user op te halen.
    const userVenueList = user.venueList
    const res = []

    async function addUserEvents() {
        if (user.authorities[0].authority === "ROLE_USERSOWNER") {
            for (let i = 0; i < userVenueList.length; i++) {
                if (userVenueList[i].events.length > 0) {
                    const events = userVenueList[i].events.concat();
                    res.push(events)
                }
            }
            setUserEvents([].concat.apply([], res))
        }
    }

    //Variabelen voor het sorteren op datum.
    const today = new Date();
    const date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();

    // Zodra een eigenaar in de tab 'My events' alleen aankomende evenementen wil zien kan hij op een knop klikken die
    // de filterEvents state op true zet en de events in het verleden filtert.
    useEffect(() => {
            if (!filterEvents) {
                addUserEvents()
            }
        }
        , [filterEvents])

    async function onSubmit(data) {
        try {
            if (!addressChange) {
                const addAddress = await axios.post(`http://localhost:8080/user/${user.username}/addresses`, {
                    streetName: data.streetName,
                    houseNumber: data.houseNumber,
                    postalCode: data.postalCode,
                    city: data.city,
                    country: data.country
                }, {
                    headers: headers
                })
            }
            if (addressChange) {
                const changeAddress = await axios.put(`http://localhost:8080/user/${user.username}/addresses/${user.address.id}`, {
                    streetName: data.streetName,
                    houseNumber: data.houseNumber,
                    postalCode: data.postalCode,
                    city: data.city,
                    country: data.country
                }, {
                    headers: headers
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
                {/*De navigatiebalk bepaald op basis van het type gebruiker wat er getoond wordt in de profielpagina*/}
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
                            <th>First name:</th>
                            <td>{user.firstName}</td>
                        </tr>
                        <tr>
                            <th>Second name:</th>
                            <td>{user.lastName}</td>
                        </tr>
                        <tr>
                            <th>E-mail:</th>
                            <td>{user.emailAddress}</td>
                        </tr>
                        {user.address !== null && <>
                            <tr>
                                <th>Streetname:</th>
                                <td>{user.address.streetName} {user.address.houseNumber}</td>
                            </tr>
                            <tr>
                                <th>Postal code:</th>
                                <td>{user.address.postalCode}</td>
                            </tr>
                            <tr>
                                <th>City:</th>
                                <td>{user.address.city}</td>
                            </tr>
                        </>}
                    </table>
                </div>
                <div className={styles["profile-options"]}>
                    <ButtonWithConfirmation
                        buttonText="Delete Account"
                        onClick={() => RemoveAccount(user.username, logout)}
                        text="Delete account?"
                    />
                    {!user.address &&
                    <ButtonSmall onClick={() => setAddressAdd(true)} title={"Add address to profile"}/>}
                    {user.address && <ButtonSmall onClick={() => setAddressChange(true)} title={"Change address"}/>}
                </div>
                {addressChange &&
                <div className={styles["address-form"]}>
                    <AddressForm
                        onSubmit={onSubmit}
                        backendError={backendError}
                        onClick={() => setAddressChange(false)}
                    />
                </div>
                }
                {addressAdd &&
                <div className={styles["address-form"]}>
                    <AddressForm
                        onSubmit={onSubmit}
                        backendError={backendError}
                        onClick={() => setAddressAdd(false)}
                    />
                </div>
                }
            </fieldset>}
            {currentTab === "password" &&
            <fieldset className={styles["password-change"]}>
                <PasswordChange/>
            </fieldset>
            }
            {currentTab === "venues" &&
            <fieldset className={styles.venues}>
                <header className={styles["venues-header"]}>
                    <h1>Venues of {user.username}</h1>
                </header>
                <div className={styles["venue-navigation"]}>
                    {!venueAdd &&
                    <ButtonLarge
                        onClick={() => setVenueAdd(true)}
                        type={"button"}
                        title={"Add venue"}
                    />
                    }
                </div>
                {venueAdd &&
                <div className={styles["venue-form"]}>
                    <VenueForm
                        username={user.username}
                        onClick={() => setVenueAdd(false)}
                    />
                </div>
                }
                {user.venueList.length > 0 &&
                <ul className={styles["venue-list"]} style={{filter: venueAdd ? "blur(5px)" : "none"}}>
                    {user.venueList.map((venue, index) => {
                        return (
                            <li key={index}>
                                <VenueCard
                                    index={index}
                                    image={venue.image}
                                    city={venue.address.city}
                                    name={venue.venueName}
                                    events={venue.events}
                                    id={venue.id}
                                    facebook={venue.facebook}
                                    instagram={venue.instagram}
                                    rating={venue.rating}
                                    website={venue.website}
                                    addEvent={addEvent}
                                    toggleAddEvent={toggleAddEvent}
                                    addImage={addImage}
                                    toggleAddImage={toggleAddImage}
                                    deleteVenue={deleteVenue}
                                    toggleDeleteVenue={toggleDeleteVenue}
                                />
                            </li>
                        )
                    })}
                </ul>
                }
                {!user.venueList && <p>No venues yet, click 'add venue' to add one!</p>}
            </fieldset>
            }
            {currentTab === "events" &&
            <section className={styles.events}>
                <header className={styles["venues-header"]}>
                    <h1>Events of {user.username}</h1>
                </header>
                <div className={styles["event-navigation"]}>
                    {!filterEvents ?
                        <ButtonLarge
                            onClick={() => setUserEvents(userEvents.filter((evente) => {
                                return new Date(evente.date.split('-').reverse()) > new Date(date.split('-').reverse())
                            })) & toggleFilterEvents(!filterEvents)}
                            title="Only show upcoming events"
                        /> :
                        <ButtonLarge
                            onClick={() => setUserEvents(userEvents) & toggleFilterEvents(!filterEvents)}
                            title="Show all events"
                        />}
                </div>
                {userEvents.map((userEvent) => {
                    return (
                        <div className={styles["event-cards"]}>
                            <EventCard
                                image={userEvent.image}
                                name={userEvent.name}
                                venue={userEvent.venue.venueName}
                                venueId={userEvent.venue.id}
                                id={userEvent.id}
                                date={userEvent.date}
                                time={userEvent.time}
                                description={userEvent.eventDescription}
                                type={userEvent.type}
                                rating={userEvent.rating}
                                ticketRequired={userEvent.ticketRequired}
                            />
                        </div>)
                })}
            </section>
            }
            {currentTab === "favEvents" &&
            <section className={styles.events}>
                {user.favouredEvents.length > 0 ? user.favouredEvents.map((userEvent) => {
                    return (
                        <div className={styles["event-cards"]}>
                            <EventCard
                                image={userEvent.image}
                                name={userEvent.name}
                                venue={userEvent.venue.venueName}
                                id={userEvent.id}
                                date={userEvent.date}
                                time={userEvent.time}
                                description={userEvent.eventDescription}
                                type={userEvent.type}
                                rating={userEvent.rating}
                                ticketRequired={userEvent.ticketRequired}
                            />
                        </div>)
                }) : <h1>No favourite events yet</h1>}
            </section>
            }
            {currentTab === "reviews" &&
            <section className={styles.reviews}>
                {user.reviews.length > 0 ? user.reviews.map((review) => {
                    return (
                        <div className={styles["review-cards"]}>
                            <ReviewCard
                                date={review.date}
                                content={review.reviewContent}
                                user={review.user}
                                rating={review.rating}
                                venueEvent={review.event ? "Event: " + review.event.name : "Venue: " + review.venue.venueName}
                            />
                        </div>)
                }) : <h1>No reviews yet!</h1>}
            </section>
            }
        </div>
    )
}

export default Profile;






