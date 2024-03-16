import { CommonModule } from "@angular/common";
import {
    AfterViewChecked,
    Component,
    ElementRef,
    Input,
    OnInit,
    ViewChild
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons/faChevronUp";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons/faPaperPlane";
import {
    GenerativeModel,
    GoogleGenerativeAI,
    HarmBlockThreshold,
    HarmCategory
} from "@google/generative-ai";

const GEN_AI_MODEL = "gemini-pro";
const GEN_AI_CONFIG = {
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
    model: GEN_AI_MODEL,
};

interface Message {
    content: string;
    sender: "chatbot" | "user";
}

const DEFAULT_ERROR_MESSAGE: Message = {
    content: "Error connecting to model. Please ensure yor API key is correct",
    sender: "chatbot"
};

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

    showChatbot: boolean = false;
    chatMessages: Message[] = [{ content: "Hello! How can I help you today?", sender: "chatbot" }];
    newMessage: string = "";

    chevronUp = faChevronUp;
    paperPlane = faPaperPlane;

    @Input() apiKey?: string;
    model?: GenerativeModel;

    ngOnInit() {
        if (this.apiKey) { // if the apiKey was provided...
            const generativeAI = new GoogleGenerativeAI(this.apiKey);
            this.model = generativeAI.getGenerativeModel(GEN_AI_CONFIG);
        }
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    toggleChatbot() {
        this.showChatbot = !this.showChatbot;
    }

    async sendMessage() {
        if (this.newMessage.trim().length === 0) return;
        this.chatMessages.push({ content: this.newMessage, sender: "user" });
        try {
            this.chatMessages.push(await this.converse(this.newMessage));
        } catch (e) {
            this.chatMessages.push(DEFAULT_ERROR_MESSAGE);
        }
        this.newMessage = "";
        this.scrollToBottom();
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

    async converse(chat: string): Promise<Message> {
        if (!this.model) return DEFAULT_ERROR_MESSAGE;
        // prompt still needs fixing
        // eslint-disable-next-line max-len
        const prompt = "You are helping a user understand different data they are being shown, and they may ask to see certain areas of the data. They may ask for the data for a certain camp. If they do, agree, saying that you will show them the data for that camp. They may ask for general information, do your best to answer. If you are unable to, tell them that you are unable to provide that information.";
        const result = await this.model.generateContent(`${prompt} Here is the chat from the user: ${chat}`);
        return { content: result.response.text(), sender: "chatbot" };
    }
}
