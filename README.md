## @payment-Transations ms
* The @payment-Transations ms is responsible for creating and managing sellers and buyers @payment-Transationss.
* In this service, events are only `published` to other mss.
* Server side errors from the payment-Transations ms is sent to `elasticsearch` and can be viewed on `kibana`.
* payment-Transations service uses these tools as the main tools
  * `Your shared library`
  * `NodeJS`
  * `Express`
  * `Typescript`
  * `Rabbitmq`
  * `Elasticsearch`
  * `Postgresql database`
  * `NodeJS pg`
  * `Json web token`
  * `SocketIO`
* There are other packages that are used.
* You can update the version of `NodeJS` used inside the `Dockerfile` and `Dockerfile.dev`.

PASOS DE INSTALACION

1. npm install @miges-libertad/library-shared@0.0.6  (se instalada todas la dev junto con mi libreria )
2. levantar la imagen docker [docker compose up -d postgres]

3. npm run dev

git config user.name "flowercordoba"
git config user.email "flowercordoba7@gmail.com"

