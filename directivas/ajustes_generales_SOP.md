# 📋 SOP: Ajustes Generales y Corrección de Errores V1

## 🎯 Objetivos
Implementar mejoras de UI, corregir bugs críticos de registro y expandir funcionalidades de gestión financiera y roles.

---

## 🛠️ Fases de Ejecución

### Fase 1: Ajustes de UI y Depuración de Registro (Quick Wins)
- Cambiar labels de "Fuente de captación" en formularios y tablas.
- Investigar bug de fuente de paciente (Referido -> Facebook).
- Arreglar creación de profesionales.

### Fase 2: Perfiles de Administración y Seguridad
- Definir roles en la base de datos (enum o tabla de roles).
- Implementar lógica en el middleware o hooks de auth para diferenciar Master/CEO de Administrador.
- Restringir acceso al dashboard financiero para el perfil Administrador.

### Fase 3: Dashboard Financiero y Pagos
- Añadir métricas de "Dinero Recolectado" y "Dinero Pendiente".
- Actualizar el catálogo de métodos de pago (Efectivo, Tarjeta, etc.).

### Fase 4: Consentimientos y WhatsApp IA (Complejidad Alta)
- Debug de visualización de consentimientos firmados.
- Diseño e implementación inicial del confirmador de citas vía WhatsApp con IA.

---

## 🔍 Mapeo de Archivos Clave
- `src/features/patients/components/*`: Formularios de pacientes.
- `src/features/professionals/components/*`: Gestión de profesionales.
- `src/app/(main)/admin/analytics/page.tsx`: Dashboard de números.
- `src/features/appointments/components/*`: Confirmaciones y estados de cita.
- `src/features/consents/components/*`: Visualización de consentimientos.

---

## ⚠️ Restricciones y Aprendizajes
- **RLS**: Cualquier cambio en roles debe reflejarse en las políticas de Supabase.
- **WhatsApp**: La integración con IA requiere un flujo de webhook y procesamiento de lenguaje natural (usar prompts específicos).
