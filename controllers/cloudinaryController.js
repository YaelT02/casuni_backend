const cloudinary = require('../config/cloudinaryConfig');
const pool = require('../db'); // Conexión a la base de datos
const logEvent = require('../utils/logger'); //Para generar registro en bitacora

// Subir manual
const uploadManual = async (req, res) => {
  try {
    // Verificar si el usuario tiene rol admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    // Subir archivo a Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'raw', // Asegura que admite archivos PDF
      folder: 'manuals', // Carpeta específica en Cloudinary
      use_filename: true,
      unique_filename: false,
      format: 'pdf', 
    });

    // Guardar los detalles del archivo en la base de datos
    const { title, description, model_id } = req.body;
    await pool.query(
      'INSERT INTO manuals (title, description, file_url, model_id) VALUES (?, ?, ?, ?)',
      [title, description, result.secure_url, model_id]
    );

    res.status(201).json({
      message: 'Manual subido y registrado exitosamente',
      file_url: result.secure_url,
    });
  } catch (error) {
    console.error('Error al subir el manual:', error);
    res.status(500).json({ message: 'Error al subir el manual', error });
  }
};

const getManuals = async (req, res) => {
  try {
    const [manuals] = await pool.query(`
      SELECT
        m.id,
        m.title,
        m.description,
        m.file_url,
        md.name AS model_name,
        b.name AS brand
      FROM manuals m
      INNER JOIN models md ON m.model_id = md.id
      INNER JOIN brands b ON md.brand_id = b.id
      ORDER BY b.id, m.created_at DESC;
      `);
      res.status(200).json(manuals);
  } catch (error) {
    console.error('Error al obtener los manuales:', error);
    res.status(500).json({ message: 'Error al obtener los manuales', error });
  }
};

const downloadManual = async (req, res) => {
  try {
    const manualId = req.params.id;
    const userId = req.user.id;
    const username = req.user.username;

    const [rows] = await pool.query('SELECT title, file_url FROM manuals WHERE id = ?', [manualId]); 
    if (rows.length === 0){
      return res.status(404).json({ message: 'Manual no encontrado' });
    }

    const manual = rows[0];
    //Registar manual en bitacora
    await logEvent(userId, 'download', `El usuario ${username} descargó el manual: ${manual.title}`);
    res.redirect(manual.file_url);
  }catch (error){
    console.error('Error al descargar el manual:', error);
    res.status(500).json({ message: 'Error al descargar el manual', error });
  }
}

module.exports = {
  uploadManual,
  getManuals,
  downloadManual
};
