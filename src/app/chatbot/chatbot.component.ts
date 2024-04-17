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
    content: "Sorry, I am having an issue with that question, try another.",
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
    chatMessages: Message[] = [{ content: "Hello! You can ask me general questions about the data and dashboards.", sender: "chatbot" }, { content: "To ask data questions, start your chat 'data:', ex. 'data: which 5 commands have the most shrink?'", sender: "chatbot" }, { content: "To see specific command dashboards, start your chat with 'dash:', ex. 'dash: show me the dashboard for Camp Lejeune'", sender: "chatbot" }];
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
        const requestType = chat.split(" ")[0];

        if (requestType === "data:") {
            const response = await this.sendQuery(chat.substring(5));
            // eslint-disable-next-line max-len
            const prompt = "You are given a stringified JSON object that contains the data the user requested. The input may be too large, if it is over 200 characters truncate the data in a way that makes sense. The data is in the form of a JSON object. The data may contain information about a specific base camp or general information. Translate the data into a human-readable format, which means removing commas and adding spaces as well as adding introductory text, without losing the integrity of the data. Your output will be used directly as a string and not markdown. If you had to truncate the data, show your truncated response but tell the user that the response had to be truncated and to be more specific in their questions";
            const result = await this.model.generateContent(`${prompt} Here is the chat from the user: ${response}`);
            return { content: result.response.text(), sender: "chatbot" };
        }
        if (requestType === "dash:") {
            // eslint-disable-next-line max-len
            const prompt = "You are helping a user find the dashboard they are looking for. They have provided you a chat that may contain a location or a three letter code for a marine base camp. Analyze their chat to see if they are asking to see a dashboard specific camp, they must include 'dashboard' in their chat. If they are asking to see specific data about a camp or asking about your capabilities respond 'N/A'. The name of the specific camp may be a three letter code or a name of a location. If they do, respond only with the location or the three letter code. If you cannot determine location or code, respond N/A";
            // eslint-disable-next-line max-len
            const result = await this.model.generateContent(`${prompt} Here is the chat from the user: ${chat.substring(5)}`);
            const camp = result.response.text().toUpperCase();
            // not a command code input
            if (camp.length !== 3) {
                const campName = result.response.text().trim().toLowerCase();
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
        const prompt = "You are a chatbot helping a user understand the system. The user has asked you a question and you need to provide a response based off the following information: To ask a data question they must start their chat with 'data:', to change dashboards they must start their chat with 'dash:'. The objective of this site is to display shrink, which is a loss of inventory due to theft, damage, shipping errors, and more. The user can ask questions like 'what bases have the most shrink?' 'what causes the most shrink for CLM?'";
        const result = await this.model.generateContent(`${prompt} Here is the chat from the user: ${chat}`);
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
