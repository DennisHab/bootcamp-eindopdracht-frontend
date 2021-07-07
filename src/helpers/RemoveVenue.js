import axios from "axios";

export default async function RemoveVenue(username, venueId){
    const Token = localStorage.getItem('jwt');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`
    }
    try{
        const deleteVenue = await axios.delete(`http://localhost:8080/userOwner/${username}/venues/${venueId}`, {
            headers: headers
        })
        setTimeout(()=> window.location.reload(false), 1000)
    }
    catch (e){
        console.error(e)
    }
}