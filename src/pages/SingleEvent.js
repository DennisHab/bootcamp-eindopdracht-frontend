import React, {useState, useEffect, useContext} from 'react';
import {Link, useParams} from 'react-router-dom';
import axios from "axios";
import styles from "./SingleEvent.module.css";
import NoImage from "../assets/no-image-found-360x250.png";
import AddReview from "../components/AddReview";
import {AuthContext} from "../context/AuthContext";
import ReviewCard from "../components/ReviewCard";
import AddFavouriteEventButton from "../components/AddFavouriteEventButton";
import RemoveFavouriteEventButton from "../components/RemoveFavouriteEventButton";


function SingleEvent() {
    const [eventData, setEventData] = useState(null);
    let {id} = useParams();
    const {user}= useContext(AuthContext)

    function isUserFavourite(){
        let UserFavourite = false
        {user.favouredEvents.map((evente)=>{
            if (evente.id === eventData.id){
                UserFavourite = true
            }        }
        )}
        return UserFavourite;
    }

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

    return(<>
            {eventData &&
            <div className={styles.container}>
                 <section className={styles["event-card"]}>
                     <header className={styles["event-header"]}>
                         <h1>{eventData.name} at <Link to={`/venues/${eventData.venue.id}`}>{eventData.venue.venueName}</Link></h1>
                         {eventData.rating > 0 &&
                         <div className={styles["event-rating"]} style={{backgroundColor: `${setBackground(eventData.rating)}`}}>
                             {eventData.rating}
                         </div>}
                     </header>
                     {user && user.authorities[0].authority === "ROLE_USERSNORMAL" && !isUserFavourite() &&
                     <AddFavouriteEventButton
                         eventId={eventData.id}
                     />}
                     {user && user.authorities[0].authority === "ROLE_USERSNORMAL" && isUserFavourite() &&
                     <RemoveFavouriteEventButton
                         eventId={eventData.id}
                     />}
                        <div className={styles["event-image"]}>
                            {eventData.image !== null && <img src={eventData.image} alt=""/>}
                            {eventData.image === null && <img src={NoImage} alt=""/> }
                        </div>
                     <section className={styles["event-content"]}>
                         <div className={styles["event-description"]}>
                             <p>{eventData.eventDescription}</p>
                         </div>
                         <table className={styles["event-information-table"]}>
                             <tr>
                                 <th>Date:</th>
                                 <td>{eventData.date}</td>
                                 <th>Time:</th>
                                 <td>{eventData.time}</td>
                             </tr>
                             <tr>
                                 <th>Type:</th>
                                 <td>{eventData.type}</td>
                                 <th>Ticket required:</th>
                                 <td>{eventData.ticketRequired ? <span>Yes</span> : <span>No</span>}</td>
                             </tr>
                         </table>

                     </section>
                <div className={styles["event-reviews"]}>
                    <h2>Reviews:</h2>
                    {eventData.reviews.length > 0 ? <div className={styles["scrollable-reviews"]}>
                        {eventData.reviews.map((review)=> { return (
                            <ReviewCard
                                user={review.userNormal.username}
                                content={review.reviewContent}
                                rating={review.rating}
                                venueEvent={review.event.name}
                                date={review.date}
                            />
                        )})}
                    </div>: <h3>No reviews yet! Be the first to place a review</h3>}
                    {user && user.authorities[0].authority === "ROLE_USERSNORMAL" &&
                        <AddReview
                            type="event"
                            id={eventData.id}
                        />}
                    {!user && <Link to={"/register"}><h2 className={styles["error-message"]}>Make an account to add reviews here</h2></Link>  }
                    {user && user.authorities[0].authority === "ROLE_USERSOWNER" && <h2 className={styles["error-message"]}>You can't add reviews as venue owner.</h2>}
                </div>
            </section>
            </div>
            }
        </>
    )
}
export default SingleEvent;