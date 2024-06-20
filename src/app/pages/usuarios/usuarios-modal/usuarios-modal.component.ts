import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { Guid } from "guid-typescript";

import { FuncHasError } from "../../../shared/utils";
import { UsersService } from "../../../services/users.service";
import { AdressesService } from "../../../services/adresses.service";
import { IAdress } from "../../../models/adress";
import { IUser } from "../../../models/user";

@Component({
  selector: "app-usuarios-modal",
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, NgbDatepickerModule],
  templateUrl: "./usuarios-modal.component.html",
  styleUrl: "./usuarios-modal.component.css",
})
export class UsuariosModalComponent implements OnInit, OnChanges {
  private _usersService = inject(UsersService);
  private _adressesService = inject(AdressesService);
  private cdr = inject(ChangeDetectorRef);

  @Input() agregarModificarUsuario: string = "";
  @Input() idUsuario: string = "";
  @Input() nombreUsuario: string = "";
  @Input() emailUsuario: string = "";
  @Input() fechaNacimiento: string = "";

  @Output() funConfirmacionModal = new EventEmitter<void>();

  nombre: string = "";
  email: string = "";
  fecha: { year: number; month: number; day: number } = { year: 1987, month: 10, day: 14 };
  adressesList: IAdress[] = [];
  nuevaDireccion: string = "";
  idTemporalDireccion: number = 10000;
  esDireccionRepetida: boolean = false;

  formUsuarios: FormGroup;

  constructor(private form: FormBuilder) {
    this.formUsuarios = this.form.group({
      nombre: ["", [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z ]+$/)]],
      email: ["", [Validators.required, Validators.email]],
      fecha: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.funListarDirecciones(this.idUsuario);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.nombre = this.nombreUsuario;
    this.email = this.emailUsuario;
    const splitFecha = this.fechaNacimiento.split("-");

    if (splitFecha.length > 1) {
      this.fecha = { year: parseInt(splitFecha[0]), month: parseInt(splitFecha[1]), day: parseInt(splitFecha[2].substring(0, 2)) };
    } else {
      this.fecha = { year: 1987, month: 10, day: 14 };
    }

    if (changes["idUsuario"] && changes["idUsuario"].currentValue) {
      this.funListarDirecciones(this.idUsuario);
    }
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
    if (idUsuario != "") {
      this._adressesService.getAdresses(idUsuario).subscribe((data: IAdress[]) => {
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
      return x.street.trim().toLowerCase() === this.nuevaDireccion.trim().toLowerCase();
    });

    this.esDireccionRepetida = index >= 0;

    return this.esDireccionRepetida;
  }

  funAceptar(): void {
    if (this.agregarModificarUsuario === "Agregar") {
      //>>AGREGAR<<
      this.idUsuario = Guid.create().toString();
      const usuarioAgregar: IUser = { id: this.idUsuario, fullName: this.nombre, birth: new Date(this.fecha.year, this.fecha.month - 1, this.fecha.day), email: this.email, street: "" };
      this._usersService.insertUser(JSON.stringify(usuarioAgregar)).subscribe((data: any) => {
        if (this.adressesList.length > 0) {
          this.adressesList.forEach((x) => {
            const direccion: IAdress = { idAdress: 0, idUser: this.idUsuario, street: x.street, principal: x.principal };
            this._adressesService.insertAdress(JSON.stringify(direccion)).subscribe((data: any) => {
              this.cdr.detectChanges();
              this.funConfirmacionModal.emit();
              this.funResetForm();
            });
          });
        } else {
          this.cdr.detectChanges();
          this.funConfirmacionModal.emit();
          this.funResetForm();
        }
      });
    } else {
      //>>MODIFICAR<<
      const usuarioModificar: IUser = { id: this.idUsuario, fullName: this.nombre, birth: new Date(this.fecha.year, this.fecha.month - 1, this.fecha.day), email: this.email, street: "" };
      this._usersService.updateUser(JSON.stringify(usuarioModificar)).subscribe((data: any) => {
        this.cdr.detectChanges();
        if (this.adressesList.length > 0) {
          this._adressesService.deleteAllAdress(this.idUsuario).subscribe((data: any) => {
            this.cdr.detectChanges();
            this.adressesList.forEach((x) => {
              const direccion: IAdress = { idAdress: 0, idUser: this.idUsuario, street: x.street, principal: x.principal };
              this._adressesService.insertAdress(JSON.stringify(direccion)).subscribe((data: any) => {
                this.cdr.detectChanges();
                this.funConfirmacionModal.emit();
                this.funResetForm();
              });
            });
          });
        } else {
          this.cdr.detectChanges();
          this.funConfirmacionModal.emit();
          this.funResetForm();
        }
      });
    }
  }

  funCancelar(): void {
    this.funResetForm();
  }

  funAceptarEliminar(): void {
    this._adressesService.deleteAllAdress(this.idUsuario).subscribe((data: any) => {
      this.cdr.detectChanges();
      this._usersService.deleteUser(this.idUsuario).subscribe((data: any) => {
        this.cdr.detectChanges();
        this.funConfirmacionModal.emit();
        this.funResetForm();
      });
    });
  }

  funCancelarEliminar(): void {
    this.funResetForm();
  }

  funResetForm(): void {
    this.idUsuario = "";
    this.nombreUsuario = "";
    this.emailUsuario = "";
    this.fechaNacimiento = "";
    this.adressesList = [];
    this.nuevaDireccion = "";
    this.idTemporalDireccion = 10000;
    this.esDireccionRepetida = false;
    this.formUsuarios.reset();
  }
}
