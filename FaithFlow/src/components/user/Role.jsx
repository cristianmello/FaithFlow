import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import { Global } from "../../helpers/Global";
import styles from "../../assets/css/role.module.css";
import avatar from "../../assets/img/user.png";

export const Role = () => {
  const [members, setMembers] = useState([]);
  const [roles, setRoles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const roleDescriptions = {
    Administrador: {
      responsibilities: "El administrador tiene control total sobre todas las funcionalidades.",
    },
    Pastor: {
      responsibilities: "El pastor es responsable de dirigir los servicios y proporcionar guía espiritual a los miembros de la congregación.",
    },
    Tesorero: {
      responsibilities: "El tesorero se encarga de gestionar las finanzas de la iglesia, incluyendo la recaudación de fondos y el seguimiento de los gastos.",
    },
    Maestro: {
      responsibilities: "El maestro proporciona instrucción y dirección en los estudios bíblicos y otros programas educativos dentro de la iglesia.",
    },
    SinRol: {
      responsibilities: "Este miembro aún no tiene un rol asignado.",
    },
  };

  const separateMembersByRole = (members) => {
    let separatedMembers = {
      SinRol: [],
      Pastor: [],
      Tesorero: [],
      Maestro: [],
      Administrador: [],
    };

    for (let member of members) {
      if (member.Roles.length === 0) {
        separatedMembers.SinRol.push(member);
      } else {
        for (let role of member.Roles) {
          if (separatedMembers[role.role_name]) {
            separatedMembers[role.role_name].push(member);
          } else {
            separatedMembers[role.role_name] = [member];
          }
        }
      }
    }

    return separatedMembers;
  };

  const fetchMembers = async () => {
    try {
      const response = await axios.get(Global.url + "member/list", {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      const memberPromises = response.data.members.map(async (member) => {
        if (member.member_image !== "default.png") {
          member.member_image = await fetchAvatar(member.member_image);
        } else {
          member.member_image = avatar;
        }
        return member;
      });

      const membersWithAvatars = await Promise.all(memberPromises);

      let separatedMembers = separateMembersByRole(membersWithAvatars);

      setMembers(separatedMembers);
      setLoading(false);
    } catch (error) {
      setError("Error al obtener la lista de miembros");
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get(Global.url + "role", {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      setRoles(response.data);
    } catch (error) {
      console.error("Error al obtener los roles:", error);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchRoles();
  }, []);

  const fetchAvatar = async (imageName) => {
    if (imageName === "default.png") {
      return avatar;
    }
    try {
      const response = await fetch(Global.url + "member/avatar/" + imageName, {
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
      console.error("Error fetching avatar:", error);
    }
    return null;
  };

  const handleDragEnd = async (result) => {
    const { source, destination } = result;

    // Si se suelta fuera de una columna, no hagas nada
    if (!destination) {
      return;
    }

    const sourceRole = source.droppableId;
    const destinationRole = destination.droppableId;

    // Si el miembro es un administrador, evita que sea arrastrado a un nuevo rol
    if (sourceRole === "Administrador" && destinationRole !== "SinRol") {
      return;
    }

    // Si el miembro es un administrador, evita que sea arrastrado a un nuevo rol
    if (sourceRole === "Pastor") {
      return;
    }

    const memberCode = result.draggableId;


    // Si el miembro se arrastra a un nuevo rol, haz la solicitud para actualizar su rol
    if (sourceRole !== destinationRole) {
      if (destinationRole === "SinRol" || destinationRole === "Administrador") {
        try {
          // Primero, eliminamos todos los roles
          await axios.delete(`${Global.url}role/member/${memberCode}/roles`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
            }
          );
          // Si el destino es "Administrador", asignamos ese rol
          if (destinationRole === "Administrador") {
            const adminRoleCode = roles.find((role) => role.role_name === "Administrador").role_code;
            await axios.post(`${Global.url}role/${adminRoleCode}/members/${memberCode}`,
              {},
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: token,
                },
              }
            );
          }
          // Actualizamos los miembros locales luego de hacer los cambios
          await fetchMembers();
        } catch (error) {
          // manejar errores
        }
      } else {
        const destinationRoleCode = roles.find((role) => role.role_name === destinationRole).role_code;

        try {
          await axios.post(`${Global.url}role/${destinationRoleCode}/members/${memberCode}`,
            {},
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
            }
          );
          // Actualizamos los miembros locales luego de asignar el rol
          await fetchMembers();
        } catch (error) {
          // manejar errores
        }
      }
    }
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const renderMembers = (members) => {
    return members.map((member, index) => {
      const roles = member.Roles?.map((role) => role.role_name);

      return (
        <Draggable
          key={member.member_code.toString()}
          draggableId={member.member_code.toString()}
          index={index}
        >
          {(provided) => (
            <div
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
              className={styles.memberCard}
            >
              <div className={styles.memberAvatar}>
                <img
                  src={member.member_image}
                  className={styles.containerAvatarImg}
                  alt="Foto de perfil"
                />
              </div>
              <div className={styles.memberDetails}>
                <h3 className={styles.memberName}>
                  {`${member.member_name} ${member.member_lastname}`}
                </h3>
                {roles &&
                  Array.isArray(roles) &&
                  roles.map((role, index) => (
                    <div key={index} className={styles.draggableRole}>
                      {role}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </Draggable>
      );
    });
  };

  return (
    <>
      <div className="warning-alert alert-warning"><b>¡Para dejar de ser administrador se debera ir a la columna "SIN ROL" solo asi podra asignar un nuevo rol!, ¡NO SE PODRA ASIGNAR OTRO ROL AL SER ADMINISTRADOR!</b></div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={styles.roleContainer}>
          <div className={styles.column}>
            <h2>Tesorero</h2>
            <p className={styles.roleDescription}>{roleDescriptions.Tesorero.responsibilities}</p>
            <Droppable droppableId="Tesorero">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={styles.columnContent}
                >
                  {renderMembers(members.Tesorero)}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          <div className={styles.column}>
            <h2>Maestro</h2>
            <p className={styles.roleDescription}>{roleDescriptions.Maestro.responsibilities}</p>
            <Droppable droppableId="Maestro">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={styles.columnContent}
                >
                  {renderMembers(members.Maestro)}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          <div className={styles.column}>
            <h2>Administrador</h2>
            <p className={styles.roleDescription}>{roleDescriptions.Administrador.responsibilities}</p>
            <Droppable droppableId="Administrador">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={styles.columnContent}
                >
                  {renderMembers(members.Administrador)}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          <div className={styles.column}>
            <h2>Sin Rol</h2>
            <p className={styles.roleDescription}>{roleDescriptions.SinRol.responsibilities}</p>
            <Droppable droppableId="SinRol">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={styles.columnContent}
                >
                  {renderMembers(members.SinRol)}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          <div className={styles.column}>
            <h2>Pastor</h2>
            <p className={styles.roleDescription}>{roleDescriptions.Pastor.responsibilities}</p>
            <Droppable droppableId="Pastor">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={styles.columnContent}
                >
                  {renderMembers(members.Pastor)}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>
    </>
  );


};
