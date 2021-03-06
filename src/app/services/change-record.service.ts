import {Injectable} from "@angular/core";
import {Record} from "./record";
import {OnRecordAdded} from "./on-record-added";

@Injectable()
export class ChangeRecordService {
  static recordId = 1;

  subscribers: OnRecordAdded[] = [];
  records: Record[] = [];


  getLastRecord(): Record {
    return this.records[-1];
  }

  getRecordAtPosition(i: number) {
    return this.records[i];
  }

  getPositionOfRecord(record: Record) {
    return this.records.indexOf(record);
  }

  /* TODO: Make it return a deep copy
  /* What was this TODO for?
  getAll(): Record[] {
    return this.records;
  }
  */

  addRecord(record: Record): void {
    record.id = ChangeRecordService.recordId;
    ChangeRecordService.recordId++;
    this.records.push(record);

    this.subscribers.forEach(function(sub) {
      sub.krOnRecordAdded(record);
    });
  }

  addSubscriber(sub: OnRecordAdded) {
    this.subscribers.push(sub);
  }

  isEmpty(): boolean {
    return this.records.length === 0;
  }
}
