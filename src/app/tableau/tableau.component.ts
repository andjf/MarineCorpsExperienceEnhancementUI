import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
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
        MatSidenavContent
    ],
    templateUrl: "./tableau.component.html",
    styleUrl: "./tableau.component.css",
})

export class TableauComponent implements OnInit {
    host: string = "https://public.tableau.com";
    path: string = "views";
    // viz: string = 'AroundtheAntarctic/MapClean';
    // Using the example URL that Andrew has provided for now. Likely will use Tableau Public for final worksheet once
    // Mohit has completed his analyses.
    viz: string = "Whereintheworldisfreedomofpress/Final_Paper";

    apiKey: string | null = null;

    constructor(private route: ActivatedRoute) {}

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

    get dashboardUrl(): string {
        return [this.host, this.path, this.viz].join("/");
    }

    protected readonly faBars = faBars;
}
