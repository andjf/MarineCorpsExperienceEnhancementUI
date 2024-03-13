import { Component } from '@angular/core';
import { TableauModule, ToolbarPosition, VizCreateOptions } from 'ngx-tableau';

@Component({
  selector: 'app-tableau',
  standalone: true,
  imports: [TableauModule],
  templateUrl: './tableau.component.html',
  styleUrl: './tableau.component.css',
})
export class TableauComponent {
  host: string = 'https://public.tableau.com';
  path: string = 'views';

  viz: string = 'AroundtheAntarctic/MapClean';
  // viz: string = 'Whereintheworldisfreedomofpress/Final_Paper';

  // https://github.com/nfqsolutions/ngx-tableau#configuration-options
  options: VizCreateOptions = {
    device: "desktop",
    toolbarPosition: ToolbarPosition.TOP,
  }

  get dashboardUrl(): string {
    return [this.host, this.path, this.viz].join('/');
  }
}
