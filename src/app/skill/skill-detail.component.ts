import {Component, OnInit, Input} from "@angular/core";
import {Skill} from "../domain/skill";

@Component({
  moduleId: module.id,
  selector: 'skill-detail',
  templateUrl: 'skill-detail.component.html',
  styleUrls: ['../styles.css']
})
export class SkillDetailComponent implements OnInit {
  @Input()
  skill: Skill;

  ngOnInit(): void {
  }
}
