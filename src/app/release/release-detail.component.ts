import {Component, OnInit, Input} from "@angular/core";
import {Release} from "../domain/release";

@Component({
  moduleId: module.id,
  selector: 'release-detail',
  templateUrl: 'release-detail.component.html',
  styleUrls: ['../styles.css']
})
export class ReleaseDetailComponent implements OnInit {
  @Input()
  release: Release;

  ngOnInit(): void {
  }
}
