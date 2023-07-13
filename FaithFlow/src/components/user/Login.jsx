import React from 'react'
import { useForm } from '../../hooks/useForm'
import { Global } from '../../helpers/Global';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth';

export const Login = () => {
  const { form, changed } = useForm({});
  const [saved, setSaved] = useState("not_sended");

  const { setAuth } = useAuth();

  const loginMember = async (e) => {
    e.preventDefault();

    // Datos del formulario
    let memberToLogin = form;

    // Peticion al backend
    const request = await fetch(Global.url + "member/login", {
      method: "POST",
      body: JSON.stringify(memberToLogin),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await request.json();

    if (data.status === "Success") {
      // Persistir los datos en el navegador
      localStorage.setItem("token", data.token);
      localStorage.setItem("member", JSON.stringify(data.member));

      setSaved("login");

      // Set datos en el auth
      setAuth(data);

      // Redireccionar
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      setSaved("error");
    }
  }

  const handleForgotPassword = () => {
    // Redirigir a la página de recuperación de contraseña
    window.location.href = "/forgot-password";
  }

  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">Identifícate</h1>
      </header>

      <div className="content__posts">
        <div className="card">
          {saved === 'login' && (
            <strong className="alert alert-success">
              Miembro identificado correctamente !!
            </strong>
          )}
          {saved === 'error' && (
            <strong className="alert alert-danger">
              Combinación de datos errónea !!
            </strong>
          )}
          <form className="form-login" onSubmit={loginMember}>
            <div className="form-group">
              <label htmlFor="member_mail">Correo electrónico</label>
              <input type="email" name="member_mail" onChange={changed} />
            </div>

            <div className="form-group">
              <label htmlFor="member_password">Contraseña</label>
              <input type="password" name="member_password" onChange={changed} />
            </div>

            <div className="form-group">
              <button type="button" className="btn btn-link" onClick={handleForgotPassword}>
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <input
              type="submit"
              value="Identifícate"
              className="btn btn-success"
            />
          </form>
        </div>
      </div>
    </>
  )
}
