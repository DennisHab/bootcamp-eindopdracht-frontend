import React, {createContext, useState, useEffect} from 'react';
import {useHistory, Redirect} from "react-router-dom";
import jwt_decode from "jwt-decode";
import axios from "axios";

export const AuthContext = createContext({});

function AuthContextProvider({children}){
    const history = useHistory();
    const [authState, setAuthState] = useState({
        user: null,
        status: 'pending',
    })
    async function fetchUserData(jwtToken) {
        const decoded = jwt_decode(jwtToken)
        const userId = decoded.sub;
        try {
            const result = await axios.get(`http://localhost:8080/users/${userId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwtToken}`,
                }
            })
            console.log(result);
            setAuthState({
                user:{
                    username: result.data.username,
                    emailAddress: result.data.emailAddress,
                    firstName: result.data.firstName,
                    lastName: result.data.lastName,
                    address: result.data.address,
                    rating: result.data.rating,
                    reviews: result.data.reviews,
                    favouredEvents: result.data.favouredEvents,
                    authorities: result.data.authorities,
                    venueList: result.data.venueList
                },
                status: 'done'
            });
        }
        catch(e) {
            console.error(e)
        }
    }
    useEffect(()=>{
        const token = localStorage.getItem('jwt')
        if (token !== null && authState.user === null) {
            fetchUserData(token);

        }else {setAuthState({
            user: null,
            status: 'done',
        })}

    }, [])
    async function login(jwtToken) {
        localStorage.setItem('jwt', jwtToken);
        fetchUserData(jwtToken);
        history.push('/');
    }
    function logout() {
        localStorage.clear();
        setAuthState({
            user:null,
            status:"done"
        })
        history.push('/');
    }
    const data = {
        ...authState,
        login: login,
        logout: logout
    }
    return (
        <AuthContext.Provider value={data}>
            {authState.status === 'done' ? children
                : <p>Loading...</p>
            }

        </AuthContext.Provider>
    )
}

export default AuthContextProvider;