import{j as e}from"./jsx-runtime-nlD-EgCR.js";import{C as a}from"./CTAButton-BSDyOQHA.js";import{r as B}from"./iframe-BD9qcwu-.js";import"./link-C04pt5ug.js";import"./use-merged-ref-BX-EWIVL.js";import"./index-BOW8JOCe.js";import"./clsx-B-dksMZM.js";import"./image-DeoQVfv0.js";import"./proxy-BWvWzjh9.js";import"./preload-helper-Dp1pzeXC.js";function Ne({title:z,titleId:A,...je},Le){return B.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true","data-slot":"icon",ref:Le,"aria-labelledby":A},je),z?B.createElement("title",{id:A},z):null,B.createElement("path",{fillRule:"evenodd",d:"M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z",clipRule:"evenodd"}))}const De=B.forwardRef(Ne),Ge={title:"Atoms/CTAButton",component:a,parameters:{layout:"centered",docs:{description:{component:"A high-quality Call-to-Action button with multiple states and animations."}}},tags:["autodocs"],argTypes:{variant:{control:{type:"select"},options:["primary","secondary","outline"],description:"Visual style variant"},size:{control:{type:"select"},options:["sm","md","lg"],description:"Size variant"},isLoading:{control:{type:"boolean"},description:"Whether the button is in a loading state"},isSuccess:{control:{type:"boolean"},description:"Whether the button is in a success state"},disabled:{control:{type:"boolean"},description:"Whether the button is disabled"},external:{control:{type:"boolean"},description:"Whether the link should open in a new tab"},reducedMotion:{control:{type:"boolean"},description:"Whether to use reduced motion for animations"}}},r={args:{href:"/dashboard",children:"Get Started",variant:"primary",size:"md"}},s={args:{...r.args,variant:"primary"}},n={args:{...r.args,children:"Learn More",variant:"secondary"}},t={args:{...r.args,children:"View Details",variant:"outline"}},i={args:{...r.args,children:"Small Button",size:"sm"}},o={args:{...r.args,children:"Medium Button",size:"md"}},d={args:{...r.args,children:"Large Button",size:"lg"}},c={args:{...r.args,isLoading:!0}},l={args:{...r.args,isSuccess:!0}},m={args:{...r.args,disabled:!0}},u={args:{...r.args,children:"Get Started",icon:e.jsx(De,{className:"h-5 w-5"})}},h={args:{...r.args,href:"https://example.com",children:"External Link",external:!0}},p={args:{...r.args,reducedMotion:!0}},g={render:()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{className:"grid grid-cols-3 gap-4",children:[e.jsx(a,{href:"/dashboard",variant:"primary",size:"md",children:"Idle"}),e.jsx(a,{href:"/dashboard",variant:"primary",size:"md",isLoading:!0,children:"Loading"}),e.jsx(a,{href:"/dashboard",variant:"primary",size:"md",isSuccess:!0,children:"Success"})]}),e.jsxs("div",{className:"grid grid-cols-3 gap-4",children:[e.jsx(a,{href:"/dashboard",variant:"secondary",size:"md",children:"Idle"}),e.jsx(a,{href:"/dashboard",variant:"secondary",size:"md",isLoading:!0,children:"Loading"}),e.jsx(a,{href:"/dashboard",variant:"secondary",size:"md",isSuccess:!0,children:"Success"})]}),e.jsxs("div",{className:"grid grid-cols-3 gap-4",children:[e.jsx(a,{href:"/dashboard",variant:"outline",size:"md",children:"Idle"}),e.jsx(a,{href:"/dashboard",variant:"outline",size:"md",isLoading:!0,children:"Loading"}),e.jsx(a,{href:"/dashboard",variant:"outline",size:"md",isSuccess:!0,children:"Success"})]})]})},b={render:()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(a,{href:"/dashboard",variant:"primary",size:"sm",children:"Small Button"}),e.jsx(a,{href:"/dashboard",variant:"primary",size:"md",children:"Medium Button"}),e.jsx(a,{href:"/dashboard",variant:"primary",size:"lg",children:"Large Button"})]})},f={render:()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(a,{href:"/dashboard",variant:"primary",size:"md",children:"Primary Button"}),e.jsx(a,{href:"/dashboard",variant:"secondary",size:"md",children:"Secondary Button"}),e.jsx(a,{href:"/dashboard",variant:"outline",size:"md",children:"Outline Button"})]})},v={render:()=>e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{className:"flex flex-col gap-4 p-6 bg-white rounded-lg",children:[e.jsx("h3",{className:"text-lg font-semibold mb-2",children:"Light Theme"}),e.jsx(a,{href:"/dashboard",variant:"primary",size:"md",children:"Primary"}),e.jsx(a,{href:"/dashboard",variant:"secondary",size:"md",children:"Secondary"}),e.jsx(a,{href:"/dashboard",variant:"outline",size:"md",children:"Outline"})]}),e.jsxs("div",{className:"flex flex-col gap-4 p-6 bg-gray-900 rounded-lg",children:[e.jsx("h3",{className:"text-lg font-semibold mb-2 text-white",children:"Dark Theme"}),e.jsx(a,{href:"/dashboard",variant:"primary",size:"md",children:"Primary"}),e.jsx(a,{href:"/dashboard",variant:"secondary",size:"md",children:"Secondary"}),e.jsx(a,{href:"/dashboard",variant:"outline",size:"md",children:"Outline"})]})]})},x={args:{children:"Click Me",variant:"primary",size:"md",onClick:()=>alert("Button clicked!")}},y={render:()=>e.jsxs("div",{className:"flex flex-col gap-6",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-2",children:"With aria-label"}),e.jsx(a,{href:"/dashboard",variant:"primary",size:"md",ariaLabel:"Navigate to dashboard",children:"Dashboard"})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-2",children:"Loading state with aria-busy"}),e.jsx(a,{href:"/dashboard",variant:"primary",size:"md",isLoading:!0,children:"Loading Example"})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-2",children:"Disabled state with aria-disabled"}),e.jsx(a,{href:"/dashboard",variant:"primary",size:"md",disabled:!0,children:"Disabled Example"})]})]})};var C,S,T;r.parameters={...r.parameters,docs:{...(C=r.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    href: '/dashboard',
    children: 'Get Started',
    variant: 'primary',
    size: 'md'
  }
}`,...(T=(S=r.parameters)==null?void 0:S.docs)==null?void 0:T.source}}};var j,L,N;s.parameters={...s.parameters,docs:{...(j=s.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    variant: 'primary'
  }
}`,...(N=(L=s.parameters)==null?void 0:L.docs)==null?void 0:N.source}}};var D,w,E;n.parameters={...n.parameters,docs:{...(D=n.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    children: 'Learn More',
    variant: 'secondary'
  }
}`,...(E=(w=n.parameters)==null?void 0:w.docs)==null?void 0:E.source}}};var M,k,O;t.parameters={...t.parameters,docs:{...(M=t.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    children: 'View Details',
    variant: 'outline'
  }
}`,...(O=(k=t.parameters)==null?void 0:k.docs)==null?void 0:O.source}}};var W,I,R;i.parameters={...i.parameters,docs:{...(W=i.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    children: 'Small Button',
    size: 'sm'
  }
}`,...(R=(I=i.parameters)==null?void 0:I.docs)==null?void 0:R.source}}};var P,V,G;o.parameters={...o.parameters,docs:{...(P=o.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    children: 'Medium Button',
    size: 'md'
  }
}`,...(G=(V=o.parameters)==null?void 0:V.docs)==null?void 0:G.source}}};var _,q,F;d.parameters={...d.parameters,docs:{...(_=d.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    children: 'Large Button',
    size: 'lg'
  }
}`,...(F=(q=d.parameters)==null?void 0:q.docs)==null?void 0:F.source}}};var H,Z,J;c.parameters={...c.parameters,docs:{...(H=c.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    isLoading: true
  }
}`,...(J=(Z=c.parameters)==null?void 0:Z.docs)==null?void 0:J.source}}};var K,Q,U;l.parameters={...l.parameters,docs:{...(K=l.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    isSuccess: true
  }
}`,...(U=(Q=l.parameters)==null?void 0:Q.docs)==null?void 0:U.source}}};var X,Y,$;m.parameters={...m.parameters,docs:{...(X=m.parameters)==null?void 0:X.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    disabled: true
  }
}`,...($=(Y=m.parameters)==null?void 0:Y.docs)==null?void 0:$.source}}};var ee,ae,re;u.parameters={...u.parameters,docs:{...(ee=u.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    children: 'Get Started',
    icon: <ArrowRightIcon className="h-5 w-5" />
  }
}`,...(re=(ae=u.parameters)==null?void 0:ae.docs)==null?void 0:re.source}}};var se,ne,te;h.parameters={...h.parameters,docs:{...(se=h.parameters)==null?void 0:se.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    href: 'https://example.com',
    children: 'External Link',
    external: true
  }
}`,...(te=(ne=h.parameters)==null?void 0:ne.docs)==null?void 0:te.source}}};var ie,oe,de;p.parameters={...p.parameters,docs:{...(ie=p.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    reducedMotion: true
  }
}`,...(de=(oe=p.parameters)==null?void 0:oe.docs)==null?void 0:de.source}}};var ce,le,me;g.parameters={...g.parameters,docs:{...(ce=g.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-4">
        <CTAButton href="/dashboard" variant="primary" size="md">
          Idle
        </CTAButton>
        <CTAButton href="/dashboard" variant="primary" size="md" isLoading>
          Loading
        </CTAButton>
        <CTAButton href="/dashboard" variant="primary" size="md" isSuccess>
          Success
        </CTAButton>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <CTAButton href="/dashboard" variant="secondary" size="md">
          Idle
        </CTAButton>
        <CTAButton href="/dashboard" variant="secondary" size="md" isLoading>
          Loading
        </CTAButton>
        <CTAButton href="/dashboard" variant="secondary" size="md" isSuccess>
          Success
        </CTAButton>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <CTAButton href="/dashboard" variant="outline" size="md">
          Idle
        </CTAButton>
        <CTAButton href="/dashboard" variant="outline" size="md" isLoading>
          Loading
        </CTAButton>
        <CTAButton href="/dashboard" variant="outline" size="md" isSuccess>
          Success
        </CTAButton>
      </div>
    </div>
}`,...(me=(le=g.parameters)==null?void 0:le.docs)==null?void 0:me.source}}};var ue,he,pe;b.parameters={...b.parameters,docs:{...(ue=b.parameters)==null?void 0:ue.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">
      <CTAButton href="/dashboard" variant="primary" size="sm">
        Small Button
      </CTAButton>
      <CTAButton href="/dashboard" variant="primary" size="md">
        Medium Button
      </CTAButton>
      <CTAButton href="/dashboard" variant="primary" size="lg">
        Large Button
      </CTAButton>
    </div>
}`,...(pe=(he=b.parameters)==null?void 0:he.docs)==null?void 0:pe.source}}};var ge,be,fe;f.parameters={...f.parameters,docs:{...(ge=f.parameters)==null?void 0:ge.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">
      <CTAButton href="/dashboard" variant="primary" size="md">
        Primary Button
      </CTAButton>
      <CTAButton href="/dashboard" variant="secondary" size="md">
        Secondary Button
      </CTAButton>
      <CTAButton href="/dashboard" variant="outline" size="md">
        Outline Button
      </CTAButton>
    </div>
}`,...(fe=(be=f.parameters)==null?void 0:be.docs)==null?void 0:fe.source}}};var ve,xe,ye;v.parameters={...v.parameters,docs:{...(ve=v.parameters)==null?void 0:ve.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-2 gap-8">
      <div className="flex flex-col gap-4 p-6 bg-white rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Light Theme</h3>
        <CTAButton href="/dashboard" variant="primary" size="md">
          Primary
        </CTAButton>
        <CTAButton href="/dashboard" variant="secondary" size="md">
          Secondary
        </CTAButton>
        <CTAButton href="/dashboard" variant="outline" size="md">
          Outline
        </CTAButton>
      </div>
      <div className="flex flex-col gap-4 p-6 bg-gray-900 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-white">Dark Theme</h3>
        <CTAButton href="/dashboard" variant="primary" size="md">
          Primary
        </CTAButton>
        <CTAButton href="/dashboard" variant="secondary" size="md">
          Secondary
        </CTAButton>
        <CTAButton href="/dashboard" variant="outline" size="md">
          Outline
        </CTAButton>
      </div>
    </div>
}`,...(ye=(xe=v.parameters)==null?void 0:xe.docs)==null?void 0:ye.source}}};var Be,ze,Ae;x.parameters={...x.parameters,docs:{...(Be=x.parameters)==null?void 0:Be.docs,source:{originalSource:`{
  args: {
    children: 'Click Me',
    variant: 'primary',
    size: 'md',
    onClick: () => alert('Button clicked!')
  }
}`,...(Ae=(ze=x.parameters)==null?void 0:ze.docs)==null?void 0:Ae.source}}};var Ce,Se,Te;y.parameters={...y.parameters,docs:{...(Ce=y.parameters)==null?void 0:Ce.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">With aria-label</h3>
        <CTAButton href="/dashboard" variant="primary" size="md" ariaLabel="Navigate to dashboard">
          Dashboard
        </CTAButton>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">
          Loading state with aria-busy
        </h3>
        <CTAButton href="/dashboard" variant="primary" size="md" isLoading>
          Loading Example
        </CTAButton>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">
          Disabled state with aria-disabled
        </h3>
        <CTAButton href="/dashboard" variant="primary" size="md" disabled>
          Disabled Example
        </CTAButton>
      </div>
    </div>
}`,...(Te=(Se=y.parameters)==null?void 0:Se.docs)==null?void 0:Te.source}}};const _e=["Default","Primary","Secondary","Outline","Small","Medium","Large","Loading","Success","Disabled","WithIcon","ExternalLink","ReducedMotion","StateTransitions","AllSizes","AllVariants","ThemeComparison","WithOnClick","AccessibilityExamples"];export{y as AccessibilityExamples,b as AllSizes,f as AllVariants,r as Default,m as Disabled,h as ExternalLink,d as Large,c as Loading,o as Medium,t as Outline,s as Primary,p as ReducedMotion,n as Secondary,i as Small,g as StateTransitions,l as Success,v as ThemeComparison,u as WithIcon,x as WithOnClick,_e as __namedExportsOrder,Ge as default};
