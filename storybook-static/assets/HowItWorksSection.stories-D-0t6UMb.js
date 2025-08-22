import{j as e}from"./jsx-runtime-nlD-EgCR.js";import{S as _}from"./StatusBadge-DzBeyz6V.js";import{S as q}from"./SectionHeading-AyPHvQGA.js";import{S as E}from"./StepCard-DkQETUy-.js";import"./iframe-BD9qcwu-.js";import"./preload-helper-Dp1pzeXC.js";const Q=e.jsx("svg",{className:"h-6 w-6",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"})}),U=e.jsx("svg",{className:"h-6 w-6",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"})}),R=e.jsx("svg",{className:"h-6 w-6",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15"})}),$=e.jsx("svg",{className:"w-4 h-4",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M13 10V3L4 14h7v7l9-11h-7z"})}),J=[{number:"01",title:"Connect Your Spotify",description:"Search and verify your Spotify artist profile in seconds. We pull your latest releases automatically."},{number:"02",title:"Get Your Link",description:"Get your custom jov.ie link and professional profile. Add your social media and merch links."},{number:"03",title:"Fans Stream Your Music",description:"Fans discover and stream your music instantly. Smart routing sends them to their preferred platform."}];function u({title:l="From Spotify artist to fan conversion in 60 seconds",description:D="Three simple steps to turn your Spotify profile into a conversion machine",badgeText:F="How It Works",steps:p=J,className:O="",showAccentBorder:V=!0}){const m=[Q,U,R];return e.jsxs("section",{className:`relative py-24 sm:py-32 ${O}`,children:[V&&e.jsx("div",{className:"absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-cyan-500/50"}),e.jsxs("div",{className:"mx-auto max-w-7xl px-6 lg:px-8",children:[e.jsxs("div",{className:"mx-auto max-w-3xl text-center mb-16",children:[e.jsx("div",{className:"mb-8",children:e.jsx(_,{variant:"purple",icon:$,children:F})}),e.jsx(q,{level:2,size:"xl",className:"mb-6",children:l}),e.jsx("p",{className:"text-xl text-gray-600 dark:text-white/70",children:D})]}),e.jsx("div",{className:"mx-auto max-w-6xl",children:e.jsx("div",{className:"grid grid-cols-1 gap-12 md:grid-cols-3",children:p.map((t,h)=>e.jsx(E,{stepNumber:t.number,title:t.title,description:t.description,icon:m[h%m.length],showConnectionLine:h<p.length-1},t.number))})})]})]})}try{u.displayName="HowItWorksSection",u.__docgenInfo={description:"",displayName:"HowItWorksSection",props:{title:{defaultValue:{value:"From Spotify artist to fan conversion in 60 seconds"},description:"Section title",name:"title",required:!1,type:{name:"string | undefined"}},description:{defaultValue:{value:"Three simple steps to turn your Spotify profile into a conversion machine"},description:"Section description",name:"description",required:!1,type:{name:"string | undefined"}},badgeText:{defaultValue:{value:"How It Works"},description:"Badge text",name:"badgeText",required:!1,type:{name:"string | undefined"}},steps:{defaultValue:{value:`[
  {
    number: '01',
    title: 'Connect Your Spotify',
    description:
      'Search and verify your Spotify artist profile in seconds. We pull your latest releases automatically.',
  },
  {
    number: '02',
    title: 'Get Your Link',
    description:
      'Get your custom jov.ie link and professional profile. Add your social media and merch links.',
  },
  {
    number: '03',
    title: 'Fans Stream Your Music',
    description:
      'Fans discover and stream your music instantly. Smart routing sends them to their preferred platform.',
  },
]`},description:"Steps data",name:"steps",required:!1,type:{name:"{ number: string; title: string; description: string; }[] | undefined"}},className:{defaultValue:{value:""},description:"Additional CSS classes",name:"className",required:!1,type:{name:"string | undefined"}},showAccentBorder:{defaultValue:{value:"true"},description:"Whether to show accent border",name:"showAccentBorder",required:!1,type:{name:"boolean | undefined"}}}}}catch{}const ne={title:"Organisms/HowItWorksSection",component:u,parameters:{layout:"fullscreen"},tags:["autodocs"],argTypes:{showAccentBorder:{control:{type:"boolean"}}}},r={args:{}},n={args:{title:"How to Get Started",description:"Simple steps to launch your music career",badgeText:"Getting Started",steps:[{number:"01",title:"Sign Up",description:"Create your account and set up your artist profile."},{number:"02",title:"Upload Music",description:"Add your tracks and connect your streaming platforms."},{number:"03",title:"Share & Grow",description:"Share your link and watch your fanbase grow."}]}},s={args:{title:"Quick Setup Process",description:"Get started in just two simple steps",badgeText:"Quick Start",steps:[{number:"01",title:"Connect Account",description:"Link your Spotify or Apple Music artist account."},{number:"02",title:"Go Live",description:"Your profile is ready to share with fans."}]}},o={args:{title:"Complete Onboarding",description:"Everything you need to know to get started",badgeText:"Full Process",steps:[{number:"01",title:"Create Account",description:"Sign up with your email and choose your username."},{number:"02",title:"Verify Artist",description:"Connect and verify your artist profiles."},{number:"03",title:"Customize Profile",description:"Add your bio, photos, and social links."},{number:"04",title:"Launch & Share",description:"Your profile is ready to share with the world."}]}},i={args:{title:"Clean Process",description:"How it works without the accent border",showAccentBorder:!1}},a={args:{title:"How We Help Your Business",description:"Our proven process for business success",badgeText:"Our Process",steps:[{number:"01",title:"Discovery",description:"We analyze your current situation and identify opportunities."},{number:"02",title:"Strategy",description:"We create a custom plan tailored to your specific needs."},{number:"03",title:"Execution",description:"We implement the solution and monitor progress closely."}]}},c={args:{title:"Phase-Based Approach",description:"Our development process broken into phases",badgeText:"Development",steps:[{number:"α",title:"Alpha Phase",description:"Initial development and core feature implementation."},{number:"β",title:"Beta Phase",description:"Testing with select users and gathering feedback."},{number:"γ",title:"Launch Phase",description:"Public release and ongoing optimization."}]}},d={args:{},parameters:{backgrounds:{default:"dark"}}};var g,f,y;r.parameters={...r.parameters,docs:{...(g=r.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {}
}`,...(y=(f=r.parameters)==null?void 0:f.docs)==null?void 0:y.source}}};var b,S,x;n.parameters={...n.parameters,docs:{...(b=n.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    title: 'How to Get Started',
    description: 'Simple steps to launch your music career',
    badgeText: 'Getting Started',
    steps: [{
      number: '01',
      title: 'Sign Up',
      description: 'Create your account and set up your artist profile.'
    }, {
      number: '02',
      title: 'Upload Music',
      description: 'Add your tracks and connect your streaming platforms.'
    }, {
      number: '03',
      title: 'Share & Grow',
      description: 'Share your link and watch your fanbase grow.'
    }]
  }
}`,...(x=(S=n.parameters)==null?void 0:S.docs)==null?void 0:x.source}}};var k,w,v;s.parameters={...s.parameters,docs:{...(k=s.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    title: 'Quick Setup Process',
    description: 'Get started in just two simple steps',
    badgeText: 'Quick Start',
    steps: [{
      number: '01',
      title: 'Connect Account',
      description: 'Link your Spotify or Apple Music artist account.'
    }, {
      number: '02',
      title: 'Go Live',
      description: 'Your profile is ready to share with fans.'
    }]
  }
}`,...(v=(w=s.parameters)==null?void 0:w.docs)==null?void 0:v.source}}};var j,C,A;o.parameters={...o.parameters,docs:{...(j=o.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    title: 'Complete Onboarding',
    description: 'Everything you need to know to get started',
    badgeText: 'Full Process',
    steps: [{
      number: '01',
      title: 'Create Account',
      description: 'Sign up with your email and choose your username.'
    }, {
      number: '02',
      title: 'Verify Artist',
      description: 'Connect and verify your artist profiles.'
    }, {
      number: '03',
      title: 'Customize Profile',
      description: 'Add your bio, photos, and social links.'
    }, {
      number: '04',
      title: 'Launch & Share',
      description: 'Your profile is ready to share with the world.'
    }]
  }
}`,...(A=(C=o.parameters)==null?void 0:C.docs)==null?void 0:A.source}}};var L,W,P;i.parameters={...i.parameters,docs:{...(L=i.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    title: 'Clean Process',
    description: 'How it works without the accent border',
    showAccentBorder: false
  }
}`,...(P=(W=i.parameters)==null?void 0:W.docs)==null?void 0:P.source}}};var B,N,T;a.parameters={...a.parameters,docs:{...(B=a.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    title: 'How We Help Your Business',
    description: 'Our proven process for business success',
    badgeText: 'Our Process',
    steps: [{
      number: '01',
      title: 'Discovery',
      description: 'We analyze your current situation and identify opportunities.'
    }, {
      number: '02',
      title: 'Strategy',
      description: 'We create a custom plan tailored to your specific needs.'
    }, {
      number: '03',
      title: 'Execution',
      description: 'We implement the solution and monitor progress closely.'
    }]
  }
}`,...(T=(N=a.parameters)==null?void 0:N.docs)==null?void 0:T.source}}};var H,I,G;c.parameters={...c.parameters,docs:{...(H=c.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    title: 'Phase-Based Approach',
    description: 'Our development process broken into phases',
    badgeText: 'Development',
    steps: [{
      number: 'α',
      title: 'Alpha Phase',
      description: 'Initial development and core feature implementation.'
    }, {
      number: 'β',
      title: 'Beta Phase',
      description: 'Testing with select users and gathering feedback.'
    }, {
      number: 'γ',
      title: 'Launch Phase',
      description: 'Public release and ongoing optimization.'
    }]
  }
}`,...(G=(I=c.parameters)==null?void 0:I.docs)==null?void 0:G.source}}};var M,Y,z;d.parameters={...d.parameters,docs:{...(M=d.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {},
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  }
}`,...(z=(Y=d.parameters)==null?void 0:Y.docs)==null?void 0:z.source}}};const se=["Default","CustomContent","TwoSteps","FourSteps","WithoutAccentBorder","BusinessProcess","DifferentNumbering","InDarkMode"];export{a as BusinessProcess,n as CustomContent,r as Default,c as DifferentNumbering,o as FourSteps,d as InDarkMode,s as TwoSteps,i as WithoutAccentBorder,se as __namedExportsOrder,ne as default};
