import { Component, Input } from '@angular/core';
import { NoteService } from '../../../../core/services/note.service';
import { INote } from '../../../../shared/Interfaces';
import { SnackBarService } from '../../../../core/services/snackBar.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-note',
  imports: [CommonModule, FormsModule],
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss'
})
export class NoteComponent {
  @Input() public note!: INote;
  public newTag: string = '';

  constructor(private noteService: NoteService, private snackBarService: SnackBarService) { }

  public addTag() {
    if (this.newTag && !this.note.tags?.includes(this.newTag)) {
      if (!this.note.tags) {
        this.note.tags = [];
      }
      this.note.tags.push(this.newTag);
      this.noteService.saveNote(this.note);
      this.newTag = '';
    }

  }

  public removeTag(tag: string) {
    if (!this.note.tags) return;
    this.note.tags = this.note.tags.filter(t => t !== tag);
    this.noteService.saveNote(this.note);
  }

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
