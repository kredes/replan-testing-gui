import {Project} from "../domain/project";
import {Component, OnInit, Input} from "@angular/core";

@Component({
  moduleId: module.id,
  selector: 'project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['../styles.css']
})
export class ProjectDetailComponent implements OnInit {
  @Input()
  project: Project;

  ngOnInit(): void {
  }
}
