import { useEffect, useRef } from "react";
import type { ChangeEvent } from "react";
import type { FragmentsGroup } from "@thatopen/fragments";
import * as OBC from "@thatopen/components";
import * as THREE from "three";

interface ThreeViewerProps {
    viewport: HTMLElement;
    components: OBC.Components;
    world: OBC.SimpleWorld<OBC.SimpleScene, OBC.OrthoPerspectiveCamera, OBC.SimpleRenderer>;
}

export function ThreeViewer({ viewport, components, world }: ThreeViewerProps) {
    const viewportHostRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const ifcReadyRef = useRef(false);
    const ifcFallbackRef = useRef(false);
    const loadingRef = useRef(false);

    useEffect(() => {
        const host = viewportHostRef.current;
        if (!host) {
            return;
        }

        viewport.classList.add("bim-viewer__viewport");
        host.replaceChildren(viewport);

        requestAnimationFrame(() => {
            world.renderer?.resize();
            world.camera.updateAspect();
        });
    }, [viewport, world]);

    const handlePickIfc = () => {
        fileInputRef.current?.click();
    };

    const handleZoom = async (direction: "in" | "out") => {
        const controls = world.camera.controls;
        if (!controls) {
            return;
        }

        const isOrtho = world.camera.three instanceof THREE.OrthographicCamera;
        if (isOrtho) {
            const zoomStep = direction === "in" ? 0.2 : -0.2;
            await controls.zoom(zoomStep, true);
            return;
        }

        const baseStep = Math.max(0.5, controls.distance * 0.1);
        const dollyStep = direction === "in" ? baseStep : -baseStep;
        await controls.dolly(dollyStep, true);
    };

    const handleFit = async () => {
        const fragments = components.get(OBC.FragmentsManager);
        if (fragments.meshes.length > 0) {
            await world.camera.fit(fragments.meshes);
        } else {
            await world.camera.controls.setLookAt(12, 10, 12, 0, 0, 0);
        }
    };

    const handleIfcChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || loadingRef.current) {
            event.target.value = "";
            return;
        }

        loadingRef.current = true;
        try {
            const buffer = await file.arrayBuffer();
            const data = new Uint8Array(buffer);
            const ifcLoader = components.get(OBC.IfcLoader);

            if (!ifcReadyRef.current) {
                await ifcLoader.setup({ autoSetWasm: true });
                ifcReadyRef.current = true;
            }

            const fragments = components.get(OBC.FragmentsManager);
            for (const group of [...fragments.groups.values()]) {
                fragments.disposeGroup(group);
            }
            let loadedGroup: FragmentsGroup | null = null;
            try {
                loadedGroup = await ifcLoader.load(data);
            } catch (error) {
                if (!ifcFallbackRef.current) {
                    ifcFallbackRef.current = true;
                    await ifcLoader.setup({
                        autoSetWasm: false,
                        wasm: {
                            path: "/web-ifc/",
                            absolute: true
                        }
                    });
                    loadedGroup = await ifcLoader.load(data);
                } else {
                    throw error;
                }
            }

            if (loadedGroup) {
                world.scene.three.add(loadedGroup);
            }

            if (fragments.meshes.length > 0) {
                await world.camera.fit(fragments.meshes);
            }
        } catch (error) {
            console.error("Error loading IFC:", error);
        } finally {
            loadingRef.current = false;
            event.target.value = "";
        }
    };

    return (
        <div className="bim-viewer">
            <div ref={viewportHostRef} className="bim-viewer__viewport-host" />
            <div className="bim-viewer__toolbar">
                <button type="button" className="bim-viewer__button" onClick={handlePickIfc}>
                    Load IFC
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".ifc"
                    onChange={handleIfcChange}
                    style={{ display: "none" }}
                />
            </div>
            <div className="bim-viewer__toolbar bim-viewer__toolbar--bottom">
                <button
                    type="button"
                    className="bim-viewer__button bim-viewer__button--ghost"
                    onClick={() => handleZoom("out")}
                    title="Zoom out"
                >
                    −
                </button>
                <button
                    type="button"
                    className="bim-viewer__button bim-viewer__button--ghost"
                    onClick={() => handleZoom("in")}
                    title="Zoom in"
                >
                    +
                </button>
                <button
                    type="button"
                    className="bim-viewer__button bim-viewer__button--ghost"
                    onClick={handleFit}
                >
                    Fit View
                </button>
            </div>
        </div>
    );
}
