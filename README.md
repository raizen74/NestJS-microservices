# NestJS microservices booking system

## Microservices

- `auth` (External and Internal)
  - `/users` controller with POST `createUser` and GET `getUser` (retrieves user data)
  - `/auth` controller exposes `/auth/login` implementing `LocalAuthGuard` that returns JWT cookie to the caller
  - Exposes internally `@MessagePattern('authenticate')` which is called by the common `JwtAuthGuard`, used by the `reservations` microservice to protect its public routes
- `payments` (Internal)
  - Exposes the `@MessagePattern('create_charge')` internally to the reservations microservice, which is called before executing the reservation, the `PaymentsService` calls the test **Stripe API** in the `createCharge` method
- `reservations` (External)
  - `/reservations` controller with POST `create` to create a reservation, protected by the common `JwtAuthGuard` Guard which calls the `auth` microservice which in turn implements `jwt.strategy.ts` to protect all routes
  - The `ReservationsService` `create` method calls the `@MessagePattern('create_charge')` TCP listener of the `payments` microservice before persisting the reservation in the `ReservationsRepository`
- `notifications` (Internal)
  - Exposes and **event-pattern** `notify_email` from which the caller **does not wait for a response**, simply **receives an event and doesn't reply**. It doesn't mantain overhead by requiring a request-response channel. The `payments.service` emits an event to this microservice **after executing the Stripe API call**

## Implementation

`ReservationsRepository extends AbstractRepository<ReservationDocument>`

Add GlobalPipes to add class validators to DTOs

Add class transformers to transform the received JSON value to Date in our DTOs

`LocalStrategy` from passport library to protect with the `LocalAuthGuard` the `/auth/login` route, this `LocalStrategy` implements the **validate method**

`JwtStrategy` for `JwtAuthGuard` in GET `/users` -> extracts the `UserDocument` from the JWT

**Microservices communication** reservations -> auth: The `reservations.module` imports the microservice ClientsModule to connect to **auth microservice** with TCP transport, which is exposed in `auth/src/main.ts`. auth.controller uses the `@MessagePattern` decorator to the define a listening route for RPC calls, named `'authenticate'`. Common `JwtAuthGuard` that decorates the routes of the `reservations.controller` performs RPC call to the auth microservice using the TCP transport and returns the user data in the request object to the reservations service.

Payments microservice listens `@MessagePattern` at `create_charge`

Reservations microservice calls the payments.controller which in turn calls the Stripe API and emits an event to the notifications microservice, passing the user email.
