// components/Dashboard.js
'use client';
import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Grid, Typography, Box, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";
import { format } from "date-fns";
import moment from "moment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

const Dashboard = () => {
    const [bookingsData, setBookingsData] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [selectedDate, setSelectedDate] = useState(moment()); // Default to today's date

    useEffect(() => {
        // Fetch data from API
        const fetchData = async () => {
            try {
                const formattedDate = moment(selectedDate).format("yyyy-MM-dd");

                const data = {
                    "bookings": [
                        { "status": "PAID", "amount": 100 },
                        { "status": "CANCELLED", "amount": 0 },
                        { "status": "PENDING_PAYMENT", "amount": 50 }
                    ]
                }

                // Calculate total amount for the selected date
                const total = data.reduce((sum, booking) => sum + booking.amount, 0);
                setTotalAmount(total);

                setBookingsData(data);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };

        fetchData();
    }, [selectedDate]); // Re-fetch data when the selected date changes

    // Prepare chart data
    const chartOptions = {
        chart: {
            type: "column",
        },
        title: {
            text: `Booking Payment Status for ${moment(selectedDate).format("dd MMM yyyy")}`,
        },
        xAxis: {
            categories: ["PAID", "CANCELLED", "PENDING_PAYMENT"],
        },
        yAxis: {
            min: 0,
            title: {
                text: "Number of Bookings",
            },
        },
        series: [
            {
                name: "Bookings",
                data: [
                    100,
                    bookingsData.filter((b) => b.status === "CANCELLED").length,
                    bookingsData.filter((b) => b.status === "PENDING_PAYMENT").length,
                ],
            },
        ],
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Booking Dashboard
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterMoment}>

                        <DatePicker
                            label="Pilih Tarikh Pertandingan"
                            value={selectedDate}
                            onChange={(newDate) => setSelectedDate(newDate)}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                    </LocalizationProvider>

                </Grid>

                <Grid item xs={12} sm={6}>
                    <Typography variant="h6">Total Amount: RM {totalAmount}</Typography>
                </Grid>

                <Grid item xs={12}>
                    <HighchartsReact highcharts={Highcharts} options={chartOptions} />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
