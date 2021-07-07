import {useHistory} from "react-router-dom";
import styles from "./EventCard.module.css";
import React, {useContext, useState} from "react";
import {AuthContext} from "../../../context/AuthContext";
import Rating from "../../Rating/Rating";
import Location from "../../../assets/location-icon.png";
import ButtonSmall from "../../Buttons/ButtonSmall/ButtonSmall";
import AddFavouriteEvent from "../../../helpers/AddFavouriteEvent";
import RemoveFavouriteEvent from "../../../helpers/RemoveFavouriteEvent";
import SlideNavigationMenu from "../../Navigation/SlideNavigationMenu/SlideNavigationMenu";
import ButtonWithConfirmation from "../../Buttons/ButtonWithConfirmation/ButtonWithConfirmation";
import RemoveEvent from "../../../helpers/RemoveEvent"
import AddImageToEventForm from "../../Forms/AddImageForms/AddImageToEventForm";

function EventCard({
                       image,
                       name,
                       venue,
                       venueCity,
                       id,
                       venueId,
                       date,
                       time,
                       type,
                       description,
                       rating,
                       ticketRequired
                   }) {
    const {user} = useContext(AuthContext);
    const [addImage, toggleAddImage] = useState(false);
    const [addOnCard, toggleAddOnCard] = useState(false);
    const history = useHistory();

    function isUserVenue() {
        let userVenue = false
        user.venueList.map((UserVenue) => {
                if (UserVenue.id === venueId) {
                    userVenue = true
                }
            }
        )
        return userVenue
    }

    function isUserFavourite() {
        let userFavourite = false
        user.favouredEvents.map((evente) => {
                if (evente.id === id) {
                    userFavourite = true
                }
            }
        )
        return userFavourite
    }

    function handleClick(e) {
        e.stopPropagation()
        e.preventDefault()
        history.push(`events/${id}`)
    }

    return (
        <>
            <div className={styles.container} style={{filter: addImage ? "blur(5px)" : "none"}}>
                {image && <img className={styles["event-image"]} src={image} alt=""/>}
                <div onClick={(e) => handleClick(e)} className={styles["event-card"]}>
                    <header className={styles["event-header"]}>
                        <div onClick={e => e.stopPropagation()} className={styles["user-navigation"]}>
                            {user && user.authorities[0].authority === "ROLE_USERSNORMAL" && !isUserFavourite() &&
                            <ButtonSmall
                                onClick={() => AddFavouriteEvent(id, user.username)}
                                title="Add to favourites"
                            />}
                            {user && user.authorities[0].authority === "ROLE_USERSNORMAL" && isUserFavourite() &&
                            <ButtonSmall
                                onClick={() => RemoveFavouriteEvent(id, user.username)}
                                title="Remove from favourites"
                            />}

                        </div>
                        <h1>{name}</h1>
                        {rating !== 0 &&
                        <Rating rating={rating}/>}
                    </header>
                    <div className={styles.location}>
                        <img src={Location} alt="" width="25px" height="30px"/>{venue} in {venueCity}
                    </div>

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
                    </section>

                </div>
                {user && user.authorities[0].authority === "ROLE_USERSOWNER" && isUserVenue(id) &&
                <SlideNavigationMenu
                    children={<>
                        <ButtonWithConfirmation
                            onClick={() => RemoveEvent(user.username, venueId, id)}
                            buttonText="Remove event"
                            text="Remove event?"
                        />
                        {!image && !addImage &&
                        <ButtonSmall
                            onClick={(e) => e.stopPropagation() & e.preventDefault() & toggleAddImage(true) & toggleAddOnCard(true)}
                            title="Add image"
                        />
                        }
                        {image && !addImage &&
                        <ButtonSmall
                            onClick={(e) => e.stopPropagation() & e.preventDefault() & toggleAddImage(true) & toggleAddOnCard(true)}
                            title="Change image"
                        />
                        }

                    </>
                    }
                />

                }
            </div>
            {addOnCard && addImage &&
            <div className={styles["popup-form-container"]}>
                <div className={styles["popup-form-image"]}>
                    <AddImageToEventForm
                        eventId={id}
                        onClick={() => toggleAddImage(false) & toggleAddOnCard(false)}
                    />
                </div>
            </div>
            }</>
    )
}

export default EventCard;

