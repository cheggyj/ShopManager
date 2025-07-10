import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, relation } from '@nozbe/watermelondb/decorators';
import { Shop } from './Shop';
import { Category } from './Category';

export class Product extends Model {
  static table = 'products';

  static associations = {
    shop: { type: 'belongs_to', key: 'shop_id' },
    category: { type: 'belongs_to', key: 'category_id' },
  } as const;

  @field('shop_id') shopId!: string;
  @field('category_id') categoryId!: string | null;
  @field('name') name!: string;
  @field('description') description!: string | null;
  @field('sku') sku!: string | null;
  @field('barcode') barcode!: string | null;
  @field('buying_price') buyingPrice!: number;
  @field('selling_price') sellingPrice!: number;
  @field('stock') stock!: number;
  @field('min_stock') minStock!: number;
  @field('unit') unit!: string;
  @field('image') image!: string | null;
  @field('is_active') isActive!: boolean;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @relation('shops', 'shop_id') shop!: Shop;
  @relation('categories', 'category_id') category!: Category;
}