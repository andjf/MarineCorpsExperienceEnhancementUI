import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ChatbotComponent } from "./chatbot.component";

describe("ChatbotComponent", () => {
    let component: ChatbotComponent;
    let fixture: ComponentFixture<ChatbotComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ChatbotComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ChatbotComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should have show chat bot boolean", () => {
        expect(component.showChatbot).toBeDefined();
    });

    it("should not show chat bot by default", () => {
        expect(component.showChatbot).toBeFalse();
    });

    it("should show chat bot after toggled", () => {
        component.toggleChatbot();
        expect(component.showChatbot).toBeTrue();
    });

    it("should have chat messages", () => {
        expect(component.chatMessages).toBeDefined();
    });

    it("should have chat messages populated", () => {
        expect(component.chatMessages).toContain({
            content: "Hello! How can I help you today?",
            sender: "chatbot"
        });
    });

    it("should have empty new message", () => {
        expect(component.currentMessage).toBeFalsy();
    });
});
