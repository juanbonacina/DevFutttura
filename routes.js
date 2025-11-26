import { Router } from "express";
import codigosDisponibles from "./DB/IDs.js";

const router = Router();
const ids = codigosDisponibles;

router.get("/", (req, res)=>{
    res.sendFile("index.html", { root: "public" });
})

router.post("/busquedaCodigo", buscarCodigoEnArray);

function buscarCodigoEnArray(req, res) {
    
    let codigoValido;
    const { tag, usuario } = req.body;
    console.log(`el tag es ${tag}  el usuario es${usuario}`)
    let resultado = 0;

    const tagNorm = req.body.tag.toLowerCase();

    if(!tag){
        const codigoEncontrado = ids.find(item => item.userId == usuario);
        codigoValido=codigoEncontrado;
        console.log(`el codigo encontrado fue el usuario ${codigoValido}`)
    }else{
        const codigoEncontrado = ids.find(item => item.tagId == tagNorm);
        codigoValido = codigoEncontrado;
        console.log(`el codigo encontrado fue el tag ${codigoValido}`)

    }

    
    
    console.log(`el codigo encontrado es ${codigoValido}`)

    if (codigoValido) {
        if (codigoValido.Estado_devolucion === 'OK'){
             resultado = 1;
        }
        else if (codigoValido.Estado_devolucion === 'NO OK') {
            resultado = -1;
        }
    }

    return res.status(200).json({ numero: resultado });
}

export default router;