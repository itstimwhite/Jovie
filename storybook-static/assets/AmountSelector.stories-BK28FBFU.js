import{j as c}from"./jsx-runtime-nlD-EgCR.js";import{r as L}from"./iframe-BD9qcwu-.js";import{A as D}from"./AmountSelector-BOPPODdb.js";import"./preload-helper-Dp1pzeXC.js";import"./utils-C1Vhx1Sh.js";import"./clsx-B-dksMZM.js";const z={title:"Atoms/AmountSelector",component:D,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{amount:{control:{type:"number",min:1,max:100}},isSelected:{control:{type:"boolean"}}}},r={args:{amount:5,isSelected:!1,onClick:()=>{}}},t={args:{amount:10,isSelected:!0,onClick:()=>{}}},a={args:{amount:3,isSelected:!1,onClick:()=>{}}},s={args:{amount:25,isSelected:!1,onClick:()=>{}}},n={render:function(){const[E,R]=L.useState(5),w=[3,5,10];return c.jsx("div",{className:"grid grid-cols-3 gap-3 w-64",children:w.map(e=>c.jsx(D,{amount:e,isSelected:E===e,onClick:()=>R(e)},e))})}},o={args:{amount:7,isSelected:!0,onClick:()=>{}},parameters:{backgrounds:{default:"dark"}}};var m,l,d;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    amount: 5,
    isSelected: false,
    onClick: () => {}
  }
}`,...(d=(l=r.parameters)==null?void 0:l.docs)==null?void 0:d.source}}};var u,i,p;t.parameters={...t.parameters,docs:{...(u=t.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    amount: 10,
    isSelected: true,
    onClick: () => {}
  }
}`,...(p=(i=t.parameters)==null?void 0:i.docs)==null?void 0:p.source}}};var S,g,k;a.parameters={...a.parameters,docs:{...(S=a.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    amount: 3,
    isSelected: false,
    onClick: () => {}
  }
}`,...(k=(g=a.parameters)==null?void 0:g.docs)==null?void 0:k.source}}};var f,C,A;s.parameters={...s.parameters,docs:{...(f=s.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    amount: 25,
    isSelected: false,
    onClick: () => {}
  }
}`,...(A=(C=s.parameters)==null?void 0:C.docs)==null?void 0:A.source}}};var x,v,I;n.parameters={...n.parameters,docs:{...(x=n.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: function InteractiveRender() {
    const [selected, setSelected] = useState(5);
    const amounts = [3, 5, 10];
    return <div className="grid grid-cols-3 gap-3 w-64">
        {amounts.map(amount => <AmountSelector key={amount} amount={amount} isSelected={selected === amount} onClick={() => setSelected(amount)} />)}
      </div>;
  }
}`,...(I=(v=n.parameters)==null?void 0:v.docs)==null?void 0:I.source}}};var y,b,j;o.parameters={...o.parameters,docs:{...(y=o.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    amount: 7,
    isSelected: true,
    onClick: () => {}
  },
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  }
}`,...(j=(b=o.parameters)==null?void 0:b.docs)==null?void 0:j.source}}};const B=["Default","Selected","SmallAmount","LargeAmount","Interactive","InDarkMode"];export{r as Default,o as InDarkMode,n as Interactive,s as LargeAmount,t as Selected,a as SmallAmount,B as __namedExportsOrder,z as default};
