import { CommonModule } from "@angular/common";
import {
    ChangeDetectorRef,
    Component,
    CUSTOM_ELEMENTS_SCHEMA,
    Input,
    NgZone,
    OnInit
} from "@angular/core";
import { MatButton } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import {
    MatDrawer,
    MatDrawerContainer,
    MatDrawerContent,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent
} from "@angular/material/sidenav";
import { ActivatedRoute } from "@angular/router";
import { TableauModule, ToolbarPosition, VizCreateOptions } from "ngx-tableau";

import { ChatbotComponent } from "../chatbot/chatbot.component";

@Component({
    selector: "app-tableau",
    standalone: true,
    imports: [
        TableauModule,
        ChatbotComponent,
        CommonModule,
        MatDrawerContainer,
        MatDrawer,
        MatButton,
        MatDrawerContent,
        MatSidenavContainer,
        MatSidenav,
        MatSidenavContent,
        MatIconModule,
    ],
    templateUrl: "./tableau.component.html",
    styleUrl: "./tableau.component.css",
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class TableauComponent implements OnInit {
    host: string = "https://public.tableau.com";
    path: string = "views";
    // viz: string = 'AroundtheAntarctic/MapClean';
    // Using the example URL that Andrew has provided for now. Likely will use Tableau Public for final worksheet once
    // Mohit has completed his analyses.
    viz: string = "Whereintheworldisfreedomofpress/Final_Paper";
    // Inherit attributes from the parent component
    @Input() dashboardIndex = 0;
    @Input() toolbar = "hidden";
    @Input() vizUrl = "";

    // Dashboard properties
    public VizIndex = `Tableau-Viz-${this.dashboardIndex}`;
    apiKey: string | null = null;
    // eslint-disable-next-line max-len
    dashUrl: string = "https://public.tableau.com/views/MCCSInventoryDataVisualizations/Dashboard1?:language=en-US&:sid=&:display_count=n&:origin=viz_share_link";
    constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

    ngOnInit(): void {
        this.route.queryParams
            .subscribe((params) => {
                const apiKey = params["apiKey"] || null;
                if (apiKey) this.apiKey = apiKey;
            });
    }

    // The options tab here allows for easy launch options for us to be able to use.
    // Tons of useful tips can be found here: https://github.com/nfqsolutions/ngx-tableau?tab=readme-ov-file
    options: VizCreateOptions = {
        device: "desktop",
        toolbarPosition: ToolbarPosition.TOP
    };

    get constructUrl(): string {
        return [this.host, this.path, this.viz].join("/");
    }

    get dashboardUrl(): string {
        return this.dashUrl;
    }

    updateDashboardUrl(newUrl: string) {
        this.dashUrl = newUrl;
    }
}
