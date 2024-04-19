/* eslint-disable max-len */
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import {
    AfterViewChecked,
    Component,
    ElementRef,
    EventEmitter,
    Output,
    ViewChild
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { CommandCode, commandCodeToLink } from "@models";
import { ChatbotService } from "@services";

interface Message {
    content: string;
    sender: "chatbot" | "user";
}

@Component({
    selector: "app-chatbot",
    templateUrl: "./chatbot.component.html",
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule, MatIconModule],
    styleUrls: ["./chatbot.component.css"]
})
export class ChatbotComponent implements AfterViewChecked {
    @ViewChild("chatInput") chatInput!: ElementRef;
    @ViewChild("chatbotContent") chatbotContent!: ElementRef;

    @Output() newDashboardUrl = new EventEmitter<string>();

    showChatbot: boolean = false;

    constructor(private chatbotService: ChatbotService) { }

    chatMessages: Message[] = [
        {
            content: "Hello! You can ask me general questions about the data and dashboards.",
            sender: "chatbot"
        },
        {
            content: "To ask data questions, start your chat 'data:', ex. 'data: which 5 commands have the most shrink?'",
            sender: "chatbot"
        },
        {
            content: "To see specific command dashboards, start your chat with 'dash:', ex. 'dash: show me the dashboard for Camp Lejeune'",
            sender: "chatbot"
        },
    ];

    currentMessage: string = "";

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    toggleChatbot() {
        this.showChatbot = !this.showChatbot;
    }

    async sendMessage() {
        const chat = this.currentMessage.trim();
        if (chat.length === 0) return;

        this.currentMessage = "";

        const textarea = this.chatInput.nativeElement as HTMLTextAreaElement;
        textarea.style.height = "25px";
        this.scrollToBottom();

        this.chatMessages.push({ content: chat, sender: "user" });
        try {
            this.chatMessages.push(await this.converse(chat));
        } catch (e) {
            this.chatMessages.push({
                content: "Sorry, I am having an issue with that question, try another.",
                sender: "chatbot"
            });
        }
    }

    previousMessage(): void {
        if (this.currentMessage.trim().length !== 0) return;
        const lastUserMessage = this.chatMessages
            .slice().reverse().find((m) => m.sender === "user");
        if (lastUserMessage) {
            this.currentMessage = lastUserMessage.content;
        }
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

    private getDashboardResponse(chat: string): Message {
        const commandCodes = Object.keys(CommandCode);
        const foundCommandCode = commandCodes.find((code) => chat.includes(code.toUpperCase()));

        if (foundCommandCode) {
            const commandCode = CommandCode[foundCommandCode as keyof typeof CommandCode];
            const url = commandCodeToLink(commandCode);
            if (url) {
                this.newDashboardUrl.emit(url);
                return {
                    content: `Of course. Here is the dashboard for ${commandCode}`,
                    sender: "chatbot",
                };
            }
            return {
                content: `Sorry, I don't have a dashboard link for ${commandCode}`,
                sender: "chatbot",
            };
        }

        const commandKeywords = Object.values(CommandCode);
        const foundCommand = commandKeywords.find(
            (keywords) => keywords.toUpperCase().split(" ")
                .filter((keyword) => keyword.length > 0 && keyword !== "CAMP")
                .some((keyword) => chat.toUpperCase().includes(keyword))
        );

        if (foundCommand) {
            const url = commandCodeToLink(foundCommand);
            if (url) {
                this.newDashboardUrl.emit(url);
                return {
                    content: `Of course. Here is the dashboard for ${foundCommand}`,
                    sender: "chatbot",
                };
            }
            return {
                content: `Sorry, I don't have a dashboard link for ${foundCommand}`,
                sender: "chatbot",
            };
        }

        return {
            content: "Sorry, I couldn't tell which dashboard you were asking for. Please try again.",
            sender: "chatbot",
        };
    }

    async converse(chat: string): Promise<Message> {
        const formattedChat = chat.trim().toLowerCase();

        if (formattedChat.startsWith("data:")) {
            const restOfChat = chat.substring("data:".length).trim();
            const res = await this.chatbotService.executeEnglishQuery(restOfChat);
            return {
                // TODO: Instead of just stringifying the response,
                // maybe we can format it in a more readable way.
                // For example, if the response is an array of objects,
                // we can display the objects in a table format.
                content: JSON.stringify(res, null, 2),
                sender: "chatbot",
            };
        }

        if (formattedChat.startsWith("dash:")) {
            const restOfChat = chat.substring("dash:".length).trim();
            return this.getDashboardResponse(restOfChat);
        }

        const res = await this.chatbotService.generateAssistantResponse(chat);
        return { content: res, sender: "chatbot" };
    }
}
