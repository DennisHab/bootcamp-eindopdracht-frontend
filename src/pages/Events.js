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

            {eventData !== null ? <>
                {eventData.map((event)=> { return <div className={styles["venue-container"]}>
                    {event.image !== null && <img src={event.image}/>}
                    {event.image === null && <img src={NoImage}/> }
                    <EventCard
                        name={event.name}
                        link={event.id}
                        venue={event.venue.venueName}
                    />
                </div>})}
            </>   : <h1>LOADING.....</h1>}

        </div>
    )
}

export default Events;