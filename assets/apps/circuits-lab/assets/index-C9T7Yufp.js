var nf=Object.defineProperty;var rf=(n,e,t)=>e in n?nf(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var Ra=(n,e,t)=>rf(n,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();const An={thevenin:{number:"05",short:"Equivalent circuits",title:"Thévenin and Norton",name:"Thévenin & Norton",topic:"Thévenin, Norton & maximum power transfer",description:"Compare load voltage, current and power.",purpose:"Build equivalent circuits, verify the same load behaviour, and find maximum load power.",steps:["Wire the original network. Measure load voltage, current and power at 250, 500 and 1000 Ω.","Switch to Thévenin and Norton. Set their source and resistance values, then wire each equivalent.","Repeat the same loads. Compare all three circuits using your paper measurements.","Vary the load and inspect the calculated power sweep. Find the load that receives maximum power."],challenge:"Wire the original circuit and its Thévenin and Norton equivalents. Compare readings at 250, 500 and 1000 Ω, then vary the load to find maximum power. Write your results on paper.",principle:"Equivalent circuits preserve voltage and current at the load terminals. Their internal behaviour can differ.",defaults:{representation:"original",load:500,equivalentVoltage:6,equivalentResistance:500,nortonCurrent:12}},superposition:{number:"06",short:"Source contributions",title:"Superposition",name:"Superposition",topic:"Superposition in linear DC circuits",description:"Measure each source’s contribution.",purpose:"Add signed source contributions and explain how two active sources can cancel one branch current.",steps:["Wire the network with A at +6 V and B at −3 V. Read the branch current with both sources active.","Select A alone, then B alone. Replace each inactive ideal voltage source with a short.","Compare the signed contributions with the complete circuit. Add currents on paper, not powers.","Keep both sources active and adjust B until branch current is zero. Check which other branches still carry current."],challenge:"Compare A alone, B alone and both at +6 V / −3 V. Short each inactive voltage source. Adjust source B until the branch current is zero, then compare the signed contributions. Write your explanation on paper.",principle:"Add signed voltage or current contributions. Power must be calculated from the combined result.",defaults:{v1:6,v2:3,sourceMode:"both",replacement:"short",sumMilliamp:null,explanation:"unset"}},opamp:{number:"07",short:"Gain & clipping",title:"Operational amplifiers",name:"Operational amplifiers",topic:"Closed-loop gain & output clipping",description:"Set the gain and check for clipping.",purpose:"Design a gain with resistors, then find the largest input before output clipping.",steps:["Choose the amplifier circuit assigned in your lab sheet. For this example, start with the inverting circuit.","For a first design, use the inverting circuit at gain −3. Set Rin and Rf, wire feedback, and connect both supplies.","Connect CH1 to input and CH2 to output, with both grounds at GND. Set a readable timebase and voltage scales.","Increase input amplitude until clipping begins. Change the supplies or signal frequency and compare the traces."],challenge:"At ±12 V and 100 Hz, build an inverting amplifier with gain −3. Connect CH1 to Vin and CH2 to Vout, with both grounds at GND. Increase the input until clipping appears. Put measurements and calculations on paper.",principle:"Negative feedback sets the gain only while the amplifier operates within its limits.",defaults:{configuration:"inverting",rin:1e4,rf:2e4,amplitude:1,rail:12,frequency:100,prediction:0,timeDiv:2,ch1Scale:1,ch2Scale:5,triggerEdge:"rising",triggerLevel:0,scopeRunning:!0,scopeGroundChannel:"ch1"}},transient:{number:"08",short:"Energy & time",title:"RC and RL response",name:"RC & RL transients",topic:"First-order RC & RL transient response",description:"Measure charging and decay.",purpose:"Predict how resistance changes response speed, then test both RC and RL circuits.",steps:["Wire RC. On paper, predict whether increasing R makes the response faster or slower.","Run from zero energy. Watch voltage, current and stored energy; pause, slow, replay or drag through the acquired trace.","Increase R and repeat from zero energy. Use the same playback speed and compare the time to reach the same fraction of the final value.","Repeat with RL, then switch each circuit to Return to observe decay. Compare both trends with your predictions."],challenge:"Wire the RC and RL circuits. Run charging and decay, compare voltage and current, and change R to see its effect on response time. Use pause, replay and the time cursor. Put predictions and measurements on paper.",principle:"Capacitor voltage and inductor current remain continuous through switching in these ideal circuits.",defaults:{kind:"RC",resistance:1e3,capacitance:1e-4,inductance:.1,charging:!0,initial:0,time:0,acquiredTime:0,playing:!1,speed:1,predictionChoice:"unset"}}},Dt=(n,e,t,i)=>({id:n,label:e,x:t,z:i}),kn=(n,e,t,i,r,s,o)=>({id:n,label:e,type:t,value:i,x:r,z:s,pins:o}),Ms=()=>kn("ground","GND","ground","0 V",-.7,.69,[Dt("gnd","GND",-.7,.61)]),Ss=(n,e,t,i,r)=>kn(n,e,"V",t,i,r,[Dt(`${n}+`,"+",i,r-.22),Dt(`${n}-`,"−",i,r+.22)]),Es=(n,e,t,i,r)=>kn(n,e,"R",t,i,r,[Dt(`${n}a`,"A",i-.29,r),Dt(`${n}b`,"B",i+.29,r)]),Ur=(n,e,t,i,r)=>kn(n,e,"R",t,i,r,[Dt(`${n}a`,"+",i,r-.26),Dt(`${n}b`,"−",i,r+.26)]),fi=(n,e)=>({id:n,type:"R",a:`${n}a`,b:`${n}b`,value:e}),fo=(n,e)=>({id:n,type:"V",a:`${n}+`,b:`${n}-`,value:e});function ul(n,e){let t,i,r=[],s,o;if(n==="thevenin"&&(e.representation==="original"?(t=[Ss("s","DC SOURCE","12 V",-1.14,-.03),Es("r1","R₁","1 kΩ",-.36,-.46),Ur("r2","R₂","1 kΩ",.23,.08),Ur("load","LOAD",`${e.load} Ω`,1.1,.08),Ms()],i=[["s+","r1a"],["r1b","r2a"],["r2a","loada"],["r2b","gnd"],["loadb","gnd"],["s-","gnd"]],r=[fo("s",12),fi("r1",1e3),fi("r2",1e3),fi("load",e.load)]):e.representation==="thevenin"?(t=[Ss("s","Vth",`${e.equivalentVoltage} V`,-1,-.02),Es("req","Rth",`${e.equivalentResistance} Ω`,0,-.46),Ur("load","LOAD",`${e.load} Ω`,1,.02),Ms()],i=[["s+","reqa"],["reqb","loada"],["loadb","gnd"],["s-","gnd"]],r=[fo("s",e.equivalentVoltage),fi("req",e.equivalentResistance),fi("load",e.load)]):(t=[kn("s","In ↑","I",`${e.nortonCurrent} mA`,-1,-.02,[Dt("s+","OUT",-1,-.28),Dt("s-","IN",-1,.24)]),Ur("req","Rn",`${e.equivalentResistance} Ω`,0,.02),Ur("load","LOAD",`${e.load} Ω`,1,.02),Ms()],i=[["s+","reqa"],["reqa","loada"],["reqb","gnd"],["loadb","gnd"],["s-","gnd"]],r=[{id:"s",type:"I",a:"s-",b:"s+",value:e.nortonCurrent/1e3},fi("req",e.equivalentResistance),fi("load",e.load)]),s="loada",o="load"),n==="superposition"){const a=e.sourceMode!=="b",c=e.sourceMode!=="a";t=[Ss("a","SOURCE A",a?`+${e.v1} V`:e.replacement==="short"?"0 V · SHORT":"OPEN",-1.18,-.08),Ss("b","SOURCE B",c?`−${e.v2} V`:e.replacement==="short"?"0 V · SHORT":"OPEN",1.18,-.08),Es("r1","R₁","1 kΩ",-.51,-.55),Es("r2","R₂","1 kΩ",.51,-.55),Ur("load","BRANCH","1 kΩ",0,.17),Ms()],i=[["a+","r1a"],["r1b","loada"],["r2a","loada"],["r2b","b+"],["a-","gnd"],["b-","gnd"],["loadb","gnd"]],r=[fi("r1",1e3),fi("r2",1e3),fi("load",1e3)],(a||e.replacement==="short")&&r.push(fo("a",a?e.v1:0)),(c||e.replacement==="short")&&r.push(fo("b",c?-e.v2:0)),s="loada",o="load"}return n==="opamp"&&(t=[{...kn("signal","INPUT","V",`${e.amplitude} Vpk`,-1.38,-.15,[Dt("signal+","+",-1.38,-.35),Dt("signal-","−",-1.38,.06)]),benchPosition:[-2.14,.19]},kn("rin","Rin","R",`${e.rin/1e3} kΩ`,-.72,.3,[Dt("rina","A",-1.14,.3),Dt("rinb","B",-.3,.3)]),kn("op","OP AMP","opamp",`±${e.rail} V`,0,-.35,[Dt("op+","+",-.32,-.12),Dt("op-","−",-.32,-.42),Dt("out","OUT",.53,-.22),Dt("vp","V+",.24,-.72),Dt("vn","V−",.24,-.02)]),kn("rf","Rf","R",`${e.rf/1e3} kΩ`,.7,.3,[Dt("rfa","A",.28,.3),Dt("rfb","B",1.12,.3)]),{...kn("plus","+ SUPPLY","V",`${e.rail} V`,1.38,-.56,[Dt("plus+","+",1.38,-.72),Dt("plus-","−",1.38,-.39)]),benchPosition:[2.15,-.67]},{...kn("minus","− SUPPLY","V",`${e.rail} V`,1.38,.215,[Dt("minus+","+",1.38,.05),Dt("minus-","−",1.38,.38)]),benchPosition:[2.15,.3]},kn("ground","GND","ground","0 V",-.7,.79,[Dt("gnd","GND",-1.1,.79)])],i=[["signal-","gnd"],["rfb","out"],["rfa","op-"],["rinb","op-"],["plus+","vp"],["plus-","gnd"],["minus+","gnd"],["minus-","vn"]],i.push(...e.configuration==="inverting"?[["signal+","rina"],["op+","gnd"]]:[["signal+","op+"],["rina","gnd"]]),s="out"),n==="transient"&&(t=[Ss("s","DC SOURCE","5 V",-1.19,.06),kn("sw","SPDT SWITCH","switch",e.charging?"SOURCE":"RETURN",-.62,-.39,[Dt("supply","5 V",-.83,-.58),Dt("common","COM",-.36,-.39),Dt("return","0 V",-.75,-.18)]),Es("r","RESISTOR",`${e.resistance} Ω`,.2,-.46),kn("storage",e.kind==="RC"?"CAPACITOR":"INDUCTOR",e.kind==="RC"?"C":"L",e.kind==="RC"?"100 μF":"100 mH",1.03,.1,[Dt("storagea","+",1.03,-.17),Dt("storageb","−",1.03,.37)]),Ms()],i=[["s+","supply"],["s-","gnd"],["return","gnd"],["common","ra"],["rb","storagea"],["storageb","gnd"]],s="storagea"),{components:t,wires:i,electrical:r,positive:s,negative:"gnd",sensor:o,pins:t.flatMap(a=>a.pins.map(c=>({...c,name:`${a.label} ${c.label}`})))}}function Bs(n,e){const t=Object.fromEntries(e.map(r=>[typeof r=="string"?r:r.id,typeof r=="string"?r:r.id])),i=r=>t[r]===r||t[r]===void 0?r:t[r]=i(t[r]);for(const[r,s]of n)r in t&&s in t&&(t[i(r)]=i(s));return Object.fromEntries(Object.keys(t).map(r=>[r,i(r)]))}function sf(n,e){const t=Bs(n.wires,n.pins),i=Bs(e,n.pins);return n.pins.every(r=>n.pins.every(s=>t[r.id]===t[s.id]==(i[r.id]===i[s.id])))}const zt={load:[100,250,500,750,1e3,1500,2e3],equivalentVoltage:[2,3,4,5,6,7,8,9,10,12],equivalentResistance:[100,250,500,750,1e3,1500,2e3],nortonCurrent:[4,6,8,10,12,14,16,18,20],v1:[0,1,2,3,4,5,6,7,8,9,10,11,12],v2:[0,1,2,3,4,5,6,7,8,9,10,11,12],rin:[5e3,1e4,2e4],rf:[1e4,2e4,3e4,4e4,5e4,1e5],rail:[5,9,12,15],frequency:[10,50,100,500,1e3],amplitude:[.25,.5,1,2,3,3.5,3.6,3.7,4,5,6],prediction:Array.from({length:101},(n,e)=>e/10),resistance:[100,200,250,500,1e3,2e3,5e3,1e4],speed:[.25,.5,1,2],sumMilliamp:Array.from({length:161},(n,e)=>(e-80)/10),explanation:["unset","opposing","sources-off","whole-circuit-zero"],predictionChoice:["unset","slower","faster","same"],timeDiv:[.02,.05,.1,.2,.4,.5,1,2,4,5,10,20,50],ch1Scale:[.1,.2,.5,1,2,5,10],ch2Scale:[.1,.2,.5,1,2,5,10],triggerLevel:[-10,-5,-2,-1,-.5,0,.5,1,2,5,10],triggerEdge:["rising","falling"]},Vs=(n,e)=>{if(typeof n!="number"||!Number.isFinite(n))throw new RangeError(`${e} must be a finite number.`);return n},Mr=(n,e)=>{if(Vs(n,e),n<=0)throw new RangeError(`${e} must be greater than zero.`);return n},jr=(n,e)=>{if(Vs(n,e),n<0)throw new RangeError(`${e} cannot be negative.`);return n},Hs=n=>Object.is(n,-0)?0:n;function of(n,e){const t=e.length;if(!t)return[];const i=n.map((c,l)=>{const u=Math.max(...c.map(Math.abs));return u?[...c.map(h=>h/u),e[l]/u]:[...c,e[l]]}),r=1e-12;let s=0;const o=[];for(let c=0;c<t&&s<t;c+=1){let l=s;for(let h=s+1;h<t;h+=1)Math.abs(i[h][c])>Math.abs(i[l][c])&&(l=h);if(Math.abs(i[l][c])<=r)continue;[i[s],i[l]]=[i[l],i[s]];const u=i[s][c];for(let h=c;h<=t;h+=1)i[s][h]/=u;for(let h=s+1;h<t;h+=1){const d=i[h][c];for(let f=c;f<=t;f+=1)i[h][f]-=d*i[s][f];i[h][c]=0}o.push(c),s+=1}for(let c=s;c<t;c+=1)if(i[c].slice(0,t).every(l=>Math.abs(l)<=r)&&Math.abs(i[c][t])>1e-9)throw new Error("Inconsistent circuit: check for a shorted voltage source, conflicting ideal voltage sources, or a current source without a return path.");if(s<t)throw new Error("Singular circuit: connect floating nodes to a reference and remove redundant ideal voltage sources. Voltages or source currents are not uniquely determined.");const a=Array(t).fill(0);for(let c=t-1;c>=0;c-=1){const l=o[c];a[l]=i[c][t];for(let u=l+1;u<t;u+=1)a[l]-=i[c][u]*a[u]}if(a.some(c=>!Number.isFinite(c)))throw new Error("Numerical failure: check component values and circuit connections.");for(let c=0;c<t;c+=1){const l=n[c].reduce((h,d,f)=>h+d*a[f],0),u=Math.abs(e[c])+n[c].reduce((h,d,f)=>h+Math.abs(d*a[f]),0);if(Math.abs(l-e[c])>1e-8*Math.max(u,1e-12))throw new Error("Numerically unstable circuit: use a well-conditioned network with a valid reference.")}return a}function hl({components:n=[],wires:e=[]}={}){try{if(!Array.isArray(n)||!n.length)throw new Error("Add at least one component to the circuit.");if(!Array.isArray(e))throw new Error("Wires must be an array of pin pairs.");const t=new Map([["gnd","gnd"]]),i=M=>{if(typeof M!="string"||!M.length)throw new Error("Every terminal must have a nonempty string pin name.");return t.has(M)||t.set(M,M),M},r=M=>{let w=M;for(;t.get(w)!==w;)w=t.get(w);for(;t.get(M)!==M;){const A=t.get(M);t.set(M,w),M=A}return w},s=new Set;let o=!1;for(const M of n){if(!M||typeof M.id!="string"||!M.id.length||s.has(M.id))throw new Error("Each component requires a unique, nonempty id.");if(s.add(M.id),!["R","V","I"].includes(M.type))throw new Error(`Unsupported component type: ${M.type}.`);i(M.a),i(M.b),o||(o=M.a==="gnd"||M.b==="gnd"),Vs(M.value,`${M.id} value`),M.type==="R"&&Mr(M.value,`${M.id} resistance`)}for(const M of e){if(!Array.isArray(M)||M.length!==2)throw new Error("Each wire must contain exactly two pin names.");const w=i(M[0]),A=i(M[1]);o||(o=w==="gnd"||A==="gnd"),t.set(r(w),r(A))}if(!o)throw new Error("Missing reference: connect the circuit common node to 'gnd'.");const a=r("gnd"),c=[...new Set([...t.keys()].map(r))].filter(M=>M!==a),l=new Map(c.map((M,w)=>[M,w])),u=M=>l.get(r(M)),h=n.filter(M=>M.type==="V"),d=new Map(h.map((M,w)=>[M.id,c.length+w])),f=c.length+h.length,g=Array.from({length:f},()=>Array(f).fill(0)),_=Array(f).fill(0),m=(M,w,A)=>{M!==void 0&&w!==void 0&&(g[M][w]+=A)};for(const M of n){const w=u(M.a),A=u(M.b);if(M.type==="R"){const C=1/M.value;if(!Number.isFinite(C))throw new Error("Resistance is outside the supported numerical range.");m(w,w,C),m(A,A,C),m(w,A,-C),m(A,w,-C)}else if(M.type==="I")w!==void 0&&(_[w]-=M.value),A!==void 0&&(_[A]+=M.value);else{const C=d.get(M.id);m(w,C,1),m(A,C,-1),m(C,w,1),m(C,A,-1),_[C]=M.value}}const p=of(g,_),x=M=>r(M)===a?0:Hs(p[u(M)]),b=Object.fromEntries([...t.keys()].map(M=>[M,x(M)])),y=Object.fromEntries(n.map(M=>[M.id,Hs(M.type==="R"?(x(M.a)-x(M.b))/M.value:M.type==="I"?M.value:p[d.get(M.id)])]));return{ok:!0,voltages:b,currents:y,error:null}}catch(t){return{ok:!1,voltages:{},currents:{},error:t.message}}}function af({configuration:n="inverting",rin:e=1e4,rf:t=2e4,amplitude:i=1,rail:r=12,headroom:s=1,frequency:o=100,time:a=0,powered:c=!0,feedback:l=!0}={}){Mr(e,"Input resistance"),jr(t,"Feedback resistance"),jr(i,"Input amplitude"),jr(r,"Supply rail magnitude"),jr(s,"Output headroom"),Mr(o,"Frequency"),jr(a,"Time");let u;if(n==="inverting")u=-t/e;else if(n==="noninverting"||n==="non-inverting")u=1+t/e;else if(n==="follower")u=1;else throw new RangeError("Configuration must be inverting, noninverting, or follower.");const h=i*Math.sin(2*Math.PI*o*a),d=Math.max(0,r-s),f=Math.abs(u)*i,g=n==="inverting"?-1:1;let _=0,m=0,p=!1,x="powered-off";return c&&d>0&&(l?(_=Math.max(-d,Math.min(d,u*h)),m=Math.min(d,f),p=f>d,x=p?"saturated":"linear"):(_=Math.sign(g*h)*d,m=i>0?d:0,p=i>0,x="open-loop")),{gain:u,input:h,output:Hs(_),limit:d,maxInput:l?u===0?1/0:d/Math.abs(u):0,clipped:p,peakOutput:m,modelState:x}}function $n({kind:n="RC",resistance:e=1e3,capacitance:t=1e-4,inductance:i=.1,source:r=5,time:s=0,initial:o=0,charging:a=!0}={}){if(Mr(e,"Resistance"),Vs(r,"Source voltage"),Vs(o,"Initial storage value"),jr(s,"Time"),!["RC","RL"].includes(n))throw new RangeError("Transient kind must be RC or RL.");const c=a?r:0,l=n==="RC"?Mr(t,"Capacitance"):Mr(i,"Inductance"),u=n==="RC"?e*l:l/e;Mr(u,"Time constant");const h=n==="RC"?c:c/e,d=h+(o-h)*Math.exp(-s/u),f=n==="RC"?d:c-e*d,g=n==="RC"?(c-d)/e:d;return{tau:u,voltage:Hs(f),current:Hs(g),energy:.5*l*d*d,final:h,storageValue:d}}const Ht=(n,e=3)=>Number.isFinite(n)?Number(n.toFixed(e)).toLocaleString("en-US",{maximumFractionDigits:e}):"—",dr=(n,e,t=.01)=>Number.isFinite(n)&&Math.abs(n-e)<=Math.max(Math.abs(e)*t,1e-8);function cf(){return{module:"thevenin",mode:"explore",params:Object.fromEntries(Object.entries(An).map(([n,e])=>[n,{...e.defaults}])),wireSets:{},probeSets:{},scopeSets:{},scopeHolds:{},history:{},predictions:{},sumSubmissions:{},tool:"wire",selectedTerminal:null,records:[],attempts:Object.fromEntries(Object.keys(An).map(n=>[n,0])),challengeStarted:{},feedback:"Drag a lead between contacts; place the meter tips to measure.",checks:{},showGuide:!1,sequence:0}}const ct=n=>n.params[n.module];function lf(n){const e=ct(n);return e.representation||e.configuration||e.kind||"main"}const In=n=>`${n.mode}:${n.module}:${lf(n)}`;function Ct(n){const e=ul(n.module,ct(n)),t=In(n);return n.wireSets[t]||(n.wireSets[t]=n.mode==="explore"?e.wires.map(i=>[...i]):[]),n.probeSets[t]||(n.probeSets[t]=n.mode==="explore"?{red:e.positive,black:"gnd"}:{red:null,black:null}),n.scopeSets[t]||(n.scopeSets[t]=fc(n)),{circuit:e,wires:n.wireSets[t],probes:n.probeSets[t],scope:n.scopeSets[t],correct:sf(e,n.wireSets[t])}}const si=n=>structuredClone(n);function fc(n){const e=n.mode==="explore"&&n.module==="opamp";return{ch1:{signal:e?"signal+":null,ground:e?"gnd":null},ch2:{signal:e?"out":null,ground:e?"gnd":null}}}const Gs=new WeakMap,zh=n=>({wires:si(n.wires),probes:si(n.probes),scope:si(n.scope)});function Bh(n,e,t){var i;((i=n.history)[e]||(i[e]=[])).push(t),n.history[e].length>80&&n.history[e].splice(0,n.history[e].length-80)}function uf(n,e){if(e==null)return!1;let t=Gs.get(n);if(t||(t=new Map,Gs.set(n,t)),[...t.values()].some(o=>o.tokens.has(e)))return!1;const i=Ct(n),r=In(n);let s=t.get(r);return s||(s={tokens:new Set,snapshot:zh(i)},t.set(r,s)),s.tokens.add(e),!0}function hf(n,e){const t=Gs.get(n);if(!t)return!1;const i=[...t.entries()].find(([,a])=>a.tokens.has(e));if(!i)return!1;const[r,s]=i;if(s.tokens.delete(e),s.tokens.size||(t.delete(r),t.size||Gs.delete(n),!n.wireSets[r]||!n.probeSets[r]||!n.scopeSets[r]))return!0;const o={wires:n.wireSets[r],probes:n.probeSets[r],scope:n.scopeSets[r]};return JSON.stringify(s.snapshot)!==JSON.stringify(o)&&Bh(n,r,s.snapshot),!0}function os(n){var i;const e=Ct(n),t=In(n);(i=Gs.get(n))!=null&&i.has(t)||Bh(n,t,zh(e))}const oa=(n,e=ct(n).kind)=>`${n.mode}:${n.attempts.transient}:${e}`;function Tn(n,e=ct(n).kind){return n.predictions[oa(n,e)]||{choice:"unset",locked:!1,late:!1,correct:!1,run:0,tested:!1}}function Ii(n){var t;if(n.module!=="transient")return;const e=oa(n);n.predictions[e]={...Tn(n),tested:!0,late:!((t=n.predictions[e])!=null&&t.locked)}}function df(n){if(n.module!=="transient")return!1;const e=ct(n),t=Tn(n);return t.locked?(n.feedback="Prediction already locked for this circuit.",!1):t.late?(n.feedback="The trial has already started. Begin a new attempt to make a prediction first.",!1):["slower","faster","same"].includes(e.predictionChoice)?(n.predictions[oa(n)]={choice:e.predictionChoice,locked:!0,late:!1,tested:!1,run:t.run,correct:e.predictionChoice===(e.kind==="RC"?"slower":"faster"),kind:e.kind,resistance:e.resistance,sequence:++n.sequence},n.feedback="Prediction saved. Now change R and test it.",!0):(n.feedback="Choose slower, faster or unchanged, then lock your prediction.",!1)}const Vh=(n,e,t)=>`${n.mode}:${n.attempts.superposition}:${e}:${t}`;function ff(n,e=n.module){return n.records.filter(t=>t.module===e&&t.mode===n.mode&&t.attempt===n.attempts[e]&&t.measurement.correct&&t.measurement.probesCorrect)}function Hh(n,e=n.params.superposition.v1,t=n.params.superposition.v2){const i=ff(n,"superposition").filter(r=>r.params.v1===e&&r.params.v2===t&&(r.params.sourceMode==="both"||r.params.replacement==="short"));return Object.fromEntries(["a","b","both"].map(r=>[r,i.find(s=>s.params.sourceMode===r)||null]))}function pf(n){if(n.module!=="superposition")return!1;const e=ct(n),t=Hh(n);if(!t.a||!t.b||!t.both)return n.feedback="Record A alone, B alone and both at the same source settings first.",!1;if(!Number.isFinite(e.sumMilliamp))return n.feedback="Enter the signed sum in mA.",!1;const i=(t.a.measurement.current+t.b.measurement.current)*1e3,r=t.both.measurement.current*1e3,s=Math.abs(e.sumMilliamp-i)<=.01&&Math.abs(e.sumMilliamp-r)<=.01;return n.sumSubmissions[Vh(n,e.v1,e.v2)]={answerMilliamp:e.sumMilliamp,sumMilliamp:i,measuredMilliamp:r,passed:s,v1:e.v1,v2:e.v2,recordIds:Object.fromEntries(Object.entries(t).map(([o,a])=>[o,a.id])),sequence:++n.sequence},n.feedback=s?"The signed sum matches the measured current with both sources.":"Check the signs. Add currents, then compare with the both-source reading.",s}function Gh(n){const e=ct(n),{wires:t,correct:i}=Ct(n),r=Object.fromEntries(["a","b","both"].map(a=>{const c=ul("superposition",{...e,sourceMode:a}),l=hl({components:c.electrical,wires:t});if(!l.ok)return[a,{valid:!1,current:null,voltage:null,power:null,error:l.error}];const u=l.voltages[c.positive]-l.voltages.loadb,h=l.currents.load;return[a,{valid:!0,current:h,voltage:u,power:u*h,branchCurrents:{r1:l.currents.r1,r2:l.currents.r2,load:h},error:null}]})),s=Object.values(r).every(a=>a.valid),o=[...new Set(Object.values(r).map(a=>a.error).filter(Boolean))];return i||o.push("Current wiring differs from the circuit diagram."),e.replacement!=="short"&&o.push("Open replacements do not give additive contributions. Select Short."),{live:r,valid:s,topologyCorrect:i,superpositionValid:s&&e.replacement==="short",error:o.join(" ")||null}}function dl(n){const e=ct(n);if(n.module==="superposition"){const t=Hh(n),i=n.sumSubmissions[Vh(n,e.v1,e.v2)]||null;return{kind:"superposition",...Gh(n),recorded:Object.fromEntries(Object.entries(t).map(([r,s])=>[r,s?{id:s.id,current:s.measurement.current,voltage:s.measurement.voltage,power:s.measurement.power}:null])),sumMilliamp:e.sumMilliamp,explanation:e.explanation,sumSubmitted:!!i,submission:i}}return n.module==="transient"?{kind:"transient",prediction:{...Tn(n),choice:Tn(n).locked?Tn(n).choice:e.predictionChoice,expected:Tn(n).tested?e.kind==="RC"?"slower":"faster":null},predictions:{RC:Tn(n,"RC"),RL:Tn(n,"RL")},playback:{speed:e.speed,baselineTau:e.kind==="RC"?.1:.001,secondsPerBaselineTau:2}}:n.module==="opamp"?{kind:"opamp",scope:Fi(n)}:{kind:n.module}}function mf(n,e){const t=n.params.transient;if(n.module!=="transient"||!t.playing||!Number.isFinite(e)||e<=0||!Ct(n).correct)return t.time;Ii(n);const i=t.kind==="RC"?.1:.001;return t.time=Math.min(t.time+e*i*t.speed/2,5*$n({...t,source:5}).tau),t.acquiredTime=Math.max(t.acquiredTime||0,t.time),t.time>=5*$n({...t,source:5}).tau&&(t.playing=!1),t.time}function ou(n,e,t){const i=Bs(e,n.pins),r={};for(const[s,o]of Object.entries(t))for(const[a,c]of Object.entries(i))c===i[s]&&(r[a]=o);return r}function er(n,e){const t=ct(n),{circuit:i,wires:r,probes:s,correct:o}=Ct(n);let a,c={},l,u,h,d,f,g,_,m,p;if(n.module==="thevenin"||n.module==="superposition")a=hl({components:i.electrical,wires:r}),c=a.voltages||{},a.ok&&(l=c[i.positive]-c.loadb,u=a.currents.load,h=l*u);else if(n.module==="opamp")if(!o)a={ok:!1,error:"Connect the amplifier, feedback and both supplies."};else{a={...af({...t,headroom:1,time:e??1/(4*t.frequency)}),ok:!0},{gain:d,maxInput:g}=a,f=a.peakOutput;const w=t.configuration==="inverting"?(a.input/t.rin+a.output/t.rf)/(1/t.rin+1/t.rf):a.output*t.rin/(t.rin+t.rf);c=ou(i,r,{gnd:0,"signal+":a.input,out:a.output,"op-":w,vp:t.rail,vn:-t.rail}),l=a.output}else o?(a={...$n({...t,source:5,time:e??t.time}),ok:!0},{voltage:l,current:u,tau:_,energy:m,storageValue:p}=a,c=ou(i,r,{gnd:0,"s+":5,common:t.charging?5:0,storagea:l})):a={ok:!1,error:"Connect the source, switch, resistor and storage loop."};const x=a.ok&&s.red&&s.black&&Number.isFinite(c[s.red])&&Number.isFinite(c[s.black]),b=x?c[s.red]-c[s.black]:null,y=Bs(r,i.pins),M=!!x&&y[s.red]===y[i.positive]&&y[s.black]===y[i.negative];return{...a,voltage:l,current:u,power:h,gain:d,peak:f,maxInput:g,tau:_,energy:m,storageValue:p,voltages:c,probeVoltage:b,probeReady:x,probesCorrect:M,correct:o}}const au=new WeakMap;function gf(n){const e=ct(n),t=Ct(n);return JSON.stringify({configuration:e.configuration,rin:e.rin,rf:e.rf,amplitude:e.amplitude,rail:e.rail,frequency:e.frequency,timeDiv:e.timeDiv,ch1Scale:e.ch1Scale,ch2Scale:e.ch2Scale,triggerEdge:e.triggerEdge,triggerLevel:e.triggerLevel,wires:t.wires,scope:t.scope})}function Fi(n){if(n.module!=="opamp")return{ok:!1,correct:!1,error:"The scope is available in the amplifier lab.",channels:{},running:!1,stale:!1};const e=ct(n),t=Ct(n),i=gf(n),r=n.scopeHolds[In(n)];if(!e.scopeRunning&&r){const b=r.signature!==i;return{...si(r),running:!1,stale:b,correct:r.correct&&!b,error:b?"Held trace is from different settings. Run the scope to acquire the current circuit.":r.error}}const s=au.get(n);if((s==null?void 0:s.signature)===i)return{...s,running:e.scopeRunning};const o=er(n,0),a=Bs(t.wires,t.circuit.pins),c=Object.fromEntries(["ch1","ch2"].map(b=>{const y=t.scope[b],M=y.signal,w=y.ground,A=!!(o.ok&&M&&w&&Number.isFinite(o.voltages[M])&&Number.isFinite(o.voltages[w])&&a[w]===a.gnd),C=b==="ch1"?"signal+":"out",S=A&&a[M]===a[C],E=o.ok?!M||!w?`${b.toUpperCase()}: connect signal and ground.`:a[w]!==a.gnd?`${b.toUpperCase()} ground must connect to GND.`:Number.isFinite(o.voltages[M])?null:`${b.toUpperCase()}: signal is floating or unavailable.`:o.error;return[b,{signal:M,ground:w,valid:A,correct:S,error:E,scale:e[`${b}Scale`],points:[]}]})),l=(b,y)=>b.voltages[c[y].signal]-b.voltages[c[y].ground],u=1/e.frequency,h={edge:e.triggerEdge,level:e.triggerLevel,found:!1,time:0};if(c.ch1.valid){let b=l(o,"ch1");for(let y=1;y<=200;y++){const M=y*u/200,w=l(er(n,M),"ch1"),A=b<=e.triggerLevel&&w>e.triggerLevel,C=b>=e.triggerLevel&&w<e.triggerLevel;if(e.triggerEdge==="rising"&&A||e.triggerEdge==="falling"&&C){const S=(e.triggerLevel-b)/(w-b);h.found=!0,h.time=(y-1+S)*u/200;break}b=w}}const d=e.timeDiv*10/1e3,f=d>u*20*1.000001,g=Math.max(200,Math.ceil(d/u*64));for(let b=0;!f&&b<=g&&!(!c.ch1.valid&&!c.ch2.valid);b++){const y=b*d/g,M=er(n,y+h.time);for(const w of["ch1","ch2"])c[w].valid&&c[w].points.push([y*1e3,l(M,w)])}for(const b of["ch1","ch2"]){const y=c[b];y.peak=y.points.length?Math.max(...y.points.map(([,M])=>Math.abs(M))):null,y.cropped=y.valid&&y.peak>y.scale*4*1.001}const _=!f&&c.ch1.correct&&c.ch2.correct&&!c.ch1.cropped&&!c.ch2.cropped&&h.found&&d>=u*.999,p=[...new Set(Object.values(c).map(b=>b.error).filter(Boolean))].join(" ")||(f?"Timebase exceeds 20 periods. Reduce ms/div or use Autoscale to avoid undersampling.":h.found?c.ch1.cropped||c.ch2.cropped?"A trace exceeds the display. Increase V/div or use Autoscale.":d<u?"Increase time/div to show a complete period.":null:"Waiting for the selected CH1 trigger crossing."),x={ok:!f&&(c.ch1.valid||c.ch2.valid),correct:_,error:p,channels:c,timeDiv:e.timeDiv,trigger:h,running:e.scopeRunning,stale:!1,signature:i,timebaseTooWide:f,acquisition:{params:si(e),wires:si(t.wires),scope:si(t.scope),sequence:n.sequence},duration:d,clipped:o.clipped,limits:[-e.rail+1,e.rail-1]};return au.set(n,x),x}function as(n,e,t){var s;const i=Ct(n);if(t!==null&&!i.circuit.pins.some(o=>o.id===t)||!["red","black","ch1","ch2","ch1Ground","ch2Ground"].includes(e)||!["red","black"].includes(e)&&n.module!=="opamp")return!1;if(os(n),e==="red"||e==="black")i.probes[e]=t;else{const o=e.startsWith("ch1")?"ch1":"ch2";i.scope[o][e.endsWith("Ground")?"ground":"signal"]=t}const r=((s=i.circuit.pins.find(o=>o.id===t))==null?void 0:s.name)||"disconnected";return n.feedback=`${e==="red"?"Meter V tip":e==="black"?"Meter COM tip":e}: ${r}.`,n.selectedTerminal=null,n.checks[n.module]=null,n.sequence++,!0}function cu(n,e,t,i){const r=Ct(n);if(!Number.isInteger(e)||e<0||e>=r.wires.length||![0,1].includes(t)||i!==null&&!r.circuit.pins.some(c=>c.id===i))return!1;const s=r.wires[e],o=[...s];if(o[t]=i,i!==null&&(i===s[t]||o[0]===o[1]||r.wires.some(([c,l],u)=>u!==e&&(c===o[0]&&l===o[1]||c===o[1]&&l===o[0]))))return!1;os(n),i===null?r.wires.splice(e,1):r.wires[e]=o,n.selectedTerminal=null,n.checks[n.module]=null,n.module==="transient"&&(n.params.transient.playing=!1),n.sequence++;const a=c=>{var l;return((l=r.circuit.pins.find(u=>u.id===c))==null?void 0:l.name)||c};return n.feedback=i===null?`Removed lead from ${a(s[0])} to ${a(s[1])}.`:`Lead connected from ${a(o[0])} to ${a(o[1])}.`,!0}function fl(n,e){if(n.tool!=="remove")return n.feedback="Choose Remove before selecting a lead.",!1;const t=Ct(n);if(!Number.isInteger(e)||e<0||e>=t.wires.length)return!1;os(n);const[i,r]=t.wires.splice(e,1)[0],s=o=>{var a;return((a=t.circuit.pins.find(c=>c.id===o))==null?void 0:a.name)||o};return n.feedback=`Removed ${s(i)} → ${s(r)}.`,n.selectedTerminal=null,n.checks[n.module]=null,n.sequence++,!0}function oi(n,e,t){const i=ct(n),r=["load","equivalentResistance","rin","rf","rail","frequency","resistance","capacitance","inductance","timeDiv","ch1Scale","ch2Scale","speed"],s=["amplitude","v1","v2","time","prediction"];if([...r,...s,"equivalentVoltage","nortonCurrent","triggerLevel","sumMilliamp","initial"].includes(e)&&!(e==="sumMilliamp"&&t===null)&&(!Number.isFinite(t)||r.includes(e)&&t<=0||s.includes(e)&&t<0))return n.feedback=`Enter a valid ${e} value.`,!1;if(e==="predictionChoice"&&n.module==="transient"&&Tn(n).locked)return n.feedback="Prediction is locked. Use Retry prediction to start a fresh comparison.",!1;if(n.module==="transient"&&e==="resistance"&&t!==i.resistance){t!==i.resistance&&Ii(n);const a=$n({...i,source:5});i.initial=a.storageValue,i.time=0,i.acquiredTime=0}return i[e]=t,n.module==="transient"&&e==="time"&&(t>0&&Ii(n),Ct(n).correct&&(i.acquiredTime=Math.max(i.acquiredTime||0,t))),e==="kind"&&(i.resistance=t==="RC"?1e3:100,i.initial=0,i.time=0,i.acquiredTime=0,i.playing=!1,i.charging=!0,i.predictionChoice=Tn(n,t).choice),["representation","configuration","kind"].includes(e)&&(n.selectedTerminal=null,Ct(n)),n.checks[n.module]=null,n.sequence++,!0}function vf(n,e){An[e]&&(n.params.transient.playing=!1,n.module=e,n.selectedTerminal=null,n.tool="wire",n.mode==="challenge"&&pl(n),Ct(n),n.feedback=An[e].principle,n.sequence++)}function _f(n,e){n.mode=e,n.selectedTerminal=null,n.tool="wire",n.params.transient.playing=!1,e==="challenge"&&pl(n),Ct(n),n.feedback=e!=="explore"?"Connect the circuit with patch leads, then place the probes. Use the circuit diagram as a guide.":"Explore the connected circuit. Change a setting and observe the result.",n.sequence++}function pl(n){n.challengeStarted[n.module]||(n.challengeStarted[n.module]=!0,n.params[n.module]={...An[n.module].defaults},n.module==="thevenin"&&Object.assign(n.params.thevenin,{equivalentVoltage:4,equivalentResistance:750,nortonCurrent:8}))}function Ns(n,e){var r;const{circuit:t,wires:i}=Ct(n);if(t.pins.some(s=>s.id===e)){if(["red","black","ch1","ch2"].includes(n.tool)){as(n,n.tool,e);return}if(n.tool==="scopeGround"){as(n,`${ct(n).scopeGroundChannel||"ch1"}Ground`,e);return}if(n.tool==="remove"){n.feedback="Select a lead to remove it.";return}if(n.tool==="select"){n.selectedTerminal=e,n.feedback=t.pins.find(s=>s.id===e).name;return}if(!n.selectedTerminal)n.selectedTerminal=e,n.feedback=`${t.pins.find(s=>s.id===e).name} selected. Choose the other terminal.`;else{const s=n.selectedTerminal;n.selectedTerminal!==e&&!i.some(([o,a])=>o===e&&a===n.selectedTerminal||o===n.selectedTerminal&&a===e)&&(os(n),i.push([n.selectedTerminal,e])),n.selectedTerminal=null,n.feedback=s===e?"Connection cancelled.":`${(r=t.pins.find(o=>o.id===s))==null?void 0:r.name} → ${t.pins.find(o=>o.id===e).name}.`}n.checks[n.module]=null,n.sequence++}}function xf(n){n.module==="transient"&&Ii(n);const e=er(n),t=ct(n);if(!e.ok)return n.feedback=e.error||"Complete a valid circuit before recording.",!1;const i=n.module==="opamp"?Fi(n):null;return n.module==="opamp"&&!i.ok?(n.feedback=i.error||"Connect the scope signals and grounds first.",!1):n.module!=="opamp"&&!e.probeReady?(n.feedback="Connect both voltage probes before recording a measurement.",!1):(n.records.unshift({id:++n.sequence,module:n.module,mode:n.mode,attempt:n.attempts[n.module],when:new Date().toISOString(),params:JSON.parse(JSON.stringify(t)),measurement:JSON.parse(JSON.stringify(e)),wires:Ct(n).wires.map(r=>[...r]),probes:{...Ct(n).probes},scope:i?si(i):null,prediction:n.module==="transient"?si(Tn(n)):null,activity:n.module==="superposition"||n.module==="transient"?si(dl(n)):null}),n.feedback=`Reading ${n.records.length} saved to your notebook${i?i.correct?"":`. ${i.error||"Check CH1 at Vin and CH2 at Vout, with both grounds at GND"}`:e.probesCorrect?"":". Check the probe locations: these are not across the requested output"}.`,!0)}function yf(n){const e=er(n),t=ct(n),i=n.records.filter(o=>{var a;return o.module===n.module&&o.mode==="challenge"&&o.attempt===n.attempts[n.module]&&o.measurement.correct&&(n.module==="opamp"?((a=o.scope)==null?void 0:a.correct)&&!o.scope.stale:o.measurement.probesCorrect)});let r=[];if(n.module==="thevenin"){for(const o of["original","thevenin","norton"])r.push({label:`${o==="original"?"Original":o==="thevenin"?"Thévenin":"Norton"} verified at 250, 500 and 1000 Ω`,pass:[250,500,1e3].every(a=>i.some(c=>c.params.representation===o&&c.params.load===a&&dr(c.measurement.voltage,6*a/(500+a))))});r.push({label:"Maximum power verified at 500 Ω (18 mW)",pass:i.some(o=>o.params.load===500&&dr(o.measurement.power,.018))&&t.load===500&&e.correct&&dr(e.power,.018)})}else if(n.module==="superposition"){for(const c of["both","a","b"])r.push({label:`Baseline recorded: ${c==="both"?"both sources":c==="a"?"A alone, B shorted":"B alone, A shorted"}`,pass:i.some(l=>l.params.v1===6&&l.params.v2===3&&l.params.sourceMode===c&&(c==="both"||l.params.replacement==="short")&&dr(l.measurement.current,c==="both"?.001:c==="a"?.002:-.001))});r.push({label:"Both nonzero sources active with zero branch current",pass:i.some(c=>c.params.sourceMode==="both"&&c.params.v1>0&&c.params.v2>0&&Math.abs(c.measurement.current)<1e-7)});const o=n.sumSubmissions[`challenge:${n.attempts.superposition}:6:3`];r.push({label:"Submitted the signed sum of measured A and B currents at +6 V / −3 V",pass:!!(o!=null&&o.passed)});const a=i.find(c=>c.params.sourceMode==="both"&&c.params.v1>0&&c.params.v2>0&&Math.abs(c.measurement.current)<1e-7&&["a","b"].every(l=>i.some(u=>u.params.sourceMode===l&&u.params.replacement==="short"&&u.params.v1===c.params.v1&&u.params.v2===c.params.v2)));r.push({label:"Cancellation verified with each source's signed contribution",pass:!!a}),r.push({label:"Explained cancellation: equal and opposite branch contributions; current can flow elsewhere",pass:!!a&&t.explanation==="opposing"})}else if(n.module==="opamp"){const o=i.filter(a=>a.params.configuration==="inverting"&&a.params.rail===12&&a.params.frequency===100&&dr(a.measurement.gain,-3));r=[{label:"Gain −3 at ±12 V and 100 Hz with correct wiring",pass:e.correct&&t.configuration==="inverting"&&t.rail===12&&t.frequency===100&&dr(e.gain,-3)},{label:"Recorded an unclipped waveform at the target settings",pass:o.some(a=>!a.measurement.clipped)},{label:"Recorded a clipped waveform at the target settings",pass:o.some(a=>a.measurement.clipped)},{label:"Predicted the maximum input within 0.1 V of 11/3 Vpk",pass:Math.abs(t.prediction-11/3)<=.1},{label:"Scope channels measure Vin and Vout with grounded references",pass:Fi(n).channels.ch1.correct&&Fi(n).channels.ch2.correct}]}else{for(const o of["RC","RL"])for(const[a,c]of[["baseline",o==="RC"?1e3:100],["half time constant",o==="RC"?500:200]])r.push({label:`${o}: ${a}, measured at one τ`,pass:i.some(l=>{var u;return l.params.kind===o&&l.params.resistance===c&&l.params.charging&&Math.abs(l.params.initial)<1e-9&&((u=l.prediction)==null?void 0:u.locked)&&!l.prediction.late&&l.prediction.run===Tn(n,o).run&&l.prediction.sequence<l.id&&dr(l.params.time,l.measurement.tau,.02)})});for(const o of["RC","RL"])r.push({label:`${o}: predicted the effect of increasing R before testing`,pass:Tn(n,o).locked&&!Tn(n,o).late&&Tn(n,o).correct})}n.checks[n.module]=r;const s=r.filter(o=>o.pass).length;return n.feedback=s===r.length?"All checks passed. Add your explanation to the exported notebook for instructor review.":`${s} of ${r.length} checks passed. Review the remaining items below.`,r}function Wh(n,e){var t;if(e.startsWith("scrub:")&&n.module==="transient"){const i=Number(e.slice(6));if(!Number.isFinite(i)||!Ct(n).correct)return!1;const r=ct(n);return r.time=Math.max(0,Math.min(i/1e3,r.acquiredTime||0)),r.playing=!1,n.sequence++,n.feedback=`Trace cursor at ${Ht(r.time*1e3)} ms. Run to continue the response.`,!0}if(e.startsWith("probe:")){const[,i,r]=e.split(":");return as(n,i,r||null)}if(e.startsWith("remove-wire:"))return fl(n,Number(e.split(":")[1]));if(e.startsWith("scope-ground:")){const i=e.split(":")[1];n.module==="opamp"&&["ch1","ch2"].includes(i)&&(ct(n).scopeGroundChannel=i,n.tool="scopeGround",n.selectedTerminal=null,n.feedback=`Place ${i.toUpperCase()} ground at GND.`);return}if(e==="cancel"){n.selectedTerminal=null,n.feedback="Selection cancelled.";return}if(e==="undo"){const i=(t=n.history[In(n)])==null?void 0:t.pop();if(!i){n.feedback="No wiring or probe change to undo.";return}n.wireSets[In(n)]=i.wires,n.probeSets[In(n)]=i.probes,n.scopeSets[In(n)]=i.scope,n.selectedTerminal=null,n.checks[n.module]=null,n.sequence++,n.feedback="Last wiring or probe change undone.";return}if(e==="submit-sum")return pf(n);if(e==="lock-prediction")return df(n);if(e==="restart-prediction"&&n.module==="transient"){const i=ct(n),r=Tn(n).run+1;n.predictions[oa(n)]={choice:"unset",locked:!1,late:!1,tested:!1,correct:!1,run:r},Object.assign(i,{resistance:i.kind==="RC"?1e3:100,time:0,initial:0,acquiredTime:0,charging:!0,playing:!1,predictionChoice:"unset"}),n.checks.transient=null,n.sequence++,n.feedback="New prediction for this circuit. Earlier readings stay in the notebook but do not count for this comparison.";return}if(e==="scope-toggle"&&n.module==="opamp"){const i=ct(n);i.scopeRunning&&(n.scopeHolds[In(n)]=si(Fi(n))),i.scopeRunning=!i.scopeRunning,n.sequence++,n.feedback=i.scopeRunning?"Scope running.":"Scope held. Measurements retain their acquisition settings.";return}if(e==="scope-autoscale"&&n.module==="opamp"){const i=ct(n);i.scopeRunning=!0,i.timeDiv=200/i.frequency;const r=Fi(n);for(const s of["ch1","ch2"]){const o=(r.channels[s].peak||0)*1.15/4;i[`${s}Scale`]=zt[`${s}Scale`].find(a=>a>=o)||Math.max(10,o)}n.sequence++,n.feedback=r.ok?"Two periods fitted to the scope. Adjust the trigger if needed.":r.error;return}if(e.startsWith("module:")){vf(n,e.slice(7));return}if(e.startsWith("set:")){const[,i,r]=e.split(":");oi(n,i,r==="true"?!0:r==="false"?!1:Number.isNaN(Number(r))?r:Number(r));return}if(e.startsWith("adjust:")){const[,i,r]=e.split(":"),s=Number(r),o=ct(n),a=n.module==="superposition"&&i==="sumMilliamp"||n.module==="opamp"&&i==="prediction",c=o[i]===null?0:o[i];if(!a||r===""||!Number.isFinite(s)||!Number.isFinite(c))return n.feedback="Choose a valid numeric answer adjustment.",!1;const l=zt[i],u=Math.min(...l),h=Math.max(...l);return oi(n,i,Number(Math.min(h,Math.max(u,c+s)).toFixed(6)))}if(e.startsWith("cycle:")){const[,i,r="1"]=e.split(":"),s=ct(n),o=zt[i];if(o&&i in s&&Number.isFinite(Number(r))&&Number(r)!==0){const a=Math.sign(Number(r));if(o.every(c=>typeof c=="number")){const c=s[i]===null?0:s[i];if(!Number.isFinite(c))return!1;const l=a>0?o.find(u=>u>c+1e-10)??o.at(-1):[...o].reverse().find(u=>u<c-1e-10)??o[0];oi(n,i,l)}else{const c=Math.max(0,o.indexOf(s[i]));oi(n,i,o[(c+a+o.length)%o.length])}}return}if(e.startsWith("tool:")){n.tool=e.slice(5),n.selectedTerminal=null,n.feedback=n.tool==="remove"?"Select a lead to remove it.":n.tool==="select"?"Select a component or terminal.":`${n.tool==="wire"?"Patch lead":n.tool==="red"?"Meter V tip":n.tool==="black"?"Meter COM tip":n.tool+" probe"} selected. Choose a terminal on the bench.`;return}if(e==="explore"||e==="build"||e==="challenge"){_f(n,e);return}if(e==="record"){xf(n);return}if(e==="check"){yf(n);return}if(e==="check-wiring"){n.feedback=Ct(n).correct?"The terminal connections match the reference circuit. Now connect the probes and take a reading.":"The wiring does not yet match the reference circuit. Use Schematic to compare connections; open and shorted paths change the result.";return}if(e==="clear"||e==="reset-circuit"){os(n),n.wireSets[In(n)]=[],n.probeSets[In(n)]={red:null,black:null},n.scopeSets[In(n)]=fc({...n,mode:"challenge"}),n.selectedTerminal=null,n.params.transient.playing=!1,n.feedback="Leads and probes cleared. Select two terminals to add each connection.";return}if(e==="restore"){if(n.mode!=="explore"){n.feedback="Connect the circuit with patch leads, or switch to Explore to use the connected circuit.";return}const i=ul(n.module,ct(n));os(n),n.wireSets[In(n)]=i.wires.map(r=>[...r]),n.probeSets[In(n)]={red:i.positive,black:"gnd"},n.scopeSets[In(n)]=fc(n),n.feedback="Reference circuit connected.";return}if(e==="reset-attempt"){n.attempts[n.module]++;for(const i of Object.keys(n.wireSets))i.startsWith(`challenge:${n.module}:`)&&(delete n.wireSets[i],delete n.probeSets[i],delete n.scopeSets[i],delete n.scopeHolds[i],delete n.history[i]);n.challengeStarted[n.module]=!1,n.selectedTerminal=null,n.mode==="challenge"&&pl(n),n.checks[n.module]=null,n.feedback="A new challenge attempt has started. Earlier readings remain in the notebook.",Ct(n);return}if(n.module==="transient"){const i=ct(n);if(e==="play"){if(!Ct(n).correct){n.feedback="Complete the circuit before running the transient.";return}i.playing=!i.playing,i.playing&&Ii(n)}e==="switch"&&(Ii(n),i.initial=$n({...i,source:5}).storageValue,i.time=0,i.acquiredTime=0,i.charging=!i.charging,n.feedback=i.charging?"Switch connected to the 5 V source. Stored state is preserved.":"Switch connected to the closed return loop. Stored state is preserved."),e==="replay"&&(Ct(n).correct&&Ii(n),i.time=0,i.acquiredTime=0,i.playing=Ct(n).correct,n.feedback="Replaying this switching segment from its stored initial condition."),e==="reset-energy"&&(i.initial=0,i.time=0,i.acquiredTime=0,i.charging=!0,i.playing=!1,n.feedback="New experiment: initial stored energy set to zero."),e==="one-tau"&&(Ii(n),i.time=$n({...i,source:5}).tau,Ct(n).correct&&(i.acquiredTime=Math.max(i.acquiredTime||0,i.time)),i.playing=!1),e==="five-tau"&&(Ii(n),i.time=$n({...i,source:5}).tau*5,Ct(n).correct&&(i.acquiredTime=Math.max(i.acquiredTime||0,i.time)),i.playing=!1)}n.sequence++}function bf(n){const e=er(n),t=e.ok,i={label:"Voltmeter",value:e.probeReady?Ht(e.probeVoltage):"—",unit:"V",detail:e.probeReady?"V tip − COM tip":"Place both probes"};return n.module==="opamp"?[{...i,label:"Voltage sample",detail:`At input +peak · ${Ht(250/ct(n).frequency)} ms · V tip − COM tip`},{label:"Linear gain",value:t?Ht(e.gain):"—",unit:"V/V",detail:t?e.clipped?"Output is clipping":"Within output limits":"Connect feedback & supplies"},{label:"Output peak",value:t?Ht(e.peak):"—",unit:"Vpk",detail:`Teaching model: ±${ct(n).rail-1} V limit`}]:n.module==="transient"?[i,{label:"Storage current",value:t?Ht(e.current*1e3):"—",unit:"mA",detail:"Fixed sensor · top → ground"},{label:"Stored energy",value:t?Ht(e.energy*1e3,4):"—",unit:"mJ",detail:t?`τ = ${Ht(e.tau*1e3)} ms`:"Complete the storage loop"}]:[i,{label:"Branch current",value:t?Ht(e.current*1e3):"—",unit:"mA",detail:"Fixed sensor · top → ground"},{label:"Load power",value:t?Ht(e.power*1e3):"—",unit:"mW",detail:"Computed from V × I"}]}const lu=new WeakMap;function aa(n){const e=ct(n),t=er(n);if(n.module==="thevenin"){const{circuit:c,wires:l,correct:u}=Ct(n),h=Math.max(2e3,e.load),d=[...new Set([...Array.from({length:100},(p,x)=>(x+1)*h/100),...zt.load.filter(p=>p<=h),e.load])].sort((p,x)=>p-x),f=JSON.stringify([c.electrical,l,e.load]),g=lu.get(n),_=(g==null?void 0:g.signature)===f?g.points:[];if((g==null?void 0:g.signature)!==f&&t.ok)for(const p of d){const x=hl({components:c.electrical.map(b=>b.id==="load"?{...b,value:p}:b),wires:l});x.ok&&_.push([p,(x.voltages.loada-x.voltages.loadb)*x.currents.load*1e3])}(g==null?void 0:g.signature)!==f&&lu.set(n,{signature:f,points:_});const m=_.reduce((p,[x,b])=>!p||b>p.y?{x,y:b}:p,null);return{title:"Load power sweep",subtitle:t.ok?`Calculated sweep · current wiring${u?"":" differs from the diagram"} · select a load to test it`:t.error,series:_.length?[{name:"Calculated load power",color:"#17788d",unit:"mW",points:_}]:[],interaction:"load",calculated:!0,valid:t.ok,error:t.ok?null:t.error,xMax:h,yMin:0,yMax:Math.max((m==null?void 0:m.y)||0,.001)*1.12,xLabel:"Load resistance (Ω)",yLabel:"Power (mW)",xUnit:"Ω",yUnit:"mW",peak:m,marker:t.ok?{x:e.load,y:t.power*1e3}:null}}if(n.module==="superposition"){const c=Gh(n),l=c.live;return{title:c.superpositionValid?"Signed source contributions":"Source states",interaction:"source",calculated:!0,subtitle:c.error||"Calculated from current wiring · positive current flows top → ground",bars:[{name:"A alone",sourceMode:"a",value:l.a.valid?l.a.current*1e3:null,missing:!l.a.valid,color:"#17788d"},{name:"B alone",sourceMode:"b",value:l.b.valid?l.b.current*1e3:null,missing:!l.b.valid,color:"#b77739"},{name:"Both",sourceMode:"both",value:l.both.valid?l.both.current*1e3:null,missing:!l.both.valid,color:"#294a61"}],yLabel:"Current (mA)",yUnit:"mA",series:[]}}if(n.module==="opamp"){const c=Fi(n),l=["ch1","ch2"].map((u,h)=>{const d=c.channels[u],f=h?"#17788d":"#b77739";return{id:u,interaction:"scope",title:`${u.toUpperCase()} · ${d.scale} V/div`,subtitle:d.error||c.error||`${d.signal} − ${d.ground} · ${c.running?"Run":"Hold"}${c.stale?" · old settings":""}`,series:d.valid&&d.points.length?[{name:u.toUpperCase(),color:f,points:d.points}]:[],xMax:c.timeDiv*10,yMin:-d.scale*4,yMax:d.scale*4,xLabel:"Time (ms)",yLabel:"Voltage (V)",xUnit:"ms",yUnit:"V",limits:u==="ch2"&&d.correct?c.limits:[]}});return{title:"Oscilloscope",interaction:"scope",subtitle:c.error||`${e.frequency} Hz · ${c.trigger.edge} trigger at ${c.trigger.level} V · ${c.running?"Run":"Hold"}`,series:l.flatMap(u=>u.series),panels:l,xMax:c.timeDiv*10,yMin:-Math.max(c.channels.ch1.scale,c.channels.ch2.scale)*4,yMax:Math.max(c.channels.ch1.scale,c.channels.ch2.scale)*4,xLabel:"Time (ms)",yLabel:"Voltage (V)",limits:c.limits,scope:c}}const i=$n({...e,source:5}).tau,r=t.ok?Math.max(0,e.acquiredTime||0):0,s=Math.max((e.kind==="RC"?.1:.001)*5e3,r*1e3),o=t.ok?Array.from({length:r>0?121:1},(c,l)=>{const u=r>0?l/120*r:0,h=$n({...e,source:5,time:u});return{time:u*1e3,voltage:h.voltage,current:h.current*1e3,energy:h.energy*1e3}}):[],a=["voltage","current","energy"].map((c,l)=>{const u=o.map(_=>[_.time,_[c]]),h=u.map(_=>_[1]),d=c==="voltage"?`${e.kind==="RC"?"Capacitor":"Inductor"} voltage`:c==="current"?"Storage current":"Stored energy",f=$n({...e,source:5,time:0}),g=c==="voltage"?Math.max(5,Math.abs(f.voltage)):c==="current"?Math.max(5e3/e.resistance,Math.abs(f.current*1e3)):Math.max(f.energy*1e3,e.kind==="RC"?12500*e.capacitance:12500*e.inductance/e.resistance**2);return{id:c,title:d,subtitle:t.ok?`${e.charging?"Source connected":"Closed return"} · ${e.playing?"Acquiring":r?"Paused":"Press Run"} · ${Ht(r*1e3)} ms acquired`:t.error,series:u.length?[{name:d,color:["#17788d","#b77739","#735782"][l],unit:["V","mA","mJ"][l],points:u}]:[],interaction:"time",valid:t.ok,acquiredMax:r*1e3,xMax:s,yMin:Math.min(0,...h)*1.12,yMax:Math.max(g,...h,.001)*1.12,xLabel:"Elapsed circuit time (ms)",yLabel:["Voltage (V)","Current (mA)","Energy (mJ)"][l],xUnit:"ms",yUnit:["V","mA","mJ"][l],marker:t.ok?{x:e.time*1e3,y:c==="voltage"?t.voltage:c==="current"?t.current*1e3:t.energy*1e3}:null,tau:i*1e3}});return{...a[e.kind==="RC"?0:1],panels:a}}function $h(n,e,t=0){var h;const i=aa(n),r=((h=i.panels)==null?void 0:h[t])||i,s=Number.isFinite(e)?Math.max(0,Math.min(1,e)):0;if(i.bars){const d=i.bars[Math.min(i.bars.length-1,Math.floor(s*i.bars.length))];return{x:null,xLabel:d.name,readings:d.missing?[]:[{name:d.name,value:d.value,unit:i.yUnit,color:d.color}],text:d.missing?`${d.name}: circuit unavailable`:`${d.name}: ${Ht(d.value)} ${i.yUnit}`,sourceMode:d.sourceMode}}const o=s*r.xMax,a=r.yUnit||"V",c=i.panels||[r],l=[];if(!(r.acquiredMax!==void 0&&o>r.acquiredMax+1e-8))for(const d of c)for(const f of d.series||[]){const g=f.points;if(!g.length||o<g[0][0]-1e-8||o>g.at(-1)[0]+1e-8)continue;let _=g.findIndex(([M])=>M>=o);_<0&&(_=g.length-1);const[m,p]=g[Math.max(0,_-1)],[x,b]=g[_],y=m===x?b:p+(o-m)/(x-m)*(b-p);l.push({name:f.name,value:y,unit:f.unit||d.yUnit||a,color:f.color})}const u=`${Ht(o)} ${r.xUnit||"ms"}`;return{x:o,xLabel:u,readings:l,text:l.length?`${u} · ${l.map(d=>`${d.name} ${Ht(d.value)} ${d.unit}`).join(" · ")}`:`${u} · ${r.acquiredMax!==void 0&&o>r.acquiredMax?"not acquired; run the circuit":"no trace at this point"}`}}function qh(n){const e=ct(n),t=[],i=(s,o,a,c="")=>t.push({group:s,id:o,label:a,value:c}),r=(s,o,a,c="Settings")=>{i(c,`cycle:${s}`,`${o} +`,a),i(c,`cycle:${s}:-1`,`${o} −`,a)};i("Guide",n.mode==="explore"?"build":"explore",n.mode==="explore"?"Build circuit":"Explore"),i("Guide","reset-circuit","Clear circuit");for(const[s,o]of[["select","Select"],["wire","Wire"],["remove","Remove"],["red","Meter V tip"],["black","Meter COM tip"]])i("Bench",`tool:${s}`,o,n.tool===s?"Selected":"");if(i("Bench","undo","Undo"),i("Bench","cancel","Cancel selection"),i("Bench","check-wiring","Check wiring"),n.module==="thevenin"){for(const s of["original","thevenin","norton"])i("Settings",`set:representation:${s}`,s==="thevenin"?"Thévenin":s==="norton"?"Norton":"Original",e.representation===s?"Selected":"");r("load","Load",`${e.load} Ω`),e.representation==="thevenin"&&r("equivalentVoltage","Vth",`${e.equivalentVoltage} V`),e.representation==="norton"&&r("nortonCurrent","In",`${e.nortonCurrent} mA`),e.representation!=="original"&&r("equivalentResistance","Equivalent R",`${e.equivalentResistance} Ω`)}if(n.module==="superposition"){for(const[s,o]of[["both","Both sources"],["a","A alone"],["b","B alone"]])i("Settings",`set:sourceMode:${s}`,o,e.sourceMode===s?"Selected":"");r("v1","Source A",`+${e.v1} V`),r("v2","Source B",`−${e.v2} V`),i("Settings",`set:replacement:${e.replacement==="short"?"open":"short"}`,"Inactive source",e.replacement)}if(n.module==="opamp"){i("Settings",`set:configuration:${e.configuration==="inverting"?"noninverting":"inverting"}`,"Configuration",e.configuration),r("rin","Rin",`${e.rin/1e3} kΩ`),r("rf","Rf",`${e.rf/1e3} kΩ`),r("amplitude","Input",`${e.amplitude} Vpk`),r("rail","Supply",`±${e.rail} V`),r("frequency","Frequency",`${e.frequency} Hz`);for(const s of["ch1","ch2"])i("Bench",`tool:${s}`,`${s.toUpperCase()} signal`,n.tool===s?"Selected":""),i("Bench",`scope-ground:${s}`,`${s.toUpperCase()} ground`,n.tool==="scopeGround"&&e.scopeGroundChannel===s?"Selected":""),r(`${s}Scale`,`${s.toUpperCase()} scale`,`${e[`${s}Scale`]} V/div`);r("timeDiv","Timebase",`${e.timeDiv} ms/div`),r("triggerLevel","Trigger level",`${e.triggerLevel} V`),i("Settings",`set:triggerEdge:${e.triggerEdge==="rising"?"falling":"rising"}`,"Trigger edge",e.triggerEdge),i("Bench","scope-toggle",e.scopeRunning?"Hold scope":"Run scope"),i("Bench","scope-autoscale","Autoscale")}n.module==="transient"&&(i("Settings",`set:kind:${e.kind==="RC"?"RL":"RC"}`,"Circuit",e.kind),r("resistance","Resistance",`${e.resistance} Ω`),r("speed","Playback",`${e.speed}×`),i("Bench","switch","Switch",e.charging?"Source":"Return"),i("Bench","play",e.playing?"Pause":"Run"),i("Bench","one-tau","Cursor at 1 τ"),i("Bench","five-tau","Cursor at 5 τ"),i("Bench","reset-energy","Zero energy"),i("Bench","replay","Replay")),n.mode==="explore"&&i("Bench","restore","Connect reference");for(const[s,o]of Object.entries(An))i("Labs",`module:${s}`,`Lab ${o.number}: ${o.name}`,n.module===s?"Current":"");return t}/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const ml="180",es={ROTATE:0,DOLLY:1,PAN:2},Kr={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Mf=0,uu=1,Sf=2,Xh=1,Yh=2,Ci=3,sr=0,Bn=1,gi=2,tr=0,ts=1,hu=2,du=3,fu=4,Ef=5,yr=100,wf=101,Tf=102,Af=103,Rf=104,Cf=200,Pf=201,Lf=202,Df=203,pc=204,mc=205,If=206,Uf=207,Nf=208,Of=209,Ff=210,kf=211,zf=212,Bf=213,Vf=214,gc=0,vc=1,_c=2,cs=3,xc=4,yc=5,bc=6,Mc=7,jh=0,Hf=1,Gf=2,nr=0,Wf=1,$f=2,qf=3,Zh=4,Xf=5,Yf=6,jf=7,Kh=300,ls=301,us=302,Sc=303,Ec=304,ca=306,wc=1e3,Sr=1001,Tc=1002,ui=1003,Zf=1004,po=1005,ai=1006,Ca=1007,Qi=1008,xi=1009,Jh=1010,Qh=1011,Ws=1012,gl=1013,wr=1014,Ui=1015,to=1016,vl=1017,_l=1018,$s=1020,ed=35902,td=35899,nd=1021,id=1022,ci=1023,qs=1026,Xs=1027,rd=1028,xl=1029,sd=1030,yl=1031,bl=1033,Wo=33776,$o=33777,qo=33778,Xo=33779,Ac=35840,Rc=35841,Cc=35842,Pc=35843,Lc=36196,Dc=37492,Ic=37496,Uc=37808,Nc=37809,Oc=37810,Fc=37811,kc=37812,zc=37813,Bc=37814,Vc=37815,Hc=37816,Gc=37817,Wc=37818,$c=37819,qc=37820,Xc=37821,Yc=36492,jc=36494,Zc=36495,Kc=36283,Jc=36284,Qc=36285,el=36286,Kf=3200,Jf=3201,od=0,Qf=1,Ji="",wn="srgb",hs="srgb-linear",Zo="linear",kt="srgb",Nr=7680,pu=519,ep=512,tp=513,np=514,ad=515,ip=516,rp=517,sp=518,op=519,mu=35044,gu="300 es",_i=2e3,Ko=2001;class Rr{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const r=i[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}}const Mn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let vu=1234567;const ns=Math.PI/180,Ys=180/Math.PI;function Cr(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Mn[n&255]+Mn[n>>8&255]+Mn[n>>16&255]+Mn[n>>24&255]+"-"+Mn[e&255]+Mn[e>>8&255]+"-"+Mn[e>>16&15|64]+Mn[e>>24&255]+"-"+Mn[t&63|128]+Mn[t>>8&255]+"-"+Mn[t>>16&255]+Mn[t>>24&255]+Mn[i&255]+Mn[i>>8&255]+Mn[i>>16&255]+Mn[i>>24&255]).toLowerCase()}function mt(n,e,t){return Math.max(e,Math.min(t,n))}function Ml(n,e){return(n%e+e)%e}function ap(n,e,t,i,r){return i+(n-e)*(r-i)/(t-e)}function cp(n,e,t){return n!==e?(t-n)/(e-n):0}function Os(n,e,t){return(1-t)*n+t*e}function lp(n,e,t,i){return Os(n,e,1-Math.exp(-t*i))}function up(n,e=1){return e-Math.abs(Ml(n,e*2)-e)}function hp(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function dp(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function fp(n,e){return n+Math.floor(Math.random()*(e-n+1))}function pp(n,e){return n+Math.random()*(e-n)}function mp(n){return n*(.5-Math.random())}function gp(n){n!==void 0&&(vu=n);let e=vu+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function vp(n){return n*ns}function _p(n){return n*Ys}function xp(n){return(n&n-1)===0&&n!==0}function yp(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function bp(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function Mp(n,e,t,i,r){const s=Math.cos,o=Math.sin,a=s(t/2),c=o(t/2),l=s((e+i)/2),u=o((e+i)/2),h=s((e-i)/2),d=o((e-i)/2),f=s((i-e)/2),g=o((i-e)/2);switch(r){case"XYX":n.set(a*u,c*h,c*d,a*l);break;case"YZY":n.set(c*d,a*u,c*h,a*l);break;case"ZXZ":n.set(c*h,c*d,a*u,a*l);break;case"XZX":n.set(a*u,c*g,c*f,a*l);break;case"YXY":n.set(c*f,a*u,c*g,a*l);break;case"ZYZ":n.set(c*g,c*f,a*u,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function Zr(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Ln(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const yn={DEG2RAD:ns,RAD2DEG:Ys,generateUUID:Cr,clamp:mt,euclideanModulo:Ml,mapLinear:ap,inverseLerp:cp,lerp:Os,damp:lp,pingpong:up,smoothstep:hp,smootherstep:dp,randInt:fp,randFloat:pp,randFloatSpread:mp,seededRandom:gp,degToRad:vp,radToDeg:_p,isPowerOfTwo:xp,ceilPowerOfTwo:yp,floorPowerOfTwo:bp,setQuaternionFromProperEuler:Mp,normalize:Ln,denormalize:Zr};class ye{constructor(e=0,t=0){ye.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=mt(this.x,e.x,t.x),this.y=mt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=mt(this.x,e,t),this.y=mt(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(mt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(mt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class gn{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,s,o,a){let c=i[r+0],l=i[r+1],u=i[r+2],h=i[r+3];const d=s[o+0],f=s[o+1],g=s[o+2],_=s[o+3];if(a===0){e[t+0]=c,e[t+1]=l,e[t+2]=u,e[t+3]=h;return}if(a===1){e[t+0]=d,e[t+1]=f,e[t+2]=g,e[t+3]=_;return}if(h!==_||c!==d||l!==f||u!==g){let m=1-a;const p=c*d+l*f+u*g+h*_,x=p>=0?1:-1,b=1-p*p;if(b>Number.EPSILON){const M=Math.sqrt(b),w=Math.atan2(M,p*x);m=Math.sin(m*w)/M,a=Math.sin(a*w)/M}const y=a*x;if(c=c*m+d*y,l=l*m+f*y,u=u*m+g*y,h=h*m+_*y,m===1-a){const M=1/Math.sqrt(c*c+l*l+u*u+h*h);c*=M,l*=M,u*=M,h*=M}}e[t]=c,e[t+1]=l,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,i,r,s,o){const a=i[r],c=i[r+1],l=i[r+2],u=i[r+3],h=s[o],d=s[o+1],f=s[o+2],g=s[o+3];return e[t]=a*g+u*h+c*f-l*d,e[t+1]=c*g+u*d+l*h-a*f,e[t+2]=l*g+u*f+a*d-c*h,e[t+3]=u*g-a*h-c*d-l*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,c=Math.sin,l=a(i/2),u=a(r/2),h=a(s/2),d=c(i/2),f=c(r/2),g=c(s/2);switch(o){case"XYZ":this._x=d*u*h+l*f*g,this._y=l*f*h-d*u*g,this._z=l*u*g+d*f*h,this._w=l*u*h-d*f*g;break;case"YXZ":this._x=d*u*h+l*f*g,this._y=l*f*h-d*u*g,this._z=l*u*g-d*f*h,this._w=l*u*h+d*f*g;break;case"ZXY":this._x=d*u*h-l*f*g,this._y=l*f*h+d*u*g,this._z=l*u*g+d*f*h,this._w=l*u*h-d*f*g;break;case"ZYX":this._x=d*u*h-l*f*g,this._y=l*f*h+d*u*g,this._z=l*u*g-d*f*h,this._w=l*u*h+d*f*g;break;case"YZX":this._x=d*u*h+l*f*g,this._y=l*f*h+d*u*g,this._z=l*u*g-d*f*h,this._w=l*u*h-d*f*g;break;case"XZY":this._x=d*u*h-l*f*g,this._y=l*f*h-d*u*g,this._z=l*u*g+d*f*h,this._w=l*u*h+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],r=t[4],s=t[8],o=t[1],a=t[5],c=t[9],l=t[2],u=t[6],h=t[10],d=i+a+h;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(u-c)*f,this._y=(s-l)*f,this._z=(o-r)*f}else if(i>a&&i>h){const f=2*Math.sqrt(1+i-a-h);this._w=(u-c)/f,this._x=.25*f,this._y=(r+o)/f,this._z=(s+l)/f}else if(a>h){const f=2*Math.sqrt(1+a-i-h);this._w=(s-l)/f,this._x=(r+o)/f,this._y=.25*f,this._z=(c+u)/f}else{const f=2*Math.sqrt(1+h-i-a);this._w=(o-r)/f,this._x=(s+l)/f,this._y=(c+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(mt(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,r=e._y,s=e._z,o=e._w,a=t._x,c=t._y,l=t._z,u=t._w;return this._x=i*u+o*a+r*l-s*c,this._y=r*u+o*c+s*a-i*l,this._z=s*u+o*l+i*c-r*a,this._w=o*u-i*a-r*c-s*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,o=this._w;let a=o*e._w+i*e._x+r*e._y+s*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=i,this._y=r,this._z=s,this;const c=1-a*a;if(c<=Number.EPSILON){const f=1-t;return this._w=f*o+t*this._w,this._x=f*i+t*this._x,this._y=f*r+t*this._y,this._z=f*s+t*this._z,this.normalize(),this}const l=Math.sqrt(c),u=Math.atan2(l,a),h=Math.sin((1-t)*u)/l,d=Math.sin(t*u)/l;return this._w=o*h+this._w*d,this._x=i*h+this._x*d,this._y=r*h+this._y*d,this._z=s*h+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class D{constructor(e=0,t=0,i=0){D.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(_u.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(_u.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){const t=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,c=e.w,l=2*(o*r-a*i),u=2*(a*t-s*r),h=2*(s*i-o*t);return this.x=t+c*l+o*h-a*u,this.y=i+c*u+a*l-s*h,this.z=r+c*h+s*u-o*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=mt(this.x,e.x,t.x),this.y=mt(this.y,e.y,t.y),this.z=mt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=mt(this.x,e,t),this.y=mt(this.y,e,t),this.z=mt(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(mt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,r=e.y,s=e.z,o=t.x,a=t.y,c=t.z;return this.x=r*c-s*a,this.y=s*o-i*c,this.z=i*a-r*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Pa.copy(this).projectOnVector(e),this.sub(Pa)}reflect(e){return this.sub(Pa.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(mt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Pa=new D,_u=new gn;class pt{constructor(e,t,i,r,s,o,a,c,l){pt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,c,l)}set(e,t,i,r,s,o,a,c,l){const u=this.elements;return u[0]=e,u[1]=r,u[2]=a,u[3]=t,u[4]=s,u[5]=c,u[6]=i,u[7]=o,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[3],c=i[6],l=i[1],u=i[4],h=i[7],d=i[2],f=i[5],g=i[8],_=r[0],m=r[3],p=r[6],x=r[1],b=r[4],y=r[7],M=r[2],w=r[5],A=r[8];return s[0]=o*_+a*x+c*M,s[3]=o*m+a*b+c*w,s[6]=o*p+a*y+c*A,s[1]=l*_+u*x+h*M,s[4]=l*m+u*b+h*w,s[7]=l*p+u*y+h*A,s[2]=d*_+f*x+g*M,s[5]=d*m+f*b+g*w,s[8]=d*p+f*y+g*A,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8];return t*o*u-t*a*l-i*s*u+i*a*c+r*s*l-r*o*c}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8],h=u*o-a*l,d=a*c-u*s,f=l*s-o*c,g=t*h+i*d+r*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=h*_,e[1]=(r*l-u*i)*_,e[2]=(a*i-r*o)*_,e[3]=d*_,e[4]=(u*t-r*c)*_,e[5]=(r*s-a*t)*_,e[6]=f*_,e[7]=(i*c-l*t)*_,e[8]=(o*t-i*s)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,o,a){const c=Math.cos(s),l=Math.sin(s);return this.set(i*c,i*l,-i*(c*o+l*a)+o+e,-r*l,r*c,-r*(-l*o+c*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(La.makeScale(e,t)),this}rotate(e){return this.premultiply(La.makeRotation(-e)),this}translate(e,t){return this.premultiply(La.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const La=new pt;function cd(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Jo(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Sp(){const n=Jo("canvas");return n.style.display="block",n}const xu={};function js(n){n in xu||(xu[n]=!0,console.warn(n))}function Ep(n,e,t){return new Promise(function(i,r){function s(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:i()}}setTimeout(s,t)})}const yu=new pt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),bu=new pt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function wp(){const n={enabled:!0,workingColorSpace:hs,spaces:{},convert:function(r,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===kt&&(r.r=Oi(r.r),r.g=Oi(r.g),r.b=Oi(r.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===kt&&(r.r=is(r.r),r.g=is(r.g),r.b=is(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===Ji?Zo:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,o){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return js("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return js("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[hs]:{primaries:e,whitePoint:i,transfer:Zo,toXYZ:yu,fromXYZ:bu,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:wn},outputColorSpaceConfig:{drawingBufferColorSpace:wn}},[wn]:{primaries:e,whitePoint:i,transfer:kt,toXYZ:yu,fromXYZ:bu,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:wn}}}),n}const At=wp();function Oi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function is(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Or;class Tp{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Or===void 0&&(Or=Jo("canvas")),Or.width=e.width,Or.height=e.height;const r=Or.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=Or}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Jo("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=Oi(s[o]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Oi(t[i]/255)*255):t[i]=Oi(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Ap=0;class Sl{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Ap++}),this.uuid=Cr(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(Da(r[o].image)):s.push(Da(r[o]))}else s=Da(r);i.url=s}return t||(e.images[this.uuid]=i),i}}function Da(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Tp.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Rp=0;const Ia=new D;class Nn extends Rr{constructor(e=Nn.DEFAULT_IMAGE,t=Nn.DEFAULT_MAPPING,i=Sr,r=Sr,s=ai,o=Qi,a=ci,c=xi,l=Nn.DEFAULT_ANISOTROPY,u=Ji){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Rp++}),this.uuid=Cr(),this.name="",this.source=new Sl(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new ye(0,0),this.repeat=new ye(1,1),this.center=new ye(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new pt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Ia).x}get height(){return this.source.getSize(Ia).y}get depth(){return this.source.getSize(Ia).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}r&&i&&r.isVector2&&i.isVector2||r&&i&&r.isVector3&&i.isVector3||r&&i&&r.isMatrix3&&i.isMatrix3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Kh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case wc:e.x=e.x-Math.floor(e.x);break;case Sr:e.x=e.x<0?0:1;break;case Tc:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case wc:e.y=e.y-Math.floor(e.y);break;case Sr:e.y=e.y<0?0:1;break;case Tc:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Nn.DEFAULT_IMAGE=null;Nn.DEFAULT_MAPPING=Kh;Nn.DEFAULT_ANISOTROPY=1;class en{constructor(e=0,t=0,i=0,r=1){en.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*t+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*t+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*t+o[7]*i+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s;const c=e.elements,l=c[0],u=c[4],h=c[8],d=c[1],f=c[5],g=c[9],_=c[2],m=c[6],p=c[10];if(Math.abs(u-d)<.01&&Math.abs(h-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+_)<.1&&Math.abs(g+m)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const b=(l+1)/2,y=(f+1)/2,M=(p+1)/2,w=(u+d)/4,A=(h+_)/4,C=(g+m)/4;return b>y&&b>M?b<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(b),r=w/i,s=A/i):y>M?y<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(y),i=w/r,s=C/r):M<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(M),i=A/s,r=C/s),this.set(i,r,s,t),this}let x=Math.sqrt((m-g)*(m-g)+(h-_)*(h-_)+(d-u)*(d-u));return Math.abs(x)<.001&&(x=1),this.x=(m-g)/x,this.y=(h-_)/x,this.z=(d-u)/x,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=mt(this.x,e.x,t.x),this.y=mt(this.y,e.y,t.y),this.z=mt(this.z,e.z,t.z),this.w=mt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=mt(this.x,e,t),this.y=mt(this.y,e,t),this.z=mt(this.z,e,t),this.w=mt(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(mt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Cp extends Rr{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ai,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new en(0,0,e,t),this.scissorTest=!1,this.viewport=new en(0,0,e,t);const r={width:e,height:t,depth:i.depth},s=new Nn(r);this.textures=[];const o=i.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:ai,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i,this.textures[r].isArrayTexture=this.textures[r].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const r=Object.assign({},e.textures[t].image);this.textures[t].source=new Sl(r)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Tr extends Cp{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class ld extends Nn{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=ui,this.minFilter=ui,this.wrapR=Sr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Pp extends Nn{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=ui,this.minFilter=ui,this.wrapR=Sr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ir{constructor(e=new D(1/0,1/0,1/0),t=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(ni.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(ni.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=ni.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,ni):ni.fromBufferAttribute(s,o),ni.applyMatrix4(e.matrixWorld),this.expandByPoint(ni);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),mo.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),mo.copy(i.boundingBox)),mo.applyMatrix4(e.matrixWorld),this.union(mo)}const r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ni),ni.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ws),go.subVectors(this.max,ws),Fr.subVectors(e.a,ws),kr.subVectors(e.b,ws),zr.subVectors(e.c,ws),Wi.subVectors(kr,Fr),$i.subVectors(zr,kr),fr.subVectors(Fr,zr);let t=[0,-Wi.z,Wi.y,0,-$i.z,$i.y,0,-fr.z,fr.y,Wi.z,0,-Wi.x,$i.z,0,-$i.x,fr.z,0,-fr.x,-Wi.y,Wi.x,0,-$i.y,$i.x,0,-fr.y,fr.x,0];return!Ua(t,Fr,kr,zr,go)||(t=[1,0,0,0,1,0,0,0,1],!Ua(t,Fr,kr,zr,go))?!1:(vo.crossVectors(Wi,$i),t=[vo.x,vo.y,vo.z],Ua(t,Fr,kr,zr,go))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ni).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ni).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Ei[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Ei[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Ei[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Ei[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Ei[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Ei[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Ei[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Ei[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Ei),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Ei=[new D,new D,new D,new D,new D,new D,new D,new D],ni=new D,mo=new ir,Fr=new D,kr=new D,zr=new D,Wi=new D,$i=new D,fr=new D,ws=new D,go=new D,vo=new D,pr=new D;function Ua(n,e,t,i,r){for(let s=0,o=n.length-3;s<=o;s+=3){pr.fromArray(n,s);const a=r.x*Math.abs(pr.x)+r.y*Math.abs(pr.y)+r.z*Math.abs(pr.z),c=e.dot(pr),l=t.dot(pr),u=i.dot(pr);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>a)return!1}return!0}const Lp=new ir,Ts=new D,Na=new D;class la{constructor(e=new D,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):Lp.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ts.subVectors(e,this.center);const t=Ts.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(Ts,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Na.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ts.copy(e.center).add(Na)),this.expandByPoint(Ts.copy(e.center).sub(Na))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const wi=new D,Oa=new D,_o=new D,qi=new D,Fa=new D,xo=new D,ka=new D;class ua{constructor(e=new D,t=new D(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,wi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=wi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(wi.copy(this.origin).addScaledVector(this.direction,t),wi.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){Oa.copy(e).add(t).multiplyScalar(.5),_o.copy(t).sub(e).normalize(),qi.copy(this.origin).sub(Oa);const s=e.distanceTo(t)*.5,o=-this.direction.dot(_o),a=qi.dot(this.direction),c=-qi.dot(_o),l=qi.lengthSq(),u=Math.abs(1-o*o);let h,d,f,g;if(u>0)if(h=o*c-a,d=o*a-c,g=s*u,h>=0)if(d>=-g)if(d<=g){const _=1/u;h*=_,d*=_,f=h*(h+o*d+2*a)+d*(o*h+d+2*c)+l}else d=s,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*c)+l;else d=-s,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*c)+l;else d<=-g?(h=Math.max(0,-(-o*s+a)),d=h>0?-s:Math.min(Math.max(-s,-c),s),f=-h*h+d*(d+2*c)+l):d<=g?(h=0,d=Math.min(Math.max(-s,-c),s),f=d*(d+2*c)+l):(h=Math.max(0,-(o*s+a)),d=h>0?s:Math.min(Math.max(-s,-c),s),f=-h*h+d*(d+2*c)+l);else d=o>0?-s:s,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(Oa).addScaledVector(_o,d),f}intersectSphere(e,t){wi.subVectors(e.center,this.origin);const i=wi.dot(this.direction),r=wi.dot(wi)-i*i,s=e.radius*e.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=i-o,c=i+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,o,a,c;const l=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return l>=0?(i=(e.min.x-d.x)*l,r=(e.max.x-d.x)*l):(i=(e.max.x-d.x)*l,r=(e.min.x-d.x)*l),u>=0?(s=(e.min.y-d.y)*u,o=(e.max.y-d.y)*u):(s=(e.max.y-d.y)*u,o=(e.min.y-d.y)*u),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),h>=0?(a=(e.min.z-d.z)*h,c=(e.max.z-d.z)*h):(a=(e.max.z-d.z)*h,c=(e.min.z-d.z)*h),i>c||a>r)||((a>i||i!==i)&&(i=a),(c<r||r!==r)&&(r=c),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,wi)!==null}intersectTriangle(e,t,i,r,s){Fa.subVectors(t,e),xo.subVectors(i,e),ka.crossVectors(Fa,xo);let o=this.direction.dot(ka),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;qi.subVectors(this.origin,e);const c=a*this.direction.dot(xo.crossVectors(qi,xo));if(c<0)return null;const l=a*this.direction.dot(Fa.cross(qi));if(l<0||c+l>o)return null;const u=-a*qi.dot(ka);return u<0?null:this.at(u/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class $t{constructor(e,t,i,r,s,o,a,c,l,u,h,d,f,g,_,m){$t.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,c,l,u,h,d,f,g,_,m)}set(e,t,i,r,s,o,a,c,l,u,h,d,f,g,_,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=i,p[12]=r,p[1]=s,p[5]=o,p[9]=a,p[13]=c,p[2]=l,p[6]=u,p[10]=h,p[14]=d,p[3]=f,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new $t().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,r=1/Br.setFromMatrixColumn(e,0).length(),s=1/Br.setFromMatrixColumn(e,1).length(),o=1/Br.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),c=Math.cos(r),l=Math.sin(r),u=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){const d=o*u,f=o*h,g=a*u,_=a*h;t[0]=c*u,t[4]=-c*h,t[8]=l,t[1]=f+g*l,t[5]=d-_*l,t[9]=-a*c,t[2]=_-d*l,t[6]=g+f*l,t[10]=o*c}else if(e.order==="YXZ"){const d=c*u,f=c*h,g=l*u,_=l*h;t[0]=d+_*a,t[4]=g*a-f,t[8]=o*l,t[1]=o*h,t[5]=o*u,t[9]=-a,t[2]=f*a-g,t[6]=_+d*a,t[10]=o*c}else if(e.order==="ZXY"){const d=c*u,f=c*h,g=l*u,_=l*h;t[0]=d-_*a,t[4]=-o*h,t[8]=g+f*a,t[1]=f+g*a,t[5]=o*u,t[9]=_-d*a,t[2]=-o*l,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){const d=o*u,f=o*h,g=a*u,_=a*h;t[0]=c*u,t[4]=g*l-f,t[8]=d*l+_,t[1]=c*h,t[5]=_*l+d,t[9]=f*l-g,t[2]=-l,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){const d=o*c,f=o*l,g=a*c,_=a*l;t[0]=c*u,t[4]=_-d*h,t[8]=g*h+f,t[1]=h,t[5]=o*u,t[9]=-a*u,t[2]=-l*u,t[6]=f*h+g,t[10]=d-_*h}else if(e.order==="XZY"){const d=o*c,f=o*l,g=a*c,_=a*l;t[0]=c*u,t[4]=-h,t[8]=l*u,t[1]=d*h+_,t[5]=o*u,t[9]=f*h-g,t[2]=g*h-f,t[6]=a*u,t[10]=_*h+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Dp,e,Ip)}lookAt(e,t,i){const r=this.elements;return Gn.subVectors(e,t),Gn.lengthSq()===0&&(Gn.z=1),Gn.normalize(),Xi.crossVectors(i,Gn),Xi.lengthSq()===0&&(Math.abs(i.z)===1?Gn.x+=1e-4:Gn.z+=1e-4,Gn.normalize(),Xi.crossVectors(i,Gn)),Xi.normalize(),yo.crossVectors(Gn,Xi),r[0]=Xi.x,r[4]=yo.x,r[8]=Gn.x,r[1]=Xi.y,r[5]=yo.y,r[9]=Gn.y,r[2]=Xi.z,r[6]=yo.z,r[10]=Gn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[4],c=i[8],l=i[12],u=i[1],h=i[5],d=i[9],f=i[13],g=i[2],_=i[6],m=i[10],p=i[14],x=i[3],b=i[7],y=i[11],M=i[15],w=r[0],A=r[4],C=r[8],S=r[12],E=r[1],U=r[5],k=r[9],$=r[13],H=r[2],X=r[6],G=r[10],W=r[14],N=r[3],fe=r[7],oe=r[11],K=r[15];return s[0]=o*w+a*E+c*H+l*N,s[4]=o*A+a*U+c*X+l*fe,s[8]=o*C+a*k+c*G+l*oe,s[12]=o*S+a*$+c*W+l*K,s[1]=u*w+h*E+d*H+f*N,s[5]=u*A+h*U+d*X+f*fe,s[9]=u*C+h*k+d*G+f*oe,s[13]=u*S+h*$+d*W+f*K,s[2]=g*w+_*E+m*H+p*N,s[6]=g*A+_*U+m*X+p*fe,s[10]=g*C+_*k+m*G+p*oe,s[14]=g*S+_*$+m*W+p*K,s[3]=x*w+b*E+y*H+M*N,s[7]=x*A+b*U+y*X+M*fe,s[11]=x*C+b*k+y*G+M*oe,s[15]=x*S+b*$+y*W+M*K,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],c=e[9],l=e[13],u=e[2],h=e[6],d=e[10],f=e[14],g=e[3],_=e[7],m=e[11],p=e[15];return g*(+s*c*h-r*l*h-s*a*d+i*l*d+r*a*f-i*c*f)+_*(+t*c*f-t*l*d+s*o*d-r*o*f+r*l*u-s*c*u)+m*(+t*l*h-t*a*f-s*o*h+i*o*f+s*a*u-i*l*u)+p*(-r*a*u-t*c*h+t*a*d+r*o*h-i*o*d+i*c*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8],h=e[9],d=e[10],f=e[11],g=e[12],_=e[13],m=e[14],p=e[15],x=h*m*l-_*d*l+_*c*f-a*m*f-h*c*p+a*d*p,b=g*d*l-u*m*l-g*c*f+o*m*f+u*c*p-o*d*p,y=u*_*l-g*h*l+g*a*f-o*_*f-u*a*p+o*h*p,M=g*h*c-u*_*c-g*a*d+o*_*d+u*a*m-o*h*m,w=t*x+i*b+r*y+s*M;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/w;return e[0]=x*A,e[1]=(_*d*s-h*m*s-_*r*f+i*m*f+h*r*p-i*d*p)*A,e[2]=(a*m*s-_*c*s+_*r*l-i*m*l-a*r*p+i*c*p)*A,e[3]=(h*c*s-a*d*s-h*r*l+i*d*l+a*r*f-i*c*f)*A,e[4]=b*A,e[5]=(u*m*s-g*d*s+g*r*f-t*m*f-u*r*p+t*d*p)*A,e[6]=(g*c*s-o*m*s-g*r*l+t*m*l+o*r*p-t*c*p)*A,e[7]=(o*d*s-u*c*s+u*r*l-t*d*l-o*r*f+t*c*f)*A,e[8]=y*A,e[9]=(g*h*s-u*_*s-g*i*f+t*_*f+u*i*p-t*h*p)*A,e[10]=(o*_*s-g*a*s+g*i*l-t*_*l-o*i*p+t*a*p)*A,e[11]=(u*a*s-o*h*s-u*i*l+t*h*l+o*i*f-t*a*f)*A,e[12]=M*A,e[13]=(u*_*r-g*h*r+g*i*d-t*_*d-u*i*m+t*h*m)*A,e[14]=(g*a*r-o*_*r-g*i*c+t*_*c+o*i*m-t*a*m)*A,e[15]=(o*h*r-u*a*r+u*i*c-t*h*c-o*i*d+t*a*d)*A,this}scale(e){const t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),r=Math.sin(t),s=1-i,o=e.x,a=e.y,c=e.z,l=s*o,u=s*a;return this.set(l*o+i,l*a-r*c,l*c+r*a,0,l*a+r*c,u*a+i,u*c-r*o,0,l*c-r*a,u*c+r*o,s*c*c+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){const r=this.elements,s=t._x,o=t._y,a=t._z,c=t._w,l=s+s,u=o+o,h=a+a,d=s*l,f=s*u,g=s*h,_=o*u,m=o*h,p=a*h,x=c*l,b=c*u,y=c*h,M=i.x,w=i.y,A=i.z;return r[0]=(1-(_+p))*M,r[1]=(f+y)*M,r[2]=(g-b)*M,r[3]=0,r[4]=(f-y)*w,r[5]=(1-(d+p))*w,r[6]=(m+x)*w,r[7]=0,r[8]=(g+b)*A,r[9]=(m-x)*A,r[10]=(1-(d+_))*A,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){const r=this.elements;let s=Br.set(r[0],r[1],r[2]).length();const o=Br.set(r[4],r[5],r[6]).length(),a=Br.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],ii.copy(this);const l=1/s,u=1/o,h=1/a;return ii.elements[0]*=l,ii.elements[1]*=l,ii.elements[2]*=l,ii.elements[4]*=u,ii.elements[5]*=u,ii.elements[6]*=u,ii.elements[8]*=h,ii.elements[9]*=h,ii.elements[10]*=h,t.setFromRotationMatrix(ii),i.x=s,i.y=o,i.z=a,this}makePerspective(e,t,i,r,s,o,a=_i,c=!1){const l=this.elements,u=2*s/(t-e),h=2*s/(i-r),d=(t+e)/(t-e),f=(i+r)/(i-r);let g,_;if(c)g=s/(o-s),_=o*s/(o-s);else if(a===_i)g=-(o+s)/(o-s),_=-2*o*s/(o-s);else if(a===Ko)g=-o/(o-s),_=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=h,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,r,s,o,a=_i,c=!1){const l=this.elements,u=2/(t-e),h=2/(i-r),d=-(t+e)/(t-e),f=-(i+r)/(i-r);let g,_;if(c)g=1/(o-s),_=o/(o-s);else if(a===_i)g=-2/(o-s),_=-(o+s)/(o-s);else if(a===Ko)g=-1/(o-s),_=-s/(o-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=0,l[12]=d,l[1]=0,l[5]=h,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=g,l[14]=_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const Br=new D,ii=new $t,Dp=new D(0,0,0),Ip=new D(1,1,1),Xi=new D,yo=new D,Gn=new D,Mu=new $t,Su=new gn;class Vn{constructor(e=0,t=0,i=0,r=Vn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const r=e.elements,s=r[0],o=r[4],a=r[8],c=r[1],l=r[5],u=r[9],h=r[2],d=r[6],f=r[10];switch(t){case"XYZ":this._y=Math.asin(mt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-mt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(mt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,f),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-mt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(mt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-mt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Mu.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Mu,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Su.setFromEuler(this),this.setFromQuaternion(Su,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Vn.DEFAULT_ORDER="XYZ";class El{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Up=0;const Eu=new D,Vr=new gn,Ti=new $t,bo=new D,As=new D,Np=new D,Op=new gn,wu=new D(1,0,0),Tu=new D(0,1,0),Au=new D(0,0,1),Ru={type:"added"},Fp={type:"removed"},Hr={type:"childadded",child:null},za={type:"childremoved",child:null};class un extends Rr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Up++}),this.uuid=Cr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=un.DEFAULT_UP.clone();const e=new D,t=new Vn,i=new gn,r=new D(1,1,1);function s(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new $t},normalMatrix:{value:new pt}}),this.matrix=new $t,this.matrixWorld=new $t,this.matrixAutoUpdate=un.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=un.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new El,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Vr.setFromAxisAngle(e,t),this.quaternion.multiply(Vr),this}rotateOnWorldAxis(e,t){return Vr.setFromAxisAngle(e,t),this.quaternion.premultiply(Vr),this}rotateX(e){return this.rotateOnAxis(wu,e)}rotateY(e){return this.rotateOnAxis(Tu,e)}rotateZ(e){return this.rotateOnAxis(Au,e)}translateOnAxis(e,t){return Eu.copy(e).applyQuaternion(this.quaternion),this.position.add(Eu.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(wu,e)}translateY(e){return this.translateOnAxis(Tu,e)}translateZ(e){return this.translateOnAxis(Au,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ti.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?bo.copy(e):bo.set(e,t,i);const r=this.parent;this.updateWorldMatrix(!0,!1),As.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ti.lookAt(As,bo,this.up):Ti.lookAt(bo,As,this.up),this.quaternion.setFromRotationMatrix(Ti),r&&(Ti.extractRotation(r.matrixWorld),Vr.setFromRotationMatrix(Ti),this.quaternion.premultiply(Vr.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Ru),Hr.child=e,this.dispatchEvent(Hr),Hr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Fp),za.child=e,this.dispatchEvent(za),za.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ti.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ti.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ti),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Ru),Hr.child=e,this.dispatchEvent(Hr),Hr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(As,e,Np),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(As,Op,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(a=>({...a})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){const h=c[l];s(e.shapes,h)}else s(e.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(s(e.materials,this.material[c]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];r.animations.push(s(e.animations,c))}}if(t){const a=o(e.geometries),c=o(e.materials),l=o(e.textures),u=o(e.images),h=o(e.shapes),d=o(e.skeletons),f=o(e.animations),g=o(e.nodes);a.length>0&&(i.geometries=a),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),u.length>0&&(i.images=u),h.length>0&&(i.shapes=h),d.length>0&&(i.skeletons=d),f.length>0&&(i.animations=f),g.length>0&&(i.nodes=g)}return i.object=r,i;function o(a){const c=[];for(const l in a){const u=a[l];delete u.metadata,c.push(u)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}un.DEFAULT_UP=new D(0,1,0);un.DEFAULT_MATRIX_AUTO_UPDATE=!0;un.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const ri=new D,Ai=new D,Ba=new D,Ri=new D,Gr=new D,Wr=new D,Cu=new D,Va=new D,Ha=new D,Ga=new D,Wa=new en,$a=new en,qa=new en;class Kn{constructor(e=new D,t=new D,i=new D){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),ri.subVectors(e,t),r.cross(ri);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){ri.subVectors(r,t),Ai.subVectors(i,t),Ba.subVectors(e,t);const o=ri.dot(ri),a=ri.dot(Ai),c=ri.dot(Ba),l=Ai.dot(Ai),u=Ai.dot(Ba),h=o*l-a*a;if(h===0)return s.set(0,0,0),null;const d=1/h,f=(l*c-a*u)*d,g=(o*u-a*c)*d;return s.set(1-f-g,g,f)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,Ri)===null?!1:Ri.x>=0&&Ri.y>=0&&Ri.x+Ri.y<=1}static getInterpolation(e,t,i,r,s,o,a,c){return this.getBarycoord(e,t,i,r,Ri)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,Ri.x),c.addScaledVector(o,Ri.y),c.addScaledVector(a,Ri.z),c)}static getInterpolatedAttribute(e,t,i,r,s,o){return Wa.setScalar(0),$a.setScalar(0),qa.setScalar(0),Wa.fromBufferAttribute(e,t),$a.fromBufferAttribute(e,i),qa.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(Wa,s.x),o.addScaledVector($a,s.y),o.addScaledVector(qa,s.z),o}static isFrontFacing(e,t,i,r){return ri.subVectors(i,t),Ai.subVectors(e,t),ri.cross(Ai).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ri.subVectors(this.c,this.b),Ai.subVectors(this.a,this.b),ri.cross(Ai).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Kn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Kn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,r,s){return Kn.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return Kn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Kn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,r=this.b,s=this.c;let o,a;Gr.subVectors(r,i),Wr.subVectors(s,i),Va.subVectors(e,i);const c=Gr.dot(Va),l=Wr.dot(Va);if(c<=0&&l<=0)return t.copy(i);Ha.subVectors(e,r);const u=Gr.dot(Ha),h=Wr.dot(Ha);if(u>=0&&h<=u)return t.copy(r);const d=c*h-u*l;if(d<=0&&c>=0&&u<=0)return o=c/(c-u),t.copy(i).addScaledVector(Gr,o);Ga.subVectors(e,s);const f=Gr.dot(Ga),g=Wr.dot(Ga);if(g>=0&&f<=g)return t.copy(s);const _=f*l-c*g;if(_<=0&&l>=0&&g<=0)return a=l/(l-g),t.copy(i).addScaledVector(Wr,a);const m=u*g-f*h;if(m<=0&&h-u>=0&&f-g>=0)return Cu.subVectors(s,r),a=(h-u)/(h-u+(f-g)),t.copy(r).addScaledVector(Cu,a);const p=1/(m+_+d);return o=_*p,a=d*p,t.copy(i).addScaledVector(Gr,o).addScaledVector(Wr,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const ud={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Yi={h:0,s:0,l:0},Mo={h:0,s:0,l:0};function Xa(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class St{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=wn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,At.colorSpaceToWorking(this,t),this}setRGB(e,t,i,r=At.workingColorSpace){return this.r=e,this.g=t,this.b=i,At.colorSpaceToWorking(this,r),this}setHSL(e,t,i,r=At.workingColorSpace){if(e=Ml(e,1),t=mt(t,0,1),i=mt(i,0,1),t===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+t):i+t-i*t,o=2*i-s;this.r=Xa(o,s,e+1/3),this.g=Xa(o,s,e),this.b=Xa(o,s,e-1/3)}return At.colorSpaceToWorking(this,r),this}setStyle(e,t=wn){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=wn){const i=ud[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Oi(e.r),this.g=Oi(e.g),this.b=Oi(e.b),this}copyLinearToSRGB(e){return this.r=is(e.r),this.g=is(e.g),this.b=is(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=wn){return At.workingToColorSpace(Sn.copy(this),e),Math.round(mt(Sn.r*255,0,255))*65536+Math.round(mt(Sn.g*255,0,255))*256+Math.round(mt(Sn.b*255,0,255))}getHexString(e=wn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=At.workingColorSpace){At.workingToColorSpace(Sn.copy(this),t);const i=Sn.r,r=Sn.g,s=Sn.b,o=Math.max(i,r,s),a=Math.min(i,r,s);let c,l;const u=(a+o)/2;if(a===o)c=0,l=0;else{const h=o-a;switch(l=u<=.5?h/(o+a):h/(2-o-a),o){case i:c=(r-s)/h+(r<s?6:0);break;case r:c=(s-i)/h+2;break;case s:c=(i-r)/h+4;break}c/=6}return e.h=c,e.s=l,e.l=u,e}getRGB(e,t=At.workingColorSpace){return At.workingToColorSpace(Sn.copy(this),t),e.r=Sn.r,e.g=Sn.g,e.b=Sn.b,e}getStyle(e=wn){At.workingToColorSpace(Sn.copy(this),e);const t=Sn.r,i=Sn.g,r=Sn.b;return e!==wn?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(Yi),this.setHSL(Yi.h+e,Yi.s+t,Yi.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Yi),e.getHSL(Mo);const i=Os(Yi.h,Mo.h,t),r=Os(Yi.s,Mo.s,t),s=Os(Yi.l,Mo.l,t);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*r,this.g=s[1]*t+s[4]*i+s[7]*r,this.b=s[2]*t+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Sn=new St;St.NAMES=ud;let kp=0;class ps extends Rr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:kp++}),this.uuid=Cr(),this.name="",this.type="Material",this.blending=ts,this.side=sr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=pc,this.blendDst=mc,this.blendEquation=yr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new St(0,0,0),this.blendAlpha=0,this.depthFunc=cs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=pu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Nr,this.stencilZFail=Nr,this.stencilZPass=Nr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==ts&&(i.blending=this.blending),this.side!==sr&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==pc&&(i.blendSrc=this.blendSrc),this.blendDst!==mc&&(i.blendDst=this.blendDst),this.blendEquation!==yr&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==cs&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==pu&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Nr&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Nr&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Nr&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const o=[];for(const a in s){const c=s[a];delete c.metadata,o.push(c)}return o}if(t){const s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class jn extends ps{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new St(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Vn,this.combine=jh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const sn=new D,So=new ye;let zp=0;class Jn{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:zp++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=mu,this.updateRanges=[],this.gpuType=Ui,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)So.fromBufferAttribute(this,t),So.applyMatrix3(e),this.setXY(t,So.x,So.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)sn.fromBufferAttribute(this,t),sn.applyMatrix3(e),this.setXYZ(t,sn.x,sn.y,sn.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)sn.fromBufferAttribute(this,t),sn.applyMatrix4(e),this.setXYZ(t,sn.x,sn.y,sn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)sn.fromBufferAttribute(this,t),sn.applyNormalMatrix(e),this.setXYZ(t,sn.x,sn.y,sn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)sn.fromBufferAttribute(this,t),sn.transformDirection(e),this.setXYZ(t,sn.x,sn.y,sn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Zr(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Ln(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Zr(t,this.array)),t}setX(e,t){return this.normalized&&(t=Ln(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Zr(t,this.array)),t}setY(e,t){return this.normalized&&(t=Ln(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Zr(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Ln(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Zr(t,this.array)),t}setW(e,t){return this.normalized&&(t=Ln(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Ln(t,this.array),i=Ln(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=Ln(t,this.array),i=Ln(i,this.array),r=Ln(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=Ln(t,this.array),i=Ln(i,this.array),r=Ln(r,this.array),s=Ln(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==mu&&(e.usage=this.usage),e}}class hd extends Jn{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class dd extends Jn{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class It extends Jn{constructor(e,t,i){super(new Float32Array(e),t,i)}}let Bp=0;const Xn=new $t,Ya=new un,$r=new D,Wn=new ir,Rs=new ir,mn=new D;class hn extends Rr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Bp++}),this.uuid=Cr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(cd(e)?dd:hd)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new pt().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Xn.makeRotationFromQuaternion(e),this.applyMatrix4(Xn),this}rotateX(e){return Xn.makeRotationX(e),this.applyMatrix4(Xn),this}rotateY(e){return Xn.makeRotationY(e),this.applyMatrix4(Xn),this}rotateZ(e){return Xn.makeRotationZ(e),this.applyMatrix4(Xn),this}translate(e,t,i){return Xn.makeTranslation(e,t,i),this.applyMatrix4(Xn),this}scale(e,t,i){return Xn.makeScale(e,t,i),this.applyMatrix4(Xn),this}lookAt(e){return Ya.lookAt(e),Ya.updateMatrix(),this.applyMatrix4(Ya.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter($r).negate(),this.translate($r.x,$r.y,$r.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const o=e[r];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new It(i,3))}else{const i=Math.min(e.length,t.count);for(let r=0;r<i;r++){const s=e[r];t.setXYZ(r,s.x,s.y,s.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ir);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){const s=t[i];Wn.setFromBufferAttribute(s),this.morphTargetsRelative?(mn.addVectors(this.boundingBox.min,Wn.min),this.boundingBox.expandByPoint(mn),mn.addVectors(this.boundingBox.max,Wn.max),this.boundingBox.expandByPoint(mn)):(this.boundingBox.expandByPoint(Wn.min),this.boundingBox.expandByPoint(Wn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new la);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(e){const i=this.boundingSphere.center;if(Wn.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){const a=t[s];Rs.setFromBufferAttribute(a),this.morphTargetsRelative?(mn.addVectors(Wn.min,Rs.min),Wn.expandByPoint(mn),mn.addVectors(Wn.max,Rs.max),Wn.expandByPoint(mn)):(Wn.expandByPoint(Rs.min),Wn.expandByPoint(Rs.max))}Wn.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)mn.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(mn));if(t)for(let s=0,o=t.length;s<o;s++){const a=t[s],c=this.morphTargetsRelative;for(let l=0,u=a.count;l<u;l++)mn.fromBufferAttribute(a,l),c&&($r.fromBufferAttribute(e,l),mn.add($r)),r=Math.max(r,i.distanceToSquared(mn))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Jn(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),a=[],c=[];for(let C=0;C<i.count;C++)a[C]=new D,c[C]=new D;const l=new D,u=new D,h=new D,d=new ye,f=new ye,g=new ye,_=new D,m=new D;function p(C,S,E){l.fromBufferAttribute(i,C),u.fromBufferAttribute(i,S),h.fromBufferAttribute(i,E),d.fromBufferAttribute(s,C),f.fromBufferAttribute(s,S),g.fromBufferAttribute(s,E),u.sub(l),h.sub(l),f.sub(d),g.sub(d);const U=1/(f.x*g.y-g.x*f.y);isFinite(U)&&(_.copy(u).multiplyScalar(g.y).addScaledVector(h,-f.y).multiplyScalar(U),m.copy(h).multiplyScalar(f.x).addScaledVector(u,-g.x).multiplyScalar(U),a[C].add(_),a[S].add(_),a[E].add(_),c[C].add(m),c[S].add(m),c[E].add(m))}let x=this.groups;x.length===0&&(x=[{start:0,count:e.count}]);for(let C=0,S=x.length;C<S;++C){const E=x[C],U=E.start,k=E.count;for(let $=U,H=U+k;$<H;$+=3)p(e.getX($+0),e.getX($+1),e.getX($+2))}const b=new D,y=new D,M=new D,w=new D;function A(C){M.fromBufferAttribute(r,C),w.copy(M);const S=a[C];b.copy(S),b.sub(M.multiplyScalar(M.dot(S))).normalize(),y.crossVectors(w,S);const U=y.dot(c[C])<0?-1:1;o.setXYZW(C,b.x,b.y,b.z,U)}for(let C=0,S=x.length;C<S;++C){const E=x[C],U=E.start,k=E.count;for(let $=U,H=U+k;$<H;$+=3)A(e.getX($+0)),A(e.getX($+1)),A(e.getX($+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Jn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);const r=new D,s=new D,o=new D,a=new D,c=new D,l=new D,u=new D,h=new D;if(e)for(let d=0,f=e.count;d<f;d+=3){const g=e.getX(d+0),_=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,g),s.fromBufferAttribute(t,_),o.fromBufferAttribute(t,m),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),a.fromBufferAttribute(i,g),c.fromBufferAttribute(i,_),l.fromBufferAttribute(i,m),a.add(u),c.add(u),l.add(u),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(_,c.x,c.y,c.z),i.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,f=t.count;d<f;d+=3)r.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),i.setXYZ(d+0,u.x,u.y,u.z),i.setXYZ(d+1,u.x,u.y,u.z),i.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)mn.fromBufferAttribute(e,t),mn.normalize(),e.setXYZ(t,mn.x,mn.y,mn.z)}toNonIndexed(){function e(a,c){const l=a.array,u=a.itemSize,h=a.normalized,d=new l.constructor(c.length*u);let f=0,g=0;for(let _=0,m=c.length;_<m;_++){a.isInterleavedBufferAttribute?f=c[_]*a.data.stride+a.offset:f=c[_]*u;for(let p=0;p<u;p++)d[g++]=l[f++]}return new Jn(d,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new hn,i=this.index.array,r=this.attributes;for(const a in r){const c=r[a],l=e(c,i);t.setAttribute(a,l)}const s=this.morphAttributes;for(const a in s){const c=[],l=s[a];for(let u=0,h=l.length;u<h;u++){const d=l[u],f=e(d,i);c.push(f)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const c in i){const l=i[c];e.data.attributes[c]=l.toJSON(e.data)}const r={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],u=[];for(let h=0,d=l.length;h<d;h++){const f=l[h];u.push(f.toJSON(e.data))}u.length>0&&(r[c]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const r=e.attributes;for(const l in r){const u=r[l];this.setAttribute(l,u.clone(t))}const s=e.morphAttributes;for(const l in s){const u=[],h=s[l];for(let d=0,f=h.length;d<f;d++)u.push(h[d].clone(t));this.morphAttributes[l]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let l=0,u=o.length;l<u;l++){const h=o[l];this.addGroup(h.start,h.count,h.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Pu=new $t,mr=new ua,Eo=new la,Lu=new D,wo=new D,To=new D,Ao=new D,ja=new D,Ro=new D,Du=new D,Co=new D;class Rn extends un{constructor(e=new hn,t=new jn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(r,e);const a=this.morphTargetInfluences;if(s&&a){Ro.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const u=a[c],h=s[c];u!==0&&(ja.fromBufferAttribute(h,e),o?Ro.addScaledVector(ja,u):Ro.addScaledVector(ja.sub(t),u))}t.add(Ro)}return t}raycast(e,t){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Eo.copy(i.boundingSphere),Eo.applyMatrix4(s),mr.copy(e.ray).recast(e.near),!(Eo.containsPoint(mr.origin)===!1&&(mr.intersectSphere(Eo,Lu)===null||mr.origin.distanceToSquared(Lu)>(e.far-e.near)**2))&&(Pu.copy(s).invert(),mr.copy(e.ray).applyMatrix4(Pu),!(i.boundingBox!==null&&mr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,mr)))}_computeIntersections(e,t,i){let r;const s=this.geometry,o=this.material,a=s.index,c=s.attributes.position,l=s.attributes.uv,u=s.attributes.uv1,h=s.attributes.normal,d=s.groups,f=s.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=o[m.materialIndex],x=Math.max(m.start,f.start),b=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let y=x,M=b;y<M;y+=3){const w=a.getX(y),A=a.getX(y+1),C=a.getX(y+2);r=Po(this,p,e,i,l,u,h,w,A,C),r&&(r.faceIndex=Math.floor(y/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const g=Math.max(0,f.start),_=Math.min(a.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const x=a.getX(m),b=a.getX(m+1),y=a.getX(m+2);r=Po(this,o,e,i,l,u,h,x,b,y),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=o[m.materialIndex],x=Math.max(m.start,f.start),b=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let y=x,M=b;y<M;y+=3){const w=y,A=y+1,C=y+2;r=Po(this,p,e,i,l,u,h,w,A,C),r&&(r.faceIndex=Math.floor(y/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const g=Math.max(0,f.start),_=Math.min(c.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const x=m,b=m+1,y=m+2;r=Po(this,o,e,i,l,u,h,x,b,y),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}}}function Vp(n,e,t,i,r,s,o,a){let c;if(e.side===Bn?c=i.intersectTriangle(o,s,r,!0,a):c=i.intersectTriangle(r,s,o,e.side===sr,a),c===null)return null;Co.copy(a),Co.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(Co);return l<t.near||l>t.far?null:{distance:l,point:Co.clone(),object:n}}function Po(n,e,t,i,r,s,o,a,c,l){n.getVertexPosition(a,wo),n.getVertexPosition(c,To),n.getVertexPosition(l,Ao);const u=Vp(n,e,t,i,wo,To,Ao,Du);if(u){const h=new D;Kn.getBarycoord(Du,wo,To,Ao,h),r&&(u.uv=Kn.getInterpolatedAttribute(r,a,c,l,h,new ye)),s&&(u.uv1=Kn.getInterpolatedAttribute(s,a,c,l,h,new ye)),o&&(u.normal=Kn.getInterpolatedAttribute(o,a,c,l,h,new D),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const d={a,b:c,c:l,normal:new D,materialIndex:0};Kn.getNormal(wo,To,Ao,d.normal),u.face=d,u.barycoord=h}return u}class Yt extends hn{constructor(e=1,t=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const c=[],l=[],u=[],h=[];let d=0,f=0;g("z","y","x",-1,-1,i,t,e,o,s,0),g("z","y","x",1,-1,i,t,-e,o,s,1),g("x","z","y",1,1,e,i,t,r,o,2),g("x","z","y",1,-1,e,i,-t,r,o,3),g("x","y","z",1,-1,e,t,i,r,s,4),g("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(c),this.setAttribute("position",new It(l,3)),this.setAttribute("normal",new It(u,3)),this.setAttribute("uv",new It(h,2));function g(_,m,p,x,b,y,M,w,A,C,S){const E=y/A,U=M/C,k=y/2,$=M/2,H=w/2,X=A+1,G=C+1;let W=0,N=0;const fe=new D;for(let oe=0;oe<G;oe++){const K=oe*U-$;for(let $e=0;$e<X;$e++){const at=$e*E-k;fe[_]=at*x,fe[m]=K*b,fe[p]=H,l.push(fe.x,fe.y,fe.z),fe[_]=0,fe[m]=0,fe[p]=w>0?1:-1,u.push(fe.x,fe.y,fe.z),h.push($e/A),h.push(1-oe/C),W+=1}}for(let oe=0;oe<C;oe++)for(let K=0;K<A;K++){const $e=d+K+X*oe,at=d+K+X*(oe+1),Oe=d+(K+1)+X*(oe+1),gt=d+(K+1)+X*oe;c.push($e,at,gt),c.push(at,Oe,gt),N+=6}a.addGroup(f,N,S),f+=N,d+=W}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Yt(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function ds(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const r=n[t][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone():Array.isArray(r)?e[t][i]=r.slice():e[t][i]=r}}return e}function Dn(n){const e={};for(let t=0;t<n.length;t++){const i=ds(n[t]);for(const r in i)e[r]=i[r]}return e}function Hp(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function fd(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:At.workingColorSpace}const Gp={clone:ds,merge:Dn};var Wp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,$p=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class or extends ps{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Wp,this.fragmentShader=$p,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ds(e.uniforms),this.uniformsGroups=Hp(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?t.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[r]={type:"m4",value:o.toArray()}:t.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class pd extends un{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new $t,this.projectionMatrix=new $t,this.projectionMatrixInverse=new $t,this.coordinateSystem=_i,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ji=new D,Iu=new ye,Uu=new ye;class Zn extends pd{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Ys*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(ns*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ys*2*Math.atan(Math.tan(ns*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){ji.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(ji.x,ji.y).multiplyScalar(-e/ji.z),ji.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ji.x,ji.y).multiplyScalar(-e/ji.z)}getViewSize(e,t){return this.getViewBounds(e,Iu,Uu),t.subVectors(Uu,Iu)}setViewOffset(e,t,i,r,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(ns*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;s+=o.offsetX*r/c,t-=o.offsetY*i/l,r*=o.width/c,i*=o.height/l}const a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const qr=-90,Xr=1;class qp extends un{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Zn(qr,Xr,e,t);r.layers=this.layers,this.add(r);const s=new Zn(qr,Xr,e,t);s.layers=this.layers,this.add(s);const o=new Zn(qr,Xr,e,t);o.layers=this.layers,this.add(o);const a=new Zn(qr,Xr,e,t);a.layers=this.layers,this.add(a);const c=new Zn(qr,Xr,e,t);c.layers=this.layers,this.add(c);const l=new Zn(qr,Xr,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,r,s,o,a,c]=t;for(const l of t)this.remove(l);if(e===_i)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Ko)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,c,l,u]=this.children,h=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(t,s),e.setRenderTarget(i,1,r),e.render(t,o),e.setRenderTarget(i,2,r),e.render(t,a),e.setRenderTarget(i,3,r),e.render(t,c),e.setRenderTarget(i,4,r),e.render(t,l),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,r),e.render(t,u),e.setRenderTarget(h,d,f),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class md extends Nn{constructor(e=[],t=ls,i,r,s,o,a,c,l,u){super(e,t,i,r,s,o,a,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Xp extends Tr{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new md(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Yt(5,5,5),s=new or({name:"CubemapFromEquirect",uniforms:ds(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Bn,blending:tr});s.uniforms.tEquirect.value=t;const o=new Rn(r,s),a=t.minFilter;return t.minFilter===Qi&&(t.minFilter=ai),new qp(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,i=!0,r=!0){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,r);e.setRenderTarget(s)}}class Qt extends un{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Yp={type:"move"};class Za{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Qt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Qt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Qt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){o=!0;for(const _ of e.hand.values()){const m=t.getJointPose(_,i),p=this._getHandJoint(l,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const u=l.joints["index-finger-tip"],h=l.joints["thumb-tip"],d=u.position.distanceTo(h.position),f=.02,g=.005;l.inputState.pinching&&d>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&d<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Yp)))}return a!==null&&(a.visible=r!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Qt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class wl{constructor(e,t=1,i=1e3){this.isFog=!0,this.name="",this.color=new St(e),this.near=t,this.far=i}clone(){return new wl(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class jp extends un{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Vn,this.environmentIntensity=1,this.environmentRotation=new Vn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Ka=new D,Zp=new D,Kp=new pt;class Li{constructor(e=new D(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const r=Ka.subVectors(i,t).cross(Zp.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(Ka),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||Kp.getNormalMatrix(e),r=this.coplanarPoint(Ka).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const gr=new la,Jp=new ye(.5,.5),Lo=new D;class Tl{constructor(e=new Li,t=new Li,i=new Li,r=new Li,s=new Li,o=new Li){this.planes=[e,t,i,r,s,o]}set(e,t,i,r,s,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=_i,i=!1){const r=this.planes,s=e.elements,o=s[0],a=s[1],c=s[2],l=s[3],u=s[4],h=s[5],d=s[6],f=s[7],g=s[8],_=s[9],m=s[10],p=s[11],x=s[12],b=s[13],y=s[14],M=s[15];if(r[0].setComponents(l-o,f-u,p-g,M-x).normalize(),r[1].setComponents(l+o,f+u,p+g,M+x).normalize(),r[2].setComponents(l+a,f+h,p+_,M+b).normalize(),r[3].setComponents(l-a,f-h,p-_,M-b).normalize(),i)r[4].setComponents(c,d,m,y).normalize(),r[5].setComponents(l-c,f-d,p-m,M-y).normalize();else if(r[4].setComponents(l-c,f-d,p-m,M-y).normalize(),t===_i)r[5].setComponents(l+c,f+d,p+m,M+y).normalize();else if(t===Ko)r[5].setComponents(c,d,m,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),gr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),gr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(gr)}intersectsSprite(e){gr.center.set(0,0,0);const t=Jp.distanceTo(e.center);return gr.radius=.7071067811865476+t,gr.applyMatrix4(e.matrixWorld),this.intersectsSphere(gr)}intersectsSphere(e){const t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const r=t[i];if(Lo.x=r.normal.x>0?e.max.x:e.min.x,Lo.y=r.normal.y>0?e.max.y:e.min.y,Lo.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Lo)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Qo extends ps{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new St(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const ea=new D,ta=new D,Nu=new $t,Cs=new ua,Do=new la,Ja=new D,Ou=new D;class tl extends un{constructor(e=new hn,t=new Qo){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let r=1,s=t.count;r<s;r++)ea.fromBufferAttribute(t,r-1),ta.fromBufferAttribute(t,r),i[r]=i[r-1],i[r]+=ea.distanceTo(ta);e.setAttribute("lineDistance",new It(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Do.copy(i.boundingSphere),Do.applyMatrix4(r),Do.radius+=s,e.ray.intersectsSphere(Do)===!1)return;Nu.copy(r).invert(),Cs.copy(e.ray).applyMatrix4(Nu);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,u=i.index,d=i.attributes.position;if(u!==null){const f=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let _=f,m=g-1;_<m;_+=l){const p=u.getX(_),x=u.getX(_+1),b=Io(this,e,Cs,c,p,x,_);b&&t.push(b)}if(this.isLineLoop){const _=u.getX(g-1),m=u.getX(f),p=Io(this,e,Cs,c,_,m,g-1);p&&t.push(p)}}else{const f=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let _=f,m=g-1;_<m;_+=l){const p=Io(this,e,Cs,c,_,_+1,_);p&&t.push(p)}if(this.isLineLoop){const _=Io(this,e,Cs,c,g-1,f,g-1);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function Io(n,e,t,i,r,s,o){const a=n.geometry.attributes.position;if(ea.fromBufferAttribute(a,r),ta.fromBufferAttribute(a,s),t.distanceSqToSegment(ea,ta,Ja,Ou)>i)return;Ja.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(Ja);if(!(l<e.near||l>e.far))return{distance:l,point:Ou.clone().applyMatrix4(n.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:n}}const Fu=new D,ku=new D;class Qp extends tl{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let r=0,s=t.count;r<s;r+=2)Fu.fromBufferAttribute(t,r),ku.fromBufferAttribute(t,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+Fu.distanceTo(ku);e.setAttribute("lineDistance",new It(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class nl extends Nn{constructor(e,t,i,r,s,o,a,c,l){super(e,t,i,r,s,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class gd extends Nn{constructor(e,t,i=wr,r,s,o,a=ui,c=ui,l,u=qs,h=1){if(u!==qs&&u!==Xs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:t,depth:h};super(d,r,s,o,a,c,u,i,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Sl(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class vd extends Nn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Al extends hn{constructor(e=1,t=1,i=4,r=8,s=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:i,radialSegments:r,heightSegments:s},t=Math.max(0,t),i=Math.max(1,Math.floor(i)),r=Math.max(3,Math.floor(r)),s=Math.max(1,Math.floor(s));const o=[],a=[],c=[],l=[],u=t/2,h=Math.PI/2*e,d=t,f=2*h+d,g=i*2+s,_=r+1,m=new D,p=new D;for(let x=0;x<=g;x++){let b=0,y=0,M=0,w=0;if(x<=i){const S=x/i,E=S*Math.PI/2;y=-u-e*Math.cos(E),M=e*Math.sin(E),w=-e*Math.cos(E),b=S*h}else if(x<=i+s){const S=(x-i)/s;y=-u+S*t,M=e,w=0,b=h+S*d}else{const S=(x-i-s)/i,E=S*Math.PI/2;y=u+e*Math.sin(E),M=e*Math.cos(E),w=e*Math.sin(E),b=h+d+S*h}const A=Math.max(0,Math.min(1,b/f));let C=0;x===0?C=.5/r:x===g&&(C=-.5/r);for(let S=0;S<=r;S++){const E=S/r,U=E*Math.PI*2,k=Math.sin(U),$=Math.cos(U);p.x=-M*$,p.y=y,p.z=M*k,a.push(p.x,p.y,p.z),m.set(-M*$,w,M*k),m.normalize(),c.push(m.x,m.y,m.z),l.push(E+C,A)}if(x>0){const S=(x-1)*_;for(let E=0;E<r;E++){const U=S+E,k=S+E+1,$=x*_+E,H=x*_+E+1;o.push(U,k,$),o.push(k,H,$)}}}this.setIndex(o),this.setAttribute("position",new It(a,3)),this.setAttribute("normal",new It(c,3)),this.setAttribute("uv",new It(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Al(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}}class ht extends hn{constructor(e=1,t=1,i=1,r=32,s=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:r,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:c};const l=this;r=Math.floor(r),s=Math.floor(s);const u=[],h=[],d=[],f=[];let g=0;const _=[],m=i/2;let p=0;x(),o===!1&&(e>0&&b(!0),t>0&&b(!1)),this.setIndex(u),this.setAttribute("position",new It(h,3)),this.setAttribute("normal",new It(d,3)),this.setAttribute("uv",new It(f,2));function x(){const y=new D,M=new D;let w=0;const A=(t-e)/i;for(let C=0;C<=s;C++){const S=[],E=C/s,U=E*(t-e)+e;for(let k=0;k<=r;k++){const $=k/r,H=$*c+a,X=Math.sin(H),G=Math.cos(H);M.x=U*X,M.y=-E*i+m,M.z=U*G,h.push(M.x,M.y,M.z),y.set(X,A,G).normalize(),d.push(y.x,y.y,y.z),f.push($,1-E),S.push(g++)}_.push(S)}for(let C=0;C<r;C++)for(let S=0;S<s;S++){const E=_[S][C],U=_[S+1][C],k=_[S+1][C+1],$=_[S][C+1];(e>0||S!==0)&&(u.push(E,U,$),w+=3),(t>0||S!==s-1)&&(u.push(U,k,$),w+=3)}l.addGroup(p,w,0),p+=w}function b(y){const M=g,w=new ye,A=new D;let C=0;const S=y===!0?e:t,E=y===!0?1:-1;for(let k=1;k<=r;k++)h.push(0,m*E,0),d.push(0,E,0),f.push(.5,.5),g++;const U=g;for(let k=0;k<=r;k++){const H=k/r*c+a,X=Math.cos(H),G=Math.sin(H);A.x=S*G,A.y=m*E,A.z=S*X,h.push(A.x,A.y,A.z),d.push(0,E,0),w.x=X*.5+.5,w.y=G*.5*E+.5,f.push(w.x,w.y),g++}for(let k=0;k<r;k++){const $=M+k,H=U+k;y===!0?u.push(H,H+1,$):u.push(H+1,H,$),C+=3}l.addGroup(p,C,y===!0?1:2),p+=C}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ht(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Rl extends ht{constructor(e=1,t=1,i=32,r=1,s=!1,o=0,a=Math.PI*2){super(0,e,t,i,r,s,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:r,openEnded:s,thetaStart:o,thetaLength:a}}static fromJSON(e){return new Rl(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}const Uo=new D,No=new D,Qa=new D,Oo=new Kn;class em extends hn{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){const r=Math.pow(10,4),s=Math.cos(ns*t),o=e.getIndex(),a=e.getAttribute("position"),c=o?o.count:a.count,l=[0,0,0],u=["a","b","c"],h=new Array(3),d={},f=[];for(let g=0;g<c;g+=3){o?(l[0]=o.getX(g),l[1]=o.getX(g+1),l[2]=o.getX(g+2)):(l[0]=g,l[1]=g+1,l[2]=g+2);const{a:_,b:m,c:p}=Oo;if(_.fromBufferAttribute(a,l[0]),m.fromBufferAttribute(a,l[1]),p.fromBufferAttribute(a,l[2]),Oo.getNormal(Qa),h[0]=`${Math.round(_.x*r)},${Math.round(_.y*r)},${Math.round(_.z*r)}`,h[1]=`${Math.round(m.x*r)},${Math.round(m.y*r)},${Math.round(m.z*r)}`,h[2]=`${Math.round(p.x*r)},${Math.round(p.y*r)},${Math.round(p.z*r)}`,!(h[0]===h[1]||h[1]===h[2]||h[2]===h[0]))for(let x=0;x<3;x++){const b=(x+1)%3,y=h[x],M=h[b],w=Oo[u[x]],A=Oo[u[b]],C=`${y}_${M}`,S=`${M}_${y}`;S in d&&d[S]?(Qa.dot(d[S].normal)<=s&&(f.push(w.x,w.y,w.z),f.push(A.x,A.y,A.z)),d[S]=null):C in d||(d[C]={index0:l[x],index1:l[b],normal:Qa.clone()})}}for(const g in d)if(d[g]){const{index0:_,index1:m}=d[g];Uo.fromBufferAttribute(a,_),No.fromBufferAttribute(a,m),f.push(Uo.x,Uo.y,Uo.z),f.push(No.x,No.y,No.z)}this.setAttribute("position",new It(f,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class yi{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){const i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let i,r=this.getPoint(0),s=0;t.push(0);for(let o=1;o<=e;o++)i=this.getPoint(o/e),s+=i.distanceTo(r),t.push(s),r=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const i=this.getLengths();let r=0;const s=i.length;let o;t?o=t:o=e*i[s-1];let a=0,c=s-1,l;for(;a<=c;)if(r=Math.floor(a+(c-a)/2),l=i[r]-o,l<0)a=r+1;else if(l>0)c=r-1;else{c=r;break}if(r=c,i[r]===o)return r/(s-1);const u=i[r],d=i[r+1]-u,f=(o-u)/d;return(r+f)/(s-1)}getTangent(e,t){let r=e-1e-4,s=e+1e-4;r<0&&(r=0),s>1&&(s=1);const o=this.getPoint(r),a=this.getPoint(s),c=t||(o.isVector2?new ye:new D);return c.copy(a).sub(o).normalize(),c}getTangentAt(e,t){const i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){const i=new D,r=[],s=[],o=[],a=new D,c=new $t;for(let f=0;f<=e;f++){const g=f/e;r[f]=this.getTangentAt(g,new D)}s[0]=new D,o[0]=new D;let l=Number.MAX_VALUE;const u=Math.abs(r[0].x),h=Math.abs(r[0].y),d=Math.abs(r[0].z);u<=l&&(l=u,i.set(1,0,0)),h<=l&&(l=h,i.set(0,1,0)),d<=l&&i.set(0,0,1),a.crossVectors(r[0],i).normalize(),s[0].crossVectors(r[0],a),o[0].crossVectors(r[0],s[0]);for(let f=1;f<=e;f++){if(s[f]=s[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(r[f-1],r[f]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(mt(r[f-1].dot(r[f]),-1,1));s[f].applyMatrix4(c.makeRotationAxis(a,g))}o[f].crossVectors(r[f],s[f])}if(t===!0){let f=Math.acos(mt(s[0].dot(s[e]),-1,1));f/=e,r[0].dot(a.crossVectors(s[0],s[e]))>0&&(f=-f);for(let g=1;g<=e;g++)s[g].applyMatrix4(c.makeRotationAxis(r[g],f*g)),o[g].crossVectors(r[g],s[g])}return{tangents:r,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class Cl extends yi{constructor(e=0,t=0,i=1,r=1,s=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=r,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(e,t=new ye){const i=t,r=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=r;for(;s>r;)s-=r;s<Number.EPSILON&&(o?s=0:s=r),this.aClockwise===!0&&!o&&(s===r?s=-r:s=s-r);const a=this.aStartAngle+e*s;let c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const u=Math.cos(this.aRotation),h=Math.sin(this.aRotation),d=c-this.aX,f=l-this.aY;c=d*u-f*h+this.aX,l=d*h+f*u+this.aY}return i.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class tm extends Cl{constructor(e,t,i,r,s,o){super(e,t,i,i,r,s,o),this.isArcCurve=!0,this.type="ArcCurve"}}function Pl(){let n=0,e=0,t=0,i=0;function r(s,o,a,c){n=s,e=a,t=-3*s+3*o-2*a-c,i=2*s-2*o+a+c}return{initCatmullRom:function(s,o,a,c,l){r(o,a,l*(a-s),l*(c-o))},initNonuniformCatmullRom:function(s,o,a,c,l,u,h){let d=(o-s)/l-(a-s)/(l+u)+(a-o)/u,f=(a-o)/u-(c-o)/(u+h)+(c-a)/h;d*=u,f*=u,r(o,a,d,f)},calc:function(s){const o=s*s,a=o*s;return n+e*s+t*o+i*a}}}const Fo=new D,ec=new Pl,tc=new Pl,nc=new Pl;class Fs extends yi{constructor(e=[],t=!1,i="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=r}getPoint(e,t=new D){const i=t,r=this.points,s=r.length,o=(s-(this.closed?0:1))*e;let a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/s)+1)*s:c===0&&a===s-1&&(a=s-2,c=1);let l,u;this.closed||a>0?l=r[(a-1)%s]:(Fo.subVectors(r[0],r[1]).add(r[0]),l=Fo);const h=r[a%s],d=r[(a+1)%s];if(this.closed||a+2<s?u=r[(a+2)%s]:(Fo.subVectors(r[s-1],r[s-2]).add(r[s-1]),u=Fo),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(h),f),_=Math.pow(h.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(u),f);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),ec.initNonuniformCatmullRom(l.x,h.x,d.x,u.x,g,_,m),tc.initNonuniformCatmullRom(l.y,h.y,d.y,u.y,g,_,m),nc.initNonuniformCatmullRom(l.z,h.z,d.z,u.z,g,_,m)}else this.curveType==="catmullrom"&&(ec.initCatmullRom(l.x,h.x,d.x,u.x,this.tension),tc.initCatmullRom(l.y,h.y,d.y,u.y,this.tension),nc.initCatmullRom(l.z,h.z,d.z,u.z,this.tension));return i.set(ec.calc(c),tc.calc(c),nc.calc(c)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(r.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const r=this.points[t];e.points.push(r.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(new D().fromArray(r))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function zu(n,e,t,i,r){const s=(i-e)*.5,o=(r-t)*.5,a=n*n,c=n*a;return(2*t-2*i+s+o)*c+(-3*t+3*i-2*s-o)*a+s*n+t}function nm(n,e){const t=1-n;return t*t*e}function im(n,e){return 2*(1-n)*n*e}function rm(n,e){return n*n*e}function ks(n,e,t,i){return nm(n,e)+im(n,t)+rm(n,i)}function sm(n,e){const t=1-n;return t*t*t*e}function om(n,e){const t=1-n;return 3*t*t*n*e}function am(n,e){return 3*(1-n)*n*n*e}function cm(n,e){return n*n*n*e}function zs(n,e,t,i,r){return sm(n,e)+om(n,t)+am(n,i)+cm(n,r)}class _d extends yi{constructor(e=new ye,t=new ye,i=new ye,r=new ye){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=r}getPoint(e,t=new ye){const i=t,r=this.v0,s=this.v1,o=this.v2,a=this.v3;return i.set(zs(e,r.x,s.x,o.x,a.x),zs(e,r.y,s.y,o.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class lm extends yi{constructor(e=new D,t=new D,i=new D,r=new D){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=r}getPoint(e,t=new D){const i=t,r=this.v0,s=this.v1,o=this.v2,a=this.v3;return i.set(zs(e,r.x,s.x,o.x,a.x),zs(e,r.y,s.y,o.y,a.y),zs(e,r.z,s.z,o.z,a.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class xd extends yi{constructor(e=new ye,t=new ye){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ye){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ye){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class um extends yi{constructor(e=new D,t=new D){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new D){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new D){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class yd extends yi{constructor(e=new ye,t=new ye,i=new ye){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new ye){const i=t,r=this.v0,s=this.v1,o=this.v2;return i.set(ks(e,r.x,s.x,o.x),ks(e,r.y,s.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Ll extends yi{constructor(e=new D,t=new D,i=new D){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new D){const i=t,r=this.v0,s=this.v1,o=this.v2;return i.set(ks(e,r.x,s.x,o.x),ks(e,r.y,s.y,o.y),ks(e,r.z,s.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class bd extends yi{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ye){const i=t,r=this.points,s=(r.length-1)*e,o=Math.floor(s),a=s-o,c=r[o===0?o:o-1],l=r[o],u=r[o>r.length-2?r.length-1:o+1],h=r[o>r.length-3?r.length-1:o+2];return i.set(zu(a,c.x,l.x,u.x,h.x),zu(a,c.y,l.y,u.y,h.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(r.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const r=this.points[t];e.points.push(r.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(new ye().fromArray(r))}return this}}var na=Object.freeze({__proto__:null,ArcCurve:tm,CatmullRomCurve3:Fs,CubicBezierCurve:_d,CubicBezierCurve3:lm,EllipseCurve:Cl,LineCurve:xd,LineCurve3:um,QuadraticBezierCurve:yd,QuadraticBezierCurve3:Ll,SplineCurve:bd});class hm extends yi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new na[i](t,e))}return this}getPoint(e,t){const i=e*this.getLength(),r=this.getCurveLengths();let s=0;for(;s<r.length;){if(r[s]>=i){const o=r[s]-i,a=this.curves[s],c=a.getLength(),l=c===0?0:1-o/c;return a.getPointAt(l,t)}s++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let i=0,r=this.curves.length;i<r;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let i;for(let r=0,s=this.curves;r<s.length;r++){const o=s[r],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,c=o.getPoints(a);for(let l=0;l<c.length;l++){const u=c[l];i&&i.equals(u)||(t.push(u),i=u)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const r=e.curves[t];this.curves.push(r.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){const r=this.curves[t];e.curves.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const r=e.curves[t];this.curves.push(new na[r.type]().fromJSON(r))}return this}}class Bu extends hm{constructor(e){super(),this.type="Path",this.currentPoint=new ye,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const i=new xd(this.currentPoint.clone(),new ye(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,r){const s=new yd(this.currentPoint.clone(),new ye(e,t),new ye(i,r));return this.curves.push(s),this.currentPoint.set(i,r),this}bezierCurveTo(e,t,i,r,s,o){const a=new _d(this.currentPoint.clone(),new ye(e,t),new ye(i,r),new ye(s,o));return this.curves.push(a),this.currentPoint.set(s,o),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),i=new bd(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,r,s,o){const a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+a,t+c,i,r,s,o),this}absarc(e,t,i,r,s,o){return this.absellipse(e,t,i,i,r,s,o),this}ellipse(e,t,i,r,s,o,a,c){const l=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(e+l,t+u,i,r,s,o,a,c),this}absellipse(e,t,i,r,s,o,a,c){const l=new Cl(e,t,i,r,s,o,a,c);if(this.curves.length>0){const h=l.getPoint(0);h.equals(this.currentPoint)||this.lineTo(h.x,h.y)}this.curves.push(l);const u=l.getPoint(1);return this.currentPoint.copy(u),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class Md extends Bu{constructor(e){super(e),this.uuid=Cr(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let i=0,r=this.holes.length;i<r;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const r=e.holes[t];this.holes.push(r.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){const r=this.holes[t];e.holes.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const r=e.holes[t];this.holes.push(new Bu().fromJSON(r))}return this}}function dm(n,e,t=2){const i=e&&e.length,r=i?e[0]*t:n.length;let s=Sd(n,0,r,t,!0);const o=[];if(!s||s.next===s.prev)return o;let a,c,l;if(i&&(s=vm(n,e,s,t)),n.length>80*t){a=1/0,c=1/0;let u=-1/0,h=-1/0;for(let d=t;d<r;d+=t){const f=n[d],g=n[d+1];f<a&&(a=f),g<c&&(c=g),f>u&&(u=f),g>h&&(h=g)}l=Math.max(u-a,h-c),l=l!==0?32767/l:0}return Zs(s,o,t,a,c,l,0),o}function Sd(n,e,t,i,r){let s;if(r===Rm(n,e,t,i)>0)for(let o=e;o<t;o+=i)s=Vu(o/i|0,n[o],n[o+1],s);else for(let o=t-i;o>=e;o-=i)s=Vu(o/i|0,n[o],n[o+1],s);return s&&fs(s,s.next)&&(Js(s),s=s.next),s}function Ar(n,e){if(!n)return n;e||(e=n);let t=n,i;do if(i=!1,!t.steiner&&(fs(t,t.next)||Kt(t.prev,t,t.next)===0)){if(Js(t),t=e=t.prev,t===t.next)break;i=!0}else t=t.next;while(i||t!==e);return e}function Zs(n,e,t,i,r,s,o){if(!n)return;!o&&s&&Mm(n,i,r,s);let a=n;for(;n.prev!==n.next;){const c=n.prev,l=n.next;if(s?pm(n,i,r,s):fm(n)){e.push(c.i,n.i,l.i),Js(n),n=l.next,a=l.next;continue}if(n=l,n===a){o?o===1?(n=mm(Ar(n),e),Zs(n,e,t,i,r,s,2)):o===2&&gm(n,e,t,i,r,s):Zs(Ar(n),e,t,i,r,s,1);break}}}function fm(n){const e=n.prev,t=n,i=n.next;if(Kt(e,t,i)>=0)return!1;const r=e.x,s=t.x,o=i.x,a=e.y,c=t.y,l=i.y,u=Math.min(r,s,o),h=Math.min(a,c,l),d=Math.max(r,s,o),f=Math.max(a,c,l);let g=i.next;for(;g!==e;){if(g.x>=u&&g.x<=d&&g.y>=h&&g.y<=f&&Is(r,a,s,c,o,l,g.x,g.y)&&Kt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function pm(n,e,t,i){const r=n.prev,s=n,o=n.next;if(Kt(r,s,o)>=0)return!1;const a=r.x,c=s.x,l=o.x,u=r.y,h=s.y,d=o.y,f=Math.min(a,c,l),g=Math.min(u,h,d),_=Math.max(a,c,l),m=Math.max(u,h,d),p=il(f,g,e,t,i),x=il(_,m,e,t,i);let b=n.prevZ,y=n.nextZ;for(;b&&b.z>=p&&y&&y.z<=x;){if(b.x>=f&&b.x<=_&&b.y>=g&&b.y<=m&&b!==r&&b!==o&&Is(a,u,c,h,l,d,b.x,b.y)&&Kt(b.prev,b,b.next)>=0||(b=b.prevZ,y.x>=f&&y.x<=_&&y.y>=g&&y.y<=m&&y!==r&&y!==o&&Is(a,u,c,h,l,d,y.x,y.y)&&Kt(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;b&&b.z>=p;){if(b.x>=f&&b.x<=_&&b.y>=g&&b.y<=m&&b!==r&&b!==o&&Is(a,u,c,h,l,d,b.x,b.y)&&Kt(b.prev,b,b.next)>=0)return!1;b=b.prevZ}for(;y&&y.z<=x;){if(y.x>=f&&y.x<=_&&y.y>=g&&y.y<=m&&y!==r&&y!==o&&Is(a,u,c,h,l,d,y.x,y.y)&&Kt(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function mm(n,e){let t=n;do{const i=t.prev,r=t.next.next;!fs(i,r)&&wd(i,t,t.next,r)&&Ks(i,r)&&Ks(r,i)&&(e.push(i.i,t.i,r.i),Js(t),Js(t.next),t=n=r),t=t.next}while(t!==n);return Ar(t)}function gm(n,e,t,i,r,s){let o=n;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&wm(o,a)){let c=Td(o,a);o=Ar(o,o.next),c=Ar(c,c.next),Zs(o,e,t,i,r,s,0),Zs(c,e,t,i,r,s,0);return}a=a.next}o=o.next}while(o!==n)}function vm(n,e,t,i){const r=[];for(let s=0,o=e.length;s<o;s++){const a=e[s]*i,c=s<o-1?e[s+1]*i:n.length,l=Sd(n,a,c,i,!1);l===l.next&&(l.steiner=!0),r.push(Em(l))}r.sort(_m);for(let s=0;s<r.length;s++)t=xm(r[s],t);return t}function _m(n,e){let t=n.x-e.x;if(t===0&&(t=n.y-e.y,t===0)){const i=(n.next.y-n.y)/(n.next.x-n.x),r=(e.next.y-e.y)/(e.next.x-e.x);t=i-r}return t}function xm(n,e){const t=ym(n,e);if(!t)return e;const i=Td(t,n);return Ar(i,i.next),Ar(t,t.next)}function ym(n,e){let t=e;const i=n.x,r=n.y;let s=-1/0,o;if(fs(n,t))return t;do{if(fs(n,t.next))return t.next;if(r<=t.y&&r>=t.next.y&&t.next.y!==t.y){const h=t.x+(r-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(h<=i&&h>s&&(s=h,o=t.x<t.next.x?t:t.next,h===i))return o}t=t.next}while(t!==e);if(!o)return null;const a=o,c=o.x,l=o.y;let u=1/0;t=o;do{if(i>=t.x&&t.x>=c&&i!==t.x&&Ed(r<l?i:s,r,c,l,r<l?s:i,r,t.x,t.y)){const h=Math.abs(r-t.y)/(i-t.x);Ks(t,n)&&(h<u||h===u&&(t.x>o.x||t.x===o.x&&bm(o,t)))&&(o=t,u=h)}t=t.next}while(t!==a);return o}function bm(n,e){return Kt(n.prev,n,e.prev)<0&&Kt(e.next,n,n.next)<0}function Mm(n,e,t,i){let r=n;do r.z===0&&(r.z=il(r.x,r.y,e,t,i)),r.prevZ=r.prev,r.nextZ=r.next,r=r.next;while(r!==n);r.prevZ.nextZ=null,r.prevZ=null,Sm(r)}function Sm(n){let e,t=1;do{let i=n,r;n=null;let s=null;for(e=0;i;){e++;let o=i,a=0;for(let l=0;l<t&&(a++,o=o.nextZ,!!o);l++);let c=t;for(;a>0||c>0&&o;)a!==0&&(c===0||!o||i.z<=o.z)?(r=i,i=i.nextZ,a--):(r=o,o=o.nextZ,c--),s?s.nextZ=r:n=r,r.prevZ=s,s=r;i=o}s.nextZ=null,t*=2}while(e>1);return n}function il(n,e,t,i,r){return n=(n-t)*r|0,e=(e-i)*r|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,n|e<<1}function Em(n){let e=n,t=n;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==n);return t}function Ed(n,e,t,i,r,s,o,a){return(r-o)*(e-a)>=(n-o)*(s-a)&&(n-o)*(i-a)>=(t-o)*(e-a)&&(t-o)*(s-a)>=(r-o)*(i-a)}function Is(n,e,t,i,r,s,o,a){return!(n===o&&e===a)&&Ed(n,e,t,i,r,s,o,a)}function wm(n,e){return n.next.i!==e.i&&n.prev.i!==e.i&&!Tm(n,e)&&(Ks(n,e)&&Ks(e,n)&&Am(n,e)&&(Kt(n.prev,n,e.prev)||Kt(n,e.prev,e))||fs(n,e)&&Kt(n.prev,n,n.next)>0&&Kt(e.prev,e,e.next)>0)}function Kt(n,e,t){return(e.y-n.y)*(t.x-e.x)-(e.x-n.x)*(t.y-e.y)}function fs(n,e){return n.x===e.x&&n.y===e.y}function wd(n,e,t,i){const r=zo(Kt(n,e,t)),s=zo(Kt(n,e,i)),o=zo(Kt(t,i,n)),a=zo(Kt(t,i,e));return!!(r!==s&&o!==a||r===0&&ko(n,t,e)||s===0&&ko(n,i,e)||o===0&&ko(t,n,i)||a===0&&ko(t,e,i))}function ko(n,e,t){return e.x<=Math.max(n.x,t.x)&&e.x>=Math.min(n.x,t.x)&&e.y<=Math.max(n.y,t.y)&&e.y>=Math.min(n.y,t.y)}function zo(n){return n>0?1:n<0?-1:0}function Tm(n,e){let t=n;do{if(t.i!==n.i&&t.next.i!==n.i&&t.i!==e.i&&t.next.i!==e.i&&wd(t,t.next,n,e))return!0;t=t.next}while(t!==n);return!1}function Ks(n,e){return Kt(n.prev,n,n.next)<0?Kt(n,e,n.next)>=0&&Kt(n,n.prev,e)>=0:Kt(n,e,n.prev)<0||Kt(n,n.next,e)<0}function Am(n,e){let t=n,i=!1;const r=(n.x+e.x)/2,s=(n.y+e.y)/2;do t.y>s!=t.next.y>s&&t.next.y!==t.y&&r<(t.next.x-t.x)*(s-t.y)/(t.next.y-t.y)+t.x&&(i=!i),t=t.next;while(t!==n);return i}function Td(n,e){const t=rl(n.i,n.x,n.y),i=rl(e.i,e.x,e.y),r=n.next,s=e.prev;return n.next=e,e.prev=n,t.next=r,r.prev=t,i.next=t,t.prev=i,s.next=i,i.prev=s,i}function Vu(n,e,t,i){const r=rl(n,e,t);return i?(r.next=i.next,r.prev=i,i.next.prev=r,i.next=r):(r.prev=r,r.next=r),r}function Js(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function rl(n,e,t){return{i:n,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Rm(n,e,t,i){let r=0;for(let s=e,o=t-i;s<t;s+=i)r+=(n[o]-n[s])*(n[s+1]+n[o+1]),o=s;return r}class Cm{static triangulate(e,t,i=2){return dm(e,t,i)}}class Jr{static area(e){const t=e.length;let i=0;for(let r=t-1,s=0;s<t;r=s++)i+=e[r].x*e[s].y-e[s].x*e[r].y;return i*.5}static isClockWise(e){return Jr.area(e)<0}static triangulateShape(e,t){const i=[],r=[],s=[];Hu(e),Gu(i,e);let o=e.length;t.forEach(Hu);for(let c=0;c<t.length;c++)r.push(o),o+=t[c].length,Gu(i,t[c]);const a=Cm.triangulate(i,r);for(let c=0;c<a.length;c+=3)s.push(a.slice(c,c+3));return s}}function Hu(n){const e=n.length;e>2&&n[e-1].equals(n[0])&&n.pop()}function Gu(n,e){for(let t=0;t<e.length;t++)n.push(e[t].x),n.push(e[t].y)}class Dl extends hn{constructor(e=new Md([new ye(.5,.5),new ye(-.5,.5),new ye(-.5,-.5),new ye(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const i=this,r=[],s=[];for(let a=0,c=e.length;a<c;a++){const l=e[a];o(l)}this.setAttribute("position",new It(r,3)),this.setAttribute("uv",new It(s,2)),this.computeVertexNormals();function o(a){const c=[],l=t.curveSegments!==void 0?t.curveSegments:12,u=t.steps!==void 0?t.steps:1,h=t.depth!==void 0?t.depth:1;let d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:f-.1,_=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3;const p=t.extrudePath,x=t.UVGenerator!==void 0?t.UVGenerator:Pm;let b,y=!1,M,w,A,C;p&&(b=p.getSpacedPoints(u),y=!0,d=!1,M=p.computeFrenetFrames(u,!1),w=new D,A=new D,C=new D),d||(m=0,f=0,g=0,_=0);const S=a.extractPoints(l);let E=S.shape;const U=S.holes;if(!Jr.isClockWise(E)){E=E.reverse();for(let ge=0,he=U.length;ge<he;ge++){const se=U[ge];Jr.isClockWise(se)&&(U[ge]=se.reverse())}}function $(ge){const se=10000000000000001e-36;let ce=ge[0];for(let Ee=1;Ee<=ge.length;Ee++){const pe=Ee%ge.length,Me=ge[pe],et=Me.x-ce.x,it=Me.y-ce.y,I=et*et+it*it,T=Math.max(Math.abs(Me.x),Math.abs(Me.y),Math.abs(ce.x),Math.abs(ce.y)),Z=se*T*T;if(I<=Z){ge.splice(pe,1),Ee--;continue}ce=Me}}$(E),U.forEach($);const H=U.length,X=E;for(let ge=0;ge<H;ge++){const he=U[ge];E=E.concat(he)}function G(ge,he,se){return he||console.error("THREE.ExtrudeGeometry: vec does not exist"),ge.clone().addScaledVector(he,se)}const W=E.length;function N(ge,he,se){let ce,Ee,pe;const Me=ge.x-he.x,et=ge.y-he.y,it=se.x-ge.x,I=se.y-ge.y,T=Me*Me+et*et,Z=Me*I-et*it;if(Math.abs(Z)>Number.EPSILON){const ee=Math.sqrt(T),de=Math.sqrt(it*it+I*I),re=he.x-et/ee,Fe=he.y+Me/ee,be=se.x-I/de,Ge=se.y+it/de,Ve=((be-re)*I-(Ge-Fe)*it)/(Me*I-et*it);ce=re+Me*Ve-ge.x,Ee=Fe+et*Ve-ge.y;const j=ce*ce+Ee*Ee;if(j<=2)return new ye(ce,Ee);pe=Math.sqrt(j/2)}else{let ee=!1;Me>Number.EPSILON?it>Number.EPSILON&&(ee=!0):Me<-Number.EPSILON?it<-Number.EPSILON&&(ee=!0):Math.sign(et)===Math.sign(I)&&(ee=!0),ee?(ce=-et,Ee=Me,pe=Math.sqrt(T)):(ce=Me,Ee=et,pe=Math.sqrt(T/2))}return new ye(ce/pe,Ee/pe)}const fe=[];for(let ge=0,he=X.length,se=he-1,ce=ge+1;ge<he;ge++,se++,ce++)se===he&&(se=0),ce===he&&(ce=0),fe[ge]=N(X[ge],X[se],X[ce]);const oe=[];let K,$e=fe.concat();for(let ge=0,he=H;ge<he;ge++){const se=U[ge];K=[];for(let ce=0,Ee=se.length,pe=Ee-1,Me=ce+1;ce<Ee;ce++,pe++,Me++)pe===Ee&&(pe=0),Me===Ee&&(Me=0),K[ce]=N(se[ce],se[pe],se[Me]);oe.push(K),$e=$e.concat(K)}let at;if(m===0)at=Jr.triangulateShape(X,U);else{const ge=[],he=[];for(let se=0;se<m;se++){const ce=se/m,Ee=f*Math.cos(ce*Math.PI/2),pe=g*Math.sin(ce*Math.PI/2)+_;for(let Me=0,et=X.length;Me<et;Me++){const it=G(X[Me],fe[Me],pe);Xe(it.x,it.y,-Ee),ce===0&&ge.push(it)}for(let Me=0,et=H;Me<et;Me++){const it=U[Me];K=oe[Me];const I=[];for(let T=0,Z=it.length;T<Z;T++){const ee=G(it[T],K[T],pe);Xe(ee.x,ee.y,-Ee),ce===0&&I.push(ee)}ce===0&&he.push(I)}}at=Jr.triangulateShape(ge,he)}const Oe=at.length,gt=g+_;for(let ge=0;ge<W;ge++){const he=d?G(E[ge],$e[ge],gt):E[ge];y?(A.copy(M.normals[0]).multiplyScalar(he.x),w.copy(M.binormals[0]).multiplyScalar(he.y),C.copy(b[0]).add(A).add(w),Xe(C.x,C.y,C.z)):Xe(he.x,he.y,0)}for(let ge=1;ge<=u;ge++)for(let he=0;he<W;he++){const se=d?G(E[he],$e[he],gt):E[he];y?(A.copy(M.normals[ge]).multiplyScalar(se.x),w.copy(M.binormals[ge]).multiplyScalar(se.y),C.copy(b[ge]).add(A).add(w),Xe(C.x,C.y,C.z)):Xe(se.x,se.y,h/u*ge)}for(let ge=m-1;ge>=0;ge--){const he=ge/m,se=f*Math.cos(he*Math.PI/2),ce=g*Math.sin(he*Math.PI/2)+_;for(let Ee=0,pe=X.length;Ee<pe;Ee++){const Me=G(X[Ee],fe[Ee],ce);Xe(Me.x,Me.y,h+se)}for(let Ee=0,pe=U.length;Ee<pe;Ee++){const Me=U[Ee];K=oe[Ee];for(let et=0,it=Me.length;et<it;et++){const I=G(Me[et],K[et],ce);y?Xe(I.x,I.y+b[u-1].y,b[u-1].x+se):Xe(I.x,I.y,h+se)}}}te(),le();function te(){const ge=r.length/3;if(d){let he=0,se=W*he;for(let ce=0;ce<Oe;ce++){const Ee=at[ce];Be(Ee[2]+se,Ee[1]+se,Ee[0]+se)}he=u+m*2,se=W*he;for(let ce=0;ce<Oe;ce++){const Ee=at[ce];Be(Ee[0]+se,Ee[1]+se,Ee[2]+se)}}else{for(let he=0;he<Oe;he++){const se=at[he];Be(se[2],se[1],se[0])}for(let he=0;he<Oe;he++){const se=at[he];Be(se[0]+W*u,se[1]+W*u,se[2]+W*u)}}i.addGroup(ge,r.length/3-ge,0)}function le(){const ge=r.length/3;let he=0;Re(X,he),he+=X.length;for(let se=0,ce=U.length;se<ce;se++){const Ee=U[se];Re(Ee,he),he+=Ee.length}i.addGroup(ge,r.length/3-ge,1)}function Re(ge,he){let se=ge.length;for(;--se>=0;){const ce=se;let Ee=se-1;Ee<0&&(Ee=ge.length-1);for(let pe=0,Me=u+m*2;pe<Me;pe++){const et=W*pe,it=W*(pe+1),I=he+ce+et,T=he+Ee+et,Z=he+Ee+it,ee=he+ce+it;Ke(I,T,Z,ee)}}}function Xe(ge,he,se){c.push(ge),c.push(he),c.push(se)}function Be(ge,he,se){Nt(ge),Nt(he),Nt(se);const ce=r.length/3,Ee=x.generateTopUV(i,r,ce-3,ce-2,ce-1);B(Ee[0]),B(Ee[1]),B(Ee[2])}function Ke(ge,he,se,ce){Nt(ge),Nt(he),Nt(ce),Nt(he),Nt(se),Nt(ce);const Ee=r.length/3,pe=x.generateSideWallUV(i,r,Ee-6,Ee-3,Ee-2,Ee-1);B(pe[0]),B(pe[1]),B(pe[3]),B(pe[1]),B(pe[2]),B(pe[3])}function Nt(ge){r.push(c[ge*3+0]),r.push(c[ge*3+1]),r.push(c[ge*3+2])}function B(ge){s.push(ge.x),s.push(ge.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,i=this.parameters.options;return Lm(t,i,e)}static fromJSON(e,t){const i=[];for(let s=0,o=e.shapes.length;s<o;s++){const a=t[e.shapes[s]];i.push(a)}const r=e.options.extrudePath;return r!==void 0&&(e.options.extrudePath=new na[r.type]().fromJSON(r)),new Dl(i,e.options)}}const Pm={generateTopUV:function(n,e,t,i,r){const s=e[t*3],o=e[t*3+1],a=e[i*3],c=e[i*3+1],l=e[r*3],u=e[r*3+1];return[new ye(s,o),new ye(a,c),new ye(l,u)]},generateSideWallUV:function(n,e,t,i,r,s){const o=e[t*3],a=e[t*3+1],c=e[t*3+2],l=e[i*3],u=e[i*3+1],h=e[i*3+2],d=e[r*3],f=e[r*3+1],g=e[r*3+2],_=e[s*3],m=e[s*3+1],p=e[s*3+2];return Math.abs(a-u)<Math.abs(o-l)?[new ye(o,1-c),new ye(l,1-h),new ye(d,1-g),new ye(_,1-p)]:[new ye(a,1-c),new ye(u,1-h),new ye(f,1-g),new ye(m,1-p)]}};function Lm(n,e,t){if(t.shapes=[],Array.isArray(n))for(let i=0,r=n.length;i<r;i++){const s=n[i];t.shapes.push(s.uuid)}else t.shapes.push(n.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class Il extends hn{constructor(e=[new ye(0,-.5),new ye(.5,0),new ye(0,.5)],t=12,i=0,r=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:i,phiLength:r},t=Math.floor(t),r=mt(r,0,Math.PI*2);const s=[],o=[],a=[],c=[],l=[],u=1/t,h=new D,d=new ye,f=new D,g=new D,_=new D;let m=0,p=0;for(let x=0;x<=e.length-1;x++)switch(x){case 0:m=e[x+1].x-e[x].x,p=e[x+1].y-e[x].y,f.x=p*1,f.y=-m,f.z=p*0,_.copy(f),f.normalize(),c.push(f.x,f.y,f.z);break;case e.length-1:c.push(_.x,_.y,_.z);break;default:m=e[x+1].x-e[x].x,p=e[x+1].y-e[x].y,f.x=p*1,f.y=-m,f.z=p*0,g.copy(f),f.x+=_.x,f.y+=_.y,f.z+=_.z,f.normalize(),c.push(f.x,f.y,f.z),_.copy(g)}for(let x=0;x<=t;x++){const b=i+x*u*r,y=Math.sin(b),M=Math.cos(b);for(let w=0;w<=e.length-1;w++){h.x=e[w].x*y,h.y=e[w].y,h.z=e[w].x*M,o.push(h.x,h.y,h.z),d.x=x/t,d.y=w/(e.length-1),a.push(d.x,d.y);const A=c[3*w+0]*y,C=c[3*w+1],S=c[3*w+0]*M;l.push(A,C,S)}}for(let x=0;x<t;x++)for(let b=0;b<e.length-1;b++){const y=b+x*e.length,M=y,w=y+e.length,A=y+e.length+1,C=y+1;s.push(M,w,C),s.push(A,C,w)}this.setIndex(s),this.setAttribute("position",new It(o,3)),this.setAttribute("uv",new It(a,2)),this.setAttribute("normal",new It(l,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Il(e.points,e.segments,e.phiStart,e.phiLength)}}class Ni extends hn{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};const s=e/2,o=t/2,a=Math.floor(i),c=Math.floor(r),l=a+1,u=c+1,h=e/a,d=t/c,f=[],g=[],_=[],m=[];for(let p=0;p<u;p++){const x=p*d-o;for(let b=0;b<l;b++){const y=b*h-s;g.push(y,-x,0),_.push(0,0,1),m.push(b/a),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let x=0;x<a;x++){const b=x+l*p,y=x+l*(p+1),M=x+1+l*(p+1),w=x+1+l*p;f.push(b,y,w),f.push(y,M,w)}this.setIndex(f),this.setAttribute("position",new It(g,3)),this.setAttribute("normal",new It(_,3)),this.setAttribute("uv",new It(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ni(e.width,e.height,e.widthSegments,e.heightSegments)}}class Pi extends hn{constructor(e=1,t=32,i=16,r=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:r,phiLength:s,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const c=Math.min(o+a,Math.PI);let l=0;const u=[],h=new D,d=new D,f=[],g=[],_=[],m=[];for(let p=0;p<=i;p++){const x=[],b=p/i;let y=0;p===0&&o===0?y=.5/t:p===i&&c===Math.PI&&(y=-.5/t);for(let M=0;M<=t;M++){const w=M/t;h.x=-e*Math.cos(r+w*s)*Math.sin(o+b*a),h.y=e*Math.cos(o+b*a),h.z=e*Math.sin(r+w*s)*Math.sin(o+b*a),g.push(h.x,h.y,h.z),d.copy(h).normalize(),_.push(d.x,d.y,d.z),m.push(w+y,1-b),x.push(l++)}u.push(x)}for(let p=0;p<i;p++)for(let x=0;x<t;x++){const b=u[p][x+1],y=u[p][x],M=u[p+1][x],w=u[p+1][x+1];(p!==0||o>0)&&f.push(b,y,w),(p!==i-1||c<Math.PI)&&f.push(y,M,w)}this.setIndex(f),this.setAttribute("position",new It(g,3)),this.setAttribute("normal",new It(_,3)),this.setAttribute("uv",new It(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Pi(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Ki extends hn{constructor(e=1,t=.4,i=12,r=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:r,arc:s},i=Math.floor(i),r=Math.floor(r);const o=[],a=[],c=[],l=[],u=new D,h=new D,d=new D;for(let f=0;f<=i;f++)for(let g=0;g<=r;g++){const _=g/r*s,m=f/i*Math.PI*2;h.x=(e+t*Math.cos(m))*Math.cos(_),h.y=(e+t*Math.cos(m))*Math.sin(_),h.z=t*Math.sin(m),a.push(h.x,h.y,h.z),u.x=e*Math.cos(_),u.y=e*Math.sin(_),d.subVectors(h,u).normalize(),c.push(d.x,d.y,d.z),l.push(g/r),l.push(f/i)}for(let f=1;f<=i;f++)for(let g=1;g<=r;g++){const _=(r+1)*f+g-1,m=(r+1)*(f-1)+g-1,p=(r+1)*(f-1)+g,x=(r+1)*f+g;o.push(_,m,x),o.push(m,p,x)}this.setIndex(o),this.setAttribute("position",new It(a,3)),this.setAttribute("normal",new It(c,3)),this.setAttribute("uv",new It(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ki(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class Qs extends hn{constructor(e=new Ll(new D(-1,-1,0),new D(-1,1,0),new D(1,1,0)),t=64,i=1,r=8,s=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:i,radialSegments:r,closed:s};const o=e.computeFrenetFrames(t,s);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;const a=new D,c=new D,l=new ye;let u=new D;const h=[],d=[],f=[],g=[];_(),this.setIndex(g),this.setAttribute("position",new It(h,3)),this.setAttribute("normal",new It(d,3)),this.setAttribute("uv",new It(f,2));function _(){for(let b=0;b<t;b++)m(b);m(s===!1?t:0),x(),p()}function m(b){u=e.getPointAt(b/t,u);const y=o.normals[b],M=o.binormals[b];for(let w=0;w<=r;w++){const A=w/r*Math.PI*2,C=Math.sin(A),S=-Math.cos(A);c.x=S*y.x+C*M.x,c.y=S*y.y+C*M.y,c.z=S*y.z+C*M.z,c.normalize(),d.push(c.x,c.y,c.z),a.x=u.x+i*c.x,a.y=u.y+i*c.y,a.z=u.z+i*c.z,h.push(a.x,a.y,a.z)}}function p(){for(let b=1;b<=t;b++)for(let y=1;y<=r;y++){const M=(r+1)*(b-1)+(y-1),w=(r+1)*b+(y-1),A=(r+1)*b+y,C=(r+1)*(b-1)+y;g.push(M,w,C),g.push(w,A,C)}}function x(){for(let b=0;b<=t;b++)for(let y=0;y<=r;y++)l.x=b/t,l.y=y/r,f.push(l.x,l.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new Qs(new na[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}}class Ul extends ps{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new St(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new St(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=od,this.normalScale=new ye(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Vn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Dm extends ps{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Kf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Im extends ps{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Um extends Qo{constructor(e){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}}class Ad extends un{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new St(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class Nm extends Ad{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(un.DEFAULT_UP),this.updateMatrix(),this.groundColor=new St(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const ic=new $t,Wu=new D,$u=new D;class Om{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ye(512,512),this.mapType=xi,this.map=null,this.mapPass=null,this.matrix=new $t,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Tl,this._frameExtents=new ye(1,1),this._viewportCount=1,this._viewports=[new en(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;Wu.setFromMatrixPosition(e.matrixWorld),t.position.copy(Wu),$u.setFromMatrixPosition(e.target.matrixWorld),t.lookAt($u),t.updateMatrixWorld(),ic.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ic,t.coordinateSystem,t.reversedDepth),t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(ic)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class Rd extends pd{constructor(e=-1,t=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,o=i+e,a=r+t,c=r-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,o=s+l*this.view.width,a-=u*this.view.offsetY,c=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Fm extends Om{constructor(){super(new Rd(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class qu extends Ad{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(un.DEFAULT_UP),this.updateMatrix(),this.target=new un,this.shadow=new Fm}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class km extends Zn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const Xu=new $t;class zm{constructor(e,t,i=0,r=1/0){this.ray=new ua(e,t),this.near=i,this.far=r,this.camera=null,this.layers=new El,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Xu.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Xu),this}intersectObject(e,t=!0,i=[]){return sl(e,this,i,t),i.sort(Yu),i}intersectObjects(e,t=!0,i=[]){for(let r=0,s=e.length;r<s;r++)sl(e[r],this,i,t);return i.sort(Yu),i}}function Yu(n,e){return n.distance-e.distance}function sl(n,e,t,i){let r=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(r=!1),r===!0&&i===!0){const s=n.children;for(let o=0,a=s.length;o<a;o++)sl(s[o],e,t,!0)}}class ju{constructor(e=1,t=0,i=0){this.radius=e,this.phi=t,this.theta=i}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=mt(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(mt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class Bm extends Rr{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function Zu(n,e,t,i){const r=Vm(i);switch(t){case nd:return n*e;case rd:return n*e/r.components*r.byteLength;case xl:return n*e/r.components*r.byteLength;case sd:return n*e*2/r.components*r.byteLength;case yl:return n*e*2/r.components*r.byteLength;case id:return n*e*3/r.components*r.byteLength;case ci:return n*e*4/r.components*r.byteLength;case bl:return n*e*4/r.components*r.byteLength;case Wo:case $o:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case qo:case Xo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Rc:case Pc:return Math.max(n,16)*Math.max(e,8)/4;case Ac:case Cc:return Math.max(n,8)*Math.max(e,8)/2;case Lc:case Dc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Ic:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Uc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Nc:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Oc:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Fc:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case kc:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case zc:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Bc:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Vc:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Hc:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Gc:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Wc:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case $c:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case qc:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Xc:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Yc:case jc:case Zc:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Kc:case Jc:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Qc:case el:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Vm(n){switch(n){case xi:case Jh:return{byteLength:1,components:1};case Ws:case Qh:case to:return{byteLength:2,components:1};case vl:case _l:return{byteLength:2,components:4};case wr:case gl:case Ui:return{byteLength:4,components:1};case ed:case td:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ml}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ml);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Cd(){let n=null,e=!1,t=null,i=null;function r(s,o){t(s,o),i=n.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function Hm(n){const e=new WeakMap;function t(a,c){const l=a.array,u=a.usage,h=l.byteLength,d=n.createBuffer();n.bindBuffer(c,d),n.bufferData(c,l,u),a.onUploadCallback();let f;if(l instanceof Float32Array)f=n.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=n.HALF_FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=n.SHORT;else if(l instanceof Uint32Array)f=n.UNSIGNED_INT;else if(l instanceof Int32Array)f=n.INT;else if(l instanceof Int8Array)f=n.BYTE;else if(l instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:h}}function i(a,c,l){const u=c.array,h=c.updateRanges;if(n.bindBuffer(l,a),h.length===0)n.bufferSubData(l,0,u);else{h.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<h.length;f++){const g=h[d],_=h[f];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++d,h[d]=_)}h.length=d+1;for(let f=0,g=h.length;f<g;f++){const _=h[f];n.bufferSubData(l,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=e.get(a);c&&(n.deleteBuffer(c.buffer),e.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const l=e.get(a);if(l===void 0)e.set(a,t(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,a,c),l.version=a.version}}return{get:r,remove:s,update:o}}var Gm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Wm=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,$m=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,qm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Xm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Ym=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,jm=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Zm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Km=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Jm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Qm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,e0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,t0=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,n0=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,i0=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,r0=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,s0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,o0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,a0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,c0=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,l0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,u0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,h0=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,d0=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,f0=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,p0=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,m0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,g0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,v0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,_0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,x0="gl_FragColor = linearToOutputTexel( gl_FragColor );",y0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,b0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,M0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,S0=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,E0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,w0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,T0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,A0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,R0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,C0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,P0=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,L0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,D0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,I0=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,U0=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,N0=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,O0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,F0=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,k0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,z0=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,B0=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,V0=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,H0=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,G0=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,W0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,$0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,q0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,X0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Y0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,j0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Z0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,K0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,J0=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Q0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,eg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,tg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,ng=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,ig=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,rg=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,sg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,og=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,ag=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,cg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,lg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ug=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,hg=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,dg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,fg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,pg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,mg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,gg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,vg=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,_g=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,xg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,yg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,bg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Mg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Sg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Eg=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,wg=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Tg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Ag=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Rg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Cg=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Pg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Lg=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Dg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Ig=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Ug=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Ng=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Og=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Fg=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,kg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,zg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Bg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Vg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Hg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Gg=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Wg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,$g=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,qg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Xg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Yg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,jg=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Zg=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Kg=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Jg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Qg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ev=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,tv=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,nv=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,iv=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,rv=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,sv=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ov=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,av=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,cv=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,lv=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,uv=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,hv=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,dv=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,fv=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,pv=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,mv=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,gv=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,vv=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,_v=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,xv=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,yv=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,bv=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,vt={alphahash_fragment:Gm,alphahash_pars_fragment:Wm,alphamap_fragment:$m,alphamap_pars_fragment:qm,alphatest_fragment:Xm,alphatest_pars_fragment:Ym,aomap_fragment:jm,aomap_pars_fragment:Zm,batching_pars_vertex:Km,batching_vertex:Jm,begin_vertex:Qm,beginnormal_vertex:e0,bsdfs:t0,iridescence_fragment:n0,bumpmap_pars_fragment:i0,clipping_planes_fragment:r0,clipping_planes_pars_fragment:s0,clipping_planes_pars_vertex:o0,clipping_planes_vertex:a0,color_fragment:c0,color_pars_fragment:l0,color_pars_vertex:u0,color_vertex:h0,common:d0,cube_uv_reflection_fragment:f0,defaultnormal_vertex:p0,displacementmap_pars_vertex:m0,displacementmap_vertex:g0,emissivemap_fragment:v0,emissivemap_pars_fragment:_0,colorspace_fragment:x0,colorspace_pars_fragment:y0,envmap_fragment:b0,envmap_common_pars_fragment:M0,envmap_pars_fragment:S0,envmap_pars_vertex:E0,envmap_physical_pars_fragment:N0,envmap_vertex:w0,fog_vertex:T0,fog_pars_vertex:A0,fog_fragment:R0,fog_pars_fragment:C0,gradientmap_pars_fragment:P0,lightmap_pars_fragment:L0,lights_lambert_fragment:D0,lights_lambert_pars_fragment:I0,lights_pars_begin:U0,lights_toon_fragment:O0,lights_toon_pars_fragment:F0,lights_phong_fragment:k0,lights_phong_pars_fragment:z0,lights_physical_fragment:B0,lights_physical_pars_fragment:V0,lights_fragment_begin:H0,lights_fragment_maps:G0,lights_fragment_end:W0,logdepthbuf_fragment:$0,logdepthbuf_pars_fragment:q0,logdepthbuf_pars_vertex:X0,logdepthbuf_vertex:Y0,map_fragment:j0,map_pars_fragment:Z0,map_particle_fragment:K0,map_particle_pars_fragment:J0,metalnessmap_fragment:Q0,metalnessmap_pars_fragment:eg,morphinstance_vertex:tg,morphcolor_vertex:ng,morphnormal_vertex:ig,morphtarget_pars_vertex:rg,morphtarget_vertex:sg,normal_fragment_begin:og,normal_fragment_maps:ag,normal_pars_fragment:cg,normal_pars_vertex:lg,normal_vertex:ug,normalmap_pars_fragment:hg,clearcoat_normal_fragment_begin:dg,clearcoat_normal_fragment_maps:fg,clearcoat_pars_fragment:pg,iridescence_pars_fragment:mg,opaque_fragment:gg,packing:vg,premultiplied_alpha_fragment:_g,project_vertex:xg,dithering_fragment:yg,dithering_pars_fragment:bg,roughnessmap_fragment:Mg,roughnessmap_pars_fragment:Sg,shadowmap_pars_fragment:Eg,shadowmap_pars_vertex:wg,shadowmap_vertex:Tg,shadowmask_pars_fragment:Ag,skinbase_vertex:Rg,skinning_pars_vertex:Cg,skinning_vertex:Pg,skinnormal_vertex:Lg,specularmap_fragment:Dg,specularmap_pars_fragment:Ig,tonemapping_fragment:Ug,tonemapping_pars_fragment:Ng,transmission_fragment:Og,transmission_pars_fragment:Fg,uv_pars_fragment:kg,uv_pars_vertex:zg,uv_vertex:Bg,worldpos_vertex:Vg,background_vert:Hg,background_frag:Gg,backgroundCube_vert:Wg,backgroundCube_frag:$g,cube_vert:qg,cube_frag:Xg,depth_vert:Yg,depth_frag:jg,distanceRGBA_vert:Zg,distanceRGBA_frag:Kg,equirect_vert:Jg,equirect_frag:Qg,linedashed_vert:ev,linedashed_frag:tv,meshbasic_vert:nv,meshbasic_frag:iv,meshlambert_vert:rv,meshlambert_frag:sv,meshmatcap_vert:ov,meshmatcap_frag:av,meshnormal_vert:cv,meshnormal_frag:lv,meshphong_vert:uv,meshphong_frag:hv,meshphysical_vert:dv,meshphysical_frag:fv,meshtoon_vert:pv,meshtoon_frag:mv,points_vert:gv,points_frag:vv,shadow_vert:_v,shadow_frag:xv,sprite_vert:yv,sprite_frag:bv},Pe={common:{diffuse:{value:new St(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new pt},alphaMap:{value:null},alphaMapTransform:{value:new pt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new pt}},envmap:{envMap:{value:null},envMapRotation:{value:new pt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new pt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new pt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new pt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new pt},normalScale:{value:new ye(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new pt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new pt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new pt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new pt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new St(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new St(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new pt},alphaTest:{value:0},uvTransform:{value:new pt}},sprite:{diffuse:{value:new St(16777215)},opacity:{value:1},center:{value:new ye(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new pt},alphaMap:{value:null},alphaMapTransform:{value:new pt},alphaTest:{value:0}}},pi={basic:{uniforms:Dn([Pe.common,Pe.specularmap,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.fog]),vertexShader:vt.meshbasic_vert,fragmentShader:vt.meshbasic_frag},lambert:{uniforms:Dn([Pe.common,Pe.specularmap,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.fog,Pe.lights,{emissive:{value:new St(0)}}]),vertexShader:vt.meshlambert_vert,fragmentShader:vt.meshlambert_frag},phong:{uniforms:Dn([Pe.common,Pe.specularmap,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.fog,Pe.lights,{emissive:{value:new St(0)},specular:{value:new St(1118481)},shininess:{value:30}}]),vertexShader:vt.meshphong_vert,fragmentShader:vt.meshphong_frag},standard:{uniforms:Dn([Pe.common,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.roughnessmap,Pe.metalnessmap,Pe.fog,Pe.lights,{emissive:{value:new St(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:vt.meshphysical_vert,fragmentShader:vt.meshphysical_frag},toon:{uniforms:Dn([Pe.common,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.gradientmap,Pe.fog,Pe.lights,{emissive:{value:new St(0)}}]),vertexShader:vt.meshtoon_vert,fragmentShader:vt.meshtoon_frag},matcap:{uniforms:Dn([Pe.common,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.fog,{matcap:{value:null}}]),vertexShader:vt.meshmatcap_vert,fragmentShader:vt.meshmatcap_frag},points:{uniforms:Dn([Pe.points,Pe.fog]),vertexShader:vt.points_vert,fragmentShader:vt.points_frag},dashed:{uniforms:Dn([Pe.common,Pe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:vt.linedashed_vert,fragmentShader:vt.linedashed_frag},depth:{uniforms:Dn([Pe.common,Pe.displacementmap]),vertexShader:vt.depth_vert,fragmentShader:vt.depth_frag},normal:{uniforms:Dn([Pe.common,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,{opacity:{value:1}}]),vertexShader:vt.meshnormal_vert,fragmentShader:vt.meshnormal_frag},sprite:{uniforms:Dn([Pe.sprite,Pe.fog]),vertexShader:vt.sprite_vert,fragmentShader:vt.sprite_frag},background:{uniforms:{uvTransform:{value:new pt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:vt.background_vert,fragmentShader:vt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new pt}},vertexShader:vt.backgroundCube_vert,fragmentShader:vt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:vt.cube_vert,fragmentShader:vt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:vt.equirect_vert,fragmentShader:vt.equirect_frag},distanceRGBA:{uniforms:Dn([Pe.common,Pe.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:vt.distanceRGBA_vert,fragmentShader:vt.distanceRGBA_frag},shadow:{uniforms:Dn([Pe.lights,Pe.fog,{color:{value:new St(0)},opacity:{value:1}}]),vertexShader:vt.shadow_vert,fragmentShader:vt.shadow_frag}};pi.physical={uniforms:Dn([pi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new pt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new pt},clearcoatNormalScale:{value:new ye(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new pt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new pt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new pt},sheen:{value:0},sheenColor:{value:new St(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new pt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new pt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new pt},transmissionSamplerSize:{value:new ye},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new pt},attenuationDistance:{value:0},attenuationColor:{value:new St(0)},specularColor:{value:new St(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new pt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new pt},anisotropyVector:{value:new ye},anisotropyMap:{value:null},anisotropyMapTransform:{value:new pt}}]),vertexShader:vt.meshphysical_vert,fragmentShader:vt.meshphysical_frag};const Bo={r:0,b:0,g:0},vr=new Vn,Mv=new $t;function Sv(n,e,t,i,r,s,o){const a=new St(0);let c=s===!0?0:1,l,u,h=null,d=0,f=null;function g(b){let y=b.isScene===!0?b.background:null;return y&&y.isTexture&&(y=(b.backgroundBlurriness>0?t:e).get(y)),y}function _(b){let y=!1;const M=g(b);M===null?p(a,c):M&&M.isColor&&(p(M,1),y=!0);const w=n.xr.getEnvironmentBlendMode();w==="additive"?i.buffers.color.setClear(0,0,0,1,o):w==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||y)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(b,y){const M=g(y);M&&(M.isCubeTexture||M.mapping===ca)?(u===void 0&&(u=new Rn(new Yt(1,1,1),new or({name:"BackgroundCubeMaterial",uniforms:ds(pi.backgroundCube.uniforms),vertexShader:pi.backgroundCube.vertexShader,fragmentShader:pi.backgroundCube.fragmentShader,side:Bn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(w,A,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),vr.copy(y.backgroundRotation),vr.x*=-1,vr.y*=-1,vr.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(vr.y*=-1,vr.z*=-1),u.material.uniforms.envMap.value=M,u.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Mv.makeRotationFromEuler(vr)),u.material.toneMapped=At.getTransfer(M.colorSpace)!==kt,(h!==M||d!==M.version||f!==n.toneMapping)&&(u.material.needsUpdate=!0,h=M,d=M.version,f=n.toneMapping),u.layers.enableAll(),b.unshift(u,u.geometry,u.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new Rn(new Ni(2,2),new or({name:"BackgroundMaterial",uniforms:ds(pi.background.uniforms),vertexShader:pi.background.vertexShader,fragmentShader:pi.background.fragmentShader,side:sr,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,l.material.toneMapped=At.getTransfer(M.colorSpace)!==kt,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(h!==M||d!==M.version||f!==n.toneMapping)&&(l.material.needsUpdate=!0,h=M,d=M.version,f=n.toneMapping),l.layers.enableAll(),b.unshift(l,l.geometry,l.material,0,0,null))}function p(b,y){b.getRGB(Bo,fd(n)),i.buffers.color.setClear(Bo.r,Bo.g,Bo.b,y,o)}function x(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(b,y=1){a.set(b),c=y,p(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(b){c=b,p(a,c)},render:_,addToRenderList:m,dispose:x}}function Ev(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=d(null);let s=r,o=!1;function a(E,U,k,$,H){let X=!1;const G=h($,k,U);s!==G&&(s=G,l(s.object)),X=f(E,$,k,H),X&&g(E,$,k,H),H!==null&&e.update(H,n.ELEMENT_ARRAY_BUFFER),(X||o)&&(o=!1,y(E,U,k,$),H!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(H).buffer))}function c(){return n.createVertexArray()}function l(E){return n.bindVertexArray(E)}function u(E){return n.deleteVertexArray(E)}function h(E,U,k){const $=k.wireframe===!0;let H=i[E.id];H===void 0&&(H={},i[E.id]=H);let X=H[U.id];X===void 0&&(X={},H[U.id]=X);let G=X[$];return G===void 0&&(G=d(c()),X[$]=G),G}function d(E){const U=[],k=[],$=[];for(let H=0;H<t;H++)U[H]=0,k[H]=0,$[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:k,attributeDivisors:$,object:E,attributes:{},index:null}}function f(E,U,k,$){const H=s.attributes,X=U.attributes;let G=0;const W=k.getAttributes();for(const N in W)if(W[N].location>=0){const oe=H[N];let K=X[N];if(K===void 0&&(N==="instanceMatrix"&&E.instanceMatrix&&(K=E.instanceMatrix),N==="instanceColor"&&E.instanceColor&&(K=E.instanceColor)),oe===void 0||oe.attribute!==K||K&&oe.data!==K.data)return!0;G++}return s.attributesNum!==G||s.index!==$}function g(E,U,k,$){const H={},X=U.attributes;let G=0;const W=k.getAttributes();for(const N in W)if(W[N].location>=0){let oe=X[N];oe===void 0&&(N==="instanceMatrix"&&E.instanceMatrix&&(oe=E.instanceMatrix),N==="instanceColor"&&E.instanceColor&&(oe=E.instanceColor));const K={};K.attribute=oe,oe&&oe.data&&(K.data=oe.data),H[N]=K,G++}s.attributes=H,s.attributesNum=G,s.index=$}function _(){const E=s.newAttributes;for(let U=0,k=E.length;U<k;U++)E[U]=0}function m(E){p(E,0)}function p(E,U){const k=s.newAttributes,$=s.enabledAttributes,H=s.attributeDivisors;k[E]=1,$[E]===0&&(n.enableVertexAttribArray(E),$[E]=1),H[E]!==U&&(n.vertexAttribDivisor(E,U),H[E]=U)}function x(){const E=s.newAttributes,U=s.enabledAttributes;for(let k=0,$=U.length;k<$;k++)U[k]!==E[k]&&(n.disableVertexAttribArray(k),U[k]=0)}function b(E,U,k,$,H,X,G){G===!0?n.vertexAttribIPointer(E,U,k,H,X):n.vertexAttribPointer(E,U,k,$,H,X)}function y(E,U,k,$){_();const H=$.attributes,X=k.getAttributes(),G=U.defaultAttributeValues;for(const W in X){const N=X[W];if(N.location>=0){let fe=H[W];if(fe===void 0&&(W==="instanceMatrix"&&E.instanceMatrix&&(fe=E.instanceMatrix),W==="instanceColor"&&E.instanceColor&&(fe=E.instanceColor)),fe!==void 0){const oe=fe.normalized,K=fe.itemSize,$e=e.get(fe);if($e===void 0)continue;const at=$e.buffer,Oe=$e.type,gt=$e.bytesPerElement,te=Oe===n.INT||Oe===n.UNSIGNED_INT||fe.gpuType===gl;if(fe.isInterleavedBufferAttribute){const le=fe.data,Re=le.stride,Xe=fe.offset;if(le.isInstancedInterleavedBuffer){for(let Be=0;Be<N.locationSize;Be++)p(N.location+Be,le.meshPerAttribute);E.isInstancedMesh!==!0&&$._maxInstanceCount===void 0&&($._maxInstanceCount=le.meshPerAttribute*le.count)}else for(let Be=0;Be<N.locationSize;Be++)m(N.location+Be);n.bindBuffer(n.ARRAY_BUFFER,at);for(let Be=0;Be<N.locationSize;Be++)b(N.location+Be,K/N.locationSize,Oe,oe,Re*gt,(Xe+K/N.locationSize*Be)*gt,te)}else{if(fe.isInstancedBufferAttribute){for(let le=0;le<N.locationSize;le++)p(N.location+le,fe.meshPerAttribute);E.isInstancedMesh!==!0&&$._maxInstanceCount===void 0&&($._maxInstanceCount=fe.meshPerAttribute*fe.count)}else for(let le=0;le<N.locationSize;le++)m(N.location+le);n.bindBuffer(n.ARRAY_BUFFER,at);for(let le=0;le<N.locationSize;le++)b(N.location+le,K/N.locationSize,Oe,oe,K*gt,K/N.locationSize*le*gt,te)}}else if(G!==void 0){const oe=G[W];if(oe!==void 0)switch(oe.length){case 2:n.vertexAttrib2fv(N.location,oe);break;case 3:n.vertexAttrib3fv(N.location,oe);break;case 4:n.vertexAttrib4fv(N.location,oe);break;default:n.vertexAttrib1fv(N.location,oe)}}}}x()}function M(){C();for(const E in i){const U=i[E];for(const k in U){const $=U[k];for(const H in $)u($[H].object),delete $[H];delete U[k]}delete i[E]}}function w(E){if(i[E.id]===void 0)return;const U=i[E.id];for(const k in U){const $=U[k];for(const H in $)u($[H].object),delete $[H];delete U[k]}delete i[E.id]}function A(E){for(const U in i){const k=i[U];if(k[E.id]===void 0)continue;const $=k[E.id];for(const H in $)u($[H].object),delete $[H];delete k[E.id]}}function C(){S(),o=!0,s!==r&&(s=r,l(s.object))}function S(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:C,resetDefaultState:S,dispose:M,releaseStatesOfGeometry:w,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:m,disableUnusedAttributes:x}}function wv(n,e,t){let i;function r(l){i=l}function s(l,u){n.drawArrays(i,l,u),t.update(u,i,1)}function o(l,u,h){h!==0&&(n.drawArraysInstanced(i,l,u,h),t.update(u,i,h))}function a(l,u,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,u,0,h);let f=0;for(let g=0;g<h;g++)f+=u[g];t.update(f,i,1)}function c(l,u,h,d){if(h===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<l.length;g++)o(l[g],u[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(i,l,0,u,0,d,0,h);let g=0;for(let _=0;_<h;_++)g+=u[_]*d[_];t.update(g,i,1)}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function Tv(n,e,t,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");r=n.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(A){return!(A!==ci&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(A){const C=A===to&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==xi&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Ui&&!C)}function c(A){if(A==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const u=c(l);u!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);const h=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),x=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),b=n.getParameter(n.MAX_VARYING_VECTORS),y=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),M=g>0,w=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:h,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:x,maxVaryings:b,maxFragmentUniforms:y,vertexTextures:M,maxSamples:w}}function Av(n){const e=this;let t=null,i=0,r=!1,s=!1;const o=new Li,a=new pt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const f=h.length!==0||d||i!==0||r;return r=d,i=h.length,f},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,d){t=u(h,d,0)},this.setState=function(h,d,f){const g=h.clippingPlanes,_=h.clipIntersection,m=h.clipShadows,p=n.get(h);if(!r||g===null||g.length===0||s&&!m)s?u(null):l();else{const x=s?0:i,b=x*4;let y=p.clippingState||null;c.value=y,y=u(g,d,b,f);for(let M=0;M!==b;++M)y[M]=t[M];p.clippingState=y,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=x}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(h,d,f,g){const _=h!==null?h.length:0;let m=null;if(_!==0){if(m=c.value,g!==!0||m===null){const p=f+_*4,x=d.matrixWorldInverse;a.getNormalMatrix(x),(m===null||m.length<p)&&(m=new Float32Array(p));for(let b=0,y=f;b!==_;++b,y+=4)o.copy(h[b]).applyMatrix4(x,a),o.normal.toArray(m,y),m[y+3]=o.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}function Rv(n){let e=new WeakMap;function t(o,a){return a===Sc?o.mapping=ls:a===Ec&&(o.mapping=us),o}function i(o){if(o&&o.isTexture){const a=o.mapping;if(a===Sc||a===Ec)if(e.has(o)){const c=e.get(o).texture;return t(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new Xp(c.height);return l.fromEquirectangularTexture(n,o),e.set(o,l),o.addEventListener("dispose",r),t(l.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const c=e.get(a);c!==void 0&&(e.delete(a),c.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}const Qr=4,Ku=[.125,.215,.35,.446,.526,.582],br=20,rc=new Rd,Ju=new St;let sc=null,oc=0,ac=0,cc=!1;const xr=(1+Math.sqrt(5))/2,Yr=1/xr,Qu=[new D(-xr,Yr,0),new D(xr,Yr,0),new D(-Yr,0,xr),new D(Yr,0,xr),new D(0,xr,-Yr),new D(0,xr,Yr),new D(-1,1,-1),new D(1,1,-1),new D(-1,1,1),new D(1,1,1)],Cv=new D;class eh{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,r=100,s={}){const{size:o=256,position:a=Cv}=s;sc=this._renderer.getRenderTarget(),oc=this._renderer.getActiveCubeFace(),ac=this._renderer.getActiveMipmapLevel(),cc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,i,r,c,a),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ih(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=nh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(sc,oc,ac),this._renderer.xr.enabled=cc,e.scissorTest=!1,Vo(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ls||e.mapping===us?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),sc=this._renderer.getRenderTarget(),oc=this._renderer.getActiveCubeFace(),ac=this._renderer.getActiveMipmapLevel(),cc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:ai,minFilter:ai,generateMipmaps:!1,type:to,format:ci,colorSpace:hs,depthBuffer:!1},r=th(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=th(e,t,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Pv(s)),this._blurMaterial=Lv(s,e,t)}return r}_compileMaterial(e){const t=new Rn(this._lodPlanes[0],e);this._renderer.compile(t,rc)}_sceneToCubeUV(e,t,i,r,s){const c=new Zn(90,1,t,i),l=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,f=h.toneMapping;h.getClearColor(Ju),h.toneMapping=nr,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(r),h.clearDepth(),h.setRenderTarget(null));const _=new jn({name:"PMREM.Background",side:Bn,depthWrite:!1,depthTest:!1}),m=new Rn(new Yt,_);let p=!1;const x=e.background;x?x.isColor&&(_.color.copy(x),e.background=null,p=!0):(_.color.copy(Ju),p=!0);for(let b=0;b<6;b++){const y=b%3;y===0?(c.up.set(0,l[b],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x+u[b],s.y,s.z)):y===1?(c.up.set(0,0,l[b]),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y+u[b],s.z)):(c.up.set(0,l[b],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y,s.z+u[b]));const M=this._cubeSize;Vo(r,y*M,b>2?M:0,M,M),h.setRenderTarget(r),p&&h.render(m,c),h.render(e,c)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=f,h.autoClear=d,e.background=x}_textureToCubeUV(e,t){const i=this._renderer,r=e.mapping===ls||e.mapping===us;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=ih()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=nh());const s=r?this._cubemapMaterial:this._equirectMaterial,o=new Rn(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=e;const c=this._cubeSize;Vo(t,0,0,3*c,2*c),i.setRenderTarget(t),i.render(o,rc)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=Qu[(r-s-1)%Qu.length];this._blur(e,s-1,s,o,a)}t.autoClear=i}_blur(e,t,i,r,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,i,r,"latitudinal",s),this._halfBlur(o,e,i,i,r,"longitudinal",s)}_halfBlur(e,t,i,r,s,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new Rn(this._lodPlanes[r],l),d=l.uniforms,f=this._sizeLods[i]-1,g=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*br-1),_=s/g,m=isFinite(s)?1+Math.floor(u*_):br;m>br&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${br}`);const p=[];let x=0;for(let A=0;A<br;++A){const C=A/_,S=Math.exp(-C*C/2);p.push(S),A===0?x+=S:A<m&&(x+=2*S)}for(let A=0;A<p.length;A++)p[A]=p[A]/x;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:b}=this;d.dTheta.value=g,d.mipInt.value=b-i;const y=this._sizeLods[r],M=3*y*(r>b-Qr?r-b+Qr:0),w=4*(this._cubeSize-y);Vo(t,M,w,3*y,2*y),c.setRenderTarget(t),c.render(h,rc)}}function Pv(n){const e=[],t=[],i=[];let r=n;const s=n-Qr+1+Ku.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);t.push(a);let c=1/a;o>n-Qr?c=Ku[o-n+Qr-1]:o===0&&(c=0),i.push(c);const l=1/(a-2),u=-l,h=1+l,d=[u,u,h,u,h,h,u,u,h,h,u,h],f=6,g=6,_=3,m=2,p=1,x=new Float32Array(_*g*f),b=new Float32Array(m*g*f),y=new Float32Array(p*g*f);for(let w=0;w<f;w++){const A=w%3*2/3-1,C=w>2?0:-1,S=[A,C,0,A+2/3,C,0,A+2/3,C+1,0,A,C,0,A+2/3,C+1,0,A,C+1,0];x.set(S,_*g*w),b.set(d,m*g*w);const E=[w,w,w,w,w,w];y.set(E,p*g*w)}const M=new hn;M.setAttribute("position",new Jn(x,_)),M.setAttribute("uv",new Jn(b,m)),M.setAttribute("faceIndex",new Jn(y,p)),e.push(M),r>Qr&&r--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function th(n,e,t){const i=new Tr(n,e,t);return i.texture.mapping=ca,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Vo(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function Lv(n,e,t){const i=new Float32Array(br),r=new D(0,1,0);return new or({name:"SphericalGaussianBlur",defines:{n:br,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Nl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:tr,depthTest:!1,depthWrite:!1})}function nh(){return new or({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Nl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:tr,depthTest:!1,depthWrite:!1})}function ih(){return new or({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Nl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:tr,depthTest:!1,depthWrite:!1})}function Nl(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Dv(n){let e=new WeakMap,t=null;function i(a){if(a&&a.isTexture){const c=a.mapping,l=c===Sc||c===Ec,u=c===ls||c===us;if(l||u){let h=e.get(a);const d=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return t===null&&(t=new eh(n)),h=l?t.fromEquirectangular(a,h):t.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),h.texture;if(h!==void 0)return h.texture;{const f=a.image;return l&&f&&f.height>0||u&&f&&r(f)?(t===null&&(t=new eh(n)),h=l?t.fromEquirectangular(a):t.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),a.addEventListener("dispose",s),h.texture):null}}}return a}function r(a){let c=0;const l=6;for(let u=0;u<l;u++)a[u]!==void 0&&c++;return c===l}function s(a){const c=a.target;c.removeEventListener("dispose",s);const l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:o}}function Iv(n){const e={};function t(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=n.getExtension(i)}return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const r=t(i);return r===null&&js("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function Uv(n,e,t,i){const r={},s=new WeakMap;function o(h){const d=h.target;d.index!==null&&e.remove(d.index);for(const g in d.attributes)e.remove(d.attributes[g]);d.removeEventListener("dispose",o),delete r[d.id];const f=s.get(d);f&&(e.remove(f),s.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function a(h,d){return r[d.id]===!0||(d.addEventListener("dispose",o),r[d.id]=!0,t.memory.geometries++),d}function c(h){const d=h.attributes;for(const f in d)e.update(d[f],n.ARRAY_BUFFER)}function l(h){const d=[],f=h.index,g=h.attributes.position;let _=0;if(f!==null){const x=f.array;_=f.version;for(let b=0,y=x.length;b<y;b+=3){const M=x[b+0],w=x[b+1],A=x[b+2];d.push(M,w,w,A,A,M)}}else if(g!==void 0){const x=g.array;_=g.version;for(let b=0,y=x.length/3-1;b<y;b+=3){const M=b+0,w=b+1,A=b+2;d.push(M,w,w,A,A,M)}}else return;const m=new(cd(d)?dd:hd)(d,1);m.version=_;const p=s.get(h);p&&e.remove(p),s.set(h,m)}function u(h){const d=s.get(h);if(d){const f=h.index;f!==null&&d.version<f.version&&l(h)}else l(h);return s.get(h)}return{get:a,update:c,getWireframeAttribute:u}}function Nv(n,e,t){let i;function r(d){i=d}let s,o;function a(d){s=d.type,o=d.bytesPerElement}function c(d,f){n.drawElements(i,f,s,d*o),t.update(f,i,1)}function l(d,f,g){g!==0&&(n.drawElementsInstanced(i,f,s,d*o,g),t.update(f,i,g))}function u(d,f,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,s,d,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];t.update(m,i,1)}function h(d,f,g,_){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)l(d[p]/o,f[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(i,f,0,s,d,0,_,0,g);let p=0;for(let x=0;x<g;x++)p+=f[x]*_[x];t.update(p,i,1)}}this.setMode=r,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function Ov(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(s/3);break;case n.LINES:t.lines+=a*(s/2);break;case n.LINE_STRIP:t.lines+=a*(s-1);break;case n.LINE_LOOP:t.lines+=a*s;break;case n.POINTS:t.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function Fv(n,e,t){const i=new WeakMap,r=new en;function s(o,a,c){const l=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0;let d=i.get(a);if(d===void 0||d.count!==h){let E=function(){C.dispose(),i.delete(a),a.removeEventListener("dispose",E)};var f=E;d!==void 0&&d.texture.dispose();const g=a.morphAttributes.position!==void 0,_=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],x=a.morphAttributes.normal||[],b=a.morphAttributes.color||[];let y=0;g===!0&&(y=1),_===!0&&(y=2),m===!0&&(y=3);let M=a.attributes.position.count*y,w=1;M>e.maxTextureSize&&(w=Math.ceil(M/e.maxTextureSize),M=e.maxTextureSize);const A=new Float32Array(M*w*4*h),C=new ld(A,M,w,h);C.type=Ui,C.needsUpdate=!0;const S=y*4;for(let U=0;U<h;U++){const k=p[U],$=x[U],H=b[U],X=M*w*4*U;for(let G=0;G<k.count;G++){const W=G*S;g===!0&&(r.fromBufferAttribute(k,G),A[X+W+0]=r.x,A[X+W+1]=r.y,A[X+W+2]=r.z,A[X+W+3]=0),_===!0&&(r.fromBufferAttribute($,G),A[X+W+4]=r.x,A[X+W+5]=r.y,A[X+W+6]=r.z,A[X+W+7]=0),m===!0&&(r.fromBufferAttribute(H,G),A[X+W+8]=r.x,A[X+W+9]=r.y,A[X+W+10]=r.z,A[X+W+11]=H.itemSize===4?r.w:1)}}d={count:h,texture:C,size:new ye(M,w)},i.set(a,d),a.addEventListener("dispose",E)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const _=a.morphTargetsRelative?1:1-g;c.getUniforms().setValue(n,"morphTargetBaseInfluence",_),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",d.texture,t),c.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:s}}function kv(n,e,t,i){let r=new WeakMap;function s(c){const l=i.render.frame,u=c.geometry,h=e.get(c,u);if(r.get(h)!==l&&(e.update(h),r.set(h,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),r.get(c)!==l&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),r.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;r.get(d)!==l&&(d.update(),r.set(d,l))}return h}function o(){r=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:s,dispose:o}}const Pd=new Nn,rh=new gd(1,1),Ld=new ld,Dd=new Pp,Id=new md,sh=[],oh=[],ah=new Float32Array(16),ch=new Float32Array(9),lh=new Float32Array(4);function ms(n,e,t){const i=n[0];if(i<=0||i>0)return n;const r=e*t;let s=sh[r];if(s===void 0&&(s=new Float32Array(r),sh[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(s,a)}return s}function dn(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function fn(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function ha(n,e){let t=oh[e];t===void 0&&(t=new Int32Array(e),oh[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function zv(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function Bv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(dn(t,e))return;n.uniform2fv(this.addr,e),fn(t,e)}}function Vv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(dn(t,e))return;n.uniform3fv(this.addr,e),fn(t,e)}}function Hv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(dn(t,e))return;n.uniform4fv(this.addr,e),fn(t,e)}}function Gv(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(dn(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),fn(t,e)}else{if(dn(t,i))return;lh.set(i),n.uniformMatrix2fv(this.addr,!1,lh),fn(t,i)}}function Wv(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(dn(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),fn(t,e)}else{if(dn(t,i))return;ch.set(i),n.uniformMatrix3fv(this.addr,!1,ch),fn(t,i)}}function $v(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(dn(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),fn(t,e)}else{if(dn(t,i))return;ah.set(i),n.uniformMatrix4fv(this.addr,!1,ah),fn(t,i)}}function qv(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function Xv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(dn(t,e))return;n.uniform2iv(this.addr,e),fn(t,e)}}function Yv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(dn(t,e))return;n.uniform3iv(this.addr,e),fn(t,e)}}function jv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(dn(t,e))return;n.uniform4iv(this.addr,e),fn(t,e)}}function Zv(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function Kv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(dn(t,e))return;n.uniform2uiv(this.addr,e),fn(t,e)}}function Jv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(dn(t,e))return;n.uniform3uiv(this.addr,e),fn(t,e)}}function Qv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(dn(t,e))return;n.uniform4uiv(this.addr,e),fn(t,e)}}function e_(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let s;this.type===n.SAMPLER_2D_SHADOW?(rh.compareFunction=ad,s=rh):s=Pd,t.setTexture2D(e||s,r)}function t_(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||Dd,r)}function n_(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||Id,r)}function i_(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||Ld,r)}function r_(n){switch(n){case 5126:return zv;case 35664:return Bv;case 35665:return Vv;case 35666:return Hv;case 35674:return Gv;case 35675:return Wv;case 35676:return $v;case 5124:case 35670:return qv;case 35667:case 35671:return Xv;case 35668:case 35672:return Yv;case 35669:case 35673:return jv;case 5125:return Zv;case 36294:return Kv;case 36295:return Jv;case 36296:return Qv;case 35678:case 36198:case 36298:case 36306:case 35682:return e_;case 35679:case 36299:case 36307:return t_;case 35680:case 36300:case 36308:case 36293:return n_;case 36289:case 36303:case 36311:case 36292:return i_}}function s_(n,e){n.uniform1fv(this.addr,e)}function o_(n,e){const t=ms(e,this.size,2);n.uniform2fv(this.addr,t)}function a_(n,e){const t=ms(e,this.size,3);n.uniform3fv(this.addr,t)}function c_(n,e){const t=ms(e,this.size,4);n.uniform4fv(this.addr,t)}function l_(n,e){const t=ms(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function u_(n,e){const t=ms(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function h_(n,e){const t=ms(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function d_(n,e){n.uniform1iv(this.addr,e)}function f_(n,e){n.uniform2iv(this.addr,e)}function p_(n,e){n.uniform3iv(this.addr,e)}function m_(n,e){n.uniform4iv(this.addr,e)}function g_(n,e){n.uniform1uiv(this.addr,e)}function v_(n,e){n.uniform2uiv(this.addr,e)}function __(n,e){n.uniform3uiv(this.addr,e)}function x_(n,e){n.uniform4uiv(this.addr,e)}function y_(n,e,t){const i=this.cache,r=e.length,s=ha(t,r);dn(i,s)||(n.uniform1iv(this.addr,s),fn(i,s));for(let o=0;o!==r;++o)t.setTexture2D(e[o]||Pd,s[o])}function b_(n,e,t){const i=this.cache,r=e.length,s=ha(t,r);dn(i,s)||(n.uniform1iv(this.addr,s),fn(i,s));for(let o=0;o!==r;++o)t.setTexture3D(e[o]||Dd,s[o])}function M_(n,e,t){const i=this.cache,r=e.length,s=ha(t,r);dn(i,s)||(n.uniform1iv(this.addr,s),fn(i,s));for(let o=0;o!==r;++o)t.setTextureCube(e[o]||Id,s[o])}function S_(n,e,t){const i=this.cache,r=e.length,s=ha(t,r);dn(i,s)||(n.uniform1iv(this.addr,s),fn(i,s));for(let o=0;o!==r;++o)t.setTexture2DArray(e[o]||Ld,s[o])}function E_(n){switch(n){case 5126:return s_;case 35664:return o_;case 35665:return a_;case 35666:return c_;case 35674:return l_;case 35675:return u_;case 35676:return h_;case 5124:case 35670:return d_;case 35667:case 35671:return f_;case 35668:case 35672:return p_;case 35669:case 35673:return m_;case 5125:return g_;case 36294:return v_;case 36295:return __;case 36296:return x_;case 35678:case 36198:case 36298:case 36306:case 35682:return y_;case 35679:case 36299:case 36307:return b_;case 35680:case 36300:case 36308:case 36293:return M_;case 36289:case 36303:case 36311:case 36292:return S_}}class w_{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=r_(t.type)}}class T_{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=E_(t.type)}}class A_{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(e,t[a.id],i)}}}const lc=/(\w+)(\])?(\[|\.)?/g;function uh(n,e){n.seq.push(e),n.map[e.id]=e}function R_(n,e,t){const i=n.name,r=i.length;for(lc.lastIndex=0;;){const s=lc.exec(i),o=lc.lastIndex;let a=s[1];const c=s[2]==="]",l=s[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===r){uh(t,l===void 0?new w_(a,n,e):new T_(a,n,e));break}else{let h=t.map[a];h===void 0&&(h=new A_(a),uh(t,h)),t=h}}}class Yo{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(t,r),o=e.getUniformLocation(t,s.name);R_(s,o,this)}}setValue(e,t,i,r){const s=this.map[t];s!==void 0&&s.setValue(e,i,r)}setOptional(e,t,i){const r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let s=0,o=t.length;s!==o;++s){const a=t[s],c=i[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,r)}}static seqWithValue(e,t){const i=[];for(let r=0,s=e.length;r!==s;++r){const o=e[r];o.id in t&&i.push(o)}return i}}function hh(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const C_=37297;let P_=0;function L_(n,e){const t=n.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let o=r;o<s;o++){const a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}const dh=new pt;function D_(n){At._getMatrix(dh,At.workingColorSpace,n);const e=`mat3( ${dh.elements.map(t=>t.toFixed(4))} )`;switch(At.getTransfer(n)){case Zo:return[e,"LinearTransferOETF"];case kt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function fh(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),s=(n.getShaderInfoLog(e)||"").trim();if(i&&s==="")return"";const o=/ERROR: 0:(\d+)/.exec(s);if(o){const a=parseInt(o[1]);return t.toUpperCase()+`

`+s+`

`+L_(n.getShaderSource(e),a)}else return s}function I_(n,e){const t=D_(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function U_(n,e){let t;switch(e){case Wf:t="Linear";break;case $f:t="Reinhard";break;case qf:t="Cineon";break;case Zh:t="ACESFilmic";break;case Yf:t="AgX";break;case jf:t="Neutral";break;case Xf:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Ho=new D;function N_(){At.getLuminanceCoefficients(Ho);const n=Ho.x.toFixed(4),e=Ho.y.toFixed(4),t=Ho.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function O_(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Us).join(`
`)}function F_(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function k_(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=n.getActiveAttrib(e,r),o=s.name;let a=1;s.type===n.FLOAT_MAT2&&(a=2),s.type===n.FLOAT_MAT3&&(a=3),s.type===n.FLOAT_MAT4&&(a=4),t[o]={type:s.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function Us(n){return n!==""}function ph(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function mh(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const z_=/^[ \t]*#include +<([\w\d./]+)>/gm;function ol(n){return n.replace(z_,V_)}const B_=new Map;function V_(n,e){let t=vt[e];if(t===void 0){const i=B_.get(e);if(i!==void 0)t=vt[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return ol(t)}const H_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function gh(n){return n.replace(H_,G_)}function G_(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function vh(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function W_(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Xh?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===Yh?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Ci&&(e="SHADOWMAP_TYPE_VSM"),e}function $_(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case ls:case us:e="ENVMAP_TYPE_CUBE";break;case ca:e="ENVMAP_TYPE_CUBE_UV";break}return e}function q_(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case us:e="ENVMAP_MODE_REFRACTION";break}return e}function X_(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case jh:e="ENVMAP_BLENDING_MULTIPLY";break;case Hf:e="ENVMAP_BLENDING_MIX";break;case Gf:e="ENVMAP_BLENDING_ADD";break}return e}function Y_(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function j_(n,e,t,i){const r=n.getContext(),s=t.defines;let o=t.vertexShader,a=t.fragmentShader;const c=W_(t),l=$_(t),u=q_(t),h=X_(t),d=Y_(t),f=O_(t),g=F_(s),_=r.createProgram();let m,p,x=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Us).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Us).join(`
`),p.length>0&&(p+=`
`)):(m=[vh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Us).join(`
`),p=[vh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==nr?"#define TONE_MAPPING":"",t.toneMapping!==nr?vt.tonemapping_pars_fragment:"",t.toneMapping!==nr?U_("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",vt.colorspace_pars_fragment,I_("linearToOutputTexel",t.outputColorSpace),N_(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Us).join(`
`)),o=ol(o),o=ph(o,t),o=mh(o,t),a=ol(a),a=ph(a,t),a=mh(a,t),o=gh(o),a=gh(a),t.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===gu?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===gu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const b=x+m+o,y=x+p+a,M=hh(r,r.VERTEX_SHADER,b),w=hh(r,r.FRAGMENT_SHADER,y);r.attachShader(_,M),r.attachShader(_,w),t.index0AttributeName!==void 0?r.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(_,0,"position"),r.linkProgram(_);function A(U){if(n.debug.checkShaderErrors){const k=r.getProgramInfoLog(_)||"",$=r.getShaderInfoLog(M)||"",H=r.getShaderInfoLog(w)||"",X=k.trim(),G=$.trim(),W=H.trim();let N=!0,fe=!0;if(r.getProgramParameter(_,r.LINK_STATUS)===!1)if(N=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,_,M,w);else{const oe=fh(r,M,"vertex"),K=fh(r,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(_,r.VALIDATE_STATUS)+`

Material Name: `+U.name+`
Material Type: `+U.type+`

Program Info Log: `+X+`
`+oe+`
`+K)}else X!==""?console.warn("THREE.WebGLProgram: Program Info Log:",X):(G===""||W==="")&&(fe=!1);fe&&(U.diagnostics={runnable:N,programLog:X,vertexShader:{log:G,prefix:m},fragmentShader:{log:W,prefix:p}})}r.deleteShader(M),r.deleteShader(w),C=new Yo(r,_),S=k_(r,_)}let C;this.getUniforms=function(){return C===void 0&&A(this),C};let S;this.getAttributes=function(){return S===void 0&&A(this),S};let E=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=r.getProgramParameter(_,C_)),E},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=P_++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=M,this.fragmentShader=w,this}let Z_=0;class K_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new J_(e),t.set(e,i)),i}}class J_{constructor(e){this.id=Z_++,this.code=e,this.usedTimes=0}}function Q_(n,e,t,i,r,s,o){const a=new El,c=new K_,l=new Set,u=[],h=r.logarithmicDepthBuffer,d=r.vertexTextures;let f=r.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(S){return l.add(S),S===0?"uv":`uv${S}`}function m(S,E,U,k,$){const H=k.fog,X=$.geometry,G=S.isMeshStandardMaterial?k.environment:null,W=(S.isMeshStandardMaterial?t:e).get(S.envMap||G),N=W&&W.mapping===ca?W.image.height:null,fe=g[S.type];S.precision!==null&&(f=r.getMaxPrecision(S.precision),f!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",f,"instead."));const oe=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,K=oe!==void 0?oe.length:0;let $e=0;X.morphAttributes.position!==void 0&&($e=1),X.morphAttributes.normal!==void 0&&($e=2),X.morphAttributes.color!==void 0&&($e=3);let at,Oe,gt,te;if(fe){const Mt=pi[fe];at=Mt.vertexShader,Oe=Mt.fragmentShader}else at=S.vertexShader,Oe=S.fragmentShader,c.update(S),gt=c.getVertexShaderID(S),te=c.getFragmentShaderID(S);const le=n.getRenderTarget(),Re=n.state.buffers.depth.getReversed(),Xe=$.isInstancedMesh===!0,Be=$.isBatchedMesh===!0,Ke=!!S.map,Nt=!!S.matcap,B=!!W,ge=!!S.aoMap,he=!!S.lightMap,se=!!S.bumpMap,ce=!!S.normalMap,Ee=!!S.displacementMap,pe=!!S.emissiveMap,Me=!!S.metalnessMap,et=!!S.roughnessMap,it=S.anisotropy>0,I=S.clearcoat>0,T=S.dispersion>0,Z=S.iridescence>0,ee=S.sheen>0,de=S.transmission>0,re=it&&!!S.anisotropyMap,Fe=I&&!!S.clearcoatMap,be=I&&!!S.clearcoatNormalMap,Ge=I&&!!S.clearcoatRoughnessMap,Ve=Z&&!!S.iridescenceMap,j=Z&&!!S.iridescenceThicknessMap,Le=ee&&!!S.sheenColorMap,tt=ee&&!!S.sheenRoughnessMap,Ye=!!S.specularMap,Ce=!!S.specularColorMap,lt=!!S.specularIntensityMap,V=de&&!!S.transmissionMap,xe=de&&!!S.thicknessMap,Se=!!S.gradientMap,Ne=!!S.alphaMap,ve=S.alphaTest>0,ue=!!S.alphaHash,ke=!!S.extensions;let ot=nr;S.toneMapped&&(le===null||le.isXRRenderTarget===!0)&&(ot=n.toneMapping);const bt={shaderID:fe,shaderType:S.type,shaderName:S.name,vertexShader:at,fragmentShader:Oe,defines:S.defines,customVertexShaderID:gt,customFragmentShaderID:te,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:f,batching:Be,batchingColor:Be&&$._colorsTexture!==null,instancing:Xe,instancingColor:Xe&&$.instanceColor!==null,instancingMorph:Xe&&$.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:le===null?n.outputColorSpace:le.isXRRenderTarget===!0?le.texture.colorSpace:hs,alphaToCoverage:!!S.alphaToCoverage,map:Ke,matcap:Nt,envMap:B,envMapMode:B&&W.mapping,envMapCubeUVHeight:N,aoMap:ge,lightMap:he,bumpMap:se,normalMap:ce,displacementMap:d&&Ee,emissiveMap:pe,normalMapObjectSpace:ce&&S.normalMapType===Qf,normalMapTangentSpace:ce&&S.normalMapType===od,metalnessMap:Me,roughnessMap:et,anisotropy:it,anisotropyMap:re,clearcoat:I,clearcoatMap:Fe,clearcoatNormalMap:be,clearcoatRoughnessMap:Ge,dispersion:T,iridescence:Z,iridescenceMap:Ve,iridescenceThicknessMap:j,sheen:ee,sheenColorMap:Le,sheenRoughnessMap:tt,specularMap:Ye,specularColorMap:Ce,specularIntensityMap:lt,transmission:de,transmissionMap:V,thicknessMap:xe,gradientMap:Se,opaque:S.transparent===!1&&S.blending===ts&&S.alphaToCoverage===!1,alphaMap:Ne,alphaTest:ve,alphaHash:ue,combine:S.combine,mapUv:Ke&&_(S.map.channel),aoMapUv:ge&&_(S.aoMap.channel),lightMapUv:he&&_(S.lightMap.channel),bumpMapUv:se&&_(S.bumpMap.channel),normalMapUv:ce&&_(S.normalMap.channel),displacementMapUv:Ee&&_(S.displacementMap.channel),emissiveMapUv:pe&&_(S.emissiveMap.channel),metalnessMapUv:Me&&_(S.metalnessMap.channel),roughnessMapUv:et&&_(S.roughnessMap.channel),anisotropyMapUv:re&&_(S.anisotropyMap.channel),clearcoatMapUv:Fe&&_(S.clearcoatMap.channel),clearcoatNormalMapUv:be&&_(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ge&&_(S.clearcoatRoughnessMap.channel),iridescenceMapUv:Ve&&_(S.iridescenceMap.channel),iridescenceThicknessMapUv:j&&_(S.iridescenceThicknessMap.channel),sheenColorMapUv:Le&&_(S.sheenColorMap.channel),sheenRoughnessMapUv:tt&&_(S.sheenRoughnessMap.channel),specularMapUv:Ye&&_(S.specularMap.channel),specularColorMapUv:Ce&&_(S.specularColorMap.channel),specularIntensityMapUv:lt&&_(S.specularIntensityMap.channel),transmissionMapUv:V&&_(S.transmissionMap.channel),thicknessMapUv:xe&&_(S.thicknessMap.channel),alphaMapUv:Ne&&_(S.alphaMap.channel),vertexTangents:!!X.attributes.tangent&&(ce||it),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,pointsUvs:$.isPoints===!0&&!!X.attributes.uv&&(Ke||Ne),fog:!!H,useFog:S.fog===!0,fogExp2:!!H&&H.isFogExp2,flatShading:S.flatShading===!0&&S.wireframe===!1,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:Re,skinning:$.isSkinnedMesh===!0,morphTargets:X.morphAttributes.position!==void 0,morphNormals:X.morphAttributes.normal!==void 0,morphColors:X.morphAttributes.color!==void 0,morphTargetsCount:K,morphTextureStride:$e,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:S.dithering,shadowMapEnabled:n.shadowMap.enabled&&U.length>0,shadowMapType:n.shadowMap.type,toneMapping:ot,decodeVideoTexture:Ke&&S.map.isVideoTexture===!0&&At.getTransfer(S.map.colorSpace)===kt,decodeVideoTextureEmissive:pe&&S.emissiveMap.isVideoTexture===!0&&At.getTransfer(S.emissiveMap.colorSpace)===kt,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===gi,flipSided:S.side===Bn,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:ke&&S.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ke&&S.extensions.multiDraw===!0||Be)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return bt.vertexUv1s=l.has(1),bt.vertexUv2s=l.has(2),bt.vertexUv3s=l.has(3),l.clear(),bt}function p(S){const E=[];if(S.shaderID?E.push(S.shaderID):(E.push(S.customVertexShaderID),E.push(S.customFragmentShaderID)),S.defines!==void 0)for(const U in S.defines)E.push(U),E.push(S.defines[U]);return S.isRawShaderMaterial===!1&&(x(E,S),b(E,S),E.push(n.outputColorSpace)),E.push(S.customProgramCacheKey),E.join()}function x(S,E){S.push(E.precision),S.push(E.outputColorSpace),S.push(E.envMapMode),S.push(E.envMapCubeUVHeight),S.push(E.mapUv),S.push(E.alphaMapUv),S.push(E.lightMapUv),S.push(E.aoMapUv),S.push(E.bumpMapUv),S.push(E.normalMapUv),S.push(E.displacementMapUv),S.push(E.emissiveMapUv),S.push(E.metalnessMapUv),S.push(E.roughnessMapUv),S.push(E.anisotropyMapUv),S.push(E.clearcoatMapUv),S.push(E.clearcoatNormalMapUv),S.push(E.clearcoatRoughnessMapUv),S.push(E.iridescenceMapUv),S.push(E.iridescenceThicknessMapUv),S.push(E.sheenColorMapUv),S.push(E.sheenRoughnessMapUv),S.push(E.specularMapUv),S.push(E.specularColorMapUv),S.push(E.specularIntensityMapUv),S.push(E.transmissionMapUv),S.push(E.thicknessMapUv),S.push(E.combine),S.push(E.fogExp2),S.push(E.sizeAttenuation),S.push(E.morphTargetsCount),S.push(E.morphAttributeCount),S.push(E.numDirLights),S.push(E.numPointLights),S.push(E.numSpotLights),S.push(E.numSpotLightMaps),S.push(E.numHemiLights),S.push(E.numRectAreaLights),S.push(E.numDirLightShadows),S.push(E.numPointLightShadows),S.push(E.numSpotLightShadows),S.push(E.numSpotLightShadowsWithMaps),S.push(E.numLightProbes),S.push(E.shadowMapType),S.push(E.toneMapping),S.push(E.numClippingPlanes),S.push(E.numClipIntersection),S.push(E.depthPacking)}function b(S,E){a.disableAll(),E.supportsVertexTextures&&a.enable(0),E.instancing&&a.enable(1),E.instancingColor&&a.enable(2),E.instancingMorph&&a.enable(3),E.matcap&&a.enable(4),E.envMap&&a.enable(5),E.normalMapObjectSpace&&a.enable(6),E.normalMapTangentSpace&&a.enable(7),E.clearcoat&&a.enable(8),E.iridescence&&a.enable(9),E.alphaTest&&a.enable(10),E.vertexColors&&a.enable(11),E.vertexAlphas&&a.enable(12),E.vertexUv1s&&a.enable(13),E.vertexUv2s&&a.enable(14),E.vertexUv3s&&a.enable(15),E.vertexTangents&&a.enable(16),E.anisotropy&&a.enable(17),E.alphaHash&&a.enable(18),E.batching&&a.enable(19),E.dispersion&&a.enable(20),E.batchingColor&&a.enable(21),E.gradientMap&&a.enable(22),S.push(a.mask),a.disableAll(),E.fog&&a.enable(0),E.useFog&&a.enable(1),E.flatShading&&a.enable(2),E.logarithmicDepthBuffer&&a.enable(3),E.reversedDepthBuffer&&a.enable(4),E.skinning&&a.enable(5),E.morphTargets&&a.enable(6),E.morphNormals&&a.enable(7),E.morphColors&&a.enable(8),E.premultipliedAlpha&&a.enable(9),E.shadowMapEnabled&&a.enable(10),E.doubleSided&&a.enable(11),E.flipSided&&a.enable(12),E.useDepthPacking&&a.enable(13),E.dithering&&a.enable(14),E.transmission&&a.enable(15),E.sheen&&a.enable(16),E.opaque&&a.enable(17),E.pointsUvs&&a.enable(18),E.decodeVideoTexture&&a.enable(19),E.decodeVideoTextureEmissive&&a.enable(20),E.alphaToCoverage&&a.enable(21),S.push(a.mask)}function y(S){const E=g[S.type];let U;if(E){const k=pi[E];U=Gp.clone(k.uniforms)}else U=S.uniforms;return U}function M(S,E){let U;for(let k=0,$=u.length;k<$;k++){const H=u[k];if(H.cacheKey===E){U=H,++U.usedTimes;break}}return U===void 0&&(U=new j_(n,E,S,s),u.push(U)),U}function w(S){if(--S.usedTimes===0){const E=u.indexOf(S);u[E]=u[u.length-1],u.pop(),S.destroy()}}function A(S){c.remove(S)}function C(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:y,acquireProgram:M,releaseProgram:w,releaseShaderCache:A,programs:u,dispose:C}}function ex(){let n=new WeakMap;function e(o){return n.has(o)}function t(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function r(o,a,c){n.get(o)[a]=c}function s(){n=new WeakMap}return{has:e,get:t,remove:i,update:r,dispose:s}}function tx(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function _h(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function xh(){const n=[];let e=0;const t=[],i=[],r=[];function s(){e=0,t.length=0,i.length=0,r.length=0}function o(h,d,f,g,_,m){let p=n[e];return p===void 0?(p={id:h.id,object:h,geometry:d,material:f,groupOrder:g,renderOrder:h.renderOrder,z:_,group:m},n[e]=p):(p.id=h.id,p.object=h,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=h.renderOrder,p.z=_,p.group=m),e++,p}function a(h,d,f,g,_,m){const p=o(h,d,f,g,_,m);f.transmission>0?i.push(p):f.transparent===!0?r.push(p):t.push(p)}function c(h,d,f,g,_,m){const p=o(h,d,f,g,_,m);f.transmission>0?i.unshift(p):f.transparent===!0?r.unshift(p):t.unshift(p)}function l(h,d){t.length>1&&t.sort(h||tx),i.length>1&&i.sort(d||_h),r.length>1&&r.sort(d||_h)}function u(){for(let h=e,d=n.length;h<d;h++){const f=n[h];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:i,transparent:r,init:s,push:a,unshift:c,finish:u,sort:l}}function nx(){let n=new WeakMap;function e(i,r){const s=n.get(i);let o;return s===void 0?(o=new xh,n.set(i,[o])):r>=s.length?(o=new xh,s.push(o)):o=s[r],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function ix(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new D,color:new St};break;case"SpotLight":t={position:new D,direction:new D,color:new St,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new D,color:new St,distance:0,decay:0};break;case"HemisphereLight":t={direction:new D,skyColor:new St,groundColor:new St};break;case"RectAreaLight":t={color:new St,position:new D,halfWidth:new D,halfHeight:new D};break}return n[e.id]=t,t}}}function rx(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ye};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ye};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ye,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let sx=0;function ox(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function ax(n){const e=new ix,t=rx(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new D);const r=new D,s=new $t,o=new $t;function a(l){let u=0,h=0,d=0;for(let S=0;S<9;S++)i.probe[S].set(0,0,0);let f=0,g=0,_=0,m=0,p=0,x=0,b=0,y=0,M=0,w=0,A=0;l.sort(ox);for(let S=0,E=l.length;S<E;S++){const U=l[S],k=U.color,$=U.intensity,H=U.distance,X=U.shadow&&U.shadow.map?U.shadow.map.texture:null;if(U.isAmbientLight)u+=k.r*$,h+=k.g*$,d+=k.b*$;else if(U.isLightProbe){for(let G=0;G<9;G++)i.probe[G].addScaledVector(U.sh.coefficients[G],$);A++}else if(U.isDirectionalLight){const G=e.get(U);if(G.color.copy(U.color).multiplyScalar(U.intensity),U.castShadow){const W=U.shadow,N=t.get(U);N.shadowIntensity=W.intensity,N.shadowBias=W.bias,N.shadowNormalBias=W.normalBias,N.shadowRadius=W.radius,N.shadowMapSize=W.mapSize,i.directionalShadow[f]=N,i.directionalShadowMap[f]=X,i.directionalShadowMatrix[f]=U.shadow.matrix,x++}i.directional[f]=G,f++}else if(U.isSpotLight){const G=e.get(U);G.position.setFromMatrixPosition(U.matrixWorld),G.color.copy(k).multiplyScalar($),G.distance=H,G.coneCos=Math.cos(U.angle),G.penumbraCos=Math.cos(U.angle*(1-U.penumbra)),G.decay=U.decay,i.spot[_]=G;const W=U.shadow;if(U.map&&(i.spotLightMap[M]=U.map,M++,W.updateMatrices(U),U.castShadow&&w++),i.spotLightMatrix[_]=W.matrix,U.castShadow){const N=t.get(U);N.shadowIntensity=W.intensity,N.shadowBias=W.bias,N.shadowNormalBias=W.normalBias,N.shadowRadius=W.radius,N.shadowMapSize=W.mapSize,i.spotShadow[_]=N,i.spotShadowMap[_]=X,y++}_++}else if(U.isRectAreaLight){const G=e.get(U);G.color.copy(k).multiplyScalar($),G.halfWidth.set(U.width*.5,0,0),G.halfHeight.set(0,U.height*.5,0),i.rectArea[m]=G,m++}else if(U.isPointLight){const G=e.get(U);if(G.color.copy(U.color).multiplyScalar(U.intensity),G.distance=U.distance,G.decay=U.decay,U.castShadow){const W=U.shadow,N=t.get(U);N.shadowIntensity=W.intensity,N.shadowBias=W.bias,N.shadowNormalBias=W.normalBias,N.shadowRadius=W.radius,N.shadowMapSize=W.mapSize,N.shadowCameraNear=W.camera.near,N.shadowCameraFar=W.camera.far,i.pointShadow[g]=N,i.pointShadowMap[g]=X,i.pointShadowMatrix[g]=U.shadow.matrix,b++}i.point[g]=G,g++}else if(U.isHemisphereLight){const G=e.get(U);G.skyColor.copy(U.color).multiplyScalar($),G.groundColor.copy(U.groundColor).multiplyScalar($),i.hemi[p]=G,p++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Pe.LTC_FLOAT_1,i.rectAreaLTC2=Pe.LTC_FLOAT_2):(i.rectAreaLTC1=Pe.LTC_HALF_1,i.rectAreaLTC2=Pe.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=h,i.ambient[2]=d;const C=i.hash;(C.directionalLength!==f||C.pointLength!==g||C.spotLength!==_||C.rectAreaLength!==m||C.hemiLength!==p||C.numDirectionalShadows!==x||C.numPointShadows!==b||C.numSpotShadows!==y||C.numSpotMaps!==M||C.numLightProbes!==A)&&(i.directional.length=f,i.spot.length=_,i.rectArea.length=m,i.point.length=g,i.hemi.length=p,i.directionalShadow.length=x,i.directionalShadowMap.length=x,i.pointShadow.length=b,i.pointShadowMap.length=b,i.spotShadow.length=y,i.spotShadowMap.length=y,i.directionalShadowMatrix.length=x,i.pointShadowMatrix.length=b,i.spotLightMatrix.length=y+M-w,i.spotLightMap.length=M,i.numSpotLightShadowsWithMaps=w,i.numLightProbes=A,C.directionalLength=f,C.pointLength=g,C.spotLength=_,C.rectAreaLength=m,C.hemiLength=p,C.numDirectionalShadows=x,C.numPointShadows=b,C.numSpotShadows=y,C.numSpotMaps=M,C.numLightProbes=A,i.version=sx++)}function c(l,u){let h=0,d=0,f=0,g=0,_=0;const m=u.matrixWorldInverse;for(let p=0,x=l.length;p<x;p++){const b=l[p];if(b.isDirectionalLight){const y=i.directional[h];y.direction.setFromMatrixPosition(b.matrixWorld),r.setFromMatrixPosition(b.target.matrixWorld),y.direction.sub(r),y.direction.transformDirection(m),h++}else if(b.isSpotLight){const y=i.spot[f];y.position.setFromMatrixPosition(b.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(b.matrixWorld),r.setFromMatrixPosition(b.target.matrixWorld),y.direction.sub(r),y.direction.transformDirection(m),f++}else if(b.isRectAreaLight){const y=i.rectArea[g];y.position.setFromMatrixPosition(b.matrixWorld),y.position.applyMatrix4(m),o.identity(),s.copy(b.matrixWorld),s.premultiply(m),o.extractRotation(s),y.halfWidth.set(b.width*.5,0,0),y.halfHeight.set(0,b.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),g++}else if(b.isPointLight){const y=i.point[d];y.position.setFromMatrixPosition(b.matrixWorld),y.position.applyMatrix4(m),d++}else if(b.isHemisphereLight){const y=i.hemi[_];y.direction.setFromMatrixPosition(b.matrixWorld),y.direction.transformDirection(m),_++}}}return{setup:a,setupView:c,state:i}}function yh(n){const e=new ax(n),t=[],i=[];function r(u){l.camera=u,t.length=0,i.length=0}function s(u){t.push(u)}function o(u){i.push(u)}function a(){e.setup(t)}function c(u){e.setupView(t,u)}const l={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:l,setupLights:a,setupLightsView:c,pushLight:s,pushShadow:o}}function cx(n){let e=new WeakMap;function t(r,s=0){const o=e.get(r);let a;return o===void 0?(a=new yh(n),e.set(r,[a])):s>=o.length?(a=new yh(n),o.push(a)):a=o[s],a}function i(){e=new WeakMap}return{get:t,dispose:i}}const lx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,ux=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function hx(n,e,t){let i=new Tl;const r=new ye,s=new ye,o=new en,a=new Dm({depthPacking:Jf}),c=new Im,l={},u=t.maxTextureSize,h={[sr]:Bn,[Bn]:sr,[gi]:gi},d=new or({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ye},radius:{value:4}},vertexShader:lx,fragmentShader:ux}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new hn;g.setAttribute("position",new Jn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Rn(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Xh;let p=this.type;this.render=function(w,A,C){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;const S=n.getRenderTarget(),E=n.getActiveCubeFace(),U=n.getActiveMipmapLevel(),k=n.state;k.setBlending(tr),k.buffers.depth.getReversed()===!0?k.buffers.color.setClear(0,0,0,0):k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);const $=p!==Ci&&this.type===Ci,H=p===Ci&&this.type!==Ci;for(let X=0,G=w.length;X<G;X++){const W=w[X],N=W.shadow;if(N===void 0){console.warn("THREE.WebGLShadowMap:",W,"has no shadow.");continue}if(N.autoUpdate===!1&&N.needsUpdate===!1)continue;r.copy(N.mapSize);const fe=N.getFrameExtents();if(r.multiply(fe),s.copy(N.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/fe.x),r.x=s.x*fe.x,N.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/fe.y),r.y=s.y*fe.y,N.mapSize.y=s.y)),N.map===null||$===!0||H===!0){const K=this.type!==Ci?{minFilter:ui,magFilter:ui}:{};N.map!==null&&N.map.dispose(),N.map=new Tr(r.x,r.y,K),N.map.texture.name=W.name+".shadowMap",N.camera.updateProjectionMatrix()}n.setRenderTarget(N.map),n.clear();const oe=N.getViewportCount();for(let K=0;K<oe;K++){const $e=N.getViewport(K);o.set(s.x*$e.x,s.y*$e.y,s.x*$e.z,s.y*$e.w),k.viewport(o),N.updateMatrices(W,K),i=N.getFrustum(),y(A,C,N.camera,W,this.type)}N.isPointLightShadow!==!0&&this.type===Ci&&x(N,C),N.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(S,E,U)};function x(w,A){const C=e.update(_);d.defines.VSM_SAMPLES!==w.blurSamples&&(d.defines.VSM_SAMPLES=w.blurSamples,f.defines.VSM_SAMPLES=w.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new Tr(r.x,r.y)),d.uniforms.shadow_pass.value=w.map.texture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,n.setRenderTarget(w.mapPass),n.clear(),n.renderBufferDirect(A,null,C,d,_,null),f.uniforms.shadow_pass.value=w.mapPass.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,n.setRenderTarget(w.map),n.clear(),n.renderBufferDirect(A,null,C,f,_,null)}function b(w,A,C,S){let E=null;const U=C.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(U!==void 0)E=U;else if(E=C.isPointLight===!0?c:a,n.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){const k=E.uuid,$=A.uuid;let H=l[k];H===void 0&&(H={},l[k]=H);let X=H[$];X===void 0&&(X=E.clone(),H[$]=X,A.addEventListener("dispose",M)),E=X}if(E.visible=A.visible,E.wireframe=A.wireframe,S===Ci?E.side=A.shadowSide!==null?A.shadowSide:A.side:E.side=A.shadowSide!==null?A.shadowSide:h[A.side],E.alphaMap=A.alphaMap,E.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,E.map=A.map,E.clipShadows=A.clipShadows,E.clippingPlanes=A.clippingPlanes,E.clipIntersection=A.clipIntersection,E.displacementMap=A.displacementMap,E.displacementScale=A.displacementScale,E.displacementBias=A.displacementBias,E.wireframeLinewidth=A.wireframeLinewidth,E.linewidth=A.linewidth,C.isPointLight===!0&&E.isMeshDistanceMaterial===!0){const k=n.properties.get(E);k.light=C}return E}function y(w,A,C,S,E){if(w.visible===!1)return;if(w.layers.test(A.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&E===Ci)&&(!w.frustumCulled||i.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,w.matrixWorld);const $=e.update(w),H=w.material;if(Array.isArray(H)){const X=$.groups;for(let G=0,W=X.length;G<W;G++){const N=X[G],fe=H[N.materialIndex];if(fe&&fe.visible){const oe=b(w,fe,S,E);w.onBeforeShadow(n,w,A,C,$,oe,N),n.renderBufferDirect(C,null,$,oe,w,N),w.onAfterShadow(n,w,A,C,$,oe,N)}}}else if(H.visible){const X=b(w,H,S,E);w.onBeforeShadow(n,w,A,C,$,X,null),n.renderBufferDirect(C,null,$,X,w,null),w.onAfterShadow(n,w,A,C,$,X,null)}}const k=w.children;for(let $=0,H=k.length;$<H;$++)y(k[$],A,C,S,E)}function M(w){w.target.removeEventListener("dispose",M);for(const C in l){const S=l[C],E=w.target.uuid;E in S&&(S[E].dispose(),delete S[E])}}}const dx={[gc]:vc,[_c]:bc,[xc]:Mc,[cs]:yc,[vc]:gc,[bc]:_c,[Mc]:xc,[yc]:cs};function fx(n,e){function t(){let V=!1;const xe=new en;let Se=null;const Ne=new en(0,0,0,0);return{setMask:function(ve){Se!==ve&&!V&&(n.colorMask(ve,ve,ve,ve),Se=ve)},setLocked:function(ve){V=ve},setClear:function(ve,ue,ke,ot,bt){bt===!0&&(ve*=ot,ue*=ot,ke*=ot),xe.set(ve,ue,ke,ot),Ne.equals(xe)===!1&&(n.clearColor(ve,ue,ke,ot),Ne.copy(xe))},reset:function(){V=!1,Se=null,Ne.set(-1,0,0,0)}}}function i(){let V=!1,xe=!1,Se=null,Ne=null,ve=null;return{setReversed:function(ue){if(xe!==ue){const ke=e.get("EXT_clip_control");ue?ke.clipControlEXT(ke.LOWER_LEFT_EXT,ke.ZERO_TO_ONE_EXT):ke.clipControlEXT(ke.LOWER_LEFT_EXT,ke.NEGATIVE_ONE_TO_ONE_EXT),xe=ue;const ot=ve;ve=null,this.setClear(ot)}},getReversed:function(){return xe},setTest:function(ue){ue?le(n.DEPTH_TEST):Re(n.DEPTH_TEST)},setMask:function(ue){Se!==ue&&!V&&(n.depthMask(ue),Se=ue)},setFunc:function(ue){if(xe&&(ue=dx[ue]),Ne!==ue){switch(ue){case gc:n.depthFunc(n.NEVER);break;case vc:n.depthFunc(n.ALWAYS);break;case _c:n.depthFunc(n.LESS);break;case cs:n.depthFunc(n.LEQUAL);break;case xc:n.depthFunc(n.EQUAL);break;case yc:n.depthFunc(n.GEQUAL);break;case bc:n.depthFunc(n.GREATER);break;case Mc:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Ne=ue}},setLocked:function(ue){V=ue},setClear:function(ue){ve!==ue&&(xe&&(ue=1-ue),n.clearDepth(ue),ve=ue)},reset:function(){V=!1,Se=null,Ne=null,ve=null,xe=!1}}}function r(){let V=!1,xe=null,Se=null,Ne=null,ve=null,ue=null,ke=null,ot=null,bt=null;return{setTest:function(Mt){V||(Mt?le(n.STENCIL_TEST):Re(n.STENCIL_TEST))},setMask:function(Mt){xe!==Mt&&!V&&(n.stencilMask(Mt),xe=Mt)},setFunc:function(Mt,_n,Hn){(Se!==Mt||Ne!==_n||ve!==Hn)&&(n.stencilFunc(Mt,_n,Hn),Se=Mt,Ne=_n,ve=Hn)},setOp:function(Mt,_n,Hn){(ue!==Mt||ke!==_n||ot!==Hn)&&(n.stencilOp(Mt,_n,Hn),ue=Mt,ke=_n,ot=Hn)},setLocked:function(Mt){V=Mt},setClear:function(Mt){bt!==Mt&&(n.clearStencil(Mt),bt=Mt)},reset:function(){V=!1,xe=null,Se=null,Ne=null,ve=null,ue=null,ke=null,ot=null,bt=null}}}const s=new t,o=new i,a=new r,c=new WeakMap,l=new WeakMap;let u={},h={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,x=null,b=null,y=null,M=null,w=null,A=new St(0,0,0),C=0,S=!1,E=null,U=null,k=null,$=null,H=null;const X=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let G=!1,W=0;const N=n.getParameter(n.VERSION);N.indexOf("WebGL")!==-1?(W=parseFloat(/^WebGL (\d)/.exec(N)[1]),G=W>=1):N.indexOf("OpenGL ES")!==-1&&(W=parseFloat(/^OpenGL ES (\d)/.exec(N)[1]),G=W>=2);let fe=null,oe={};const K=n.getParameter(n.SCISSOR_BOX),$e=n.getParameter(n.VIEWPORT),at=new en().fromArray(K),Oe=new en().fromArray($e);function gt(V,xe,Se,Ne){const ve=new Uint8Array(4),ue=n.createTexture();n.bindTexture(V,ue),n.texParameteri(V,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(V,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let ke=0;ke<Se;ke++)V===n.TEXTURE_3D||V===n.TEXTURE_2D_ARRAY?n.texImage3D(xe,0,n.RGBA,1,1,Ne,0,n.RGBA,n.UNSIGNED_BYTE,ve):n.texImage2D(xe+ke,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,ve);return ue}const te={};te[n.TEXTURE_2D]=gt(n.TEXTURE_2D,n.TEXTURE_2D,1),te[n.TEXTURE_CUBE_MAP]=gt(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),te[n.TEXTURE_2D_ARRAY]=gt(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),te[n.TEXTURE_3D]=gt(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),le(n.DEPTH_TEST),o.setFunc(cs),se(!1),ce(uu),le(n.CULL_FACE),ge(tr);function le(V){u[V]!==!0&&(n.enable(V),u[V]=!0)}function Re(V){u[V]!==!1&&(n.disable(V),u[V]=!1)}function Xe(V,xe){return h[V]!==xe?(n.bindFramebuffer(V,xe),h[V]=xe,V===n.DRAW_FRAMEBUFFER&&(h[n.FRAMEBUFFER]=xe),V===n.FRAMEBUFFER&&(h[n.DRAW_FRAMEBUFFER]=xe),!0):!1}function Be(V,xe){let Se=f,Ne=!1;if(V){Se=d.get(xe),Se===void 0&&(Se=[],d.set(xe,Se));const ve=V.textures;if(Se.length!==ve.length||Se[0]!==n.COLOR_ATTACHMENT0){for(let ue=0,ke=ve.length;ue<ke;ue++)Se[ue]=n.COLOR_ATTACHMENT0+ue;Se.length=ve.length,Ne=!0}}else Se[0]!==n.BACK&&(Se[0]=n.BACK,Ne=!0);Ne&&n.drawBuffers(Se)}function Ke(V){return g!==V?(n.useProgram(V),g=V,!0):!1}const Nt={[yr]:n.FUNC_ADD,[wf]:n.FUNC_SUBTRACT,[Tf]:n.FUNC_REVERSE_SUBTRACT};Nt[Af]=n.MIN,Nt[Rf]=n.MAX;const B={[Cf]:n.ZERO,[Pf]:n.ONE,[Lf]:n.SRC_COLOR,[pc]:n.SRC_ALPHA,[Ff]:n.SRC_ALPHA_SATURATE,[Nf]:n.DST_COLOR,[If]:n.DST_ALPHA,[Df]:n.ONE_MINUS_SRC_COLOR,[mc]:n.ONE_MINUS_SRC_ALPHA,[Of]:n.ONE_MINUS_DST_COLOR,[Uf]:n.ONE_MINUS_DST_ALPHA,[kf]:n.CONSTANT_COLOR,[zf]:n.ONE_MINUS_CONSTANT_COLOR,[Bf]:n.CONSTANT_ALPHA,[Vf]:n.ONE_MINUS_CONSTANT_ALPHA};function ge(V,xe,Se,Ne,ve,ue,ke,ot,bt,Mt){if(V===tr){_===!0&&(Re(n.BLEND),_=!1);return}if(_===!1&&(le(n.BLEND),_=!0),V!==Ef){if(V!==m||Mt!==S){if((p!==yr||y!==yr)&&(n.blendEquation(n.FUNC_ADD),p=yr,y=yr),Mt)switch(V){case ts:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case hu:n.blendFunc(n.ONE,n.ONE);break;case du:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case fu:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",V);break}else switch(V){case ts:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case hu:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case du:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case fu:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",V);break}x=null,b=null,M=null,w=null,A.set(0,0,0),C=0,m=V,S=Mt}return}ve=ve||xe,ue=ue||Se,ke=ke||Ne,(xe!==p||ve!==y)&&(n.blendEquationSeparate(Nt[xe],Nt[ve]),p=xe,y=ve),(Se!==x||Ne!==b||ue!==M||ke!==w)&&(n.blendFuncSeparate(B[Se],B[Ne],B[ue],B[ke]),x=Se,b=Ne,M=ue,w=ke),(ot.equals(A)===!1||bt!==C)&&(n.blendColor(ot.r,ot.g,ot.b,bt),A.copy(ot),C=bt),m=V,S=!1}function he(V,xe){V.side===gi?Re(n.CULL_FACE):le(n.CULL_FACE);let Se=V.side===Bn;xe&&(Se=!Se),se(Se),V.blending===ts&&V.transparent===!1?ge(tr):ge(V.blending,V.blendEquation,V.blendSrc,V.blendDst,V.blendEquationAlpha,V.blendSrcAlpha,V.blendDstAlpha,V.blendColor,V.blendAlpha,V.premultipliedAlpha),o.setFunc(V.depthFunc),o.setTest(V.depthTest),o.setMask(V.depthWrite),s.setMask(V.colorWrite);const Ne=V.stencilWrite;a.setTest(Ne),Ne&&(a.setMask(V.stencilWriteMask),a.setFunc(V.stencilFunc,V.stencilRef,V.stencilFuncMask),a.setOp(V.stencilFail,V.stencilZFail,V.stencilZPass)),pe(V.polygonOffset,V.polygonOffsetFactor,V.polygonOffsetUnits),V.alphaToCoverage===!0?le(n.SAMPLE_ALPHA_TO_COVERAGE):Re(n.SAMPLE_ALPHA_TO_COVERAGE)}function se(V){E!==V&&(V?n.frontFace(n.CW):n.frontFace(n.CCW),E=V)}function ce(V){V!==Mf?(le(n.CULL_FACE),V!==U&&(V===uu?n.cullFace(n.BACK):V===Sf?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Re(n.CULL_FACE),U=V}function Ee(V){V!==k&&(G&&n.lineWidth(V),k=V)}function pe(V,xe,Se){V?(le(n.POLYGON_OFFSET_FILL),($!==xe||H!==Se)&&(n.polygonOffset(xe,Se),$=xe,H=Se)):Re(n.POLYGON_OFFSET_FILL)}function Me(V){V?le(n.SCISSOR_TEST):Re(n.SCISSOR_TEST)}function et(V){V===void 0&&(V=n.TEXTURE0+X-1),fe!==V&&(n.activeTexture(V),fe=V)}function it(V,xe,Se){Se===void 0&&(fe===null?Se=n.TEXTURE0+X-1:Se=fe);let Ne=oe[Se];Ne===void 0&&(Ne={type:void 0,texture:void 0},oe[Se]=Ne),(Ne.type!==V||Ne.texture!==xe)&&(fe!==Se&&(n.activeTexture(Se),fe=Se),n.bindTexture(V,xe||te[V]),Ne.type=V,Ne.texture=xe)}function I(){const V=oe[fe];V!==void 0&&V.type!==void 0&&(n.bindTexture(V.type,null),V.type=void 0,V.texture=void 0)}function T(){try{n.compressedTexImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Z(){try{n.compressedTexImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function ee(){try{n.texSubImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function de(){try{n.texSubImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function re(){try{n.compressedTexSubImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Fe(){try{n.compressedTexSubImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function be(){try{n.texStorage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Ge(){try{n.texStorage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Ve(){try{n.texImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function j(){try{n.texImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Le(V){at.equals(V)===!1&&(n.scissor(V.x,V.y,V.z,V.w),at.copy(V))}function tt(V){Oe.equals(V)===!1&&(n.viewport(V.x,V.y,V.z,V.w),Oe.copy(V))}function Ye(V,xe){let Se=l.get(xe);Se===void 0&&(Se=new WeakMap,l.set(xe,Se));let Ne=Se.get(V);Ne===void 0&&(Ne=n.getUniformBlockIndex(xe,V.name),Se.set(V,Ne))}function Ce(V,xe){const Ne=l.get(xe).get(V);c.get(xe)!==Ne&&(n.uniformBlockBinding(xe,Ne,V.__bindingPointIndex),c.set(xe,Ne))}function lt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),u={},fe=null,oe={},h={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,x=null,b=null,y=null,M=null,w=null,A=new St(0,0,0),C=0,S=!1,E=null,U=null,k=null,$=null,H=null,at.set(0,0,n.canvas.width,n.canvas.height),Oe.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:le,disable:Re,bindFramebuffer:Xe,drawBuffers:Be,useProgram:Ke,setBlending:ge,setMaterial:he,setFlipSided:se,setCullFace:ce,setLineWidth:Ee,setPolygonOffset:pe,setScissorTest:Me,activeTexture:et,bindTexture:it,unbindTexture:I,compressedTexImage2D:T,compressedTexImage3D:Z,texImage2D:Ve,texImage3D:j,updateUBOMapping:Ye,uniformBlockBinding:Ce,texStorage2D:be,texStorage3D:Ge,texSubImage2D:ee,texSubImage3D:de,compressedTexSubImage2D:re,compressedTexSubImage3D:Fe,scissor:Le,viewport:tt,reset:lt}}function px(n,e,t,i,r,s,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new ye,u=new WeakMap;let h;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(I,T){return f?new OffscreenCanvas(I,T):Jo("canvas")}function _(I,T,Z){let ee=1;const de=it(I);if((de.width>Z||de.height>Z)&&(ee=Z/Math.max(de.width,de.height)),ee<1)if(typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&I instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&I instanceof ImageBitmap||typeof VideoFrame<"u"&&I instanceof VideoFrame){const re=Math.floor(ee*de.width),Fe=Math.floor(ee*de.height);h===void 0&&(h=g(re,Fe));const be=T?g(re,Fe):h;return be.width=re,be.height=Fe,be.getContext("2d").drawImage(I,0,0,re,Fe),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+de.width+"x"+de.height+") to ("+re+"x"+Fe+")."),be}else return"data"in I&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+de.width+"x"+de.height+")."),I;return I}function m(I){return I.generateMipmaps}function p(I){n.generateMipmap(I)}function x(I){return I.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:I.isWebGL3DRenderTarget?n.TEXTURE_3D:I.isWebGLArrayRenderTarget||I.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function b(I,T,Z,ee,de=!1){if(I!==null){if(n[I]!==void 0)return n[I];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+I+"'")}let re=T;if(T===n.RED&&(Z===n.FLOAT&&(re=n.R32F),Z===n.HALF_FLOAT&&(re=n.R16F),Z===n.UNSIGNED_BYTE&&(re=n.R8)),T===n.RED_INTEGER&&(Z===n.UNSIGNED_BYTE&&(re=n.R8UI),Z===n.UNSIGNED_SHORT&&(re=n.R16UI),Z===n.UNSIGNED_INT&&(re=n.R32UI),Z===n.BYTE&&(re=n.R8I),Z===n.SHORT&&(re=n.R16I),Z===n.INT&&(re=n.R32I)),T===n.RG&&(Z===n.FLOAT&&(re=n.RG32F),Z===n.HALF_FLOAT&&(re=n.RG16F),Z===n.UNSIGNED_BYTE&&(re=n.RG8)),T===n.RG_INTEGER&&(Z===n.UNSIGNED_BYTE&&(re=n.RG8UI),Z===n.UNSIGNED_SHORT&&(re=n.RG16UI),Z===n.UNSIGNED_INT&&(re=n.RG32UI),Z===n.BYTE&&(re=n.RG8I),Z===n.SHORT&&(re=n.RG16I),Z===n.INT&&(re=n.RG32I)),T===n.RGB_INTEGER&&(Z===n.UNSIGNED_BYTE&&(re=n.RGB8UI),Z===n.UNSIGNED_SHORT&&(re=n.RGB16UI),Z===n.UNSIGNED_INT&&(re=n.RGB32UI),Z===n.BYTE&&(re=n.RGB8I),Z===n.SHORT&&(re=n.RGB16I),Z===n.INT&&(re=n.RGB32I)),T===n.RGBA_INTEGER&&(Z===n.UNSIGNED_BYTE&&(re=n.RGBA8UI),Z===n.UNSIGNED_SHORT&&(re=n.RGBA16UI),Z===n.UNSIGNED_INT&&(re=n.RGBA32UI),Z===n.BYTE&&(re=n.RGBA8I),Z===n.SHORT&&(re=n.RGBA16I),Z===n.INT&&(re=n.RGBA32I)),T===n.RGB&&(Z===n.UNSIGNED_INT_5_9_9_9_REV&&(re=n.RGB9_E5),Z===n.UNSIGNED_INT_10F_11F_11F_REV&&(re=n.R11F_G11F_B10F)),T===n.RGBA){const Fe=de?Zo:At.getTransfer(ee);Z===n.FLOAT&&(re=n.RGBA32F),Z===n.HALF_FLOAT&&(re=n.RGBA16F),Z===n.UNSIGNED_BYTE&&(re=Fe===kt?n.SRGB8_ALPHA8:n.RGBA8),Z===n.UNSIGNED_SHORT_4_4_4_4&&(re=n.RGBA4),Z===n.UNSIGNED_SHORT_5_5_5_1&&(re=n.RGB5_A1)}return(re===n.R16F||re===n.R32F||re===n.RG16F||re===n.RG32F||re===n.RGBA16F||re===n.RGBA32F)&&e.get("EXT_color_buffer_float"),re}function y(I,T){let Z;return I?T===null||T===wr||T===$s?Z=n.DEPTH24_STENCIL8:T===Ui?Z=n.DEPTH32F_STENCIL8:T===Ws&&(Z=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):T===null||T===wr||T===$s?Z=n.DEPTH_COMPONENT24:T===Ui?Z=n.DEPTH_COMPONENT32F:T===Ws&&(Z=n.DEPTH_COMPONENT16),Z}function M(I,T){return m(I)===!0||I.isFramebufferTexture&&I.minFilter!==ui&&I.minFilter!==ai?Math.log2(Math.max(T.width,T.height))+1:I.mipmaps!==void 0&&I.mipmaps.length>0?I.mipmaps.length:I.isCompressedTexture&&Array.isArray(I.image)?T.mipmaps.length:1}function w(I){const T=I.target;T.removeEventListener("dispose",w),C(T),T.isVideoTexture&&u.delete(T)}function A(I){const T=I.target;T.removeEventListener("dispose",A),E(T)}function C(I){const T=i.get(I);if(T.__webglInit===void 0)return;const Z=I.source,ee=d.get(Z);if(ee){const de=ee[T.__cacheKey];de.usedTimes--,de.usedTimes===0&&S(I),Object.keys(ee).length===0&&d.delete(Z)}i.remove(I)}function S(I){const T=i.get(I);n.deleteTexture(T.__webglTexture);const Z=I.source,ee=d.get(Z);delete ee[T.__cacheKey],o.memory.textures--}function E(I){const T=i.get(I);if(I.depthTexture&&(I.depthTexture.dispose(),i.remove(I.depthTexture)),I.isWebGLCubeRenderTarget)for(let ee=0;ee<6;ee++){if(Array.isArray(T.__webglFramebuffer[ee]))for(let de=0;de<T.__webglFramebuffer[ee].length;de++)n.deleteFramebuffer(T.__webglFramebuffer[ee][de]);else n.deleteFramebuffer(T.__webglFramebuffer[ee]);T.__webglDepthbuffer&&n.deleteRenderbuffer(T.__webglDepthbuffer[ee])}else{if(Array.isArray(T.__webglFramebuffer))for(let ee=0;ee<T.__webglFramebuffer.length;ee++)n.deleteFramebuffer(T.__webglFramebuffer[ee]);else n.deleteFramebuffer(T.__webglFramebuffer);if(T.__webglDepthbuffer&&n.deleteRenderbuffer(T.__webglDepthbuffer),T.__webglMultisampledFramebuffer&&n.deleteFramebuffer(T.__webglMultisampledFramebuffer),T.__webglColorRenderbuffer)for(let ee=0;ee<T.__webglColorRenderbuffer.length;ee++)T.__webglColorRenderbuffer[ee]&&n.deleteRenderbuffer(T.__webglColorRenderbuffer[ee]);T.__webglDepthRenderbuffer&&n.deleteRenderbuffer(T.__webglDepthRenderbuffer)}const Z=I.textures;for(let ee=0,de=Z.length;ee<de;ee++){const re=i.get(Z[ee]);re.__webglTexture&&(n.deleteTexture(re.__webglTexture),o.memory.textures--),i.remove(Z[ee])}i.remove(I)}let U=0;function k(){U=0}function $(){const I=U;return I>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+I+" texture units while this GPU supports only "+r.maxTextures),U+=1,I}function H(I){const T=[];return T.push(I.wrapS),T.push(I.wrapT),T.push(I.wrapR||0),T.push(I.magFilter),T.push(I.minFilter),T.push(I.anisotropy),T.push(I.internalFormat),T.push(I.format),T.push(I.type),T.push(I.generateMipmaps),T.push(I.premultiplyAlpha),T.push(I.flipY),T.push(I.unpackAlignment),T.push(I.colorSpace),T.join()}function X(I,T){const Z=i.get(I);if(I.isVideoTexture&&Me(I),I.isRenderTargetTexture===!1&&I.isExternalTexture!==!0&&I.version>0&&Z.__version!==I.version){const ee=I.image;if(ee===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ee.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{te(Z,I,T);return}}else I.isExternalTexture&&(Z.__webglTexture=I.sourceTexture?I.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,Z.__webglTexture,n.TEXTURE0+T)}function G(I,T){const Z=i.get(I);if(I.isRenderTargetTexture===!1&&I.version>0&&Z.__version!==I.version){te(Z,I,T);return}t.bindTexture(n.TEXTURE_2D_ARRAY,Z.__webglTexture,n.TEXTURE0+T)}function W(I,T){const Z=i.get(I);if(I.isRenderTargetTexture===!1&&I.version>0&&Z.__version!==I.version){te(Z,I,T);return}t.bindTexture(n.TEXTURE_3D,Z.__webglTexture,n.TEXTURE0+T)}function N(I,T){const Z=i.get(I);if(I.version>0&&Z.__version!==I.version){le(Z,I,T);return}t.bindTexture(n.TEXTURE_CUBE_MAP,Z.__webglTexture,n.TEXTURE0+T)}const fe={[wc]:n.REPEAT,[Sr]:n.CLAMP_TO_EDGE,[Tc]:n.MIRRORED_REPEAT},oe={[ui]:n.NEAREST,[Zf]:n.NEAREST_MIPMAP_NEAREST,[po]:n.NEAREST_MIPMAP_LINEAR,[ai]:n.LINEAR,[Ca]:n.LINEAR_MIPMAP_NEAREST,[Qi]:n.LINEAR_MIPMAP_LINEAR},K={[ep]:n.NEVER,[op]:n.ALWAYS,[tp]:n.LESS,[ad]:n.LEQUAL,[np]:n.EQUAL,[sp]:n.GEQUAL,[ip]:n.GREATER,[rp]:n.NOTEQUAL};function $e(I,T){if(T.type===Ui&&e.has("OES_texture_float_linear")===!1&&(T.magFilter===ai||T.magFilter===Ca||T.magFilter===po||T.magFilter===Qi||T.minFilter===ai||T.minFilter===Ca||T.minFilter===po||T.minFilter===Qi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(I,n.TEXTURE_WRAP_S,fe[T.wrapS]),n.texParameteri(I,n.TEXTURE_WRAP_T,fe[T.wrapT]),(I===n.TEXTURE_3D||I===n.TEXTURE_2D_ARRAY)&&n.texParameteri(I,n.TEXTURE_WRAP_R,fe[T.wrapR]),n.texParameteri(I,n.TEXTURE_MAG_FILTER,oe[T.magFilter]),n.texParameteri(I,n.TEXTURE_MIN_FILTER,oe[T.minFilter]),T.compareFunction&&(n.texParameteri(I,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(I,n.TEXTURE_COMPARE_FUNC,K[T.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===ui||T.minFilter!==po&&T.minFilter!==Qi||T.type===Ui&&e.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||i.get(T).__currentAnisotropy){const Z=e.get("EXT_texture_filter_anisotropic");n.texParameterf(I,Z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,r.getMaxAnisotropy())),i.get(T).__currentAnisotropy=T.anisotropy}}}function at(I,T){let Z=!1;I.__webglInit===void 0&&(I.__webglInit=!0,T.addEventListener("dispose",w));const ee=T.source;let de=d.get(ee);de===void 0&&(de={},d.set(ee,de));const re=H(T);if(re!==I.__cacheKey){de[re]===void 0&&(de[re]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,Z=!0),de[re].usedTimes++;const Fe=de[I.__cacheKey];Fe!==void 0&&(de[I.__cacheKey].usedTimes--,Fe.usedTimes===0&&S(T)),I.__cacheKey=re,I.__webglTexture=de[re].texture}return Z}function Oe(I,T,Z){return Math.floor(Math.floor(I/Z)/T)}function gt(I,T,Z,ee){const re=I.updateRanges;if(re.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,T.width,T.height,Z,ee,T.data);else{re.sort((j,Le)=>j.start-Le.start);let Fe=0;for(let j=1;j<re.length;j++){const Le=re[Fe],tt=re[j],Ye=Le.start+Le.count,Ce=Oe(tt.start,T.width,4),lt=Oe(Le.start,T.width,4);tt.start<=Ye+1&&Ce===lt&&Oe(tt.start+tt.count-1,T.width,4)===Ce?Le.count=Math.max(Le.count,tt.start+tt.count-Le.start):(++Fe,re[Fe]=tt)}re.length=Fe+1;const be=n.getParameter(n.UNPACK_ROW_LENGTH),Ge=n.getParameter(n.UNPACK_SKIP_PIXELS),Ve=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,T.width);for(let j=0,Le=re.length;j<Le;j++){const tt=re[j],Ye=Math.floor(tt.start/4),Ce=Math.ceil(tt.count/4),lt=Ye%T.width,V=Math.floor(Ye/T.width),xe=Ce,Se=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,lt),n.pixelStorei(n.UNPACK_SKIP_ROWS,V),t.texSubImage2D(n.TEXTURE_2D,0,lt,V,xe,Se,Z,ee,T.data)}I.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,be),n.pixelStorei(n.UNPACK_SKIP_PIXELS,Ge),n.pixelStorei(n.UNPACK_SKIP_ROWS,Ve)}}function te(I,T,Z){let ee=n.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(ee=n.TEXTURE_2D_ARRAY),T.isData3DTexture&&(ee=n.TEXTURE_3D);const de=at(I,T),re=T.source;t.bindTexture(ee,I.__webglTexture,n.TEXTURE0+Z);const Fe=i.get(re);if(re.version!==Fe.__version||de===!0){t.activeTexture(n.TEXTURE0+Z);const be=At.getPrimaries(At.workingColorSpace),Ge=T.colorSpace===Ji?null:At.getPrimaries(T.colorSpace),Ve=T.colorSpace===Ji||be===Ge?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,T.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,T.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ve);let j=_(T.image,!1,r.maxTextureSize);j=et(T,j);const Le=s.convert(T.format,T.colorSpace),tt=s.convert(T.type);let Ye=b(T.internalFormat,Le,tt,T.colorSpace,T.isVideoTexture);$e(ee,T);let Ce;const lt=T.mipmaps,V=T.isVideoTexture!==!0,xe=Fe.__version===void 0||de===!0,Se=re.dataReady,Ne=M(T,j);if(T.isDepthTexture)Ye=y(T.format===Xs,T.type),xe&&(V?t.texStorage2D(n.TEXTURE_2D,1,Ye,j.width,j.height):t.texImage2D(n.TEXTURE_2D,0,Ye,j.width,j.height,0,Le,tt,null));else if(T.isDataTexture)if(lt.length>0){V&&xe&&t.texStorage2D(n.TEXTURE_2D,Ne,Ye,lt[0].width,lt[0].height);for(let ve=0,ue=lt.length;ve<ue;ve++)Ce=lt[ve],V?Se&&t.texSubImage2D(n.TEXTURE_2D,ve,0,0,Ce.width,Ce.height,Le,tt,Ce.data):t.texImage2D(n.TEXTURE_2D,ve,Ye,Ce.width,Ce.height,0,Le,tt,Ce.data);T.generateMipmaps=!1}else V?(xe&&t.texStorage2D(n.TEXTURE_2D,Ne,Ye,j.width,j.height),Se&&gt(T,j,Le,tt)):t.texImage2D(n.TEXTURE_2D,0,Ye,j.width,j.height,0,Le,tt,j.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){V&&xe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Ne,Ye,lt[0].width,lt[0].height,j.depth);for(let ve=0,ue=lt.length;ve<ue;ve++)if(Ce=lt[ve],T.format!==ci)if(Le!==null)if(V){if(Se)if(T.layerUpdates.size>0){const ke=Zu(Ce.width,Ce.height,T.format,T.type);for(const ot of T.layerUpdates){const bt=Ce.data.subarray(ot*ke/Ce.data.BYTES_PER_ELEMENT,(ot+1)*ke/Ce.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ve,0,0,ot,Ce.width,Ce.height,1,Le,bt)}T.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ve,0,0,0,Ce.width,Ce.height,j.depth,Le,Ce.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,ve,Ye,Ce.width,Ce.height,j.depth,0,Ce.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else V?Se&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,ve,0,0,0,Ce.width,Ce.height,j.depth,Le,tt,Ce.data):t.texImage3D(n.TEXTURE_2D_ARRAY,ve,Ye,Ce.width,Ce.height,j.depth,0,Le,tt,Ce.data)}else{V&&xe&&t.texStorage2D(n.TEXTURE_2D,Ne,Ye,lt[0].width,lt[0].height);for(let ve=0,ue=lt.length;ve<ue;ve++)Ce=lt[ve],T.format!==ci?Le!==null?V?Se&&t.compressedTexSubImage2D(n.TEXTURE_2D,ve,0,0,Ce.width,Ce.height,Le,Ce.data):t.compressedTexImage2D(n.TEXTURE_2D,ve,Ye,Ce.width,Ce.height,0,Ce.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):V?Se&&t.texSubImage2D(n.TEXTURE_2D,ve,0,0,Ce.width,Ce.height,Le,tt,Ce.data):t.texImage2D(n.TEXTURE_2D,ve,Ye,Ce.width,Ce.height,0,Le,tt,Ce.data)}else if(T.isDataArrayTexture)if(V){if(xe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Ne,Ye,j.width,j.height,j.depth),Se)if(T.layerUpdates.size>0){const ve=Zu(j.width,j.height,T.format,T.type);for(const ue of T.layerUpdates){const ke=j.data.subarray(ue*ve/j.data.BYTES_PER_ELEMENT,(ue+1)*ve/j.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,ue,j.width,j.height,1,Le,tt,ke)}T.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,j.width,j.height,j.depth,Le,tt,j.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Ye,j.width,j.height,j.depth,0,Le,tt,j.data);else if(T.isData3DTexture)V?(xe&&t.texStorage3D(n.TEXTURE_3D,Ne,Ye,j.width,j.height,j.depth),Se&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,j.width,j.height,j.depth,Le,tt,j.data)):t.texImage3D(n.TEXTURE_3D,0,Ye,j.width,j.height,j.depth,0,Le,tt,j.data);else if(T.isFramebufferTexture){if(xe)if(V)t.texStorage2D(n.TEXTURE_2D,Ne,Ye,j.width,j.height);else{let ve=j.width,ue=j.height;for(let ke=0;ke<Ne;ke++)t.texImage2D(n.TEXTURE_2D,ke,Ye,ve,ue,0,Le,tt,null),ve>>=1,ue>>=1}}else if(lt.length>0){if(V&&xe){const ve=it(lt[0]);t.texStorage2D(n.TEXTURE_2D,Ne,Ye,ve.width,ve.height)}for(let ve=0,ue=lt.length;ve<ue;ve++)Ce=lt[ve],V?Se&&t.texSubImage2D(n.TEXTURE_2D,ve,0,0,Le,tt,Ce):t.texImage2D(n.TEXTURE_2D,ve,Ye,Le,tt,Ce);T.generateMipmaps=!1}else if(V){if(xe){const ve=it(j);t.texStorage2D(n.TEXTURE_2D,Ne,Ye,ve.width,ve.height)}Se&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,Le,tt,j)}else t.texImage2D(n.TEXTURE_2D,0,Ye,Le,tt,j);m(T)&&p(ee),Fe.__version=re.version,T.onUpdate&&T.onUpdate(T)}I.__version=T.version}function le(I,T,Z){if(T.image.length!==6)return;const ee=at(I,T),de=T.source;t.bindTexture(n.TEXTURE_CUBE_MAP,I.__webglTexture,n.TEXTURE0+Z);const re=i.get(de);if(de.version!==re.__version||ee===!0){t.activeTexture(n.TEXTURE0+Z);const Fe=At.getPrimaries(At.workingColorSpace),be=T.colorSpace===Ji?null:At.getPrimaries(T.colorSpace),Ge=T.colorSpace===Ji||Fe===be?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,T.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,T.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ge);const Ve=T.isCompressedTexture||T.image[0].isCompressedTexture,j=T.image[0]&&T.image[0].isDataTexture,Le=[];for(let ue=0;ue<6;ue++)!Ve&&!j?Le[ue]=_(T.image[ue],!0,r.maxCubemapSize):Le[ue]=j?T.image[ue].image:T.image[ue],Le[ue]=et(T,Le[ue]);const tt=Le[0],Ye=s.convert(T.format,T.colorSpace),Ce=s.convert(T.type),lt=b(T.internalFormat,Ye,Ce,T.colorSpace),V=T.isVideoTexture!==!0,xe=re.__version===void 0||ee===!0,Se=de.dataReady;let Ne=M(T,tt);$e(n.TEXTURE_CUBE_MAP,T);let ve;if(Ve){V&&xe&&t.texStorage2D(n.TEXTURE_CUBE_MAP,Ne,lt,tt.width,tt.height);for(let ue=0;ue<6;ue++){ve=Le[ue].mipmaps;for(let ke=0;ke<ve.length;ke++){const ot=ve[ke];T.format!==ci?Ye!==null?V?Se&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,ke,0,0,ot.width,ot.height,Ye,ot.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,ke,lt,ot.width,ot.height,0,ot.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):V?Se&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,ke,0,0,ot.width,ot.height,Ye,Ce,ot.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,ke,lt,ot.width,ot.height,0,Ye,Ce,ot.data)}}}else{if(ve=T.mipmaps,V&&xe){ve.length>0&&Ne++;const ue=it(Le[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,Ne,lt,ue.width,ue.height)}for(let ue=0;ue<6;ue++)if(j){V?Se&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0,0,0,Le[ue].width,Le[ue].height,Ye,Ce,Le[ue].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0,lt,Le[ue].width,Le[ue].height,0,Ye,Ce,Le[ue].data);for(let ke=0;ke<ve.length;ke++){const bt=ve[ke].image[ue].image;V?Se&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,ke+1,0,0,bt.width,bt.height,Ye,Ce,bt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,ke+1,lt,bt.width,bt.height,0,Ye,Ce,bt.data)}}else{V?Se&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0,0,0,Ye,Ce,Le[ue]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0,lt,Ye,Ce,Le[ue]);for(let ke=0;ke<ve.length;ke++){const ot=ve[ke];V?Se&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,ke+1,0,0,Ye,Ce,ot.image[ue]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,ke+1,lt,Ye,Ce,ot.image[ue])}}}m(T)&&p(n.TEXTURE_CUBE_MAP),re.__version=de.version,T.onUpdate&&T.onUpdate(T)}I.__version=T.version}function Re(I,T,Z,ee,de,re){const Fe=s.convert(Z.format,Z.colorSpace),be=s.convert(Z.type),Ge=b(Z.internalFormat,Fe,be,Z.colorSpace),Ve=i.get(T),j=i.get(Z);if(j.__renderTarget=T,!Ve.__hasExternalTextures){const Le=Math.max(1,T.width>>re),tt=Math.max(1,T.height>>re);de===n.TEXTURE_3D||de===n.TEXTURE_2D_ARRAY?t.texImage3D(de,re,Ge,Le,tt,T.depth,0,Fe,be,null):t.texImage2D(de,re,Ge,Le,tt,0,Fe,be,null)}t.bindFramebuffer(n.FRAMEBUFFER,I),pe(T)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ee,de,j.__webglTexture,0,Ee(T)):(de===n.TEXTURE_2D||de>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&de<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ee,de,j.__webglTexture,re),t.bindFramebuffer(n.FRAMEBUFFER,null)}function Xe(I,T,Z){if(n.bindRenderbuffer(n.RENDERBUFFER,I),T.depthBuffer){const ee=T.depthTexture,de=ee&&ee.isDepthTexture?ee.type:null,re=y(T.stencilBuffer,de),Fe=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,be=Ee(T);pe(T)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,be,re,T.width,T.height):Z?n.renderbufferStorageMultisample(n.RENDERBUFFER,be,re,T.width,T.height):n.renderbufferStorage(n.RENDERBUFFER,re,T.width,T.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Fe,n.RENDERBUFFER,I)}else{const ee=T.textures;for(let de=0;de<ee.length;de++){const re=ee[de],Fe=s.convert(re.format,re.colorSpace),be=s.convert(re.type),Ge=b(re.internalFormat,Fe,be,re.colorSpace),Ve=Ee(T);Z&&pe(T)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ve,Ge,T.width,T.height):pe(T)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ve,Ge,T.width,T.height):n.renderbufferStorage(n.RENDERBUFFER,Ge,T.width,T.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Be(I,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,I),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ee=i.get(T.depthTexture);ee.__renderTarget=T,(!ee.__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),X(T.depthTexture,0);const de=ee.__webglTexture,re=Ee(T);if(T.depthTexture.format===qs)pe(T)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,de,0,re):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,de,0);else if(T.depthTexture.format===Xs)pe(T)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,de,0,re):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,de,0);else throw new Error("Unknown depthTexture format")}function Ke(I){const T=i.get(I),Z=I.isWebGLCubeRenderTarget===!0;if(T.__boundDepthTexture!==I.depthTexture){const ee=I.depthTexture;if(T.__depthDisposeCallback&&T.__depthDisposeCallback(),ee){const de=()=>{delete T.__boundDepthTexture,delete T.__depthDisposeCallback,ee.removeEventListener("dispose",de)};ee.addEventListener("dispose",de),T.__depthDisposeCallback=de}T.__boundDepthTexture=ee}if(I.depthTexture&&!T.__autoAllocateDepthBuffer){if(Z)throw new Error("target.depthTexture not supported in Cube render targets");const ee=I.texture.mipmaps;ee&&ee.length>0?Be(T.__webglFramebuffer[0],I):Be(T.__webglFramebuffer,I)}else if(Z){T.__webglDepthbuffer=[];for(let ee=0;ee<6;ee++)if(t.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer[ee]),T.__webglDepthbuffer[ee]===void 0)T.__webglDepthbuffer[ee]=n.createRenderbuffer(),Xe(T.__webglDepthbuffer[ee],I,!1);else{const de=I.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,re=T.__webglDepthbuffer[ee];n.bindRenderbuffer(n.RENDERBUFFER,re),n.framebufferRenderbuffer(n.FRAMEBUFFER,de,n.RENDERBUFFER,re)}}else{const ee=I.texture.mipmaps;if(ee&&ee.length>0?t.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer===void 0)T.__webglDepthbuffer=n.createRenderbuffer(),Xe(T.__webglDepthbuffer,I,!1);else{const de=I.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,re=T.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,re),n.framebufferRenderbuffer(n.FRAMEBUFFER,de,n.RENDERBUFFER,re)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function Nt(I,T,Z){const ee=i.get(I);T!==void 0&&Re(ee.__webglFramebuffer,I,I.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),Z!==void 0&&Ke(I)}function B(I){const T=I.texture,Z=i.get(I),ee=i.get(T);I.addEventListener("dispose",A);const de=I.textures,re=I.isWebGLCubeRenderTarget===!0,Fe=de.length>1;if(Fe||(ee.__webglTexture===void 0&&(ee.__webglTexture=n.createTexture()),ee.__version=T.version,o.memory.textures++),re){Z.__webglFramebuffer=[];for(let be=0;be<6;be++)if(T.mipmaps&&T.mipmaps.length>0){Z.__webglFramebuffer[be]=[];for(let Ge=0;Ge<T.mipmaps.length;Ge++)Z.__webglFramebuffer[be][Ge]=n.createFramebuffer()}else Z.__webglFramebuffer[be]=n.createFramebuffer()}else{if(T.mipmaps&&T.mipmaps.length>0){Z.__webglFramebuffer=[];for(let be=0;be<T.mipmaps.length;be++)Z.__webglFramebuffer[be]=n.createFramebuffer()}else Z.__webglFramebuffer=n.createFramebuffer();if(Fe)for(let be=0,Ge=de.length;be<Ge;be++){const Ve=i.get(de[be]);Ve.__webglTexture===void 0&&(Ve.__webglTexture=n.createTexture(),o.memory.textures++)}if(I.samples>0&&pe(I)===!1){Z.__webglMultisampledFramebuffer=n.createFramebuffer(),Z.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,Z.__webglMultisampledFramebuffer);for(let be=0;be<de.length;be++){const Ge=de[be];Z.__webglColorRenderbuffer[be]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,Z.__webglColorRenderbuffer[be]);const Ve=s.convert(Ge.format,Ge.colorSpace),j=s.convert(Ge.type),Le=b(Ge.internalFormat,Ve,j,Ge.colorSpace,I.isXRRenderTarget===!0),tt=Ee(I);n.renderbufferStorageMultisample(n.RENDERBUFFER,tt,Le,I.width,I.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+be,n.RENDERBUFFER,Z.__webglColorRenderbuffer[be])}n.bindRenderbuffer(n.RENDERBUFFER,null),I.depthBuffer&&(Z.__webglDepthRenderbuffer=n.createRenderbuffer(),Xe(Z.__webglDepthRenderbuffer,I,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(re){t.bindTexture(n.TEXTURE_CUBE_MAP,ee.__webglTexture),$e(n.TEXTURE_CUBE_MAP,T);for(let be=0;be<6;be++)if(T.mipmaps&&T.mipmaps.length>0)for(let Ge=0;Ge<T.mipmaps.length;Ge++)Re(Z.__webglFramebuffer[be][Ge],I,T,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+be,Ge);else Re(Z.__webglFramebuffer[be],I,T,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+be,0);m(T)&&p(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Fe){for(let be=0,Ge=de.length;be<Ge;be++){const Ve=de[be],j=i.get(Ve);let Le=n.TEXTURE_2D;(I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(Le=I.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(Le,j.__webglTexture),$e(Le,Ve),Re(Z.__webglFramebuffer,I,Ve,n.COLOR_ATTACHMENT0+be,Le,0),m(Ve)&&p(Le)}t.unbindTexture()}else{let be=n.TEXTURE_2D;if((I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(be=I.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(be,ee.__webglTexture),$e(be,T),T.mipmaps&&T.mipmaps.length>0)for(let Ge=0;Ge<T.mipmaps.length;Ge++)Re(Z.__webglFramebuffer[Ge],I,T,n.COLOR_ATTACHMENT0,be,Ge);else Re(Z.__webglFramebuffer,I,T,n.COLOR_ATTACHMENT0,be,0);m(T)&&p(be),t.unbindTexture()}I.depthBuffer&&Ke(I)}function ge(I){const T=I.textures;for(let Z=0,ee=T.length;Z<ee;Z++){const de=T[Z];if(m(de)){const re=x(I),Fe=i.get(de).__webglTexture;t.bindTexture(re,Fe),p(re),t.unbindTexture()}}}const he=[],se=[];function ce(I){if(I.samples>0){if(pe(I)===!1){const T=I.textures,Z=I.width,ee=I.height;let de=n.COLOR_BUFFER_BIT;const re=I.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Fe=i.get(I),be=T.length>1;if(be)for(let Ve=0;Ve<T.length;Ve++)t.bindFramebuffer(n.FRAMEBUFFER,Fe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ve,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Fe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ve,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Fe.__webglMultisampledFramebuffer);const Ge=I.texture.mipmaps;Ge&&Ge.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Fe.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Fe.__webglFramebuffer);for(let Ve=0;Ve<T.length;Ve++){if(I.resolveDepthBuffer&&(I.depthBuffer&&(de|=n.DEPTH_BUFFER_BIT),I.stencilBuffer&&I.resolveStencilBuffer&&(de|=n.STENCIL_BUFFER_BIT)),be){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Fe.__webglColorRenderbuffer[Ve]);const j=i.get(T[Ve]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,j,0)}n.blitFramebuffer(0,0,Z,ee,0,0,Z,ee,de,n.NEAREST),c===!0&&(he.length=0,se.length=0,he.push(n.COLOR_ATTACHMENT0+Ve),I.depthBuffer&&I.resolveDepthBuffer===!1&&(he.push(re),se.push(re),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,se)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,he))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),be)for(let Ve=0;Ve<T.length;Ve++){t.bindFramebuffer(n.FRAMEBUFFER,Fe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ve,n.RENDERBUFFER,Fe.__webglColorRenderbuffer[Ve]);const j=i.get(T[Ve]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Fe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ve,n.TEXTURE_2D,j,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Fe.__webglMultisampledFramebuffer)}else if(I.depthBuffer&&I.resolveDepthBuffer===!1&&c){const T=I.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[T])}}}function Ee(I){return Math.min(r.maxSamples,I.samples)}function pe(I){const T=i.get(I);return I.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function Me(I){const T=o.render.frame;u.get(I)!==T&&(u.set(I,T),I.update())}function et(I,T){const Z=I.colorSpace,ee=I.format,de=I.type;return I.isCompressedTexture===!0||I.isVideoTexture===!0||Z!==hs&&Z!==Ji&&(At.getTransfer(Z)===kt?(ee!==ci||de!==xi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",Z)),T}function it(I){return typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement?(l.width=I.naturalWidth||I.width,l.height=I.naturalHeight||I.height):typeof VideoFrame<"u"&&I instanceof VideoFrame?(l.width=I.displayWidth,l.height=I.displayHeight):(l.width=I.width,l.height=I.height),l}this.allocateTextureUnit=$,this.resetTextureUnits=k,this.setTexture2D=X,this.setTexture2DArray=G,this.setTexture3D=W,this.setTextureCube=N,this.rebindTextures=Nt,this.setupRenderTarget=B,this.updateRenderTargetMipmap=ge,this.updateMultisampleRenderTarget=ce,this.setupDepthRenderbuffer=Ke,this.setupFrameBufferTexture=Re,this.useMultisampledRTT=pe}function mx(n,e){function t(i,r=Ji){let s;const o=At.getTransfer(r);if(i===xi)return n.UNSIGNED_BYTE;if(i===vl)return n.UNSIGNED_SHORT_4_4_4_4;if(i===_l)return n.UNSIGNED_SHORT_5_5_5_1;if(i===ed)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===td)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Jh)return n.BYTE;if(i===Qh)return n.SHORT;if(i===Ws)return n.UNSIGNED_SHORT;if(i===gl)return n.INT;if(i===wr)return n.UNSIGNED_INT;if(i===Ui)return n.FLOAT;if(i===to)return n.HALF_FLOAT;if(i===nd)return n.ALPHA;if(i===id)return n.RGB;if(i===ci)return n.RGBA;if(i===qs)return n.DEPTH_COMPONENT;if(i===Xs)return n.DEPTH_STENCIL;if(i===rd)return n.RED;if(i===xl)return n.RED_INTEGER;if(i===sd)return n.RG;if(i===yl)return n.RG_INTEGER;if(i===bl)return n.RGBA_INTEGER;if(i===Wo||i===$o||i===qo||i===Xo)if(o===kt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Wo)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===$o)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===qo)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Xo)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Wo)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===$o)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===qo)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Xo)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Ac||i===Rc||i===Cc||i===Pc)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Ac)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Rc)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Cc)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Pc)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Lc||i===Dc||i===Ic)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Lc||i===Dc)return o===kt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Ic)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Uc||i===Nc||i===Oc||i===Fc||i===kc||i===zc||i===Bc||i===Vc||i===Hc||i===Gc||i===Wc||i===$c||i===qc||i===Xc)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Uc)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Nc)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Oc)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Fc)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===kc)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===zc)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Bc)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Vc)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Hc)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Gc)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Wc)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===$c)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===qc)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Xc)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Yc||i===jc||i===Zc)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===Yc)return o===kt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===jc)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Zc)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Kc||i===Jc||i===Qc||i===el)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===Kc)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Jc)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Qc)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===el)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===$s?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const gx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,vx=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class _x{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new vd(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new or({vertexShader:gx,fragmentShader:vx,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Rn(new Ni(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class xx extends Rr{constructor(e,t){super();const i=this;let r=null,s=1,o=null,a="local-floor",c=1,l=null,u=null,h=null,d=null,f=null,g=null;const _=typeof XRWebGLBinding<"u",m=new _x,p={},x=t.getContextAttributes();let b=null,y=null;const M=[],w=[],A=new ye;let C=null;const S=new Zn;S.viewport=new en;const E=new Zn;E.viewport=new en;const U=[S,E],k=new km;let $=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(te){let le=M[te];return le===void 0&&(le=new Za,M[te]=le),le.getTargetRaySpace()},this.getControllerGrip=function(te){let le=M[te];return le===void 0&&(le=new Za,M[te]=le),le.getGripSpace()},this.getHand=function(te){let le=M[te];return le===void 0&&(le=new Za,M[te]=le),le.getHandSpace()};function X(te){const le=w.indexOf(te.inputSource);if(le===-1)return;const Re=M[le];Re!==void 0&&(Re.update(te.inputSource,te.frame,l||o),Re.dispatchEvent({type:te.type,data:te.inputSource}))}function G(){r.removeEventListener("select",X),r.removeEventListener("selectstart",X),r.removeEventListener("selectend",X),r.removeEventListener("squeeze",X),r.removeEventListener("squeezestart",X),r.removeEventListener("squeezeend",X),r.removeEventListener("end",G),r.removeEventListener("inputsourceschange",W);for(let te=0;te<M.length;te++){const le=w[te];le!==null&&(w[te]=null,M[te].disconnect(le))}$=null,H=null,m.reset();for(const te in p)delete p[te];e.setRenderTarget(b),f=null,d=null,h=null,r=null,y=null,gt.stop(),i.isPresenting=!1,e.setPixelRatio(C),e.setSize(A.width,A.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(te){s=te,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(te){a=te,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(te){l=te},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return h===null&&_&&(h=new XRWebGLBinding(r,t)),h},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(te){if(r=te,r!==null){if(b=e.getRenderTarget(),r.addEventListener("select",X),r.addEventListener("selectstart",X),r.addEventListener("selectend",X),r.addEventListener("squeeze",X),r.addEventListener("squeezestart",X),r.addEventListener("squeezeend",X),r.addEventListener("end",G),r.addEventListener("inputsourceschange",W),x.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(A),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let Re=null,Xe=null,Be=null;x.depth&&(Be=x.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Re=x.stencil?Xs:qs,Xe=x.stencil?$s:wr);const Ke={colorFormat:t.RGBA8,depthFormat:Be,scaleFactor:s};h=this.getBinding(),d=h.createProjectionLayer(Ke),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new Tr(d.textureWidth,d.textureHeight,{format:ci,type:xi,depthTexture:new gd(d.textureWidth,d.textureHeight,Xe,void 0,void 0,void 0,void 0,void 0,void 0,Re),stencilBuffer:x.stencil,colorSpace:e.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const Re={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(r,t,Re),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new Tr(f.framebufferWidth,f.framebufferHeight,{format:ci,type:xi,colorSpace:e.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await r.requestReferenceSpace(a),gt.setContext(r),gt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function W(te){for(let le=0;le<te.removed.length;le++){const Re=te.removed[le],Xe=w.indexOf(Re);Xe>=0&&(w[Xe]=null,M[Xe].disconnect(Re))}for(let le=0;le<te.added.length;le++){const Re=te.added[le];let Xe=w.indexOf(Re);if(Xe===-1){for(let Ke=0;Ke<M.length;Ke++)if(Ke>=w.length){w.push(Re),Xe=Ke;break}else if(w[Ke]===null){w[Ke]=Re,Xe=Ke;break}if(Xe===-1)break}const Be=M[Xe];Be&&Be.connect(Re)}}const N=new D,fe=new D;function oe(te,le,Re){N.setFromMatrixPosition(le.matrixWorld),fe.setFromMatrixPosition(Re.matrixWorld);const Xe=N.distanceTo(fe),Be=le.projectionMatrix.elements,Ke=Re.projectionMatrix.elements,Nt=Be[14]/(Be[10]-1),B=Be[14]/(Be[10]+1),ge=(Be[9]+1)/Be[5],he=(Be[9]-1)/Be[5],se=(Be[8]-1)/Be[0],ce=(Ke[8]+1)/Ke[0],Ee=Nt*se,pe=Nt*ce,Me=Xe/(-se+ce),et=Me*-se;if(le.matrixWorld.decompose(te.position,te.quaternion,te.scale),te.translateX(et),te.translateZ(Me),te.matrixWorld.compose(te.position,te.quaternion,te.scale),te.matrixWorldInverse.copy(te.matrixWorld).invert(),Be[10]===-1)te.projectionMatrix.copy(le.projectionMatrix),te.projectionMatrixInverse.copy(le.projectionMatrixInverse);else{const it=Nt+Me,I=B+Me,T=Ee-et,Z=pe+(Xe-et),ee=ge*B/I*it,de=he*B/I*it;te.projectionMatrix.makePerspective(T,Z,ee,de,it,I),te.projectionMatrixInverse.copy(te.projectionMatrix).invert()}}function K(te,le){le===null?te.matrixWorld.copy(te.matrix):te.matrixWorld.multiplyMatrices(le.matrixWorld,te.matrix),te.matrixWorldInverse.copy(te.matrixWorld).invert()}this.updateCamera=function(te){if(r===null)return;let le=te.near,Re=te.far;m.texture!==null&&(m.depthNear>0&&(le=m.depthNear),m.depthFar>0&&(Re=m.depthFar)),k.near=E.near=S.near=le,k.far=E.far=S.far=Re,($!==k.near||H!==k.far)&&(r.updateRenderState({depthNear:k.near,depthFar:k.far}),$=k.near,H=k.far),k.layers.mask=te.layers.mask|6,S.layers.mask=k.layers.mask&3,E.layers.mask=k.layers.mask&5;const Xe=te.parent,Be=k.cameras;K(k,Xe);for(let Ke=0;Ke<Be.length;Ke++)K(Be[Ke],Xe);Be.length===2?oe(k,S,E):k.projectionMatrix.copy(S.projectionMatrix),$e(te,k,Xe)};function $e(te,le,Re){Re===null?te.matrix.copy(le.matrixWorld):(te.matrix.copy(Re.matrixWorld),te.matrix.invert(),te.matrix.multiply(le.matrixWorld)),te.matrix.decompose(te.position,te.quaternion,te.scale),te.updateMatrixWorld(!0),te.projectionMatrix.copy(le.projectionMatrix),te.projectionMatrixInverse.copy(le.projectionMatrixInverse),te.isPerspectiveCamera&&(te.fov=Ys*2*Math.atan(1/te.projectionMatrix.elements[5]),te.zoom=1)}this.getCamera=function(){return k},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(te){c=te,d!==null&&(d.fixedFoveation=te),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=te)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(k)},this.getCameraTexture=function(te){return p[te]};let at=null;function Oe(te,le){if(u=le.getViewerPose(l||o),g=le,u!==null){const Re=u.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let Xe=!1;Re.length!==k.cameras.length&&(k.cameras.length=0,Xe=!0);for(let B=0;B<Re.length;B++){const ge=Re[B];let he=null;if(f!==null)he=f.getViewport(ge);else{const ce=h.getViewSubImage(d,ge);he=ce.viewport,B===0&&(e.setRenderTargetTextures(y,ce.colorTexture,ce.depthStencilTexture),e.setRenderTarget(y))}let se=U[B];se===void 0&&(se=new Zn,se.layers.enable(B),se.viewport=new en,U[B]=se),se.matrix.fromArray(ge.transform.matrix),se.matrix.decompose(se.position,se.quaternion,se.scale),se.projectionMatrix.fromArray(ge.projectionMatrix),se.projectionMatrixInverse.copy(se.projectionMatrix).invert(),se.viewport.set(he.x,he.y,he.width,he.height),B===0&&(k.matrix.copy(se.matrix),k.matrix.decompose(k.position,k.quaternion,k.scale)),Xe===!0&&k.cameras.push(se)}const Be=r.enabledFeatures;if(Be&&Be.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&_){h=i.getBinding();const B=h.getDepthInformation(Re[0]);B&&B.isValid&&B.texture&&m.init(B,r.renderState)}if(Be&&Be.includes("camera-access")&&_){e.state.unbindTexture(),h=i.getBinding();for(let B=0;B<Re.length;B++){const ge=Re[B].camera;if(ge){let he=p[ge];he||(he=new vd,p[ge]=he);const se=h.getCameraImage(ge);he.sourceTexture=se}}}}for(let Re=0;Re<M.length;Re++){const Xe=w[Re],Be=M[Re];Xe!==null&&Be!==void 0&&Be.update(Xe,le,l||o)}at&&at(te,le),le.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:le}),g=null}const gt=new Cd;gt.setAnimationLoop(Oe),this.setAnimationLoop=function(te){at=te},this.dispose=function(){}}}const _r=new Vn,yx=new $t;function bx(n,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,fd(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function r(m,p,x,b,y){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(m,p):p.isMeshToonMaterial?(s(m,p),h(m,p)):p.isMeshPhongMaterial?(s(m,p),u(m,p)):p.isMeshStandardMaterial?(s(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,y)):p.isMeshMatcapMaterial?(s(m,p),g(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),_(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?c(m,p,x,b):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Bn&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Bn&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const x=e.get(p),b=x.envMap,y=x.envMapRotation;b&&(m.envMap.value=b,_r.copy(y),_r.x*=-1,_r.y*=-1,_r.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(_r.y*=-1,_r.z*=-1),m.envMapRotation.value.setFromMatrix4(yx.makeRotationFromEuler(_r)),m.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,x,b){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*x,m.scale.value=b*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function u(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function h(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,x){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Bn&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const x=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function Mx(n,e,t,i){let r={},s={},o=[];const a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(x,b){const y=b.program;i.uniformBlockBinding(x,y)}function l(x,b){let y=r[x.id];y===void 0&&(g(x),y=u(x),r[x.id]=y,x.addEventListener("dispose",m));const M=b.program;i.updateUBOMapping(x,M);const w=e.render.frame;s[x.id]!==w&&(d(x),s[x.id]=w)}function u(x){const b=h();x.__bindingPointIndex=b;const y=n.createBuffer(),M=x.__size,w=x.usage;return n.bindBuffer(n.UNIFORM_BUFFER,y),n.bufferData(n.UNIFORM_BUFFER,M,w),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,b,y),y}function h(){for(let x=0;x<a;x++)if(o.indexOf(x)===-1)return o.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(x){const b=r[x.id],y=x.uniforms,M=x.__cache;n.bindBuffer(n.UNIFORM_BUFFER,b);for(let w=0,A=y.length;w<A;w++){const C=Array.isArray(y[w])?y[w]:[y[w]];for(let S=0,E=C.length;S<E;S++){const U=C[S];if(f(U,w,S,M)===!0){const k=U.__offset,$=Array.isArray(U.value)?U.value:[U.value];let H=0;for(let X=0;X<$.length;X++){const G=$[X],W=_(G);typeof G=="number"||typeof G=="boolean"?(U.__data[0]=G,n.bufferSubData(n.UNIFORM_BUFFER,k+H,U.__data)):G.isMatrix3?(U.__data[0]=G.elements[0],U.__data[1]=G.elements[1],U.__data[2]=G.elements[2],U.__data[3]=0,U.__data[4]=G.elements[3],U.__data[5]=G.elements[4],U.__data[6]=G.elements[5],U.__data[7]=0,U.__data[8]=G.elements[6],U.__data[9]=G.elements[7],U.__data[10]=G.elements[8],U.__data[11]=0):(G.toArray(U.__data,H),H+=W.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,k,U.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(x,b,y,M){const w=x.value,A=b+"_"+y;if(M[A]===void 0)return typeof w=="number"||typeof w=="boolean"?M[A]=w:M[A]=w.clone(),!0;{const C=M[A];if(typeof w=="number"||typeof w=="boolean"){if(C!==w)return M[A]=w,!0}else if(C.equals(w)===!1)return C.copy(w),!0}return!1}function g(x){const b=x.uniforms;let y=0;const M=16;for(let A=0,C=b.length;A<C;A++){const S=Array.isArray(b[A])?b[A]:[b[A]];for(let E=0,U=S.length;E<U;E++){const k=S[E],$=Array.isArray(k.value)?k.value:[k.value];for(let H=0,X=$.length;H<X;H++){const G=$[H],W=_(G),N=y%M,fe=N%W.boundary,oe=N+fe;y+=fe,oe!==0&&M-oe<W.storage&&(y+=M-oe),k.__data=new Float32Array(W.storage/Float32Array.BYTES_PER_ELEMENT),k.__offset=y,y+=W.storage}}}const w=y%M;return w>0&&(y+=M-w),x.__size=y,x.__cache={},this}function _(x){const b={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(b.boundary=4,b.storage=4):x.isVector2?(b.boundary=8,b.storage=8):x.isVector3||x.isColor?(b.boundary=16,b.storage=12):x.isVector4?(b.boundary=16,b.storage=16):x.isMatrix3?(b.boundary=48,b.storage=48):x.isMatrix4?(b.boundary=64,b.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),b}function m(x){const b=x.target;b.removeEventListener("dispose",m);const y=o.indexOf(b.__bindingPointIndex);o.splice(y,1),n.deleteBuffer(r[b.id]),delete r[b.id],delete s[b.id]}function p(){for(const x in r)n.deleteBuffer(r[x]);o=[],r={},s={}}return{bind:c,update:l,dispose:p}}class Sx{constructor(e={}){const{canvas:t=Sp(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let f;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=i.getContextAttributes().alpha}else f=o;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,p=null;const x=[],b=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=nr,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const y=this;let M=!1;this._outputColorSpace=wn;let w=0,A=0,C=null,S=-1,E=null;const U=new en,k=new en;let $=null;const H=new St(0);let X=0,G=t.width,W=t.height,N=1,fe=null,oe=null;const K=new en(0,0,G,W),$e=new en(0,0,G,W);let at=!1;const Oe=new Tl;let gt=!1,te=!1;const le=new $t,Re=new D,Xe=new en,Be={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ke=!1;function Nt(){return C===null?N:1}let B=i;function ge(P,q){return t.getContext(P,q)}try{const P={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${ml}`),t.addEventListener("webglcontextlost",Se,!1),t.addEventListener("webglcontextrestored",Ne,!1),t.addEventListener("webglcontextcreationerror",ve,!1),B===null){const q="webgl2";if(B=ge(q,P),B===null)throw ge(q)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(P){throw console.error("THREE.WebGLRenderer: "+P.message),P}let he,se,ce,Ee,pe,Me,et,it,I,T,Z,ee,de,re,Fe,be,Ge,Ve,j,Le,tt,Ye,Ce,lt;function V(){he=new Iv(B),he.init(),Ye=new mx(B,he),se=new Tv(B,he,e,Ye),ce=new fx(B,he),se.reversedDepthBuffer&&d&&ce.buffers.depth.setReversed(!0),Ee=new Ov(B),pe=new ex,Me=new px(B,he,ce,pe,se,Ye,Ee),et=new Rv(y),it=new Dv(y),I=new Hm(B),Ce=new Ev(B,I),T=new Uv(B,I,Ee,Ce),Z=new kv(B,T,I,Ee),j=new Fv(B,se,Me),be=new Av(pe),ee=new Q_(y,et,it,he,se,Ce,be),de=new bx(y,pe),re=new nx,Fe=new cx(he),Ve=new Sv(y,et,it,ce,Z,f,c),Ge=new hx(y,Z,se),lt=new Mx(B,Ee,se,ce),Le=new wv(B,he,Ee),tt=new Nv(B,he,Ee),Ee.programs=ee.programs,y.capabilities=se,y.extensions=he,y.properties=pe,y.renderLists=re,y.shadowMap=Ge,y.state=ce,y.info=Ee}V();const xe=new xx(y,B);this.xr=xe,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){const P=he.get("WEBGL_lose_context");P&&P.loseContext()},this.forceContextRestore=function(){const P=he.get("WEBGL_lose_context");P&&P.restoreContext()},this.getPixelRatio=function(){return N},this.setPixelRatio=function(P){P!==void 0&&(N=P,this.setSize(G,W,!1))},this.getSize=function(P){return P.set(G,W)},this.setSize=function(P,q,J=!0){if(xe.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}G=P,W=q,t.width=Math.floor(P*N),t.height=Math.floor(q*N),J===!0&&(t.style.width=P+"px",t.style.height=q+"px"),this.setViewport(0,0,P,q)},this.getDrawingBufferSize=function(P){return P.set(G*N,W*N).floor()},this.setDrawingBufferSize=function(P,q,J){G=P,W=q,N=J,t.width=Math.floor(P*J),t.height=Math.floor(q*J),this.setViewport(0,0,P,q)},this.getCurrentViewport=function(P){return P.copy(U)},this.getViewport=function(P){return P.copy(K)},this.setViewport=function(P,q,J,Q){P.isVector4?K.set(P.x,P.y,P.z,P.w):K.set(P,q,J,Q),ce.viewport(U.copy(K).multiplyScalar(N).round())},this.getScissor=function(P){return P.copy($e)},this.setScissor=function(P,q,J,Q){P.isVector4?$e.set(P.x,P.y,P.z,P.w):$e.set(P,q,J,Q),ce.scissor(k.copy($e).multiplyScalar(N).round())},this.getScissorTest=function(){return at},this.setScissorTest=function(P){ce.setScissorTest(at=P)},this.setOpaqueSort=function(P){fe=P},this.setTransparentSort=function(P){oe=P},this.getClearColor=function(P){return P.copy(Ve.getClearColor())},this.setClearColor=function(){Ve.setClearColor(...arguments)},this.getClearAlpha=function(){return Ve.getClearAlpha()},this.setClearAlpha=function(){Ve.setClearAlpha(...arguments)},this.clear=function(P=!0,q=!0,J=!0){let Q=0;if(P){let Y=!1;if(C!==null){const _e=C.texture.format;Y=_e===bl||_e===yl||_e===xl}if(Y){const _e=C.texture.type,Ae=_e===xi||_e===wr||_e===Ws||_e===$s||_e===vl||_e===_l,ze=Ve.getClearColor(),De=Ve.getClearAlpha(),Qe=ze.r,Je=ze.g,Ie=ze.b;Ae?(g[0]=Qe,g[1]=Je,g[2]=Ie,g[3]=De,B.clearBufferuiv(B.COLOR,0,g)):(_[0]=Qe,_[1]=Je,_[2]=Ie,_[3]=De,B.clearBufferiv(B.COLOR,0,_))}else Q|=B.COLOR_BUFFER_BIT}q&&(Q|=B.DEPTH_BUFFER_BIT),J&&(Q|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),B.clear(Q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Se,!1),t.removeEventListener("webglcontextrestored",Ne,!1),t.removeEventListener("webglcontextcreationerror",ve,!1),Ve.dispose(),re.dispose(),Fe.dispose(),pe.dispose(),et.dispose(),it.dispose(),Z.dispose(),Ce.dispose(),lt.dispose(),ee.dispose(),xe.dispose(),xe.removeEventListener("sessionstart",Hn),xe.removeEventListener("sessionend",io),Qn.stop()};function Se(P){P.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),M=!0}function Ne(){console.log("THREE.WebGLRenderer: Context Restored."),M=!1;const P=Ee.autoReset,q=Ge.enabled,J=Ge.autoUpdate,Q=Ge.needsUpdate,Y=Ge.type;V(),Ee.autoReset=P,Ge.enabled=q,Ge.autoUpdate=J,Ge.needsUpdate=Q,Ge.type=Y}function ve(P){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",P.statusMessage)}function ue(P){const q=P.target;q.removeEventListener("dispose",ue),ke(q)}function ke(P){ot(P),pe.remove(P)}function ot(P){const q=pe.get(P).programs;q!==void 0&&(q.forEach(function(J){ee.releaseProgram(J)}),P.isShaderMaterial&&ee.releaseShaderCache(P))}this.renderBufferDirect=function(P,q,J,Q,Y,_e){q===null&&(q=Be);const Ae=Y.isMesh&&Y.matrixWorld.determinant()<0,ze=so(P,q,J,Q,Y);ce.setMaterial(Q,Ae);let De=J.index,Qe=1;if(Q.wireframe===!0){if(De=T.getWireframeAttribute(J),De===void 0)return;Qe=2}const Je=J.drawRange,Ie=J.attributes.position;let st=Je.start*Qe,Pt=(Je.start+Je.count)*Qe;_e!==null&&(st=Math.max(st,_e.start*Qe),Pt=Math.min(Pt,(_e.start+_e.count)*Qe)),De!==null?(st=Math.max(st,0),Pt=Math.min(Pt,De.count)):Ie!=null&&(st=Math.max(st,0),Pt=Math.min(Pt,Ie.count));const qt=Pt-st;if(qt<0||qt===1/0)return;Ce.setup(Y,Q,ze,J,De);let Vt,wt=Le;if(De!==null&&(Vt=I.get(De),wt=tt,wt.setIndex(Vt)),Y.isMesh)Q.wireframe===!0?(ce.setLineWidth(Q.wireframeLinewidth*Nt()),wt.setMode(B.LINES)):wt.setMode(B.TRIANGLES);else if(Y.isLine){let Ze=Q.linewidth;Ze===void 0&&(Ze=1),ce.setLineWidth(Ze*Nt()),Y.isLineSegments?wt.setMode(B.LINES):Y.isLineLoop?wt.setMode(B.LINE_LOOP):wt.setMode(B.LINE_STRIP)}else Y.isPoints?wt.setMode(B.POINTS):Y.isSprite&&wt.setMode(B.TRIANGLES);if(Y.isBatchedMesh)if(Y._multiDrawInstances!==null)js("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),wt.renderMultiDrawInstances(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount,Y._multiDrawInstances);else if(he.get("WEBGL_multi_draw"))wt.renderMultiDraw(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount);else{const Ze=Y._multiDrawStarts,Ut=Y._multiDrawCounts,_t=Y._multiDrawCount,Cn=De?I.get(De).bytesPerElement:1,bi=pe.get(Q).currentProgram.getUniforms();for(let Xt=0;Xt<_t;Xt++)bi.setValue(B,"_gl_DrawID",Xt),wt.render(Ze[Xt]/Cn,Ut[Xt])}else if(Y.isInstancedMesh)wt.renderInstances(st,qt,Y.count);else if(J.isInstancedBufferGeometry){const Ze=J._maxInstanceCount!==void 0?J._maxInstanceCount:1/0,Ut=Math.min(J.instanceCount,Ze);wt.renderInstances(st,qt,Ut)}else wt.render(st,qt)};function bt(P,q,J){P.transparent===!0&&P.side===gi&&P.forceSinglePass===!1?(P.side=Bn,P.needsUpdate=!0,Lr(P,q,J),P.side=sr,P.needsUpdate=!0,Lr(P,q,J),P.side=gi):Lr(P,q,J)}this.compile=function(P,q,J=null){J===null&&(J=P),p=Fe.get(J),p.init(q),b.push(p),J.traverseVisible(function(Y){Y.isLight&&Y.layers.test(q.layers)&&(p.pushLight(Y),Y.castShadow&&p.pushShadow(Y))}),P!==J&&P.traverseVisible(function(Y){Y.isLight&&Y.layers.test(q.layers)&&(p.pushLight(Y),Y.castShadow&&p.pushShadow(Y))}),p.setupLights();const Q=new Set;return P.traverse(function(Y){if(!(Y.isMesh||Y.isPoints||Y.isLine||Y.isSprite))return;const _e=Y.material;if(_e)if(Array.isArray(_e))for(let Ae=0;Ae<_e.length;Ae++){const ze=_e[Ae];bt(ze,J,Y),Q.add(ze)}else bt(_e,J,Y),Q.add(_e)}),p=b.pop(),Q},this.compileAsync=function(P,q,J=null){const Q=this.compile(P,q,J);return new Promise(Y=>{function _e(){if(Q.forEach(function(Ae){pe.get(Ae).currentProgram.isReady()&&Q.delete(Ae)}),Q.size===0){Y(P);return}setTimeout(_e,10)}he.get("KHR_parallel_shader_compile")!==null?_e():setTimeout(_e,10)})};let Mt=null;function _n(P){Mt&&Mt(P)}function Hn(){Qn.stop()}function io(){Qn.start()}const Qn=new Cd;Qn.setAnimationLoop(_n),typeof self<"u"&&Qn.setContext(self),this.setAnimationLoop=function(P){Mt=P,xe.setAnimationLoop(P),P===null?Qn.stop():Qn.start()},xe.addEventListener("sessionstart",Hn),xe.addEventListener("sessionend",io),this.render=function(P,q){if(q!==void 0&&q.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;if(P.matrixWorldAutoUpdate===!0&&P.updateMatrixWorld(),q.parent===null&&q.matrixWorldAutoUpdate===!0&&q.updateMatrixWorld(),xe.enabled===!0&&xe.isPresenting===!0&&(xe.cameraAutoUpdate===!0&&xe.updateCamera(q),q=xe.getCamera()),P.isScene===!0&&P.onBeforeRender(y,P,q,C),p=Fe.get(P,b.length),p.init(q),b.push(p),le.multiplyMatrices(q.projectionMatrix,q.matrixWorldInverse),Oe.setFromProjectionMatrix(le,_i,q.reversedDepth),te=this.localClippingEnabled,gt=be.init(this.clippingPlanes,te),m=re.get(P,x.length),m.init(),x.push(m),xe.enabled===!0&&xe.isPresenting===!0){const _e=y.xr.getDepthSensingMesh();_e!==null&&Pr(_e,q,-1/0,y.sortObjects)}Pr(P,q,0,y.sortObjects),m.finish(),y.sortObjects===!0&&m.sort(fe,oe),Ke=xe.enabled===!1||xe.isPresenting===!1||xe.hasDepthSensing()===!1,Ke&&Ve.addToRenderList(m,P),this.info.render.frame++,gt===!0&&be.beginShadows();const J=p.state.shadowsArray;Ge.render(J,P,q),gt===!0&&be.endShadows(),this.info.autoReset===!0&&this.info.reset();const Q=m.opaque,Y=m.transmissive;if(p.setupLights(),q.isArrayCamera){const _e=q.cameras;if(Y.length>0)for(let Ae=0,ze=_e.length;Ae<ze;Ae++){const De=_e[Ae];ro(Q,Y,P,De)}Ke&&Ve.render(P);for(let Ae=0,ze=_e.length;Ae<ze;Ae++){const De=_e[Ae];hi(m,P,De,De.viewport)}}else Y.length>0&&ro(Q,Y,P,q),Ke&&Ve.render(P),hi(m,P,q);C!==null&&A===0&&(Me.updateMultisampleRenderTarget(C),Me.updateRenderTargetMipmap(C)),P.isScene===!0&&P.onAfterRender(y,P,q),Ce.resetDefaultState(),S=-1,E=null,b.pop(),b.length>0?(p=b[b.length-1],gt===!0&&be.setGlobalState(y.clippingPlanes,p.state.camera)):p=null,x.pop(),x.length>0?m=x[x.length-1]:m=null};function Pr(P,q,J,Q){if(P.visible===!1)return;if(P.layers.test(q.layers)){if(P.isGroup)J=P.renderOrder;else if(P.isLOD)P.autoUpdate===!0&&P.update(q);else if(P.isLight)p.pushLight(P),P.castShadow&&p.pushShadow(P);else if(P.isSprite){if(!P.frustumCulled||Oe.intersectsSprite(P)){Q&&Xe.setFromMatrixPosition(P.matrixWorld).applyMatrix4(le);const Ae=Z.update(P),ze=P.material;ze.visible&&m.push(P,Ae,ze,J,Xe.z,null)}}else if((P.isMesh||P.isLine||P.isPoints)&&(!P.frustumCulled||Oe.intersectsObject(P))){const Ae=Z.update(P),ze=P.material;if(Q&&(P.boundingSphere!==void 0?(P.boundingSphere===null&&P.computeBoundingSphere(),Xe.copy(P.boundingSphere.center)):(Ae.boundingSphere===null&&Ae.computeBoundingSphere(),Xe.copy(Ae.boundingSphere.center)),Xe.applyMatrix4(P.matrixWorld).applyMatrix4(le)),Array.isArray(ze)){const De=Ae.groups;for(let Qe=0,Je=De.length;Qe<Je;Qe++){const Ie=De[Qe],st=ze[Ie.materialIndex];st&&st.visible&&m.push(P,Ae,st,J,Xe.z,Ie)}}else ze.visible&&m.push(P,Ae,ze,J,Xe.z,null)}}const _e=P.children;for(let Ae=0,ze=_e.length;Ae<ze;Ae++)Pr(_e[Ae],q,J,Q)}function hi(P,q,J,Q){const Y=P.opaque,_e=P.transmissive,Ae=P.transparent;p.setupLightsView(J),gt===!0&&be.setGlobalState(y.clippingPlanes,J),Q&&ce.viewport(U.copy(Q)),Y.length>0&&di(Y,q,J),_e.length>0&&di(_e,q,J),Ae.length>0&&di(Ae,q,J),ce.buffers.depth.setTest(!0),ce.buffers.depth.setMask(!0),ce.buffers.color.setMask(!0),ce.setPolygonOffset(!1)}function ro(P,q,J,Q){if((J.isScene===!0?J.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[Q.id]===void 0&&(p.state.transmissionRenderTarget[Q.id]=new Tr(1,1,{generateMipmaps:!0,type:he.has("EXT_color_buffer_half_float")||he.has("EXT_color_buffer_float")?to:xi,minFilter:Qi,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:At.workingColorSpace}));const _e=p.state.transmissionRenderTarget[Q.id],Ae=Q.viewport||U;_e.setSize(Ae.z*y.transmissionResolutionScale,Ae.w*y.transmissionResolutionScale);const ze=y.getRenderTarget(),De=y.getActiveCubeFace(),Qe=y.getActiveMipmapLevel();y.setRenderTarget(_e),y.getClearColor(H),X=y.getClearAlpha(),X<1&&y.setClearColor(16777215,.5),y.clear(),Ke&&Ve.render(J);const Je=y.toneMapping;y.toneMapping=nr;const Ie=Q.viewport;if(Q.viewport!==void 0&&(Q.viewport=void 0),p.setupLightsView(Q),gt===!0&&be.setGlobalState(y.clippingPlanes,Q),di(P,J,Q),Me.updateMultisampleRenderTarget(_e),Me.updateRenderTargetMipmap(_e),he.has("WEBGL_multisampled_render_to_texture")===!1){let st=!1;for(let Pt=0,qt=q.length;Pt<qt;Pt++){const Vt=q[Pt],wt=Vt.object,Ze=Vt.geometry,Ut=Vt.material,_t=Vt.group;if(Ut.side===gi&&wt.layers.test(Q.layers)){const Cn=Ut.side;Ut.side=Bn,Ut.needsUpdate=!0,vs(wt,J,Q,Ze,Ut,_t),Ut.side=Cn,Ut.needsUpdate=!0,st=!0}}st===!0&&(Me.updateMultisampleRenderTarget(_e),Me.updateRenderTargetMipmap(_e))}y.setRenderTarget(ze,De,Qe),y.setClearColor(H,X),Ie!==void 0&&(Q.viewport=Ie),y.toneMapping=Je}function di(P,q,J){const Q=q.isScene===!0?q.overrideMaterial:null;for(let Y=0,_e=P.length;Y<_e;Y++){const Ae=P[Y],ze=Ae.object,De=Ae.geometry,Qe=Ae.group;let Je=Ae.material;Je.allowOverride===!0&&Q!==null&&(Je=Q),ze.layers.test(J.layers)&&vs(ze,q,J,De,Je,Qe)}}function vs(P,q,J,Q,Y,_e){P.onBeforeRender(y,q,J,Q,Y,_e),P.modelViewMatrix.multiplyMatrices(J.matrixWorldInverse,P.matrixWorld),P.normalMatrix.getNormalMatrix(P.modelViewMatrix),Y.onBeforeRender(y,q,J,Q,P,_e),Y.transparent===!0&&Y.side===gi&&Y.forceSinglePass===!1?(Y.side=Bn,Y.needsUpdate=!0,y.renderBufferDirect(J,q,Q,Y,P,_e),Y.side=sr,Y.needsUpdate=!0,y.renderBufferDirect(J,q,Q,Y,P,_e),Y.side=gi):y.renderBufferDirect(J,q,Q,Y,P,_e),P.onAfterRender(y,q,J,Q,Y,_e)}function Lr(P,q,J){q.isScene!==!0&&(q=Be);const Q=pe.get(P),Y=p.state.lights,_e=p.state.shadowsArray,Ae=Y.state.version,ze=ee.getParameters(P,Y.state,_e,q,J),De=ee.getProgramCacheKey(ze);let Qe=Q.programs;Q.environment=P.isMeshStandardMaterial?q.environment:null,Q.fog=q.fog,Q.envMap=(P.isMeshStandardMaterial?it:et).get(P.envMap||Q.environment),Q.envMapRotation=Q.environment!==null&&P.envMap===null?q.environmentRotation:P.envMapRotation,Qe===void 0&&(P.addEventListener("dispose",ue),Qe=new Map,Q.programs=Qe);let Je=Qe.get(De);if(Je!==void 0){if(Q.currentProgram===Je&&Q.lightsStateVersion===Ae)return ar(P,ze),Je}else ze.uniforms=ee.getUniforms(P),P.onBeforeCompile(ze,y),Je=ee.acquireProgram(ze,De),Qe.set(De,Je),Q.uniforms=ze.uniforms;const Ie=Q.uniforms;return(!P.isShaderMaterial&&!P.isRawShaderMaterial||P.clipping===!0)&&(Ie.clippingPlanes=be.uniform),ar(P,ze),Q.needsLights=_s(P),Q.lightsStateVersion=Ae,Q.needsLights&&(Ie.ambientLightColor.value=Y.state.ambient,Ie.lightProbe.value=Y.state.probe,Ie.directionalLights.value=Y.state.directional,Ie.directionalLightShadows.value=Y.state.directionalShadow,Ie.spotLights.value=Y.state.spot,Ie.spotLightShadows.value=Y.state.spotShadow,Ie.rectAreaLights.value=Y.state.rectArea,Ie.ltc_1.value=Y.state.rectAreaLTC1,Ie.ltc_2.value=Y.state.rectAreaLTC2,Ie.pointLights.value=Y.state.point,Ie.pointLightShadows.value=Y.state.pointShadow,Ie.hemisphereLights.value=Y.state.hemi,Ie.directionalShadowMap.value=Y.state.directionalShadowMap,Ie.directionalShadowMatrix.value=Y.state.directionalShadowMatrix,Ie.spotShadowMap.value=Y.state.spotShadowMap,Ie.spotLightMatrix.value=Y.state.spotLightMatrix,Ie.spotLightMap.value=Y.state.spotLightMap,Ie.pointShadowMap.value=Y.state.pointShadowMap,Ie.pointShadowMatrix.value=Y.state.pointShadowMatrix),Q.currentProgram=Je,Q.uniformsList=null,Je}function zi(P){if(P.uniformsList===null){const q=P.currentProgram.getUniforms();P.uniformsList=Yo.seqWithValue(q.seq,P.uniforms)}return P.uniformsList}function ar(P,q){const J=pe.get(P);J.outputColorSpace=q.outputColorSpace,J.batching=q.batching,J.batchingColor=q.batchingColor,J.instancing=q.instancing,J.instancingColor=q.instancingColor,J.instancingMorph=q.instancingMorph,J.skinning=q.skinning,J.morphTargets=q.morphTargets,J.morphNormals=q.morphNormals,J.morphColors=q.morphColors,J.morphTargetsCount=q.morphTargetsCount,J.numClippingPlanes=q.numClippingPlanes,J.numIntersection=q.numClipIntersection,J.vertexAlphas=q.vertexAlphas,J.vertexTangents=q.vertexTangents,J.toneMapping=q.toneMapping}function so(P,q,J,Q,Y){q.isScene!==!0&&(q=Be),Me.resetTextureUnits();const _e=q.fog,Ae=Q.isMeshStandardMaterial?q.environment:null,ze=C===null?y.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:hs,De=(Q.isMeshStandardMaterial?it:et).get(Q.envMap||Ae),Qe=Q.vertexColors===!0&&!!J.attributes.color&&J.attributes.color.itemSize===4,Je=!!J.attributes.tangent&&(!!Q.normalMap||Q.anisotropy>0),Ie=!!J.morphAttributes.position,st=!!J.morphAttributes.normal,Pt=!!J.morphAttributes.color;let qt=nr;Q.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(qt=y.toneMapping);const Vt=J.morphAttributes.position||J.morphAttributes.normal||J.morphAttributes.color,wt=Vt!==void 0?Vt.length:0,Ze=pe.get(Q),Ut=p.state.lights;if(gt===!0&&(te===!0||P!==E)){const pn=P===E&&Q.id===S;be.setState(Q,P,pn)}let _t=!1;Q.version===Ze.__version?(Ze.needsLights&&Ze.lightsStateVersion!==Ut.state.version||Ze.outputColorSpace!==ze||Y.isBatchedMesh&&Ze.batching===!1||!Y.isBatchedMesh&&Ze.batching===!0||Y.isBatchedMesh&&Ze.batchingColor===!0&&Y.colorTexture===null||Y.isBatchedMesh&&Ze.batchingColor===!1&&Y.colorTexture!==null||Y.isInstancedMesh&&Ze.instancing===!1||!Y.isInstancedMesh&&Ze.instancing===!0||Y.isSkinnedMesh&&Ze.skinning===!1||!Y.isSkinnedMesh&&Ze.skinning===!0||Y.isInstancedMesh&&Ze.instancingColor===!0&&Y.instanceColor===null||Y.isInstancedMesh&&Ze.instancingColor===!1&&Y.instanceColor!==null||Y.isInstancedMesh&&Ze.instancingMorph===!0&&Y.morphTexture===null||Y.isInstancedMesh&&Ze.instancingMorph===!1&&Y.morphTexture!==null||Ze.envMap!==De||Q.fog===!0&&Ze.fog!==_e||Ze.numClippingPlanes!==void 0&&(Ze.numClippingPlanes!==be.numPlanes||Ze.numIntersection!==be.numIntersection)||Ze.vertexAlphas!==Qe||Ze.vertexTangents!==Je||Ze.morphTargets!==Ie||Ze.morphNormals!==st||Ze.morphColors!==Pt||Ze.toneMapping!==qt||Ze.morphTargetsCount!==wt)&&(_t=!0):(_t=!0,Ze.__version=Q.version);let Cn=Ze.currentProgram;_t===!0&&(Cn=Lr(Q,q,Y));let bi=!1,Xt=!1,Mi=!1;const Rt=Cn.getUniforms(),an=Ze.uniforms;if(ce.useProgram(Cn.program)&&(bi=!0,Xt=!0,Mi=!0),Q.id!==S&&(S=Q.id,Xt=!0),bi||E!==P){ce.buffers.depth.getReversed()&&P.reversedDepth!==!0&&(P._reversedDepth=!0,P.updateProjectionMatrix()),Rt.setValue(B,"projectionMatrix",P.projectionMatrix),Rt.setValue(B,"viewMatrix",P.matrixWorldInverse);const xn=Rt.map.cameraPosition;xn!==void 0&&xn.setValue(B,Re.setFromMatrixPosition(P.matrixWorld)),se.logarithmicDepthBuffer&&Rt.setValue(B,"logDepthBufFC",2/(Math.log(P.far+1)/Math.LN2)),(Q.isMeshPhongMaterial||Q.isMeshToonMaterial||Q.isMeshLambertMaterial||Q.isMeshBasicMaterial||Q.isMeshStandardMaterial||Q.isShaderMaterial)&&Rt.setValue(B,"isOrthographic",P.isOrthographicCamera===!0),E!==P&&(E=P,Xt=!0,Mi=!0)}if(Y.isSkinnedMesh){Rt.setOptional(B,Y,"bindMatrix"),Rt.setOptional(B,Y,"bindMatrixInverse");const pn=Y.skeleton;pn&&(pn.boneTexture===null&&pn.computeBoneTexture(),Rt.setValue(B,"boneTexture",pn.boneTexture,Me))}Y.isBatchedMesh&&(Rt.setOptional(B,Y,"batchingTexture"),Rt.setValue(B,"batchingTexture",Y._matricesTexture,Me),Rt.setOptional(B,Y,"batchingIdTexture"),Rt.setValue(B,"batchingIdTexture",Y._indirectTexture,Me),Rt.setOptional(B,Y,"batchingColorTexture"),Y._colorsTexture!==null&&Rt.setValue(B,"batchingColorTexture",Y._colorsTexture,Me));const nn=J.morphAttributes;if((nn.position!==void 0||nn.normal!==void 0||nn.color!==void 0)&&j.update(Y,J,Cn),(Xt||Ze.receiveShadow!==Y.receiveShadow)&&(Ze.receiveShadow=Y.receiveShadow,Rt.setValue(B,"receiveShadow",Y.receiveShadow)),Q.isMeshGouraudMaterial&&Q.envMap!==null&&(an.envMap.value=De,an.flipEnvMap.value=De.isCubeTexture&&De.isRenderTargetTexture===!1?-1:1),Q.isMeshStandardMaterial&&Q.envMap===null&&q.environment!==null&&(an.envMapIntensity.value=q.environmentIntensity),Xt&&(Rt.setValue(B,"toneMappingExposure",y.toneMappingExposure),Ze.needsLights&&oo(an,Mi),_e&&Q.fog===!0&&de.refreshFogUniforms(an,_e),de.refreshMaterialUniforms(an,Q,N,W,p.state.transmissionRenderTarget[P.id]),Yo.upload(B,zi(Ze),an,Me)),Q.isShaderMaterial&&Q.uniformsNeedUpdate===!0&&(Yo.upload(B,zi(Ze),an,Me),Q.uniformsNeedUpdate=!1),Q.isSpriteMaterial&&Rt.setValue(B,"center",Y.center),Rt.setValue(B,"modelViewMatrix",Y.modelViewMatrix),Rt.setValue(B,"normalMatrix",Y.normalMatrix),Rt.setValue(B,"modelMatrix",Y.matrixWorld),Q.isShaderMaterial||Q.isRawShaderMaterial){const pn=Q.uniformsGroups;for(let xn=0,Dr=pn.length;xn<Dr;xn++){const ei=pn[xn];lt.update(ei,Cn),lt.bind(ei,Cn)}}return Cn}function oo(P,q){P.ambientLightColor.needsUpdate=q,P.lightProbe.needsUpdate=q,P.directionalLights.needsUpdate=q,P.directionalLightShadows.needsUpdate=q,P.pointLights.needsUpdate=q,P.pointLightShadows.needsUpdate=q,P.spotLights.needsUpdate=q,P.spotLightShadows.needsUpdate=q,P.rectAreaLights.needsUpdate=q,P.hemisphereLights.needsUpdate=q}function _s(P){return P.isMeshLambertMaterial||P.isMeshToonMaterial||P.isMeshPhongMaterial||P.isMeshStandardMaterial||P.isShadowMaterial||P.isShaderMaterial&&P.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(P,q,J){const Q=pe.get(P);Q.__autoAllocateDepthBuffer=P.resolveDepthBuffer===!1,Q.__autoAllocateDepthBuffer===!1&&(Q.__useRenderToTexture=!1),pe.get(P.texture).__webglTexture=q,pe.get(P.depthTexture).__webglTexture=Q.__autoAllocateDepthBuffer?void 0:J,Q.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(P,q){const J=pe.get(P);J.__webglFramebuffer=q,J.__useDefaultFramebuffer=q===void 0};const Bi=B.createFramebuffer();this.setRenderTarget=function(P,q=0,J=0){C=P,w=q,A=J;let Q=!0,Y=null,_e=!1,Ae=!1;if(P){const De=pe.get(P);if(De.__useDefaultFramebuffer!==void 0)ce.bindFramebuffer(B.FRAMEBUFFER,null),Q=!1;else if(De.__webglFramebuffer===void 0)Me.setupRenderTarget(P);else if(De.__hasExternalTextures)Me.rebindTextures(P,pe.get(P.texture).__webglTexture,pe.get(P.depthTexture).__webglTexture);else if(P.depthBuffer){const Ie=P.depthTexture;if(De.__boundDepthTexture!==Ie){if(Ie!==null&&pe.has(Ie)&&(P.width!==Ie.image.width||P.height!==Ie.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Me.setupDepthRenderbuffer(P)}}const Qe=P.texture;(Qe.isData3DTexture||Qe.isDataArrayTexture||Qe.isCompressedArrayTexture)&&(Ae=!0);const Je=pe.get(P).__webglFramebuffer;P.isWebGLCubeRenderTarget?(Array.isArray(Je[q])?Y=Je[q][J]:Y=Je[q],_e=!0):P.samples>0&&Me.useMultisampledRTT(P)===!1?Y=pe.get(P).__webglMultisampledFramebuffer:Array.isArray(Je)?Y=Je[J]:Y=Je,U.copy(P.viewport),k.copy(P.scissor),$=P.scissorTest}else U.copy(K).multiplyScalar(N).floor(),k.copy($e).multiplyScalar(N).floor(),$=at;if(J!==0&&(Y=Bi),ce.bindFramebuffer(B.FRAMEBUFFER,Y)&&Q&&ce.drawBuffers(P,Y),ce.viewport(U),ce.scissor(k),ce.setScissorTest($),_e){const De=pe.get(P.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+q,De.__webglTexture,J)}else if(Ae){const De=q;for(let Qe=0;Qe<P.textures.length;Qe++){const Je=pe.get(P.textures[Qe]);B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0+Qe,Je.__webglTexture,J,De)}}else if(P!==null&&J!==0){const De=pe.get(P.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,De.__webglTexture,J)}S=-1},this.readRenderTargetPixels=function(P,q,J,Q,Y,_e,Ae,ze=0){if(!(P&&P.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let De=pe.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&Ae!==void 0&&(De=De[Ae]),De){ce.bindFramebuffer(B.FRAMEBUFFER,De);try{const Qe=P.textures[ze],Je=Qe.format,Ie=Qe.type;if(!se.textureFormatReadable(Je)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!se.textureTypeReadable(Ie)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}q>=0&&q<=P.width-Q&&J>=0&&J<=P.height-Y&&(P.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+ze),B.readPixels(q,J,Q,Y,Ye.convert(Je),Ye.convert(Ie),_e))}finally{const Qe=C!==null?pe.get(C).__webglFramebuffer:null;ce.bindFramebuffer(B.FRAMEBUFFER,Qe)}}},this.readRenderTargetPixelsAsync=async function(P,q,J,Q,Y,_e,Ae,ze=0){if(!(P&&P.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let De=pe.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&Ae!==void 0&&(De=De[Ae]),De)if(q>=0&&q<=P.width-Q&&J>=0&&J<=P.height-Y){ce.bindFramebuffer(B.FRAMEBUFFER,De);const Qe=P.textures[ze],Je=Qe.format,Ie=Qe.type;if(!se.textureFormatReadable(Je))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!se.textureTypeReadable(Ie))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const st=B.createBuffer();B.bindBuffer(B.PIXEL_PACK_BUFFER,st),B.bufferData(B.PIXEL_PACK_BUFFER,_e.byteLength,B.STREAM_READ),P.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+ze),B.readPixels(q,J,Q,Y,Ye.convert(Je),Ye.convert(Ie),0);const Pt=C!==null?pe.get(C).__webglFramebuffer:null;ce.bindFramebuffer(B.FRAMEBUFFER,Pt);const qt=B.fenceSync(B.SYNC_GPU_COMMANDS_COMPLETE,0);return B.flush(),await Ep(B,qt,4),B.bindBuffer(B.PIXEL_PACK_BUFFER,st),B.getBufferSubData(B.PIXEL_PACK_BUFFER,0,_e),B.deleteBuffer(st),B.deleteSync(qt),_e}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(P,q=null,J=0){const Q=Math.pow(2,-J),Y=Math.floor(P.image.width*Q),_e=Math.floor(P.image.height*Q),Ae=q!==null?q.x:0,ze=q!==null?q.y:0;Me.setTexture2D(P,0),B.copyTexSubImage2D(B.TEXTURE_2D,J,0,0,Ae,ze,Y,_e),ce.unbindTexture()};const cr=B.createFramebuffer(),Vi=B.createFramebuffer();this.copyTextureToTexture=function(P,q,J=null,Q=null,Y=0,_e=null){_e===null&&(Y!==0?(js("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),_e=Y,Y=0):_e=0);let Ae,ze,De,Qe,Je,Ie,st,Pt,qt;const Vt=P.isCompressedTexture?P.mipmaps[_e]:P.image;if(J!==null)Ae=J.max.x-J.min.x,ze=J.max.y-J.min.y,De=J.isBox3?J.max.z-J.min.z:1,Qe=J.min.x,Je=J.min.y,Ie=J.isBox3?J.min.z:0;else{const nn=Math.pow(2,-Y);Ae=Math.floor(Vt.width*nn),ze=Math.floor(Vt.height*nn),P.isDataArrayTexture?De=Vt.depth:P.isData3DTexture?De=Math.floor(Vt.depth*nn):De=1,Qe=0,Je=0,Ie=0}Q!==null?(st=Q.x,Pt=Q.y,qt=Q.z):(st=0,Pt=0,qt=0);const wt=Ye.convert(q.format),Ze=Ye.convert(q.type);let Ut;q.isData3DTexture?(Me.setTexture3D(q,0),Ut=B.TEXTURE_3D):q.isDataArrayTexture||q.isCompressedArrayTexture?(Me.setTexture2DArray(q,0),Ut=B.TEXTURE_2D_ARRAY):(Me.setTexture2D(q,0),Ut=B.TEXTURE_2D),B.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,q.flipY),B.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,q.premultiplyAlpha),B.pixelStorei(B.UNPACK_ALIGNMENT,q.unpackAlignment);const _t=B.getParameter(B.UNPACK_ROW_LENGTH),Cn=B.getParameter(B.UNPACK_IMAGE_HEIGHT),bi=B.getParameter(B.UNPACK_SKIP_PIXELS),Xt=B.getParameter(B.UNPACK_SKIP_ROWS),Mi=B.getParameter(B.UNPACK_SKIP_IMAGES);B.pixelStorei(B.UNPACK_ROW_LENGTH,Vt.width),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,Vt.height),B.pixelStorei(B.UNPACK_SKIP_PIXELS,Qe),B.pixelStorei(B.UNPACK_SKIP_ROWS,Je),B.pixelStorei(B.UNPACK_SKIP_IMAGES,Ie);const Rt=P.isDataArrayTexture||P.isData3DTexture,an=q.isDataArrayTexture||q.isData3DTexture;if(P.isDepthTexture){const nn=pe.get(P),pn=pe.get(q),xn=pe.get(nn.__renderTarget),Dr=pe.get(pn.__renderTarget);ce.bindFramebuffer(B.READ_FRAMEBUFFER,xn.__webglFramebuffer),ce.bindFramebuffer(B.DRAW_FRAMEBUFFER,Dr.__webglFramebuffer);for(let ei=0;ei<De;ei++)Rt&&(B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,pe.get(P).__webglTexture,Y,Ie+ei),B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,pe.get(q).__webglTexture,_e,qt+ei)),B.blitFramebuffer(Qe,Je,Ae,ze,st,Pt,Ae,ze,B.DEPTH_BUFFER_BIT,B.NEAREST);ce.bindFramebuffer(B.READ_FRAMEBUFFER,null),ce.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else if(Y!==0||P.isRenderTargetTexture||pe.has(P)){const nn=pe.get(P),pn=pe.get(q);ce.bindFramebuffer(B.READ_FRAMEBUFFER,cr),ce.bindFramebuffer(B.DRAW_FRAMEBUFFER,Vi);for(let xn=0;xn<De;xn++)Rt?B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,nn.__webglTexture,Y,Ie+xn):B.framebufferTexture2D(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,nn.__webglTexture,Y),an?B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,pn.__webglTexture,_e,qt+xn):B.framebufferTexture2D(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,pn.__webglTexture,_e),Y!==0?B.blitFramebuffer(Qe,Je,Ae,ze,st,Pt,Ae,ze,B.COLOR_BUFFER_BIT,B.NEAREST):an?B.copyTexSubImage3D(Ut,_e,st,Pt,qt+xn,Qe,Je,Ae,ze):B.copyTexSubImage2D(Ut,_e,st,Pt,Qe,Je,Ae,ze);ce.bindFramebuffer(B.READ_FRAMEBUFFER,null),ce.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else an?P.isDataTexture||P.isData3DTexture?B.texSubImage3D(Ut,_e,st,Pt,qt,Ae,ze,De,wt,Ze,Vt.data):q.isCompressedArrayTexture?B.compressedTexSubImage3D(Ut,_e,st,Pt,qt,Ae,ze,De,wt,Vt.data):B.texSubImage3D(Ut,_e,st,Pt,qt,Ae,ze,De,wt,Ze,Vt):P.isDataTexture?B.texSubImage2D(B.TEXTURE_2D,_e,st,Pt,Ae,ze,wt,Ze,Vt.data):P.isCompressedTexture?B.compressedTexSubImage2D(B.TEXTURE_2D,_e,st,Pt,Vt.width,Vt.height,wt,Vt.data):B.texSubImage2D(B.TEXTURE_2D,_e,st,Pt,Ae,ze,wt,Ze,Vt);B.pixelStorei(B.UNPACK_ROW_LENGTH,_t),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,Cn),B.pixelStorei(B.UNPACK_SKIP_PIXELS,bi),B.pixelStorei(B.UNPACK_SKIP_ROWS,Xt),B.pixelStorei(B.UNPACK_SKIP_IMAGES,Mi),_e===0&&q.generateMipmaps&&B.generateMipmap(Ut),ce.unbindTexture()},this.initRenderTarget=function(P){pe.get(P).__webglFramebuffer===void 0&&Me.setupRenderTarget(P)},this.initTexture=function(P){P.isCubeTexture?Me.setTextureCube(P,0):P.isData3DTexture?Me.setTexture3D(P,0):P.isDataArrayTexture||P.isCompressedArrayTexture?Me.setTexture2DArray(P,0):Me.setTexture2D(P,0),ce.unbindTexture()},this.resetState=function(){w=0,A=0,C=null,ce.reset(),Ce.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return _i}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=At._getDrawingBufferColorSpace(e),t.unpackColorSpace=At._getUnpackColorSpace()}}const bh={type:"change"},Ol={type:"start"},Ud={type:"end"},Go=new ua,Mh=new Li,Ex=Math.cos(70*yn.DEG2RAD),ln=new D,Fn=2*Math.PI,Bt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},uc=1e-6;class wx extends Bm{constructor(e,t=null){super(e,t),this.state=Bt.NONE,this.target=new D,this.cursor=new D,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:es.ROTATE,MIDDLE:es.DOLLY,RIGHT:es.PAN},this.touches={ONE:Kr.ROTATE,TWO:Kr.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new D,this._lastQuaternion=new gn,this._lastTargetPosition=new D,this._quat=new gn().setFromUnitVectors(e.up,new D(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new ju,this._sphericalDelta=new ju,this._scale=1,this._panOffset=new D,this._rotateStart=new ye,this._rotateEnd=new ye,this._rotateDelta=new ye,this._panStart=new ye,this._panEnd=new ye,this._panDelta=new ye,this._dollyStart=new ye,this._dollyEnd=new ye,this._dollyDelta=new ye,this._dollyDirection=new D,this._mouse=new ye,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Ax.bind(this),this._onPointerDown=Tx.bind(this),this._onPointerUp=Rx.bind(this),this._onContextMenu=Nx.bind(this),this._onMouseWheel=Lx.bind(this),this._onKeyDown=Dx.bind(this),this._onTouchStart=Ix.bind(this),this._onTouchMove=Ux.bind(this),this._onMouseDown=Cx.bind(this),this._onMouseMove=Px.bind(this),this._interceptControlDown=Ox.bind(this),this._interceptControlUp=Fx.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(bh),this.update(),this.state=Bt.NONE}update(e=null){const t=this.object.position;ln.copy(t).sub(this.target),ln.applyQuaternion(this._quat),this._spherical.setFromVector3(ln),this.autoRotate&&this.state===Bt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,r=this.maxAzimuthAngle;isFinite(i)&&isFinite(r)&&(i<-Math.PI?i+=Fn:i>Math.PI&&(i-=Fn),r<-Math.PI?r+=Fn:r>Math.PI&&(r-=Fn),i<=r?this._spherical.theta=Math.max(i,Math.min(r,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+r)/2?Math.max(i,this._spherical.theta):Math.min(r,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let s=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),s=o!=this._spherical.radius}if(ln.setFromSpherical(this._spherical),ln.applyQuaternion(this._quatInverse),t.copy(this.target).add(ln),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){const a=ln.length();o=this._clampDistance(a*this._scale);const c=a-o;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),s=!!c}else if(this.object.isOrthographicCamera){const a=new D(this._mouse.x,this._mouse.y,0);a.unproject(this.object);const c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),s=c!==this.object.zoom;const l=new D(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(a),this.object.updateMatrixWorld(),o=ln.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(Go.origin.copy(this.object.position),Go.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Go.direction))<Ex?this.object.lookAt(this.target):(Mh.setFromNormalAndCoplanarPoint(this.object.up,this.target),Go.intersectPlane(Mh,this.target))))}else if(this.object.isOrthographicCamera){const o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),s=!0)}return this._scale=1,this._performCursorZoom=!1,s||this._lastPosition.distanceToSquared(this.object.position)>uc||8*(1-this._lastQuaternion.dot(this.object.quaternion))>uc||this._lastTargetPosition.distanceToSquared(this.target)>uc?(this.dispatchEvent(bh),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Fn/60*this.autoRotateSpeed*e:Fn/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){ln.setFromMatrixColumn(t,0),ln.multiplyScalar(-e),this._panOffset.add(ln)}_panUp(e,t){this.screenSpacePanning===!0?ln.setFromMatrixColumn(t,1):(ln.setFromMatrixColumn(t,0),ln.crossVectors(this.object.up,ln)),ln.multiplyScalar(e),this._panOffset.add(ln)}_pan(e,t){const i=this.domElement;if(this.object.isPerspectiveCamera){const r=this.object.position;ln.copy(r).sub(this.target);let s=ln.length();s*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*s/i.clientHeight,this.object.matrix),this._panUp(2*t*s/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),r=e-i.left,s=t-i.top,o=i.width,a=i.height;this._mouse.x=r/o*2-1,this._mouse.y=-(s/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Fn*this._rotateDelta.x/t.clientHeight),this._rotateUp(Fn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(Fn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-Fn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(Fn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-Fn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._rotateStart.set(i,r)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panStart.set(i,r)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,r=e.pageY-t.y,s=Math.sqrt(i*i+r*r);this._dollyStart.set(0,s)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),r=.5*(e.pageX+i.x),s=.5*(e.pageY+i.y);this._rotateEnd.set(r,s)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Fn*this._rotateDelta.x/t.clientHeight),this._rotateUp(Fn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panEnd.set(i,r)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,r=e.pageY-t.y,s=Math.sqrt(i*i+r*r);this._dollyEnd.set(0,s),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const o=(e.pageX+t.x)*.5,a=(e.pageY+t.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new ye,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function Tx(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n)))}function Ax(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function Rx(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Ud),this.state=Bt.NONE;break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function Cx(n){let e;switch(n.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case es.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=Bt.DOLLY;break;case es.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=Bt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=Bt.ROTATE}break;case es.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=Bt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=Bt.PAN}break;default:this.state=Bt.NONE}this.state!==Bt.NONE&&this.dispatchEvent(Ol)}function Px(n){switch(this.state){case Bt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case Bt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case Bt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function Lx(n){this.enabled===!1||this.enableZoom===!1||this.state!==Bt.NONE||(n.preventDefault(),this.dispatchEvent(Ol),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(Ud))}function Dx(n){this.enabled!==!1&&this._handleKeyDown(n)}function Ix(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case Kr.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=Bt.TOUCH_ROTATE;break;case Kr.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=Bt.TOUCH_PAN;break;default:this.state=Bt.NONE}break;case 2:switch(this.touches.TWO){case Kr.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=Bt.TOUCH_DOLLY_PAN;break;case Kr.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=Bt.TOUCH_DOLLY_ROTATE;break;default:this.state=Bt.NONE}break;default:this.state=Bt.NONE}this.state!==Bt.NONE&&this.dispatchEvent(Ol)}function Ux(n){switch(this._trackPointer(n),this.state){case Bt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case Bt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case Bt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case Bt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=Bt.NONE}}function Nx(n){this.enabled!==!1&&n.preventDefault()}function Ox(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Fx(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const Ps=new D;function Yn(n,e,t,i,r,s){const o=2*Math.PI*r/4,a=Math.max(s-2*r,0),c=Math.PI/4;Ps.copy(e),Ps[i]=0,Ps.normalize();const l=.5*o/(o+a),u=1-Ps.angleTo(n)/c;return Math.sign(Ps[t])===1?u*l:a/(o+a)+l+l*(1-u)}class da extends Yt{constructor(e=1,t=1,i=1,r=2,s=.1){const o=r*2+1;if(s=Math.min(e/2,t/2,i/2,s),super(1,1,1,o,o,o),this.type="RoundedBoxGeometry",this.parameters={width:e,height:t,depth:i,segments:r,radius:s},o===1)return;const a=this.toNonIndexed();this.index=null,this.attributes.position=a.attributes.position,this.attributes.normal=a.attributes.normal,this.attributes.uv=a.attributes.uv;const c=new D,l=new D,u=new D(e,t,i).divideScalar(2).subScalar(s),h=this.attributes.position.array,d=this.attributes.normal.array,f=this.attributes.uv.array,g=h.length/6,_=new D,m=.5/o;for(let p=0,x=0;p<h.length;p+=3,x+=2)switch(c.fromArray(h,p),l.copy(c),l.x-=Math.sign(l.x)*m,l.y-=Math.sign(l.y)*m,l.z-=Math.sign(l.z)*m,l.normalize(),h[p+0]=u.x*Math.sign(c.x)+l.x*s,h[p+1]=u.y*Math.sign(c.y)+l.y*s,h[p+2]=u.z*Math.sign(c.z)+l.z*s,d[p+0]=l.x,d[p+1]=l.y,d[p+2]=l.z,Math.floor(p/g)){case 0:_.set(1,0,0),f[x+0]=Yn(_,l,"z","y",s,i),f[x+1]=1-Yn(_,l,"y","z",s,t);break;case 1:_.set(-1,0,0),f[x+0]=1-Yn(_,l,"z","y",s,i),f[x+1]=1-Yn(_,l,"y","z",s,t);break;case 2:_.set(0,1,0),f[x+0]=1-Yn(_,l,"x","z",s,e),f[x+1]=Yn(_,l,"z","x",s,i);break;case 3:_.set(0,-1,0),f[x+0]=1-Yn(_,l,"x","z",s,e),f[x+1]=1-Yn(_,l,"z","x",s,i);break;case 4:_.set(0,0,1),f[x+0]=1-Yn(_,l,"x","y",s,e),f[x+1]=1-Yn(_,l,"y","x",s,t);break;case 5:_.set(0,0,-1),f[x+0]=Yn(_,l,"x","y",s,e),f[x+1]=1-Yn(_,l,"y","x",s,t);break}}static fromJSON(e){return new da(e.width,e.height,e.depth,e.segments,e.radius)}}const Sh=Math.PI*2;function kx(n,e){const t=e.clone().normalize();let i=2*Math.atan2(n.x*t.x+n.y*t.y+n.z*t.z,n.w);for(;i>Math.PI;)i-=Sh;for(;i<-Math.PI;)i+=Sh;return i}function zx(n,e,t,i=.168){const r=e.clone().multiply(t.clone().invert()).normalize(),s=Math.min(i*.6,.1),o=new D(0,s,0).applyQuaternion(r);return{position:n.clone().sub(o),quaternion:r}}function jo(n,e,t=.055){if(!n)return null;let i=null,r=t;for(const s of e){const o=n.distanceTo(s.position);o<=r&&(i=s,r=o)}return i}function Bx({getModel:n=()=>({}),getTerminals:e=()=>[],onProbe:t=()=>{},onBeforeConnect:i=()=>{},onConnect:r=()=>{},onDisconnect:s=()=>{},onChange:o=()=>{},onAction:a=()=>{},onGraphCursor:c=()=>{},onHold:l=()=>{},snapRadius:u=.055}={}){const h=new Map,d=new Set,f=new Map;function g(x,b,y={}){var C,S,E,U;if(!b||d.has(x)||h.has(x))return!1;const M=b.resource||`${b.kind}:${b.channel||b.id}`;if(f.has(M))return!1;const w=n(),A={input:x,target:b,resource:M,position:(C=y.position)==null?void 0:C.clone(),startPosition:(S=y.position)==null?void 0:S.clone(),turn:0,lastValue:void 0};if(b.kind==="dial"){if(A.startValue=(E=w.parameters)==null?void 0:E[b.parameter],A.values=b.values||((U=w.options)==null?void 0:U[b.parameter]),!A.values&&!Number.isFinite(A.startValue))return!1;A.values&&!A.values.includes(A.startValue)&&(A.startValue=A.values[0]),A.lastValue=A.startValue}return h.set(x,A),f.set(M,x),l("start",A),b.kind==="probe"&&t(b.channel,null),b.kind==="plug"&&Number.isInteger(b.wireIndex)&&s(b.wireIndex),(b.kind==="button"||b.kind==="switch")&&a(b.action),b.kind==="screen"&&Number.isFinite(y.fraction)&&c(yn.clamp(y.fraction,0,1),y.panelIndex||0),!0}function _(x,b={}){var M;const y=h.get(x);if(!y)return!1;if(b.position&&(y.position=b.position.clone()),b.quaternion&&(y.quaternion=b.quaternion.clone()),y.target.kind==="dial"&&Number.isFinite(b.turn)){y.turn+=b.turn;const w=y.target;let A;if((M=y.values)!=null&&M.length){const C=Math.round(y.turn/(w.detentRadians||Math.PI/12)),S=yn.clamp(y.values.indexOf(y.startValue)+C,0,y.values.length-1);A=y.values[S]}else{const C=w.step||1;A=yn.clamp(y.startValue+Math.round(y.turn/(w.detentRadians||Math.PI/12))*C,w.min??-1/0,w.max??1/0),A=Number(A.toPrecision(12))}A!==y.lastValue&&(y.lastValue=A,o(w.parameter,A))}return y.target.kind==="screen"&&Number.isFinite(b.fraction)&&c(yn.clamp(b.fraction,0,1),b.panelIndex||0),l("move",y),!0}function m(x,b={},y=!1){d.delete(x);const M=h.get(x);if(!M)return null;b.position&&(M.position=b.position.clone()),h.delete(x),f.delete(M.resource);const w=y?null:jo(M.position,e(),u);let A={kind:y?"cancelled":"released",terminal:null};if(M.target.kind==="probe"&&(t(M.target.channel,(w==null?void 0:w.id)||null),A={kind:w?"connected":"loose",terminal:(w==null?void 0:w.id)||null}),M.target.kind==="terminal"||M.target.kind==="plug"){const C=M.target.from||M.target.terminal;if(!y&&w&&w.id!==C)i(C,w,M),r(C,w.id),A={kind:"connected",terminal:w.id};else{const S=M.startPosition&&M.position&&M.startPosition.distanceTo(M.position)<.018;A={kind:M.target.kind==="terminal"&&S?"cancelled":"loose",terminal:null}}}return l("end",M,A),A}function p(){const x=[...h.keys()];for(const b of x)m(b,{},!0),d.add(b)}return{begin:g,move:_,end:(x,b)=>m(x,b),cancelAll:p,release(x){d.delete(x)},block(x){h.has(x)&&m(x,{},!0),d.add(x)},hold:x=>h.get(x),holds:h,isHeld:x=>f.has(x)}}function Vx(n,e,{bounds:t={minX:-3.2,maxX:3.2,minZ:-3.8,maxZ:2.4},obstacles:i=[],radius:r=.19}={}){const s=n.clone(),o=Math.max(1,Math.ceil(Math.hypot(e.x,e.z)/.04)),a=e.x/o,c=e.z/o,l=(h,d,f)=>{const g=[h-(f.minX-r),f.maxX+r-h,d-(f.minZ-r),f.maxZ+r-d];return Math.max(0,Math.min(...g))},u=(h,d)=>i.some(f=>{const g=l(h,d,f),_=l(s.x,s.z,f);if(g<=0)return!1;if(_<=0)return!0;if(g<_-1e-10)return!1;const m=(f.minX+f.maxX)/2,p=(f.minZ+f.maxZ)/2,x=(s.x-m)**2+(s.z-p)**2,b=(h-m)**2+(d-p)**2;return g>_+1e-10||b<=x+1e-10});for(let h=0;h<o;h++){const d=yn.clamp(s.x+a,t.minX+r,t.maxX-r);u(d,s.z)||(s.x=d);const f=yn.clamp(s.z+c,t.minZ+r,t.maxZ-r);u(s.x,f)||(s.z=f)}return s}function Hx(n,e,t){const i=new gn().setFromAxisAngle(new D(0,1,0),t);n.position.sub(e).applyQuaternion(i).add(e),n.quaternion.premultiply(i),n.updateMatrixWorld(!0)}function Gx({speed:n=.8,snapAngle:e=Math.PI/6,...t}={}){let i=!1,r=!1;return{reset(){i=!1,r=!0},update({rig:s,headPosition:o,headQuaternion:a,left:c=[0,0],right:l=0,dt:u=0,enabled:h=!0}){if(!h)return i=!1,r=!0,!1;const d=Math.max(Math.abs(c[0]||0),Math.abs(c[1]||0),Math.abs(l))<.2;if(!i){if(!d)return!1;i=!0}Math.abs(l)<.25&&(r=!1);let f=0;Math.abs(l)>.7&&!r&&(f=-Math.sign(l)*e,Hx(s,o,f),r=!0);const g=Math.abs(c[0]||0)>.18?c[0]:0,_=Math.abs(c[1]||0)>.18?c[1]:0;if(!g&&!_)return!1;const m=new D(0,0,-1).applyQuaternion(a).applyAxisAngle(new D(0,1,0),f);m.y=0,m.lengthSq()<.001?m.set(0,0,-1):m.normalize();const x=new D(-m.z,0,m.x).multiplyScalar(g).addScaledVector(m,-_);x.length()>1&&x.normalize(),x.multiplyScalar(n*yn.clamp(u,0,.05));const b=Vx(o,x,t);return s.position.add(b.sub(o)),s.updateMatrixWorld(!0),!0}}}function Eh(n,e=!1){const t=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),r=new Set(Object.keys(n[0].morphAttributes)),s={},o={},a=n[0].morphTargetsRelative,c=new hn;let l=0;for(let u=0;u<n.length;++u){const h=n[u];let d=0;if(t!==(h.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const f in h.attributes){if(!i.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;s[f]===void 0&&(s[f]=[]),s[f].push(h.attributes[f]),d++}if(d!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(a!==h.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const f in h.morphAttributes){if(!r.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;o[f]===void 0&&(o[f]=[]),o[f].push(h.morphAttributes[f])}if(e){let f;if(t)f=h.index.count;else if(h.attributes.position!==void 0)f=h.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,f,u),l+=f}}if(t){let u=0;const h=[];for(let d=0;d<n.length;++d){const f=n[d].index;for(let g=0;g<f.count;++g)h.push(f.getX(g)+u);u+=n[d].attributes.position.count}c.setIndex(h)}for(const u in s){const h=wh(s[u]);if(!h)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;c.setAttribute(u,h)}for(const u in o){const h=o[u][0].length;if(h===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[u]=[];for(let d=0;d<h;++d){const f=[];for(let _=0;_<o[u].length;++_)f.push(o[u][_][d]);const g=wh(f);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;c.morphAttributes[u].push(g)}}return c}function wh(n){let e,t,i,r=-1,s=0;for(let l=0;l<n.length;++l){const u=n[l];if(e===void 0&&(e=u.array.constructor),e!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=u.itemSize),t!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=u.normalized),i!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(r===-1&&(r=u.gpuType),r!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;s+=u.count*t}const o=new e(s),a=new Jn(o,t,i);let c=0;for(let l=0;l<n.length;++l){const u=n[l];if(u.isInterleavedBufferAttribute){const h=c/t;for(let d=0,f=u.count;d<f;d++)for(let g=0;g<t;g++){const _=u.getComponent(d,g);a.setComponent(d+h,g,_)}}else o.set(u.array,c);c+=u.count*t}return r!==void 0&&(a.gpuType=r),a}const Wt={case:"#d5d6d1",face:"#e8e8e2",dark:"#262a2c",rubber:"#363b3c",metal:"#a5aaab",red:"#ad2f2c",black:"#25292b",ch1:"#d5b348",ch2:"#64a5b5"},on=(n,e=3)=>Number.isFinite(Number(n))&&n!==null?Number(n).toFixed(e).replace(/\.?0+$/,"")||"0":"—",Nd=n=>Number(n)>=1e3?`${on(Number(n)/1e3,2)} kΩ`:`${on(Number(n),1)} Ω`,al=n=>n!=null&&n.isVector3?n.clone():Array.isArray(n)?new D(...n):new D((n==null?void 0:n.x)||0,(n==null?void 0:n.y)||0,(n==null?void 0:n.z)||0);function Zt(n,e,t,i,{size:r,width:s,align:o="left",weight:a=700,family:c="Arial, sans-serif"}){const l=String(e);let u=r;n.font=`${a} ${u}px ${c}`,s&&n.measureText(l).width>s&&(u*=s/n.measureText(l).width,n.font=`${a} ${u}px ${c}`),n.textAlign=o,n.fillText(l,t,i)}function Wx(n,e,t){const i=[];for(const r of String(e).split(/\s+/)){const s=i.length-1;s>=0&&n.measureText(`${i[s]} ${r}`).width<=t?i[s]+=` ${r}`:i.push(r)}return i}function ki(n){const e=new Qt;e.name=n;const t=[],i={},r=new Set,s=new Set,o=new Set;let a=!1;const c=(C,S={})=>{const E=new Ul({color:C,roughness:.66,metalness:.03,...S});return r.add(E),E},l={case:c(Wt.case),face:c(Wt.face),dark:c(Wt.dark),rubber:c(Wt.rubber,{roughness:.87}),metal:c(Wt.metal,{metalness:.8,roughness:.27}),red:c(Wt.red),black:c(Wt.black)};function u(C,S,E=e,U=[0,0,0]){s.add(C);const k=new Rn(C,S);return k.position.copy(al(U)),k.castShadow=!0,k.receiveShadow=!0,E.add(k),k}const h=(C,S,E,U,k,$,H=.002)=>u(H<=5e-4?new Yt(C,S,E):new da(C,S,E,2,Math.min(H,C/4,S/4,E/4)),U,k,$);function d(C,S,E,U,k,$=24){const H=new ht(C,C,S,$);return H.rotateX(Math.PI/2),u(H,E,U,k)}function f(C,S,E=e){const U=new un;return U.name=C,U.position.copy(al(S)),E.add(U),i[C]=U,U}function g(C,S){const E={object:C,id:`${n}:${t.length}`,axis:"z",...S};return C.userData.equipmentTarget=E,t.push(E),E}function _(C,S,E,{pixels:U=[768,320],background:k="#dbe6cb",foreground:$="#102018"}={}){const H=document.createElement("canvas");H.width=U[0],H.height=Math.round(U[0]*S/C);const X=H.getContext("2d"),G=new nl(H);G.colorSpace=wn,G.anisotropy=8;const W=new jn({map:G,toneMapped:!1});r.add(W),o.add(G);const N=u(new Ni(C,S),W,e,E);N.castShadow=!1;let fe=null;return{object:N,canvas:H,ctx:X,texture:G,draw(oe,K){const $e=JSON.stringify(oe);$e!==fe&&(fe=$e,X.fillStyle=k,X.fillRect(0,0,H.width,H.height),X.fillStyle=$,X.textBaseline="middle",X.textAlign="left",K(X,H.width,H.height),G.needsUpdate=!0)}}}function m(C,S,E,U,{size:k=52,color:$="#172120",background:H="#e8e8e2",align:X="center"}={}){const G=_(S,E,U,{pixels:[Math.round(128*S/E),128],background:H,foreground:$});return G.draw(C,(W,N,fe)=>{Zt(W,C,X==="center"?N/2:8,fe/2,{size:fe*.88,width:N-16,align:X})}),G}function p(C,S,E,U=e){d(.0022,.001,l.metal,U,[C,S,E],12);const k=h(.003,5e-4,3e-4,l.dark,U,[C,S,E+65e-5],1e-4);k.rotation.z=.5}function x(C,S,E){h(C,S-.008,E,l.case,e,[0,S/2+.004,0],.008),h(C-.008,S-.014,.006,l.face,e,[0,S/2+.005,E/2],.004);for(const U of[-C/2+.014,C/2-.014]){for(const k of[.024,S-.018])p(U,k,E/2+.0038);for(const k of[-E/2+.02,E/2-.02])h(.025,.009,.032,l.rubber,e,[U,.0045,k],.002)}for(let U=0;U<12;U++)h(.035,6e-4,.002,l.dark,e,[C/2-.042,S+4e-4,-E/2+.022+U*.006],15e-5);return E/2+.004}function b(C,S,E,U,k,{bnc:$=!1,action:H,channel:X}={}){const G=c(k);if(d($?.0083:.007,$?.008:.003,G,e,[S,E,U+.002]),d($?.0065:.0048,$?.009:.002,l.metal,e,[S,E,U+.006]),d($?.0042:.0031,.001,l.dark,e,[S,E,U+($?.011:.0075)]),$)for(const N of[-1,1])d(.001,.004,l.metal,e,[S+N*.006,E,U+.009],10);const W=f(C,[S,E,U+.012]);if(H){const N=d(.012,.007,l.face,e,[S,E,U+.004]);N.visible=!1,g(N,{kind:"probe",label:C,action:H,channel:X}),g(e.children[e.children.indexOf(W)-1],{kind:"probe",label:C,action:H,channel:X})}return W}function y(C,S,E,U,k,{radius:$=.011,values:H=zt[S],min:X,max:G,step:W=1,color:N=Wt.dark}={}){const fe=new Qt;fe.position.set(E,U,k),e.add(fe),d($+.003,.0016,l.metal,fe,[0,0,0]);const oe=new Qt;oe.position.z=.003,oe.userData.equipmentMoving=!0,fe.add(oe);const K=c(N,{roughness:.79}),$e=d($,.016,K,oe,[0,0,.008],32),at=[];for(let te=0;te<28;te++){const le=te/28*Math.PI*2,Re=new ht(5e-4,5e-4,.012,6);Re.rotateX(Math.PI/2),Re.translate(Math.cos(le)*$,Math.sin(le)*$,.008),at.push(Re)}u(Eh(at),K,oe),at.forEach(te=>te.dispose()),h(.0014,$*.65,7e-4,l.face,oe,[0,$*.49,.0164],15e-5);for(let te=0;te<11;te++){const le=-Math.PI*.75+te/10*Math.PI*1.5,Re=h(6e-4,te%5===0?.003:.0018,3e-4,l.dark,fe,[Math.sin(le)*($+.006),Math.cos(le)*($+.006),8e-4],1e-4);Re.rotation.z=-le}const Oe=g($e,{kind:"dial",label:C,parameter:S,values:H,min:X??(H==null?void 0:H[0]),max:G??(H==null?void 0:H.at(-1)),step:W});$e.userData.equipmentTarget=Oe,oe.traverse(te=>{te.isMesh&&(te.userData.equipmentTarget=Oe)});function gt(te){const le=H==null?void 0:H.indexOf(te),Re=H&&le>=0?le/Math.max(1,H.length-1):Number.isFinite(te)&&Number.isFinite(Oe.min)&&Number.isFinite(Oe.max)?yn.clamp((te-Oe.min)/(Oe.max-Oe.min||1),0,1):.5;oe.rotation.z=(.75-Re*1.5)*Math.PI,Oe.value=te}return{descriptor:Oe,set:gt,rotor:oe}}function M(C,S,E,U,k,{color:$="#6f7974",width:H=.025,height:X=.012}={}){const G=h(H,X,.007,c($),e,[E,U,k+.004],.002);return g(G,{kind:"button",label:C,action:S}),G}function w(){if(!a){a=!0;for(const C of[...s,...r,...o])C.dispose();e.removeFromParent()}}function A(){var U;const C=new Set(t.map(k=>k.object)),S=new Map;e.updateMatrixWorld(!0);const E=e.matrixWorld.clone().invert();e.traverse(k=>{if(!k.isMesh||C.has(k)||Array.isArray(k.material))return;for(let H=k.parent;H&&H!==e;H=H.parent)if(H.userData.equipmentMoving)return;const $=S.get(k.material)||[];$.push(k),S.set(k.material,$)});for(const[k,$]of S){if($.length<2)continue;const H=$.map(N=>{const fe=N.geometry.index?N.geometry.toNonIndexed():N.geometry.clone();return fe.applyMatrix4(new $t().multiplyMatrices(E,N.matrixWorld)),fe}),X=Eh(H);if(H.forEach(N=>N.dispose()),!X)continue;const G=u(X,k),W=(U=$.find(N=>N.userData.equipmentTarget))==null?void 0:U.userData.equipmentTarget;W&&(G.userData.equipmentTarget=W);for(const N of $)N.removeFromParent(),N.geometry.dispose(),s.delete(N.geometry)}}return{group:e,targets:t,anchors:i,m:l,material:c,mesh:u,box:h,cylinder:d,screen:_,text:m,screw:p,enclosure:x,socket:b,dial:y,button:M,anchor:f,target:g,finish:A,dispose:w}}function $x({id:n="multimeter",label:e="DIGITAL MULTIMETER"}={}){const t=ki(n),{group:i,m:r}=t;t.box(.11,.213,.046,t.material("#b49a49",{roughness:.88}),i,[0,.112,0],.012),t.box(.096,.198,.008,r.dark,i,[0,.112,.024],.008),t.box(.09,.063,.004,r.black,i,[0,.172,.03],.003);const s=t.screen(.084,.057,[0,.172,.0325],{pixels:[840,570]});t.text("MULTIMETER",.084,.01,[0,.209,.029],{background:Wt.dark,color:"#f5f7ef"});const o=t.dial("Meter","meterMode",0,.106,.031,{radius:.02,values:["off","vdc"]});t.text("OFF",.024,.01,[-.027,.078,.031],{background:Wt.dark,color:"#d7d9d1"}),t.text("V⎓",.023,.011,[.028,.078,.031],{background:Wt.dark,color:"#d7d9d1"}),t.socket("COM",-.025,.042,.031,Wt.black),t.socket("V",.025,.042,.031,Wt.red),t.text("COM          V",.085,.011,[0,.023,.031],{background:Wt.dark,color:"#e0e1d8"});const a=t.box(.067,.1,.006,r.dark,i,[0,.055,-.061],.003);a.rotation.x=-.4;for(const l of[-.044,.044])t.box(.014,.044,.006,r.rubber,i,[l,.022,.025],.003);function c(l={}){const u=l.measurement||{},h=l.meterMode||"vdc";o.set(h);const d=u.probeReady?u.probeVoltage:null;s.draw([h,d,l.module],(f,g,_)=>{h!=="off"&&(Zt(f,l.module==="opamp"?"V SAMPLE":"DC V",28,_*.14,{size:_*.16,width:g-56}),Zt(f,d===null?"— —":on(d,3),g-26,_*.54,{size:_*.55,width:g-52,align:"right",family:"Arial, sans-serif"}),d===null&&Zt(f,"CONNECT PROBES",g/2,_*.87,{size:_*.13,width:g-40,align:"center"}))})}return t.finish(),c(),{group:i,targets:t.targets,anchors:t.anchors,update:c,dispose:t.dispose}}function Fl(n,e,t){const i={l:100,r:30,t:78,b:138},r=52,s=(e-i.t-i.b-r*(t-1))/t;return Array.from({length:t},(o,a)=>({panel:a,left:i.l/n,top:(i.t+a*(s+r))/e,width:(n-i.l-i.r)/n,height:s/e}))}function qx(n){return`${{"Capacitor voltage":"V","Inductor voltage":"V","Storage current":"I","Stored energy":"E","Calculated load power":"P"}[n.name]||n.name||""} ${on(n.value,3)} ${n.unit||""}`.trim()}function Od(n,e,t,i,r){var p,x,b;n.fillStyle="#071015",n.fillRect(0,0,e,t);const o=((p=i==null?void 0:i.panels)!=null&&p.length?i.panels:[i]).filter(Boolean).slice(0,3),a=Fl(e,t,o.length||1),c=r.recorder?r.recorder==="transient"?r.playing?"ACQUIRING":"PAUSED":"CALCULATED · WIRING":r.scopeRunning===!1?r.scopeStale?"HOLD · OLD SETTINGS":"HOLD":"RUN";n.fillStyle="#f1faf5",Zt(n,c,20,29,{size:30,width:e*.56});const l=Number.isFinite(r.timeDiv)?`${on(r.timeDiv,3)} ms/div`:((i==null?void 0:i.xLabel)||"TIME").replace("Elapsed circuit time","Time").replace("Load resistance","Load");if(Zt(n,l,e-22,29,{size:30,width:e*.41,align:"right"}),!o.length){Zt(n,"CONNECT THE CHANNELS",e/2,t/2,{size:36,width:e-60,align:"center"});return}const u=["#ffe27b","#79e4f6","#dfbfff"];for(let y=0;y<o.length;y++){const M=o[y],w=a[y],A=w.left*e,C=w.top*t,S=w.width*e,E=w.height*t;n.strokeStyle="#344750",n.lineWidth=1.5;const U=M.xDivisions||4,k=M.yDivisions||4;for(let G=0;G<=U;G++)n.beginPath(),n.moveTo(A+S*G/U,C),n.lineTo(A+S*G/U,C+E),n.stroke();for(let G=0;G<=k;G++)n.beginPath(),n.moveTo(A,C+E*G/k),n.lineTo(A+S,C+E*G/k),n.stroke();n.fillStyle="#f1faf5";const $=M.yTicks||[];for(const[G,W]of $.entries())o.length>1&&G!==0&&G!==Math.floor($.length/2)&&G!==$.length-1||Zt(n,W.label,A-12,C+(1-W.position)*E,{size:32,width:A-20,align:"right"});for(const[G,W]of(M.xTicks||[]).entries())n.fillStyle=i.interaction==="source"?u[G%u.length]:"#f1faf5",Zt(n,W.label,A+W.position*S,C+E+24,{size:31,width:Math.max(150,S/5),align:"center"});const H=r.recorder?M.yLabel:M.title;n.fillStyle=u[y%u.length],Zt(n,H||M.yLabel||"",A+12,C-22,{size:31,width:S-24}),n.save(),n.beginPath(),n.rect(A,C,S,E),n.clip();for(const[G,W]of(M.series||[]).entries()){n.strokeStyle=u[o.length>1?y:G%u.length],n.lineWidth=i.interaction==="source"?12:5,n.lineCap="round",n.lineJoin="round",n.beginPath();let N=!1;for(const fe of W.points||[]){if(!Number.isFinite(fe[0])||!Number.isFinite(fe[1])){N=!1;continue}const oe=A+fe[0]*S,K=C+(1-fe[1])*E;N?n.lineTo(oe,K):(n.moveTo(oe,K),N=!0)}n.stroke()}if(!(M.series||[]).some(G=>{var W;return(W=G.points)==null?void 0:W.length})){n.fillStyle="#f5faf4",n.font="700 32px Arial, sans-serif";const G=Wx(n,r.scopeError||M.subtitle||"No acquired signal",S-44).slice(0,2);for(const[W,N]of G.entries())Zt(n,N,A+S/2,C+E/2+(W-(G.length-1)/2)*38,{size:32,align:"center"})}const X=M.cursor||M.marker;if(X&&Number.isFinite(X.x)){const G=A+yn.clamp(X.x,0,1)*S;n.strokeStyle="#f4fff7",n.lineWidth=3,n.setLineDash([9,7]),n.beginPath(),n.moveTo(G,C),n.lineTo(G,C+E),n.stroke(),n.setLineDash([]),Number.isFinite(X.y)&&(n.fillStyle="#f4fff7",n.beginPath(),n.arc(G,C+(1-X.y)*E,7,0,Math.PI*2),n.fill())}n.restore()}const h=(i==null?void 0:i.cursor)||((x=o.find(y=>y.cursor))==null?void 0:x.cursor),d=(b=h==null?void 0:h.readings)!=null&&b.length?h.readings.map(qx):r.readings||[],f=t-94;n.fillStyle="#172b31",n.fillRect(0,f,e,94),n.fillStyle="#f6fff7";const g=h==null?void 0:h.xLabel,m=(g?[g,d.join("   ·   ")]:d.length>2?[d.slice(0,2).join("   ·   "),d.slice(2).join("   ·   ")]:[...d]).slice(0,2);m.length||m.push(r.scopeError?"CHECK CONNECTIONS":r.recorder?"Select a point to read it":"CONNECT THE CHANNELS"),m.forEach((y,M)=>Zt(n,y,22,f+(m.length===1?47:25+M*43),{size:35,width:e-44}))}function Xx({id:n="oscilloscope",label:e="OSCILLOSCOPE"}={}){const t=ki(n),i=t.enclosure(.43,.245,.18);t.text(e,.27,.014,[-.044,.224,i+7e-4],{align:"left",size:45}),t.box(.278,.18,.007,t.m.dark,t.group,[-.066,.127,i+.0015],.004);const r=t.screen(.266,.17,[-.066,.128,i+.0055],{pixels:[1064,680],background:"#071015"}),s=t.target(r.object,{kind:"screen",label:"Scope",action:"scope-screen",bounds:[]}),o=t.dial("Time/div","timeDiv",.108,.182,i,{radius:.014});t.text("TIME / DIV",.074,.011,[.109,.213,i+5e-4]);const a=t.dial("CH1 volts/div","ch1Scale",.099,.104,i,{color:"#807341"}),c=t.dial("CH2 volts/div","ch2Scale",.163,.104,i,{color:"#3f6e7b"});t.text("CH1",.038,.012,[.099,.137,i+6e-4]),t.text("CH2",.038,.012,[.163,.137,i+6e-4]),t.text("VOLTS / DIV",.1,.011,[.13,.077,i+6e-4]);const l=t.dial("Trigger level","triggerLevel",.171,.182,i,{radius:.008});t.text("TRIGGER",.052,.011,[.17,.212,i+6e-4]);const u=t.button("Trigger edge","set:triggerEdge:falling",.171,.148,i,{width:.028}),h=t.screen(.043,.01,[.171,.16,i+7e-4],{pixels:[400,100],background:Wt.face});t.button("Run / Hold","scope-toggle",-.054,.02,i,{width:.03,color:"#5f7567"}),t.text("RUN / HOLD",.066,.008,[-.055,.04,i+5e-4],{size:42}),t.button("Autoscale","scope-autoscale",.014,.02,i,{width:.026}),t.text("AUTO",.042,.008,[.014,.04,i+5e-4],{size:48}),t.socket("CH1",.1,.037,i,Wt.ch1,{bnc:!0,action:"tool:ch1",channel:"ch1"}),t.socket("CH2",.164,.037,i,Wt.ch2,{bnc:!0,action:"tool:ch2",channel:"ch2"});function d(f={}){var p,x,b,y,M;const g=f.parameters||{};o.set(g.timeDiv),a.set(g.ch1Scale),c.set(g.ch2Scale),l.set(g.triggerLevel),u.userData.equipmentTarget.action=`set:triggerEdge:${g.triggerEdge==="falling"?"rising":"falling"}`,h.draw(g.triggerEdge,(w,A,C)=>Zt(w,g.triggerEdge==="falling"?"FALL":"RISE",A/2,C/2,{size:C*.85,width:A-16,align:"center"})),s.bounds=Fl(r.canvas.width,r.canvas.height,Math.min(3,((x=(p=f.graph)==null?void 0:p.panels)==null?void 0:x.length)||1));const _=(b=f.rawGraph)==null?void 0:b.scope,m=_?{...g,timeDiv:_.timeDiv,ch1Scale:_.channels.ch1.scale,ch2Scale:_.channels.ch2.scale,scopeRunning:_.running,scopeStale:_.stale,scopeError:_.error,readings:[`CH1 ${on(_.channels.ch1.peak,2)} V pk  ·  CH2 ${on(_.channels.ch2.peak,2)} V pk`,`TRIGGER ${((y=_.trigger)==null?void 0:y.edge)==="falling"?"↓":"↑"} ${on((M=_.trigger)==null?void 0:M.level,2)} V`]}:g;r.draw([f.graph,m.timeDiv,m.ch1Scale,m.ch2Scale,m.scopeRunning,m.scopeStale,m.scopeError,m.readings],(w,A,C)=>Od(w,A,C,f.graph,m))}return t.finish(),d(),{group:t.group,targets:t.targets,anchors:t.anchors,screen:r,update:d,dispose:t.dispose}}function Th({id:n="lab-recorder",module:e="thevenin"}={}){const t=ki(n),i=t.enclosure(.43,.245,.18);t.text("LAB RECORDER",.3,.014,[-.038,.224,i+7e-4],{align:"left"}),t.box(.402,.187,.007,t.m.dark,t.group,[0,.119,i+.0015],.004);const r=t.screen(.391,.177,[0,.119,i+.0055],{pixels:[1280,580],background:"#071015"}),s=t.target(r.object,{kind:"screen",label:"Lab recorder",action:"scope-screen",bounds:[]});let o=0,a={},c=[];if(e==="transient")for(const[h,d]of["VOLTAGE","CURRENT","ENERGY"].entries()){const f=-.135+h*.135,g=t.button(d,`recorder-panel:${h}`,f,.013,i,{width:.11,color:"#47565b"}),_=t.screen(.102,.009,[f,.013,i+.0077],{pixels:[1020,90],background:"#47565b",foreground:"#ffffff"});_.object.userData.equipmentTarget=g.userData.equipmentTarget,c.push({text:_,label:d,index:h})}function l(h={}){var x,b,y;a=h;const d=h.parameters||{},f=h.measurement||{};let g=h.graph;e==="transient"&&((x=g==null?void 0:g.panels)!=null&&x.length)&&(o=Math.min(o,g.panels.length-1),g={...g.panels[o],panels:void 0}),s.bounds=Fl(r.canvas.width,r.canvas.height,1).map(M=>({...M,panel:e==="transient"?o:0}));const _=M=>`${M>=0?"+":""}${on(M,2)}`;let m=[];if(e==="thevenin"&&(m=f.ok?[`${Nd(d.load)}  ·  ${on(f.voltage,3)} V`,`${on(f.current*1e3,3)} mA  ·  ${on(f.power*1e3,3)} mW`]:["CONNECT CIRCUIT"]),e==="superposition"){const M=((b=h.rawGraph)==null?void 0:b.bars)||[];m=[M.slice(0,2).map((w,A)=>`${A?"B":"A"} ${Number.isFinite(w.value)?_(w.value):"—"} mA`).join("  ·  "),`BOTH ${Number.isFinite((y=M[2])==null?void 0:y.value)?_(M[2].value):"—"} mA`]}if(e==="transient"){const M=[f.voltage,f.current*1e3,f.energy*1e3],w=["V","mA","mJ"];m=f.ok?[`${on(d.time*1e3,3)} ms  ·  ${on(M[o],3)} ${w[o]}`,`${d.charging?"SOURCE":"RETURN"}  ·  ${on((d.acquiredTime||0)*1e3,3)} ms acquired`]:["CONNECT CIRCUIT"]}for(const M of c)M.text.draw(o===M.index,(w,A,C)=>{w.fillStyle=o===M.index?"#ecf7ec":"#47565b",w.fillRect(0,0,A,C),w.fillStyle=o===M.index?"#14251d":"#ffffff",Zt(w,M.label,A/2,C/2,{size:C*.88,width:A-20,align:"center"})});const p={recorder:e,playing:d.playing,readings:m};r.draw([g,p],(M,w,A)=>Od(M,w,A,g,p))}function u(h){return e!=="transient"||!Number.isInteger(h)||h<0||h>2?!1:(o=h,l(a),!0)}return t.finish(),l(),{group:t.group,targets:t.targets,anchors:t.anchors,screen:r,module:e,selectPanel:u,update:l,dispose:t.dispose}}function Yx({id:n="power-supply",label:e="DC POWER SUPPLY",parameter:t="equivalentVoltage",fixedValue:i=null,polarity:r=1,positiveTerminal:s="+",negativeTerminal:o="−"}={}){const a=ki(n),c=a.enclosure(.22,.186,.2);a.text(e,.183,.014,[0,.168,c+5e-4],{size:46}),a.box(.194,.071,.004,a.m.dark,a.group,[0,.124,c],.003);const l=a.screen(.186,.063,[0,.124,c+.0025],{background:"#071612",foreground:"#d8ffe0",pixels:[1116,378]}),u=t==="nortonCurrent",h=i===null?a.dial(u?"Current":"Voltage",t,.059,.059,c,{radius:.014}):null;a.text(i===null?u?"CURRENT":"VOLTAGE":"FIXED",.07,.009,[.057,.083,c+4e-4]),a.socket(o,-.067,.046,c,Wt.black),a.socket(s,-.02,.046,c,Wt.red),a.text("−        +",.09,.011,[-.044,.026,c+5e-4],{size:64});function d(f={}){var y;const g=i??((y=f.parameters)==null?void 0:y[t])??f.value;h==null||h.set(g);const _=f.parameters||{},m=t==="v1"?"a":t==="v2"?"b":null,p=f.module==="superposition"&&m&&_.sourceMode&&_.sourceMode!=="both"&&_.sourceMode!==m,x=p&&_.replacement==="open",b=p?0:Number.isFinite(g)?g*r:g;l.draw([b,t,p,x],(M,w,A)=>{Zt(M,x?"OPEN":`${on(b,2)} ${u?"mA":"V"}`,w/2,A*.43,{size:A*.72,width:w-48,align:"center"}),Zt(M,x?"DISCONNECTED":p?"SHORT":t==="rail"?"LINKED RAILS":"OUTPUT",w/2,A*.86,{size:A*.17,width:w-40,align:"center"})})}return a.finish(),d(),{group:a.group,targets:a.targets,anchors:a.anchors,update:d,dispose:a.dispose}}function jx({id:n="generator",label:e="FUNCTION GENERATOR"}={}){const t=ki(n),i=t.enclosure(.28,.135,.16);t.text(e,.238,.012,[0,.118,i+5e-4],{size:48}),t.box(.167,.086,.004,t.m.dark,t.group,[-.049,.064,i],.003);const r=t.screen(.159,.078,[-.049,.064,i+.0025],{pixels:[954,468],background:"#071612",foreground:"#e5ffe5"}),s=t.dial("Frequency","frequency",.064,.078,i,{radius:.012}),o=t.dial("Amplitude","amplitude",.112,.078,i,{radius:.01});t.text("Hz",.027,.009,[.063,.104,i+7e-4]),t.text("V pk",.032,.009,[.111,.104,i+7e-4]),t.socket("OUT",.082,.028,i,Wt.metal,{bnc:!0}),t.text("SINE OUT",.055,.008,[.082,.011,i+6e-4],{size:45});function a(c={}){const l=c.parameters||{};s.set(l.frequency),o.set(l.amplitude),r.draw([l.frequency,l.amplitude],(u,h,d)=>{Zt(u,`${on(l.frequency,1)} Hz`,h/2,d*.27,{size:d*.35,width:h-44,align:"center"}),Zt(u,`${on(l.amplitude,2)} V pk`,h/2,d*.65,{size:d*.33,width:h-44,align:"center"}),Zt(u,"SINE · 0 V OFFSET",h/2,d*.92,{size:d*.1,width:h-40,align:"center"})})}return t.finish(),a(),{group:t.group,targets:t.targets,anchors:t.anchors,update:a,dispose:t.dispose}}function Zx({id:n="resistance-box",label:e="RESISTANCE",parameter:t="load",values:i=zt[t]}={}){const r=ki(n),s=r.enclosure(.18,.14,.11),o=String(e).toLowerCase().replace(/[ₜₕₙ]/g,h=>({"ₜ":"t","ₕ":"h","ₙ":"n"})[h]),a=t==="rf"?"Rf":t==="rin"?"Rin":t==="load"?"RL":t==="equivalentResistance"?/norton|rn|r_n|rₙ/.test(o)?"Rn":"Rth":t==="resistance"?"R":e;r.text(a,.144,.032,[0,.116,s+7e-4]);const c=r.dial(a,t,.052,.059,s,{radius:.023,values:i});r.box(.096,.041,.003,r.m.dark,r.group,[-.03,.067,s],.002);const l=r.screen(.09,.035,[-.03,.067,s+.0017],{pixels:[900,350],background:"#e1ead5"});r.socket("A",-.06,.025,s,Wt.red),r.socket("B",-.014,.025,s,Wt.black);function u(h={}){var f;const d=((f=h.parameters)==null?void 0:f[t])??h.value;c.set(d),l.draw(d,(g,_,m)=>Zt(g,Nd(d),_/2,m/2,{size:m*.86,width:_-24,align:"center"}))}return r.finish(),u(),{group:r.group,targets:r.targets,anchors:r.anchors,width:.18,height:.14,update:u,dispose:r.dispose}}function Kx({id:n="experiment-controls",module:e="thevenin"}={}){const t=ki(n),i=t.enclosure(.56,.34,.16),r=[],s=[],o=["thevenin","superposition","opamp","transient"],a=5+Math.max(0,o.indexOf(e)),c=t.screen(.49,.03,[0,.315,i+7e-4],{pixels:[1470,90],background:Wt.face});function l(m,p,x,b,y){t.text(m,y,.03,[b,.281,i+7e-4]);const M=t.dial(m,p,b,.235,i,{radius:.023,values:x,min:p==="timeCursor"?0:void 0,max:p==="timeCursor"?1:void 0,step:p==="timeCursor"?.001:1});t.box(y,.04,.003,t.m.dark,t.group,[b,.184,i],.002);const w=t.screen(y-.008,.034,[b,.184,i+.0017],{pixels:[Math.round((y-.008)*5e3),170],background:"#e1ead5"});r.push({...M,parameter:p,display:w,label:m})}function u(m,p,x,b,y,M=.04,w="#354b45"){const A=t.button(m,p,x,b,i,{width:y,height:M,color:w}),C=A.userData.equipmentTarget,S=t.screen(y-.008,M-.008,[x,b,i+.0078],{pixels:[Math.round((y-.008)*5e3),160],background:w,foreground:"#f7fff8"});S.object.userData.equipmentTarget=C;const E={object:A,descriptor:C,display:S,color:w,label:m};return s.push(E),E}e==="thevenin"&&l("Circuit","representation",["original","thevenin","norton"],0,.34),e==="superposition"&&(l("Sources","sourceMode",["a","both","b"],-.14,.23),l("Inactive source","replacement",["short","open"],.14,.23)),e==="opamp"&&l("Amplifier","configuration",["inverting","noninverting"],0,.34);let h,d;e==="transient"&&(l("Circuit","kind",["RC","RL"],-.18,.156),l("Speed","speed",zt.speed,0,.156),l("Time","timeCursor",void 0,.18,.156),h=u("Run","play",-.208,.13,.124,.036),u("Replay","replay",-.069,.13,.124,.036),d=u("Return","switch",.069,.13,.124,.036),u("Reset","reset-energy",.208,.13,.124,.036));const f=u("Build","build",-.18,.077,.156);u("Clear","reset-circuit",0,.077,.156),u("Undo","undo",.18,.077,.156);for(const[m,p]of o.entries())u(`Lab ${5+m}`,`module:${p}`,-.2025+m*.135,.022,.124,.036,p===e?"#e3eee0":"#485658");const g={original:"Original",thevenin:"Thévenin",norton:"Norton",both:"Both",a:"A only",b:"B only",short:"Short",open:"Open",inverting:"Inverting",noninverting:"Non-inverting"};function _(m={}){const p=m.parameters||{},x=m.mode==="build";f.descriptor.action=x?"explore":"build",f.descriptor.label=x?"Explore reference":"Build circuit",f.label=x?"Explore":"Build",c.draw(x,(b,y,M)=>Zt(b,`Lab ${a} · ${x?"Build circuit":"Explore"}`,y/2,M/2,{size:M*.88,width:y-24,align:"center"}));for(const b of r){const y=b.parameter==="timeCursor"?p.time:p[b.parameter];b.parameter==="timeCursor"&&(b.descriptor.max=Math.max(0,p.acquiredTime||0),b.descriptor.step=Math.max(1e-6,b.descriptor.max/100)),b.set(y);const M=b.parameter==="timeCursor"?`${on((y||0)*1e3,3)} ms`:b.parameter==="speed"?`${on(y,2)}×`:g[y]||String(y||b.label);b.display.draw(M,(w,A,C)=>Zt(w,M,A/2,C/2,{size:C*.9,width:A-20,align:"center"}))}h&&(h.label=p.playing?"Pause":"Run",h.descriptor.label=h.label),d&&(d.label=p.charging?"Return":"Source",d.descriptor.label=p.charging?"Switch to return loop":"Switch to source");for(const b of s)b.display.draw(b.label,(y,M,w)=>{y.fillStyle=b.color==="#e3eee0"?"#10251b":"#f7fff8",Zt(y,b.label,M/2,w/2,{size:w*.9,width:M-16,align:"center"})})}return t.finish(),_(),{group:t.group,targets:t.targets,anchors:t.anchors,module:e,width:.56,height:.34,update:_,dispose:t.dispose}}function Jx({id:n="probe",color:e=Wt.red,channel:t="red",label:i="Probe",action:r=/ground/i.test(t)?`scope-ground:${t.slice(0,3)}`:`tool:${t}`,ground:s=/ground/i.test(t)}={}){if(s)return Qx({id:n,color:e,channel:t,label:i,action:r});const o=ki(n),{group:a,m:c}=o,l=o.material(e,{roughness:.76}),u=o.mesh(new ht(.005,.0043,.113,24),l,a,[0,.091,0]);o.mesh(new ht(.0021,.0038,.019,20),l,a,[0,.0255,0]),o.mesh(new ht(75e-5,75e-5,.016,14),c.metal,a,[0,.01,0]),o.mesh(new Rl(75e-5,.0025,14),c.metal,a,[0,.00125,0]).rotation.z=Math.PI,o.mesh(new ht(.012,.012,.0027,32),l,a,[0,.036,0]);for(let f=0;f<13;f++)o.mesh(new ht(.0054,.0054,.0015,24),l,a,[0,.048+f*.0064,0]);o.mesh(new ht(.0022,.0045,.024,20),c.rubber,a,[0,.156,0]);for(let f=0;f<5;f++)o.mesh(new ht(.0035-f*25e-5,.0035-f*25e-5,.001,18),c.rubber,a,[0,.149+f*.0035,0]);o.anchor("tip",[0,0,0]),o.anchor("cable",[0,.168,0]);const h=o.target(u,{kind:"probe",id:n,label:i,channel:t,action:r});a.traverse(f=>{f.isMesh&&(f.userData.equipmentTarget=h)});function d(f={}){h.connected=!!f.connected,a.visible=f.visible!==!1}return o.finish(),{group:a,targets:o.targets,anchors:o.anchors,channel:t,length:.168,update:d,dispose:o.dispose}}function Qx({id:n="ground-clip",color:e=Wt.black,channel:t="ch1Ground",label:i="Ground clip",action:r="scope-ground:ch1"}={}){const s=ki(n),{group:o,m:a}=s,c=s.material(e,{roughness:.86});s.box(.007,.021,.0016,a.metal,o,[0,.01,-.0022],4e-4);const l=s.box(.007,.022,.0016,a.metal,o,[0,.012,.0022],4e-4);l.rotation.x=-.1;for(let f=0;f<5;f++)s.box(.006,.001,.0014,a.metal,o,[0,.003+f*.003,-.001],1e-4),s.box(.006,.001,.0014,a.metal,o,[0,.003+f*.003,.001],1e-4);const u=s.cylinder(.0034,.009,a.metal,o,[0,.021,0],16);u.rotation.y=Math.PI/2;const h=s.box(.011,.025,.01,c,o,[0,.032,0],.003);s.mesh(new ht(.0017,.0032,.009,16),a.rubber,o,[0,.048,0]),s.anchor("tip",[0,0,0]),s.anchor("cable",[0,.053,0]);const d=s.target(h,{kind:"probe",id:n,label:i,channel:t,action:r});return o.traverse(f=>{f.isMesh&&(f.userData.equipmentTarget=d)}),s.finish(),{group:o,targets:s.targets,anchors:s.anchors,channel:t,length:.053,update(f={}){d.connected=!!f.connected,o.visible=f.visible!==!1},dispose:s.dispose}}function Ah({points:n=[[0,0,0],[0,.01,-.03],[.02,.01,-.06]],color:e=Wt.black,radius:t=.0018}={}){const i=new Qt;i.name="insulated-lead";const r=new Ul({color:e,roughness:.82,metalness:0});let s=null,o="",a=!1;function c(l){const h=(Array.isArray(l)?l:(l==null?void 0:l.points)||n).map(al);if(h.length<2)return;const d=h.map(_=>_.toArray().map(m=>m.toFixed(5)).join(",")).join(";");if(o===d)return;o=d;const f=new Fs(h,!1,"centripetal"),g=new Qs(f,48,t,7,!1);s?(s.geometry.dispose(),s.geometry=g):(s=new Rn(g,r),s.castShadow=!0,s.receiveShadow=!0,i.add(s))}return c(n),{group:i,targets:[],anchors:{},update:c,dispose(){a||(a=!0,s==null||s.geometry.dispose(),r.dispose(),i.removeFromParent())}}}function ey({xrManager:n,navigatorXR:e,isSecureContext:t=!0,visibilityTarget:i=null,onStatus:r=()=>{},onBeforeSession:s=()=>{},onSessionStarted:o=()=>{},onSessionEnded:a=()=>{}}){var H,X;let c=!1,l=!1,u=!1,h=!1,d=null,f=!1,g=!1,_=null,m=0,p={kind:"checking",supported:!1,active:!1,message:"Checking headset…"};const x=()=>typeof e=="function"?e():e,b=()=>typeof t=="function"?t():t;function y(G,W){p={kind:G,supported:c,active:l,message:W},h||r({...p})}function M(G="ended"){if(!d&&!f&&!l)return;const W=d,N=f;d=null,f=!1,l=!1,u=!1,N&&a({session:W,floorReference:g,reason:G}),y(c?"ready":"unavailable",c?"VR ready. Enter the lab to connect leads and take readings.":"Open the lab’s HTTPS link in your headset browser.")}const w=()=>M(h?"disposed":"ended");(H=n.addEventListener)==null||H.call(n,"sessionend",w);const A=()=>{E()},C=()=>{(!(i!=null&&i.visibilityState)||i.visibilityState==="visible")&&E()};(X=i==null?void 0:i.addEventListener)==null||X.call(i,"visibilitychange",C);function S(G){var W,N;G!==_&&((W=_==null?void 0:_.removeEventListener)==null||W.call(_,"devicechange",A),_=G,(N=_==null?void 0:_.addEventListener)==null||N.call(_,"devicechange",A))}async function E(){if(h||u||l)return c;const G=++m,W=x();if(S(W),c=!1,!b())return y("unavailable","VR needs HTTPS. Open the lab’s HTTPS link in your headset browser."),!1;if(!(W!=null&&W.isSessionSupported))return y("unavailable","No headset found here. Open the lab’s HTTPS link in your headset browser."),!1;y("checking","Checking headset…");try{const N=await W.isSessionSupported("immersive-vr");if(h||u||l||G!==m)return c;c=!!N,y(c?"ready":"unavailable",c?"VR ready. Enter the lab to connect leads and take readings.":"No headset found here. Open the lab’s HTTPS link in your headset browser.")}catch(N){!h&&!u&&!l&&G===m&&y("unavailable",`VR support could not be checked: ${(N==null?void 0:N.message)||(N==null?void 0:N.name)||"unknown error"}.`)}return c}async function U(){if(h||u)return!1;if(l)return!0;const G=x();if(S(G),!b()||!(G!=null&&G.requestSession))return y("unavailable",b()?"No headset found here. Open the lab’s HTTPS link in your headset browser.":"VR needs HTTPS. Open the lab’s HTTPS link in your headset browser."),!1;u=!0,m++,y("entering","Accept the headset’s request to enter VR.");let W;try{if(W=await G.requestSession("immersive-vr",{optionalFeatures:["local-floor","bounded-floor"]}),h)return await W.end().catch(()=>{}),!1;d=W,g=!1;try{await W.requestReferenceSpace("local-floor"),g=!0}catch{}return n.setReferenceSpaceType(g?"local-floor":"local"),f=!0,s({session:W,floorReference:g}),await n.setSession(W),h||d!==W?(await W.end().catch(()=>{}),!1):(c=!0,l=!0,u=!1,o({session:W,floorReference:g}),y("active","VR active. Grip probes and dials. Left stick moves; right stick turns. Click a stick to return to the bench."),!0)}catch(N){return W&&await W.end().catch(()=>{}),M("error"),u=!1,y("error",(N==null?void 0:N.name)==="NotAllowedError"?"The VR request was declined. Select Try VR again when you are ready.":`VR could not start: ${(N==null?void 0:N.message)||(N==null?void 0:N.name)||"headset unavailable"}. Check the headset and try again.`),!1}}async function k(){if(!d)return!1;const G=d;try{return await G.end(),d===G&&M(h?"disposed":"ended"),!0}catch(W){return y("error",`VR could not exit: ${(W==null?void 0:W.message)||(W==null?void 0:W.name)||"unknown error"}. Use the headset system menu to exit.`),!1}}async function $(){var G,W,N;h||(h=!0,m++,d&&await k(),f&&M("disposed"),(G=_==null?void 0:_.removeEventListener)==null||G.call(_,"devicechange",A),(W=i==null?void 0:i.removeEventListener)==null||W.call(i,"visibilitychange",C),(N=n.removeEventListener)==null||N.call(n,"sessionend",w))}return E(),{enter:U,exit:k,refreshSupport:E,dispose:$,toggle:()=>l?k():U(),get state(){return{...p}},get active(){return l},get entering(){return u},get supported(){return c}}}function ty(n,e){return{position:n.position.clone(),quaternion:n.quaternion.clone(),scale:n.scale.clone(),near:n.near,far:n.far,fov:n.fov,aspect:n.aspect,zoom:n.zoom,target:e.target.clone(),controlsEnabled:e.enabled}}function ny(n,e,t,i){i&&(t.position.set(0,0,0),t.quaternion.identity(),t.scale.set(1,1,1),n.position.copy(i.position),n.quaternion.copy(i.quaternion),n.scale.copy(i.scale),Object.assign(n,{near:i.near,far:i.far,fov:i.fov,aspect:i.aspect,zoom:i.zoom}),n.updateProjectionMatrix(),e.target.copy(i.target),e.enabled=i.controlsEnabled,e.update(),n.updateMatrixWorld(!0))}function iy(n,e,{floorReference:t=!0,eyeHeight:i=1.6}={}){var u,h;const r=(u=e==null?void 0:e.transform)==null?void 0:u.position,s=(h=e==null?void 0:e.transform)==null?void 0:h.orientation;if(!r||!s||![r.x,r.y,r.z,s.x,s.y,s.z,s.w].every(Number.isFinite))return!1;const o=new gn(s.x,s.y,s.z,s.w).normalize(),a=new D(0,0,-1).applyQuaternion(o),c=Math.hypot(a.x,a.z)>.001?Math.atan2(a.x,-a.z):-new Vn().setFromQuaternion(o,"YXZ").y;n.quaternion.setFromAxisAngle(new D(0,1,0),c);const l=new D(r.x,r.y,r.z).applyQuaternion(n.quaternion);return n.position.set(-l.x,t?0:i-r.y,-l.z),n.updateMatrixWorld(!0),!0}const jt=n=>({x:n.x,y:n.y,z:n.z}),zn=(n,e,t)=>({x:n.x+(e.x-n.x)*t,y:n.y+(e.y-n.y)*t,z:n.z+(e.z-n.z)*t}),vi=(n,e)=>Math.hypot(n.x-e.x,n.z-e.z),hc=(n,e,t=0)=>n.x>e.minX-t&&n.x<e.maxX+t&&n.z>e.minZ-t&&n.z<e.maxZ+t;class ry{constructor(){Ra(this,"items",[]);Ra(this,"serial",0)}push(e,t){const i={value:e,score:t,order:this.serial++};let r=this.items.length;for(this.items.push(i);r>0;){const s=r-1>>1;if(this.less(this.items[s],i))break;this.items[r]=this.items[s],r=s}this.items[r]=i}less(e,t){return e.score<t.score||e.score===t.score&&e.order<t.order}pop(){const e=this.items[0],t=this.items.pop();if(this.items.length){let i=0;for(;i*2+1<this.items.length;){let r=i*2+1;if(r+1<this.items.length&&this.less(this.items[r+1],this.items[r])&&r++,this.less(t,this.items[r]))break;this.items[i]=this.items[r],i=r}this.items[i]=t}return e==null?void 0:e.value}}function cl(n){const e=[n[0]];for(let t=1;t<n.length-1;t++){const i=n[t-1],r=n[t],s=n[t+1];Math.abs((r.x-i.x)*(s.z-r.z)-(r.z-i.z)*(s.x-r.x))>1e-8&&e.push(r)}return n.length>1&&e.push(n.at(-1)),e}function ia(n,e){if(n.length<3)return n.map(jt);const t=[jt(n[0])];for(let i=1;i<n.length-1;i++){const r=n[i-1],s=n[i],o=n[i+1],a=vi(r,s),c=vi(s,o);if(a<1e-6||c<1e-6){t.push(jt(s));continue}const l=Math.min(e,a*.3,c*.3),u=zn(s,r,l/a),h=zn(s,o,l/c);t.push(u);for(const d of[.25,.5,.75])t.push(zn(zn(u,s,d),zn(s,h,d),d));t.push(h)}return t.push(jt(n.at(-1))),t}function ll(n,e,{bounds:t,obstacles:i=[],step:r,padding:s,reserved:o=new Map,preferred:a=null}){const c=Math.floor(t.minX/r)*r,l=Math.floor(t.minZ/r)*r,u=Math.ceil((t.maxX-c)/r)+1,h=Math.ceil((t.maxZ-l)/r)+1,d=k=>({x:Math.max(0,Math.min(u-1,Math.round((k.x-c)/r))),z:Math.max(0,Math.min(h-1,Math.round((k.z-l)/r)))}),f=(k,$)=>$*u+k,g=k=>({x:c+k%u*r,y:0,z:l+Math.floor(k/u)*r}),_=d(n),m=d(e),p=f(_.x,_.z),x=f(m.x,m.z),b=k=>{if(k===p||k===x)return!1;const $=g(k);return i.some(H=>hc($,H,s)&&!(hc(n,H,s)&&vi($,n)<r*1.8)&&!(hc(e,H,s)&&vi($,e)<r*1.8))},y=k=>(Math.abs(g(k).x-g(x).x)+Math.abs(g(k).z-g(x).z))/r,M=new ry,w=new Map([[p,0]]),A=new Map,C=new Map,S=new Set;for(M.push(p,y(p));M.items.length;){const k=M.pop();if(S.has(k))continue;if(k===x)break;S.add(k);const $=k%u,H=Math.floor(k/u);for(const[X,[G,W]]of[[1,0],[0,1],[-1,0],[0,-1]].entries()){const N=$+G,fe=H+W;if(N<0||fe<0||N>=u||fe>=h)continue;const oe=f(N,fe);if(S.has(oe)||b(oe))continue;const K=g(oe),$e=o.get(`${N},${fe}`)||0,at=Math.min(K.x-t.minX,t.maxX-K.x,K.z-t.minZ,t.maxZ-K.z),Oe=a==="perimeter"?Math.max(0,at/r)*.2:0,gt=C.has(k)&&C.get(k)!==X?.32:0,te=w.get(k)+1+$e*14+gt+Oe;te>=(w.get(oe)??1/0)||(w.set(oe,te),A.set(oe,k),C.set(oe,X),M.push(oe,te+y(oe)))}}if(p!==x&&!A.has(x))return null;const E=[x];for(;E.at(-1)!==p;)E.push(A.get(E.at(-1)));E.reverse();const U=E.map(g);return U[0]=jt(n),U[U.length-1]=jt(e),{points:U,cells:E.map(k=>({x:k%u,z:Math.floor(k/u)})),cols:u,rows:h}}function sy(n,e,t,i,r){const s=t.maxZ+i;return[jt(n),{x:n.x,y:r,z:n.z},{x:n.x,y:r,z:s},{x:e.x,y:r,z:s},{x:e.x,y:r,z:e.z},jt(e)]}const Rh=new WeakMap;function oy(n,{obstacles:e=[],bounds:t={minX:-1.64,maxX:1.64,minZ:-.94,maxZ:.94},step:i=.045,floor:r=.95,previousRoutes:s,layoutKey:o=null}={}){const a=new Map,c=new Map,l=new Map,u=new Map,h=JSON.stringify([o,[t.minX,t.maxX,t.minZ,t.maxZ],i,r,e.map(p=>[p.minX,p.maxX,p.minZ,p.maxZ,p.top??null]).sort((p,x)=>JSON.stringify(p).localeCompare(JSON.stringify(x)))]),d=s&&Rh.get(s),f=(p,x)=>p&&x&&p.x===x.x&&p.y===x.y&&p.z===x.z;function g(p,x){for(const[b,y]of p.entries()){if(b<=1||b>=p.length-2)continue;const M=`${y.x},${y.z}`;c.set(M,[...c.get(M)||[],x]);for(let w=-1;w<=1;w++)for(let A=-1;A<=1;A++){const C=`${y.x+w},${y.z+A}`;a.set(C,(a.get(C)||0)+(w||A?.45:1))}}}function _(p){var M,w;const x=Math.floor(t.minX/i)*i,b=Math.floor(t.minZ/i)*i,y=[];for(let A=1;A<p.length;A++){const C=Math.max(1,Math.ceil(vi(p[A-1],p[A])/(i/2)));for(let S=0;S<=C;S++){const E=zn(p[A-1],p[A],S/C),U={x:Math.round((E.x-x)/i),z:Math.round((E.z-b)/i)};(((M=y.at(-1))==null?void 0:M.x)!==U.x||((w=y.at(-1))==null?void 0:w.z)!==U.z)&&y.push(U)}}return y}if((d==null?void 0:d.signature)===h)for(const p of n){const x=d.records.get(p.id),b=s.get(p.id);x&&b&&f(p.start,x.start)&&f(p.end,x.end)&&(l.set(p.id,b),u.set(p.id,x),g(x.cells,x.layer))}const m=[...n].sort((p,x)=>vi(p.start,p.end)-vi(x.start,x.end)||p.id.localeCompare(x.id));for(const p of m){if(l.has(p.id))continue;const{start:x,end:b}=p,y=ll(x,b,{bounds:t,obstacles:e,step:i,padding:i*1.15,reserved:a});if(!y){const H=Math.max(x.y,b.y,...e.map(N=>N.top||r))+.06,X=ia(sy(x,b,t,i,H),i),G=_(X),W=Math.round((H-r)/.027);l.set(p.id,X),u.set(p.id,{start:jt(x),end:jt(b),cells:G,layer:W}),g(G,W);continue}const M=new Set;for(const H of y.cells.slice(2,-2))for(const X of c.get(`${H.x},${H.z}`)||[])M.add(X);let w=0;for(;M.has(w);)w++;const A=r+w*.027;g(y.cells,w);const C=cl(y.points.map(H=>({...H,y:A}))),S=ia(C,i*.75),E=S[1]||S[0],U=S.at(-2)||S.at(-1),k=zn({...x,y:A},E,Math.min(.1/Math.max(vi(x,E),1e-6),.3)),$=zn({...b,y:A},U,Math.min(.1/Math.max(vi(b,U),1e-6),.3));l.set(p.id,[jt(x),k,...S.slice(1,-1),$,jt(b)]),u.set(p.id,{start:jt(x),end:jt(b),cells:y.cells,layer:w})}return Rh.set(l,{signature:h,records:u}),l}function Ch(n,e,{lane:t=0,bounds:i={minX:-.6,maxX:.6,minZ:-1.15,maxZ:-.38},obstacles:r=[],floor:s=.833,boardTop:o=.874,exit:a={x:0,y:0,z:1},branch:c=!1}={}){const l=C=>({...C,y:C.x>i.minX&&C.x<i.maxX&&C.z>i.minZ&&C.z<i.maxZ?o:s});if(c){const C=zn(n,e,.5);C.y=Math.max(o+.025,Math.min(n.y,e.y)-.025),C.x+=(t%2?-1:1)*.025;const S=Math.min(n.y,e.y,C.y);if(!r.some(H=>(H.top||o)>S-.005&&Math.max(n.x,C.x,e.x)+.035>H.minX&&Math.min(n.x,C.x,e.x)-.035<H.maxX&&Math.max(n.z,e.z)+.035>H.minZ&&Math.min(n.z,e.z)-.035<H.maxZ)&&vi(n,e)<.25)return[jt(n),zn(n,C,.35),C,zn(C,e,.65),jt(e)];const U={minX:Math.min(i.minX-.04,n.x-.04,e.x-.04),maxX:Math.max(i.maxX+.04,n.x+.04,e.x+.04),minZ:Math.min(i.minZ-.04,n.z-.04,e.z-.04),maxZ:Math.max(i.maxZ+.04,n.z+.04,e.z+.04)},k=ll(n,e,{bounds:U,obstacles:r,step:.016,padding:.025});if(k){const H=ia(cl(k.points.map(X=>({...X,y:o+.025}))),.018);return H.length===2&&H.splice(1,0,zn(H[0],H[1],.5)),H[0]=jt(n),H[H.length-1]=jt(e),H}const $=Math.max(n.y,e.y,...r.map(H=>H.top||o))+.06;return[jt(n),{...n,y:$},{...zn(n,e,.33),y:$},{...zn(n,e,.67),y:$},{...e,y:$},jt(e)]}const u=.045+t*.014,h=i.maxZ+u,d=n.x<(i.minX+i.maxX)/2?i.minX-u:i.maxX+u,f={x:n.x+a.x*.045,y:n.y+a.y*.045,z:n.z+a.z*.045},g=Math.abs(a.z)>=Math.abs(a.x),_=(Math.max(0,n.y-s)*Math.max(0,a.y)+.035)/Math.max(Math.abs(a.z),.25),m=g?a.z>=0?Math.max(h,n.z+_):Math.min(h,n.z-_):h,p={x:d,y:s,z:m},x={minX:Math.min(i.minX-u,e.x-.035),maxX:Math.max(i.maxX+u,e.x+.035),minZ:Math.min(i.minZ-u,e.z-.035),maxZ:Math.max(h+.035,m+.035,e.z+.035)},b=l(e),y=ll(p,b,{bounds:x,obstacles:r,step:.018,padding:.011,preferred:"perimeter"}),M=Math.max(e.y,...r.map(C=>C.top||s))+.04,w=y?cl(y.points.map(l)):[{...p,y:M},{...b,y:M}],A=[jt(n),f,{x:f.x,y:s,z:m},p,...w,{...jt(e),y:Math.max(o+.025,e.y-.03)},jt(e)];return ia(A.filter((C,S)=>S===0||Math.hypot(C.x-A[S-1].x,C.y-A[S-1].y,C.z-A[S-1].z)>1e-5),.028)}const li=n=>({x:n.x,y:n.y,z:n.z}),Fd=(n,e)=>Math.hypot(n.x-e.x,n.y-e.y,n.z-e.z),kd=(n,e,t)=>({x:n.x+(e.x-n.x)*t,y:n.y+(e.y-n.y)*t,z:n.z+(e.z-n.z)*t});function zd(n){const e=[0];for(let t=1;t<n.length;t++)e.push(e[t-1]+Fd(n[t-1],n[t]));return e}function Ph(n,e=48){if(!Number.isInteger(e)||e<2)throw new RangeError("Cable sample count must be an integer of at least two.");if(!n.length)return[];const t=zd(n),i=t.at(-1);if(i===0)return Array.from({length:e},()=>li(n[0]));const r=[li(n[0])];let s=1;for(let o=1;o<e-1;o++){const a=i*o/(e-1);for(;s<n.length-1&&t[s]<a;)s++;const c=t[s]-t[s-1];r.push(kd(n[s-1],n[s],c>0?(a-t[s-1])/c:0))}return r.push(li(n.at(-1))),r}function dc(n,e,t,{falloff:i=3}={}){if(!n.length)return[];if(n.length===1)return[li(e),li(t)];const r=zd(n),s=r.at(-1),o=n[0],a=n.at(-1),c=Math.max(1,i),l=n.map((u,h)=>{const d=s>0?r[h]/s:h/(n.length-1),f=(1-d)**c,g=d**c;return{x:u.x+(e.x-o.x)*f+(t.x-a.x)*g,y:u.y+(e.y-o.y)*f+(t.y-a.y)*g,z:u.z+(e.z-o.z)*f+(t.z-a.z)*g}});return l[0]=li(e),l[l.length-1]=li(t),l}function ay(n,e,t,i){const r=i/t;if(n<=r)return n*Math.exp(-t*e);const s=(n-r)/i;return e<=s?n-i*e:r*Math.exp(-t*(e-s))}function Lh(n,e,t,{response:i=10,maxSpeed:r=1.2,maxDelta:s=.05}={}){if(!e.length)return n.map(li);if(!n.length)return e.map(li);const o=Math.max(2,n.length),a=n.length===o?n:Ph(n,o),c=e.length===o?e:Ph(e,o),l=Number.isFinite(t)?Math.min(Math.max(t,0),Math.max(s,0)):0;return a.map((h,d)=>{if(d===0||d===o-1)return li(c[d]);const f=Fd(h,c[d]);if(f===0||l===0||i<=0||r<=0)return li(h);const g=ay(f,l,i,r);return kd(h,c[d],Math.max(0,Math.min(1,(f-g)/f)))})}function Ls(n,e,t){return`wire:${[n,e].sort().join("|")}:${t}`}function Dh(n,e){return n==="gnd"?{x:-1.1+e%8*.3,z:.79-Math.floor(e/8)*.16}:n==="out"?{x:.53+e%3*.27,z:-.22-Math.floor(e/3)*.18}:null}function cy(){const n=new Map;function e(t,i){const r=[...new Set(i)].sort((a,c)=>+!a.startsWith("wire:")-+!c.startsWith("wire:")||a.localeCompare(c));let s=n.get(t);s||(s=new Map,n.set(t,s));for(const a of s.keys())r.includes(a)||s.delete(a);const o=new Set(s.values());for(const a of r){if(s.has(a))continue;let c=0;for(;o.has(c);)c++;s.set(a,c),o.add(c)}return s}return{resolve(t,i,r){const s=e(t,i?[...r,i]:r);return i?s.get(i):0},prefer(t,i,r,s){const o=e(t,[...s,i]);return Number.isInteger(r)&&r>=0&&![...o].some(([a,c])=>a!==i&&c===r)&&o.set(i,r),o.get(i)},transfer(t,i,r,s){const o=n.get(t),a=o==null?void 0:o.get(i);return a===void 0||!r||i!==r&&o.has(r)?null:(i!==r&&(o.delete(i),o.set(r,a)),e(t,[...s.filter(c=>c!==i),r]),a)},clear(){n.clear()}}}function ly({container:n,onTerminal:e=()=>{},onWire:t=()=>{},onAction:i=()=>{},onPart:r=()=>{},onHover:s=()=>{},onPanelPreviewChange:o=()=>{},onXRStatus:a=()=>{},onFrame:c=()=>{},onChange:l=()=>{},onProbe:u=()=>{},onConnect:h=()=>{},onDisconnect:d=()=>{},onWireMove:f=()=>{},onGraphCursor:g=()=>{},onManipulation:_=()=>{}}){const m=new jp;m.background=new St("#c6c9c9"),m.fog=new wl("#c6c9c9",14,30);const p=new Zn(39,1,.05,35),x=new Sx({antialias:!0,alpha:!1});x.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),x.setClearColor("#c6c9c9"),x.outputColorSpace=wn,x.toneMapping=Zh,x.toneMappingExposure=1,x.shadowMap.enabled=!0,x.shadowMap.type=Yh,x.shadowMap.autoUpdate=!1,x.shadowMap.needsUpdate=!0,x.xr.enabled=!0,x.xr.setFoveation(0),x.domElement.setAttribute("aria-label","Circuit lab. Drag probe tips onto terminals. Drag a terminal to another terminal to connect a lead; pull a plug out to disconnect it. Drag equipment knobs to turn them. Click switches and drag across the scope screen. Drag empty space to look around and scroll to zoom."),x.domElement.style.touchAction="none",n.appendChild(x.domElement);const b=new wx(p,x.domElement);b.enableDamping=!0,b.dampingFactor=.09,b.minDistance=.55,b.maxDistance=12,b.minPolarAngle=.08,b.maxPolarAngle=Math.PI*.47,b.enablePan=!0;const y=new Qt;m.add(y),y.add(p);const M=new D(.8,.883,-.1),w=new gn().setFromEuler(new Vn(-.62,-Math.atan2(.8,.1),0,"YXZ")),A=new D(-.8,.895,-.1),C=new gn().setFromEuler(new Vn(-.62,Math.atan2(.8,.1),0,"YXZ")),S=1.35,E=new D(-.25,3,3.25).normalize(),U=new D(0,.97,-.77);let k=0;function $(){if(x.xr.isPresenting)return;y.position.set(0,0,0),p.aspect=Math.max(1,n.clientWidth)/Math.max(1,n.clientHeight),p.updateProjectionMatrix(),b.target.copy(U);let v=4.5;const R=[];for(const L of[-.97,.97])for(const F of[.81,1.16])for(const O of[-1.3,-.31])R.push(new D(L,F,O));for(const L of[-.3,.3])for(const F of[0,.35])for(const O of[-.1,.1])R.push(new D(L,F,O).applyQuaternion(w).add(M));for(const L of[-.32,.32])for(const F of[0,.36])for(const O of[-.13,.13])R.push(new D(L,F,O).applyQuaternion(C).add(A));for(const L of[-1.22,-.55,.55,1.22])for(const F of[-.46,.25])R.push(new D(L,.82,F));for(let L=0;L<7;L++){p.position.copy(b.target).addScaledVector(E,v),p.lookAt(b.target),p.updateMatrixWorld();const F=R.map(ut=>ut.clone().project(p)),O=Math.min(...F.map(ut=>ut.x)),z=Math.max(...F.map(ut=>ut.x)),ne=Math.min(...F.map(ut=>ut.y)),ie=Math.max(...F.map(ut=>ut.y)),me=Math.max((z-O)/1.72,(ie-ne)/1.72),Te=v*Math.tan(yn.degToRad(p.fov/2)),rt=new D().setFromMatrixColumn(p.matrixWorld,0),dt=new D().setFromMatrixColumn(p.matrixWorld,1);b.target.addScaledVector(rt,(O+z)*.5*Te*p.aspect),b.target.addScaledVector(dt,(ne+ie)*.5*Te),v*=Math.max(.78,Math.min(1.3,me))}p.position.copy(b.target).addScaledVector(E,v),p.lookAt(b.target),k=p.aspect,b.update()}$(),m.add(new Nm("#ffffff","#777b79",1.35));const H=new qu("#fffdf8",2.7);H.position.set(-3,7,3),H.castShadow=!0,H.shadow.mapSize.set(2048,2048),Object.assign(H.shadow.camera,{left:-4,right:4,top:4,bottom:-4,near:.1,far:16}),H.shadow.normalBias=.004,m.add(H);const X=new qu("#eef2f4",.65);X.position.set(4,3,-4),m.add(X);const G={navy:"#2b2c2d",teal:"#414646",brass:"#b59a60",metal:"#b9baba",board:"#246648",copper:"#ad653c"},W=(v,R={})=>new Ul({color:v,roughness:.56,metalness:.08,...R}),N={navy:W(G.navy),teal:W(G.teal),metal:W(G.metal,{metalness:.7,roughness:.3}),brass:W(G.brass,{metalness:.65,roughness:.3}),copper:W(G.copper,{metalness:.65,roughness:.3}),board:W(G.board,{roughness:.58}),pale:W("#b9bcb8"),black:W("#171819",{roughness:.72}),resistor:W("#c8b082",{roughness:.74}),trace:W("#3f7952",{roughness:.68}),solder:W("#bfc3c0",{metalness:.82,roughness:.34}),red:W("#922724",{roughness:.67}),mat:W("#353b3d",{roughness:.95}),pcbEdge:W("#73764e",{roughness:.92})},fe=new Set(Object.values(N)),oe=new Qt;oe.position.set(0,.52,-.77),oe.scale.setScalar(.36),m.add(oe);const K=(v,R,L,F=0,O=0,z=0)=>{const ne=new Rn(v,R);return ne.position.set(F,O,z),ne.castShadow=!0,ne.receiveShadow=!0,L.add(ne),ne},$e=(v,R,L,F=.035)=>new da(v,R,L,3,F);K($e(3.65,.025,2.32,.018),N.mat,oe,0,.843),K($e(3.32,.022,2.02,.018),N.pcbEdge,oe,0,.907),K($e(3.319,.007,2.019,.018),N.board,oe,0,.921);for(const v of[-1.54,1.54])for(const R of[-.89,.89])K(new ht(.024,.024,.055,6),N.brass,oe,v,.88,R),K(new ht(.04,.04,.004,24),N.metal,oe,v,.929,R),K(new ht(.023,.023,.009,24),N.solder,oe,v,.934,R),K(new Yt(.029,.0015,.005),N.black,oe,v,.94,R),K(new Yt(.005,.0015,.029),N.black,oe,v,.94,R);const at=K(new Ni(80,80),W("#b9bcba",{roughness:.94}),m,0,.815,0);at.rotation.x=-Math.PI/2,at.visible=!1,at.castShadow=!1;const Oe=new Qt;Oe.visible=!0,m.add(Oe);const gt=K(new Ni(14,14),W("#a5a8a5",{roughness:.96}),Oe,0,-.003,-1.4);gt.rotation.x=-Math.PI/2,gt.castShadow=!1;const te=K(new Ni(10,3.4),W("#d2d3cd",{roughness:.94}),Oe,0,1.7,-5.1);te.castShadow=!1,K(new Yt(10,.1,.025),W("#9c9f9b",{roughness:.84}),Oe,0,.05,-5.08);const le=K($e(2.12,.04,1.42,.009),W("#a7aaa5",{roughness:.83}),Oe,0,.8,-.985);for(const v of[-.91,.91])for(const R of[-1.57,-.4])K(new Yt(.055,.765,.055),W("#858b8c",{metalness:.62,roughness:.43}),Oe,v,.3975,R),K(new ht(.04,.04,.027,20),N.black,Oe,v,.0135,R);for(const v of[-1.57,-.4])K(new Yt(1.85,.065,.035),N.metal,Oe,0,.729,v);for(const v of[-.91,.91])K(new Yt(.035,.065,1.2),N.metal,Oe,v,.729,-.985);K($e(.67,.04,.525,.004),le.material,Oe,.885,.8,-.0125),K($e(.16,.04,.185,.004),le.material,Oe,1.14,.8,-.3675);for(const v of[-.37,.16])K(new Yt(.045,.765,.045),N.metal,Oe,1.16,.3975,v),K(new ht(.034,.034,.027,20),N.black,Oe,1.16,.0135,v);K(new Yt(.58,.065,.035),N.metal,Oe,.87,.729,.16);const Re=new Qt;Re.position.copy(M),Re.quaternion.copy(w),Oe.add(Re),K($e(.6,.012,.195,.006),N.metal,Re,0,-.01,0);for(const v of[-.23,.23])for(const R of[-.066,.066]){const L=new D(v,-.018,R).applyQuaternion(w).add(M),F=Math.max(.01,L.y-.821);K(new ht(.008,.008,F,16),N.metal,Oe,L.x,.821+F/2,L.z),K(new ht(.019,.019,.003,20),N.black,Oe,L.x,.822,L.z)}K($e(.67,.04,.71,.004),le.material,Oe,-.885,.8,-.105);for(const v of[-.37,.16])K(new Yt(.045,.765,.045),N.metal,Oe,-1.16,.3975,v),K(new ht(.034,.034,.027,20),N.black,Oe,-1.16,.0135,v);K(new Yt(.58,.065,.035),N.metal,Oe,-.87,.729,.16);const Xe=new Qt;Xe.position.copy(A),Xe.quaternion.copy(C),Oe.add(Xe),K($e(.64,.012,.27,.006),N.metal,Xe,0,-.01,0);for(const v of[-.24,.24])for(const R of[-.1,.1]){const L=new D(v,-.018,R).applyQuaternion(C).add(A),F=Math.max(.01,L.y-.821);K(new ht(.008,.008,F,16),N.metal,Oe,L.x,.821+F/2,L.z),K(new ht(.019,.019,.003,20),N.black,Oe,L.x,.822,L.z)}function Be(v,R,L,F){const O=document.createElement("canvas");O.width=v,O.height=R;const z=O.getContext("2d"),ne=new nl(O);ne.colorSpace=wn,ne.anisotropy=Math.min(x.capabilities.getMaxAnisotropy(),16),ne.magFilter=ai,ne.minFilter=Qi,ne.generateMipmaps=!0;const ie=new jn({map:ne,transparent:!0,side:gi,depthWrite:!1,toneMapped:!1}),me=new Rn(new Ni(L,F),ie);return{canvas:O,context:z,texture:ne,object:me}}function Ke(v,R,L,F,O){const z=String(R??"");if(v.measureText(z).width<=O){v.fillText(z,L,F);return}let ne=z;for(;ne.length&&v.measureText(`${ne}…`).width>O;)ne=ne.slice(0,-1);v.fillText(`${ne}…`,L,F)}function Nt(v,R,L,F,O,z,ne=3){const ie=String(R??"").split(/\s+/);let me="",Te=0;for(let rt=0;rt<ie.length;rt++){const dt=me?`${me} ${ie[rt]}`:ie[rt];if(v.measureText(dt).width>O&&me){if(v.fillText(me,L,F+Te*z),me=ie[rt],Te++,Te===ne-1)return Ke(v,ie.slice(rt).join(" "),L,F+Te*z,O),Te+1}else me=dt}return me&&v.fillText(me,L,F+Te*z),Te+1}function B(v,R="",L=.44,F=.14){const O=Be(512,160,L,F),z=(ne,ie)=>{const me=O.context;me.clearRect(0,0,512,160),me.textAlign="center",me.fillStyle="#ffffff",me.font=ie?"600 72px monospace":"600 104px monospace",Ke(me,ne,256,ie?67:113,496),me.fillStyle="#f0f4ed",me.font="600 59px monospace",Ke(me,ie,256,142,496),O.texture.needsUpdate=!0};return z(v,R),O.object.rotation.x=-Math.PI/2,{...O,draw:z}}const ge=B("TRAINER PCB","DC / ANALOG",.68,.15);ge.object.position.set(-1.11,.932,-.84),oe.add(ge.object);const he=B("ELEN 221","PATCH TERMINALS",.45,.13);he.object.position.set(1.17,.932,-.86),oe.add(he.object);const se=new Qt,ce=new Qt,Ee=new Qt;oe.add(se,ce),m.add(Ee);const pe=new Map,Me=cy(),et=new Map;let it=[],I=[],T=[],Z=[];const ee=[],de=[],re=new Map,Fe=new Set,be=new Qt;m.add(be);let Ge="",Ve="vdc",j={components:[],wires:[],actions:[],live:{title:"Circuit bench",lines:[]}},Le="",tt="",Ye="",Ce="",lt="",V=null,xe="",Se=!1,Ne=null,ve="graph",ue="",ke=null,ot=0,bt=!1;function Mt(v){v.traverse(R=>{var F,O;(F=R.geometry)==null||F.dispose();const L=Array.isArray(R.material)?R.material:R.material?[R.material]:[];for(const z of L)fe.has(z)||((O=z.map)==null||O.dispose(),z.dispose())}),v.clear()}function _n(v,R,L,F,O=32){return K(new Qs(new Fs(v),O,R,7,!1),L,F)}function Hn(v,R,L){K(new ht(.027,.027,.003,24),N.copper,v,R,.929,L),K(new ht(.018,.023,.008,24),N.solder,v,R,.934,L),K(new ht(.005,.005,.001,12),N.black,v,R,.939,L)}function io(v,R,L,F,O,z,ne=0,ie="#dddcd4"){const me=Be(512,256,F,O),Te=me.context;return Te.fillStyle=ie,Te.textAlign="center",Te.font="600 76px monospace",Ke(Te,R,256,112,490),Te.font="48px monospace",Ke(Te,L,256,190,490),me.texture.needsUpdate=!0,me.object.rotation.x=-Math.PI/2,me.object.position.set(0,z,ne),v.add(me.object),me}const Qn=["#171718","#65432b","#922a25","#bb6726","#d7c24c","#3d6542","#31516d","#725475","#797b79","#dddcd0"];function Pr(v){const R=String(v).match(/([\d.]+)\s*(k|M)?/),L=R?Number(R[1])*(R[2]==="k"?1e3:R[2]==="M"?1e6:1):1e3,F=Math.floor(Math.log10(Math.max(L,.01)))-1,O=Math.round(L/10**F),z=F===-1?"#ac9456":F===-2?"#aeb1ae":Qn[Math.max(0,Math.min(9,F))];return[Qn[Math.floor(O/10)],Qn[O%10],z,"#b09a60"]}function hi(v){var R;if(v.type==="ground")return"GND";if(v.type==="C")return"C1";if(v.type==="L")return"L1";if(v.type==="opamp")return"U1";if(v.type==="switch")return"S1";if(v.type==="R"){const L={load:"RL",rin:"Rin",rf:"Rf",r:"R",r1:"R1",r2:"R2"}[v.id];if(L)return L;if(v.id==="req")return((R=j.parameters)==null?void 0:R.representation)==="norton"?"Rn":"Rth"}return String(v.label).replace("DC SOURCE","DC SUPPLY").replace("REFERENCE","GND")}function ro(v){return j.module==="thevenin"?{load:"load",req:"equivalentResistance"}[v.id]:j.module==="opamp"?{rin:"rin",rf:"rf"}[v.id]:j.module==="transient"&&v.id==="r"?"resistance":null}function di(v,R=de){for(const F of v.targets)if(F.object.userData.direct=F,F.kind==="dial"){const O=new Rn(new Pi(.022,12,8),new jn({transparent:!0,opacity:0,depthWrite:!1}));O.userData.direct=F,F.object.add(O),F.pickSleeve=O}const L=v.dispose;return v.dispose=()=>{for(const F of v.targets)F.pickSleeve&&(F.pickSleeve.geometry.dispose(),F.pickSleeve.material.dispose(),F.pickSleeve.removeFromParent(),F.pickSleeve=null);L()},R.push(v),v}function vs(v,R,L,F=-.53){return di(v,ee),v.group.scale.setScalar(1/.36),v.group.rotation.x=F,R.add(v.group),R.updateWorldMatrix(!0,!0),(v.anchors["+"]?[v.anchors["+"],v.anchors["−"]]:v.anchors.A?[v.anchors.A,v.anchors.B]:Object.values(v.anchors).slice(0,2)).forEach(z=>L.push(R.worldToLocal(z.getWorldPosition(new D)))),v.anchors.OUT&&L.length===1&&L.push(L[0].clone().add(new D(.007/.36,0,0))),v.update({...j,meterMode:Ve}),v}function Lr(v){var R,L,F;for(const O of ee)O.dispose();ee.length=0,Mt(se),pe.clear(),et.clear(),it=[],I=[];for(const O of v){const z=new Qt;z.position.set(O.x,.955,O.z),["V","I"].includes(O.type)&&z.position.set(((R=O.benchPosition)==null?void 0:R[0])??Math.sign(O.x||-1)*2.15,.842,((L=O.benchPosition)==null?void 0:L[1])??O.z),se.add(z);const ne=O.pins||[];ne.length===2&&["R","L","C"].includes(O.type)&&(z.rotation.y=-Math.atan2(ne[1].z-ne[0].z,ne[1].x-ne[0].x));const ie=[];let me=()=>{};switch(O.type){case"R":{const We=ro(O);if(We){z.rotation.y=0;const Ue=vs(Zx({id:O.id,label:hi(O),parameter:We}),z,ie,-.18);me=()=>Ue.update(j);break}const we=[[.014,-.13],[.026,-.115],[.035,-.098],[.034,-.073],[.032,-.045],[.032,.045],[.034,.073],[.035,.098],[.026,.115],[.014,.13]],je=K(new Il(we.map(([Ue,ft])=>new ye(Ue,ft)),32),N.resistor,z,0,.046);je.rotation.z=Math.PI/2;const qe=[];for(const[Ue,ft]of[-.079,-.035,.011,.085].entries()){const Ot=Ue===0||Ue===3?.0354:.0328,Lt=K(new ht(Ot,Ot,.014,32),W(Pr(O.value)[Ue],{roughness:.74}),z,ft,.046);Lt.rotation.z=Math.PI/2,qe.push(Lt)}me=Ue=>Pr(Ue).forEach((ft,Ot)=>qe[Ot].material.color.set(ft)),ie.push(new D(-.13,.046,0),new D(.13,.046,0));break}case"C":{const We=document.createElement("canvas");We.width=768,We.height=512;const we=We.getContext("2d");we.fillStyle="#202427",we.fillRect(0,0,768,512),we.fillStyle="#c6c9be",we.fillRect(145,0,110,512),we.fillStyle="#333835",we.font="bold 82px monospace",we.textAlign="center";for(const qe of[105,245,385])we.fillText("−",200,qe);we.fillStyle="#d2d4c8",we.font="bold 78px monospace",we.fillText("100µF",520,165),we.fillText("25V",520,285),we.font="48px monospace",we.fillText("105°C",520,391);const je=new nl(We);je.colorSpace=wn,K(new ht(.07,.07,.166,48),W("#ffffff",{map:je,roughness:.67}),z,0,.094),K(new ht(.064,.064,.008,48),N.metal,z,0,.181),K(new Ki(.065,.005,8,48),N.metal,z,0,.184).rotation.x=-Math.PI/2;for(const qe of[Math.PI/4,-Math.PI/4]){const Ue=K(new Yt(.1,.0015,.003),N.navy,z,0,.186);Ue.rotation.y=qe}K(new ht(.061,.061,.013,32),N.black,z,0,.007),ie.push(new D(-.03,.003,0),new D(.03,.003,0));break}case"L":{K(new ht(.03,.03,.29,24),N.black,z,0,.06).rotation.z=Math.PI/2;for(const we of[-.145,.145])K(new ht(.058,.058,.015,32),N.black,z,we,.06).rotation.z=Math.PI/2;const We=[];for(let we=0;we<=560;we++){const je=we/560*Math.PI*28;We.push(new D(-.131+we/560*.262,.06+Math.sin(je)*.041,Math.cos(je)*.041))}_n(We,.0077,N.copper,z,560),ie.push(new D(-.151,.052,0),new D(.151,.052,0));break}case"opamp":{const We=new Md;We.moveTo(-.083,-.135),We.lineTo(-.027,-.135),We.absarc(0,-.135,.027,Math.PI,0,!0),We.lineTo(.083,-.135),We.lineTo(.083,.135),We.lineTo(-.083,.135),We.closePath();const we=K(new Dl(We,{depth:.052,bevelEnabled:!0,bevelSegments:2,steps:1,bevelSize:.003,bevelThickness:.003}),N.black,z,0,.079);we.rotation.x=Math.PI/2;for(const qe of[-.105,.105])for(const Ue of[-.099,-.033,.033,.099]){K(new Yt(.056,.009,.019),N.metal,z,qe,.036,Ue),K(new Yt(.009,.052,.019),N.metal,z,Math.sign(qe)*.133,.01,Ue);const ft=new D(Math.sign(qe)*.133,-.02,Ue).add(z.position);Hn(se,ft.x,ft.z)}K(new ht(.009,.009,.001,16),W("#85877f"),z,-.052,.084,-.103),io(z,"OP AMP","DIP-8",.115,.143,.084,.024);const je={"op+":[-.133,-.016,.033],"op-":[-.133,-.016,-.033],out:[.133,-.016,.033],vp:[.133,-.016,-.033],vn:[-.133,-.016,.099]};ne.forEach(qe=>ie.push(new D(...je[qe.id]||[0,0,0])));break}case"switch":{K($e(.155,.056,.13,.004),N.black,z,0,.015),K(new Yt(.167,.01,.143),N.metal,z,0,.049),K(new ht(.036,.036,.044,32),N.metal,z,0,.075),K(new ht(.049,.049,.017,6),N.metal,z,0,.074),K(new Ki(.037,.003,6,32),N.navy,z,0,.092).rotation.x=-Math.PI/2;const We=new Qt;We.position.y=.09,z.add(We),K(new ht(.011,.013,.125,20),N.metal,We,0,.06),K(new Pi(.014,20,12),N.metal,We,0,.123),me=we=>{We.rotation.x=String(we).toUpperCase().includes("RETURN")?.39:-.39},me(O.value),ie.push(new D(-.046,-.012,-.047),new D(.056,-.012,0),new D(-.046,-.012,.047));for(const we of ie)K(new Yt(.022,.025,.011),N.brass,z,we.x,we.y,we.z);break}case"ground":{ie.push(new D(0,-.021,0));break}default:{let We="equivalentVoltage",we=null,je=1;j.module==="thevenin"?((F=j.parameters)==null?void 0:F.representation)==="original"?we=12:O.type==="I"&&(We="nortonCurrent"):j.module==="superposition"?(We=O.id==="a"?"v1":"v2",je=O.id==="b"?-1:1):j.module==="opamp"?We="rail":we=5;const qe=O.id==="signal"?jx({id:O.id}):Yx({id:O.id,label:hi(O),parameter:We,fixedValue:we,polarity:je});vs(qe,z,ie),me=()=>qe.update(j);break}}const Te=j.module==="opamp"&&O.type==="ground",rt=B(hi(O),Te?"":O.value,Te?.4:.5,.16),ut=ne.length===2&&Math.abs(ne[1].z-ne[0].z)>Math.abs(ne[1].x-ne[0].x)?Math.max(...ne.map(We=>We.z))+.22:O.z+(O.type==="switch"?.4:.22);if(rt.object.position.set(Te?1.32:O.x,.933,Te?.79:ut),se.add(rt.object),et.set(O.id,{value:O.value,label:O.label,draw:(We,we)=>rt.draw(hi(O),Te?"":we),body:z,type:O.type,updateHardware:me}),O.type!=="ground"){const We=["V","I"].includes(O.type)?[.46,.19,.34]:O.type==="C"?[.18,.23,.18]:O.type==="L"?[.35,.15,.17]:O.type==="opamp"?[.3,.12,.32]:O.type==="switch"?[.2,.23,.21]:[.3,.11,.12],we=new Yt(...We),je=K(we,new jn({transparent:!0,opacity:0,depthWrite:!1}),z,0,We[1]/2-.025,0);je.castShadow=!1,je.receiveShadow=!1,je.userData={kind:"part",id:O.id,label:`${hi(O)} · ${O.value}`,type:O.type},O.type==="switch"&&(je.userData.direct={object:je,kind:"switch",id:O.id,label:"Source / Return",action:"switch"});const qe=new Qp(new em(we),new Qo({color:"#cfb862",transparent:!0,opacity:.85}));qe.position.copy(je.position),qe.visible=!1,z.add(qe),et.get(O.id).outline=qe,et.get(O.id).hit=je,I.push(je)}for(const[We,we]of ne.entries()){const qe=(ie[We]||new D(0,0,0)).clone().applyAxisAngle(new D(0,1,0),z.rotation.y).add(z.position),Ue=new D(we.x-qe.x,0,we.z-qe.z).normalize(),ft=qe.clone().addScaledVector(Ue,["R","L"].includes(O.type)?.052:.014);if(ft.y=.938,["V","I"].includes(O.type)){const xt=new D(we.x,.995,we.z),Ft=qe.clone().lerp(xt,.5);Ft.y=Math.max(.95,Ft.y),_n([qe,qe.clone().lerp(Ft,.3),Ft,xt],.008,We===0?N.red:N.black,se,24)}else if(O.type!=="ground"){qe.distanceTo(ft)>.006&&_n([qe,qe.clone().lerp(ft,.55).add(new D(0,.006,0)),ft],.006,N.metal,se,14),Hn(se,ft.x,ft.z);const xt=new D(we.x,.929,we.z),Ft=ft.clone().lerp(xt,.5);Ft.y=.929,_n([new D(ft.x,.929,ft.z),Ft,xt],.007,N.trace,se,12)}const Ot=["V","I","C"].includes(O.type)&&We===0||we.label==="5 V"||we.label==="V+",Lt=j.module==="opamp"&&["gnd","out"].includes(we.id),Jt={x:we.x,z:we.z,red:Ot,label:`${hi(O)} ${we.label||we.id}`,common:Lt,sockets:[]};Jt.addSocket=({x:xt,z:Ft})=>{const qn=Jt.sockets.length;if(Lt&&qn>0){const yt=Jt.sockets[qn-1];_n([new D(yt.x,.942,yt.z),new D(xt,.942,Ft)],.013,N.brass,se,8)}K(new ht(.044,.044,.006,6),N.metal,se,xt,.934,Ft),K(new ht(.037,.041,.017,32),Ot?N.red:N.black,se,xt,.946,Ft),K(new ht(.032,.032,.028,32),Ot?N.red:N.black,se,xt,.968,Ft);for(const yt of[.956,.964,.972])K(new Ki(.032,.0018,5,32),Ot?N.red:N.navy,se,xt,yt,Ft).rotation.x=-Math.PI/2;K(new Ki(.018,.004,8,32),N.metal,se,xt,.984,Ft).rotation.x=-Math.PI/2,K(new ht(.014,.014,.005,24),N.black,se,xt,.982,Ft);const He=K(new Ki(.054,.0035,6,32),W("#ece6bd",{roughness:.6}),se,xt,.928,Ft);He.rotation.x=-Math.PI/2,He.visible=!1;const nt=K(new Pi(.068,12,8),new jn({transparent:!0,opacity:0,depthWrite:!1}),se,xt,.984,Ft);nt.castShadow=!1,nt.receiveShadow=!1,nt.userData={kind:"terminal",id:we.id,socket:qn,label:Jt.label},nt.userData.direct={object:nt,kind:"terminal",id:we.id,terminal:we.id,socket:qn,label:Jt.label},it.push(nt),Jt.sockets.push({x:xt,z:Ft,socket:qn,ring:He,hit:nt}),qn||Object.assign(Jt,{ring:He,hit:nt})};const cn=Lt?we.id==="gnd"?8:3:1;for(let xt=0;xt<cn;xt++)Jt.addSocket(Lt?Dh(we.id,xt):we);if(pe.set(we.id,Jt),!Te){const xt=B(we.label||we.id,"",Lt?.25:.15,Lt?.08:.063);xt.object.position.set(Lt?.8:we.x,.932,Lt?-.36:we.z+.086),se.add(xt.object)}}}}let zi=null,ar=0,so=0;const oo=new WeakMap;let _s=new Map,Bi=new Map;const cr=new Map,Vi=v=>v.map(R=>new D(R.x,R.y,R.z)),P=v=>new Fs(Vi(v)).getSpacedPoints(47),q=(v,R)=>Math.max(...v.map((L,F)=>Math.hypot(L.x-R[F].x,L.y-R[F].y,L.z-R[F].z)));function J(v){const R=Vi(v.points).map(F=>oe.worldToLocal(F)),L=new Fs(R);for(const[F,O]of[[v.wire,.009],[v.hit,.019]])F.geometry.dispose(),F.geometry=new Qs(L,96,O,7,!1)}function Q(v){for(const R of Bi.values()){if(!R.settling)continue;const L=(v-R.time)/1e3;R.time=v,R.points=Lh(R.points,R.target,L,{maxSpeed:.3}),q(R.points,R.target)<1e-4&&(R.points=R.target,R.settling=!1),J(R),x.shadowMap.needsUpdate=!0}}function Y(v=!1){if(!zi){oe.updateWorldMatrix(!0,!0);const R=[...et.values()].filter(O=>O.type!=="ground").flatMap(O=>{const z=new ir().setFromObject(O.body);return z.isEmpty()?[]:[z]}),L=(O,z)=>({minX:O.x,maxX:z.x,minZ:O.z,maxZ:z.z,top:z.y}),F=[Je,Ie].map(O=>(O.group.updateWorldMatrix(!0,!0),new ir().setFromObject(O.group))).filter(O=>!O.isEmpty());zi={world:[...R,...F].map(O=>L(O.min,O.max)),local:R.map(O=>L(oe.worldToLocal(O.min.clone()),oe.worldToLocal(O.max.clone())))}}return zi[v?"world":"local"]}function _e(v){const R=Bi;Bi=new Map,Mt(ce),T=[],Z=[],oe.updateWorldMatrix(!0,!1);const L=v.flatMap(([O,z],ne)=>{const ie=pe.get(O),me=pe.get(z);if(!ie||!me)return[];const Te=[O,z].sort().join("|"),rt=De(O,`wire:${Te}:${O}`),dt=De(z,`wire:${Te}:${z}`);return!rt||!dt?[]:[{id:Te,a:O,b:z,index:ne,startPin:ie,endPin:me,start:oe.worldToLocal(rt),end:oe.worldToLocal(dt)}]}),F=oy(L,{obstacles:Y(),previousRoutes:_s,layoutKey:so});_s=F,L.forEach(({id:O,a:z,b:ne,index:ie,startPin:me,endPin:Te,start:rt,end:dt})=>{const ut=z==="gnd"||ne==="gnd"||z.endsWith("-")||ne.endsWith("-")||z==="return"||ne==="return",We=W(ut?"#202121":"#8b2925",{roughness:.79}),we=F.get(O),je=R.get(O),qe=(je==null?void 0:je.route)===we?je.target:P(we).map(xt=>oe.localToWorld(xt)),Ue=cr.get(O);cr.delete(O);const Ot=(Ue?Ue.from===z?Ue.points:[...Ue.points].reverse():null)||((je==null?void 0:je.route)===we?je.points:qe),Lt=Vi(Ot).map(xt=>oe.worldToLocal(xt)),Jt=_n(Lt,.009,We,ce,96);Jt.userData={kind:"wire",index:ie};const cn=_n(Lt,.019,new jn({transparent:!0,opacity:0,depthWrite:!1}),ce,96);Bi.set(O,{a:z,b:ne,route:we,points:Ot,target:qe,wire:Jt,hit:cn,time:performance.now(),settling:Ot!==qe}),cn.castShadow=!1,cn.receiveShadow=!1,cn.userData={kind:"wire",index:ie,id:String(ie),label:`${me.label} → ${Te.label}`,wire:Jt,color:We.color.getHex()},T.push(cn);for(const[xt,Ft]of[rt,dt].entries()){const qn=K(new ht(.023,.026,.055,24),We,ce,Ft.x,1.012,Ft.z),He=K(new Pi(.037,12,8),new jn({transparent:!0,opacity:0,depthWrite:!1}),ce,Ft.x,1.03,Ft.z),nt={object:He,kind:"plug",id:`wire:${ie}:${xt}`,resource:`wire:${[z,ne].sort().join("|")}`,wireIndex:ie,wirePair:[z,ne],endpoint:xt,terminal:xt?ne:z,from:xt?z:ne,label:`Pull ${xt?Te.label:me.label} plug`,color:We.color.getHex()};qn.userData.direct=nt,He.userData.direct=nt,Z.push(He,qn);for(const yt of[.988,.996,1.004])K(new Ki(.023,.0018,6,24),We,ce,Ft.x,yt,Ft.z).rotation.x=-Math.PI/2}})}function Ae(v){const R=j.wires.filter(L=>L.includes(v)).map(([L,F])=>Ls(L,F,v));for(const L of["red","black","ch1","ch2","ch1Ground","ch2Ground"])Qe(L)===v&&R.push(`probe:${L}`);for(const L of Fe)L.from===v&&R.push(L.resource);return R}function ze(){return oe.updateWorldMatrix(!0,!1),[...pe].flatMap(([v,R])=>R.sockets.map(L=>({id:v,socket:L.socket,hit:L.hit,position:oe.localToWorld(new D(L.x,1.002,L.z))})))}function De(v,R){const L=pe.get(v);if(!L)return null;const F=L.common?Me.resolve(v,R,Ae(v)):0;for(;L.sockets.length<=F;)L.addSocket(Dh(v,L.sockets.length));const O=L.sockets[F];return oe.updateWorldMatrix(!0,!1),oe.localToWorld(new D(O.x,1.002,O.z))}function Qe(v){var L,F,O;if(v==="red"||v==="black")return((L=j.probes)==null?void 0:L[v])||null;const R=v.slice(0,3);return((O=(F=j.scope)==null?void 0:F[R])==null?void 0:O[v.endsWith("Ground")?"ground":"signal"])||null}const Je=di($x());Je.group.position.set(-.43,.823,-.3),Je.group.rotation.x=-.56,be.add(Je.group);let Ie=di(Th({module:"thevenin"}));Ie.group.position.copy(A),Ie.group.quaternion.copy(C),Ie.group.scale.setScalar(S),be.add(Ie.group);let st=null;const Pt=[["red","#b52e2b","Meter V",-.52],["black","#252829","Meter COM",-.35],["ch1","#d5b348","CH1",.1],["ch2","#64a5b5","CH2",.26],["ch1Ground","#a68e42","CH1 ground",.41],["ch2Ground","#477d8c","CH2 ground",.53]];for(const[v,R,L,F]of Pt){const O=Jx({id:`probe:${v}`,channel:v,color:R,label:L}),z=new D(F,.831,-.345);O.group.position.copy(z),O.group.rotation.x=-Math.PI/2;const ne=new Rn(new Al(.014,/Ground/.test(v)?.024:.12,4,8),new jn({transparent:!0,opacity:0,depthWrite:!1}));ne.position.y=/Ground/.test(v)?.027:.087,ne.userData.direct=O.targets[0],O.group.add(ne),O.targets[0].object=ne,O.targets[0].resource=`probe:${v}`;const ie=Ah({color:R,radius:.0019});m.add(O.group,ie.group),re.set(v,{unit:O,pick:ne,cable:ie,home:z,connected:void 0,channel:v,color:R,loose:!1})}function qt(v=!1){for(const L of[...Fe])![...Gt.holds.values()].some(O=>O.lead===L)&&L.originalPair&&j.wires.some(O=>O.includes(L.originalPair[0])&&O.includes(L.originalPair[1]))&&xs(L);const R=j.module||"thevenin";if(R!==Ge){if(R.split(":")[0]!==Ge.split(":")[0]){const L=de.indexOf(Ie);L>=0&&de.splice(L,1),Ie.dispose(),Ie=di(j.module==="opamp"?Xx():Th({module:j.module||"thevenin"})),Ie.group.position.copy(A),Ie.group.quaternion.copy(C),Ie.group.scale.setScalar(S),be.add(Ie.group),zi=null,ar++}Ge=R,st==null||st.dispose(),st=Kx({module:j.module||"thevenin"}),di(st,[]),st.group.position.copy(M),st.group.quaternion.copy(w),be.add(st.group)}for(const L of[...de,...ee,st].filter(Boolean))L.update({...j,meterMode:Ve});for(const L of re.values()){const F=!L.channel.startsWith("ch")||j.module==="opamp";if(L.unit.group.visible=L.cable.group.visible=F,Gt.isHeld(`probe:${L.channel}`))continue;const O=Qe(L.channel);if(O!==L.connected||v){delete L.restPose,L.connected=O;const z=De(O,`probe:${L.channel}`);z?(L.unit.group.position.copy(z),L.unit.group.rotation.set(-.24,0,L.channel.includes("2")?-.28:.28),L.loose=!1):L.loose||(L.unit.group.position.copy(L.home),L.unit.group.rotation.set(-Math.PI/2,0,0))}}wt()}function Vt(v,R,L,F,O=!1){const z=performance.now(),ne=[...v.toArray(),...R.toArray()].map(me=>me.toFixed(5)).join(":");let ie=oo.get(F);if(!ie||ie.revision!==ar){const me=P(Ch(v,R,L));ie={points:me,target:me,reference:me,signature:ne,held:O,time:z,revision:ar},oo.set(F,ie)}return O?(ie.held||(ie.reference=ie.points),(!ie.held||ie.signature!==ne)&&(ie.points=dc(ie.reference,v,R))):((ie.held||ie.signature!==ne)&&(ie.target=P(Ch(v,R,L))),ie.points!==ie.target&&(ie.points=Lh(ie.points,ie.target,(z-ie.time)/1e3,{maxSpeed:.3}),q(ie.points,ie.target)<1e-4&&(ie.points=ie.target),x.shadowMap.needsUpdate=!0)),ie.signature=ne,ie.held=O,ie.time=z,ie.points}function wt(){const v=performance.now();Q(v);const R=Y(!0);for(const L of re.values()){if(!L.unit.group.visible)continue;if(L.restPose){const ut=Math.min((v-L.restPose.time)/1e3,.05);L.restPose.time=v;const We=L.unit.group.position.distanceTo(L.restPose.position);L.unit.group.position.lerp(L.restPose.position,We?Math.min(1,.4*ut/We):1),L.unit.group.quaternion.slerp(L.restPose.quaternion,1-Math.exp(-10*ut)),We<1e-4&&L.unit.group.quaternion.angleTo(L.restPose.quaternion)<.001&&delete L.restPose,x.shadowMap.needsUpdate=!0}const F=L.channel,O=F.endsWith("Ground"),z=F==="red"?Je.anchors.V:F==="black"?Je.anchors.COM:Ie.anchors[F.startsWith("ch1")?"CH1":"CH2"],ne=O?re.get(F.slice(0,3)):null,ie=ne?ne.unit.group.localToWorld(new D(0,.055,0)):z==null?void 0:z.getWorldPosition(new D),me=L.unit.anchors.cable.getWorldPosition(new D),Te={red:0,black:1,ch1:2,ch2:3,ch1Ground:0,ch2Ground:1}[F]||0,rt=z?new D(0,0,1).applyQuaternion(z.getWorldQuaternion(new gn)):new D(0,0,1),dt=Gt.isHeld(`probe:${F}`)||!!L.restPose||!!(ne&&(Gt.isHeld(`probe:${ne.channel}`)||ne.restPose));ie&&L.cable.update(Vt(ie,me,{lane:Te,exit:rt,obstacles:R,branch:O},L.cable,dt))}for(const L of Fe){if(L.restPosition){const O=Math.min((v-L.restTime)/1e3,.05);L.restTime=v;const z=L.plug.position.distanceTo(L.restPosition);L.plug.position.lerp(L.restPosition,z?Math.min(1,.4*O/z):1),z<1e-4&&delete L.restPosition,x.shadowMap.needsUpdate=!0}const F=De(L.from,L.resource);if(!F){L.cable.group.visible=L.plug.visible=!1;continue}L.points=dc(L.reference,F,L.plug.position),L.cable.update(L.points)}}const Ze=new hn;Ze.setAttribute("position",new Jn(new Float32Array(48),3));const Ut=new tl(Ze,new Um({color:"#e9df9a",dashSize:.035,gapSize:.025,depthTest:!1}));Ut.visible=!1,Ut.renderOrder=8,oe.add(Ut);let _t=null;const Cn=new Li(new D(0,1,0),-.88072);function bi(){for(const[R,L]of pe){const F=R===j.selectedTerminal;for(const O of L.sockets){const z=(V==null?void 0:V.kind)==="terminal"&&V.id===R&&(V.socket??0)===O.socket;O.ring.visible=F||z,O.ring.material.color.set(F?"#f4d973":"#e6eef5"),O.ring.scale.setScalar(F?1.27:1.12)}}for(const[R,L]of et)L.outline&&(L.outline.visible=j.selectedPart===R||(V==null?void 0:V.kind)==="part"&&V.id===R);for(const R of T){const L=R.userData;L.wire.material.color.set((V==null?void 0:V.kind)==="wire"&&V.id===String(L.index)&&j.tool==="remove"?"#d57937":L.color)}const v=pe.get(j.selectedTerminal);if(Ut.visible=!!v&&(j.tool||"wire")==="wire",v){const R=(V==null?void 0:V.kind)==="terminal"?pe.get(V.id):null,L=R?new D(R.x,1.013,R.z):_t?oe.worldToLocal(_t.clone()):new D(v.x+.16,1.013,v.z+.16);L.y=Math.max(.988,Math.min(1.1,L.y));const F=new D(v.x,1.013,v.z),O=F.clone().lerp(L,.5);O.y+=.075;const z=new Ll(F,O,L),ne=Ze.attributes.position;for(let ie=0;ie<16;ie++){const me=z.getPoint(ie/15);ne.setXYZ(ie,me.x,me.y,me.z)}ne.needsUpdate=!0,Ze.computeBoundingSphere(),Ut.computeLineDistances()}}const Xt=new Qt;Xt.visible=!1,m.add(Xt);function Mi(v,R,L,F,O=0){const z=new Qt;z.position.set(R,L,F),z.rotation.y=O,Xt.add(z);const ne=K($e(v.object.geometry.parameters.width+.045,v.object.geometry.parameters.height+.045,.042,.02),N.navy,z,0,0,-.026);return ne.castShadow=!1,ne.receiveShadow=!1,v.object.castShadow=!1,v.object.receiveShadow=!1,z.add(v.object),z}const Rt=Be(1024,1200,.9,1.055),an=Be(840,1280,.68,1.036),nn=Be(1600,1008,1.3,.819),pn=Mi(Rt,0,1.72,-1.8),xn=Mi(an,1.24,1.62,-1.02,-.88),Dr=Mi(nn,-.94,1.7,-.62,.99),ei=[],pa=[];let Hi=0;const ao={object:nn.object,kind:"screen",id:"large-graph",label:"Graph cursor",bounds:[]};function Xd(v,R,L){const{context:F,canvas:O}=v;return F.fillStyle="#eff0ed",F.fillRect(0,0,O.width,O.height),F.fillStyle="#495a66",F.font="600 30px Arial, sans-serif",F.fillText(R,48,57),F.fillStyle="#193743",F.font="600 52px Arial, sans-serif",Ke(F,L,48,119,O.width-96),F}function co(){const v=Xd(Rt,"LAB GUIDE","Experiments");ei.length=0;const R=(z,ne,ie,me,Te,rt)=>{v.fillStyle="#fff",v.fillRect(z,ne,ie,me),v.strokeStyle="#a0aaa8",v.strokeRect(z,ne,ie,me),v.fillStyle="#273b42",v.font="600 40px Arial",v.textAlign="center",Ke(v,Te,z+ie/2,ne+me/2+10,ie-20),v.textAlign="left",ei.push({x:z,y:ne,w:ie,h:me,action:rt})};(j.actions||[]).filter(z=>String(z.group).toLowerCase()==="labs").forEach((z,ne)=>R(42,148+ne*78,940,65,z.label,()=>i(z.id))),(j.actions||[]).filter(z=>String(z.group).toLowerCase()==="guide"||["undo","check-wiring"].includes(z.id)).slice(0,4).forEach((z,ne)=>R(42+ne%2*478,480+Math.floor(ne/2)*77,462,64,z.label,()=>i(z.id))),v.fillStyle="#273b42",v.font="40px Arial",(x.xr.isPresenting?["Grip: pick up probes and plugs.","Release at a terminal to connect.","Trigger: turn knobs or use switches.","Left stick: move. Right stick: turn.","Stick click: recenter at the bench."]:["Drag probes onto terminals.","Drag between terminals to wire.","Pull a plug out to disconnect it.","Drag knobs. Click switches.","Drag empty space to look around."]).forEach((z,ne)=>v.fillText(z,48,692+ne*55)),R(42,1010,458,64,"Recenter",()=>Ta()),R(520,1010,462,64,x.xr.isPresenting?"Exit VR":"Close guide",()=>x.xr.isPresenting?void ho.exit():xa(!1)),Rt.texture.needsUpdate=!0}Rt.object.userData={kind:"panel",activate:v=>{var F;const R=v.uv.x*Rt.canvas.width,L=(1-v.uv.y)*Rt.canvas.height;(F=ei.find(O=>R>=O.x&&R<=O.x+O.w&&L>=O.y&&L<=O.y+O.h))==null||F.action()}};function ma(v){if(!Number.isFinite(Number(v))||v===null||v==="")return String(v??"—");const R=Number(v);return R!==0&&(Math.abs(R)>=1e5||Math.abs(R)<1e-4)?R.toExponential(2):Number(R.toPrecision(4)).toString()}function Yd(){var ne,ie,me;const v=an.context,R=an.canvas.width;v.fillStyle="#f9faf6",v.fillRect(0,0,R,1280),v.textAlign="left",v.textBaseline="alphabetic",v.fillStyle="#14211f",v.font="700 62px Arial",v.fillText("Live readings",48,88),v.fillStyle="#45524e",v.font="38px Arial";const L={thevenin:"Load circuit",superposition:"Selected sources",opamp:"Amplifier",transient:`${((ne=j.parameters)==null?void 0:ne.kind)||"RC"} circuit`};v.fillText(L[j.module]||"Circuit bench",48,139);const F=(j.metrics||[]).slice(0,3),O={Voltmeter:"Meter voltage","Voltage sample":"Voltage at input peak","Linear gain":"Gain"};F.forEach((Te,rt)=>{const dt=180+rt*271;v.strokeStyle="#bdc8c2",v.lineWidth=2,v.beginPath(),v.moveTo(48,dt-16),v.lineTo(R-48,dt-16),v.stroke(),v.fillStyle="#34433e",v.font="600 47px Arial",Ke(v,O[Te.label]||Te.label,48,dt+42,R-96);const ut=ma(Te.value),We=Te.unit||"";v.fillStyle="#101c18",v.font="700 142px Arial";const we=R-206;let je=142;for(;v.measureText(ut).width>we&&je>86;)je-=4,v.font=`700 ${je}px Arial`;v.fillText(ut,48,dt+185);const qe=v.measureText(ut).width;v.font="600 54px Arial",v.fillText(We,Math.min(R-151,48+qe+22),dt+182),v.fillStyle="#4b5852",v.font="34px Arial";const Ue=Te.label==="Voltmeter"||Te.label==="Voltage sample"?Te.value==="—"?Te.detail||"Place both probes":"V tip − COM tip":Te.label==="Branch current"||Te.label==="Storage current"?"Current: top → ground":Te.label==="Load power"?"From load voltage × current":Te.label==="Linear gain"?"Output / input, before clipping":"";Ke(v,Ue,48,dt+238,R-96)});const z=j.measurement||{};z.ok===!1?(v.fillStyle="#f4e6d6",v.fillRect(28,1012,R-56,236),v.fillStyle="#6b341b",v.font="700 43px Arial",v.fillText("Check connections",48,1066),v.font="37px Arial",Nt(v,z.error||"Complete the circuit to take a reading.",48,1121,R-96,47,3)):j.module==="transient"?(v.fillStyle="#243b32",v.font="600 44px Arial",v.fillText((ie=j.parameters)!=null&&ie.playing?"Running":"Paused",48,1076),v.font="700 75px Arial",v.fillText(`${ma((((me=j.parameters)==null?void 0:me.time)||0)*1e3)} ms`,48,1172,R-96),v.font="34px Arial",v.fillText("Elapsed circuit time",48,1226)):j.module==="opamp"&&z.clipped?(v.fillStyle="#f4e6d6",v.fillRect(28,1035,R-56,128),v.fillStyle="#6b341b",v.font="700 48px Arial",v.fillText("Output is clipping",48,1117)):(v.fillStyle="#46564c",v.font="37px Arial",v.fillText("Readings follow the circuit.",48,1096)),an.texture.needsUpdate=!0}an.object.userData={kind:"panel",activate:()=>!0};function jd(v,R){return{voltage:"Voltage",current:"Current",energy:"Energy",ch1:"CH1",ch2:"CH2"}[v.id]||v.title||`Graph ${R+1}`}function Gi(){var xt,Ft,qn;const v=nn.context,R=1600,L=1008,F=j.graph||{},O=(xt=F.panels)!=null&&xt.length?F.panels:[F];Hi=Math.max(0,Math.min(Hi,O.length-1));const z=O[Hi]||F;v.fillStyle="#fafbf8",v.fillRect(0,0,R,L),v.textAlign="left",v.textBaseline="alphabetic",pa.length=0,v.fillStyle="#172720",v.font="700 53px Arial";const ne=ve==="schematic"?"Circuit schematic":{thevenin:"Load power",superposition:"Source contributions",opamp:"Oscilloscope",transient:`${((Ft=j.parameters)==null?void 0:Ft.kind)||"RC"} response`}[j.module]||"Circuit graph";v.fillText(ne,48,89);const ie=(He,nt,yt,rn,hr,tf,su=!1)=>{v.fillStyle=su?"#263e34":"#e4ebe5",v.fillRect(He,nt,yt,rn),v.fillStyle=su?"#fff":"#22392c",v.font="600 39px Arial",v.textAlign="center",Ke(v,hr,He+yt/2,nt+rn/2+14,yt-24),v.textAlign="left",pa.push({x:He,y:nt,w:yt,h:rn,action:tf})};if(ie(1110,35,180,68,"Graph",()=>{ve="graph",Gi()},ve==="graph"),ie(1310,35,242,68,"Schematic",()=>{ve="schematic",Gi()},ve==="schematic"),ve==="schematic"){if(ao.bounds=[],ke){const He={x:30,y:135,w:1540,h:840},nt=Math.min(He.w/ke.width,He.h/ke.height),yt=ke.width*nt,rn=ke.height*nt;v.drawImage(ke,He.x+(He.w-yt)/2,He.y+(He.h-rn)/2,yt,rn)}else v.fillStyle="#44564a",v.font="46px Arial",v.fillText("Circuit reference is loading.",48,246);nn.texture.needsUpdate=!0;return}if(O.length>1){const He=(1504-14*(O.length-1))/O.length;O.forEach((nt,yt)=>ie(48+yt*(He+14),141,He,70,jd(nt,yt),()=>{var rn;Hi=yt,(rn=Ie.selectPanel)==null||rn.call(Ie,yt),Gi()},yt===Hi))}else v.fillStyle="#43544a",v.font="39px Arial",Ke(v,F.subtitle||"Current circuit values",48,185,R-96);const me=182,Te=1534,rt=280,dt=720,ut=He=>me+He*(Te-me),We=He=>dt-He*(dt-rt);ao.bounds=[{left:me/R,top:rt/L,width:(Te-me)/R,height:(dt-rt)/L,panel:Hi}],v.fillStyle="#263b2e",v.font="600 43px Arial",Ke(v,z.yLabel||"Response",me,256,Te-me);const we=z.xDivisions||F.xDivisions||4,je=z.yDivisions||F.yDivisions||4;v.strokeStyle="#c9d3cc",v.lineWidth=1.8;for(let He=0;He<=we;He++){const nt=ut(He/we);v.beginPath(),v.moveTo(nt,rt),v.lineTo(nt,dt),v.stroke()}for(let He=0;He<=je;He++){const nt=We(He/je);v.beginPath(),v.moveTo(me,nt),v.lineTo(Te,nt),v.stroke()}v.strokeStyle="#607166",v.lineWidth=2.5,v.strokeRect(me,rt,Te-me,dt-rt),v.save(),v.beginPath(),v.rect(me-3,rt-3,Te-me+6,dt-rt+6),v.clip();const qe=z.series||[];for(const He of qe){v.strokeStyle=He.color||"#147587",v.lineWidth=6,v.lineJoin="round",v.lineCap="round",v.beginPath();let nt=!1;for(const[yt,rn]of He.points||[]){if(!Number.isFinite(yt)||!Number.isFinite(rn)){nt=!1;continue}nt?v.lineTo(ut(yt),We(rn)):v.moveTo(ut(yt),We(rn)),nt=!0}v.stroke(),((qn=He.points)==null?void 0:qn.length)===1&&(v.beginPath(),v.arc(ut(He.points[0][0]),We(He.points[0][1]),6,0,Math.PI*2),v.fillStyle=He.color||"#147587",v.fill())}if(z.reference&&Number.isFinite(z.reference.x)){const He=ut(z.reference.x);v.strokeStyle="#805528",v.lineWidth=3,v.setLineDash([12,9]),v.beginPath(),v.moveTo(He,rt),v.lineTo(He,dt),v.stroke(),v.setLineDash([]),v.fillStyle="#654117",v.font="600 37px Arial",v.fillText(z.reference.label||"",Math.max(me+10,Math.min(He+14,Te-105)),rt+47)}const Ue=z.cursor||F.cursor;if(Ue&&Number.isFinite(Ue.x)){const He=ut(Ue.x);v.strokeStyle="#263e34",v.lineWidth=3,v.setLineDash([8,7]),v.beginPath(),v.moveTo(He,rt),v.lineTo(He,dt),v.stroke(),v.setLineDash([])}z.marker&&Number.isFinite(z.marker.x)&&Number.isFinite(z.marker.y)&&(v.beginPath(),v.arc(ut(z.marker.x),We(z.marker.y),9,0,Math.PI*2),v.fillStyle="#fff",v.fill(),v.lineWidth=5,v.strokeStyle="#83432b",v.stroke()),v.restore(),v.fillStyle="#283d31",v.font="600 40px Arial";const ft=He=>{const nt=(He||[]).filter(rn=>Number.isFinite(rn.position));if(nt.length<=3)return nt;const yt=nt.reduce((rn,hr)=>Math.abs(hr.position-.5)<Math.abs(rn.position-.5)?hr:rn,nt[0]);return[...new Set([nt[0],yt,nt.at(-1)])]},Ot=ft(z.xTicks);v.textAlign="center",Ot.forEach((He,nt)=>{Ot.length>6&&nt!==0&&nt!==Ot.length-1&&nt%2||Ke(v,String(He.label),ut(He.position),772,Math.min(260,(Te-me)/Math.max(3,Ot.length-1)))}),v.textAlign="right";const Lt=ft(z.yTicks);Lt.forEach((He,nt)=>{Lt.length>5&&nt!==0&&nt!==Lt.length-1&&nt%2||Ke(v,String(He.label),me-20,We(He.position)+13,149)}),v.textAlign="center",v.font="600 42px Arial",Ke(v,z.xLabel||F.xLabel||"Time",(me+Te)/2,827,Te-me),v.textAlign="left",v.fillStyle="#e5ede6",v.fillRect(30,862,1540,120);const Jt=new Set(qe.map(He=>He.name).filter(Boolean)),cn=((Ue==null?void 0:Ue.readings)||[]).filter(He=>!Jt.size||Jt.has(He.name));if(Ue&&(Ue.xLabel||cn.length)){const He=[{label:"Cursor",value:Ue.xLabel||"—"},...cn.map(yt=>({label:yt.name,value:`${ma(yt.value)} ${yt.unit||""}`}))],nt=1500/Math.max(1,He.length);He.forEach((yt,rn)=>{const hr=50+rn*nt;v.fillStyle="#3f5447",v.font="32px Arial",Ke(v,yt.label,hr,904,nt-22),v.fillStyle="#13271b",v.font="700 53px Arial",Ke(v,yt.value,hr,963,nt-22)})}else{v.fillStyle="#2b4234",v.font="600 43px Arial";const He=!qe.some(nt=>{var yt;return(yt=nt.points)==null?void 0:yt.length});Ke(v,He?z.subtitle||F.subtitle||"Connect the circuit to acquire a trace.":"Point at the graph and hold the trigger to inspect a reading.",52,936,1496)}nn.texture.needsUpdate=!0}nn.object.userData={kind:"panel",direct:ao,activate:v=>{const R=v.uv.x*1600,L=(1-v.uv.y)*1008,F=pa.find(z=>R>=z.x&&R<=z.x+z.w&&L>=z.y&&L<=z.y+z.h);if(F)return F.action(),!0;const O=ao.bounds[0];return ve!=="graph"||!O||R<O.left*1600||R>(O.left+O.width)*1600||L<O.top*1008||L>(O.top+O.height)*1008}};function Zd(v,R){var rt,dt;const L=Ah({color:v.color||"#862926",radius:.00324}),F=new Qt;K(new ht(.009,.011,.038,20),W(v.color||"#862926"),F,0,.015,0),K(new ht(.003,.003,.013,16),N.metal,F,0,-.009,0);const O=K(new Pi(.023,12,8),new jn({transparent:!0,opacity:0,depthWrite:!1}),F,0,.013,0);F.position.copy(R);const z={from:v.from||v.terminal,cable:L,plug:F,originalPair:((rt=v.wirePair)==null?void 0:rt.slice())||null},ne=`loose:${Math.random().toString(36).slice(2)}`;z.resource=z.originalPair?Ls(...z.originalPair,z.from):ne,Fe.add(z),!z.originalPair&&((dt=pe.get(z.from))!=null&&dt.common)&&Me.prefer(z.from,z.resource,v.socket,Ae(z.from));const ie=v.wirePair&&Bi.get([...v.wirePair].sort().join("|")),me=De(z.from,z.resource);z.reference=ie?Vi(ie.a===z.from?ie.points:[...ie.points].reverse()):P([me||R,R]),z.points=dc(z.reference,me||R,R),L.update(z.points);const Te={object:O,kind:"plug",id:ne,from:z.from,label:"Grab loose plug",lead:z,color:v.color};return O.userData.direct=Te,z.target=Te,m.add(F,L.group),z}function xs(v){v&&(Fe.delete(v),v.cable.dispose(),Mt(v.plug),v.plug.removeFromParent())}const Gt=Bx({getModel:()=>{var v;return{...j,parameters:{...j.parameters,meterMode:Ve,timeCursor:(v=j.parameters)==null?void 0:v.time}}},getTerminals:ze,onProbe:u,onBeforeConnect:(v,R,L)=>{var ne,ie;const F=L.lead;if(!F)return;F.plug.position.copy(L.position),wt();const O=[v,R.id],z=[...O].sort().join("|");j.wires.some(me=>me.includes(v)&&me.includes(R.id))||((ne=pe.get(v))!=null&&ne.common&&Me.transfer(v,F.resource,Ls(...O,v),Ae(v)),F.originalPair=O,F.resource=Ls(...O,v),(ie=pe.get(R.id))!=null&&ie.common&&Me.prefer(R.id,Ls(...O,R.id),R.socket,Ae(R.id)),cr.set(z,{from:v,points:Vi(F.points)}),L.pendingPair=z)},onConnect:h,onDisconnect:d,onGraphCursor:g,onChange:(v,R)=>{var L;v==="meterMode"?(Ve=R,Je.update({...j,meterMode:Ve}),l(v,R)):v==="timeCursor"?i(`scrub:${Math.min(R,((L=j.parameters)==null?void 0:L.acquiredTime)||0)*1e3}`):l(v,R)},onAction:v=>{var R;if(String(v).startsWith("recorder-panel:")){const L=Number(String(v).split(":")[1]);Number.isInteger(L)&&L>=0&&((R=Ie.selectPanel)==null||R.call(Ie,L),Hi=L,Gi())}else i(v)},onHold:(v,R,L)=>{var O,z,ne;const F=R.target;if(v==="start")if(["probe","plug","terminal"].includes(F.kind)&&_("begin",R),F.kind==="probe"){const ie=re.get(F.channel);ie&&(delete ie.restPose,ie.loose=!0,R.probe=ie,R.position=ie.unit.group.position.clone())}else(F.kind==="terminal"||F.kind==="plug")&&(R.lead=F.lead||Zd(F,R.position||De(F.terminal)),delete R.lead.restPosition,R.lead.reference=Vi(R.lead.points));if(v==="move"&&(R.probe&&R.position&&(R.probe.unit.group.position.copy(R.position),R.quaternion?R.probe.unit.group.quaternion.copy(R.quaternion):R.probe.unit.group.rotation.set(-.25,0,.18)),R.lead&&R.position&&R.lead.plug.position.copy(R.position),x.shadowMap.needsUpdate=!0),v==="end"){if(R.probe){const ie=R.probe;ie.connected=L.terminal;const me=`probe:${ie.channel}`;if((O=pe.get(L.terminal))!=null&&O.common&&R.position){const rt=jo(R.position,ze().filter(dt=>dt.id===L.terminal),.055);rt&&Me.prefer(L.terminal,me,rt.socket,Ae(L.terminal))}const Te=De(L.terminal,me);Te?(ie.unit.group.position.copy(Te),ie.unit.group.rotation.set(-.24,0,.25),ie.loose=!1):(ie.restPose={position:new D(yn.clamp(((z=R.position)==null?void 0:z.x)??ie.home.x,-.88,.88),.87,yn.clamp(((ne=R.position)==null?void 0:ne.z)??ie.home.z,-1.2,-.34)),quaternion:new gn().setFromEuler(new Vn(-Math.PI/2,0,0)),time:performance.now()},ie.loose=!0)}R.pendingPair&&cr.delete(R.pendingPair),R.lead&&(L.kind==="connected"||L.kind==="cancelled"||F.kind==="terminal"?xs(R.lead):(R.lead.restPosition=new D(yn.clamp(R.lead.plug.position.x,-.58,.58),.87,yn.clamp(R.lead.plug.position.z,-1.1,-.41)),R.lead.restTime=performance.now())),["probe","plug","terminal"].includes(F.kind)&&_("end",R),x.shadowMap.needsUpdate=!0}}});function Vl(v){var ie,me,Te,rt,dt,ut,We,we;v.module&&v.module!==j.module&&(Hi=0),(ie=v.live)!=null&&ie.title&&(v.live.title,(me=j.live)==null||me.title),v.selectedPart&&(v.selectedPart,j.selectedPart),j={...j,...v};const R=JSON.stringify(j.components.map(({value:je,...qe})=>qe));let L=!1;if(R!==Le){Le=R,Gt.cancelAll();for(const je of[...Fe])xs(je);zi=null,ar++,so++,_s=new Map,Bi=new Map,cr.clear();for(const je of re.values())delete je.restPose;Lr(j.components),L=!0,x.shadowMap.needsUpdate=!0}for(const je of j.components){const qe=et.get(je.id);qe&&qe.value!==je.value&&(qe.draw(je.label,je.value),qe.value=je.value,(Te=qe.updateHardware)==null||Te.call(qe,je.value),qe.hit&&(qe.hit.userData.label=`${hi(je)} · ${je.value}`),x.shadowMap.needsUpdate=!0)}const F=JSON.stringify(j.wires);(L||F!==tt)&&(tt=F,_e(j.wires),x.shadowMap.needsUpdate=!0),bi(),qt(L);const O=JSON.stringify([j.module,j.metrics,(rt=j.measurement)==null?void 0:rt.ok,(dt=j.measurement)==null?void 0:dt.error,(ut=j.measurement)==null?void 0:ut.clipped,(We=j.parameters)==null?void 0:We.time,(we=j.parameters)==null?void 0:we.playing]);O!==Ye&&(Ye=O,Yd());const z=JSON.stringify([j.actions,j.tool,j.selectedTerminal,j.selectedPart,j.partActions]);z!==Ce&&(Ce=z,co());const ne=JSON.stringify(j.graph);if(ne!==lt&&(lt=ne,Gi()),j.schematicDataURL!==void 0&&j.schematicDataURL!==ue){ue=j.schematicDataURL,ke=null;const je=++ot;if(/^data:image\/(svg\+xml|png|jpeg|webp)[;,]/.test(ue||"")){const qe=new Image;qe.onload=()=>{!bt&&je===ot&&(ke=qe,Gi())},qe.onerror=()=>{!bt&&je===ot&&Gi()},qe.src=ue}Gi()}}const lr=new zm,Hl=new ye;let bn=null;function Gl(v){for(let R=v;R;R=R.parent)if(!R.visible)return!1;return!0}function lo(v){for(let R=v;R;R=R.parent){const L=R.userData.direct||R.userData.equipmentTarget;if(L)return L}return null}function Wl(){const v=[...de,...ee,st].filter(Boolean).map(F=>F.group),R=[...re.values()].map(F=>F.unit.group),L=[...Fe].map(F=>F.plug);return[...it,...I,...T,...Z,...v,...R,...L,...Xt.visible?[Rt.object,an.object,nn.object]:[]]}function uo(){const v=lr.intersectObjects(Wl(),!0).filter(F=>Gl(F.object)&&(lo(F.object)||F.object.userData.kind));for(const F of v)F.direct=lo(F.object);const R=v[0];return v.find(F=>{var O;return["probe","plug","dial","button","screen","switch"].includes((O=F.direct)==null?void 0:O.kind)&&F.distance<((R==null?void 0:R.distance)??1/0)+.065})||R}function ur(v,R=null){var z;const L=(v==null?void 0:v.direct)||(v==null?void 0:v.object.userData),F=L&&["terminal","part","wire","probe","plug","dial","button","switch","screen"].includes(L.kind)?{kind:L.kind,id:L.id??String(L.index),label:L.label||L.id,socket:L.socket}:null,O=JSON.stringify([F,j.tool,j.selectedTerminal]);V=F,_t=((z=v==null?void 0:v.point)==null?void 0:z.clone())||(R==null?void 0:R.clone())||null,O!==xe&&(xe=O,s(x.xr.isPresenting?null:F)),bi()}function ga(v){const R=x.domElement.getBoundingClientRect();Hl.set((v.clientX-R.left)/R.width*2-1,-(v.clientY-R.top)/R.height*2+1),lr.setFromCamera(Hl,p)}function va(v,R){if(!(v!=null&&v.uv))return{};const L=v.uv.x,F=1-v.uv.y,O=R.bounds||[];let z=O.find(ne=>F>=ne.top&&F<=ne.top+ne.height);return z||(z=O[0]||{left:0,width:1,panel:0}),{fraction:yn.clamp((L-z.left)/z.width,0,1),panelIndex:z.panel||0}}function _a(){return lr.ray.intersectPlane(Cn,new D)}function $l(v,R,L={}){var z,ne,ie,me;if(!R||R.object.userData.kind==="panel"&&R.object.userData.activate(R)!==!1)return!1;const F=R.direct||lo(R.object);if(!F||F.kind==="probe"&&!((z=re.get(F.channel))!=null&&z.unit.group.visible))return!1;F.kind==="dial"&&(F.resource=`parameter:${F.parameter}`),F.kind==="plug"&&F.wirePair&&(F.wireIndex=j.wires.findIndex(Te=>Te.includes(F.wirePair[0])&&Te.includes(F.wirePair[1]))),F.parameter==="timeCursor"&&(F.max=((ne=j.parameters)==null?void 0:ne.acquiredTime)||0,F.min=0,F.step=Math.max(F.max/100,1e-6));const O=F.kind==="probe"?(ie=re.get(F.channel))==null?void 0:ie.unit.group.position:F.kind==="terminal"?(me=ze().find(Te=>Te.id===F.terminal&&Te.socket===(F.socket??0)))==null?void 0:me.position:R.point;return Gt.begin(v,F,{position:O,...va(R,F),...L})}function ql(v){if(v.button!==0||x.xr.isPresenting)return;Gt.release("mouse"),ga(v);const R=uo();bn={x:v.clientX,y:v.clientY,lastX:v.clientX,lastY:v.clientY,time:performance.now(),hit:R},(R!=null&&R.direct||(R==null?void 0:R.object.userData.kind)==="panel")&&(b.enabled=!1,x.domElement.setPointerCapture(v.pointerId),$l("mouse",R),v.stopImmediatePropagation(),v.preventDefault())}function Xl(v){var F,O;if(x.xr.isPresenting)return;ga(v);const R=Gt.hold("mouse"),L=uo();if(R){const z={position:_a()};if(R.target.kind==="dial"&&(z.turn=(v.clientX-bn.lastX-(v.clientY-bn.lastY))*.024),R.target.kind==="screen"){const me=lr.intersectObject(R.target.object,!0)[0];Object.assign(z,va(me,R.target))}Gt.move("mouse",z),bn&&(bn.lastX=v.clientX,bn.lastY=v.clientY);const ne=["probe","terminal","plug"].includes(R.target.kind)?jo(R.position,ze(),.055):null,ie=ne?{object:ne.hit,direct:ne.hit.userData.direct,point:ne.position}:L;ur(ie,z.position),wt()}else bn||(x.domElement.style.cursor=((F=L==null?void 0:L.direct)==null?void 0:F.kind)==="dial"?"ns-resize":((O=L==null?void 0:L.direct)==null?void 0:O.kind)==="screen"?"crosshair":"grab",ur(L,_a()))}function Yl(v){var R;if(!bn){Gt.release("mouse");return}ga(v),Gt.hold("mouse")?Gt.end("mouse",{position:_a()}):Math.hypot(v.clientX-bn.x,v.clientY-bn.y)<5&&((R=bn.hit)==null?void 0:R.object.userData.kind)==="part"&&r(bn.hit.object.userData.id),bn=null,Gt.release("mouse"),b.enabled=!0,x.domElement.hasPointerCapture(v.pointerId)&&x.domElement.releasePointerCapture(v.pointerId),wt()}function jl(){Gt.hold("mouse")&&Gt.block("mouse"),bn=null,b.enabled=!x.xr.isPresenting,ur(null)}const Zl=()=>{bn||ur(null)};x.domElement.addEventListener("pointerdown",ql,!0),x.domElement.addEventListener("pointermove",Xl),x.domElement.addEventListener("pointerup",Yl),x.domElement.addEventListener("pointercancel",jl),x.domElement.addEventListener("pointerleave",Zl);function Kl(){Xt.updateWorldMatrix(!0,!0);const v=new ir().setFromObject(Xt),R=v.getCenter(new D),L=[];for(const z of[v.min.x,v.max.x])for(const ne of[v.min.y,v.max.y])for(const ie of[v.min.z,v.max.z])L.push(new D(z,ne,ie));const F=new D(0,.12,1).normalize();let O=4;for(let z=0;z<9;z++){p.position.copy(R).addScaledVector(F,O),p.lookAt(R),p.updateMatrixWorld();const ne=L.map(ut=>ut.clone().project(p)),ie=Math.min(...ne.map(ut=>ut.x)),me=Math.max(...ne.map(ut=>ut.x)),Te=Math.min(...ne.map(ut=>ut.y)),rt=Math.max(...ne.map(ut=>ut.y)),dt=O*Math.tan(yn.degToRad(p.fov/2));R.addScaledVector(new D().setFromMatrixColumn(p.matrixWorld,0),(ie+me)*.5*dt*p.aspect),R.addScaledVector(new D().setFromMatrixColumn(p.matrixWorld,1),(Te+rt)*.5*dt),O=Math.max(b.minDistance,O*Math.max(.75,Math.min(1.35,Math.max((me-ie)/1.78,(rt-Te)/1.78))))}b.target.copy(R),p.position.copy(R).addScaledVector(F,O),p.lookAt(R),b.update()}function xa(v){if(x.xr.isPresenting||bt)return;v=!!v;const R=v!==Se;v&&!Se&&(Ne={position:p.position.clone(),quaternion:p.quaternion.clone(),target:b.target.clone()}),Se=v,Xt.visible=v,x.shadowMap.needsUpdate=!0,v?(wa(1.6),Kl()):Ne&&(p.position.copy(Ne.position),p.quaternion.copy(Ne.quaternion),b.target.copy(Ne.target),b.update(),Ne=null),ur(null),co(),R&&o(v)}const Ir=[],Jl=new $t,Ql=Gx({obstacles:[{minX:-1.07,maxX:1.07,minZ:-1.7,maxZ:-.27},{minX:.55,maxX:1.22,minZ:-.46,maxZ:.25},{minX:-1.22,maxX:-.55,minZ:-.46,maxZ:.25}],bounds:{minX:-3.1,maxX:3.1,minZ:-4.6,maxZ:2.4}});let ti=!1,ya=0,Pn=null;function Si(){Gt.cancelAll(),Ql.reset(),bn=null;for(const v of Ir)v.armed=!1,v.lastQuaternion=null,v.stickPressed=!1;b.enabled=!x.xr.isPresenting}function ys(){ti=document.visibilityState==="hidden"||!!(Pn!=null&&Pn.visibilityState)&&Pn.visibilityState!=="visible",Si()}const eu=()=>{x.xr.isPresenting||(ti=!0,Si())},tu=()=>{x.xr.isPresenting||(ti=!1,Si())};window.addEventListener("blur",eu),window.addEventListener("focus",tu),document.addEventListener("visibilitychange",ys);function ba(v){v.controller.updateWorldMatrix(!0,!1),Jl.extractRotation(v.controller.matrixWorld),lr.ray.origin.setFromMatrixPosition(v.controller.matrixWorld),lr.ray.direction.set(0,0,-1).applyMatrix4(Jl)}function Ma(v,R){const L=v.grip.getWorldQuaternion(new gn),F=v.grip.getWorldPosition(new D),O=new D(0,0,-1).applyQuaternion(L),z=L.clone().multiply(new gn().setFromAxisAngle(new D(1,0,0),Math.PI/2)),ne=R!=null&&R.probe?zx(F,L,R.probePickupQuaternion,R.probe.unit.length):{position:F.addScaledVector(O,.08),quaternion:z};if((R==null?void 0:R.target.kind)==="dial"){const ie=new D(...R.target.axis==="y"?[0,1,0]:R.target.axis==="x"?[1,0,0]:[0,0,1]).applyQuaternion(R.target.object.getWorldQuaternion(new gn));ne.turn=v.lastQuaternion?-kx(L.clone().multiply(v.lastQuaternion.clone().invert()),ie):0}return(R==null?void 0:R.target.kind)==="screen"&&(ba(v),Object.assign(ne,va(lr.intersectObject(R.target.object,!0)[0],R.target))),v.lastQuaternion=L,ne}function nu(v,R){if(!v.armed||ti||!x.xr.isPresenting||Gt.hold(v.id))return;ba(v);let L=uo();if(R==="grip"){const F=v.grip.getWorldPosition(new D),O=Wl().flatMap(z=>{const ne=[];return z.traverse(ie=>{const me=lo(ie);me&&["probe","plug","dial","terminal","button","switch"].includes(me.kind)&&Gl(ie)&&ne.push({node:ie,target:me,point:ie.getWorldPosition(new D)})}),ne}).sort((z,ne)=>z.point.distanceTo(F)-ne.point.distanceTo(F));if(!O.length||O[0].point.distanceTo(F)>.12)return;L={object:O[0].node,direct:O[0].target,point:O[0].point}}if(v.button=R,v.lastQuaternion=v.grip.getWorldQuaternion(new gn),$l(v.id,L)){const F=Gt.hold(v.id);F!=null&&F.probe&&(F.probePickupQuaternion=v.lastQuaternion.clone()),F&&["probe","plug","terminal"].includes(F.target.kind)&&Gt.move(v.id,Ma(v,F))}}function iu(v,R){if(v.button===R){const L=Gt.hold(v.id);L&&Gt.end(v.id,Ma(v,L)),v.button=null,v.lastQuaternion=null}Gt.release(v.id)}for(let v=0;v<2;v++){const R=x.xr.getController(v),L=x.xr.getControllerGrip(v),F=new tl(new hn().setFromPoints([new D,new D(0,0,-1)]),new Qo({color:"#bbc8c8",transparent:!0,opacity:.55}));R.add(F),F.scale.z=2;const O=new Rn(new Pi(.007,12,8),new jn({color:"#d7c98b",depthTest:!1}));O.visible=!1,m.add(O);const z={id:`controller:${v}`,controller:R,grip:L,ray:F,cursor:O,source:null,armed:!1,button:null,stickPressed:!1,lastQuaternion:null};R.addEventListener("connected",ie=>{z.source=ie.data,z.armed=!1,R.visible=!0}),R.addEventListener("disconnected",()=>{Gt.block(z.id),z.source=null,z.armed=!1,R.visible=!1,O.visible=!1}),R.addEventListener("selectstart",()=>nu(z,"trigger")),R.addEventListener("selectend",()=>iu(z,"trigger")),R.addEventListener("squeezestart",()=>nu(z,"grip")),R.addEventListener("squeezeend",()=>iu(z,"grip"));const ne=K($e(.037,.075,.045,.013),N.navy,L,0,-.017,.015);ne.rotation.x=-.35,K(new Pi(.022,12,8),N.teal,L,0,.019,-.012),y.add(R,L),Ir.push(z)}let Sa=null,bs=!1,Ea=!0;function wa(v){const R=new D(0,v,0);Dr.position.set(-.94,Math.max(1.69,v+.04),-.62),xn.position.set(1.24,Math.max(1.61,v-.01),-1.02),pn.position.set(0,Math.max(1.66,v+.08),-1.8),Dr.lookAt(R),xn.lookAt(R),pn.lookAt(R)}function Ta(){return x.xr.isPresenting?(Si(),bs=!0,!0):!1}const ho=ey({xrManager:x.xr,navigatorXR:()=>navigator.xr,isSecureContext:()=>window.isSecureContext,visibilityTarget:document,onStatus:a,onBeforeSession:({floorReference:v})=>{Si(),Sa=ty(p,b),Ea=v,b.enabled=!1,y.position.set(0,v?0:1.6,0),y.quaternion.identity(),p.position.set(0,0,0),p.quaternion.identity()},onSessionStarted:({session:v})=>{Pn=v,ti=!1,Pn==null||Pn.addEventListener("visibilitychange",ys),Si(),at.visible=!1,Oe.visible=!0,Xt.visible=!0,s(null),bs=!0,x.shadowMap.needsUpdate=!0,co()},onSessionEnded:()=>{Si(),Pn==null||Pn.removeEventListener("visibilitychange",ys),Pn=null,ti=!1,bs=!1,at.visible=!1,Oe.visible=!0,Xt.visible=Se,ny(p,b,y,Sa),Sa=null;for(const v of Ir)v.cursor.visible=!1,v.stickPressed=!1;ur(null),wa(1.6),x.shadowMap.needsUpdate=!0,Aa(),co()}});function Kd(){return bt?Promise.resolve(!1):(Se&&xa(!1),ho.toggle())}function Jd(){return ho.refreshSupport()}function Aa(){if(x.xr.isPresenting||bt)return;const v=Math.max(1,n.clientWidth),R=Math.max(1,n.clientHeight);p.aspect=v/R,p.updateProjectionMatrix(),x.setSize(v,R,!1),Se?Kl():(!k||Math.abs(p.aspect/k-1)>.12)&&$()}const ru=new ResizeObserver(Aa);ru.observe(n),Aa(),Vl(j),x.setAnimationLoop(v=>{var R,L,F,O,z,ne,ie,me;if(!bt&&(c(v),!bt)){if(x.xr.isPresenting){if(bs){const Ue=x.xr.getFrame(),ft=x.xr.getReferenceSpace(),Ot=Ue&&ft?Ue.getViewerPose(ft):null;Ot&&iy(y,Ot,{floorReference:Ea,eyeHeight:1.6})&&(wa(Ea?Ot.transform.position.y:1.6),bs=!1)}const Te=x.xr.getCamera(),rt=Te.getWorldPosition(new D),dt=Te.getWorldQuaternion(new gn),ut=(L=(R=Ir.find(Ue=>{var ft;return((ft=Ue.source)==null?void 0:ft.handedness)==="left"}))==null?void 0:R.source)==null?void 0:L.gamepad,We=(O=(F=Ir.find(Ue=>{var ft;return((ft=Ue.source)==null?void 0:ft.handedness)==="right"}))==null?void 0:F.source)==null?void 0:O.gamepad,we=Ue=>{var ft,Ot,Lt;return((ft=Ue==null?void 0:Ue.axes)==null?void 0:ft.length)>=4?[Ue.axes[2],Ue.axes[3]]:[((Ot=Ue==null?void 0:Ue.axes)==null?void 0:Ot[0])||0,((Lt=Ue==null?void 0:Ue.axes)==null?void 0:Lt[1])||0]};Ql.update({rig:y,headPosition:rt,headQuaternion:dt,left:we(ut),right:we(We)[0],dt:ya?(v-ya)/1e3:0,enabled:!ti});let je=null,qe=null;for(const Ue of Ir){const ft=(z=Ue.source)==null?void 0:z.gamepad;!ti&&!Ue.armed&&ft&&!((ne=ft.buttons[0])!=null&&ne.pressed)&&!((ie=ft.buttons[1])!=null&&ie.pressed)&&(Ue.armed=!0,Gt.release(Ue.id));const Ot=Ue.armed&&!!((me=ft==null?void 0:ft.buttons[3])!=null&&me.pressed);Ot&&!Ue.stickPressed&&Ta(),Ue.stickPressed=Ot,ba(Ue);const Lt=!ti&&Ue.controller.visible?uo():null;Ue.ray.visible=!ti,Ue.ray.scale.z=Lt?Lt.distance:2;const Jt=Gt.hold(Ue.id);Jt&&!ti&&Gt.move(Ue.id,Ma(Ue,Jt));const cn=Jt&&["probe","terminal","plug"].includes(Jt.target.kind)?jo(Jt.position,ze(),.055):null;Ue.cursor.visible=!!Lt||!!cn,cn?(Ue.cursor.position.copy(cn.position),Ue.cursor.material.color.set("#88c39e")):Lt&&(Ue.cursor.position.copy(Lt.point),Ue.cursor.material.color.set("#d7c98b")),cn?(je={object:cn.hit,direct:cn.hit.userData.direct,point:cn.position},qe=cn.position):Lt&&!je&&(je=Lt,qe=Lt.point)}ur(je,qe)}else b.update();ya=v,wt(),x.render(m,p)}});function Qd(){Si(),bt=!0,Pn==null||Pn.removeEventListener("visibilitychange",ys),window.removeEventListener("blur",eu),window.removeEventListener("focus",tu),document.removeEventListener("visibilitychange",ys),ho.dispose(),x.setAnimationLoop(null),ru.disconnect(),b.dispose(),x.domElement.removeEventListener("pointerdown",ql,!0),x.domElement.removeEventListener("pointermove",Xl),x.domElement.removeEventListener("pointerup",Yl),x.domElement.removeEventListener("pointercancel",jl),x.domElement.removeEventListener("pointerleave",Zl);for(const v of re.values())v.pick.geometry.dispose(),v.pick.material.dispose(),v.unit.dispose(),v.cable.dispose();for(const v of Fe)xs(v);for(const v of[...de,...ee,st].filter(Boolean))v.dispose();Mt(m);for(const v of fe)v.dispose();x.dispose(),x.domElement.remove()}function ef(){Si();for(const v of[...Fe])xs(v)}return{cancelInteractions:ef,update:Vl,enterVR:Kd,refreshVRSupport:Jd,recenterVR:Ta,resetView:$,setPanelPreview:xa,dispose:Qd,renderer:x}}const ra="#182630",Zi=n=>String(n).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),On=n=>Number.isFinite(Number(n))?Number(Number(n).toPrecision(6)).toLocaleString("en-US",{maximumFractionDigits:6}):"—",Ih=n=>Math.abs(n)>=1e3?`${On(n/1e3)} kΩ`:`${On(n)} Ω`,uy=n=>n>=.001?`${On(n*1e3)} mF`:n>=1e-6?`${On(n*1e6)} μF`:`${On(n*1e9)} nF`,hy=n=>n>=1?`${On(n)} H`:`${On(n*1e3)} mH`;function dy(){const n=[],e=(h,d="")=>n.push(`<path d="${h.map(([f,g],_)=>`${_?"L":"M"} ${f} ${g}`).join(" ")}" ${d}/>`),t=(h,d,f,g)=>e([[h,d],[f,g]]),i=(h,d,f,g="middle",_=18)=>n.push(`<text x="${h}" y="${d}" text-anchor="${g}" font-size="${_}">${Zi(f)}</text>`),r=(h,d)=>n.push(`<circle cx="${h}" cy="${d}" r="4" fill="${ra}" stroke="none"/>`),s=(h,d)=>n.push(`<circle cx="${h}" cy="${d}" r="4" fill="white"/>`),o=(h,d,f)=>n.push(`<circle data-pin="${Zi(h)}" cx="${d}" cy="${f}" r="7" fill="transparent" stroke="none"><title>${Zi(h)}</title></circle>`);return{elements:n,path:e,line:t,text:i,dot:r,contact:s,pins:h=>Object.entries(h).forEach(([d,[f,g]])=>o(d,f,g)),pin:o,ground:(h,d)=>{n.push('<g data-symbol="ground">'),t(h,d,h,d+12),t(h-15,d+12,h+15,d+12),t(h-10,d+18,h+10,d+18),t(h-4,d+24,h+4,d+24),n.push("</g>")},resistor:(h,d,f,g,_,m,p)=>{n.push(`<g data-component="${Zi(h)}" data-symbol="resistor">`);const x=d===g,b=x?(f+_)/2:(d+g)/2,y=x?[[d,f],[d,b-35]]:[[d,f],[b-35,f]];for(let M=0;M<7;M+=1){const w=b-30+M*10,A=M%2?-8:8;y.push(x?[d+A,w]:[w,f+A])}y.push(x?[d,b+35]:[b+35,f]),y.push([g,_]),e(y),x?(i(d+24,b-8,m,"start"),i(d+24,b+18,Ih(p),"start",16)):(i(b,f-24,m),i(b,f+30,Ih(p),"middle",16)),n.push("</g>")},source:({id:h,x:d,y:f,top:g,bottom:_,name:m,value:p,polarity:x=1,kind:b="voltage",state:y="active",labelSide:M=-1,frequency:w})=>{n.push(`<g data-component="${Zi(h)}" data-symbol="${Zi(b)}-source" data-source-state="${Zi(y)}" data-polarity="${x}">`);const A=d+M*56;y==="short"?(t(d,g,d,_),i(A,f-7,m),i(A,f+18,"0 V","middle",16)):y==="open"?(t(d,g,d,f-15),t(d,f+15,d,_),s(d,f-15),s(d,f+15),i(A,f-7,m),i(A,f+18,"open","middle",16)):(t(d,g,d,f-28),t(d,f+28,d,_),n.push(`<circle cx="${d}" cy="${f}" r="28" fill="white"/>`),b==="current"?(t(d,f+15,d,f-14),n.push(`<path d="M ${d} ${f-16} L ${d-5} ${f-7} L ${d+5} ${f-7} Z" fill="${ra}" stroke="none"/>`)):b==="sine"?n.push(`<path d="M ${d-16} ${f} C ${d-11} ${f-16}, ${d-5} ${f-16}, ${d} ${f} C ${d+5} ${f+16}, ${d+11} ${f+16}, ${d+16} ${f}"/>`):(t(d-6,f-10,d+6,f-10),t(d-6,f+10,d+6,f+10),t(d,f+(x>0?-16:4),d,f+(x>0?-4:16))),i(A,f-8,m),i(A,f+18,p,"middle",16),w!==void 0&&i(A,f+42,`${On(w)} Hz`,"middle",14)),n.push("</g>")}}}function fy(n,e){const{line:t,path:i,source:r,resistor:s,ground:o,dot:a,text:c,pins:l}=n,u=120,h=330;if(e.representation==="original")r({id:"s",x:110,y:225,top:u,bottom:h,name:"Vs",value:"12 V"}),t(110,u,210,u),s("r1",210,u,370,u,"R₁",1e3),t(370,u,650,u),s("r2",440,u,440,h,"R₂",1e3),s("load",650,u,650,h,"RL",e.load),t(110,h,650,h),a(440,u),a(440,h),a(300,h),o(300,h),c(448,96,"A","start"),l({"s+":[110,u],"s-":[110,h],r1a:[210,u],r1b:[370,u],r2a:[440,u],r2b:[440,h],loada:[650,u],loadb:[650,h],gnd:[300,h]});else if(e.representation==="thevenin")r({id:"s",x:170,y:225,top:u,bottom:h,name:"VTh",value:`${On(e.equivalentVoltage)} V`}),t(170,u,280,u),s("req",280,u,480,u,"RTh",e.equivalentResistance),t(480,u,620,u),s("load",620,u,620,h,"RL",e.load),t(170,h,620,h),o(395,h),a(395,h),c(630,100,"A","start"),l({"s+":[170,u],"s-":[170,h],reqa:[280,u],reqb:[480,u],loada:[620,u],loadb:[620,h],gnd:[395,h]});else if(e.representation==="norton")r({id:"s",x:140,y:225,top:u,bottom:h,name:"IN",value:`${On(e.nortonCurrent)} mA`,kind:"current"}),t(140,u,650,u),s("req",395,u,395,h,"RN",e.equivalentResistance),s("load",650,u,650,h,"RL",e.load),t(140,h,650,h),a(395,u),a(395,h),a(270,h),o(270,h),c(405,96,"A","start"),l({"s+":[140,u],"s-":[140,h],reqa:[395,u],reqb:[395,h],loada:[650,u],loadb:[650,h],gnd:[270,h]});else throw new RangeError("Unknown equivalent circuit representation.")}function py(n,e){const{line:t,source:i,resistor:r,ground:s,dot:o,text:a,pins:c}=n,l=u=>u?"active":e.replacement==="open"?"open":"short";i({id:"a",x:120,y:225,top:120,bottom:330,name:"V₁",value:`${On(e.v1)} V`,state:l(e.sourceMode!=="b")}),i({id:"b",x:660,y:225,top:120,bottom:330,name:"V₂",value:`${On(e.v2)} V`,polarity:-1,labelSide:1,state:l(e.sourceMode!=="a")}),t(120,120,200,120),r("r1",200,120,320,120,"R₁",1e3),t(320,120,460,120),r("r2",460,120,580,120,"R₂",1e3),t(580,120,660,120),r("load",390,120,390,330,"R₃",1e3),t(120,330,660,330),o(390,120),o(390,330),o(250,330),s(250,330),a(400,96,"A","start"),c({"a+":[120,120],"a-":[120,330],"b+":[660,120],"b-":[660,330],r1a:[200,120],r1b:[320,120],r2a:[460,120],r2b:[580,120],loada:[390,120],loadb:[390,330],gnd:[250,330]})}function my(n,e){const{elements:t,line:i,path:r,source:s,resistor:o,ground:a,dot:c,contact:l,text:u,pins:h}=n,d=e.configuration==="inverting",f=d?180:230;s({id:"signal",x:90,y:285,top:f,bottom:345,name:"Vin",value:`${On(e.amplitude)} Vpk`,kind:"sine",frequency:e.frequency}),d?(i(90,180,150,180),o("rin",150,180,300,180,"Rin",e.rin),i(300,180,400,180),r([[400,230],[370,230],[370,345],[90,345]]),a(230,345),c(230,345)):(i(90,230,400,230),o("rin",170,180,300,180,"Rin",e.rin),i(300,180,400,180),a(170,180),a(90,345)),r([[340,180],[340,80],[400,80]]),o("rf",400,80,550,80,"Rf",e.rf),r([[550,80],[620,80],[620,205]]),i(550,205,660,205),c(340,180),c(620,205),t.push('<g data-component="op" data-symbol="op-amp">'),t.push('<path d="M 400 140 L 400 270 L 550 205 Z" fill="white"/>'),i(410,180,420,180),i(410,230,420,230),i(415,225,415,235),u(447,212,"U₁","middle",16),i(480,147,480,175),i(480,235,480,285),u(480,130,`+${On(e.rail)} V`,"middle",16),u(480,309,`−${On(e.rail)} V`,"middle",16),t.push("</g>"),l(660,205),u(671,210,"Vout","start");const g=d?[230,345]:[90,345];h({"signal+":[90,f],"signal-":[90,345],rina:[d?150:170,180],rinb:[300,180],rfa:[400,80],rfb:[550,80],"op-":[400,180],"op+":[400,230],out:[550,205],vp:[480,147],vn:[480,285],"plus+":[480,147],"minus-":[480,285],"plus-":g,"minus+":g,gnd:g})}function gy(n,e){const{elements:t,line:i,path:r,source:s,resistor:o,ground:a,dot:c,contact:l,text:u,pins:h}=n;s({id:"s",x:100,y:235,top:120,bottom:340,name:"Vs",value:"5 V"}),i(100,120,235,120),r([[235,200],[190,200],[190,340]]),i(300,160,365,160),o("r",365,160,535,160,"R",e.resistance),i(535,160,650,160),i(100,340,650,340),a(390,340),c(390,340),c(190,340),t.push(`<g data-component="sw" data-symbol="spdt" data-switch-position="${e.charging?"source":"return"}">`),i(300,160,235,e.charging?120:200),l(235,120),l(235,200),l(300,160),u(280,90,"S₁"),u(222,103,"5 V","end",15),u(222,224,"0 V","end",15),t.push("</g>"),e.kind==="RC"?(t.push('<g data-component="storage" data-symbol="capacitor">'),i(650,160,650,242),i(626,242,674,242),i(626,258,674,258),i(650,258,650,340),u(692,242,"C","start"),u(692,269,uy(e.capacitance),"start",16),t.push("</g>")):(t.push('<g data-component="storage" data-symbol="inductor">'),i(650,160,650,218),t.push('<path d="M 650 218 c -18 0 -18 16 0 16 c -18 0 -18 16 0 16 c -18 0 -18 16 0 16 c -18 0 -18 16 0 16"/>'),i(650,282,650,340),u(682,242,"L","start"),u(682,269,hy(e.inductance),"start",16),t.push("</g>")),u(660,143,"A","start"),h({"s+":[100,120],"s-":[100,340],supply:[235,120],return:[235,200],common:[300,160],ra:[365,160],rb:[535,160],storagea:[650,160],storageb:[650,340],gnd:[390,340]})}function Bd(n,e={},{voltages:t}={}){if(!An[n])throw new RangeError(`Unknown schematic module: ${n}`);const i={...An[n].defaults,...e},r=dy();n==="thevenin"?fy(r,i):n==="superposition"?py(r,i):n==="opamp"?my(r,i):gy(r,i);const s={thevenin:`${i.representation==="original"?"Original voltage-divider":i.representation==="thevenin"?"Thévenin equivalent":"Norton equivalent"} circuit`,superposition:"Two-source superposition circuit; source two has its positive terminal grounded",opamp:`${i.configuration==="inverting"?"Inverting":"Non-inverting"} amplifier circuit with separate positive and negative supply pins`,transient:`Series ${i.kind} circuit with an SPDT source and closed return path`},o=Zi(s[n]);return`<svg xmlns="http://www.w3.org/2000/svg" class="ee-schematic" viewBox="0 0 780 430" width="100%" style="display:block;height:auto;aspect-ratio:780 / 430" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${o}"><title>${o}</title><rect width="780" height="430" fill="white"/><g fill="none" stroke="${ra}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" font-family="Arial, Helvetica, sans-serif"><style>.ee-schematic text{fill:${ra};stroke:none;font-weight:400}</style>${r.elements.join("")}</g></svg>`}const fa=document.querySelector("#app"),ae=cf();let Er={kind:"checking",supported:!1,active:!1,message:"Checking headset…"},Et,kl=!1,gs=null,mi=!1,vn={fraction:.5,panel:0,active:!1},rs=null,Vd="vdc";const Tt=n=>String(n??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),vy=n=>({circuit:'<path d="M3 8h5l3-5 5 10 3-5h5M7 18h15M7 15v6M22 15v6"/>',vr:'<path d="M4 6h20l2 13h-7l-5-4-5 4H2Z"/><circle cx="9" cy="11" r="2"/><circle cx="19" cy="11" r="2"/>',book:'<path d="M4 4h8a4 4 0 0 1 4 3v17a4 4 0 0 0-4-3H4Zm12 3a4 4 0 0 1 4-3h5v17h-5a4 4 0 0 0-4 3"/>',reset:'<path d="M6 8a9 9 0 1 1-1 10M6 3v6h6"/>',arrow:'<path d="M7 21 21 7M7 7h14v14"/>',play:'<path d="m10 5 13 9-13 9Z"/>',check:'<path d="m6 14 5 5L23 7"/>'})[n]||"",Di=n=>`<svg viewBox="0 0 28 28" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${vy(n)}</svg>`;fa.innerHTML=`
  <aside class="sidebar">
    <a class="brand" href="#" aria-label="MetaHub Circuits lab">${Di("circuit")}<span>MetaHub<span class="brand-sub">Circuits lab</span></span></a>
    <div class="sidebar-caption">Electrical Circuits I</div>
    <nav aria-label="Laboratory modules">${Object.entries(An).map(([n,e])=>`<button class="module-link" data-action="module:${n}" data-module="${n}"><span class="lab-number">${e.number}</span><span><strong>${e.name}</strong><small>${e.short}</small></span><span class="module-status" aria-hidden="true"></span></button>`).join("")}</nav>
    <div class="sidebar-bottom"><div class="course-mark">ELEN <strong>221</strong></div><button class="text-button" id="guide-button">Help ${Di("arrow")}</button><span class="prototype-tag">Lab build · v0.9</span></div>
  </aside>
  <main class="workspace">
    <header class="topbar"><div class="breadcrumb">Lab <span id="lab-number">05</span><span class="slash">/</span><span id="topic-label"></span></div><div class="header-actions"><button class="button vr-button" id="vr-button">${Di("vr")} Checking VR…</button></div></header>
    <div class="vr-status-row"><span id="vr-status" role="status">Checking headset…</span><button id="headset-help" class="text-button">Open on a headset</button></div>
    <section class="intro"><div><h1 id="module-title"></h1><p id="module-description"></p></div><div class="mode-switch" aria-label="Learning mode"><button data-action="explore" class="active">Explore</button><button data-action="build">Build circuit</button></div></section>
    <section class="experiment-brief" aria-label="Experiment aim"><span>Your experiment</span><p id="experiment-aim"></p><details><summary>Experiment steps</summary><div id="experiment-steps"></div></details></section>
    <div class="lab-layout">
      <section class="bench-panel" aria-label="Interactive circuit experiment">
        <div class="panel-header"><div class="bench-tabs"><button id="bench-tab" class="active">3D bench</button><button id="reference-tab">Schematic</button><button id="vr-preview-tab" hidden title="Desktop check of panel layout only">Panel preview</button></div><div class="bench-toolbar"><span id="circuit-status" class="status-tag">Circuit connected</span><button class="icon-button" id="reset-view" aria-label="Reset 3D view">${Di("reset")}</button></div></div>
        <div class="stage-wrap"><div id="bench"></div><div id="schematic" hidden></div><div class="stage-top"><span id="bench-caption">Original circuit</span><span id="hover-label" hidden></span></div><div class="stage-bottom"><span>Drag empty space to look around · Scroll to zoom</span><span>Drag a probe to a contact · Drag a dial to turn it</span></div></div>
        <div class="bench-strip"><p id="object-help">Use the equipment on the bench. The meter reads the voltage between its two test tips.</p><button class="button subtle" data-action="undo" title="Undo last wire or probe change">Undo</button><button class="button subtle" data-action="cancel" id="cancel-wire" title="Cancel selection (Esc)">Cancel lead</button></div>
        <div class="bench-help"><span id="bench-help"></span></div>
        <div id="readings" class="readings"></div>
      </section>
      <aside class="controls-panel"><details id="keyboard-controls"><summary>Keyboard controls</summary><p class="hint">The same equipment settings, for keyboard and touch use.</p><div class="patch-toolbar" aria-label="Keyboard bench tools"><button data-action="tool:select" data-tool="select">Select</button><button data-action="tool:wire" data-tool="wire">Connect contacts</button><button data-action="tool:red" data-tool="red">Move V tip</button><button data-action="tool:black" data-tool="black">Move COM tip</button><button data-action="tool:remove" data-tool="remove">Remove lead</button></div><div class="control-heading"><div><h2>Equipment settings</h2></div><span class="small-circuit">${Di("circuit")}</span></div><div id="part-controls" hidden></div><div id="controls"></div><div id="model-note" class="model-note"></div></details></aside>
    </div>
    <div class="lower-layout">
      <section class="chart-panel"><div class="chart-heading"><div><h2 id="chart-title"></h2></div><div id="chart-legend"></div></div><p id="chart-subtitle"></p><p id="chart-use" class="chart-use"></p><div id="source-comparison" hidden></div><div id="scope-controls" hidden></div><div id="chart" tabindex="0" aria-label="Interactive measurement graph"></div><output id="trace-reading" class="trace-reading" aria-live="polite"></output></section>
      <section class="challenge-panel"><h2>At the bench</h2><div id="activity-controls"></div><div class="challenge-actions"><button class="button subtle" data-action="check-wiring">Check connections</button><button class="button subtle" id="new-attempt" data-action="reset-circuit" hidden>Clear circuit</button></div><p class="feedback" id="feedback" role="status" aria-live="polite"></p></section>
    </div>
    <section class="connection-panel"><details><summary>Wiring list and keyboard connections</summary><div class="connection-content"><div><h3>Connect a patch lead</h3><div class="wiring-form"><label>From<select id="wire-from"></select></label><label>To<select id="wire-to"></select></label><button class="button primary" id="add-wire">Connect</button></div><div class="wiring-form"><label>Meter V tip (red)<select id="red-probe"></select></label><label>Meter COM tip (black)<select id="black-probe"></select></label></div><div class="connection-buttons"><button class="button subtle" data-action="check-wiring">Check connections</button><button class="button subtle" data-action="clear">Clear leads</button><button class="button subtle" data-action="restore" id="restore-button">Use shown circuit</button></div></div><div><h3>Connected leads</h3><div id="wire-list"></div></div></div></details></section>
    <footer class="workspace-footer"><span><i class="footer-dot"></i> Desktop 3D / VR</span><span>Ideal circuit models</span><button id="model-guide">Model limits ${Di("arrow")}</button></footer>
  </main>
  <dialog id="headset-dialog" aria-labelledby="headset-title"><div class="dialog-header"><h2 id="headset-title">Open the lab in VR</h2><button class="icon-button" data-close aria-label="Close VR setup">×</button></div><p>Open this lab in your headset’s browser, then select <strong>Enter VR</strong>. The circuit bench and all four experiments open around you.</p><div id="headset-address" class="headset-address"></div><ol class="headset-steps"><li>Choose a lab and Explore or Build circuit.</li><li>Enter VR and accept the headset’s request.</li><li>Grip a probe to pick it up. Bring its tip to a contact and release. Hold a dial and turn your wrist to adjust it.</li><li>Use the left stick to move and the right stick to turn. You can also walk around within your play area.</li></ol><p id="headset-status" class="headset-status" role="status"></p><p>Your circuit and readings stay when you leave VR.</p><div class="dialog-actions"><button class="button primary" id="headset-enter" hidden>Enter VR</button><button class="button subtle" id="headset-check">Check headset</button><a id="headset-fullscreen" class="button subtle" target="_blank" rel="noopener" hidden>Open lab full screen</a></div></dialog>
  <dialog id="guide-dialog"><div class="dialog-header"><div><span class="eyebrow">ELEN 221</span><h2>Lab guide</h2></div><button class="icon-button" data-close aria-label="Close guide">×</button></div><div class="guide-body"><h3>Use the equipment</h3><p>Explore starts with a wired circuit. Build circuit starts with loose connections. Follow the experiment steps above the bench.</p><ol><li>Drag from one contact to another to add a lead. Grab an existing lead to move or remove it. Undo puts the last connection back.</li><li>Pick up a test probe and put its metal tip on a contact. The red lead runs to V and the black lead to COM on the meter. The reading is V minus COM. Swap the tips to reverse the sign.</li><li>Turn the dials on the equipment to change values. Flip the circuit switch to change its state. In the amplifier lab, use the two scope probes to compare input and output.</li><li>Drag on a graph to choose a load or inspect an acquired trace. The graph labels state what is being calculated or measured. Put your answers on paper.</li></ol><h3>In VR</h3><p id="vr-help-status"></p><p>Open the HTTPS link in your headset browser and select Enter VR. Grip a probe to pick it up, move it to a contact, and release. Hold a dial and turn your wrist. Use the left stick to move and the right stick to turn. You can also walk within your play area. Recenter brings you back to the bench.</p><h3>Keyboard and mouse</h3><p>Drag empty space to orbit and scroll to zoom. Drag equipment to use it. Keyboard controls below the bench offer the same settings without dragging. Focus the graph and use the arrow keys to move its cursor.</p><h3>Model limits</h3><p>DC resistor circuits are solved from your connections. The amplifier and transient labs support the shown circuit layouts. Disconnected or invalid circuits do not produce valid traces.</p><p>The amplifier uses ideal gain with adjustable supply rails. Its output stays 1 V inside each rail. This model does not include device bandwidth, slew rate, input common-mode limits, component tolerances or output current limits.</p><p>RC and RL models preserve capacitor voltage and inductor current at switching. New run resets stored energy. The instructor must confirm the amplifier configurations against the lab handout, which was not included in the email.</p><p><a href="./docs/module-designs.md" target="_blank" rel="noopener">Instructor guide ↗</a></p></div></dialog>
`;const En=(n,e,t,i=r=>r)=>`<label class="control-label" for="param-${n}">${e}</label><select id="param-${n}" data-param="${n}">${t.map(r=>`<option value="${Tt(r)}" ${ct(ae)[n]===r?"selected":""}>${Tt(i(r))}</option>`).join("")}</select>`,Ds=(n,e,t)=>`<div class="control-label">${e}</div><div class="segmented">${t.map(([i,r])=>`<button data-action="set:${n}:${i}" class="${ct(ae)[n]===i?"active":""}">${r}</button>`).join("")}</div>`,tn=n=>`<div class="control-block">${n}</div>`;function Hd(){var c,l;const n=document.activeElement,e=(n==null?void 0:n.id)||null,t=n==null?void 0:n.dataset.scopeChannel,i=n==null?void 0:n.dataset.scopeField,r=ct(ae),s=ae.module;let o="",a="";s==="thevenin"&&(o+=tn(Ds("representation","Circuit",[["original","Original"],["thevenin","Thévenin"],["norton","Norton"]])),o+=tn(En("load","Load",zt.load,u=>`${u} Ω`)+`<div class="range-labels"><span>Smaller load</span><span>Larger load</span></div><input aria-label="Load resistance slider" type="range" min="0" max="6" step="1" value="${zt.load.indexOf(r.load)}" id="load-slider">`),r.representation==="thevenin"&&(o+=tn(En("equivalentVoltage","Vth",zt.equivalentVoltage,u=>`${u} V`))),r.representation==="norton"&&(o+=tn(En("nortonCurrent","In",zt.nortonCurrent,u=>`${u} mA`))),r.representation!=="original"?o+=tn(En("equivalentResistance","Equivalent resistance",zt.equivalentResistance,u=>`${u} Ω`)):o+='<div class="fixed-values"><span>Source<strong>12 V</strong></span><span>R₁ / R₂<strong>1 kΩ / 1 kΩ</strong></span></div>',a="Use the same loads in each circuit. Peak power and peak efficiency occur at different loads."),s==="superposition"&&(o+=tn(Ds("sourceMode","Active sources",[["both","Both"],["a","A alone"],["b","B alone"]])),o+=tn(En("v1","Source A",zt.v1,u=>`+${u} V`)),o+=tn(En("v2","Source B",zt.v2,u=>`−${u} V`)),o+=tn(Ds("replacement","Inactive source",[["short","Short circuit"],["open","Open circuit"]])),a="An inactive ideal voltage source is a short circuit. Compare it with an open circuit. All resistors are 1 kΩ."),s==="opamp"&&(o+=tn(Ds("configuration","Circuit",[["inverting","Inverting"],["noninverting","Non-inverting"]])),o+=`<div class="paired-controls">${tn(En("rin",r.configuration==="inverting"?"Input resistor":"Ground resistor",zt.rin,u=>`${u/1e3} kΩ`))}${tn(En("rf","Feedback resistor",zt.rf,u=>`${u/1e3} kΩ`))}</div>`,o+=tn(En("amplitude","Input amplitude",zt.amplitude,u=>`${u} V peak`)),o+=`<div class="paired-controls">${tn(En("rail","Supply rails",zt.rail,u=>`±${u} V`))}${tn(En("frequency","Signal frequency",zt.frequency,u=>`${u} Hz`))}</div>`,a=`Sine input · 1 V output headroom · ±${r.rail-1} V output limit. Ideal gain. Bandwidth and slew rate are not modelled.`),s==="transient"&&(o+=tn(Ds("kind","Circuit",[["RC","RC · capacitor"],["RL","RL · inductor"]])),o+=tn(En("resistance","Series resistance",zt.resistance,u=>`${u} Ω`)),o+=`<div class="fixed-values"><span>Source<strong>5 V</strong></span><span>${r.kind==="RC"?"Capacitance":"Inductance"}<strong>${r.kind==="RC"?"100 μF":"100 mH"}</strong></span></div>`,o+=tn(`<div class="control-label">Switch position</div><button class="switch-button ${r.charging?"charging":""}" data-action="switch"><span class="switch-track"><i></i></span>${r.charging?"Source connected":"Closed return loop"}</button>`),o+=`<div class="transient-buttons"><button class="button primary" data-action="play" id="play-button">${Di("play")}${r.playing?"Pause":"Run"}</button><button class="button subtle" data-action="reset-energy">New run</button></div><div class="time-control"><div><span>Time</span><strong id="simulation-time">${Ht(r.time*1e3)} ms</strong></div><input id="time-slider" aria-label="Simulation time in time constants" type="range" min="0" max="5" step="0.01" value="${r.time/$n({...r,source:5}).tau}"><div class="time-shortcuts"><button data-action="one-tau">Go to 1 τ</button><button data-action="five-tau">Go to 5 τ</button><button data-action="replay">Replay</button></div></div>`,o+=tn(En("speed","Playback speed",zt.speed,u=>`${u}×`)),a="Voltage, current and energy share one clock. Changing R keeps the same playback scale. New run resets stored energy."),document.querySelector("#controls").innerHTML=o,xy(),yy(),Sy(),document.querySelector("#model-note").textContent=a,e?(c=document.getElementById(e))==null||c.focus({preventScroll:!0}):t&&((l=document.querySelector(`[data-scope-channel="${t}"][data-scope-field="${i}"]`))==null||l.focus({preventScroll:!0}))}function Gd(){const n=ct(ae);return(ae.module==="thevenin"?{load:["load"],req:["equivalentResistance"],s:n.representation==="norton"?["nortonCurrent"]:n.representation==="thevenin"?["equivalentVoltage"]:[]}:ae.module==="superposition"?{a:["v1"],b:["v2"]}:ae.module==="opamp"?{signal:["amplitude","frequency"],rin:["rin"],rf:["rf"],plus:["rail"],minus:["rail"],op:["configuration"]}:{r:["resistance"],sw:["charging"],storage:["kind"]})[gs]||[]}function _y(){const n=Gd();return qh(ae).filter(e=>n.some(t=>e.id.startsWith(`cycle:${t}`)||e.id.startsWith(`set:${t}:`)||t==="charging"&&e.id==="switch")).map(e=>e.id)}function xy(){const n=document.querySelector("#part-controls"),e=Ct(ae).circuit.components.find(i=>i.id===gs);if(n.hidden=!e,!e)return;const t=Gd();n.innerHTML=`<div class="part-title"><strong>${Tt(e.label)} · ${Tt(e.value)}</strong><button id="close-part" aria-label="Close part settings">×</button></div>`+(t.length?t.map(i=>{var a;const r=document.querySelector(`[data-param="${i}"]`);r&&((a=r.closest(".control-block"))==null||a.classList.add("selected-control"));const s={load:"Load",equivalentResistance:"Resistance",equivalentVoltage:"Vth",nortonCurrent:"In",v1:"Source A",v2:"Source B",resistance:"Resistance",rail:"Supply",frequency:"Frequency",amplitude:"Input",rin:"Rin",rf:"Rf"}[i]||i,o={load:"Ω",equivalentResistance:"Ω",equivalentVoltage:"V",nortonCurrent:"mA",v1:"V",v2:"V",resistance:"Ω",rail:"V",frequency:"Hz",amplitude:"V peak",rin:"Ω",rf:"Ω"}[i]||"";return zt[i]?`<div class="part-adjust"><button data-action="cycle:${i}:-1" aria-label="Decrease ${Tt(i)}">−</button><span>${Tt(s)}: ${Tt(ct(ae)[i])} ${o}</span><button data-action="cycle:${i}" aria-label="Increase ${Tt(i)}">+</button></div>`:i==="charging"?'<button class="button" data-action="switch">Flip switch</button>':i==="configuration"?`<button class="button" data-action="set:configuration:${ct(ae).configuration==="inverting"?"noninverting":"inverting"}">Change amplifier</button>`:i==="kind"?`<button class="button" data-action="set:kind:${ct(ae).kind==="RC"?"RL":"RC"}">Use ${ct(ae).kind==="RC"?"RL":"RC"}</button>`:""}).join(""):"<p>Fixed part. Connect its terminals with the Connect tool.</p>")}function yy(){const n=An[ae.module],t=`<ol class="experiment-steps">${(n.steps||[]).map(i=>`<li>${Tt(i)}</li>`).join("")}</ol>`;document.querySelector("#experiment-steps").innerHTML=t,document.querySelector("#experiment-aim").textContent=n.purpose||n.challenge,document.querySelector("#activity-controls").innerHTML=`<p>${Tt(n.principle)}</p><p class="paper-note">Use the equipment to test each step. Keep readings and answers on paper.</p>`}function by(){const n=dl(ae),e=ct(ae);document.querySelector("#source-comparison").innerHTML=`<p>Live circuit values at +${e.v1} V / −${e.v2} V. Each view uses your wiring. Select a case to switch the sources on the bench.</p><div class="source-cases">${[["a","A alone"],["b","B alone"],["both","Both sources"]].map(([t,i])=>{var s;const r=(s=n.live)==null?void 0:s[t];return`<button data-action="set:sourceMode:${t}" class="source-case ${e.sourceMode===t?"active":""}"><span>${i}</span><strong>${r!=null&&r.valid?`${Ht(r.current*1e3)} mA`:"—"}</strong><small>${r!=null&&r.valid?`${Ht(r.voltage)} V`:"Connect the circuit"}</small></button>`}).join("")}</div>`}function My(){if(ae.module==="superposition"){const n=dl(ae).live;return["a","b","both"].map(e=>{var t;return`${{a:"A alone",b:"B alone",both:"Both sources"}[e]}: ${(t=n==null?void 0:n[e])!=null&&t.valid?Ht(n[e].current*1e3)+" mA":"Connect the circuit"}`})}if(ae.module==="opamp"){const n=Fi(ae);return[n.ok?`Scope: ${n.running?"Run":"Hold"}${n.stale?" · earlier settings":""}`:`Scope: ${n.error}`]}return[]}function Sy(){var o;const n=document.querySelector("#scope-controls"),e=((o=n.querySelector("details"))==null?void 0:o.open)||!1;if(n.hidden=ae.module!=="opamp",ae.module!=="opamp")return;const t=ct(ae),i=Ct(ae),r=Fi(ae),s=(a,c,l)=>`<label>${l}<select data-scope-channel="${a}" data-scope-field="${c}" aria-label="${l}"><option value="">Disconnected</option>${i.circuit.pins.map(u=>`<option value="${Tt(u.id)}" ${i.scope[a][c]===u.id?"selected":""}>${Tt(u.name)}</option>`).join("")}</select></label>`;n.innerHTML=`<details class="scope-keyboard" ${e?"open":""}><summary>Scope keyboard controls</summary><div class="scope-top"><strong>Scope</strong><div><button class="button" data-action="scope-toggle">${t.scopeRunning?"Hold":"Run scope"}</button><button class="button" data-action="scope-autoscale">Auto scale</button></div></div><p class="scope-status ${r.error?"warning":""}">${Tt(r.error||(r.ok?`${r.running?"Running":"Held capture"}${r.stale?" · settings have changed":""} · ${r.trigger.found?"Triggered":"No trigger crossing"}`:"Connect the scope probes."))}</p>
    <div class="scope-channels">${["ch1","ch2"].map((a,c)=>`<fieldset><legend>${a.toUpperCase()} · ${c?"output":"input"}</legend><p class="hint">Move the probe and ground clip on the bench.</p>${s(a,"signal",`${a.toUpperCase()} tip`)}${s(a,"ground",`${a.toUpperCase()} ground`)}${En(`${a}Scale`,"V / div",zt[`${a}Scale`],l=>`${l} V`)}</fieldset>`).join("")}</div>
    <div class="scope-time">${tn(En("timeDiv","Time / div",zt.timeDiv,a=>`${a} ms`))}${tn(En("triggerEdge","Trigger edge",["rising","falling"],a=>a==="rising"?"Rising":"Falling"))}<label class="control-block"><span class="control-label">Trigger level · CH1</span><div class="number-unit"><input data-param="triggerLevel" aria-label="Trigger level" type="number" step="0.1" min="-15" max="15" value="${t.triggerLevel}"><span>V</span></div></label></div><p class="hint">Both ground clips share circuit GND. Scales change the view, not the circuit.</p></details>`}function Uh(n,e=vn.panel){const t=vn.active?$h(ae,vn.fraction,e):null,i=t?{x:vn.fraction,label:t.text,xLabel:t.xLabel,readings:t.readings}:null,r=n.interaction||{thevenin:"load",superposition:"source",opamp:"scope",transient:"time"}[ae.module];if(n.bars){const s=Math.max(...n.bars.map(o=>Math.abs(o.value??0)),1)*1.25;return{title:n.title,interaction:r,cursor:i,subtitle:n.subtitle,xLabel:"Source case",yLabel:"Current (mA)",xTicks:n.bars.map((o,a)=>({position:.18+a*.3,label:o.name})),yTicks:[-s,0,s].map(o=>({position:.5+o/(2*s),label:Ht(o,2)})),series:n.bars.filter(o=>Number.isFinite(o.value)).map(o=>{const a=n.bars.indexOf(o);return{color:o.color,points:[[.18+a*.3,.5],[.18+a*.3,.5+o.value/(2*s)]]}})}}return{title:n.title,interaction:r,cursor:i,id:n.id,subtitle:n.subtitle,xLabel:n.xLabel,yLabel:n.yLabel,xDivisions:ae.module==="opamp"?10:4,yDivisions:ae.module==="opamp"?8:4,xTicks:Array.from({length:ae.module==="opamp"?6:5},(s,o)=>{const a=ae.module==="opamp"?5:4;return{position:o/a,label:Ht(n.xMax*o/a,2)}}),yTicks:Array.from({length:5},(s,o)=>({position:o/4,label:Ht(n.yMin+(n.yMax-n.yMin)*o/4,2)})),marker:n.marker?{x:n.marker.x/n.xMax,y:(n.marker.y-n.yMin)/(n.yMax-n.yMin)}:null,reference:n.tau?{x:n.tau/n.xMax,label:"1 τ"}:null,series:n.series.map(s=>({name:s.name,color:s.color,points:s.points.map(([o,a])=>[o/n.xMax,(a-n.yMin)/(n.yMax-n.yMin)])}))}}function sa(n,e=0,t=!0){const i=aa(ae);if(vn={fraction:Math.min(1,Math.max(0,n)),panel:e,active:!0},t&&ae.module==="thevenin"){const r=vn.fraction*i.xMax,s=zt.load.reduce((o,a)=>Math.abs(a-r)<Math.abs(o-r)?a:o);oi(ae,"load",s),vn.fraction=s/i.xMax}else t&&ae.module==="transient"?(Wh(ae,`scrub:${vn.fraction*i.xMax}`),vn.fraction=ct(ae).time*1e3/i.xMax):t&&ae.module==="superposition"&&oi(ae,"sourceMode",["a","b","both"][Math.min(2,Math.floor(vn.fraction*3))]);Hd(),zl(),rr()}function Wd(n,e=rs){if(!e)return;const t=(n.clientX-e.bounds.left)/e.bounds.width*640;sa((t-52)/568,e.panel)}const ss=document.querySelector("#chart");ss.addEventListener("pointerdown",n=>{const e=n.target.closest("svg[data-plot-index]");!e||n.button!==0||(n.preventDefault(),rs={panel:Number(e.dataset.plotIndex),bounds:e.getBoundingClientRect(),pointerId:n.pointerId},ss.setPointerCapture(n.pointerId),ss.focus({preventScroll:!0}),Wd(n))});ss.addEventListener("pointermove",n=>{(rs==null?void 0:rs.pointerId)===n.pointerId&&Wd(n)});for(const n of["pointerup","pointercancel","lostpointercapture"])ss.addEventListener(n,()=>{rs=null});ss.addEventListener("keydown",n=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(n.key))return;if(n.preventDefault(),ae.module==="thevenin"){const t=zt.load,i=t.indexOf(ct(ae).load),r=n.key==="Home"?0:n.key==="End"?t.length-1:Math.max(0,Math.min(t.length-1,i+(n.key==="ArrowRight"?1:-1)));sa(t[r]/aa(ae).xMax,0);return}const e=n.key==="Home"?0:n.key==="End"?1:vn.fraction+(n.key==="ArrowRight"?.02:-.02);sa(e,vn.panel)});function Ey(){const{circuit:n,wires:e,probes:t}=Ct(ae),i=n.pins.map(r=>`<option value="${Tt(r.id)}">${Tt(r.name)} [${Tt(r.id)}]</option>`).join("");for(const r of["wire-from","wire-to"]){const s=document.getElementById(r),o=s.value;s.innerHTML=i,n.pins.some(a=>a.id===o)&&(s.value=o)}for(const r of["red","black"]){const s=document.getElementById(`${r}-probe`);s.innerHTML='<option value="">Disconnected</option>'+i,s.value=t[r]||""}document.querySelector("#wire-list").innerHTML=e.length?e.map(([r,s],o)=>`<div class="wire-row"><span><code>${Tt(r)}</code> <span>↔</span> <code>${Tt(s)}</code></span><button data-remove-wire="${o}" aria-label="Remove connection ${Tt(r)} to ${Tt(s)}">Remove</button></div>`).join(""):'<p class="empty-wires">No leads connected. Start with the common ground connections.</p>',document.querySelector("#restore-button").hidden=ae.mode!=="explore"}function Nh(n,e=0){if(n.bars){const _=Math.max(...n.bars.map(x=>Math.abs(x.value??0)),1)*1.25,m=18+162/2,p=162/(2*_);return`<svg data-plot-index="${e}" viewBox="0 0 640 218" role="img" aria-label="${Tt(n.title)}">${[-_,0,_].map(x=>`<line x1="52" y1="${m-x*p}" x2="620" y2="${m-x*p}" class="grid-line"/><text x="43" y="${m-x*p+4}" text-anchor="end">${Ht(x,1)}</text>`).join("")}${n.bars.map((x,b)=>{const y=127+b*175,M=m-(x.value??0)*p;return Number.isFinite(x.value)?`<rect x="${y}" y="${Math.min(m,M)}" width="72" height="${Math.max(1,Math.abs(x.value*p))}" rx="3" fill="${x.color}"/><text x="${y+36}" y="${x.value>=0?M-9:M+17}" text-anchor="middle" class="bar-value">${Ht(x.value)} mA</text><text x="${y+36}" y="203" text-anchor="middle">${x.name}</text>`:`<text x="${y+36}" y="${m-8}" text-anchor="middle">—</text><text x="${y+36}" y="203" text-anchor="middle">${Tt(x.name)}</text>`}).join("")}</svg>`}const u=_=>52+_/n.xMax*568,h=_=>180-(_-n.yMin)/(n.yMax-n.yMin)*162;let d=`<svg data-plot-index="${e}" viewBox="0 0 640 218" role="img" aria-label="${Tt(n.title)}"><defs><clipPath id="plot-clip-${e}"><rect x="52" y="18" width="568" height="162"/></clipPath></defs>`;const f=ae.module==="opamp"?10:4,g=ae.module==="opamp"?8:4;for(let _=0;_<=f;_++){const m=n.xMax*_/f;d+=`<line x1="${u(m)}" y1="18" x2="${u(m)}" y2="180" class="grid-line"/>`,(f===4||_%2===0)&&(d+=`<text x="${u(m)}" y="196" text-anchor="middle">${Ht(m,2)}</text>`)}for(let _=0;_<=g;_++){const m=n.yMin+(n.yMax-n.yMin)*_/g;d+=`<line x1="52" y1="${h(m)}" x2="620" y2="${h(m)}" class="grid-line"/>`,(g===4||_%2===0)&&(d+=`<text x="42" y="${h(m)+4}" text-anchor="end">${Ht(m,2)}</text>`)}if(d+=`<g clip-path="url(#plot-clip-${e})">`,n.limits)for(const _ of n.limits)d+=`<line x1="52" y1="${h(_)}" x2="620" y2="${h(_)}" stroke="#c6a885" stroke-dasharray="4 5"/>`;n.tau&&(d+=`<line x1="${u(n.tau)}" y1="18" x2="${u(n.tau)}" y2="180" stroke="#bb7549" stroke-dasharray="4 5"/><text x="${u(n.tau)+5}" y="30">1 τ</text>`);for(const _ of n.series)d+=`<path d="${_.points.map(([m,p],x)=>`${x?"L":"M"}${u(m).toFixed(2)},${h(p).toFixed(2)}`).join(" ")}" fill="none" stroke="${_.color}" stroke-width="2.6"/>`;if(n.marker&&Number.isFinite(n.marker.y)&&(d+=`<circle cx="${u(n.marker.x)}" cy="${h(n.marker.y)}" r="5" fill="#fff" stroke="#b77636" stroke-width="2.5"/>`),vn.active){const _=u(vn.fraction*n.xMax);d+=`<line x1="${_}" y1="18" x2="${_}" y2="180" class="trace-cursor"/><rect x="${_-5}" y="18" width="10" height="7" fill="#263e50"/>`}return d+=`</g><text x="${52+568/2}" y="215" text-anchor="middle" class="axis-label">${Tt(n.xLabel)}</text><text x="52" y="11" class="axis-label">${Tt(n.yLabel)}</text></svg>`,d}function zl(){document.querySelector("#schematic").innerHTML='<div class="schematic-heading"><strong>Reference circuit</strong><span>Values follow the settings.</span></div>'+Bd(ae.module,ct(ae))+"<p>This is the target wiring. Your leads and voltage probes are on the 3D bench.</p>"}function rr(){var u,h,d;const n=er(ae),e=ct(ae),t=Ct(ae),i=aa(ae),r=bf(ae).map((f,g)=>g===0&&Vd==="off"?{...f,value:"—",unit:"",detail:"Meter off"}:f);document.querySelector("#readings").innerHTML=r.map(f=>`<div class="reading"><span>${f.label}</span><div>${Tt(f.value)}<small>${f.unit}</small></div><p>${Tt(f.detail)}</p></div>`).join("");const s=document.querySelector("#circuit-status");s.textContent=n.ok?t.correct?"Circuit connected":"Check wiring":"Connect the circuit",s.classList.toggle("warning",!n.ok||!t.correct),document.querySelector("#chart-title").textContent=i.title,document.querySelector("#chart-subtitle").textContent=i.subtitle,document.querySelector("#chart-use").textContent={thevenin:"Drag along the graph to set the load. Watch the meter and power change together.",superposition:"Select a source view to switch the circuit. The signed currents show how the sources add or cancel.",opamp:"Drag along the trace to read voltage at a chosen time. Turn the scope dials to change its scale.",transient:"The trace grows while the circuit runs. Drag on the trace to pause and inspect voltage, current and energy at the same instant."}[ae.module],document.querySelector("#chart-legend").innerHTML=i.series.map(f=>`<span><i style="background:${f.color}"></i>${Tt(f.name)}</span>`).join(""),document.querySelector("#chart").innerHTML=(u=i.panels)!=null&&u.length?i.panels.map((f,g)=>`<div class="trace-panel"><h3>${Tt(f.title)}</h3>${Nh(f,g)}${f.subtitle?`<p>${Tt(f.subtitle)}</p>`:""}</div>`).join(""):Nh(i);const o=vn.active?$h(ae,vn.fraction,vn.panel):null;if(document.querySelector("#trace-reading").textContent=(o==null?void 0:o.text)||"Use the graph to inspect a reading. Arrow keys also move the cursor.",document.querySelector("#feedback").textContent=!n.ok&&ae.mode==="explore"?n.error:ae.feedback,ae.module==="transient"){document.querySelector("#simulation-time").textContent=`${Ht(e.time*1e3)} ms`;const f=document.querySelector("#time-slider");document.activeElement!==f&&(f.value=e.time/$n({...e,source:5}).tau),document.querySelector("#play-button").innerHTML=Di("play")+(e.playing?"Pause":"Run")}for(const f of document.querySelectorAll("[data-tool]"))f.classList.toggle("active",f.dataset.tool===ae.tool);const a=Uh(i);(h=i.panels)!=null&&h.length&&(a.panels=i.panels.map(Uh));const c={select:"Drag a dial to change its value. Drag a probe onto a contact to take a reading.",wire:ae.selectedTerminal?`From ${((d=t.circuit.pins.find(f=>f.id===ae.selectedTerminal))==null?void 0:d.name)||ae.selectedTerminal} → select the next terminal. Esc cancels.`:"Drag from one contact to another to connect a lead. Drag a test probe onto a contact to measure voltage.",red:"Keyboard placement: choose the contact for the meter’s V tip.",black:"Keyboard placement: choose the contact for the meter’s COM tip.",remove:"Click a lead to remove it. Undo restores the last change.",ch1:"Click a terminal for the CH1 scope tip.",ch2:"Click a terminal for the CH2 scope tip.",scopeGround:"Click circuit ground for the selected scope ground lead."};document.querySelector("#bench-help").textContent=c[ae.tool]||ae.feedback,document.querySelector("#cancel-wire").hidden=!ae.selectedTerminal,document.querySelector("#source-comparison").hidden=ae.module!=="superposition",ae.module==="superposition"&&by();const l=[...r.map(f=>`${f.label}: ${f.value} ${f.unit}`),"Grip a probe, bring its tip to a contact, then release. Hold and turn a dial to adjust it.","Left stick: move. Right stick: turn. Walk within your play area to inspect the bench.",ae.module==="transient"?`Time: ${Ht(e.time*1e3)} ms | playback ${e.speed}×`:"",n.ok?"":n.error,`Experiment: ${An[ae.module].challenge}`,`Feedback: ${ae.feedback}`,...My()].filter(Boolean);Et==null||Et.update({module:ae.module,mode:ae.mode,parameters:{...e},measurement:n,metrics:r,options:zt,experiment:{challenge:An[ae.module].challenge,steps:An[ae.module].steps||[]},components:t.circuit.components,wires:t.wires,probes:t.probes,selectedTerminal:ae.selectedTerminal,tool:ae.tool,scope:t.scope,selectedPart:gs,partActions:_y(),schematicDataURL:`data:image/svg+xml;charset=utf-8,${encodeURIComponent(Bd(ae.module,e))}`,live:{title:`Lab ${An[ae.module].number} · ${An[ae.module].name}`,lines:l},actions:qh(ae),graph:a,rawGraph:i})}function Un(){const n=An[ae.module],e=ct(ae);document.querySelector(".lower-layout").classList.toggle("scope-layout",ae.module==="opamp"),document.querySelector("#lab-number").textContent=n.number,document.querySelector("#topic-label").textContent=n.topic,document.querySelector("#module-title").textContent=n.title,document.querySelector("#module-description").textContent=n.description,document.querySelector("#new-attempt").hidden=ae.mode!=="build",document.querySelector("#bench-caption").textContent=e.representation?`${e.representation} circuit`:e.configuration?`${e.configuration} amplifier`:e.kind?`${e.kind} circuit`:"Two-source circuit";for(const t of document.querySelectorAll(".module-link")){const i=t.dataset.module===ae.module;t.classList.toggle("active",i),t.setAttribute("aria-current",i?"page":"false")}for(const t of document.querySelectorAll(".mode-switch button"))t.classList.toggle("active",t.dataset.action===ae.mode),t.setAttribute("aria-pressed",t.dataset.action===ae.mode?"true":"false");Hd(),Ey(),zl(),rr()}function eo(n){var e;/^(module:|explore$|build$|undo$|clear$|restore$|reset-circuit$|set:(representation|kind|configuration):)/.test(n)&&((e=Et==null?void 0:Et.cancelInteractions)==null||e.call(Et)),(n.startsWith("module:")||/set:(representation|kind|configuration):/.test(n))&&(gs=null,vn.active=!1),Wh(ae,n),Un(),/^(tool:ch[12]|scope-ground:)/.test(n)&&!Er.active&&!mi&&(no(!1),document.querySelector("#bench").scrollIntoView({block:"center",behavior:"instant"}))}fa.addEventListener("click",n=>{if(n.target.closest("#close-part")){gs=null,Un();return}const e=n.target.closest("[data-action]");if(e){eo(e.dataset.action);return}const t=n.target.closest("[data-remove-wire]");if(t){const i=ae.tool;ae.tool="remove",fl(ae,Number(t.dataset.removeWire)),ae.tool=i,Un();return}n.target.closest("[data-close]")&&n.target.closest("dialog").close()});fa.addEventListener("change",n=>{var t;const e=n.target;if(e.dataset.param&&(["representation","kind","configuration"].includes(e.dataset.param)&&((t=Et==null?void 0:Et.cancelInteractions)==null||t.call(Et)),oi(ae,e.dataset.param,Number.isNaN(Number(e.value))?e.value:Number(e.value)),Un()),e.dataset.scopeChannel){const i=e.dataset.scopeField;as(ae,`${e.dataset.scopeChannel}${i==="ground"?"Ground":""}`,e.value||null),Un()}(e.id==="red-probe"||e.id==="black-probe")&&(as(ae,e.id.split("-")[0],e.value||null),rr())});fa.addEventListener("input",n=>{const e=n.target;if(e.dataset.param&&e.type==="number"&&e.value!==""&&(oi(ae,e.dataset.param,Number(e.value)),rr()),n.target.id==="load-slider"&&(oi(ae,"load",zt.load[Number(n.target.value)]),document.querySelector("#param-load").value=ct(ae).load,rr(),zl()),n.target.id==="time-slider"){const t=ct(ae);t.playing=!1,oi(ae,"time",Number(n.target.value)*$n({...t,source:5}).tau),rr()}});document.querySelector("#add-wire").addEventListener("click",()=>{const n=document.querySelector("#wire-from").value,e=document.querySelector("#wire-to").value;ae.tool="wire",ae.selectedTerminal=null,Ns(ae,n),Ns(ae,e),Un()});document.querySelector(".brand").addEventListener("click",n=>{n.preventDefault(),eo("module:thevenin")});document.addEventListener("keydown",n=>{if(n.target.closest("input,textarea,select,button")||document.querySelector("dialog[open]"))return;const e={1:"tool:select",2:"tool:wire",3:"tool:red",4:"tool:black",5:"tool:remove",Escape:"cancel"};e[n.key]&&(n.preventDefault(),eo(e[n.key])),(n.ctrlKey||n.metaKey)&&n.key==="z"&&(n.preventDefault(),eo("undo"))});document.querySelector("#vr-preview-tab").addEventListener("click",()=>{const n=!mi;no(!1),mi=n,document.querySelector(".lab-layout").classList.toggle("vr-preview",mi),Et==null||Et.setPanelPreview(mi),document.querySelector("#vr-preview-tab").classList.toggle("active",mi),document.querySelector("#bench-tab").classList.toggle("active",!mi&&!kl)});document.querySelector("#reset-view").addEventListener("click",()=>Et==null?void 0:Et.resetView());function no(n){mi&&(mi=!1,Et==null||Et.setPanelPreview(!1),document.querySelector("#vr-preview-tab").classList.remove("active")),document.querySelector(".lab-layout").classList.remove("vr-preview"),kl=n,document.querySelector("#schematic").hidden=!n,document.querySelector("#bench-tab").classList.toggle("active",!n),document.querySelector("#reference-tab").classList.toggle("active",n),document.querySelector("#bench").style.visibility=n?"hidden":"visible",document.querySelector(".stage-bottom").hidden=n,document.querySelector(".stage-top").hidden=n}document.querySelector("#bench-tab").addEventListener("click",()=>no(!1));document.querySelector("#reference-tab").addEventListener("click",()=>no(!0));function wy(){document.querySelector("#vr-help-status").textContent=Er.message,document.querySelector("#guide-dialog").showModal()}for(const n of["guide-button","model-guide"])document.getElementById(n).addEventListener("click",wy);function Ty(){try{const e=new URL((window.location.protocol==="https:",window.location.href));return e.hash="",e.searchParams.delete("inspect-vr"),e.protocol==="https:"?e.href:null}catch{return null}}function Oh(n){Er=n;const e={checking:"Checking VR…",entering:"Opening VR…",active:"Exit VR",ready:"Enter VR",error:"Try VR again"},t=n.active?"Exit VR":e[n.kind]||(n.supported?"Enter VR":"Use a headset"),i=document.querySelector("#vr-button");i.innerHTML=Di("vr")+" "+t,i.title=n.message,i.disabled=n.kind==="checking"||n.kind==="entering",i.classList.toggle("vr-ready",n.supported);for(const s of["vr-status","headset-status","vr-help-status"])document.getElementById(s).textContent=n.message;const r=document.querySelector("#headset-enter");if(r.hidden=!n.supported||n.active,r.disabled=n.kind==="entering"||n.kind==="checking",document.querySelector("#headset-check").disabled=n.kind==="checking"||n.kind==="entering"||n.active,document.body.classList.toggle("in-vr",n.active),n.active)for(const s of document.querySelectorAll("dialog[open]"))s.close()}function $d(){var i;const n=Ty(),e=document.querySelector("#headset-address");e.innerHTML=n?`<span>Headset link</span><a href="${Tt(n)}" target="_blank" rel="noopener">${Tt(n)}</a><button class="button subtle" id="copy-headset-link">Copy link</button><small id="copy-headset-status" role="status"></small>`:"<p>This local address works on this computer. A standalone headset needs the lab’s HTTPS link.</p>",(i=document.querySelector("#copy-headset-link"))==null||i.addEventListener("click",async()=>{const r=document.querySelector("#copy-headset-status");try{await navigator.clipboard.writeText(n),r.textContent="Link copied"}catch{r.textContent="Select and copy the link above."}});const t=document.querySelector("#headset-fullscreen");t.hidden=window.self===window.top,t.href=window.location.href,document.querySelector("#headset-status").textContent=Er.message,document.querySelector("#headset-dialog").showModal()}function qd(){!Et||Er.kind==="entering"||(Er.supported||Er.active?(no(!1),Et.enterVR()):$d())}document.querySelector("#vr-button").addEventListener("click",qd);document.querySelector("#headset-enter").addEventListener("click",qd);document.querySelector("#headset-help").addEventListener("click",$d);document.querySelector("#headset-check").addEventListener("click",()=>Et==null?void 0:Et.refreshVRSupport());document.querySelector("#vr-preview-tab").hidden=!new URLSearchParams(window.location.search).has("inspect-vr");for(const n of document.querySelectorAll("dialog"))n.addEventListener("click",e=>{if(e.target===n){const t=n.getBoundingClientRect();(e.clientX<t.left||e.clientX>t.right||e.clientY<t.top||e.clientY>t.bottom)&&n.close()}});try{Et=ly({container:document.querySelector("#bench"),onFrame:Bl,onPanelPreviewChange:n=>{mi=n,document.querySelector(".lab-layout").classList.toggle("vr-preview",n),document.querySelector("#vr-preview-tab").classList.toggle("active",n),document.querySelector("#bench-tab").classList.toggle("active",!n&&!kl)},onTerminal:n=>{Ns(ae,n),Un()},onWire:n=>{fl(ae,n),Un()},onWireMove:(n,e,t)=>{cu(ae,n,e,t),Un()},onManipulation:(n,e)=>{n==="begin"?uf(ae,e.input):n==="end"&&hf(ae,e.input)},onDisconnect:n=>{cu(ae,n,0,null),Un()},onConnect:(n,e)=>{const t=ae.tool;ae.tool="wire",ae.selectedTerminal=null,Ns(ae,n),Ns(ae,e),ae.tool=t,Un()},onProbe:(n,e)=>{as(ae,n,e),Un()},onChange:(n,e)=>{var t;if(n==="meterMode"){Vd=e,rr();return}["representation","kind","configuration"].includes(n)&&((t=Et==null?void 0:Et.cancelInteractions)==null||t.call(Et)),oi(ae,n,e),Un()},onGraphCursor:sa,onPart:n=>{gs=n,Un()},onHover:n=>{const e=document.querySelector("#hover-label");e.hidden=!n,e.textContent=n?n.label:""},onAction:eo,onXRStatus:Oh})}catch(n){Oh({kind:"unavailable",supported:!1,active:!1,message:"3D could not start in this browser. Open the lab in a headset browser."}),document.querySelector("#bench").innerHTML=`<div class="webgl-error"><h2>3D rendering is unavailable</h2><p>${Tt(n.message)}</p><p>You can still use the circuit reference and terminal controls below.</p></div>`}Un();let Fh=performance.now(),kh=0;function Bl(n){const e=Math.min((n-Fh)/1e3,.1);Fh=n;const t=ae.params.transient;t.playing&&ae.module==="transient"&&Ct(ae).correct&&(mf(ae,e),(!t.playing||n-kh>100)&&(kh=n,rr())),Et||requestAnimationFrame(Bl)}Et||requestAnimationFrame(Bl);
