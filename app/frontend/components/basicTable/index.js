import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { grey } from '@mui/material/colors';
import { Box, Card, CircularProgress, Grid, Typography } from '@mui/material';

export default function BasicTable({ rows, headers = [], loading }) {
    return (
        <TableContainer component={Paper} lo>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {headers.map(header => <TableCell {...header.props}>{header?.value}</TableCell>)}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => {
                        console.log(row)
                        return <TableRow
                            key={row.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, background: index % 2 == 0 ? grey[50] : 'unset' }}
                        >
                            {row.map(col => <TableCell {...col?.props} style={{ ...col?.props?.sx }}>
                                {col?.value}
                            </TableCell>)}
                        </TableRow>
                    })}
                </TableBody>
            </Table>
            {loading ? <Card sx={{ p: 5 }}>
                <Grid sx={{ width: '-webkit-fill-available' }} container display={'flex'} justifyContent={'center'} alignItems={'center'} textAlign={'center'}>
                    <Grid item xs={12}>
                        <CircularProgress />
                    </Grid>
                </Grid>
            </Card> : <></>}
            {!loading && !rows?.length ? <Card sx={{ p: 5 }}>
                <Grid sx={{ width: '-webkit-fill-available' }} container display={'flex'} justifyContent={'center'} alignItems={'center'} textAlign={'center'}>
                    <Grid item xs={12}>
                        <Typography>Tiada data.</Typography>
                    </Grid>
                </Grid>
            </Card> : <></>}
        </TableContainer>
    );
}