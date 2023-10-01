"use client";
import Typewriter from "typewriter-effect";

type TypewriterProps = {

}

export default function TypewriterTitle({}:TypewriterProps){
    return (
        <Typewriter
            options={{
                loop:true,
            }}
            onInit={(typewriter)=>{
                typewriter
                .typeString("Supercharged Productivity.")
                .pauseFor(1000)
                .deleteAll()
                .typeString("AI-Powered Insights.")
                .start();
            }}
        />
    )
}