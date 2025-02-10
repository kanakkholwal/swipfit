import { GeometricWrapper } from "@/components/animated/shape-landing-hero";
import { AppLogo } from "@/components/common/logo";
import { Card } from "@/components/ui/card";

type LayoutProps = Readonly<{
    children: React.ReactNode;
}>;

export default function Layout({ children }: LayoutProps) {
    return (
        <GeometricWrapper className="flex min-h-screen  full w-full flex-col items-center justify-between p-6 md:p-12 lg:p-24 @container space-y-4">
            <Card className="m-auto flex flex-col justify-center max-w-[35rem] mx-auto w-full mt-32 @lg:mt-0 space-y-10" >
                <AppLogo className="mt-12" />
                <div className="max-w-[calc(100%-3rem)] mx-auto w-full">
                    {children}
                </div>
            </Card>
        </GeometricWrapper>
    );
}