# Cómo añadir música a las meditaciones

Tienes 5 archivos descargados. Haz lo siguiente:

## Paso 1: Renombrar los archivos

Renombra cada MP3 descargado así (en este orden):

| El que descargaste        | Renómbralo a    |
|---------------------------|-----------------|
| 1. Meditación 432 Hz      | `ambient1.mp3`  |
| 2. Calma + olas del mar   | `ambient2.mp3`  |
| 3. Synth pad cálido       | `ambient3.mp3`  |
| 4. Piano + synth          | `ambient4.mp3`  |
| 5. Homage (Kjartan Abel)  | `ambient5.mp3`  |

## Paso 2: Mover a la carpeta `public`

Copia los 5 archivos dentro de la carpeta:

```
public/
```

(La carpeta donde están `manifest.json`, `sw.js`, `icons`, etc.)

## Resultado

Deberías tener:
```
public/
  ambient1.mp3
  ambient2.mp3
  ambient3.mp3
  ambient4.mp3
  ambient5.mp3
  ...
```

## ¿Qué hace la app?

Cada vez que inicies una meditación, la app elige **al azar** una de las 5 canciones. Así no suena siempre la misma.
