import { CommonModule } from "@angular/common";
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { TableauModule } from "ngx-tableau";

import { ChatbotComponent } from "../chatbot/chatbot.component";

// eslint-disable-next-line max-len
const DEFAULT_DASHBOARD = "https://public.tableau.com/views/MCCSInventoryDataVisualizations/Dashboard1?:language=en-US&:sid=&:display_count=n&:origin=viz_share_link";

@Component({
    selector: "app-tableau",
    standalone: true,
    imports: [
        TableauModule,
        ChatbotComponent,
        CommonModule,
        MatButtonModule,
        MatSidenavModule,
        MatIconModule,
    ],
    templateUrl: "./tableau.component.html",
    styleUrl: "./tableau.component.css",
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TableauComponent {
    dashboardUrl: string = DEFAULT_DASHBOARD;

    updateDashboardUrl(newUrl: string) {
        this.dashboardUrl = newUrl;
    }
}
