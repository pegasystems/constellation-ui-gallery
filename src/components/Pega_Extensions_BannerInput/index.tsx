import { withConfiguration, Icon, HTML, registerIcon } from '@pega/cosmos-react-core';
import { useTheme } from 'styled-components';
import * as warnSolidIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/warn-solid.icon';
import * as flagWaveSolidIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/flag-wave-solid.icon';
import * as checkIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/check.icon';
import * as informationSolidIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/information-solid.icon';

import '../shared/create-nonce';
import { StyledBanner, StyledBannerStatus, StyledBannerText } from './styles';

registerIcon(warnSolidIcon, flagWaveSolidIcon, checkIcon, informationSolidIcon);

type BannerInputProps = {
  /**  The value to display in the banner input */
  value: string;
  /** variant of the banner input
   * @default 'success'
   */
  variant?: 'success' | 'urgent' | 'info' | 'warn' | 'pending';
  /** icon to use
   * @default 'warn-solid'
   */
  icon?: 'warn-solid' | 'flag-wave-solid' | 'check' | 'information-solid';
};

export const PegaExtensionsBannerInput = (props: BannerInputProps) => {
  const { value = '', variant = 'success', icon = 'clipboard' } = props;
  const theme = useTheme();
  const bannerMsg = `Banner ${variant} - ${value}`;
  return (
    <StyledBanner theme={theme} role='alert' tabIndex={0} aria-label={bannerMsg} aria-live='polite'>
      <StyledBannerStatus variant={variant} theme={theme}>
        <Icon name={icon} />
      </StyledBannerStatus>
      <StyledBannerText variant={variant} theme={theme}>
        <HTML content={value} />
      </StyledBannerText>
    </StyledBanner>
  );
};
export default withConfiguration(PegaExtensionsBannerInput);
