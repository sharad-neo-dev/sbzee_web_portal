// CHANGE THE ENTIRE page.tsx to this:
import type { Metadata } from "next";
import ProductDetailsClient from "./ProductDetailsClient";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `Product Details | Sbzee`,
    description: "View product details and buy fresh produce online.",
    openGraph: {
      title: `Product Details | Sbzee`,
      description: "View product details and buy fresh produce online.",
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  // Just pass the ID, let client component fetch data
  return <ProductDetailsClient productId={id} />;
}

// Important: Remove the notFound() calls and server-side fetch
