import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IMessage } from '../../../shared/Interfaces';
import { OpenAiService } from '../../../core/services/onpenai.service';
import { GroqService } from '../../../core/services/groq.service';
import { NoteService } from '../../../core/services/note.service';
import { AuthService } from '../../../core/services/auth.service';
import { SnackBarService } from '../../../core/services/snackBar.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  protected chatInput = new FormControl('', Validators.required);
  protected messageError: string = '';
  protected themeButtonText: string = 'Dark mode';


  public form = new FormGroup({
    chatInput: this.chatInput
  })
  protected messages: IMessage[] = [ //Потім видалити
    {
      user: 'User',
      text: 'Hello'
    },
    {
      user: 'Bot',
      text: 'Hello! How can I help you?'
    }
  ];

  protected nameUser: string = '';

  constructor(
    private openAiService: OpenAiService,
    private groqService: GroqService,
    private noteService: NoteService,
    private authService: AuthService,
    private snackBarService: SnackBarService
  ) {
    this.nameUser = this.authService.userisAuth?.login || '';
  }

  public sendMessage() {
    this.messageError = '';
    if (this.form.valid && this.chatInput.value?.trim()) {
      this.pushMessage('User', this.chatInput.value);

      this.groqService.summarize(this.chatInput.value).subscribe(
        res => { this.pushMessage('Bot', res); },
        err => { this.pushMessage('Bot', 'Error: ' + err.message); },
        () => { this.snackBarService.open('Повідомлення успішно відправлено!'); }
      )

      this.form.reset();
    } else {
      if (this.chatInput.hasError('required') || this.chatInput.value?.trim() === '') {
        this.messageError = '*Message is required';
      } else {
        this.messageError = '*Invalid message';
      }
    }
  }

  public selectMessage(message: IMessage) {
    if (message.user === 'Bot') {
      this.noteService.newNote({
        id: -1,
        title: '',
        content: message.text
      });
      this.snackBarService.open('Нотатка додана в режим редагування!');
    }
  }

  private pushMessage(user: string, text: string) {
    this.messages.push({
      user: user,
      text: text
    });
  }
}
