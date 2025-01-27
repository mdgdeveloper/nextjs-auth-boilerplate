"use client";

import { z } from "zod";
import { loginSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signIn } from "@/auth";
import { loginAction } from "@/app/actions/auth-action";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";


const FormLogin = () => {
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    // 1. Define your form
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });

    // 2. Define a submit handler
    const onSubmit = async (values: z.infer<typeof loginSchema>) => {
        setError(null)
        startTransition(async () => {
            const response = await loginAction(values);
            if (response.error) {
                setError(response.error)
                return
            } else {
                router.push("/dashboard")
            }
        })
    }


    return (
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="email" type="email" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Enter your email
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="password" type="password" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Enter your password
                                </FormDescription>
                                <FormMessage>
                                    {error}
                                </FormMessage>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isPending}>Submit</Button>
                </form>
            </Form>
        </div>
    )
}
export default FormLogin