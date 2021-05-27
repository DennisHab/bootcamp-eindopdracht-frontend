import React, {useContext, useState} from "react";
import axios from "axios";
import {AuthContext} from "../context/AuthContext";

function RemoveEventButton({venueId, eventId}){
    const {user} = useContext(AuthContext);
    const [confirm, setConfirm] = useState(false);
    const [succes, setSucces] = useState(false);
    async function deleteEvent(){
        try{
            const deleteEvent = await axios.delete(`http://localhost:8080/usersOwner/${user.username}/venues/${venueId}/${eventId}`)
            setSucces(true)
            setTimeout(()=> window.location.reload(false), 3000)
        }

        catch (e){
            console.error(e)
        }
    }
    return(<>
        {!confirm && <button onClick={()=> setConfirm(true)}>
            Remove Event
        </button>}
        {confirm &&
        <div>Are you sure you want to remove this event?
            <button onClick={deleteEvent}>
                Yes
            </button>
            <button onClick={()=>setConfirm(false)}>
                No
            </button>
            {succes && <h1>Event succesfully deleted</h1>}
        </div>
        }
    </>)
}

export default RemoveEventButton;