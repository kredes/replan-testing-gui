import {Resource} from "./resource";
import {Skill} from "./skill";
import {Config} from "../config";
import {Log} from "../log";
import {ReplanElement} from "./replan-element";
import {ReplanElemType} from "./replan-elem-type";
import {Record} from "../services/record";
import {RecordType} from "../services/record-type";

export class Feature extends ReplanElement {

  attributes: string[] = ['id', 'name', 'description', 'code', 'effort', 'deadline', 'priority', 'requiredSkillsIds', 'featureDependencyIds'];

  requiredSkillsIds: number[] = [];
  featureDependencyIds: number[] = [];

  constructor(
    id: number,
    name: string,
    description: string,
    public code: number,
    public effort: number,
    public deadline: string,
    public priority: number,
    public required_skills: Skill[],
    public depends_on: Feature[]
  ) {
    super(id, name, description, ReplanElemType.FEATURE);
    if (this.required_skills) this.required_skills.forEach(skill => this.requiredSkillsIds.push(skill.id));
    if (this.depends_on) this.depends_on.forEach(feature => this.featureDependencyIds.push(feature.id));

    this.attributes.forEach(attr => this.addChange(attr, this[attr]));
  }


  static fromJSON(j: any): Feature {
    if (!Config.suppressElementCreationMessages) Log.i('Creating Feature from:', j);
    return new Feature(
      j.id,
      j.name,
      j.description,
      j.code,
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


  clone(): ReplanElement {
    let aux = new Feature(
      this.id,
      this.name,
      this.description,
      this.code,
      this.effort,
      this.deadline,
      this.priority,
      this.required_skills,
      this.depends_on,  // TODO: Not a good idea at all to pass my own array of things on a clone()!
    );
    aux.oldValues = JSON.parse(JSON.stringify(this.oldValues));
    return aux;
  }

  /* GATEWAY */
  save(): void {
    // No API call to create a Feature
  }
}
