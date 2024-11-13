import { Spinner } from '@material-tailwind/react';

export function Loading() {
  return (
    <div className="absolute z-[100] flex h-full w-full items-center justify-center bg-gray-200 bg-opacity-60">
      <div className="flex items-center">
        <Spinner type="grow" className="h-16 w-16" color="indigo" />
      </div>
    </div>
  );
}
