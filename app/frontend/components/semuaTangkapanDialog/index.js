import React, { useEffect, useState } from "react";
import { deletePertandinganAuditLog, getAllPertandinganLog, getPertandinganLog, updateAuditLog } from "@/app/backend/actions/pertandingan";
import { Avatar, Box, Button, Dialog, DialogContent, Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { validate } from "uuid";
import { CloseOutlined } from "@mui/icons-material";




const SemuaTangkapanDialog = ({ open, pertandinganId, tarikhPertandingan, jenisPertandingan, handleClose }) => {
    const [data, setData] = useState([]);

    const columns = [
        {
            field: 'no', headerName: 'NO', width: 90, flex: 1, headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'pancang_value',
            headerName: 'Pancang',
            sortable: true,
            editable: false,
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'berat',
            headerName: 'Berat (kg)',
            type: 'number',
            editable: false,
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'waktu',
            headerName: 'Waktu',
            editable: false,
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'timbang_id',
            headerName: 'Penimbang',
            editable: false,
            sortable: false,
            type: 'number',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
        },
        {
            field: 'delete',
            headerName: 'Buang',
            editable: false,
            sortable: false,
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: params => <Button
                variant="contained"
                color="error"
                onClick={() => handleDelete(params?.id)}
            >
                Buang
            </Button>
        },
    ];

    const handleDelete = async (id) => {
        await deletePertandinganAuditLog(Number(id), pertandinganId, jenisPertandingan)
        getAllPertandinganLog(pertandinganId).then(data =>
            setData(data)
        );
    }

    useEffect(() => {
        if (open) {
            getAllPertandinganLog(pertandinganId).then(data =>
                setData(data)
            );
        }
    }, [open])


    return <Dialog open={open} fullScreen>

        <DialogContent>
            <Grid container>
                <Grid item xs={12} display={'flex'} textAlign={'end'} justifyContent={'end'}>
                    <Button onClick={handleClose}><Avatar>
                        <CloseOutlined />
                    </Avatar>
                    </Button>
                </Grid>
            </Grid>
            <Box sx={{ width: '100%' }}>
                <DataGrid
                    getRowId={(row) => row.id} // Use 'no' as the unique ID
                    rows={data}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 100,
                            },
                        },
                    }}
                    pageSizeOptions={[100]}
                />
            </Box>
        </DialogContent>

    </Dialog>
}

export default SemuaTangkapanDialog;