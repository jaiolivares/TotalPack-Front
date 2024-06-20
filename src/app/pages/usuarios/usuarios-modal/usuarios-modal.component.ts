import { Component, EventEmitter, Input, OnInit, Output, inject } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { FuncHasError } from "../../../shared/utils";
import { UsersService } from "../../../services/users.service";

import { NgbCalendar, NgbDatepickerModule, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { AdressesService } from "../../../services/adresses.service";
import { IAdresses } from "../../../models/adresses";

@Component({
  selector: "app-usuarios-modal",
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, NgbDatepickerModule],
  templateUrl: "./usuarios-modal.component.html",
  styleUrl: "./usuarios-modal.component.css",
})
export class UsuariosModalComponent implements OnInit {
  private _usersService = inject(UsersService);
  private _adressesService = inject(AdressesService);

  @Input() agregarModificarUsuario: string = "";
  @Input() idUsuario: string = "";
  @Input() nombreUsuario: string = "";

  @Output() funUsuarioEliminado = new EventEmitter<void>();

  nombre: string = "";
  email: string = "";
  fecha: string = "";
  adressesList: IAdresses[] = [];
  nuevaDireccion: string = "";
  idTemporalDireccion: number = 10000;
  esDireccionRepetida: boolean = false;

  formUsuarios: FormGroup;

  model?: NgbDateStruct;

  constructor(private form: FormBuilder) {
    this.formUsuarios = this.form.group({
      nombre: ["", [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z ]+$/)]],
      email: ["", [Validators.required, Validators.email]],
      fecha: [],
    });
  }

  ngOnInit(): void {
    console.log("xx" + this.idUsuario);
    console.log("zz" + this, this.nombreUsuario);
    this.funListarDirecciones(this.idUsuario);
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

  funListarDirecciones(idUsuario: string) {
    idUsuario = "3F6CF2C0-D0A1-476B-B855-4860113BD20C";
    if (idUsuario != "") {
      this._adressesService.getAdresses(idUsuario).subscribe((data: IAdresses[]) => {
        this.adressesList = data;
      });
    }
  }

  funAgregarDireccion(): void {
    if (this.nuevaDireccion.trim() !== "") {
      if (!this.funEsDireccionRepetida()) {
        this.adressesList.forEach((x) => {
          x.principal = false;
        });
        this.idTemporalDireccion++;
        this.adressesList.push({ idAdress: this.idTemporalDireccion, idUser: this.idUsuario, street: this.nuevaDireccion.trim(), principal: true });
        this.nuevaDireccion = "";
      }
    }
  }

  funCambiarDireccionPrincipal(idAdress: number) {
    this.adressesList.forEach((x) => {
      x.principal = x.idAdress === idAdress;
    });
  }

  funEsDireccionRepetida(): boolean {
    if (this.adressesList.length == 0) {
      this.esDireccionRepetida = false;
    }
    const index = this.adressesList.findIndex((x) => {
      if (x.street.trim().toLowerCase() === this.nuevaDireccion.trim().toLowerCase()) {
        return true;
      }
      return false;
    });

    this.esDireccionRepetida = index >= 0;

    return this.esDireccionRepetida;
  }

  funAceptar(): void {
    console.log(this.formUsuarios);
    this.funResetForm();
  }

  funCancelar(): void {
    this.funResetForm();
  }

  funAceptarEliminar(): void {
    this._usersService.deleteUser(this.idUsuario).subscribe((data: any) => {
      this.funUsuarioEliminado.emit();
    });
  }

  funResetForm(): void {
    this.nombre = "";
    this.email = "";
    this.fecha = "";
    this.adressesList = [];
    this.nuevaDireccion = "";
    this.idTemporalDireccion = 10000;
    this.esDireccionRepetida = false;
  }
}
