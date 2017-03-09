import {Component, Input, OnInit} from "@angular/core";
import {Record} from "../../services/record";
import {RecordType} from "../../services/record-type";
import {ElementDetailComponent} from "./element-detail.component";
import {Resource} from "../../domain/resource";
import {Feature} from "../../domain/feature";
import {Skill} from "../../domain/skill";

@Component({
  moduleId: module.id,
  selector: 'resource-detail',
  templateUrl: '../html/resource-detail.component.html',
  styleUrls: ['../../styles.css']
})
export class ResourceDetailComponent extends ElementDetailComponent implements OnInit {
  oldSkills: number[] = [];
  skillsToRemove: number[] = [];
  skillsToAdd: number[] = [];

  ngOnInit(): void {
    if (this.createElement) this.element = new Resource(null, null, null, null, null);
    else {
      console.log((this.element as Resource).project);
    }

    super.ngOnInit();
  }

  onSkillStateChange(event: Event) {
    let target = event.target as HTMLInputElement;
    let id = parseInt(target.value);
    let checked = target.checked;

    if (checked) {
      if (!(id in this.oldSkills)) this.skillsToAdd.push(id);
    }
    else {
      if (id in this.oldSkills) this.skillsToRemove.push(id);
      else this.skillsToAdd.splice(this.skillsToAdd.indexOf(id), 1);
    }
    console.info("Skill with id", id, "is now", checked ? "checked" : "unchecked");
  }

  assignToProject(projId: number) {
    this.element.dataService.moveResourceToProject(this.element as Resource, projId);
  }

  assignToRelease(relId: number) {
    this.element.dataService.moveResourceToRelease(this.element as Resource, (this.element as Resource).release.id, relId);
  }

  update(): void {
    if (this.skillsToAdd.length > 0 || this.skillsToRemove.length > 0) {
      let feat = this.element as Feature;
      this.element.dataService.addSkillsToResource(this.element as Resource, this.skillsToAdd);
      this.element.dataService.removeSkillsFromResource(this.element as Resource, this.skillsToAdd);
    }
    super.update();
  }

  nonSelectedSkills(): Skill[] {
    let elem = this.element as Resource;
    let all = elem.project.skills;
    let skills = elem.skills;

    return all.filter(function(s) {return skills.indexOf(s) < 0;});
  }
}
