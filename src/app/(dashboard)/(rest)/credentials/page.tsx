import { requireAuth } from "@/lib/auth-utils";

const Page = async () => {
  await requireAuth();
}

export default Page;