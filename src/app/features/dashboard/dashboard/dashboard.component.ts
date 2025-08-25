import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChatComponent } from '../chat/chat.component';
import { UntitledNotesComponent } from '../untitled-notes/untitled-notes.component';
import { NotesComponent } from '../notes-component/notes/notes.component';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { SnackBarService } from '../../../core/services/snackBar.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: true,
  imports: [ChatComponent, UntitledNotesComponent, NotesComponent],
})
export class DashboardComponent {
  protected themeButtonText: string = 'Dark mode';

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private snackBarService: SnackBarService,
  ) { }

  public logoutWithAccount() {
    this.authService.logoutWithAccount();
    this.snackBarService.open('Ви успішно вийшли з акаунту!');
  }

  public deleteAccount() {
    this.authService.deleteAccount();
    this.snackBarService.open('Ви успішно видалили акаунт!');
  }

  public changeTheme() {
    this.themeButtonText = this.themeService.changeTheme();
    this.snackBarService.open(`Тема змінена на ${this.themeButtonText}`);
  }
}
