
document.getElementById("botonConsultar").addEventListener("click", consultarEstado); 

async function consultarEstado(){
    const tag = document.getElementById("codigoTarjeta").value.trim().toLowerCase();
    const usuario = document.getElementById("codigoUsuario").value.trim().toLowerCase();
   
    const validacion = validacionUsuarios(tag, usuario);
         
    if(validacion ==1){
        const estado = await codigoBuscado(tag, usuario);
        console.log(`lee estado ${estado}`)

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
    
    const resultadoDiv = document.getElementById('resultado');

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
        const data = resp.data;

         let bloque = document.createElement("div");
            bloque.classList.add("resultado-item"); // podés estilizarlo en CSS

            if (data.DevoR === 1) {
                bloque.innerHTML = `
                    <p><b>Status:</b> ${data.Respuesta}</p>
                    <p>${data.cbu}</p>                 
                    <p>${data.Comprobante_MP ? `el numero de comprobante es:${data.Comprobante_MP}`: `` }
                    <p>${data.Comprobante_Tag ? `el  numero de comprobante es:${data.Comprobante_Tag}`: `` }
                    </p>
                `;
                bloque.classList.add("exito");

            } else if (data.DevoR === -1) {

                bloque.innerHTML = `
                   <p>Te informamos que tu trasnferencia ha sido rechazada por la entidad bancaria debido a errores en la carga de datos. Te pedimos por favor que ingreses al siguiente <a href="https://forms.gle/6vEPJeQHoaevPQtZ7"> link</a> y completes los datos solicitados asegurándote que no haya errores de tipeo, que la cuenta bancaria esté activa y que coincidan los datos de titularidad con el CUIL ingresado. La nueva trasnferencia se procesará dentro de los próximos 20 días hábiles máximo.<p>
                `;
                bloque.classList.add("error");

            } else {
                
                bloque.innerHTML = `
                    <p>Te informamos que tu devolución aún se encuentra en proceso. Será enviada para su procesamiento en los próximos días. Podés volver a consultar nuevamente por aquí en cualquier momento para recibir actualizaciones.</p>
                   
                `;
                /*bloque.innerHTML = `
                    <p>Su reembolso resultó rechazado.</p>
                    <p>Complete el siguiente link:</p>
                    <a href="https://forms.gle/6vEPJeQHoaevPQtZ7" target="_blank">
                        Formulario de contacto
                    </a>
                `;*/
                bloque.classList.add("espera");
            }

            // Agregar el bloque al div principal
            resultadoDiv.appendChild(bloque);

        /*if(resp.data.length > 1){
            alert("usted tiene mas de una devolucion solicitada, las mismas se mostraran en orden a continuacion")
        }
        
        resp.data.forEach(item => {

            let bloque = document.createElement("div");
            bloque.classList.add("resultado-item"); // podés estilizarlo en CSS

            console.log(`el devor del item es ${item.DevoR}`)

            if (item.DevoR === 1) {
                bloque.innerHTML = `
                    <p><b>Status:</b> ${item.Respuesta}</p>
                    <p>${item.cbu}</p>
                `;
                bloque.classList.add("exito");

            } else if (item.DevoR === 0) {

                bloque.innerHTML = `
                    <p><b>Respuesta:</b> ${item.Respuesta}</p>
                `;
                bloque.classList.add("espera");

            } else {

                bloque.innerHTML = `
                    <p>Su reembolso resultó rechazado.</p>
                    <p>Complete el siguiente link:</p>
                    <a href="https://forms.gle/6vEPJeQHoaevPQtZ7" target="_blank">
                        Formulario de contacto
                    </a>
                `;
                bloque.classList.add("error");
            }

            // Agregar el bloque al div principal
            resultadoDiv.appendChild(bloque);
        })*/

    } catch (error) {
        // Manejo de errores de red (servidor inalcanzable, etc.)
        console.error("Fallo grave en la comunicación con el back-end:", error);
        return -1; 
    }
};