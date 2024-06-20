import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "../../environments";
import { IAdress } from "../models/adress";

@Injectable({
  providedIn: "root",
})
export class AdressesService {
  private _http = inject(HttpClient);
  private urlApi: string = environment.URL_API;

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  insertAdress(direccion: string): Observable<any> {
    return this._http.post(`${this.urlApi}/Adress`, direccion, this.httpOptions);
  }

  getAdresses(idUser: string): Observable<IAdress[]> {
    return this._http.get<IAdress[]>(`${this.urlApi}/Adress/ById?idUser=${idUser}`);
  }

  deleteAllAdress(idUser: string): Observable<void> {
    return this._http.delete<void>(`${this.urlApi}/Adress/All?idUser=${idUser}`);
  }
}
