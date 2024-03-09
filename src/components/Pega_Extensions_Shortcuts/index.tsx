import { useState, useEffect, type MouseEvent } from 'react';
import { Card, CardHeader, CardContent, Text, Link, Configuration } from '@pega/cosmos-react-core';
import MainContent from './styles';

type ShortcutsProps = {
  heading?: string;
  names?: string;
  pages?: string;
  getPConnect: any;
};

export default function PegaExtensionsShortcuts(props: ShortcutsProps) {
  const { heading = 'List of objects', names = '', pages = '', getPConnect } = props;
  const [objects, setObjects] = useState<Array<any>>([]);

  useEffect(() => {
    const tmpObjects: any = [];
    const { ACTION_SHOWVIEW } = (window as any).PCore.getSemanticUrlUtils().getActions();
    const labels = names.split(',');
    pages.split(',').forEach((name: string, index: number) => {
      const linkLabel = labels[index]?.trim();
      if (!linkLabel) return;
      const isURL = name.trim().indexOf('https://');
      if (isURL === 0) {
        tmpObjects.push(<Link href={name.trim()}>{linkLabel}</Link>);
        return;
      }
      const delimiter = name.indexOf('.');
      if (delimiter === -1) return;
      const pageClass = name.substring(0, delimiter).trim();
      const pageName = name.substring(delimiter + 1).trim();
      const linkRef = (window as any).PCore.getSemanticUrlUtils().getResolvedSemanticURL(
        ACTION_SHOWVIEW,
        { page: pageName },
        ''
      );
      tmpObjects.push(
        <Link
          href={linkRef}
          onClick={(e: MouseEvent<HTMLButtonElement>) => {
            /* for links - need to set onClick for spa to avoid full reload - (cmd | ctrl) + click for opening in new tab */
            if (!e.metaKey && !e.ctrlKey) {
              e.preventDefault();
              getPConnect().getActionsApi().showPage(pageName, pageClass);
            }
          }}
        >
          {linkLabel}
        </Link>
      );
    });
    setObjects(tmpObjects);
  }, [names, pages, getPConnect]);

  if (!names || !pages) return null;
  return (
    <Configuration>
      <Card>
        <CardHeader>
          <Text variant='h2'>{heading}</Text>
        </CardHeader>
        <CardContent>
          <MainContent>{objects.map((object: any) => object)}</MainContent>
        </CardContent>
      </Card>
    </Configuration>
  );
}
