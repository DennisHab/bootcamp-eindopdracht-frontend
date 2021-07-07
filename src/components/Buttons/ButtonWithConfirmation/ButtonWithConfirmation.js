import React, {useState} from 'react';
import ButtonSmall from "../ButtonSmall/ButtonSmall";
import styles from "./ButtonWithConfirmation.module.css"

function ButtonWithConfirmation({buttonText, onClick, text}) {
    const [confirm, setConfirm] = useState(false);

    return (<>
        <div className={styles.button}>
            <ButtonSmall
                onClick={() => setConfirm(true)}
                title={buttonText}
            />
        </div>
        {confirm &&
        <div className={styles["popup-container"]}>
            <div className={styles.popup}>
                {text}
                <ButtonSmall
                    onClick={onClick}
                    title="Yes"
                />
                <ButtonSmall
                    onClick={() => setConfirm(false)}
                    title="No"
                />
            </div>
        </div>
        }
    </>)
}

export default ButtonWithConfirmation