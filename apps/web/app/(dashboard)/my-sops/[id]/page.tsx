
import { notFound } from "next/navigation";
import { db } from "@/db/drizzle";
import { sops } from "@/db/schema";
import { eq } from "drizzle-orm";

import SOPViewer from "./SOPViewer";

interface SOPViewPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function SOPViewPage({ params }: SOPViewPageProps) {
    const { id } = await params;

    const sop = await db.query.sops.findFirst({
        where: eq(sops.id, id),
    });

    if (!sop) {
        notFound();
    }

    // Demo mode: No ownership check

    return <SOPViewer sop={sop} />;
}
