import { CommonModule } from "@angular/common";
import {
    AfterViewChecked,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
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
    @Output() newDashboardUrl = new EventEmitter<string>();

    showChatbot: boolean = false;
    chatMessages: Message[] = [{ content: "Hello! How can I help you today?", sender: "chatbot" }];
    newMessage: string = "";
    commands: { [key: string]: string } = {
        "camp pendleton": "PNM",
        albany: "ALM",
        "camp lejeune": "CLM",
    };
    urls: { [key: string]: string } = {
        // eslint-disable-next-line max-len
        PNM: "https://public.tableau.com/views/DistributionChartTypes/DistributionCharts?:language=en-US&:sid=&:display_count=n&:origin=viz_share_link",
        // eslint-disable-next-line max-len
        ALM: "https://public.tableau.com/views/TheEndofanErafortheSwitch/Dashboard?:language=en-US&:sid=&:display_count=n&:origin=viz_share_link",
        // eslint-disable-next-line max-len
        CLM: "https://public.tableau.com/views/DS41ApplicationAvocadoSales/Dashboard1?:language=en-US&:sid=&:display_count=n&:origin=viz_share_link",
    };
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
    sendNewUrl(url: string) {
        this.newDashboardUrl.emit(url);
    }
    async sendMessage() {
        if (this.newMessage.trim().length === 0) return;
        const chat = this.newMessage;
        this.newMessage = ""; // clear the chat input
        const textarea = this.chatInput.nativeElement as HTMLTextAreaElement;
        textarea.style.height = "25px";
        this.scrollToBottom();
        this.chatMessages.push({ content: chat, sender: "user" });
        try {
            this.chatMessages.push(await this.converse(chat));
        } catch (e) {
            this.chatMessages.push(DEFAULT_ERROR_MESSAGE);
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

    async converse(chat: string): Promise<Message> {
        if (!this.model) return DEFAULT_ERROR_MESSAGE;
        // eslint-disable-next-line max-len
        let prompt = "You are helping a user understand different dashboards showing data from different marine base camps. Analyze their chat to see if they are asking to see a dashboard, graph or visualization of a specific camp. The name of the specific camp may be a three letter code or a name of a location. If they are explicitly asking to see the dashboard for a base, respond only with the word 'LOOKUP' followed by the name of the camp they requested to see. If they are not explicitly asking for a dashboard, respond with N/A";
        let result = await this.model.generateContent(`${prompt} Here is the chat from the user: ${chat}`);
        if (result.response.text().includes("LOOKUP")) {
            const camp = result.response.text().split("LOOKUP")[1].trim().toUpperCase();
            // not a command code input
            if (camp.length !== 3) {
                const campName = result.response.text().substring(7).trim().toLowerCase();
                if (this.urls.hasOwnProperty.call(this.commands, campName)) {
                    this.sendNewUrl(this.urls[this.commands[campName]]);
                    return { content: `Of course, here is the dashboard for base ${campName}`, sender: "chatbot" };
                }

                // eslint-disable-next-line max-len
                return { content: `Sorry, I couldn't find a dashboard for base ${campName}, available bases are: ${Object.keys(this.commands)}`, sender: "chatbot" };
            }
            if (this.urls.hasOwnProperty.call(this.urls, camp)) {
                this.sendNewUrl(this.urls[camp]);
                // eslint-disable-next-line max-len
                return { content: `Of course, here is the dashboard for base ${camp}`, sender: "chatbot" };
            }
            // eslint-disable-next-line max-len
            return { content: `Sorry, I couldn't find a dashboard for base ${camp}, available bases are: ${Object.keys(this.urls)}`, sender: "chatbot" };
        }
        // eslint-disable-next-line max-len
        prompt = "You are helping a user understand different data they are being shown, and they may ask to see certain areas of the data. They may ask for the data for a certain camp. If they do, agree, saying that you will show them the data for that camp. They may ask for general information, do your best to answer. If you are unable to, tell them that you are unable to provide that information.";
        result = await this.model.generateContent(`${prompt} Here is the chat from the user: ${chat}`);
        return { content: result.response.text(), sender: "chatbot" };
    }
}
