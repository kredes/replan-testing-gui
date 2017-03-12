import {Component, Input, OnInit, DoCheck} from "@angular/core";
import {Record} from "../../services/record";
import {RecordType} from "../../services/record-type";
import {ElementDetailComponent} from "./element-detail.component";
import {Resource} from "../../domain/resource";
import {Feature} from "../../domain/feature";
import {Skill} from "../../domain/skill";
import {Project} from "../../domain/project";
import {Utils} from "../../utils";

@Component({
  moduleId: module.id,
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
/*
    if (elem.skills) elem.skills.forEach(s => this.oldSkills.push(s.id));


    console.log("RELEASES", elem.releases);
    //Utils.waitUntilExists(elem.releases);
    if (elem.releases) elem.releases.forEach(r => {
      console.debug("OLD RELEASE", r);
      this.oldReleases.push(r.id)
    });*/
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

    console.info("Release with id", id, "is now", checked ? "checked" : "unchecked");
    if (checked) {
      if (!(this.oldReleases.indexOf(id) > -1)) this.releasesToAdd.push(id);
      else if (this.releasesToRemove.indexOf(id) > -1) this.releasesToRemove.splice(this.releasesToRemove.indexOf(id), 1);
    }
    else {
      if (this.oldReleases.indexOf(id) > -1) this.releasesToRemove.push(id);
      else this.releasesToAdd.splice(this.releasesToAdd.indexOf(id), 1);
    }
    console.debug("STATUS AFTER CHANGE:");
    console.debug("oldReleases:", this.oldReleases, "releasesToAdd:", this.releasesToAdd, "releasesToRemove:", this.releasesToRemove);
  }

  assignToProject(projId: number) {
    this.element.dataService.moveResourceToProject(this.element as Resource, projId);
  }

  assignToRelease(relId: number) {
    //this.element.dataService.moveResourceToRelease(this.element as Resource, (this.element as Resource).release.id, relId);
  }

  update(): void {
    if (this.skillsToAdd.length > 0 || this.skillsToRemove.length > 0) {
      if (this.skillsToAdd.length > 0) {
        this.element.dataService.addSkillsToResource(this.element as Resource, this.skillsToAdd);
      }
      if (this.skillsToRemove.length > 0) {
        this.element.dataService.removeSkillsFromResource(this.element as Resource, this.skillsToRemove);
      }

      (this.element as Resource).skills.forEach(s => this.oldSkills.push(s.id));
    }

    this.releasesToAdd.forEach(id => this.element.dataService.addResourcesToRelease(id, [this.element.id]));
    this.releasesToRemove.forEach(id => this.element.dataService.removeResourcesFromRelease(id, [this.element.id]));

    (this.element as Resource).releases.forEach(r => this.oldReleases.push(r.id));

    super.update();
  }

  nonSelectedSkills(): Skill[] {
    let elem = this.element as Resource;

    let all = elem.project.skills;
    let skills = elem.skills;

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
