import {Routes} from '@angular/router';
import {TableauComponent} from './tableau/tableau.component';

export const routes: Routes = [
    {path: '', redirectTo: '/tableau', pathMatch: 'full'},
    {path: 'tableau', component: TableauComponent},
];
