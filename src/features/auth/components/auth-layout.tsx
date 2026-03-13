import Link from "next/link";
import Image from "next/image";

export const AuthLayout = ({children}: {children: React.ReactNode;}) => {
    return (
        <div className="bg-muted items-center flex min-h-svh flex-col justify-center gap-6 p6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link href="/" className="flex items-center justify-center gap-2 font-medium">
                    <Image src="/logos/logo.svg" alt="fl0w" width={200} height={44} />
                </Link>
                {children}
            </div>
        </div>
    );
};