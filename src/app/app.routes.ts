import { Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { UsersComponent } from "./pages/users/users.component";
import { ContactoComponent } from "./pages/contacto/contacto.component";

export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "usuarios", component: UsersComponent },
  { path: "contacto", component: ContactoComponent },
  { path: "**", redirectTo: "", pathMatch: "full" },
];
