import { getContent } from "@/lib/content";
import { TeamPage } from "@/components/TeamPage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "팀원 소개 | Hankook Service Center",
  description: "Hankook Service Center 팀원 및 대표 소개",
};

export default async function Page() {
  const content = await getContent();
  return <TeamPage content={content} />;
}
