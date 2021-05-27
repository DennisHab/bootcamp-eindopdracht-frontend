import react from "react";
import styles from "./ReviewCard.module.css";
import React from "react";

function ReviewCard({user, content, rating}){
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
            <span><p>By:</p> {user}</span>
            <div className={styles["venue-rating"]} style={{backgroundColor: `${setBackground(rating)}`}}>{rating}</div>
        </header>
            <span><p>Review:</p> {content}</span>
    </div>
    )
}

export default ReviewCard;