import { AUTH_SERVICE } from "@app/common"
import { UnauthorizedException } from "@nestjs/common"
import { ClientProxy } from "@nestjs/microservices"
import { app } from "./app"
import { lastValueFrom } from "rxjs"

// function called everytime each request is sent to GRAPHQL to extract JWT
export const authContext = async ({req}) => {
  console.log('authContext')
  try {
    // get the app object, get the AUTH_SERVICE which is setup in the gateway.module.ts
    const authClient = app.get<ClientProxy>(AUTH_SERVICE);
    // auth.controller returns the user
    const user = await lastValueFrom(  // transforms an Observable into a Promise
      authClient.send('authenticate', {
        Authentication: req.headers?.authentication,
      })  // reaches the auth controller 'authenticate' route 
    );
    console.log(user)
    return { user }
  }
  catch (err) {
    throw new UnauthorizedException(err)
  }
}