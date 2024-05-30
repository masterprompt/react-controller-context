import { createContextForController } from './create-context-for-controller';
import React from 'react';

interface Controller {
    foo: string;
}

const useController = (): Controller => {
    return {
        foo: 'test'
    }
}

const controllerContext = createContextForController(useController);

const MyComponent = () => {
    return (
        <controllerContext.Provider>
        </controllerContext.Provider>
    )
}

const MyComponent2 = () => {
    return (
        <controllerContext.Provider>
            <div> test</div>
        </controllerContext.Provider>
    )
}