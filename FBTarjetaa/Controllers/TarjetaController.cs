using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using FBTarjetaa;
using FBTarjetaa.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FBTarjeta.Controllers
{
    [Route("api/[controller]")] //atributo se puede aplicar a una clase de controlador para habilitar los siguientes comportamientos
    [ApiController] //obstinados y específicos de la API: Requisito de enrutamiento de atributos. Respuestas HTTP 400 automáticas.
    public class TarjetaController : ControllerBase //agrega soporte para vistas, por lo que es para manejar páginas web, no solicitudes de API web
    {
        private readonly AplicationDbContext _context; // el modificador readonly nos impide cambiar su valor
                                                        // su valor es inmutable una vez finalizada la propia declaración del campo     
        public TarjetaController(AplicationDbContext context)
        {

            _context = context; //DataContext “actúa como un proxy para la base de datos local”.
                                //Y poder manejar los datos como objetos
        }

        // GET: api/<TarjetaController>
        [HttpGet]
        public async Task<ActionResult> Get() //Mostrar listado de tarjetas que hay en la DB
        {                                   //ToListAsync devuelve una tarea
            try
            {
                var listTarjetas = await _context.TarjetaCredito.ToListAsync(); //El comando await antes de una promesa hace que espere hasta que la accion responda.
                return Ok(listTarjetas); //devuelve listadp
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message); //Bad Request indica que el servidor no puede o no procesará la petición debido a algo que es percibido como un error del cliente
            }
        }

        // POST api/<TarjetaController>
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] TarjetaCredito tarjeta)
        {
            try
            {
                _context.Add(tarjeta); //agregar una nueva tarjeta a la BD
               await _context.SaveChangesAsync(); //Espera para ejecutar la accion
                return Ok(tarjeta); //devuelve listado con la nueva tarjeta
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT api/<TarjetaController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] TarjetaCredito tarjeta)
        {
            try
            {
                if(id != tarjeta.Id) //si id es diferente al Id de la tarjeta, devuelve un NotFound
                {
                    return NotFound();
                }
                _context.Update(tarjeta); // si es correcto, actualiza la tarjeta
                await _context.SaveChangesAsync(); // espera y guarda cambios
                return Ok(new { message = "La tarjeta fue actualizada con exito!" }); //si todo salio bien, mostrar mensaje positivo
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message); //Bad Request indica que el servidor no puede o no procesará la petición debido a algo que es percibido como un error del cliente
            }
        }

        // DELETE api/<TarjetaController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var tarjeta = await _context.TarjetaCredito.FindAsync(id);

                if(tarjeta == null ) //Si tarjeta es igual a nulo, devuelve not found
                {
                    return NotFound();
                }
                _context.TarjetaCredito.Remove(tarjeta); //remover tarjeta de la BD
                await _context.SaveChangesAsync(); //Espera y guarda cambios
                return Ok(new { message = "La tarjeta fue eliminada con exito!" }); //si todo salio bien mostrar mensaje al usuario
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
