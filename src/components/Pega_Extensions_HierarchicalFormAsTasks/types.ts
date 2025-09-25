import { type ReactElement } from 'react';

export type Task = {
  id: string;
  title: string;
  category: string;
  getPConnect: () => any;
  status: 'Completed' | 'Not yet started' | 'Optional' | 'Cannot start yet';
  content: ReactElement;
  visible: boolean;
};

export type Category = {
  title: string;
};

export type HierarchicalFormAsTasksProps = {
  heading: string;
  children: any;
  getPConnect: () => any;
  numberOfGroups?: number;
  viewsPerGroup?: number;
};
