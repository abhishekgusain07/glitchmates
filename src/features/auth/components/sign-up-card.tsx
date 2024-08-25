"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { SignInFlow } from "../types";

interface signUpCardProps {
    setState: (state: SignInFlow) => void;
}
const SignUpCard = ({setState}: signUpCardProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    return (
        <Card className="w-full  p-8">
            <CardHeader className="px-0 pt-0">
               <CardTitle>
                SignUp to Continue
                </CardTitle> 
                <CardDescription>
                Use your email or other services to login
            </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 px-0 pb-0">
                <form className="space-y-2.5">
                    <Input 
                        disabled={false}
                        value={email}
                        placeholder="Email"
                        onChange={(e)=>{setEmail(e.target.value)}}
                        type="email"
                        required={true}
                    />
                    <Input 
                        disabled={false}
                        value={password}
                        placeholder="Password"
                        onChange={(e)=>{setPassword(e.target.value)}}
                        type="password"
                        required={true}
                    />
                    <Input 
                        disabled={false}
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
                        disabled={false}
                    >
                        Continue
                    </Button>
                </form>
                <Separator/>
                <div className="flex flex-col gap-y-2.5">
                    <Button
                        variant="outline"
                        size="lg"
                        disabled={false}
                        onClick={()=>{}}
                        className="w-full relative"
                    >
                        <FcGoogle className=" size-5 absolute left-4 top-1/2 -translate-y-1/2 text-2xl" />
                        Continue with Google
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        disabled={false}
                        onClick={()=>{}}
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
