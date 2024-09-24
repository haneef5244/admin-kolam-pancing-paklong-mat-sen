// pages/api/getWebPubSubToken.js
import { WebPubSubServiceClient } from '@azure/web-pubsub';

const serviceClient = new WebPubSubServiceClient(connectionString, hubName);

export default async function getPubSubToken() {
    const token = await serviceClient.getClientAccessToken();

    return token;
}
