import { useEffect, useMemo, useCallback } from 'react';
import {
  registerIcon,
  Icon,
  Text,
  Card,
  CardHeader,
  CardContent,
  Button,
  Configuration,
  useTheme
} from '@pega/cosmos-react-core';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  MiniMap,
  Controls,
  MarkerType,
  type EdgeTypes,
  type Node,
  type Edge
} from 'reactflow';
import dagre from 'dagre';

import StyledPegaExtensionsNetworkDiagram from './styles';

import CustomNode from './CustomNode';
import CustomEdge from './CustomEdge';
import * as resetIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/reset.icon';

registerIcon(resetIcon);
interface StringHashMap {
  [key: string]: string;
}

type NetworkDiagramProps = {
  heading: string;
  height: string;
  showMinimap: boolean;
  showControls: boolean;
  showRefresh: boolean;
  edgePath: 'bezier' | 'straight' | 'step';
  getPConnect: any;
};

const position = { x: 0, y: 0 };
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 150;
const nodeHeight = 150;

const getLayoutedElements = (nodes: Array<Node>, edges: Array<Edge>, direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node: Node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge: Edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node: any) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? 'left' : 'top';
    node.sourcePosition = isHorizontal ? 'right' : 'bottom';
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2
    };

    return node;
  });

  return { nodes, edges };
};

const edgeTypes: EdgeTypes = {
  custom: CustomEdge
};

export default function PegaExtensionsNetworkDiagram(props: NetworkDiagramProps) {
  const {
    heading = '',
    height = '40rem',
    showMinimap = true,
    showControls = true,
    showRefresh = true,
    edgePath = 'bezier',
    getPConnect
  } = props;
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);
  const theme = useTheme();

  const defaultViewport = { x: 0, y: 0, zoom: 3 };

  const getNodesDetails = useCallback(async () => {
    const initialNodes: Array<Node> = [];
    const initialEdges: Array<Edge> = [];
    const tmpNodesHash: StringHashMap = {};
    const data = await (window as any).PCore.getDataPageUtils().getPageDataAsync('D_DemoGraph', '');
    data.pyNodes.forEach((element: any) => {
      tmpNodesHash[element.pyID] = element.pyLabel;
      initialNodes.push({
        id: element.pyID,
        data: {
          id: element.pyID,
          type: element.pyCategory,
          label: element.pyLabel,
          key: element.pzInsKey,
          objClass: element.pyClassName,
          getPConnect,
          theme
        },
        position,
        type: 'custom'
      });
    });
    data.pyEdges.forEach((element: any, i: number) => {
      const ariaLabel = `Relation from ${tmpNodesHash[element.pyFrom]} to ${
        tmpNodesHash[element.pyTo]
      } with label: ${element.pyLabel}`;
      initialEdges.push({
        id: element.pyID || `edge-${i}`,
        source: element.pyFrom,
        target: element.pyTo,
        data: { type: element.pyCategory, label: element.pyLabel, path: edgePath, theme },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: theme.base.palette['foreground-color']
        },
        style: {
          strokeWidth: 2,
          stroke: theme.base.palette['foreground-color']
        },
        type: 'custom',
        ariaLabel
      });
    });
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      initialNodes,
      initialEdges
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [edgePath, getPConnect, setEdges, setNodes, theme]);

  useEffect(() => {
    getNodesDetails();
  }, [height, edgePath, getNodesDetails]);

  return (
    <Configuration>
      <Card>
        <CardHeader
          actions={
            showRefresh ? (
              <Button
                variant='simple'
                label='Reload diagram'
                icon
                compact
                onClick={getNodesDetails}
              >
                <Icon name='reset' />
              </Button>
            ) : undefined
          }
        >
          <Text variant='h2'>{heading}</Text>
        </CardHeader>
        <CardContent>
          <StyledPegaExtensionsNetworkDiagram height={height} theme={theme}>
            <ReactFlow
              dir='ltr'
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              fitView
              defaultViewport={defaultViewport}
              proOptions={{ hideAttribution: true }}
            >
              {showMinimap ? <MiniMap /> : null}
              {showControls ? <Controls /> : null}
            </ReactFlow>
          </StyledPegaExtensionsNetworkDiagram>
        </CardContent>
      </Card>
    </Configuration>
  );
}
