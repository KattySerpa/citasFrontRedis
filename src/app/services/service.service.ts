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

  public get_departamentos(){
    const api= "http://localhost:5000/departamentos";
    return this.http.get(api);
  }
  
  public get_provincias(codigo_departamento:any){
    const api= "http://localhost:5000/provincias/"+codigo_departamento;
    return this.http.get(api);
  }

  public get_distritos(codigo_provincia:any){
    const api= "http://localhost:5000/distritos/"+codigo_provincia;
    return this.http.get(api);
  }


  public getEstadoHorarios(){
    return this.http.get('http://localhost:5000/listar_horario');
  }

  public getCitas(){
    return this.http.get('http://localhost:5000/listar_citas');
  }

  public proceso_cita(hora:string){
    const api= "http://localhost:5000/proceso_cita/"+hora;
    return this.http.get(api);
  }

  public agregar_cita(hora:string, cita:cita_interface){//debugger;
    const url = `http://localhost:5000/agregar_cita/${hora}`;
    return this.http.post(url, cita);  
  }
}
