import {Component, OnInit} from "@angular/core";
import {ElementDetailComponent} from "./element-detail.component";
import {Feature} from "../../domain/feature";
import {Skill} from "../../domain/skill";
import {element} from "protractor";

@Component({
  selector: 'feature-detail',
  templateUrl: '../html/feature-detail.component.html',
  styleUrls: ['../../styles.css']
})
export class FeatureDetailComponent extends ElementDetailComponent implements OnInit {
  oldSkills: number[] = [];
  skillsToRemove: number[] = [];
  skillsToAdd: number[] = [];

  ngOnInit(): void {
    if (this.createElement) this.element = new Feature(null, null, null, null, null, null, null, [], []);
    else if ((this.element as Feature).required_skills) {
      (this.element as Feature).required_skills.forEach(s => this.oldSkills.push(s.id))
    }
    super.ngOnInit();
  }

  onDependencyStateChange(event: Event) {
    let target = event.target as HTMLInputElement;
    let id = target.value;
    let checked = target.checked;

    console.info("Dependency with id", id, "is now", checked ? "checked" : "unchecked");
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

  update(): void {
    let feat = this.element as Feature;
    this.element.dataService.addSkillsToFeature(this.element as Feature, this.skillsToAdd);
    this.element.dataService.removeSkillsFromFeature(this.element as Feature, this.skillsToAdd);
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
