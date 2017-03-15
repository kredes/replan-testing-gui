import {Component, OnInit, Input, EventEmitter, Output} from "@angular/core";
import {ControllerService} from "../../services/controller.service";
import {ReplanElement} from "../../domain/replan-element";
import {ChangeRecordService} from "../../services/change-record.service";
import {OnElementChange} from "./on-element-change";

@Component({
  //moduleId: module.id,
  selector: 'element-detail',
  template: 'Dummy. This should never show as it must be overriden by subclasses',
  styleUrls: ['../../styles.css']
})
export class ElementDetailComponent implements OnInit {
  @Input() element: ReplanElement;
  @Input() createElement: Boolean = false;
  @Input() onElementChange: OnElementChange;
  @Output() elementCreated: EventEmitter<ReplanElement> = new EventEmitter();
  @Output() elementSelected: EventEmitter<ReplanElement> = new EventEmitter();

  constructor(
    private _controllerService: ControllerService,
    private _changeRecordService: ChangeRecordService
  ) { }

  get controllerService(): ControllerService {
    return this._controllerService;
  }
  get changeRecordService(): ChangeRecordService {
    return this._changeRecordService;
  }

  ngOnInit(): void {
    this.element.onElementChange = this.onElementChange;
  }

  update(): void {
    this.element.update(true);
  }

  remove() {
    this.element.remove(true);
  }

  save(): void {
    this.element.save(true);
    this.elementCreated.emit(this.element);
  }

  cancelCreation(): void {
    this.elementCreated.emit(null);
  }

  onElementSelected(elem: ReplanElement): void {
    this.elementSelected.emit(elem);
  }
}
