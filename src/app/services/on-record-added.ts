import {Record} from "./record";

export interface OnRecordAdded {
  krOnRecordAdded(record: Record): void;
}
