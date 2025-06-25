import { useState, useEffect, useCallback } from 'react';
import {
  withConfiguration,
  Flex,
  treeHelpers,
  registerIcon,
  Card,
  Icon,
  Text
} from '@pega/cosmos-react-core';
import CustomTree from './CustomTree';
import { type CustomTreeNode } from './CustomTree.types';
import { StyledSummaryListHeader, StyledSummaryListContent } from './styles';
import '../create-nonce';

import * as caretRightIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/caret-right.icon';
import * as FolderNestedIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/folder-nested.icon';

registerIcon(caretRightIcon, FolderNestedIcon);
type CaseHierarchyProps = {
  heading?: string;
  dataPage: string;
  showParent: boolean;
  getPConnect: any;
};

export const PegaExtensionsCaseHierarchy = (props: CaseHierarchyProps) => {
  const { dataPage = '', showParent = false, getPConnect } = props;
  const heading = props.heading ?? getPConnect().getLocalizedValue('Case Hierarchy');
  const [objects, setObjects] = useState<CustomTreeNode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentNodeId, setCurrentNodeId] = useState<string | undefined>();

  const loadTree = useCallback(
    (item: any, cases: Array<CustomTreeNode>, caseInstanceKey: string) => {
      const childcases: Array<CustomTreeNode> = [];
      if (item.pxResults) {
        item.pxResults.forEach((childcase: any) => {
          loadTree(childcase, childcases, caseInstanceKey);
        });
      }
      const linkURL =
        caseInstanceKey === item.pzInsKey
          ? ''
          : (window as any).PCore.getSemanticUrlUtils().getResolvedSemanticURL(
              (window as any).PCore.getSemanticUrlUtils().getActions().ACTION_OPENWORKBYHANDLE,
              { caseClassName: item.pyClassName },
              { workID: item.pyID }
            );
      cases.push({
        id: item.pzInsKey,
        label: item.pyLabel,
        objclass: item.pyClassName,
        expanded: true,
        href: linkURL,
        ...(childcases.length > 0 ? { nodes: childcases } : null)
      });
    },
    []
  );

  useEffect(() => {
    const caseInstanceKey = getPConnect().getValue(
      (window as any).PCore.getConstants().CASE_INFO.CASE_INFO_ID
    );
    const loadObjects = (response: any) => {
      const cases: Array<CustomTreeNode> = [];
      loadTree(response, cases, caseInstanceKey);
      setObjects(cases);
      setLoading(false);
    };

    if (dataPage) {
      const context = getPConnect().getContextName();
      (window as any).PCore.getDataPageUtils()
        .getPageDataAsync(
          dataPage,
          context,
          { caseInstanceKey, showParent },
          { invalidateCache: true }
        )
        .then((response: any) => {
          if (response !== null) {
            loadObjects(response);
          } else {
            setLoading(false);
          }
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [dataPage, getPConnect, loadTree, showParent]);

  if (!dataPage) return null;
  if (loading) return null;

  return (
    <Card>
      <StyledSummaryListHeader>
        <Flex container={{ alignItems: 'center', gap: 1 }}>
          <Icon name='folder-nested' />
          <Text variant='h3'>{heading}</Text>
        </Flex>
      </StyledSummaryListHeader>
      <StyledSummaryListContent role='tree'>
        <CustomTree
          currentNodeId={currentNodeId}
          getPConnect={getPConnect}
          nodes={objects}
          onNodeClick={(id, e) => {
            e.preventDefault();
            setCurrentNodeId(id);
          }}
          onNodeToggle={id => {
            const clickedNode = treeHelpers.getNode(objects, id);
            // If a leaf node, just set to current
            if (!clickedNode?.nodes) return;

            setObjects(tree =>
              treeHelpers.mapNode(tree, id, node => {
                return {
                  ...node,
                  expanded: !node.expanded,
                  loading: node.nodes?.length === 0
                };
              })
            );
          }}
        />
      </StyledSummaryListContent>
    </Card>
  );
};
export default withConfiguration(PegaExtensionsCaseHierarchy);
