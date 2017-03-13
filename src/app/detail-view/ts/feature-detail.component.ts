import {Component, OnInit, DoCheck} from "@angular/core";
import {ElementDetailComponent} from "./element-detail.component";
import {Feature} from "../../domain/feature";
import {Skill} from "../../domain/skill";
import {element} from "protractor";

@Component({
  selector: 'feature-detail',
  templateUrl: '../html/feature-detail.component.html',
  styleUrls: ['../../styles.css']
})
export class FeatureDetailComponent extends ElementDetailComponent implements OnInit, DoCheck {
  oldSkills: number[] = [];
  skillsToRemove: number[] = [];
  skillsToAdd: number[] = [];

  oldDependencies: number[] = [];
  dependenciesToRemove: number[] = [];
  dependenciesToAdd: number[] = [];

  ngOnInit(): void {
    if (this.createElement) this.element = new Feature(null, null, null, null, null, null, null, [], []);
    else if ((this.element as Feature).required_skills) {
      (this.element as Feature).required_skills.forEach(s => this.oldSkills.push(s.id))
    }
    super.ngOnInit();
  }

  ngDoCheck(): void {
    let elem = this.element as Feature;
    if (this.oldSkills.length == 0 && elem.required_skills) elem.required_skills.forEach(s => this.oldSkills.push(s.id));
    if (this.oldDependencies.length == 0 && elem.depends_on) elem.depends_on.forEach(r => this.oldDependencies.push(r.id));
  }

  onDependencyStateChange(event: Event) {
    let target = event.target as HTMLInputElement;
    let id = parseInt(target.value);
    let checked = target.checked;

    //console.info("Dependency with id", id, "is now", checked ? "checked" : "unchecked");

    if (checked) {
      if (!(this.oldDependencies.indexOf(id) > -1)) this.dependenciesToAdd.push(id);
      else if (this.dependenciesToRemove.indexOf(id) > -1) this.dependenciesToRemove.splice(this.dependenciesToRemove.indexOf(id), 1);
    }
    else {
      if (this.oldDependencies.indexOf(id) > -1) this.dependenciesToRemove.push(id);
      else this.dependenciesToAdd.splice(this.dependenciesToAdd.indexOf(id), 1);
    }

    //console.debug("STATUS AFTER CHANGE:");
    //console.debug("oldDependencies:", this.oldDependencies, "dependenciesToAdd:", this.dependenciesToAdd, "dependenciesToRemove:", this.dependenciesToRemove);
  }

  onSkillStateChange(event: Event) {
    let target = event.target as HTMLInputElement;
    let id = parseInt(target.value);
    let checked = target.checked;

    //console.info("Skill with id", id, "is now", checked ? "checked" : "unchecked");

    if (checked) {
      if (!(this.oldSkills.indexOf(id) > -1)) this.skillsToAdd.push(id);
      else if (this.skillsToRemove.indexOf(id) > -1) this.skillsToRemove.splice(this.skillsToRemove.indexOf(id), 1);
    }
    else {
      if (this.oldSkills.indexOf(id) > -1) this.skillsToRemove.push(id);
      else this.skillsToAdd.splice(this.skillsToAdd.indexOf(id), 1);
    }

    //console.debug("STATUS AFTER CHANGE:");
    //console.debug("oldSkills:", this.oldSkills, "skillsToAdd:", this.skillsToAdd, "skillsToRemove:", this.skillsToRemove);
  }

  update(): void {
    let feat = this.element as Feature;

    if (this.skillsToAdd.length > 0) {
      let skillsToAdd = this.skillsToAdd;
      this.element.dataService.addSkillsToFeature(this.element as Feature, this.skillsToAdd)
        .then(resp => {
          if (resp.ok) {
            skillsToAdd.forEach(id => {
              this.element.dataService.getSkill(id)
                .then(f => feat.addSkill(f));
            });
          }
        });
    }
    if (this.skillsToRemove.length > 0) {
      let skillsToRemove = this.skillsToRemove;
      this.element.dataService.removeSkillsFromFeature(this.element as Feature, this.skillsToRemove)
        .then(resp => {
          if (resp.ok) {
            skillsToRemove.forEach(id => {
              this.element.dataService.getSkill(id)
                .then(f => feat.removeSkill(f));
            });
          }
        });
    }

    if (this.dependenciesToAdd.length > 0) {
      let dependenciesToAdd = this.dependenciesToAdd;
      this.element.dataService.addDependencyToFeature(this.element as Feature, this.dependenciesToAdd)
        .then(resp => {
          if (resp.ok) {
            dependenciesToAdd.forEach(id => {
              this.element.dataService.getFeature(id)
                .then(f => feat.addDependency(f));
            });
          }
        });
    }
    if (this.dependenciesToRemove.length > 0) {
      let dependenciesToRemove = this.dependenciesToRemove;
      this.element.dataService.removeDependencyFromFeature(this.element as Feature, this.dependenciesToRemove)
        .then(resp => {
          if (resp.ok) {
            dependenciesToRemove.forEach(id => {
              this.element.dataService.getFeature(id)
                .then(f => feat.removeDependency(f));
            });
          }
        });
    }

    this.oldSkills = [];
    this.skillsToAdd = [];
    this.skillsToRemove = [];
    this.oldDependencies = [];
    this.dependenciesToAdd = [];
    this.dependenciesToRemove = [];

    feat.required_skills.forEach(s => this.oldSkills.push(s.id));
    feat.depends_on.forEach(s => this.oldDependencies.push(s.id));

    super.update();
  }

  nonSelectedSkills(): Skill[] {
    let elem = this.element as Feature;
    let all = elem.project.skills;
    let skills = elem.required_skills;

    if (!skills) return all;

    return all.filter(function(s) {return skills.indexOf(s) < 0;});
  }

  nonSelectedDependencies(): Feature[] {
    let elem = this.element as Feature;
    let all = elem.project.features;
    let depends = elem.depends_on;

    if (!depends) return all;

    let auxId = this.element.id;

    return all.filter(function(feat) {
      return (depends.indexOf(feat) < 0) && (feat.id != auxId);
    });
  }
}
