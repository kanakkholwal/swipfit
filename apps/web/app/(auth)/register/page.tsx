"use client";

import { authClient } from "~/lib/auth-client";

import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { nanoid } from "nanoid";
import { useState } from "react";
import { BiLockOpenAlt } from "react-icons/bi";
import { LuMail } from "react-icons/lu";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AiOutlineLoading } from "react-icons/ai";

import { FcGoogle } from "react-icons/fc";
import * as z from "zod";

const FormSchema = z.object({
    email: z
        .string()
        .email({ message: "Invalid email format" })
        .min(5, { message: "Email must be at least 5 characters long" })
        .max(100, { message: "Email cannot exceed 100 characters" }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(50, { message: "Password cannot exceed 50 characters" })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/, {
            message:
                "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        }),
    name: z.string(),
});

export default function SignUpForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams?.get("next") || "/";

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    async function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data);

        setIsLoading(true);
        await authClient.signUp.email(
            {
                email: data.email,
                password: data.password,
                callbackURL: redirect,
                name: data.name,
                username: `${data.email.split("@")[0].trim()}_${nanoid()}`
            },
            {
                onRequest: () => {
                    setIsLoading(true);
                },
                onResponse: () => {
                    setIsLoading(false);
                },
                onSuccess(context) {
                    console.log(context);
                    toast.success("Account created successfully");
                },
                onError: (ctx: { error: { message: string } }) => {
                    console.log(ctx);
                    toast.error(ctx.error.message);
                },
            }
        );
    }

    return (
        <>
            <main className="flex flex-col items-center justify-center w-full p-4 space-y-4">
                <CardTitle>Sign Up</CardTitle>
                <CardDescription className="mt-2 mb-5">
                    Create a new account for platform access.
                </CardDescription>
                <div className={cn("grid gap-6 w-full text-left py-4")}>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="relative group">
                                            <FormLabel className="absolute top-1/2 -translate-y-1/2 left-4 z-50">
                                                <LuMail className="w-4 h-4" />
                                            </FormLabel>
                                            <FormControl className="relative">
                                                <Input
                                                    placeholder="Your Name"
                                                    type="text"
                                                    autoCapitalize="none"
                                                    autoComplete="name"
                                                    disabled={isLoading}
                                                    autoCorrect="off"
                                                    className="pl-10 pr-5"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="relative group">
                                            <FormLabel className="absolute top-1/2 -translate-y-1/2 left-4 z-50">
                                                <LuMail className="w-4 h-4" />
                                            </FormLabel>
                                            <FormControl className="relative">
                                                <Input
                                                    placeholder="Email e.g. john@acme.com"
                                                    type="email"
                                                    autoCapitalize="none"
                                                    autoComplete="email"
                                                    disabled={isLoading}
                                                    autoCorrect="off"
                                                    className="pl-10 pr-5"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="relative group">
                                            <FormLabel className="absolute top-1/2 -translate-y-1/2 left-4 z-50">
                                                <BiLockOpenAlt className="w-4 h-4" />
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="*********"
                                                    type="password"
                                                    autoCapitalize="none"
                                                    autoComplete="password"
                                                    autoCorrect="off"
                                                    disabled={isLoading}
                                                    className="pl-10 pr-5 !mt-0"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                disabled={isLoading}
                                type="submit"
                                className="mt-2 tracking-wide rounded-lg"
                                variant="default"
                            >
                                {isLoading && (
                                    <AiOutlineLoading className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Sign Up with Email
                            </Button>
                        </form>
                    </Form>
                    <div className="relative z-0">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-t-primary/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase z-10">
                            <span className="px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>
                    <div className="grid  grid-cols-1">
                        <Button
                            type="button"
                            disabled={isLoading}
                            className="rounded-lg w-full bg-white text-black border border-gray-300"

                            onClick={async () => {
                                setIsLoading(true);
                                await authClient.signIn.social({
                                    provider: "google",
                                    callbackURL: redirect,
                                });
                                setIsLoading(false);
                            }}
                        >
                            {isLoading ? (
                                <AiOutlineLoading className="h-6 w-6 animate-spin" />
                            ) : (
                                <FcGoogle className=" h-6 w-6" />
                            )}
                            {isLoading ? "Signing in..." : "Sign Up with Google"}
                        </Button>
                    </div>
                </div>
            </main>
        </>
    );
}