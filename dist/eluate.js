(()=>{function b(t={}){let e={$text:[],$show:[],$model:[],$get(o){let r=Object.keys(t).map(i=>`globalThis.${i} = this.${i}`).join(";");return new Function(`${r};
return ${o}`).call(t)},$set(o,r){let i=JSON.stringify(r);new Function(`return this.${o} = ${i}`).call(t),this.$text.forEach(({element:s,value:c})=>{s.innerHTML=n.$get(c)}),this.$show.forEach(({element:s,value:c})=>{s.style.display=n.$get(c)?"":"none"}),this.$model.forEach(({updateFn:s})=>{s()})}},n=new Proxy(t,{get(o,r){if(r.startsWith("$")){let i=e[r];if(!i)throw new Error(`unknown special property '${r}'`);return i}return e.$get(r)},set(o,r,i){if(r.startsWith("$"))return"can't set special property";e.$set(r,i)}});return n}var d=b;function g(t,e,n){n.$text.push({element:t,value:e}),t.innerHTML=n.$get(e)}var a=g;function x(t,e,n,o){let r=new Function("$event",n).bind(o);e.addEventListener(t,r)}var f=x;function m(t,e,n){n.$show.push({element:t,value:e}),t.style.display=n.$get(e)?"":"none"}var u=m;function j(t,e,n){let o=function(){t.value=n.$get(e)};n.$model.push({updateFn:o}),o(),t.addEventListener("input",r=>{n.$set(e,r.target.value)})}var h=j;function l(t,e){let n={proxy:e,element:t,children:[]};return Object.entries(t.dataset).forEach(([o,r])=>{if(o==="text")a(t,r,e),delete t.dataset[o];else if(o.startsWith("on:")){let[,i]=o.split(":");f(i,t,r,e),delete t.dataset[o]}else if(o==="show")u(t,r,e),delete t.dataset[o];else if(o==="model")h(t,r,e),delete t.dataset[o];else if(o==="set")throw new Error("`data-set` cannot be inside another `data-set`")}),[...t.children].forEach(o=>{let r=l(o,e);n.children.push(r)}),n}var $=l;function v(t,e){e===""&&(e="{}");let n=new Function(`return ${e};`)();if(n.constructor!==Object)throw new Error("`data-set` value must be an object");let o={proxy:d(n),element:t,children:[]},r=d(n);return[...t.children].forEach(i=>{let s=$(i,r);o.children.push(s)}),o}var p=v;function w(t){t.dataset.set?p(t,t.dataset.set):[...t.children].forEach(e=>{w(e)}),delete t.dataset.set}var E=w;E(document.body);})();
//# sourceMappingURL=eluate.js.map
