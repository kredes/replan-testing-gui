import {ReplanElemType} from "./replan-elem-type";
import {Record} from "../services/record";
import {ControllerService} from "../services/controller.service";
import {ChangeRecordService} from "../services/change-record.service";
import {RecordType} from "../services/record-type";
import {OnElementChange} from "../detail-view/ts/on-element-change";

export abstract class ReplanElement {
  private static _dataService: ControllerService;
  private static _changeRecordService: ChangeRecordService;
  onElementChange: OnElementChange;
  loaded: Boolean = null;

  attributes: string[] = ['id', 'name', 'description'];

  private _oldValues: Object = {};

  constructor(
    private _id: number,
    private _name: string,
    private _description: string,
    private _type: ReplanElemType
  ) {
    this.addChange('id', this.id);
    this.addChange('name', this.name);
    this.addChange('description', this.description);
  }

  getTypeName(): string {
    return ReplanElemType[this.type].toLowerCase();
  }


  addChange(attribute: string, oldValue: any) {
    this._oldValues[attribute] = oldValue;
  }

  static setChangeRecordService(service: ChangeRecordService): void {
    ReplanElement._changeRecordService = service;
  }
  static setDataService(service: ControllerService): void {
    ReplanElement._dataService = service;
  }

  static get staticDataService(): ControllerService {
    return this._dataService;
  }

  get dataService(): ControllerService {
    return ReplanElement._dataService;
  }
  get changeRecordService(): ChangeRecordService {
    return ReplanElement._changeRecordService;
  }

  get oldValues(): Object {
    return this._oldValues;
  }
  set oldValues(value: Object) {
    this._oldValues = value;
  }

  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this.addChange('name', this._name);
    this._name = value;
  }

  get description(): string {
    return this._description;
  }
  set description(value: string) {
    this.addChange('description', this._description);
    this._description = value;
  }

  get type(): ReplanElemType {
    return this._type;
  }
  set type(value: ReplanElemType) {
    this.addChange('type', this._type);
    this._type = value;
  }

  abstract clone(): ReplanElement;

  /* GATEWAY */
  update(addRecord: Boolean): void {
    this.dataService.updateElement(this)
      .then(response => {
        if (addRecord) {
          console.log(response);
          let r = new Record(this, RecordType.UPDATE);
          r.response = response;
          this.changeRecordService.addRecord(r);
        }
        if (response['ok']) this.onElementChange.onElementUpdated(this);
      });
  }

  remove(addRecord: Boolean): void {
    this.dataService.removeElement(this)
      .then(response => {
        if (addRecord) {
          let r = new Record(this, RecordType.DELETION);
          r.response = response;
          this.changeRecordService.addRecord(r);
        }
        if (response['ok'])
          this.onElementChange.onElementDeleted(this);
      });
  }

  // TODO something like Skills.fromIds(ids[]). Also something like Skills.toIds(Skill[]). Somewhere.
  // TODO: Also, probably remove the Undo functionality and keep only the records. Too much of a trouble for very little benefit.
  undo(record: Record): void {
    let values = record.oldValues;

    let element: ReplanElement;
    this.dataService.getOriginalElement(this)
      .then(element => {
        switch (record.type) {
          case RecordType.UPDATE:
            // TODO: What if I have to undo "checkboxes"?
            console.log("Undo: Values will be restored to:", values);
            this.attributes.forEach(attr => element[attr] = values[attr]);
            element.update(false);
            break;
          case RecordType.DELETION:
            console.info("Undo: An element will be created with the following values:", values);
            this.save(false);
            break;
          case RecordType.CREATION:
            console.info("Undo: The resource with id", this.id, "will be deleted.");
            this.remove(false);
        }

      });
  }

  abstract save(addRecord: Boolean): void;
}
