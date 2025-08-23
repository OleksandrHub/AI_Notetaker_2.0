import { ChangeDetectionStrategy, Component, } from '@angular/core';
@Component({
  selector: 'app-untitled-notes',
  templateUrl: './untitled-notes.component.html',
  styleUrl: './untitled-notes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class UntitledNotesComponent {
}
