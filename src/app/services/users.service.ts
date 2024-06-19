import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "../../environments";
import { IUsers } from "../models/users";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  private _http = inject(HttpClient);
  private urlApi: string = environment.URL_API;

  getUsers(): Observable<IUsers[]> {
    return this._http.get<IUsers[]>(`${this.urlApi}/User`);
  }

  deleteUser(id: string): Observable<void> {
    return this._http.delete<void>(`${this.urlApi}/User?id=${id}`);
  }
}
