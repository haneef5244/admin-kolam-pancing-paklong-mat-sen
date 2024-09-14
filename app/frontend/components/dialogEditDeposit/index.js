import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, Typography } from '@mui/material';
import React, { useState } from 'react';
import { isNumeric } from '../../utils/numbers';
import { red } from '@mui/material/colors';

const DialogEditDeposit = ({ open, booking, handleClose, handleSubmit }) => {
    const [bayaranTambahan, setBayaranTambahan] = useState(0);
    const [bayaranTambahanErrorMessage, setBayaranTambahanErrorMessage] = useState('');

    const handleOnChangeBayaranTambah = e => {
        if (isNumeric(e?.target?.value)) {
            if (((e?.target?.value ? Number(e?.target?.value) : 0) + booking?.deposit_amount) > booking?.amount) {
                setBayaranTambahanErrorMessage('Tunggakan tidak boleh kurang daripada RM 0')
            } else {
                setBayaranTambahanErrorMessage('');
            }
            setBayaranTambahan(e?.target?.value)
        }
        return;
    }

    const onClickSubmit = () => {
        if (!bayaranTambahanErrorMessage) {
            handleSubmit(bayaranTambahan, booking);
        }
    }

    return <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
            <Typography>Kemaskini Maklumat Pembayaran Manual</Typography>
        </DialogTitle>
        <DialogContent >
            <Grid container rowSpacing={2}>
                <Grid item xs={12} mt={2}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Amaun Yang Dibayar Setakat Ini</InputLabel>
                        <OutlinedInput
                            disabled
                            sx={{
                                borderRadius: 2
                            }}
                            autoFocus={true} auto type='text' value={booking?.deposit_amount} fullWidth label="Amaun Yang Dibayar Setakat Ini" variant="outlined"
                            startAdornment={
                                <InputAdornment position='start'>
                                    <IconButton
                                        edge="end"
                                    >
                                        <Typography>RM</Typography>
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel error={bayaranTambahanErrorMessage} htmlFor="outlined-adornment-password">Nyatakan Amaun Bayaran Baru</InputLabel>
                        <OutlinedInput
                            error={bayaranTambahanErrorMessage}
                            sx={{
                                borderRadius: 2
                            }}
                            autoFocus={true} auto type='text' value={bayaranTambahan} onChange={handleOnChangeBayaranTambah} fullWidth label="Nyatakan Amaun Bayaran Baru" variant="outlined"
                            startAdornment={
                                <InputAdornment position='start'>
                                    <IconButton
                                        edge="end"
                                    >
                                        <Typography>RM</Typography>
                                    </IconButton>
                                </InputAdornment>
                            }

                        />
                        <FormHelperText sx={{ color: red[600] }}>{bayaranTambahanErrorMessage}</FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Baki Tunggakan</InputLabel>
                        <OutlinedInput
                            disabled
                            sx={{
                                borderRadius: 2
                            }}
                            autoFocus={true} auto type='text' value={booking?.amount - booking?.deposit_amount - bayaranTambahan} fullWidth label="Baki Tunggakan" variant="outlined"
                            startAdornment={
                                <InputAdornment position='start'>
                                    <IconButton
                                        edge="end"
                                    >
                                        <Typography>RM</Typography>
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
            <Grid container justifyContent={'end'} columnSpacing={2}>
                <Grid item xs="auto">
                    <Button variant='outlined' onClick={handleClose}>
                        Batal
                    </Button>

                </Grid>
                <Grid item xs="auto">
                    <Button variant='contained' onClick={onClickSubmit}>
                        Hantar
                    </Button>
                </Grid>
            </Grid>
        </DialogActions>
    </Dialog>
}

export default DialogEditDeposit;