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
  lista_citas:any;
  tramites = [
    {opcion:'Inscripción del Ruc'}, 
    {opcion: 'Presentar declaraciones'}, 
    {opcion: 'Consultas sobre pagos'},
    {opcion: 'Pagos de detracciones'},
    {opcion: 'Consultas tributarias'}
  ];
  opcionSeleccionada: string = ''; 
  mensaje:any;
  mensajitus:string='';
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
    this.consultarCitas();
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

   consultarCitas(){
    this.citaService.getCitas().subscribe(
      data => {
        this.lista_citas = data;
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

  cuenta_regresiva: number = 11; // Inicia el cuenta_regresiva en 10 segundos
  private cuenta_regresivaTimeout: any;

  estado_registrado:boolean=false;
  iniciar_cuenta_regresiva(): void {
    this.cuenta_regresivaTimeout = setTimeout(() => {
      this.cuenta_regresiva--;
      console.log("this.cuenta_regresiva=> ",this.cuenta_regresiva)
      if (this.cuenta_regresiva > 0 && this.estado_registrado==false) {
        // Si el cuenta_regresiva no ha llegado a cero, inicia el próximo setTimeout
        this.iniciar_cuenta_regresiva();
      } else if(this.estado_registrado==false){
        this.consultarHorarios()
        this.mensajitus='Hora desbloqueada, por favor elija otra hora nuevamente';
      }
    }, 1000); // Cada segundo (1000 milisegundos)
  }


  proceso_cita(hora:any){
    this.estado_registrado=false;
    console.log("hora ==>",hora);
    this.hora_seleccionada=hora;
    this.citaService.proceso_cita(hora).subscribe(
      data => {
        this.mensaje = data;
        console.log("data ==> ",data);

        this.consultarHorarios();
        this.cuenta_regresiva=11;
        this.iniciar_cuenta_regresiva()
        this.mensajitus='Hora '+hora+' bloqueada por: ';
      },
      error => {
        console.error('Error en proceso cita', error);
      }
    );

  }

  registrar_cita(){
    this.estado_registrado=true;
    console.log("Ingresando a registrar_cita(): ",this.hora_seleccionada);
    console.log("this.cita =>",this.cita);
    this.citaService.agregar_cita(this.hora_seleccionada, this.cita).subscribe(
      (response) => {
       console.log('Success:', response);
       this.cuenta_regresiva=0;
       this.consultarCitas();
       this.consultarHorarios();
       clearTimeout(this.cuenta_regresivaTimeout);
       this.mensajitus='Cita agregada con étsito';
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
