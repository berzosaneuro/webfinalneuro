# Cómo añadir música a las meditaciones

Los archivos MP3 deben estar en `public/` y en el repositorio para que funcionen en local Y en Vercel.

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

## Paso 3 (Vercel): Asegúrate de que están en git

Para que la música suene en la web desplegada:

1. Coloca los MP3 en `public/` (como en el Paso 2)
2. En la terminal: `git add public/*.mp3` y `git commit -m "Añadir música"` y `git push`
3. Vercel volverá a desplegar y ya tendrás la música online

Si los archivos no están en el repo, Vercel no los incluye y solo sonará la música sintética de fallback.

---

## ¿Qué hace la app?

Cada vez que inicies una meditación, la app elige **al azar** una de las 5 canciones. Así no suena siempre la misma.
