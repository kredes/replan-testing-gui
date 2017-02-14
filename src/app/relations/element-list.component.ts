import {Component, OnInit, Input} from "@angular/core";
import {Release} from "../domain/release";
import {Feature} from "../domain/feature";
import {Resource} from "../domain/resource";
import {Skill} from "../domain/skill";
import {Project} from "../domain/project";

@Component({
  moduleId: module.id,
  selector: 'element-list',
  templateUrl: 'element-list.component.html',
  styleUrls: ['../styles.css']
})
export class ElementListComponent implements OnInit {
  @Input()
  elements: any[];

  public areFeatures: boolean;
  public areReleases: boolean;
  public areResources: boolean;
  public areSkills: boolean;
  public areProjects: boolean;

  ngOnInit(): void {
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
        console.log('Element list provided with array of invalid elements');
      }
    } else {
      console.log('Element list provided with empty array');
    }
  }
}
