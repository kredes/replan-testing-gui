import {Component, OnInit, ViewChild, DoCheck, ElementRef} from "@angular/core";
import {ChangeRecordService} from "../services/change-record.service";
import {Record} from "../services/record";
import {OnRecordAdded} from "../services/on-record-added";


@Component({
  selector: 'change-record',
  templateUrl: 'change-record.component.html',
  styleUrls: ['./change-record.component.css', '../styles.css'],
})
export class ChangeRecordComponent implements OnInit, OnRecordAdded, DoCheck {
  records: Record[] = [];
  @ViewChild('scrollableRecordDiv') scrollableRecordDiv: ElementRef;

  constructor(private changeRecord: ChangeRecordService) {

  }

  ngOnInit(): void {
    this.changeRecord.addSubscriber(this);
    let i = 1;
  }

  krOnRecordAdded(record: Record): void {
    this.records.push(record);
    console.log(this.records);
  }

  onRecordUndone(record: Record): void {
    this.records.splice(this.records.indexOf(record), 1);
  }

  ngDoCheck(): void {
    this.scrollableRecordDiv.nativeElement.scrollTop = this.scrollableRecordDiv.nativeElement.scrollHeight;
  }

}
