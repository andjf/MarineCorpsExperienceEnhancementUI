import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
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
    content: "Error connecting to model. Please ensure your API key is correct",
    sender: "chatbot"
};

@Component({
    selector: "app-chatbot",
    templateUrl: "./chatbot.component.html",
    standalone: true,
    imports: [CommonModule, FormsModule, FontAwesomeModule, HttpClientModule],
    styleUrls: ["./chatbot.component.css"]
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
    @ViewChild("chatInput") chatInput!: ElementRef;
    @ViewChild("chatbotContent") chatbotContent!: ElementRef;
    @Output() newDashboardUrl = new EventEmitter<string>();
    apiUrl = "http://localhost:8000/query/";
    showChatbot: boolean = false;
    constructor(private http: HttpClient) { }
    // eslint-disable-next-line max-len
    chatMessages: Message[] = [{ content: "Hello! How can I help you today? To see a dashboard for a command, just ask me.", sender: "chatbot" }];
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
        let prompt = "You are helping a user understand different dashboards showing data from different marine base camps. Analyze their chat to see if they are asking to see a dashboard specific camp, they must include 'dashboard' in their chat. If they are asking to see specific data about a camp or asking about your capabilities respond 'N/A'. The name of the specific camp may be a three letter code or a name of a location. If they are explicitly asking to see the dashboard for a base, respond only with the word 'LOOKUP' followed by the name of the camp they requested to see. If they want to see a dashboard, they will have included 'dashboard' in their request. If they have not requested a dashboard, respond N/A";
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
        prompt = "You are helping a user understand data from different marine base camps. Analyze their chat to see if they are asking to see specific data, they may be asking what you can help them with or other general information about the web app, if this is the case respond with N/A. If they are explicitly asking to see specific data, respond only with the word 'LOOKUP'";
        result = await this.model.generateContent(`${prompt} Here is the chat from the user: ${chat}`);
        if (result.response.text().includes("LOOKUP")) {
            const response = await this.sendQuery(chat);
            // eslint-disable-next-line max-len
            prompt = "You are given a stringified JSON object that contains the data the user requested. The data is in the form of a JSON object. The data may contain information about a specific base camp or general information. Translate the data into a human-readable format, which means removing commas and adding spaces as well as adding introductory text, without losing the integrity of the data. Your output will be used directly as a string and not markdown. If you are not given a JSON object,";
            result = await this.model.generateContent(`${prompt} Here is the chat from the user: ${response}`);
            return { content: `Sure, here is the data: ${result.response.text()}`, sender: "chatbot" };
        }
        // eslint-disable-next-line max-len
        prompt = "You are helping a user understand different data they are being shown. You can help users see specific dashboards for different commands and see specific data like answers to questions like 'What command causes the most shrink'. They may ask for general information, do your best to answer. If you are unable to, tell them that you are unable to help with that, then list what you can help with.";
        result = await this.model.generateContent(`${prompt} Here is the chat from the user: ${chat}`);
        return { content: result.response.text(), sender: "chatbot" };
    }
    sendQuery(message: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            // Send the POST request to your FastAPI backend
            this.http.post<any>(this.apiUrl, message).subscribe(
                (response) => {
                // Resolve the Promise with the response data
                    const stringVersion = JSON.stringify(response);
                    resolve(`${stringVersion}`);
                },
                (error) => {
                // Reject the Promise with the error message
                    console.log("Error", error);
                    reject(new Error("Sorry, I couldn't find the data you requested"));
                }
            );
        });
    }
}
