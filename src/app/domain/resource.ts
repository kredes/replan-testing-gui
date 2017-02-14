import {Skill} from "./skill";

export class Resource {

  constructor(
    public id: number,
    public name: string,
    public description: string,
    public availability: number,
    public skills: Skill[]
  ) {}


  static fromJSON(j: any): Resource {
    console.log('Creating Resource from:', j);
    return new Resource(
      j.id,
      j.name,
      j.description,
      j.availability,
      Skill.fromJSONArray(j.skills)
    );
  }

  static fromJSONArray(j: any): Resource[] {
    let resources: Resource[] = [];
    j.forEach(resource => resources.push(this.fromJSON(resource)));
    return resources;
  }
}
