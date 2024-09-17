import { Alert, Box, Button, Card, CardContent, CardHeader, Container, Grid, Typography } from '@mui/material';
import React from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { verifyBookingQr } from '../frontend/services/booking';
import { getAllPertandingan } from '../backend/actions/pertandingan';
import { Dashboard } from '../frontend/components/dashboard';

const Home = async () => {

    const pertandingans = await getAllPertandingan();

    return <Container maxWidth={'xl'} sx={{ pb: 5 }}>
        <Box>
            <Card>
                <CardHeader title='Selamat Datang ke Admin Kolam Pancing Paklong Mat Sen' />
                <CardContent>

                    <Dashboard pertandingans={pertandingans} />
                </CardContent>
            </Card>
        </Box>
    </Container>
}

export default Home;