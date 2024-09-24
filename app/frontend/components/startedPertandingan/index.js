'use client';
import getPubSubToken from '@/app/backend/actions/webpubsub';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useEffect } from 'react';

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default function StartedPertandingan() {
    const [messages, setMessages] = useState([]);
    const [ws, setWs] = useState(null);

    useEffect(() => {
        const connectToWebPubSub = async () => {
            const token = await getPubSubToken();
            const webSocketUrl = token.url;

            // Connect to Web PubSub using the WebSocket URL from the token
            const websocket = new WebSocket(webSocketUrl);
            setWs(websocket);

            // Handle incoming messages
            websocket.onmessage = (event) => {
                const messageData = JSON.parse(event.data);
                setMessages((prev) => [...prev, messageData]);
            };

            // Handle WebSocket close
            websocket.onclose = () => {
                console.log('Connection closed');
            };
        };

        connectToWebPubSub();

        // Cleanup WebSocket connection when component unmounts
        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, []);

    return <Container maxWidth={'xl'}>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Dessert (100g serving)</TableCell>
                        <TableCell align="right">Calories</TableCell>
                        <TableCell align="right">Fat&nbsp;(g)</TableCell>
                        <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                        <TableCell align="right">Protein&nbsp;(g)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{row.calories}</TableCell>
                            <TableCell align="right">{row.fat}</TableCell>
                            <TableCell align="right">{row.carbs}</TableCell>
                            <TableCell align="right">{row.protein}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </Container>
}