# 🐟 FISHIQ — Smart Fishing Latam (Piloto Panamá)

> **Aplicación Móvil PWA & Nativa para iPhone (iOS) y Android**  
> Basada íntegramente en las especificaciones de [`FISHIQ_Brief_Tecnico_MVP_v1.docx`](./FISHIQ_Brief_Tecnico_MVP_v1.docx).

---

## 🎯 Principio del MVP
**Predicción biológica y oceanográfica de pesca deportiva, NO navegación marítima.**

FISHIQ combina datos satelitales, batimetría GEBCO, modelos de marea y biología por especie para calcular el **FISHIQ Score (0–100)** determinístico, auditable y explicable, con captura automática de snapshots ambientales en el diario de pesca.

---

## 📱 Pantallas Implementadas (10/10 del Brief)

1. **01 Onboarding**: Propuesta de valor, permisos de ubicación GPS explicados y selección de modalidad de pesca preferida.
2. **02 Home**: Zona actual del Pacífico de Panamá, condiciones en vivo (viento, marea, ola, SST, presión, luna), mejor ventana del día y tarjeta hero del FISHIQ Score.
3. **03 Mapa Inteligente**: Mapa náutico interactivo con curvas batimétricas GEBCO, hotspots calculados y gestión de spots privados por el usuario.
4. **04 Pronóstico Horario**: Evolución 24h a 72h con desglose de los **9 factores determinísticos** y explicación de factores favorables (+) y limitantes (-).
5. **05 Fichas de Especies**: Catálogo de las **8 especies reinas de Panamá** (Róbalo, Jurel Toro, Pargo, Corvina, Dorado, Atún, Wahoo, Sábalo) con rangos de profundidad, temperatura óptima y señuelos recomendados.
6. **06 FISHIQ AI**: Asistente táctico contextual con botones de consulta rápida que responde con datos estructurados y sin alucinaciones.
7. **07 Registrar Captura**: Formulario con foto, peso, talla, técnica y **snapshot ambiental inmutable congelado al instante** (SST, marea, viento, ola, score).
8. **08 Diario de Capturas**: Bitácora personal con estadísticas, récord de peso, filtros por especie y mapa privado exclusivo.
9. **09 Perfil**: Preferencias del capitán, cambio de unidades métricas/imperiales, privacidad estricta de spots y estado de suscripción.
10. **10 Panel de Administración (Web/Móvil)**: Calibración en caliente de los 9 pesos del algoritmo determinístico con recálculo inmediato sin redeploy.

---

## 🧮 Motor Determinístico FISHIQ Score v0.1

$$\text{FISHIQ Score} = \sum_{i=1}^{9} \left( W_i \times S_i \right)$$

| Factor | Peso Inicial | Qué Evalúa |
|---|:---:|---|
| **Marea / Movimiento** | **20%** | Fase (subiendo/bajando/pleamar), cercanía al cambio y amplitud. |
| **Hora / Luz** | **15%** | Amanecer, atardecer, cenit solar y ventana trófica de la especie. |
| **Corriente Marina** | **15%** | Velocidad en nudos vs. rango biológico óptimo. |
| **Temperatura del Agua (SST)** | **15%** | SST satelital (°C) vs. confort metabólico de la especie. |
| **Viento** | **10%** | Velocidad y dirección relativa; efecto sobre la superficie. |
| **Presión Barométrica** | **10%** | Nivel barométrico (hPa) y tendencia en 3 horas. |
| **Oleaje / Swell** | **5%** | Altura significativa y periodo de ola en el Pacífico. |
| **Luna** | **5%** | Fase e iluminación (mareas vivas vs. muertas). |
| **Temporada Regional** | **5%** | Mes calendario vs. pico estacional histórico en Panamá. |

---

## 🚀 Cómo Ejecutar el Proyecto

### 1. Desarrollo Local (Web / PWA)
```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
# Abrir en navegador: http://localhost:5173/
```

### 2. Construcción de Producción
```bash
npm run build
```

### 3. Instalación en iPhone y Android

#### En iPhone (iOS Safari):
1. Abre `http://localhost:5173/` (o tu dominio desplegado) en Safari en tu iPhone.
2. Presiona el botón de **Compartir** (icono con flecha hacia arriba).
3. Selecciona **"Añadir a pantalla de inicio"**.
4. ¡Listo! La app se abre en pantalla completa nativa sin marcos de navegador.

#### En Android (Google Chrome):
1. Abre la URL en Chrome en tu dispositivo Android.
2. Toca el menú de 3 puntos o el banner inferior **"Instalar aplicación"**.
3. Selecciona **"Instalar"**.

#### Compilación Nativa (Xcode / Android Studio vía Capacitor):
```bash
# Agregar plataformas nativas si deseas compilar paquetes de tienda
npx cap add ios
npx cap add android

# Sincronizar el bundle compilado
npm run build
npm run cap:sync

# Abrir en Xcode (para iPhone)
npm run cap:ios

# Abrir en Android Studio (para Android)
npm run cap:android
```

---

## 🔒 Privacidad y Seguridad de Coordenadas
* Todos los spots y capturas guardados por los usuarios tienen el flag `is_private = TRUE` de forma predeterminada.
* Las coordenadas secretas de los pescadores nunca son expuestas públicamente.
