import { GooeyText } from "@/components/animated/gooey-text-morphing";

const loadingPhrases: string[] = [
  "Styling your fit...",
  "Curating trends...",
  "Draping the best looks...",
  "Unveiling fashion magic...",
  "Finding your perfect vibe...",
  "Tailoring recommendations...",
  "Loading your next obsession...",
  "Piecing together your look...",
  "Fetching runway trends...",
  "Your fashion journey starts now...",
  "Hang tight, style is coming...",
  "Loading fashion fire... 🔥",
  "Get ready to slay... 💃",
  "AI is styling you... 🤖👗",
  "Almost there, fashionista...",
  "Picking the best for you...",
  "A touch of AI, a dash of style...",
  "Trendspotting just for you...",
];

export const getRandomLoadingPhrase = (): string[] => {
  const randomIndex = Math.floor(Math.random() * loadingPhrases.length);
  return loadingPhrases[randomIndex].split(" ");
};

export default function RootLoading() {
  return (
    <div className="flex flex-col justify-center items-center gap-4  w-full h-full min-h-screen  p-4 md:p-20 lg:p-36 fixed inset-0 backdrop-blur-xl bg-neutral-700/45 z-50">
      {/* <AppLogo /> */}

      <GooeyText
        texts={getRandomLoadingPhrase()}
        morphTime={1}
        cooldownTime={0.25}
        className="font-bold"
      />
      {/* <div className="relative w-56 h-1 rounded-full bg-primary/10 overflow-hidden">
        <div className="absolute h-full bg-primary rounded-full animate-loader" />
      </div> */}
    </div>
  );
}
