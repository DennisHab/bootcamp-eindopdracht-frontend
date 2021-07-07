import axios from "axios";
import React, {useState, useEffect} from 'react';
import styles from '../CSS/Events.module.css';
import EventCard from "../../components/Cards/EventCard/EventCard";
import SearchBar from "../../components/Navigation/SearchBar/SearchBar";
import LoadingAnimation from "../../components/LoadingAnimation/LoadingAnimation";
import TopNavigation from "../../components/Navigation/TopNavigation/TopNavigation";

function EventsPrototype() {
    const [customEventData, setCustomEventData] = useState([]);
    const [defaultEventData, setDefaultEventData] = useState([]);
    const [input, setInput]= useState("");
    const [inputData, setInputData] = useState([]);
    const [sortedBy, setSortedBy] = useState("");

    const [eventsPerPage]= useState(2);
    const [totalEvents, setTotalEvents] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageNumberLimit] = useState(5);
    const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(5);
    const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);
    const [loading, toggleLoading] = useState(false);
    const [filterEvents, toggleFilterEvents] = useState(false);
    const today= new Date();
    const date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();

    const [sortedByName, toggleSortedByName] = useState(false);
    const [sortedByCity, toggleSortedByCity] = useState(false);
    const [sortedByDate, toggleSortedByDate] = useState(false);

    async function getEvents() {
        toggleLoading(true);
        try{
            const getEventsPaged = await axios.get(`http://localhost:8080/paged/events?page=${currentPage-1}
            &size=${eventsPerPage}&SortByName=${sortedByName}&SortByCity=${sortedByCity}&SortByDate=${sortedByDate}`)
            setTotalEvents(getEventsPaged.data.totalElements)
            setCustomEventData(getEventsPaged.data.content)
            toggleLoading(false);
        }
        catch(e){
            console.error(e)
        }
    }

    useEffect(()=> {
        getEvents()
        renderEvents(customEventData)
        if(sortedByName) toggleSortedByDate(false) && toggleSortedByCity(false);
        if(sortedByCity) toggleSortedByName(false) && toggleSortedByDate(false);
        if(sortedByDate) toggleSortedByName(false) && toggleSortedByCity(false);

    }, [currentPage, sortedByName, sortedByCity, sortedByDate])


    //Functie die de eventData filtert op basis van de input in de zoekbalk. Resultaten worden direct getoond. Huidige pagina wordt aangepast naar 1.
    async function updateInput(input){
        const filtered = inputData.filter((event)=>{
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
    const renderEvents = (eventData)=> { return(
        <ul className={styles["event-list"]}>
            {eventData.map((event, index)=> { return(
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
            )})}
        </ul>
    )}
    //Variabele en loop voor het bepalen van het aantal benodigde pagina's.
    const pages = [];
    for (let i = 1; i <= Math.ceil(totalEvents / eventsPerPage); i++) {
        pages.push(i);
    }
    //Variabelen die ervoor zorgen dat het juiste aantal events per pagina wordt getoond dmv de eerder ingestelde state.
    const indexOfLastItem = currentPage * eventsPerPage;
    const indexOfFirstItem = indexOfLastItem - eventsPerPage;
    const currentEvents = customEventData;
    //Functie die een click op een van de pagina list items verwerkt en de juiste pagina laat zien.
    const handleClick = (event) => {
        setCurrentPage(Number(event.target.id));
    };
    //Functie die het benodigde aantal list items mapped in de paginabalk.
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
    //Functies voor het veranderen van pagina met de next en prev button.
    const handleNextbtn = () => {
        setCurrentPage(currentPage + 1);

        if (currentPage + 1 > maxPageNumberLimit) {
            setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
            setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit);
        }
    };
    const handlePrevbtn = () => {
        setCurrentPage(currentPage - 1);

        if ((currentPage - 1) % pageNumberLimit == 0) {
            setMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
            setMinPageNumberLimit(minPageNumberLimit - pageNumberLimit);
        }
    };

    return (
        <div className={styles.container}>
            <TopNavigation
                events={true}
                sortButtons={<>
                    <button onClick={()=>toggleSortedByDate(true)}> Sort by date</button>
                    {!filterEvents ?
                        <button onClick={()=> setCustomEventData(customEventData.filter((evente)=>{
                            return  new Date(evente.date.split('-').reverse()) > new Date(date.split('-').reverse())
                        })) & setSortedBy('date') & toggleFilterEvents(true)}>
                            Show upcoming events
                        </button>:
                        <button onClick={()=> setCustomEventData(defaultEventData) & toggleFilterEvents(!filterEvents)}> Show all events </button>}
                    <button onClick={()=>toggleSortedByName(true) & setCurrentPage(1)}> Sort by event name</button>
                    <button onClick={()=>toggleSortedByCity(true) & setCurrentPage(1)}> Sort by city</button>
                    {/*<button onClick={()=>sortEventsByRatingLowHigh()}> Rating(Low to High)</button>
                    <button onClick={()=>sortEventsByRatingHighLow()}> Rating(High to Low)</button>*/}
                </>
                }
                children={
                    <>
                        <SearchBar
                            query={input}
                            setQuery={updateInput}
                            placeholder="Search by city, venuename or eventname"
                        />
                        <ul className={styles["pageNumbers"]}>
                            <li id={styles["button-prev"]}>
                                <button
                                    onClick={handlePrevbtn}
                                    disabled={currentPage === pages[0] ? true : false}
                                >
                                    Prev
                                </button>
                            </li>
                            {renderPageNumbers}
                            <li id={styles["button-next"]}>
                                <button
                                    onClick={handleNextbtn}
                                    disabled={currentPage === pages[pages.length - 1] ? true : false}
                                >
                                    Next
                                </button>
                            </li>
                        </ul>
                    </>
                }
            />
            {renderEvents(currentEvents)}
            {loading && <LoadingAnimation/>}
        </div>
    )
}
export default EventsPrototype;