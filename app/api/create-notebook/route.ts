import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { uploadFileToFirebase } from "@/lib/firebase";
import { generateImage, generateImagePrompt } from "@/lib/openai";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    try{
        const {userId}=auth();
        if(!userId){
            return new NextResponse(
                "Unauthorized Access",
                {status:401}
            )
        }
    
        const body = await req.json();
        const {name}=body;
        const image_description=await generateImagePrompt(name);
        if(!image_description){
            return new NextResponse(
                "Failed to generate image description",
                {status:500}
            );
        }
        const image_url = await generateImage(image_description);
        if(!image_url){
            return new NextResponse(
                "Failed to generate image",
                {status:500}
            )
        }
    
        const firebaseUrl = await uploadFileToFirebase(image_url,image_description);
    
        const note_ids = await db
                            .insert($notes)
                            .values({
                                name,
                                userId,
                                imageUrl:firebaseUrl
                            })
                            .returning({
                                insertedId:$notes.id
                            });
    
        return NextResponse.json({
            note_id:note_ids[0].insertedId
        });
    }catch(error){
        console.log('[ERROR_CREATING_A_NEW_NOTEBOOK]: ',error);
        return new NextResponse("Server Error",{status:500})
    }
}