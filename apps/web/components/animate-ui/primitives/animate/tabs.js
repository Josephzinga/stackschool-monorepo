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
exports.useTabs = void 0;
exports.Tabs = Tabs;
exports.TabsList = TabsList;
exports.TabsHighlight = TabsHighlight;
exports.TabsHighlightItem = TabsHighlightItem;
exports.TabsTrigger = TabsTrigger;
exports.TabsContents = TabsContents;
exports.TabsContent = TabsContent;
const React = __importStar(require("react"));
const react_1 = require("motion/react");
const highlight_1 = require("@/components/animate-ui/primitives/effects/highlight");
const get_strict_context_1 = require("@/lib/get-strict-context");
const slot_1 = require("@/components/animate-ui/primitives/animate/slot");
const [TabsProvider, useTabs] = (0, get_strict_context_1.getStrictContext)('TabsContext');
exports.useTabs = useTabs;
function Tabs({ defaultValue, value, onValueChange, children, ...props }) {
    const [activeValue, setActiveValue] = React.useState(defaultValue);
    const triggersRef = React.useRef(new Map());
    const initialSet = React.useRef(false);
    const isControlled = value !== undefined;
    React.useEffect(() => {
        if (!isControlled &&
            activeValue === undefined &&
            triggersRef.current.size > 0 &&
            !initialSet.current) {
            const firstTab = triggersRef.current.keys().next().value;
            if (firstTab !== undefined) {
                setActiveValue(firstTab);
                initialSet.current = true;
            }
        }
    }, [activeValue, isControlled]);
    const registerTrigger = React.useCallback((val, node) => {
        if (node) {
            triggersRef.current.set(val, node);
            if (!isControlled && activeValue === undefined && !initialSet.current) {
                setActiveValue(val);
                initialSet.current = true;
            }
        }
        else {
            triggersRef.current.delete(val);
        }
    }, [activeValue, isControlled]);
    const handleValueChange = React.useCallback((val) => {
        if (!isControlled)
            setActiveValue(val);
        else
            onValueChange?.(val);
    }, [isControlled, onValueChange]);
    return (<TabsProvider value={{
            activeValue: (value ?? activeValue),
            handleValueChange,
            registerTrigger,
        }}>
      <div data-slot="tabs" {...props}>
        {children}
      </div>
    </TabsProvider>);
}
function TabsHighlight({ transition = { type: 'spring', stiffness: 200, damping: 25 }, ...props }) {
    const { activeValue } = useTabs();
    return (<highlight_1.Highlight data-slot="tabs-highlight" controlledItems value={activeValue} transition={transition} click={false} {...props}/>);
}
function TabsList(props) {
    return <div role="tablist" data-slot="tabs-list" {...props}/>;
}
function TabsHighlightItem(props) {
    return <highlight_1.HighlightItem data-slot="tabs-highlight-item" {...props}/>;
}
function TabsTrigger({ ref, value, asChild = false, ...props }) {
    const { activeValue, handleValueChange, registerTrigger } = useTabs();
    const localRef = React.useRef(null);
    React.useImperativeHandle(ref, () => localRef.current);
    React.useEffect(() => {
        registerTrigger(value, localRef.current);
        return () => registerTrigger(value, null);
    }, [value, registerTrigger]);
    const Component = asChild ? slot_1.Slot : react_1.motion.button;
    return (<Component ref={localRef} data-slot="tabs-trigger" role="tab" onClick={() => handleValueChange(value)} data-state={activeValue === value ? 'active' : 'inactive'} {...props}/>);
}
function TabsContents({ children, transition = {
    type: 'spring',
    stiffness: 300,
    damping: 30,
    bounce: 0,
    restDelta: 0.01,
}, ...props }) {
    const { activeValue } = useTabs();
    const childrenArray = React.Children.toArray(children);
    const activeIndex = childrenArray.findIndex((child) => React.isValidElement(child) &&
        typeof child.props === 'object' &&
        child.props !== null &&
        'value' in child.props &&
        child.props.value === activeValue);
    const containerRef = React.useRef(null);
    const itemRefs = React.useRef([]);
    const [height, setHeight] = React.useState(0);
    const roRef = React.useRef(null);
    const measure = React.useCallback((index) => {
        const pane = itemRefs.current[index];
        const container = containerRef.current;
        if (!pane || !container)
            return 0;
        const base = pane.getBoundingClientRect().height || 0;
        const cs = getComputedStyle(container);
        const isBorderBox = cs.boxSizing === 'border-box';
        const paddingY = (parseFloat(cs.paddingTop || '0') || 0) +
            (parseFloat(cs.paddingBottom || '0') || 0);
        const borderY = (parseFloat(cs.borderTopWidth || '0') || 0) +
            (parseFloat(cs.borderBottomWidth || '0') || 0);
        let total = base + (isBorderBox ? paddingY + borderY : 0);
        const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
        total = Math.ceil(total * dpr) / dpr;
        return total;
    }, []);
    React.useEffect(() => {
        if (roRef.current) {
            roRef.current.disconnect();
            roRef.current = null;
        }
        const pane = itemRefs.current[activeIndex];
        const container = containerRef.current;
        if (!pane || !container)
            return;
        setHeight(measure(activeIndex));
        const ro = new ResizeObserver(() => {
            const next = measure(activeIndex);
            requestAnimationFrame(() => setHeight(next));
        });
        ro.observe(pane);
        ro.observe(container);
        roRef.current = ro;
        return () => {
            ro.disconnect();
            roRef.current = null;
        };
    }, [activeIndex, childrenArray.length, measure]);
    React.useLayoutEffect(() => {
        if (height === 0 && activeIndex >= 0) {
            const next = measure(activeIndex);
            if (next !== 0)
                setHeight(next);
        }
    }, [activeIndex, height, measure]);
    return (<react_1.motion.div ref={containerRef} data-slot="tabs-contents" style={{ overflow: 'hidden' }} animate={{ height }} transition={transition} {...props}>
      <react_1.motion.div className="flex -mx-2" animate={{ x: activeIndex * -100 + '%' }} transition={transition}>
        {childrenArray.map((child, index) => (<div key={index} ref={(el) => {
                itemRefs.current[index] = el;
            }} className="w-full shrink-0 px-2 h-full">
            {child}
          </div>))}
      </react_1.motion.div>
    </react_1.motion.div>);
}
function TabsContent({ value, style, asChild = false, ...props }) {
    const { activeValue } = useTabs();
    const isActive = activeValue === value;
    const Component = asChild ? slot_1.Slot : react_1.motion.div;
    return (<Component role="tabpanel" data-slot="tabs-content" inert={!isActive} style={{ overflow: 'hidden', ...style }} initial={{ filter: 'blur(0px)' }} animate={{ filter: isActive ? 'blur(0px)' : 'blur(4px)' }} exit={{ filter: 'blur(0px)' }} transition={{ type: 'spring', stiffness: 200, damping: 25 }} {...props}/>);
}
//# sourceMappingURL=tabs.js.map