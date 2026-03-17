import {checkout, polar, portal} from "@polar-sh/better-auth";
import {betterAuth} from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/db";
import { polarClient } from "./polar";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        // automatically sign in when register
        autoSignIn: true,
    },
    plugins: [
        polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            use: [
                checkout({
                    products: [
                        {
                            productId: "eb1dc609-bf00-42f7-9981-5bde11603dc7",
                            slug: "pro",
                            
                        }
                    ],
                    successUrl: process.env.POLAR_SUCCESS_URL,
                    authenticatedUsersOnly: true,
                }),
                portal(),
            ]
        })
    ]
})