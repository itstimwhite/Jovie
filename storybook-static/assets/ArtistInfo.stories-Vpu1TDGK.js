import{A as O}from"./ArtistInfo-FJSJwlXQ.js";import"./jsx-runtime-nlD-EgCR.js";import"./iframe-BD9qcwu-.js";import"./preload-helper-Dp1pzeXC.js";import"./ArtistAvatar-CJIaoGEa.js";import"./image-DeoQVfv0.js";import"./use-merged-ref-BX-EWIVL.js";import"./clsx-B-dksMZM.js";import"./utils-C1Vhx1Sh.js";import"./ArtistName-ChVkRN4X.js";import"./link-C04pt5ug.js";import"./app-BLJZaWm-.js";import"./env-CfNjJZ1e.js";const Y={title:"Molecules/ArtistInfo",component:O,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{avatarSize:{control:{type:"select"},options:["sm","md","lg","xl","2xl"]},nameSize:{control:{type:"select"},options:["sm","md","lg","xl"]}}},r={id:"1",handle:"taylorswift",name:"Taylor Swift",image_url:"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=face",tagline:"Grammy Award-winning singer-songwriter known for narrative songs about her personal life.",is_verified:!0,owner_user_id:"1",spotify_id:"",published:!0,is_featured:!1,created_at:new Date().toISOString(),marketing_opt_out:!1},e={args:{artist:r}},a={args:{artist:{...r,is_verified:!0}}},t={args:{artist:{...r,is_verified:!1}}},s={args:{artist:r,subtitle:"Live at Madison Square Garden 2024"}},i={args:{artist:r,avatarSize:"sm",nameSize:"sm"}},o={args:{artist:r,avatarSize:"xl",nameSize:"xl"}},n={args:{artist:{...r,tagline:"Multi-platinum recording artist, songwriter, and performer with over 200 million records sold worldwide. Known for her storytelling through music and her massive cultural impact."}}},m={args:{artist:{...r,name:"Rising Star",handle:"risingstar",is_verified:!1,tagline:void 0}}},c={args:{artist:r},parameters:{backgrounds:{default:"dark"}}};var l,d,p;e.parameters={...e.parameters,docs:{...(l=e.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    artist: mockArtist
  }
}`,...(p=(d=e.parameters)==null?void 0:d.docs)==null?void 0:p.source}}};var u,g,f;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    artist: {
      ...mockArtist,
      is_verified: true
    }
  }
}`,...(f=(g=a.parameters)==null?void 0:g.docs)==null?void 0:f.source}}};var S,v,h;t.parameters={...t.parameters,docs:{...(S=t.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    artist: {
      ...mockArtist,
      is_verified: false
    }
  }
}`,...(h=(v=t.parameters)==null?void 0:v.docs)==null?void 0:h.source}}};var w,A,k;s.parameters={...s.parameters,docs:{...(w=s.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    artist: mockArtist,
    subtitle: 'Live at Madison Square Garden 2024'
  }
}`,...(k=(A=s.parameters)==null?void 0:A.docs)==null?void 0:k.source}}};var _,y,z;i.parameters={...i.parameters,docs:{...(_=i.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    artist: mockArtist,
    avatarSize: 'sm',
    nameSize: 'sm'
  }
}`,...(z=(y=i.parameters)==null?void 0:y.docs)==null?void 0:z.source}}};var b,x,M;o.parameters={...o.parameters,docs:{...(b=o.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    artist: mockArtist,
    avatarSize: 'xl',
    nameSize: 'xl'
  }
}`,...(M=(x=o.parameters)==null?void 0:x.docs)==null?void 0:M.source}}};var L,D,I;n.parameters={...n.parameters,docs:{...(L=n.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    artist: {
      ...mockArtist,
      tagline: 'Multi-platinum recording artist, songwriter, and performer with over 200 million records sold worldwide. Known for her storytelling through music and her massive cultural impact.'
    }
  }
}`,...(I=(D=n.parameters)==null?void 0:D.docs)==null?void 0:I.source}}};var T,G,W;m.parameters={...m.parameters,docs:{...(T=m.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    artist: {
      ...mockArtist,
      name: 'Rising Star',
      handle: 'risingstar',
      is_verified: false,
      tagline: undefined // Will use default tagline
    }
  }
}`,...(W=(G=m.parameters)==null?void 0:G.docs)==null?void 0:W.source}}};var q,K,N;c.parameters={...c.parameters,docs:{...(q=c.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    artist: mockArtist
  },
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  }
}`,...(N=(K=c.parameters)==null?void 0:K.docs)==null?void 0:N.source}}};const Z=["Default","Verified","Unverified","WithSubtitle","SmallAvatar","LargeAvatar","LongTagline","NewArtist","InDarkMode"];export{e as Default,c as InDarkMode,o as LargeAvatar,n as LongTagline,m as NewArtist,i as SmallAvatar,t as Unverified,a as Verified,s as WithSubtitle,Z as __namedExportsOrder,Y as default};
