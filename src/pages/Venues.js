import React, {useState, useContext, useEffect} from 'react';
import axios from "axios";
import styles from './Venues.module.css';
import VenueCard from "../components/VenueCard";
import NoImage from "../assets/no-image-found-360x250.png"


function Venues() {
    const [venueData, setVenueData] = useState([]);
    const [dropdown, toggleDropdown] = useState("none","flex");

    useEffect(()=> {
        async function getVenues() {
            try{
                const getVenues = await axios.get('http://localhost:8080/venues')
                setVenueData(getVenues.data)
                console.log(venueData)
            }
            catch(e){
                console.error(e)
            }
        }
        getVenues()
    }, [])




    return (
        <div className={styles.container}>

            {venueData !== null ? <>
                {venueData.map((venue)=> { return <div className={styles["venue-container"]}>
                    {venue.image !== null && <img src={venue.image}/>}
                    {venue.image === null && <img src={NoImage}/> }
                <VenueCard
                    data={venueData}
                    city={venue.address.city}
                    name={venue.venueName}
                    events={venue.events}
                    link={venue.id}
                />
                </div>})}
                    </>   : <h1>LOADING.....</h1>}

                {/*{venueData.map((venue)=> { return <div className={styles["venue-container"]}>

                        <fieldset className={styles["single-venue"]}>
                            <h1>{venue.venueName} in {venue.address.city}</h1>
                        </fieldset></div>
                    })}*/}

        </div>
    )
}

export default Venues;