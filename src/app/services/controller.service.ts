import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {Project} from "../domain/project";
import {Feature} from "../domain/feature";
import {Resource} from "../domain/resource";
import {Skill} from "../domain/skill";
import {Release} from "../domain/release";
import {ReplanElement} from "../domain/replan-element";
import {ReplanElemType} from "../domain/replan-elem-type";

@Injectable()
export class ControllerService {
  private apiUrl = 'http://localhost:3000/api/ui/v1';
  private basePath = 'http://localhost:3000/api/ui/v1/projects/1';

  /* My little cache indexed by id */
  // TODO: Simplify to {ReplanElemType: [{id: element}]}
  private projects: Object = {};
  private resources: Object = {};
  private features: Object = {};
  private releases: Object = {};
  private skills: Object = {};

  constructor(private http: Http) {}


  /* GENERIC METHODS */
  removeElement(element: ReplanElement): Promise<Object> {
    switch (element.type) {
      case ReplanElemType.PROJECT:
        break;
      case ReplanElemType.RESOURCE:
        return this.deleteResource(element as Resource);
      case ReplanElemType.SKILL:
        break;
      case ReplanElemType.FEATURE:
        break;
      case ReplanElemType.RELEASE:
        break;
    }
    return null;
  }

  createElement(element: ReplanElement): Promise<any> {
    switch (element.type) {
      case ReplanElemType.PROJECT:
        break;
      case ReplanElemType.RESOURCE:
        return this.createResource(element as Resource, 1);
      case ReplanElemType.SKILL:
        break;
      case ReplanElemType.FEATURE:
        break;
      case ReplanElemType.RELEASE:
        break;
    }
    return null;
  }

  updateElement(element: ReplanElement): Promise<Object> {
    switch (element.type) {
      case ReplanElemType.PROJECT:
        return this.updateProject(element as Project);
      case ReplanElemType.FEATURE:
        return this.updateFeature(element as Feature);
      case ReplanElemType.RESOURCE:
        return this.updateResource(element as Resource);
      case ReplanElemType.RELEASE:
        return this.updateRelease(element as Release);
      case ReplanElemType.SKILL:
        return this.updateSkill(element as Skill);
    }
  }

  cacheElement(element: ReplanElement): void {
    switch (element.type) {
      case ReplanElemType.PROJECT:
        this.projects[element.id] = element;
        break;
      case ReplanElemType.FEATURE:
        this.features[element.id] = element;
        break;
      case ReplanElemType.RESOURCE:
        this.resources[element.id] = element;
        break;
      case ReplanElemType.RELEASE:
        this.releases[element.id] = element;
        break;
      case ReplanElemType.SKILL:
        this.skills[element.id] = element;
        break;
    }
  }

  uncacheElement(element : ReplanElement): void {
    switch (element.type) {
      case ReplanElemType.PROJECT:
        delete this.projects[element.id];
        break;
      case ReplanElemType.FEATURE:
        delete this.features[element.id];
        break;
      case ReplanElemType.RESOURCE:
        delete this.resources[element.id];
        break;
      case ReplanElemType.RELEASE:
        delete this.releases[element.id];
        break;
      case ReplanElemType.SKILL:
        delete this.skills[element.id];
        break;
    }
  }

  handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }


  /* GETTERS */
  // TODO: Implement cache for all methods, not only Resources
  getProject(id: number): Promise<Project> {
    return this.http.get(this.apiUrl + "/projects/" + id)
      .toPromise()
      .then(response => Project.fromJSON(response.json()))
      .catch(this.handleError);
  };

  getOriginalElement(copy: ReplanElement): Promise<ReplanElement> {
    let id = copy.id;
    let element: ReplanElement;
    switch (copy.type) {
      case ReplanElemType.PROJECT:
        element = this.projects[id];
        break;
      case ReplanElemType.RESOURCE:
        element = this.resources[id];
        break;
      case ReplanElemType.RELEASE:
        element = this.releases[id];
        break;
      case ReplanElemType.FEATURE:
        element = this.features[id];
        break;
      case ReplanElemType.SKILL:
        element = this.skills[id];
        break;
    }
    return Promise.resolve(element);
  }

  getProjectFeatures(project: Project) {

  }

  getFeature(id: number) {

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
    if (element instanceof Project || element instanceof Release) {
      console.log(element);
      let resourceIds = element.resourceIds;

      // Get as many cached resources as possible.
      // Ideally, I should have all them cached at this point. But who knows.
      let resources: Resource[] = [];
      let found: Boolean[] = Array(resourceIds.length);
      if (Object.keys(this.resources).length > 0) {
        resourceIds.forEach((id, index) => {
          if (id in this.resources) {
            resources.push(this.resources[id]);
            found[index] = true;
          }
        });
        console.debug("Found", resources.length, "out of", element.resourceIds.length, "resources in cache.");
      }

      // Get the remaining resources (if any) from the server
      if (resourceIds.length > resources.length) {
        console.debug("Fetching from server.");
        return this.http.get(this.basePath + '/resources')
          .toPromise()
          .then(response => {
            let serverResources = Resource.fromJSONArray(response.json());
            serverResources.forEach(resource => {
              let index = resourceIds.indexOf(resource.id);
              if (index > -1 && found[index] != true) {
                resources.push(resource);
                resourceIds.splice(index, 1);
              }
            });
            if (resourceIds.length > 0) throw "Some resources were not fetched. This should never ever happen.";
            return resources;
          })
          .catch(this.handleError);
      } else {
        return Promise.resolve(resources);
      }
    } else {
      console.error("The element supplied cannnot have resources associated.");
    }
    return null;
  }

  getSkillsOf(element: any): Promise<Skill[]> {
    let path: string = null;

    if (element instanceof Project) path = this.basePath + '/skills';
    else if (element instanceof Feature) return Promise.resolve(element.required_skills);
    else if (element instanceof Resource) return Promise.resolve(element.skills);

    if (path) {
      return this.http.get(path)
        .toPromise()
        .then(response => Skill.fromJSONArray(response.json()))
        .catch(this.handleError);
    } else {
      console.error("The element supplied cannnot have skills associated.");
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
      console.error("The element supplied cannnot have releases associated.");
    }
    return null;
  }


  /* CREATIONS */
  createRelease(release: Release): Promise<any> {
    let body: Object = {
      'name': release.name,
      'description': release.description,
      'deadline': release.deadline
    };
    return this.http.post(this.basePath + '/releases', body)
      .toPromise()
      .then(response => {
        this.cacheElement(release);
        return response;
      })
      .catch(this.handleError);
  }

  createResource(resource: Resource, projectId: number): Promise<any> {
    let body: Object = {
      'name': resource.name,
      'description': resource.description,
      'availability': resource.availability
    };
    return this.http.post(this.basePath + '/resources', body)
      .toPromise()
      .then(response => {
        this.cacheElement(resource);
        return response;
      })
      .catch(this.handleError);
  }

  createSkill(skill: Skill): Promise<any> {
    let body: Object = {
      'name': skill.name,
      'description': skill.description
    };
    return this.http.post(this.basePath + '/skills', body)
      .toPromise()
      .then(response => {
        this.cacheElement(skill);
        return response;
      })
      .catch(this.handleError);
  }


  /* DELETES */
  deleteResource(resource: Resource): Promise<any> {
    return this.http.delete(this.basePath + '/resources/' + resource.id)
      .toPromise()
      .then(response => {
        this.uncacheElement(resource);
        return response;
      })
      .catch(this.handleError);
  }

  deleteSkill(skill: Skill): Promise<any> {
    return this.http.delete(this.basePath + '/skills/' + skill.id)
      .toPromise()
      .then(response => {
        this.uncacheElement(skill);
        return response;
      })
      .catch(this.handleError);
  }

  deleteRelease(release: Release): Promise<any> {
    return this.http.delete(this.basePath + '/releases/' + release.id)
      .toPromise()
      .then(response => {
        this.uncacheElement(release);
        return response;
      })
      .catch(this.handleError);
  }


  /* UPDATES */
  updateFeature(feature: Feature): Promise<Object> {
    let body: Object = {
      'name': feature.name,
      'description': feature.description,
      'effort': feature.effort,
      'deadline': feature.deadline,
      'priority': feature.priority
    };
    return this.http.put(this.basePath + '/features/' + feature.id, body)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }

  updateProject(project: Project): Promise<Object> {
    let body: Object = {
      'effort_unit': project.effort_unit,
      'hours_per_effort_unit': project.hours_per_effort_unit,
      'hours_per_week_and_full_time_resource': project.hours_per_week_and_full_time_resource
    };
    return this.http.put(this.basePath, body)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }

  updateRelease(release: Release): Promise<Object> {
    let body: Object = {
      'name': release.name,
      'description': release.description,
      'deadline': release.deadline
    };
    return this.http.put(this.basePath + '/releases/' + release.id, body)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }

  updateResource(resource: Resource): Promise<Object> {
    let body: Object = {
      'name': resource.name,
      'availability': resource.availability,
      'description': resource.description
    };
    return this.http.put(this.basePath + '/resources/' + resource.id, body)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }

  updateSkill(skill: Skill): Promise<Object> {
    let body: Object = {
      'name': skill.name,
      'description': skill.description
    };
    return this.http.put(this.basePath + '/skills/' + skill.id, body)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }


  /* ADD X TO Y */
  // Coming soon
}
