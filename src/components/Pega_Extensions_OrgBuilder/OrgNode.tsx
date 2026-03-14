'use client';

import React from 'react';
import styled from 'styled-components';
import type { OrgNode } from './OrgTypes';
import { getNodeColorHex, getNodeShape } from './OrgTypes';
import { Icon, registerIcon } from '@pega/cosmos-react-core';
import * as dragIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/drag.icon';
import * as timesIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/times.icon';

registerIcon(dragIcon, timesIcon);

const NodeWrap = styled.div<{ $depth: number }>`
  margin-bottom: 0.5rem;
  margin-left: ${({ $depth }) => $depth * 1}rem;
`;

const RectangleNode = styled.div<{ $bg: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background-color: ${({ $bg }) => $bg};
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 500;
  border: none;
`;

const GripWrap = styled.span`
  cursor: grab;
  touch-action: none;
  display: inline-flex;
  &:active {
    cursor: grabbing;
  }
`;

const TriangleIcon = styled.span`
  width: 0;
  height: 0;
  border-left: 0.375rem solid transparent;
  border-right: 0.375rem solid transparent;
  border-bottom: 0.75rem solid #059669;
  flex-shrink: 0;
`;

const TriangleNodeContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #111827;
  white-space: nowrap;
`;

const RemoveBtn = styled.button`
  margin-left: 0.25rem;
  padding: 0.125rem;
  border: none;
  border-radius: 0.125rem;
  background-color: #b91c1c;
  color: #ffffff;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: #991b1b;
  }
`;

const TreeChildren = styled.div`
  position: relative;
  margin-top: 0.5rem;
  margin-left: 1rem;
  padding-left: 1rem;
  border-left: 0.125rem dashed #9ca3af;
`;

const TreeChild = styled.div`
  position: relative;
  &:not(:first-child) {
    margin-top: 0.5rem;
  }
`;

const ConnectorLine = styled.div`
  position: absolute;
  left: -1rem;
  top: 0.75rem;
  width: 1rem;
  border-top: 0.125rem dashed #9ca3af;
`;

const DraggableWrap = styled.div`
  /* No opacity here so parent nodes are never dimmed by inheritance */
`;

const DragContentWrap = styled.div<{ $isDragging: boolean }>`
  opacity: ${({ $isDragging }) => ($isDragging ? 0.45 : 1)};
  transform: ${({ $isDragging }) => ($isDragging ? 'scale(1.02)' : 'none')};
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
`;

const DropTargetWrap = styled.div<{ $isOver: boolean; $isDisabled?: boolean }>`
  display: inline-flex;
  flex-direction: column;
  border-radius: 0.25rem;
  padding: ${({ $isOver, $isDisabled }) => ($isOver && !$isDisabled ? '0.25rem' : '0')};
  background-color: ${({ $isOver, $isDisabled }) => ($isOver && !$isDisabled ? '#eff6ff' : 'transparent')};
  border: ${({ $isOver, $isDisabled }) =>
    $isOver && !$isDisabled ? '0.125rem solid #2563eb' : '0.125rem solid transparent'};
  box-shadow: ${({ $isOver, $isDisabled }) =>
    $isOver && !$isDisabled ? '0 0 0 0.125rem rgba(37, 99, 235, 0.2)' : 'none'};
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;
`;

const CursorGrab = styled.div<{ $isDraggable: boolean }>`
  cursor: ${({ $isDraggable }) => ($isDraggable ? 'grab' : 'default')};
  display: inline-flex;
  &:active {
    cursor: ${({ $isDraggable }) => ($isDraggable ? 'grabbing' : 'default')};
  }
`;

interface OrgNodeComponentProps {
  node: OrgNode;
  panel: 'left' | 'right';
  onRemoveConnection?: (nodeId: string, parentId?: string) => void;
  parentId?: string;
  isRoot?: boolean;
  depth?: number;
  draggedNodeId?: string | null;
  hoveredTargetId?: string | null;
  onDragStartNode?: (nodeId: string, source: 'left' | 'right', sourceNode: OrgNode) => void;
  onDragEndNode?: () => void;
  onDragOverNode?: (targetId: string) => boolean;
  onDropOnNode?: (targetId: string) => void;
}

export function OrgNodeComponent({
  node,
  panel,
  onRemoveConnection,
  parentId,
  isRoot = false,
  depth = 0,
  draggedNodeId,
  hoveredTargetId,
  onDragStartNode,
  onDragEndNode,
  onDragOverNode,
  onDropOnNode,
}: OrgNodeComponentProps) {
  const shape = getNodeShape(node.type);
  const bgHex = getNodeColorHex(node.type);
  const isDragging = draggedNodeId === node.id;
  const isDropDisabled = node.type === 'position';
  const isDropTarget = panel === 'right' && hoveredTargetId === node.id && !isDropDisabled;
  const isDraggable = !isRoot;

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    if (!isDraggable) return;
    onDragStartNode?.(node.id, panel, node);
    event.dataTransfer.effectAllowed = panel === 'left' ? 'copy' : 'move';
    event.dataTransfer.setData('text/plain', node.id);
  };

  const handleDragEnd = () => {
    onDragEndNode?.();
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    if (panel !== 'right') return;
    const canDrop = onDragOverNode?.(node.id) ?? false;
    if (!canDrop) return;
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    if (panel !== 'right') return;
    const canDrop = onDragOverNode?.(node.id) ?? false;
    if (!canDrop) return;
    event.preventDefault();
    event.stopPropagation();
    onDropOnNode?.(node.id);
  };

  const renderRectangleContent = () => (
    <RectangleNode $bg={bgHex}>
      {isDraggable && (
        <GripWrap>
          <Icon name='drag' />
        </GripWrap>
      )}
      <span>{node.shortName || node.name.substring(0, 10)}</span>
      {panel === 'right' && !isRoot && onRemoveConnection && (
        <RemoveBtn
          type='button'
          onClick={(e) => {
            e.stopPropagation();
            onRemoveConnection(node.id, parentId);
          }}
          title='Remove connection'
          aria-label='Remove connection'
        >
          <Icon name='times' />
        </RemoveBtn>
      )}
    </RectangleNode>
  );

  const renderTriangleContent = () => (
    <TriangleNodeContent>
      {isDraggable && (
        <GripWrap>
          <Icon name='drag' />
        </GripWrap>
      )}
      <TriangleIcon />
      <span>{node.name}</span>
      {panel === 'right' && !isRoot && onRemoveConnection && (
        <RemoveBtn
          type='button'
          onClick={(e) => {
            e.stopPropagation();
            onRemoveConnection(node.id, parentId);
          }}
          title='Remove connection'
          aria-label='Remove connection'
        >
          <Icon name='times' />
        </RemoveBtn>
      )}
    </TriangleNodeContent>
  );

  const nodeBox = <CursorGrab $isDraggable={isDraggable}>{shape === 'triangle' ? renderTriangleContent() : renderRectangleContent()}</CursorGrab>;

  const childrenTree =
    node.children.length > 0 ? (
      <TreeChildren>
        {node.children.map((child) => (
          <TreeChild key={child.id}>
            <ConnectorLine />
            <OrgNodeComponent
              node={child}
              panel={panel}
              onRemoveConnection={onRemoveConnection}
              parentId={node.id}
              depth={depth + 1}
              draggedNodeId={draggedNodeId}
              hoveredTargetId={hoveredTargetId}
              onDragStartNode={onDragStartNode}
              onDragEndNode={onDragEndNode}
              onDragOverNode={onDragOverNode}
              onDropOnNode={onDropOnNode}
            />
          </TreeChild>
        ))}
      </TreeChildren>
    ) : null;

  const nodeContent = (
    <DropTargetWrap $isOver={isDropTarget} $isDisabled={isDropDisabled} onDragOver={handleDragOver} onDrop={handleDrop}>
      {isDraggable ? (
        <DraggableWrap draggable onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <DragContentWrap $isDragging={isDragging}>
            <div style={{ marginBottom: '0.5rem' }}>{nodeBox}</div>
          </DragContentWrap>
        </DraggableWrap>
      ) : (
        <div style={{ marginBottom: '0.5rem' }}>{nodeBox}</div>
      )}
    </DropTargetWrap>
  );

  // Left panel non-root: wrap the full subtree in the draggable so the drag image shows node + all children.
  // Dimming is only on DragContentWrap so ancestor nodes stay at full opacity.
  if (panel === 'left' && !isRoot) {
    return (
      <NodeWrap $depth={depth}>
        <DraggableWrap draggable onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <DragContentWrap $isDragging={isDragging}>
            <div style={{ marginBottom: '0.5rem' }}>{nodeBox}</div>
            {childrenTree}
          </DragContentWrap>
        </DraggableWrap>
      </NodeWrap>
    );
  }

  return (
    <NodeWrap $depth={isRoot ? 0 : depth}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {panel === 'right' || !isRoot ? nodeContent : <div style={{ marginBottom: '0.5rem' }}>{nodeBox}</div>}
        {childrenTree}
      </div>
    </NodeWrap>
  );
}
