import { AppLogo } from "@/components/common/logo";
import { Card } from "@/components/ui/card";

type LayoutProps = Readonly<{
    children: React.ReactNode;
}>;

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-between p-6 md:p-12 lg:p-24 @container space-y-4">
            <div className="min-h-screen w-full mx-auto lg:px-4 relative h-[100vh] flex-col items-center justify-center bg-background-gradient">
                <div className="lg:p-8 @container flex flex-col justify-center items-center m-auto">
                    <Card
                        className="m-auto flex flex-col justify-center max-w-[35rem] mx-auto w-full mt-32 @lg:mt-0 space-y-10"
                    >
                        <AppLogo className="mt-12" />
                        <div className="max-w-[calc(100%-3rem)] mx-auto w-full">
                            {children}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}