import {Component, Input, OnInit} from "@angular/core";
import {Record} from "../../services/record";
import {RecordType} from "../../services/record-type";
import {ElementDetailComponent} from "./element-detail.component";
import {Resource} from "../../domain/resource";

@Component({
  moduleId: module.id,
  selector: 'resource-detail',
  templateUrl: '../html/resource-detail.component.html',
  styleUrls: ['../../styles.css']
})
export class ResourceDetailComponent extends ElementDetailComponent implements OnInit {
  ngOnInit(): void {
    if (this.createElement) this.element = new Resource(null, null, null, null, null);
    super.ngOnInit();
  }

  assignToProject(projId: number) {
    console.info("Assigning resource to project with id", projId);
  }

  assignToRelease(relId: number) {
    console.info("Assigning resource to release with id", relId);
  }
}
