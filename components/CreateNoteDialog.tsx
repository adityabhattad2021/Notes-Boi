"use client";
import { Axis3DIcon, Plus, Router } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { FormEvent, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";

export default function CreateNoteDialog(){

    const [input,setInput]=useState("");
    const { toast } = useToast();
    const router = useRouter();

    const createNotebook = useMutation({
        mutationFn:async ()=>{
            const response = await axios.post("/api/create-notebook",{
                name:input
            })
            return response.data;
        },
        onError:(error)=>{
            console.log('[CREATE_NOTEBOOK_CLIENT_ERROR]: ',error);
            toast({
                variant:"destructive",
                title:"Error while creating new notebook",
                description:"there was an error while creating a new notebook, please try again later"
            })
        },
        onSuccess:({note_id})=>{
            toast({
                title:"Successfully created a new notebook",
                description:`New notebook with title: ${input} successfully created!`
            })
            router.push(`/notebook/${note_id}`)
        }
    })

    function handleSubmit(e:FormEvent){
        e.preventDefault();
        if(input===""){
            window.alert("Please enter a name for your notebook");
        }
        createNotebook.mutate(undefined);
    }

    return (
        <Dialog>
            <DialogTrigger>
                <div className="border-dashed border-2 flex border-green-600 h-full rounded-lg items-center justify-center sm:flex-col hover:shadow-xl transition hover:-translate-y-1 flex-row p-4">
                    <Plus
                        className="w-6 h-6 text-green-600"
                        strokeWidth={3}
                    />
                    <h2 className="font-semibold text-green-600 sm:mt-2">
                        New Note Book
                    </h2>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        New Note Book
                    </DialogTitle>
                    <DialogDescription>
                        You can create a new note by clicking below.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <Input
                        value={input}
                        onChange={(e)=>setInput(e.target.value)}
                        placeholder="name..."
                    />
                    <div className="h-4">
                    </div>
                    <div className="flex items-center justify-center gap-2 w-full">
                        <Button type="reset" variant={"secondary"}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-green-600"
                            
                        >
                            Create
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}