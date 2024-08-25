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
        <Card className="w-full h-full p-8 items-center">
            <CardHeader className="px-0 pt-0">
               <CardTitle>
                Login to Continue
                </CardTitle> 
                <CardDescription>
                Use your email or other services to login
            </CardDescription>
            </CardHeader>
            {
                !!error && (
                    <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
                        <TriangleAlert className="size-4" />
                        <p>{error}</p>
                    </div>
                )
            }
            <CardContent className="space-y-5 px-0 pb-0">
                <form className="space-y-2.5" onSubmit={onPasswordSignIn}>
                    <Input 
                        disabled={pending}
                        value={email}
                        placeholder="Email"
                        onChange={(e)=>{setEmail(e.target.value)}}
                        type="email"
                        required={true}
                    />
                    <Input 
                        disabled={pending}
                        value={password}
                        placeholder="Password"
                        onChange={(e)=>{setPassword(e.target.value)}}
                        type="password"
                        required={true}
                    />
                    <Button 
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={pending}
                    >
                        Continue
                    </Button>
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
                <p className="text-xs text-muted-foreground">
                    Don&apos;t have an account? <span 
                    onClick={()=>setState('signUp')}
                    className="text-sky-700 hover:underline cursor-pointer"
                    >Sign up</span>
                </p>
            </CardContent>
        </Card>
    )
}

export default SignInCard;
