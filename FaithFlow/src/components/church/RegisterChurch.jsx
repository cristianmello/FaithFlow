import React, { useState } from 'react';
import { useForm } from '../../hooks/useForm';
import { Global } from '../../helpers/Global';
import { Navigate, useNavigate } from 'react-router-dom';
import { Modal, message } from 'antd';

export const RegisterChurch = () => {
    const navigate = useNavigate();
    const { form, changed2 } = useForm({});
    const [saved, setSaved] = useState('not_sended');
    const [showSuggestions, setShowSuggestions] = useState({});
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [selectedDepartment, setSelectedDepartment] = useState("");

    const departments = [
        { name: 'Artigas', value: 'Artigas' },
        { name: 'Canelones', value: 'Canelones' },
        { name: 'Cerro Largo', value: 'Cerro Largo' },
        { name: 'Colonia', value: 'Colonia' },
        { name: 'Durazno', value: 'Durazno' },
        { name: 'Flores', value: 'Flores' },
        { name: 'Florida', value: 'Florida' },
        { name: 'Lavalleja', value: 'Lavalleja' },
        { name: 'Maldonado', value: 'Maldonado' },
        { name: 'Montevideo', value: 'Montevideo' },
        { name: 'Paysandú', value: 'Paysandú' },
        { name: 'Río Negro', value: 'Río Negro' },
        { name: 'Rivera', value: 'Rivera' },
        { name: 'Rocha', value: 'Rocha' },
        { name: 'Salto', value: 'Salto' },
        { name: 'San José', value: 'San José' },
        { name: 'Soriano', value: 'Soriano' },
        { name: 'Tacuarembó', value: 'Tacuarembó' },
        { name: 'Treinta y Tres', value: 'Treinta y Tres' },
    ];

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        changed2(name, value);

        // Verificamos si la contraseña coincide con la confirmación al cambiar el valor
        if (name === "member_password" && value !== confirmPassword) {
            setErrors({ ...errors, password: 'Las contraseñas no coinciden.' });
        } else {
            setErrors({ ...errors, password: null });
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

    const saveChurch = async (e) => {
        e.preventDefault();

        console.log(form);

        if (form.member_password !== confirmPassword) {
            setErrors({ ...errors, password: 'Las contraseñas no coinciden.' });
            return;
        }

        Modal.confirm({
            title: '¿Estás seguro de que quieres registrar esta iglesia?',
            onOk: async () => {
                const request = await fetch(Global.url + 'church/register', {
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
            },
            onCancel() {
                console.log('Cancel');
            },
        })

    };

    return (
        <div className="container card p-5" style={{ background: "rgba(255,255,255,0.9)", width: "90%", maxWidth: "900px !important" }}>

            <h1 className="h3">Crear Cuenta de FaithFlow.</h1>
            <br />
            <div className="warning-alert alert-warning">
                <b>!FaithFlow es un trabajo en progreso!, ¡Recuerde que este formulario
                    es para registrar una Iglesia!. Al registrar una Iglesia se
                    registrara a la vez un usuario "Pastor"</b>
            </div>
            <br />

            {saved === 'saved' && (
                <strong className="alert alert-success">
                    Iglesia registrada correctamente
                </strong>
            )}
            {saved === 'error' && (
                <strong className="alert alert-danger">
                    Hubo un error al registrar la Iglesia
                </strong>
            )}

            <form className="form" name="signup" id="signupform" onSubmit={saveChurch}>
                <div className="form-group">
                    <label htmlFor="church_name">Nombre de la iglesia</label>
                    <input
                        type="text"
                        className="form-control"
                        name='church_name'
                        id="church_name"
                        value={form.church_name || ''}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        placeholder="Escribir nombre de la iglesia"
                        autoComplete="off"
                    />
                    {showSuggestions.church_name && (
                        <div className="card input-info p-3 bg-blue-dark text-white mb-3">
                            <div className="suggestions">
                                <div className="suggestion-item">Sugerencia: Usualmente, es mejor utilizar el nombre de la ciudad para asegurar que el nombre de la iglesia es único.</div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="church_department">Departamento de la Iglesia</label>
                    <select
                        className="form-control"
                        name="church_department"
                        id="church_department"
                        value={form.church_department || ''}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                    >
                        <option value="">Seleccione un departamento</option>
                        {departments.map(department => (
                            <option key={department.value} value={department.value}>{department.name}</option>
                        ))}
                    </select>
                    {showSuggestions.church_department && (
                        <div className="card input-info p-3 bg-blue-dark text-white mb-3">
                            <div className="suggestions">
                                <div className="suggestion-item">Sugerencia: Seleccione el departamento donde se encuentra ubicada la iglesia.</div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="church_address">Dirección de la iglesia</label>
                    <input
                        type="text"
                        className="form-control"
                        name='church_address'
                        id="church_address"
                        value={form.church_address || ''}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        placeholder="Escribir dirección de la iglesia"
                        autoComplete="off"
                    />
                    {showSuggestions.church_address && (
                        <div className="card input-info p-3 bg-blue-dark text-white mb-3">

                            <div className="suggestions">
                                <div className="suggestion-item">Sugerencia: Asegúrate de incluir el número de calle, nombre de la calle y cualquier referencia adicional en la dirección de la iglesia.</div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="church_description">Descripción de la iglesia</label>
                    <textarea
                        className="form-control"
                        name='church_description'
                        id="church_description"
                        value={form.church_description || ''}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        placeholder="Escribir descripción de la iglesia"
                        autoComplete="off"
                    />
                    {showSuggestions.church_description && (
                        <div className="card input-info p-3 bg-blue-dark text-white mb-3">

                            <div className="suggestions">
                                <div className="suggestion-item">Sugerencia: Describe la historia, los valores y la misión de tu iglesia en esta sección.</div>
                                <div className="suggestion-item">Sugerencia: Destaca los programas, servicios y actividades que ofrece tu iglesia a la comunidad.</div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="church_telephone">Teléfono de la iglesia</label>
                    <input
                        type="text"
                        className="form-control"
                        name='church_telephone'
                        id="church_telephone"
                        value={form.church_telephone || ''}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        placeholder="Escribir teléfono de la iglesia"
                        autoComplete="off"
                    />
                    {showSuggestions.church_telephone && (
                        <div className="card input-info p-3 bg-blue-dark text-white mb-3">
                            <div className="suggestions">
                                <div className="suggestion-item">Sugerencia: Incluye el código de área y el número de contacto completo de la iglesia.</div>
                                <div className="suggestion-item">Sugerencia: Verifica que el número de teléfono sea correcto y esté actualizado.</div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="member_name">Nombre del miembro Lider</label>
                    <input
                        type="text"
                        className="form-control"
                        name='member_name'
                        id="member_name"
                        value={form.member_name || ''}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        placeholder="Escribir nombre del miembro"
                        autoComplete="off"
                    />
                    {showSuggestions.member_name && (
                        <div className="card input-info p-3 bg-blue-dark text-white mb-3">
                            <div className="suggestions">
                                <div className="suggestion-item">Sugerencia: Utiliza el primer nombre del miembro.</div>
                                <div className="suggestion-item">Sugerencia: Verifica la ortografía y la exactitud del nombre del miembro para evitar confusiones.</div>
                            </div>
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

                <button type="submit">Registrar</button>
            </form>
        </div>

    )
};