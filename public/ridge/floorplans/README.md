# The Weekender floor-plan layers

These assets were extracted from `Weekender Floor Plan Presentation.pdf` without retracing the architecture.

- `source/loft-vector-master.pdf` and `source/ground-vector-master.pdf` preserve the original AutoCAD vector geometry and optional-content groups.
- `loft-plan.png` and `ground-plan.png` are transparent white source textures rendered at one shared points-to-pixels scale.
- `ground-core.png` is the Ground-story texture. It clips the drawing to the lodge envelope so the deck and steel-grate approach appear only in their dedicated highlight beats, while retaining narrow shared-edge overlaps so the lodge perimeter remains continuous.
- `ground-deck.png` uses the Ground texture's exact canvas and registration, but keeps only the deck region for sequential highlighting. Its aerial presentation is compressed to 0.7925× along the plan's x-axis with the lodge-side connection pinned at source `x = 997`, aligning the fire-pit end to the rendered concrete wall.
- `ground-walkway.png` reconstructs the complete T-shaped steel-grate approach from audited vector rails and grate bars, without people, hardware, lodge walls, or deck linework. Its aerial presentation is extended 1.32× along the plan's y-axis with the lodge connection pinned at source `y = 860`; the free end is retracted by one full projected walkway width while the lodge connection stays fixed.
- `*-aerial.png` files are lossless, full-aerial fallbacks generated with the same projective control points used by Three.js.
- `manifest.json` records source bounds, layer names, and runtime scale so later site/aerial calibration can start from the vector masters.

The runtime textures intentionally keep architectural detail and furniture lightly visible for orientation. Three.js performs a calibrated projective warp; labels and leader lines remain DOM/SVG so typography stays sharp.
