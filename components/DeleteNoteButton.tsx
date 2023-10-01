"use client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";


type DeleteNoteButtonProps = {
    noteId:number;
}


export default function DeleteNoteButton({noteId}:DeleteNoteButtonProps){


    const { toast } = useToast();
    const router = useRouter();
    const deleteNote = useMutation({
        mutationFn:async ()=>{
            const response = await axios.post('/api/delete-note',{
                noteId
            });
            return response.data;
        },
        onError:()=>{
            toast({
                variant:"destructive",
                title:"Error while deleting the note",
                description:"there was an error while deleting the note, please try again later."
            })
        },
        onSuccess:()=>{
            toast({
                title:"Success!",
                description:"Successfully deleted the note."
            })
            router.push("/dashboard");
        }
    })

    return (
        <Button
            variant={"destructive"}
            size={"sm"}
            disabled={deleteNote.isLoading}
            onClick={()=>{
                const confirm = window.confirm("Are you sure you wanna delete this note?")
                if(!confirm) return;
                deleteNote.mutate(undefined);
            }}
        >
            <Trash className="w-4 h-4"/>
        </Button>
    )
}