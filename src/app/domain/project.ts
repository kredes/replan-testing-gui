import {Resource} from "./resource";
import {Feature} from "./feature";
import {Config} from "../config";
import {Log} from "../log";
import {ReplanElement} from "./replan-element";
import {ReplanElemType} from "./replan-elem-type";
import {Record} from "../services/record";
import {RecordType} from "../services/record-type";
import {Skill} from "./skill";
import {Release} from "./release";
import {Utils} from "../utils";

export class Project extends ReplanElement {

  resourceIds: number[] = [];

  skills: Skill[];
  features: Feature[];
  releases: Release[];

  constructor(
    id: number,
    name: string,
    description: string,
    public effort_unit: string,
    public hours_per_effort_unit: string,
    public hours_per_week_and_full_time_resource: string,
    public resources: Resource[]
  ) {
    super(id, name, description, ReplanElemType.PROJECT);



    //Utils.waitUntilExists(this.skills);
    //Utils.waitUntilExists(this.features);
    //Utils.waitUntilExists(this.releases);

    this.addChange('effort_unit', this.effort_unit);
    this.addChange('hours_per_effort_unit', this.hours_per_effort_unit);
    this.addChange('hours_per_week_and_full_time_resource', this.hours_per_week_and_full_time_resource);
    //this.addChange('resources', this.resources);
    this.addChange('resourceIds', this.resourceIds);
  }

  loadAsyncData(): void {
    this.dataService.getResourcesOf(this)
      .then(resources => {
        this.resources = resources;
        this.resources.forEach(resource => {
          this.resourceIds.push(resource.id);
          resource.project = this;
        });
        this.loaded = true;
      });

    this.dataService.getSkillsOf(this)
      .then(skills => {
        this.skills = skills
      });

    this.dataService.getFeaturesOf(this)
      .then(features => {
        this.features = features;
        this.features.forEach(feature => feature.project = this);
      });

    this.dataService.getReleasesOf(this)
      .then(releases => {
        this.releases = releases;
        this.releases.forEach(r => r.project = this);
      });
  }

  getSkills(): Skill[] {
    let aux: Skill[];
    this.dataService.getSkillsOf(this)
      .then(skills => aux = skills);
    Utils.waitUntilExists(aux);
    console.log(aux);
    return aux;
  }

  static fromJSON(j: any, cache: Boolean): Project {
    if (!Config.suppressElementCreationMessages) Log.i('Creating Project from:', j);

    let aux = ReplanElement.staticDataService.getCachedProject(j.id);
    if (aux) return aux;
    else {
      let p = new Project(
        j.id,
        j.name,
        j.description,
        j.effort_unit,
        j.hours_per_effort_unit,
        j.hours_per_week_and_full_time_resource,
        Resource.fromJSONArray(j.resources)
      );
      if (cache) ReplanElement.staticDataService.cacheElement(p);
      return p;
    }
  }

  static fromJSONArray(j: any): Project[] {
    let projects: Project[] = [];
    j.forEach(project => projects.push(this.fromJSON(project, true)));
    return projects;
  }

  static fromJSONSimple(j: any, cache: Boolean): Project {
    if (!Config.suppressElementCreationMessages) Log.i('Creating simple Project from:', j);

    let aux = ReplanElement.staticDataService.getCachedProject(j.id);
    if (aux) return aux;
    else {
      let p = new Project(
        j.id,
        j.name,
        j.description,
        j.effort_unit,
        j.hours_per_effort_unit,
        j.hours_per_week_and_full_time_resource,
        []
      );
      if (cache) ReplanElement.staticDataService.cacheElement(p);
      return p;
    }
  }

  static fromJSONArraySimple(j: any): Project[] {
    let projects: Project[] = [];
    j.forEach(project => projects.push(this.fromJSONSimple(project, false)));
    return projects;
  }


  clone(): ReplanElement {
    let aux = new Project(
      this.id,
      this.name,
      this.description,
      this.effort_unit,
      this.hours_per_effort_unit,
      this.hours_per_week_and_full_time_resource,
      []
    );
    if (this.resources) this.resources.forEach(r => aux.resources.push(r));
    aux.oldValues = JSON.parse(JSON.stringify(this.oldValues));
    return aux;
  }

  /* GATEWAY */
  save(addRecord: Boolean): void {
    this.dataService.createProject(this)
      .then(response => {
        let proj = Project.fromJSON(response.json(), false);
        this.attributes.forEach(attr => this[attr] = proj[attr]);

        /*
          A small detail here: When I create proj above it gets cached, but the cache version is then replaced
          with this object on this statement. This is nice.
         */
        this.dataService.cacheElement(this);
        if (addRecord) this.changeRecordService.addRecord(new Record(this, RecordType.CREATION));
        this.onElementChange.onElementCreated(this);
      });
  }
}
