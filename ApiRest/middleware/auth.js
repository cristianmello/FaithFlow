//Importar modulos
const jwt = require("jwt-simple");
const moment = require("moment")

//Importar clave secreta
const libjwt = require("../services/jwt");
const secret = libjwt.secret;

const Member = require("../models/Member");
const Role = require("../models/Role");


//Middleware de autenticacion
const auth = (req, res, next) => {

  //Comprobar si me llega la cabecera de auth
  if (!req.headers.authorization) {
    return res.status(403).send({
      status: "error",
      message: "La peticion no tiene la cabecera de autenticacion"
    });
  }

  //Limpiar el token
  let token = req.headers.authorization.replace(/['"]+/g, '');

  //Decodificar token
  try {
    let payload = jwt.decode(token, secret);

    //Comprobar la expiracion del token
    if (payload.exp <= moment().unix()) {
      return res.status(404).send({
        status: "error",
        message: "Token expirado",
      });
    }
    //Agregar datos de miembros a request
    req.member = payload;

  } catch (error) {
    return res.status(404).send({
      status: "error",
      message: "token invalido",
      error
    });
  }

  //Pasar a ejecucion de accion
  next();
}


//Middleware de autenticacion 
const checkRole = (requiredRoles) => async (req, res, next) => {

  const token = req.headers.authorization?.replace(/['"]+/g, "");

  if (!token) {
    return res.status(403).send({
      status: "error",
      message: "La petición no tiene la cabecera de autenticación",
    });
  }

  try {
    const payload = jwt.decode(token, secret);

    //Comprobar la expiracion del token
    if (payload.exp <= moment().unix()) {
      return res.status(404).send({
        status: "error",
        message: "Token expirado",
      });
    }

    const member = await Member.findByPk(payload.member_code, {
      include: {
        model: Role,
        attributes: ["role_code", "role_name"],
      },
    });

    if (!member) {
      return res.status(404).send({
        status: "error",
        message: "Miembro no encontrado",
      });
    }

    const memberRoles = member.Roles.map((role) => role.role_name);

    const hasAccess = requiredRoles.some((role) => memberRoles.includes(role));

    if (!hasAccess) {
      return res.status(403).send({
        status: "error",
        message: "No tiene acceso a esta función",
      });
    }

    req.member = member;
    next();
  } catch (error) {
    return res.status(404).send({
      status: "error",
      message: "Token inválido",
      error,
    });
  }
};

module.exports = {
  auth,
  checkRole
}