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

interface signUpCardProps {
    setState: (state: SignInFlow) => void;
}
const SignUpCard = ({setState}: signUpCardProps) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
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
        signIn("password", {email, password, flow: "signUp"})
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
        <Card className="w-full h-full p-8">
            <CardHeader className="px-0 pt-0">
               <CardTitle>
                SignUp to Continue
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
                <form className="space-y-2.5" onSubmit={onPasswordSignUp}>
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
                    <Input 
                        disabled={pending}
                        value={confirmPassword}
                        placeholder="Confirm Password"
                        onChange={(e)=>{setConfirmPassword(e.target.value)}}
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
                <p className="text-xs text-muted-foreground">
                    Already have an account? <span 
                    onClick={()=>setState('signIn')}
                    className="text-sky-700 hover:underline cursor-pointer" 
                    >Sign In</span>
                </p>
            </CardContent>
        </Card>
    )
}

export default SignUpCard;
