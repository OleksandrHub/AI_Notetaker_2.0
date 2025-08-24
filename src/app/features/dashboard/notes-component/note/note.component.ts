import { Component, Input } from '@angular/core';
import { NoteService } from '../../../../core/services/note.service';
import { INote } from '../../../../shared/Interfaces';
import { SnackBarService } from '../../../../core/services/snackBar.service';

@Component({
  selector: 'app-note',
  imports: [],
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss'
})
export class NoteComponent {
  @Input() note!: INote;

  constructor(private noteService: NoteService, private snackBarService: SnackBarService) { }
  deleteNote(id: number) {
    this.noteService.deleteNote(id);
    this.snackBarService.open('Нотатка успішно видалена!');
  }

  editNote(id: number) {
    this.noteService.editNote(id);
  }
}
