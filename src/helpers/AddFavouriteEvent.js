import axios from "axios";

export default async function AddFavouriteEvent(eventId, username) {
    const Token = localStorage.getItem('jwt');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`
    }
        try{
            const addFavourite = await axios.post(`http://localhost:8080/userNormal/${username}/${eventId}`, {},{
                headers : headers
            })
            window.location.reload(false)
        }
        catch (e){
            console.error(e)
        }
}