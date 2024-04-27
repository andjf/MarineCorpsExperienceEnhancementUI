import { CommonModule } from "@angular/common";
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { CommandCode, commandCodeToLink } from "@models";
import { ThemeService } from "app/theme.service";
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

    constructor(private themeService: ThemeService) {}

    get theme(): string {
        return this.themeService.currentTheme;
    }

    // eslint-disable-next-line class-methods-use-this
    get allCommands(): string[] {
        return Object.keys(CommandCode);
    }

    // eslint-disable-next-line class-methods-use-this
    get generalQuickSwaps() {
        /* eslint-disable max-len */
        return [
            {
                label: "Main Panel",
                url: "https://public.tableau.com/views/MCCSInventoryDataVisualizations/Dashboard1?:language=en-US&publish=yes&:sid=&:display_count=n&:origin=viz_share_link",
            },
            {
                label: "Map View",
                url: "https://public.tableau.com/views/ShrinkbyState/ShrinkValuebyState?:language=en-US&publish=yes&:sid=&:display_count=n&:origin=viz_share_link",
            },
            {
                label: "Command View",
                url: "https://public.tableau.com/views/ShrinkbyCommand/ShrinkbyCommand?:language=en-US&publish=yes&:sid=&:display_count=n&:origin=viz_share_link",
            },
            {
                label: "Product Division",
                url: "https://public.tableau.com/views/ShrinkbyProd/ShrinkValuebyProdDivisionLobDesc?:language=en-US&publish=yes&:sid=&:display_count=n&:origin=viz_share_link",
            },
            {
                label: "Site ID and Period",
                url: "https://public.tableau.com/views/ShrinkbySiteID/ShrinkValueSiteIDPeriod?:language=en-US&publish=yes&:sid=&:display_count=n&:origin=viz_share_link",
            },
            {
                label: "Inventory Removal",
                url: "https://public.tableau.com/views/ShrinkQuanitybyInventoryRemoval/ShrinkQtybyInv_Removal?:language=en-US&publish=yes&:sid=&:display_count=n&:origin=viz_share_link",
            },
        ];
        /* eslint-enable max-len */
    }

    home(): void {
        this.dashboardUrl = DEFAULT_DASHBOARD;
    }

    toggleMode(): void {
        this.themeService.toggleTheme();
    }

    updateDashboardToCommand(command: string): void {
        const commandCode = CommandCode[command as keyof typeof CommandCode];
        this.dashboardUrl = commandCodeToLink(commandCode) || DEFAULT_DASHBOARD;
    }

    updateDashboardUrl(newUrl: string) {
        this.dashboardUrl = newUrl;
    }
}
