import { inngest } from "./client";
import prisma from "@/lib/db";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {

    // Fetching the video
    await step.sleep("fetching", "5s");

    // Transcribing
    await step.sleep("transcribing", "5s");
    
    // Sending Transcription to AI
    await step.sleep("sending-to-ai", "5s");
   
    await step.run("create-workflow", () => {
        return prisma.workflows.create({
            data: {
                name: "workflow-from-inngest",
            }
        })
    });
  },
);