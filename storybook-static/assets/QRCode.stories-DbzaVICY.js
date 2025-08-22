import{j as n}from"./jsx-runtime-nlD-EgCR.js";import{Q as L}from"./QRCode-B3X3Jf_7.js";import"./iframe-BD9qcwu-.js";import"./preload-helper-Dp1pzeXC.js";import"./image-DeoQVfv0.js";import"./use-merged-ref-BX-EWIVL.js";import"./utils-C1Vhx1Sh.js";import"./clsx-B-dksMZM.js";const I={title:"Atoms/QRCode",component:L,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{size:{control:{type:"number",min:100,max:400,step:10}}}},e={args:{data:"https://jovie.fm/taylorswift",label:"Scan to view profile"}},a={args:{data:"https://jovie.fm/edsheeran",size:100,label:"Small QR Code"}},t={args:{data:"https://jovie.fm/billieeilish",size:200,label:"Large QR Code"}},r={args:{data:"https://jovie.fm/theweeknd?utm_source=qr&utm_medium=mobile",size:150,label:"Scan to view on mobile"}},s={args:{data:"https://jovie.fm/drake?mode=tip",size:120,label:"Scan to tip via Apple Pay"}},o={args:{data:"https://custom-domain.com/artist-profile",size:160,label:"Custom domain QR"}},i={render:()=>n.jsxs("div",{className:"text-center space-y-4 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg",children:[n.jsx(L,{data:"https://jovie.fm/arianagrande",size:180,label:"Scan to tip via Apple Pay",className:"mx-auto"}),n.jsx("p",{className:"text-sm text-gray-600 dark:text-gray-400",children:"Scan to tip via Apple Pay"})]})};var m,p,l;e.parameters={...e.parameters,docs:{...(m=e.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    data: 'https://jovie.fm/taylorswift',
    label: 'Scan to view profile'
  }
}`,...(l=(p=e.parameters)==null?void 0:p.docs)==null?void 0:l.source}}};var c,d,u;a.parameters={...a.parameters,docs:{...(c=a.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    data: 'https://jovie.fm/edsheeran',
    size: 100,
    label: 'Small QR Code'
  }
}`,...(u=(d=a.parameters)==null?void 0:d.docs)==null?void 0:u.source}}};var g,h,b;t.parameters={...t.parameters,docs:{...(g=t.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    data: 'https://jovie.fm/billieeilish',
    size: 200,
    label: 'Large QR Code'
  }
}`,...(b=(h=t.parameters)==null?void 0:h.docs)==null?void 0:b.source}}};var f,v,S;r.parameters={...r.parameters,docs:{...(f=r.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    data: 'https://jovie.fm/theweeknd?utm_source=qr&utm_medium=mobile',
    size: 150,
    label: 'Scan to view on mobile'
  }
}`,...(S=(v=r.parameters)==null?void 0:v.docs)==null?void 0:S.source}}};var y,x,j;s.parameters={...s.parameters,docs:{...(y=s.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    data: 'https://jovie.fm/drake?mode=tip',
    size: 120,
    label: 'Scan to tip via Apple Pay'
  }
}`,...(j=(x=s.parameters)==null?void 0:x.docs)==null?void 0:j.source}}};var z,C,w;o.parameters={...o.parameters,docs:{...(z=o.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    data: 'https://custom-domain.com/artist-profile',
    size: 160,
    label: 'Custom domain QR'
  }
}`,...(w=(C=o.parameters)==null?void 0:C.docs)==null?void 0:w.source}}};var R,k,Q;i.parameters={...i.parameters,docs:{...(R=i.parameters)==null?void 0:R.docs,source:{originalSource:`{
  render: () => <div className="text-center space-y-4 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <QRCode data="https://jovie.fm/arianagrande" size={180} label="Scan to tip via Apple Pay" className="mx-auto" />
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Scan to tip via Apple Pay
      </p>
    </div>
}`,...(Q=(k=i.parameters)==null?void 0:k.docs)==null?void 0:Q.source}}};const M=["Default","Small","Large","MobileProfile","TipLink","WithCustomURL","InContainer"];export{e as Default,i as InContainer,t as Large,r as MobileProfile,a as Small,s as TipLink,o as WithCustomURL,M as __namedExportsOrder,I as default};
