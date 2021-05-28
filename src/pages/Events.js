import React, {useState, useContext, useEffect} from 'react';
import axios from "axios";
import styles from './Events.module.css';
import EventCard from "../components/EventCard";
import NoImage from "../assets/no-image-found-360x250.png"
import VenueCard from "../components/VenueCard";
import SearchBar from "../components/SearchBar";



function Events() {
    const [eventData, setEventData] = useState([]);
    const [customEventData, setCustomEventData] = useState([]);
    const [defaultEventData, setDefaultEventData] = useState([]);
    const [input, setInput]= useState("");
    const [eventsPerPage]= useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageNumberLimit] = useState(5);
    const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(5);
    const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);
    const [filterEvents, toggleFilterEvents] = useState(false);
    const today= new Date();
    const date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();

    async function getEvents() {
        try{
            const getEvents = await axios.get('http://localhost:8080/events')
            setEventData(getEvents.data)
            setDefaultEventData(getEvents.data)
            if(customEventData.length === 0){setCustomEventData(getEvents.data)}

        }
        catch(e){
            console.error(e)
        }
    }

    useEffect(()=> {
        if(!input && filterEvents){
        renderEvents(currentEvents)}
        else if(!input){getEvents()}
    }, [customEventData])

    //Functie die alle events sorteert op datum en vervolgens het resultaat in customeventdata zet
    async function sortEventsByDate(){
        if(!input){
        const sortedByDate = defaultEventData.sort((a,b) => { return(
            new Date(a.date.split('-').reverse()) - new Date(b.date.split('-').reverse()))})
        setCustomEventData(sortedByDate)
        }else {
            const sortedByDate = customEventData.sort((a,b) => { return(
                new Date(a.date.split('-').reverse()) - new Date(b.date.split('-').reverse()))})
            setCustomEventData(sortedByDate)
        }

    }
    //Functie die alle venues sorteert op venue en vervolgens het resultaat in customeventdata zet
    async function sortEventsByVenue(){
        if(!input){
        const sortedByVenue = defaultEventData.sort((a,b)=>{
            const  cityA = a.venue.venueName.toUpperCase();
            const cityB = b.venue.venueName.toUpperCase();
            if (cityA < cityB) return -1
            if (cityA > cityB) return 1
            return 0
        })
        setCustomEventData(sortedByVenue)}
        else{
            const sortedByVenue = customEventData.sort((a,b)=>{
                const  cityA = a.venue.venueName.toUpperCase();
                const cityB = b.venue.venueName.toUpperCase();
                if (cityA < cityB) return -1
                if (cityA > cityB) return 1
                return 0
            })
            setCustomEventData(sortedByVenue)
        }
    }
    //Functie die de eventData filtert op basis van de input in de zoekbalk. Resultaten worden direct getoond. Huidige pagina wordt aangepast naar 1.
    async function updateInput(input){
        const filtered = defaultEventData.filter((event)=>{
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
                />
            </li>
            )})}
        </ul>
    )}
    //Variabele en loop voor het bepalen van het aantal benodigde pagina's.
    const pages = [];
    for (let i = 1; i <= Math.ceil(customEventData.length / eventsPerPage); i++) {
        pages.push(i);
    }
    //Variabelen die ervoor zorgen dat het juiste aantal events per pagina wordt getoond dmv de eerder ingestelde state.
    const indexOfLastItem = currentPage*eventsPerPage;
    const indexOfFirstItem = indexOfLastItem - eventsPerPage;
    const currentEvents = customEventData.slice(indexOfFirstItem, indexOfLastItem);
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
            <section className={styles["event-navigation"]}>
                <div className={styles["event-navigation-buttons"]}>
                <button onClick={()=>sortEventsByDate()}> Sort by date</button>
                {!filterEvents ?
                    <button onClick={()=> setCustomEventData(customEventData.filter((evente)=>{
                        return  new Date(evente.date.split('-').reverse()) > new Date(date.split('-').reverse())
                    })) & toggleFilterEvents(!filterEvents)}> Show upcoming events </button> :
                    <button onClick={()=> setCustomEventData(defaultEventData) & toggleFilterEvents(!filterEvents)}> Show all events </button>}

                <button onClick={()=>sortEventsByVenue()}> Sort by venue</button>
                </div>
                <div className={styles["event-navigation-searchbar"]}>
                <SearchBar
                    query={input}
                    setQuery={updateInput}
                    placeholder="Search by city, venuename or eventname"
                />
                </div>
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
            {renderEvents(currentEvents)}

        </div>
    )
}
export default Events;