import * as React from "react";

interface ErrorDialogProps {
    message: string | null;
    onClose: () => void;
}

export function ErrorDialog({ message, onClose }: ErrorDialogProps) {
    const dialogRef = React.useRef<HTMLDialogElement | null>(null);
    const isOpen = Boolean(message);

    React.useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) {
            return;
        }
        if (isOpen) {
            if (!dialog.open) {
                dialog.showModal();
            }
        } else if (dialog.open) {
            dialog.close();
        }
    }, [isOpen]);

    return (
        <dialog
            id="error-popup"
            className="error-popup"
            ref={dialogRef}
            onClose={onClose}
        >
            <div className="error-content">
                <h2 style={{ color: "white" }}>Error</h2>
                <p className="error-message">{message ?? "An error occurred."}</p>
                <button className="error-button" onClick={() => dialogRef.current?.close()}>
                    Close
                </button>
            </div>
        </dialog>
    );
}
