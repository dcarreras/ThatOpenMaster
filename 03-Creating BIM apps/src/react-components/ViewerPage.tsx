import * as React from "react";
import { useEffect, useState } from "react";
import { ThreeViewer } from "./ThreeViewer";
import { setupComponents } from "../bim-components";
import type * as OBC from "@thatopen/components";

export function ViewerPage() {
    const [viewport, setViewport] = useState<HTMLElement | null>(null);
    const [components, setComponents] = useState<OBC.Components | null>(null);
    const [world, setWorld] = useState<
        OBC.SimpleWorld<OBC.SimpleScene, OBC.OrthoPerspectiveCamera, OBC.SimpleRenderer> | null
    >(null);

    useEffect(() => {
        let isMounted = true;
        let localComponents: OBC.Components | null = null;

        async function setup() {
            const { components, world, viewport } = await setupComponents();
            if (!isMounted) {
                components.dispose();
                return;
            }

            localComponents = components;
            setComponents(components);
            setWorld(world);
            setViewport(viewport);
        }
        void setup();

        return () => {
            isMounted = false;
            if (localComponents) {
                localComponents.dispose();
            }
        };
    }, []);

    return viewport && components && world
        ? <ThreeViewer viewport={viewport} components={components} world={world} />
        : null;
}
