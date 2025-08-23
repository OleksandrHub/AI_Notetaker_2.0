import { Injectable } from "@angular/core";
import { INote, INoteWithUserId } from "../../shared/Interfaces";
import { BehaviorSubject, max } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class NoteService {
    note: INote = {
        id: 0,
        title: '',
        content: ''
    };

    private defaultNote: INote[] = [ // Потім видалити
        {
            id: 1,
            title: 'Note 1',
            content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque laudantium recusandae eaque labore eos eum optio numquam dolor, dolore commodi sit dolores voluptatum magnam sunt repellat! Modi ipsum doloribus saepe.'
        },
        {
            id: 2,
            title: 'Note 2',
            content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque laudantium recusandae eaque labore eos eum optio numquam dolor, dolore commodi sit dolores voluptatum magnam sunt repellat! Modi ipsum doloribus saepe.'
        },
        {
            id: 3,
            title: 'Note 3',
            content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque laudantium recusandae eaque labore eos eum optio numquam dolor, dolore commodi sit dolores voluptatum magnam sunt repellat! Modi ipsum doloribus saepe.'
        }
    ];

    private notes = new BehaviorSubject<INote[]>([])
    notes$ = this.notes.asObservable();

    editNoteObj = new BehaviorSubject<INote>(this.note);
    editNote$ = this.editNoteObj.asObservable();

    constructor() { }

    saveNote(note: INote) {
        const temp_notes = this.notes.getValue();
        if (note.id === -1) {
            note.id = Math.max(0, ...temp_notes.map((n) => n.id)) + 1;
            const newNotes = [...temp_notes, note];
            this.notes.next(newNotes);
        } else {
            const index = temp_notes.findIndex(n => n.id === note.id);
            if (index !== -1) {
                const updatedNotes = [...temp_notes];
                updatedNotes[index] = note;
                this.notes.next(updatedNotes);
            }
        }
        this.saveNotesToLocalStorage();
    }

    deleteNote(id: number) {
        let temp_notes = this.notes.getValue();
        temp_notes = temp_notes.filter((note) => note.id !== id);
        this.notes.next(temp_notes);
        this.saveNotesToLocalStorage();
    }

    editNote(id: number) {
        const temp_notes = this.notes.getValue();
        this.note = temp_notes.filter((note) => note.id === id)[0];
        this.editNoteObj.next(this.note);
    }

    newNote(note: INote) {
        this.editNoteObj.next(note);
    }

    private saveNotesToLocalStorage() {
        const notes = this.notes.getValue();
        const user_id = localStorage.getItem('token');
        if (!user_id) return;
        const notesWithUserId = JSON.parse(localStorage.getItem('notes') || '{}') as INoteWithUserId;
        notesWithUserId[user_id] = notes;
        localStorage.setItem('notes', JSON.stringify(notesWithUserId));
    }

    loadNotesFromLocalStorage() {
        const notes = localStorage.getItem('notes');
        const user_id = localStorage.getItem('token');
        if (notes && user_id) {
            try {
                const parsedNotes = JSON.parse(notes) as INoteWithUserId;
                if (parsedNotes[user_id]) {
                    this.notes.next(parsedNotes[user_id]);
                    return;
                }
            } catch (e) {
                console.error('Could not parse notes from local storage', e);
                localStorage.removeItem('notes');
            }
        }
        this.notes.next(this.defaultNote);
    }
}