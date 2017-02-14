import {Feature} from "../domain/feature";
import {Component, OnInit, Input} from "@angular/core";

@Component({
  moduleId: module.id,
  selector: 'feature-detail',
  templateUrl: './feature-detail.component.html',
  styleUrls: ['../styles.css']
})
export class FeatureDetailComponent implements OnInit {
  @Input()
  feature: Feature;

  ngOnInit(): void {
  }
}
