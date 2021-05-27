import React, {useState, useEffect, useContext} from 'react';
import {Link, useParams} from 'react-router-dom';
import axios from "axios";
import styles from "./SingleEvent.module.css";
import NoImage from "../assets/no-image-found-360x250.png";
import AddReview from "../components/AddReview";
import {AuthContext} from "../context/AuthContext";
import ReviewCard from "../components/ReviewCard";


function SingleEvent() {
    const [eventData, setEventData] = useState(null);
    let {id} = useParams();
    const {user}= useContext(AuthContext)

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
                    {eventData.reviews.length > 0 ? <div className={styles["scrollable-reviews"]}>
                        {eventData.reviews.map((review)=> { return (
                            <ReviewCard
                                user={review.userNormal.username}
                                content={review.reviewContent}
                                rating={review.rating}
                            />
                        )})}
                    </div>: <h3>No reviews yet! Be the first to place a review</h3>}
                    {user && user.authorities[0].authority === "ROLE_USERSNORMAL" ?
                        <AddReview
                            type="event"
                            id={eventData.id}
                        /> : <h2>Make an account to start reviewing!</h2>}
                    {!user && <Link to={"/register"}><h2 className={styles["error-message"]}>Make an account to add reviews here</h2></Link>  }
                    {user && user.authorities[0].authority === "ROLE_USERSOWNER" && <h2 className={styles["error-message"]}>You can't add reviews as venue owner.</h2>}
                </fieldset>
            </div>
            }
        </>
    )
}
export default SingleEvent;