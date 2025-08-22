import{j as a}from"./jsx-runtime-nlD-EgCR.js";import{r as ce}from"./iframe-BD9qcwu-.js";import{D as le}from"./DSPButtonGroup-QD3UV61n.js";import{getDSPDeepLinkConfig as de,openDeepLink as me}from"./deep-links-BO5PSBZt.js";import{L as S}from"./app-BLJZaWm-.js";import"./preload-helper-Dp1pzeXC.js";import"./DSPButton-DXQdvsb-.js";import"./utils-C1Vhx1Sh.js";import"./clsx-B-dksMZM.js";import"./env-CfNjJZ1e.js";function f({handle:k,dsps:K,initialPreferredUrl:g,size:ee="md",className:ae="",showPreferenceNotice:re=!0,preferenceNoticeText:ne="Your preference will be saved for next time",savePreferences:se=!0,enableDeepLinks:te=!0,enableTracking:oe=!0}){ce.useEffect(()=>{if(g)try{window.open(g,"_blank","noopener,noreferrer")}catch{}},[g]);const ie=async(r,h)=>{try{if(se){document.cookie=`${S}=${r}; path=/; max-age=${3600*24*365}; SameSite=Lax`;try{localStorage.setItem(S,r)}catch{}}if(oe)try{fetch("/api/track",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({handle:k,linkType:"listen",target:r}),keepalive:!0}).catch(()=>{})}catch{}if(te){const b=de(r);if(b)try{await me(h,b,{onNativeAttempt:()=>{},onFallback:()=>{}});return}catch{}}window.open(h,"_blank","noopener,noreferrer")}catch{try{window.open(h,"_blank","noopener,noreferrer")}catch{}}};return a.jsx("div",{className:ae,"data-test":"listen-btn",children:a.jsx(le,{dsps:K,onDSPClick:ie,size:ee,showPreferenceNotice:re,preferenceNoticeText:ne})})}try{f.displayName="ListenSection",f.__docgenInfo={description:"",displayName:"ListenSection",props:{handle:{defaultValue:null,description:"Artist handle for tracking",name:"handle",required:!0,type:{name:"string"}},dsps:{defaultValue:null,description:"Available DSP platforms",name:"dsps",required:!0,type:{name:"AvailableDSP[]"}},initialPreferredUrl:{defaultValue:null,description:"Initial preferred URL to auto-open",name:"initialPreferredUrl",required:!1,type:{name:"string | null | undefined"}},size:{defaultValue:{value:"md"},description:"Button size variant",name:"size",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"sm"'},{value:'"md"'},{value:'"lg"'}]}},className:{defaultValue:{value:""},description:"Additional CSS classes",name:"className",required:!1,type:{name:"string | undefined"}},showPreferenceNotice:{defaultValue:{value:"true"},description:"Whether to show the preference notice",name:"showPreferenceNotice",required:!1,type:{name:"boolean | undefined"}},preferenceNoticeText:{defaultValue:{value:"Your preference will be saved for next time"},description:"Custom preference notice text",name:"preferenceNoticeText",required:!1,type:{name:"string | undefined"}},savePreferences:{defaultValue:{value:"true"},description:"Whether to enable automatic preference saving",name:"savePreferences",required:!1,type:{name:"boolean | undefined"}},enableDeepLinks:{defaultValue:{value:"true"},description:"Whether to enable deep linking",name:"enableDeepLinks",required:!1,type:{name:"boolean | undefined"}},enableTracking:{defaultValue:{value:"true"},description:"Whether to enable analytics tracking",name:"enableTracking",required:!1,type:{name:"boolean | undefined"}}}}}catch{}const e=[{key:"spotify",name:"Spotify",url:"https://open.spotify.com/artist/66CXWjxzNUsdJxJ2JdwvnR",config:{name:"Spotify",color:"#1DB954",textColor:"white",logoSvg:'<svg role="img" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><title>Spotify</title><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.48.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.32 11.28-1.08 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>'}},{key:"apple_music",name:"Apple Music",url:"https://music.apple.com/us/artist/ariana-grande/1227269205",config:{name:"Apple Music",color:"#FA243C",textColor:"white",logoSvg:'<svg role="img" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><title>Apple Music</title><path d="M23.997 6.124c0-.738-.065-1.47-.24-2.19-.317-1.31-1.062-2.31-2.18-3.043C21.003.517 20.373.285 19.7.164c-.517-.093-1.038-.135-1.564-.15-.04-.002-.083-.01-.124-.013H5.988c-.152.01-.303.017-.455.034C4.786.07 4.043.15 3.34.428 2.004.958 1.04 1.88.475 3.208c-.192.448-.292.925-.363 1.408-.056.392-.088.785-.097 1.18V17.22c.009.394.041.787.097 1.179.071.483.171.96.363 1.408.565 1.328 1.529 2.25 2.865 2.78.703.278 1.446.358 2.193.393.152.017.303.024.455.034h11.124c.041-.003.084-.011.124-.013.526-.015 1.047-.057 1.564-.15.673-.121 1.303-.353 1.877-.717 1.118-.733 1.863-1.733 2.18-3.043.175-.72.24-1.452.24-2.19V6.124zM9.455 15.054c-.474 0-.901-.142-1.278-.417a2.505 2.505 0 0 1-.835-1.166 2.654 2.654 0 0 1-.093-1.421c.14-.49.417-.912.83-1.267.413-.355.906-.532 1.48-.532.573 0 1.067.177 1.48.532.413.355.69.777.83 1.267.14.49.098.98-.093 1.421a2.505 2.505 0 0 1-.835 1.166c-.377.275-.804.417-1.278.417zm9.12-.139c0 .312-.102.578-.307.798-.205.22-.456.33-.752.33-.297 0-.547-.11-.752-.33-.205-.22-.307-.486-.307-.798V9.903c0-.312.102-.578.307-.798.205-.22.455-.33.752-.33.296 0 .547.11.752.33.205.22.307.486.307.798v5.012z"/></svg>'}},{key:"youtube",name:"YouTube",url:"https://youtube.com/@ArianaGrande",config:{name:"YouTube",color:"#FF0000",textColor:"white",logoSvg:'<svg role="img" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><title>YouTube</title><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>'}}],pe=[e[0]],Ne={title:"Organisms/ListenSection",component:f,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{size:{control:{type:"select"},options:["sm","md","lg"]},showPreferenceNotice:{control:{type:"boolean"}},savePreferences:{control:{type:"boolean"}},enableDeepLinks:{control:{type:"boolean"}},enableTracking:{control:{type:"boolean"}}}},n={args:{handle:"arianagrande",dsps:e,size:"md",showPreferenceNotice:!0,savePreferences:!0,enableDeepLinks:!0,enableTracking:!0}},s={args:{handle:"arianagrande",dsps:pe,size:"md",showPreferenceNotice:!0}},t={args:{handle:"arianagrande",dsps:e,size:"md",showPreferenceNotice:!1,savePreferences:!1}},o={args:{handle:"arianagrande",dsps:e,size:"md",enableTracking:!1}},i={args:{handle:"arianagrande",dsps:e,size:"md",enableDeepLinks:!1}},c={args:{handle:"arianagrande",dsps:e,size:"md",preferenceNoticeText:"We'll remember your favorite streaming platform"}},l={args:{handle:"arianagrande",dsps:e,size:"sm"}},d={args:{handle:"arianagrande",dsps:e,size:"lg"}},m={args:{handle:"arianagrande",dsps:e,size:"md",showPreferenceNotice:!1,savePreferences:!1,enableDeepLinks:!1,enableTracking:!1}},p={render:()=>a.jsxs("div",{className:"max-w-sm mx-auto bg-gradient-to-b from-purple-900 to-black text-white p-6 rounded-lg",children:[a.jsxs("div",{className:"text-center mb-6",children:[a.jsx("div",{className:"w-32 h-32 mx-auto bg-gradient-to-br from-pink-400 to-purple-600 rounded-full mb-4"}),a.jsx("h1",{className:"text-2xl font-bold mb-2",children:"Ariana Grande"}),a.jsx("p",{className:"text-purple-200",children:"Pop Artist"})]}),a.jsx(f,{handle:"arianagrande",dsps:e,size:"md",showPreferenceNotice:!0,className:"mt-6"})]}),parameters:{layout:"centered",backgrounds:{default:"dark"}}},u={args:{handle:"artist",dsps:[],size:"md"}};var v,P,x;n.parameters={...n.parameters,docs:{...(v=n.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    handle: 'arianagrande',
    dsps: mockDSPs,
    size: 'md',
    showPreferenceNotice: true,
    savePreferences: true,
    enableDeepLinks: true,
    enableTracking: true
  }
}`,...(x=(P=n.parameters)==null?void 0:P.docs)==null?void 0:x.source}}};var y,N,z;s.parameters={...s.parameters,docs:{...(y=s.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    handle: 'arianagrande',
    dsps: singleDSP,
    size: 'md',
    showPreferenceNotice: true
  }
}`,...(z=(N=s.parameters)==null?void 0:N.docs)==null?void 0:z.source}}};var w,D,C;t.parameters={...t.parameters,docs:{...(w=t.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    handle: 'arianagrande',
    dsps: mockDSPs,
    size: 'md',
    showPreferenceNotice: false,
    savePreferences: false
  }
}`,...(C=(D=t.parameters)==null?void 0:D.docs)==null?void 0:C.source}}};var L,T,A;o.parameters={...o.parameters,docs:{...(L=o.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    handle: 'arianagrande',
    dsps: mockDSPs,
    size: 'md',
    enableTracking: false
  }
}`,...(A=(T=o.parameters)==null?void 0:T.docs)==null?void 0:A.source}}};var _,V,j;i.parameters={...i.parameters,docs:{...(_=i.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    handle: 'arianagrande',
    dsps: mockDSPs,
    size: 'md',
    enableDeepLinks: false
  }
}`,...(j=(V=i.parameters)==null?void 0:V.docs)==null?void 0:j.source}}};var M,q,E;c.parameters={...c.parameters,docs:{...(M=c.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    handle: 'arianagrande',
    dsps: mockDSPs,
    size: 'md',
    preferenceNoticeText: "We'll remember your favorite streaming platform"
  }
}`,...(E=(q=c.parameters)==null?void 0:q.docs)==null?void 0:E.source}}};var W,B,O;l.parameters={...l.parameters,docs:{...(W=l.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    handle: 'arianagrande',
    dsps: mockDSPs,
    size: 'sm'
  }
}`,...(O=(B=l.parameters)==null?void 0:B.docs)==null?void 0:O.source}}};var I,Y,F;d.parameters={...d.parameters,docs:{...(I=d.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    handle: 'arianagrande',
    dsps: mockDSPs,
    size: 'lg'
  }
}`,...(F=(Y=d.parameters)==null?void 0:Y.docs)==null?void 0:F.source}}};var G,J,R;m.parameters={...m.parameters,docs:{...(G=m.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    handle: 'arianagrande',
    dsps: mockDSPs,
    size: 'md',
    showPreferenceNotice: false,
    savePreferences: false,
    enableDeepLinks: false,
    enableTracking: false
  }
}`,...(R=(J=m.parameters)==null?void 0:J.docs)==null?void 0:R.source}}};var $,U,H;p.parameters={...p.parameters,docs:{...($=p.parameters)==null?void 0:$.docs,source:{originalSource:`{
  render: () => <div className="max-w-sm mx-auto bg-gradient-to-b from-purple-900 to-black text-white p-6 rounded-lg">
      <div className="text-center mb-6">
        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-pink-400 to-purple-600 rounded-full mb-4"></div>
        <h1 className="text-2xl font-bold mb-2">Ariana Grande</h1>
        <p className="text-purple-200">Pop Artist</p>
      </div>
      <ListenSection handle="arianagrande" dsps={mockDSPs} size="md" showPreferenceNotice={true} className="mt-6" />
    </div>,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark'
    }
  }
}`,...(H=(U=p.parameters)==null?void 0:U.docs)==null?void 0:H.source}}};var X,Q,Z;u.parameters={...u.parameters,docs:{...(X=u.parameters)==null?void 0:X.docs,source:{originalSource:`{
  args: {
    handle: 'artist',
    dsps: [],
    size: 'md'
  }
}`,...(Z=(Q=u.parameters)==null?void 0:Q.docs)==null?void 0:Z.source}}};const ze=["Default","SinglePlatform","NoPreferences","NoTracking","NoDeepLinks","CustomPreferenceText","SmallSize","LargeSize","MinimalConfiguration","MobileArtistPage","EmptyState"];export{c as CustomPreferenceText,n as Default,u as EmptyState,d as LargeSize,m as MinimalConfiguration,p as MobileArtistPage,i as NoDeepLinks,t as NoPreferences,o as NoTracking,s as SinglePlatform,l as SmallSize,ze as __namedExportsOrder,Ne as default};
