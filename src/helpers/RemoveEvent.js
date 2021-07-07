import axios from "axios";

export default async function deleteEvent(username, venueId, eventId){
    const Token = localStorage.getItem('jwt');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`
    }
    try{
        const deleteEvent = await axios.delete(`http://localhost:8080/userOwner/${username}/venues/${venueId}/${eventId}`,{
            headers:headers
        })
        setTimeout(()=> window.location.reload(false), 2000)
    }
    catch (e){
        console.error(e)
    }
}