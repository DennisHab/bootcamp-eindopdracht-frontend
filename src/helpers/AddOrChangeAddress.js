import axios from "axios";
const Token = localStorage.getItem('jwt');
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${Token}`
}
export default async function AddorChangeAddress(data, addressChange, username, addressId) {
    try {
        if (!addressChange) {
            const addAddress = await axios.post(`http://localhost:8080/user/${username}/addresses`, {
                streetName: data.streetName,
                houseNumber: data.houseNumber,
                postalCode: data.postalCode,
                city: data.city,
                country: data.country
            }, {
                headers: headers
            })
        }
        if (addressChange) {
            const changeAddress = await axios.put(`http://localhost:8080/user/${username}/addresses/${addressId}`, {
                streetName: data.streetName,
                houseNumber: data.houseNumber,
                postalCode: data.postalCode,
                city: data.city,
                country: data.country
            }, {
                headers: headers
            })
        }
        window.location.reload(false);
    } catch (e) {
        console.error(e);
    }
}