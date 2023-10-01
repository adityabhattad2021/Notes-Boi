"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import TipTapMenuBar from "./TipTapMenubar";
import { StarterKit } from "@tiptap/starter-kit";
import { useEffect, useRef, useState } from "react";
import { NoteType } from "@/lib/db/schema";
import { Button } from "./ui/button";
import {useCompletion} from "ai/react"
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Text from "@tiptap/extension-text";
import {useDebounce} from "use-debounce"

type TipTapEditorProps = { note: NoteType };

export default function TipTapEditor({note}:TipTapEditorProps){

    const [editorState,setEditorState]=useState(
        note.editorState || `<h1>${note.name}</h1>`
    );

    const {complete,completion}=useCompletion({
        api:"/api/completion"
    })

    const saveNote = useMutation({
        mutationFn:async()=>{
            const response = await axios.post("/api/save-note",{
                noteId:note.id,
                editorState
            })
            return response.data
        }
    })

    const customText = Text.extend({
        addKeyboardShortcuts(){
            return {
                "Shift-a":()=>{
                    const prompt = this.editor.getText().split(" ").slice(-30).join();
                    complete(prompt)
                    return true;
                }
            }
        }
    })

    const editor = useEditor({
        autofocus:true,
        extensions:[StarterKit,customText],
        content:editorState,
        onUpdate:({editor})=>{
            setEditorState(editor.getHTML());
        }
    })

    const lastCompletion = useRef("");
    useEffect(()=>{
        if(!completion || !editor){
            return
        }
        const diff = completion.slice(lastCompletion.current.length);
        lastCompletion.current = completion;
        editor.commands.insertContent(diff);
    },[completion,editor])

    const [debouncedEditorState] = useDebounce(editorState,10000,{leading:true});
    useEffect(()=>{
        if(!completion||!editor){
            return;
        }
        saveNote.mutate(undefined);
    },[debouncedEditorState])


    return (
        <>
            <div className="flex">
                {editor && <TipTapMenuBar editor={editor}/>}
                <Button className="ml-auto" disabled variant={"outline"}>
                    {saveNote.isLoading ? "Saving...": "Saved"}
                </Button>
            </div>
            <div className="prose prose-sm w-full mt-4">
                <EditorContent
                    editor={editor}
                />
            </div>
            <div className="h-4"></div>
            <span className="text-sm">
                Tip: Press{" "}
                <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 border border-gray-200 rounded-lg">
                    Shift + A
                </kbd>
                for AI autocomplete
            </span>
        </>
    )
}