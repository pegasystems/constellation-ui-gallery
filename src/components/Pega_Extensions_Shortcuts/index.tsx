import { type MouseEvent, useCallback } from 'react';
import { withConfiguration, Card, CardHeader, CardContent, Text, Link, Flex } from '@pega/cosmos-react-core';
import { SimpleContent, GroupedContent } from './styles';
import '../shared/create-nonce';

type ShortcutsProps = {
  /** Display type of rendering
   * @default simple
   */
  displayType: 'simple' | 'grouped';
  /** Heading for the card - only used if displayType is simple
   * @default Shortcuts
   */
  heading?: string;
  /** Label of each page (comma-separated) - only used if displayType is simple */
  names?: string;
  /** Name of each page with the class (e.g. Data-Portal.SearchPage), comma-separated list - only used if displayType is simple */
  pages?: string;
  /** JSON object passed a string - only used if displayType is grouped */
  pageJSON?: string;
  getPConnect: any;
};

export const PegaExtensionsShortcuts = (props: ShortcutsProps) => {
  const { heading = 'Shortcuts', displayType = 'simple', names = '', pages = '', pageJSON = '', getPConnect } = props;
  const { ACTION_SHOWVIEW } = (window as any).PCore.getSemanticUrlUtils().getActions();

  const generateLink = useCallback(
    (name: string, page: string) => {
      if (!name) return null;
      const isURL = page.trim().indexOf('https://');
      if (isURL === 0) {
        return (
          <Link key={name} href={page.trim()}>
            {name}
          </Link>
        );
      }
      const delimiter = page.indexOf('.');
      if (delimiter === -1) return null;

      const pageClass = page.substring(0, delimiter).trim();
      const pageName = page.substring(delimiter + 1).trim();
      const linkRef = (window as any).PCore.getSemanticUrlUtils().getResolvedSemanticURL(
        ACTION_SHOWVIEW,
        { page: pageName },
        '',
      );
      return (
        <Link
          key={name}
          href={linkRef}
          onClick={(e: MouseEvent<HTMLButtonElement>) => {
            /* for links - need to set onClick for spa to avoid full reload - (cmd | ctrl) + click for opening in new tab */
            if (!e.metaKey && !e.ctrlKey) {
              e.preventDefault();
              getPConnect().getActionsApi().showPage(pageName, pageClass);
            }
          }}
        >
          {name}
        </Link>
      );
    },
    [ACTION_SHOWVIEW, getPConnect],
  );

  if (displayType === 'simple') {
    const objects: any = [];
    const namesArray = names.split(',');
    pages.split(',').forEach((page: string, index: number) => {
      const name = namesArray[index]?.trim();
      const linkEl = generateLink(name, page);
      if (linkEl) objects.push(linkEl);
    });
    if (objects.length === 0) return null;
    return (
      <Card>
        <CardHeader>
          <Text variant='h2'>{heading}</Text>
        </CardHeader>
        <CardContent>
          <SimpleContent>{objects?.map((object: any) => object)}</SimpleContent>
        </CardContent>
      </Card>
    );
  }
  try {
    const pageObj = JSON.parse(pageJSON);
    const obj = pageObj.categories;
    return (
      <Card>
        <CardContent>
          <GroupedContent>
            {obj?.map((object: any) => (
              <Flex key={object.heading} container={{ direction: 'column' }}>
                <Text variant='h2'>{object.heading}</Text>
                {object.links?.map((link: any) => {
                  return generateLink(link.name, link.page);
                })}
              </Flex>
            ))}
          </GroupedContent>
        </CardContent>
      </Card>
    );
  } catch {
    /* empty */
  }
  return null;
};
export default withConfiguration(PegaExtensionsShortcuts);
