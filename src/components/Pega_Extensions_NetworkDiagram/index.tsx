import { useEffect, useMemo, useState } from 'react';
import {
  withConfiguration,
  registerIcon,
  Icon,
  Text,
  Card,
  CardHeader,
  CardContent,
  Button,
  useTheme,
} from '@pega/cosmos-react-core';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  MiniMap,
  Controls,
  MarkerType,
  ConnectionMode,
  type Node,
  type Edge,
} from 'reactflow';
import dagre from '@dagrejs/dagre';

import StyledPegaExtensionsNetworkDiagram from './styles';

import CustomNode from './CustomNode';
import CustomEdge from './CustomEdge';
import FloatingEdge from './FloatingEdge';
import * as resetIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/reset.icon';
import '../shared/create-nonce';

registerIcon(resetIcon);
interface StringHashMap {
  [key: string]: string;
}

export interface NetworkDiagramProps {
  /** Heading of the widget */
  heading: string;

  /** Name of the data page that will be called to get the Nodes and Edges */
  dataPage: string;

  /** If the DP is parameterized, this property will be passed as pyGUID parameter */
  selectionProperty?: string;

  /** Height of the diagram
   * @default 40rem
   */
  height?: string;
  /** Show the minimap on the diagram
   * @default true
   */
  showMinimap?: boolean;
  /** Show the controls panel in the diagram
   * @default true
   */
  showControls?: boolean;
  /** Show the refresh button to reload the DP and recenter the diagram
   * @default true
   */
  showRefresh?: boolean;
  /** Type of layout for the edges
   * @default bezier
   */
  edgePath?: 'bezier' | 'straight' | 'step' | 'floating';
  getPConnect: any;
}

const position = { x: 0, y: 0 };
const nodeWidth = 160;
const nodeHeight = 160;

const getLayoutedElements = (nodes: Array<Node>, edges: Array<Edge>) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'TB' });

  nodes.forEach((node: Node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge: Edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node: any) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = 'top';
    node.sourcePosition = 'bottom';
    node.position = {
      x: nodeWithPosition.x,
      y: nodeWithPosition.y,
    };

    return node;
  });

  return { nodes, edges };
};
const edgeTypes: any = {
  custom: CustomEdge,
  floating: FloatingEdge,
};
function Flow(props: any) {
  const {
    dataPage = 'D_DemoGraph',
    selectionProperty = '',
    height = '40rem',
    showMinimap = true,
    showControls = true,
    edgePath = 'bezier',
    counter,
    getPConnect,
  } = props;

  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);
  const theme = useTheme();

  useEffect(() => {
    async function getNodesDetails() {
      const initialNodes: Array<Node> = [];
      const initialEdges: Array<Edge> = [];
      const tmpNodesHash: StringHashMap = {};
      let parameters;
      if (selectionProperty) {
        parameters = { pyGUID: selectionProperty };
      }
      const context = getPConnect().getContextName();
      const data = await (window as any).PCore.getDataPageUtils().getPageDataAsync(dataPage, context, parameters, {
        invalidateCache: true,
      });
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
            theme,
          },
          position,
          type: 'custom',
        });
      });
      data.pyEdges.forEach((element: any, i: number) => {
        const ariaLabel = `${getPConnect().getLocalizedValue('Relation from')} ${tmpNodesHash[element.pyFrom]} ${getPConnect().getLocalizedValue(
          'to',
        )} ${tmpNodesHash[element.pyTo]} ${getPConnect().getLocalizedValue('with label:')} ${element.pyLabel}`;
        const edge: any = {
          id: element.pyID || `edge-${i}`,
          source: element.pyFrom,
          target: element.pyTo,
          data: { type: element.pyCategory, label: element.pyLabel, path: edgePath, theme },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: theme.base.palette['foreground-color'],
          },
          style: {
            strokeWidth: 2,
            stroke: theme.base.palette['foreground-color'],
          },
          type: 'floating',
          ariaLabel,
        };
        if (edgePath !== 'floating') {
          edge.type = 'custom';
          edge.sourceHandle = 'c';
          edge.targetHandle = 'a';
        }
        initialEdges.push(edge);
      });
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEdges);
      if (edgePath !== 'floating') {
        /* If fixed (top -> bottom - need to see if we need to reverse from bottom -> top ) */
        const layoutedNodesHash: any = {};
        layoutedNodes.forEach((node: any) => {
          layoutedNodesHash[node.id] = node.position.y;
        });
        const layoutedEdgesUpdated = layoutedEdges.map((edge: any) => {
          const src = layoutedNodesHash[edge.source];
          const target = layoutedNodesHash[edge.target];
          if (src > target) {
            return { ...edge, sourceHandle: 'a', targetHandle: 'c' };
          }
          return edge;
        });
        setNodes(layoutedNodes);
        setEdges(layoutedEdgesUpdated);
      } else {
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
      }
      setTimeout(() => {
        fitView();
      }, 10);
    }
    getNodesDetails();
  }, [height, edgePath, counter, setNodes, setEdges, getPConnect, theme, fitView, dataPage, selectionProperty]);

  return (
    <ReactFlow
      dir='ltr'
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      proOptions={{ hideAttribution: true }}
      connectionMode={ConnectionMode.Loose}
    >
      {showMinimap ? <MiniMap /> : null}
      {showControls ? <Controls /> : null}
    </ReactFlow>
  );
}

export const PegaExtensionsNetworkDiagram = (props: NetworkDiagramProps) => {
  const { showRefresh = true, heading = '', height = '40rem' } = props;
  const theme = useTheme();
  const [counter, setCounter] = useState<number>(1);
  const refreshDiagram = () => {
    setCounter((prev) => prev + 1);
  };
  return (
    <Card>
      <CardHeader
        actions={
          showRefresh ? (
            <Button
              variant='simple'
              label={props.getPConnect().getLocalizedValue('Reload diagram')}
              icon
              compact
              onClick={refreshDiagram}
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
          <ReactFlowProvider>
            <Flow {...props} counter={counter} />
          </ReactFlowProvider>
        </StyledPegaExtensionsNetworkDiagram>
      </CardContent>
    </Card>
  );
};
export default withConfiguration(PegaExtensionsNetworkDiagram);
