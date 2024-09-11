'use server';

function pdfGenerator(doc, invoice) {
    doc.font('Helvetica');

    // Add Invoice Title and details
    doc.fontSize(20).text('Invoice', { align: 'center' });
    doc.moveDown();

    doc
        .fontSize(12)
        .text(`Invoice Number: ${invoice.invoice_number}`, { align: 'right' })
        .text(`Date: ${invoice.date}`, { align: 'right' });

    doc
        .text('Bill To:', 50, 200)
        .text(invoice.client_name, 50, 220)
        .text(invoice.client_address, 50, 240)
        .moveDown();

    // Invoice table
    let tableTop = 300;
    doc.text('Description', 50, tableTop);
    doc.text('Price', 450, tableTop);

    tableTop += 20;

    invoice.items.forEach(item => {
        const itemName = item.description;
        const itemPrice = item.price;

        doc.text(itemName, 50, tableTop);
        doc.text(itemPrice, 450, tableTop);

        tableTop += 20;
    });

    // Add total amount
    doc.moveDown();
    doc.text(`Total: ${invoice.total}`, { align: 'right' });
}