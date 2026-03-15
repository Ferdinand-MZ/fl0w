import { inngest } from "./client";
import prisma from "@/lib/db";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import {createOpenAI} from "@ai-sdk/openai";
import {createAnthropic} from "@ai-sdk/anthropic";
import { azure } from '@ai-sdk/azure';
import { generateText } from "ai";

// ga perlu masukin api key nya disini karena kita make nama bawaan nya dari ai-sdk, yaitu gemini-api-key.
// auto ke detect
const google = createGoogleGenerativeAI();
const openai = createOpenAI();
const anthropic = createAnthropic();

export const execute = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ event, step }) => {
    await step.sleep("pretend", "5s");

   const {steps: geminiSteps} = await step.ai.wrap("gemini-generate-text", 
    generateText, 
    {
    model: google("gemini-2.5-flash"),
    system: "You are a helpful assistant that helps to generate text based on the user's query",
    prompt: "What is the capital of assyria?",
   })

    const {steps: azureSteps} = await step.ai.wrap("azure-generate-text", 
    generateText, 
    {
    model: azure("polsub-gpt"),
    system: "You are a helpful assistant that helps to generate text based on the user's query",
    prompt: "What is the capital of assyria?",
   })

   const {steps: openaiSteps} = await step.ai.wrap("openai-generate-text", 
    generateText, 
    {
    model: openai("gpt-3.5-turbo"),
    system: "You are a helpful assistant that helps to generate text based on the user's query",
    prompt: "What is the capital of assyria?",
   })

   const {steps: anthropicSteps} = await step.ai.wrap("anthropic-generate-text", 
    generateText, 
    {
    model: anthropic("claude-sonnet-4-5"),
    system: "You are a helpful assistant that helps to generate text based on the user's query",
    prompt: "What is the capital of assyria?",
   })



   return {geminiSteps, openaiSteps, anthropicSteps, azureSteps};
  },
);