/**
 * Created by kredes on 06/02/2017.
 */
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {Project} from "../domain/project";
import {connectableObservableDescriptor} from "rxjs/observable/ConnectableObservable";

@Injectable()
export class ControllerService {
  private apiUrl = 'http://localhost:3000/api/ui/v1';


  constructor(private http: Http) {}
  /*
  getFeatures(projectId): Promise<String[]> {
    return this.http.get(this.apiUrl + `/projects/${projectId}`)
      .toPromise()
      .then(response => response.json() as String)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error ocurred', error);
    return Promise.reject(error.message || error);
  }
  */

  getProject(): Promise<Project> {
    return this.http.get(this.apiUrl + "/projects/1")
      .toPromise()
      .then(response => Project.fromJSON(response.json()))
      .catch(this.handleError);
  };

  getProjectFeatures(project: Project) {

  }

  getFeature(id: number) {

  }


  handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
