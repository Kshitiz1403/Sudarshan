import { Service } from 'typedi';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { readFile, unlink } from 'fs/promises';
import config from '@/config';

@Service()
export class StorageService {
  protected blobServiceClientInstance: BlobServiceClient;
  protected containerClientInstance: ContainerClient;

  constructor(
    blobServiceClient = BlobServiceClient.fromConnectionString(config.storage.azure_connection_string),
    containerClient = blobServiceClient.getContainerClient('store'),
  ) {
    this.blobServiceClientInstance = blobServiceClient;
    this.containerClientInstance = containerClient;
  }

  public uploadToStore = async (fileName, filePath, metaData?: {}, contentType?: string) => {
    try {
      const buffer = await readFile(filePath);
      unlink(filePath);

      const blobName = fileName;
      const blockBlobClient = this.containerClientInstance.getBlockBlobClient(blobName);
      const uploadBlobResponse = await blockBlobClient.upload(buffer, buffer.length, {
        blobHTTPHeaders: { blobContentType: contentType },
      });
      blockBlobClient.setMetadata(metaData);
      return { modified: uploadBlobResponse.lastModified, url: blockBlobClient.url };
    } catch (e) {
      throw e;
    }
  };
}
