import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

function sleep(duration) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, duration);
    });
}

export default function SelectText({ options = [], onChange, labelKey, onSelect, textLabel }) {
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
        (async () => {
            setLoading(true);
            await sleep(1e3); // For demo purposes.
            setLoading(false);

        })();
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Autocomplete
            sx={{ width: 250 }}
            open={open}
            onOpen={handleOpen}
            onClose={handleClose}
            isOptionEqualToValue={(option, value) => option[labelKey] === value[labelKey]}
            getOptionLabel={(option) => option[labelKey]}
            onChange={onSelect}
            options={options}
            loading={loading}
            renderInput={(params) => (
                <TextField
                    onChange={onChange}
                    {...params}
                    label={textLabel}
                    slotProps={{
                        input: {
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        },
                    }}
                />
            )}
        />
    );
}
