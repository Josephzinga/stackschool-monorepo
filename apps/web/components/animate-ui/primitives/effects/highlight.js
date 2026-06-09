'use client';
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Highlight = Highlight;
exports.HighlightItem = HighlightItem;
exports.useHighlight = useHighlight;
const React = __importStar(require("react"));
const react_1 = require("motion/react");
const utils_1 = require("@/lib/utils");
const DEFAULT_BOUNDS_OFFSET = {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
};
const HighlightContext = React.createContext(undefined);
function useHighlight() {
    const context = React.useContext(HighlightContext);
    if (!context) {
        throw new Error('useHighlight must be used within a HighlightProvider');
    }
    return context;
}
function Highlight({ ref, ...props }) {
    const { as: Component = 'div', children, value, defaultValue, onValueChange, className, style, transition = { type: 'spring', stiffness: 350, damping: 35 }, hover = false, click = true, enabled = true, controlledItems, disabled = false, exitDelay = 200, mode = 'children', } = props;
    const localRef = React.useRef(null);
    React.useImperativeHandle(ref, () => localRef.current);
    const propsBoundsOffset = props?.boundsOffset;
    const boundsOffset = propsBoundsOffset ?? DEFAULT_BOUNDS_OFFSET;
    const boundsOffsetTop = boundsOffset.top ?? 0;
    const boundsOffsetLeft = boundsOffset.left ?? 0;
    const boundsOffsetWidth = boundsOffset.width ?? 0;
    const boundsOffsetHeight = boundsOffset.height ?? 0;
    const boundsOffsetRef = React.useRef({
        top: boundsOffsetTop,
        left: boundsOffsetLeft,
        width: boundsOffsetWidth,
        height: boundsOffsetHeight,
    });
    React.useEffect(() => {
        boundsOffsetRef.current = {
            top: boundsOffsetTop,
            left: boundsOffsetLeft,
            width: boundsOffsetWidth,
            height: boundsOffsetHeight,
        };
    }, [
        boundsOffsetTop,
        boundsOffsetLeft,
        boundsOffsetWidth,
        boundsOffsetHeight,
    ]);
    const [activeValue, setActiveValue] = React.useState(value ?? defaultValue ?? null);
    const [boundsState, setBoundsState] = React.useState(null);
    const [activeClassNameState, setActiveClassNameState] = React.useState('');
    const safeSetActiveValue = (id) => {
        setActiveValue((prev) => {
            if (prev !== id) {
                onValueChange?.(id);
                return id;
            }
            return prev;
        });
    };
    const safeSetBoundsRef = React.useRef(undefined);
    React.useEffect(() => {
        safeSetBoundsRef.current = (bounds) => {
            if (!localRef.current)
                return;
            const containerRect = localRef.current.getBoundingClientRect();
            const offset = boundsOffsetRef.current;
            const newBounds = {
                top: bounds.top - containerRect.top + offset.top,
                left: bounds.left - containerRect.left + offset.left,
                width: bounds.width + offset.width,
                height: bounds.height + offset.height,
            };
            setBoundsState((prev) => {
                if (prev &&
                    prev.top === newBounds.top &&
                    prev.left === newBounds.left &&
                    prev.width === newBounds.width &&
                    prev.height === newBounds.height) {
                    return prev;
                }
                return newBounds;
            });
        };
    });
    const safeSetBounds = (bounds) => {
        safeSetBoundsRef.current?.(bounds);
    };
    const clearBounds = React.useCallback(() => {
        setBoundsState((prev) => (prev === null ? prev : null));
    }, []);
    React.useEffect(() => {
        if (value !== undefined)
            setActiveValue(value);
        else if (defaultValue !== undefined)
            setActiveValue(defaultValue);
    }, [value, defaultValue]);
    const id = React.useId();
    React.useEffect(() => {
        if (mode !== 'parent')
            return;
        const container = localRef.current;
        if (!container)
            return;
        const onScroll = () => {
            if (!activeValue)
                return;
            const activeEl = container.querySelector(`[data-value="${activeValue}"][data-highlight="true"]`);
            if (activeEl)
                safeSetBoundsRef.current?.(activeEl.getBoundingClientRect());
        };
        container.addEventListener('scroll', onScroll, { passive: true });
        return () => container.removeEventListener('scroll', onScroll);
    }, [mode, activeValue]);
    const render = (children) => {
        if (mode === 'parent') {
            return (<Component ref={localRef} data-slot="motion-highlight-container" style={{ position: 'relative', zIndex: 1 }} className={props?.containerClassName}>
          <react_1.AnimatePresence initial={false} mode="wait">
            {boundsState && (<react_1.motion.div data-slot="motion-highlight" animate={{
                        top: boundsState.top,
                        left: boundsState.left,
                        width: boundsState.width,
                        height: boundsState.height,
                        opacity: 1,
                    }} initial={{
                        top: boundsState.top,
                        left: boundsState.left,
                        width: boundsState.width,
                        height: boundsState.height,
                        opacity: 0,
                    }} exit={{
                        opacity: 0,
                        transition: {
                            ...transition,
                            delay: (transition?.delay ?? 0) + (exitDelay ?? 0) / 1000,
                        },
                    }} transition={transition} style={{ position: 'absolute', zIndex: 0, ...style }} className={(0, utils_1.cn)(className, activeClassNameState)}/>)}
          </react_1.AnimatePresence>
          {children}
        </Component>);
        }
        return children;
    };
    return (<HighlightContext.Provider value={{
            mode,
            activeValue,
            setActiveValue: safeSetActiveValue,
            id,
            hover,
            click,
            className,
            style,
            transition,
            disabled,
            enabled,
            exitDelay,
            setBounds: safeSetBounds,
            clearBounds,
            activeClassName: activeClassNameState,
            setActiveClassName: setActiveClassNameState,
            forceUpdateBounds: props
                ?.forceUpdateBounds,
        }}>
      {enabled
            ? controlledItems
                ? render(children)
                : render(React.Children.map(children, (child, index) => (<HighlightItem key={index} className={props?.itemsClassName}>
                  {child}
                </HighlightItem>)))
            : children}
    </HighlightContext.Provider>);
}
function getNonOverridingDataAttributes(element, dataAttributes) {
    return Object.keys(dataAttributes).reduce((acc, key) => {
        if (element.props[key] === undefined) {
            acc[key] = dataAttributes[key];
        }
        return acc;
    }, {});
}
function HighlightItem({ ref, as, children, id, value, className, style, transition, disabled = false, activeClassName, exitDelay, asChild = false, forceUpdateBounds, ...props }) {
    const itemId = React.useId();
    const { activeValue, setActiveValue, mode, setBounds, clearBounds, hover, click, enabled, className: contextClassName, style: contextStyle, transition: contextTransition, id: contextId, disabled: contextDisabled, exitDelay: contextExitDelay, forceUpdateBounds: contextForceUpdateBounds, setActiveClassName, } = useHighlight();
    const Component = as ?? 'div';
    const element = children;
    const childValue = id ?? value ?? element.props?.['data-value'] ?? element.props?.id ?? itemId;
    const isActive = activeValue === childValue;
    const isDisabled = disabled === undefined ? contextDisabled : disabled;
    const itemTransition = transition ?? contextTransition;
    const localRef = React.useRef(null);
    React.useImperativeHandle(ref, () => localRef.current);
    const refCallback = React.useCallback((node) => {
        localRef.current = node;
    }, []);
    React.useEffect(() => {
        if (mode !== 'parent')
            return;
        let rafId;
        let previousBounds = null;
        const shouldUpdateBounds = forceUpdateBounds === true ||
            (contextForceUpdateBounds && forceUpdateBounds !== false);
        const updateBounds = () => {
            if (!localRef.current)
                return;
            const bounds = localRef.current.getBoundingClientRect();
            if (shouldUpdateBounds) {
                if (previousBounds &&
                    previousBounds.top === bounds.top &&
                    previousBounds.left === bounds.left &&
                    previousBounds.width === bounds.width &&
                    previousBounds.height === bounds.height) {
                    rafId = requestAnimationFrame(updateBounds);
                    return;
                }
                previousBounds = bounds;
                rafId = requestAnimationFrame(updateBounds);
            }
            setBounds(bounds);
        };
        if (isActive) {
            updateBounds();
            setActiveClassName(activeClassName ?? '');
        }
        else if (!activeValue)
            clearBounds();
        if (shouldUpdateBounds)
            return () => cancelAnimationFrame(rafId);
    }, [
        mode,
        isActive,
        activeValue,
        setBounds,
        clearBounds,
        activeClassName,
        setActiveClassName,
        forceUpdateBounds,
        contextForceUpdateBounds,
    ]);
    if (!React.isValidElement(children))
        return children;
    const dataAttributes = {
        'data-active': isActive ? 'true' : 'false',
        'aria-selected': isActive,
        'data-disabled': isDisabled,
        'data-value': childValue,
        'data-highlight': true,
    };
    const commonHandlers = hover
        ? {
            onMouseEnter: (e) => {
                setActiveValue(childValue);
                element.props.onMouseEnter?.(e);
            },
            onMouseLeave: (e) => {
                setActiveValue(null);
                element.props.onMouseLeave?.(e);
            },
        }
        : click
            ? {
                onClick: (e) => {
                    setActiveValue(childValue);
                    element.props.onClick?.(e);
                },
            }
            : {};
    if (asChild) {
        if (mode === 'children') {
            return React.cloneElement(element, {
                key: childValue,
                ref: refCallback,
                className: (0, utils_1.cn)('relative', element.props.className),
                ...getNonOverridingDataAttributes(element, {
                    ...dataAttributes,
                    'data-slot': 'motion-highlight-item-container',
                }),
                ...commonHandlers,
                ...props,
            }, <>
          <react_1.AnimatePresence initial={false} mode="wait">
            {isActive && !isDisabled && (<react_1.motion.div layoutId={`transition-background-${contextId}`} data-slot="motion-highlight" style={{
                        position: 'absolute',
                        zIndex: 0,
                        ...contextStyle,
                        ...style,
                    }} className={(0, utils_1.cn)(contextClassName, activeClassName)} transition={itemTransition} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{
                        opacity: 0,
                        transition: {
                            ...itemTransition,
                            delay: (itemTransition?.delay ?? 0) +
                                (exitDelay ?? contextExitDelay ?? 0) / 1000,
                        },
                    }} {...dataAttributes}/>)}
          </react_1.AnimatePresence>

          <Component data-slot="motion-highlight-item" style={{ position: 'relative', zIndex: 1 }} className={className} {...dataAttributes}>
            {children}
          </Component>
        </>);
        }
        return React.cloneElement(element, {
            ref: refCallback,
            ...getNonOverridingDataAttributes(element, {
                ...dataAttributes,
                'data-slot': 'motion-highlight-item',
            }),
            ...commonHandlers,
        });
    }
    return enabled ? (<Component key={childValue} ref={localRef} data-slot="motion-highlight-item-container" className={(0, utils_1.cn)(mode === 'children' && 'relative', className)} {...dataAttributes} {...props} {...commonHandlers}>
      {mode === 'children' && (<react_1.AnimatePresence initial={false} mode="wait">
          {isActive && !isDisabled && (<react_1.motion.div layoutId={`transition-background-${contextId}`} data-slot="motion-highlight" style={{
                    position: 'absolute',
                    zIndex: 0,
                    ...contextStyle,
                    ...style,
                }} className={(0, utils_1.cn)(contextClassName, activeClassName)} transition={itemTransition} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{
                    opacity: 0,
                    transition: {
                        ...itemTransition,
                        delay: (itemTransition?.delay ?? 0) +
                            (exitDelay ?? contextExitDelay ?? 0) / 1000,
                    },
                }} {...dataAttributes}/>)}
        </react_1.AnimatePresence>)}

      {React.cloneElement(element, {
            style: { position: 'relative', zIndex: 1 },
            className: element.props.className,
            ...getNonOverridingDataAttributes(element, {
                ...dataAttributes,
                'data-slot': 'motion-highlight-item',
            }),
        })}
    </Component>) : (children);
}
//# sourceMappingURL=highlight.js.map