import {Component, OnInit} from "@angular/core";
import {ControllerService} from "./services/controller.service";
import {Project} from "./domain/project";
import {ChangeRecordService} from "./services/change-record.service";
import {ReplanElement} from "./domain/replan-element";
import {ReplanElemType} from "./domain/replan-elem-type";
import {OnElementChange} from "./detail-view/ts/on-element-change";
import {Release} from "./domain/release";
import {Resource} from "./domain/resource";
import {Feature} from "./domain/feature";
import {Utils} from "./utils";

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
  relatedElementsName: string;
  selectedTab: string = null;
  createElement: Boolean = false;
  breadcrumbs: ReplanElement[] = [];
  showReleasePlan: Boolean;

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
    /*this.controllerService.getProject(1)
      .then(project => {
        console.log(project);
        this.activeElement = project;
        this.validTabs = ["Resources", "Features", "Releases", "Skills"];
        this.onTabSelected("Resources");
        this.breadcrumbs.push(this.activeElement);
      });*/
    this.onTabSelected('Projects');
  }

  onActiveElementChange(): void {
    switch (this.activeElement.type) {
      case ReplanElemType.PROJECT:
        let proj = this.activeElement as Project;

        this.controllerService.clearCache();
        this.controllerService.setActiveProject(proj.id);

        proj.loadAsyncData();

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
        (this.activeElement as Release).plan = null;
        this.validTabs = ['Resources', 'Features', 'Plan'];
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
        if (elem instanceof Project || elem instanceof Release) {
          Utils.waitUntilExists(elem.resources);
          this.relatedElementsName = 'resource';
          this.relatedElements = elem.resources;
        }
        break;
      case 'Features':
        if (elem instanceof Project || elem instanceof Release) {
          Utils.waitUntilExists(elem.features);
          this.relatedElementsName = 'feature';
          this.relatedElements = elem.features;
        }
        break;
      case 'Releases':
        this.controllerService.getReleasesOf(this.activeElement)
          .then(releases => {
            this.relatedElementsName = 'release';
            this.relatedElements = releases
          });
        break;
      case 'Skills':
        if (elem instanceof Project ||elem instanceof Resource) {
          Utils.waitUntilExists(elem.skills);
          this.relatedElements = elem.skills;
        }
        else if (elem instanceof Feature) {
          Utils.waitUntilExists(elem.required_skills);
          this.relatedElements = elem.required_skills;
        }
        this.relatedElementsName = 'skill';
        break;
      case 'Dependencies':
        if (elem instanceof Feature) {
          Utils.waitUntilExists(elem.depends_on);
          this.relatedElementsName = 'feature';
          this.relatedElements = elem.depends_on;
        }
        break;
      case 'Projects':
        this.validTabs = ['Projects'];
        this.breadcrumbs = [];
        this._activeElement = null;
        this.controllerService.getAllProjects()
          .then(projects => {
            console.log(projects);
            this.relatedElementsName = 'project';
            this.relatedElements = projects
          });
      case 'None':
      default:
        this.relatedElementsName = '';
        this.relatedElements = null;
        break;
    }

    if (tab == 'Plan') {
      console.debug("Should show release plan");
      (this.activeElement as Release).updatePlan();
      console.log(this.activeElement as Release);
      this.showReleasePlan = true;
    } else {
      this.showReleasePlan = false;
    }

    this.selectedTab = tab;
  }

  newElement(): void {
    this.createElement = true;
  }

  onElementCreated(element: ReplanElement): void {
    this.relatedElements.push(element);
    console.log(this.relatedElements);

    if (this.activeElement instanceof Project) {
      if (element instanceof Resource || element instanceof Feature) element.project = this.activeElement;
    }

    this.createElement = false;
  }

  onElementDeleted(element: ReplanElement): void {
    if (this.relatedElements.length > 0 && element.type == this.relatedElements[0].type) {
      this.relatedElements.splice(this.relatedElements.indexOf(element), 1);
    }
  }

  onElementUpdated(element: ReplanElement): void {

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

  setApiUrl(newUrl: string): void {
    this.controllerService.apiUrl = newUrl;
    this.controllerService.setActiveProject(1);
    this.controllerService.clearCache();
    this.breadcrumbs = [];
    this.ngOnInit();
  }
}
