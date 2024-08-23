import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import axios from 'axios';
import { determineTextInImage } from '../utils/geminiHelper.js';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async checkUrlsAccessibility(urls) {
    const urlValid = [];
    const requests = urls.map((url) =>
      axios
        .get(`http://${url}:8080`, { timeout: 2000 })
        .then((response) => {
          if (response.status === 200) {
            urlValid.push(url);
            console.log(`Truy cập đến ${url} thành công!`);
          }
        })
        .catch(() => {}),
    );

    await Promise.all(requests);
    return urlValid;
  }
  getListIpLan() {
    return new Promise((resolve, reject) => {
      exec('arp -a', (err, stdout) => {
        if (err) {
          console.error('Lỗi khi lấy bảng ARP:', err);
          reject(err);
          return;
        }

        const dynamicIps = stdout
          .split('\n')
          .map((line) => {
            const match = line.match(/(\d+\.\d+\.\d+\.\d+)/);
            return match ? match[1] : null;
          })
          .filter((ip) => ip !== null);

        resolve(dynamicIps);
      });
    });
  }

  async getListIpLanValid() {
    // const listIp = await this.getListIpLan();
    const listIp2 = [];
    for (let index = 0; index < 255; index++) {
      listIp2.push(`192.168.1.${index}`);
    }
    const listIpValid = await this.checkUrlsAccessibility(listIp2);
    return listIpValid.sort((a, b) => a.split('.')[3] - b.split('.')[3]);
  }

  async detectTextImage(
    image,
    apiKey,
    prompt = 'Xác định nội dung chữ trong ảnh và trả về từng nội dung của dòng theo mảng (chỉ trả về mảng)',
  ) {
    try {
      return await determineTextInImage(image, apiKey, prompt);
    } catch (error) {
      return error;
    }
  }
}
