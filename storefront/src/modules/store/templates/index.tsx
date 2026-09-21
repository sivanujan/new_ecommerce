import CollectionInteractiveView, {
  CategoryOption,
  FormattedCollectionProduct,
} from "../components/collection-interactive-view"

export default function StoreTemplate({
  products,
  categories,
  initialCategory,
  initialSort,
}: {
  products: FormattedCollectionProduct[]
  categories: CategoryOption[]
  initialCategory?: string
  initialSort?: string
}) {
  return (
    <div className="w-full bg-[#0B0B0C] min-h-screen text-white flex flex-col pt-4 sm:pt-6">
      {/* Interactive Filter/Sort Bar + Live Products Grid */}
      <CollectionInteractiveView
        products={products}
        categories={categories}
        initialCategory={initialCategory}
        initialSort={initialSort}
      />
    </div>
  )
}
