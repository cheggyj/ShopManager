import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schema } from './schema';
import { 
  User, 
  Shop, 
  Category, 
  Product, 
  Sale, 
  SaleItem, 
  Expense, 
  Employee, 
  Customer, 
  SyncQueue 
} from './models';

const adapter = new SQLiteAdapter({
  schema,
  dbName: 'ShopManagerDB',
  // migrations: [], // Add migrations when schema changes
});

export const database = new Database({
  adapter,
  modelClasses: [
    User,
    Shop,
    Category,
    Product,
    Sale,
    SaleItem,
    Expense,
    Employee,
    Customer,
    SyncQueue,
  ],
});

export * from './models';
export { schema };