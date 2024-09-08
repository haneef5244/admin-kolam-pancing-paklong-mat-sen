import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Button, ButtonGroup, Card, CardActions, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import { cyan, grey } from '@mui/material/colors';
import { Add, Remove } from '@mui/icons-material';

const AdditonalProducts = ({ swiper = [], handleClickAdditionalProducts = () => { } }) => {
    return <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={10}
        slidesPerView={1}

        onSwiper={(swiper) => console.log(swiper)}
    >
        {swiper.map((data, index) => <SwiperSlide>

            <Card sx={{ boxShadow: 'none' }}>
                <CardMedia
                    component="img"
                    sx={{
                        height: '200px',
                        width: '200px',
                        objectFit: 'cover', // Ensures the image covers the area while maintaining aspect ratio                    
                    }}
                    src={data.image}
                />
                <CardContent>
                    <Grid container display={'flex'} alignItems={'center'} rowSpacing={2}>
                        <Grid item xs={3}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Typography fontWeight={'bold'} variant='caption'>{data.name}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant='caption'>{data.priceLabel}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={9}>
                            <ButtonGroup>
                                <Button onClick={() => handleClickAdditionalProducts(1, index)} sx={{ background: cyan[900], color: cyan[900], ':hover': { background: cyan[800] } }} variant='contained' disableElevation>
                                    <Add sx={{ color: '#ffffff' }} />
                                </Button>
                                <Button sx={{ borderColor: grey[300], }}>
                                    <Typography sx={{ color: grey[500] }} variant='caption'>{data.quantity}</Typography>
                                </Button>
                                <Button onClick={() => handleClickAdditionalProducts(-1, index)} sx={{ background: cyan[900], color: cyan[900], ':hover': { background: cyan[800] } }} variant='contained' disableElevation>
                                    <Remove sx={{ color: '#ffffff' }} />
                                </Button>
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </SwiperSlide>)}
    </Swiper>

}

export default AdditonalProducts;