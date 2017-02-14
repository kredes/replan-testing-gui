import {Component, OnInit} from '@angular/core';
import { Headers, Http } from '@angular/http';
import {Project} from "./domain/project";
import {ControllerService} from "./services/controller.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './styles.css'],
  providers: [ControllerService]
})
export class AppComponent implements OnInit {
    title = 'RePlan testing GUI';
    project: Project;

    constructor(private controllerService: ControllerService) {

    }

    ngOnInit(): void {
      this.controllerService.getProject()
        .then(project => this.project = project);
    }
}
