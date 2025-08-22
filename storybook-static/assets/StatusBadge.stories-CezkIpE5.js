import{j as e}from"./jsx-runtime-nlD-EgCR.js";import{S as r}from"./StatusBadge-DzBeyz6V.js";import"./iframe-BD9qcwu-.js";import"./preload-helper-Dp1pzeXC.js";const a=e.jsx("svg",{className:"w-4 h-4",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M5 13l4 4L19 7"})}),h=e.jsx("svg",{className:"w-4 h-4",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M13 10V3L4 14h7v7l9-11h-7z"})}),ae={title:"Atoms/StatusBadge",component:r,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{variant:{control:{type:"select"},options:["blue","green","purple","orange","red","gray"]},size:{control:{type:"select"},options:["sm","md","lg"]}}},n={args:{children:"The Solution",variant:"green",icon:a}},s={args:{children:"How It Works",variant:"blue",icon:h}},t={args:{children:"Features",variant:"purple",icon:a}},o={args:{children:"Warning",variant:"orange"}},c={args:{children:"Error",variant:"red"}},i={args:{children:"Neutral",variant:"gray"}},d={args:{children:"No Icon Badge",variant:"blue"}},l={args:{children:"Small Badge",variant:"green",icon:a,size:"sm"}},g={args:{children:"Large Badge",variant:"purple",icon:h,size:"lg"}},u={render:()=>e.jsxs("div",{className:"flex flex-wrap gap-4",children:[e.jsx(r,{variant:"blue",icon:h,children:"Blue Badge"}),e.jsx(r,{variant:"green",icon:a,children:"Green Badge"}),e.jsx(r,{variant:"purple",icon:h,children:"Purple Badge"}),e.jsx(r,{variant:"orange",children:"Orange Badge"}),e.jsx(r,{variant:"red",children:"Red Badge"}),e.jsx(r,{variant:"gray",children:"Gray Badge"})]})},m={render:()=>e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(r,{variant:"blue",icon:a,size:"sm",children:"Small"}),e.jsx(r,{variant:"green",icon:a,size:"md",children:"Medium"}),e.jsx(r,{variant:"purple",icon:a,size:"lg",children:"Large"})]})},p={render:()=>e.jsxs("div",{className:"max-w-2xl p-6 bg-gray-50 dark:bg-gray-900 rounded-lg",children:[e.jsx("div",{className:"mb-6 text-center",children:e.jsx(r,{variant:"green",icon:a,children:"The Solution"})}),e.jsx("h2",{className:"text-3xl font-bold text-center mb-4",children:"Built for musicians, optimized for conversion"}),e.jsx("p",{className:"text-gray-600 dark:text-gray-300 text-center",children:"Every element is designed to turn fans into streams. No distractions, just results."})]})};var v,x,B;n.parameters={...n.parameters,docs:{...(v=n.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    children: 'The Solution',
    variant: 'green',
    icon: CheckIcon
  }
}`,...(B=(x=n.parameters)==null?void 0:x.docs)==null?void 0:B.source}}};var S,j,k;s.parameters={...s.parameters,docs:{...(S=s.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    children: 'How It Works',
    variant: 'blue',
    icon: LightningIcon
  }
}`,...(k=(j=s.parameters)==null?void 0:j.docs)==null?void 0:k.source}}};var y,I,f;t.parameters={...t.parameters,docs:{...(y=t.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    children: 'Features',
    variant: 'purple',
    icon: CheckIcon
  }
}`,...(f=(I=t.parameters)==null?void 0:I.docs)==null?void 0:f.source}}};var N,b,L;o.parameters={...o.parameters,docs:{...(N=o.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    children: 'Warning',
    variant: 'orange'
  }
}`,...(L=(b=o.parameters)==null?void 0:b.docs)==null?void 0:L.source}}};var z,C,w;c.parameters={...c.parameters,docs:{...(z=c.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    children: 'Error',
    variant: 'red'
  }
}`,...(w=(C=c.parameters)==null?void 0:C.docs)==null?void 0:w.source}}};var W,E,G;i.parameters={...i.parameters,docs:{...(W=i.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    children: 'Neutral',
    variant: 'gray'
  }
}`,...(G=(E=i.parameters)==null?void 0:E.docs)==null?void 0:G.source}}};var A,O,R;d.parameters={...d.parameters,docs:{...(A=d.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    children: 'No Icon Badge',
    variant: 'blue'
  }
}`,...(R=(O=d.parameters)==null?void 0:O.docs)==null?void 0:R.source}}};var T,M,P;l.parameters={...l.parameters,docs:{...(T=l.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    children: 'Small Badge',
    variant: 'green',
    icon: CheckIcon,
    size: 'sm'
  }
}`,...(P=(M=l.parameters)==null?void 0:M.docs)==null?void 0:P.source}}};var V,D,F;g.parameters={...g.parameters,docs:{...(V=g.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    children: 'Large Badge',
    variant: 'purple',
    icon: LightningIcon,
    size: 'lg'
  }
}`,...(F=(D=g.parameters)==null?void 0:D.docs)==null?void 0:F.source}}};var H,_,q;u.parameters={...u.parameters,docs:{...(H=u.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-4">
      <StatusBadge variant="blue" icon={LightningIcon}>
        Blue Badge
      </StatusBadge>
      <StatusBadge variant="green" icon={CheckIcon}>
        Green Badge
      </StatusBadge>
      <StatusBadge variant="purple" icon={LightningIcon}>
        Purple Badge
      </StatusBadge>
      <StatusBadge variant="orange">Orange Badge</StatusBadge>
      <StatusBadge variant="red">Red Badge</StatusBadge>
      <StatusBadge variant="gray">Gray Badge</StatusBadge>
    </div>
}`,...(q=(_=u.parameters)==null?void 0:_.docs)==null?void 0:q.source}}};var J,K,Q;m.parameters={...m.parameters,docs:{...(J=m.parameters)==null?void 0:J.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-4">
      <StatusBadge variant="blue" icon={CheckIcon} size="sm">
        Small
      </StatusBadge>
      <StatusBadge variant="green" icon={CheckIcon} size="md">
        Medium
      </StatusBadge>
      <StatusBadge variant="purple" icon={CheckIcon} size="lg">
        Large
      </StatusBadge>
    </div>
}`,...(Q=(K=m.parameters)==null?void 0:K.docs)==null?void 0:Q.source}}};var U,X,Y;p.parameters={...p.parameters,docs:{...(U=p.parameters)==null?void 0:U.docs,source:{originalSource:`{
  render: () => <div className="max-w-2xl p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <div className="mb-6 text-center">
        <StatusBadge variant="green" icon={CheckIcon}>
          The Solution
        </StatusBadge>
      </div>
      <h2 className="text-3xl font-bold text-center mb-4">
        Built for musicians, optimized for conversion
      </h2>
      <p className="text-gray-600 dark:text-gray-300 text-center">
        Every element is designed to turn fans into streams. No distractions,
        just results.
      </p>
    </div>
}`,...(Y=(X=p.parameters)==null?void 0:X.docs)==null?void 0:Y.source}}};const ne=["Default","Blue","Purple","Orange","Red","Gray","WithoutIcon","Small","Large","AllVariants","AllSizes","InContext"];export{m as AllSizes,u as AllVariants,s as Blue,n as Default,i as Gray,p as InContext,g as Large,o as Orange,t as Purple,c as Red,l as Small,d as WithoutIcon,ne as __namedExportsOrder,ae as default};
