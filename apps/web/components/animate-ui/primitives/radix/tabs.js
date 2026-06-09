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
exports.Tabs = Tabs;
exports.TabsHighlight = TabsHighlight;
exports.TabsHighlightItem = TabsHighlightItem;
exports.TabsList = TabsList;
exports.TabsTrigger = TabsTrigger;
exports.TabsContent = TabsContent;
exports.TabsContents = TabsContents;
const React = __importStar(require("react"));
const radix_ui_1 = require("radix-ui");
const react_1 = require("motion/react");
const highlight_1 = require("@/components/animate-ui/primitives/effects/highlight");
const get_strict_context_1 = require("@/lib/get-strict-context");
const use_controlled_state_1 = require("@/hooks/use-controlled-state");
const auto_height_1 = require("@/components/animate-ui/primitives/effects/auto-height");
const [TabsProvider, useTabs] = (0, get_strict_context_1.getStrictContext)('TabsContext');
function Tabs(props) {
    const [value, setValue] = (0, use_controlled_state_1.useControlledState)({
        value: props.value,
        defaultValue: props.defaultValue,
        onChange: props.onValueChange,
    });
    return (<TabsProvider value={{ value, setValue }}>
      <radix_ui_1.Tabs.Root data-slot="tabs" {...props} onValueChange={setValue}/>
    </TabsProvider>);
}
function TabsHighlight({ transition = { type: 'spring', stiffness: 200, damping: 25 }, ...props }) {
    const { value } = useTabs();
    return (<highlight_1.Highlight data-slot="tabs-highlight" controlledItems value={value} transition={transition} click={false} {...props}/>);
}
function TabsList(props) {
    return <radix_ui_1.Tabs.List data-slot="tabs-list" {...props}/>;
}
function TabsHighlightItem(props) {
    return <highlight_1.HighlightItem data-slot="tabs-highlight-item" {...props}/>;
}
function TabsTrigger(props) {
    return <radix_ui_1.Tabs.Trigger data-slot="tabs-trigger" {...props}/>;
}
function TabsContent({ value, forceMount, transition = { duration: 0.5, ease: 'easeInOut' }, ...props }) {
    return (<react_1.AnimatePresence mode="wait">
      <radix_ui_1.Tabs.Content asChild forceMount={forceMount} value={value}>
        <react_1.motion.div data-slot="tabs-content" layout layoutDependency={value} initial={{ opacity: 0, filter: 'blur(4px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, filter: 'blur(4px)' }} transition={transition} {...props}/>
      </radix_ui_1.Tabs.Content>
    </react_1.AnimatePresence>);
}
const defaultTransition = {
    type: 'spring',
    stiffness: 200,
    damping: 30,
};
function isAutoMode(props) {
    return !('mode' in props) || props.mode === 'auto-height';
}
function TabsContents(props) {
    const { value } = useTabs();
    if (isAutoMode(props)) {
        const { transition = defaultTransition, ...autoProps } = props;
        return (<auto_height_1.AutoHeight data-slot="tabs-contents" deps={[value]} transition={transition} {...autoProps}/>);
    }
    const { transition = defaultTransition, style, ...layoutProps } = props;
    return (<react_1.motion.div data-slot="tabs-contents" layout="size" layoutDependency={value} style={{ overflow: 'hidden', ...style }} transition={{ layout: transition }} {...layoutProps}/>);
}
//# sourceMappingURL=tabs.js.map