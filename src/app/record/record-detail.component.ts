import {Component, Input, Output, EventEmitter} from "@angular/core";
import {Record} from "../services/record";


@Component({
  selector: 'record-detail',
  templateUrl: 'record-detail.component.html',
  styleUrls: ['./change-record.component.css', '../styles.css'],
})
export class RecordDetailComponent {
  @Input() record: Record;
  previousValuesCollapsed: Boolean = true;
  responseCollapsed: Boolean = true;
  @Output() undoneRecord: EventEmitter<Record> = new EventEmitter();

  toggleCollapse(): void {
    console.log(this.previousValuesCollapsed);
    this.previousValuesCollapsed = !this.previousValuesCollapsed;
    console.log(this.previousValuesCollapsed);
  }

  undo(record: Record): void {
    record.undo();
    this.undoneRecord.emit(this.record);
  }

}
