'use server';
import moment from 'moment';
import CryptoJS from 'crypto-js'
import QRCode from 'qrcode';

export const getQR = async (userId, bookingId, tarikh, qrUrl) => {
    let qrBlobName = `${userId}-${bookingId}-${moment().format('YYYY-MM-DD HH:mm:ss.SSS')}.png`
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify({
        bookingId: Number(bookingId),
    }), process.env.QR_SECRET_KEY).toString();
    const qrCodeImage = await QRCode.toDataURL(encryptedData);
    return qrCodeImage
}