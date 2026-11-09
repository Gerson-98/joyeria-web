# Joyería — página web

Sitio estático (HTML, CSS y JS, sin compilación) de alta joyería. Todos los botones
abren WhatsApp con un mensaje ya escrito según la pieza.

## Cambiar los datos del cliente
Edita solo `js/config.js`: nombre del negocio, número de WhatsApp (con código de país,
sin signos, ej. `50255550000`), teléfono visible y dirección.

> El número actual es **de ejemplo**.

## Fotos
Fotos de joyas con licencia abierta (CC BY / dominio público) vía Openverse; los créditos
están en `CREDITOS.md`. Para un resultado aún más premium, reemplaza los archivos de `img/`
por fotos propias del cliente con los mismos nombres.

## Probar
```bash
npx --yes serve -l 3031
```
