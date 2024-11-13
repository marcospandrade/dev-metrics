import { Typography } from '@material-tailwind/react';

interface ItemDetailProps {
  title: string;
  text: string;
}

export function ItemDetail({ title, text }: ItemDetailProps) {
  return (
    <div className="flex flex-col">
      <Typography variant="h5">{title}</Typography>
      <Typography variant="paragraph">{text}</Typography>
    </div>
  );
}
