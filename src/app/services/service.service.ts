import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { cita_interface } from '../interface/cita.interface';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': 'http://localhost:4200' // Ajusta el origen según tus necesidades
    })
  };



  constructor( private http:HttpClient ) { 

  }



  public getEstadoHorarios(){
    return this.http.get('http://localhost:5000/listar_horario');
  }

  public proceso_cita(hora:string){
    const api= "http://localhost:5000/proceso_cita/"+hora;
    return this.http.get(api);
  }

  public agregar_cita(hora:string, cita:cita_interface){//debugger;
    console.log("Ingresando a servicio agregar_cita: ", hora, cita);
    const url = `http://localhost:5000/agregar_cita/${hora}`;
    console.log("url agregar_cita: ", url);
    return this.http.post(url, cita);  
  }
}
