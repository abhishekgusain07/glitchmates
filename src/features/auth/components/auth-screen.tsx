'use client'

import { useState } from "react";
import { SignInFlow } from "../types";
import SignUpCard from "./sign-up-card";
import SignInCard from "./sign-in-card";
import Head from "next/head";
import { Quotes } from "./quotes";

export const AuthScreen = () => {

    const [state, setState] = useState<SignInFlow>('signIn');
    return (
        <div className="grid h-full grid-cols-1 lg:grid-cols-2">
            <Head>
                <title>
                    {
                        state === 'signIn' ? 'SignIn' : 'SignUp'
                    }
                </title>
            </Head>
            <div className="order-2 w-[80vw] mx-auto md:w-full lg:order-1">
                {
                    state === 'signIn' ? <SignInCard setState={setState}/> : <SignUpCard setState={setState}/>
                }
            </div>
            <div className="hidden lg:block order-1 lg:order-2">
                <Quotes />
            </div>
        </div>
    )
}