import{j as e}from"./jsx-runtime-nlD-EgCR.js";import{r as T}from"./iframe-BD9qcwu-.js";import{T as me}from"./TipSelector-C21aElgB.js";import{Q as ie}from"./QRCodeCard-DeSJK2W4.js";import{L as le}from"./LoadingButton-BTRyGtUL.js";import{B as $}from"./Button-BzwZ4BTt.js";import"./preload-helper-Dp1pzeXC.js";import"./AmountSelector-BOPPODdb.js";import"./utils-C1Vhx1Sh.js";import"./clsx-B-dksMZM.js";import"./QRCode-B3X3Jf_7.js";import"./image-DeoQVfv0.js";import"./use-merged-ref-BX-EWIVL.js";import"./LoadingSpinner-fa8Ycb3U.js";function m({amounts:t=[2,5,10],venmoLink:n,venmoUsername:r,onStripePayment:o,onVenmoPayment:x,className:l=""}){const[re,N]=T.useState(null),[s,d]=T.useState(null),oe=async a=>{if(o){N(a);try{await o(a),alert(`Thanks for the $${a} tip 🎉`)}catch{alert("Payment failed. Please try again.")}finally{N(null)}}},se=a=>{if(!n||!x)return;const w=n.includes("?")?"&":"?",V=`${n}${w}utm_amount=${a}&utm_username=${encodeURIComponent(r??"")}`;x(V),window.open(V,"_blank","noopener,noreferrer")};return!o&&!n?e.jsx("div",{className:`text-center space-y-4 ${l}`,children:e.jsx(ie,{data:"",title:"Scan to tip via Apple Pay",qrSize:192})}):o&&n&&!s?e.jsxs("div",{className:`w-full max-w-sm space-y-3 ${l}`,children:[e.jsx("h3",{className:"text-lg font-semibold text-center text-gray-900 dark:text-white mb-4",children:"Choose payment method"}),e.jsx($,{onClick:()=>d("stripe"),className:"w-full",size:"lg",children:"Pay with Apple Pay / Card"}),e.jsx($,{onClick:()=>d("venmo"),variant:"outline",className:"w-full",size:"lg",children:"Pay with Venmo"})]}):s==="stripe"||o&&!n?e.jsxs("div",{className:`w-full max-w-sm space-y-3 ${l}`,children:[s&&e.jsx("button",{onClick:()=>d(null),className:"text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-4",children:"← Back to payment methods"}),t.map(a=>e.jsxs(le,{onClick:()=>oe(a),className:"w-full",size:"lg",isLoading:re===a,loadingText:"Processing…",children:["$",a," Tip"]},a)),e.jsx("p",{className:"mt-2 text-center text-xs text-gray-500",children:"Tips are non-refundable"})]}):s==="venmo"||n&&!o?e.jsxs("div",{className:`w-full max-w-sm ${l}`,children:[s&&e.jsx("button",{onClick:()=>d(null),className:"text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-4",children:"← Back to payment methods"}),e.jsx(me,{amounts:t,onContinue:se})]}):null}try{m.displayName="TipSection",m.__docgenInfo={description:"",displayName:"TipSection",props:{handle:{defaultValue:null,description:"",name:"handle",required:!0,type:{name:"string"}},artistName:{defaultValue:null,description:"",name:"artistName",required:!0,type:{name:"string"}},amounts:{defaultValue:{value:"[2, 5, 10]"},description:"",name:"amounts",required:!1,type:{name:"number[] | undefined"}},venmoLink:{defaultValue:null,description:"",name:"venmoLink",required:!1,type:{name:"string | undefined"}},venmoUsername:{defaultValue:null,description:"",name:"venmoUsername",required:!1,type:{name:"string | null | undefined"}},onStripePayment:{defaultValue:null,description:"",name:"onStripePayment",required:!1,type:{name:"((amount: number) => Promise<void>) | undefined"}},onVenmoPayment:{defaultValue:null,description:"",name:"onVenmoPayment",required:!1,type:{name:"((url: string) => void) | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const we={title:"Organisms/TipSection",component:m,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{amounts:{control:{type:"object"}}}},i=async t=>{await new Promise(n=>setTimeout(n,2e3))},S=t=>{},c={args:{handle:"taylorswift",artistName:"Taylor Swift",onStripePayment:i}},u={args:{handle:"edsheeran",artistName:"Ed Sheeran",venmoLink:"https://venmo.com/u/edsheeran",venmoUsername:"edsheeran",onVenmoPayment:S}},p={args:{handle:"billieeilish",artistName:"Billie Eilish",onStripePayment:i,venmoLink:"https://venmo.com/u/billieeilish",venmoUsername:"billieeilish",onVenmoPayment:S}},y={args:{handle:"theweeknd",artistName:"The Weeknd",amounts:[5,10,25],onStripePayment:i}},h={args:{handle:"drake",artistName:"Drake",amounts:[10,25,50],onStripePayment:i}},g={args:{handle:"arianagrande",artistName:"Ariana Grande"}},P={args:{handle:"postmalone",artistName:"Post Malone",amounts:[3,7,15],venmoLink:"https://venmo.com/u/postmalone",venmoUsername:"postmalone",onVenmoPayment:S}},f={render:()=>{const t=async n=>{await new Promise(r=>setTimeout(r,3e3))};return e.jsx(m,{handle:"dualipa",artistName:"Dua Lipa",amounts:[5,10,20],onStripePayment:t})}},v={render:()=>{const t=async r=>{alert(`Processing $${r} payment via Stripe...`),await new Promise(o=>setTimeout(o,1e3)),alert(`Payment successful! Thank you for the $${r} tip! 🎉`)},n=r=>{alert(`Would normally open: ${r}`)};return e.jsx(m,{handle:"oliviarodrigo",artistName:"Olivia Rodrigo",amounts:[3,5,10],onStripePayment:t,venmoLink:"https://venmo.com/u/oliviarodrigo",venmoUsername:"oliviarodrigo",onVenmoPayment:n})}},k={args:{handle:"weeknd",artistName:"The Weeknd",onStripePayment:i},parameters:{backgrounds:{default:"dark"}}};var b,j,C;c.parameters={...c.parameters,docs:{...(b=c.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    handle: 'taylorswift',
    artistName: 'Taylor Swift',
    onStripePayment: mockStripePayment
  }
}`,...(C=(j=c.parameters)==null?void 0:j.docs)==null?void 0:C.source}}};var L,U,_;u.parameters={...u.parameters,docs:{...(L=u.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    handle: 'edsheeran',
    artistName: 'Ed Sheeran',
    venmoLink: 'https://venmo.com/u/edsheeran',
    venmoUsername: 'edsheeran',
    onVenmoPayment: mockVenmoPayment
  }
}`,...(_=(U=u.parameters)==null?void 0:U.docs)==null?void 0:_.source}}};var A,D,q;p.parameters={...p.parameters,docs:{...(A=p.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    handle: 'billieeilish',
    artistName: 'Billie Eilish',
    onStripePayment: mockStripePayment,
    venmoLink: 'https://venmo.com/u/billieeilish',
    venmoUsername: 'billieeilish',
    onVenmoPayment: mockVenmoPayment
  }
}`,...(q=(D=p.parameters)==null?void 0:D.docs)==null?void 0:q.source}}};var B,M,O;y.parameters={...y.parameters,docs:{...(B=y.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    handle: 'theweeknd',
    artistName: 'The Weeknd',
    amounts: [5, 10, 25],
    onStripePayment: mockStripePayment
  }
}`,...(O=(M=y.parameters)==null?void 0:M.docs)==null?void 0:O.source}}};var W,E,R;h.parameters={...h.parameters,docs:{...(W=h.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    handle: 'drake',
    artistName: 'Drake',
    amounts: [10, 25, 50],
    onStripePayment: mockStripePayment
  }
}`,...(R=(E=h.parameters)==null?void 0:E.docs)==null?void 0:R.source}}};var I,z,Q;g.parameters={...g.parameters,docs:{...(I=g.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    handle: 'arianagrande',
    artistName: 'Ariana Grande'
    // No payment methods provided
  }
}`,...(Q=(z=g.parameters)==null?void 0:z.docs)==null?void 0:Q.source}}};var F,G,H;P.parameters={...P.parameters,docs:{...(F=P.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    handle: 'postmalone',
    artistName: 'Post Malone',
    amounts: [3, 7, 15],
    venmoLink: 'https://venmo.com/u/postmalone',
    venmoUsername: 'postmalone',
    onVenmoPayment: mockVenmoPayment
  }
}`,...(H=(G=P.parameters)==null?void 0:G.docs)==null?void 0:H.source}}};var J,K,X;f.parameters={...f.parameters,docs:{...(J=f.parameters)==null?void 0:J.docs,source:{originalSource:`{
  render: () => {
    const handlePayment = async (amount: number) => {
      console.log(\`Processing $\${amount}...\`);
      await new Promise(resolve => setTimeout(resolve, 3000));
      console.log(\`Payment complete: $\${amount}\`);
    };
    return <TipSection handle="dualipa" artistName="Dua Lipa" amounts={[5, 10, 20]} onStripePayment={handlePayment} />;
  }
}`,...(X=(K=f.parameters)==null?void 0:K.docs)==null?void 0:X.source}}};var Y,Z,ee;v.parameters={...v.parameters,docs:{...(Y=v.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  render: () => {
    const handleStripePayment = async (amount: number) => {
      alert(\`Processing $\${amount} payment via Stripe...\`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(\`Payment successful! Thank you for the $\${amount} tip! 🎉\`);
    };
    const handleVenmoPayment = (url: string) => {
      alert(\`Would normally open: \${url}\`);
    };
    return <TipSection handle="oliviarodrigo" artistName="Olivia Rodrigo" amounts={[3, 5, 10]} onStripePayment={handleStripePayment} venmoLink="https://venmo.com/u/oliviarodrigo" venmoUsername="oliviarodrigo" onVenmoPayment={handleVenmoPayment} />;
  }
}`,...(ee=(Z=v.parameters)==null?void 0:Z.docs)==null?void 0:ee.source}}};var ne,ae,te;k.parameters={...k.parameters,docs:{...(ne=k.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  args: {
    handle: 'weeknd',
    artistName: 'The Weeknd',
    onStripePayment: mockStripePayment
  },
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  }
}`,...(te=(ae=k.parameters)==null?void 0:ae.docs)==null?void 0:te.source}}};const Ve=["StripeOnly","VenmoOnly","BothPaymentMethods","CustomAmounts","LargeAmounts","QRFallback","VenmoWithCustomAmounts","LoadingDemo","InteractiveDemo","InDarkMode"];export{p as BothPaymentMethods,y as CustomAmounts,k as InDarkMode,v as InteractiveDemo,h as LargeAmounts,f as LoadingDemo,g as QRFallback,c as StripeOnly,u as VenmoOnly,P as VenmoWithCustomAmounts,Ve as __namedExportsOrder,we as default};
