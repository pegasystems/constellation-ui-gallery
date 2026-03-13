import styled from 'styled-components';

export default styled.div(({ height }: { height: string }) => ({
  height,
  width: '100%',
}));

// OrganizationBuilder layout and UI styles
export const Screen = styled.div`
  min-height: 100vh;
  background-color: #f3f4f6;
  padding: 1.5rem;
`;

export const Content = styled.div`
  max-width: 80rem;
  margin-left: auto;
  margin-right: auto;
`;

export const HeaderRow = styled.div`
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const HeaderText = styled.div``;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

export const Subtitle = styled.p`
  font-size: 0.875rem;
  color: #4b5563;
  margin: 0.25rem 0 0;
`;

export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const InstructionBox = styled.div`
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: #eff6ff;
  border: 0.0625rem solid #bfdbfe;
  border-radius: 0.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
`;

export const InstructionIcon = styled.span`
  flex-shrink: 0;
`;

export const InstructionContent = styled.div`
  font-size: 0.875rem;
  color: #1e40af;
`;

export const InstructionHeading = styled.p`
  font-weight: 500;
  margin: 0 0 0.25rem;
`;

export const InstructionList = styled.ul`
  margin: 0.25rem 0 0;
  padding-left: 1rem;
  list-style-type: disc;
  list-style-position: inside;

  li + li {
    margin-top: 0.25rem;
  }
`;

export const PanelsRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: stretch;
  min-height: 37.5rem;

  & > * {
    flex: 1;
    min-width: 0;
  }
`;
