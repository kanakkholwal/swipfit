// import type { ImageLoaderProps } from "next/image";

// Custom loader function
export default function CustomLoader({ src, width, quality }) {
    return `${src}?w=${width}&q=${quality || 75}`;
};
