import{L as o}from"./index.a87e8af4.js";import{a as e,a9 as t,Y as r,j as s,Z as a,b_ as n,N as i,R as d,U as l,a5 as u,c,ad as f}from"./index.1c466c1d.js";import"./vnode.de835e08.js";import"./index.29336b8a.js";import"./vendor.099cff95.js";var p=e({name:"LayoutFooter",components:{AFooter:o.Footer},setup(){const{getPrefixCls:o}=t(),{currentRoute:e}=r(),i=s((()=>{var o;return a(n)&&!(null==(o=a(e).meta)?void 0:o.hiddenFooter)}));return{prefixCls:o("layout-footer"),getShowLayoutFooter:i}}});const m=c("div",null,"Copyright ©2020 Admin",-1);p.render=function(o,e,t,r,s,a){const n=i("AFooter");return o.getShowLayoutFooter?(d(),l(n,{key:0,class:o.prefixCls},{default:u((()=>[c("div",{class:`${o.prefixCls}__links`},[m],2)])),_:1},8,["class"])):f("",!0)};export default p;