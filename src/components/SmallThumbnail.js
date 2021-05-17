import React from 'react';
import {NavLink, Link} from "react-router-dom";
import styles from './SmallThumbnail.module.css';

function SmallThumbnail({image,text,link, popupText}) {
return (
    <NavLink to={link}>
        <div className={styles["flip-container"]}>
            <div className={styles.flipper}>
                <div className={styles.front}>
                    <img src={image} width = "400px" height="400px" alt="Image"/>
                    <p>{text}</p>
                </div>
                <div className={styles.back}>
                    <p>{text}</p>
                    <span>{popupText}</span>
                </div>
            </div>
        </div>
    </NavLink>
)
}
export default SmallThumbnail;
