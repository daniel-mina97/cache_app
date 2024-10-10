import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async createCacheItem(@Body() requestBody: { id: string; value: string }) {
    return this.appService.createCacheItem(requestBody.id, requestBody.value);
  }

  @Put()
  async updateCache(@Body() requestBody: { id: string; value: string }) {
    return this.appService.updateCacheItem(requestBody.id, requestBody.value);
  }

  @Get('id/:id')
  async getCacheItemById(@Param('id') id: string) {
    return this.appService.getCacheItemById(id);
  }

  @Get('value/:value')
  async getCacheItemsByValue(@Param('value') value: string) {
    return this.appService.getCacheItemsByValue(value);
  }

  @Delete(':id')
  async deleteCacheItem(@Param('id') id: string) {
    return this.appService.deleteCacheItem(id);
  }
}
