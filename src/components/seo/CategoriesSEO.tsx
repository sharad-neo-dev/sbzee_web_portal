import { Category } from "@/types/products.types";

interface CategoriesSEOProps {
  selectedCategory?: Category;
  totalProducts: number;
}

export function CategoriesSEO({
  selectedCategory,
  totalProducts,
}: CategoriesSEOProps) {
  const categoryName = selectedCategory?.name || "All Products";
  const categoryDescription =
    selectedCategory?.description ||
    "Browse through all fresh fruits and vegetables at Sbzee. Farm-fresh quality delivered to your doorstep.";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${categoryName} - Sbzee`,
    description: categoryDescription,
    numberOfItems: totalProducts,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <meta property="og:title" content={`${categoryName} | Sbzee`} />
      <meta
        property="og:description"
        content={categoryDescription.substring(0, 200)}
      />
      {selectedCategory?.image && (
        <meta property="og:image" content={selectedCategory.image} />
      )}
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${categoryName} | Sbzee`} />
      <meta
        name="twitter:description"
        content={categoryDescription.substring(0, 200)}
      />
    </>
  );
}
