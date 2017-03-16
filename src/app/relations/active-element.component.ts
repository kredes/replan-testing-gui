import {Component, Input, OnChanges} from "@angular/core";
import {Release} from "../domain/release";
import {Feature} from "../domain/feature";
import {Resource} from "../domain/resource";
import {Skill} from "../domain/skill";
import {Project} from "../domain/project";
import {OnElementChange} from "../detail-view/ts/on-element-change";
import {ReplanElement} from "../domain/replan-element";


@Component({
  selector: 'active-element',
  templateUrl: 'active-element.component.html',
  styleUrls: ['../styles.css', './active-element.component.css']
})
export class ActiveElementComponent implements OnChanges {
  @Input() element: ReplanElement;
  @Input() onElementChange: OnElementChange;


  public isFeature: boolean;
  public isRelease: boolean;
  public isResource: boolean;
  public isSkill: boolean;
  public isProject: boolean;

  ngOnChanges(): void {
    this.isFeature = this.isProject = this.isRelease = this.isResource = this.isSkill = false;
    if (this.element instanceof Feature) this.isFeature = true;
    else if (this.element instanceof Release) this.isRelease = true;
    else if (this.element instanceof Resource) this.isResource = true;
    else if (this.element instanceof Skill) this.isSkill = true;
    else if (this.element instanceof Project) this.isProject = true;
    else {
      console.log('Element list provided with an invalid element.');
    }
  }
}
