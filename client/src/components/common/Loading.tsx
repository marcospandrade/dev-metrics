import { Spinner } from '@material-tailwind/react'

export function Loading() {
    return (
        <div className="absolute bg-gray-200 bg-opacity-60 z-[100] h-full w-full flex items-center justify-center">
            <div className="flex items-center">
                <Spinner
                    type='grow'
                    className='h-16 w-16'
                    color='indigo'
                />
            </div>
        </div>

    );
}