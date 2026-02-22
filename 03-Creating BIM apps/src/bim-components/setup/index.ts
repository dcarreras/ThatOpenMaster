import * as OBC from "@thatopen/components";
import { createWorld } from "./src/create-world";

export async function setupComponents() {
    const components = new OBC.Components();
    const { world, viewport } = createWorld(components);
    components.init();
    await world.camera.projection.set("Perspective");
    await world.camera.controls.setLookAt(12, 10, 12, 0, 0, 0);
    return { components, world, viewport };
}
