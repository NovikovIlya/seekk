import { DatePicker, Form, Input, InputNumber } from "antd";

export interface Item {
    key: string;
    name: string;
    age: number;
    address: string;
  }

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: Item;
    index: number;
  }

export const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({editing,dataIndex,title,inputType,record,index,children,...restProps}) => {
    
    const inputNode = inputType === 'date' ? <DatePicker.RangePicker/> 
    : inputType === 'number' ? <InputNumber /> : <Input />;
  
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };