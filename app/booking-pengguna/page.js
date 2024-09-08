'use client';
import { Box, Button, Card, CardContent, Chip, Container, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import BasicTable from '../frontend/components/basicTable';
import { getAllBookings } from '../frontend/services/booking';
import moment from 'moment';
import { blue, green, red, yellow } from '@mui/material/colors';
import MultipleSelectChip from '../frontend/components/multipleSelectChip';
import { isNumeric } from '../frontend/utils/numbers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers';
import { LoadingButton } from '@mui/lab';

const generateHeaders = () => {
    return [
        {
            props: {},
            value: 'Id'
        },
        {
            props: {},
            value: 'Kolam'
        },
        {
            props: {},
            value: 'Tarikh Pancing',
        },
        {
            props: {},
            value: 'Pancang'
        },
        {
            props: {},
            value: 'Add Ons'
        },
        {
            props: {},
            value: 'Amaun'
        },
        {
            props: {},
            value: 'Maklumat Pengguna'
        },
        {
            props: {},
            value: 'Status',
        },
        {
            props: {},
            value: 'Tarikh Booking'
        },
    ]
}

const generatePaymentChip = (status) => {
    if (status == 'CANCELLED') {
        return <Chip sx={{ background: red[500], color: '#ffffff' }} label={status} />
    }
    else if (status == 'PAID') {
        return <Chip sx={{ background: green[500], color: '#ffffff' }} label={status} />
    } else if (status == 'PENDING') {
        return <Chip sx={{ background: yellow[800], color: '#ffffff' }} label={status} />
    } else if (status == 'CREATED') {
        return <Chip sx={{ background: blue[800], color: '#ffffff' }} label={status} />
    }
}


const BookingPengguna = props => {
    const [data, setData] = useState([]);
    const [filterProps, setFilterProps] = useState({
        bookingId: '',
        paymentStatus: [],
        kolam: [],
        tarikh: null,
    });
    const [loadingTable, setLoadingTable] = useState(false);

    const getData = async (applyFilter) => {
        getAllBookings(applyFilter ? filterProps : {}).then(async resp => {
            setLoadingTable(true);
            const message = await resp?.json()
            const newData = [];
            for (let d of message?.data) {
                let colData = []
                colData.push({
                    props: { sx: { width: '200px' } },
                    value: d?.id
                })
                colData.push({
                    props: {},
                    value: d?.kolam_id
                })
                colData.push({
                    props: { sx: { minWidth: '200px' } },
                    value: moment(d?.tarikh).format('Do MMMM YYYY')
                })
                colData.push({
                    props: { sx: { minWidth: '200px' } },
                    value: <Grid container columnSpacing={2} rowSpacing={2}>
                        {d?.pancangs?.map(pancang => <Grid item xs="auto">
                            <Chip label={pancang?.nombor} />
                        </Grid>)}
                    </Grid>
                })
                colData.push({
                    props: { sx: { minWidth: '200px' } },
                    value: <Grid container>
                        {d?.add_ons.map(ao => <Grid item xs="12">
                            <Typography textTransform={'capitalize'}>{ao?.type?.replace('_', ' ')} x {ao?.quantity}</Typography>
                        </Grid>)}
                    </Grid>
                })
                colData.push({
                    props: { sx: { minWidth: '150px' } },
                    value: `RM ${d?.amount}`
                })
                colData.push({
                    props: {},
                    value: <Grid container>
                        <Grid item xs={12}>
                            <Typography>{d?.user?.nama_pertama} {d?.user?.nama_akhir}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>{d?.user?.email}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>{d?.user?.telefon}</Typography>
                        </Grid>
                    </Grid>
                })
                colData.push({
                    props: {},
                    value: generatePaymentChip(d?.payment_status)
                })
                colData.push({
                    props: { width: 200 },
                    value: moment(d?.created_on).format('Do MMMM YYYY, h:mm:ss a')
                })
                newData.push(colData);
            }
            setData(newData);
            setLoadingTable(false);
        })
    }
    useEffect(() => {
        getData(false)
    }, [])

    const onChangeBookingId = (e) => {
        if (e?.target?.value == '' || isNumeric(e?.target?.value)) {
            setFilterProps({
                ...filterProps,
                bookingId: e?.target?.value
            })
        } else {
            return
        }
    }

    const handleApplyFilter = async () => {
        await getData(true);
    }

    const handleChangePaymentStatus = (event) => {
        const {
            target: { value },
        } = event;
        setFilterProps({
            ...filterProps,
            paymentStatus: typeof value === 'string' ? value.split(',') : value,
        })
    };

    const handleChangeKolam = (event) => {
        const {
            target: { value },
        } = event;
        setFilterProps({
            ...filterProps,
            kolam: typeof value === 'string' ? value.split(',') : value,
        })
    };

    const handleChangeTarikh = val => {
        setFilterProps({
            ...filterProps,
            tarikh: val
        })
    }

    return <Container maxWidth="xl">
        <Grid container rowSpacing={2} pb={10}>
            <Grid item xs={12}>
                <Typography variant='h5'>Senarai Booking Pengguna</Typography>
            </Grid>
            <Grid item xs={12}>
                <Card sx={{ boxShadow: 'none' }}>
                    <CardContent>
                        <Grid container rowSpacing={2}>
                            <Grid item xs={12} sm={12}>
                                <Grid container rowSpacing={2}>
                                    <Grid item xs={12} sm={12}>
                                        <Typography>Filter</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <TextField sx={{ width: 250 }} onChange={onChangeBookingId} value={filterProps?.bookingId} label='Booking ID' />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <MultipleSelectChip label="Payment Status" handleChange={handleChangePaymentStatus} value={filterProps?.paymentStatus} constants={['CREATED', 'PENDING', 'PAID', 'CANCELLED']} />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <MultipleSelectChip label="Kolam" handleChange={handleChangeKolam} value={filterProps?.kolam} constants={[1, 2, 3]} />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                            <DatePicker value={filterProps?.tarikh} onChange={handleChangeTarikh} sx={{ width: 250 }} format='DD/MM/YYYY' label="Tarikh Pancing" />

                                        </LocalizationProvider>
                                    </Grid>
                                </Grid>

                            </Grid>
                            {/* <Grid item xs={12} sm={6}>
                                <Grid container rowSpacing={2}>
                                    <Grid item xs={12}>
                                        <Typography>Sort</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <MultipleSelectChip label="Payment Status" values={['CREATED', 'PENDING', 'PAID', 'CANCELLED']} />

                                    </Grid>
                                    <Grid item xs={12}>
                                        <MultipleSelectChip label="Kolam" values={[1, 2, 3]} />
                                    </Grid>
                                </Grid>

                            </Grid> */}
                            <Grid item xs={12}>
                                <LoadingButton loading={loadingTable} variant='contained' onClick={handleApplyFilter}>Apply</LoadingButton>
                            </Grid>

                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12}>
                <BasicTable
                    loading={loadingTable}
                    headers={generateHeaders()}
                    rows={data}
                />
            </Grid>
        </Grid>
    </Container>
}

export default BookingPengguna;