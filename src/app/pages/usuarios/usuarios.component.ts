import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UsuariosModalComponent } from "./usuarios-modal/usuarios-modal.component";
import { UsersService } from "../../services/users.service";
import { IUsers } from "../../models/users";

@Component({
  selector: "app-usuarios",
  standalone: true,
  imports: [UsuariosModalComponent, CommonModule],
  templateUrl: "./usuarios.component.html",
  styleUrl: "./usuarios.component.css",
})
export class UsuariosComponent implements OnInit {
  private _usersService = inject(UsersService);

  loading: boolean = true;
  usersList: IUsers[] = [];
  agregarModificar: string = "";
  idUsuario: string = "";
  nombreUsuario: string = "";

  ngOnInit(): void {
    this.funListarUsuarios();
  }

  setAgregarModificar(agregaModifica: string) {
    this.agregarModificar = agregaModifica;
  }

  funListarUsuarios() {
    this._usersService.getUsers().subscribe((data: IUsers[]) => {
      this.usersList = data;
      this.loading = false;
    });
  }

  funEliminar(id: string, nombre: string): void {
    this.idUsuario = id;
    this.nombreUsuario = nombre;
  }

  funUsuarioEliminado(): void {
    this.loading = true;
    this.funListarUsuarios();
  }
}
