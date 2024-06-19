import { Component, OnInit, inject } from "@angular/core";
import { UsuariosModalComponent } from "./usuarios-modal/usuarios-modal.component";
import { IUsers } from "../../models/users";
import { UsersService } from "../../services/users.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-usuarios",
  standalone: true,
  imports: [UsuariosModalComponent, CommonModule],
  templateUrl: "./usuarios.component.html",
  styleUrl: "./usuarios.component.css",
})
export class UsuariosComponent implements OnInit {
  loading: boolean = true;
  usersList: IUsers[] = [];
  agregarModificar: string = "";

  private _usersService = inject(UsersService);

  ngOnInit(): void {
    this._usersService.getUsers().subscribe((data: IUsers[]) => {
      this.usersList = data;
      this.loading = false;
      console.log(data);
    });
  }

  setAgregarModificar(agregaModifica: string) {
    this.agregarModificar = agregaModifica;
  }

  funEliminar(): void {}
}
