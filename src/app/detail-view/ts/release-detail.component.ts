import {Component, OnInit, DoCheck} from "@angular/core";
import {ElementDetailComponent} from "./element-detail.component";
import {Release} from "../../domain/release";
import {Feature} from "../../domain/feature";

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

  ngOnInit(): void {
    if (this.createElement) this.element = new Release(null, null, null, null, null, null);
    super.ngOnInit();
  }

  ngDoCheck(): void {
    let elem = this.element as Release;
    if (this.oldFeatures.length == 0 && elem.features) elem.features.forEach(s => this.oldFeatures.push(s.id));
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

    this.oldFeatures = [];
    this.featuresToAdd = [];
    this.featuresToRemove = [];

    console.log(this.oldFeatures);

    rel.features.forEach(s => this.oldFeatures.push(s.id));

    console.log(this.oldFeatures);

    super.update();
  }

  nonSelectedFeatures(): Feature[] {
    let elem = this.element as Release;
    let all = elem.project.features;
    let features = elem.features;

    if (!features) return all;

    return all.filter(function(s) {return features.indexOf(s) < 0;});
  }
}
