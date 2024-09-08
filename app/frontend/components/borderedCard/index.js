import { Card } from '@mui/material';
import { grey } from '@mui/material/colors';
import React from 'react';

const BorderedCard = ({ children }) => {
    return <Card sx={{ boxShadow: 'none', borderRadius: '10px', border: `1px solid ${grey[300]}` }}>
        {...children}
    </Card>
}

export default BorderedCard;