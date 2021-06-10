import {Link} from "react-router-dom";
import styles from "./EventCard.module.css";
import NoImage from "../assets/no-image-found-360x250.png";
import React, {useContext, useState} from "react";
import {AuthContext} from "../context/AuthContext";
import AddFavouriteEventButton from "./AddFavouriteEventButton";
import RemoveFavouriteEventButton from "./RemoveFavouriteEventButton";
import RemoveEventButton from "./RemoveEventButton";
import AddImageToEventForm from "./AddImageToEventForm";

function EventCard({image, name, venue, venueCity, id, venueId, date, time, type, description, rating, ticketRequired}){
    const {user} = useContext(AuthContext);
    const [addImage, toggleAddImage] = useState(false);

    function isUserVenue() {
        let userVenue = false
        user.venueList.map((UserVenue)=>{
                if (UserVenue.id === venueId){
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
    function isUserFavourite(){
        let UserFavourite = false
        user.favouredEvents.map((evente)=>{
           if (evente.id === id){
               UserFavourite = true
           }        }
        )
        return UserFavourite;
    }
    return(
        <div className={styles.container}>
            {image && <img className={styles["event-image"]} src={image} alt=""/>}
            {!image && <img className={styles["event-image"]} src={NoImage} alt=""/> }
            <div className={styles["event-card"]}>
                <header className={styles["event-header"]}>
                    <h1>{name} at {venue} in {venueCity}</h1>
                    {rating !== 0 &&
                    <div id={styles["event-rating"]} style={{backgroundColor: `${setBackground(rating)}`}}>
                        <h2>{rating}</h2>
                    </div>}
                </header>
                <section className={styles["event-information"]}>
                    <p>{description}</p>
                    <table className={styles["event-table"]}>
                        <tr>
                            <th>Date:</th>
                            <td>{date}</td>
                            <th>Time:</th>
                            <td>{time}</td>
                        </tr>
                        <tr>
                            <th>Type:</th>
                            <td>{type}</td>
                            <th>Ticket required:</th>
                            <td>{ticketRequired ? <span>Yes</span> : <span>No</span>}</td>
                        </tr>
                    </table>
                    <div className={styles["user-bottom-navigation"]}>
                        {user && user.authorities[0].authority === "ROLE_USERSNORMAL" && !isUserFavourite() &&
                            <AddFavouriteEventButton
                                eventId={id}
                            />}
                        {user && user.authorities[0].authority === "ROLE_USERSNORMAL" && isUserFavourite() &&
                            <RemoveFavouriteEventButton
                                eventId={id}
                            />}
                    </div>
                    {user && user.authorities[0].authority === "ROLE_USERSOWNER" && isUserVenue(id) &&
                        <div className={styles["owner-bottom-navigation"]}>
                            {user && user.authorities[0].authority === "ROLE_USERSOWNER" && isUserVenue() &&
                                <RemoveEventButton
                                    venueId={venueId}
                                    eventId={id}
                                />
                            }
                            {!addImage && user && user.authorities[0].authority === "ROLE_USERSOWNER" &&
                            <button onClick={() => toggleAddImage(true)}> Add Image to {name}</button>
                            }
                            {addImage && user && user.authorities[0].authority === "ROLE_USERSOWNER" &&
                            <button onClick={() => toggleAddImage(false)}> Add later</button>
                            }
                            {addImage &&
                                <AddImageToEventForm
                                    eventId={id}
                                />
                            }
                        </div>
                    }
                </section>
                <Link className={styles["event-link"]} to={`/events/${id}`}>
                    <h2>See more</h2>
                </Link>
            </div>
        </div>
    )
}
export default EventCard;

