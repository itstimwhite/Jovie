import{j as e}from"./jsx-runtime-nlD-EgCR.js";import{S as G}from"./StatusBadge-DzBeyz6V.js";import{S as W}from"./SectionHeading-AyPHvQGA.js";import{F as _}from"./FeatureCard-CTuIGOck.js";import"./iframe-BD9qcwu-.js";import"./preload-helper-Dp1pzeXC.js";const V=e.jsx("svg",{className:"h-6 w-6",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M13 10V3L4 14h7v7l9-11h-7z"})}),P=e.jsx("svg",{className:"h-6 w-6",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"})}),D=e.jsx("svg",{className:"h-6 w-6",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"})}),q=e.jsx("svg",{className:"w-4 h-4",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M5 13l4 4L19 7"})}),H=[{title:"3.2x Faster Loading",description:"Fans discover your music instantly. No waiting, no bouncing.",metric:"0.8s load time",accent:"blue"},{title:"47% More Streams",description:"Optimized for conversion. Fans click and stream immediately.",metric:"+47% conversion",accent:"green"},{title:"Smart Fan Routing",description:"Remembers each fan's favorite platform. One click to their preferred streaming service.",metric:"1-click streaming",accent:"purple"}];function d({title:l="Built for musicians, optimized for conversion",description:R="Every element is designed to turn fans into streams. No distractions, just results.",badgeText:A="The Solution",benefits:M=H,className:E=""}){const m=[V,P,D];return e.jsx("section",{className:`relative py-24 sm:py-32 ${E}`,children:e.jsxs("div",{className:"mx-auto max-w-7xl px-6 lg:px-8",children:[e.jsxs("div",{className:"mx-auto max-w-3xl text-center mb-16",children:[e.jsx("div",{className:"mb-8",children:e.jsx(G,{variant:"green",icon:q,children:A})}),e.jsx(W,{level:2,size:"xl",className:"mb-6",children:l}),e.jsx("p",{className:"text-xl text-gray-600 dark:text-white/70",children:R})]}),e.jsx("div",{className:"mx-auto max-w-6xl",children:e.jsx("div",{className:"grid grid-cols-1 gap-8 md:grid-cols-3",children:M.map((t,z)=>e.jsx(_,{title:t.title,description:t.description,metric:t.metric,icon:m[z%m.length],accent:t.accent},t.title))})})]})})}try{d.displayName="BenefitsSection",d.__docgenInfo={description:"",displayName:"BenefitsSection",props:{title:{defaultValue:{value:"Built for musicians, optimized for conversion"},description:"Section title",name:"title",required:!1,type:{name:"string | undefined"}},description:{defaultValue:{value:"Every element is designed to turn fans into streams. No distractions, just results."},description:"Section description",name:"description",required:!1,type:{name:"string | undefined"}},badgeText:{defaultValue:{value:"The Solution"},description:"Badge text",name:"badgeText",required:!1,type:{name:"string | undefined"}},benefits:{defaultValue:{value:`[
  {
    title: '3.2x Faster Loading',
    description: 'Fans discover your music instantly. No waiting, no bouncing.',
    metric: '0.8s load time',
    accent: 'blue' as const,
  },
  {
    title: '47% More Streams',
    description: 'Optimized for conversion. Fans click and stream immediately.',
    metric: '+47% conversion',
    accent: 'green' as const,
  },
  {
    title: 'Smart Fan Routing',
    description:
      "Remembers each fan's favorite platform. One click to their preferred streaming service.",
    metric: '1-click streaming',
    accent: 'purple' as const,
  },
]`},description:"Benefits data",name:"benefits",required:!1,type:{name:'{ title: string; description: string; metric: string; accent: "blue" | "green" | "purple" | "orange" | "red" | "gray"; }[] | undefined'}},className:{defaultValue:{value:""},description:"Additional CSS classes",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const Y={title:"Organisms/BenefitsSection",component:d,parameters:{layout:"fullscreen"},tags:["autodocs"]},n={args:{}},r={args:{title:"Why Choose Our Platform?",description:"We deliver results that matter to your music career.",badgeText:"Why Us"}},i={args:{title:"Platform Features",description:"Everything you need to succeed as an artist.",badgeText:"Features",benefits:[{title:"Global Reach",description:"Connect with fans worldwide through our international platform.",metric:"195 countries",accent:"blue"},{title:"Real-time Analytics",description:"Track your performance with detailed insights and metrics.",metric:"Live data",accent:"green"},{title:"Artist Support",description:"Get help from our dedicated team whenever you need it.",metric:"24/7 support",accent:"purple"}]}},s={args:{title:"Core Benefits",description:"The two most important features for artist success.",badgeText:"Core Features",benefits:[{title:"Easy Setup",description:"Get started in minutes with our simple onboarding process.",metric:"2 min setup",accent:"blue"},{title:"Instant Results",description:"See immediate improvements in fan engagement and streams.",metric:"Instant",accent:"green"}]}},a={args:{title:"Complete Solution",description:"Everything an artist needs in one platform.",badgeText:"Complete Package",benefits:[{title:"Fast Performance",description:"Lightning-fast loading times for better user experience.",metric:"0.5s load",accent:"blue"},{title:"High Conversion",description:"Optimized design that turns visitors into fans.",metric:"60% conversion",accent:"green"},{title:"Smart Analytics",description:"AI-powered insights to grow your audience.",metric:"AI insights",accent:"purple"},{title:"Easy Management",description:"Simple dashboard to manage all your content.",metric:"One dashboard",accent:"orange"}]}},o={args:{title:"Colorful Benefits",description:"Showcase different accent colors for visual variety.",badgeText:"Colors",benefits:[{title:"Red Feature",description:"This benefit uses red accent color.",metric:"Red accent",accent:"red"},{title:"Orange Feature",description:"This benefit uses orange accent color.",metric:"Orange accent",accent:"orange"},{title:"Gray Feature",description:"This benefit uses gray accent color.",metric:"Gray accent",accent:"gray"}]}},c={args:{},parameters:{backgrounds:{default:"dark"}}};var u,p,g;n.parameters={...n.parameters,docs:{...(u=n.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {}
}`,...(g=(p=n.parameters)==null?void 0:p.docs)==null?void 0:g.source}}};var f,h,v;r.parameters={...r.parameters,docs:{...(f=r.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    title: 'Why Choose Our Platform?',
    description: 'We deliver results that matter to your music career.',
    badgeText: 'Why Us'
  }
}`,...(v=(h=r.parameters)==null?void 0:h.docs)==null?void 0:v.source}}};var x,y,b;i.parameters={...i.parameters,docs:{...(x=i.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    title: 'Platform Features',
    description: 'Everything you need to succeed as an artist.',
    badgeText: 'Features',
    benefits: [{
      title: 'Global Reach',
      description: 'Connect with fans worldwide through our international platform.',
      metric: '195 countries',
      accent: 'blue'
    }, {
      title: 'Real-time Analytics',
      description: 'Track your performance with detailed insights and metrics.',
      metric: 'Live data',
      accent: 'green'
    }, {
      title: 'Artist Support',
      description: 'Get help from our dedicated team whenever you need it.',
      metric: '24/7 support',
      accent: 'purple'
    }]
  }
}`,...(b=(y=i.parameters)==null?void 0:y.docs)==null?void 0:b.source}}};var S,w,k;s.parameters={...s.parameters,docs:{...(S=s.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    title: 'Core Benefits',
    description: 'The two most important features for artist success.',
    badgeText: 'Core Features',
    benefits: [{
      title: 'Easy Setup',
      description: 'Get started in minutes with our simple onboarding process.',
      metric: '2 min setup',
      accent: 'blue'
    }, {
      title: 'Instant Results',
      description: 'See immediate improvements in fan engagement and streams.',
      metric: 'Instant',
      accent: 'green'
    }]
  }
}`,...(k=(w=s.parameters)==null?void 0:w.docs)==null?void 0:k.source}}};var C,T,j;a.parameters={...a.parameters,docs:{...(C=a.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    title: 'Complete Solution',
    description: 'Everything an artist needs in one platform.',
    badgeText: 'Complete Package',
    benefits: [{
      title: 'Fast Performance',
      description: 'Lightning-fast loading times for better user experience.',
      metric: '0.5s load',
      accent: 'blue'
    }, {
      title: 'High Conversion',
      description: 'Optimized design that turns visitors into fans.',
      metric: '60% conversion',
      accent: 'green'
    }, {
      title: 'Smart Analytics',
      description: 'AI-powered insights to grow your audience.',
      metric: 'AI insights',
      accent: 'purple'
    }, {
      title: 'Easy Management',
      description: 'Simple dashboard to manage all your content.',
      metric: 'One dashboard',
      accent: 'orange'
    }]
  }
}`,...(j=(T=a.parameters)==null?void 0:T.docs)==null?void 0:j.source}}};var F,B,N;o.parameters={...o.parameters,docs:{...(F=o.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    title: 'Colorful Benefits',
    description: 'Showcase different accent colors for visual variety.',
    badgeText: 'Colors',
    benefits: [{
      title: 'Red Feature',
      description: 'This benefit uses red accent color.',
      metric: 'Red accent',
      accent: 'red'
    }, {
      title: 'Orange Feature',
      description: 'This benefit uses orange accent color.',
      metric: 'Orange accent',
      accent: 'orange'
    }, {
      title: 'Gray Feature',
      description: 'This benefit uses gray accent color.',
      metric: 'Gray accent',
      accent: 'gray'
    }]
  }
}`,...(N=(B=o.parameters)==null?void 0:B.docs)==null?void 0:N.source}}};var L,O,I;c.parameters={...c.parameters,docs:{...(L=c.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {},
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  }
}`,...(I=(O=c.parameters)==null?void 0:O.docs)==null?void 0:I.source}}};const Z=["Default","CustomTitle","CustomBenefits","TwoBenefits","FourBenefits","DifferentAccents","InDarkMode"];export{i as CustomBenefits,r as CustomTitle,n as Default,o as DifferentAccents,a as FourBenefits,c as InDarkMode,s as TwoBenefits,Z as __namedExportsOrder,Y as default};
