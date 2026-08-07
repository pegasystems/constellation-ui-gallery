import { type ReactElement } from 'react';

export type Task = {
  id: string;
  title: string;
  category: string;
  getPConnect: () => typeof PConnect;
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
  getPConnect: () => typeof PConnect;
  numberOfGroups?: number;
  viewsPerGroup?: number;
};
