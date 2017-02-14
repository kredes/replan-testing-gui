import {Component, OnInit, Input} from "@angular/core";
import {Release} from "../domain/release";
import {Feature} from "../domain/feature";
import {Resource} from "../domain/resource";
import {Skill} from "../domain/skill";
import {Project} from "../domain/project";
import {element} from "protractor";

@Component({
  moduleId: module.id,
  selector: 'active-element',
  templateUrl: 'active-element.component.html',
  styleUrls: ['../styles.css']
})
export class ActiveElementComponent implements OnInit {
  @Input()
  element: any;

  public isFeature: boolean;
  public isRelease: boolean;
  public isResource: boolean;
  public isSkill: boolean;
  public isProject: boolean;

  ngOnInit(): void {
    if (element instanceof Feature) this.isFeature = true;
    else if (element instanceof Release) this.isRelease = true;
    else if (element instanceof Resource) this.isResource = true;
    else if (element instanceof Skill) this.isSkill = true;
    else if (element instanceof Project) this.isProject = true;
    else {
      console.log('Element list provided with an invalid element.');
    }
  }
}
