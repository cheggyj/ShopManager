import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, relation } from '@nozbe/watermelondb/decorators';
import { Sale } from './Sale';
import { Product } from './Product';

export class SaleItem extends Model {
  static table = 'sale_items';

  static associations = {
    sale: { type: 'belongs_to', key: 'sale_id' },
    product: { type: 'belongs_to', key: 'product_id' },
  } as const;

  @field('sale_id') saleId!: string;
  @field('product_id') productId!: string;
  @field('quantity') quantity!: number;
  @field('unit_price') unitPrice!: number;
  @field('total') total!: number;
  @readonly @date('created_at') createdAt!: Date;

  @relation('sales', 'sale_id') sale!: Sale;
  @relation('products', 'product_id') product!: Product;
}