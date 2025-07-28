type DataSetMinMax = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

type Point = {
  x: number;
  y: number;
};

const normalize = ({
  value,
  min,
  max,
  scaleMin = 0,
  scaleMax = 1,
}: {
  value: number;
  min: number;
  max: number;
  scaleMin: number;
  scaleMax: number;
}) => {
  if (min === max) {
    return scaleMin;
  }
  return scaleMin + ((value - min) * (scaleMax - scaleMin)) / (max - min);
};

export const moveTo = (to: Point, from: Point, radius: number) => {
  const vector = { x: to.x - from.x, y: to.y - from.y };
  const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  const unitVector = { x: vector.x / length, y: vector.y / length };

  return {
    x: from.x + unitVector.x * radius,
    y: from.y + unitVector.y * radius,
  };
};

export const getDistanceBetween = (p1: Point, p2: Point) => Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);

export const checkForCollinearPoints = (p1: Point, p2: Point, p3: Point) =>
  (p1.y - p2.y) * (p1.x - p3.x) === (p1.y - p3.y) * (p1.x - p2.x);

export const normalizeDataset = (data: number[], { minX, maxX, minY, maxY }: DataSetMinMax) => {
  const boundariesX = { min: 0, max: data.length - 1 };
  const boundariesY = { min: Math.min(...data), max: Math.max(...data) };

  return data.map((value, index) => ({
    x: normalize({
      value: index,
      min: boundariesX.min,
      max: boundariesX.max,
      scaleMin: minX,
      scaleMax: maxX,
    }),
    y: normalize({
      value,
      min: boundariesY.min,
      max: boundariesY.max,
      scaleMin: minY,
      scaleMax: maxY,
    }),
  }));
};

export const buildSmoothPath = (data: Point[], radius: number) => {
  const [firstPoint, ...otherPoints] = data;

  return otherPoints.reduce((path, point, index) => {
    const next = otherPoints[index + 1];
    const prev = otherPoints[index - 1] || firstPoint;
    const isCollinear = next && checkForCollinearPoints(prev, point, next);
    if (!next || isCollinear) {
      return `${path}\nL ${point.x},${point.y}`;
    }

    const distanceFromPrev = getDistanceBetween(prev, point);
    const distanceFromNext = getDistanceBetween(next, point);
    const threshold = Math.min(distanceFromPrev, distanceFromNext);

    const isTooCloseForRadius = threshold / 2 < radius;

    const radiusForPoint = isTooCloseForRadius ? threshold / 2 : radius;

    const before = moveTo(prev, point, radiusForPoint);
    const after = moveTo(next, point, radiusForPoint);

    return [path, `L ${before.x},${before.y}`, `S ${point.x},${point.y} ${after.x},${after.y}`].join('\n');
  }, `M ${firstPoint.x},${firstPoint.y}`);
};
