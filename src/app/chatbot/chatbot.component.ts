import { CommonModule } from "@angular/common";
import {
    AfterViewChecked,
    Component,
    ElementRef,
    OnInit,
    ViewChild
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons/faChevronUp";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons/faPaperPlane";
import {
    GoogleGenerativeAI,
    HarmBlockThreshold,
    HarmCategory
} from "@google/generative-ai";

import { environment } from "../../environments/environment.development";

const genAI = new GoogleGenerativeAI(environment.API_KEY);
const generationConfig = {
    safetySettings: [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
    ],
    temperature: 0.9,
    top_p: 1,
    top_k: 32,
    maxOutputTokens: 100, // limit output
};
const model = genAI.getGenerativeModel({
    model: "gemini-pro",
    ...generationConfig,
});

interface Message {
    content: string;
    sender: "chatbot" | "user";
}

@Component({
    selector: "app-chatbot",
    templateUrl: "./chatbot.component.html",
    standalone: true,
    imports: [CommonModule, FormsModule, FontAwesomeModule],
    styleUrls: ["./chatbot.component.css"]
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
    @ViewChild("chatInput") chatInput!: ElementRef;
    @ViewChild("chatbotContent") chatbotContent!: ElementRef;
    chevronUp = faChevronUp;
    paperPlane = faPaperPlane;
    showChatbot: boolean = false;
    chatMessages: Message[] = [{ content: "Hello! How can I help you today?", sender: "chatbot" }];
    newMessage: string = "";

    ngOnInit() {
        this.scrollToBottom();
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    toggleChatbot() {
        this.showChatbot = !this.showChatbot;
    }

    sendMessage() {
        if (this.newMessage.trim() !== "") {
            this.chatMessages.push({ content: this.newMessage, sender: "user" });
            this.converse(this.newMessage);
            this.newMessage = "";
        }
        const textarea = this.chatInput.nativeElement as HTMLTextAreaElement;
        textarea.style.height = "25px";
    }

    private scrollToBottom(): void {
        this.chatbotContent.nativeElement.scrollTop = this.chatbotContent.nativeElement.scrollHeight;
    }

    adjustTextareaHeight(): void {
        const textarea = this.chatInput.nativeElement as HTMLTextAreaElement;
        textarea.style.overflow = "hidden";
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
    }

    async converse(chat: string) {
        // prompt still needs fixing
        // eslint-disable-next-line max-len
        const prompt = "You are helping a user understand different data they are being shown, and they may ask to see certain areas of the data. They may ask for the data for a certain camp. If they do, agree, saying that you will show them the data for that camp. They may ask for general information, do your best to answer. If you are unable to, tell them that you are unable to provide that information.";
        const result = await model.generateContent(`${prompt} Here is the chat from the user: ${chat}`);
        this.chatMessages.push({ content: result.response.text(), sender: "chatbot" });
        this.scrollToBottom();
    }
}
