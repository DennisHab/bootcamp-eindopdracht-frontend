import styles from "./SlideNavigationMenu.module.css";

function SlideNavigationMenu({children}){
    return (
        <div className={styles["navigation-container"]}>
                <div id={styles.menu}></div>
            <div className={styles["bottom-navigation"]}>
                {children}
            </div>
        </div>
    )
}
export default SlideNavigationMenu