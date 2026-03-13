'use client';

import React, { useMemo } from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import styled from 'styled-components';
import type { OrgNode } from './OrgTypes';
import { OrgNodeComponent } from './OrgNode';

type FlattenedItem = { node: OrgNode; depth: number };

const PanelRoot = styled.div<{ $isLeft: boolean }>`
  flex: 1;
  min-width: 0;
  border: 0.0625rem solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  overflow: auto;
  min-height: 37.5rem;
  background-color: ${({ $isLeft }) => ($isLeft ? '#f9fafb' : '#ffffff')};
  box-shadow: 0 0.0625rem 0.1875rem 0 rgba(0, 0, 0, 0.08);
`;

const PanelHeader = styled.div`
  margin-bottom: 1rem;
`;

const PanelTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const PanelSubtitle = styled.p`
  font-size: 0.875rem;
  color: #4b5563;
  margin: 0;
`;

const PanelHelper = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0.25rem 0 0;
  font-style: italic;
`;

const DropZone = styled.div<{ $isDraggingOver: boolean }>`
  padding: 0.5rem;
  min-height: 12.5rem;
  border-radius: 0.25rem;
  background-color: ${({ $isDraggingOver }) => ($isDraggingOver ? '#eff6ff' : 'transparent')};
  border: ${({ $isDraggingOver }) => ($isDraggingOver ? '0.125rem dashed #2563eb' : '0.125rem dashed transparent')};
  box-shadow: ${({ $isDraggingOver }) => ($isDraggingOver ? '0 0 0 0.125rem rgba(37, 99, 235, 0.15)' : 'none')};
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;
`;

const RightDropZone = styled(DropZone)`
  min-height: 37.5rem;
`;

interface OrgPanelProps {
  title: string;
  subtitle?: string;
  organization: OrgNode;
  flattenedReference?: FlattenedItem[];
  panel: 'left' | 'right';
  onRemoveConnection?: (nodeId: string, parentId?: string) => void;
}

export function OrgPanel({
  title,
  subtitle,
  organization,
  flattenedReference = [],
  panel,
  onRemoveConnection,
}: OrgPanelProps) {
  const isLeft = panel === 'left';
  const isRight = panel === 'right';

  const flattenedIndexMap = useMemo(() => {
    const map: Record<string, number> = {};
    flattenedReference.forEach((item, i) => {
      map[item.node.id] = i;
    });
    return map;
  }, [flattenedReference]);

  const leftContent = isLeft && (
    <Droppable droppableId='reference'>
      {(provided, snapshot) => (
        <DropZone ref={provided.innerRef} {...provided.droppableProps} $isDraggingOver={snapshot.isDraggingOver}>
          <OrgNodeComponent
            node={organization}
            panel='left'
            isRoot={true}
            depth={0}
            flattenedIndexMap={flattenedIndexMap}
          />
          {provided.placeholder}
        </DropZone>
      )}
    </Droppable>
  );

  const rightContent = isRight && (
    <Droppable droppableId='root'>
      {(provided, snapshot) => (
        <RightDropZone ref={provided.innerRef} {...provided.droppableProps} $isDraggingOver={snapshot.isDraggingOver}>
          {/* One disabled Draggable so this Droppable is a valid cross-list target */}
          <Draggable draggableId='root-placeholder' index={0} isDragDisabled>
            {(p) => {
              const { style, ...rest } = p.draggableProps;
              return (
                <div
                  ref={p.innerRef}
                  {...rest}
                  style={
                    {
                      ...style,
                      minHeight: 1,
                      height: 1,
                      overflow: 'hidden',
                      pointerEvents: 'none',
                    } as React.CSSProperties
                  }
                  aria-hidden
                />
              );
            }}
          </Draggable>
          <OrgNodeComponent
            node={organization}
            panel='right'
            isRoot={true}
            depth={0}
            onRemoveConnection={onRemoveConnection}
          />
          {provided.placeholder}
        </RightDropZone>
      )}
    </Droppable>
  );

  return (
    <PanelRoot $isLeft={isLeft}>
      <PanelHeader>
        <PanelTitle>{title}</PanelTitle>
        {subtitle && <PanelSubtitle>{subtitle}</PanelSubtitle>}
        {isLeft && <PanelHelper>Drag nodes to the right panel to build your organization</PanelHelper>}
        {isRight && (
          <PanelHelper>Drop nodes here or on existing nodes to add them. Click X to remove connections.</PanelHelper>
        )}
      </PanelHeader>

      {isLeft ? leftContent : rightContent}
    </PanelRoot>
  );
}
