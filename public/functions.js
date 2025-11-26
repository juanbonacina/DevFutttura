
document.getElementById("botonConsultar").addEventListener("click", consultarEstado); 

async function consultarEstado(){
    const tag = document.getElementById("codigoTarjeta").value.trim().toLowerCase();
    const usuario = document.getElementById("codigoUsuario").value.trim().toLowerCase();
   
    const validacion = validacionUsuarios(tag, usuario);
         
    if(validacion ==1){
        const estado = await codigoBuscado(tag, usuario);
        console.log(`lee estado ${estado}`)

        estadoCodigo(estado);
    }
    


};

function validacionUsuarios(tag, usuario){
    
    const resultadoDiv = document.getElementById('resultado');
    let valorValidacion;
    resultadoDiv.innerHTML='';

    if (tag === '' && usuario === '') {

        resultadoDiv.innerHTML = '⚠️ Por favor, ingrese el código de su tarjeta o usuario';
        resultadoDiv.classList.add('error');
        valorValidacion =-1;

    }else if((tag.length > 14 || tag.length < 14) &&  (usuario.length < 36 || usuario.length > 36)){
        resultadoDiv.innerHTML = '⚠️ El codigo invalido';
        resultadoDiv.classList.add('error');
        valorValidacion =-1;

    }else{
        resultadoDiv.classList.remove('error');
        valorValidacion=1;
    }

    return valorValidacion;

};

async function codigoBuscado (tag, usuario){
    try {
        console.log(`recibi los datos ${tag} ${usuario}`)
        // 1. Envío de la solicitud
        const response = await fetch("/busquedaCodigo", {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            // Envía los datos correctamente
            body: JSON.stringify({ tag, usuario }) 
        });
       
        const resp = await response.json();

        console.log(`la respuesta del back fue ${resp}`)
        
        // 3. Devolver el número recibido
        // Se valida que la propiedad 'numero' exista y sea uno de los valores esperados.

        if (typeof resp.numero === 'number' && [-1, 0, 1].includes(resp.numero)) {
            // 🎉 Este es el valor que se devuelve a la función que llama.
            console.log("respuesta correcta", resp.numero)
            return resp.numero;
        } else {
            // Si el JSON no tiene el formato esperado
            console.error("Respuesta del servidor con formato inesperado:", resp);
            return -1; 
        }

    } catch (error) {
        // Manejo de errores de red (servidor inalcanzable, etc.)
        console.error("Fallo grave en la comunicación con el back-end:", error);
        return -1; 
    }
};


function estadoCodigo(codigo){

    const estado = codigo;

    const resultadoDiv = document.getElementById('resultado');

    


    if(estado === 1){
    
        resultadoDiv.innerHTML='Su reembolso fue reralizado';
        resultadoDiv.classList.remove('error');
        resultadoDiv.classList.remove('espera');
        resultadoDiv.classList.add('exito');
        

    }else if(estado ===0){

        resultadoDiv.innerHTML='Su reembolso fue procesado, recuerde que el mismo puede demorar 20 dias habiles. Lamentamos la demora';
        
        resultadoDiv.classList.remove('error');
        resultadoDiv.classList.remove('exito');
        resultadoDiv.classList.add('espera');

    }else{
        resultadoDiv.innerHTML=`Su reembolso resulto rechazado, porfavor contactece con soportecashless@gmail.com`;
        resultadoDiv.classList.remove('espera');
        resultadoDiv.classList.remove('exito');
        resultadoDiv.classList.add('error');
    }
};