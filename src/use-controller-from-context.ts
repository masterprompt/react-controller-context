import React from 'react';

export function useControllerFromContext<TController>(context: React.Context<TController>) {
    return React.useContext(context);
}