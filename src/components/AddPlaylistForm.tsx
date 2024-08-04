"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/Form";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Switch } from "./ui/Switch";
import { Textarea } from "./ui/TextArea";
import { UseMutateFunction } from "@tanstack/react-query";

interface AddPlaylistFormProps {
    mutation: UseMutateFunction<
        void,
        Error,
        {
            name: string;
            public: boolean;
            description: string;
        },
        unknown
    >;
}

export const formSchema = z.object({
    name: z.string().min(1).max(100),
    public: z.boolean(),
    description: z.string().max(300),
});

const AddPlaylistForm: React.FC<AddPlaylistFormProps> = ({mutation}) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            public: true,
            description: "",
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        mutation(values);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Name..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="public"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Public</FormLabel>
                            <FormControl className="ml-4">
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Description..."
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Create</Button>
            </form>
        </Form>
    );
};

export default AddPlaylistForm;
