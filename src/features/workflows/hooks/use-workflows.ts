// Hook to fetch all workflows using suspense

import { useTRPC } from "@/trpc/client"
import { useQueryClient, useSuspenseQuery, useMutation } from "@tanstack/react-query";
import {toast} from "sonner";
import { useWorkflowsParams } from "./use-workflows-params";

export const useSuspenseWorkflows = () => {
    const trpc = useTRPC();
    const [params, setParams] = useWorkflowsParams(); 

    return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params));
};

// workflows hook untuk buat workflows baru
export const useCreateWorkflow = () => {
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    return useMutation(trpc.workflows.create.mutationOptions({
        onSuccess: (data) => {
            toast.success(`Workflow "${data.name}" created` );
            queryClient.invalidateQueries(
                trpc.workflows.getMany.queryOptions({}),
            );
        },
        onError: (error) => {
            toast.error(`Failed to create Workflow: ${error.message}`);
        },
    }));
};