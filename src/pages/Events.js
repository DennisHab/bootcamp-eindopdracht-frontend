import React, {useState, useContext, useEffect} from 'react';
import axios from "axios";
import styles from './Events.module.css';
import EventCard from "../components/EventCard";
import NoImage from "../assets/no-image-found-360x250.png"


function Events() {
    const [eventData, setEventData] = useState([]);

    useEffect(()=> {
        async function getEvents() {
            try{
                const getEvents = await axios.get('http://localhost:8080/events')
                setEventData(getEvents.data)
                console.log(eventData)
            }
            catch(e){
                console.error(e)
            }
        }
        getEvents()
    }, [])

    return (
        <div className={styles.container}>
            <div className={styles["event-container"]}>
            {eventData !== null ? <>
                {eventData.map((event)=> { return(
                    <EventCard
                        image={event.image}
                        name={event.name}
                        venue={event.venue.venueName}
                        id={event.id}
                        date={event.date}
                        time={event.time}
                        description={event.eventDescription}
                        type={event.type}
                        rating={event.rating}
                        ticketRequired={event.ticketRequired}
                    />)
                })}
            </>   : <h1>LOADING.....</h1>}
            </div>
        </div>
    )
}

export default Events;