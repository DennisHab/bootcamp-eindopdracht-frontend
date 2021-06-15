import React, {useState, useEffect} from "react";
import styles from "../pages/Events.module.css";

async function Pagination({data, currentPage, setCurrentPage }) {
    const [eventsPerPage]= useState(5);
    /*const [currentPage, setCurrentPage] = useState(1);*/
    const [pageNumberLimit] = useState(5);

    const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(5);
    const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);
    const pages = [];

   /* useEffect(()=>{
       renderPageNumbers()
    }, [])*/

    //Functie die een click op een van de pagina list items verwerkt en de juiste pagina laat zien.
    const handleClick = (event) => {
        setCurrentPage(Number(event.target.id));
    };
    //Functie die het benodigde aantal list items mapped in de paginabalk.
    async function renderPageNumbers(){
        //Variabele en loop voor het bepalen van het aantal benodigde pagina's.

        for (let i = 1; i <= Math.ceil({data}.length / eventsPerPage); i++) {
            pages.push(i);
            console.log(pages)
        }
        pages.map((number) => {
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
        })

    }
    /*const renderPageNumbers = pages.map((number) => {
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
*/
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

    )
}

export default Pagination;