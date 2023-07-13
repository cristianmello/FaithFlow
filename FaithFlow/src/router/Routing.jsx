import React from 'react'
import { Routes, Route, BrowserRouter, Navigate, Link } from 'react-router-dom'
import { PublicLayout } from '../components/layout/public/PublicLayout'
import { Login } from '../components/user/Login'
import { Register } from '../components/user/Register'
import { PrivateLayout } from '../components/layout/private/PrivateLayout'
import { AuthProvider } from '../context/AuthProvider'
import { Logout } from '../components/user/Logout'
import { ForgotPassword } from '../components/user/ForgotPassword'
import { RegisterChurch } from '../components/church/RegisterChurch'
import { SectionCards } from '../components/layout/private/content/SectionCards'
import { Update } from '../components/user/Update'
import { Profile } from '../components/user/Profile'
import { Role } from '../components/user/Role'
import { Bible } from '../components/layout/private/content/Bible'
import { Graph } from '../components/layout/private/treasury/Graph'
import { SectionTreasury } from '../components/layout/private/treasury/SectionTreasury'
import { Types } from '../components/layout/private/treasury/Types'
import { Treasuries } from '../components/layout/private/treasury/Treasuries'
import { SectionMembers } from '../components/layout/private/members/SectionMembers'
import { List } from '../components/layout/private/members/List'
import { Calendary } from '../components/layout/private/members/Calendary'
import { Meetings } from '../components/layout/private/members/Meetings'
import { Presences } from '../components/layout/private/members/Presences'


export const Routing = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path='/' element={<PublicLayout />}>
                        <Route index element={<Login />} />
                        <Route path='login' element={<Login />} />
                        <Route path='registro' element={<Register />} />
                        <Route path='forgot-password' element={<ForgotPassword />} />
                    </Route>
                    <Route path='/social' element={<PrivateLayout />}>
                        <Route index element={<SectionCards />} />
                        <Route path='inicio' element={<SectionCards />} />
                        <Route path='logout' element={<Logout />} />
                        <Route path='miembro/actualizar' element={<Update />} />
                        <Route path='miembro/perfil' element={<Profile />} />
                        <Route path='roles' element={<Role />} />
                        <Route path='biblia' element={<Bible />} />
                        <Route path='tesoreria' element={<SectionTreasury />} />
                        <Route path='tesoreria/tipos' element={<Types />} />
                        <Route path='tesoreria/lista' element={<Treasuries />} />
                        <Route path='miembros' element={<SectionMembers />} />
                        <Route path='miembros/lista' element={<List />} />
                        <Route path='miembros/calendario' element={<Calendary />} />
                        <Route path='miembros/reuniones' element={<Meetings />} />
                        <Route path='miembros/reunion/:meeting_code/presencias' element={<Presences />} />
                    </Route>
                    <Route path='/church' element={<PublicLayout />}>
                        <Route index element={<RegisterChurch />} />
                        <Route path='registro' element={<RegisterChurch />} />
                    </Route>
                    <Route path='*' element={
                        <>
                            <p>
                                <h1>Error 404</h1>
                                <Link to="/">Volver al inicio</Link>
                            </p>
                        </>
                    } />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}
