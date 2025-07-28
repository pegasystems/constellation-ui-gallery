import { useMemo, type MouseEvent } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import styled, { css } from 'styled-components';
import { Link, Icon, registerIcon, Text, StyledText, StyledLink } from '@pega/cosmos-react-core';
import * as userIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/user.icon';
import * as storeIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/store.icon';

registerIcon(userIcon, storeIcon);
const Node = styled.div(({ theme }: { theme: any }) => {
  return css`
    padding: 0.25rem;
    color: ${theme.base.palette['foreground-color']};
    background: transparent;
    display: flex;
    flex-flow: column;
    align-items: center;
    max-width: 10rem;
    width: 10rem;

    svg {
      height: 3rem;
      width: 3rem;
    }
    ${StyledLink},
    ${StyledText} {
      max-width: 9rem;
      word-wrap: break-word;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: center;
      word-spacing: normal;
      overflow: hidden;
    }
    .react-flow__handle.react-flow__handle-top,
    .react-flow__handle.react-flow__handle-bottom {
      background: ${theme.base.palette['primary-background']};
    }
    div.react-flow__handle.connectionindicator {
      pointer-events: none;
      cursor: none;
    }
  `;
});

type RenderNodeProps = {
  type?: string;
  key?: string;
  objClass?: string;
  id: string;
  label: string;
  getPConnect?: any;
  theme: any;
};

const renderNode = (props: RenderNodeProps) => {
  const { type, key, objClass, id, label, getPConnect, theme } = props;
  let icon = 'user';
  if (type === 'Corporation') icon = 'store';
  const linkURL = (window as any).PCore.getSemanticUrlUtils().getResolvedSemanticURL(
    (window as any).PCore.getSemanticUrlUtils().getActions().ACTION_OPENWORKBYHANDLE,
    { caseClassName: objClass },
    { workID: id },
  );
  const linkEl =
    objClass && key && linkURL ? (
      <Link
        href={linkURL}
        previewable
        onPreview={() => {
          getPConnect().getActionsApi().showCasePreview(encodeURI(key), {
            caseClassName: objClass,
          });
        }}
        onClick={(e: MouseEvent<HTMLButtonElement>) => {
          /* for links - need to set onClick for spa to avoid full reload - (cmd | ctrl) + click for opening in new tab */
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            getPConnect().getActionsApi().openWorkByHandle(key, objClass);
          }
        }}
      >
        {label}
      </Link>
    ) : (
      <Text>{label}</Text>
    );

  return (
    <Node theme={theme}>
      <Handle type='source' position={Position.Top} id='a' />
      <Icon name={icon} />
      {linkEl}
      <Handle type='source' position={Position.Bottom} id='c' />
    </Node>
  );
};

const CustomNode = (props: NodeProps) => {
  return useMemo(() => renderNode(props.data), [props.data]);
};
export default CustomNode;
