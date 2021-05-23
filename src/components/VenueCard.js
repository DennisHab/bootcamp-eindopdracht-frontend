import styles from "../pages/Venues.module.css";
import React from "react";
import {Link} from "react-router-dom";


function VenueCard({ name, city, events, link}){
    const eventsSorted = events.sort((a,b) => { return(
        new Date(a.date.split('-').reverse()) - new Date(b.date.split('-').reverse()))  })
    console.log(eventsSorted)
return(
    <>  <Link to={`/venues/${link}`}>
        <fieldset className={styles["single-venue"]}>
            <h1>{name} in {city}</h1>
            <p>Upcoming events:</p>
            {eventsSorted.slice(0,3).map((event)=>{
                return(<>
                <p>Name: {event.name} Date: {event.date} Time: {event.time} </p>
                </>
            )})}
        </fieldset>
        </Link>
    </>
)
}

export default VenueCard;