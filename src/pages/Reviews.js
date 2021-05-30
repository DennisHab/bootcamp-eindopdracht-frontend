import React, {useState, useEffect} from 'react';
import axios from "axios";
import ReviewCard from "../components/ReviewCard";
import SearchBar from "../components/SearchBar";
import styles from "./Reviews.module.css";

function Reviews() {
    const [customReviewData, setCustomReviewData] = useState([]);
    const [defaultReviewData, setDefaultReviewData] = useState([]);
    const [input, setInput] = useState("");
    const [reviewsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageNumberLimit] = useState(5);
    const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(5);
    const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);

    async function getReviews() {
        try{
            const getReviews = await axios.get('http://localhost:8080/reviews')
            setDefaultReviewData(getReviews.data)
            if(customReviewData.length === 0){setCustomReviewData(getReviews.data)}
        }
        catch(e){
            console.error(e)
        }
    }
    useEffect(()=> {
        getReviews()
        renderReviews(currentReviews)
    }, [customReviewData])

    //Functie die alle reviews sorteert op datum en vervolgens het resultaat in customeventdata zet
    async function sortReviewsByDate(){
        const sortedByDate = defaultReviewData.sort((a,b) => { return(
            new Date(a.date.split('-').reverse()) - new Date(b.date.split('-').reverse()))})
        setCustomReviewData(sortedByDate)
    }
    //Functie die alle reviews filtert op alleen event reviews en vervolgens het resultaat in customreviewdata zet
    async function showOnlyEventReviews(){
        const filteredByEvents = defaultReviewData.filter((review)=>{
            return review.event !== null;
        })
        setCustomReviewData(filteredByEvents)
    }
    //Functie die alle reviews filtert op alleen venue reviews en vervolgens het resultaat in customreviewdata zet
    async function showOnlyVenueReviews(){
        const filteredByVenues = defaultReviewData.filter((review)=>{
            return review.venue !== null;
        })
        setCustomReviewData(filteredByVenues)
    }
    //Functie die de reviewData filtert op basis van de input in de zoekbalk. Resultaten worden direct getoond. Huidige pagina wordt aangepast naar 1.
    async function updateInput(input){
        const filtered = defaultReviewData.filter((review)=>{
            if(review.event !== null){
                return(review.event.name.toLowerCase().includes(input.toLowerCase()) ||
                review.userNormal.username.toLowerCase().includes(input.toLowerCase()))
            } else if(review.venue !== null){
                return(review.venue.venueName.toLowerCase().includes(input.toLowerCase()) ||
                        review.userNormal.username.toLowerCase().includes(input.toLowerCase()))
            }
            })
        setInput(input)
        setCustomReviewData(filtered)
        setCurrentPage(1)
        }

    //Functie die alle reviews in een reviewcard component mapped.
    const renderReviews = (reviewData)=> { return(
        <ul className={styles["review-list"]}>
            {reviewData.map((review, index)=> { return(
                <li key={index}>
                    <ReviewCard
                        user = {review.userNormal.username}
                        content = {review.reviewContent}
                        rating = {review.rating}
                        date = {review.date}
                        venueEvent={review.event ? "Event: " + review.event.name  : "Venue: " + review.venue.venueName}
                    />
                </li>
            )})}
        </ul>
    )}
    //Variabele en loop voor het bepalen van het aantal benodigde pagina's.
    const pages = [];
    for (let i = 1; i <= Math.ceil(customReviewData.length / reviewsPerPage); i++) {
        pages.push(i);
    }
    //Variabelen die ervoor zorgen dat het juiste aantal events per pagina wordt getoond dmv de eerder ingestelde state.
    const indexOfLastItem = currentPage*reviewsPerPage;
    const indexOfFirstItem = indexOfLastItem - reviewsPerPage;
    const currentReviews = customReviewData.slice(indexOfFirstItem, indexOfLastItem);
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
            <section className={styles["review-navigation"]}>
                <button onClick={()=>sortReviewsByDate()}> Sort by date</button>
                <SearchBar
                    query={input}
                    setQuery={updateInput}
                    placeholder="Search by venue, event or user"
                />
                <button onClick={()=>showOnlyEventReviews()}> Filter Event reviews</button>
                <button onClick={()=>showOnlyVenueReviews()}> Filter Venue reviews</button>
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
            {renderReviews(currentReviews)}
        </div>
    )
}

export default Reviews;