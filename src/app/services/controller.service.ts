import {Injectable} from "@angular/core";
import {Http, URLSearchParams, RequestOptions} from "@angular/http";
import "rxjs/add/operator/toPromise";
import {Project} from "../domain/project";
import {Feature} from "../domain/feature";
import {Resource} from "../domain/resource";
import {Skill} from "../domain/skill";
import {Release} from "../domain/release";
import {ReplanElement} from "../domain/replan-element";
import {ReplanElemType} from "../domain/replan-elem-type";

@Injectable()
export class ControllerService {
  private _apiUrl = 'http://platform.supersede.eu:8280/replan';
  //private _apiUrl = 'http://62.14.219.13:8280/replan';
  //private _apiUrl = 'https://replan-project-carlesf.c9users.io/api/ui/v1';
  //private _apiUrl = 'http://localhost:3000/api/ui/v1';

  private basePath: string;
  currentProjectId: number;
  previousProjectId: number;


  private projects: Object = {};
  private resources: Object = {};
  private features: Object = {};
  private releases: Object = {};
  private skills: Object = {};

  constructor(private http: Http) {
    this.setActiveProject(1);
  }


  set apiUrl(url: string) {
    this._apiUrl = url;
  }
  get apiUrl(): string {
    return this._apiUrl;
  }

  setActiveProject(projId: number) {
    this.previousProjectId = this.currentProjectId;
    this.currentProjectId = projId;
    this.basePath = this.apiUrl + '/projects/' + projId;
  }
  restorePreviousActiveProject(): void {
    let aux = this.previousProjectId;
    this.previousProjectId = this.currentProjectId;
    this.currentProjectId = aux;
  }

  clearCache(): void {
    this.features = {};
    this.projects = {};
    this.resources = {};
    this.releases = {};
    this.skills = {};
    console.info("All caches cleared");
  }

  /* GENERIC METHODS */
  removeElement(element: ReplanElement): Promise<Object> {
    switch (element.type) {
      case ReplanElemType.PROJECT:
        return this.deleteProject(element as Project);
      case ReplanElemType.RESOURCE:
        return this.deleteResource(element as Resource);
      case ReplanElemType.SKILL:
        return this.deleteSkill(element as Skill);
      case ReplanElemType.FEATURE:
        return this.deleteFeature(element as Feature);
      case ReplanElemType.RELEASE:
        return this.deleteRelease(element as Release);
    }
    return null;
  }

  createElement(element: ReplanElement): Promise<any> {
    switch (element.type) {
      case ReplanElemType.PROJECT:
        break;
      case ReplanElemType.RESOURCE:
        return this.createResource(element as Resource);
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
  getAllProjects(): Promise<Project[]> {
    return this.http.get(this.apiUrl + "/projects")
      .toPromise()
      .then(response => {
        let projects: Project[] = [];

        response.json().forEach(jsonFeat => {
          if (jsonFeat.id in this.projects) {
            //console.log("Project: cache hit");
            projects.push(this.projects[jsonFeat.id]);
          }
          else {
            //console.log("Project: cache miss");
            projects.push(Project.fromJSON(jsonFeat, true));
          }
        });
        return projects;
        //return Project.fromJSONArray(response.json();
      })
      .catch(this.handleError);
  }

  getAllProjectsSimple(): Promise<Project[]> {
    return this.http.get(this.apiUrl + "/projects")
      .toPromise()
      .then(response => Project.fromJSONArraySimple(response.json()))
      .catch(this.handleError);
  }

  getReleasePlan(release: Release): Promise<any> {
    return this.http.get(this.basePath + '/releases/' + release.id + '/plan')
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }

  getCachedProject(id: number): Project {
    if (this.projects[id]) return this.projects[id];
    else return null;
  }
  getCachedRelease(id: number): Release {
    if (this.releases[id]) return this.releases[id];
    else return null;
  }
  getCachedFeature(id: number): Feature {
    if (this.features[id]) return this.features[id];
    else return null;
  }
  getCachedSkill(id: number): Skill {
    if (this.skills[id]) return this.skills[id];
    else return null;
  }
  getCachedResource(id: number): Resource {
    if (this.resources[id]) return this.resources[id];
    else return null;
  }

  getProject(id: number): Promise<Project> {
    let aux = this.getCachedProject(id);
    if (aux) return Promise.resolve(aux);
    else return this.http.get(this.apiUrl + "/projects/" + id)
      .toPromise()
      .then(response => Project.fromJSON(response.json(), true))
      .catch(this.handleError);
  };
  getRelease(id: number): Promise<Release> {
    let aux = this.getCachedRelease(id);
    if (aux) return Promise.resolve(aux);
    else {
      throw "You shouldn't be using this right now";
    }
  }
  getFeature(id: number): Promise<Feature> {
    let aux = this.getCachedFeature(id);
    if (aux) return Promise.resolve(aux);
    else {
      throw "You shouldn't be using this right now";
    }
  }
  getSkill(id: number): Promise<Skill> {
    let aux = this.getCachedSkill(id);
    if (aux) return Promise.resolve(aux);
    else {
      throw "You shouldn't be using this right now";
    }
  }
  getResource(id: number): Promise<Resource> {
    let aux = this.getCachedResource(id);
    if (aux) return Promise.resolve(aux);
    else {
      throw "You shouldn't be using this right now";
    }
  }


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

  getFeaturesOf(element: any): Promise<Feature[]> {
    let path: string = null;

    if (element instanceof Project) path = this.basePath + '/features';
    else if (element instanceof Release) path = this.basePath + '/releases/' + element.id + '/features';
    else if (element instanceof Feature) path = this.basePath + '/features/' + element.id + '/features';

    if (path) {
      return this.http.get(path)
        .toPromise()
        .then(response => {
          let features: Feature[] = [];

          response.json().forEach(jsonFeat => {
            if (jsonFeat.id in this.features) {
              //console.log("Feature: cache hit");
              features.push(this.features[jsonFeat.id]);
            }
            else {
              //console.log("Feature: cache miss");
              features.push(Feature.fromJSON(jsonFeat, true));
            }
          });
          return features;
          //return Feature.fromJSONArray(response.json();
        })
        .catch(this.handleError);
    } else {
      console.error("The element supplied cannnot have resources.");
      return null;
    }
  }

  getResourcesOf(element: any): Promise<Resource[]> {
    // Cache is probably a very bad idea right now
    let path: string = null;

    if (element instanceof Project) path = this.basePath + '/resources';
    else if (element instanceof Release) {
      if (element.resources) return Promise.resolve(element.resources);
      else path = this.basePath + 'releases' + element.id + '/resources' /*return Promise.resolve(element.resources)*/;
    }

    if (path) {
      return this.http.get(path)
        .toPromise()
        .then(response => {
          let resources: Resource[] = [];

          response.json().forEach(jsonFeat => {
            if (jsonFeat.id in this.resources) {
              //console.log("Resource: cache hit");
              resources.push(this.resources[jsonFeat.id]);
            }
            else {
              //console.log("Resource: cache miss");
              resources.push(Resource.fromJSON(jsonFeat, true));
            }
          });
          return resources;
          //return Resource.fromJSONArray(response.json();
        })
        .catch(this.handleError);
    } else {
      console.error("The element supplied cannnot have resources associated.");
      return null;
    }
  }

  getSkillsOf(element: any): Promise<Skill[]> {
    let path: string = null;

    if (element instanceof Project) path = this.basePath + '/skills';
    else if (element instanceof Feature) {
      if (element.required_skills) return Promise.resolve(element.required_skills);
      else path = this.basePath + 'features' + element.id + '/skills'
    }
    else if (element instanceof Resource) {
      if (element.skills) return Promise.resolve(element.skills);
      else path = this.basePath + 'resources' + element.id + '/skills';
    }

    if (path) {
      return this.http.get(path)
        .toPromise()
        .then(response => {
          let skills: Skill[] = [];

          response.json().forEach(jsonFeat => {
            if (jsonFeat.id in this.skills) {
              //console.log("Skill " + jsonFeat.name + ": cache hit");
              skills.push(this.skills[jsonFeat.id]);
            }
            else {
              //console.log("Skill " + jsonFeat.name + ": cache miss");
              skills.push(Skill.fromJSON(jsonFeat, true));
            }
          });
          return skills;
          //return Skill.fromJSONArray(response.json();
        })
        .catch(this.handleError);
    } else {
      console.error("The element supplied cannnot have skills associated.");
      return null;
    }
  }

  getReleasesOf(element: any): Promise<Release[]> {
    if (element instanceof Project) {
      if (element.releases) return Promise.resolve(element.releases);
        else {
        return this.http.get(this.basePath + '/releases')
          .toPromise()
          .then(response => {
            let releases: Release[] = [];

            response.json().forEach(jsonFeat => {
              if (jsonFeat.id in this.releases) {
                //console.log("Release: cache hit");
                releases.push(this.releases[jsonFeat.id]);
              }
              else {
                //console.log("Release: cache miss");
                releases.push(Release.fromJSON(jsonFeat, true));
              }
            });
            return releases;
            //return Skill.fromJSONArray(response.json();
          })
          .catch(this.handleError);
      }
    } else {
      console.error("The element supplied cannnot have releases associated.");
      return null;
    }
  }



  /* CREATIONS */
  createProject(project: Project): Promise<any> {
    let body: Object = {
      'name': project.name,
      'description': project.description,
      'effort_unit': project.effort_unit,
      'hours_per_effort_unit': project.hours_per_effort_unit,
      'hours_per_week_and_full_time_resource': project.hours_per_week_and_full_time_resource
    };
    return this.http.post(this.apiUrl + '/projects', body)
      .toPromise()
      .then(response => {
        return response;
      })
      .catch(this.handleError);
  }
  createRelease(release: Release): Promise<any> {
    let body: Object = {
      'name': release.name,
      'description': release.description,
      'starts_at': release.starts_at,
      'deadline': release.deadline
    };
    return this.http.post(this.basePath + '/releases', body)
      .toPromise()
      .then(response => {
        return response;
      })
      .catch(this.handleError);
  }
  createResource(resource: Resource): Promise<any> {
    let body: Object = {
      'name': resource.name,
      'description': resource.description,
      'availability': resource.availability
    };
    return this.http.post(this.basePath + '/resources', body)
      .toPromise()
      .then(response => {
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
        return response;
      })
      .catch(this.handleError);
  }
  createFeature(feature: Feature): Promise<any> {
    let body: Object = {
      'code': feature.code,
      'name': feature.name,
      'description': feature.description,
      'effort': feature.effort,
      'deadline': feature.deadline,
      'priority': feature.priority
    };
    return this.http.post(this.basePath + '/features/create_one', body)
      .toPromise()
      .then(response => {
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
  deleteFeature(feature: Feature): Promise<any> {
    return this.http.delete(this.basePath + '/features/' + feature.id)
      .toPromise()
      .then(response => {
        this.uncacheElement(feature);
        return response;
      })
      .catch(this.handleError);
  }
  deleteProject(project: Project): Promise<any> {
    return this.http.delete(this.apiUrl + '/projects/' + project.id)
      .toPromise()
      .then(response => {
        this.uncacheElement(project);
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
    return this.http.put(this.apiUrl + '/projects/' + project.id, body)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }

  updateRelease(release: Release): Promise<Object> {
    let body: Object = {
      'name': release.name,
      'starts_at': release.starts_at,
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
  addSkillsToFeature(feature: Feature, skillIds: number[]): Promise<any> {
    let body = [];
    skillIds.forEach(id => body.push({'skill_id': id}));
    return this.http.post(this.basePath + '/features/' + feature.id + '/skills', body)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  addSkillsToResource(res: Resource, skillIds: number[]): Promise<any> {
    let body = [];
    skillIds.forEach(id => body.push({'skill_id': id}));
    return this.http.post(this.basePath + '/resources/' + res.id + '/skills', body)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  addDependencyToFeature(feat: Feature, depIds: number[]): Promise<any> {
    let body = [];
    depIds.forEach(id => body.push({'feature_id': id}));
    return this.http.post(this.basePath + '/features/' + feat.id + '/dependencies', body)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  addResourcesToRelease(relId: number, resourceIds: number[]): Promise<any> {
    let body = [];
    resourceIds.forEach(id => body.push({'resource_id': id}));
    return this.http.post(
      this.basePath + '/releases/' + relId + '/resources', body)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }

  addFeaturesToRelease(rel: Release, featureIds: number[]): Promise<any> {
    let body = [];
    featureIds.forEach(id => body.push({'feature_id': id}));
    return this.http.post(
      this.basePath + '/releases/' + rel.id + '/features', body)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }


  /* REMOVE X FROM Y */
  removeSkillsFromFeature(feature: Feature, skillIds: number[]): Promise<any> {
    let params: URLSearchParams = new URLSearchParams();
    skillIds.forEach(id => params.set('skill_id[]', id.toString()));
    let requestOptions = new RequestOptions();
    requestOptions.search = params;

    return this.http.delete(this.basePath + '/features/' + feature.id + '/skills', requestOptions)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  removeSkillsFromResource(res: Resource, skillIds: number[]): Promise<any> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('skillId', skillIds.join());
    let requestOptions = new RequestOptions();
    requestOptions.search = params;

    return this.http.delete(this.basePath + '/resources/' + res.id + '/skills', requestOptions)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  removeDependencyFromFeature(feature: Feature, depIds: number[]): Promise<any> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('feature_id', depIds.join());
    let requestOptions = new RequestOptions();
    requestOptions.search = params;

    return this.http.delete(this.basePath + '/features/' + feature.id + '/dependencies', requestOptions)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  removeResourceFromProject(res: Resource): Promise<any> {
    return this.http.delete(
      this.basePath + '/resources/' + res.id)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }

  removeResourcesFromRelease(releaseId: number, resourceIds: number[]): Promise<any> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('ResourceId', resourceIds.join());
    let requestOptions = new RequestOptions();
    requestOptions.search = params;

    return this.http.delete(
      this.basePath + '/releases/' + releaseId + '/resources', requestOptions)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }

  removeFeaturesFromRelease(rel: Release, featureIds: number[]): Promise<any> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('featureId', featureIds.join());
    let requestOptions = new RequestOptions();
    requestOptions.search = params;

    return this.http.delete(
      this.basePath + '/releases/' + rel.id + '/features', requestOptions)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }



  /* MOVE X TO Y */
  moveResourceToProject(res: Resource, projectId: number) {
    let aux = this.currentProjectId;

    this.setActiveProject(projectId);
    this.createResource(res);
    this.setActiveProject(aux);
  }

  moveResourceToRelease(res: Resource, releaseId: number) {
    this.addResourcesToRelease(releaseId, [res.id]);
  }
}
