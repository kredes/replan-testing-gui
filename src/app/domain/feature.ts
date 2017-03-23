import {Skill} from "./skill";
import {Config} from "../config";
import {Log} from "../log";
import {ReplanElement} from "./replan-element";
import {ReplanElemType} from "./replan-elem-type";
import {Record} from "../services/record";
import {RecordType} from "../services/record-type";
import {Project} from "./project";

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


  static fromJSON(j: any, cache: Boolean): Feature {
    if (!Config.suppressElementCreationMessages) Log.i('Creating Feature from:', j);

    let aux = ReplanElement.staticDataService.getCachedFeature(j.id);
    if (aux) return aux;
    else {
      let skills: Skill[] = j.required_skills ? Skill.fromJSONArray(j.required_skills) : [];
      let dependencies = j.depends_on ? Feature.fromJSONArray(j.depends_on) : [];
      let f = new Feature(
        j.id,
        j.name,
        j.description,
        j.code,
        j.effort,
        j.deadline,
        j.priority,
        skills,
        dependencies
      );
      if (j.depends_on && j.required_skills && cache) ReplanElement.staticDataService.cacheElement(f);
      return f;
    }
  }

  static fromJSONArray(j: any): Feature[] {
    let features: Feature[] = [];
    if (!Config.suppressElementCreationMessages) Log.i('Creating several Features from:', j);
    for (let i = 0; i < j.length; ++i) {
      features.push(Feature.fromJSON(j[i], true));
    }
    return features;
  }


  clone(): ReplanElement {
    let aux = new Feature(
      this.id,  // TODO: Is this actually valid? Doesn't seem to break anything
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
  save(addRecord: Boolean): void {
    this.dataService.createFeature(this)
      .then(response => {
        let feat = Feature.fromJSON(response.json(), false);
        this.attributes.forEach(attr => this[attr] = feat[attr]);

        this.dataService.cacheElement(this);
        if (addRecord) {
          let r = new Record(this, RecordType.CREATION)
          r.response = response;
          this.changeRecordService.addRecord(r);
        }
        this.onElementChange.onElementCreated(this);
      });
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
    if (!this.required_skills) this.required_skills = [];
    this.required_skills.push(s);
  }

  removeSkill(s: Skill): void {
    if (!this.required_skills) return;
    else {
      this.required_skills.splice(this.required_skills.indexOf(s), 1);
    }
  }

  addDependency(f: Feature): void {
    if (!this.depends_on) this.depends_on = [];
    this.depends_on.push(f);
  }

  removeDependency(f: Feature): void {
    if (!this.depends_on) return;
    else {
      this.depends_on.splice(this.depends_on.indexOf(f), 1);
    }
  }
}
