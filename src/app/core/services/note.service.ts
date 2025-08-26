import { Injectable } from "@angular/core";
import { INote, INoteWithUserId } from "../../shared/Interfaces";
import { BehaviorSubject } from "rxjs";
import { NOTES, TOKEN_KEY } from "../../shared/constants";
import jsPDF from 'jspdf';

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
            content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque laudantium recusandae eaque labore eos eum optio numquam dolor, dolore commodi sit dolores voluptatum magnam sunt repellat! Modi ipsum doloribus saepe.',
            tags: ['tag1', 'tag2', 'tag3']
        },
        {
            id: 2,
            title: 'Note 2',
            content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque laudantium recusandae eaque labore eos eum optio numquam dolor, dolore commodi sit dolores voluptatum magnam sunt repellat! Modi ipsum doloribus saepe.',
            tags: ['tag1', 'tag2']
        },
        {
            id: 3,
            title: 'Note 3',
            content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque laudantium recusandae eaque labore eos eum optio numquam dolor, dolore commodi sit dolores voluptatum magnam sunt repellat! Modi ipsum doloribus saepe.'
        }
    ];

    private notes = new BehaviorSubject<INote[]>([])
    public notes$ = this.notes.asObservable();

    private editNoteObj = new BehaviorSubject<INote>(this.note);
    public editNote$ = this.editNoteObj.asObservable();

    public saveNote(note: INote) {
        const temp_notes = this.notes.getValue();

        if (note.id === -1) {
            // Create a new note
            note.id = Math.max(0, ...temp_notes.map((n) => n.id)) + 1;
            const newNotes = [...temp_notes, note];
            this.notes.next(newNotes);
        } else {
            const index = temp_notes.findIndex(n => n.id === note.id);
            if (index !== -1) {
                // Update the note
                const updatedNotes = [...temp_notes];
                updatedNotes[index] = note;
                this.notes.next(updatedNotes);
            }
        }
        this.saveNotesToLocalStorage();
    }

    public deleteNote(id: number) {
        let temp_notes = this.notes.getValue();
        temp_notes = temp_notes.filter((note) => note.id !== id);
        this.notes.next(temp_notes);
        this.saveNotesToLocalStorage();
    }

    public editNote(id: number) {
        const temp_notes = this.notes.getValue();
        this.note = temp_notes.filter((note) => note.id === id)[0];
        this.editNoteObj.next(this.note);
    }

    public newNote(note: INote) {
        this.editNoteObj.next(note);
    }

    public DownloadNote(id: number): boolean {
        const temp_notes = this.notes.getValue();
        const note = temp_notes.filter((note) => note.id === id)[0];
        if (note) {
            const doc = new jsPDF({ unit: 'mm', format: 'a4' });

            doc.setFontSize(22);
            doc.setFont("helvetica", "bold");
            doc.text(note.title, 10, 20, { maxWidth: 180 });

            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.text(note.content, 10, 40, { maxWidth: 180 });

            const date = new Date().toLocaleDateString();
            const pageHeight = doc.internal.pageSize.height;
            const pageWidth = doc.internal.pageSize.width;
            const textWidth = doc.getTextWidth(`Дата: ${date}`);

            doc.setFontSize(10);
            doc.text(`Дата: ${date}`, pageWidth - textWidth - 20, pageHeight - 10);

            doc.save(note.title + '.pdf');
            return true;
        } else {
            return false;
        }
    }

    public loadNotesFromLocalStorage() {
        const notes = localStorage.getItem(NOTES);
        const user_id = localStorage.getItem(TOKEN_KEY);

        if (notes && user_id) {
            try {
                const parsedNotes = JSON.parse(notes) as INoteWithUserId;
                if (parsedNotes[user_id]) {
                    this.notes.next(parsedNotes[user_id]);
                    return;
                }
            } catch (e) {
                console.error('Could not parse notes from local storage', e);
                localStorage.removeItem(NOTES);
            }
        }
        this.notes.next(this.defaultNote);
    }

    private saveNotesToLocalStorage() {
        const notes = this.notes.getValue();
        const user_id = localStorage.getItem(TOKEN_KEY);
        if (!user_id) return;
        const notesWithUserId = JSON.parse(localStorage.getItem(NOTES) || '{}') as INoteWithUserId;
        notesWithUserId[user_id] = notes;
        localStorage.setItem('notes', JSON.stringify(notesWithUserId));
    }
}