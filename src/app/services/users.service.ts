import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "../../environments";
import { IUser } from "../models/user";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  private _http = inject(HttpClient);
  private urlApi: string = environment.URL_API;

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  insertUser(usuario: string): Observable<any> {
    return this._http.post(`${this.urlApi}/User`, usuario, this.httpOptions);
  }

  getUsers(hoja: number): Observable<IUser[]> {
    return this._http.get<IUser[]>(`${this.urlApi}/User/Page?pageNumber=${hoja}`);
  }

  updateUser(usuario: string): Observable<any> {
    return this._http.put(`${this.urlApi}/User`, usuario, this.httpOptions);
  }

  deleteUser(id: string): Observable<void> {
    return this._http.delete<void>(`${this.urlApi}/User?id=${id}`);
  }
}
