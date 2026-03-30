"use client";

import { CredentialType } from "@/generated/prisma";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCreateCredential, useUpdateCredential, useSuspenseCredential, } from "../hooks/use-credentials";
import { useUpgradeModal } from "@/hooks/use-uprade-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useForm } from "react-hook-form";
import { FormItem, FormLabel, FormField, Form, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { SelectContent, SelectItem, SelectTrigger, Select, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface CredentialFormProps {
    initialData?: {
        id?: string;
        name: string;
        type: CredentialType;
        value: string;
    }
}

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    type: z.enum(CredentialType),
    value: z.string().min(1, "API key is required"),
});

type FormValues = z.infer<typeof formSchema>;

const credentialTypeOptions = [
    {
        value: CredentialType.OPENAI,
        label: "OpenAI",
        logo: "logos/openai.svg",
    },
    {
        value: CredentialType.ANTHROPIC,
        label: "Anthropic",
        logo: "logos/anthropic.svg",
    },
    {
        value: CredentialType.GEMINI,
        label: "gemini",
        logo: "logos/gemini.svg",
    },
];

export const CredentialForm = ({
    initialData,
}: CredentialFormProps) => {
    const router = useRouter();
    const createCredential = useCreateCredential();
    const updateCredential = useUpdateCredential();
    const {handleError, modal} = useUpgradeModal();

    const isEdit = !!initialData?.id;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            type: CredentialType.OPENAI,
            value: "",
        },
    });

    const onSubmit = async (values: FormValues) => {
        if (isEdit && initialData ?.id){
            await updateCredential.mutateAsync({
                id: initialData.id,
                ...values,
            })
        } else {
            await createCredential.mutateAsync(values, {
                onSuccess: (data) => {
                    router.push(`/credentials/${data.id}`);
                },
                onError: (error) => {
                    handleError(error);
                }
            })
        }
    }

    return (
        <>
        {modal}
        <Card className="shadown-none">
            <CardHeader>
                <CardTitle>
                    {isEdit ? "Edit Credential" : "Create Credential"}
                </CardTitle>
                <CardDescription>
                    {isEdit
                    ? "Update your API key or credential"
                    : "Add a new API key or credential to your account"
                }
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField 
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="My API Key" 
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="type"
                             render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Type
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {credentialTypeOptions.map((option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Image 
                                                            src={option.logo}
                                                            alt={option.label}
                                                            width={16}
                                                            height={16}
                                                        />
                                                        {option.label}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField 
                            control={form.control}
                            name="value"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        API Key
                                    </FormLabel>

                                    <FormControl>
                                        <Input 
                                            type="password"
                                            placeholder="sk-..."
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-4">
                            <Button
                                type="submit"
                                disabled={
                                    createCredential.isPending ||
                                    updateCredential.isPending 
                                }
                            >
                                { isEdit ? "Update" : "Create" }
                            </Button>
                            <Button
                                type="submit"
                                variant="outline"
                                asChild
                            >
                                <Link href="/credentials" prefetch>
                                    Cancel
                                </Link>
                            </Button>
                        </div>

                    </form>
                </Form>
            </CardContent>
        </Card>
        </>
    )
};

export const CredentialView = ({
    credentialId,
}: { credentialId: string }) => {
    const { data: credential } = useSuspenseCredential(credentialId);
    
    return <CredentialForm initialData={credential} />
}