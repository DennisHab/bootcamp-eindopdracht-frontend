import React from "react";
import styles from "./Searchbar.module.css";

function SearchBar({query, setQuery, placeholder}) {
    return (
        <input
            className={styles.searchbar}
            key="random1"
            value={query}
            placeholder={placeholder}
            onChange={(e)=> setQuery(e.target.value)}
        />
    )
}

export default SearchBar;