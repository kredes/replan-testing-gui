import {Resource} from "./resource";
import {Skill} from "./skill";

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
    console.log('Creating Feature from:', j);
    return new Feature(
      j.id,
      j.code,
      j.name,
      j.description,
      j.effort,
      j.deadline,
      j.priority,
      Skill.fromJSONArray(j.required_skills),
      Feature.fromJSONArray(j.depends_on)
    );
  }

  static fromJSONArray(j: any): Feature[] {
    let features: Feature[] = [];
    j.forEach(feature => features.push(this.fromJSON(feature)));
    return features;
  }
}
