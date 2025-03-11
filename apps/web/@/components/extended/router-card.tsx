import ParamsPreserverLink from "@/components/utils/link-preserve-params";
import { cn } from "@/lib/utils";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export type RouterCardLink = {
  href: string;
  title: string;
  description: string;
  external?: boolean;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  disabled?: boolean;
  preserveParams?: boolean;
};

export interface RouterCardProps extends RouterCardLink {
  style?: React.CSSProperties;
}

export function RouterCard({
  href,
  title,
  description,
  external = false,
  Icon,
  style,
  disabled,
  preserveParams,
}: RouterCardProps) {
  return (
    <ParamsPreserverLink
      href={href}
      preserveParams={preserveParams}
      className={cn(
        "group rounded-lg flex flex-col justify-between gap-3 border px-5 py-4 animate-in popup transition-colors backdrop-blur-2xl hover:shadow ",
        "border-gray-50/30 hover:bg-white/10 hover:border-primary/5 dark:border-gray-800 dark:hover:bg-gray-900 dark:hover:border-primary/10",
        disabled ? "pointer-events-none cursor-not-allowed" : "",
      )}
      target={external ? "_blank" : "_self"}
      rel={external ? "noopener noreferrer" : undefined}
      style={style}
    >
      <div className="flex w-full flex-row gap-2 items-center justify-center">
        <div className="flex justify-center items-center size-10 rounded-full bg-white/50 font-bold text-lg shrink-0 dark:bg-gray-800 dark:text-gray-100">
          <Icon className="size-6 text-primary inline-block" />
        </div>
        <div className="flex-auto">
          <h5 className="text-base font-semibold">{title}</h5>
          {disabled ? (
            <p className="text-sm font-semibold text-gray-700">(Maintenance)</p>
          ) : null}
        </div>
      </div>
      <p className="max-w-[30ch] text-sm opacity-80">{description}</p>
      <p className="text-sm whitespace-nowrap font-semibold text-primary/80 transition-all group-hover:text-primary group-hover:translate-x-1 motion-reduce:transform-none">
        Go to {title}
        {external ? (
          <ArrowUpRight className="w-4 h-4 ml-1 inline-block" />
        ) : (
          <ArrowRight className="w-4 h-4 ml-1 inline-block" />
        )}
      </p>
    </ParamsPreserverLink>
  );
}
