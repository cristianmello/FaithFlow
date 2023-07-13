import React, { useState, useEffect } from 'react';
import '../../assets/css/profile.css';
import useAuth from '../../hooks/useAuth';
import { Global } from '../../helpers/Global';
import useRoles from '../../hooks/useRoles';

export const Profile = () => {
    const { auth } = useAuth();
    const { roles } = useRoles();
    const token = localStorage.getItem("token");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [church, setChurch] = useState({});

    useEffect(() => {

        const fetchProfile = async () => {
            try {
                const response = await fetch(Global.url + 'member/profile/' + auth.member_code, {
                    headers: {
                        Authorization: token,
                    },
                });
                if (response.ok) {
                    const profileData = await response.json();
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

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

        const fetchChurch = async () => {
            try {
                const response = await fetch(Global.url + 'church', {
                    method: 'GET',
                    headers: {
                        Authorization: token,
                    },
                });
                const churchData = await response.json();
                setChurch(churchData);
            } catch (error) {
                console.error('Error fetching church:', error);
            }
        };

        fetchProfile();
        fetchChurch();
        if (auth.member_image !== 'default.png') {
            fetchAvatar();
        }
    }, [auth.member_code, auth.member_image, token]);

    return (
        <div className="profile">
            <div className="profile__header">
                <h1>Datos de perfil</h1>
            </div>
            <div className="profile__body">
                {avatarUrl ? (
                    <img src={avatarUrl} className="profile__image" alt="Foto de perfil" />
                ) : (
                    <img src="/src/assets/img/user.png" className="profile__image" alt="Foto de perfil" />
                )}                <div className="profile__info">
                    <h2>{`${auth.member_name} ${auth.member_lastname}`}</h2>
                    <p><strong>Rol/es:</strong> </p>
                    {roles && Array.isArray(roles) && roles.map((role, index) => (
                        <p key={index}>{role.role_name}</p>
                    ))}
                    <p><strong>Email:</strong> {auth.member_mail}</p>
                    <p><strong>Contacto:</strong> {auth.member_telephone}</p>
                    <p><strong>Fecha de Nacimiento:</strong> {auth.member_birth}</p>
                </div>
            </div>
            <div className="profile__header">
                <h1>Información de la Iglesia</h1>
            </div>
            <div className="profile__body">
                <div className="profile__info">
                    <p><strong>Nombre:</strong> {church.church_name}</p>
                    <p><strong>Dirección:</strong> {church.church_address}</p>
                    <p><strong>Descripción:</strong> {church.church_description}</p>
                    <p><strong>Teléfono:</strong> {church.church_telephone}</p>
                </div>
            </div>
        </div>
    );
};
