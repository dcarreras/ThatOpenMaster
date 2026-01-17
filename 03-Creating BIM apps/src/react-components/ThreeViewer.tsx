import { useEffect, useRef } from "react";
import { html, type Grid } from "@thatopen/ui";

type GridElements = [
    { name: "header"; state: Record<string, unknown> },
    { name: "sidebar"; state: Record<string, unknown> },
    { name: "componentsGrid"; state: Record<string, unknown> }
];
type BeamGrid = Grid<["main"], GridElements>;

export function ThreeViewer() {
    const viewerGridRef = useRef<BeamGrid | null>(null);

    useEffect(() => {
        if (!viewerGridRef.current) {
            return;
        }

        const elements = {
            header: {
                template: () => html`
                    <header class="viewer-grid__header">
                        <div class="viewer-grid__brand">
                            <span class="viewer-grid__logo">BIM</span>
                            <div class="viewer-grid__brand-text">
                                <div class="viewer-grid__title">Proyecto actual</div>
                                <div class="viewer-grid__subtitle">Vista general</div>
                            </div>
                        </div>
                        <div class="viewer-grid__actions">
                            <beam-button label="Guardar"></beam-button>
                            <beam-button label="Compartir"></beam-button>
                        </div>
                    </header>
                `,
                initialState: {}
            },
            sidebar: {
                template: () => html`
                    <aside class="viewer-grid__sidebar">
                        <div>
                            <div class="viewer-grid__section-title">Herramientas</div>
                            <div class="viewer-grid__tool-list">
                                <beam-button label="Seleccionar"></beam-button>
                                <beam-button label="Medir"></beam-button>
                                <beam-button label="Seccion"></beam-button>
                                <beam-button label="Aislar"></beam-button>
                            </div>
                        </div>
                        <div>
                            <div class="viewer-grid__section-title">Capas</div>
                            <div class="viewer-grid__chip-list">
                                <span class="viewer-grid__chip">Estructura</span>
                                <span class="viewer-grid__chip">MEP</span>
                                <span class="viewer-grid__chip">Arquitectura</span>
                            </div>
                        </div>
                    </aside>
                `,
                initialState: {}
            },
            componentsGrid: {
                template: () => html`
                    <section class="viewer-grid__main">
                        <div class="viewer-grid__viewport">
                            <div class="viewer-grid__viewport-title">Viewport 3D</div>
                            <div class="viewer-grid__viewport-hint">
                                Arrastra para orbitar y usa la rueda para zoom.
                            </div>
                        </div>
                        <div class="viewer-grid__panel">
                            <div class="viewer-grid__panel-title">Propiedades</div>
                            <div class="viewer-grid__panel-body">
                                Selecciona un elemento para ver detalles.
                            </div>
                        </div>
                    </section>
                `,
                initialState: {}
            }
        };

        const rows = ["72px", "1fr"];
        const columns = ["260px", "1fr"];
        const layouts = {
            main: {
                template: `
                    "header header" ${rows[0]}
                    "sidebar componentsGrid" ${rows[1]}
                    / ${columns.join(" ")}
                `,
                rows,
                columns
            }
        };

        viewerGridRef.current.elements = elements;
        viewerGridRef.current.layouts = layouts;
        viewerGridRef.current.layout = "main";
    }, []);

    return <beam-grid ref={viewerGridRef} className="viewer-grid dashboard-card" />;
}
