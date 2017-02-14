import {Component, OnInit, Input} from "@angular/core";
import {Resource} from "../domain/resource";

@Component({
  moduleId: module.id,
  selector: 'resource-detail',
  templateUrl: 'resource-detail.component.html',
  styleUrls: ['../styles.css']
})
export class ResourceDetailComponent implements OnInit {
  @Input()
  resource: Resource;

  ngOnInit(): void {
  }
}
