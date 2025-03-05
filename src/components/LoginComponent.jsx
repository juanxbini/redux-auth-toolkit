import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, logout } from '../features/auth/authSlice'

const LoginComponent = () => {
    const dispatch = useDispatch()
    const { user, token, loading, error } = useSelector((state) => state.auth)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = () => {
        dispatch(loginUser({ email, password }))
    }

    const handleLogout = () => {
        dispatch(logout())
    }

    return (
        <div>
            <h1>Login con Redux Toolkit</h1>
            {loading && <p>Cargando...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {!token ? (
                <div>
                    <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button onClick={handleLogin}>Iniciar Sesión</button>
                </div>
            ) : (
                <div>
                    <p>Bienvenido, {user?.username}</p>
                    <button onClick={handleLogout}>Cerrar Sesión</button>
                </div>
            )}
        </div>
    )
}

export default LoginComponent