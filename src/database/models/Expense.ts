import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, relation } from '@nozbe/watermelondb/decorators';
import { Shop } from './Shop';
import { Employee } from './Employee';

export type ExpenseCategory = 'salary' | 'wage' | 'transport' | 'rent' | 'utility' | 'software' | 'tools' | 'marketing' | 'other';
export type RecurringPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

export class Expense extends Model {
  static table = 'expenses';

  static associations = {
    shop: { type: 'belongs_to', key: 'shop_id' },
    employee: { type: 'belongs_to', key: 'employee_id' },
  } as const;

  @field('shop_id') shopId!: string;
  @field('employee_id') employeeId!: string | null;
  @field('category') category!: ExpenseCategory;
  @field('amount') amount!: number;
  @field('description') description!: string;
  @field('expense_date') expenseDate!: number;
  @field('receipt') receipt!: string | null;
  @field('is_recurring') isRecurring!: boolean;
  @field('recurring_period') recurringPeriod!: RecurringPeriod | null;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @relation('shops', 'shop_id') shop!: Shop;
  @relation('employees', 'employee_id') employee!: Employee;
}