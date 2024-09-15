import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid } from '@mui/material';

export default function SimpleDialog({
    open,
    title,
    content,
    handleOk,
    handleClose
}) {

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Grid container justifyContent={'end'} columnSpacing={2}>
                        <Grid item xs="auto">
                            <Button variant='outlined' onClick={handleClose}>Tidak Setuju</Button>
                        </Grid>
                        <Grid item xs="auto">
                            <Button variant='contained' onClick={handleOk} autoFocus>
                                Setuju
                            </Button>
                        </Grid>
                    </Grid>

                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}