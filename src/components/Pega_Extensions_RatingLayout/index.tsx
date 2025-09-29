import { useState, useEffect } from 'react';
import { withConfiguration, FieldGroup, Flex, TabPanel, Tabs } from '@pega/cosmos-react-core';
import RatingElem from './RatingElem';
import StyledWrapper from './styles';
import getAllFields from './utils';
import '../shared/create-nonce';

export type RatingLayoutProps = {
  label?: string;
  showLabel?: boolean;
  getPConnect?: any;
  minWidth?: string;
};

interface Rating {
  id: string;
  label: string;
  value: number;
  path: string;
  propIndex: number;
}

export const PegaExtensionsRatingLayout = (props: RatingLayoutProps) => {
  const { getPConnect, label = '', showLabel = false, minWidth = '40ch' } = props;
  const [tabs, setTabs] = useState<Array<any>>([]);
  const [panelShown, changePanel] = useState('0');
  // Get the inherited props from the parent to determine label settings
  const propsToUse = { label, showLabel, ...getPConnect().getInheritedProps() };
  const handleTabChange = (id: string) => {
    changePanel(id);
  };
  useEffect(() => {
    const tmpFields: any = getAllFields(getPConnect);
    const categories: any = {};
    const tmpTabs: Array<any> = [];
    if (tmpFields && tmpFields[0] && tmpFields[0].value) {
      /* Retrieve the name of the embedded object */
      const paths = tmpFields[2].path?.split(' ');
      let path = '';
      if (paths && paths.length === 2) {
        path = paths[1].substring(0, paths[1].indexOf('[')).trim();
      }
      tmpFields[0].value.forEach((category: any, i: number) => {
        const content: Array<Rating> = categories[category] || [];
        const item = {
          id: `${category} - ${tmpFields[1].value[i]}`,
          label: tmpFields[1].value[i],
          value: tmpFields[2].value[i],
          path,
          propIndex: i,
        };
        content.push(item);
        categories[category] = content;
      });
    }
    let tabId = 0;
    for (const [key, item] of Object.entries(categories)) {
      tmpTabs.push({
        name: key,
        id: `${tabId}`,
        content: item,
      });
      tabId += 1;
    }
    setTabs(tmpTabs);
  }, [getPConnect]);

  return (
    <FieldGroup name={propsToUse.showLabel ? propsToUse?.label : null}>
      <Flex container={{ direction: 'column' }}>
        <Flex item={{ grow: 1 }}>
          <Tabs tabs={tabs} onTabClick={handleTabChange} currentTabId={panelShown} />
        </Flex>
        <Flex container={{ pad: 1 }} item={{ grow: 1 }}>
          {tabs.map((tab) => (
            <TabPanel tabId={tab.id} currentTabId={panelShown} key={tab.id} style={{ width: '100%' }}>
              <StyledWrapper minWidth={minWidth}>
                {tab.content.map((content: Rating) => {
                  return (
                    <RatingElem
                      key={content.id}
                      label={content.label}
                      value={content.value}
                      path={content.path}
                      getPConnect={getPConnect}
                      propIndex={content.propIndex}
                    />
                  );
                })}
              </StyledWrapper>
            </TabPanel>
          ))}
        </Flex>
      </Flex>
    </FieldGroup>
  );
};
export default withConfiguration(PegaExtensionsRatingLayout);
