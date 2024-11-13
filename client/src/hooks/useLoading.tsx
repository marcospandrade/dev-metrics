'use client';

import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { Loading } from '@/components/common/Loading';

interface LoadingContextData {
  statusLoading: boolean;
  changeLoadingStatus: (status: boolean) => void;
}

interface LoadingContextProviderProps {
  children: ReactNode;
}

const LoadingContext = createContext<LoadingContextData>({} as LoadingContextData);

function LoadingContextProvider({ children }: LoadingContextProviderProps) {
  const [statusLoading, setStatusLoading] = useState<boolean>(false);

  function changeLoadingStatus(status: boolean) {
    setStatusLoading(status);
  }

  const loadingContextData: LoadingContextData = useMemo(
    () => ({
      statusLoading,
      changeLoadingStatus,
    }),
    [statusLoading, changeLoadingStatus],
  );

  return (
    <LoadingContext.Provider value={loadingContextData}>
      {/* <ReactLoading type="spin" height="5%" width="5%" color="#000000" /> */}
      {statusLoading && <Loading />}
      {children}
    </LoadingContext.Provider>
  );
}

function useLoading() {
  const context = useContext(LoadingContext);
  return context;
}

export { LoadingContextProvider, useLoading };
