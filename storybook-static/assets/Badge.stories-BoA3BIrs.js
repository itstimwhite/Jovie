import{j as e}from"./jsx-runtime-nlD-EgCR.js";import"./iframe-BD9qcwu-.js";import"./preload-helper-Dp1pzeXC.js";function r({children:p,variant:J="primary",size:K="md",className:Q=""}){const U={primary:"bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",secondary:"bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",success:"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",warning:"bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",error:"bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"},X={sm:"px-2 py-0.5 text-xs",md:"px-2.5 py-0.5 text-sm",lg:"px-3 py-1 text-base"};return e.jsx("span",{className:`inline-flex items-center font-medium rounded-full ${U[J]} ${X[K]} ${Q}`,children:p})}try{r.displayName="Badge",r.__docgenInfo={description:"",displayName:"Badge",props:{variant:{defaultValue:{value:"primary"},description:"",name:"variant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"primary"'},{value:'"secondary"'},{value:'"success"'},{value:'"warning"'},{value:'"error"'}]}},size:{defaultValue:{value:"md"},description:"",name:"size",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"sm"'},{value:'"md"'},{value:'"lg"'}]}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const re={title:"Atoms/Badge",component:r,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{variant:{control:{type:"select"},options:["primary","secondary","success","warning","error"]},size:{control:{type:"select"},options:["sm","md","lg"]}}},a={args:{children:"Primary",variant:"primary",size:"md"}},s={args:{children:"Secondary",variant:"secondary",size:"md"}},n={args:{children:"Success",variant:"success",size:"md"}},i={args:{children:"Warning",variant:"warning",size:"md"}},c={args:{children:"Error",variant:"error",size:"md"}},d={args:{children:"Small",variant:"primary",size:"sm"}},t={args:{children:"Large",variant:"primary",size:"lg"}},l={render:()=>e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(r,{variant:"primary",children:"Primary"}),e.jsx(r,{variant:"secondary",children:"Secondary"}),e.jsx(r,{variant:"success",children:"Success"}),e.jsx(r,{variant:"warning",children:"Warning"}),e.jsx(r,{variant:"error",children:"Error"})]})},o={render:()=>e.jsxs("div",{className:"flex flex-wrap gap-2 items-center",children:[e.jsx(r,{variant:"primary",size:"sm",children:"Small"}),e.jsx(r,{variant:"primary",size:"md",children:"Medium"}),e.jsx(r,{variant:"primary",size:"lg",children:"Large"})]})},m={render:()=>e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(r,{variant:"primary",children:"1"}),e.jsx(r,{variant:"success",children:"42"}),e.jsx(r,{variant:"warning",children:"99+"}),e.jsx(r,{variant:"error",children:"New"})]})},g={render:()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{children:"Account Status:"}),e.jsx(r,{variant:"success",children:"Active"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{children:"Plan:"}),e.jsx(r,{variant:"primary",children:"Pro"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{children:"Payment:"}),e.jsx(r,{variant:"warning",children:"Pending"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{children:"Issues:"}),e.jsx(r,{variant:"error",children:"Critical"})]})]})};var u,v,x;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    children: 'Primary',
    variant: 'primary',
    size: 'md'
  }
}`,...(x=(v=a.parameters)==null?void 0:v.docs)==null?void 0:x.source}}};var y,h,f;s.parameters={...s.parameters,docs:{...(y=s.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    children: 'Secondary',
    variant: 'secondary',
    size: 'md'
  }
}`,...(f=(h=s.parameters)==null?void 0:h.docs)==null?void 0:f.source}}};var B,S,j;n.parameters={...n.parameters,docs:{...(B=n.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    children: 'Success',
    variant: 'success',
    size: 'md'
  }
}`,...(j=(S=n.parameters)==null?void 0:S.docs)==null?void 0:j.source}}};var z,N,w;i.parameters={...i.parameters,docs:{...(z=i.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    children: 'Warning',
    variant: 'warning',
    size: 'md'
  }
}`,...(w=(N=i.parameters)==null?void 0:N.docs)==null?void 0:w.source}}};var b,P,k;c.parameters={...c.parameters,docs:{...(b=c.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    children: 'Error',
    variant: 'error',
    size: 'md'
  }
}`,...(k=(P=c.parameters)==null?void 0:P.docs)==null?void 0:k.source}}};var _,A,E;d.parameters={...d.parameters,docs:{...(_=d.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    children: 'Small',
    variant: 'primary',
    size: 'sm'
  }
}`,...(E=(A=d.parameters)==null?void 0:A.docs)==null?void 0:E.source}}};var W,L,V;t.parameters={...t.parameters,docs:{...(W=t.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    children: 'Large',
    variant: 'primary',
    size: 'lg'
  }
}`,...(V=(L=t.parameters)==null?void 0:L.docs)==null?void 0:V.source}}};var C,q,I;l.parameters={...l.parameters,docs:{...(C=l.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-2">
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
    </div>
}`,...(I=(q=l.parameters)==null?void 0:q.docs)==null?void 0:I.source}}};var $,M,O;o.parameters={...o.parameters,docs:{...($=o.parameters)==null?void 0:$.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-2 items-center">
      <Badge variant="primary" size="sm">
        Small
      </Badge>
      <Badge variant="primary" size="md">
        Medium
      </Badge>
      <Badge variant="primary" size="lg">
        Large
      </Badge>
    </div>
}`,...(O=(M=o.parameters)==null?void 0:M.docs)==null?void 0:O.source}}};var R,T,D;m.parameters={...m.parameters,docs:{...(R=m.parameters)==null?void 0:R.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-2">
      <Badge variant="primary">1</Badge>
      <Badge variant="success">42</Badge>
      <Badge variant="warning">99+</Badge>
      <Badge variant="error">New</Badge>
    </div>
}`,...(D=(T=m.parameters)==null?void 0:T.docs)==null?void 0:D.source}}};var F,G,H;g.parameters={...g.parameters,docs:{...(F=g.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span>Account Status:</span>
        <Badge variant="success">Active</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span>Plan:</span>
        <Badge variant="primary">Pro</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span>Payment:</span>
        <Badge variant="warning">Pending</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span>Issues:</span>
        <Badge variant="error">Critical</Badge>
      </div>
    </div>
}`,...(H=(G=g.parameters)==null?void 0:G.docs)==null?void 0:H.source}}};const ae=["Primary","Secondary","Success","Warning","Error","Small","Large","AllVariants","AllSizes","WithNumbers","StatusBadges"];export{o as AllSizes,l as AllVariants,c as Error,t as Large,a as Primary,s as Secondary,d as Small,g as StatusBadges,n as Success,i as Warning,m as WithNumbers,ae as __namedExportsOrder,re as default};
