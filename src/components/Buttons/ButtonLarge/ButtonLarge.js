import React from 'react';
import styles from './ButtonLarge.module.css';

function ButtonLarge({title, type, onClick}) {
    return (
        <button className={styles.button}
                type={type}
                onClick={onClick}
        >
            {title}
        </button>
    )
}

export default ButtonLarge;