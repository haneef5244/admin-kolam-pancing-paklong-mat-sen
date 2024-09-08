'use client';
import React, { useState } from 'react';
import './index.css'; // Import your CSS file for styling
import { Alert, Button, Card, CardContent, Chip, Container, Divider, Grid, Snackbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import { DoubleArrowOutlined, Info } from '@mui/icons-material';
import { cyan, green, grey, red } from '@mui/material/colors';
import Lottie from 'react-lottie';
import ScrollDown from '@/app/frontend/lotties/scroll-down.json';
import AdditonalProducts from '../additional-products';
// import { create } from '../../services/booking';
import { LoadingButton } from '@mui/lab';


const KolamPancang = ({
    kolamId,
    leftPancangs,
    rightPancangs,
    bookedSlots = [],
    setBookedSlots,
    total,
    setTotal,
    additionalProducts,
    setAdditionalProducts,
    handleNext
}) => {

    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.only('xs'), { noSsr: true });

    const [left, setLeft] = useState(leftPancangs);
    const [right, setRight] = useState(rightPancangs);

    const [snackbarProps, setSnackbarProps] = useState({});
    const [loadingButton, setLoadingButton] = useState(false);


    const handleBookSlot = (slotId) => {
        if (bookedSlots.includes(slotId)) {
            setBookedSlots(bookedSlots.filter(id => id !== slotId));
            setTotal(total - 1)
        } else {
            setBookedSlots([...bookedSlots, slotId]);
            setTotal(total + 1)
        }
    };

    const renderButtons = (buttons) => {
        let maps = []

        for (let i = 0; i < buttons.length; i++) {
            maps.push(
                <Grid item xs={12} width={'100%'}>
                    <Button
                        key={buttons[i]?.pancang?.value}
                        disabled={!buttons[i]?.is_available}
                        className={`pond-button ${bookedSlots.includes(buttons[i]?.pancang?.value) ? 'booked' : !buttons[i]?.is_available ? 'not-available' : 'available'}`}
                        onClick={() => handleBookSlot(buttons[i]?.pancang?.value)}
                        sx={{
                            width: '64px', ':focus': {
                                background: 'unset'
                            },
                            ':disabled': {
                                color: grey[300]
                            }
                        }}
                    >
                        {i}
                    </Button>
                </Grid>
            )
        }

        return <Grid container>
            {buttons.map((button) => <Grid item xs={12} width={'100%'}>
                <Button
                    key={button?.pancang?.value}
                    disabled={!button?.is_available}
                    className={`pond-button ${bookedSlots.includes(button?.pancang?.value) ? 'booked' : !button?.is_available ? 'not-available' : 'available'}`}
                    onClick={() => handleBookSlot(button?.pancang?.value)}
                    sx={{
                        width: '64px',
                        ':disabled': {
                            color: grey[300]
                        }
                    }}
                >
                    {button?.pancang?.value}
                </Button>
            </Grid>)}
        </Grid>
    };

    const handleCreateBooking = async () => {
        if (!bookedSlots?.length) {
            setSnackbarProps({
                open: true,
                message: 'Sila pilih sekurangnya 1 pancang',
                severity: 'warning'
            })
            return;
        }
        setLoadingButton(true);
        const addOns = {}
        for (let ao of additionalProducts) {
            if (ao?.name == 'Air Mineral' && ao?.quantity > 0) {
                addOns.airMineral = ao?.quantity
            }
        }
        handleNext();
        // const resp = await create({
        //     pancang: bookedSlots,
        //     kolam_id: Number(kolamId),
        //     tarikhPancing: new Date(tarikh),
        //     amount: total,
        //     addOns,
        // });
        // const respJson = await resp.json();

        // if (!resp.ok) {
        //     setSnackbarProps({
        //         open: true,
        //         message: respJson?.error,
        //         severity: 'error'
        //     })
        //     setLoadingButton(false);
        // } else {
        //     const { booking } = respJson;
        //     navigate.push(`/kolam/booking/${booking}`)
        // }

    }

    const handleClickAdditionalProducts = (valueToAdd, index) => {

        let newAdditionalProducts = [...additionalProducts];
        if (newAdditionalProducts[index].quantity == 0 && valueToAdd == -1) {
            return
        }
        newAdditionalProducts[index].quantity = newAdditionalProducts[index].quantity + valueToAdd
        if (valueToAdd == 1) {
            setTotal(Number(total) + Number(newAdditionalProducts[index].price));
        } else {
            setTotal(Number(total) - Number(newAdditionalProducts[index].price));
        }
        setAdditionalProducts(newAdditionalProducts)
    }

    const generateAdditionalProductsCalculation = () => {
        let comp = []
        for (let i of additionalProducts) {
            if (i.quantity) {
                comp.push(<Grid container>
                    <Grid item xs={6}>
                        <Typography>{i.name} x {i.quantity}</Typography>
                    </Grid>
                    <Grid item xs={6} display={'flex'} justifyContent={'end'}>
                        <Typography fontWeight={'bold'}>RM {i.price * i.quantity}</Typography>
                    </Grid>
                </Grid>)
            }
        }
        return <>
            {comp.map(e => e)}
        </>
    }

    return (
        <Container sx={{ pt: 3, pb: 3 }}>

            <Grid container>
                <Grid item xs={12}>
                    <Typography variant='h6'>
                        Pilih pancang anda
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Grid container columnSpacing={2}>
                        <Grid item xs={'auto'}>
                            <Grid container columnSpacing={1}>
                                <Grid item xs='auto'>
                                    <div style={{ width: 20, height: 20, borderRadius: 5, backgroundColor: green[600] }}></div>
                                </Grid>
                                <Grid item xs='auto'>
                                    <Typography fontWeight={600}>Masih Terbuka</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={'auto'}>
                            <Grid container columnSpacing={1}>
                                <Grid item xs='auto'>
                                    <div style={{ width: 20, height: 20, borderRadius: 5, backgroundColor: red[600] }}></div>
                                </Grid>
                                <Grid item xs='auto'>
                                    <Typography fontWeight={600}>Sudah Diambil</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={'auto'}>
                            <Grid container columnSpacing={1}>
                                <Grid item xs='auto'>
                                    <div style={{ width: 20, height: 20, borderRadius: 5, backgroundColor: grey[600] }}></div>
                                </Grid>
                                <Grid item xs='auto'>
                                    <Typography fontWeight={600}>Anda Memilih</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sx={{ pt: 2, display: { xs: 'block', md: 'none' } }}>
                    <Card sx={{ backgroundColor: cyan[800], borderRadius: '10px', border: `1px solid ${cyan[600]}` }}>
                        <CardContent sx={{ paddingBottom: '16px !important' }}>
                            <Grid container columnSpacing={1} alignItems={'center'}>
                                <Grid item xs='auto' alignItems={'center'}>
                                    <Info sx={{ color: '#ffffff', display: 'flex', }} />
                                </Grid>
                                <Grid item xs='auto'>
                                    <Typography variant='caption' color={'#ffffff'}>Klik pada kotak hijau untuk pilih slot anda</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>

                    <Grid container columnSpacing={2}>
                        <Grid item xs={12} md={7} mt={3}
                            sx={{
                                height: {
                                    xs: '40vh',
                                    md: '70vh'
                                },
                                overflowY: {
                                    xs: 'scroll !important',
                                    md: 'scroll !important'
                                }
                            }}
                        >
                            <div style={{ display: 'flex', columnGap: 4 }}>
                                <div style={{ width: '64px' }}>
                                    {renderButtons(left)}
                                </div>
                                <div style={{ position: 'relative', width: '-webkit-fill-available' }}>


                                    <div className="pond" style={{ position: 'relative', height: '100%' }}>
                                        <div style={{ position: 'sticky', top: '0%', left: '50%' }}>
                                            <Container>
                                                <Button fullWidth></Button>
                                            </Container>
                                        </div>
                                        <div style={{ position: 'sticky', top: isXs ? '70%' : '75%', left: '50%' }}>
                                            <Lottie options={{
                                                loop: true,
                                                autoplay: true,
                                                animationData: ScrollDown,
                                                rendererSettings: {
                                                    preserveAspectRatio: 'xMidYMid slice',
                                                }
                                            }}
                                                height={100}
                                                width={100}
                                                isStopped={false}
                                                isPaused={false} />
                                        </div>
                                    </div>
                                </div>
                                <div style={{ width: '64px', alignItems: 'end' }}>
                                    {renderButtons(right, true)}
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={12} md={5} mt={3} columnSpacing={1}
                            sx={{
                                display: {
                                    md: 'block'
                                }
                            }}>
                            <Grid container rowSpacing={1} >
                                <Grid item xs={12} sx={{ display: { xs: 'none', md: 'block' } }}>
                                    <Card sx={{ backgroundColor: cyan[800], borderRadius: '10px', border: `1px solid ${cyan[600]}` }}>
                                        <CardContent sx={{ paddingBottom: '16px !important' }}>
                                            <Grid container columnSpacing={1} alignItems={'center'}>
                                                <Grid item xs='auto' alignItems={'center'}>
                                                    <Info sx={{ color: '#ffffff', display: 'flex', }} />
                                                </Grid>
                                                <Grid item xs='auto'>
                                                    <Typography variant='caption' color={'#ffffff'}>Klik pada kotak hijau untuk pilih slot anda</Typography>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12}>
                                    <Card sx={{ backgroundColor: '#ffffff', borderRadius: '10px', border: `1px solid ${cyan[600]}` }}>
                                        <CardContent>
                                            <Grid container columnSpacing={1} alignItems={'center'} rowSpacing={1}>
                                                <Grid item xs={12}>
                                                    <Typography fontWeight={'bold'} sx={{ color: cyan[600] }}>Pancang yang anda pilih:</Typography>
                                                </Grid>
                                                {bookedSlots.map(b => <Grid item>
                                                    <Chip variant='filled' sx={{ background: green[600], color: '#ffffff' }} label={<Typography fontWeight={'bold'}>{b}</Typography>} />
                                                </Grid>)}
                                                <Grid item xs={12}>
                                                    <Grid container>
                                                        <Grid item xs={12}>
                                                            <Typography fontWeight={'bold'} sx={{ color: cyan[600] }}>Add-Ons:</Typography>
                                                        </Grid>
                                                        <AdditonalProducts handleClickAdditionalProducts={handleClickAdditionalProducts} swiper={additionalProducts} />
                                                    </Grid>
                                                </Grid>

                                                {bookedSlots.length > 0 ? <Grid item xs={12}>
                                                    <Grid container>
                                                        <Grid item xs={12}>
                                                            <Typography fontWeight={'bold'} sx={{ color: cyan[600] }}>Ringkasan pembelian:</Typography>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid container>
                                                        <Grid item xs={6}>
                                                            <Typography>
                                                                Lokasi
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={6} display={'flex'} justifyContent={'end'}>
                                                            <Typography>
                                                                Kolam {kolamId}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Typography>
                                                                Pancang x {bookedSlots.length}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={6} display={'flex'} justifyContent={'end'}>
                                                            <Typography fontWeight={'bold'}>
                                                                RM {bookedSlots.length * 1}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                    {generateAdditionalProductsCalculation()}
                                                    <Grid container mt={1} mb={1}>
                                                        <Grid item xs={12}>
                                                            <Divider />
                                                        </Grid>
                                                    </Grid>
                                                    <Grid container mt={1}>
                                                        <Grid item xs={6}>
                                                            <Typography>
                                                                Jumlah Keseluruhan
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={6} display={'flex'} justifyContent={'end'}>
                                                            <Typography fontWeight={'bold'}>
                                                                RM {total}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Grid> : <></>}
                                                <Grid item xs={12}>
                                                    <LoadingButton
                                                        loading={loadingButton}
                                                        startIcon={<DoubleArrowOutlined color=' #ffffff' />}
                                                        variant='contained'
                                                        onClick={() => handleCreateBooking()}
                                                        sx={{
                                                            padding: '10px 20px',
                                                            borderRadius: '10px',
                                                            background: cyan[800],
                                                            ':hover': {
                                                                background: cyan[700]
                                                            }
                                                        }}
                                                    >
                                                        <Typography fontWeight={'bold'} textTransform={'capitalize'}>Seterusnya</Typography>
                                                    </LoadingButton>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid >
            <Snackbar
                open={snackbarProps?.open}
                autoHideDuration={6000}
                onClose={() => setSnackbarProps({})}
            >
                <Alert sx={{ display: 'flex', alignItems: 'center' }} variant="filled" severity={snackbarProps?.severity}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography>
                                {snackbarProps?.message}
                            </Typography>
                        </Grid>
                    </Grid>
                </Alert>
            </Snackbar>
        </Container >


    );
};

export default KolamPancang;
