import { getContent } from "@/lib/content";
import { AboutPage } from "@/components/AboutPage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "회사 소개 | Hankook Service Center",
  description: "Hankook Service Center 대표 인사말, 회사 개요, 연혁 및 인증 안내",
};

export default async function Page() {
  const content = await getContent();
  return <AboutPage content={content} />;
}
