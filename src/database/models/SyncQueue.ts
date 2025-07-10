import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export type SyncAction = 'create' | 'update' | 'delete';

export class SyncQueue extends Model {
  static table = 'sync_queue';

  @field('table_name') tableName!: string;
  @field('record_id') recordId!: string;
  @field('action') action!: SyncAction;
  @field('data') data!: string; // JSON stringified record data
  @field('retry_count') retryCount!: number;
  @readonly @date('created_at') createdAt!: Date;

  get recordData(): any {
    try {
      return JSON.parse(this.data);
    } catch {
      return null;
    }
  }

  setRecordData(data: any) {
    return this.update(() => {
      this.data = JSON.stringify(data);
    });
  }
}