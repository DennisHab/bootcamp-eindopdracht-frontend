import React, {useState, useContext} from "react";
import {useForm} from "react-hook-form";
import {registerLocale} from "react-datepicker";
import nl from "date-fns/locale/nl";
import styles from "./EventForm.module.css";

import axios from "axios";

function EventForm({venueId}) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [imageDisabled, toggleImageDisabled] = useState(false);
    const [fileDisabled, toggleFileDisabled] = useState(false);
    const [image, setImage] = useState("");
    const [backendError, setBackendError] = useState([])
    registerLocale('nl', nl);

    function uploadImage(e) {
        const files = e.target.files[0];
        const formData = new FormData();
        const fileSize = files.size;
        if (fileSize >= 5000000){
            setBackendError(["Uploaded file size exceeds 5MB"])
        } else {
            formData.append("upload_preset", "livelyupload");
            formData.append("file", files);

            axios.post(`https://api.cloudinary.com/v1_1/dhqkuww2g/image/upload`, formData)
                .then(res => setImage(res.data.secure_url))
                .catch(err => console.log(err));
        }}

    async function onSubmit(data){
        console.log(data)
        try{
            const postEvent = await axios.post(`http://localhost:8080/venues/${venueId}/events`, {
                name: data.name,
                type: data.type,
                date: data.date,
                time: data.time,
                eventDescription: data.eventDescription,
                ticketRequired: data.ticketRequired,
                image: data.image || image
            })
            window.location.reload(false)
            console.log(postEvent)
        }
        catch (e){
            console.error(e)
        }
    }
    return(
        <div className={styles.container}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset>
                    <label htmlFor="event-name">
                        Event name:
                        <div className={styles.error}>{errors?.name?.message} </div>
                        <input
                            name="name"
                            id="event-name"
                            type="text"
                            {...register("name", {required: "This field is required",
                                minLength: {value: 4, message:"Event name must be between 4 and 25 characters."},
                                maxLength: {value: 25, message:"Event name must be between 4 and 25 characters."}})}/>
                    </label>
                    <label htmlFor="event-type">
                        Event type:
                        <div className={styles.error}>{errors?.type?.message} </div>
                        <select
                            id="event-type"
                            name="type"
                            defaultValue="other"
                            size="4"
                            {...register("type", {required: "This field is required"})}
                        >
                            <option value="Themed party">Themed party</option>
                            <option value="Live music">Live music</option>
                            <option value="Open stage">Open stage</option>
                            <option value="other">Other</option>
                        </select>
                    </label>
                    <label htmlFor="date-select">
                    Date:
                        <div className={styles.error}>{errors?.date?.message} </div>
                        <input
                            type="date"
                            id="date-select"
                            name="date"
                            {...register("date", {required: "This field is required"})}
                        />
                    </label>
                    <label htmlFor="time-select">
                        Time:
                        <div className={styles.error}>{errors?.time?.message} </div>
                        <input
                            type="time"
                            id="time-select"
                            name="time"
                            {...register("time", {required: "This field is required"})}
                        />
                    </label>
                    <label htmlFor="event-description">
                        Event description:
                        <div className={styles.error}>{errors?.time?.message} </div>
                        <textarea
                            id="event-description"
                            name="eventDescription"
                            placeholder="Give a short description of your event"
                            {...register("EventDescription", {required: "This field is required"})}
                        />
                    </label>
                        <p>Ticket required?</p>
                    <div className={styles["ticket-required"]}>
                    <label htmlFor="ticket-required-yes">
                        <input
                            id="ticket-required-yes"
                            type="radio"
                            value="true"
                            name="ticketRequired"
                            {...register("ticketRequired")}
                        />
                        Yes
                    </label>
                    <label htmlFor="ticket-required-no">
                        <input
                            id="ticket-required-no"
                            type="radio"
                            value="false"
                            name="ticketRequired"
                            {...register("ticketRequired")}
                        />
                        No
                    </label>
                    </div>
                    <label htmlFor="file">
                        Upload picture (maximum size= 5MB):
                        <div className={styles.error}>{errors?.file?.message} </div>
                        <input
                            disabled={fileDisabled}
                            name="file"
                            type="file"
                            accept=".png,.jpg,.jpeg"
                            onChange={(event => uploadImage(event))}
                            onInput={toggleImageDisabled}
                        />
                    </label>
                    <label htmlFor="image-url">
                        Or add picture url:
                        <div className={styles.error}>{errors?.image?.message} </div>
                        <input
                            disabled={imageDisabled}
                            name="image"
                            id="image-url"
                            type="text"
                            onInput={toggleFileDisabled}
                            {...register("image")}
                        />
                    </label>
                    <button type="submit"> Add event</button>
                </fieldset>
            </form>
        </div>
    )
}

export default EventForm;
