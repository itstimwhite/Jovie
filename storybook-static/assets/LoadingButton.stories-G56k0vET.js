import{j as h}from"./jsx-runtime-nlD-EgCR.js";import{R as te}from"./iframe-BD9qcwu-.js";import{L as oe}from"./LoadingButton-BTRyGtUL.js";import"./preload-helper-Dp1pzeXC.js";import"./LoadingSpinner-fa8Ycb3U.js";import"./clsx-B-dksMZM.js";import"./image-DeoQVfv0.js";import"./use-merged-ref-BX-EWIVL.js";import"./Button-BzwZ4BTt.js";const Te={title:"Molecules/LoadingButton",component:oe,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{isLoading:{control:{type:"boolean"}},spinnerSize:{control:{type:"select"},options:["xs","sm","md","lg"]}}},e={args:{children:"Click me"}},r={args:{isLoading:!0,children:"Submit"}},s={args:{isLoading:!0,loadingText:"Processing...",children:"Pay Now"}},a={args:{isLoading:!1,children:"Listen Now"}},n={args:{isLoading:!0,loadingText:"Opening...",children:"Listen Now"}},o={args:{isLoading:!1,children:"$5 Tip"}},i={args:{isLoading:!0,loadingText:"Processing…",children:"$5 Tip"}},t={args:{isLoading:!0,spinnerSize:"xs",children:"Save"}},c={args:{isLoading:!0,spinnerSize:"lg",loadingText:"Please wait...",children:"Submit Order"}},d={args:{isLoading:!0,children:"Save Draft"}},g={args:{isLoading:!0,children:"Cancel Order"}},l={args:{children:"Disabled Button"}},u={args:{isLoading:!0,children:"This should show loading"}},p={render:function(){const[m,L]=te.useState(!1),ie=()=>{L(!0),setTimeout(()=>L(!1),2e3)};return h.jsx("div",{onClick:ie,children:h.jsx(oe,{isLoading:m,loadingText:"Processing...",children:m?"Processing...":"Click to test"})})}};var S,T,x;e.parameters={...e.parameters,docs:{...(S=e.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    children: 'Click me'
  }
}`,...(x=(T=e.parameters)==null?void 0:T.docs)==null?void 0:x.source}}};var f,w,D;r.parameters={...r.parameters,docs:{...(f=r.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    isLoading: true,
    children: 'Submit'
  }
}`,...(D=(w=r.parameters)==null?void 0:w.docs)==null?void 0:D.source}}};var C,B,P;s.parameters={...s.parameters,docs:{...(C=s.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    isLoading: true,
    loadingText: 'Processing...',
    children: 'Pay Now'
  }
}`,...(P=(B=s.parameters)==null?void 0:B.docs)==null?void 0:P.source}}};var b,v,N;a.parameters={...a.parameters,docs:{...(b=a.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    isLoading: false,
    children: 'Listen Now'
  }
}`,...(N=(v=a.parameters)==null?void 0:v.docs)==null?void 0:N.source}}};var k,O,y;n.parameters={...n.parameters,docs:{...(k=n.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    isLoading: true,
    loadingText: 'Opening...',
    children: 'Listen Now'
  }
}`,...(y=(O=n.parameters)==null?void 0:O.docs)==null?void 0:y.source}}};var I,R,z;o.parameters={...o.parameters,docs:{...(I=o.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    isLoading: false,
    children: '$5 Tip'
  }
}`,...(z=(R=o.parameters)==null?void 0:R.docs)==null?void 0:z.source}}};var j,V,$;i.parameters={...i.parameters,docs:{...(j=i.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    isLoading: true,
    loadingText: 'Processing…',
    children: '$5 Tip'
  }
}`,...($=(V=i.parameters)==null?void 0:V.docs)==null?void 0:$.source}}};var E,_,M;t.parameters={...t.parameters,docs:{...(E=t.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    isLoading: true,
    spinnerSize: 'xs',
    children: 'Save'
  }
}`,...(M=(_=t.parameters)==null?void 0:_.docs)==null?void 0:M.source}}};var q,A,F;c.parameters={...c.parameters,docs:{...(q=c.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    isLoading: true,
    spinnerSize: 'lg',
    loadingText: 'Please wait...',
    children: 'Submit Order'
  }
}`,...(F=(A=c.parameters)==null?void 0:A.docs)==null?void 0:F.source}}};var G,H,J;d.parameters={...d.parameters,docs:{...(G=d.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    isLoading: true,
    children: 'Save Draft'
  }
}`,...(J=(H=d.parameters)==null?void 0:H.docs)==null?void 0:J.source}}};var K,Q,U;g.parameters={...g.parameters,docs:{...(K=g.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    isLoading: true,
    children: 'Cancel Order'
  }
}`,...(U=(Q=g.parameters)==null?void 0:Q.docs)==null?void 0:U.source}}};var W,X,Y;l.parameters={...l.parameters,docs:{...(W=l.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    children: 'Disabled Button'
  }
}`,...(Y=(X=l.parameters)==null?void 0:X.docs)==null?void 0:Y.source}}};var Z,ee,re;u.parameters={...u.parameters,docs:{...(Z=u.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  args: {
    isLoading: true,
    children: 'This should show loading'
  }
}`,...(re=(ee=u.parameters)==null?void 0:ee.docs)==null?void 0:re.source}}};var se,ae,ne;p.parameters={...p.parameters,docs:{...(se=p.parameters)==null?void 0:se.docs,source:{originalSource:`{
  render: function InteractiveDemoRender() {
    const [isLoading, setIsLoading] = React.useState(false);
    const handleClick = () => {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 2000);
    };
    return <div onClick={handleClick}>
        <LoadingButton isLoading={isLoading} loadingText="Processing...">
          {isLoading ? 'Processing...' : 'Click to test'}
        </LoadingButton>
      </div>;
  }
}`,...(ne=(ae=p.parameters)==null?void 0:ae.docs)==null?void 0:ne.source}}};const xe=["Default","Loading","CustomLoadingText","ListenNowButton","ListenNowLoading","TipButton","TipButtonLoading","SmallSpinner","LargeSpinner","SecondaryVariant","OutlineVariant","Disabled","LoadingDisabled","InteractiveDemo"];export{s as CustomLoadingText,e as Default,l as Disabled,p as InteractiveDemo,c as LargeSpinner,a as ListenNowButton,n as ListenNowLoading,r as Loading,u as LoadingDisabled,g as OutlineVariant,d as SecondaryVariant,t as SmallSpinner,o as TipButton,i as TipButtonLoading,xe as __namedExportsOrder,Te as default};
