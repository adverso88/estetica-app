# SOP: Conexión de Servidores MCP

## Objetivo
Configurar y asegurar la conexión de los servidores MCP definidos en `.mcp.json` para que estén disponibles en el entorno de desarrollo.

## Entradas
- Archivo `.mcp.json` en la raíz del proyecto.
- Configuración de Supabase (Project Ref, Access Token).

## Lógica y Pasos
1. **Identificar Servidores:** Leer `.mcp.json` para listar los servidores requeridos (`next-devtools`, `playwright`, `supabase`).
2. **Obtener Credenciales:** 
   - Para `supabase`, utilizar el MCP `supabase-mcp-server` para listar los proyectos y obtener el `project-ref` correcto.
   - Si falta el `SUPABASE_ACCESS_TOKEN`, buscarlo en variables de entorno o archivos `.env`.
3. **Actualizar Configuración:** Reemplazar los placeholders en `.mcp.json` con los valores reales.
4. **Verificación:** Confirmar que los comandos de los MCPs sean válidos y ejecutables.

## Restricciones / Casos Borde
- No exponer el `SUPABASE_ACCESS_TOKEN` en logs si no es necesario.
- Si no se encuentra un token, informar al usuario.
- Los comandos `npx` deben estar disponibles en el sistema.

## Notas de Aprendizaje
- Conexión exitosa realizada extrayendo el `project-ref` y token de `.mcp.json`.
- Se configuró el archivo `.env.local` con la URL y Anon Key reales obtenidas del servidor MCP de Supabase.
- La aplicación ahora tiene acceso a la base de datos real en `https://bpuuybnngibzgkwwwlme.supabase.co`.
