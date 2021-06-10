import React, {useState, useEffect, useContext} from 'react';
import {Link, useParams} from 'react-router-dom';
import axios from "axios";
import styles from "./SingleVenue.module.css";
import NoImage from "../assets/no-image-found-360x250.png";
import {AuthContext} from "../context/AuthContext";
import AddReview from "../components/AddReview";
import Instagram from "../assets/Instagram (2).png";
import Facebook from "../assets/facebook.png";
import Website from "../assets/website.png";
import ReviewCard from "../components/ReviewCard";

function SingleVenue() {
    const [venueData, setVenueData] = useState(null);
    const {user} = useContext(AuthContext);
    let {id} = useParams();

    useEffect(()=> {
        async function getVenue() {
            try{
                const getVenue = await axios.get(`http://localhost:8080/venues/${id}`);
                setVenueData(getVenue.data);
                console.log(venueData);
            }
            catch(e){
                console.error(e);
            }
        }
        getVenue()

    },[] )
    const today= new Date();
    const date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
        {venueData && venueData.events.sort((a,b) => { return(new Date(a.date.split('-').reverse()) - new Date(b.date.split('-').reverse()))  }) &&
            venueData.events.filter((evente)=>{return new Date(evente.date.split('-').reverse()) > new Date(date.split('-').reverse())})}


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
        {venueData &&
        <div className={styles.container}>

                <section className={styles["venue-card"]}>
                    <header className={styles["venue-header"]}>
                        <h1>{venueData.venueName} in {venueData.address.city}</h1>
                        {venueData.rating !== 0 &&<div className={styles["venue-rating"]}style={{backgroundColor: `${setBackground(venueData.rating)}`}}>{venueData.rating}</div>}
                    </header>
                    <div className={styles["venuecard-image"]}>
                        {venueData.image !== null && <img src={process.env.PUBLIC_URL + '/' + venueData.image} alt=""/>}
                        {venueData.image === null && <img src={NoImage} alt=""/> }
                    </div>
                    <div className={styles["venuecard-content"]}>
                    <h3>Address:</h3>
                    <p>{venueData.address.streetName} {venueData.address.houseNumber}</p>
                    {venueData.address.postalCode && <p>{venueData.address.postalCode}</p>}
                    <p>{venueData.address.city}</p>
                    <div className={styles["social-media"]}>
                        {venueData.instagram &&
                        <a href={venueData.instagram}>
                            <img src={Instagram} width="30px" height="30px" alt=""/>
                        </a>}
                        {venueData.facebook &&
                        <a href={venueData.facebook}>
                            <img src={Facebook} width="30px" height="30px" alt=""/>
                        </a>}
                        {venueData.website &&
                        <a href={venueData.website}>
                            <img src={Website} width="30px" height="30px" alt=""/>
                        </a>}
                    </div>
                        {venueData ?
                        <>
                        <h3>Upcoming events:</h3>
                        <table className={styles["venue-table"]}>
                            <tr>
                                <th> Name:</th>
                                <th> Date:</th>
                                <th> Type:</th>
                            </tr>
                        </table>
                            {venueData.events.slice(0, 10).map((event) => {
                                return (<>
                                    <Link to={`/events/${event.id}`}>
                                        <table className={styles["venue-table"]}>
                                            <tr>
                                                <td> {event.name}</td>
                                                <td> {event.date}</td>
                                                <td> {event.type}</td>
                                            </tr>
                                        </table>
                                    </Link>
                                </>)
                                })}</>
                                : <h2>No events have been added to this venue yet.</h2>}
                    </div>

                <div className={styles["venue-reviews"]}>
                    <h2>Reviews:</h2>
                    {venueData.reviews.length >0 ? <div className={styles["scrollable-reviews"]}>
                    {venueData.reviews.map((review)=> { return (
                        <ReviewCard
                            user={review.userNormal.username}
                            content={review.reviewContent}
                            rating={review.rating}
                            date={review.date}
                            venueEvent={review.event ? review.event.name : review.venue.venueName}
                        />
                    )})}
                    </div>: <h3>No reviews yet! Be the first to add a review:</h3>}
                    {user && user.authorities[0].authority === "ROLE_USERSNORMAL" &&
                    <AddReview
                        type="venue"
                        id={venueData.id}
                    /> }
                    {!user && <Link to={"/register"}><h2 className={styles["error-message"]}>Make an account to add reviews here</h2></Link>  }
                    {user && user.authorities[0].authority === "ROLE_USERSOWNER" && <h2 className={styles["error-message"]}>You can't add reviews as venue owner.</h2>}
                </div>
                </section>
        </div>
        }
        </>
    )
}
export default SingleVenue;