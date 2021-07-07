import React, {useState, useContext} from "react";
import {useForm} from "react-hook-form";
import styles from "./EventForm.module.css";
import {AuthContext} from "../../../context/AuthContext";
import axios from "axios";
import moment from 'moment';
import ButtonSmall from "../../Buttons/ButtonSmall/ButtonSmall";

function EventForm({venueId, onClick}) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const {user}=useContext(AuthContext);
    const [backendError, setBackendError] = useState([]);
    const Token = localStorage.getItem('jwt');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`
    }
    async function onSubmit(data){

        try{
            console.log(data.date)
            const postEvent = await axios.post(`http://localhost:8080/userOwner/${user.username}/venues/${venueId}/events`, {
                name: data.name,
                type: data.type,
                date: moment(data.date).format("DD-MM-yyyy"),
                time: data.time,
                eventDescription: data.eventDescription,
                ticketRequired: data.ticketRequired
            },{
                headers:headers
            })
            window.location.reload(false)
        }
        catch (e){
            console.error(e)
        }
    }
    return(
        <div className={styles.container}>
            <ButtonSmall onClick={onClick} title="X"/>
            <form className={styles["form-container"]} onSubmit={handleSubmit(onSubmit)}>

                <fieldset className={styles["form-first-part"]}>
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
                </fieldset>
                <fieldset className={styles["form-second-part"]}>
                    <label htmlFor="event-description">
                        Event description:
                        <div className={styles.error}>{errors?.eventDescription?.message} </div>
                        <textarea
                            id="event-description"
                            name="eventDescription"
                            placeholder="Give a short description of your event"
                            {...register("eventDescription", {required: "This field is required"})}
                        />
                    </label>
                        <p>Ticket required?</p>
                    <div id={styles["ticket-required"]}>
                    <label htmlFor="ticket-required-yes">
                        Yes
                        <input
                            id="ticket-required-yes"
                            type="radio"
                            value="true"
                            name="ticketRequired"
                            {...register("ticketRequired")}
                        />
                    </label>
                    <label htmlFor="ticket-required-no">
                        No
                        <input
                            id="ticket-required-no"
                            type="radio"
                            value="false"
                            name="ticketRequired"
                            {...register("ticketRequired")}
                        />
                    </label>
                    </div>
                    {backendError && backendError.map(error=> <div className={styles["error-big"]}>{error}</div>)}
                    <ButtonSmall title="Add event" type="submit"/>
                </fieldset>
            </form>
        </div>
    )
}
export default EventForm;
