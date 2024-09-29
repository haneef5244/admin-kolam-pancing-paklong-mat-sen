// pages/api/getWebPubSubToken.js
'use server';
import { WebPubSubServiceClient } from '@azure/web-pubsub';


export async function getPubSubToken(connectionString, hubName) {
    const serviceClient = new WebPubSubServiceClient(process.env.AZURE_WEB_PUB_SUB_CONNECTION_STRING, hubName);
    const token = await serviceClient.getClientAccessToken();

    return token;
}

export const broadcastMessage = async (connectionString, hubName, message, contextType = 'application/json') => {
    const serviceClient = new WebPubSubServiceClient(connectionString, hubName);
    await serviceClient.sendToAll(message, { contextType })
}