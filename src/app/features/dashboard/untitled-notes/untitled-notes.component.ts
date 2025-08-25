import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { INote } from '../../../shared/Interfaces';
import { NoteService } from '../../../core/services/note.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SnackBarService } from '../../../core/services/snackBar.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-untitled-notes',
  imports: [NgIf, FormsModule, ReactiveFormsModule],
  templateUrl: './untitled-notes.component.html',
  styleUrl: './untitled-notes.component.scss'
})
export class UntitledNotesComponent implements OnInit, OnDestroy {
  constructor(private noteService: NoteService, private snackBarService: SnackBarService) { }
  public note: INote = {
    id: 0,
    title: '',
    content: ''
  };

  private destroy$ = new Subject<void>();

  protected formTitle = new FormControl('', Validators.required);
  protected formContent = new FormControl('', Validators.required);
  protected messageError: string = '';

  public form = new FormGroup({
    formTitle: this.formTitle,
    formContent: this.formContent
  });

  ngOnInit() {
    this.noteService.editNote$
      .pipe(takeUntil(this.destroy$))
      .subscribe((note) => {
        this.note = note;
        this.form.patchValue({
          formTitle: note.title,
          formContent: note.content
        });
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public saveNote() {
    this.messageError = '';

    if (this.form.valid) {
      this.noteService.saveNote({
        id: this.note.id,
        title: this.formTitle.value || '',
        content: this.formContent.value || ''
      });
      this.snackBarService.open('Нотатка успішно збережена!');
      this.closeNote();
    } else {
      this.messageError = 'All fields are required';
    }
  }

  public closeNote() {
    this.noteService.newNote({ id: 0, title: '', content: '' });
    this.snackBarService.open('Нотатка успішно закрита!');

    this.form.reset();
  }
}
