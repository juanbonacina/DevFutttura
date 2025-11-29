import { Console } from "console";
import { Router } from "express";
import fs from 'fs';

const router = Router();
const ids = JSON.parse(fs.readFileSync('./datosExcel.json', 'utf8'));//codigosDisponibles;

router.get("/", (req, res)=>{
    res.sendFile("index.html", { root: "public" });
})

router.get('/carga', (req, res)=>{
    res.sendFile("carga.html", {root: "public"});
})

router.post("/busquedaCodigo", buscarCodigoEnArray);

function buscarCodigoEnArray(req, res) {
    let codigoValido;
    const { tag, usuario } = req.body;
    let resultado = 0;

    console.log("TAG recibido:", req.body.tag);
    console.log("USUARIO recibido:", req.body.usuario);

    const tagNorm = req.body.tag.toLowerCase();

    console.log(`el tag norm es ${tagNorm}`)

    let codigoEncontrado;

    if(!tag){
        codigoEncontrado = ids.find(item => item.User_ID == usuario);
        console.log(`el codigo encontrado fue el usuario ${codigoValido}`)
        console.log("Resultado encontrado:", codigoValido);
    }else{
        codigoEncontrado = ids.find(item => item.Tag_ID == tagNorm);
        console.log(`el codigo encontrado fue el tag ${codigoValido}`)
        console.log("Resultado encontrado:", codigoValido);

    }

    if (!codigoEncontrado) {
        codigoValido = {
            DevoR: -1
        };
        console.log("No se encontró el código. Devolviendo DevoR: -1");
    } else {
        codigoValido = codigoEncontrado;
    }

    return res.status(200).json({ 
        data: codigoValido 
    });
}



router.post('/api/procesarExcel', (req, res) => {
    const datos = req.body.datos;

    if (!datos || !Array.isArray(datos)) {
        return res.status(400).json({ ok: false, error: "Datos inválidos" });
    }

    try {
        // Guardar archivo JSON
        fs.writeFileSync('./datosExcel.json', JSON.stringify(datos, null, 2));

        console.log(`📄 Archivo creado: datosExcel.json (${datos.length} registros)`);

        return res.json({ 
            ok: true, 
            mensaje: "Datos guardados correctamente",
            registros: datos.length,
            archivo: "datosExcel.json"
        });

    } catch (error) {
        console.error("❌ Error guardando JSON:", error);
        return res.status(500).json({ ok: false, error: "Error guardando archivo JSON" });
    }
});

export default router;