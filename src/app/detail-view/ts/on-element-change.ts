import {ReplanElement} from "../../domain/replan-element";

export interface OnElementChange {
  onElementCreated(element: ReplanElement): void;
  onElementUpdated(element: ReplanElement): void;
  onElementDeleted(element: ReplanElement): void;
}
