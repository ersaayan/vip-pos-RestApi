// src/products/products.script.ts

import { Injectable, OnModuleInit } from '@nestjs/common';
import fetch from 'node-fetch';
import { SentosProductsService } from './sentos-products.service';

@Injectable()
export class ProductsScript implements OnModuleInit {
  constructor(private readonly productsService: SentosProductsService) {}

  async onModuleInit() {
    const response = await fetch(
      'https://vipcase.sentos.com.tr/api/products?size=1000',
    );
    const data = await response.json();

    for (const product of data.data) {
      const createdProduct = await this.productsService.createProduct({
        categoryId: product.categoryId,
        sku: product.sku,
        name: product.name,
        invoiceName: product.invoiceName,
        brand: product.brand,
        description: product.description,
        purchasePrice: product.purchasePrice,
        salePrice: product.salePrice,
        currency: product.currency,
        vatRate: product.vatRate,
        volumetricWeight: product.volumetricWeight,
        barcode: product.barcode,
        descriptionDetail: product.description_detail,
      });

      await this.productsService.createPrice({
        product: {
          connect: {
            id: createdProduct.id,
          },
        },
        n11: product.prices.n11,
        trendyol: product.prices.trendyol,
        hepsiburada: product.prices.hepsiburada,
        // Add other platforms similarly...
      });

      for (const variant of product.variants) {
        const createdVariant = await this.productsService.createVariant({
          product: {
            connect: {
              id: createdProduct.id,
            },
          },
          sku: variant.sku,
          barcode: variant.barcode,
          model: variant.model,
          color: variant.color,
        });

        for (const stock of variant.stocks) {
          await this.productsService.createStock({
            variant: {
              connect: {
                id: createdVariant.id,
              },
            },
            warehouse: stock.warehouse,
            stock: stock.stock,
          });
        }

        for (const image of variant.images) {
          await this.productsService.createImage({
            variant: {
              connect: {
                id: createdVariant.id,
              },
            },
            url: image.url,
          });
        }
      }
    }
  }
}
