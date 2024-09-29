'use client';
import { endPertandingan, insertPertandingLog } from '@/app/backend/actions/pertandingan';
import { getPubSubToken } from '@/app/backend/actions/webpubsub';
import { Numbers, NumbersOutlined, ScaleOutlined, Timer } from '@mui/icons-material';
import { Alert, Autocomplete, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { red } from '@mui/material/colors';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { isNumeric } from '../../utils/numbers';
import SemuaTangkapanDialog from '../semuaTangkapanDialog';


export default function StartedPertandingan({ pancangs, pertandinganId, jenisPertandingan, data = [], tarikhPertandingan }) {
    const [messages, setMessages] = useState(data);
    const [ws, setWs] = useState(null);

    const [openFormDialog, setOpenFormDialog] = useState(false);
    const [snackbarProps, setSnackbarProps] = useState({});

    const [noPancangError, setNoPancangError] = useState('');
    const [fishWeightError, setFishWeightError] = useState('');
    const [timbangError, setTimbangError] = useState('');
    const [timeError, setTimeError] = useState('');
    const [noPancang, setNoPancang] = useState('');
    const [fishWeight, setFishWeight] = useState('');
    const [time, setTime] = useState(null);
    const [timbang, setTimbang] = useState(null);
    const [openSemuaTangkapanDialog, setOpenSemuaTangkapanDialog] = useState(false)

    const [isEnded, setIsEnded] = useState(false);
    const [openIsEndedDialog, setOpenIsEndedDialog] = useState(false)

    const handleOnChangePancang = (e, v) => {
        if (v) {
            setNoPancangError('')
        }
        setNoPancang(v);
    }

    const handleOnChangeFishWeight = (val) => {
        if (!(/^\d*\.?\d*$/.test(val))) return;
        if (fishWeightError && val) setFishWeightError('')
        setFishWeight(val)
    }

    const handleCloseForm = () => {
        setOpenFormDialog(false);
        setNoPancang('');
        setFishWeight('');
        setTimbang(null);
        setTime(null);
    }

    useEffect(() => {
        const connectToWebPubSub = async (retries = 5, delay = 2000) => {
            try {
                const token = await getPubSubToken(process.env.AZURE_WEB_PUB_SUB_CONNECTION_STRING, `pertandingan_${pertandinganId}`);
                const webSocketUrl = token.url;

                const websocket = new WebSocket(webSocketUrl);
                setWs(websocket);

                // Handle incoming messages
                websocket.onmessage = (event) => {
                    const messageData = JSON.parse(event.data);
                    const parsedData = JSON.parse(messageData);
                    if (parsedData?.data && !isEnded) {
                        setMessages(parsedData?.data);
                    } else if (parsedData?.is_ended) {
                        setIsEnded(true);
                        setOpenIsEndedDialog(true);
                    }
                };

                // Handle WebSocket close
                websocket.onclose = () => {
                    console.log('Connection closed');
                    // Attempt to reconnect
                    if (retries > 0) {
                        console.log(`Retrying connection... (${retries} attempts left)`);
                        setTimeout(() => connectToWebPubSub(retries - 1, delay), delay);
                    }
                };

                websocket.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    // Optionally handle error and retry
                    if (retries > 0) {
                        console.log(`Retrying connection... (${retries} attempts left)`);
                        setTimeout(() => connectToWebPubSub(retries - 1, delay), delay);
                    }
                };

            } catch (error) {
                console.error('Connection failed:', error);
                if (retries > 0) {
                    console.log(`Retrying connection... (${retries} attempts left)`);
                    setTimeout(() => connectToWebPubSub(retries - 1, delay), delay);
                }
            }
        };

        connectToWebPubSub();

        // Cleanup WebSocket connection when component unmounts
        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, []);

    const isValidSubmission = () => {
        let valid = true;
        if (!noPancang) {
            setNoPancangError('Sila masukkan nombor pancang.')
            valid = false
        }
        if (!fishWeight) {
            setFishWeightError('Sila masukkan berat ikan.')
            valid = false
        }
        if (!time || !moment(time).isValid()) {
            setTimeError('Sila masukkan waktu.')
            valid = false;
        }
        if (!timbang || ![1, 2, 3, 4, 5, 6, 7, 8].includes(Number(timbang))) {
            setTimbangError('Sila pilih timbang 1-8.')
        }
        return valid
    }

    const handleSubmit = async () => {
        if (isValidSubmission()) {
            insertPertandingLog(noPancang, fishWeight, pertandinganId, timbang, jenisPertandingan, time, tarikhPertandingan).then(res => {
                handleCloseForm();
                setSnackbarProps({
                    open: true,
                    severity: 'success',
                    message: 'Tangkapan telah dikemaskini!'
                })
            }).catch(e => {
                setSnackbarProps({
                    open: true,
                    severity: 'error',
                    message: e?.message
                })
            })
        }
    }

    const handleOnChangeTimbang = (val) => {
        if (val && isNumeric(val)) {
            setTimbang(Number(val))
        } else if (val == "") {
            setTimbang(val)
        }

        if (val == '' || val == null || ![1, 2, 3, 4, 5, 6, 7, 8].includes(Number(val))) {
            setTimbangError('Sila pilih timbang 1-8.')
        } else {
            setTimbangError('');
        }
    }

    const handleClickTamatkanPertandingan = async () => {
        await endPertandingan(pertandinganId)
    }

    const handleOnChangeTime = (time) => {
        if (moment(time).isValid()) setTimeError('');
        setTime(time);
    }

    return <Container maxWidth={'xl'}>
        <Grid container rowSpacing={1} justifyContent={'space-between'} alignItems={'center'}>
            <Grid item xs={6}>
                <Button disabled={isEnded} onClick={() => setOpenFormDialog(true)} variant='contained'>
                    <Typography textTransform={'capitalize'}>Tambah Tangkapan</Typography>
                </Button>
            </Grid>
            {/* <Grid item xs={4} textAlign={'center'}>
                <Button disabled onClick={() => setOpenSemuaTangkapanDialog(true)} color='info' variant='contained'>
                    <Typography textTransform={'capitalize'}>Lihat Semua Tangkapan</Typography>
                </Button>
            </Grid> */}
            <Grid item xs={6} alignItems={'end'} textAlign={'end'}>
                <Button disabled={isEnded} sx={{ bgcolor: red[600], ':hover': { bgcolor: red[700] } }} onClick={() => handleClickTamatkanPertandingan()} variant='contained'>
                    <Typography textTransform={'capitalize'}>Tamatkan Pertandingan</Typography>
                </Button>
            </Grid>
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
                                        <Typography> {row.no}</Typography>
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
        <Dialog open={openFormDialog} maxWidth={'sm'} fullWidth >
            <DialogTitle fontWeight={'bold'}>
                Tambah Tangkapan
            </DialogTitle>
            <DialogContent sx={{ height: '50vh' }}>
                <Grid container sx={{ pt: 2 }} rowSpacing={2}>
                    <Grid item xs={12}>
                        <FormControl fullWidth variant="outlined">
                            <Autocomplete
                                disablePortal
                                autoFocus={true}
                                options={pancangs}
                                value={noPancang}
                                sx={{ width: 300, borderRadius: 2, }}
                                onChange={handleOnChangePancang}
                                renderInput={(params) => <TextField error={noPancangError} autoSelect={true} autoFocus={true} {...params} sx={{ borderRadius: '20px !important' }} label="No. Pancang" />}
                            />
                            <FormHelperText sx={{ color: red[600] }}>{noPancangError}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl variant="outlined">
                            <InputLabel error={fishWeightError} htmlFor="outlined-adornment-password">Berat Ikan</InputLabel>
                            <OutlinedInput
                                sx={{
                                    width: 300
                                }}
                                name='weight'
                                auto type='text' autoComplete='weight'
                                value={fishWeight}
                                onChange={e => handleOnChangeFishWeight(e.target.value)} helperText={fishWeightError} error={fishWeightError} fullWidth label="Username" variant="outlined"
                                startAdornment={
                                    <InputAdornment position='start'>
                                        <IconButton
                                            edge="end"
                                        >
                                            <NumbersOutlined sx={{ color: fishWeightError ? red[600] : 'unset' }} />
                                        </IconButton>
                                    </InputAdornment>
                                }
                                endAdornment={<Typography sx={{ color: fishWeightError ? red[600] : 'unset' }}>kg</Typography>}
                            />
                            <FormHelperText sx={{ color: red[600] }}>{fishWeightError}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl variant="outlined">
                            <InputLabel error={timbangError} htmlFor="outlined-adornment-password">Timbang</InputLabel>
                            <OutlinedInput
                                sx={{
                                    width: 300,
                                }}
                                name='timbang'
                                auto type='text' autoComplete='timbang'
                                value={timbang}
                                onChange={e => handleOnChangeTimbang(e.target.value)} helperText={timbangError} error={timbangError} fullWidth label="Timbang" variant="outlined"
                                startAdornment={
                                    <InputAdornment position='start'>
                                        <IconButton
                                            edge="end"
                                        >
                                            <ScaleOutlined sx={{ color: timbangError ? red[600] : 'unset' }} />
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            <FormHelperText sx={{ color: red[600] }}>{timbangError}</FormHelperText>

                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DemoContainer components={['TimePicker']} sx={{ borderColor: red[600] }}>
                                <TimePicker
                                    error={timeError}
                                    slotProps={{
                                        textField: {
                                            error: timeError,
                                            helperText: timeError,
                                            style: {
                                                color: red[600]
                                            }
                                        },
                                    }}
                                    sx={{ width: 300, }} label="Waktu" onChange={handleOnChangeTime} />
                            </DemoContainer>
                        </LocalizationProvider>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Grid container justifyContent={'end'} columnSpacing={1}>
                    <Grid item xs={'auto'}>
                        <Button onClick={handleCloseForm} variant='outlined'><Typography textTransform={'capitalize'}>Batal</Typography></Button>
                    </Grid>
                    <Grid item xs={'auto'}>
                        <Button onClick={handleSubmit} variant='contained'><Typography textTransform={'capitalize'}>Hantar</Typography></Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
        <Dialog open={openIsEndedDialog} onClose={() => setOpenIsEndedDialog(false)}>
            <DialogTitle fontWeight={'bold'}>Pertandingan Telah Tamat!</DialogTitle>
        </Dialog>
        <SemuaTangkapanDialog open={openSemuaTangkapanDialog} pertandinganId={pertandinganId} tarikhPertandingan={tarikhPertandingan} />
        {snackbarProps?.open ? <Snackbar open={snackbarProps?.open} autoHideDuration={5000} onClose={() => setSnackbarProps({})}>
            <Alert severity={snackbarProps?.severity} variant='filled'>
                {snackbarProps?.message}
            </Alert>
        </Snackbar> : <></>}
    </Container >
}