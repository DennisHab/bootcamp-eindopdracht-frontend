import React, {useState} from "react"
import styles from "./TopNavigation.module.css"

function TopNavigation({children, sortButtons, filterButtons, events, reviews}){
    const [sortOptions, toggleSortOptions] = useState(true);
    return (
            <div className={styles.navigation}>
                <div className={styles["navigation-sort-search"]}>
                    <div className={styles["sort-button"]}>
                        Sort by <div className={styles.arrow}></div>
                        {!reviews && <div className={events ? styles["sort-buttons-events"] : styles["sort-buttons"]}>
                                {sortButtons}
                            </div>}
                        {reviews && <div className={styles["sort-buttons-reviews"]}>
                            {sortButtons}
                        </div>}
                    </div>
                    {filterButtons &&
                    <div className={styles["sort-button"]}>
                        Filter <div className={styles.arrow}></div>
                        <div className={styles["sort-buttons-filter"]}>
                            {filterButtons}
                        </div>
                    </div>}

                        {children}
                </div>
            </div>
    )
}

export default TopNavigation;