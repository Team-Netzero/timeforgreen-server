import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService, //
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('파일이 업로드되지 않았습니다.');
    }

    try {
      return this.filesService.uploadFile(file);
    } catch (error) {
      console.error('파일 업로드 실패:', error);
      throw new Error(
        `파일 업로드에 실패했습니다: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  @Post('check-plugged')
  @UseInterceptors(FileInterceptor('file'))
  async checkPlugged(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        throw new Error('파일이 업로드되지 않았습니다.');
      }
      return await this.filesService.checkPlugged(file);
    } catch (err) {
      console.error('checkPlugged error:', err);
      throw err;
    }
  }

  @Get('sas-url')
  getSasUrl(@Query('fileName') fileName: string) {
    return { url: this.filesService.getSasUrl(fileName) };
  }
}
