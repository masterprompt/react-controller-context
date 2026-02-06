import React, { useState } from 'react';
import { render } from '@testing-library/react';
import { createContextBundle } from './createContextBundle';
import '@testing-library/jest-dom';

describe('createContextBundle', () => {
    test('basic controller with no props flows context value through', () => {
        const useController = () => {
            return { greeting: 'hello world' };
        };

        const Bundle = createContextBundle(useController, 'Basic');

        const Consumer = () => {
            const { greeting } = Bundle.useContext();
            return <div data-testid="consumer">{greeting}</div>;
        };

        const { getByTestId } = render(
            <Bundle.Provider>
                <Consumer />
            </Bundle.Provider>,
        );

        expect(getByTestId('consumer')).toHaveTextContent('hello world');
    });

    test('controller with typed props spread on Provider', () => {
        const useController = ({ initialCount }: { initialCount: number }) => {
            const [count] = useState(initialCount);
            return { count };
        };

        const Bundle = createContextBundle(useController, 'Counter');

        const Consumer = () => {
            const { count } = Bundle.useContext();
            return <div data-testid="consumer">{count}</div>;
        };

        const { getByTestId } = render(
            <Bundle.Provider initialCount={42}>
                <Consumer />
            </Bundle.Provider>,
        );

        expect(getByTestId('consumer')).toHaveTextContent('42');
    });

    test('useContext throws when called outside Provider', () => {
        const useController = () => ({ value: 'test' });
        const Bundle = createContextBundle(useController, 'Missing');

        const BadConsumer = () => {
            Bundle.useContext();
            return null;
        };

        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

        expect(() => render(<BadConsumer />)).toThrow(
            'Missing.useContext must be used within a Missing.Provider',
        );

        consoleError.mockRestore();
    });

    test('displayName is set on context', () => {
        const useController = () => ({ value: 'test' });
        const Bundle = createContextBundle(useController, 'MyFeature');

        expect(Bundle.context.displayName).toBe('MyFeature.Context');
    });
});
