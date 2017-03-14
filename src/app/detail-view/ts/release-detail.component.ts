import {Component, OnInit, DoCheck} from "@angular/core";
import {ElementDetailComponent} from "./element-detail.component";
import {Release} from "../../domain/release";
import {Feature} from "../../domain/feature";
import {Resource} from "../../domain/resource";

@Component({
  selector: 'release-detail',
  templateUrl: '../html/release-detail.component.html',
  styleUrls: ['../../styles.css']
})
// TODO: Fails on undoing, but it does undo. Seen on undoing a deletion.
export class ReleaseDetailComponent extends ElementDetailComponent  implements OnInit, DoCheck {
  oldFeatures: number[] = [];
  featuresToRemove: number[] = [];
  featuresToAdd: number[] = [];

  oldResources: number[] = [];
  resourcesToAdd: number[] = [];
  resourcesToRemove: number[] = [];


  ngOnInit(): void {
    if (this.createElement) this.element = new Release(null, null, null, null, null, []);
    super.ngOnInit();
  }

  ngDoCheck(): void {
    let elem = this.element as Release;
    if (this.oldFeatures.length == 0 && elem.features) elem.features.forEach(s => this.oldFeatures.push(s.id));
    if (this.oldResources.length == 0 && elem.resources) elem.resources.forEach(s => this.oldResources.push(s.id));
  }

  onFeatureStateChange(event: Event) {
    let target = event.target as HTMLInputElement;
    let id = parseInt(target.value);
    let checked = target.checked;

    console.info("Feature with id", id, "is now", checked ? "checked" : "unchecked");

    if (checked) {
      if (!(this.oldFeatures.indexOf(id) > -1)) this.featuresToAdd.push(id);
      else if (this.featuresToRemove.indexOf(id) > -1) this.featuresToRemove.splice(this.featuresToRemove.indexOf(id), 1);
    }
    else {
      if (this.oldFeatures.indexOf(id) > -1) this.featuresToRemove.push(id);
      else this.featuresToAdd.splice(this.featuresToAdd.indexOf(id), 1);
    }

    console.debug("STATUS AFTER CHANGE:");
    console.debug("oldFeatures:", this.oldFeatures, "featuresToAdd:", this.featuresToAdd, "featuresToRemove:", this.featuresToRemove);
  }

  onResourceStateChange(event: Event) {
    let target = event.target as HTMLInputElement;
    let id = parseInt(target.value);
    let checked = target.checked;

    console.info("Resource with id", id, "is now", checked ? "checked" : "unchecked");

    if (checked) {
      if (!(this.oldResources.indexOf(id) > -1)) this.resourcesToAdd.push(id);
      else if (this.resourcesToRemove.indexOf(id) > -1) this.resourcesToRemove.splice(this.resourcesToRemove.indexOf(id), 1);
    }
    else {
      if (this.oldResources.indexOf(id) > -1) this.resourcesToRemove.push(id);
      else this.resourcesToAdd.splice(this.resourcesToAdd.indexOf(id), 1);
    }

    console.debug("STATUS AFTER CHANGE:");
    console.debug("oldResources:", this.oldResources, "resourcesToAdd:", this.resourcesToAdd, "resourcesToRemove:", this.resourcesToRemove);
  }

  update(): void {
    let rel = this.element as Release;

    if (this.featuresToAdd.length > 0) {
      let featuresToAdd = this.featuresToAdd;
      this.element.dataService.addFeaturesToRelease(this.element as Release, this.featuresToAdd)
        .then(resp => {
          if (resp.ok) {
            featuresToAdd.forEach(id => {
              this.element.dataService.getFeature(id)
                .then(f => rel.addFeature(f));
            });
          }
        });
    }
    if (this.featuresToRemove.length > 0) {
      let featuresToRemove = this.featuresToRemove;
      this.element.dataService.removeFeaturesFromRelease(this.element as Release, this.featuresToRemove)
        .then(resp => {
          if (resp.ok) {
            featuresToRemove.forEach(id => {
              this.element.dataService.getFeature(id)
                .then(f => rel.removeFeature(f));
            });
          }
        });
    }

    if (this.resourcesToAdd.length > 0) {
      let resourcesToAdd = this.resourcesToAdd;
      this.element.dataService.addResourcesToRelease(this.element.id, this.resourcesToAdd)
        .then(resp => {
          if (resp.ok) {
            resourcesToAdd.forEach(id => {
              this.element.dataService.getResource(id)
                .then(f => rel.addResource(f));
            });
          }
        });
    }
    if (this.resourcesToRemove.length > 0) {
      let resourcesToRemove = this.resourcesToRemove;
      this.element.dataService.removeResourcesFromRelease(this.element.id, this.resourcesToRemove)
        .then(resp => {
          if (resp.ok) {
            resourcesToRemove.forEach(id => {
              this.element.dataService.getResource(id)
                .then(f => rel.removeResource(f));
            });
          }
        });
    }

    this.oldFeatures = [];
    this.featuresToAdd = [];
    this.featuresToRemove = [];
    this.oldResources = [];
    this.resourcesToAdd = [];
    this.resourcesToRemove = [];

    //console.log(this.oldFeatures);

    if (rel.features) rel.features.forEach(s => this.oldFeatures.push(s.id));
    if (rel.resources) rel.resources.forEach(s => this.oldResources.push(s.id));

    //console.log(this.oldFeatures);

    super.update();
  }

  nonSelectedFeatures(): Feature[] {
    let elem = this.element as Release;
    let all = elem.project.features;
    let features = elem.features;

    if (!features) return all;

    return all.filter(function(s) {return features.indexOf(s) < 0;});
  }

  nonSelectedResources(): Resource[] {
    let elem = this.element as Release;
    let all = elem.project.resources;
    let resources = elem.resources;

    if (!resources) return all;

    return all.filter(function(s) {return resources.indexOf(s) < 0;});
  }
}
