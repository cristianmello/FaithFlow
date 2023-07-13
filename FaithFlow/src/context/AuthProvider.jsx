import React, { useState, useEffect, createContext } from 'react';
import { Global } from '../helpers/Global';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [auth, setAuth] = useState({});
    const [roles, setRoles] = useState([]);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        authMember();
    }, []);

    const authMember = async () => {
        //Sacar datos del miembro identificado del localStorage
        const token = localStorage.getItem("token");
        const member = localStorage.getItem("member");

        //Comprobar si tengo el token y el miembro
        if (!token || !member) {
            setLoading(false);
            return false;
        }

        //Transformar los datos a un objeto de javascript
        const memberObj = JSON.parse(member);
        const memberCode = memberObj.member_code;


        //Peticion ajax al backend que compruebe el token y
        // que me devuelva todos los datos del miembro
        const request = await fetch(Global.url + "member/profile/" + memberCode, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });

        const data = await request.json();


        // Setear el estado de auth
        setAuth(data.member);
        // Setear los roles
        setRoles(data.roles);

        // Fetch the avatar
        const avatarRequest = await fetch(Global.url + 'member/avatar/' + data.member.member_image, {
            headers: {
                Authorization: token,
            },
        });
        if (avatarRequest.ok) {
            const avatarBlob = await avatarRequest.blob();
            const avatarUrl = URL.createObjectURL(avatarBlob);
            setAvatarUrl(avatarUrl);
        }

        setLoading(false);
    }

    return (<AuthContext.Provider
        value={{
            auth,
            roles,
            avatarUrl,
            loading,
            setAuth,
            setRoles,
            setAvatarUrl,
        }}
    >
        {children}
    </AuthContext.Provider>
    )
}

export default AuthContext;
