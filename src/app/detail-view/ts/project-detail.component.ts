import {ElementDetailComponent} from "./element-detail.component";
import {Component, OnInit} from "@angular/core";
import {Project} from "../../domain/project";

@Component({
  selector: 'project-detail',
  templateUrl: '../html/project-detail.component.html',
  styleUrls: ['../../styles.css']
})
export class ProjectDetailComponent extends ElementDetailComponent implements OnInit {
  ngOnInit(): void {
    if (this.createElement) this.element = new Project(null, null, null, null, null, null, null);
    super.ngOnInit();
  }
}
