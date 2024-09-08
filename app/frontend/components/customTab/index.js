'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Container } from '@mui/material';

export default function CustomTab({ tabs = [] }) {
    const [value, setValue] = React.useState(1);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Container maxWidth={'xl'}>
            <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                            {tabs?.map(tab => <Tab label={tab?.label} value={tab?.value} />)}
                        </TabList>
                    </Box>
                    {tabs?.map(tab => <TabPanel value={tab?.value} sx={{ pl: 0, pr: 0 }}>{tab?.component}</TabPanel>)}
                </TabContext>
            </Box>
        </Container>

    );
}