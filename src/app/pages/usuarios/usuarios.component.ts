import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UsuariosModalComponent } from "./usuarios-modal/usuarios-modal.component";
import { UsersService } from "../../services/users.service";
import { IUser } from "../../models/user";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-usuarios",
  standalone: true,
  imports: [UsuariosModalComponent, CommonModule, FormsModule],
  templateUrl: "./usuarios.component.html",
  styleUrl: "./usuarios.component.css",
})
export class UsuariosComponent implements OnInit {
  private _usersService = inject(UsersService);

  loading: boolean = true;
  usersList: IUser[] = [];
  agregarModificar: string = "";
  idUsuario: string = "";
  nombreUsuario: string = "";
  busquedaText: string = "";

  get filtroUsersList() {
    return this.usersList.filter((item) => Object.values(item).some((val) => String(val).toLowerCase().includes(this.busquedaText.toLowerCase())));
  }

  ngOnInit(): void {
    this.funListarUsuarios();
  }

  setAgregarModificar(agregaModifica: string) {
    this.agregarModificar = agregaModifica;
  }

  funListarUsuarios() {
    this._usersService.getUsers().subscribe((data: IUser[]) => {
      this.usersList = data;
      this.loading = false;
    });
  }

  funEliminar(id: string, nombre: string): void {
    this.idUsuario = id;
    this.nombreUsuario = nombre;
  }

  funModificar(id: string): void {
    this.setAgregarModificar("Modificar");
    this.idUsuario = id;
  }

  funConfirmacionModal(): void {
    this.loading = true;
    this.funListarUsuarios();
  }
}
