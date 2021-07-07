import styles from "./Rating.module.css"

function Rating({rating}){

    function setBackground(rating){
        if (rating >= 10){
            return "darkgreen"
        }
        if (rating >= 9){
            return "green"
        }
        if (rating >= 8){
            return "green"
        }
        if (rating >= 7){
            return "yellowgreen"
        }
        if (rating >= 6){
            return "yellow"
        }
        if (rating >= 5){
            return "orange"
        }
        if (rating >= 4){
            return "orangered"
        }
        if (rating >= 2){
            return "red"
        }
        if (rating >= 1){
            return "darkred"
        }
    }
    return(
        <div className={styles.rating} style={{backgroundColor :`${setBackground(rating)}`}}>
        {rating}
        </div>
    )
}

export default Rating;