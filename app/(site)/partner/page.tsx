import { Suspense } from "react";
import { redirect } from "next/navigation";
import { requestPath } from "@/content/requests";

async function PartnerQueryRedirect({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  redirect(requestPath(type));
  return null;
}

export default function PartnerRedirect({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <PartnerQueryRedirect searchParams={searchParams} />
    </Suspense>
  );
}
