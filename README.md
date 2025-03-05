# Redux Authentication con Redux Toolkit

Este proyecto implementa autenticación de usuario utilizando **React, Redux Toolkit y Redux Thunk**. Redux Thunk es un middleware para Redux que permite ejecutar operaciones asíncronas, como llamadas a APIs, antes de actualizar el estado global. En este contexto, es esencial para manejar el proceso de autenticación, permitiendo despachar acciones antes y después de recibir una respuesta del servidor.
A diferencia de la versión anterior de Redux, Redux Toolkit simplifica la estructura eliminando la necesidad de escribir manualmente los tipos de acción y los reducers con `switch-case`.

La aplicación se conecta a una **[API REST](https://github.com/juanxbini/auth-rest-node)** para manejar la autenticación de usuarios. La API expone el endpoint `POST /api/auth/login`, donde el cuerpo de la petición debe incluir un JSON con las credenciales del usuario:

```
json
{
  "email": "test@example.com",
  "password": "123456"
}
```

Si las credenciales son correctas, la API devuelve una respuesta exitosa con un token y los datos del usuario:

```
json
{
  "token": "eyJhbGciOiJIUzI...",
  "user": {
    "id": "61234abcd567",
    "username": "name test",
    "email": "test@example.com",
    "rol": "user rol"
  }
}
```

En caso de error, puede responder con códigos de estado HTTP `400` (credenciales incorrectas) o `500` (error interno del servidor).

---

## 📁 Estructura del Proyecto
```
/src
├── /features/auth # Carpeta donde se maneja Redux Toolkit
│    ├── authSlice.js # Manejo del estado y acciones de autenticación
│
├── /store # Configuración del Store de Redux Toolkit
│    ├── store.js
│
├── /components # Componentes reutilizables de la aplicación
│    ├── LoginComponent.jsx # Componente de login y logout
│
├── App.jsx # Componente principal
├── main.jsx # Punto de entrada de React y conexión con Redux
```

---

## 📝 **Explicación de Redux Toolkit**

### **1️⃣ `createSlice()` - Simplificación del Reducer**

Redux Toolkit introduce `createSlice()`, que combina el **estado inicial, las acciones y los reducers en un solo lugar**.

Ejemplo:
```
js
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth", // Nombre del slice
  initialState: { user: null, token: null }, // Estado inicial
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
```

---

### **2️⃣ `createAsyncThunk()` - Manejo de peticiones asíncronas**

Redux Toolkit también incluye `createAsyncThunk()`, que maneja acciones asíncronas de forma eficiente.

Ejemplo:
```
js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loginUser = createAsyncThunk("auth/loginUser", async (credentials, thunkAPI) => {
  try {
    const response = await axios.post("http://localhost:3000/api/auth/login", credentials);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
```

Dentro de `extraReducers`, `builder.addCase()` nos permite manejar los estados de `loginUser`. Esta función permite definir cómo el estado global debe reaccionar ante diferentes estados de una acción asíncrona creada con `createAsyncThunk()`. Por ejemplo, `builder.addCase(loginUser.pending, ...)` se ejecuta cuando la acción comienza, `builder.addCase(loginUser.fulfilled, ...)` cuando se completa con éxito, y `builder.addCase(loginUser.rejected, ...)` cuando falla. Esto permite manejar los ciclos de vida de una petición de manera estructurada y sin necesidad de usar `switch-case`.

```
js
extraReducers: (builder) => {
  builder
    .addCase(loginUser.pending, (state) => {
      state.loading = true;
    })
    .addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
    })
    .addCase(loginUser.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });
},
```

---

## 📲 **Uso en un Componente de Login**

Ejemplo de un componente de React que usa Redux Toolkit. Este componente interactúa con el `authSlice` mediante `useDispatch` para disparar acciones de login y logout, y `useSelector` para leer el estado actual de autenticación. Se conecta con el store de Redux para obtener la información del usuario y gestionar el estado de carga y errores.
```
js
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, logout } from "../features/auth/authSlice";

const LoginComponent = () => {
  const dispatch = useDispatch();
  const { user, token, loading, error } = useSelector((state) => state.auth);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleLogin = () => {
    dispatch(loginUser({ email, password }));
  };
  
  return (
    <div>
      <h1>Autenticación</h1>
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!token ? (
        <>
          <input type="email" placeholder="Correo" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleLogin}>Iniciar Sesión</button>
        </>
      ) : (
        <>
          <p>Bienvenido, {user?.username}</p>
          <button onClick={() => dispatch(logout())}>Cerrar Sesión</button>
        </>
      )}
    </div>
  );
};

export default LoginComponent;
```

---

## 💪 **Beneficios de Redux Toolkit**

1. **Menos código**: Se eliminan los `switch-case` y `actionTypes.js`.
2. **Integración sencilla** con `createSlice()` y `createAsyncThunk()`.
3. **Manejo asíncrono optimizado** con `extraReducers`.
4. **Inmutabilidad automática** gracias a Immer.js.

🚀 **¡Con Redux Toolkit, el manejo del estado global es más fácil y eficiente!**

En este documento hemos explorado cómo Redux Toolkit simplifica la gestión del estado global en una aplicación de React, eliminando la necesidad de escribir `switch-case` y `actionTypes.js`, y facilitando el manejo de acciones asíncronas con `createAsyncThunk()`. Además, hemos visto cómo `createSlice()` permite definir estado, acciones y reducers en un solo archivo, mejorando la organización del código.

En conjunto, estas mejoras hacen que Redux Toolkit sea una solución más eficiente y fácil de mantener para manejar el estado en aplicaciones modernas.

