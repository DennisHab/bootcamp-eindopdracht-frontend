import React, {useState, useContext} from "react";
import {useForm} from "react-hook-form";
import axios from "axios";
import {AuthContext} from "../../../context/AuthContext";
import styles from "./AddImageToVenueForm.module.css";
import ButtonSmall from "../../Buttons/ButtonSmall/ButtonSmall";

function AddImageToEventForm({eventId, onClick}){
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [succes, toggleSucces] = useState(false);
    const [selectedFile, setFile] = useState(null);
    const {user} = useContext(AuthContext);
    const [backendError, setBackendError] = useState([]);
    const Token = localStorage.getItem('jwt');
    const headersMultiPart = {
        'Content-Type': 'undefined',
        'Authorization': `Bearer ${Token}`
    }

    async function onSubmit(){
        try{
            const formData = new FormData();
            formData.append(
                "file",
                selectedFile
            );
            const addImageToEvent = await axios.post(`http://localhost:8080/${user.username}/event/${eventId}/uploadimage`, formData
                , {
                    headers:headersMultiPart
                })
            toggleSucces(true);
            setTimeout(()=> window.location.reload(false),3000 )
        }
        catch (e){
            setBackendError([e.response.data.message])
            console.error(e)
        }
    }
    return(
        <div className={styles.container}>
            <ButtonSmall onClick={onClick} title="X"/>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="file">
                    Upload picture (maximum size= 1MB):
                    <div className={styles.error}>{errors?.file?.message} </div>
                    <input
                        id="file"
                        name="file"
                        type="file"
                        accept=".png,.jpg,.jpeg"
                        onChange={(e => setFile(e.target.files[0]))}
                    />
                </label>
                {backendError && backendError.map(error=> <div className={styles["error-big"]}>{error}</div>)}
                {succes && <div className={styles.succes}> Image added to event! </div> }
                <ButtonSmall type="submit" title="Add Image"/>
            </form>
        </div>
    )
}
export default AddImageToEventForm;