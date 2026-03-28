import type {NodeExecutor} from "@/features/executions/types";
import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";
import { step } from "inngest";

type GoogleFormTriggerData = Record<string, unknown>;

export const googleFormTriggerExecutor: NodeExecutor<GoogleFormTriggerData> = async ({
    data,
    nodeId,
    context,
    step,
    publish,
}) => {
    // Publish "loading" state for G Form Trigger
    await publish(
        googleFormTriggerChannel().status({
            nodeId,
            status: "loading",
        }),
    );
    
    const result = await step.run("google-form-trigger", async() => context);

    // Publish "success" state for G Form Trigger
    await publish(
        googleFormTriggerChannel().status({
            nodeId,
            status: "success",
        }),
    );

    return result;
};