import React, {useContext, useState} from "react";
import axios from "axios";
import {AuthContext} from "../context/AuthContext";

function RemoveVenueButton({venueId}){
    const {user} = useContext(AuthContext);
    const [confirm, setConfirm] = useState(false);
    const [succes, setSucces] = useState(false);
    const Token = localStorage.getItem('jwt');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`
    }

    async function deleteVenue(){
        try{
            const deleteVenue = await axios.delete(`http://localhost:8080/userOwner/${user.username}/venues/${venueId}`, {
                headers: headers
            })
            setSucces(true)
            setTimeout(()=> window.location.reload(false), 3000)
        }
        catch (e){
            console.error(e)
        }
    }

    return(<>
        {!confirm && <button onClick={setConfirm}>
            Remove venue
        </button>}
    {confirm &&
        <div>Are you sure you want to remove this venue?
    <button onClick={deleteVenue}>
        Yes
    </button>
    <button onClick={(e)=>setConfirm(false) }>
        No
    </button>
            {succes && <h1>Venue succesfully deleted</h1>}
        </div>
    }
    </>)
}

export default RemoveVenueButton;