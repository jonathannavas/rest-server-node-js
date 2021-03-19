const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async ( req, res = 'response') => {

    const { correo, password } = req.body;

    try {

        //verificar si el correo existe
        const usuario = await Usuario.findOne({ correo });
        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario o contraseña incorrecto: email'
            });
        }
        //verificar si el usuario esta activo en la bd
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario o contraseña incorrecto: estado - false'
            });
        }
        //verificar la contraseña
        const passwordValido = bcryptjs.compareSync( password, usuario.password );
        if(!passwordValido){
            return res.status(400).json({
                msg: 'Usuario o contraseña incorrecto: password'
            });
        }
        //generar el JWT

        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        });

    } catch (error) {

        console.log(error);
        return res.status(500).json({
            msg: 'Error, Hable con el administrador'
        });

    }

}

module.exports = {
    login
}