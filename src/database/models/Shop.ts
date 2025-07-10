import { Model, Q } from '@nozbe/watermelondb';
import { field, date, readonly, relation, children } from '@nozbe/watermelondb/decorators';
import { Product } from './Product';
import { Sale } from './Sale';
import { Expense } from './Expense';
import { Employee } from './Employee';
import { Category } from './Category';
import { Customer } from './Customer';

export class Shop extends Model {
  static table = 'shops';

  static associations = {
    products: { type: 'has_many', foreignKey: 'shop_id' },
    sales: { type: 'has_many', foreignKey: 'shop_id' },
    expenses: { type: 'has_many', foreignKey: 'shop_id' },
    employees: { type: 'has_many', foreignKey: 'shop_id' },
    categories: { type: 'has_many', foreignKey: 'shop_id' },
    customers: { type: 'has_many', foreignKey: 'shop_id' },
  } as const;

  @field('user_id') userId!: string;
  @field('name') name!: string;
  @field('description') description!: string | null;
  @field('currency') currency!: string;
  @field('timezone') timezone!: string;
  @field('is_active') isActive!: boolean;
  @field('is_primary') isPrimary!: boolean;
  @field('synced_at') syncedAt!: number | null;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @children('products') products!: Q.Queryable<Product>;
  @children('sales') sales!: Q.Queryable<Sale>;
  @children('expenses') expenses!: Q.Queryable<Expense>;
  @children('employees') employees!: Q.Queryable<Employee>;
  @children('categories') categories!: Q.Queryable<Category>;
  @children('customers') customers!: Q.Queryable<Customer>;
}