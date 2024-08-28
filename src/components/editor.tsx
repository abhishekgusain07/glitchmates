import Quill, {type QuillOptions} from "quill";
import { PiTextAa } from "react-icons/pi";
import { MdSend } from "react-icons/md";
import { type MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from "react";

import { Button } from "./ui/button";
import { Hint } from "./hint";
import EmojiPopover from "./emoji-popover";

import "quill/dist/quill.snow.css";
import { ImageIcon, Smile, XIcon } from "lucide-react";
import type { Delta, Op } from "quill/core";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
    const [image, setImage] = useState<File | null>(null);
    const [isToolBarVisible, setIsToolBarVisible] = useState<boolean>(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const submitRef = useRef(onSubmit);
    const placeholderRef = useRef(placeholder);
    const defaultValueRef = useRef(defaultValue);
    const disabledRef = useRef(disabled);
    const quillRef = useRef<Quill | null>(null);
    const imageElementRef = useRef<HTMLInputElement | null>(null);

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
                                const text = quill.getText();
                                const addedImage = imageElementRef.current?.files?.[0] || null;

                                const isEmpty = !addedImage && text.replace(/<(.|\n)*?>/g,"").trim().length === 0;
                                if(isEmpty){
                                    return;
                                }
                                const body = JSON.stringify(quill.getContents());
                                submitRef.current?.({
                                    body,
                                    image: addedImage
                                })
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

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const onEmojiSelect = (emoji: any) => {
        const quill = quillRef.current;
        if(quill){
            quill.insertText(quill?.getSelection()?.index || 0, emoji.native);
        }
    }

    const isEmpty = !image && text.replace(/<(.|\n)*?>/g,"").trim().length === 0;   

    return (
        <div className="flex flex-col">
            <input
                type="file"
                accept="image/*"
                ref={imageElementRef}
                onChange={(event) => {setImage(event.target.files?.[0] || null)}}
                className="hidden"
            />
            <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white">
                <div ref={containerRef}  className="h-full ql-custom"/>
                {
                    !!image && (
                        <div className="p-2">
                            <div className="relative flex justify-center items-center p-2 size-[62px] group/image">

                            <Hint label="Remove Image">
                            <button
                                type="button"
                                onClick={()=>{
                                    setImage(null)
                                    // biome-ignore lint/style/noNonNullAssertion: <explanation>
                                    imageElementRef.current!.value = ""
                                }}
                                className="hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 z-[4] border2 border-white items-center justify-center"
                            >
                                <XIcon className="size-3.5"/>
                            </button>
                            </Hint>
                            <Image 
                                src={URL.createObjectURL(image)} 
                                alt="uploaded" className="rounded-xl overflow-hidden border object-cover" width={400} 
                                height={200}
                            />
                            </div>
                        </div>
                    )
                }
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
                    <EmojiPopover
                        onEmojiSelect={onEmojiSelect}
                    >
                    <Button
                        variant="ghost"
                        size="iconSm"
                        disabled={disabled}
                    >
                        <Smile className="size-4"/>
                    </Button>
                    </EmojiPopover>
                    {
                        variant === "create" && (
                            <Hint label="image">
                            <Button
                                variant="ghost"
                                size="iconSm"
                                disabled={disabled}
                                onClick={()=>{imageElementRef.current?.click()}}
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
                                    onClick={onCancel}
                                    disabled={disabled}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={()=>{
                                        onSubmit({
                                            body: JSON.stringify(quillRef.current?.getContents()),
                                            image
                                        })
                                    }}
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
                            onClick={()=>{
                                onSubmit({
                                    body: JSON.stringify(quillRef.current?.getContents()),
                                    image
                                })
                            }}
                            className={cn("ml-auto",
                                isEmpty?" bg-white hover:bg-white text-muted-foreground":" bg-[#007a5a] hover:bg-[#007a5a]/80 text-white")}
                        >
                                <MdSend className="size-4"/>
                            </Button>     
                        )
                    }
                    
                </div>
                {
                    variant === "create" && (
                        <p className={cn("p-2 text-[10px] text-muted-foreground flex justify-end opacity-0 transition", 
                            !isEmpty && "opacity-100")}>
                            <strong>Return</strong> to add a new line
                        </p>
                    )
                }
            </div>
        </div>
    )
}

export default Editor;