import * as OBC from "@thatopen/components";
import * as THREE from "three";

export function createWorld(components: OBC.Components) {
    const worlds = components.get(OBC.Worlds);

    const world = worlds.create<
        OBC.SimpleScene,
        OBC.OrthoPerspectiveCamera,
        OBC.SimpleRenderer
    >();

    world.scene = new OBC.SimpleScene(components);
    world.scene.setup();

    const viewport = document.createElement("div");
    viewport.className = "bim-viewer__viewport";
    viewport.style.cssText = "flex: 1; width: 100%; min-height: 0; position: relative; overflow: hidden;";

    world.renderer = new OBC.SimpleRenderer(components, viewport);
    world.camera = new OBC.OrthoPerspectiveCamera(components);
    world.renderer.resize();
    world.camera.updateAspect();

    new ResizeObserver(() => {
        world.renderer?.resize();
        world.camera.updateAspect();
    }).observe(viewport);

    const raycasters = components.get(OBC.Raycasters);
    raycasters.get(world);

    const grids = components.get(OBC.Grids);
    grids.config.color = new THREE.Color(0x94a3b8);
    grids.config.distance = 1500;
    grids.config.size1 = 1;
    grids.config.size2 = 10;
    const grid = grids.create(world);
    grid.fade = false;

    const fragments = components.get(OBC.FragmentsManager);
    const syncWorldMeshes = () => {
        world.meshes.clear();
        for (const mesh of fragments.meshes) {
            world.meshes.add(mesh);
        }
    };

    fragments.onFragmentsLoaded.add((group) => {
        world.scene.three.add(group);
        syncWorldMeshes();
    });

    fragments.onFragmentsDisposed.add(() => {
        syncWorldMeshes();
    });

    return { world, viewport };
}
