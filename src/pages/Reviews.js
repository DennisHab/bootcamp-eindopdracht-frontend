import React, {useEffect, useState} from 'react';
import axios from "axios";
import ReviewCard from "../components/Cards/ReviewCard/ReviewCard";
import SearchBar from "../components/Navigation/SearchBar/SearchBar";
import styles from "./CSS/Reviews.module.css";
import TopNavigation from "../components/Navigation/TopNavigation/TopNavigation";
import InputFeedback from "../components/misc/InputFeedback";
import LoadingAnimation from "../components/LoadingAnimation/LoadingAnimation";
import Pagination from "../components/Navigation/Pagination/Pagination";

function Reviews() {
    const [defaultReviewData, setDefaultReviewData] = useState([]);
    const [customReviewData, setCustomReviewData] = useState([]);
    const [input, setInput] = useState("");
    const [inputData, setInputData] = useState([]);
    const [filteredBy, setFiltered] = useState("");
    const [reviewsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, toggleLoading] = useState(false);

    async function getReviews() {
        toggleLoading(true)
        try {
            const getReviews = await axios.get('http://localhost:8080/reviews')
            setDefaultReviewData(getReviews.data)
            setInputData(getReviews.data)
            if (getReviews.data.length > 0 && customReviewData.length === 0 && !input && filteredBy === "") setCustomReviewData(getReviews.data)
            toggleLoading(false)
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        getReviews()
        if (filteredBy !== "" && input) {
            updateInput(input)
        }
        renderReviews(customReviewData)
        setFiltered("");
    }, [customReviewData])

    //Functie die alle reviews sorteert op datum en vervolgens het resultaat in customeventdata zet
    async function sortReviewsByDate() {
        setFiltered("date")
        const sortedByDate = defaultReviewData.sort((a, b) => {
            return (
                new Date(a.date.split('-').reverse()) - new Date(b.date.split('-').reverse()))
        })
        setCustomReviewData(sortedByDate)
        if (input) {
            setInputData(sortedByDate)
        }
    }

    //Functie die alle reviews filtert op alleen event reviews en vervolgens het resultaat in customreviewdata zet
    async function showOnlyEventReviews() {
        setFiltered("event")
        const filteredByEvents = defaultReviewData.filter((review) => {
            return review.event !== null;
        })
        setCustomReviewData(filteredByEvents)
        if (input) {
            setInputData(filteredByEvents)
        }
    }

    //Functie die alle reviews filtert op alleen venue reviews en vervolgens het resultaat in customreviewdata zet
    async function showOnlyVenueReviews() {
        setFiltered("venue")
        const filteredByVenues = defaultReviewData.filter((review) => {
            return review.venue !== null;
        })
        setCustomReviewData(filteredByVenues)
        if (input) {
            setInputData(filteredByVenues)
        }
    }

    //Functie die de reviewData filtert op basis van de input in de zoekbalk. Resultaten worden direct getoond. Huidige pagina wordt aangepast naar 1.
    async function updateInput(input) {
        const filtered = inputData.filter((review) => {
            if (review.event !== null) {
                return (review.event.name.toLowerCase().includes(input.toLowerCase()) ||
                    review.userNormal.username.toLowerCase().includes(input.toLowerCase()))
            } else if (review.venue !== null) {
                return (review.venue.venueName.toLowerCase().includes(input.toLowerCase()) ||
                    review.userNormal.username.toLowerCase().includes(input.toLowerCase()))
            }
        })
        setInput(input)
        setCustomReviewData(filtered)
        setCurrentPage(1)
    }

    //Functie die alle reviews in een reviewcard component mapped.
    const renderReviews = (reviewData) => {
        return (<>
                {input && <InputFeedback input={input} length={customReviewData.length}/>}
                <ul className={styles["review-list"]}>
                    {reviewData.map((review, index) => {
                        return (
                            <li key={index}>
                                <ReviewCard
                                    user={review.userNormal.username}
                                    content={review.reviewContent}
                                    rating={review.rating}
                                    date={review.date}
                                    venueEvent={review.event ? "Event: " + review.event.name : "Venue: " + review.venue.venueName}
                                />
                            </li>
                        )
                    })}
                </ul>
            </>
        )
    }

    //Variabelen die ervoor zorgen dat het juiste aantal events per pagina wordt getoond dmv de eerder ingestelde state.
    const indexOfLastItem = currentPage * reviewsPerPage;
    const indexOfFirstItem = indexOfLastItem - reviewsPerPage;
    const currentReviews = customReviewData.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className={styles.container}>
            <TopNavigation
                reviews={true}
                sortButtons={
                    <button onClick={() => sortReviewsByDate()}> Sort by date</button>
                }
                filterButtons={
                    <>
                        <button onClick={() => showOnlyEventReviews()}> Filter Event reviews</button>
                        <button onClick={() => showOnlyVenueReviews()}> Filter Venue reviews</button>
                        <button onClick={() => setCustomReviewData(defaultReviewData)}> Reset filters</button>
                    </>
                }
                children={<>
                    <SearchBar
                        query={input}
                        setQuery={updateInput}
                        placeholder="Search by venue, event or user"
                    />
                    <Pagination
                        length={customReviewData.length}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        itemsPerPage={reviewsPerPage}
                    />
                </>
                }
            />
            {renderReviews(currentReviews)}
            {loading && <LoadingAnimation/>}
        </div>
    )
}

export default Reviews;