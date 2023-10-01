import { Clerk } from "@clerk/backend";

if(!process.env.CLERK_SECRET_KEY){
    console.log('[CLERK_SERVER]: API Key does not exist.');
    throw new Error('[CLERK_SERVER]: API Key does not exist.')
}

export const clerk = Clerk({
    apiKey:process.env.CLERK_SECRET_KEY!,
})