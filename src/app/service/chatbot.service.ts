import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";

@Injectable({ providedIn: "root" })
export class ChatbotService {
    private readonly apiUrl = "https://mccsapi-fithlnac6q-uk.a.run.app";

    constructor(private http: HttpClient) { }

    generateAssistantResponse(question: string): Promise<string> {
        return firstValueFrom(this.http.post<string>(`${this.apiUrl}/generate/assistant`, question));
    }

    generateQuery(plainEnglishQuery: string): Promise<string> {
        return firstValueFrom(this.http.post<string>(`${this.apiUrl}/generate/query`, plainEnglishQuery));
    }

    executeEnglishQuery(plainEnglishQuery: string): Promise<any[]> {
        return firstValueFrom(this.http.post<any[]>(`${this.apiUrl}/query/english`, plainEnglishQuery));
    }
}
