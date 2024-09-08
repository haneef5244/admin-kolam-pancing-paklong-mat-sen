'use client';
import { Alert, Button, Card, CardContent, CardHeader, Container, Grid, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { verifyBookingQr } from '../frontend/services/booking';

const Home = () => {
    const [openScanner, setOpenScanner] = useState(false);
    const [alertProps, setAlertPropts] = useState({});
    const handleScan = async (result) => {
        setOpenScanner(false);
        console.log(result);
        const resp = await verifyBookingQr({
            token: result?.[0]?.rawValue
        });
        const message = await resp.json()
        if (resp?.ok) {
            setAlertPropts({
                open: true,
                message: 'Berjaya check-in booking!',
                severity: 'success'
            })
        } else {
            setAlertPropts({
                open: true,
                message: message?.error,
                severity: 'error'
            })
        }
    }
    return <Container maxWidth={'lg'}>
        <Card>
            <CardHeader title='Selamat Datang ke Admin Kolam Pancing Paklong Mat Sen' />

            <CardContent>
                <Typography>
                    Sila klik pada butang menu pada kiri atas untuk meneruskan aktiviti anda.
                </Typography>
            </CardContent>
        </Card>
    </Container>
}

export default Home;