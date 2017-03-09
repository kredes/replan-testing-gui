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
    this.resources.forEach(resource => {
      this.resourceIds.push(resource.id);
      resource.project = this;
    });

    this.dataService.getSkillsOf(this)
      .then(skills =>  this.skills = skills);

    this.dataService.getFeaturesOf(this)
      .then(features => {
        this.features = features;
        features.forEach(feature => feature.project = this);
      });

    this.dataService.getReleasesOf(this)
      .then(releases => this.releases = releases);

    this.addChange('effort_unit', this.effort_unit);
    this.addChange('hours_per_effort_unit', this.hours_per_effort_unit);
    this.addChange('hours_per_week_and_full_time_resource', this.hours_per_week_and_full_time_resource);
    this.addChange('resources', this.resources);
    this.addChange('resourceIds', this.resourceIds);
  }

  getSkills(): Skill[] {
    let aux: Skill[];
    this.dataService.getSkillsOf(this)
      .then(skills => aux = skills);
    console.log(aux);
    return aux;
  }

  static fromJSON(j: any): Project {
    if (!Config.suppressElementCreationMessages) Log.i('Creating Project from:', j);
    return new Project(
      j.id,
      j.name,
      j.description,
      j.effort_unit,
      j.hours_per_effort_unit,
      j.hours_per_week_and_full_time_resource,
      Resource.fromJSONArray(j.resources)
    );
  }

  static fromJSONArray(j: any): Project[] {
    let projects: Project[] = [];
    j.forEach(project => projects.push(this.fromJSON(project)));
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
      this.resources
    );
    aux.oldValues = JSON.parse(JSON.stringify(this.oldValues));
    return aux;
  }

  /* GATEWAY */
  save(): void {
    // TODO: There's a new call for this now
  }
}
