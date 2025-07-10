import { Model, Q } from '@nozbe/watermelondb';
import { field, date, readonly, relation, children } from '@nozbe/watermelondb/decorators';
import { Shop } from './Shop';
import { Sale } from './Sale';

export class Customer extends Model {
  static table = 'customers';

  static associations = {
    shop: { type: 'belongs_to', key: 'shop_id' },
    sales: { type: 'has_many', foreignKey: 'customer_id' },
  } as const;

  @field('shop_id') shopId!: string;
  @field('name') name!: string;
  @field('email') email!: string | null;
  @field('phone') phone!: string | null;
  @field('address') address!: string | null;
  @field('is_active') isActive!: boolean;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @relation('shops', 'shop_id') shop!: Shop;
  @children('sales') sales!: Q.Queryable<Sale>;
}