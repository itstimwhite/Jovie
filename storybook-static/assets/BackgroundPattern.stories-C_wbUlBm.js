import{j as e}from"./jsx-runtime-nlD-EgCR.js";import{B as t}from"./BackgroundPattern-DjnfHVKt.js";import"./iframe-BD9qcwu-.js";import"./preload-helper-Dp1pzeXC.js";import"./utils-C1Vhx1Sh.js";import"./clsx-B-dksMZM.js";const D={title:"Atoms/BackgroundPattern",component:t,parameters:{layout:"fullscreen"},tags:["autodocs"],argTypes:{variant:{control:{type:"select"},options:["grid","dots","gradient"]}}},r={args:{variant:"grid"},render:a=>e.jsxs("div",{className:"relative h-96 w-full",children:[e.jsx(t,{...a}),e.jsx("div",{className:"relative z-10 flex items-center justify-center h-full",children:e.jsxs("div",{className:"text-center",children:[e.jsx("h2",{className:"text-2xl font-bold text-gray-900 dark:text-white mb-2",children:"Grid Pattern"}),e.jsx("p",{className:"text-gray-600 dark:text-gray-400",children:"Subtle grid pattern background"})]})})]})},s={args:{variant:"dots"},render:a=>e.jsxs("div",{className:"relative h-96 w-full",children:[e.jsx(t,{...a}),e.jsx("div",{className:"relative z-10 flex items-center justify-center h-full",children:e.jsxs("div",{className:"text-center",children:[e.jsx("h2",{className:"text-2xl font-bold text-gray-900 dark:text-white mb-2",children:"Dots Pattern"}),e.jsx("p",{className:"text-gray-600 dark:text-gray-400",children:"Radial dots pattern background"})]})})]})},d={args:{variant:"gradient"},render:a=>e.jsxs("div",{className:"relative h-96 w-full",children:[e.jsx(t,{...a}),e.jsx("div",{className:"relative z-10 flex items-center justify-center h-full",children:e.jsxs("div",{className:"text-center",children:[e.jsx("h2",{className:"text-2xl font-bold text-gray-900 dark:text-white mb-2",children:"Gradient Pattern"}),e.jsx("p",{className:"text-gray-600 dark:text-gray-400",children:"Beautiful gradient background"})]})})]})},i={args:{variant:"grid"},parameters:{backgrounds:{default:"dark"}},render:a=>e.jsxs("div",{className:"relative h-96 w-full",children:[e.jsx(t,{...a}),e.jsx("div",{className:"relative z-10 flex items-center justify-center h-full",children:e.jsxs("div",{className:"text-center",children:[e.jsx("h2",{className:"text-2xl font-bold text-gray-900 dark:text-white mb-2",children:"Dark Mode Grid"}),e.jsx("p",{className:"text-gray-600 dark:text-gray-400",children:"Grid pattern in dark mode"})]})})]})},l={render:()=>e.jsxs("div",{className:"relative h-96 w-full",children:[e.jsx(t,{variant:"gradient"}),e.jsx(t,{variant:"grid",className:"opacity-50"}),e.jsx("div",{className:"relative z-10 flex items-center justify-center h-full",children:e.jsxs("div",{className:"text-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-lg p-6",children:[e.jsx("h2",{className:"text-2xl font-bold text-gray-900 dark:text-white mb-2",children:"Layered Patterns"}),e.jsx("p",{className:"text-gray-600 dark:text-gray-400",children:"Gradient with overlaid grid pattern"})]})})]})};var n,c,o;r.parameters={...r.parameters,docs:{...(n=r.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    variant: 'grid'
  },
  render: args => <div className="relative h-96 w-full">
      <BackgroundPattern {...args} />
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Grid Pattern
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Subtle grid pattern background
          </p>
        </div>
      </div>
    </div>
}`,...(o=(c=r.parameters)==null?void 0:c.docs)==null?void 0:o.source}}};var x,m,g;s.parameters={...s.parameters,docs:{...(x=s.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    variant: 'dots'
  },
  render: args => <div className="relative h-96 w-full">
      <BackgroundPattern {...args} />
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Dots Pattern
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Radial dots pattern background
          </p>
        </div>
      </div>
    </div>
}`,...(g=(m=s.parameters)==null?void 0:m.docs)==null?void 0:g.source}}};var v,u,h;d.parameters={...d.parameters,docs:{...(v=d.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    variant: 'gradient'
  },
  render: args => <div className="relative h-96 w-full">
      <BackgroundPattern {...args} />
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Gradient Pattern
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Beautiful gradient background
          </p>
        </div>
      </div>
    </div>
}`,...(h=(u=d.parameters)==null?void 0:u.docs)==null?void 0:h.source}}};var p,f,N;i.parameters={...i.parameters,docs:{...(p=i.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    variant: 'grid'
  },
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  },
  render: args => <div className="relative h-96 w-full">
      <BackgroundPattern {...args} />
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Dark Mode Grid
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Grid pattern in dark mode
          </p>
        </div>
      </div>
    </div>
}`,...(N=(f=i.parameters)==null?void 0:f.docs)==null?void 0:N.source}}};var y,k,j;l.parameters={...l.parameters,docs:{...(y=l.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => <div className="relative h-96 w-full">
      <BackgroundPattern variant="gradient" />
      <BackgroundPattern variant="grid" className="opacity-50" />
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Layered Patterns
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Gradient with overlaid grid pattern
          </p>
        </div>
      </div>
    </div>
}`,...(j=(k=l.parameters)==null?void 0:k.docs)==null?void 0:j.source}}};const S=["Grid","Dots","Gradient","InDarkMode","LayeredPatterns"];export{s as Dots,d as Gradient,r as Grid,i as InDarkMode,l as LayeredPatterns,S as __namedExportsOrder,D as default};
