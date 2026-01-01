import { Product, UIProduct } from "@/types/products.types";

interface ProductSEOProps {
  product?: Product | UIProduct;
  type?: "single" | "listing" | "featured";
}

export function ProductSEO({ product, type = "single" }: ProductSEOProps) {
  if (!product) return null;

  const isUIProduct = "hindiName" in product && "price" in product;

  const productName = isUIProduct
    ? (product as UIProduct).name
    : (product as Product).name;

  const productDescription = isUIProduct
    ? (product as UIProduct).description
    : (product as Product).description;

  const productImage = isUIProduct
    ? (product as UIProduct).image
    : (product as Product).thumbnail;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName,
    description: productDescription?.substring(0, 200),
    image: productImage,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: isUIProduct
        ? (product as UIProduct).price
        : (product as Product).prices[0]?.price,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Sbzee",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <meta property="og:title" content={productName} />
      <meta
        property="og:description"
        content={productDescription?.substring(0, 200)}
      />
      <meta property="og:image" content={productImage} />
      <meta property="og:type" content="product" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={productName} />
      <meta
        name="twitter:description"
        content={productDescription?.substring(0, 200)}
      />
      <meta name="twitter:image" content={productImage} />
    </>
  );
}
