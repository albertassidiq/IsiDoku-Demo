import { z } from 'zod';

export const sopSchema = z.object({
    pelaksanaColumns: z.array(z.object({
        id: z.string().describe("Unique identifier for the column, e.g., 'col-1'"),
        name: z.string().describe("Name of the executor/role, e.g., 'HRD', 'Employee'")
    })).describe("List of columns representing executors/roles"),

    rows: z.array(z.object({
        id: z.string().describe("Unique identifier for the row, e.g., 'row-1'"),
        no: z.number().describe("Row number"),
        activity: z.string().describe("Description of the activity/step")
    })).describe("List of rows representing process steps"),

    shapes: z.array(z.object({
        id: z.string().describe("Unique identifier for the shape"),
        rowId: z.string().describe("The row ID where this shape belongs"),
        colId: z.string().describe("The column ID where this shape belongs"),
        type: z.enum(['start', 'process', 'decision', 'document', 'end', 'off-page', 'preparation', 'manual-input', 'terminator'])
            .describe("Type of the flowchart shape. 'start' and 'end' use terminator/pill shape. 'process' uses rectangle. 'decision' uses diamond."),
        label: z.string().describe("Text to display inside the shape")
    })).describe("List of shapes to place in the grid"),

    connections: z.array(z.object({
        source: z.object({
            rowId: z.string(),
            colId: z.string(),
            position: z.enum(['top', 'right', 'bottom', 'left'])
        }),
        target: z.object({
            rowId: z.string(),
            colId: z.string(),
            position: z.enum(['top', 'right', 'bottom', 'left'])
        })
    })).describe("List of arrows connecting the shapes")
});

export type SOPData = z.infer<typeof sopSchema>;
