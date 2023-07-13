import React, { useState } from 'react'
import { useForm } from '../../hooks/useForm'
import { Global } from '../../helpers/Global'
import { Navigate, useNavigate } from 'react-router-dom';


export const Register = () => {
  const navigate = useNavigate();
  const { form, changed2 } = useForm({});
  const [saved, setSaved] = useState('not_sended');
  const [showSuggestions, setShowSuggestions] = useState({});
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [churches, setChurches] = useState([]);

  const uruguayDepartments = [
    'Artigas',
    'Canelones',
    'Cerro Largo',
    'Colonia',
    'Durazno',
    'Flores',
    'Florida',
    'Lavalleja',
    'Maldonado',
    'Montevideo',
    'Paysandú',
    'Río Negro',
    'Rivera',
    'Rocha',
    'Salto',
    'San José',
    'Soriano',
    'Tacuarembó',
    'Treinta y Tres',
  ];

  const handleInputChange = async (event) => {
    const { name, value } = event.target;
    changed2(name, value);

    // Verificamos si la contraseña coincide con la confirmación al cambiar el valor
    if (name === "member_password" && value !== confirmPassword) {
      setErrors({ ...errors, password: 'Las contraseñas no coinciden.' });
    } else {
      setErrors({ ...errors, password: null });
    }

    // Cuando cambia el departamento, obtenemos las iglesias correspondientes
    if (name === 'church_department') {
      try {
        const response = await fetch(`${Global.url}church/list/${value}`);
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setChurches(data.churches || []);
        } else {
          setChurches([]);
          console.error(`Error: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        setChurches([]);
        console.error('Error:', error);
      }
    }
  };

  const handleInputFocus = (event) => {
    const { name } = event.target;
    setShowSuggestions((prevSuggestions) => ({
      ...prevSuggestions,
      [name]: true,
    }));
  };

  const handleInputBlur = (event) => {
    const { name } = event.target;
    setShowSuggestions((prevSuggestions) => ({
      ...prevSuggestions,
      [name]: false,
    }));
  };

  const saveMember = async (e) => {
    e.preventDefault();

    console.log(form)

    if (form.member_password !== confirmPassword) {
      setErrors({ ...errors, password: 'Las contraseñas no coinciden.' });
      return;
    }

    const request = await fetch(Global.url + 'member/', {
      method: 'POST',
      body: JSON.stringify(form),
      headers: {
        'Content-Type': 'application/json',
      },
    });


    const data = await request.json();

    if (data.status === 'Success') {
      setSaved('saved');
      window.scrollTo(0, 0);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setSaved('error');
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">Registro de miembro</h1>
      </header>

      <div className="content__posts">
        {saved === 'saved' && (
          <strong className="alert alert-success">
            Miembro registrado correctamente
          </strong>
        )}
        {saved === 'error' && (
          <strong className="alert alert-danger">
            Hubo un error al registrarse
          </strong>
        )}

        <form className="register-form" onSubmit={saveMember}>
          <div className="form-group">
            <label htmlFor="member_name">Nombre</label>
            <input type="text" className='form-group' id='member_name' name="member_name" value={form.member_name || ''} onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder="Escribir nombre del miembro"
              autoComplete="off"
            />
            {showSuggestions.member_name && (
              <div className="card input-info p-3 bg-blue-dark text-white mb-3">
                <div className="suggestions">
                  <div className="suggestion-item">Sugerencia: Utiliza el primer nombre del miembro.</div>
                  <div className="suggestion-item">Sugerencia: Verifica la ortografía y la exactitud del nombre del miembro para evitar confusiones.</div>                </div>
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="member_lastname">Apellido del miembro</label>
            <input
              type="text"
              className="form-control"
              name='member_lastname'
              id="member_lastname"
              value={form.member_lastname || ''}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder="Escribir apellido del miembro"
              autoComplete="off"
            />
            {showSuggestions.member_lastname && (
              <div className="card input-info p-3 bg-blue-dark text-white mb-3">
                <div className="suggestions">
                  <div className="suggestion-item">Sugerencia: Utiliza el primer apellido del miembro</div>
                  <div className="suggestion-item">Sugerencia: Verifica la ortografía y la exactitud del apellido del miembro para evitar confusiones.</div>
                </div>
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="member_birth">Fecha de nacimiento del miembro</label>
            <input
              type="date"
              className="form-control"
              placeholder="Escribir fecha de nacimiento del miembro"
              name="member_birth"
              id="member_birth"
              value={form.member_birth || ''}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              autoComplete="off"
            />
            {showSuggestions.member_birth && (
              <div className="card input-info p-3 bg-blue-dark text-white mb-3">
                <div className="suggestions">
                  <div>Sugerencia: Asegúrate de que la fecha sea correcta y esté en el formato dd/mm/yyyy.</div>
                </div>
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="member_mail">Correo electrónico del miembro</label>
            <input
              type="email"
              className="form-control"
              placeholder="Escribir correo electrónico del miembro"
              name="member_mail"
              id="member_mail"
              value={form.member_mail || ''}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              autoComplete="off"
            />
            {showSuggestions.member_mail && (
              <div className="card input-info p-3 bg-blue-dark text-white mb-3">
                <div className="suggestions">
                  <div>Sugerencia: Verifica que el correo electrónico sea válido y esté escrito correctamente.</div>
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="member_telephone">Teléfono del miembro</label>
            <input
              type="text"
              className="form-control"
              placeholder="Escribir teléfono del miembro"
              name="member_telephone"
              id="member_telephone"
              value={form.member_telephone || ''}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              autoComplete="off"
            />
            {showSuggestions.member_telephone && (
              <div className="card input-info p-3 bg-blue-dark text-white mb-3">
                <div className="suggestions">
                  <div>Sugerencia: Verifica que el teléfono sea válido y esté escrito correctamente.</div>
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="member_password">Contraseña del miembro</label>
            <input
              type="password"
              className="form-control"
              placeholder="Escribir contraseña del miembro"
              name="member_password"
              id="member_password"
              value={form.member_password || ''}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              autoComplete="off"
            />
            {showSuggestions.member_password && (
              <div className="card input-info p-3 bg-blue-dark text-white mb-3">
                <div className="suggestions">
                  <div>Sugerencia: La contraseña debe contener al menos 8 caracteres, incluyendo letras mayúsculas, minúsculas, números y un simbolo como por ejemplo '%'.</div>
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirm_password">Confirmar Contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="Confirmar contraseña del miembro"
              name="confirm_password"
              id="confirm_password"
              value={confirmPassword || ''}
              onChange={event => {
                setConfirmPassword(event.target.value);
                if (event.target.value !== form.member_password) {
                  setErrors({ ...errors, password: 'Las contraseñas no coinciden.' });
                } else {
                  setErrors({ ...errors, password: null });
                }
              }}
              autoComplete="off"
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="church_department">Departamento</label>
            <select id="church_department" name="church_department" value={form.church_department || ''} onChange={handleInputChange}>
              <option value="">--Seleccione un departamento--</option>
              {uruguayDepartments.map((department) => (
                <option key={department} value={department}>{department}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="church_code">Iglesia</label>
            <select id="church_code" name="church_code" onChange={handleInputChange}>
              <option value="">Seleccione una iglesia</option>
              {churches.map((church) => (
                <option key={church.church_code} value={church.church_code}>
                  {church.church_name}
                </option>
              ))}
            </select>
          </div>
          <input type="submit" value="Registrarse" className="btn btn-success" />
        </form>
      </div>
    </>
  );
};