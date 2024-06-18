import { FormGroup } from "@angular/forms";

export function FuncHasError(myForm: FormGroup, controlName: string, errorType: string) {
  return myForm.get(controlName)?.hasError(errorType) && myForm.get(controlName)?.touched;
}
