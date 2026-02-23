# 📋 DIRECTIVA: App de Gestión para Clínicas Estéticas
### Para usar en Google Antigravity (IDE agéntico de Google)

---

## 🎯 Contexto del Proyecto

Construir una aplicación web SaaS de gestión integral para clínicas estéticas y médico-estéticas pequeñas y medianas. El objetivo es vender el desarrollo a clínicas que hoy gestionan sus operaciones con WhatsApp, Excel, papel y múltiples herramientas desconectadas.

**Stack sugerido:** Next.js 14 (App Router) + Supabase + Tailwind CSS + shadcn/ui  
**Deploy:** Vercel  
**Modelo de negocio:** SaaS mensual por clínica ($49–$149 USD/mes)

---

## 🔍 Contexto Competitivo (Investigado)

Los competidores globales (AestheticsPro, Pabau, Clinicminds, Aesthetic Record, Zenoti) tienen estos problemas comunes que representan **tu ventaja**:

| Problema del competidor | Tu oportunidad |
|---|---|
| Precios altos ($200–$500/mes) | Precio accesible para LATAM |
| Interfaz compleja, curva de aprendizaje alta | UI simple, en español nativo |
| Sin integración real con WhatsApp | Notificaciones por WhatsApp API |
| No adaptados a regulaciones LATAM | Consentimientos según normativa local |
| Sin soporte en español | Soporte en español |
| Muchas funciones innecesarias para clínicas pequeñas | MVP enfocado en los 5 dolores reales |

---

## 💊 Los 5 Dolores Severos a Resolver (priorizados)

1. **No-shows y cancelaciones** → pérdida de $500–$2,000/día visible y cuantificable
2. **Sin historial clínico digital** → riesgo médico-legal y pérdida de contexto por paciente
3. **Consentimientos en papel** → riesgo legal, difíciles de ubicar, imposibles de auditar
4. **Seguimiento post-tratamiento inexistente** → pérdida de recompra y fidelización
5. **Sin métricas del negocio** → el dueño no sabe qué tratamientos son más rentables

---

## 🏗️ Arquitectura de la App

```
/app
  /dashboard          → Resumen del día
  /agenda             → Calendario y citas
  /pacientes          → Fichas y historial
  /consentimientos    → Firma digital
  /seguimientos       → Post-tratamiento
  /reportes           → Métricas del negocio
  /configuracion      → Clínica, profesionales, tratamientos
/api
  /webhooks/whatsapp  → Recibir confirmaciones
  /notifications      → Envío de recordatorios
  /auth               → Supabase Auth
```

---

## 📐 MÓDULOS DETALLADOS

---

### MÓDULO 1: Dashboard del Día
**Objetivo:** Que el dueño/recepcionista vea en 10 segundos el estado del día.

**Componentes a construir:**
- Tarjetas de métricas: citas del día / confirmadas / pendientes / no-shows acumulados del mes
- Lista de citas del día (hora, paciente, profesional, tratamiento, estado)
- Alerta si hay citas sin confirmar con menos de 3 horas de anticipación
- Ingresos proyectados del día vs realizados
- Acceso rápido a "nueva cita" y "registrar llegada"

**Lógica especial:**
- Calcular costo estimado de no-shows del mes (# no-shows × precio promedio tratamiento)
- Mostrar ese número en rojo como "dinero perdido" para generar urgencia en el uso

---

### MÓDULO 2: Agenda y Gestión de Citas
**Objetivo:** Reemplazar completamente el WhatsApp y las hojas de Excel.

**Componentes:**
- Vista de calendario semanal por profesional (similar a Google Calendar)
- Vista de sala/box (quién ocupa cada espacio a cada hora)
- Formulario de nueva cita: paciente, profesional, tratamiento, duración, precio, nota
- Estados de cita: Agendada / Confirmada / En sala / Completada / No-show / Cancelada
- Selector de duración automático según el tratamiento
- Bloqueo de disponibilidad (vacaciones, almuerzo, etc.)

**Sistema de recordatorios automáticos:**
- T-24h: Recordatorio por WhatsApp/SMS ("Tu cita es mañana a las 3pm. ¿Confirmas?")
- T-2h: Recordatorio final
- Respuestas automáticas: Si el paciente responde "1" confirma, "2" cancela y libera el slot
- Si cancela, notificación inmediata al staff y opción de agendar desde lista de espera

**Diferenciador vs competencia:** Integración con WhatsApp Business API (Twilio o Meta API directa), no solo email/SMS. En LATAM WhatsApp es el canal real.

**Lista de espera:**
- Al registrar cancelación, mostrar pacientes en lista de espera para ese tratamiento
- Botón "Notificar disponibilidad" que envía WhatsApp a los primeros 3 de la lista

---

### MÓDULO 3: Ficha del Paciente e Historial Clínico
**Objetivo:** El profesional sabe exactamente qué le hicieron al paciente, cuándo y con qué.

**Ficha del paciente (datos base):**
- Nombre, edad, foto, contacto (WhatsApp vinculado)
- Alergias conocidas, medicamentos actuales, condiciones relevantes
- Tipo de piel (para tratamientos faciales)
- Fuente de captación (Instagram, referido, Google, etc.)
- Fecha primera visita, última visita, total de visitas

**Historial de tratamientos:**
- Cada sesión registra: fecha, profesional, tratamiento, productos usados + lote/batch
- Zonas tratadas (texto o anotación sobre imagen del cuerpo/cara)
- Unidades usadas (crítico para botox: número de unidades por zona)
- Fotos antes/después (subida desde cámara o galería, almacenadas en Supabase Storage)
- Notas clínicas del profesional
- Próxima cita recomendada (genera seguimiento automático)

**Diferenciador vs competencia:** Registro de número de lote de productos (botox, ácido hialurónico). Crítico para alertas de retiro de producto o reacciones adversas. Pocos sistemas lo hacen bien.

**Timeline visual:**
- Vista cronológica de todos los tratamientos del paciente con miniaturas de fotos
- Permite ver evolución rápidamente

---

### MÓDULO 4: Consentimientos Informados Digitales
**Objetivo:** Eliminar el papel, cumplir con la normativa y protegerse legalmente.

**Flujo completo:**
1. Al agendar cita, se asigna automáticamente el consentimiento del tratamiento
2. 48h antes de la cita, se envía link por WhatsApp al paciente
3. Paciente abre en su teléfono, lee, y firma con el dedo
4. Se almacena PDF firmado con: nombre, fecha, hora, IP, hash de integridad
5. Queda vinculado a la cita y a la ficha del paciente

**Plantillas incluidas (configurables):**
- Consentimiento general para procedimientos estéticos
- Específico para botox/toxina botulínica
- Específico para rellenos dérmicos
- Específico para láser
- Específico para tratamientos corporales
- El dueño puede crear/editar sus propios consentimientos

**Alertas:**
- Si el paciente llega sin haber firmado el consentimiento, el sistema alerta al recepcionista
- El profesional no puede marcar la cita como "Completada" si no hay consentimiento firmado

**Diferenciador:** Los competidores tienen consentimientos pero el flujo de firma previa por WhatsApp no está bien implementado en ninguno. La mayoría firma en tablet al llegar, lo cual toma tiempo y papel.

---

### MÓDULO 5: Seguimientos Post-Tratamiento
**Objetivo:** Convertir pacientes de una sola vez en pacientes recurrentes.

**Lógica de seguimiento:**
- Al completar una cita, el profesional define: "Siguiente revisión en X días/semanas"
- El sistema crea automáticamente una tarea de seguimiento
- En la fecha definida, envía WhatsApp al paciente: "¿Cómo te fue con tu tratamiento? ¿Notaste alguna diferencia?"
- Si el paciente responde positivamente → invitación a agendar próxima sesión
- Si responde con queja o molestia → alerta inmediata al profesional con número de contacto

**Secuencias por tipo de tratamiento (configurables):**
- Botox: seguimiento a 14 días (revisar resultado) + recordatorio de retoque a 4 meses
- Rellenos: seguimiento a 30 días + recordatorio a 9 meses
- Láser: seguimiento a 7 días + próxima sesión a 30 días
- El dueño puede crear sus propias secuencias

**Panel de seguimientos pendientes:**
- Lista de todos los seguimientos del día/semana
- Botón "Enviar seguimiento" o "Marcar como completado"
- Tasa de respuesta por tratamiento

---

### MÓDULO 6: Reportes y Métricas del Negocio
**Objetivo:** Que el dueño tome decisiones con datos, no con intuición.

**Métricas clave:**
- Ingresos totales por período (día/semana/mes/año)
- Ingresos por profesional
- Ingresos por tratamiento (saber qué es lo más rentable)
- Tasa de no-shows (% y costo estimado en dinero)
- Tasa de retención (pacientes que vuelven vs pacientes únicos)
- Tratamientos más populares
- Horas pico de mayor demanda
- Pacientes nuevos vs recurrentes por mes
- Promedio de gasto por paciente

**Reportes exportables:**
- PDF resumido mensual (para reunión de equipo)
- Excel con transacciones del período

**Diferenciador:** Mostrar siempre el "dinero perdido por no-shows" como métrica visible. Es el número que más duele al dueño y que justifica el costo de la suscripción mensual.

---

### MÓDULO 7: Configuración de la Clínica
**Componentes:**
- Datos de la clínica (nombre, logo, dirección, contacto)
- Gestión de profesionales (nombre, especialidad, foto, horarios disponibles)
- Catálogo de tratamientos (nombre, duración, precio, profesionales que lo realizan)
- Salas/boxes disponibles
- Configuración de recordatorios (horarios, mensajes personalizables)
- Configuración de WhatsApp Business (token de integración)
- Multi-sede (para clínicas con más de una sucursal)

---

## 🔔 Sistema de Notificaciones (Detalle Técnico)

**Canal principal: WhatsApp Business API**
- Usar Twilio (más simple) o Meta Cloud API (más barato a escala)
- Templates aprobados por Meta para mensajes proactivos:
  - `recordatorio_cita_24h`
  - `recordatorio_cita_2h`
  - `seguimiento_post_tratamiento`
  - `consentimiento_pendiente`
  - `disponibilidad_slot`

**Canal secundario: Email** (para casos donde no hay WhatsApp)

**Lógica de cron jobs (Supabase Edge Functions o Vercel Cron):**
- Cada hora: revisar citas próximas y disparar recordatorios según reglas
- Cada día: revisar seguimientos pendientes y enviar mensajes

---

## 🗄️ Estructura de Base de Datos (Supabase)

```sql
-- Entidades principales
clinics (id, name, logo, address, whatsapp_config, created_at)
professionals (id, clinic_id, name, specialty, schedule)
treatments (id, clinic_id, name, duration_min, price, professionals[])
patients (id, clinic_id, name, phone, allergies, skin_type, source)

-- Operaciones
appointments (id, clinic_id, patient_id, professional_id, treatment_id, 
              datetime, status, price, notes)
clinical_records (id, appointment_id, patient_id, units_used, 
                  product_name, product_batch, zones, notes)
photos (id, clinical_record_id, type[before|after], url, created_at)

-- Consentimientos
consent_templates (id, clinic_id, name, content, treatment_id)
signed_consents (id, appointment_id, patient_id, template_id, 
                 signed_at, signature_data, pdf_url, ip_address)

-- Seguimientos
follow_up_sequences (id, clinic_id, treatment_id, name, steps[])
follow_ups (id, appointment_id, patient_id, scheduled_date, 
            status, response, sequence_step)

-- Notificaciones
notifications_log (id, patient_id, type, channel, sent_at, 
                   delivered, response)
waiting_list (id, clinic_id, treatment_id, patient_id, 
              created_at, notified)
```

---

## 🎨 Principios de UX/UI

**Filosofía:** Simple como una app de consumo, no como un software médico empresarial.

- Tema claro, colores neutros con un acento (rose/blush para el nicho estético)
- Mobile-first: recepcionista usa tablet o teléfono, no desktop
- Máximo 3 clics para cualquier acción frecuente (registrar llegada, nueva cita)
- Estado visual claro por colores: verde=confirmada, amarillo=pendiente, rojo=no-show, gris=cancelada
- Onboarding guiado de 5 pasos para que la clínica esté operativa en menos de 30 minutos

---

## 📦 MVP Vendible (Fase 1 - 6 semanas)

Prioridad para tener algo que demostrar y vender:

**Semana 1–2:** Auth + configuración de clínica + agenda básica  
**Semana 3:** Fichas de pacientes + historial  
**Semana 4:** Recordatorios por WhatsApp  
**Semana 5:** Consentimientos digitales  
**Semana 6:** Dashboard de métricas + pulido UI

**Dejar para Fase 2:** Seguimientos automáticos, reportes avanzados, multi-sede, facturación

---

## 💰 Argumento de Venta

Cuando presentes a la clínica, muestra este cálculo:

> "Si tienes 2 no-shows por semana a $80 USD cada uno, pierdes $640/mes. Mi app cuesta $79/mes y reduce no-shows en más del 70%. Te paga sola en la primera semana."

---

## 🚀 Instrucción para Antigravity

Usa esta directiva como tu `RULES.md` o documento de contexto en Antigravity. Al iniciar cada agente, referencia este documento. Puedes empezar con este prompt:

```
Tengo una directiva completa de producto en DIRECTIVA.md. 
Lee ese documento y construye el Módulo 2 (Agenda y Gestión de Citas) 
usando Next.js 14 con App Router, Supabase, Tailwind y shadcn/ui.
Empieza por la estructura de base de datos, luego la API, 
luego los componentes de UI. Prueba cada capa antes de pasar a la siguiente.
```

Lanza agentes separados para módulos distintos. Antigravity permite múltiples agentes en paralelo: uno puede construir la agenda mientras otro construye el módulo de pacientes.
