import {Resource} from "./resource";
import {Feature} from "./feature";
import {Config} from "../config";
import {Log} from "../log";

export class Project {

  constructor(
    public id: number,
    public name: string,
    public description: string,
    public effort_unit: string,
    public hours_per_effort_unit: string,
    public hours_per_week_and_full_time_resource: string,
    public resources: Resource[]
  ) {}

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
}
