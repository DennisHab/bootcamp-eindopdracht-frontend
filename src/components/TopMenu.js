import React from 'react';
import {Link, NavLink} from "react-router-dom";
import BigLogo from "../assets/logo_transparent_background.png";
import './TopMenu.css';

function TopMenu() {
    return (
        <>
        <div className="header-top-menu">
            <header className="header">
                <img src={BigLogo} width="500px" height="160px" alt="logo"/>
            </header>
                <ul className="login-register">
                    <li>
                        <NavLink to="/login" className="login "activeClassName="login-active">
                            Login
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/register" className="register" activeClassName="register-active">
                            Register
                        </NavLink>
                    </li>
                </ul>
        </div>

            <nav className="top-menu">
                <ul>
                    <li>
                        <NavLink to="/events" activeClassName="events-active">
                            Events
                        </NavLink>
                    </li>
                    <li className="middle-list">
                        <NavLink to="/venues" activeClassName="venues-active">
                            Venues
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/reviews" activeClassName="reviews-active">
                            Reviews
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default TopMenu;