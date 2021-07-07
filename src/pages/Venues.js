import React, {useEffect, useState} from 'react';
import axios from "axios";
import styles from './CSS/Venues.module.css';
import VenueCard from "../components/Cards/VenueCard/VenueCard";
import SearchBar from "../components/Navigation/SearchBar/SearchBar";
import TopNavigation from "../components/Navigation/TopNavigation/TopNavigation";
import InputFeedback from "../components/misc/InputFeedback";
import LoadingAnimation from "../components/LoadingAnimation/LoadingAnimation";
import Pagination from "../components/Navigation/Pagination/Pagination";

function Venues() {
    const [customVenueData, setCustomVenueData] = useState([]);
    const [defaultVenueData, setDefaultVenueData] = useState([]);
    const [input, setInput] = useState("");
    const [inputData, setInputData] = useState([]);
    const [sortedBy, setSortedBy] = useState("")
    const [venuesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [addEvent, toggleAddEvent] = useState(false);
    const [addImage, toggleAddImage] = useState(false);
    const [deleteVenue, toggleDeleteVenue] = useState(false);
    const [loading, toggleLoading] = useState(false);

    async function getVenues() {
        toggleLoading(true)
        try {
            const getVenues = await axios.get('http://localhost:8080/venues')
            setDefaultVenueData(getVenues.data)
            setInputData(getVenues.data)
            if (getVenues.data.length > 0 && customVenueData.length === 0 && !input) {
                setCustomVenueData(getVenues.data)
            }
            toggleLoading(false)
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        getVenues()
        if (input && sortedBy !== "") {
            updateInput(input)
        }
        renderVenues(customVenueData)
        setSortedBy("")

    }, [customVenueData])

    //Functie die alle venues sorteert op naam en vervolgens het resultaat in customvenuedata zet
    async function sortVenuesByName() {
        setSortedBy("name")
        const sortedByName = defaultVenueData.sort((a, b) => {
            const nameA = a.venueName.toUpperCase();
            const nameB = b.venueName.toUpperCase();
            if (nameA < nameB) return -1
            if (nameA > nameB) return 1
            return 0
        })
        setCustomVenueData(sortedByName)
        if (input) {
            setInputData(sortedByName)
        }
    }

    async function sortVenuesByRatingLowHigh() {
        setSortedBy("rating")
        const sortedByRating = defaultVenueData.sort((a, b) => {
            const nameA = a.rating;
            const nameB = b.rating;
            if (nameA < nameB) return -1
            if (nameA > nameB) return 1
            return 0
        })
        setCustomVenueData(sortedByRating)
        if (input) {
            setInputData(sortedByRating)
        }
    }

    async function sortVenuesByRatingHighLow() {
        setSortedBy("rating")
        const sortedByRating = defaultVenueData.sort((a, b) => {
            const nameA = a.rating;
            const nameB = b.rating;
            if (nameA < nameB) return 1
            if (nameA > nameB) return -1
            return 0
        })
        setCustomVenueData(sortedByRating)
        if (input) {
            setInputData(sortedByRating)
        }
    }

    //Functie die alle venues sorteert op stad en vervolgens het resultaat in customvenuedata zet
    async function sortVenuesByCity() {
        setSortedBy("city")
        const sortedByCity = defaultVenueData.sort((a, b) => {
            const cityA = a.address.city.toUpperCase();
            const cityB = b.address.city.toUpperCase();
            if (cityA < cityB) return -1
            if (cityA > cityB) return 1
            return 0
        })
        setCustomVenueData(sortedByCity)
        if (input) {
            setInputData(sortedByCity)
        }
    }

    //Functie die de venueData filtert op basis van de input in de zoekbalk. Resultaten worden direct getoond. Huidige pagina wordt aangepast naar 1.
    async function updateInput(input) {
        const filtered = inputData.filter((venue) => {
            return venue.venueName.toLowerCase().includes(input.toLowerCase()) || venue.address.city.toLowerCase().includes(input.toLowerCase())
        })
        setInput(input)
        setCustomVenueData(filtered)
        setCurrentPage(1)
    }

    //Functie die alle venues in een venuecard component mapped.
    const renderVenues = (venueData) => {
        return (<>
                {input && <InputFeedback input={input} length={customVenueData.length}/>}
                <ul className={styles["venue-list"]}>
                    {venueData.map((venue, index) => {
                        return (
                            <li key={index}>
                                <VenueCard
                                    index={index}
                                    image={venue.image}
                                    city={venue.address.city}
                                    name={venue.venueName}
                                    events={venue.events}
                                    id={venue.id}
                                    facebook={venue.facebook}
                                    instagram={venue.instagram}
                                    rating={venue.rating}
                                    website={venue.website}
                                    addEvent={addEvent}
                                    toggleAddEvent={toggleAddEvent}
                                    addImage={addImage}
                                    toggleAddImage={toggleAddImage}
                                    deleteVenue={deleteVenue}
                                    toggleDeleteVenue={toggleDeleteVenue}
                                />
                            </li>
                        )
                    })}
                </ul>
            </>
        )
    }
    //Variabelen die ervoor zorgen dat het juiste aantal venues per pagina wordt getoond dmv de eerder ingestelde state.
    const indexOfLastItem = currentPage * venuesPerPage;
    const indexOfFirstItem = indexOfLastItem - venuesPerPage;
    const currentVenues = customVenueData.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className={styles.container}>
            <TopNavigation
                sortButtons={<>
                    <button onClick={() => sortVenuesByName()}> Name</button>
                    <button onClick={() => sortVenuesByCity()}> City</button>
                    <button onClick={() => sortVenuesByRatingLowHigh()}> Rating(Low to High)</button>
                    <button onClick={() => sortVenuesByRatingHighLow()}> Rating(High to Low)</button>
                </>
                }
                children={<>
                    <SearchBar
                        query={input}
                        setQuery={updateInput}
                        placeholder="Search by venue name or city"
                    />
                    <Pagination
                        length={customVenueData.length}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        itemsPerPage={venuesPerPage}
                    />
                </>
                }
            />
            {renderVenues(currentVenues)}
            {loading && <LoadingAnimation/>}
        </div>
    )
}

export default Venues