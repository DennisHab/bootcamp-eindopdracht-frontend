import React, {useContext, useState} from "react";
import axios from "axios";
import {AuthContext} from "../context/AuthContext";

function RemoveVenueButton({venueId}){
    const {user} = useContext(AuthContext);
    const {venueList} = {user};
    const [confirm, setConfirm] = useState(false);
    const [succes, setSucces] = useState(false);


    async function deleteVenue(){
        console.log(venueList)
        try{
            const deleteVenue = await axios.delete(`http://localhost:8080/usersOwner/${user.username}/venues/${venueId}`)
            console.log(deleteVenue)
            console.log(venueList)
            setSucces(true)
            setTimeout(()=> window.location.reload(false), 3000)
        }

        catch (e){
            console.error(e)
        }
    }
    return(<>
        {!confirm && <button onClick={()=> setConfirm(true)}>
            Remove venue
        </button>}
    {confirm &&
        <div>Are you sure you want to remove this venue?
    <button onClick={deleteVenue}>
        Yes
    </button>
    <button onClick={()=>setConfirm(false)}>
        No
    </button>
            {succes && <h1>Venue succesfully deleted</h1>}
        </div>
    }
    </>)
}

export default RemoveVenueButton;