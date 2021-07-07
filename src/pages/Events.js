import React, {useEffect, useState} from 'react';
import axios from "axios";
import styles from './CSS/Events.module.css';
import EventCard from "../components/Cards/EventCard/EventCard";
import SearchBar from "../components/Navigation/SearchBar/SearchBar";
import LoadingAnimation from "../components/LoadingAnimation/LoadingAnimation";
import TopNavigation from "../components/Navigation/TopNavigation/TopNavigation";
import InputFeedback from "../components/misc/InputFeedback";
import Pagination from "../components/Navigation/Pagination/Pagination";

function Events() {
    const [customEventData, setCustomEventData] = useState([]);
    const [defaultEventData, setDefaultEventData] = useState([]);
    const [input, setInput] = useState("");
    const [inputData, setInputData] = useState([]);
    const [sortedBy, setSortedBy] = useState("");
    const [eventsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, toggleLoading] = useState(false);
    const [filterEvents, toggleFilterEvents] = useState(false);
    const today = new Date();
    const date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();

    async function getEvents() {
        toggleLoading(true);
        try {
            const getEvents = await axios.get('http://localhost:8080/events')
            setDefaultEventData(getEvents.data)
            setInputData(getEvents.data)
            if (getEvents.data.length > 0 && customEventData.length === 0 && !input && sortedBy === "") {
                setCustomEventData(getEvents.data)
            }
            toggleLoading(false);
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        getEvents()
        if (input && sortedBy !== "") {
            updateInput(input)
        }
        renderEvents(customEventData)
        setSortedBy("")

    }, [customEventData])

    //Functie die alle events sorteert op datum en vervolgens het resultaat in customeventdata zet
    async function sortEventsByDate() {
        setSortedBy("date")
        const sortedByDate = defaultEventData.sort((a, b) => {
            return (
                new Date(a.date.split('-').reverse()) - new Date(b.date.split('-').reverse()))
        })
        setCustomEventData(sortedByDate)
        if (input) {
            setInputData(sortedByDate)
        }

    }

    //Functie die alle venues sorteert op venue en vervolgens het resultaat in customeventdata zet
    async function sortEventsByVenue() {
        setSortedBy("venue")
        const sortedByVenue = defaultEventData.sort((a, b) => {
            const cityA = a.venue.venueName.toUpperCase();
            const cityB = b.venue.venueName.toUpperCase();
            if (cityA < cityB) return -1
            if (cityA > cityB) return 1
            return 0
        })
        setCustomEventData(sortedByVenue)
        if (input) {
            setInputData(sortedByVenue)
        }
    }

    async function sortEventsByRatingLowHigh() {
        setSortedBy("rating")
        const sortedByRating = defaultEventData.sort((a, b) => {
            const nameA = a.rating;
            const nameB = b.rating;
            if (nameA < nameB) return -1
            if (nameA > nameB) return 1
            return 0
        })
        setCustomEventData(sortedByRating)
        if (input) {
            setInputData(sortedByRating)
        }
    }

    async function sortEventsByRatingHighLow() {
        setSortedBy("rating")
        const sortedByRating = defaultEventData.sort((a, b) => {
            const nameA = a.rating;
            const nameB = b.rating;
            if (nameA < nameB) return 1
            if (nameA > nameB) return -1
            return 0
        })
        setCustomEventData(sortedByRating)
        if (input) {
            setInputData(sortedByRating)
        }
    }

    //Functie die de eventData filtert op basis van de input in de zoekbalk. Resultaten worden direct getoond. Huidige pagina wordt aangepast naar 1.
    async function updateInput(input) {
        const filtered = inputData.filter((event) => {
            return event.name.toLowerCase().includes(input.toLowerCase())
                || event.venue.address.city.toLowerCase().includes(input.toLowerCase())
                || event.venue.venueName.toLowerCase().includes(input.toLowerCase())
        })
        toggleFilterEvents(false)
        setInput(input)
        setCustomEventData(filtered)
        setCurrentPage(1)
    }

    //Functie die alle events in een eventcard component mapped.
    const renderEvents = (eventData) => {
        return (<>
                {input && <InputFeedback input={input} length={customEventData.length}/>}
                <ul className={styles["event-list"]}>
                    {eventData.map((event, index) => {
                        return (
                            <li key={index}>
                                <EventCard
                                    image={event.image}
                                    name={event.name}
                                    venue={event.venue.venueName}
                                    id={event.id}
                                    date={event.date}
                                    time={event.time}
                                    description={event.eventDescription}
                                    type={event.type}
                                    rating={event.rating}
                                    ticketRequired={event.ticketRequired}
                                    venueCity={event.venue.address.city}
                                    venueId={event.venue.id}
                                />
                            </li>
                        )
                    })}
                </ul>
            </>
        )
    }
    //Variabelen die ervoor zorgen dat het juiste aantal events per pagina wordt getoond dmv de eerder ingestelde state.
    const indexOfLastItem = currentPage * eventsPerPage;
    const indexOfFirstItem = indexOfLastItem - eventsPerPage;
    const currentEvents = customEventData.slice(indexOfFirstItem, indexOfLastItem);


    return (
        <div className={styles.container}>
            <TopNavigation
                events={true}
                sortButtons={<>
                    <button onClick={() => sortEventsByDate()}> Sort by date</button>
                    {!filterEvents ?
                        <button onClick={() => setCustomEventData(customEventData.filter((evente) => {
                            return new Date(evente.date.split('-').reverse()) > new Date(date.split('-').reverse())
                        })) & setSortedBy('date') & toggleFilterEvents(true)}>
                            Show upcoming events
                        </button> :
                        <button
                            onClick={() => setCustomEventData(defaultEventData) & toggleFilterEvents(!filterEvents)}> Show
                            all events </button>}
                    <button onClick={() => sortEventsByVenue()}> Sort by venue</button>
                    <button onClick={() => sortEventsByRatingLowHigh()}> Rating(Low to High)</button>
                    <button onClick={() => sortEventsByRatingHighLow()}> Rating(High to Low)</button>
                </>
                }
                children={
                    <>
                        <SearchBar
                            query={input}
                            setQuery={updateInput}
                            placeholder="Search by city, venuename or eventname"
                        />
                        <Pagination
                            length={customEventData.length}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            itemsPerPage={eventsPerPage}
                        />
                    </>
                }
            />
            {renderEvents(currentEvents)}
            {loading && <LoadingAnimation/>}
        </div>
    )
}

export default Events;