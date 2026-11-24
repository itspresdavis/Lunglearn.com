# Anatomy coverage

The bundled model is an adult male thoracic and airway subset. It is one modeled body from BodyParts3D, not a population average.

## Present as selectable meshes

Skeletal structures in the subset, including the body of the sternum, clavicles, and ribs. External and internal intercostal muscles, simplified by 5 mm clustering and labeled as such. Diaphragm, also clustered. Larynx cartilages, epiglottis, vocal ligaments, trachea, both main bronchi, and the sided bronchial trees that the selection rules kept, including lingular bronchi. Pulmonary trunk, right and left pulmonary arteries, four pulmonary veins. Heart chamber cavities. Coronary trunks. Esophagus. A small set of nasal cartilages.

Heart cavities are on the cardiovascular layer. Only structures whose names contain “coronary” are on the coronary layer.

## Systems and layers with no mesh in this file

The viewer lists all eleven organ systems and the requested circulation, nerve, lymph, ligament, tendon, fascia, joint, and connective layers. A checkbox is disabled, with the text “not in this asset,” when the GLB has no mesh on that layer. Disabled layers include integument, nervous system, endocrine, lymphatic, urinary, reproductive, cerebral circulation, peripheral and cranial nerves, lymph vessels and nodes, tendons, fascia, and joints.

## Known gaps inside the respiratory subject

- No lung parenchyma mesh. The lungs page is text.
- No pleural mesh.
- No separate carina mesh. The trachea and both main bronchi are the related meshes.
- No alveolus, alveolar duct, or capillary mesh. The alveolus page uses a labeled schematic and says it is not to scale with the thoracic model.
- No phrenic nerve and no vagus nerve.
- Right middle lobe segmental bronchi were not in the sided bronchial set that was imported.
- No female body. A female model will be a separate licensed dataset, not a recolor.
- No disease-specific geometry.

## Interaction that is implemented

Orbit, zoom, and pan. Anterior, posterior, left, right, and superior views using the measured axes. Shift-click multi-select. Hide, isolate, and restore. Per-layer opacity for layers that have meshes. Sagittal, coronal, and transverse clipping. A depth slider. A spacing control labeled as a viewing aid. Saved views in local storage. Full screen. Screenshot with the CC BY credit. An identification check against a real mesh name. Keyboard focus on the canvas so orbit controls receive keys. Pinch and drag come from the orbit controls. If WebGL fails, the structure list remains.

## Interaction that is not claimed

Exploded views are spacing, not a dissection atlas. The schematic breath shortens only the diaphragm mesh and is labeled as a simplification. No performance frame time was recorded on an M1 or a phone. The measured facts are the triangle count and the file size.
