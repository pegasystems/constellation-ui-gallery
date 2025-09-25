import styled from 'styled-components';

export const StyledAddTask = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  & > div {
    flex: 1;
  }
  & input {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0%;
    border-right: none;
  }
  & button {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0%;
  }
`;

export const Container = styled.div`
  padding: 1rem;
  border: 0.125rem solid #cccccc;
  border-radius: 0.5rem;
  background-color: #f9f9f9;
`;

export const TaskCard = styled.div`
  border: 0.125rem solid #dddddd;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 0.5rem;
  background-color: #ffffff;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  & > div {
    flex: 1;
  }
  & input:checked + label {
    text-decoration: line-through;
  }
`;
