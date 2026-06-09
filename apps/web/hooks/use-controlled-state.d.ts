interface CommonControlledStateProps<T> {
    value?: T;
    defaultValue?: T;
}
export declare function useControlledState<T, Rest extends any[] = []>(props: CommonControlledStateProps<T> & {
    onChange?: (value: T, ...args: Rest) => void;
}): readonly [T, (next: T, ...args: Rest) => void];
export {};
//# sourceMappingURL=use-controlled-state.d.ts.map