import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SnackBarService } from '../../../core/services/snackBar.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  protected errorMessage: string = '';

  protected formLogin = new FormControl('', Validators.required);
  protected formPassword = new FormControl('', [Validators.required, Validators.minLength(6)]);
  protected form = new FormGroup({
    formLogin: this.formLogin,
    formPassword: this.formPassword
  })

  constructor(private router: Router, private authService: AuthService, private snackBarService: SnackBarService) { }

  public sendLogin() {
    this.errorMessage = '';
    if (this.form.valid) {
      const user = this.authService.users.find((user) => user.login === this.formLogin.value && user.password === this.formPassword.value);
      if (user) {
        this.authService.login(user);
        this.snackBarService.open('Ви успішно увійшли!');
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = 'Invalid login or password';
      }
    } else {
      this.formIsValid();
    }
  }

  private formIsValid() {
    if (this.formLogin.hasError('required')) {
      this.errorMessage = 'Login is required.';
    } else if (this.formPassword.hasError('required')) {
      this.errorMessage = 'Password is required.';
    } else if (this.formPassword.hasError('minlength')) {
      this.errorMessage = 'Password must be at least 6 characters long.';
    } else {
      this.errorMessage = 'Form is invalid. Please check your input.';
    }
  }
}
