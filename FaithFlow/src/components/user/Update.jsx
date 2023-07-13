import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import avatar from '../../assets/img/user.png';
import { Global } from '../../helpers/Global';
import { SerializeForm } from '../../helpers/SerializeForm';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import useRoles from '../../hooks/useRoles';

export const Update = () => {
  const { auth, setAuth } = useAuth();
  const { roles } = useRoles();
  const token = localStorage.getItem("token");
  const [saved, setSaved] = useState("not_state");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [churchIncome, setChurchIncome] = useState("");

  useEffect(() => {

    const fetchChurch = async () => {
      try {
        const response = await fetch(Global.url + 'church', {
          method: 'GET',
          headers: {
            Authorization: token,
          },
        });
        const churchData = await response.json();
        setChurchIncome(churchData.church_income);
      } catch (error) {
        console.error('Error fetching church:', error);
      }
    };

    fetchChurch();

    const fetchAvatar = async () => {
      try {
        const response = await fetch(Global.url + 'member/avatar/' + auth.member_image, {
          headers: {
            Authorization: token,
          },
        });
        if (response.ok) {
          const avatarBlob = await response.blob();
          const avatarUrl = URL.createObjectURL(avatarBlob);
          setAvatarUrl(avatarUrl);
        }
      } catch (error) {
        console.error('Error fetching avatar:', error);
      }
    };

    if (auth.member_image !== 'default.png') {
      fetchAvatar();
    }
  }, [auth.member_image, token]);

  const updateMember = async (e) => {
    e.preventDefault();

    let newDataMember = SerializeForm(e.target);

    if (newDataMember.member_password !== confirmPassword) {
      setErrors({ ...errors, password: 'Las contraseñas no coinciden.' });
      return;
    }

    const updateRequest = await fetch(Global.url + "member/update", {
      method: "PUT",
      body: JSON.stringify(newDataMember),
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    });

    const updateData = await updateRequest.json();

    if (updateData.status === "success" && updateData.member) {
      delete updateData.member.member_password;
      setAuth(updateData.member);
      setSaved("saved");
      navigate('/social/inicio');
      window.location.reload();
    } else {
      setSaved("error");
      setErrors(updateData.errors || {});
      window.scrollTo(0, 0);
    }

    const fileInput = document.querySelector("#imageCode");

    if (fileInput.files[0]) {
      const formData = new FormData();
      formData.append("image", fileInput.files[0]);

      const response = await fetch(Global.url + "member/upload", {
        method: "POST",
        body: formData,
        headers: {
          "Authorization": token
        }
      });

      const responseData = await response.json();

      if (responseData.status !== "success") {
        console.error("Error uploading image:", responseData.message);
      }
    } else {
      setSaved("error");
      setErrors(updateData.errors || {});
      window.scrollTo(0, 0);
    }
  };

  const updateChurchIncome = async () => {
    const updateRequest = await fetch(Global.url + "church/income", {
      method: "PATCH",
      body: JSON.stringify({ church_income: churchIncome }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    });

    const updateData = await updateRequest.json();

    if (updateData.status !== "success") {
      console.error("Error updating church income:", updateData.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateMember(e);
    await updateChurchIncome();
  };

  const allowedRoles = ['Pastor', 'Administrador', 'Tesorero'];
  const hasAllowedRole = roles && Array.isArray(roles) && roles.some(role => allowedRoles.includes(role.role_name));

  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">Actualizar Perfil</h1>
      </header>

      {saved === "saved" && (
        <strong className="alert alert-success">
          Miembro actualizado correctamente !!
        </strong>
      )}
      {saved === "error" && (
        <strong className="alert alert-danger">
          Hubo un error al actualizar los datos !!
        </strong>
      )}

      <form className="config-form" onSubmit={handleSubmit}>
        {hasAllowedRole && (
          <div className="form-group">
            <label htmlFor="churchIncome">Ingreso de la iglesia</label>
            <input
              type="number"
              className={`form-control ${errors.church_income ? 'is-invalid' : ''}`}
              id="churchIncome"
              name="church_income"
              value={churchIncome}
              onChange={(e) => setChurchIncome(e.target.value)}
            />
            {errors.church_income && (
              <div className="invalid-feedback">{errors.church_income}</div>
            )}
          </div>
        )}
        <div className="form-group">
          <label htmlFor="member_name">Nombre</label>
          <input type="text" name="member_name" defaultValue={auth.member_name} />
        </div>
        <div className="form-group">
          <label htmlFor="member_lastname">Apellido</label>
          <input type="text" name="member_lastname" defaultValue={auth.member_lastname} />
        </div>
        <div className="form-group">
          <label htmlFor="member_telephone">Telefono</label>
          <input type="text" name="member_telephone" defaultValue={auth.member_telephone} />
        </div>
        <div className="form-group">
          <label htmlFor="member_birth">Fecha de Nacimiento</label>
          <input type="date" name="member_birth" defaultValue={auth.member_birth} />
        </div>
        <div className="form-group">
          <label htmlFor="member_mail">Correo electrónico</label>
          <input type="text" name="member_mail" defaultValue={auth.member_mail} />
        </div>
        <div className="form-group">
          <label htmlFor="member_password">Contraseña</label>
          <input
            type="password"
            name="member_password"
            minLength={8}
            maxLength={16}
            pattern="^(?=.*\d)(?=.*[A-Z]).{8,16}$"
            onChange={e => setPassword(e.target.value)}
          />
          {errors.password && <p className="error">{errors.password}</p>}
          <small>
            La contraseña debe tener entre 8 y 16 caracteres, al menos una letra mayúscula y al menos un número.
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="confirm_password">Confirmar Contraseña</label>
          <input
            type="password"
            name="confirm_password"
            minLength={8}
            maxLength={16}
            pattern="^(?=.*\d)(?=.*[A-Z]).{8,16}$"
            onChange={e => {
              setConfirmPassword(e.target.value);
              if (e.target.value === password) {
                setErrors({ ...errors, password: null });
              } else {
                setErrors({ ...errors, password: 'Las contraseñas no coinciden.' });
              }
            }}
          />
          {errors.password ? (
            <p className="error">{errors.password}</p>
          ) : (
            password && confirmPassword && <FontAwesomeIcon icon={faCheck} className="icon-check" />
          )}
          <small>
            Por favor, confirma tu contraseña.
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="member_image">Foto de perfil</label>
          <div className="general-info__container-avatar">
            {avatarUrl ? (
              <img src={avatarUrl} className="container-avatar__img" alt="Foto de perfil" />
            ) : (
              <img src={avatar} className="container-avatar__img" alt="Foto de perfil" />
            )}
          </div>
          <br />
          <input type="file" name="image" id="imageCode" />
        </div>
        <br />
        <input type="submit" value="Actualizar" className="btn btn-success" />
      </form>

      <br />
    </>
  )
};