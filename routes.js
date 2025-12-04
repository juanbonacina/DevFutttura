import { Console } from "console";
import { Router } from "express";
import fs from 'fs';
import multer from "multer";
import XLSX from "xlsx";

const upload = multer({
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

const router = Router();
const ids = JSON.parse(fs.readFileSync('./datosExcel.json', 'utf8'));//codigosDisponibles;

router.get("/", (req, res)=>{
    res.sendFile("index.html", { root: "public" });
})

/*router.get('/carga', (req, res)=>{
    res.sendFile("carga.html", {root: "public"});
})*/

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
            DevoR: 2
        };
        console.log("No se encontró el código. Devolviendo DevoR: -1");
    } else {
        codigoValido = codigoEncontrado;
    }

    return res.status(200).json({ 
        data: codigoValido 
    });
}



router.post('/api/procesarExcel', upload.single('archivo'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ ok: false, error: "No se envió ningún archivo" });
    }

    try {
        // Leer el Excel desde el buffer
        const workbook = XLSX.read(req.file.buffer);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convertir hoja a JSON (igual que antes)
        const datos = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        // Guardar archivo JSON
        fs.writeFileSync('./datosExcel.json', JSON.stringify(datos, null, 2));

        console.log(`📄 Archivo creado: datosExcel.json (${datos.length} registros)`);

        return res.json({
            ok: true,
            mensaje: "Datos procesados y guardados correctamente",
            registros: datos.length,
            archivo: "datosExcel.json"
        });

    } catch (error) {
        console.error("❌ Error procesando el archivo Excel:", error);
        return res.status(500).json({ ok: false, error: "Error procesando el Excel" });
    }
});


export default router;