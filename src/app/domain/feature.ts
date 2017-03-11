import {Resource} from "./resource";
import {Skill} from "./skill";
import {Config} from "../config";
import {Log} from "../log";
import {ReplanElement} from "./replan-element";
import {ReplanElemType} from "./replan-elem-type";
import {Record} from "../services/record";
import {RecordType} from "../services/record-type";
import {Project} from "./project";
import {Utils} from "../utils";

export class Feature extends ReplanElement {

  attributes: string[] = ['id', 'name', 'description', 'code', 'effort', 'deadline', 'priority', 'requiredSkillsIds', 'featureDependencyIds'];

  requiredSkillsIds: number[] = [];
  featureDependencyIds: number[] = [];
  project: Project;

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

    let aux = ReplanElement.staticDataService.getCachedFeature(j.id);
    if (aux) return aux;
    else {
      let f = new Feature(
        j.id,
        j.name,
        j.description,
        j.code,
        j.effort,
        j.deadline,
        j.priority,
        Skill.fromJSONArray(j['required_skills']),
        Feature.fromJSONArray(j['depends_on'])
      );
      ReplanElement.staticDataService.cacheElement(f);
      return f;
    }
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
      this.id,  // TODO: Is this actually valid?
      this.name,
      this.description,
      this.code,
      this.effort,
      this.deadline,
      this.priority,
      [],
      []
    );
    if (this.required_skills) this.required_skills.forEach(s => aux.required_skills.push(s));
    if (this.depends_on) this.depends_on.forEach(d => aux.depends_on.push(d));
    aux.oldValues = JSON.parse(JSON.stringify(this.oldValues));
    return aux;
  }

  /* GATEWAY */
  save(): void {
    // No API call to create a Feature
  }

  hasSkill(skill: Skill): Boolean {
    this.required_skills.forEach(s => {
      if (s.id == skill.id) {
        console.log("true");
        return true;
      }
    });
    console.log("false");
    return false;
  }

  addSkill(s: Skill): void {
    this.required_skills.push(s);
  }

  removeSkill(s: Skill): void {
    this.required_skills.splice(this.required_skills.indexOf(s), 1);
  }
}
