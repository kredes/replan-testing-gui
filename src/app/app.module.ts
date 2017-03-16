import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {ControllerService} from "./services/controller.service";
import {AppComponent} from "./app.component";
import {ProjectDetailComponent} from "./detail-view/ts/project-detail.component";
import {FeatureDetailComponent} from "./detail-view/ts/feature-detail.component";
import {ResourceDetailComponent} from "./detail-view/ts/resource-detail.component";
import {SkillDetailComponent} from "./detail-view/ts/skill-detail.component";
import {ReleaseDetailComponent} from "./detail-view/ts/release-detail.component";
import {AppRoutingModule} from "./app-routing.module";
import {ElementListComponent} from "./relations/element-list.component";
import {ActiveElementComponent} from "./relations/active-element.component";
import {ChangeRecordService} from "./services/change-record.service";
import {ElementDetailComponent} from "./detail-view/ts/element-detail.component";
import {ChangeRecordComponent} from "./record/change-record.component";
import {CollapseDirective} from "./directives/collapse";
import {RecordDetailComponent} from "./record/record-detail.component";

@NgModule({
  declarations: [
    AppComponent,
    ProjectDetailComponent,
    FeatureDetailComponent,
    ResourceDetailComponent,
    SkillDetailComponent,
    ReleaseDetailComponent,
    ElementListComponent,
    ActiveElementComponent,
    ElementDetailComponent,
    ChangeRecordComponent,
    RecordDetailComponent,
    CollapseDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [ ControllerService, ChangeRecordService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
