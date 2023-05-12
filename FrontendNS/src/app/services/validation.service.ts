import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  SameDimensionValidator(control: AbstractControl): ValidationErrors | null {
    const file = control.value as File;
    if (!file) {
      return null;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const image = new Image();
      image.src = reader.result as string;
      image.onload = () => {
        if (image.width !== image.height) {
          control.setErrors({ sameDimension: true });
        } else {
          control.setErrors(null);
        }
      };
    };

    return null;
  }

}
