import { Discount, EmailOutlined, PersonOutline, PhoneOutlined } from '@mui/icons-material';
import { Button, Card, CardContent, CardHeader, Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material';
import { green, grey, red } from '@mui/material/colors';
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
    isDeposit,
    depositAmount,
    totalAmount,
    handleChangeIsDeposit,
    handleChangeDepositAmount,
    depositErrorMessage,
    voucherErrorMessage,
    voucher,
    handleChangeVoucher,
    displayBaucarTelahDitambah
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
                            name='fullName'
                            autoFocus={true} auto type='text' autoComplete='name' value={namaPenuh} onChange={e => handleChangeNamaPenuh(e.target.value)} helperText={namaPenuhErrorMessage} error={namaPenuhErrorMessage} fullWidth label="Nama Penuh" variant="outlined"
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
                                    <IconButton edge="end">
                                        <PhoneOutlined />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        <FormHelperText sx={{ color: red[600] }}>{telefonErrorMessage}</FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox onChange={handleChangeIsDeposit} value={isDeposit} />} label="Pengguna membuat bayaran deposit" />
                    </FormGroup>
                </Grid>
                {isDeposit ? <Grid item xs={12}>
                    <Grid container rowSpacing={2} justifyContent={'center'}>
                        <Grid item xs={12}>
                            <Typography>Nyatakan amaun deposit:</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container columnSpacing={2} rowSpacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel error={depositErrorMessage} htmlFor="deposit">Amaun Deposit</InputLabel>
                                        <OutlinedInput
                                            sx={{
                                                borderRadius: 2
                                            }}
                                            helperText={depositErrorMessage} error={depositErrorMessage}
                                            type='text' value={depositAmount} onChange={e => handleChangeDepositAmount(e.target.value)} fullWidth label="Amaun Deposit" variant="outlined"
                                            startAdornment={
                                                <InputAdornment position='start'>
                                                    <IconButton edge="end">
                                                        <Typography>RM</Typography>
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                        <FormHelperText sx={{ color: red[600] }}>{depositErrorMessage}</FormHelperText>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel htmlFor="deposit">Jumlah Tunggakan</InputLabel>
                                        <OutlinedInput
                                            disabled={true}
                                            sx={{
                                                borderRadius: 2
                                            }}
                                            type='text' value={totalAmount - depositAmount} fullWidth label="Jumlah Tunggakan" variant="outlined"
                                            startAdornment={
                                                <InputAdornment position='start'>
                                                    <IconButton edge="end">
                                                        <Typography>RM</Typography>
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>

                    </Grid>

                </Grid> : <></>}
                <Grid item xs={12}>
                    <Grid container columnSpacing={2}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel error={voucherErrorMessage} htmlFor="voucher">Masukkan Baucar</InputLabel>
                                <OutlinedInput
                                    sx={{
                                        borderRadius: 2
                                    }}
                                    name='voucherCode'
                                    id="voucherCode"
                                    helperText={voucherErrorMessage} error={voucherErrorMessage}
                                    type='text' value={voucher} onChange={e => handleChangeVoucher(e.target.value)} fullWidth label="Masukkan Baucar" variant="outlined"
                                    startAdornment={
                                        <InputAdornment position='start'>
                                            <IconButton edge="end">
                                                <Discount />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                                <FormHelperText sx={{ color: red[600] }}>{voucherErrorMessage}</FormHelperText>
                                {displayBaucarTelahDitambah ? <FormHelperText sx={{ color: green[600] }}>Baucar telah ditambah!</FormHelperText> : <></>}

                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Button onClick={handleNext} variant='contained'>
                        Semak & Hantar
                    </Button>
                </Grid>

            </Grid>
        </CardContent>

    </Card >
}

export default MaklumatBookingManual;