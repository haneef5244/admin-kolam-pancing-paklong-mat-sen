'use client';
import { Alert, Box, Button, ButtonGroup, Card, CardContent, Chip, Container, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Snackbar, TextField, Typography, styled } from '@mui/material';
import React, { useEffect, useState } from 'react';
import BasicTable from '../frontend/components/basicTable';
import { deleteReceiptForBooking, getAllBookings, getReceiptForBooking, updateDepositForBooking, updateReceiptForBooking } from '../frontend/services/booking';
import moment from 'moment';
import { blue, green, orange, red, yellow } from '@mui/material/colors';
import MultipleSelectChip from '../frontend/components/multipleSelectChip';
import { isNumeric } from '../frontend/utils/numbers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers';
import { LoadingButton } from '@mui/lab';
import { CloudUpload, Delete, Download, Edit, Receipt, Upload } from '@mui/icons-material';
import GenerateInvoice from '../frontend/components/invoice';
import { saveAs } from 'file-saver'
import { getQR } from '../backend/actions/booking/get-qr';
import { pdf } from '@react-pdf/renderer'
import DialogEditDeposit from '../frontend/components/dialogEditDeposit';


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


const generateHeaders = () => {
    return [
        {
            props: {},
            value: 'Id'
        },
        {
            props: {},
            value: 'Kolam'
        },
        {
            props: {},
            value: 'Tarikh Pancing',
        },
        {
            props: {},
            value: 'Pancang'
        },
        {
            props: {},
            value: 'Add Ons'
        },
        {
            props: {},
            value: 'Amaun'
        },
        {
            props: {},
            value: 'Bayaran Telah Dibuat'
        },
        {
            props: {},
            value: 'Tunggakan Bayaran'
        },
        {
            props: {},
            value: 'Maklumat Pengguna'
        },
        {
            props: {},
            value: 'Status',
        },
        {
            props: {},
            value: 'Jenis Booking',
        },
        {
            props: {},
            value: 'Tarikh Booking'
        },
        {
            props: { sx: { width: 250, textAlign: 'center' } },
            value: 'Muat Turun Resit'
        },
        {
            props: { sx: { width: 300, textAlign: 'center' } },
            value: 'Muat Naik Resit Pembayaran Manual'
        }
    ]
}

const generatePaymentChip = (status) => {
    if (status == 'CANCELLED') {
        return <Chip sx={{ background: red[500], color: '#ffffff' }} label={status} />
    }
    else if (status == 'PAID') {
        return <Chip sx={{ background: green[500], color: '#ffffff' }} label={status} />
    } else if (status == 'PENDING') {
        return <Chip sx={{ background: yellow[800], color: '#ffffff' }} label={status} />
    } else if (status == 'CREATED') {
        return <Chip sx={{ background: blue[800], color: '#ffffff' }} label={status} />
    } else if (status == 'PENDING_PAYMENT') {
        return <Chip sx={{ background: orange[800], color: '#ffffff' }} label={'PENDING PAYMENT'} />
    }
}


const BookingPengguna = props => {
    const [data, setData] = useState([]);
    const [filterProps, setFilterProps] = useState({
        bookingId: '',
        paymentStatus: [],
        kolam: [],
        tarikh: null,
    });
    const [loadingTable, setLoadingTable] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogProps, setDialogProps] = useState({
        title: '',
        content: '',
        onOk: () => { },
    })
    const [snackbarProps, setSnackbarProps] = useState({
        open: false,
        message: '',
        severity: ''
    })

    const [openDialogEditDeposit, setOpenDialogEditDeposit] = useState(false);
    const [openDialogEditDepositBooking, setOpenDialogEditDepositBooking] = useState(false);

    const handleDownloadReceipt = async (d) => {

        let sasUrl = await getQR(d?.user?.id, d?.id, d?.tarikh, d?.qr_link_file_name);
        let items = []
        for (let p of d?.pancangs ?? []) {
            items.push({
                description: `Pancang ${p?.nombor}`,
                price: 'RM 90'
            })
        }
        for (let ao of d?.add_ons ?? []) {
            if (ao?.quantity) {
                items.push({
                    description: ao?.type == 'AIR_MINERAL' ? 'Air Mineral' : '',
                    price: `RM ${2 * ao?.quantity}`
                })
            }
        }
        let invoice = {
            invoice_number: `#${d?.id}`,
            date: d?.is_manual ? moment(d?.created_on).format('DD MMM YYYY HH:mm:ss') : moment(d?.payment?.transaction_time).format('Do MMM YYYY HH:mm:ss'),
            tarikh_pancing: moment(d?.tarikh).format('DD MMM YYYY'),
            kolam: d?.kolam_id,
            qr_url: sasUrl,
            client_name: d?.is_manual ? d?.manual_booking?.nama_penuh : `${d?.user?.nama_pertama} ${d?.user?.nama_akhir}`,
            email: d?.is_manual ? d?.manual_booking?.email : d?.user?.email,
            telefon: d?.is_manual ? d?.manual_booking?.telefon : d?.user?.telefon,
            items,
            total: `RM ${d?.amount}`
        }
        const blob = await pdf(<GenerateInvoice invoice={invoice} />).toBlob()
        saveAs(blob, `Resit ${d?.is_manual ? d?.manual_booking?.nama_penuh : `${d?.user?.nama_pertama} ${d?.user?.nama_akhir}`}.pdf`)
    }

    const handleSubmitDelete = async (booking, fileName) => {
        await deleteReceiptForBooking({ fileName: encodeURIComponent(fileName), id: booking?.id });
        setOpenDialog(false)
        setDialogProps({})
        await getData();
    }

    const handleDeleteReceipt = (booking, fileName) => {
        setDialogProps({
            title: 'Anda Ingin Buang Resit Ini',
            content: <Grid container rowSpacing={2}>
                <Grid item xs={12}><Typography fontWeight={'bold'}>{fileName}</Typography></Grid>
                <Grid item xs={12}><Typography>untuk Booking ID {booking.id}</Typography></Grid>
                <Grid item xs={12}><Typography>Klik Setuju untuk teruskan hantaran.</Typography></Grid>
            </Grid>,
            onOk: () => handleSubmitDelete(booking, fileName)
        })
        setOpenDialog(true)
    }

    const handleClickEditDeposit = booking => {
        setOpenDialogEditDeposit(true);
        setOpenDialogEditDepositBooking(booking);
    }

    const handleClickManualReceipt = async (fileName) => {
        const data = await getReceiptForBooking(encodeURIComponent(fileName));
        const message = await data.json();
        fetch(message?.url).then(resp => {
            return resp.blob();
        }).then(blob => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement("a");
            link.href = url;
            link.download = fileName || "downloaded-file";
            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        })


    }

    const getData = async (applyFilter) => {
        let newFilterProps = { ...filterProps, paymentStatus: filterProps?.paymentStatus.map(e => e == 'PENDING PAYMENT' ? 'PENDING_PAYMENT' : e) }
        getAllBookings(applyFilter ? newFilterProps : {}).then(async resp => {
            setLoadingTable(true);
            const message = await resp?.json()
            const newData = [];
            for (let d of message?.data) {
                let colData = []
                colData.push({
                    props: { sx: { width: '200px' } },
                    value: d?.id
                })
                colData.push({
                    props: {},
                    value: d?.kolam_id
                })
                colData.push({
                    props: { sx: { minWidth: '200px' } },
                    value: moment(d?.tarikh).format('Do MMMM YYYY')
                })
                colData.push({
                    props: { sx: { minWidth: '200px' } },
                    value: <Grid container columnSpacing={2} rowSpacing={2}>
                        {d?.pancangs?.map(pancang => <Grid item xs="auto">
                            <Chip label={pancang?.nombor} />
                        </Grid>)}
                    </Grid>
                })
                colData.push({
                    props: { sx: { minWidth: '200px' } },
                    value: <Grid container>
                        {d?.add_ons.map(ao => <Grid item xs="12">
                            <Typography textTransform={'capitalize'}>{ao?.type?.replace('_', ' ')} x {ao?.quantity}</Typography>
                        </Grid>)}
                    </Grid>
                })
                colData.push({
                    props: { sx: { minWidth: '150px' } },
                    value: `RM ${d?.amount}`
                })
                colData.push({
                    props: { sx: { minWidth: '150px', textAlign: 'center' } },
                    value: d?.payment_status == 'PENDING_PAYMENT' ? <Button onClick={() => handleClickEditDeposit(d)} startIcon={<Edit />}>RM {d?.deposit_amount}</Button> : '-'
                })
                colData.push({
                    props: { sx: { minWidth: '150px', textAlign: 'center' } },
                    value: d?.payment_status == 'PENDING_PAYMENT' ? `RM ${d?.amount - d?.deposit_amount}` : '-'
                })
                colData.push({
                    props: {},
                    value: <Grid container>
                        <Grid item xs={12}>
                            <Typography>{d?.is_manual ? d?.manual_booking?.nama_penuh : `${d?.user?.nama_pertama} ${d?.user?.nama_akhir}`}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>{d?.is_manual ? d?.manual_booking?.email : d?.user?.email}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>{d?.is_manual ? d?.manual_booking?.telefon : d?.user?.telefon}</Typography>
                        </Grid>
                    </Grid>
                })
                colData.push({
                    props: {},
                    value: generatePaymentChip(d?.payment_status)
                })
                colData.push({
                    props: {},
                    value: d?.is_manual ? 'Manual' : 'Sistem'
                })
                colData.push({
                    props: { width: 200 },
                    value: moment(d?.created_on).format('Do MMMM YYYY, h:mm:ss a')
                })
                colData.push({
                    props: { sx: { minWidth: 250, textAlign: 'center' } },
                    value: d?.payment_status == 'PAID' ? <Button startIcon={<Download />} variant='outlined' onClick={() => handleDownloadReceipt(d)}>Muat turun resit</Button> : <></>
                })
                colData.push({
                    props: { sx: { minWidth: 300, } },
                    value: d?.is_manual ? <Grid container rowSpacing={2}>
                        {d?.manual_receipts.map(e => <Grid item xs={12}>
                            <Chip onClick={() => handleClickManualReceipt(e?.receipt)} label={e?.receipt} onDelete={() => handleDeleteReceipt(d, e?.receipt)} />
                        </Grid>)}
                        <Grid item xs={12}>
                            <LoadingButton
                                component="label"
                                role={undefined}
                                variant="contained"
                                loading={uploading}
                                tabIndex={-1}
                                startIcon={<CloudUpload />}
                            >
                                Muat Naik Resit Bayaran
                                <VisuallyHiddenInput
                                    type="file"
                                    onChange={(event) => handleUploadReceipt(event.target.files, d)}
                                    multiple
                                />
                            </LoadingButton>
                        </Grid>
                    </Grid> : <></>
                })
                newData.push(colData);
            }
            setData(newData);
            setLoadingTable(false);
        })
    }
    useEffect(() => {
        getData(false)
    }, [])

    const onChangeBookingId = (e) => {
        if (e?.target?.value == '' || isNumeric(e?.target?.value)) {
            setFilterProps({
                ...filterProps,
                bookingId: e?.target?.value
            })
        } else {
            return
        }
    }

    const handleApplyFilter = async () => {
        await getData(true);
    }

    const handleChangePaymentStatus = (event) => {
        const {
            target: { value },
        } = event;
        setFilterProps({
            ...filterProps,
            paymentStatus: typeof value === 'string' ? value.split(',') : value,
        })
    };

    const handleChangeKolam = (event) => {
        const {
            target: { value },
        } = event;
        setFilterProps({
            ...filterProps,
            kolam: typeof value === 'string' ? value.split(',') : value,
        })
    };

    const handleChangeTarikh = val => {
        setFilterProps({
            ...filterProps,
            tarikh: val
        })
    }

    const handleSubmitNewDeposit = (newAmount, booking) => {
        updateDepositForBooking({
            id: booking?.id,
            newDepositAmount: newAmount
        }).then(async res => {
            handleCloseEditDeposit();
            setSnackbarProps({
                open: true,
                message: `Deposit telah dikemaskini untuk Booking ID ${booking?.id} - ${booking?.manual_booking?.nama_penuh} dari RM ${booking?.deposit_amount} kepada RM ${booking?.deposit_amount + Number(newAmount)}`,
                severity: 'success'
            })
            await getData();
        })
    }

    const handleCloseEditDeposit = () => {
        setOpenDialogEditDeposit(false);
        setOpenDialogEditDepositBooking({});
    }

    const handleCancelDialog = () => {
        setOpenDialog(false);
        setDialogProps({})
    }

    const handleUploadReceipt = async (files, booking) => {
        setUploading(true);
        let formData = new FormData();
        formData.append('id', booking?.id);
        formData.append('nama', booking?.manual_booking?.nama_penuh);
        formData.append('email', booking?.manual_booking?.email);

        let i = 0;
        for (let f of files) {
            i++;
            formData.append(`file${i}`, f)
        }
        formData.append('filesCount', i);
        updateReceiptForBooking(formData).then(async res => {
            setUploading(false)
            await getData();
        }).catch(e => {
            setUploading(false)
        })
    }

    return <Container maxWidth="xl">
        <Grid container rowSpacing={2} pb={10}>
            <Grid item xs={12}>
                <Typography variant='h5'>Senarai Booking Pengguna</Typography>
            </Grid>
            <Grid item xs={12}>
                <Card sx={{ boxShadow: 'none' }}>
                    <CardContent>
                        <Grid container rowSpacing={2}>
                            <Grid item xs={12} sm={12}>
                                <Grid container rowSpacing={2} columnSpacing={2}>
                                    <Grid item xs={12} sm={12}>
                                        <Typography>Filter</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={'auto'} lg={'auto'}>
                                        <TextField sx={{ width: 250 }} onChange={onChangeBookingId} value={filterProps?.bookingId} label='Booking ID' />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={'auto'} lg={'auto'}>
                                        <MultipleSelectChip label="Payment Status" handleChange={handleChangePaymentStatus} value={filterProps?.paymentStatus} constants={['CREATED', 'PENDING', 'PENDING PAYMENT', 'PAID', 'CANCELLED']} />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={'auto'} lg={'auto'}>
                                        <MultipleSelectChip label="Kolam" handleChange={handleChangeKolam} value={filterProps?.kolam} constants={[1, 2, 3]} />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={'auto'} lg={'auto'}>
                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                            <DatePicker value={filterProps?.tarikh} onChange={handleChangeTarikh} sx={{ width: 250 }} format='DD/MM/YYYY' label="Tarikh Pancing" />
                                        </LocalizationProvider>
                                    </Grid>
                                </Grid>

                            </Grid>
                            {/* <Grid item xs={12} sm={6}>
                                <Grid container rowSpacing={2}>
                                    <Grid item xs={12}>
                                        <Typography>Sort</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <MultipleSelectChip label="Payment Status" values={['CREATED', 'PENDING', 'PAID', 'CANCELLED']} />

                                    </Grid>
                                    <Grid item xs={12}>
                                        <MultipleSelectChip label="Kolam" values={[1, 2, 3]} />
                                    </Grid>
                                </Grid>

                            </Grid> */}
                            <Grid item xs={12}>
                                <LoadingButton loading={loadingTable} variant='contained' onClick={handleApplyFilter}>Apply</LoadingButton>
                            </Grid>

                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12}>
                <BasicTable
                    loading={loadingTable}
                    headers={generateHeaders()}
                    rows={data}
                />
            </Grid>
            {openDialog ? <Dialog open={openDialog} onClose={handleCancelDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    {dialogProps?.title}
                </DialogTitle>
                <DialogContent>{dialogProps?.content}</DialogContent>
                <DialogActions>
                    <Grid container columnSpacing={2} justifyContent={'end'}>
                        <Grid item xs="auto">
                            <Button variant='outlined' onClick={handleCancelDialog}>Tidak Setuju</Button>
                        </Grid>
                        <Grid item xs="auto">
                            <Button variant='contained' onClick={() => dialogProps?.onOk()}>Setuju</Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog> : <></>}
            {openDialogEditDeposit ? <DialogEditDeposit open={openDialogEditDeposit} booking={openDialogEditDepositBooking} handleClose={handleCloseEditDeposit} handleSubmit={(newAmount, booking) => handleSubmitNewDeposit(newAmount, booking)} /> : <></>}
            {snackbarProps?.open ? <Snackbar open={snackbarProps?.open} autoHideDuration={5000} onClose={() => setSnackbarProps({})}>
                <Alert severity={snackbarProps?.severity} variant='filled'>
                    {snackbarProps?.message}
                </Alert>
            </Snackbar> : <></>}
        </Grid>
    </Container>
}

export default BookingPengguna;