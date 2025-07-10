import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export class User extends Model {
  static table = 'users';

  @field('email') email!: string | null;
  @field('name') name!: string;
  @field('avatar') avatar!: string | null;
  @field('is_premium') isPremium!: boolean;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
}