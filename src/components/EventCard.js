import {Link} from "react-router-dom";
import styles from "../pages/Venues.module.css";

function EventCard({ name, venue, link}){
    return(
        <>  <Link to={`/events/${link}`}>
            <fieldset className={styles["single-venue"]}>
                <h1>{name} at {venue}</h1>

            </fieldset>
        </Link>
        </>
    )
}

export default EventCard;