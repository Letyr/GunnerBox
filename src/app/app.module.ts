import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { Main } from './main/main';
import { KeyboardController } from './controller/keyboardController';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [Main, KeyboardController],
  bootstrap: [AppComponent]
})
export class AppModule { }
