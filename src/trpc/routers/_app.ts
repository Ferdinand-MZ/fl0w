import { protectedProcedure, createTRPCRouter } from '../init';
import prisma from '@/lib/db';  
import { inngest } from '@/inngest/client';

export const appRouter = createTRPCRouter({
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
