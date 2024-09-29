'use client';
import { getPertandinganLog } from '@/app/backend/actions/pertandingan';
import { Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import moment from 'moment';
import React, { useEffect, useState } from 'react';


export default function ViewPertandingan({ id }) {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        getPertandinganLog(id).then(data => setMessages(data))
    }, [])

    return <Container maxWidth={'xl'}>
        <Grid container rowSpacing={1} justifyContent={'space-between'} alignItems={'center'}>
            <Grid item xs={12}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell><Typography fontWeight={'bold'}>No.</Typography></TableCell>
                                <TableCell align="right"><Typography fontWeight="bold">Pancang</Typography></TableCell>
                                <TableCell align="right"><Typography fontWeight="bold">Berat&nbsp;(kg)</Typography></TableCell>
                                <TableCell align="right"><Typography fontWeight="bold">Waktu</Typography></TableCell>
                                <TableCell align="right"><Typography fontWeight="bold">Penimbang</Typography></TableCell>
                            </TableRow>
                            {messages.length === 0 && (<TableRow><TableCell colSpan={6}>Tiada tangkapan setakat ini. Sila tambah tangkapan.</TableCell></TableRow>)}

                        </TableHead>
                        <TableBody>
                            {messages.map((row) => (
                                <TableRow
                                    key={row.no}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        <Typography>{row.no}</Typography>
                                    </TableCell>
                                    <TableCell align="right"><Typography>{row.pancang_value}</Typography></TableCell>
                                    <TableCell align="right"><Typography>{row.berat}</Typography></TableCell>
                                    <TableCell align="right"><Typography>{moment(row.waktu).format('D MMMM YYYY HH:mm A').replace('tengahari', 'PM').replace('pagi', 'AM')}</Typography></TableCell>
                                    <TableCell align="right"><Typography>{row?.timbang?.label}</Typography></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    </Container >
}