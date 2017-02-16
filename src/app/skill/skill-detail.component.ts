import {Component, OnInit, Input} from "@angular/core";
import {Skill} from "../domain/skill";
import {ControllerService} from "../services/controller.service";

@Component({
  moduleId: module.id,
  selector: 'skill-detail',
  templateUrl: 'skill-detail.component.html',
  styleUrls: ['../styles.css']
})
export class SkillDetailComponent implements OnInit {
  @Input()
  skill: Skill;

  constructor(private controllerService: ControllerService) {}

  ngOnInit(): void {
  }


  update(): void {
    this.controllerService.updateSkill(this.skill)
      .then(response => console.table(response));
  }
}
