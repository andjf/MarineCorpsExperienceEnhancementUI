import { Injectable } from "@angular/core";

export enum Theme {
    Light = "light",
    Dark = "dark",
}

@Injectable({ providedIn: "root" })
export class ThemeService {
    private theme = Theme.Dark;

    get currentTheme() {
        return this.theme;
    }

    public toggleTheme() {
        this.theme = this.theme === Theme.Dark ? Theme.Light : Theme.Dark;
        document.body.classList.toggle(Theme.Dark);
    }
}
