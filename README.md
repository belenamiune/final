# Casos de Prueba de la API

Este archivo contiene los casos de prueba de la API que hemos implementado, incluyendo las rutas y los resultados esperados.

## 1. Registro de Usuario

**Endpoint:** `POST /register`

**Descripción:** Registro de un nuevo usuario.

**Prueba:**

1. Realizar una solicitud `POST` al endpoint `/register` con los siguientes datos:
   - `email`: user@example.com
   - `password`: mypassword123
   - `first_name`: John
   - `last_name`: Doe
   - `role`: user o admin (opcional, por defecto "user")

**Resultado Esperado:**

- El usuario se registra correctamente.
- Se retorna un mensaje `Usuario registrado con éxito`.
- El código de estado es `201`.

## 2. Iniciar Sesión

**Endpoint:** `POST /login`

**Descripción:** Iniciar sesión de un usuario.

**Prueba:**

1. Realizar una solicitud `POST` al endpoint `/login` con los siguientes datos:
   - `email`: user@example.com
   - `password`: mypassword123

**Resultado Esperado:**

- El usuario inicia sesión correctamente.
- Se retorna un token JWT.
- El código de estado es `200`.

## 3. Obtener Usuario Actual

**Endpoint:** `GET /user/current`

**Descripción:** Obtener los datos del usuario autenticado.

**Prueba:**

1. Realizar una solicitud `GET` al endpoint `/user/current` con un token válido.

**Resultado Esperado:**

- Se retorna la información del usuario autenticado, incluyendo su `id`, `email`, `role`, `first_name`, `last_name`.
- El código de estado es `200`.

## 4. Cambiar Rol de Usuario

**Endpoint:** `PUT /user/role/:email`

**Descripción:** Cambiar el rol de un usuario.

**Prueba:**

1. Realizar una solicitud `PUT` al endpoint `/user/role/user@example.com` con un token de administrador.
2. Cambiar el rol de `user` a `admin`.

**Resultado Esperado:**

- El rol del usuario cambia a `admin`.
- Se retorna el mensaje `Rol cambiado a admin`.
- El código de estado es `200`.

## 5. Agregar Producto al Carrito

**Endpoint:** `POST /carts/add`

**Descripción:** Agregar un libro al carrito.

**Prueba:**

1. Realizar una solicitud `POST` al endpoint `/carts/add` con los siguientes datos:
   - `bookId`: 123456 (ID del libro)
   - `cartId`: 7890 (ID del carrito)
   - `quantity`: 1

**Resultado Esperado:**

- El libro se agrega correctamente al carrito.
- Se retorna el mensaje `Producto agregado al carrito`.
- El código de estado es `200`.

## 6. Verificar Agregar al Carrito con Role de Admin

**Endpoint:** `POST /carts/add`

**Descripción:** Agregar un producto al carrito con un usuario con rol de admin.

**Prueba:**

1. Realizar una solicitud `POST` al endpoint `/carts/add` como admin con un libro y carrito válidos.

**Resultado Esperado:**

- El producto se agrega correctamente al carrito.
- Se retorna el mensaje `Producto agregado al carrito`.
- El código de estado es `200`.

## 7. Verificar Agregar al Carrito con Role de Usuario

**Endpoint:** `POST /carts/add`

**Descripción:** Agregar un producto al carrito con un usuario con rol de user.

**Prueba:**

1. Realizar una solicitud `POST` al endpoint `/carts/add` con un libro y carrito válidos.

**Resultado Esperado:**

- El producto se agrega correctamente al carrito.
- Se retorna el mensaje `Producto agregado al carrito`.
- El código de estado es `200`.

## 8. Obtener Libros

**Endpoint:** `GET /book`

**Descripción:** Obtener todos los libros disponibles.

**Prueba:**

1. Realizar una solicitud `GET` al endpoint `/book` sin parámetros.

**Resultado Esperado:**

- Se retorna una lista con todos los libros disponibles en la tienda.
- El código de estado es `200`.

## 9. Ver Detalles de un Libro

**Endpoint:** `GET /book/:id`

**Descripción:** Obtener los detalles de un libro específico.

**Prueba:**

1. Realizar una solicitud `GET` al endpoint `/book/123456` con un ID de libro válido.

**Resultado Esperado:**

- Se retorna la información detallada del libro.
- El código de estado es `200`.

## 10. Eliminar Producto del Carrito

**Endpoint:** `DELETE /carts/remove/:cartId/:productId`

**Descripción:** Eliminar un producto del carrito.

**Prueba:**

1. Realizar una solicitud `DELETE` al endpoint `/carts/remove/7890/123456` con un carrito y producto válidos.

**Resultado Esperado:**

- El producto se elimina correctamente del carrito.
- Se retorna el mensaje `Producto eliminado del carrito`.
- El código de estado es `200`.

## 11. Agregar un Libro

**Endpoint:** `POST /book/add`

**Descripción:** Agregar un nuevo libro a la tienda.

**Prueba:**

1. Realizar una solicitud `POST` al endpoint `/book/add` con los siguientes datos:
   - `title`: "The Great Gatsby"
   - `author`: "F. Scott Fitzgerald"
   - `price`: 19.99
   - `stock`: 10
   - `description`: "A classic novel of the Jazz Age."

**Resultado Esperado:**

- El libro se agrega correctamente a la base de datos.
- Se retorna el mensaje `Libro agregado con éxito`.
- El código de estado es `201`.

---

## Conclusión

Este archivo contiene las pruebas más comunes sobre los endpoints de la API.
