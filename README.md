# NestJS microservices booking system

`ReservationsRepository extends AbstractRepository<ReservationDocument>`

Add GlobalPipes to add class validators to DTOs

Add class transformers to transform the received JSON value to Date in our DTOs

`LocalStrategy` from passport library to protect with the `LocalAuthGuard` the `/auth/login` route, this `LocalStrategy` implements the **validate method**

`JwtStrategy` for `JwtAuthGuard` in GET `/users` -> extracts the `UserDocument` from the JWT
