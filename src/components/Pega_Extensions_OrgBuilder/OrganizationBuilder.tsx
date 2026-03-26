'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { DragDropContext, type DropResult, type DragStart } from '@hello-pangea/dnd';
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
  OrgBuilderDndGlobalStyle,
} from './styles';
import { Button, Icon, registerIcon, Text } from '@pega/cosmos-react-core';
import * as resetIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/reset.icon';
import * as downloadIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/download.icon';
import * as informationIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/information.icon';

registerIcon(resetIcon, downloadIcon, informationIcon);

type FlattenedItem = { node: OrgNode; depth: number };

function flattenWithDepth(root: OrgNode, skipRootId?: string): FlattenedItem[] {
  const out: FlattenedItem[] = [];
  function visit(n: OrgNode, depth: number) {
    if (skipRootId && n.id === skipRootId) {
      n.children.forEach((c) => visit(c, depth));
      return;
    }
    out.push({ node: n, depth });
    n.children.forEach((c) => visit(c, depth + 1));
  }
  visit(root, 0);
  return out;
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
  const [, setHistory] = useState<OrgNode[]>([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  /** When set, CSS freezes the reference panel (no sibling shift / placeholder gap). */
  const [dragSourceDroppableId, setDragSourceDroppableId] = useState<string | null>(null);

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

  const flattenedReference = useMemo(
    () => (referenceOrg ? flattenWithDepth(referenceOrg, referenceOrg.id) : []),
    [referenceOrg],
  );

  const saveToHistory = useCallback((newOrg: OrgNode) => {
    setHistoryIndex((prevIndex) => {
      setHistory((prevHistory) => {
        const newHistory = prevHistory.slice(0, prevIndex + 1);
        newHistory.push(newOrg);
        return newHistory;
      });
      return prevIndex + 1;
    });
  }, []);

  function addNodeToParent(parent: OrgNode, nodeToAdd: OrgNode, targetId: string): OrgNode {
    if (parent.id === targetId) {
      // Do not allow children under position nodes
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

  const applyDragResult = useCallback(
    (result: DropResult) => {
      const { source, destination, draggableId } = result;
      if (!destination) return;
      if (draggableId === 'root-placeholder') return;

      // From reference (left) panel → target (right) panel
      if (source.droppableId === 'reference') {
        if (!referenceOrg || !initialTargetOrg) return;
        const targetId = destination.droppableId === 'root' ? initialTargetOrg.id : destination.droppableId;
        const refNode = getNodeById(referenceOrg, draggableId);
        if (!refNode) return;
        const clonedNode = cloneNodeWithNewIds(refNode, 'target-');
        setTargetOrg((prev) => {
          if (!prev) return prev;
          const parentNode = targetId === prev.id ? prev : getNodeById(prev, targetId);
          if (parentNode && parentNode.type === 'position') {
            return prev;
          }
          const newOrg = addNodeToParent(prev, clonedNode, targetId);
          saveToHistory(newOrg);
          return newOrg;
        });
        return;
      }

      // Internal drag within the target (right) panel – re-parent nodes
      if (destination.droppableId && source.droppableId !== 'reference') {
        if (!initialTargetOrg) return;
        if (draggableId === initialTargetOrg.id) return;
        if (destination.droppableId === source.droppableId) {
          return;
        }
        setTargetOrg((prev) => {
          if (!prev) return prev;
          const nodeToMove = getNodeById(prev, draggableId);
          if (!nodeToMove) {
            return prev;
          }
          const withoutNode = removeNodeFromTree(prev, draggableId);
          const targetId = destination.droppableId === 'root' ? withoutNode.id : destination.droppableId;
          const parentNode = targetId === withoutNode.id ? withoutNode : getNodeById(withoutNode, targetId);
          if (parentNode && parentNode.type === 'position') {
            return prev;
          }
          const newOrg = addNodeToParent(withoutNode, nodeToMove, targetId);
          saveToHistory(newOrg);
          return newOrg;
        });
      }
    },
    [saveToHistory, referenceOrg, initialTargetOrg],
  );

  const onDragStart = useCallback((start: DragStart) => {
    setDragSourceDroppableId(start.source.droppableId);
  }, []);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      setDragSourceDroppableId(null);
      applyDragResult(result);
    },
    [applyDragResult],
  );

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
    setHistoryIndex((prevIndex) => {
      if (prevIndex <= 0) return prevIndex;
      setHistory((prevHistory) => {
        setTargetOrg(prevHistory[prevIndex - 1]);
        return prevHistory;
      });
      return prevIndex - 1;
    });
  }, []);

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

  const refListFrozen = dragSourceDroppableId === 'reference';

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd} autoScrollerOptions={{ disabled: true }}>
      <OrgBuilderDndGlobalStyle />
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
                <li>Drag any node from the left panel to copy it (with all children) to the right panel</li>
                <li>Drop on an existing node to make it a child of that node</li>
                <li>Drop on the panel background to add it as a child of the root</li>
                <li>Click the X button on any node in the right panel to remove it</li>
              </InstructionList>
            </InstructionContent>
          </InstructionBox>

          <PanelsRow className={refListFrozen ? 'org-builder-ref-dragging' : undefined}>
            <OrgPanel
              title={referenceHeading}
              subtitle={referenceOrg.shortName || referenceOrg.name}
              organization={referenceOrg}
              flattenedReference={flattenedReference}
              panel='left'
            />
            <OrgPanel
              title={targetHeading}
              subtitle={initialTargetOrg.shortName || initialTargetOrg.name}
              organization={targetOrg}
              panel='right'
              onRemoveConnection={handleRemoveConnection}
            />
          </PanelsRow>
        </Content>
      </Screen>
    </DragDropContext>
  );
}
