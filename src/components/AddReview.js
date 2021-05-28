import React, {useState, useContext} from 'react';
import {useForm} from "react-hook-form";
import styles from './AddReview.module.css';
import {AuthContext} from "../context/AuthContext";
import axios from "axios";

function  AddReview({type, id}) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [backendError, setBackendError] = useState([]);
    const [sliderRating, setSliderRating] = useState(5);
    const [succes, setSucces] = useState(false);
    const {user} = useContext(AuthContext);
    const today = new Date();

    function slideRight(){
        if(sliderRating < 10){
            setSliderRating(sliderRating + 1)
        }
    }
    function slideLeft(){
        if(sliderRating > 1){
            setSliderRating(sliderRating - 1)
        }
    }
    async function onSubmit(data){
        try{
            const addReview = await axios.post(`http://localhost:8080/users/${user.username}/reviews/${type}/${id}`, {
                reviewContent : data.reviewContent,
                rating : sliderRating,
                date: today
            })
            setSucces(true);
            setTimeout(()=>window.location.reload(false), 1000)
           /* window.location.reload(false);*/
        }
        catch (e){
            console.error(e)
            setBackendError(e)
        }
    }

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset className={styles["review-content"]}>
                    <label htmlFor="review-content">
                        <h2>Add review:</h2>
                        <textarea className={styles["review-content-textbox"]}
                            placeholder="Write your review here"
                            name="reviewContent"
                            id="review-content"
                            {...register("reviewContent", {required: "This field is required",
                                minLength:{value: 1}, message: "Review must be at least 1 character long."})}
                        />
                    </label>
                    <div className={styles["slider-container"]}>
                    <label htmlFor="review-rating">
                        Rate this {type}
                        <button id={styles["button-left"]} type="button" onClick={slideLeft}>{"<"}</button>
                        <p>{sliderRating}</p>
                        <button id={styles["button-right"]} type="button" onClick={slideRight}>{">"}</button>
                    </label>
                    </div>
                    {backendError && backendError.map(error=> <div className={styles["error-big"]}>{error}</div>)}
                    {succes && <div className={styles.succes}> Review submitted</div> }
                    <button type="submit">Add review</button>
                </fieldset>
            </form>
        </div>
    )
}

export default AddReview;