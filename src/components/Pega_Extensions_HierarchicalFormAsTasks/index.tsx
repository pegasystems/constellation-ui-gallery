import { withConfiguration, FieldGroup, Button, Flex } from '@pega/cosmos-react-core';
import { useEffect, useState } from 'react';
import { HideButtonsForm, StyledTaskList } from './styles';
import { TaskListItem } from './TaskListItem';
import { TaskDetail } from './TaskDetail';
import type { Task, Category, HierarchicalFormAsTasksProps } from './types';
import '../shared/create-nonce';

export const PegaExtensionsHierarchicalFormAsTasks = (props: HierarchicalFormAsTasksProps) => {
  const { heading, children, getPConnect } = props;
  const [views, setViews] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Initialize data from children
  useEffect(() => {
    if (!children || !children[0]?.props) return;

    const parsedViews: Task[] = [];
    const parsedCategories: Category[] = [];

    try {
      const groups = children[0].props.getPConnect().getChildren();

      groups.forEach((group: any) => {
        const groupPConnect = group.getPConnect();
        const tmpViews = groupPConnect.getChildren();
        const groupConfig = groupPConnect.getConfigProps();
        const categoryTitle = groupConfig.heading;

        // Add category
        parsedCategories.push({ title: categoryTitle });

        // Add views in this category
        tmpViews.forEach((view: any, index: number) => {
          const viewPConnect = view.getPConnect;
          const config = viewPConnect().getConfigProps();
          const viewId = `${config.name}-${index}`;
          let viewTitle = config.name;
          if (config?.inheritedProps?.length > 0) {
            for (const val of config.inheritedProps) {
              if (val.prop === 'label') {
                viewTitle = val.value;
              }
            }
          }
          parsedViews.push({
            id: viewId,
            category: categoryTitle,
            title: viewTitle,
            status: 'Not yet started',
            getPConnect: viewPConnect,
            content: viewPConnect().getComponent(),
            visible: false,
          });
        });
      });

      setViews(parsedViews);
      setCategories(parsedCategories);
    } catch {
      /* do nothing */
    }
  }, [children]);

  const submitAssignment = () => {
    getPConnect().getActionsApi().finishAssignment(getPConnect().getContextName(), {
      outcomeID: '',
      jsActionQueryParams: {},
    });
  };

  const closeView = (targetView: Task) => {
    setViews((prevViews) => {
      return prevViews.map((view) => ({
        ...view,
        visible: view.id === targetView.id ? !view.visible : false,
      }));
    });
  };

  const openView = (targetView: Task) => {
    setViews((prevViews) => {
      const currentIndex = prevViews.findIndex((a) => a.id === targetView.id);
      return prevViews.map((view, index) => ({
        ...view,
        visible: index === currentIndex,
      }));
    });
  };

  const submitView = (targetView: Task) => {
    setViews((prevViews) => {
      const currentIndex = prevViews.findIndex((a) => a.id === targetView.id);
      const nextIndex = currentIndex + 1;
      return prevViews.map((view, index) => ({
        ...view,
        status: index === currentIndex ? 'Completed' : view.status,
        visible: index === nextIndex && nextIndex < prevViews.length,
      }));
    });
  };

  // Check if any task is currently visible
  const isAnyTaskVisible = views.some((view) => view.visible);

  // Check if all tasks are completed
  const allTasksCompleted = views.every((view) => view.status === 'Completed');

  return (
    <>
      <HideButtonsForm />
      <FieldGroup name={heading}>
        {/* Task List View */}
        {!isAnyTaskVisible && (
          <StyledTaskList>
            <Flex container={{ direction: 'column', gap: 1 }}>
              {categories.map((category, index) => (
                <FieldGroup name={`${index + 1}. ${category.title}`} headingTag='h3' key={category.title}>
                  <ol>
                    {views
                      .filter((view) => view.category === category.title)
                      .map((view) => (
                        <TaskListItem key={view.id} task={view} onOpen={openView} />
                      ))}
                  </ol>
                </FieldGroup>
              ))}
              {allTasksCompleted && (
                <Flex container={{ direction: 'row', justify: 'end' }}>
                  <Button onClick={submitAssignment} variant='primary'>
                    {getPConnect().getLocalizedValue('Submit')}
                  </Button>
                </Flex>
              )}
            </Flex>
          </StyledTaskList>
        )}

        {/* Task Detail View */}
        {views.map(
          (view) =>
            view.visible && (
              <TaskDetail
                key={view.id}
                task={view}
                onSubmit={submitView}
                onClose={closeView}
                getPConnect={getPConnect}
              />
            ),
        )}
      </FieldGroup>
    </>
  );
};

export default withConfiguration(PegaExtensionsHierarchicalFormAsTasks);
