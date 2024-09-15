import { BOOKING_AVAILABILITY, BOOKING_CALCULATE_PRICE, BOOKING_DEPOSIT, BOOKING_RECEIPT, BOOKING_SCAN, GET_ALL_BOOKINGS } from "../constants/api/booking"

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

export const updateReceiptForBooking = async (formData) => {
    return await fetch(BOOKING_RECEIPT, {
        method: 'POST',
        body: formData
    })
}

export const getReceiptForBooking = async (fileName) => {
    return await fetch(`${BOOKING_RECEIPT}?fileName=${fileName}`, {
        method: 'GET',
    })
}

export const deleteReceiptForBooking = async (body) => {
    return await fetch(`${BOOKING_RECEIPT}`, {
        method: 'PATCH',
        body: JSON.stringify(body)
    })
}

export const updateDepositForBooking = async (body) => {
    return await fetch(`${BOOKING_DEPOSIT}`, {
        method: 'PATCH',
        body: JSON.stringify(body)
    })
}

export const calculateBookingPrice = async body => {
    return await fetch(BOOKING_CALCULATE_PRICE, {
        method: 'POST',
        body: JSON.stringify(body),
    })
}