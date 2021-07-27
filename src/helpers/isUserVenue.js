export default function isUserVenue(venueList, venueId) {
    let userVenue = false
    venueList.map((UserVenue) => {
            if (UserVenue.id === venueId) {
                userVenue = true
            }
        }
    )
    return userVenue
}