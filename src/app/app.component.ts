import {Component, OnInit} from '@angular/core';
import {ControllerService} from "./services/controller.service";
import {Project} from "./domain/project";
import {ChangeRecordService} from "./services/change-record.service";
import {ReplanElement} from "./domain/replan-element";
import {and} from "@angular/router/src/utils/collection";
import {ReplanElemType} from "./domain/replan-elem-type";
import {OnElementChange} from "./detail-view/ts/on-element-change";
import {element} from "protractor";
import {Release} from "./domain/release";
import {Resource} from "./domain/resource";
import {Feature} from "./domain/feature";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './styles.css'],
  providers: [ControllerService]
})
export class AppComponent implements OnInit, OnElementChange {
  title = 'RePlan testing GUI';

  private _activeElement: any = null;
  relatedElements: ReplanElement[] = [];
  selectedTab: string = null;
  createElement: Boolean = false;
  breadcrumbs: ReplanElement[] = [];

  validTabs: string[];

  constructor(
    private controllerService: ControllerService,
    private changeRecordService: ChangeRecordService
  ) {
    ReplanElement.setDataService(controllerService);
    ReplanElement.setChangeRecordService(changeRecordService);
  }

  set activeElement(element: ReplanElement) {
    this._activeElement = element;
    this.onActiveElementChange();
  }
  get activeElement(): ReplanElement {
    return this._activeElement;
  }

  ngOnInit(): void {
    this.controllerService.getProject(1)
      .then(project => {
        this.activeElement = project;
        this.validTabs = ["Resources", "Features", "Releases", "Skills"];
        this.onTabSelected("Resources");
        this.breadcrumbs.push(this.activeElement);
      });
  }

  onActiveElementChange(): void {
    switch (this.activeElement.type) {
      case ReplanElemType.PROJECT:
        this.validTabs = ["Resources", "Features", "Releases", "Skills"];
        this.onTabSelected('Resources');
        break;
      case ReplanElemType.RESOURCE:
        this.validTabs = ["Skills"];
        this.onTabSelected('Skills');
        break;
      case ReplanElemType.FEATURE:
        this.validTabs = ['Skills', 'Dependencies'];
        this.onTabSelected('Skills');
        break;
      case ReplanElemType.RELEASE:
        this.validTabs = ['Resources'];
        this.onTabSelected('Resources');
        break;
      case ReplanElemType.SKILL:
        this.validTabs = [];
        this.onTabSelected('None');
        break;
    }
  }

  onTabSelected(tab: string): void {
    // Update related items
    let elem = this.activeElement;
    switch (tab) {
      case 'Resources':
        if (elem instanceof Project || elem instanceof Release) this.relatedElements = elem.resources;
        break;
      case 'Features':
        if (elem instanceof Project) this.relatedElements = elem.features;
        break;
      case 'Releases':
        this.controllerService.getReleasesOf(this.activeElement)
          .then(releases => this.relatedElements = releases);
        break;
      case 'Skills':
        if (elem instanceof Project ||elem instanceof Resource) this.relatedElements = elem.skills;
        else if (elem instanceof Feature) this.relatedElements = elem.required_skills;
        break;
      case 'None':
      default:
        this.relatedElements = [];
        break;
    }
    this.selectedTab = tab;
    /*
    console.debug("Selected tab:", this.selectedTab);
    console.debug("Valid tabs:", this.validTabs);
    */
  }

  newElement(): void {
    this.createElement = true;
  }

  onElementCreated(element: ReplanElement): void {
    console.info("Called onElementCreated at app.component.ts", element);
    // TODO: Change this hardcoded shit;
    this.relatedElements.push(element);
    console.log(this.relatedElements);
    this.createElement = false;
  }

  onElementDeleted(element: ReplanElement): void {
    console.info("Called onElementDeleted at app.component.ts");
    if (this.relatedElements.length > 0 && element.type == this.relatedElements[0].type) {
      this.relatedElements.splice(this.relatedElements.indexOf(element), 1);
    }
  }

  onElementUpdated(element: ReplanElement): void {
    console.info("onElementUpdated at app.component.ts does not do anything");
  }

  onElementSelected(elem: ReplanElement): void {
    this.activeElement = elem;
    this.breadcrumbs.push(elem);
  }

  closeCreationView(): void {
    this.createElement = false;
  }

  onBreadcrumbSelected(elem: ReplanElement): void {
    let index = this.breadcrumbs.indexOf(elem);
    this.breadcrumbs.splice(index + 1, this.breadcrumbs.length - index + 1);
    this.activeElement = elem;
  }
}
