// individual style, comment out above, and uncomment here and add styles
import styled, { css } from 'styled-components';



export default styled.div(() => {
  return css`
    margin: 0px 0;
  `;
});

export const Container = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: auto;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
`;

export const TaskCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px 16px;
  margin-bottom: 10px;
  background-color: #fff;
`;

export const TaskHeader = styled.div`
  display: flex;
  align-items: center;
`;

export const Checkbox = styled.input`
  margin-right: 10px;
`;

export const StatusText = styled.span<{ status: 'pending' | 'completed' }>`
  font-weight: bold;
  color: ${(props) => (props.status === 'completed' ? 'green' : 'orange')};
  margin-left: auto; /* Aligns to the right */
`;

export const Input = styled.input`
  padding: 5px;
  width: 80%;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
`;

export const AddTaskButton = styled.button`
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #007bff;
  color: #fff;
`;
