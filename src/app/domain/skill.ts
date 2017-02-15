import {Config} from "../config";
import {Log} from "../log";
export class Skill {

  constructor(
    public id: number,
    public name: string,
    public description: string
  ) {}

  setDummyValues() {
    this.id = 1;
    this.name = "My dummy skill";
    this.description = "A dummy skill used to test the html template used for every other skill";
  }

  static fromJSON(j: any): Skill {
    if (!Config.suppressElementCreationMessages) Log.i('Creating Skill from:', j);
    return new Skill(
      j.id,
      j.name,
      j.description
    );
  }

  static fromJSONArray(j: any): Skill[] {
    if (!Config.suppressElementCreationMessages) Log.i('Creating several Skills from:', j);
    let skills: Skill[] = [];
    j.forEach(skill => skills.push(this.fromJSON(skill)));
    return skills;
  }
}
