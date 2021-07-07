import styles from "./VenueCard.module.css";
import React, {useContext, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import Facebook from "../../../assets/facebook.png";
import Instagram from "../../../assets/Instagram (2).png";
import Website from "../../../assets/website.png";
import Location from "../../../assets/location-icon.png";
import EventForm from "../../Forms/EventForm/EventForm";
import {AuthContext} from "../../../context/AuthContext";
import AddImageToVenueForm from "../../Forms/AddImageForms/AddImageToVenueForm";
import Rating from "../../Rating/Rating";
import ButtonSmall from "../../Buttons/ButtonSmall/ButtonSmall";
import SlideNavigationMenu from "../../Navigation/SlideNavigationMenu/SlideNavigationMenu";
import ButtonWithConfirmation from "../../Buttons/ButtonWithConfirmation/ButtonWithConfirmation";
import RemoveVenue from "../../../helpers/RemoveVenue";

function VenueCard({
                       name,
                       city,
                       events,
                       id,
                       image,
                       facebook,
                       website,
                       instagram,
                       rating,
                       addEvent,
                       toggleAddEvent,
                       addImage,
                       toggleAddImage,
                       deleteVenue,
                   }) {
    const history = useHistory();
    const {user} = useContext(AuthContext);
    const [addOnCard, toggleAddOnCard] = useState(false);
    const today = new Date();
    const date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    //Methode die eerst alle datums(als string opgeslagen) sorteert op datum en vervolgens de datums in het verleden filtert, zodat deze
    // getoond kunnen worden bij 'upcoming events')

    const eventsSorted = events.sort((a, b) => {
        return a.date - b.date
    })
    const eventsFiltered = eventsSorted.filter((evente) => {
        return new Date(evente.date.split('-').reverse()) > new Date(date.split('-').reverse())
    })

    function isUserVenue(id) {
        let userVenue = false
        user.venueList.map((venue) => {
                if (venue.id === id) {
                    userVenue = true
                }
            }
        )
        return userVenue
    }

    function handleClick(e) {
        e.stopPropagation()
        e.preventDefault()
        history.push(`venues/${id}`)
    }

    return (<>
            <div className={styles.container}
                 style={{filter: addEvent || addImage || deleteVenue ? "blur(5px)" : "none"}}>
                {image && <img className={styles["venue-image"]} src={process.env.PUBLIC_URL + '/' + image} alt=""/>}
                <div onClick={(e) => handleClick(e)} className={styles["venue-card"]}>
                    <div className={styles["header-container"]}>
                        <header className={styles["venue-header"]}>
                            <div id={styles["social-media"]} onClick={(e) => e.stopPropagation()}>
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
                            <h1>{name}</h1>
                            {rating !== 0 &&
                            <Rating rating={rating}/>}
                        </header>
                        <div className={styles.location}>
                            <img src={Location} alt="" width="25px" height="30px"/>{city}
                        </div>
                    </div>
                    <section className={styles["venue-information"]}>
                        <p>Upcoming events:</p>
                        {eventsFiltered.length > 0 ? <>
                            <table className={styles["venue-table"]}>
                                <tr>
                                    <th> Name:</th>
                                    <th> Date:</th>
                                    <th> Type:</th>
                                </tr>
                            </table>
                            {eventsFiltered.length > 0 && <>
                                {eventsFiltered.slice(0, 3).map((event) => {
                                    return (<>
                                        <Link onClick={(e) => e.stopPropagation()} to={`/events/${event.id}`}>
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
                            }</> : <p>No events have been added to this venue yet.</p>}
                    </section>
                </div>
                {user && user.authorities[0].authority === "ROLE_USERSOWNER" && isUserVenue(id) &&
                <SlideNavigationMenu
                    children={<>
                        <ButtonSmall
                            onClick={() => toggleAddEvent(true) & toggleAddOnCard(true)}
                            title="Add event"
                        />
                    {!image && !addImage &&
                        <ButtonSmall
                        onClick={() => toggleAddImage(true) & toggleAddOnCard(true)}
                        title="Add image"
                        />
                    }
                    {!addImage && image !== null &&
                        <ButtonSmall
                        onClick={() => toggleAddImage(true) & toggleAddOnCard(true)}
                        title="Change image"
                        />
                    }
                        <ButtonWithConfirmation
                            onClick={()=> RemoveVenue(user.username, id)}
                            text="Remove venue?"
                            buttonText="Remove venue"
                        />
                    </>
                    }
                />
                }

            </div>
            {addOnCard && addEvent &&
            <div className={styles["popup-form-container"]}>
                <div className={styles["popup-form"]}>
                    <EventForm
                        onClick={()=>toggleAddEvent(false) & toggleAddOnCard(false)}
                        venueId={id}
                    />
                </div>
            </div>
            }
            {addOnCard && addImage &&
            <div className={styles["popup-form-container"]}>
                <div className={styles["popup-form-image"]}>
                    <AddImageToVenueForm
                        venueId={id}
                        onClick={() => toggleAddImage(false) & toggleAddOnCard(false)}
                    />
                </div>
            </div>
            }
        </>
    )
}

export default VenueCard;