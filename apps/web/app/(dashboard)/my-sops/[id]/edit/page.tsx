import { redirect } from "next/navigation";

import { getSOP } from "@/actions/sop";
import { SOPBuilderContent } from "../../../sop-builder/components/SOPBuilderContent";
import type { SOPSnapshot } from "../../../sop-builder/hooks";

interface EditSOPPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditSOPPage({ params }: EditSOPPageProps) {

    const resolvedParams = await params;
    const sop = await getSOP(resolvedParams.id);

    if (!sop) {
        // Handle 404
        return (
            <div className="flex h-screen items-center justify-center">
                <h1 className="text-2xl font-bold">SOP not found</h1>
            </div>
        )
    }

    // Demo mode: No ownership check

    return (
        <div className="h-full flex flex-col">
            <SOPBuilderContent
                initialData={sop.content as SOPSnapshot}
                initialTitle={sop.title}
                initialDescription={sop.description || ""}
                sopId={sop.id}
                initialPdfUrl={sop.pdfUrl || undefined}
            />
        </div>
    );
}
