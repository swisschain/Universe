import { FormGroup, FormArray } from '@angular/forms';

export function getCommonError(response: any) {
    if (response && response.error && response.error.errors) {
        const errors = response.error.errors[''];
        if (errors && errors.length > 0) {
            return errors[0];
        }
    }
    return null;
}

export function setFormError(form: FormGroup, response: any) {
    Object.keys(response.error.errors).forEach(field => {
        const groups = field.match(/(\w+)\.(\w+)/);
        const arrayGroups = field.match(/(\w+)\[(\d+)\]\.(\w+)/);

        let formControl = null;

        if (arrayGroups && arrayGroups.length === 4) {
            const array = form.get(arrayGroups[1]) as FormArray;
            formControl = array.controls[Number(arrayGroups[2])].get(arrayGroups[3]);
        } else if (groups && groups.length === 3) {
            const array = form.get(groups[1]) as FormArray;
            formControl = array.get(groups[2]);
        } else {
            formControl = form.get(field);
        }
        if (formControl) {
            formControl.setErrors({
                serverError: response.error.errors[field]
            });
        }
    });
}

export function markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
        control.markAsTouched();
        if (control.controls) {
            markFormGroupTouched(control);
        }
    });
}

export function isFormGroupControlHasError(formGroup: FormGroup, controlName: string, validationType: string): boolean {
    const control = formGroup.controls[controlName];
    return control && control.hasError(validationType) && (control.dirty || control.touched);
}
