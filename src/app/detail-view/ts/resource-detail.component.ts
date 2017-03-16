import {Component, OnInit, DoCheck} from "@angular/core";
import {ElementDetailComponent} from "./element-detail.component";
import {Resource} from "../../domain/resource";
import {Skill} from "../../domain/skill";
import {Project} from "../../domain/project";

@Component({
  selector: 'resource-detail',
  templateUrl: '../html/resource-detail.component.html',
  styleUrls: ['../../styles.css']
})
export class ResourceDetailComponent extends ElementDetailComponent implements OnInit, DoCheck {
  oldSkills: number[] = [];
  skillsToRemove: number[] = [];
  skillsToAdd: number[] = [];


  ngOnInit(): void {
    if (this.createElement) this.element = new Resource(null, null, null, null, []);

    let elem = this.element as Resource;

    super.ngOnInit();
  }

  ngDoCheck(): void {
    let elem = this.element as Resource;
    if (this.oldSkills.length == 0 && elem.skills) elem.skills.forEach(s => this.oldSkills.push(s.id));
  }

  onSkillStateChange(event: Event) {
    let target = event.target as HTMLInputElement;
    let id = parseInt(target.value);
    let checked = target.checked;

    console.info("Skill with id", id, "is now", checked ? "checked" : "unchecked");

    if (checked) {
      if (!(this.oldSkills.indexOf(id) > -1)) this.skillsToAdd.push(id);
      else if (this.skillsToRemove.indexOf(id) > -1) this.skillsToRemove.splice(this.skillsToRemove.indexOf(id), 1);
    }
    else {
      if (this.oldSkills.indexOf(id) > -1) this.skillsToRemove.push(id);
      else this.skillsToAdd.splice(this.skillsToAdd.indexOf(id), 1);
    }
  }

  update(): void {
    let res = this.element as Resource;

    if (this.skillsToAdd.length > 0) {
      let skillsToAdd = this.skillsToAdd;
      this.element.dataService.addSkillsToResource(this.element as Resource, this.skillsToAdd)
        .then(resp => {
          if (resp.ok) {
            skillsToAdd.forEach(id => {
              this.element.dataService.getSkill(id)
                .then(f => res.addSkill(f));
            });
          }
        });
    }
    if (this.skillsToRemove.length > 0) {
      let skillsToRemove = this.skillsToRemove;
      this.element.dataService.removeSkillsFromResource(this.element as Resource, this.skillsToRemove)
        .then(resp => {
          if (resp.ok) {
            skillsToRemove.forEach(id => {
              this.element.dataService.getSkill(id)
                .then(f => res.removeSkill(f));
            });
          }
        });
    }
    this.oldSkills = [];
    this.skillsToAdd = [];
    this.skillsToRemove = [];

    if (res.skills) res.skills.forEach(s => this.oldSkills.push(s.id));

    super.update();
  }

  nonSelectedSkills(): Skill[] {
    let elem = this.element as Resource;

    let all = elem.project.skills;
    let skills = elem.skills;

    if (!skills) return all;

    return all.filter(function(s) {return skills.indexOf(s) < 0;});
  }

  nonSelectedReleases(): Skill[] {
    let elem = this.element as Resource;

    let all = elem.project.releases;
    let releases = elem.releases;

    if (!releases) return all;
    else return all.filter(function(r) {return releases.indexOf(r) < 0;});
  }
}
