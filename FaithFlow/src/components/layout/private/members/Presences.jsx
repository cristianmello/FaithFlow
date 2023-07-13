import React, { useEffect, useState } from 'react';
import axios from 'axios';
import avatar from '../../../../assets/img/user.png';
import { Global } from '../../../../helpers/Global';
import { FaEnvelope, FaComments } from 'react-icons/fa';
import '../../../../assets/css/feed.css';
import { useParams } from 'react-router-dom';

export const Presences = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { meeting_code } = useParams();

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await axios.get(Global.url + 'meeting/' + meeting_code + '/members', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      const memberPromises = response.data.map(async (member) => {
        if (member.member_image !== 'default.png') {
          member.member_image = await fetchAvatar(member.member_image);
        } else {
          member.member_image = avatar;
        }
        return member;
      });

      const membersWithAvatars = await Promise.all(memberPromises);

      setMembers(membersWithAvatars);
      setLoading(false);
    } catch (error) {
      setError('Error al obtener la lista de miembros');
      setLoading(false);
    }
  };

  const fetchAvatar = async (imageName) => {
    if (imageName === 'default.png') {
      return avatar;
    }
    try {
      const response = await fetch(Global.url + 'member/avatar/' + imageName, {
        headers: {
          Authorization: token,
        },
      });
      if (response.ok) {
        const avatarBlob = await response.blob();
        const avatarUrl = URL.createObjectURL(avatarBlob);
        return avatarUrl;
      }
    } catch (error) {
      console.error('Error fetching avatar:', error);
    }
    return null;
  };

  return (
    <div className="feed-container">
      <h1 className="feed-title">Presencias</h1>
      <div className="members-list">
        {members.map((member) => (
          <div className="member-card" key={member.member_code}>
            <div className="member-avatar">
              <img src={member.member_image} className="container-avatar__img" alt="Foto de perfil" />
            </div>
            <div className="member-details">
              <h3 className="member-name">{`${member.member_name} ${member.member_lastname}`}</h3>
              {/* Suponiendo que cada miembro tiene una propiedad 'role' */}
              {member.Roles && Array.isArray(member.Roles) && member.Roles.map((role, index) => (
                <p key={index} className="member-email">Rol: {role.role_name}</p>
              ))}
              <p className="member-email">{`Correo electrónico: ${member.member_mail}`}</p>
              <p className="member-contact">{`Contacto: ${member.member_telephone}`}</p>
              {/* 
              <div className="member-icons">
                <FaEnvelope className="member-icon" onClick={() => handleEmail(member.member_mail)} />
                <FaComments className="member-icon" onClick={() => handleContact(member.member_telephone)} />
              </div>
              */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
