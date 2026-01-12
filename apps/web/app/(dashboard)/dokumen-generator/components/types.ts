export interface DataRow {
    id: string;
    [key: string]: string;
}

export interface FileState {
    file: File | null;
    variables: string[];
    templateBuffer: ArrayBuffer | null;
}

export interface AlertState {
    isOpen: boolean;
    title: string;
    message: string;
    type: "info" | "error" | "confirm";
    onConfirm?: () => void;
}
