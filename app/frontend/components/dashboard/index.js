'use client';
import { getAllBookingsByPertandinganDate } from '@/app/backend/actions/booking';
import { Box, Grid, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { BarChart } from '../charts/barchart';
import Highcharts, { dateFormat } from "highcharts";
import PieChart from '../charts/donut';
import { getAvailableAndUnavailablePancang } from '@/app/backend/actions/pancang';

export const Dashboard = ({ pertandingans }) => {

    const [selectedDate, setSelectedDate] = useState(pertandingans?.length ? moment(pertandingans?.[0]?.tarikh) : null);
    const paymentStatuses = ['PAID', 'PENDING_PAYMENT'];
    const [bookingData, setBookingData] = useState([]);
    const [pancangChartData, setPancangChartData] = useState([]);
    const [totalPancang, setTotalPancang] = useState(0);

    const disableDates = useMemo(() => {
        return (date) => pertandingans?.filter(pertandingan => moment(pertandingan.tarikh).startOf('day').isSame(moment(date).startOf('day'))).length == 0;
    }, [pertandingans])

    const getPertandingans = async () => {
        if (selectedDate) {
            const data = JSON.parse(await getAllBookingsByPertandinganDate(selectedDate));
            setBookingData(data);
        }

    }

    const getPancangData = async () => {
        if (selectedDate) {
            const data = JSON.parse(await getAvailableAndUnavailablePancang(selectedDate));
            let pieData = [];
            pieData.push({ name: 'Jumlah Pancang Terbuka', y: data?.available })
            pieData.push({ name: 'Jumlah Pancang Ditempah', y: data?.unavailable })
            setPancangChartData(pieData)
            setTotalPancang(Number(data?.available) + Number(data?.unavailable))
        }
    }

    useEffect(() => {
        getPertandingans();
        getPancangData();
    }, [selectedDate]);

    if (!selectedDate) return <Box padding={3} textAlign={'center'}>
        <Typography variant='h5'>
            Tiada data pertandingan untuk ditunjuk.
        </Typography>
    </Box>

    const getSeriesData = useMemo(() => {
        let data = []
        for (let ps of paymentStatuses) {
            let amount = 0;
            bookingData?.forEach(e => {
                if (e?.payment_status == ps) {
                    amount += Number(e?.amount)
                }
            })
            data.push(amount);
        }
        return data;
    }, [bookingData])

    // Transform data into Highcharts series format
    const transformLineSeriesData = useMemo(() => {
        const seriesData = {};
        let tempDates = [...new Set(bookingData.map(d => moment(d.created_on).startOf('day').format('YYYY-MM-DD')))]; // Extract unique dates

        const dateObj = {}
        const dates = tempDates.map((e, i) => {
            dateObj[moment(e).format('YYYY-MM-DD')] = i
            return moment(e)
        })

        bookingData.forEach(d => {

            if (!seriesData[d.payment_status]) {
                seriesData[d.payment_status] = Array(dates.length).fill(0);
            }
            const dateIndex = dateObj[moment(d.created_on).startOf('day').format('YYYY-MM-DD')];
            seriesData[d.payment_status][dateIndex] = Number(seriesData[d.payment_status][dateIndex]) + Number(d.amount);
        });

        return {
            categories: dates,
            series: Object.keys(seriesData).map(status => ({
                name: status,
                data: seriesData[status]
            }))
        };
    }, [bookingData])

    const transformPancangSeriesData = useMemo(() => {
        const paidBookings = bookingData.filter(d => ['PAID', 'PENDING_PAYMENT'].includes(d?.payment_status));
        const seriesData = {};
        let tempDates = [...new Set(paidBookings.map(d => moment(d.created_on).startOf('day').format('YYYY-MM-DD')))]; // Extract unique dates

        const dateObj = {}
        const dates = tempDates.map((e, i) => {
            dateObj[moment(e).format('YYYY-MM-DD')] = i
            return moment(e)
        })

        paidBookings.forEach(d => {

            if (!seriesData['Jumlah Pancang']) {
                seriesData['Jumlah Pancang'] = Array(dates.length).fill(0);
            }
            const dateIndex = dateObj[moment(d.created_on).startOf('day').format('YYYY-MM-DD')];
            seriesData['Jumlah Pancang'][dateIndex] = Number(seriesData['Jumlah Pancang'][dateIndex]) + Number(d.kolam_booking_kolams?.length);
        });

        return {
            categories: dates,
            series: Object.keys(seriesData).map(status => ({
                name: status,
                data: seriesData[status]
            }))
        };
    }, [bookingData])


    return (
        <Box sx={{ padding: 3 }}>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterMoment}>

                        <DatePicker
                            disableHighlightToday
                            label="Pilih Tarikh Pertandingan"
                            value={selectedDate}
                            shouldDisableDate={disableDates}
                            onChange={(newDate) => setSelectedDate(newDate)}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12} pb={2}>
                    {pancangChartData?.length ? <PieChart title={`Jumlah Keseluruhan Pancang : ${totalPancang}`} subtitle={`Data setakat ${moment().format('DD/MM/YYYY HH:mm:SS')}`} data={pancangChartData} /> : <></>}
                </Grid>
                <Grid item xs={12} pb={2}>
                    <BarChart
                        chart={{
                            type: "column",
                        }}
                        xAxis={{
                            categories: paymentStatuses,
                        }}
                        yAxis={{
                            min: 0,
                            title: {
                                text: "Jumlah Pendapatan Booking (RM)",
                            },
                        }}
                        title={{
                            text: `Amaun Pendapatan untuk Tarikh Pertandingan ${moment(selectedDate).format("DD MMM yyyy")} Setakat Ini`
                        }}
                        series={[
                            {
                                name: "Amaun Booking (RM)",
                                data: getSeriesData,
                            },
                        ]}
                        credits={{
                            enabled: false
                        }}
                    />
                </Grid>
                <Grid item xs={12} pb={2}>
                    <BarChart
                        title={{
                            text: 'Jumlah Amaun (RM) Harian Mengikut Status'
                        }}
                        xAxis={{
                            categories: transformLineSeriesData.categories,
                            title: {
                                text: 'Tarikh'
                            },
                            type: 'datetime', // Use 'datetime' type for date-based axes
                            labels: {
                                formatter: function () {
                                    // Format the date to 'YYYY-MM-DD'
                                    return Highcharts.dateFormat('%Y-%m-%d', this.value);
                                }
                            },
                        }}
                        yAxis={{
                            title: {
                                text: 'Jumlah Amaun (RM)'
                            }
                        }}
                        chart={{
                            type: 'line'
                        }}
                        series={transformLineSeriesData.series}
                        legend={{
                            layout: 'vertical',
                            align: 'right',
                            verticalAlign: 'middle'
                        }}
                        tooltip={{
                            formatter: function () {
                                // Add series color dot and format the tooltip
                                return `<b>${Highcharts.dateFormat('%Y-%m-%d', this.x)}</b><br/>` +
                                    `<span style="color:${this.series.color}">\u25CF</span> ${this.series.name}: ${this.y}`;
                            }
                        }}
                        credits={{
                            enabled: false
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <BarChart
                        title={{
                            text: 'Jumlah Pancang Ditempah (Status PAID atau PENDING PAYMENT)'
                        }}
                        xAxis={{
                            categories: transformPancangSeriesData.categories,
                            title: {
                                text: 'Tarikh'
                            },
                            type: 'datetime', // Use 'datetime' type for date-based axes
                            labels: {
                                formatter: function () {
                                    // Format the date to 'YYYY-MM-DD'
                                    return Highcharts.dateFormat('%Y-%m-%d', this.value);
                                }
                            },
                        }}
                        yAxis={{
                            title: {
                                text: 'Jumlah Pancang'
                            }
                        }}
                        chart={{
                            type: 'line'
                        }}
                        series={transformPancangSeriesData.series}
                        legend={{
                            layout: 'vertical',
                            align: 'right',
                            verticalAlign: 'middle'
                        }}

                        tooltip={{
                            formatter: function () {
                                // Add series color dot and format the tooltip
                                return `<b>${Highcharts.dateFormat('%Y-%m-%d', this.x)}</b><br/>` +
                                    `<span style="color:${this.series.color}">\u25CF</span> ${this.series.name}: ${this.y}`;
                            }
                        }}
                        credits={{
                            enabled: false
                        }}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}