import React from 'react';
import { render } from '@testing-library/react';
import { createContextForController } from './create-context-for-controller';
import '@testing-library/jest-dom'

describe('createContextForController', () => {
    test('controller should be exposed via context', () => {
        
        const useController = (): string => 'test';

        const context = createContextForController(useController);
        
        const SampleComponent = () => {
            const controller = context.useController();
            return (
                <div data-testid="SampleComponent">
                    {controller}
                </div>
            );
        };

        const { getByTestId } = render(
            <context.Provider>
                <SampleComponent />
            </context.Provider>
        );
        expect(getByTestId('SampleComponent')).toBeInTheDocument();
        expect(getByTestId('SampleComponent')).toHaveTextContent('test');
    });

    /*
    test('controller should accept options as core type', () => {
        const options = 'TEST OPTIONS';
        type ControllerOptions = string;

        const useController = (options?: ControllerOptions): string => options || '';

        const context = createContextForController(useController);
        
        const SampleComponent = () => {
            const controller = context.useController();
            return (
                <div data-testid="SampleComponent">
                    {controller}
                </div>
            );
        };

        const { getByTestId } = render(
            <context.Provider options={options}>
                <SampleComponent />
            </context.Provider>
        );

        expect(getByTestId('SampleComponent')).toBeInTheDocument();
        expect(getByTestId('SampleComponent')).toHaveTextContent(options);
    });
    */

    test('controller should accept options as object', () => {
        const options = { foo: 'TEST OPTIONS' };
        interface ControllerOptions {
            foo: string;
        }

        const useController = (options?: ControllerOptions): string => options?.foo || '';

        const context = createContextForController(useController);
        
        const SampleComponent = () => {
            const controller = context.useController();
            return (
                <div data-testid="SampleComponent">
                    {controller}
                </div>
            );
        };

        const { getByTestId } = render(
            <context.Provider options={options}>
                <SampleComponent />
            </context.Provider>
        );

        expect(getByTestId('SampleComponent')).toBeInTheDocument();
        expect(getByTestId('SampleComponent')).toHaveTextContent(options.foo);
    });
});
