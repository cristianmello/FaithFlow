import React, { useContext } from 'react'
import AuthContext from '../context/AuthProvider'

const useRoles = () => {
    return useContext(AuthContext);
}

export default useRoles;

