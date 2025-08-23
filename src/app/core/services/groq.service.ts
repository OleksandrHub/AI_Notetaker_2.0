import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { Environment } from "../../shared/environment";
import { AIResponse } from "../../shared/Interfaces";

@Injectable({ providedIn: 'root' })
export class GroqService {
    private readonly apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

    private readonly headers = new HttpHeaders({
        'Authorization': 'Bearer ' + Environment.OPEN_ROUTER_API_KEY,
        'Content-Type': 'application/json'
    });

    constructor(private http: HttpClient) { }

    summarize(text: string): Observable<string> {
        const body = {
            model: 'llama3-8b-8192',
            messages: [
                { role: "system", content: "Ти асистент, який стисло переказує тексти українською." },
                { role: "user", content: `Сконспектуй наступне: ${text}` }
            ]
        };

        return this.http.post<AIResponse>(this.apiUrl, body, { headers: this.headers }).pipe(
            map((res) => res.choices[0].message.content)
        );
    }
}
