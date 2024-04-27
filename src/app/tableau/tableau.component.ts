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

    toggleDarkModeClasses(): void {
        document.body.classList.toggle("lightMode");
        const cbs = document.getElementsByClassName("chatbot-header");
        for (let i = 0; i < cbs.length; i += 1) {
            cbs[i].classList.toggle("lightMode");
        }
        document.getElementById("sidebar-container")?.classList.toggle("lightMode");
        document.getElementById("options-toggle-button")?.classList.toggle("lightMode");
        const h1s = document.getElementsByTagName("h1");
        for (let i = 0; i < h1s.length; i += 1) {
            h1s[i].classList.toggle("lightMode");
        }
        const tbs = document.getElementsByClassName("toggle-button");
        for (let i = 0; i < tbs.length; i += 1) {
            tbs[i].classList.toggle("lightMode");
        }
        const htmls = document.getElementsByTagName("html");
        for (let i = 0; i < htmls.length; i += 1) {
            htmls[i].classList.toggle("lightMode");
        }
    }

    updateDashboardUrl(newUrl: string) {
        this.dashboardUrl = newUrl;
    }
}
