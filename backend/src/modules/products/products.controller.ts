import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts(@Query('category') category?: string) {
    if (category) {
      const decoded = decodeURIComponent(category);
      return this.productsService.findByCategory(decoded);
    }
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productsService.findOne(id);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files', 10))
  async create(@Body() data: any, @UploadedFiles() files: Express.Multer.File) {
    return await this.productsService.createProduct(data, files as any);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files', 10))
  update(
    @Param('id') id: number,
    @Body() data: any,
    @UploadedFiles() files: Express.Multer.File,
  ) {
    return this.productsService.updateProduct(id, data, files as any);
  }

  @Patch('/restore/:id')
  restore(@Param('id') id: number) {
    return this.productsService.restoreProduct(id);
  }

  @Delete('/soft-delete/:id')
  softDelete(@Param('id') id: number) {
    return this.productsService.softDeleteProduct(id);
  }

  @Delete('hard-delete/:id')
  delete(@Param('id') id: number) {
    return this.productsService.deleteProduct(id);
  }

  @Delete('delete-image/:id')
  deleteImage(@Param('id') id: number) {
    return this.productsService.deleteImage(id);
  }
}
