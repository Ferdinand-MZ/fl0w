// Hook to fetch all credentials using suspense

import { useTRPC } from "@/trpc/client"
import { useQueryClient, useSuspenseQuery, useMutation, useQuery } from "@tanstack/react-query";
import {toast} from "sonner";
import { useCredentialsParams } from "./use-credentials-params";
import { CredentialType } from "@/generated/prisma";

// Hook untuk fetch credentials dengan suspense
export const useSuspenseCredentials = () => {
    const trpc = useTRPC();
    const [params] = useCredentialsParams(); 

    return useSuspenseQuery(trpc.credentials.getMany.queryOptions(params));
};

// credentials hook untuk buat credentials baru
export const useCreateCredential = () => {
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    return useMutation(trpc.credentials.create.mutationOptions({
        onSuccess: (data) => {
            toast.success(`Credential "${data.name}" created` );
            queryClient.invalidateQueries(
                trpc.credentials.getMany.queryOptions({}),
            );
        },
        onError: (error) => {
            toast.error(`Failed to create Credential: ${error.message}`);
        },
    }));
};

// Hook to remove a credential
export const useRemoveCredential = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(
        trpc.credentials.remove.mutationOptions({
            onSuccess: (data) => {
                toast.success(`Credential "${data.name}" removed`);
                queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({

                }));
                queryClient.invalidateQueries(
                    trpc.credentials.getOne.queryFilter({
                        id: data.id
                    }),
                )
            }
        })
    );
};

// Hook untuk fetch satu credential dengan Suspense
export const useSuspenseCredential = (id: string) => {
    const trpc = useTRPC();
    return useSuspenseQuery(trpc.credentials.getOne.queryOptions({id}));
};

// credentials hook untuk update credential
export const useUpdateCredential = () => {
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    return useMutation(trpc.credentials.update.mutationOptions({
        onSuccess: (data) => {
            toast.success(`Credential "${data.name}" saved` );
            queryClient.invalidateQueries(
                trpc.credentials.getMany.queryOptions({}),
            );
            queryClient.invalidateQueries(
                trpc.credentials.getOne.queryOptions({ id: data.id}),
            );
        },
        onError: (error) => {
            toast.error(`Failed to save Credential: ${error.message}`);
        },
    }));
};

// Hook untuk fetch credentials by type
export const useCredentialsByType = (type: CredentialType) => {
    const trpc = useTRPC();
    // disini kita pakai useQuery karena ini bakal digunakan di dialog dan tidak dapat di prefetch (bisa sih sebenernya cuman simpelan gini)
    return useQuery(trpc.credentials.getByType.queryOptions({type}));
}