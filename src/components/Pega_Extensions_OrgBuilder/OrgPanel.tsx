'use client';

import type { DragEvent } from 'react';
import styled from 'styled-components';
import type { OrgNode } from './OrgTypes';
import { OrgNodeComponent } from './OrgNode';

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
  panel: 'left' | 'right';
  onRemoveConnection?: (nodeId: string, parentId?: string) => void;
  draggedNodeId?: string | null;
  hoveredTargetId?: string | null;
  isHoveringRoot?: boolean;
  isDragInProgress?: boolean;
  onDragStartNode?: (nodeId: string, source: 'left' | 'right', sourceNode: OrgNode) => void;
  onDragEndNode?: () => void;
  onDragOverNode?: (targetId: string) => boolean;
  onDragOverRoot?: () => boolean;
  onDropInRightPanel?: (event: DragEvent<HTMLDivElement>) => void;
  onDropOnNode?: (targetId: string) => void;
  onDropOnRoot?: () => void;
}

export function OrgPanel({
  title,
  subtitle,
  organization,
  panel,
  onRemoveConnection,
  draggedNodeId,
  hoveredTargetId,
  isHoveringRoot = false,
  isDragInProgress = false,
  onDragStartNode,
  onDragEndNode,
  onDragOverNode,
  onDragOverRoot,
  onDropInRightPanel,
  onDropOnNode,
}: OrgPanelProps) {
  const isLeft = panel === 'left';
  const isRight = panel === 'right';

  const leftContent = isLeft && (
    <DropZone $isDraggingOver={false}>
      <OrgNodeComponent
        node={organization}
        panel='left'
        isRoot={true}
        depth={0}
        draggedNodeId={draggedNodeId}
        onDragStartNode={onDragStartNode}
        onDragEndNode={onDragEndNode}
      />
    </DropZone>
  );

  const rightContent = isRight && (
    <RightDropZone
      $isDraggingOver={isHoveringRoot}
      onDragOver={(event) => {
        if (isDragInProgress) {
          event.preventDefault();
          event.dataTransfer.dropEffect = 'move';
        }
        const isDirect = event.target === event.currentTarget;
        if (isDirect) {
          const canDrop = onDragOverRoot?.() ?? false;
          if (canDrop) {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';
          }
        }
      }}
      onDrop={(event) => {
        event.preventDefault();
        onDropInRightPanel?.(event);
      }}
    >
      <OrgNodeComponent
        node={organization}
        panel='right'
        isRoot={true}
        depth={0}
        onRemoveConnection={onRemoveConnection}
        draggedNodeId={draggedNodeId}
        hoveredTargetId={hoveredTargetId}
        onDragStartNode={onDragStartNode}
        onDragEndNode={onDragEndNode}
        onDragOverNode={onDragOverNode}
        onDropOnNode={onDropOnNode}
      />
    </RightDropZone>
  );

  return (
    <PanelRoot $isLeft={isLeft}>
      <PanelHeader>
        <PanelTitle>{title}</PanelTitle>
        {subtitle && <PanelSubtitle>{subtitle}</PanelSubtitle>}
        {isLeft && <PanelHelper>Drag nodes to the right panel to build your organization</PanelHelper>}
        {isRight && (
          <PanelHelper>
            Drop onto a node to make it its child, or onto the empty panel to attach to the root.
          </PanelHelper>
        )}
      </PanelHeader>

      {isLeft ? leftContent : rightContent}
    </PanelRoot>
  );
}
