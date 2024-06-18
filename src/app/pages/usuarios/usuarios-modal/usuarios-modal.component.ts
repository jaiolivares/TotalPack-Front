import { Component, Input } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { FuncHasError } from "../../../shared/utils";

@Component({
  selector: "app-usuarios-modal",
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: "./usuarios-modal.component.html",
  styleUrl: "./usuarios-modal.component.css",
})
export class UsuariosModalComponent {
  @Input() agregarModificarUsuario: string = "";

  codigo: string = "";
  nombre: string = "";
  nombreUsuario: string = "aaaa";
  //isChecked: boolean = true;

  formUsuarios: FormGroup;

  constructor(private form: FormBuilder) {
    this.formUsuarios = this.form.group({
      codigo: ["", [Validators.required, Validators.minLength(3)]],
      nombre: ["", [Validators.required, Validators.minLength(3)]],
    });
  }

  hasError(controlName: string, errorType: string) {
    return FuncHasError(this.formUsuarios, controlName, errorType);
  }

  aceptar(e: Event): void {
    e.preventDefault();
    console.log("xxx");
    console.log(this.formUsuarios);

    //const modal = document.getElementById("modalBancos");
  }
}
