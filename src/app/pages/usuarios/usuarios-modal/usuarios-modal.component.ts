import { Component, EventEmitter, Input, Output, inject } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { FuncHasError } from "../../../shared/utils";
import { UsersService } from "../../../services/users.service";

import { NgbCalendar, NgbDatepickerModule, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-usuarios-modal",
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, NgbDatepickerModule],
  templateUrl: "./usuarios-modal.component.html",
  styleUrl: "./usuarios-modal.component.css",
})
export class UsuariosModalComponent {
  private _usersService = inject(UsersService);

  @Input() agregarModificarUsuario: string = "";
  @Input() idUsuario: string = "";
  @Input() nombreUsuario: string = "";

  @Output() funUsuarioEliminado = new EventEmitter<void>();

  nombre: string = "";
  email: string = "";
  fecha: string = "";

  formUsuarios: FormGroup;

  model?: NgbDateStruct;

  constructor(private form: FormBuilder) {
    this.formUsuarios = this.form.group({
      nombre: ["", [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z ]+$/)]],
      email: ["", [Validators.required, Validators.email]],
      fecha: [],
    });
  }

  hasError(controlName: string, errorType: string) {
    return FuncHasError(this.formUsuarios, controlName, errorType);
  }

  eliminarEspacios(inputText: string) {
    switch (inputText) {
      case "nombre":
        this.nombre = this.nombre.trim();
        break;
      case "email":
        this.email = this.email.trim();
        break;
    }
  }

  funAceptar(): void {
    console.log(this.formUsuarios);
  }

  funAceptarEliminar(): void {
    this._usersService.deleteUser(this.idUsuario).subscribe((data: any) => {
      this.funUsuarioEliminado.emit();
    });
  }
}
