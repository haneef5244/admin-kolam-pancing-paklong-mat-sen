'use client';
import React, { useState } from 'react';
import { verifyBookingQr } from '../frontend/services/booking';
import { Alert, Button, Card, CardContent, CardHeader, Container, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import { Scanner } from '@yudiel/react-qr-scanner';
import { grey, red } from '@mui/material/colors';
import moment from 'moment';

const ScanQR = (props) => {
    const [openScanner, setOpenScanner] = useState(true);
    const [alertProps, setAlertPropts] = useState({});
    const [dialogProps, setDialogProps] = useState({});
    const [kolamPancangData, setKolamPancangData] = useState({});

    const handleScan = async (result) => {
        setOpenScanner(false);
        console.log(result);
        const resp = await verifyBookingQr({
            token: result?.[0]?.rawValue
        });
        const message = await resp.json()
        if (resp?.ok) {
            setDialogProps({
                open: true,
                data: message?.data
            })
            let kolamObj = {};
            for (let b of message?.data?.kolam_booking_kolams) {
                if (kolamObj[b?.kolam?.label]) {
                    kolamObj[b?.kolam?.label] = [...kolamObj[b?.kolam?.label], b?.kolam_booking_pancang?.value].sort((a, b) => {
                        // Compare the alphabetic part first
                        const alphaA = a.charAt(0);
                        const alphaB = b.charAt(0);

                        if (alphaA !== alphaB) {
                            return alphaA.localeCompare(alphaB);
                        }

                        // If the alphabetic parts are the same, compare the numeric part
                        const numA = parseInt(a.slice(1), 10);
                        const numB = parseInt(b.slice(1), 10);

                        return numA - numB;
                    });
                } else {
                    kolamObj[b?.kolam?.label] = [b?.kolam_booking_pancang?.value]
                }
            }

            debugger
            setKolamPancangData(kolamObj);
            setAlertPropts({
                open: true,
                message: 'Berjaya check-in tempahan!',
                severity: 'success'
            })
        } else {
            setAlertPropts({
                open: true,
                message: message?.error,
                severity: 'error'
            })
        }
        setOpenScanner(true);
    }
    return <Container maxWidth={'md'}>
        <Card sx={{ boxShadow: 0, borderRadius: '15px', border: `1px solid ${grey[300]}` }}>
            <CardHeader sx={{ textAlign: 'center' }} title={<Typography fontSize={'20px'} fontWeight={'bold'}>QR Scanner</Typography>} />
            <CardContent>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography variant='h7' fontWeight={'bold'}>
                            QR code yang di scan akan membolehkan pengguna untuk masuk ke kawasan kolam pancing.
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant='h7' sx={{ color: red[700] }} fontWeight={'bold'}>
                            QR code yang sah hanya boleh discan sekali sahaja.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} pt={2}>
                        <Container maxWidth={"xs"}>
                            {alertProps?.open ? <Alert severity={alertProps?.severity}>{alertProps?.message}</Alert> : <></>}

                            <Card sx={{ borderRadius: '15px' }}>
                                {openScanner ? <Scanner onScan={handleScan} /> : <></>}
                            </Card>

                        </Container>
                    </Grid>

                    <Grid item xs={12}>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
        <Dialog open={dialogProps?.open} onClose={() => setDialogProps({})}>
            <DialogTitle><Typography variant='h6' fontWeight={'bold'}>Booking Check-in Berjaya</Typography></DialogTitle>
            <DialogContent>
                <Grid container rowSpacing={2}>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Typography fontWeight={'bold'}>Booking ID</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography fontWeight={'200'}>{dialogProps?.data?.id}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Typography fontWeight={'bold'}>Nama Pengguna</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography fontWeight={'200'}>{dialogProps?.data?.is_manual ? `${dialogProps?.data?.manual_booking?.nama_penuh}` : `${dialogProps?.data?.user?.nama_pertama} ${dialogProps?.data?.user?.nama_akhir}`}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    {Object.keys(kolamPancangData).map(kolam => <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <Typography fontWeight={'bold'}>Kolam</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography fontWeight={'200'}>{kolam}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <Typography fontWeight={'bold'}>Pancang</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography fontWeight={'200'}>{kolamPancangData[kolam].map(e => e).join(', ')}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>)}

                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Typography fontWeight={'bold'}>Tarikh Pancing</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography fontWeight={'200'}>{moment(dialogProps?.data?.tarikh).format('Do MMMM YYYY')}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Typography fontWeight={'bold'}>Add-ons</Typography>
                            </Grid>
                            {dialogProps?.data?.add_ons?.length ? dialogProps?.data?.add_ons?.map(e => <Grid item xs={12}>
                                <Typography textTransform={'capitalize'}>{e?.type?.replace('_', ' ')} x {e?.quantity}</Typography>
                            </Grid>) : <Typography>Tiada</Typography>}

                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setDialogProps({})} variant='outlined'>Ok</Button>
            </DialogActions>
        </Dialog>

    </Container>
}

export default ScanQR;

