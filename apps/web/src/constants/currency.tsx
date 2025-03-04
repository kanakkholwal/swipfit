import { cn } from '@/lib/utils';
import { DollarSign, IndianRupee } from 'lucide-react';


export const CURRENCY_SYMBOLS = {
    // USD: "$",
    USD: DollarSign,
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    INR: IndianRupee,
    AUD: "A$",
    CAD: "C$",
    CHF: "CHF",
    CNY: "¥",
    SEK: "kr",
    NZD: "NZ$",
    MXN: "Mex$",
    SGD: "S$",
    HKD: "HK$",
    NOK: "kr",
    KRW: "₩",
    TRY: "₺",
    RUB: "₽",
    BRL: "R$",
    ZAR: "R",
    IDR: "Rp",
    PLN: "zł",
    PHP: "₱",
    MYR: "RM",
    HUF: "Ft",
    THB: "฿",
    COP: "COL$",
    ARS: "AR$",
    DKK: "kr",
    CLP: "CLP$",
    CZK: "Kč",
    ILS: "₪",
    EGP: "E£",
    VND: "₫",
    AED: "د.إ",
    SAR: "﷼",
    KWD: "د.ك",
    QAR: "﷼",
    CRC: "₡",
    UAH: "₴",
    NGN: "₦",
    KES: "Ksh",
    GHS: "GH₵",
    TZS: "TSh",
    UGX: "USh",
    ZMW: "ZK",
    MWK: "MK",
    MZN: "MT",
    MUR: "₨",
    BDT: "৳",
    LKR: "₨",
    NPR: "₨",
    PKR: "₨",
    AFN: "؋",
    ALL: "Lek",
    AMD: "֏",
    ANG: "ƒ",
    AOA: "Kz",
    AWG: "ƒ",
    AZN: "₼",
    BAM: "KM",
    BBD: "Bds$",
    BGN: "лв",
    BHD: "ب.د",
} as Record<string, string | React.FC<React.SVGProps<SVGSVGElement>>>;


export const CURRENCY_CODES = Object.keys(CURRENCY_SYMBOLS);

export function isValidCurrency(currency: string): boolean {
    return CURRENCY_CODES.includes(currency);
}

export function CurrencySymbol({ currency,className }: { currency: string,className?:string }) {
    if (!isValidCurrency(currency)) {
        return null;
    }

    const symbol = CURRENCY_SYMBOLS[currency];
    if (typeof symbol === "string") {
        return <span className={cn('text-inherit',className)}>{symbol}</span>;
    }

    return <symbol className={cn('text-inherit',className)}/>;
}