import {Component, OnInit} from "@angular/core";
import {ElementDetailComponent} from "./element-detail.component";
import {Feature} from "../../domain/feature";

@Component({
  selector: 'feature-detail',
  templateUrl: '../html/feature-detail.component.html',
  styleUrls: ['../../styles.css']
})
export class FeatureDetailComponent extends ElementDetailComponent implements OnInit {
  ngOnInit(): void {
    if (this.createElement) this.element = new Feature(null, null, null, null, null, null, null, null, null);
    super.ngOnInit();
  }

  onDependencyStateChange(event: Event) {
    let target = event.target as HTMLInputElement;
    let id = target.value;
    let checked = target.checked;

    console.info("Dependency with id", id, "is now", checked ? "checked" : "unchecked");
  }

  onSkillStateChange(event: Event) {
    let target = event.target as HTMLInputElement;
    let id = target.value;
    let checked = target.checked;

    console.info("Skill with id", id, "is now", checked ? "checked" : "unchecked");
  }
}
