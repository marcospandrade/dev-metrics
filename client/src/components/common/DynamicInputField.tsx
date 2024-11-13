import { Input, Typography } from '@material-tailwind/react';

type DynamicInputFieldProps = {
  title: string;
  fieldLabel: string;
  inputs: Record<string, any>[];
  propertyName: string;
  onAddInput: () => void;
  onChangeData: (data: Record<string, any>[]) => void;
};

export function DynamicInputField({
  title,
  fieldLabel,
  inputs,
  onAddInput,
  onChangeData,
  propertyName,
}: Readonly<DynamicInputFieldProps>) {
  const handleChange = (event: any, index: number) => {
    const { name, value } = event.target;
    const onChangeValue = [...inputs];
    onChangeValue[index] = { [propertyName]: value };
    return onChangeData(onChangeValue);
  };

  const handleDeleteInput = (index: number) => {
    const newArray = [...inputs];
    newArray.splice(index, 1);
    onChangeData(newArray);
  };

  return (
    <div className="container">
      <div className="mb-4 mt-8 flex justify-between">
        <Typography variant="h6" color="indigo">
          {title}
        </Typography>

        <button
          type="button"
          color="indigo"
          className="flex rounded-2xl bg-indigo-500 px-2 py-0 text-white"
          onClick={onAddInput}
        >
          +
        </button>
      </div>

      {inputs?.map((item, index) => (
        <div className="item-container mb-6" key={index}>
          <Input
            variant="standard"
            color="indigo"
            label={fieldLabel}
            name={index.toString()}
            icon={
              inputs.length > 1 && (
                <i
                  className="fas fa-close cursor-pointer"
                  onClick={() => handleDeleteInput(index)}
                />
              )
            }
            type="text"
            value={item.name}
            onChange={(event) => handleChange(event, index)}
          />
        </div>
      ))}
    </div>
  );
}
