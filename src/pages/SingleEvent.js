import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import axios from "axios";
import styles from "./SingleEvent.module.css";
import NoImage from "../assets/no-image-found-360x250.png";
import AddReview from "../components/AddReview";


function SingleEvent() {
    const [eventData, setEventData] = useState(null);
    let {id} = useParams();


    useEffect(()=> {
        async function getEvent() {
            try{
                const getEvent = await axios.get(`http://localhost:8080/events/${id}`);
                setEventData(getEvent.data)
                console.log(eventData);
            }
            catch(e){
                console.error(e);
            }
        }getEvent()
    },[] )

    return(<>
            {eventData &&
            <div className={styles.container}>
                <div className={styles["venuecard-image"]}>
                    {eventData.image !== null && <img src={eventData.image}/>}
                    {eventData.image === null && <img src={NoImage}/> }
                    <fieldset className={styles["venue-card"]}>
                        <h1>{eventData.name}</h1>
                    </fieldset>
                </div>
                <fieldset className={styles["venue-reviews"]}>
                    <h2>Reviews:</h2>
                    {eventData.reviews.size > 0 ? <div className={styles["scrollable-reviews"]}>
                        {eventData.reviews.map((review)=> { return (
                            <div className={styles["single-review"]}>
                                <span><p>By:</p> {review.userNormal.username}</span>
                                <span><p>Review:</p> {review.reviewContent}</span>
                            </div>
                        )})}
                    </div>: <h3>No reviews yet! Be the first to place a review</h3>}
                    <AddReview
                        type="event"
                        id={eventData.id}
                    />
                </fieldset>
            </div>
            }
        </>
    )
}
export default SingleEvent;