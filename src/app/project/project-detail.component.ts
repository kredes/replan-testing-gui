import {Project} from "../domain/project";
import {Component, OnInit, Input} from "@angular/core";
import {ControllerService} from "../services/controller.service";

@Component({
  moduleId: module.id,
  selector: 'project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['../styles.css']
})
export class ProjectDetailComponent implements OnInit {
  @Input()
  project: Project;

  constructor(private controllerService: ControllerService) {}

  ngOnInit(): void {
  }

  update(): void {
    this.controllerService.updateProject(this.project)
      .then(response => console.table(response));
  }
}
