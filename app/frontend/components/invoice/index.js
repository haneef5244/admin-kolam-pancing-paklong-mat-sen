import React from 'react';
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 30,
        flexDirection: 'column',
    },
    section: {
        padding: 10,
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    table: {
        display: 'table',
        width: 'auto',
        margin: '10px 0',
    },
    tableRow: {
        margin: 'auto',
        flexDirection: 'row',
    },
    tableCol: {
        width: '50%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#000',
        padding: 5,
        fontSize: 13
    },
    tableCell: {
        textAlign: 'left',
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
    },
    banner: {
        textAlign: 'center',
        width: '200px',
        height: '150px'
    },
    header: {
        fontSize: 12,
        textAlign: 'right',
    },
    total: {
        marginTop: 20,
        textAlign: 'right',
        fontSize: 16,
    },
    footer: {
        position: 'absolute',
        fontSize: 10,
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        color: 'gray',
    },
});

const MyDocument = ({ invoice }) => (
    <Document>
        <Page style={styles.page}>
            <Text style={styles.title}>Resit Pembayaran</Text>
            <View style={{ display: 'flex', alignItems: 'center', }}>
                <Image style={styles.banner} src={{ uri: 'https://paklongmatsen.com/logo/logo.png', method: "GET", headers: { "Cache-Control": "no-cache" }, body: "" }} />
            </View>
            <View style={{ textAlign: 'right' }}>
                <Text style={styles.header}>Nombor Resit: {invoice.invoice_number}</Text>
                <Text style={styles.header}>Tarikh: {invoice.date}</Text>
            </View>

            <View style={styles.section} >
                <View>
                    <Text style={{ fontSize: 13, fontWeight: 'bold' }}>Resit ini adalah untuk :</Text>
                    <Text style={{ marginTop: 2, fontSize: 11 }}>{invoice.client_name}</Text>
                    {invoice?.email ? <Text style={{ marginTop: 1, fontSize: 11 }}>{invoice.email}</Text> : <></>}
                    {invoice?.telefon ? <Text style={{ marginTop: 1, fontSize: 11 }}>{invoice.telefon}</Text> : <></>}
                </View>
                <View>
                    <Text style={{ fontSize: 13, fontWeight: 'bold' }}>Tarikh pertandingan:</Text>
                    <Text style={{ fontSize: 11, marginTop: 2 }}>{invoice.tarikh_pancing}</Text>
                </View>
            </View>
            <View style={{ marginTop: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Image style={{ width: '200px', height: '200px' }} src={invoice.qr_url} />

            </View>
            <View style={styles.table}>
                <View style={styles.tableRow}>
                    <Text style={[styles.tableCol, styles.tableCell]}>Item</Text>
                    <Text style={[styles.tableCol, styles.tableCell]}>Harga</Text>
                </View>
                {invoice.items.map((item, index) => (
                    <View style={styles.tableRow} key={index}>
                        <Text style={[styles.tableCol, styles.tableCell]}>{item.description}</Text>
                        <Text style={[styles.tableCol, styles.tableCell]}>{item.price}</Text>
                    </View>
                ))}
            </View>

            <Text style={styles.total}>Jumlah bayaran: {invoice.total}</Text>
            <Text style={styles.footer}>Resit ini adalah cetakan komputer.</Text>

        </Page>
    </Document>
);

const GenerateInvoice = ({ invoice }) => {
    return (
        <MyDocument invoice={invoice} />
    );
};

export default GenerateInvoice;
