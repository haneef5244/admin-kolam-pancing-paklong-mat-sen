'use client';
import { Button, Card, CardContent, CardMedia, Container, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { grey, red } from '@mui/material/colors';
import moment from 'moment';
import { startPertandingan } from '@/app/backend/actions/pertandingan';
import { useRouter } from 'next/navigation';
import { getPubSubToken } from '@/app/backend/actions/webpubsub';

const StartPertandingan = ({ data }) => {
    const navigate = useRouter();
    const [ws, setWs] = useState(null);

    const [isOpenConfirmSelectPertandingan, setIsOpenConfirmSelectPertandingan] = useState(false);
    const [selectedPertandingan, setSelectedPertandingan] = useState({});

    const handleSelectPertandingan = (data) => {
        setSelectedPertandingan(data);
    }

    const handleAgree = async () => {
        await startPertandingan(selectedPertandingan?.pertandingan_id);

        setSelectedPertandingan({})
        navigate.refresh()
    }

    const handleViewPertandingan = async (data) => {
        navigate.push(`/pertandingan/${data?.pertandingan_id}`);
    }

    useEffect(() => {
        const connectToWebPubSub = async () => {
            const token = await getPubSubToken(process.env.AZURE_WEB_PUB_SUB_CONNECTION_STRING, 'pertandingan_event_started');
            const webSocketUrl = token.url;

            // Connect to Web PubSub using the WebSocket URL from the token
            const websocket = new WebSocket(webSocketUrl);
            setWs(websocket);

            // Handle incoming messages
            websocket.onmessage = (event) => {
                const messageData = JSON.parse(event.data);
                const parsedData = JSON.parse(messageData);
                if (parsedData?.is_started) {
                    navigate.refresh()
                }
            };

            // Handle WebSocket close
            websocket.onclose = () => {
                console.log('Connection closed');
            };
        };

        connectToWebPubSub();

        // Cleanup WebSocket connection when component unmounts
        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, []);

    return <Container maxWidth="xl">
        <Grid container>
            <Grid item xs={12}>
                <Grid container rowSpacing={2} columnSpacing={2}>
                    {data?.map(date => <Grid item xs="12" sm={6} lg={4} xl={3}>
                        <Card sx={{ border: `1px solid ${grey[300]}`, boxShadow: 'none' }}>
                            <CardMedia component={"img"} src={date?.poster_url} />
                            <CardContent sx={{ border: 'none' }}>
                                <Grid container>
                                    <Grid item xs={6}>
                                        <Grid container>
                                            <Grid item xs="12">
                                                <Typography>Tarikh Pertandingan:</Typography>
                                            </Grid>
                                            <Grid item xs="12">
                                                <Typography fontWeight={'bold'}>{moment(date?.tarikh).format('Do MMM YYYY')}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Grid container>
                                            <Grid item xs="12">
                                                <Typography>Jenis Pertandingan:</Typography>
                                            </Grid>
                                            <Grid item xs="12">
                                                <Typography fontWeight={'bold'}>{date?.jenis}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Grid container>
                                            <Grid item xs="12">
                                                <Typography>Status Pertandingan:</Typography>
                                            </Grid>
                                            <Grid item xs="12">
                                                <Typography fontWeight={'bold'}>{date?.is_ended ? 'Tamat' : 'Belum Bermula'}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    {date?.is_ended ? <Grid item xs={12} pt={2} textAlign={'center'}>
                                        <Button onClick={() => handleViewPertandingan(date)} variant="contained">
                                            <Typography textTransform={'capitalize'}>Lihat Pertandingan Ini</Typography>
                                        </Button>
                                    </Grid> : <></>}
                                    {!date?.is_ended && !date?.is_started ? <Grid item xs={12} pt={2} textAlign={'center'}>
                                        <Button onClick={() => handleSelectPertandingan(date)} variant="contained">
                                            <Typography textTransform={'capitalize'}>Mulakan Pertandingan Ini</Typography>
                                        </Button>
                                    </Grid> : <></>}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>)}
                </Grid>
            </Grid>
        </Grid>
        <Dialog open={selectedPertandingan?.pertandingan_id}>
            <DialogTitle fontWeight={'bold'}>Anda Setuju Untuk Teruskan?</DialogTitle>
            <DialogContent>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography>Anda telah memilih untuk memulakan pertandingan pada <Typography sx={{ fontWeight: 'bold' }}>{moment(selectedPertandingan?.tarikh).format('Do MMM YYYY')}</Typography></Typography>
                    </Grid>
                    <Grid item xs={12} pt={2}>
                        <Typography fontWeight={'bold'} color={red[600]}>Tindakan ini tidak boleh diundurkan.</Typography>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Grid container columnSpacing={1} justifyContent={'end'}>
                    <Grid item xs="auto">
                        <Button onClick={() => setSelectedPertandingan({})} variant='outlined'>
                            <Typography textTransform={'capitalize'}>Tidak Setuju</Typography>
                        </Button>
                    </Grid>
                    <Grid item xs="auto">
                        <Button onClick={handleAgree} variant='contained'>
                            <Typography textTransform={'capitalize'}>Setuju</Typography>
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
    </Container>
}

export default StartPertandingan