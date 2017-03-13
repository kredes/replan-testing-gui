import {Component, Input, OnChanges, SimpleChanges, DoCheck, Output, EventEmitter} from "@angular/core";
import {Release} from "../domain/release";
import {Feature} from "../domain/feature";
import {Resource} from "../domain/resource";
import {Skill} from "../domain/skill";
import {Project} from "../domain/project";
import {ReplanElement} from "../domain/replan-element";
import {OnElementChange} from "../detail-view/ts/on-element-change";

@Component({
  moduleId: module.id,
  selector: 'element-list',
  templateUrl: 'element-list.component.html',
  styleUrls: ['../styles.css', './element-list.component.css']
})
export class ElementListComponent implements DoCheck {
  @Input() elements: ReplanElement[];
  @Input() onElementChange: OnElementChange;
  createElement: Boolean = false;
  @Output() elementSelected: EventEmitter<ReplanElement> = new EventEmitter();

  public areFeatures: boolean;
  public areReleases: boolean;
  public areResources: boolean;
  public areSkills: boolean;
  public areProjects: boolean;

  /*
     I use DoCheck because OnChanges will only be triggered if the reference to
     the input variable changes, which actually never happens.
   */
  ngDoCheck(): void {
    this.areFeatures = this.areProjects = this.areSkills = this.areResources = this.areReleases = false;
    if (this.elements.length > 0) {
      let elem = this.elements[0];
      let valid = true;
      if (elem instanceof Feature) this.areFeatures = true;
      else if (elem instanceof Release) this.areReleases = true;
      else if (elem instanceof Resource) this.areResources = true;
      else if (elem instanceof Skill) this.areSkills = true;
      else if (elem instanceof Project) this.areProjects = true;
      else {
        valid = false;
        console.error('Element list provided with array of invalid elements');
      }
    }
  }

  newElement(): void {
    this.createElement = true;
  }

  elementCreated(): void {
    this.createElement = false;
  }

  onElementSelected(elem: any): void {
    this.elementSelected.emit(elem);
  }
}
