import React, {useContext}from "react";
import {AuthContext} from "../context/AuthContext";
import styles from "./AddFavouriteEventButton.module.css"

import axios from "axios";

function AddFavouriteEventButton({eventId}){
    const {user} = useContext(AuthContext);
    async function addFavourite(){
        try{
            const addFavourite = await axios.post(`http://localhost:8080/usersNormal/${user.username}/${eventId}`)
            console.log(addFavourite)
            window.location.reload(false)
        }

        catch (e){
            console.error(e)
        }
    }
    return (
        <button className={styles["favourite-button"]} onClick={addFavourite}>
            Add to favourite events
        </button>
    )
}

export default AddFavouriteEventButton;