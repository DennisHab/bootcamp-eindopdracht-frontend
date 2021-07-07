import React, {useState, useContext} from "react";
import {useForm} from "react-hook-form";
import axios from "axios";
import {AuthContext} from "../../../context/AuthContext";
import styles from "./AddImageToVenueForm.module.css";
import ButtonSmall from "../../Buttons/ButtonSmall/ButtonSmall";

function AddImageToVenueForm({venueId, onClick}){
    const { handleSubmit, formState: { errors } } = useForm();
    const [succes, toggleSucces] = useState(false);
    const [selectedFile, setFile] = useState(null);
    const {user} = useContext(AuthContext);
    const [backendError, setBackendError] = useState([]);
    const Token = localStorage.getItem('jwt');
    const headersMultiPart = {
        'Content-Type': 'undefined',
        'Authorization': `Bearer ${Token}`,
        params : {
            "file": selectedFile
        }
    }

    async function onSubmit(){
        try{
            const formData = new FormData();
            formData.append(
                "file",
                selectedFile
            );
            const addImageToVenue = await axios.post(`http://localhost:8080/${user.username}/venue/${venueId}/uploadimage`, formData
             , {
                headers:headersMultiPart
            })
            toggleSucces(true);
            setTimeout(()=> window.location.reload(false), 1500)

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
                <ButtonSmall type="submit" title="Add Image"/>
            </form>
        </div>
    )
}
export default AddImageToVenueForm;