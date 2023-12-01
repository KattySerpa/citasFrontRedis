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

  departamentos:any=[]
  codigo_departamento:string='';
  codigo_provincia:string='';
  provincias:any=[]
  distritos:any=[]

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

  constructor(private citaService: ServiceService) {

    this.citaService.get_departamentos().subscribe(
      data => {
        this.departamentos = data;
        console.log("data ==> ",data);
      },
      error => {
        console.error('Error en proceso cita', error);
      }
    );
  }

   ngOnInit(){
    this.consultarHorarios();
   }    

   consultarHorarios(){
    this.citaService.getEstadoHorarios().subscribe(
      data => {
        this.horario = data;
        console.log("data ==> ",data);
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
        console.log("data ==> ",data);
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
      },
      (error) => {
        console.error('Error:', error);
      }
    );
    console.log(this.cita);
  }

  onDepartamentoChange(event: any): void {
    const departamentoSeleccionado = event.target.value;
    const departamento_busqueda = this.departamentos.find(
      (      dep: { valor: any; }) => dep.valor === departamentoSeleccionado
    );

    this.codigo_departamento= departamento_busqueda.llave.split("_")[1]
    
    this.citaService.get_provincias(this.codigo_departamento).subscribe(
      data => {
        this.provincias = data;
      },
      error => {
        console.error('Error en proceso cita', error);
      }
    );
  }

  onProvinciaChange(event: any): void {
    const provinciaSeleccionado = event.target.value;
    console.log("provinciaSeleccionado===> ",provinciaSeleccionado)
    console.log("this.provincias===> ",this.provincias)
    const provincia_busqueda = this.provincias.find(
      (      prov: { valor: any; }) => prov.valor === provinciaSeleccionado
    );

    this.codigo_provincia= provincia_busqueda.llave.split("_")[1]
    
    this.citaService.get_distritos(this.codigo_provincia).subscribe(
      data => {
        this.distritos = data;
      },
      error => {
        console.error('Error en proceso cita', error);
      }
    );
  }

   
}
