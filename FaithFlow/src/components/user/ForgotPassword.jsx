import React from 'react';
import { useForm } from '../../hooks/useForm';
import { Global } from '../../helpers/Global';
import { useState } from 'react';

export const ForgotPassword = () => {
  const { form, changed } = useForm({});
  const [resetPasswordStatus, setResetPasswordStatus] = useState("not_requested");

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Datos del formulario
    let email = form.email;

    // Peticion al backend para resetear la contraseña
    const request = await fetch(Global.url + "member/reset-password", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await request.json();

    if (data.status === "Success") {
      setResetPasswordStatus("requested");
    } else {
      setResetPasswordStatus("error");
    }
  }

  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">Recuperar Contraseña</h1>
      </header>

      <div className="content__posts">
        <div className="card">
          {resetPasswordStatus === 'requested' && (
            <strong className="alert alert-success">
              Se ha enviado un correo electrónico con instrucciones para restablecer tu contraseña.
            </strong>
          )}
          {resetPasswordStatus === 'error' && (
            <strong className="alert alert-danger">
              No se pudo procesar la solicitud. Por favor, inténtalo de nuevo más tarde.
            </strong>
          )}
          {resetPasswordStatus === 'not_requested' && (
            <form className="form-login" onSubmit={handleResetPassword}>
              <div className="form-group">
                <label htmlFor="email">Correo electrónico</label>
                <input type="email" name="email" onChange={changed} />
              </div>

              <input
                type="submit"
                value="Enviar Instrucciones"
                className="btn btn-primary"
              />
            </form>
          )}
        </div>
      </div>
    </>
  );
};