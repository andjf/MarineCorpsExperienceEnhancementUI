import { CommonModule } from "@angular/common";
import {
    ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA,
    Input, NgZone, OnInit
} from "@angular/core";
import { MatButton } from "@angular/material/button";
import {
    MatDrawer,
    MatDrawerContainer,
    MatDrawerContent,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent
} from "@angular/material/sidenav";
import { ActivatedRoute } from "@angular/router";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
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
        FaIconComponent,
        MatSidenavContainer,
        MatSidenav,
        MatSidenavContent,
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
    dashUrl: string = "https://public.tableau.com/shared/KSHKD97P2?:display_count=n&:origin=viz_share_link"
    constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

    toggleDarkModeClasses():void{
        console.log("toggling dark mode");
        document.body.classList.toggle("lightMode");
        let cbs = document.getElementsByClassName("chatbot-header");
        for(let i = 0; i < cbs.length; i++){
            cbs[i].classList.toggle("lightMode");
        }
        document.getElementById("sidebar-container")?.classList.toggle("lightMode");
        document.getElementById("options-toggle-button")?.classList.toggle("lightMode");
        let h1s = document.getElementsByTagName("h1");
        for (let i = 0; i < h1s.length; i++){
            h1s[i].classList.toggle("lightMode");
        }
        let tbs = document.getElementsByClassName("toggle-button");
        for(let i = 0; i < tbs.length; i++){
            tbs[i].classList.toggle("lightMode");
        }
        let htmls = document.getElementsByTagName("html");
        for(let i = 0; i < htmls.length; i++){
            htmls[i].classList.toggle("lightMode");
        }
    }

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
    protected readonly faBars = faBars;
}
