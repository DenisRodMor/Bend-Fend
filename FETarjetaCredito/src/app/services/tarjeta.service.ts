import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TarjetaService { //de tipo privadas para que los componentes no la puedan ver
 private myAppUrl = 'https://localhost:44353/'; //URL de la app que fue creada en NET Core.
 private myApiUrl = 'api/tarjeta/'; //para acceder al controlador del Back-end, en este caso se llama Tarjeta

  constructor(private http: HttpClient) {}

  getListTarjetas(): Observable<any>{ //metodo para traer la lista de Tarjetas
    return this.http.get(this.myAppUrl + this.myApiUrl);
   }


   deleteTarjeta(id: number):Observable<any>{ //metodo para eliminar una unica tarjeta por cada tiro
     return this.http.delete(this.myAppUrl + this.myApiUrl + id);
   }

   saveTarjeta(tarjeta:any): Observable<any>{ //metodo para agregar y guardar una nueva tarjeta en el array o BD
     return this.http.post(this.myAppUrl + this.myApiUrl, tarjeta);
   }

   updateTarjeta(id:number, tarjeta: any): Observable<any>{ //Metodo para actualizar una tarjeta
     return this.http.put(this.myAppUrl + this.myApiUrl + id, tarjeta);
   }
}
 //Un observable puede ser creado a partir de eventos de usuario derivados del uso de un formulario, una llamada HTTP,
 //un almacén de datos, etc.
 //Mediante el observable nos podemos suscribir a eventos que nos permiten hacer cosas cuando cambia lo que se esté observando.
 //Observer: Es el actor que se dedica a observar.
