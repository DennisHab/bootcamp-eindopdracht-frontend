import axios from "axios";

export default async function RemoveFavouriteEvent(eventId, username) {
    const Token = localStorage.getItem('jwt');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`
    }
    try{
        const removeFavourite = await axios.delete(`http://localhost:8080/userNormal/${username}/${eventId}`,{
            headers:headers
        })
        window.location.reload(false)

    }
    catch (e){
        console.error(e)
    }

}