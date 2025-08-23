<!-- додати кусок коду у файл environment.ts -->

```typescript
export class Environment {
  static readonly OPENAI_API_KEY = "";
  static readonly OPEN_ROUTER_API_KEY = "";
}
```

<!-- Якщо використовуєте OpenAI змініть в chat.component.ts  -->

```typescript
 sendMessage() {
    ...
      this.groqService.summarize(this.chatInput.value).subscribe({ // gropService на openAiService
    ...
```
