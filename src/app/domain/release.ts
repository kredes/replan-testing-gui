import {Resource} from "./resource";
import {Config} from "../config";
import {Log} from "../log";
import {ReplanElement} from "./replan-element";
import {ReplanElemType} from "./replan-elem-type";
import {Record} from "../services/record";
import {RecordType} from "../services/record-type";

export class Release extends ReplanElement {

  attributes: string[] = ['id', 'name', 'description', 'deadline', 'resourceIds'];
  resourceIds: number[] = [];

  constructor(
    id: number,
    name: string,
    description: string,
    public deadline: string,
    public resources: Resource[]
  ) {
    super(id, name, description, ReplanElemType.RELEASE);
    if (this.resources) this.resources.forEach(resource => this.resourceIds.push(resource.id));

    this.attributes.forEach(attr => this.addChange(attr, this[attr]));
    this.resources.forEach(r => r.release = this);
  }

  static fromJSON(j: any, cache: Boolean): Release {
    if (!Config.suppressElementCreationMessages) Log.i('Creating Release from:', j);
    let rel = new Release(
      j.id,
      j.name,
      j.description,
      j.deadline,
      Resource.fromJSONArray(j.resources)
    );
    if (cache) ReplanElement.staticDataService.cacheElement(rel);
    return rel;
  }

  static fromJSONArray(j: any): Release[] {
    let releases: Release[] = [];
    j.forEach(release => releases.push(this.fromJSON(release, true)));
    return releases;
  }


  clone(): ReplanElement {
    let aux = new Release(
      this.id,
      this.name,
      this.description,
      this.deadline,
      this.resources
    );
    aux.oldValues = JSON.parse(JSON.stringify(this.oldValues));
    return aux;
  }

  /* GATEWAY */
  save(addRecord: Boolean): void {
    this.dataService.createRelease(this)
      .then(response => {
        let res = Release.fromJSON(response.json(), false);
        this.attributes.forEach(attr => this[attr] = res[attr]);
        this.dataService.cacheElement(this)

        if (addRecord) this.changeRecordService.addRecord(new Record(this, RecordType.CREATION));

        this.onElementChange.onElementCreated(this);
      });
  }
}
