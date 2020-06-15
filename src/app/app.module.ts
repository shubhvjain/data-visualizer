import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { Ng2TableModule } from 'ng2-table/ng2-table';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SortableModule } from 'ngx-bootstrap/sortable';

import { TagInputModule } from 'ngx-chips';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataSourceComponent } from './data-source/data-source.component';
import { HomeComponent } from './home/home.component';
import { DataTableComponent } from './data-table/data-table.component';
import { JsonFormComponent } from './json-form/json-form.component';

@NgModule({
  declarations: [
    AppComponent,
    DataSourceComponent,
    HomeComponent,
    DataTableComponent,
    JsonFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    PaginationModule.forRoot(),
    SortableModule.forRoot(),
    TagInputModule, 
    Ng2TableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
