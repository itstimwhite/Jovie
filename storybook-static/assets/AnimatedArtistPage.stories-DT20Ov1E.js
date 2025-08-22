const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./AnimatedListenInterface-DEjT2iY0.js","./jsx-runtime-nlD-EgCR.js","./iframe-BD9qcwu-.js","./preload-helper-Dp1pzeXC.js","./iframe-__OCDmgy.css","./dsp-Cgq-4B7L.js","./spotify-B0iVmbYP.js","./env-CfNjJZ1e.js","./deep-links-BO5PSBZt.js","./utils-C1Vhx1Sh.js","./clsx-B-dksMZM.js","./app-BLJZaWm-.js","./proxy-BWvWzjh9.js","./VenmoTipSelector-J1Uu0OQG.js","./TipSelector-C21aElgB.js","./AmountSelector-BOPPODdb.js","./Button-BzwZ4BTt.js"])))=>i.map(i=>d[i]);
import{j as i}from"./jsx-runtime-nlD-EgCR.js";import{q as Le,a as xe,g as Se,R as Ne}from"./iframe-BD9qcwu-.js";import{_ as Te}from"./preload-helper-Dp1pzeXC.js";import{A as Ee}from"./ArtistPageShell-CsQEl1Gu.js";import{L as Re}from"./link-C04pt5ug.js";import{A as je,m as C}from"./proxy-BWvWzjh9.js";import"./ProfileShell-CRCll4AX.js";import"./Container-Stspju0f.js";import"./utils-C1Vhx1Sh.js";import"./clsx-B-dksMZM.js";import"./FrostedButton-DfucP8-i.js";import"./BackgroundPattern-DjnfHVKt.js";import"./ArtistInfo-FJSJwlXQ.js";import"./ArtistAvatar-CJIaoGEa.js";import"./image-DeoQVfv0.js";import"./use-merged-ref-BX-EWIVL.js";import"./ArtistName-ChVkRN4X.js";import"./app-BLJZaWm-.js";import"./env-CfNjJZ1e.js";import"./SocialIcon-CY3kc164.js";import"./analytics-D1RlhUK7.js";import"./deep-links-BO5PSBZt.js";function Ce(t){throw new Error('Could not dynamically require "'+t+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var I={},q={},O;function Pe(){return O||(O=1,function(t){"use client";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"LoadableContext",{enumerable:!0,get:function(){return r}});const r=Le()._(xe()).default.createContext(null)}(q)),q}var G;function Me(){return G||(G=1,function(t){Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return ve}});const a=Le()._(xe()),r=Pe();function m(o){return o&&o.default?o.default:o}const b=[],g=[];let w=!1;function h(o){let s=o(),e={loading:!0,loaded:null,error:null};return e.promise=s.then(l=>(e.loading=!1,e.loaded=l,l)).catch(l=>{throw e.loading=!1,e.error=l,l}),e}function _(o,s){let e=Object.assign({loader:null,loading:null,delay:200,timeout:null,webpack:null,modules:null},s),l=null;function y(){if(!l){const u=new D(o,e);l={getCurrentValue:u.getCurrentValue.bind(u),subscribe:u.subscribe.bind(u),retry:u.retry.bind(u),promise:u.promise.bind(u)}}return l.promise()}if(typeof window>"u"&&b.push(y),!w&&typeof window<"u"){const u=e.webpack&&typeof Ce.resolveWeak=="function"?e.webpack():e.modules;u&&g.push(k=>{for(const c of u)if(k.includes(c))return y()})}function Ae(){y();const u=a.default.useContext(r.LoadableContext);u&&Array.isArray(e.modules)&&e.modules.forEach(k=>{u(k)})}function V(u,k){Ae();const c=a.default.useSyncExternalStore(l.subscribe,l.getCurrentValue,l.getCurrentValue);return a.default.useImperativeHandle(k,()=>({retry:l.retry}),[]),a.default.useMemo(()=>c.loading||c.error?a.default.createElement(e.loading,{isLoading:c.loading,pastDelay:c.pastDelay,timedOut:c.timedOut,error:c.error,retry:l.retry}):c.loaded?a.default.createElement(m(c.loaded),u):null,[u,c])}return V.preload=()=>y(),V.displayName="LoadableComponent",a.default.forwardRef(V)}class D{promise(){return this._res.promise}retry(){this._clearTimeouts(),this._res=this._loadFn(this._opts.loader),this._state={pastDelay:!1,timedOut:!1};const{_res:s,_opts:e}=this;s.loading&&(typeof e.delay=="number"&&(e.delay===0?this._state.pastDelay=!0:this._delay=setTimeout(()=>{this._update({pastDelay:!0})},e.delay)),typeof e.timeout=="number"&&(this._timeout=setTimeout(()=>{this._update({timedOut:!0})},e.timeout))),this._res.promise.then(()=>{this._update({}),this._clearTimeouts()}).catch(l=>{this._update({}),this._clearTimeouts()}),this._update({})}_update(s){this._state={...this._state,error:this._res.error,loaded:this._res.loaded,loading:this._res.loading,...s},this._callbacks.forEach(e=>e())}_clearTimeouts(){clearTimeout(this._delay),clearTimeout(this._timeout)}getCurrentValue(){return this._state}subscribe(s){return this._callbacks.add(s),()=>{this._callbacks.delete(s)}}constructor(s,e){this._loadFn=s,this._opts=e,this._callbacks=new Set,this._delay=null,this._timeout=null,this.retry()}}function p(o){return _(h,o)}function M(o,s){let e=[];for(;o.length;){let l=o.pop();e.push(l(s))}return Promise.all(e).then(()=>{if(o.length)return M(o,s)})}p.preloadAll=()=>new Promise((o,s)=>{M(b).then(o,s)}),p.preloadReady=o=>(o===void 0&&(o=[]),new Promise(s=>{const e=()=>(w=!0,s());M(g,o).then(e,e)})),typeof window<"u"&&(window.__NEXT_PRELOADREADY=p.preloadReady);const ve=p}(I)),I}var Ve=Me();const Ie=Se(Ve);function F(t){return{default:(t==null?void 0:t.default)||t}}function Be(t,n){const a=Ie;(n==null?void 0:n.ssr)===!1&&delete n.ssr;let r={loading:({error:g,isLoading:w,pastDelay:h})=>null};t instanceof Promise?r.loader=()=>t:typeof t=="function"?r.loader=t:typeof t=="object"&&(r={...r,...t}),r={...r,...n};const m=r.loader,b=()=>m!=null?m().then(F):Promise.resolve(F(()=>null));return r.loadableGenerated&&(r={...r,...r.loadableGenerated},delete r.loadableGenerated),a({...r,loader:b})}const qe=Be(()=>Te(()=>import("./AnimatedListenInterface-DEjT2iY0.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12]),import.meta.url),{loadableGenerated:{modules:["components/profile/AnimatedArtistPage.tsx -> @/components/profile/AnimatedListenInterface"]},ssr:!1}),De=Be(()=>Te(()=>import("./VenmoTipSelector-J1Uu0OQG.js"),__vite__mapDeps([13,1,2,3,4,14,15,9,10,16]),import.meta.url),{loadableGenerated:{modules:["components/profile/AnimatedArtistPage.tsx -> @/components/profile/VenmoTipSelector"]},ssr:!1});function Oe(t,n,a){var r;switch(t){case"listen":return i.jsx("div",{className:"flex justify-center",children:i.jsx(qe,{artist:n,handle:n.handle})});case"tip":const m=((r=a.find(h=>h.platform==="venmo"))==null?void 0:r.url)||null,g=(h=>{if(!h)return null;try{const _=new URL(h);if(["venmo.com","www.venmo.com"].includes(_.hostname)){const p=_.pathname.split("/").filter(Boolean);if(p[0]==="u"&&p[1])return p[1];if(p[0])return p[0]}return null}catch{return null}})(m),w=[3,5,7];return i.jsx(C.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.6},children:i.jsx("div",{className:"space-y-4",children:m?i.jsx(De,{venmoLink:m,venmoUsername:g??void 0,amounts:w,className:"w-full max-w-sm"}):i.jsx("div",{className:"text-center",children:i.jsx("div",{className:"bg-white/60 dark:bg-white/5 backdrop-blur-lg border border-gray-200/30 dark:border-white/10 rounded-2xl p-8 shadow-xl shadow-black/5",children:i.jsx("p",{className:"text-gray-600 dark:text-gray-400",children:"Venmo tipping is not available for this artist yet."})})})})});default:return i.jsx(C.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.6},children:i.jsx("div",{className:"space-y-4",children:i.jsx(Re,{href:`/${n.handle}?mode=listen`,prefetch:!0,className:"inline-flex items-center justify-center w-full px-8 py-4 text-lg font-semibold text-white bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2",children:"🎵 Listen Now"})})})}}function P({mode:t,artist:n,socialLinks:a,subtitle:r,showTipButton:m,showBackButton:b}){const g={initial:{opacity:0,scale:.98,y:10,filter:"blur(4px)"},animate:{opacity:1,scale:1,y:0,filter:"blur(0px)",transition:{duration:.5,ease:[.16,1,.3,1],staggerChildren:.1}},exit:{opacity:0,scale:1.02,y:-10,filter:"blur(2px)",transition:{duration:.3,ease:[.4,0,1,1]}}};return i.jsx(je,{mode:"wait",children:i.jsx(C.div,{variants:g,initial:"initial",animate:"animate",exit:"exit",className:"w-full",children:i.jsx(Ee,{artist:n,socialLinks:a,subtitle:r,showTipButton:m,showBackButton:b,children:i.jsx(C.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0,transition:{delay:.2,duration:.4,ease:[.16,1,.3,1]}},children:Oe(t,n,a)})})},t)})}try{P.displayName="AnimatedArtistPage",P.__docgenInfo={description:"",displayName:"AnimatedArtistPage",props:{mode:{defaultValue:null,description:"",name:"mode",required:!0,type:{name:"string"}},artist:{defaultValue:null,description:"",name:"artist",required:!0,type:{name:"Artist"}},socialLinks:{defaultValue:null,description:"",name:"socialLinks",required:!0,type:{name:"LegacySocialLink[]"}},subtitle:{defaultValue:null,description:"",name:"subtitle",required:!0,type:{name:"string"}},showTipButton:{defaultValue:null,description:"",name:"showTipButton",required:!0,type:{name:"boolean"}},showBackButton:{defaultValue:null,description:"",name:"showBackButton",required:!0,type:{name:"boolean"}}}}}catch{}const ut={title:"Profile/AnimatedArtistPage",component:P,parameters:{layout:"fullscreen"},tags:["autodocs"],argTypes:{mode:{control:{type:"select"},options:["profile","listen","tip"]},showTipButton:{control:{type:"boolean"}},showBackButton:{control:{type:"boolean"}}}},d={id:"1",handle:"taylorswift",name:"Taylor Swift",image_url:"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=face",tagline:"Grammy Award-winning singer-songwriter known for narrative songs about her personal life.",is_verified:!0,owner_user_id:"1",spotify_id:"",published:!0,is_featured:!1,created_at:new Date().toISOString(),marketing_opt_out:!1},f=[{id:"1",artist_id:"1",platform:"instagram",url:"https://instagram.com/taylorswift",clicks:0,created_at:""},{id:"2",artist_id:"1",platform:"twitter",url:"https://twitter.com/taylorswift13",clicks:0,created_at:""},{id:"3",artist_id:"1",platform:"venmo",url:"https://venmo.com/u/taylorswift",clicks:0,created_at:""}],L={args:{mode:"profile",artist:d,socialLinks:f,subtitle:"The Eras Tour • Live from London",showTipButton:!0,showBackButton:!1}},x={args:{mode:"listen",artist:d,socialLinks:f,subtitle:"The Eras Tour • Live from London",showTipButton:!1,showBackButton:!0}},T={args:{mode:"tip",artist:d,socialLinks:f,subtitle:"The Eras Tour • Live from London",showTipButton:!1,showBackButton:!0}},B={args:{mode:"tip",artist:d,socialLinks:f.filter(t=>t.platform!=="venmo"),subtitle:"The Eras Tour • Live from London",showTipButton:!1,showBackButton:!0}},v={args:{mode:"profile",artist:{...d,is_verified:!0},socialLinks:f,subtitle:"Grammy Winner • Multi-Platinum Artist",showTipButton:!0,showBackButton:!1}},A={args:{mode:"profile",artist:{...d,is_verified:!1,name:"Rising Artist"},socialLinks:f.slice(0,2),subtitle:"New Music Coming Soon",showTipButton:!1,showBackButton:!1}},S={args:{mode:"profile",artist:d,socialLinks:[f[0]],subtitle:"The Eras Tour • Live from London",showTipButton:!1,showBackButton:!1}},N={args:{mode:"profile",artist:d,socialLinks:[],subtitle:"The Eras Tour • Live from London",showTipButton:!1,showBackButton:!1}},E={args:{mode:"profile",artist:{...d,name:"Florence + The Machine",tagline:"British indie rock band known for powerful vocals and ethereal soundscapes."},socialLinks:f,subtitle:"Dance Fever World Tour 2024",showTipButton:!0,showBackButton:!1}},R={args:{mode:"profile",artist:{...d,name:"Zedd",tagline:"German DJ and music producer."},socialLinks:f,subtitle:"Clarity Tour",showTipButton:!0,showBackButton:!1}},j={render:function(){const[n,a]=Ne.useState("profile");return i.jsxs("div",{children:[i.jsxs("div",{className:"fixed top-4 left-4 z-50 flex gap-2",children:[i.jsx("button",{onClick:()=>a("profile"),className:`px-3 py-1 rounded text-sm ${n==="profile"?"bg-blue-600 text-white":"bg-white text-gray-700 border"}`,children:"Profile"}),i.jsx("button",{onClick:()=>a("listen"),className:`px-3 py-1 rounded text-sm ${n==="listen"?"bg-blue-600 text-white":"bg-white text-gray-700 border"}`,children:"Listen"}),i.jsx("button",{onClick:()=>a("tip"),className:`px-3 py-1 rounded text-sm ${n==="tip"?"bg-blue-600 text-white":"bg-white text-gray-700 border"}`,children:"Tip"})]}),i.jsx(P,{mode:n,artist:d,socialLinks:f,subtitle:"Interactive Demo Mode",showTipButton:n==="profile",showBackButton:n!=="profile"})]})}};var U,W,$;L.parameters={...L.parameters,docs:{...(U=L.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    mode: 'profile',
    artist: mockArtist,
    socialLinks: mockSocialLinks,
    subtitle: 'The Eras Tour • Live from London',
    showTipButton: true,
    showBackButton: false
  }
}`,...($=(W=L.parameters)==null?void 0:W.docs)==null?void 0:$.source}}};var Z,H,J;x.parameters={...x.parameters,docs:{...(Z=x.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  args: {
    mode: 'listen',
    artist: mockArtist,
    socialLinks: mockSocialLinks,
    subtitle: 'The Eras Tour • Live from London',
    showTipButton: false,
    showBackButton: true
  }
}`,...(J=(H=x.parameters)==null?void 0:H.docs)==null?void 0:J.source}}};var Y,z,X;T.parameters={...T.parameters,docs:{...(Y=T.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    mode: 'tip',
    artist: mockArtist,
    socialLinks: mockSocialLinks,
    subtitle: 'The Eras Tour • Live from London',
    showTipButton: false,
    showBackButton: true
  }
}`,...(X=(z=T.parameters)==null?void 0:z.docs)==null?void 0:X.source}}};var K,Q,ee;B.parameters={...B.parameters,docs:{...(K=B.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    mode: 'tip',
    artist: mockArtist,
    socialLinks: mockSocialLinks.filter(link => link.platform !== 'venmo'),
    subtitle: 'The Eras Tour • Live from London',
    showTipButton: false,
    showBackButton: true
  }
}`,...(ee=(Q=B.parameters)==null?void 0:Q.docs)==null?void 0:ee.source}}};var te,re,oe;v.parameters={...v.parameters,docs:{...(te=v.parameters)==null?void 0:te.docs,source:{originalSource:`{
  args: {
    mode: 'profile',
    artist: {
      ...mockArtist,
      is_verified: true
    },
    socialLinks: mockSocialLinks,
    subtitle: 'Grammy Winner • Multi-Platinum Artist',
    showTipButton: true,
    showBackButton: false
  }
}`,...(oe=(re=v.parameters)==null?void 0:re.docs)==null?void 0:oe.source}}};var ne,ie,ae;A.parameters={...A.parameters,docs:{...(ne=A.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  args: {
    mode: 'profile',
    artist: {
      ...mockArtist,
      is_verified: false,
      name: 'Rising Artist'
    },
    socialLinks: mockSocialLinks.slice(0, 2),
    // No Venmo
    subtitle: 'New Music Coming Soon',
    showTipButton: false,
    showBackButton: false
  }
}`,...(ae=(ie=A.parameters)==null?void 0:ie.docs)==null?void 0:ae.source}}};var se,le,ue;S.parameters={...S.parameters,docs:{...(se=S.parameters)==null?void 0:se.docs,source:{originalSource:`{
  args: {
    mode: 'profile',
    artist: mockArtist,
    socialLinks: [mockSocialLinks[0]],
    // Only Instagram
    subtitle: 'The Eras Tour • Live from London',
    showTipButton: false,
    showBackButton: false
  }
}`,...(ue=(le=S.parameters)==null?void 0:le.docs)==null?void 0:ue.source}}};var ce,de,me;N.parameters={...N.parameters,docs:{...(ce=N.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  args: {
    mode: 'profile',
    artist: mockArtist,
    socialLinks: [],
    subtitle: 'The Eras Tour • Live from London',
    showTipButton: false,
    showBackButton: false
  }
}`,...(me=(de=N.parameters)==null?void 0:de.docs)==null?void 0:me.source}}};var pe,fe,he;E.parameters={...E.parameters,docs:{...(pe=E.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  args: {
    mode: 'profile',
    artist: {
      ...mockArtist,
      name: 'Florence + The Machine',
      tagline: 'British indie rock band known for powerful vocals and ethereal soundscapes.'
    },
    socialLinks: mockSocialLinks,
    subtitle: 'Dance Fever World Tour 2024',
    showTipButton: true,
    showBackButton: false
  }
}`,...(he=(fe=E.parameters)==null?void 0:fe.docs)==null?void 0:he.source}}};var be,ge,we;R.parameters={...R.parameters,docs:{...(be=R.parameters)==null?void 0:be.docs,source:{originalSource:`{
  args: {
    mode: 'profile',
    artist: {
      ...mockArtist,
      name: 'Zedd',
      tagline: 'German DJ and music producer.'
    },
    socialLinks: mockSocialLinks,
    subtitle: 'Clarity Tour',
    showTipButton: true,
    showBackButton: false
  }
}`,...(we=(ge=R.parameters)==null?void 0:ge.docs)==null?void 0:we.source}}};var ke,_e,ye;j.parameters={...j.parameters,docs:{...(ke=j.parameters)==null?void 0:ke.docs,source:{originalSource:`{
  render: function InteractiveDemoRender() {
    const [mode, setMode] = React.useState<'profile' | 'listen' | 'tip'>('profile');
    return <div>
        <div className="fixed top-4 left-4 z-50 flex gap-2">
          <button onClick={() => setMode('profile')} className={\`px-3 py-1 rounded text-sm \${mode === 'profile' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}\`}>
            Profile
          </button>
          <button onClick={() => setMode('listen')} className={\`px-3 py-1 rounded text-sm \${mode === 'listen' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}\`}>
            Listen
          </button>
          <button onClick={() => setMode('tip')} className={\`px-3 py-1 rounded text-sm \${mode === 'tip' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}\`}>
            Tip
          </button>
        </div>

        <AnimatedArtistPage mode={mode} artist={mockArtist} socialLinks={mockSocialLinks} subtitle="Interactive Demo Mode" showTipButton={mode === 'profile'} showBackButton={mode !== 'profile'} />
      </div>;
  }
}`,...(ye=(_e=j.parameters)==null?void 0:_e.docs)==null?void 0:ye.source}}};const ct=["ProfileMode","ListenMode","TipMode","TipModeWithoutVenmo","VerifiedArtist","UnverifiedArtist","MinimalSocials","NoSocials","LongArtistName","ShortArtistName","InteractiveDemo"];export{j as InteractiveDemo,x as ListenMode,E as LongArtistName,S as MinimalSocials,N as NoSocials,L as ProfileMode,R as ShortArtistName,T as TipMode,B as TipModeWithoutVenmo,A as UnverifiedArtist,v as VerifiedArtist,ct as __namedExportsOrder,ut as default};
