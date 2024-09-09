'use client'
import Button from '@mui/material/Button';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import { blue, cyan, green, red } from '@mui/material/colors';
import { Alert, Avatar, Badge, Box, Card, Checkbox, Container, DialogActions, DialogContent, FormControl, FormControlLabel, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, Snackbar, TextField } from '@mui/material';
import { ArrowBack, BadgeOutlined, CardMembership, CardTravelOutlined, EmailOutlined, FirstPage, Lock, LockOutlined, Password, PasswordOutlined, Person, PersonOutline, PhoneOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import { forgotPassword, login, register } from '../../services/user';
import { UserContext } from '@/app/frontend/contexts/UserContext';
import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingButton } from '@mui/lab';
import { SocialIcon } from 'react-social-icons';

export function LoginComponent() {
    const navigate = useRouter();
    const { getToken } = useContext(UserContext);


    const [isLogin, setIsLogin] = useState(true);
    const [isRegister, setIsRegister] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [namaPertama, setNamaPertama] = useState('');
    const [namaTerakhir, setNamaTerakhir] = useState('');
    const [telefon, setTelefon] = useState('');
    const [email, setEmail] = useState('');

    const [usernameErrorMessage, setUsernameErrorMessage] = useState('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [namaPertamaErrorMessage, setNamaPertamaErrorMessage] = useState('');
    const [namaTerakhirErrorMessage, setNamaTerakhirErrorMessage] = useState('');
    const [telefonErrorMessage, setTelefonErrorMessage] = useState('');
    const [emailErrorMessage, setEmailErrorMessage] = useState('');

    const [snackbarProps, setSnackbarProps] = useState({});

    const [showPassword, setShowPassword] = useState(false);

    const [displaySuccessfulRegister, setDisplaySuccessfulRegister] = useState(false);

    const [loadingLogin, setLoadingLogin] = useState(false);
    const [loadingRegister, setLoadingRegister] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);


    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const invalidName = (val) => {
        return /[^a-zA-Z0-9 ]/.test(val);
    }

    const invalidUsername = val => {
        return /[^a-zA-Z0-9]/.test(val);
    }

    const isValidRegisterForm = () => {
        setLoadingRegister(true);
        let valid = true;
        if (!username) {
            setUsernameErrorMessage('Username perlu diisi')
            valid = false;
        } else if (invalidUsername(username)) {
            setUsernameErrorMessage('Hanya huruf atau nombor boleh digunakan')
            valid = false
        }
        if (!password) {
            setPasswordErrorMessage('Password perlu diisi')
            valid = false;
        }
        if (!namaPertama) {
            setNamaPertamaErrorMessage('Nama pertama perlu diisi')
            valid = false;
        } else if (invalidName(namaPertama)) {
            setNamaPertamaErrorMessage('Hanya huruf atau nombor boleh digunakan')
            valid = false;
        }
        if (!namaTerakhir) {
            setNamaTerakhirErrorMessage('Nama terakhir perlu diisi')
            valid = false;
        } else if (invalidName(namaTerakhir)) {
            setNamaTerakhirErrorMessage('Hanya huruf atau nombor boleh digunakan')
            valid = false;
        }
        if (!telefon) {
            setTelefonErrorMessage('No. telefon perlu diisi')
            valid = false;
        }
        if (!email) {
            setEmailErrorMessage('Email perlu diisi')
            valid = false;
        }
        if (!valid) {
            setLoadingRegister(false)
        }
        return valid;
    }

    const isValidLoginForm = () => {
        setLoadingLogin(true)
        let valid = true;
        if (!username) {
            setUsernameErrorMessage('Username perlu diisi')
            valid = false
        }
        if (!password) {
            setPasswordErrorMessage('Password perlu diisi')
            valid = false;
        }
        if (valid == false) {
            setLoadingLogin(false)
        }
        return valid;
    }

    const isValidForgotPasswordForm = () => {
        let valid = true;
        if (!email) {
            setEmailErrorMessage('Email perlu diisi')
            valid = false;
        }
        return valid;
    }

    const handleSubmit = async (isRegister) => {
        if (isRegister && isValidRegisterForm()) {
            const response = await register({
                username,
                password,
                nama_pertama: namaPertama,
                nama_akhir: namaTerakhir,
                telefon,
                email
            })
            const message = await response.json();
            if (!response.ok) {
                setSnackbarProps({
                    open: true,
                    message: message?.error,
                    background: red[800],
                    severity: 'error'
                })
                setLoadingRegister(false);
            } else {
                setDisplaySuccessfulRegister(true);
                setLoadingRegister(false);
            }
        } else if (!isRegister && isValidLoginForm()) {
            const response = await login({
                username,
                password,
            })
            const message = await response.json();
            if (!response.ok) {
                setSnackbarProps({
                    open: true,
                    message: message?.error,
                    severity: 'error'
                })
                setLoadingLogin(false)
            } else {
                getToken();
                navigate.push('/home')

            }

        }
    }

    const handleOnChangeUsername = (value) => {
        if (value.length > 30) {
            return;
        }
        setUsername(value);
    }

    const handleOnChangePassword = (value) => {
        if (value.length > 39) {
            return;
        }
        setPassword(value);
    }

    const handleForgotPassword = () => {
        if (isValidForgotPasswordForm()) {
            forgotPassword({
                email
            }).then(async res => {
                const message = await res.json();
                if (!res.ok) {
                    setSnackbarProps({
                        open: true,
                        message: message?.error,
                        severity: 'error'
                    })
                } else {
                    setSnackbarProps({
                        open: true,
                        message: 'Email telah dihantar kepada anda untuk reset kataluan, sila ikut arahan pada email tersebut. ',
                        severity: 'success'
                    })
                    setIsLogin(true);
                    setIsRegister(false);
                    setIsForgotPassword(false);
                }

            })
        }
    }

    const handleOnChangeNamaPertama = value => {
        if (value.length > 40) {
            return;
        }
        setNamaPertama(value);
    }

    const handleOnChangeNamaTerakhir = value => {
        if (value.length > 40) {
            return;
        }
        setNamaTerakhir(value);
    }

    const handleOnChangeTelefon = value => {
        if (!(/^[0-9]+$/.test(value)) || value.length > 40) {
            return;
        }
        setTelefon(value);
    }

    const handleOnChangeEmail = value => {
        if (value.length > 50) {
            return;
        }
        setEmail(value);
    }

    const handleCloseSuccessfulRegister = () => {
        setDisplaySuccessfulRegister(false);
        handleClickLogin();
        navigate.push('/')
    }

    const handleClickForgotPassword = () => {
        setIsLogin(false);
        setIsRegister(false);
        setIsForgotPassword(true);
    }

    const handleClickRegister = () => {
        setIsLogin(false);
        setIsRegister(true);
        setIsForgotPassword(false);
    }

    const handleClickLogin = () => {
        setIsLogin(true);
        setIsRegister(false);
        setIsForgotPassword(false);
    }


    return <>
        <Container className='login-component' sx={{ mb: 6 }} maxWidth={'sm'}>
            <Grid container columnSpacing={2} rowSpacing={2}>
                <Grid item xs={12} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src='./logo/logo.png' />
                </Grid>
                {isLogin ? <Grid item xs={12}>
                    <Typography variant='h6' fontWeight={500}>Log Masuk</Typography>
                </Grid> : <></>}
                {isRegister ? <Grid item xs={12}>
                    <Typography variant='h6' fontWeight={500}>Pendaftaran</Typography>
                </Grid> : <></>}

                {isRegister ? <Grid item xs={12} pb={2}>
                    <Typography fontWeight={100}>Sila masukkan maklumat pendaftaran anda.</Typography>
                </Grid> : <></>}

                {isLogin || isRegister ? <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel error={passwordErrorMessage} htmlFor="outlined-adornment-password">Username</InputLabel>
                        <OutlinedInput
                            sx={{
                                borderRadius: 2
                            }}
                            name='username'
                            autoFocus={true} auto type='text' autoComplete='username' value={username} onChange={e => handleOnChangeUsername(e.target.value)} helperText={usernameErrorMessage} error={usernameErrorMessage} fullWidth label="Username" variant="outlined"
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
                    </FormControl>

                </Grid> : <></>}
                {isLogin || isRegister ? <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel error={passwordErrorMessage} htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                            sx={{
                                borderRadius: 2
                            }}
                            id="outlined-adornment-password"
                            value={password}
                            type={showPassword ? 'text' : 'password'}
                            error={passwordErrorMessage}
                            onChange={e => handleOnChangePassword(e?.target?.value)}
                            startAdornment={
                                <InputAdornment position='start'>
                                    <IconButton
                                        edge="end"
                                    >
                                        <LockOutlined />
                                    </IconButton>
                                </InputAdornment>
                            }
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                        />
                        <FormHelperText sx={{ color: red[600] }}>{passwordErrorMessage}</FormHelperText>
                    </FormControl>
                </Grid> : <></>}
                <Grid item xs={12}>
                    <Grid container alignItems={'center'} justifyContent={'space-between'} rowSpacing={2}>
                        {isLogin ? <Grid item xs={12}>
                            <LoadingButton size='large' loading={loadingLogin} variant='contained' fullWidth onClick={() => handleSubmit(false)}>Login</LoadingButton>
                        </Grid> : <></>}
                        {isLogin ? <Grid item xs={6} sx={{ cursor: 'pointer' }}>
                            <FormControlLabel control={<Checkbox defaultChecked />} label={<Typography color={'primary'} sx={{ fontWeight: '500', }}>
                                Ingat saya
                            </Typography>} />
                        </Grid> : <></>}


                        {isRegister ? <Grid item xs={12} onClick={() => handleSubmit(true)} sx={{ cursor: 'pointer' }}>
                            <LoadingButton size='large' loading={loadingRegister} variant='contained' fullWidth>
                                <Typography sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                                    Register
                                </Typography>
                            </LoadingButton>
                        </Grid> : <></>}
                        {isForgotPassword ? <Grid item xs={12} onClick={() => handleForgotPassword()} sx={{ cursor: 'pointer' }}>
                            <LoadingButton size='large' loading={loadingRegister} variant='contained' fullWidth>
                                <Typography sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                                    Hantar
                                </Typography>
                            </LoadingButton>
                        </Grid> : <></>}
                        {isRegister || isForgotPassword ? <Grid item onClick={() => handleClickLogin()} sx={{ cursor: 'pointer' }}>
                            <Button size='large' startIcon={<ArrowBack />} variant='outlined' sx={{ textTransform: 'capitalize' }}>
                                <Typography sx={{ fontWeight: 'bold', }}>
                                    Kembali ke Login
                                </Typography>
                            </Button>
                        </Grid> : <></>}
                        <Grid item xs={12} display={'flex'} justifyContent={'center'} textAlign={'center'} alignItems={'center'}>
                            <Grid container justifyContent={'center'} textAlign={'center'}>
                                <Grid item xs="auto">
                                    <SocialIcon network='facebook' url='https://www.facebook.com/profile.php?id=61563728548244&mibextid=JRoKGi' />
                                </Grid>
                                <Grid item xs="auto">
                                    <SocialIcon network='tiktok' url='https://www.tiktok.com/@kolampaklongmatsen?_t=8pXTzfCd03c&_r=1' />
                                </Grid>
                                <Grid item xs="auto">
                                    <a href="https://maps.app.goo.gl/bomXiZ63vkhgRWZEA"><img width={"50px"} height={"50px"} src="/images/google_map.png" /></a>

                                </Grid>
                            </Grid>

                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
        <Snackbar
            open={snackbarProps?.open}
            autoHideDuration={6000}
            onClose={() => setSnackbarProps({})}
        >
            <Alert sx={{ display: 'flex', alignItems: 'center' }} variant="filled" severity={snackbarProps?.severity}>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography>
                            {snackbarProps?.message}
                        </Typography>
                    </Grid>
                </Grid>
            </Alert>
        </Snackbar>
        <Dialog onClose={() => handleCloseSuccessfulRegister()} open={displaySuccessfulRegister}>
            <DialogTitle>
                Pendaftaran telah berjaya!
            </DialogTitle>
            <DialogContent>
                E-mail verifikasi telah dihantar pada anda. Sila buat verifikasi untuk login.
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleCloseSuccessfulRegister()}>Ok</Button>
            </DialogActions>
        </Dialog>
    </>
}