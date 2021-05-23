import React, {useContext} from 'react';
import {Link, NavLink} from "react-router-dom";
import BigLogo from "../assets/logo_transparent_background.png";
import styles from './TopMenu.module.css';
import {AuthContext} from "../context/AuthContext";

function TopMenu() {
    const { user, logout} = useContext(AuthContext);
    return (
        <>
        <div className={styles["header-top-menu"]}>
            <header className={styles.header}>
                <NavLink to="/">
                <img src={BigLogo} width="500px" height="160px" alt="logo"/>
                </NavLink>
            </header>
            {!user &&
                <nav className={styles["login-register"]}>
                <ul>
                    <li>
                        <NavLink to="/login" className={styles.login} activeClassName={styles["login-active"]}>
                            Login
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/register" className={styles.register} activeClassName={styles["register-active"]}>
                            Register
                        </NavLink>
                    </li>
                </ul>
                </nav>}
            {user && <nav className={styles["login-register"]}>
                <ul>
                    <li>
                        <NavLink to="/profile" className={styles.profile} activeClassName={styles["profile-active"]}>
                         Profile of {user.username}
                        </NavLink>
                    </li>
                    <li>
                        <button onClick={logout}> Logout</button>
                    </li>
                </ul>
            </nav>}
        </div>

            <nav className={styles["top-menu"]}>
                <ul>
                    <li>
                        <NavLink to="/events" activeClassName={styles["events-active"]}>
                            Events
                        </NavLink>
                    </li>
                    <li className={styles["middle-list"]}>
                        <NavLink to="/venues" activeClassName={styles["venues-active"]}>
                            Venues
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/reviews" activeClassName={styles["reviews-active"]}>
                            Reviews
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default TopMenu;