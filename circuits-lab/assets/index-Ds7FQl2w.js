var kd=Object.defineProperty;var zd=(n,e,t)=>e in n?kd(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var xa=(n,e,t)=>zd(n,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();const An={thevenin:{number:"05",short:"Equivalent circuits",title:"Thévenin and Norton",name:"Thévenin & Norton",topic:"Thévenin, Norton & maximum power transfer",description:"Compare load voltage, current and power.",purpose:"Build equivalent circuits, verify the same load behaviour, and find maximum load power.",steps:["Wire the original network. Measure load voltage, current and power at 250, 500 and 1000 Ω.","Switch to Thévenin and Norton. Set their source and resistance values, then wire each equivalent.","Repeat the same loads. Compare all three circuits using your paper measurements.","Vary the load and inspect the calculated power sweep. Find the load that receives maximum power."],challenge:"Wire the original circuit and its Thévenin and Norton equivalents. Compare readings at 250, 500 and 1000 Ω, then vary the load to find maximum power. Write your results on paper.",principle:"Equivalent circuits preserve voltage and current at the load terminals. Their internal behaviour can differ.",defaults:{representation:"original",load:500,equivalentVoltage:6,equivalentResistance:500,nortonCurrent:12}},superposition:{number:"06",short:"Source contributions",title:"Superposition",name:"Superposition",topic:"Superposition in linear DC circuits",description:"Measure each source’s contribution.",purpose:"Add signed source contributions and explain how two active sources can cancel one branch current.",steps:["Wire the network with A at +6 V and B at −3 V. Read the branch current with both sources active.","Select A alone, then B alone. Replace each inactive ideal voltage source with a short.","Compare the signed contributions with the complete circuit. Add currents on paper, not powers.","Keep both sources active and adjust B until branch current is zero. Check which other branches still carry current."],challenge:"Compare A alone, B alone and both at +6 V / −3 V. Short each inactive voltage source. Adjust source B until the branch current is zero, then compare the signed contributions. Write your explanation on paper.",principle:"Add signed voltage or current contributions. Power must be calculated from the combined result.",defaults:{v1:6,v2:3,sourceMode:"both",replacement:"short",sumMilliamp:null,explanation:"unset"}},opamp:{number:"07",short:"Gain & clipping",title:"Operational amplifiers",name:"Operational amplifiers",topic:"Closed-loop gain & output clipping",description:"Set the gain and check for clipping.",purpose:"Design a gain with resistors, then find the largest input before output clipping.",steps:["Choose the amplifier circuit assigned in your lab sheet. For this example, start with the inverting circuit.","For a first design, use the inverting circuit at gain −3. Set Rin and Rf, wire feedback, and connect both supplies.","Connect CH1 to input and CH2 to output, with both grounds at GND. Set a readable timebase and voltage scales.","Increase input amplitude until clipping begins. Change the supplies or signal frequency and compare the traces."],challenge:"At ±12 V and 100 Hz, build an inverting amplifier with gain −3. Connect CH1 to Vin and CH2 to Vout, with both grounds at GND. Increase the input until clipping appears. Put measurements and calculations on paper.",principle:"Negative feedback sets the gain only while the amplifier operates within its limits.",defaults:{configuration:"inverting",rin:1e4,rf:2e4,amplitude:1,rail:12,frequency:100,prediction:0,timeDiv:2,ch1Scale:1,ch2Scale:5,triggerEdge:"rising",triggerLevel:0,scopeRunning:!0,scopeGroundChannel:"ch1"}},transient:{number:"08",short:"Energy & time",title:"RC and RL response",name:"RC & RL transients",topic:"First-order RC & RL transient response",description:"Measure charging and decay.",purpose:"Predict how resistance changes response speed, then test both RC and RL circuits.",steps:["Wire RC. On paper, predict whether increasing R makes the response faster or slower.","Run from zero energy. Watch voltage, current and stored energy; pause, slow, replay or drag through the acquired trace.","Increase R and repeat from zero energy. Use the same playback speed and compare the time to reach the same fraction of the final value.","Repeat with RL, then switch each circuit to Return to observe decay. Compare both trends with your predictions."],challenge:"Wire the RC and RL circuits. Run charging and decay, compare voltage and current, and change R to see its effect on response time. Use pause, replay and the time cursor. Put predictions and measurements on paper.",principle:"Capacitor voltage and inductor current remain continuous through switching in these ideal circuits.",defaults:{kind:"RC",resistance:1e3,capacitance:1e-4,inductance:.1,charging:!0,initial:0,time:0,acquiredTime:0,playing:!1,speed:1,predictionChoice:"unset"}}},Lt=(n,e,t,i)=>({id:n,label:e,x:t,z:i}),zn=(n,e,t,i,r,s,o)=>({id:n,label:e,type:t,value:i,x:r,z:s,pins:o}),vs=()=>zn("ground","GND","ground","0 V",-.7,.69,[Lt("gnd","GND",-.7,.61)]),_s=(n,e,t,i,r)=>zn(n,e,"V",t,i,r,[Lt(`${n}+`,"+",i,r-.22),Lt(`${n}-`,"−",i,r+.22)]),xs=(n,e,t,i,r)=>zn(n,e,"R",t,i,r,[Lt(`${n}a`,"A",i-.29,r),Lt(`${n}b`,"B",i+.29,r)]),Cr=(n,e,t,i,r)=>zn(n,e,"R",t,i,r,[Lt(`${n}a`,"+",i,r-.26),Lt(`${n}b`,"−",i,r+.26)]),fi=(n,e)=>({id:n,type:"R",a:`${n}a`,b:`${n}b`,value:e}),io=(n,e)=>({id:n,type:"V",a:`${n}+`,b:`${n}-`,value:e});function el(n,e){let t,i,r=[],s,o;if(n==="thevenin"&&(e.representation==="original"?(t=[_s("s","DC SOURCE","12 V",-1.14,-.03),xs("r1","R₁","1 kΩ",-.36,-.46),Cr("r2","R₂","1 kΩ",.23,.08),Cr("load","LOAD",`${e.load} Ω`,1.1,.08),vs()],i=[["s+","r1a"],["r1b","r2a"],["r2a","loada"],["r2b","gnd"],["loadb","gnd"],["s-","gnd"]],r=[io("s",12),fi("r1",1e3),fi("r2",1e3),fi("load",e.load)]):e.representation==="thevenin"?(t=[_s("s","Vth",`${e.equivalentVoltage} V`,-1,-.02),xs("req","Rth",`${e.equivalentResistance} Ω`,0,-.46),Cr("load","LOAD",`${e.load} Ω`,1,.02),vs()],i=[["s+","reqa"],["reqb","loada"],["loadb","gnd"],["s-","gnd"]],r=[io("s",e.equivalentVoltage),fi("req",e.equivalentResistance),fi("load",e.load)]):(t=[zn("s","In ↑","I",`${e.nortonCurrent} mA`,-1,-.02,[Lt("s+","OUT",-1,-.28),Lt("s-","IN",-1,.24)]),Cr("req","Rn",`${e.equivalentResistance} Ω`,0,.02),Cr("load","LOAD",`${e.load} Ω`,1,.02),vs()],i=[["s+","reqa"],["reqa","loada"],["reqb","gnd"],["loadb","gnd"],["s-","gnd"]],r=[{id:"s",type:"I",a:"s-",b:"s+",value:e.nortonCurrent/1e3},fi("req",e.equivalentResistance),fi("load",e.load)]),s="loada",o="load"),n==="superposition"){const a=e.sourceMode!=="b",c=e.sourceMode!=="a";t=[_s("a","SOURCE A",a?`+${e.v1} V`:e.replacement==="short"?"0 V · SHORT":"OPEN",-1.18,-.08),_s("b","SOURCE B",c?`−${e.v2} V`:e.replacement==="short"?"0 V · SHORT":"OPEN",1.18,-.08),xs("r1","R₁","1 kΩ",-.51,-.55),xs("r2","R₂","1 kΩ",.51,-.55),Cr("load","BRANCH","1 kΩ",0,.17),vs()],i=[["a+","r1a"],["r1b","loada"],["r2a","loada"],["r2b","b+"],["a-","gnd"],["b-","gnd"],["loadb","gnd"]],r=[fi("r1",1e3),fi("r2",1e3),fi("load",1e3)],(a||e.replacement==="short")&&r.push(io("a",a?e.v1:0)),(c||e.replacement==="short")&&r.push(io("b",c?-e.v2:0)),s="loada",o="load"}return n==="opamp"&&(t=[{...zn("signal","INPUT","V",`${e.amplitude} Vpk`,-1.38,-.15,[Lt("signal+","+",-1.38,-.35),Lt("signal-","−",-1.38,.06)]),benchPosition:[-2.14,.19]},zn("rin","Rin","R",`${e.rin/1e3} kΩ`,-.72,.3,[Lt("rina","A",-1.14,.3),Lt("rinb","B",-.3,.3)]),zn("op","OP AMP","opamp",`±${e.rail} V`,0,-.35,[Lt("op+","+",-.32,-.12),Lt("op-","−",-.32,-.42),Lt("out","OUT",.53,-.22),Lt("vp","V+",.24,-.72),Lt("vn","V−",.24,-.02)]),zn("rf","Rf","R",`${e.rf/1e3} kΩ`,.7,.3,[Lt("rfa","A",.28,.3),Lt("rfb","B",1.12,.3)]),{...zn("plus","+ SUPPLY","V",`${e.rail} V`,1.38,-.56,[Lt("plus+","+",1.38,-.72),Lt("plus-","−",1.38,-.39)]),benchPosition:[2.15,-.67]},{...zn("minus","− SUPPLY","V",`${e.rail} V`,1.38,.215,[Lt("minus+","+",1.38,.05),Lt("minus-","−",1.38,.38)]),benchPosition:[2.15,.3]},zn("ground","GND","ground","0 V",-.7,.79,[Lt("gnd","GND",-1.1,.79)])],i=[["signal-","gnd"],["rfb","out"],["rfa","op-"],["rinb","op-"],["plus+","vp"],["plus-","gnd"],["minus+","gnd"],["minus-","vn"]],i.push(...e.configuration==="inverting"?[["signal+","rina"],["op+","gnd"]]:[["signal+","op+"],["rina","gnd"]]),s="out"),n==="transient"&&(t=[_s("s","DC SOURCE","5 V",-1.19,.06),zn("sw","SPDT SWITCH","switch",e.charging?"SOURCE":"RETURN",-.62,-.39,[Lt("supply","5 V",-.83,-.58),Lt("common","COM",-.36,-.39),Lt("return","0 V",-.75,-.18)]),xs("r","RESISTOR",`${e.resistance} Ω`,.2,-.46),zn("storage",e.kind==="RC"?"CAPACITOR":"INDUCTOR",e.kind==="RC"?"C":"L",e.kind==="RC"?"100 μF":"100 mH",1.03,.1,[Lt("storagea","+",1.03,-.17),Lt("storageb","−",1.03,.37)]),vs()],i=[["s+","supply"],["s-","gnd"],["return","gnd"],["common","ra"],["rb","storagea"],["storageb","gnd"]],s="storagea"),{components:t,wires:i,electrical:r,positive:s,negative:"gnd",sensor:o,pins:t.flatMap(a=>a.pins.map(c=>({...c,name:`${a.label} ${c.label}`})))}}function Is(n,e){const t=Object.fromEntries(e.map(r=>[typeof r=="string"?r:r.id,typeof r=="string"?r:r.id])),i=r=>t[r]===r||t[r]===void 0?r:t[r]=i(t[r]);for(const[r,s]of n)r in t&&s in t&&(t[i(r)]=i(s));return Object.fromEntries(Object.keys(t).map(r=>[r,i(r)]))}function Bd(n,e){const t=Is(n.wires,n.pins),i=Is(e,n.pins);return n.pins.every(r=>n.pins.every(s=>t[r.id]===t[s.id]==(i[r.id]===i[s.id])))}const Ft={load:[100,250,500,750,1e3,1500,2e3],equivalentVoltage:[2,3,4,5,6,7,8,9,10,12],equivalentResistance:[100,250,500,750,1e3,1500,2e3],nortonCurrent:[4,6,8,10,12,14,16,18,20],v1:[0,1,2,3,4,5,6,7,8,9,10,11,12],v2:[0,1,2,3,4,5,6,7,8,9,10,11,12],rin:[5e3,1e4,2e4],rf:[1e4,2e4,3e4,4e4,5e4,1e5],rail:[5,9,12,15],frequency:[10,50,100,500,1e3],amplitude:[.25,.5,1,2,3,3.5,3.6,3.7,4,5,6],prediction:Array.from({length:101},(n,e)=>e/10),resistance:[100,200,250,500,1e3,2e3,5e3,1e4],speed:[.25,.5,1,2],sumMilliamp:Array.from({length:161},(n,e)=>(e-80)/10),explanation:["unset","opposing","sources-off","whole-circuit-zero"],predictionChoice:["unset","slower","faster","same"],timeDiv:[.02,.05,.1,.2,.4,.5,1,2,4,5,10,20,50],ch1Scale:[.1,.2,.5,1,2,5,10],ch2Scale:[.1,.2,.5,1,2,5,10],triggerLevel:[-10,-5,-2,-1,-.5,0,.5,1,2,5,10],triggerEdge:["rising","falling"]},Us=(n,e)=>{if(typeof n!="number"||!Number.isFinite(n))throw new RangeError(`${e} must be a finite number.`);return n},_r=(n,e)=>{if(Us(n,e),n<=0)throw new RangeError(`${e} must be greater than zero.`);return n},Wr=(n,e)=>{if(Us(n,e),n<0)throw new RangeError(`${e} cannot be negative.`);return n},Ns=n=>Object.is(n,-0)?0:n;function Vd(n,e){const t=e.length;if(!t)return[];const i=n.map((c,l)=>{const u=Math.max(...c.map(Math.abs));return u?[...c.map(h=>h/u),e[l]/u]:[...c,e[l]]}),r=1e-12;let s=0;const o=[];for(let c=0;c<t&&s<t;c+=1){let l=s;for(let h=s+1;h<t;h+=1)Math.abs(i[h][c])>Math.abs(i[l][c])&&(l=h);if(Math.abs(i[l][c])<=r)continue;[i[s],i[l]]=[i[l],i[s]];const u=i[s][c];for(let h=c;h<=t;h+=1)i[s][h]/=u;for(let h=s+1;h<t;h+=1){const d=i[h][c];for(let f=c;f<=t;f+=1)i[h][f]-=d*i[s][f];i[h][c]=0}o.push(c),s+=1}for(let c=s;c<t;c+=1)if(i[c].slice(0,t).every(l=>Math.abs(l)<=r)&&Math.abs(i[c][t])>1e-9)throw new Error("Inconsistent circuit: check for a shorted voltage source, conflicting ideal voltage sources, or a current source without a return path.");if(s<t)throw new Error("Singular circuit: connect floating nodes to a reference and remove redundant ideal voltage sources. Voltages or source currents are not uniquely determined.");const a=Array(t).fill(0);for(let c=t-1;c>=0;c-=1){const l=o[c];a[l]=i[c][t];for(let u=l+1;u<t;u+=1)a[l]-=i[c][u]*a[u]}if(a.some(c=>!Number.isFinite(c)))throw new Error("Numerical failure: check component values and circuit connections.");for(let c=0;c<t;c+=1){const l=n[c].reduce((h,d,f)=>h+d*a[f],0),u=Math.abs(e[c])+n[c].reduce((h,d,f)=>h+Math.abs(d*a[f]),0);if(Math.abs(l-e[c])>1e-8*Math.max(u,1e-12))throw new Error("Numerically unstable circuit: use a well-conditioned network with a valid reference.")}return a}function tl({components:n=[],wires:e=[]}={}){try{if(!Array.isArray(n)||!n.length)throw new Error("Add at least one component to the circuit.");if(!Array.isArray(e))throw new Error("Wires must be an array of pin pairs.");const t=new Map([["gnd","gnd"]]),i=M=>{if(typeof M!="string"||!M.length)throw new Error("Every terminal must have a nonempty string pin name.");return t.has(M)||t.set(M,M),M},r=M=>{let w=M;for(;t.get(w)!==w;)w=t.get(w);for(;t.get(M)!==M;){const R=t.get(M);t.set(M,w),M=R}return w},s=new Set;let o=!1;for(const M of n){if(!M||typeof M.id!="string"||!M.id.length||s.has(M.id))throw new Error("Each component requires a unique, nonempty id.");if(s.add(M.id),!["R","V","I"].includes(M.type))throw new Error(`Unsupported component type: ${M.type}.`);i(M.a),i(M.b),o||(o=M.a==="gnd"||M.b==="gnd"),Us(M.value,`${M.id} value`),M.type==="R"&&_r(M.value,`${M.id} resistance`)}for(const M of e){if(!Array.isArray(M)||M.length!==2)throw new Error("Each wire must contain exactly two pin names.");const w=i(M[0]),R=i(M[1]);o||(o=w==="gnd"||R==="gnd"),t.set(r(w),r(R))}if(!o)throw new Error("Missing reference: connect the circuit common node to 'gnd'.");const a=r("gnd"),c=[...new Set([...t.keys()].map(r))].filter(M=>M!==a),l=new Map(c.map((M,w)=>[M,w])),u=M=>l.get(r(M)),h=n.filter(M=>M.type==="V"),d=new Map(h.map((M,w)=>[M.id,c.length+w])),f=c.length+h.length,g=Array.from({length:f},()=>Array(f).fill(0)),v=Array(f).fill(0),m=(M,w,R)=>{M!==void 0&&w!==void 0&&(g[M][w]+=R)};for(const M of n){const w=u(M.a),R=u(M.b);if(M.type==="R"){const A=1/M.value;if(!Number.isFinite(A))throw new Error("Resistance is outside the supported numerical range.");m(w,w,A),m(R,R,A),m(w,R,-A),m(R,w,-A)}else if(M.type==="I")w!==void 0&&(v[w]-=M.value),R!==void 0&&(v[R]+=M.value);else{const A=d.get(M.id);m(w,A,1),m(R,A,-1),m(A,w,1),m(A,R,-1),v[A]=M.value}}const p=Vd(g,v),x=M=>r(M)===a?0:Ns(p[u(M)]),b=Object.fromEntries([...t.keys()].map(M=>[M,x(M)])),y=Object.fromEntries(n.map(M=>[M.id,Ns(M.type==="R"?(x(M.a)-x(M.b))/M.value:M.type==="I"?M.value:p[d.get(M.id)])]));return{ok:!0,voltages:b,currents:y,error:null}}catch(t){return{ok:!1,voltages:{},currents:{},error:t.message}}}function Hd({configuration:n="inverting",rin:e=1e4,rf:t=2e4,amplitude:i=1,rail:r=12,headroom:s=1,frequency:o=100,time:a=0,powered:c=!0,feedback:l=!0}={}){_r(e,"Input resistance"),Wr(t,"Feedback resistance"),Wr(i,"Input amplitude"),Wr(r,"Supply rail magnitude"),Wr(s,"Output headroom"),_r(o,"Frequency"),Wr(a,"Time");let u;if(n==="inverting")u=-t/e;else if(n==="noninverting"||n==="non-inverting")u=1+t/e;else if(n==="follower")u=1;else throw new RangeError("Configuration must be inverting, noninverting, or follower.");const h=i*Math.sin(2*Math.PI*o*a),d=Math.max(0,r-s),f=Math.abs(u)*i,g=n==="inverting"?-1:1;let v=0,m=0,p=!1,x="powered-off";return c&&d>0&&(l?(v=Math.max(-d,Math.min(d,u*h)),m=Math.min(d,f),p=f>d,x=p?"saturated":"linear"):(v=Math.sign(g*h)*d,m=i>0?d:0,p=i>0,x="open-loop")),{gain:u,input:h,output:Ns(v),limit:d,maxInput:l?u===0?1/0:d/Math.abs(u):0,clipped:p,peakOutput:m,modelState:x}}function qn({kind:n="RC",resistance:e=1e3,capacitance:t=1e-4,inductance:i=.1,source:r=5,time:s=0,initial:o=0,charging:a=!0}={}){if(_r(e,"Resistance"),Us(r,"Source voltage"),Us(o,"Initial storage value"),Wr(s,"Time"),!["RC","RL"].includes(n))throw new RangeError("Transient kind must be RC or RL.");const c=a?r:0,l=n==="RC"?_r(t,"Capacitance"):_r(i,"Inductance"),u=n==="RC"?e*l:l/e;_r(u,"Time constant");const h=n==="RC"?c:c/e,d=h+(o-h)*Math.exp(-s/u),f=n==="RC"?d:c-e*d,g=n==="RC"?(c-d)/e:d;return{tau:u,voltage:Ns(f),current:Ns(g),energy:.5*l*d*d,final:h,storageValue:d}}const zt=(n,e=3)=>Number.isFinite(n)?Number(n.toFixed(e)).toLocaleString("en-US",{maximumFractionDigits:e}):"—",cr=(n,e,t=.01)=>Number.isFinite(n)&&Math.abs(n-e)<=Math.max(Math.abs(e)*t,1e-8);function Gd(){return{module:"thevenin",mode:"explore",params:Object.fromEntries(Object.entries(An).map(([n,e])=>[n,{...e.defaults}])),wireSets:{},probeSets:{},scopeSets:{},scopeHolds:{},history:{},predictions:{},sumSubmissions:{},tool:"wire",selectedTerminal:null,records:[],attempts:Object.fromEntries(Object.keys(An).map(n=>[n,0])),challengeStarted:{},feedback:"Drag a lead between contacts; place the meter tips to measure.",checks:{},showGuide:!1,sequence:0}}const ct=n=>n.params[n.module];function Wd(n){const e=ct(n);return e.representation||e.configuration||e.kind||"main"}const Dn=n=>`${n.mode}:${n.module}:${Wd(n)}`;function Ct(n){const e=el(n.module,ct(n)),t=Dn(n);return n.wireSets[t]||(n.wireSets[t]=n.mode==="explore"?e.wires.map(i=>[...i]):[]),n.probeSets[t]||(n.probeSets[t]=n.mode==="explore"?{red:e.positive,black:"gnd"}:{red:null,black:null}),n.scopeSets[t]||(n.scopeSets[t]=ic(n)),{circuit:e,wires:n.wireSets[t],probes:n.probeSets[t],scope:n.scopeSets[t],correct:Bd(e,n.wireSets[t])}}const si=n=>structuredClone(n);function ic(n){const e=n.mode==="explore"&&n.module==="opamp";return{ch1:{signal:e?"signal+":null,ground:e?"gnd":null},ch2:{signal:e?"out":null,ground:e?"gnd":null}}}const Os=new WeakMap,Ah=n=>({wires:si(n.wires),probes:si(n.probes),scope:si(n.scope)});function Rh(n,e,t){var i;((i=n.history)[e]||(i[e]=[])).push(t),n.history[e].length>80&&n.history[e].splice(0,n.history[e].length-80)}function $d(n,e){if(e==null)return!1;let t=Os.get(n);if(t||(t=new Map,Os.set(n,t)),[...t.values()].some(o=>o.tokens.has(e)))return!1;const i=Ct(n),r=Dn(n);let s=t.get(r);return s||(s={tokens:new Set,snapshot:Ah(i)},t.set(r,s)),s.tokens.add(e),!0}function qd(n,e){const t=Os.get(n);if(!t)return!1;const i=[...t.entries()].find(([,a])=>a.tokens.has(e));if(!i)return!1;const[r,s]=i;if(s.tokens.delete(e),s.tokens.size||(t.delete(r),t.size||Os.delete(n),!n.wireSets[r]||!n.probeSets[r]||!n.scopeSets[r]))return!0;const o={wires:n.wireSets[r],probes:n.probeSets[r],scope:n.scopeSets[r]};return JSON.stringify(s.snapshot)!==JSON.stringify(o)&&Rh(n,r,s.snapshot),!0}function ts(n){var i;const e=Ct(n),t=Dn(n);(i=Os.get(n))!=null&&i.has(t)||Rh(n,t,Ah(e))}const Ko=(n,e=ct(n).kind)=>`${n.mode}:${n.attempts.transient}:${e}`;function Tn(n,e=ct(n).kind){return n.predictions[Ko(n,e)]||{choice:"unset",locked:!1,late:!1,correct:!1,run:0,tested:!1}}function Li(n){var t;if(n.module!=="transient")return;const e=Ko(n);n.predictions[e]={...Tn(n),tested:!0,late:!((t=n.predictions[e])!=null&&t.locked)}}function Xd(n){if(n.module!=="transient")return!1;const e=ct(n),t=Tn(n);return t.locked?(n.feedback="Prediction already locked for this circuit.",!1):t.late?(n.feedback="The trial has already started. Begin a new attempt to make a prediction first.",!1):["slower","faster","same"].includes(e.predictionChoice)?(n.predictions[Ko(n)]={choice:e.predictionChoice,locked:!0,late:!1,tested:!1,run:t.run,correct:e.predictionChoice===(e.kind==="RC"?"slower":"faster"),kind:e.kind,resistance:e.resistance,sequence:++n.sequence},n.feedback="Prediction saved. Now change R and test it.",!0):(n.feedback="Choose slower, faster or unchanged, then lock your prediction.",!1)}const Ch=(n,e,t)=>`${n.mode}:${n.attempts.superposition}:${e}:${t}`;function Yd(n,e=n.module){return n.records.filter(t=>t.module===e&&t.mode===n.mode&&t.attempt===n.attempts[e]&&t.measurement.correct&&t.measurement.probesCorrect)}function Ph(n,e=n.params.superposition.v1,t=n.params.superposition.v2){const i=Yd(n,"superposition").filter(r=>r.params.v1===e&&r.params.v2===t&&(r.params.sourceMode==="both"||r.params.replacement==="short"));return Object.fromEntries(["a","b","both"].map(r=>[r,i.find(s=>s.params.sourceMode===r)||null]))}function jd(n){if(n.module!=="superposition")return!1;const e=ct(n),t=Ph(n);if(!t.a||!t.b||!t.both)return n.feedback="Record A alone, B alone and both at the same source settings first.",!1;if(!Number.isFinite(e.sumMilliamp))return n.feedback="Enter the signed sum in mA.",!1;const i=(t.a.measurement.current+t.b.measurement.current)*1e3,r=t.both.measurement.current*1e3,s=Math.abs(e.sumMilliamp-i)<=.01&&Math.abs(e.sumMilliamp-r)<=.01;return n.sumSubmissions[Ch(n,e.v1,e.v2)]={answerMilliamp:e.sumMilliamp,sumMilliamp:i,measuredMilliamp:r,passed:s,v1:e.v1,v2:e.v2,recordIds:Object.fromEntries(Object.entries(t).map(([o,a])=>[o,a.id])),sequence:++n.sequence},n.feedback=s?"The signed sum matches the measured current with both sources.":"Check the signs. Add currents, then compare with the both-source reading.",s}function Lh(n){const e=ct(n),{wires:t,correct:i}=Ct(n),r=Object.fromEntries(["a","b","both"].map(a=>{const c=el("superposition",{...e,sourceMode:a}),l=tl({components:c.electrical,wires:t});if(!l.ok)return[a,{valid:!1,current:null,voltage:null,power:null,error:l.error}];const u=l.voltages[c.positive]-l.voltages.loadb,h=l.currents.load;return[a,{valid:!0,current:h,voltage:u,power:u*h,branchCurrents:{r1:l.currents.r1,r2:l.currents.r2,load:h},error:null}]})),s=Object.values(r).every(a=>a.valid),o=[...new Set(Object.values(r).map(a=>a.error).filter(Boolean))];return i||o.push("Current wiring differs from the circuit diagram."),e.replacement!=="short"&&o.push("Open replacements do not give additive contributions. Select Short."),{live:r,valid:s,topologyCorrect:i,superpositionValid:s&&e.replacement==="short",error:o.join(" ")||null}}function nl(n){const e=ct(n);if(n.module==="superposition"){const t=Ph(n),i=n.sumSubmissions[Ch(n,e.v1,e.v2)]||null;return{kind:"superposition",...Lh(n),recorded:Object.fromEntries(Object.entries(t).map(([r,s])=>[r,s?{id:s.id,current:s.measurement.current,voltage:s.measurement.voltage,power:s.measurement.power}:null])),sumMilliamp:e.sumMilliamp,explanation:e.explanation,sumSubmitted:!!i,submission:i}}return n.module==="transient"?{kind:"transient",prediction:{...Tn(n),choice:Tn(n).locked?Tn(n).choice:e.predictionChoice,expected:Tn(n).tested?e.kind==="RC"?"slower":"faster":null},predictions:{RC:Tn(n,"RC"),RL:Tn(n,"RL")},playback:{speed:e.speed,baselineTau:e.kind==="RC"?.1:.001,secondsPerBaselineTau:2}}:n.module==="opamp"?{kind:"opamp",scope:Oi(n)}:{kind:n.module}}function Zd(n,e){const t=n.params.transient;if(n.module!=="transient"||!t.playing||!Number.isFinite(e)||e<=0||!Ct(n).correct)return t.time;Li(n);const i=t.kind==="RC"?.1:.001;return t.time=Math.min(t.time+e*i*t.speed/2,5*qn({...t,source:5}).tau),t.acquiredTime=Math.max(t.acquiredTime||0,t.time),t.time>=5*qn({...t,source:5}).tau&&(t.playing=!1),t.time}function Kl(n,e,t){const i=Is(e,n.pins),r={};for(const[s,o]of Object.entries(t))for(const[a,c]of Object.entries(i))c===i[s]&&(r[a]=o);return r}function Ki(n,e){const t=ct(n),{circuit:i,wires:r,probes:s,correct:o}=Ct(n);let a,c={},l,u,h,d,f,g,v,m,p;if(n.module==="thevenin"||n.module==="superposition")a=tl({components:i.electrical,wires:r}),c=a.voltages||{},a.ok&&(l=c[i.positive]-c.loadb,u=a.currents.load,h=l*u);else if(n.module==="opamp")if(!o)a={ok:!1,error:"Connect the amplifier, feedback and both supplies."};else{a={...Hd({...t,headroom:1,time:e??1/(4*t.frequency)}),ok:!0},{gain:d,maxInput:g}=a,f=a.peakOutput;const w=t.configuration==="inverting"?(a.input/t.rin+a.output/t.rf)/(1/t.rin+1/t.rf):a.output*t.rin/(t.rin+t.rf);c=Kl(i,r,{gnd:0,"signal+":a.input,out:a.output,"op-":w,vp:t.rail,vn:-t.rail}),l=a.output}else o?(a={...qn({...t,source:5,time:e??t.time}),ok:!0},{voltage:l,current:u,tau:v,energy:m,storageValue:p}=a,c=Kl(i,r,{gnd:0,"s+":5,common:t.charging?5:0,storagea:l})):a={ok:!1,error:"Connect the source, switch, resistor and storage loop."};const x=a.ok&&s.red&&s.black&&Number.isFinite(c[s.red])&&Number.isFinite(c[s.black]),b=x?c[s.red]-c[s.black]:null,y=Is(r,i.pins),M=!!x&&y[s.red]===y[i.positive]&&y[s.black]===y[i.negative];return{...a,voltage:l,current:u,power:h,gain:d,peak:f,maxInput:g,tau:v,energy:m,storageValue:p,voltages:c,probeVoltage:b,probeReady:x,probesCorrect:M,correct:o}}const Jl=new WeakMap;function Kd(n){const e=ct(n),t=Ct(n);return JSON.stringify({configuration:e.configuration,rin:e.rin,rf:e.rf,amplitude:e.amplitude,rail:e.rail,frequency:e.frequency,timeDiv:e.timeDiv,ch1Scale:e.ch1Scale,ch2Scale:e.ch2Scale,triggerEdge:e.triggerEdge,triggerLevel:e.triggerLevel,wires:t.wires,scope:t.scope})}function Oi(n){if(n.module!=="opamp")return{ok:!1,correct:!1,error:"The scope is available in the amplifier lab.",channels:{},running:!1,stale:!1};const e=ct(n),t=Ct(n),i=Kd(n),r=n.scopeHolds[Dn(n)];if(!e.scopeRunning&&r){const b=r.signature!==i;return{...si(r),running:!1,stale:b,correct:r.correct&&!b,error:b?"Held trace is from different settings. Run the scope to acquire the current circuit.":r.error}}const s=Jl.get(n);if((s==null?void 0:s.signature)===i)return{...s,running:e.scopeRunning};const o=Ki(n,0),a=Is(t.wires,t.circuit.pins),c=Object.fromEntries(["ch1","ch2"].map(b=>{const y=t.scope[b],M=y.signal,w=y.ground,R=!!(o.ok&&M&&w&&Number.isFinite(o.voltages[M])&&Number.isFinite(o.voltages[w])&&a[w]===a.gnd),A=b==="ch1"?"signal+":"out",E=R&&a[M]===a[A],S=o.ok?!M||!w?`${b.toUpperCase()}: connect signal and ground.`:a[w]!==a.gnd?`${b.toUpperCase()} ground must connect to GND.`:Number.isFinite(o.voltages[M])?null:`${b.toUpperCase()}: signal is floating or unavailable.`:o.error;return[b,{signal:M,ground:w,valid:R,correct:E,error:S,scale:e[`${b}Scale`],points:[]}]})),l=(b,y)=>b.voltages[c[y].signal]-b.voltages[c[y].ground],u=1/e.frequency,h={edge:e.triggerEdge,level:e.triggerLevel,found:!1,time:0};if(c.ch1.valid){let b=l(o,"ch1");for(let y=1;y<=200;y++){const M=y*u/200,w=l(Ki(n,M),"ch1"),R=b<=e.triggerLevel&&w>e.triggerLevel,A=b>=e.triggerLevel&&w<e.triggerLevel;if(e.triggerEdge==="rising"&&R||e.triggerEdge==="falling"&&A){const E=(e.triggerLevel-b)/(w-b);h.found=!0,h.time=(y-1+E)*u/200;break}b=w}}const d=e.timeDiv*10/1e3,f=d>u*20*1.000001,g=Math.max(200,Math.ceil(d/u*64));for(let b=0;!f&&b<=g&&!(!c.ch1.valid&&!c.ch2.valid);b++){const y=b*d/g,M=Ki(n,y+h.time);for(const w of["ch1","ch2"])c[w].valid&&c[w].points.push([y*1e3,l(M,w)])}for(const b of["ch1","ch2"]){const y=c[b];y.peak=y.points.length?Math.max(...y.points.map(([,M])=>Math.abs(M))):null,y.cropped=y.valid&&y.peak>y.scale*4*1.001}const v=!f&&c.ch1.correct&&c.ch2.correct&&!c.ch1.cropped&&!c.ch2.cropped&&h.found&&d>=u*.999,p=[...new Set(Object.values(c).map(b=>b.error).filter(Boolean))].join(" ")||(f?"Timebase exceeds 20 periods. Reduce ms/div or use Autoscale to avoid undersampling.":h.found?c.ch1.cropped||c.ch2.cropped?"A trace exceeds the display. Increase V/div or use Autoscale.":d<u?"Increase time/div to show a complete period.":null:"Waiting for the selected CH1 trigger crossing."),x={ok:!f&&(c.ch1.valid||c.ch2.valid),correct:v,error:p,channels:c,timeDiv:e.timeDiv,trigger:h,running:e.scopeRunning,stale:!1,signature:i,timebaseTooWide:f,acquisition:{params:si(e),wires:si(t.wires),scope:si(t.scope),sequence:n.sequence},duration:d,clipped:o.clipped,limits:[-e.rail+1,e.rail-1]};return Jl.set(n,x),x}function ns(n,e,t){var s;const i=Ct(n);if(t!==null&&!i.circuit.pins.some(o=>o.id===t)||!["red","black","ch1","ch2","ch1Ground","ch2Ground"].includes(e)||!["red","black"].includes(e)&&n.module!=="opamp")return!1;if(ts(n),e==="red"||e==="black")i.probes[e]=t;else{const o=e.startsWith("ch1")?"ch1":"ch2";i.scope[o][e.endsWith("Ground")?"ground":"signal"]=t}const r=((s=i.circuit.pins.find(o=>o.id===t))==null?void 0:s.name)||"disconnected";return n.feedback=`${e==="red"?"Meter V tip":e==="black"?"Meter COM tip":e}: ${r}.`,n.selectedTerminal=null,n.checks[n.module]=null,n.sequence++,!0}function Ql(n,e,t,i){const r=Ct(n);if(!Number.isInteger(e)||e<0||e>=r.wires.length||![0,1].includes(t)||i!==null&&!r.circuit.pins.some(c=>c.id===i))return!1;const s=r.wires[e],o=[...s];if(o[t]=i,i!==null&&(i===s[t]||o[0]===o[1]||r.wires.some(([c,l],u)=>u!==e&&(c===o[0]&&l===o[1]||c===o[1]&&l===o[0]))))return!1;ts(n),i===null?r.wires.splice(e,1):r.wires[e]=o,n.selectedTerminal=null,n.checks[n.module]=null,n.module==="transient"&&(n.params.transient.playing=!1),n.sequence++;const a=c=>{var l;return((l=r.circuit.pins.find(u=>u.id===c))==null?void 0:l.name)||c};return n.feedback=i===null?`Removed lead from ${a(s[0])} to ${a(s[1])}.`:`Lead connected from ${a(o[0])} to ${a(o[1])}.`,!0}function il(n,e){if(n.tool!=="remove")return n.feedback="Choose Remove before selecting a lead.",!1;const t=Ct(n);if(!Number.isInteger(e)||e<0||e>=t.wires.length)return!1;ts(n);const[i,r]=t.wires.splice(e,1)[0],s=o=>{var a;return((a=t.circuit.pins.find(c=>c.id===o))==null?void 0:a.name)||o};return n.feedback=`Removed ${s(i)} → ${s(r)}.`,n.selectedTerminal=null,n.checks[n.module]=null,n.sequence++,!0}function oi(n,e,t){const i=ct(n),r=["load","equivalentResistance","rin","rf","rail","frequency","resistance","capacitance","inductance","timeDiv","ch1Scale","ch2Scale","speed"],s=["amplitude","v1","v2","time","prediction"];if([...r,...s,"equivalentVoltage","nortonCurrent","triggerLevel","sumMilliamp","initial"].includes(e)&&!(e==="sumMilliamp"&&t===null)&&(!Number.isFinite(t)||r.includes(e)&&t<=0||s.includes(e)&&t<0))return n.feedback=`Enter a valid ${e} value.`,!1;if(e==="predictionChoice"&&n.module==="transient"&&Tn(n).locked)return n.feedback="Prediction is locked. Use Retry prediction to start a fresh comparison.",!1;if(n.module==="transient"&&e==="resistance"&&t!==i.resistance){t!==i.resistance&&Li(n);const a=qn({...i,source:5});i.initial=a.storageValue,i.time=0,i.acquiredTime=0}return i[e]=t,n.module==="transient"&&e==="time"&&(t>0&&Li(n),Ct(n).correct&&(i.acquiredTime=Math.max(i.acquiredTime||0,t))),e==="kind"&&(i.resistance=t==="RC"?1e3:100,i.initial=0,i.time=0,i.acquiredTime=0,i.playing=!1,i.charging=!0,i.predictionChoice=Tn(n,t).choice),["representation","configuration","kind"].includes(e)&&(n.selectedTerminal=null,Ct(n)),n.checks[n.module]=null,n.sequence++,!0}function Jd(n,e){An[e]&&(n.params.transient.playing=!1,n.module=e,n.selectedTerminal=null,n.tool="wire",n.mode==="challenge"&&rl(n),Ct(n),n.feedback=An[e].principle,n.sequence++)}function Qd(n,e){n.mode=e,n.selectedTerminal=null,n.tool="wire",n.params.transient.playing=!1,e==="challenge"&&rl(n),Ct(n),n.feedback=e!=="explore"?"Connect the circuit with patch leads, then place the probes. Use the circuit diagram as a guide.":"Explore the connected circuit. Change a setting and observe the result.",n.sequence++}function rl(n){n.challengeStarted[n.module]||(n.challengeStarted[n.module]=!0,n.params[n.module]={...An[n.module].defaults},n.module==="thevenin"&&Object.assign(n.params.thevenin,{equivalentVoltage:4,equivalentResistance:750,nortonCurrent:8}))}function Cs(n,e){var r;const{circuit:t,wires:i}=Ct(n);if(t.pins.some(s=>s.id===e)){if(["red","black","ch1","ch2"].includes(n.tool)){ns(n,n.tool,e);return}if(n.tool==="scopeGround"){ns(n,`${ct(n).scopeGroundChannel||"ch1"}Ground`,e);return}if(n.tool==="remove"){n.feedback="Select a lead to remove it.";return}if(n.tool==="select"){n.selectedTerminal=e,n.feedback=t.pins.find(s=>s.id===e).name;return}if(!n.selectedTerminal)n.selectedTerminal=e,n.feedback=`${t.pins.find(s=>s.id===e).name} selected. Choose the other terminal.`;else{const s=n.selectedTerminal;n.selectedTerminal!==e&&!i.some(([o,a])=>o===e&&a===n.selectedTerminal||o===n.selectedTerminal&&a===e)&&(ts(n),i.push([n.selectedTerminal,e])),n.selectedTerminal=null,n.feedback=s===e?"Connection cancelled.":`${(r=t.pins.find(o=>o.id===s))==null?void 0:r.name} → ${t.pins.find(o=>o.id===e).name}.`}n.checks[n.module]=null,n.sequence++}}function ef(n){n.module==="transient"&&Li(n);const e=Ki(n),t=ct(n);if(!e.ok)return n.feedback=e.error||"Complete a valid circuit before recording.",!1;const i=n.module==="opamp"?Oi(n):null;return n.module==="opamp"&&!i.ok?(n.feedback=i.error||"Connect the scope signals and grounds first.",!1):n.module!=="opamp"&&!e.probeReady?(n.feedback="Connect both voltage probes before recording a measurement.",!1):(n.records.unshift({id:++n.sequence,module:n.module,mode:n.mode,attempt:n.attempts[n.module],when:new Date().toISOString(),params:JSON.parse(JSON.stringify(t)),measurement:JSON.parse(JSON.stringify(e)),wires:Ct(n).wires.map(r=>[...r]),probes:{...Ct(n).probes},scope:i?si(i):null,prediction:n.module==="transient"?si(Tn(n)):null,activity:n.module==="superposition"||n.module==="transient"?si(nl(n)):null}),n.feedback=`Reading ${n.records.length} saved to your notebook${i?i.correct?"":`. ${i.error||"Check CH1 at Vin and CH2 at Vout, with both grounds at GND"}`:e.probesCorrect?"":". Check the probe locations: these are not across the requested output"}.`,!0)}function tf(n){const e=Ki(n),t=ct(n),i=n.records.filter(o=>{var a;return o.module===n.module&&o.mode==="challenge"&&o.attempt===n.attempts[n.module]&&o.measurement.correct&&(n.module==="opamp"?((a=o.scope)==null?void 0:a.correct)&&!o.scope.stale:o.measurement.probesCorrect)});let r=[];if(n.module==="thevenin"){for(const o of["original","thevenin","norton"])r.push({label:`${o==="original"?"Original":o==="thevenin"?"Thévenin":"Norton"} verified at 250, 500 and 1000 Ω`,pass:[250,500,1e3].every(a=>i.some(c=>c.params.representation===o&&c.params.load===a&&cr(c.measurement.voltage,6*a/(500+a))))});r.push({label:"Maximum power verified at 500 Ω (18 mW)",pass:i.some(o=>o.params.load===500&&cr(o.measurement.power,.018))&&t.load===500&&e.correct&&cr(e.power,.018)})}else if(n.module==="superposition"){for(const c of["both","a","b"])r.push({label:`Baseline recorded: ${c==="both"?"both sources":c==="a"?"A alone, B shorted":"B alone, A shorted"}`,pass:i.some(l=>l.params.v1===6&&l.params.v2===3&&l.params.sourceMode===c&&(c==="both"||l.params.replacement==="short")&&cr(l.measurement.current,c==="both"?.001:c==="a"?.002:-.001))});r.push({label:"Both nonzero sources active with zero branch current",pass:i.some(c=>c.params.sourceMode==="both"&&c.params.v1>0&&c.params.v2>0&&Math.abs(c.measurement.current)<1e-7)});const o=n.sumSubmissions[`challenge:${n.attempts.superposition}:6:3`];r.push({label:"Submitted the signed sum of measured A and B currents at +6 V / −3 V",pass:!!(o!=null&&o.passed)});const a=i.find(c=>c.params.sourceMode==="both"&&c.params.v1>0&&c.params.v2>0&&Math.abs(c.measurement.current)<1e-7&&["a","b"].every(l=>i.some(u=>u.params.sourceMode===l&&u.params.replacement==="short"&&u.params.v1===c.params.v1&&u.params.v2===c.params.v2)));r.push({label:"Cancellation verified with each source's signed contribution",pass:!!a}),r.push({label:"Explained cancellation: equal and opposite branch contributions; current can flow elsewhere",pass:!!a&&t.explanation==="opposing"})}else if(n.module==="opamp"){const o=i.filter(a=>a.params.configuration==="inverting"&&a.params.rail===12&&a.params.frequency===100&&cr(a.measurement.gain,-3));r=[{label:"Gain −3 at ±12 V and 100 Hz with correct wiring",pass:e.correct&&t.configuration==="inverting"&&t.rail===12&&t.frequency===100&&cr(e.gain,-3)},{label:"Recorded an unclipped waveform at the target settings",pass:o.some(a=>!a.measurement.clipped)},{label:"Recorded a clipped waveform at the target settings",pass:o.some(a=>a.measurement.clipped)},{label:"Predicted the maximum input within 0.1 V of 11/3 Vpk",pass:Math.abs(t.prediction-11/3)<=.1},{label:"Scope channels measure Vin and Vout with grounded references",pass:Oi(n).channels.ch1.correct&&Oi(n).channels.ch2.correct}]}else{for(const o of["RC","RL"])for(const[a,c]of[["baseline",o==="RC"?1e3:100],["half time constant",o==="RC"?500:200]])r.push({label:`${o}: ${a}, measured at one τ`,pass:i.some(l=>{var u;return l.params.kind===o&&l.params.resistance===c&&l.params.charging&&Math.abs(l.params.initial)<1e-9&&((u=l.prediction)==null?void 0:u.locked)&&!l.prediction.late&&l.prediction.run===Tn(n,o).run&&l.prediction.sequence<l.id&&cr(l.params.time,l.measurement.tau,.02)})});for(const o of["RC","RL"])r.push({label:`${o}: predicted the effect of increasing R before testing`,pass:Tn(n,o).locked&&!Tn(n,o).late&&Tn(n,o).correct})}n.checks[n.module]=r;const s=r.filter(o=>o.pass).length;return n.feedback=s===r.length?"All checks passed. Add your explanation to the exported notebook for instructor review.":`${s} of ${r.length} checks passed. Review the remaining items below.`,r}function Dh(n,e){var t;if(e.startsWith("scrub:")&&n.module==="transient"){const i=Number(e.slice(6));if(!Number.isFinite(i)||!Ct(n).correct)return!1;const r=ct(n);return r.time=Math.max(0,Math.min(i/1e3,r.acquiredTime||0)),r.playing=!1,n.sequence++,n.feedback=`Trace cursor at ${zt(r.time*1e3)} ms. Run to continue the response.`,!0}if(e.startsWith("probe:")){const[,i,r]=e.split(":");return ns(n,i,r||null)}if(e.startsWith("remove-wire:"))return il(n,Number(e.split(":")[1]));if(e.startsWith("scope-ground:")){const i=e.split(":")[1];n.module==="opamp"&&["ch1","ch2"].includes(i)&&(ct(n).scopeGroundChannel=i,n.tool="scopeGround",n.selectedTerminal=null,n.feedback=`Place ${i.toUpperCase()} ground at GND.`);return}if(e==="cancel"){n.selectedTerminal=null,n.feedback="Selection cancelled.";return}if(e==="undo"){const i=(t=n.history[Dn(n)])==null?void 0:t.pop();if(!i){n.feedback="No wiring or probe change to undo.";return}n.wireSets[Dn(n)]=i.wires,n.probeSets[Dn(n)]=i.probes,n.scopeSets[Dn(n)]=i.scope,n.selectedTerminal=null,n.checks[n.module]=null,n.sequence++,n.feedback="Last wiring or probe change undone.";return}if(e==="submit-sum")return jd(n);if(e==="lock-prediction")return Xd(n);if(e==="restart-prediction"&&n.module==="transient"){const i=ct(n),r=Tn(n).run+1;n.predictions[Ko(n)]={choice:"unset",locked:!1,late:!1,tested:!1,correct:!1,run:r},Object.assign(i,{resistance:i.kind==="RC"?1e3:100,time:0,initial:0,acquiredTime:0,charging:!0,playing:!1,predictionChoice:"unset"}),n.checks.transient=null,n.sequence++,n.feedback="New prediction for this circuit. Earlier readings stay in the notebook but do not count for this comparison.";return}if(e==="scope-toggle"&&n.module==="opamp"){const i=ct(n);i.scopeRunning&&(n.scopeHolds[Dn(n)]=si(Oi(n))),i.scopeRunning=!i.scopeRunning,n.sequence++,n.feedback=i.scopeRunning?"Scope running.":"Scope held. Measurements retain their acquisition settings.";return}if(e==="scope-autoscale"&&n.module==="opamp"){const i=ct(n);i.scopeRunning=!0,i.timeDiv=200/i.frequency;const r=Oi(n);for(const s of["ch1","ch2"]){const o=(r.channels[s].peak||0)*1.15/4;i[`${s}Scale`]=Ft[`${s}Scale`].find(a=>a>=o)||Math.max(10,o)}n.sequence++,n.feedback=r.ok?"Two periods fitted to the scope. Adjust the trigger if needed.":r.error;return}if(e.startsWith("module:")){Jd(n,e.slice(7));return}if(e.startsWith("set:")){const[,i,r]=e.split(":");oi(n,i,r==="true"?!0:r==="false"?!1:Number.isNaN(Number(r))?r:Number(r));return}if(e.startsWith("adjust:")){const[,i,r]=e.split(":"),s=Number(r),o=ct(n),a=n.module==="superposition"&&i==="sumMilliamp"||n.module==="opamp"&&i==="prediction",c=o[i]===null?0:o[i];if(!a||r===""||!Number.isFinite(s)||!Number.isFinite(c))return n.feedback="Choose a valid numeric answer adjustment.",!1;const l=Ft[i],u=Math.min(...l),h=Math.max(...l);return oi(n,i,Number(Math.min(h,Math.max(u,c+s)).toFixed(6)))}if(e.startsWith("cycle:")){const[,i,r="1"]=e.split(":"),s=ct(n),o=Ft[i];if(o&&i in s&&Number.isFinite(Number(r))&&Number(r)!==0){const a=Math.sign(Number(r));if(o.every(c=>typeof c=="number")){const c=s[i]===null?0:s[i];if(!Number.isFinite(c))return!1;const l=a>0?o.find(u=>u>c+1e-10)??o.at(-1):[...o].reverse().find(u=>u<c-1e-10)??o[0];oi(n,i,l)}else{const c=Math.max(0,o.indexOf(s[i]));oi(n,i,o[(c+a+o.length)%o.length])}}return}if(e.startsWith("tool:")){n.tool=e.slice(5),n.selectedTerminal=null,n.feedback=n.tool==="remove"?"Select a lead to remove it.":n.tool==="select"?"Select a component or terminal.":`${n.tool==="wire"?"Patch lead":n.tool==="red"?"Meter V tip":n.tool==="black"?"Meter COM tip":n.tool+" probe"} selected. Choose a terminal on the bench.`;return}if(e==="explore"||e==="build"||e==="challenge"){Qd(n,e);return}if(e==="record"){ef(n);return}if(e==="check"){tf(n);return}if(e==="check-wiring"){n.feedback=Ct(n).correct?"The terminal connections match the reference circuit. Now connect the probes and take a reading.":"The wiring does not yet match the reference circuit. Use Schematic to compare connections; open and shorted paths change the result.";return}if(e==="clear"||e==="reset-circuit"){ts(n),n.wireSets[Dn(n)]=[],n.probeSets[Dn(n)]={red:null,black:null},n.scopeSets[Dn(n)]=ic({...n,mode:"challenge"}),n.selectedTerminal=null,n.params.transient.playing=!1,n.feedback="Leads and probes cleared. Select two terminals to add each connection.";return}if(e==="restore"){if(n.mode!=="explore"){n.feedback="Connect the circuit with patch leads, or switch to Explore to use the connected circuit.";return}const i=el(n.module,ct(n));ts(n),n.wireSets[Dn(n)]=i.wires.map(r=>[...r]),n.probeSets[Dn(n)]={red:i.positive,black:"gnd"},n.scopeSets[Dn(n)]=ic(n),n.feedback="Reference circuit connected.";return}if(e==="reset-attempt"){n.attempts[n.module]++;for(const i of Object.keys(n.wireSets))i.startsWith(`challenge:${n.module}:`)&&(delete n.wireSets[i],delete n.probeSets[i],delete n.scopeSets[i],delete n.scopeHolds[i],delete n.history[i]);n.challengeStarted[n.module]=!1,n.selectedTerminal=null,n.mode==="challenge"&&rl(n),n.checks[n.module]=null,n.feedback="A new challenge attempt has started. Earlier readings remain in the notebook.",Ct(n);return}if(n.module==="transient"){const i=ct(n);if(e==="play"){if(!Ct(n).correct){n.feedback="Complete the circuit before running the transient.";return}i.playing=!i.playing,i.playing&&Li(n)}e==="switch"&&(Li(n),i.initial=qn({...i,source:5}).storageValue,i.time=0,i.acquiredTime=0,i.charging=!i.charging,n.feedback=i.charging?"Switch connected to the 5 V source. Stored state is preserved.":"Switch connected to the closed return loop. Stored state is preserved."),e==="replay"&&(Ct(n).correct&&Li(n),i.time=0,i.acquiredTime=0,i.playing=Ct(n).correct,n.feedback="Replaying this switching segment from its stored initial condition."),e==="reset-energy"&&(i.initial=0,i.time=0,i.acquiredTime=0,i.charging=!0,i.playing=!1,n.feedback="New experiment: initial stored energy set to zero."),e==="one-tau"&&(Li(n),i.time=qn({...i,source:5}).tau,Ct(n).correct&&(i.acquiredTime=Math.max(i.acquiredTime||0,i.time)),i.playing=!1),e==="five-tau"&&(Li(n),i.time=qn({...i,source:5}).tau*5,Ct(n).correct&&(i.acquiredTime=Math.max(i.acquiredTime||0,i.time)),i.playing=!1)}n.sequence++}function nf(n){const e=Ki(n),t=e.ok,i={label:"Voltmeter",value:e.probeReady?zt(e.probeVoltage):"—",unit:"V",detail:e.probeReady?"V tip − COM tip":"Place both probes"};return n.module==="opamp"?[{...i,label:"Voltage sample",detail:`At input +peak · ${zt(250/ct(n).frequency)} ms · V tip − COM tip`},{label:"Linear gain",value:t?zt(e.gain):"—",unit:"V/V",detail:t?e.clipped?"Output is clipping":"Within output limits":"Connect feedback & supplies"},{label:"Output peak",value:t?zt(e.peak):"—",unit:"Vpk",detail:`Teaching model: ±${ct(n).rail-1} V limit`}]:n.module==="transient"?[i,{label:"Storage current",value:t?zt(e.current*1e3):"—",unit:"mA",detail:"Fixed sensor · top → ground"},{label:"Stored energy",value:t?zt(e.energy*1e3,4):"—",unit:"mJ",detail:t?`τ = ${zt(e.tau*1e3)} ms`:"Complete the storage loop"}]:[i,{label:"Branch current",value:t?zt(e.current*1e3):"—",unit:"mA",detail:"Fixed sensor · top → ground"},{label:"Load power",value:t?zt(e.power*1e3):"—",unit:"mW",detail:"Computed from V × I"}]}const eu=new WeakMap;function Jo(n){const e=ct(n),t=Ki(n);if(n.module==="thevenin"){const{circuit:c,wires:l,correct:u}=Ct(n),h=Math.max(2e3,e.load),d=[...new Set([...Array.from({length:100},(p,x)=>(x+1)*h/100),...Ft.load.filter(p=>p<=h),e.load])].sort((p,x)=>p-x),f=JSON.stringify([c.electrical,l,e.load]),g=eu.get(n),v=(g==null?void 0:g.signature)===f?g.points:[];if((g==null?void 0:g.signature)!==f&&t.ok)for(const p of d){const x=tl({components:c.electrical.map(b=>b.id==="load"?{...b,value:p}:b),wires:l});x.ok&&v.push([p,(x.voltages.loada-x.voltages.loadb)*x.currents.load*1e3])}(g==null?void 0:g.signature)!==f&&eu.set(n,{signature:f,points:v});const m=v.reduce((p,[x,b])=>!p||b>p.y?{x,y:b}:p,null);return{title:"Load power sweep",subtitle:t.ok?`Calculated sweep · current wiring${u?"":" differs from the diagram"} · select a load to test it`:t.error,series:v.length?[{name:"Calculated load power",color:"#17788d",unit:"mW",points:v}]:[],interaction:"load",calculated:!0,valid:t.ok,error:t.ok?null:t.error,xMax:h,yMin:0,yMax:Math.max((m==null?void 0:m.y)||0,.001)*1.12,xLabel:"Load resistance (Ω)",yLabel:"Power (mW)",xUnit:"Ω",yUnit:"mW",peak:m,marker:t.ok?{x:e.load,y:t.power*1e3}:null}}if(n.module==="superposition"){const c=Lh(n),l=c.live;return{title:c.superpositionValid?"Signed source contributions":"Source states",interaction:"source",calculated:!0,subtitle:c.error||"Calculated from current wiring · positive current flows top → ground",bars:[{name:"A alone",sourceMode:"a",value:l.a.valid?l.a.current*1e3:null,missing:!l.a.valid,color:"#17788d"},{name:"B alone",sourceMode:"b",value:l.b.valid?l.b.current*1e3:null,missing:!l.b.valid,color:"#b77739"},{name:"Both",sourceMode:"both",value:l.both.valid?l.both.current*1e3:null,missing:!l.both.valid,color:"#294a61"}],yLabel:"Current (mA)",yUnit:"mA",series:[]}}if(n.module==="opamp"){const c=Oi(n),l=["ch1","ch2"].map((u,h)=>{const d=c.channels[u],f=h?"#17788d":"#b77739";return{id:u,interaction:"scope",title:`${u.toUpperCase()} · ${d.scale} V/div`,subtitle:d.error||c.error||`${d.signal} − ${d.ground} · ${c.running?"Run":"Hold"}${c.stale?" · old settings":""}`,series:d.valid&&d.points.length?[{name:u.toUpperCase(),color:f,points:d.points}]:[],xMax:c.timeDiv*10,yMin:-d.scale*4,yMax:d.scale*4,xLabel:"Time (ms)",yLabel:"Voltage (V)",xUnit:"ms",yUnit:"V",limits:u==="ch2"&&d.correct?c.limits:[]}});return{title:"Oscilloscope",interaction:"scope",subtitle:c.error||`${e.frequency} Hz · ${c.trigger.edge} trigger at ${c.trigger.level} V · ${c.running?"Run":"Hold"}`,series:l.flatMap(u=>u.series),panels:l,xMax:c.timeDiv*10,yMin:-Math.max(c.channels.ch1.scale,c.channels.ch2.scale)*4,yMax:Math.max(c.channels.ch1.scale,c.channels.ch2.scale)*4,xLabel:"Time (ms)",yLabel:"Voltage (V)",limits:c.limits,scope:c}}const i=qn({...e,source:5}).tau,r=t.ok?Math.max(0,e.acquiredTime||0):0,s=Math.max((e.kind==="RC"?.1:.001)*5e3,r*1e3),o=t.ok?Array.from({length:r>0?121:1},(c,l)=>{const u=r>0?l/120*r:0,h=qn({...e,source:5,time:u});return{time:u*1e3,voltage:h.voltage,current:h.current*1e3,energy:h.energy*1e3}}):[],a=["voltage","current","energy"].map((c,l)=>{const u=o.map(v=>[v.time,v[c]]),h=u.map(v=>v[1]),d=c==="voltage"?`${e.kind==="RC"?"Capacitor":"Inductor"} voltage`:c==="current"?"Storage current":"Stored energy",f=qn({...e,source:5,time:0}),g=c==="voltage"?Math.max(5,Math.abs(f.voltage)):c==="current"?Math.max(5e3/e.resistance,Math.abs(f.current*1e3)):Math.max(f.energy*1e3,e.kind==="RC"?12500*e.capacitance:12500*e.inductance/e.resistance**2);return{id:c,title:d,subtitle:t.ok?`${e.charging?"Source connected":"Closed return"} · ${e.playing?"Acquiring":r?"Paused":"Press Run"} · ${zt(r*1e3)} ms acquired`:t.error,series:u.length?[{name:d,color:["#17788d","#b77739","#735782"][l],unit:["V","mA","mJ"][l],points:u}]:[],interaction:"time",valid:t.ok,acquiredMax:r*1e3,xMax:s,yMin:Math.min(0,...h)*1.12,yMax:Math.max(g,...h,.001)*1.12,xLabel:"Elapsed circuit time (ms)",yLabel:["Voltage (V)","Current (mA)","Energy (mJ)"][l],xUnit:"ms",yUnit:["V","mA","mJ"][l],marker:t.ok?{x:e.time*1e3,y:c==="voltage"?t.voltage:c==="current"?t.current*1e3:t.energy*1e3}:null,tau:i*1e3}});return{...a[e.kind==="RC"?0:1],panels:a}}function Ih(n,e,t=0){var h;const i=Jo(n),r=((h=i.panels)==null?void 0:h[t])||i,s=Number.isFinite(e)?Math.max(0,Math.min(1,e)):0;if(i.bars){const d=i.bars[Math.min(i.bars.length-1,Math.floor(s*i.bars.length))];return{x:null,xLabel:d.name,readings:d.missing?[]:[{name:d.name,value:d.value,unit:i.yUnit,color:d.color}],text:d.missing?`${d.name}: circuit unavailable`:`${d.name}: ${zt(d.value)} ${i.yUnit}`,sourceMode:d.sourceMode}}const o=s*r.xMax,a=r.yUnit||"V",c=i.panels||[r],l=[];if(!(r.acquiredMax!==void 0&&o>r.acquiredMax+1e-8))for(const d of c)for(const f of d.series||[]){const g=f.points;if(!g.length||o<g[0][0]-1e-8||o>g.at(-1)[0]+1e-8)continue;let v=g.findIndex(([M])=>M>=o);v<0&&(v=g.length-1);const[m,p]=g[Math.max(0,v-1)],[x,b]=g[v],y=m===x?b:p+(o-m)/(x-m)*(b-p);l.push({name:f.name,value:y,unit:f.unit||d.yUnit||a,color:f.color})}const u=`${zt(o)} ${r.xUnit||"ms"}`;return{x:o,xLabel:u,readings:l,text:l.length?`${u} · ${l.map(d=>`${d.name} ${zt(d.value)} ${d.unit}`).join(" · ")}`:`${u} · ${r.acquiredMax!==void 0&&o>r.acquiredMax?"not acquired; run the circuit":"no trace at this point"}`}}function Uh(n){const e=ct(n),t=[],i=(s,o,a,c="")=>t.push({group:s,id:o,label:a,value:c}),r=(s,o,a,c="Settings")=>{i(c,`cycle:${s}`,`${o} +`,a),i(c,`cycle:${s}:-1`,`${o} −`,a)};i("Guide",n.mode==="explore"?"build":"explore",n.mode==="explore"?"Build circuit":"Explore"),i("Guide","reset-circuit","Clear circuit");for(const[s,o]of[["select","Select"],["wire","Wire"],["remove","Remove"],["red","Meter V tip"],["black","Meter COM tip"]])i("Bench",`tool:${s}`,o,n.tool===s?"Selected":"");if(i("Bench","undo","Undo"),i("Bench","cancel","Cancel selection"),i("Bench","check-wiring","Check wiring"),n.module==="thevenin"){for(const s of["original","thevenin","norton"])i("Settings",`set:representation:${s}`,s==="thevenin"?"Thévenin":s==="norton"?"Norton":"Original",e.representation===s?"Selected":"");r("load","Load",`${e.load} Ω`),e.representation==="thevenin"&&r("equivalentVoltage","Vth",`${e.equivalentVoltage} V`),e.representation==="norton"&&r("nortonCurrent","In",`${e.nortonCurrent} mA`),e.representation!=="original"&&r("equivalentResistance","Equivalent R",`${e.equivalentResistance} Ω`)}if(n.module==="superposition"){for(const[s,o]of[["both","Both sources"],["a","A alone"],["b","B alone"]])i("Settings",`set:sourceMode:${s}`,o,e.sourceMode===s?"Selected":"");r("v1","Source A",`+${e.v1} V`),r("v2","Source B",`−${e.v2} V`),i("Settings",`set:replacement:${e.replacement==="short"?"open":"short"}`,"Inactive source",e.replacement)}if(n.module==="opamp"){i("Settings",`set:configuration:${e.configuration==="inverting"?"noninverting":"inverting"}`,"Configuration",e.configuration),r("rin","Rin",`${e.rin/1e3} kΩ`),r("rf","Rf",`${e.rf/1e3} kΩ`),r("amplitude","Input",`${e.amplitude} Vpk`),r("rail","Supply",`±${e.rail} V`),r("frequency","Frequency",`${e.frequency} Hz`);for(const s of["ch1","ch2"])i("Bench",`tool:${s}`,`${s.toUpperCase()} signal`,n.tool===s?"Selected":""),i("Bench",`scope-ground:${s}`,`${s.toUpperCase()} ground`,n.tool==="scopeGround"&&e.scopeGroundChannel===s?"Selected":""),r(`${s}Scale`,`${s.toUpperCase()} scale`,`${e[`${s}Scale`]} V/div`);r("timeDiv","Timebase",`${e.timeDiv} ms/div`),r("triggerLevel","Trigger level",`${e.triggerLevel} V`),i("Settings",`set:triggerEdge:${e.triggerEdge==="rising"?"falling":"rising"}`,"Trigger edge",e.triggerEdge),i("Bench","scope-toggle",e.scopeRunning?"Hold scope":"Run scope"),i("Bench","scope-autoscale","Autoscale")}n.module==="transient"&&(i("Settings",`set:kind:${e.kind==="RC"?"RL":"RC"}`,"Circuit",e.kind),r("resistance","Resistance",`${e.resistance} Ω`),r("speed","Playback",`${e.speed}×`),i("Bench","switch","Switch",e.charging?"Source":"Return"),i("Bench","play",e.playing?"Pause":"Run"),i("Bench","one-tau","Cursor at 1 τ"),i("Bench","five-tau","Cursor at 5 τ"),i("Bench","reset-energy","Zero energy"),i("Bench","replay","Replay")),n.mode==="explore"&&i("Bench","restore","Connect reference");for(const[s,o]of Object.entries(An))i("Labs",`module:${s}`,`Lab ${o.number}: ${o.name}`,n.module===s?"Current":"");return t}/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const sl="180",jr={ROTATE:0,DOLLY:1,PAN:2},qr={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},rf=0,tu=1,sf=2,Nh=1,Oh=2,Ai=3,nr=0,Bn=1,gi=2,Ji=0,Zr=1,nu=2,iu=3,ru=4,of=5,gr=100,af=101,cf=102,lf=103,uf=104,hf=200,df=201,ff=202,pf=203,rc=204,sc=205,mf=206,gf=207,vf=208,_f=209,xf=210,yf=211,bf=212,Mf=213,Sf=214,oc=0,ac=1,cc=2,is=3,lc=4,uc=5,hc=6,dc=7,Fh=0,Ef=1,wf=2,Qi=0,Tf=1,Af=2,Rf=3,kh=4,Cf=5,Pf=6,Lf=7,zh=300,rs=301,ss=302,fc=303,pc=304,Qo=306,mc=1e3,xr=1001,gc=1002,li=1003,Df=1004,ro=1005,ai=1006,ya=1007,Zi=1008,_i=1009,Bh=1010,Vh=1011,Fs=1012,ol=1013,br=1014,Di=1015,Xs=1016,al=1017,cl=1018,ks=1020,Hh=35902,Gh=35899,Wh=1021,$h=1022,ci=1023,zs=1026,Bs=1027,qh=1028,ll=1029,Xh=1030,ul=1031,hl=1033,No=33776,Oo=33777,Fo=33778,ko=33779,vc=35840,_c=35841,xc=35842,yc=35843,bc=36196,Mc=37492,Sc=37496,Ec=37808,wc=37809,Tc=37810,Ac=37811,Rc=37812,Cc=37813,Pc=37814,Lc=37815,Dc=37816,Ic=37817,Uc=37818,Nc=37819,Oc=37820,Fc=37821,kc=36492,zc=36494,Bc=36495,Vc=36283,Hc=36284,Gc=36285,Wc=36286,If=3200,Uf=3201,Yh=0,Nf=1,ji="",wn="srgb",os="srgb-linear",Vo="linear",Ot="srgb",Pr=7680,su=519,Of=512,Ff=513,kf=514,jh=515,zf=516,Bf=517,Vf=518,Hf=519,ou=35044,au="300 es",vi=2e3,Ho=2001;class Er{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const r=i[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}}const Mn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let cu=1234567;const Kr=Math.PI/180,Vs=180/Math.PI;function wr(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Mn[n&255]+Mn[n>>8&255]+Mn[n>>16&255]+Mn[n>>24&255]+"-"+Mn[e&255]+Mn[e>>8&255]+"-"+Mn[e>>16&15|64]+Mn[e>>24&255]+"-"+Mn[t&63|128]+Mn[t>>8&255]+"-"+Mn[t>>16&255]+Mn[t>>24&255]+Mn[i&255]+Mn[i>>8&255]+Mn[i>>16&255]+Mn[i>>24&255]).toLowerCase()}function ft(n,e,t){return Math.max(e,Math.min(t,n))}function dl(n,e){return(n%e+e)%e}function Gf(n,e,t,i,r){return i+(n-e)*(r-i)/(t-e)}function Wf(n,e,t){return n!==e?(t-n)/(e-n):0}function Ps(n,e,t){return(1-t)*n+t*e}function $f(n,e,t,i){return Ps(n,e,1-Math.exp(-t*i))}function qf(n,e=1){return e-Math.abs(dl(n,e*2)-e)}function Xf(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function Yf(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function jf(n,e){return n+Math.floor(Math.random()*(e-n+1))}function Zf(n,e){return n+Math.random()*(e-n)}function Kf(n){return n*(.5-Math.random())}function Jf(n){n!==void 0&&(cu=n);let e=cu+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Qf(n){return n*Kr}function ep(n){return n*Vs}function tp(n){return(n&n-1)===0&&n!==0}function np(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function ip(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function rp(n,e,t,i,r){const s=Math.cos,o=Math.sin,a=s(t/2),c=o(t/2),l=s((e+i)/2),u=o((e+i)/2),h=s((e-i)/2),d=o((e-i)/2),f=s((i-e)/2),g=o((i-e)/2);switch(r){case"XYX":n.set(a*u,c*h,c*d,a*l);break;case"YZY":n.set(c*d,a*u,c*h,a*l);break;case"ZXZ":n.set(c*h,c*d,a*u,a*l);break;case"XZX":n.set(a*u,c*g,c*f,a*l);break;case"YXY":n.set(c*f,a*u,c*g,a*l);break;case"ZYZ":n.set(c*g,c*f,a*u,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function $r(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Pn(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const vn={DEG2RAD:Kr,RAD2DEG:Vs,generateUUID:wr,clamp:ft,euclideanModulo:dl,mapLinear:Gf,inverseLerp:Wf,lerp:Ps,damp:$f,pingpong:qf,smoothstep:Xf,smootherstep:Yf,randInt:jf,randFloat:Zf,randFloatSpread:Kf,seededRandom:Jf,degToRad:Qf,radToDeg:ep,isPowerOfTwo:tp,ceilPowerOfTwo:np,floorPowerOfTwo:ip,setQuaternionFromProperEuler:rp,normalize:Pn,denormalize:$r};class ye{constructor(e=0,t=0){ye.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ft(this.x,e.x,t.x),this.y=ft(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ft(this.x,e,t),this.y=ft(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ft(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(ft(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class gn{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,s,o,a){let c=i[r+0],l=i[r+1],u=i[r+2],h=i[r+3];const d=s[o+0],f=s[o+1],g=s[o+2],v=s[o+3];if(a===0){e[t+0]=c,e[t+1]=l,e[t+2]=u,e[t+3]=h;return}if(a===1){e[t+0]=d,e[t+1]=f,e[t+2]=g,e[t+3]=v;return}if(h!==v||c!==d||l!==f||u!==g){let m=1-a;const p=c*d+l*f+u*g+h*v,x=p>=0?1:-1,b=1-p*p;if(b>Number.EPSILON){const M=Math.sqrt(b),w=Math.atan2(M,p*x);m=Math.sin(m*w)/M,a=Math.sin(a*w)/M}const y=a*x;if(c=c*m+d*y,l=l*m+f*y,u=u*m+g*y,h=h*m+v*y,m===1-a){const M=1/Math.sqrt(c*c+l*l+u*u+h*h);c*=M,l*=M,u*=M,h*=M}}e[t]=c,e[t+1]=l,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,i,r,s,o){const a=i[r],c=i[r+1],l=i[r+2],u=i[r+3],h=s[o],d=s[o+1],f=s[o+2],g=s[o+3];return e[t]=a*g+u*h+c*f-l*d,e[t+1]=c*g+u*d+l*h-a*f,e[t+2]=l*g+u*f+a*d-c*h,e[t+3]=u*g-a*h-c*d-l*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,c=Math.sin,l=a(i/2),u=a(r/2),h=a(s/2),d=c(i/2),f=c(r/2),g=c(s/2);switch(o){case"XYZ":this._x=d*u*h+l*f*g,this._y=l*f*h-d*u*g,this._z=l*u*g+d*f*h,this._w=l*u*h-d*f*g;break;case"YXZ":this._x=d*u*h+l*f*g,this._y=l*f*h-d*u*g,this._z=l*u*g-d*f*h,this._w=l*u*h+d*f*g;break;case"ZXY":this._x=d*u*h-l*f*g,this._y=l*f*h+d*u*g,this._z=l*u*g+d*f*h,this._w=l*u*h-d*f*g;break;case"ZYX":this._x=d*u*h-l*f*g,this._y=l*f*h+d*u*g,this._z=l*u*g-d*f*h,this._w=l*u*h+d*f*g;break;case"YZX":this._x=d*u*h+l*f*g,this._y=l*f*h+d*u*g,this._z=l*u*g-d*f*h,this._w=l*u*h-d*f*g;break;case"XZY":this._x=d*u*h-l*f*g,this._y=l*f*h-d*u*g,this._z=l*u*g+d*f*h,this._w=l*u*h+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],r=t[4],s=t[8],o=t[1],a=t[5],c=t[9],l=t[2],u=t[6],h=t[10],d=i+a+h;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(u-c)*f,this._y=(s-l)*f,this._z=(o-r)*f}else if(i>a&&i>h){const f=2*Math.sqrt(1+i-a-h);this._w=(u-c)/f,this._x=.25*f,this._y=(r+o)/f,this._z=(s+l)/f}else if(a>h){const f=2*Math.sqrt(1+a-i-h);this._w=(s-l)/f,this._x=(r+o)/f,this._y=.25*f,this._z=(c+u)/f}else{const f=2*Math.sqrt(1+h-i-a);this._w=(o-r)/f,this._x=(s+l)/f,this._y=(c+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ft(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,r=e._y,s=e._z,o=e._w,a=t._x,c=t._y,l=t._z,u=t._w;return this._x=i*u+o*a+r*l-s*c,this._y=r*u+o*c+s*a-i*l,this._z=s*u+o*l+i*c-r*a,this._w=o*u-i*a-r*c-s*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,o=this._w;let a=o*e._w+i*e._x+r*e._y+s*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=i,this._y=r,this._z=s,this;const c=1-a*a;if(c<=Number.EPSILON){const f=1-t;return this._w=f*o+t*this._w,this._x=f*i+t*this._x,this._y=f*r+t*this._y,this._z=f*s+t*this._z,this.normalize(),this}const l=Math.sqrt(c),u=Math.atan2(l,a),h=Math.sin((1-t)*u)/l,d=Math.sin(t*u)/l;return this._w=o*h+this._w*d,this._x=i*h+this._x*d,this._y=r*h+this._y*d,this._z=s*h+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class L{constructor(e=0,t=0,i=0){L.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(lu.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(lu.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){const t=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,c=e.w,l=2*(o*r-a*i),u=2*(a*t-s*r),h=2*(s*i-o*t);return this.x=t+c*l+o*h-a*u,this.y=i+c*u+a*l-s*h,this.z=r+c*h+s*u-o*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ft(this.x,e.x,t.x),this.y=ft(this.y,e.y,t.y),this.z=ft(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ft(this.x,e,t),this.y=ft(this.y,e,t),this.z=ft(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ft(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,r=e.y,s=e.z,o=t.x,a=t.y,c=t.z;return this.x=r*c-s*a,this.y=s*o-i*c,this.z=i*a-r*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return ba.copy(this).projectOnVector(e),this.sub(ba)}reflect(e){return this.sub(ba.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(ft(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ba=new L,lu=new gn;class dt{constructor(e,t,i,r,s,o,a,c,l){dt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,c,l)}set(e,t,i,r,s,o,a,c,l){const u=this.elements;return u[0]=e,u[1]=r,u[2]=a,u[3]=t,u[4]=s,u[5]=c,u[6]=i,u[7]=o,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[3],c=i[6],l=i[1],u=i[4],h=i[7],d=i[2],f=i[5],g=i[8],v=r[0],m=r[3],p=r[6],x=r[1],b=r[4],y=r[7],M=r[2],w=r[5],R=r[8];return s[0]=o*v+a*x+c*M,s[3]=o*m+a*b+c*w,s[6]=o*p+a*y+c*R,s[1]=l*v+u*x+h*M,s[4]=l*m+u*b+h*w,s[7]=l*p+u*y+h*R,s[2]=d*v+f*x+g*M,s[5]=d*m+f*b+g*w,s[8]=d*p+f*y+g*R,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8];return t*o*u-t*a*l-i*s*u+i*a*c+r*s*l-r*o*c}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8],h=u*o-a*l,d=a*c-u*s,f=l*s-o*c,g=t*h+i*d+r*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return e[0]=h*v,e[1]=(r*l-u*i)*v,e[2]=(a*i-r*o)*v,e[3]=d*v,e[4]=(u*t-r*c)*v,e[5]=(r*s-a*t)*v,e[6]=f*v,e[7]=(i*c-l*t)*v,e[8]=(o*t-i*s)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,o,a){const c=Math.cos(s),l=Math.sin(s);return this.set(i*c,i*l,-i*(c*o+l*a)+o+e,-r*l,r*c,-r*(-l*o+c*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Ma.makeScale(e,t)),this}rotate(e){return this.premultiply(Ma.makeRotation(-e)),this}translate(e,t){return this.premultiply(Ma.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Ma=new dt;function Zh(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Go(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function sp(){const n=Go("canvas");return n.style.display="block",n}const uu={};function Hs(n){n in uu||(uu[n]=!0,console.warn(n))}function op(n,e,t){return new Promise(function(i,r){function s(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:i()}}setTimeout(s,t)})}const hu=new dt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),du=new dt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function ap(){const n={enabled:!0,workingColorSpace:os,spaces:{},convert:function(r,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===Ot&&(r.r=Ni(r.r),r.g=Ni(r.g),r.b=Ni(r.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===Ot&&(r.r=Jr(r.r),r.g=Jr(r.g),r.b=Jr(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===ji?Vo:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,o){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return Hs("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return Hs("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[os]:{primaries:e,whitePoint:i,transfer:Vo,toXYZ:hu,fromXYZ:du,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:wn},outputColorSpaceConfig:{drawingBufferColorSpace:wn}},[wn]:{primaries:e,whitePoint:i,transfer:Ot,toXYZ:hu,fromXYZ:du,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:wn}}}),n}const Rt=ap();function Ni(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Jr(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Lr;class cp{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Lr===void 0&&(Lr=Go("canvas")),Lr.width=e.width,Lr.height=e.height;const r=Lr.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=Lr}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Go("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=Ni(s[o]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Ni(t[i]/255)*255):t[i]=Ni(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let lp=0;class fl{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:lp++}),this.uuid=wr(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(Sa(r[o].image)):s.push(Sa(r[o]))}else s=Sa(r);i.url=s}return t||(e.images[this.uuid]=i),i}}function Sa(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?cp.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let up=0;const Ea=new L;class Un extends Er{constructor(e=Un.DEFAULT_IMAGE,t=Un.DEFAULT_MAPPING,i=xr,r=xr,s=ai,o=Zi,a=ci,c=_i,l=Un.DEFAULT_ANISOTROPY,u=ji){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:up++}),this.uuid=wr(),this.name="",this.source=new fl(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new ye(0,0),this.repeat=new ye(1,1),this.center=new ye(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new dt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Ea).x}get height(){return this.source.getSize(Ea).y}get depth(){return this.source.getSize(Ea).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}r&&i&&r.isVector2&&i.isVector2||r&&i&&r.isVector3&&i.isVector3||r&&i&&r.isMatrix3&&i.isMatrix3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==zh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case mc:e.x=e.x-Math.floor(e.x);break;case xr:e.x=e.x<0?0:1;break;case gc:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case mc:e.y=e.y-Math.floor(e.y);break;case xr:e.y=e.y<0?0:1;break;case gc:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Un.DEFAULT_IMAGE=null;Un.DEFAULT_MAPPING=zh;Un.DEFAULT_ANISOTROPY=1;class Zt{constructor(e=0,t=0,i=0,r=1){Zt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*t+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*t+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*t+o[7]*i+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s;const c=e.elements,l=c[0],u=c[4],h=c[8],d=c[1],f=c[5],g=c[9],v=c[2],m=c[6],p=c[10];if(Math.abs(u-d)<.01&&Math.abs(h-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+v)<.1&&Math.abs(g+m)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const b=(l+1)/2,y=(f+1)/2,M=(p+1)/2,w=(u+d)/4,R=(h+v)/4,A=(g+m)/4;return b>y&&b>M?b<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(b),r=w/i,s=R/i):y>M?y<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(y),i=w/r,s=A/r):M<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(M),i=R/s,r=A/s),this.set(i,r,s,t),this}let x=Math.sqrt((m-g)*(m-g)+(h-v)*(h-v)+(d-u)*(d-u));return Math.abs(x)<.001&&(x=1),this.x=(m-g)/x,this.y=(h-v)/x,this.z=(d-u)/x,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ft(this.x,e.x,t.x),this.y=ft(this.y,e.y,t.y),this.z=ft(this.z,e.z,t.z),this.w=ft(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ft(this.x,e,t),this.y=ft(this.y,e,t),this.z=ft(this.z,e,t),this.w=ft(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ft(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class hp extends Er{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ai,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new Zt(0,0,e,t),this.scissorTest=!1,this.viewport=new Zt(0,0,e,t);const r={width:e,height:t,depth:i.depth},s=new Un(r);this.textures=[];const o=i.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:ai,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i,this.textures[r].isArrayTexture=this.textures[r].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const r=Object.assign({},e.textures[t].image);this.textures[t].source=new fl(r)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Mr extends hp{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Kh extends Un{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=li,this.minFilter=li,this.wrapR=xr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class dp extends Un{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=li,this.minFilter=li,this.wrapR=xr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class er{constructor(e=new L(1/0,1/0,1/0),t=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(ni.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(ni.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=ni.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,ni):ni.fromBufferAttribute(s,o),ni.applyMatrix4(e.matrixWorld),this.expandByPoint(ni);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),so.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),so.copy(i.boundingBox)),so.applyMatrix4(e.matrixWorld),this.union(so)}const r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ni),ni.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ys),oo.subVectors(this.max,ys),Dr.subVectors(e.a,ys),Ir.subVectors(e.b,ys),Ur.subVectors(e.c,ys),Vi.subVectors(Ir,Dr),Hi.subVectors(Ur,Ir),lr.subVectors(Dr,Ur);let t=[0,-Vi.z,Vi.y,0,-Hi.z,Hi.y,0,-lr.z,lr.y,Vi.z,0,-Vi.x,Hi.z,0,-Hi.x,lr.z,0,-lr.x,-Vi.y,Vi.x,0,-Hi.y,Hi.x,0,-lr.y,lr.x,0];return!wa(t,Dr,Ir,Ur,oo)||(t=[1,0,0,0,1,0,0,0,1],!wa(t,Dr,Ir,Ur,oo))?!1:(ao.crossVectors(Vi,Hi),t=[ao.x,ao.y,ao.z],wa(t,Dr,Ir,Ur,oo))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ni).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ni).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Mi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Mi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Mi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Mi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Mi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Mi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Mi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Mi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Mi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Mi=[new L,new L,new L,new L,new L,new L,new L,new L],ni=new L,so=new er,Dr=new L,Ir=new L,Ur=new L,Vi=new L,Hi=new L,lr=new L,ys=new L,oo=new L,ao=new L,ur=new L;function wa(n,e,t,i,r){for(let s=0,o=n.length-3;s<=o;s+=3){ur.fromArray(n,s);const a=r.x*Math.abs(ur.x)+r.y*Math.abs(ur.y)+r.z*Math.abs(ur.z),c=e.dot(ur),l=t.dot(ur),u=i.dot(ur);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>a)return!1}return!0}const fp=new er,bs=new L,Ta=new L;class ea{constructor(e=new L,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):fp.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;bs.subVectors(e,this.center);const t=bs.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(bs,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ta.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(bs.copy(e.center).add(Ta)),this.expandByPoint(bs.copy(e.center).sub(Ta))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const Si=new L,Aa=new L,co=new L,Gi=new L,Ra=new L,lo=new L,Ca=new L;class ta{constructor(e=new L,t=new L(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Si)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Si.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Si.copy(this.origin).addScaledVector(this.direction,t),Si.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){Aa.copy(e).add(t).multiplyScalar(.5),co.copy(t).sub(e).normalize(),Gi.copy(this.origin).sub(Aa);const s=e.distanceTo(t)*.5,o=-this.direction.dot(co),a=Gi.dot(this.direction),c=-Gi.dot(co),l=Gi.lengthSq(),u=Math.abs(1-o*o);let h,d,f,g;if(u>0)if(h=o*c-a,d=o*a-c,g=s*u,h>=0)if(d>=-g)if(d<=g){const v=1/u;h*=v,d*=v,f=h*(h+o*d+2*a)+d*(o*h+d+2*c)+l}else d=s,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*c)+l;else d=-s,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*c)+l;else d<=-g?(h=Math.max(0,-(-o*s+a)),d=h>0?-s:Math.min(Math.max(-s,-c),s),f=-h*h+d*(d+2*c)+l):d<=g?(h=0,d=Math.min(Math.max(-s,-c),s),f=d*(d+2*c)+l):(h=Math.max(0,-(o*s+a)),d=h>0?s:Math.min(Math.max(-s,-c),s),f=-h*h+d*(d+2*c)+l);else d=o>0?-s:s,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(Aa).addScaledVector(co,d),f}intersectSphere(e,t){Si.subVectors(e.center,this.origin);const i=Si.dot(this.direction),r=Si.dot(Si)-i*i,s=e.radius*e.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=i-o,c=i+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,o,a,c;const l=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return l>=0?(i=(e.min.x-d.x)*l,r=(e.max.x-d.x)*l):(i=(e.max.x-d.x)*l,r=(e.min.x-d.x)*l),u>=0?(s=(e.min.y-d.y)*u,o=(e.max.y-d.y)*u):(s=(e.max.y-d.y)*u,o=(e.min.y-d.y)*u),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),h>=0?(a=(e.min.z-d.z)*h,c=(e.max.z-d.z)*h):(a=(e.max.z-d.z)*h,c=(e.min.z-d.z)*h),i>c||a>r)||((a>i||i!==i)&&(i=a),(c<r||r!==r)&&(r=c),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,Si)!==null}intersectTriangle(e,t,i,r,s){Ra.subVectors(t,e),lo.subVectors(i,e),Ca.crossVectors(Ra,lo);let o=this.direction.dot(Ca),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Gi.subVectors(this.origin,e);const c=a*this.direction.dot(lo.crossVectors(Gi,lo));if(c<0)return null;const l=a*this.direction.dot(Ra.cross(Gi));if(l<0||c+l>o)return null;const u=-a*Gi.dot(Ca);return u<0?null:this.at(u/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Wt{constructor(e,t,i,r,s,o,a,c,l,u,h,d,f,g,v,m){Wt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,c,l,u,h,d,f,g,v,m)}set(e,t,i,r,s,o,a,c,l,u,h,d,f,g,v,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=i,p[12]=r,p[1]=s,p[5]=o,p[9]=a,p[13]=c,p[2]=l,p[6]=u,p[10]=h,p[14]=d,p[3]=f,p[7]=g,p[11]=v,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Wt().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,r=1/Nr.setFromMatrixColumn(e,0).length(),s=1/Nr.setFromMatrixColumn(e,1).length(),o=1/Nr.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),c=Math.cos(r),l=Math.sin(r),u=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){const d=o*u,f=o*h,g=a*u,v=a*h;t[0]=c*u,t[4]=-c*h,t[8]=l,t[1]=f+g*l,t[5]=d-v*l,t[9]=-a*c,t[2]=v-d*l,t[6]=g+f*l,t[10]=o*c}else if(e.order==="YXZ"){const d=c*u,f=c*h,g=l*u,v=l*h;t[0]=d+v*a,t[4]=g*a-f,t[8]=o*l,t[1]=o*h,t[5]=o*u,t[9]=-a,t[2]=f*a-g,t[6]=v+d*a,t[10]=o*c}else if(e.order==="ZXY"){const d=c*u,f=c*h,g=l*u,v=l*h;t[0]=d-v*a,t[4]=-o*h,t[8]=g+f*a,t[1]=f+g*a,t[5]=o*u,t[9]=v-d*a,t[2]=-o*l,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){const d=o*u,f=o*h,g=a*u,v=a*h;t[0]=c*u,t[4]=g*l-f,t[8]=d*l+v,t[1]=c*h,t[5]=v*l+d,t[9]=f*l-g,t[2]=-l,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){const d=o*c,f=o*l,g=a*c,v=a*l;t[0]=c*u,t[4]=v-d*h,t[8]=g*h+f,t[1]=h,t[5]=o*u,t[9]=-a*u,t[2]=-l*u,t[6]=f*h+g,t[10]=d-v*h}else if(e.order==="XZY"){const d=o*c,f=o*l,g=a*c,v=a*l;t[0]=c*u,t[4]=-h,t[8]=l*u,t[1]=d*h+v,t[5]=o*u,t[9]=f*h-g,t[2]=g*h-f,t[6]=a*u,t[10]=v*h+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(pp,e,mp)}lookAt(e,t,i){const r=this.elements;return Gn.subVectors(e,t),Gn.lengthSq()===0&&(Gn.z=1),Gn.normalize(),Wi.crossVectors(i,Gn),Wi.lengthSq()===0&&(Math.abs(i.z)===1?Gn.x+=1e-4:Gn.z+=1e-4,Gn.normalize(),Wi.crossVectors(i,Gn)),Wi.normalize(),uo.crossVectors(Gn,Wi),r[0]=Wi.x,r[4]=uo.x,r[8]=Gn.x,r[1]=Wi.y,r[5]=uo.y,r[9]=Gn.y,r[2]=Wi.z,r[6]=uo.z,r[10]=Gn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[4],c=i[8],l=i[12],u=i[1],h=i[5],d=i[9],f=i[13],g=i[2],v=i[6],m=i[10],p=i[14],x=i[3],b=i[7],y=i[11],M=i[15],w=r[0],R=r[4],A=r[8],E=r[12],S=r[1],I=r[5],F=r[9],$=r[13],H=r[2],j=r[6],G=r[10],W=r[14],U=r[3],de=r[7],oe=r[11],J=r[15];return s[0]=o*w+a*S+c*H+l*U,s[4]=o*R+a*I+c*j+l*de,s[8]=o*A+a*F+c*G+l*oe,s[12]=o*E+a*$+c*W+l*J,s[1]=u*w+h*S+d*H+f*U,s[5]=u*R+h*I+d*j+f*de,s[9]=u*A+h*F+d*G+f*oe,s[13]=u*E+h*$+d*W+f*J,s[2]=g*w+v*S+m*H+p*U,s[6]=g*R+v*I+m*j+p*de,s[10]=g*A+v*F+m*G+p*oe,s[14]=g*E+v*$+m*W+p*J,s[3]=x*w+b*S+y*H+M*U,s[7]=x*R+b*I+y*j+M*de,s[11]=x*A+b*F+y*G+M*oe,s[15]=x*E+b*$+y*W+M*J,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],c=e[9],l=e[13],u=e[2],h=e[6],d=e[10],f=e[14],g=e[3],v=e[7],m=e[11],p=e[15];return g*(+s*c*h-r*l*h-s*a*d+i*l*d+r*a*f-i*c*f)+v*(+t*c*f-t*l*d+s*o*d-r*o*f+r*l*u-s*c*u)+m*(+t*l*h-t*a*f-s*o*h+i*o*f+s*a*u-i*l*u)+p*(-r*a*u-t*c*h+t*a*d+r*o*h-i*o*d+i*c*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8],h=e[9],d=e[10],f=e[11],g=e[12],v=e[13],m=e[14],p=e[15],x=h*m*l-v*d*l+v*c*f-a*m*f-h*c*p+a*d*p,b=g*d*l-u*m*l-g*c*f+o*m*f+u*c*p-o*d*p,y=u*v*l-g*h*l+g*a*f-o*v*f-u*a*p+o*h*p,M=g*h*c-u*v*c-g*a*d+o*v*d+u*a*m-o*h*m,w=t*x+i*b+r*y+s*M;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/w;return e[0]=x*R,e[1]=(v*d*s-h*m*s-v*r*f+i*m*f+h*r*p-i*d*p)*R,e[2]=(a*m*s-v*c*s+v*r*l-i*m*l-a*r*p+i*c*p)*R,e[3]=(h*c*s-a*d*s-h*r*l+i*d*l+a*r*f-i*c*f)*R,e[4]=b*R,e[5]=(u*m*s-g*d*s+g*r*f-t*m*f-u*r*p+t*d*p)*R,e[6]=(g*c*s-o*m*s-g*r*l+t*m*l+o*r*p-t*c*p)*R,e[7]=(o*d*s-u*c*s+u*r*l-t*d*l-o*r*f+t*c*f)*R,e[8]=y*R,e[9]=(g*h*s-u*v*s-g*i*f+t*v*f+u*i*p-t*h*p)*R,e[10]=(o*v*s-g*a*s+g*i*l-t*v*l-o*i*p+t*a*p)*R,e[11]=(u*a*s-o*h*s-u*i*l+t*h*l+o*i*f-t*a*f)*R,e[12]=M*R,e[13]=(u*v*r-g*h*r+g*i*d-t*v*d-u*i*m+t*h*m)*R,e[14]=(g*a*r-o*v*r-g*i*c+t*v*c+o*i*m-t*a*m)*R,e[15]=(o*h*r-u*a*r+u*i*c-t*h*c-o*i*d+t*a*d)*R,this}scale(e){const t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),r=Math.sin(t),s=1-i,o=e.x,a=e.y,c=e.z,l=s*o,u=s*a;return this.set(l*o+i,l*a-r*c,l*c+r*a,0,l*a+r*c,u*a+i,u*c-r*o,0,l*c-r*a,u*c+r*o,s*c*c+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){const r=this.elements,s=t._x,o=t._y,a=t._z,c=t._w,l=s+s,u=o+o,h=a+a,d=s*l,f=s*u,g=s*h,v=o*u,m=o*h,p=a*h,x=c*l,b=c*u,y=c*h,M=i.x,w=i.y,R=i.z;return r[0]=(1-(v+p))*M,r[1]=(f+y)*M,r[2]=(g-b)*M,r[3]=0,r[4]=(f-y)*w,r[5]=(1-(d+p))*w,r[6]=(m+x)*w,r[7]=0,r[8]=(g+b)*R,r[9]=(m-x)*R,r[10]=(1-(d+v))*R,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){const r=this.elements;let s=Nr.set(r[0],r[1],r[2]).length();const o=Nr.set(r[4],r[5],r[6]).length(),a=Nr.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],ii.copy(this);const l=1/s,u=1/o,h=1/a;return ii.elements[0]*=l,ii.elements[1]*=l,ii.elements[2]*=l,ii.elements[4]*=u,ii.elements[5]*=u,ii.elements[6]*=u,ii.elements[8]*=h,ii.elements[9]*=h,ii.elements[10]*=h,t.setFromRotationMatrix(ii),i.x=s,i.y=o,i.z=a,this}makePerspective(e,t,i,r,s,o,a=vi,c=!1){const l=this.elements,u=2*s/(t-e),h=2*s/(i-r),d=(t+e)/(t-e),f=(i+r)/(i-r);let g,v;if(c)g=s/(o-s),v=o*s/(o-s);else if(a===vi)g=-(o+s)/(o-s),v=-2*o*s/(o-s);else if(a===Ho)g=-o/(o-s),v=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=h,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,r,s,o,a=vi,c=!1){const l=this.elements,u=2/(t-e),h=2/(i-r),d=-(t+e)/(t-e),f=-(i+r)/(i-r);let g,v;if(c)g=1/(o-s),v=o/(o-s);else if(a===vi)g=-2/(o-s),v=-(o+s)/(o-s);else if(a===Ho)g=-1/(o-s),v=-s/(o-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=0,l[12]=d,l[1]=0,l[5]=h,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=g,l[14]=v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const Nr=new L,ii=new Wt,pp=new L(0,0,0),mp=new L(1,1,1),Wi=new L,uo=new L,Gn=new L,fu=new Wt,pu=new gn;class Xn{constructor(e=0,t=0,i=0,r=Xn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const r=e.elements,s=r[0],o=r[4],a=r[8],c=r[1],l=r[5],u=r[9],h=r[2],d=r[6],f=r[10];switch(t){case"XYZ":this._y=Math.asin(ft(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-ft(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(ft(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,f),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-ft(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(ft(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-ft(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return fu.makeRotationFromQuaternion(e),this.setFromRotationMatrix(fu,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return pu.setFromEuler(this),this.setFromQuaternion(pu,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Xn.DEFAULT_ORDER="XYZ";class pl{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let gp=0;const mu=new L,Or=new gn,Ei=new Wt,ho=new L,Ms=new L,vp=new L,_p=new gn,gu=new L(1,0,0),vu=new L(0,1,0),_u=new L(0,0,1),xu={type:"added"},xp={type:"removed"},Fr={type:"childadded",child:null},Pa={type:"childremoved",child:null};class an extends Er{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:gp++}),this.uuid=wr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=an.DEFAULT_UP.clone();const e=new L,t=new Xn,i=new gn,r=new L(1,1,1);function s(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new Wt},normalMatrix:{value:new dt}}),this.matrix=new Wt,this.matrixWorld=new Wt,this.matrixAutoUpdate=an.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=an.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new pl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Or.setFromAxisAngle(e,t),this.quaternion.multiply(Or),this}rotateOnWorldAxis(e,t){return Or.setFromAxisAngle(e,t),this.quaternion.premultiply(Or),this}rotateX(e){return this.rotateOnAxis(gu,e)}rotateY(e){return this.rotateOnAxis(vu,e)}rotateZ(e){return this.rotateOnAxis(_u,e)}translateOnAxis(e,t){return mu.copy(e).applyQuaternion(this.quaternion),this.position.add(mu.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(gu,e)}translateY(e){return this.translateOnAxis(vu,e)}translateZ(e){return this.translateOnAxis(_u,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ei.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?ho.copy(e):ho.set(e,t,i);const r=this.parent;this.updateWorldMatrix(!0,!1),Ms.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ei.lookAt(Ms,ho,this.up):Ei.lookAt(ho,Ms,this.up),this.quaternion.setFromRotationMatrix(Ei),r&&(Ei.extractRotation(r.matrixWorld),Or.setFromRotationMatrix(Ei),this.quaternion.premultiply(Or.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(xu),Fr.child=e,this.dispatchEvent(Fr),Fr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(xp),Pa.child=e,this.dispatchEvent(Pa),Pa.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ei.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ei.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ei),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(xu),Fr.child=e,this.dispatchEvent(Fr),Fr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ms,e,vp),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ms,_p,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(a=>({...a})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){const h=c[l];s(e.shapes,h)}else s(e.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(s(e.materials,this.material[c]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];r.animations.push(s(e.animations,c))}}if(t){const a=o(e.geometries),c=o(e.materials),l=o(e.textures),u=o(e.images),h=o(e.shapes),d=o(e.skeletons),f=o(e.animations),g=o(e.nodes);a.length>0&&(i.geometries=a),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),u.length>0&&(i.images=u),h.length>0&&(i.shapes=h),d.length>0&&(i.skeletons=d),f.length>0&&(i.animations=f),g.length>0&&(i.nodes=g)}return i.object=r,i;function o(a){const c=[];for(const l in a){const u=a[l];delete u.metadata,c.push(u)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}an.DEFAULT_UP=new L(0,1,0);an.DEFAULT_MATRIX_AUTO_UPDATE=!0;an.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const ri=new L,wi=new L,La=new L,Ti=new L,kr=new L,zr=new L,yu=new L,Da=new L,Ia=new L,Ua=new L,Na=new Zt,Oa=new Zt,Fa=new Zt;class Jn{constructor(e=new L,t=new L,i=new L){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),ri.subVectors(e,t),r.cross(ri);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){ri.subVectors(r,t),wi.subVectors(i,t),La.subVectors(e,t);const o=ri.dot(ri),a=ri.dot(wi),c=ri.dot(La),l=wi.dot(wi),u=wi.dot(La),h=o*l-a*a;if(h===0)return s.set(0,0,0),null;const d=1/h,f=(l*c-a*u)*d,g=(o*u-a*c)*d;return s.set(1-f-g,g,f)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,Ti)===null?!1:Ti.x>=0&&Ti.y>=0&&Ti.x+Ti.y<=1}static getInterpolation(e,t,i,r,s,o,a,c){return this.getBarycoord(e,t,i,r,Ti)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,Ti.x),c.addScaledVector(o,Ti.y),c.addScaledVector(a,Ti.z),c)}static getInterpolatedAttribute(e,t,i,r,s,o){return Na.setScalar(0),Oa.setScalar(0),Fa.setScalar(0),Na.fromBufferAttribute(e,t),Oa.fromBufferAttribute(e,i),Fa.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(Na,s.x),o.addScaledVector(Oa,s.y),o.addScaledVector(Fa,s.z),o}static isFrontFacing(e,t,i,r){return ri.subVectors(i,t),wi.subVectors(e,t),ri.cross(wi).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ri.subVectors(this.c,this.b),wi.subVectors(this.a,this.b),ri.cross(wi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Jn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Jn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,r,s){return Jn.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return Jn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Jn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,r=this.b,s=this.c;let o,a;kr.subVectors(r,i),zr.subVectors(s,i),Da.subVectors(e,i);const c=kr.dot(Da),l=zr.dot(Da);if(c<=0&&l<=0)return t.copy(i);Ia.subVectors(e,r);const u=kr.dot(Ia),h=zr.dot(Ia);if(u>=0&&h<=u)return t.copy(r);const d=c*h-u*l;if(d<=0&&c>=0&&u<=0)return o=c/(c-u),t.copy(i).addScaledVector(kr,o);Ua.subVectors(e,s);const f=kr.dot(Ua),g=zr.dot(Ua);if(g>=0&&f<=g)return t.copy(s);const v=f*l-c*g;if(v<=0&&l>=0&&g<=0)return a=l/(l-g),t.copy(i).addScaledVector(zr,a);const m=u*g-f*h;if(m<=0&&h-u>=0&&f-g>=0)return yu.subVectors(s,r),a=(h-u)/(h-u+(f-g)),t.copy(r).addScaledVector(yu,a);const p=1/(m+v+d);return o=v*p,a=d*p,t.copy(i).addScaledVector(kr,o).addScaledVector(zr,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Jh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},$i={h:0,s:0,l:0},fo={h:0,s:0,l:0};function ka(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class Mt{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=wn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Rt.colorSpaceToWorking(this,t),this}setRGB(e,t,i,r=Rt.workingColorSpace){return this.r=e,this.g=t,this.b=i,Rt.colorSpaceToWorking(this,r),this}setHSL(e,t,i,r=Rt.workingColorSpace){if(e=dl(e,1),t=ft(t,0,1),i=ft(i,0,1),t===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+t):i+t-i*t,o=2*i-s;this.r=ka(o,s,e+1/3),this.g=ka(o,s,e),this.b=ka(o,s,e-1/3)}return Rt.colorSpaceToWorking(this,r),this}setStyle(e,t=wn){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=wn){const i=Jh[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ni(e.r),this.g=Ni(e.g),this.b=Ni(e.b),this}copyLinearToSRGB(e){return this.r=Jr(e.r),this.g=Jr(e.g),this.b=Jr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=wn){return Rt.workingToColorSpace(Sn.copy(this),e),Math.round(ft(Sn.r*255,0,255))*65536+Math.round(ft(Sn.g*255,0,255))*256+Math.round(ft(Sn.b*255,0,255))}getHexString(e=wn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Rt.workingColorSpace){Rt.workingToColorSpace(Sn.copy(this),t);const i=Sn.r,r=Sn.g,s=Sn.b,o=Math.max(i,r,s),a=Math.min(i,r,s);let c,l;const u=(a+o)/2;if(a===o)c=0,l=0;else{const h=o-a;switch(l=u<=.5?h/(o+a):h/(2-o-a),o){case i:c=(r-s)/h+(r<s?6:0);break;case r:c=(s-i)/h+2;break;case s:c=(i-r)/h+4;break}c/=6}return e.h=c,e.s=l,e.l=u,e}getRGB(e,t=Rt.workingColorSpace){return Rt.workingToColorSpace(Sn.copy(this),t),e.r=Sn.r,e.g=Sn.g,e.b=Sn.b,e}getStyle(e=wn){Rt.workingToColorSpace(Sn.copy(this),e);const t=Sn.r,i=Sn.g,r=Sn.b;return e!==wn?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL($i),this.setHSL($i.h+e,$i.s+t,$i.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL($i),e.getHSL(fo);const i=Ps($i.h,fo.h,t),r=Ps($i.s,fo.s,t),s=Ps($i.l,fo.l,t);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*r,this.g=s[1]*t+s[4]*i+s[7]*r,this.b=s[2]*t+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Sn=new Mt;Mt.NAMES=Jh;let yp=0;class ls extends Er{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:yp++}),this.uuid=wr(),this.name="",this.type="Material",this.blending=Zr,this.side=nr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=rc,this.blendDst=sc,this.blendEquation=gr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Mt(0,0,0),this.blendAlpha=0,this.depthFunc=is,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=su,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Pr,this.stencilZFail=Pr,this.stencilZPass=Pr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Zr&&(i.blending=this.blending),this.side!==nr&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==rc&&(i.blendSrc=this.blendSrc),this.blendDst!==sc&&(i.blendDst=this.blendDst),this.blendEquation!==gr&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==is&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==su&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Pr&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Pr&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Pr&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const o=[];for(const a in s){const c=s[a];delete c.metadata,o.push(c)}return o}if(t){const s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Zn extends ls{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Mt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Xn,this.combine=Fh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const tn=new L,po=new ye;let bp=0;class Qn{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:bp++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=ou,this.updateRanges=[],this.gpuType=Di,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)po.fromBufferAttribute(this,t),po.applyMatrix3(e),this.setXY(t,po.x,po.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)tn.fromBufferAttribute(this,t),tn.applyMatrix3(e),this.setXYZ(t,tn.x,tn.y,tn.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)tn.fromBufferAttribute(this,t),tn.applyMatrix4(e),this.setXYZ(t,tn.x,tn.y,tn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)tn.fromBufferAttribute(this,t),tn.applyNormalMatrix(e),this.setXYZ(t,tn.x,tn.y,tn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)tn.fromBufferAttribute(this,t),tn.transformDirection(e),this.setXYZ(t,tn.x,tn.y,tn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=$r(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Pn(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=$r(t,this.array)),t}setX(e,t){return this.normalized&&(t=Pn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=$r(t,this.array)),t}setY(e,t){return this.normalized&&(t=Pn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=$r(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Pn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=$r(t,this.array)),t}setW(e,t){return this.normalized&&(t=Pn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Pn(t,this.array),i=Pn(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=Pn(t,this.array),i=Pn(i,this.array),r=Pn(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=Pn(t,this.array),i=Pn(i,this.array),r=Pn(r,this.array),s=Pn(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==ou&&(e.usage=this.usage),e}}class Qh extends Qn{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class ed extends Qn{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class Dt extends Qn{constructor(e,t,i){super(new Float32Array(e),t,i)}}let Mp=0;const Yn=new Wt,za=new an,Br=new L,Wn=new er,Ss=new er,hn=new L;class cn extends Er{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Mp++}),this.uuid=wr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Zh(e)?ed:Qh)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new dt().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Yn.makeRotationFromQuaternion(e),this.applyMatrix4(Yn),this}rotateX(e){return Yn.makeRotationX(e),this.applyMatrix4(Yn),this}rotateY(e){return Yn.makeRotationY(e),this.applyMatrix4(Yn),this}rotateZ(e){return Yn.makeRotationZ(e),this.applyMatrix4(Yn),this}translate(e,t,i){return Yn.makeTranslation(e,t,i),this.applyMatrix4(Yn),this}scale(e,t,i){return Yn.makeScale(e,t,i),this.applyMatrix4(Yn),this}lookAt(e){return za.lookAt(e),za.updateMatrix(),this.applyMatrix4(za.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Br).negate(),this.translate(Br.x,Br.y,Br.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const o=e[r];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Dt(i,3))}else{const i=Math.min(e.length,t.count);for(let r=0;r<i;r++){const s=e[r];t.setXYZ(r,s.x,s.y,s.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new er);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){const s=t[i];Wn.setFromBufferAttribute(s),this.morphTargetsRelative?(hn.addVectors(this.boundingBox.min,Wn.min),this.boundingBox.expandByPoint(hn),hn.addVectors(this.boundingBox.max,Wn.max),this.boundingBox.expandByPoint(hn)):(this.boundingBox.expandByPoint(Wn.min),this.boundingBox.expandByPoint(Wn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ea);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(e){const i=this.boundingSphere.center;if(Wn.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){const a=t[s];Ss.setFromBufferAttribute(a),this.morphTargetsRelative?(hn.addVectors(Wn.min,Ss.min),Wn.expandByPoint(hn),hn.addVectors(Wn.max,Ss.max),Wn.expandByPoint(hn)):(Wn.expandByPoint(Ss.min),Wn.expandByPoint(Ss.max))}Wn.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)hn.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(hn));if(t)for(let s=0,o=t.length;s<o;s++){const a=t[s],c=this.morphTargetsRelative;for(let l=0,u=a.count;l<u;l++)hn.fromBufferAttribute(a,l),c&&(Br.fromBufferAttribute(e,l),hn.add(Br)),r=Math.max(r,i.distanceToSquared(hn))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Qn(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),a=[],c=[];for(let A=0;A<i.count;A++)a[A]=new L,c[A]=new L;const l=new L,u=new L,h=new L,d=new ye,f=new ye,g=new ye,v=new L,m=new L;function p(A,E,S){l.fromBufferAttribute(i,A),u.fromBufferAttribute(i,E),h.fromBufferAttribute(i,S),d.fromBufferAttribute(s,A),f.fromBufferAttribute(s,E),g.fromBufferAttribute(s,S),u.sub(l),h.sub(l),f.sub(d),g.sub(d);const I=1/(f.x*g.y-g.x*f.y);isFinite(I)&&(v.copy(u).multiplyScalar(g.y).addScaledVector(h,-f.y).multiplyScalar(I),m.copy(h).multiplyScalar(f.x).addScaledVector(u,-g.x).multiplyScalar(I),a[A].add(v),a[E].add(v),a[S].add(v),c[A].add(m),c[E].add(m),c[S].add(m))}let x=this.groups;x.length===0&&(x=[{start:0,count:e.count}]);for(let A=0,E=x.length;A<E;++A){const S=x[A],I=S.start,F=S.count;for(let $=I,H=I+F;$<H;$+=3)p(e.getX($+0),e.getX($+1),e.getX($+2))}const b=new L,y=new L,M=new L,w=new L;function R(A){M.fromBufferAttribute(r,A),w.copy(M);const E=a[A];b.copy(E),b.sub(M.multiplyScalar(M.dot(E))).normalize(),y.crossVectors(w,E);const I=y.dot(c[A])<0?-1:1;o.setXYZW(A,b.x,b.y,b.z,I)}for(let A=0,E=x.length;A<E;++A){const S=x[A],I=S.start,F=S.count;for(let $=I,H=I+F;$<H;$+=3)R(e.getX($+0)),R(e.getX($+1)),R(e.getX($+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Qn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);const r=new L,s=new L,o=new L,a=new L,c=new L,l=new L,u=new L,h=new L;if(e)for(let d=0,f=e.count;d<f;d+=3){const g=e.getX(d+0),v=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,g),s.fromBufferAttribute(t,v),o.fromBufferAttribute(t,m),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),a.fromBufferAttribute(i,g),c.fromBufferAttribute(i,v),l.fromBufferAttribute(i,m),a.add(u),c.add(u),l.add(u),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(v,c.x,c.y,c.z),i.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,f=t.count;d<f;d+=3)r.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),i.setXYZ(d+0,u.x,u.y,u.z),i.setXYZ(d+1,u.x,u.y,u.z),i.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)hn.fromBufferAttribute(e,t),hn.normalize(),e.setXYZ(t,hn.x,hn.y,hn.z)}toNonIndexed(){function e(a,c){const l=a.array,u=a.itemSize,h=a.normalized,d=new l.constructor(c.length*u);let f=0,g=0;for(let v=0,m=c.length;v<m;v++){a.isInterleavedBufferAttribute?f=c[v]*a.data.stride+a.offset:f=c[v]*u;for(let p=0;p<u;p++)d[g++]=l[f++]}return new Qn(d,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new cn,i=this.index.array,r=this.attributes;for(const a in r){const c=r[a],l=e(c,i);t.setAttribute(a,l)}const s=this.morphAttributes;for(const a in s){const c=[],l=s[a];for(let u=0,h=l.length;u<h;u++){const d=l[u],f=e(d,i);c.push(f)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const c in i){const l=i[c];e.data.attributes[c]=l.toJSON(e.data)}const r={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],u=[];for(let h=0,d=l.length;h<d;h++){const f=l[h];u.push(f.toJSON(e.data))}u.length>0&&(r[c]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const r=e.attributes;for(const l in r){const u=r[l];this.setAttribute(l,u.clone(t))}const s=e.morphAttributes;for(const l in s){const u=[],h=s[l];for(let d=0,f=h.length;d<f;d++)u.push(h[d].clone(t));this.morphAttributes[l]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let l=0,u=o.length;l<u;l++){const h=o[l];this.addGroup(h.start,h.count,h.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const bu=new Wt,hr=new ta,mo=new ea,Mu=new L,go=new L,vo=new L,_o=new L,Ba=new L,xo=new L,Su=new L,yo=new L;class Rn extends an{constructor(e=new cn,t=new Zn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(r,e);const a=this.morphTargetInfluences;if(s&&a){xo.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const u=a[c],h=s[c];u!==0&&(Ba.fromBufferAttribute(h,e),o?xo.addScaledVector(Ba,u):xo.addScaledVector(Ba.sub(t),u))}t.add(xo)}return t}raycast(e,t){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),mo.copy(i.boundingSphere),mo.applyMatrix4(s),hr.copy(e.ray).recast(e.near),!(mo.containsPoint(hr.origin)===!1&&(hr.intersectSphere(mo,Mu)===null||hr.origin.distanceToSquared(Mu)>(e.far-e.near)**2))&&(bu.copy(s).invert(),hr.copy(e.ray).applyMatrix4(bu),!(i.boundingBox!==null&&hr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,hr)))}_computeIntersections(e,t,i){let r;const s=this.geometry,o=this.material,a=s.index,c=s.attributes.position,l=s.attributes.uv,u=s.attributes.uv1,h=s.attributes.normal,d=s.groups,f=s.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=o[m.materialIndex],x=Math.max(m.start,f.start),b=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let y=x,M=b;y<M;y+=3){const w=a.getX(y),R=a.getX(y+1),A=a.getX(y+2);r=bo(this,p,e,i,l,u,h,w,R,A),r&&(r.faceIndex=Math.floor(y/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const g=Math.max(0,f.start),v=Math.min(a.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const x=a.getX(m),b=a.getX(m+1),y=a.getX(m+2);r=bo(this,o,e,i,l,u,h,x,b,y),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=o[m.materialIndex],x=Math.max(m.start,f.start),b=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let y=x,M=b;y<M;y+=3){const w=y,R=y+1,A=y+2;r=bo(this,p,e,i,l,u,h,w,R,A),r&&(r.faceIndex=Math.floor(y/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const g=Math.max(0,f.start),v=Math.min(c.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const x=m,b=m+1,y=m+2;r=bo(this,o,e,i,l,u,h,x,b,y),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}}}function Sp(n,e,t,i,r,s,o,a){let c;if(e.side===Bn?c=i.intersectTriangle(o,s,r,!0,a):c=i.intersectTriangle(r,s,o,e.side===nr,a),c===null)return null;yo.copy(a),yo.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(yo);return l<t.near||l>t.far?null:{distance:l,point:yo.clone(),object:n}}function bo(n,e,t,i,r,s,o,a,c,l){n.getVertexPosition(a,go),n.getVertexPosition(c,vo),n.getVertexPosition(l,_o);const u=Sp(n,e,t,i,go,vo,_o,Su);if(u){const h=new L;Jn.getBarycoord(Su,go,vo,_o,h),r&&(u.uv=Jn.getInterpolatedAttribute(r,a,c,l,h,new ye)),s&&(u.uv1=Jn.getInterpolatedAttribute(s,a,c,l,h,new ye)),o&&(u.normal=Jn.getInterpolatedAttribute(o,a,c,l,h,new L),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const d={a,b:c,c:l,normal:new L,materialIndex:0};Jn.getNormal(go,vo,_o,d.normal),u.face=d,u.barycoord=h}return u}class qt extends cn{constructor(e=1,t=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const c=[],l=[],u=[],h=[];let d=0,f=0;g("z","y","x",-1,-1,i,t,e,o,s,0),g("z","y","x",1,-1,i,t,-e,o,s,1),g("x","z","y",1,1,e,i,t,r,o,2),g("x","z","y",1,-1,e,i,-t,r,o,3),g("x","y","z",1,-1,e,t,i,r,s,4),g("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(c),this.setAttribute("position",new Dt(l,3)),this.setAttribute("normal",new Dt(u,3)),this.setAttribute("uv",new Dt(h,2));function g(v,m,p,x,b,y,M,w,R,A,E){const S=y/R,I=M/A,F=y/2,$=M/2,H=w/2,j=R+1,G=A+1;let W=0,U=0;const de=new L;for(let oe=0;oe<G;oe++){const J=oe*I-$;for(let We=0;We<j;We++){const at=We*S-F;de[v]=at*x,de[m]=J*b,de[p]=H,l.push(de.x,de.y,de.z),de[v]=0,de[m]=0,de[p]=w>0?1:-1,u.push(de.x,de.y,de.z),h.push(We/R),h.push(1-oe/A),W+=1}}for(let oe=0;oe<A;oe++)for(let J=0;J<R;J++){const We=d+J+j*oe,at=d+J+j*(oe+1),Fe=d+(J+1)+j*(oe+1),pt=d+(J+1)+j*oe;c.push(We,at,pt),c.push(at,Fe,pt),U+=6}a.addGroup(f,U,E),f+=U,d+=W}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new qt(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function as(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const r=n[t][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone():Array.isArray(r)?e[t][i]=r.slice():e[t][i]=r}}return e}function Ln(n){const e={};for(let t=0;t<n.length;t++){const i=as(n[t]);for(const r in i)e[r]=i[r]}return e}function Ep(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function td(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Rt.workingColorSpace}const wp={clone:as,merge:Ln};var Tp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Ap=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ir extends ls{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Tp,this.fragmentShader=Ap,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=as(e.uniforms),this.uniformsGroups=Ep(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?t.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[r]={type:"m4",value:o.toArray()}:t.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class nd extends an{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Wt,this.projectionMatrix=new Wt,this.projectionMatrixInverse=new Wt,this.coordinateSystem=vi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const qi=new L,Eu=new ye,wu=new ye;class Kn extends nd{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Vs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Kr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Vs*2*Math.atan(Math.tan(Kr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){qi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(qi.x,qi.y).multiplyScalar(-e/qi.z),qi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(qi.x,qi.y).multiplyScalar(-e/qi.z)}getViewSize(e,t){return this.getViewBounds(e,Eu,wu),t.subVectors(wu,Eu)}setViewOffset(e,t,i,r,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Kr*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;s+=o.offsetX*r/c,t-=o.offsetY*i/l,r*=o.width/c,i*=o.height/l}const a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Vr=-90,Hr=1;class Rp extends an{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Kn(Vr,Hr,e,t);r.layers=this.layers,this.add(r);const s=new Kn(Vr,Hr,e,t);s.layers=this.layers,this.add(s);const o=new Kn(Vr,Hr,e,t);o.layers=this.layers,this.add(o);const a=new Kn(Vr,Hr,e,t);a.layers=this.layers,this.add(a);const c=new Kn(Vr,Hr,e,t);c.layers=this.layers,this.add(c);const l=new Kn(Vr,Hr,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,r,s,o,a,c]=t;for(const l of t)this.remove(l);if(e===vi)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Ho)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,c,l,u]=this.children,h=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(t,s),e.setRenderTarget(i,1,r),e.render(t,o),e.setRenderTarget(i,2,r),e.render(t,a),e.setRenderTarget(i,3,r),e.render(t,c),e.setRenderTarget(i,4,r),e.render(t,l),i.texture.generateMipmaps=v,e.setRenderTarget(i,5,r),e.render(t,u),e.setRenderTarget(h,d,f),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class id extends Un{constructor(e=[],t=rs,i,r,s,o,a,c,l,u){super(e,t,i,r,s,o,a,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Cp extends Mr{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new id(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new qt(5,5,5),s=new ir({name:"CubemapFromEquirect",uniforms:as(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Bn,blending:Ji});s.uniforms.tEquirect.value=t;const o=new Rn(r,s),a=t.minFilter;return t.minFilter===Zi&&(t.minFilter=ai),new Rp(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,i=!0,r=!0){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,r);e.setRenderTarget(s)}}class jt extends an{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Pp={type:"move"};class Va{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new jt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new jt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new jt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){o=!0;for(const v of e.hand.values()){const m=t.getJointPose(v,i),p=this._getHandJoint(l,v);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const u=l.joints["index-finger-tip"],h=l.joints["thumb-tip"],d=u.position.distanceTo(h.position),f=.02,g=.005;l.inputState.pinching&&d>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&d<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Pp)))}return a!==null&&(a.visible=r!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new jt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class ml{constructor(e,t=1,i=1e3){this.isFog=!0,this.name="",this.color=new Mt(e),this.near=t,this.far=i}clone(){return new ml(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Lp extends an{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Xn,this.environmentIntensity=1,this.environmentRotation=new Xn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Ha=new L,Dp=new L,Ip=new dt;class Ci{constructor(e=new L(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const r=Ha.subVectors(i,t).cross(Dp.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(Ha),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||Ip.getNormalMatrix(e),r=this.coplanarPoint(Ha).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const dr=new ea,Up=new ye(.5,.5),Mo=new L;class gl{constructor(e=new Ci,t=new Ci,i=new Ci,r=new Ci,s=new Ci,o=new Ci){this.planes=[e,t,i,r,s,o]}set(e,t,i,r,s,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=vi,i=!1){const r=this.planes,s=e.elements,o=s[0],a=s[1],c=s[2],l=s[3],u=s[4],h=s[5],d=s[6],f=s[7],g=s[8],v=s[9],m=s[10],p=s[11],x=s[12],b=s[13],y=s[14],M=s[15];if(r[0].setComponents(l-o,f-u,p-g,M-x).normalize(),r[1].setComponents(l+o,f+u,p+g,M+x).normalize(),r[2].setComponents(l+a,f+h,p+v,M+b).normalize(),r[3].setComponents(l-a,f-h,p-v,M-b).normalize(),i)r[4].setComponents(c,d,m,y).normalize(),r[5].setComponents(l-c,f-d,p-m,M-y).normalize();else if(r[4].setComponents(l-c,f-d,p-m,M-y).normalize(),t===vi)r[5].setComponents(l+c,f+d,p+m,M+y).normalize();else if(t===Ho)r[5].setComponents(c,d,m,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),dr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),dr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(dr)}intersectsSprite(e){dr.center.set(0,0,0);const t=Up.distanceTo(e.center);return dr.radius=.7071067811865476+t,dr.applyMatrix4(e.matrixWorld),this.intersectsSphere(dr)}intersectsSphere(e){const t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const r=t[i];if(Mo.x=r.normal.x>0?e.max.x:e.min.x,Mo.y=r.normal.y>0?e.max.y:e.min.y,Mo.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Mo)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Wo extends ls{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Mt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const $o=new L,qo=new L,Tu=new Wt,Es=new ta,So=new ea,Ga=new L,Au=new L;class $c extends an{constructor(e=new cn,t=new Wo){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let r=1,s=t.count;r<s;r++)$o.fromBufferAttribute(t,r-1),qo.fromBufferAttribute(t,r),i[r]=i[r-1],i[r]+=$o.distanceTo(qo);e.setAttribute("lineDistance",new Dt(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),So.copy(i.boundingSphere),So.applyMatrix4(r),So.radius+=s,e.ray.intersectsSphere(So)===!1)return;Tu.copy(r).invert(),Es.copy(e.ray).applyMatrix4(Tu);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,u=i.index,d=i.attributes.position;if(u!==null){const f=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let v=f,m=g-1;v<m;v+=l){const p=u.getX(v),x=u.getX(v+1),b=Eo(this,e,Es,c,p,x,v);b&&t.push(b)}if(this.isLineLoop){const v=u.getX(g-1),m=u.getX(f),p=Eo(this,e,Es,c,v,m,g-1);p&&t.push(p)}}else{const f=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let v=f,m=g-1;v<m;v+=l){const p=Eo(this,e,Es,c,v,v+1,v);p&&t.push(p)}if(this.isLineLoop){const v=Eo(this,e,Es,c,g-1,f,g-1);v&&t.push(v)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function Eo(n,e,t,i,r,s,o){const a=n.geometry.attributes.position;if($o.fromBufferAttribute(a,r),qo.fromBufferAttribute(a,s),t.distanceSqToSegment($o,qo,Ga,Au)>i)return;Ga.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(Ga);if(!(l<e.near||l>e.far))return{distance:l,point:Au.clone().applyMatrix4(n.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:n}}const Ru=new L,Cu=new L;class Np extends $c{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let r=0,s=t.count;r<s;r+=2)Ru.fromBufferAttribute(t,r),Cu.fromBufferAttribute(t,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+Ru.distanceTo(Cu);e.setAttribute("lineDistance",new Dt(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class qc extends Un{constructor(e,t,i,r,s,o,a,c,l){super(e,t,i,r,s,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class rd extends Un{constructor(e,t,i=br,r,s,o,a=li,c=li,l,u=zs,h=1){if(u!==zs&&u!==Bs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:t,depth:h};super(d,r,s,o,a,c,u,i,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new fl(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class sd extends Un{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class vl extends cn{constructor(e=1,t=1,i=4,r=8,s=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:i,radialSegments:r,heightSegments:s},t=Math.max(0,t),i=Math.max(1,Math.floor(i)),r=Math.max(3,Math.floor(r)),s=Math.max(1,Math.floor(s));const o=[],a=[],c=[],l=[],u=t/2,h=Math.PI/2*e,d=t,f=2*h+d,g=i*2+s,v=r+1,m=new L,p=new L;for(let x=0;x<=g;x++){let b=0,y=0,M=0,w=0;if(x<=i){const E=x/i,S=E*Math.PI/2;y=-u-e*Math.cos(S),M=e*Math.sin(S),w=-e*Math.cos(S),b=E*h}else if(x<=i+s){const E=(x-i)/s;y=-u+E*t,M=e,w=0,b=h+E*d}else{const E=(x-i-s)/i,S=E*Math.PI/2;y=u+e*Math.sin(S),M=e*Math.cos(S),w=e*Math.sin(S),b=h+d+E*h}const R=Math.max(0,Math.min(1,b/f));let A=0;x===0?A=.5/r:x===g&&(A=-.5/r);for(let E=0;E<=r;E++){const S=E/r,I=S*Math.PI*2,F=Math.sin(I),$=Math.cos(I);p.x=-M*$,p.y=y,p.z=M*F,a.push(p.x,p.y,p.z),m.set(-M*$,w,M*F),m.normalize(),c.push(m.x,m.y,m.z),l.push(S+A,R)}if(x>0){const E=(x-1)*v;for(let S=0;S<r;S++){const I=E+S,F=E+S+1,$=x*v+S,H=x*v+S+1;o.push(I,F,$),o.push(F,H,$)}}}this.setIndex(o),this.setAttribute("position",new Dt(a,3)),this.setAttribute("normal",new Dt(c,3)),this.setAttribute("uv",new Dt(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new vl(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}}class ht extends cn{constructor(e=1,t=1,i=1,r=32,s=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:r,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:c};const l=this;r=Math.floor(r),s=Math.floor(s);const u=[],h=[],d=[],f=[];let g=0;const v=[],m=i/2;let p=0;x(),o===!1&&(e>0&&b(!0),t>0&&b(!1)),this.setIndex(u),this.setAttribute("position",new Dt(h,3)),this.setAttribute("normal",new Dt(d,3)),this.setAttribute("uv",new Dt(f,2));function x(){const y=new L,M=new L;let w=0;const R=(t-e)/i;for(let A=0;A<=s;A++){const E=[],S=A/s,I=S*(t-e)+e;for(let F=0;F<=r;F++){const $=F/r,H=$*c+a,j=Math.sin(H),G=Math.cos(H);M.x=I*j,M.y=-S*i+m,M.z=I*G,h.push(M.x,M.y,M.z),y.set(j,R,G).normalize(),d.push(y.x,y.y,y.z),f.push($,1-S),E.push(g++)}v.push(E)}for(let A=0;A<r;A++)for(let E=0;E<s;E++){const S=v[E][A],I=v[E+1][A],F=v[E+1][A+1],$=v[E][A+1];(e>0||E!==0)&&(u.push(S,I,$),w+=3),(t>0||E!==s-1)&&(u.push(I,F,$),w+=3)}l.addGroup(p,w,0),p+=w}function b(y){const M=g,w=new ye,R=new L;let A=0;const E=y===!0?e:t,S=y===!0?1:-1;for(let F=1;F<=r;F++)h.push(0,m*S,0),d.push(0,S,0),f.push(.5,.5),g++;const I=g;for(let F=0;F<=r;F++){const H=F/r*c+a,j=Math.cos(H),G=Math.sin(H);R.x=E*G,R.y=m*S,R.z=E*j,h.push(R.x,R.y,R.z),d.push(0,S,0),w.x=j*.5+.5,w.y=G*.5*S+.5,f.push(w.x,w.y),g++}for(let F=0;F<r;F++){const $=M+F,H=I+F;y===!0?u.push(H,H+1,$):u.push(H+1,H,$),A+=3}l.addGroup(p,A,y===!0?1:2),p+=A}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ht(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class _l extends ht{constructor(e=1,t=1,i=32,r=1,s=!1,o=0,a=Math.PI*2){super(0,e,t,i,r,s,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:r,openEnded:s,thetaStart:o,thetaLength:a}}static fromJSON(e){return new _l(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}const wo=new L,To=new L,Wa=new L,Ao=new Jn;class Op extends cn{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){const r=Math.pow(10,4),s=Math.cos(Kr*t),o=e.getIndex(),a=e.getAttribute("position"),c=o?o.count:a.count,l=[0,0,0],u=["a","b","c"],h=new Array(3),d={},f=[];for(let g=0;g<c;g+=3){o?(l[0]=o.getX(g),l[1]=o.getX(g+1),l[2]=o.getX(g+2)):(l[0]=g,l[1]=g+1,l[2]=g+2);const{a:v,b:m,c:p}=Ao;if(v.fromBufferAttribute(a,l[0]),m.fromBufferAttribute(a,l[1]),p.fromBufferAttribute(a,l[2]),Ao.getNormal(Wa),h[0]=`${Math.round(v.x*r)},${Math.round(v.y*r)},${Math.round(v.z*r)}`,h[1]=`${Math.round(m.x*r)},${Math.round(m.y*r)},${Math.round(m.z*r)}`,h[2]=`${Math.round(p.x*r)},${Math.round(p.y*r)},${Math.round(p.z*r)}`,!(h[0]===h[1]||h[1]===h[2]||h[2]===h[0]))for(let x=0;x<3;x++){const b=(x+1)%3,y=h[x],M=h[b],w=Ao[u[x]],R=Ao[u[b]],A=`${y}_${M}`,E=`${M}_${y}`;E in d&&d[E]?(Wa.dot(d[E].normal)<=s&&(f.push(w.x,w.y,w.z),f.push(R.x,R.y,R.z)),d[E]=null):A in d||(d[A]={index0:l[x],index1:l[b],normal:Wa.clone()})}}for(const g in d)if(d[g]){const{index0:v,index1:m}=d[g];wo.fromBufferAttribute(a,v),To.fromBufferAttribute(a,m),f.push(wo.x,wo.y,wo.z),f.push(To.x,To.y,To.z)}this.setAttribute("position",new Dt(f,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class xi{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){const i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let i,r=this.getPoint(0),s=0;t.push(0);for(let o=1;o<=e;o++)i=this.getPoint(o/e),s+=i.distanceTo(r),t.push(s),r=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const i=this.getLengths();let r=0;const s=i.length;let o;t?o=t:o=e*i[s-1];let a=0,c=s-1,l;for(;a<=c;)if(r=Math.floor(a+(c-a)/2),l=i[r]-o,l<0)a=r+1;else if(l>0)c=r-1;else{c=r;break}if(r=c,i[r]===o)return r/(s-1);const u=i[r],d=i[r+1]-u,f=(o-u)/d;return(r+f)/(s-1)}getTangent(e,t){let r=e-1e-4,s=e+1e-4;r<0&&(r=0),s>1&&(s=1);const o=this.getPoint(r),a=this.getPoint(s),c=t||(o.isVector2?new ye:new L);return c.copy(a).sub(o).normalize(),c}getTangentAt(e,t){const i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){const i=new L,r=[],s=[],o=[],a=new L,c=new Wt;for(let f=0;f<=e;f++){const g=f/e;r[f]=this.getTangentAt(g,new L)}s[0]=new L,o[0]=new L;let l=Number.MAX_VALUE;const u=Math.abs(r[0].x),h=Math.abs(r[0].y),d=Math.abs(r[0].z);u<=l&&(l=u,i.set(1,0,0)),h<=l&&(l=h,i.set(0,1,0)),d<=l&&i.set(0,0,1),a.crossVectors(r[0],i).normalize(),s[0].crossVectors(r[0],a),o[0].crossVectors(r[0],s[0]);for(let f=1;f<=e;f++){if(s[f]=s[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(r[f-1],r[f]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(ft(r[f-1].dot(r[f]),-1,1));s[f].applyMatrix4(c.makeRotationAxis(a,g))}o[f].crossVectors(r[f],s[f])}if(t===!0){let f=Math.acos(ft(s[0].dot(s[e]),-1,1));f/=e,r[0].dot(a.crossVectors(s[0],s[e]))>0&&(f=-f);for(let g=1;g<=e;g++)s[g].applyMatrix4(c.makeRotationAxis(r[g],f*g)),o[g].crossVectors(r[g],s[g])}return{tangents:r,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class xl extends xi{constructor(e=0,t=0,i=1,r=1,s=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=r,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(e,t=new ye){const i=t,r=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=r;for(;s>r;)s-=r;s<Number.EPSILON&&(o?s=0:s=r),this.aClockwise===!0&&!o&&(s===r?s=-r:s=s-r);const a=this.aStartAngle+e*s;let c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const u=Math.cos(this.aRotation),h=Math.sin(this.aRotation),d=c-this.aX,f=l-this.aY;c=d*u-f*h+this.aX,l=d*h+f*u+this.aY}return i.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class Fp extends xl{constructor(e,t,i,r,s,o){super(e,t,i,i,r,s,o),this.isArcCurve=!0,this.type="ArcCurve"}}function yl(){let n=0,e=0,t=0,i=0;function r(s,o,a,c){n=s,e=a,t=-3*s+3*o-2*a-c,i=2*s-2*o+a+c}return{initCatmullRom:function(s,o,a,c,l){r(o,a,l*(a-s),l*(c-o))},initNonuniformCatmullRom:function(s,o,a,c,l,u,h){let d=(o-s)/l-(a-s)/(l+u)+(a-o)/u,f=(a-o)/u-(c-o)/(u+h)+(c-a)/h;d*=u,f*=u,r(o,a,d,f)},calc:function(s){const o=s*s,a=o*s;return n+e*s+t*o+i*a}}}const Ro=new L,$a=new yl,qa=new yl,Xa=new yl;class bl extends xi{constructor(e=[],t=!1,i="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=r}getPoint(e,t=new L){const i=t,r=this.points,s=r.length,o=(s-(this.closed?0:1))*e;let a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/s)+1)*s:c===0&&a===s-1&&(a=s-2,c=1);let l,u;this.closed||a>0?l=r[(a-1)%s]:(Ro.subVectors(r[0],r[1]).add(r[0]),l=Ro);const h=r[a%s],d=r[(a+1)%s];if(this.closed||a+2<s?u=r[(a+2)%s]:(Ro.subVectors(r[s-1],r[s-2]).add(r[s-1]),u=Ro),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(h),f),v=Math.pow(h.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(u),f);v<1e-4&&(v=1),g<1e-4&&(g=v),m<1e-4&&(m=v),$a.initNonuniformCatmullRom(l.x,h.x,d.x,u.x,g,v,m),qa.initNonuniformCatmullRom(l.y,h.y,d.y,u.y,g,v,m),Xa.initNonuniformCatmullRom(l.z,h.z,d.z,u.z,g,v,m)}else this.curveType==="catmullrom"&&($a.initCatmullRom(l.x,h.x,d.x,u.x,this.tension),qa.initCatmullRom(l.y,h.y,d.y,u.y,this.tension),Xa.initCatmullRom(l.z,h.z,d.z,u.z,this.tension));return i.set($a.calc(c),qa.calc(c),Xa.calc(c)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(r.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const r=this.points[t];e.points.push(r.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(new L().fromArray(r))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function Pu(n,e,t,i,r){const s=(i-e)*.5,o=(r-t)*.5,a=n*n,c=n*a;return(2*t-2*i+s+o)*c+(-3*t+3*i-2*s-o)*a+s*n+t}function kp(n,e){const t=1-n;return t*t*e}function zp(n,e){return 2*(1-n)*n*e}function Bp(n,e){return n*n*e}function Ls(n,e,t,i){return kp(n,e)+zp(n,t)+Bp(n,i)}function Vp(n,e){const t=1-n;return t*t*t*e}function Hp(n,e){const t=1-n;return 3*t*t*n*e}function Gp(n,e){return 3*(1-n)*n*n*e}function Wp(n,e){return n*n*n*e}function Ds(n,e,t,i,r){return Vp(n,e)+Hp(n,t)+Gp(n,i)+Wp(n,r)}class od extends xi{constructor(e=new ye,t=new ye,i=new ye,r=new ye){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=r}getPoint(e,t=new ye){const i=t,r=this.v0,s=this.v1,o=this.v2,a=this.v3;return i.set(Ds(e,r.x,s.x,o.x,a.x),Ds(e,r.y,s.y,o.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class $p extends xi{constructor(e=new L,t=new L,i=new L,r=new L){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=r}getPoint(e,t=new L){const i=t,r=this.v0,s=this.v1,o=this.v2,a=this.v3;return i.set(Ds(e,r.x,s.x,o.x,a.x),Ds(e,r.y,s.y,o.y,a.y),Ds(e,r.z,s.z,o.z,a.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class ad extends xi{constructor(e=new ye,t=new ye){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ye){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ye){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class qp extends xi{constructor(e=new L,t=new L){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new L){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new L){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class cd extends xi{constructor(e=new ye,t=new ye,i=new ye){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new ye){const i=t,r=this.v0,s=this.v1,o=this.v2;return i.set(Ls(e,r.x,s.x,o.x),Ls(e,r.y,s.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Ml extends xi{constructor(e=new L,t=new L,i=new L){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new L){const i=t,r=this.v0,s=this.v1,o=this.v2;return i.set(Ls(e,r.x,s.x,o.x),Ls(e,r.y,s.y,o.y),Ls(e,r.z,s.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class ld extends xi{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ye){const i=t,r=this.points,s=(r.length-1)*e,o=Math.floor(s),a=s-o,c=r[o===0?o:o-1],l=r[o],u=r[o>r.length-2?r.length-1:o+1],h=r[o>r.length-3?r.length-1:o+2];return i.set(Pu(a,c.x,l.x,u.x,h.x),Pu(a,c.y,l.y,u.y,h.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(r.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const r=this.points[t];e.points.push(r.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(new ye().fromArray(r))}return this}}var Xo=Object.freeze({__proto__:null,ArcCurve:Fp,CatmullRomCurve3:bl,CubicBezierCurve:od,CubicBezierCurve3:$p,EllipseCurve:xl,LineCurve:ad,LineCurve3:qp,QuadraticBezierCurve:cd,QuadraticBezierCurve3:Ml,SplineCurve:ld});class Xp extends xi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Xo[i](t,e))}return this}getPoint(e,t){const i=e*this.getLength(),r=this.getCurveLengths();let s=0;for(;s<r.length;){if(r[s]>=i){const o=r[s]-i,a=this.curves[s],c=a.getLength(),l=c===0?0:1-o/c;return a.getPointAt(l,t)}s++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let i=0,r=this.curves.length;i<r;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let i;for(let r=0,s=this.curves;r<s.length;r++){const o=s[r],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,c=o.getPoints(a);for(let l=0;l<c.length;l++){const u=c[l];i&&i.equals(u)||(t.push(u),i=u)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const r=e.curves[t];this.curves.push(r.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){const r=this.curves[t];e.curves.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const r=e.curves[t];this.curves.push(new Xo[r.type]().fromJSON(r))}return this}}class Lu extends Xp{constructor(e){super(),this.type="Path",this.currentPoint=new ye,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const i=new ad(this.currentPoint.clone(),new ye(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,r){const s=new cd(this.currentPoint.clone(),new ye(e,t),new ye(i,r));return this.curves.push(s),this.currentPoint.set(i,r),this}bezierCurveTo(e,t,i,r,s,o){const a=new od(this.currentPoint.clone(),new ye(e,t),new ye(i,r),new ye(s,o));return this.curves.push(a),this.currentPoint.set(s,o),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),i=new ld(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,r,s,o){const a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+a,t+c,i,r,s,o),this}absarc(e,t,i,r,s,o){return this.absellipse(e,t,i,i,r,s,o),this}ellipse(e,t,i,r,s,o,a,c){const l=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(e+l,t+u,i,r,s,o,a,c),this}absellipse(e,t,i,r,s,o,a,c){const l=new xl(e,t,i,r,s,o,a,c);if(this.curves.length>0){const h=l.getPoint(0);h.equals(this.currentPoint)||this.lineTo(h.x,h.y)}this.curves.push(l);const u=l.getPoint(1);return this.currentPoint.copy(u),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class ud extends Lu{constructor(e){super(e),this.uuid=wr(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let i=0,r=this.holes.length;i<r;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const r=e.holes[t];this.holes.push(r.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){const r=this.holes[t];e.holes.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const r=e.holes[t];this.holes.push(new Lu().fromJSON(r))}return this}}function Yp(n,e,t=2){const i=e&&e.length,r=i?e[0]*t:n.length;let s=hd(n,0,r,t,!0);const o=[];if(!s||s.next===s.prev)return o;let a,c,l;if(i&&(s=Qp(n,e,s,t)),n.length>80*t){a=1/0,c=1/0;let u=-1/0,h=-1/0;for(let d=t;d<r;d+=t){const f=n[d],g=n[d+1];f<a&&(a=f),g<c&&(c=g),f>u&&(u=f),g>h&&(h=g)}l=Math.max(u-a,h-c),l=l!==0?32767/l:0}return Gs(s,o,t,a,c,l,0),o}function hd(n,e,t,i,r){let s;if(r===um(n,e,t,i)>0)for(let o=e;o<t;o+=i)s=Du(o/i|0,n[o],n[o+1],s);else for(let o=t-i;o>=e;o-=i)s=Du(o/i|0,n[o],n[o+1],s);return s&&cs(s,s.next)&&($s(s),s=s.next),s}function Sr(n,e){if(!n)return n;e||(e=n);let t=n,i;do if(i=!1,!t.steiner&&(cs(t,t.next)||Yt(t.prev,t,t.next)===0)){if($s(t),t=e=t.prev,t===t.next)break;i=!0}else t=t.next;while(i||t!==e);return e}function Gs(n,e,t,i,r,s,o){if(!n)return;!o&&s&&rm(n,i,r,s);let a=n;for(;n.prev!==n.next;){const c=n.prev,l=n.next;if(s?Zp(n,i,r,s):jp(n)){e.push(c.i,n.i,l.i),$s(n),n=l.next,a=l.next;continue}if(n=l,n===a){o?o===1?(n=Kp(Sr(n),e),Gs(n,e,t,i,r,s,2)):o===2&&Jp(n,e,t,i,r,s):Gs(Sr(n),e,t,i,r,s,1);break}}}function jp(n){const e=n.prev,t=n,i=n.next;if(Yt(e,t,i)>=0)return!1;const r=e.x,s=t.x,o=i.x,a=e.y,c=t.y,l=i.y,u=Math.min(r,s,o),h=Math.min(a,c,l),d=Math.max(r,s,o),f=Math.max(a,c,l);let g=i.next;for(;g!==e;){if(g.x>=u&&g.x<=d&&g.y>=h&&g.y<=f&&As(r,a,s,c,o,l,g.x,g.y)&&Yt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Zp(n,e,t,i){const r=n.prev,s=n,o=n.next;if(Yt(r,s,o)>=0)return!1;const a=r.x,c=s.x,l=o.x,u=r.y,h=s.y,d=o.y,f=Math.min(a,c,l),g=Math.min(u,h,d),v=Math.max(a,c,l),m=Math.max(u,h,d),p=Xc(f,g,e,t,i),x=Xc(v,m,e,t,i);let b=n.prevZ,y=n.nextZ;for(;b&&b.z>=p&&y&&y.z<=x;){if(b.x>=f&&b.x<=v&&b.y>=g&&b.y<=m&&b!==r&&b!==o&&As(a,u,c,h,l,d,b.x,b.y)&&Yt(b.prev,b,b.next)>=0||(b=b.prevZ,y.x>=f&&y.x<=v&&y.y>=g&&y.y<=m&&y!==r&&y!==o&&As(a,u,c,h,l,d,y.x,y.y)&&Yt(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;b&&b.z>=p;){if(b.x>=f&&b.x<=v&&b.y>=g&&b.y<=m&&b!==r&&b!==o&&As(a,u,c,h,l,d,b.x,b.y)&&Yt(b.prev,b,b.next)>=0)return!1;b=b.prevZ}for(;y&&y.z<=x;){if(y.x>=f&&y.x<=v&&y.y>=g&&y.y<=m&&y!==r&&y!==o&&As(a,u,c,h,l,d,y.x,y.y)&&Yt(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function Kp(n,e){let t=n;do{const i=t.prev,r=t.next.next;!cs(i,r)&&fd(i,t,t.next,r)&&Ws(i,r)&&Ws(r,i)&&(e.push(i.i,t.i,r.i),$s(t),$s(t.next),t=n=r),t=t.next}while(t!==n);return Sr(t)}function Jp(n,e,t,i,r,s){let o=n;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&am(o,a)){let c=pd(o,a);o=Sr(o,o.next),c=Sr(c,c.next),Gs(o,e,t,i,r,s,0),Gs(c,e,t,i,r,s,0);return}a=a.next}o=o.next}while(o!==n)}function Qp(n,e,t,i){const r=[];for(let s=0,o=e.length;s<o;s++){const a=e[s]*i,c=s<o-1?e[s+1]*i:n.length,l=hd(n,a,c,i,!1);l===l.next&&(l.steiner=!0),r.push(om(l))}r.sort(em);for(let s=0;s<r.length;s++)t=tm(r[s],t);return t}function em(n,e){let t=n.x-e.x;if(t===0&&(t=n.y-e.y,t===0)){const i=(n.next.y-n.y)/(n.next.x-n.x),r=(e.next.y-e.y)/(e.next.x-e.x);t=i-r}return t}function tm(n,e){const t=nm(n,e);if(!t)return e;const i=pd(t,n);return Sr(i,i.next),Sr(t,t.next)}function nm(n,e){let t=e;const i=n.x,r=n.y;let s=-1/0,o;if(cs(n,t))return t;do{if(cs(n,t.next))return t.next;if(r<=t.y&&r>=t.next.y&&t.next.y!==t.y){const h=t.x+(r-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(h<=i&&h>s&&(s=h,o=t.x<t.next.x?t:t.next,h===i))return o}t=t.next}while(t!==e);if(!o)return null;const a=o,c=o.x,l=o.y;let u=1/0;t=o;do{if(i>=t.x&&t.x>=c&&i!==t.x&&dd(r<l?i:s,r,c,l,r<l?s:i,r,t.x,t.y)){const h=Math.abs(r-t.y)/(i-t.x);Ws(t,n)&&(h<u||h===u&&(t.x>o.x||t.x===o.x&&im(o,t)))&&(o=t,u=h)}t=t.next}while(t!==a);return o}function im(n,e){return Yt(n.prev,n,e.prev)<0&&Yt(e.next,n,n.next)<0}function rm(n,e,t,i){let r=n;do r.z===0&&(r.z=Xc(r.x,r.y,e,t,i)),r.prevZ=r.prev,r.nextZ=r.next,r=r.next;while(r!==n);r.prevZ.nextZ=null,r.prevZ=null,sm(r)}function sm(n){let e,t=1;do{let i=n,r;n=null;let s=null;for(e=0;i;){e++;let o=i,a=0;for(let l=0;l<t&&(a++,o=o.nextZ,!!o);l++);let c=t;for(;a>0||c>0&&o;)a!==0&&(c===0||!o||i.z<=o.z)?(r=i,i=i.nextZ,a--):(r=o,o=o.nextZ,c--),s?s.nextZ=r:n=r,r.prevZ=s,s=r;i=o}s.nextZ=null,t*=2}while(e>1);return n}function Xc(n,e,t,i,r){return n=(n-t)*r|0,e=(e-i)*r|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,n|e<<1}function om(n){let e=n,t=n;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==n);return t}function dd(n,e,t,i,r,s,o,a){return(r-o)*(e-a)>=(n-o)*(s-a)&&(n-o)*(i-a)>=(t-o)*(e-a)&&(t-o)*(s-a)>=(r-o)*(i-a)}function As(n,e,t,i,r,s,o,a){return!(n===o&&e===a)&&dd(n,e,t,i,r,s,o,a)}function am(n,e){return n.next.i!==e.i&&n.prev.i!==e.i&&!cm(n,e)&&(Ws(n,e)&&Ws(e,n)&&lm(n,e)&&(Yt(n.prev,n,e.prev)||Yt(n,e.prev,e))||cs(n,e)&&Yt(n.prev,n,n.next)>0&&Yt(e.prev,e,e.next)>0)}function Yt(n,e,t){return(e.y-n.y)*(t.x-e.x)-(e.x-n.x)*(t.y-e.y)}function cs(n,e){return n.x===e.x&&n.y===e.y}function fd(n,e,t,i){const r=Po(Yt(n,e,t)),s=Po(Yt(n,e,i)),o=Po(Yt(t,i,n)),a=Po(Yt(t,i,e));return!!(r!==s&&o!==a||r===0&&Co(n,t,e)||s===0&&Co(n,i,e)||o===0&&Co(t,n,i)||a===0&&Co(t,e,i))}function Co(n,e,t){return e.x<=Math.max(n.x,t.x)&&e.x>=Math.min(n.x,t.x)&&e.y<=Math.max(n.y,t.y)&&e.y>=Math.min(n.y,t.y)}function Po(n){return n>0?1:n<0?-1:0}function cm(n,e){let t=n;do{if(t.i!==n.i&&t.next.i!==n.i&&t.i!==e.i&&t.next.i!==e.i&&fd(t,t.next,n,e))return!0;t=t.next}while(t!==n);return!1}function Ws(n,e){return Yt(n.prev,n,n.next)<0?Yt(n,e,n.next)>=0&&Yt(n,n.prev,e)>=0:Yt(n,e,n.prev)<0||Yt(n,n.next,e)<0}function lm(n,e){let t=n,i=!1;const r=(n.x+e.x)/2,s=(n.y+e.y)/2;do t.y>s!=t.next.y>s&&t.next.y!==t.y&&r<(t.next.x-t.x)*(s-t.y)/(t.next.y-t.y)+t.x&&(i=!i),t=t.next;while(t!==n);return i}function pd(n,e){const t=Yc(n.i,n.x,n.y),i=Yc(e.i,e.x,e.y),r=n.next,s=e.prev;return n.next=e,e.prev=n,t.next=r,r.prev=t,i.next=t,t.prev=i,s.next=i,i.prev=s,i}function Du(n,e,t,i){const r=Yc(n,e,t);return i?(r.next=i.next,r.prev=i,i.next.prev=r,i.next=r):(r.prev=r,r.next=r),r}function $s(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Yc(n,e,t){return{i:n,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function um(n,e,t,i){let r=0;for(let s=e,o=t-i;s<t;s+=i)r+=(n[o]-n[s])*(n[s+1]+n[o+1]),o=s;return r}class hm{static triangulate(e,t,i=2){return Yp(e,t,i)}}class Xr{static area(e){const t=e.length;let i=0;for(let r=t-1,s=0;s<t;r=s++)i+=e[r].x*e[s].y-e[s].x*e[r].y;return i*.5}static isClockWise(e){return Xr.area(e)<0}static triangulateShape(e,t){const i=[],r=[],s=[];Iu(e),Uu(i,e);let o=e.length;t.forEach(Iu);for(let c=0;c<t.length;c++)r.push(o),o+=t[c].length,Uu(i,t[c]);const a=hm.triangulate(i,r);for(let c=0;c<a.length;c+=3)s.push(a.slice(c,c+3));return s}}function Iu(n){const e=n.length;e>2&&n[e-1].equals(n[0])&&n.pop()}function Uu(n,e){for(let t=0;t<e.length;t++)n.push(e[t].x),n.push(e[t].y)}class Sl extends cn{constructor(e=new ud([new ye(.5,.5),new ye(-.5,.5),new ye(-.5,-.5),new ye(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const i=this,r=[],s=[];for(let a=0,c=e.length;a<c;a++){const l=e[a];o(l)}this.setAttribute("position",new Dt(r,3)),this.setAttribute("uv",new Dt(s,2)),this.computeVertexNormals();function o(a){const c=[],l=t.curveSegments!==void 0?t.curveSegments:12,u=t.steps!==void 0?t.steps:1,h=t.depth!==void 0?t.depth:1;let d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:f-.1,v=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3;const p=t.extrudePath,x=t.UVGenerator!==void 0?t.UVGenerator:dm;let b,y=!1,M,w,R,A;p&&(b=p.getSpacedPoints(u),y=!0,d=!1,M=p.computeFrenetFrames(u,!1),w=new L,R=new L,A=new L),d||(m=0,f=0,g=0,v=0);const E=a.extractPoints(l);let S=E.shape;const I=E.holes;if(!Xr.isClockWise(S)){S=S.reverse();for(let fe=0,ue=I.length;fe<ue;fe++){const ie=I[fe];Xr.isClockWise(ie)&&(I[fe]=ie.reverse())}}function $(fe){const ie=10000000000000001e-36;let ae=fe[0];for(let Ee=1;Ee<=fe.length;Ee++){const pe=Ee%fe.length,Se=fe[pe],Qe=Se.x-ae.x,nt=Se.y-ae.y,D=Qe*Qe+nt*nt,T=Math.max(Math.abs(Se.x),Math.abs(Se.y),Math.abs(ae.x),Math.abs(ae.y)),Z=ie*T*T;if(D<=Z){fe.splice(pe,1),Ee--;continue}ae=Se}}$(S),I.forEach($);const H=I.length,j=S;for(let fe=0;fe<H;fe++){const ue=I[fe];S=S.concat(ue)}function G(fe,ue,ie){return ue||console.error("THREE.ExtrudeGeometry: vec does not exist"),fe.clone().addScaledVector(ue,ie)}const W=S.length;function U(fe,ue,ie){let ae,Ee,pe;const Se=fe.x-ue.x,Qe=fe.y-ue.y,nt=ie.x-fe.x,D=ie.y-fe.y,T=Se*Se+Qe*Qe,Z=Se*D-Qe*nt;if(Math.abs(Z)>Number.EPSILON){const ee=Math.sqrt(T),he=Math.sqrt(nt*nt+D*D),ne=ue.x-Qe/ee,ke=ue.y+Se/ee,be=ie.x-D/he,Ge=ie.y+nt/he,Ve=((be-ne)*D-(Ge-ke)*nt)/(Se*D-Qe*nt);ae=ne+Se*Ve-fe.x,Ee=ke+Qe*Ve-fe.y;const Y=ae*ae+Ee*Ee;if(Y<=2)return new ye(ae,Ee);pe=Math.sqrt(Y/2)}else{let ee=!1;Se>Number.EPSILON?nt>Number.EPSILON&&(ee=!0):Se<-Number.EPSILON?nt<-Number.EPSILON&&(ee=!0):Math.sign(Qe)===Math.sign(D)&&(ee=!0),ee?(ae=-Qe,Ee=Se,pe=Math.sqrt(T)):(ae=Se,Ee=Qe,pe=Math.sqrt(T/2))}return new ye(ae/pe,Ee/pe)}const de=[];for(let fe=0,ue=j.length,ie=ue-1,ae=fe+1;fe<ue;fe++,ie++,ae++)ie===ue&&(ie=0),ae===ue&&(ae=0),de[fe]=U(j[fe],j[ie],j[ae]);const oe=[];let J,We=de.concat();for(let fe=0,ue=H;fe<ue;fe++){const ie=I[fe];J=[];for(let ae=0,Ee=ie.length,pe=Ee-1,Se=ae+1;ae<Ee;ae++,pe++,Se++)pe===Ee&&(pe=0),Se===Ee&&(Se=0),J[ae]=U(ie[ae],ie[pe],ie[Se]);oe.push(J),We=We.concat(J)}let at;if(m===0)at=Xr.triangulateShape(j,I);else{const fe=[],ue=[];for(let ie=0;ie<m;ie++){const ae=ie/m,Ee=f*Math.cos(ae*Math.PI/2),pe=g*Math.sin(ae*Math.PI/2)+v;for(let Se=0,Qe=j.length;Se<Qe;Se++){const nt=G(j[Se],de[Se],pe);qe(nt.x,nt.y,-Ee),ae===0&&fe.push(nt)}for(let Se=0,Qe=H;Se<Qe;Se++){const nt=I[Se];J=oe[Se];const D=[];for(let T=0,Z=nt.length;T<Z;T++){const ee=G(nt[T],J[T],pe);qe(ee.x,ee.y,-Ee),ae===0&&D.push(ee)}ae===0&&ue.push(D)}}at=Xr.triangulateShape(fe,ue)}const Fe=at.length,pt=g+v;for(let fe=0;fe<W;fe++){const ue=d?G(S[fe],We[fe],pt):S[fe];y?(R.copy(M.normals[0]).multiplyScalar(ue.x),w.copy(M.binormals[0]).multiplyScalar(ue.y),A.copy(b[0]).add(R).add(w),qe(A.x,A.y,A.z)):qe(ue.x,ue.y,0)}for(let fe=1;fe<=u;fe++)for(let ue=0;ue<W;ue++){const ie=d?G(S[ue],We[ue],pt):S[ue];y?(R.copy(M.normals[fe]).multiplyScalar(ie.x),w.copy(M.binormals[fe]).multiplyScalar(ie.y),A.copy(b[fe]).add(R).add(w),qe(A.x,A.y,A.z)):qe(ie.x,ie.y,h/u*fe)}for(let fe=m-1;fe>=0;fe--){const ue=fe/m,ie=f*Math.cos(ue*Math.PI/2),ae=g*Math.sin(ue*Math.PI/2)+v;for(let Ee=0,pe=j.length;Ee<pe;Ee++){const Se=G(j[Ee],de[Ee],ae);qe(Se.x,Se.y,h+ie)}for(let Ee=0,pe=I.length;Ee<pe;Ee++){const Se=I[Ee];J=oe[Ee];for(let Qe=0,nt=Se.length;Qe<nt;Qe++){const D=G(Se[Qe],J[Qe],ae);y?qe(D.x,D.y+b[u-1].y,b[u-1].x+ie):qe(D.x,D.y,h+ie)}}}te(),ce();function te(){const fe=r.length/3;if(d){let ue=0,ie=W*ue;for(let ae=0;ae<Fe;ae++){const Ee=at[ae];Be(Ee[2]+ie,Ee[1]+ie,Ee[0]+ie)}ue=u+m*2,ie=W*ue;for(let ae=0;ae<Fe;ae++){const Ee=at[ae];Be(Ee[0]+ie,Ee[1]+ie,Ee[2]+ie)}}else{for(let ue=0;ue<Fe;ue++){const ie=at[ue];Be(ie[2],ie[1],ie[0])}for(let ue=0;ue<Fe;ue++){const ie=at[ue];Be(ie[0]+W*u,ie[1]+W*u,ie[2]+W*u)}}i.addGroup(fe,r.length/3-fe,0)}function ce(){const fe=r.length/3;let ue=0;Ae(j,ue),ue+=j.length;for(let ie=0,ae=I.length;ie<ae;ie++){const Ee=I[ie];Ae(Ee,ue),ue+=Ee.length}i.addGroup(fe,r.length/3-fe,1)}function Ae(fe,ue){let ie=fe.length;for(;--ie>=0;){const ae=ie;let Ee=ie-1;Ee<0&&(Ee=fe.length-1);for(let pe=0,Se=u+m*2;pe<Se;pe++){const Qe=W*pe,nt=W*(pe+1),D=ue+ae+Qe,T=ue+Ee+Qe,Z=ue+Ee+nt,ee=ue+ae+nt;Ze(D,T,Z,ee)}}}function qe(fe,ue,ie){c.push(fe),c.push(ue),c.push(ie)}function Be(fe,ue,ie){It(fe),It(ue),It(ie);const ae=r.length/3,Ee=x.generateTopUV(i,r,ae-3,ae-2,ae-1);k(Ee[0]),k(Ee[1]),k(Ee[2])}function Ze(fe,ue,ie,ae){It(fe),It(ue),It(ae),It(ue),It(ie),It(ae);const Ee=r.length/3,pe=x.generateSideWallUV(i,r,Ee-6,Ee-3,Ee-2,Ee-1);k(pe[0]),k(pe[1]),k(pe[3]),k(pe[1]),k(pe[2]),k(pe[3])}function It(fe){r.push(c[fe*3+0]),r.push(c[fe*3+1]),r.push(c[fe*3+2])}function k(fe){s.push(fe.x),s.push(fe.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,i=this.parameters.options;return fm(t,i,e)}static fromJSON(e,t){const i=[];for(let s=0,o=e.shapes.length;s<o;s++){const a=t[e.shapes[s]];i.push(a)}const r=e.options.extrudePath;return r!==void 0&&(e.options.extrudePath=new Xo[r.type]().fromJSON(r)),new Sl(i,e.options)}}const dm={generateTopUV:function(n,e,t,i,r){const s=e[t*3],o=e[t*3+1],a=e[i*3],c=e[i*3+1],l=e[r*3],u=e[r*3+1];return[new ye(s,o),new ye(a,c),new ye(l,u)]},generateSideWallUV:function(n,e,t,i,r,s){const o=e[t*3],a=e[t*3+1],c=e[t*3+2],l=e[i*3],u=e[i*3+1],h=e[i*3+2],d=e[r*3],f=e[r*3+1],g=e[r*3+2],v=e[s*3],m=e[s*3+1],p=e[s*3+2];return Math.abs(a-u)<Math.abs(o-l)?[new ye(o,1-c),new ye(l,1-h),new ye(d,1-g),new ye(v,1-p)]:[new ye(a,1-c),new ye(u,1-h),new ye(f,1-g),new ye(m,1-p)]}};function fm(n,e,t){if(t.shapes=[],Array.isArray(n))for(let i=0,r=n.length;i<r;i++){const s=n[i];t.shapes.push(s.uuid)}else t.shapes.push(n.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class El extends cn{constructor(e=[new ye(0,-.5),new ye(.5,0),new ye(0,.5)],t=12,i=0,r=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:i,phiLength:r},t=Math.floor(t),r=ft(r,0,Math.PI*2);const s=[],o=[],a=[],c=[],l=[],u=1/t,h=new L,d=new ye,f=new L,g=new L,v=new L;let m=0,p=0;for(let x=0;x<=e.length-1;x++)switch(x){case 0:m=e[x+1].x-e[x].x,p=e[x+1].y-e[x].y,f.x=p*1,f.y=-m,f.z=p*0,v.copy(f),f.normalize(),c.push(f.x,f.y,f.z);break;case e.length-1:c.push(v.x,v.y,v.z);break;default:m=e[x+1].x-e[x].x,p=e[x+1].y-e[x].y,f.x=p*1,f.y=-m,f.z=p*0,g.copy(f),f.x+=v.x,f.y+=v.y,f.z+=v.z,f.normalize(),c.push(f.x,f.y,f.z),v.copy(g)}for(let x=0;x<=t;x++){const b=i+x*u*r,y=Math.sin(b),M=Math.cos(b);for(let w=0;w<=e.length-1;w++){h.x=e[w].x*y,h.y=e[w].y,h.z=e[w].x*M,o.push(h.x,h.y,h.z),d.x=x/t,d.y=w/(e.length-1),a.push(d.x,d.y);const R=c[3*w+0]*y,A=c[3*w+1],E=c[3*w+0]*M;l.push(R,A,E)}}for(let x=0;x<t;x++)for(let b=0;b<e.length-1;b++){const y=b+x*e.length,M=y,w=y+e.length,R=y+e.length+1,A=y+1;s.push(M,w,A),s.push(R,A,w)}this.setIndex(s),this.setAttribute("position",new Dt(o,3)),this.setAttribute("uv",new Dt(a,2)),this.setAttribute("normal",new Dt(l,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new El(e.points,e.segments,e.phiStart,e.phiLength)}}class Ii extends cn{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};const s=e/2,o=t/2,a=Math.floor(i),c=Math.floor(r),l=a+1,u=c+1,h=e/a,d=t/c,f=[],g=[],v=[],m=[];for(let p=0;p<u;p++){const x=p*d-o;for(let b=0;b<l;b++){const y=b*h-s;g.push(y,-x,0),v.push(0,0,1),m.push(b/a),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let x=0;x<a;x++){const b=x+l*p,y=x+l*(p+1),M=x+1+l*(p+1),w=x+1+l*p;f.push(b,y,w),f.push(y,M,w)}this.setIndex(f),this.setAttribute("position",new Dt(g,3)),this.setAttribute("normal",new Dt(v,3)),this.setAttribute("uv",new Dt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ii(e.width,e.height,e.widthSegments,e.heightSegments)}}class Ri extends cn{constructor(e=1,t=32,i=16,r=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:r,phiLength:s,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const c=Math.min(o+a,Math.PI);let l=0;const u=[],h=new L,d=new L,f=[],g=[],v=[],m=[];for(let p=0;p<=i;p++){const x=[],b=p/i;let y=0;p===0&&o===0?y=.5/t:p===i&&c===Math.PI&&(y=-.5/t);for(let M=0;M<=t;M++){const w=M/t;h.x=-e*Math.cos(r+w*s)*Math.sin(o+b*a),h.y=e*Math.cos(o+b*a),h.z=e*Math.sin(r+w*s)*Math.sin(o+b*a),g.push(h.x,h.y,h.z),d.copy(h).normalize(),v.push(d.x,d.y,d.z),m.push(w+y,1-b),x.push(l++)}u.push(x)}for(let p=0;p<i;p++)for(let x=0;x<t;x++){const b=u[p][x+1],y=u[p][x],M=u[p+1][x],w=u[p+1][x+1];(p!==0||o>0)&&f.push(b,y,w),(p!==i-1||c<Math.PI)&&f.push(y,M,w)}this.setIndex(f),this.setAttribute("position",new Dt(g,3)),this.setAttribute("normal",new Dt(v,3)),this.setAttribute("uv",new Dt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ri(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Yi extends cn{constructor(e=1,t=.4,i=12,r=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:r,arc:s},i=Math.floor(i),r=Math.floor(r);const o=[],a=[],c=[],l=[],u=new L,h=new L,d=new L;for(let f=0;f<=i;f++)for(let g=0;g<=r;g++){const v=g/r*s,m=f/i*Math.PI*2;h.x=(e+t*Math.cos(m))*Math.cos(v),h.y=(e+t*Math.cos(m))*Math.sin(v),h.z=t*Math.sin(m),a.push(h.x,h.y,h.z),u.x=e*Math.cos(v),u.y=e*Math.sin(v),d.subVectors(h,u).normalize(),c.push(d.x,d.y,d.z),l.push(g/r),l.push(f/i)}for(let f=1;f<=i;f++)for(let g=1;g<=r;g++){const v=(r+1)*f+g-1,m=(r+1)*(f-1)+g-1,p=(r+1)*(f-1)+g,x=(r+1)*f+g;o.push(v,m,x),o.push(m,p,x)}this.setIndex(o),this.setAttribute("position",new Dt(a,3)),this.setAttribute("normal",new Dt(c,3)),this.setAttribute("uv",new Dt(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Yi(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class na extends cn{constructor(e=new Ml(new L(-1,-1,0),new L(-1,1,0),new L(1,1,0)),t=64,i=1,r=8,s=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:i,radialSegments:r,closed:s};const o=e.computeFrenetFrames(t,s);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;const a=new L,c=new L,l=new ye;let u=new L;const h=[],d=[],f=[],g=[];v(),this.setIndex(g),this.setAttribute("position",new Dt(h,3)),this.setAttribute("normal",new Dt(d,3)),this.setAttribute("uv",new Dt(f,2));function v(){for(let b=0;b<t;b++)m(b);m(s===!1?t:0),x(),p()}function m(b){u=e.getPointAt(b/t,u);const y=o.normals[b],M=o.binormals[b];for(let w=0;w<=r;w++){const R=w/r*Math.PI*2,A=Math.sin(R),E=-Math.cos(R);c.x=E*y.x+A*M.x,c.y=E*y.y+A*M.y,c.z=E*y.z+A*M.z,c.normalize(),d.push(c.x,c.y,c.z),a.x=u.x+i*c.x,a.y=u.y+i*c.y,a.z=u.z+i*c.z,h.push(a.x,a.y,a.z)}}function p(){for(let b=1;b<=t;b++)for(let y=1;y<=r;y++){const M=(r+1)*(b-1)+(y-1),w=(r+1)*b+(y-1),R=(r+1)*b+y,A=(r+1)*(b-1)+y;g.push(M,w,A),g.push(w,R,A)}}function x(){for(let b=0;b<=t;b++)for(let y=0;y<=r;y++)l.x=b/t,l.y=y/r,f.push(l.x,l.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new na(new Xo[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}}class wl extends ls{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Mt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Mt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Yh,this.normalScale=new ye(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Xn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class pm extends ls{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=If,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class mm extends ls{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class gm extends Wo{constructor(e){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}}class md extends an{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Mt(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class vm extends md{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(an.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Mt(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Ya=new Wt,Nu=new L,Ou=new L;class _m{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ye(512,512),this.mapType=_i,this.map=null,this.mapPass=null,this.matrix=new Wt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new gl,this._frameExtents=new ye(1,1),this._viewportCount=1,this._viewports=[new Zt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;Nu.setFromMatrixPosition(e.matrixWorld),t.position.copy(Nu),Ou.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Ou),t.updateMatrixWorld(),Ya.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ya,t.coordinateSystem,t.reversedDepth),t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Ya)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class gd extends nd{constructor(e=-1,t=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,o=i+e,a=r+t,c=r-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,o=s+l*this.view.width,a-=u*this.view.offsetY,c=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class xm extends _m{constructor(){super(new gd(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Fu extends md{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(an.DEFAULT_UP),this.updateMatrix(),this.target=new an,this.shadow=new xm}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class ym extends Kn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const ku=new Wt;class bm{constructor(e,t,i=0,r=1/0){this.ray=new ta(e,t),this.near=i,this.far=r,this.camera=null,this.layers=new pl,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return ku.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(ku),this}intersectObject(e,t=!0,i=[]){return jc(e,this,i,t),i.sort(zu),i}intersectObjects(e,t=!0,i=[]){for(let r=0,s=e.length;r<s;r++)jc(e[r],this,i,t);return i.sort(zu),i}}function zu(n,e){return n.distance-e.distance}function jc(n,e,t,i){let r=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(r=!1),r===!0&&i===!0){const s=n.children;for(let o=0,a=s.length;o<a;o++)jc(s[o],e,t,!0)}}class Bu{constructor(e=1,t=0,i=0){this.radius=e,this.phi=t,this.theta=i}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=ft(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(ft(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class Mm extends Er{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function Vu(n,e,t,i){const r=Sm(i);switch(t){case Wh:return n*e;case qh:return n*e/r.components*r.byteLength;case ll:return n*e/r.components*r.byteLength;case Xh:return n*e*2/r.components*r.byteLength;case ul:return n*e*2/r.components*r.byteLength;case $h:return n*e*3/r.components*r.byteLength;case ci:return n*e*4/r.components*r.byteLength;case hl:return n*e*4/r.components*r.byteLength;case No:case Oo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Fo:case ko:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case _c:case yc:return Math.max(n,16)*Math.max(e,8)/4;case vc:case xc:return Math.max(n,8)*Math.max(e,8)/2;case bc:case Mc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Sc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Ec:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case wc:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Tc:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Ac:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Rc:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Cc:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Pc:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Lc:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Dc:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Ic:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Uc:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Nc:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case Oc:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Fc:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case kc:case zc:case Bc:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Vc:case Hc:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Gc:case Wc:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Sm(n){switch(n){case _i:case Bh:return{byteLength:1,components:1};case Fs:case Vh:case Xs:return{byteLength:2,components:1};case al:case cl:return{byteLength:2,components:4};case br:case ol:case Di:return{byteLength:4,components:1};case Hh:case Gh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:sl}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=sl);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function vd(){let n=null,e=!1,t=null,i=null;function r(s,o){t(s,o),i=n.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function Em(n){const e=new WeakMap;function t(a,c){const l=a.array,u=a.usage,h=l.byteLength,d=n.createBuffer();n.bindBuffer(c,d),n.bufferData(c,l,u),a.onUploadCallback();let f;if(l instanceof Float32Array)f=n.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=n.HALF_FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=n.SHORT;else if(l instanceof Uint32Array)f=n.UNSIGNED_INT;else if(l instanceof Int32Array)f=n.INT;else if(l instanceof Int8Array)f=n.BYTE;else if(l instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:h}}function i(a,c,l){const u=c.array,h=c.updateRanges;if(n.bindBuffer(l,a),h.length===0)n.bufferSubData(l,0,u);else{h.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<h.length;f++){const g=h[d],v=h[f];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++d,h[d]=v)}h.length=d+1;for(let f=0,g=h.length;f<g;f++){const v=h[f];n.bufferSubData(l,v.start*u.BYTES_PER_ELEMENT,u,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=e.get(a);c&&(n.deleteBuffer(c.buffer),e.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const l=e.get(a);if(l===void 0)e.set(a,t(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,a,c),l.version=a.version}}return{get:r,remove:s,update:o}}var wm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Tm=`#ifdef USE_ALPHAHASH
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
#endif`,Am=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Rm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Cm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Pm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Lm=`#ifdef USE_AOMAP
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
#endif`,Dm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Im=`#ifdef USE_BATCHING
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
#endif`,Um=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Nm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Om=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Fm=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,km=`#ifdef USE_IRIDESCENCE
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
#endif`,zm=`#ifdef USE_BUMPMAP
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
#endif`,Bm=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Vm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Hm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Gm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Wm=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,$m=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,qm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Xm=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Ym=`#define PI 3.141592653589793
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
} // validated`,jm=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Zm=`vec3 transformedNormal = objectNormal;
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
#endif`,Km=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Jm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Qm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,e0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,t0="gl_FragColor = linearToOutputTexel( gl_FragColor );",n0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,i0=`#ifdef USE_ENVMAP
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
#endif`,r0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,s0=`#ifdef USE_ENVMAP
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
#endif`,o0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,a0=`#ifdef USE_ENVMAP
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
#endif`,c0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,l0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,u0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,h0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,d0=`#ifdef USE_GRADIENTMAP
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
}`,f0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,p0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,m0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,g0=`uniform bool receiveShadow;
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
#endif`,v0=`#ifdef USE_ENVMAP
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
#endif`,_0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,x0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,y0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,b0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,M0=`PhysicalMaterial material;
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
#endif`,S0=`struct PhysicalMaterial {
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
}`,E0=`
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
#endif`,w0=`#if defined( RE_IndirectDiffuse )
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
#endif`,T0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,A0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,R0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,C0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,P0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,L0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,D0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,I0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,U0=`#if defined( USE_POINTS_UV )
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
#endif`,N0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,O0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,F0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,k0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,z0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,B0=`#ifdef USE_MORPHTARGETS
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
#endif`,V0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,H0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,G0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,W0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,$0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,q0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,X0=`#ifdef USE_NORMALMAP
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
#endif`,Y0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,j0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Z0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,K0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,J0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Q0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,eg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,tg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,ng=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,ig=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,rg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,sg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,og=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,ag=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,cg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,lg=`float getShadowMask() {
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
}`,ug=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,hg=`#ifdef USE_SKINNING
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
#endif`,dg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,fg=`#ifdef USE_SKINNING
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
#endif`,pg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,mg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,gg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,vg=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,_g=`#ifdef USE_TRANSMISSION
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
#endif`,xg=`#ifdef USE_TRANSMISSION
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
#endif`,yg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,bg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Mg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Sg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Eg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,wg=`uniform sampler2D t2D;
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
}`,Tg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ag=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Rg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Cg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Pg=`#include <common>
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
}`,Lg=`#if DEPTH_PACKING == 3200
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
}`,Dg=`#define DISTANCE
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
}`,Ig=`#define DISTANCE
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
}`,Ug=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Ng=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Og=`uniform float scale;
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
}`,Fg=`uniform vec3 diffuse;
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
}`,kg=`#include <common>
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
}`,zg=`uniform vec3 diffuse;
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
}`,Bg=`#define LAMBERT
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
}`,Vg=`#define LAMBERT
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
}`,Hg=`#define MATCAP
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
}`,Gg=`#define MATCAP
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
}`,Wg=`#define NORMAL
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
}`,$g=`#define NORMAL
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
}`,qg=`#define PHONG
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
}`,Xg=`#define PHONG
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
}`,Yg=`#define STANDARD
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
}`,jg=`#define STANDARD
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
}`,Zg=`#define TOON
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
}`,Kg=`#define TOON
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
}`,Jg=`uniform float size;
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
}`,Qg=`uniform vec3 diffuse;
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
}`,ev=`#include <common>
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
}`,tv=`uniform vec3 color;
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
}`,nv=`uniform float rotation;
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
}`,iv=`uniform vec3 diffuse;
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
}`,mt={alphahash_fragment:wm,alphahash_pars_fragment:Tm,alphamap_fragment:Am,alphamap_pars_fragment:Rm,alphatest_fragment:Cm,alphatest_pars_fragment:Pm,aomap_fragment:Lm,aomap_pars_fragment:Dm,batching_pars_vertex:Im,batching_vertex:Um,begin_vertex:Nm,beginnormal_vertex:Om,bsdfs:Fm,iridescence_fragment:km,bumpmap_pars_fragment:zm,clipping_planes_fragment:Bm,clipping_planes_pars_fragment:Vm,clipping_planes_pars_vertex:Hm,clipping_planes_vertex:Gm,color_fragment:Wm,color_pars_fragment:$m,color_pars_vertex:qm,color_vertex:Xm,common:Ym,cube_uv_reflection_fragment:jm,defaultnormal_vertex:Zm,displacementmap_pars_vertex:Km,displacementmap_vertex:Jm,emissivemap_fragment:Qm,emissivemap_pars_fragment:e0,colorspace_fragment:t0,colorspace_pars_fragment:n0,envmap_fragment:i0,envmap_common_pars_fragment:r0,envmap_pars_fragment:s0,envmap_pars_vertex:o0,envmap_physical_pars_fragment:v0,envmap_vertex:a0,fog_vertex:c0,fog_pars_vertex:l0,fog_fragment:u0,fog_pars_fragment:h0,gradientmap_pars_fragment:d0,lightmap_pars_fragment:f0,lights_lambert_fragment:p0,lights_lambert_pars_fragment:m0,lights_pars_begin:g0,lights_toon_fragment:_0,lights_toon_pars_fragment:x0,lights_phong_fragment:y0,lights_phong_pars_fragment:b0,lights_physical_fragment:M0,lights_physical_pars_fragment:S0,lights_fragment_begin:E0,lights_fragment_maps:w0,lights_fragment_end:T0,logdepthbuf_fragment:A0,logdepthbuf_pars_fragment:R0,logdepthbuf_pars_vertex:C0,logdepthbuf_vertex:P0,map_fragment:L0,map_pars_fragment:D0,map_particle_fragment:I0,map_particle_pars_fragment:U0,metalnessmap_fragment:N0,metalnessmap_pars_fragment:O0,morphinstance_vertex:F0,morphcolor_vertex:k0,morphnormal_vertex:z0,morphtarget_pars_vertex:B0,morphtarget_vertex:V0,normal_fragment_begin:H0,normal_fragment_maps:G0,normal_pars_fragment:W0,normal_pars_vertex:$0,normal_vertex:q0,normalmap_pars_fragment:X0,clearcoat_normal_fragment_begin:Y0,clearcoat_normal_fragment_maps:j0,clearcoat_pars_fragment:Z0,iridescence_pars_fragment:K0,opaque_fragment:J0,packing:Q0,premultiplied_alpha_fragment:eg,project_vertex:tg,dithering_fragment:ng,dithering_pars_fragment:ig,roughnessmap_fragment:rg,roughnessmap_pars_fragment:sg,shadowmap_pars_fragment:og,shadowmap_pars_vertex:ag,shadowmap_vertex:cg,shadowmask_pars_fragment:lg,skinbase_vertex:ug,skinning_pars_vertex:hg,skinning_vertex:dg,skinnormal_vertex:fg,specularmap_fragment:pg,specularmap_pars_fragment:mg,tonemapping_fragment:gg,tonemapping_pars_fragment:vg,transmission_fragment:_g,transmission_pars_fragment:xg,uv_pars_fragment:yg,uv_pars_vertex:bg,uv_vertex:Mg,worldpos_vertex:Sg,background_vert:Eg,background_frag:wg,backgroundCube_vert:Tg,backgroundCube_frag:Ag,cube_vert:Rg,cube_frag:Cg,depth_vert:Pg,depth_frag:Lg,distanceRGBA_vert:Dg,distanceRGBA_frag:Ig,equirect_vert:Ug,equirect_frag:Ng,linedashed_vert:Og,linedashed_frag:Fg,meshbasic_vert:kg,meshbasic_frag:zg,meshlambert_vert:Bg,meshlambert_frag:Vg,meshmatcap_vert:Hg,meshmatcap_frag:Gg,meshnormal_vert:Wg,meshnormal_frag:$g,meshphong_vert:qg,meshphong_frag:Xg,meshphysical_vert:Yg,meshphysical_frag:jg,meshtoon_vert:Zg,meshtoon_frag:Kg,points_vert:Jg,points_frag:Qg,shadow_vert:ev,shadow_frag:tv,sprite_vert:nv,sprite_frag:iv},Le={common:{diffuse:{value:new Mt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new dt},alphaMap:{value:null},alphaMapTransform:{value:new dt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new dt}},envmap:{envMap:{value:null},envMapRotation:{value:new dt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new dt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new dt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new dt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new dt},normalScale:{value:new ye(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new dt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new dt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new dt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new dt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Mt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Mt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new dt},alphaTest:{value:0},uvTransform:{value:new dt}},sprite:{diffuse:{value:new Mt(16777215)},opacity:{value:1},center:{value:new ye(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new dt},alphaMap:{value:null},alphaMapTransform:{value:new dt},alphaTest:{value:0}}},pi={basic:{uniforms:Ln([Le.common,Le.specularmap,Le.envmap,Le.aomap,Le.lightmap,Le.fog]),vertexShader:mt.meshbasic_vert,fragmentShader:mt.meshbasic_frag},lambert:{uniforms:Ln([Le.common,Le.specularmap,Le.envmap,Le.aomap,Le.lightmap,Le.emissivemap,Le.bumpmap,Le.normalmap,Le.displacementmap,Le.fog,Le.lights,{emissive:{value:new Mt(0)}}]),vertexShader:mt.meshlambert_vert,fragmentShader:mt.meshlambert_frag},phong:{uniforms:Ln([Le.common,Le.specularmap,Le.envmap,Le.aomap,Le.lightmap,Le.emissivemap,Le.bumpmap,Le.normalmap,Le.displacementmap,Le.fog,Le.lights,{emissive:{value:new Mt(0)},specular:{value:new Mt(1118481)},shininess:{value:30}}]),vertexShader:mt.meshphong_vert,fragmentShader:mt.meshphong_frag},standard:{uniforms:Ln([Le.common,Le.envmap,Le.aomap,Le.lightmap,Le.emissivemap,Le.bumpmap,Le.normalmap,Le.displacementmap,Le.roughnessmap,Le.metalnessmap,Le.fog,Le.lights,{emissive:{value:new Mt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:mt.meshphysical_vert,fragmentShader:mt.meshphysical_frag},toon:{uniforms:Ln([Le.common,Le.aomap,Le.lightmap,Le.emissivemap,Le.bumpmap,Le.normalmap,Le.displacementmap,Le.gradientmap,Le.fog,Le.lights,{emissive:{value:new Mt(0)}}]),vertexShader:mt.meshtoon_vert,fragmentShader:mt.meshtoon_frag},matcap:{uniforms:Ln([Le.common,Le.bumpmap,Le.normalmap,Le.displacementmap,Le.fog,{matcap:{value:null}}]),vertexShader:mt.meshmatcap_vert,fragmentShader:mt.meshmatcap_frag},points:{uniforms:Ln([Le.points,Le.fog]),vertexShader:mt.points_vert,fragmentShader:mt.points_frag},dashed:{uniforms:Ln([Le.common,Le.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:mt.linedashed_vert,fragmentShader:mt.linedashed_frag},depth:{uniforms:Ln([Le.common,Le.displacementmap]),vertexShader:mt.depth_vert,fragmentShader:mt.depth_frag},normal:{uniforms:Ln([Le.common,Le.bumpmap,Le.normalmap,Le.displacementmap,{opacity:{value:1}}]),vertexShader:mt.meshnormal_vert,fragmentShader:mt.meshnormal_frag},sprite:{uniforms:Ln([Le.sprite,Le.fog]),vertexShader:mt.sprite_vert,fragmentShader:mt.sprite_frag},background:{uniforms:{uvTransform:{value:new dt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:mt.background_vert,fragmentShader:mt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new dt}},vertexShader:mt.backgroundCube_vert,fragmentShader:mt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:mt.cube_vert,fragmentShader:mt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:mt.equirect_vert,fragmentShader:mt.equirect_frag},distanceRGBA:{uniforms:Ln([Le.common,Le.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:mt.distanceRGBA_vert,fragmentShader:mt.distanceRGBA_frag},shadow:{uniforms:Ln([Le.lights,Le.fog,{color:{value:new Mt(0)},opacity:{value:1}}]),vertexShader:mt.shadow_vert,fragmentShader:mt.shadow_frag}};pi.physical={uniforms:Ln([pi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new dt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new dt},clearcoatNormalScale:{value:new ye(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new dt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new dt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new dt},sheen:{value:0},sheenColor:{value:new Mt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new dt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new dt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new dt},transmissionSamplerSize:{value:new ye},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new dt},attenuationDistance:{value:0},attenuationColor:{value:new Mt(0)},specularColor:{value:new Mt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new dt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new dt},anisotropyVector:{value:new ye},anisotropyMap:{value:null},anisotropyMapTransform:{value:new dt}}]),vertexShader:mt.meshphysical_vert,fragmentShader:mt.meshphysical_frag};const Lo={r:0,b:0,g:0},fr=new Xn,rv=new Wt;function sv(n,e,t,i,r,s,o){const a=new Mt(0);let c=s===!0?0:1,l,u,h=null,d=0,f=null;function g(b){let y=b.isScene===!0?b.background:null;return y&&y.isTexture&&(y=(b.backgroundBlurriness>0?t:e).get(y)),y}function v(b){let y=!1;const M=g(b);M===null?p(a,c):M&&M.isColor&&(p(M,1),y=!0);const w=n.xr.getEnvironmentBlendMode();w==="additive"?i.buffers.color.setClear(0,0,0,1,o):w==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||y)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(b,y){const M=g(y);M&&(M.isCubeTexture||M.mapping===Qo)?(u===void 0&&(u=new Rn(new qt(1,1,1),new ir({name:"BackgroundCubeMaterial",uniforms:as(pi.backgroundCube.uniforms),vertexShader:pi.backgroundCube.vertexShader,fragmentShader:pi.backgroundCube.fragmentShader,side:Bn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(w,R,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),fr.copy(y.backgroundRotation),fr.x*=-1,fr.y*=-1,fr.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(fr.y*=-1,fr.z*=-1),u.material.uniforms.envMap.value=M,u.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(rv.makeRotationFromEuler(fr)),u.material.toneMapped=Rt.getTransfer(M.colorSpace)!==Ot,(h!==M||d!==M.version||f!==n.toneMapping)&&(u.material.needsUpdate=!0,h=M,d=M.version,f=n.toneMapping),u.layers.enableAll(),b.unshift(u,u.geometry,u.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new Rn(new Ii(2,2),new ir({name:"BackgroundMaterial",uniforms:as(pi.background.uniforms),vertexShader:pi.background.vertexShader,fragmentShader:pi.background.fragmentShader,side:nr,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,l.material.toneMapped=Rt.getTransfer(M.colorSpace)!==Ot,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(h!==M||d!==M.version||f!==n.toneMapping)&&(l.material.needsUpdate=!0,h=M,d=M.version,f=n.toneMapping),l.layers.enableAll(),b.unshift(l,l.geometry,l.material,0,0,null))}function p(b,y){b.getRGB(Lo,td(n)),i.buffers.color.setClear(Lo.r,Lo.g,Lo.b,y,o)}function x(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(b,y=1){a.set(b),c=y,p(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(b){c=b,p(a,c)},render:v,addToRenderList:m,dispose:x}}function ov(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=d(null);let s=r,o=!1;function a(S,I,F,$,H){let j=!1;const G=h($,F,I);s!==G&&(s=G,l(s.object)),j=f(S,$,F,H),j&&g(S,$,F,H),H!==null&&e.update(H,n.ELEMENT_ARRAY_BUFFER),(j||o)&&(o=!1,y(S,I,F,$),H!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(H).buffer))}function c(){return n.createVertexArray()}function l(S){return n.bindVertexArray(S)}function u(S){return n.deleteVertexArray(S)}function h(S,I,F){const $=F.wireframe===!0;let H=i[S.id];H===void 0&&(H={},i[S.id]=H);let j=H[I.id];j===void 0&&(j={},H[I.id]=j);let G=j[$];return G===void 0&&(G=d(c()),j[$]=G),G}function d(S){const I=[],F=[],$=[];for(let H=0;H<t;H++)I[H]=0,F[H]=0,$[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:F,attributeDivisors:$,object:S,attributes:{},index:null}}function f(S,I,F,$){const H=s.attributes,j=I.attributes;let G=0;const W=F.getAttributes();for(const U in W)if(W[U].location>=0){const oe=H[U];let J=j[U];if(J===void 0&&(U==="instanceMatrix"&&S.instanceMatrix&&(J=S.instanceMatrix),U==="instanceColor"&&S.instanceColor&&(J=S.instanceColor)),oe===void 0||oe.attribute!==J||J&&oe.data!==J.data)return!0;G++}return s.attributesNum!==G||s.index!==$}function g(S,I,F,$){const H={},j=I.attributes;let G=0;const W=F.getAttributes();for(const U in W)if(W[U].location>=0){let oe=j[U];oe===void 0&&(U==="instanceMatrix"&&S.instanceMatrix&&(oe=S.instanceMatrix),U==="instanceColor"&&S.instanceColor&&(oe=S.instanceColor));const J={};J.attribute=oe,oe&&oe.data&&(J.data=oe.data),H[U]=J,G++}s.attributes=H,s.attributesNum=G,s.index=$}function v(){const S=s.newAttributes;for(let I=0,F=S.length;I<F;I++)S[I]=0}function m(S){p(S,0)}function p(S,I){const F=s.newAttributes,$=s.enabledAttributes,H=s.attributeDivisors;F[S]=1,$[S]===0&&(n.enableVertexAttribArray(S),$[S]=1),H[S]!==I&&(n.vertexAttribDivisor(S,I),H[S]=I)}function x(){const S=s.newAttributes,I=s.enabledAttributes;for(let F=0,$=I.length;F<$;F++)I[F]!==S[F]&&(n.disableVertexAttribArray(F),I[F]=0)}function b(S,I,F,$,H,j,G){G===!0?n.vertexAttribIPointer(S,I,F,H,j):n.vertexAttribPointer(S,I,F,$,H,j)}function y(S,I,F,$){v();const H=$.attributes,j=F.getAttributes(),G=I.defaultAttributeValues;for(const W in j){const U=j[W];if(U.location>=0){let de=H[W];if(de===void 0&&(W==="instanceMatrix"&&S.instanceMatrix&&(de=S.instanceMatrix),W==="instanceColor"&&S.instanceColor&&(de=S.instanceColor)),de!==void 0){const oe=de.normalized,J=de.itemSize,We=e.get(de);if(We===void 0)continue;const at=We.buffer,Fe=We.type,pt=We.bytesPerElement,te=Fe===n.INT||Fe===n.UNSIGNED_INT||de.gpuType===ol;if(de.isInterleavedBufferAttribute){const ce=de.data,Ae=ce.stride,qe=de.offset;if(ce.isInstancedInterleavedBuffer){for(let Be=0;Be<U.locationSize;Be++)p(U.location+Be,ce.meshPerAttribute);S.isInstancedMesh!==!0&&$._maxInstanceCount===void 0&&($._maxInstanceCount=ce.meshPerAttribute*ce.count)}else for(let Be=0;Be<U.locationSize;Be++)m(U.location+Be);n.bindBuffer(n.ARRAY_BUFFER,at);for(let Be=0;Be<U.locationSize;Be++)b(U.location+Be,J/U.locationSize,Fe,oe,Ae*pt,(qe+J/U.locationSize*Be)*pt,te)}else{if(de.isInstancedBufferAttribute){for(let ce=0;ce<U.locationSize;ce++)p(U.location+ce,de.meshPerAttribute);S.isInstancedMesh!==!0&&$._maxInstanceCount===void 0&&($._maxInstanceCount=de.meshPerAttribute*de.count)}else for(let ce=0;ce<U.locationSize;ce++)m(U.location+ce);n.bindBuffer(n.ARRAY_BUFFER,at);for(let ce=0;ce<U.locationSize;ce++)b(U.location+ce,J/U.locationSize,Fe,oe,J*pt,J/U.locationSize*ce*pt,te)}}else if(G!==void 0){const oe=G[W];if(oe!==void 0)switch(oe.length){case 2:n.vertexAttrib2fv(U.location,oe);break;case 3:n.vertexAttrib3fv(U.location,oe);break;case 4:n.vertexAttrib4fv(U.location,oe);break;default:n.vertexAttrib1fv(U.location,oe)}}}}x()}function M(){A();for(const S in i){const I=i[S];for(const F in I){const $=I[F];for(const H in $)u($[H].object),delete $[H];delete I[F]}delete i[S]}}function w(S){if(i[S.id]===void 0)return;const I=i[S.id];for(const F in I){const $=I[F];for(const H in $)u($[H].object),delete $[H];delete I[F]}delete i[S.id]}function R(S){for(const I in i){const F=i[I];if(F[S.id]===void 0)continue;const $=F[S.id];for(const H in $)u($[H].object),delete $[H];delete F[S.id]}}function A(){E(),o=!0,s!==r&&(s=r,l(s.object))}function E(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:A,resetDefaultState:E,dispose:M,releaseStatesOfGeometry:w,releaseStatesOfProgram:R,initAttributes:v,enableAttribute:m,disableUnusedAttributes:x}}function av(n,e,t){let i;function r(l){i=l}function s(l,u){n.drawArrays(i,l,u),t.update(u,i,1)}function o(l,u,h){h!==0&&(n.drawArraysInstanced(i,l,u,h),t.update(u,i,h))}function a(l,u,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,u,0,h);let f=0;for(let g=0;g<h;g++)f+=u[g];t.update(f,i,1)}function c(l,u,h,d){if(h===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<l.length;g++)o(l[g],u[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(i,l,0,u,0,d,0,h);let g=0;for(let v=0;v<h;v++)g+=u[v]*d[v];t.update(g,i,1)}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function cv(n,e,t,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");r=n.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(R){return!(R!==ci&&i.convert(R)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(R){const A=R===Xs&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==_i&&i.convert(R)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==Di&&!A)}function c(R){if(R==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const u=c(l);u!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);const h=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),x=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),b=n.getParameter(n.MAX_VARYING_VECTORS),y=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),M=g>0,w=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:h,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:x,maxVaryings:b,maxFragmentUniforms:y,vertexTextures:M,maxSamples:w}}function lv(n){const e=this;let t=null,i=0,r=!1,s=!1;const o=new Ci,a=new dt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const f=h.length!==0||d||i!==0||r;return r=d,i=h.length,f},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,d){t=u(h,d,0)},this.setState=function(h,d,f){const g=h.clippingPlanes,v=h.clipIntersection,m=h.clipShadows,p=n.get(h);if(!r||g===null||g.length===0||s&&!m)s?u(null):l();else{const x=s?0:i,b=x*4;let y=p.clippingState||null;c.value=y,y=u(g,d,b,f);for(let M=0;M!==b;++M)y[M]=t[M];p.clippingState=y,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=x}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(h,d,f,g){const v=h!==null?h.length:0;let m=null;if(v!==0){if(m=c.value,g!==!0||m===null){const p=f+v*4,x=d.matrixWorldInverse;a.getNormalMatrix(x),(m===null||m.length<p)&&(m=new Float32Array(p));for(let b=0,y=f;b!==v;++b,y+=4)o.copy(h[b]).applyMatrix4(x,a),o.normal.toArray(m,y),m[y+3]=o.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,m}}function uv(n){let e=new WeakMap;function t(o,a){return a===fc?o.mapping=rs:a===pc&&(o.mapping=ss),o}function i(o){if(o&&o.isTexture){const a=o.mapping;if(a===fc||a===pc)if(e.has(o)){const c=e.get(o).texture;return t(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new Cp(c.height);return l.fromEquirectangularTexture(n,o),e.set(o,l),o.addEventListener("dispose",r),t(l.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const c=e.get(a);c!==void 0&&(e.delete(a),c.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}const Yr=4,Hu=[.125,.215,.35,.446,.526,.582],vr=20,ja=new gd,Gu=new Mt;let Za=null,Ka=0,Ja=0,Qa=!1;const mr=(1+Math.sqrt(5))/2,Gr=1/mr,Wu=[new L(-mr,Gr,0),new L(mr,Gr,0),new L(-Gr,0,mr),new L(Gr,0,mr),new L(0,mr,-Gr),new L(0,mr,Gr),new L(-1,1,-1),new L(1,1,-1),new L(-1,1,1),new L(1,1,1)],hv=new L;class $u{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,r=100,s={}){const{size:o=256,position:a=hv}=s;Za=this._renderer.getRenderTarget(),Ka=this._renderer.getActiveCubeFace(),Ja=this._renderer.getActiveMipmapLevel(),Qa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,i,r,c,a),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Yu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Xu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Za,Ka,Ja),this._renderer.xr.enabled=Qa,e.scissorTest=!1,Do(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===rs||e.mapping===ss?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Za=this._renderer.getRenderTarget(),Ka=this._renderer.getActiveCubeFace(),Ja=this._renderer.getActiveMipmapLevel(),Qa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:ai,minFilter:ai,generateMipmaps:!1,type:Xs,format:ci,colorSpace:os,depthBuffer:!1},r=qu(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=qu(e,t,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=dv(s)),this._blurMaterial=fv(s,e,t)}return r}_compileMaterial(e){const t=new Rn(this._lodPlanes[0],e);this._renderer.compile(t,ja)}_sceneToCubeUV(e,t,i,r,s){const c=new Kn(90,1,t,i),l=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,f=h.toneMapping;h.getClearColor(Gu),h.toneMapping=Qi,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(r),h.clearDepth(),h.setRenderTarget(null));const v=new Zn({name:"PMREM.Background",side:Bn,depthWrite:!1,depthTest:!1}),m=new Rn(new qt,v);let p=!1;const x=e.background;x?x.isColor&&(v.color.copy(x),e.background=null,p=!0):(v.color.copy(Gu),p=!0);for(let b=0;b<6;b++){const y=b%3;y===0?(c.up.set(0,l[b],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x+u[b],s.y,s.z)):y===1?(c.up.set(0,0,l[b]),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y+u[b],s.z)):(c.up.set(0,l[b],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y,s.z+u[b]));const M=this._cubeSize;Do(r,y*M,b>2?M:0,M,M),h.setRenderTarget(r),p&&h.render(m,c),h.render(e,c)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=f,h.autoClear=d,e.background=x}_textureToCubeUV(e,t){const i=this._renderer,r=e.mapping===rs||e.mapping===ss;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Yu()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Xu());const s=r?this._cubemapMaterial:this._equirectMaterial,o=new Rn(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=e;const c=this._cubeSize;Do(t,0,0,3*c,2*c),i.setRenderTarget(t),i.render(o,ja)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=Wu[(r-s-1)%Wu.length];this._blur(e,s-1,s,o,a)}t.autoClear=i}_blur(e,t,i,r,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,i,r,"latitudinal",s),this._halfBlur(o,e,i,i,r,"longitudinal",s)}_halfBlur(e,t,i,r,s,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new Rn(this._lodPlanes[r],l),d=l.uniforms,f=this._sizeLods[i]-1,g=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*vr-1),v=s/g,m=isFinite(s)?1+Math.floor(u*v):vr;m>vr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${vr}`);const p=[];let x=0;for(let R=0;R<vr;++R){const A=R/v,E=Math.exp(-A*A/2);p.push(E),R===0?x+=E:R<m&&(x+=2*E)}for(let R=0;R<p.length;R++)p[R]=p[R]/x;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:b}=this;d.dTheta.value=g,d.mipInt.value=b-i;const y=this._sizeLods[r],M=3*y*(r>b-Yr?r-b+Yr:0),w=4*(this._cubeSize-y);Do(t,M,w,3*y,2*y),c.setRenderTarget(t),c.render(h,ja)}}function dv(n){const e=[],t=[],i=[];let r=n;const s=n-Yr+1+Hu.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);t.push(a);let c=1/a;o>n-Yr?c=Hu[o-n+Yr-1]:o===0&&(c=0),i.push(c);const l=1/(a-2),u=-l,h=1+l,d=[u,u,h,u,h,h,u,u,h,h,u,h],f=6,g=6,v=3,m=2,p=1,x=new Float32Array(v*g*f),b=new Float32Array(m*g*f),y=new Float32Array(p*g*f);for(let w=0;w<f;w++){const R=w%3*2/3-1,A=w>2?0:-1,E=[R,A,0,R+2/3,A,0,R+2/3,A+1,0,R,A,0,R+2/3,A+1,0,R,A+1,0];x.set(E,v*g*w),b.set(d,m*g*w);const S=[w,w,w,w,w,w];y.set(S,p*g*w)}const M=new cn;M.setAttribute("position",new Qn(x,v)),M.setAttribute("uv",new Qn(b,m)),M.setAttribute("faceIndex",new Qn(y,p)),e.push(M),r>Yr&&r--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function qu(n,e,t){const i=new Mr(n,e,t);return i.texture.mapping=Qo,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Do(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function fv(n,e,t){const i=new Float32Array(vr),r=new L(0,1,0);return new ir({name:"SphericalGaussianBlur",defines:{n:vr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Tl(),fragmentShader:`

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
		`,blending:Ji,depthTest:!1,depthWrite:!1})}function Xu(){return new ir({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Tl(),fragmentShader:`

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
		`,blending:Ji,depthTest:!1,depthWrite:!1})}function Yu(){return new ir({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Tl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ji,depthTest:!1,depthWrite:!1})}function Tl(){return`

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
	`}function pv(n){let e=new WeakMap,t=null;function i(a){if(a&&a.isTexture){const c=a.mapping,l=c===fc||c===pc,u=c===rs||c===ss;if(l||u){let h=e.get(a);const d=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return t===null&&(t=new $u(n)),h=l?t.fromEquirectangular(a,h):t.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),h.texture;if(h!==void 0)return h.texture;{const f=a.image;return l&&f&&f.height>0||u&&f&&r(f)?(t===null&&(t=new $u(n)),h=l?t.fromEquirectangular(a):t.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),a.addEventListener("dispose",s),h.texture):null}}}return a}function r(a){let c=0;const l=6;for(let u=0;u<l;u++)a[u]!==void 0&&c++;return c===l}function s(a){const c=a.target;c.removeEventListener("dispose",s);const l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:o}}function mv(n){const e={};function t(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=n.getExtension(i)}return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const r=t(i);return r===null&&Hs("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function gv(n,e,t,i){const r={},s=new WeakMap;function o(h){const d=h.target;d.index!==null&&e.remove(d.index);for(const g in d.attributes)e.remove(d.attributes[g]);d.removeEventListener("dispose",o),delete r[d.id];const f=s.get(d);f&&(e.remove(f),s.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function a(h,d){return r[d.id]===!0||(d.addEventListener("dispose",o),r[d.id]=!0,t.memory.geometries++),d}function c(h){const d=h.attributes;for(const f in d)e.update(d[f],n.ARRAY_BUFFER)}function l(h){const d=[],f=h.index,g=h.attributes.position;let v=0;if(f!==null){const x=f.array;v=f.version;for(let b=0,y=x.length;b<y;b+=3){const M=x[b+0],w=x[b+1],R=x[b+2];d.push(M,w,w,R,R,M)}}else if(g!==void 0){const x=g.array;v=g.version;for(let b=0,y=x.length/3-1;b<y;b+=3){const M=b+0,w=b+1,R=b+2;d.push(M,w,w,R,R,M)}}else return;const m=new(Zh(d)?ed:Qh)(d,1);m.version=v;const p=s.get(h);p&&e.remove(p),s.set(h,m)}function u(h){const d=s.get(h);if(d){const f=h.index;f!==null&&d.version<f.version&&l(h)}else l(h);return s.get(h)}return{get:a,update:c,getWireframeAttribute:u}}function vv(n,e,t){let i;function r(d){i=d}let s,o;function a(d){s=d.type,o=d.bytesPerElement}function c(d,f){n.drawElements(i,f,s,d*o),t.update(f,i,1)}function l(d,f,g){g!==0&&(n.drawElementsInstanced(i,f,s,d*o,g),t.update(f,i,g))}function u(d,f,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,s,d,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];t.update(m,i,1)}function h(d,f,g,v){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)l(d[p]/o,f[p],v[p]);else{m.multiDrawElementsInstancedWEBGL(i,f,0,s,d,0,v,0,g);let p=0;for(let x=0;x<g;x++)p+=f[x]*v[x];t.update(p,i,1)}}this.setMode=r,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function _v(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(s/3);break;case n.LINES:t.lines+=a*(s/2);break;case n.LINE_STRIP:t.lines+=a*(s-1);break;case n.LINE_LOOP:t.lines+=a*s;break;case n.POINTS:t.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function xv(n,e,t){const i=new WeakMap,r=new Zt;function s(o,a,c){const l=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0;let d=i.get(a);if(d===void 0||d.count!==h){let S=function(){A.dispose(),i.delete(a),a.removeEventListener("dispose",S)};var f=S;d!==void 0&&d.texture.dispose();const g=a.morphAttributes.position!==void 0,v=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],x=a.morphAttributes.normal||[],b=a.morphAttributes.color||[];let y=0;g===!0&&(y=1),v===!0&&(y=2),m===!0&&(y=3);let M=a.attributes.position.count*y,w=1;M>e.maxTextureSize&&(w=Math.ceil(M/e.maxTextureSize),M=e.maxTextureSize);const R=new Float32Array(M*w*4*h),A=new Kh(R,M,w,h);A.type=Di,A.needsUpdate=!0;const E=y*4;for(let I=0;I<h;I++){const F=p[I],$=x[I],H=b[I],j=M*w*4*I;for(let G=0;G<F.count;G++){const W=G*E;g===!0&&(r.fromBufferAttribute(F,G),R[j+W+0]=r.x,R[j+W+1]=r.y,R[j+W+2]=r.z,R[j+W+3]=0),v===!0&&(r.fromBufferAttribute($,G),R[j+W+4]=r.x,R[j+W+5]=r.y,R[j+W+6]=r.z,R[j+W+7]=0),m===!0&&(r.fromBufferAttribute(H,G),R[j+W+8]=r.x,R[j+W+9]=r.y,R[j+W+10]=r.z,R[j+W+11]=H.itemSize===4?r.w:1)}}d={count:h,texture:A,size:new ye(M,w)},i.set(a,d),a.addEventListener("dispose",S)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const v=a.morphTargetsRelative?1:1-g;c.getUniforms().setValue(n,"morphTargetBaseInfluence",v),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",d.texture,t),c.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:s}}function yv(n,e,t,i){let r=new WeakMap;function s(c){const l=i.render.frame,u=c.geometry,h=e.get(c,u);if(r.get(h)!==l&&(e.update(h),r.set(h,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),r.get(c)!==l&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),r.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;r.get(d)!==l&&(d.update(),r.set(d,l))}return h}function o(){r=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:s,dispose:o}}const _d=new Un,ju=new rd(1,1),xd=new Kh,yd=new dp,bd=new id,Zu=[],Ku=[],Ju=new Float32Array(16),Qu=new Float32Array(9),eh=new Float32Array(4);function us(n,e,t){const i=n[0];if(i<=0||i>0)return n;const r=e*t;let s=Zu[r];if(s===void 0&&(s=new Float32Array(r),Zu[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(s,a)}return s}function ln(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function un(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function ia(n,e){let t=Ku[e];t===void 0&&(t=new Int32Array(e),Ku[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function bv(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function Mv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ln(t,e))return;n.uniform2fv(this.addr,e),un(t,e)}}function Sv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(ln(t,e))return;n.uniform3fv(this.addr,e),un(t,e)}}function Ev(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ln(t,e))return;n.uniform4fv(this.addr,e),un(t,e)}}function wv(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(ln(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),un(t,e)}else{if(ln(t,i))return;eh.set(i),n.uniformMatrix2fv(this.addr,!1,eh),un(t,i)}}function Tv(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(ln(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),un(t,e)}else{if(ln(t,i))return;Qu.set(i),n.uniformMatrix3fv(this.addr,!1,Qu),un(t,i)}}function Av(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(ln(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),un(t,e)}else{if(ln(t,i))return;Ju.set(i),n.uniformMatrix4fv(this.addr,!1,Ju),un(t,i)}}function Rv(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function Cv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ln(t,e))return;n.uniform2iv(this.addr,e),un(t,e)}}function Pv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(ln(t,e))return;n.uniform3iv(this.addr,e),un(t,e)}}function Lv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ln(t,e))return;n.uniform4iv(this.addr,e),un(t,e)}}function Dv(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function Iv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ln(t,e))return;n.uniform2uiv(this.addr,e),un(t,e)}}function Uv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(ln(t,e))return;n.uniform3uiv(this.addr,e),un(t,e)}}function Nv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ln(t,e))return;n.uniform4uiv(this.addr,e),un(t,e)}}function Ov(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let s;this.type===n.SAMPLER_2D_SHADOW?(ju.compareFunction=jh,s=ju):s=_d,t.setTexture2D(e||s,r)}function Fv(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||yd,r)}function kv(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||bd,r)}function zv(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||xd,r)}function Bv(n){switch(n){case 5126:return bv;case 35664:return Mv;case 35665:return Sv;case 35666:return Ev;case 35674:return wv;case 35675:return Tv;case 35676:return Av;case 5124:case 35670:return Rv;case 35667:case 35671:return Cv;case 35668:case 35672:return Pv;case 35669:case 35673:return Lv;case 5125:return Dv;case 36294:return Iv;case 36295:return Uv;case 36296:return Nv;case 35678:case 36198:case 36298:case 36306:case 35682:return Ov;case 35679:case 36299:case 36307:return Fv;case 35680:case 36300:case 36308:case 36293:return kv;case 36289:case 36303:case 36311:case 36292:return zv}}function Vv(n,e){n.uniform1fv(this.addr,e)}function Hv(n,e){const t=us(e,this.size,2);n.uniform2fv(this.addr,t)}function Gv(n,e){const t=us(e,this.size,3);n.uniform3fv(this.addr,t)}function Wv(n,e){const t=us(e,this.size,4);n.uniform4fv(this.addr,t)}function $v(n,e){const t=us(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function qv(n,e){const t=us(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function Xv(n,e){const t=us(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function Yv(n,e){n.uniform1iv(this.addr,e)}function jv(n,e){n.uniform2iv(this.addr,e)}function Zv(n,e){n.uniform3iv(this.addr,e)}function Kv(n,e){n.uniform4iv(this.addr,e)}function Jv(n,e){n.uniform1uiv(this.addr,e)}function Qv(n,e){n.uniform2uiv(this.addr,e)}function e_(n,e){n.uniform3uiv(this.addr,e)}function t_(n,e){n.uniform4uiv(this.addr,e)}function n_(n,e,t){const i=this.cache,r=e.length,s=ia(t,r);ln(i,s)||(n.uniform1iv(this.addr,s),un(i,s));for(let o=0;o!==r;++o)t.setTexture2D(e[o]||_d,s[o])}function i_(n,e,t){const i=this.cache,r=e.length,s=ia(t,r);ln(i,s)||(n.uniform1iv(this.addr,s),un(i,s));for(let o=0;o!==r;++o)t.setTexture3D(e[o]||yd,s[o])}function r_(n,e,t){const i=this.cache,r=e.length,s=ia(t,r);ln(i,s)||(n.uniform1iv(this.addr,s),un(i,s));for(let o=0;o!==r;++o)t.setTextureCube(e[o]||bd,s[o])}function s_(n,e,t){const i=this.cache,r=e.length,s=ia(t,r);ln(i,s)||(n.uniform1iv(this.addr,s),un(i,s));for(let o=0;o!==r;++o)t.setTexture2DArray(e[o]||xd,s[o])}function o_(n){switch(n){case 5126:return Vv;case 35664:return Hv;case 35665:return Gv;case 35666:return Wv;case 35674:return $v;case 35675:return qv;case 35676:return Xv;case 5124:case 35670:return Yv;case 35667:case 35671:return jv;case 35668:case 35672:return Zv;case 35669:case 35673:return Kv;case 5125:return Jv;case 36294:return Qv;case 36295:return e_;case 36296:return t_;case 35678:case 36198:case 36298:case 36306:case 35682:return n_;case 35679:case 36299:case 36307:return i_;case 35680:case 36300:case 36308:case 36293:return r_;case 36289:case 36303:case 36311:case 36292:return s_}}class a_{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Bv(t.type)}}class c_{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=o_(t.type)}}class l_{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(e,t[a.id],i)}}}const ec=/(\w+)(\])?(\[|\.)?/g;function th(n,e){n.seq.push(e),n.map[e.id]=e}function u_(n,e,t){const i=n.name,r=i.length;for(ec.lastIndex=0;;){const s=ec.exec(i),o=ec.lastIndex;let a=s[1];const c=s[2]==="]",l=s[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===r){th(t,l===void 0?new a_(a,n,e):new c_(a,n,e));break}else{let h=t.map[a];h===void 0&&(h=new l_(a),th(t,h)),t=h}}}class zo{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(t,r),o=e.getUniformLocation(t,s.name);u_(s,o,this)}}setValue(e,t,i,r){const s=this.map[t];s!==void 0&&s.setValue(e,i,r)}setOptional(e,t,i){const r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let s=0,o=t.length;s!==o;++s){const a=t[s],c=i[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,r)}}static seqWithValue(e,t){const i=[];for(let r=0,s=e.length;r!==s;++r){const o=e[r];o.id in t&&i.push(o)}return i}}function nh(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const h_=37297;let d_=0;function f_(n,e){const t=n.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let o=r;o<s;o++){const a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}const ih=new dt;function p_(n){Rt._getMatrix(ih,Rt.workingColorSpace,n);const e=`mat3( ${ih.elements.map(t=>t.toFixed(4))} )`;switch(Rt.getTransfer(n)){case Vo:return[e,"LinearTransferOETF"];case Ot:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function rh(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),s=(n.getShaderInfoLog(e)||"").trim();if(i&&s==="")return"";const o=/ERROR: 0:(\d+)/.exec(s);if(o){const a=parseInt(o[1]);return t.toUpperCase()+`

`+s+`

`+f_(n.getShaderSource(e),a)}else return s}function m_(n,e){const t=p_(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function g_(n,e){let t;switch(e){case Tf:t="Linear";break;case Af:t="Reinhard";break;case Rf:t="Cineon";break;case kh:t="ACESFilmic";break;case Pf:t="AgX";break;case Lf:t="Neutral";break;case Cf:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Io=new L;function v_(){Rt.getLuminanceCoefficients(Io);const n=Io.x.toFixed(4),e=Io.y.toFixed(4),t=Io.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function __(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Rs).join(`
`)}function x_(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function y_(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=n.getActiveAttrib(e,r),o=s.name;let a=1;s.type===n.FLOAT_MAT2&&(a=2),s.type===n.FLOAT_MAT3&&(a=3),s.type===n.FLOAT_MAT4&&(a=4),t[o]={type:s.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function Rs(n){return n!==""}function sh(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function oh(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const b_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Zc(n){return n.replace(b_,S_)}const M_=new Map;function S_(n,e){let t=mt[e];if(t===void 0){const i=M_.get(e);if(i!==void 0)t=mt[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Zc(t)}const E_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ah(n){return n.replace(E_,w_)}function w_(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function ch(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}function T_(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Nh?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===Oh?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Ai&&(e="SHADOWMAP_TYPE_VSM"),e}function A_(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case rs:case ss:e="ENVMAP_TYPE_CUBE";break;case Qo:e="ENVMAP_TYPE_CUBE_UV";break}return e}function R_(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case ss:e="ENVMAP_MODE_REFRACTION";break}return e}function C_(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Fh:e="ENVMAP_BLENDING_MULTIPLY";break;case Ef:e="ENVMAP_BLENDING_MIX";break;case wf:e="ENVMAP_BLENDING_ADD";break}return e}function P_(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function L_(n,e,t,i){const r=n.getContext(),s=t.defines;let o=t.vertexShader,a=t.fragmentShader;const c=T_(t),l=A_(t),u=R_(t),h=C_(t),d=P_(t),f=__(t),g=x_(s),v=r.createProgram();let m,p,x=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Rs).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Rs).join(`
`),p.length>0&&(p+=`
`)):(m=[ch(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Rs).join(`
`),p=[ch(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Qi?"#define TONE_MAPPING":"",t.toneMapping!==Qi?mt.tonemapping_pars_fragment:"",t.toneMapping!==Qi?g_("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",mt.colorspace_pars_fragment,m_("linearToOutputTexel",t.outputColorSpace),v_(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Rs).join(`
`)),o=Zc(o),o=sh(o,t),o=oh(o,t),a=Zc(a),a=sh(a,t),a=oh(a,t),o=ah(o),a=ah(a),t.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===au?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===au?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const b=x+m+o,y=x+p+a,M=nh(r,r.VERTEX_SHADER,b),w=nh(r,r.FRAGMENT_SHADER,y);r.attachShader(v,M),r.attachShader(v,w),t.index0AttributeName!==void 0?r.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(v,0,"position"),r.linkProgram(v);function R(I){if(n.debug.checkShaderErrors){const F=r.getProgramInfoLog(v)||"",$=r.getShaderInfoLog(M)||"",H=r.getShaderInfoLog(w)||"",j=F.trim(),G=$.trim(),W=H.trim();let U=!0,de=!0;if(r.getProgramParameter(v,r.LINK_STATUS)===!1)if(U=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,v,M,w);else{const oe=rh(r,M,"vertex"),J=rh(r,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(v,r.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+j+`
`+oe+`
`+J)}else j!==""?console.warn("THREE.WebGLProgram: Program Info Log:",j):(G===""||W==="")&&(de=!1);de&&(I.diagnostics={runnable:U,programLog:j,vertexShader:{log:G,prefix:m},fragmentShader:{log:W,prefix:p}})}r.deleteShader(M),r.deleteShader(w),A=new zo(r,v),E=y_(r,v)}let A;this.getUniforms=function(){return A===void 0&&R(this),A};let E;this.getAttributes=function(){return E===void 0&&R(this),E};let S=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=r.getProgramParameter(v,h_)),S},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=d_++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=M,this.fragmentShader=w,this}let D_=0;class I_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new U_(e),t.set(e,i)),i}}class U_{constructor(e){this.id=D_++,this.code=e,this.usedTimes=0}}function N_(n,e,t,i,r,s,o){const a=new pl,c=new I_,l=new Set,u=[],h=r.logarithmicDepthBuffer,d=r.vertexTextures;let f=r.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(E){return l.add(E),E===0?"uv":`uv${E}`}function m(E,S,I,F,$){const H=F.fog,j=$.geometry,G=E.isMeshStandardMaterial?F.environment:null,W=(E.isMeshStandardMaterial?t:e).get(E.envMap||G),U=W&&W.mapping===Qo?W.image.height:null,de=g[E.type];E.precision!==null&&(f=r.getMaxPrecision(E.precision),f!==E.precision&&console.warn("THREE.WebGLProgram.getParameters:",E.precision,"not supported, using",f,"instead."));const oe=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,J=oe!==void 0?oe.length:0;let We=0;j.morphAttributes.position!==void 0&&(We=1),j.morphAttributes.normal!==void 0&&(We=2),j.morphAttributes.color!==void 0&&(We=3);let at,Fe,pt,te;if(de){const yt=pi[de];at=yt.vertexShader,Fe=yt.fragmentShader}else at=E.vertexShader,Fe=E.fragmentShader,c.update(E),pt=c.getVertexShaderID(E),te=c.getFragmentShaderID(E);const ce=n.getRenderTarget(),Ae=n.state.buffers.depth.getReversed(),qe=$.isInstancedMesh===!0,Be=$.isBatchedMesh===!0,Ze=!!E.map,It=!!E.matcap,k=!!W,fe=!!E.aoMap,ue=!!E.lightMap,ie=!!E.bumpMap,ae=!!E.normalMap,Ee=!!E.displacementMap,pe=!!E.emissiveMap,Se=!!E.metalnessMap,Qe=!!E.roughnessMap,nt=E.anisotropy>0,D=E.clearcoat>0,T=E.dispersion>0,Z=E.iridescence>0,ee=E.sheen>0,he=E.transmission>0,ne=nt&&!!E.anisotropyMap,ke=D&&!!E.clearcoatMap,be=D&&!!E.clearcoatNormalMap,Ge=D&&!!E.clearcoatRoughnessMap,Ve=Z&&!!E.iridescenceMap,Y=Z&&!!E.iridescenceThicknessMap,De=ee&&!!E.sheenColorMap,et=ee&&!!E.sheenRoughnessMap,Xe=!!E.specularMap,Re=!!E.specularColorMap,lt=!!E.specularIntensityMap,V=he&&!!E.transmissionMap,xe=he&&!!E.thicknessMap,Me=!!E.gradientMap,Ne=!!E.alphaMap,ge=E.alphaTest>0,le=!!E.alphaHash,ze=!!E.extensions;let st=Qi;E.toneMapped&&(ce===null||ce.isXRRenderTarget===!0)&&(st=n.toneMapping);const xt={shaderID:de,shaderType:E.type,shaderName:E.name,vertexShader:at,fragmentShader:Fe,defines:E.defines,customVertexShaderID:pt,customFragmentShaderID:te,isRawShaderMaterial:E.isRawShaderMaterial===!0,glslVersion:E.glslVersion,precision:f,batching:Be,batchingColor:Be&&$._colorsTexture!==null,instancing:qe,instancingColor:qe&&$.instanceColor!==null,instancingMorph:qe&&$.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:ce===null?n.outputColorSpace:ce.isXRRenderTarget===!0?ce.texture.colorSpace:os,alphaToCoverage:!!E.alphaToCoverage,map:Ze,matcap:It,envMap:k,envMapMode:k&&W.mapping,envMapCubeUVHeight:U,aoMap:fe,lightMap:ue,bumpMap:ie,normalMap:ae,displacementMap:d&&Ee,emissiveMap:pe,normalMapObjectSpace:ae&&E.normalMapType===Nf,normalMapTangentSpace:ae&&E.normalMapType===Yh,metalnessMap:Se,roughnessMap:Qe,anisotropy:nt,anisotropyMap:ne,clearcoat:D,clearcoatMap:ke,clearcoatNormalMap:be,clearcoatRoughnessMap:Ge,dispersion:T,iridescence:Z,iridescenceMap:Ve,iridescenceThicknessMap:Y,sheen:ee,sheenColorMap:De,sheenRoughnessMap:et,specularMap:Xe,specularColorMap:Re,specularIntensityMap:lt,transmission:he,transmissionMap:V,thicknessMap:xe,gradientMap:Me,opaque:E.transparent===!1&&E.blending===Zr&&E.alphaToCoverage===!1,alphaMap:Ne,alphaTest:ge,alphaHash:le,combine:E.combine,mapUv:Ze&&v(E.map.channel),aoMapUv:fe&&v(E.aoMap.channel),lightMapUv:ue&&v(E.lightMap.channel),bumpMapUv:ie&&v(E.bumpMap.channel),normalMapUv:ae&&v(E.normalMap.channel),displacementMapUv:Ee&&v(E.displacementMap.channel),emissiveMapUv:pe&&v(E.emissiveMap.channel),metalnessMapUv:Se&&v(E.metalnessMap.channel),roughnessMapUv:Qe&&v(E.roughnessMap.channel),anisotropyMapUv:ne&&v(E.anisotropyMap.channel),clearcoatMapUv:ke&&v(E.clearcoatMap.channel),clearcoatNormalMapUv:be&&v(E.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ge&&v(E.clearcoatRoughnessMap.channel),iridescenceMapUv:Ve&&v(E.iridescenceMap.channel),iridescenceThicknessMapUv:Y&&v(E.iridescenceThicknessMap.channel),sheenColorMapUv:De&&v(E.sheenColorMap.channel),sheenRoughnessMapUv:et&&v(E.sheenRoughnessMap.channel),specularMapUv:Xe&&v(E.specularMap.channel),specularColorMapUv:Re&&v(E.specularColorMap.channel),specularIntensityMapUv:lt&&v(E.specularIntensityMap.channel),transmissionMapUv:V&&v(E.transmissionMap.channel),thicknessMapUv:xe&&v(E.thicknessMap.channel),alphaMapUv:Ne&&v(E.alphaMap.channel),vertexTangents:!!j.attributes.tangent&&(ae||nt),vertexColors:E.vertexColors,vertexAlphas:E.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,pointsUvs:$.isPoints===!0&&!!j.attributes.uv&&(Ze||Ne),fog:!!H,useFog:E.fog===!0,fogExp2:!!H&&H.isFogExp2,flatShading:E.flatShading===!0&&E.wireframe===!1,sizeAttenuation:E.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:Ae,skinning:$.isSkinnedMesh===!0,morphTargets:j.morphAttributes.position!==void 0,morphNormals:j.morphAttributes.normal!==void 0,morphColors:j.morphAttributes.color!==void 0,morphTargetsCount:J,morphTextureStride:We,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:E.dithering,shadowMapEnabled:n.shadowMap.enabled&&I.length>0,shadowMapType:n.shadowMap.type,toneMapping:st,decodeVideoTexture:Ze&&E.map.isVideoTexture===!0&&Rt.getTransfer(E.map.colorSpace)===Ot,decodeVideoTextureEmissive:pe&&E.emissiveMap.isVideoTexture===!0&&Rt.getTransfer(E.emissiveMap.colorSpace)===Ot,premultipliedAlpha:E.premultipliedAlpha,doubleSided:E.side===gi,flipSided:E.side===Bn,useDepthPacking:E.depthPacking>=0,depthPacking:E.depthPacking||0,index0AttributeName:E.index0AttributeName,extensionClipCullDistance:ze&&E.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ze&&E.extensions.multiDraw===!0||Be)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:E.customProgramCacheKey()};return xt.vertexUv1s=l.has(1),xt.vertexUv2s=l.has(2),xt.vertexUv3s=l.has(3),l.clear(),xt}function p(E){const S=[];if(E.shaderID?S.push(E.shaderID):(S.push(E.customVertexShaderID),S.push(E.customFragmentShaderID)),E.defines!==void 0)for(const I in E.defines)S.push(I),S.push(E.defines[I]);return E.isRawShaderMaterial===!1&&(x(S,E),b(S,E),S.push(n.outputColorSpace)),S.push(E.customProgramCacheKey),S.join()}function x(E,S){E.push(S.precision),E.push(S.outputColorSpace),E.push(S.envMapMode),E.push(S.envMapCubeUVHeight),E.push(S.mapUv),E.push(S.alphaMapUv),E.push(S.lightMapUv),E.push(S.aoMapUv),E.push(S.bumpMapUv),E.push(S.normalMapUv),E.push(S.displacementMapUv),E.push(S.emissiveMapUv),E.push(S.metalnessMapUv),E.push(S.roughnessMapUv),E.push(S.anisotropyMapUv),E.push(S.clearcoatMapUv),E.push(S.clearcoatNormalMapUv),E.push(S.clearcoatRoughnessMapUv),E.push(S.iridescenceMapUv),E.push(S.iridescenceThicknessMapUv),E.push(S.sheenColorMapUv),E.push(S.sheenRoughnessMapUv),E.push(S.specularMapUv),E.push(S.specularColorMapUv),E.push(S.specularIntensityMapUv),E.push(S.transmissionMapUv),E.push(S.thicknessMapUv),E.push(S.combine),E.push(S.fogExp2),E.push(S.sizeAttenuation),E.push(S.morphTargetsCount),E.push(S.morphAttributeCount),E.push(S.numDirLights),E.push(S.numPointLights),E.push(S.numSpotLights),E.push(S.numSpotLightMaps),E.push(S.numHemiLights),E.push(S.numRectAreaLights),E.push(S.numDirLightShadows),E.push(S.numPointLightShadows),E.push(S.numSpotLightShadows),E.push(S.numSpotLightShadowsWithMaps),E.push(S.numLightProbes),E.push(S.shadowMapType),E.push(S.toneMapping),E.push(S.numClippingPlanes),E.push(S.numClipIntersection),E.push(S.depthPacking)}function b(E,S){a.disableAll(),S.supportsVertexTextures&&a.enable(0),S.instancing&&a.enable(1),S.instancingColor&&a.enable(2),S.instancingMorph&&a.enable(3),S.matcap&&a.enable(4),S.envMap&&a.enable(5),S.normalMapObjectSpace&&a.enable(6),S.normalMapTangentSpace&&a.enable(7),S.clearcoat&&a.enable(8),S.iridescence&&a.enable(9),S.alphaTest&&a.enable(10),S.vertexColors&&a.enable(11),S.vertexAlphas&&a.enable(12),S.vertexUv1s&&a.enable(13),S.vertexUv2s&&a.enable(14),S.vertexUv3s&&a.enable(15),S.vertexTangents&&a.enable(16),S.anisotropy&&a.enable(17),S.alphaHash&&a.enable(18),S.batching&&a.enable(19),S.dispersion&&a.enable(20),S.batchingColor&&a.enable(21),S.gradientMap&&a.enable(22),E.push(a.mask),a.disableAll(),S.fog&&a.enable(0),S.useFog&&a.enable(1),S.flatShading&&a.enable(2),S.logarithmicDepthBuffer&&a.enable(3),S.reversedDepthBuffer&&a.enable(4),S.skinning&&a.enable(5),S.morphTargets&&a.enable(6),S.morphNormals&&a.enable(7),S.morphColors&&a.enable(8),S.premultipliedAlpha&&a.enable(9),S.shadowMapEnabled&&a.enable(10),S.doubleSided&&a.enable(11),S.flipSided&&a.enable(12),S.useDepthPacking&&a.enable(13),S.dithering&&a.enable(14),S.transmission&&a.enable(15),S.sheen&&a.enable(16),S.opaque&&a.enable(17),S.pointsUvs&&a.enable(18),S.decodeVideoTexture&&a.enable(19),S.decodeVideoTextureEmissive&&a.enable(20),S.alphaToCoverage&&a.enable(21),E.push(a.mask)}function y(E){const S=g[E.type];let I;if(S){const F=pi[S];I=wp.clone(F.uniforms)}else I=E.uniforms;return I}function M(E,S){let I;for(let F=0,$=u.length;F<$;F++){const H=u[F];if(H.cacheKey===S){I=H,++I.usedTimes;break}}return I===void 0&&(I=new L_(n,S,E,s),u.push(I)),I}function w(E){if(--E.usedTimes===0){const S=u.indexOf(E);u[S]=u[u.length-1],u.pop(),E.destroy()}}function R(E){c.remove(E)}function A(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:y,acquireProgram:M,releaseProgram:w,releaseShaderCache:R,programs:u,dispose:A}}function O_(){let n=new WeakMap;function e(o){return n.has(o)}function t(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function r(o,a,c){n.get(o)[a]=c}function s(){n=new WeakMap}return{has:e,get:t,remove:i,update:r,dispose:s}}function F_(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function lh(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function uh(){const n=[];let e=0;const t=[],i=[],r=[];function s(){e=0,t.length=0,i.length=0,r.length=0}function o(h,d,f,g,v,m){let p=n[e];return p===void 0?(p={id:h.id,object:h,geometry:d,material:f,groupOrder:g,renderOrder:h.renderOrder,z:v,group:m},n[e]=p):(p.id=h.id,p.object=h,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=h.renderOrder,p.z=v,p.group=m),e++,p}function a(h,d,f,g,v,m){const p=o(h,d,f,g,v,m);f.transmission>0?i.push(p):f.transparent===!0?r.push(p):t.push(p)}function c(h,d,f,g,v,m){const p=o(h,d,f,g,v,m);f.transmission>0?i.unshift(p):f.transparent===!0?r.unshift(p):t.unshift(p)}function l(h,d){t.length>1&&t.sort(h||F_),i.length>1&&i.sort(d||lh),r.length>1&&r.sort(d||lh)}function u(){for(let h=e,d=n.length;h<d;h++){const f=n[h];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:i,transparent:r,init:s,push:a,unshift:c,finish:u,sort:l}}function k_(){let n=new WeakMap;function e(i,r){const s=n.get(i);let o;return s===void 0?(o=new uh,n.set(i,[o])):r>=s.length?(o=new uh,s.push(o)):o=s[r],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function z_(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new L,color:new Mt};break;case"SpotLight":t={position:new L,direction:new L,color:new Mt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new L,color:new Mt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new L,skyColor:new Mt,groundColor:new Mt};break;case"RectAreaLight":t={color:new Mt,position:new L,halfWidth:new L,halfHeight:new L};break}return n[e.id]=t,t}}}function B_(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ye};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ye};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ye,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let V_=0;function H_(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function G_(n){const e=new z_,t=B_(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new L);const r=new L,s=new Wt,o=new Wt;function a(l){let u=0,h=0,d=0;for(let E=0;E<9;E++)i.probe[E].set(0,0,0);let f=0,g=0,v=0,m=0,p=0,x=0,b=0,y=0,M=0,w=0,R=0;l.sort(H_);for(let E=0,S=l.length;E<S;E++){const I=l[E],F=I.color,$=I.intensity,H=I.distance,j=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)u+=F.r*$,h+=F.g*$,d+=F.b*$;else if(I.isLightProbe){for(let G=0;G<9;G++)i.probe[G].addScaledVector(I.sh.coefficients[G],$);R++}else if(I.isDirectionalLight){const G=e.get(I);if(G.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){const W=I.shadow,U=t.get(I);U.shadowIntensity=W.intensity,U.shadowBias=W.bias,U.shadowNormalBias=W.normalBias,U.shadowRadius=W.radius,U.shadowMapSize=W.mapSize,i.directionalShadow[f]=U,i.directionalShadowMap[f]=j,i.directionalShadowMatrix[f]=I.shadow.matrix,x++}i.directional[f]=G,f++}else if(I.isSpotLight){const G=e.get(I);G.position.setFromMatrixPosition(I.matrixWorld),G.color.copy(F).multiplyScalar($),G.distance=H,G.coneCos=Math.cos(I.angle),G.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),G.decay=I.decay,i.spot[v]=G;const W=I.shadow;if(I.map&&(i.spotLightMap[M]=I.map,M++,W.updateMatrices(I),I.castShadow&&w++),i.spotLightMatrix[v]=W.matrix,I.castShadow){const U=t.get(I);U.shadowIntensity=W.intensity,U.shadowBias=W.bias,U.shadowNormalBias=W.normalBias,U.shadowRadius=W.radius,U.shadowMapSize=W.mapSize,i.spotShadow[v]=U,i.spotShadowMap[v]=j,y++}v++}else if(I.isRectAreaLight){const G=e.get(I);G.color.copy(F).multiplyScalar($),G.halfWidth.set(I.width*.5,0,0),G.halfHeight.set(0,I.height*.5,0),i.rectArea[m]=G,m++}else if(I.isPointLight){const G=e.get(I);if(G.color.copy(I.color).multiplyScalar(I.intensity),G.distance=I.distance,G.decay=I.decay,I.castShadow){const W=I.shadow,U=t.get(I);U.shadowIntensity=W.intensity,U.shadowBias=W.bias,U.shadowNormalBias=W.normalBias,U.shadowRadius=W.radius,U.shadowMapSize=W.mapSize,U.shadowCameraNear=W.camera.near,U.shadowCameraFar=W.camera.far,i.pointShadow[g]=U,i.pointShadowMap[g]=j,i.pointShadowMatrix[g]=I.shadow.matrix,b++}i.point[g]=G,g++}else if(I.isHemisphereLight){const G=e.get(I);G.skyColor.copy(I.color).multiplyScalar($),G.groundColor.copy(I.groundColor).multiplyScalar($),i.hemi[p]=G,p++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Le.LTC_FLOAT_1,i.rectAreaLTC2=Le.LTC_FLOAT_2):(i.rectAreaLTC1=Le.LTC_HALF_1,i.rectAreaLTC2=Le.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=h,i.ambient[2]=d;const A=i.hash;(A.directionalLength!==f||A.pointLength!==g||A.spotLength!==v||A.rectAreaLength!==m||A.hemiLength!==p||A.numDirectionalShadows!==x||A.numPointShadows!==b||A.numSpotShadows!==y||A.numSpotMaps!==M||A.numLightProbes!==R)&&(i.directional.length=f,i.spot.length=v,i.rectArea.length=m,i.point.length=g,i.hemi.length=p,i.directionalShadow.length=x,i.directionalShadowMap.length=x,i.pointShadow.length=b,i.pointShadowMap.length=b,i.spotShadow.length=y,i.spotShadowMap.length=y,i.directionalShadowMatrix.length=x,i.pointShadowMatrix.length=b,i.spotLightMatrix.length=y+M-w,i.spotLightMap.length=M,i.numSpotLightShadowsWithMaps=w,i.numLightProbes=R,A.directionalLength=f,A.pointLength=g,A.spotLength=v,A.rectAreaLength=m,A.hemiLength=p,A.numDirectionalShadows=x,A.numPointShadows=b,A.numSpotShadows=y,A.numSpotMaps=M,A.numLightProbes=R,i.version=V_++)}function c(l,u){let h=0,d=0,f=0,g=0,v=0;const m=u.matrixWorldInverse;for(let p=0,x=l.length;p<x;p++){const b=l[p];if(b.isDirectionalLight){const y=i.directional[h];y.direction.setFromMatrixPosition(b.matrixWorld),r.setFromMatrixPosition(b.target.matrixWorld),y.direction.sub(r),y.direction.transformDirection(m),h++}else if(b.isSpotLight){const y=i.spot[f];y.position.setFromMatrixPosition(b.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(b.matrixWorld),r.setFromMatrixPosition(b.target.matrixWorld),y.direction.sub(r),y.direction.transformDirection(m),f++}else if(b.isRectAreaLight){const y=i.rectArea[g];y.position.setFromMatrixPosition(b.matrixWorld),y.position.applyMatrix4(m),o.identity(),s.copy(b.matrixWorld),s.premultiply(m),o.extractRotation(s),y.halfWidth.set(b.width*.5,0,0),y.halfHeight.set(0,b.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),g++}else if(b.isPointLight){const y=i.point[d];y.position.setFromMatrixPosition(b.matrixWorld),y.position.applyMatrix4(m),d++}else if(b.isHemisphereLight){const y=i.hemi[v];y.direction.setFromMatrixPosition(b.matrixWorld),y.direction.transformDirection(m),v++}}}return{setup:a,setupView:c,state:i}}function hh(n){const e=new G_(n),t=[],i=[];function r(u){l.camera=u,t.length=0,i.length=0}function s(u){t.push(u)}function o(u){i.push(u)}function a(){e.setup(t)}function c(u){e.setupView(t,u)}const l={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:l,setupLights:a,setupLightsView:c,pushLight:s,pushShadow:o}}function W_(n){let e=new WeakMap;function t(r,s=0){const o=e.get(r);let a;return o===void 0?(a=new hh(n),e.set(r,[a])):s>=o.length?(a=new hh(n),o.push(a)):a=o[s],a}function i(){e=new WeakMap}return{get:t,dispose:i}}const $_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,q_=`uniform sampler2D shadow_pass;
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
}`;function X_(n,e,t){let i=new gl;const r=new ye,s=new ye,o=new Zt,a=new pm({depthPacking:Uf}),c=new mm,l={},u=t.maxTextureSize,h={[nr]:Bn,[Bn]:nr,[gi]:gi},d=new ir({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ye},radius:{value:4}},vertexShader:$_,fragmentShader:q_}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new cn;g.setAttribute("position",new Qn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new Rn(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Nh;let p=this.type;this.render=function(w,R,A){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;const E=n.getRenderTarget(),S=n.getActiveCubeFace(),I=n.getActiveMipmapLevel(),F=n.state;F.setBlending(Ji),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const $=p!==Ai&&this.type===Ai,H=p===Ai&&this.type!==Ai;for(let j=0,G=w.length;j<G;j++){const W=w[j],U=W.shadow;if(U===void 0){console.warn("THREE.WebGLShadowMap:",W,"has no shadow.");continue}if(U.autoUpdate===!1&&U.needsUpdate===!1)continue;r.copy(U.mapSize);const de=U.getFrameExtents();if(r.multiply(de),s.copy(U.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/de.x),r.x=s.x*de.x,U.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/de.y),r.y=s.y*de.y,U.mapSize.y=s.y)),U.map===null||$===!0||H===!0){const J=this.type!==Ai?{minFilter:li,magFilter:li}:{};U.map!==null&&U.map.dispose(),U.map=new Mr(r.x,r.y,J),U.map.texture.name=W.name+".shadowMap",U.camera.updateProjectionMatrix()}n.setRenderTarget(U.map),n.clear();const oe=U.getViewportCount();for(let J=0;J<oe;J++){const We=U.getViewport(J);o.set(s.x*We.x,s.y*We.y,s.x*We.z,s.y*We.w),F.viewport(o),U.updateMatrices(W,J),i=U.getFrustum(),y(R,A,U.camera,W,this.type)}U.isPointLightShadow!==!0&&this.type===Ai&&x(U,A),U.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(E,S,I)};function x(w,R){const A=e.update(v);d.defines.VSM_SAMPLES!==w.blurSamples&&(d.defines.VSM_SAMPLES=w.blurSamples,f.defines.VSM_SAMPLES=w.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new Mr(r.x,r.y)),d.uniforms.shadow_pass.value=w.map.texture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,n.setRenderTarget(w.mapPass),n.clear(),n.renderBufferDirect(R,null,A,d,v,null),f.uniforms.shadow_pass.value=w.mapPass.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,n.setRenderTarget(w.map),n.clear(),n.renderBufferDirect(R,null,A,f,v,null)}function b(w,R,A,E){let S=null;const I=A.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(I!==void 0)S=I;else if(S=A.isPointLight===!0?c:a,n.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const F=S.uuid,$=R.uuid;let H=l[F];H===void 0&&(H={},l[F]=H);let j=H[$];j===void 0&&(j=S.clone(),H[$]=j,R.addEventListener("dispose",M)),S=j}if(S.visible=R.visible,S.wireframe=R.wireframe,E===Ai?S.side=R.shadowSide!==null?R.shadowSide:R.side:S.side=R.shadowSide!==null?R.shadowSide:h[R.side],S.alphaMap=R.alphaMap,S.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,S.map=R.map,S.clipShadows=R.clipShadows,S.clippingPlanes=R.clippingPlanes,S.clipIntersection=R.clipIntersection,S.displacementMap=R.displacementMap,S.displacementScale=R.displacementScale,S.displacementBias=R.displacementBias,S.wireframeLinewidth=R.wireframeLinewidth,S.linewidth=R.linewidth,A.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const F=n.properties.get(S);F.light=A}return S}function y(w,R,A,E,S){if(w.visible===!1)return;if(w.layers.test(R.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&S===Ai)&&(!w.frustumCulled||i.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(A.matrixWorldInverse,w.matrixWorld);const $=e.update(w),H=w.material;if(Array.isArray(H)){const j=$.groups;for(let G=0,W=j.length;G<W;G++){const U=j[G],de=H[U.materialIndex];if(de&&de.visible){const oe=b(w,de,E,S);w.onBeforeShadow(n,w,R,A,$,oe,U),n.renderBufferDirect(A,null,$,oe,w,U),w.onAfterShadow(n,w,R,A,$,oe,U)}}}else if(H.visible){const j=b(w,H,E,S);w.onBeforeShadow(n,w,R,A,$,j,null),n.renderBufferDirect(A,null,$,j,w,null),w.onAfterShadow(n,w,R,A,$,j,null)}}const F=w.children;for(let $=0,H=F.length;$<H;$++)y(F[$],R,A,E,S)}function M(w){w.target.removeEventListener("dispose",M);for(const A in l){const E=l[A],S=w.target.uuid;S in E&&(E[S].dispose(),delete E[S])}}}const Y_={[oc]:ac,[cc]:hc,[lc]:dc,[is]:uc,[ac]:oc,[hc]:cc,[dc]:lc,[uc]:is};function j_(n,e){function t(){let V=!1;const xe=new Zt;let Me=null;const Ne=new Zt(0,0,0,0);return{setMask:function(ge){Me!==ge&&!V&&(n.colorMask(ge,ge,ge,ge),Me=ge)},setLocked:function(ge){V=ge},setClear:function(ge,le,ze,st,xt){xt===!0&&(ge*=st,le*=st,ze*=st),xe.set(ge,le,ze,st),Ne.equals(xe)===!1&&(n.clearColor(ge,le,ze,st),Ne.copy(xe))},reset:function(){V=!1,Me=null,Ne.set(-1,0,0,0)}}}function i(){let V=!1,xe=!1,Me=null,Ne=null,ge=null;return{setReversed:function(le){if(xe!==le){const ze=e.get("EXT_clip_control");le?ze.clipControlEXT(ze.LOWER_LEFT_EXT,ze.ZERO_TO_ONE_EXT):ze.clipControlEXT(ze.LOWER_LEFT_EXT,ze.NEGATIVE_ONE_TO_ONE_EXT),xe=le;const st=ge;ge=null,this.setClear(st)}},getReversed:function(){return xe},setTest:function(le){le?ce(n.DEPTH_TEST):Ae(n.DEPTH_TEST)},setMask:function(le){Me!==le&&!V&&(n.depthMask(le),Me=le)},setFunc:function(le){if(xe&&(le=Y_[le]),Ne!==le){switch(le){case oc:n.depthFunc(n.NEVER);break;case ac:n.depthFunc(n.ALWAYS);break;case cc:n.depthFunc(n.LESS);break;case is:n.depthFunc(n.LEQUAL);break;case lc:n.depthFunc(n.EQUAL);break;case uc:n.depthFunc(n.GEQUAL);break;case hc:n.depthFunc(n.GREATER);break;case dc:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Ne=le}},setLocked:function(le){V=le},setClear:function(le){ge!==le&&(xe&&(le=1-le),n.clearDepth(le),ge=le)},reset:function(){V=!1,Me=null,Ne=null,ge=null,xe=!1}}}function r(){let V=!1,xe=null,Me=null,Ne=null,ge=null,le=null,ze=null,st=null,xt=null;return{setTest:function(yt){V||(yt?ce(n.STENCIL_TEST):Ae(n.STENCIL_TEST))},setMask:function(yt){xe!==yt&&!V&&(n.stencilMask(yt),xe=yt)},setFunc:function(yt,fn,Vn){(Me!==yt||Ne!==fn||ge!==Vn)&&(n.stencilFunc(yt,fn,Vn),Me=yt,Ne=fn,ge=Vn)},setOp:function(yt,fn,Vn){(le!==yt||ze!==fn||st!==Vn)&&(n.stencilOp(yt,fn,Vn),le=yt,ze=fn,st=Vn)},setLocked:function(yt){V=yt},setClear:function(yt){xt!==yt&&(n.clearStencil(yt),xt=yt)},reset:function(){V=!1,xe=null,Me=null,Ne=null,ge=null,le=null,ze=null,st=null,xt=null}}}const s=new t,o=new i,a=new r,c=new WeakMap,l=new WeakMap;let u={},h={},d=new WeakMap,f=[],g=null,v=!1,m=null,p=null,x=null,b=null,y=null,M=null,w=null,R=new Mt(0,0,0),A=0,E=!1,S=null,I=null,F=null,$=null,H=null;const j=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let G=!1,W=0;const U=n.getParameter(n.VERSION);U.indexOf("WebGL")!==-1?(W=parseFloat(/^WebGL (\d)/.exec(U)[1]),G=W>=1):U.indexOf("OpenGL ES")!==-1&&(W=parseFloat(/^OpenGL ES (\d)/.exec(U)[1]),G=W>=2);let de=null,oe={};const J=n.getParameter(n.SCISSOR_BOX),We=n.getParameter(n.VIEWPORT),at=new Zt().fromArray(J),Fe=new Zt().fromArray(We);function pt(V,xe,Me,Ne){const ge=new Uint8Array(4),le=n.createTexture();n.bindTexture(V,le),n.texParameteri(V,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(V,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let ze=0;ze<Me;ze++)V===n.TEXTURE_3D||V===n.TEXTURE_2D_ARRAY?n.texImage3D(xe,0,n.RGBA,1,1,Ne,0,n.RGBA,n.UNSIGNED_BYTE,ge):n.texImage2D(xe+ze,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,ge);return le}const te={};te[n.TEXTURE_2D]=pt(n.TEXTURE_2D,n.TEXTURE_2D,1),te[n.TEXTURE_CUBE_MAP]=pt(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),te[n.TEXTURE_2D_ARRAY]=pt(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),te[n.TEXTURE_3D]=pt(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ce(n.DEPTH_TEST),o.setFunc(is),ie(!1),ae(tu),ce(n.CULL_FACE),fe(Ji);function ce(V){u[V]!==!0&&(n.enable(V),u[V]=!0)}function Ae(V){u[V]!==!1&&(n.disable(V),u[V]=!1)}function qe(V,xe){return h[V]!==xe?(n.bindFramebuffer(V,xe),h[V]=xe,V===n.DRAW_FRAMEBUFFER&&(h[n.FRAMEBUFFER]=xe),V===n.FRAMEBUFFER&&(h[n.DRAW_FRAMEBUFFER]=xe),!0):!1}function Be(V,xe){let Me=f,Ne=!1;if(V){Me=d.get(xe),Me===void 0&&(Me=[],d.set(xe,Me));const ge=V.textures;if(Me.length!==ge.length||Me[0]!==n.COLOR_ATTACHMENT0){for(let le=0,ze=ge.length;le<ze;le++)Me[le]=n.COLOR_ATTACHMENT0+le;Me.length=ge.length,Ne=!0}}else Me[0]!==n.BACK&&(Me[0]=n.BACK,Ne=!0);Ne&&n.drawBuffers(Me)}function Ze(V){return g!==V?(n.useProgram(V),g=V,!0):!1}const It={[gr]:n.FUNC_ADD,[af]:n.FUNC_SUBTRACT,[cf]:n.FUNC_REVERSE_SUBTRACT};It[lf]=n.MIN,It[uf]=n.MAX;const k={[hf]:n.ZERO,[df]:n.ONE,[ff]:n.SRC_COLOR,[rc]:n.SRC_ALPHA,[xf]:n.SRC_ALPHA_SATURATE,[vf]:n.DST_COLOR,[mf]:n.DST_ALPHA,[pf]:n.ONE_MINUS_SRC_COLOR,[sc]:n.ONE_MINUS_SRC_ALPHA,[_f]:n.ONE_MINUS_DST_COLOR,[gf]:n.ONE_MINUS_DST_ALPHA,[yf]:n.CONSTANT_COLOR,[bf]:n.ONE_MINUS_CONSTANT_COLOR,[Mf]:n.CONSTANT_ALPHA,[Sf]:n.ONE_MINUS_CONSTANT_ALPHA};function fe(V,xe,Me,Ne,ge,le,ze,st,xt,yt){if(V===Ji){v===!0&&(Ae(n.BLEND),v=!1);return}if(v===!1&&(ce(n.BLEND),v=!0),V!==of){if(V!==m||yt!==E){if((p!==gr||y!==gr)&&(n.blendEquation(n.FUNC_ADD),p=gr,y=gr),yt)switch(V){case Zr:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case nu:n.blendFunc(n.ONE,n.ONE);break;case iu:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case ru:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",V);break}else switch(V){case Zr:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case nu:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case iu:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ru:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",V);break}x=null,b=null,M=null,w=null,R.set(0,0,0),A=0,m=V,E=yt}return}ge=ge||xe,le=le||Me,ze=ze||Ne,(xe!==p||ge!==y)&&(n.blendEquationSeparate(It[xe],It[ge]),p=xe,y=ge),(Me!==x||Ne!==b||le!==M||ze!==w)&&(n.blendFuncSeparate(k[Me],k[Ne],k[le],k[ze]),x=Me,b=Ne,M=le,w=ze),(st.equals(R)===!1||xt!==A)&&(n.blendColor(st.r,st.g,st.b,xt),R.copy(st),A=xt),m=V,E=!1}function ue(V,xe){V.side===gi?Ae(n.CULL_FACE):ce(n.CULL_FACE);let Me=V.side===Bn;xe&&(Me=!Me),ie(Me),V.blending===Zr&&V.transparent===!1?fe(Ji):fe(V.blending,V.blendEquation,V.blendSrc,V.blendDst,V.blendEquationAlpha,V.blendSrcAlpha,V.blendDstAlpha,V.blendColor,V.blendAlpha,V.premultipliedAlpha),o.setFunc(V.depthFunc),o.setTest(V.depthTest),o.setMask(V.depthWrite),s.setMask(V.colorWrite);const Ne=V.stencilWrite;a.setTest(Ne),Ne&&(a.setMask(V.stencilWriteMask),a.setFunc(V.stencilFunc,V.stencilRef,V.stencilFuncMask),a.setOp(V.stencilFail,V.stencilZFail,V.stencilZPass)),pe(V.polygonOffset,V.polygonOffsetFactor,V.polygonOffsetUnits),V.alphaToCoverage===!0?ce(n.SAMPLE_ALPHA_TO_COVERAGE):Ae(n.SAMPLE_ALPHA_TO_COVERAGE)}function ie(V){S!==V&&(V?n.frontFace(n.CW):n.frontFace(n.CCW),S=V)}function ae(V){V!==rf?(ce(n.CULL_FACE),V!==I&&(V===tu?n.cullFace(n.BACK):V===sf?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Ae(n.CULL_FACE),I=V}function Ee(V){V!==F&&(G&&n.lineWidth(V),F=V)}function pe(V,xe,Me){V?(ce(n.POLYGON_OFFSET_FILL),($!==xe||H!==Me)&&(n.polygonOffset(xe,Me),$=xe,H=Me)):Ae(n.POLYGON_OFFSET_FILL)}function Se(V){V?ce(n.SCISSOR_TEST):Ae(n.SCISSOR_TEST)}function Qe(V){V===void 0&&(V=n.TEXTURE0+j-1),de!==V&&(n.activeTexture(V),de=V)}function nt(V,xe,Me){Me===void 0&&(de===null?Me=n.TEXTURE0+j-1:Me=de);let Ne=oe[Me];Ne===void 0&&(Ne={type:void 0,texture:void 0},oe[Me]=Ne),(Ne.type!==V||Ne.texture!==xe)&&(de!==Me&&(n.activeTexture(Me),de=Me),n.bindTexture(V,xe||te[V]),Ne.type=V,Ne.texture=xe)}function D(){const V=oe[de];V!==void 0&&V.type!==void 0&&(n.bindTexture(V.type,null),V.type=void 0,V.texture=void 0)}function T(){try{n.compressedTexImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Z(){try{n.compressedTexImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function ee(){try{n.texSubImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function he(){try{n.texSubImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function ne(){try{n.compressedTexSubImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function ke(){try{n.compressedTexSubImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function be(){try{n.texStorage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Ge(){try{n.texStorage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Ve(){try{n.texImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Y(){try{n.texImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function De(V){at.equals(V)===!1&&(n.scissor(V.x,V.y,V.z,V.w),at.copy(V))}function et(V){Fe.equals(V)===!1&&(n.viewport(V.x,V.y,V.z,V.w),Fe.copy(V))}function Xe(V,xe){let Me=l.get(xe);Me===void 0&&(Me=new WeakMap,l.set(xe,Me));let Ne=Me.get(V);Ne===void 0&&(Ne=n.getUniformBlockIndex(xe,V.name),Me.set(V,Ne))}function Re(V,xe){const Ne=l.get(xe).get(V);c.get(xe)!==Ne&&(n.uniformBlockBinding(xe,Ne,V.__bindingPointIndex),c.set(xe,Ne))}function lt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),u={},de=null,oe={},h={},d=new WeakMap,f=[],g=null,v=!1,m=null,p=null,x=null,b=null,y=null,M=null,w=null,R=new Mt(0,0,0),A=0,E=!1,S=null,I=null,F=null,$=null,H=null,at.set(0,0,n.canvas.width,n.canvas.height),Fe.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:ce,disable:Ae,bindFramebuffer:qe,drawBuffers:Be,useProgram:Ze,setBlending:fe,setMaterial:ue,setFlipSided:ie,setCullFace:ae,setLineWidth:Ee,setPolygonOffset:pe,setScissorTest:Se,activeTexture:Qe,bindTexture:nt,unbindTexture:D,compressedTexImage2D:T,compressedTexImage3D:Z,texImage2D:Ve,texImage3D:Y,updateUBOMapping:Xe,uniformBlockBinding:Re,texStorage2D:be,texStorage3D:Ge,texSubImage2D:ee,texSubImage3D:he,compressedTexSubImage2D:ne,compressedTexSubImage3D:ke,scissor:De,viewport:et,reset:lt}}function Z_(n,e,t,i,r,s,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new ye,u=new WeakMap;let h;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(D,T){return f?new OffscreenCanvas(D,T):Go("canvas")}function v(D,T,Z){let ee=1;const he=nt(D);if((he.width>Z||he.height>Z)&&(ee=Z/Math.max(he.width,he.height)),ee<1)if(typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&D instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&D instanceof ImageBitmap||typeof VideoFrame<"u"&&D instanceof VideoFrame){const ne=Math.floor(ee*he.width),ke=Math.floor(ee*he.height);h===void 0&&(h=g(ne,ke));const be=T?g(ne,ke):h;return be.width=ne,be.height=ke,be.getContext("2d").drawImage(D,0,0,ne,ke),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+he.width+"x"+he.height+") to ("+ne+"x"+ke+")."),be}else return"data"in D&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+he.width+"x"+he.height+")."),D;return D}function m(D){return D.generateMipmaps}function p(D){n.generateMipmap(D)}function x(D){return D.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:D.isWebGL3DRenderTarget?n.TEXTURE_3D:D.isWebGLArrayRenderTarget||D.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function b(D,T,Z,ee,he=!1){if(D!==null){if(n[D]!==void 0)return n[D];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+D+"'")}let ne=T;if(T===n.RED&&(Z===n.FLOAT&&(ne=n.R32F),Z===n.HALF_FLOAT&&(ne=n.R16F),Z===n.UNSIGNED_BYTE&&(ne=n.R8)),T===n.RED_INTEGER&&(Z===n.UNSIGNED_BYTE&&(ne=n.R8UI),Z===n.UNSIGNED_SHORT&&(ne=n.R16UI),Z===n.UNSIGNED_INT&&(ne=n.R32UI),Z===n.BYTE&&(ne=n.R8I),Z===n.SHORT&&(ne=n.R16I),Z===n.INT&&(ne=n.R32I)),T===n.RG&&(Z===n.FLOAT&&(ne=n.RG32F),Z===n.HALF_FLOAT&&(ne=n.RG16F),Z===n.UNSIGNED_BYTE&&(ne=n.RG8)),T===n.RG_INTEGER&&(Z===n.UNSIGNED_BYTE&&(ne=n.RG8UI),Z===n.UNSIGNED_SHORT&&(ne=n.RG16UI),Z===n.UNSIGNED_INT&&(ne=n.RG32UI),Z===n.BYTE&&(ne=n.RG8I),Z===n.SHORT&&(ne=n.RG16I),Z===n.INT&&(ne=n.RG32I)),T===n.RGB_INTEGER&&(Z===n.UNSIGNED_BYTE&&(ne=n.RGB8UI),Z===n.UNSIGNED_SHORT&&(ne=n.RGB16UI),Z===n.UNSIGNED_INT&&(ne=n.RGB32UI),Z===n.BYTE&&(ne=n.RGB8I),Z===n.SHORT&&(ne=n.RGB16I),Z===n.INT&&(ne=n.RGB32I)),T===n.RGBA_INTEGER&&(Z===n.UNSIGNED_BYTE&&(ne=n.RGBA8UI),Z===n.UNSIGNED_SHORT&&(ne=n.RGBA16UI),Z===n.UNSIGNED_INT&&(ne=n.RGBA32UI),Z===n.BYTE&&(ne=n.RGBA8I),Z===n.SHORT&&(ne=n.RGBA16I),Z===n.INT&&(ne=n.RGBA32I)),T===n.RGB&&(Z===n.UNSIGNED_INT_5_9_9_9_REV&&(ne=n.RGB9_E5),Z===n.UNSIGNED_INT_10F_11F_11F_REV&&(ne=n.R11F_G11F_B10F)),T===n.RGBA){const ke=he?Vo:Rt.getTransfer(ee);Z===n.FLOAT&&(ne=n.RGBA32F),Z===n.HALF_FLOAT&&(ne=n.RGBA16F),Z===n.UNSIGNED_BYTE&&(ne=ke===Ot?n.SRGB8_ALPHA8:n.RGBA8),Z===n.UNSIGNED_SHORT_4_4_4_4&&(ne=n.RGBA4),Z===n.UNSIGNED_SHORT_5_5_5_1&&(ne=n.RGB5_A1)}return(ne===n.R16F||ne===n.R32F||ne===n.RG16F||ne===n.RG32F||ne===n.RGBA16F||ne===n.RGBA32F)&&e.get("EXT_color_buffer_float"),ne}function y(D,T){let Z;return D?T===null||T===br||T===ks?Z=n.DEPTH24_STENCIL8:T===Di?Z=n.DEPTH32F_STENCIL8:T===Fs&&(Z=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):T===null||T===br||T===ks?Z=n.DEPTH_COMPONENT24:T===Di?Z=n.DEPTH_COMPONENT32F:T===Fs&&(Z=n.DEPTH_COMPONENT16),Z}function M(D,T){return m(D)===!0||D.isFramebufferTexture&&D.minFilter!==li&&D.minFilter!==ai?Math.log2(Math.max(T.width,T.height))+1:D.mipmaps!==void 0&&D.mipmaps.length>0?D.mipmaps.length:D.isCompressedTexture&&Array.isArray(D.image)?T.mipmaps.length:1}function w(D){const T=D.target;T.removeEventListener("dispose",w),A(T),T.isVideoTexture&&u.delete(T)}function R(D){const T=D.target;T.removeEventListener("dispose",R),S(T)}function A(D){const T=i.get(D);if(T.__webglInit===void 0)return;const Z=D.source,ee=d.get(Z);if(ee){const he=ee[T.__cacheKey];he.usedTimes--,he.usedTimes===0&&E(D),Object.keys(ee).length===0&&d.delete(Z)}i.remove(D)}function E(D){const T=i.get(D);n.deleteTexture(T.__webglTexture);const Z=D.source,ee=d.get(Z);delete ee[T.__cacheKey],o.memory.textures--}function S(D){const T=i.get(D);if(D.depthTexture&&(D.depthTexture.dispose(),i.remove(D.depthTexture)),D.isWebGLCubeRenderTarget)for(let ee=0;ee<6;ee++){if(Array.isArray(T.__webglFramebuffer[ee]))for(let he=0;he<T.__webglFramebuffer[ee].length;he++)n.deleteFramebuffer(T.__webglFramebuffer[ee][he]);else n.deleteFramebuffer(T.__webglFramebuffer[ee]);T.__webglDepthbuffer&&n.deleteRenderbuffer(T.__webglDepthbuffer[ee])}else{if(Array.isArray(T.__webglFramebuffer))for(let ee=0;ee<T.__webglFramebuffer.length;ee++)n.deleteFramebuffer(T.__webglFramebuffer[ee]);else n.deleteFramebuffer(T.__webglFramebuffer);if(T.__webglDepthbuffer&&n.deleteRenderbuffer(T.__webglDepthbuffer),T.__webglMultisampledFramebuffer&&n.deleteFramebuffer(T.__webglMultisampledFramebuffer),T.__webglColorRenderbuffer)for(let ee=0;ee<T.__webglColorRenderbuffer.length;ee++)T.__webglColorRenderbuffer[ee]&&n.deleteRenderbuffer(T.__webglColorRenderbuffer[ee]);T.__webglDepthRenderbuffer&&n.deleteRenderbuffer(T.__webglDepthRenderbuffer)}const Z=D.textures;for(let ee=0,he=Z.length;ee<he;ee++){const ne=i.get(Z[ee]);ne.__webglTexture&&(n.deleteTexture(ne.__webglTexture),o.memory.textures--),i.remove(Z[ee])}i.remove(D)}let I=0;function F(){I=0}function $(){const D=I;return D>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+D+" texture units while this GPU supports only "+r.maxTextures),I+=1,D}function H(D){const T=[];return T.push(D.wrapS),T.push(D.wrapT),T.push(D.wrapR||0),T.push(D.magFilter),T.push(D.minFilter),T.push(D.anisotropy),T.push(D.internalFormat),T.push(D.format),T.push(D.type),T.push(D.generateMipmaps),T.push(D.premultiplyAlpha),T.push(D.flipY),T.push(D.unpackAlignment),T.push(D.colorSpace),T.join()}function j(D,T){const Z=i.get(D);if(D.isVideoTexture&&Se(D),D.isRenderTargetTexture===!1&&D.isExternalTexture!==!0&&D.version>0&&Z.__version!==D.version){const ee=D.image;if(ee===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ee.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{te(Z,D,T);return}}else D.isExternalTexture&&(Z.__webglTexture=D.sourceTexture?D.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,Z.__webglTexture,n.TEXTURE0+T)}function G(D,T){const Z=i.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&Z.__version!==D.version){te(Z,D,T);return}t.bindTexture(n.TEXTURE_2D_ARRAY,Z.__webglTexture,n.TEXTURE0+T)}function W(D,T){const Z=i.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&Z.__version!==D.version){te(Z,D,T);return}t.bindTexture(n.TEXTURE_3D,Z.__webglTexture,n.TEXTURE0+T)}function U(D,T){const Z=i.get(D);if(D.version>0&&Z.__version!==D.version){ce(Z,D,T);return}t.bindTexture(n.TEXTURE_CUBE_MAP,Z.__webglTexture,n.TEXTURE0+T)}const de={[mc]:n.REPEAT,[xr]:n.CLAMP_TO_EDGE,[gc]:n.MIRRORED_REPEAT},oe={[li]:n.NEAREST,[Df]:n.NEAREST_MIPMAP_NEAREST,[ro]:n.NEAREST_MIPMAP_LINEAR,[ai]:n.LINEAR,[ya]:n.LINEAR_MIPMAP_NEAREST,[Zi]:n.LINEAR_MIPMAP_LINEAR},J={[Of]:n.NEVER,[Hf]:n.ALWAYS,[Ff]:n.LESS,[jh]:n.LEQUAL,[kf]:n.EQUAL,[Vf]:n.GEQUAL,[zf]:n.GREATER,[Bf]:n.NOTEQUAL};function We(D,T){if(T.type===Di&&e.has("OES_texture_float_linear")===!1&&(T.magFilter===ai||T.magFilter===ya||T.magFilter===ro||T.magFilter===Zi||T.minFilter===ai||T.minFilter===ya||T.minFilter===ro||T.minFilter===Zi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(D,n.TEXTURE_WRAP_S,de[T.wrapS]),n.texParameteri(D,n.TEXTURE_WRAP_T,de[T.wrapT]),(D===n.TEXTURE_3D||D===n.TEXTURE_2D_ARRAY)&&n.texParameteri(D,n.TEXTURE_WRAP_R,de[T.wrapR]),n.texParameteri(D,n.TEXTURE_MAG_FILTER,oe[T.magFilter]),n.texParameteri(D,n.TEXTURE_MIN_FILTER,oe[T.minFilter]),T.compareFunction&&(n.texParameteri(D,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(D,n.TEXTURE_COMPARE_FUNC,J[T.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===li||T.minFilter!==ro&&T.minFilter!==Zi||T.type===Di&&e.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||i.get(T).__currentAnisotropy){const Z=e.get("EXT_texture_filter_anisotropic");n.texParameterf(D,Z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,r.getMaxAnisotropy())),i.get(T).__currentAnisotropy=T.anisotropy}}}function at(D,T){let Z=!1;D.__webglInit===void 0&&(D.__webglInit=!0,T.addEventListener("dispose",w));const ee=T.source;let he=d.get(ee);he===void 0&&(he={},d.set(ee,he));const ne=H(T);if(ne!==D.__cacheKey){he[ne]===void 0&&(he[ne]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,Z=!0),he[ne].usedTimes++;const ke=he[D.__cacheKey];ke!==void 0&&(he[D.__cacheKey].usedTimes--,ke.usedTimes===0&&E(T)),D.__cacheKey=ne,D.__webglTexture=he[ne].texture}return Z}function Fe(D,T,Z){return Math.floor(Math.floor(D/Z)/T)}function pt(D,T,Z,ee){const ne=D.updateRanges;if(ne.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,T.width,T.height,Z,ee,T.data);else{ne.sort((Y,De)=>Y.start-De.start);let ke=0;for(let Y=1;Y<ne.length;Y++){const De=ne[ke],et=ne[Y],Xe=De.start+De.count,Re=Fe(et.start,T.width,4),lt=Fe(De.start,T.width,4);et.start<=Xe+1&&Re===lt&&Fe(et.start+et.count-1,T.width,4)===Re?De.count=Math.max(De.count,et.start+et.count-De.start):(++ke,ne[ke]=et)}ne.length=ke+1;const be=n.getParameter(n.UNPACK_ROW_LENGTH),Ge=n.getParameter(n.UNPACK_SKIP_PIXELS),Ve=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,T.width);for(let Y=0,De=ne.length;Y<De;Y++){const et=ne[Y],Xe=Math.floor(et.start/4),Re=Math.ceil(et.count/4),lt=Xe%T.width,V=Math.floor(Xe/T.width),xe=Re,Me=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,lt),n.pixelStorei(n.UNPACK_SKIP_ROWS,V),t.texSubImage2D(n.TEXTURE_2D,0,lt,V,xe,Me,Z,ee,T.data)}D.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,be),n.pixelStorei(n.UNPACK_SKIP_PIXELS,Ge),n.pixelStorei(n.UNPACK_SKIP_ROWS,Ve)}}function te(D,T,Z){let ee=n.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(ee=n.TEXTURE_2D_ARRAY),T.isData3DTexture&&(ee=n.TEXTURE_3D);const he=at(D,T),ne=T.source;t.bindTexture(ee,D.__webglTexture,n.TEXTURE0+Z);const ke=i.get(ne);if(ne.version!==ke.__version||he===!0){t.activeTexture(n.TEXTURE0+Z);const be=Rt.getPrimaries(Rt.workingColorSpace),Ge=T.colorSpace===ji?null:Rt.getPrimaries(T.colorSpace),Ve=T.colorSpace===ji||be===Ge?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,T.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,T.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ve);let Y=v(T.image,!1,r.maxTextureSize);Y=Qe(T,Y);const De=s.convert(T.format,T.colorSpace),et=s.convert(T.type);let Xe=b(T.internalFormat,De,et,T.colorSpace,T.isVideoTexture);We(ee,T);let Re;const lt=T.mipmaps,V=T.isVideoTexture!==!0,xe=ke.__version===void 0||he===!0,Me=ne.dataReady,Ne=M(T,Y);if(T.isDepthTexture)Xe=y(T.format===Bs,T.type),xe&&(V?t.texStorage2D(n.TEXTURE_2D,1,Xe,Y.width,Y.height):t.texImage2D(n.TEXTURE_2D,0,Xe,Y.width,Y.height,0,De,et,null));else if(T.isDataTexture)if(lt.length>0){V&&xe&&t.texStorage2D(n.TEXTURE_2D,Ne,Xe,lt[0].width,lt[0].height);for(let ge=0,le=lt.length;ge<le;ge++)Re=lt[ge],V?Me&&t.texSubImage2D(n.TEXTURE_2D,ge,0,0,Re.width,Re.height,De,et,Re.data):t.texImage2D(n.TEXTURE_2D,ge,Xe,Re.width,Re.height,0,De,et,Re.data);T.generateMipmaps=!1}else V?(xe&&t.texStorage2D(n.TEXTURE_2D,Ne,Xe,Y.width,Y.height),Me&&pt(T,Y,De,et)):t.texImage2D(n.TEXTURE_2D,0,Xe,Y.width,Y.height,0,De,et,Y.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){V&&xe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Ne,Xe,lt[0].width,lt[0].height,Y.depth);for(let ge=0,le=lt.length;ge<le;ge++)if(Re=lt[ge],T.format!==ci)if(De!==null)if(V){if(Me)if(T.layerUpdates.size>0){const ze=Vu(Re.width,Re.height,T.format,T.type);for(const st of T.layerUpdates){const xt=Re.data.subarray(st*ze/Re.data.BYTES_PER_ELEMENT,(st+1)*ze/Re.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ge,0,0,st,Re.width,Re.height,1,De,xt)}T.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ge,0,0,0,Re.width,Re.height,Y.depth,De,Re.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,ge,Xe,Re.width,Re.height,Y.depth,0,Re.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else V?Me&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,ge,0,0,0,Re.width,Re.height,Y.depth,De,et,Re.data):t.texImage3D(n.TEXTURE_2D_ARRAY,ge,Xe,Re.width,Re.height,Y.depth,0,De,et,Re.data)}else{V&&xe&&t.texStorage2D(n.TEXTURE_2D,Ne,Xe,lt[0].width,lt[0].height);for(let ge=0,le=lt.length;ge<le;ge++)Re=lt[ge],T.format!==ci?De!==null?V?Me&&t.compressedTexSubImage2D(n.TEXTURE_2D,ge,0,0,Re.width,Re.height,De,Re.data):t.compressedTexImage2D(n.TEXTURE_2D,ge,Xe,Re.width,Re.height,0,Re.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):V?Me&&t.texSubImage2D(n.TEXTURE_2D,ge,0,0,Re.width,Re.height,De,et,Re.data):t.texImage2D(n.TEXTURE_2D,ge,Xe,Re.width,Re.height,0,De,et,Re.data)}else if(T.isDataArrayTexture)if(V){if(xe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Ne,Xe,Y.width,Y.height,Y.depth),Me)if(T.layerUpdates.size>0){const ge=Vu(Y.width,Y.height,T.format,T.type);for(const le of T.layerUpdates){const ze=Y.data.subarray(le*ge/Y.data.BYTES_PER_ELEMENT,(le+1)*ge/Y.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,le,Y.width,Y.height,1,De,et,ze)}T.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,Y.width,Y.height,Y.depth,De,et,Y.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Xe,Y.width,Y.height,Y.depth,0,De,et,Y.data);else if(T.isData3DTexture)V?(xe&&t.texStorage3D(n.TEXTURE_3D,Ne,Xe,Y.width,Y.height,Y.depth),Me&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,Y.width,Y.height,Y.depth,De,et,Y.data)):t.texImage3D(n.TEXTURE_3D,0,Xe,Y.width,Y.height,Y.depth,0,De,et,Y.data);else if(T.isFramebufferTexture){if(xe)if(V)t.texStorage2D(n.TEXTURE_2D,Ne,Xe,Y.width,Y.height);else{let ge=Y.width,le=Y.height;for(let ze=0;ze<Ne;ze++)t.texImage2D(n.TEXTURE_2D,ze,Xe,ge,le,0,De,et,null),ge>>=1,le>>=1}}else if(lt.length>0){if(V&&xe){const ge=nt(lt[0]);t.texStorage2D(n.TEXTURE_2D,Ne,Xe,ge.width,ge.height)}for(let ge=0,le=lt.length;ge<le;ge++)Re=lt[ge],V?Me&&t.texSubImage2D(n.TEXTURE_2D,ge,0,0,De,et,Re):t.texImage2D(n.TEXTURE_2D,ge,Xe,De,et,Re);T.generateMipmaps=!1}else if(V){if(xe){const ge=nt(Y);t.texStorage2D(n.TEXTURE_2D,Ne,Xe,ge.width,ge.height)}Me&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,De,et,Y)}else t.texImage2D(n.TEXTURE_2D,0,Xe,De,et,Y);m(T)&&p(ee),ke.__version=ne.version,T.onUpdate&&T.onUpdate(T)}D.__version=T.version}function ce(D,T,Z){if(T.image.length!==6)return;const ee=at(D,T),he=T.source;t.bindTexture(n.TEXTURE_CUBE_MAP,D.__webglTexture,n.TEXTURE0+Z);const ne=i.get(he);if(he.version!==ne.__version||ee===!0){t.activeTexture(n.TEXTURE0+Z);const ke=Rt.getPrimaries(Rt.workingColorSpace),be=T.colorSpace===ji?null:Rt.getPrimaries(T.colorSpace),Ge=T.colorSpace===ji||ke===be?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,T.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,T.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ge);const Ve=T.isCompressedTexture||T.image[0].isCompressedTexture,Y=T.image[0]&&T.image[0].isDataTexture,De=[];for(let le=0;le<6;le++)!Ve&&!Y?De[le]=v(T.image[le],!0,r.maxCubemapSize):De[le]=Y?T.image[le].image:T.image[le],De[le]=Qe(T,De[le]);const et=De[0],Xe=s.convert(T.format,T.colorSpace),Re=s.convert(T.type),lt=b(T.internalFormat,Xe,Re,T.colorSpace),V=T.isVideoTexture!==!0,xe=ne.__version===void 0||ee===!0,Me=he.dataReady;let Ne=M(T,et);We(n.TEXTURE_CUBE_MAP,T);let ge;if(Ve){V&&xe&&t.texStorage2D(n.TEXTURE_CUBE_MAP,Ne,lt,et.width,et.height);for(let le=0;le<6;le++){ge=De[le].mipmaps;for(let ze=0;ze<ge.length;ze++){const st=ge[ze];T.format!==ci?Xe!==null?V?Me&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,ze,0,0,st.width,st.height,Xe,st.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,ze,lt,st.width,st.height,0,st.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):V?Me&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,ze,0,0,st.width,st.height,Xe,Re,st.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,ze,lt,st.width,st.height,0,Xe,Re,st.data)}}}else{if(ge=T.mipmaps,V&&xe){ge.length>0&&Ne++;const le=nt(De[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,Ne,lt,le.width,le.height)}for(let le=0;le<6;le++)if(Y){V?Me&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,0,0,De[le].width,De[le].height,Xe,Re,De[le].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,lt,De[le].width,De[le].height,0,Xe,Re,De[le].data);for(let ze=0;ze<ge.length;ze++){const xt=ge[ze].image[le].image;V?Me&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,ze+1,0,0,xt.width,xt.height,Xe,Re,xt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,ze+1,lt,xt.width,xt.height,0,Xe,Re,xt.data)}}else{V?Me&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,0,0,Xe,Re,De[le]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,lt,Xe,Re,De[le]);for(let ze=0;ze<ge.length;ze++){const st=ge[ze];V?Me&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,ze+1,0,0,Xe,Re,st.image[le]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,ze+1,lt,Xe,Re,st.image[le])}}}m(T)&&p(n.TEXTURE_CUBE_MAP),ne.__version=he.version,T.onUpdate&&T.onUpdate(T)}D.__version=T.version}function Ae(D,T,Z,ee,he,ne){const ke=s.convert(Z.format,Z.colorSpace),be=s.convert(Z.type),Ge=b(Z.internalFormat,ke,be,Z.colorSpace),Ve=i.get(T),Y=i.get(Z);if(Y.__renderTarget=T,!Ve.__hasExternalTextures){const De=Math.max(1,T.width>>ne),et=Math.max(1,T.height>>ne);he===n.TEXTURE_3D||he===n.TEXTURE_2D_ARRAY?t.texImage3D(he,ne,Ge,De,et,T.depth,0,ke,be,null):t.texImage2D(he,ne,Ge,De,et,0,ke,be,null)}t.bindFramebuffer(n.FRAMEBUFFER,D),pe(T)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ee,he,Y.__webglTexture,0,Ee(T)):(he===n.TEXTURE_2D||he>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&he<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ee,he,Y.__webglTexture,ne),t.bindFramebuffer(n.FRAMEBUFFER,null)}function qe(D,T,Z){if(n.bindRenderbuffer(n.RENDERBUFFER,D),T.depthBuffer){const ee=T.depthTexture,he=ee&&ee.isDepthTexture?ee.type:null,ne=y(T.stencilBuffer,he),ke=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,be=Ee(T);pe(T)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,be,ne,T.width,T.height):Z?n.renderbufferStorageMultisample(n.RENDERBUFFER,be,ne,T.width,T.height):n.renderbufferStorage(n.RENDERBUFFER,ne,T.width,T.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,ke,n.RENDERBUFFER,D)}else{const ee=T.textures;for(let he=0;he<ee.length;he++){const ne=ee[he],ke=s.convert(ne.format,ne.colorSpace),be=s.convert(ne.type),Ge=b(ne.internalFormat,ke,be,ne.colorSpace),Ve=Ee(T);Z&&pe(T)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ve,Ge,T.width,T.height):pe(T)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ve,Ge,T.width,T.height):n.renderbufferStorage(n.RENDERBUFFER,Ge,T.width,T.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Be(D,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,D),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ee=i.get(T.depthTexture);ee.__renderTarget=T,(!ee.__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),j(T.depthTexture,0);const he=ee.__webglTexture,ne=Ee(T);if(T.depthTexture.format===zs)pe(T)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,he,0,ne):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,he,0);else if(T.depthTexture.format===Bs)pe(T)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,he,0,ne):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,he,0);else throw new Error("Unknown depthTexture format")}function Ze(D){const T=i.get(D),Z=D.isWebGLCubeRenderTarget===!0;if(T.__boundDepthTexture!==D.depthTexture){const ee=D.depthTexture;if(T.__depthDisposeCallback&&T.__depthDisposeCallback(),ee){const he=()=>{delete T.__boundDepthTexture,delete T.__depthDisposeCallback,ee.removeEventListener("dispose",he)};ee.addEventListener("dispose",he),T.__depthDisposeCallback=he}T.__boundDepthTexture=ee}if(D.depthTexture&&!T.__autoAllocateDepthBuffer){if(Z)throw new Error("target.depthTexture not supported in Cube render targets");const ee=D.texture.mipmaps;ee&&ee.length>0?Be(T.__webglFramebuffer[0],D):Be(T.__webglFramebuffer,D)}else if(Z){T.__webglDepthbuffer=[];for(let ee=0;ee<6;ee++)if(t.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer[ee]),T.__webglDepthbuffer[ee]===void 0)T.__webglDepthbuffer[ee]=n.createRenderbuffer(),qe(T.__webglDepthbuffer[ee],D,!1);else{const he=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ne=T.__webglDepthbuffer[ee];n.bindRenderbuffer(n.RENDERBUFFER,ne),n.framebufferRenderbuffer(n.FRAMEBUFFER,he,n.RENDERBUFFER,ne)}}else{const ee=D.texture.mipmaps;if(ee&&ee.length>0?t.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer===void 0)T.__webglDepthbuffer=n.createRenderbuffer(),qe(T.__webglDepthbuffer,D,!1);else{const he=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ne=T.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ne),n.framebufferRenderbuffer(n.FRAMEBUFFER,he,n.RENDERBUFFER,ne)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function It(D,T,Z){const ee=i.get(D);T!==void 0&&Ae(ee.__webglFramebuffer,D,D.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),Z!==void 0&&Ze(D)}function k(D){const T=D.texture,Z=i.get(D),ee=i.get(T);D.addEventListener("dispose",R);const he=D.textures,ne=D.isWebGLCubeRenderTarget===!0,ke=he.length>1;if(ke||(ee.__webglTexture===void 0&&(ee.__webglTexture=n.createTexture()),ee.__version=T.version,o.memory.textures++),ne){Z.__webglFramebuffer=[];for(let be=0;be<6;be++)if(T.mipmaps&&T.mipmaps.length>0){Z.__webglFramebuffer[be]=[];for(let Ge=0;Ge<T.mipmaps.length;Ge++)Z.__webglFramebuffer[be][Ge]=n.createFramebuffer()}else Z.__webglFramebuffer[be]=n.createFramebuffer()}else{if(T.mipmaps&&T.mipmaps.length>0){Z.__webglFramebuffer=[];for(let be=0;be<T.mipmaps.length;be++)Z.__webglFramebuffer[be]=n.createFramebuffer()}else Z.__webglFramebuffer=n.createFramebuffer();if(ke)for(let be=0,Ge=he.length;be<Ge;be++){const Ve=i.get(he[be]);Ve.__webglTexture===void 0&&(Ve.__webglTexture=n.createTexture(),o.memory.textures++)}if(D.samples>0&&pe(D)===!1){Z.__webglMultisampledFramebuffer=n.createFramebuffer(),Z.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,Z.__webglMultisampledFramebuffer);for(let be=0;be<he.length;be++){const Ge=he[be];Z.__webglColorRenderbuffer[be]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,Z.__webglColorRenderbuffer[be]);const Ve=s.convert(Ge.format,Ge.colorSpace),Y=s.convert(Ge.type),De=b(Ge.internalFormat,Ve,Y,Ge.colorSpace,D.isXRRenderTarget===!0),et=Ee(D);n.renderbufferStorageMultisample(n.RENDERBUFFER,et,De,D.width,D.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+be,n.RENDERBUFFER,Z.__webglColorRenderbuffer[be])}n.bindRenderbuffer(n.RENDERBUFFER,null),D.depthBuffer&&(Z.__webglDepthRenderbuffer=n.createRenderbuffer(),qe(Z.__webglDepthRenderbuffer,D,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ne){t.bindTexture(n.TEXTURE_CUBE_MAP,ee.__webglTexture),We(n.TEXTURE_CUBE_MAP,T);for(let be=0;be<6;be++)if(T.mipmaps&&T.mipmaps.length>0)for(let Ge=0;Ge<T.mipmaps.length;Ge++)Ae(Z.__webglFramebuffer[be][Ge],D,T,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+be,Ge);else Ae(Z.__webglFramebuffer[be],D,T,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+be,0);m(T)&&p(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ke){for(let be=0,Ge=he.length;be<Ge;be++){const Ve=he[be],Y=i.get(Ve);let De=n.TEXTURE_2D;(D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(De=D.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(De,Y.__webglTexture),We(De,Ve),Ae(Z.__webglFramebuffer,D,Ve,n.COLOR_ATTACHMENT0+be,De,0),m(Ve)&&p(De)}t.unbindTexture()}else{let be=n.TEXTURE_2D;if((D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(be=D.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(be,ee.__webglTexture),We(be,T),T.mipmaps&&T.mipmaps.length>0)for(let Ge=0;Ge<T.mipmaps.length;Ge++)Ae(Z.__webglFramebuffer[Ge],D,T,n.COLOR_ATTACHMENT0,be,Ge);else Ae(Z.__webglFramebuffer,D,T,n.COLOR_ATTACHMENT0,be,0);m(T)&&p(be),t.unbindTexture()}D.depthBuffer&&Ze(D)}function fe(D){const T=D.textures;for(let Z=0,ee=T.length;Z<ee;Z++){const he=T[Z];if(m(he)){const ne=x(D),ke=i.get(he).__webglTexture;t.bindTexture(ne,ke),p(ne),t.unbindTexture()}}}const ue=[],ie=[];function ae(D){if(D.samples>0){if(pe(D)===!1){const T=D.textures,Z=D.width,ee=D.height;let he=n.COLOR_BUFFER_BIT;const ne=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ke=i.get(D),be=T.length>1;if(be)for(let Ve=0;Ve<T.length;Ve++)t.bindFramebuffer(n.FRAMEBUFFER,ke.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ve,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,ke.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ve,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,ke.__webglMultisampledFramebuffer);const Ge=D.texture.mipmaps;Ge&&Ge.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,ke.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,ke.__webglFramebuffer);for(let Ve=0;Ve<T.length;Ve++){if(D.resolveDepthBuffer&&(D.depthBuffer&&(he|=n.DEPTH_BUFFER_BIT),D.stencilBuffer&&D.resolveStencilBuffer&&(he|=n.STENCIL_BUFFER_BIT)),be){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,ke.__webglColorRenderbuffer[Ve]);const Y=i.get(T[Ve]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Y,0)}n.blitFramebuffer(0,0,Z,ee,0,0,Z,ee,he,n.NEAREST),c===!0&&(ue.length=0,ie.length=0,ue.push(n.COLOR_ATTACHMENT0+Ve),D.depthBuffer&&D.resolveDepthBuffer===!1&&(ue.push(ne),ie.push(ne),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,ie)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,ue))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),be)for(let Ve=0;Ve<T.length;Ve++){t.bindFramebuffer(n.FRAMEBUFFER,ke.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ve,n.RENDERBUFFER,ke.__webglColorRenderbuffer[Ve]);const Y=i.get(T[Ve]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,ke.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ve,n.TEXTURE_2D,Y,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,ke.__webglMultisampledFramebuffer)}else if(D.depthBuffer&&D.resolveDepthBuffer===!1&&c){const T=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[T])}}}function Ee(D){return Math.min(r.maxSamples,D.samples)}function pe(D){const T=i.get(D);return D.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function Se(D){const T=o.render.frame;u.get(D)!==T&&(u.set(D,T),D.update())}function Qe(D,T){const Z=D.colorSpace,ee=D.format,he=D.type;return D.isCompressedTexture===!0||D.isVideoTexture===!0||Z!==os&&Z!==ji&&(Rt.getTransfer(Z)===Ot?(ee!==ci||he!==_i)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",Z)),T}function nt(D){return typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement?(l.width=D.naturalWidth||D.width,l.height=D.naturalHeight||D.height):typeof VideoFrame<"u"&&D instanceof VideoFrame?(l.width=D.displayWidth,l.height=D.displayHeight):(l.width=D.width,l.height=D.height),l}this.allocateTextureUnit=$,this.resetTextureUnits=F,this.setTexture2D=j,this.setTexture2DArray=G,this.setTexture3D=W,this.setTextureCube=U,this.rebindTextures=It,this.setupRenderTarget=k,this.updateRenderTargetMipmap=fe,this.updateMultisampleRenderTarget=ae,this.setupDepthRenderbuffer=Ze,this.setupFrameBufferTexture=Ae,this.useMultisampledRTT=pe}function K_(n,e){function t(i,r=ji){let s;const o=Rt.getTransfer(r);if(i===_i)return n.UNSIGNED_BYTE;if(i===al)return n.UNSIGNED_SHORT_4_4_4_4;if(i===cl)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Hh)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Gh)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Bh)return n.BYTE;if(i===Vh)return n.SHORT;if(i===Fs)return n.UNSIGNED_SHORT;if(i===ol)return n.INT;if(i===br)return n.UNSIGNED_INT;if(i===Di)return n.FLOAT;if(i===Xs)return n.HALF_FLOAT;if(i===Wh)return n.ALPHA;if(i===$h)return n.RGB;if(i===ci)return n.RGBA;if(i===zs)return n.DEPTH_COMPONENT;if(i===Bs)return n.DEPTH_STENCIL;if(i===qh)return n.RED;if(i===ll)return n.RED_INTEGER;if(i===Xh)return n.RG;if(i===ul)return n.RG_INTEGER;if(i===hl)return n.RGBA_INTEGER;if(i===No||i===Oo||i===Fo||i===ko)if(o===Ot)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===No)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Oo)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Fo)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===ko)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===No)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Oo)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Fo)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===ko)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===vc||i===_c||i===xc||i===yc)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===vc)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===_c)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===xc)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===yc)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===bc||i===Mc||i===Sc)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===bc||i===Mc)return o===Ot?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Sc)return o===Ot?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Ec||i===wc||i===Tc||i===Ac||i===Rc||i===Cc||i===Pc||i===Lc||i===Dc||i===Ic||i===Uc||i===Nc||i===Oc||i===Fc)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Ec)return o===Ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===wc)return o===Ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Tc)return o===Ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Ac)return o===Ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Rc)return o===Ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Cc)return o===Ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Pc)return o===Ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Lc)return o===Ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Dc)return o===Ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Ic)return o===Ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Uc)return o===Ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Nc)return o===Ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Oc)return o===Ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Fc)return o===Ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===kc||i===zc||i===Bc)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===kc)return o===Ot?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===zc)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Bc)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Vc||i===Hc||i===Gc||i===Wc)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===Vc)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Hc)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Gc)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Wc)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===ks?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const J_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Q_=`
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

}`;class ex{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new sd(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new ir({vertexShader:J_,fragmentShader:Q_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Rn(new Ii(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class tx extends Er{constructor(e,t){super();const i=this;let r=null,s=1,o=null,a="local-floor",c=1,l=null,u=null,h=null,d=null,f=null,g=null;const v=typeof XRWebGLBinding<"u",m=new ex,p={},x=t.getContextAttributes();let b=null,y=null;const M=[],w=[],R=new ye;let A=null;const E=new Kn;E.viewport=new Zt;const S=new Kn;S.viewport=new Zt;const I=[E,S],F=new ym;let $=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(te){let ce=M[te];return ce===void 0&&(ce=new Va,M[te]=ce),ce.getTargetRaySpace()},this.getControllerGrip=function(te){let ce=M[te];return ce===void 0&&(ce=new Va,M[te]=ce),ce.getGripSpace()},this.getHand=function(te){let ce=M[te];return ce===void 0&&(ce=new Va,M[te]=ce),ce.getHandSpace()};function j(te){const ce=w.indexOf(te.inputSource);if(ce===-1)return;const Ae=M[ce];Ae!==void 0&&(Ae.update(te.inputSource,te.frame,l||o),Ae.dispatchEvent({type:te.type,data:te.inputSource}))}function G(){r.removeEventListener("select",j),r.removeEventListener("selectstart",j),r.removeEventListener("selectend",j),r.removeEventListener("squeeze",j),r.removeEventListener("squeezestart",j),r.removeEventListener("squeezeend",j),r.removeEventListener("end",G),r.removeEventListener("inputsourceschange",W);for(let te=0;te<M.length;te++){const ce=w[te];ce!==null&&(w[te]=null,M[te].disconnect(ce))}$=null,H=null,m.reset();for(const te in p)delete p[te];e.setRenderTarget(b),f=null,d=null,h=null,r=null,y=null,pt.stop(),i.isPresenting=!1,e.setPixelRatio(A),e.setSize(R.width,R.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(te){s=te,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(te){a=te,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(te){l=te},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return h===null&&v&&(h=new XRWebGLBinding(r,t)),h},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(te){if(r=te,r!==null){if(b=e.getRenderTarget(),r.addEventListener("select",j),r.addEventListener("selectstart",j),r.addEventListener("selectend",j),r.addEventListener("squeeze",j),r.addEventListener("squeezestart",j),r.addEventListener("squeezeend",j),r.addEventListener("end",G),r.addEventListener("inputsourceschange",W),x.xrCompatible!==!0&&await t.makeXRCompatible(),A=e.getPixelRatio(),e.getSize(R),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let Ae=null,qe=null,Be=null;x.depth&&(Be=x.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Ae=x.stencil?Bs:zs,qe=x.stencil?ks:br);const Ze={colorFormat:t.RGBA8,depthFormat:Be,scaleFactor:s};h=this.getBinding(),d=h.createProjectionLayer(Ze),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new Mr(d.textureWidth,d.textureHeight,{format:ci,type:_i,depthTexture:new rd(d.textureWidth,d.textureHeight,qe,void 0,void 0,void 0,void 0,void 0,void 0,Ae),stencilBuffer:x.stencil,colorSpace:e.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const Ae={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(r,t,Ae),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new Mr(f.framebufferWidth,f.framebufferHeight,{format:ci,type:_i,colorSpace:e.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await r.requestReferenceSpace(a),pt.setContext(r),pt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function W(te){for(let ce=0;ce<te.removed.length;ce++){const Ae=te.removed[ce],qe=w.indexOf(Ae);qe>=0&&(w[qe]=null,M[qe].disconnect(Ae))}for(let ce=0;ce<te.added.length;ce++){const Ae=te.added[ce];let qe=w.indexOf(Ae);if(qe===-1){for(let Ze=0;Ze<M.length;Ze++)if(Ze>=w.length){w.push(Ae),qe=Ze;break}else if(w[Ze]===null){w[Ze]=Ae,qe=Ze;break}if(qe===-1)break}const Be=M[qe];Be&&Be.connect(Ae)}}const U=new L,de=new L;function oe(te,ce,Ae){U.setFromMatrixPosition(ce.matrixWorld),de.setFromMatrixPosition(Ae.matrixWorld);const qe=U.distanceTo(de),Be=ce.projectionMatrix.elements,Ze=Ae.projectionMatrix.elements,It=Be[14]/(Be[10]-1),k=Be[14]/(Be[10]+1),fe=(Be[9]+1)/Be[5],ue=(Be[9]-1)/Be[5],ie=(Be[8]-1)/Be[0],ae=(Ze[8]+1)/Ze[0],Ee=It*ie,pe=It*ae,Se=qe/(-ie+ae),Qe=Se*-ie;if(ce.matrixWorld.decompose(te.position,te.quaternion,te.scale),te.translateX(Qe),te.translateZ(Se),te.matrixWorld.compose(te.position,te.quaternion,te.scale),te.matrixWorldInverse.copy(te.matrixWorld).invert(),Be[10]===-1)te.projectionMatrix.copy(ce.projectionMatrix),te.projectionMatrixInverse.copy(ce.projectionMatrixInverse);else{const nt=It+Se,D=k+Se,T=Ee-Qe,Z=pe+(qe-Qe),ee=fe*k/D*nt,he=ue*k/D*nt;te.projectionMatrix.makePerspective(T,Z,ee,he,nt,D),te.projectionMatrixInverse.copy(te.projectionMatrix).invert()}}function J(te,ce){ce===null?te.matrixWorld.copy(te.matrix):te.matrixWorld.multiplyMatrices(ce.matrixWorld,te.matrix),te.matrixWorldInverse.copy(te.matrixWorld).invert()}this.updateCamera=function(te){if(r===null)return;let ce=te.near,Ae=te.far;m.texture!==null&&(m.depthNear>0&&(ce=m.depthNear),m.depthFar>0&&(Ae=m.depthFar)),F.near=S.near=E.near=ce,F.far=S.far=E.far=Ae,($!==F.near||H!==F.far)&&(r.updateRenderState({depthNear:F.near,depthFar:F.far}),$=F.near,H=F.far),F.layers.mask=te.layers.mask|6,E.layers.mask=F.layers.mask&3,S.layers.mask=F.layers.mask&5;const qe=te.parent,Be=F.cameras;J(F,qe);for(let Ze=0;Ze<Be.length;Ze++)J(Be[Ze],qe);Be.length===2?oe(F,E,S):F.projectionMatrix.copy(E.projectionMatrix),We(te,F,qe)};function We(te,ce,Ae){Ae===null?te.matrix.copy(ce.matrixWorld):(te.matrix.copy(Ae.matrixWorld),te.matrix.invert(),te.matrix.multiply(ce.matrixWorld)),te.matrix.decompose(te.position,te.quaternion,te.scale),te.updateMatrixWorld(!0),te.projectionMatrix.copy(ce.projectionMatrix),te.projectionMatrixInverse.copy(ce.projectionMatrixInverse),te.isPerspectiveCamera&&(te.fov=Vs*2*Math.atan(1/te.projectionMatrix.elements[5]),te.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(te){c=te,d!==null&&(d.fixedFoveation=te),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=te)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(F)},this.getCameraTexture=function(te){return p[te]};let at=null;function Fe(te,ce){if(u=ce.getViewerPose(l||o),g=ce,u!==null){const Ae=u.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let qe=!1;Ae.length!==F.cameras.length&&(F.cameras.length=0,qe=!0);for(let k=0;k<Ae.length;k++){const fe=Ae[k];let ue=null;if(f!==null)ue=f.getViewport(fe);else{const ae=h.getViewSubImage(d,fe);ue=ae.viewport,k===0&&(e.setRenderTargetTextures(y,ae.colorTexture,ae.depthStencilTexture),e.setRenderTarget(y))}let ie=I[k];ie===void 0&&(ie=new Kn,ie.layers.enable(k),ie.viewport=new Zt,I[k]=ie),ie.matrix.fromArray(fe.transform.matrix),ie.matrix.decompose(ie.position,ie.quaternion,ie.scale),ie.projectionMatrix.fromArray(fe.projectionMatrix),ie.projectionMatrixInverse.copy(ie.projectionMatrix).invert(),ie.viewport.set(ue.x,ue.y,ue.width,ue.height),k===0&&(F.matrix.copy(ie.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),qe===!0&&F.cameras.push(ie)}const Be=r.enabledFeatures;if(Be&&Be.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&v){h=i.getBinding();const k=h.getDepthInformation(Ae[0]);k&&k.isValid&&k.texture&&m.init(k,r.renderState)}if(Be&&Be.includes("camera-access")&&v){e.state.unbindTexture(),h=i.getBinding();for(let k=0;k<Ae.length;k++){const fe=Ae[k].camera;if(fe){let ue=p[fe];ue||(ue=new sd,p[fe]=ue);const ie=h.getCameraImage(fe);ue.sourceTexture=ie}}}}for(let Ae=0;Ae<M.length;Ae++){const qe=w[Ae],Be=M[Ae];qe!==null&&Be!==void 0&&Be.update(qe,ce,l||o)}at&&at(te,ce),ce.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ce}),g=null}const pt=new vd;pt.setAnimationLoop(Fe),this.setAnimationLoop=function(te){at=te},this.dispose=function(){}}}const pr=new Xn,nx=new Wt;function ix(n,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,td(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function r(m,p,x,b,y){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(m,p):p.isMeshToonMaterial?(s(m,p),h(m,p)):p.isMeshPhongMaterial?(s(m,p),u(m,p)):p.isMeshStandardMaterial?(s(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,y)):p.isMeshMatcapMaterial?(s(m,p),g(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),v(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?c(m,p,x,b):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Bn&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Bn&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const x=e.get(p),b=x.envMap,y=x.envMapRotation;b&&(m.envMap.value=b,pr.copy(y),pr.x*=-1,pr.y*=-1,pr.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(pr.y*=-1,pr.z*=-1),m.envMapRotation.value.setFromMatrix4(nx.makeRotationFromEuler(pr)),m.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,x,b){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*x,m.scale.value=b*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function u(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function h(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,x){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Bn&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function v(m,p){const x=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function rx(n,e,t,i){let r={},s={},o=[];const a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(x,b){const y=b.program;i.uniformBlockBinding(x,y)}function l(x,b){let y=r[x.id];y===void 0&&(g(x),y=u(x),r[x.id]=y,x.addEventListener("dispose",m));const M=b.program;i.updateUBOMapping(x,M);const w=e.render.frame;s[x.id]!==w&&(d(x),s[x.id]=w)}function u(x){const b=h();x.__bindingPointIndex=b;const y=n.createBuffer(),M=x.__size,w=x.usage;return n.bindBuffer(n.UNIFORM_BUFFER,y),n.bufferData(n.UNIFORM_BUFFER,M,w),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,b,y),y}function h(){for(let x=0;x<a;x++)if(o.indexOf(x)===-1)return o.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(x){const b=r[x.id],y=x.uniforms,M=x.__cache;n.bindBuffer(n.UNIFORM_BUFFER,b);for(let w=0,R=y.length;w<R;w++){const A=Array.isArray(y[w])?y[w]:[y[w]];for(let E=0,S=A.length;E<S;E++){const I=A[E];if(f(I,w,E,M)===!0){const F=I.__offset,$=Array.isArray(I.value)?I.value:[I.value];let H=0;for(let j=0;j<$.length;j++){const G=$[j],W=v(G);typeof G=="number"||typeof G=="boolean"?(I.__data[0]=G,n.bufferSubData(n.UNIFORM_BUFFER,F+H,I.__data)):G.isMatrix3?(I.__data[0]=G.elements[0],I.__data[1]=G.elements[1],I.__data[2]=G.elements[2],I.__data[3]=0,I.__data[4]=G.elements[3],I.__data[5]=G.elements[4],I.__data[6]=G.elements[5],I.__data[7]=0,I.__data[8]=G.elements[6],I.__data[9]=G.elements[7],I.__data[10]=G.elements[8],I.__data[11]=0):(G.toArray(I.__data,H),H+=W.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,F,I.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(x,b,y,M){const w=x.value,R=b+"_"+y;if(M[R]===void 0)return typeof w=="number"||typeof w=="boolean"?M[R]=w:M[R]=w.clone(),!0;{const A=M[R];if(typeof w=="number"||typeof w=="boolean"){if(A!==w)return M[R]=w,!0}else if(A.equals(w)===!1)return A.copy(w),!0}return!1}function g(x){const b=x.uniforms;let y=0;const M=16;for(let R=0,A=b.length;R<A;R++){const E=Array.isArray(b[R])?b[R]:[b[R]];for(let S=0,I=E.length;S<I;S++){const F=E[S],$=Array.isArray(F.value)?F.value:[F.value];for(let H=0,j=$.length;H<j;H++){const G=$[H],W=v(G),U=y%M,de=U%W.boundary,oe=U+de;y+=de,oe!==0&&M-oe<W.storage&&(y+=M-oe),F.__data=new Float32Array(W.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=y,y+=W.storage}}}const w=y%M;return w>0&&(y+=M-w),x.__size=y,x.__cache={},this}function v(x){const b={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(b.boundary=4,b.storage=4):x.isVector2?(b.boundary=8,b.storage=8):x.isVector3||x.isColor?(b.boundary=16,b.storage=12):x.isVector4?(b.boundary=16,b.storage=16):x.isMatrix3?(b.boundary=48,b.storage=48):x.isMatrix4?(b.boundary=64,b.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),b}function m(x){const b=x.target;b.removeEventListener("dispose",m);const y=o.indexOf(b.__bindingPointIndex);o.splice(y,1),n.deleteBuffer(r[b.id]),delete r[b.id],delete s[b.id]}function p(){for(const x in r)n.deleteBuffer(r[x]);o=[],r={},s={}}return{bind:c,update:l,dispose:p}}class sx{constructor(e={}){const{canvas:t=sp(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let f;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=i.getContextAttributes().alpha}else f=o;const g=new Uint32Array(4),v=new Int32Array(4);let m=null,p=null;const x=[],b=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Qi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const y=this;let M=!1;this._outputColorSpace=wn;let w=0,R=0,A=null,E=-1,S=null;const I=new Zt,F=new Zt;let $=null;const H=new Mt(0);let j=0,G=t.width,W=t.height,U=1,de=null,oe=null;const J=new Zt(0,0,G,W),We=new Zt(0,0,G,W);let at=!1;const Fe=new gl;let pt=!1,te=!1;const ce=new Wt,Ae=new L,qe=new Zt,Be={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ze=!1;function It(){return A===null?U:1}let k=i;function fe(C,q){return t.getContext(C,q)}try{const C={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${sl}`),t.addEventListener("webglcontextlost",Me,!1),t.addEventListener("webglcontextrestored",Ne,!1),t.addEventListener("webglcontextcreationerror",ge,!1),k===null){const q="webgl2";if(k=fe(q,C),k===null)throw fe(q)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(C){throw console.error("THREE.WebGLRenderer: "+C.message),C}let ue,ie,ae,Ee,pe,Se,Qe,nt,D,T,Z,ee,he,ne,ke,be,Ge,Ve,Y,De,et,Xe,Re,lt;function V(){ue=new mv(k),ue.init(),Xe=new K_(k,ue),ie=new cv(k,ue,e,Xe),ae=new j_(k,ue),ie.reversedDepthBuffer&&d&&ae.buffers.depth.setReversed(!0),Ee=new _v(k),pe=new O_,Se=new Z_(k,ue,ae,pe,ie,Xe,Ee),Qe=new uv(y),nt=new pv(y),D=new Em(k),Re=new ov(k,D),T=new gv(k,D,Ee,Re),Z=new yv(k,T,D,Ee),Y=new xv(k,ie,Se),be=new lv(pe),ee=new N_(y,Qe,nt,ue,ie,Re,be),he=new ix(y,pe),ne=new k_,ke=new W_(ue),Ve=new sv(y,Qe,nt,ae,Z,f,c),Ge=new X_(y,Z,ie),lt=new rx(k,Ee,ie,ae),De=new av(k,ue,Ee),et=new vv(k,ue,Ee),Ee.programs=ee.programs,y.capabilities=ie,y.extensions=ue,y.properties=pe,y.renderLists=ne,y.shadowMap=Ge,y.state=ae,y.info=Ee}V();const xe=new tx(y,k);this.xr=xe,this.getContext=function(){return k},this.getContextAttributes=function(){return k.getContextAttributes()},this.forceContextLoss=function(){const C=ue.get("WEBGL_lose_context");C&&C.loseContext()},this.forceContextRestore=function(){const C=ue.get("WEBGL_lose_context");C&&C.restoreContext()},this.getPixelRatio=function(){return U},this.setPixelRatio=function(C){C!==void 0&&(U=C,this.setSize(G,W,!1))},this.getSize=function(C){return C.set(G,W)},this.setSize=function(C,q,K=!0){if(xe.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}G=C,W=q,t.width=Math.floor(C*U),t.height=Math.floor(q*U),K===!0&&(t.style.width=C+"px",t.style.height=q+"px"),this.setViewport(0,0,C,q)},this.getDrawingBufferSize=function(C){return C.set(G*U,W*U).floor()},this.setDrawingBufferSize=function(C,q,K){G=C,W=q,U=K,t.width=Math.floor(C*K),t.height=Math.floor(q*K),this.setViewport(0,0,C,q)},this.getCurrentViewport=function(C){return C.copy(I)},this.getViewport=function(C){return C.copy(J)},this.setViewport=function(C,q,K,Q){C.isVector4?J.set(C.x,C.y,C.z,C.w):J.set(C,q,K,Q),ae.viewport(I.copy(J).multiplyScalar(U).round())},this.getScissor=function(C){return C.copy(We)},this.setScissor=function(C,q,K,Q){C.isVector4?We.set(C.x,C.y,C.z,C.w):We.set(C,q,K,Q),ae.scissor(F.copy(We).multiplyScalar(U).round())},this.getScissorTest=function(){return at},this.setScissorTest=function(C){ae.setScissorTest(at=C)},this.setOpaqueSort=function(C){de=C},this.setTransparentSort=function(C){oe=C},this.getClearColor=function(C){return C.copy(Ve.getClearColor())},this.setClearColor=function(){Ve.setClearColor(...arguments)},this.getClearAlpha=function(){return Ve.getClearAlpha()},this.setClearAlpha=function(){Ve.setClearAlpha(...arguments)},this.clear=function(C=!0,q=!0,K=!0){let Q=0;if(C){let X=!1;if(A!==null){const _e=A.texture.format;X=_e===hl||_e===ul||_e===ll}if(X){const _e=A.texture.type,Ce=_e===_i||_e===br||_e===Fs||_e===ks||_e===al||_e===cl,He=Ve.getClearColor(),Oe=Ve.getClearAlpha(),Ke=He.r,tt=He.g,Je=He.b;Ce?(g[0]=Ke,g[1]=tt,g[2]=Je,g[3]=Oe,k.clearBufferuiv(k.COLOR,0,g)):(v[0]=Ke,v[1]=tt,v[2]=Je,v[3]=Oe,k.clearBufferiv(k.COLOR,0,v))}else Q|=k.COLOR_BUFFER_BIT}q&&(Q|=k.DEPTH_BUFFER_BIT),K&&(Q|=k.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),k.clear(Q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Me,!1),t.removeEventListener("webglcontextrestored",Ne,!1),t.removeEventListener("webglcontextcreationerror",ge,!1),Ve.dispose(),ne.dispose(),ke.dispose(),pe.dispose(),Qe.dispose(),nt.dispose(),Z.dispose(),Re.dispose(),lt.dispose(),ee.dispose(),xe.dispose(),xe.removeEventListener("sessionstart",Vn),xe.removeEventListener("sessionend",js),ei.stop()};function Me(C){C.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),M=!0}function Ne(){console.log("THREE.WebGLRenderer: Context Restored."),M=!1;const C=Ee.autoReset,q=Ge.enabled,K=Ge.autoUpdate,Q=Ge.needsUpdate,X=Ge.type;V(),Ee.autoReset=C,Ge.enabled=q,Ge.autoUpdate=K,Ge.needsUpdate=Q,Ge.type=X}function ge(C){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",C.statusMessage)}function le(C){const q=C.target;q.removeEventListener("dispose",le),ze(q)}function ze(C){st(C),pe.remove(C)}function st(C){const q=pe.get(C).programs;q!==void 0&&(q.forEach(function(K){ee.releaseProgram(K)}),C.isShaderMaterial&&ee.releaseShaderCache(C))}this.renderBufferDirect=function(C,q,K,Q,X,_e){q===null&&(q=Be);const Ce=X.isMesh&&X.matrixWorld.determinant()<0,He=Ks(C,q,K,Q,X);ae.setMaterial(Q,Ce);let Oe=K.index,Ke=1;if(Q.wireframe===!0){if(Oe=T.getWireframeAttribute(K),Oe===void 0)return;Ke=2}const tt=K.drawRange,Je=K.attributes.position;let gt=tt.start*Ke,vt=(tt.start+tt.count)*Ke;_e!==null&&(gt=Math.max(gt,_e.start*Ke),vt=Math.min(vt,(_e.start+_e.count)*Ke)),Oe!==null?(gt=Math.max(gt,0),vt=Math.min(vt,Oe.count)):Je!=null&&(gt=Math.max(gt,0),vt=Math.min(vt,Je.count));const Bt=vt-gt;if(Bt<0||Bt===1/0)return;Re.setup(X,Q,He,K,Oe);let Tt,Et=De;if(Oe!==null&&(Tt=D.get(Oe),Et=et,Et.setIndex(Tt)),X.isMesh)Q.wireframe===!0?(ae.setLineWidth(Q.wireframeLinewidth*It()),Et.setMode(k.LINES)):Et.setMode(k.TRIANGLES);else if(X.isLine){let Ye=Q.linewidth;Ye===void 0&&(Ye=1),ae.setLineWidth(Ye*It()),X.isLineSegments?Et.setMode(k.LINES):X.isLineLoop?Et.setMode(k.LINE_LOOP):Et.setMode(k.LINE_STRIP)}else X.isPoints?Et.setMode(k.POINTS):X.isSprite&&Et.setMode(k.TRIANGLES);if(X.isBatchedMesh)if(X._multiDrawInstances!==null)Hs("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Et.renderMultiDrawInstances(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount,X._multiDrawInstances);else if(ue.get("WEBGL_multi_draw"))Et.renderMultiDraw(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount);else{const Ye=X._multiDrawStarts,Vt=X._multiDrawCounts,bt=X._multiDrawCount,_n=Oe?D.get(Oe).bytesPerElement:1,di=pe.get(Q).currentProgram.getUniforms();for(let pn=0;pn<bt;pn++)di.setValue(k,"_gl_DrawID",pn),Et.render(Ye[pn]/_n,Vt[pn])}else if(X.isInstancedMesh)Et.renderInstances(gt,Bt,X.count);else if(K.isInstancedBufferGeometry){const Ye=K._maxInstanceCount!==void 0?K._maxInstanceCount:1/0,Vt=Math.min(K.instanceCount,Ye);Et.renderInstances(gt,Bt,Vt)}else Et.render(gt,Bt)};function xt(C,q,K){C.transparent===!0&&C.side===gi&&C.forceSinglePass===!1?(C.side=Bn,C.needsUpdate=!0,Ar(C,q,K),C.side=nr,C.needsUpdate=!0,Ar(C,q,K),C.side=gi):Ar(C,q,K)}this.compile=function(C,q,K=null){K===null&&(K=C),p=ke.get(K),p.init(q),b.push(p),K.traverseVisible(function(X){X.isLight&&X.layers.test(q.layers)&&(p.pushLight(X),X.castShadow&&p.pushShadow(X))}),C!==K&&C.traverseVisible(function(X){X.isLight&&X.layers.test(q.layers)&&(p.pushLight(X),X.castShadow&&p.pushShadow(X))}),p.setupLights();const Q=new Set;return C.traverse(function(X){if(!(X.isMesh||X.isPoints||X.isLine||X.isSprite))return;const _e=X.material;if(_e)if(Array.isArray(_e))for(let Ce=0;Ce<_e.length;Ce++){const He=_e[Ce];xt(He,K,X),Q.add(He)}else xt(_e,K,X),Q.add(_e)}),p=b.pop(),Q},this.compileAsync=function(C,q,K=null){const Q=this.compile(C,q,K);return new Promise(X=>{function _e(){if(Q.forEach(function(Ce){pe.get(Ce).currentProgram.isReady()&&Q.delete(Ce)}),Q.size===0){X(C);return}setTimeout(_e,10)}ue.get("KHR_parallel_shader_compile")!==null?_e():setTimeout(_e,10)})};let yt=null;function fn(C){yt&&yt(C)}function Vn(){ei.stop()}function js(){ei.start()}const ei=new vd;ei.setAnimationLoop(fn),typeof self<"u"&&ei.setContext(self),this.setAnimationLoop=function(C){yt=C,xe.setAnimationLoop(C),C===null?ei.stop():ei.start()},xe.addEventListener("sessionstart",Vn),xe.addEventListener("sessionend",js),this.render=function(C,q){if(q!==void 0&&q.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;if(C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),q.parent===null&&q.matrixWorldAutoUpdate===!0&&q.updateMatrixWorld(),xe.enabled===!0&&xe.isPresenting===!0&&(xe.cameraAutoUpdate===!0&&xe.updateCamera(q),q=xe.getCamera()),C.isScene===!0&&C.onBeforeRender(y,C,q,A),p=ke.get(C,b.length),p.init(q),b.push(p),ce.multiplyMatrices(q.projectionMatrix,q.matrixWorldInverse),Fe.setFromProjectionMatrix(ce,vi,q.reversedDepth),te=this.localClippingEnabled,pt=be.init(this.clippingPlanes,te),m=ne.get(C,x.length),m.init(),x.push(m),xe.enabled===!0&&xe.isPresenting===!0){const _e=y.xr.getDepthSensingMesh();_e!==null&&Tr(_e,q,-1/0,y.sortObjects)}Tr(C,q,0,y.sortObjects),m.finish(),y.sortObjects===!0&&m.sort(de,oe),Ze=xe.enabled===!1||xe.isPresenting===!1||xe.hasDepthSensing()===!1,Ze&&Ve.addToRenderList(m,C),this.info.render.frame++,pt===!0&&be.beginShadows();const K=p.state.shadowsArray;Ge.render(K,C,q),pt===!0&&be.endShadows(),this.info.autoReset===!0&&this.info.reset();const Q=m.opaque,X=m.transmissive;if(p.setupLights(),q.isArrayCamera){const _e=q.cameras;if(X.length>0)for(let Ce=0,He=_e.length;Ce<He;Ce++){const Oe=_e[Ce];Zs(Q,X,C,Oe)}Ze&&Ve.render(C);for(let Ce=0,He=_e.length;Ce<He;Ce++){const Oe=_e[Ce];ui(m,C,Oe,Oe.viewport)}}else X.length>0&&Zs(Q,X,C,q),Ze&&Ve.render(C),ui(m,C,q);A!==null&&R===0&&(Se.updateMultisampleRenderTarget(A),Se.updateRenderTargetMipmap(A)),C.isScene===!0&&C.onAfterRender(y,C,q),Re.resetDefaultState(),E=-1,S=null,b.pop(),b.length>0?(p=b[b.length-1],pt===!0&&be.setGlobalState(y.clippingPlanes,p.state.camera)):p=null,x.pop(),x.length>0?m=x[x.length-1]:m=null};function Tr(C,q,K,Q){if(C.visible===!1)return;if(C.layers.test(q.layers)){if(C.isGroup)K=C.renderOrder;else if(C.isLOD)C.autoUpdate===!0&&C.update(q);else if(C.isLight)p.pushLight(C),C.castShadow&&p.pushShadow(C);else if(C.isSprite){if(!C.frustumCulled||Fe.intersectsSprite(C)){Q&&qe.setFromMatrixPosition(C.matrixWorld).applyMatrix4(ce);const Ce=Z.update(C),He=C.material;He.visible&&m.push(C,Ce,He,K,qe.z,null)}}else if((C.isMesh||C.isLine||C.isPoints)&&(!C.frustumCulled||Fe.intersectsObject(C))){const Ce=Z.update(C),He=C.material;if(Q&&(C.boundingSphere!==void 0?(C.boundingSphere===null&&C.computeBoundingSphere(),qe.copy(C.boundingSphere.center)):(Ce.boundingSphere===null&&Ce.computeBoundingSphere(),qe.copy(Ce.boundingSphere.center)),qe.applyMatrix4(C.matrixWorld).applyMatrix4(ce)),Array.isArray(He)){const Oe=Ce.groups;for(let Ke=0,tt=Oe.length;Ke<tt;Ke++){const Je=Oe[Ke],gt=He[Je.materialIndex];gt&&gt.visible&&m.push(C,Ce,gt,K,qe.z,Je)}}else He.visible&&m.push(C,Ce,He,K,qe.z,null)}}const _e=C.children;for(let Ce=0,He=_e.length;Ce<He;Ce++)Tr(_e[Ce],q,K,Q)}function ui(C,q,K,Q){const X=C.opaque,_e=C.transmissive,Ce=C.transparent;p.setupLightsView(K),pt===!0&&be.setGlobalState(y.clippingPlanes,K),Q&&ae.viewport(I.copy(Q)),X.length>0&&hi(X,q,K),_e.length>0&&hi(_e,q,K),Ce.length>0&&hi(Ce,q,K),ae.buffers.depth.setTest(!0),ae.buffers.depth.setMask(!0),ae.buffers.color.setMask(!0),ae.setPolygonOffset(!1)}function Zs(C,q,K,Q){if((K.isScene===!0?K.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[Q.id]===void 0&&(p.state.transmissionRenderTarget[Q.id]=new Mr(1,1,{generateMipmaps:!0,type:ue.has("EXT_color_buffer_half_float")||ue.has("EXT_color_buffer_float")?Xs:_i,minFilter:Zi,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Rt.workingColorSpace}));const _e=p.state.transmissionRenderTarget[Q.id],Ce=Q.viewport||I;_e.setSize(Ce.z*y.transmissionResolutionScale,Ce.w*y.transmissionResolutionScale);const He=y.getRenderTarget(),Oe=y.getActiveCubeFace(),Ke=y.getActiveMipmapLevel();y.setRenderTarget(_e),y.getClearColor(H),j=y.getClearAlpha(),j<1&&y.setClearColor(16777215,.5),y.clear(),Ze&&Ve.render(K);const tt=y.toneMapping;y.toneMapping=Qi;const Je=Q.viewport;if(Q.viewport!==void 0&&(Q.viewport=void 0),p.setupLightsView(Q),pt===!0&&be.setGlobalState(y.clippingPlanes,Q),hi(C,K,Q),Se.updateMultisampleRenderTarget(_e),Se.updateRenderTargetMipmap(_e),ue.has("WEBGL_multisampled_render_to_texture")===!1){let gt=!1;for(let vt=0,Bt=q.length;vt<Bt;vt++){const Tt=q[vt],Et=Tt.object,Ye=Tt.geometry,Vt=Tt.material,bt=Tt.group;if(Vt.side===gi&&Et.layers.test(Q.layers)){const _n=Vt.side;Vt.side=Bn,Vt.needsUpdate=!0,ds(Et,K,Q,Ye,Vt,bt),Vt.side=_n,Vt.needsUpdate=!0,gt=!0}}gt===!0&&(Se.updateMultisampleRenderTarget(_e),Se.updateRenderTargetMipmap(_e))}y.setRenderTarget(He,Oe,Ke),y.setClearColor(H,j),Je!==void 0&&(Q.viewport=Je),y.toneMapping=tt}function hi(C,q,K){const Q=q.isScene===!0?q.overrideMaterial:null;for(let X=0,_e=C.length;X<_e;X++){const Ce=C[X],He=Ce.object,Oe=Ce.geometry,Ke=Ce.group;let tt=Ce.material;tt.allowOverride===!0&&Q!==null&&(tt=Q),He.layers.test(K.layers)&&ds(He,q,K,Oe,tt,Ke)}}function ds(C,q,K,Q,X,_e){C.onBeforeRender(y,q,K,Q,X,_e),C.modelViewMatrix.multiplyMatrices(K.matrixWorldInverse,C.matrixWorld),C.normalMatrix.getNormalMatrix(C.modelViewMatrix),X.onBeforeRender(y,q,K,Q,C,_e),X.transparent===!0&&X.side===gi&&X.forceSinglePass===!1?(X.side=Bn,X.needsUpdate=!0,y.renderBufferDirect(K,q,Q,X,C,_e),X.side=nr,X.needsUpdate=!0,y.renderBufferDirect(K,q,Q,X,C,_e),X.side=gi):y.renderBufferDirect(K,q,Q,X,C,_e),C.onAfterRender(y,q,K,Q,X,_e)}function Ar(C,q,K){q.isScene!==!0&&(q=Be);const Q=pe.get(C),X=p.state.lights,_e=p.state.shadowsArray,Ce=X.state.version,He=ee.getParameters(C,X.state,_e,q,K),Oe=ee.getProgramCacheKey(He);let Ke=Q.programs;Q.environment=C.isMeshStandardMaterial?q.environment:null,Q.fog=q.fog,Q.envMap=(C.isMeshStandardMaterial?nt:Qe).get(C.envMap||Q.environment),Q.envMapRotation=Q.environment!==null&&C.envMap===null?q.environmentRotation:C.envMapRotation,Ke===void 0&&(C.addEventListener("dispose",le),Ke=new Map,Q.programs=Ke);let tt=Ke.get(Oe);if(tt!==void 0){if(Q.currentProgram===tt&&Q.lightsStateVersion===Ce)return zi(C,He),tt}else He.uniforms=ee.getUniforms(C),C.onBeforeCompile(He,y),tt=ee.acquireProgram(He,Oe),Ke.set(Oe,tt),Q.uniforms=He.uniforms;const Je=Q.uniforms;return(!C.isShaderMaterial&&!C.isRawShaderMaterial||C.clipping===!0)&&(Je.clippingPlanes=be.uniform),zi(C,He),Q.needsLights=oa(C),Q.lightsStateVersion=Ce,Q.needsLights&&(Je.ambientLightColor.value=X.state.ambient,Je.lightProbe.value=X.state.probe,Je.directionalLights.value=X.state.directional,Je.directionalLightShadows.value=X.state.directionalShadow,Je.spotLights.value=X.state.spot,Je.spotLightShadows.value=X.state.spotShadow,Je.rectAreaLights.value=X.state.rectArea,Je.ltc_1.value=X.state.rectAreaLTC1,Je.ltc_2.value=X.state.rectAreaLTC2,Je.pointLights.value=X.state.point,Je.pointLightShadows.value=X.state.pointShadow,Je.hemisphereLights.value=X.state.hemi,Je.directionalShadowMap.value=X.state.directionalShadowMap,Je.directionalShadowMatrix.value=X.state.directionalShadowMatrix,Je.spotShadowMap.value=X.state.spotShadowMap,Je.spotLightMatrix.value=X.state.spotLightMatrix,Je.spotLightMap.value=X.state.spotLightMap,Je.pointShadowMap.value=X.state.pointShadowMap,Je.pointShadowMatrix.value=X.state.pointShadowMatrix),Q.currentProgram=tt,Q.uniformsList=null,tt}function ki(C){if(C.uniformsList===null){const q=C.currentProgram.getUniforms();C.uniformsList=zo.seqWithValue(q.seq,C.uniforms)}return C.uniformsList}function zi(C,q){const K=pe.get(C);K.outputColorSpace=q.outputColorSpace,K.batching=q.batching,K.batchingColor=q.batchingColor,K.instancing=q.instancing,K.instancingColor=q.instancingColor,K.instancingMorph=q.instancingMorph,K.skinning=q.skinning,K.morphTargets=q.morphTargets,K.morphNormals=q.morphNormals,K.morphColors=q.morphColors,K.morphTargetsCount=q.morphTargetsCount,K.numClippingPlanes=q.numClippingPlanes,K.numIntersection=q.numClipIntersection,K.vertexAlphas=q.vertexAlphas,K.vertexTangents=q.vertexTangents,K.toneMapping=q.toneMapping}function Ks(C,q,K,Q,X){q.isScene!==!0&&(q=Be),Se.resetTextureUnits();const _e=q.fog,Ce=Q.isMeshStandardMaterial?q.environment:null,He=A===null?y.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:os,Oe=(Q.isMeshStandardMaterial?nt:Qe).get(Q.envMap||Ce),Ke=Q.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,tt=!!K.attributes.tangent&&(!!Q.normalMap||Q.anisotropy>0),Je=!!K.morphAttributes.position,gt=!!K.morphAttributes.normal,vt=!!K.morphAttributes.color;let Bt=Qi;Q.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(Bt=y.toneMapping);const Tt=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,Et=Tt!==void 0?Tt.length:0,Ye=pe.get(Q),Vt=p.state.lights;if(pt===!0&&(te===!0||C!==S)){const rn=C===S&&Q.id===E;be.setState(Q,C,rn)}let bt=!1;Q.version===Ye.__version?(Ye.needsLights&&Ye.lightsStateVersion!==Vt.state.version||Ye.outputColorSpace!==He||X.isBatchedMesh&&Ye.batching===!1||!X.isBatchedMesh&&Ye.batching===!0||X.isBatchedMesh&&Ye.batchingColor===!0&&X.colorTexture===null||X.isBatchedMesh&&Ye.batchingColor===!1&&X.colorTexture!==null||X.isInstancedMesh&&Ye.instancing===!1||!X.isInstancedMesh&&Ye.instancing===!0||X.isSkinnedMesh&&Ye.skinning===!1||!X.isSkinnedMesh&&Ye.skinning===!0||X.isInstancedMesh&&Ye.instancingColor===!0&&X.instanceColor===null||X.isInstancedMesh&&Ye.instancingColor===!1&&X.instanceColor!==null||X.isInstancedMesh&&Ye.instancingMorph===!0&&X.morphTexture===null||X.isInstancedMesh&&Ye.instancingMorph===!1&&X.morphTexture!==null||Ye.envMap!==Oe||Q.fog===!0&&Ye.fog!==_e||Ye.numClippingPlanes!==void 0&&(Ye.numClippingPlanes!==be.numPlanes||Ye.numIntersection!==be.numIntersection)||Ye.vertexAlphas!==Ke||Ye.vertexTangents!==tt||Ye.morphTargets!==Je||Ye.morphNormals!==gt||Ye.morphColors!==vt||Ye.toneMapping!==Bt||Ye.morphTargetsCount!==Et)&&(bt=!0):(bt=!0,Ye.__version=Q.version);let _n=Ye.currentProgram;bt===!0&&(_n=Ar(Q,q,X));let di=!1,pn=!1,On=!1;const Ut=_n.getUniforms(),Fn=Ye.uniforms;if(ae.useProgram(_n.program)&&(di=!0,pn=!0,On=!0),Q.id!==E&&(E=Q.id,pn=!0),di||S!==C){ae.buffers.depth.getReversed()&&C.reversedDepth!==!0&&(C._reversedDepth=!0,C.updateProjectionMatrix()),Ut.setValue(k,"projectionMatrix",C.projectionMatrix),Ut.setValue(k,"viewMatrix",C.matrixWorldInverse);const xn=Ut.map.cameraPosition;xn!==void 0&&xn.setValue(k,Ae.setFromMatrixPosition(C.matrixWorld)),ie.logarithmicDepthBuffer&&Ut.setValue(k,"logDepthBufFC",2/(Math.log(C.far+1)/Math.LN2)),(Q.isMeshPhongMaterial||Q.isMeshToonMaterial||Q.isMeshLambertMaterial||Q.isMeshBasicMaterial||Q.isMeshStandardMaterial||Q.isShaderMaterial)&&Ut.setValue(k,"isOrthographic",C.isOrthographicCamera===!0),S!==C&&(S=C,pn=!0,On=!0)}if(X.isSkinnedMesh){Ut.setOptional(k,X,"bindMatrix"),Ut.setOptional(k,X,"bindMatrixInverse");const rn=X.skeleton;rn&&(rn.boneTexture===null&&rn.computeBoneTexture(),Ut.setValue(k,"boneTexture",rn.boneTexture,Se))}X.isBatchedMesh&&(Ut.setOptional(k,X,"batchingTexture"),Ut.setValue(k,"batchingTexture",X._matricesTexture,Se),Ut.setOptional(k,X,"batchingIdTexture"),Ut.setValue(k,"batchingIdTexture",X._indirectTexture,Se),Ut.setOptional(k,X,"batchingColorTexture"),X._colorsTexture!==null&&Ut.setValue(k,"batchingColorTexture",X._colorsTexture,Se));const mn=K.morphAttributes;if((mn.position!==void 0||mn.normal!==void 0||mn.color!==void 0)&&Y.update(X,K,_n),(pn||Ye.receiveShadow!==X.receiveShadow)&&(Ye.receiveShadow=X.receiveShadow,Ut.setValue(k,"receiveShadow",X.receiveShadow)),Q.isMeshGouraudMaterial&&Q.envMap!==null&&(Fn.envMap.value=Oe,Fn.flipEnvMap.value=Oe.isCubeTexture&&Oe.isRenderTargetTexture===!1?-1:1),Q.isMeshStandardMaterial&&Q.envMap===null&&q.environment!==null&&(Fn.envMapIntensity.value=q.environmentIntensity),pn&&(Ut.setValue(k,"toneMappingExposure",y.toneMappingExposure),Ye.needsLights&&Js(Fn,On),_e&&Q.fog===!0&&he.refreshFogUniforms(Fn,_e),he.refreshMaterialUniforms(Fn,Q,U,W,p.state.transmissionRenderTarget[C.id]),zo.upload(k,ki(Ye),Fn,Se)),Q.isShaderMaterial&&Q.uniformsNeedUpdate===!0&&(zo.upload(k,ki(Ye),Fn,Se),Q.uniformsNeedUpdate=!1),Q.isSpriteMaterial&&Ut.setValue(k,"center",X.center),Ut.setValue(k,"modelViewMatrix",X.modelViewMatrix),Ut.setValue(k,"normalMatrix",X.normalMatrix),Ut.setValue(k,"modelMatrix",X.matrixWorld),Q.isShaderMaterial||Q.isRawShaderMaterial){const rn=Q.uniformsGroups;for(let xn=0,fs=rn.length;xn<fs;xn++){const yn=rn[xn];lt.update(yn,_n),lt.bind(yn,_n)}}return _n}function Js(C,q){C.ambientLightColor.needsUpdate=q,C.lightProbe.needsUpdate=q,C.directionalLights.needsUpdate=q,C.directionalLightShadows.needsUpdate=q,C.pointLights.needsUpdate=q,C.pointLightShadows.needsUpdate=q,C.spotLights.needsUpdate=q,C.spotLightShadows.needsUpdate=q,C.rectAreaLights.needsUpdate=q,C.hemisphereLights.needsUpdate=q}function oa(C){return C.isMeshLambertMaterial||C.isMeshToonMaterial||C.isMeshPhongMaterial||C.isMeshStandardMaterial||C.isShadowMaterial||C.isShaderMaterial&&C.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(C,q,K){const Q=pe.get(C);Q.__autoAllocateDepthBuffer=C.resolveDepthBuffer===!1,Q.__autoAllocateDepthBuffer===!1&&(Q.__useRenderToTexture=!1),pe.get(C.texture).__webglTexture=q,pe.get(C.depthTexture).__webglTexture=Q.__autoAllocateDepthBuffer?void 0:K,Q.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(C,q){const K=pe.get(C);K.__webglFramebuffer=q,K.__useDefaultFramebuffer=q===void 0};const Qs=k.createFramebuffer();this.setRenderTarget=function(C,q=0,K=0){A=C,w=q,R=K;let Q=!0,X=null,_e=!1,Ce=!1;if(C){const Oe=pe.get(C);if(Oe.__useDefaultFramebuffer!==void 0)ae.bindFramebuffer(k.FRAMEBUFFER,null),Q=!1;else if(Oe.__webglFramebuffer===void 0)Se.setupRenderTarget(C);else if(Oe.__hasExternalTextures)Se.rebindTextures(C,pe.get(C.texture).__webglTexture,pe.get(C.depthTexture).__webglTexture);else if(C.depthBuffer){const Je=C.depthTexture;if(Oe.__boundDepthTexture!==Je){if(Je!==null&&pe.has(Je)&&(C.width!==Je.image.width||C.height!==Je.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Se.setupDepthRenderbuffer(C)}}const Ke=C.texture;(Ke.isData3DTexture||Ke.isDataArrayTexture||Ke.isCompressedArrayTexture)&&(Ce=!0);const tt=pe.get(C).__webglFramebuffer;C.isWebGLCubeRenderTarget?(Array.isArray(tt[q])?X=tt[q][K]:X=tt[q],_e=!0):C.samples>0&&Se.useMultisampledRTT(C)===!1?X=pe.get(C).__webglMultisampledFramebuffer:Array.isArray(tt)?X=tt[K]:X=tt,I.copy(C.viewport),F.copy(C.scissor),$=C.scissorTest}else I.copy(J).multiplyScalar(U).floor(),F.copy(We).multiplyScalar(U).floor(),$=at;if(K!==0&&(X=Qs),ae.bindFramebuffer(k.FRAMEBUFFER,X)&&Q&&ae.drawBuffers(C,X),ae.viewport(I),ae.scissor(F),ae.setScissorTest($),_e){const Oe=pe.get(C.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_CUBE_MAP_POSITIVE_X+q,Oe.__webglTexture,K)}else if(Ce){const Oe=q;for(let Ke=0;Ke<C.textures.length;Ke++){const tt=pe.get(C.textures[Ke]);k.framebufferTextureLayer(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0+Ke,tt.__webglTexture,K,Oe)}}else if(C!==null&&K!==0){const Oe=pe.get(C.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,Oe.__webglTexture,K)}E=-1},this.readRenderTargetPixels=function(C,q,K,Q,X,_e,Ce,He=0){if(!(C&&C.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Oe=pe.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Ce!==void 0&&(Oe=Oe[Ce]),Oe){ae.bindFramebuffer(k.FRAMEBUFFER,Oe);try{const Ke=C.textures[He],tt=Ke.format,Je=Ke.type;if(!ie.textureFormatReadable(tt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ie.textureTypeReadable(Je)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}q>=0&&q<=C.width-Q&&K>=0&&K<=C.height-X&&(C.textures.length>1&&k.readBuffer(k.COLOR_ATTACHMENT0+He),k.readPixels(q,K,Q,X,Xe.convert(tt),Xe.convert(Je),_e))}finally{const Ke=A!==null?pe.get(A).__webglFramebuffer:null;ae.bindFramebuffer(k.FRAMEBUFFER,Ke)}}},this.readRenderTargetPixelsAsync=async function(C,q,K,Q,X,_e,Ce,He=0){if(!(C&&C.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Oe=pe.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Ce!==void 0&&(Oe=Oe[Ce]),Oe)if(q>=0&&q<=C.width-Q&&K>=0&&K<=C.height-X){ae.bindFramebuffer(k.FRAMEBUFFER,Oe);const Ke=C.textures[He],tt=Ke.format,Je=Ke.type;if(!ie.textureFormatReadable(tt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ie.textureTypeReadable(Je))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const gt=k.createBuffer();k.bindBuffer(k.PIXEL_PACK_BUFFER,gt),k.bufferData(k.PIXEL_PACK_BUFFER,_e.byteLength,k.STREAM_READ),C.textures.length>1&&k.readBuffer(k.COLOR_ATTACHMENT0+He),k.readPixels(q,K,Q,X,Xe.convert(tt),Xe.convert(Je),0);const vt=A!==null?pe.get(A).__webglFramebuffer:null;ae.bindFramebuffer(k.FRAMEBUFFER,vt);const Bt=k.fenceSync(k.SYNC_GPU_COMMANDS_COMPLETE,0);return k.flush(),await op(k,Bt,4),k.bindBuffer(k.PIXEL_PACK_BUFFER,gt),k.getBufferSubData(k.PIXEL_PACK_BUFFER,0,_e),k.deleteBuffer(gt),k.deleteSync(Bt),_e}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(C,q=null,K=0){const Q=Math.pow(2,-K),X=Math.floor(C.image.width*Q),_e=Math.floor(C.image.height*Q),Ce=q!==null?q.x:0,He=q!==null?q.y:0;Se.setTexture2D(C,0),k.copyTexSubImage2D(k.TEXTURE_2D,K,0,0,Ce,He,X,_e),ae.unbindTexture()};const rr=k.createFramebuffer(),Bi=k.createFramebuffer();this.copyTextureToTexture=function(C,q,K=null,Q=null,X=0,_e=null){_e===null&&(X!==0?(Hs("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),_e=X,X=0):_e=0);let Ce,He,Oe,Ke,tt,Je,gt,vt,Bt;const Tt=C.isCompressedTexture?C.mipmaps[_e]:C.image;if(K!==null)Ce=K.max.x-K.min.x,He=K.max.y-K.min.y,Oe=K.isBox3?K.max.z-K.min.z:1,Ke=K.min.x,tt=K.min.y,Je=K.isBox3?K.min.z:0;else{const mn=Math.pow(2,-X);Ce=Math.floor(Tt.width*mn),He=Math.floor(Tt.height*mn),C.isDataArrayTexture?Oe=Tt.depth:C.isData3DTexture?Oe=Math.floor(Tt.depth*mn):Oe=1,Ke=0,tt=0,Je=0}Q!==null?(gt=Q.x,vt=Q.y,Bt=Q.z):(gt=0,vt=0,Bt=0);const Et=Xe.convert(q.format),Ye=Xe.convert(q.type);let Vt;q.isData3DTexture?(Se.setTexture3D(q,0),Vt=k.TEXTURE_3D):q.isDataArrayTexture||q.isCompressedArrayTexture?(Se.setTexture2DArray(q,0),Vt=k.TEXTURE_2D_ARRAY):(Se.setTexture2D(q,0),Vt=k.TEXTURE_2D),k.pixelStorei(k.UNPACK_FLIP_Y_WEBGL,q.flipY),k.pixelStorei(k.UNPACK_PREMULTIPLY_ALPHA_WEBGL,q.premultiplyAlpha),k.pixelStorei(k.UNPACK_ALIGNMENT,q.unpackAlignment);const bt=k.getParameter(k.UNPACK_ROW_LENGTH),_n=k.getParameter(k.UNPACK_IMAGE_HEIGHT),di=k.getParameter(k.UNPACK_SKIP_PIXELS),pn=k.getParameter(k.UNPACK_SKIP_ROWS),On=k.getParameter(k.UNPACK_SKIP_IMAGES);k.pixelStorei(k.UNPACK_ROW_LENGTH,Tt.width),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,Tt.height),k.pixelStorei(k.UNPACK_SKIP_PIXELS,Ke),k.pixelStorei(k.UNPACK_SKIP_ROWS,tt),k.pixelStorei(k.UNPACK_SKIP_IMAGES,Je);const Ut=C.isDataArrayTexture||C.isData3DTexture,Fn=q.isDataArrayTexture||q.isData3DTexture;if(C.isDepthTexture){const mn=pe.get(C),rn=pe.get(q),xn=pe.get(mn.__renderTarget),fs=pe.get(rn.__renderTarget);ae.bindFramebuffer(k.READ_FRAMEBUFFER,xn.__webglFramebuffer),ae.bindFramebuffer(k.DRAW_FRAMEBUFFER,fs.__webglFramebuffer);for(let yn=0;yn<Oe;yn++)Ut&&(k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,pe.get(C).__webglTexture,X,Je+yn),k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,pe.get(q).__webglTexture,_e,Bt+yn)),k.blitFramebuffer(Ke,tt,Ce,He,gt,vt,Ce,He,k.DEPTH_BUFFER_BIT,k.NEAREST);ae.bindFramebuffer(k.READ_FRAMEBUFFER,null),ae.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else if(X!==0||C.isRenderTargetTexture||pe.has(C)){const mn=pe.get(C),rn=pe.get(q);ae.bindFramebuffer(k.READ_FRAMEBUFFER,rr),ae.bindFramebuffer(k.DRAW_FRAMEBUFFER,Bi);for(let xn=0;xn<Oe;xn++)Ut?k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,mn.__webglTexture,X,Je+xn):k.framebufferTexture2D(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,mn.__webglTexture,X),Fn?k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,rn.__webglTexture,_e,Bt+xn):k.framebufferTexture2D(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,rn.__webglTexture,_e),X!==0?k.blitFramebuffer(Ke,tt,Ce,He,gt,vt,Ce,He,k.COLOR_BUFFER_BIT,k.NEAREST):Fn?k.copyTexSubImage3D(Vt,_e,gt,vt,Bt+xn,Ke,tt,Ce,He):k.copyTexSubImage2D(Vt,_e,gt,vt,Ke,tt,Ce,He);ae.bindFramebuffer(k.READ_FRAMEBUFFER,null),ae.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else Fn?C.isDataTexture||C.isData3DTexture?k.texSubImage3D(Vt,_e,gt,vt,Bt,Ce,He,Oe,Et,Ye,Tt.data):q.isCompressedArrayTexture?k.compressedTexSubImage3D(Vt,_e,gt,vt,Bt,Ce,He,Oe,Et,Tt.data):k.texSubImage3D(Vt,_e,gt,vt,Bt,Ce,He,Oe,Et,Ye,Tt):C.isDataTexture?k.texSubImage2D(k.TEXTURE_2D,_e,gt,vt,Ce,He,Et,Ye,Tt.data):C.isCompressedTexture?k.compressedTexSubImage2D(k.TEXTURE_2D,_e,gt,vt,Tt.width,Tt.height,Et,Tt.data):k.texSubImage2D(k.TEXTURE_2D,_e,gt,vt,Ce,He,Et,Ye,Tt);k.pixelStorei(k.UNPACK_ROW_LENGTH,bt),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,_n),k.pixelStorei(k.UNPACK_SKIP_PIXELS,di),k.pixelStorei(k.UNPACK_SKIP_ROWS,pn),k.pixelStorei(k.UNPACK_SKIP_IMAGES,On),_e===0&&q.generateMipmaps&&k.generateMipmap(Vt),ae.unbindTexture()},this.initRenderTarget=function(C){pe.get(C).__webglFramebuffer===void 0&&Se.setupRenderTarget(C)},this.initTexture=function(C){C.isCubeTexture?Se.setTextureCube(C,0):C.isData3DTexture?Se.setTexture3D(C,0):C.isDataArrayTexture||C.isCompressedArrayTexture?Se.setTexture2DArray(C,0):Se.setTexture2D(C,0),ae.unbindTexture()},this.resetState=function(){w=0,R=0,A=null,ae.reset(),Re.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return vi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Rt._getDrawingBufferColorSpace(e),t.unpackColorSpace=Rt._getUnpackColorSpace()}}const dh={type:"change"},Al={type:"start"},Md={type:"end"},Uo=new ta,fh=new Ci,ox=Math.cos(70*vn.DEG2RAD),sn=new L,kn=2*Math.PI,kt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},tc=1e-6;class ax extends Mm{constructor(e,t=null){super(e,t),this.state=kt.NONE,this.target=new L,this.cursor=new L,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:jr.ROTATE,MIDDLE:jr.DOLLY,RIGHT:jr.PAN},this.touches={ONE:qr.ROTATE,TWO:qr.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new L,this._lastQuaternion=new gn,this._lastTargetPosition=new L,this._quat=new gn().setFromUnitVectors(e.up,new L(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Bu,this._sphericalDelta=new Bu,this._scale=1,this._panOffset=new L,this._rotateStart=new ye,this._rotateEnd=new ye,this._rotateDelta=new ye,this._panStart=new ye,this._panEnd=new ye,this._panDelta=new ye,this._dollyStart=new ye,this._dollyEnd=new ye,this._dollyDelta=new ye,this._dollyDirection=new L,this._mouse=new ye,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=lx.bind(this),this._onPointerDown=cx.bind(this),this._onPointerUp=ux.bind(this),this._onContextMenu=vx.bind(this),this._onMouseWheel=fx.bind(this),this._onKeyDown=px.bind(this),this._onTouchStart=mx.bind(this),this._onTouchMove=gx.bind(this),this._onMouseDown=hx.bind(this),this._onMouseMove=dx.bind(this),this._interceptControlDown=_x.bind(this),this._interceptControlUp=xx.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(dh),this.update(),this.state=kt.NONE}update(e=null){const t=this.object.position;sn.copy(t).sub(this.target),sn.applyQuaternion(this._quat),this._spherical.setFromVector3(sn),this.autoRotate&&this.state===kt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,r=this.maxAzimuthAngle;isFinite(i)&&isFinite(r)&&(i<-Math.PI?i+=kn:i>Math.PI&&(i-=kn),r<-Math.PI?r+=kn:r>Math.PI&&(r-=kn),i<=r?this._spherical.theta=Math.max(i,Math.min(r,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+r)/2?Math.max(i,this._spherical.theta):Math.min(r,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let s=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),s=o!=this._spherical.radius}if(sn.setFromSpherical(this._spherical),sn.applyQuaternion(this._quatInverse),t.copy(this.target).add(sn),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){const a=sn.length();o=this._clampDistance(a*this._scale);const c=a-o;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),s=!!c}else if(this.object.isOrthographicCamera){const a=new L(this._mouse.x,this._mouse.y,0);a.unproject(this.object);const c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),s=c!==this.object.zoom;const l=new L(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(a),this.object.updateMatrixWorld(),o=sn.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(Uo.origin.copy(this.object.position),Uo.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Uo.direction))<ox?this.object.lookAt(this.target):(fh.setFromNormalAndCoplanarPoint(this.object.up,this.target),Uo.intersectPlane(fh,this.target))))}else if(this.object.isOrthographicCamera){const o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),s=!0)}return this._scale=1,this._performCursorZoom=!1,s||this._lastPosition.distanceToSquared(this.object.position)>tc||8*(1-this._lastQuaternion.dot(this.object.quaternion))>tc||this._lastTargetPosition.distanceToSquared(this.target)>tc?(this.dispatchEvent(dh),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?kn/60*this.autoRotateSpeed*e:kn/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){sn.setFromMatrixColumn(t,0),sn.multiplyScalar(-e),this._panOffset.add(sn)}_panUp(e,t){this.screenSpacePanning===!0?sn.setFromMatrixColumn(t,1):(sn.setFromMatrixColumn(t,0),sn.crossVectors(this.object.up,sn)),sn.multiplyScalar(e),this._panOffset.add(sn)}_pan(e,t){const i=this.domElement;if(this.object.isPerspectiveCamera){const r=this.object.position;sn.copy(r).sub(this.target);let s=sn.length();s*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*s/i.clientHeight,this.object.matrix),this._panUp(2*t*s/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),r=e-i.left,s=t-i.top,o=i.width,a=i.height;this._mouse.x=r/o*2-1,this._mouse.y=-(s/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(kn*this._rotateDelta.x/t.clientHeight),this._rotateUp(kn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(kn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-kn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(kn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-kn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._rotateStart.set(i,r)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panStart.set(i,r)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,r=e.pageY-t.y,s=Math.sqrt(i*i+r*r);this._dollyStart.set(0,s)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),r=.5*(e.pageX+i.x),s=.5*(e.pageY+i.y);this._rotateEnd.set(r,s)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(kn*this._rotateDelta.x/t.clientHeight),this._rotateUp(kn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panEnd.set(i,r)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,r=e.pageY-t.y,s=Math.sqrt(i*i+r*r);this._dollyEnd.set(0,s),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const o=(e.pageX+t.x)*.5,a=(e.pageY+t.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new ye,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function cx(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n)))}function lx(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function ux(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Md),this.state=kt.NONE;break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function hx(n){let e;switch(n.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case jr.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=kt.DOLLY;break;case jr.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=kt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=kt.ROTATE}break;case jr.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=kt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=kt.PAN}break;default:this.state=kt.NONE}this.state!==kt.NONE&&this.dispatchEvent(Al)}function dx(n){switch(this.state){case kt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case kt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case kt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function fx(n){this.enabled===!1||this.enableZoom===!1||this.state!==kt.NONE||(n.preventDefault(),this.dispatchEvent(Al),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(Md))}function px(n){this.enabled!==!1&&this._handleKeyDown(n)}function mx(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case qr.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=kt.TOUCH_ROTATE;break;case qr.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=kt.TOUCH_PAN;break;default:this.state=kt.NONE}break;case 2:switch(this.touches.TWO){case qr.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=kt.TOUCH_DOLLY_PAN;break;case qr.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=kt.TOUCH_DOLLY_ROTATE;break;default:this.state=kt.NONE}break;default:this.state=kt.NONE}this.state!==kt.NONE&&this.dispatchEvent(Al)}function gx(n){switch(this._trackPointer(n),this.state){case kt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case kt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case kt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case kt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=kt.NONE}}function vx(n){this.enabled!==!1&&n.preventDefault()}function _x(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function xx(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const ws=new L;function jn(n,e,t,i,r,s){const o=2*Math.PI*r/4,a=Math.max(s-2*r,0),c=Math.PI/4;ws.copy(e),ws[i]=0,ws.normalize();const l=.5*o/(o+a),u=1-ws.angleTo(n)/c;return Math.sign(ws[t])===1?u*l:a/(o+a)+l+l*(1-u)}class ra extends qt{constructor(e=1,t=1,i=1,r=2,s=.1){const o=r*2+1;if(s=Math.min(e/2,t/2,i/2,s),super(1,1,1,o,o,o),this.type="RoundedBoxGeometry",this.parameters={width:e,height:t,depth:i,segments:r,radius:s},o===1)return;const a=this.toNonIndexed();this.index=null,this.attributes.position=a.attributes.position,this.attributes.normal=a.attributes.normal,this.attributes.uv=a.attributes.uv;const c=new L,l=new L,u=new L(e,t,i).divideScalar(2).subScalar(s),h=this.attributes.position.array,d=this.attributes.normal.array,f=this.attributes.uv.array,g=h.length/6,v=new L,m=.5/o;for(let p=0,x=0;p<h.length;p+=3,x+=2)switch(c.fromArray(h,p),l.copy(c),l.x-=Math.sign(l.x)*m,l.y-=Math.sign(l.y)*m,l.z-=Math.sign(l.z)*m,l.normalize(),h[p+0]=u.x*Math.sign(c.x)+l.x*s,h[p+1]=u.y*Math.sign(c.y)+l.y*s,h[p+2]=u.z*Math.sign(c.z)+l.z*s,d[p+0]=l.x,d[p+1]=l.y,d[p+2]=l.z,Math.floor(p/g)){case 0:v.set(1,0,0),f[x+0]=jn(v,l,"z","y",s,i),f[x+1]=1-jn(v,l,"y","z",s,t);break;case 1:v.set(-1,0,0),f[x+0]=1-jn(v,l,"z","y",s,i),f[x+1]=1-jn(v,l,"y","z",s,t);break;case 2:v.set(0,1,0),f[x+0]=1-jn(v,l,"x","z",s,e),f[x+1]=jn(v,l,"z","x",s,i);break;case 3:v.set(0,-1,0),f[x+0]=1-jn(v,l,"x","z",s,e),f[x+1]=1-jn(v,l,"z","x",s,i);break;case 4:v.set(0,0,1),f[x+0]=1-jn(v,l,"x","y",s,e),f[x+1]=1-jn(v,l,"y","x",s,t);break;case 5:v.set(0,0,-1),f[x+0]=jn(v,l,"x","y",s,e),f[x+1]=1-jn(v,l,"y","x",s,t);break}}static fromJSON(e){return new ra(e.width,e.height,e.depth,e.segments,e.radius)}}const ph=Math.PI*2;function yx(n,e){const t=e.clone().normalize();let i=2*Math.atan2(n.x*t.x+n.y*t.y+n.z*t.z,n.w);for(;i>Math.PI;)i-=ph;for(;i<-Math.PI;)i+=ph;return i}function bx(n,e,t,i=.168){const r=e.clone().multiply(t.clone().invert()).normalize(),s=Math.min(i*.6,.1),o=new L(0,s,0).applyQuaternion(r);return{position:n.clone().sub(o),quaternion:r}}function Bo(n,e,t=.055){if(!n)return null;let i=null,r=t;for(const s of e){const o=n.distanceTo(s.position);o<=r&&(i=s,r=o)}return i}function Mx({getModel:n=()=>({}),getTerminals:e=()=>[],onProbe:t=()=>{},onConnect:i=()=>{},onDisconnect:r=()=>{},onChange:s=()=>{},onAction:o=()=>{},onGraphCursor:a=()=>{},onHold:c=()=>{},snapRadius:l=.055}={}){const u=new Map,h=new Set,d=new Map;function f(p,x,b={}){var R,A,E,S;if(!x||h.has(p)||u.has(p))return!1;const y=x.resource||`${x.kind}:${x.channel||x.id}`;if(d.has(y))return!1;const M=n(),w={input:p,target:x,resource:y,position:(R=b.position)==null?void 0:R.clone(),startPosition:(A=b.position)==null?void 0:A.clone(),turn:0,lastValue:void 0};if(x.kind==="dial"){if(w.startValue=(E=M.parameters)==null?void 0:E[x.parameter],w.values=x.values||((S=M.options)==null?void 0:S[x.parameter]),!w.values&&!Number.isFinite(w.startValue))return!1;w.values&&!w.values.includes(w.startValue)&&(w.startValue=w.values[0]),w.lastValue=w.startValue}return u.set(p,w),d.set(y,p),c("start",w),x.kind==="probe"&&t(x.channel,null),x.kind==="plug"&&Number.isInteger(x.wireIndex)&&r(x.wireIndex),(x.kind==="button"||x.kind==="switch")&&o(x.action),x.kind==="screen"&&Number.isFinite(b.fraction)&&a(vn.clamp(b.fraction,0,1),b.panelIndex||0),!0}function g(p,x={}){var y;const b=u.get(p);if(!b)return!1;if(x.position&&(b.position=x.position.clone()),x.quaternion&&(b.quaternion=x.quaternion.clone()),b.target.kind==="dial"&&Number.isFinite(x.turn)){b.turn+=x.turn;const M=b.target;let w;if((y=b.values)!=null&&y.length){const R=Math.round(b.turn/(M.detentRadians||Math.PI/12)),A=vn.clamp(b.values.indexOf(b.startValue)+R,0,b.values.length-1);w=b.values[A]}else{const R=M.step||1;w=vn.clamp(b.startValue+Math.round(b.turn/(M.detentRadians||Math.PI/12))*R,M.min??-1/0,M.max??1/0),w=Number(w.toPrecision(12))}w!==b.lastValue&&(b.lastValue=w,s(M.parameter,w))}return b.target.kind==="screen"&&Number.isFinite(x.fraction)&&a(vn.clamp(x.fraction,0,1),x.panelIndex||0),c("move",b),!0}function v(p,x={},b=!1){h.delete(p);const y=u.get(p);if(!y)return null;x.position&&(y.position=x.position.clone()),u.delete(p),d.delete(y.resource);const M=b?null:Bo(y.position,e(),l);let w={kind:b?"cancelled":"released",terminal:null};if(y.target.kind==="probe"&&(t(y.target.channel,(M==null?void 0:M.id)||null),w={kind:M?"connected":"loose",terminal:(M==null?void 0:M.id)||null}),y.target.kind==="terminal"||y.target.kind==="plug"){const R=y.target.from||y.target.terminal;if(!b&&M&&M.id!==R)i(R,M.id),w={kind:"connected",terminal:M.id};else{const A=y.startPosition&&y.position&&y.startPosition.distanceTo(y.position)<.018;w={kind:y.target.kind==="terminal"&&A?"cancelled":"loose",terminal:null}}}return c("end",y,w),w}function m(){const p=[...u.keys()];for(const x of p)v(x,{},!0),h.add(x)}return{begin:f,move:g,end:(p,x)=>v(p,x),cancelAll:m,release(p){h.delete(p)},block(p){u.has(p)&&v(p,{},!0),h.add(p)},hold:p=>u.get(p),holds:u,isHeld:p=>d.has(p)}}function Sx(n,e,{bounds:t={minX:-3.2,maxX:3.2,minZ:-3.8,maxZ:2.4},obstacles:i=[],radius:r=.19}={}){const s=n.clone(),o=Math.max(1,Math.ceil(Math.hypot(e.x,e.z)/.04)),a=e.x/o,c=e.z/o,l=(h,d,f)=>{const g=[h-(f.minX-r),f.maxX+r-h,d-(f.minZ-r),f.maxZ+r-d];return Math.max(0,Math.min(...g))},u=(h,d)=>i.some(f=>{const g=l(h,d,f),v=l(s.x,s.z,f);if(g<=0)return!1;if(v<=0)return!0;if(g<v-1e-10)return!1;const m=(f.minX+f.maxX)/2,p=(f.minZ+f.maxZ)/2,x=(s.x-m)**2+(s.z-p)**2,b=(h-m)**2+(d-p)**2;return g>v+1e-10||b<=x+1e-10});for(let h=0;h<o;h++){const d=vn.clamp(s.x+a,t.minX+r,t.maxX-r);u(d,s.z)||(s.x=d);const f=vn.clamp(s.z+c,t.minZ+r,t.maxZ-r);u(s.x,f)||(s.z=f)}return s}function Ex(n,e,t){const i=new gn().setFromAxisAngle(new L(0,1,0),t);n.position.sub(e).applyQuaternion(i).add(e),n.quaternion.premultiply(i),n.updateMatrixWorld(!0)}function wx({speed:n=.8,snapAngle:e=Math.PI/6,...t}={}){let i=!1,r=!1;return{reset(){i=!1,r=!0},update({rig:s,headPosition:o,headQuaternion:a,left:c=[0,0],right:l=0,dt:u=0,enabled:h=!0}){if(!h)return i=!1,r=!0,!1;const d=Math.max(Math.abs(c[0]||0),Math.abs(c[1]||0),Math.abs(l))<.2;if(!i){if(!d)return!1;i=!0}Math.abs(l)<.25&&(r=!1);let f=0;Math.abs(l)>.7&&!r&&(f=-Math.sign(l)*e,Ex(s,o,f),r=!0);const g=Math.abs(c[0]||0)>.18?c[0]:0,v=Math.abs(c[1]||0)>.18?c[1]:0;if(!g&&!v)return!1;const m=new L(0,0,-1).applyQuaternion(a).applyAxisAngle(new L(0,1,0),f);m.y=0,m.lengthSq()<.001?m.set(0,0,-1):m.normalize();const x=new L(-m.z,0,m.x).multiplyScalar(g).addScaledVector(m,-v);x.length()>1&&x.normalize(),x.multiplyScalar(n*vn.clamp(u,0,.05));const b=Sx(o,x,t);return s.position.add(b.sub(o)),s.updateMatrixWorld(!0),!0}}}function mh(n,e=!1){const t=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),r=new Set(Object.keys(n[0].morphAttributes)),s={},o={},a=n[0].morphTargetsRelative,c=new cn;let l=0;for(let u=0;u<n.length;++u){const h=n[u];let d=0;if(t!==(h.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const f in h.attributes){if(!i.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;s[f]===void 0&&(s[f]=[]),s[f].push(h.attributes[f]),d++}if(d!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(a!==h.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const f in h.morphAttributes){if(!r.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;o[f]===void 0&&(o[f]=[]),o[f].push(h.morphAttributes[f])}if(e){let f;if(t)f=h.index.count;else if(h.attributes.position!==void 0)f=h.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,f,u),l+=f}}if(t){let u=0;const h=[];for(let d=0;d<n.length;++d){const f=n[d].index;for(let g=0;g<f.count;++g)h.push(f.getX(g)+u);u+=n[d].attributes.position.count}c.setIndex(h)}for(const u in s){const h=gh(s[u]);if(!h)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;c.setAttribute(u,h)}for(const u in o){const h=o[u][0].length;if(h===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[u]=[];for(let d=0;d<h;++d){const f=[];for(let v=0;v<o[u].length;++v)f.push(o[u][v][d]);const g=gh(f);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;c.morphAttributes[u].push(g)}}return c}function gh(n){let e,t,i,r=-1,s=0;for(let l=0;l<n.length;++l){const u=n[l];if(e===void 0&&(e=u.array.constructor),e!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=u.itemSize),t!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=u.normalized),i!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(r===-1&&(r=u.gpuType),r!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;s+=u.count*t}const o=new e(s),a=new Qn(o,t,i);let c=0;for(let l=0;l<n.length;++l){const u=n[l];if(u.isInterleavedBufferAttribute){const h=c/t;for(let d=0,f=u.count;d<f;d++)for(let g=0;g<t;g++){const v=u.getComponent(d,g);a.setComponent(d+h,g,v)}}else o.set(u.array,c);c+=u.count*t}return r!==void 0&&(a.gpuType=r),a}const Gt={case:"#d5d6d1",face:"#e8e8e2",dark:"#262a2c",rubber:"#363b3c",metal:"#a5aaab",red:"#ad2f2c",black:"#25292b",ch1:"#d5b348",ch2:"#64a5b5"},nn=(n,e=3)=>Number.isFinite(Number(n))&&n!==null?Number(n).toFixed(e).replace(/\.?0+$/,"")||"0":"—",Sd=n=>Number(n)>=1e3?`${nn(Number(n)/1e3,2)} kΩ`:`${nn(Number(n),1)} Ω`,Kc=n=>n!=null&&n.isVector3?n.clone():Array.isArray(n)?new L(...n):new L((n==null?void 0:n.x)||0,(n==null?void 0:n.y)||0,(n==null?void 0:n.z)||0);function Xt(n,e,t,i,{size:r,width:s,align:o="left",weight:a=700,family:c="Arial, sans-serif"}){const l=String(e);let u=r;n.font=`${a} ${u}px ${c}`,s&&n.measureText(l).width>s&&(u*=s/n.measureText(l).width,n.font=`${a} ${u}px ${c}`),n.textAlign=o,n.fillText(l,t,i)}function Tx(n,e,t){const i=[];for(const r of String(e).split(/\s+/)){const s=i.length-1;s>=0&&n.measureText(`${i[s]} ${r}`).width<=t?i[s]+=` ${r}`:i.push(r)}return i}function Fi(n){const e=new jt;e.name=n;const t=[],i={},r=new Set,s=new Set,o=new Set;let a=!1;const c=(A,E={})=>{const S=new wl({color:A,roughness:.66,metalness:.03,...E});return r.add(S),S},l={case:c(Gt.case),face:c(Gt.face),dark:c(Gt.dark),rubber:c(Gt.rubber,{roughness:.87}),metal:c(Gt.metal,{metalness:.8,roughness:.27}),red:c(Gt.red),black:c(Gt.black)};function u(A,E,S=e,I=[0,0,0]){s.add(A);const F=new Rn(A,E);return F.position.copy(Kc(I)),F.castShadow=!0,F.receiveShadow=!0,S.add(F),F}const h=(A,E,S,I,F,$,H=.002)=>u(H<=5e-4?new qt(A,E,S):new ra(A,E,S,2,Math.min(H,A/4,E/4,S/4)),I,F,$);function d(A,E,S,I,F,$=24){const H=new ht(A,A,E,$);return H.rotateX(Math.PI/2),u(H,S,I,F)}function f(A,E,S=e){const I=new an;return I.name=A,I.position.copy(Kc(E)),S.add(I),i[A]=I,I}function g(A,E){const S={object:A,id:`${n}:${t.length}`,axis:"z",...E};return A.userData.equipmentTarget=S,t.push(S),S}function v(A,E,S,{pixels:I=[768,320],background:F="#dbe6cb",foreground:$="#102018"}={}){const H=document.createElement("canvas");H.width=I[0],H.height=Math.round(I[0]*E/A);const j=H.getContext("2d"),G=new qc(H);G.colorSpace=wn,G.anisotropy=8;const W=new Zn({map:G,toneMapped:!1});r.add(W),o.add(G);const U=u(new Ii(A,E),W,e,S);U.castShadow=!1;let de=null;return{object:U,canvas:H,ctx:j,texture:G,draw(oe,J){const We=JSON.stringify(oe);We!==de&&(de=We,j.fillStyle=F,j.fillRect(0,0,H.width,H.height),j.fillStyle=$,j.textBaseline="middle",j.textAlign="left",J(j,H.width,H.height),G.needsUpdate=!0)}}}function m(A,E,S,I,{size:F=52,color:$="#172120",background:H="#e8e8e2",align:j="center"}={}){const G=v(E,S,I,{pixels:[Math.round(128*E/S),128],background:H,foreground:$});return G.draw(A,(W,U,de)=>{Xt(W,A,j==="center"?U/2:8,de/2,{size:de*.88,width:U-16,align:j})}),G}function p(A,E,S,I=e){d(.0022,.001,l.metal,I,[A,E,S],12);const F=h(.003,5e-4,3e-4,l.dark,I,[A,E,S+65e-5],1e-4);F.rotation.z=.5}function x(A,E,S){h(A,E-.008,S,l.case,e,[0,E/2+.004,0],.008),h(A-.008,E-.014,.006,l.face,e,[0,E/2+.005,S/2],.004);for(const I of[-A/2+.014,A/2-.014]){for(const F of[.024,E-.018])p(I,F,S/2+.0038);for(const F of[-S/2+.02,S/2-.02])h(.025,.009,.032,l.rubber,e,[I,.0045,F],.002)}for(let I=0;I<12;I++)h(.035,6e-4,.002,l.dark,e,[A/2-.042,E+4e-4,-S/2+.022+I*.006],15e-5);return S/2+.004}function b(A,E,S,I,F,{bnc:$=!1,action:H,channel:j}={}){const G=c(F);if(d($?.0083:.007,$?.008:.003,G,e,[E,S,I+.002]),d($?.0065:.0048,$?.009:.002,l.metal,e,[E,S,I+.006]),d($?.0042:.0031,.001,l.dark,e,[E,S,I+($?.011:.0075)]),$)for(const U of[-1,1])d(.001,.004,l.metal,e,[E+U*.006,S,I+.009],10);const W=f(A,[E,S,I+.012]);if(H){const U=d(.012,.007,l.face,e,[E,S,I+.004]);U.visible=!1,g(U,{kind:"probe",label:A,action:H,channel:j}),g(e.children[e.children.indexOf(W)-1],{kind:"probe",label:A,action:H,channel:j})}return W}function y(A,E,S,I,F,{radius:$=.011,values:H=Ft[E],min:j,max:G,step:W=1,color:U=Gt.dark}={}){const de=new jt;de.position.set(S,I,F),e.add(de),d($+.003,.0016,l.metal,de,[0,0,0]);const oe=new jt;oe.position.z=.003,oe.userData.equipmentMoving=!0,de.add(oe);const J=c(U,{roughness:.79}),We=d($,.016,J,oe,[0,0,.008],32),at=[];for(let te=0;te<28;te++){const ce=te/28*Math.PI*2,Ae=new ht(5e-4,5e-4,.012,6);Ae.rotateX(Math.PI/2),Ae.translate(Math.cos(ce)*$,Math.sin(ce)*$,.008),at.push(Ae)}u(mh(at),J,oe),at.forEach(te=>te.dispose()),h(.0014,$*.65,7e-4,l.face,oe,[0,$*.49,.0164],15e-5);for(let te=0;te<11;te++){const ce=-Math.PI*.75+te/10*Math.PI*1.5,Ae=h(6e-4,te%5===0?.003:.0018,3e-4,l.dark,de,[Math.sin(ce)*($+.006),Math.cos(ce)*($+.006),8e-4],1e-4);Ae.rotation.z=-ce}const Fe=g(We,{kind:"dial",label:A,parameter:E,values:H,min:j??(H==null?void 0:H[0]),max:G??(H==null?void 0:H.at(-1)),step:W});We.userData.equipmentTarget=Fe,oe.traverse(te=>{te.isMesh&&(te.userData.equipmentTarget=Fe)});function pt(te){const ce=H==null?void 0:H.indexOf(te),Ae=H&&ce>=0?ce/Math.max(1,H.length-1):Number.isFinite(te)&&Number.isFinite(Fe.min)&&Number.isFinite(Fe.max)?vn.clamp((te-Fe.min)/(Fe.max-Fe.min||1),0,1):.5;oe.rotation.z=(.75-Ae*1.5)*Math.PI,Fe.value=te}return{descriptor:Fe,set:pt,rotor:oe}}function M(A,E,S,I,F,{color:$="#6f7974",width:H=.025,height:j=.012}={}){const G=h(H,j,.007,c($),e,[S,I,F+.004],.002);return g(G,{kind:"button",label:A,action:E}),G}function w(){if(!a){a=!0;for(const A of[...s,...r,...o])A.dispose();e.removeFromParent()}}function R(){var I;const A=new Set(t.map(F=>F.object)),E=new Map;e.updateMatrixWorld(!0);const S=e.matrixWorld.clone().invert();e.traverse(F=>{if(!F.isMesh||A.has(F)||Array.isArray(F.material))return;for(let H=F.parent;H&&H!==e;H=H.parent)if(H.userData.equipmentMoving)return;const $=E.get(F.material)||[];$.push(F),E.set(F.material,$)});for(const[F,$]of E){if($.length<2)continue;const H=$.map(U=>{const de=U.geometry.index?U.geometry.toNonIndexed():U.geometry.clone();return de.applyMatrix4(new Wt().multiplyMatrices(S,U.matrixWorld)),de}),j=mh(H);if(H.forEach(U=>U.dispose()),!j)continue;const G=u(j,F),W=(I=$.find(U=>U.userData.equipmentTarget))==null?void 0:I.userData.equipmentTarget;W&&(G.userData.equipmentTarget=W);for(const U of $)U.removeFromParent(),U.geometry.dispose(),s.delete(U.geometry)}}return{group:e,targets:t,anchors:i,m:l,material:c,mesh:u,box:h,cylinder:d,screen:v,text:m,screw:p,enclosure:x,socket:b,dial:y,button:M,anchor:f,target:g,finish:R,dispose:w}}function Ax({id:n="multimeter",label:e="DIGITAL MULTIMETER"}={}){const t=Fi(n),{group:i,m:r}=t;t.box(.11,.213,.046,t.material("#b49a49",{roughness:.88}),i,[0,.112,0],.012),t.box(.096,.198,.008,r.dark,i,[0,.112,.024],.008),t.box(.09,.063,.004,r.black,i,[0,.172,.03],.003);const s=t.screen(.084,.057,[0,.172,.0325],{pixels:[840,570]});t.text("MULTIMETER",.084,.01,[0,.209,.029],{background:Gt.dark,color:"#f5f7ef"});const o=t.dial("Meter","meterMode",0,.106,.031,{radius:.02,values:["off","vdc"]});t.text("OFF",.024,.01,[-.027,.078,.031],{background:Gt.dark,color:"#d7d9d1"}),t.text("V⎓",.023,.011,[.028,.078,.031],{background:Gt.dark,color:"#d7d9d1"}),t.socket("COM",-.025,.042,.031,Gt.black),t.socket("V",.025,.042,.031,Gt.red),t.text("COM          V",.085,.011,[0,.023,.031],{background:Gt.dark,color:"#e0e1d8"});const a=t.box(.067,.1,.006,r.dark,i,[0,.055,-.061],.003);a.rotation.x=-.4;for(const l of[-.044,.044])t.box(.014,.044,.006,r.rubber,i,[l,.022,.025],.003);function c(l={}){const u=l.measurement||{},h=l.meterMode||"vdc";o.set(h);const d=u.probeReady?u.probeVoltage:null;s.draw([h,d,l.module],(f,g,v)=>{h!=="off"&&(Xt(f,l.module==="opamp"?"V SAMPLE":"DC V",28,v*.14,{size:v*.16,width:g-56}),Xt(f,d===null?"— —":nn(d,3),g-26,v*.54,{size:v*.55,width:g-52,align:"right",family:"Arial, sans-serif"}),d===null&&Xt(f,"CONNECT PROBES",g/2,v*.87,{size:v*.13,width:g-40,align:"center"}))})}return t.finish(),c(),{group:i,targets:t.targets,anchors:t.anchors,update:c,dispose:t.dispose}}function Rl(n,e,t){const i={l:100,r:30,t:78,b:138},r=52,s=(e-i.t-i.b-r*(t-1))/t;return Array.from({length:t},(o,a)=>({panel:a,left:i.l/n,top:(i.t+a*(s+r))/e,width:(n-i.l-i.r)/n,height:s/e}))}function Rx(n){return`${{"Capacitor voltage":"V","Inductor voltage":"V","Storage current":"I","Stored energy":"E","Calculated load power":"P"}[n.name]||n.name||""} ${nn(n.value,3)} ${n.unit||""}`.trim()}function Ed(n,e,t,i,r){var p,x,b;n.fillStyle="#071015",n.fillRect(0,0,e,t);const o=((p=i==null?void 0:i.panels)!=null&&p.length?i.panels:[i]).filter(Boolean).slice(0,3),a=Rl(e,t,o.length||1),c=r.recorder?r.recorder==="transient"?r.playing?"ACQUIRING":"PAUSED":"CALCULATED · WIRING":r.scopeRunning===!1?r.scopeStale?"HOLD · OLD SETTINGS":"HOLD":"RUN";n.fillStyle="#f1faf5",Xt(n,c,20,29,{size:30,width:e*.56});const l=Number.isFinite(r.timeDiv)?`${nn(r.timeDiv,3)} ms/div`:((i==null?void 0:i.xLabel)||"TIME").replace("Elapsed circuit time","Time").replace("Load resistance","Load");if(Xt(n,l,e-22,29,{size:30,width:e*.41,align:"right"}),!o.length){Xt(n,"CONNECT THE CHANNELS",e/2,t/2,{size:36,width:e-60,align:"center"});return}const u=["#ffe27b","#79e4f6","#dfbfff"];for(let y=0;y<o.length;y++){const M=o[y],w=a[y],R=w.left*e,A=w.top*t,E=w.width*e,S=w.height*t;n.strokeStyle="#344750",n.lineWidth=1.5;const I=M.xDivisions||4,F=M.yDivisions||4;for(let G=0;G<=I;G++)n.beginPath(),n.moveTo(R+E*G/I,A),n.lineTo(R+E*G/I,A+S),n.stroke();for(let G=0;G<=F;G++)n.beginPath(),n.moveTo(R,A+S*G/F),n.lineTo(R+E,A+S*G/F),n.stroke();n.fillStyle="#f1faf5";const $=M.yTicks||[];for(const[G,W]of $.entries())o.length>1&&G!==0&&G!==Math.floor($.length/2)&&G!==$.length-1||Xt(n,W.label,R-12,A+(1-W.position)*S,{size:32,width:R-20,align:"right"});for(const[G,W]of(M.xTicks||[]).entries())n.fillStyle=i.interaction==="source"?u[G%u.length]:"#f1faf5",Xt(n,W.label,R+W.position*E,A+S+24,{size:31,width:Math.max(150,E/5),align:"center"});const H=r.recorder?M.yLabel:M.title;n.fillStyle=u[y%u.length],Xt(n,H||M.yLabel||"",R+12,A-22,{size:31,width:E-24}),n.save(),n.beginPath(),n.rect(R,A,E,S),n.clip();for(const[G,W]of(M.series||[]).entries()){n.strokeStyle=u[o.length>1?y:G%u.length],n.lineWidth=i.interaction==="source"?12:5,n.lineCap="round",n.lineJoin="round",n.beginPath();let U=!1;for(const de of W.points||[]){if(!Number.isFinite(de[0])||!Number.isFinite(de[1])){U=!1;continue}const oe=R+de[0]*E,J=A+(1-de[1])*S;U?n.lineTo(oe,J):(n.moveTo(oe,J),U=!0)}n.stroke()}if(!(M.series||[]).some(G=>{var W;return(W=G.points)==null?void 0:W.length})){n.fillStyle="#f5faf4",n.font="700 32px Arial, sans-serif";const G=Tx(n,r.scopeError||M.subtitle||"No acquired signal",E-44).slice(0,2);for(const[W,U]of G.entries())Xt(n,U,R+E/2,A+S/2+(W-(G.length-1)/2)*38,{size:32,align:"center"})}const j=M.cursor||M.marker;if(j&&Number.isFinite(j.x)){const G=R+vn.clamp(j.x,0,1)*E;n.strokeStyle="#f4fff7",n.lineWidth=3,n.setLineDash([9,7]),n.beginPath(),n.moveTo(G,A),n.lineTo(G,A+S),n.stroke(),n.setLineDash([]),Number.isFinite(j.y)&&(n.fillStyle="#f4fff7",n.beginPath(),n.arc(G,A+(1-j.y)*S,7,0,Math.PI*2),n.fill())}n.restore()}const h=(i==null?void 0:i.cursor)||((x=o.find(y=>y.cursor))==null?void 0:x.cursor),d=(b=h==null?void 0:h.readings)!=null&&b.length?h.readings.map(Rx):r.readings||[],f=t-94;n.fillStyle="#172b31",n.fillRect(0,f,e,94),n.fillStyle="#f6fff7";const g=h==null?void 0:h.xLabel,m=(g?[g,d.join("   ·   ")]:d.length>2?[d.slice(0,2).join("   ·   "),d.slice(2).join("   ·   ")]:[...d]).slice(0,2);m.length||m.push(r.scopeError?"CHECK CONNECTIONS":r.recorder?"Select a point to read it":"CONNECT THE CHANNELS"),m.forEach((y,M)=>Xt(n,y,22,f+(m.length===1?47:25+M*43),{size:35,width:e-44}))}function Cx({id:n="oscilloscope",label:e="OSCILLOSCOPE"}={}){const t=Fi(n),i=t.enclosure(.43,.245,.18);t.text(e,.27,.014,[-.044,.224,i+7e-4],{align:"left",size:45}),t.box(.278,.18,.007,t.m.dark,t.group,[-.066,.127,i+.0015],.004);const r=t.screen(.266,.17,[-.066,.128,i+.0055],{pixels:[1064,680],background:"#071015"}),s=t.target(r.object,{kind:"screen",label:"Scope",action:"scope-screen",bounds:[]}),o=t.dial("Time/div","timeDiv",.108,.182,i,{radius:.014});t.text("TIME / DIV",.074,.011,[.109,.213,i+5e-4]);const a=t.dial("CH1 volts/div","ch1Scale",.099,.104,i,{color:"#807341"}),c=t.dial("CH2 volts/div","ch2Scale",.163,.104,i,{color:"#3f6e7b"});t.text("CH1",.038,.012,[.099,.137,i+6e-4]),t.text("CH2",.038,.012,[.163,.137,i+6e-4]),t.text("VOLTS / DIV",.1,.011,[.13,.077,i+6e-4]);const l=t.dial("Trigger level","triggerLevel",.171,.182,i,{radius:.008});t.text("TRIGGER",.052,.011,[.17,.212,i+6e-4]);const u=t.button("Trigger edge","set:triggerEdge:falling",.171,.148,i,{width:.028}),h=t.screen(.043,.01,[.171,.16,i+7e-4],{pixels:[400,100],background:Gt.face});t.button("Run / Hold","scope-toggle",-.054,.02,i,{width:.03,color:"#5f7567"}),t.text("RUN / HOLD",.066,.008,[-.055,.04,i+5e-4],{size:42}),t.button("Autoscale","scope-autoscale",.014,.02,i,{width:.026}),t.text("AUTO",.042,.008,[.014,.04,i+5e-4],{size:48}),t.socket("CH1",.1,.037,i,Gt.ch1,{bnc:!0,action:"tool:ch1",channel:"ch1"}),t.socket("CH2",.164,.037,i,Gt.ch2,{bnc:!0,action:"tool:ch2",channel:"ch2"});function d(f={}){var p,x,b,y,M;const g=f.parameters||{};o.set(g.timeDiv),a.set(g.ch1Scale),c.set(g.ch2Scale),l.set(g.triggerLevel),u.userData.equipmentTarget.action=`set:triggerEdge:${g.triggerEdge==="falling"?"rising":"falling"}`,h.draw(g.triggerEdge,(w,R,A)=>Xt(w,g.triggerEdge==="falling"?"FALL":"RISE",R/2,A/2,{size:A*.85,width:R-16,align:"center"})),s.bounds=Rl(r.canvas.width,r.canvas.height,Math.min(3,((x=(p=f.graph)==null?void 0:p.panels)==null?void 0:x.length)||1));const v=(b=f.rawGraph)==null?void 0:b.scope,m=v?{...g,timeDiv:v.timeDiv,ch1Scale:v.channels.ch1.scale,ch2Scale:v.channels.ch2.scale,scopeRunning:v.running,scopeStale:v.stale,scopeError:v.error,readings:[`CH1 ${nn(v.channels.ch1.peak,2)} V pk  ·  CH2 ${nn(v.channels.ch2.peak,2)} V pk`,`TRIGGER ${((y=v.trigger)==null?void 0:y.edge)==="falling"?"↓":"↑"} ${nn((M=v.trigger)==null?void 0:M.level,2)} V`]}:g;r.draw([f.graph,m.timeDiv,m.ch1Scale,m.ch2Scale,m.scopeRunning,m.scopeStale,m.scopeError,m.readings],(w,R,A)=>Ed(w,R,A,f.graph,m))}return t.finish(),d(),{group:t.group,targets:t.targets,anchors:t.anchors,screen:r,update:d,dispose:t.dispose}}function vh({id:n="lab-recorder",module:e="thevenin"}={}){const t=Fi(n),i=t.enclosure(.43,.245,.18);t.text("LAB RECORDER",.3,.014,[-.038,.224,i+7e-4],{align:"left"}),t.box(.402,.187,.007,t.m.dark,t.group,[0,.119,i+.0015],.004);const r=t.screen(.391,.177,[0,.119,i+.0055],{pixels:[1280,580],background:"#071015"}),s=t.target(r.object,{kind:"screen",label:"Lab recorder",action:"scope-screen",bounds:[]});let o=0,a={},c=[];if(e==="transient")for(const[h,d]of["VOLTAGE","CURRENT","ENERGY"].entries()){const f=-.135+h*.135,g=t.button(d,`recorder-panel:${h}`,f,.013,i,{width:.11,color:"#47565b"}),v=t.screen(.102,.009,[f,.013,i+.0077],{pixels:[1020,90],background:"#47565b",foreground:"#ffffff"});v.object.userData.equipmentTarget=g.userData.equipmentTarget,c.push({text:v,label:d,index:h})}function l(h={}){var x,b,y;a=h;const d=h.parameters||{},f=h.measurement||{};let g=h.graph;e==="transient"&&((x=g==null?void 0:g.panels)!=null&&x.length)&&(o=Math.min(o,g.panels.length-1),g={...g.panels[o],panels:void 0}),s.bounds=Rl(r.canvas.width,r.canvas.height,1).map(M=>({...M,panel:e==="transient"?o:0}));const v=M=>`${M>=0?"+":""}${nn(M,2)}`;let m=[];if(e==="thevenin"&&(m=f.ok?[`${Sd(d.load)}  ·  ${nn(f.voltage,3)} V`,`${nn(f.current*1e3,3)} mA  ·  ${nn(f.power*1e3,3)} mW`]:["CONNECT CIRCUIT"]),e==="superposition"){const M=((b=h.rawGraph)==null?void 0:b.bars)||[];m=[M.slice(0,2).map((w,R)=>`${R?"B":"A"} ${Number.isFinite(w.value)?v(w.value):"—"} mA`).join("  ·  "),`BOTH ${Number.isFinite((y=M[2])==null?void 0:y.value)?v(M[2].value):"—"} mA`]}if(e==="transient"){const M=[f.voltage,f.current*1e3,f.energy*1e3],w=["V","mA","mJ"];m=f.ok?[`${nn(d.time*1e3,3)} ms  ·  ${nn(M[o],3)} ${w[o]}`,`${d.charging?"SOURCE":"RETURN"}  ·  ${nn((d.acquiredTime||0)*1e3,3)} ms acquired`]:["CONNECT CIRCUIT"]}for(const M of c)M.text.draw(o===M.index,(w,R,A)=>{w.fillStyle=o===M.index?"#ecf7ec":"#47565b",w.fillRect(0,0,R,A),w.fillStyle=o===M.index?"#14251d":"#ffffff",Xt(w,M.label,R/2,A/2,{size:A*.88,width:R-20,align:"center"})});const p={recorder:e,playing:d.playing,readings:m};r.draw([g,p],(M,w,R)=>Ed(M,w,R,g,p))}function u(h){return e!=="transient"||!Number.isInteger(h)||h<0||h>2?!1:(o=h,l(a),!0)}return t.finish(),l(),{group:t.group,targets:t.targets,anchors:t.anchors,screen:r,module:e,selectPanel:u,update:l,dispose:t.dispose}}function Px({id:n="power-supply",label:e="DC POWER SUPPLY",parameter:t="equivalentVoltage",fixedValue:i=null,polarity:r=1,positiveTerminal:s="+",negativeTerminal:o="−"}={}){const a=Fi(n),c=a.enclosure(.22,.186,.2);a.text(e,.183,.014,[0,.168,c+5e-4],{size:46}),a.box(.194,.071,.004,a.m.dark,a.group,[0,.124,c],.003);const l=a.screen(.186,.063,[0,.124,c+.0025],{background:"#071612",foreground:"#d8ffe0",pixels:[1116,378]}),u=t==="nortonCurrent",h=i===null?a.dial(u?"Current":"Voltage",t,.059,.059,c,{radius:.014}):null;a.text(i===null?u?"CURRENT":"VOLTAGE":"FIXED",.07,.009,[.057,.083,c+4e-4]),a.socket(o,-.067,.046,c,Gt.black),a.socket(s,-.02,.046,c,Gt.red),a.text("−        +",.09,.011,[-.044,.026,c+5e-4],{size:64});function d(f={}){var y;const g=i??((y=f.parameters)==null?void 0:y[t])??f.value;h==null||h.set(g);const v=f.parameters||{},m=t==="v1"?"a":t==="v2"?"b":null,p=f.module==="superposition"&&m&&v.sourceMode&&v.sourceMode!=="both"&&v.sourceMode!==m,x=p&&v.replacement==="open",b=p?0:Number.isFinite(g)?g*r:g;l.draw([b,t,p,x],(M,w,R)=>{Xt(M,x?"OPEN":`${nn(b,2)} ${u?"mA":"V"}`,w/2,R*.43,{size:R*.72,width:w-48,align:"center"}),Xt(M,x?"DISCONNECTED":p?"SHORT":t==="rail"?"LINKED RAILS":"OUTPUT",w/2,R*.86,{size:R*.17,width:w-40,align:"center"})})}return a.finish(),d(),{group:a.group,targets:a.targets,anchors:a.anchors,update:d,dispose:a.dispose}}function Lx({id:n="generator",label:e="FUNCTION GENERATOR"}={}){const t=Fi(n),i=t.enclosure(.28,.135,.16);t.text(e,.238,.012,[0,.118,i+5e-4],{size:48}),t.box(.167,.086,.004,t.m.dark,t.group,[-.049,.064,i],.003);const r=t.screen(.159,.078,[-.049,.064,i+.0025],{pixels:[954,468],background:"#071612",foreground:"#e5ffe5"}),s=t.dial("Frequency","frequency",.064,.078,i,{radius:.012}),o=t.dial("Amplitude","amplitude",.112,.078,i,{radius:.01});t.text("Hz",.027,.009,[.063,.104,i+7e-4]),t.text("V pk",.032,.009,[.111,.104,i+7e-4]),t.socket("OUT",.082,.028,i,Gt.metal,{bnc:!0}),t.text("SINE OUT",.055,.008,[.082,.011,i+6e-4],{size:45});function a(c={}){const l=c.parameters||{};s.set(l.frequency),o.set(l.amplitude),r.draw([l.frequency,l.amplitude],(u,h,d)=>{Xt(u,`${nn(l.frequency,1)} Hz`,h/2,d*.27,{size:d*.35,width:h-44,align:"center"}),Xt(u,`${nn(l.amplitude,2)} V pk`,h/2,d*.65,{size:d*.33,width:h-44,align:"center"}),Xt(u,"SINE · 0 V OFFSET",h/2,d*.92,{size:d*.1,width:h-40,align:"center"})})}return t.finish(),a(),{group:t.group,targets:t.targets,anchors:t.anchors,update:a,dispose:t.dispose}}function Dx({id:n="resistance-box",label:e="RESISTANCE",parameter:t="load",values:i=Ft[t]}={}){const r=Fi(n),s=r.enclosure(.18,.14,.11),o=String(e).toLowerCase().replace(/[ₜₕₙ]/g,h=>({"ₜ":"t","ₕ":"h","ₙ":"n"})[h]),a=t==="rf"?"Rf":t==="rin"?"Rin":t==="load"?"RL":t==="equivalentResistance"?/norton|rn|r_n|rₙ/.test(o)?"Rn":"Rth":t==="resistance"?"R":e;r.text(a,.144,.032,[0,.116,s+7e-4]);const c=r.dial(a,t,.052,.059,s,{radius:.023,values:i});r.box(.096,.041,.003,r.m.dark,r.group,[-.03,.067,s],.002);const l=r.screen(.09,.035,[-.03,.067,s+.0017],{pixels:[900,350],background:"#e1ead5"});r.socket("A",-.06,.025,s,Gt.red),r.socket("B",-.014,.025,s,Gt.black);function u(h={}){var f;const d=((f=h.parameters)==null?void 0:f[t])??h.value;c.set(d),l.draw(d,(g,v,m)=>Xt(g,Sd(d),v/2,m/2,{size:m*.86,width:v-24,align:"center"}))}return r.finish(),u(),{group:r.group,targets:r.targets,anchors:r.anchors,width:.18,height:.14,update:u,dispose:r.dispose}}function Ix({id:n="experiment-controls",module:e="thevenin"}={}){const t=Fi(n),i=t.enclosure(.56,.34,.16),r=[],s=[],o=["thevenin","superposition","opamp","transient"],a=5+Math.max(0,o.indexOf(e)),c=t.screen(.49,.03,[0,.315,i+7e-4],{pixels:[1470,90],background:Gt.face});function l(m,p,x,b,y){t.text(m,y,.03,[b,.281,i+7e-4]);const M=t.dial(m,p,b,.235,i,{radius:.023,values:x,min:p==="timeCursor"?0:void 0,max:p==="timeCursor"?1:void 0,step:p==="timeCursor"?.001:1});t.box(y,.04,.003,t.m.dark,t.group,[b,.184,i],.002);const w=t.screen(y-.008,.034,[b,.184,i+.0017],{pixels:[Math.round((y-.008)*5e3),170],background:"#e1ead5"});r.push({...M,parameter:p,display:w,label:m})}function u(m,p,x,b,y,M=.04,w="#354b45"){const R=t.button(m,p,x,b,i,{width:y,height:M,color:w}),A=R.userData.equipmentTarget,E=t.screen(y-.008,M-.008,[x,b,i+.0078],{pixels:[Math.round((y-.008)*5e3),160],background:w,foreground:"#f7fff8"});E.object.userData.equipmentTarget=A;const S={object:R,descriptor:A,display:E,color:w,label:m};return s.push(S),S}e==="thevenin"&&l("Circuit","representation",["original","thevenin","norton"],0,.34),e==="superposition"&&(l("Sources","sourceMode",["a","both","b"],-.14,.23),l("Inactive source","replacement",["short","open"],.14,.23)),e==="opamp"&&l("Amplifier","configuration",["inverting","noninverting"],0,.34);let h,d;e==="transient"&&(l("Circuit","kind",["RC","RL"],-.18,.156),l("Speed","speed",Ft.speed,0,.156),l("Time","timeCursor",void 0,.18,.156),h=u("Run","play",-.208,.13,.124,.036),u("Replay","replay",-.069,.13,.124,.036),d=u("Return","switch",.069,.13,.124,.036),u("Reset","reset-energy",.208,.13,.124,.036));const f=u("Build","build",-.18,.077,.156);u("Clear","reset-circuit",0,.077,.156),u("Undo","undo",.18,.077,.156);for(const[m,p]of o.entries())u(`Lab ${5+m}`,`module:${p}`,-.2025+m*.135,.022,.124,.036,p===e?"#e3eee0":"#485658");const g={original:"Original",thevenin:"Thévenin",norton:"Norton",both:"Both",a:"A only",b:"B only",short:"Short",open:"Open",inverting:"Inverting",noninverting:"Non-inverting"};function v(m={}){const p=m.parameters||{},x=m.mode==="build";f.descriptor.action=x?"explore":"build",f.descriptor.label=x?"Explore reference":"Build circuit",f.label=x?"Explore":"Build",c.draw(x,(b,y,M)=>Xt(b,`Lab ${a} · ${x?"Build circuit":"Explore"}`,y/2,M/2,{size:M*.88,width:y-24,align:"center"}));for(const b of r){const y=b.parameter==="timeCursor"?p.time:p[b.parameter];b.parameter==="timeCursor"&&(b.descriptor.max=Math.max(0,p.acquiredTime||0),b.descriptor.step=Math.max(1e-6,b.descriptor.max/100)),b.set(y);const M=b.parameter==="timeCursor"?`${nn((y||0)*1e3,3)} ms`:b.parameter==="speed"?`${nn(y,2)}×`:g[y]||String(y||b.label);b.display.draw(M,(w,R,A)=>Xt(w,M,R/2,A/2,{size:A*.9,width:R-20,align:"center"}))}h&&(h.label=p.playing?"Pause":"Run",h.descriptor.label=h.label),d&&(d.label=p.charging?"Return":"Source",d.descriptor.label=p.charging?"Switch to return loop":"Switch to source");for(const b of s)b.display.draw(b.label,(y,M,w)=>{y.fillStyle=b.color==="#e3eee0"?"#10251b":"#f7fff8",Xt(y,b.label,M/2,w/2,{size:w*.9,width:M-16,align:"center"})})}return t.finish(),v(),{group:t.group,targets:t.targets,anchors:t.anchors,module:e,width:.56,height:.34,update:v,dispose:t.dispose}}function Ux({id:n="probe",color:e=Gt.red,channel:t="red",label:i="Probe",action:r=/ground/i.test(t)?`scope-ground:${t.slice(0,3)}`:`tool:${t}`,ground:s=/ground/i.test(t)}={}){if(s)return Nx({id:n,color:e,channel:t,label:i,action:r});const o=Fi(n),{group:a,m:c}=o,l=o.material(e,{roughness:.76}),u=o.mesh(new ht(.005,.0043,.113,24),l,a,[0,.091,0]);o.mesh(new ht(.0021,.0038,.019,20),l,a,[0,.0255,0]),o.mesh(new ht(75e-5,75e-5,.016,14),c.metal,a,[0,.01,0]),o.mesh(new _l(75e-5,.0025,14),c.metal,a,[0,.00125,0]).rotation.z=Math.PI,o.mesh(new ht(.012,.012,.0027,32),l,a,[0,.036,0]);for(let f=0;f<13;f++)o.mesh(new ht(.0054,.0054,.0015,24),l,a,[0,.048+f*.0064,0]);o.mesh(new ht(.0022,.0045,.024,20),c.rubber,a,[0,.156,0]);for(let f=0;f<5;f++)o.mesh(new ht(.0035-f*25e-5,.0035-f*25e-5,.001,18),c.rubber,a,[0,.149+f*.0035,0]);o.anchor("tip",[0,0,0]),o.anchor("cable",[0,.168,0]);const h=o.target(u,{kind:"probe",id:n,label:i,channel:t,action:r});a.traverse(f=>{f.isMesh&&(f.userData.equipmentTarget=h)});function d(f={}){h.connected=!!f.connected,a.visible=f.visible!==!1}return o.finish(),{group:a,targets:o.targets,anchors:o.anchors,channel:t,length:.168,update:d,dispose:o.dispose}}function Nx({id:n="ground-clip",color:e=Gt.black,channel:t="ch1Ground",label:i="Ground clip",action:r="scope-ground:ch1"}={}){const s=Fi(n),{group:o,m:a}=s,c=s.material(e,{roughness:.86});s.box(.007,.021,.0016,a.metal,o,[0,.01,-.0022],4e-4);const l=s.box(.007,.022,.0016,a.metal,o,[0,.012,.0022],4e-4);l.rotation.x=-.1;for(let f=0;f<5;f++)s.box(.006,.001,.0014,a.metal,o,[0,.003+f*.003,-.001],1e-4),s.box(.006,.001,.0014,a.metal,o,[0,.003+f*.003,.001],1e-4);const u=s.cylinder(.0034,.009,a.metal,o,[0,.021,0],16);u.rotation.y=Math.PI/2;const h=s.box(.011,.025,.01,c,o,[0,.032,0],.003);s.mesh(new ht(.0017,.0032,.009,16),a.rubber,o,[0,.048,0]),s.anchor("tip",[0,0,0]),s.anchor("cable",[0,.053,0]);const d=s.target(h,{kind:"probe",id:n,label:i,channel:t,action:r});return o.traverse(f=>{f.isMesh&&(f.userData.equipmentTarget=d)}),s.finish(),{group:o,targets:s.targets,anchors:s.anchors,channel:t,length:.053,update(f={}){d.connected=!!f.connected,o.visible=f.visible!==!1},dispose:s.dispose}}function _h({points:n=[[0,0,0],[0,.01,-.03],[.02,.01,-.06]],color:e=Gt.black,radius:t=.0018}={}){const i=new jt;i.name="insulated-lead";const r=new wl({color:e,roughness:.82,metalness:0});let s=null,o="",a=!1;function c(l){const h=(Array.isArray(l)?l:(l==null?void 0:l.points)||n).map(Kc);if(h.length<2)return;const d=h.map(v=>v.toArray().map(m=>m.toFixed(5)).join(",")).join(";");if(o===d)return;o=d;const f=new bl(h,!1,"centripetal"),g=new na(f,48,t,7,!1);s?(s.geometry.dispose(),s.geometry=g):(s=new Rn(g,r),s.castShadow=!0,s.receiveShadow=!0,i.add(s))}return c(n),{group:i,targets:[],anchors:{},update:c,dispose(){a||(a=!0,s==null||s.geometry.dispose(),r.dispose(),i.removeFromParent())}}}function Ox({xrManager:n,navigatorXR:e,isSecureContext:t=!0,visibilityTarget:i=null,onStatus:r=()=>{},onBeforeSession:s=()=>{},onSessionStarted:o=()=>{},onSessionEnded:a=()=>{}}){var H,j;let c=!1,l=!1,u=!1,h=!1,d=null,f=!1,g=!1,v=null,m=0,p={kind:"checking",supported:!1,active:!1,message:"Checking headset…"};const x=()=>typeof e=="function"?e():e,b=()=>typeof t=="function"?t():t;function y(G,W){p={kind:G,supported:c,active:l,message:W},h||r({...p})}function M(G="ended"){if(!d&&!f&&!l)return;const W=d,U=f;d=null,f=!1,l=!1,u=!1,U&&a({session:W,floorReference:g,reason:G}),y(c?"ready":"unavailable",c?"VR ready. Enter the lab to connect leads and take readings.":"Open the lab’s HTTPS link in your headset browser.")}const w=()=>M(h?"disposed":"ended");(H=n.addEventListener)==null||H.call(n,"sessionend",w);const R=()=>{S()},A=()=>{(!(i!=null&&i.visibilityState)||i.visibilityState==="visible")&&S()};(j=i==null?void 0:i.addEventListener)==null||j.call(i,"visibilitychange",A);function E(G){var W,U;G!==v&&((W=v==null?void 0:v.removeEventListener)==null||W.call(v,"devicechange",R),v=G,(U=v==null?void 0:v.addEventListener)==null||U.call(v,"devicechange",R))}async function S(){if(h||u||l)return c;const G=++m,W=x();if(E(W),c=!1,!b())return y("unavailable","VR needs HTTPS. Open the lab’s HTTPS link in your headset browser."),!1;if(!(W!=null&&W.isSessionSupported))return y("unavailable","No headset found here. Open the lab’s HTTPS link in your headset browser."),!1;y("checking","Checking headset…");try{const U=await W.isSessionSupported("immersive-vr");if(h||u||l||G!==m)return c;c=!!U,y(c?"ready":"unavailable",c?"VR ready. Enter the lab to connect leads and take readings.":"No headset found here. Open the lab’s HTTPS link in your headset browser.")}catch(U){!h&&!u&&!l&&G===m&&y("unavailable",`VR support could not be checked: ${(U==null?void 0:U.message)||(U==null?void 0:U.name)||"unknown error"}.`)}return c}async function I(){if(h||u)return!1;if(l)return!0;const G=x();if(E(G),!b()||!(G!=null&&G.requestSession))return y("unavailable",b()?"No headset found here. Open the lab’s HTTPS link in your headset browser.":"VR needs HTTPS. Open the lab’s HTTPS link in your headset browser."),!1;u=!0,m++,y("entering","Accept the headset’s request to enter VR.");let W;try{if(W=await G.requestSession("immersive-vr",{optionalFeatures:["local-floor","bounded-floor"]}),h)return await W.end().catch(()=>{}),!1;d=W,g=!1;try{await W.requestReferenceSpace("local-floor"),g=!0}catch{}return n.setReferenceSpaceType(g?"local-floor":"local"),f=!0,s({session:W,floorReference:g}),await n.setSession(W),h||d!==W?(await W.end().catch(()=>{}),!1):(c=!0,l=!0,u=!1,o({session:W,floorReference:g}),y("active","VR active. Grip probes and dials. Left stick moves; right stick turns. Click a stick to return to the bench."),!0)}catch(U){return W&&await W.end().catch(()=>{}),M("error"),u=!1,y("error",(U==null?void 0:U.name)==="NotAllowedError"?"The VR request was declined. Select Try VR again when you are ready.":`VR could not start: ${(U==null?void 0:U.message)||(U==null?void 0:U.name)||"headset unavailable"}. Check the headset and try again.`),!1}}async function F(){if(!d)return!1;const G=d;try{return await G.end(),d===G&&M(h?"disposed":"ended"),!0}catch(W){return y("error",`VR could not exit: ${(W==null?void 0:W.message)||(W==null?void 0:W.name)||"unknown error"}. Use the headset system menu to exit.`),!1}}async function $(){var G,W,U;h||(h=!0,m++,d&&await F(),f&&M("disposed"),(G=v==null?void 0:v.removeEventListener)==null||G.call(v,"devicechange",R),(W=i==null?void 0:i.removeEventListener)==null||W.call(i,"visibilitychange",A),(U=n.removeEventListener)==null||U.call(n,"sessionend",w))}return S(),{enter:I,exit:F,refreshSupport:S,dispose:$,toggle:()=>l?F():I(),get state(){return{...p}},get active(){return l},get entering(){return u},get supported(){return c}}}function Fx(n,e){return{position:n.position.clone(),quaternion:n.quaternion.clone(),scale:n.scale.clone(),near:n.near,far:n.far,fov:n.fov,aspect:n.aspect,zoom:n.zoom,target:e.target.clone(),controlsEnabled:e.enabled}}function kx(n,e,t,i){i&&(t.position.set(0,0,0),t.quaternion.identity(),t.scale.set(1,1,1),n.position.copy(i.position),n.quaternion.copy(i.quaternion),n.scale.copy(i.scale),Object.assign(n,{near:i.near,far:i.far,fov:i.fov,aspect:i.aspect,zoom:i.zoom}),n.updateProjectionMatrix(),e.target.copy(i.target),e.enabled=i.controlsEnabled,e.update(),n.updateMatrixWorld(!0))}function zx(n,e,{floorReference:t=!0,eyeHeight:i=1.6}={}){var u,h;const r=(u=e==null?void 0:e.transform)==null?void 0:u.position,s=(h=e==null?void 0:e.transform)==null?void 0:h.orientation;if(!r||!s||![r.x,r.y,r.z,s.x,s.y,s.z,s.w].every(Number.isFinite))return!1;const o=new gn(s.x,s.y,s.z,s.w).normalize(),a=new L(0,0,-1).applyQuaternion(o),c=Math.hypot(a.x,a.z)>.001?Math.atan2(a.x,-a.z):-new Xn().setFromQuaternion(o,"YXZ").y;n.quaternion.setFromAxisAngle(new L(0,1,0),c);const l=new L(r.x,r.y,r.z).applyQuaternion(n.quaternion);return n.position.set(-l.x,t?0:i-r.y,-l.z),n.updateMatrixWorld(!0),!0}const on=n=>({x:n.x,y:n.y,z:n.z}),$n=(n,e,t)=>({x:n.x+(e.x-n.x)*t,y:n.y+(e.y-n.y)*t,z:n.z+(e.z-n.z)*t}),Ui=(n,e)=>Math.hypot(n.x-e.x,n.z-e.z),nc=(n,e,t=0)=>n.x>e.minX-t&&n.x<e.maxX+t&&n.z>e.minZ-t&&n.z<e.maxZ+t;class Bx{constructor(){xa(this,"items",[]);xa(this,"serial",0)}push(e,t){const i={value:e,score:t,order:this.serial++};let r=this.items.length;for(this.items.push(i);r>0;){const s=r-1>>1;if(this.less(this.items[s],i))break;this.items[r]=this.items[s],r=s}this.items[r]=i}less(e,t){return e.score<t.score||e.score===t.score&&e.order<t.order}pop(){const e=this.items[0],t=this.items.pop();if(this.items.length){let i=0;for(;i*2+1<this.items.length;){let r=i*2+1;if(r+1<this.items.length&&this.less(this.items[r+1],this.items[r])&&r++,this.less(t,this.items[r]))break;this.items[i]=this.items[r],i=r}this.items[i]=t}return e==null?void 0:e.value}}function Jc(n){const e=[n[0]];for(let t=1;t<n.length-1;t++){const i=n[t-1],r=n[t],s=n[t+1];Math.abs((r.x-i.x)*(s.z-r.z)-(r.z-i.z)*(s.x-r.x))>1e-8&&e.push(r)}return n.length>1&&e.push(n.at(-1)),e}function Yo(n,e){if(n.length<3)return n.map(on);const t=[on(n[0])];for(let i=1;i<n.length-1;i++){const r=n[i-1],s=n[i],o=n[i+1],a=Ui(r,s),c=Ui(s,o);if(a<1e-6||c<1e-6){t.push(on(s));continue}const l=Math.min(e,a*.3,c*.3),u=$n(s,r,l/a),h=$n(s,o,l/c);t.push(u);for(const d of[.25,.5,.75])t.push($n($n(u,s,d),$n(s,h,d),d));t.push(h)}return t.push(on(n.at(-1))),t}function Qc(n,e,{bounds:t,obstacles:i=[],step:r,padding:s,reserved:o=new Map,preferred:a=null}){const c=Math.floor(t.minX/r)*r,l=Math.floor(t.minZ/r)*r,u=Math.ceil((t.maxX-c)/r)+1,h=Math.ceil((t.maxZ-l)/r)+1,d=F=>({x:Math.max(0,Math.min(u-1,Math.round((F.x-c)/r))),z:Math.max(0,Math.min(h-1,Math.round((F.z-l)/r)))}),f=(F,$)=>$*u+F,g=F=>({x:c+F%u*r,y:0,z:l+Math.floor(F/u)*r}),v=d(n),m=d(e),p=f(v.x,v.z),x=f(m.x,m.z),b=F=>{if(F===p||F===x)return!1;const $=g(F);return i.some(H=>nc($,H,s)&&!(nc(n,H,s)&&Ui($,n)<r*1.8)&&!(nc(e,H,s)&&Ui($,e)<r*1.8))},y=F=>(Math.abs(g(F).x-g(x).x)+Math.abs(g(F).z-g(x).z))/r,M=new Bx,w=new Map([[p,0]]),R=new Map,A=new Map,E=new Set;for(M.push(p,y(p));M.items.length;){const F=M.pop();if(E.has(F))continue;if(F===x)break;E.add(F);const $=F%u,H=Math.floor(F/u);for(const[j,[G,W]]of[[1,0],[0,1],[-1,0],[0,-1]].entries()){const U=$+G,de=H+W;if(U<0||de<0||U>=u||de>=h)continue;const oe=f(U,de);if(E.has(oe)||b(oe))continue;const J=g(oe),We=o.get(`${U},${de}`)||0,at=Math.min(J.x-t.minX,t.maxX-J.x,J.z-t.minZ,t.maxZ-J.z),Fe=a==="perimeter"?Math.max(0,at/r)*.2:0,pt=A.has(F)&&A.get(F)!==j?.32:0,te=w.get(F)+1+We*14+pt+Fe;te>=(w.get(oe)??1/0)||(w.set(oe,te),R.set(oe,F),A.set(oe,j),M.push(oe,te+y(oe)))}}if(p!==x&&!R.has(x))return null;const S=[x];for(;S.at(-1)!==p;)S.push(R.get(S.at(-1)));S.reverse();const I=S.map(g);return I[0]=on(n),I[I.length-1]=on(e),{points:I,cells:S.map(F=>({x:F%u,z:Math.floor(F/u)})),cols:u,rows:h}}function Vx(n,e,t,i,r){const s=t.maxZ+i;return[on(n),{x:n.x,y:r,z:n.z},{x:n.x,y:r,z:s},{x:e.x,y:r,z:s},{x:e.x,y:r,z:e.z},on(e)]}function Hx(n,{obstacles:e=[],bounds:t={minX:-1.64,maxX:1.64,minZ:-.94,maxZ:.94},step:i=.045,floor:r=.95}={}){const s=new Map,o=new Map,a=new Map,c=[...n].sort((l,u)=>Ui(l.start,l.end)-Ui(u.start,u.end)||l.id.localeCompare(u.id));for(const l of c){const{start:u,end:h}=l,d=Qc(u,h,{bounds:t,obstacles:e,step:i,padding:i*1.15,reserved:s});if(!d){const w=Math.max(u.y,h.y,...e.map(R=>R.top||r))+.06;a.set(l.id,Yo(Vx(u,h,t,i,w),i));continue}const f=new Set;for(const w of d.cells.slice(2,-2))for(const R of o.get(`${w.x},${w.z}`)||[])f.add(R);let g=0;for(;f.has(g);)g++;const v=r+g*.027;for(const[w,R]of d.cells.entries())if(w>1&&w<d.cells.length-2){const A=`${R.x},${R.z}`;o.set(A,[...o.get(A)||[],g]);for(let E=-1;E<=1;E++)for(let S=-1;S<=1;S++){const I=`${R.x+E},${R.z+S}`;s.set(I,(s.get(I)||0)+(E||S?.45:1))}}const m=Jc(d.points.map(w=>({...w,y:v}))),p=Yo(m,i*.75),x=p[1]||p[0],b=p.at(-2)||p.at(-1),y=$n({...u,y:v},x,Math.min(.1/Math.max(Ui(u,x),1e-6),.3)),M=$n({...h,y:v},b,Math.min(.1/Math.max(Ui(h,b),1e-6),.3));a.set(l.id,[on(u),y,...p.slice(1,-1),M,on(h)])}return a}function Gx(n,e,{lane:t=0,bounds:i={minX:-.6,maxX:.6,minZ:-1.15,maxZ:-.38},obstacles:r=[],floor:s=.833,boardTop:o=.874,exit:a={x:0,y:0,z:1},branch:c=!1}={}){const l=A=>({...A,y:A.x>i.minX&&A.x<i.maxX&&A.z>i.minZ&&A.z<i.maxZ?o:s});if(c){const A=$n(n,e,.5);A.y=Math.max(o+.025,Math.min(n.y,e.y)-.025),A.x+=(t%2?-1:1)*.025;const E=Math.min(n.y,e.y,A.y);if(!r.some(H=>(H.top||o)>E-.005&&Math.max(n.x,A.x,e.x)+.035>H.minX&&Math.min(n.x,A.x,e.x)-.035<H.maxX&&Math.max(n.z,e.z)+.035>H.minZ&&Math.min(n.z,e.z)-.035<H.maxZ)&&Ui(n,e)<.25)return[on(n),$n(n,A,.35),A,$n(A,e,.65),on(e)];const I={minX:Math.min(i.minX-.04,n.x-.04,e.x-.04),maxX:Math.max(i.maxX+.04,n.x+.04,e.x+.04),minZ:Math.min(i.minZ-.04,n.z-.04,e.z-.04),maxZ:Math.max(i.maxZ+.04,n.z+.04,e.z+.04)},F=Qc(n,e,{bounds:I,obstacles:r,step:.016,padding:.025});if(F){const H=Yo(Jc(F.points.map(j=>({...j,y:o+.025}))),.018);return H.length===2&&H.splice(1,0,$n(H[0],H[1],.5)),H[0]=on(n),H[H.length-1]=on(e),H}const $=Math.max(n.y,e.y,...r.map(H=>H.top||o))+.06;return[on(n),{...n,y:$},{...$n(n,e,.33),y:$},{...$n(n,e,.67),y:$},{...e,y:$},on(e)]}const u=.045+t*.014,h=i.maxZ+u,d=n.x<(i.minX+i.maxX)/2?i.minX-u:i.maxX+u,f={x:n.x+a.x*.045,y:n.y+a.y*.045,z:n.z+a.z*.045},g=Math.abs(a.z)>=Math.abs(a.x),v=(Math.max(0,n.y-s)*Math.max(0,a.y)+.035)/Math.max(Math.abs(a.z),.25),m=g?a.z>=0?Math.max(h,n.z+v):Math.min(h,n.z-v):h,p={x:d,y:s,z:m},x={minX:Math.min(i.minX-u,e.x-.035),maxX:Math.max(i.maxX+u,e.x+.035),minZ:Math.min(i.minZ-u,e.z-.035),maxZ:Math.max(h+.035,m+.035,e.z+.035)},b=l(e),y=Qc(p,b,{bounds:x,obstacles:r,step:.018,padding:.011,preferred:"perimeter"}),M=Math.max(e.y,...r.map(A=>A.top||s))+.04,w=y?Jc(y.points.map(l)):[{...p,y:M},{...b,y:M}],R=[on(n),f,{x:f.x,y:s,z:m},p,...w,{...on(e),y:Math.max(o+.025,e.y-.03)},on(e)];return Yo(R.filter((A,E)=>E===0||Math.hypot(A.x-R[E-1].x,A.y-R[E-1].y,A.z-R[E-1].z)>1e-5),.028)}function xh(n,e,t){return`wire:${[n,e].sort().join("|")}:${t}`}function yh(n,e){return n==="gnd"?{x:-1.1+e%8*.3,z:.79-Math.floor(e/8)*.16}:n==="out"?{x:.53+e%3*.27,z:-.22-Math.floor(e/3)*.18}:null}function Wx(){const n=new Map;function e(t,i){const r=[...new Set(i)].sort((a,c)=>+!a.startsWith("wire:")-+!c.startsWith("wire:")||a.localeCompare(c));let s=n.get(t);s||(s=new Map,n.set(t,s));for(const a of s.keys())r.includes(a)||s.delete(a);const o=new Set(s.values());for(const a of r){if(s.has(a))continue;let c=0;for(;o.has(c);)c++;s.set(a,c),o.add(c)}return s}return{resolve(t,i,r){const s=e(t,i?[...r,i]:r);return i?s.get(i):0},prefer(t,i,r,s){const o=e(t,[...s,i]);return Number.isInteger(r)&&r>=0&&![...o].some(([a,c])=>a!==i&&c===r)&&o.set(i,r),o.get(i)},clear(){n.clear()}}}function $x({container:n,onTerminal:e=()=>{},onWire:t=()=>{},onAction:i=()=>{},onPart:r=()=>{},onHover:s=()=>{},onPanelPreviewChange:o=()=>{},onXRStatus:a=()=>{},onFrame:c=()=>{},onChange:l=()=>{},onProbe:u=()=>{},onConnect:h=()=>{},onDisconnect:d=()=>{},onWireMove:f=()=>{},onGraphCursor:g=()=>{},onManipulation:v=()=>{}}){const m=new Lp;m.background=new Mt("#c6c9c9"),m.fog=new ml("#c6c9c9",14,30);const p=new Kn(39,1,.05,35),x=new sx({antialias:!0,alpha:!1});x.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),x.setClearColor("#c6c9c9"),x.outputColorSpace=wn,x.toneMapping=kh,x.toneMappingExposure=1,x.shadowMap.enabled=!0,x.shadowMap.type=Oh,x.shadowMap.autoUpdate=!1,x.shadowMap.needsUpdate=!0,x.xr.enabled=!0,x.xr.setFoveation(0),x.domElement.setAttribute("aria-label","Circuit lab. Drag probe tips onto terminals. Drag a terminal to another terminal to connect a lead; pull a plug out to disconnect it. Drag equipment knobs to turn them. Click switches and drag across the scope screen. Drag empty space to look around and scroll to zoom."),x.domElement.style.touchAction="none",n.appendChild(x.domElement);const b=new ax(p,x.domElement);b.enableDamping=!0,b.dampingFactor=.09,b.minDistance=.55,b.maxDistance=12,b.minPolarAngle=.08,b.maxPolarAngle=Math.PI*.47,b.enablePan=!0;const y=new jt;m.add(y),y.add(p);const M=new L(.8,.883,-.1),w=new gn().setFromEuler(new Xn(-.62,-Math.atan2(.8,.1),0,"YXZ")),R=new L(-.8,.895,-.1),A=new gn().setFromEuler(new Xn(-.62,Math.atan2(.8,.1),0,"YXZ")),E=1.35,S=new L(-.25,3,3.25).normalize(),I=new L(0,.97,-.77);let F=0;function $(){if(x.xr.isPresenting)return;y.position.set(0,0,0),p.aspect=Math.max(1,n.clientWidth)/Math.max(1,n.clientHeight),p.updateProjectionMatrix(),b.target.copy(I);let _=4.5;const P=[];for(const N of[-.97,.97])for(const z of[.81,1.16])for(const O of[-1.3,-.31])P.push(new L(N,z,O));for(const N of[-.3,.3])for(const z of[0,.35])for(const O of[-.1,.1])P.push(new L(N,z,O).applyQuaternion(w).add(M));for(const N of[-.32,.32])for(const z of[0,.36])for(const O of[-.13,.13])P.push(new L(N,z,O).applyQuaternion(A).add(R));for(const N of[-1.22,-.55,.55,1.22])for(const z of[-.46,.25])P.push(new L(N,.82,z));for(let N=0;N<7;N++){p.position.copy(b.target).addScaledVector(S,_),p.lookAt(b.target),p.updateMatrixWorld();const z=P.map(it=>it.clone().project(p)),O=Math.min(...z.map(it=>it.x)),B=Math.max(...z.map(it=>it.x)),re=Math.min(...z.map(it=>it.y)),me=Math.max(...z.map(it=>it.y)),ve=Math.max((B-O)/1.72,(me-re)/1.72),Te=_*Math.tan(vn.degToRad(p.fov/2)),ot=new L().setFromMatrixColumn(p.matrixWorld,0),_t=new L().setFromMatrixColumn(p.matrixWorld,1);b.target.addScaledVector(ot,(O+B)*.5*Te*p.aspect),b.target.addScaledVector(_t,(re+me)*.5*Te),_*=Math.max(.78,Math.min(1.3,ve))}p.position.copy(b.target).addScaledVector(S,_),p.lookAt(b.target),F=p.aspect,b.update()}$(),m.add(new vm("#ffffff","#777b79",1.35));const H=new Fu("#fffdf8",2.7);H.position.set(-3,7,3),H.castShadow=!0,H.shadow.mapSize.set(2048,2048),Object.assign(H.shadow.camera,{left:-4,right:4,top:4,bottom:-4,near:.1,far:16}),H.shadow.normalBias=.004,m.add(H);const j=new Fu("#eef2f4",.65);j.position.set(4,3,-4),m.add(j);const G={navy:"#2b2c2d",teal:"#414646",brass:"#b59a60",metal:"#b9baba",board:"#246648",copper:"#ad653c"},W=(_,P={})=>new wl({color:_,roughness:.56,metalness:.08,...P}),U={navy:W(G.navy),teal:W(G.teal),metal:W(G.metal,{metalness:.7,roughness:.3}),brass:W(G.brass,{metalness:.65,roughness:.3}),copper:W(G.copper,{metalness:.65,roughness:.3}),board:W(G.board,{roughness:.58}),pale:W("#b9bcb8"),black:W("#171819",{roughness:.72}),resistor:W("#c8b082",{roughness:.74}),trace:W("#3f7952",{roughness:.68}),solder:W("#bfc3c0",{metalness:.82,roughness:.34}),red:W("#922724",{roughness:.67}),mat:W("#353b3d",{roughness:.95}),pcbEdge:W("#73764e",{roughness:.92})},de=new Set(Object.values(U)),oe=new jt;oe.position.set(0,.52,-.77),oe.scale.setScalar(.36),m.add(oe);const J=(_,P,N,z=0,O=0,B=0)=>{const re=new Rn(_,P);return re.position.set(z,O,B),re.castShadow=!0,re.receiveShadow=!0,N.add(re),re},We=(_,P,N,z=.035)=>new ra(_,P,N,3,z);J(We(3.65,.025,2.32,.018),U.mat,oe,0,.843),J(We(3.32,.022,2.02,.018),U.pcbEdge,oe,0,.907),J(We(3.319,.007,2.019,.018),U.board,oe,0,.921);for(const _ of[-1.54,1.54])for(const P of[-.89,.89])J(new ht(.024,.024,.055,6),U.brass,oe,_,.88,P),J(new ht(.04,.04,.004,24),U.metal,oe,_,.929,P),J(new ht(.023,.023,.009,24),U.solder,oe,_,.934,P),J(new qt(.029,.0015,.005),U.black,oe,_,.94,P),J(new qt(.005,.0015,.029),U.black,oe,_,.94,P);const at=J(new Ii(80,80),W("#b9bcba",{roughness:.94}),m,0,.815,0);at.rotation.x=-Math.PI/2,at.visible=!1,at.castShadow=!1;const Fe=new jt;Fe.visible=!0,m.add(Fe);const pt=J(new Ii(14,14),W("#a5a8a5",{roughness:.96}),Fe,0,-.003,-1.4);pt.rotation.x=-Math.PI/2,pt.castShadow=!1;const te=J(new Ii(10,3.4),W("#d2d3cd",{roughness:.94}),Fe,0,1.7,-5.1);te.castShadow=!1,J(new qt(10,.1,.025),W("#9c9f9b",{roughness:.84}),Fe,0,.05,-5.08);const ce=J(We(2.12,.04,1.42,.009),W("#a7aaa5",{roughness:.83}),Fe,0,.8,-.985);for(const _ of[-.91,.91])for(const P of[-1.57,-.4])J(new qt(.055,.765,.055),W("#858b8c",{metalness:.62,roughness:.43}),Fe,_,.3975,P),J(new ht(.04,.04,.027,20),U.black,Fe,_,.0135,P);for(const _ of[-1.57,-.4])J(new qt(1.85,.065,.035),U.metal,Fe,0,.729,_);for(const _ of[-.91,.91])J(new qt(.035,.065,1.2),U.metal,Fe,_,.729,-.985);J(We(.67,.04,.525,.004),ce.material,Fe,.885,.8,-.0125),J(We(.16,.04,.185,.004),ce.material,Fe,1.14,.8,-.3675);for(const _ of[-.37,.16])J(new qt(.045,.765,.045),U.metal,Fe,1.16,.3975,_),J(new ht(.034,.034,.027,20),U.black,Fe,1.16,.0135,_);J(new qt(.58,.065,.035),U.metal,Fe,.87,.729,.16);const Ae=new jt;Ae.position.copy(M),Ae.quaternion.copy(w),Fe.add(Ae),J(We(.6,.012,.195,.006),U.metal,Ae,0,-.01,0);for(const _ of[-.23,.23])for(const P of[-.066,.066]){const N=new L(_,-.018,P).applyQuaternion(w).add(M),z=Math.max(.01,N.y-.821);J(new ht(.008,.008,z,16),U.metal,Fe,N.x,.821+z/2,N.z),J(new ht(.019,.019,.003,20),U.black,Fe,N.x,.822,N.z)}J(We(.67,.04,.71,.004),ce.material,Fe,-.885,.8,-.105);for(const _ of[-.37,.16])J(new qt(.045,.765,.045),U.metal,Fe,-1.16,.3975,_),J(new ht(.034,.034,.027,20),U.black,Fe,-1.16,.0135,_);J(new qt(.58,.065,.035),U.metal,Fe,-.87,.729,.16);const qe=new jt;qe.position.copy(R),qe.quaternion.copy(A),Fe.add(qe),J(We(.64,.012,.27,.006),U.metal,qe,0,-.01,0);for(const _ of[-.24,.24])for(const P of[-.1,.1]){const N=new L(_,-.018,P).applyQuaternion(A).add(R),z=Math.max(.01,N.y-.821);J(new ht(.008,.008,z,16),U.metal,Fe,N.x,.821+z/2,N.z),J(new ht(.019,.019,.003,20),U.black,Fe,N.x,.822,N.z)}function Be(_,P,N,z){const O=document.createElement("canvas");O.width=_,O.height=P;const B=O.getContext("2d"),re=new qc(O);re.colorSpace=wn,re.anisotropy=Math.min(x.capabilities.getMaxAnisotropy(),16),re.magFilter=ai,re.minFilter=Zi,re.generateMipmaps=!0;const me=new Zn({map:re,transparent:!0,side:gi,depthWrite:!1,toneMapped:!1}),ve=new Rn(new Ii(N,z),me);return{canvas:O,context:B,texture:re,object:ve}}function Ze(_,P,N,z,O){const B=String(P??"");if(_.measureText(B).width<=O){_.fillText(B,N,z);return}let re=B;for(;re.length&&_.measureText(`${re}…`).width>O;)re=re.slice(0,-1);_.fillText(`${re}…`,N,z)}function It(_,P,N,z,O,B,re=3){const me=String(P??"").split(/\s+/);let ve="",Te=0;for(let ot=0;ot<me.length;ot++){const _t=ve?`${ve} ${me[ot]}`:me[ot];if(_.measureText(_t).width>O&&ve){if(_.fillText(ve,N,z+Te*B),ve=me[ot],Te++,Te===re-1)return Ze(_,me.slice(ot).join(" "),N,z+Te*B,O),Te+1}else ve=_t}return ve&&_.fillText(ve,N,z+Te*B),Te+1}function k(_,P="",N=.44,z=.14){const O=Be(512,160,N,z),B=(re,me)=>{const ve=O.context;ve.clearRect(0,0,512,160),ve.textAlign="center",ve.fillStyle="#ffffff",ve.font=me?"600 72px monospace":"600 104px monospace",Ze(ve,re,256,me?67:113,496),ve.fillStyle="#f0f4ed",ve.font="600 59px monospace",Ze(ve,me,256,142,496),O.texture.needsUpdate=!0};return B(_,P),O.object.rotation.x=-Math.PI/2,{...O,draw:B}}const fe=k("TRAINER PCB","DC / ANALOG",.68,.15);fe.object.position.set(-1.11,.932,-.84),oe.add(fe.object);const ue=k("ELEN 221","PATCH TERMINALS",.45,.13);ue.object.position.set(1.17,.932,-.86),oe.add(ue.object);const ie=new jt,ae=new jt,Ee=new jt;oe.add(ie,ae),m.add(Ee);const pe=new Map,Se=Wx(),Qe=new Map;let nt=[],D=[],T=[],Z=[];const ee=[],he=[],ne=new Map,ke=new Set,be=new jt;m.add(be);let Ge="",Ve="vdc",Y={components:[],wires:[],actions:[],live:{title:"Circuit bench",lines:[]}},De="",et="",Xe="",Re="",lt="",V=null,xe="",Me=!1,Ne=null,ge="graph",le="",ze=null,st=0,xt=!1;function yt(_){_.traverse(P=>{var z,O;(z=P.geometry)==null||z.dispose();const N=Array.isArray(P.material)?P.material:P.material?[P.material]:[];for(const B of N)de.has(B)||((O=B.map)==null||O.dispose(),B.dispose())}),_.clear()}function fn(_,P,N,z,O=32){return J(new na(new bl(_),O,P,7,!1),N,z)}function Vn(_,P,N){J(new ht(.027,.027,.003,24),U.copper,_,P,.929,N),J(new ht(.018,.023,.008,24),U.solder,_,P,.934,N),J(new ht(.005,.005,.001,12),U.black,_,P,.939,N)}function js(_,P,N,z,O,B,re=0,me="#dddcd4"){const ve=Be(512,256,z,O),Te=ve.context;return Te.fillStyle=me,Te.textAlign="center",Te.font="600 76px monospace",Ze(Te,P,256,112,490),Te.font="48px monospace",Ze(Te,N,256,190,490),ve.texture.needsUpdate=!0,ve.object.rotation.x=-Math.PI/2,ve.object.position.set(0,B,re),_.add(ve.object),ve}const ei=["#171718","#65432b","#922a25","#bb6726","#d7c24c","#3d6542","#31516d","#725475","#797b79","#dddcd0"];function Tr(_){const P=String(_).match(/([\d.]+)\s*(k|M)?/),N=P?Number(P[1])*(P[2]==="k"?1e3:P[2]==="M"?1e6:1):1e3,z=Math.floor(Math.log10(Math.max(N,.01)))-1,O=Math.round(N/10**z),B=z===-1?"#ac9456":z===-2?"#aeb1ae":ei[Math.max(0,Math.min(9,z))];return[ei[Math.floor(O/10)],ei[O%10],B,"#b09a60"]}function ui(_){var P;if(_.type==="ground")return"GND";if(_.type==="C")return"C1";if(_.type==="L")return"L1";if(_.type==="opamp")return"U1";if(_.type==="switch")return"S1";if(_.type==="R"){const N={load:"RL",rin:"Rin",rf:"Rf",r:"R",r1:"R1",r2:"R2"}[_.id];if(N)return N;if(_.id==="req")return((P=Y.parameters)==null?void 0:P.representation)==="norton"?"Rn":"Rth"}return String(_.label).replace("DC SOURCE","DC SUPPLY").replace("REFERENCE","GND")}function Zs(_){return Y.module==="thevenin"?{load:"load",req:"equivalentResistance"}[_.id]:Y.module==="opamp"?{rin:"rin",rf:"rf"}[_.id]:Y.module==="transient"&&_.id==="r"?"resistance":null}function hi(_,P=he){for(const z of _.targets)if(z.object.userData.direct=z,z.kind==="dial"){const O=new Rn(new Ri(.022,12,8),new Zn({transparent:!0,opacity:0,depthWrite:!1}));O.userData.direct=z,z.object.add(O),z.pickSleeve=O}const N=_.dispose;return _.dispose=()=>{for(const z of _.targets)z.pickSleeve&&(z.pickSleeve.geometry.dispose(),z.pickSleeve.material.dispose(),z.pickSleeve.removeFromParent(),z.pickSleeve=null);N()},P.push(_),_}function ds(_,P,N,z=-.53){return hi(_,ee),_.group.scale.setScalar(1/.36),_.group.rotation.x=z,P.add(_.group),P.updateWorldMatrix(!0,!0),(_.anchors["+"]?[_.anchors["+"],_.anchors["−"]]:_.anchors.A?[_.anchors.A,_.anchors.B]:Object.values(_.anchors).slice(0,2)).forEach(B=>N.push(P.worldToLocal(B.getWorldPosition(new L)))),_.anchors.OUT&&N.length===1&&N.push(N[0].clone().add(new L(.007/.36,0,0))),_.update({...Y,meterMode:Ve}),_}function Ar(_){var P,N,z;for(const O of ee)O.dispose();ee.length=0,yt(ie),pe.clear(),Qe.clear(),nt=[],D=[];for(const O of _){const B=new jt;B.position.set(O.x,.955,O.z),["V","I"].includes(O.type)&&B.position.set(((P=O.benchPosition)==null?void 0:P[0])??Math.sign(O.x||-1)*2.15,.842,((N=O.benchPosition)==null?void 0:N[1])??O.z),ie.add(B);const re=O.pins||[];re.length===2&&["R","L","C"].includes(O.type)&&(B.rotation.y=-Math.atan2(re[1].z-re[0].z,re[1].x-re[0].x));const me=[];let ve=()=>{};switch(O.type){case"R":{const Ie=Zs(O);if(Ie){B.rotation.y=0;const Pe=ds(Dx({id:O.id,label:ui(O),parameter:Ie}),B,me,-.18);ve=()=>Pe.update(Y);break}const we=[[.014,-.13],[.026,-.115],[.035,-.098],[.034,-.073],[.032,-.045],[.032,.045],[.034,.073],[.035,.098],[.026,.115],[.014,.13]],je=J(new El(we.map(([Pe,ut])=>new ye(Pe,ut)),32),U.resistor,B,0,.046);je.rotation.z=Math.PI/2;const Ue=[];for(const[Pe,ut]of[-.079,-.035,.011,.085].entries()){const Nt=Pe===0||Pe===3?.0354:.0328,Pt=J(new ht(Nt,Nt,.014,32),W(Tr(O.value)[Pe],{roughness:.74}),B,ut,.046);Pt.rotation.z=Math.PI/2,Ue.push(Pt)}ve=Pe=>Tr(Pe).forEach((ut,Nt)=>Ue[Nt].material.color.set(ut)),me.push(new L(-.13,.046,0),new L(.13,.046,0));break}case"C":{const Ie=document.createElement("canvas");Ie.width=768,Ie.height=512;const we=Ie.getContext("2d");we.fillStyle="#202427",we.fillRect(0,0,768,512),we.fillStyle="#c6c9be",we.fillRect(145,0,110,512),we.fillStyle="#333835",we.font="bold 82px monospace",we.textAlign="center";for(const Ue of[105,245,385])we.fillText("−",200,Ue);we.fillStyle="#d2d4c8",we.font="bold 78px monospace",we.fillText("100µF",520,165),we.fillText("25V",520,285),we.font="48px monospace",we.fillText("105°C",520,391);const je=new qc(Ie);je.colorSpace=wn,J(new ht(.07,.07,.166,48),W("#ffffff",{map:je,roughness:.67}),B,0,.094),J(new ht(.064,.064,.008,48),U.metal,B,0,.181),J(new Yi(.065,.005,8,48),U.metal,B,0,.184).rotation.x=-Math.PI/2;for(const Ue of[Math.PI/4,-Math.PI/4]){const Pe=J(new qt(.1,.0015,.003),U.navy,B,0,.186);Pe.rotation.y=Ue}J(new ht(.061,.061,.013,32),U.black,B,0,.007),me.push(new L(-.03,.003,0),new L(.03,.003,0));break}case"L":{J(new ht(.03,.03,.29,24),U.black,B,0,.06).rotation.z=Math.PI/2;for(const we of[-.145,.145])J(new ht(.058,.058,.015,32),U.black,B,we,.06).rotation.z=Math.PI/2;const Ie=[];for(let we=0;we<=560;we++){const je=we/560*Math.PI*28;Ie.push(new L(-.131+we/560*.262,.06+Math.sin(je)*.041,Math.cos(je)*.041))}fn(Ie,.0077,U.copper,B,560),me.push(new L(-.151,.052,0),new L(.151,.052,0));break}case"opamp":{const Ie=new ud;Ie.moveTo(-.083,-.135),Ie.lineTo(-.027,-.135),Ie.absarc(0,-.135,.027,Math.PI,0,!0),Ie.lineTo(.083,-.135),Ie.lineTo(.083,.135),Ie.lineTo(-.083,.135),Ie.closePath();const we=J(new Sl(Ie,{depth:.052,bevelEnabled:!0,bevelSegments:2,steps:1,bevelSize:.003,bevelThickness:.003}),U.black,B,0,.079);we.rotation.x=Math.PI/2;for(const Ue of[-.105,.105])for(const Pe of[-.099,-.033,.033,.099]){J(new qt(.056,.009,.019),U.metal,B,Ue,.036,Pe),J(new qt(.009,.052,.019),U.metal,B,Math.sign(Ue)*.133,.01,Pe);const ut=new L(Math.sign(Ue)*.133,-.02,Pe).add(B.position);Vn(ie,ut.x,ut.z)}J(new ht(.009,.009,.001,16),W("#85877f"),B,-.052,.084,-.103),js(B,"OP AMP","DIP-8",.115,.143,.084,.024);const je={"op+":[-.133,-.016,.033],"op-":[-.133,-.016,-.033],out:[.133,-.016,.033],vp:[.133,-.016,-.033],vn:[-.133,-.016,.099]};re.forEach(Ue=>me.push(new L(...je[Ue.id]||[0,0,0])));break}case"switch":{J(We(.155,.056,.13,.004),U.black,B,0,.015),J(new qt(.167,.01,.143),U.metal,B,0,.049),J(new ht(.036,.036,.044,32),U.metal,B,0,.075),J(new ht(.049,.049,.017,6),U.metal,B,0,.074),J(new Yi(.037,.003,6,32),U.navy,B,0,.092).rotation.x=-Math.PI/2;const Ie=new jt;Ie.position.y=.09,B.add(Ie),J(new ht(.011,.013,.125,20),U.metal,Ie,0,.06),J(new Ri(.014,20,12),U.metal,Ie,0,.123),ve=we=>{Ie.rotation.x=String(we).toUpperCase().includes("RETURN")?.39:-.39},ve(O.value),me.push(new L(-.046,-.012,-.047),new L(.056,-.012,0),new L(-.046,-.012,.047));for(const we of me)J(new qt(.022,.025,.011),U.brass,B,we.x,we.y,we.z);break}case"ground":{me.push(new L(0,-.021,0));break}default:{let Ie="equivalentVoltage",we=null,je=1;Y.module==="thevenin"?((z=Y.parameters)==null?void 0:z.representation)==="original"?we=12:O.type==="I"&&(Ie="nortonCurrent"):Y.module==="superposition"?(Ie=O.id==="a"?"v1":"v2",je=O.id==="b"?-1:1):Y.module==="opamp"?Ie="rail":we=5;const Ue=O.id==="signal"?Lx({id:O.id}):Px({id:O.id,label:ui(O),parameter:Ie,fixedValue:we,polarity:je});ds(Ue,B,me),ve=()=>Ue.update(Y);break}}const Te=Y.module==="opamp"&&O.type==="ground",ot=k(ui(O),Te?"":O.value,Te?.4:.5,.16),it=re.length===2&&Math.abs(re[1].z-re[0].z)>Math.abs(re[1].x-re[0].x)?Math.max(...re.map(Ie=>Ie.z))+.22:O.z+(O.type==="switch"?.4:.22);if(ot.object.position.set(Te?1.32:O.x,.933,Te?.79:it),ie.add(ot.object),Qe.set(O.id,{value:O.value,label:O.label,draw:(Ie,we)=>ot.draw(ui(O),Te?"":we),body:B,type:O.type,updateHardware:ve}),O.type!=="ground"){const Ie=["V","I"].includes(O.type)?[.46,.19,.34]:O.type==="C"?[.18,.23,.18]:O.type==="L"?[.35,.15,.17]:O.type==="opamp"?[.3,.12,.32]:O.type==="switch"?[.2,.23,.21]:[.3,.11,.12],we=new qt(...Ie),je=J(we,new Zn({transparent:!0,opacity:0,depthWrite:!1}),B,0,Ie[1]/2-.025,0);je.castShadow=!1,je.receiveShadow=!1,je.userData={kind:"part",id:O.id,label:`${ui(O)} · ${O.value}`,type:O.type},O.type==="switch"&&(je.userData.direct={object:je,kind:"switch",id:O.id,label:"Source / Return",action:"switch"});const Ue=new Np(new Op(we),new Wo({color:"#cfb862",transparent:!0,opacity:.85}));Ue.position.copy(je.position),Ue.visible=!1,B.add(Ue),Qe.get(O.id).outline=Ue,Qe.get(O.id).hit=je,D.push(je)}for(const[Ie,we]of re.entries()){const Ue=(me[Ie]||new L(0,0,0)).clone().applyAxisAngle(new L(0,1,0),B.rotation.y).add(B.position),Pe=new L(we.x-Ue.x,0,we.z-Ue.z).normalize(),ut=Ue.clone().addScaledVector(Pe,["R","L"].includes(O.type)?.052:.014);if(ut.y=.938,["V","I"].includes(O.type)){const Ht=new L(we.x,.995,we.z),Kt=Ue.clone().lerp(Ht,.5);Kt.y=Math.max(.95,Kt.y),fn([Ue,Ue.clone().lerp(Kt,.3),Kt,Ht],.008,Ie===0?U.red:U.black,ie,24)}else if(O.type!=="ground"){Ue.distanceTo(ut)>.006&&fn([Ue,Ue.clone().lerp(ut,.55).add(new L(0,.006,0)),ut],.006,U.metal,ie,14),Vn(ie,ut.x,ut.z);const Ht=new L(we.x,.929,we.z),Kt=ut.clone().lerp(Ht,.5);Kt.y=.929,fn([new L(ut.x,.929,ut.z),Kt,Ht],.007,U.trace,ie,12)}const Nt=["V","I","C"].includes(O.type)&&Ie===0||we.label==="5 V"||we.label==="V+",Pt=Y.module==="opamp"&&["gnd","out"].includes(we.id),Qt={x:we.x,z:we.z,red:Nt,label:`${ui(O)} ${we.label||we.id}`,common:Pt,sockets:[]};Qt.addSocket=({x:Ht,z:Kt})=>{const bi=Qt.sockets.length;if(Pt&&bi>0){const wt=Qt.sockets[bi-1];fn([new L(wt.x,.942,wt.z),new L(Ht,.942,Kt)],.013,U.brass,ie,8)}J(new ht(.044,.044,.006,6),U.metal,ie,Ht,.934,Kt),J(new ht(.037,.041,.017,32),Nt?U.red:U.black,ie,Ht,.946,Kt),J(new ht(.032,.032,.028,32),Nt?U.red:U.black,ie,Ht,.968,Kt);for(const wt of[.956,.964,.972])J(new Yi(.032,.0018,5,32),Nt?U.red:U.navy,ie,Ht,wt,Kt).rotation.x=-Math.PI/2;J(new Yi(.018,.004,8,32),U.metal,ie,Ht,.984,Kt).rotation.x=-Math.PI/2,J(new ht(.014,.014,.005,24),U.black,ie,Ht,.982,Kt);const $e=J(new Yi(.054,.0035,6,32),W("#ece6bd",{roughness:.6}),ie,Ht,.928,Kt);$e.rotation.x=-Math.PI/2,$e.visible=!1;const rt=J(new Ri(.068,12,8),new Zn({transparent:!0,opacity:0,depthWrite:!1}),ie,Ht,.984,Kt);rt.castShadow=!1,rt.receiveShadow=!1,rt.userData={kind:"terminal",id:we.id,socket:bi,label:Qt.label},rt.userData.direct={object:rt,kind:"terminal",id:we.id,terminal:we.id,socket:bi,label:Qt.label},nt.push(rt),Qt.sockets.push({x:Ht,z:Kt,socket:bi,ring:$e,hit:rt}),bi||Object.assign(Qt,{ring:$e,hit:rt})};const Hn=Pt?we.id==="gnd"?8:3:1;for(let Ht=0;Ht<Hn;Ht++)Qt.addSocket(Pt?yh(we.id,Ht):we);if(pe.set(we.id,Qt),!Te){const Ht=k(we.label||we.id,"",Pt?.25:.15,Pt?.08:.063);Ht.object.position.set(Pt?.8:we.x,.932,Pt?-.36:we.z+.086),ie.add(Ht.object)}}}}let ki=null,zi=0;const Ks=new WeakMap;function Js(_=!1){if(!ki){oe.updateWorldMatrix(!0,!0);const P=[...Qe.values()].filter(O=>O.type!=="ground").flatMap(O=>{const B=new er().setFromObject(O.body);return B.isEmpty()?[]:[B]}),N=(O,B)=>({minX:O.x,maxX:B.x,minZ:O.z,maxZ:B.z,top:B.y}),z=[q,K].map(O=>(O.group.updateWorldMatrix(!0,!0),new er().setFromObject(O.group))).filter(O=>!O.isEmpty());ki={world:[...P,...z].map(O=>N(O.min,O.max)),local:P.map(O=>N(oe.worldToLocal(O.min.clone()),oe.worldToLocal(O.max.clone())))}}return ki[_?"world":"local"]}function oa(_){ki=null,zi++,yt(ae),T=[],Z=[],oe.updateWorldMatrix(!0,!1);const P=_.flatMap(([z,O],B)=>{const re=pe.get(z),me=pe.get(O);if(!re||!me)return[];const ve=[z,O].sort().join("|"),Te=Bi(z,`wire:${ve}:${z}`),ot=Bi(O,`wire:${ve}:${O}`);return!Te||!ot?[]:[{id:ve,a:z,b:O,index:B,startPin:re,endPin:me,start:oe.worldToLocal(Te),end:oe.worldToLocal(ot)}]}),N=Hx(P,{obstacles:Js()});P.forEach(({id:z,a:O,b:B,index:re,startPin:me,endPin:ve,start:Te,end:ot})=>{const _t=O==="gnd"||B==="gnd"||O.endsWith("-")||B.endsWith("-")||O==="return"||B==="return",it=W(_t?"#202121":"#8b2925",{roughness:.79}),Ie=N.get(z).map(Ue=>new L(Ue.x,Ue.y,Ue.z)),we=fn(Ie,.009,it,ae,Math.max(32,Ie.length*6));we.userData={kind:"wire",index:re};const je=fn(Ie,.019,new Zn({transparent:!0,opacity:0,depthWrite:!1}),ae,Math.max(32,Ie.length*6));je.castShadow=!1,je.receiveShadow=!1,je.userData={kind:"wire",index:re,id:String(re),label:`${me.label} → ${ve.label}`,wire:we,color:it.color.getHex()},T.push(je);for(const[Ue,Pe]of[Te,ot].entries()){const ut=J(new ht(.023,.026,.055,24),it,ae,Pe.x,1.012,Pe.z),Nt=J(new Ri(.037,12,8),new Zn({transparent:!0,opacity:0,depthWrite:!1}),ae,Pe.x,1.03,Pe.z),Pt={object:Nt,kind:"plug",id:`wire:${re}:${Ue}`,resource:`wire:${[O,B].sort().join("|")}`,wireIndex:re,wirePair:[O,B],endpoint:Ue,terminal:Ue?B:O,from:Ue?O:B,label:`Pull ${Ue?ve.label:me.label} plug`,color:it.color.getHex()};ut.userData.direct=Pt,Nt.userData.direct=Pt,Z.push(Nt,ut);for(const Qt of[.988,.996,1.004])J(new Yi(.023,.0018,6,24),it,ae,Pe.x,Qt,Pe.z).rotation.x=-Math.PI/2}})}function Qs(_){const P=Y.wires.filter(N=>N.includes(_)).map(([N,z])=>xh(N,z,_));for(const N of["red","black","ch1","ch2","ch1Ground","ch2Ground"])C(N)===_&&P.push(`probe:${N}`);for(const N of ke)N.from===_&&N.originalPair&&P.push(xh(...N.originalPair,_));return P}function rr(){return oe.updateWorldMatrix(!0,!1),[...pe].flatMap(([_,P])=>P.sockets.map(N=>({id:_,socket:N.socket,hit:N.hit,position:oe.localToWorld(new L(N.x,1.002,N.z))})))}function Bi(_,P){const N=pe.get(_);if(!N)return null;const z=N.common?Se.resolve(_,P,Qs(_)):0;for(;N.sockets.length<=z;)N.addSocket(yh(_,N.sockets.length));const O=N.sockets[z];return oe.updateWorldMatrix(!0,!1),oe.localToWorld(new L(O.x,1.002,O.z))}function C(_){var N,z,O;if(_==="red"||_==="black")return((N=Y.probes)==null?void 0:N[_])||null;const P=_.slice(0,3);return((O=(z=Y.scope)==null?void 0:z[P])==null?void 0:O[_.endsWith("Ground")?"ground":"signal"])||null}const q=hi(Ax());q.group.position.set(-.43,.823,-.3),q.group.rotation.x=-.56,be.add(q.group);let K=hi(vh({module:"thevenin"}));K.group.position.copy(R),K.group.quaternion.copy(A),K.group.scale.setScalar(E),be.add(K.group);let Q=null;const X=[["red","#b52e2b","Meter V",-.52],["black","#252829","Meter COM",-.35],["ch1","#d5b348","CH1",.1],["ch2","#64a5b5","CH2",.26],["ch1Ground","#a68e42","CH1 ground",.41],["ch2Ground","#477d8c","CH2 ground",.53]];for(const[_,P,N,z]of X){const O=Ux({id:`probe:${_}`,channel:_,color:P,label:N}),B=new L(z,.831,-.345);O.group.position.copy(B),O.group.rotation.x=-Math.PI/2;const re=new Rn(new vl(.014,/Ground/.test(_)?.024:.12,4,8),new Zn({transparent:!0,opacity:0,depthWrite:!1}));re.position.y=/Ground/.test(_)?.027:.087,re.userData.direct=O.targets[0],O.group.add(re),O.targets[0].object=re,O.targets[0].resource=`probe:${_}`;const me=_h({color:P,radius:.0019});m.add(O.group,me.group),ne.set(_,{unit:O,pick:re,cable:me,home:B,connected:void 0,channel:_,color:P,loose:!1})}function _e(_=!1){for(const N of[...ke])![...$t.holds.values()].some(O=>O.lead===N)&&N.originalPair&&Y.wires.some(O=>O.includes(N.originalPair[0])&&O.includes(N.originalPair[1]))&&ps(N);const P=Y.module||"thevenin";if(P!==Ge){if(P.split(":")[0]!==Ge.split(":")[0]){const N=he.indexOf(K);N>=0&&he.splice(N,1),K.dispose(),K=hi(Y.module==="opamp"?Cx():vh({module:Y.module||"thevenin"})),K.group.position.copy(R),K.group.quaternion.copy(A),K.group.scale.setScalar(E),be.add(K.group),ki=null,zi++}Ge=P,Q==null||Q.dispose(),Q=Ix({module:Y.module||"thevenin"}),hi(Q,[]),Q.group.position.copy(M),Q.group.quaternion.copy(w),be.add(Q.group)}for(const N of[...he,...ee,Q].filter(Boolean))N.update({...Y,meterMode:Ve});for(const N of ne.values()){const z=!N.channel.startsWith("ch")||Y.module==="opamp";if(N.unit.group.visible=N.cable.group.visible=z,$t.isHeld(`probe:${N.channel}`))continue;const O=C(N.channel);if(O!==N.connected||_){N.connected=O;const B=Bi(O,`probe:${N.channel}`);B?(N.unit.group.position.copy(B),N.unit.group.rotation.set(-.24,0,N.channel.includes("2")?-.28:.28),N.loose=!1):N.loose||(N.unit.group.position.copy(N.home),N.unit.group.rotation.set(-Math.PI/2,0,0))}}He()}function Ce(_,P,N={},z=null){var ve,Te,ot,_t,it;const O=[zi,N.lane,N.branch,..._.toArray(),...P.toArray(),((ve=N.exit)==null?void 0:ve.x)||0,((Te=N.exit)==null?void 0:Te.y)||0,((ot=N.exit)==null?void 0:ot.z)||0].map(Ie=>typeof Ie=="number"?Ie.toFixed(4):Ie).join(":"),B=z&&Ks.get(z);if((B==null?void 0:B.signature)===O)return B.points;const re=performance.now();if(B&&B.revision===zi&&re-B.time<40&&_.distanceTo(B.start)<.08&&P.distanceTo(B.end)<.08){const Ie=B.points.map(Ue=>Ue.clone()),we=_.clone().sub(B.start),je=P.clone().sub(B.end);for(const Ue of[0,1])(_t=Ie[Ue])==null||_t.add(we);for(const Ue of[Ie.length-2,Ie.length-1])(it=Ie[Ue])==null||it.add(je);return Ie}const me=Gx(_,P,N).map(Ie=>new L(Ie.x,Ie.y,Ie.z));return z&&Ks.set(z,{signature:O,points:me,time:re,revision:zi,start:_.clone(),end:P.clone()}),me}function He(){const _=Js(!0);for(const P of ne.values()){if(!P.unit.group.visible)continue;const N=P.channel,z=N.endsWith("Ground"),O=N==="red"?q.anchors.V:N==="black"?q.anchors.COM:K.anchors[N.startsWith("ch1")?"CH1":"CH2"],B=z?ne.get(N.slice(0,3)):null,re=B?B.unit.group.localToWorld(new L(0,.055,0)):O==null?void 0:O.getWorldPosition(new L),me=P.unit.anchors.cable.getWorldPosition(new L),ve={red:0,black:1,ch1:2,ch2:3,ch1Ground:0,ch2Ground:1}[N]||0,Te=O?new L(0,0,1).applyQuaternion(O.getWorldQuaternion(new gn)):new L(0,0,1);re&&P.cable.update(Ce(re,me,{lane:ve,exit:Te,obstacles:_,branch:z},P.cable))}for(const P of ke){const N=Bi(P.from,P.originalPair?`wire:${[...P.originalPair].sort().join("|")}:${P.from}`:void 0);if(!N){P.cable.group.visible=P.plug.visible=!1;continue}P.cable.update(Ce(N,P.plug.position,{lane:4,obstacles:_},P.cable))}}const Oe=new cn;Oe.setAttribute("position",new Qn(new Float32Array(48),3));const Ke=new $c(Oe,new gm({color:"#e9df9a",dashSize:.035,gapSize:.025,depthTest:!1}));Ke.visible=!1,Ke.renderOrder=8,oe.add(Ke);let tt=null;const Je=new Ci(new L(0,1,0),-.88072);function gt(){for(const[P,N]of pe){const z=P===Y.selectedTerminal;for(const O of N.sockets){const B=(V==null?void 0:V.kind)==="terminal"&&V.id===P&&(V.socket??0)===O.socket;O.ring.visible=z||B,O.ring.material.color.set(z?"#f4d973":"#e6eef5"),O.ring.scale.setScalar(z?1.27:1.12)}}for(const[P,N]of Qe)N.outline&&(N.outline.visible=Y.selectedPart===P||(V==null?void 0:V.kind)==="part"&&V.id===P);for(const P of T){const N=P.userData;N.wire.material.color.set((V==null?void 0:V.kind)==="wire"&&V.id===String(N.index)&&Y.tool==="remove"?"#d57937":N.color)}const _=pe.get(Y.selectedTerminal);if(Ke.visible=!!_&&(Y.tool||"wire")==="wire",_){const P=(V==null?void 0:V.kind)==="terminal"?pe.get(V.id):null,N=P?new L(P.x,1.013,P.z):tt?oe.worldToLocal(tt.clone()):new L(_.x+.16,1.013,_.z+.16);N.y=Math.max(.988,Math.min(1.1,N.y));const z=new L(_.x,1.013,_.z),O=z.clone().lerp(N,.5);O.y+=.075;const B=new Ml(z,O,N),re=Oe.attributes.position;for(let me=0;me<16;me++){const ve=B.getPoint(me/15);re.setXYZ(me,ve.x,ve.y,ve.z)}re.needsUpdate=!0,Oe.computeBoundingSphere(),Ke.computeLineDistances()}}const vt=new jt;vt.visible=!1,m.add(vt);function Bt(_,P,N,z,O=0){const B=new jt;B.position.set(P,N,z),B.rotation.y=O,vt.add(B);const re=J(We(_.object.geometry.parameters.width+.045,_.object.geometry.parameters.height+.045,.042,.02),U.navy,B,0,0,-.026);return re.castShadow=!1,re.receiveShadow=!1,_.object.castShadow=!1,_.object.receiveShadow=!1,B.add(_.object),B}const Tt=Be(1024,1200,.9,1.055),Et=Be(840,1280,.68,1.036),Ye=Be(1600,1008,1.3,.819),Vt=Bt(Tt,0,1.72,-1.8),bt=Bt(Et,1.24,1.62,-1.02,-.88),_n=Bt(Ye,-.94,1.7,-.62,.99),di=[],pn=[];let On=0;const Ut={object:Ye.object,kind:"screen",id:"large-graph",label:"Graph cursor",bounds:[]};function Fn(_,P,N){const{context:z,canvas:O}=_;return z.fillStyle="#eff0ed",z.fillRect(0,0,O.width,O.height),z.fillStyle="#495a66",z.font="600 30px Arial, sans-serif",z.fillText(P,48,57),z.fillStyle="#193743",z.font="600 52px Arial, sans-serif",Ze(z,N,48,119,O.width-96),z}function mn(){const _=Fn(Tt,"LAB GUIDE","Experiments");di.length=0;const P=(B,re,me,ve,Te,ot)=>{_.fillStyle="#fff",_.fillRect(B,re,me,ve),_.strokeStyle="#a0aaa8",_.strokeRect(B,re,me,ve),_.fillStyle="#273b42",_.font="600 40px Arial",_.textAlign="center",Ze(_,Te,B+me/2,re+ve/2+10,me-20),_.textAlign="left",di.push({x:B,y:re,w:me,h:ve,action:ot})};(Y.actions||[]).filter(B=>String(B.group).toLowerCase()==="labs").forEach((B,re)=>P(42,148+re*78,940,65,B.label,()=>i(B.id))),(Y.actions||[]).filter(B=>String(B.group).toLowerCase()==="guide"||["undo","check-wiring"].includes(B.id)).slice(0,4).forEach((B,re)=>P(42+re%2*478,480+Math.floor(re/2)*77,462,64,B.label,()=>i(B.id))),_.fillStyle="#273b42",_.font="40px Arial",(x.xr.isPresenting?["Grip: pick up probes and plugs.","Release at a terminal to connect.","Trigger: turn knobs or use switches.","Left stick: move. Right stick: turn.","Stick click: recenter at the bench."]:["Drag probes onto terminals.","Drag between terminals to wire.","Pull a plug out to disconnect it.","Drag knobs. Click switches.","Drag empty space to look around."]).forEach((B,re)=>_.fillText(B,48,692+re*55)),P(42,1010,458,64,"Recenter",()=>va()),P(520,1010,462,64,x.xr.isPresenting?"Exit VR":"Close guide",()=>x.xr.isPresenting?void no.exit():ua(!1)),Tt.texture.needsUpdate=!0}Tt.object.userData={kind:"panel",activate:_=>{var z;const P=_.uv.x*Tt.canvas.width,N=(1-_.uv.y)*Tt.canvas.height;(z=di.find(O=>P>=O.x&&P<=O.x+O.w&&N>=O.y&&N<=O.y+O.h))==null||z.action()}};function rn(_){if(!Number.isFinite(Number(_))||_===null||_==="")return String(_??"—");const P=Number(_);return P!==0&&(Math.abs(P)>=1e5||Math.abs(P)<1e-4)?P.toExponential(2):Number(P.toPrecision(4)).toString()}function xn(){var re,me,ve;const _=Et.context,P=Et.canvas.width;_.fillStyle="#f9faf6",_.fillRect(0,0,P,1280),_.textAlign="left",_.textBaseline="alphabetic",_.fillStyle="#14211f",_.font="700 62px Arial",_.fillText("Live readings",48,88),_.fillStyle="#45524e",_.font="38px Arial";const N={thevenin:"Load circuit",superposition:"Selected sources",opamp:"Amplifier",transient:`${((re=Y.parameters)==null?void 0:re.kind)||"RC"} circuit`};_.fillText(N[Y.module]||"Circuit bench",48,139);const z=(Y.metrics||[]).slice(0,3),O={Voltmeter:"Meter voltage","Voltage sample":"Voltage at input peak","Linear gain":"Gain"};z.forEach((Te,ot)=>{const _t=180+ot*271;_.strokeStyle="#bdc8c2",_.lineWidth=2,_.beginPath(),_.moveTo(48,_t-16),_.lineTo(P-48,_t-16),_.stroke(),_.fillStyle="#34433e",_.font="600 47px Arial",Ze(_,O[Te.label]||Te.label,48,_t+42,P-96);const it=rn(Te.value),Ie=Te.unit||"";_.fillStyle="#101c18",_.font="700 142px Arial";const we=P-206;let je=142;for(;_.measureText(it).width>we&&je>86;)je-=4,_.font=`700 ${je}px Arial`;_.fillText(it,48,_t+185);const Ue=_.measureText(it).width;_.font="600 54px Arial",_.fillText(Ie,Math.min(P-151,48+Ue+22),_t+182),_.fillStyle="#4b5852",_.font="34px Arial";const Pe=Te.label==="Voltmeter"||Te.label==="Voltage sample"?Te.value==="—"?Te.detail||"Place both probes":"V tip − COM tip":Te.label==="Branch current"||Te.label==="Storage current"?"Current: top → ground":Te.label==="Load power"?"From load voltage × current":Te.label==="Linear gain"?"Output / input, before clipping":"";Ze(_,Pe,48,_t+238,P-96)});const B=Y.measurement||{};B.ok===!1?(_.fillStyle="#f4e6d6",_.fillRect(28,1012,P-56,236),_.fillStyle="#6b341b",_.font="700 43px Arial",_.fillText("Check connections",48,1066),_.font="37px Arial",It(_,B.error||"Complete the circuit to take a reading.",48,1121,P-96,47,3)):Y.module==="transient"?(_.fillStyle="#243b32",_.font="600 44px Arial",_.fillText((me=Y.parameters)!=null&&me.playing?"Running":"Paused",48,1076),_.font="700 75px Arial",_.fillText(`${rn((((ve=Y.parameters)==null?void 0:ve.time)||0)*1e3)} ms`,48,1172,P-96),_.font="34px Arial",_.fillText("Elapsed circuit time",48,1226)):Y.module==="opamp"&&B.clipped?(_.fillStyle="#f4e6d6",_.fillRect(28,1035,P-56,128),_.fillStyle="#6b341b",_.font="700 48px Arial",_.fillText("Output is clipping",48,1117)):(_.fillStyle="#46564c",_.font="37px Arial",_.fillText("Readings follow the circuit.",48,1096)),Et.texture.needsUpdate=!0}Et.object.userData={kind:"panel",activate:()=>!0};function fs(_,P){return{voltage:"Voltage",current:"Current",energy:"Energy",ch1:"CH1",ch2:"CH2"}[_.id]||_.title||`Graph ${P+1}`}function yn(){var Ht,Kt,bi;const _=Ye.context,P=1600,N=1008,z=Y.graph||{},O=(Ht=z.panels)!=null&&Ht.length?z.panels:[z];On=Math.max(0,Math.min(On,O.length-1));const B=O[On]||z;_.fillStyle="#fafbf8",_.fillRect(0,0,P,N),_.textAlign="left",_.textBaseline="alphabetic",pn.length=0,_.fillStyle="#172720",_.font="700 53px Arial";const re=ge==="schematic"?"Circuit schematic":{thevenin:"Load power",superposition:"Source contributions",opamp:"Oscilloscope",transient:`${((Kt=Y.parameters)==null?void 0:Kt.kind)||"RC"} response`}[Y.module]||"Circuit graph";_.fillText(re,48,89);const me=($e,rt,wt,en,ar,Fd,Zl=!1)=>{_.fillStyle=Zl?"#263e34":"#e4ebe5",_.fillRect($e,rt,wt,en),_.fillStyle=Zl?"#fff":"#22392c",_.font="600 39px Arial",_.textAlign="center",Ze(_,ar,$e+wt/2,rt+en/2+14,wt-24),_.textAlign="left",pn.push({x:$e,y:rt,w:wt,h:en,action:Fd})};if(me(1110,35,180,68,"Graph",()=>{ge="graph",yn()},ge==="graph"),me(1310,35,242,68,"Schematic",()=>{ge="schematic",yn()},ge==="schematic"),ge==="schematic"){if(Ut.bounds=[],ze){const $e={x:30,y:135,w:1540,h:840},rt=Math.min($e.w/ze.width,$e.h/ze.height),wt=ze.width*rt,en=ze.height*rt;_.drawImage(ze,$e.x+($e.w-wt)/2,$e.y+($e.h-en)/2,wt,en)}else _.fillStyle="#44564a",_.font="46px Arial",_.fillText("Circuit reference is loading.",48,246);Ye.texture.needsUpdate=!0;return}if(O.length>1){const $e=(1504-14*(O.length-1))/O.length;O.forEach((rt,wt)=>me(48+wt*($e+14),141,$e,70,fs(rt,wt),()=>{var en;On=wt,(en=K.selectPanel)==null||en.call(K,wt),yn()},wt===On))}else _.fillStyle="#43544a",_.font="39px Arial",Ze(_,z.subtitle||"Current circuit values",48,185,P-96);const ve=182,Te=1534,ot=280,_t=720,it=$e=>ve+$e*(Te-ve),Ie=$e=>_t-$e*(_t-ot);Ut.bounds=[{left:ve/P,top:ot/N,width:(Te-ve)/P,height:(_t-ot)/N,panel:On}],_.fillStyle="#263b2e",_.font="600 43px Arial",Ze(_,B.yLabel||"Response",ve,256,Te-ve);const we=B.xDivisions||z.xDivisions||4,je=B.yDivisions||z.yDivisions||4;_.strokeStyle="#c9d3cc",_.lineWidth=1.8;for(let $e=0;$e<=we;$e++){const rt=it($e/we);_.beginPath(),_.moveTo(rt,ot),_.lineTo(rt,_t),_.stroke()}for(let $e=0;$e<=je;$e++){const rt=Ie($e/je);_.beginPath(),_.moveTo(ve,rt),_.lineTo(Te,rt),_.stroke()}_.strokeStyle="#607166",_.lineWidth=2.5,_.strokeRect(ve,ot,Te-ve,_t-ot),_.save(),_.beginPath(),_.rect(ve-3,ot-3,Te-ve+6,_t-ot+6),_.clip();const Ue=B.series||[];for(const $e of Ue){_.strokeStyle=$e.color||"#147587",_.lineWidth=6,_.lineJoin="round",_.lineCap="round",_.beginPath();let rt=!1;for(const[wt,en]of $e.points||[]){if(!Number.isFinite(wt)||!Number.isFinite(en)){rt=!1;continue}rt?_.lineTo(it(wt),Ie(en)):_.moveTo(it(wt),Ie(en)),rt=!0}_.stroke(),((bi=$e.points)==null?void 0:bi.length)===1&&(_.beginPath(),_.arc(it($e.points[0][0]),Ie($e.points[0][1]),6,0,Math.PI*2),_.fillStyle=$e.color||"#147587",_.fill())}if(B.reference&&Number.isFinite(B.reference.x)){const $e=it(B.reference.x);_.strokeStyle="#805528",_.lineWidth=3,_.setLineDash([12,9]),_.beginPath(),_.moveTo($e,ot),_.lineTo($e,_t),_.stroke(),_.setLineDash([]),_.fillStyle="#654117",_.font="600 37px Arial",_.fillText(B.reference.label||"",Math.max(ve+10,Math.min($e+14,Te-105)),ot+47)}const Pe=B.cursor||z.cursor;if(Pe&&Number.isFinite(Pe.x)){const $e=it(Pe.x);_.strokeStyle="#263e34",_.lineWidth=3,_.setLineDash([8,7]),_.beginPath(),_.moveTo($e,ot),_.lineTo($e,_t),_.stroke(),_.setLineDash([])}B.marker&&Number.isFinite(B.marker.x)&&Number.isFinite(B.marker.y)&&(_.beginPath(),_.arc(it(B.marker.x),Ie(B.marker.y),9,0,Math.PI*2),_.fillStyle="#fff",_.fill(),_.lineWidth=5,_.strokeStyle="#83432b",_.stroke()),_.restore(),_.fillStyle="#283d31",_.font="600 40px Arial";const ut=$e=>{const rt=($e||[]).filter(en=>Number.isFinite(en.position));if(rt.length<=3)return rt;const wt=rt.reduce((en,ar)=>Math.abs(ar.position-.5)<Math.abs(en.position-.5)?ar:en,rt[0]);return[...new Set([rt[0],wt,rt.at(-1)])]},Nt=ut(B.xTicks);_.textAlign="center",Nt.forEach(($e,rt)=>{Nt.length>6&&rt!==0&&rt!==Nt.length-1&&rt%2||Ze(_,String($e.label),it($e.position),772,Math.min(260,(Te-ve)/Math.max(3,Nt.length-1)))}),_.textAlign="right";const Pt=ut(B.yTicks);Pt.forEach(($e,rt)=>{Pt.length>5&&rt!==0&&rt!==Pt.length-1&&rt%2||Ze(_,String($e.label),ve-20,Ie($e.position)+13,149)}),_.textAlign="center",_.font="600 42px Arial",Ze(_,B.xLabel||z.xLabel||"Time",(ve+Te)/2,827,Te-ve),_.textAlign="left",_.fillStyle="#e5ede6",_.fillRect(30,862,1540,120);const Qt=new Set(Ue.map($e=>$e.name).filter(Boolean)),Hn=((Pe==null?void 0:Pe.readings)||[]).filter($e=>!Qt.size||Qt.has($e.name));if(Pe&&(Pe.xLabel||Hn.length)){const $e=[{label:"Cursor",value:Pe.xLabel||"—"},...Hn.map(wt=>({label:wt.name,value:`${rn(wt.value)} ${wt.unit||""}`}))],rt=1500/Math.max(1,$e.length);$e.forEach((wt,en)=>{const ar=50+en*rt;_.fillStyle="#3f5447",_.font="32px Arial",Ze(_,wt.label,ar,904,rt-22),_.fillStyle="#13271b",_.font="700 53px Arial",Ze(_,wt.value,ar,963,rt-22)})}else{_.fillStyle="#2b4234",_.font="600 43px Arial";const $e=!Ue.some(rt=>{var wt;return(wt=rt.points)==null?void 0:wt.length});Ze(_,$e?B.subtitle||z.subtitle||"Connect the circuit to acquire a trace.":"Point at the graph and hold the trigger to inspect a reading.",52,936,1496)}Ye.texture.needsUpdate=!0}Ye.object.userData={kind:"panel",direct:Ut,activate:_=>{const P=_.uv.x*1600,N=(1-_.uv.y)*1008,z=pn.find(B=>P>=B.x&&P<=B.x+B.w&&N>=B.y&&N<=B.y+B.h);if(z)return z.action(),!0;const O=Ut.bounds[0];return ge!=="graph"||!O||P<O.left*1600||P>(O.left+O.width)*1600||N<O.top*1008||N>(O.top+O.height)*1008}};function Dd(_,P){var me;const N=_h({color:_.color||"#862926",radius:.0038}),z=new jt;J(new ht(.009,.011,.038,20),W(_.color||"#862926"),z,0,.015,0),J(new ht(.003,.003,.013,16),U.metal,z,0,-.009,0);const O=J(new Ri(.023,12,8),new Zn({transparent:!0,opacity:0,depthWrite:!1}),z,0,.013,0);z.position.copy(P);const B={from:_.from||_.terminal,cable:N,plug:z,originalPair:((me=_.wirePair)==null?void 0:me.slice())||null},re={object:O,kind:"plug",id:`loose:${Math.random().toString(36).slice(2)}`,from:B.from,label:"Grab loose plug",lead:B,color:_.color};return O.userData.direct=re,B.target=re,m.add(z,N.group),ke.add(B),B}function ps(_){_&&(ke.delete(_),_.cable.dispose(),yt(_.plug),_.plug.removeFromParent())}const $t=Mx({getModel:()=>{var _;return{...Y,parameters:{...Y.parameters,meterMode:Ve,timeCursor:(_=Y.parameters)==null?void 0:_.time}}},getTerminals:rr,onProbe:u,onConnect:h,onDisconnect:d,onGraphCursor:g,onChange:(_,P)=>{var N;_==="meterMode"?(Ve=P,q.update({...Y,meterMode:Ve}),l(_,P)):_==="timeCursor"?i(`scrub:${Math.min(P,((N=Y.parameters)==null?void 0:N.acquiredTime)||0)*1e3}`):l(_,P)},onAction:_=>{var P;if(String(_).startsWith("recorder-panel:")){const N=Number(String(_).split(":")[1]);Number.isInteger(N)&&N>=0&&((P=K.selectPanel)==null||P.call(K,N),On=N,yn())}else i(_)},onHold:(_,P,N)=>{var O,B,re;const z=P.target;if(_==="start")if(["probe","plug","terminal"].includes(z.kind)&&v("begin",P),z.kind==="probe"){const me=ne.get(z.channel);me&&(me.loose=!0,P.probe=me,P.position=me.unit.group.position.clone())}else(z.kind==="terminal"||z.kind==="plug")&&(P.lead=z.lead||Dd(z,P.position||Bi(z.terminal)));if(_==="move"&&(P.probe&&P.position&&(P.probe.unit.group.position.copy(P.position),P.quaternion?P.probe.unit.group.quaternion.copy(P.quaternion):P.probe.unit.group.rotation.set(-.25,0,.18)),P.lead&&P.position&&P.lead.plug.position.copy(P.position),x.shadowMap.needsUpdate=!0),_==="end"){if(P.probe){const me=P.probe;me.connected=N.terminal;const ve=`probe:${me.channel}`;if((O=pe.get(N.terminal))!=null&&O.common&&P.position){const ot=Bo(P.position,rr().filter(_t=>_t.id===N.terminal),.055);ot&&Se.prefer(N.terminal,ve,ot.socket,Qs(N.terminal))}const Te=Bi(N.terminal,ve);Te?(me.unit.group.position.copy(Te),me.unit.group.rotation.set(-.24,0,.25),me.loose=!1):(me.unit.group.position.set(vn.clamp(((B=P.position)==null?void 0:B.x)??me.home.x,-.88,.88),.87,vn.clamp(((re=P.position)==null?void 0:re.z)??me.home.z,-1.2,-.34)),me.unit.group.rotation.set(-Math.PI/2,0,0),me.loose=!0)}P.lead&&(N.kind==="connected"||N.kind==="cancelled"||z.kind==="terminal"?ps(P.lead):(P.lead.plug.position.y=.87,P.lead.plug.position.x=vn.clamp(P.lead.plug.position.x,-.58,.58),P.lead.plug.position.z=vn.clamp(P.lead.plug.position.z,-1.1,-.41))),["probe","plug","terminal"].includes(z.kind)&&v("end",P),x.shadowMap.needsUpdate=!0}}});function Dl(_){var me,ve,Te,ot,_t,it,Ie,we;_.module&&_.module!==Y.module&&(On=0),(me=_.live)!=null&&me.title&&(_.live.title,(ve=Y.live)==null||ve.title),_.selectedPart&&(_.selectedPart,Y.selectedPart),Y={...Y,..._};const P=JSON.stringify(Y.components.map(({value:je,...Ue})=>Ue));let N=!1;if(P!==De){De=P,$t.cancelAll();for(const je of[...ke])ps(je);Ar(Y.components),N=!0,x.shadowMap.needsUpdate=!0}for(const je of Y.components){const Ue=Qe.get(je.id);Ue&&Ue.value!==je.value&&(Ue.draw(je.label,je.value),Ue.value=je.value,(Te=Ue.updateHardware)==null||Te.call(Ue,je.value),Ue.hit&&(Ue.hit.userData.label=`${ui(je)} · ${je.value}`),x.shadowMap.needsUpdate=!0)}const z=JSON.stringify(Y.wires);(N||z!==et)&&(et=z,oa(Y.wires),x.shadowMap.needsUpdate=!0),gt(),_e(N);const O=JSON.stringify([Y.module,Y.metrics,(ot=Y.measurement)==null?void 0:ot.ok,(_t=Y.measurement)==null?void 0:_t.error,(it=Y.measurement)==null?void 0:it.clipped,(Ie=Y.parameters)==null?void 0:Ie.time,(we=Y.parameters)==null?void 0:we.playing]);O!==Xe&&(Xe=O,xn());const B=JSON.stringify([Y.actions,Y.tool,Y.selectedTerminal,Y.selectedPart,Y.partActions]);B!==Re&&(Re=B,mn());const re=JSON.stringify(Y.graph);if(re!==lt&&(lt=re,yn()),Y.schematicDataURL!==void 0&&Y.schematicDataURL!==le){le=Y.schematicDataURL,ze=null;const je=++st;if(/^data:image\/(svg\+xml|png|jpeg|webp)[;,]/.test(le||"")){const Ue=new Image;Ue.onload=()=>{!xt&&je===st&&(ze=Ue,yn())},Ue.onerror=()=>{!xt&&je===st&&yn()},Ue.src=le}yn()}}const sr=new bm,Il=new ye;let bn=null;function Ul(_){for(let P=_;P;P=P.parent)if(!P.visible)return!1;return!0}function eo(_){for(let P=_;P;P=P.parent){const N=P.userData.direct||P.userData.equipmentTarget;if(N)return N}return null}function Nl(){const _=[...he,...ee,Q].filter(Boolean).map(z=>z.group),P=[...ne.values()].map(z=>z.unit.group),N=[...ke].map(z=>z.plug);return[...nt,...D,...T,...Z,..._,...P,...N,...vt.visible?[Tt.object,Et.object,Ye.object]:[]]}function to(){const _=sr.intersectObjects(Nl(),!0).filter(z=>Ul(z.object)&&(eo(z.object)||z.object.userData.kind));for(const z of _)z.direct=eo(z.object);const P=_[0];return _.find(z=>{var O;return["probe","plug","dial","button","screen","switch"].includes((O=z.direct)==null?void 0:O.kind)&&z.distance<((P==null?void 0:P.distance)??1/0)+.065})||P}function or(_,P=null){var B;const N=(_==null?void 0:_.direct)||(_==null?void 0:_.object.userData),z=N&&["terminal","part","wire","probe","plug","dial","button","switch","screen"].includes(N.kind)?{kind:N.kind,id:N.id??String(N.index),label:N.label||N.id,socket:N.socket}:null,O=JSON.stringify([z,Y.tool,Y.selectedTerminal]);V=z,tt=((B=_==null?void 0:_.point)==null?void 0:B.clone())||(P==null?void 0:P.clone())||null,O!==xe&&(xe=O,s(x.xr.isPresenting?null:z)),gt()}function aa(_){const P=x.domElement.getBoundingClientRect();Il.set((_.clientX-P.left)/P.width*2-1,-(_.clientY-P.top)/P.height*2+1),sr.setFromCamera(Il,p)}function ca(_,P){if(!(_!=null&&_.uv))return{};const N=_.uv.x,z=1-_.uv.y,O=P.bounds||[];let B=O.find(re=>z>=re.top&&z<=re.top+re.height);return B||(B=O[0]||{left:0,width:1,panel:0}),{fraction:vn.clamp((N-B.left)/B.width,0,1),panelIndex:B.panel||0}}function la(){return sr.ray.intersectPlane(Je,new L)}function Ol(_,P,N={}){var B,re,me,ve;if(!P||P.object.userData.kind==="panel"&&P.object.userData.activate(P)!==!1)return!1;const z=P.direct||eo(P.object);if(!z||z.kind==="probe"&&!((B=ne.get(z.channel))!=null&&B.unit.group.visible))return!1;z.kind==="dial"&&(z.resource=`parameter:${z.parameter}`),z.kind==="plug"&&z.wirePair&&(z.wireIndex=Y.wires.findIndex(Te=>Te.includes(z.wirePair[0])&&Te.includes(z.wirePair[1]))),z.parameter==="timeCursor"&&(z.max=((re=Y.parameters)==null?void 0:re.acquiredTime)||0,z.min=0,z.step=Math.max(z.max/100,1e-6));const O=z.kind==="probe"?(me=ne.get(z.channel))==null?void 0:me.unit.group.position:z.kind==="terminal"?(ve=rr().find(Te=>Te.id===z.terminal&&Te.socket===(z.socket??0)))==null?void 0:ve.position:P.point;return $t.begin(_,z,{position:O,...ca(P,z),...N})}function Fl(_){if(_.button!==0||x.xr.isPresenting)return;$t.release("mouse"),aa(_);const P=to();bn={x:_.clientX,y:_.clientY,lastX:_.clientX,lastY:_.clientY,time:performance.now(),hit:P},(P!=null&&P.direct||(P==null?void 0:P.object.userData.kind)==="panel")&&(b.enabled=!1,x.domElement.setPointerCapture(_.pointerId),Ol("mouse",P),_.stopImmediatePropagation(),_.preventDefault())}function kl(_){var z,O;if(x.xr.isPresenting)return;aa(_);const P=$t.hold("mouse"),N=to();if(P){const B={position:la()};if(P.target.kind==="dial"&&(B.turn=(_.clientX-bn.lastX-(_.clientY-bn.lastY))*.024),P.target.kind==="screen"){const ve=sr.intersectObject(P.target.object,!0)[0];Object.assign(B,ca(ve,P.target))}$t.move("mouse",B),bn&&(bn.lastX=_.clientX,bn.lastY=_.clientY);const re=["probe","terminal","plug"].includes(P.target.kind)?Bo(P.position,rr(),.055):null,me=re?{object:re.hit,direct:re.hit.userData.direct,point:re.position}:N;or(me,B.position),He()}else bn||(x.domElement.style.cursor=((z=N==null?void 0:N.direct)==null?void 0:z.kind)==="dial"?"ns-resize":((O=N==null?void 0:N.direct)==null?void 0:O.kind)==="screen"?"crosshair":"grab",or(N,la()))}function zl(_){var P;if(!bn){$t.release("mouse");return}aa(_),$t.hold("mouse")?$t.end("mouse",{position:la()}):Math.hypot(_.clientX-bn.x,_.clientY-bn.y)<5&&((P=bn.hit)==null?void 0:P.object.userData.kind)==="part"&&r(bn.hit.object.userData.id),bn=null,$t.release("mouse"),b.enabled=!0,x.domElement.hasPointerCapture(_.pointerId)&&x.domElement.releasePointerCapture(_.pointerId),He()}function Bl(){$t.hold("mouse")&&$t.block("mouse"),bn=null,b.enabled=!x.xr.isPresenting,or(null)}const Vl=()=>{bn||or(null)};x.domElement.addEventListener("pointerdown",Fl,!0),x.domElement.addEventListener("pointermove",kl),x.domElement.addEventListener("pointerup",zl),x.domElement.addEventListener("pointercancel",Bl),x.domElement.addEventListener("pointerleave",Vl);function Hl(){vt.updateWorldMatrix(!0,!0);const _=new er().setFromObject(vt),P=_.getCenter(new L),N=[];for(const B of[_.min.x,_.max.x])for(const re of[_.min.y,_.max.y])for(const me of[_.min.z,_.max.z])N.push(new L(B,re,me));const z=new L(0,.12,1).normalize();let O=4;for(let B=0;B<9;B++){p.position.copy(P).addScaledVector(z,O),p.lookAt(P),p.updateMatrixWorld();const re=N.map(it=>it.clone().project(p)),me=Math.min(...re.map(it=>it.x)),ve=Math.max(...re.map(it=>it.x)),Te=Math.min(...re.map(it=>it.y)),ot=Math.max(...re.map(it=>it.y)),_t=O*Math.tan(vn.degToRad(p.fov/2));P.addScaledVector(new L().setFromMatrixColumn(p.matrixWorld,0),(me+ve)*.5*_t*p.aspect),P.addScaledVector(new L().setFromMatrixColumn(p.matrixWorld,1),(Te+ot)*.5*_t),O=Math.max(b.minDistance,O*Math.max(.75,Math.min(1.35,Math.max((ve-me)/1.78,(ot-Te)/1.78))))}b.target.copy(P),p.position.copy(P).addScaledVector(z,O),p.lookAt(P),b.update()}function ua(_){if(x.xr.isPresenting||xt)return;_=!!_;const P=_!==Me;_&&!Me&&(Ne={position:p.position.clone(),quaternion:p.quaternion.clone(),target:b.target.clone()}),Me=_,vt.visible=_,x.shadowMap.needsUpdate=!0,_?(ga(1.6),Hl()):Ne&&(p.position.copy(Ne.position),p.quaternion.copy(Ne.quaternion),b.target.copy(Ne.target),b.update(),Ne=null),or(null),mn(),P&&o(_)}const Rr=[],Gl=new Wt,Wl=wx({obstacles:[{minX:-1.07,maxX:1.07,minZ:-1.7,maxZ:-.27},{minX:.55,maxX:1.22,minZ:-.46,maxZ:.25},{minX:-1.22,maxX:-.55,minZ:-.46,maxZ:.25}],bounds:{minX:-3.1,maxX:3.1,minZ:-4.6,maxZ:2.4}});let ti=!1,ha=0,Cn=null;function yi(){$t.cancelAll(),Wl.reset(),bn=null;for(const _ of Rr)_.armed=!1,_.lastQuaternion=null,_.stickPressed=!1;b.enabled=!x.xr.isPresenting}function ms(){ti=document.visibilityState==="hidden"||!!(Cn!=null&&Cn.visibilityState)&&Cn.visibilityState!=="visible",yi()}const $l=()=>{x.xr.isPresenting||(ti=!0,yi())},ql=()=>{x.xr.isPresenting||(ti=!1,yi())};window.addEventListener("blur",$l),window.addEventListener("focus",ql),document.addEventListener("visibilitychange",ms);function da(_){_.controller.updateWorldMatrix(!0,!1),Gl.extractRotation(_.controller.matrixWorld),sr.ray.origin.setFromMatrixPosition(_.controller.matrixWorld),sr.ray.direction.set(0,0,-1).applyMatrix4(Gl)}function fa(_,P){const N=_.grip.getWorldQuaternion(new gn),z=_.grip.getWorldPosition(new L),O=new L(0,0,-1).applyQuaternion(N),B=N.clone().multiply(new gn().setFromAxisAngle(new L(1,0,0),Math.PI/2)),re=P!=null&&P.probe?bx(z,N,P.probePickupQuaternion,P.probe.unit.length):{position:z.addScaledVector(O,.08),quaternion:B};if((P==null?void 0:P.target.kind)==="dial"){const me=new L(...P.target.axis==="y"?[0,1,0]:P.target.axis==="x"?[1,0,0]:[0,0,1]).applyQuaternion(P.target.object.getWorldQuaternion(new gn));re.turn=_.lastQuaternion?-yx(N.clone().multiply(_.lastQuaternion.clone().invert()),me):0}return(P==null?void 0:P.target.kind)==="screen"&&(da(_),Object.assign(re,ca(sr.intersectObject(P.target.object,!0)[0],P.target))),_.lastQuaternion=N,re}function Xl(_,P){if(!_.armed||ti||!x.xr.isPresenting||$t.hold(_.id))return;da(_);let N=to();if(P==="grip"){const z=_.grip.getWorldPosition(new L),O=Nl().flatMap(B=>{const re=[];return B.traverse(me=>{const ve=eo(me);ve&&["probe","plug","dial","terminal","button","switch"].includes(ve.kind)&&Ul(me)&&re.push({node:me,target:ve,point:me.getWorldPosition(new L)})}),re}).sort((B,re)=>B.point.distanceTo(z)-re.point.distanceTo(z));if(!O.length||O[0].point.distanceTo(z)>.12)return;N={object:O[0].node,direct:O[0].target,point:O[0].point}}if(_.button=P,_.lastQuaternion=_.grip.getWorldQuaternion(new gn),Ol(_.id,N)){const z=$t.hold(_.id);z!=null&&z.probe&&(z.probePickupQuaternion=_.lastQuaternion.clone()),z&&["probe","plug","terminal"].includes(z.target.kind)&&$t.move(_.id,fa(_,z))}}function Yl(_,P){if(_.button===P){const N=$t.hold(_.id);N&&$t.end(_.id,fa(_,N)),_.button=null,_.lastQuaternion=null}$t.release(_.id)}for(let _=0;_<2;_++){const P=x.xr.getController(_),N=x.xr.getControllerGrip(_),z=new $c(new cn().setFromPoints([new L,new L(0,0,-1)]),new Wo({color:"#bbc8c8",transparent:!0,opacity:.55}));P.add(z),z.scale.z=2;const O=new Rn(new Ri(.007,12,8),new Zn({color:"#d7c98b",depthTest:!1}));O.visible=!1,m.add(O);const B={id:`controller:${_}`,controller:P,grip:N,ray:z,cursor:O,source:null,armed:!1,button:null,stickPressed:!1,lastQuaternion:null};P.addEventListener("connected",me=>{B.source=me.data,B.armed=!1,P.visible=!0}),P.addEventListener("disconnected",()=>{$t.block(B.id),B.source=null,B.armed=!1,P.visible=!1,O.visible=!1}),P.addEventListener("selectstart",()=>Xl(B,"trigger")),P.addEventListener("selectend",()=>Yl(B,"trigger")),P.addEventListener("squeezestart",()=>Xl(B,"grip")),P.addEventListener("squeezeend",()=>Yl(B,"grip"));const re=J(We(.037,.075,.045,.013),U.navy,N,0,-.017,.015);re.rotation.x=-.35,J(new Ri(.022,12,8),U.teal,N,0,.019,-.012),y.add(P,N),Rr.push(B)}let pa=null,gs=!1,ma=!0;function ga(_){const P=new L(0,_,0);_n.position.set(-.94,Math.max(1.69,_+.04),-.62),bt.position.set(1.24,Math.max(1.61,_-.01),-1.02),Vt.position.set(0,Math.max(1.66,_+.08),-1.8),_n.lookAt(P),bt.lookAt(P),Vt.lookAt(P)}function va(){return x.xr.isPresenting?(yi(),gs=!0,!0):!1}const no=Ox({xrManager:x.xr,navigatorXR:()=>navigator.xr,isSecureContext:()=>window.isSecureContext,visibilityTarget:document,onStatus:a,onBeforeSession:({floorReference:_})=>{yi(),pa=Fx(p,b),ma=_,b.enabled=!1,y.position.set(0,_?0:1.6,0),y.quaternion.identity(),p.position.set(0,0,0),p.quaternion.identity()},onSessionStarted:({session:_})=>{Cn=_,ti=!1,Cn==null||Cn.addEventListener("visibilitychange",ms),yi(),at.visible=!1,Fe.visible=!0,vt.visible=!0,s(null),gs=!0,x.shadowMap.needsUpdate=!0,mn()},onSessionEnded:()=>{yi(),Cn==null||Cn.removeEventListener("visibilitychange",ms),Cn=null,ti=!1,gs=!1,at.visible=!1,Fe.visible=!0,vt.visible=Me,kx(p,b,y,pa),pa=null;for(const _ of Rr)_.cursor.visible=!1,_.stickPressed=!1;or(null),ga(1.6),x.shadowMap.needsUpdate=!0,_a(),mn()}});function Id(){return xt?Promise.resolve(!1):(Me&&ua(!1),no.toggle())}function Ud(){return no.refreshSupport()}function _a(){if(x.xr.isPresenting||xt)return;const _=Math.max(1,n.clientWidth),P=Math.max(1,n.clientHeight);p.aspect=_/P,p.updateProjectionMatrix(),x.setSize(_,P,!1),Me?Hl():(!F||Math.abs(p.aspect/F-1)>.12)&&$()}const jl=new ResizeObserver(_a);jl.observe(n),_a(),Dl(Y),x.setAnimationLoop(_=>{var P,N,z,O,B,re,me,ve;if(!xt&&(c(_),!xt)){if(x.xr.isPresenting){if(gs){const Pe=x.xr.getFrame(),ut=x.xr.getReferenceSpace(),Nt=Pe&&ut?Pe.getViewerPose(ut):null;Nt&&zx(y,Nt,{floorReference:ma,eyeHeight:1.6})&&(ga(ma?Nt.transform.position.y:1.6),gs=!1)}const Te=x.xr.getCamera(),ot=Te.getWorldPosition(new L),_t=Te.getWorldQuaternion(new gn),it=(N=(P=Rr.find(Pe=>{var ut;return((ut=Pe.source)==null?void 0:ut.handedness)==="left"}))==null?void 0:P.source)==null?void 0:N.gamepad,Ie=(O=(z=Rr.find(Pe=>{var ut;return((ut=Pe.source)==null?void 0:ut.handedness)==="right"}))==null?void 0:z.source)==null?void 0:O.gamepad,we=Pe=>{var ut,Nt,Pt;return((ut=Pe==null?void 0:Pe.axes)==null?void 0:ut.length)>=4?[Pe.axes[2],Pe.axes[3]]:[((Nt=Pe==null?void 0:Pe.axes)==null?void 0:Nt[0])||0,((Pt=Pe==null?void 0:Pe.axes)==null?void 0:Pt[1])||0]};Wl.update({rig:y,headPosition:ot,headQuaternion:_t,left:we(it),right:we(Ie)[0],dt:ha?(_-ha)/1e3:0,enabled:!ti});let je=null,Ue=null;for(const Pe of Rr){const ut=(B=Pe.source)==null?void 0:B.gamepad;!ti&&!Pe.armed&&ut&&!((re=ut.buttons[0])!=null&&re.pressed)&&!((me=ut.buttons[1])!=null&&me.pressed)&&(Pe.armed=!0,$t.release(Pe.id));const Nt=Pe.armed&&!!((ve=ut==null?void 0:ut.buttons[3])!=null&&ve.pressed);Nt&&!Pe.stickPressed&&va(),Pe.stickPressed=Nt,da(Pe);const Pt=!ti&&Pe.controller.visible?to():null;Pe.ray.visible=!ti,Pe.ray.scale.z=Pt?Pt.distance:2;const Qt=$t.hold(Pe.id);Qt&&!ti&&$t.move(Pe.id,fa(Pe,Qt));const Hn=Qt&&["probe","terminal","plug"].includes(Qt.target.kind)?Bo(Qt.position,rr(),.055):null;Pe.cursor.visible=!!Pt||!!Hn,Hn?(Pe.cursor.position.copy(Hn.position),Pe.cursor.material.color.set("#88c39e")):Pt&&(Pe.cursor.position.copy(Pt.point),Pe.cursor.material.color.set("#d7c98b")),Hn?(je={object:Hn.hit,direct:Hn.hit.userData.direct,point:Hn.position},Ue=Hn.position):Pt&&!je&&(je=Pt,Ue=Pt.point)}or(je,Ue)}else b.update();ha=_,He(),x.render(m,p)}});function Nd(){yi(),xt=!0,Cn==null||Cn.removeEventListener("visibilitychange",ms),window.removeEventListener("blur",$l),window.removeEventListener("focus",ql),document.removeEventListener("visibilitychange",ms),no.dispose(),x.setAnimationLoop(null),jl.disconnect(),b.dispose(),x.domElement.removeEventListener("pointerdown",Fl,!0),x.domElement.removeEventListener("pointermove",kl),x.domElement.removeEventListener("pointerup",zl),x.domElement.removeEventListener("pointercancel",Bl),x.domElement.removeEventListener("pointerleave",Vl);for(const _ of ne.values())_.pick.geometry.dispose(),_.pick.material.dispose(),_.unit.dispose(),_.cable.dispose();for(const _ of ke)ps(_);for(const _ of[...he,...ee,Q].filter(Boolean))_.dispose();yt(m);for(const _ of de)_.dispose();x.dispose(),x.domElement.remove()}function Od(){yi();for(const _ of[...ke])ps(_)}return{cancelInteractions:Od,update:Dl,enterVR:Id,refreshVRSupport:Ud,recenterVR:va,resetView:$,setPanelPreview:ua,dispose:Nd,renderer:x}}const jo="#182630",Xi=n=>String(n).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),Nn=n=>Number.isFinite(Number(n))?Number(Number(n).toPrecision(6)).toLocaleString("en-US",{maximumFractionDigits:6}):"—",bh=n=>Math.abs(n)>=1e3?`${Nn(n/1e3)} kΩ`:`${Nn(n)} Ω`,qx=n=>n>=.001?`${Nn(n*1e3)} mF`:n>=1e-6?`${Nn(n*1e6)} μF`:`${Nn(n*1e9)} nF`,Xx=n=>n>=1?`${Nn(n)} H`:`${Nn(n*1e3)} mH`;function Yx(){const n=[],e=(h,d="")=>n.push(`<path d="${h.map(([f,g],v)=>`${v?"L":"M"} ${f} ${g}`).join(" ")}" ${d}/>`),t=(h,d,f,g)=>e([[h,d],[f,g]]),i=(h,d,f,g="middle",v=18)=>n.push(`<text x="${h}" y="${d}" text-anchor="${g}" font-size="${v}">${Xi(f)}</text>`),r=(h,d)=>n.push(`<circle cx="${h}" cy="${d}" r="4" fill="${jo}" stroke="none"/>`),s=(h,d)=>n.push(`<circle cx="${h}" cy="${d}" r="4" fill="white"/>`),o=(h,d,f)=>n.push(`<circle data-pin="${Xi(h)}" cx="${d}" cy="${f}" r="7" fill="transparent" stroke="none"><title>${Xi(h)}</title></circle>`);return{elements:n,path:e,line:t,text:i,dot:r,contact:s,pins:h=>Object.entries(h).forEach(([d,[f,g]])=>o(d,f,g)),pin:o,ground:(h,d)=>{n.push('<g data-symbol="ground">'),t(h,d,h,d+12),t(h-15,d+12,h+15,d+12),t(h-10,d+18,h+10,d+18),t(h-4,d+24,h+4,d+24),n.push("</g>")},resistor:(h,d,f,g,v,m,p)=>{n.push(`<g data-component="${Xi(h)}" data-symbol="resistor">`);const x=d===g,b=x?(f+v)/2:(d+g)/2,y=x?[[d,f],[d,b-35]]:[[d,f],[b-35,f]];for(let M=0;M<7;M+=1){const w=b-30+M*10,R=M%2?-8:8;y.push(x?[d+R,w]:[w,f+R])}y.push(x?[d,b+35]:[b+35,f]),y.push([g,v]),e(y),x?(i(d+24,b-8,m,"start"),i(d+24,b+18,bh(p),"start",16)):(i(b,f-24,m),i(b,f+30,bh(p),"middle",16)),n.push("</g>")},source:({id:h,x:d,y:f,top:g,bottom:v,name:m,value:p,polarity:x=1,kind:b="voltage",state:y="active",labelSide:M=-1,frequency:w})=>{n.push(`<g data-component="${Xi(h)}" data-symbol="${Xi(b)}-source" data-source-state="${Xi(y)}" data-polarity="${x}">`);const R=d+M*56;y==="short"?(t(d,g,d,v),i(R,f-7,m),i(R,f+18,"0 V","middle",16)):y==="open"?(t(d,g,d,f-15),t(d,f+15,d,v),s(d,f-15),s(d,f+15),i(R,f-7,m),i(R,f+18,"open","middle",16)):(t(d,g,d,f-28),t(d,f+28,d,v),n.push(`<circle cx="${d}" cy="${f}" r="28" fill="white"/>`),b==="current"?(t(d,f+15,d,f-14),n.push(`<path d="M ${d} ${f-16} L ${d-5} ${f-7} L ${d+5} ${f-7} Z" fill="${jo}" stroke="none"/>`)):b==="sine"?n.push(`<path d="M ${d-16} ${f} C ${d-11} ${f-16}, ${d-5} ${f-16}, ${d} ${f} C ${d+5} ${f+16}, ${d+11} ${f+16}, ${d+16} ${f}"/>`):(t(d-6,f-10,d+6,f-10),t(d-6,f+10,d+6,f+10),t(d,f+(x>0?-16:4),d,f+(x>0?-4:16))),i(R,f-8,m),i(R,f+18,p,"middle",16),w!==void 0&&i(R,f+42,`${Nn(w)} Hz`,"middle",14)),n.push("</g>")}}}function jx(n,e){const{line:t,path:i,source:r,resistor:s,ground:o,dot:a,text:c,pins:l}=n,u=120,h=330;if(e.representation==="original")r({id:"s",x:110,y:225,top:u,bottom:h,name:"Vs",value:"12 V"}),t(110,u,210,u),s("r1",210,u,370,u,"R₁",1e3),t(370,u,650,u),s("r2",440,u,440,h,"R₂",1e3),s("load",650,u,650,h,"RL",e.load),t(110,h,650,h),a(440,u),a(440,h),a(300,h),o(300,h),c(448,96,"A","start"),l({"s+":[110,u],"s-":[110,h],r1a:[210,u],r1b:[370,u],r2a:[440,u],r2b:[440,h],loada:[650,u],loadb:[650,h],gnd:[300,h]});else if(e.representation==="thevenin")r({id:"s",x:170,y:225,top:u,bottom:h,name:"VTh",value:`${Nn(e.equivalentVoltage)} V`}),t(170,u,280,u),s("req",280,u,480,u,"RTh",e.equivalentResistance),t(480,u,620,u),s("load",620,u,620,h,"RL",e.load),t(170,h,620,h),o(395,h),a(395,h),c(630,100,"A","start"),l({"s+":[170,u],"s-":[170,h],reqa:[280,u],reqb:[480,u],loada:[620,u],loadb:[620,h],gnd:[395,h]});else if(e.representation==="norton")r({id:"s",x:140,y:225,top:u,bottom:h,name:"IN",value:`${Nn(e.nortonCurrent)} mA`,kind:"current"}),t(140,u,650,u),s("req",395,u,395,h,"RN",e.equivalentResistance),s("load",650,u,650,h,"RL",e.load),t(140,h,650,h),a(395,u),a(395,h),a(270,h),o(270,h),c(405,96,"A","start"),l({"s+":[140,u],"s-":[140,h],reqa:[395,u],reqb:[395,h],loada:[650,u],loadb:[650,h],gnd:[270,h]});else throw new RangeError("Unknown equivalent circuit representation.")}function Zx(n,e){const{line:t,source:i,resistor:r,ground:s,dot:o,text:a,pins:c}=n,l=u=>u?"active":e.replacement==="open"?"open":"short";i({id:"a",x:120,y:225,top:120,bottom:330,name:"V₁",value:`${Nn(e.v1)} V`,state:l(e.sourceMode!=="b")}),i({id:"b",x:660,y:225,top:120,bottom:330,name:"V₂",value:`${Nn(e.v2)} V`,polarity:-1,labelSide:1,state:l(e.sourceMode!=="a")}),t(120,120,200,120),r("r1",200,120,320,120,"R₁",1e3),t(320,120,460,120),r("r2",460,120,580,120,"R₂",1e3),t(580,120,660,120),r("load",390,120,390,330,"R₃",1e3),t(120,330,660,330),o(390,120),o(390,330),o(250,330),s(250,330),a(400,96,"A","start"),c({"a+":[120,120],"a-":[120,330],"b+":[660,120],"b-":[660,330],r1a:[200,120],r1b:[320,120],r2a:[460,120],r2b:[580,120],loada:[390,120],loadb:[390,330],gnd:[250,330]})}function Kx(n,e){const{elements:t,line:i,path:r,source:s,resistor:o,ground:a,dot:c,contact:l,text:u,pins:h}=n,d=e.configuration==="inverting",f=d?180:230;s({id:"signal",x:90,y:285,top:f,bottom:345,name:"Vin",value:`${Nn(e.amplitude)} Vpk`,kind:"sine",frequency:e.frequency}),d?(i(90,180,150,180),o("rin",150,180,300,180,"Rin",e.rin),i(300,180,400,180),r([[400,230],[370,230],[370,345],[90,345]]),a(230,345),c(230,345)):(i(90,230,400,230),o("rin",170,180,300,180,"Rin",e.rin),i(300,180,400,180),a(170,180),a(90,345)),r([[340,180],[340,80],[400,80]]),o("rf",400,80,550,80,"Rf",e.rf),r([[550,80],[620,80],[620,205]]),i(550,205,660,205),c(340,180),c(620,205),t.push('<g data-component="op" data-symbol="op-amp">'),t.push('<path d="M 400 140 L 400 270 L 550 205 Z" fill="white"/>'),i(410,180,420,180),i(410,230,420,230),i(415,225,415,235),u(447,212,"U₁","middle",16),i(480,147,480,175),i(480,235,480,285),u(480,130,`+${Nn(e.rail)} V`,"middle",16),u(480,309,`−${Nn(e.rail)} V`,"middle",16),t.push("</g>"),l(660,205),u(671,210,"Vout","start");const g=d?[230,345]:[90,345];h({"signal+":[90,f],"signal-":[90,345],rina:[d?150:170,180],rinb:[300,180],rfa:[400,80],rfb:[550,80],"op-":[400,180],"op+":[400,230],out:[550,205],vp:[480,147],vn:[480,285],"plus+":[480,147],"minus-":[480,285],"plus-":g,"minus+":g,gnd:g})}function Jx(n,e){const{elements:t,line:i,path:r,source:s,resistor:o,ground:a,dot:c,contact:l,text:u,pins:h}=n;s({id:"s",x:100,y:235,top:120,bottom:340,name:"Vs",value:"5 V"}),i(100,120,235,120),r([[235,200],[190,200],[190,340]]),i(300,160,365,160),o("r",365,160,535,160,"R",e.resistance),i(535,160,650,160),i(100,340,650,340),a(390,340),c(390,340),c(190,340),t.push(`<g data-component="sw" data-symbol="spdt" data-switch-position="${e.charging?"source":"return"}">`),i(300,160,235,e.charging?120:200),l(235,120),l(235,200),l(300,160),u(280,90,"S₁"),u(222,103,"5 V","end",15),u(222,224,"0 V","end",15),t.push("</g>"),e.kind==="RC"?(t.push('<g data-component="storage" data-symbol="capacitor">'),i(650,160,650,242),i(626,242,674,242),i(626,258,674,258),i(650,258,650,340),u(692,242,"C","start"),u(692,269,qx(e.capacitance),"start",16),t.push("</g>")):(t.push('<g data-component="storage" data-symbol="inductor">'),i(650,160,650,218),t.push('<path d="M 650 218 c -18 0 -18 16 0 16 c -18 0 -18 16 0 16 c -18 0 -18 16 0 16 c -18 0 -18 16 0 16"/>'),i(650,282,650,340),u(682,242,"L","start"),u(682,269,Xx(e.inductance),"start",16),t.push("</g>")),u(660,143,"A","start"),h({"s+":[100,120],"s-":[100,340],supply:[235,120],return:[235,200],common:[300,160],ra:[365,160],rb:[535,160],storagea:[650,160],storageb:[650,340],gnd:[390,340]})}function wd(n,e={},{voltages:t}={}){if(!An[n])throw new RangeError(`Unknown schematic module: ${n}`);const i={...An[n].defaults,...e},r=Yx();n==="thevenin"?jx(r,i):n==="superposition"?Zx(r,i):n==="opamp"?Kx(r,i):Jx(r,i);const s={thevenin:`${i.representation==="original"?"Original voltage-divider":i.representation==="thevenin"?"Thévenin equivalent":"Norton equivalent"} circuit`,superposition:"Two-source superposition circuit; source two has its positive terminal grounded",opamp:`${i.configuration==="inverting"?"Inverting":"Non-inverting"} amplifier circuit with separate positive and negative supply pins`,transient:`Series ${i.kind} circuit with an SPDT source and closed return path`},o=Xi(s[n]);return`<svg xmlns="http://www.w3.org/2000/svg" class="ee-schematic" viewBox="0 0 780 430" width="100%" style="display:block;height:auto;aspect-ratio:780 / 430" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${o}"><title>${o}</title><rect width="780" height="430" fill="white"/><g fill="none" stroke="${jo}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" font-family="Arial, Helvetica, sans-serif"><style>.ee-schematic text{fill:${jo};stroke:none;font-weight:400}</style>${r.elements.join("")}</g></svg>`}const sa=document.querySelector("#app"),se=Gd();let yr={kind:"checking",supported:!1,active:!1,message:"Checking headset…"},St,Cl=!1,hs=null,mi=!1,dn={fraction:.5,panel:0,active:!1},Qr=null,Td="vdc";const At=n=>String(n??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),Qx=n=>({circuit:'<path d="M3 8h5l3-5 5 10 3-5h5M7 18h15M7 15v6M22 15v6"/>',vr:'<path d="M4 6h20l2 13h-7l-5-4-5 4H2Z"/><circle cx="9" cy="11" r="2"/><circle cx="19" cy="11" r="2"/>',book:'<path d="M4 4h8a4 4 0 0 1 4 3v17a4 4 0 0 0-4-3H4Zm12 3a4 4 0 0 1 4-3h5v17h-5a4 4 0 0 0-4 3"/>',reset:'<path d="M6 8a9 9 0 1 1-1 10M6 3v6h6"/>',arrow:'<path d="M7 21 21 7M7 7h14v14"/>',play:'<path d="m10 5 13 9-13 9Z"/>',check:'<path d="m6 14 5 5L23 7"/>'})[n]||"",Pi=n=>`<svg viewBox="0 0 28 28" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${Qx(n)}</svg>`;sa.innerHTML=`
  <aside class="sidebar">
    <a class="brand" href="#" aria-label="MetaHub Circuits lab">${Pi("circuit")}<span>MetaHub<span class="brand-sub">Circuits lab</span></span></a>
    <div class="sidebar-caption">Electrical Circuits I</div>
    <nav aria-label="Laboratory modules">${Object.entries(An).map(([n,e])=>`<button class="module-link" data-action="module:${n}" data-module="${n}"><span class="lab-number">${e.number}</span><span><strong>${e.name}</strong><small>${e.short}</small></span><span class="module-status" aria-hidden="true"></span></button>`).join("")}</nav>
    <div class="sidebar-bottom"><div class="course-mark">ELEN <strong>221</strong></div><button class="text-button" id="guide-button">Help ${Pi("arrow")}</button><span class="prototype-tag">Lab build · v0.8</span></div>
  </aside>
  <main class="workspace">
    <header class="topbar"><div class="breadcrumb">Lab <span id="lab-number">05</span><span class="slash">/</span><span id="topic-label"></span></div><div class="header-actions"><button class="button vr-button" id="vr-button">${Pi("vr")} Checking VR…</button></div></header>
    <div class="vr-status-row"><span id="vr-status" role="status">Checking headset…</span><button id="headset-help" class="text-button">Open on a headset</button></div>
    <section class="intro"><div><h1 id="module-title"></h1><p id="module-description"></p></div><div class="mode-switch" aria-label="Learning mode"><button data-action="explore" class="active">Explore</button><button data-action="build">Build circuit</button></div></section>
    <section class="experiment-brief" aria-label="Experiment aim"><span>Your experiment</span><p id="experiment-aim"></p><details><summary>Experiment steps</summary><div id="experiment-steps"></div></details></section>
    <div class="lab-layout">
      <section class="bench-panel" aria-label="Interactive circuit experiment">
        <div class="panel-header"><div class="bench-tabs"><button id="bench-tab" class="active">3D bench</button><button id="reference-tab">Schematic</button><button id="vr-preview-tab" hidden title="Desktop check of panel layout only">Panel preview</button></div><div class="bench-toolbar"><span id="circuit-status" class="status-tag">Circuit connected</span><button class="icon-button" id="reset-view" aria-label="Reset 3D view">${Pi("reset")}</button></div></div>
        <div class="stage-wrap"><div id="bench"></div><div id="schematic" hidden></div><div class="stage-top"><span id="bench-caption">Original circuit</span><span id="hover-label" hidden></span></div><div class="stage-bottom"><span>Drag empty space to look around · Scroll to zoom</span><span>Drag a probe to a contact · Drag a dial to turn it</span></div></div>
        <div class="bench-strip"><p id="object-help">Use the equipment on the bench. The meter reads the voltage between its two test tips.</p><button class="button subtle" data-action="undo" title="Undo last wire or probe change">Undo</button><button class="button subtle" data-action="cancel" id="cancel-wire" title="Cancel selection (Esc)">Cancel lead</button></div>
        <div class="bench-help"><span id="bench-help"></span></div>
        <div id="readings" class="readings"></div>
      </section>
      <aside class="controls-panel"><details id="keyboard-controls"><summary>Keyboard controls</summary><p class="hint">The same equipment settings, for keyboard and touch use.</p><div class="patch-toolbar" aria-label="Keyboard bench tools"><button data-action="tool:select" data-tool="select">Select</button><button data-action="tool:wire" data-tool="wire">Connect contacts</button><button data-action="tool:red" data-tool="red">Move V tip</button><button data-action="tool:black" data-tool="black">Move COM tip</button><button data-action="tool:remove" data-tool="remove">Remove lead</button></div><div class="control-heading"><div><h2>Equipment settings</h2></div><span class="small-circuit">${Pi("circuit")}</span></div><div id="part-controls" hidden></div><div id="controls"></div><div id="model-note" class="model-note"></div></details></aside>
    </div>
    <div class="lower-layout">
      <section class="chart-panel"><div class="chart-heading"><div><h2 id="chart-title"></h2></div><div id="chart-legend"></div></div><p id="chart-subtitle"></p><p id="chart-use" class="chart-use"></p><div id="source-comparison" hidden></div><div id="scope-controls" hidden></div><div id="chart" tabindex="0" aria-label="Interactive measurement graph"></div><output id="trace-reading" class="trace-reading" aria-live="polite"></output></section>
      <section class="challenge-panel"><h2>At the bench</h2><div id="activity-controls"></div><div class="challenge-actions"><button class="button subtle" data-action="check-wiring">Check connections</button><button class="button subtle" id="new-attempt" data-action="reset-circuit" hidden>Clear circuit</button></div><p class="feedback" id="feedback" role="status" aria-live="polite"></p></section>
    </div>
    <section class="connection-panel"><details><summary>Wiring list and keyboard connections</summary><div class="connection-content"><div><h3>Connect a patch lead</h3><div class="wiring-form"><label>From<select id="wire-from"></select></label><label>To<select id="wire-to"></select></label><button class="button primary" id="add-wire">Connect</button></div><div class="wiring-form"><label>Meter V tip (red)<select id="red-probe"></select></label><label>Meter COM tip (black)<select id="black-probe"></select></label></div><div class="connection-buttons"><button class="button subtle" data-action="check-wiring">Check connections</button><button class="button subtle" data-action="clear">Clear leads</button><button class="button subtle" data-action="restore" id="restore-button">Use shown circuit</button></div></div><div><h3>Connected leads</h3><div id="wire-list"></div></div></div></details></section>
    <footer class="workspace-footer"><span><i class="footer-dot"></i> Desktop 3D / VR</span><span>Ideal circuit models</span><button id="model-guide">Model limits ${Pi("arrow")}</button></footer>
  </main>
  <dialog id="headset-dialog" aria-labelledby="headset-title"><div class="dialog-header"><h2 id="headset-title">Open the lab in VR</h2><button class="icon-button" data-close aria-label="Close VR setup">×</button></div><p>Open this lab in your headset’s browser, then select <strong>Enter VR</strong>. The circuit bench and all four experiments open around you.</p><div id="headset-address" class="headset-address"></div><ol class="headset-steps"><li>Choose a lab and Explore or Build circuit.</li><li>Enter VR and accept the headset’s request.</li><li>Grip a probe to pick it up. Bring its tip to a contact and release. Hold a dial and turn your wrist to adjust it.</li><li>Use the left stick to move and the right stick to turn. You can also walk around within your play area.</li></ol><p id="headset-status" class="headset-status" role="status"></p><p>Your circuit and readings stay when you leave VR.</p><div class="dialog-actions"><button class="button primary" id="headset-enter" hidden>Enter VR</button><button class="button subtle" id="headset-check">Check headset</button><a id="headset-fullscreen" class="button subtle" target="_blank" rel="noopener" hidden>Open lab full screen</a></div></dialog>
  <dialog id="guide-dialog"><div class="dialog-header"><div><span class="eyebrow">ELEN 221</span><h2>Lab guide</h2></div><button class="icon-button" data-close aria-label="Close guide">×</button></div><div class="guide-body"><h3>Use the equipment</h3><p>Explore starts with a wired circuit. Build circuit starts with loose connections. Follow the experiment steps above the bench.</p><ol><li>Drag from one contact to another to add a lead. Grab an existing lead to move or remove it. Undo puts the last connection back.</li><li>Pick up a test probe and put its metal tip on a contact. The red lead runs to V and the black lead to COM on the meter. The reading is V minus COM. Swap the tips to reverse the sign.</li><li>Turn the dials on the equipment to change values. Flip the circuit switch to change its state. In the amplifier lab, use the two scope probes to compare input and output.</li><li>Drag on a graph to choose a load or inspect an acquired trace. The graph labels state what is being calculated or measured. Put your answers on paper.</li></ol><h3>In VR</h3><p id="vr-help-status"></p><p>Open the HTTPS link in your headset browser and select Enter VR. Grip a probe to pick it up, move it to a contact, and release. Hold a dial and turn your wrist. Use the left stick to move and the right stick to turn. You can also walk within your play area. Recenter brings you back to the bench.</p><h3>Keyboard and mouse</h3><p>Drag empty space to orbit and scroll to zoom. Drag equipment to use it. Keyboard controls below the bench offer the same settings without dragging. Focus the graph and use the arrow keys to move its cursor.</p><h3>Model limits</h3><p>DC resistor circuits are solved from your connections. The amplifier and transient labs support the shown circuit layouts. Disconnected or invalid circuits do not produce valid traces.</p><p>The amplifier uses ideal gain with adjustable supply rails. Its output stays 1 V inside each rail. This model does not include device bandwidth, slew rate, input common-mode limits, component tolerances or output current limits.</p><p>RC and RL models preserve capacitor voltage and inductor current at switching. New run resets stored energy. The instructor must confirm the amplifier configurations against the lab handout, which was not included in the email.</p><p><a href="./docs/module-designs.md" target="_blank" rel="noopener">Instructor guide ↗</a></p></div></dialog>
`;const En=(n,e,t,i=r=>r)=>`<label class="control-label" for="param-${n}">${e}</label><select id="param-${n}" data-param="${n}">${t.map(r=>`<option value="${At(r)}" ${ct(se)[n]===r?"selected":""}>${At(i(r))}</option>`).join("")}</select>`,Ts=(n,e,t)=>`<div class="control-label">${e}</div><div class="segmented">${t.map(([i,r])=>`<button data-action="set:${n}:${i}" class="${ct(se)[n]===i?"active":""}">${r}</button>`).join("")}</div>`,Jt=n=>`<div class="control-block">${n}</div>`;function Ad(){var c,l;const n=document.activeElement,e=(n==null?void 0:n.id)||null,t=n==null?void 0:n.dataset.scopeChannel,i=n==null?void 0:n.dataset.scopeField,r=ct(se),s=se.module;let o="",a="";s==="thevenin"&&(o+=Jt(Ts("representation","Circuit",[["original","Original"],["thevenin","Thévenin"],["norton","Norton"]])),o+=Jt(En("load","Load",Ft.load,u=>`${u} Ω`)+`<div class="range-labels"><span>Smaller load</span><span>Larger load</span></div><input aria-label="Load resistance slider" type="range" min="0" max="6" step="1" value="${Ft.load.indexOf(r.load)}" id="load-slider">`),r.representation==="thevenin"&&(o+=Jt(En("equivalentVoltage","Vth",Ft.equivalentVoltage,u=>`${u} V`))),r.representation==="norton"&&(o+=Jt(En("nortonCurrent","In",Ft.nortonCurrent,u=>`${u} mA`))),r.representation!=="original"?o+=Jt(En("equivalentResistance","Equivalent resistance",Ft.equivalentResistance,u=>`${u} Ω`)):o+='<div class="fixed-values"><span>Source<strong>12 V</strong></span><span>R₁ / R₂<strong>1 kΩ / 1 kΩ</strong></span></div>',a="Use the same loads in each circuit. Peak power and peak efficiency occur at different loads."),s==="superposition"&&(o+=Jt(Ts("sourceMode","Active sources",[["both","Both"],["a","A alone"],["b","B alone"]])),o+=Jt(En("v1","Source A",Ft.v1,u=>`+${u} V`)),o+=Jt(En("v2","Source B",Ft.v2,u=>`−${u} V`)),o+=Jt(Ts("replacement","Inactive source",[["short","Short circuit"],["open","Open circuit"]])),a="An inactive ideal voltage source is a short circuit. Compare it with an open circuit. All resistors are 1 kΩ."),s==="opamp"&&(o+=Jt(Ts("configuration","Circuit",[["inverting","Inverting"],["noninverting","Non-inverting"]])),o+=`<div class="paired-controls">${Jt(En("rin",r.configuration==="inverting"?"Input resistor":"Ground resistor",Ft.rin,u=>`${u/1e3} kΩ`))}${Jt(En("rf","Feedback resistor",Ft.rf,u=>`${u/1e3} kΩ`))}</div>`,o+=Jt(En("amplitude","Input amplitude",Ft.amplitude,u=>`${u} V peak`)),o+=`<div class="paired-controls">${Jt(En("rail","Supply rails",Ft.rail,u=>`±${u} V`))}${Jt(En("frequency","Signal frequency",Ft.frequency,u=>`${u} Hz`))}</div>`,a=`Sine input · 1 V output headroom · ±${r.rail-1} V output limit. Ideal gain. Bandwidth and slew rate are not modelled.`),s==="transient"&&(o+=Jt(Ts("kind","Circuit",[["RC","RC · capacitor"],["RL","RL · inductor"]])),o+=Jt(En("resistance","Series resistance",Ft.resistance,u=>`${u} Ω`)),o+=`<div class="fixed-values"><span>Source<strong>5 V</strong></span><span>${r.kind==="RC"?"Capacitance":"Inductance"}<strong>${r.kind==="RC"?"100 μF":"100 mH"}</strong></span></div>`,o+=Jt(`<div class="control-label">Switch position</div><button class="switch-button ${r.charging?"charging":""}" data-action="switch"><span class="switch-track"><i></i></span>${r.charging?"Source connected":"Closed return loop"}</button>`),o+=`<div class="transient-buttons"><button class="button primary" data-action="play" id="play-button">${Pi("play")}${r.playing?"Pause":"Run"}</button><button class="button subtle" data-action="reset-energy">New run</button></div><div class="time-control"><div><span>Time</span><strong id="simulation-time">${zt(r.time*1e3)} ms</strong></div><input id="time-slider" aria-label="Simulation time in time constants" type="range" min="0" max="5" step="0.01" value="${r.time/qn({...r,source:5}).tau}"><div class="time-shortcuts"><button data-action="one-tau">Go to 1 τ</button><button data-action="five-tau">Go to 5 τ</button><button data-action="replay">Replay</button></div></div>`,o+=Jt(En("speed","Playback speed",Ft.speed,u=>`${u}×`)),a="Voltage, current and energy share one clock. Changing R keeps the same playback scale. New run resets stored energy."),document.querySelector("#controls").innerHTML=o,ty(),ny(),sy(),document.querySelector("#model-note").textContent=a,e?(c=document.getElementById(e))==null||c.focus({preventScroll:!0}):t&&((l=document.querySelector(`[data-scope-channel="${t}"][data-scope-field="${i}"]`))==null||l.focus({preventScroll:!0}))}function Rd(){const n=ct(se);return(se.module==="thevenin"?{load:["load"],req:["equivalentResistance"],s:n.representation==="norton"?["nortonCurrent"]:n.representation==="thevenin"?["equivalentVoltage"]:[]}:se.module==="superposition"?{a:["v1"],b:["v2"]}:se.module==="opamp"?{signal:["amplitude","frequency"],rin:["rin"],rf:["rf"],plus:["rail"],minus:["rail"],op:["configuration"]}:{r:["resistance"],sw:["charging"],storage:["kind"]})[hs]||[]}function ey(){const n=Rd();return Uh(se).filter(e=>n.some(t=>e.id.startsWith(`cycle:${t}`)||e.id.startsWith(`set:${t}:`)||t==="charging"&&e.id==="switch")).map(e=>e.id)}function ty(){const n=document.querySelector("#part-controls"),e=Ct(se).circuit.components.find(i=>i.id===hs);if(n.hidden=!e,!e)return;const t=Rd();n.innerHTML=`<div class="part-title"><strong>${At(e.label)} · ${At(e.value)}</strong><button id="close-part" aria-label="Close part settings">×</button></div>`+(t.length?t.map(i=>{var a;const r=document.querySelector(`[data-param="${i}"]`);r&&((a=r.closest(".control-block"))==null||a.classList.add("selected-control"));const s={load:"Load",equivalentResistance:"Resistance",equivalentVoltage:"Vth",nortonCurrent:"In",v1:"Source A",v2:"Source B",resistance:"Resistance",rail:"Supply",frequency:"Frequency",amplitude:"Input",rin:"Rin",rf:"Rf"}[i]||i,o={load:"Ω",equivalentResistance:"Ω",equivalentVoltage:"V",nortonCurrent:"mA",v1:"V",v2:"V",resistance:"Ω",rail:"V",frequency:"Hz",amplitude:"V peak",rin:"Ω",rf:"Ω"}[i]||"";return Ft[i]?`<div class="part-adjust"><button data-action="cycle:${i}:-1" aria-label="Decrease ${At(i)}">−</button><span>${At(s)}: ${At(ct(se)[i])} ${o}</span><button data-action="cycle:${i}" aria-label="Increase ${At(i)}">+</button></div>`:i==="charging"?'<button class="button" data-action="switch">Flip switch</button>':i==="configuration"?`<button class="button" data-action="set:configuration:${ct(se).configuration==="inverting"?"noninverting":"inverting"}">Change amplifier</button>`:i==="kind"?`<button class="button" data-action="set:kind:${ct(se).kind==="RC"?"RL":"RC"}">Use ${ct(se).kind==="RC"?"RL":"RC"}</button>`:""}).join(""):"<p>Fixed part. Connect its terminals with the Connect tool.</p>")}function ny(){const n=An[se.module],t=`<ol class="experiment-steps">${(n.steps||[]).map(i=>`<li>${At(i)}</li>`).join("")}</ol>`;document.querySelector("#experiment-steps").innerHTML=t,document.querySelector("#experiment-aim").textContent=n.purpose||n.challenge,document.querySelector("#activity-controls").innerHTML=`<p>${At(n.principle)}</p><p class="paper-note">Use the equipment to test each step. Keep readings and answers on paper.</p>`}function iy(){const n=nl(se),e=ct(se);document.querySelector("#source-comparison").innerHTML=`<p>Live circuit values at +${e.v1} V / −${e.v2} V. Each view uses your wiring. Select a case to switch the sources on the bench.</p><div class="source-cases">${[["a","A alone"],["b","B alone"],["both","Both sources"]].map(([t,i])=>{var s;const r=(s=n.live)==null?void 0:s[t];return`<button data-action="set:sourceMode:${t}" class="source-case ${e.sourceMode===t?"active":""}"><span>${i}</span><strong>${r!=null&&r.valid?`${zt(r.current*1e3)} mA`:"—"}</strong><small>${r!=null&&r.valid?`${zt(r.voltage)} V`:"Connect the circuit"}</small></button>`}).join("")}</div>`}function ry(){if(se.module==="superposition"){const n=nl(se).live;return["a","b","both"].map(e=>{var t;return`${{a:"A alone",b:"B alone",both:"Both sources"}[e]}: ${(t=n==null?void 0:n[e])!=null&&t.valid?zt(n[e].current*1e3)+" mA":"Connect the circuit"}`})}if(se.module==="opamp"){const n=Oi(se);return[n.ok?`Scope: ${n.running?"Run":"Hold"}${n.stale?" · earlier settings":""}`:`Scope: ${n.error}`]}return[]}function sy(){var o;const n=document.querySelector("#scope-controls"),e=((o=n.querySelector("details"))==null?void 0:o.open)||!1;if(n.hidden=se.module!=="opamp",se.module!=="opamp")return;const t=ct(se),i=Ct(se),r=Oi(se),s=(a,c,l)=>`<label>${l}<select data-scope-channel="${a}" data-scope-field="${c}" aria-label="${l}"><option value="">Disconnected</option>${i.circuit.pins.map(u=>`<option value="${At(u.id)}" ${i.scope[a][c]===u.id?"selected":""}>${At(u.name)}</option>`).join("")}</select></label>`;n.innerHTML=`<details class="scope-keyboard" ${e?"open":""}><summary>Scope keyboard controls</summary><div class="scope-top"><strong>Scope</strong><div><button class="button" data-action="scope-toggle">${t.scopeRunning?"Hold":"Run scope"}</button><button class="button" data-action="scope-autoscale">Auto scale</button></div></div><p class="scope-status ${r.error?"warning":""}">${At(r.error||(r.ok?`${r.running?"Running":"Held capture"}${r.stale?" · settings have changed":""} · ${r.trigger.found?"Triggered":"No trigger crossing"}`:"Connect the scope probes."))}</p>
    <div class="scope-channels">${["ch1","ch2"].map((a,c)=>`<fieldset><legend>${a.toUpperCase()} · ${c?"output":"input"}</legend><p class="hint">Move the probe and ground clip on the bench.</p>${s(a,"signal",`${a.toUpperCase()} tip`)}${s(a,"ground",`${a.toUpperCase()} ground`)}${En(`${a}Scale`,"V / div",Ft[`${a}Scale`],l=>`${l} V`)}</fieldset>`).join("")}</div>
    <div class="scope-time">${Jt(En("timeDiv","Time / div",Ft.timeDiv,a=>`${a} ms`))}${Jt(En("triggerEdge","Trigger edge",["rising","falling"],a=>a==="rising"?"Rising":"Falling"))}<label class="control-block"><span class="control-label">Trigger level · CH1</span><div class="number-unit"><input data-param="triggerLevel" aria-label="Trigger level" type="number" step="0.1" min="-15" max="15" value="${t.triggerLevel}"><span>V</span></div></label></div><p class="hint">Both ground clips share circuit GND. Scales change the view, not the circuit.</p></details>`}function Mh(n,e=dn.panel){const t=dn.active?Ih(se,dn.fraction,e):null,i=t?{x:dn.fraction,label:t.text,xLabel:t.xLabel,readings:t.readings}:null,r=n.interaction||{thevenin:"load",superposition:"source",opamp:"scope",transient:"time"}[se.module];if(n.bars){const s=Math.max(...n.bars.map(o=>Math.abs(o.value??0)),1)*1.25;return{title:n.title,interaction:r,cursor:i,subtitle:n.subtitle,xLabel:"Source case",yLabel:"Current (mA)",xTicks:n.bars.map((o,a)=>({position:.18+a*.3,label:o.name})),yTicks:[-s,0,s].map(o=>({position:.5+o/(2*s),label:zt(o,2)})),series:n.bars.filter(o=>Number.isFinite(o.value)).map(o=>{const a=n.bars.indexOf(o);return{color:o.color,points:[[.18+a*.3,.5],[.18+a*.3,.5+o.value/(2*s)]]}})}}return{title:n.title,interaction:r,cursor:i,id:n.id,subtitle:n.subtitle,xLabel:n.xLabel,yLabel:n.yLabel,xDivisions:se.module==="opamp"?10:4,yDivisions:se.module==="opamp"?8:4,xTicks:Array.from({length:se.module==="opamp"?6:5},(s,o)=>{const a=se.module==="opamp"?5:4;return{position:o/a,label:zt(n.xMax*o/a,2)}}),yTicks:Array.from({length:5},(s,o)=>({position:o/4,label:zt(n.yMin+(n.yMax-n.yMin)*o/4,2)})),marker:n.marker?{x:n.marker.x/n.xMax,y:(n.marker.y-n.yMin)/(n.yMax-n.yMin)}:null,reference:n.tau?{x:n.tau/n.xMax,label:"1 τ"}:null,series:n.series.map(s=>({name:s.name,color:s.color,points:s.points.map(([o,a])=>[o/n.xMax,(a-n.yMin)/(n.yMax-n.yMin)])}))}}function Zo(n,e=0,t=!0){const i=Jo(se);if(dn={fraction:Math.min(1,Math.max(0,n)),panel:e,active:!0},t&&se.module==="thevenin"){const r=dn.fraction*i.xMax,s=Ft.load.reduce((o,a)=>Math.abs(a-r)<Math.abs(o-r)?a:o);oi(se,"load",s),dn.fraction=s/i.xMax}else t&&se.module==="transient"?(Dh(se,`scrub:${dn.fraction*i.xMax}`),dn.fraction=ct(se).time*1e3/i.xMax):t&&se.module==="superposition"&&oi(se,"sourceMode",["a","b","both"][Math.min(2,Math.floor(dn.fraction*3))]);Ad(),Pl(),tr()}function Cd(n,e=Qr){if(!e)return;const t=(n.clientX-e.bounds.left)/e.bounds.width*640;Zo((t-52)/568,e.panel)}const es=document.querySelector("#chart");es.addEventListener("pointerdown",n=>{const e=n.target.closest("svg[data-plot-index]");!e||n.button!==0||(n.preventDefault(),Qr={panel:Number(e.dataset.plotIndex),bounds:e.getBoundingClientRect(),pointerId:n.pointerId},es.setPointerCapture(n.pointerId),es.focus({preventScroll:!0}),Cd(n))});es.addEventListener("pointermove",n=>{(Qr==null?void 0:Qr.pointerId)===n.pointerId&&Cd(n)});for(const n of["pointerup","pointercancel","lostpointercapture"])es.addEventListener(n,()=>{Qr=null});es.addEventListener("keydown",n=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(n.key))return;if(n.preventDefault(),se.module==="thevenin"){const t=Ft.load,i=t.indexOf(ct(se).load),r=n.key==="Home"?0:n.key==="End"?t.length-1:Math.max(0,Math.min(t.length-1,i+(n.key==="ArrowRight"?1:-1)));Zo(t[r]/Jo(se).xMax,0);return}const e=n.key==="Home"?0:n.key==="End"?1:dn.fraction+(n.key==="ArrowRight"?.02:-.02);Zo(e,dn.panel)});function oy(){const{circuit:n,wires:e,probes:t}=Ct(se),i=n.pins.map(r=>`<option value="${At(r.id)}">${At(r.name)} [${At(r.id)}]</option>`).join("");for(const r of["wire-from","wire-to"]){const s=document.getElementById(r),o=s.value;s.innerHTML=i,n.pins.some(a=>a.id===o)&&(s.value=o)}for(const r of["red","black"]){const s=document.getElementById(`${r}-probe`);s.innerHTML='<option value="">Disconnected</option>'+i,s.value=t[r]||""}document.querySelector("#wire-list").innerHTML=e.length?e.map(([r,s],o)=>`<div class="wire-row"><span><code>${At(r)}</code> <span>↔</span> <code>${At(s)}</code></span><button data-remove-wire="${o}" aria-label="Remove connection ${At(r)} to ${At(s)}">Remove</button></div>`).join(""):'<p class="empty-wires">No leads connected. Start with the common ground connections.</p>',document.querySelector("#restore-button").hidden=se.mode!=="explore"}function Sh(n,e=0){if(n.bars){const v=Math.max(...n.bars.map(x=>Math.abs(x.value??0)),1)*1.25,m=18+162/2,p=162/(2*v);return`<svg data-plot-index="${e}" viewBox="0 0 640 218" role="img" aria-label="${At(n.title)}">${[-v,0,v].map(x=>`<line x1="52" y1="${m-x*p}" x2="620" y2="${m-x*p}" class="grid-line"/><text x="43" y="${m-x*p+4}" text-anchor="end">${zt(x,1)}</text>`).join("")}${n.bars.map((x,b)=>{const y=127+b*175,M=m-(x.value??0)*p;return Number.isFinite(x.value)?`<rect x="${y}" y="${Math.min(m,M)}" width="72" height="${Math.max(1,Math.abs(x.value*p))}" rx="3" fill="${x.color}"/><text x="${y+36}" y="${x.value>=0?M-9:M+17}" text-anchor="middle" class="bar-value">${zt(x.value)} mA</text><text x="${y+36}" y="203" text-anchor="middle">${x.name}</text>`:`<text x="${y+36}" y="${m-8}" text-anchor="middle">—</text><text x="${y+36}" y="203" text-anchor="middle">${At(x.name)}</text>`}).join("")}</svg>`}const u=v=>52+v/n.xMax*568,h=v=>180-(v-n.yMin)/(n.yMax-n.yMin)*162;let d=`<svg data-plot-index="${e}" viewBox="0 0 640 218" role="img" aria-label="${At(n.title)}"><defs><clipPath id="plot-clip-${e}"><rect x="52" y="18" width="568" height="162"/></clipPath></defs>`;const f=se.module==="opamp"?10:4,g=se.module==="opamp"?8:4;for(let v=0;v<=f;v++){const m=n.xMax*v/f;d+=`<line x1="${u(m)}" y1="18" x2="${u(m)}" y2="180" class="grid-line"/>`,(f===4||v%2===0)&&(d+=`<text x="${u(m)}" y="196" text-anchor="middle">${zt(m,2)}</text>`)}for(let v=0;v<=g;v++){const m=n.yMin+(n.yMax-n.yMin)*v/g;d+=`<line x1="52" y1="${h(m)}" x2="620" y2="${h(m)}" class="grid-line"/>`,(g===4||v%2===0)&&(d+=`<text x="42" y="${h(m)+4}" text-anchor="end">${zt(m,2)}</text>`)}if(d+=`<g clip-path="url(#plot-clip-${e})">`,n.limits)for(const v of n.limits)d+=`<line x1="52" y1="${h(v)}" x2="620" y2="${h(v)}" stroke="#c6a885" stroke-dasharray="4 5"/>`;n.tau&&(d+=`<line x1="${u(n.tau)}" y1="18" x2="${u(n.tau)}" y2="180" stroke="#bb7549" stroke-dasharray="4 5"/><text x="${u(n.tau)+5}" y="30">1 τ</text>`);for(const v of n.series)d+=`<path d="${v.points.map(([m,p],x)=>`${x?"L":"M"}${u(m).toFixed(2)},${h(p).toFixed(2)}`).join(" ")}" fill="none" stroke="${v.color}" stroke-width="2.6"/>`;if(n.marker&&Number.isFinite(n.marker.y)&&(d+=`<circle cx="${u(n.marker.x)}" cy="${h(n.marker.y)}" r="5" fill="#fff" stroke="#b77636" stroke-width="2.5"/>`),dn.active){const v=u(dn.fraction*n.xMax);d+=`<line x1="${v}" y1="18" x2="${v}" y2="180" class="trace-cursor"/><rect x="${v-5}" y="18" width="10" height="7" fill="#263e50"/>`}return d+=`</g><text x="${52+568/2}" y="215" text-anchor="middle" class="axis-label">${At(n.xLabel)}</text><text x="52" y="11" class="axis-label">${At(n.yLabel)}</text></svg>`,d}function Pl(){document.querySelector("#schematic").innerHTML='<div class="schematic-heading"><strong>Reference circuit</strong><span>Values follow the settings.</span></div>'+wd(se.module,ct(se))+"<p>This is the target wiring. Your leads and voltage probes are on the 3D bench.</p>"}function tr(){var u,h,d;const n=Ki(se),e=ct(se),t=Ct(se),i=Jo(se),r=nf(se).map((f,g)=>g===0&&Td==="off"?{...f,value:"—",unit:"",detail:"Meter off"}:f);document.querySelector("#readings").innerHTML=r.map(f=>`<div class="reading"><span>${f.label}</span><div>${At(f.value)}<small>${f.unit}</small></div><p>${At(f.detail)}</p></div>`).join("");const s=document.querySelector("#circuit-status");s.textContent=n.ok?t.correct?"Circuit connected":"Check wiring":"Connect the circuit",s.classList.toggle("warning",!n.ok||!t.correct),document.querySelector("#chart-title").textContent=i.title,document.querySelector("#chart-subtitle").textContent=i.subtitle,document.querySelector("#chart-use").textContent={thevenin:"Drag along the graph to set the load. Watch the meter and power change together.",superposition:"Select a source view to switch the circuit. The signed currents show how the sources add or cancel.",opamp:"Drag along the trace to read voltage at a chosen time. Turn the scope dials to change its scale.",transient:"The trace grows while the circuit runs. Drag on the trace to pause and inspect voltage, current and energy at the same instant."}[se.module],document.querySelector("#chart-legend").innerHTML=i.series.map(f=>`<span><i style="background:${f.color}"></i>${At(f.name)}</span>`).join(""),document.querySelector("#chart").innerHTML=(u=i.panels)!=null&&u.length?i.panels.map((f,g)=>`<div class="trace-panel"><h3>${At(f.title)}</h3>${Sh(f,g)}${f.subtitle?`<p>${At(f.subtitle)}</p>`:""}</div>`).join(""):Sh(i);const o=dn.active?Ih(se,dn.fraction,dn.panel):null;if(document.querySelector("#trace-reading").textContent=(o==null?void 0:o.text)||"Use the graph to inspect a reading. Arrow keys also move the cursor.",document.querySelector("#feedback").textContent=!n.ok&&se.mode==="explore"?n.error:se.feedback,se.module==="transient"){document.querySelector("#simulation-time").textContent=`${zt(e.time*1e3)} ms`;const f=document.querySelector("#time-slider");document.activeElement!==f&&(f.value=e.time/qn({...e,source:5}).tau),document.querySelector("#play-button").innerHTML=Pi("play")+(e.playing?"Pause":"Run")}for(const f of document.querySelectorAll("[data-tool]"))f.classList.toggle("active",f.dataset.tool===se.tool);const a=Mh(i);(h=i.panels)!=null&&h.length&&(a.panels=i.panels.map(Mh));const c={select:"Drag a dial to change its value. Drag a probe onto a contact to take a reading.",wire:se.selectedTerminal?`From ${((d=t.circuit.pins.find(f=>f.id===se.selectedTerminal))==null?void 0:d.name)||se.selectedTerminal} → select the next terminal. Esc cancels.`:"Drag from one contact to another to connect a lead. Drag a test probe onto a contact to measure voltage.",red:"Keyboard placement: choose the contact for the meter’s V tip.",black:"Keyboard placement: choose the contact for the meter’s COM tip.",remove:"Click a lead to remove it. Undo restores the last change.",ch1:"Click a terminal for the CH1 scope tip.",ch2:"Click a terminal for the CH2 scope tip.",scopeGround:"Click circuit ground for the selected scope ground lead."};document.querySelector("#bench-help").textContent=c[se.tool]||se.feedback,document.querySelector("#cancel-wire").hidden=!se.selectedTerminal,document.querySelector("#source-comparison").hidden=se.module!=="superposition",se.module==="superposition"&&iy();const l=[...r.map(f=>`${f.label}: ${f.value} ${f.unit}`),"Grip a probe, bring its tip to a contact, then release. Hold and turn a dial to adjust it.","Left stick: move. Right stick: turn. Walk within your play area to inspect the bench.",se.module==="transient"?`Time: ${zt(e.time*1e3)} ms | playback ${e.speed}×`:"",n.ok?"":n.error,`Experiment: ${An[se.module].challenge}`,`Feedback: ${se.feedback}`,...ry()].filter(Boolean);St==null||St.update({module:se.module,mode:se.mode,parameters:{...e},measurement:n,metrics:r,options:Ft,experiment:{challenge:An[se.module].challenge,steps:An[se.module].steps||[]},components:t.circuit.components,wires:t.wires,probes:t.probes,selectedTerminal:se.selectedTerminal,tool:se.tool,scope:t.scope,selectedPart:hs,partActions:ey(),schematicDataURL:`data:image/svg+xml;charset=utf-8,${encodeURIComponent(wd(se.module,e))}`,live:{title:`Lab ${An[se.module].number} · ${An[se.module].name}`,lines:l},actions:Uh(se),graph:a,rawGraph:i})}function In(){const n=An[se.module],e=ct(se);document.querySelector(".lower-layout").classList.toggle("scope-layout",se.module==="opamp"),document.querySelector("#lab-number").textContent=n.number,document.querySelector("#topic-label").textContent=n.topic,document.querySelector("#module-title").textContent=n.title,document.querySelector("#module-description").textContent=n.description,document.querySelector("#new-attempt").hidden=se.mode!=="build",document.querySelector("#bench-caption").textContent=e.representation?`${e.representation} circuit`:e.configuration?`${e.configuration} amplifier`:e.kind?`${e.kind} circuit`:"Two-source circuit";for(const t of document.querySelectorAll(".module-link")){const i=t.dataset.module===se.module;t.classList.toggle("active",i),t.setAttribute("aria-current",i?"page":"false")}for(const t of document.querySelectorAll(".mode-switch button"))t.classList.toggle("active",t.dataset.action===se.mode),t.setAttribute("aria-pressed",t.dataset.action===se.mode?"true":"false");Ad(),oy(),Pl(),tr()}function qs(n){var e;/^(module:|explore$|build$|undo$|clear$|restore$|reset-circuit$|set:(representation|kind|configuration):)/.test(n)&&((e=St==null?void 0:St.cancelInteractions)==null||e.call(St)),(n.startsWith("module:")||/set:(representation|kind|configuration):/.test(n))&&(hs=null,dn.active=!1),Dh(se,n),In(),/^(tool:ch[12]|scope-ground:)/.test(n)&&!yr.active&&!mi&&(Ys(!1),document.querySelector("#bench").scrollIntoView({block:"center",behavior:"instant"}))}sa.addEventListener("click",n=>{if(n.target.closest("#close-part")){hs=null,In();return}const e=n.target.closest("[data-action]");if(e){qs(e.dataset.action);return}const t=n.target.closest("[data-remove-wire]");if(t){const i=se.tool;se.tool="remove",il(se,Number(t.dataset.removeWire)),se.tool=i,In();return}n.target.closest("[data-close]")&&n.target.closest("dialog").close()});sa.addEventListener("change",n=>{var t;const e=n.target;if(e.dataset.param&&(["representation","kind","configuration"].includes(e.dataset.param)&&((t=St==null?void 0:St.cancelInteractions)==null||t.call(St)),oi(se,e.dataset.param,Number.isNaN(Number(e.value))?e.value:Number(e.value)),In()),e.dataset.scopeChannel){const i=e.dataset.scopeField;ns(se,`${e.dataset.scopeChannel}${i==="ground"?"Ground":""}`,e.value||null),In()}(e.id==="red-probe"||e.id==="black-probe")&&(ns(se,e.id.split("-")[0],e.value||null),tr())});sa.addEventListener("input",n=>{const e=n.target;if(e.dataset.param&&e.type==="number"&&e.value!==""&&(oi(se,e.dataset.param,Number(e.value)),tr()),n.target.id==="load-slider"&&(oi(se,"load",Ft.load[Number(n.target.value)]),document.querySelector("#param-load").value=ct(se).load,tr(),Pl()),n.target.id==="time-slider"){const t=ct(se);t.playing=!1,oi(se,"time",Number(n.target.value)*qn({...t,source:5}).tau),tr()}});document.querySelector("#add-wire").addEventListener("click",()=>{const n=document.querySelector("#wire-from").value,e=document.querySelector("#wire-to").value;se.tool="wire",se.selectedTerminal=null,Cs(se,n),Cs(se,e),In()});document.querySelector(".brand").addEventListener("click",n=>{n.preventDefault(),qs("module:thevenin")});document.addEventListener("keydown",n=>{if(n.target.closest("input,textarea,select,button")||document.querySelector("dialog[open]"))return;const e={1:"tool:select",2:"tool:wire",3:"tool:red",4:"tool:black",5:"tool:remove",Escape:"cancel"};e[n.key]&&(n.preventDefault(),qs(e[n.key])),(n.ctrlKey||n.metaKey)&&n.key==="z"&&(n.preventDefault(),qs("undo"))});document.querySelector("#vr-preview-tab").addEventListener("click",()=>{const n=!mi;Ys(!1),mi=n,document.querySelector(".lab-layout").classList.toggle("vr-preview",mi),St==null||St.setPanelPreview(mi),document.querySelector("#vr-preview-tab").classList.toggle("active",mi),document.querySelector("#bench-tab").classList.toggle("active",!mi&&!Cl)});document.querySelector("#reset-view").addEventListener("click",()=>St==null?void 0:St.resetView());function Ys(n){mi&&(mi=!1,St==null||St.setPanelPreview(!1),document.querySelector("#vr-preview-tab").classList.remove("active")),document.querySelector(".lab-layout").classList.remove("vr-preview"),Cl=n,document.querySelector("#schematic").hidden=!n,document.querySelector("#bench-tab").classList.toggle("active",!n),document.querySelector("#reference-tab").classList.toggle("active",n),document.querySelector("#bench").style.visibility=n?"hidden":"visible",document.querySelector(".stage-bottom").hidden=n,document.querySelector(".stage-top").hidden=n}document.querySelector("#bench-tab").addEventListener("click",()=>Ys(!1));document.querySelector("#reference-tab").addEventListener("click",()=>Ys(!0));function ay(){document.querySelector("#vr-help-status").textContent=yr.message,document.querySelector("#guide-dialog").showModal()}for(const n of["guide-button","model-guide"])document.getElementById(n).addEventListener("click",ay);function cy(){try{const e=new URL((window.location.protocol==="https:",window.location.href));return e.hash="",e.searchParams.delete("inspect-vr"),e.protocol==="https:"?e.href:null}catch{return null}}function Eh(n){yr=n;const e={checking:"Checking VR…",entering:"Opening VR…",active:"Exit VR",ready:"Enter VR",error:"Try VR again"},t=n.active?"Exit VR":e[n.kind]||(n.supported?"Enter VR":"Use a headset"),i=document.querySelector("#vr-button");i.innerHTML=Pi("vr")+" "+t,i.title=n.message,i.disabled=n.kind==="checking"||n.kind==="entering",i.classList.toggle("vr-ready",n.supported);for(const s of["vr-status","headset-status","vr-help-status"])document.getElementById(s).textContent=n.message;const r=document.querySelector("#headset-enter");if(r.hidden=!n.supported||n.active,r.disabled=n.kind==="entering"||n.kind==="checking",document.querySelector("#headset-check").disabled=n.kind==="checking"||n.kind==="entering"||n.active,document.body.classList.toggle("in-vr",n.active),n.active)for(const s of document.querySelectorAll("dialog[open]"))s.close()}function Pd(){var i;const n=cy(),e=document.querySelector("#headset-address");e.innerHTML=n?`<span>Headset link</span><a href="${At(n)}" target="_blank" rel="noopener">${At(n)}</a><button class="button subtle" id="copy-headset-link">Copy link</button><small id="copy-headset-status" role="status"></small>`:"<p>This local address works on this computer. A standalone headset needs the lab’s HTTPS link.</p>",(i=document.querySelector("#copy-headset-link"))==null||i.addEventListener("click",async()=>{const r=document.querySelector("#copy-headset-status");try{await navigator.clipboard.writeText(n),r.textContent="Link copied"}catch{r.textContent="Select and copy the link above."}});const t=document.querySelector("#headset-fullscreen");t.hidden=window.self===window.top,t.href=window.location.href,document.querySelector("#headset-status").textContent=yr.message,document.querySelector("#headset-dialog").showModal()}function Ld(){!St||yr.kind==="entering"||(yr.supported||yr.active?(Ys(!1),St.enterVR()):Pd())}document.querySelector("#vr-button").addEventListener("click",Ld);document.querySelector("#headset-enter").addEventListener("click",Ld);document.querySelector("#headset-help").addEventListener("click",Pd);document.querySelector("#headset-check").addEventListener("click",()=>St==null?void 0:St.refreshVRSupport());document.querySelector("#vr-preview-tab").hidden=!new URLSearchParams(window.location.search).has("inspect-vr");for(const n of document.querySelectorAll("dialog"))n.addEventListener("click",e=>{if(e.target===n){const t=n.getBoundingClientRect();(e.clientX<t.left||e.clientX>t.right||e.clientY<t.top||e.clientY>t.bottom)&&n.close()}});try{St=$x({container:document.querySelector("#bench"),onFrame:Ll,onPanelPreviewChange:n=>{mi=n,document.querySelector(".lab-layout").classList.toggle("vr-preview",n),document.querySelector("#vr-preview-tab").classList.toggle("active",n),document.querySelector("#bench-tab").classList.toggle("active",!n&&!Cl)},onTerminal:n=>{Cs(se,n),In()},onWire:n=>{il(se,n),In()},onWireMove:(n,e,t)=>{Ql(se,n,e,t),In()},onManipulation:(n,e)=>{n==="begin"?$d(se,e.input):n==="end"&&qd(se,e.input)},onDisconnect:n=>{Ql(se,n,0,null),In()},onConnect:(n,e)=>{const t=se.tool;se.tool="wire",se.selectedTerminal=null,Cs(se,n),Cs(se,e),se.tool=t,In()},onProbe:(n,e)=>{ns(se,n,e),In()},onChange:(n,e)=>{var t;if(n==="meterMode"){Td=e,tr();return}["representation","kind","configuration"].includes(n)&&((t=St==null?void 0:St.cancelInteractions)==null||t.call(St)),oi(se,n,e),In()},onGraphCursor:Zo,onPart:n=>{hs=n,In()},onHover:n=>{const e=document.querySelector("#hover-label");e.hidden=!n,e.textContent=n?n.label:""},onAction:qs,onXRStatus:Eh})}catch(n){Eh({kind:"unavailable",supported:!1,active:!1,message:"3D could not start in this browser. Open the lab in a headset browser."}),document.querySelector("#bench").innerHTML=`<div class="webgl-error"><h2>3D rendering is unavailable</h2><p>${At(n.message)}</p><p>You can still use the circuit reference and terminal controls below.</p></div>`}In();let wh=performance.now(),Th=0;function Ll(n){const e=Math.min((n-wh)/1e3,.1);wh=n;const t=se.params.transient;t.playing&&se.module==="transient"&&Ct(se).correct&&(Zd(se,e),(!t.playing||n-Th>100)&&(Th=n,tr())),St||requestAnimationFrame(Ll)}St||requestAnimationFrame(Ll);
