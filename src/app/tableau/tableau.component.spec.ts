import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { RouterTestingModule } from "@angular/router/testing";

import { TableauComponent } from "./tableau.component";

describe("TableauComponent", () => {
    let component: TableauComponent;
    let fixture: ComponentFixture<TableauComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TableauComponent, RouterTestingModule],
            providers: [provideAnimationsAsync()]
        }).compileComponents();

        fixture = TestBed.createComponent(TableauComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
