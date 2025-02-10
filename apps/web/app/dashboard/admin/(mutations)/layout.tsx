"use client"
import { useSelectedLayoutSegment } from 'next/navigation';

export default function DashboardLayout({
    children,
    products,

}: {
    children: React.ReactNode;
    products: React.ReactNode;
}) {
    const productsSegment = useSelectedLayoutSegment("products")


    return (
        <>
            {children}
            {productsSegment && products}
        </>
    );
}
