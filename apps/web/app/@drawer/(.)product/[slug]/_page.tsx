export default async function ProductDrawer({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const ProductSlug = (await params).slug;
  return <>{ProductSlug}</>;
}
