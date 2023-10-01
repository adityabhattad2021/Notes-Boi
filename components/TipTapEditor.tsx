"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import TipTapMenuBar from "./TipTapMenubar";
import { StarterKit } from "@tiptap/starter-kit";
import { useRef, useState } from "react";
import { NoteType } from "@/lib/db/schema";
import { Button } from "./ui/button";

type TipTapEditorProps = { note: NoteType };

export default function TipTapEditor({note}:TipTapEditorProps){

    const [editorState,setEditorState]=useState(
        note.editorState || `<h1>${note.name}</h1>`
    );

    const editor = useEditor({
        autofocus:true,
        extensions:[StarterKit],
        content:"hello",
        onUpdate:({editor})=>{
            setEditorState(editor.getHTML());
        }
    })

    const lastCompletion = useRef("")


    return (
        <>
            <div className="flex">
                {editor && <TipTapMenuBar editor={editor}/>}
                <Button className="ml-auto" disabled variant={"outline"}>
                    Saved.
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
                Shift + A
                for AI autocomplete
            </span>
        </>
    )
}