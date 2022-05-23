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

  listarTarjeta : any[] = [];
  accion= 'Agregar';

  form: FormGroup;
  id: number | undefined;

  constructor(private fb: FormBuilder, private toastr: ToastrService, private _tarjetaService: TarjetaService) {
    this.form = this.fb.group({
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
    this._tarjetaService.getListTarjetas().subscribe(data =>{
      console.log(data);
      this.listarTarjeta = data ;
    }, error => {
      console.log(error);
    });

  }

  guardarTarjeta(){
    const tarjeta: any = {
      titular:this.form.get('titular')?.value,
      numeroTarjeta:this.form.get('numeroTarjeta')?.value,
      fechaExpiracion:this.form.get('fechaExpiracion')?.value,
      cvv:this.form.get('cvv')?.value,
    }

    if(this.id == undefined){
      //Agregamos una tarjeta
      this._tarjetaService.saveTarjeta(tarjeta).subscribe(data => {
        this.toastr.success('La tarjeta fue registrada con éxito!', 'Tarjeta Registrada!');
        this.obtenerTarjetas();
        this.form.reset();
      },error => {
        this.toastr.error('Opss.. Ocurrio un problema al ejecutar!', 'Error!');
        console.log(error);
      });
    }else{
      //Editamos una tarjeta
      tarjeta.id = this.id;

      this._tarjetaService.updateTarjeta(this.id,tarjeta).subscribe(data =>{
        this.form.reset();
        this.accion = 'Agregar';
        this.id=undefined;
        this.toastr.info('La tarjeta fue actualizada con exito', 'Tarjeta Actualizada');
        this.obtenerTarjetas();
      }, error => {
        console.log(error);
      })
    }




  }

  eliminarTarjeta(id: number){
    this._tarjetaService.deleteTarjeta(id).subscribe(data => {
      this.toastr.error('La tarjeta fue eliminada correctamente!', 'Eliminada!');
      this.obtenerTarjetas();
    }, error => {
      console.log(error);
    });
  }


  editarTarjeta(tarjeta: any){
    this.accion = 'Editar';
    this.id = tarjeta.id;

    this.form.patchValue({
      titular: tarjeta.titular,
      numeroTarjeta: tarjeta.numeroTarjeta,
      fechaExpiracion: tarjeta.fechaExpiracion,
      cvv: tarjeta.cvv
    })

  }


}
