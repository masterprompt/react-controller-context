import React from 'react';

export function createControllerContext<TController>(defaultController?: TController) {
    return React.createContext<TController>(defaultController || {} as TController);
}