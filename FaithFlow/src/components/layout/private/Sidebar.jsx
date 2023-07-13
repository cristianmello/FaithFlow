import React, { useEffect, useState } from 'react'
import avatar from '../../../assets/img/user.png';
import useAuth from '../../../hooks/useAuth';
import useRoles from '../../../hooks/useRoles';
import { Global } from '../../../helpers/Global';

export const Sidebar = () => {

    const { auth, avatarUrl } = useAuth();
    const { roles } = useRoles();

    return (
        <aside className="layout__aside">

            <div className="aside__container">

                <div className="aside__profile-info">

                    <div className="profile-info__general-info">
                        <div className="general-info__container-avatar">
                            {avatarUrl ? (
                                <img src={avatarUrl} className="container-avatar__img" alt="Foto de perfil" />
                            ) : (
                                <img src={avatar} className="container-avatar__img" alt="Foto de perfil" />
                            )}
                        </div>

                        <div className="general-info__container-names">
                            <a href="#" className="container-names__name">{auth.member_name + " " + auth.member_lastname}</a>
                            {roles && Array.isArray(roles) && roles.map((role, index) => (
                                <p key={index} className="container-names__nickname">{role.role_name}</p>
                            ))}
                        </div>
                    </div>
                </div>


                <div className="aside__container-form">

                    <form className="container-form__form-post">

                        <div className="form-post__inputs">
                            <label htmlFor="post" className="form-post__label">¿Como has estado hoy?</label>
                            <textarea name="post" className="form-post__textarea"></textarea>
                        </div>

                        <div className="form-post__inputs">
                            <label htmlFor="image" className="form-post__label">Sube una foto</label>
                            <input type="file" name="image" className="form-post__image" />
                        </div>

                        <input type="submit" value="Enviar" className="form-post__btn-submit" disabled />

                    </form>

                </div>

            </div>

        </aside>
    )
}
