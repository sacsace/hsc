import { getContent } from "@/lib/content";
import { ContactPage } from "@/components/ContactPage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "문의 | Hankook Service Center",
  description: "Hankook Service Center 문의 양식 및 Registration Office·첸나이 사무실 위치 안내",
};

export default async function Page() {
  const content = await getContent();
  return <ContactPage content={content} />;
}
