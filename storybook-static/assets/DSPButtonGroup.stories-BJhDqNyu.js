import{j as g}from"./jsx-runtime-nlD-EgCR.js";import{D as q}from"./DSPButtonGroup-QD3UV61n.js";import"./iframe-BD9qcwu-.js";import"./preload-helper-Dp1pzeXC.js";import"./DSPButton-DXQdvsb-.js";const e=[{key:"spotify",name:"Spotify",url:"https://open.spotify.com/artist/example",config:{name:"Spotify",color:"#1DB954",textColor:"white",logoSvg:'<svg role="img" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><title>Spotify</title><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.48.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.32 11.28-1.08 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>'}},{key:"apple_music",name:"Apple Music",url:"https://music.apple.com/artist/example",config:{name:"Apple Music",color:"#FA243C",textColor:"white",logoSvg:'<svg role="img" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><title>Apple Music</title><path d="M23.997 6.124c0-.738-.065-1.47-.24-2.19-.317-1.31-1.062-2.31-2.18-3.043C21.003.517 20.373.285 19.7.164c-.517-.093-1.038-.135-1.564-.15-.04-.002-.083-.01-.124-.013H5.988c-.152.01-.303.017-.455.034C4.786.07 4.043.15 3.34.428 2.004.958 1.04 1.88.475 3.208c-.192.448-.292.925-.363 1.408-.056.392-.088.785-.097 1.18V17.22c.009.394.041.787.097 1.179.071.483.171.96.363 1.408.565 1.328 1.529 2.25 2.865 2.78.703.278 1.446.358 2.193.393.152.017.303.024.455.034h11.124c.041-.003.084-.011.124-.013.526-.015 1.047-.057 1.564-.15.673-.121 1.303-.353 1.877-.717 1.118-.733 1.863-1.733 2.18-3.043.175-.72.24-1.452.24-2.19V6.124zM9.455 15.054c-.474 0-.901-.142-1.278-.417a2.505 2.505 0 0 1-.835-1.166 2.654 2.654 0 0 1-.093-1.421c.14-.49.417-.912.83-1.267.413-.355.906-.532 1.48-.532.573 0 1.067.177 1.48.532.413.355.69.777.83 1.267.14.49.098.98-.093 1.421a2.505 2.505 0 0 1-.835 1.166c-.377.275-.804.417-1.278.417zm9.12-.139c0 .312-.102.578-.307.798-.205.22-.456.33-.752.33-.297 0-.547-.11-.752-.33-.205-.22-.307-.486-.307-.798V9.903c0-.312.102-.578.307-.798.205-.22.455-.33.752-.33.296 0 .547.11.752.33.205.22.307.486.307.798v5.012z"/></svg>'}},{key:"youtube",name:"YouTube",url:"https://youtube.com/@example",config:{name:"YouTube",color:"#FF0000",textColor:"white",logoSvg:'<svg role="img" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><title>YouTube</title><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>'}}],J=[e[0]],Q=e.slice(0,2),re={title:"Molecules/DSPButtonGroup",component:q,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{size:{control:{type:"select"},options:["sm","md","lg"]},showPreferenceNotice:{control:{type:"boolean"}},disabled:{control:{type:"boolean"}},onDSPClick:{action:"dsp-clicked"}}},s={args:{dsps:e,size:"md",showPreferenceNotice:!0}},r={args:{dsps:J,size:"md",showPreferenceNotice:!0}},o={args:{dsps:Q,size:"md",showPreferenceNotice:!0}},t={args:{dsps:e,size:"sm",showPreferenceNotice:!0}},c={args:{dsps:e,size:"lg",showPreferenceNotice:!0}},a={args:{dsps:e,size:"md",showPreferenceNotice:!1}},n={args:{dsps:e,size:"md",showPreferenceNotice:!0,preferenceNoticeText:"We'll remember your choice"}},i={args:{dsps:e,size:"md",disabled:!0,showPreferenceNotice:!0}},m={args:{dsps:[],size:"md",showPreferenceNotice:!0}},p={args:{dsps:e,size:"md",showPreferenceNotice:!0,onDSPClick:(d,u)=>{alert(`Opening ${d}: ${u}`)}}},l={render:()=>g.jsxs("div",{className:"max-w-sm mx-auto bg-gray-50 dark:bg-gray-900 p-6 rounded-lg",children:[g.jsx("h3",{className:"text-lg font-semibold mb-4 text-center",children:"Listen Now"}),g.jsx(q,{dsps:e,size:"md",showPreferenceNotice:!0,onDSPClick:(d,u)=>console.log("Clicked:",d,u)})]})};var f,P,h;s.parameters={...s.parameters,docs:{...(f=s.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    dsps: mockDSPs,
    size: 'md',
    showPreferenceNotice: true
  }
}`,...(h=(P=s.parameters)==null?void 0:P.docs)==null?void 0:h.source}}};var S,w,z;r.parameters={...r.parameters,docs:{...(S=r.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    dsps: singleDSP,
    size: 'md',
    showPreferenceNotice: true
  }
}`,...(z=(w=r.parameters)==null?void 0:w.docs)==null?void 0:z.source}}};var N,x,y;o.parameters={...o.parameters,docs:{...(N=o.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    dsps: twoDSPs,
    size: 'md',
    showPreferenceNotice: true
  }
}`,...(y=(x=o.parameters)==null?void 0:x.docs)==null?void 0:y.source}}};var D,C,b;t.parameters={...t.parameters,docs:{...(D=t.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    dsps: mockDSPs,
    size: 'sm',
    showPreferenceNotice: true
  }
}`,...(b=(C=t.parameters)==null?void 0:C.docs)==null?void 0:b.source}}};var k,v,M;c.parameters={...c.parameters,docs:{...(k=c.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    dsps: mockDSPs,
    size: 'lg',
    showPreferenceNotice: true
  }
}`,...(M=(v=c.parameters)==null?void 0:v.docs)==null?void 0:M.source}}};var T,B,j;a.parameters={...a.parameters,docs:{...(T=a.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    dsps: mockDSPs,
    size: 'md',
    showPreferenceNotice: false
  }
}`,...(j=(B=a.parameters)==null?void 0:B.docs)==null?void 0:j.source}}};var A,L,E;n.parameters={...n.parameters,docs:{...(A=n.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    dsps: mockDSPs,
    size: 'md',
    showPreferenceNotice: true,
    preferenceNoticeText: "We'll remember your choice"
  }
}`,...(E=(L=n.parameters)==null?void 0:L.docs)==null?void 0:E.source}}};var I,K,V;i.parameters={...i.parameters,docs:{...(I=i.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    dsps: mockDSPs,
    size: 'md',
    disabled: true,
    showPreferenceNotice: true
  }
}`,...(V=(K=i.parameters)==null?void 0:K.docs)==null?void 0:V.source}}};var $,F,G;m.parameters={...m.parameters,docs:{...($=m.parameters)==null?void 0:$.docs,source:{originalSource:`{
  args: {
    dsps: [],
    size: 'md',
    showPreferenceNotice: true
  }
}`,...(G=(F=m.parameters)==null?void 0:F.docs)==null?void 0:G.source}}};var O,Y,_;p.parameters={...p.parameters,docs:{...(O=p.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    dsps: mockDSPs,
    size: 'md',
    showPreferenceNotice: true,
    onDSPClick: (dspKey: string, url: string) => {
      alert(\`Opening \${dspKey}: \${url}\`);
    }
  }
}`,...(_=(Y=p.parameters)==null?void 0:Y.docs)==null?void 0:_.source}}};var W,H,R;l.parameters={...l.parameters,docs:{...(W=l.parameters)==null?void 0:W.docs,source:{originalSource:`{
  render: () => <div className="max-w-sm mx-auto bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4 text-center">Listen Now</h3>
      <DSPButtonGroup dsps={mockDSPs} size="md" showPreferenceNotice={true} onDSPClick={(dspKey, url) => console.log('Clicked:', dspKey, url)} />
    </div>
}`,...(R=(H=l.parameters)==null?void 0:H.docs)==null?void 0:R.source}}};const oe=["Default","Single","TwoPlatforms","SmallSize","LargeSize","NoPreferenceNotice","CustomPreferenceText","Disabled","Empty","Interactive","InMobileContext"];export{n as CustomPreferenceText,s as Default,i as Disabled,m as Empty,l as InMobileContext,p as Interactive,c as LargeSize,a as NoPreferenceNotice,r as Single,t as SmallSize,o as TwoPlatforms,oe as __namedExportsOrder,re as default};
