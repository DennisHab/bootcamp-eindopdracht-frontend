import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import axios from "axios";
import styles from "./SingleVenue.module.css";
import NoImage from "../assets/no-image-found-360x250.png";
import AddReview from "../components/AddReview";


function SingleVenue() {
    const [venueData, setVenueData] = useState(null);
    let {id} = useParams();


    useEffect(()=> {
        async function getVenue() {
            try{
                const getVenue = await axios.get(`http://localhost:8080/venues/${id}`);
                setVenueData(getVenue.data)
                console.log(venueData);
            }
            catch(e){
                console.error(e);
            }
        }getVenue()
    },[] )
    return(<>
        {venueData &&
        <div className={styles.container}>
            <div className={styles["venuecard-image"]}>
            {venueData.image !== null && <img src={venueData.image}/>}
            {venueData.image === null && <img src={NoImage}/> }
                <fieldset className={styles["venue-card"]}>
                    <h1>{venueData.venueName} {venueData.rating}</h1>
                    <h2>{venueData.address.city}</h2>
                    <p>Address:</p>
                    <p>{venueData.address.streetName} {venueData.address.houseNumber}</p>
                </fieldset>
            </div>
                <fieldset className={styles["venue-reviews"]}>
                    <h2>Reviews:</h2>
                    {venueData.reviews.size !== null ? <div className={styles["scrollable-reviews"]}>
                    {venueData.reviews.map((review)=> { return (
                        <div className={styles["single-review"]}>
                            <span><p>By:</p> {review.userNormal.username}</span>
                            <span><p>Review:</p> {review.reviewContent}</span>
                        </div>
                    )})}
                    </div>: <h3>No reviews yet! Be the first to place a review</h3>}
                    <AddReview
                        type="venue"
                        id={venueData.id}
                    />
                </fieldset>
        </div>
        }
        </>
    )
}
export default SingleVenue;