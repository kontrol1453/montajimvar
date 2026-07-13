import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function YazilarPostPage({ params }: Props) {
  const { slug } = await params;
  redirect(`/blog/${slug}`);
}
