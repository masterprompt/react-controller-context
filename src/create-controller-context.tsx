import React, { PropsWithChildren, createContext, useContext } from 'react';

type NoProps = Record<never, never>;

export type Controller<R, P extends object = NoProps> =
    ((props: P) => R) | ((props?: P) => R);

// P is extracted from the inferred function type rather than inferred directly
// from the parameter position; direct inference collapses to the generic default
// when the controller's props parameter is optional/defaulted, e.g. `(props = {}) => R`.
type ControllerProps<C extends (props?: any) => any> =
    [Parameters<C>] extends [[]] ? NoProps : NonNullable<Parameters<C>[0]>;

const NO_PROVIDER = Symbol('react-controller-context.no-provider');

/**
 * Creates a strongly-typed Controller Context from a controller hook.
 *
 * @template R The value returned by the controller (the context value).
 * @template P The controller's single props-object parameter. Its shape
 *             defines the Provider's props (`children` is reserved).
 *
 * @param useController A hook that takes a props object and returns the context value.
 * @param name Optional label for error messages and DevTools. Falls back to the
 *             controller function's name, then a generic label. Pass it explicitly
 *             when the message must survive minification.
 *
 * @returns `{ Provider, context, use }` where:
 * - `Provider` forwards all non-`children` props to the controller and supplies
 *   its return value to descendants.
 * - `use()` returns the controller value from the nearest Provider, throwing a
 *   descriptive Error when no Provider is above the caller. Unlike React 19's
 *   `use`, it is a regular hook: top-level calls only.
 * - `context` is the raw React context, an escape hatch for `use(context)` in
 *   React 19 or injecting a mock value in tests.
 *
 * @example
 * ```tsx
 * const useCounter = ({ initialValue }: { initialValue?: number } = {}) => {
 *     const [count, setCount] = useState(initialValue ?? 0);
 *     return { count, setCount };
 * };
 *
 * const Counter = createControllerContext(useCounter, 'Counter');
 *
 * <Counter.Provider initialValue={4}>
 *     <Display />
 * </Counter.Provider>
 *
 * const Display = () => {
 *     const { count } = Counter.use();
 *     return <span>{count}</span>;
 * };
 * ```
 */
export const createControllerContext = <C extends (props?: any) => any>(
    useController: C,
    name?: string,
) => {
    type R = ReturnType<C>;
    type P = ControllerProps<C>;

    const label = name || useController.name || 'A controller context';
    const context = createContext<R | typeof NO_PROVIDER>(NO_PROVIDER);
    context.displayName = label;

    function Provider(props: PropsWithChildren<P>) {
        const { children, ...controllerProps } = props;
        const value = useController(controllerProps);
        return <context.Provider value={value}>{children}</context.Provider>;
    }

    function use(): R {
        const value = useContext(context);
        if (value === NO_PROVIDER) {
            throw new Error(`${label} cannot be used outside its Provider.`);
        }
        return value;
    }

    return {
        Provider,
        context: context as React.Context<R>,
        use,
    };
};
