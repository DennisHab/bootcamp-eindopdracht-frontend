import React from 'react';
import SmallThumbnail from "../components/SmallThumbnail";
import thumbnailImage1 from "../assets/thumbnailimage1.jpg";
import thumbnailImage2 from "../assets/thumbnailimage2.jpg";
import thumbnailImage3 from "../assets/thumbnailimage3.jpg";
import "./Home.css";
function Home(){
    return(
    <div className="homepage-links">
        <SmallThumbnail
            image={thumbnailImage1}
            text="Find local events"
            link="/events"
            popupText="From karaokenight to themed parties. Find it all in our event section. Make an account to personalize
            your suggested events!"
        />
        <SmallThumbnail
            image={thumbnailImage2}
            text="Search venues"
            link="/venues"
            popupText="From karaokenight to themed parties. Find it all in our event section. Make an account to personalize
            your suggested events!"
        />
        <SmallThumbnail
            image={thumbnailImage3}
            text="Hook up with friends"
            link="/profile"
            popupText="From karaokenight to themed parties. Find it all in our event section. Make an account to personalize
            your suggested events!"
        />
    </div>
    )
}
export default Home;