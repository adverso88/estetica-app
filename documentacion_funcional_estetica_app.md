# 📄 Especificaciones Técnicas y Funcionales: EstéticaApp MVP
## La Solución Integral para Clínicas Estéticas de Alto Nivel

Este documento detalla todas las funcionalidades activas en la aplicación. Úsalo como apoyo para explicar los alcances reales del sistema a los clientes.

---

### 1. Panel de Control Inteligente (Dashboard)
El centro de mando de la clínica, diseñado para la toma de decisiones basada en datos.
*   **Métrica WOW "Dinero Perdido":** Cálculo automático de ingresos no percibidos por citas no asistidas (no-shows).
*   **Resumen de Agenda:** Vista rápida de las citas del día y estados de confirmación.
*   **Motor de WhatsApp:** Estadísticas de confirmación automática (mensajes enviados vs. confirmados).
*   **Visualización de Ingresos:** Gráficos simples de rentabilidad mensual.

### 2. Gestión Avanzada de Pacientes (CRM Médico)
Más que una lista de contactos, es un expediente clínico completo.
*   **Ficha Clínica 360°:** Datos personales, tipo de piel (Escala Fitzpatrick), alergias y antecedentes médicos.
*   **Historia Clínica Evolutiva:** Línea de tiempo detallada de cada intervención realizada.
*   **Trazabilidad Médica Estricta:** Campos obligatorios para **Nombre del Producto, Lote/Batch y Unidades Usadas**.
*   **Mapa de Zonas:** Registro de zonas tratadas (ej. frente, surcos nasogenianos, labios).
*   **Galería de Fotos:** Comparativa de "Antes y Después" vinculadas a cada sesión.

### 3. Módulo de Consentimiento Informado (Legal & Digital)
Blindaje legal y eliminación total del papel.
*   **Firma Digital Integrada:** Pad de firma táctil para que el paciente firme directamente en la tablet/móvil.
*   **Seguridad y Validación:** Registro de dirección IP y marca de tiempo (timestamp) en cada firma.
*   **Generación de Documentos:** Creación automática de consentimientos vinculados al procedimiento realizado.
*   **Estado de Seguridad:** Indicadores visuales en la ficha del paciente sobre si tiene consentimientos pendientes o firmados.

### 4. Agenda y Gestión de Citas
Optimización del tiempo de los profesionales.
*   **Navegación Intuitiva:** Vista diaria y semanal con código de colores por estado de cita.
*   **Estados de Cita Reales:** *Agendada, Confirmada, En Sala, Completada, No-Show y Cancelada*.
*   **Gestión de Profesionales:** Asignación de citas según la especialidad y disponibilidad del médico.

### 5. Configuración y Administración (Backoffice)
Control total sobre el negocio.
*   **Gestión de Tarifas:** Configuración de precios base por tratamiento y honorarios por profesional.
*   **Control de Roles:** Niveles de acceso diferenciados para *Administradores, Profesionales (Médicos) y Staff de Recepción*.
*   **Personalización de Servicios:** Creación de catálogo de tratamientos con duraciones y precios personalizados.

---

### 🛡️ Seguridad y Tecnología
*   **Cloud Hosting:** Alojado en infraestructura de alta disponibilidad (Vercel + Supabase).
*   **Privacidad:** Cifrado de datos de pacientes y cumplimiento de estándares de seguridad digital.
*   **Acceso Multiplataforma:** Funciona perfectamente en PC, Mac, tablets y smartphones.

---

### 💡 Próximas Actualizaciones (Roadmap)
*   *Módulo de Inventario Automático (descontar unidades al aplicar).*
*   *Seguimientos post-tratamiento por WhatsApp.*
*   *Pasarela de pagos para reserva de citas.*
