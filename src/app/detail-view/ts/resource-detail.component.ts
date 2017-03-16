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

  oldReleases: number[] = [];
  releasesToRemove: number[] = [];
  releasesToAdd: number[] = [];

  ngOnInit(): void {
    if (this.createElement) this.element = new Resource(null, null, null, null, []);

    let elem = this.element as Resource;

    super.ngOnInit();
  }

  ngDoCheck(): void {
    let elem = this.element as Resource;
    if (this.oldSkills.length == 0 && elem.skills) elem.skills.forEach(s => this.oldSkills.push(s.id));
    if (this.oldReleases.length == 0 && elem.releases) elem.releases.forEach(r => this.oldReleases.push(r.id));
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

  onReleaseStateChange(event: Event) {
    let target = event.target as HTMLInputElement;
    let id = parseInt(target.value);
    let checked = target.checked;

    //console.info("Release with id", id, "is now", checked ? "checked" : "unchecked");
    if (checked) {
      if (!(this.oldReleases.indexOf(id) > -1)) this.releasesToAdd.push(id);
      else if (this.releasesToRemove.indexOf(id) > -1) this.releasesToRemove.splice(this.releasesToRemove.indexOf(id), 1);
    }
    else {
      if (this.oldReleases.indexOf(id) > -1) this.releasesToRemove.push(id);
      else this.releasesToAdd.splice(this.releasesToAdd.indexOf(id), 1);
    }
    //console.debug("STATUS AFTER CHANGE:");
    //console.debug("oldReleases:", this.oldReleases, "releasesToAdd:", this.releasesToAdd, "releasesToRemove:", this.releasesToRemove);
  }

  assignToProject(projId: number) {
    this.element.dataService.moveResourceToProject(this.element as Resource, projId);
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

    let releasesToAdd = this.releasesToAdd;
    this.releasesToAdd.forEach(id => {
      this.element.dataService.addResourcesToRelease(id, [this.element.id])
        .then(resp => {
          if (resp.ok) {
            releasesToAdd.forEach(id => {
              this.element.dataService.getRelease(id)
                .then(f => res.addRelease(f));
            });
          }
        });
    });
    let releasesToRemove = this.releasesToRemove;
    this.releasesToRemove.forEach(id => {
      this.element.dataService.removeResourcesFromRelease(id, [this.element.id])
        .then(resp => {
          if (resp.ok) {
            releasesToRemove.forEach(id => {
              this.element.dataService.getRelease(id)
                .then(f => res.removeRelease(f));
            });
          }
        });
    });

    this.oldSkills = [];
    this.skillsToAdd = [];
    this.skillsToRemove = [];
    this.oldReleases = [];
    this.releasesToRemove = [];
    this.releasesToAdd = [];

    if (res.skills) res.skills.forEach(s => this.oldSkills.push(s.id));
    if (res.releases) res.releases.forEach(r => this.oldReleases.push(r.id));

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

  nonSelectedProjects(): Project[] {
    /*let elem = this.element as Resource;

    let all: Project[];
    let elemProj = elem.project;
    this.element.dataService.getAllProjects()
      .then(projs => all = projs);

    Utils.waitUntilExists(all);

    return all.filter(function(proj) {return all.indexOf(proj) < 0;});*/
    return [];
  }
}
