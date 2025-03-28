import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // Add this import

import { AppComponent } from './app.component';
import { ApiService } from './service/api.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule, // Add HttpClientModule to imports
  ],
  providers: [ApiService],
  bootstrap: [AppComponent],
})
export class AppModule {}
