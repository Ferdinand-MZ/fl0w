import { executionsParamsLoader } from "@/features/executions/components/server/params-loader";
import { prefetchExecutions } from "@/features/executions/components/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { SearchParams } from "nuqs";
import { ErrorBoundary } from "@sentry/nextjs";
import { Suspense } from "react";
import { ExecutionsContainer, ExecutionsError, ExecutionsList, ExecutionsLoading } from "@/features/executions/components/executions";

// untuk prefetch executions
type Props = {
  searchParams: Promise<SearchParams>;
};

const Page = async ({searchParams}: Props) => {
  await requireAuth();

  const params = await executionsParamsLoader(searchParams);
  prefetchExecutions(params);

  return (
    <ExecutionsContainer>
      <HydrateClient>
      <ErrorBoundary fallback={<ExecutionsError />}>
        <Suspense fallback={<ExecutionsLoading />}>
          <ExecutionsList />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
    </ExecutionsContainer>
  )
};

export default Page;