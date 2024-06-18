import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

import { IUsers } from "../models/users";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  private _http = inject(HttpClient);
  private urlApi: string = "https://localhost:7073/api/";
  //private urlApi: string = "https://fakestoreapi.com/products/";

  getUsers(): Observable<IUsers[]> {
    //return this._http.get<IUsers[]>(this.urlApi + "/User");
    return this._http.get<IUsers[]>(this.urlApi);
  }
}
