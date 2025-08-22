import{j as e}from"./jsx-runtime-nlD-EgCR.js";import{C as Q}from"./CTAButton-BSDyOQHA.js";import{S as U}from"./SectionHeading-AyPHvQGA.js";import"./iframe-BD9qcwu-.js";import"./preload-helper-Dp1pzeXC.js";import"./link-C04pt5ug.js";import"./use-merged-ref-BX-EWIVL.js";import"./index-BOW8JOCe.js";import"./clsx-B-dksMZM.js";import"./image-DeoQVfv0.js";import"./proxy-BWvWzjh9.js";function n({title:m,buttonText:W,buttonHref:$,description:p,variant:t="primary",className:E=""}){const L={primary:"border-t border-white/10 dark:border-white/10 bg-white dark:bg-black",secondary:"bg-zinc-900 text-white"};return e.jsx("section",{"aria-labelledby":"cta-heading",className:`${L[t]} ${E}`,children:e.jsxs("div",{className:"mx-auto max-w-7xl px-6 py-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8",children:[e.jsxs("div",{className:t==="secondary"?"text-center space-y-4":"",children:[e.jsx(U,{id:"cta-heading",level:2,size:t==="secondary"?"xl":"md",align:t==="secondary"?"center":"left",className:t==="secondary"?"text-white":"text-neutral-800 dark:text-white",children:m}),p&&e.jsx("p",{className:`text-lg sm:text-xl leading-relaxed ${t==="secondary"?"text-white":"text-gray-600 dark:text-gray-300"}`,children:p})]}),e.jsx("div",{className:"flex items-center gap-3",children:e.jsx(Q,{href:$,variant:t==="secondary"?"secondary":"primary",size:t==="secondary"?"lg":"md",children:W})})]})})}try{n.displayName="CTASection",n.__docgenInfo={description:"",displayName:"CTASection",props:{title:{defaultValue:null,description:"",name:"title",required:!0,type:{name:"ReactNode"}},buttonText:{defaultValue:null,description:"",name:"buttonText",required:!0,type:{name:"string"}},buttonHref:{defaultValue:null,description:"",name:"buttonHref",required:!0,type:{name:"string"}},description:{defaultValue:null,description:"",name:"description",required:!1,type:{name:"ReactNode"}},variant:{defaultValue:{value:"primary"},description:"",name:"variant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"primary"'},{value:'"secondary"'}]}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const ne={title:"Organisms/CTASection",component:n,parameters:{layout:"fullscreen"},tags:["autodocs"],argTypes:{variant:{control:{type:"select"},options:["primary","secondary"]}}},r={args:{title:"Ready to get started?",description:"Join thousands of artists who are growing their audience and income with our platform.",buttonText:"Get Started",buttonHref:"/signup",variant:"primary"}},a={args:{title:"Join our community today",description:"Connect with other artists and grow your career together.",buttonText:"Join Now",buttonHref:"/community",variant:"secondary"}},o={args:{title:"Ready to take the next step?",buttonText:"Get Started",buttonHref:"/signup",variant:"primary"}},s={args:{title:"Questions?",description:"Our support team is here to help.",buttonText:"Contact Us",buttonHref:"/contact",variant:"primary"}},i={args:{title:"Join our growing community of artists and creators",description:"Our platform provides everything you need to grow your audience, connect with fans, and monetize your content. With powerful analytics, customizable profiles, and direct fan engagement tools, you can take your career to the next level.",buttonText:"Start Your Journey",buttonHref:"/signup",variant:"primary"}},c={args:{...r.args},parameters:{backgrounds:{default:"dark"}}},d={args:{...a.args},parameters:{backgrounds:{default:"dark"}}},u={args:{...r.args,className:"my-8 rounded-xl shadow-lg"}},l={render:()=>e.jsxs("div",{className:"flex flex-col gap-8",children:[e.jsx(n,{title:"Primary Variant",description:"This is the primary variant of the CTA section, typically used on light backgrounds.",buttonText:"Primary Action",buttonHref:"/action",variant:"primary"}),e.jsx(n,{title:"Secondary Variant",description:"This is the secondary variant of the CTA section, typically used for higher contrast.",buttonText:"Secondary Action",buttonHref:"/action",variant:"secondary"})]})};var y,g,f;r.parameters={...r.parameters,docs:{...(y=r.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    title: 'Ready to get started?',
    description: 'Join thousands of artists who are growing their audience and income with our platform.',
    buttonText: 'Get Started',
    buttonHref: '/signup',
    variant: 'primary'
  }
}`,...(f=(g=r.parameters)==null?void 0:g.docs)==null?void 0:f.source}}};var h,x,b;a.parameters={...a.parameters,docs:{...(h=a.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    title: 'Join our community today',
    description: 'Connect with other artists and grow your career together.',
    buttonText: 'Join Now',
    buttonHref: '/community',
    variant: 'secondary'
  }
}`,...(b=(x=a.parameters)==null?void 0:x.docs)==null?void 0:b.source}}};var v,S,w;o.parameters={...o.parameters,docs:{...(v=o.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    title: 'Ready to take the next step?',
    buttonText: 'Get Started',
    buttonHref: '/signup',
    variant: 'primary'
  }
}`,...(w=(S=o.parameters)==null?void 0:S.docs)==null?void 0:w.source}}};var T,C,k;s.parameters={...s.parameters,docs:{...(T=s.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    title: 'Questions?',
    description: 'Our support team is here to help.',
    buttonText: 'Contact Us',
    buttonHref: '/contact',
    variant: 'primary'
  }
}`,...(k=(C=s.parameters)==null?void 0:C.docs)==null?void 0:k.source}}};var N,A,H;i.parameters={...i.parameters,docs:{...(N=i.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    title: 'Join our growing community of artists and creators',
    description: 'Our platform provides everything you need to grow your audience, connect with fans, and monetize your content. With powerful analytics, customizable profiles, and direct fan engagement tools, you can take your career to the next level.',
    buttonText: 'Start Your Journey',
    buttonHref: '/signup',
    variant: 'primary'
  }
}`,...(H=(A=i.parameters)==null?void 0:A.docs)==null?void 0:H.source}}};var j,V,D;c.parameters={...c.parameters,docs:{...(j=c.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    ...Default.args
  },
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  }
}`,...(D=(V=c.parameters)==null?void 0:V.docs)==null?void 0:D.source}}};var J,_,z;d.parameters={...d.parameters,docs:{...(J=d.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    ...Secondary.args
  },
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  }
}`,...(z=(_=d.parameters)==null?void 0:_.docs)==null?void 0:z.source}}};var R,q,O;u.parameters={...u.parameters,docs:{...(R=u.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    className: 'my-8 rounded-xl shadow-lg'
  }
}`,...(O=(q=u.parameters)==null?void 0:q.docs)==null?void 0:O.source}}};var P,G,M;l.parameters={...l.parameters,docs:{...(P=l.parameters)==null?void 0:P.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-8">
      <CTASection title="Primary Variant" description="This is the primary variant of the CTA section, typically used on light backgrounds." buttonText="Primary Action" buttonHref="/action" variant="primary" />
      <CTASection title="Secondary Variant" description="This is the secondary variant of the CTA section, typically used for higher contrast." buttonText="Secondary Action" buttonHref="/action" variant="secondary" />
    </div>
}`,...(M=(G=l.parameters)==null?void 0:G.docs)==null?void 0:M.source}}};const oe=["Default","Secondary","WithoutDescription","ShortContent","LongContent","PrimaryDarkMode","SecondaryDarkMode","CustomClassName","AllVariants"];export{l as AllVariants,u as CustomClassName,r as Default,i as LongContent,c as PrimaryDarkMode,a as Secondary,d as SecondaryDarkMode,s as ShortContent,o as WithoutDescription,oe as __namedExportsOrder,ne as default};
