import { buildSmoothPath, normalizeDataset } from './utils';

type TrendGraphProps = {
  colorValue: string;
  radius?: number;
  padding?: number;
  data: number[];
  width?: number;
  height?: number;
};

const TrendGraph = (props: TrendGraphProps) => {
  const { colorValue, radius = 3, padding = 2, width = 300, height = 75, data = [] } = props;

  if (!data || data.length < 2) {
    return null;
  }

  const normalizedValues = normalizeDataset(data, {
    minX: padding,
    maxX: width - padding,
    minY: height - padding,
    maxY: padding,
  });

  const path = buildSmoothPath(normalizedValues, radius);

  return (
    <svg width='120px' strokeWidth='1' strokeLinecap='butt' stroke={colorValue} viewBox={`0 0 ${width} ${height}`}>
      <path d={path} fill='none' />
    </svg>
  );
};

export default TrendGraph;
