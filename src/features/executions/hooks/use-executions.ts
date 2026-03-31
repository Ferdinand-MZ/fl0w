import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query";
import { useExecutionsParams } from "./use-executions-params";

// Hook untuk fetch executions dengan suspense
export const useSuspenseExecutions = () => {
    const trpc = useTRPC();
    const [params] = useExecutionsParams(); 

    return useSuspenseQuery(trpc.executions.getMany.queryOptions(params));
};

// Hook untuk fetch satu execution dengan Suspense
export const useSuspenseExecution = (id: string) => {
    const trpc = useTRPC();
    return useSuspenseQuery(trpc.executions.getOne.queryOptions({id}));
};