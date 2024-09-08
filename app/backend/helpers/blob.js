const { BlobServiceClient, BlobSASPermissions, generateBlobSASQueryParameters, StorageSharedKeyCredential, SASProtocol } = require('@azure/storage-blob');
const { Buffer } = require('buffer');

export const uploadBase64ImageToBlob = async (blobName, containerName, base64Image, connectionString, fileType) => {
    try {
        // Create a BlobServiceClient
        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

        // Get a reference to a container
        const containerClient = blobServiceClient.getContainerClient(containerName);

        // Convert base64 string to buffer (removing the base64 prefix if needed)
        const base64Data = base64Image.replace(/^data:image\/png;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');

        // Get a block blob client
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // Upload the buffer to Azure Blob Storage
        const resp = await blockBlobClient.uploadData(buffer, {
            blobHTTPHeaders: { blobContentType: fileType } // Ensure the correct content type
        });

        console.log(`Upload successful: ${blobName}`);
    } catch (e) {
        throw e;
    }

}

export const getBlobSasUrl = (blobName, containerName, expiryDate, account = process.env.AZURE_STORAGE_ACCOUNT_NAME, key = process.env.AZURE_STORAGE_ACCOUNT_KEY) => {
    // Create a shared key credential
    const sharedKeyCredential = new StorageSharedKeyCredential(account, key);

    // Create a BlobServiceClient object
    const blobServiceClient = new BlobServiceClient(
        `https://${account}.blob.core.windows.net`,
        sharedKeyCredential
    );

    // Parameters
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Generate SAS token
    const sasToken = generateBlobSASQueryParameters({
        containerName,
        blobName,
        permissions: BlobSASPermissions.parse("r"), // "r" for read permission
        startsOn: new Date(), // Optionally, set a start time
        expiresOn: expiryDate,
        protocol: SASProtocol.Https, // Optional: HTTPS only
    }, sharedKeyCredential).toString();

    // Construct the SAS URL
    const containerUrl = containerClient.getBlobClient(blobName).url
    const sasUrl = `${containerUrl}?${sasToken}`;
    return sasUrl;
}