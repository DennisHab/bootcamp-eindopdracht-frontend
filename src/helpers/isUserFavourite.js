export default function isUserFavourite(favouredEvents, id) {
    let userFavourite = false
    favouredEvents.map((evente) => {
            if (evente.id === id) {
                userFavourite = true
            }
        }
    )
    return userFavourite
}