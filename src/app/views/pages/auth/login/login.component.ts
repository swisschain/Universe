import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';

import { AppState } from '../../../../core/reducers';
import { AuthNoticeService, AuthService, Login } from '../../../../core/auth';
import { HttpErrorResponse } from '@angular/common/http';
import { SignInResponse } from '../../../../core/auth/_models/sign-in-response';

@Component({
	selector: 'kt-login',
	templateUrl: './login.component.html',
	encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, OnDestroy {
	loginForm: FormGroup;
	loading = false;
	isLoggedIn$: Observable<boolean>;
	errors: any = [];

	private unsubscribe: Subject<any>;

	private returnUrl: any;

	constructor(
		private router: Router,
		private auth: AuthService,
		private authNoticeService: AuthNoticeService,
		private translate: TranslateService,
		private store: Store<AppState>,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,
		private route: ActivatedRoute
	) {
		this.unsubscribe = new Subject();
	}

	ngOnInit(): void {
		this.createForm();

		this.route.queryParams.subscribe(params => {
			this.returnUrl = params.returnUrl || '/';
		});
	}

	ngOnDestroy(): void {
		this.authNoticeService.setNotice(null);
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}

	createForm(): void {
		this.loginForm = this.fb.group({
			login: [null, Validators.compose([
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(320)
			])],
			password: [null, Validators.compose([
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(100)
			])]
		});
	}

	submit(): void {
		const controls = this.loginForm.controls;

		if (this.loginForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		this.loading = true;

		this.auth
			.login(controls.login.value, controls.password.value)
			.pipe(
				takeUntil(this.unsubscribe),
				finalize(() => {
					this.loading = false;
					this.cdr.markForCheck();
				})
			)
			.subscribe((user: SignInResponse) => {
				this.store.dispatch(new Login({ authToken: user.token }));
				this.router.navigateByUrl(this.returnUrl);
			}, (error: HttpErrorResponse) => {
				this.authNoticeService.setNotice(this.translate.instant('AUTH.VALIDATION.INVALID_LOGIN'), 'danger');
			});
	}

	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.loginForm.controls[controlName];
		if (!control) {
			return false;
		}
		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}
}
