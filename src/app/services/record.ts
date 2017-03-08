import {RecordType} from "./record-type";
import {ReplanElement} from "../domain/replan-element";

export class Record {

  private _element: ReplanElement;
  private _oldValues: Object;
  id: number;

  constructor(
    element: ReplanElement,
    public type: RecordType
  ) {
    this.element = element.clone();
    this.oldValues = this.element.oldValues;
  }

  set element(value: ReplanElement) {
    this._element = value;
  }
  get element(): ReplanElement {
    return this._element;
  }

  get oldValues(): Object {
    return this._oldValues;
  }
  set oldValues(value: Object) {
    this._oldValues = value;
  }

  getTypeName() {
    return RecordType[this.type].toLowerCase()
  }

  undo(): void {
    this.element.undo(this);
  }

  getMessage(): string {
    let action: string;
    let elemType = this.element.getTypeName();
    let elemName = this.element.name;

    switch (this.type) {
      case RecordType.UPDATE: action = 'Updated'; break;
      case RecordType.DELETION: action = 'Deleted'; break;
      case RecordType.CREATION: action = 'Created'; break;
    }

    return action + ' ' + elemType + " '" + elemName + "'";
  }

  toJSON(): string {
    return JSON.stringify(this.oldValues, null, 2);
  }
}
