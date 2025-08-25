import { Component } from '@angular/core';
import { NoteComponent } from '../note/note.component';
import { INote } from '../../../../shared/Interfaces';
import { NoteService } from '../../../../core/services/note.service';
import { NgFor, AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-notes',
  imports: [
    NoteComponent,
    NgFor,
    AsyncPipe
  ],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss'
})
export class NotesComponent {
  public notes$: Observable<INote[]>;

  constructor(private noteService: NoteService) {
    this.notes$ = this.noteService.notes$;
  }
}
