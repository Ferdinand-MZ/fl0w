import { SignupForm } from "@/features/auth/components/signup-form"
import { requireUnauth } from "@/lib/auth-utils";

const page = async () => {
  await requireUnauth();
  
  return <SignupForm />
}

export default page