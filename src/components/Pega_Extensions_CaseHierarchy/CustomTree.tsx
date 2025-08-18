import {
  forwardRef,
  createContext,
  useMemo,
  useContext,
  useCallback,
  useState,
  type KeyboardEvent,
  useEffect,
  useRef,
} from 'react';
import type { FunctionComponent, PropsWithoutRef, MouseEvent, CSSProperties } from 'react';

import { Flex, useConsolidatedRef, useFocusWithin, treeHelpers, Button, Link } from '@pega/cosmos-react-core';
import type { ForwardProps, TreeProps } from '@pega/cosmos-react-core';

import {
  StyledCustomTreeParent,
  StyledCustomTreeItemSubTree,
  StyledCustomTree,
  StyledNodeInteraction,
  StyledLabelContent,
  StyledToggleIcon,
  StyledCustomTreeLeaf,
  StyledCustomTreeNode,
} from './CustomTree.styles';

import type {
  CustomTreeContextProps,
  CustomTreeNode,
  CustomTreeProps,
  CustomTreePropsWithDefaults,
} from './CustomTree.types';

const CustomTreeContext = createContext<
  Pick<
    CustomTreePropsWithDefaults,
    | 'currentNodeId'
    | 'onNodeClick'
    | 'onNodeToggle'
    | 'firstNodeId'
    | 'lastNodeId'
    | 'getPConnect'
    | 'focusedNodeId'
    | 'changeFocusedNodeId'
  >
>({
  currentNodeId: undefined,
  onNodeClick: () => {},
  onNodeToggle: () => {},
  firstNodeId: undefined,
  lastNodeId: undefined,
  getPConnect: undefined,
  focusedNodeId: undefined,
  changeFocusedNodeId: () => {},
});

const NodeRenderer: TreeProps<CustomTreeNode>['nodeRenderer'] = ({
  id,
  label,
  depth,
  hasParentSibling,
  nodes,
  expanded = false,
  subTree,
  onClick,
  href,
  objclass,
}) => {
  const {
    currentNodeId,
    onNodeClick,
    onNodeToggle,
    focusedNodeId,
    changeFocusedNodeId,

    getPConnect,
  } = useContext(CustomTreeContext);
  const current = currentNodeId === id;
  const focusedEl = focusedNodeId === id;

  const ariaCurrent = useMemo(() => {
    return href ? 'page' : 'true';
  }, [href]);

  const handleParentClick = useCallback(
    (e: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => {
      onNodeClick?.(id, e);
      changeFocusedNodeId(id);
    },
    [id, onNodeClick, changeFocusedNodeId],
  );

  const handleParentToggle = useCallback(
    (e: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      onNodeToggle?.(id, e);
      changeFocusedNodeId(id);
    },
    [id, onNodeToggle, changeFocusedNodeId],
  );

  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focusedEl) {
      elRef?.current?.focus();
    }
  }, [focusedEl]);

  const labelContent = useMemo(() => {
    const internal = href ? (
      <Flex container={{ alignItems: 'center', gap: 0.5 }} as={StyledLabelContent}>
        <Link
          href={href}
          previewable
          onPreview={() => {
            getPConnect().getActionsApi().showCasePreview(encodeURI(id), { caseClassName: objclass });
          }}
          onClick={(e: MouseEvent<HTMLButtonElement>) => {
            /* for links - need to set onClick for spa to avoid full reload - (cmd | ctrl) + click for opening in new tab */
            if (!e.metaKey && !e.ctrlKey) {
              e.preventDefault();
              getPConnect().getActionsApi().openWorkByHandle(id, objclass);
            }
          }}
        >
          {label}
        </Link>
      </Flex>
    ) : (
      <Flex container={{ alignItems: 'center', gap: 0.5 }} as={StyledLabelContent}>
        {label}
      </Flex>
    );

    return !nodes && (onClick ?? onNodeClick) ? (
      <Flex
        container={{ alignItems: 'center', justify: 'between', gap: 2 }}
        as={StyledNodeInteraction}
        role='treeitem'
        aria-current={current ? ariaCurrent : undefined}
        onClick={(e: MouseEvent<HTMLElement>) => {
          onClick?.(id, e);
          onNodeClick?.(id, e);
          changeFocusedNodeId(id);
        }}
        ref={elRef}
      >
        {internal}
      </Flex>
    ) : (
      internal
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, label, nodes, onClick, onNodeClick, current, focusedEl, changeFocusedNodeId]);

  return (
    <div role='tree'>
      <StyledCustomTreeNode
        id={id.replaceAll(' ', '')}
        style={
          {
            '--depth': depth,
            '--has-parent': depth ? 1 : 0,
            '--has-parent-sibling': hasParentSibling ? 1 : 0,
          } as CSSProperties
        }
      >
        {nodes ? (
          <>
            <Flex
              container={{ alignItems: 'center', justify: 'between', gap: 2 }}
              as={StyledCustomTreeParent}
              role='treeitem'
              aria-current={current ? ariaCurrent : undefined}
              variant='text'
              onClick={handleParentClick}
              aria-expanded={expanded ? 'true' : 'false'}
              aria-owns={`${id.replaceAll(' ', '')}-subtree`}
              aria-label={label}
              ref={elRef}
            >
              <Flex container={{ alignItems: 'center' }} as='span'>
                {depth === 0 ? null : (
                  <Button
                    aria-label='click to expand / collapse'
                    variant='simple'
                    icon
                    compact
                    onClick={handleParentToggle}
                  >
                    <StyledToggleIcon name='caret-right' />
                  </Button>
                )}
                {labelContent}
              </Flex>
            </Flex>
            <StyledCustomTreeItemSubTree id={`${id.replaceAll(' ', '')}-subtree`}>
              {subTree}
            </StyledCustomTreeItemSubTree>
          </>
        ) : (
          <StyledCustomTreeLeaf>{labelContent}</StyledCustomTreeLeaf>
        )}
      </StyledCustomTreeNode>
    </div>
  );
};

const CustomTreeWithNodes: FunctionComponent<CustomTreeProps & ForwardProps> = forwardRef(function CustomTreeWithNodes(
  { nodes, getPConnect, currentNodeId, onNodeClick, onNodeToggle, ...restProps }: PropsWithoutRef<CustomTreeProps>,
  ref: CustomTreeProps['ref'],
) {
  const [focusedNodeId, setFocusedNodedId] = useState<string | undefined>();
  const treeRef = useConsolidatedRef(ref);

  const lastNodeId = useMemo(() => {
    return treeHelpers.getDeepestNode(nodes, nodes[nodes.length - 1].id)?.id;
  }, [nodes]);

  const changeFocusedNodeId: CustomTreeContextProps['changeFocusedNodeId'] = useCallback(
    (id, type) => {
      switch (type) {
        case 'up': {
          const previousNode = treeHelpers.getPreviousNode(nodes, id);
          if (previousNode) setFocusedNodedId(previousNode.id);
          break;
        }
        case 'down': {
          const nextNode = treeHelpers.getNextNode(nodes, id);
          if (nextNode) setFocusedNodedId(nextNode.id);
          break;
        }
        case 'left': {
          const parentNode = treeHelpers.getParentNode(nodes, id);
          if (parentNode) setFocusedNodedId(parentNode.id);
          break;
        }
        case 'right': {
          const childNode = treeHelpers.getFirstChildNode(nodes, id);
          if (childNode) setFocusedNodedId(childNode.id);
          break;
        }
        default: {
          if (id !== focusedNodeId) setFocusedNodedId(id);
          break;
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nodes],
  );

  const onFocusChange = (focused: boolean) => {
    if (!focused) setFocusedNodedId('');
  };

  useFocusWithin([treeRef], onFocusChange);

  return (
    <CustomTreeContext.Provider
      value={useMemo(
        () => ({
          currentNodeId,
          focusedNodeId,
          lastNodeId,
          getPConnect,
          firstNodeId: nodes[0].id,
          changeFocusedNodeId,
          onNodeClick,
          onNodeToggle,
        }),
        [currentNodeId, focusedNodeId, lastNodeId, getPConnect, nodes, changeFocusedNodeId, onNodeClick, onNodeToggle],
      )}
    >
      <StyledCustomTree {...restProps} ref={treeRef} nodes={nodes} nodeRenderer={NodeRenderer} />
    </CustomTreeContext.Provider>
  );
});

const CustomTree: FunctionComponent<CustomTreeProps & ForwardProps> = forwardRef(function CustomTree(
  props: PropsWithoutRef<CustomTreeProps>,
  ref: CustomTreeProps['ref'],
) {
  return props.nodes.length > 0 ? <CustomTreeWithNodes {...props} ref={ref} /> : null;
});

export default CustomTree;
