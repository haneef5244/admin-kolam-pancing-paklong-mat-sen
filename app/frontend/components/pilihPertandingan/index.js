import { Button, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'
import moment from 'moment'
import React from 'react'

const PilihPertandingan = ({ data, onHandleSelect }) => {
    return <Grid container>
        <Grid item xs={12}>
            <Grid container rowSpacing={2} columnSpacing={2}>
                {data?.map(date => <Grid item xs="12" sm={6} lg={4} xl={3}>
                    <Card sx={{ border: `1px solid ${grey[300]}`, boxShadow: 'none' }}>
                        <CardMedia component={"img"} src={date?.poster_url} />
                        <CardContent sx={{ border: 'none' }}>
                            <Grid container>
                                <Grid item xs={6}>
                                    <Grid container>
                                        <Grid item xs="12">
                                            <Typography>Tarikh Pertandingan:</Typography>
                                        </Grid>
                                        <Grid item xs="12">
                                            <Typography fontWeight={'bold'}>{moment(date?.tarikh).format('Do MMM YYYY')}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={6}>
                                    <Grid container>
                                        <Grid item xs="12">
                                            <Typography>Jenis Pertandingan:</Typography>
                                        </Grid>
                                        <Grid item xs="12">
                                            <Typography fontWeight={'bold'}>{date?.jenis}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} pt={2} textAlign={'center'}>
                                    <Button onClick={() => onHandleSelect(moment(date.tarikh).format('YYYY-MM-DD'))} variant="contained">
                                        <Typography textTransform={'capitalize'}>Pilih Pertandingan Ini</Typography>
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>)}
            </Grid>
        </Grid>
    </Grid>
}

export default PilihPertandingan