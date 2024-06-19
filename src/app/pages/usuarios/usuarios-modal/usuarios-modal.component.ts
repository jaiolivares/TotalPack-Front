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

  loading: boolean = true;
  adressesList: IAdresses[] = [];
  nombre: string = "";
  email: string = "";
  fecha: string = "";
  nuevaDireccion: string = "";
  idTemporalDireccion: number = 10000;

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
    //idUsuario = "3F6CF2C0-D0A1-476B-B855-4860113BD20C";
    if (idUsuario != "") {
      this._adressesService.getAdresses(idUsuario).subscribe((data: IAdresses[]) => {
        this.adressesList = data;
        this.loading = false;
      });
    }
  }

  funAgregarDireccion(): void {
    this.adressesList.forEach((x) => {
      x.principal = false;
    });
    this.idTemporalDireccion++;
    this.adressesList.push({ idAdress: this.idTemporalDireccion, idUser: this.idUsuario, street: this.nuevaDireccion, principal: true });
    this.nuevaDireccion = "";
    console.log(this.adressesList);
  }

  funCambiarDireccionPrincipal(idAdress: number) {
    this.adressesList.forEach((x) => {
      x.principal = x.idAdress === idAdress;
    });
  }

  funAceptar(): void {
    console.log(this.formUsuarios);
    this.nombre = "";
    this.email = "";
    this.fecha = "";
  }

  funCancelar(): void {
    this.nombre = "";
    this.email = "";
    this.fecha = "";
  }

  funAceptarEliminar(): void {
    this._usersService.deleteUser(this.idUsuario).subscribe((data: any) => {
      this.funUsuarioEliminado.emit();
    });
  }
}
