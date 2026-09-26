import { getContent } from "@/lib/content";
import { GalleryPage } from "@/components/GalleryPage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "갤러리 | Hankook Service Center",
  description: "Hankook Service Center 현장 및 서비스 활동 갤러리",
};

export default async function Page() {
  const content = await getContent();
  return <GalleryPage content={content} />;
}
