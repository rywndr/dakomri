declare module "jspdf-autotable" {
    import { jsPDF } from "jspdf";

    interface AutoTableOptions {
        head?: (string | number)[][];
        body?: (string | number)[][];
        foot?: (string | number)[][];
        startY?: number;
        margin?:
            | number
            | { top?: number; right?: number; bottom?: number; left?: number };
        pageBreak?: "auto" | "avoid" | "always";
        rowPageBreak?: "auto" | "avoid";
        tableWidth?: "auto" | "wrap" | number;
        showHead?: "everyPage" | "firstPage" | "never";
        showFoot?: "everyPage" | "lastPage" | "never";
        tableLineColor?: number | number[];
        tableLineWidth?: number;
        styles?: Partial<CellDef>;
        headStyles?: Partial<CellDef>;
        bodyStyles?: Partial<CellDef>;
        footStyles?: Partial<CellDef>;
        alternateRowStyles?: Partial<CellDef>;
        columnStyles?: { [key: string | number]: Partial<CellDef> };
        theme?: "striped" | "grid" | "plain";
        didDrawPage?: (data: HookData) => void;
        didDrawCell?: (data: CellHookData) => void;
        willDrawCell?: (data: CellHookData) => void;
        didParseCell?: (data: CellHookData) => void;
        horizontalPageBreak?: boolean;
        horizontalPageBreakRepeat?: number | number[];
    }

    interface CellDef {
        cellWidth?: "auto" | "wrap" | number;
        minCellWidth?: number;
        minCellHeight?: number;
        halign?: "left" | "center" | "right";
        valign?: "top" | "middle" | "bottom";
        fontSize?: number;
        cellPadding?:
            | number
            | { top?: number; right?: number; bottom?: number; left?: number };
        lineColor?: number | number[];
        lineWidth?: number;
        fontStyle?: "normal" | "bold" | "italic" | "bolditalic";
        overflow?: "linebreak" | "ellipsize" | "visible" | "hidden";
        fillColor?: number | number[] | false;
        textColor?: number | number[];
        font?: string;
    }

    interface HookData {
        table: unknown;
        pageNumber: number;
        pageCount: number;
        settings: AutoTableOptions;
        cursor: { x: number; y: number };
    }

    interface CellHookData extends HookData {
        cell: {
            raw: string | number;
            text: string[];
            x: number;
            y: number;
            width: number;
            height: number;
        };
        row: {
            index: number;
            raw: (string | number)[];
        };
        column: {
            index: number;
            dataKey: string | number;
        };
        section: "head" | "body" | "foot";
    }

    function autoTable(doc: jsPDF, options: AutoTableOptions): void;

    export default autoTable;
}

declare module "jspdf" {
    interface jsPDF {
        lastAutoTable?: {
            finalY: number;
        };
        previousAutoTable?: {
            finalY: number;
        };
    }
}
