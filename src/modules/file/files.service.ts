import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  BlobServiceClient,
  ContainerClient,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  SASProtocol,
  StorageSharedKeyCredential,
} from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilesService {
  private blobServiceClient: BlobServiceClient;
  private containerClient: ContainerClient;

  constructor(private configService: ConfigService) {
    const connectionString = this.configService.get<string>(
      'AZURE_STORAGE_CONNECTION_STRING',
    );
    const containerName = this.configService.get<string>(
      'AZURE_STORAGE_CONTAINER_NAME',
    );
    if (!connectionString || !containerName) {
      throw new Error(
        'Azure Storage connection string and container name must be provided.',
      );
    }

    this.blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
    this.containerClient =
      this.blobServiceClient.getContainerClient(containerName);
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileName = `${uuidv4()}-${file.originalname}`;
    const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);

    try {
      await blockBlobClient.upload(file.buffer, file.size, {
        blobHTTPHeaders: {
          blobContentType: file.mimetype,
        },
      });
      console.log('파일 업로드 성공:', fileName);
      // 파일명만 반환 (DB에 저장)
      return fileName;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`파일 업로드에 실패했습니다: ${error.message}`);
      } else {
        throw new Error(`파일 업로드에 실패했습니다: ${String(error)}`);
      }
    }
  }

  async deleteFile(fileName: string): Promise<boolean> {
    try {
      const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);
      await blockBlobClient.delete();
      return true;
    } catch (error) {
      console.error('파일 삭제 실패:', error);
      return false;
    }
  }

  getSasUrl(fileName: string, expiresInMinutes = 60): string {
    const accountName = this.configService.get<string>(
      'AZURE_STORAGE_ACCOUNT_NAME',
    );
    const accountKey = this.configService.get<string>(
      'AZURE_STORAGE_ACCOUNT_KEY',
    );
    const containerName = this.configService.get<string>(
      'AZURE_STORAGE_CONTAINER_NAME',
    );
    if (!accountName || !accountKey || !containerName) {
      throw new Error('Azure Strage env needed');
    }

    const sharedKeyCredential = new StorageSharedKeyCredential(
      accountName,
      accountKey,
    );

    const sasToken = generateBlobSASQueryParameters(
      {
        containerName,
        blobName: fileName,
        permissions: BlobSASPermissions.parse('r'), // 읽기 권한
        expiresOn: new Date(
          new Date().valueOf() + expiresInMinutes * 60 * 1000,
        ),
        protocol: SASProtocol.Https,
      },
      sharedKeyCredential,
    ).toString();

    const url = `https://${accountName}.blob.core.windows.net/${containerName}/${fileName}?${sasToken}`;
    return url;
  }

  async listFiles(): Promise<string[]> {
    const fileNames: string[] = [];

    for await (const blob of this.containerClient.listBlobsFlat()) {
      fileNames.push(blob.name);
    }

    return fileNames;
  }
}
