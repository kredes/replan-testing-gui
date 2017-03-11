import {Component, OnInit} from "@angular/core";
import {ElementDetailComponent} from "./element-detail.component";
import {Release} from "../../domain/release";

@Component({
  selector: 'release-detail',
  templateUrl: '../html/release-detail.component.html',
  styleUrls: ['../../styles.css']
})
export class ReleaseDetailComponent extends ElementDetailComponent  implements OnInit {
  ngOnInit(): void {
    if (this.createElement) this.element = new Release(null, null, null, null, null, null);
    super.ngOnInit();
  }
}
