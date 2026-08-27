# The Weekender Map story layers

This public directory contains only the seven vector overlays used by the Map
story. They were extracted from the genuine optional-content groups in
`SPR The Weekender A1.1[65].pdf` (SHA-256 `fdcc1f6e...c58a050`), not from the
older flattened PDF.

Every SVG has a transparent `4096 × 2651` canvas and the same shared
similarity registration to `public/ridge/site-map-view.jpg`:

```text
x' = 0.665922398513x - 0.045865119195y + 610.245447030
y' = 0.045865119195x + 0.665922398513y + 338.604099104
```

The seven story layers are topography, driveway, emergency turnaround,
carport, mine opening, utility service, and property lines. Tree
inventory circles are intentionally omitted because the aerial already shows
the forest directly. Deck, lodge
floor-plan details, and the steel-grate walkway are intentionally excluded so
the Map story does not repeat the Aerial story.

`1182_Topo.pdf` (SHA-256 `26fbfb02...3fd17`) is a signed field-survey
cross-check. Its untagged survey vectors confirm the selected contours, parcel,
and mine-opening geometry within roughly 2–3 pixels around
the core site, but are not added as a second overlapping runtime layer set.

Rebuild in two stages with `scripts/extract_weekender_ocg_layers.py`, then
`scripts/build_weekender_map_layers.py`. The complete 26-layer extraction,
audit, previews, manifests, and checksums are kept outside the deployed public
tree under `output/pdf/weekender-site-plan-layers-65/`.
