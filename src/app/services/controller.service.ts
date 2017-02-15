/**
 * Created by kredes on 06/02/2017.
 */
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {Project} from "../domain/project";
import {connectableObservableDescriptor} from "rxjs/observable/ConnectableObservable";
import {Feature} from "../domain/feature";
import {Resource} from "../domain/resource";
import {Skill} from "../domain/skill";
import {Release} from "../domain/release";

@Injectable()
export class ControllerService {
  private apiUrl = 'http://localhost:3000/api/ui/v1';
  private basePath = 'http://localhost:3000/api/ui/v1/projects/1';

  private paths = {
    'project': {
      'base': '/projects/1',
      'features': '/features',
      'feature': '/features/?',
      'resources': '/resources',
      'releases': '/releases',
      'release': '/releases/?',
      'skills': '/skills',
    },
    'feature': {
      'base': '/projects/?/feature/?',
      'skills': '/skills',
      'features': '/dependencies'
    },
    'release': {
      'base': '/projects/?/releases/?',
      'features': '/features',
      'plan': '/plan'
    }
  };


  constructor(private http: Http) {}

  getProject(id: number): Promise<Project> {
    return this.http.get(this.apiUrl + "/projects/" + id)
      .toPromise()
      .then(response => Project.fromJSON(response.json()))
      .catch(this.handleError);
  };

  getProjectFeatures(project: Project) {

  }

  getFeature(id: number) {

  }

  contains(array: any[], element: any) {
    return array.indexOf(element) > -1;
  }

  getFeaturesOf(element: any): Promise<Feature[]> {
    let path: string = null;

    if (element instanceof Project) path = this.basePath + '/features';
    else if (element instanceof Release) path = this.basePath + '/releases/' + element.id + '/features';
    else if (element instanceof Feature) path = this.basePath + '/features/' + element.id + '/features';

    if (path) {
      return this.http.get(path)
        .toPromise()
        .then(response => {
          console.log("RESPONSE:", response.json());
          return Feature.fromJSONArray(response.json());
        })
        .catch(this.handleError);
    } else {
      console.error("The element supplied cannnot have resources.");
    }
    return null;
  }

  getResourcesOf(element: any): Promise<Resource[]> {
    if (element instanceof Project) {
      return this.http.get(this.basePath + '/resources')
        .toPromise()
        .then(response => Resource.fromJSONArray(response.json()))
        .catch(this.handleError);
    } else {
      console.error("The element supplied cannnot have resources.");
    }
    return null;
  }

  getSkillsOf(element: any): Promise<Skill[]> {
    let path: string = null;

    if (element instanceof Project) path = this.basePath + '/skills';
    else if (element instanceof Feature) path = this.basePath + '/features/' + element.id + '/skills';

    if (path) {
      return this.http.get(path)
        .toPromise()
        .then(response => Skill.fromJSONArray(response.json()))
        .catch(this.handleError);
    } else {
      console.error("The element supplied cannnot have resources.");
    }
    return null;
  }

  getReleasesOf(element: any): Promise<Release[]> {
    if (element instanceof Project) {
      return this.http.get(this.basePath + '/releases')
        .toPromise()
        .then(response => Release.fromJSONArray(response.json()))
        .catch(this.handleError);
    } else {
      console.error("The element supplied cannnot have resources.");
    }
    return null;
  }

  /* -------- */
  updateFeature(feature: Feature): Promise<Object> {
    let body: Object = {
      'name': feature.name,
      'description': feature.description,
      'effort': feature.effort,
      'deadline': feature.deadline,
      'priority': feature.priority
    }
    return this.http.put(this.basePath + '/features/' + feature.id, body)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }



  handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
