import { useCallback } from 'react';
import { useStore, getBezierPath, EdgeLabelRenderer } from 'reactflow';

import getEdgeParams from './utils';

interface FloatingEdgeProps {
  id: string;
  source: any;
  target: any;
  markerEnd: any;
  data: any;
}

const FloatingEdge = (props: FloatingEdgeProps) => {
  const { id, source, target, markerEnd, data } = props;
  const sourceNode = useStore(useCallback((store) => store.nodeInternals.get(source), [source]));
  const targetNode = useStore(useCallback((store) => store.nodeInternals.get(target), [target]));

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  });
  let className = 'custom-edge nodrag nopan';
  if (data.type) {
    className += ` ${data.type.toLowerCase()}`;
  }
  return (
    <>
      <path id={id} className='react-flow__edge-path' d={edgePath} markerEnd={markerEnd} />
      <EdgeLabelRenderer>
        <div
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
          className={className}
        >
          {data.label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default FloatingEdge;
