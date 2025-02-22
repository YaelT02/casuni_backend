const pool = require('../db'); // Conexión a la base de datos
const bcrypt = require('bcryptjs'); // Para encriptar y comparar contraseñas
const jwt = require('jsonwebtoken'); // Para generar y validar tokens
const logEvent = require('../utils/logger'); //Para generar registro en bitacora

// Registro de usuario
const register = async (req, res) => {
  const { username, password, nombre, area, role } = req.body;

  try {
    // Verificar si el usuario ya existe
    const [existingUser] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el nuevo usuario
    await pool.query(
      'INSERT INTO users (username, password, name, area, role) VALUES (?, ?, ?, ?, ?)',
      [username, hashedPassword, nombre, area, role || 'user'] 
    );

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ message: 'Error del servidor', error });
  }
};

// Login de usuario
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Verificar si el usuario existe
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const user = rows[0];

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Generar token JWT con información del usuario
    const token = jwt.sign(
      { 
        id: user.id,
        role: user.role,
        username: user.username,
        nombre: user.name,
        area: user.area,
      },
      process.env.JWT_SECRET
    );

    const firstLogin = user.first_login === 1;

    await logEvent(user.id,'login', `Usuario ${user.username} inicio sesión`);

    res.status(200).json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        username: user.username,
        nombre: user.name,
        area: user.area,
        role: user.role,
        firstLogin,
      },
    });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ message: 'Error del servidor', error });
  }
};

const changePassword = async (req, res) => {
  const { userId, newPassword } = req.body;

  try {
    // Encriptar la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña y establecer first_login en false
    await pool.query(
      'UPDATE users SET password = ?, first_login = false WHERE id = ?',
      [hashedPassword, userId]
    );

    res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    res.status(500).json({ message: 'Error del servidor', error });
  }
};

const logout = async (req, res) => {
  try {
    await logEvent(req.user.id, 'logout', `Usuario ${user.username} cerró sesión `);
    res.status(200).json({message: 'Logout registrado exitosamente'});
  } catch {
    console.error('Error en el logout: ', error);
    res.status(500).json({ message: 'Error en logout', error });
  }
}

// Ruta protegida (opcional)
const protectedRoute = (req, res) => {
  res.status(200).json({
    message: 'Acceso concedido',
    user: {
      id: user.id,
      username: user.username,
      nombre: user.nombre,
      area: user.area,
      role: user.role,
    }, // Información del usuario obtenida del token JWT
  });
};

module.exports = {
  register,
  login,
  changePassword,
  logout,
  protectedRoute,
};
