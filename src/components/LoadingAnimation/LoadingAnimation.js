import React from "react";
import styles from "./LoadingAnimation.module.css";

function LoadingAnimation() {
return (
    <div className={styles.container}>
    <div className={styles["animation-container"]}>
        <div className={styles["first-line"]}>
        </div>
        <div className={styles["second-line"]}>
        </div>
        <div className={styles["third-line"]}>
        </div>
        <div className={styles["fourth-line"]}>
        </div>
        <div className={styles["fifth-line"]}>
        </div>
        <div className={styles["sixth-line"]}>
        </div>
    </div>
    </div>
)
}

export default LoadingAnimation