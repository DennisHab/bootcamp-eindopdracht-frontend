import styles from './Pagination.module.css'
import React, {useState} from 'react'
import ButtonSmall from "../../Buttons/ButtonSmall/ButtonSmall";

function Pagination({length, itemsPerPage, currentPage, setCurrentPage}) {
    const [pageNumberLimit] = useState(5);
    const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5);
    const [minPageNumberLimit, setminPageNumberLimit] = useState(0);
    //Variabele en loop voor het bepalen van het aantal benodigde pagina's.
    const pages = [];
    for (let i = 1; i <= Math.ceil(length / itemsPerPage); i++) {
        pages.push(i);
    }
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

        if ((currentPage - 1) % pageNumberLimit === 0) {
            setmaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
            setminPageNumberLimit(minPageNumberLimit - pageNumberLimit);
        }
    };
    return (
        <ul className={styles["pageNumbers"]}>
            <li id={styles["button-prev"]}>
                <ButtonSmall
                    onClick={handlePrevbtn}
                    disabled={currentPage === pages[0] ? true : false}
                    title="Prev"
                />
            </li>
            {renderPageNumbers}
            <li id={styles["button-next"]}>
                <ButtonSmall
                    onClick={handleNextbtn}
                    disabled={currentPage === pages[pages.length - 1] ? true : false}
                    title="Next"
                />
            </li>
        </ul>
    )
}

export default Pagination