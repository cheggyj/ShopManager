import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    // Users table (local auth info)
    tableSchema({
      name: 'users',
      columns: [
        { name: 'email', type: 'string', isOptional: true },
        { name: 'name', type: 'string' },
        { name: 'avatar', type: 'string', isOptional: true },
        { name: 'is_premium', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),

    // Shops table
    tableSchema({
      name: 'shops',
      columns: [
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'name', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'currency', type: 'string' },
        { name: 'timezone', type: 'string' },
        { name: 'is_active', type: 'boolean' },
        { name: 'is_primary', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'synced_at', type: 'number', isOptional: true },
      ]
    }),

    // Categories table
    tableSchema({
      name: 'categories',
      columns: [
        { name: 'shop_id', type: 'string', isIndexed: true },
        { name: 'name', type: 'string' },
        { name: 'color', type: 'string' },
        { name: 'icon', type: 'string', isOptional: true },
        { name: 'is_active', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),

    // Products table
    tableSchema({
      name: 'products',
      columns: [
        { name: 'shop_id', type: 'string', isIndexed: true },
        { name: 'category_id', type: 'string', isOptional: true, isIndexed: true },
        { name: 'name', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'sku', type: 'string', isOptional: true },
        { name: 'barcode', type: 'string', isOptional: true },
        { name: 'buying_price', type: 'number' },
        { name: 'selling_price', type: 'number' },
        { name: 'stock', type: 'number' },
        { name: 'min_stock', type: 'number' },
        { name: 'unit', type: 'string' },
        { name: 'image', type: 'string', isOptional: true },
        { name: 'is_active', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),

    // Sales table
    tableSchema({
      name: 'sales',
      columns: [
        { name: 'shop_id', type: 'string', isIndexed: true },
        { name: 'customer_id', type: 'string', isOptional: true, isIndexed: true },
        { name: 'employee_id', type: 'string', isOptional: true, isIndexed: true },
        { name: 'total', type: 'number' },
        { name: 'subtotal', type: 'number' },
        { name: 'tax', type: 'number' },
        { name: 'discount', type: 'number' },
        { name: 'payment_method', type: 'string' },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'sale_date', type: 'number', isIndexed: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),

    // Sale Items table
    tableSchema({
      name: 'sale_items',
      columns: [
        { name: 'sale_id', type: 'string', isIndexed: true },
        { name: 'product_id', type: 'string', isIndexed: true },
        { name: 'quantity', type: 'number' },
        { name: 'unit_price', type: 'number' },
        { name: 'total', type: 'number' },
        { name: 'created_at', type: 'number' },
      ]
    }),

    // Expenses table
    tableSchema({
      name: 'expenses',
      columns: [
        { name: 'shop_id', type: 'string', isIndexed: true },
        { name: 'employee_id', type: 'string', isOptional: true, isIndexed: true },
        { name: 'category', type: 'string', isIndexed: true },
        { name: 'amount', type: 'number' },
        { name: 'description', type: 'string' },
        { name: 'expense_date', type: 'number', isIndexed: true },
        { name: 'receipt', type: 'string', isOptional: true },
        { name: 'is_recurring', type: 'boolean' },
        { name: 'recurring_period', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),

    // Employees table
    tableSchema({
      name: 'employees',
      columns: [
        { name: 'shop_id', type: 'string', isIndexed: true },
        { name: 'name', type: 'string' },
        { name: 'email', type: 'string', isOptional: true },
        { name: 'phone', type: 'string', isOptional: true },
        { name: 'role', type: 'string' },
        { name: 'salary', type: 'number', isOptional: true },
        { name: 'salary_type', type: 'string' },
        { name: 'permissions', type: 'string' }, // JSON string array
        { name: 'is_active', type: 'boolean' },
        { name: 'hired_date', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),

    // Customers table
    tableSchema({
      name: 'customers',
      columns: [
        { name: 'shop_id', type: 'string', isIndexed: true },
        { name: 'name', type: 'string' },
        { name: 'email', type: 'string', isOptional: true },
        { name: 'phone', type: 'string', isOptional: true },
        { name: 'address', type: 'string', isOptional: true },
        { name: 'is_active', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),

    // Sync Queue table (for premium users)
    tableSchema({
      name: 'sync_queue',
      columns: [
        { name: 'table_name', type: 'string', isIndexed: true },
        { name: 'record_id', type: 'string', isIndexed: true },
        { name: 'action', type: 'string' },
        { name: 'data', type: 'string' }, // JSON stringified record data
        { name: 'retry_count', type: 'number' },
        { name: 'created_at', type: 'number' },
      ]
    }),
  ]
});