# 🎓 Chuleta Definitiva: Defensa TFG Swaplt Cars

Esta guía resume las respuestas clave y el vocabulario técnico (la "versión PRO") para defender tu proyecto ante el tribunal con seguridad.

---

## 1. El Mapa y el Segurata (Rutas y Seguridad)

**Pregunta del Tribunal: ¿Cómo funciona la navegación y la seguridad de usuarios en tu Frontend?**

> *"En Angular, la navegación no recarga la página. Uso el archivo de rutas para definir qué componente se carga. Para proteger las rutas privadas (como 'Mis Vehículos'), utilizo un `AuthGuard`. Este 'Guard' comprueba si existe un **Token JWT** (sesión) guardado en el navegador del usuario. Si el token existe, permite el paso; si no lo detecta o se ha borrado, interrumpe la navegación y te redirige a la pantalla de Login."*

---

## 2. El Viaje del Dato (Conexión Front-Back)

**Pregunta del Tribunal: ¿Cómo se comunican tu frontend en Angular y tu backend en Laravel?**

> *"La comunicación se realiza mediante **peticiones HTTP asíncronas** hacia la API REST de mi Laravel:*
> - *Usamos **GET** para pedir y leer datos (ej. cargar el catálogo).*
> - *Usamos **POST** para crear nuevos registros (ej. subir un coche).*
> - *Usamos **PUT / PATCH** para actualizar registros existentes (ej. editar el precio).*
> - *Usamos **DELETE** para eliminar registros.*
> 
> *Normalmente, los datos viajan empaquetados en formato **JSON**. Sin embargo, a la hora de publicar un coche, como el usuario sube fotos, utilizo el formato **FormData**, que es el paquete estándar que permite enviar archivos pesados junto con los datos de texto de forma conjunta."*

---

## 3. El Enemigo Final (Problema de CORS)

**Pregunta del Tribunal: Tienes el Frontend en Vercel y el Backend en Railway. Seguro que te topaste con el error de CORS al conectarlos en producción. ¿Qué es y cómo lo solucionaste?**

> *"Efectivamente. El CORS es un mecanismo de seguridad de navegadores como Chrome que bloquea peticiones HTTP silenciosas hacia un dominio diferente (Railway) al que se cargó la web original (Vercel). Para solucionarlo, tuve que configurar el **Middleware de CORS** en mi backend de Laravel. Allí añadí la URL exacta de mi Vercel a la lista de 'Orígenes Permitidos' (Allowed Origins). Así, Laravel envía las cabeceras `Access-Control-Allow-Origin` en cada respuesta, indicándole al navegador que son servidores de confianza y permitiendo la comunicación."*

---

## 4. Base de Datos MySQL (Relaciones)

**Pregunta del Tribunal: Si eliminas a un usuario desde tu panel de administrador, ¿qué ocurre con sus vehículos publicados en MySQL? ¿Se quedan dando error?**

> *"No, no quedan datos huérfanos. En las migraciones de mi base de datos, al definir la Clave Foránea (`user_id`) en la tabla de vehículos, le añadí la restricción de **borrado en cascada (`ON DELETE CASCADE`)**. Esto es una buena práctica para garantizar la **Integridad Referencial** de la base de datos. Si elimino al usuario padre, el propio motor de MySQL se encarga automáticamente de borrar todos sus vehículos, ofertas y mensajes dependientes."*

---

## 5. Servicios Externos (Envío de Emails y Resend)

**Pregunta del Tribunal: ¿Cómo conseguiste que el sistema de registro envíe correos electrónicos en producción si los puertos habituales suelen estar bloqueados en la nube?**

> *"En desarrollo local usaba el protocolo estándar SMTP sin problema, pero en producción (Railway) descubrí que bloquean esos puertos por políticas anti-spam. Para solucionarlo e implementar un sistema más escalable, integré la API del servicio **Resend**. Lo elegí porque en lugar de depender del protocolo SMTP tradicional, Resend funciona a través de peticiones HTTP (API REST). Mi backend hace una simple petición segura (HTTPS) con los datos del correo esquivando los puertos bloqueados, y los servidores de Resend se encargan de la entrega final del email."*
