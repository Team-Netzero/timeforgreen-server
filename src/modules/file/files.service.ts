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
import fetch from 'node-fetch';

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

  async checkPlugged(
    file: Express.Multer.File,
  ): Promise<{ isPlugged: boolean }> {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY 환경변수가 필요합니다.');
    }
    // OpenAI Vision API 엔드포인트
    const url = 'https://api.openai.com/v1/chat/completions';
    // 프롬프트: 플러그가 꽂혀있는지 여부를 묻는 질문
    const prompt =
      '이 사진에서 플러그가 콘센트에 꽂혀 있나요? "뽑혀있으면 뽑혀있다, 아니면 꽂혀있다"로만 답해주세요.';
    // base64 인코딩
    const base64Image = file.buffer.toString('base64');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${file.mimetype};base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 10,
      }),
    });
    if (!response.ok) {
      throw new Error('OpenAI API 호출 실패: ' + response.statusText);
    }
    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = data.choices?.[0]?.message?.content?.trim?.() || '';
    // "뽑혀있다"라는 단어가 포함되어 있으면 true, 아니면 false
    const isPlugged = typeof text === 'string' && text.includes('뽑혀');
    return { isPlugged: !!isPlugged };
  }
}
