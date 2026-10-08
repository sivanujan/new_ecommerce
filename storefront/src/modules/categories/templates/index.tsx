import CollectionView, {
  CategoryInfo,
  CategoryOption,
  FormattedCollectionProduct,
} from "@modules/store/components/collection-interactive-view"

export default function CategoryTemplate({
  products,
  categories,
  currentCategory,
  initialSort,
  initialSearch,
}: {
  products: FormattedCollectionProduct[]
  categories: CategoryOption[]
  currentCategory: CategoryInfo
  initialSort?: string
  initialSearch?: string
}) {
  return (
    <CollectionView
      products={products}
      categories={categories}
      currentCategory={currentCategory}
      initialCategory={currentCategory.handle}
      initialSort={initialSort}
      initialSearch={initialSearch}
      isCategoryRoute={true}
    />
  )
}
