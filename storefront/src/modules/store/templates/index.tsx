import CollectionInteractiveView, {
  CategoryOption,
  FormattedCollectionProduct,
} from "../components/collection-interactive-view"

export default function StoreTemplate({
  products,
  categories,
  initialCategory,
  initialSort,
  initialSearch,
}: {
  products: FormattedCollectionProduct[]
  categories: CategoryOption[]
  initialCategory?: string
  initialSort?: string
  initialSearch?: string
}) {
  return (
    <div className="w-full bg-[#0B0B0C] min-h-screen text-white flex flex-col">
      {/* Interactive Filter/Sort Bar + Live Search + Products Grid */}
      <CollectionInteractiveView
        products={products}
        categories={categories}
        initialCategory={initialCategory}
        initialSort={initialSort}
        initialSearch={initialSearch}
      />
    </div>
  )
}
