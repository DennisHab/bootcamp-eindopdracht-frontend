import styles from "./ReviewCard.module.css";
import React from "react";

function ReviewCard({user, content, rating, date, venueEvent}){
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
    return(
    <div className={styles["single-review"]}>
        <header className={styles["review-header"]}>
            <span><p>Review for: </p> {venueEvent} </span>
            <span><p>User:</p> {user} </span>
            <span><p>Placed on:</p>{date}</span>
            <div className={styles["venue-rating"]} style={{backgroundColor: `${setBackground(rating)}`}}>{rating}</div>
        </header>
            <div className={styles["review-content"]}><p>Review:</p> {content}</div>
    </div>
    )
}

export default ReviewCard;