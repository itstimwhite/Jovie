import{j as s}from"./jsx-runtime-nlD-EgCR.js";import{S as v}from"./SectionHeading-AyPHvQGA.js";import{A as d}from"./ArtistCard-Cp_Ecg0Y.js";import"./iframe-BD9qcwu-.js";import"./preload-helper-Dp1pzeXC.js";import"./link-C04pt5ug.js";import"./use-merged-ref-BX-EWIVL.js";import"./ArtistAvatar-CJIaoGEa.js";import"./image-DeoQVfv0.js";import"./clsx-B-dksMZM.js";import"./utils-C1Vhx1Sh.js";function c({artists:a,title:t="Featured Creators",className:S=""}){return s.jsx("section",{"aria-label":"Featured artists",className:`relative py-8 ${S}`,children:s.jsxs("div",{className:"container mx-auto px-4",children:[s.jsx(v,{level:2,className:"mb-8",children:t}),s.jsx("div",{className:"hidden md:block",children:s.jsx("ul",{className:"flex items-center gap-10 overflow-x-auto scroll-smooth pb-4",children:a.map(e=>s.jsx("li",{className:"shrink-0",children:s.jsx(d,{handle:e.handle,name:e.name,src:e.src,alt:e.alt,size:"md"})},e.id))})}),s.jsx("div",{className:"md:hidden",children:s.jsx("ul",{className:"flex items-center gap-6 overflow-x-auto scroll-smooth px-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",children:a.map(e=>s.jsx("li",{className:"shrink-0 first:ml-2 last:mr-2",children:s.jsx(d,{handle:e.handle,name:e.name,src:e.src,alt:e.alt,size:"sm"})},e.id))})})]})})}try{c.displayName="FeaturedArtistsSection",c.__docgenInfo={description:"",displayName:"FeaturedArtistsSection",props:{artists:{defaultValue:null,description:"",name:"artists",required:!0,type:{name:"FeaturedArtist[]"}},title:{defaultValue:{value:"Featured Creators"},description:"",name:"title",required:!1,type:{name:"string | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const z={title:"Organisms/FeaturedArtistsSection",component:c,parameters:{layout:"fullscreen"},tags:["autodocs"]},r=[{id:"1",handle:"arianagrande",name:"Ariana Grande",src:"https://i.scdn.co/image/ab6761610000e5ebcdce7620dc940db079bf4952"},{id:"2",handle:"musicmaker",name:"Music Maker",src:"/images/avatars/music-maker.jpg"},{id:"3",handle:"popstar",name:"Pop Star",src:"/images/avatars/pop-star.jpg"},{id:"4",handle:"billieeilish",name:"Billie Eilish",src:"https://i.scdn.co/image/ab6761610000e5eb50defaf9fc059a1efc541f4c"}],i={args:{artists:r,title:"Featured Creators"}},n={args:{artists:r,title:"Popular Artists"}},o={args:{artists:[r[0]],title:"Featured Creator"}},l={args:{artists:[...r,...r.map((a,t)=>({...a,id:`${a.id}-${t}`,handle:`${a.handle}${t}`}))],title:"All Creators"}};var m,p,u;i.parameters={...i.parameters,docs:{...(m=i.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    artists: mockArtists,
    title: 'Featured Creators'
  }
}`,...(u=(p=i.parameters)==null?void 0:p.docs)==null?void 0:u.source}}};var h,g,f;n.parameters={...n.parameters,docs:{...(h=n.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    artists: mockArtists,
    title: 'Popular Artists'
  }
}`,...(f=(g=n.parameters)==null?void 0:g.docs)==null?void 0:f.source}}};var x,A,j;o.parameters={...o.parameters,docs:{...(x=o.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    artists: [mockArtists[0]],
    title: 'Featured Creator'
  }
}`,...(j=(A=o.parameters)==null?void 0:A.docs)==null?void 0:j.source}}};var b,k,N;l.parameters={...l.parameters,docs:{...(b=l.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    artists: [...mockArtists, ...mockArtists.map((artist, index) => ({
      ...artist,
      id: \`\${artist.id}-\${index}\`,
      handle: \`\${artist.handle}\${index}\`
    }))],
    title: 'All Creators'
  }
}`,...(N=(k=l.parameters)==null?void 0:k.docs)==null?void 0:N.source}}};const D=["Default","CustomTitle","SingleArtist","ManyArtists"];export{n as CustomTitle,i as Default,l as ManyArtists,o as SingleArtist,D as __namedExportsOrder,z as default};
