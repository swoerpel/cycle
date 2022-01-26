import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CanvasComponent } from './canvas/canvas.component';
import { CanvasV2Component } from './canvas-v2/canvas-v2.component';
import { CanvasV3Component } from './canvas-v3/canvas-v3.component';
import { CanvasV4Component } from './canvas-v4/canvas-v4.component';
import { CanvasV5Component } from './canvas-v5/canvas-v5.component';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    CanvasV2Component,
    CanvasV3Component,
    CanvasV4Component,
    CanvasV5Component,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
