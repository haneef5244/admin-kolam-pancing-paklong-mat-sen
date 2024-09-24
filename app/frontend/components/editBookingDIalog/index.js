import { updateBooking } from '@/app/backend/actions/booking';
import { getKolams } from '@/app/backend/actions/kolam';
import { Add, RemoveCircle, UndoOutlined } from '@mui/icons-material';
import { Alert, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, Snackbar, Typography } from '@mui/material';
import { red } from '@mui/material/colors';
import { set } from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';

const EditBookingDialog = ({ data, handleSubmitSuccess, handleClose }) => {
    const [tempData, setTempData] = useState({});
    const [pancangToDelete, setPancangToDelete] = useState([]);
    const [pancangToAdd, setPancangToAdd] = useState([]);
    const [kolamData, setKolamData] = useState([]);
    const [snackbarProps, setSnackbarProps] = useState({});

    useEffect(() => {
        if (data?.open) {
            setTempData(data);
            getKolams(data?.tarikh).then(resp => {
                setKolamData(JSON.parse(resp));
            });
        }
    }, [data]);


    const handleClickDeletePancang = (pancang) => {
        setPancangToDelete(prev => [...prev, pancang]);
        setTempData(prev => ({
            ...prev,
            kolam_booking_kolams: prev.kolam_booking_kolams.filter(p =>
                !(p.kolam_booking_pancang.value === pancang.kolam_booking_pancang.value && p.kolam_id === pancang.kolam_id)
            )
        }));
    };

    const handleClickUndoDeletePancang = (pancang) => {
        setTempData(prev => ({
            ...prev,
            kolam_booking_kolams: [...prev.kolam_booking_kolams, pancang]
        }));
        setPancangToDelete(prev => prev.filter(p =>
            !(p.kolam_booking_pancang.value === pancang.kolam_booking_pancang.value && p.kolam_id === pancang.kolam_id)
        ));
    };

    const handleClickAddNewPancang = () => {
        setPancangToAdd(prev => [...prev, { kolam_id: null, pancang: null }]);
    };

    const handleDeleteNewPancang = (index) => {
        setPancangToAdd(prev => prev.filter((_, i) => i !== index));
    };

    const handleChangeSelectedKolam = (e, v, i) => {
        if (v?.props?.value) {
            const newPancang = [...pancangToAdd];
            newPancang[i].kolam_id = v.props.value;
            debugger
            newPancang[i].possible_pancangs = kolamData.find(kd => kd.id === v.props.value)?.pancangs || [];
            setPancangToAdd(newPancang);
        }
    };

    const handleChangeSelectPancang = (e, v, i) => {
        if (v?.props?.value) {
            const newPancang = [...pancangToAdd];
            newPancang[i].pancang = v.props.value;
            setPancangToAdd(newPancang);
        }
    };

    const isValidSubmission = () => {
        let isValid = true;
        if (tempData?.kolam_booking_kolams.length == 0 && pancangToAdd.length == 0) {
            isValid = false;
        }
        let newPancangToAdd = [...pancangToAdd];
        for (let pa of newPancangToAdd) {
            if (!pa?.kolam_id || !pa?.pancang?.value) {
                pa.errorMessage = 'Sila pilih kolam dan pancang'
                isValid = false;
            } else {
                pa.errorMessage = ''
            }
        }
        setPancangToAdd(newPancangToAdd);
        return isValid;
    }

    const handleClickSubmit = async () => {
        if (isValidSubmission()) {
            updateBooking(data?.id, data?.tarikh, pancangToAdd, pancangToDelete).then(resp => {
                handleSubmitSuccess();
            }).catch(e => {
                setSnackbarProps({
                    open: true,
                    severity: 'error',
                    message: e.message
                })
            })
        }
    }

    return (
        <Dialog open={data?.open} onClose={data?.onClose}>
            <DialogTitle>Kemaskini Tempahan</DialogTitle>
            <DialogContent>
                <Grid container rowSpacing={1}>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Typography fontWeight={'bold'}>ID</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography>{data?.id}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid container rowSpacing={1} pt={2}>
                    <Grid item xs={12}>
                        <Typography fontWeight={'bold'}>Pancang Yang Ditempah</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid container columnSpacing={1} rowSpacing={1}>
                                {tempData?.kolam_booking_kolams?.map(kbk => (
                                    <Grid item xs="auto" key={kbk.id}>
                                        <Chip onDelete={() => handleClickDeletePancang(kbk)} label={`Kolam ${kbk?.kolam_id} - ${kbk.kolam_booking_pancang?.value}`} />
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                {pancangToDelete.length > 0 && (
                    <Grid container rowSpacing={1} pt={2}>
                        <Grid item xs={12}>
                            <Typography fontWeight={'bold'}>Pancang Yang Ingin Dibuang Dari Tempahan</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid container columnSpacing={1} rowSpacing={1}>
                                    {pancangToDelete.map(kbk => (
                                        <Grid item xs="auto" key={kbk.id}>
                                            <Chip deleteIcon={<UndoOutlined />} onDelete={() => handleClickUndoDeletePancang(kbk)} label={`Kolam ${kbk?.kolam_id} - ${kbk.kolam_booking_pancang?.value}`} />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                )}

                <Grid container rowSpacing={1} pt={2}>
                    <Grid item xs={12}>
                        <Typography fontWeight={'bold'}>Tambahan Pancang Baru Untuk Tempahan</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Button onClick={handleClickAddNewPancang} variant='contained' startIcon={<Add />}><Typography textTransform={'capitalize'}>Tambah Pancang</Typography></Button>
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <Grid container columnSpacing={1} rowSpacing={2}>
                            {pancangToAdd.map((p, i) => (
                                <Grid item xs={12} key={i}>
                                    <Grid container columnSpacing={2}>
                                        <Grid item xs={5}>
                                            <FormControl fullWidth>
                                                <InputLabel size='small' id={`kolam-label-${i}`}>Kolam</InputLabel>
                                                <Select
                                                    error={p.errorMessage}
                                                    size='small'
                                                    fullWidth
                                                    labelId={`kolam-label-${i}`}
                                                    id={`kolam-select-${i}`}
                                                    value={p.kolam_id}
                                                    label="Kolam"
                                                    onChange={(e, v) => handleChangeSelectedKolam(e, v, i)}
                                                >
                                                    {kolamData.map(kolam => (
                                                        <MenuItem key={kolam.id} value={kolam.id}>Kolam {kolam.label}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={5}>
                                            <FormControl fullWidth>
                                                <InputLabel size='small' id={`pancang-label-${i}`}>Pancang</InputLabel>
                                                <Select
                                                    error={p.errorMessage}
                                                    disabled={p?.possible_pancangs?.length == 0}
                                                    size='small'
                                                    fullWidth
                                                    labelId={`pancang-label-${i}`}
                                                    id={`pancang-select-${i}`}
                                                    value={p.pancang?.value}
                                                    label="Pancang"
                                                    onChange={(e, v) => handleChangeSelectPancang(e, v, i)}
                                                >
                                                    {p.possible_pancangs?.map(pancang => (
                                                        <MenuItem key={pancang.id} value={pancang}>{pancang.value}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Button onClick={() => handleDeleteNewPancang(i)}><RemoveCircle /></Button>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormHelperText sx={{ color: red[600] }}>{p.errorMessage}</FormHelperText>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Grid container justifyContent={'end'} columnSpacing={1}>
                    <Grid item xs="auto">
                        <Button onClick={handleClose} variant='outlined'>
                            <Typography textTransform={'capitalize'}>Batal</Typography>
                        </Button>
                    </Grid>
                    <Grid item xs="auto">
                        <Button onClick={() => handleClickSubmit()} variant='contained'>
                            <Typography textTransform={'capitalize'}>Hantar</Typography>
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
            {snackbarProps?.open ? <Snackbar open={snackbarProps?.open} autoHideDuration={5000} onClose={() => setSnackbarProps({})}>
                <Alert severity={snackbarProps?.severity} variant='filled'>
                    {snackbarProps?.message}
                </Alert>
            </Snackbar> : <></>}
        </Dialog>
    );
};

export default EditBookingDialog;
