import {Config} from "../config";
import {Log} from "../log";
import {ReplanElement} from "./replan-element";
import {ReplanElemType} from "./replan-elem-type";
import {Record} from "../services/record";
import {RecordType} from "../services/record-type";

export class Skill extends ReplanElement {

  attributes: string[] = ['id', 'name', 'description'];
  static cache: Object = {};

  constructor(
    id: number,
    name: string,
    description: string
  ) {
    super(id, name, description, ReplanElemType.SKILL);
    this.attributes.forEach(attr => this.addChange(attr, this[attr]));
  }

  static fromJSON(j: any, cache: Boolean): Skill {
    if (!Config.suppressElementCreationMessages) Log.i('Creating Skill from:', j);

    let aux = ReplanElement.staticDataService.getCachedSkill(j.id);
    if (aux) return aux;
    else {
      let s = new Skill(
        j.id,
        j.name,
        j.description
      );
      if (cache) {
        ReplanElement.staticDataService.cacheElement(s);
      }
      return s;
    }
  }

  static getById(id: number): Skill {
    return this.cache[id];
  }

  static clearCache(): void {
    this.cache = [];
  }

  static fromJSONArray(j: any): Skill[] {
    if (!Config.suppressElementCreationMessages) Log.i('Creating several Skills from:', j);
    let skills: Skill[] = [];
    j.forEach(skill => skills.push(Skill.fromJSON(skill, true)));
    return skills;
  }


  clone(): ReplanElement {
    let aux = new Skill(
      this.id,
      this.name,
      this.description
    );
    aux.oldValues = JSON.parse(JSON.stringify(this.oldValues));
    return aux;
  }

  /* GATEWAY */
  save(addRecord: Boolean): void {
    this.dataService.createSkill(this)
      .then(response => {
        if (response['ok']) {
          let res = Skill.fromJSON(response.json(), false);
          this.attributes.forEach(attr => this[attr] = res[attr]);

          this.dataService.cacheElement(this);
          this.onElementChange.onElementCreated(this);
        }
        if (addRecord) {
          let r = new Record(this, RecordType.CREATION);
          r.response = response;
          this.changeRecordService.addRecord(r);
        }
      });
  }
}
