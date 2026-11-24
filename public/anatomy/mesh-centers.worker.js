self.onmessage = (event) => {
  const positions = event.data.positions;
  let x = 0;
  let y = 0;
  let z = 0;
  const count = Math.max(1, positions.length / 3);
  for (let index = 0; index < positions.length; index += 3) {
    x += positions[index];
    y += positions[index + 1];
    z += positions[index + 2];
  }
  self.postMessage({ id: event.data.id, center: [x / count, y / count, z / count] });
};
