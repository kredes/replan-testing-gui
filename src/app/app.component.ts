import {Component, OnInit} from '@angular/core';
import {ControllerService} from "./services/controller.service";
import {Project} from "./domain/project";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './styles.css'],
  providers: [ControllerService]
})
export class AppComponent implements OnInit {
    title = 'RePlan testing GUI';

    activeElement: any;
    relatedElements: any[];
    selectedTab: string;

    validTabs: string[];

    constructor(private controllerService: ControllerService) {

    }

    init(project: Project): void {
      this.activeElement = project
      this.relatedElements = this.activeElement.resources;
      this.validTabs = ["Resources", "Features", "Releases", "Skills"];
    }

    ngOnInit(): void {
      this.controllerService.getProject(1)
        .then(project => this.init(project));
    }


    onTabSelected(tab: string): void {
      // Update related items
      switch (tab) {
        case 'Resources':
          this.controllerService.getResourcesOf(this.activeElement)
            .then(resources => {
              this.relatedElements = resources;
            });
          break;
        case 'Features':
          this.controllerService.getFeaturesOf(this.activeElement)
            .then(features => {
              this.relatedElements = features;
              console.info("Call to getFeaturesOf(...) returned:", features);
            });
          break;
        case 'Releases':
          this.controllerService.getReleasesOf(this.activeElement)
            .then(releases => this.relatedElements = releases);
          break;
        case 'Skills':
          this.controllerService.getSkillsOf(this.activeElement)
            .then(skills => this.relatedElements = skills);
          break;
      }
      this.selectedTab = tab;
      console.debug("Selected tab:", this.selectedTab);
      console.debug("Valid tabs:", this.validTabs);
    }
}
