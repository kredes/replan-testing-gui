import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { ControllerService } from './services/controller.service';

import { AppComponent } from './app.component';
import {ProjectDetailComponent} from "./project/project-detail.component";
import {FeatureDetailComponent} from "./feature/feature-detail.component";
import {ResourceDetailComponent} from "./resource/resource-detail.component";
import {SkillDetailComponent} from "./skill/skill-detail.component";
import {ReleaseDetailComponent} from "./release/release-detail.component";
import {AppRoutingModule} from "./app-routing.module";
import {ElementListComponent} from "./relations/element-list.component";
import {ActiveElementComponent} from "./relations/active-element.component";

@NgModule({
  declarations: [
    AppComponent,
    ProjectDetailComponent,
    FeatureDetailComponent,
    ResourceDetailComponent,
    SkillDetailComponent,
    ReleaseDetailComponent,
    ElementListComponent,
    ActiveElementComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [ ControllerService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
