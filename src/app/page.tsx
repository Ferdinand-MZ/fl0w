import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Client } from "./client";
import { getQueryClient, trpc } from "@/trpc/server";
import { Suspense } from "react";


const Page = async() => {
  const queryClient = getQueryClient();

// jadi yang dilakukan disini adalah leveraging speed dari server komponen untuk melakukan prefetch data sebelum client komponen di render, 
// sehingga ketika client komponen di render, data sudah tersedia

  // prefetch
  void queryClient.prefetchQuery(trpc.getUsers.queryOptions());

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center">
      
      {/* Menciptakan Boundary antara server komponen dan client komponen */}
      <HydrationBoundary state={dehydrate(queryClient)}>

        {/* suspense berguna sebagai fallback untuk komponen client yang sedang memuat data */}
        <Suspense fallback={<div>Loading...</div>}>
          <Client/>
        </Suspense>
      </HydrationBoundary>
    </div>
  )
}

export default Page;