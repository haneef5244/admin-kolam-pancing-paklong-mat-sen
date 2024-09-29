import React, { useEffect, useState } from "react";
import { getAllPertandinganLog, getPertandinganLog, updateAuditLog } from "@/app/backend/actions/pertandingan";
import { Box, Dialog, DialogContent } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { validate } from "uuid";


const columns = [
    {
        field: 'no', headerName: 'NO', width: 90, flex: 1,
    },
    {
        field: 'pancang_value',
        headerName: 'Pancang',
        sortable: true,
        editable: false,
        flex: 1,
    },
    {
        field: 'berat',
        headerName: 'Berat (kg)',
        type: 'number',
        editable: true,
        flex: 1,
    },
    {
        field: 'waktu',
        headerName: 'Waktu',
        editable: true,
        flex: 1,

    },
    {
        field: 'timbang_id',
        headerName: 'Penimbang',
        editable: true,
        sortable: false,
        type: 'number',
        flex: 1,
    },
];

const SemuaTangkapanDialog = ({ open, pertandinganId, tarikhPertandingan }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (open) {
            getAllPertandinganLog(pertandinganId).then(data =>
                setData(data)
            );
        }
    }, [open])

    const handleCellEditCommit = (params, a, b) => {
        updateAuditLog(params, pertandinganId, tarikhPertandingan).then(res => {
            getAllPertandinganLog(pertandinganId).then(data =>
                setData(data)
            );
        });
    };

    return <Dialog open={open} fullScreen>

        <DialogContent>
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    getRowId={(row) => row.id} // Use 'no' as the unique ID
                    rows={data}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                    }}
                    pageSizeOptions={[5]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    processRowUpdate={handleCellEditCommit}
                />
            </Box>
        </DialogContent>

    </Dialog>
}

export default SemuaTangkapanDialog;