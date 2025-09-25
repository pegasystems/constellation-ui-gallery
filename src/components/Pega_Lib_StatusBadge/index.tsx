import { withConfiguration, Status, type StatusProps } from '@pega/cosmos-react-core';
import '../create-nonce';

type StatusBadgeProps = {
  /**  The value to display in the status badge */
  inputProperty: string;
  /** Regex expression to match the Info status
   */
  infoStatus?: string;
  /** Regex expression to match the Warning status
   */
  warnStatus?: string;
  /** Regex expression to match the Success status
   */
  successStatus?: string;
  /** Regex expression to match the Pending status
   */
  pendingStatus?: string;
  /** Regex expression to match the Urgent status
   */
  urgentStatus?: string;
};

/* If the status is not found - we will default to 'info' */
const getStatusVariant = (value: string, statusesRegex: string[]): StatusProps['variant'] => {
  const variants = ['info', 'warn', 'success', 'pending', 'urgent'];
  let variant: StatusProps['variant'] = 'info';
  if (statusesRegex) {
    statusesRegex.forEach((regex, index) => {
      if (regex && new RegExp(regex, 'i').test(value)) {
        variant = variants[index] as StatusProps['variant'];
      }
    });
  }
  return variant;
};

export const PegaExtensionsStatusBadge = (props: StatusBadgeProps) => {
  const {
    inputProperty = '',
    infoStatus = '',
    warnStatus = '',
    successStatus = '',
    pendingStatus = '',
    urgentStatus = '',
  } = props;
  const statusesRegex = [infoStatus, warnStatus, successStatus, pendingStatus, urgentStatus];

  return <Status variant={getStatusVariant(inputProperty, statusesRegex)}>{inputProperty}</Status>;
};
export default withConfiguration(PegaExtensionsStatusBadge);
