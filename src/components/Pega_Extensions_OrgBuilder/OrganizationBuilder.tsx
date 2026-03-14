'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { DragEvent } from 'react';
import type { OrgNode, OrgBuilderDataPageResponse } from './OrgTypes';
import { cloneNodeWithNewIds, getNodeById } from './OrgTypes';
import { OrgPanel } from './OrgPanel';
import {
  Screen,
  Content,
  HeaderRow,
  HeaderText,
  Title,
  Subtitle,
  ButtonGroup,
  InstructionBox,
  InstructionIcon,
  InstructionContent,
  InstructionHeading,
  InstructionList,
  PanelsRow,
} from './styles';
import { Button, Icon, registerIcon, Text } from '@pega/cosmos-react-core';
import * as resetIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/reset.icon';
import * as downloadIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/download.icon';
import * as informationIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/information.icon';

registerIcon(resetIcon, downloadIcon, informationIcon);

type DragSource = 'reference' | 'target';

interface DragState {
  nodeId: string;
  source: DragSource;
  sourceNode?: OrgNode;
}

function addNodeToParent(parent: OrgNode, nodeToAdd: OrgNode, targetId: string): OrgNode {
  if (parent.id === targetId) {
    if (parent.type === 'position') {
      return parent;
    }
    return {
      ...parent,
      children: [...parent.children, nodeToAdd],
    };
  }
  return {
    ...parent,
    children: parent.children.map((child) => addNodeToParent(child, nodeToAdd, targetId)),
  };
}

function removeNodeFromTree(parent: OrgNode, nodeId: string, targetParentId?: string): OrgNode {
  if (targetParentId && parent.id === targetParentId) {
    return {
      ...parent,
      children: parent.children.filter((child) => child.id !== nodeId),
    };
  }
  return {
    ...parent,
    children: parent.children
      .filter((child) => {
        if (!targetParentId && child.id === nodeId) return false;
        return true;
      })
      .map((child) => removeNodeFromTree(child, nodeId, targetParentId)),
  };
}

function extractNodeFromTree(parent: OrgNode, nodeId: string): { tree: OrgNode; extracted: OrgNode | null } {
  let extracted: OrgNode | null = null;
  const nextChildren: OrgNode[] = [];

  parent.children.forEach((child) => {
    if (child.id === nodeId) {
      extracted = child;
      return;
    }

    const result = extractNodeFromTree(child, nodeId);
    if (result.extracted) {
      extracted = result.extracted;
    }
    nextChildren.push(result.tree);
  });

  return {
    tree: {
      ...parent,
      children: nextChildren,
    },
    extracted,
  };
}

export interface OrganizationBuilderProps {
  dataPage: string;
  selectionProperty?: string;
  getPConnect: () => {
    getLocalizedValue: (key: string) => string;
    getContextName: () => string;
  };
  referenceHeading?: string;
  targetHeading?: string;
  counter?: number;
}

export function OrganizationBuilder({
  dataPage,
  selectionProperty = '',
  getPConnect,
  referenceHeading = 'Organisation de référence',
  targetHeading = 'Organisation dédiée',
  counter = 1,
}: OrganizationBuilderProps) {
  const [referenceOrg, setReferenceOrg] = useState<OrgNode | null>(null);
  const [initialTargetOrg, setInitialTargetOrg] = useState<OrgNode | null>(null);
  const [targetOrg, setTargetOrg] = useState<OrgNode | null>(null);
  const [history, setHistory] = useState<OrgNode[]>([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [hoveredTargetId, setHoveredTargetId] = useState<string | null>(null);
  const [isHoveringRoot, setIsHoveringRoot] = useState(false);
  const dragStateRef = useRef<DragState | null>(null);
  const dragEndTimeoutRef = useRef<number | null>(null);
  const hoveredTargetIdRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    async function loadData() {
      try {
        const context = getPConnect().getContextName();
        const parameters = selectionProperty ? { pyGUID: selectionProperty } : undefined;
        const data = (await (window as any).PCore.getDataPageUtils().getPageDataAsync(dataPage, context, parameters, {
          invalidateCache: true,
        })) as OrgBuilderDataPageResponse;
        if (cancelled) return;
        if (!data?.pyReferenceOrganization || !data?.pyTargetOrganization) {
          setLoadError('Data page must return pyReferenceOrganization and pyTargetOrganization');
          setReferenceOrg(null);
          setInitialTargetOrg(null);
          setTargetOrg(null);
          setHistory([]);
          setHistoryIndex(0);
          return;
        }
        setReferenceOrg(data.pyReferenceOrganization);
        setInitialTargetOrg(data.pyTargetOrganization);
        setTargetOrg(data.pyTargetOrganization);
        setHistory([data.pyTargetOrganization]);
        setHistoryIndex(0);
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : 'Failed to load organization data');
          setReferenceOrg(null);
          setInitialTargetOrg(null);
          setTargetOrg(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadData();
    return () => {
      cancelled = true;
    };
  }, [dataPage, selectionProperty, getPConnect, counter]);

  const saveToHistory = useCallback(
    (newOrg: OrgNode) => {
      setHistoryIndex((prevIndex) => {
        setHistory((prevHistory) => {
          const newHistory = prevHistory.slice(0, prevIndex + 1);
          newHistory.push(newOrg);
          return newHistory;
        });
        return prevIndex + 1;
      });
    },
    [],
  );

  const clearDragInteraction = useCallback(() => {
    if (dragEndTimeoutRef.current !== null) {
      window.clearTimeout(dragEndTimeoutRef.current);
      dragEndTimeoutRef.current = null;
    }
    dragStateRef.current = null;
    hoveredTargetIdRef.current = null;
    setDragState(null);
    setHoveredTargetId(null);
    setIsHoveringRoot(false);
  }, []);

  const canDropOnNode = useCallback((targetId: string) => {
    const activeDragState = dragStateRef.current ?? dragState;
    if (!activeDragState || !targetOrg) return false;

    const targetNode = getNodeById(targetOrg, targetId);
    if (!targetNode || targetNode.type === 'position') return false;

    if (activeDragState.source === 'target') {
      if (activeDragState.nodeId === targetId) return false;
      const draggedNode = getNodeById(targetOrg, activeDragState.nodeId);
      if (!draggedNode) return false;
      if (getNodeById(draggedNode, targetId)) return false;
    }

    return true;
  }, [dragState, targetOrg]);

  const canDropOnRoot = useCallback(() => {
    const activeDragState = dragStateRef.current ?? dragState;
    if (!activeDragState || !targetOrg) return false;
    return activeDragState.source !== 'target' || activeDragState.nodeId !== targetOrg.id;
  }, [dragState, targetOrg]);

  const handleDragStart = useCallback((nodeId: string, sourcePanel: 'left' | 'right', sourceNode: OrgNode) => {
    if (dragEndTimeoutRef.current !== null) {
      window.clearTimeout(dragEndTimeoutRef.current);
      dragEndTimeoutRef.current = null;
    }

    const nextDragState: DragState = {
      nodeId,
      source: sourcePanel === 'left' ? 'reference' : 'target',
      sourceNode: sourcePanel === 'left' ? sourceNode : undefined,
    };

    dragStateRef.current = nextDragState;
    setDragState(nextDragState);
    setHoveredTargetId(null);
    setIsHoveringRoot(false);
  }, []);

  const handleDragEnd = useCallback(() => {
    dragEndTimeoutRef.current = window.setTimeout(() => {
      clearDragInteraction();
    }, 0);
  }, [clearDragInteraction]);

  const handleNodeDragOver = useCallback((targetId: string) => {
    const canDrop = canDropOnNode(targetId);
    const next = canDrop ? targetId : null;
    hoveredTargetIdRef.current = next;
    setHoveredTargetId(next);
    setIsHoveringRoot(false);
    return canDrop;
  }, [canDropOnNode]);

  const handleRootDragOver = useCallback(() => {
    const canDrop = canDropOnRoot();
    hoveredTargetIdRef.current = null;
    setHoveredTargetId(null);
    setIsHoveringRoot(canDrop);
    return canDrop;
  }, [canDropOnRoot]);

  const handleDropOnNode = useCallback((targetId: string) => {
    const activeDragState = dragStateRef.current ?? dragState;
    if (!activeDragState) return;

    if (activeDragState.source === 'reference') {
      const referenceNode = activeDragState.sourceNode ?? (referenceOrg ? getNodeById(referenceOrg, activeDragState.nodeId) : undefined);
      if (!referenceNode) {
        clearDragInteraction();
        return;
      }

      setTargetOrg((prev) => {
        if (!prev) return prev;
        const targetNode = getNodeById(prev, targetId);
        if (!targetNode || targetNode.type === 'position') return prev;

        const newOrg = addNodeToParent(prev, cloneNodeWithNewIds(referenceNode, 'target-'), targetId);
        saveToHistory(newOrg);
        return newOrg;
      });
    } else {
      setTargetOrg((prev) => {
        if (!prev) return prev;
        const draggedNode = getNodeById(prev, activeDragState.nodeId);
        const targetNode = getNodeById(prev, targetId);
        if (!draggedNode || !targetNode || targetNode.type === 'position') return prev;
        if (draggedNode.id === targetId || getNodeById(draggedNode, targetId)) return prev;

        const { tree: treeWithoutNode, extracted } = extractNodeFromTree(prev, activeDragState.nodeId);
        if (!extracted) return prev;

        const newOrg = addNodeToParent(treeWithoutNode, extracted, targetId);
        saveToHistory(newOrg);
        return newOrg;
      });
    }

    clearDragInteraction();
  }, [dragState, referenceOrg, saveToHistory, clearDragInteraction]);

  const handleDropOnRoot = useCallback(() => {
    const activeDragState = dragStateRef.current ?? dragState;
    if (!activeDragState) return;

    if (activeDragState.source === 'reference') {
      const referenceNode = activeDragState.sourceNode ?? (referenceOrg ? getNodeById(referenceOrg, activeDragState.nodeId) : undefined);
      if (!referenceNode) {
        clearDragInteraction();
        return;
      }

      setTargetOrg((prev) => {
        if (!prev) return prev;
        const newOrg = addNodeToParent(prev, cloneNodeWithNewIds(referenceNode, 'target-'), prev.id);
        saveToHistory(newOrg);
        return newOrg;
      });
    } else {
      setTargetOrg((prev) => {
        if (!prev || prev.id === activeDragState.nodeId) return prev;

        const { tree: treeWithoutNode, extracted } = extractNodeFromTree(prev, activeDragState.nodeId);
        if (!extracted) return prev;

        const newOrg = addNodeToParent(treeWithoutNode, extracted, treeWithoutNode.id);
        saveToHistory(newOrg);
        return newOrg;
      });
    }

    clearDragInteraction();
  }, [dragState, referenceOrg, saveToHistory, clearDragInteraction]);

  const handleDropInRightPanel = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const targetId = hoveredTargetIdRef.current;
      if (targetId) {
        handleDropOnNode(targetId);
      } else {
        handleDropOnRoot();
      }
    },
    [handleDropOnNode, handleDropOnRoot],
  );

  const handleRemoveConnection = useCallback(
    (nodeId: string, parentId?: string) => {
      setTargetOrg((prev) => {
        if (!prev) return prev;
        const newOrg = removeNodeFromTree(prev, nodeId, parentId);
        saveToHistory(newOrg);
        return newOrg;
      });
    },
    [saveToHistory],
  );

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      setTargetOrg(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const handleReset = useCallback(() => {
    if (initialTargetOrg) {
      setTargetOrg(initialTargetOrg);
      setHistory([initialTargetOrg]);
      setHistoryIndex(0);
    }
  }, [initialTargetOrg]);

  const handleExport = useCallback(() => {
    if (!targetOrg) return;
    const dataStr = JSON.stringify(targetOrg, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'organization.json';
    link.click();
    URL.revokeObjectURL(url);
  }, [targetOrg]);

  if (loading) {
    return (
      <Screen>
        <Content>
          <Text>Loading organization data…</Text>
        </Content>
      </Screen>
    );
  }
  if (loadError || !referenceOrg || !initialTargetOrg || !targetOrg) {
    return (
      <Screen>
        <Content>
          <Text>{loadError ?? 'No organization data available.'}</Text>
        </Content>
      </Screen>
    );
  }

  return (
    <Screen>
      <Content>
        <HeaderRow>
          <HeaderText>
            <Title>Organisation Builder</Title>
            <Subtitle>Build a new organization by dragging elements from the reference structure</Subtitle>
          </HeaderText>
          <ButtonGroup>
            <Button variant='secondary' onClick={handleUndo} disabled={historyIndex === 0}>
              <Icon name='reset' />
              Undo
            </Button>
            <Button variant='secondary' onClick={handleReset}>
              Reset
            </Button>
            <Button variant='primary' onClick={handleExport} disabled={!targetOrg}>
              <Icon name='download' />
              Export
            </Button>
          </ButtonGroup>
        </HeaderRow>

        <InstructionBox>
          <InstructionIcon>
            <Icon name='information' />
          </InstructionIcon>
          <InstructionContent>
            <InstructionHeading>How to use:</InstructionHeading>
            <InstructionList>
              <li>Drag any node from the left panel to copy it, with all of its children, into the target organization</li>
              <li>Hover a node on the right panel to make it the future parent, then drop to attach the dragged node under it</li>
              <li>Drop onto the empty area in the right panel to attach the node directly to the root</li>
              <li>Drag nodes inside the right panel to move existing branches, or click X to remove a connection</li>
            </InstructionList>
          </InstructionContent>
        </InstructionBox>

        <PanelsRow>
          <OrgPanel
            title={referenceHeading}
            subtitle={referenceOrg.shortName || referenceOrg.name}
            organization={referenceOrg}
            panel='left'
            draggedNodeId={dragState?.source === 'reference' ? dragState.nodeId : null}
            onDragStartNode={handleDragStart}
            onDragEndNode={handleDragEnd}
          />
          <OrgPanel
            title={targetHeading}
            subtitle={initialTargetOrg.shortName || initialTargetOrg.name}
            organization={targetOrg}
            panel='right'
            onRemoveConnection={handleRemoveConnection}
            draggedNodeId={dragState?.source === 'target' ? dragState.nodeId : null}
            hoveredTargetId={hoveredTargetId}
            isHoveringRoot={isHoveringRoot}
            isDragInProgress={!!dragState}
            onDragStartNode={handleDragStart}
            onDragEndNode={handleDragEnd}
            onDragOverNode={handleNodeDragOver}
            onDragOverRoot={handleRootDragOver}
            onDropInRightPanel={handleDropInRightPanel}
            onDropOnNode={handleDropOnNode}
            onDropOnRoot={handleDropOnRoot}
          />
        </PanelsRow>
      </Content>
    </Screen>
  );
}
