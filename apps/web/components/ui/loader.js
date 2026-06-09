'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoaderFive = exports.LoaderFour = exports.LoaderThree = exports.LoaderTwo = exports.LoaderOne = exports.Loader = void 0;
const react_1 = require("motion/react");
const react_2 = __importDefault(require("react"));
const Loader = () => (<div className="h-full animate-pulse bg-linear-to-b dark:from-gray-900 dark:to-gray-950 from-slate-100 to-slate-200 w-full flex items-center justify-center">
    <exports.LoaderOne />
  </div>);
exports.Loader = Loader;
const LoaderOne = () => {
    const transition = (x) => {
        return {
            duration: 1,
            repeat: Infinity,
            repeatType: 'loop',
            delay: x * 0.2,
            ease: 'easeInOut',
        };
    };
    return (<div className="flex items-center gap-2">
      <react_1.motion.div initial={{
            y: 0,
        }} animate={{
            y: [0, 10, 0],
        }} transition={transition(0)} className="h-4 w-4 rounded-full border border-neutral-300 bg-linear-to-b from-neutral-400 to-neutral-300"/>
      <react_1.motion.div initial={{
            y: 0,
        }} animate={{
            y: [0, 10, 0],
        }} transition={transition(1)} className="h-4 w-4 rounded-full border border-neutral-300 bg-linear-to-b from-neutral-400 to-neutral-300"/>
      <react_1.motion.div initial={{
            y: 0,
        }} animate={{
            y: [0, 10, 0],
        }} transition={transition(2)} className="h-4 w-4 rounded-full border border-neutral-300 bg-linear-to-b from-neutral-400 to-neutral-300"/>
    </div>);
};
exports.LoaderOne = LoaderOne;
const LoaderTwo = () => {
    const transition = (x) => {
        return {
            duration: 2,
            repeat: Infinity,
            repeatType: 'loop',
            delay: x * 0.2,
            ease: 'easeInOut',
        };
    };
    return (<div className="flex items-center">
      <react_1.motion.div transition={transition(0)} initial={{
            x: 0,
        }} animate={{
            x: [0, 20, 0],
        }} className="h-4 w-4 rounded-full bg-neutral-200 shadow-md dark:bg-neutral-500"/>
      <react_1.motion.div initial={{
            x: 0,
        }} animate={{
            x: [0, 20, 0],
        }} transition={transition(0.4)} className="h-4 w-4 -translate-x-2 rounded-full bg-neutral-200 shadow-md dark:bg-neutral-500"/>
      <react_1.motion.div initial={{
            x: 0,
        }} animate={{
            x: [0, 20, 0],
        }} transition={transition(0.8)} className="h-4 w-4 -translate-x-4 rounded-full bg-neutral-200 shadow-md dark:bg-neutral-500"/>
    </div>);
};
exports.LoaderTwo = LoaderTwo;
const LoaderThree = () => {
    return (<react_1.motion.svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="h-20 w-20 stroke-neutral-500 [--fill-final:var(--color-yellow-300)] [--fill-initial:var(--color-neutral-50)] dark:stroke-neutral-100 dark:[--fill-final:var(--color-yellow-500)] dark:[--fill-initial:var(--color-neutral-800)]">
      <react_1.motion.path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <react_1.motion.path initial={{ pathLength: 0, fill: 'var(--fill-initial)' }} animate={{ pathLength: 1, fill: 'var(--fill-final)' }} transition={{
            duration: 2,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'reverse',
        }} d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11"/>
    </react_1.motion.svg>);
};
exports.LoaderThree = LoaderThree;
const LoaderFour = ({ text = 'Loading...' }) => {
    return (<div className="relative font-bold text-black [perspective:1000px] dark:text-white">
      <react_1.motion.span animate={{
            skewX: [0, -40, 0],
            scaleX: [1, 2, 1],
        }} transition={{
            duration: 0.05,
            repeat: Infinity,
            repeatType: 'reverse',
            repeatDelay: 2,
            ease: 'linear',
            times: [0, 0.2, 0.5, 0.8, 1],
        }} className="relative z-20 inline-block">
        {text}
      </react_1.motion.span>
      <react_1.motion.span className="absolute inset-0 text-[#00e571]/50 blur-[0.5px] dark:text-[#00e571]" animate={{
            x: [-2, 4, -3, 1.5, -2],
            y: [-2, 4, -3, 1.5, -2],
            opacity: [0.3, 0.9, 0.4, 0.8, 0.3],
        }} transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear',
            times: [0, 0.2, 0.5, 0.8, 1],
        }}>
        {text}
      </react_1.motion.span>
      <react_1.motion.span className="absolute inset-0 text-[#8b00ff]/50 dark:text-[#8b00ff]" animate={{
            x: [0, 1, -1.5, 1.5, -1, 0],
            y: [0, -1, 1.5, -0.5, 0],
            opacity: [0.4, 0.8, 0.3, 0.9, 0.4],
        }} transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear',
            times: [0, 0.3, 0.6, 0.8, 1],
        }}>
        {text}
      </react_1.motion.span>
    </div>);
};
exports.LoaderFour = LoaderFour;
const LoaderFive = ({ text }) => {
    return (<div className="font-sans font-bold [--shadow-color:var(--color-neutral-500)] dark:[--shadow-color:var(--color-neutral-100)]">
      {text.split('').map((char, i) => (<react_1.motion.span key={i} className="inline-block" initial={{ scale: 1, opacity: 0.5 }} animate={{
                scale: [1, 1.1, 1],
                textShadow: [
                    '0 0 0 var(--shadow-color)',
                    '0 0 1px var(--shadow-color)',
                    '0 0 0 var(--shadow-color)',
                ],
                opacity: [0.5, 1, 0.5],
            }} transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: 'loop',
                delay: i * 0.05,
                ease: 'easeInOut',
                repeatDelay: 2,
            }}>
          {char === ' ' ? '\u00A0' : char}
        </react_1.motion.span>))}
    </div>);
};
exports.LoaderFive = LoaderFive;
//# sourceMappingURL=loader.js.map