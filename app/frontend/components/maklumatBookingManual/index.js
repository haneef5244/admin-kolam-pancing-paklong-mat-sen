import { EmailOutlined, PersonOutline, PhoneOutlined } from '@mui/icons-material';
import { Button, Card, CardContent, CardHeader, FormControl, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material';
import { grey, red } from '@mui/material/colors';
import React from 'react';

const MaklumatBookingManual = ({
    handleChangeNamaPenuh,
    namaPenuh,
    namaPenuhErrorMessage = '',
    handleChangeEmail,
    email,
    emailErrorMessage = '',
    handleChangeTelefon,
    telefon,
    telefonErrorMessage = '',
    handleNext,
}) => {

    return <Card sx={{ boxShadow: 'none', border: `1px solid ${grey[400]}` }}>
        <CardHeader title="Maklumat Pengguna" />
        <CardContent>
            <Grid container rowSpacing={2}>

                <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel error={namaPenuhErrorMessage} htmlFor="outlined-adornment-password">Nama Penuh</InputLabel>
                        <OutlinedInput
                            sx={{
                                borderRadius: 2
                            }}
                            name='username'
                            autoFocus={true} auto type='text' autoComplete='username' value={namaPenuh} onChange={e => handleChangeNamaPenuh(e.target.value)} helperText={namaPenuhErrorMessage} error={namaPenuhErrorMessage} fullWidth label="Nama Penuh" variant="outlined"
                            startAdornment={
                                <InputAdornment position='start'>
                                    <IconButton
                                        edge="end"
                                    >
                                        <PersonOutline />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        <FormHelperText sx={{ color: red[600] }}>{namaPenuhErrorMessage}</FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel error={emailErrorMessage} htmlFor="email">Email</InputLabel>
                        <OutlinedInput
                            sx={{
                                borderRadius: 2
                            }}
                            name='email'
                            id="email"
                            auto type='text' autoComplete='email' value={email} onChange={e => handleChangeEmail(e.target.value)} helperText={emailErrorMessage} error={emailErrorMessage} fullWidth label="Email" variant="outlined"
                            startAdornment={
                                <InputAdornment position='start'>
                                    <IconButton
                                        edge="end"
                                    >
                                        <EmailOutlined />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        <FormHelperText sx={{ color: red[600] }}>{emailErrorMessage}</FormHelperText>

                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel error={telefonErrorMessage} htmlFor="email">No. Telefon</InputLabel>
                        <OutlinedInput
                            sx={{
                                borderRadius: 2
                            }}
                            name='tel'
                            type='text' autoComplete='tel' value={telefon} onChange={e => handleChangeTelefon(e.target.value)} helperText={telefonErrorMessage} error={telefonErrorMessage} fullWidth label="No. Telefon" variant="outlined"
                            startAdornment={
                                <InputAdornment position='start'>
                                    <IconButton
                                        edge="end"
                                    >
                                        <PhoneOutlined />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        <FormHelperText sx={{ color: red[600] }}>{telefonErrorMessage}</FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Button onClick={handleNext} variant='contained'>
                        Semak & Hantar
                    </Button>
                </Grid>
            </Grid>
        </CardContent>

    </Card>
}

export default MaklumatBookingManual;