import { Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { UsuariosComponent } from "./pages/usuarios/usuarios.component";
import { ContactoComponent } from "./pages/contacto/contacto.component";

export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "usuarios", component: UsuariosComponent },
  { path: "contacto", component: ContactoComponent },
  { path: "**", redirectTo: "", pathMatch: "full" },
];
