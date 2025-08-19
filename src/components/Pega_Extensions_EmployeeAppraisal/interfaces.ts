export interface Data {
  [key: string]: any;
}

export interface Employee {
  EmployeeID: string;
  EmployeeName: string;
  [key: string]: any;
}

export interface InputProps {
  placeholder: string;
  onChange: (value: string) => void;
}

export interface KRA {
  ID: number;
  Learning: string;
  Leadership: string;
  JobKnowledge: string;
  CommunicationSkills: string;
  Flexibility: string;
  Initiative: number;
  PolicyAdherence: number;
}

export interface Appraisal {
  Year: string;
  score: number;
  KRA: KRA[];
  EmployeeComments: string;
  ManagerComments: string;
  HRFinalComments: string;
}

export interface AppraisalsProps {
  appraisals: Appraisal[];
}

export interface ListComponentProps {
  data: Data[];
  columns: string[];
  stripedRows: boolean;
  sorting: boolean;
  columnSearch: boolean;
  uniqueKey: string;
  setEditPopupVisible: (visible: boolean) => void;
  setEditableRow: (row: Data) => void;
  fieldsToUpdate: string;
}

export interface PaginationProps {
  pageNumber: number;
  hasMoreResults: boolean;
  onPageChange: (page: number) => void;
}

export interface HeaderProps {
  label: string;
}
