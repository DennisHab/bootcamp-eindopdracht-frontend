import React from 'react';
import {NavLink} from "react-router-dom";
import styles from './SmallThumbnail.module.css';
import SmallLogo from '../assets/logo_transparent_background_small.png';

function SmallThumbnail({image,text,link, popupText}) {
return (
    <NavLink to={link}>
        <div className={styles["flip-container"]}>
            <div className={styles.flipper}>
                <div className={styles.front}>
                    <img className={styles["front-image"]} src={image} width = "400px" height="400px" alt=""/>
                    <section className={styles["text-area-front"]}>
                        <p>{text}</p>
                    </section>
                </div>
                <div className={styles.back}>
                    <p>{text}</p>
                    <span>{popupText}</span>
                    <img className={styles["back-image"]} src={SmallLogo} alt=""/>
                </div>
            </div>
        </div>
    </NavLink>
)
}
export default SmallThumbnail;
