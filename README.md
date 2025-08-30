# NestJS microservices booking system

`ReservationsRepository extends AbstractRepository<ReservationDocument>`

Add GlobalPipes to add class validators to DTOs

Add class transformers to transform the received JSON value to Date in our DTOs

`LocalStrategy` from passport library to protect with the `LocalAuthGuard` the `/auth/login` route, this `LocalStrategy` implements the **validate method**

`JwtStrategy` for `JwtAuthGuard` in GET `/users` -> extracts the `UserDocument` from the JWT

**Microservices communication** reservations -> auth: The `reservations.module` imports the microservice ClientsModule to connect to **auth microservice** with TCP transport, which is exposed in `auth/src/main.ts`. auth.controller uses the `@MessagePattern` decorator to the define a listening route for RPC calls, named `'authenticate'`. Common `JwtAuthGuard` that decorates the routes of the `reservations.controller` performs RPC call to the auth microservice using the TCP transport and returns the user data in the request object to the reservations service.

Payments microservice listens `@MessagePattern` at `create_charge`

Reservations microservice calls the payments.controller which in turn calls the Stripe API
