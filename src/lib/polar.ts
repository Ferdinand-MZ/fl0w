import {Polar} from "@polar-sh/sdk";

console.log("TOKEN:", process.env.POLAR_ACCESS_TOKEN);

export const polarClient = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN,
    // server: process.env.NODE_ENV !== "production" ? "sandbox" : "production", // TO DO : change in production
    server: "production", // 🔥 paksa production
    // server: "sandbox", // TO DO : change in production
});