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
  @Input() public note!: INote;

  constructor(private noteService: NoteService, private snackBarService: SnackBarService) { }
  protected deleteNote(id: number) {
    this.noteService.deleteNote(id);
    this.snackBarService.open('Нотатка успішно видалена!');
  }

  protected editNote(id: number) {
    this.noteService.editNote(id);
  }

  protected DownloadNote(id: number) {
    this.noteService.DownloadNote(id) ? this.snackBarService.open('Нотатка успішно завантажена!') : this.snackBarService.open('Помилка завантаження нотатки!');
  }
}
