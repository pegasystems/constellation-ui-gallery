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
  PerformanceID: string;
  PerformanceName: string;
  Weightage: number;
  Emp_SelfRating_Perf?: number | null;
  RM_Ratings_Perf?: number | null;
  HRFinalRatingValue?: number | null;
  pxUpdateDateTime?: string;
}

export interface ComKra {
  Reviewer: string;
  CompetencyID: string;
  CompetencyName: string;
  pxUpdateDateTime?: string;
  CompReviewerRating: number | null;
  Weightage: number | null;
  HRCompFinalRatingValue?: number | null;
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
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface HeaderProps {
  label: string;
}
