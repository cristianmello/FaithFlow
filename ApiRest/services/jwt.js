const jwt = require("jwt-simple");
const moment = require("moment")

//Clave secreta
const secret = "CLAVE_SECRETA_TEMPLE_CALVARY_RIVERA_REYLES_1123"

//Funcion para generar tokens
const createToken = (member) => {
    const payload = {
        member_code: member.member_code,
        member_name: member.member_name,
        member_lastname: member.member_lastname,
        member_password: member.member_password,
        member_mail: member.member_mail,
        member_birth: member.member_birth,
        member_image: member.member_image,
        church_code: member.church_code,
        iat: moment().unix(),
        exp: moment().add(30, "days").unix
    };

    //Devolver jwt token codificado
    return jwt.encode(payload, secret);
}

module.exports = {
    secret,
    createToken
}
