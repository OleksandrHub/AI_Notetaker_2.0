import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";

import { Environment } from "../../shared/environment";
import { AIResponse } from "../../shared/Interfaces";

@Injectable({
    providedIn: "root",
})
export class OpenAiService {
    private readonly apiUrl = "https://api.openai.com/v1/chat/completions";
    private readonly requestHeader = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Environment.OPENAI_API_KEY}`
    })

    constructor(private http: HttpClient) { }

    public summarize(text: string): Observable<string> {
        const body = {
            "model": "gpt-3.5-turbo",
            "messages": [
                { "role": "system", "content": "Ти  асистент, який вміє стисло переказувати текст." },
                { "role": "user", "content": `Ось текст лекції. Сконспектуй головне: ${text}` }
            ]
        };
        return this.http.post<AIResponse>(this.apiUrl, body, { headers: this.requestHeader }).pipe(
            map((res) => res.choices[0].message.content)
        )
    }
}