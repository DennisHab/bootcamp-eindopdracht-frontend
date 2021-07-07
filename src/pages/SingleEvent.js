import React, {useContext, useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import axios from "axios";
import styles from "./CSS/SingleEvent.module.css";
import AddReview from "../components/Forms/AddReviewForm/AddReview";
import {AuthContext} from "../context/AuthContext";
import ReviewCard from "../components/Cards/ReviewCard/ReviewCard";
import Rating from "../components/Rating/Rating";
import ButtonSmall from "../components/Buttons/ButtonSmall/ButtonSmall";
import AddFavouriteEvent from "../helpers/AddFavouriteEvent";
import RemoveFavouriteEvent from "../helpers/RemoveFavouriteEvent";
import ButtonLarge from "../components/Buttons/ButtonLarge/ButtonLarge";

function SingleEvent() {
    const [eventData, setEventData] = useState(null);
    const [addReview, toggleAddReview] = useState(false);
    let {id} = useParams();
    const {user} = useContext(AuthContext);

    function isUserFavourite() {
        let UserFavourite = false
        {
            user.favouredEvents.map((evente) => {
                if (evente.id === eventData.id) {
                    UserFavourite = true
                }
            })
        }
        return UserFavourite;
    }

    useEffect(() => {
        async function getEvent() {
            try {
                const getEvent = await axios.get(`http://localhost:8080/events/${id}`);
                setEventData(getEvent.data)
            } catch (e) {
                console.error(e);
            }
        }

        getEvent()
    }, [])

    return (<>
            {eventData &&
            <div className={styles.container}>
                <section className={styles["event-card"]}>
                    <header className={styles["event-header"]}>
                        <h1>{eventData.name} at <Link
                            to={`/venues/${eventData.venue.id}`}>{eventData.venue.venueName}</Link></h1>
                        {eventData.rating > 0 &&
                        <Rating
                            rating={eventData.rating}
                        />}
                    </header>
                    <div className={styles["event-navigation"]}>
                        {user && user.authorities[0].authority === "ROLE_USERSNORMAL" && !isUserFavourite() &&
                        <ButtonSmall
                            onClick={() => AddFavouriteEvent(id, user.username)}
                            title={"Add to favourites"}
                        />
                        }
                        {user && user.authorities[0].authority === "ROLE_USERSNORMAL" && isUserFavourite() &&
                        <ButtonSmall
                            onClick={() => RemoveFavouriteEvent(id, user.username)}
                            title={"Remove from favourites"}
                        />
                        }
                    </div>
                    <div className={styles["event-information"]}>
                        {eventData.image !== null && <img src={process.env.PUBLIC_URL + '/' + eventData.image} alt=""/>}
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
                    </div>
                    <section className={styles["event-content"]}>
                        <div className={styles["event-description"]}>
                            <p>{eventData.eventDescription}</p>
                        </div>
                    </section>
                    <div className={styles["event-reviews"]}>
                        {eventData.reviews.length > 0 ? <div className={styles["scrollable-reviews"]}>
                                <h2>Reviews:</h2>
                                {eventData.reviews.map((review) => {
                                    return (
                                        <ReviewCard
                                            user={review.userNormal.username}
                                            content={review.reviewContent}
                                            rating={review.rating}
                                            venueEvent={review.event.name}
                                            date={review.date}
                                        />
                                    )
                                })}
                            </div>
                            : <h3>No reviews yet! Be the first to place a review</h3>}
                        {user && user.authorities[0].authority === "ROLE_USERSNORMAL" &&
                        <ButtonLarge
                            onClick={() => toggleAddReview(true)}
                            title="Add review"
                        />
                        }
                        {addReview && user && user.authorities[0].authority === "ROLE_USERSNORMAL" &&
                        <div className={styles["review-form-container"]}>
                            <div className={styles["review-form"]}>
                                <AddReview
                                    onClick={() => toggleAddReview(false)}
                                    type="event"
                                    id={eventData.id}
                                />
                            </div>
                        </div>
                        }
                        {!user && <Link id={styles["register-button"]} to={"/register"}>
                            <button>You need an account to add reviews, click here to register</button>
                        </Link>}
                        {user && user.authorities[0].authority === "ROLE_USERSOWNER" &&
                        <h2 className={styles["error-message"]}>You can't add reviews as venue owner.</h2>}
                    </div>
                </section>
            </div>
            }
        </>
    )
}

export default SingleEvent;