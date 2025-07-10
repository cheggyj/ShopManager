import { Model, Q } from '@nozbe/watermelondb';
import { field, date, readonly, relation, children } from '@nozbe/watermelondb/decorators';
import { Shop } from './Shop';
import { Product } from './Product';

export class Category extends Model {
  static table = 'categories';

  static associations = {
    shop: { type: 'belongs_to', key: 'shop_id' },
    products: { type: 'has_many', foreignKey: 'category_id' },
  } as const;

  @field('shop_id') shopId!: string;
  @field('name') name!: string;
  @field('color') color!: string;
  @field('icon') icon!: string | null;
  @field('is_active') isActive!: boolean;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @relation('shops', 'shop_id') shop!: Shop;
  @children('products') products!: Q.Queryable<Product>;
}