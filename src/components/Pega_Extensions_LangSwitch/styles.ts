import styled from 'styled-components';

const DEFAULT_NAV_BACKGROUND = '#054A8A';

const normalizeHex = (value: string) => {
  const sanitized = value.trim().replace('#', '');

  if (sanitized.length === 3) {
    return sanitized
      .split('')
      .map((part) => `${part}${part}`)
      .join('');
  }

  return sanitized.length === 6 ? sanitized : DEFAULT_NAV_BACKGROUND.replace('#', '');
};

const parseHexColor = (value: string) => {
  const normalizedValue = normalizeHex(value);

  return {
    red: Number.parseInt(normalizedValue.slice(0, 2), 16),
    green: Number.parseInt(normalizedValue.slice(2, 4), 16),
    blue: Number.parseInt(normalizedValue.slice(4, 6), 16),
  };
};

const toRgba = (value: string, alpha = 1) => {
  const { red, green, blue } = parseHexColor(value);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

const mixColors = (base: string, target: string, weight: number) => {
  const safeWeight = Math.min(Math.max(weight, 0), 1);
  const baseColor = parseHexColor(base);
  const targetColor = parseHexColor(target);
  const mixChannel = (baseChannel: number, targetChannel: number) => {
    return Math.round(baseChannel + (targetChannel - baseChannel) * safeWeight);
  };

  const red = mixChannel(baseColor.red, targetColor.red);
  const green = mixChannel(baseColor.green, targetColor.green);
  const blue = mixChannel(baseColor.blue, targetColor.blue);

  return `rgb(${red}, ${green}, ${blue})`;
};

const getRelativeLuminance = (value: string) => {
  const { red, green, blue } = parseHexColor(value);
  const transformChannel = (channel: number) => {
    const normalizedChannel = channel / 255;

    return normalizedChannel <= 0.03928 ? normalizedChannel / 12.92 : ((normalizedChannel + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * transformChannel(red) + 0.7152 * transformChannel(green) + 0.0722 * transformChannel(blue);
};

const getCompactSurfaceTokens = (theme: any) => {
  const navBackground = theme?.components?.['app-shell']?.nav?.['background-color'] ?? DEFAULT_NAV_BACKGROUND;
  const isDarkSurface = getRelativeLuminance(navBackground) < 0.35;
  const foreground = isDarkSurface ? '#FFFFFF' : '#0F172A';
  const mutedForeground = isDarkSurface ? toRgba('#FFFFFF', 0.76) : toRgba('#0F172A', 0.72);
  const triggerBackground = isDarkSurface
    ? mixColors(navBackground, '#FFFFFF', 0.12)
    : mixColors(navBackground, '#0F172A', 0.06);
  const triggerHoverBackground = isDarkSurface
    ? mixColors(navBackground, '#FFFFFF', 0.2)
    : mixColors(navBackground, '#0F172A', 0.12);
  const menuBackground = isDarkSurface
    ? mixColors(navBackground, '#081223', 0.16)
    : mixColors(navBackground, '#FFFFFF', 0.88);
  const menuHoverBackground = isDarkSurface
    ? mixColors(navBackground, '#FFFFFF', 0.24)
    : mixColors(navBackground, '#0F172A', 0.08);
  const menuSelectedBackground = isDarkSurface
    ? mixColors(navBackground, '#FFFFFF', 0.3)
    : mixColors(navBackground, '#0F172A', 0.14);
  const borderColor = isDarkSurface
    ? toRgba(mixColors(navBackground, '#FFFFFF', 0.42), 0.72)
    : toRgba(mixColors(navBackground, '#0F172A', 0.22), 0.26);
  const shadowColor = isDarkSurface ? 'rgba(2, 6, 23, 0.46)' : 'rgba(15, 23, 42, 0.16)';

  return {
    foreground,
    mutedForeground,
    triggerBackground,
    triggerHoverBackground,
    menuBackground,
    menuHoverBackground,
    menuSelectedBackground,
    borderColor,
    shadowColor,
  };
};

export const StyledPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const StyledCompactPanel = styled.div`
  display: flex;
  flex-direction: column;
  width: 3.5rem;
  min-width: 3.5rem;
  min-height: 3.5rem;
`;

export const StyledCompactSelectContainer = styled.div`
  width: 100%;

  > * {
    width: 100%;
  }

  select,
  button,
  [role='combobox'] {
    width: 100%;
    min-width: 0;
  }
`;

export const StyledCompactMenuTrigger = styled.button`
  ${({ theme }) => {
    const tokens = getCompactSurfaceTokens(theme);

    return `
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.35rem;
      width: 100%;
      min-width: 0;
      min-height: 3rem;
      padding: 0.7rem 0.45rem;
      border: 1px solid ${tokens.borderColor};
      border-radius: 0.95rem;
      background: linear-gradient(180deg, ${tokens.triggerHoverBackground}, ${tokens.triggerBackground});
      box-shadow: 0 0.8rem 1.8rem ${tokens.shadowColor};
      color: ${tokens.foreground};
      backdrop-filter: blur(14px);
      cursor: pointer;
      transition:
        transform 0.16s ease,
        background-color 0.16s ease,
        box-shadow 0.16s ease,
        border-color 0.16s ease;

      &:hover {
        background: linear-gradient(180deg, ${tokens.triggerHoverBackground}, ${tokens.triggerHoverBackground});
        box-shadow: 0 1rem 2rem ${tokens.shadowColor};
        transform: translateY(-1px);
      }

      &:focus-visible {
        outline: 2px solid ${toRgba(tokens.foreground, 0.56)};
        outline-offset: 2px;
      }
    `;
  }}
`;

export const StyledCompactMenuTriggerLabel = styled.span`
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1;
`;

export const StyledCompactMenuChevron = styled.span<{ $isOpen: boolean }>`
  display: inline-flex;
  width: 0.5rem;
  height: 0.5rem;
  border-right: 0.125rem solid currentColor;
  border-bottom: 0.125rem solid currentColor;
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(-135deg)' : 'rotate(45deg)')};
  transition: transform 0.16s ease;
  opacity: 0.84;
`;

export const StyledCompactMenuSurface = styled.div`
  ${({ theme }) => {
    const tokens = getCompactSurfaceTokens(theme);

    return `
      min-width: 13.5rem;
      padding: 0.45rem;
      border-radius: 0.5rem;
      border: 0.125rem solid ${tokens.borderColor};
      background: ${tokens.menuBackground};
      box-shadow: 0 1.1rem 2.6rem ${tokens.shadowColor};
      color: ${tokens.foreground};
      backdrop-filter: blur(1rem);
    `;
  }}
`;

export const StyledCompactMenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const StyledCompactMenuItem = styled.button<{ $selected: boolean }>`
  ${({ theme, $selected }) => {
    const tokens = getCompactSurfaceTokens(theme);

    return `
      display: grid;
      grid-template-columns: auto 1fr;
      align-items: center;
      gap: 0.65rem;
      width: 100%;
      padding: 0.7rem 0.8rem;
      border: 0;
      border-radius: 0.85rem;
      background: ${$selected ? tokens.menuSelectedBackground : 'transparent'};
      color: ${tokens.foreground};
      text-align: left;
      cursor: pointer;
      transition: background-color 0.16s ease, transform 0.16s ease;

      &:hover {
        background: ${tokens.menuHoverBackground};
        transform: translateX(1px);
      }

      &:focus-visible {
        outline: 0.125rem solid ${toRgba(tokens.foreground, 0.5)};
        outline-offset: 0.125rem;
      }
    `;
  }}
`;

export const StyledCompactMenuCode = styled.span`
  ${({ theme }) => {
    const tokens = getCompactSurfaceTokens(theme);

    return `
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 2.4rem;
      min-height: 2rem;
      padding: 0 0.55rem;
      border-radius: 999px;
      background: ${tokens.menuHoverBackground};
      color: ${tokens.foreground};
      font-size: 0.78rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    `;
  }}
`;

export const StyledCompactMenuText = styled.span`
  display: flex;
  flex-direction: column;
  gap: 0.12rem;
  min-width: 0;
`;

export const StyledCompactMenuPrimary = styled.span`
  font-size: 0.92rem;
  font-weight: 600;
  line-height: 1.2;
`;

export const StyledCompactMenuSecondary = styled.span`
  ${({ theme }) => {
    const tokens = getCompactSurfaceTokens(theme);

    return `
      font-size: 0.78rem;
      line-height: 1.2;
      color: ${tokens.mutedForeground};
    `;
  }}
`;

export const StyledHeaderBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

export const StyledHelperText = styled.p`
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: rgba(15, 23, 42, 0.76);
`;

export const StyledSummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: 0.75rem;
`;

export const StyledSummaryItem = styled.div`
  border: 0.125rem solid rgba(15, 23, 42, 0.1);
  border-radius: 1rem;
  padding: 0.9rem 1rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(247, 250, 252, 0.96));
  box-shadow: 0 0.75rem 1.5rem rgba(15, 23, 42, 0.05);
`;

export const StyledSummaryLabel = styled.p`
  margin: 0 0 0.35rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(15, 23, 42, 0.58);
`;

export const StyledSummaryValue = styled.p`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: rgba(15, 23, 42, 0.94);
`;

export const StyledSummaryMeta = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.85rem;
  color: rgba(15, 23, 42, 0.68);
`;

export const StyledSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const StyledSectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

export const StyledSectionLabel = styled.p`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: rgba(15, 23, 42, 0.92);
`;

export const StyledSectionMeta = styled.p`
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.4;
  color: rgba(15, 23, 42, 0.68);
`;

export const StyledTimezoneControls = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
`;

export const StyledTimezonePicker = styled.div`
  flex: 1 1 18rem;
  min-width: 0;
`;

export const StyledTimezoneAction = styled.div`
  display: flex;
  align-items: center;
  align-self: center;
`;

export const StyledStatusMessage = styled.div<{ tone: 'info' | 'urgent' }>`
  border-radius: 1rem;
  border: 0.125rem solid ${({ tone }) => (tone === 'urgent' ? 'rgba(185, 28, 28, 0.18)' : 'rgba(3, 105, 161, 0.18)')};
  background: ${({ tone }) => (tone === 'urgent' ? 'rgba(254, 242, 242, 0.96)' : 'rgba(240, 249, 255, 0.96)')};
  padding: 0.85rem 1rem;
`;

export const StyledStatusText = styled.p<{ tone: 'info' | 'urgent' }>`
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.45;
  color: ${({ tone }) => (tone === 'urgent' ? 'rgb(153, 27, 27)' : 'rgb(3, 105, 161)')};
`;
