import {Feature} from "../domain/feature";
import {Component, OnInit, Input} from "@angular/core";
import {ControllerService} from "../services/controller.service";

@Component({
  moduleId: module.id,
  selector: 'feature-detail',
  templateUrl: './feature-detail.component.html',
  styleUrls: ['../styles.css']
})
export class FeatureDetailComponent implements OnInit {
  @Input()
  feature: Feature;

  constructor(private controllerService: ControllerService) {}

  ngOnInit(): void {
  }


  update(): void {
    this.controllerService.updateFeature(this.feature)
      .then(response => console.table(response));
  }
}
