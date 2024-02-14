"use client";

import supabase from '@/utils/supabase/client';
import {redirect} from 'next/navigation';
import {useForm} from 'react-hook-form';
import * as z from 'zod';
import {zodResolver} from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@ui/components/ui/form';
import {Input} from '@ui/components/ui/input';
import {Button} from '@ui/components/ui/button';
import * as React from "react";

const formSchema = z.object({
    email: z.string().min(1, "Email is required"),
    password: z.string().min(1, "Password is required")
})

export default function Login({ searchParams }: {
    searchParams: { message: string };
}) {
    async function onSubmit (values: z.infer<typeof formSchema>) {
        const {email, password} = values

        const {error} = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            window.location.href = '/login?message=Could not authenticate user';
            return;
        }

        window.location.href = '/';
        return
    };

    // const signUp = async (formData: FormData) => {
    //     'use server';
    //
    //     const origin = headers().get('origin');
    //     const email = formData.get('email') as string;
    //     const password = formData.get('password') as string;
    //     const cookieStore = cookies();
    //     const supabase = createClient(cookieStore);
    //
    //     const {error} = await supabase.auth.signUp({
    //         email,
    //         password,
    //         options: {
    //             emailRedirectTo: `${origin}/auth/callback`,
    //         },
    //     });
    //
    //     if (error) {
    //         return redirect('/login?message=Could not authenticate user');
    //     }
    //
    //     return redirect('/login?message=Check email to continue sign in process');
    // };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    return (
        <div className='flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md'>
            <Form {...form}>
                <form
                    className='animate-in flex w-full flex-1 flex-col justify-center gap-2 text-foreground'
                    onSubmit={form.handleSubmit(async ( values ) => await onSubmit(values))}
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input {...field} type='password' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button variant={'default'}>
                        Sign In
                    </Button>
                    {searchParams?.message && (
                        <p className='mt-4 bg-foreground/10 p-4 text-center text-foreground'>
                            {searchParams.message}
                        </p>
                    )}
                </form>
            </Form>
        </div>
    );
}
