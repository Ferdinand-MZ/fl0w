import { protectedProcedure, createTRPCRouter, premiumProcedure } from '../init';
import prisma from '@/lib/db';  
import { inngest } from '@/inngest/client';

export const appRouter = createTRPCRouter({
  testAi: premiumProcedure.mutation(async () => {
    await inngest.send({
      name : "execute/ai",
    });

    return {success: true, message:"Job Queued"}
  }),

  getWorkflows: protectedProcedure.query(({ctx}) => {
      return prisma.workflows.findMany();
    }),

    createWorkflow: protectedProcedure.mutation( async () => {
      await inngest.send({
        name : "test/hello.world",
        data : {
          email : "ferdi@gmail.com",
        },
      });
 
      return {success: true, message:"Job Queued"}
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
