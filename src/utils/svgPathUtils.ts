// Compute the centroid of an SVG path polygon
export function computeCentroid(svgPath: string): { x: number; y: number } {
  const coords = svgPath.match(/[\d.]+/g);
  if (!coords || coords.length < 4) return { x: 0, y: 0 };

  let sumX = 0;
  let sumY = 0;
  let count = 0;

  for (let i = 0; i < coords.length; i += 2) {
    sumX += parseFloat(coords[i]);
    sumY += parseFloat(coords[i + 1]);
    count++;
  }

  return { x: sumX / count, y: sumY / count };
}
