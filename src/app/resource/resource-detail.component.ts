import {Component, OnInit, Input} from "@angular/core";
import {Resource} from "../domain/resource";
import {ControllerService} from "../services/controller.service";

@Component({
  moduleId: module.id,
  selector: 'resource-detail',
  templateUrl: 'resource-detail.component.html',
  styleUrls: ['../styles.css']
})
export class ResourceDetailComponent implements OnInit {
  @Input()
  resource: Resource;

  constructor(private controllerService: ControllerService) {}

  ngOnInit(): void {
  }


  update(): void {
    this.controllerService.updateResource(this.resource)
      .then(response => console.table(response));
  }
}
