import { BOOKING_AVAILABILITY, BOOKING_SCAN, GET_ALL_BOOKINGS } from "../constants/api/booking"

export const verifyBookingQr = async (body) => {
    return await fetch(BOOKING_SCAN, {
        body: JSON.stringify(body),
        method: 'POST'
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