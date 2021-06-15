import styles from "./ReviewCard.module.css";
import React from "react";
import Rating from "./Rating";

function ReviewCard({user, content, rating, date, venueEvent}){
    return(
    <div className={styles.container}>
        <header className={styles["review-header"]}>
            <span><p>Review for: </p> {venueEvent} </span>
            <span><p>User:</p> {user} </span>
            <span><p>Placed on:</p>{date}</span>
        </header>
            <div className={styles["review-content"]}><p>Review:</p> {content}</div>
            <Rating rating={rating}/>
    </div>
    )
}

export default ReviewCard;