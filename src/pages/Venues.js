import React, {useState, useEffect} from 'react';
import axios from "axios";
import styles from './Venues.module.css';
import VenueCard from "../components/VenueCard";
import SearchBar from "../components/SearchBar";

function Venues() {
    const [venueData, setVenueData] = useState([]);
    const [customVenueData, setCustomVenueData] = useState([]);
    const [defaultVenueData, setDefaultVenueData] = useState([]);
    const [input, setInput] = useState("");
    const [venuesPerPage, setVenuesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageNumberLimit, setpageNumberLimit] = useState(5);
    const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5);
    const [minPageNumberLimit, setminPageNumberLimit] = useState(0);

    async function getVenues() {
        try{
            const getVenues = await axios.get('http://localhost:8080/venues')
            setVenueData(getVenues.data)
            setDefaultVenueData(getVenues.data)
            if(customVenueData.length === 0){setCustomVenueData(getVenues.data)}
        }
        catch(e){
            console.error(e)
        }
    }
    useEffect(()=> {
        if(!input){getVenues()
        renderVenues(currentVenues)}
    }, [customVenueData])

    //Functie die alle venues sorteert op naam en vervolgens het resultaat in customvenuedata zet
    async function sortVenuesByName(){
        const sortedByName = defaultVenueData.sort((a,b)=>{
            const  nameA = a.venueName.toUpperCase();
            const nameB = b.venueName.toUpperCase();
            if (nameA < nameB) return -1
            if (nameA > nameB) return 1
            return 0
        })
        setCustomVenueData(sortedByName)
    }
    //Functie die alle venues sorteert op stad en vervolgens het resultaat in customvenuedata zet
    async function sortVenuesByCity(){
        const sortedByCity = defaultVenueData.sort((a,b)=>{
            const  cityA = a.address.city.toUpperCase();
            const cityB = b.address.city.toUpperCase();
            if (cityA < cityB) return -1
            if (cityA > cityB) return 1
            return 0
        })
        setCustomVenueData(sortedByCity)
    }
    //Functie die de venueData filtert op basis van de input in de zoekbalk. Resultaten worden direct getoond. Huidige pagina wordt aangepast naar 1.
    async function updateInput(input){
        const filtered = defaultVenueData.filter((venue)=>{
            return venue.venueName.toLowerCase().includes(input.toLowerCase()) || venue.address.city.toLowerCase().includes(input.toLowerCase())
        })
        setInput(input)
        setCustomVenueData(filtered)
        setCurrentPage(1)
    }
    //Functie die alle venues in een venuecard component mapped.
    const renderVenues = (venueData)=> { return(
        <ul className={styles["venue-list"]}>
            {venueData.map((venue, index)=> { return(
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
                    />
                </li>
            )})}
        </ul>
    )}
    //Variabele en loop voor het bepalen van het aantal benodigde pagina's.
    const pages = [];
    for (let i = 1; i <= Math.ceil(customVenueData.length / venuesPerPage); i++) {
        pages.push(i);
    }
    //Variabelen die ervoor zorgen dat het juiste aantal venues per pagina wordt getoond dmv de eerder ingestelde state.
    const indexOfLastItem = currentPage*venuesPerPage;
    const indexOfFirstItem = indexOfLastItem - venuesPerPage;
    const currentVenues = customVenueData.slice(indexOfFirstItem, indexOfLastItem);
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
                    className={currentPage === number ? `${styles.active}` : null}
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
                <button onClick={()=>sortVenuesByCity()}> Sort by city</button>
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
            {renderVenues(currentVenues)}

        </div>
    )
}

export default Venues