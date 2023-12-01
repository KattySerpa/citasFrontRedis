import { Component } from '@angular/core';
import { ServiceService } from './services/service.service';
import { cita_interface } from './interface/cita.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'redis_citas';
  horario:any;
  tramites = [
    {opcion:'Inscripción del Ruc'}, 
    {opcion: 'Presentar declaraciones'}, 
    {opcion: 'Consultas sobre pagos'},
    {opcion: 'Pagos de detracciones'},
    {opcion: 'Consultas tributarias'}
  ];
  opcionSeleccionada: string = ''; 
  mensaje:any;
  //hora:any;

  cita: cita_interface={
    nombre: '',
    apellido_paterno:'',
    apellido_materno:'',
    departamento:'',
    provincia:'',
    distrito:'',
    tramite:''
  };

  hora_seleccionada:string = '';

  constructor(private citaService: ServiceService) {}

   ngOnInit(){
    this.consultarHorarios();
   }    

   consultarHorarios(){
    this.citaService.getEstadoHorarios().subscribe(
      data => {
        this.horario = data;
        console.log("data ==> ",data); // Puedes hacer lo que quieras con los datos aquí
      },
      error => {
        console.error('Error al obtener el horario', error);
      }
    );
   }

   onRadioChange(event: any) {
    console.log("Opción seleccionada:", this.opcionSeleccionada);
    this.consultarHorarios();
  }

  proceso_cita(hora:any){
    console.log("hora ==>",hora);
    this.hora_seleccionada=hora;
    this.citaService.proceso_cita(hora).subscribe(
      data => {
        this.mensaje = data;
        console.log("data ==> ",data); // Puedes hacer lo que quieras con los datos aquí
        //this.consultarHorarios();
      },
      error => {
        console.error('Error en proceso cita', error);
      }
    );
    this.consultarHorarios();
  }

  registrar_cita(){
    console.log("Ingresando a registrar_cita(): ",this.hora_seleccionada);
    this.citaService.agregar_cita(this.hora_seleccionada, this.cita).subscribe(
      (response) => {
       console.log('Success:', response);
       // Handle success as needed
      },
      (error) => {
        console.error('Error:', error);
        // Handle error as needed
      }
    );
    console.log(this.cita);
  }

   
}
