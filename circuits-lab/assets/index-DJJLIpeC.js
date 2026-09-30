(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();const Sn={thevenin:{number:"05",short:"Equivalent circuits",title:"Thévenin and Norton",name:"Thévenin & Norton",topic:"Thévenin, Norton & maximum power transfer",description:"Compare load voltage, current and power.",purpose:"Build equivalent circuits, verify the same load behaviour, and find maximum load power.",steps:["Wire the original network. Measure load voltage, current and power at 250, 500 and 1000 Ω.","Switch to Thévenin and Norton. Set their source and resistance values, then wire each equivalent.","Repeat the same loads. Compare all three circuits using your paper measurements.","Vary the load and inspect the calculated power sweep. Find the load that receives maximum power."],challenge:"Wire the original circuit and its Thévenin and Norton equivalents. Compare readings at 250, 500 and 1000 Ω, then vary the load to find maximum power. Write your results on paper.",principle:"Equivalent circuits preserve voltage and current at the load terminals. Their internal behaviour can differ.",defaults:{representation:"original",load:500,equivalentVoltage:6,equivalentResistance:500,nortonCurrent:12}},superposition:{number:"06",short:"Source contributions",title:"Superposition",name:"Superposition",topic:"Superposition in linear DC circuits",description:"Measure each source’s contribution.",purpose:"Add signed source contributions and explain how two active sources can cancel one branch current.",steps:["Wire the network with A at +6 V and B at −3 V. Read the branch current with both sources active.","Select A alone, then B alone. Replace each inactive ideal voltage source with a short.","Compare the signed contributions with the complete circuit. Add currents on paper, not powers.","Keep both sources active and adjust B until branch current is zero. Check which other branches still carry current."],challenge:"Compare A alone, B alone and both at +6 V / −3 V. Short each inactive voltage source. Adjust source B until the branch current is zero, then compare the signed contributions. Write your explanation on paper.",principle:"Add signed voltage or current contributions. Power must be calculated from the combined result.",defaults:{v1:6,v2:3,sourceMode:"both",replacement:"short",sumMilliamp:null,explanation:"unset"}},opamp:{number:"07",short:"Gain & clipping",title:"Operational amplifiers",name:"Operational amplifiers",topic:"Closed-loop gain & output clipping",description:"Set the gain and check for clipping.",purpose:"Design a gain with resistors, then find the largest input before output clipping.",steps:["Choose the amplifier circuit assigned in your lab sheet. For this example, start with the inverting circuit.","For a first design, use the inverting circuit at gain −3. Set Rin and Rf, wire feedback, and connect both supplies.","Connect CH1 to input and CH2 to output, with both grounds at GND. Set a readable timebase and voltage scales.","Increase input amplitude until clipping begins. Change the supplies or signal frequency and compare the traces."],challenge:"At ±12 V and 100 Hz, build an inverting amplifier with gain −3. Connect CH1 to Vin and CH2 to Vout, with both grounds at GND. Increase the input until clipping appears. Put measurements and calculations on paper.",principle:"Negative feedback sets the gain only while the amplifier operates within its limits.",defaults:{configuration:"inverting",rin:1e4,rf:2e4,amplitude:1,rail:12,frequency:100,prediction:0,timeDiv:2,ch1Scale:1,ch2Scale:5,triggerEdge:"rising",triggerLevel:0,scopeRunning:!0,scopeGroundChannel:"ch1"}},transient:{number:"08",short:"Energy & time",title:"RC and RL response",name:"RC & RL transients",topic:"First-order RC & RL transient response",description:"Measure charging and decay.",purpose:"Predict how resistance changes response speed, then test both RC and RL circuits.",steps:["Wire RC. On paper, predict whether increasing R makes the response faster or slower.","Run from zero energy. Watch voltage, current and stored energy; pause, slow, replay or drag through the acquired trace.","Increase R and repeat from zero energy. Use the same playback speed and compare the time to reach the same fraction of the final value.","Repeat with RL, then switch each circuit to Return to observe decay. Compare both trends with your predictions."],challenge:"Wire the RC and RL circuits. Run charging and decay, compare voltage and current, and change R to see its effect on response time. Use pause, replay and the time cursor. Put predictions and measurements on paper.",principle:"Capacitor voltage and inductor current remain continuous through switching in these ideal circuits.",defaults:{kind:"RC",resistance:1e3,capacitance:1e-4,inductance:.1,charging:!0,initial:0,time:0,acquiredTime:0,playing:!1,speed:1,predictionChoice:"unset"}}},ln=(n,e,t,i)=>({id:n,label:e,x:t,z:i}),Yi=(n,e,t,i,r,s,o)=>({id:n,label:e,type:t,value:i,x:r,z:s,pins:o}),Rr=()=>Yi("ground","GND","ground","0 V",-.7,.69,[ln("gnd","GND",-.7,.61)]),ki=(n,e,t,i,r)=>Yi(n,e,"V",t,i,r,[ln(`${n}+`,"+",i,r-.22),ln(`${n}-`,"−",i,r+.22)]),ir=(n,e,t,i,r)=>Yi(n,e,"R",t,i,r,[ln(`${n}a`,"A",i-.29,r),ln(`${n}b`,"B",i+.29,r)]),Cr=(n,e,t,i,r)=>Yi(n,e,"R",t,i,r,[ln(`${n}a`,"+",i,r-.26),ln(`${n}b`,"−",i,r+.26)]),hi=(n,e)=>({id:n,type:"R",a:`${n}a`,b:`${n}b`,value:e}),Zs=(n,e)=>({id:n,type:"V",a:`${n}+`,b:`${n}-`,value:e});function Gl(n,e){let t,i,r=[],s,o;if(n==="thevenin"&&(e.representation==="original"?(t=[ki("s","DC SOURCE","12 V",-1.14,-.03),ir("r1","R₁","1 kΩ",-.36,-.46),Cr("r2","R₂","1 kΩ",.23,.08),Cr("load","LOAD",`${e.load} Ω`,1.1,.08),Rr()],i=[["s+","r1a"],["r1b","r2a"],["r2a","loada"],["r2b","gnd"],["loadb","gnd"],["s-","gnd"]],r=[Zs("s",12),hi("r1",1e3),hi("r2",1e3),hi("load",e.load)]):e.representation==="thevenin"?(t=[ki("s","Vth",`${e.equivalentVoltage} V`,-1,-.02),ir("req","Rth",`${e.equivalentResistance} Ω`,0,-.46),Cr("load","LOAD",`${e.load} Ω`,1,.02),Rr()],i=[["s+","reqa"],["reqb","loada"],["loadb","gnd"],["s-","gnd"]],r=[Zs("s",e.equivalentVoltage),hi("req",e.equivalentResistance),hi("load",e.load)]):(t=[Yi("s","In ↑","I",`${e.nortonCurrent} mA`,-1,-.02,[ln("s+","OUT",-1,-.28),ln("s-","IN",-1,.24)]),Cr("req","Rn",`${e.equivalentResistance} Ω`,0,.02),Cr("load","LOAD",`${e.load} Ω`,1,.02),Rr()],i=[["s+","reqa"],["reqa","loada"],["reqb","gnd"],["loadb","gnd"],["s-","gnd"]],r=[{id:"s",type:"I",a:"s-",b:"s+",value:e.nortonCurrent/1e3},hi("req",e.equivalentResistance),hi("load",e.load)]),s="loada",o="load"),n==="superposition"){const a=e.sourceMode!=="b",l=e.sourceMode!=="a";t=[ki("a","SOURCE A",a?`+${e.v1} V`:e.replacement==="short"?"0 V · SHORT":"OPEN",-1.18,-.08),ki("b","SOURCE B",l?`−${e.v2} V`:e.replacement==="short"?"0 V · SHORT":"OPEN",1.18,-.08),ir("r1","R₁","1 kΩ",-.51,-.55),ir("r2","R₂","1 kΩ",.51,-.55),Cr("load","BRANCH","1 kΩ",0,.17),Rr()],i=[["a+","r1a"],["r1b","loada"],["r2a","loada"],["r2b","b+"],["a-","gnd"],["b-","gnd"],["loadb","gnd"]],r=[hi("r1",1e3),hi("r2",1e3),hi("load",1e3)],(a||e.replacement==="short")&&r.push(Zs("a",a?e.v1:0)),(l||e.replacement==="short")&&r.push(Zs("b",l?-e.v2:0)),s="loada",o="load"}return n==="opamp"&&(t=[ki("signal","INPUT",`${e.amplitude} Vpk`,-1.18,-.19),ir("rin","Rin",`${e.rin/1e3} kΩ`,-.54,-.5),Yi("op","OP AMP","opamp",`±${e.rail} V`,.15,-.07,[ln("op+","+",-.12,.06),ln("op-","−",-.12,-.22),ln("out","OUT",.55,-.07),ln("vp","V+",.2,-.42),ln("vn","V−",.2,.26)]),ir("rf","Rf",`${e.rf/1e3} kΩ`,.43,.54),ki("plus","+ SUPPLY",`${e.rail} V`,1.12,-.41),ki("minus","− SUPPLY",`${e.rail} V`,1.12,.37),Rr()],i=[["signal-","gnd"],["rfb","out"],["rfa","op-"],["rinb","op-"],["plus+","vp"],["plus-","gnd"],["minus+","gnd"],["minus-","vn"]],i.push(...e.configuration==="inverting"?[["signal+","rina"],["op+","gnd"]]:[["signal+","op+"],["rina","gnd"]]),s="out"),n==="transient"&&(t=[ki("s","DC SOURCE","5 V",-1.19,.06),Yi("sw","SPDT SWITCH","switch",e.charging?"SOURCE":"RETURN",-.62,-.39,[ln("supply","5 V",-.83,-.58),ln("common","COM",-.36,-.39),ln("return","0 V",-.75,-.18)]),ir("r","RESISTOR",`${e.resistance} Ω`,.2,-.46),Yi("storage",e.kind==="RC"?"CAPACITOR":"INDUCTOR",e.kind==="RC"?"C":"L",e.kind==="RC"?"100 μF":"100 mH",1.03,.1,[ln("storagea","+",1.03,-.17),ln("storageb","−",1.03,.37)]),Rr()],i=[["s+","supply"],["s-","gnd"],["return","gnd"],["common","ra"],["rb","storagea"],["storageb","gnd"]],s="storagea"),{components:t,wires:i,electrical:r,positive:s,negative:"gnd",sensor:o,pins:t.flatMap(a=>a.pins.map(l=>({...l,name:`${a.label} ${l.label}`})))}}function Cs(n,e){const t=Object.fromEntries(e.map(r=>[typeof r=="string"?r:r.id,typeof r=="string"?r:r.id])),i=r=>t[r]===r||t[r]===void 0?r:t[r]=i(t[r]);for(const[r,s]of n)r in t&&s in t&&(t[i(r)]=i(s));return Object.fromEntries(Object.keys(t).map(r=>[r,i(r)]))}function bd(n,e){const t=Cs(n.wires,n.pins),i=Cs(e,n.pins);return n.pins.every(r=>n.pins.every(s=>t[r.id]===t[s.id]==(i[r.id]===i[s.id])))}const kt={load:[100,250,500,750,1e3,1500,2e3],equivalentVoltage:[2,3,4,5,6,7,8,9,10,12],equivalentResistance:[100,250,500,750,1e3,1500,2e3],nortonCurrent:[4,6,8,10,12,14,16,18,20],v1:[0,1,2,3,4,5,6,7,8,9,10,11,12],v2:[0,1,2,3,4,5,6,7,8,9,10,11,12],rin:[5e3,1e4,2e4],rf:[1e4,2e4,3e4,4e4,5e4,1e5],rail:[5,9,12,15],frequency:[10,50,100,500,1e3],amplitude:[.25,.5,1,2,3,3.5,3.6,3.7,4,5,6],prediction:Array.from({length:101},(n,e)=>e/10),resistance:[100,200,250,500,1e3,2e3,5e3,1e4],speed:[.25,.5,1,2],sumMilliamp:Array.from({length:161},(n,e)=>(e-80)/10),explanation:["unset","opposing","sources-off","whole-circuit-zero"],predictionChoice:["unset","slower","faster","same"],timeDiv:[.02,.05,.1,.2,.4,.5,1,2,4,5,10,20,50],ch1Scale:[.1,.2,.5,1,2,5,10],ch2Scale:[.1,.2,.5,1,2,5,10],triggerLevel:[-10,-5,-2,-1,-.5,0,.5,1,2,5,10],triggerEdge:["rising","falling"]},Ps=(n,e)=>{if(typeof n!="number"||!Number.isFinite(n))throw new RangeError(`${e} must be a finite number.`);return n},pr=(n,e)=>{if(Ps(n,e),n<=0)throw new RangeError(`${e} must be greater than zero.`);return n},Wr=(n,e)=>{if(Ps(n,e),n<0)throw new RangeError(`${e} cannot be negative.`);return n},Ls=n=>Object.is(n,-0)?0:n;function yd(n,e){const t=e.length;if(!t)return[];const i=n.map((l,c)=>{const u=Math.max(...l.map(Math.abs));return u?[...l.map(h=>h/u),e[c]/u]:[...l,e[c]]}),r=1e-12;let s=0;const o=[];for(let l=0;l<t&&s<t;l+=1){let c=s;for(let h=s+1;h<t;h+=1)Math.abs(i[h][l])>Math.abs(i[c][l])&&(c=h);if(Math.abs(i[c][l])<=r)continue;[i[s],i[c]]=[i[c],i[s]];const u=i[s][l];for(let h=l;h<=t;h+=1)i[s][h]/=u;for(let h=s+1;h<t;h+=1){const d=i[h][l];for(let f=l;f<=t;f+=1)i[h][f]-=d*i[s][f];i[h][l]=0}o.push(l),s+=1}for(let l=s;l<t;l+=1)if(i[l].slice(0,t).every(c=>Math.abs(c)<=r)&&Math.abs(i[l][t])>1e-9)throw new Error("Inconsistent circuit: check for a shorted voltage source, conflicting ideal voltage sources, or a current source without a return path.");if(s<t)throw new Error("Singular circuit: connect floating nodes to a reference and remove redundant ideal voltage sources. Voltages or source currents are not uniquely determined.");const a=Array(t).fill(0);for(let l=t-1;l>=0;l-=1){const c=o[l];a[c]=i[l][t];for(let u=c+1;u<t;u+=1)a[c]-=i[l][u]*a[u]}if(a.some(l=>!Number.isFinite(l)))throw new Error("Numerical failure: check component values and circuit connections.");for(let l=0;l<t;l+=1){const c=n[l].reduce((h,d,f)=>h+d*a[f],0),u=Math.abs(e[l])+n[l].reduce((h,d,f)=>h+Math.abs(d*a[f]),0);if(Math.abs(c-e[l])>1e-8*Math.max(u,1e-12))throw new Error("Numerically unstable circuit: use a well-conditioned network with a valid reference.")}return a}function Wl({components:n=[],wires:e=[]}={}){try{if(!Array.isArray(n)||!n.length)throw new Error("Add at least one component to the circuit.");if(!Array.isArray(e))throw new Error("Wires must be an array of pin pairs.");const t=new Map([["gnd","gnd"]]),i=M=>{if(typeof M!="string"||!M.length)throw new Error("Every terminal must have a nonempty string pin name.");return t.has(M)||t.set(M,M),M},r=M=>{let T=M;for(;t.get(T)!==T;)T=t.get(T);for(;t.get(M)!==M;){const C=t.get(M);t.set(M,T),M=C}return T},s=new Set;let o=!1;for(const M of n){if(!M||typeof M.id!="string"||!M.id.length||s.has(M.id))throw new Error("Each component requires a unique, nonempty id.");if(s.add(M.id),!["R","V","I"].includes(M.type))throw new Error(`Unsupported component type: ${M.type}.`);i(M.a),i(M.b),o||(o=M.a==="gnd"||M.b==="gnd"),Ps(M.value,`${M.id} value`),M.type==="R"&&pr(M.value,`${M.id} resistance`)}for(const M of e){if(!Array.isArray(M)||M.length!==2)throw new Error("Each wire must contain exactly two pin names.");const T=i(M[0]),C=i(M[1]);o||(o=T==="gnd"||C==="gnd"),t.set(r(T),r(C))}if(!o)throw new Error("Missing reference: connect the circuit common node to 'gnd'.");const a=r("gnd"),l=[...new Set([...t.keys()].map(r))].filter(M=>M!==a),c=new Map(l.map((M,T)=>[M,T])),u=M=>c.get(r(M)),h=n.filter(M=>M.type==="V"),d=new Map(h.map((M,T)=>[M.id,l.length+T])),f=l.length+h.length,g=Array.from({length:f},()=>Array(f).fill(0)),_=Array(f).fill(0),m=(M,T,C)=>{M!==void 0&&T!==void 0&&(g[M][T]+=C)};for(const M of n){const T=u(M.a),C=u(M.b);if(M.type==="R"){const P=1/M.value;if(!Number.isFinite(P))throw new Error("Resistance is outside the supported numerical range.");m(T,T,P),m(C,C,P),m(T,C,-P),m(C,T,-P)}else if(M.type==="I")T!==void 0&&(_[T]-=M.value),C!==void 0&&(_[C]+=M.value);else{const P=d.get(M.id);m(T,P,1),m(C,P,-1),m(P,T,1),m(P,C,-1),_[P]=M.value}}const p=yd(g,_),x=M=>r(M)===a?0:Ls(p[u(M)]),y=Object.fromEntries([...t.keys()].map(M=>[M,x(M)])),b=Object.fromEntries(n.map(M=>[M.id,Ls(M.type==="R"?(x(M.a)-x(M.b))/M.value:M.type==="I"?M.value:p[d.get(M.id)])]));return{ok:!0,voltages:y,currents:b,error:null}}catch(t){return{ok:!1,voltages:{},currents:{},error:t.message}}}function Md({configuration:n="inverting",rin:e=1e4,rf:t=2e4,amplitude:i=1,rail:r=12,headroom:s=1,frequency:o=100,time:a=0,powered:l=!0,feedback:c=!0}={}){pr(e,"Input resistance"),Wr(t,"Feedback resistance"),Wr(i,"Input amplitude"),Wr(r,"Supply rail magnitude"),Wr(s,"Output headroom"),pr(o,"Frequency"),Wr(a,"Time");let u;if(n==="inverting")u=-t/e;else if(n==="noninverting"||n==="non-inverting")u=1+t/e;else if(n==="follower")u=1;else throw new RangeError("Configuration must be inverting, noninverting, or follower.");const h=i*Math.sin(2*Math.PI*o*a),d=Math.max(0,r-s),f=Math.abs(u)*i,g=n==="inverting"?-1:1;let _=0,m=0,p=!1,x="powered-off";return l&&d>0&&(c?(_=Math.max(-d,Math.min(d,u*h)),m=Math.min(d,f),p=f>d,x=p?"saturated":"linear"):(_=Math.sign(g*h)*d,m=i>0?d:0,p=i>0,x="open-loop")),{gain:u,input:h,output:Ls(_),limit:d,maxInput:c?u===0?1/0:d/Math.abs(u):0,clipped:p,peakOutput:m,modelState:x}}function Hn({kind:n="RC",resistance:e=1e3,capacitance:t=1e-4,inductance:i=.1,source:r=5,time:s=0,initial:o=0,charging:a=!0}={}){if(pr(e,"Resistance"),Ps(r,"Source voltage"),Ps(o,"Initial storage value"),Wr(s,"Time"),!["RC","RL"].includes(n))throw new RangeError("Transient kind must be RC or RL.");const l=a?r:0,c=n==="RC"?pr(t,"Capacitance"):pr(i,"Inductance"),u=n==="RC"?e*c:c/e;pr(u,"Time constant");const h=n==="RC"?l:l/e,d=h+(o-h)*Math.exp(-s/u),f=n==="RC"?d:l-e*d,g=n==="RC"?(l-d)/e:d;return{tau:u,voltage:Ls(f),current:Ls(g),energy:.5*c*d*d,final:h,storageValue:d}}const Vt=(n,e=3)=>Number.isFinite(n)?Number(n.toFixed(e)).toLocaleString("en-US",{maximumFractionDigits:e}):"—",rr=(n,e,t=.01)=>Number.isFinite(n)&&Math.abs(n-e)<=Math.max(Math.abs(e)*t,1e-8);function Sd(){return{module:"thevenin",mode:"explore",params:Object.fromEntries(Object.entries(Sn).map(([n,e])=>[n,{...e.defaults}])),wireSets:{},probeSets:{},scopeSets:{},scopeHolds:{},history:{},predictions:{},sumSubmissions:{},tool:"wire",selectedTerminal:null,records:[],attempts:Object.fromEntries(Object.keys(Sn).map(n=>[n,0])),challengeStarted:{},feedback:"Drag a lead between contacts; place the meter tips to measure.",checks:{},showGuide:!1,sequence:0}}const ct=n=>n.params[n.module];function Ed(n){const e=ct(n);return e.representation||e.configuration||e.kind||"main"}const Dn=n=>`${n.mode}:${n.module}:${Ed(n)}`;function Dt(n){const e=Gl(n.module,ct(n)),t=Dn(n);return n.wireSets[t]||(n.wireSets[t]=n.mode==="explore"?e.wires.map(i=>[...i]):[]),n.probeSets[t]||(n.probeSets[t]=n.mode==="explore"?{red:e.positive,black:"gnd"}:{red:null,black:null}),n.scopeSets[t]||(n.scopeSets[t]=Xa(n)),{circuit:e,wires:n.wireSets[t],probes:n.probeSets[t],scope:n.scopeSets[t],correct:bd(e,n.wireSets[t])}}const ri=n=>structuredClone(n);function Xa(n){const e=n.mode==="explore"&&n.module==="opamp";return{ch1:{signal:e?"signal+":null,ground:e?"gnd":null},ch2:{signal:e?"out":null,ground:e?"gnd":null}}}const Ds=new WeakMap,hh=n=>({wires:ri(n.wires),probes:ri(n.probes),scope:ri(n.scope)});function dh(n,e,t){var i;((i=n.history)[e]||(i[e]=[])).push(t),n.history[e].length>80&&n.history[e].splice(0,n.history[e].length-80)}function wd(n,e){if(e==null)return!1;let t=Ds.get(n);if(t||(t=new Map,Ds.set(n,t)),[...t.values()].some(o=>o.tokens.has(e)))return!1;const i=Dt(n),r=Dn(n);let s=t.get(r);return s||(s={tokens:new Set,snapshot:hh(i)},t.set(r,s)),s.tokens.add(e),!0}function Td(n,e){const t=Ds.get(n);if(!t)return!1;const i=[...t.entries()].find(([,a])=>a.tokens.has(e));if(!i)return!1;const[r,s]=i;if(s.tokens.delete(e),s.tokens.size||(t.delete(r),t.size||Ds.delete(n),!n.wireSets[r]||!n.probeSets[r]||!n.scopeSets[r]))return!0;const o={wires:n.wireSets[r],probes:n.probeSets[r],scope:n.scopeSets[r]};return JSON.stringify(s.snapshot)!==JSON.stringify(o)&&dh(n,r,s.snapshot),!0}function ts(n){var i;const e=Dt(n),t=Dn(n);(i=Ds.get(n))!=null&&i.has(t)||dh(n,t,hh(e))}const Ho=(n,e=ct(n).kind)=>`${n.mode}:${n.attempts.transient}:${e}`;function Mn(n,e=ct(n).kind){return n.predictions[Ho(n,e)]||{choice:"unset",locked:!1,late:!1,correct:!1,run:0,tested:!1}}function Pi(n){var t;if(n.module!=="transient")return;const e=Ho(n);n.predictions[e]={...Mn(n),tested:!0,late:!((t=n.predictions[e])!=null&&t.locked)}}function Ad(n){if(n.module!=="transient")return!1;const e=ct(n),t=Mn(n);return t.locked?(n.feedback="Prediction already locked for this circuit.",!1):t.late?(n.feedback="The trial has already started. Begin a new attempt to make a prediction first.",!1):["slower","faster","same"].includes(e.predictionChoice)?(n.predictions[Ho(n)]={choice:e.predictionChoice,locked:!0,late:!1,tested:!1,run:t.run,correct:e.predictionChoice===(e.kind==="RC"?"slower":"faster"),kind:e.kind,resistance:e.resistance,sequence:++n.sequence},n.feedback="Prediction saved. Now change R and test it.",!0):(n.feedback="Choose slower, faster or unchanged, then lock your prediction.",!1)}const fh=(n,e,t)=>`${n.mode}:${n.attempts.superposition}:${e}:${t}`;function Rd(n,e=n.module){return n.records.filter(t=>t.module===e&&t.mode===n.mode&&t.attempt===n.attempts[e]&&t.measurement.correct&&t.measurement.probesCorrect)}function ph(n,e=n.params.superposition.v1,t=n.params.superposition.v2){const i=Rd(n,"superposition").filter(r=>r.params.v1===e&&r.params.v2===t&&(r.params.sourceMode==="both"||r.params.replacement==="short"));return Object.fromEntries(["a","b","both"].map(r=>[r,i.find(s=>s.params.sourceMode===r)||null]))}function Cd(n){if(n.module!=="superposition")return!1;const e=ct(n),t=ph(n);if(!t.a||!t.b||!t.both)return n.feedback="Record A alone, B alone and both at the same source settings first.",!1;if(!Number.isFinite(e.sumMilliamp))return n.feedback="Enter the signed sum in mA.",!1;const i=(t.a.measurement.current+t.b.measurement.current)*1e3,r=t.both.measurement.current*1e3,s=Math.abs(e.sumMilliamp-i)<=.01&&Math.abs(e.sumMilliamp-r)<=.01;return n.sumSubmissions[fh(n,e.v1,e.v2)]={answerMilliamp:e.sumMilliamp,sumMilliamp:i,measuredMilliamp:r,passed:s,v1:e.v1,v2:e.v2,recordIds:Object.fromEntries(Object.entries(t).map(([o,a])=>[o,a.id])),sequence:++n.sequence},n.feedback=s?"The signed sum matches the measured current with both sources.":"Check the signs. Add currents, then compare with the both-source reading.",s}function mh(n){const e=ct(n),{wires:t,correct:i}=Dt(n),r=Object.fromEntries(["a","b","both"].map(a=>{const l=Gl("superposition",{...e,sourceMode:a}),c=Wl({components:l.electrical,wires:t});if(!c.ok)return[a,{valid:!1,current:null,voltage:null,power:null,error:c.error}];const u=c.voltages[l.positive]-c.voltages.loadb,h=c.currents.load;return[a,{valid:!0,current:h,voltage:u,power:u*h,branchCurrents:{r1:c.currents.r1,r2:c.currents.r2,load:h},error:null}]})),s=Object.values(r).every(a=>a.valid),o=[...new Set(Object.values(r).map(a=>a.error).filter(Boolean))];return i||o.push("Current wiring differs from the circuit diagram."),e.replacement!=="short"&&o.push("Open replacements do not give additive contributions. Select Short."),{live:r,valid:s,topologyCorrect:i,superpositionValid:s&&e.replacement==="short",error:o.join(" ")||null}}function $l(n){const e=ct(n);if(n.module==="superposition"){const t=ph(n),i=n.sumSubmissions[fh(n,e.v1,e.v2)]||null;return{kind:"superposition",...mh(n),recorded:Object.fromEntries(Object.entries(t).map(([r,s])=>[r,s?{id:s.id,current:s.measurement.current,voltage:s.measurement.voltage,power:s.measurement.power}:null])),sumMilliamp:e.sumMilliamp,explanation:e.explanation,sumSubmitted:!!i,submission:i}}return n.module==="transient"?{kind:"transient",prediction:{...Mn(n),choice:Mn(n).locked?Mn(n).choice:e.predictionChoice,expected:Mn(n).tested?e.kind==="RC"?"slower":"faster":null},predictions:{RC:Mn(n,"RC"),RL:Mn(n,"RL")},playback:{speed:e.speed,baselineTau:e.kind==="RC"?.1:.001,secondsPerBaselineTau:2}}:n.module==="opamp"?{kind:"opamp",scope:Ui(n)}:{kind:n.module}}function Pd(n,e){const t=n.params.transient;if(n.module!=="transient"||!t.playing||!Number.isFinite(e)||e<=0||!Dt(n).correct)return t.time;Pi(n);const i=t.kind==="RC"?.1:.001;return t.time=Math.min(t.time+e*i*t.speed/2,5*Hn({...t,source:5}).tau),t.acquiredTime=Math.max(t.acquiredTime||0,t.time),t.time>=5*Hn({...t,source:5}).tau&&(t.playing=!1),t.time}function Fc(n,e,t){const i=Cs(e,n.pins),r={};for(const[s,o]of Object.entries(t))for(const[a,l]of Object.entries(i))l===i[s]&&(r[a]=o);return r}function Zi(n,e){const t=ct(n),{circuit:i,wires:r,probes:s,correct:o}=Dt(n);let a,l={},c,u,h,d,f,g,_,m,p;if(n.module==="thevenin"||n.module==="superposition")a=Wl({components:i.electrical,wires:r}),l=a.voltages||{},a.ok&&(c=l[i.positive]-l.loadb,u=a.currents.load,h=c*u);else if(n.module==="opamp")if(!o)a={ok:!1,error:"Connect the amplifier, feedback and both supplies."};else{a={...Md({...t,headroom:1,time:e??1/(4*t.frequency)}),ok:!0},{gain:d,maxInput:g}=a,f=a.peakOutput;const T=t.configuration==="inverting"?(a.input/t.rin+a.output/t.rf)/(1/t.rin+1/t.rf):a.output*t.rin/(t.rin+t.rf);l=Fc(i,r,{gnd:0,"signal+":a.input,out:a.output,"op-":T,vp:t.rail,vn:-t.rail}),c=a.output}else o?(a={...Hn({...t,source:5,time:e??t.time}),ok:!0},{voltage:c,current:u,tau:_,energy:m,storageValue:p}=a,l=Fc(i,r,{gnd:0,"s+":5,common:t.charging?5:0,storagea:c})):a={ok:!1,error:"Connect the source, switch, resistor and storage loop."};const x=a.ok&&s.red&&s.black&&Number.isFinite(l[s.red])&&Number.isFinite(l[s.black]),y=x?l[s.red]-l[s.black]:null,b=Cs(r,i.pins),M=!!x&&b[s.red]===b[i.positive]&&b[s.black]===b[i.negative];return{...a,voltage:c,current:u,power:h,gain:d,peak:f,maxInput:g,tau:_,energy:m,storageValue:p,voltages:l,probeVoltage:y,probeReady:x,probesCorrect:M,correct:o}}const kc=new WeakMap;function Ld(n){const e=ct(n),t=Dt(n);return JSON.stringify({configuration:e.configuration,rin:e.rin,rf:e.rf,amplitude:e.amplitude,rail:e.rail,frequency:e.frequency,timeDiv:e.timeDiv,ch1Scale:e.ch1Scale,ch2Scale:e.ch2Scale,triggerEdge:e.triggerEdge,triggerLevel:e.triggerLevel,wires:t.wires,scope:t.scope})}function Ui(n){if(n.module!=="opamp")return{ok:!1,correct:!1,error:"The scope is available in the amplifier lab.",channels:{},running:!1,stale:!1};const e=ct(n),t=Dt(n),i=Ld(n),r=n.scopeHolds[Dn(n)];if(!e.scopeRunning&&r){const y=r.signature!==i;return{...ri(r),running:!1,stale:y,correct:r.correct&&!y,error:y?"Held trace is from different settings. Run the scope to acquire the current circuit.":r.error}}const s=kc.get(n);if((s==null?void 0:s.signature)===i)return{...s,running:e.scopeRunning};const o=Zi(n,0),a=Cs(t.wires,t.circuit.pins),l=Object.fromEntries(["ch1","ch2"].map(y=>{const b=t.scope[y],M=b.signal,T=b.ground,C=!!(o.ok&&M&&T&&Number.isFinite(o.voltages[M])&&Number.isFinite(o.voltages[T])&&a[T]===a.gnd),P=y==="ch1"?"signal+":"out",E=C&&a[M]===a[P],S=o.ok?!M||!T?`${y.toUpperCase()}: connect signal and ground.`:a[T]!==a.gnd?`${y.toUpperCase()} ground must connect to GND.`:Number.isFinite(o.voltages[M])?null:`${y.toUpperCase()}: signal is floating or unavailable.`:o.error;return[y,{signal:M,ground:T,valid:C,correct:E,error:S,scale:e[`${y}Scale`],points:[]}]})),c=(y,b)=>y.voltages[l[b].signal]-y.voltages[l[b].ground],u=1/e.frequency,h={edge:e.triggerEdge,level:e.triggerLevel,found:!1,time:0};if(l.ch1.valid){let y=c(o,"ch1");for(let b=1;b<=200;b++){const M=b*u/200,T=c(Zi(n,M),"ch1"),C=y<=e.triggerLevel&&T>e.triggerLevel,P=y>=e.triggerLevel&&T<e.triggerLevel;if(e.triggerEdge==="rising"&&C||e.triggerEdge==="falling"&&P){const E=(e.triggerLevel-y)/(T-y);h.found=!0,h.time=(b-1+E)*u/200;break}y=T}}const d=e.timeDiv*10/1e3,f=d>u*20*1.000001,g=Math.max(200,Math.ceil(d/u*64));for(let y=0;!f&&y<=g&&!(!l.ch1.valid&&!l.ch2.valid);y++){const b=y*d/g,M=Zi(n,b+h.time);for(const T of["ch1","ch2"])l[T].valid&&l[T].points.push([b*1e3,c(M,T)])}for(const y of["ch1","ch2"]){const b=l[y];b.peak=b.points.length?Math.max(...b.points.map(([,M])=>Math.abs(M))):null,b.cropped=b.valid&&b.peak>b.scale*4*1.001}const _=!f&&l.ch1.correct&&l.ch2.correct&&!l.ch1.cropped&&!l.ch2.cropped&&h.found&&d>=u*.999,p=[...new Set(Object.values(l).map(y=>y.error).filter(Boolean))].join(" ")||(f?"Timebase exceeds 20 periods. Reduce ms/div or use Autoscale to avoid undersampling.":h.found?l.ch1.cropped||l.ch2.cropped?"A trace exceeds the display. Increase V/div or use Autoscale.":d<u?"Increase time/div to show a complete period.":null:"Waiting for the selected CH1 trigger crossing."),x={ok:!f&&(l.ch1.valid||l.ch2.valid),correct:_,error:p,channels:l,timeDiv:e.timeDiv,trigger:h,running:e.scopeRunning,stale:!1,signature:i,timebaseTooWide:f,acquisition:{params:ri(e),wires:ri(t.wires),scope:ri(t.scope),sequence:n.sequence},duration:d,clipped:o.clipped,limits:[-e.rail+1,e.rail-1]};return kc.set(n,x),x}function ns(n,e,t){var s;const i=Dt(n);if(t!==null&&!i.circuit.pins.some(o=>o.id===t)||!["red","black","ch1","ch2","ch1Ground","ch2Ground"].includes(e)||!["red","black"].includes(e)&&n.module!=="opamp")return!1;if(ts(n),e==="red"||e==="black")i.probes[e]=t;else{const o=e.startsWith("ch1")?"ch1":"ch2";i.scope[o][e.endsWith("Ground")?"ground":"signal"]=t}const r=((s=i.circuit.pins.find(o=>o.id===t))==null?void 0:s.name)||"disconnected";return n.feedback=`${e==="red"?"Meter V tip":e==="black"?"Meter COM tip":e}: ${r}.`,n.selectedTerminal=null,n.checks[n.module]=null,n.sequence++,!0}function Bc(n,e,t,i){const r=Dt(n);if(!Number.isInteger(e)||e<0||e>=r.wires.length||![0,1].includes(t)||i!==null&&!r.circuit.pins.some(l=>l.id===i))return!1;const s=r.wires[e],o=[...s];if(o[t]=i,i!==null&&(i===s[t]||o[0]===o[1]||r.wires.some(([l,c],u)=>u!==e&&(l===o[0]&&c===o[1]||l===o[1]&&c===o[0]))))return!1;ts(n),i===null?r.wires.splice(e,1):r.wires[e]=o,n.selectedTerminal=null,n.checks[n.module]=null,n.module==="transient"&&(n.params.transient.playing=!1),n.sequence++;const a=l=>{var c;return((c=r.circuit.pins.find(u=>u.id===l))==null?void 0:c.name)||l};return n.feedback=i===null?`Removed lead from ${a(s[0])} to ${a(s[1])}.`:`Lead connected from ${a(o[0])} to ${a(o[1])}.`,!0}function ql(n,e){if(n.tool!=="remove")return n.feedback="Choose Remove before selecting a lead.",!1;const t=Dt(n);if(!Number.isInteger(e)||e<0||e>=t.wires.length)return!1;ts(n);const[i,r]=t.wires.splice(e,1)[0],s=o=>{var a;return((a=t.circuit.pins.find(l=>l.id===o))==null?void 0:a.name)||o};return n.feedback=`Removed ${s(i)} → ${s(r)}.`,n.selectedTerminal=null,n.checks[n.module]=null,n.sequence++,!0}function si(n,e,t){const i=ct(n),r=["load","equivalentResistance","rin","rf","rail","frequency","resistance","capacitance","inductance","timeDiv","ch1Scale","ch2Scale","speed"],s=["amplitude","v1","v2","time","prediction"];if([...r,...s,"equivalentVoltage","nortonCurrent","triggerLevel","sumMilliamp","initial"].includes(e)&&!(e==="sumMilliamp"&&t===null)&&(!Number.isFinite(t)||r.includes(e)&&t<=0||s.includes(e)&&t<0))return n.feedback=`Enter a valid ${e} value.`,!1;if(e==="predictionChoice"&&n.module==="transient"&&Mn(n).locked)return n.feedback="Prediction is locked. Use Retry prediction to start a fresh comparison.",!1;if(n.module==="transient"&&e==="resistance"&&t!==i.resistance){t!==i.resistance&&Pi(n);const a=Hn({...i,source:5});i.initial=a.storageValue,i.time=0,i.acquiredTime=0}return i[e]=t,n.module==="transient"&&e==="time"&&(t>0&&Pi(n),Dt(n).correct&&(i.acquiredTime=Math.max(i.acquiredTime||0,t))),e==="kind"&&(i.resistance=t==="RC"?1e3:100,i.initial=0,i.time=0,i.acquiredTime=0,i.playing=!1,i.charging=!0,i.predictionChoice=Mn(n,t).choice),["representation","configuration","kind"].includes(e)&&(n.selectedTerminal=null,Dt(n)),n.checks[n.module]=null,n.sequence++,!0}function Dd(n,e){Sn[e]&&(n.params.transient.playing=!1,n.module=e,n.selectedTerminal=null,n.tool="wire",n.mode==="challenge"&&Xl(n),Dt(n),n.feedback=Sn[e].principle,n.sequence++)}function Id(n,e){n.mode=e,n.selectedTerminal=null,n.tool="wire",n.params.transient.playing=!1,e==="challenge"&&Xl(n),Dt(n),n.feedback=e!=="explore"?"Connect the circuit with patch leads, then place the probes. Use the circuit diagram as a guide.":"Explore the connected circuit. Change a setting and observe the result.",n.sequence++}function Xl(n){n.challengeStarted[n.module]||(n.challengeStarted[n.module]=!0,n.params[n.module]={...Sn[n.module].defaults},n.module==="thevenin"&&Object.assign(n.params.thevenin,{equivalentVoltage:4,equivalentResistance:750,nortonCurrent:8}))}function ws(n,e){var r;const{circuit:t,wires:i}=Dt(n);if(t.pins.some(s=>s.id===e)){if(["red","black","ch1","ch2"].includes(n.tool)){ns(n,n.tool,e);return}if(n.tool==="scopeGround"){ns(n,`${ct(n).scopeGroundChannel||"ch1"}Ground`,e);return}if(n.tool==="remove"){n.feedback="Select a lead to remove it.";return}if(n.tool==="select"){n.selectedTerminal=e,n.feedback=t.pins.find(s=>s.id===e).name;return}if(!n.selectedTerminal)n.selectedTerminal=e,n.feedback=`${t.pins.find(s=>s.id===e).name} selected. Choose the other terminal.`;else{const s=n.selectedTerminal;n.selectedTerminal!==e&&!i.some(([o,a])=>o===e&&a===n.selectedTerminal||o===n.selectedTerminal&&a===e)&&(ts(n),i.push([n.selectedTerminal,e])),n.selectedTerminal=null,n.feedback=s===e?"Connection cancelled.":`${(r=t.pins.find(o=>o.id===s))==null?void 0:r.name} → ${t.pins.find(o=>o.id===e).name}.`}n.checks[n.module]=null,n.sequence++}}function Ud(n){n.module==="transient"&&Pi(n);const e=Zi(n),t=ct(n);if(!e.ok)return n.feedback=e.error||"Complete a valid circuit before recording.",!1;const i=n.module==="opamp"?Ui(n):null;return n.module==="opamp"&&!i.ok?(n.feedback=i.error||"Connect the scope signals and grounds first.",!1):n.module!=="opamp"&&!e.probeReady?(n.feedback="Connect both voltage probes before recording a measurement.",!1):(n.records.unshift({id:++n.sequence,module:n.module,mode:n.mode,attempt:n.attempts[n.module],when:new Date().toISOString(),params:JSON.parse(JSON.stringify(t)),measurement:JSON.parse(JSON.stringify(e)),wires:Dt(n).wires.map(r=>[...r]),probes:{...Dt(n).probes},scope:i?ri(i):null,prediction:n.module==="transient"?ri(Mn(n)):null,activity:n.module==="superposition"||n.module==="transient"?ri($l(n)):null}),n.feedback=`Reading ${n.records.length} saved to your notebook${i?i.correct?"":`. ${i.error||"Check CH1 at Vin and CH2 at Vout, with both grounds at GND"}`:e.probesCorrect?"":". Check the probe locations: these are not across the requested output"}.`,!0)}function Nd(n){const e=Zi(n),t=ct(n),i=n.records.filter(o=>{var a;return o.module===n.module&&o.mode==="challenge"&&o.attempt===n.attempts[n.module]&&o.measurement.correct&&(n.module==="opamp"?((a=o.scope)==null?void 0:a.correct)&&!o.scope.stale:o.measurement.probesCorrect)});let r=[];if(n.module==="thevenin"){for(const o of["original","thevenin","norton"])r.push({label:`${o==="original"?"Original":o==="thevenin"?"Thévenin":"Norton"} verified at 250, 500 and 1000 Ω`,pass:[250,500,1e3].every(a=>i.some(l=>l.params.representation===o&&l.params.load===a&&rr(l.measurement.voltage,6*a/(500+a))))});r.push({label:"Maximum power verified at 500 Ω (18 mW)",pass:i.some(o=>o.params.load===500&&rr(o.measurement.power,.018))&&t.load===500&&e.correct&&rr(e.power,.018)})}else if(n.module==="superposition"){for(const l of["both","a","b"])r.push({label:`Baseline recorded: ${l==="both"?"both sources":l==="a"?"A alone, B shorted":"B alone, A shorted"}`,pass:i.some(c=>c.params.v1===6&&c.params.v2===3&&c.params.sourceMode===l&&(l==="both"||c.params.replacement==="short")&&rr(c.measurement.current,l==="both"?.001:l==="a"?.002:-.001))});r.push({label:"Both nonzero sources active with zero branch current",pass:i.some(l=>l.params.sourceMode==="both"&&l.params.v1>0&&l.params.v2>0&&Math.abs(l.measurement.current)<1e-7)});const o=n.sumSubmissions[`challenge:${n.attempts.superposition}:6:3`];r.push({label:"Submitted the signed sum of measured A and B currents at +6 V / −3 V",pass:!!(o!=null&&o.passed)});const a=i.find(l=>l.params.sourceMode==="both"&&l.params.v1>0&&l.params.v2>0&&Math.abs(l.measurement.current)<1e-7&&["a","b"].every(c=>i.some(u=>u.params.sourceMode===c&&u.params.replacement==="short"&&u.params.v1===l.params.v1&&u.params.v2===l.params.v2)));r.push({label:"Cancellation verified with each source's signed contribution",pass:!!a}),r.push({label:"Explained cancellation: equal and opposite branch contributions; current can flow elsewhere",pass:!!a&&t.explanation==="opposing"})}else if(n.module==="opamp"){const o=i.filter(a=>a.params.configuration==="inverting"&&a.params.rail===12&&a.params.frequency===100&&rr(a.measurement.gain,-3));r=[{label:"Gain −3 at ±12 V and 100 Hz with correct wiring",pass:e.correct&&t.configuration==="inverting"&&t.rail===12&&t.frequency===100&&rr(e.gain,-3)},{label:"Recorded an unclipped waveform at the target settings",pass:o.some(a=>!a.measurement.clipped)},{label:"Recorded a clipped waveform at the target settings",pass:o.some(a=>a.measurement.clipped)},{label:"Predicted the maximum input within 0.1 V of 11/3 Vpk",pass:Math.abs(t.prediction-11/3)<=.1},{label:"Scope channels measure Vin and Vout with grounded references",pass:Ui(n).channels.ch1.correct&&Ui(n).channels.ch2.correct}]}else{for(const o of["RC","RL"])for(const[a,l]of[["baseline",o==="RC"?1e3:100],["half time constant",o==="RC"?500:200]])r.push({label:`${o}: ${a}, measured at one τ`,pass:i.some(c=>{var u;return c.params.kind===o&&c.params.resistance===l&&c.params.charging&&Math.abs(c.params.initial)<1e-9&&((u=c.prediction)==null?void 0:u.locked)&&!c.prediction.late&&c.prediction.run===Mn(n,o).run&&c.prediction.sequence<c.id&&rr(c.params.time,c.measurement.tau,.02)})});for(const o of["RC","RL"])r.push({label:`${o}: predicted the effect of increasing R before testing`,pass:Mn(n,o).locked&&!Mn(n,o).late&&Mn(n,o).correct})}n.checks[n.module]=r;const s=r.filter(o=>o.pass).length;return n.feedback=s===r.length?"All checks passed. Add your explanation to the exported notebook for instructor review.":`${s} of ${r.length} checks passed. Review the remaining items below.`,r}function gh(n,e){var t;if(e.startsWith("scrub:")&&n.module==="transient"){const i=Number(e.slice(6));if(!Number.isFinite(i)||!Dt(n).correct)return!1;const r=ct(n);return r.time=Math.max(0,Math.min(i/1e3,r.acquiredTime||0)),r.playing=!1,n.sequence++,n.feedback=`Trace cursor at ${Vt(r.time*1e3)} ms. Run to continue the response.`,!0}if(e.startsWith("probe:")){const[,i,r]=e.split(":");return ns(n,i,r||null)}if(e.startsWith("remove-wire:"))return ql(n,Number(e.split(":")[1]));if(e.startsWith("scope-ground:")){const i=e.split(":")[1];n.module==="opamp"&&["ch1","ch2"].includes(i)&&(ct(n).scopeGroundChannel=i,n.tool="scopeGround",n.selectedTerminal=null,n.feedback=`Place ${i.toUpperCase()} ground at GND.`);return}if(e==="cancel"){n.selectedTerminal=null,n.feedback="Selection cancelled.";return}if(e==="undo"){const i=(t=n.history[Dn(n)])==null?void 0:t.pop();if(!i){n.feedback="No wiring or probe change to undo.";return}n.wireSets[Dn(n)]=i.wires,n.probeSets[Dn(n)]=i.probes,n.scopeSets[Dn(n)]=i.scope,n.selectedTerminal=null,n.checks[n.module]=null,n.sequence++,n.feedback="Last wiring or probe change undone.";return}if(e==="submit-sum")return Cd(n);if(e==="lock-prediction")return Ad(n);if(e==="restart-prediction"&&n.module==="transient"){const i=ct(n),r=Mn(n).run+1;n.predictions[Ho(n)]={choice:"unset",locked:!1,late:!1,tested:!1,correct:!1,run:r},Object.assign(i,{resistance:i.kind==="RC"?1e3:100,time:0,initial:0,acquiredTime:0,charging:!0,playing:!1,predictionChoice:"unset"}),n.checks.transient=null,n.sequence++,n.feedback="New prediction for this circuit. Earlier readings stay in the notebook but do not count for this comparison.";return}if(e==="scope-toggle"&&n.module==="opamp"){const i=ct(n);i.scopeRunning&&(n.scopeHolds[Dn(n)]=ri(Ui(n))),i.scopeRunning=!i.scopeRunning,n.sequence++,n.feedback=i.scopeRunning?"Scope running.":"Scope held. Measurements retain their acquisition settings.";return}if(e==="scope-autoscale"&&n.module==="opamp"){const i=ct(n);i.scopeRunning=!0,i.timeDiv=200/i.frequency;const r=Ui(n);for(const s of["ch1","ch2"]){const o=(r.channels[s].peak||0)*1.15/4;i[`${s}Scale`]=kt[`${s}Scale`].find(a=>a>=o)||Math.max(10,o)}n.sequence++,n.feedback=r.ok?"Two periods fitted to the scope. Adjust the trigger if needed.":r.error;return}if(e.startsWith("module:")){Dd(n,e.slice(7));return}if(e.startsWith("set:")){const[,i,r]=e.split(":");si(n,i,r==="true"?!0:r==="false"?!1:Number.isNaN(Number(r))?r:Number(r));return}if(e.startsWith("adjust:")){const[,i,r]=e.split(":"),s=Number(r),o=ct(n),a=n.module==="superposition"&&i==="sumMilliamp"||n.module==="opamp"&&i==="prediction",l=o[i]===null?0:o[i];if(!a||r===""||!Number.isFinite(s)||!Number.isFinite(l))return n.feedback="Choose a valid numeric answer adjustment.",!1;const c=kt[i],u=Math.min(...c),h=Math.max(...c);return si(n,i,Number(Math.min(h,Math.max(u,l+s)).toFixed(6)))}if(e.startsWith("cycle:")){const[,i,r="1"]=e.split(":"),s=ct(n),o=kt[i];if(o&&i in s&&Number.isFinite(Number(r))&&Number(r)!==0){const a=Math.sign(Number(r));if(o.every(l=>typeof l=="number")){const l=s[i]===null?0:s[i];if(!Number.isFinite(l))return!1;const c=a>0?o.find(u=>u>l+1e-10)??o.at(-1):[...o].reverse().find(u=>u<l-1e-10)??o[0];si(n,i,c)}else{const l=Math.max(0,o.indexOf(s[i]));si(n,i,o[(l+a+o.length)%o.length])}}return}if(e.startsWith("tool:")){n.tool=e.slice(5),n.selectedTerminal=null,n.feedback=n.tool==="remove"?"Select a lead to remove it.":n.tool==="select"?"Select a component or terminal.":`${n.tool==="wire"?"Patch lead":n.tool==="red"?"Meter V tip":n.tool==="black"?"Meter COM tip":n.tool+" probe"} selected. Choose a terminal on the bench.`;return}if(e==="explore"||e==="build"||e==="challenge"){Id(n,e);return}if(e==="record"){Ud(n);return}if(e==="check"){Nd(n);return}if(e==="check-wiring"){n.feedback=Dt(n).correct?"The terminal connections match the reference circuit. Now connect the probes and take a reading.":"The wiring does not yet match the reference circuit. Use Schematic to compare connections; open and shorted paths change the result.";return}if(e==="clear"||e==="reset-circuit"){ts(n),n.wireSets[Dn(n)]=[],n.probeSets[Dn(n)]={red:null,black:null},n.scopeSets[Dn(n)]=Xa({...n,mode:"challenge"}),n.selectedTerminal=null,n.params.transient.playing=!1,n.feedback="Leads and probes cleared. Select two terminals to add each connection.";return}if(e==="restore"){if(n.mode!=="explore"){n.feedback="Connect the circuit with patch leads, or switch to Explore to use the connected circuit.";return}const i=Gl(n.module,ct(n));ts(n),n.wireSets[Dn(n)]=i.wires.map(r=>[...r]),n.probeSets[Dn(n)]={red:i.positive,black:"gnd"},n.scopeSets[Dn(n)]=Xa(n),n.feedback="Reference circuit connected.";return}if(e==="reset-attempt"){n.attempts[n.module]++;for(const i of Object.keys(n.wireSets))i.startsWith(`challenge:${n.module}:`)&&(delete n.wireSets[i],delete n.probeSets[i],delete n.scopeSets[i],delete n.scopeHolds[i],delete n.history[i]);n.challengeStarted[n.module]=!1,n.selectedTerminal=null,n.mode==="challenge"&&Xl(n),n.checks[n.module]=null,n.feedback="A new challenge attempt has started. Earlier readings remain in the notebook.",Dt(n);return}if(n.module==="transient"){const i=ct(n);if(e==="play"){if(!Dt(n).correct){n.feedback="Complete the circuit before running the transient.";return}i.playing=!i.playing,i.playing&&Pi(n)}e==="switch"&&(Pi(n),i.initial=Hn({...i,source:5}).storageValue,i.time=0,i.acquiredTime=0,i.charging=!i.charging,n.feedback=i.charging?"Switch connected to the 5 V source. Stored state is preserved.":"Switch connected to the closed return loop. Stored state is preserved."),e==="replay"&&(Dt(n).correct&&Pi(n),i.time=0,i.acquiredTime=0,i.playing=Dt(n).correct,n.feedback="Replaying this switching segment from its stored initial condition."),e==="reset-energy"&&(i.initial=0,i.time=0,i.acquiredTime=0,i.charging=!0,i.playing=!1,n.feedback="New experiment: initial stored energy set to zero."),e==="one-tau"&&(Pi(n),i.time=Hn({...i,source:5}).tau,Dt(n).correct&&(i.acquiredTime=Math.max(i.acquiredTime||0,i.time)),i.playing=!1),e==="five-tau"&&(Pi(n),i.time=Hn({...i,source:5}).tau*5,Dt(n).correct&&(i.acquiredTime=Math.max(i.acquiredTime||0,i.time)),i.playing=!1)}n.sequence++}function Od(n){const e=Zi(n),t=e.ok,i={label:"Voltmeter",value:e.probeReady?Vt(e.probeVoltage):"—",unit:"V",detail:e.probeReady?"V tip − COM tip":"Place both probes"};return n.module==="opamp"?[{...i,label:"Voltage sample",detail:`At input +peak · ${Vt(250/ct(n).frequency)} ms · V tip − COM tip`},{label:"Linear gain",value:t?Vt(e.gain):"—",unit:"V/V",detail:t?e.clipped?"Output is clipping":"Within output limits":"Connect feedback & supplies"},{label:"Output peak",value:t?Vt(e.peak):"—",unit:"Vpk",detail:`Teaching model: ±${ct(n).rail-1} V limit`}]:n.module==="transient"?[i,{label:"Storage current",value:t?Vt(e.current*1e3):"—",unit:"mA",detail:"Fixed sensor · top → ground"},{label:"Stored energy",value:t?Vt(e.energy*1e3,4):"—",unit:"mJ",detail:t?`τ = ${Vt(e.tau*1e3)} ms`:"Complete the storage loop"}]:[i,{label:"Branch current",value:t?Vt(e.current*1e3):"—",unit:"mA",detail:"Fixed sensor · top → ground"},{label:"Load power",value:t?Vt(e.power*1e3):"—",unit:"mW",detail:"Computed from V × I"}]}const zc=new WeakMap;function Go(n){const e=ct(n),t=Zi(n);if(n.module==="thevenin"){const{circuit:l,wires:c,correct:u}=Dt(n),h=Math.max(2e3,e.load),d=[...new Set([...Array.from({length:100},(p,x)=>(x+1)*h/100),...kt.load.filter(p=>p<=h),e.load])].sort((p,x)=>p-x),f=JSON.stringify([l.electrical,c,e.load]),g=zc.get(n),_=(g==null?void 0:g.signature)===f?g.points:[];if((g==null?void 0:g.signature)!==f&&t.ok)for(const p of d){const x=Wl({components:l.electrical.map(y=>y.id==="load"?{...y,value:p}:y),wires:c});x.ok&&_.push([p,(x.voltages.loada-x.voltages.loadb)*x.currents.load*1e3])}(g==null?void 0:g.signature)!==f&&zc.set(n,{signature:f,points:_});const m=_.reduce((p,[x,y])=>!p||y>p.y?{x,y}:p,null);return{title:"Load power sweep",subtitle:t.ok?`Calculated sweep · current wiring${u?"":" differs from the diagram"} · select a load to test it`:t.error,series:_.length?[{name:"Calculated load power",color:"#17788d",unit:"mW",points:_}]:[],interaction:"load",calculated:!0,valid:t.ok,error:t.ok?null:t.error,xMax:h,yMin:0,yMax:Math.max((m==null?void 0:m.y)||0,.001)*1.12,xLabel:"Load resistance (Ω)",yLabel:"Power (mW)",xUnit:"Ω",yUnit:"mW",peak:m,marker:t.ok?{x:e.load,y:t.power*1e3}:null}}if(n.module==="superposition"){const l=mh(n),c=l.live;return{title:l.superpositionValid?"Signed source contributions":"Source states",interaction:"source",calculated:!0,subtitle:l.error||"Calculated from current wiring · positive current flows top → ground",bars:[{name:"A alone",sourceMode:"a",value:c.a.valid?c.a.current*1e3:null,missing:!c.a.valid,color:"#17788d"},{name:"B alone",sourceMode:"b",value:c.b.valid?c.b.current*1e3:null,missing:!c.b.valid,color:"#b77739"},{name:"Both",sourceMode:"both",value:c.both.valid?c.both.current*1e3:null,missing:!c.both.valid,color:"#294a61"}],yLabel:"Current (mA)",yUnit:"mA",series:[]}}if(n.module==="opamp"){const l=Ui(n),c=["ch1","ch2"].map((u,h)=>{const d=l.channels[u],f=h?"#17788d":"#b77739";return{id:u,interaction:"scope",title:`${u.toUpperCase()} · ${d.scale} V/div`,subtitle:d.error||l.error||`${d.signal} − ${d.ground} · ${l.running?"Run":"Hold"}${l.stale?" · old settings":""}`,series:d.valid&&d.points.length?[{name:u.toUpperCase(),color:f,points:d.points}]:[],xMax:l.timeDiv*10,yMin:-d.scale*4,yMax:d.scale*4,xLabel:"Time (ms)",yLabel:"Voltage (V)",xUnit:"ms",yUnit:"V",limits:u==="ch2"&&d.correct?l.limits:[]}});return{title:"Oscilloscope",interaction:"scope",subtitle:l.error||`${e.frequency} Hz · ${l.trigger.edge} trigger at ${l.trigger.level} V · ${l.running?"Run":"Hold"}`,series:c.flatMap(u=>u.series),panels:c,xMax:l.timeDiv*10,yMin:-Math.max(l.channels.ch1.scale,l.channels.ch2.scale)*4,yMax:Math.max(l.channels.ch1.scale,l.channels.ch2.scale)*4,xLabel:"Time (ms)",yLabel:"Voltage (V)",limits:l.limits,scope:l}}const i=Hn({...e,source:5}).tau,r=t.ok?Math.max(0,e.acquiredTime||0):0,s=Math.max((e.kind==="RC"?.1:.001)*5e3,r*1e3),o=t.ok?Array.from({length:r>0?121:1},(l,c)=>{const u=r>0?c/120*r:0,h=Hn({...e,source:5,time:u});return{time:u*1e3,voltage:h.voltage,current:h.current*1e3,energy:h.energy*1e3}}):[],a=["voltage","current","energy"].map((l,c)=>{const u=o.map(_=>[_.time,_[l]]),h=u.map(_=>_[1]),d=l==="voltage"?`${e.kind==="RC"?"Capacitor":"Inductor"} voltage`:l==="current"?"Storage current":"Stored energy",f=Hn({...e,source:5,time:0}),g=l==="voltage"?Math.max(5,Math.abs(f.voltage)):l==="current"?Math.max(5e3/e.resistance,Math.abs(f.current*1e3)):Math.max(f.energy*1e3,e.kind==="RC"?12500*e.capacitance:12500*e.inductance/e.resistance**2);return{id:l,title:d,subtitle:t.ok?`${e.charging?"Source connected":"Closed return"} · ${e.playing?"Acquiring":r?"Paused":"Press Run"} · ${Vt(r*1e3)} ms acquired`:t.error,series:u.length?[{name:d,color:["#17788d","#b77739","#735782"][c],unit:["V","mA","mJ"][c],points:u}]:[],interaction:"time",valid:t.ok,acquiredMax:r*1e3,xMax:s,yMin:Math.min(0,...h)*1.12,yMax:Math.max(g,...h,.001)*1.12,xLabel:"Elapsed circuit time (ms)",yLabel:["Voltage (V)","Current (mA)","Energy (mJ)"][c],xUnit:"ms",yUnit:["V","mA","mJ"][c],marker:t.ok?{x:e.time*1e3,y:l==="voltage"?t.voltage:l==="current"?t.current*1e3:t.energy*1e3}:null,tau:i*1e3}});return{...a[e.kind==="RC"?0:1],panels:a}}function vh(n,e,t=0){var h;const i=Go(n),r=((h=i.panels)==null?void 0:h[t])||i,s=Number.isFinite(e)?Math.max(0,Math.min(1,e)):0;if(i.bars){const d=i.bars[Math.min(i.bars.length-1,Math.floor(s*i.bars.length))];return{x:null,xLabel:d.name,readings:d.missing?[]:[{name:d.name,value:d.value,unit:i.yUnit,color:d.color}],text:d.missing?`${d.name}: circuit unavailable`:`${d.name}: ${Vt(d.value)} ${i.yUnit}`,sourceMode:d.sourceMode}}const o=s*r.xMax,a=r.yUnit||"V",l=i.panels||[r],c=[];if(!(r.acquiredMax!==void 0&&o>r.acquiredMax+1e-8))for(const d of l)for(const f of d.series||[]){const g=f.points;if(!g.length||o<g[0][0]-1e-8||o>g.at(-1)[0]+1e-8)continue;let _=g.findIndex(([M])=>M>=o);_<0&&(_=g.length-1);const[m,p]=g[Math.max(0,_-1)],[x,y]=g[_],b=m===x?y:p+(o-m)/(x-m)*(y-p);c.push({name:f.name,value:b,unit:f.unit||d.yUnit||a,color:f.color})}const u=`${Vt(o)} ${r.xUnit||"ms"}`;return{x:o,xLabel:u,readings:c,text:c.length?`${u} · ${c.map(d=>`${d.name} ${Vt(d.value)} ${d.unit}`).join(" · ")}`:`${u} · ${r.acquiredMax!==void 0&&o>r.acquiredMax?"not acquired; run the circuit":"no trace at this point"}`}}function _h(n){const e=ct(n),t=[],i=(s,o,a,l="")=>t.push({group:s,id:o,label:a,value:l}),r=(s,o,a,l="Settings")=>{i(l,`cycle:${s}`,`${o} +`,a),i(l,`cycle:${s}:-1`,`${o} −`,a)};i("Guide",n.mode==="explore"?"build":"explore",n.mode==="explore"?"Build circuit":"Explore"),i("Guide","reset-circuit","Clear circuit");for(const[s,o]of[["select","Select"],["wire","Wire"],["remove","Remove"],["red","Meter V tip"],["black","Meter COM tip"]])i("Bench",`tool:${s}`,o,n.tool===s?"Selected":"");if(i("Bench","undo","Undo"),i("Bench","cancel","Cancel selection"),i("Bench","check-wiring","Check wiring"),n.module==="thevenin"){for(const s of["original","thevenin","norton"])i("Settings",`set:representation:${s}`,s==="thevenin"?"Thévenin":s==="norton"?"Norton":"Original",e.representation===s?"Selected":"");r("load","Load",`${e.load} Ω`),e.representation==="thevenin"&&r("equivalentVoltage","Vth",`${e.equivalentVoltage} V`),e.representation==="norton"&&r("nortonCurrent","In",`${e.nortonCurrent} mA`),e.representation!=="original"&&r("equivalentResistance","Equivalent R",`${e.equivalentResistance} Ω`)}if(n.module==="superposition"){for(const[s,o]of[["both","Both sources"],["a","A alone"],["b","B alone"]])i("Settings",`set:sourceMode:${s}`,o,e.sourceMode===s?"Selected":"");r("v1","Source A",`+${e.v1} V`),r("v2","Source B",`−${e.v2} V`),i("Settings",`set:replacement:${e.replacement==="short"?"open":"short"}`,"Inactive source",e.replacement)}if(n.module==="opamp"){i("Settings",`set:configuration:${e.configuration==="inverting"?"noninverting":"inverting"}`,"Configuration",e.configuration),r("rin","Rin",`${e.rin/1e3} kΩ`),r("rf","Rf",`${e.rf/1e3} kΩ`),r("amplitude","Input",`${e.amplitude} Vpk`),r("rail","Supply",`±${e.rail} V`),r("frequency","Frequency",`${e.frequency} Hz`);for(const s of["ch1","ch2"])i("Bench",`tool:${s}`,`${s.toUpperCase()} signal`,n.tool===s?"Selected":""),i("Bench",`scope-ground:${s}`,`${s.toUpperCase()} ground`,n.tool==="scopeGround"&&e.scopeGroundChannel===s?"Selected":""),r(`${s}Scale`,`${s.toUpperCase()} scale`,`${e[`${s}Scale`]} V/div`);r("timeDiv","Timebase",`${e.timeDiv} ms/div`),r("triggerLevel","Trigger level",`${e.triggerLevel} V`),i("Settings",`set:triggerEdge:${e.triggerEdge==="rising"?"falling":"rising"}`,"Trigger edge",e.triggerEdge),i("Bench","scope-toggle",e.scopeRunning?"Hold scope":"Run scope"),i("Bench","scope-autoscale","Autoscale")}n.module==="transient"&&(i("Settings",`set:kind:${e.kind==="RC"?"RL":"RC"}`,"Circuit",e.kind),r("resistance","Resistance",`${e.resistance} Ω`),r("speed","Playback",`${e.speed}×`),i("Bench","switch","Switch",e.charging?"Source":"Return"),i("Bench","play",e.playing?"Pause":"Run"),i("Bench","one-tau","Cursor at 1 τ"),i("Bench","five-tau","Cursor at 5 τ"),i("Bench","reset-energy","Zero energy"),i("Bench","replay","Replay")),n.mode==="explore"&&i("Bench","restore","Connect reference");for(const[s,o]of Object.entries(Sn))i("Labs",`module:${s}`,`Lab ${o.number}: ${o.name}`,n.module===s?"Current":"");return t}/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Yl="180",jr={ROTATE:0,DOLLY:1,PAN:2},qr={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Fd=0,Vc=1,kd=2,xh=1,bh=2,Ti=3,er=0,kn=1,pi=2,Ki=0,Zr=1,Hc=2,Gc=3,Wc=4,Bd=5,dr=100,zd=101,Vd=102,Hd=103,Gd=104,Wd=200,$d=201,qd=202,Xd=203,Ya=204,ja=205,Yd=206,jd=207,Zd=208,Kd=209,Jd=210,Qd=211,ef=212,tf=213,nf=214,Za=0,Ka=1,Ja=2,is=3,Qa=4,el=5,tl=6,nl=7,yh=0,rf=1,sf=2,Ji=0,of=1,af=2,lf=3,Mh=4,cf=5,uf=6,hf=7,Sh=300,rs=301,ss=302,il=303,rl=304,Wo=306,sl=1e3,mr=1001,ol=1002,li=1003,df=1004,Ks=1005,oi=1006,ha=1007,ji=1008,gi=1009,Eh=1010,wh=1011,Is=1012,jl=1013,vr=1014,Li=1015,Gs=1016,Zl=1017,Kl=1018,Us=1020,Th=35902,Ah=35899,Rh=1021,Ch=1022,ai=1023,Ns=1026,Os=1027,Ph=1028,Jl=1029,Lh=1030,Ql=1031,ec=1033,Ro=33776,Co=33777,Po=33778,Lo=33779,al=35840,ll=35841,cl=35842,ul=35843,hl=36196,dl=37492,fl=37496,pl=37808,ml=37809,gl=37810,vl=37811,_l=37812,xl=37813,bl=37814,yl=37815,Ml=37816,Sl=37817,El=37818,wl=37819,Tl=37820,Al=37821,Rl=36492,Cl=36494,Pl=36495,Ll=36283,Dl=36284,Il=36285,Ul=36286,ff=3200,pf=3201,Dh=0,mf=1,Xi="",yn="srgb",os="srgb-linear",Io="linear",Ft="srgb",Pr=7680,$c=519,gf=512,vf=513,_f=514,Ih=515,xf=516,bf=517,yf=518,Mf=519,qc=35044,Xc="300 es",mi=2e3,Uo=2001;class br{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const r=i[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}}const _n=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Yc=1234567;const Kr=Math.PI/180,Fs=180/Math.PI;function yr(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(_n[n&255]+_n[n>>8&255]+_n[n>>16&255]+_n[n>>24&255]+"-"+_n[e&255]+_n[e>>8&255]+"-"+_n[e>>16&15|64]+_n[e>>24&255]+"-"+_n[t&63|128]+_n[t>>8&255]+"-"+_n[t>>16&255]+_n[t>>24&255]+_n[i&255]+_n[i>>8&255]+_n[i>>16&255]+_n[i>>24&255]).toLowerCase()}function ft(n,e,t){return Math.max(e,Math.min(t,n))}function tc(n,e){return(n%e+e)%e}function Sf(n,e,t,i,r){return i+(n-e)*(r-i)/(t-e)}function Ef(n,e,t){return n!==e?(t-n)/(e-n):0}function Ts(n,e,t){return(1-t)*n+t*e}function wf(n,e,t,i){return Ts(n,e,1-Math.exp(-t*i))}function Tf(n,e=1){return e-Math.abs(tc(n,e*2)-e)}function Af(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function Rf(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function Cf(n,e){return n+Math.floor(Math.random()*(e-n+1))}function Pf(n,e){return n+Math.random()*(e-n)}function Lf(n){return n*(.5-Math.random())}function Df(n){n!==void 0&&(Yc=n);let e=Yc+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function If(n){return n*Kr}function Uf(n){return n*Fs}function Nf(n){return(n&n-1)===0&&n!==0}function Of(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Ff(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function kf(n,e,t,i,r){const s=Math.cos,o=Math.sin,a=s(t/2),l=o(t/2),c=s((e+i)/2),u=o((e+i)/2),h=s((e-i)/2),d=o((e-i)/2),f=s((i-e)/2),g=o((i-e)/2);switch(r){case"XYX":n.set(a*u,l*h,l*d,a*c);break;case"YZY":n.set(l*d,a*u,l*h,a*c);break;case"ZXZ":n.set(l*h,l*d,a*u,a*c);break;case"XZX":n.set(a*u,l*g,l*f,a*c);break;case"YXY":n.set(l*f,a*u,l*g,a*c);break;case"ZYZ":n.set(l*g,l*f,a*u,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function $r(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Pn(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const vn={DEG2RAD:Kr,RAD2DEG:Fs,generateUUID:yr,clamp:ft,euclideanModulo:tc,mapLinear:Sf,inverseLerp:Ef,lerp:Ts,damp:wf,pingpong:Tf,smoothstep:Af,smootherstep:Rf,randInt:Cf,randFloat:Pf,randFloatSpread:Lf,seededRandom:Df,degToRad:If,radToDeg:Uf,isPowerOfTwo:Nf,ceilPowerOfTwo:Of,floorPowerOfTwo:Ff,setQuaternionFromProperEuler:kf,normalize:Pn,denormalize:$r};class xe{constructor(e=0,t=0){xe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ft(this.x,e.x,t.x),this.y=ft(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ft(this.x,e,t),this.y=ft(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ft(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(ft(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Un{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,s,o,a){let l=i[r+0],c=i[r+1],u=i[r+2],h=i[r+3];const d=s[o+0],f=s[o+1],g=s[o+2],_=s[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h;return}if(a===1){e[t+0]=d,e[t+1]=f,e[t+2]=g,e[t+3]=_;return}if(h!==_||l!==d||c!==f||u!==g){let m=1-a;const p=l*d+c*f+u*g+h*_,x=p>=0?1:-1,y=1-p*p;if(y>Number.EPSILON){const M=Math.sqrt(y),T=Math.atan2(M,p*x);m=Math.sin(m*T)/M,a=Math.sin(a*T)/M}const b=a*x;if(l=l*m+d*b,c=c*m+f*b,u=u*m+g*b,h=h*m+_*b,m===1-a){const M=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=M,c*=M,u*=M,h*=M}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,i,r,s,o){const a=i[r],l=i[r+1],c=i[r+2],u=i[r+3],h=s[o],d=s[o+1],f=s[o+2],g=s[o+3];return e[t]=a*g+u*h+l*f-c*d,e[t+1]=l*g+u*d+c*h-a*f,e[t+2]=c*g+u*f+a*d-l*h,e[t+3]=u*g-a*h-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),u=a(r/2),h=a(s/2),d=l(i/2),f=l(r/2),g=l(s/2);switch(o){case"XYZ":this._x=d*u*h+c*f*g,this._y=c*f*h-d*u*g,this._z=c*u*g+d*f*h,this._w=c*u*h-d*f*g;break;case"YXZ":this._x=d*u*h+c*f*g,this._y=c*f*h-d*u*g,this._z=c*u*g-d*f*h,this._w=c*u*h+d*f*g;break;case"ZXY":this._x=d*u*h-c*f*g,this._y=c*f*h+d*u*g,this._z=c*u*g+d*f*h,this._w=c*u*h-d*f*g;break;case"ZYX":this._x=d*u*h-c*f*g,this._y=c*f*h+d*u*g,this._z=c*u*g-d*f*h,this._w=c*u*h+d*f*g;break;case"YZX":this._x=d*u*h+c*f*g,this._y=c*f*h+d*u*g,this._z=c*u*g-d*f*h,this._w=c*u*h-d*f*g;break;case"XZY":this._x=d*u*h-c*f*g,this._y=c*f*h-d*u*g,this._z=c*u*g+d*f*h,this._w=c*u*h+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],r=t[4],s=t[8],o=t[1],a=t[5],l=t[9],c=t[2],u=t[6],h=t[10],d=i+a+h;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(u-l)*f,this._y=(s-c)*f,this._z=(o-r)*f}else if(i>a&&i>h){const f=2*Math.sqrt(1+i-a-h);this._w=(u-l)/f,this._x=.25*f,this._y=(r+o)/f,this._z=(s+c)/f}else if(a>h){const f=2*Math.sqrt(1+a-i-h);this._w=(s-c)/f,this._x=(r+o)/f,this._y=.25*f,this._z=(l+u)/f}else{const f=2*Math.sqrt(1+h-i-a);this._w=(o-r)/f,this._x=(s+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ft(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,r=e._y,s=e._z,o=e._w,a=t._x,l=t._y,c=t._z,u=t._w;return this._x=i*u+o*a+r*c-s*l,this._y=r*u+o*l+s*a-i*c,this._z=s*u+o*c+i*l-r*a,this._w=o*u-i*a-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,o=this._w;let a=o*e._w+i*e._x+r*e._y+s*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=i,this._y=r,this._z=s,this;const l=1-a*a;if(l<=Number.EPSILON){const f=1-t;return this._w=f*o+t*this._w,this._x=f*i+t*this._x,this._y=f*r+t*this._y,this._z=f*s+t*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,a),h=Math.sin((1-t)*u)/c,d=Math.sin(t*u)/c;return this._w=o*h+this._w*d,this._x=i*h+this._x*d,this._y=r*h+this._y*d,this._z=s*h+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class D{constructor(e=0,t=0,i=0){D.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(jc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(jc.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){const t=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*r-a*i),u=2*(a*t-s*r),h=2*(s*i-o*t);return this.x=t+l*c+o*h-a*u,this.y=i+l*u+a*c-s*h,this.z=r+l*h+s*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ft(this.x,e.x,t.x),this.y=ft(this.y,e.y,t.y),this.z=ft(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ft(this.x,e,t),this.y=ft(this.y,e,t),this.z=ft(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ft(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,r=e.y,s=e.z,o=t.x,a=t.y,l=t.z;return this.x=r*l-s*a,this.y=s*o-i*l,this.z=i*a-r*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return da.copy(this).projectOnVector(e),this.sub(da)}reflect(e){return this.sub(da.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(ft(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const da=new D,jc=new Un;class dt{constructor(e,t,i,r,s,o,a,l,c){dt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,l,c)}set(e,t,i,r,s,o,a,l,c){const u=this.elements;return u[0]=e,u[1]=r,u[2]=a,u[3]=t,u[4]=s,u[5]=l,u[6]=i,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],u=i[4],h=i[7],d=i[2],f=i[5],g=i[8],_=r[0],m=r[3],p=r[6],x=r[1],y=r[4],b=r[7],M=r[2],T=r[5],C=r[8];return s[0]=o*_+a*x+l*M,s[3]=o*m+a*y+l*T,s[6]=o*p+a*b+l*C,s[1]=c*_+u*x+h*M,s[4]=c*m+u*y+h*T,s[7]=c*p+u*b+h*C,s[2]=d*_+f*x+g*M,s[5]=d*m+f*y+g*T,s[8]=d*p+f*b+g*C,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return t*o*u-t*a*c-i*s*u+i*a*l+r*s*c-r*o*l}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=u*o-a*c,d=a*l-u*s,f=c*s-o*l,g=t*h+i*d+r*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=h*_,e[1]=(r*c-u*i)*_,e[2]=(a*i-r*o)*_,e[3]=d*_,e[4]=(u*t-r*l)*_,e[5]=(r*s-a*t)*_,e[6]=f*_,e[7]=(i*l-c*t)*_,e[8]=(o*t-i*s)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,o,a){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-r*c,r*l,-r*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(fa.makeScale(e,t)),this}rotate(e){return this.premultiply(fa.makeRotation(-e)),this}translate(e,t){return this.premultiply(fa.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const fa=new dt;function Uh(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function No(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Bf(){const n=No("canvas");return n.style.display="block",n}const Zc={};function ks(n){n in Zc||(Zc[n]=!0,console.warn(n))}function zf(n,e,t){return new Promise(function(i,r){function s(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:i()}}setTimeout(s,t)})}const Kc=new dt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Jc=new dt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Vf(){const n={enabled:!0,workingColorSpace:os,spaces:{},convert:function(r,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===Ft&&(r.r=Ii(r.r),r.g=Ii(r.g),r.b=Ii(r.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===Ft&&(r.r=Jr(r.r),r.g=Jr(r.g),r.b=Jr(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===Xi?Io:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,o){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return ks("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return ks("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[os]:{primaries:e,whitePoint:i,transfer:Io,toXYZ:Kc,fromXYZ:Jc,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:yn},outputColorSpaceConfig:{drawingBufferColorSpace:yn}},[yn]:{primaries:e,whitePoint:i,transfer:Ft,toXYZ:Kc,fromXYZ:Jc,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:yn}}}),n}const Ct=Vf();function Ii(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Jr(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Lr;class Hf{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Lr===void 0&&(Lr=No("canvas")),Lr.width=e.width,Lr.height=e.height;const r=Lr.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=Lr}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=No("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=Ii(s[o]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Ii(t[i]/255)*255):t[i]=Ii(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Gf=0;class nc{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Gf++}),this.uuid=yr(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(pa(r[o].image)):s.push(pa(r[o]))}else s=pa(r);i.url=s}return t||(e.images[this.uuid]=i),i}}function pa(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Hf.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Wf=0;const ma=new D;class Nn extends br{constructor(e=Nn.DEFAULT_IMAGE,t=Nn.DEFAULT_MAPPING,i=mr,r=mr,s=oi,o=ji,a=ai,l=gi,c=Nn.DEFAULT_ANISOTROPY,u=Xi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Wf++}),this.uuid=yr(),this.name="",this.source=new nc(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new xe(0,0),this.repeat=new xe(1,1),this.center=new xe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new dt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(ma).x}get height(){return this.source.getSize(ma).y}get depth(){return this.source.getSize(ma).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}r&&i&&r.isVector2&&i.isVector2||r&&i&&r.isVector3&&i.isVector3||r&&i&&r.isMatrix3&&i.isMatrix3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Sh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case sl:e.x=e.x-Math.floor(e.x);break;case mr:e.x=e.x<0?0:1;break;case ol:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case sl:e.y=e.y-Math.floor(e.y);break;case mr:e.y=e.y<0?0:1;break;case ol:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Nn.DEFAULT_IMAGE=null;Nn.DEFAULT_MAPPING=Sh;Nn.DEFAULT_ANISOTROPY=1;class Yt{constructor(e=0,t=0,i=0,r=1){Yt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*t+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*t+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*t+o[7]*i+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s;const l=e.elements,c=l[0],u=l[4],h=l[8],d=l[1],f=l[5],g=l[9],_=l[2],m=l[6],p=l[10];if(Math.abs(u-d)<.01&&Math.abs(h-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const y=(c+1)/2,b=(f+1)/2,M=(p+1)/2,T=(u+d)/4,C=(h+_)/4,P=(g+m)/4;return y>b&&y>M?y<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(y),r=T/i,s=C/i):b>M?b<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(b),i=T/r,s=P/r):M<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(M),i=C/s,r=P/s),this.set(i,r,s,t),this}let x=Math.sqrt((m-g)*(m-g)+(h-_)*(h-_)+(d-u)*(d-u));return Math.abs(x)<.001&&(x=1),this.x=(m-g)/x,this.y=(h-_)/x,this.z=(d-u)/x,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ft(this.x,e.x,t.x),this.y=ft(this.y,e.y,t.y),this.z=ft(this.z,e.z,t.z),this.w=ft(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ft(this.x,e,t),this.y=ft(this.y,e,t),this.z=ft(this.z,e,t),this.w=ft(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ft(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class $f extends br{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:oi,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new Yt(0,0,e,t),this.scissorTest=!1,this.viewport=new Yt(0,0,e,t);const r={width:e,height:t,depth:i.depth},s=new Nn(r);this.textures=[];const o=i.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:oi,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i,this.textures[r].isArrayTexture=this.textures[r].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const r=Object.assign({},e.textures[t].image);this.textures[t].source=new nc(r)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class _r extends $f{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Nh extends Nn{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=li,this.minFilter=li,this.wrapR=mr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class qf extends Nn{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=li,this.minFilter=li,this.wrapR=mr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class cs{constructor(e=new D(1/0,1/0,1/0),t=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(ti.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(ti.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=ti.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,ti):ti.fromBufferAttribute(s,o),ti.applyMatrix4(e.matrixWorld),this.expandByPoint(ti);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Js.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Js.copy(i.boundingBox)),Js.applyMatrix4(e.matrixWorld),this.union(Js)}const r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ti),ti.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(gs),Qs.subVectors(this.max,gs),Dr.subVectors(e.a,gs),Ir.subVectors(e.b,gs),Ur.subVectors(e.c,gs),Bi.subVectors(Ir,Dr),zi.subVectors(Ur,Ir),sr.subVectors(Dr,Ur);let t=[0,-Bi.z,Bi.y,0,-zi.z,zi.y,0,-sr.z,sr.y,Bi.z,0,-Bi.x,zi.z,0,-zi.x,sr.z,0,-sr.x,-Bi.y,Bi.x,0,-zi.y,zi.x,0,-sr.y,sr.x,0];return!ga(t,Dr,Ir,Ur,Qs)||(t=[1,0,0,0,1,0,0,0,1],!ga(t,Dr,Ir,Ur,Qs))?!1:(eo.crossVectors(Bi,zi),t=[eo.x,eo.y,eo.z],ga(t,Dr,Ir,Ur,Qs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ti).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ti).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(yi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),yi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),yi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),yi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),yi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),yi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),yi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),yi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(yi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const yi=[new D,new D,new D,new D,new D,new D,new D,new D],ti=new D,Js=new cs,Dr=new D,Ir=new D,Ur=new D,Bi=new D,zi=new D,sr=new D,gs=new D,Qs=new D,eo=new D,or=new D;function ga(n,e,t,i,r){for(let s=0,o=n.length-3;s<=o;s+=3){or.fromArray(n,s);const a=r.x*Math.abs(or.x)+r.y*Math.abs(or.y)+r.z*Math.abs(or.z),l=e.dot(or),c=t.dot(or),u=i.dot(or);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const Xf=new cs,vs=new D,va=new D;class $o{constructor(e=new D,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):Xf.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;vs.subVectors(e,this.center);const t=vs.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(vs,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(va.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(vs.copy(e.center).add(va)),this.expandByPoint(vs.copy(e.center).sub(va))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const Mi=new D,_a=new D,to=new D,Vi=new D,xa=new D,no=new D,ba=new D;class qo{constructor(e=new D,t=new D(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Mi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Mi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Mi.copy(this.origin).addScaledVector(this.direction,t),Mi.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){_a.copy(e).add(t).multiplyScalar(.5),to.copy(t).sub(e).normalize(),Vi.copy(this.origin).sub(_a);const s=e.distanceTo(t)*.5,o=-this.direction.dot(to),a=Vi.dot(this.direction),l=-Vi.dot(to),c=Vi.lengthSq(),u=Math.abs(1-o*o);let h,d,f,g;if(u>0)if(h=o*l-a,d=o*a-l,g=s*u,h>=0)if(d>=-g)if(d<=g){const _=1/u;h*=_,d*=_,f=h*(h+o*d+2*a)+d*(o*h+d+2*l)+c}else d=s,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;else d=-s,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;else d<=-g?(h=Math.max(0,-(-o*s+a)),d=h>0?-s:Math.min(Math.max(-s,-l),s),f=-h*h+d*(d+2*l)+c):d<=g?(h=0,d=Math.min(Math.max(-s,-l),s),f=d*(d+2*l)+c):(h=Math.max(0,-(o*s+a)),d=h>0?s:Math.min(Math.max(-s,-l),s),f=-h*h+d*(d+2*l)+c);else d=o>0?-s:s,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(_a).addScaledVector(to,d),f}intersectSphere(e,t){Mi.subVectors(e.center,this.origin);const i=Mi.dot(this.direction),r=Mi.dot(Mi)-i*i,s=e.radius*e.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return c>=0?(i=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(i=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),u>=0?(s=(e.min.y-d.y)*u,o=(e.max.y-d.y)*u):(s=(e.max.y-d.y)*u,o=(e.min.y-d.y)*u),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),h>=0?(a=(e.min.z-d.z)*h,l=(e.max.z-d.z)*h):(a=(e.max.z-d.z)*h,l=(e.min.z-d.z)*h),i>l||a>r)||((a>i||i!==i)&&(i=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,Mi)!==null}intersectTriangle(e,t,i,r,s){xa.subVectors(t,e),no.subVectors(i,e),ba.crossVectors(xa,no);let o=this.direction.dot(ba),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Vi.subVectors(this.origin,e);const l=a*this.direction.dot(no.crossVectors(Vi,no));if(l<0)return null;const c=a*this.direction.dot(xa.cross(Vi));if(c<0||l+c>o)return null;const u=-a*Vi.dot(ba);return u<0?null:this.at(u/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Gt{constructor(e,t,i,r,s,o,a,l,c,u,h,d,f,g,_,m){Gt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,l,c,u,h,d,f,g,_,m)}set(e,t,i,r,s,o,a,l,c,u,h,d,f,g,_,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=i,p[12]=r,p[1]=s,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=u,p[10]=h,p[14]=d,p[3]=f,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Gt().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,r=1/Nr.setFromMatrixColumn(e,0).length(),s=1/Nr.setFromMatrixColumn(e,1).length(),o=1/Nr.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){const d=o*u,f=o*h,g=a*u,_=a*h;t[0]=l*u,t[4]=-l*h,t[8]=c,t[1]=f+g*c,t[5]=d-_*c,t[9]=-a*l,t[2]=_-d*c,t[6]=g+f*c,t[10]=o*l}else if(e.order==="YXZ"){const d=l*u,f=l*h,g=c*u,_=c*h;t[0]=d+_*a,t[4]=g*a-f,t[8]=o*c,t[1]=o*h,t[5]=o*u,t[9]=-a,t[2]=f*a-g,t[6]=_+d*a,t[10]=o*l}else if(e.order==="ZXY"){const d=l*u,f=l*h,g=c*u,_=c*h;t[0]=d-_*a,t[4]=-o*h,t[8]=g+f*a,t[1]=f+g*a,t[5]=o*u,t[9]=_-d*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){const d=o*u,f=o*h,g=a*u,_=a*h;t[0]=l*u,t[4]=g*c-f,t[8]=d*c+_,t[1]=l*h,t[5]=_*c+d,t[9]=f*c-g,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){const d=o*l,f=o*c,g=a*l,_=a*c;t[0]=l*u,t[4]=_-d*h,t[8]=g*h+f,t[1]=h,t[5]=o*u,t[9]=-a*u,t[2]=-c*u,t[6]=f*h+g,t[10]=d-_*h}else if(e.order==="XZY"){const d=o*l,f=o*c,g=a*l,_=a*c;t[0]=l*u,t[4]=-h,t[8]=c*u,t[1]=d*h+_,t[5]=o*u,t[9]=f*h-g,t[2]=g*h-f,t[6]=a*u,t[10]=_*h+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Yf,e,jf)}lookAt(e,t,i){const r=this.elements;return zn.subVectors(e,t),zn.lengthSq()===0&&(zn.z=1),zn.normalize(),Hi.crossVectors(i,zn),Hi.lengthSq()===0&&(Math.abs(i.z)===1?zn.x+=1e-4:zn.z+=1e-4,zn.normalize(),Hi.crossVectors(i,zn)),Hi.normalize(),io.crossVectors(zn,Hi),r[0]=Hi.x,r[4]=io.x,r[8]=zn.x,r[1]=Hi.y,r[5]=io.y,r[9]=zn.y,r[2]=Hi.z,r[6]=io.z,r[10]=zn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],u=i[1],h=i[5],d=i[9],f=i[13],g=i[2],_=i[6],m=i[10],p=i[14],x=i[3],y=i[7],b=i[11],M=i[15],T=r[0],C=r[4],P=r[8],E=r[12],S=r[1],I=r[5],B=r[9],$=r[13],V=r[2],k=r[6],G=r[10],W=r[14],N=r[3],ce=r[7],_e=r[11],ve=r[15];return s[0]=o*T+a*S+l*V+c*N,s[4]=o*C+a*I+l*k+c*ce,s[8]=o*P+a*B+l*G+c*_e,s[12]=o*E+a*$+l*W+c*ve,s[1]=u*T+h*S+d*V+f*N,s[5]=u*C+h*I+d*k+f*ce,s[9]=u*P+h*B+d*G+f*_e,s[13]=u*E+h*$+d*W+f*ve,s[2]=g*T+_*S+m*V+p*N,s[6]=g*C+_*I+m*k+p*ce,s[10]=g*P+_*B+m*G+p*_e,s[14]=g*E+_*$+m*W+p*ve,s[3]=x*T+y*S+b*V+M*N,s[7]=x*C+y*I+b*k+M*ce,s[11]=x*P+y*B+b*G+M*_e,s[15]=x*E+y*$+b*W+M*ve,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],h=e[6],d=e[10],f=e[14],g=e[3],_=e[7],m=e[11],p=e[15];return g*(+s*l*h-r*c*h-s*a*d+i*c*d+r*a*f-i*l*f)+_*(+t*l*f-t*c*d+s*o*d-r*o*f+r*c*u-s*l*u)+m*(+t*c*h-t*a*f-s*o*h+i*o*f+s*a*u-i*c*u)+p*(-r*a*u-t*l*h+t*a*d+r*o*h-i*o*d+i*l*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=e[9],d=e[10],f=e[11],g=e[12],_=e[13],m=e[14],p=e[15],x=h*m*c-_*d*c+_*l*f-a*m*f-h*l*p+a*d*p,y=g*d*c-u*m*c-g*l*f+o*m*f+u*l*p-o*d*p,b=u*_*c-g*h*c+g*a*f-o*_*f-u*a*p+o*h*p,M=g*h*l-u*_*l-g*a*d+o*_*d+u*a*m-o*h*m,T=t*x+i*y+r*b+s*M;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const C=1/T;return e[0]=x*C,e[1]=(_*d*s-h*m*s-_*r*f+i*m*f+h*r*p-i*d*p)*C,e[2]=(a*m*s-_*l*s+_*r*c-i*m*c-a*r*p+i*l*p)*C,e[3]=(h*l*s-a*d*s-h*r*c+i*d*c+a*r*f-i*l*f)*C,e[4]=y*C,e[5]=(u*m*s-g*d*s+g*r*f-t*m*f-u*r*p+t*d*p)*C,e[6]=(g*l*s-o*m*s-g*r*c+t*m*c+o*r*p-t*l*p)*C,e[7]=(o*d*s-u*l*s+u*r*c-t*d*c-o*r*f+t*l*f)*C,e[8]=b*C,e[9]=(g*h*s-u*_*s-g*i*f+t*_*f+u*i*p-t*h*p)*C,e[10]=(o*_*s-g*a*s+g*i*c-t*_*c-o*i*p+t*a*p)*C,e[11]=(u*a*s-o*h*s-u*i*c+t*h*c+o*i*f-t*a*f)*C,e[12]=M*C,e[13]=(u*_*r-g*h*r+g*i*d-t*_*d-u*i*m+t*h*m)*C,e[14]=(g*a*r-o*_*r-g*i*l+t*_*l+o*i*m-t*a*m)*C,e[15]=(o*h*r-u*a*r+u*i*l-t*h*l-o*i*d+t*a*d)*C,this}scale(e){const t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),r=Math.sin(t),s=1-i,o=e.x,a=e.y,l=e.z,c=s*o,u=s*a;return this.set(c*o+i,c*a-r*l,c*l+r*a,0,c*a+r*l,u*a+i,u*l-r*o,0,c*l-r*a,u*l+r*o,s*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){const r=this.elements,s=t._x,o=t._y,a=t._z,l=t._w,c=s+s,u=o+o,h=a+a,d=s*c,f=s*u,g=s*h,_=o*u,m=o*h,p=a*h,x=l*c,y=l*u,b=l*h,M=i.x,T=i.y,C=i.z;return r[0]=(1-(_+p))*M,r[1]=(f+b)*M,r[2]=(g-y)*M,r[3]=0,r[4]=(f-b)*T,r[5]=(1-(d+p))*T,r[6]=(m+x)*T,r[7]=0,r[8]=(g+y)*C,r[9]=(m-x)*C,r[10]=(1-(d+_))*C,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){const r=this.elements;let s=Nr.set(r[0],r[1],r[2]).length();const o=Nr.set(r[4],r[5],r[6]).length(),a=Nr.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],ni.copy(this);const c=1/s,u=1/o,h=1/a;return ni.elements[0]*=c,ni.elements[1]*=c,ni.elements[2]*=c,ni.elements[4]*=u,ni.elements[5]*=u,ni.elements[6]*=u,ni.elements[8]*=h,ni.elements[9]*=h,ni.elements[10]*=h,t.setFromRotationMatrix(ni),i.x=s,i.y=o,i.z=a,this}makePerspective(e,t,i,r,s,o,a=mi,l=!1){const c=this.elements,u=2*s/(t-e),h=2*s/(i-r),d=(t+e)/(t-e),f=(i+r)/(i-r);let g,_;if(l)g=s/(o-s),_=o*s/(o-s);else if(a===mi)g=-(o+s)/(o-s),_=-2*o*s/(o-s);else if(a===Uo)g=-o/(o-s),_=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,r,s,o,a=mi,l=!1){const c=this.elements,u=2/(t-e),h=2/(i-r),d=-(t+e)/(t-e),f=-(i+r)/(i-r);let g,_;if(l)g=1/(o-s),_=o/(o-s);else if(a===mi)g=-2/(o-s),_=-(o+s)/(o-s);else if(a===Uo)g=-1/(o-s),_=-s/(o-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=h,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const Nr=new D,ni=new Gt,Yf=new D(0,0,0),jf=new D(1,1,1),Hi=new D,io=new D,zn=new D,Qc=new Gt,eu=new Un;class Jn{constructor(e=0,t=0,i=0,r=Jn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const r=e.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],u=r[9],h=r[2],d=r[6],f=r[10];switch(t){case"XYZ":this._y=Math.asin(ft(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ft(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(ft(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-ft(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(ft(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-ft(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Qc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Qc,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return eu.setFromEuler(this),this.setFromQuaternion(eu,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Jn.DEFAULT_ORDER="XYZ";class ic{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Zf=0;const tu=new D,Or=new Un,Si=new Gt,ro=new D,_s=new D,Kf=new D,Jf=new Un,nu=new D(1,0,0),iu=new D(0,1,0),ru=new D(0,0,1),su={type:"added"},Qf={type:"removed"},Fr={type:"childadded",child:null},ya={type:"childremoved",child:null};class cn extends br{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Zf++}),this.uuid=yr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=cn.DEFAULT_UP.clone();const e=new D,t=new Jn,i=new Un,r=new D(1,1,1);function s(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new Gt},normalMatrix:{value:new dt}}),this.matrix=new Gt,this.matrixWorld=new Gt,this.matrixAutoUpdate=cn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=cn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ic,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Or.setFromAxisAngle(e,t),this.quaternion.multiply(Or),this}rotateOnWorldAxis(e,t){return Or.setFromAxisAngle(e,t),this.quaternion.premultiply(Or),this}rotateX(e){return this.rotateOnAxis(nu,e)}rotateY(e){return this.rotateOnAxis(iu,e)}rotateZ(e){return this.rotateOnAxis(ru,e)}translateOnAxis(e,t){return tu.copy(e).applyQuaternion(this.quaternion),this.position.add(tu.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(nu,e)}translateY(e){return this.translateOnAxis(iu,e)}translateZ(e){return this.translateOnAxis(ru,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Si.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?ro.copy(e):ro.set(e,t,i);const r=this.parent;this.updateWorldMatrix(!0,!1),_s.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Si.lookAt(_s,ro,this.up):Si.lookAt(ro,_s,this.up),this.quaternion.setFromRotationMatrix(Si),r&&(Si.extractRotation(r.matrixWorld),Or.setFromRotationMatrix(Si),this.quaternion.premultiply(Or.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(su),Fr.child=e,this.dispatchEvent(Fr),Fr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Qf),ya.child=e,this.dispatchEvent(ya),ya.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Si.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Si.multiply(e.parent.matrixWorld)),e.applyMatrix4(Si),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(su),Fr.child=e,this.dispatchEvent(Fr),Fr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(_s,e,Kf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(_s,Jf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(a=>({...a})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];s(e.shapes,h)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];r.animations.push(s(e.animations,l))}}if(t){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),h=o(e.shapes),d=o(e.skeletons),f=o(e.animations),g=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),h.length>0&&(i.shapes=h),d.length>0&&(i.skeletons=d),f.length>0&&(i.animations=f),g.length>0&&(i.nodes=g)}return i.object=r,i;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}cn.DEFAULT_UP=new D(0,1,0);cn.DEFAULT_MATRIX_AUTO_UPDATE=!0;cn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const ii=new D,Ei=new D,Ma=new D,wi=new D,kr=new D,Br=new D,ou=new D,Sa=new D,Ea=new D,wa=new D,Ta=new Yt,Aa=new Yt,Ra=new Yt;class Zn{constructor(e=new D,t=new D,i=new D){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),ii.subVectors(e,t),r.cross(ii);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){ii.subVectors(r,t),Ei.subVectors(i,t),Ma.subVectors(e,t);const o=ii.dot(ii),a=ii.dot(Ei),l=ii.dot(Ma),c=Ei.dot(Ei),u=Ei.dot(Ma),h=o*c-a*a;if(h===0)return s.set(0,0,0),null;const d=1/h,f=(c*l-a*u)*d,g=(o*u-a*l)*d;return s.set(1-f-g,g,f)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,wi)===null?!1:wi.x>=0&&wi.y>=0&&wi.x+wi.y<=1}static getInterpolation(e,t,i,r,s,o,a,l){return this.getBarycoord(e,t,i,r,wi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,wi.x),l.addScaledVector(o,wi.y),l.addScaledVector(a,wi.z),l)}static getInterpolatedAttribute(e,t,i,r,s,o){return Ta.setScalar(0),Aa.setScalar(0),Ra.setScalar(0),Ta.fromBufferAttribute(e,t),Aa.fromBufferAttribute(e,i),Ra.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(Ta,s.x),o.addScaledVector(Aa,s.y),o.addScaledVector(Ra,s.z),o}static isFrontFacing(e,t,i,r){return ii.subVectors(i,t),Ei.subVectors(e,t),ii.cross(Ei).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ii.subVectors(this.c,this.b),Ei.subVectors(this.a,this.b),ii.cross(Ei).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Zn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Zn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,r,s){return Zn.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return Zn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Zn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,r=this.b,s=this.c;let o,a;kr.subVectors(r,i),Br.subVectors(s,i),Sa.subVectors(e,i);const l=kr.dot(Sa),c=Br.dot(Sa);if(l<=0&&c<=0)return t.copy(i);Ea.subVectors(e,r);const u=kr.dot(Ea),h=Br.dot(Ea);if(u>=0&&h<=u)return t.copy(r);const d=l*h-u*c;if(d<=0&&l>=0&&u<=0)return o=l/(l-u),t.copy(i).addScaledVector(kr,o);wa.subVectors(e,s);const f=kr.dot(wa),g=Br.dot(wa);if(g>=0&&f<=g)return t.copy(s);const _=f*c-l*g;if(_<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(i).addScaledVector(Br,a);const m=u*g-f*h;if(m<=0&&h-u>=0&&f-g>=0)return ou.subVectors(s,r),a=(h-u)/(h-u+(f-g)),t.copy(r).addScaledVector(ou,a);const p=1/(m+_+d);return o=_*p,a=d*p,t.copy(i).addScaledVector(kr,o).addScaledVector(Br,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Oh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Gi={h:0,s:0,l:0},so={h:0,s:0,l:0};function Ca(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class St{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=yn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ct.colorSpaceToWorking(this,t),this}setRGB(e,t,i,r=Ct.workingColorSpace){return this.r=e,this.g=t,this.b=i,Ct.colorSpaceToWorking(this,r),this}setHSL(e,t,i,r=Ct.workingColorSpace){if(e=tc(e,1),t=ft(t,0,1),i=ft(i,0,1),t===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+t):i+t-i*t,o=2*i-s;this.r=Ca(o,s,e+1/3),this.g=Ca(o,s,e),this.b=Ca(o,s,e-1/3)}return Ct.colorSpaceToWorking(this,r),this}setStyle(e,t=yn){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=yn){const i=Oh[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ii(e.r),this.g=Ii(e.g),this.b=Ii(e.b),this}copyLinearToSRGB(e){return this.r=Jr(e.r),this.g=Jr(e.g),this.b=Jr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=yn){return Ct.workingToColorSpace(xn.copy(this),e),Math.round(ft(xn.r*255,0,255))*65536+Math.round(ft(xn.g*255,0,255))*256+Math.round(ft(xn.b*255,0,255))}getHexString(e=yn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ct.workingColorSpace){Ct.workingToColorSpace(xn.copy(this),t);const i=xn.r,r=xn.g,s=xn.b,o=Math.max(i,r,s),a=Math.min(i,r,s);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const h=o-a;switch(c=u<=.5?h/(o+a):h/(2-o-a),o){case i:l=(r-s)/h+(r<s?6:0);break;case r:l=(s-i)/h+2;break;case s:l=(i-r)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=Ct.workingColorSpace){return Ct.workingToColorSpace(xn.copy(this),t),e.r=xn.r,e.g=xn.g,e.b=xn.b,e}getStyle(e=yn){Ct.workingToColorSpace(xn.copy(this),e);const t=xn.r,i=xn.g,r=xn.b;return e!==yn?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(Gi),this.setHSL(Gi.h+e,Gi.s+t,Gi.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Gi),e.getHSL(so);const i=Ts(Gi.h,so.h,t),r=Ts(Gi.s,so.s,t),s=Ts(Gi.l,so.l,t);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*r,this.g=s[1]*t+s[4]*i+s[7]*r,this.b=s[2]*t+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const xn=new St;St.NAMES=Oh;let ep=0;class us extends br{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ep++}),this.uuid=yr(),this.name="",this.type="Material",this.blending=Zr,this.side=er,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ya,this.blendDst=ja,this.blendEquation=dr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new St(0,0,0),this.blendAlpha=0,this.depthFunc=is,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=$c,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Pr,this.stencilZFail=Pr,this.stencilZPass=Pr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Zr&&(i.blending=this.blending),this.side!==er&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Ya&&(i.blendSrc=this.blendSrc),this.blendDst!==ja&&(i.blendDst=this.blendDst),this.blendEquation!==dr&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==is&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==$c&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Pr&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Pr&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Pr&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(t){const s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Yn extends us{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new St(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Jn,this.combine=yh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const rn=new D,oo=new xe;let tp=0;class Kn{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:tp++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=qc,this.updateRanges=[],this.gpuType=Li,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)oo.fromBufferAttribute(this,t),oo.applyMatrix3(e),this.setXY(t,oo.x,oo.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)rn.fromBufferAttribute(this,t),rn.applyMatrix3(e),this.setXYZ(t,rn.x,rn.y,rn.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)rn.fromBufferAttribute(this,t),rn.applyMatrix4(e),this.setXYZ(t,rn.x,rn.y,rn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)rn.fromBufferAttribute(this,t),rn.applyNormalMatrix(e),this.setXYZ(t,rn.x,rn.y,rn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)rn.fromBufferAttribute(this,t),rn.transformDirection(e),this.setXYZ(t,rn.x,rn.y,rn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=$r(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Pn(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=$r(t,this.array)),t}setX(e,t){return this.normalized&&(t=Pn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=$r(t,this.array)),t}setY(e,t){return this.normalized&&(t=Pn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=$r(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Pn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=$r(t,this.array)),t}setW(e,t){return this.normalized&&(t=Pn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Pn(t,this.array),i=Pn(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=Pn(t,this.array),i=Pn(i,this.array),r=Pn(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=Pn(t,this.array),i=Pn(i,this.array),r=Pn(r,this.array),s=Pn(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==qc&&(e.usage=this.usage),e}}class Fh extends Kn{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class kh extends Kn{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class Nt extends Kn{constructor(e,t,i){super(new Float32Array(e),t,i)}}let np=0;const qn=new Gt,Pa=new cn,zr=new D,Vn=new cs,xs=new cs,pn=new D;class un extends br{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:np++}),this.uuid=yr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Uh(e)?kh:Fh)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new dt().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return qn.makeRotationFromQuaternion(e),this.applyMatrix4(qn),this}rotateX(e){return qn.makeRotationX(e),this.applyMatrix4(qn),this}rotateY(e){return qn.makeRotationY(e),this.applyMatrix4(qn),this}rotateZ(e){return qn.makeRotationZ(e),this.applyMatrix4(qn),this}translate(e,t,i){return qn.makeTranslation(e,t,i),this.applyMatrix4(qn),this}scale(e,t,i){return qn.makeScale(e,t,i),this.applyMatrix4(qn),this}lookAt(e){return Pa.lookAt(e),Pa.updateMatrix(),this.applyMatrix4(Pa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(zr).negate(),this.translate(zr.x,zr.y,zr.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const o=e[r];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Nt(i,3))}else{const i=Math.min(e.length,t.count);for(let r=0;r<i;r++){const s=e[r];t.setXYZ(r,s.x,s.y,s.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new cs);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){const s=t[i];Vn.setFromBufferAttribute(s),this.morphTargetsRelative?(pn.addVectors(this.boundingBox.min,Vn.min),this.boundingBox.expandByPoint(pn),pn.addVectors(this.boundingBox.max,Vn.max),this.boundingBox.expandByPoint(pn)):(this.boundingBox.expandByPoint(Vn.min),this.boundingBox.expandByPoint(Vn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new $o);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(e){const i=this.boundingSphere.center;if(Vn.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){const a=t[s];xs.setFromBufferAttribute(a),this.morphTargetsRelative?(pn.addVectors(Vn.min,xs.min),Vn.expandByPoint(pn),pn.addVectors(Vn.max,xs.max),Vn.expandByPoint(pn)):(Vn.expandByPoint(xs.min),Vn.expandByPoint(xs.max))}Vn.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)pn.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(pn));if(t)for(let s=0,o=t.length;s<o;s++){const a=t[s],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)pn.fromBufferAttribute(a,c),l&&(zr.fromBufferAttribute(e,c),pn.add(zr)),r=Math.max(r,i.distanceToSquared(pn))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Kn(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let P=0;P<i.count;P++)a[P]=new D,l[P]=new D;const c=new D,u=new D,h=new D,d=new xe,f=new xe,g=new xe,_=new D,m=new D;function p(P,E,S){c.fromBufferAttribute(i,P),u.fromBufferAttribute(i,E),h.fromBufferAttribute(i,S),d.fromBufferAttribute(s,P),f.fromBufferAttribute(s,E),g.fromBufferAttribute(s,S),u.sub(c),h.sub(c),f.sub(d),g.sub(d);const I=1/(f.x*g.y-g.x*f.y);isFinite(I)&&(_.copy(u).multiplyScalar(g.y).addScaledVector(h,-f.y).multiplyScalar(I),m.copy(h).multiplyScalar(f.x).addScaledVector(u,-g.x).multiplyScalar(I),a[P].add(_),a[E].add(_),a[S].add(_),l[P].add(m),l[E].add(m),l[S].add(m))}let x=this.groups;x.length===0&&(x=[{start:0,count:e.count}]);for(let P=0,E=x.length;P<E;++P){const S=x[P],I=S.start,B=S.count;for(let $=I,V=I+B;$<V;$+=3)p(e.getX($+0),e.getX($+1),e.getX($+2))}const y=new D,b=new D,M=new D,T=new D;function C(P){M.fromBufferAttribute(r,P),T.copy(M);const E=a[P];y.copy(E),y.sub(M.multiplyScalar(M.dot(E))).normalize(),b.crossVectors(T,E);const I=b.dot(l[P])<0?-1:1;o.setXYZW(P,y.x,y.y,y.z,I)}for(let P=0,E=x.length;P<E;++P){const S=x[P],I=S.start,B=S.count;for(let $=I,V=I+B;$<V;$+=3)C(e.getX($+0)),C(e.getX($+1)),C(e.getX($+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Kn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);const r=new D,s=new D,o=new D,a=new D,l=new D,c=new D,u=new D,h=new D;if(e)for(let d=0,f=e.count;d<f;d+=3){const g=e.getX(d+0),_=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,g),s.fromBufferAttribute(t,_),o.fromBufferAttribute(t,m),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),a.fromBufferAttribute(i,g),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,m),a.add(u),l.add(u),c.add(u),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)r.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),i.setXYZ(d+0,u.x,u.y,u.z),i.setXYZ(d+1,u.x,u.y,u.z),i.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)pn.fromBufferAttribute(e,t),pn.normalize(),e.setXYZ(t,pn.x,pn.y,pn.z)}toNonIndexed(){function e(a,l){const c=a.array,u=a.itemSize,h=a.normalized,d=new c.constructor(l.length*u);let f=0,g=0;for(let _=0,m=l.length;_<m;_++){a.isInterleavedBufferAttribute?f=l[_]*a.data.stride+a.offset:f=l[_]*u;for(let p=0;p<u;p++)d[g++]=c[f++]}return new Kn(d,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new un,i=this.index.array,r=this.attributes;for(const a in r){const l=r[a],c=e(l,i);t.setAttribute(a,c)}const s=this.morphAttributes;for(const a in s){const l=[],c=s[a];for(let u=0,h=c.length;u<h;u++){const d=c[u],f=e(d,i);l.push(f)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,d=c.length;h<d;h++){const f=c[h];u.push(f.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const r=e.attributes;for(const c in r){const u=r[c];this.setAttribute(c,u.clone(t))}const s=e.morphAttributes;for(const c in s){const u=[],h=s[c];for(let d=0,f=h.length;d<f;d++)u.push(h[d].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,u=o.length;c<u;c++){const h=o[c];this.addGroup(h.start,h.count,h.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const au=new Gt,ar=new qo,ao=new $o,lu=new D,lo=new D,co=new D,uo=new D,La=new D,ho=new D,cu=new D,fo=new D;class En extends cn{constructor(e=new un,t=new Yn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(r,e);const a=this.morphTargetInfluences;if(s&&a){ho.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=a[l],h=s[l];u!==0&&(La.fromBufferAttribute(h,e),o?ho.addScaledVector(La,u):ho.addScaledVector(La.sub(t),u))}t.add(ho)}return t}raycast(e,t){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),ao.copy(i.boundingSphere),ao.applyMatrix4(s),ar.copy(e.ray).recast(e.near),!(ao.containsPoint(ar.origin)===!1&&(ar.intersectSphere(ao,lu)===null||ar.origin.distanceToSquared(lu)>(e.far-e.near)**2))&&(au.copy(s).invert(),ar.copy(e.ray).applyMatrix4(au),!(i.boundingBox!==null&&ar.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,ar)))}_computeIntersections(e,t,i){let r;const s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,h=s.attributes.normal,d=s.groups,f=s.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=o[m.materialIndex],x=Math.max(m.start,f.start),y=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let b=x,M=y;b<M;b+=3){const T=a.getX(b),C=a.getX(b+1),P=a.getX(b+2);r=po(this,p,e,i,c,u,h,T,C,P),r&&(r.faceIndex=Math.floor(b/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const g=Math.max(0,f.start),_=Math.min(a.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const x=a.getX(m),y=a.getX(m+1),b=a.getX(m+2);r=po(this,o,e,i,c,u,h,x,y,b),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=o[m.materialIndex],x=Math.max(m.start,f.start),y=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let b=x,M=y;b<M;b+=3){const T=b,C=b+1,P=b+2;r=po(this,p,e,i,c,u,h,T,C,P),r&&(r.faceIndex=Math.floor(b/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const g=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const x=m,y=m+1,b=m+2;r=po(this,o,e,i,c,u,h,x,y,b),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}}}function ip(n,e,t,i,r,s,o,a){let l;if(e.side===kn?l=i.intersectTriangle(o,s,r,!0,a):l=i.intersectTriangle(r,s,o,e.side===er,a),l===null)return null;fo.copy(a),fo.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(fo);return c<t.near||c>t.far?null:{distance:c,point:fo.clone(),object:n}}function po(n,e,t,i,r,s,o,a,l,c){n.getVertexPosition(a,lo),n.getVertexPosition(l,co),n.getVertexPosition(c,uo);const u=ip(n,e,t,i,lo,co,uo,cu);if(u){const h=new D;Zn.getBarycoord(cu,lo,co,uo,h),r&&(u.uv=Zn.getInterpolatedAttribute(r,a,l,c,h,new xe)),s&&(u.uv1=Zn.getInterpolatedAttribute(s,a,l,c,h,new xe)),o&&(u.normal=Zn.getInterpolatedAttribute(o,a,l,c,h,new D),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const d={a,b:l,c,normal:new D,materialIndex:0};Zn.getNormal(lo,co,uo,d.normal),u.face=d,u.barycoord=h}return u}class Zt extends un{constructor(e=1,t=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],u=[],h=[];let d=0,f=0;g("z","y","x",-1,-1,i,t,e,o,s,0),g("z","y","x",1,-1,i,t,-e,o,s,1),g("x","z","y",1,1,e,i,t,r,o,2),g("x","z","y",1,-1,e,i,-t,r,o,3),g("x","y","z",1,-1,e,t,i,r,s,4),g("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new Nt(c,3)),this.setAttribute("normal",new Nt(u,3)),this.setAttribute("uv",new Nt(h,2));function g(_,m,p,x,y,b,M,T,C,P,E){const S=b/C,I=M/P,B=b/2,$=M/2,V=T/2,k=C+1,G=P+1;let W=0,N=0;const ce=new D;for(let _e=0;_e<G;_e++){const ve=_e*I-$;for(let Je=0;Je<k;Je++){const pt=Je*S-B;ce[_]=pt*x,ce[m]=ve*y,ce[p]=V,c.push(ce.x,ce.y,ce.z),ce[_]=0,ce[m]=0,ce[p]=T>0?1:-1,u.push(ce.x,ce.y,ce.z),h.push(Je/C),h.push(1-_e/P),W+=1}}for(let _e=0;_e<P;_e++)for(let ve=0;ve<C;ve++){const Je=d+ve+k*_e,pt=d+ve+k*(_e+1),ut=d+(ve+1)+k*(_e+1),mt=d+(ve+1)+k*_e;l.push(Je,pt,mt),l.push(pt,ut,mt),N+=6}a.addGroup(f,N,E),f+=N,d+=W}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Zt(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function as(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const r=n[t][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone():Array.isArray(r)?e[t][i]=r.slice():e[t][i]=r}}return e}function Ln(n){const e={};for(let t=0;t<n.length;t++){const i=as(n[t]);for(const r in i)e[r]=i[r]}return e}function rp(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Bh(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ct.workingColorSpace}const sp={clone:as,merge:Ln};var op=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ap=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class tr extends us{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=op,this.fragmentShader=ap,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=as(e.uniforms),this.uniformsGroups=rp(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?t.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[r]={type:"m4",value:o.toArray()}:t.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class zh extends cn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Gt,this.projectionMatrix=new Gt,this.projectionMatrixInverse=new Gt,this.coordinateSystem=mi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Wi=new D,uu=new xe,hu=new xe;class jn extends zh{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Fs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Kr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Fs*2*Math.atan(Math.tan(Kr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Wi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Wi.x,Wi.y).multiplyScalar(-e/Wi.z),Wi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Wi.x,Wi.y).multiplyScalar(-e/Wi.z)}getViewSize(e,t){return this.getViewBounds(e,uu,hu),t.subVectors(hu,uu)}setViewOffset(e,t,i,r,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Kr*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,t-=o.offsetY*i/c,r*=o.width/l,i*=o.height/c}const a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Vr=-90,Hr=1;class lp extends cn{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new jn(Vr,Hr,e,t);r.layers=this.layers,this.add(r);const s=new jn(Vr,Hr,e,t);s.layers=this.layers,this.add(s);const o=new jn(Vr,Hr,e,t);o.layers=this.layers,this.add(o);const a=new jn(Vr,Hr,e,t);a.layers=this.layers,this.add(a);const l=new jn(Vr,Hr,e,t);l.layers=this.layers,this.add(l);const c=new jn(Vr,Hr,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,r,s,o,a,l]=t;for(const c of t)this.remove(c);if(e===mi)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Uo)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,l,c,u]=this.children,h=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(t,s),e.setRenderTarget(i,1,r),e.render(t,o),e.setRenderTarget(i,2,r),e.render(t,a),e.setRenderTarget(i,3,r),e.render(t,l),e.setRenderTarget(i,4,r),e.render(t,c),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,r),e.render(t,u),e.setRenderTarget(h,d,f),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class Vh extends Nn{constructor(e=[],t=rs,i,r,s,o,a,l,c,u){super(e,t,i,r,s,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class cp extends _r{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new Vh(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new Zt(5,5,5),s=new tr({name:"CubemapFromEquirect",uniforms:as(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:kn,blending:Ki});s.uniforms.tEquirect.value=t;const o=new En(r,s),a=t.minFilter;return t.minFilter===ji&&(t.minFilter=oi),new lp(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,i=!0,r=!0){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,r);e.setRenderTarget(s)}}class Kt extends cn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const up={type:"move"};class Da{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Kt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Kt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Kt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const _ of e.hand.values()){const m=t.getJointPose(_,i),p=this._getHandJoint(c,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],d=u.position.distanceTo(h.position),f=.02,g=.005;c.inputState.pinching&&d>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(up)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Kt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class rc{constructor(e,t=1,i=1e3){this.isFog=!0,this.name="",this.color=new St(e),this.near=t,this.far=i}clone(){return new rc(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class hp extends cn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Jn,this.environmentIntensity=1,this.environmentRotation=new Jn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Ia=new D,dp=new D,fp=new dt;class Ri{constructor(e=new D(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const r=Ia.subVectors(i,t).cross(dp.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(Ia),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||fp.getNormalMatrix(e),r=this.coplanarPoint(Ia).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const lr=new $o,pp=new xe(.5,.5),mo=new D;class sc{constructor(e=new Ri,t=new Ri,i=new Ri,r=new Ri,s=new Ri,o=new Ri){this.planes=[e,t,i,r,s,o]}set(e,t,i,r,s,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=mi,i=!1){const r=this.planes,s=e.elements,o=s[0],a=s[1],l=s[2],c=s[3],u=s[4],h=s[5],d=s[6],f=s[7],g=s[8],_=s[9],m=s[10],p=s[11],x=s[12],y=s[13],b=s[14],M=s[15];if(r[0].setComponents(c-o,f-u,p-g,M-x).normalize(),r[1].setComponents(c+o,f+u,p+g,M+x).normalize(),r[2].setComponents(c+a,f+h,p+_,M+y).normalize(),r[3].setComponents(c-a,f-h,p-_,M-y).normalize(),i)r[4].setComponents(l,d,m,b).normalize(),r[5].setComponents(c-l,f-d,p-m,M-b).normalize();else if(r[4].setComponents(c-l,f-d,p-m,M-b).normalize(),t===mi)r[5].setComponents(c+l,f+d,p+m,M+b).normalize();else if(t===Uo)r[5].setComponents(l,d,m,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),lr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),lr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(lr)}intersectsSprite(e){lr.center.set(0,0,0);const t=pp.distanceTo(e.center);return lr.radius=.7071067811865476+t,lr.applyMatrix4(e.matrixWorld),this.intersectsSphere(lr)}intersectsSphere(e){const t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const r=t[i];if(mo.x=r.normal.x>0?e.max.x:e.min.x,mo.y=r.normal.y>0?e.max.y:e.min.y,mo.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(mo)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Oo extends us{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new St(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Fo=new D,ko=new D,du=new Gt,bs=new qo,go=new $o,Ua=new D,fu=new D;class Nl extends cn{constructor(e=new un,t=new Oo){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let r=1,s=t.count;r<s;r++)Fo.fromBufferAttribute(t,r-1),ko.fromBufferAttribute(t,r),i[r]=i[r-1],i[r]+=Fo.distanceTo(ko);e.setAttribute("lineDistance",new Nt(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),go.copy(i.boundingSphere),go.applyMatrix4(r),go.radius+=s,e.ray.intersectsSphere(go)===!1)return;du.copy(r).invert(),bs.copy(e.ray).applyMatrix4(du);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=i.index,d=i.attributes.position;if(u!==null){const f=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let _=f,m=g-1;_<m;_+=c){const p=u.getX(_),x=u.getX(_+1),y=vo(this,e,bs,l,p,x,_);y&&t.push(y)}if(this.isLineLoop){const _=u.getX(g-1),m=u.getX(f),p=vo(this,e,bs,l,_,m,g-1);p&&t.push(p)}}else{const f=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let _=f,m=g-1;_<m;_+=c){const p=vo(this,e,bs,l,_,_+1,_);p&&t.push(p)}if(this.isLineLoop){const _=vo(this,e,bs,l,g-1,f,g-1);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function vo(n,e,t,i,r,s,o){const a=n.geometry.attributes.position;if(Fo.fromBufferAttribute(a,r),ko.fromBufferAttribute(a,s),t.distanceSqToSegment(Fo,ko,Ua,fu)>i)return;Ua.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(Ua);if(!(c<e.near||c>e.far))return{distance:c,point:fu.clone().applyMatrix4(n.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:n}}const pu=new D,mu=new D;class mp extends Nl{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let r=0,s=t.count;r<s;r+=2)pu.fromBufferAttribute(t,r),mu.fromBufferAttribute(t,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+pu.distanceTo(mu);e.setAttribute("lineDistance",new Nt(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Ol extends Nn{constructor(e,t,i,r,s,o,a,l,c){super(e,t,i,r,s,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Hh extends Nn{constructor(e,t,i=vr,r,s,o,a=li,l=li,c,u=Ns,h=1){if(u!==Ns&&u!==Os)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:t,depth:h};super(d,r,s,o,a,l,u,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new nc(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Gh extends Nn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class oc extends un{constructor(e=1,t=1,i=4,r=8,s=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:i,radialSegments:r,heightSegments:s},t=Math.max(0,t),i=Math.max(1,Math.floor(i)),r=Math.max(3,Math.floor(r)),s=Math.max(1,Math.floor(s));const o=[],a=[],l=[],c=[],u=t/2,h=Math.PI/2*e,d=t,f=2*h+d,g=i*2+s,_=r+1,m=new D,p=new D;for(let x=0;x<=g;x++){let y=0,b=0,M=0,T=0;if(x<=i){const E=x/i,S=E*Math.PI/2;b=-u-e*Math.cos(S),M=e*Math.sin(S),T=-e*Math.cos(S),y=E*h}else if(x<=i+s){const E=(x-i)/s;b=-u+E*t,M=e,T=0,y=h+E*d}else{const E=(x-i-s)/i,S=E*Math.PI/2;b=u+e*Math.sin(S),M=e*Math.cos(S),T=e*Math.sin(S),y=h+d+E*h}const C=Math.max(0,Math.min(1,y/f));let P=0;x===0?P=.5/r:x===g&&(P=-.5/r);for(let E=0;E<=r;E++){const S=E/r,I=S*Math.PI*2,B=Math.sin(I),$=Math.cos(I);p.x=-M*$,p.y=b,p.z=M*B,a.push(p.x,p.y,p.z),m.set(-M*$,T,M*B),m.normalize(),l.push(m.x,m.y,m.z),c.push(S+P,C)}if(x>0){const E=(x-1)*_;for(let S=0;S<r;S++){const I=E+S,B=E+S+1,$=x*_+S,V=x*_+S+1;o.push(I,B,$),o.push(B,V,$)}}}this.setIndex(o),this.setAttribute("position",new Nt(a,3)),this.setAttribute("normal",new Nt(l,3)),this.setAttribute("uv",new Nt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new oc(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}}class _t extends un{constructor(e=1,t=1,i=1,r=32,s=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:r,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:l};const c=this;r=Math.floor(r),s=Math.floor(s);const u=[],h=[],d=[],f=[];let g=0;const _=[],m=i/2;let p=0;x(),o===!1&&(e>0&&y(!0),t>0&&y(!1)),this.setIndex(u),this.setAttribute("position",new Nt(h,3)),this.setAttribute("normal",new Nt(d,3)),this.setAttribute("uv",new Nt(f,2));function x(){const b=new D,M=new D;let T=0;const C=(t-e)/i;for(let P=0;P<=s;P++){const E=[],S=P/s,I=S*(t-e)+e;for(let B=0;B<=r;B++){const $=B/r,V=$*l+a,k=Math.sin(V),G=Math.cos(V);M.x=I*k,M.y=-S*i+m,M.z=I*G,h.push(M.x,M.y,M.z),b.set(k,C,G).normalize(),d.push(b.x,b.y,b.z),f.push($,1-S),E.push(g++)}_.push(E)}for(let P=0;P<r;P++)for(let E=0;E<s;E++){const S=_[E][P],I=_[E+1][P],B=_[E+1][P+1],$=_[E][P+1];(e>0||E!==0)&&(u.push(S,I,$),T+=3),(t>0||E!==s-1)&&(u.push(I,B,$),T+=3)}c.addGroup(p,T,0),p+=T}function y(b){const M=g,T=new xe,C=new D;let P=0;const E=b===!0?e:t,S=b===!0?1:-1;for(let B=1;B<=r;B++)h.push(0,m*S,0),d.push(0,S,0),f.push(.5,.5),g++;const I=g;for(let B=0;B<=r;B++){const V=B/r*l+a,k=Math.cos(V),G=Math.sin(V);C.x=E*G,C.y=m*S,C.z=E*k,h.push(C.x,C.y,C.z),d.push(0,S,0),T.x=k*.5+.5,T.y=G*.5*S+.5,f.push(T.x,T.y),g++}for(let B=0;B<r;B++){const $=M+B,V=I+B;b===!0?u.push(V,V+1,$):u.push(V+1,V,$),P+=3}c.addGroup(p,P,b===!0?1:2),p+=P}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new _t(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class ac extends _t{constructor(e=1,t=1,i=32,r=1,s=!1,o=0,a=Math.PI*2){super(0,e,t,i,r,s,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:r,openEnded:s,thetaStart:o,thetaLength:a}}static fromJSON(e){return new ac(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}const _o=new D,xo=new D,Na=new D,bo=new Zn;class gp extends un{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){const r=Math.pow(10,4),s=Math.cos(Kr*t),o=e.getIndex(),a=e.getAttribute("position"),l=o?o.count:a.count,c=[0,0,0],u=["a","b","c"],h=new Array(3),d={},f=[];for(let g=0;g<l;g+=3){o?(c[0]=o.getX(g),c[1]=o.getX(g+1),c[2]=o.getX(g+2)):(c[0]=g,c[1]=g+1,c[2]=g+2);const{a:_,b:m,c:p}=bo;if(_.fromBufferAttribute(a,c[0]),m.fromBufferAttribute(a,c[1]),p.fromBufferAttribute(a,c[2]),bo.getNormal(Na),h[0]=`${Math.round(_.x*r)},${Math.round(_.y*r)},${Math.round(_.z*r)}`,h[1]=`${Math.round(m.x*r)},${Math.round(m.y*r)},${Math.round(m.z*r)}`,h[2]=`${Math.round(p.x*r)},${Math.round(p.y*r)},${Math.round(p.z*r)}`,!(h[0]===h[1]||h[1]===h[2]||h[2]===h[0]))for(let x=0;x<3;x++){const y=(x+1)%3,b=h[x],M=h[y],T=bo[u[x]],C=bo[u[y]],P=`${b}_${M}`,E=`${M}_${b}`;E in d&&d[E]?(Na.dot(d[E].normal)<=s&&(f.push(T.x,T.y,T.z),f.push(C.x,C.y,C.z)),d[E]=null):P in d||(d[P]={index0:c[x],index1:c[y],normal:Na.clone()})}}for(const g in d)if(d[g]){const{index0:_,index1:m}=d[g];_o.fromBufferAttribute(a,_),xo.fromBufferAttribute(a,m),f.push(_o.x,_o.y,_o.z),f.push(xo.x,xo.y,xo.z)}this.setAttribute("position",new Nt(f,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class vi{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){const i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let i,r=this.getPoint(0),s=0;t.push(0);for(let o=1;o<=e;o++)i=this.getPoint(o/e),s+=i.distanceTo(r),t.push(s),r=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const i=this.getLengths();let r=0;const s=i.length;let o;t?o=t:o=e*i[s-1];let a=0,l=s-1,c;for(;a<=l;)if(r=Math.floor(a+(l-a)/2),c=i[r]-o,c<0)a=r+1;else if(c>0)l=r-1;else{l=r;break}if(r=l,i[r]===o)return r/(s-1);const u=i[r],d=i[r+1]-u,f=(o-u)/d;return(r+f)/(s-1)}getTangent(e,t){let r=e-1e-4,s=e+1e-4;r<0&&(r=0),s>1&&(s=1);const o=this.getPoint(r),a=this.getPoint(s),l=t||(o.isVector2?new xe:new D);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,t){const i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){const i=new D,r=[],s=[],o=[],a=new D,l=new Gt;for(let f=0;f<=e;f++){const g=f/e;r[f]=this.getTangentAt(g,new D)}s[0]=new D,o[0]=new D;let c=Number.MAX_VALUE;const u=Math.abs(r[0].x),h=Math.abs(r[0].y),d=Math.abs(r[0].z);u<=c&&(c=u,i.set(1,0,0)),h<=c&&(c=h,i.set(0,1,0)),d<=c&&i.set(0,0,1),a.crossVectors(r[0],i).normalize(),s[0].crossVectors(r[0],a),o[0].crossVectors(r[0],s[0]);for(let f=1;f<=e;f++){if(s[f]=s[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(r[f-1],r[f]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(ft(r[f-1].dot(r[f]),-1,1));s[f].applyMatrix4(l.makeRotationAxis(a,g))}o[f].crossVectors(r[f],s[f])}if(t===!0){let f=Math.acos(ft(s[0].dot(s[e]),-1,1));f/=e,r[0].dot(a.crossVectors(s[0],s[e]))>0&&(f=-f);for(let g=1;g<=e;g++)s[g].applyMatrix4(l.makeRotationAxis(r[g],f*g)),o[g].crossVectors(r[g],s[g])}return{tangents:r,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class lc extends vi{constructor(e=0,t=0,i=1,r=1,s=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=r,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(e,t=new xe){const i=t,r=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=r;for(;s>r;)s-=r;s<Number.EPSILON&&(o?s=0:s=r),this.aClockwise===!0&&!o&&(s===r?s=-r:s=s-r);const a=this.aStartAngle+e*s;let l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const u=Math.cos(this.aRotation),h=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*u-f*h+this.aX,c=d*h+f*u+this.aY}return i.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class vp extends lc{constructor(e,t,i,r,s,o){super(e,t,i,i,r,s,o),this.isArcCurve=!0,this.type="ArcCurve"}}function cc(){let n=0,e=0,t=0,i=0;function r(s,o,a,l){n=s,e=a,t=-3*s+3*o-2*a-l,i=2*s-2*o+a+l}return{initCatmullRom:function(s,o,a,l,c){r(o,a,c*(a-s),c*(l-o))},initNonuniformCatmullRom:function(s,o,a,l,c,u,h){let d=(o-s)/c-(a-s)/(c+u)+(a-o)/u,f=(a-o)/u-(l-o)/(u+h)+(l-a)/h;d*=u,f*=u,r(o,a,d,f)},calc:function(s){const o=s*s,a=o*s;return n+e*s+t*o+i*a}}}const yo=new D,Oa=new cc,Fa=new cc,ka=new cc;class uc extends vi{constructor(e=[],t=!1,i="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=r}getPoint(e,t=new D){const i=t,r=this.points,s=r.length,o=(s-(this.closed?0:1))*e;let a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/s)+1)*s:l===0&&a===s-1&&(a=s-2,l=1);let c,u;this.closed||a>0?c=r[(a-1)%s]:(yo.subVectors(r[0],r[1]).add(r[0]),c=yo);const h=r[a%s],d=r[(a+1)%s];if(this.closed||a+2<s?u=r[(a+2)%s]:(yo.subVectors(r[s-1],r[s-2]).add(r[s-1]),u=yo),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(h),f),_=Math.pow(h.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(u),f);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),Oa.initNonuniformCatmullRom(c.x,h.x,d.x,u.x,g,_,m),Fa.initNonuniformCatmullRom(c.y,h.y,d.y,u.y,g,_,m),ka.initNonuniformCatmullRom(c.z,h.z,d.z,u.z,g,_,m)}else this.curveType==="catmullrom"&&(Oa.initCatmullRom(c.x,h.x,d.x,u.x,this.tension),Fa.initCatmullRom(c.y,h.y,d.y,u.y,this.tension),ka.initCatmullRom(c.z,h.z,d.z,u.z,this.tension));return i.set(Oa.calc(l),Fa.calc(l),ka.calc(l)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(r.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const r=this.points[t];e.points.push(r.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(new D().fromArray(r))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function gu(n,e,t,i,r){const s=(i-e)*.5,o=(r-t)*.5,a=n*n,l=n*a;return(2*t-2*i+s+o)*l+(-3*t+3*i-2*s-o)*a+s*n+t}function _p(n,e){const t=1-n;return t*t*e}function xp(n,e){return 2*(1-n)*n*e}function bp(n,e){return n*n*e}function As(n,e,t,i){return _p(n,e)+xp(n,t)+bp(n,i)}function yp(n,e){const t=1-n;return t*t*t*e}function Mp(n,e){const t=1-n;return 3*t*t*n*e}function Sp(n,e){return 3*(1-n)*n*n*e}function Ep(n,e){return n*n*n*e}function Rs(n,e,t,i,r){return yp(n,e)+Mp(n,t)+Sp(n,i)+Ep(n,r)}class Wh extends vi{constructor(e=new xe,t=new xe,i=new xe,r=new xe){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=r}getPoint(e,t=new xe){const i=t,r=this.v0,s=this.v1,o=this.v2,a=this.v3;return i.set(Rs(e,r.x,s.x,o.x,a.x),Rs(e,r.y,s.y,o.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class wp extends vi{constructor(e=new D,t=new D,i=new D,r=new D){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=r}getPoint(e,t=new D){const i=t,r=this.v0,s=this.v1,o=this.v2,a=this.v3;return i.set(Rs(e,r.x,s.x,o.x,a.x),Rs(e,r.y,s.y,o.y,a.y),Rs(e,r.z,s.z,o.z,a.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class $h extends vi{constructor(e=new xe,t=new xe){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new xe){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new xe){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Tp extends vi{constructor(e=new D,t=new D){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new D){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new D){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class qh extends vi{constructor(e=new xe,t=new xe,i=new xe){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new xe){const i=t,r=this.v0,s=this.v1,o=this.v2;return i.set(As(e,r.x,s.x,o.x),As(e,r.y,s.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class hc extends vi{constructor(e=new D,t=new D,i=new D){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new D){const i=t,r=this.v0,s=this.v1,o=this.v2;return i.set(As(e,r.x,s.x,o.x),As(e,r.y,s.y,o.y),As(e,r.z,s.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Xh extends vi{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new xe){const i=t,r=this.points,s=(r.length-1)*e,o=Math.floor(s),a=s-o,l=r[o===0?o:o-1],c=r[o],u=r[o>r.length-2?r.length-1:o+1],h=r[o>r.length-3?r.length-1:o+2];return i.set(gu(a,l.x,c.x,u.x,h.x),gu(a,l.y,c.y,u.y,h.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(r.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const r=this.points[t];e.points.push(r.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(new xe().fromArray(r))}return this}}var Bo=Object.freeze({__proto__:null,ArcCurve:vp,CatmullRomCurve3:uc,CubicBezierCurve:Wh,CubicBezierCurve3:wp,EllipseCurve:lc,LineCurve:$h,LineCurve3:Tp,QuadraticBezierCurve:qh,QuadraticBezierCurve3:hc,SplineCurve:Xh});class Ap extends vi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Bo[i](t,e))}return this}getPoint(e,t){const i=e*this.getLength(),r=this.getCurveLengths();let s=0;for(;s<r.length;){if(r[s]>=i){const o=r[s]-i,a=this.curves[s],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,t)}s++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let i=0,r=this.curves.length;i<r;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let i;for(let r=0,s=this.curves;r<s.length;r++){const o=s[r],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,l=o.getPoints(a);for(let c=0;c<l.length;c++){const u=l[c];i&&i.equals(u)||(t.push(u),i=u)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const r=e.curves[t];this.curves.push(r.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){const r=this.curves[t];e.curves.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const r=e.curves[t];this.curves.push(new Bo[r.type]().fromJSON(r))}return this}}class vu extends Ap{constructor(e){super(),this.type="Path",this.currentPoint=new xe,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const i=new $h(this.currentPoint.clone(),new xe(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,r){const s=new qh(this.currentPoint.clone(),new xe(e,t),new xe(i,r));return this.curves.push(s),this.currentPoint.set(i,r),this}bezierCurveTo(e,t,i,r,s,o){const a=new Wh(this.currentPoint.clone(),new xe(e,t),new xe(i,r),new xe(s,o));return this.curves.push(a),this.currentPoint.set(s,o),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),i=new Xh(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,r,s,o){const a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+a,t+l,i,r,s,o),this}absarc(e,t,i,r,s,o){return this.absellipse(e,t,i,i,r,s,o),this}ellipse(e,t,i,r,s,o,a,l){const c=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(e+c,t+u,i,r,s,o,a,l),this}absellipse(e,t,i,r,s,o,a,l){const c=new lc(e,t,i,r,s,o,a,l);if(this.curves.length>0){const h=c.getPoint(0);h.equals(this.currentPoint)||this.lineTo(h.x,h.y)}this.curves.push(c);const u=c.getPoint(1);return this.currentPoint.copy(u),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class Yh extends vu{constructor(e){super(e),this.uuid=yr(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let i=0,r=this.holes.length;i<r;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const r=e.holes[t];this.holes.push(r.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){const r=this.holes[t];e.holes.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const r=e.holes[t];this.holes.push(new vu().fromJSON(r))}return this}}function Rp(n,e,t=2){const i=e&&e.length,r=i?e[0]*t:n.length;let s=jh(n,0,r,t,!0);const o=[];if(!s||s.next===s.prev)return o;let a,l,c;if(i&&(s=Ip(n,e,s,t)),n.length>80*t){a=1/0,l=1/0;let u=-1/0,h=-1/0;for(let d=t;d<r;d+=t){const f=n[d],g=n[d+1];f<a&&(a=f),g<l&&(l=g),f>u&&(u=f),g>h&&(h=g)}c=Math.max(u-a,h-l),c=c!==0?32767/c:0}return Bs(s,o,t,a,l,c,0),o}function jh(n,e,t,i,r){let s;if(r===Wp(n,e,t,i)>0)for(let o=e;o<t;o+=i)s=_u(o/i|0,n[o],n[o+1],s);else for(let o=t-i;o>=e;o-=i)s=_u(o/i|0,n[o],n[o+1],s);return s&&ls(s,s.next)&&(Vs(s),s=s.next),s}function xr(n,e){if(!n)return n;e||(e=n);let t=n,i;do if(i=!1,!t.steiner&&(ls(t,t.next)||qt(t.prev,t,t.next)===0)){if(Vs(t),t=e=t.prev,t===t.next)break;i=!0}else t=t.next;while(i||t!==e);return e}function Bs(n,e,t,i,r,s,o){if(!n)return;!o&&s&&kp(n,i,r,s);let a=n;for(;n.prev!==n.next;){const l=n.prev,c=n.next;if(s?Pp(n,i,r,s):Cp(n)){e.push(l.i,n.i,c.i),Vs(n),n=c.next,a=c.next;continue}if(n=c,n===a){o?o===1?(n=Lp(xr(n),e),Bs(n,e,t,i,r,s,2)):o===2&&Dp(n,e,t,i,r,s):Bs(xr(n),e,t,i,r,s,1);break}}}function Cp(n){const e=n.prev,t=n,i=n.next;if(qt(e,t,i)>=0)return!1;const r=e.x,s=t.x,o=i.x,a=e.y,l=t.y,c=i.y,u=Math.min(r,s,o),h=Math.min(a,l,c),d=Math.max(r,s,o),f=Math.max(a,l,c);let g=i.next;for(;g!==e;){if(g.x>=u&&g.x<=d&&g.y>=h&&g.y<=f&&Ss(r,a,s,l,o,c,g.x,g.y)&&qt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Pp(n,e,t,i){const r=n.prev,s=n,o=n.next;if(qt(r,s,o)>=0)return!1;const a=r.x,l=s.x,c=o.x,u=r.y,h=s.y,d=o.y,f=Math.min(a,l,c),g=Math.min(u,h,d),_=Math.max(a,l,c),m=Math.max(u,h,d),p=Fl(f,g,e,t,i),x=Fl(_,m,e,t,i);let y=n.prevZ,b=n.nextZ;for(;y&&y.z>=p&&b&&b.z<=x;){if(y.x>=f&&y.x<=_&&y.y>=g&&y.y<=m&&y!==r&&y!==o&&Ss(a,u,l,h,c,d,y.x,y.y)&&qt(y.prev,y,y.next)>=0||(y=y.prevZ,b.x>=f&&b.x<=_&&b.y>=g&&b.y<=m&&b!==r&&b!==o&&Ss(a,u,l,h,c,d,b.x,b.y)&&qt(b.prev,b,b.next)>=0))return!1;b=b.nextZ}for(;y&&y.z>=p;){if(y.x>=f&&y.x<=_&&y.y>=g&&y.y<=m&&y!==r&&y!==o&&Ss(a,u,l,h,c,d,y.x,y.y)&&qt(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;b&&b.z<=x;){if(b.x>=f&&b.x<=_&&b.y>=g&&b.y<=m&&b!==r&&b!==o&&Ss(a,u,l,h,c,d,b.x,b.y)&&qt(b.prev,b,b.next)>=0)return!1;b=b.nextZ}return!0}function Lp(n,e){let t=n;do{const i=t.prev,r=t.next.next;!ls(i,r)&&Kh(i,t,t.next,r)&&zs(i,r)&&zs(r,i)&&(e.push(i.i,t.i,r.i),Vs(t),Vs(t.next),t=n=r),t=t.next}while(t!==n);return xr(t)}function Dp(n,e,t,i,r,s){let o=n;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&Vp(o,a)){let l=Jh(o,a);o=xr(o,o.next),l=xr(l,l.next),Bs(o,e,t,i,r,s,0),Bs(l,e,t,i,r,s,0);return}a=a.next}o=o.next}while(o!==n)}function Ip(n,e,t,i){const r=[];for(let s=0,o=e.length;s<o;s++){const a=e[s]*i,l=s<o-1?e[s+1]*i:n.length,c=jh(n,a,l,i,!1);c===c.next&&(c.steiner=!0),r.push(zp(c))}r.sort(Up);for(let s=0;s<r.length;s++)t=Np(r[s],t);return t}function Up(n,e){let t=n.x-e.x;if(t===0&&(t=n.y-e.y,t===0)){const i=(n.next.y-n.y)/(n.next.x-n.x),r=(e.next.y-e.y)/(e.next.x-e.x);t=i-r}return t}function Np(n,e){const t=Op(n,e);if(!t)return e;const i=Jh(t,n);return xr(i,i.next),xr(t,t.next)}function Op(n,e){let t=e;const i=n.x,r=n.y;let s=-1/0,o;if(ls(n,t))return t;do{if(ls(n,t.next))return t.next;if(r<=t.y&&r>=t.next.y&&t.next.y!==t.y){const h=t.x+(r-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(h<=i&&h>s&&(s=h,o=t.x<t.next.x?t:t.next,h===i))return o}t=t.next}while(t!==e);if(!o)return null;const a=o,l=o.x,c=o.y;let u=1/0;t=o;do{if(i>=t.x&&t.x>=l&&i!==t.x&&Zh(r<c?i:s,r,l,c,r<c?s:i,r,t.x,t.y)){const h=Math.abs(r-t.y)/(i-t.x);zs(t,n)&&(h<u||h===u&&(t.x>o.x||t.x===o.x&&Fp(o,t)))&&(o=t,u=h)}t=t.next}while(t!==a);return o}function Fp(n,e){return qt(n.prev,n,e.prev)<0&&qt(e.next,n,n.next)<0}function kp(n,e,t,i){let r=n;do r.z===0&&(r.z=Fl(r.x,r.y,e,t,i)),r.prevZ=r.prev,r.nextZ=r.next,r=r.next;while(r!==n);r.prevZ.nextZ=null,r.prevZ=null,Bp(r)}function Bp(n){let e,t=1;do{let i=n,r;n=null;let s=null;for(e=0;i;){e++;let o=i,a=0;for(let c=0;c<t&&(a++,o=o.nextZ,!!o);c++);let l=t;for(;a>0||l>0&&o;)a!==0&&(l===0||!o||i.z<=o.z)?(r=i,i=i.nextZ,a--):(r=o,o=o.nextZ,l--),s?s.nextZ=r:n=r,r.prevZ=s,s=r;i=o}s.nextZ=null,t*=2}while(e>1);return n}function Fl(n,e,t,i,r){return n=(n-t)*r|0,e=(e-i)*r|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,n|e<<1}function zp(n){let e=n,t=n;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==n);return t}function Zh(n,e,t,i,r,s,o,a){return(r-o)*(e-a)>=(n-o)*(s-a)&&(n-o)*(i-a)>=(t-o)*(e-a)&&(t-o)*(s-a)>=(r-o)*(i-a)}function Ss(n,e,t,i,r,s,o,a){return!(n===o&&e===a)&&Zh(n,e,t,i,r,s,o,a)}function Vp(n,e){return n.next.i!==e.i&&n.prev.i!==e.i&&!Hp(n,e)&&(zs(n,e)&&zs(e,n)&&Gp(n,e)&&(qt(n.prev,n,e.prev)||qt(n,e.prev,e))||ls(n,e)&&qt(n.prev,n,n.next)>0&&qt(e.prev,e,e.next)>0)}function qt(n,e,t){return(e.y-n.y)*(t.x-e.x)-(e.x-n.x)*(t.y-e.y)}function ls(n,e){return n.x===e.x&&n.y===e.y}function Kh(n,e,t,i){const r=So(qt(n,e,t)),s=So(qt(n,e,i)),o=So(qt(t,i,n)),a=So(qt(t,i,e));return!!(r!==s&&o!==a||r===0&&Mo(n,t,e)||s===0&&Mo(n,i,e)||o===0&&Mo(t,n,i)||a===0&&Mo(t,e,i))}function Mo(n,e,t){return e.x<=Math.max(n.x,t.x)&&e.x>=Math.min(n.x,t.x)&&e.y<=Math.max(n.y,t.y)&&e.y>=Math.min(n.y,t.y)}function So(n){return n>0?1:n<0?-1:0}function Hp(n,e){let t=n;do{if(t.i!==n.i&&t.next.i!==n.i&&t.i!==e.i&&t.next.i!==e.i&&Kh(t,t.next,n,e))return!0;t=t.next}while(t!==n);return!1}function zs(n,e){return qt(n.prev,n,n.next)<0?qt(n,e,n.next)>=0&&qt(n,n.prev,e)>=0:qt(n,e,n.prev)<0||qt(n,n.next,e)<0}function Gp(n,e){let t=n,i=!1;const r=(n.x+e.x)/2,s=(n.y+e.y)/2;do t.y>s!=t.next.y>s&&t.next.y!==t.y&&r<(t.next.x-t.x)*(s-t.y)/(t.next.y-t.y)+t.x&&(i=!i),t=t.next;while(t!==n);return i}function Jh(n,e){const t=kl(n.i,n.x,n.y),i=kl(e.i,e.x,e.y),r=n.next,s=e.prev;return n.next=e,e.prev=n,t.next=r,r.prev=t,i.next=t,t.prev=i,s.next=i,i.prev=s,i}function _u(n,e,t,i){const r=kl(n,e,t);return i?(r.next=i.next,r.prev=i,i.next.prev=r,i.next=r):(r.prev=r,r.next=r),r}function Vs(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function kl(n,e,t){return{i:n,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Wp(n,e,t,i){let r=0;for(let s=e,o=t-i;s<t;s+=i)r+=(n[o]-n[s])*(n[s+1]+n[o+1]),o=s;return r}class $p{static triangulate(e,t,i=2){return Rp(e,t,i)}}class Xr{static area(e){const t=e.length;let i=0;for(let r=t-1,s=0;s<t;r=s++)i+=e[r].x*e[s].y-e[s].x*e[r].y;return i*.5}static isClockWise(e){return Xr.area(e)<0}static triangulateShape(e,t){const i=[],r=[],s=[];xu(e),bu(i,e);let o=e.length;t.forEach(xu);for(let l=0;l<t.length;l++)r.push(o),o+=t[l].length,bu(i,t[l]);const a=$p.triangulate(i,r);for(let l=0;l<a.length;l+=3)s.push(a.slice(l,l+3));return s}}function xu(n){const e=n.length;e>2&&n[e-1].equals(n[0])&&n.pop()}function bu(n,e){for(let t=0;t<e.length;t++)n.push(e[t].x),n.push(e[t].y)}class dc extends un{constructor(e=new Yh([new xe(.5,.5),new xe(-.5,.5),new xe(-.5,-.5),new xe(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const i=this,r=[],s=[];for(let a=0,l=e.length;a<l;a++){const c=e[a];o(c)}this.setAttribute("position",new Nt(r,3)),this.setAttribute("uv",new Nt(s,2)),this.computeVertexNormals();function o(a){const l=[],c=t.curveSegments!==void 0?t.curveSegments:12,u=t.steps!==void 0?t.steps:1,h=t.depth!==void 0?t.depth:1;let d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:f-.1,_=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3;const p=t.extrudePath,x=t.UVGenerator!==void 0?t.UVGenerator:qp;let y,b=!1,M,T,C,P;p&&(y=p.getSpacedPoints(u),b=!0,d=!1,M=p.computeFrenetFrames(u,!1),T=new D,C=new D,P=new D),d||(m=0,f=0,g=0,_=0);const E=a.extractPoints(c);let S=E.shape;const I=E.holes;if(!Xr.isClockWise(S)){S=S.reverse();for(let he=0,ie=I.length;he<ie;he++){const se=I[he];Xr.isClockWise(se)&&(I[he]=se.reverse())}}function $(he){const se=10000000000000001e-36;let oe=he[0];for(let Ee=1;Ee<=he.length;Ee++){const de=Ee%he.length,we=he[de],et=we.x-oe.x,Ze=we.y-oe.y,L=et*et+Ze*Ze,w=Math.max(Math.abs(we.x),Math.abs(we.y),Math.abs(oe.x),Math.abs(oe.y)),j=se*w*w;if(L<=j){he.splice(de,1),Ee--;continue}oe=we}}$(S),I.forEach($);const V=I.length,k=S;for(let he=0;he<V;he++){const ie=I[he];S=S.concat(ie)}function G(he,ie,se){return ie||console.error("THREE.ExtrudeGeometry: vec does not exist"),he.clone().addScaledVector(ie,se)}const W=S.length;function N(he,ie,se){let oe,Ee,de;const we=he.x-ie.x,et=he.y-ie.y,Ze=se.x-he.x,L=se.y-he.y,w=we*we+et*et,j=we*L-et*Ze;if(Math.abs(j)>Number.EPSILON){const ee=Math.sqrt(w),ue=Math.sqrt(Ze*Ze+L*L),z=ie.x-et/ee,We=ie.y+we/ee,ye=se.x-L/ue,Ve=se.y+Ze/ue,He=((ye-z)*L-(Ve-We)*Ze)/(we*L-et*Ze);oe=z+we*He-he.x,Ee=We+et*He-he.y;const me=oe*oe+Ee*Ee;if(me<=2)return new xe(oe,Ee);de=Math.sqrt(me/2)}else{let ee=!1;we>Number.EPSILON?Ze>Number.EPSILON&&(ee=!0):we<-Number.EPSILON?Ze<-Number.EPSILON&&(ee=!0):Math.sign(et)===Math.sign(L)&&(ee=!0),ee?(oe=-et,Ee=we,de=Math.sqrt(w)):(oe=we,Ee=et,de=Math.sqrt(w/2))}return new xe(oe/de,Ee/de)}const ce=[];for(let he=0,ie=k.length,se=ie-1,oe=he+1;he<ie;he++,se++,oe++)se===ie&&(se=0),oe===ie&&(oe=0),ce[he]=N(k[he],k[se],k[oe]);const _e=[];let ve,Je=ce.concat();for(let he=0,ie=V;he<ie;he++){const se=I[he];ve=[];for(let oe=0,Ee=se.length,de=Ee-1,we=oe+1;oe<Ee;oe++,de++,we++)de===Ee&&(de=0),we===Ee&&(we=0),ve[oe]=N(se[oe],se[de],se[we]);_e.push(ve),Je=Je.concat(ve)}let pt;if(m===0)pt=Xr.triangulateShape(k,I);else{const he=[],ie=[];for(let se=0;se<m;se++){const oe=se/m,Ee=f*Math.cos(oe*Math.PI/2),de=g*Math.sin(oe*Math.PI/2)+_;for(let we=0,et=k.length;we<et;we++){const Ze=G(k[we],ce[we],de);$e(Ze.x,Ze.y,-Ee),oe===0&&he.push(Ze)}for(let we=0,et=V;we<et;we++){const Ze=I[we];ve=_e[we];const L=[];for(let w=0,j=Ze.length;w<j;w++){const ee=G(Ze[w],ve[w],de);$e(ee.x,ee.y,-Ee),oe===0&&L.push(ee)}oe===0&&ie.push(L)}}pt=Xr.triangulateShape(he,ie)}const ut=pt.length,mt=g+_;for(let he=0;he<W;he++){const ie=d?G(S[he],Je[he],mt):S[he];b?(C.copy(M.normals[0]).multiplyScalar(ie.x),T.copy(M.binormals[0]).multiplyScalar(ie.y),P.copy(y[0]).add(C).add(T),$e(P.x,P.y,P.z)):$e(ie.x,ie.y,0)}for(let he=1;he<=u;he++)for(let ie=0;ie<W;ie++){const se=d?G(S[ie],Je[ie],mt):S[ie];b?(C.copy(M.normals[he]).multiplyScalar(se.x),T.copy(M.binormals[he]).multiplyScalar(se.y),P.copy(y[he]).add(C).add(T),$e(P.x,P.y,P.z)):$e(se.x,se.y,h/u*he)}for(let he=m-1;he>=0;he--){const ie=he/m,se=f*Math.cos(ie*Math.PI/2),oe=g*Math.sin(ie*Math.PI/2)+_;for(let Ee=0,de=k.length;Ee<de;Ee++){const we=G(k[Ee],ce[Ee],oe);$e(we.x,we.y,h+se)}for(let Ee=0,de=I.length;Ee<de;Ee++){const we=I[Ee];ve=_e[Ee];for(let et=0,Ze=we.length;et<Ze;et++){const L=G(we[et],ve[et],oe);b?$e(L.x,L.y+y[u-1].y,y[u-1].x+se):$e(L.x,L.y,h+se)}}}Q(),te();function Q(){const he=r.length/3;if(d){let ie=0,se=W*ie;for(let oe=0;oe<ut;oe++){const Ee=pt[oe];ze(Ee[2]+se,Ee[1]+se,Ee[0]+se)}ie=u+m*2,se=W*ie;for(let oe=0;oe<ut;oe++){const Ee=pt[oe];ze(Ee[0]+se,Ee[1]+se,Ee[2]+se)}}else{for(let ie=0;ie<ut;ie++){const se=pt[ie];ze(se[2],se[1],se[0])}for(let ie=0;ie<ut;ie++){const se=pt[ie];ze(se[0]+W*u,se[1]+W*u,se[2]+W*u)}}i.addGroup(he,r.length/3-he,0)}function te(){const he=r.length/3;let ie=0;Le(k,ie),ie+=k.length;for(let se=0,oe=I.length;se<oe;se++){const Ee=I[se];Le(Ee,ie),ie+=Ee.length}i.addGroup(he,r.length/3-he,1)}function Le(he,ie){let se=he.length;for(;--se>=0;){const oe=se;let Ee=se-1;Ee<0&&(Ee=he.length-1);for(let de=0,we=u+m*2;de<we;de++){const et=W*de,Ze=W*(de+1),L=ie+oe+et,w=ie+Ee+et,j=ie+Ee+Ze,ee=ie+oe+Ze;xt(L,w,j,ee)}}}function $e(he,ie,se){l.push(he),l.push(ie),l.push(se)}function ze(he,ie,se){ot(he),ot(ie),ot(se);const oe=r.length/3,Ee=x.generateTopUV(i,r,oe-3,oe-2,oe-1);F(Ee[0]),F(Ee[1]),F(Ee[2])}function xt(he,ie,se,oe){ot(he),ot(ie),ot(oe),ot(ie),ot(se),ot(oe);const Ee=r.length/3,de=x.generateSideWallUV(i,r,Ee-6,Ee-3,Ee-2,Ee-1);F(de[0]),F(de[1]),F(de[3]),F(de[1]),F(de[2]),F(de[3])}function ot(he){r.push(l[he*3+0]),r.push(l[he*3+1]),r.push(l[he*3+2])}function F(he){s.push(he.x),s.push(he.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,i=this.parameters.options;return Xp(t,i,e)}static fromJSON(e,t){const i=[];for(let s=0,o=e.shapes.length;s<o;s++){const a=t[e.shapes[s]];i.push(a)}const r=e.options.extrudePath;return r!==void 0&&(e.options.extrudePath=new Bo[r.type]().fromJSON(r)),new dc(i,e.options)}}const qp={generateTopUV:function(n,e,t,i,r){const s=e[t*3],o=e[t*3+1],a=e[i*3],l=e[i*3+1],c=e[r*3],u=e[r*3+1];return[new xe(s,o),new xe(a,l),new xe(c,u)]},generateSideWallUV:function(n,e,t,i,r,s){const o=e[t*3],a=e[t*3+1],l=e[t*3+2],c=e[i*3],u=e[i*3+1],h=e[i*3+2],d=e[r*3],f=e[r*3+1],g=e[r*3+2],_=e[s*3],m=e[s*3+1],p=e[s*3+2];return Math.abs(a-u)<Math.abs(o-c)?[new xe(o,1-l),new xe(c,1-h),new xe(d,1-g),new xe(_,1-p)]:[new xe(a,1-l),new xe(u,1-h),new xe(f,1-g),new xe(m,1-p)]}};function Xp(n,e,t){if(t.shapes=[],Array.isArray(n))for(let i=0,r=n.length;i<r;i++){const s=n[i];t.shapes.push(s.uuid)}else t.shapes.push(n.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class fc extends un{constructor(e=[new xe(0,-.5),new xe(.5,0),new xe(0,.5)],t=12,i=0,r=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:i,phiLength:r},t=Math.floor(t),r=ft(r,0,Math.PI*2);const s=[],o=[],a=[],l=[],c=[],u=1/t,h=new D,d=new xe,f=new D,g=new D,_=new D;let m=0,p=0;for(let x=0;x<=e.length-1;x++)switch(x){case 0:m=e[x+1].x-e[x].x,p=e[x+1].y-e[x].y,f.x=p*1,f.y=-m,f.z=p*0,_.copy(f),f.normalize(),l.push(f.x,f.y,f.z);break;case e.length-1:l.push(_.x,_.y,_.z);break;default:m=e[x+1].x-e[x].x,p=e[x+1].y-e[x].y,f.x=p*1,f.y=-m,f.z=p*0,g.copy(f),f.x+=_.x,f.y+=_.y,f.z+=_.z,f.normalize(),l.push(f.x,f.y,f.z),_.copy(g)}for(let x=0;x<=t;x++){const y=i+x*u*r,b=Math.sin(y),M=Math.cos(y);for(let T=0;T<=e.length-1;T++){h.x=e[T].x*b,h.y=e[T].y,h.z=e[T].x*M,o.push(h.x,h.y,h.z),d.x=x/t,d.y=T/(e.length-1),a.push(d.x,d.y);const C=l[3*T+0]*b,P=l[3*T+1],E=l[3*T+0]*M;c.push(C,P,E)}}for(let x=0;x<t;x++)for(let y=0;y<e.length-1;y++){const b=y+x*e.length,M=b,T=b+e.length,C=b+e.length+1,P=b+1;s.push(M,T,P),s.push(C,P,T)}this.setIndex(s),this.setAttribute("position",new Nt(o,3)),this.setAttribute("uv",new Nt(a,2)),this.setAttribute("normal",new Nt(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new fc(e.points,e.segments,e.phiStart,e.phiLength)}}class Di extends un{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};const s=e/2,o=t/2,a=Math.floor(i),l=Math.floor(r),c=a+1,u=l+1,h=e/a,d=t/l,f=[],g=[],_=[],m=[];for(let p=0;p<u;p++){const x=p*d-o;for(let y=0;y<c;y++){const b=y*h-s;g.push(b,-x,0),_.push(0,0,1),m.push(y/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let x=0;x<a;x++){const y=x+c*p,b=x+c*(p+1),M=x+1+c*(p+1),T=x+1+c*p;f.push(y,b,T),f.push(b,M,T)}this.setIndex(f),this.setAttribute("position",new Nt(g,3)),this.setAttribute("normal",new Nt(_,3)),this.setAttribute("uv",new Nt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Di(e.width,e.height,e.widthSegments,e.heightSegments)}}class Ai extends un{constructor(e=1,t=32,i=16,r=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:r,phiLength:s,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const l=Math.min(o+a,Math.PI);let c=0;const u=[],h=new D,d=new D,f=[],g=[],_=[],m=[];for(let p=0;p<=i;p++){const x=[],y=p/i;let b=0;p===0&&o===0?b=.5/t:p===i&&l===Math.PI&&(b=-.5/t);for(let M=0;M<=t;M++){const T=M/t;h.x=-e*Math.cos(r+T*s)*Math.sin(o+y*a),h.y=e*Math.cos(o+y*a),h.z=e*Math.sin(r+T*s)*Math.sin(o+y*a),g.push(h.x,h.y,h.z),d.copy(h).normalize(),_.push(d.x,d.y,d.z),m.push(T+b,1-y),x.push(c++)}u.push(x)}for(let p=0;p<i;p++)for(let x=0;x<t;x++){const y=u[p][x+1],b=u[p][x],M=u[p+1][x],T=u[p+1][x+1];(p!==0||o>0)&&f.push(y,b,T),(p!==i-1||l<Math.PI)&&f.push(b,M,T)}this.setIndex(f),this.setAttribute("position",new Nt(g,3)),this.setAttribute("normal",new Nt(_,3)),this.setAttribute("uv",new Nt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ai(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class qi extends un{constructor(e=1,t=.4,i=12,r=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:r,arc:s},i=Math.floor(i),r=Math.floor(r);const o=[],a=[],l=[],c=[],u=new D,h=new D,d=new D;for(let f=0;f<=i;f++)for(let g=0;g<=r;g++){const _=g/r*s,m=f/i*Math.PI*2;h.x=(e+t*Math.cos(m))*Math.cos(_),h.y=(e+t*Math.cos(m))*Math.sin(_),h.z=t*Math.sin(m),a.push(h.x,h.y,h.z),u.x=e*Math.cos(_),u.y=e*Math.sin(_),d.subVectors(h,u).normalize(),l.push(d.x,d.y,d.z),c.push(g/r),c.push(f/i)}for(let f=1;f<=i;f++)for(let g=1;g<=r;g++){const _=(r+1)*f+g-1,m=(r+1)*(f-1)+g-1,p=(r+1)*(f-1)+g,x=(r+1)*f+g;o.push(_,m,x),o.push(m,p,x)}this.setIndex(o),this.setAttribute("position",new Nt(a,3)),this.setAttribute("normal",new Nt(l,3)),this.setAttribute("uv",new Nt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new qi(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class Xo extends un{constructor(e=new hc(new D(-1,-1,0),new D(-1,1,0),new D(1,1,0)),t=64,i=1,r=8,s=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:i,radialSegments:r,closed:s};const o=e.computeFrenetFrames(t,s);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;const a=new D,l=new D,c=new xe;let u=new D;const h=[],d=[],f=[],g=[];_(),this.setIndex(g),this.setAttribute("position",new Nt(h,3)),this.setAttribute("normal",new Nt(d,3)),this.setAttribute("uv",new Nt(f,2));function _(){for(let y=0;y<t;y++)m(y);m(s===!1?t:0),x(),p()}function m(y){u=e.getPointAt(y/t,u);const b=o.normals[y],M=o.binormals[y];for(let T=0;T<=r;T++){const C=T/r*Math.PI*2,P=Math.sin(C),E=-Math.cos(C);l.x=E*b.x+P*M.x,l.y=E*b.y+P*M.y,l.z=E*b.z+P*M.z,l.normalize(),d.push(l.x,l.y,l.z),a.x=u.x+i*l.x,a.y=u.y+i*l.y,a.z=u.z+i*l.z,h.push(a.x,a.y,a.z)}}function p(){for(let y=1;y<=t;y++)for(let b=1;b<=r;b++){const M=(r+1)*(y-1)+(b-1),T=(r+1)*y+(b-1),C=(r+1)*y+b,P=(r+1)*(y-1)+b;g.push(M,T,P),g.push(T,C,P)}}function x(){for(let y=0;y<=t;y++)for(let b=0;b<=r;b++)c.x=y/t,c.y=b/r,f.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new Xo(new Bo[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}}class pc extends us{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new St(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new St(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Dh,this.normalScale=new xe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Jn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Yp extends us{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=ff,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class jp extends us{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Zp extends Oo{constructor(e){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}}class Qh extends cn{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new St(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class Kp extends Qh{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(cn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new St(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Ba=new Gt,yu=new D,Mu=new D;class Jp{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new xe(512,512),this.mapType=gi,this.map=null,this.mapPass=null,this.matrix=new Gt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new sc,this._frameExtents=new xe(1,1),this._viewportCount=1,this._viewports=[new Yt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;yu.setFromMatrixPosition(e.matrixWorld),t.position.copy(yu),Mu.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Mu),t.updateMatrixWorld(),Ba.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ba,t.coordinateSystem,t.reversedDepth),t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Ba)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class ed extends zh{constructor(e=-1,t=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,o=i+e,a=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Qp extends Jp{constructor(){super(new ed(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Su extends Qh{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(cn.DEFAULT_UP),this.updateMatrix(),this.target=new cn,this.shadow=new Qp}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class em extends jn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const Eu=new Gt;class tm{constructor(e,t,i=0,r=1/0){this.ray=new qo(e,t),this.near=i,this.far=r,this.camera=null,this.layers=new ic,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Eu.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Eu),this}intersectObject(e,t=!0,i=[]){return Bl(e,this,i,t),i.sort(wu),i}intersectObjects(e,t=!0,i=[]){for(let r=0,s=e.length;r<s;r++)Bl(e[r],this,i,t);return i.sort(wu),i}}function wu(n,e){return n.distance-e.distance}function Bl(n,e,t,i){let r=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(r=!1),r===!0&&i===!0){const s=n.children;for(let o=0,a=s.length;o<a;o++)Bl(s[o],e,t,!0)}}class Tu{constructor(e=1,t=0,i=0){this.radius=e,this.phi=t,this.theta=i}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=ft(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(ft(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class nm extends br{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function Au(n,e,t,i){const r=im(i);switch(t){case Rh:return n*e;case Ph:return n*e/r.components*r.byteLength;case Jl:return n*e/r.components*r.byteLength;case Lh:return n*e*2/r.components*r.byteLength;case Ql:return n*e*2/r.components*r.byteLength;case Ch:return n*e*3/r.components*r.byteLength;case ai:return n*e*4/r.components*r.byteLength;case ec:return n*e*4/r.components*r.byteLength;case Ro:case Co:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Po:case Lo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case ll:case ul:return Math.max(n,16)*Math.max(e,8)/4;case al:case cl:return Math.max(n,8)*Math.max(e,8)/2;case hl:case dl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case fl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case pl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case ml:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case gl:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case vl:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case _l:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case xl:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case bl:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case yl:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Ml:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Sl:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case El:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case wl:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case Tl:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Al:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Rl:case Cl:case Pl:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Ll:case Dl:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Il:case Ul:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function im(n){switch(n){case gi:case Eh:return{byteLength:1,components:1};case Is:case wh:case Gs:return{byteLength:2,components:1};case Zl:case Kl:return{byteLength:2,components:4};case vr:case jl:case Li:return{byteLength:4,components:1};case Th:case Ah:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Yl}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Yl);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function td(){let n=null,e=!1,t=null,i=null;function r(s,o){t(s,o),i=n.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function rm(n){const e=new WeakMap;function t(a,l){const c=a.array,u=a.usage,h=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,u),a.onUploadCallback();let f;if(c instanceof Float32Array)f=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=n.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=n.SHORT;else if(c instanceof Uint32Array)f=n.UNSIGNED_INT;else if(c instanceof Int32Array)f=n.INT;else if(c instanceof Int8Array)f=n.BYTE;else if(c instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:h}}function i(a,l,c){const u=l.array,h=l.updateRanges;if(n.bindBuffer(c,a),h.length===0)n.bufferSubData(c,0,u);else{h.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<h.length;f++){const g=h[d],_=h[f];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++d,h[d]=_)}h.length=d+1;for(let f=0,g=h.length;f<g;f++){const _=h[f];n.bufferSubData(c,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);l&&(n.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:r,remove:s,update:o}}var sm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,om=`#ifdef USE_ALPHAHASH
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
#endif`,am=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,lm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,cm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,um=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,hm=`#ifdef USE_AOMAP
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
#endif`,dm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,fm=`#ifdef USE_BATCHING
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
#endif`,pm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,mm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,gm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,vm=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,_m=`#ifdef USE_IRIDESCENCE
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
#endif`,xm=`#ifdef USE_BUMPMAP
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
#endif`,bm=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,ym=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Mm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Sm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Em=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,wm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Tm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Am=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Rm=`#define PI 3.141592653589793
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
} // validated`,Cm=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Pm=`vec3 transformedNormal = objectNormal;
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
#endif`,Lm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Dm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Im=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Um=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Nm="gl_FragColor = linearToOutputTexel( gl_FragColor );",Om=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Fm=`#ifdef USE_ENVMAP
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
#endif`,km=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Bm=`#ifdef USE_ENVMAP
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
#endif`,zm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Vm=`#ifdef USE_ENVMAP
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
#endif`,Hm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Gm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Wm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,$m=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,qm=`#ifdef USE_GRADIENTMAP
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
}`,Xm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Ym=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,jm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Zm=`uniform bool receiveShadow;
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
#endif`,Km=`#ifdef USE_ENVMAP
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
#endif`,Jm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Qm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,e0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,t0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,n0=`PhysicalMaterial material;
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
#endif`,i0=`struct PhysicalMaterial {
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
}`,r0=`
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
#endif`,s0=`#if defined( RE_IndirectDiffuse )
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
#endif`,o0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,a0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,l0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,c0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,u0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,h0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,d0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,f0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,p0=`#if defined( USE_POINTS_UV )
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
#endif`,m0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,g0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,v0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,_0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,x0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,b0=`#ifdef USE_MORPHTARGETS
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
#endif`,y0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,M0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,S0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,E0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,w0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,T0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,A0=`#ifdef USE_NORMALMAP
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
#endif`,R0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,C0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,P0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,L0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,D0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,I0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,U0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,N0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,O0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,F0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,k0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,B0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,z0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,V0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,H0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,G0=`float getShadowMask() {
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
}`,W0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,$0=`#ifdef USE_SKINNING
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
#endif`,q0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,X0=`#ifdef USE_SKINNING
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
#endif`,Y0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,j0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Z0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,K0=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,J0=`#ifdef USE_TRANSMISSION
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
#endif`,Q0=`#ifdef USE_TRANSMISSION
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
#endif`,eg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,tg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ng=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ig=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const rg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,sg=`uniform sampler2D t2D;
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
}`,og=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ag=`#ifdef ENVMAP_TYPE_CUBE
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
}`,lg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ug=`#include <common>
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
}`,hg=`#if DEPTH_PACKING == 3200
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
}`,dg=`#define DISTANCE
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
}`,fg=`#define DISTANCE
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
}`,pg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,mg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,gg=`uniform float scale;
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
}`,vg=`uniform vec3 diffuse;
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
}`,_g=`#include <common>
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
}`,xg=`uniform vec3 diffuse;
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
}`,bg=`#define LAMBERT
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
}`,yg=`#define LAMBERT
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
}`,Mg=`#define MATCAP
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
}`,Sg=`#define MATCAP
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
}`,Eg=`#define NORMAL
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
}`,wg=`#define NORMAL
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
}`,Tg=`#define PHONG
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
}`,Ag=`#define PHONG
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
}`,Rg=`#define STANDARD
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
}`,Cg=`#define STANDARD
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
}`,Pg=`#define TOON
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
}`,Lg=`#define TOON
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
}`,Dg=`uniform float size;
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
}`,Ig=`uniform vec3 diffuse;
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
}`,Ug=`#include <common>
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
}`,Ng=`uniform vec3 color;
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
}`,Og=`uniform float rotation;
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
}`,Fg=`uniform vec3 diffuse;
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
}`,vt={alphahash_fragment:sm,alphahash_pars_fragment:om,alphamap_fragment:am,alphamap_pars_fragment:lm,alphatest_fragment:cm,alphatest_pars_fragment:um,aomap_fragment:hm,aomap_pars_fragment:dm,batching_pars_vertex:fm,batching_vertex:pm,begin_vertex:mm,beginnormal_vertex:gm,bsdfs:vm,iridescence_fragment:_m,bumpmap_pars_fragment:xm,clipping_planes_fragment:bm,clipping_planes_pars_fragment:ym,clipping_planes_pars_vertex:Mm,clipping_planes_vertex:Sm,color_fragment:Em,color_pars_fragment:wm,color_pars_vertex:Tm,color_vertex:Am,common:Rm,cube_uv_reflection_fragment:Cm,defaultnormal_vertex:Pm,displacementmap_pars_vertex:Lm,displacementmap_vertex:Dm,emissivemap_fragment:Im,emissivemap_pars_fragment:Um,colorspace_fragment:Nm,colorspace_pars_fragment:Om,envmap_fragment:Fm,envmap_common_pars_fragment:km,envmap_pars_fragment:Bm,envmap_pars_vertex:zm,envmap_physical_pars_fragment:Km,envmap_vertex:Vm,fog_vertex:Hm,fog_pars_vertex:Gm,fog_fragment:Wm,fog_pars_fragment:$m,gradientmap_pars_fragment:qm,lightmap_pars_fragment:Xm,lights_lambert_fragment:Ym,lights_lambert_pars_fragment:jm,lights_pars_begin:Zm,lights_toon_fragment:Jm,lights_toon_pars_fragment:Qm,lights_phong_fragment:e0,lights_phong_pars_fragment:t0,lights_physical_fragment:n0,lights_physical_pars_fragment:i0,lights_fragment_begin:r0,lights_fragment_maps:s0,lights_fragment_end:o0,logdepthbuf_fragment:a0,logdepthbuf_pars_fragment:l0,logdepthbuf_pars_vertex:c0,logdepthbuf_vertex:u0,map_fragment:h0,map_pars_fragment:d0,map_particle_fragment:f0,map_particle_pars_fragment:p0,metalnessmap_fragment:m0,metalnessmap_pars_fragment:g0,morphinstance_vertex:v0,morphcolor_vertex:_0,morphnormal_vertex:x0,morphtarget_pars_vertex:b0,morphtarget_vertex:y0,normal_fragment_begin:M0,normal_fragment_maps:S0,normal_pars_fragment:E0,normal_pars_vertex:w0,normal_vertex:T0,normalmap_pars_fragment:A0,clearcoat_normal_fragment_begin:R0,clearcoat_normal_fragment_maps:C0,clearcoat_pars_fragment:P0,iridescence_pars_fragment:L0,opaque_fragment:D0,packing:I0,premultiplied_alpha_fragment:U0,project_vertex:N0,dithering_fragment:O0,dithering_pars_fragment:F0,roughnessmap_fragment:k0,roughnessmap_pars_fragment:B0,shadowmap_pars_fragment:z0,shadowmap_pars_vertex:V0,shadowmap_vertex:H0,shadowmask_pars_fragment:G0,skinbase_vertex:W0,skinning_pars_vertex:$0,skinning_vertex:q0,skinnormal_vertex:X0,specularmap_fragment:Y0,specularmap_pars_fragment:j0,tonemapping_fragment:Z0,tonemapping_pars_fragment:K0,transmission_fragment:J0,transmission_pars_fragment:Q0,uv_pars_fragment:eg,uv_pars_vertex:tg,uv_vertex:ng,worldpos_vertex:ig,background_vert:rg,background_frag:sg,backgroundCube_vert:og,backgroundCube_frag:ag,cube_vert:lg,cube_frag:cg,depth_vert:ug,depth_frag:hg,distanceRGBA_vert:dg,distanceRGBA_frag:fg,equirect_vert:pg,equirect_frag:mg,linedashed_vert:gg,linedashed_frag:vg,meshbasic_vert:_g,meshbasic_frag:xg,meshlambert_vert:bg,meshlambert_frag:yg,meshmatcap_vert:Mg,meshmatcap_frag:Sg,meshnormal_vert:Eg,meshnormal_frag:wg,meshphong_vert:Tg,meshphong_frag:Ag,meshphysical_vert:Rg,meshphysical_frag:Cg,meshtoon_vert:Pg,meshtoon_frag:Lg,points_vert:Dg,points_frag:Ig,shadow_vert:Ug,shadow_frag:Ng,sprite_vert:Og,sprite_frag:Fg},Pe={common:{diffuse:{value:new St(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new dt},alphaMap:{value:null},alphaMapTransform:{value:new dt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new dt}},envmap:{envMap:{value:null},envMapRotation:{value:new dt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new dt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new dt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new dt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new dt},normalScale:{value:new xe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new dt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new dt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new dt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new dt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new St(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new St(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new dt},alphaTest:{value:0},uvTransform:{value:new dt}},sprite:{diffuse:{value:new St(16777215)},opacity:{value:1},center:{value:new xe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new dt},alphaMap:{value:null},alphaMapTransform:{value:new dt},alphaTest:{value:0}}},di={basic:{uniforms:Ln([Pe.common,Pe.specularmap,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.fog]),vertexShader:vt.meshbasic_vert,fragmentShader:vt.meshbasic_frag},lambert:{uniforms:Ln([Pe.common,Pe.specularmap,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.fog,Pe.lights,{emissive:{value:new St(0)}}]),vertexShader:vt.meshlambert_vert,fragmentShader:vt.meshlambert_frag},phong:{uniforms:Ln([Pe.common,Pe.specularmap,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.fog,Pe.lights,{emissive:{value:new St(0)},specular:{value:new St(1118481)},shininess:{value:30}}]),vertexShader:vt.meshphong_vert,fragmentShader:vt.meshphong_frag},standard:{uniforms:Ln([Pe.common,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.roughnessmap,Pe.metalnessmap,Pe.fog,Pe.lights,{emissive:{value:new St(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:vt.meshphysical_vert,fragmentShader:vt.meshphysical_frag},toon:{uniforms:Ln([Pe.common,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.gradientmap,Pe.fog,Pe.lights,{emissive:{value:new St(0)}}]),vertexShader:vt.meshtoon_vert,fragmentShader:vt.meshtoon_frag},matcap:{uniforms:Ln([Pe.common,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.fog,{matcap:{value:null}}]),vertexShader:vt.meshmatcap_vert,fragmentShader:vt.meshmatcap_frag},points:{uniforms:Ln([Pe.points,Pe.fog]),vertexShader:vt.points_vert,fragmentShader:vt.points_frag},dashed:{uniforms:Ln([Pe.common,Pe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:vt.linedashed_vert,fragmentShader:vt.linedashed_frag},depth:{uniforms:Ln([Pe.common,Pe.displacementmap]),vertexShader:vt.depth_vert,fragmentShader:vt.depth_frag},normal:{uniforms:Ln([Pe.common,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,{opacity:{value:1}}]),vertexShader:vt.meshnormal_vert,fragmentShader:vt.meshnormal_frag},sprite:{uniforms:Ln([Pe.sprite,Pe.fog]),vertexShader:vt.sprite_vert,fragmentShader:vt.sprite_frag},background:{uniforms:{uvTransform:{value:new dt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:vt.background_vert,fragmentShader:vt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new dt}},vertexShader:vt.backgroundCube_vert,fragmentShader:vt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:vt.cube_vert,fragmentShader:vt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:vt.equirect_vert,fragmentShader:vt.equirect_frag},distanceRGBA:{uniforms:Ln([Pe.common,Pe.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:vt.distanceRGBA_vert,fragmentShader:vt.distanceRGBA_frag},shadow:{uniforms:Ln([Pe.lights,Pe.fog,{color:{value:new St(0)},opacity:{value:1}}]),vertexShader:vt.shadow_vert,fragmentShader:vt.shadow_frag}};di.physical={uniforms:Ln([di.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new dt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new dt},clearcoatNormalScale:{value:new xe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new dt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new dt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new dt},sheen:{value:0},sheenColor:{value:new St(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new dt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new dt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new dt},transmissionSamplerSize:{value:new xe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new dt},attenuationDistance:{value:0},attenuationColor:{value:new St(0)},specularColor:{value:new St(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new dt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new dt},anisotropyVector:{value:new xe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new dt}}]),vertexShader:vt.meshphysical_vert,fragmentShader:vt.meshphysical_frag};const Eo={r:0,b:0,g:0},cr=new Jn,kg=new Gt;function Bg(n,e,t,i,r,s,o){const a=new St(0);let l=s===!0?0:1,c,u,h=null,d=0,f=null;function g(y){let b=y.isScene===!0?y.background:null;return b&&b.isTexture&&(b=(y.backgroundBlurriness>0?t:e).get(b)),b}function _(y){let b=!1;const M=g(y);M===null?p(a,l):M&&M.isColor&&(p(M,1),b=!0);const T=n.xr.getEnvironmentBlendMode();T==="additive"?i.buffers.color.setClear(0,0,0,1,o):T==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||b)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(y,b){const M=g(b);M&&(M.isCubeTexture||M.mapping===Wo)?(u===void 0&&(u=new En(new Zt(1,1,1),new tr({name:"BackgroundCubeMaterial",uniforms:as(di.backgroundCube.uniforms),vertexShader:di.backgroundCube.vertexShader,fragmentShader:di.backgroundCube.fragmentShader,side:kn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(T,C,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),cr.copy(b.backgroundRotation),cr.x*=-1,cr.y*=-1,cr.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(cr.y*=-1,cr.z*=-1),u.material.uniforms.envMap.value=M,u.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(kg.makeRotationFromEuler(cr)),u.material.toneMapped=Ct.getTransfer(M.colorSpace)!==Ft,(h!==M||d!==M.version||f!==n.toneMapping)&&(u.material.needsUpdate=!0,h=M,d=M.version,f=n.toneMapping),u.layers.enableAll(),y.unshift(u,u.geometry,u.material,0,0,null)):M&&M.isTexture&&(c===void 0&&(c=new En(new Di(2,2),new tr({name:"BackgroundMaterial",uniforms:as(di.background.uniforms),vertexShader:di.background.vertexShader,fragmentShader:di.background.fragmentShader,side:er,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=M,c.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,c.material.toneMapped=Ct.getTransfer(M.colorSpace)!==Ft,M.matrixAutoUpdate===!0&&M.updateMatrix(),c.material.uniforms.uvTransform.value.copy(M.matrix),(h!==M||d!==M.version||f!==n.toneMapping)&&(c.material.needsUpdate=!0,h=M,d=M.version,f=n.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null))}function p(y,b){y.getRGB(Eo,Bh(n)),i.buffers.color.setClear(Eo.r,Eo.g,Eo.b,b,o)}function x(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(y,b=1){a.set(y),l=b,p(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(y){l=y,p(a,l)},render:_,addToRenderList:m,dispose:x}}function zg(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=d(null);let s=r,o=!1;function a(S,I,B,$,V){let k=!1;const G=h($,B,I);s!==G&&(s=G,c(s.object)),k=f(S,$,B,V),k&&g(S,$,B,V),V!==null&&e.update(V,n.ELEMENT_ARRAY_BUFFER),(k||o)&&(o=!1,b(S,I,B,$),V!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(V).buffer))}function l(){return n.createVertexArray()}function c(S){return n.bindVertexArray(S)}function u(S){return n.deleteVertexArray(S)}function h(S,I,B){const $=B.wireframe===!0;let V=i[S.id];V===void 0&&(V={},i[S.id]=V);let k=V[I.id];k===void 0&&(k={},V[I.id]=k);let G=k[$];return G===void 0&&(G=d(l()),k[$]=G),G}function d(S){const I=[],B=[],$=[];for(let V=0;V<t;V++)I[V]=0,B[V]=0,$[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:B,attributeDivisors:$,object:S,attributes:{},index:null}}function f(S,I,B,$){const V=s.attributes,k=I.attributes;let G=0;const W=B.getAttributes();for(const N in W)if(W[N].location>=0){const _e=V[N];let ve=k[N];if(ve===void 0&&(N==="instanceMatrix"&&S.instanceMatrix&&(ve=S.instanceMatrix),N==="instanceColor"&&S.instanceColor&&(ve=S.instanceColor)),_e===void 0||_e.attribute!==ve||ve&&_e.data!==ve.data)return!0;G++}return s.attributesNum!==G||s.index!==$}function g(S,I,B,$){const V={},k=I.attributes;let G=0;const W=B.getAttributes();for(const N in W)if(W[N].location>=0){let _e=k[N];_e===void 0&&(N==="instanceMatrix"&&S.instanceMatrix&&(_e=S.instanceMatrix),N==="instanceColor"&&S.instanceColor&&(_e=S.instanceColor));const ve={};ve.attribute=_e,_e&&_e.data&&(ve.data=_e.data),V[N]=ve,G++}s.attributes=V,s.attributesNum=G,s.index=$}function _(){const S=s.newAttributes;for(let I=0,B=S.length;I<B;I++)S[I]=0}function m(S){p(S,0)}function p(S,I){const B=s.newAttributes,$=s.enabledAttributes,V=s.attributeDivisors;B[S]=1,$[S]===0&&(n.enableVertexAttribArray(S),$[S]=1),V[S]!==I&&(n.vertexAttribDivisor(S,I),V[S]=I)}function x(){const S=s.newAttributes,I=s.enabledAttributes;for(let B=0,$=I.length;B<$;B++)I[B]!==S[B]&&(n.disableVertexAttribArray(B),I[B]=0)}function y(S,I,B,$,V,k,G){G===!0?n.vertexAttribIPointer(S,I,B,V,k):n.vertexAttribPointer(S,I,B,$,V,k)}function b(S,I,B,$){_();const V=$.attributes,k=B.getAttributes(),G=I.defaultAttributeValues;for(const W in k){const N=k[W];if(N.location>=0){let ce=V[W];if(ce===void 0&&(W==="instanceMatrix"&&S.instanceMatrix&&(ce=S.instanceMatrix),W==="instanceColor"&&S.instanceColor&&(ce=S.instanceColor)),ce!==void 0){const _e=ce.normalized,ve=ce.itemSize,Je=e.get(ce);if(Je===void 0)continue;const pt=Je.buffer,ut=Je.type,mt=Je.bytesPerElement,Q=ut===n.INT||ut===n.UNSIGNED_INT||ce.gpuType===jl;if(ce.isInterleavedBufferAttribute){const te=ce.data,Le=te.stride,$e=ce.offset;if(te.isInstancedInterleavedBuffer){for(let ze=0;ze<N.locationSize;ze++)p(N.location+ze,te.meshPerAttribute);S.isInstancedMesh!==!0&&$._maxInstanceCount===void 0&&($._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let ze=0;ze<N.locationSize;ze++)m(N.location+ze);n.bindBuffer(n.ARRAY_BUFFER,pt);for(let ze=0;ze<N.locationSize;ze++)y(N.location+ze,ve/N.locationSize,ut,_e,Le*mt,($e+ve/N.locationSize*ze)*mt,Q)}else{if(ce.isInstancedBufferAttribute){for(let te=0;te<N.locationSize;te++)p(N.location+te,ce.meshPerAttribute);S.isInstancedMesh!==!0&&$._maxInstanceCount===void 0&&($._maxInstanceCount=ce.meshPerAttribute*ce.count)}else for(let te=0;te<N.locationSize;te++)m(N.location+te);n.bindBuffer(n.ARRAY_BUFFER,pt);for(let te=0;te<N.locationSize;te++)y(N.location+te,ve/N.locationSize,ut,_e,ve*mt,ve/N.locationSize*te*mt,Q)}}else if(G!==void 0){const _e=G[W];if(_e!==void 0)switch(_e.length){case 2:n.vertexAttrib2fv(N.location,_e);break;case 3:n.vertexAttrib3fv(N.location,_e);break;case 4:n.vertexAttrib4fv(N.location,_e);break;default:n.vertexAttrib1fv(N.location,_e)}}}}x()}function M(){P();for(const S in i){const I=i[S];for(const B in I){const $=I[B];for(const V in $)u($[V].object),delete $[V];delete I[B]}delete i[S]}}function T(S){if(i[S.id]===void 0)return;const I=i[S.id];for(const B in I){const $=I[B];for(const V in $)u($[V].object),delete $[V];delete I[B]}delete i[S.id]}function C(S){for(const I in i){const B=i[I];if(B[S.id]===void 0)continue;const $=B[S.id];for(const V in $)u($[V].object),delete $[V];delete B[S.id]}}function P(){E(),o=!0,s!==r&&(s=r,c(s.object))}function E(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:P,resetDefaultState:E,dispose:M,releaseStatesOfGeometry:T,releaseStatesOfProgram:C,initAttributes:_,enableAttribute:m,disableUnusedAttributes:x}}function Vg(n,e,t){let i;function r(c){i=c}function s(c,u){n.drawArrays(i,c,u),t.update(u,i,1)}function o(c,u,h){h!==0&&(n.drawArraysInstanced(i,c,u,h),t.update(u,i,h))}function a(c,u,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,u,0,h);let f=0;for(let g=0;g<h;g++)f+=u[g];t.update(f,i,1)}function l(c,u,h,d){if(h===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)o(c[g],u[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(i,c,0,u,0,d,0,h);let g=0;for(let _=0;_<h;_++)g+=u[_]*d[_];t.update(g,i,1)}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function Hg(n,e,t,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");r=n.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(C){return!(C!==ai&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(C){const P=C===Gs&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==gi&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==Li&&!P)}function l(C){if(C==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const h=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),x=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),y=n.getParameter(n.MAX_VARYING_VECTORS),b=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),M=g>0,T=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:h,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:x,maxVaryings:y,maxFragmentUniforms:b,vertexTextures:M,maxSamples:T}}function Gg(n){const e=this;let t=null,i=0,r=!1,s=!1;const o=new Ri,a=new dt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const f=h.length!==0||d||i!==0||r;return r=d,i=h.length,f},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,d){t=u(h,d,0)},this.setState=function(h,d,f){const g=h.clippingPlanes,_=h.clipIntersection,m=h.clipShadows,p=n.get(h);if(!r||g===null||g.length===0||s&&!m)s?u(null):c();else{const x=s?0:i,y=x*4;let b=p.clippingState||null;l.value=b,b=u(g,d,y,f);for(let M=0;M!==y;++M)b[M]=t[M];p.clippingState=b,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(h,d,f,g){const _=h!==null?h.length:0;let m=null;if(_!==0){if(m=l.value,g!==!0||m===null){const p=f+_*4,x=d.matrixWorldInverse;a.getNormalMatrix(x),(m===null||m.length<p)&&(m=new Float32Array(p));for(let y=0,b=f;y!==_;++y,b+=4)o.copy(h[y]).applyMatrix4(x,a),o.normal.toArray(m,b),m[b+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}function Wg(n){let e=new WeakMap;function t(o,a){return a===il?o.mapping=rs:a===rl&&(o.mapping=ss),o}function i(o){if(o&&o.isTexture){const a=o.mapping;if(a===il||a===rl)if(e.has(o)){const l=e.get(o).texture;return t(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new cp(l.height);return c.fromEquirectangularTexture(n,o),e.set(o,c),o.addEventListener("dispose",r),t(c.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}const Yr=4,Ru=[.125,.215,.35,.446,.526,.582],fr=20,za=new ed,Cu=new St;let Va=null,Ha=0,Ga=0,Wa=!1;const hr=(1+Math.sqrt(5))/2,Gr=1/hr,Pu=[new D(-hr,Gr,0),new D(hr,Gr,0),new D(-Gr,0,hr),new D(Gr,0,hr),new D(0,hr,-Gr),new D(0,hr,Gr),new D(-1,1,-1),new D(1,1,-1),new D(-1,1,1),new D(1,1,1)],$g=new D;class Lu{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,r=100,s={}){const{size:o=256,position:a=$g}=s;Va=this._renderer.getRenderTarget(),Ha=this._renderer.getActiveCubeFace(),Ga=this._renderer.getActiveMipmapLevel(),Wa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,r,l,a),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Uu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Iu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Va,Ha,Ga),this._renderer.xr.enabled=Wa,e.scissorTest=!1,wo(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===rs||e.mapping===ss?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Va=this._renderer.getRenderTarget(),Ha=this._renderer.getActiveCubeFace(),Ga=this._renderer.getActiveMipmapLevel(),Wa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:oi,minFilter:oi,generateMipmaps:!1,type:Gs,format:ai,colorSpace:os,depthBuffer:!1},r=Du(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Du(e,t,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=qg(s)),this._blurMaterial=Xg(s,e,t)}return r}_compileMaterial(e){const t=new En(this._lodPlanes[0],e);this._renderer.compile(t,za)}_sceneToCubeUV(e,t,i,r,s){const l=new jn(90,1,t,i),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,f=h.toneMapping;h.getClearColor(Cu),h.toneMapping=Ji,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(r),h.clearDepth(),h.setRenderTarget(null));const _=new Yn({name:"PMREM.Background",side:kn,depthWrite:!1,depthTest:!1}),m=new En(new Zt,_);let p=!1;const x=e.background;x?x.isColor&&(_.color.copy(x),e.background=null,p=!0):(_.color.copy(Cu),p=!0);for(let y=0;y<6;y++){const b=y%3;b===0?(l.up.set(0,c[y],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+u[y],s.y,s.z)):b===1?(l.up.set(0,0,c[y]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+u[y],s.z)):(l.up.set(0,c[y],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+u[y]));const M=this._cubeSize;wo(r,b*M,y>2?M:0,M,M),h.setRenderTarget(r),p&&h.render(m,l),h.render(e,l)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=f,h.autoClear=d,e.background=x}_textureToCubeUV(e,t){const i=this._renderer,r=e.mapping===rs||e.mapping===ss;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Uu()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Iu());const s=r?this._cubemapMaterial:this._equirectMaterial,o=new En(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=e;const l=this._cubeSize;wo(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(o,za)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=Pu[(r-s-1)%Pu.length];this._blur(e,s-1,s,o,a)}t.autoClear=i}_blur(e,t,i,r,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,i,r,"latitudinal",s),this._halfBlur(o,e,i,i,r,"longitudinal",s)}_halfBlur(e,t,i,r,s,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new En(this._lodPlanes[r],c),d=c.uniforms,f=this._sizeLods[i]-1,g=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*fr-1),_=s/g,m=isFinite(s)?1+Math.floor(u*_):fr;m>fr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${fr}`);const p=[];let x=0;for(let C=0;C<fr;++C){const P=C/_,E=Math.exp(-P*P/2);p.push(E),C===0?x+=E:C<m&&(x+=2*E)}for(let C=0;C<p.length;C++)p[C]=p[C]/x;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:y}=this;d.dTheta.value=g,d.mipInt.value=y-i;const b=this._sizeLods[r],M=3*b*(r>y-Yr?r-y+Yr:0),T=4*(this._cubeSize-b);wo(t,M,T,3*b,2*b),l.setRenderTarget(t),l.render(h,za)}}function qg(n){const e=[],t=[],i=[];let r=n;const s=n-Yr+1+Ru.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);t.push(a);let l=1/a;o>n-Yr?l=Ru[o-n+Yr-1]:o===0&&(l=0),i.push(l);const c=1/(a-2),u=-c,h=1+c,d=[u,u,h,u,h,h,u,u,h,h,u,h],f=6,g=6,_=3,m=2,p=1,x=new Float32Array(_*g*f),y=new Float32Array(m*g*f),b=new Float32Array(p*g*f);for(let T=0;T<f;T++){const C=T%3*2/3-1,P=T>2?0:-1,E=[C,P,0,C+2/3,P,0,C+2/3,P+1,0,C,P,0,C+2/3,P+1,0,C,P+1,0];x.set(E,_*g*T),y.set(d,m*g*T);const S=[T,T,T,T,T,T];b.set(S,p*g*T)}const M=new un;M.setAttribute("position",new Kn(x,_)),M.setAttribute("uv",new Kn(y,m)),M.setAttribute("faceIndex",new Kn(b,p)),e.push(M),r>Yr&&r--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function Du(n,e,t){const i=new _r(n,e,t);return i.texture.mapping=Wo,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function wo(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function Xg(n,e,t){const i=new Float32Array(fr),r=new D(0,1,0);return new tr({name:"SphericalGaussianBlur",defines:{n:fr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:mc(),fragmentShader:`

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
		`,blending:Ki,depthTest:!1,depthWrite:!1})}function Iu(){return new tr({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:mc(),fragmentShader:`

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
		`,blending:Ki,depthTest:!1,depthWrite:!1})}function Uu(){return new tr({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:mc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ki,depthTest:!1,depthWrite:!1})}function mc(){return`

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
	`}function Yg(n){let e=new WeakMap,t=null;function i(a){if(a&&a.isTexture){const l=a.mapping,c=l===il||l===rl,u=l===rs||l===ss;if(c||u){let h=e.get(a);const d=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return t===null&&(t=new Lu(n)),h=c?t.fromEquirectangular(a,h):t.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),h.texture;if(h!==void 0)return h.texture;{const f=a.image;return c&&f&&f.height>0||u&&f&&r(f)?(t===null&&(t=new Lu(n)),h=c?t.fromEquirectangular(a):t.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),a.addEventListener("dispose",s),h.texture):null}}}return a}function r(a){let l=0;const c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function s(a){const l=a.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:o}}function jg(n){const e={};function t(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=n.getExtension(i)}return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const r=t(i);return r===null&&ks("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function Zg(n,e,t,i){const r={},s=new WeakMap;function o(h){const d=h.target;d.index!==null&&e.remove(d.index);for(const g in d.attributes)e.remove(d.attributes[g]);d.removeEventListener("dispose",o),delete r[d.id];const f=s.get(d);f&&(e.remove(f),s.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function a(h,d){return r[d.id]===!0||(d.addEventListener("dispose",o),r[d.id]=!0,t.memory.geometries++),d}function l(h){const d=h.attributes;for(const f in d)e.update(d[f],n.ARRAY_BUFFER)}function c(h){const d=[],f=h.index,g=h.attributes.position;let _=0;if(f!==null){const x=f.array;_=f.version;for(let y=0,b=x.length;y<b;y+=3){const M=x[y+0],T=x[y+1],C=x[y+2];d.push(M,T,T,C,C,M)}}else if(g!==void 0){const x=g.array;_=g.version;for(let y=0,b=x.length/3-1;y<b;y+=3){const M=y+0,T=y+1,C=y+2;d.push(M,T,T,C,C,M)}}else return;const m=new(Uh(d)?kh:Fh)(d,1);m.version=_;const p=s.get(h);p&&e.remove(p),s.set(h,m)}function u(h){const d=s.get(h);if(d){const f=h.index;f!==null&&d.version<f.version&&c(h)}else c(h);return s.get(h)}return{get:a,update:l,getWireframeAttribute:u}}function Kg(n,e,t){let i;function r(d){i=d}let s,o;function a(d){s=d.type,o=d.bytesPerElement}function l(d,f){n.drawElements(i,f,s,d*o),t.update(f,i,1)}function c(d,f,g){g!==0&&(n.drawElementsInstanced(i,f,s,d*o,g),t.update(f,i,g))}function u(d,f,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,s,d,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];t.update(m,i,1)}function h(d,f,g,_){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)c(d[p]/o,f[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(i,f,0,s,d,0,_,0,g);let p=0;for(let x=0;x<g;x++)p+=f[x]*_[x];t.update(p,i,1)}}this.setMode=r,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function Jg(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(s/3);break;case n.LINES:t.lines+=a*(s/2);break;case n.LINE_STRIP:t.lines+=a*(s-1);break;case n.LINE_LOOP:t.lines+=a*s;break;case n.POINTS:t.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function Qg(n,e,t){const i=new WeakMap,r=new Yt;function s(o,a,l){const c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0;let d=i.get(a);if(d===void 0||d.count!==h){let S=function(){P.dispose(),i.delete(a),a.removeEventListener("dispose",S)};var f=S;d!==void 0&&d.texture.dispose();const g=a.morphAttributes.position!==void 0,_=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],x=a.morphAttributes.normal||[],y=a.morphAttributes.color||[];let b=0;g===!0&&(b=1),_===!0&&(b=2),m===!0&&(b=3);let M=a.attributes.position.count*b,T=1;M>e.maxTextureSize&&(T=Math.ceil(M/e.maxTextureSize),M=e.maxTextureSize);const C=new Float32Array(M*T*4*h),P=new Nh(C,M,T,h);P.type=Li,P.needsUpdate=!0;const E=b*4;for(let I=0;I<h;I++){const B=p[I],$=x[I],V=y[I],k=M*T*4*I;for(let G=0;G<B.count;G++){const W=G*E;g===!0&&(r.fromBufferAttribute(B,G),C[k+W+0]=r.x,C[k+W+1]=r.y,C[k+W+2]=r.z,C[k+W+3]=0),_===!0&&(r.fromBufferAttribute($,G),C[k+W+4]=r.x,C[k+W+5]=r.y,C[k+W+6]=r.z,C[k+W+7]=0),m===!0&&(r.fromBufferAttribute(V,G),C[k+W+8]=r.x,C[k+W+9]=r.y,C[k+W+10]=r.z,C[k+W+11]=V.itemSize===4?r.w:1)}}d={count:h,texture:P,size:new xe(M,T)},i.set(a,d),a.addEventListener("dispose",S)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const _=a.morphTargetsRelative?1:1-g;l.getUniforms().setValue(n,"morphTargetBaseInfluence",_),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:s}}function ev(n,e,t,i){let r=new WeakMap;function s(l){const c=i.render.frame,u=l.geometry,h=e.get(l,u);if(r.get(h)!==c&&(e.update(h),r.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),r.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;r.get(d)!==c&&(d.update(),r.set(d,c))}return h}function o(){r=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:s,dispose:o}}const nd=new Nn,Nu=new Hh(1,1),id=new Nh,rd=new qf,sd=new Vh,Ou=[],Fu=[],ku=new Float32Array(16),Bu=new Float32Array(9),zu=new Float32Array(4);function hs(n,e,t){const i=n[0];if(i<=0||i>0)return n;const r=e*t;let s=Ou[r];if(s===void 0&&(s=new Float32Array(r),Ou[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(s,a)}return s}function hn(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function dn(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Yo(n,e){let t=Fu[e];t===void 0&&(t=new Int32Array(e),Fu[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function tv(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function nv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(hn(t,e))return;n.uniform2fv(this.addr,e),dn(t,e)}}function iv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(hn(t,e))return;n.uniform3fv(this.addr,e),dn(t,e)}}function rv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(hn(t,e))return;n.uniform4fv(this.addr,e),dn(t,e)}}function sv(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(hn(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),dn(t,e)}else{if(hn(t,i))return;zu.set(i),n.uniformMatrix2fv(this.addr,!1,zu),dn(t,i)}}function ov(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(hn(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),dn(t,e)}else{if(hn(t,i))return;Bu.set(i),n.uniformMatrix3fv(this.addr,!1,Bu),dn(t,i)}}function av(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(hn(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),dn(t,e)}else{if(hn(t,i))return;ku.set(i),n.uniformMatrix4fv(this.addr,!1,ku),dn(t,i)}}function lv(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function cv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(hn(t,e))return;n.uniform2iv(this.addr,e),dn(t,e)}}function uv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(hn(t,e))return;n.uniform3iv(this.addr,e),dn(t,e)}}function hv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(hn(t,e))return;n.uniform4iv(this.addr,e),dn(t,e)}}function dv(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function fv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(hn(t,e))return;n.uniform2uiv(this.addr,e),dn(t,e)}}function pv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(hn(t,e))return;n.uniform3uiv(this.addr,e),dn(t,e)}}function mv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(hn(t,e))return;n.uniform4uiv(this.addr,e),dn(t,e)}}function gv(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let s;this.type===n.SAMPLER_2D_SHADOW?(Nu.compareFunction=Ih,s=Nu):s=nd,t.setTexture2D(e||s,r)}function vv(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||rd,r)}function _v(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||sd,r)}function xv(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||id,r)}function bv(n){switch(n){case 5126:return tv;case 35664:return nv;case 35665:return iv;case 35666:return rv;case 35674:return sv;case 35675:return ov;case 35676:return av;case 5124:case 35670:return lv;case 35667:case 35671:return cv;case 35668:case 35672:return uv;case 35669:case 35673:return hv;case 5125:return dv;case 36294:return fv;case 36295:return pv;case 36296:return mv;case 35678:case 36198:case 36298:case 36306:case 35682:return gv;case 35679:case 36299:case 36307:return vv;case 35680:case 36300:case 36308:case 36293:return _v;case 36289:case 36303:case 36311:case 36292:return xv}}function yv(n,e){n.uniform1fv(this.addr,e)}function Mv(n,e){const t=hs(e,this.size,2);n.uniform2fv(this.addr,t)}function Sv(n,e){const t=hs(e,this.size,3);n.uniform3fv(this.addr,t)}function Ev(n,e){const t=hs(e,this.size,4);n.uniform4fv(this.addr,t)}function wv(n,e){const t=hs(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function Tv(n,e){const t=hs(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function Av(n,e){const t=hs(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function Rv(n,e){n.uniform1iv(this.addr,e)}function Cv(n,e){n.uniform2iv(this.addr,e)}function Pv(n,e){n.uniform3iv(this.addr,e)}function Lv(n,e){n.uniform4iv(this.addr,e)}function Dv(n,e){n.uniform1uiv(this.addr,e)}function Iv(n,e){n.uniform2uiv(this.addr,e)}function Uv(n,e){n.uniform3uiv(this.addr,e)}function Nv(n,e){n.uniform4uiv(this.addr,e)}function Ov(n,e,t){const i=this.cache,r=e.length,s=Yo(t,r);hn(i,s)||(n.uniform1iv(this.addr,s),dn(i,s));for(let o=0;o!==r;++o)t.setTexture2D(e[o]||nd,s[o])}function Fv(n,e,t){const i=this.cache,r=e.length,s=Yo(t,r);hn(i,s)||(n.uniform1iv(this.addr,s),dn(i,s));for(let o=0;o!==r;++o)t.setTexture3D(e[o]||rd,s[o])}function kv(n,e,t){const i=this.cache,r=e.length,s=Yo(t,r);hn(i,s)||(n.uniform1iv(this.addr,s),dn(i,s));for(let o=0;o!==r;++o)t.setTextureCube(e[o]||sd,s[o])}function Bv(n,e,t){const i=this.cache,r=e.length,s=Yo(t,r);hn(i,s)||(n.uniform1iv(this.addr,s),dn(i,s));for(let o=0;o!==r;++o)t.setTexture2DArray(e[o]||id,s[o])}function zv(n){switch(n){case 5126:return yv;case 35664:return Mv;case 35665:return Sv;case 35666:return Ev;case 35674:return wv;case 35675:return Tv;case 35676:return Av;case 5124:case 35670:return Rv;case 35667:case 35671:return Cv;case 35668:case 35672:return Pv;case 35669:case 35673:return Lv;case 5125:return Dv;case 36294:return Iv;case 36295:return Uv;case 36296:return Nv;case 35678:case 36198:case 36298:case 36306:case 35682:return Ov;case 35679:case 36299:case 36307:return Fv;case 35680:case 36300:case 36308:case 36293:return kv;case 36289:case 36303:case 36311:case 36292:return Bv}}class Vv{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=bv(t.type)}}class Hv{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=zv(t.type)}}class Gv{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(e,t[a.id],i)}}}const $a=/(\w+)(\])?(\[|\.)?/g;function Vu(n,e){n.seq.push(e),n.map[e.id]=e}function Wv(n,e,t){const i=n.name,r=i.length;for($a.lastIndex=0;;){const s=$a.exec(i),o=$a.lastIndex;let a=s[1];const l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){Vu(t,c===void 0?new Vv(a,n,e):new Hv(a,n,e));break}else{let h=t.map[a];h===void 0&&(h=new Gv(a),Vu(t,h)),t=h}}}class Do{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(t,r),o=e.getUniformLocation(t,s.name);Wv(s,o,this)}}setValue(e,t,i,r){const s=this.map[t];s!==void 0&&s.setValue(e,i,r)}setOptional(e,t,i){const r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let s=0,o=t.length;s!==o;++s){const a=t[s],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,t){const i=[];for(let r=0,s=e.length;r!==s;++r){const o=e[r];o.id in t&&i.push(o)}return i}}function Hu(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const $v=37297;let qv=0;function Xv(n,e){const t=n.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let o=r;o<s;o++){const a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}const Gu=new dt;function Yv(n){Ct._getMatrix(Gu,Ct.workingColorSpace,n);const e=`mat3( ${Gu.elements.map(t=>t.toFixed(4))} )`;switch(Ct.getTransfer(n)){case Io:return[e,"LinearTransferOETF"];case Ft:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Wu(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),s=(n.getShaderInfoLog(e)||"").trim();if(i&&s==="")return"";const o=/ERROR: 0:(\d+)/.exec(s);if(o){const a=parseInt(o[1]);return t.toUpperCase()+`

`+s+`

`+Xv(n.getShaderSource(e),a)}else return s}function jv(n,e){const t=Yv(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Zv(n,e){let t;switch(e){case of:t="Linear";break;case af:t="Reinhard";break;case lf:t="Cineon";break;case Mh:t="ACESFilmic";break;case uf:t="AgX";break;case hf:t="Neutral";break;case cf:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const To=new D;function Kv(){Ct.getLuminanceCoefficients(To);const n=To.x.toFixed(4),e=To.y.toFixed(4),t=To.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Jv(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Es).join(`
`)}function Qv(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function e_(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=n.getActiveAttrib(e,r),o=s.name;let a=1;s.type===n.FLOAT_MAT2&&(a=2),s.type===n.FLOAT_MAT3&&(a=3),s.type===n.FLOAT_MAT4&&(a=4),t[o]={type:s.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function Es(n){return n!==""}function $u(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function qu(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const t_=/^[ \t]*#include +<([\w\d./]+)>/gm;function zl(n){return n.replace(t_,i_)}const n_=new Map;function i_(n,e){let t=vt[e];if(t===void 0){const i=n_.get(e);if(i!==void 0)t=vt[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return zl(t)}const r_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Xu(n){return n.replace(r_,s_)}function s_(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Yu(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}function o_(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===xh?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===bh?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Ti&&(e="SHADOWMAP_TYPE_VSM"),e}function a_(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case rs:case ss:e="ENVMAP_TYPE_CUBE";break;case Wo:e="ENVMAP_TYPE_CUBE_UV";break}return e}function l_(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case ss:e="ENVMAP_MODE_REFRACTION";break}return e}function c_(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case yh:e="ENVMAP_BLENDING_MULTIPLY";break;case rf:e="ENVMAP_BLENDING_MIX";break;case sf:e="ENVMAP_BLENDING_ADD";break}return e}function u_(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function h_(n,e,t,i){const r=n.getContext(),s=t.defines;let o=t.vertexShader,a=t.fragmentShader;const l=o_(t),c=a_(t),u=l_(t),h=c_(t),d=u_(t),f=Jv(t),g=Qv(s),_=r.createProgram();let m,p,x=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Es).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Es).join(`
`),p.length>0&&(p+=`
`)):(m=[Yu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Es).join(`
`),p=[Yu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Ji?"#define TONE_MAPPING":"",t.toneMapping!==Ji?vt.tonemapping_pars_fragment:"",t.toneMapping!==Ji?Zv("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",vt.colorspace_pars_fragment,jv("linearToOutputTexel",t.outputColorSpace),Kv(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Es).join(`
`)),o=zl(o),o=$u(o,t),o=qu(o,t),a=zl(a),a=$u(a,t),a=qu(a,t),o=Xu(o),a=Xu(a),t.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===Xc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Xc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const y=x+m+o,b=x+p+a,M=Hu(r,r.VERTEX_SHADER,y),T=Hu(r,r.FRAGMENT_SHADER,b);r.attachShader(_,M),r.attachShader(_,T),t.index0AttributeName!==void 0?r.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(_,0,"position"),r.linkProgram(_);function C(I){if(n.debug.checkShaderErrors){const B=r.getProgramInfoLog(_)||"",$=r.getShaderInfoLog(M)||"",V=r.getShaderInfoLog(T)||"",k=B.trim(),G=$.trim(),W=V.trim();let N=!0,ce=!0;if(r.getProgramParameter(_,r.LINK_STATUS)===!1)if(N=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,_,M,T);else{const _e=Wu(r,M,"vertex"),ve=Wu(r,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(_,r.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+k+`
`+_e+`
`+ve)}else k!==""?console.warn("THREE.WebGLProgram: Program Info Log:",k):(G===""||W==="")&&(ce=!1);ce&&(I.diagnostics={runnable:N,programLog:k,vertexShader:{log:G,prefix:m},fragmentShader:{log:W,prefix:p}})}r.deleteShader(M),r.deleteShader(T),P=new Do(r,_),E=e_(r,_)}let P;this.getUniforms=function(){return P===void 0&&C(this),P};let E;this.getAttributes=function(){return E===void 0&&C(this),E};let S=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=r.getProgramParameter(_,$v)),S},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=qv++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=M,this.fragmentShader=T,this}let d_=0;class f_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new p_(e),t.set(e,i)),i}}class p_{constructor(e){this.id=d_++,this.code=e,this.usedTimes=0}}function m_(n,e,t,i,r,s,o){const a=new ic,l=new f_,c=new Set,u=[],h=r.logarithmicDepthBuffer,d=r.vertexTextures;let f=r.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(E){return c.add(E),E===0?"uv":`uv${E}`}function m(E,S,I,B,$){const V=B.fog,k=$.geometry,G=E.isMeshStandardMaterial?B.environment:null,W=(E.isMeshStandardMaterial?t:e).get(E.envMap||G),N=W&&W.mapping===Wo?W.image.height:null,ce=g[E.type];E.precision!==null&&(f=r.getMaxPrecision(E.precision),f!==E.precision&&console.warn("THREE.WebGLProgram.getParameters:",E.precision,"not supported, using",f,"instead."));const _e=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,ve=_e!==void 0?_e.length:0;let Je=0;k.morphAttributes.position!==void 0&&(Je=1),k.morphAttributes.normal!==void 0&&(Je=2),k.morphAttributes.color!==void 0&&(Je=3);let pt,ut,mt,Q;if(ce){const Tt=di[ce];pt=Tt.vertexShader,ut=Tt.fragmentShader}else pt=E.vertexShader,ut=E.fragmentShader,l.update(E),mt=l.getVertexShaderID(E),Q=l.getFragmentShaderID(E);const te=n.getRenderTarget(),Le=n.state.buffers.depth.getReversed(),$e=$.isInstancedMesh===!0,ze=$.isBatchedMesh===!0,xt=!!E.map,ot=!!E.matcap,F=!!W,he=!!E.aoMap,ie=!!E.lightMap,se=!!E.bumpMap,oe=!!E.normalMap,Ee=!!E.displacementMap,de=!!E.emissiveMap,we=!!E.metalnessMap,et=!!E.roughnessMap,Ze=E.anisotropy>0,L=E.clearcoat>0,w=E.dispersion>0,j=E.iridescence>0,ee=E.sheen>0,ue=E.transmission>0,z=Ze&&!!E.anisotropyMap,We=L&&!!E.clearcoatMap,ye=L&&!!E.clearcoatNormalMap,Ve=L&&!!E.clearcoatRoughnessMap,He=j&&!!E.iridescenceMap,me=j&&!!E.iridescenceThicknessMap,be=ee&&!!E.sheenColorMap,Qe=ee&&!!E.sheenRoughnessMap,Fe=!!E.specularMap,Re=!!E.specularColorMap,nt=!!E.specularIntensityMap,H=ue&&!!E.transmissionMap,fe=ue&&!!E.thicknessMap,Te=!!E.gradientMap,Ie=!!E.alphaMap,pe=E.alphaTest>0,ae=!!E.alphaHash,Ge=!!E.extensions;let at=Ji;E.toneMapped&&(te===null||te.isXRRenderTarget===!0)&&(at=n.toneMapping);const It={shaderID:ce,shaderType:E.type,shaderName:E.name,vertexShader:pt,fragmentShader:ut,defines:E.defines,customVertexShaderID:mt,customFragmentShaderID:Q,isRawShaderMaterial:E.isRawShaderMaterial===!0,glslVersion:E.glslVersion,precision:f,batching:ze,batchingColor:ze&&$._colorsTexture!==null,instancing:$e,instancingColor:$e&&$.instanceColor!==null,instancingMorph:$e&&$.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:te===null?n.outputColorSpace:te.isXRRenderTarget===!0?te.texture.colorSpace:os,alphaToCoverage:!!E.alphaToCoverage,map:xt,matcap:ot,envMap:F,envMapMode:F&&W.mapping,envMapCubeUVHeight:N,aoMap:he,lightMap:ie,bumpMap:se,normalMap:oe,displacementMap:d&&Ee,emissiveMap:de,normalMapObjectSpace:oe&&E.normalMapType===mf,normalMapTangentSpace:oe&&E.normalMapType===Dh,metalnessMap:we,roughnessMap:et,anisotropy:Ze,anisotropyMap:z,clearcoat:L,clearcoatMap:We,clearcoatNormalMap:ye,clearcoatRoughnessMap:Ve,dispersion:w,iridescence:j,iridescenceMap:He,iridescenceThicknessMap:me,sheen:ee,sheenColorMap:be,sheenRoughnessMap:Qe,specularMap:Fe,specularColorMap:Re,specularIntensityMap:nt,transmission:ue,transmissionMap:H,thicknessMap:fe,gradientMap:Te,opaque:E.transparent===!1&&E.blending===Zr&&E.alphaToCoverage===!1,alphaMap:Ie,alphaTest:pe,alphaHash:ae,combine:E.combine,mapUv:xt&&_(E.map.channel),aoMapUv:he&&_(E.aoMap.channel),lightMapUv:ie&&_(E.lightMap.channel),bumpMapUv:se&&_(E.bumpMap.channel),normalMapUv:oe&&_(E.normalMap.channel),displacementMapUv:Ee&&_(E.displacementMap.channel),emissiveMapUv:de&&_(E.emissiveMap.channel),metalnessMapUv:we&&_(E.metalnessMap.channel),roughnessMapUv:et&&_(E.roughnessMap.channel),anisotropyMapUv:z&&_(E.anisotropyMap.channel),clearcoatMapUv:We&&_(E.clearcoatMap.channel),clearcoatNormalMapUv:ye&&_(E.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ve&&_(E.clearcoatRoughnessMap.channel),iridescenceMapUv:He&&_(E.iridescenceMap.channel),iridescenceThicknessMapUv:me&&_(E.iridescenceThicknessMap.channel),sheenColorMapUv:be&&_(E.sheenColorMap.channel),sheenRoughnessMapUv:Qe&&_(E.sheenRoughnessMap.channel),specularMapUv:Fe&&_(E.specularMap.channel),specularColorMapUv:Re&&_(E.specularColorMap.channel),specularIntensityMapUv:nt&&_(E.specularIntensityMap.channel),transmissionMapUv:H&&_(E.transmissionMap.channel),thicknessMapUv:fe&&_(E.thicknessMap.channel),alphaMapUv:Ie&&_(E.alphaMap.channel),vertexTangents:!!k.attributes.tangent&&(oe||Ze),vertexColors:E.vertexColors,vertexAlphas:E.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,pointsUvs:$.isPoints===!0&&!!k.attributes.uv&&(xt||Ie),fog:!!V,useFog:E.fog===!0,fogExp2:!!V&&V.isFogExp2,flatShading:E.flatShading===!0&&E.wireframe===!1,sizeAttenuation:E.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:Le,skinning:$.isSkinnedMesh===!0,morphTargets:k.morphAttributes.position!==void 0,morphNormals:k.morphAttributes.normal!==void 0,morphColors:k.morphAttributes.color!==void 0,morphTargetsCount:ve,morphTextureStride:Je,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:E.dithering,shadowMapEnabled:n.shadowMap.enabled&&I.length>0,shadowMapType:n.shadowMap.type,toneMapping:at,decodeVideoTexture:xt&&E.map.isVideoTexture===!0&&Ct.getTransfer(E.map.colorSpace)===Ft,decodeVideoTextureEmissive:de&&E.emissiveMap.isVideoTexture===!0&&Ct.getTransfer(E.emissiveMap.colorSpace)===Ft,premultipliedAlpha:E.premultipliedAlpha,doubleSided:E.side===pi,flipSided:E.side===kn,useDepthPacking:E.depthPacking>=0,depthPacking:E.depthPacking||0,index0AttributeName:E.index0AttributeName,extensionClipCullDistance:Ge&&E.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ge&&E.extensions.multiDraw===!0||ze)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:E.customProgramCacheKey()};return It.vertexUv1s=c.has(1),It.vertexUv2s=c.has(2),It.vertexUv3s=c.has(3),c.clear(),It}function p(E){const S=[];if(E.shaderID?S.push(E.shaderID):(S.push(E.customVertexShaderID),S.push(E.customFragmentShaderID)),E.defines!==void 0)for(const I in E.defines)S.push(I),S.push(E.defines[I]);return E.isRawShaderMaterial===!1&&(x(S,E),y(S,E),S.push(n.outputColorSpace)),S.push(E.customProgramCacheKey),S.join()}function x(E,S){E.push(S.precision),E.push(S.outputColorSpace),E.push(S.envMapMode),E.push(S.envMapCubeUVHeight),E.push(S.mapUv),E.push(S.alphaMapUv),E.push(S.lightMapUv),E.push(S.aoMapUv),E.push(S.bumpMapUv),E.push(S.normalMapUv),E.push(S.displacementMapUv),E.push(S.emissiveMapUv),E.push(S.metalnessMapUv),E.push(S.roughnessMapUv),E.push(S.anisotropyMapUv),E.push(S.clearcoatMapUv),E.push(S.clearcoatNormalMapUv),E.push(S.clearcoatRoughnessMapUv),E.push(S.iridescenceMapUv),E.push(S.iridescenceThicknessMapUv),E.push(S.sheenColorMapUv),E.push(S.sheenRoughnessMapUv),E.push(S.specularMapUv),E.push(S.specularColorMapUv),E.push(S.specularIntensityMapUv),E.push(S.transmissionMapUv),E.push(S.thicknessMapUv),E.push(S.combine),E.push(S.fogExp2),E.push(S.sizeAttenuation),E.push(S.morphTargetsCount),E.push(S.morphAttributeCount),E.push(S.numDirLights),E.push(S.numPointLights),E.push(S.numSpotLights),E.push(S.numSpotLightMaps),E.push(S.numHemiLights),E.push(S.numRectAreaLights),E.push(S.numDirLightShadows),E.push(S.numPointLightShadows),E.push(S.numSpotLightShadows),E.push(S.numSpotLightShadowsWithMaps),E.push(S.numLightProbes),E.push(S.shadowMapType),E.push(S.toneMapping),E.push(S.numClippingPlanes),E.push(S.numClipIntersection),E.push(S.depthPacking)}function y(E,S){a.disableAll(),S.supportsVertexTextures&&a.enable(0),S.instancing&&a.enable(1),S.instancingColor&&a.enable(2),S.instancingMorph&&a.enable(3),S.matcap&&a.enable(4),S.envMap&&a.enable(5),S.normalMapObjectSpace&&a.enable(6),S.normalMapTangentSpace&&a.enable(7),S.clearcoat&&a.enable(8),S.iridescence&&a.enable(9),S.alphaTest&&a.enable(10),S.vertexColors&&a.enable(11),S.vertexAlphas&&a.enable(12),S.vertexUv1s&&a.enable(13),S.vertexUv2s&&a.enable(14),S.vertexUv3s&&a.enable(15),S.vertexTangents&&a.enable(16),S.anisotropy&&a.enable(17),S.alphaHash&&a.enable(18),S.batching&&a.enable(19),S.dispersion&&a.enable(20),S.batchingColor&&a.enable(21),S.gradientMap&&a.enable(22),E.push(a.mask),a.disableAll(),S.fog&&a.enable(0),S.useFog&&a.enable(1),S.flatShading&&a.enable(2),S.logarithmicDepthBuffer&&a.enable(3),S.reversedDepthBuffer&&a.enable(4),S.skinning&&a.enable(5),S.morphTargets&&a.enable(6),S.morphNormals&&a.enable(7),S.morphColors&&a.enable(8),S.premultipliedAlpha&&a.enable(9),S.shadowMapEnabled&&a.enable(10),S.doubleSided&&a.enable(11),S.flipSided&&a.enable(12),S.useDepthPacking&&a.enable(13),S.dithering&&a.enable(14),S.transmission&&a.enable(15),S.sheen&&a.enable(16),S.opaque&&a.enable(17),S.pointsUvs&&a.enable(18),S.decodeVideoTexture&&a.enable(19),S.decodeVideoTextureEmissive&&a.enable(20),S.alphaToCoverage&&a.enable(21),E.push(a.mask)}function b(E){const S=g[E.type];let I;if(S){const B=di[S];I=sp.clone(B.uniforms)}else I=E.uniforms;return I}function M(E,S){let I;for(let B=0,$=u.length;B<$;B++){const V=u[B];if(V.cacheKey===S){I=V,++I.usedTimes;break}}return I===void 0&&(I=new h_(n,S,E,s),u.push(I)),I}function T(E){if(--E.usedTimes===0){const S=u.indexOf(E);u[S]=u[u.length-1],u.pop(),E.destroy()}}function C(E){l.remove(E)}function P(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:b,acquireProgram:M,releaseProgram:T,releaseShaderCache:C,programs:u,dispose:P}}function g_(){let n=new WeakMap;function e(o){return n.has(o)}function t(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function r(o,a,l){n.get(o)[a]=l}function s(){n=new WeakMap}return{has:e,get:t,remove:i,update:r,dispose:s}}function v_(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function ju(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Zu(){const n=[];let e=0;const t=[],i=[],r=[];function s(){e=0,t.length=0,i.length=0,r.length=0}function o(h,d,f,g,_,m){let p=n[e];return p===void 0?(p={id:h.id,object:h,geometry:d,material:f,groupOrder:g,renderOrder:h.renderOrder,z:_,group:m},n[e]=p):(p.id=h.id,p.object=h,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=h.renderOrder,p.z=_,p.group=m),e++,p}function a(h,d,f,g,_,m){const p=o(h,d,f,g,_,m);f.transmission>0?i.push(p):f.transparent===!0?r.push(p):t.push(p)}function l(h,d,f,g,_,m){const p=o(h,d,f,g,_,m);f.transmission>0?i.unshift(p):f.transparent===!0?r.unshift(p):t.unshift(p)}function c(h,d){t.length>1&&t.sort(h||v_),i.length>1&&i.sort(d||ju),r.length>1&&r.sort(d||ju)}function u(){for(let h=e,d=n.length;h<d;h++){const f=n[h];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:i,transparent:r,init:s,push:a,unshift:l,finish:u,sort:c}}function __(){let n=new WeakMap;function e(i,r){const s=n.get(i);let o;return s===void 0?(o=new Zu,n.set(i,[o])):r>=s.length?(o=new Zu,s.push(o)):o=s[r],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function x_(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new D,color:new St};break;case"SpotLight":t={position:new D,direction:new D,color:new St,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new D,color:new St,distance:0,decay:0};break;case"HemisphereLight":t={direction:new D,skyColor:new St,groundColor:new St};break;case"RectAreaLight":t={color:new St,position:new D,halfWidth:new D,halfHeight:new D};break}return n[e.id]=t,t}}}function b_(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xe,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let y_=0;function M_(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function S_(n){const e=new x_,t=b_(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new D);const r=new D,s=new Gt,o=new Gt;function a(c){let u=0,h=0,d=0;for(let E=0;E<9;E++)i.probe[E].set(0,0,0);let f=0,g=0,_=0,m=0,p=0,x=0,y=0,b=0,M=0,T=0,C=0;c.sort(M_);for(let E=0,S=c.length;E<S;E++){const I=c[E],B=I.color,$=I.intensity,V=I.distance,k=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)u+=B.r*$,h+=B.g*$,d+=B.b*$;else if(I.isLightProbe){for(let G=0;G<9;G++)i.probe[G].addScaledVector(I.sh.coefficients[G],$);C++}else if(I.isDirectionalLight){const G=e.get(I);if(G.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){const W=I.shadow,N=t.get(I);N.shadowIntensity=W.intensity,N.shadowBias=W.bias,N.shadowNormalBias=W.normalBias,N.shadowRadius=W.radius,N.shadowMapSize=W.mapSize,i.directionalShadow[f]=N,i.directionalShadowMap[f]=k,i.directionalShadowMatrix[f]=I.shadow.matrix,x++}i.directional[f]=G,f++}else if(I.isSpotLight){const G=e.get(I);G.position.setFromMatrixPosition(I.matrixWorld),G.color.copy(B).multiplyScalar($),G.distance=V,G.coneCos=Math.cos(I.angle),G.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),G.decay=I.decay,i.spot[_]=G;const W=I.shadow;if(I.map&&(i.spotLightMap[M]=I.map,M++,W.updateMatrices(I),I.castShadow&&T++),i.spotLightMatrix[_]=W.matrix,I.castShadow){const N=t.get(I);N.shadowIntensity=W.intensity,N.shadowBias=W.bias,N.shadowNormalBias=W.normalBias,N.shadowRadius=W.radius,N.shadowMapSize=W.mapSize,i.spotShadow[_]=N,i.spotShadowMap[_]=k,b++}_++}else if(I.isRectAreaLight){const G=e.get(I);G.color.copy(B).multiplyScalar($),G.halfWidth.set(I.width*.5,0,0),G.halfHeight.set(0,I.height*.5,0),i.rectArea[m]=G,m++}else if(I.isPointLight){const G=e.get(I);if(G.color.copy(I.color).multiplyScalar(I.intensity),G.distance=I.distance,G.decay=I.decay,I.castShadow){const W=I.shadow,N=t.get(I);N.shadowIntensity=W.intensity,N.shadowBias=W.bias,N.shadowNormalBias=W.normalBias,N.shadowRadius=W.radius,N.shadowMapSize=W.mapSize,N.shadowCameraNear=W.camera.near,N.shadowCameraFar=W.camera.far,i.pointShadow[g]=N,i.pointShadowMap[g]=k,i.pointShadowMatrix[g]=I.shadow.matrix,y++}i.point[g]=G,g++}else if(I.isHemisphereLight){const G=e.get(I);G.skyColor.copy(I.color).multiplyScalar($),G.groundColor.copy(I.groundColor).multiplyScalar($),i.hemi[p]=G,p++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Pe.LTC_FLOAT_1,i.rectAreaLTC2=Pe.LTC_FLOAT_2):(i.rectAreaLTC1=Pe.LTC_HALF_1,i.rectAreaLTC2=Pe.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=h,i.ambient[2]=d;const P=i.hash;(P.directionalLength!==f||P.pointLength!==g||P.spotLength!==_||P.rectAreaLength!==m||P.hemiLength!==p||P.numDirectionalShadows!==x||P.numPointShadows!==y||P.numSpotShadows!==b||P.numSpotMaps!==M||P.numLightProbes!==C)&&(i.directional.length=f,i.spot.length=_,i.rectArea.length=m,i.point.length=g,i.hemi.length=p,i.directionalShadow.length=x,i.directionalShadowMap.length=x,i.pointShadow.length=y,i.pointShadowMap.length=y,i.spotShadow.length=b,i.spotShadowMap.length=b,i.directionalShadowMatrix.length=x,i.pointShadowMatrix.length=y,i.spotLightMatrix.length=b+M-T,i.spotLightMap.length=M,i.numSpotLightShadowsWithMaps=T,i.numLightProbes=C,P.directionalLength=f,P.pointLength=g,P.spotLength=_,P.rectAreaLength=m,P.hemiLength=p,P.numDirectionalShadows=x,P.numPointShadows=y,P.numSpotShadows=b,P.numSpotMaps=M,P.numLightProbes=C,i.version=y_++)}function l(c,u){let h=0,d=0,f=0,g=0,_=0;const m=u.matrixWorldInverse;for(let p=0,x=c.length;p<x;p++){const y=c[p];if(y.isDirectionalLight){const b=i.directional[h];b.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),b.direction.sub(r),b.direction.transformDirection(m),h++}else if(y.isSpotLight){const b=i.spot[f];b.position.setFromMatrixPosition(y.matrixWorld),b.position.applyMatrix4(m),b.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),b.direction.sub(r),b.direction.transformDirection(m),f++}else if(y.isRectAreaLight){const b=i.rectArea[g];b.position.setFromMatrixPosition(y.matrixWorld),b.position.applyMatrix4(m),o.identity(),s.copy(y.matrixWorld),s.premultiply(m),o.extractRotation(s),b.halfWidth.set(y.width*.5,0,0),b.halfHeight.set(0,y.height*.5,0),b.halfWidth.applyMatrix4(o),b.halfHeight.applyMatrix4(o),g++}else if(y.isPointLight){const b=i.point[d];b.position.setFromMatrixPosition(y.matrixWorld),b.position.applyMatrix4(m),d++}else if(y.isHemisphereLight){const b=i.hemi[_];b.direction.setFromMatrixPosition(y.matrixWorld),b.direction.transformDirection(m),_++}}}return{setup:a,setupView:l,state:i}}function Ku(n){const e=new S_(n),t=[],i=[];function r(u){c.camera=u,t.length=0,i.length=0}function s(u){t.push(u)}function o(u){i.push(u)}function a(){e.setup(t)}function l(u){e.setupView(t,u)}const c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:a,setupLightsView:l,pushLight:s,pushShadow:o}}function E_(n){let e=new WeakMap;function t(r,s=0){const o=e.get(r);let a;return o===void 0?(a=new Ku(n),e.set(r,[a])):s>=o.length?(a=new Ku(n),o.push(a)):a=o[s],a}function i(){e=new WeakMap}return{get:t,dispose:i}}const w_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,T_=`uniform sampler2D shadow_pass;
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
}`;function A_(n,e,t){let i=new sc;const r=new xe,s=new xe,o=new Yt,a=new Yp({depthPacking:pf}),l=new jp,c={},u=t.maxTextureSize,h={[er]:kn,[kn]:er,[pi]:pi},d=new tr({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new xe},radius:{value:4}},vertexShader:w_,fragmentShader:T_}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new un;g.setAttribute("position",new Kn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new En(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=xh;let p=this.type;this.render=function(T,C,P){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;const E=n.getRenderTarget(),S=n.getActiveCubeFace(),I=n.getActiveMipmapLevel(),B=n.state;B.setBlending(Ki),B.buffers.depth.getReversed()===!0?B.buffers.color.setClear(0,0,0,0):B.buffers.color.setClear(1,1,1,1),B.buffers.depth.setTest(!0),B.setScissorTest(!1);const $=p!==Ti&&this.type===Ti,V=p===Ti&&this.type!==Ti;for(let k=0,G=T.length;k<G;k++){const W=T[k],N=W.shadow;if(N===void 0){console.warn("THREE.WebGLShadowMap:",W,"has no shadow.");continue}if(N.autoUpdate===!1&&N.needsUpdate===!1)continue;r.copy(N.mapSize);const ce=N.getFrameExtents();if(r.multiply(ce),s.copy(N.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/ce.x),r.x=s.x*ce.x,N.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/ce.y),r.y=s.y*ce.y,N.mapSize.y=s.y)),N.map===null||$===!0||V===!0){const ve=this.type!==Ti?{minFilter:li,magFilter:li}:{};N.map!==null&&N.map.dispose(),N.map=new _r(r.x,r.y,ve),N.map.texture.name=W.name+".shadowMap",N.camera.updateProjectionMatrix()}n.setRenderTarget(N.map),n.clear();const _e=N.getViewportCount();for(let ve=0;ve<_e;ve++){const Je=N.getViewport(ve);o.set(s.x*Je.x,s.y*Je.y,s.x*Je.z,s.y*Je.w),B.viewport(o),N.updateMatrices(W,ve),i=N.getFrustum(),b(C,P,N.camera,W,this.type)}N.isPointLightShadow!==!0&&this.type===Ti&&x(N,P),N.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(E,S,I)};function x(T,C){const P=e.update(_);d.defines.VSM_SAMPLES!==T.blurSamples&&(d.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new _r(r.x,r.y)),d.uniforms.shadow_pass.value=T.map.texture,d.uniforms.resolution.value=T.mapSize,d.uniforms.radius.value=T.radius,n.setRenderTarget(T.mapPass),n.clear(),n.renderBufferDirect(C,null,P,d,_,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,n.setRenderTarget(T.map),n.clear(),n.renderBufferDirect(C,null,P,f,_,null)}function y(T,C,P,E){let S=null;const I=P.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(I!==void 0)S=I;else if(S=P.isPointLight===!0?l:a,n.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const B=S.uuid,$=C.uuid;let V=c[B];V===void 0&&(V={},c[B]=V);let k=V[$];k===void 0&&(k=S.clone(),V[$]=k,C.addEventListener("dispose",M)),S=k}if(S.visible=C.visible,S.wireframe=C.wireframe,E===Ti?S.side=C.shadowSide!==null?C.shadowSide:C.side:S.side=C.shadowSide!==null?C.shadowSide:h[C.side],S.alphaMap=C.alphaMap,S.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,S.map=C.map,S.clipShadows=C.clipShadows,S.clippingPlanes=C.clippingPlanes,S.clipIntersection=C.clipIntersection,S.displacementMap=C.displacementMap,S.displacementScale=C.displacementScale,S.displacementBias=C.displacementBias,S.wireframeLinewidth=C.wireframeLinewidth,S.linewidth=C.linewidth,P.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const B=n.properties.get(S);B.light=P}return S}function b(T,C,P,E,S){if(T.visible===!1)return;if(T.layers.test(C.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&S===Ti)&&(!T.frustumCulled||i.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,T.matrixWorld);const $=e.update(T),V=T.material;if(Array.isArray(V)){const k=$.groups;for(let G=0,W=k.length;G<W;G++){const N=k[G],ce=V[N.materialIndex];if(ce&&ce.visible){const _e=y(T,ce,E,S);T.onBeforeShadow(n,T,C,P,$,_e,N),n.renderBufferDirect(P,null,$,_e,T,N),T.onAfterShadow(n,T,C,P,$,_e,N)}}}else if(V.visible){const k=y(T,V,E,S);T.onBeforeShadow(n,T,C,P,$,k,null),n.renderBufferDirect(P,null,$,k,T,null),T.onAfterShadow(n,T,C,P,$,k,null)}}const B=T.children;for(let $=0,V=B.length;$<V;$++)b(B[$],C,P,E,S)}function M(T){T.target.removeEventListener("dispose",M);for(const P in c){const E=c[P],S=T.target.uuid;S in E&&(E[S].dispose(),delete E[S])}}}const R_={[Za]:Ka,[Ja]:tl,[Qa]:nl,[is]:el,[Ka]:Za,[tl]:Ja,[nl]:Qa,[el]:is};function C_(n,e){function t(){let H=!1;const fe=new Yt;let Te=null;const Ie=new Yt(0,0,0,0);return{setMask:function(pe){Te!==pe&&!H&&(n.colorMask(pe,pe,pe,pe),Te=pe)},setLocked:function(pe){H=pe},setClear:function(pe,ae,Ge,at,It){It===!0&&(pe*=at,ae*=at,Ge*=at),fe.set(pe,ae,Ge,at),Ie.equals(fe)===!1&&(n.clearColor(pe,ae,Ge,at),Ie.copy(fe))},reset:function(){H=!1,Te=null,Ie.set(-1,0,0,0)}}}function i(){let H=!1,fe=!1,Te=null,Ie=null,pe=null;return{setReversed:function(ae){if(fe!==ae){const Ge=e.get("EXT_clip_control");ae?Ge.clipControlEXT(Ge.LOWER_LEFT_EXT,Ge.ZERO_TO_ONE_EXT):Ge.clipControlEXT(Ge.LOWER_LEFT_EXT,Ge.NEGATIVE_ONE_TO_ONE_EXT),fe=ae;const at=pe;pe=null,this.setClear(at)}},getReversed:function(){return fe},setTest:function(ae){ae?te(n.DEPTH_TEST):Le(n.DEPTH_TEST)},setMask:function(ae){Te!==ae&&!H&&(n.depthMask(ae),Te=ae)},setFunc:function(ae){if(fe&&(ae=R_[ae]),Ie!==ae){switch(ae){case Za:n.depthFunc(n.NEVER);break;case Ka:n.depthFunc(n.ALWAYS);break;case Ja:n.depthFunc(n.LESS);break;case is:n.depthFunc(n.LEQUAL);break;case Qa:n.depthFunc(n.EQUAL);break;case el:n.depthFunc(n.GEQUAL);break;case tl:n.depthFunc(n.GREATER);break;case nl:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Ie=ae}},setLocked:function(ae){H=ae},setClear:function(ae){pe!==ae&&(fe&&(ae=1-ae),n.clearDepth(ae),pe=ae)},reset:function(){H=!1,Te=null,Ie=null,pe=null,fe=!1}}}function r(){let H=!1,fe=null,Te=null,Ie=null,pe=null,ae=null,Ge=null,at=null,It=null;return{setTest:function(Tt){H||(Tt?te(n.STENCIL_TEST):Le(n.STENCIL_TEST))},setMask:function(Tt){fe!==Tt&&!H&&(n.stencilMask(Tt),fe=Tt)},setFunc:function(Tt,gn,Gn){(Te!==Tt||Ie!==gn||pe!==Gn)&&(n.stencilFunc(Tt,gn,Gn),Te=Tt,Ie=gn,pe=Gn)},setOp:function(Tt,gn,Gn){(ae!==Tt||Ge!==gn||at!==Gn)&&(n.stencilOp(Tt,gn,Gn),ae=Tt,Ge=gn,at=Gn)},setLocked:function(Tt){H=Tt},setClear:function(Tt){It!==Tt&&(n.clearStencil(Tt),It=Tt)},reset:function(){H=!1,fe=null,Te=null,Ie=null,pe=null,ae=null,Ge=null,at=null,It=null}}}const s=new t,o=new i,a=new r,l=new WeakMap,c=new WeakMap;let u={},h={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,x=null,y=null,b=null,M=null,T=null,C=new St(0,0,0),P=0,E=!1,S=null,I=null,B=null,$=null,V=null;const k=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let G=!1,W=0;const N=n.getParameter(n.VERSION);N.indexOf("WebGL")!==-1?(W=parseFloat(/^WebGL (\d)/.exec(N)[1]),G=W>=1):N.indexOf("OpenGL ES")!==-1&&(W=parseFloat(/^OpenGL ES (\d)/.exec(N)[1]),G=W>=2);let ce=null,_e={};const ve=n.getParameter(n.SCISSOR_BOX),Je=n.getParameter(n.VIEWPORT),pt=new Yt().fromArray(ve),ut=new Yt().fromArray(Je);function mt(H,fe,Te,Ie){const pe=new Uint8Array(4),ae=n.createTexture();n.bindTexture(H,ae),n.texParameteri(H,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(H,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Ge=0;Ge<Te;Ge++)H===n.TEXTURE_3D||H===n.TEXTURE_2D_ARRAY?n.texImage3D(fe,0,n.RGBA,1,1,Ie,0,n.RGBA,n.UNSIGNED_BYTE,pe):n.texImage2D(fe+Ge,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,pe);return ae}const Q={};Q[n.TEXTURE_2D]=mt(n.TEXTURE_2D,n.TEXTURE_2D,1),Q[n.TEXTURE_CUBE_MAP]=mt(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Q[n.TEXTURE_2D_ARRAY]=mt(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Q[n.TEXTURE_3D]=mt(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),te(n.DEPTH_TEST),o.setFunc(is),se(!1),oe(Vc),te(n.CULL_FACE),he(Ki);function te(H){u[H]!==!0&&(n.enable(H),u[H]=!0)}function Le(H){u[H]!==!1&&(n.disable(H),u[H]=!1)}function $e(H,fe){return h[H]!==fe?(n.bindFramebuffer(H,fe),h[H]=fe,H===n.DRAW_FRAMEBUFFER&&(h[n.FRAMEBUFFER]=fe),H===n.FRAMEBUFFER&&(h[n.DRAW_FRAMEBUFFER]=fe),!0):!1}function ze(H,fe){let Te=f,Ie=!1;if(H){Te=d.get(fe),Te===void 0&&(Te=[],d.set(fe,Te));const pe=H.textures;if(Te.length!==pe.length||Te[0]!==n.COLOR_ATTACHMENT0){for(let ae=0,Ge=pe.length;ae<Ge;ae++)Te[ae]=n.COLOR_ATTACHMENT0+ae;Te.length=pe.length,Ie=!0}}else Te[0]!==n.BACK&&(Te[0]=n.BACK,Ie=!0);Ie&&n.drawBuffers(Te)}function xt(H){return g!==H?(n.useProgram(H),g=H,!0):!1}const ot={[dr]:n.FUNC_ADD,[zd]:n.FUNC_SUBTRACT,[Vd]:n.FUNC_REVERSE_SUBTRACT};ot[Hd]=n.MIN,ot[Gd]=n.MAX;const F={[Wd]:n.ZERO,[$d]:n.ONE,[qd]:n.SRC_COLOR,[Ya]:n.SRC_ALPHA,[Jd]:n.SRC_ALPHA_SATURATE,[Zd]:n.DST_COLOR,[Yd]:n.DST_ALPHA,[Xd]:n.ONE_MINUS_SRC_COLOR,[ja]:n.ONE_MINUS_SRC_ALPHA,[Kd]:n.ONE_MINUS_DST_COLOR,[jd]:n.ONE_MINUS_DST_ALPHA,[Qd]:n.CONSTANT_COLOR,[ef]:n.ONE_MINUS_CONSTANT_COLOR,[tf]:n.CONSTANT_ALPHA,[nf]:n.ONE_MINUS_CONSTANT_ALPHA};function he(H,fe,Te,Ie,pe,ae,Ge,at,It,Tt){if(H===Ki){_===!0&&(Le(n.BLEND),_=!1);return}if(_===!1&&(te(n.BLEND),_=!0),H!==Bd){if(H!==m||Tt!==E){if((p!==dr||b!==dr)&&(n.blendEquation(n.FUNC_ADD),p=dr,b=dr),Tt)switch(H){case Zr:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Hc:n.blendFunc(n.ONE,n.ONE);break;case Gc:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Wc:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",H);break}else switch(H){case Zr:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Hc:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case Gc:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Wc:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",H);break}x=null,y=null,M=null,T=null,C.set(0,0,0),P=0,m=H,E=Tt}return}pe=pe||fe,ae=ae||Te,Ge=Ge||Ie,(fe!==p||pe!==b)&&(n.blendEquationSeparate(ot[fe],ot[pe]),p=fe,b=pe),(Te!==x||Ie!==y||ae!==M||Ge!==T)&&(n.blendFuncSeparate(F[Te],F[Ie],F[ae],F[Ge]),x=Te,y=Ie,M=ae,T=Ge),(at.equals(C)===!1||It!==P)&&(n.blendColor(at.r,at.g,at.b,It),C.copy(at),P=It),m=H,E=!1}function ie(H,fe){H.side===pi?Le(n.CULL_FACE):te(n.CULL_FACE);let Te=H.side===kn;fe&&(Te=!Te),se(Te),H.blending===Zr&&H.transparent===!1?he(Ki):he(H.blending,H.blendEquation,H.blendSrc,H.blendDst,H.blendEquationAlpha,H.blendSrcAlpha,H.blendDstAlpha,H.blendColor,H.blendAlpha,H.premultipliedAlpha),o.setFunc(H.depthFunc),o.setTest(H.depthTest),o.setMask(H.depthWrite),s.setMask(H.colorWrite);const Ie=H.stencilWrite;a.setTest(Ie),Ie&&(a.setMask(H.stencilWriteMask),a.setFunc(H.stencilFunc,H.stencilRef,H.stencilFuncMask),a.setOp(H.stencilFail,H.stencilZFail,H.stencilZPass)),de(H.polygonOffset,H.polygonOffsetFactor,H.polygonOffsetUnits),H.alphaToCoverage===!0?te(n.SAMPLE_ALPHA_TO_COVERAGE):Le(n.SAMPLE_ALPHA_TO_COVERAGE)}function se(H){S!==H&&(H?n.frontFace(n.CW):n.frontFace(n.CCW),S=H)}function oe(H){H!==Fd?(te(n.CULL_FACE),H!==I&&(H===Vc?n.cullFace(n.BACK):H===kd?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Le(n.CULL_FACE),I=H}function Ee(H){H!==B&&(G&&n.lineWidth(H),B=H)}function de(H,fe,Te){H?(te(n.POLYGON_OFFSET_FILL),($!==fe||V!==Te)&&(n.polygonOffset(fe,Te),$=fe,V=Te)):Le(n.POLYGON_OFFSET_FILL)}function we(H){H?te(n.SCISSOR_TEST):Le(n.SCISSOR_TEST)}function et(H){H===void 0&&(H=n.TEXTURE0+k-1),ce!==H&&(n.activeTexture(H),ce=H)}function Ze(H,fe,Te){Te===void 0&&(ce===null?Te=n.TEXTURE0+k-1:Te=ce);let Ie=_e[Te];Ie===void 0&&(Ie={type:void 0,texture:void 0},_e[Te]=Ie),(Ie.type!==H||Ie.texture!==fe)&&(ce!==Te&&(n.activeTexture(Te),ce=Te),n.bindTexture(H,fe||Q[H]),Ie.type=H,Ie.texture=fe)}function L(){const H=_e[ce];H!==void 0&&H.type!==void 0&&(n.bindTexture(H.type,null),H.type=void 0,H.texture=void 0)}function w(){try{n.compressedTexImage2D(...arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function j(){try{n.compressedTexImage3D(...arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function ee(){try{n.texSubImage2D(...arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function ue(){try{n.texSubImage3D(...arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function z(){try{n.compressedTexSubImage2D(...arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function We(){try{n.compressedTexSubImage3D(...arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function ye(){try{n.texStorage2D(...arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Ve(){try{n.texStorage3D(...arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function He(){try{n.texImage2D(...arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function me(){try{n.texImage3D(...arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function be(H){pt.equals(H)===!1&&(n.scissor(H.x,H.y,H.z,H.w),pt.copy(H))}function Qe(H){ut.equals(H)===!1&&(n.viewport(H.x,H.y,H.z,H.w),ut.copy(H))}function Fe(H,fe){let Te=c.get(fe);Te===void 0&&(Te=new WeakMap,c.set(fe,Te));let Ie=Te.get(H);Ie===void 0&&(Ie=n.getUniformBlockIndex(fe,H.name),Te.set(H,Ie))}function Re(H,fe){const Ie=c.get(fe).get(H);l.get(fe)!==Ie&&(n.uniformBlockBinding(fe,Ie,H.__bindingPointIndex),l.set(fe,Ie))}function nt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),u={},ce=null,_e={},h={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,x=null,y=null,b=null,M=null,T=null,C=new St(0,0,0),P=0,E=!1,S=null,I=null,B=null,$=null,V=null,pt.set(0,0,n.canvas.width,n.canvas.height),ut.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:te,disable:Le,bindFramebuffer:$e,drawBuffers:ze,useProgram:xt,setBlending:he,setMaterial:ie,setFlipSided:se,setCullFace:oe,setLineWidth:Ee,setPolygonOffset:de,setScissorTest:we,activeTexture:et,bindTexture:Ze,unbindTexture:L,compressedTexImage2D:w,compressedTexImage3D:j,texImage2D:He,texImage3D:me,updateUBOMapping:Fe,uniformBlockBinding:Re,texStorage2D:ye,texStorage3D:Ve,texSubImage2D:ee,texSubImage3D:ue,compressedTexSubImage2D:z,compressedTexSubImage3D:We,scissor:be,viewport:Qe,reset:nt}}function P_(n,e,t,i,r,s,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new xe,u=new WeakMap;let h;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(L,w){return f?new OffscreenCanvas(L,w):No("canvas")}function _(L,w,j){let ee=1;const ue=Ze(L);if((ue.width>j||ue.height>j)&&(ee=j/Math.max(ue.width,ue.height)),ee<1)if(typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&L instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&L instanceof ImageBitmap||typeof VideoFrame<"u"&&L instanceof VideoFrame){const z=Math.floor(ee*ue.width),We=Math.floor(ee*ue.height);h===void 0&&(h=g(z,We));const ye=w?g(z,We):h;return ye.width=z,ye.height=We,ye.getContext("2d").drawImage(L,0,0,z,We),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ue.width+"x"+ue.height+") to ("+z+"x"+We+")."),ye}else return"data"in L&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ue.width+"x"+ue.height+")."),L;return L}function m(L){return L.generateMipmaps}function p(L){n.generateMipmap(L)}function x(L){return L.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:L.isWebGL3DRenderTarget?n.TEXTURE_3D:L.isWebGLArrayRenderTarget||L.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function y(L,w,j,ee,ue=!1){if(L!==null){if(n[L]!==void 0)return n[L];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+L+"'")}let z=w;if(w===n.RED&&(j===n.FLOAT&&(z=n.R32F),j===n.HALF_FLOAT&&(z=n.R16F),j===n.UNSIGNED_BYTE&&(z=n.R8)),w===n.RED_INTEGER&&(j===n.UNSIGNED_BYTE&&(z=n.R8UI),j===n.UNSIGNED_SHORT&&(z=n.R16UI),j===n.UNSIGNED_INT&&(z=n.R32UI),j===n.BYTE&&(z=n.R8I),j===n.SHORT&&(z=n.R16I),j===n.INT&&(z=n.R32I)),w===n.RG&&(j===n.FLOAT&&(z=n.RG32F),j===n.HALF_FLOAT&&(z=n.RG16F),j===n.UNSIGNED_BYTE&&(z=n.RG8)),w===n.RG_INTEGER&&(j===n.UNSIGNED_BYTE&&(z=n.RG8UI),j===n.UNSIGNED_SHORT&&(z=n.RG16UI),j===n.UNSIGNED_INT&&(z=n.RG32UI),j===n.BYTE&&(z=n.RG8I),j===n.SHORT&&(z=n.RG16I),j===n.INT&&(z=n.RG32I)),w===n.RGB_INTEGER&&(j===n.UNSIGNED_BYTE&&(z=n.RGB8UI),j===n.UNSIGNED_SHORT&&(z=n.RGB16UI),j===n.UNSIGNED_INT&&(z=n.RGB32UI),j===n.BYTE&&(z=n.RGB8I),j===n.SHORT&&(z=n.RGB16I),j===n.INT&&(z=n.RGB32I)),w===n.RGBA_INTEGER&&(j===n.UNSIGNED_BYTE&&(z=n.RGBA8UI),j===n.UNSIGNED_SHORT&&(z=n.RGBA16UI),j===n.UNSIGNED_INT&&(z=n.RGBA32UI),j===n.BYTE&&(z=n.RGBA8I),j===n.SHORT&&(z=n.RGBA16I),j===n.INT&&(z=n.RGBA32I)),w===n.RGB&&(j===n.UNSIGNED_INT_5_9_9_9_REV&&(z=n.RGB9_E5),j===n.UNSIGNED_INT_10F_11F_11F_REV&&(z=n.R11F_G11F_B10F)),w===n.RGBA){const We=ue?Io:Ct.getTransfer(ee);j===n.FLOAT&&(z=n.RGBA32F),j===n.HALF_FLOAT&&(z=n.RGBA16F),j===n.UNSIGNED_BYTE&&(z=We===Ft?n.SRGB8_ALPHA8:n.RGBA8),j===n.UNSIGNED_SHORT_4_4_4_4&&(z=n.RGBA4),j===n.UNSIGNED_SHORT_5_5_5_1&&(z=n.RGB5_A1)}return(z===n.R16F||z===n.R32F||z===n.RG16F||z===n.RG32F||z===n.RGBA16F||z===n.RGBA32F)&&e.get("EXT_color_buffer_float"),z}function b(L,w){let j;return L?w===null||w===vr||w===Us?j=n.DEPTH24_STENCIL8:w===Li?j=n.DEPTH32F_STENCIL8:w===Is&&(j=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===vr||w===Us?j=n.DEPTH_COMPONENT24:w===Li?j=n.DEPTH_COMPONENT32F:w===Is&&(j=n.DEPTH_COMPONENT16),j}function M(L,w){return m(L)===!0||L.isFramebufferTexture&&L.minFilter!==li&&L.minFilter!==oi?Math.log2(Math.max(w.width,w.height))+1:L.mipmaps!==void 0&&L.mipmaps.length>0?L.mipmaps.length:L.isCompressedTexture&&Array.isArray(L.image)?w.mipmaps.length:1}function T(L){const w=L.target;w.removeEventListener("dispose",T),P(w),w.isVideoTexture&&u.delete(w)}function C(L){const w=L.target;w.removeEventListener("dispose",C),S(w)}function P(L){const w=i.get(L);if(w.__webglInit===void 0)return;const j=L.source,ee=d.get(j);if(ee){const ue=ee[w.__cacheKey];ue.usedTimes--,ue.usedTimes===0&&E(L),Object.keys(ee).length===0&&d.delete(j)}i.remove(L)}function E(L){const w=i.get(L);n.deleteTexture(w.__webglTexture);const j=L.source,ee=d.get(j);delete ee[w.__cacheKey],o.memory.textures--}function S(L){const w=i.get(L);if(L.depthTexture&&(L.depthTexture.dispose(),i.remove(L.depthTexture)),L.isWebGLCubeRenderTarget)for(let ee=0;ee<6;ee++){if(Array.isArray(w.__webglFramebuffer[ee]))for(let ue=0;ue<w.__webglFramebuffer[ee].length;ue++)n.deleteFramebuffer(w.__webglFramebuffer[ee][ue]);else n.deleteFramebuffer(w.__webglFramebuffer[ee]);w.__webglDepthbuffer&&n.deleteRenderbuffer(w.__webglDepthbuffer[ee])}else{if(Array.isArray(w.__webglFramebuffer))for(let ee=0;ee<w.__webglFramebuffer.length;ee++)n.deleteFramebuffer(w.__webglFramebuffer[ee]);else n.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&n.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&n.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let ee=0;ee<w.__webglColorRenderbuffer.length;ee++)w.__webglColorRenderbuffer[ee]&&n.deleteRenderbuffer(w.__webglColorRenderbuffer[ee]);w.__webglDepthRenderbuffer&&n.deleteRenderbuffer(w.__webglDepthRenderbuffer)}const j=L.textures;for(let ee=0,ue=j.length;ee<ue;ee++){const z=i.get(j[ee]);z.__webglTexture&&(n.deleteTexture(z.__webglTexture),o.memory.textures--),i.remove(j[ee])}i.remove(L)}let I=0;function B(){I=0}function $(){const L=I;return L>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+L+" texture units while this GPU supports only "+r.maxTextures),I+=1,L}function V(L){const w=[];return w.push(L.wrapS),w.push(L.wrapT),w.push(L.wrapR||0),w.push(L.magFilter),w.push(L.minFilter),w.push(L.anisotropy),w.push(L.internalFormat),w.push(L.format),w.push(L.type),w.push(L.generateMipmaps),w.push(L.premultiplyAlpha),w.push(L.flipY),w.push(L.unpackAlignment),w.push(L.colorSpace),w.join()}function k(L,w){const j=i.get(L);if(L.isVideoTexture&&we(L),L.isRenderTargetTexture===!1&&L.isExternalTexture!==!0&&L.version>0&&j.__version!==L.version){const ee=L.image;if(ee===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ee.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Q(j,L,w);return}}else L.isExternalTexture&&(j.__webglTexture=L.sourceTexture?L.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,j.__webglTexture,n.TEXTURE0+w)}function G(L,w){const j=i.get(L);if(L.isRenderTargetTexture===!1&&L.version>0&&j.__version!==L.version){Q(j,L,w);return}t.bindTexture(n.TEXTURE_2D_ARRAY,j.__webglTexture,n.TEXTURE0+w)}function W(L,w){const j=i.get(L);if(L.isRenderTargetTexture===!1&&L.version>0&&j.__version!==L.version){Q(j,L,w);return}t.bindTexture(n.TEXTURE_3D,j.__webglTexture,n.TEXTURE0+w)}function N(L,w){const j=i.get(L);if(L.version>0&&j.__version!==L.version){te(j,L,w);return}t.bindTexture(n.TEXTURE_CUBE_MAP,j.__webglTexture,n.TEXTURE0+w)}const ce={[sl]:n.REPEAT,[mr]:n.CLAMP_TO_EDGE,[ol]:n.MIRRORED_REPEAT},_e={[li]:n.NEAREST,[df]:n.NEAREST_MIPMAP_NEAREST,[Ks]:n.NEAREST_MIPMAP_LINEAR,[oi]:n.LINEAR,[ha]:n.LINEAR_MIPMAP_NEAREST,[ji]:n.LINEAR_MIPMAP_LINEAR},ve={[gf]:n.NEVER,[Mf]:n.ALWAYS,[vf]:n.LESS,[Ih]:n.LEQUAL,[_f]:n.EQUAL,[yf]:n.GEQUAL,[xf]:n.GREATER,[bf]:n.NOTEQUAL};function Je(L,w){if(w.type===Li&&e.has("OES_texture_float_linear")===!1&&(w.magFilter===oi||w.magFilter===ha||w.magFilter===Ks||w.magFilter===ji||w.minFilter===oi||w.minFilter===ha||w.minFilter===Ks||w.minFilter===ji)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(L,n.TEXTURE_WRAP_S,ce[w.wrapS]),n.texParameteri(L,n.TEXTURE_WRAP_T,ce[w.wrapT]),(L===n.TEXTURE_3D||L===n.TEXTURE_2D_ARRAY)&&n.texParameteri(L,n.TEXTURE_WRAP_R,ce[w.wrapR]),n.texParameteri(L,n.TEXTURE_MAG_FILTER,_e[w.magFilter]),n.texParameteri(L,n.TEXTURE_MIN_FILTER,_e[w.minFilter]),w.compareFunction&&(n.texParameteri(L,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(L,n.TEXTURE_COMPARE_FUNC,ve[w.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===li||w.minFilter!==Ks&&w.minFilter!==ji||w.type===Li&&e.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||i.get(w).__currentAnisotropy){const j=e.get("EXT_texture_filter_anisotropic");n.texParameterf(L,j.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,r.getMaxAnisotropy())),i.get(w).__currentAnisotropy=w.anisotropy}}}function pt(L,w){let j=!1;L.__webglInit===void 0&&(L.__webglInit=!0,w.addEventListener("dispose",T));const ee=w.source;let ue=d.get(ee);ue===void 0&&(ue={},d.set(ee,ue));const z=V(w);if(z!==L.__cacheKey){ue[z]===void 0&&(ue[z]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,j=!0),ue[z].usedTimes++;const We=ue[L.__cacheKey];We!==void 0&&(ue[L.__cacheKey].usedTimes--,We.usedTimes===0&&E(w)),L.__cacheKey=z,L.__webglTexture=ue[z].texture}return j}function ut(L,w,j){return Math.floor(Math.floor(L/j)/w)}function mt(L,w,j,ee){const z=L.updateRanges;if(z.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,w.width,w.height,j,ee,w.data);else{z.sort((me,be)=>me.start-be.start);let We=0;for(let me=1;me<z.length;me++){const be=z[We],Qe=z[me],Fe=be.start+be.count,Re=ut(Qe.start,w.width,4),nt=ut(be.start,w.width,4);Qe.start<=Fe+1&&Re===nt&&ut(Qe.start+Qe.count-1,w.width,4)===Re?be.count=Math.max(be.count,Qe.start+Qe.count-be.start):(++We,z[We]=Qe)}z.length=We+1;const ye=n.getParameter(n.UNPACK_ROW_LENGTH),Ve=n.getParameter(n.UNPACK_SKIP_PIXELS),He=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,w.width);for(let me=0,be=z.length;me<be;me++){const Qe=z[me],Fe=Math.floor(Qe.start/4),Re=Math.ceil(Qe.count/4),nt=Fe%w.width,H=Math.floor(Fe/w.width),fe=Re,Te=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,nt),n.pixelStorei(n.UNPACK_SKIP_ROWS,H),t.texSubImage2D(n.TEXTURE_2D,0,nt,H,fe,Te,j,ee,w.data)}L.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,ye),n.pixelStorei(n.UNPACK_SKIP_PIXELS,Ve),n.pixelStorei(n.UNPACK_SKIP_ROWS,He)}}function Q(L,w,j){let ee=n.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(ee=n.TEXTURE_2D_ARRAY),w.isData3DTexture&&(ee=n.TEXTURE_3D);const ue=pt(L,w),z=w.source;t.bindTexture(ee,L.__webglTexture,n.TEXTURE0+j);const We=i.get(z);if(z.version!==We.__version||ue===!0){t.activeTexture(n.TEXTURE0+j);const ye=Ct.getPrimaries(Ct.workingColorSpace),Ve=w.colorSpace===Xi?null:Ct.getPrimaries(w.colorSpace),He=w.colorSpace===Xi||ye===Ve?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,w.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,w.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,He);let me=_(w.image,!1,r.maxTextureSize);me=et(w,me);const be=s.convert(w.format,w.colorSpace),Qe=s.convert(w.type);let Fe=y(w.internalFormat,be,Qe,w.colorSpace,w.isVideoTexture);Je(ee,w);let Re;const nt=w.mipmaps,H=w.isVideoTexture!==!0,fe=We.__version===void 0||ue===!0,Te=z.dataReady,Ie=M(w,me);if(w.isDepthTexture)Fe=b(w.format===Os,w.type),fe&&(H?t.texStorage2D(n.TEXTURE_2D,1,Fe,me.width,me.height):t.texImage2D(n.TEXTURE_2D,0,Fe,me.width,me.height,0,be,Qe,null));else if(w.isDataTexture)if(nt.length>0){H&&fe&&t.texStorage2D(n.TEXTURE_2D,Ie,Fe,nt[0].width,nt[0].height);for(let pe=0,ae=nt.length;pe<ae;pe++)Re=nt[pe],H?Te&&t.texSubImage2D(n.TEXTURE_2D,pe,0,0,Re.width,Re.height,be,Qe,Re.data):t.texImage2D(n.TEXTURE_2D,pe,Fe,Re.width,Re.height,0,be,Qe,Re.data);w.generateMipmaps=!1}else H?(fe&&t.texStorage2D(n.TEXTURE_2D,Ie,Fe,me.width,me.height),Te&&mt(w,me,be,Qe)):t.texImage2D(n.TEXTURE_2D,0,Fe,me.width,me.height,0,be,Qe,me.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){H&&fe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Ie,Fe,nt[0].width,nt[0].height,me.depth);for(let pe=0,ae=nt.length;pe<ae;pe++)if(Re=nt[pe],w.format!==ai)if(be!==null)if(H){if(Te)if(w.layerUpdates.size>0){const Ge=Au(Re.width,Re.height,w.format,w.type);for(const at of w.layerUpdates){const It=Re.data.subarray(at*Ge/Re.data.BYTES_PER_ELEMENT,(at+1)*Ge/Re.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,pe,0,0,at,Re.width,Re.height,1,be,It)}w.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,pe,0,0,0,Re.width,Re.height,me.depth,be,Re.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,pe,Fe,Re.width,Re.height,me.depth,0,Re.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else H?Te&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,pe,0,0,0,Re.width,Re.height,me.depth,be,Qe,Re.data):t.texImage3D(n.TEXTURE_2D_ARRAY,pe,Fe,Re.width,Re.height,me.depth,0,be,Qe,Re.data)}else{H&&fe&&t.texStorage2D(n.TEXTURE_2D,Ie,Fe,nt[0].width,nt[0].height);for(let pe=0,ae=nt.length;pe<ae;pe++)Re=nt[pe],w.format!==ai?be!==null?H?Te&&t.compressedTexSubImage2D(n.TEXTURE_2D,pe,0,0,Re.width,Re.height,be,Re.data):t.compressedTexImage2D(n.TEXTURE_2D,pe,Fe,Re.width,Re.height,0,Re.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):H?Te&&t.texSubImage2D(n.TEXTURE_2D,pe,0,0,Re.width,Re.height,be,Qe,Re.data):t.texImage2D(n.TEXTURE_2D,pe,Fe,Re.width,Re.height,0,be,Qe,Re.data)}else if(w.isDataArrayTexture)if(H){if(fe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Ie,Fe,me.width,me.height,me.depth),Te)if(w.layerUpdates.size>0){const pe=Au(me.width,me.height,w.format,w.type);for(const ae of w.layerUpdates){const Ge=me.data.subarray(ae*pe/me.data.BYTES_PER_ELEMENT,(ae+1)*pe/me.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,ae,me.width,me.height,1,be,Qe,Ge)}w.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,me.width,me.height,me.depth,be,Qe,me.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Fe,me.width,me.height,me.depth,0,be,Qe,me.data);else if(w.isData3DTexture)H?(fe&&t.texStorage3D(n.TEXTURE_3D,Ie,Fe,me.width,me.height,me.depth),Te&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,me.width,me.height,me.depth,be,Qe,me.data)):t.texImage3D(n.TEXTURE_3D,0,Fe,me.width,me.height,me.depth,0,be,Qe,me.data);else if(w.isFramebufferTexture){if(fe)if(H)t.texStorage2D(n.TEXTURE_2D,Ie,Fe,me.width,me.height);else{let pe=me.width,ae=me.height;for(let Ge=0;Ge<Ie;Ge++)t.texImage2D(n.TEXTURE_2D,Ge,Fe,pe,ae,0,be,Qe,null),pe>>=1,ae>>=1}}else if(nt.length>0){if(H&&fe){const pe=Ze(nt[0]);t.texStorage2D(n.TEXTURE_2D,Ie,Fe,pe.width,pe.height)}for(let pe=0,ae=nt.length;pe<ae;pe++)Re=nt[pe],H?Te&&t.texSubImage2D(n.TEXTURE_2D,pe,0,0,be,Qe,Re):t.texImage2D(n.TEXTURE_2D,pe,Fe,be,Qe,Re);w.generateMipmaps=!1}else if(H){if(fe){const pe=Ze(me);t.texStorage2D(n.TEXTURE_2D,Ie,Fe,pe.width,pe.height)}Te&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,be,Qe,me)}else t.texImage2D(n.TEXTURE_2D,0,Fe,be,Qe,me);m(w)&&p(ee),We.__version=z.version,w.onUpdate&&w.onUpdate(w)}L.__version=w.version}function te(L,w,j){if(w.image.length!==6)return;const ee=pt(L,w),ue=w.source;t.bindTexture(n.TEXTURE_CUBE_MAP,L.__webglTexture,n.TEXTURE0+j);const z=i.get(ue);if(ue.version!==z.__version||ee===!0){t.activeTexture(n.TEXTURE0+j);const We=Ct.getPrimaries(Ct.workingColorSpace),ye=w.colorSpace===Xi?null:Ct.getPrimaries(w.colorSpace),Ve=w.colorSpace===Xi||We===ye?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,w.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,w.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ve);const He=w.isCompressedTexture||w.image[0].isCompressedTexture,me=w.image[0]&&w.image[0].isDataTexture,be=[];for(let ae=0;ae<6;ae++)!He&&!me?be[ae]=_(w.image[ae],!0,r.maxCubemapSize):be[ae]=me?w.image[ae].image:w.image[ae],be[ae]=et(w,be[ae]);const Qe=be[0],Fe=s.convert(w.format,w.colorSpace),Re=s.convert(w.type),nt=y(w.internalFormat,Fe,Re,w.colorSpace),H=w.isVideoTexture!==!0,fe=z.__version===void 0||ee===!0,Te=ue.dataReady;let Ie=M(w,Qe);Je(n.TEXTURE_CUBE_MAP,w);let pe;if(He){H&&fe&&t.texStorage2D(n.TEXTURE_CUBE_MAP,Ie,nt,Qe.width,Qe.height);for(let ae=0;ae<6;ae++){pe=be[ae].mipmaps;for(let Ge=0;Ge<pe.length;Ge++){const at=pe[Ge];w.format!==ai?Fe!==null?H?Te&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ae,Ge,0,0,at.width,at.height,Fe,at.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ae,Ge,nt,at.width,at.height,0,at.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):H?Te&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ae,Ge,0,0,at.width,at.height,Fe,Re,at.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ae,Ge,nt,at.width,at.height,0,Fe,Re,at.data)}}}else{if(pe=w.mipmaps,H&&fe){pe.length>0&&Ie++;const ae=Ze(be[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,Ie,nt,ae.width,ae.height)}for(let ae=0;ae<6;ae++)if(me){H?Te&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0,0,0,be[ae].width,be[ae].height,Fe,Re,be[ae].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0,nt,be[ae].width,be[ae].height,0,Fe,Re,be[ae].data);for(let Ge=0;Ge<pe.length;Ge++){const It=pe[Ge].image[ae].image;H?Te&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ae,Ge+1,0,0,It.width,It.height,Fe,Re,It.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ae,Ge+1,nt,It.width,It.height,0,Fe,Re,It.data)}}else{H?Te&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0,0,0,Fe,Re,be[ae]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0,nt,Fe,Re,be[ae]);for(let Ge=0;Ge<pe.length;Ge++){const at=pe[Ge];H?Te&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ae,Ge+1,0,0,Fe,Re,at.image[ae]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ae,Ge+1,nt,Fe,Re,at.image[ae])}}}m(w)&&p(n.TEXTURE_CUBE_MAP),z.__version=ue.version,w.onUpdate&&w.onUpdate(w)}L.__version=w.version}function Le(L,w,j,ee,ue,z){const We=s.convert(j.format,j.colorSpace),ye=s.convert(j.type),Ve=y(j.internalFormat,We,ye,j.colorSpace),He=i.get(w),me=i.get(j);if(me.__renderTarget=w,!He.__hasExternalTextures){const be=Math.max(1,w.width>>z),Qe=Math.max(1,w.height>>z);ue===n.TEXTURE_3D||ue===n.TEXTURE_2D_ARRAY?t.texImage3D(ue,z,Ve,be,Qe,w.depth,0,We,ye,null):t.texImage2D(ue,z,Ve,be,Qe,0,We,ye,null)}t.bindFramebuffer(n.FRAMEBUFFER,L),de(w)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ee,ue,me.__webglTexture,0,Ee(w)):(ue===n.TEXTURE_2D||ue>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ue<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ee,ue,me.__webglTexture,z),t.bindFramebuffer(n.FRAMEBUFFER,null)}function $e(L,w,j){if(n.bindRenderbuffer(n.RENDERBUFFER,L),w.depthBuffer){const ee=w.depthTexture,ue=ee&&ee.isDepthTexture?ee.type:null,z=b(w.stencilBuffer,ue),We=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ye=Ee(w);de(w)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ye,z,w.width,w.height):j?n.renderbufferStorageMultisample(n.RENDERBUFFER,ye,z,w.width,w.height):n.renderbufferStorage(n.RENDERBUFFER,z,w.width,w.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,We,n.RENDERBUFFER,L)}else{const ee=w.textures;for(let ue=0;ue<ee.length;ue++){const z=ee[ue],We=s.convert(z.format,z.colorSpace),ye=s.convert(z.type),Ve=y(z.internalFormat,We,ye,z.colorSpace),He=Ee(w);j&&de(w)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,He,Ve,w.width,w.height):de(w)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,He,Ve,w.width,w.height):n.renderbufferStorage(n.RENDERBUFFER,Ve,w.width,w.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function ze(L,w){if(w&&w.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,L),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ee=i.get(w.depthTexture);ee.__renderTarget=w,(!ee.__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),k(w.depthTexture,0);const ue=ee.__webglTexture,z=Ee(w);if(w.depthTexture.format===Ns)de(w)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ue,0,z):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ue,0);else if(w.depthTexture.format===Os)de(w)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ue,0,z):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ue,0);else throw new Error("Unknown depthTexture format")}function xt(L){const w=i.get(L),j=L.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==L.depthTexture){const ee=L.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),ee){const ue=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,ee.removeEventListener("dispose",ue)};ee.addEventListener("dispose",ue),w.__depthDisposeCallback=ue}w.__boundDepthTexture=ee}if(L.depthTexture&&!w.__autoAllocateDepthBuffer){if(j)throw new Error("target.depthTexture not supported in Cube render targets");const ee=L.texture.mipmaps;ee&&ee.length>0?ze(w.__webglFramebuffer[0],L):ze(w.__webglFramebuffer,L)}else if(j){w.__webglDepthbuffer=[];for(let ee=0;ee<6;ee++)if(t.bindFramebuffer(n.FRAMEBUFFER,w.__webglFramebuffer[ee]),w.__webglDepthbuffer[ee]===void 0)w.__webglDepthbuffer[ee]=n.createRenderbuffer(),$e(w.__webglDepthbuffer[ee],L,!1);else{const ue=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,z=w.__webglDepthbuffer[ee];n.bindRenderbuffer(n.RENDERBUFFER,z),n.framebufferRenderbuffer(n.FRAMEBUFFER,ue,n.RENDERBUFFER,z)}}else{const ee=L.texture.mipmaps;if(ee&&ee.length>0?t.bindFramebuffer(n.FRAMEBUFFER,w.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=n.createRenderbuffer(),$e(w.__webglDepthbuffer,L,!1);else{const ue=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,z=w.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,z),n.framebufferRenderbuffer(n.FRAMEBUFFER,ue,n.RENDERBUFFER,z)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function ot(L,w,j){const ee=i.get(L);w!==void 0&&Le(ee.__webglFramebuffer,L,L.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),j!==void 0&&xt(L)}function F(L){const w=L.texture,j=i.get(L),ee=i.get(w);L.addEventListener("dispose",C);const ue=L.textures,z=L.isWebGLCubeRenderTarget===!0,We=ue.length>1;if(We||(ee.__webglTexture===void 0&&(ee.__webglTexture=n.createTexture()),ee.__version=w.version,o.memory.textures++),z){j.__webglFramebuffer=[];for(let ye=0;ye<6;ye++)if(w.mipmaps&&w.mipmaps.length>0){j.__webglFramebuffer[ye]=[];for(let Ve=0;Ve<w.mipmaps.length;Ve++)j.__webglFramebuffer[ye][Ve]=n.createFramebuffer()}else j.__webglFramebuffer[ye]=n.createFramebuffer()}else{if(w.mipmaps&&w.mipmaps.length>0){j.__webglFramebuffer=[];for(let ye=0;ye<w.mipmaps.length;ye++)j.__webglFramebuffer[ye]=n.createFramebuffer()}else j.__webglFramebuffer=n.createFramebuffer();if(We)for(let ye=0,Ve=ue.length;ye<Ve;ye++){const He=i.get(ue[ye]);He.__webglTexture===void 0&&(He.__webglTexture=n.createTexture(),o.memory.textures++)}if(L.samples>0&&de(L)===!1){j.__webglMultisampledFramebuffer=n.createFramebuffer(),j.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,j.__webglMultisampledFramebuffer);for(let ye=0;ye<ue.length;ye++){const Ve=ue[ye];j.__webglColorRenderbuffer[ye]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,j.__webglColorRenderbuffer[ye]);const He=s.convert(Ve.format,Ve.colorSpace),me=s.convert(Ve.type),be=y(Ve.internalFormat,He,me,Ve.colorSpace,L.isXRRenderTarget===!0),Qe=Ee(L);n.renderbufferStorageMultisample(n.RENDERBUFFER,Qe,be,L.width,L.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ye,n.RENDERBUFFER,j.__webglColorRenderbuffer[ye])}n.bindRenderbuffer(n.RENDERBUFFER,null),L.depthBuffer&&(j.__webglDepthRenderbuffer=n.createRenderbuffer(),$e(j.__webglDepthRenderbuffer,L,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(z){t.bindTexture(n.TEXTURE_CUBE_MAP,ee.__webglTexture),Je(n.TEXTURE_CUBE_MAP,w);for(let ye=0;ye<6;ye++)if(w.mipmaps&&w.mipmaps.length>0)for(let Ve=0;Ve<w.mipmaps.length;Ve++)Le(j.__webglFramebuffer[ye][Ve],L,w,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,Ve);else Le(j.__webglFramebuffer[ye],L,w,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0);m(w)&&p(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(We){for(let ye=0,Ve=ue.length;ye<Ve;ye++){const He=ue[ye],me=i.get(He);let be=n.TEXTURE_2D;(L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(be=L.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(be,me.__webglTexture),Je(be,He),Le(j.__webglFramebuffer,L,He,n.COLOR_ATTACHMENT0+ye,be,0),m(He)&&p(be)}t.unbindTexture()}else{let ye=n.TEXTURE_2D;if((L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(ye=L.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ye,ee.__webglTexture),Je(ye,w),w.mipmaps&&w.mipmaps.length>0)for(let Ve=0;Ve<w.mipmaps.length;Ve++)Le(j.__webglFramebuffer[Ve],L,w,n.COLOR_ATTACHMENT0,ye,Ve);else Le(j.__webglFramebuffer,L,w,n.COLOR_ATTACHMENT0,ye,0);m(w)&&p(ye),t.unbindTexture()}L.depthBuffer&&xt(L)}function he(L){const w=L.textures;for(let j=0,ee=w.length;j<ee;j++){const ue=w[j];if(m(ue)){const z=x(L),We=i.get(ue).__webglTexture;t.bindTexture(z,We),p(z),t.unbindTexture()}}}const ie=[],se=[];function oe(L){if(L.samples>0){if(de(L)===!1){const w=L.textures,j=L.width,ee=L.height;let ue=n.COLOR_BUFFER_BIT;const z=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,We=i.get(L),ye=w.length>1;if(ye)for(let He=0;He<w.length;He++)t.bindFramebuffer(n.FRAMEBUFFER,We.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+He,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,We.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+He,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,We.__webglMultisampledFramebuffer);const Ve=L.texture.mipmaps;Ve&&Ve.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,We.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,We.__webglFramebuffer);for(let He=0;He<w.length;He++){if(L.resolveDepthBuffer&&(L.depthBuffer&&(ue|=n.DEPTH_BUFFER_BIT),L.stencilBuffer&&L.resolveStencilBuffer&&(ue|=n.STENCIL_BUFFER_BIT)),ye){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,We.__webglColorRenderbuffer[He]);const me=i.get(w[He]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,me,0)}n.blitFramebuffer(0,0,j,ee,0,0,j,ee,ue,n.NEAREST),l===!0&&(ie.length=0,se.length=0,ie.push(n.COLOR_ATTACHMENT0+He),L.depthBuffer&&L.resolveDepthBuffer===!1&&(ie.push(z),se.push(z),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,se)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,ie))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),ye)for(let He=0;He<w.length;He++){t.bindFramebuffer(n.FRAMEBUFFER,We.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+He,n.RENDERBUFFER,We.__webglColorRenderbuffer[He]);const me=i.get(w[He]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,We.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+He,n.TEXTURE_2D,me,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,We.__webglMultisampledFramebuffer)}else if(L.depthBuffer&&L.resolveDepthBuffer===!1&&l){const w=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[w])}}}function Ee(L){return Math.min(r.maxSamples,L.samples)}function de(L){const w=i.get(L);return L.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function we(L){const w=o.render.frame;u.get(L)!==w&&(u.set(L,w),L.update())}function et(L,w){const j=L.colorSpace,ee=L.format,ue=L.type;return L.isCompressedTexture===!0||L.isVideoTexture===!0||j!==os&&j!==Xi&&(Ct.getTransfer(j)===Ft?(ee!==ai||ue!==gi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",j)),w}function Ze(L){return typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement?(c.width=L.naturalWidth||L.width,c.height=L.naturalHeight||L.height):typeof VideoFrame<"u"&&L instanceof VideoFrame?(c.width=L.displayWidth,c.height=L.displayHeight):(c.width=L.width,c.height=L.height),c}this.allocateTextureUnit=$,this.resetTextureUnits=B,this.setTexture2D=k,this.setTexture2DArray=G,this.setTexture3D=W,this.setTextureCube=N,this.rebindTextures=ot,this.setupRenderTarget=F,this.updateRenderTargetMipmap=he,this.updateMultisampleRenderTarget=oe,this.setupDepthRenderbuffer=xt,this.setupFrameBufferTexture=Le,this.useMultisampledRTT=de}function L_(n,e){function t(i,r=Xi){let s;const o=Ct.getTransfer(r);if(i===gi)return n.UNSIGNED_BYTE;if(i===Zl)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Kl)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Th)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Ah)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Eh)return n.BYTE;if(i===wh)return n.SHORT;if(i===Is)return n.UNSIGNED_SHORT;if(i===jl)return n.INT;if(i===vr)return n.UNSIGNED_INT;if(i===Li)return n.FLOAT;if(i===Gs)return n.HALF_FLOAT;if(i===Rh)return n.ALPHA;if(i===Ch)return n.RGB;if(i===ai)return n.RGBA;if(i===Ns)return n.DEPTH_COMPONENT;if(i===Os)return n.DEPTH_STENCIL;if(i===Ph)return n.RED;if(i===Jl)return n.RED_INTEGER;if(i===Lh)return n.RG;if(i===Ql)return n.RG_INTEGER;if(i===ec)return n.RGBA_INTEGER;if(i===Ro||i===Co||i===Po||i===Lo)if(o===Ft)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Ro)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Co)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Po)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Lo)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Ro)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Co)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Po)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Lo)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===al||i===ll||i===cl||i===ul)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===al)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===ll)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===cl)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===ul)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===hl||i===dl||i===fl)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===hl||i===dl)return o===Ft?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===fl)return o===Ft?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===pl||i===ml||i===gl||i===vl||i===_l||i===xl||i===bl||i===yl||i===Ml||i===Sl||i===El||i===wl||i===Tl||i===Al)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===pl)return o===Ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===ml)return o===Ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===gl)return o===Ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===vl)return o===Ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===_l)return o===Ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===xl)return o===Ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===bl)return o===Ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===yl)return o===Ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Ml)return o===Ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Sl)return o===Ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===El)return o===Ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===wl)return o===Ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Tl)return o===Ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Al)return o===Ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Rl||i===Cl||i===Pl)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===Rl)return o===Ft?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Cl)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Pl)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Ll||i===Dl||i===Il||i===Ul)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===Ll)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Dl)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Il)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Ul)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Us?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const D_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,I_=`
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

}`;class U_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new Gh(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new tr({vertexShader:D_,fragmentShader:I_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new En(new Di(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class N_ extends br{constructor(e,t){super();const i=this;let r=null,s=1,o=null,a="local-floor",l=1,c=null,u=null,h=null,d=null,f=null,g=null;const _=typeof XRWebGLBinding<"u",m=new U_,p={},x=t.getContextAttributes();let y=null,b=null;const M=[],T=[],C=new xe;let P=null;const E=new jn;E.viewport=new Yt;const S=new jn;S.viewport=new Yt;const I=[E,S],B=new em;let $=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Q){let te=M[Q];return te===void 0&&(te=new Da,M[Q]=te),te.getTargetRaySpace()},this.getControllerGrip=function(Q){let te=M[Q];return te===void 0&&(te=new Da,M[Q]=te),te.getGripSpace()},this.getHand=function(Q){let te=M[Q];return te===void 0&&(te=new Da,M[Q]=te),te.getHandSpace()};function k(Q){const te=T.indexOf(Q.inputSource);if(te===-1)return;const Le=M[te];Le!==void 0&&(Le.update(Q.inputSource,Q.frame,c||o),Le.dispatchEvent({type:Q.type,data:Q.inputSource}))}function G(){r.removeEventListener("select",k),r.removeEventListener("selectstart",k),r.removeEventListener("selectend",k),r.removeEventListener("squeeze",k),r.removeEventListener("squeezestart",k),r.removeEventListener("squeezeend",k),r.removeEventListener("end",G),r.removeEventListener("inputsourceschange",W);for(let Q=0;Q<M.length;Q++){const te=T[Q];te!==null&&(T[Q]=null,M[Q].disconnect(te))}$=null,V=null,m.reset();for(const Q in p)delete p[Q];e.setRenderTarget(y),f=null,d=null,h=null,r=null,b=null,mt.stop(),i.isPresenting=!1,e.setPixelRatio(P),e.setSize(C.width,C.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Q){s=Q,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Q){a=Q,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Q){c=Q},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return h===null&&_&&(h=new XRWebGLBinding(r,t)),h},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(Q){if(r=Q,r!==null){if(y=e.getRenderTarget(),r.addEventListener("select",k),r.addEventListener("selectstart",k),r.addEventListener("selectend",k),r.addEventListener("squeeze",k),r.addEventListener("squeezestart",k),r.addEventListener("squeezeend",k),r.addEventListener("end",G),r.addEventListener("inputsourceschange",W),x.xrCompatible!==!0&&await t.makeXRCompatible(),P=e.getPixelRatio(),e.getSize(C),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let Le=null,$e=null,ze=null;x.depth&&(ze=x.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Le=x.stencil?Os:Ns,$e=x.stencil?Us:vr);const xt={colorFormat:t.RGBA8,depthFormat:ze,scaleFactor:s};h=this.getBinding(),d=h.createProjectionLayer(xt),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),b=new _r(d.textureWidth,d.textureHeight,{format:ai,type:gi,depthTexture:new Hh(d.textureWidth,d.textureHeight,$e,void 0,void 0,void 0,void 0,void 0,void 0,Le),stencilBuffer:x.stencil,colorSpace:e.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const Le={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(r,t,Le),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),b=new _r(f.framebufferWidth,f.framebufferHeight,{format:ai,type:gi,colorSpace:e.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),mt.setContext(r),mt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function W(Q){for(let te=0;te<Q.removed.length;te++){const Le=Q.removed[te],$e=T.indexOf(Le);$e>=0&&(T[$e]=null,M[$e].disconnect(Le))}for(let te=0;te<Q.added.length;te++){const Le=Q.added[te];let $e=T.indexOf(Le);if($e===-1){for(let xt=0;xt<M.length;xt++)if(xt>=T.length){T.push(Le),$e=xt;break}else if(T[xt]===null){T[xt]=Le,$e=xt;break}if($e===-1)break}const ze=M[$e];ze&&ze.connect(Le)}}const N=new D,ce=new D;function _e(Q,te,Le){N.setFromMatrixPosition(te.matrixWorld),ce.setFromMatrixPosition(Le.matrixWorld);const $e=N.distanceTo(ce),ze=te.projectionMatrix.elements,xt=Le.projectionMatrix.elements,ot=ze[14]/(ze[10]-1),F=ze[14]/(ze[10]+1),he=(ze[9]+1)/ze[5],ie=(ze[9]-1)/ze[5],se=(ze[8]-1)/ze[0],oe=(xt[8]+1)/xt[0],Ee=ot*se,de=ot*oe,we=$e/(-se+oe),et=we*-se;if(te.matrixWorld.decompose(Q.position,Q.quaternion,Q.scale),Q.translateX(et),Q.translateZ(we),Q.matrixWorld.compose(Q.position,Q.quaternion,Q.scale),Q.matrixWorldInverse.copy(Q.matrixWorld).invert(),ze[10]===-1)Q.projectionMatrix.copy(te.projectionMatrix),Q.projectionMatrixInverse.copy(te.projectionMatrixInverse);else{const Ze=ot+we,L=F+we,w=Ee-et,j=de+($e-et),ee=he*F/L*Ze,ue=ie*F/L*Ze;Q.projectionMatrix.makePerspective(w,j,ee,ue,Ze,L),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert()}}function ve(Q,te){te===null?Q.matrixWorld.copy(Q.matrix):Q.matrixWorld.multiplyMatrices(te.matrixWorld,Q.matrix),Q.matrixWorldInverse.copy(Q.matrixWorld).invert()}this.updateCamera=function(Q){if(r===null)return;let te=Q.near,Le=Q.far;m.texture!==null&&(m.depthNear>0&&(te=m.depthNear),m.depthFar>0&&(Le=m.depthFar)),B.near=S.near=E.near=te,B.far=S.far=E.far=Le,($!==B.near||V!==B.far)&&(r.updateRenderState({depthNear:B.near,depthFar:B.far}),$=B.near,V=B.far),B.layers.mask=Q.layers.mask|6,E.layers.mask=B.layers.mask&3,S.layers.mask=B.layers.mask&5;const $e=Q.parent,ze=B.cameras;ve(B,$e);for(let xt=0;xt<ze.length;xt++)ve(ze[xt],$e);ze.length===2?_e(B,E,S):B.projectionMatrix.copy(E.projectionMatrix),Je(Q,B,$e)};function Je(Q,te,Le){Le===null?Q.matrix.copy(te.matrixWorld):(Q.matrix.copy(Le.matrixWorld),Q.matrix.invert(),Q.matrix.multiply(te.matrixWorld)),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.updateMatrixWorld(!0),Q.projectionMatrix.copy(te.projectionMatrix),Q.projectionMatrixInverse.copy(te.projectionMatrixInverse),Q.isPerspectiveCamera&&(Q.fov=Fs*2*Math.atan(1/Q.projectionMatrix.elements[5]),Q.zoom=1)}this.getCamera=function(){return B},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(Q){l=Q,d!==null&&(d.fixedFoveation=Q),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Q)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(B)},this.getCameraTexture=function(Q){return p[Q]};let pt=null;function ut(Q,te){if(u=te.getViewerPose(c||o),g=te,u!==null){const Le=u.views;f!==null&&(e.setRenderTargetFramebuffer(b,f.framebuffer),e.setRenderTarget(b));let $e=!1;Le.length!==B.cameras.length&&(B.cameras.length=0,$e=!0);for(let F=0;F<Le.length;F++){const he=Le[F];let ie=null;if(f!==null)ie=f.getViewport(he);else{const oe=h.getViewSubImage(d,he);ie=oe.viewport,F===0&&(e.setRenderTargetTextures(b,oe.colorTexture,oe.depthStencilTexture),e.setRenderTarget(b))}let se=I[F];se===void 0&&(se=new jn,se.layers.enable(F),se.viewport=new Yt,I[F]=se),se.matrix.fromArray(he.transform.matrix),se.matrix.decompose(se.position,se.quaternion,se.scale),se.projectionMatrix.fromArray(he.projectionMatrix),se.projectionMatrixInverse.copy(se.projectionMatrix).invert(),se.viewport.set(ie.x,ie.y,ie.width,ie.height),F===0&&(B.matrix.copy(se.matrix),B.matrix.decompose(B.position,B.quaternion,B.scale)),$e===!0&&B.cameras.push(se)}const ze=r.enabledFeatures;if(ze&&ze.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&_){h=i.getBinding();const F=h.getDepthInformation(Le[0]);F&&F.isValid&&F.texture&&m.init(F,r.renderState)}if(ze&&ze.includes("camera-access")&&_){e.state.unbindTexture(),h=i.getBinding();for(let F=0;F<Le.length;F++){const he=Le[F].camera;if(he){let ie=p[he];ie||(ie=new Gh,p[he]=ie);const se=h.getCameraImage(he);ie.sourceTexture=se}}}}for(let Le=0;Le<M.length;Le++){const $e=T[Le],ze=M[Le];$e!==null&&ze!==void 0&&ze.update($e,te,c||o)}pt&&pt(Q,te),te.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:te}),g=null}const mt=new td;mt.setAnimationLoop(ut),this.setAnimationLoop=function(Q){pt=Q},this.dispose=function(){}}}const ur=new Jn,O_=new Gt;function F_(n,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,Bh(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function r(m,p,x,y,b){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(m,p):p.isMeshToonMaterial?(s(m,p),h(m,p)):p.isMeshPhongMaterial?(s(m,p),u(m,p)):p.isMeshStandardMaterial?(s(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,b)):p.isMeshMatcapMaterial?(s(m,p),g(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),_(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,x,y):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===kn&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===kn&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const x=e.get(p),y=x.envMap,b=x.envMapRotation;y&&(m.envMap.value=y,ur.copy(b),ur.x*=-1,ur.y*=-1,ur.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(ur.y*=-1,ur.z*=-1),m.envMapRotation.value.setFromMatrix4(O_.makeRotationFromEuler(ur)),m.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,x,y){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*x,m.scale.value=y*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function u(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function h(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,x){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===kn&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const x=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function k_(n,e,t,i){let r={},s={},o=[];const a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,y){const b=y.program;i.uniformBlockBinding(x,b)}function c(x,y){let b=r[x.id];b===void 0&&(g(x),b=u(x),r[x.id]=b,x.addEventListener("dispose",m));const M=y.program;i.updateUBOMapping(x,M);const T=e.render.frame;s[x.id]!==T&&(d(x),s[x.id]=T)}function u(x){const y=h();x.__bindingPointIndex=y;const b=n.createBuffer(),M=x.__size,T=x.usage;return n.bindBuffer(n.UNIFORM_BUFFER,b),n.bufferData(n.UNIFORM_BUFFER,M,T),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,y,b),b}function h(){for(let x=0;x<a;x++)if(o.indexOf(x)===-1)return o.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(x){const y=r[x.id],b=x.uniforms,M=x.__cache;n.bindBuffer(n.UNIFORM_BUFFER,y);for(let T=0,C=b.length;T<C;T++){const P=Array.isArray(b[T])?b[T]:[b[T]];for(let E=0,S=P.length;E<S;E++){const I=P[E];if(f(I,T,E,M)===!0){const B=I.__offset,$=Array.isArray(I.value)?I.value:[I.value];let V=0;for(let k=0;k<$.length;k++){const G=$[k],W=_(G);typeof G=="number"||typeof G=="boolean"?(I.__data[0]=G,n.bufferSubData(n.UNIFORM_BUFFER,B+V,I.__data)):G.isMatrix3?(I.__data[0]=G.elements[0],I.__data[1]=G.elements[1],I.__data[2]=G.elements[2],I.__data[3]=0,I.__data[4]=G.elements[3],I.__data[5]=G.elements[4],I.__data[6]=G.elements[5],I.__data[7]=0,I.__data[8]=G.elements[6],I.__data[9]=G.elements[7],I.__data[10]=G.elements[8],I.__data[11]=0):(G.toArray(I.__data,V),V+=W.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,B,I.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(x,y,b,M){const T=x.value,C=y+"_"+b;if(M[C]===void 0)return typeof T=="number"||typeof T=="boolean"?M[C]=T:M[C]=T.clone(),!0;{const P=M[C];if(typeof T=="number"||typeof T=="boolean"){if(P!==T)return M[C]=T,!0}else if(P.equals(T)===!1)return P.copy(T),!0}return!1}function g(x){const y=x.uniforms;let b=0;const M=16;for(let C=0,P=y.length;C<P;C++){const E=Array.isArray(y[C])?y[C]:[y[C]];for(let S=0,I=E.length;S<I;S++){const B=E[S],$=Array.isArray(B.value)?B.value:[B.value];for(let V=0,k=$.length;V<k;V++){const G=$[V],W=_(G),N=b%M,ce=N%W.boundary,_e=N+ce;b+=ce,_e!==0&&M-_e<W.storage&&(b+=M-_e),B.__data=new Float32Array(W.storage/Float32Array.BYTES_PER_ELEMENT),B.__offset=b,b+=W.storage}}}const T=b%M;return T>0&&(b+=M-T),x.__size=b,x.__cache={},this}function _(x){const y={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(y.boundary=4,y.storage=4):x.isVector2?(y.boundary=8,y.storage=8):x.isVector3||x.isColor?(y.boundary=16,y.storage=12):x.isVector4?(y.boundary=16,y.storage=16):x.isMatrix3?(y.boundary=48,y.storage=48):x.isMatrix4?(y.boundary=64,y.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),y}function m(x){const y=x.target;y.removeEventListener("dispose",m);const b=o.indexOf(y.__bindingPointIndex);o.splice(b,1),n.deleteBuffer(r[y.id]),delete r[y.id],delete s[y.id]}function p(){for(const x in r)n.deleteBuffer(r[x]);o=[],r={},s={}}return{bind:l,update:c,dispose:p}}class B_{constructor(e={}){const{canvas:t=Bf(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let f;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=i.getContextAttributes().alpha}else f=o;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,p=null;const x=[],y=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Ji,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const b=this;let M=!1;this._outputColorSpace=yn;let T=0,C=0,P=null,E=-1,S=null;const I=new Yt,B=new Yt;let $=null;const V=new St(0);let k=0,G=t.width,W=t.height,N=1,ce=null,_e=null;const ve=new Yt(0,0,G,W),Je=new Yt(0,0,G,W);let pt=!1;const ut=new sc;let mt=!1,Q=!1;const te=new Gt,Le=new D,$e=new Yt,ze={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let xt=!1;function ot(){return P===null?N:1}let F=i;function he(A,X){return t.getContext(A,X)}try{const A={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Yl}`),t.addEventListener("webglcontextlost",Te,!1),t.addEventListener("webglcontextrestored",Ie,!1),t.addEventListener("webglcontextcreationerror",pe,!1),F===null){const X="webgl2";if(F=he(X,A),F===null)throw he(X)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let ie,se,oe,Ee,de,we,et,Ze,L,w,j,ee,ue,z,We,ye,Ve,He,me,be,Qe,Fe,Re,nt;function H(){ie=new jg(F),ie.init(),Fe=new L_(F,ie),se=new Hg(F,ie,e,Fe),oe=new C_(F,ie),se.reversedDepthBuffer&&d&&oe.buffers.depth.setReversed(!0),Ee=new Jg(F),de=new g_,we=new P_(F,ie,oe,de,se,Fe,Ee),et=new Wg(b),Ze=new Yg(b),L=new rm(F),Re=new zg(F,L),w=new Zg(F,L,Ee,Re),j=new ev(F,w,L,Ee),me=new Qg(F,se,we),ye=new Gg(de),ee=new m_(b,et,Ze,ie,se,Re,ye),ue=new F_(b,de),z=new __,We=new E_(ie),He=new Bg(b,et,Ze,oe,j,f,l),Ve=new A_(b,j,se),nt=new k_(F,Ee,se,oe),be=new Vg(F,ie,Ee),Qe=new Kg(F,ie,Ee),Ee.programs=ee.programs,b.capabilities=se,b.extensions=ie,b.properties=de,b.renderLists=z,b.shadowMap=Ve,b.state=oe,b.info=Ee}H();const fe=new N_(b,F);this.xr=fe,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){const A=ie.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=ie.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return N},this.setPixelRatio=function(A){A!==void 0&&(N=A,this.setSize(G,W,!1))},this.getSize=function(A){return A.set(G,W)},this.setSize=function(A,X,K=!0){if(fe.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}G=A,W=X,t.width=Math.floor(A*N),t.height=Math.floor(X*N),K===!0&&(t.style.width=A+"px",t.style.height=X+"px"),this.setViewport(0,0,A,X)},this.getDrawingBufferSize=function(A){return A.set(G*N,W*N).floor()},this.setDrawingBufferSize=function(A,X,K){G=A,W=X,N=K,t.width=Math.floor(A*K),t.height=Math.floor(X*K),this.setViewport(0,0,A,X)},this.getCurrentViewport=function(A){return A.copy(I)},this.getViewport=function(A){return A.copy(ve)},this.setViewport=function(A,X,K,J){A.isVector4?ve.set(A.x,A.y,A.z,A.w):ve.set(A,X,K,J),oe.viewport(I.copy(ve).multiplyScalar(N).round())},this.getScissor=function(A){return A.copy(Je)},this.setScissor=function(A,X,K,J){A.isVector4?Je.set(A.x,A.y,A.z,A.w):Je.set(A,X,K,J),oe.scissor(B.copy(Je).multiplyScalar(N).round())},this.getScissorTest=function(){return pt},this.setScissorTest=function(A){oe.setScissorTest(pt=A)},this.setOpaqueSort=function(A){ce=A},this.setTransparentSort=function(A){_e=A},this.getClearColor=function(A){return A.copy(He.getClearColor())},this.setClearColor=function(){He.setClearColor(...arguments)},this.getClearAlpha=function(){return He.getClearAlpha()},this.setClearAlpha=function(){He.setClearAlpha(...arguments)},this.clear=function(A=!0,X=!0,K=!0){let J=0;if(A){let q=!1;if(P!==null){const ge=P.texture.format;q=ge===ec||ge===Ql||ge===Jl}if(q){const ge=P.texture.type,Ce=ge===gi||ge===vr||ge===Is||ge===Us||ge===Zl||ge===Kl,Ne=He.getClearColor(),De=He.getClearAlpha(),Ke=Ne.r,tt=Ne.g,Xe=Ne.b;Ce?(g[0]=Ke,g[1]=tt,g[2]=Xe,g[3]=De,F.clearBufferuiv(F.COLOR,0,g)):(_[0]=Ke,_[1]=tt,_[2]=Xe,_[3]=De,F.clearBufferiv(F.COLOR,0,_))}else J|=F.COLOR_BUFFER_BIT}X&&(J|=F.DEPTH_BUFFER_BIT),K&&(J|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),F.clear(J)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Te,!1),t.removeEventListener("webglcontextrestored",Ie,!1),t.removeEventListener("webglcontextcreationerror",pe,!1),He.dispose(),z.dispose(),We.dispose(),de.dispose(),et.dispose(),Ze.dispose(),j.dispose(),Re.dispose(),nt.dispose(),ee.dispose(),fe.dispose(),fe.removeEventListener("sessionstart",Gn),fe.removeEventListener("sessionend",Oi),ci.stop()};function Te(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),M=!0}function Ie(){console.log("THREE.WebGLRenderer: Context Restored."),M=!1;const A=Ee.autoReset,X=Ve.enabled,K=Ve.autoUpdate,J=Ve.needsUpdate,q=Ve.type;H(),Ee.autoReset=A,Ve.enabled=X,Ve.autoUpdate=K,Ve.needsUpdate=J,Ve.type=q}function pe(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function ae(A){const X=A.target;X.removeEventListener("dispose",ae),Ge(X)}function Ge(A){at(A),de.remove(A)}function at(A){const X=de.get(A).programs;X!==void 0&&(X.forEach(function(K){ee.releaseProgram(K)}),A.isShaderMaterial&&ee.releaseShaderCache(A))}this.renderBufferDirect=function(A,X,K,J,q,ge){X===null&&(X=ze);const Ce=q.isMesh&&q.matrixWorld.determinant()<0,Ne=Bn(A,X,K,J,q);oe.setMaterial(J,Ce);let De=K.index,Ke=1;if(J.wireframe===!0){if(De=w.getWireframeAttribute(K),De===void 0)return;Ke=2}const tt=K.drawRange,Xe=K.attributes.position;let gt=tt.start*Ke,Rt=(tt.start+tt.count)*Ke;ge!==null&&(gt=Math.max(gt,ge.start*Ke),Rt=Math.min(Rt,(ge.start+ge.count)*Ke)),De!==null?(gt=Math.max(gt,0),Rt=Math.min(Rt,De.count)):Xe!=null&&(gt=Math.max(gt,0),Rt=Math.min(Rt,Xe.count));const Pt=Rt-gt;if(Pt<0||Pt===1/0)return;Re.setup(q,J,Ne,K,De);let Ut,Ot=be;if(De!==null&&(Ut=L.get(De),Ot=Qe,Ot.setIndex(Ut)),q.isMesh)J.wireframe===!0?(oe.setLineWidth(J.wireframeLinewidth*ot()),Ot.setMode(F.LINES)):Ot.setMode(F.TRIANGLES);else if(q.isLine){let Ye=J.linewidth;Ye===void 0&&(Ye=1),oe.setLineWidth(Ye*ot()),q.isLineSegments?Ot.setMode(F.LINES):q.isLineLoop?Ot.setMode(F.LINE_LOOP):Ot.setMode(F.LINE_STRIP)}else q.isPoints?Ot.setMode(F.POINTS):q.isSprite&&Ot.setMode(F.TRIANGLES);if(q.isBatchedMesh)if(q._multiDrawInstances!==null)ks("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Ot.renderMultiDrawInstances(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount,q._multiDrawInstances);else if(ie.get("WEBGL_multi_draw"))Ot.renderMultiDraw(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount);else{const Ye=q._multiDrawStarts,zt=q._multiDrawCounts,wt=q._multiDrawCount,wn=De?L.get(De).bytesPerElement:1,Tn=de.get(J).currentProgram.getUniforms();for(let An=0;An<wt;An++)Tn.setValue(F,"_gl_DrawID",An),Ot.render(Ye[An]/wn,zt[An])}else if(q.isInstancedMesh)Ot.renderInstances(gt,Pt,q.count);else if(K.isInstancedBufferGeometry){const Ye=K._maxInstanceCount!==void 0?K._maxInstanceCount:1/0,zt=Math.min(K.instanceCount,Ye);Ot.renderInstances(gt,Pt,zt)}else Ot.render(gt,Pt)};function It(A,X,K){A.transparent===!0&&A.side===pi&&A.forceSinglePass===!1?(A.side=kn,A.needsUpdate=!0,Mr(A,X,K),A.side=er,A.needsUpdate=!0,Mr(A,X,K),A.side=pi):Mr(A,X,K)}this.compile=function(A,X,K=null){K===null&&(K=A),p=We.get(K),p.init(X),y.push(p),K.traverseVisible(function(q){q.isLight&&q.layers.test(X.layers)&&(p.pushLight(q),q.castShadow&&p.pushShadow(q))}),A!==K&&A.traverseVisible(function(q){q.isLight&&q.layers.test(X.layers)&&(p.pushLight(q),q.castShadow&&p.pushShadow(q))}),p.setupLights();const J=new Set;return A.traverse(function(q){if(!(q.isMesh||q.isPoints||q.isLine||q.isSprite))return;const ge=q.material;if(ge)if(Array.isArray(ge))for(let Ce=0;Ce<ge.length;Ce++){const Ne=ge[Ce];It(Ne,K,q),J.add(Ne)}else It(ge,K,q),J.add(ge)}),p=y.pop(),J},this.compileAsync=function(A,X,K=null){const J=this.compile(A,X,K);return new Promise(q=>{function ge(){if(J.forEach(function(Ce){de.get(Ce).currentProgram.isReady()&&J.delete(Ce)}),J.size===0){q(A);return}setTimeout(ge,10)}ie.get("KHR_parallel_shader_compile")!==null?ge():setTimeout(ge,10)})};let Tt=null;function gn(A){Tt&&Tt(A)}function Gn(){ci.stop()}function Oi(){ci.start()}const ci=new td;ci.setAnimationLoop(gn),typeof self<"u"&&ci.setContext(self),this.setAnimationLoop=function(A){Tt=A,fe.setAnimationLoop(A),A===null?ci.stop():ci.start()},fe.addEventListener("sessionstart",Gn),fe.addEventListener("sessionend",Oi),this.render=function(A,X){if(X!==void 0&&X.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),X.parent===null&&X.matrixWorldAutoUpdate===!0&&X.updateMatrixWorld(),fe.enabled===!0&&fe.isPresenting===!0&&(fe.cameraAutoUpdate===!0&&fe.updateCamera(X),X=fe.getCamera()),A.isScene===!0&&A.onBeforeRender(b,A,X,P),p=We.get(A,y.length),p.init(X),y.push(p),te.multiplyMatrices(X.projectionMatrix,X.matrixWorldInverse),ut.setFromProjectionMatrix(te,mi,X.reversedDepth),Q=this.localClippingEnabled,mt=ye.init(this.clippingPlanes,Q),m=z.get(A,x.length),m.init(),x.push(m),fe.enabled===!0&&fe.isPresenting===!0){const ge=b.xr.getDepthSensingMesh();ge!==null&&fs(ge,X,-1/0,b.sortObjects)}fs(A,X,0,b.sortObjects),m.finish(),b.sortObjects===!0&&m.sort(ce,_e),xt=fe.enabled===!1||fe.isPresenting===!1||fe.hasDepthSensing()===!1,xt&&He.addToRenderList(m,A),this.info.render.frame++,mt===!0&&ye.beginShadows();const K=p.state.shadowsArray;Ve.render(K,A,X),mt===!0&&ye.endShadows(),this.info.autoReset===!0&&this.info.reset();const J=m.opaque,q=m.transmissive;if(p.setupLights(),X.isArrayCamera){const ge=X.cameras;if(q.length>0)for(let Ce=0,Ne=ge.length;Ce<Ne;Ce++){const De=ge[Ce];qs(J,q,A,De)}xt&&He.render(A);for(let Ce=0,Ne=ge.length;Ce<Ne;Ce++){const De=ge[Ce];$s(m,A,De,De.viewport)}}else q.length>0&&qs(J,q,A,X),xt&&He.render(A),$s(m,A,X);P!==null&&C===0&&(we.updateMultisampleRenderTarget(P),we.updateRenderTargetMipmap(P)),A.isScene===!0&&A.onAfterRender(b,A,X),Re.resetDefaultState(),E=-1,S=null,y.pop(),y.length>0?(p=y[y.length-1],mt===!0&&ye.setGlobalState(b.clippingPlanes,p.state.camera)):p=null,x.pop(),x.length>0?m=x[x.length-1]:m=null};function fs(A,X,K,J){if(A.visible===!1)return;if(A.layers.test(X.layers)){if(A.isGroup)K=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(X);else if(A.isLight)p.pushLight(A),A.castShadow&&p.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||ut.intersectsSprite(A)){J&&$e.setFromMatrixPosition(A.matrixWorld).applyMatrix4(te);const Ce=j.update(A),Ne=A.material;Ne.visible&&m.push(A,Ce,Ne,K,$e.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||ut.intersectsObject(A))){const Ce=j.update(A),Ne=A.material;if(J&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),$e.copy(A.boundingSphere.center)):(Ce.boundingSphere===null&&Ce.computeBoundingSphere(),$e.copy(Ce.boundingSphere.center)),$e.applyMatrix4(A.matrixWorld).applyMatrix4(te)),Array.isArray(Ne)){const De=Ce.groups;for(let Ke=0,tt=De.length;Ke<tt;Ke++){const Xe=De[Ke],gt=Ne[Xe.materialIndex];gt&&gt.visible&&m.push(A,Ce,gt,K,$e.z,Xe)}}else Ne.visible&&m.push(A,Ce,Ne,K,$e.z,null)}}const ge=A.children;for(let Ce=0,Ne=ge.length;Ce<Ne;Ce++)fs(ge[Ce],X,K,J)}function $s(A,X,K,J){const q=A.opaque,ge=A.transmissive,Ce=A.transparent;p.setupLightsView(K),mt===!0&&ye.setGlobalState(b.clippingPlanes,K),J&&oe.viewport(I.copy(J)),q.length>0&&_i(q,X,K),ge.length>0&&_i(ge,X,K),Ce.length>0&&_i(Ce,X,K),oe.buffers.depth.setTest(!0),oe.buffers.depth.setMask(!0),oe.buffers.color.setMask(!0),oe.setPolygonOffset(!1)}function qs(A,X,K,J){if((K.isScene===!0?K.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[J.id]===void 0&&(p.state.transmissionRenderTarget[J.id]=new _r(1,1,{generateMipmaps:!0,type:ie.has("EXT_color_buffer_half_float")||ie.has("EXT_color_buffer_float")?Gs:gi,minFilter:ji,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ct.workingColorSpace}));const ge=p.state.transmissionRenderTarget[J.id],Ce=J.viewport||I;ge.setSize(Ce.z*b.transmissionResolutionScale,Ce.w*b.transmissionResolutionScale);const Ne=b.getRenderTarget(),De=b.getActiveCubeFace(),Ke=b.getActiveMipmapLevel();b.setRenderTarget(ge),b.getClearColor(V),k=b.getClearAlpha(),k<1&&b.setClearColor(16777215,.5),b.clear(),xt&&He.render(K);const tt=b.toneMapping;b.toneMapping=Ji;const Xe=J.viewport;if(J.viewport!==void 0&&(J.viewport=void 0),p.setupLightsView(J),mt===!0&&ye.setGlobalState(b.clippingPlanes,J),_i(A,K,J),we.updateMultisampleRenderTarget(ge),we.updateRenderTargetMipmap(ge),ie.has("WEBGL_multisampled_render_to_texture")===!1){let gt=!1;for(let Rt=0,Pt=X.length;Rt<Pt;Rt++){const Ut=X[Rt],Ot=Ut.object,Ye=Ut.geometry,zt=Ut.material,wt=Ut.group;if(zt.side===pi&&Ot.layers.test(J.layers)){const wn=zt.side;zt.side=kn,zt.needsUpdate=!0,Fi(Ot,K,J,Ye,zt,wt),zt.side=wn,zt.needsUpdate=!0,gt=!0}}gt===!0&&(we.updateMultisampleRenderTarget(ge),we.updateRenderTargetMipmap(ge))}b.setRenderTarget(Ne,De,Ke),b.setClearColor(V,k),Xe!==void 0&&(J.viewport=Xe),b.toneMapping=tt}function _i(A,X,K){const J=X.isScene===!0?X.overrideMaterial:null;for(let q=0,ge=A.length;q<ge;q++){const Ce=A[q],Ne=Ce.object,De=Ce.geometry,Ke=Ce.group;let tt=Ce.material;tt.allowOverride===!0&&J!==null&&(tt=J),Ne.layers.test(K.layers)&&Fi(Ne,X,K,De,tt,Ke)}}function Fi(A,X,K,J,q,ge){A.onBeforeRender(b,X,K,J,q,ge),A.modelViewMatrix.multiplyMatrices(K.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),q.onBeforeRender(b,X,K,J,A,ge),q.transparent===!0&&q.side===pi&&q.forceSinglePass===!1?(q.side=kn,q.needsUpdate=!0,b.renderBufferDirect(K,X,J,q,A,ge),q.side=er,q.needsUpdate=!0,b.renderBufferDirect(K,X,J,q,A,ge),q.side=pi):b.renderBufferDirect(K,X,J,q,A,ge),A.onAfterRender(b,X,K,J,q,ge)}function Mr(A,X,K){X.isScene!==!0&&(X=ze);const J=de.get(A),q=p.state.lights,ge=p.state.shadowsArray,Ce=q.state.version,Ne=ee.getParameters(A,q.state,ge,X,K),De=ee.getProgramCacheKey(Ne);let Ke=J.programs;J.environment=A.isMeshStandardMaterial?X.environment:null,J.fog=X.fog,J.envMap=(A.isMeshStandardMaterial?Ze:et).get(A.envMap||J.environment),J.envMapRotation=J.environment!==null&&A.envMap===null?X.environmentRotation:A.envMapRotation,Ke===void 0&&(A.addEventListener("dispose",ae),Ke=new Map,J.programs=Ke);let tt=Ke.get(De);if(tt!==void 0){if(J.currentProgram===tt&&J.lightsStateVersion===Ce)return on(A,Ne),tt}else Ne.uniforms=ee.getUniforms(A),A.onBeforeCompile(Ne,b),tt=ee.acquireProgram(Ne,De),Ke.set(De,tt),J.uniforms=Ne.uniforms;const Xe=J.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Xe.clippingPlanes=ye.uniform),on(A,Ne),J.needsLights=Jo(A),J.lightsStateVersion=Ce,J.needsLights&&(Xe.ambientLightColor.value=q.state.ambient,Xe.lightProbe.value=q.state.probe,Xe.directionalLights.value=q.state.directional,Xe.directionalLightShadows.value=q.state.directionalShadow,Xe.spotLights.value=q.state.spot,Xe.spotLightShadows.value=q.state.spotShadow,Xe.rectAreaLights.value=q.state.rectArea,Xe.ltc_1.value=q.state.rectAreaLTC1,Xe.ltc_2.value=q.state.rectAreaLTC2,Xe.pointLights.value=q.state.point,Xe.pointLightShadows.value=q.state.pointShadow,Xe.hemisphereLights.value=q.state.hemi,Xe.directionalShadowMap.value=q.state.directionalShadowMap,Xe.directionalShadowMatrix.value=q.state.directionalShadowMatrix,Xe.spotShadowMap.value=q.state.spotShadowMap,Xe.spotLightMatrix.value=q.state.spotLightMatrix,Xe.spotLightMap.value=q.state.spotLightMap,Xe.pointShadowMap.value=q.state.pointShadowMap,Xe.pointShadowMatrix.value=q.state.pointShadowMatrix),J.currentProgram=tt,J.uniformsList=null,tt}function xi(A){if(A.uniformsList===null){const X=A.currentProgram.getUniforms();A.uniformsList=Do.seqWithValue(X.seq,A.uniforms)}return A.uniformsList}function on(A,X){const K=de.get(A);K.outputColorSpace=X.outputColorSpace,K.batching=X.batching,K.batchingColor=X.batchingColor,K.instancing=X.instancing,K.instancingColor=X.instancingColor,K.instancingMorph=X.instancingMorph,K.skinning=X.skinning,K.morphTargets=X.morphTargets,K.morphNormals=X.morphNormals,K.morphColors=X.morphColors,K.morphTargetsCount=X.morphTargetsCount,K.numClippingPlanes=X.numClippingPlanes,K.numIntersection=X.numClipIntersection,K.vertexAlphas=X.vertexAlphas,K.vertexTangents=X.vertexTangents,K.toneMapping=X.toneMapping}function Bn(A,X,K,J,q){X.isScene!==!0&&(X=ze),we.resetTextureUnits();const ge=X.fog,Ce=J.isMeshStandardMaterial?X.environment:null,Ne=P===null?b.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:os,De=(J.isMeshStandardMaterial?Ze:et).get(J.envMap||Ce),Ke=J.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,tt=!!K.attributes.tangent&&(!!J.normalMap||J.anisotropy>0),Xe=!!K.morphAttributes.position,gt=!!K.morphAttributes.normal,Rt=!!K.morphAttributes.color;let Pt=Ji;J.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(Pt=b.toneMapping);const Ut=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,Ot=Ut!==void 0?Ut.length:0,Ye=de.get(J),zt=p.state.lights;if(mt===!0&&(Q===!0||A!==S)){const fn=A===S&&J.id===E;ye.setState(J,A,fn)}let wt=!1;J.version===Ye.__version?(Ye.needsLights&&Ye.lightsStateVersion!==zt.state.version||Ye.outputColorSpace!==Ne||q.isBatchedMesh&&Ye.batching===!1||!q.isBatchedMesh&&Ye.batching===!0||q.isBatchedMesh&&Ye.batchingColor===!0&&q.colorTexture===null||q.isBatchedMesh&&Ye.batchingColor===!1&&q.colorTexture!==null||q.isInstancedMesh&&Ye.instancing===!1||!q.isInstancedMesh&&Ye.instancing===!0||q.isSkinnedMesh&&Ye.skinning===!1||!q.isSkinnedMesh&&Ye.skinning===!0||q.isInstancedMesh&&Ye.instancingColor===!0&&q.instanceColor===null||q.isInstancedMesh&&Ye.instancingColor===!1&&q.instanceColor!==null||q.isInstancedMesh&&Ye.instancingMorph===!0&&q.morphTexture===null||q.isInstancedMesh&&Ye.instancingMorph===!1&&q.morphTexture!==null||Ye.envMap!==De||J.fog===!0&&Ye.fog!==ge||Ye.numClippingPlanes!==void 0&&(Ye.numClippingPlanes!==ye.numPlanes||Ye.numIntersection!==ye.numIntersection)||Ye.vertexAlphas!==Ke||Ye.vertexTangents!==tt||Ye.morphTargets!==Xe||Ye.morphNormals!==gt||Ye.morphColors!==Rt||Ye.toneMapping!==Pt||Ye.morphTargetsCount!==Ot)&&(wt=!0):(wt=!0,Ye.__version=J.version);let wn=Ye.currentProgram;wt===!0&&(wn=Mr(J,X,q));let Tn=!1,An=!1,Qn=!1;const it=wn.getUniforms(),Rn=Ye.uniforms;if(oe.useProgram(wn.program)&&(Tn=!0,An=!0,Qn=!0),J.id!==E&&(E=J.id,An=!0),Tn||S!==A){oe.buffers.depth.getReversed()&&A.reversedDepth!==!0&&(A._reversedDepth=!0,A.updateProjectionMatrix()),it.setValue(F,"projectionMatrix",A.projectionMatrix),it.setValue(F,"viewMatrix",A.matrixWorldInverse);const Lt=it.map.cameraPosition;Lt!==void 0&&Lt.setValue(F,Le.setFromMatrixPosition(A.matrixWorld)),se.logarithmicDepthBuffer&&it.setValue(F,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(J.isMeshPhongMaterial||J.isMeshToonMaterial||J.isMeshLambertMaterial||J.isMeshBasicMaterial||J.isMeshStandardMaterial||J.isShaderMaterial)&&it.setValue(F,"isOrthographic",A.isOrthographicCamera===!0),S!==A&&(S=A,An=!0,Qn=!0)}if(q.isSkinnedMesh){it.setOptional(F,q,"bindMatrix"),it.setOptional(F,q,"bindMatrixInverse");const fn=q.skeleton;fn&&(fn.boneTexture===null&&fn.computeBoneTexture(),it.setValue(F,"boneTexture",fn.boneTexture,we))}q.isBatchedMesh&&(it.setOptional(F,q,"batchingTexture"),it.setValue(F,"batchingTexture",q._matricesTexture,we),it.setOptional(F,q,"batchingIdTexture"),it.setValue(F,"batchingIdTexture",q._indirectTexture,we),it.setOptional(F,q,"batchingColorTexture"),q._colorsTexture!==null&&it.setValue(F,"batchingColorTexture",q._colorsTexture,we));const Jt=K.morphAttributes;if((Jt.position!==void 0||Jt.normal!==void 0||Jt.color!==void 0)&&me.update(q,K,wn),(An||Ye.receiveShadow!==q.receiveShadow)&&(Ye.receiveShadow=q.receiveShadow,it.setValue(F,"receiveShadow",q.receiveShadow)),J.isMeshGouraudMaterial&&J.envMap!==null&&(Rn.envMap.value=De,Rn.flipEnvMap.value=De.isCubeTexture&&De.isRenderTargetTexture===!1?-1:1),J.isMeshStandardMaterial&&J.envMap===null&&X.environment!==null&&(Rn.envMapIntensity.value=X.environmentIntensity),An&&(it.setValue(F,"toneMappingExposure",b.toneMappingExposure),Ye.needsLights&&Ko(Rn,Qn),ge&&J.fog===!0&&ue.refreshFogUniforms(Rn,ge),ue.refreshMaterialUniforms(Rn,J,N,W,p.state.transmissionRenderTarget[A.id]),Do.upload(F,xi(Ye),Rn,we)),J.isShaderMaterial&&J.uniformsNeedUpdate===!0&&(Do.upload(F,xi(Ye),Rn,we),J.uniformsNeedUpdate=!1),J.isSpriteMaterial&&it.setValue(F,"center",q.center),it.setValue(F,"modelViewMatrix",q.modelViewMatrix),it.setValue(F,"normalMatrix",q.normalMatrix),it.setValue(F,"modelMatrix",q.matrixWorld),J.isShaderMaterial||J.isRawShaderMaterial){const fn=J.uniformsGroups;for(let Lt=0,wr=fn.length;Lt<wr;Lt++){const Wn=fn[Lt];nt.update(Wn,wn),nt.bind(Wn,wn)}}return wn}function Ko(A,X){A.ambientLightColor.needsUpdate=X,A.lightProbe.needsUpdate=X,A.directionalLights.needsUpdate=X,A.directionalLightShadows.needsUpdate=X,A.pointLights.needsUpdate=X,A.pointLightShadows.needsUpdate=X,A.spotLights.needsUpdate=X,A.spotLightShadows.needsUpdate=X,A.rectAreaLights.needsUpdate=X,A.hemisphereLights.needsUpdate=X}function Jo(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(A,X,K){const J=de.get(A);J.__autoAllocateDepthBuffer=A.resolveDepthBuffer===!1,J.__autoAllocateDepthBuffer===!1&&(J.__useRenderToTexture=!1),de.get(A.texture).__webglTexture=X,de.get(A.depthTexture).__webglTexture=J.__autoAllocateDepthBuffer?void 0:K,J.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(A,X){const K=de.get(A);K.__webglFramebuffer=X,K.__useDefaultFramebuffer=X===void 0};const Xs=F.createFramebuffer();this.setRenderTarget=function(A,X=0,K=0){P=A,T=X,C=K;let J=!0,q=null,ge=!1,Ce=!1;if(A){const De=de.get(A);if(De.__useDefaultFramebuffer!==void 0)oe.bindFramebuffer(F.FRAMEBUFFER,null),J=!1;else if(De.__webglFramebuffer===void 0)we.setupRenderTarget(A);else if(De.__hasExternalTextures)we.rebindTextures(A,de.get(A.texture).__webglTexture,de.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){const Xe=A.depthTexture;if(De.__boundDepthTexture!==Xe){if(Xe!==null&&de.has(Xe)&&(A.width!==Xe.image.width||A.height!==Xe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");we.setupDepthRenderbuffer(A)}}const Ke=A.texture;(Ke.isData3DTexture||Ke.isDataArrayTexture||Ke.isCompressedArrayTexture)&&(Ce=!0);const tt=de.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(tt[X])?q=tt[X][K]:q=tt[X],ge=!0):A.samples>0&&we.useMultisampledRTT(A)===!1?q=de.get(A).__webglMultisampledFramebuffer:Array.isArray(tt)?q=tt[K]:q=tt,I.copy(A.viewport),B.copy(A.scissor),$=A.scissorTest}else I.copy(ve).multiplyScalar(N).floor(),B.copy(Je).multiplyScalar(N).floor(),$=pt;if(K!==0&&(q=Xs),oe.bindFramebuffer(F.FRAMEBUFFER,q)&&J&&oe.drawBuffers(A,q),oe.viewport(I),oe.scissor(B),oe.setScissorTest($),ge){const De=de.get(A.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+X,De.__webglTexture,K)}else if(Ce){const De=X;for(let Ke=0;Ke<A.textures.length;Ke++){const tt=de.get(A.textures[Ke]);F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0+Ke,tt.__webglTexture,K,De)}}else if(A!==null&&K!==0){const De=de.get(A.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,De.__webglTexture,K)}E=-1},this.readRenderTargetPixels=function(A,X,K,J,q,ge,Ce,Ne=0){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let De=de.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Ce!==void 0&&(De=De[Ce]),De){oe.bindFramebuffer(F.FRAMEBUFFER,De);try{const Ke=A.textures[Ne],tt=Ke.format,Xe=Ke.type;if(!se.textureFormatReadable(tt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!se.textureTypeReadable(Xe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}X>=0&&X<=A.width-J&&K>=0&&K<=A.height-q&&(A.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+Ne),F.readPixels(X,K,J,q,Fe.convert(tt),Fe.convert(Xe),ge))}finally{const Ke=P!==null?de.get(P).__webglFramebuffer:null;oe.bindFramebuffer(F.FRAMEBUFFER,Ke)}}},this.readRenderTargetPixelsAsync=async function(A,X,K,J,q,ge,Ce,Ne=0){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let De=de.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Ce!==void 0&&(De=De[Ce]),De)if(X>=0&&X<=A.width-J&&K>=0&&K<=A.height-q){oe.bindFramebuffer(F.FRAMEBUFFER,De);const Ke=A.textures[Ne],tt=Ke.format,Xe=Ke.type;if(!se.textureFormatReadable(tt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!se.textureTypeReadable(Xe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const gt=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,gt),F.bufferData(F.PIXEL_PACK_BUFFER,ge.byteLength,F.STREAM_READ),A.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+Ne),F.readPixels(X,K,J,q,Fe.convert(tt),Fe.convert(Xe),0);const Rt=P!==null?de.get(P).__webglFramebuffer:null;oe.bindFramebuffer(F.FRAMEBUFFER,Rt);const Pt=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await zf(F,Pt,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,gt),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,ge),F.deleteBuffer(gt),F.deleteSync(Pt),ge}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(A,X=null,K=0){const J=Math.pow(2,-K),q=Math.floor(A.image.width*J),ge=Math.floor(A.image.height*J),Ce=X!==null?X.x:0,Ne=X!==null?X.y:0;we.setTexture2D(A,0),F.copyTexSubImage2D(F.TEXTURE_2D,K,0,0,Ce,Ne,q,ge),oe.unbindTexture()};const Sr=F.createFramebuffer(),Er=F.createFramebuffer();this.copyTextureToTexture=function(A,X,K=null,J=null,q=0,ge=null){ge===null&&(q!==0?(ks("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ge=q,q=0):ge=0);let Ce,Ne,De,Ke,tt,Xe,gt,Rt,Pt;const Ut=A.isCompressedTexture?A.mipmaps[ge]:A.image;if(K!==null)Ce=K.max.x-K.min.x,Ne=K.max.y-K.min.y,De=K.isBox3?K.max.z-K.min.z:1,Ke=K.min.x,tt=K.min.y,Xe=K.isBox3?K.min.z:0;else{const Jt=Math.pow(2,-q);Ce=Math.floor(Ut.width*Jt),Ne=Math.floor(Ut.height*Jt),A.isDataArrayTexture?De=Ut.depth:A.isData3DTexture?De=Math.floor(Ut.depth*Jt):De=1,Ke=0,tt=0,Xe=0}J!==null?(gt=J.x,Rt=J.y,Pt=J.z):(gt=0,Rt=0,Pt=0);const Ot=Fe.convert(X.format),Ye=Fe.convert(X.type);let zt;X.isData3DTexture?(we.setTexture3D(X,0),zt=F.TEXTURE_3D):X.isDataArrayTexture||X.isCompressedArrayTexture?(we.setTexture2DArray(X,0),zt=F.TEXTURE_2D_ARRAY):(we.setTexture2D(X,0),zt=F.TEXTURE_2D),F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,X.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,X.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,X.unpackAlignment);const wt=F.getParameter(F.UNPACK_ROW_LENGTH),wn=F.getParameter(F.UNPACK_IMAGE_HEIGHT),Tn=F.getParameter(F.UNPACK_SKIP_PIXELS),An=F.getParameter(F.UNPACK_SKIP_ROWS),Qn=F.getParameter(F.UNPACK_SKIP_IMAGES);F.pixelStorei(F.UNPACK_ROW_LENGTH,Ut.width),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,Ut.height),F.pixelStorei(F.UNPACK_SKIP_PIXELS,Ke),F.pixelStorei(F.UNPACK_SKIP_ROWS,tt),F.pixelStorei(F.UNPACK_SKIP_IMAGES,Xe);const it=A.isDataArrayTexture||A.isData3DTexture,Rn=X.isDataArrayTexture||X.isData3DTexture;if(A.isDepthTexture){const Jt=de.get(A),fn=de.get(X),Lt=de.get(Jt.__renderTarget),wr=de.get(fn.__renderTarget);oe.bindFramebuffer(F.READ_FRAMEBUFFER,Lt.__webglFramebuffer),oe.bindFramebuffer(F.DRAW_FRAMEBUFFER,wr.__webglFramebuffer);for(let Wn=0;Wn<De;Wn++)it&&(F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,de.get(A).__webglTexture,q,Xe+Wn),F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,de.get(X).__webglTexture,ge,Pt+Wn)),F.blitFramebuffer(Ke,tt,Ce,Ne,gt,Rt,Ce,Ne,F.DEPTH_BUFFER_BIT,F.NEAREST);oe.bindFramebuffer(F.READ_FRAMEBUFFER,null),oe.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else if(q!==0||A.isRenderTargetTexture||de.has(A)){const Jt=de.get(A),fn=de.get(X);oe.bindFramebuffer(F.READ_FRAMEBUFFER,Sr),oe.bindFramebuffer(F.DRAW_FRAMEBUFFER,Er);for(let Lt=0;Lt<De;Lt++)it?F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Jt.__webglTexture,q,Xe+Lt):F.framebufferTexture2D(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,Jt.__webglTexture,q),Rn?F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,fn.__webglTexture,ge,Pt+Lt):F.framebufferTexture2D(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,fn.__webglTexture,ge),q!==0?F.blitFramebuffer(Ke,tt,Ce,Ne,gt,Rt,Ce,Ne,F.COLOR_BUFFER_BIT,F.NEAREST):Rn?F.copyTexSubImage3D(zt,ge,gt,Rt,Pt+Lt,Ke,tt,Ce,Ne):F.copyTexSubImage2D(zt,ge,gt,Rt,Ke,tt,Ce,Ne);oe.bindFramebuffer(F.READ_FRAMEBUFFER,null),oe.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else Rn?A.isDataTexture||A.isData3DTexture?F.texSubImage3D(zt,ge,gt,Rt,Pt,Ce,Ne,De,Ot,Ye,Ut.data):X.isCompressedArrayTexture?F.compressedTexSubImage3D(zt,ge,gt,Rt,Pt,Ce,Ne,De,Ot,Ut.data):F.texSubImage3D(zt,ge,gt,Rt,Pt,Ce,Ne,De,Ot,Ye,Ut):A.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,ge,gt,Rt,Ce,Ne,Ot,Ye,Ut.data):A.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,ge,gt,Rt,Ut.width,Ut.height,Ot,Ut.data):F.texSubImage2D(F.TEXTURE_2D,ge,gt,Rt,Ce,Ne,Ot,Ye,Ut);F.pixelStorei(F.UNPACK_ROW_LENGTH,wt),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,wn),F.pixelStorei(F.UNPACK_SKIP_PIXELS,Tn),F.pixelStorei(F.UNPACK_SKIP_ROWS,An),F.pixelStorei(F.UNPACK_SKIP_IMAGES,Qn),ge===0&&X.generateMipmaps&&F.generateMipmap(zt),oe.unbindTexture()},this.initRenderTarget=function(A){de.get(A).__webglFramebuffer===void 0&&we.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?we.setTextureCube(A,0):A.isData3DTexture?we.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?we.setTexture2DArray(A,0):we.setTexture2D(A,0),oe.unbindTexture()},this.resetState=function(){T=0,C=0,P=null,oe.reset(),Re.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return mi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Ct._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ct._getUnpackColorSpace()}}const Ju={type:"change"},gc={type:"start"},od={type:"end"},Ao=new qo,Qu=new Ri,z_=Math.cos(70*vn.DEG2RAD),an=new D,Fn=2*Math.PI,Bt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},qa=1e-6;class V_ extends nm{constructor(e,t=null){super(e,t),this.state=Bt.NONE,this.target=new D,this.cursor=new D,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:jr.ROTATE,MIDDLE:jr.DOLLY,RIGHT:jr.PAN},this.touches={ONE:qr.ROTATE,TWO:qr.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new D,this._lastQuaternion=new Un,this._lastTargetPosition=new D,this._quat=new Un().setFromUnitVectors(e.up,new D(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Tu,this._sphericalDelta=new Tu,this._scale=1,this._panOffset=new D,this._rotateStart=new xe,this._rotateEnd=new xe,this._rotateDelta=new xe,this._panStart=new xe,this._panEnd=new xe,this._panDelta=new xe,this._dollyStart=new xe,this._dollyEnd=new xe,this._dollyDelta=new xe,this._dollyDirection=new D,this._mouse=new xe,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=G_.bind(this),this._onPointerDown=H_.bind(this),this._onPointerUp=W_.bind(this),this._onContextMenu=K_.bind(this),this._onMouseWheel=X_.bind(this),this._onKeyDown=Y_.bind(this),this._onTouchStart=j_.bind(this),this._onTouchMove=Z_.bind(this),this._onMouseDown=$_.bind(this),this._onMouseMove=q_.bind(this),this._interceptControlDown=J_.bind(this),this._interceptControlUp=Q_.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Ju),this.update(),this.state=Bt.NONE}update(e=null){const t=this.object.position;an.copy(t).sub(this.target),an.applyQuaternion(this._quat),this._spherical.setFromVector3(an),this.autoRotate&&this.state===Bt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,r=this.maxAzimuthAngle;isFinite(i)&&isFinite(r)&&(i<-Math.PI?i+=Fn:i>Math.PI&&(i-=Fn),r<-Math.PI?r+=Fn:r>Math.PI&&(r-=Fn),i<=r?this._spherical.theta=Math.max(i,Math.min(r,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+r)/2?Math.max(i,this._spherical.theta):Math.min(r,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let s=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),s=o!=this._spherical.radius}if(an.setFromSpherical(this._spherical),an.applyQuaternion(this._quatInverse),t.copy(this.target).add(an),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){const a=an.length();o=this._clampDistance(a*this._scale);const l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),s=!!l}else if(this.object.isOrthographicCamera){const a=new D(this._mouse.x,this._mouse.y,0);a.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),s=l!==this.object.zoom;const c=new D(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=an.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(Ao.origin.copy(this.object.position),Ao.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Ao.direction))<z_?this.object.lookAt(this.target):(Qu.setFromNormalAndCoplanarPoint(this.object.up,this.target),Ao.intersectPlane(Qu,this.target))))}else if(this.object.isOrthographicCamera){const o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),s=!0)}return this._scale=1,this._performCursorZoom=!1,s||this._lastPosition.distanceToSquared(this.object.position)>qa||8*(1-this._lastQuaternion.dot(this.object.quaternion))>qa||this._lastTargetPosition.distanceToSquared(this.target)>qa?(this.dispatchEvent(Ju),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Fn/60*this.autoRotateSpeed*e:Fn/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){an.setFromMatrixColumn(t,0),an.multiplyScalar(-e),this._panOffset.add(an)}_panUp(e,t){this.screenSpacePanning===!0?an.setFromMatrixColumn(t,1):(an.setFromMatrixColumn(t,0),an.crossVectors(this.object.up,an)),an.multiplyScalar(e),this._panOffset.add(an)}_pan(e,t){const i=this.domElement;if(this.object.isPerspectiveCamera){const r=this.object.position;an.copy(r).sub(this.target);let s=an.length();s*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*s/i.clientHeight,this.object.matrix),this._panUp(2*t*s/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),r=e-i.left,s=t-i.top,o=i.width,a=i.height;this._mouse.x=r/o*2-1,this._mouse.y=-(s/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Fn*this._rotateDelta.x/t.clientHeight),this._rotateUp(Fn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(Fn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-Fn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(Fn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-Fn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._rotateStart.set(i,r)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panStart.set(i,r)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,r=e.pageY-t.y,s=Math.sqrt(i*i+r*r);this._dollyStart.set(0,s)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),r=.5*(e.pageX+i.x),s=.5*(e.pageY+i.y);this._rotateEnd.set(r,s)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Fn*this._rotateDelta.x/t.clientHeight),this._rotateUp(Fn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panEnd.set(i,r)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,r=e.pageY-t.y,s=Math.sqrt(i*i+r*r);this._dollyEnd.set(0,s),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const o=(e.pageX+t.x)*.5,a=(e.pageY+t.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new xe,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function H_(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n)))}function G_(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function W_(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(od),this.state=Bt.NONE;break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function $_(n){let e;switch(n.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case jr.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=Bt.DOLLY;break;case jr.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=Bt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=Bt.ROTATE}break;case jr.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=Bt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=Bt.PAN}break;default:this.state=Bt.NONE}this.state!==Bt.NONE&&this.dispatchEvent(gc)}function q_(n){switch(this.state){case Bt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case Bt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case Bt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function X_(n){this.enabled===!1||this.enableZoom===!1||this.state!==Bt.NONE||(n.preventDefault(),this.dispatchEvent(gc),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(od))}function Y_(n){this.enabled!==!1&&this._handleKeyDown(n)}function j_(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case qr.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=Bt.TOUCH_ROTATE;break;case qr.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=Bt.TOUCH_PAN;break;default:this.state=Bt.NONE}break;case 2:switch(this.touches.TWO){case qr.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=Bt.TOUCH_DOLLY_PAN;break;case qr.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=Bt.TOUCH_DOLLY_ROTATE;break;default:this.state=Bt.NONE}break;default:this.state=Bt.NONE}this.state!==Bt.NONE&&this.dispatchEvent(gc)}function Z_(n){switch(this._trackPointer(n),this.state){case Bt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case Bt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case Bt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case Bt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=Bt.NONE}}function K_(n){this.enabled!==!1&&n.preventDefault()}function J_(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Q_(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const ys=new D;function Xn(n,e,t,i,r,s){const o=2*Math.PI*r/4,a=Math.max(s-2*r,0),l=Math.PI/4;ys.copy(e),ys[i]=0,ys.normalize();const c=.5*o/(o+a),u=1-ys.angleTo(n)/l;return Math.sign(ys[t])===1?u*c:a/(o+a)+c+c*(1-u)}class jo extends Zt{constructor(e=1,t=1,i=1,r=2,s=.1){const o=r*2+1;if(s=Math.min(e/2,t/2,i/2,s),super(1,1,1,o,o,o),this.type="RoundedBoxGeometry",this.parameters={width:e,height:t,depth:i,segments:r,radius:s},o===1)return;const a=this.toNonIndexed();this.index=null,this.attributes.position=a.attributes.position,this.attributes.normal=a.attributes.normal,this.attributes.uv=a.attributes.uv;const l=new D,c=new D,u=new D(e,t,i).divideScalar(2).subScalar(s),h=this.attributes.position.array,d=this.attributes.normal.array,f=this.attributes.uv.array,g=h.length/6,_=new D,m=.5/o;for(let p=0,x=0;p<h.length;p+=3,x+=2)switch(l.fromArray(h,p),c.copy(l),c.x-=Math.sign(c.x)*m,c.y-=Math.sign(c.y)*m,c.z-=Math.sign(c.z)*m,c.normalize(),h[p+0]=u.x*Math.sign(l.x)+c.x*s,h[p+1]=u.y*Math.sign(l.y)+c.y*s,h[p+2]=u.z*Math.sign(l.z)+c.z*s,d[p+0]=c.x,d[p+1]=c.y,d[p+2]=c.z,Math.floor(p/g)){case 0:_.set(1,0,0),f[x+0]=Xn(_,c,"z","y",s,i),f[x+1]=1-Xn(_,c,"y","z",s,t);break;case 1:_.set(-1,0,0),f[x+0]=1-Xn(_,c,"z","y",s,i),f[x+1]=1-Xn(_,c,"y","z",s,t);break;case 2:_.set(0,1,0),f[x+0]=1-Xn(_,c,"x","z",s,e),f[x+1]=Xn(_,c,"z","x",s,i);break;case 3:_.set(0,-1,0),f[x+0]=1-Xn(_,c,"x","z",s,e),f[x+1]=1-Xn(_,c,"z","x",s,i);break;case 4:_.set(0,0,1),f[x+0]=1-Xn(_,c,"x","y",s,e),f[x+1]=1-Xn(_,c,"y","x",s,t);break;case 5:_.set(0,0,-1),f[x+0]=Xn(_,c,"x","y",s,e),f[x+1]=1-Xn(_,c,"y","x",s,t);break}}static fromJSON(e){return new jo(e.width,e.height,e.depth,e.segments,e.radius)}}const eh=Math.PI*2;function ex(n,e){const t=e.clone().normalize();let i=2*Math.atan2(n.x*t.x+n.y*t.y+n.z*t.z,n.w);for(;i>Math.PI;)i-=eh;for(;i<-Math.PI;)i+=eh;return i}function Vl(n,e,t=.055){if(!n)return null;let i=null,r=t;for(const s of e){const o=n.distanceTo(s.position);o<=r&&(i=s,r=o)}return i}function tx({getModel:n=()=>({}),getTerminals:e=()=>[],onProbe:t=()=>{},onConnect:i=()=>{},onDisconnect:r=()=>{},onChange:s=()=>{},onAction:o=()=>{},onGraphCursor:a=()=>{},onHold:l=()=>{},snapRadius:c=.055}={}){const u=new Map,h=new Set,d=new Map;function f(p,x,y={}){var C,P,E,S;if(!x||h.has(p)||u.has(p))return!1;const b=x.resource||`${x.kind}:${x.channel||x.id}`;if(d.has(b))return!1;const M=n(),T={input:p,target:x,resource:b,position:(C=y.position)==null?void 0:C.clone(),startPosition:(P=y.position)==null?void 0:P.clone(),turn:0,lastValue:void 0};if(x.kind==="dial"){if(T.startValue=(E=M.parameters)==null?void 0:E[x.parameter],T.values=x.values||((S=M.options)==null?void 0:S[x.parameter]),!T.values&&!Number.isFinite(T.startValue))return!1;T.values&&!T.values.includes(T.startValue)&&(T.startValue=T.values[0]),T.lastValue=T.startValue}return u.set(p,T),d.set(b,p),l("start",T),x.kind==="probe"&&t(x.channel,null),x.kind==="plug"&&Number.isInteger(x.wireIndex)&&r(x.wireIndex),(x.kind==="button"||x.kind==="switch")&&o(x.action),x.kind==="screen"&&Number.isFinite(y.fraction)&&a(vn.clamp(y.fraction,0,1),y.panelIndex||0),!0}function g(p,x={}){var b;const y=u.get(p);if(!y)return!1;if(x.position&&(y.position=x.position.clone()),x.quaternion&&(y.quaternion=x.quaternion.clone()),y.target.kind==="dial"&&Number.isFinite(x.turn)){y.turn+=x.turn;const M=y.target;let T;if((b=y.values)!=null&&b.length){const C=Math.round(y.turn/(M.detentRadians||Math.PI/12)),P=vn.clamp(y.values.indexOf(y.startValue)+C,0,y.values.length-1);T=y.values[P]}else{const C=M.step||1;T=vn.clamp(y.startValue+Math.round(y.turn/(M.detentRadians||Math.PI/12))*C,M.min??-1/0,M.max??1/0),T=Number(T.toPrecision(12))}T!==y.lastValue&&(y.lastValue=T,s(M.parameter,T))}return y.target.kind==="screen"&&Number.isFinite(x.fraction)&&a(vn.clamp(x.fraction,0,1),x.panelIndex||0),l("move",y),!0}function _(p,x={},y=!1){h.delete(p);const b=u.get(p);if(!b)return null;x.position&&(b.position=x.position.clone()),u.delete(p),d.delete(b.resource);const M=y?null:Vl(b.position,e(),c);let T={kind:y?"cancelled":"released",terminal:null};if(b.target.kind==="probe"&&(t(b.target.channel,(M==null?void 0:M.id)||null),T={kind:M?"connected":"loose",terminal:(M==null?void 0:M.id)||null}),b.target.kind==="terminal"||b.target.kind==="plug"){const C=b.target.from||b.target.terminal;if(!y&&M&&M.id!==C)i(C,M.id),T={kind:"connected",terminal:M.id};else{const P=b.startPosition&&b.position&&b.startPosition.distanceTo(b.position)<.018;T={kind:b.target.kind==="terminal"&&P?"cancelled":"loose",terminal:null}}}return l("end",b,T),T}function m(){const p=[...u.keys()];for(const x of p)_(x,{},!0),h.add(x)}return{begin:f,move:g,end:(p,x)=>_(p,x),cancelAll:m,release(p){h.delete(p)},block(p){u.has(p)&&_(p,{},!0),h.add(p)},hold:p=>u.get(p),holds:u,isHeld:p=>d.has(p)}}function nx(n,e,{bounds:t={minX:-3.2,maxX:3.2,minZ:-3.8,maxZ:2.4},obstacles:i=[],radius:r=.19}={}){const s=n.clone(),o=Math.max(1,Math.ceil(Math.hypot(e.x,e.z)/.04)),a=e.x/o,l=e.z/o,c=(h,d,f)=>{const g=[h-(f.minX-r),f.maxX+r-h,d-(f.minZ-r),f.maxZ+r-d];return Math.max(0,Math.min(...g))},u=(h,d)=>i.some(f=>{const g=c(h,d,f),_=c(s.x,s.z,f);if(g<=0)return!1;if(_<=0)return!0;if(g<_-1e-10)return!1;const m=(f.minX+f.maxX)/2,p=(f.minZ+f.maxZ)/2,x=(s.x-m)**2+(s.z-p)**2,y=(h-m)**2+(d-p)**2;return g>_+1e-10||y<=x+1e-10});for(let h=0;h<o;h++){const d=vn.clamp(s.x+a,t.minX+r,t.maxX-r);u(d,s.z)||(s.x=d);const f=vn.clamp(s.z+l,t.minZ+r,t.maxZ-r);u(s.x,f)||(s.z=f)}return s}function ix(n,e,t){const i=new Un().setFromAxisAngle(new D(0,1,0),t);n.position.sub(e).applyQuaternion(i).add(e),n.quaternion.premultiply(i),n.updateMatrixWorld(!0)}function rx({speed:n=.8,snapAngle:e=Math.PI/6,...t}={}){let i=!1,r=!1;return{reset(){i=!1,r=!0},update({rig:s,headPosition:o,headQuaternion:a,left:l=[0,0],right:c=0,dt:u=0,enabled:h=!0}){if(!h)return i=!1,r=!0,!1;const d=Math.max(Math.abs(l[0]||0),Math.abs(l[1]||0),Math.abs(c))<.2;if(!i){if(!d)return!1;i=!0}Math.abs(c)<.25&&(r=!1);let f=0;Math.abs(c)>.7&&!r&&(f=-Math.sign(c)*e,ix(s,o,f),r=!0);const g=Math.abs(l[0]||0)>.18?l[0]:0,_=Math.abs(l[1]||0)>.18?l[1]:0;if(!g&&!_)return!1;const m=new D(0,0,-1).applyQuaternion(a).applyAxisAngle(new D(0,1,0),f);m.y=0,m.lengthSq()<.001?m.set(0,0,-1):m.normalize();const x=new D(-m.z,0,m.x).multiplyScalar(g).addScaledVector(m,-_);x.length()>1&&x.normalize(),x.multiplyScalar(n*vn.clamp(u,0,.05));const y=nx(o,x,t);return s.position.add(y.sub(o)),s.updateMatrixWorld(!0),!0}}}function th(n,e=!1){const t=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),r=new Set(Object.keys(n[0].morphAttributes)),s={},o={},a=n[0].morphTargetsRelative,l=new un;let c=0;for(let u=0;u<n.length;++u){const h=n[u];let d=0;if(t!==(h.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const f in h.attributes){if(!i.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;s[f]===void 0&&(s[f]=[]),s[f].push(h.attributes[f]),d++}if(d!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(a!==h.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const f in h.morphAttributes){if(!r.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;o[f]===void 0&&(o[f]=[]),o[f].push(h.morphAttributes[f])}if(e){let f;if(t)f=h.index.count;else if(h.attributes.position!==void 0)f=h.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,f,u),c+=f}}if(t){let u=0;const h=[];for(let d=0;d<n.length;++d){const f=n[d].index;for(let g=0;g<f.count;++g)h.push(f.getX(g)+u);u+=n[d].attributes.position.count}l.setIndex(h)}for(const u in s){const h=nh(s[u]);if(!h)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;l.setAttribute(u,h)}for(const u in o){const h=o[u][0].length;if(h===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[u]=[];for(let d=0;d<h;++d){const f=[];for(let _=0;_<o[u].length;++_)f.push(o[u][_][d]);const g=nh(f);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;l.morphAttributes[u].push(g)}}return l}function nh(n){let e,t,i,r=-1,s=0;for(let c=0;c<n.length;++c){const u=n[c];if(e===void 0&&(e=u.array.constructor),e!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=u.itemSize),t!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=u.normalized),i!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(r===-1&&(r=u.gpuType),r!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;s+=u.count*t}const o=new e(s),a=new Kn(o,t,i);let l=0;for(let c=0;c<n.length;++c){const u=n[c];if(u.isInterleavedBufferAttribute){const h=l/t;for(let d=0,f=u.count;d<f;d++)for(let g=0;g<t;g++){const _=u.getComponent(d,g);a.setComponent(d+h,g,_)}}else o.set(u.array,l);l+=u.count*t}return r!==void 0&&(a.gpuType=r),a}const Ht={case:"#d5d6d1",face:"#e8e8e2",dark:"#262a2c",rubber:"#363b3c",metal:"#a5aaab",red:"#ad2f2c",black:"#25292b",ch1:"#d5b348",ch2:"#64a5b5"},sn=(n,e=3)=>Number.isFinite(Number(n))&&n!==null?Number(n).toFixed(e).replace(/\.?0+$/,"")||"0":"—",ad=n=>Number(n)>=1e3?`${sn(Number(n)/1e3,2)} kΩ`:`${sn(Number(n),1)} Ω`,Hl=n=>n!=null&&n.isVector3?n.clone():Array.isArray(n)?new D(...n):new D((n==null?void 0:n.x)||0,(n==null?void 0:n.y)||0,(n==null?void 0:n.z)||0);function $t(n,e,t,i,{size:r,width:s,align:o="left",weight:a=700,family:l="Arial, sans-serif"}){const c=String(e);let u=r;n.font=`${a} ${u}px ${l}`,s&&n.measureText(c).width>s&&(u*=s/n.measureText(c).width,n.font=`${a} ${u}px ${l}`),n.textAlign=o,n.fillText(c,t,i)}function sx(n,e,t){const i=[];for(const r of String(e).split(/\s+/)){const s=i.length-1;s>=0&&n.measureText(`${i[s]} ${r}`).width<=t?i[s]+=` ${r}`:i.push(r)}return i}function Ni(n){const e=new Kt;e.name=n;const t=[],i={},r=new Set,s=new Set,o=new Set;let a=!1;const l=(P,E={})=>{const S=new pc({color:P,roughness:.66,metalness:.03,...E});return r.add(S),S},c={case:l(Ht.case),face:l(Ht.face),dark:l(Ht.dark),rubber:l(Ht.rubber,{roughness:.87}),metal:l(Ht.metal,{metalness:.8,roughness:.27}),red:l(Ht.red),black:l(Ht.black)};function u(P,E,S=e,I=[0,0,0]){s.add(P);const B=new En(P,E);return B.position.copy(Hl(I)),B.castShadow=!0,B.receiveShadow=!0,S.add(B),B}const h=(P,E,S,I,B,$,V=.002)=>u(V<=5e-4?new Zt(P,E,S):new jo(P,E,S,2,Math.min(V,P/4,E/4,S/4)),I,B,$);function d(P,E,S,I,B,$=24){const V=new _t(P,P,E,$);return V.rotateX(Math.PI/2),u(V,S,I,B)}function f(P,E,S=e){const I=new cn;return I.name=P,I.position.copy(Hl(E)),S.add(I),i[P]=I,I}function g(P,E){const S={object:P,id:`${n}:${t.length}`,axis:"z",...E};return P.userData.equipmentTarget=S,t.push(S),S}function _(P,E,S,{pixels:I=[768,320],background:B="#dbe6cb",foreground:$="#102018"}={}){const V=document.createElement("canvas");V.width=I[0],V.height=Math.round(I[0]*E/P);const k=V.getContext("2d"),G=new Ol(V);G.colorSpace=yn,G.anisotropy=8;const W=new Yn({map:G,toneMapped:!1});r.add(W),o.add(G);const N=u(new Di(P,E),W,e,S);N.castShadow=!1;let ce=null;return{object:N,canvas:V,ctx:k,texture:G,draw(_e,ve){const Je=JSON.stringify(_e);Je!==ce&&(ce=Je,k.fillStyle=B,k.fillRect(0,0,V.width,V.height),k.fillStyle=$,k.textBaseline="middle",k.textAlign="left",ve(k,V.width,V.height),G.needsUpdate=!0)}}}function m(P,E,S,I,{size:B=52,color:$="#172120",background:V="#e8e8e2",align:k="center"}={}){const G=_(E,S,I,{pixels:[Math.round(128*E/S),128],background:V,foreground:$});return G.draw(P,(W,N,ce)=>{$t(W,P,k==="center"?N/2:8,ce/2,{size:ce*.88,width:N-16,align:k})}),G}function p(P,E,S,I=e){d(.0022,.001,c.metal,I,[P,E,S],12);const B=h(.003,5e-4,3e-4,c.dark,I,[P,E,S+65e-5],1e-4);B.rotation.z=.5}function x(P,E,S){h(P,E-.008,S,c.case,e,[0,E/2+.004,0],.008),h(P-.008,E-.014,.006,c.face,e,[0,E/2+.005,S/2],.004);for(const I of[-P/2+.014,P/2-.014]){for(const B of[.024,E-.018])p(I,B,S/2+.0038);for(const B of[-S/2+.02,S/2-.02])h(.025,.009,.032,c.rubber,e,[I,.0045,B],.002)}for(let I=0;I<12;I++)h(.035,6e-4,.002,c.dark,e,[P/2-.042,E+4e-4,-S/2+.022+I*.006],15e-5);return S/2+.004}function y(P,E,S,I,B,{bnc:$=!1,action:V,channel:k}={}){const G=l(B);if(d($?.0083:.007,$?.008:.003,G,e,[E,S,I+.002]),d($?.0065:.0048,$?.009:.002,c.metal,e,[E,S,I+.006]),d($?.0042:.0031,.001,c.dark,e,[E,S,I+($?.011:.0075)]),$)for(const N of[-1,1])d(.001,.004,c.metal,e,[E+N*.006,S,I+.009],10);const W=f(P,[E,S,I+.012]);if(V){const N=d(.012,.007,c.face,e,[E,S,I+.004]);N.visible=!1,g(N,{kind:"probe",label:P,action:V,channel:k}),g(e.children[e.children.indexOf(W)-1],{kind:"probe",label:P,action:V,channel:k})}return W}function b(P,E,S,I,B,{radius:$=.011,values:V=kt[E],min:k,max:G,step:W=1,color:N=Ht.dark}={}){const ce=new Kt;ce.position.set(S,I,B),e.add(ce),d($+.003,.0016,c.metal,ce,[0,0,0]);const _e=new Kt;_e.position.z=.003,_e.userData.equipmentMoving=!0,ce.add(_e);const ve=l(N,{roughness:.79}),Je=d($,.016,ve,_e,[0,0,.008],32),pt=[];for(let Q=0;Q<28;Q++){const te=Q/28*Math.PI*2,Le=new _t(5e-4,5e-4,.012,6);Le.rotateX(Math.PI/2),Le.translate(Math.cos(te)*$,Math.sin(te)*$,.008),pt.push(Le)}u(th(pt),ve,_e),pt.forEach(Q=>Q.dispose()),h(.0014,$*.65,7e-4,c.face,_e,[0,$*.49,.0164],15e-5);for(let Q=0;Q<11;Q++){const te=-Math.PI*.75+Q/10*Math.PI*1.5,Le=h(6e-4,Q%5===0?.003:.0018,3e-4,c.dark,ce,[Math.sin(te)*($+.006),Math.cos(te)*($+.006),8e-4],1e-4);Le.rotation.z=-te}const ut=g(Je,{kind:"dial",label:P,parameter:E,values:V,min:k??(V==null?void 0:V[0]),max:G??(V==null?void 0:V.at(-1)),step:W});Je.userData.equipmentTarget=ut,_e.traverse(Q=>{Q.isMesh&&(Q.userData.equipmentTarget=ut)});function mt(Q){const te=V==null?void 0:V.indexOf(Q),Le=V&&te>=0?te/Math.max(1,V.length-1):Number.isFinite(Q)&&Number.isFinite(ut.min)&&Number.isFinite(ut.max)?vn.clamp((Q-ut.min)/(ut.max-ut.min||1),0,1):.5;_e.rotation.z=(.75-Le*1.5)*Math.PI,ut.value=Q}return{descriptor:ut,set:mt,rotor:_e}}function M(P,E,S,I,B,{color:$="#6f7974",width:V=.025,height:k=.012}={}){const G=h(V,k,.007,l($),e,[S,I,B+.004],.002);return g(G,{kind:"button",label:P,action:E}),G}function T(){if(!a){a=!0;for(const P of[...s,...r,...o])P.dispose();e.removeFromParent()}}function C(){var I;const P=new Set(t.map(B=>B.object)),E=new Map;e.updateMatrixWorld(!0);const S=e.matrixWorld.clone().invert();e.traverse(B=>{if(!B.isMesh||P.has(B)||Array.isArray(B.material))return;for(let V=B.parent;V&&V!==e;V=V.parent)if(V.userData.equipmentMoving)return;const $=E.get(B.material)||[];$.push(B),E.set(B.material,$)});for(const[B,$]of E){if($.length<2)continue;const V=$.map(N=>{const ce=N.geometry.index?N.geometry.toNonIndexed():N.geometry.clone();return ce.applyMatrix4(new Gt().multiplyMatrices(S,N.matrixWorld)),ce}),k=th(V);if(V.forEach(N=>N.dispose()),!k)continue;const G=u(k,B),W=(I=$.find(N=>N.userData.equipmentTarget))==null?void 0:I.userData.equipmentTarget;W&&(G.userData.equipmentTarget=W);for(const N of $)N.removeFromParent(),N.geometry.dispose(),s.delete(N.geometry)}}return{group:e,targets:t,anchors:i,m:c,material:l,mesh:u,box:h,cylinder:d,screen:_,text:m,screw:p,enclosure:x,socket:y,dial:b,button:M,anchor:f,target:g,finish:C,dispose:T}}function ox({id:n="multimeter",label:e="DIGITAL MULTIMETER"}={}){const t=Ni(n),{group:i,m:r}=t;t.box(.11,.213,.046,t.material("#b49a49",{roughness:.88}),i,[0,.112,0],.012),t.box(.096,.198,.008,r.dark,i,[0,.112,.024],.008),t.box(.09,.063,.004,r.black,i,[0,.172,.03],.003);const s=t.screen(.084,.057,[0,.172,.0325],{pixels:[840,570]});t.text("MULTIMETER",.084,.01,[0,.209,.029],{background:Ht.dark,color:"#f5f7ef"});const o=t.dial("Meter","meterMode",0,.106,.031,{radius:.02,values:["off","vdc"]});t.text("OFF",.024,.01,[-.027,.078,.031],{background:Ht.dark,color:"#d7d9d1"}),t.text("V⎓",.023,.011,[.028,.078,.031],{background:Ht.dark,color:"#d7d9d1"}),t.socket("COM",-.025,.042,.031,Ht.black),t.socket("V",.025,.042,.031,Ht.red),t.text("COM          V",.085,.011,[0,.023,.031],{background:Ht.dark,color:"#e0e1d8"});const a=t.box(.067,.1,.006,r.dark,i,[0,.055,-.061],.003);a.rotation.x=-.4;for(const c of[-.044,.044])t.box(.014,.044,.006,r.rubber,i,[c,.022,.025],.003);function l(c={}){const u=c.measurement||{},h=c.meterMode||"vdc";o.set(h);const d=u.probeReady?u.probeVoltage:null;s.draw([h,d,c.module],(f,g,_)=>{h!=="off"&&($t(f,c.module==="opamp"?"V SAMPLE":"DC V",28,_*.14,{size:_*.16,width:g-56}),$t(f,d===null?"— —":sn(d,3),g-26,_*.54,{size:_*.55,width:g-52,align:"right",family:"Arial, sans-serif"}),d===null&&$t(f,"CONNECT PROBES",g/2,_*.87,{size:_*.13,width:g-40,align:"center"}))})}return t.finish(),l(),{group:i,targets:t.targets,anchors:t.anchors,update:l,dispose:t.dispose}}function vc(n,e,t){const i={l:100,r:30,t:78,b:138},r=52,s=(e-i.t-i.b-r*(t-1))/t;return Array.from({length:t},(o,a)=>({panel:a,left:i.l/n,top:(i.t+a*(s+r))/e,width:(n-i.l-i.r)/n,height:s/e}))}function ax(n){return`${{"Capacitor voltage":"V","Inductor voltage":"V","Storage current":"I","Stored energy":"E","Calculated load power":"P"}[n.name]||n.name||""} ${sn(n.value,3)} ${n.unit||""}`.trim()}function ld(n,e,t,i,r){var p,x,y;n.fillStyle="#071015",n.fillRect(0,0,e,t);const o=((p=i==null?void 0:i.panels)!=null&&p.length?i.panels:[i]).filter(Boolean).slice(0,3),a=vc(e,t,o.length||1),l=r.recorder?r.recorder==="transient"?r.playing?"ACQUIRING":"PAUSED":"CALCULATED · WIRING":r.scopeRunning===!1?r.scopeStale?"HOLD · OLD SETTINGS":"HOLD":"RUN";n.fillStyle="#f1faf5",$t(n,l,20,29,{size:30,width:e*.56});const c=Number.isFinite(r.timeDiv)?`${sn(r.timeDiv,3)} ms/div`:((i==null?void 0:i.xLabel)||"TIME").replace("Elapsed circuit time","Time").replace("Load resistance","Load");if($t(n,c,e-22,29,{size:30,width:e*.41,align:"right"}),!o.length){$t(n,"CONNECT THE CHANNELS",e/2,t/2,{size:36,width:e-60,align:"center"});return}const u=["#ffe27b","#79e4f6","#dfbfff"];for(let b=0;b<o.length;b++){const M=o[b],T=a[b],C=T.left*e,P=T.top*t,E=T.width*e,S=T.height*t;n.strokeStyle="#344750",n.lineWidth=1.5;const I=M.xDivisions||4,B=M.yDivisions||4;for(let G=0;G<=I;G++)n.beginPath(),n.moveTo(C+E*G/I,P),n.lineTo(C+E*G/I,P+S),n.stroke();for(let G=0;G<=B;G++)n.beginPath(),n.moveTo(C,P+S*G/B),n.lineTo(C+E,P+S*G/B),n.stroke();n.fillStyle="#f1faf5";const $=M.yTicks||[];for(const[G,W]of $.entries())o.length>1&&G!==0&&G!==Math.floor($.length/2)&&G!==$.length-1||$t(n,W.label,C-12,P+(1-W.position)*S,{size:32,width:C-20,align:"right"});for(const[G,W]of(M.xTicks||[]).entries())n.fillStyle=i.interaction==="source"?u[G%u.length]:"#f1faf5",$t(n,W.label,C+W.position*E,P+S+24,{size:31,width:Math.max(150,E/5),align:"center"});const V=r.recorder?M.yLabel:M.title;n.fillStyle=u[b%u.length],$t(n,V||M.yLabel||"",C+12,P-22,{size:31,width:E-24}),n.save(),n.beginPath(),n.rect(C,P,E,S),n.clip();for(const[G,W]of(M.series||[]).entries()){n.strokeStyle=u[o.length>1?b:G%u.length],n.lineWidth=i.interaction==="source"?12:5,n.lineCap="round",n.lineJoin="round",n.beginPath();let N=!1;for(const ce of W.points||[]){if(!Number.isFinite(ce[0])||!Number.isFinite(ce[1])){N=!1;continue}const _e=C+ce[0]*E,ve=P+(1-ce[1])*S;N?n.lineTo(_e,ve):(n.moveTo(_e,ve),N=!0)}n.stroke()}if(!(M.series||[]).some(G=>{var W;return(W=G.points)==null?void 0:W.length})){n.fillStyle="#f5faf4",n.font="700 32px Arial, sans-serif";const G=sx(n,r.scopeError||M.subtitle||"No acquired signal",E-44).slice(0,2);for(const[W,N]of G.entries())$t(n,N,C+E/2,P+S/2+(W-(G.length-1)/2)*38,{size:32,align:"center"})}const k=M.cursor||M.marker;if(k&&Number.isFinite(k.x)){const G=C+vn.clamp(k.x,0,1)*E;n.strokeStyle="#f4fff7",n.lineWidth=3,n.setLineDash([9,7]),n.beginPath(),n.moveTo(G,P),n.lineTo(G,P+S),n.stroke(),n.setLineDash([]),Number.isFinite(k.y)&&(n.fillStyle="#f4fff7",n.beginPath(),n.arc(G,P+(1-k.y)*S,7,0,Math.PI*2),n.fill())}n.restore()}const h=(i==null?void 0:i.cursor)||((x=o.find(b=>b.cursor))==null?void 0:x.cursor),d=(y=h==null?void 0:h.readings)!=null&&y.length?h.readings.map(ax):r.readings||[],f=t-94;n.fillStyle="#172b31",n.fillRect(0,f,e,94),n.fillStyle="#f6fff7";const g=h==null?void 0:h.xLabel,m=(g?[g,d.join("   ·   ")]:d.length>2?[d.slice(0,2).join("   ·   "),d.slice(2).join("   ·   ")]:[...d]).slice(0,2);m.length||m.push(r.scopeError?"CHECK CONNECTIONS":r.recorder?"Select a point to read it":"CONNECT THE CHANNELS"),m.forEach((b,M)=>$t(n,b,22,f+(m.length===1?47:25+M*43),{size:35,width:e-44}))}function lx({id:n="oscilloscope",label:e="OSCILLOSCOPE"}={}){const t=Ni(n),i=t.enclosure(.43,.245,.18);t.text(e,.27,.014,[-.044,.224,i+7e-4],{align:"left",size:45}),t.box(.278,.18,.007,t.m.dark,t.group,[-.066,.127,i+.0015],.004);const r=t.screen(.266,.17,[-.066,.128,i+.0055],{pixels:[1064,680],background:"#071015"}),s=t.target(r.object,{kind:"screen",label:"Scope",action:"scope-screen",bounds:[]}),o=t.dial("Time/div","timeDiv",.108,.182,i,{radius:.014});t.text("TIME / DIV",.074,.011,[.109,.213,i+5e-4]);const a=t.dial("CH1 volts/div","ch1Scale",.099,.104,i,{color:"#807341"}),l=t.dial("CH2 volts/div","ch2Scale",.163,.104,i,{color:"#3f6e7b"});t.text("CH1",.038,.012,[.099,.137,i+6e-4]),t.text("CH2",.038,.012,[.163,.137,i+6e-4]),t.text("VOLTS / DIV",.1,.011,[.13,.077,i+6e-4]);const c=t.dial("Trigger level","triggerLevel",.171,.182,i,{radius:.008});t.text("TRIGGER",.052,.011,[.17,.212,i+6e-4]);const u=t.button("Trigger edge","set:triggerEdge:falling",.171,.148,i,{width:.028}),h=t.screen(.043,.01,[.171,.16,i+7e-4],{pixels:[400,100],background:Ht.face});t.button("Run / Hold","scope-toggle",-.054,.02,i,{width:.03,color:"#5f7567"}),t.text("RUN / HOLD",.066,.008,[-.055,.04,i+5e-4],{size:42}),t.button("Autoscale","scope-autoscale",.014,.02,i,{width:.026}),t.text("AUTO",.042,.008,[.014,.04,i+5e-4],{size:48}),t.socket("CH1",.1,.037,i,Ht.ch1,{bnc:!0,action:"tool:ch1",channel:"ch1"}),t.socket("CH2",.164,.037,i,Ht.ch2,{bnc:!0,action:"tool:ch2",channel:"ch2"});function d(f={}){var p,x,y,b,M;const g=f.parameters||{};o.set(g.timeDiv),a.set(g.ch1Scale),l.set(g.ch2Scale),c.set(g.triggerLevel),u.userData.equipmentTarget.action=`set:triggerEdge:${g.triggerEdge==="falling"?"rising":"falling"}`,h.draw(g.triggerEdge,(T,C,P)=>$t(T,g.triggerEdge==="falling"?"FALL":"RISE",C/2,P/2,{size:P*.85,width:C-16,align:"center"})),s.bounds=vc(r.canvas.width,r.canvas.height,Math.min(3,((x=(p=f.graph)==null?void 0:p.panels)==null?void 0:x.length)||1));const _=(y=f.rawGraph)==null?void 0:y.scope,m=_?{...g,timeDiv:_.timeDiv,ch1Scale:_.channels.ch1.scale,ch2Scale:_.channels.ch2.scale,scopeRunning:_.running,scopeStale:_.stale,scopeError:_.error,readings:[`CH1 ${sn(_.channels.ch1.peak,2)} V pk  ·  CH2 ${sn(_.channels.ch2.peak,2)} V pk`,`TRIGGER ${((b=_.trigger)==null?void 0:b.edge)==="falling"?"↓":"↑"} ${sn((M=_.trigger)==null?void 0:M.level,2)} V`]}:g;r.draw([f.graph,m.timeDiv,m.ch1Scale,m.ch2Scale,m.scopeRunning,m.scopeStale,m.scopeError,m.readings],(T,C,P)=>ld(T,C,P,f.graph,m))}return t.finish(),d(),{group:t.group,targets:t.targets,anchors:t.anchors,screen:r,update:d,dispose:t.dispose}}function ih({id:n="lab-recorder",module:e="thevenin"}={}){const t=Ni(n),i=t.enclosure(.43,.245,.18);t.text("LAB RECORDER",.3,.014,[-.038,.224,i+7e-4],{align:"left"}),t.box(.402,.187,.007,t.m.dark,t.group,[0,.119,i+.0015],.004);const r=t.screen(.391,.177,[0,.119,i+.0055],{pixels:[1280,580],background:"#071015"}),s=t.target(r.object,{kind:"screen",label:"Lab recorder",action:"scope-screen",bounds:[]});let o=0,a={},l=[];if(e==="transient")for(const[h,d]of["VOLTAGE","CURRENT","ENERGY"].entries()){const f=-.135+h*.135,g=t.button(d,`recorder-panel:${h}`,f,.013,i,{width:.11,color:"#47565b"}),_=t.screen(.102,.009,[f,.013,i+.0077],{pixels:[1020,90],background:"#47565b",foreground:"#ffffff"});_.object.userData.equipmentTarget=g.userData.equipmentTarget,l.push({text:_,label:d,index:h})}function c(h={}){var x,y,b;a=h;const d=h.parameters||{},f=h.measurement||{};let g=h.graph;e==="transient"&&((x=g==null?void 0:g.panels)!=null&&x.length)&&(o=Math.min(o,g.panels.length-1),g={...g.panels[o],panels:void 0}),s.bounds=vc(r.canvas.width,r.canvas.height,1).map(M=>({...M,panel:e==="transient"?o:0}));const _=M=>`${M>=0?"+":""}${sn(M,2)}`;let m=[];if(e==="thevenin"&&(m=f.ok?[`${ad(d.load)}  ·  ${sn(f.voltage,3)} V`,`${sn(f.current*1e3,3)} mA  ·  ${sn(f.power*1e3,3)} mW`]:["CONNECT CIRCUIT"]),e==="superposition"){const M=((y=h.rawGraph)==null?void 0:y.bars)||[];m=[M.slice(0,2).map((T,C)=>`${C?"B":"A"} ${Number.isFinite(T.value)?_(T.value):"—"} mA`).join("  ·  "),`BOTH ${Number.isFinite((b=M[2])==null?void 0:b.value)?_(M[2].value):"—"} mA`]}if(e==="transient"){const M=[f.voltage,f.current*1e3,f.energy*1e3],T=["V","mA","mJ"];m=f.ok?[`${sn(d.time*1e3,3)} ms  ·  ${sn(M[o],3)} ${T[o]}`,`${d.charging?"SOURCE":"RETURN"}  ·  ${sn((d.acquiredTime||0)*1e3,3)} ms acquired`]:["CONNECT CIRCUIT"]}for(const M of l)M.text.draw(o===M.index,(T,C,P)=>{T.fillStyle=o===M.index?"#ecf7ec":"#47565b",T.fillRect(0,0,C,P),T.fillStyle=o===M.index?"#14251d":"#ffffff",$t(T,M.label,C/2,P/2,{size:P*.88,width:C-20,align:"center"})});const p={recorder:e,playing:d.playing,readings:m};r.draw([g,p],(M,T,C)=>ld(M,T,C,g,p))}function u(h){return e!=="transient"||!Number.isInteger(h)||h<0||h>2?!1:(o=h,c(a),!0)}return t.finish(),c(),{group:t.group,targets:t.targets,anchors:t.anchors,screen:r,module:e,selectPanel:u,update:c,dispose:t.dispose}}function cx({id:n="power-supply",label:e="DC POWER SUPPLY",parameter:t="equivalentVoltage",fixedValue:i=null,polarity:r=1,positiveTerminal:s="+",negativeTerminal:o="−"}={}){const a=Ni(n),l=a.enclosure(.22,.186,.2);a.text(e,.183,.014,[0,.168,l+5e-4],{size:46}),a.box(.194,.071,.004,a.m.dark,a.group,[0,.124,l],.003);const c=a.screen(.186,.063,[0,.124,l+.0025],{background:"#071612",foreground:"#d8ffe0",pixels:[1116,378]}),u=t==="nortonCurrent",h=i===null?a.dial(u?"Current":"Voltage",t,.059,.059,l,{radius:.014}):null;a.text(i===null?u?"CURRENT":"VOLTAGE":"FIXED",.07,.009,[.057,.083,l+4e-4]),a.socket(o,-.067,.046,l,Ht.black),a.socket(s,-.02,.046,l,Ht.red),a.text("−        +",.09,.011,[-.044,.026,l+5e-4],{size:64});function d(f={}){var b;const g=i??((b=f.parameters)==null?void 0:b[t])??f.value;h==null||h.set(g);const _=f.parameters||{},m=t==="v1"?"a":t==="v2"?"b":null,p=f.module==="superposition"&&m&&_.sourceMode&&_.sourceMode!=="both"&&_.sourceMode!==m,x=p&&_.replacement==="open",y=p?0:Number.isFinite(g)?g*r:g;c.draw([y,t,p,x],(M,T,C)=>{$t(M,x?"OPEN":`${sn(y,2)} ${u?"mA":"V"}`,T/2,C*.43,{size:C*.72,width:T-48,align:"center"}),$t(M,x?"DISCONNECTED":p?"SHORT":t==="rail"?"LINKED RAILS":"OUTPUT",T/2,C*.86,{size:C*.17,width:T-40,align:"center"})})}return a.finish(),d(),{group:a.group,targets:a.targets,anchors:a.anchors,update:d,dispose:a.dispose}}function ux({id:n="generator",label:e="FUNCTION GENERATOR"}={}){const t=Ni(n),i=t.enclosure(.28,.135,.16);t.text(e,.238,.012,[0,.118,i+5e-4],{size:48}),t.box(.167,.086,.004,t.m.dark,t.group,[-.049,.064,i],.003);const r=t.screen(.159,.078,[-.049,.064,i+.0025],{pixels:[954,468],background:"#071612",foreground:"#e5ffe5"}),s=t.dial("Frequency","frequency",.064,.078,i,{radius:.012}),o=t.dial("Amplitude","amplitude",.112,.078,i,{radius:.01});t.text("Hz",.027,.009,[.063,.104,i+7e-4]),t.text("V pk",.032,.009,[.111,.104,i+7e-4]),t.socket("OUT",.082,.028,i,Ht.metal,{bnc:!0}),t.text("SINE OUT",.055,.008,[.082,.011,i+6e-4],{size:45});function a(l={}){const c=l.parameters||{};s.set(c.frequency),o.set(c.amplitude),r.draw([c.frequency,c.amplitude],(u,h,d)=>{$t(u,`${sn(c.frequency,1)} Hz`,h/2,d*.27,{size:d*.35,width:h-44,align:"center"}),$t(u,`${sn(c.amplitude,2)} V pk`,h/2,d*.65,{size:d*.33,width:h-44,align:"center"}),$t(u,"SINE · 0 V OFFSET",h/2,d*.92,{size:d*.1,width:h-40,align:"center"})})}return t.finish(),a(),{group:t.group,targets:t.targets,anchors:t.anchors,update:a,dispose:t.dispose}}function hx({id:n="resistance-box",label:e="RESISTANCE",parameter:t="load",values:i=kt[t]}={}){const r=Ni(n),s=r.enclosure(.18,.14,.11),o=String(e).toLowerCase().replace(/[ₜₕₙ]/g,h=>({"ₜ":"t","ₕ":"h","ₙ":"n"})[h]),a=t==="rf"?"Rf":t==="rin"?"Rin":t==="load"?"RL":t==="equivalentResistance"?/norton|rn|r_n|rₙ/.test(o)?"Rn":"Rth":t==="resistance"?"R":e;r.text(a,.144,.032,[0,.116,s+7e-4]);const l=r.dial(a,t,.052,.059,s,{radius:.023,values:i});r.box(.096,.041,.003,r.m.dark,r.group,[-.03,.067,s],.002);const c=r.screen(.09,.035,[-.03,.067,s+.0017],{pixels:[900,350],background:"#e1ead5"});r.socket("A",-.06,.025,s,Ht.red),r.socket("B",-.014,.025,s,Ht.black);function u(h={}){var f;const d=((f=h.parameters)==null?void 0:f[t])??h.value;l.set(d),c.draw(d,(g,_,m)=>$t(g,ad(d),_/2,m/2,{size:m*.86,width:_-24,align:"center"}))}return r.finish(),u(),{group:r.group,targets:r.targets,anchors:r.anchors,width:.18,height:.14,update:u,dispose:r.dispose}}function dx({id:n="experiment-controls",module:e="thevenin"}={}){const t=Ni(n),i=t.enclosure(.56,.34,.16),r=[],s=[],o=["thevenin","superposition","opamp","transient"],a=5+Math.max(0,o.indexOf(e)),l=t.screen(.49,.03,[0,.315,i+7e-4],{pixels:[1470,90],background:Ht.face});function c(m,p,x,y,b){t.text(m,b,.03,[y,.281,i+7e-4]);const M=t.dial(m,p,y,.235,i,{radius:.023,values:x,min:p==="timeCursor"?0:void 0,max:p==="timeCursor"?1:void 0,step:p==="timeCursor"?.001:1});t.box(b,.04,.003,t.m.dark,t.group,[y,.184,i],.002);const T=t.screen(b-.008,.034,[y,.184,i+.0017],{pixels:[Math.round((b-.008)*5e3),170],background:"#e1ead5"});r.push({...M,parameter:p,display:T,label:m})}function u(m,p,x,y,b,M=.04,T="#354b45"){const C=t.button(m,p,x,y,i,{width:b,height:M,color:T}),P=C.userData.equipmentTarget,E=t.screen(b-.008,M-.008,[x,y,i+.0078],{pixels:[Math.round((b-.008)*5e3),160],background:T,foreground:"#f7fff8"});E.object.userData.equipmentTarget=P;const S={object:C,descriptor:P,display:E,color:T,label:m};return s.push(S),S}e==="thevenin"&&c("Circuit","representation",["original","thevenin","norton"],0,.34),e==="superposition"&&(c("Sources","sourceMode",["a","both","b"],-.14,.23),c("Inactive source","replacement",["short","open"],.14,.23)),e==="opamp"&&c("Amplifier","configuration",["inverting","noninverting"],0,.34);let h,d;e==="transient"&&(c("Circuit","kind",["RC","RL"],-.18,.156),c("Speed","speed",kt.speed,0,.156),c("Time","timeCursor",void 0,.18,.156),h=u("Run","play",-.208,.13,.124,.036),u("Replay","replay",-.069,.13,.124,.036),d=u("Return","switch",.069,.13,.124,.036),u("Reset","reset-energy",.208,.13,.124,.036));const f=u("Build","build",-.18,.077,.156);u("Clear","reset-circuit",0,.077,.156),u("Undo","undo",.18,.077,.156);for(const[m,p]of o.entries())u(`Lab ${5+m}`,`module:${p}`,-.2025+m*.135,.022,.124,.036,p===e?"#e3eee0":"#485658");const g={original:"Original",thevenin:"Thévenin",norton:"Norton",both:"Both",a:"A only",b:"B only",short:"Short",open:"Open",inverting:"Inverting",noninverting:"Non-inverting"};function _(m={}){const p=m.parameters||{},x=m.mode==="build";f.descriptor.action=x?"explore":"build",f.descriptor.label=x?"Explore reference":"Build circuit",f.label=x?"Explore":"Build",l.draw(x,(y,b,M)=>$t(y,`Lab ${a} · ${x?"Build circuit":"Explore"}`,b/2,M/2,{size:M*.88,width:b-24,align:"center"}));for(const y of r){const b=y.parameter==="timeCursor"?p.time:p[y.parameter];y.parameter==="timeCursor"&&(y.descriptor.max=Math.max(0,p.acquiredTime||0),y.descriptor.step=Math.max(1e-6,y.descriptor.max/100)),y.set(b);const M=y.parameter==="timeCursor"?`${sn((b||0)*1e3,3)} ms`:y.parameter==="speed"?`${sn(b,2)}×`:g[b]||String(b||y.label);y.display.draw(M,(T,C,P)=>$t(T,M,C/2,P/2,{size:P*.9,width:C-20,align:"center"}))}h&&(h.label=p.playing?"Pause":"Run",h.descriptor.label=h.label),d&&(d.label=p.charging?"Return":"Source",d.descriptor.label=p.charging?"Switch to return loop":"Switch to source");for(const y of s)y.display.draw(y.label,(b,M,T)=>{b.fillStyle=y.color==="#e3eee0"?"#10251b":"#f7fff8",$t(b,y.label,M/2,T/2,{size:T*.9,width:M-16,align:"center"})})}return t.finish(),_(),{group:t.group,targets:t.targets,anchors:t.anchors,module:e,width:.56,height:.34,update:_,dispose:t.dispose}}function fx({id:n="probe",color:e=Ht.red,channel:t="red",label:i="Probe",action:r=/ground/i.test(t)?`scope-ground:${t.slice(0,3)}`:`tool:${t}`,ground:s=/ground/i.test(t)}={}){if(s)return px({id:n,color:e,channel:t,label:i,action:r});const o=Ni(n),{group:a,m:l}=o,c=o.material(e,{roughness:.76}),u=o.mesh(new _t(.005,.0043,.113,24),c,a,[0,.091,0]);o.mesh(new _t(.0021,.0038,.019,20),c,a,[0,.0255,0]),o.mesh(new _t(75e-5,75e-5,.016,14),l.metal,a,[0,.01,0]),o.mesh(new ac(75e-5,.0025,14),l.metal,a,[0,.00125,0]).rotation.z=Math.PI,o.mesh(new _t(.012,.012,.0027,32),c,a,[0,.036,0]);for(let f=0;f<13;f++)o.mesh(new _t(.0054,.0054,.0015,24),c,a,[0,.048+f*.0064,0]);o.mesh(new _t(.0022,.0045,.024,20),l.rubber,a,[0,.156,0]);for(let f=0;f<5;f++)o.mesh(new _t(.0035-f*25e-5,.0035-f*25e-5,.001,18),l.rubber,a,[0,.149+f*.0035,0]);o.anchor("tip",[0,0,0]),o.anchor("cable",[0,.168,0]);const h=o.target(u,{kind:"probe",id:n,label:i,channel:t,action:r});a.traverse(f=>{f.isMesh&&(f.userData.equipmentTarget=h)});function d(f={}){h.connected=!!f.connected,a.visible=f.visible!==!1}return o.finish(),{group:a,targets:o.targets,anchors:o.anchors,channel:t,length:.168,update:d,dispose:o.dispose}}function px({id:n="ground-clip",color:e=Ht.black,channel:t="ch1Ground",label:i="Ground clip",action:r="scope-ground:ch1"}={}){const s=Ni(n),{group:o,m:a}=s,l=s.material(e,{roughness:.86});s.box(.007,.021,.0016,a.metal,o,[0,.01,-.0022],4e-4);const c=s.box(.007,.022,.0016,a.metal,o,[0,.012,.0022],4e-4);c.rotation.x=-.1;for(let f=0;f<5;f++)s.box(.006,.001,.0014,a.metal,o,[0,.003+f*.003,-.001],1e-4),s.box(.006,.001,.0014,a.metal,o,[0,.003+f*.003,.001],1e-4);const u=s.cylinder(.0034,.009,a.metal,o,[0,.021,0],16);u.rotation.y=Math.PI/2;const h=s.box(.011,.025,.01,l,o,[0,.032,0],.003);s.mesh(new _t(.0017,.0032,.009,16),a.rubber,o,[0,.048,0]),s.anchor("tip",[0,0,0]),s.anchor("cable",[0,.053,0]);const d=s.target(h,{kind:"probe",id:n,label:i,channel:t,action:r});return o.traverse(f=>{f.isMesh&&(f.userData.equipmentTarget=d)}),s.finish(),{group:o,targets:s.targets,anchors:s.anchors,channel:t,length:.053,update(f={}){d.connected=!!f.connected,o.visible=f.visible!==!1},dispose:s.dispose}}function rh({points:n=[[0,0,0],[0,.01,-.03],[.02,.01,-.06]],color:e=Ht.black,radius:t=.0018}={}){const i=new Kt;i.name="insulated-lead";const r=new pc({color:e,roughness:.82,metalness:0});let s=null,o="",a=!1;function l(c){const h=(Array.isArray(c)?c:(c==null?void 0:c.points)||n).map(Hl);if(h.length<2)return;const d=h.map(_=>_.toArray().map(m=>m.toFixed(5)).join(",")).join(";");if(o===d)return;o=d;const f=new uc(h,!1,"centripetal"),g=new Xo(f,48,t,7,!1);s?(s.geometry.dispose(),s.geometry=g):(s=new En(g,r),s.castShadow=!0,s.receiveShadow=!0,i.add(s))}return l(n),{group:i,targets:[],anchors:{},update:l,dispose(){a||(a=!0,s==null||s.geometry.dispose(),r.dispose(),i.removeFromParent())}}}function mx({xrManager:n,navigatorXR:e,isSecureContext:t=!0,visibilityTarget:i=null,onStatus:r=()=>{},onBeforeSession:s=()=>{},onSessionStarted:o=()=>{},onSessionEnded:a=()=>{}}){var V,k;let l=!1,c=!1,u=!1,h=!1,d=null,f=!1,g=!1,_=null,m=0,p={kind:"checking",supported:!1,active:!1,message:"Checking headset…"};const x=()=>typeof e=="function"?e():e,y=()=>typeof t=="function"?t():t;function b(G,W){p={kind:G,supported:l,active:c,message:W},h||r({...p})}function M(G="ended"){if(!d&&!f&&!c)return;const W=d,N=f;d=null,f=!1,c=!1,u=!1,N&&a({session:W,floorReference:g,reason:G}),b(l?"ready":"unavailable",l?"VR ready. Enter the lab to connect leads and take readings.":"Open the lab’s HTTPS link in your headset browser.")}const T=()=>M(h?"disposed":"ended");(V=n.addEventListener)==null||V.call(n,"sessionend",T);const C=()=>{S()},P=()=>{(!(i!=null&&i.visibilityState)||i.visibilityState==="visible")&&S()};(k=i==null?void 0:i.addEventListener)==null||k.call(i,"visibilitychange",P);function E(G){var W,N;G!==_&&((W=_==null?void 0:_.removeEventListener)==null||W.call(_,"devicechange",C),_=G,(N=_==null?void 0:_.addEventListener)==null||N.call(_,"devicechange",C))}async function S(){if(h||u||c)return l;const G=++m,W=x();if(E(W),l=!1,!y())return b("unavailable","VR needs HTTPS. Open the lab’s HTTPS link in your headset browser."),!1;if(!(W!=null&&W.isSessionSupported))return b("unavailable","No headset found here. Open the lab’s HTTPS link in your headset browser."),!1;b("checking","Checking headset…");try{const N=await W.isSessionSupported("immersive-vr");if(h||u||c||G!==m)return l;l=!!N,b(l?"ready":"unavailable",l?"VR ready. Enter the lab to connect leads and take readings.":"No headset found here. Open the lab’s HTTPS link in your headset browser.")}catch(N){!h&&!u&&!c&&G===m&&b("unavailable",`VR support could not be checked: ${(N==null?void 0:N.message)||(N==null?void 0:N.name)||"unknown error"}.`)}return l}async function I(){if(h||u)return!1;if(c)return!0;const G=x();if(E(G),!y()||!(G!=null&&G.requestSession))return b("unavailable",y()?"No headset found here. Open the lab’s HTTPS link in your headset browser.":"VR needs HTTPS. Open the lab’s HTTPS link in your headset browser."),!1;u=!0,m++,b("entering","Accept the headset’s request to enter VR.");let W;try{if(W=await G.requestSession("immersive-vr",{optionalFeatures:["local-floor","bounded-floor"]}),h)return await W.end().catch(()=>{}),!1;d=W,g=!1;try{await W.requestReferenceSpace("local-floor"),g=!0}catch{}return n.setReferenceSpaceType(g?"local-floor":"local"),f=!0,s({session:W,floorReference:g}),await n.setSession(W),h||d!==W?(await W.end().catch(()=>{}),!1):(l=!0,c=!0,u=!1,o({session:W,floorReference:g}),b("active","VR active. Grip probes and dials. Left stick moves; right stick turns. Click a stick to return to the bench."),!0)}catch(N){return W&&await W.end().catch(()=>{}),M("error"),u=!1,b("error",(N==null?void 0:N.name)==="NotAllowedError"?"The VR request was declined. Select Try VR again when you are ready.":`VR could not start: ${(N==null?void 0:N.message)||(N==null?void 0:N.name)||"headset unavailable"}. Check the headset and try again.`),!1}}async function B(){if(!d)return!1;const G=d;try{return await G.end(),d===G&&M(h?"disposed":"ended"),!0}catch(W){return b("error",`VR could not exit: ${(W==null?void 0:W.message)||(W==null?void 0:W.name)||"unknown error"}. Use the headset system menu to exit.`),!1}}async function $(){var G,W,N;h||(h=!0,m++,d&&await B(),f&&M("disposed"),(G=_==null?void 0:_.removeEventListener)==null||G.call(_,"devicechange",C),(W=i==null?void 0:i.removeEventListener)==null||W.call(i,"visibilitychange",P),(N=n.removeEventListener)==null||N.call(n,"sessionend",T))}return S(),{enter:I,exit:B,refreshSupport:S,dispose:$,toggle:()=>c?B():I(),get state(){return{...p}},get active(){return c},get entering(){return u},get supported(){return l}}}function gx(n,e){return{position:n.position.clone(),quaternion:n.quaternion.clone(),scale:n.scale.clone(),near:n.near,far:n.far,fov:n.fov,aspect:n.aspect,zoom:n.zoom,target:e.target.clone(),controlsEnabled:e.enabled}}function vx(n,e,t,i){i&&(t.position.set(0,0,0),t.quaternion.identity(),t.scale.set(1,1,1),n.position.copy(i.position),n.quaternion.copy(i.quaternion),n.scale.copy(i.scale),Object.assign(n,{near:i.near,far:i.far,fov:i.fov,aspect:i.aspect,zoom:i.zoom}),n.updateProjectionMatrix(),e.target.copy(i.target),e.enabled=i.controlsEnabled,e.update(),n.updateMatrixWorld(!0))}function _x(n,e,{floorReference:t=!0,eyeHeight:i=1.6}={}){var u,h;const r=(u=e==null?void 0:e.transform)==null?void 0:u.position,s=(h=e==null?void 0:e.transform)==null?void 0:h.orientation;if(!r||!s||![r.x,r.y,r.z,s.x,s.y,s.z,s.w].every(Number.isFinite))return!1;const o=new Un(s.x,s.y,s.z,s.w).normalize(),a=new D(0,0,-1).applyQuaternion(o),l=Math.hypot(a.x,a.z)>.001?Math.atan2(a.x,-a.z):-new Jn().setFromQuaternion(o,"YXZ").y;n.quaternion.setFromAxisAngle(new D(0,1,0),l);const c=new D(r.x,r.y,r.z).applyQuaternion(n.quaternion);return n.position.set(-c.x,t?0:i-r.y,-c.z),n.updateMatrixWorld(!0),!0}function xx({container:n,onTerminal:e=()=>{},onWire:t=()=>{},onAction:i=()=>{},onPart:r=()=>{},onHover:s=()=>{},onPanelPreviewChange:o=()=>{},onXRStatus:a=()=>{},onFrame:l=()=>{},onChange:c=()=>{},onProbe:u=()=>{},onConnect:h=()=>{},onDisconnect:d=()=>{},onWireMove:f=()=>{},onGraphCursor:g=()=>{},onManipulation:_=()=>{}}){const m=new hp;m.background=new St("#c6c9c9"),m.fog=new rc("#c6c9c9",14,30);const p=new jn(39,1,.05,35),x=new B_({antialias:!0,alpha:!1});x.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),x.setClearColor("#c6c9c9"),x.outputColorSpace=yn,x.toneMapping=Mh,x.toneMappingExposure=1,x.shadowMap.enabled=!0,x.shadowMap.type=bh,x.shadowMap.autoUpdate=!1,x.shadowMap.needsUpdate=!0,x.xr.enabled=!0,x.xr.setFoveation(0),x.domElement.setAttribute("aria-label","Circuit lab. Drag probe tips onto terminals. Drag a terminal to another terminal to connect a lead; pull a plug out to disconnect it. Drag equipment knobs to turn them. Click switches and drag across the scope screen. Drag empty space to look around and scroll to zoom."),x.domElement.style.touchAction="none",n.appendChild(x.domElement);const y=new V_(p,x.domElement);y.enableDamping=!0,y.dampingFactor=.09,y.minDistance=.55,y.maxDistance=12,y.minPolarAngle=.08,y.maxPolarAngle=Math.PI*.47,y.enablePan=!0;const b=new Kt;m.add(b),b.add(p);const M=new D(.8,.883,-.1),T=new Un().setFromEuler(new Jn(-.62,-Math.atan2(.8,.1),0,"YXZ")),C=new D(-1.2,2.9,3.1).normalize(),P=new D(0,.97,-1);let E=0;function S(){if(x.xr.isPresenting)return;b.position.set(0,0,0),p.aspect=Math.max(1,n.clientWidth)/Math.max(1,n.clientHeight),p.updateProjectionMatrix(),y.target.copy(P);let v=4.5;const R=[];for(const U of[-.97,.97])for(const O of[.81,1.16])for(const Z of[-1.62,-.31])R.push(new D(U,O,Z));for(const U of[-.3,.3])for(const O of[0,.35])for(const Z of[-.1,.1])R.push(new D(U,O,Z).applyQuaternion(T).add(M));for(const U of[.55,1.22])for(const O of[-.46,.25])R.push(new D(U,.82,O));for(let U=0;U<7;U++){p.position.copy(y.target).addScaledVector(C,v),p.lookAt(y.target),p.updateMatrixWorld();const O=R.map(Ue=>Ue.clone().project(p)),Z=Math.min(...O.map(Ue=>Ue.x)),Y=Math.max(...O.map(Ue=>Ue.x)),re=Math.min(...O.map(Ue=>Ue.y)),Ae=Math.max(...O.map(Ue=>Ue.y)),Me=Math.max((Y-Z)/1.72,(Ae-re)/1.72),ke=v*Math.tan(vn.degToRad(p.fov/2)),Se=new D().setFromMatrixColumn(p.matrixWorld,0),le=new D().setFromMatrixColumn(p.matrixWorld,1);y.target.addScaledVector(Se,(Z+Y)*.5*ke*p.aspect),y.target.addScaledVector(le,(re+Ae)*.5*ke),v*=Math.max(.78,Math.min(1.3,Me))}p.position.copy(y.target).addScaledVector(C,v),p.lookAt(y.target),E=p.aspect,y.update()}S(),m.add(new Kp("#ffffff","#777b79",1.35));const I=new Su("#fffdf8",2.7);I.position.set(-3,7,3),I.castShadow=!0,I.shadow.mapSize.set(2048,2048),Object.assign(I.shadow.camera,{left:-4,right:4,top:4,bottom:-4,near:.1,far:16}),I.shadow.normalBias=.004,m.add(I);const B=new Su("#eef2f4",.65);B.position.set(4,3,-4),m.add(B);const $={navy:"#2b2c2d",teal:"#414646",brass:"#b59a60",metal:"#b9baba",board:"#246648",copper:"#ad653c"},V=(v,R={})=>new pc({color:v,roughness:.56,metalness:.08,...R}),k={navy:V($.navy),teal:V($.teal),metal:V($.metal,{metalness:.7,roughness:.3}),brass:V($.brass,{metalness:.65,roughness:.3}),copper:V($.copper,{metalness:.65,roughness:.3}),board:V($.board,{roughness:.58}),pale:V("#b9bcb8"),black:V("#171819",{roughness:.72}),resistor:V("#c8b082",{roughness:.74}),trace:V("#3f7952",{roughness:.68}),solder:V("#bfc3c0",{metalness:.82,roughness:.34}),red:V("#922724",{roughness:.67}),mat:V("#353b3d",{roughness:.95}),pcbEdge:V("#73764e",{roughness:.92})},G=new Set(Object.values(k)),W=new Kt;W.position.set(0,.52,-.77),W.scale.setScalar(.36),m.add(W);const N=(v,R,U,O=0,Z=0,Y=0)=>{const re=new En(v,R);return re.position.set(O,Z,Y),re.castShadow=!0,re.receiveShadow=!0,U.add(re),re},ce=(v,R,U,O=.035)=>new jo(v,R,U,3,O);N(ce(3.65,.025,2.32,.018),k.mat,W,0,.843),N(ce(3.32,.022,2.02,.018),k.pcbEdge,W,0,.907),N(ce(3.319,.007,2.019,.018),k.board,W,0,.921);for(const v of[-1.54,1.54])for(const R of[-.89,.89])N(new _t(.024,.024,.055,6),k.brass,W,v,.88,R),N(new _t(.04,.04,.004,24),k.metal,W,v,.929,R),N(new _t(.023,.023,.009,24),k.solder,W,v,.934,R),N(new Zt(.029,.0015,.005),k.black,W,v,.94,R),N(new Zt(.005,.0015,.029),k.black,W,v,.94,R);const _e=N(new Di(80,80),V("#b9bcba",{roughness:.94}),m,0,.815,0);_e.rotation.x=-Math.PI/2,_e.visible=!1,_e.castShadow=!1;const ve=new Kt;ve.visible=!0,m.add(ve);const Je=N(new Di(14,14),V("#a5a8a5",{roughness:.96}),ve,0,-.003,-1.4);Je.rotation.x=-Math.PI/2,Je.castShadow=!1;const pt=N(new Di(10,3.4),V("#d2d3cd",{roughness:.94}),ve,0,1.7,-5.1);pt.castShadow=!1,N(new Zt(10,.1,.025),V("#9c9f9b",{roughness:.84}),ve,0,.05,-5.08);const ut=N(ce(2.12,.04,1.42,.009),V("#a7aaa5",{roughness:.83}),ve,0,.8,-.985);for(const v of[-.91,.91])for(const R of[-1.57,-.4])N(new Zt(.055,.765,.055),V("#858b8c",{metalness:.62,roughness:.43}),ve,v,.3975,R),N(new _t(.04,.04,.027,20),k.black,ve,v,.0135,R);for(const v of[-1.57,-.4])N(new Zt(1.85,.065,.035),k.metal,ve,0,.729,v);for(const v of[-.91,.91])N(new Zt(.035,.065,1.2),k.metal,ve,v,.729,-.985);N(ce(.67,.04,.525,.004),ut.material,ve,.885,.8,-.0125),N(ce(.16,.04,.185,.004),ut.material,ve,1.14,.8,-.3675);for(const v of[-.37,.16])N(new Zt(.045,.765,.045),k.metal,ve,1.16,.3975,v),N(new _t(.034,.034,.027,20),k.black,ve,1.16,.0135,v);N(new Zt(.58,.065,.035),k.metal,ve,.87,.729,.16);const mt=new Kt;mt.position.copy(M),mt.quaternion.copy(T),ve.add(mt),N(ce(.6,.012,.195,.006),k.metal,mt,0,-.01,0);for(const v of[-.23,.23])for(const R of[-.066,.066]){const U=new D(v,-.018,R).applyQuaternion(T).add(M),O=Math.max(.01,U.y-.821);N(new _t(.008,.008,O,16),k.metal,ve,U.x,.821+O/2,U.z),N(new _t(.019,.019,.003,20),k.black,ve,U.x,.822,U.z)}function Q(v,R,U,O){const Z=document.createElement("canvas");Z.width=v,Z.height=R;const Y=Z.getContext("2d"),re=new Ol(Z);re.colorSpace=yn,re.anisotropy=Math.min(x.capabilities.getMaxAnisotropy(),16),re.magFilter=oi,re.minFilter=ji,re.generateMipmaps=!0;const Ae=new Yn({map:re,transparent:!0,side:pi,depthWrite:!1,toneMapped:!1}),Me=new En(new Di(U,O),Ae);return{canvas:Z,context:Y,texture:re,object:Me}}function te(v,R,U,O,Z){const Y=String(R??"");if(v.measureText(Y).width<=Z){v.fillText(Y,U,O);return}let re=Y;for(;re.length&&v.measureText(`${re}…`).width>Z;)re=re.slice(0,-1);v.fillText(`${re}…`,U,O)}function Le(v,R,U,O,Z,Y,re=3){const Ae=String(R??"").split(/\s+/);let Me="",ke=0;for(let Se=0;Se<Ae.length;Se++){const le=Me?`${Me} ${Ae[Se]}`:Ae[Se];if(v.measureText(le).width>Z&&Me){if(v.fillText(Me,U,O+ke*Y),Me=Ae[Se],ke++,ke===re-1)return te(v,Ae.slice(Se).join(" "),U,O+ke*Y,Z),ke+1}else Me=le}return Me&&v.fillText(Me,U,O+ke*Y),ke+1}function $e(v,R="",U=.44,O=.14){const Z=Q(512,160,U,O),Y=(re,Ae)=>{const Me=Z.context;Me.clearRect(0,0,512,160),Me.textAlign="center",Me.fillStyle="#ffffff",Me.font=Ae?"600 72px monospace":"600 104px monospace",te(Me,re,256,Ae?67:113,496),Me.fillStyle="#f0f4ed",Me.font="600 59px monospace",te(Me,Ae,256,142,496),Z.texture.needsUpdate=!0};return Y(v,R),Z.object.rotation.x=-Math.PI/2,{...Z,draw:Y}}const ze=$e("TRAINER PCB","DC / ANALOG",.68,.15);ze.object.position.set(-1.11,.932,-.84),W.add(ze.object);const xt=$e("ELEN 221","PATCH TERMINALS",.45,.13);xt.object.position.set(1.17,.932,-.86),W.add(xt.object);const ot=new Kt,F=new Kt,he=new Kt;W.add(ot,F),m.add(he);const ie=new Map,se=new Map;let oe=[],Ee=[],de=[],we=[];const et=[],Ze=[],L=new Map,w=new Set,j=new Kt;m.add(j);let ee="",ue="vdc",z={components:[],wires:[],actions:[],live:{title:"Circuit bench",lines:[]}},We="",ye="",Ve="",He="",me="",be=null,Qe="",Fe=!1,Re=null,nt="graph",H="",fe=null,Te=0,Ie=!1;function pe(v){v.traverse(R=>{var O,Z;(O=R.geometry)==null||O.dispose();const U=Array.isArray(R.material)?R.material:R.material?[R.material]:[];for(const Y of U)G.has(Y)||((Z=Y.map)==null||Z.dispose(),Y.dispose())}),v.clear()}function ae(v,R,U,O,Z=32){return N(new Xo(new uc(v),Z,R,7,!1),U,O)}function Ge(v,R,U){N(new _t(.027,.027,.003,24),k.copper,v,R,.929,U),N(new _t(.018,.023,.008,24),k.solder,v,R,.934,U),N(new _t(.005,.005,.001,12),k.black,v,R,.939,U)}function at(v,R,U,O,Z,Y,re=0,Ae="#dddcd4"){const Me=Q(512,256,O,Z),ke=Me.context;return ke.fillStyle=Ae,ke.textAlign="center",ke.font="600 76px monospace",te(ke,R,256,112,490),ke.font="48px monospace",te(ke,U,256,190,490),Me.texture.needsUpdate=!0,Me.object.rotation.x=-Math.PI/2,Me.object.position.set(0,Y,re),v.add(Me.object),Me}const It=["#171718","#65432b","#922a25","#bb6726","#d7c24c","#3d6542","#31516d","#725475","#797b79","#dddcd0"];function Tt(v){const R=String(v).match(/([\d.]+)\s*(k|M)?/),U=R?Number(R[1])*(R[2]==="k"?1e3:R[2]==="M"?1e6:1):1e3,O=Math.floor(Math.log10(Math.max(U,.01)))-1,Z=Math.round(U/10**O),Y=O===-1?"#ac9456":O===-2?"#aeb1ae":It[Math.max(0,Math.min(9,O))];return[It[Math.floor(Z/10)],It[Z%10],Y,"#b09a60"]}function gn(v){var R;if(v.type==="ground")return"GND";if(v.type==="C")return"C1";if(v.type==="L")return"L1";if(v.type==="opamp")return"U1";if(v.type==="switch")return"S1";if(v.type==="R"){const U={load:"RL",rin:"Rin",rf:"Rf",r:"R",r1:"R1",r2:"R2"}[v.id];if(U)return U;if(v.id==="req")return((R=z.parameters)==null?void 0:R.representation)==="norton"?"Rn":"Rth"}return String(v.label).replace("DC SOURCE","DC SUPPLY").replace("REFERENCE","GND")}function Gn(v){return z.module==="thevenin"?{load:"load",req:"equivalentResistance"}[v.id]:z.module==="opamp"?{rin:"rin",rf:"rf"}[v.id]:z.module==="transient"&&v.id==="r"?"resistance":null}function Oi(v,R=Ze){for(const O of v.targets)if(O.object.userData.direct=O,O.kind==="dial"){const Z=new En(new Ai(.022,12,8),new Yn({transparent:!0,opacity:0,depthWrite:!1}));Z.userData.direct=O,O.object.add(Z),O.pickSleeve=Z}const U=v.dispose;return v.dispose=()=>{for(const O of v.targets)O.pickSleeve&&(O.pickSleeve.geometry.dispose(),O.pickSleeve.material.dispose(),O.pickSleeve.removeFromParent(),O.pickSleeve=null);U()},R.push(v),v}function ci(v,R,U,O=-.53){return Oi(v,et),v.group.scale.setScalar(1/.36),v.group.rotation.x=O,R.add(v.group),R.updateWorldMatrix(!0,!0),(v.anchors["+"]?[v.anchors["+"],v.anchors["−"]]:v.anchors.A?[v.anchors.A,v.anchors.B]:Object.values(v.anchors).slice(0,2)).forEach(Y=>U.push(R.worldToLocal(Y.getWorldPosition(new D)))),v.anchors.OUT&&U.length===1&&U.push(U[0].clone().add(new D(.007/.36,0,0))),v.update({...z,meterMode:ue}),v}function fs(v){var R;for(const U of et)U.dispose();et.length=0,pe(ot),ie.clear(),se.clear(),oe=[],Ee=[];for(const U of v){const O=new Kt;O.position.set(U.x,.955,U.z),["V","I"].includes(U.type)&&O.position.set(Math.sign(U.x||-1)*2.15,.842,U.z),ot.add(O);const Z=U.pins||[];Z.length===2&&["R","L","C"].includes(U.type)&&(O.rotation.y=-Math.atan2(Z[1].z-Z[0].z,Z[1].x-Z[0].x));const Y=[];let re=()=>{};switch(U.type){case"R":{const Se=Gn(U);if(Se){O.rotation.y=0;const bt=ci(hx({id:U.id,label:gn(U),parameter:Se}),O,Y,-.18);re=()=>bt.update(z);break}const le=[[.014,-.13],[.026,-.115],[.035,-.098],[.034,-.073],[.032,-.045],[.032,.045],[.034,.073],[.035,.098],[.026,.115],[.014,.13]],Ue=N(new fc(le.map(([bt,qe])=>new xe(bt,qe)),32),k.resistor,O,0,.046);Ue.rotation.z=Math.PI/2;const je=[];for(const[bt,qe]of[-.079,-.035,.011,.085].entries()){const st=bt===0||bt===3?.0354:.0328,Be=N(new _t(st,st,.014,32),V(Tt(U.value)[bt],{roughness:.74}),O,qe,.046);Be.rotation.z=Math.PI/2,je.push(Be)}re=bt=>Tt(bt).forEach((qe,st)=>je[st].material.color.set(qe)),Y.push(new D(-.13,.046,0),new D(.13,.046,0));break}case"C":{const Se=document.createElement("canvas");Se.width=768,Se.height=512;const le=Se.getContext("2d");le.fillStyle="#202427",le.fillRect(0,0,768,512),le.fillStyle="#c6c9be",le.fillRect(145,0,110,512),le.fillStyle="#333835",le.font="bold 82px monospace",le.textAlign="center";for(const je of[105,245,385])le.fillText("−",200,je);le.fillStyle="#d2d4c8",le.font="bold 78px monospace",le.fillText("100µF",520,165),le.fillText("25V",520,285),le.font="48px monospace",le.fillText("105°C",520,391);const Ue=new Ol(Se);Ue.colorSpace=yn,N(new _t(.07,.07,.166,48),V("#ffffff",{map:Ue,roughness:.67}),O,0,.094),N(new _t(.064,.064,.008,48),k.metal,O,0,.181),N(new qi(.065,.005,8,48),k.metal,O,0,.184).rotation.x=-Math.PI/2;for(const je of[Math.PI/4,-Math.PI/4]){const bt=N(new Zt(.1,.0015,.003),k.navy,O,0,.186);bt.rotation.y=je}N(new _t(.061,.061,.013,32),k.black,O,0,.007),Y.push(new D(-.03,.003,0),new D(.03,.003,0));break}case"L":{N(new _t(.03,.03,.29,24),k.black,O,0,.06).rotation.z=Math.PI/2;for(const le of[-.145,.145])N(new _t(.058,.058,.015,32),k.black,O,le,.06).rotation.z=Math.PI/2;const Se=[];for(let le=0;le<=560;le++){const Ue=le/560*Math.PI*28;Se.push(new D(-.131+le/560*.262,.06+Math.sin(Ue)*.041,Math.cos(Ue)*.041))}ae(Se,.0077,k.copper,O,560),Y.push(new D(-.151,.052,0),new D(.151,.052,0));break}case"opamp":{const Se=new Yh;Se.moveTo(-.083,-.135),Se.lineTo(-.027,-.135),Se.absarc(0,-.135,.027,Math.PI,0,!0),Se.lineTo(.083,-.135),Se.lineTo(.083,.135),Se.lineTo(-.083,.135),Se.closePath();const le=N(new dc(Se,{depth:.052,bevelEnabled:!0,bevelSegments:2,steps:1,bevelSize:.003,bevelThickness:.003}),k.black,O,0,.079);le.rotation.x=Math.PI/2;for(const je of[-.105,.105])for(const bt of[-.099,-.033,.033,.099]){N(new Zt(.056,.009,.019),k.metal,O,je,.036,bt),N(new Zt(.009,.052,.019),k.metal,O,Math.sign(je)*.133,.01,bt);const qe=new D(Math.sign(je)*.133,-.02,bt).add(O.position);Ge(ot,qe.x,qe.z)}N(new _t(.009,.009,.001,16),V("#85877f"),O,-.052,.084,-.103),at(O,"OP AMP","DIP-8",.115,.143,.084,.024);const Ue={"op+":[-.133,-.016,.033],"op-":[-.133,-.016,-.033],out:[.133,-.016,.033],vp:[.133,-.016,-.033],vn:[-.133,-.016,.099]};Z.forEach(je=>Y.push(new D(...Ue[je.id]||[0,0,0])));break}case"switch":{N(ce(.155,.056,.13,.004),k.black,O,0,.015),N(new Zt(.167,.01,.143),k.metal,O,0,.049),N(new _t(.036,.036,.044,32),k.metal,O,0,.075),N(new _t(.049,.049,.017,6),k.metal,O,0,.074),N(new qi(.037,.003,6,32),k.navy,O,0,.092).rotation.x=-Math.PI/2;const Se=new Kt;Se.position.y=.09,O.add(Se),N(new _t(.011,.013,.125,20),k.metal,Se,0,.06),N(new Ai(.014,20,12),k.metal,Se,0,.123),re=le=>{Se.rotation.x=String(le).toUpperCase().includes("RETURN")?.39:-.39},re(U.value),Y.push(new D(-.046,-.012,-.047),new D(.056,-.012,0),new D(-.046,-.012,.047));for(const le of Y)N(new Zt(.022,.025,.011),k.brass,O,le.x,le.y,le.z);break}case"ground":{Y.push(new D(0,-.021,0));break}default:{let Se="equivalentVoltage",le=null,Ue=1;z.module==="thevenin"?((R=z.parameters)==null?void 0:R.representation)==="original"?le=12:U.type==="I"&&(Se="nortonCurrent"):z.module==="superposition"?(Se=U.id==="a"?"v1":"v2",Ue=U.id==="b"?-1:1):z.module==="opamp"?Se="rail":le=5;const je=U.id==="signal"?ux({id:U.id}):cx({id:U.id,label:gn(U),parameter:Se,fixedValue:le,polarity:Ue});ci(je,O,Y),re=()=>je.update(z);break}}const Ae=$e(gn(U),U.value,.5,.16),ke=Z.length===2&&Math.abs(Z[1].z-Z[0].z)>Math.abs(Z[1].x-Z[0].x)?Math.max(...Z.map(Se=>Se.z))+.22:U.z+(U.type==="switch"?.4:.22);if(Ae.object.position.set(U.x,.933,ke),ot.add(Ae.object),se.set(U.id,{value:U.value,label:U.label,draw:(Se,le)=>Ae.draw(gn(U),le),body:O,type:U.type,updateHardware:re}),U.type!=="ground"){const Se=["V","I"].includes(U.type)?[.46,.19,.34]:U.type==="C"?[.18,.23,.18]:U.type==="L"?[.35,.15,.17]:U.type==="opamp"?[.3,.12,.32]:U.type==="switch"?[.2,.23,.21]:[.3,.11,.12],le=new Zt(...Se),Ue=N(le,new Yn({transparent:!0,opacity:0,depthWrite:!1}),O,0,Se[1]/2-.025,0);Ue.castShadow=!1,Ue.receiveShadow=!1,Ue.userData={kind:"part",id:U.id,label:`${gn(U)} · ${U.value}`,type:U.type},U.type==="switch"&&(Ue.userData.direct={object:Ue,kind:"switch",id:U.id,label:"Source / Return",action:"switch"});const je=new mp(new gp(le),new Oo({color:"#cfb862",transparent:!0,opacity:.85}));je.position.copy(Ue.position),je.visible=!1,O.add(je),se.get(U.id).outline=je,se.get(U.id).hit=Ue,Ee.push(Ue)}for(const[Se,le]of Z.entries()){const je=(Y[Se]||new D(0,0,0)).clone().applyAxisAngle(new D(0,1,0),O.rotation.y).add(O.position),bt=new D(le.x-je.x,0,le.z-je.z).normalize(),qe=je.clone().addScaledVector(bt,["R","L"].includes(U.type)?.052:.014);if(qe.y=.938,["V","I"].includes(U.type)){const Mt=new D(le.x,.995,le.z),Xt=je.clone().lerp(Mt,.5);Xt.y=Math.max(.95,Xt.y),ae([je,je.clone().lerp(Xt,.3),Xt,Mt],.008,Se===0?k.red:k.black,ot,24)}else if(U.type!=="ground"){je.distanceTo(qe)>.006&&ae([je,je.clone().lerp(qe,.55).add(new D(0,.006,0)),qe],.006,k.metal,ot,14),Ge(ot,qe.x,qe.z);const Mt=new D(le.x,.929,le.z),Xt=qe.clone().lerp(Mt,.5);Xt.y=.929,ae([new D(qe.x,.929,qe.z),Xt,Mt],.007,k.trace,ot,12)}const st=["V","I","C"].includes(U.type)&&Se===0||le.label==="5 V"||le.label==="V+";N(new _t(.044,.044,.006,6),k.metal,ot,le.x,.934,le.z),N(new _t(.037,.041,.017,32),st?k.red:k.black,ot,le.x,.946,le.z),N(new _t(.032,.032,.028,32),st?k.red:k.black,ot,le.x,.968,le.z);for(const Mt of[.956,.964,.972])N(new qi(.032,.0018,5,32),st?k.red:k.navy,ot,le.x,Mt,le.z).rotation.x=-Math.PI/2;N(new qi(.018,.004,8,32),k.metal,ot,le.x,.984,le.z).rotation.x=-Math.PI/2,N(new _t(.014,.014,.005,24),k.black,ot,le.x,.982,le.z);const Be=N(new qi(.054,.0035,6,32),V("#ece6bd",{roughness:.6}),ot,le.x,.928,le.z);Be.rotation.x=-Math.PI/2,Be.visible=!1;const yt=N(new Ai(.068,12,8),new Yn({transparent:!0,opacity:0,depthWrite:!1}),ot,le.x,.984,le.z);yt.castShadow=!1,yt.receiveShadow=!1,yt.userData={kind:"terminal",id:le.id,label:`${gn(U)} ${le.label||le.id}`},yt.userData.direct={object:yt,kind:"terminal",id:le.id,terminal:le.id,label:yt.userData.label},oe.push(yt),ie.set(le.id,{x:le.x,z:le.z,ring:Be,hit:yt,red:st,label:yt.userData.label});const Qt=$e(le.label||le.id,"",.15,.063);Qt.object.position.set(le.x,.932,le.z+.086),ot.add(Qt.object)}}}function $s(v,R){const Ae=ht=>({x:Math.max(0,Math.min(79,Math.round((ht.x- -1.58)/.04))),z:Math.max(0,Math.min(46,Math.round((ht.z- -.92)/.04)))}),Me=Ae(v),ke=Ae(R),Se=(ht,tn)=>tn*80+ht,le=Se(Me.x,Me.z),Ue=Se(ke.x,ke.z),je=z.components.filter(ht=>ht.type!=="ground").map(ht=>{var Oe;let tn=.1,nn=.1;if(["V","I"].includes(ht.type))tn=.265,nn=.195;else if(ht.type==="R"||ht.type==="L"){const rt=((Oe=ht.pins)==null?void 0:Oe.length)===2&&Math.abs(ht.pins[1].z-ht.pins[0].z)>Math.abs(ht.pins[1].x-ht.pins[0].x);tn=rt?.085:.19,nn=rt?.19:.085}else ht.type==="opamp"?(tn=.16,nn=.18):ht.type==="switch"&&(tn=.12,nn=.1);return{cx:ht.x,cz:ht.z,x:tn,z:nn}}),bt=(ht,tn)=>{const nn=Se(ht,tn);if(nn===le||nn===Ue)return!1;const Oe=-1.58+ht*.04,rt=-.92+tn*.04;return je.some(lt=>Math.abs(Oe-lt.cx)<lt.x&&Math.abs(rt-lt.cz)<lt.z)},qe=[le],st=new Map([[le,0]]),Be=new Map,yt=new Set,Qt=ht=>Math.hypot(ht%80-ke.x,Math.floor(ht/80)-ke.z);for(let ht=0;qe.length&&ht<3760;ht++){let tn=0;for(let lt=1;lt<qe.length;lt++)st.get(qe[lt])+Qt(qe[lt])<st.get(qe[tn])+Qt(qe[tn])&&(tn=lt);const nn=qe.splice(tn,1)[0];if(nn===Ue)break;yt.add(nn);const Oe=nn%80,rt=Math.floor(nn/80);for(const[lt,Wt]of[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){const $n=Oe+lt,Ar=rt+Wt;if($n<0||$n>=80||Ar<0||Ar>=47||bt($n,Ar)||lt&&Wt&&(bt(Oe+lt,rt)||bt(Oe,rt+Wt)))continue;const ui=Se($n,Ar),Oc=st.get(nn)+(lt&&Wt?Math.SQRT2:1);yt.has(ui)||st.has(ui)&&st.get(ui)<=Oc||(st.set(ui,Oc),Be.set(ui,nn),qe.includes(ui)||qe.push(ui))}}if(!Be.has(Ue))return[v.clone(),v.clone().lerp(R,.5),R.clone()];const Mt=[];let Xt=Ue;for(;Xt!==le;)Mt.push(new D(-1.58+Xt%80*.04,.953,-.92+Math.floor(Xt/80)*.04)),Xt=Be.get(Xt);Mt.push(new D(v.x,.953,v.z)),Mt.reverse();const en=[Mt[0]];for(let ht=1;ht<Mt.length-1;ht++){const tn=Mt[ht].clone().sub(Mt[ht-1]).normalize(),nn=Mt[ht+1].clone().sub(Mt[ht]).normalize();tn.distanceTo(nn)>.1&&en.push(Mt[ht])}if(en.push(Mt.at(-1)),en[0]=v.clone(),en[en.length-1]=R.clone(),en.length===2){const ht=v.clone().lerp(R,.5);ht.y=.953,en.splice(1,0,ht)}return en}function qs(v){pe(F),de=[],we=[],v.forEach(([R,U],O)=>{const Z=ie.get(R),Y=ie.get(U);if(!Z||!Y)return;const re=R==="gnd"||U==="gnd"||R.endsWith("-")||U.endsWith("-")||R==="return"||U==="return",Ae=V(re?"#202121":"#8b2925",{roughness:.79}),Me=new D(Z.x,1.002,Z.z),ke=new D(Y.x,1.002,Y.z),Se=$s(Me,ke);for(let je=1;je<Se.length-1;je++)Se[je].y=.948+O%3*.004;const le=ae(Se,.009,Ae,F,Math.max(32,Se.length*6));le.userData={kind:"wire",index:O};const Ue=ae(Se,.019,new Yn({transparent:!0,opacity:0,depthWrite:!1}),F,Math.max(32,Se.length*6));Ue.castShadow=!1,Ue.receiveShadow=!1,Ue.userData={kind:"wire",index:O,id:String(O),label:`${Z.label} → ${Y.label}`,wire:le,color:Ae.color.getHex()},de.push(Ue);for(const[je,bt]of[Me,ke].entries()){const qe=N(new _t(.023,.026,.055,24),Ae,F,bt.x,1.012,bt.z),st=N(new Ai(.037,12,8),new Yn({transparent:!0,opacity:0,depthWrite:!1}),F,bt.x,1.03,bt.z),Be={object:st,kind:"plug",id:`wire:${O}:${je}`,resource:`wire:${[R,U].sort().join("|")}`,wireIndex:O,wirePair:[R,U],endpoint:je,terminal:je?U:R,from:je?R:U,label:`Pull ${je?Y.label:Z.label} plug`,color:Ae.color.getHex()};qe.userData.direct=Be,st.userData.direct=Be,we.push(st,qe);for(const yt of[.988,.996,1.004])N(new qi(.023,.0018,6,24),Ae,F,bt.x,yt,bt.z).rotation.x=-Math.PI/2}})}function _i(){return W.updateWorldMatrix(!0,!1),[...ie].map(([v,R])=>({id:v,position:W.localToWorld(new D(R.x,1.002,R.z))}))}function Fi(v){var R;return((R=_i().find(U=>U.id===v))==null?void 0:R.position)||null}function Mr(v){var U,O,Z;if(v==="red"||v==="black")return((U=z.probes)==null?void 0:U[v])||null;const R=v.slice(0,3);return((Z=(O=z.scope)==null?void 0:O[R])==null?void 0:Z[v.endsWith("Ground")?"ground":"signal"])||null}const xi=Oi(ox());xi.group.position.set(-.68,.823,-1.4),xi.group.rotation.x=-.56,j.add(xi.group);let on=Oi(ih({module:"thevenin"}));on.group.position.set(.45,.823,-1.42),on.group.rotation.x=-.32,j.add(on.group);let Bn=null;const Ko=[["red","#b52e2b","Meter V",-.52],["black","#252829","Meter COM",-.35],["ch1","#d5b348","CH1",.1],["ch2","#64a5b5","CH2",.26],["ch1Ground","#a68e42","CH1 ground",.41],["ch2Ground","#477d8c","CH2 ground",.53]];for(const[v,R,U,O]of Ko){const Z=fx({id:`probe:${v}`,channel:v,color:R,label:U}),Y=new D(O,.831,-.345);Z.group.position.copy(Y),Z.group.rotation.x=-Math.PI/2;const re=new En(new oc(.014,/Ground/.test(v)?.024:.12,4,8),new Yn({transparent:!0,opacity:0,depthWrite:!1}));re.position.y=/Ground/.test(v)?.027:.087,re.userData.direct=Z.targets[0],Z.group.add(re),Z.targets[0].object=re,Z.targets[0].resource=`probe:${v}`;const Ae=rh({color:R,radius:.0019});m.add(Z.group,Ae.group),L.set(v,{unit:Z,pick:re,cable:Ae,home:Y,connected:void 0,channel:v,color:R,loose:!1})}function Jo(v=!1){for(const U of[...w])![...it.holds.values()].some(Z=>Z.lead===U)&&U.originalPair&&z.wires.some(Z=>Z.includes(U.originalPair[0])&&Z.includes(U.originalPair[1]))&&Qn(U);const R=z.module||"thevenin";if(R!==ee){if(R.split(":")[0]!==ee.split(":")[0]){const U=Ze.indexOf(on);U>=0&&Ze.splice(U,1),on.dispose(),on=Oi(z.module==="opamp"?lx():ih({module:z.module||"thevenin"})),on.group.position.set(.45,.823,-1.42),on.group.rotation.x=-.32,j.add(on.group)}ee=R,Bn==null||Bn.dispose(),Bn=dx({module:z.module||"thevenin"}),Oi(Bn,[]),Bn.group.position.copy(M),Bn.group.quaternion.copy(T),j.add(Bn.group)}for(const U of[...Ze,...et,Bn].filter(Boolean))U.update({...z,meterMode:ue});for(const U of L.values()){const O=!U.channel.startsWith("ch")||z.module==="opamp";if(U.unit.group.visible=U.cable.group.visible=O,it.isHeld(`probe:${U.channel}`))continue;const Z=Mr(U.channel);if(Z!==U.connected||v){U.connected=Z;const Y=Fi(Z);Y?(U.unit.group.position.copy(Y),U.unit.group.rotation.set(-.24,0,U.channel.includes("2")?-.28:.28),U.loose=!1):U.loose||(U.unit.group.position.copy(U.home),U.unit.group.rotation.set(-Math.PI/2,0,0))}}Sr()}function Xs(v,R,U=0){const O=[v.clone()];for(const Z of[.16,.34,.56,.78,.91]){const Y=v.clone().lerp(R,Z),re=Math.abs(Y.x)<.603&&Y.z>-1.14&&Y.z<-.39;Y.y=Math.max(re?.87:.828,Y.y-Math.sin(Math.PI*Z)*.11),Y.x+=Math.sin(Math.PI*Z)*U,O.push(Y)}return O.push(R.clone()),O}function Sr(){for(const v of L.values()){if(!v.unit.group.visible)continue;const R=v.channel,U=R==="red"?xi.anchors.V:R==="black"?xi.anchors.COM:on.anchors[R.startsWith("ch1")?"CH1":"CH2"],O=U==null?void 0:U.getWorldPosition(new D),Z=v.unit.anchors.cable.getWorldPosition(new D);O&&v.cable.update(Xs(O,Z,R==="black"?-.08:.04))}for(const v of w){const R=Fi(v.from);if(!R){v.cable.group.visible=v.plug.visible=!1;continue}v.cable.update(Xs(R,v.plug.position))}}const Er=new un;Er.setAttribute("position",new Kn(new Float32Array(48),3));const A=new Nl(Er,new Zp({color:"#e9df9a",dashSize:.035,gapSize:.025,depthTest:!1}));A.visible=!1,A.renderOrder=8,W.add(A);let X=null;const K=new Ri(new D(0,1,0),-.88072);function J(){for(const[R,U]of ie){const O=R===z.selectedTerminal,Z=(be==null?void 0:be.kind)==="terminal"&&be.id===R;U.ring.visible=O||Z,U.ring.material.color.set(O?"#f4d973":"#e6eef5"),U.ring.scale.setScalar(O?1.27:1.12)}for(const[R,U]of se)U.outline&&(U.outline.visible=z.selectedPart===R||(be==null?void 0:be.kind)==="part"&&be.id===R);for(const R of de){const U=R.userData;U.wire.material.color.set((be==null?void 0:be.kind)==="wire"&&be.id===String(U.index)&&z.tool==="remove"?"#d57937":U.color)}const v=ie.get(z.selectedTerminal);if(A.visible=!!v&&(z.tool||"wire")==="wire",v){const R=(be==null?void 0:be.kind)==="terminal"?ie.get(be.id):null,U=R?new D(R.x,1.013,R.z):X?W.worldToLocal(X.clone()):new D(v.x+.16,1.013,v.z+.16);U.y=Math.max(.988,Math.min(1.1,U.y));const O=new D(v.x,1.013,v.z),Z=O.clone().lerp(U,.5);Z.y+=.075;const Y=new hc(O,Z,U),re=Er.attributes.position;for(let Ae=0;Ae<16;Ae++){const Me=Y.getPoint(Ae/15);re.setXYZ(Ae,Me.x,Me.y,Me.z)}re.needsUpdate=!0,Er.computeBoundingSphere(),A.computeLineDistances()}}const q=new Kt;q.visible=!1,m.add(q);function ge(v,R,U,O,Z=0){const Y=new Kt;Y.position.set(R,U,O),Y.rotation.y=Z,q.add(Y);const re=N(ce(v.object.geometry.parameters.width+.045,v.object.geometry.parameters.height+.045,.042,.02),k.navy,Y,0,0,-.026);return re.castShadow=!1,re.receiveShadow=!1,v.object.castShadow=!1,v.object.receiveShadow=!1,Y.add(v.object),Y}const Ce=Q(1024,1200,.9,1.055),Ne=Q(840,1280,.68,1.036),De=Q(1600,1008,1.62,1.02),Ke=ge(Ce,-1.26,1.63,-1.07,.85),tt=ge(Ne,1.24,1.62,-1.02,-.88),Xe=ge(De,0,1.72,-1.8),gt=[],Rt=[];let Pt=0;const Ut={object:De.object,kind:"screen",id:"large-graph",label:"Graph cursor",bounds:[]};function Ot(v,R,U){const{context:O,canvas:Z}=v;return O.fillStyle="#eff0ed",O.fillRect(0,0,Z.width,Z.height),O.fillStyle="#495a66",O.font="600 30px Arial, sans-serif",O.fillText(R,48,57),O.fillStyle="#193743",O.font="600 52px Arial, sans-serif",te(O,U,48,119,Z.width-96),O}function Ye(){const v=Ot(Ce,"LAB GUIDE","Experiments");gt.length=0;const R=(Y,re,Ae,Me,ke,Se)=>{v.fillStyle="#fff",v.fillRect(Y,re,Ae,Me),v.strokeStyle="#a0aaa8",v.strokeRect(Y,re,Ae,Me),v.fillStyle="#273b42",v.font="600 40px Arial",v.textAlign="center",te(v,ke,Y+Ae/2,re+Me/2+10,Ae-20),v.textAlign="left",gt.push({x:Y,y:re,w:Ae,h:Me,action:Se})};(z.actions||[]).filter(Y=>String(Y.group).toLowerCase()==="labs").forEach((Y,re)=>R(42,148+re*78,940,65,Y.label,()=>i(Y.id))),(z.actions||[]).filter(Y=>String(Y.group).toLowerCase()==="guide"||["undo","check-wiring"].includes(Y.id)).slice(0,4).forEach((Y,re)=>R(42+re%2*478,480+Math.floor(re/2)*77,462,64,Y.label,()=>i(Y.id))),v.fillStyle="#273b42",v.font="40px Arial",(x.xr.isPresenting?["Grip: pick up probes and plugs.","Release at a terminal to connect.","Trigger: turn knobs or use switches.","Left stick: move. Right stick: turn.","Stick click: recenter at the bench."]:["Drag probes onto terminals.","Drag between terminals to wire.","Pull a plug out to disconnect it.","Drag knobs. Click switches.","Drag empty space to look around."]).forEach((Y,re)=>v.fillText(Y,48,692+re*55)),R(42,1010,458,64,"Recenter",()=>ca()),R(520,1010,462,64,x.xr.isPresenting?"Exit VR":"Close guide",()=>x.xr.isPresenting?void js.exit():na(!1)),Ce.texture.needsUpdate=!0}Ce.object.userData={kind:"panel",activate:v=>{var O;const R=v.uv.x*Ce.canvas.width,U=(1-v.uv.y)*Ce.canvas.height;(O=gt.find(Z=>R>=Z.x&&R<=Z.x+Z.w&&U>=Z.y&&U<=Z.y+Z.h))==null||O.action()}};function zt(v){if(!Number.isFinite(Number(v))||v===null||v==="")return String(v??"—");const R=Number(v);return R!==0&&(Math.abs(R)>=1e5||Math.abs(R)<1e-4)?R.toExponential(2):Number(R.toPrecision(4)).toString()}function wt(){var re,Ae,Me;const v=Ne.context,R=Ne.canvas.width;v.fillStyle="#f9faf6",v.fillRect(0,0,R,1280),v.textAlign="left",v.textBaseline="alphabetic",v.fillStyle="#14211f",v.font="700 62px Arial",v.fillText("Live readings",48,88),v.fillStyle="#45524e",v.font="38px Arial";const U={thevenin:"Load circuit",superposition:"Selected sources",opamp:"Amplifier",transient:`${((re=z.parameters)==null?void 0:re.kind)||"RC"} circuit`};v.fillText(U[z.module]||"Circuit bench",48,139);const O=(z.metrics||[]).slice(0,3),Z={Voltmeter:"Meter voltage","Voltage sample":"Voltage at input peak","Linear gain":"Gain"};O.forEach((ke,Se)=>{const le=180+Se*271;v.strokeStyle="#bdc8c2",v.lineWidth=2,v.beginPath(),v.moveTo(48,le-16),v.lineTo(R-48,le-16),v.stroke(),v.fillStyle="#34433e",v.font="600 47px Arial",te(v,Z[ke.label]||ke.label,48,le+42,R-96);const Ue=zt(ke.value),je=ke.unit||"";v.fillStyle="#101c18",v.font="700 142px Arial";const bt=R-206;let qe=142;for(;v.measureText(Ue).width>bt&&qe>86;)qe-=4,v.font=`700 ${qe}px Arial`;v.fillText(Ue,48,le+185);const st=v.measureText(Ue).width;v.font="600 54px Arial",v.fillText(je,Math.min(R-151,48+st+22),le+182),v.fillStyle="#4b5852",v.font="34px Arial";const Be=ke.label==="Voltmeter"||ke.label==="Voltage sample"?ke.value==="—"?ke.detail||"Place both probes":"V tip − COM tip":ke.label==="Branch current"||ke.label==="Storage current"?"Current: top → ground":ke.label==="Load power"?"From load voltage × current":ke.label==="Linear gain"?"Output / input, before clipping":"";te(v,Be,48,le+238,R-96)});const Y=z.measurement||{};Y.ok===!1?(v.fillStyle="#f4e6d6",v.fillRect(28,1012,R-56,236),v.fillStyle="#6b341b",v.font="700 43px Arial",v.fillText("Check connections",48,1066),v.font="37px Arial",Le(v,Y.error||"Complete the circuit to take a reading.",48,1121,R-96,47,3)):z.module==="transient"?(v.fillStyle="#243b32",v.font="600 44px Arial",v.fillText((Ae=z.parameters)!=null&&Ae.playing?"Running":"Paused",48,1076),v.font="700 75px Arial",v.fillText(`${zt((((Me=z.parameters)==null?void 0:Me.time)||0)*1e3)} ms`,48,1172,R-96),v.font="34px Arial",v.fillText("Elapsed circuit time",48,1226)):z.module==="opamp"&&Y.clipped?(v.fillStyle="#f4e6d6",v.fillRect(28,1035,R-56,128),v.fillStyle="#6b341b",v.font="700 48px Arial",v.fillText("Output is clipping",48,1117)):(v.fillStyle="#46564c",v.font="37px Arial",v.fillText("Readings follow the circuit.",48,1096)),Ne.texture.needsUpdate=!0}Ne.object.userData={kind:"panel",activate:()=>!0};function wn(v,R){return{voltage:"Voltage",current:"Current",energy:"Energy",ch1:"CH1",ch2:"CH2"}[v.id]||v.title||`Graph ${R+1}`}function Tn(){var ht,tn,nn;const v=De.context,R=1600,U=1008,O=z.graph||{},Z=(ht=O.panels)!=null&&ht.length?O.panels:[O];Pt=Math.max(0,Math.min(Pt,Z.length-1));const Y=Z[Pt]||O;v.fillStyle="#fafbf8",v.fillRect(0,0,R,U),v.textAlign="left",v.textBaseline="alphabetic",Rt.length=0,v.fillStyle="#172720",v.font="700 53px Arial";const re=nt==="schematic"?"Circuit schematic":{thevenin:"Load power",superposition:"Source contributions",opamp:"Oscilloscope",transient:`${((tn=z.parameters)==null?void 0:tn.kind)||"RC"} response`}[z.module]||"Circuit graph";v.fillText(re,48,89);const Ae=(Oe,rt,lt,Wt,$n,Ar,ui=!1)=>{v.fillStyle=ui?"#263e34":"#e4ebe5",v.fillRect(Oe,rt,lt,Wt),v.fillStyle=ui?"#fff":"#22392c",v.font="600 39px Arial",v.textAlign="center",te(v,$n,Oe+lt/2,rt+Wt/2+14,lt-24),v.textAlign="left",Rt.push({x:Oe,y:rt,w:lt,h:Wt,action:Ar})};if(Ae(1110,35,180,68,"Graph",()=>{nt="graph",Tn()},nt==="graph"),Ae(1310,35,242,68,"Schematic",()=>{nt="schematic",Tn()},nt==="schematic"),nt==="schematic"){if(Ut.bounds=[],fe){const Oe={x:30,y:135,w:1540,h:840},rt=Math.min(Oe.w/fe.width,Oe.h/fe.height),lt=fe.width*rt,Wt=fe.height*rt;v.drawImage(fe,Oe.x+(Oe.w-lt)/2,Oe.y+(Oe.h-Wt)/2,lt,Wt)}else v.fillStyle="#44564a",v.font="46px Arial",v.fillText("Circuit reference is loading.",48,246);De.texture.needsUpdate=!0;return}if(Z.length>1){const Oe=(1504-14*(Z.length-1))/Z.length;Z.forEach((rt,lt)=>Ae(48+lt*(Oe+14),141,Oe,70,wn(rt,lt),()=>{var Wt;Pt=lt,(Wt=on.selectPanel)==null||Wt.call(on,lt),Tn()},lt===Pt))}else v.fillStyle="#43544a",v.font="39px Arial",te(v,O.subtitle||"Current circuit values",48,185,R-96);const Me=182,ke=1534,Se=280,le=720,Ue=Oe=>Me+Oe*(ke-Me),je=Oe=>le-Oe*(le-Se);Ut.bounds=[{left:Me/R,top:Se/U,width:(ke-Me)/R,height:(le-Se)/U,panel:Pt}],v.fillStyle="#263b2e",v.font="600 43px Arial",te(v,Y.yLabel||"Response",Me,256,ke-Me);const bt=Y.xDivisions||O.xDivisions||4,qe=Y.yDivisions||O.yDivisions||4;v.strokeStyle="#c9d3cc",v.lineWidth=1.8;for(let Oe=0;Oe<=bt;Oe++){const rt=Ue(Oe/bt);v.beginPath(),v.moveTo(rt,Se),v.lineTo(rt,le),v.stroke()}for(let Oe=0;Oe<=qe;Oe++){const rt=je(Oe/qe);v.beginPath(),v.moveTo(Me,rt),v.lineTo(ke,rt),v.stroke()}v.strokeStyle="#607166",v.lineWidth=2.5,v.strokeRect(Me,Se,ke-Me,le-Se),v.save(),v.beginPath(),v.rect(Me-3,Se-3,ke-Me+6,le-Se+6),v.clip();const st=Y.series||[];for(const Oe of st){v.strokeStyle=Oe.color||"#147587",v.lineWidth=6,v.lineJoin="round",v.lineCap="round",v.beginPath();let rt=!1;for(const[lt,Wt]of Oe.points||[]){if(!Number.isFinite(lt)||!Number.isFinite(Wt)){rt=!1;continue}rt?v.lineTo(Ue(lt),je(Wt)):v.moveTo(Ue(lt),je(Wt)),rt=!0}v.stroke(),((nn=Oe.points)==null?void 0:nn.length)===1&&(v.beginPath(),v.arc(Ue(Oe.points[0][0]),je(Oe.points[0][1]),6,0,Math.PI*2),v.fillStyle=Oe.color||"#147587",v.fill())}if(Y.reference&&Number.isFinite(Y.reference.x)){const Oe=Ue(Y.reference.x);v.strokeStyle="#805528",v.lineWidth=3,v.setLineDash([12,9]),v.beginPath(),v.moveTo(Oe,Se),v.lineTo(Oe,le),v.stroke(),v.setLineDash([]),v.fillStyle="#654117",v.font="600 37px Arial",v.fillText(Y.reference.label||"",Math.max(Me+10,Math.min(Oe+14,ke-105)),Se+47)}const Be=Y.cursor||O.cursor;if(Be&&Number.isFinite(Be.x)){const Oe=Ue(Be.x);v.strokeStyle="#263e34",v.lineWidth=3,v.setLineDash([8,7]),v.beginPath(),v.moveTo(Oe,Se),v.lineTo(Oe,le),v.stroke(),v.setLineDash([])}Y.marker&&Number.isFinite(Y.marker.x)&&Number.isFinite(Y.marker.y)&&(v.beginPath(),v.arc(Ue(Y.marker.x),je(Y.marker.y),9,0,Math.PI*2),v.fillStyle="#fff",v.fill(),v.lineWidth=5,v.strokeStyle="#83432b",v.stroke()),v.restore(),v.fillStyle="#283d31",v.font="600 40px Arial";const yt=Oe=>{const rt=(Oe||[]).filter(Wt=>Number.isFinite(Wt.position));if(rt.length<=3)return rt;const lt=rt.reduce((Wt,$n)=>Math.abs($n.position-.5)<Math.abs(Wt.position-.5)?$n:Wt,rt[0]);return[...new Set([rt[0],lt,rt.at(-1)])]},Qt=yt(Y.xTicks);v.textAlign="center",Qt.forEach((Oe,rt)=>{Qt.length>6&&rt!==0&&rt!==Qt.length-1&&rt%2||te(v,String(Oe.label),Ue(Oe.position),772,Math.min(260,(ke-Me)/Math.max(3,Qt.length-1)))}),v.textAlign="right";const Mt=yt(Y.yTicks);Mt.forEach((Oe,rt)=>{Mt.length>5&&rt!==0&&rt!==Mt.length-1&&rt%2||te(v,String(Oe.label),Me-20,je(Oe.position)+13,149)}),v.textAlign="center",v.font="600 42px Arial",te(v,Y.xLabel||O.xLabel||"Time",(Me+ke)/2,827,ke-Me),v.textAlign="left",v.fillStyle="#e5ede6",v.fillRect(30,862,1540,120);const Xt=new Set(st.map(Oe=>Oe.name).filter(Boolean)),en=((Be==null?void 0:Be.readings)||[]).filter(Oe=>!Xt.size||Xt.has(Oe.name));if(Be&&(Be.xLabel||en.length)){const Oe=[{label:"Cursor",value:Be.xLabel||"—"},...en.map(lt=>({label:lt.name,value:`${zt(lt.value)} ${lt.unit||""}`}))],rt=1500/Math.max(1,Oe.length);Oe.forEach((lt,Wt)=>{const $n=50+Wt*rt;v.fillStyle="#3f5447",v.font="32px Arial",te(v,lt.label,$n,904,rt-22),v.fillStyle="#13271b",v.font="700 53px Arial",te(v,lt.value,$n,963,rt-22)})}else{v.fillStyle="#2b4234",v.font="600 43px Arial";const Oe=!st.some(rt=>{var lt;return(lt=rt.points)==null?void 0:lt.length});te(v,Oe?Y.subtitle||O.subtitle||"Connect the circuit to acquire a trace.":"Point at the graph and hold the trigger to inspect a reading.",52,936,1496)}De.texture.needsUpdate=!0}De.object.userData={kind:"panel",direct:Ut,activate:v=>{const R=v.uv.x*1600,U=(1-v.uv.y)*1008,O=Rt.find(Y=>R>=Y.x&&R<=Y.x+Y.w&&U>=Y.y&&U<=Y.y+Y.h);if(O)return O.action(),!0;const Z=Ut.bounds[0];return nt!=="graph"||!Z||R<Z.left*1600||R>(Z.left+Z.width)*1600||U<Z.top*1008||U>(Z.top+Z.height)*1008}};function An(v,R){var Ae;const U=rh({color:v.color||"#862926",radius:.0038}),O=new Kt;N(new _t(.009,.011,.038,20),V(v.color||"#862926"),O,0,.015,0),N(new _t(.003,.003,.013,16),k.metal,O,0,-.009,0);const Z=N(new Ai(.023,12,8),new Yn({transparent:!0,opacity:0,depthWrite:!1}),O,0,.013,0);O.position.copy(R);const Y={from:v.from||v.terminal,cable:U,plug:O,originalPair:((Ae=v.wirePair)==null?void 0:Ae.slice())||null},re={object:Z,kind:"plug",id:`loose:${Math.random().toString(36).slice(2)}`,from:Y.from,label:"Grab loose plug",lead:Y,color:v.color};return Z.userData.direct=re,Y.target=re,m.add(O,U.group),w.add(Y),Y}function Qn(v){v&&(w.delete(v),v.cable.dispose(),pe(v.plug),v.plug.removeFromParent())}const it=tx({getModel:()=>{var v;return{...z,parameters:{...z.parameters,meterMode:ue,timeCursor:(v=z.parameters)==null?void 0:v.time}}},getTerminals:_i,onProbe:u,onConnect:h,onDisconnect:d,onGraphCursor:g,onChange:(v,R)=>{var U;v==="meterMode"?(ue=R,xi.update({...z,meterMode:ue}),c(v,R)):v==="timeCursor"?i(`scrub:${Math.min(R,((U=z.parameters)==null?void 0:U.acquiredTime)||0)*1e3}`):c(v,R)},onAction:v=>{var R;if(String(v).startsWith("recorder-panel:")){const U=Number(String(v).split(":")[1]);Number.isInteger(U)&&U>=0&&((R=on.selectPanel)==null||R.call(on,U),Pt=U,Tn())}else i(v)},onHold:(v,R,U)=>{var Z,Y;const O=R.target;if(v==="start")if(["probe","plug","terminal"].includes(O.kind)&&_("begin",R),O.kind==="probe"){const re=L.get(O.channel);re&&(re.loose=!0,R.probe=re,R.position=re.unit.group.position.clone())}else(O.kind==="terminal"||O.kind==="plug")&&(R.lead=O.lead||An(O,R.position||Fi(O.terminal)));if(v==="move"&&(R.probe&&R.position&&(R.probe.unit.group.position.copy(R.position),R.quaternion?R.probe.unit.group.quaternion.copy(R.quaternion):R.probe.unit.group.rotation.set(-.25,0,.18)),R.lead&&R.position&&R.lead.plug.position.copy(R.position),x.shadowMap.needsUpdate=!0),v==="end"){if(R.probe){const re=R.probe;re.connected=U.terminal;const Ae=Fi(U.terminal);Ae?(re.unit.group.position.copy(Ae),re.unit.group.rotation.set(-.24,0,.25),re.loose=!1):(re.unit.group.position.set(vn.clamp(((Z=R.position)==null?void 0:Z.x)??re.home.x,-.88,.88),.87,vn.clamp(((Y=R.position)==null?void 0:Y.z)??re.home.z,-1.2,-.34)),re.unit.group.rotation.set(-Math.PI/2,0,0),re.loose=!0)}R.lead&&(U.kind==="connected"||U.kind==="cancelled"||O.kind==="terminal"?Qn(R.lead):(R.lead.plug.position.y=.87,R.lead.plug.position.x=vn.clamp(R.lead.plug.position.x,-.58,.58),R.lead.plug.position.z=vn.clamp(R.lead.plug.position.z,-1.1,-.41))),["probe","plug","terminal"].includes(O.kind)&&_("end",R),x.shadowMap.needsUpdate=!0}}});function Rn(v){var Ae,Me,ke,Se,le,Ue,je,bt;v.module&&v.module!==z.module&&(Pt=0),(Ae=v.live)!=null&&Ae.title&&(v.live.title,(Me=z.live)==null||Me.title),v.selectedPart&&(v.selectedPart,z.selectedPart),z={...z,...v};const R=JSON.stringify(z.components.map(({value:qe,...st})=>st));let U=!1;if(R!==We){We=R,it.cancelAll();for(const qe of[...w])Qn(qe);fs(z.components),U=!0,x.shadowMap.needsUpdate=!0}for(const qe of z.components){const st=se.get(qe.id);st&&st.value!==qe.value&&(st.draw(qe.label,qe.value),st.value=qe.value,(ke=st.updateHardware)==null||ke.call(st,qe.value),st.hit&&(st.hit.userData.label=`${gn(qe)} · ${qe.value}`),x.shadowMap.needsUpdate=!0)}const O=JSON.stringify(z.wires);(U||O!==ye)&&(ye=O,qs(z.wires),x.shadowMap.needsUpdate=!0),J(),Jo(U);const Z=JSON.stringify([z.module,z.metrics,(Se=z.measurement)==null?void 0:Se.ok,(le=z.measurement)==null?void 0:le.error,(Ue=z.measurement)==null?void 0:Ue.clipped,(je=z.parameters)==null?void 0:je.time,(bt=z.parameters)==null?void 0:bt.playing]);Z!==Ve&&(Ve=Z,wt());const Y=JSON.stringify([z.actions,z.tool,z.selectedTerminal,z.selectedPart,z.partActions]);Y!==He&&(He=Y,Ye());const re=JSON.stringify(z.graph);if(re!==me&&(me=re,Tn()),z.schematicDataURL!==void 0&&z.schematicDataURL!==H){H=z.schematicDataURL,fe=null;const qe=++Te;if(/^data:image\/(svg\+xml|png|jpeg|webp)[;,]/.test(H||"")){const st=new Image;st.onload=()=>{!Ie&&qe===Te&&(fe=st,Tn())},st.onerror=()=>{!Ie&&qe===Te&&Tn()},st.src=H}Tn()}}const Jt=new tm,fn=new xe;let Lt=null;function wr(v){for(let R=v;R;R=R.parent)if(!R.visible)return!1;return!0}function Wn(v){for(let R=v;R;R=R.parent){const U=R.userData.direct||R.userData.equipmentTarget;if(U)return U}return null}function yc(){const v=[...Ze,...et,Bn].filter(Boolean).map(O=>O.group),R=[...L.values()].map(O=>O.unit.group),U=[...w].map(O=>O.plug);return[...oe,...Ee,...de,...we,...v,...R,...U,...q.visible?[Ce.object,Ne.object,De.object]:[]]}function Ys(){const v=Jt.intersectObjects(yc(),!0).filter(O=>wr(O.object)&&(Wn(O.object)||O.object.userData.kind));for(const O of v)O.direct=Wn(O.object);const R=v[0];return v.find(O=>{var Z;return["probe","plug","dial","button","screen","switch"].includes((Z=O.direct)==null?void 0:Z.kind)&&O.distance<((R==null?void 0:R.distance)??1/0)+.065})||R}function nr(v,R=null){var Y;const U=(v==null?void 0:v.direct)||(v==null?void 0:v.object.userData),O=U&&["terminal","part","wire","probe","plug","dial","button","switch","screen"].includes(U.kind)?{kind:U.kind,id:U.id??String(U.index),label:U.label||U.id}:null,Z=JSON.stringify([O,z.tool,z.selectedTerminal]);be=O,X=((Y=v==null?void 0:v.point)==null?void 0:Y.clone())||(R==null?void 0:R.clone())||null,Z!==Qe&&(Qe=Z,s(x.xr.isPresenting?null:O)),J()}function Qo(v){const R=x.domElement.getBoundingClientRect();fn.set((v.clientX-R.left)/R.width*2-1,-(v.clientY-R.top)/R.height*2+1),Jt.setFromCamera(fn,p)}function ea(v,R){if(!(v!=null&&v.uv))return{};const U=v.uv.x,O=1-v.uv.y,Z=R.bounds||[];let Y=Z.find(re=>O>=re.top&&O<=re.top+re.height);return Y||(Y=Z[0]||{left:0,width:1,panel:0}),{fraction:vn.clamp((U-Y.left)/Y.width,0,1),panelIndex:Y.panel||0}}function ta(){return Jt.ray.intersectPlane(K,new D)}function Mc(v,R,U={}){var Y,re,Ae;if(!R||R.object.userData.kind==="panel"&&R.object.userData.activate(R)!==!1)return!1;const O=R.direct||Wn(R.object);if(!O||O.kind==="probe"&&!((Y=L.get(O.channel))!=null&&Y.unit.group.visible))return!1;O.kind==="dial"&&(O.resource=`parameter:${O.parameter}`),O.kind==="plug"&&O.wirePair&&(O.wireIndex=z.wires.findIndex(Me=>Me.includes(O.wirePair[0])&&Me.includes(O.wirePair[1]))),O.parameter==="timeCursor"&&(O.max=((re=z.parameters)==null?void 0:re.acquiredTime)||0,O.min=0,O.step=Math.max(O.max/100,1e-6));const Z=O.kind==="probe"?(Ae=L.get(O.channel))==null?void 0:Ae.unit.group.position:O.kind==="terminal"?Fi(O.terminal):R.point;return it.begin(v,O,{position:Z,...ea(R,O),...U})}function Sc(v){if(v.button!==0||x.xr.isPresenting)return;it.release("mouse"),Qo(v);const R=Ys();Lt={x:v.clientX,y:v.clientY,lastX:v.clientX,lastY:v.clientY,time:performance.now(),hit:R},(R!=null&&R.direct||(R==null?void 0:R.object.userData.kind)==="panel")&&(y.enabled=!1,x.domElement.setPointerCapture(v.pointerId),Mc("mouse",R),v.stopImmediatePropagation(),v.preventDefault())}function Ec(v){var O,Z;if(x.xr.isPresenting)return;Qo(v);const R=it.hold("mouse"),U=Ys();if(R){const Y={position:ta()};if(R.target.kind==="dial"&&(Y.turn=(v.clientX-Lt.lastX-(v.clientY-Lt.lastY))*.024),R.target.kind==="screen"){const Me=Jt.intersectObject(R.target.object,!0)[0];Object.assign(Y,ea(Me,R.target))}it.move("mouse",Y),Lt&&(Lt.lastX=v.clientX,Lt.lastY=v.clientY);const re=["probe","terminal","plug"].includes(R.target.kind)?Vl(R.position,_i(),.055):null,Ae=re?{object:ie.get(re.id).hit,direct:ie.get(re.id).hit.userData.direct,point:re.position}:U;nr(Ae,Y.position),Sr()}else Lt||(x.domElement.style.cursor=((O=U==null?void 0:U.direct)==null?void 0:O.kind)==="dial"?"ns-resize":((Z=U==null?void 0:U.direct)==null?void 0:Z.kind)==="screen"?"crosshair":"grab",nr(U,ta()))}function wc(v){var R;if(!Lt){it.release("mouse");return}Qo(v),it.hold("mouse")?it.end("mouse",{position:ta()}):Math.hypot(v.clientX-Lt.x,v.clientY-Lt.y)<5&&((R=Lt.hit)==null?void 0:R.object.userData.kind)==="part"&&r(Lt.hit.object.userData.id),Lt=null,it.release("mouse"),y.enabled=!0,x.domElement.hasPointerCapture(v.pointerId)&&x.domElement.releasePointerCapture(v.pointerId),Sr()}function Tc(){it.hold("mouse")&&it.block("mouse"),Lt=null,y.enabled=!x.xr.isPresenting,nr(null)}const Ac=()=>{Lt||nr(null)};x.domElement.addEventListener("pointerdown",Sc,!0),x.domElement.addEventListener("pointermove",Ec),x.domElement.addEventListener("pointerup",wc),x.domElement.addEventListener("pointercancel",Tc),x.domElement.addEventListener("pointerleave",Ac);function Rc(){q.updateWorldMatrix(!0,!0);const v=new cs().setFromObject(q),R=v.getCenter(new D),U=[];for(const Y of[v.min.x,v.max.x])for(const re of[v.min.y,v.max.y])for(const Ae of[v.min.z,v.max.z])U.push(new D(Y,re,Ae));const O=new D(0,.12,1).normalize();let Z=4;for(let Y=0;Y<9;Y++){p.position.copy(R).addScaledVector(O,Z),p.lookAt(R),p.updateMatrixWorld();const re=U.map(Ue=>Ue.clone().project(p)),Ae=Math.min(...re.map(Ue=>Ue.x)),Me=Math.max(...re.map(Ue=>Ue.x)),ke=Math.min(...re.map(Ue=>Ue.y)),Se=Math.max(...re.map(Ue=>Ue.y)),le=Z*Math.tan(vn.degToRad(p.fov/2));R.addScaledVector(new D().setFromMatrixColumn(p.matrixWorld,0),(Ae+Me)*.5*le*p.aspect),R.addScaledVector(new D().setFromMatrixColumn(p.matrixWorld,1),(ke+Se)*.5*le),Z=Math.max(y.minDistance,Z*Math.max(.75,Math.min(1.35,Math.max((Me-Ae)/1.78,(Se-ke)/1.78))))}y.target.copy(R),p.position.copy(R).addScaledVector(O,Z),p.lookAt(R),y.update()}function na(v){if(x.xr.isPresenting||Ie)return;v=!!v;const R=v!==Fe;v&&!Fe&&(Re={position:p.position.clone(),quaternion:p.quaternion.clone(),target:y.target.clone()}),Fe=v,q.visible=v,x.shadowMap.needsUpdate=!0,v?(la(1.6),Rc()):Re&&(p.position.copy(Re.position),p.quaternion.copy(Re.quaternion),y.target.copy(Re.target),y.update(),Re=null),nr(null),Ye(),R&&o(v)}const Tr=[],Cc=new Gt,Pc=rx({obstacles:[{minX:-1.07,maxX:1.07,minZ:-1.7,maxZ:-.27},{minX:.55,maxX:1.22,minZ:-.46,maxZ:.25}],bounds:{minX:-3.1,maxX:3.1,minZ:-4.6,maxZ:2.4}});let ei=!1,ia=0,Cn=null;function bi(){it.cancelAll(),Pc.reset(),Lt=null;for(const v of Tr)v.armed=!1,v.lastQuaternion=null,v.stickPressed=!1;y.enabled=!x.xr.isPresenting}function ps(){ei=document.visibilityState==="hidden"||!!(Cn!=null&&Cn.visibilityState)&&Cn.visibilityState!=="visible",bi()}const Lc=()=>{x.xr.isPresenting||(ei=!0,bi())},Dc=()=>{x.xr.isPresenting||(ei=!1,bi())};window.addEventListener("blur",Lc),window.addEventListener("focus",Dc),document.addEventListener("visibilitychange",ps);function ra(v){v.controller.updateWorldMatrix(!0,!1),Cc.extractRotation(v.controller.matrixWorld),Jt.ray.origin.setFromMatrixPosition(v.controller.matrixWorld),Jt.ray.direction.set(0,0,-1).applyMatrix4(Cc)}function sa(v,R){var Me;const U=v.grip.getWorldQuaternion(new Un),O=v.grip.getWorldPosition(new D),Z=new D(0,0,-1).applyQuaternion(U),Y=O.addScaledVector(Z,((Me=R==null?void 0:R.probe)==null?void 0:Me.unit.length)||.08),re=U.clone().multiply(new Un().setFromAxisAngle(new D(1,0,0),Math.PI/2)),Ae={position:Y,quaternion:re};if((R==null?void 0:R.target.kind)==="dial"){const ke=new D(...R.target.axis==="y"?[0,1,0]:R.target.axis==="x"?[1,0,0]:[0,0,1]).applyQuaternion(R.target.object.getWorldQuaternion(new Un));Ae.turn=v.lastQuaternion?-ex(U.clone().multiply(v.lastQuaternion.clone().invert()),ke):0}return(R==null?void 0:R.target.kind)==="screen"&&(ra(v),Object.assign(Ae,ea(Jt.intersectObject(R.target.object,!0)[0],R.target))),v.lastQuaternion=U,Ae}function Ic(v,R){if(!v.armed||ei||!x.xr.isPresenting||it.hold(v.id))return;ra(v);let U=Ys();if(R==="grip"){const O=v.grip.getWorldPosition(new D),Z=yc().flatMap(Y=>{const re=[];return Y.traverse(Ae=>{const Me=Wn(Ae);Me&&["probe","plug","dial","terminal","button","switch"].includes(Me.kind)&&wr(Ae)&&re.push({node:Ae,target:Me,point:Ae.getWorldPosition(new D)})}),re}).sort((Y,re)=>Y.point.distanceTo(O)-re.point.distanceTo(O));if(!Z.length||Z[0].point.distanceTo(O)>.12)return;U={object:Z[0].node,direct:Z[0].target,point:Z[0].point}}if(v.button=R,v.lastQuaternion=v.grip.getWorldQuaternion(new Un),Mc(v.id,U)){const O=it.hold(v.id);O&&["probe","plug","terminal"].includes(O.target.kind)&&it.move(v.id,sa(v,O))}}function Uc(v,R){if(v.button===R){const U=it.hold(v.id);U&&it.end(v.id,sa(v,U)),v.button=null,v.lastQuaternion=null}it.release(v.id)}for(let v=0;v<2;v++){const R=x.xr.getController(v),U=x.xr.getControllerGrip(v),O=new Nl(new un().setFromPoints([new D,new D(0,0,-1)]),new Oo({color:"#bbc8c8",transparent:!0,opacity:.55}));R.add(O),O.scale.z=2;const Z=new En(new Ai(.007,12,8),new Yn({color:"#d7c98b",depthTest:!1}));Z.visible=!1,m.add(Z);const Y={id:`controller:${v}`,controller:R,grip:U,ray:O,cursor:Z,source:null,armed:!1,button:null,stickPressed:!1,lastQuaternion:null};R.addEventListener("connected",Ae=>{Y.source=Ae.data,Y.armed=!1,R.visible=!0}),R.addEventListener("disconnected",()=>{it.block(Y.id),Y.source=null,Y.armed=!1,R.visible=!1,Z.visible=!1}),R.addEventListener("selectstart",()=>Ic(Y,"trigger")),R.addEventListener("selectend",()=>Uc(Y,"trigger")),R.addEventListener("squeezestart",()=>Ic(Y,"grip")),R.addEventListener("squeezeend",()=>Uc(Y,"grip"));const re=N(ce(.037,.075,.045,.013),k.navy,U,0,-.017,.015);re.rotation.x=-.35,N(new Ai(.022,12,8),k.teal,U,0,.019,-.012),b.add(R,U),Tr.push(Y)}let oa=null,ms=!1,aa=!0;function la(v){const R=new D(0,v,0);Xe.position.set(0,Math.max(1.66,v+.12),-1.8),tt.position.set(1.24,Math.max(1.61,v-.01),-1.02),Ke.position.set(-1.26,Math.max(1.63,v+.01),-1.07),Xe.lookAt(R),tt.lookAt(R),Ke.lookAt(R)}function ca(){return x.xr.isPresenting?(bi(),ms=!0,!0):!1}const js=mx({xrManager:x.xr,navigatorXR:()=>navigator.xr,isSecureContext:()=>window.isSecureContext,visibilityTarget:document,onStatus:a,onBeforeSession:({floorReference:v})=>{bi(),oa=gx(p,y),aa=v,y.enabled=!1,b.position.set(0,v?0:1.6,0),b.quaternion.identity(),p.position.set(0,0,0),p.quaternion.identity()},onSessionStarted:({session:v})=>{Cn=v,ei=!1,Cn==null||Cn.addEventListener("visibilitychange",ps),bi(),_e.visible=!1,ve.visible=!0,q.visible=!0,s(null),ms=!0,x.shadowMap.needsUpdate=!0,Ye()},onSessionEnded:()=>{bi(),Cn==null||Cn.removeEventListener("visibilitychange",ps),Cn=null,ei=!1,ms=!1,_e.visible=!1,ve.visible=!0,q.visible=Fe,vx(p,y,b,oa),oa=null;for(const v of Tr)v.cursor.visible=!1,v.stickPressed=!1;nr(null),la(1.6),x.shadowMap.needsUpdate=!0,ua(),Ye()}});function gd(){return Ie?Promise.resolve(!1):(Fe&&na(!1),js.toggle())}function vd(){return js.refreshSupport()}function ua(){if(x.xr.isPresenting||Ie)return;const v=Math.max(1,n.clientWidth),R=Math.max(1,n.clientHeight);p.aspect=v/R,p.updateProjectionMatrix(),x.setSize(v,R,!1),Fe?Rc():(!E||Math.abs(p.aspect/E-1)>.12)&&S()}const Nc=new ResizeObserver(ua);Nc.observe(n),ua(),Rn(z),x.setAnimationLoop(v=>{var R,U,O,Z,Y,re,Ae,Me;if(!Ie&&(l(v),!Ie)){if(x.xr.isPresenting){if(ms){const Be=x.xr.getFrame(),yt=x.xr.getReferenceSpace(),Qt=Be&&yt?Be.getViewerPose(yt):null;Qt&&_x(b,Qt,{floorReference:aa,eyeHeight:1.6})&&(la(aa?Qt.transform.position.y:1.6),ms=!1)}const ke=x.xr.getCamera(),Se=ke.getWorldPosition(new D),le=ke.getWorldQuaternion(new Un),Ue=(U=(R=Tr.find(Be=>{var yt;return((yt=Be.source)==null?void 0:yt.handedness)==="left"}))==null?void 0:R.source)==null?void 0:U.gamepad,je=(Z=(O=Tr.find(Be=>{var yt;return((yt=Be.source)==null?void 0:yt.handedness)==="right"}))==null?void 0:O.source)==null?void 0:Z.gamepad,bt=Be=>{var yt,Qt,Mt;return((yt=Be==null?void 0:Be.axes)==null?void 0:yt.length)>=4?[Be.axes[2],Be.axes[3]]:[((Qt=Be==null?void 0:Be.axes)==null?void 0:Qt[0])||0,((Mt=Be==null?void 0:Be.axes)==null?void 0:Mt[1])||0]};Pc.update({rig:b,headPosition:Se,headQuaternion:le,left:bt(Ue),right:bt(je)[0],dt:ia?(v-ia)/1e3:0,enabled:!ei});let qe=null,st=null;for(const Be of Tr){const yt=(Y=Be.source)==null?void 0:Y.gamepad;!ei&&!Be.armed&&yt&&!((re=yt.buttons[0])!=null&&re.pressed)&&!((Ae=yt.buttons[1])!=null&&Ae.pressed)&&(Be.armed=!0,it.release(Be.id));const Qt=Be.armed&&!!((Me=yt==null?void 0:yt.buttons[3])!=null&&Me.pressed);Qt&&!Be.stickPressed&&ca(),Be.stickPressed=Qt,ra(Be);const Mt=!ei&&Be.controller.visible?Ys():null;Be.ray.visible=!ei,Be.ray.scale.z=Mt?Mt.distance:2;const Xt=it.hold(Be.id);Xt&&!ei&&it.move(Be.id,sa(Be,Xt));const en=Xt&&["probe","terminal","plug"].includes(Xt.target.kind)?Vl(Xt.position,_i(),.055):null;Be.cursor.visible=!!Mt||!!en,en?(Be.cursor.position.copy(en.position),Be.cursor.material.color.set("#88c39e")):Mt&&(Be.cursor.position.copy(Mt.point),Be.cursor.material.color.set("#d7c98b")),en?(qe={object:ie.get(en.id).hit,direct:ie.get(en.id).hit.userData.direct,point:en.position},st=en.position):Mt&&!qe&&(qe=Mt,st=Mt.point)}nr(qe,st)}else y.update();ia=v,Sr(),x.render(m,p)}});function _d(){bi(),Ie=!0,Cn==null||Cn.removeEventListener("visibilitychange",ps),window.removeEventListener("blur",Lc),window.removeEventListener("focus",Dc),document.removeEventListener("visibilitychange",ps),js.dispose(),x.setAnimationLoop(null),Nc.disconnect(),y.dispose(),x.domElement.removeEventListener("pointerdown",Sc,!0),x.domElement.removeEventListener("pointermove",Ec),x.domElement.removeEventListener("pointerup",wc),x.domElement.removeEventListener("pointercancel",Tc),x.domElement.removeEventListener("pointerleave",Ac);for(const v of L.values())v.pick.geometry.dispose(),v.pick.material.dispose(),v.unit.dispose(),v.cable.dispose();for(const v of w)Qn(v);for(const v of[...Ze,...et,Bn].filter(Boolean))v.dispose();pe(m);for(const v of G)v.dispose();x.dispose(),x.domElement.remove()}function xd(){bi();for(const v of[...w])Qn(v)}return{cancelInteractions:xd,update:Rn,enterVR:gd,refreshVRSupport:vd,recenterVR:ca,resetView:S,setPanelPreview:na,dispose:_d,renderer:x}}const zo="#182630",$i=n=>String(n).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),On=n=>Number.isFinite(Number(n))?Number(Number(n).toPrecision(6)).toLocaleString("en-US",{maximumFractionDigits:6}):"—",sh=n=>Math.abs(n)>=1e3?`${On(n/1e3)} kΩ`:`${On(n)} Ω`,bx=n=>n>=.001?`${On(n*1e3)} mF`:n>=1e-6?`${On(n*1e6)} μF`:`${On(n*1e9)} nF`,yx=n=>n>=1?`${On(n)} H`:`${On(n*1e3)} mH`;function Mx(){const n=[],e=(h,d="")=>n.push(`<path d="${h.map(([f,g],_)=>`${_?"L":"M"} ${f} ${g}`).join(" ")}" ${d}/>`),t=(h,d,f,g)=>e([[h,d],[f,g]]),i=(h,d,f,g="middle",_=18)=>n.push(`<text x="${h}" y="${d}" text-anchor="${g}" font-size="${_}">${$i(f)}</text>`),r=(h,d)=>n.push(`<circle cx="${h}" cy="${d}" r="4" fill="${zo}" stroke="none"/>`),s=(h,d)=>n.push(`<circle cx="${h}" cy="${d}" r="4" fill="white"/>`),o=(h,d,f)=>n.push(`<circle data-pin="${$i(h)}" cx="${d}" cy="${f}" r="7" fill="transparent" stroke="none"><title>${$i(h)}</title></circle>`);return{elements:n,path:e,line:t,text:i,dot:r,contact:s,pins:h=>Object.entries(h).forEach(([d,[f,g]])=>o(d,f,g)),pin:o,ground:(h,d)=>{n.push('<g data-symbol="ground">'),t(h,d,h,d+12),t(h-15,d+12,h+15,d+12),t(h-10,d+18,h+10,d+18),t(h-4,d+24,h+4,d+24),n.push("</g>")},resistor:(h,d,f,g,_,m,p)=>{n.push(`<g data-component="${$i(h)}" data-symbol="resistor">`);const x=d===g,y=x?(f+_)/2:(d+g)/2,b=x?[[d,f],[d,y-35]]:[[d,f],[y-35,f]];for(let M=0;M<7;M+=1){const T=y-30+M*10,C=M%2?-8:8;b.push(x?[d+C,T]:[T,f+C])}b.push(x?[d,y+35]:[y+35,f]),b.push([g,_]),e(b),x?(i(d+24,y-8,m,"start"),i(d+24,y+18,sh(p),"start",16)):(i(y,f-24,m),i(y,f+30,sh(p),"middle",16)),n.push("</g>")},source:({id:h,x:d,y:f,top:g,bottom:_,name:m,value:p,polarity:x=1,kind:y="voltage",state:b="active",labelSide:M=-1,frequency:T})=>{n.push(`<g data-component="${$i(h)}" data-symbol="${$i(y)}-source" data-source-state="${$i(b)}" data-polarity="${x}">`);const C=d+M*56;b==="short"?(t(d,g,d,_),i(C,f-7,m),i(C,f+18,"0 V","middle",16)):b==="open"?(t(d,g,d,f-15),t(d,f+15,d,_),s(d,f-15),s(d,f+15),i(C,f-7,m),i(C,f+18,"open","middle",16)):(t(d,g,d,f-28),t(d,f+28,d,_),n.push(`<circle cx="${d}" cy="${f}" r="28" fill="white"/>`),y==="current"?(t(d,f+15,d,f-14),n.push(`<path d="M ${d} ${f-16} L ${d-5} ${f-7} L ${d+5} ${f-7} Z" fill="${zo}" stroke="none"/>`)):y==="sine"?n.push(`<path d="M ${d-16} ${f} C ${d-11} ${f-16}, ${d-5} ${f-16}, ${d} ${f} C ${d+5} ${f+16}, ${d+11} ${f+16}, ${d+16} ${f}"/>`):(t(d-6,f-10,d+6,f-10),t(d-6,f+10,d+6,f+10),t(d,f+(x>0?-16:4),d,f+(x>0?-4:16))),i(C,f-8,m),i(C,f+18,p,"middle",16),T!==void 0&&i(C,f+42,`${On(T)} Hz`,"middle",14)),n.push("</g>")}}}function Sx(n,e){const{line:t,path:i,source:r,resistor:s,ground:o,dot:a,text:l,pins:c}=n,u=120,h=330;if(e.representation==="original")r({id:"s",x:110,y:225,top:u,bottom:h,name:"Vs",value:"12 V"}),t(110,u,210,u),s("r1",210,u,370,u,"R₁",1e3),t(370,u,650,u),s("r2",440,u,440,h,"R₂",1e3),s("load",650,u,650,h,"RL",e.load),t(110,h,650,h),a(440,u),a(440,h),a(300,h),o(300,h),l(448,96,"A","start"),c({"s+":[110,u],"s-":[110,h],r1a:[210,u],r1b:[370,u],r2a:[440,u],r2b:[440,h],loada:[650,u],loadb:[650,h],gnd:[300,h]});else if(e.representation==="thevenin")r({id:"s",x:170,y:225,top:u,bottom:h,name:"VTh",value:`${On(e.equivalentVoltage)} V`}),t(170,u,280,u),s("req",280,u,480,u,"RTh",e.equivalentResistance),t(480,u,620,u),s("load",620,u,620,h,"RL",e.load),t(170,h,620,h),o(395,h),a(395,h),l(630,100,"A","start"),c({"s+":[170,u],"s-":[170,h],reqa:[280,u],reqb:[480,u],loada:[620,u],loadb:[620,h],gnd:[395,h]});else if(e.representation==="norton")r({id:"s",x:140,y:225,top:u,bottom:h,name:"IN",value:`${On(e.nortonCurrent)} mA`,kind:"current"}),t(140,u,650,u),s("req",395,u,395,h,"RN",e.equivalentResistance),s("load",650,u,650,h,"RL",e.load),t(140,h,650,h),a(395,u),a(395,h),a(270,h),o(270,h),l(405,96,"A","start"),c({"s+":[140,u],"s-":[140,h],reqa:[395,u],reqb:[395,h],loada:[650,u],loadb:[650,h],gnd:[270,h]});else throw new RangeError("Unknown equivalent circuit representation.")}function Ex(n,e){const{line:t,source:i,resistor:r,ground:s,dot:o,text:a,pins:l}=n,c=u=>u?"active":e.replacement==="open"?"open":"short";i({id:"a",x:120,y:225,top:120,bottom:330,name:"V₁",value:`${On(e.v1)} V`,state:c(e.sourceMode!=="b")}),i({id:"b",x:660,y:225,top:120,bottom:330,name:"V₂",value:`${On(e.v2)} V`,polarity:-1,labelSide:1,state:c(e.sourceMode!=="a")}),t(120,120,200,120),r("r1",200,120,320,120,"R₁",1e3),t(320,120,460,120),r("r2",460,120,580,120,"R₂",1e3),t(580,120,660,120),r("load",390,120,390,330,"R₃",1e3),t(120,330,660,330),o(390,120),o(390,330),o(250,330),s(250,330),a(400,96,"A","start"),l({"a+":[120,120],"a-":[120,330],"b+":[660,120],"b-":[660,330],r1a:[200,120],r1b:[320,120],r2a:[460,120],r2b:[580,120],loada:[390,120],loadb:[390,330],gnd:[250,330]})}function wx(n,e){const{elements:t,line:i,path:r,source:s,resistor:o,ground:a,dot:l,contact:c,text:u,pins:h}=n,d=e.configuration==="inverting",f=d?180:230;s({id:"signal",x:90,y:285,top:f,bottom:345,name:"Vin",value:`${On(e.amplitude)} Vpk`,kind:"sine",frequency:e.frequency}),d?(i(90,180,150,180),o("rin",150,180,300,180,"Rin",e.rin),i(300,180,400,180),r([[400,230],[370,230],[370,345],[90,345]]),a(230,345),l(230,345)):(i(90,230,400,230),o("rin",170,180,300,180,"Rin",e.rin),i(300,180,400,180),a(170,180),a(90,345)),r([[340,180],[340,80],[400,80]]),o("rf",400,80,550,80,"Rf",e.rf),r([[550,80],[620,80],[620,205]]),i(550,205,660,205),l(340,180),l(620,205),t.push('<g data-component="op" data-symbol="op-amp">'),t.push('<path d="M 400 140 L 400 270 L 550 205 Z" fill="white"/>'),i(410,180,420,180),i(410,230,420,230),i(415,225,415,235),u(447,212,"U₁","middle",16),i(480,147,480,175),i(480,235,480,285),u(480,130,`+${On(e.rail)} V`,"middle",16),u(480,309,`−${On(e.rail)} V`,"middle",16),t.push("</g>"),c(660,205),u(671,210,"Vout","start");const g=d?[230,345]:[90,345];h({"signal+":[90,f],"signal-":[90,345],rina:[d?150:170,180],rinb:[300,180],rfa:[400,80],rfb:[550,80],"op-":[400,180],"op+":[400,230],out:[550,205],vp:[480,147],vn:[480,285],"plus+":[480,147],"minus-":[480,285],"plus-":g,"minus+":g,gnd:g})}function Tx(n,e){const{elements:t,line:i,path:r,source:s,resistor:o,ground:a,dot:l,contact:c,text:u,pins:h}=n;s({id:"s",x:100,y:235,top:120,bottom:340,name:"Vs",value:"5 V"}),i(100,120,235,120),r([[235,200],[190,200],[190,340]]),i(300,160,365,160),o("r",365,160,535,160,"R",e.resistance),i(535,160,650,160),i(100,340,650,340),a(390,340),l(390,340),l(190,340),t.push(`<g data-component="sw" data-symbol="spdt" data-switch-position="${e.charging?"source":"return"}">`),i(300,160,235,e.charging?120:200),c(235,120),c(235,200),c(300,160),u(280,90,"S₁"),u(222,103,"5 V","end",15),u(222,224,"0 V","end",15),t.push("</g>"),e.kind==="RC"?(t.push('<g data-component="storage" data-symbol="capacitor">'),i(650,160,650,242),i(626,242,674,242),i(626,258,674,258),i(650,258,650,340),u(692,242,"C","start"),u(692,269,bx(e.capacitance),"start",16),t.push("</g>")):(t.push('<g data-component="storage" data-symbol="inductor">'),i(650,160,650,218),t.push('<path d="M 650 218 c -18 0 -18 16 0 16 c -18 0 -18 16 0 16 c -18 0 -18 16 0 16 c -18 0 -18 16 0 16"/>'),i(650,282,650,340),u(682,242,"L","start"),u(682,269,yx(e.inductance),"start",16),t.push("</g>")),u(660,143,"A","start"),h({"s+":[100,120],"s-":[100,340],supply:[235,120],return:[235,200],common:[300,160],ra:[365,160],rb:[535,160],storagea:[650,160],storageb:[650,340],gnd:[390,340]})}function cd(n,e={},{voltages:t}={}){if(!Sn[n])throw new RangeError(`Unknown schematic module: ${n}`);const i={...Sn[n].defaults,...e},r=Mx();n==="thevenin"?Sx(r,i):n==="superposition"?Ex(r,i):n==="opamp"?wx(r,i):Tx(r,i);const s={thevenin:`${i.representation==="original"?"Original voltage-divider":i.representation==="thevenin"?"Thévenin equivalent":"Norton equivalent"} circuit`,superposition:"Two-source superposition circuit; source two has its positive terminal grounded",opamp:`${i.configuration==="inverting"?"Inverting":"Non-inverting"} amplifier circuit with separate positive and negative supply pins`,transient:`Series ${i.kind} circuit with an SPDT source and closed return path`},o=$i(s[n]);return`<svg xmlns="http://www.w3.org/2000/svg" class="ee-schematic" viewBox="0 0 780 430" width="100%" style="display:block;height:auto;aspect-ratio:780 / 430" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${o}"><title>${o}</title><rect width="780" height="430" fill="white"/><g fill="none" stroke="${zo}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" font-family="Arial, Helvetica, sans-serif"><style>.ee-schematic text{fill:${zo};stroke:none;font-weight:400}</style>${r.elements.join("")}</g></svg>`}const Zo=document.querySelector("#app"),ne=Sd();let gr={kind:"checking",supported:!1,active:!1,message:"Checking headset…"},Et,_c=!1,ds=null,fi=!1,mn={fraction:.5,panel:0,active:!1},Qr=null,ud="vdc";const At=n=>String(n??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),Ax=n=>({circuit:'<path d="M3 8h5l3-5 5 10 3-5h5M7 18h15M7 15v6M22 15v6"/>',vr:'<path d="M4 6h20l2 13h-7l-5-4-5 4H2Z"/><circle cx="9" cy="11" r="2"/><circle cx="19" cy="11" r="2"/>',book:'<path d="M4 4h8a4 4 0 0 1 4 3v17a4 4 0 0 0-4-3H4Zm12 3a4 4 0 0 1 4-3h5v17h-5a4 4 0 0 0-4 3"/>',reset:'<path d="M6 8a9 9 0 1 1-1 10M6 3v6h6"/>',arrow:'<path d="M7 21 21 7M7 7h14v14"/>',play:'<path d="m10 5 13 9-13 9Z"/>',check:'<path d="m6 14 5 5L23 7"/>'})[n]||"",Ci=n=>`<svg viewBox="0 0 28 28" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${Ax(n)}</svg>`;Zo.innerHTML=`
  <aside class="sidebar">
    <a class="brand" href="#" aria-label="MetaHub Circuits lab">${Ci("circuit")}<span>MetaHub<span class="brand-sub">Circuits lab</span></span></a>
    <div class="sidebar-caption">Electrical Circuits I</div>
    <nav aria-label="Laboratory modules">${Object.entries(Sn).map(([n,e])=>`<button class="module-link" data-action="module:${n}" data-module="${n}"><span class="lab-number">${e.number}</span><span><strong>${e.name}</strong><small>${e.short}</small></span><span class="module-status" aria-hidden="true"></span></button>`).join("")}</nav>
    <div class="sidebar-bottom"><div class="course-mark">ELEN <strong>221</strong></div><button class="text-button" id="guide-button">Help ${Ci("arrow")}</button><span class="prototype-tag">Lab build · v0.7</span></div>
  </aside>
  <main class="workspace">
    <header class="topbar"><div class="breadcrumb">Lab <span id="lab-number">05</span><span class="slash">/</span><span id="topic-label"></span></div><div class="header-actions"><button class="button vr-button" id="vr-button">${Ci("vr")} Checking VR…</button></div></header>
    <div class="vr-status-row"><span id="vr-status" role="status">Checking headset…</span><button id="headset-help" class="text-button">Open on a headset</button></div>
    <section class="intro"><div><h1 id="module-title"></h1><p id="module-description"></p></div><div class="mode-switch" aria-label="Learning mode"><button data-action="explore" class="active">Explore</button><button data-action="build">Build circuit</button></div></section>
    <section class="experiment-brief" aria-label="Experiment aim"><span>Your experiment</span><p id="experiment-aim"></p><details><summary>Experiment steps</summary><div id="experiment-steps"></div></details></section>
    <div class="lab-layout">
      <section class="bench-panel" aria-label="Interactive circuit experiment">
        <div class="panel-header"><div class="bench-tabs"><button id="bench-tab" class="active">3D bench</button><button id="reference-tab">Schematic</button><button id="vr-preview-tab" hidden title="Desktop check of panel layout only">Panel preview</button></div><div class="bench-toolbar"><span id="circuit-status" class="status-tag">Circuit connected</span><button class="icon-button" id="reset-view" aria-label="Reset 3D view">${Ci("reset")}</button></div></div>
        <div class="stage-wrap"><div id="bench"></div><div id="schematic" hidden></div><div class="stage-top"><span id="bench-caption">Original circuit</span><span id="hover-label" hidden></span></div><div class="stage-bottom"><span>Drag empty space to look around · Scroll to zoom</span><span>Drag a probe to a contact · Drag a dial to turn it</span></div></div>
        <div class="bench-strip"><p id="object-help">Use the equipment on the bench. The meter reads the voltage between its two test tips.</p><button class="button subtle" data-action="undo" title="Undo last wire or probe change">Undo</button><button class="button subtle" data-action="cancel" id="cancel-wire" title="Cancel selection (Esc)">Cancel lead</button></div>
        <div class="bench-help"><span id="bench-help"></span></div>
        <div id="readings" class="readings"></div>
      </section>
      <aside class="controls-panel"><details id="keyboard-controls"><summary>Keyboard controls</summary><p class="hint">The same equipment settings, for keyboard and touch use.</p><div class="patch-toolbar" aria-label="Keyboard bench tools"><button data-action="tool:select" data-tool="select">Select</button><button data-action="tool:wire" data-tool="wire">Connect contacts</button><button data-action="tool:red" data-tool="red">Move V tip</button><button data-action="tool:black" data-tool="black">Move COM tip</button><button data-action="tool:remove" data-tool="remove">Remove lead</button></div><div class="control-heading"><div><h2>Equipment settings</h2></div><span class="small-circuit">${Ci("circuit")}</span></div><div id="part-controls" hidden></div><div id="controls"></div><div id="model-note" class="model-note"></div></details></aside>
    </div>
    <div class="lower-layout">
      <section class="chart-panel"><div class="chart-heading"><div><h2 id="chart-title"></h2></div><div id="chart-legend"></div></div><p id="chart-subtitle"></p><p id="chart-use" class="chart-use"></p><div id="source-comparison" hidden></div><div id="scope-controls" hidden></div><div id="chart" tabindex="0" aria-label="Interactive measurement graph"></div><output id="trace-reading" class="trace-reading" aria-live="polite"></output></section>
      <section class="challenge-panel"><h2>At the bench</h2><div id="activity-controls"></div><div class="challenge-actions"><button class="button subtle" data-action="check-wiring">Check connections</button><button class="button subtle" id="new-attempt" data-action="reset-circuit" hidden>Clear circuit</button></div><p class="feedback" id="feedback" role="status" aria-live="polite"></p></section>
    </div>
    <section class="connection-panel"><details><summary>Wiring list and keyboard connections</summary><div class="connection-content"><div><h3>Connect a patch lead</h3><div class="wiring-form"><label>From<select id="wire-from"></select></label><label>To<select id="wire-to"></select></label><button class="button primary" id="add-wire">Connect</button></div><div class="wiring-form"><label>Meter V tip (red)<select id="red-probe"></select></label><label>Meter COM tip (black)<select id="black-probe"></select></label></div><div class="connection-buttons"><button class="button subtle" data-action="check-wiring">Check connections</button><button class="button subtle" data-action="clear">Clear leads</button><button class="button subtle" data-action="restore" id="restore-button">Use shown circuit</button></div></div><div><h3>Connected leads</h3><div id="wire-list"></div></div></div></details></section>
    <footer class="workspace-footer"><span><i class="footer-dot"></i> Desktop 3D / VR</span><span>Ideal circuit models</span><button id="model-guide">Model limits ${Ci("arrow")}</button></footer>
  </main>
  <dialog id="headset-dialog" aria-labelledby="headset-title"><div class="dialog-header"><h2 id="headset-title">Open the lab in VR</h2><button class="icon-button" data-close aria-label="Close VR setup">×</button></div><p>Open this lab in your headset’s browser, then select <strong>Enter VR</strong>. The circuit bench and all four experiments open around you.</p><div id="headset-address" class="headset-address"></div><ol class="headset-steps"><li>Choose a lab and Explore or Build circuit.</li><li>Enter VR and accept the headset’s request.</li><li>Grip a probe to pick it up. Bring its tip to a contact and release. Hold a dial and turn your wrist to adjust it.</li><li>Use the left stick to move and the right stick to turn. You can also walk around within your play area.</li></ol><p id="headset-status" class="headset-status" role="status"></p><p>Your circuit and readings stay when you leave VR.</p><div class="dialog-actions"><button class="button primary" id="headset-enter" hidden>Enter VR</button><button class="button subtle" id="headset-check">Check headset</button><a id="headset-fullscreen" class="button subtle" target="_blank" rel="noopener" hidden>Open lab full screen</a></div></dialog>
  <dialog id="guide-dialog"><div class="dialog-header"><div><span class="eyebrow">ELEN 221</span><h2>Lab guide</h2></div><button class="icon-button" data-close aria-label="Close guide">×</button></div><div class="guide-body"><h3>Use the equipment</h3><p>Explore starts with a wired circuit. Build circuit starts with loose connections. Follow the experiment steps above the bench.</p><ol><li>Drag from one contact to another to add a lead. Grab an existing lead to move or remove it. Undo puts the last connection back.</li><li>Pick up a test probe and put its metal tip on a contact. The red lead runs to V and the black lead to COM on the meter. The reading is V minus COM. Swap the tips to reverse the sign.</li><li>Turn the dials on the equipment to change values. Flip the circuit switch to change its state. In the amplifier lab, use the two scope probes to compare input and output.</li><li>Drag on a graph to choose a load or inspect an acquired trace. The graph labels state what is being calculated or measured. Put your answers on paper.</li></ol><h3>In VR</h3><p id="vr-help-status"></p><p>Open the HTTPS link in your headset browser and select Enter VR. Grip a probe to pick it up, move it to a contact, and release. Hold a dial and turn your wrist. Use the left stick to move and the right stick to turn. You can also walk within your play area. Recenter brings you back to the bench.</p><h3>Keyboard and mouse</h3><p>Drag empty space to orbit and scroll to zoom. Drag equipment to use it. Keyboard controls below the bench offer the same settings without dragging. Focus the graph and use the arrow keys to move its cursor.</p><h3>Model limits</h3><p>DC resistor circuits are solved from your connections. The amplifier and transient labs support the shown circuit layouts. Disconnected or invalid circuits do not produce valid traces.</p><p>The amplifier uses ideal gain with adjustable supply rails. Its output stays 1 V inside each rail. This model does not include device bandwidth, slew rate, input common-mode limits, component tolerances or output current limits.</p><p>RC and RL models preserve capacitor voltage and inductor current at switching. New run resets stored energy. The instructor must confirm the amplifier configurations against the lab handout, which was not included in the email.</p><p><a href="./docs/module-designs.md" target="_blank" rel="noopener">Instructor guide ↗</a></p></div></dialog>
`;const bn=(n,e,t,i=r=>r)=>`<label class="control-label" for="param-${n}">${e}</label><select id="param-${n}" data-param="${n}">${t.map(r=>`<option value="${At(r)}" ${ct(ne)[n]===r?"selected":""}>${At(i(r))}</option>`).join("")}</select>`,Ms=(n,e,t)=>`<div class="control-label">${e}</div><div class="segmented">${t.map(([i,r])=>`<button data-action="set:${n}:${i}" class="${ct(ne)[n]===i?"active":""}">${r}</button>`).join("")}</div>`,jt=n=>`<div class="control-block">${n}</div>`;function hd(){var l,c;const n=document.activeElement,e=(n==null?void 0:n.id)||null,t=n==null?void 0:n.dataset.scopeChannel,i=n==null?void 0:n.dataset.scopeField,r=ct(ne),s=ne.module;let o="",a="";s==="thevenin"&&(o+=jt(Ms("representation","Circuit",[["original","Original"],["thevenin","Thévenin"],["norton","Norton"]])),o+=jt(bn("load","Load",kt.load,u=>`${u} Ω`)+`<div class="range-labels"><span>Smaller load</span><span>Larger load</span></div><input aria-label="Load resistance slider" type="range" min="0" max="6" step="1" value="${kt.load.indexOf(r.load)}" id="load-slider">`),r.representation==="thevenin"&&(o+=jt(bn("equivalentVoltage","Vth",kt.equivalentVoltage,u=>`${u} V`))),r.representation==="norton"&&(o+=jt(bn("nortonCurrent","In",kt.nortonCurrent,u=>`${u} mA`))),r.representation!=="original"?o+=jt(bn("equivalentResistance","Equivalent resistance",kt.equivalentResistance,u=>`${u} Ω`)):o+='<div class="fixed-values"><span>Source<strong>12 V</strong></span><span>R₁ / R₂<strong>1 kΩ / 1 kΩ</strong></span></div>',a="Use the same loads in each circuit. Peak power and peak efficiency occur at different loads."),s==="superposition"&&(o+=jt(Ms("sourceMode","Active sources",[["both","Both"],["a","A alone"],["b","B alone"]])),o+=jt(bn("v1","Source A",kt.v1,u=>`+${u} V`)),o+=jt(bn("v2","Source B",kt.v2,u=>`−${u} V`)),o+=jt(Ms("replacement","Inactive source",[["short","Short circuit"],["open","Open circuit"]])),a="An inactive ideal voltage source is a short circuit. Compare it with an open circuit. All resistors are 1 kΩ."),s==="opamp"&&(o+=jt(Ms("configuration","Circuit",[["inverting","Inverting"],["noninverting","Non-inverting"]])),o+=`<div class="paired-controls">${jt(bn("rin",r.configuration==="inverting"?"Input resistor":"Ground resistor",kt.rin,u=>`${u/1e3} kΩ`))}${jt(bn("rf","Feedback resistor",kt.rf,u=>`${u/1e3} kΩ`))}</div>`,o+=jt(bn("amplitude","Input amplitude",kt.amplitude,u=>`${u} V peak`)),o+=`<div class="paired-controls">${jt(bn("rail","Supply rails",kt.rail,u=>`±${u} V`))}${jt(bn("frequency","Signal frequency",kt.frequency,u=>`${u} Hz`))}</div>`,a=`Sine input · 1 V output headroom · ±${r.rail-1} V output limit. Ideal gain. Bandwidth and slew rate are not modelled.`),s==="transient"&&(o+=jt(Ms("kind","Circuit",[["RC","RC · capacitor"],["RL","RL · inductor"]])),o+=jt(bn("resistance","Series resistance",kt.resistance,u=>`${u} Ω`)),o+=`<div class="fixed-values"><span>Source<strong>5 V</strong></span><span>${r.kind==="RC"?"Capacitance":"Inductance"}<strong>${r.kind==="RC"?"100 μF":"100 mH"}</strong></span></div>`,o+=jt(`<div class="control-label">Switch position</div><button class="switch-button ${r.charging?"charging":""}" data-action="switch"><span class="switch-track"><i></i></span>${r.charging?"Source connected":"Closed return loop"}</button>`),o+=`<div class="transient-buttons"><button class="button primary" data-action="play" id="play-button">${Ci("play")}${r.playing?"Pause":"Run"}</button><button class="button subtle" data-action="reset-energy">New run</button></div><div class="time-control"><div><span>Time</span><strong id="simulation-time">${Vt(r.time*1e3)} ms</strong></div><input id="time-slider" aria-label="Simulation time in time constants" type="range" min="0" max="5" step="0.01" value="${r.time/Hn({...r,source:5}).tau}"><div class="time-shortcuts"><button data-action="one-tau">Go to 1 τ</button><button data-action="five-tau">Go to 5 τ</button><button data-action="replay">Replay</button></div></div>`,o+=jt(bn("speed","Playback speed",kt.speed,u=>`${u}×`)),a="Voltage, current and energy share one clock. Changing R keeps the same playback scale. New run resets stored energy."),document.querySelector("#controls").innerHTML=o,Cx(),Px(),Ix(),document.querySelector("#model-note").textContent=a,e?(l=document.getElementById(e))==null||l.focus({preventScroll:!0}):t&&((c=document.querySelector(`[data-scope-channel="${t}"][data-scope-field="${i}"]`))==null||c.focus({preventScroll:!0}))}function dd(){const n=ct(ne);return(ne.module==="thevenin"?{load:["load"],req:["equivalentResistance"],s:n.representation==="norton"?["nortonCurrent"]:n.representation==="thevenin"?["equivalentVoltage"]:[]}:ne.module==="superposition"?{a:["v1"],b:["v2"]}:ne.module==="opamp"?{signal:["amplitude","frequency"],rin:["rin"],rf:["rf"],plus:["rail"],minus:["rail"],op:["configuration"]}:{r:["resistance"],sw:["charging"],storage:["kind"]})[ds]||[]}function Rx(){const n=dd();return _h(ne).filter(e=>n.some(t=>e.id.startsWith(`cycle:${t}`)||e.id.startsWith(`set:${t}:`)||t==="charging"&&e.id==="switch")).map(e=>e.id)}function Cx(){const n=document.querySelector("#part-controls"),e=Dt(ne).circuit.components.find(i=>i.id===ds);if(n.hidden=!e,!e)return;const t=dd();n.innerHTML=`<div class="part-title"><strong>${At(e.label)} · ${At(e.value)}</strong><button id="close-part" aria-label="Close part settings">×</button></div>`+(t.length?t.map(i=>{var a;const r=document.querySelector(`[data-param="${i}"]`);r&&((a=r.closest(".control-block"))==null||a.classList.add("selected-control"));const s={load:"Load",equivalentResistance:"Resistance",equivalentVoltage:"Vth",nortonCurrent:"In",v1:"Source A",v2:"Source B",resistance:"Resistance",rail:"Supply",frequency:"Frequency",amplitude:"Input",rin:"Rin",rf:"Rf"}[i]||i,o={load:"Ω",equivalentResistance:"Ω",equivalentVoltage:"V",nortonCurrent:"mA",v1:"V",v2:"V",resistance:"Ω",rail:"V",frequency:"Hz",amplitude:"V peak",rin:"Ω",rf:"Ω"}[i]||"";return kt[i]?`<div class="part-adjust"><button data-action="cycle:${i}:-1" aria-label="Decrease ${At(i)}">−</button><span>${At(s)}: ${At(ct(ne)[i])} ${o}</span><button data-action="cycle:${i}" aria-label="Increase ${At(i)}">+</button></div>`:i==="charging"?'<button class="button" data-action="switch">Flip switch</button>':i==="configuration"?`<button class="button" data-action="set:configuration:${ct(ne).configuration==="inverting"?"noninverting":"inverting"}">Change amplifier</button>`:i==="kind"?`<button class="button" data-action="set:kind:${ct(ne).kind==="RC"?"RL":"RC"}">Use ${ct(ne).kind==="RC"?"RL":"RC"}</button>`:""}).join(""):"<p>Fixed part. Connect its terminals with the Connect tool.</p>")}function Px(){const n=Sn[ne.module],t=`<ol class="experiment-steps">${(n.steps||[]).map(i=>`<li>${At(i)}</li>`).join("")}</ol>`;document.querySelector("#experiment-steps").innerHTML=t,document.querySelector("#experiment-aim").textContent=n.purpose||n.challenge,document.querySelector("#activity-controls").innerHTML=`<p>${At(n.principle)}</p><p class="paper-note">Use the equipment to test each step. Keep readings and answers on paper.</p>`}function Lx(){const n=$l(ne),e=ct(ne);document.querySelector("#source-comparison").innerHTML=`<p>Live circuit values at +${e.v1} V / −${e.v2} V. Each view uses your wiring. Select a case to switch the sources on the bench.</p><div class="source-cases">${[["a","A alone"],["b","B alone"],["both","Both sources"]].map(([t,i])=>{var s;const r=(s=n.live)==null?void 0:s[t];return`<button data-action="set:sourceMode:${t}" class="source-case ${e.sourceMode===t?"active":""}"><span>${i}</span><strong>${r!=null&&r.valid?`${Vt(r.current*1e3)} mA`:"—"}</strong><small>${r!=null&&r.valid?`${Vt(r.voltage)} V`:"Connect the circuit"}</small></button>`}).join("")}</div>`}function Dx(){if(ne.module==="superposition"){const n=$l(ne).live;return["a","b","both"].map(e=>{var t;return`${{a:"A alone",b:"B alone",both:"Both sources"}[e]}: ${(t=n==null?void 0:n[e])!=null&&t.valid?Vt(n[e].current*1e3)+" mA":"Connect the circuit"}`})}if(ne.module==="opamp"){const n=Ui(ne);return[n.ok?`Scope: ${n.running?"Run":"Hold"}${n.stale?" · earlier settings":""}`:`Scope: ${n.error}`]}return[]}function Ix(){var o;const n=document.querySelector("#scope-controls"),e=((o=n.querySelector("details"))==null?void 0:o.open)||!1;if(n.hidden=ne.module!=="opamp",ne.module!=="opamp")return;const t=ct(ne),i=Dt(ne),r=Ui(ne),s=(a,l,c)=>`<label>${c}<select data-scope-channel="${a}" data-scope-field="${l}" aria-label="${c}"><option value="">Disconnected</option>${i.circuit.pins.map(u=>`<option value="${At(u.id)}" ${i.scope[a][l]===u.id?"selected":""}>${At(u.name)}</option>`).join("")}</select></label>`;n.innerHTML=`<details class="scope-keyboard" ${e?"open":""}><summary>Scope keyboard controls</summary><div class="scope-top"><strong>Scope</strong><div><button class="button" data-action="scope-toggle">${t.scopeRunning?"Hold":"Run scope"}</button><button class="button" data-action="scope-autoscale">Auto scale</button></div></div><p class="scope-status ${r.error?"warning":""}">${At(r.error||(r.ok?`${r.running?"Running":"Held capture"}${r.stale?" · settings have changed":""} · ${r.trigger.found?"Triggered":"No trigger crossing"}`:"Connect the scope probes."))}</p>
    <div class="scope-channels">${["ch1","ch2"].map((a,l)=>`<fieldset><legend>${a.toUpperCase()} · ${l?"output":"input"}</legend><p class="hint">Move the probe and ground clip on the bench.</p>${s(a,"signal",`${a.toUpperCase()} tip`)}${s(a,"ground",`${a.toUpperCase()} ground`)}${bn(`${a}Scale`,"V / div",kt[`${a}Scale`],c=>`${c} V`)}</fieldset>`).join("")}</div>
    <div class="scope-time">${jt(bn("timeDiv","Time / div",kt.timeDiv,a=>`${a} ms`))}${jt(bn("triggerEdge","Trigger edge",["rising","falling"],a=>a==="rising"?"Rising":"Falling"))}<label class="control-block"><span class="control-label">Trigger level · CH1</span><div class="number-unit"><input data-param="triggerLevel" aria-label="Trigger level" type="number" step="0.1" min="-15" max="15" value="${t.triggerLevel}"><span>V</span></div></label></div><p class="hint">Both ground clips share circuit GND. Scales change the view, not the circuit.</p></details>`}function oh(n,e=mn.panel){const t=mn.active?vh(ne,mn.fraction,e):null,i=t?{x:mn.fraction,label:t.text,xLabel:t.xLabel,readings:t.readings}:null,r=n.interaction||{thevenin:"load",superposition:"source",opamp:"scope",transient:"time"}[ne.module];if(n.bars){const s=Math.max(...n.bars.map(o=>Math.abs(o.value??0)),1)*1.25;return{title:n.title,interaction:r,cursor:i,subtitle:n.subtitle,xLabel:"Source case",yLabel:"Current (mA)",xTicks:n.bars.map((o,a)=>({position:.18+a*.3,label:o.name})),yTicks:[-s,0,s].map(o=>({position:.5+o/(2*s),label:Vt(o,2)})),series:n.bars.filter(o=>Number.isFinite(o.value)).map(o=>{const a=n.bars.indexOf(o);return{color:o.color,points:[[.18+a*.3,.5],[.18+a*.3,.5+o.value/(2*s)]]}})}}return{title:n.title,interaction:r,cursor:i,id:n.id,subtitle:n.subtitle,xLabel:n.xLabel,yLabel:n.yLabel,xDivisions:ne.module==="opamp"?10:4,yDivisions:ne.module==="opamp"?8:4,xTicks:Array.from({length:ne.module==="opamp"?6:5},(s,o)=>{const a=ne.module==="opamp"?5:4;return{position:o/a,label:Vt(n.xMax*o/a,2)}}),yTicks:Array.from({length:5},(s,o)=>({position:o/4,label:Vt(n.yMin+(n.yMax-n.yMin)*o/4,2)})),marker:n.marker?{x:n.marker.x/n.xMax,y:(n.marker.y-n.yMin)/(n.yMax-n.yMin)}:null,reference:n.tau?{x:n.tau/n.xMax,label:"1 τ"}:null,series:n.series.map(s=>({name:s.name,color:s.color,points:s.points.map(([o,a])=>[o/n.xMax,(a-n.yMin)/(n.yMax-n.yMin)])}))}}function Vo(n,e=0,t=!0){const i=Go(ne);if(mn={fraction:Math.min(1,Math.max(0,n)),panel:e,active:!0},t&&ne.module==="thevenin"){const r=mn.fraction*i.xMax,s=kt.load.reduce((o,a)=>Math.abs(a-r)<Math.abs(o-r)?a:o);si(ne,"load",s),mn.fraction=s/i.xMax}else t&&ne.module==="transient"?(gh(ne,`scrub:${mn.fraction*i.xMax}`),mn.fraction=ct(ne).time*1e3/i.xMax):t&&ne.module==="superposition"&&si(ne,"sourceMode",["a","b","both"][Math.min(2,Math.floor(mn.fraction*3))]);hd(),xc(),Qi()}function fd(n,e=Qr){if(!e)return;const t=(n.clientX-e.bounds.left)/e.bounds.width*640;Vo((t-52)/568,e.panel)}const es=document.querySelector("#chart");es.addEventListener("pointerdown",n=>{const e=n.target.closest("svg[data-plot-index]");!e||n.button!==0||(n.preventDefault(),Qr={panel:Number(e.dataset.plotIndex),bounds:e.getBoundingClientRect(),pointerId:n.pointerId},es.setPointerCapture(n.pointerId),es.focus({preventScroll:!0}),fd(n))});es.addEventListener("pointermove",n=>{(Qr==null?void 0:Qr.pointerId)===n.pointerId&&fd(n)});for(const n of["pointerup","pointercancel","lostpointercapture"])es.addEventListener(n,()=>{Qr=null});es.addEventListener("keydown",n=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(n.key))return;if(n.preventDefault(),ne.module==="thevenin"){const t=kt.load,i=t.indexOf(ct(ne).load),r=n.key==="Home"?0:n.key==="End"?t.length-1:Math.max(0,Math.min(t.length-1,i+(n.key==="ArrowRight"?1:-1)));Vo(t[r]/Go(ne).xMax,0);return}const e=n.key==="Home"?0:n.key==="End"?1:mn.fraction+(n.key==="ArrowRight"?.02:-.02);Vo(e,mn.panel)});function Ux(){const{circuit:n,wires:e,probes:t}=Dt(ne),i=n.pins.map(r=>`<option value="${At(r.id)}">${At(r.name)} [${At(r.id)}]</option>`).join("");for(const r of["wire-from","wire-to"]){const s=document.getElementById(r),o=s.value;s.innerHTML=i,n.pins.some(a=>a.id===o)&&(s.value=o)}for(const r of["red","black"]){const s=document.getElementById(`${r}-probe`);s.innerHTML='<option value="">Disconnected</option>'+i,s.value=t[r]||""}document.querySelector("#wire-list").innerHTML=e.length?e.map(([r,s],o)=>`<div class="wire-row"><span><code>${At(r)}</code> <span>↔</span> <code>${At(s)}</code></span><button data-remove-wire="${o}" aria-label="Remove connection ${At(r)} to ${At(s)}">Remove</button></div>`).join(""):'<p class="empty-wires">No leads connected. Start with the common ground connections.</p>',document.querySelector("#restore-button").hidden=ne.mode!=="explore"}function ah(n,e=0){if(n.bars){const _=Math.max(...n.bars.map(x=>Math.abs(x.value??0)),1)*1.25,m=18+162/2,p=162/(2*_);return`<svg data-plot-index="${e}" viewBox="0 0 640 218" role="img" aria-label="${At(n.title)}">${[-_,0,_].map(x=>`<line x1="52" y1="${m-x*p}" x2="620" y2="${m-x*p}" class="grid-line"/><text x="43" y="${m-x*p+4}" text-anchor="end">${Vt(x,1)}</text>`).join("")}${n.bars.map((x,y)=>{const b=127+y*175,M=m-(x.value??0)*p;return Number.isFinite(x.value)?`<rect x="${b}" y="${Math.min(m,M)}" width="72" height="${Math.max(1,Math.abs(x.value*p))}" rx="3" fill="${x.color}"/><text x="${b+36}" y="${x.value>=0?M-9:M+17}" text-anchor="middle" class="bar-value">${Vt(x.value)} mA</text><text x="${b+36}" y="203" text-anchor="middle">${x.name}</text>`:`<text x="${b+36}" y="${m-8}" text-anchor="middle">—</text><text x="${b+36}" y="203" text-anchor="middle">${At(x.name)}</text>`}).join("")}</svg>`}const u=_=>52+_/n.xMax*568,h=_=>180-(_-n.yMin)/(n.yMax-n.yMin)*162;let d=`<svg data-plot-index="${e}" viewBox="0 0 640 218" role="img" aria-label="${At(n.title)}"><defs><clipPath id="plot-clip-${e}"><rect x="52" y="18" width="568" height="162"/></clipPath></defs>`;const f=ne.module==="opamp"?10:4,g=ne.module==="opamp"?8:4;for(let _=0;_<=f;_++){const m=n.xMax*_/f;d+=`<line x1="${u(m)}" y1="18" x2="${u(m)}" y2="180" class="grid-line"/>`,(f===4||_%2===0)&&(d+=`<text x="${u(m)}" y="196" text-anchor="middle">${Vt(m,2)}</text>`)}for(let _=0;_<=g;_++){const m=n.yMin+(n.yMax-n.yMin)*_/g;d+=`<line x1="52" y1="${h(m)}" x2="620" y2="${h(m)}" class="grid-line"/>`,(g===4||_%2===0)&&(d+=`<text x="42" y="${h(m)+4}" text-anchor="end">${Vt(m,2)}</text>`)}if(d+=`<g clip-path="url(#plot-clip-${e})">`,n.limits)for(const _ of n.limits)d+=`<line x1="52" y1="${h(_)}" x2="620" y2="${h(_)}" stroke="#c6a885" stroke-dasharray="4 5"/>`;n.tau&&(d+=`<line x1="${u(n.tau)}" y1="18" x2="${u(n.tau)}" y2="180" stroke="#bb7549" stroke-dasharray="4 5"/><text x="${u(n.tau)+5}" y="30">1 τ</text>`);for(const _ of n.series)d+=`<path d="${_.points.map(([m,p],x)=>`${x?"L":"M"}${u(m).toFixed(2)},${h(p).toFixed(2)}`).join(" ")}" fill="none" stroke="${_.color}" stroke-width="2.6"/>`;if(n.marker&&Number.isFinite(n.marker.y)&&(d+=`<circle cx="${u(n.marker.x)}" cy="${h(n.marker.y)}" r="5" fill="#fff" stroke="#b77636" stroke-width="2.5"/>`),mn.active){const _=u(mn.fraction*n.xMax);d+=`<line x1="${_}" y1="18" x2="${_}" y2="180" class="trace-cursor"/><rect x="${_-5}" y="18" width="10" height="7" fill="#263e50"/>`}return d+=`</g><text x="${52+568/2}" y="215" text-anchor="middle" class="axis-label">${At(n.xLabel)}</text><text x="52" y="11" class="axis-label">${At(n.yLabel)}</text></svg>`,d}function xc(){document.querySelector("#schematic").innerHTML='<div class="schematic-heading"><strong>Reference circuit</strong><span>Values follow the settings.</span></div>'+cd(ne.module,ct(ne))+"<p>This is the target wiring. Your leads and voltage probes are on the 3D bench.</p>"}function Qi(){var u,h,d;const n=Zi(ne),e=ct(ne),t=Dt(ne),i=Go(ne),r=Od(ne).map((f,g)=>g===0&&ud==="off"?{...f,value:"—",unit:"",detail:"Meter off"}:f);document.querySelector("#readings").innerHTML=r.map(f=>`<div class="reading"><span>${f.label}</span><div>${At(f.value)}<small>${f.unit}</small></div><p>${At(f.detail)}</p></div>`).join("");const s=document.querySelector("#circuit-status");s.textContent=n.ok?t.correct?"Circuit connected":"Check wiring":"Connect the circuit",s.classList.toggle("warning",!n.ok||!t.correct),document.querySelector("#chart-title").textContent=i.title,document.querySelector("#chart-subtitle").textContent=i.subtitle,document.querySelector("#chart-use").textContent={thevenin:"Drag along the graph to set the load. Watch the meter and power change together.",superposition:"Select a source view to switch the circuit. The signed currents show how the sources add or cancel.",opamp:"Drag along the trace to read voltage at a chosen time. Turn the scope dials to change its scale.",transient:"The trace grows while the circuit runs. Drag on the trace to pause and inspect voltage, current and energy at the same instant."}[ne.module],document.querySelector("#chart-legend").innerHTML=i.series.map(f=>`<span><i style="background:${f.color}"></i>${At(f.name)}</span>`).join(""),document.querySelector("#chart").innerHTML=(u=i.panels)!=null&&u.length?i.panels.map((f,g)=>`<div class="trace-panel"><h3>${At(f.title)}</h3>${ah(f,g)}${f.subtitle?`<p>${At(f.subtitle)}</p>`:""}</div>`).join(""):ah(i);const o=mn.active?vh(ne,mn.fraction,mn.panel):null;if(document.querySelector("#trace-reading").textContent=(o==null?void 0:o.text)||"Use the graph to inspect a reading. Arrow keys also move the cursor.",document.querySelector("#feedback").textContent=!n.ok&&ne.mode==="explore"?n.error:ne.feedback,ne.module==="transient"){document.querySelector("#simulation-time").textContent=`${Vt(e.time*1e3)} ms`;const f=document.querySelector("#time-slider");document.activeElement!==f&&(f.value=e.time/Hn({...e,source:5}).tau),document.querySelector("#play-button").innerHTML=Ci("play")+(e.playing?"Pause":"Run")}for(const f of document.querySelectorAll("[data-tool]"))f.classList.toggle("active",f.dataset.tool===ne.tool);const a=oh(i);(h=i.panels)!=null&&h.length&&(a.panels=i.panels.map(oh));const l={select:"Drag a dial to change its value. Drag a probe onto a contact to take a reading.",wire:ne.selectedTerminal?`From ${((d=t.circuit.pins.find(f=>f.id===ne.selectedTerminal))==null?void 0:d.name)||ne.selectedTerminal} → select the next terminal. Esc cancels.`:"Drag from one contact to another to connect a lead. Drag a test probe onto a contact to measure voltage.",red:"Keyboard placement: choose the contact for the meter’s V tip.",black:"Keyboard placement: choose the contact for the meter’s COM tip.",remove:"Click a lead to remove it. Undo restores the last change.",ch1:"Click a terminal for the CH1 scope tip.",ch2:"Click a terminal for the CH2 scope tip.",scopeGround:"Click circuit ground for the selected scope ground lead."};document.querySelector("#bench-help").textContent=l[ne.tool]||ne.feedback,document.querySelector("#cancel-wire").hidden=!ne.selectedTerminal,document.querySelector("#source-comparison").hidden=ne.module!=="superposition",ne.module==="superposition"&&Lx();const c=[...r.map(f=>`${f.label}: ${f.value} ${f.unit}`),"Grip a probe, bring its tip to a contact, then release. Hold and turn a dial to adjust it.","Left stick: move. Right stick: turn. Walk within your play area to inspect the bench.",ne.module==="transient"?`Time: ${Vt(e.time*1e3)} ms | playback ${e.speed}×`:"",n.ok?"":n.error,`Experiment: ${Sn[ne.module].challenge}`,`Feedback: ${ne.feedback}`,...Dx()].filter(Boolean);Et==null||Et.update({module:ne.module,mode:ne.mode,parameters:{...e},measurement:n,metrics:r,options:kt,experiment:{challenge:Sn[ne.module].challenge,steps:Sn[ne.module].steps||[]},components:t.circuit.components,wires:t.wires,probes:t.probes,selectedTerminal:ne.selectedTerminal,tool:ne.tool,scope:t.scope,selectedPart:ds,partActions:Rx(),schematicDataURL:`data:image/svg+xml;charset=utf-8,${encodeURIComponent(cd(ne.module,e))}`,live:{title:`Lab ${Sn[ne.module].number} · ${Sn[ne.module].name}`,lines:c},actions:_h(ne),graph:a,rawGraph:i})}function In(){const n=Sn[ne.module],e=ct(ne);document.querySelector(".lower-layout").classList.toggle("scope-layout",ne.module==="opamp"),document.querySelector("#lab-number").textContent=n.number,document.querySelector("#topic-label").textContent=n.topic,document.querySelector("#module-title").textContent=n.title,document.querySelector("#module-description").textContent=n.description,document.querySelector("#new-attempt").hidden=ne.mode!=="build",document.querySelector("#bench-caption").textContent=e.representation?`${e.representation} circuit`:e.configuration?`${e.configuration} amplifier`:e.kind?`${e.kind} circuit`:"Two-source circuit";for(const t of document.querySelectorAll(".module-link")){const i=t.dataset.module===ne.module;t.classList.toggle("active",i),t.setAttribute("aria-current",i?"page":"false")}for(const t of document.querySelectorAll(".mode-switch button"))t.classList.toggle("active",t.dataset.action===ne.mode),t.setAttribute("aria-pressed",t.dataset.action===ne.mode?"true":"false");hd(),Ux(),xc(),Qi()}function Hs(n){var e;/^(module:|explore$|build$|undo$|clear$|restore$|reset-circuit$|set:(representation|kind|configuration):)/.test(n)&&((e=Et==null?void 0:Et.cancelInteractions)==null||e.call(Et)),(n.startsWith("module:")||/set:(representation|kind|configuration):/.test(n))&&(ds=null,mn.active=!1),gh(ne,n),In(),/^(tool:ch[12]|scope-ground:)/.test(n)&&!gr.active&&!fi&&(Ws(!1),document.querySelector("#bench").scrollIntoView({block:"center",behavior:"instant"}))}Zo.addEventListener("click",n=>{if(n.target.closest("#close-part")){ds=null,In();return}const e=n.target.closest("[data-action]");if(e){Hs(e.dataset.action);return}const t=n.target.closest("[data-remove-wire]");if(t){const i=ne.tool;ne.tool="remove",ql(ne,Number(t.dataset.removeWire)),ne.tool=i,In();return}n.target.closest("[data-close]")&&n.target.closest("dialog").close()});Zo.addEventListener("change",n=>{var t;const e=n.target;if(e.dataset.param&&(["representation","kind","configuration"].includes(e.dataset.param)&&((t=Et==null?void 0:Et.cancelInteractions)==null||t.call(Et)),si(ne,e.dataset.param,Number.isNaN(Number(e.value))?e.value:Number(e.value)),In()),e.dataset.scopeChannel){const i=e.dataset.scopeField;ns(ne,`${e.dataset.scopeChannel}${i==="ground"?"Ground":""}`,e.value||null),In()}(e.id==="red-probe"||e.id==="black-probe")&&(ns(ne,e.id.split("-")[0],e.value||null),Qi())});Zo.addEventListener("input",n=>{const e=n.target;if(e.dataset.param&&e.type==="number"&&e.value!==""&&(si(ne,e.dataset.param,Number(e.value)),Qi()),n.target.id==="load-slider"&&(si(ne,"load",kt.load[Number(n.target.value)]),document.querySelector("#param-load").value=ct(ne).load,Qi(),xc()),n.target.id==="time-slider"){const t=ct(ne);t.playing=!1,si(ne,"time",Number(n.target.value)*Hn({...t,source:5}).tau),Qi()}});document.querySelector("#add-wire").addEventListener("click",()=>{const n=document.querySelector("#wire-from").value,e=document.querySelector("#wire-to").value;ne.tool="wire",ne.selectedTerminal=null,ws(ne,n),ws(ne,e),In()});document.querySelector(".brand").addEventListener("click",n=>{n.preventDefault(),Hs("module:thevenin")});document.addEventListener("keydown",n=>{if(n.target.closest("input,textarea,select,button")||document.querySelector("dialog[open]"))return;const e={1:"tool:select",2:"tool:wire",3:"tool:red",4:"tool:black",5:"tool:remove",Escape:"cancel"};e[n.key]&&(n.preventDefault(),Hs(e[n.key])),(n.ctrlKey||n.metaKey)&&n.key==="z"&&(n.preventDefault(),Hs("undo"))});document.querySelector("#vr-preview-tab").addEventListener("click",()=>{const n=!fi;Ws(!1),fi=n,document.querySelector(".lab-layout").classList.toggle("vr-preview",fi),Et==null||Et.setPanelPreview(fi),document.querySelector("#vr-preview-tab").classList.toggle("active",fi),document.querySelector("#bench-tab").classList.toggle("active",!fi&&!_c)});document.querySelector("#reset-view").addEventListener("click",()=>Et==null?void 0:Et.resetView());function Ws(n){fi&&(fi=!1,Et==null||Et.setPanelPreview(!1),document.querySelector("#vr-preview-tab").classList.remove("active")),document.querySelector(".lab-layout").classList.remove("vr-preview"),_c=n,document.querySelector("#schematic").hidden=!n,document.querySelector("#bench-tab").classList.toggle("active",!n),document.querySelector("#reference-tab").classList.toggle("active",n),document.querySelector("#bench").style.visibility=n?"hidden":"visible",document.querySelector(".stage-bottom").hidden=n,document.querySelector(".stage-top").hidden=n}document.querySelector("#bench-tab").addEventListener("click",()=>Ws(!1));document.querySelector("#reference-tab").addEventListener("click",()=>Ws(!0));function Nx(){document.querySelector("#vr-help-status").textContent=gr.message,document.querySelector("#guide-dialog").showModal()}for(const n of["guide-button","model-guide"])document.getElementById(n).addEventListener("click",Nx);function Ox(){try{const e=new URL((window.location.protocol==="https:",window.location.href));return e.hash="",e.searchParams.delete("inspect-vr"),e.protocol==="https:"?e.href:null}catch{return null}}function lh(n){gr=n;const e={checking:"Checking VR…",entering:"Opening VR…",active:"Exit VR",ready:"Enter VR",error:"Try VR again"},t=n.active?"Exit VR":e[n.kind]||(n.supported?"Enter VR":"Use a headset"),i=document.querySelector("#vr-button");i.innerHTML=Ci("vr")+" "+t,i.title=n.message,i.disabled=n.kind==="checking"||n.kind==="entering",i.classList.toggle("vr-ready",n.supported);for(const s of["vr-status","headset-status","vr-help-status"])document.getElementById(s).textContent=n.message;const r=document.querySelector("#headset-enter");if(r.hidden=!n.supported||n.active,r.disabled=n.kind==="entering"||n.kind==="checking",document.querySelector("#headset-check").disabled=n.kind==="checking"||n.kind==="entering"||n.active,document.body.classList.toggle("in-vr",n.active),n.active)for(const s of document.querySelectorAll("dialog[open]"))s.close()}function pd(){var i;const n=Ox(),e=document.querySelector("#headset-address");e.innerHTML=n?`<span>Headset link</span><a href="${At(n)}" target="_blank" rel="noopener">${At(n)}</a><button class="button subtle" id="copy-headset-link">Copy link</button><small id="copy-headset-status" role="status"></small>`:"<p>This local address works on this computer. A standalone headset needs the lab’s HTTPS link.</p>",(i=document.querySelector("#copy-headset-link"))==null||i.addEventListener("click",async()=>{const r=document.querySelector("#copy-headset-status");try{await navigator.clipboard.writeText(n),r.textContent="Link copied"}catch{r.textContent="Select and copy the link above."}});const t=document.querySelector("#headset-fullscreen");t.hidden=window.self===window.top,t.href=window.location.href,document.querySelector("#headset-status").textContent=gr.message,document.querySelector("#headset-dialog").showModal()}function md(){!Et||gr.kind==="entering"||(gr.supported||gr.active?(Ws(!1),Et.enterVR()):pd())}document.querySelector("#vr-button").addEventListener("click",md);document.querySelector("#headset-enter").addEventListener("click",md);document.querySelector("#headset-help").addEventListener("click",pd);document.querySelector("#headset-check").addEventListener("click",()=>Et==null?void 0:Et.refreshVRSupport());document.querySelector("#vr-preview-tab").hidden=!new URLSearchParams(window.location.search).has("inspect-vr");for(const n of document.querySelectorAll("dialog"))n.addEventListener("click",e=>{if(e.target===n){const t=n.getBoundingClientRect();(e.clientX<t.left||e.clientX>t.right||e.clientY<t.top||e.clientY>t.bottom)&&n.close()}});try{Et=xx({container:document.querySelector("#bench"),onFrame:bc,onPanelPreviewChange:n=>{fi=n,document.querySelector(".lab-layout").classList.toggle("vr-preview",n),document.querySelector("#vr-preview-tab").classList.toggle("active",n),document.querySelector("#bench-tab").classList.toggle("active",!n&&!_c)},onTerminal:n=>{ws(ne,n),In()},onWire:n=>{ql(ne,n),In()},onWireMove:(n,e,t)=>{Bc(ne,n,e,t),In()},onManipulation:(n,e)=>{n==="begin"?wd(ne,e.input):n==="end"&&Td(ne,e.input)},onDisconnect:n=>{Bc(ne,n,0,null),In()},onConnect:(n,e)=>{const t=ne.tool;ne.tool="wire",ne.selectedTerminal=null,ws(ne,n),ws(ne,e),ne.tool=t,In()},onProbe:(n,e)=>{ns(ne,n,e),In()},onChange:(n,e)=>{var t;if(n==="meterMode"){ud=e,Qi();return}["representation","kind","configuration"].includes(n)&&((t=Et==null?void 0:Et.cancelInteractions)==null||t.call(Et)),si(ne,n,e),In()},onGraphCursor:Vo,onPart:n=>{ds=n,In()},onHover:n=>{const e=document.querySelector("#hover-label");e.hidden=!n,e.textContent=n?n.label:""},onAction:Hs,onXRStatus:lh})}catch(n){lh({kind:"unavailable",supported:!1,active:!1,message:"3D could not start in this browser. Open the lab in a headset browser."}),document.querySelector("#bench").innerHTML=`<div class="webgl-error"><h2>3D rendering is unavailable</h2><p>${At(n.message)}</p><p>You can still use the circuit reference and terminal controls below.</p></div>`}In();let ch=performance.now(),uh=0;function bc(n){const e=Math.min((n-ch)/1e3,.1);ch=n;const t=ne.params.transient;t.playing&&ne.module==="transient"&&Dt(ne).correct&&(Pd(ne,e),(!t.playing||n-uh>100)&&(uh=n,Qi())),Et||requestAnimationFrame(bc)}Et||requestAnimationFrame(bc);
