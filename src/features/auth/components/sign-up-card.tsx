"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { SignInFlow } from "../types";
import { TriangleAlert } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { PasswordInput } from "@/components/ui/password-input";

interface signUpCardProps {
    setState: (state: SignInFlow) => void;
}
const SignUpCard = ({setState}: signUpCardProps) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [pending, setPending] = useState<boolean>(false);
    const {signIn} = useAuthActions()

    const onPasswordSignUp = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(password !== confirmPassword){
            setError('Passwords do not match')
            return
        }
        setPending(true)
        signIn("password", {name, email, password, flow: "signUp"})
        .catch(() => {
            setError('Something went wrong')
        }).finally(()=>{
            setPending(false)
        })
    }
    const onProviderSignUp = (value: 'github' | 'google') => {
        setPending(true)
        signIn(value)
        .finally(()=>{ 
            setPending(false)
        })
    }
    return (
        <div className="lg:px-8">
            <div className="flex justify-center items-center h-screen">
            <div className="mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[350px]">
          <h1 className="text-2xl font-semibold tracking-tight text-center">
            Welcome Back
          </h1>
          <p className="text-xs text-muted-foreground text-center">use Google or Github to sign up</p>
            {
                !!error && (
                    <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
                        <TriangleAlert className="size-4" />
                        <p>{error}</p>
                    </div>
                )
            }
                <form className="space-y-2.5" onSubmit={onPasswordSignUp}>
                    <div className="grid gap-3 mt-2">
                    <Input 
                        disabled={pending}
                        value={name}
                        placeholder="Full Name"
                        onChange={(e)=>{setName(e.target.value)}}
                        required={true}
                        autoCapitalize="none"
                        autoCorrect="off"
                        name="name"
                    />
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
                    <PasswordInput 
                        disabled={pending}
                        value={confirmPassword}
                        placeholder="Confirm Password"
                        onChange={(e)=>{setConfirmPassword(e.target.value)}}
                        type="password"
                        autoCapitalize="none"
                        autoCorrect="off"
                        autoComplete="Confirm-password"
                        required={true}
                    />
                    <Button loading={pending} className="w-full h-10">
                        Sign Up
                    </Button>
                    </div>
                </form>
                <Separator/>
                <div className="flex flex-col gap-y-4 mt-3">
                    <Button
                        variant="outline"
                        size="lg"
                        disabled={pending}
                        onClick={()=>{onProviderSignUp('google')}}
                        className="w-full relative"
                    >
                        <FcGoogle className=" size-5 absolute left-4 top-1/2 -translate-y-1/2 text-2xl" />
                        Continue with Google
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        disabled={pending}
                        onClick={()=>{onProviderSignUp('github')}}
                        className="w-full relative"
                    >
                        <FaGithub className=" size-5 absolute left-4 top-1/2 -translate-y-1/2 text-2xl" />
                        Continue with Github
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                    Already have an account? <span 
                    onClick={()=>setState('signIn')}
                    className="text-sky-700 hover:underline cursor-pointer" 
                    >Sign In</span>
                </p>
            </div>
            </div>
        </div>
    )
}

export default SignUpCard;
