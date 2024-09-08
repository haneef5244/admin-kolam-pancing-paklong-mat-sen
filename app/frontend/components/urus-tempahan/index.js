'use client';
import { Alert, Button, Card, CardContent, CardHeader, Container, Grid, Snackbar, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import BorderedCard from '../borderedCard';
import MultiDatePicker from '../multiDatePicker';
import { LoadingButton } from '@mui/lab';
import { getBookingAvailability, updateBookingAvailability } from '../../services/booking';
import moment from 'moment';

const UrusTempahanComponent = props => {
    const [existingDates, setExistingDates] = useState([]);
    const [datesToEnable, setDatesToEnable] = useState([]);
    const [enableSubmit, setEnableSubmit] = useState(false);

    const [submitLoading, setSubmitLoading] = useState(false);

    const [openSuccess, setOpenSuccess] = useState(false);
    const [openFail, setOpenFail] = useState(false);

    const handleOnChangeDate = (e, o, i) => {
        setDatesToEnable(e);
    }

    useEffect(() => {
        getBookingAvailability().then(async (res) => {
            const message = await res.json();

            setDatesToEnable(message?.data?.map(e => moment(e?.tarikh).format('YYYY-MM-DD')))
            setExistingDates(message?.data?.map(e => moment(e?.tarikh).format('YYYY-MM-DD')))
        })
    }, [])

    useEffect(() => {
        if (datesToEnable?.length) {
            setEnableSubmit(true)
        } else {
            setEnableSubmit(false)
        }
    }, [datesToEnable])

    const reloadData = async () => {
        const resp = await getBookingAvailability();
        const respJson = await resp.json();
        const formattedDates = respJson?.data?.map(e => moment(e?.tarikh).format('YYYY-MM-DD'));
        setExistingDates([...formattedDates]);
        setDatesToEnable([...formattedDates]);
        setSubmitLoading(false);
    }

    const handleSubmit = async () => {
        setSubmitLoading(true);
        let data = [];

        let newDates = {}
        for (let i of datesToEnable) {
            // if not available, insert
            newDates[i.format('YYYY-MM-DD')] = true;
            if (!existingDates.includes(i.format('YYYY-MM-DD'))) {
                data.push({
                    value: i.format('YYYY-MM-DD'),
                    is_deleted: false,
                })
            }
        }
        for (let i of existingDates) {
            if (!newDates[i]) {
                data.push({
                    value: i,
                    is_deleted: true,
                })
            }
        }

        const resp = await updateBookingAvailability({ dates: data });
        if (resp?.ok) {
            await reloadData();
            setOpenSuccess(true)
        } else {
            setSubmitLoading(false);
            setOpenFail(true)
        }

    }

    return <Container maxWidth={'xl'}>
        <BorderedCard>
            <CardHeader title="Urus Tempahan" />
            <CardContent>
                <Grid container rowSpacing={2}>
                    <Grid item xs={12}>
                        <Typography>Halaman ini membolehkan anda mengaktifkan tarikh yang anda ingin buka ketersediaan laman kepada pelanggan.</Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ width: '100%' }} >
                        <MultiDatePicker values={datesToEnable} onChange={handleOnChangeDate} />
                    </Grid>
                </Grid>
                <Grid container pt={2}>
                    <Grid item xs={12}>
                        <LoadingButton onClick={handleSubmit} variant='contained'>Hantar</LoadingButton>
                    </Grid>
                </Grid>
            </CardContent>
        </BorderedCard>
        <Snackbar open={openSuccess} autoHideDuration={5000} onClose={() => setOpenSuccess(false)}>
            <Alert
                onClose={() => setOpenSuccess(false)}
                severity="success"
                variant="filled"
                sx={{ width: '100%' }}
            >
                Hantaran berjaya!
            </Alert>
        </Snackbar>
        <Snackbar open={openFail} autoHideDuration={5000} onClose={() => setOpenFail(false)}>
            <Alert
                onClose={() => setOpenFail(false)}
                severity="error"
                variant="filled"
                sx={{ width: '100%' }}
            >
                Hantaran gagal!
            </Alert>
        </Snackbar>
    </Container>
}

export default UrusTempahanComponent;