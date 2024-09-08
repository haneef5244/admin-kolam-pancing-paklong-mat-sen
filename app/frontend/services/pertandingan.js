import { BOOKING_AVAILABILITY, GET_ALL_BOOKINGS } from "../constants/api/booking"
import { GET_ALL_PERTANDINGAN, PERTANDINGAN_POSTER } from "../constants/api/pertandingan"

export const getAllPertandingan = async (body) => {
    return await fetch(GET_ALL_PERTANDINGAN)
}

export const updateJenisPertandingan = async body => {
    return await fetch(GET_ALL_PERTANDINGAN, {
        method: 'PATCH',
        body: JSON.stringify(body),
    })
}

export const updatePoster = async formData => {
    return await fetch(PERTANDINGAN_POSTER, {
        method: 'PATCH',
        body: formData
    })
}
export const getAllBookings = async (body) => {
    return await fetch(GET_ALL_BOOKINGS, {
        method: 'POST',
        body: JSON.stringify(body),
    })
}

export const updateBookingAvailability = async (body) => {
    return await fetch(BOOKING_AVAILABILITY, {
        method: 'POST',
        body: JSON.stringify(body),
    });
}

export const getBookingAvailability = async () => {
    return await fetch(BOOKING_AVAILABILITY);
}