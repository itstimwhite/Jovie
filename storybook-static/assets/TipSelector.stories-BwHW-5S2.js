import{j as o}from"./jsx-runtime-nlD-EgCR.js";import{T as Y}from"./TipSelector-C21aElgB.js";import"./iframe-BD9qcwu-.js";import"./preload-helper-Dp1pzeXC.js";import"./AmountSelector-BOPPODdb.js";import"./utils-C1Vhx1Sh.js";import"./clsx-B-dksMZM.js";import"./Button-BzwZ4BTt.js";const Q={title:"Molecules/TipSelector",component:Y,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{isLoading:{control:{type:"boolean"}}}},t={args:{onContinue:e=>console.log(`Selected amount: $${e}`)}},r={args:{amounts:[2,5,10],onContinue:e=>console.log(`Selected amount: $${e}`)}},a={args:{amounts:[10,25,50],onContinue:e=>console.log(`Selected amount: $${e}`)}},s={args:{amounts:[1,3,5,10,20],onContinue:e=>console.log(`Selected amount: $${e}`)},render:e=>{var n;return o.jsxs("div",{className:"w-80",children:[o.jsx("div",{className:"grid grid-cols-5 gap-2 mb-4",children:(n=e.amounts)==null?void 0:n.map(d=>o.jsxs("button",{type:"button",className:"w-full aspect-square rounded-xl border text-sm font-semibold transition-colors flex items-center justify-center cursor-pointer bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 border-black/40 hover:border-black/70 dark:border-white/30 dark:hover:border-white/60",children:["$",d]},d))}),o.jsx("button",{className:"w-full bg-blue-600 text-white rounded-lg py-3 font-medium",children:"Continue"})]})}},u={args:{isLoading:!0,onContinue:e=>console.log(`Selected amount: $${e}`)}},m={args:{amounts:[3,5,7],onContinue:e=>console.log(`Continue to Venmo with $${e}`)}},c={args:{amounts:[2,5,10],onContinue:e=>console.log(`Process $${e} tip via Stripe`)}},i={render:()=>{const e=n=>{alert(`You selected $${n}! This would normally continue to payment.`)};return o.jsx("div",{className:"max-w-sm",children:o.jsx(Y,{amounts:[3,5,10],onContinue:e})})}},l={args:{amounts:[5,10,20],onContinue:e=>console.log(`Selected amount: $${e}`)},parameters:{backgrounds:{default:"dark"}}};var p,g,b;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    onContinue: amount => console.log(\`Selected amount: $\${amount}\`)
  }
}`,...(b=(g=t.parameters)==null?void 0:g.docs)==null?void 0:b.source}}};var $,S,C;r.parameters={...r.parameters,docs:{...($=r.parameters)==null?void 0:$.docs,source:{originalSource:`{
  args: {
    amounts: [2, 5, 10],
    onContinue: amount => console.log(\`Selected amount: $\${amount}\`)
  }
}`,...(C=(S=r.parameters)==null?void 0:S.docs)==null?void 0:C.source}}};var h,x,w;a.parameters={...a.parameters,docs:{...(h=a.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    amounts: [10, 25, 50],
    onContinue: amount => console.log(\`Selected amount: $\${amount}\`)
  }
}`,...(w=(x=a.parameters)==null?void 0:x.docs)==null?void 0:w.source}}};var y,f,k;s.parameters={...s.parameters,docs:{...(y=s.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    amounts: [1, 3, 5, 10, 20],
    onContinue: amount => console.log(\`Selected amount: $\${amount}\`)
  },
  render: args => <div className="w-80">
      <div className="grid grid-cols-5 gap-2 mb-4">
        {args.amounts?.map(amount => <button key={amount} type="button" className="w-full aspect-square rounded-xl border text-sm font-semibold transition-colors flex items-center justify-center cursor-pointer bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 border-black/40 hover:border-black/70 dark:border-white/30 dark:hover:border-white/60">
            \${amount}
          </button>)}
      </div>
      <button className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium">
        Continue
      </button>
    </div>
}`,...(k=(f=s.parameters)==null?void 0:f.docs)==null?void 0:k.source}}};var v,j,N;u.parameters={...u.parameters,docs:{...(v=u.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    isLoading: true,
    onContinue: amount => console.log(\`Selected amount: $\${amount}\`)
  }
}`,...(N=(j=u.parameters)==null?void 0:j.docs)==null?void 0:N.source}}};var A,L,T;m.parameters={...m.parameters,docs:{...(A=m.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    amounts: [3, 5, 7],
    onContinue: amount => console.log(\`Continue to Venmo with $\${amount}\`)
  }
}`,...(T=(L=m.parameters)==null?void 0:L.docs)==null?void 0:T.source}}};var D,I,V;c.parameters={...c.parameters,docs:{...(D=c.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    amounts: [2, 5, 10],
    onContinue: amount => console.log(\`Process $\${amount} tip via Stripe\`)
  }
}`,...(V=(I=c.parameters)==null?void 0:I.docs)==null?void 0:V.source}}};var M,O,q;i.parameters={...i.parameters,docs:{...(M=i.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: () => {
    const handleContinue = (amount: number) => {
      alert(\`You selected $\${amount}! This would normally continue to payment.\`);
    };
    return <div className="max-w-sm">
        <TipSelector amounts={[3, 5, 10]} onContinue={handleContinue} />
      </div>;
  }
}`,...(q=(O=i.parameters)==null?void 0:O.docs)==null?void 0:q.source}}};var E,F,P;l.parameters={...l.parameters,docs:{...(E=l.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    amounts: [5, 10, 20],
    onContinue: amount => console.log(\`Selected amount: $\${amount}\`)
  },
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  }
}`,...(P=(F=l.parameters)==null?void 0:F.docs)==null?void 0:P.source}}};const U=["Default","CustomAmounts","LargeAmounts","FiveOptions","Loading","VenmoAmounts","StripeAmounts","InteractiveDemo","InDarkMode"];export{r as CustomAmounts,t as Default,s as FiveOptions,l as InDarkMode,i as InteractiveDemo,a as LargeAmounts,u as Loading,c as StripeAmounts,m as VenmoAmounts,U as __namedExportsOrder,Q as default};
