import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { AuthResponseData, AuthService } from './auth.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode: boolean = true;
  pwdInputType = 'password';
  cnfPwdInputType = 'password';
  error: string = null;
  signupAuth = {
    password: '',
    confirmPassword: '',
  };
  @ViewChild(PlaceholderDirective, { static: false })
  alertHost: PlaceholderDirective;
  private alertSub: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit(): void {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onShowPassword(event: any) {
    this.pwdInputType = event.target.checked ? 'text' : 'password';
  }
  onShowConfirmPassword(event: any) {
    this.cnfPwdInputType = event.target.checked ? 'text' : 'password';
  }

  onSubmit(form: NgForm) {
    if (!form.valid) return;

    const { email, password } = form.value;
    let authObs: Observable<AuthResponseData>;
    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signUp(email, password);
    }
    authObs.subscribe(
      (resData) => {
        this.router.navigate(['/recipes']);
        form.reset();
      },
      (errorMessage) => {
        this.error = errorMessage;
        this.showErrorAlert(errorMessage);
      }
    );
  }

  onHandleError() {
    this.error = null;
  }

  private showErrorAlert(message: string) {
    const alertCmpFactory =
      this.componentFactoryResolver.resolveComponentFactory(AlertComponent);

    const hostViewcontainerRef = this.alertHost.viewContainerRef;

    hostViewcontainerRef.clear();

    const componentRef = hostViewcontainerRef.createComponent(alertCmpFactory);
    componentRef.instance.message = message;
    this.alertSub = componentRef.instance.close.subscribe(() => {
      this.alertSub.unsubscribe;
      hostViewcontainerRef.clear();
    });
  }

  ngOnDestroy(): void {
    if (this.alertSub) {
      this.alertSub.unsubscribe();
    }
  }
}
