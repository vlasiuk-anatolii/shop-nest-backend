import { promises as fs } from 'fs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductRequest } from './dto/create-product.request';
import { PrismaService } from '../prisma/prisma.service';
import { join } from 'path';
import { PRODUCT_IMAGES } from './product-images';
import { Prisma } from '@prisma/client';
import { ProductsGateway } from './products.gateway';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productsGateway: ProductsGateway,
  ) {}

  async createProduct(data: CreateProductRequest, userId: number) {
    const product = await this.prismaService.product.create({
      data: {
        ...data,
        userId,
      },
    });

    this.productsGateway.handleProductsUpdated();
    return product;
  }

  async getProducts(status?: string) {
    const args: Prisma.ProductFindManyArgs = {};

    if (status === 'available') {
      args.where = {
        sold: false,
      };
    }
    const products = await this.prismaService.product.findMany(args);

    return Promise.all(
      products.map(async (product) => ({
        ...product,
        imageExists: await this.imageExists(product.id),
      })),
    );
  }

  async getProduct(productId: number) {
    try {
      const product = await this.prismaService.product.findUniqueOrThrow({
        where: {
          id: productId,
        },
      });
      return {
        ...product,
        imageExists: await this.imageExists(productId),
      };
    } catch {
      throw new NotFoundException(`Product not found with ID: ${productId}`);
    }
  }

  async updateProduct(productId: number, data: Prisma.ProductUpdateInput) {
    await this.prismaService.product.update({
      where: {
        id: productId,
      },
      data,
    });

    this.productsGateway.handleProductsUpdated();
  }

  private async imageExists(productId: number) {
    try {
      await fs.access(
        join(`${PRODUCT_IMAGES}/${productId}.jpg`),
        fs.constants.F_OK,
      );
      return true;
    } catch {
      return false;
    }
  }

  async deleteProduct(productId: string) {
    await this.prismaService.product.delete({
      where: {
        id: +productId,
      },
    });
  }
}
