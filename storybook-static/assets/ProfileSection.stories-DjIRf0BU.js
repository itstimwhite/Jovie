import{j as e}from"./jsx-runtime-nlD-EgCR.js";import{A as te}from"./ArtistInfo-FJSJwlXQ.js";import{B as ne}from"./BackgroundPattern-DjnfHVKt.js";import{c as ie}from"./utils-C1Vhx1Sh.js";import{C as le}from"./Container-Stspju0f.js";import{B as a}from"./Button-BzwZ4BTt.js";import"./iframe-BD9qcwu-.js";import"./preload-helper-Dp1pzeXC.js";import"./ArtistAvatar-CJIaoGEa.js";import"./image-DeoQVfv0.js";import"./use-merged-ref-BX-EWIVL.js";import"./clsx-B-dksMZM.js";import"./ArtistName-ChVkRN4X.js";import"./link-C04pt5ug.js";import"./app-BLJZaWm-.js";import"./env-CfNjJZ1e.js";function N({children:s,variant:v="default",backgroundPattern:t="grid",showGradientBlurs:x=!0,className:h=""}){const w={default:"bg-white/60 dark:bg-white/5 backdrop-blur-lg border border-gray-200/30 dark:border-white/10 rounded-3xl shadow-xl shadow-black/5",glass:"bg-white/40 dark:bg-white/5 backdrop-blur-md ring-1 ring-black/5 dark:ring-white/10 rounded-xl shadow-sm",solid:"bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg"};return e.jsxs("div",{className:"relative min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200 overflow-hidden",children:[t!=="none"&&e.jsx(ne,{variant:t}),x&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 dark:from-blue-400/20 dark:to-purple-400/20 rounded-full blur-3xl opacity-50"}),e.jsx("div",{className:"absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-cyan-400/10 dark:from-purple-400/20 dark:to-cyan-400/20 rounded-full blur-3xl opacity-50"})]}),e.jsx("div",{className:"relative z-10 flex min-h-screen flex-col",children:e.jsx("div",{className:ie(w[v],h),children:s})})]})}try{N.displayName="FrostedContainer",N.__docgenInfo={description:"",displayName:"FrostedContainer",props:{variant:{defaultValue:{value:"default"},description:"",name:"variant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"default"'},{value:'"glass"'},{value:'"solid"'}]}},backgroundPattern:{defaultValue:{value:"grid"},description:"",name:"backgroundPattern",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"grid"'},{value:'"dots"'},{value:'"gradient"'},{value:'"none"'}]}},showGradientBlurs:{defaultValue:{value:"true"},description:"",name:"showGradientBlurs",required:!1,type:{name:"boolean | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}function y({artist:s,subtitle:v,children:t,containerVariant:x="default",backgroundPattern:h="grid",showGradientBlurs:w=!0,avatarSize:b="xl",nameSize:re="lg",maxWidthClass:se="w-full max-w-md"}){return e.jsx(N,{variant:x,backgroundPattern:h,showGradientBlurs:w,children:e.jsx(le,{children:e.jsx("div",{className:"flex min-h-screen flex-col py-12 relative z-10",children:e.jsx("div",{className:"flex-1 flex flex-col items-center justify-center px-4",children:e.jsxs("div",{className:`${se} space-y-8`,children:[e.jsx(te,{artist:s,subtitle:v,avatarSize:b==="2xl"?"xl":b,nameSize:re}),t]})})})})})}try{y.displayName="ProfileSection",y.__docgenInfo={description:"",displayName:"ProfileSection",props:{artist:{defaultValue:null,description:"",name:"artist",required:!0,type:{name:"Artist"}},subtitle:{defaultValue:null,description:"",name:"subtitle",required:!1,type:{name:"string | undefined"}},containerVariant:{defaultValue:{value:"default"},description:"",name:"containerVariant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"default"'},{value:'"glass"'},{value:'"solid"'}]}},backgroundPattern:{defaultValue:{value:"grid"},description:"",name:"backgroundPattern",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"grid"'},{value:'"dots"'},{value:'"gradient"'},{value:'"none"'}]}},showGradientBlurs:{defaultValue:{value:"true"},description:"",name:"showGradientBlurs",required:!1,type:{name:"boolean | undefined"}},avatarSize:{defaultValue:{value:"xl"},description:"",name:"avatarSize",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"sm"'},{value:'"md"'},{value:'"lg"'},{value:'"xl"'},{value:'"2xl"'}]}},nameSize:{defaultValue:{value:"lg"},description:"",name:"nameSize",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"sm"'},{value:'"md"'},{value:'"lg"'},{value:'"xl"'}]}},maxWidthClass:{defaultValue:{value:"w-full max-w-md"},description:"",name:"maxWidthClass",required:!1,type:{name:"string | undefined"}}}}}catch{}const je={title:"Organisms/ProfileSection",component:y,parameters:{layout:"fullscreen"},tags:["autodocs"],argTypes:{containerVariant:{control:{type:"select"},options:["default","glass","solid"]},backgroundPattern:{control:{type:"select"},options:["grid","dots","gradient","none"]},avatarSize:{control:{type:"select"},options:["sm","md","lg","xl","2xl"]},nameSize:{control:{type:"select"},options:["sm","md","lg","xl"]}}},r={id:"1",handle:"taylorswift",name:"Taylor Swift",image_url:"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=face",tagline:"Grammy Award-winning singer-songwriter known for narrative songs about her personal life.",is_verified:!0,owner_user_id:"1",spotify_id:"",published:!0,is_featured:!1,created_at:new Date().toISOString(),marketing_opt_out:!1},n={args:{artist:r}},i={args:{artist:r,subtitle:"Live at Madison Square Garden 2024"}},l={args:{artist:r,children:e.jsxs("div",{className:"space-y-4 w-full",children:[e.jsx(a,{className:"w-full",size:"lg",children:"Listen Now"}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsx(a,{variant:"outline",children:"Follow"}),e.jsx(a,{variant:"outline",children:"Share"})]})]})}},o={args:{artist:r,containerVariant:"glass",children:e.jsx(a,{className:"w-full",size:"lg",children:"Listen Now"})}},d={args:{artist:r,containerVariant:"solid",children:e.jsx(a,{className:"w-full",size:"lg",children:"Listen Now"})}},c={args:{artist:r,backgroundPattern:"dots",children:e.jsx(a,{className:"w-full",size:"lg",children:"Listen Now"})}},u={args:{artist:r,backgroundPattern:"gradient",containerVariant:"glass",children:e.jsx(a,{className:"w-full",size:"lg",children:"Listen Now"})}},m={args:{artist:r,backgroundPattern:"none",showGradientBlurs:!1,containerVariant:"solid",children:e.jsx(a,{className:"w-full",size:"lg",children:"Listen Now"})}},p={args:{artist:r,avatarSize:"sm",nameSize:"sm",maxWidthClass:"w-full max-w-xs",children:e.jsx(a,{className:"w-full",size:"sm",children:"Follow"})}},g={args:{artist:r,avatarSize:"xl",nameSize:"xl",maxWidthClass:"w-full max-w-lg",children:e.jsxs("div",{className:"space-y-6 w-full",children:[e.jsx(a,{className:"w-full",size:"lg",children:"Listen Now"}),e.jsxs("div",{className:"text-center text-gray-600 dark:text-gray-400",children:[e.jsx("p",{children:'Latest album: "Midnights" • 2022'}),e.jsx("p",{children:"13 tracks • 44 minutes"})]})]})}},f={args:{artist:r,children:e.jsxs("div",{className:"space-y-6 w-full",children:[e.jsx(a,{className:"w-full",size:"lg",children:"Listen Now"}),e.jsxs("div",{className:"grid grid-cols-3 gap-3",children:[e.jsx(a,{variant:"outline",size:"sm",children:"Follow"}),e.jsx(a,{variant:"outline",size:"sm",children:"Share"}),e.jsx(a,{variant:"outline",size:"sm",children:"Tip"})]}),e.jsx("div",{className:"text-center space-y-2",children:e.jsxs("div",{className:"flex justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400",children:[e.jsx("span",{children:"12.4M followers"}),e.jsx("span",{children:"•"}),e.jsx("span",{children:"85 releases"})]})})]})}};var k,j,B;n.parameters={...n.parameters,docs:{...(k=n.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    artist: mockArtist
  }
}`,...(B=(j=n.parameters)==null?void 0:j.docs)==null?void 0:B.source}}};var S,z,V;i.parameters={...i.parameters,docs:{...(S=i.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    artist: mockArtist,
    subtitle: 'Live at Madison Square Garden 2024'
  }
}`,...(V=(z=i.parameters)==null?void 0:z.docs)==null?void 0:V.source}}};var _,L,P;l.parameters={...l.parameters,docs:{...(_=l.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    artist: mockArtist,
    children: <div className="space-y-4 w-full">
        <Button className="w-full" size="lg">
          Listen Now
        </Button>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline">Follow</Button>
          <Button variant="outline">Share</Button>
        </div>
      </div>
  }
}`,...(P=(L=l.parameters)==null?void 0:L.docs)==null?void 0:P.source}}};var A,q,C;o.parameters={...o.parameters,docs:{...(A=o.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    artist: mockArtist,
    containerVariant: 'glass',
    children: <Button className="w-full" size="lg">
        Listen Now
      </Button>
  }
}`,...(C=(q=o.parameters)==null?void 0:q.docs)==null?void 0:C.source}}};var G,F,W;d.parameters={...d.parameters,docs:{...(G=d.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    artist: mockArtist,
    containerVariant: 'solid',
    children: <Button className="w-full" size="lg">
        Listen Now
      </Button>
  }
}`,...(W=(F=d.parameters)==null?void 0:F.docs)==null?void 0:W.source}}};var M,D,I;c.parameters={...c.parameters,docs:{...(M=c.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    artist: mockArtist,
    backgroundPattern: 'dots',
    children: <Button className="w-full" size="lg">
        Listen Now
      </Button>
  }
}`,...(I=(D=c.parameters)==null?void 0:D.docs)==null?void 0:I.source}}};var T,O,E;u.parameters={...u.parameters,docs:{...(T=u.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    artist: mockArtist,
    backgroundPattern: 'gradient',
    containerVariant: 'glass',
    children: <Button className="w-full" size="lg">
        Listen Now
      </Button>
  }
}`,...(E=(O=u.parameters)==null?void 0:O.docs)==null?void 0:E.source}}};var R,$,H;m.parameters={...m.parameters,docs:{...(R=m.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    artist: mockArtist,
    backgroundPattern: 'none',
    showGradientBlurs: false,
    containerVariant: 'solid',
    children: <Button className="w-full" size="lg">
        Listen Now
      </Button>
  }
}`,...(H=($=m.parameters)==null?void 0:$.docs)==null?void 0:H.source}}};var J,K,Q;p.parameters={...p.parameters,docs:{...(J=p.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    artist: mockArtist,
    avatarSize: 'sm',
    nameSize: 'sm',
    maxWidthClass: 'w-full max-w-xs',
    children: <Button className="w-full" size="sm">
        Follow
      </Button>
  }
}`,...(Q=(K=p.parameters)==null?void 0:K.docs)==null?void 0:Q.source}}};var U,X,Y;g.parameters={...g.parameters,docs:{...(U=g.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    artist: mockArtist,
    avatarSize: 'xl',
    nameSize: 'xl',
    maxWidthClass: 'w-full max-w-lg',
    children: <div className="space-y-6 w-full">
        <Button className="w-full" size="lg">
          Listen Now
        </Button>
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>Latest album: &quot;Midnights&quot; • 2022</p>
          <p>13 tracks • 44 minutes</p>
        </div>
      </div>
  }
}`,...(Y=(X=g.parameters)==null?void 0:X.docs)==null?void 0:Y.source}}};var Z,ee,ae;f.parameters={...f.parameters,docs:{...(Z=f.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  args: {
    artist: mockArtist,
    children: <div className="space-y-6 w-full">
        <Button className="w-full" size="lg">
          Listen Now
        </Button>

        <div className="grid grid-cols-3 gap-3">
          <Button variant="outline" size="sm">
            Follow
          </Button>
          <Button variant="outline" size="sm">
            Share
          </Button>
          <Button variant="outline" size="sm">
            Tip
          </Button>
        </div>

        <div className="text-center space-y-2">
          <div className="flex justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <span>12.4M followers</span>
            <span>•</span>
            <span>85 releases</span>
          </div>
        </div>
      </div>
  }
}`,...(ae=(ee=f.parameters)==null?void 0:ee.docs)==null?void 0:ae.source}}};const Be=["Default","WithSubtitle","WithActions","GlassVariant","SolidVariant","DotsBackground","GradientBackground","NoBackground","SmallProfile","LargeProfile","CompleteProfile"];export{f as CompleteProfile,n as Default,c as DotsBackground,o as GlassVariant,u as GradientBackground,g as LargeProfile,m as NoBackground,p as SmallProfile,d as SolidVariant,l as WithActions,i as WithSubtitle,Be as __namedExportsOrder,je as default};
