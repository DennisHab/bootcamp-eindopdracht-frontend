import React, {useState, useContext, useEffect} from 'react';
import axios from "axios";
import styles from './Venues.module.css';
import VenueCard from "../components/VenueCard";
import {useForm} from "react-hook-form";
import SearchBar from "../components/SearchBar";

function Venues() {
    const [venueData, setVenueData] = useState([]);
    const [defaultVenueData, setDefaultVenueData] = useState([]);
    const {register, handleSubmit, formState: {errors}} = useForm();
    const [input, setInput] = useState("");
    const [venuesPerPage, setVenuesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageNumberLimit, setpageNumberLimit] = useState(5);
    const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5);
    const [minPageNumberLimit, setminPageNumberLimit] = useState(0);
    const [pagedVenueData, setPagedVenueData] = useState([]);

    async function getVenues() {
        try{
            const getVenues = await axios.get('http://localhost:8080/venues')
            setVenueData(getVenues.data)
            setDefaultVenueData(getVenues.data)
        }
        catch(e){
            console.error(e)
        }
    }
    useEffect(()=> {
        getVenues()

    }, [])

    async function sortVenuesByName(){
        const sortedByName = defaultVenueData.sort((a,b)=>{
            return a.venueName - b.venueName
        })
        setPagedVenueData(sortedByName)
        pagedVenueData.slice(indexOfFirstItem, indexOfLastItem);
        setCurrentPage(1);
    }

    async function updateInput(input){
        const filtered = defaultVenueData.filter((venue)=>{
            return venue.venueName.toLowerCase().includes(input.toLowerCase()) || venue.address.city.toLowerCase().includes(input.toLowerCase())
        })
        setInput(input)
        setPagedVenueData(filtered)
        pagedVenueData.slice(indexOfFirstItem, indexOfLastItem);
        setCurrentPage(1);
    }

    const renderVenues = (venueData)=> { return(
        <ul className={styles["venue-list"]}>
            {venueData.map((venue, index)=> { return(
                <li key={index}>
                    <VenueCard
                        index={index}
                        image={venue.image}
                        data={venueData}
                        city={venue.address.city}
                        name={venue.venueName}
                        events={venue.events}
                        id={venue.id}
                        facebook={venue.facebook}
                        instagram={venue.instagram}
                        rating={venue.rating}
                        website={venue.website}
                    />
                </li>
            )})}
        </ul>
    )}
    const pages = [];
    for (let i = 1; i <= Math.ceil(venueData.length / venuesPerPage); i++) {
        pages.push(i);
    }
    const indexOfLastItem = currentPage*venuesPerPage;
    const indexOfFirstItem = indexOfLastItem - venuesPerPage;
    const currentVenues = venueData.slice(indexOfFirstItem, indexOfLastItem);

    const handleClick = (event) => {
        setCurrentPage(Number(event.target.id));
    };
    const renderPageNumbers = pages.map((number) => {
        if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
            return (
                <li
                    key={number}
                    id={number}
                    value={number}
                    onClick={handleClick}
                    className={currentPage == number ? `${styles.active}` : null}
                >
                    {number}
                </li>
            );
        } else {
            return null;
        }
    });
    const handleNextbtn = () => {
        setCurrentPage(currentPage + 1);

        if (currentPage + 1 > maxPageNumberLimit) {
            setmaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
            setminPageNumberLimit(minPageNumberLimit + pageNumberLimit);
        }
    };
    const handlePrevbtn = () => {
        setCurrentPage(currentPage - 1);

        if ((currentPage - 1) % pageNumberLimit == 0) {
            setmaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
            setminPageNumberLimit(minPageNumberLimit - pageNumberLimit);
        }
    };

    return (
        <div className={styles.container}>
            <section className={styles["venue-navigation"]}>
                <button onClick={()=>sortVenuesByName()}> Sort by name</button>
                <SearchBar
                    query={input}
                    setQuery={updateInput}
                    placeholder="Search by venue name or city"
                />
                <button> Sort by city</button>
            </section>
            <ul className={styles["pageNumbers"]}>
                <li id={styles["button-prev"]}>
                    <button
                        onClick={handlePrevbtn}
                        disabled={currentPage == pages[0] ? true : false}
                    >
                        Prev
                    </button>
                </li>
                {renderPageNumbers}
                <li id={styles["button-next"]}>
                    <button
                        onClick={handleNextbtn}
                        disabled={currentPage == pages[pages.length - 1] ? true : false}
                    >
                        Next
                    </button>
                </li>
            </ul>
            {!input  && renderVenues(currentVenues)}
            {input && renderVenues(pagedVenueData)}

        </div>
    )
}

export default Venues;