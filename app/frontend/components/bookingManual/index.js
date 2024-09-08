'use client';

import { Alert, Box, Button, Card, CardContent, CardMedia, Container, Dialog, DialogContent, DialogTitle, Divider, Grid, Snackbar, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import PilihPertandingan from '../pilihPertandingan';
import PondLayout from '../pondLayout';
import MaklumatBookingManual from '../maklumatBookingManual';
import { getAvailablePancang } from '@/app/backend/actions/pancang';
import { useRouter } from 'next/navigation';
import KolamPancang from '../kolamPancang';
import SimpleDialog from '../simpleDialog';
import { createManualBooking } from '@/app/backend/actions/booking';

const BookingManualComponent = ({ data }) => {
    const navigate = useRouter();

    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());



    const [tarikhPertandingan, setTarikhPertandingan] = useState(null);
    const [kolamId, setKolamId] = useState(null);
    const [leftPancangs, setLeftPancangs] = useState([]);
    const [rightPancangs, setRightPancangs] = useState([]);

    const [bookedSlots, setBookedSlots] = useState([]);
    const [total, setTotal] = useState(0);
    const [additionalProducts, setAdditionalProducts] = useState([
        {
            name: 'Air Mineral',
            priceLabel: 'RM 2',
            price: 2,
            quantity: 0,
            image: '/images/mineral-water.jpeg'
        },
    ])

    const [namaPenuh, setNamaPenuh] = useState('');
    const [namaPenuhErrorMessage, setNamaPenuhErrorMessage] = useState('');

    const [email, setEmail] = useState('');
    const [emailErrorMessage, setEmailErrorMessage] = useState('');

    const [telefon, setTelefon] = useState('');
    const [telefonErrorMessage, setTelefonErrorMessage] = useState('');

    const [openSemakan, setOpenSemakan] = useState(false);

    const [snackbarProps, setSnackbarProps] = useState({});
    const [openBerjaya, setOpenBerjaya] = useState(false);

    const handleSelectTarikhPertandingan = e => {
        setTarikhPertandingan(e);
        setActiveStep(1);
    }

    const handleSelectKolam = async id => {
        setKolamId(id);
        const pancangData = await getAvailablePancang(Number(id), new Date(tarikhPertandingan));
        if (pancangData?.length) {
            const leftItems = pancangData.filter(e => e?.pancang?.is_left)?.sort((a, b) => {
                // Extract and convert the numeric parts of the pancang.value properties
                const numA = parseInt(a.pancang.value.slice(1), 10);
                const numB = parseInt(b.pancang.value.slice(1), 10);

                // Compare the numeric values
                return numA - numB;
            });
            const rightItems = pancangData.filter(e => e?.pancang?.is_right)?.sort((a, b) => {
                // Extract and convert the numeric parts of the pancang.value properties
                const numA = parseInt(a.pancang.value.slice(1), 10);
                const numB = parseInt(b.pancang.value.slice(1), 10);

                // Compare the numeric values
                return numA - numB;
            });
            setLeftPancangs(leftItems)
            setRightPancangs(rightItems)
            setTotal(0);
            setBookedSlots([]);
            setActiveStep(2);

        } else {

        }
    }

    const handleNextPancang = () => {
        setActiveStep(3);
    }

    const handleChangeNamaPenuh = val => {
        setNamaPenuh(val);
    }

    const handleChangeEmail = val => {
        setEmail(val);
    }

    const handleChangeTelefon = val => {
        if (!(/^[0-9]+$/.test(val)) || val.length > 40) {
            return;
        }
        setTelefon(val);
    }

    const resetErrorMessages = () => {
        setEmailErrorMessage('')
        setTelefonErrorMessage('')
        setNamaPenuhErrorMessage('')
    }

    const handleVerifyInfo = () => {
        resetErrorMessages();
        let valid = true;
        if (!telefon) {
            setTelefonErrorMessage('No. telefon perlu diisi.')
            valid = false
        }
        if (!namaPenuh) {
            setNamaPenuhErrorMessage('Nama penuh perlu diisi.')
            valid = false
        }
        if (valid) {
            setOpenSemakan(true);
        }
    }

    const steps = [
        {
            title: 'Pilih pertandingan',
            component: <PilihPertandingan data={data} onHandleSelect={e => handleSelectTarikhPertandingan(e)} />
        },
        {
            title: 'Isi Maklumat Pengguna',
            component: <PondLayout handleOnClick={id => handleSelectKolam(id)} />
        },
        {
            title: 'Pilih Pancang & Add ons',
            component: <KolamPancang
                kolamId={kolamId}
                tarikh={tarikhPertandingan}
                leftPancangs={leftPancangs}
                rightPancangs={rightPancangs}
                bookedSlots={bookedSlots}
                setBookedSlots={setBookedSlots}
                total={total}
                setTotal={setTotal}
                handleNext={() => handleNextPancang()}
                additionalProducts={additionalProducts}
                setAdditionalProducts={setAdditionalProducts} />
        },
        {
            title: 'Semakan & Hantar',
            component: <MaklumatBookingManual
                namaPenuh={namaPenuh}
                handleChangeNamaPenuh={handleChangeNamaPenuh}
                namaPenuhErrorMessage={namaPenuhErrorMessage}

                email={email}
                handleChangeEmail={handleChangeEmail}
                emailErrorMessage={emailErrorMessage}

                telefon={telefon}
                handleChangeTelefon={handleChangeTelefon}
                telefonErrorMessage={telefonErrorMessage}

                handleNext={handleVerifyInfo}
            />
        }
    ];

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const handleSubmit = async () => {
        createManualBooking(kolamId, tarikhPertandingan, bookedSlots, additionalProducts).then(res => {
            setOpenSemakan(false);
            setOpenBerjaya(true);
        }).catch(e => {
            setSnackbarProps({
                open: true,
                message: e?.message,
                severity: 'error'
            })
        })
    }

    return <Container maxWidth="xl">
        <Grid container rowSpacing={2} pb={10}>
            <Grid item xs={12}>
                <Typography variant='h5'>Cipta Tempahan Secara Manual</Typography>
            </Grid>
            <Box sx={{ width: '100%', pt: 5 }}>
                <Stepper activeStep={activeStep}>
                    {steps.map((step, index) => {
                        const stepProps = {};
                        const labelProps = {};

                        return (
                            <Step key={step?.title} {...stepProps}>
                                <StepLabel {...labelProps}>{step?.title}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
                {activeStep === steps.length ? (
                    <React.Fragment>
                        <Typography sx={{ mt: 2, mb: 1 }}>
                            All steps completed - you&apos;re finished
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Box sx={{ flex: '1 1 auto' }} />
                            <Button onClick={handleReset}>Reset</Button>
                        </Box>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Box pt={5}>{steps[activeStep]?.component}</Box>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Button
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                sx={{ mr: 1 }}
                                variant='contained'
                            >
                                Kembali
                            </Button>
                            <Box sx={{ flex: '1 1 auto' }} />
                        </Box>
                    </React.Fragment>
                )}
            </Box>
            <SimpleDialog
                open={openSemakan}
                title={"Anda setuju untuk cipta tempahan berikut?"}
                content={<Grid container rowSpacing={2}>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Typography fontWeight={'bold'}>Nama Penuh</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                {namaPenuh}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Typography fontWeight={'bold'}>Email</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                {email || 'Tiada'}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Typography fontWeight={'bold'}>No. Telefon</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                {telefon}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Typography fontWeight={'bold'}>Kolam</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                {kolamId}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Typography fontWeight={'bold'}>Pancang</Typography>
                            </Grid>
                            {bookedSlots?.map(e => <Grid item xs={12}>
                                <Grid container justifyContent={'space-between'}>
                                    <Grid item xs="auto">
                                        {e}
                                    </Grid>
                                    <Grid item xs="auto">
                                        RM 90
                                    </Grid>
                                </Grid>

                            </Grid>)}

                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Typography fontWeight={'bold'}>Add-ons</Typography>
                            </Grid>
                            {additionalProducts?.filter(e => e?.quantity > 0)?.length ? additionalProducts?.filter(e => e?.quantity > 0).map(e => <Grid item xs={12}>
                                <Grid container justifyContent={'space-between'}>
                                    <Grid item xs="auto">
                                        {e?.name} x {e?.quantity}
                                    </Grid>
                                    <Grid item xs="auto">
                                        RM {e?.price * e?.quantity}
                                    </Grid>
                                </Grid>

                            </Grid>) : <Grid item xs={12}>Tiada</Grid>}

                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container justifyContent={'space-between'}>
                            <Grid item xs="auto">
                                <Typography fontWeight={'bold'}>Jumlah Keseluruhan</Typography>
                            </Grid>
                            <Grid item xs="auto">
                                <Typography fontWeight={'bold'}>RM {(bookedSlots?.length * 90) + additionalProducts?.filter(e => e?.quantity > 0)?.length * 2}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>}
                handleOk={() => handleSubmit()}
                handleClose={() => setOpenSemakan(false)} />

        </Grid>
        <Dialog open={openBerjaya} onClose={() => navigate.push('/')} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">
                Ciptaan Tempahan Berjaya!
            </DialogTitle>
            <DialogContent>Rekod tempahan telah direkodkan ke dalam sistem.</DialogContent>
        </Dialog>
        <Snackbar open={snackbarProps?.open} autoHideDuration={5000} onClose={() => setSnackbarProps({})}>
            <Alert severity={snackbarProps?.severity} variant='filled'>
                {snackbarProps?.message}
            </Alert>
        </Snackbar>
    </Container>
}

export default BookingManualComponent;