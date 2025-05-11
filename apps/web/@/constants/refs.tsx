import MyntraLogo from '@/assets/myntra.svg';
import type { StaticImageData } from 'next/image';


export type RefWebsiteType = {
    name: string;
    url: string;
    icon: string | StaticImageData;
    description: string;
    tags: string[];
}

export const RefWebsites:RefWebsiteType[] = [
    {
    name: "Myntra",
    url: "https://myntra.com",
    icon: MyntraLogo,
    description: "Myntra is a leading fashion and lifestyle e-commerce platform in India, offering a wide range of clothing, footwear, accessories, and lifestyle products.",
    tags: ["Fashion", "E-commerce", "Lifestyle"],
}
] as const;




export const getWebsiteByUrl = (url: string): RefWebsiteType | null => {
    const urlObj = new URL(url);
    const website = RefWebsites.find((website) => {
        const websiteUrl = new URL(website.url);
        return urlObj.hostname === websiteUrl.hostname;
    });
    return website || null;
}
