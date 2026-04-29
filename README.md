# **Backend gobierno abierto**

# ![Node Version](https://img.shields.io/badge/node-%3E%3D18.19.0-brightgreen) ![Docker](https://img.shields.io/badge/docker-%3E%3D24.0.0-blue?logo=docker&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/postgresql-15%2B-blue?logo=postgresql&logoColor=white) ![TypeORM](https://img.shields.io/badge/TypeORM-%5E0.3.28-brightgreen) ![NestJS Version](https://img.shields.io/badge/nestjs-%5E11.1.15-red?logo=nestjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-%5E5.9.3-blue?logo=typescript&logoColor=white) ![Auth](https://img.shields.io/badge/auth-JWT%2BPassport-orange) ![License](https://img.shields.io/badge/license-UNLICENSED-lightgrey)

## **Breve descripcion**
Backend para el proyecto Gobierno Abierto construido con _NestJS_ framework y TypeScript.

Este proyecto gestiona PDFs y categorías asociadas, utilizando PostgreSQL como base de datos y Docker para contenedores.

## **Configuración del Entorno (.env)** 
Para que el sistema funcione, se debe crear un archivo .env en la raíz basado en el archivo .env.example.

### Configuración inicial 

- Copie el archivo de ejemplo: cp .env.example .env

- Edite el archivo .env recién creado y complete las variables DB_PASSWORD y JWT_SECRET.

- Asegúrese de que el puerto definido en PORT_EXTERNAL esté libre en el servidor.

## **Despliegue con Docker**
### Instrucciones para levantar el entorno completo (API + Base de Datos).
docker-compose up -d --build

docker-compose logs -f backend
## **Arquitectura y Módulos**
Este sistema esta organizado en 5 modulos, algunos independientes y otros dependientes entre si, para que el codigo pueda ser facil de mantener y escalable. 

### Modulos principales:
- **Auth**
> El encargado de autenticar usuarios y gestionar los tokens del sistema.
- **Category**
> Aqui se encuentra el archivo de las categorias que va a tener el sistema.
- **File**
> Este modulo maneja los archivos que se agregan al sistema, directamente relacionado con el modulo de categorias ya que no puede existir un archivo sin una categoria asociada.
- **Storage**
> El encargado de administrar donde se guardan los archivos.
- **User**
> Este modulo tiene la finalidad de gestionar los usuarios que se crean.
- **App**
> El modulo principal donde se maneja la conexion a la base de datos y el arranque del sistema.

### Capas de aplicacion:
- **Controller**
> Esta es la cara visible del proyecto, siendo con quien se comunica el frontend. Es el encargado de recibir peticiones, llamar al servicio y responder.
- **Service**
> Aqui sucede la logica del negocio, en donde se manipulan los datos que se mueven. En esta instancia se manejan los archivos, categorias y usuarios que van a interactuar en el sistema.
- **Entities**
> Las entidades que se van a crear en las bases de datos se definen acá, cada una con sus condiguraciones internas.


<!-- ## Documentación de la API (Swagger)
Una vez levantado el servidor, la documentación interactiva está disponible en:http://localhost:[PUERTO]/docs
 
Aquí se detallan los endpoints, los DTOs de entrada y las respuestas esperadas. -->
## **Seguridad**
Se han implementado múltiples capas de seguridad para garantizar la integridad de la información:

- **Autenticación**
>Gestión de sesiones mediante JWT (JSON Web Tokens) con expiración configurable.

- **Encriptación** 
>Uso de Bcrypt para el hasheo de contraseñas de usuarios antes de su persistencia en la base de datos.

- **Protección de Rutas**
>Implementación de Guards y estrategias de Passport para restringir el acceso a endpoints sensibles.

- **Validación**
>Uso de ValidationPipe global para asegurar que los datos de entrada cumplan con los formatos esperados, evitando datos malformados.

- **CORS** 
>Configuración estricta de orígenes permitidos para limitar el acceso solo desde el frontend oficial.
