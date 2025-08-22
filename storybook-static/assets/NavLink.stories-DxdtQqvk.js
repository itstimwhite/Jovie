import{j as e}from"./jsx-runtime-nlD-EgCR.js";import{L as F}from"./link-C04pt5ug.js";import{c as q}from"./utils-C1Vhx1Sh.js";import"./iframe-BD9qcwu-.js";import"./preload-helper-Dp1pzeXC.js";import"./use-merged-ref-BX-EWIVL.js";import"./clsx-B-dksMZM.js";function a({href:o,children:A,className:T,variant:B="default"}){const C="inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2",c={default:"text-sm text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors",primary:"bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-white/90 focus-visible:ring-gray-500 dark:focus-visible:ring-white/50 px-3 py-1.5 text-sm hover:scale-105"};return e.jsx(F,{href:o,className:q(B==="default"?c.default:`${C} ${c.primary}`,T),children:A})}try{a.displayName="NavLink",a.__docgenInfo={description:"",displayName:"NavLink",props:{href:{defaultValue:null,description:"",name:"href",required:!0,type:{name:"string"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string | undefined"}},variant:{defaultValue:{value:"default"},description:"",name:"variant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"primary"'},{value:'"default"'}]}}}}}catch{}const I={title:"Atoms/NavLink",component:a,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{variant:{control:{type:"select"},options:["default","primary"]}}},r={args:{href:"/dashboard",children:"Dashboard",variant:"default"}},n={args:{href:"/sign-up",children:"Sign Up",variant:"primary"}},t={args:{href:"/about",children:"About Our Company",variant:"default"}},i={args:{href:"/get-started",children:"Get Started Now",variant:"primary"}},s={render:()=>e.jsxs("div",{className:"flex gap-4",children:[e.jsx(a,{href:"/features",variant:"default",children:"Features"}),e.jsx(a,{href:"/pricing",variant:"default",children:"Pricing"}),e.jsx(a,{href:"/sign-up",variant:"primary",children:"Sign Up"})]})},d={render:()=>e.jsx("nav",{className:"bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 w-full p-4",children:e.jsxs("div",{className:"max-w-7xl mx-auto flex items-center justify-between",children:[e.jsx("div",{className:"flex items-center space-x-1",children:e.jsx("span",{className:"font-bold text-xl",children:"Jovie"})}),e.jsxs("div",{className:"hidden md:flex items-center space-x-6",children:[e.jsx(a,{href:"/features",variant:"default",children:"Features"}),e.jsx(a,{href:"/pricing",variant:"default",children:"Pricing"}),e.jsx(a,{href:"/about",variant:"default",children:"About"}),e.jsx(a,{href:"/sign-up",variant:"primary",children:"Sign Up"})]})]})}),parameters:{layout:"fullscreen"}},l={render:()=>e.jsxs("div",{className:"bg-gray-50 dark:bg-gray-900 p-6 rounded-lg",children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Navigation Menu"}),e.jsxs("div",{className:"flex flex-col space-y-2",children:[e.jsx(a,{href:"/dashboard",variant:"default",children:"Dashboard"}),e.jsx(a,{href:"/profile",variant:"default",children:"Profile"}),e.jsx(a,{href:"/settings",variant:"default",children:"Settings"}),e.jsx(a,{href:"/help",variant:"default",children:"Help & Support"}),e.jsx("div",{className:"pt-2",children:e.jsx(a,{href:"/upgrade",variant:"primary",children:"Upgrade Plan"})})]})]})};var u,p,f;r.parameters={...r.parameters,docs:{...(u=r.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    href: '/dashboard',
    children: 'Dashboard',
    variant: 'default'
  }
}`,...(f=(p=r.parameters)==null?void 0:p.docs)==null?void 0:f.source}}};var m,v,g;n.parameters={...n.parameters,docs:{...(m=n.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    href: '/sign-up',
    children: 'Sign Up',
    variant: 'primary'
  }
}`,...(g=(v=n.parameters)==null?void 0:v.docs)==null?void 0:g.source}}};var h,x,N;t.parameters={...t.parameters,docs:{...(h=t.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    href: '/about',
    children: 'About Our Company',
    variant: 'default'
  }
}`,...(N=(x=t.parameters)==null?void 0:x.docs)==null?void 0:N.source}}};var b,y,k;i.parameters={...i.parameters,docs:{...(b=i.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    href: '/get-started',
    children: 'Get Started Now',
    variant: 'primary'
  }
}`,...(k=(y=i.parameters)==null?void 0:y.docs)==null?void 0:k.source}}};var L,j,S;s.parameters={...s.parameters,docs:{...(L=s.parameters)==null?void 0:L.docs,source:{originalSource:`{
  render: () => <div className="flex gap-4">
      <NavLink href="/features" variant="default">
        Features
      </NavLink>
      <NavLink href="/pricing" variant="default">
        Pricing
      </NavLink>
      <NavLink href="/sign-up" variant="primary">
        Sign Up
      </NavLink>
    </div>
}`,...(S=(j=s.parameters)==null?void 0:j.docs)==null?void 0:S.source}}};var w,P,_;d.parameters={...d.parameters,docs:{...(w=d.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: () => <nav className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 w-full p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <span className="font-bold text-xl">Jovie</span>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <NavLink href="/features" variant="default">
            Features
          </NavLink>
          <NavLink href="/pricing" variant="default">
            Pricing
          </NavLink>
          <NavLink href="/about" variant="default">
            About
          </NavLink>
          <NavLink href="/sign-up" variant="primary">
            Sign Up
          </NavLink>
        </div>
      </div>
    </nav>,
  parameters: {
    layout: 'fullscreen'
  }
}`,...(_=(P=d.parameters)==null?void 0:P.docs)==null?void 0:_.source}}};var U,V,D;l.parameters={...l.parameters,docs:{...(U=l.parameters)==null?void 0:U.docs,source:{originalSource:`{
  render: () => <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Navigation Menu</h3>
      <div className="flex flex-col space-y-2">
        <NavLink href="/dashboard" variant="default">
          Dashboard
        </NavLink>
        <NavLink href="/profile" variant="default">
          Profile
        </NavLink>
        <NavLink href="/settings" variant="default">
          Settings
        </NavLink>
        <NavLink href="/help" variant="default">
          Help & Support
        </NavLink>
        <div className="pt-2">
          <NavLink href="/upgrade" variant="primary">
            Upgrade Plan
          </NavLink>
        </div>
      </div>
    </div>
}`,...(D=(V=l.parameters)==null?void 0:V.docs)==null?void 0:D.source}}};const R=["Default","Primary","LongText","PrimaryLongText","BothVariants","NavigationBar","VerticalNavigation"];export{s as BothVariants,r as Default,t as LongText,d as NavigationBar,n as Primary,i as PrimaryLongText,l as VerticalNavigation,R as __namedExportsOrder,I as default};
