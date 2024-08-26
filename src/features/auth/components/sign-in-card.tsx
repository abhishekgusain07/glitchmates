'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { SignInFlow } from "../types";
import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlert } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";

interface signInCardProps {
    setState: (state: SignInFlow) => void;
}
const SignInCard = ({setState}: signInCardProps) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [pending, setPending] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const {signIn} = useAuthActions()


    const onPasswordSignIn = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setPending(true)
        signIn("password", {email, password, flow: "signIn"})
        .catch(() => {
            setError('Invalid email or password')
        }).finally(()=>{
            setPending(false)
        })
    }
    const handleProviderSignIn = (value: 'github' | 'google') => {
        setPending(true)
        signIn(value)
        .finally(()=>{ 
            setPending(false)
        })
    }
    
    return (
        <div className="lg:px-8">
            <div className="flex justify-center items-center h-screen">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <h1 className="text-2xl font-semibold tracking-tight text-center">
            Welcome Back
          </h1>
            {
                !!error && (
                    <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
                        <TriangleAlert className="size-4" />
                        <p>{error}</p>
                    </div>
                )
            }
                <form className="space-y-2.5" onSubmit={onPasswordSignIn}>
                    <div className="grid gap-5">
                    <Input 
                        disabled={pending}
                        value={email}
                        placeholder="name@example.com"
                        onChange={(e)=>{setEmail(e.target.value)}}
                        type="email"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        name="email"
                        required={true}
                    />
                    
                    <PasswordInput 
                        disabled={pending}
                        value={password}
                        placeholder="Password"
                        onChange={(e)=>{setPassword(e.target.value)}}
                        type="password"
                        autoCapitalize="none"
                        autoCorrect="off"
                        autoComplete="current-password"
                        required={true}
                    />
                    <Button loading={pending} className="w-full h-10">
                        Sign in
                    </Button>
                    </div>
                </form>
                <Separator/>
                <div className="flex flex-col gap-y-2.5">
                    <Button
                        variant="outline"
                        size="lg"
                        disabled={pending}
                        onClick={()=>{handleProviderSignIn('google')}}
                        className="w-full relative"
                    >
                        <FcGoogle className=" size-5 absolute left-4 top-1/2 -translate-y-1/2 text-2xl" />
                        Continue with Google
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        disabled={pending}
                        onClick={()=>{handleProviderSignIn('github')}}
                        className="w-full relative"
                    >
                        <FaGithub className=" size-5 absolute left-4 top-1/2 -translate-y-1/2 text-2xl" />
                        Continue with Github
                    </Button>
                </div>
                <div className="flex justify-center text-md">
                <p className="text-xs text-muted-foreground">
                    Don&apos;t have an account? <span 
                    onClick={()=>setState('signUp')}
                    className="text-sky-700 hover:underline cursor-pointer" 
                    >Sign Up</span>
                </p>
                </div>
                </div>
                </div>
            </div>
    )
}

export default SignInCard;
