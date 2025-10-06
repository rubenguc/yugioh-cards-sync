import { Injectable, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { HttpService } from '@nestjs/axios';
import { Card } from 'src/ygopro/ygopro.interface';
import { firstValueFrom } from 'rxjs';
import { envs } from 'src/config/env';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly accountId: string;

  constructor(private readonly httpService: HttpService) {
    this.bucketName = envs.cloudflareR2BucketName;
    this.accountId = envs.cloudflareAccountId;

    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${this.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: envs.cloudflareR2AccessKeyId,
        secretAccessKey: envs.cloudflareR2SecretAccessKey,
      },
    });
  }

  async uploadCards(cards: Card[]): Promise<Card[]> {
    this.logger.log(`Starting upload for ${cards.length} cards`);

    const batchSize = 24;
    const updatedCards: Card[] = [];

    for (let i = 0; i < cards.length; i += batchSize) {
      const batch = cards.slice(i, i + batchSize);
      const updatedBatch = await this.processCardBatch(batch);
      updatedCards.push(...updatedBatch);

      this.logger.log(
        `Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(cards.length / batchSize)}`,
      );
    }

    this.logger.log(
      `Successfully processed ${updatedCards.length} cards with updated image URLs`,
    );
    return updatedCards;
  }

  private async processCardBatch(cards: Card[]): Promise<Card[]> {
    const promises = cards.map(async (card) => {
      const updatedCardImages = await Promise.all(
        card.card_images.map(async (image) => {
          const originalImageUrl = image.image_url;
          const originalImageUrlSmall = image.image_url_small;
          const originalImageUrlCropped = image.image_url_cropped;

          const r2Key = this.convertUrlToR2Path(originalImageUrl);
          const r2KeySmall = this.convertUrlToR2Path(originalImageUrlSmall);
          const r2KeyCropped = this.convertUrlToR2Path(originalImageUrlCropped);

          let newImageUrl = '';
          let newImageUrlSmall = '';
          let newImageUrlCropped = '';

          try {
            [newImageUrl, newImageUrlSmall, newImageUrlCropped] =
              await Promise.all([
                this.fetchAndUploadFile(originalImageUrl, r2Key),
                this.fetchAndUploadFile(originalImageUrlSmall, r2KeySmall),
                this.fetchAndUploadFile(originalImageUrlCropped, r2KeyCropped),
              ]);
          } catch (error) {
            this.logger.error(
              `Error processing images for card ID ${card.id}:`,
              error,
            );
            newImageUrl = image.image_url;
            newImageUrlSmall = image.image_url_small;
            newImageUrlCropped = image.image_url_cropped;
          }

          return {
            ...image,
            image_url: newImageUrl,
            image_url_small: newImageUrlSmall,
            image_url_cropped: newImageUrlCropped,
          };
        }),
      );

      return {
        ...card,
        card_images: updatedCardImages,
      };
    });

    return Promise.all(promises);
  }

  private async fetchImage(url: string): Promise<Buffer | null> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, { responseType: 'arraybuffer' }),
      );

      return Buffer.from(response.data);
    } catch (error) {
      this.logger.error(`Error fetching image from ${url}:`, error);
      return null;
    }
  }

  private async fetchAndUploadFile(url: string, key: string) {
    if (!url) return '';
    const fileData = await this.fetchImage(url);
    if (!fileData) return '';
    return await this.uploadToS3(fileData, key, this.getImageMimeType(url));
  }

  private async uploadToS3(
    buffer: Buffer,
    key: string,
    contentType: string,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ACL: 'public-read',
    });

    try {
      await this.s3Client.send(command);
      return `${this.getBaseURL()}/${key}`;
    } catch (error) {
      this.logger.error(
        `Error uploading to Cloudflare R2 with key ${key}:`,
        error,
      );
      throw error;
    }
  }

  private getFileNameFromUrl(url: string): string {
    return url.split('/').pop() || `image_${Date.now()}`;
  }

  private getImageMimeType(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      case 'webp':
        return 'image/webp';
      default:
        return 'image/jpeg';
    }
  }

  private convertUrlToR2Path(url: string): string {
    if (!url) return '';

    try {
      const urlObj = new URL(url);
      const imagePath = urlObj.pathname.substring(1);
      return imagePath;
    } catch (error) {
      const pathStart = url.indexOf('/', url.indexOf('://') + 3);
      if (pathStart !== -1) {
        return url.substring(pathStart + 1);
      } else {
        const fileName = this.getFileNameFromUrl(url);
        return `images/cards/${fileName}`;
      }
    }
  }

  private getBaseURL() {
    if (envs.cloudflareMode === 'dev') {
      return envs.cloudflareDevDomain;
    }
    return '';
  }
}
