import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, relation } from '@nozbe/watermelondb/decorators';
import { Shop } from './Shop';

export type SalaryType = 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export class Employee extends Model {
  static table = 'employees';

  static associations = {
    shop: { type: 'belongs_to', key: 'shop_id' },
  } as const;

  @field('shop_id') shopId!: string;
  @field('name') name!: string;
  @field('email') email!: string | null;
  @field('phone') phone!: string | null;
  @field('role') role!: string;
  @field('salary') salary!: number | null;
  @field('salary_type') salaryType!: SalaryType;
  @field('permissions') permissions!: string; // JSON string array
  @field('is_active') isActive!: boolean;
  @field('hired_date') hiredDate!: number;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @relation('shops', 'shop_id') shop!: Shop;

  get permissionsList(): string[] {
    try {
      return JSON.parse(this.permissions);
    } catch {
      return [];
    }
  }

  setPermissions(permissions: string[]) {
    return this.update(() => {
      this.permissions = JSON.stringify(permissions);
    });
  }
}