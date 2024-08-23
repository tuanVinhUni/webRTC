import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBody } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('list-ip-lan-valid')
  getListIpLanValid() {
    return this.appService.getListIpLanValid();
  }

  @Post('detect-text-in-image')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        base64Image: { type: 'string' },
        apiKey: { type: 'string' },
        prompt: {
          type: 'string',
          default:
            'Xác định nội dung chữ trong ảnh và trả về từng nội dung của dòng theo mảng (chỉ trả về mảng)',
        },
      },
      required: ['base64Image', 'apiKey'],
    },
  })
  detectTextImage(
    @Body()
    requestBody: {
      base64Image: string;
      apiKey: string;
      prompt: string;
    },
  ): any {
    const { base64Image, apiKey } = requestBody;
    if (requestBody.prompt) {
      return this.appService.detectTextImage(
        base64Image,
        apiKey,
        requestBody.prompt,
      );
    }
    return this.appService.detectTextImage(base64Image, apiKey);
  }
}
