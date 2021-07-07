import React from 'react';
import styles from './ButtonSmall.module.css';

function ButtonLarge({title, type, onClick, disabled}) {
    return (
        <button className={styles.button}
                type={type}
                onClick={onClick}
                disabled={disabled}
        >
            {title}
        </button>
    )
}

export default ButtonLarge;