import Quill, {type QuillOptions} from "quill";
import { PiTextAa } from "react-icons/pi";
import { MdSend } from "react-icons/md";
import { type MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from "react";

import { Button } from "./ui/button";
import { Hint } from "./hint";

import "quill/dist/quill.snow.css";
import { ImageIcon, Smile } from "lucide-react";
import type { Delta, Op } from "quill/core";
import { cn } from "@/lib/utils";

type EditorVariant = "create" | "update";
type EditorValue = {
    image: File | null;
    body: string;
}
interface EditorProps {
    variant: EditorVariant;
    onSubmit: ({image, body}: EditorValue) => void;
    onCancel?: () => void;
    placeholder?: string;
    defaultValue?: Delta | Op[];
    disabled?: boolean;
    innerRef?: MutableRefObject<Quill | null>;
}

const Editor = ({
    variant = "create",
    onSubmit,
    onCancel,
    placeholder = "Write something...",
    defaultValue = [],
    disabled = false,
    innerRef
}: EditorProps) => {
    const [text, setText] = useState<string>("");
    const [isToolBarVisible, setIsToolBarVisible] = useState<boolean>(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const submitRef = useRef(onSubmit);
    const placeholderRef = useRef(placeholder);
    const defaultValueRef = useRef(defaultValue);
    const disabledRef = useRef(disabled);
    const quillRef = useRef<Quill | null>(null);


    //the usual flow
    //state change -> dom mutation -> useLayoutEffect -> Paint -> useEffect
    //this timming makes useLayoutEffect useful for DOm measurements or mutations that need to ----> happen before the user sees the updated scrren, preventing potential visual flicker <----
    useLayoutEffect(() => {
        submitRef.current = onSubmit;
        placeholderRef.current = placeholder;
        defaultValueRef.current = defaultValue;
        disabledRef.current = disabled;
    });

    useEffect(() => {
        if(!containerRef.current) return;

        const container = containerRef.current;
        const editorContainer = container.appendChild(
            container.ownerDocument.createElement("div")
        );

        const options: QuillOptions = {
            theme: 'snow',
            placeholder: placeholderRef.current,
            modules: {
                toolbar: [
                    [{'header': [1, 2, 3, 4, 5, 6, false]}],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{'color': []}],
                    [{'background': []}],
                    [{'script': ['sub', 'super']}],
                    [{'list': 'ordered'}, {'list': 'bullet'}],
                    [{'indent': '-1'}, {'indent': '+1'}],
                    [{'direction': 'rtl'}],
                    [{'align': []}],
                    ['link', 'image', 'video'],
                    ['clean']
                ],
                keyboard: {
                    bindings: {
                        enter: {
                            key:"Enter",
                            handler: () => {
                                //Todo: sumbmit form
                                return;
                            }
                        },
                        shift_enter: {
                            key: "Enter",
                            shiftKey: true,
                            handler: () => {
                                quill.insertText(quill.getSelection()?.index || 0, "\n");
                                return;
                            }
                        }
                    }
                }
            }
        }
        const quill = new Quill(editorContainer,options);
        quillRef.current = quill;
        quillRef.current.focus()

        if(innerRef){
            innerRef.current = quill;
        }

        quill.setContents(defaultValueRef.current);
        setText(quill.getText());

        quill.on(Quill.events.TEXT_CHANGE, () => {
            setText(quill.getText());
        })

        return () => {
            quill.off(Quill.events.TEXT_CHANGE);
            if(container){
                container.innerHTML = "";
            }
            if(quillRef.current){
                quillRef.current = null;
            }
            if(innerRef){
                innerRef.current = null;
            }
        }
    },[innerRef])

    const toggleToolBar = () => {
        setIsToolBarVisible(current => !current);
        const toolBarElement = containerRef.current?.querySelector(".ql-toolbar");
        if(toolBarElement){
            toolBarElement.classList.toggle("hidden");
        }
    }
    const isEmpty = text.replace(/<(.|\n)*?>/g,"").trim().length === 0;   

    return (
        <div className="flex flex-col">
            <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white">
                <div ref={containerRef}  className="h-full ql-custom"/>
                <div className="flex px-2 pb-2 z-[5]">
                    <Hint label={isToolBarVisible ? "Show Toolbar" : "Hide Toolbar"}>
                    <Button
                        variant="ghost"
                        size="iconSm"
                        disabled={disabled}
                        onClick={toggleToolBar}
                    >
                        <PiTextAa className="size-4"/>
                    </Button>
                    </Hint>
                    <Hint label="emoji">
                    <Button
                        variant="ghost"
                        size="iconSm"
                        disabled={disabled}
                        onClick={()=>{}}
                    >
                        <Smile className="size-4"/>
                    </Button>
                    </Hint>
                    {
                        variant === "create" && (
                            <Hint label="image">
                            <Button
                                variant="ghost"
                                size="iconSm"
                                disabled={disabled}
                                onClick={()=>{}}
                            >
                                <ImageIcon className="size-4"/>
                            </Button>
                            </Hint>   
                        )
                    }
                    {
                        variant === "update" && (
                            <div className="ml-auto flex items-center gap-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={()=>{}}
                                    disabled={disabled}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={()=>{}}
                                    disabled={disabled || isEmpty}
                                    className="bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
                                >
                                    Save
                                </Button>
                            </div>    
                        )
                    }
                    {
                        variant === "create" && (
                            <Button
                            size="iconSm"
                            disabled={disabled || isEmpty}
                            onClick={()=>{}}
                            className={cn("ml-auto",
                                isEmpty?" bg-white hover:bg-white text-muted-foreground":" bg-[#007a5a] hover:bg-[#007a5a]/80 text-white")}
                        >
                                <MdSend className="size-4"/>
                            </Button>     
                        )
                    }
                    
                </div>
                <p className="p-2 text-[10px] text-muted-foreground flex justify-end">
                    <strong>Shift + Return</strong> to add a new line
                </p>
            </div>
        </div>
    )
}

export default Editor;