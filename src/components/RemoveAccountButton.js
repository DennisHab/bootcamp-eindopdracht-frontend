import {AuthContext} from "../context/AuthContext";
import axios from "axios";
import react, {useState, useContext} from "react";

function RemoveAccountButton(){
    const {user, logout} = useContext(AuthContext);
    const [confirm, setConfirm] = useState(false);
    const [succes, setSucces] = useState(false);
    const Token = localStorage.getItem('jwt');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`
    }
    async function deleteAccount(){
        try{
            const deleteAccount = await axios.delete(`http://localhost:8080/deleteUser/${user.username}`,{
                headers:headers
            })
            setSucces(true)
            logout()
            setTimeout(()=> window.location.reload(false), 3000)
        }
        catch (e){
            console.error(e)
        }
    }
    return(<>
        {!confirm && <button onClick={()=> setConfirm(true)}>
            Remove Account
        </button>}
        {confirm &&
        <div>Are you sure you want to remove your account?
            <button onClick={deleteAccount}>
                Yes
            </button>
            <button onClick={()=>setConfirm(false)}>
                No
            </button>
            {succes && <h1>Account succesfully deleted</h1>}
        </div>
        }
    </>)
}

export default RemoveAccountButton;