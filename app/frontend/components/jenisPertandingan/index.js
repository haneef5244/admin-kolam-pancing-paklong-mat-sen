'use client';
import { Alert, Button, Chip, Container, FormControl, Grid, InputLabel, MenuItem, Select, Snackbar, Typography, styled } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getAllPertandingan, updateJenisPertandingan, updatePoster } from '../../services/pertandingan';
import BasicTable from '../basicTable';
import moment from 'moment';
import { CloudUpload } from '@mui/icons-material';
import SimpleDialog from '../simpleDialog';

const generateHeaders = () => {
    return [
        {
            props: {},
            value: 'Tarikh Pertandingan',
        },
        {
            props: { sx: { textAlign: 'center' } },
            value: 'Jenis Pertandingan'
        },
        {
            props: { sx: { textAlign: 'center' } },
            value: 'Upload Poster'
        }
    ]
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const JenisPertandingan = () => {
    // State to hold raw pertandingan data
    const [pertandingan, setPertandingan] = useState([]);
    const [snackbarProps, setSnackbarProps] = useState({});
    const [deletePosterProps, setDeletePosterProps] = useState({});
    const [loadingTable, setLoadingTable] = useState(false);

    const handleChangeJenis = async (e, id) => {
        let update = {};
        const newPertandingans = pertandingan.map((p) => {
            if (p.id === id) {
                update = {
                    ...p,
                    jenis: e.target.value // Update the jenis in the actual pertandingan data
                }
                return update;
            }
            return p;
        });
        setPertandingan(newPertandingans);
        updateJenisPertandingan(update).then(res => {
            setSnackbarProps({
                open: true,
                message: 'Kemaskini berjaya!',
                severity: 'success'
            })
        });
    };

    const handleChangePoster = async (e, id, tarikh) => {
        if (!['image/jpeg', 'image/png', 'image/jpg'].includes(e?.[0]?.type)) {
            setSnackbarProps({
                open: true,
                message: 'Hanya .jpeg/.jpg/.png dibenarkan.',
                severity: 'error',
            })
            return;
        }

        let formData = new FormData();
        formData.append('file', e?.[0]);
        formData.append('id', id);
        updatePoster(formData).then(async res => {
            const message = await res.json();

            if (res?.ok) {
                setSnackbarProps({
                    message: `Poster untuk tarikh ${moment(tarikh).format('Do MMM YYYY')} berjaya dikemaskini!`,
                    severity: 'success',
                    open: true
                })
                await refreshData();
            } else {
                setSnackbarProps({
                    message: message?.error,
                    severity: 'error',
                    open: true
                })
            }
        });
    }

    const handleDeleteConfirmation = (id, tarikh, poster) => {
        setDeletePosterProps({
            open: true,
            title: 'Anda setuju untuk padam poster ini?',
            id,
            tarikh,
            content: <Grid container>
                <Grid item xs={12}>
                    Anda telah pilih untuk padam poster berikut
                </Grid>
                <Grid item xs={12} pt={2}>
                    Nama Poster:
                </Grid>
                <Grid item xs={12}>
                    <Typography fontWeight={'bold'}>{poster}</Typography>
                </Grid>
                <Grid item xs={12} pt={1}>
                    Tarikh Pertandingan:
                </Grid>
                <Grid item xs={12}>
                    <Typography fontWeight={'bold'}>
                        {moment(tarikh).format('Do MMM YYYY')}
                    </Typography>
                </Grid>
            </Grid >
        })
    }

    const submitDelete = () => {
        let formData = new FormData();
        formData.append('file', '');
        formData.append('id', deletePosterProps?.id);
        const tarikh = pertandingan.filter(e => e?.id == deletePosterProps?.id)?.[0]?.tarikh
        setDeletePosterProps({})
        updatePoster(formData).then(async res => {
            const message = await res.json();

            if (res?.ok) {
                setSnackbarProps({
                    message: `Poster untuk tarikh ${moment(tarikh).format('Do MMM YYYY')} berjaya dikemaskini!`,
                    severity: 'success',
                    open: true
                })
                await refreshData();
            } else {
                setSnackbarProps({
                    message: message?.error,
                    severity: 'error',
                    open: true
                })
            }
        });
    }

    const formatRows = (pertandinganData) => {
        return pertandinganData.map(i => [
            {
                props: {},
                value: moment(i.tarikh).format('Do MMM YYYY'),
                id: i.id
            },
            {
                props: { sx: { textAlign: 'center' } },
                value: (
                    <FormControl sx={{ minWidth: '230px' }}>
                        <InputLabel id={`select-${i.id}`}>Pilih Jenis Pertandingan</InputLabel>
                        <Select
                            labelId={`select-${i.id}`}
                            id={`select-${i.id}`}
                            value={i.jenis}
                            label="Pilih Jenis Pertandingan"
                            onChange={(e) => handleChangeJenis(e, i.id)}
                        >
                            <MenuItem value={'OPEN'}>Open</MenuItem>
                            <MenuItem value={'RANK'}>Rank</MenuItem>
                        </Select>
                    </FormControl>
                ),
                id: i.id
            },
            {
                props: { sx: { textAlign: 'center' } },
                value: !i?.poster_url ? (
                    <FormControl sx={{ minWidth: '230px' }}>
                        <Button
                            component="label"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            startIcon={<CloudUpload />}
                        >
                            Upload files
                            <VisuallyHiddenInput
                                type="file"
                                onChange={(event) => handleChangePoster(event.target.files, i?.id, i?.tarikh)}
                                multiple
                            />
                        </Button>
                    </FormControl>
                ) : <Chip label={i.poster_url} onDelete={() => handleDeleteConfirmation(i?.id, i?.tarikh, i?.poster_url)} />,
                id: i.id
            },
        ]);
    }

    const refreshData = async (setLoadingData) => {
        if (setLoadingData) setLoadingTable(true);
        getAllPertandingan().then(async res => {
            const message = await res.json();
            setPertandingan(message?.data ?? []);
            setLoadingTable(false);
        });
    }

    useEffect(() => {
        refreshData(true);
    }, []);

    return (
        <Container maxWidth={'xl'}>
            <BasicTable loading={loadingTable} headers={generateHeaders()} rows={formatRows(pertandingan)} />
            <Snackbar open={snackbarProps?.open} autoHideDuration={5000} onClose={() => setSnackbarProps({})}>
                <Alert severity={snackbarProps?.severity} variant='filled'>
                    {snackbarProps?.message}
                </Alert>
            </Snackbar>
            {deletePosterProps?.open ?
                <SimpleDialog open={deletePosterProps?.open} title={deletePosterProps?.title} content={deletePosterProps?.content} handleClose={() => setDeletePosterProps({})} handleOk={submitDelete} />
                : <></>}
        </Container>
    );
}

export default JenisPertandingan;
