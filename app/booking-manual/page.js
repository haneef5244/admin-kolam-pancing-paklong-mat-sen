export const revalidate = 1; // Revalidate every second

import React from 'react'
import { getAllPertandingan } from '../backend/actions/pertandingan';
import dynamic from 'next/dynamic';
const BookingManualComponent = dynamic(() => import('../frontend/components/bookingManual'), { ssr: false });


const BookingManual = async props => {
    const data = await getAllPertandingan();

    return <BookingManualComponent data={data} />
}

export default BookingManual;