import { Model, Q } from '@nozbe/watermelondb';
import { field, date, readonly, relation, children } from '@nozbe/watermelondb/decorators';
import { Shop } from './Shop';
import { Customer } from './Customer';
import { Employee } from './Employee';
import { SaleItem } from './SaleItem';

export class Sale extends Model {
  static table = 'sales';

  static associations = {
    shop: { type: 'belongs_to', key: 'shop_id' },
    customer: { type: 'belongs_to', key: 'customer_id' },
    employee: { type: 'belongs_to', key: 'employee_id' },
    sale_items: { type: 'has_many', foreignKey: 'sale_id' },
  } as const;

  @field('shop_id') shopId!: string;
  @field('customer_id') customerId!: string | null;
  @field('employee_id') employeeId!: string | null;
  @field('total') total!: number;
  @field('subtotal') subtotal!: number;
  @field('tax') tax!: number;
  @field('discount') discount!: number;
  @field('payment_method') paymentMethod!: string;
  @field('notes') notes!: string | null;
  @field('sale_date') saleDate!: number;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @relation('shops', 'shop_id') shop!: Shop;
  @relation('customers', 'customer_id') customer!: Customer;
  @relation('employees', 'employee_id') employee!: Employee;
  @children('sale_items') saleItems!: Q.Queryable<SaleItem>;
}