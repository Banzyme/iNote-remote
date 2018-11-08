import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './views/index/index.component';
import { OverviewComponent } from './views/overview/overview.component';
import { AddNewComponent } from './views/add-new/add-new.component';

const routes: Routes = [
  {path: '', redirectTo:'inote', pathMatch: 'full'},
  {path: 'inote', component: IndexComponent, children:[
    {path: '', redirectTo:'home', pathMatch: 'full'},
    {path: 'home', component: OverviewComponent},
    {path: 'add', component: AddNewComponent}
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
