import { withKnobs, text } from '@storybook/addon-knobs';
import { FieldValueList } from '@pega/cosmos-react-core';
import PegaExtensionsFieldGroupAsRow from './index';
import { pyReviewRaw, regionChildrenResolved } from './mock.stories';

export default {
  title: 'PegaExtensionsFieldGroupAsRow',
  decorators: [withKnobs],
  component: PegaExtensionsFieldGroupAsRow
};

const renderField = resolvedProps => {
  const { value = '', label = '', key } = resolvedProps;

  return <FieldValueList variant='stacked' fields={[{ name: label, value }]} key={key} />;
};

export const basePegaExtensionsFieldGroupAsRow = () => {
  const props = {
    template: 'FieldGroupAsRow',
    heading: text('Heading', 'Heading'),
    getPConnect: () => {
      return {
        getChildren: () => {
          return pyReviewRaw.children;
        },
        getRawMetadata: () => {
          return pyReviewRaw;
        },
        getInheritedProps: () => {
          return pyReviewRaw.config.inheritedProps;
        },
        createComponent: config => {
          // eslint-disable-next-line default-case
          switch (config.config.value) {
            case '@P .pySLADeadline':
              return renderField(regionChildrenResolved[0]);
            case '@P .pySLAGoal':
              return renderField(regionChildrenResolved[1]);
            case '@P .pySLAStartTime':
              return renderField(regionChildrenResolved[2]);
          }
        },
        setInheritedProp: () => {
          /* nothing */
        },
        resolveConfigProps: () => {
          /* nothing */
        }
      };
    }
  };

  const regionAChildren = pyReviewRaw.children[0].children.map(child => {
    return props.getPConnect().createComponent(child);
  });

  return (
    <>
      <PegaExtensionsFieldGroupAsRow {...props}>{regionAChildren}</PegaExtensionsFieldGroupAsRow>
    </>
  );
};
