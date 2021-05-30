import styles from "./VenueCard.module.css";
import React, {useState, useContext} from "react";
import {Link} from "react-router-dom";
import NoImage from "../assets/no-image-found-360x250.png";
import Facebook from "../assets/facebook.png";
import Instagram from "../assets/Instagram (2).png";
import Website from "../assets/website.png";
import EventForm from "./EventForm";
import {AuthContext} from "../context/AuthContext";
import RemoveVenueButton from "./RemoveVenueButton";


function VenueCard({ name, city, events, id, image, facebook, website, instagram, rating}){
    const {user} = useContext(AuthContext);
    const [addEvent, toggleAddEvent] = useState(false);
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
    function setBackground(rating){
        if (rating >= 10){
            return "darkgreen"
        }
        if (rating >= 8){
            return "green"
        }
        if (rating >= 6){
            return "yellow"
        }
        if (rating >= 4){
            return "orange"
        }
        if (rating >= 2){
            return "red"
        }
        if (rating >= 1){
            return "darkred"
        }
    }
return(
        <div className={styles.container}>
                {image && !addEvent && <img className={styles["venue-image"]} src={image} alt="" />}
                {!image && !addEvent && <img className={styles["venue-image"]} src={NoImage} alt="" />}
            <div className={styles["venue-card"]}>
                <header className={styles["venue-header"]}>
                    <h1>{name} in {city}</h1>
                    {rating !== 0 &&
                    <div id={styles["venue-rating"]} style={{backgroundColor: `${setBackground(rating)}`}}>
                         <h2>{rating}</h2>
                    </div>}
                </header>
                <section className={styles["venue-information"]}>
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
                    }</>: <p>No events have been added to this venue yet.</p>} <div className={styles["bottom-navigation"]}>
                    {user && user.authorities[0].authority === "ROLE_USERSOWNER" && isUserVenue(id) &&
                        <RemoveVenueButton
                            venueId={id}
                        />}
                        {!addEvent && user && user.authorities[0].authority === "ROLE_USERSOWNER" &&
                            <button onClick={() => toggleAddEvent(true)}> Add event
                        to {name}</button>}
                        {addEvent && user && user.authorities[0].authority === "ROLE_USERSOWNER" &&
                            <button onClick={() => toggleAddEvent(false)}> Add later</button>}
                </div>
                    {addEvent &&
                    <EventForm
                        venueId={id}
                    />
                    }
                </section>
                <Link className={styles["venue-link"]} to={`/venues/${id}`}>
                    <h2>See more</h2>
                </Link>
            </div>
        </div>
)
}
export default VenueCard;