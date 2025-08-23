import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class NoteComponent {
}
