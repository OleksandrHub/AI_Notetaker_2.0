import { Component, OnDestroy, OnInit } from '@angular/core';
import { NoteComponent } from '../note/note.component';
import { INote } from '../../../../shared/Interfaces';
import { NoteService } from '../../../../core/services/note.service';
import { NgFor, AsyncPipe } from '@angular/common';
import { map, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-notes',
  imports: [
    NoteComponent,
    NgFor,
  ],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss'
})
export class NotesComponent implements OnInit, OnDestroy {
  public notes$: Observable<INote[]>;
  public notes: INote[] = [];
  public selectedTag: string | null = null;
  private notesSub!: Subscription;

  constructor(private noteService: NoteService) {
    this.notes$ = this.noteService.notes$;
  }

  ngOnInit() {
    this.notesSub = this.noteService.notes$.subscribe(data => {
      this.notes = data;
    });
  }

  ngOnDestroy() {
    this.notesSub.unsubscribe();
  }

  get allTags(): string[] {
    return [...new Set(this.notes.flatMap(n => n.tags ?? []))];
  }

  filterByTag(tag: string) {
    this.selectedTag = tag;
  }

  filteredNotes(): INote[] {
    return this.selectedTag
      ? this.notes.filter(n => n.tags?.includes(this.selectedTag!))
      : this.notes;
  }
}
