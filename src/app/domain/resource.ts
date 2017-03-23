import {Skill} from "./skill";
import {Config} from "../config";
import {Log} from "../log";
import {ReplanElement} from "./replan-element";
import {ReplanElemType} from "./replan-elem-type";
import {Record} from "../services/record";
import {RecordType} from "../services/record-type";
import {Project} from "./project";
import {OnChanges} from "@angular/core";
import {Release} from "./release";

export class Resource extends ReplanElement implements OnChanges {

  attributes: string[] = ['id', 'name', 'description', 'availability', 'skillIds'];

  skillIds: number[] = [];
  project: Project;
  releases: Release[] = [];

  constructor(
    id: number,
    name: string,
    description: string,
    public availability: number,
    public skills: Skill[]
  ) {
    super(id, name, description, ReplanElemType.RESOURCE);
    if (this.skills) this.skills.forEach(skill => this.skillIds.push(skill.id));

    this.attributes.forEach(attr => this.addChange(attr, this[attr]));
  }

  static fromJSON(j: any, cache: Boolean): Resource {
    if (!Config.suppressElementCreationMessages) Log.i('Creating Resource from:', j);


    let aux = ReplanElement.staticDataService.getCachedResource(j.id);
    if (aux) return aux;
    else {
      let res = new Resource(
        j.id,
        j.name,
        j.description,
        j.availability,
        Skill.fromJSONArray(j.skills)
      );
      if (cache) ReplanElement.staticDataService.cacheElement(res);
      return res;
    }
  }

  static fromJSONArray(j: any): Resource[] {
    if (!Config.suppressElementCreationMessages) Log.i('Creating several resources from:', j);
    let resources: Resource[] = [];
    j.forEach(resource => resources.push(this.fromJSON(resource, true)));
    return resources;
  }


  clone(): ReplanElement {
    let aux = new Resource(
      this.id,
      this.name,
      this.description,
      this.availability,
      []
    );
    aux.project = this.project;
    if (this.releases) this.releases.forEach(r => aux.addRelease(r));
    if (this.skills) this.skills.forEach(s => aux.skills.push(s));
    aux.oldValues = JSON.parse(JSON.stringify(this.oldValues));
    aux.onElementChange = this.onElementChange;
    return aux;
  }

  /* GATEWAY */
  save(addRecord: Boolean): void {
    this.dataService.createResource(this)
      .then(response => {
        let res = Resource.fromJSON(response.json(), false);
        this.attributes.forEach(attr => this[attr] = res[attr]);

        this.dataService.cacheElement(this);

        if (addRecord) {
          let r = new Record(this, RecordType.CREATION);
          r.response = response;
          this.changeRecordService.addRecord(r);
        }
        this.onElementChange.onElementCreated(this);
      });
  }

  ngOnChanges(): void {
    console.log("Project of resource", this.id, this.project);
  }

  hasSkill(skill: Skill): Boolean {
    this.skills.forEach(s => {
      if (s.id == skill.id) return true;
    });
    return false;
  }

  addRelease(r: Release): void {
    if (!this.releases) this.releases = [];
    this.releases.push(r);
  }

  removeRelease(r: Release): void {
    if (!this.releases) return;
    else this.releases.splice(this.releases.indexOf(r), 1);
  }

  addSkill(s: Skill): void {
    if (!this.skills) this.skills = [];
    this.skills.push(s);
  }

  removeSkill(s: Skill): void {
    if (!this.skills) return;
    else this.skills.splice(this.skills.indexOf(s), 1);
  }
}
