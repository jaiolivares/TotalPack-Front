import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "../../environments";
import { IAdresses } from "../models/adresses";

@Injectable({
  providedIn: "root",
})
export class AdressesService {
  private _http = inject(HttpClient);
  private urlApi: string = environment.URL_API;

  getAdresses(idUser: string): Observable<IAdresses[]> {
    //if (idUser === "") return new Observable<IAdresses[]>();
    return this._http.get<IAdresses[]>(`${this.urlApi}/Adress/ById?idUser=${idUser}`);
  }

  // deleteUser(id: string): Observable<void> {
  //   return this._http.delete<void>(`${this.urlApi}/User?id=${id}`);
  // }
}
