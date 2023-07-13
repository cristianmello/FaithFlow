import React, { useEffect } from 'react'
import useAuth from '../../hooks/useAuth'
import useRoles from '../../hooks/useRoles'
import { useNavigate } from 'react-router-dom';


export const Logout = () => {

    const { setAuth } = useAuth();
    const { setRoles } = useRoles();
    const navigate = useNavigate();

    useEffect(() => {
        //Vaciar el localStorage
        localStorage.clear();

        //Setear estados globales a vacio
        setAuth({});
        setRoles({});

        // Navigate (redireccion) al login
        navigate("/login");
    });

    return (
        <h1>Cerrando sesion...</h1>
    )
}
