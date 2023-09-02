# GuessTheDraw2

## Descripción

Este archivo pretende ser el una mini guía de como ejecutar el proyecto en tu propia máquina.

## Uso

Lo primero de todo es [descargarse docker](https://www.docker.com/products/docker-desktop) en caso de que no lo tengamos instalado.

Luego es necesario saber la dirección IP de nuestro equipo. En estos casos podemos utilizar páginas web como por ejemplo http://vermiip.es/

También debemos tener el puerto 80 abierto para acceder al sitio web, en caso de estar utilizado se puede cambiar a otro puerto más adelante.

Una vez sabemos nuestra IP debemos cambiarla para que se conecte el frontend con el backend.

Primero tenemos que ir a [/frontend/src/enviroments/enviroment.ts](https://github.com/preytor/GuessTheDraw2/blob/main/frontend/src/environments/environment.ts) y cambiar la dirección ip por la propia.

Entonces cogemos los siguientes datos:
```
  apiUrl: 'http://XX.XXX.XX.XXX:3000',
  socketUrl: 'ws://XX.XXX.XX.XXX:3000'
```
y los cambiamos por: (asumiendo que nuestra ip sea 1.2.3.4)

```
  apiUrl: 'http://1.2.3.4:3000',
  socketUrl: 'ws://1.2.3.4:3000'
```

Una vez realizado esto nos dirigimos a la ruta [/docker/docker-compose.yml](https://github.com/preytor/GuessTheDraw2/blob/main/docker/docker-compose.yml) y modificamos los siguientes valores

```
HOST_ORIGIN=XX.XXX.XX.XXX:80:4200
```

y los cambiamos por: (asumiendo que nuestra ip sea 1.2.3.4)

```
HOST_ORIGIN=1.2.3.4:80:4200
```

Si quieremos cambiar el puerto vamos a:

```
  ports: 
    - "80:4200"
```

y cambiamos el 80 por el que queramos, en este caso lo cambiamos por el puerto 1234

```
  ports: 
    - "1234:4200"
```

(Nota: es posible que si en ambos pones "localhost" funcione solo en local, pero no está comprobado)

Una vez realizado esto abrimos una consola (si se utiliza windows se usa cmd) y nos movemos hacia el directorio donde se encuentre el docker-compose.yml que acabamos de modificar.

Una vez estemos ahí solo hay que ejecutar el siguiente comando:

```bash
docker-compose up
```

En caso de querer ejecutar el servidor en modo produccion ejecutamos el siguiente comando:
```bash	
docker-compose -f docker-compose.prod.yml up --build
```

Y listo, el servidor debería descargarse todo lo necesario para que empiece a funcionar. Para acceder a el solo hace falta ir a la url que sea ip:puerto y ya funcionaría.