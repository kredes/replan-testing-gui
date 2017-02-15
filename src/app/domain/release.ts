import {Resource} from "./resource";
import {Config} from "../config";
import {Log} from "../log";
export class Release {

  constructor(
    public id: number,
    public name: string,
    public description: string,
    public deadline: string,
    public resources: Resource[]
  ) {}

  setDummyValues() {
    this.id = 1;
    this.name = "My dummy release";
    this.description = "A dummy release used to test the html template used for every other release";
    this.deadline = "05/05/2017";
  }

  static fromJSON(j: any): Release {
    if (!Config.suppressElementCreationMessages) Log.i('Creating Release from:', j);
    return new Release(
      j.id,
      j.name,
      j.description,
      j.deadline,
      Resource.fromJSONArray(j.resources)
    );
  }

  static fromJSONArray(j: any): Release[] {
    let releases: Release[] = [];
    j.forEach(release => releases.push(this.fromJSON(release)));
    return releases;
  }
}
