import { useEffect, useMemo } from 'react';
import {
  Text,
  Card,
  CardHeader,
  CardContent,
  Button,
} from '@pega/cosmos-react-core';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  MiniMap,
  Controls,
  type EdgeTypes,
  type Node,
  type Edge
} from 'reactflow';
import dagre from 'dagre';

import StyledPegaExtensionsNetworkDiagram from './styles';

import CustomNode from './CustomNode';
import CustomEdge from './CustomEdge';

type NetworkDiagramProps = {
  heading: string;
  height: number;
  showMinimap: boolean;
  showControls: boolean;
  showRefresh: boolean;
  edgePath: "bezier" | "straight" | "step";
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
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

export default function PegaExtensionsNetworkDiagram(props: NetworkDiagramProps) {
  const {
    heading = '',
    height = 500,
    showMinimap = true,
    showControls = true,
    showRefresh = true,
    edgePath = 'bezier',
    getPConnect
  } = props;
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  const getNodesDetails = async () => {
    const initialNodes : Array<Node> = [];
    const initialEdges : Array<Edge> = [];
    const data = await (window as any).PCore.getDataPageUtils().getPageDataAsync('D_DemoGraph', '');
    data.pyNodes.forEach((element: any) => {
      initialNodes.push(
      {
        id: element.pyID,
        data: { id: element.pyID, type: element.pyCategory, label: element.pyLabel, key: element.pzInsKey, objClass: element.pyClassName, getPConnect },
        position,
        type: 'custom'
      });
    });
    data.pyEdges.forEach((element: any, i: number) => {
      initialEdges.push(
      {
        id: element.pyID || `edge-${i}`,
        source: element.pyFrom,
        target: element.pyTo,
        data: { type: element.pyCategory, label: element.pyLabel, path: edgePath},
        type: 'custom'
      });
    });
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      initialNodes,
      initialEdges
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  };

  useEffect( () => {
    getNodesDetails();
  }, [height, edgePath]);

  return (
    <Card>
      <CardHeader actions={
          showRefresh ? (
            <Button variant='primary' onClick={getNodesDetails}>
              Refresh
            </Button>
          ) : undefined
        }>
        <Text variant='h2'>{heading}</Text>
      </CardHeader>
      <CardContent>
          <StyledPegaExtensionsNetworkDiagram height={height}>
            <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            proOptions={{hideAttribution: true}}
          >
            {showMinimap ? <MiniMap /> : null}
            {showControls ? <Controls /> : null}
          </ReactFlow>
        </StyledPegaExtensionsNetworkDiagram>
      </CardContent>
    </Card>
  );
}
