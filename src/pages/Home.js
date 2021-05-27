import React from 'react';
import SmallThumbnail from "../components/SmallThumbnail";
import thumbnailImage1 from "../assets/thumbnailimage1.jpg";
import thumbnailImage2 from "../assets/thumbnailimage2.jpg";
import thumbnailImage3 from "../assets/thumbnailimage3.jpg";
import styles from "./Home.module.css";

function Home(){
    return(
        <div className={styles["homepage-links"]}>
            <SmallThumbnail
                image={thumbnailImage1}
                text="Find local events"
                link="/events"
                popupText="From karaokenight to themed parties. Find it all in our event section. Make an account to save your favourite events!"
            />
            <SmallThumbnail
                image={thumbnailImage2}
                text="Search venues"
                link="/venues"
                popupText="Find venues wherever you are and see what they have to offer!"
            />
            <SmallThumbnail
                image={thumbnailImage3}
                text="Share experiences"
                link="/reviews"
                popupText="See what others thought of your favourite events and venues and share your own opinion!"
            />
        </div>
    )
}
export default Home;