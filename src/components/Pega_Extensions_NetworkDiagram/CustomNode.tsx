import { useMemo, type MouseEvent } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import styled from 'styled-components';
import {
  Link
} from '@pega/cosmos-react-core';

const Node = styled.div`
  padding: 5px;
  color: #000;
  background: #FFF;

  button,
  label {
    max-width: 150px;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-spacing: normal;
    overflow: hidden;
  }
  .react-flow__handle.react-flow__handle-top,
  .react-flow__handle.react-flow__handle-bottom {
    background: #FFF;
  }
  div.react-flow__handle.connectionindicator {
    pointer-events: none;
    cursor: none;
  }
`;

type renderNodeProps = {
  type?: string;
  key?: string;
  objClass?: string;
  id: string;
  label: string;
  getPConnect?: any;
};


const renderNode = ( props: renderNodeProps) => {
  const {type, key, objClass, id, label, getPConnect} = props;
  let className = "";
  if(type) {
    className += type.toLowerCase();
  }
  const linkURL = (window as any).PCore.getSemanticUrlUtils().getResolvedSemanticURL(
    (window as any).PCore.getSemanticUrlUtils().getActions().ACTION_OPENWORKBYHANDLE,
    { caseClassName: objClass },
    { workID: id }
  );
  const linkEl = objClass && key && linkURL ? (
    <Link
      href={linkURL}
      previewable
      onPreview={() => {
        getPConnect().getActionsApi().showCasePreview(encodeURI(key), {
          caseClassName: objClass
        });
      }}
      onClick={ (e : MouseEvent<HTMLButtonElement>) => {
        /* for links - need to set onClick for spa to avoid full reload - (cmd | ctrl) + click for opening in new tab */
        if (!e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          getPConnect().getActionsApi().openWorkByHandle(key, objClass);
        }
      }}
    >
      {label}
    </Link>
  ) : (<label>{label}</label>);

  return (
    <Node>
       <Handle type="target" position={Position.Top} />
       <div className={className}></div>
       {linkEl}
      <Handle type="source" position={Position.Bottom} />
    </Node>
  );
}

const CustomNode = (props: NodeProps) => {
  const nodeEl = useMemo(() => renderNode(props.data), [props.data]);
  return nodeEl;
};
export default CustomNode;
