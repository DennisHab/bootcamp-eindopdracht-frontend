import styles from "./InputFeedback.module.css";

function InputFeedback({input, length}) {
    return (
        <div className={styles["input-feedback"]}>
            Your search<p> "{input}" </p> returned <p>{length}</p>{length === 1 ? "result" : "results"} :
        </div>
    )

}

export default InputFeedback