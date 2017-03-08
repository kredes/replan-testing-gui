import {Component, OnInit} from "@angular/core";
import {ElementDetailComponent} from "./element-detail.component";
import {Skill} from "../../domain/skill";

@Component({
  moduleId: module.id,
  selector: 'skill-detail',
  templateUrl: '../html/skill-detail.component.html',
  styleUrls: ['../../styles.css']
})
export class SkillDetailComponent extends ElementDetailComponent implements OnInit {
  ngOnInit(): void {
    if (this.createElement) this.element = new Skill(null, null, null);
  }
}
