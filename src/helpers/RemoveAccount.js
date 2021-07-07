import axios from "axios";



export default async function removeAccount(username, logout){
    const Token = localStorage.getItem('jwt');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`
    }
    try{
        const deleteAccount = await axios.delete(`http://localhost:8080/deleteUser/${username}`,{
            headers:headers
        })
        logout()
        setTimeout(()=> window.location.reload(false), 3000)
    }
    catch (e){
        console.error(e)
    }
}