import {Skill} from "./skill";
import {Config} from "../config";
import {Log} from "../log";
import {ReplanElement} from "./replan-element";
import {ReplanElemType} from "./replan-elem-type";
import {Record} from "../services/record";
import {RecordType} from "../services/record-type";

export class Resource extends ReplanElement {

  attributes: string[] = ['id', 'name', 'description', 'availability', 'skillIds'];

  skillIds: number[] = [];

  constructor(
    id: number,
    name: string,
    description: string,
    public availability: number,
    public skills: Skill[]
  ) {
    super(id, name, description, ReplanElemType.RESOURCE);
    if (this.skills) this.skills.forEach(skill => this.skillIds.push(skill.id));

    this.attributes.forEach(attr => this.addChange(attr, this[attr]));

    console.log("Resource", this.name, "has the following Skills", this.skills);
  }



  static fromJSON(j: any, cache: Boolean): Resource {
    if (!Config.suppressElementCreationMessages) Log.i('Creating Resource from:', j);
    // TODO: If dataService.getResource(id) is not null (is cached)...
    let res = new Resource(
      j.id,
      j.name,
      j.description,
      j.availability,
      Skill.fromJSONArray(j.skills)
    );
    if(cache) ReplanElement.staticDataService.cacheElement(res);
    return res;
  }

  static fromJSONArray(j: any): Resource[] {
    let resources: Resource[] = [];
    j.forEach(resource => resources.push(this.fromJSON(resource, true)));
    return resources;
  }


  clone(): ReplanElement {
    let aux = new Resource(
      this.id,
      this.name,
      this.description,
      this.availability,
      this.skills
    );
    aux.oldValues = JSON.parse(JSON.stringify(this.oldValues));
    aux.onElementChange = this.onElementChange;
    return aux;
  }

  /* GATEWAY */
  save(addRecord: Boolean): void {
    this.dataService.createResource(this, 1)
      .then(response => {
        let res = Resource.fromJSON(response.json(), false);
        this.attributes.forEach(attr => this[attr] = res[attr]);

        if (addRecord) this.changeRecordService.addRecord(new Record(this, RecordType.CREATION));
        this.onElementChange.onElementCreated(this);
      });
  }
}
