import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TarjetaService } from 'src/app/services/tarjeta.service';

@Component({
  selector: 'app-tarjeta-credito',
  templateUrl: './tarjeta-credito.component.html',
  styleUrls: ['./tarjeta-credito.component.css']
})
export class TarjetaCreditoComponent implements OnInit {

  listarTarjeta : any[] = []; //array para guardar las tarjetas
  accion= 'Agregar'; //variable a utilizar para que cambie el titulo dependiendo de la accion

  form: FormGroup; //variable a utilizar para el formulario
  id: number | undefined;

  constructor(private fb: FormBuilder, private toastr: ToastrService, private _tarjetaService: TarjetaService) {
    this.form = this.fb.group({ //validaciones que tendran los campos del formulario de tarjeta
      titular:['', Validators.required],
      numeroTarjeta:['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
      fechaExpiracion:['',[Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
      cvv:['',[Validators.required, Validators.minLength(3), Validators.maxLength(3)]]
    })
   }

  ngOnInit(): void {
    this.obtenerTarjetas();
  }

  obtenerTarjetas(){
    this._tarjetaService.getListTarjetas().subscribe(data =>{ //Subscribe() es un método en Angular que conecta el observer con eventos observable . Siempre que se realiza algún cambio en estos observables, se ejecuta un código y observa los resultados o cambios mediante el método subscribe.
      console.log(data);    //traer los datos desde la API, para eso sirve el data
      this.listarTarjeta = data ; //traer los datos desde la BD y la API
    }, error => {
      console.log(error); //si hubo algun error, muestra mensaje de que algo sucedio
    });

  }

  guardarTarjeta(){
          const tarjeta: any = { //los datos ingresados en el formulario, guardarlos en su variable
            titular:this.form.get('titular')?.value,
            numeroTarjeta:this.form.get('numeroTarjeta')?.value,
            fechaExpiracion:this.form.get('fechaExpiracion')?.value,
            cvv:this.form.get('cvv')?.value,
          }

          if(this.id == undefined){
            //Agregamos una tarjeta
            this._tarjetaService.saveTarjeta(tarjeta).subscribe(data => { //Subscribe() es un método en Angular que conecta el observer con eventos observable . Siempre que se realiza algún cambio en estos observables, se ejecuta un código y observa los resultados o cambios mediante el método subscribe.
              this.toastr.success('La tarjeta fue registrada con éxito!', 'Tarjeta Registrada!'); //mostrar notificaciones de estado al usuario.
              this.obtenerTarjetas(); //llama al listado de las tarjetas luego de agregar
              this.form.reset(); //resetear formulario al agregar la tarjeta
            },error => {
              this.toastr.error('Opss.. Ocurrio un problema al ejecutar!', 'Error!'); //mostrar notificaciones de estado al usuario.
              console.log(error);
            });
          }else{
            //Editamos una tarjeta
            tarjeta.id = this.id;

            this._tarjetaService.updateTarjeta(this.id,tarjeta).subscribe(data =>{ //Subscribe() es un método en Angular que conecta el observer con eventos observable . Siempre que se realiza algún cambio en estos observables, se ejecuta un código y observa los resultados o cambios mediante el método subscribe.
              this.form.reset(); //resetear formulario al actualizar la tarjeta
              this.accion = 'Agregar'; //accion que va utilizar el titulo para cambiar de estado
              this.id=undefined;
              this.toastr.info('La tarjeta fue actualizada con exito', 'Tarjeta Actualizada');//mostrar notificaciones de estado al usuario.
              this.obtenerTarjetas(); //llama al listado de las tarjetas luego de actualizar
            }, error => {
              console.log(error); //si hubo algun error, muestra mensaje de que algo sucedio
            })
          }
  }

  eliminarTarjeta(id: number){
    this._tarjetaService.deleteTarjeta(id).subscribe(data => { //eliminar una tarjeta en especifico //Subscribe() es un método en Angular que conecta el observer con eventos observable . Siempre que se realiza algún cambio en estos observables, se ejecuta un código y observa los resultados o cambios mediante el método subscribe.
      this.toastr.error('La tarjeta fue eliminada correctamente!', 'Eliminada!'); //mostrar notificaciones de estado al usuario.
      this.obtenerTarjetas(); //llama al listado de las tarjetas luego de eliminar
    }, error => {
      console.log(error); //si hubo algun error, muestra mensaje de que algo sucedio
    });
  }


  editarTarjeta(tarjeta: any){
    this.accion = 'Editar'; //accion que va utilizar el titulo para cambiar de estado
    this.id = tarjeta.id;

    this.form.patchValue({
      titular: tarjeta.titular, //modificar y guardar los cambios que se realicen en lo ingresado en cada variable
      numeroTarjeta: tarjeta.numeroTarjeta,
      fechaExpiracion: tarjeta.fechaExpiracion,
      cvv: tarjeta.cvv
    })

  }


}
