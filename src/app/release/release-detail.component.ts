import {Component, OnInit, Input} from "@angular/core";
import {Release} from "../domain/release";
import {ControllerService} from "../services/controller.service";

@Component({
  moduleId: module.id,
  selector: 'release-detail',
  templateUrl: 'release-detail.component.html',
  styleUrls: ['../styles.css']
})
export class ReleaseDetailComponent implements OnInit {
  @Input()
  release: Release;


  constructor(private controllerService: ControllerService) {}

  ngOnInit(): void {
  }

  update(): void {
    this.controllerService.updateRelease(this.release)
      .then(response => console.table(response));
  }
}
