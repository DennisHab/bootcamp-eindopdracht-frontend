import styles from "./VenueCard.module.css";
import React, {useState, useContext} from "react";
import {Link} from "react-router-dom";
import NoImage from "../assets/no-image-found-360x250.png";
import Facebook from "../assets/facebook.png";
import Instagram from "../assets/Instagram (2).png";
import Website from "../assets/website.png";
import Location from "../assets/location-icon.png";
import EventForm from "./EventForm";
import {AuthContext} from "../context/AuthContext";
import RemoveVenueButton from "./RemoveVenueButton";
import AddImageToVenueForm from "./AddImageToVenueForm";
import Rating from "./Rating";

function VenueCard({ name, city, events, id, image, facebook, website, instagram, rating}){
    const {user} = useContext(AuthContext);
    const [addEvent, toggleAddEvent] = useState(false);
    const [addImage, toggleAddImage] = useState(false);
    const today= new Date();
    const date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
    //Methode die eerst alle datums(als string opgeslagen) sorteert op datum en vervolgens de datums in het verleden filtert, zodat deze
    // getoond kunnen worden bij 'upcoming events')
    const eventsSorted = events.sort((a,b) => { return(
        new Date(a.date.split('-').reverse()) - new Date(b.date.split('-').reverse()))  })
    const eventsFiltered = eventsSorted.filter((evente)=>{
        return  new Date(evente.date.split('-').reverse()) > new Date(date.split('-').reverse())
    })
    function isUserVenue(id) {
        let userVenue = false
        user.venueList.map((venue)=>{
                if (venue.id === id){
                    userVenue = true
                }
        }
        )
        return userVenue
    }
return(
        <Link to={`venues/${id}`}>
        <div className={styles.container}>
                {image && !addEvent && <img className={styles["venue-image"]} src={process.env.PUBLIC_URL + '/' + image} alt="" />}
                {!image && !addEvent && <img className={styles["venue-image"]} src={NoImage} alt="" />}
            <div className={styles["venue-card"]}>
                <div className={styles["header-container"]}>
                <header className={styles["venue-header"]}>
                    <div id={styles["social-media"]}>
                        {instagram &&
                        <a href={instagram}>
                            <img src={Instagram} width="30px" height="30px" alt=""/>
                        </a>}
                        {facebook &&
                        <a href={facebook}>
                            <img src={Facebook} width="30px" height="30px" alt=""/>
                        </a>}
                        {website &&
                        <a href={website}>
                            <img src={Website} width="30px" height="30px" alt=""/>
                        </a>}
                    </div>
                    <h1>{name}</h1>
                    {rating !== 0 &&
                    <Rating rating={rating} />}
                </header>
                    <div className={styles.location}>
                        <img src={Location} alt="" width="25px" height="30px"/>{city}
                    </div>
                </div>

                <section className={styles["venue-information"]}>
                    <p>Upcoming events:</p>
                    {eventsFiltered.length > 0 ? <>
                    <table className={styles["venue-table"]}>
                        <tr>
                            <th> Name:</th>
                            <th> Date:</th>
                            <th> Type:</th>
                        </tr>
                    </table>
                    { eventsFiltered.length > 0 && <>
                        {eventsFiltered.slice(0, 3).map((event) => {
                            return (<>
                                <Link to={`/events/${event.id}`}>
                                    <table className={styles["venue-table"]}>
                                        <tr>
                                            <td> {event.name}</td>
                                            <td> {event.date}</td>
                                            <td> {event.type}</td>
                                        </tr>
                                    </table>
                                </Link>
                            </>)
                        })
                        }</>
                    }</>: <p>No events have been added to this venue yet.</p>}
                    {user && user.authorities[0].authority === "ROLE_USERSOWNER" && isUserVenue(id) &&
                    <div className={styles["bottom-navigation"]}>
                        <RemoveVenueButton
                            venueId={id}
                        />
                        {!addEvent && user && user.authorities[0].authority === "ROLE_USERSOWNER" &&
                            <button onClick={() => toggleAddEvent(true)}> Add event
                        to {name}</button>}
                        {addEvent && user && user.authorities[0].authority === "ROLE_USERSOWNER" &&
                            <button onClick={() => toggleAddEvent(false)}> Add later</button>}
                        {!image && !addImage && user && user.authorities[0].authority === "ROLE_USERSOWNER" &&
                        <button onClick={() => toggleAddImage(true)}> Add Image to {name}</button>}
                        {!addImage && user && user.authorities[0].authority === "ROLE_USERSOWNER" && image !== null &&
                        <button onClick={()=> toggleAddImage(true)}>Change image of {name}</button>
                        }
                        {addImage && user && user.authorities[0].authority === "ROLE_USERSOWNER" &&
                        <button onClick={() => toggleAddImage(false)}> Add later</button>}
                    </div>
                    }
                    {addEvent &&
                        <div className={styles["popup-form"]}>
                            <EventForm
                                venueId={id}
                            />
                        </div>
                    }
                    {addImage &&
                        <div className={styles["popup-form"]}>
                            <AddImageToVenueForm
                                venueId={id}
                            />
                        </div>
                    }
                </section>
            </div>
        </div>
        </Link>
)
}
export default VenueCard;