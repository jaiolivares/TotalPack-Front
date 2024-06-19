import { Component, EventEmitter, Input, Output, inject } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { FuncHasError } from "../../../shared/utils";
import { UsersService } from "../../../services/users.service";

@Component({
  selector: "app-usuarios-modal",
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: "./usuarios-modal.component.html",
  styleUrl: "./usuarios-modal.component.css",
})
export class UsuariosModalComponent {
  private _usersService = inject(UsersService);

  @Input() agregarModificarUsuario: string = "";
  @Input() idUsuario: string = "";
  @Input() nombreUsuario: string = "";

  @Output() funUsuarioEliminado = new EventEmitter<void>();

  // codigo: string = "";
  // nombre: string = "";

  formUsuarios: FormGroup;

  constructor(private form: FormBuilder) {
    this.formUsuarios = this.form.group({
      codigo: ["", [Validators.required, Validators.minLength(3)]],
      nombre: ["", [Validators.required, Validators.minLength(3)]],
    });
  }

  // hasError(controlName: string, errorType: string) {
  //   return FuncHasError(this.formUsuarios, controlName, errorType);
  // }

  funAceptar(): void {}

  funAceptarEliminar(): void {
    this._usersService.deleteUser(this.idUsuario).subscribe((data: any) => {
      this.funUsuarioEliminado.emit();
    });
  }
}
