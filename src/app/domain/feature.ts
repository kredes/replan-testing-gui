import {Resource} from "./resource";
import {Skill} from "./skill";
import {Config} from "../config";
import {Log} from "../log";

export class Feature {

  constructor(
    public id: number,
    public code: number,
    public name: string,
    public description: string,
    public effort: number,
    public deadline: string,
    public priority: number,
    public required_skills: Skill[],
    public depends_on: Feature[]
  ) {}


  static fromJSON(j: any): Feature {
    if (!Config.suppressElementCreationMessages) Log.i('Creating Feature from:', j);
    return new Feature(
      j.id,
      j.code,
      j.name,
      j.description,
      j.effort,
      j.deadline,
      j.priority,
      Skill.fromJSONArray(j['required_skills']),
      null // If you try to create the dependencies from here it will crash as
           // the server doesn't provide the full data for them
    );
  }

  static fromJSONArray(j: any): Feature[] {
    let features: Feature[] = [];
    //j.forEach(feature => features.push(this.fromJSON(feature)));
    if (!Config.suppressElementCreationMessages) Log.i('Creating several Features from:', j);
    for (let i = 0; i < j.length; ++i) {
      features.push(Feature.fromJSON(j[i]));
    }

    return features;
  }
}
