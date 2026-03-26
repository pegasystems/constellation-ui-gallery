'use client';

import React from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
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

const DraggableWrap = styled.div<{ $isDragging: boolean }>`
  opacity: ${({ $isDragging }) => ($isDragging ? 0.5 : 1)};
`;

const DropTargetWrap = styled.div<{ $isOver: boolean; $depth: number; $isDisabled?: boolean }>`
  display: flex;
  flex-direction: column;
  margin-left: ${({ $depth }) => $depth * 1}rem;
  margin-bottom: 0.5rem;
  border-radius: 0.25rem;
  box-sizing: border-box;

  /* Border-only highlight so hover does not change layout (no padding jump). */
  background-color: ${({ $isOver, $isDisabled }) => ($isOver && !$isDisabled ? '#eff6ff' : 'transparent')};
  border: ${({ $isOver, $isDisabled }) =>
    $isOver && !$isDisabled ? '0.125rem solid #2563eb' : '0.125rem solid transparent'};
  box-shadow: ${({ $isOver, $isDisabled }) =>
    $isOver && !$isDisabled ? '0 0 0 0.125rem rgba(37, 99, 235, 0.25)' : 'none'};
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;
`;

const CursorGrab = styled.div`
  cursor: grab;
  display: inline-flex;
  &:active {
    cursor: grabbing;
  }
`;

interface OrgNodeComponentProps {
  node: OrgNode;
  panel: 'left' | 'right';
  index?: number;
  onRemoveConnection?: (nodeId: string, parentId?: string) => void;
  parentId?: string;
  isRoot?: boolean;
  depth?: number;
  /** Map of node id -> flattened index; used for left-panel tree so Draggable has correct index */
  flattenedIndexMap?: Record<string, number>;
  /** When true, render only the node row (no children). Used for flat right-panel drop list. */
  contentOnly?: boolean;
}

export function OrgNodeComponent({
  node,
  panel,
  index = 0,
  onRemoveConnection,
  parentId,
  isRoot = false,
  depth = 0,
  flattenedIndexMap,
  contentOnly = false,
}: OrgNodeComponentProps) {
  const shape = getNodeShape(node.type);
  const bgHex = getNodeColorHex(node.type);

  const renderRectangleContent = () => (
    <RectangleNode $bg={bgHex}>
      {!isRoot && (panel === 'left' || panel === 'right') && (
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
      <TriangleIcon />
      <span>{node.name}</span>
    </TriangleNodeContent>
  );

  const nodeBox = <CursorGrab>{shape === 'triangle' ? renderTriangleContent() : renderRectangleContent()}</CursorGrab>;

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
              flattenedIndexMap={flattenedIndexMap}
              contentOnly={contentOnly}
            />
          </TreeChild>
        ))}
      </TreeChildren>
    ) : null;

  if (contentOnly) {
    return (
      <NodeWrap $depth={depth}>
        <div style={{ marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {nodeBox}
            {childrenTree}
          </div>
        </div>
      </NodeWrap>
    );
  }

  // Left: one Draggable per row only — children are siblings so the list placeholder stays
  // one-row tall (readonly reference tree is not “hollowed out” by a huge placeholder).
  if (panel === 'left' && !isRoot) {
    const flatIndex = flattenedIndexMap?.[node.id] ?? index;
    return (
      <NodeWrap $depth={depth}>
        <Draggable draggableId={node.id} index={flatIndex}>
          {(provided, snapshot) => {
            const { style, ...restDraggableProps } = provided.draggableProps;
            return (
              <DraggableWrap
                ref={provided.innerRef}
                {...restDraggableProps}
                style={style as React.CSSProperties}
                $isDragging={snapshot.isDragging}
              >
                <div {...provided.dragHandleProps}>{nodeBox}</div>
              </DraggableWrap>
            );
          }}
        </Draggable>
        {childrenTree}
      </NodeWrap>
    );
  }

  // Right panel nodes: Droppable target + Draggable node so they can be rearranged within the right panel
  if (panel === 'right' && !isRoot) {
    return (
      <Droppable droppableId={node.id} isDropDisabled={node.type === 'position'}>
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <DropTargetWrap $isOver={snapshot.isDraggingOver} $depth={depth} $isDisabled={node.type === 'position'}>
              <Draggable draggableId={node.id} index={0}>
                {(dragProvided, dragSnapshot) => {
                  const { style, ...restDraggableProps } = dragProvided.draggableProps;
                  return (
                    <DraggableWrap
                      ref={dragProvided.innerRef}
                      {...restDraggableProps}
                      style={style as React.CSSProperties}
                      $isDragging={dragSnapshot.isDragging}
                    >
                      <div {...dragProvided.dragHandleProps} style={{ marginBottom: '0.5rem' }}>
                        {nodeBox}
                      </div>
                    </DraggableWrap>
                  );
                }}
              </Draggable>
            </DropTargetWrap>
            {childrenTree}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  }

  return (
    <NodeWrap $depth={0}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {nodeBox}
        {childrenTree}
      </div>
    </NodeWrap>
  );
}
