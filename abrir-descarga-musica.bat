@echo off
echo.
echo ============================================
echo   MUSICA PARA MEDITACIONES - Instrucciones
echo ============================================
echo.
echo 1. Se abrira Mixkit en tu navegador.
echo 2. Elige un tema (ej: Relaxation 05).
echo 3. Pulsa "Download Free Music".
echo 4. Renombra el archivo descargado a: ambient.mp3
echo 5. Mueve ambient.mp3 a la carpeta PUBLIC (que se abrira ahora).
echo.
pause
start https://mixkit.co/free-stock-music/mood/meditative/
explorer "%~dp0public"
