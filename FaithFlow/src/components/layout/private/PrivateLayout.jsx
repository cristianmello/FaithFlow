import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import useAuth from '../../../hooks/useAuth'
import { DailyVerse } from '../private/content/DailyVerse'

export const PrivateLayout = () => {

    const { auth, loading } = useAuth();

    if (loading) {
        return <h1>Cargando......</h1>
    } else {
        return (
            <>
                {/*LAYOUT*/}

                {/* Cabezera y navegacion */}
                <Header />

                {/*Contenido principal*/}
                <section className='layout__content'>
                    {auth.member_code ?
                        <>
                            <Outlet />
                        </>
                        :
                        <Navigate to="/login" />
                    }
                </section>

                {/* Barra lateral */}
                <Sidebar />
            </>
        );

    }
}
