Carpetas para audios estáticos de narración.

Estructura esperada:

- /public/audio/meditacion/
- /public/audio/podcast/
- /public/audio/masterclass/
- /public/audio/voz/

Formatos soportados por el reproductor:

- .mp3 (recomendado)
- .m4a
- .wav
- .ogg

Nota:
Los nombres de archivo deben seguir el esquema definido en código
para cada contenido (slug en minúsculas con guiones bajos).

Fallback global (opcional):

Si no existe audio específico por contenido, la app intentará una voz
global en /public/audio/voz/ con alguno de estos nombres:

- mi_voz
- mi_voz_base
- voz_base
- voz_principal
- narradora
- luisa_narradora
