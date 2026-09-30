var $d=Object.defineProperty;var qd=(n,e,t)=>e in n?$d(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var Ma=(n,e,t)=>qd(n,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();const fn={thevenin:{number:"05",short:"Equivalent circuits",title:"Thévenin and Norton",name:"Thévenin & Norton",topic:"Thévenin, Norton & maximum power transfer",description:"Compare load voltage, current and power.",purpose:"Build equivalent circuits, verify the same load behaviour, and find maximum load power.",steps:["Wire the original network. Measure load voltage, current and power at 250, 500 and 1000 Ω.","Switch to Thévenin and Norton. Set their source and resistance values, then wire each equivalent.","Repeat the same loads. Compare all three circuits using your paper measurements.","Vary the load and inspect the calculated power sweep. Find the load that receives maximum power."],challenge:"Wire the original circuit and its Thévenin and Norton equivalents. Compare readings at 250, 500 and 1000 Ω, then vary the load to find maximum power. Write your results on paper.",principle:"Equivalent circuits preserve voltage and current at the load terminals. Their internal behaviour can differ.",defaults:{representation:"original",load:500,equivalentVoltage:6,equivalentResistance:500,nortonCurrent:12}},superposition:{number:"06",short:"Source contributions",title:"Superposition",name:"Superposition",topic:"Superposition in linear DC circuits",description:"Measure each source’s contribution.",purpose:"Add signed source contributions and explain how two active sources can cancel one branch current.",steps:["Wire the network with A at +6 V and B at −3 V. Read the branch current with both sources active.","Select A alone, then B alone. Replace each inactive ideal voltage source with a short.","Compare the signed contributions with the complete circuit. Add currents on paper, not powers.","Keep both sources active and adjust B until branch current is zero. Check which other branches still carry current."],challenge:"Compare A alone, B alone and both at +6 V / −3 V. Short each inactive voltage source. Adjust source B until the branch current is zero, then compare the signed contributions. Write your explanation on paper.",principle:"Add signed voltage or current contributions. Power must be calculated from the combined result.",defaults:{v1:6,v2:3,sourceMode:"both",replacement:"short",sumMilliamp:null,explanation:"unset"}},opamp:{number:"07",short:"Gain & clipping",title:"Operational amplifiers",name:"Operational amplifiers",topic:"Closed-loop gain & output clipping",description:"Set the gain and check for clipping.",purpose:"Design a gain with resistors, then find the largest input before output clipping.",steps:["Choose the amplifier circuit assigned in your lab sheet. For this example, start with the inverting circuit.","For a first design, use the inverting circuit at gain −3. Set Rin and Rf, wire feedback, and connect both supplies.","Connect CH1 to input and CH2 to output, with both grounds at GND. Set a readable timebase and voltage scales.","Increase input amplitude until clipping begins. Change the supplies or signal frequency and compare the traces."],challenge:"At ±12 V and 100 Hz, build an inverting amplifier with gain −3. Connect CH1 to Vin and CH2 to Vout, with both grounds at GND. Increase the input until clipping appears. Put measurements and calculations on paper.",principle:"Negative feedback sets the gain only while the amplifier operates within its limits.",defaults:{configuration:"inverting",rin:1e4,rf:2e4,amplitude:1,rail:12,frequency:100,prediction:0,timeDiv:2,ch1Scale:1,ch2Scale:5,triggerEdge:"rising",triggerLevel:0,scopeRunning:!0,scopeGroundChannel:"ch1"}},transient:{number:"08",short:"Energy & time",title:"RC and RL response",name:"RC & RL transients",topic:"First-order RC & RL transient response",description:"Measure charging and decay.",purpose:"Predict how resistance changes response speed, then test both RC and RL circuits.",steps:["Wire RC. On paper, predict whether increasing R makes the response faster or slower.","Run from zero energy. Watch voltage, current and stored energy; pause, slow, replay or drag through the acquired trace.","Increase R and repeat from zero energy. Use the same playback speed and compare the time to reach the same fraction of the final value.","Repeat with RL, then switch each circuit to Return to observe decay. Compare both trends with your predictions."],challenge:"Wire the RC and RL circuits. Run charging and decay, compare voltage and current, and change R to see its effect on response time. Use pause, replay and the time cursor. Put predictions and measurements on paper.",principle:"Capacitor voltage and inductor current remain continuous through switching in these ideal circuits.",defaults:{kind:"RC",resistance:1e3,capacitance:1e-4,inductance:.1,charging:!0,initial:0,time:0,acquiredTime:0,playing:!1,speed:1,predictionChoice:"unset"}}},Lt=(n,e,t,i)=>({id:n,label:e,x:t,z:i}),Nn=(n,e,t,i,r,s,o)=>({id:n,label:e,type:t,value:i,x:r,z:s,pins:o}),Ms=()=>Nn("ground","GND","ground","0 V",-.7,.69,[Lt("gnd","GND",-.7,.61)]),Ss=(n,e,t,i,r)=>Nn(n,e,"V",t,i,r,[Lt(`${n}+`,"+",i,r-.22),Lt(`${n}-`,"−",i,r+.22)]),Es=(n,e,t,i,r)=>Nn(n,e,"R",t,i,r,[Lt(`${n}a`,"A",i-.29,r),Lt(`${n}b`,"B",i+.29,r)]),Or=(n,e,t,i,r)=>Nn(n,e,"R",t,i,r,[Lt(`${n}a`,"+",i,r-.26),Lt(`${n}b`,"−",i,r+.26)]),hi=(n,e)=>({id:n,type:"R",a:`${n}a`,b:`${n}b`,value:e}),ao=(n,e)=>({id:n,type:"V",a:`${n}+`,b:`${n}-`,value:e});function sl(n,e){let t,i,r=[],s,o;if(n==="thevenin"&&(e.representation==="original"?(t=[Ss("s","DC SOURCE","12 V",-1.14,-.03),Es("r1","R₁","1 kΩ",-.36,-.46),Or("r2","R₂","1 kΩ",.23,.08),Or("load","LOAD",`${e.load} Ω`,1.1,.08),Ms()],i=[["s+","r1a"],["r1b","r2a"],["r2a","loada"],["r2b","gnd"],["loadb","gnd"],["s-","gnd"]],r=[ao("s",12),hi("r1",1e3),hi("r2",1e3),hi("load",e.load)]):e.representation==="thevenin"?(t=[Ss("s","Vth",`${e.equivalentVoltage} V`,-1,-.02),Es("req","Rth",`${e.equivalentResistance} Ω`,0,-.46),Or("load","LOAD",`${e.load} Ω`,1,.02),Ms()],i=[["s+","reqa"],["reqb","loada"],["loadb","gnd"],["s-","gnd"]],r=[ao("s",e.equivalentVoltage),hi("req",e.equivalentResistance),hi("load",e.load)]):(t=[Nn("s","In ↑","I",`${e.nortonCurrent} mA`,-1,-.02,[Lt("s+","OUT",-1,-.28),Lt("s-","IN",-1,.24)]),Or("req","Rn",`${e.equivalentResistance} Ω`,0,.02),Or("load","LOAD",`${e.load} Ω`,1,.02),Ms()],i=[["s+","reqa"],["reqa","loada"],["reqb","gnd"],["loadb","gnd"],["s-","gnd"]],r=[{id:"s",type:"I",a:"s-",b:"s+",value:e.nortonCurrent/1e3},hi("req",e.equivalentResistance),hi("load",e.load)]),s="loada",o="load"),n==="superposition"){const a=e.sourceMode!=="b",c=e.sourceMode!=="a";t=[Ss("a","SOURCE A",a?`+${e.v1} V`:e.replacement==="short"?"0 V · SHORT":"OPEN",-1.18,-.08),Ss("b","SOURCE B",c?`−${e.v2} V`:e.replacement==="short"?"0 V · SHORT":"OPEN",1.18,-.08),Es("r1","R₁","1 kΩ",-.51,-.55),Es("r2","R₂","1 kΩ",.51,-.55),Or("load","BRANCH","1 kΩ",0,.17),Ms()],i=[["a+","r1a"],["r1b","loada"],["r2a","loada"],["r2b","b+"],["a-","gnd"],["b-","gnd"],["loadb","gnd"]],r=[hi("r1",1e3),hi("r2",1e3),hi("load",1e3)],(a||e.replacement==="short")&&r.push(ao("a",a?e.v1:0)),(c||e.replacement==="short")&&r.push(ao("b",c?-e.v2:0)),s="loada",o="load"}return n==="opamp"&&(t=[{...Nn("signal","INPUT","V",`${e.amplitude} Vpk`,-1.38,-.15,[Lt("signal+","+",-1.38,-.35),Lt("signal-","−",-1.38,.06)]),benchPosition:[-2.14,.19]},Nn("rin","Rin","R",`${e.rin/1e3} kΩ`,-.72,.3,[Lt("rina","A",-1.14,.3),Lt("rinb","B",-.3,.3)]),Nn("op","OP AMP","opamp",`±${e.rail} V`,0,-.35,[Lt("op+","+",-.32,-.12),Lt("op-","−",-.32,-.42),Lt("out","OUT",.53,-.22),Lt("vp","V+",.24,-.72),Lt("vn","V−",.24,-.02)]),Nn("rf","Rf","R",`${e.rf/1e3} kΩ`,.7,.3,[Lt("rfa","A",.28,.3),Lt("rfb","B",1.12,.3)]),{...Nn("plus","+ SUPPLY","V",`${e.rail} V`,1.38,-.56,[Lt("plus+","+",1.38,-.72),Lt("plus-","−",1.38,-.39)]),benchPosition:[2.15,-.67]},{...Nn("minus","− SUPPLY","V",`${e.rail} V`,1.38,.215,[Lt("minus+","+",1.38,.05),Lt("minus-","−",1.38,.38)]),benchPosition:[2.15,.3]},Nn("ground","GND","ground","0 V",-.7,.79,[Lt("gnd","GND",-1.1,.79)])],i=[["signal-","gnd"],["rfb","out"],["rfa","op-"],["rinb","op-"],["plus+","vp"],["plus-","gnd"],["minus+","gnd"],["minus-","vn"]],i.push(...e.configuration==="inverting"?[["signal+","rina"],["op+","gnd"]]:[["signal+","op+"],["rina","gnd"]]),s="out"),n==="transient"&&(t=[Ss("s","DC SOURCE","5 V",-1.19,.06),Nn("sw","SPDT SWITCH","switch",e.charging?"SOURCE":"RETURN",-.62,-.39,[Lt("supply","5 V",-.83,-.58),Lt("common","COM",-.36,-.39),Lt("return","0 V",-.75,-.18)]),Es("r","RESISTOR",`${e.resistance} Ω`,.2,-.46),Nn("storage",e.kind==="RC"?"CAPACITOR":"INDUCTOR",e.kind==="RC"?"C":"L",e.kind==="RC"?"100 μF":"100 mH",1.03,.1,[Lt("storagea","+",1.03,-.17),Lt("storageb","−",1.03,.37)]),Ms()],i=[["s+","supply"],["s-","gnd"],["return","gnd"],["common","ra"],["rb","storagea"],["storageb","gnd"]],s="storagea"),{components:t,wires:i,electrical:r,positive:s,negative:"gnd",sensor:o,pins:t.flatMap(a=>a.pins.map(c=>({...c,name:`${a.label} ${c.label}`})))}}function nr(n,e){const t=Object.fromEntries(e.map(r=>[typeof r=="string"?r:r.id,typeof r=="string"?r:r.id])),i=r=>t[r]===r||t[r]===void 0?r:t[r]=i(t[r]);for(const[r,s]of n)r in t&&s in t&&(t[i(r)]=i(s));return Object.fromEntries(Object.keys(t).map(r=>[r,i(r)]))}function Xd(n,e){const t=nr(n.wires,n.pins),i=nr(e,n.pins);return n.pins.every(r=>n.pins.every(s=>t[r.id]===t[s.id]==(i[r.id]===i[s.id])))}const Ut={load:[100,250,500,750,1e3,1500,2e3],equivalentVoltage:[2,3,4,5,6,7,8,9,10,12],equivalentResistance:[100,250,500,750,1e3,1500,2e3],nortonCurrent:[4,6,8,10,12,14,16,18,20],v1:[0,1,2,3,4,5,6,7,8,9,10,11,12],v2:[0,1,2,3,4,5,6,7,8,9,10,11,12],rin:[5e3,1e4,2e4],rf:[1e4,2e4,3e4,4e4,5e4,1e5],rail:[5,9,12,15],frequency:[10,50,100,500,1e3],amplitude:[.25,.5,1,2,3,3.5,3.6,3.7,4,5,6],prediction:Array.from({length:101},(n,e)=>e/10),resistance:[100,200,250,500,1e3,2e3,5e3,1e4],speed:[.25,.5,1,2],sumMilliamp:Array.from({length:161},(n,e)=>(e-80)/10),explanation:["unset","opposing","sources-off","whole-circuit-zero"],predictionChoice:["unset","slower","faster","same"],timeDiv:[.02,.05,.1,.2,.4,.5,1,2,4,5,10,20,50],ch1Scale:[.1,.2,.5,1,2,5,10],ch2Scale:[.1,.2,.5,1,2,5,10],triggerLevel:[-10,-5,-2,-1,-.5,0,.5,1,2,5,10],triggerEdge:["rising","falling"]},Bs=(n,e)=>{if(typeof n!="number"||!Number.isFinite(n))throw new RangeError(`${e} must be a finite number.`);return n},yr=(n,e)=>{if(Bs(n,e),n<=0)throw new RangeError(`${e} must be greater than zero.`);return n},Kr=(n,e)=>{if(Bs(n,e),n<0)throw new RangeError(`${e} cannot be negative.`);return n},Vs=n=>Object.is(n,-0)?0:n;function Yd(n,e){const t=e.length;if(!t)return[];const i=n.map((c,l)=>{const u=Math.max(...c.map(Math.abs));return u?[...c.map(h=>h/u),e[l]/u]:[...c,e[l]]}),r=1e-12;let s=0;const o=[];for(let c=0;c<t&&s<t;c+=1){let l=s;for(let h=s+1;h<t;h+=1)Math.abs(i[h][c])>Math.abs(i[l][c])&&(l=h);if(Math.abs(i[l][c])<=r)continue;[i[s],i[l]]=[i[l],i[s]];const u=i[s][c];for(let h=c;h<=t;h+=1)i[s][h]/=u;for(let h=s+1;h<t;h+=1){const d=i[h][c];for(let f=c;f<=t;f+=1)i[h][f]-=d*i[s][f];i[h][c]=0}o.push(c),s+=1}for(let c=s;c<t;c+=1)if(i[c].slice(0,t).every(l=>Math.abs(l)<=r)&&Math.abs(i[c][t])>1e-9)throw new Error("Inconsistent circuit: check for a shorted voltage source, conflicting ideal voltage sources, or a current source without a return path.");if(s<t)throw new Error("Singular circuit: connect floating nodes to a reference and remove redundant ideal voltage sources. Voltages or source currents are not uniquely determined.");const a=Array(t).fill(0);for(let c=t-1;c>=0;c-=1){const l=o[c];a[l]=i[c][t];for(let u=l+1;u<t;u+=1)a[l]-=i[c][u]*a[u]}if(a.some(c=>!Number.isFinite(c)))throw new Error("Numerical failure: check component values and circuit connections.");for(let c=0;c<t;c+=1){const l=n[c].reduce((h,d,f)=>h+d*a[f],0),u=Math.abs(e[c])+n[c].reduce((h,d,f)=>h+Math.abs(d*a[f]),0);if(Math.abs(l-e[c])>1e-8*Math.max(u,1e-12))throw new Error("Numerically unstable circuit: use a well-conditioned network with a valid reference.")}return a}function ol({components:n=[],wires:e=[]}={}){try{if(!Array.isArray(n)||!n.length)throw new Error("Add at least one component to the circuit.");if(!Array.isArray(e))throw new Error("Wires must be an array of pin pairs.");const t=new Map([["gnd","gnd"]]),i=M=>{if(typeof M!="string"||!M.length)throw new Error("Every terminal must have a nonempty string pin name.");return t.has(M)||t.set(M,M),M},r=M=>{let w=M;for(;t.get(w)!==w;)w=t.get(w);for(;t.get(M)!==M;){const A=t.get(M);t.set(M,w),M=A}return w},s=new Set;let o=!1;for(const M of n){if(!M||typeof M.id!="string"||!M.id.length||s.has(M.id))throw new Error("Each component requires a unique, nonempty id.");if(s.add(M.id),!["R","V","I"].includes(M.type))throw new Error(`Unsupported component type: ${M.type}.`);i(M.a),i(M.b),o||(o=M.a==="gnd"||M.b==="gnd"),Bs(M.value,`${M.id} value`),M.type==="R"&&yr(M.value,`${M.id} resistance`)}for(const M of e){if(!Array.isArray(M)||M.length!==2)throw new Error("Each wire must contain exactly two pin names.");const w=i(M[0]),A=i(M[1]);o||(o=w==="gnd"||A==="gnd"),t.set(r(w),r(A))}if(!o)throw new Error("Missing reference: connect the circuit common node to 'gnd'.");const a=r("gnd"),c=[...new Set([...t.keys()].map(r))].filter(M=>M!==a),l=new Map(c.map((M,w)=>[M,w])),u=M=>l.get(r(M)),h=n.filter(M=>M.type==="V"),d=new Map(h.map((M,w)=>[M.id,c.length+w])),f=c.length+h.length,g=Array.from({length:f},()=>Array(f).fill(0)),v=Array(f).fill(0),m=(M,w,A)=>{M!==void 0&&w!==void 0&&(g[M][w]+=A)};for(const M of n){const w=u(M.a),A=u(M.b);if(M.type==="R"){const C=1/M.value;if(!Number.isFinite(C))throw new Error("Resistance is outside the supported numerical range.");m(w,w,C),m(A,A,C),m(w,A,-C),m(A,w,-C)}else if(M.type==="I")w!==void 0&&(v[w]-=M.value),A!==void 0&&(v[A]+=M.value);else{const C=d.get(M.id);m(w,C,1),m(A,C,-1),m(C,w,1),m(C,A,-1),v[C]=M.value}}const p=Yd(g,v),_=M=>r(M)===a?0:Vs(p[u(M)]),x=Object.fromEntries([...t.keys()].map(M=>[M,_(M)])),y=Object.fromEntries(n.map(M=>[M.id,Vs(M.type==="R"?(_(M.a)-_(M.b))/M.value:M.type==="I"?M.value:p[d.get(M.id)])]));return{ok:!0,voltages:x,currents:y,error:null}}catch(t){return{ok:!1,voltages:{},currents:{},error:t.message}}}function jd({configuration:n="inverting",rin:e=1e4,rf:t=2e4,amplitude:i=1,rail:r=12,headroom:s=1,frequency:o=100,time:a=0,powered:c=!0,feedback:l=!0}={}){yr(e,"Input resistance"),Kr(t,"Feedback resistance"),Kr(i,"Input amplitude"),Kr(r,"Supply rail magnitude"),Kr(s,"Output headroom"),yr(o,"Frequency"),Kr(a,"Time");let u;if(n==="inverting")u=-t/e;else if(n==="noninverting"||n==="non-inverting")u=1+t/e;else if(n==="follower")u=1;else throw new RangeError("Configuration must be inverting, noninverting, or follower.");const h=i*Math.sin(2*Math.PI*o*a),d=Math.max(0,r-s),f=Math.abs(u)*i,g=n==="inverting"?-1:1;let v=0,m=0,p=!1,_="powered-off";return c&&d>0&&(l?(v=Math.max(-d,Math.min(d,u*h)),m=Math.min(d,f),p=f>d,_=p?"saturated":"linear"):(v=Math.sign(g*h)*d,m=i>0?d:0,p=i>0,_="open-loop")),{gain:u,input:h,output:Vs(v),limit:d,maxInput:l?u===0?1/0:d/Math.abs(u):0,clipped:p,peakOutput:m,modelState:_}}function Hn({kind:n="RC",resistance:e=1e3,capacitance:t=1e-4,inductance:i=.1,source:r=5,time:s=0,initial:o=0,charging:a=!0}={}){if(yr(e,"Resistance"),Bs(r,"Source voltage"),Bs(o,"Initial storage value"),Kr(s,"Time"),!["RC","RL"].includes(n))throw new RangeError("Transient kind must be RC or RL.");const c=a?r:0,l=n==="RC"?yr(t,"Capacitance"):yr(i,"Inductance"),u=n==="RC"?e*l:l/e;yr(u,"Time constant");const h=n==="RC"?c:c/e,d=h+(o-h)*Math.exp(-s/u),f=n==="RC"?d:c-e*d,g=n==="RC"?(c-d)/e:d;return{tau:u,voltage:Vs(f),current:Vs(g),energy:.5*l*d*d,final:h,storageValue:d}}const Ft=(n,e=3)=>Number.isFinite(n)?Number(n.toFixed(e)).toLocaleString("en-US",{maximumFractionDigits:e}):"—",ur=(n,e,t=.01)=>Number.isFinite(n)&&Math.abs(n-e)<=Math.max(Math.abs(e)*t,1e-8);function Zd(){return{module:"thevenin",mode:"explore",params:Object.fromEntries(Object.entries(fn).map(([n,e])=>[n,{...e.defaults}])),wireSets:{},probeSets:{},scopeSets:{},scopeHolds:{},history:{},predictions:{},sumSubmissions:{},tool:"wire",selectedTerminal:null,records:[],attempts:Object.fromEntries(Object.keys(fn).map(n=>[n,0])),challengeStarted:{},feedback:"Drag a lead between contacts; place the meter tips to measure.",checks:{},showGuide:!1,sequence:0}}const it=n=>n.params[n.module];function Kd(n){const e=it(n);return e.representation||e.configuration||e.kind||"main"}const Pn=n=>`${n.mode}:${n.module}:${Kd(n)}`;function Mt(n){const e=sl(n.module,it(n)),t=Pn(n);return n.wireSets[t]||(n.wireSets[t]=n.mode==="explore"?e.wires.map(i=>[...i]):[]),n.probeSets[t]||(n.probeSets[t]=n.mode==="explore"?{red:e.positive,black:"gnd"}:{red:null,black:null}),n.scopeSets[t]||(n.scopeSets[t]=ac(n)),{circuit:e,wires:n.wireSets[t],probes:n.probeSets[t],scope:n.scopeSets[t],correct:Xd(e,n.wireSets[t])}}const Zn=n=>structuredClone(n);function ac(n){const e=n.mode==="explore"&&n.module==="opamp";return{ch1:{signal:e?"signal+":null,ground:e?"gnd":null},ch2:{signal:e?"out":null,ground:e?"gnd":null}}}const Er=new WeakMap,Ih=n=>({wires:Zn(n.wires),probes:Zn(n.probes),scope:Zn(n.scope)});function Uh(n,e,t){var i;((i=n.history)[e]||(i[e]=[])).push(t),n.history[e].length>80&&n.history[e].splice(0,n.history[e].length-80)}function Jd(n,e){if(e==null)return!1;let t=Er.get(n);if(t||(t=new Map,Er.set(n,t)),[...t.values()].some(o=>o.tokens.has(e)))return!1;const i=Mt(n),r=Pn(n);let s=t.get(r);return s||(s={tokens:new Set,snapshot:Ih(i)},t.set(r,s)),s.tokens.add(e),!0}function Qd(n,e){const t=Er.get(n);if(!t)return!1;const i=[...t.entries()].find(([,a])=>a.tokens.has(e));if(!i)return!1;const[r,s]=i;if(s.tokens.delete(e),s.tokens.size||(t.delete(r),t.size||Er.delete(n),!n.wireSets[r]||!n.probeSets[r]||!n.scopeSets[r]))return!0;const o={wires:n.wireSets[r],probes:n.probeSets[r],scope:n.scopeSets[r]};return JSON.stringify(s.snapshot)!==JSON.stringify(o)&&Uh(n,r,s.snapshot),!0}function as(n){var i;const e=Mt(n),t=Pn(n);(i=Er.get(n))!=null&&i.has(t)||Uh(n,t,Ih(e))}const na=(n,e=it(n).kind)=>`${n.mode}:${n.attempts.transient}:${e}`;function Sn(n,e=it(n).kind){return n.predictions[na(n,e)]||{choice:"unset",locked:!1,late:!1,correct:!1,run:0,tested:!1}}function Di(n){var t;if(n.module!=="transient")return;const e=na(n);n.predictions[e]={...Sn(n),tested:!0,late:!((t=n.predictions[e])!=null&&t.locked)}}function ef(n){if(n.module!=="transient")return!1;const e=it(n),t=Sn(n);return t.locked?(n.feedback="Prediction already locked for this circuit.",!1):t.late?(n.feedback="The trial has already started. Begin a new attempt to make a prediction first.",!1):["slower","faster","same"].includes(e.predictionChoice)?(n.predictions[na(n)]={choice:e.predictionChoice,locked:!0,late:!1,tested:!1,run:t.run,correct:e.predictionChoice===(e.kind==="RC"?"slower":"faster"),kind:e.kind,resistance:e.resistance,sequence:++n.sequence},n.feedback="Prediction saved. Now change R and test it.",!0):(n.feedback="Choose slower, faster or unchanged, then lock your prediction.",!1)}const Nh=(n,e,t)=>`${n.mode}:${n.attempts.superposition}:${e}:${t}`;function tf(n,e=n.module){return n.records.filter(t=>t.module===e&&t.mode===n.mode&&t.attempt===n.attempts[e]&&t.measurement.correct&&t.measurement.probesCorrect)}function Oh(n,e=n.params.superposition.v1,t=n.params.superposition.v2){const i=tf(n,"superposition").filter(r=>r.params.v1===e&&r.params.v2===t&&(r.params.sourceMode==="both"||r.params.replacement==="short"));return Object.fromEntries(["a","b","both"].map(r=>[r,i.find(s=>s.params.sourceMode===r)||null]))}function nf(n){if(n.module!=="superposition")return!1;const e=it(n),t=Oh(n);if(!t.a||!t.b||!t.both)return n.feedback="Record A alone, B alone and both at the same source settings first.",!1;if(!Number.isFinite(e.sumMilliamp))return n.feedback="Enter the signed sum in mA.",!1;const i=(t.a.measurement.current+t.b.measurement.current)*1e3,r=t.both.measurement.current*1e3,s=Math.abs(e.sumMilliamp-i)<=.01&&Math.abs(e.sumMilliamp-r)<=.01;return n.sumSubmissions[Nh(n,e.v1,e.v2)]={answerMilliamp:e.sumMilliamp,sumMilliamp:i,measuredMilliamp:r,passed:s,v1:e.v1,v2:e.v2,recordIds:Object.fromEntries(Object.entries(t).map(([o,a])=>[o,a.id])),sequence:++n.sequence},n.feedback=s?"The signed sum matches the measured current with both sources.":"Check the signs. Add currents, then compare with the both-source reading.",s}function Fh(n){const e=it(n),{wires:t,correct:i}=Mt(n),r=Object.fromEntries(["a","b","both"].map(a=>{const c=sl("superposition",{...e,sourceMode:a}),l=ol({components:c.electrical,wires:t});if(!l.ok)return[a,{valid:!1,current:null,voltage:null,power:null,error:l.error}];const u=l.voltages[c.positive]-l.voltages.loadb,h=l.currents.load;return[a,{valid:!0,current:h,voltage:u,power:u*h,branchCurrents:{r1:l.currents.r1,r2:l.currents.r2,load:h},error:null}]})),s=Object.values(r).every(a=>a.valid),o=[...new Set(Object.values(r).map(a=>a.error).filter(Boolean))];return i||o.push("Current wiring differs from the circuit diagram."),e.replacement!=="short"&&o.push("Open replacements do not give additive contributions. Select Short."),{live:r,valid:s,topologyCorrect:i,superpositionValid:s&&e.replacement==="short",error:o.join(" ")||null}}function al(n){const e=it(n);if(n.module==="superposition"){const t=Oh(n),i=n.sumSubmissions[Nh(n,e.v1,e.v2)]||null;return{kind:"superposition",...Fh(n),recorded:Object.fromEntries(Object.entries(t).map(([r,s])=>[r,s?{id:s.id,current:s.measurement.current,voltage:s.measurement.voltage,power:s.measurement.power}:null])),sumMilliamp:e.sumMilliamp,explanation:e.explanation,sumSubmitted:!!i,submission:i}}return n.module==="transient"?{kind:"transient",prediction:{...Sn(n),choice:Sn(n).locked?Sn(n).choice:e.predictionChoice,expected:Sn(n).tested?e.kind==="RC"?"slower":"faster":null},predictions:{RC:Sn(n,"RC"),RL:Sn(n,"RL")},playback:{speed:e.speed,baselineTau:e.kind==="RC"?.1:.001,secondsPerBaselineTau:2}}:n.module==="opamp"?{kind:"opamp",scope:vi(n)}:{kind:n.module}}function rf(n,e){const t=n.params.transient;if(n.module!=="transient"||!t.playing||!Number.isFinite(e)||e<=0||!Mt(n).correct)return t.time;Di(n);const i=t.kind==="RC"?.1:.001;return t.time=Math.min(t.time+e*i*t.speed/2,5*Hn({...t,source:5}).tau),t.acquiredTime=Math.max(t.acquiredTime||0,t.time),t.time>=5*Hn({...t,source:5}).tau&&(t.playing=!1),t.time}function tu(n,e,t){const i=nr(e,n.pins),r={};for(const[s,o]of Object.entries(t))for(const[a,c]of Object.entries(i))c===i[s]&&(r[a]=o);return r}function Ni(n,e){const t=it(n),{circuit:i,wires:r,probes:s,correct:o}=Mt(n);let a,c={},l,u,h,d,f,g,v,m,p;if(n.module==="thevenin"||n.module==="superposition")a=ol({components:i.electrical,wires:r}),c=a.voltages||{},a.ok&&(l=c[i.positive]-c.loadb,u=a.currents.load,h=l*u);else if(n.module==="opamp")if(!o)a={ok:!1,error:"Connect the amplifier, feedback and both supplies."};else{a={...jd({...t,headroom:1,time:e??1/(4*t.frequency)}),ok:!0},{gain:d,maxInput:g}=a,f=a.peakOutput;const w=t.configuration==="inverting"?(a.input/t.rin+a.output/t.rf)/(1/t.rin+1/t.rf):a.output*t.rin/(t.rin+t.rf);c=tu(i,r,{gnd:0,"signal+":a.input,out:a.output,"op-":w,vp:t.rail,vn:-t.rail}),l=a.output}else o?(a={...Hn({...t,source:5,time:e??t.time}),ok:!0},{voltage:l,current:u,tau:v,energy:m,storageValue:p}=a,c=tu(i,r,{gnd:0,"s+":5,common:t.charging?5:0,storagea:l})):a={ok:!1,error:"Connect the source, switch, resistor and storage loop."};const _=a.ok&&s.red&&s.black&&Number.isFinite(c[s.red])&&Number.isFinite(c[s.black]),x=_?c[s.red]-c[s.black]:null,y=nr(r,i.pins),M=!!_&&y[s.red]===y[i.positive]&&y[s.black]===y[i.negative];return{...a,voltage:l,current:u,power:h,gain:d,peak:f,maxInput:g,tau:v,energy:m,storageValue:p,voltages:c,probeVoltage:x,probeReady:_,probesCorrect:M,correct:o}}const cc=new WeakMap;function sf(n){const e=it(n),t=Mt(n);return JSON.stringify({configuration:e.configuration,rin:e.rin,rf:e.rf,amplitude:e.amplitude,rail:e.rail,frequency:e.frequency,timeDiv:e.timeDiv,ch1Scale:e.ch1Scale,ch2Scale:e.ch2Scale,triggerEdge:e.triggerEdge,triggerLevel:e.triggerLevel,wires:t.wires,scope:t.scope})}function vi(n){if(n.module!=="opamp")return{ok:!1,correct:!1,error:"The scope is available in the amplifier lab.",channels:{},running:!1,stale:!1};const e=it(n),t=Mt(n),i=sf(n),r=n.scopeHolds[Pn(n)];if(!e.scopeRunning&&r){const x=r.signature!==i;return{...Zn(r),running:!1,stale:x,correct:r.correct&&!x,error:x?"Held trace is from different settings. Run the scope to acquire the current circuit.":r.error}}const s=cc.get(n);if((s==null?void 0:s.signature)===i)return{...s,running:e.scopeRunning};const o=Ni(n,0),a=nr(t.wires,t.circuit.pins),c=Object.fromEntries(["ch1","ch2"].map(x=>{const y=t.scope[x],M=y.signal,w=y.ground,A=!!(o.ok&&M&&w&&Number.isFinite(o.voltages[M])&&Number.isFinite(o.voltages[w])&&a[w]===a.gnd),C=x==="ch1"?"signal+":"out",S=A&&a[M]===a[C],E=o.ok?!M||!w?`${x.toUpperCase()}: connect signal and ground.`:a[w]!==a.gnd?`${x.toUpperCase()} ground must connect to GND.`:Number.isFinite(o.voltages[M])?null:`${x.toUpperCase()}: signal is floating or unavailable.`:o.error;return[x,{signal:M,ground:w,valid:A,correct:S,error:E,scale:e[`${x}Scale`],points:[]}]})),l=(x,y)=>x.voltages[c[y].signal]-x.voltages[c[y].ground],u=1/e.frequency,h={edge:e.triggerEdge,level:e.triggerLevel,found:!1,time:0};if(c.ch1.valid){let x=l(o,"ch1");for(let y=1;y<=200;y++){const M=y*u/200,w=l(Ni(n,M),"ch1"),A=x<=e.triggerLevel&&w>e.triggerLevel,C=x>=e.triggerLevel&&w<e.triggerLevel;if(e.triggerEdge==="rising"&&A||e.triggerEdge==="falling"&&C){const S=(e.triggerLevel-x)/(w-x);h.found=!0,h.time=(y-1+S)*u/200;break}x=w}}const d=e.timeDiv*10/1e3,f=d>u*20*1.000001,g=Math.max(200,Math.ceil(d/u*64));for(let x=0;!f&&x<=g&&!(!c.ch1.valid&&!c.ch2.valid);x++){const y=x*d/g,M=Ni(n,y+h.time);for(const w of["ch1","ch2"])c[w].valid&&c[w].points.push([y*1e3,l(M,w)])}for(const x of["ch1","ch2"]){const y=c[x];y.peak=y.points.length?Math.max(...y.points.map(([,M])=>Math.abs(M))):null,y.cropped=y.valid&&y.peak>y.scale*4*1.001}const v=!f&&c.ch1.correct&&c.ch2.correct&&!c.ch1.cropped&&!c.ch2.cropped&&h.found&&d>=u*.999,p=[...new Set(Object.values(c).map(x=>x.error).filter(Boolean))].join(" ")||(f?"Timebase exceeds 20 periods. Reduce ms/div or use Autoscale to avoid undersampling.":h.found?c.ch1.cropped||c.ch2.cropped?"A trace exceeds the display. Increase V/div or use Autoscale.":d<u?"Increase time/div to show a complete period.":null:"Waiting for the selected CH1 trigger crossing."),_={ok:!f&&(c.ch1.valid||c.ch2.valid),correct:v,error:p,channels:c,timeDiv:e.timeDiv,trigger:h,running:e.scopeRunning,stale:!1,signature:i,timebaseTooWide:f,acquisition:{params:Zn(e),wires:Zn(t.wires),scope:Zn(t.scope),sequence:n.sequence},duration:d,clipped:o.clipped,limits:[-e.rail+1,e.rail-1]};return cc.set(n,_),_}function cs(n,e,t){var s;const i=Mt(n);if(t!==null&&!i.circuit.pins.some(o=>o.id===t)||!["red","black","ch1","ch2","ch1Ground","ch2Ground"].includes(e)||!["red","black"].includes(e)&&n.module!=="opamp")return!1;if(as(n),e==="red"||e==="black")i.probes[e]=t;else{const o=e.startsWith("ch1")?"ch1":"ch2";i.scope[o][e.endsWith("Ground")?"ground":"signal"]=t}const r=((s=i.circuit.pins.find(o=>o.id===t))==null?void 0:s.name)||"disconnected";return n.feedback=`${e==="red"?"Meter V tip":e==="black"?"Meter COM tip":e}: ${r}.`,n.selectedTerminal=null,n.checks[n.module]=null,n.sequence++,!0}function nu(n,e,t,i){const r=Mt(n);if(!Number.isInteger(e)||e<0||e>=r.wires.length||![0,1].includes(t)||i!==null&&!r.circuit.pins.some(c=>c.id===i))return!1;const s=r.wires[e],o=[...s];if(o[t]=i,i!==null&&(i===s[t]||o[0]===o[1]||r.wires.some(([c,l],u)=>u!==e&&(c===o[0]&&l===o[1]||c===o[1]&&l===o[0]))))return!1;as(n),i===null?r.wires.splice(e,1):r.wires[e]=o,n.selectedTerminal=null,n.checks[n.module]=null,n.module==="transient"&&(n.params.transient.playing=!1),n.sequence++;const a=c=>{var l;return((l=r.circuit.pins.find(u=>u.id===c))==null?void 0:l.name)||c};return n.feedback=i===null?`Removed lead from ${a(s[0])} to ${a(s[1])}.`:`Lead connected from ${a(o[0])} to ${a(o[1])}.`,!0}function cl(n,e){if(n.tool!=="remove")return n.feedback="Choose Remove before selecting a lead.",!1;const t=Mt(n);if(!Number.isInteger(e)||e<0||e>=t.wires.length)return!1;as(n);const[i,r]=t.wires.splice(e,1)[0],s=o=>{var a;return((a=t.circuit.pins.find(c=>c.id===o))==null?void 0:a.name)||o};return n.feedback=`Removed ${s(i)} → ${s(r)}.`,n.selectedTerminal=null,n.checks[n.module]=null,n.sequence++,!0}function ri(n,e,t){const i=it(n),r=["load","equivalentResistance","rin","rf","rail","frequency","resistance","capacitance","inductance","timeDiv","ch1Scale","ch2Scale","speed"],s=["amplitude","v1","v2","time","prediction"];if([...r,...s,"equivalentVoltage","nortonCurrent","triggerLevel","sumMilliamp","initial"].includes(e)&&!(e==="sumMilliamp"&&t===null)&&(!Number.isFinite(t)||r.includes(e)&&t<=0||s.includes(e)&&t<0))return n.feedback=`Enter a valid ${e} value.`,!1;if(e==="predictionChoice"&&n.module==="transient"&&Sn(n).locked)return n.feedback="Prediction is locked. Use Retry prediction to start a fresh comparison.",!1;if(n.module==="transient"&&e==="resistance"&&t!==i.resistance){t!==i.resistance&&Di(n);const a=Hn({...i,source:5});i.initial=a.storageValue,i.time=0,i.acquiredTime=0}return i[e]=t,n.module==="transient"&&e==="time"&&(t>0&&Di(n),Mt(n).correct&&(i.acquiredTime=Math.max(i.acquiredTime||0,t))),e==="kind"&&(i.resistance=t==="RC"?1e3:100,i.initial=0,i.time=0,i.acquiredTime=0,i.playing=!1,i.charging=!0,i.predictionChoice=Sn(n,t).choice),["representation","configuration","kind"].includes(e)&&(n.selectedTerminal=null,Mt(n)),n.checks[n.module]=null,n.sequence++,!0}function of(n,e){fn[e]&&(n.params.transient.playing=!1,n.module=e,n.selectedTerminal=null,n.tool="wire",n.mode==="challenge"&&ll(n),Mt(n),n.feedback=fn[e].principle,n.sequence++)}function af(n,e){n.mode=e,n.selectedTerminal=null,n.tool="wire",n.params.transient.playing=!1,e==="challenge"&&ll(n),Mt(n),n.feedback=e!=="explore"?"Connect the circuit with patch leads, then place the probes. Use the circuit diagram as a guide.":"Explore the connected circuit. Change a setting and observe the result.",n.sequence++}function ll(n){n.challengeStarted[n.module]||(n.challengeStarted[n.module]=!0,n.params[n.module]={...fn[n.module].defaults},n.module==="thevenin"&&Object.assign(n.params.thevenin,{equivalentVoltage:4,equivalentResistance:750,nortonCurrent:8}))}function cf(n){const e=n.module,t=r=>r.split(":")[1]===e;for(const r of["wireSets","probeSets","scopeSets","scopeHolds","history"])for(const s of Object.keys(n[r]))t(s)&&delete n[r][s];const i=Er.get(n);if(i){for(const r of i.keys())t(r)&&i.delete(r);i.size||Er.delete(n)}return e==="opamp"&&cc.delete(n),e==="transient"&&(n.predictions={}),e==="superposition"&&(n.sumSubmissions={}),n.records=n.records.filter(r=>r.module!==e),n.attempts[e]=0,delete n.challengeStarted[e],delete n.checks[e],n.params[e]=Zn(fn[e].defaults),n.mode="explore",n.tool="wire",n.selectedTerminal=null,n.sequence++,Mt(n),n.feedback="Experiment reset. Explore starts with the complete circuit and default settings.",!0}function Ns(n,e){var r;const{circuit:t,wires:i}=Mt(n);if(t.pins.some(s=>s.id===e)){if(["red","black","ch1","ch2"].includes(n.tool)){cs(n,n.tool,e);return}if(n.tool==="scopeGround"){cs(n,`${it(n).scopeGroundChannel||"ch1"}Ground`,e);return}if(n.tool==="remove"){n.feedback="Select a lead to remove it.";return}if(n.tool==="select"){n.selectedTerminal=e,n.feedback=t.pins.find(s=>s.id===e).name;return}if(!n.selectedTerminal)n.selectedTerminal=e,n.feedback=`${t.pins.find(s=>s.id===e).name} selected. Choose the other terminal.`;else{const s=n.selectedTerminal;n.selectedTerminal!==e&&!i.some(([o,a])=>o===e&&a===n.selectedTerminal||o===n.selectedTerminal&&a===e)&&(as(n),i.push([n.selectedTerminal,e])),n.selectedTerminal=null,n.feedback=s===e?"Connection cancelled.":`${(r=t.pins.find(o=>o.id===s))==null?void 0:r.name} → ${t.pins.find(o=>o.id===e).name}.`}n.checks[n.module]=null,n.sequence++}}function lf(n){n.module==="transient"&&Di(n);const e=Ni(n),t=it(n);if(!e.ok)return n.feedback=e.error||"Complete a valid circuit before recording.",!1;const i=n.module==="opamp"?vi(n):null;return n.module==="opamp"&&!i.ok?(n.feedback=i.error||"Connect the scope signals and grounds first.",!1):n.module!=="opamp"&&!e.probeReady?(n.feedback="Connect both voltage probes before recording a measurement.",!1):(n.records.unshift({id:++n.sequence,module:n.module,mode:n.mode,attempt:n.attempts[n.module],when:new Date().toISOString(),params:JSON.parse(JSON.stringify(t)),measurement:JSON.parse(JSON.stringify(e)),wires:Mt(n).wires.map(r=>[...r]),probes:{...Mt(n).probes},scope:i?Zn(i):null,prediction:n.module==="transient"?Zn(Sn(n)):null,activity:n.module==="superposition"||n.module==="transient"?Zn(al(n)):null}),n.feedback=`Reading ${n.records.length} saved to your notebook${i?i.correct?"":`. ${i.error||"Check CH1 at Vin and CH2 at Vout, with both grounds at GND"}`:e.probesCorrect?"":". Check the probe locations: these are not across the requested output"}.`,!0)}function uf(n){const e=Ni(n),t=it(n),i=n.records.filter(o=>{var a;return o.module===n.module&&o.mode==="challenge"&&o.attempt===n.attempts[n.module]&&o.measurement.correct&&(n.module==="opamp"?((a=o.scope)==null?void 0:a.correct)&&!o.scope.stale:o.measurement.probesCorrect)});let r=[];if(n.module==="thevenin"){for(const o of["original","thevenin","norton"])r.push({label:`${o==="original"?"Original":o==="thevenin"?"Thévenin":"Norton"} verified at 250, 500 and 1000 Ω`,pass:[250,500,1e3].every(a=>i.some(c=>c.params.representation===o&&c.params.load===a&&ur(c.measurement.voltage,6*a/(500+a))))});r.push({label:"Maximum power verified at 500 Ω (18 mW)",pass:i.some(o=>o.params.load===500&&ur(o.measurement.power,.018))&&t.load===500&&e.correct&&ur(e.power,.018)})}else if(n.module==="superposition"){for(const c of["both","a","b"])r.push({label:`Baseline recorded: ${c==="both"?"both sources":c==="a"?"A alone, B shorted":"B alone, A shorted"}`,pass:i.some(l=>l.params.v1===6&&l.params.v2===3&&l.params.sourceMode===c&&(c==="both"||l.params.replacement==="short")&&ur(l.measurement.current,c==="both"?.001:c==="a"?.002:-.001))});r.push({label:"Both nonzero sources active with zero branch current",pass:i.some(c=>c.params.sourceMode==="both"&&c.params.v1>0&&c.params.v2>0&&Math.abs(c.measurement.current)<1e-7)});const o=n.sumSubmissions[`challenge:${n.attempts.superposition}:6:3`];r.push({label:"Submitted the signed sum of measured A and B currents at +6 V / −3 V",pass:!!(o!=null&&o.passed)});const a=i.find(c=>c.params.sourceMode==="both"&&c.params.v1>0&&c.params.v2>0&&Math.abs(c.measurement.current)<1e-7&&["a","b"].every(l=>i.some(u=>u.params.sourceMode===l&&u.params.replacement==="short"&&u.params.v1===c.params.v1&&u.params.v2===c.params.v2)));r.push({label:"Cancellation verified with each source's signed contribution",pass:!!a}),r.push({label:"Explained cancellation: equal and opposite branch contributions; current can flow elsewhere",pass:!!a&&t.explanation==="opposing"})}else if(n.module==="opamp"){const o=i.filter(a=>a.params.configuration==="inverting"&&a.params.rail===12&&a.params.frequency===100&&ur(a.measurement.gain,-3));r=[{label:"Gain −3 at ±12 V and 100 Hz with correct wiring",pass:e.correct&&t.configuration==="inverting"&&t.rail===12&&t.frequency===100&&ur(e.gain,-3)},{label:"Recorded an unclipped waveform at the target settings",pass:o.some(a=>!a.measurement.clipped)},{label:"Recorded a clipped waveform at the target settings",pass:o.some(a=>a.measurement.clipped)},{label:"Predicted the maximum input within 0.1 V of 11/3 Vpk",pass:Math.abs(t.prediction-11/3)<=.1},{label:"Scope channels measure Vin and Vout with grounded references",pass:vi(n).channels.ch1.correct&&vi(n).channels.ch2.correct}]}else{for(const o of["RC","RL"])for(const[a,c]of[["baseline",o==="RC"?1e3:100],["half time constant",o==="RC"?500:200]])r.push({label:`${o}: ${a}, measured at one τ`,pass:i.some(l=>{var u;return l.params.kind===o&&l.params.resistance===c&&l.params.charging&&Math.abs(l.params.initial)<1e-9&&((u=l.prediction)==null?void 0:u.locked)&&!l.prediction.late&&l.prediction.run===Sn(n,o).run&&l.prediction.sequence<l.id&&ur(l.params.time,l.measurement.tau,.02)})});for(const o of["RC","RL"])r.push({label:`${o}: predicted the effect of increasing R before testing`,pass:Sn(n,o).locked&&!Sn(n,o).late&&Sn(n,o).correct})}n.checks[n.module]=r;const s=r.filter(o=>o.pass).length;return n.feedback=s===r.length?"All checks passed. Add your explanation to the exported notebook for instructor review.":`${s} of ${r.length} checks passed. Review the remaining items below.`,r}function kh(n,e){var t;if(e==="reset-experiment")return cf(n);if(e.startsWith("scrub:")&&n.module==="transient"){const i=Number(e.slice(6));if(!Number.isFinite(i)||!Mt(n).correct)return!1;const r=it(n);return r.time=Math.max(0,Math.min(i/1e3,r.acquiredTime||0)),r.playing=!1,n.sequence++,n.feedback=`Trace cursor at ${Ft(r.time*1e3)} ms. Run to continue the response.`,!0}if(e.startsWith("probe:")){const[,i,r]=e.split(":");return cs(n,i,r||null)}if(e.startsWith("remove-wire:"))return cl(n,Number(e.split(":")[1]));if(e.startsWith("scope-ground:")){const i=e.split(":")[1];n.module==="opamp"&&["ch1","ch2"].includes(i)&&(it(n).scopeGroundChannel=i,n.tool="scopeGround",n.selectedTerminal=null,n.feedback=`Place ${i.toUpperCase()} ground at GND.`);return}if(e==="cancel"){n.selectedTerminal=null,n.feedback="Selection cancelled.";return}if(e==="undo"){const i=(t=n.history[Pn(n)])==null?void 0:t.pop();if(!i){n.feedback="No wiring or probe change to undo.";return}n.wireSets[Pn(n)]=i.wires,n.probeSets[Pn(n)]=i.probes,n.scopeSets[Pn(n)]=i.scope,n.selectedTerminal=null,n.checks[n.module]=null,n.sequence++,n.feedback="Last wiring or probe change undone.";return}if(e==="submit-sum")return nf(n);if(e==="lock-prediction")return ef(n);if(e==="restart-prediction"&&n.module==="transient"){const i=it(n),r=Sn(n).run+1;n.predictions[na(n)]={choice:"unset",locked:!1,late:!1,tested:!1,correct:!1,run:r},Object.assign(i,{resistance:i.kind==="RC"?1e3:100,time:0,initial:0,acquiredTime:0,charging:!0,playing:!1,predictionChoice:"unset"}),n.checks.transient=null,n.sequence++,n.feedback="New prediction for this circuit. Earlier readings stay in the notebook but do not count for this comparison.";return}if(e==="scope-toggle"&&n.module==="opamp"){const i=it(n);i.scopeRunning&&(n.scopeHolds[Pn(n)]=Zn(vi(n))),i.scopeRunning=!i.scopeRunning,n.sequence++,n.feedback=i.scopeRunning?"Scope running.":"Scope held. Measurements retain their acquisition settings.";return}if(e==="scope-autoscale"&&n.module==="opamp"){const i=it(n);i.scopeRunning=!0,i.timeDiv=200/i.frequency;const r=vi(n);for(const s of["ch1","ch2"]){const o=(r.channels[s].peak||0)*1.15/4;i[`${s}Scale`]=Ut[`${s}Scale`].find(a=>a>=o)||Math.max(10,o)}n.sequence++,n.feedback=r.ok?"Two periods fitted to the scope. Adjust the trigger if needed.":r.error;return}if(e.startsWith("module:")){of(n,e.slice(7));return}if(e.startsWith("set:")){const[,i,r]=e.split(":");ri(n,i,r==="true"?!0:r==="false"?!1:Number.isNaN(Number(r))?r:Number(r));return}if(e.startsWith("adjust:")){const[,i,r]=e.split(":"),s=Number(r),o=it(n),a=n.module==="superposition"&&i==="sumMilliamp"||n.module==="opamp"&&i==="prediction",c=o[i]===null?0:o[i];if(!a||r===""||!Number.isFinite(s)||!Number.isFinite(c))return n.feedback="Choose a valid numeric answer adjustment.",!1;const l=Ut[i],u=Math.min(...l),h=Math.max(...l);return ri(n,i,Number(Math.min(h,Math.max(u,c+s)).toFixed(6)))}if(e.startsWith("cycle:")){const[,i,r="1"]=e.split(":"),s=it(n),o=Ut[i];if(o&&i in s&&Number.isFinite(Number(r))&&Number(r)!==0){const a=Math.sign(Number(r));if(o.every(c=>typeof c=="number")){const c=s[i]===null?0:s[i];if(!Number.isFinite(c))return!1;const l=a>0?o.find(u=>u>c+1e-10)??o.at(-1):[...o].reverse().find(u=>u<c-1e-10)??o[0];ri(n,i,l)}else{const c=Math.max(0,o.indexOf(s[i]));ri(n,i,o[(c+a+o.length)%o.length])}}return}if(e.startsWith("tool:")){n.tool=e.slice(5),n.selectedTerminal=null,n.feedback=n.tool==="remove"?"Select a lead to remove it.":n.tool==="select"?"Select a component or terminal.":`${n.tool==="wire"?"Patch lead":n.tool==="red"?"Meter V tip":n.tool==="black"?"Meter COM tip":n.tool+" probe"} selected. Choose a terminal on the bench.`;return}if(e==="explore"||e==="build"||e==="challenge"){af(n,e);return}if(e==="record"){lf(n);return}if(e==="check"){uf(n);return}if(e==="check-wiring"){n.feedback=Mt(n).correct?"The terminal connections match the reference circuit. Now connect the probes and take a reading.":"The wiring does not yet match the reference circuit. Use Schematic to compare connections; open and shorted paths change the result.";return}if(e==="clear"||e==="reset-circuit"){as(n),n.wireSets[Pn(n)]=[],n.probeSets[Pn(n)]={red:null,black:null},n.scopeSets[Pn(n)]=ac({...n,mode:"challenge"}),n.selectedTerminal=null,n.params.transient.playing=!1,n.feedback="Leads and probes cleared. Select two terminals to add each connection.";return}if(e==="restore"){if(n.mode!=="explore"){n.feedback="Connect the circuit with patch leads, or switch to Explore to use the connected circuit.";return}const i=sl(n.module,it(n));as(n),n.wireSets[Pn(n)]=i.wires.map(r=>[...r]),n.probeSets[Pn(n)]={red:i.positive,black:"gnd"},n.scopeSets[Pn(n)]=ac(n),n.feedback="Reference circuit connected.";return}if(e==="reset-attempt"){n.attempts[n.module]++;for(const i of Object.keys(n.wireSets))i.startsWith(`challenge:${n.module}:`)&&(delete n.wireSets[i],delete n.probeSets[i],delete n.scopeSets[i],delete n.scopeHolds[i],delete n.history[i]);n.challengeStarted[n.module]=!1,n.selectedTerminal=null,n.mode==="challenge"&&ll(n),n.checks[n.module]=null,n.feedback="A new challenge attempt has started. Earlier readings remain in the notebook.",Mt(n);return}if(n.module==="transient"){const i=it(n);if(e==="play"){if(!Mt(n).correct){n.feedback="Complete the circuit before running the transient.";return}i.playing=!i.playing,i.playing&&Di(n)}e==="switch"&&(Di(n),i.initial=Hn({...i,source:5}).storageValue,i.time=0,i.acquiredTime=0,i.charging=!i.charging,n.feedback=i.charging?"Switch connected to the 5 V source. Stored state is preserved.":"Switch connected to the closed return loop. Stored state is preserved."),e==="replay"&&(Mt(n).correct&&Di(n),i.time=0,i.acquiredTime=0,i.playing=Mt(n).correct,n.feedback="Replaying this switching segment from its stored initial condition."),e==="reset-energy"&&(i.initial=0,i.time=0,i.acquiredTime=0,i.charging=!0,i.playing=!1,n.feedback="New experiment: initial stored energy set to zero."),e==="one-tau"&&(Di(n),i.time=Hn({...i,source:5}).tau,Mt(n).correct&&(i.acquiredTime=Math.max(i.acquiredTime||0,i.time)),i.playing=!1),e==="five-tau"&&(Di(n),i.time=Hn({...i,source:5}).tau*5,Mt(n).correct&&(i.acquiredTime=Math.max(i.acquiredTime||0,i.time)),i.playing=!1)}n.sequence++}function hf(n){const e=Ni(n),t=e.ok,i={label:"Voltmeter",value:e.probeReady?Ft(e.probeVoltage):"—",unit:"V",detail:e.probeReady?"V tip − COM tip":"Place both probes"};return n.module==="opamp"?[{...i,label:"Voltage sample",detail:`At input +peak · ${Ft(250/it(n).frequency)} ms · V tip − COM tip`},{label:"Linear gain",value:t?Ft(e.gain):"—",unit:"V/V",detail:t?e.clipped?"Output is clipping":"Within output limits":"Connect feedback & supplies"},{label:"Output peak",value:t?Ft(e.peak):"—",unit:"Vpk",detail:`Teaching model: ±${it(n).rail-1} V limit`}]:n.module==="transient"?[i,{label:"Storage current",value:t?Ft(e.current*1e3):"—",unit:"mA",detail:"Fixed sensor · top → ground"},{label:"Stored energy",value:t?Ft(e.energy*1e3,4):"—",unit:"mJ",detail:t?`τ = ${Ft(e.tau*1e3)} ms`:"Complete the storage loop"}]:[i,{label:"Branch current",value:t?Ft(e.current*1e3):"—",unit:"mA",detail:"Fixed sensor · top → ground"},{label:"Load power",value:t?Ft(e.power*1e3):"—",unit:"mW",detail:"Computed from V × I"}]}const iu=new WeakMap;function ia(n){const e=it(n),t=Ni(n);if(n.module==="thevenin"){const{circuit:c,wires:l,correct:u}=Mt(n),h=Math.max(2e3,e.load),d=[...new Set([...Array.from({length:100},(p,_)=>(_+1)*h/100),...Ut.load.filter(p=>p<=h),e.load])].sort((p,_)=>p-_),f=JSON.stringify([c.electrical,l,e.load]),g=iu.get(n),v=(g==null?void 0:g.signature)===f?g.points:[];if((g==null?void 0:g.signature)!==f&&t.ok)for(const p of d){const _=ol({components:c.electrical.map(x=>x.id==="load"?{...x,value:p}:x),wires:l});_.ok&&v.push([p,(_.voltages.loada-_.voltages.loadb)*_.currents.load*1e3])}(g==null?void 0:g.signature)!==f&&iu.set(n,{signature:f,points:v});const m=v.reduce((p,[_,x])=>!p||x>p.y?{x:_,y:x}:p,null);return{title:"Load power sweep",subtitle:t.ok?`Calculated sweep · current wiring${u?"":" differs from the diagram"} · select a load to test it`:t.error,series:v.length?[{name:"Calculated load power",color:"#17788d",unit:"mW",points:v}]:[],interaction:"load",calculated:!0,valid:t.ok,error:t.ok?null:t.error,xMax:h,yMin:0,yMax:Math.max((m==null?void 0:m.y)||0,.001)*1.12,xLabel:"Load resistance (Ω)",yLabel:"Power (mW)",xUnit:"Ω",yUnit:"mW",peak:m,marker:t.ok?{x:e.load,y:t.power*1e3}:null}}if(n.module==="superposition"){const c=Fh(n),l=c.live;return{title:c.superpositionValid?"Signed source contributions":"Source states",interaction:"source",calculated:!0,subtitle:c.error||"Calculated from current wiring · positive current flows top → ground",bars:[{name:"A alone",sourceMode:"a",value:l.a.valid?l.a.current*1e3:null,missing:!l.a.valid,color:"#17788d"},{name:"B alone",sourceMode:"b",value:l.b.valid?l.b.current*1e3:null,missing:!l.b.valid,color:"#b77739"},{name:"Both",sourceMode:"both",value:l.both.valid?l.both.current*1e3:null,missing:!l.both.valid,color:"#294a61"}],yLabel:"Current (mA)",yUnit:"mA",series:[]}}if(n.module==="opamp"){const c=vi(n),l=["ch1","ch2"].map((u,h)=>{const d=c.channels[u],f=h?"#17788d":"#b77739";return{id:u,interaction:"scope",title:`${u.toUpperCase()} · ${d.scale} V/div`,subtitle:d.error||c.error||`${d.signal} − ${d.ground} · ${c.running?"Run":"Hold"}${c.stale?" · old settings":""}`,series:d.valid&&d.points.length?[{name:u.toUpperCase(),color:f,points:d.points}]:[],xMax:c.timeDiv*10,yMin:-d.scale*4,yMax:d.scale*4,xLabel:"Time (ms)",yLabel:"Voltage (V)",xUnit:"ms",yUnit:"V",limits:u==="ch2"&&d.correct?c.limits:[]}});return{title:"Oscilloscope",interaction:"scope",subtitle:c.error||`${e.frequency} Hz · ${c.trigger.edge} trigger at ${c.trigger.level} V · ${c.running?"Run":"Hold"}`,series:l.flatMap(u=>u.series),panels:l,xMax:c.timeDiv*10,yMin:-Math.max(c.channels.ch1.scale,c.channels.ch2.scale)*4,yMax:Math.max(c.channels.ch1.scale,c.channels.ch2.scale)*4,xLabel:"Time (ms)",yLabel:"Voltage (V)",limits:c.limits,scope:c}}const i=Hn({...e,source:5}).tau,r=t.ok?Math.max(0,e.acquiredTime||0):0,s=Math.max((e.kind==="RC"?.1:.001)*5e3,r*1e3),o=t.ok?Array.from({length:r>0?121:1},(c,l)=>{const u=r>0?l/120*r:0,h=Hn({...e,source:5,time:u});return{time:u*1e3,voltage:h.voltage,current:h.current*1e3,energy:h.energy*1e3}}):[],a=["voltage","current","energy"].map((c,l)=>{const u=o.map(v=>[v.time,v[c]]),h=u.map(v=>v[1]),d=c==="voltage"?`${e.kind==="RC"?"Capacitor":"Inductor"} voltage`:c==="current"?"Storage current":"Stored energy",f=Hn({...e,source:5,time:0}),g=c==="voltage"?Math.max(5,Math.abs(f.voltage)):c==="current"?Math.max(5e3/e.resistance,Math.abs(f.current*1e3)):Math.max(f.energy*1e3,e.kind==="RC"?12500*e.capacitance:12500*e.inductance/e.resistance**2);return{id:c,title:d,subtitle:t.ok?`${e.charging?"Source connected":"Closed return"} · ${e.playing?"Acquiring":r?"Paused":"Press Run"} · ${Ft(r*1e3)} ms acquired`:t.error,series:u.length?[{name:d,color:["#17788d","#b77739","#735782"][l],unit:["V","mA","mJ"][l],points:u}]:[],interaction:"time",valid:t.ok,acquiredMax:r*1e3,xMax:s,yMin:Math.min(0,...h)*1.12,yMax:Math.max(g,...h,.001)*1.12,xLabel:"Elapsed circuit time (ms)",yLabel:["Voltage (V)","Current (mA)","Energy (mJ)"][l],xUnit:"ms",yUnit:["V","mA","mJ"][l],marker:t.ok?{x:e.time*1e3,y:c==="voltage"?t.voltage:c==="current"?t.current*1e3:t.energy*1e3}:null,tau:i*1e3}});return{...a[e.kind==="RC"?0:1],panels:a}}function zh(n,e,t=0){var h;const i=ia(n),r=((h=i.panels)==null?void 0:h[t])||i,s=Number.isFinite(e)?Math.max(0,Math.min(1,e)):0;if(i.bars){const d=i.bars[Math.min(i.bars.length-1,Math.floor(s*i.bars.length))];return{x:null,xLabel:d.name,readings:d.missing?[]:[{name:d.name,value:d.value,unit:i.yUnit,color:d.color}],text:d.missing?`${d.name}: circuit unavailable`:`${d.name}: ${Ft(d.value)} ${i.yUnit}`,sourceMode:d.sourceMode}}const o=s*r.xMax,a=r.yUnit||"V",c=i.panels||[r],l=[];if(!(r.acquiredMax!==void 0&&o>r.acquiredMax+1e-8))for(const d of c)for(const f of d.series||[]){const g=f.points;if(!g.length||o<g[0][0]-1e-8||o>g.at(-1)[0]+1e-8)continue;let v=g.findIndex(([M])=>M>=o);v<0&&(v=g.length-1);const[m,p]=g[Math.max(0,v-1)],[_,x]=g[v],y=m===_?x:p+(o-m)/(_-m)*(x-p);l.push({name:f.name,value:y,unit:f.unit||d.yUnit||a,color:f.color})}const u=`${Ft(o)} ${r.xUnit||"ms"}`;return{x:o,xLabel:u,readings:l,text:l.length?`${u} · ${l.map(d=>`${d.name} ${Ft(d.value)} ${d.unit}`).join(" · ")}`:`${u} · ${r.acquiredMax!==void 0&&o>r.acquiredMax?"not acquired; run the circuit":"no trace at this point"}`}}function Bh(n){const e=it(n),t=[],i=(s,o,a,c="")=>t.push({group:s,id:o,label:a,value:c}),r=(s,o,a,c="Settings")=>{i(c,`cycle:${s}`,`${o} +`,a),i(c,`cycle:${s}:-1`,`${o} −`,a)};i("Guide",n.mode==="explore"?"build":"explore",n.mode==="explore"?"Build circuit":"Explore"),i("Guide","reset-circuit","Clear circuit"),i("Guide","reset-experiment","Reset experiment");for(const[s,o]of[["select","Select"],["wire","Wire"],["remove","Remove"],["red","Meter V tip"],["black","Meter COM tip"]])i("Bench",`tool:${s}`,o,n.tool===s?"Selected":"");if(i("Bench","undo","Undo"),i("Bench","cancel","Cancel selection"),i("Bench","check-wiring","Check wiring"),n.module==="thevenin"){for(const s of["original","thevenin","norton"])i("Settings",`set:representation:${s}`,s==="thevenin"?"Thévenin":s==="norton"?"Norton":"Original",e.representation===s?"Selected":"");r("load","Load",`${e.load} Ω`),e.representation==="thevenin"&&r("equivalentVoltage","Vth",`${e.equivalentVoltage} V`),e.representation==="norton"&&r("nortonCurrent","In",`${e.nortonCurrent} mA`),e.representation!=="original"&&r("equivalentResistance","Equivalent R",`${e.equivalentResistance} Ω`)}if(n.module==="superposition"){for(const[s,o]of[["both","Both sources"],["a","A alone"],["b","B alone"]])i("Settings",`set:sourceMode:${s}`,o,e.sourceMode===s?"Selected":"");r("v1","Source A",`+${e.v1} V`),r("v2","Source B",`−${e.v2} V`),i("Settings",`set:replacement:${e.replacement==="short"?"open":"short"}`,"Inactive source",e.replacement)}if(n.module==="opamp"){i("Settings",`set:configuration:${e.configuration==="inverting"?"noninverting":"inverting"}`,"Configuration",e.configuration),r("rin","Rin",`${e.rin/1e3} kΩ`),r("rf","Rf",`${e.rf/1e3} kΩ`),r("amplitude","Input",`${e.amplitude} Vpk`),r("rail","Supply",`±${e.rail} V`),r("frequency","Frequency",`${e.frequency} Hz`);for(const s of["ch1","ch2"])i("Bench",`tool:${s}`,`${s.toUpperCase()} signal`,n.tool===s?"Selected":""),i("Bench",`scope-ground:${s}`,`${s.toUpperCase()} ground`,n.tool==="scopeGround"&&e.scopeGroundChannel===s?"Selected":""),r(`${s}Scale`,`${s.toUpperCase()} scale`,`${e[`${s}Scale`]} V/div`);r("timeDiv","Timebase",`${e.timeDiv} ms/div`),r("triggerLevel","Trigger level",`${e.triggerLevel} V`),i("Settings",`set:triggerEdge:${e.triggerEdge==="rising"?"falling":"rising"}`,"Trigger edge",e.triggerEdge),i("Bench","scope-toggle",e.scopeRunning?"Hold scope":"Run scope"),i("Bench","scope-autoscale","Autoscale")}n.module==="transient"&&(i("Settings",`set:kind:${e.kind==="RC"?"RL":"RC"}`,"Circuit",e.kind),r("resistance","Resistance",`${e.resistance} Ω`),r("speed","Playback",`${e.speed}×`),i("Bench","switch","Switch",e.charging?"Source":"Return"),i("Bench","play",e.playing?"Pause":"Run"),i("Bench","one-tau","Cursor at 1 τ"),i("Bench","five-tau","Cursor at 5 τ"),i("Bench","reset-energy","Zero energy"),i("Bench","replay","Replay")),n.mode==="explore"&&i("Bench","restore","Connect reference");for(const[s,o]of Object.entries(fn))i("Labs",`module:${s}`,`Lab ${o.number}: ${o.name}`,n.module===s?"Current":"");return t}/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const ul="180",ns={ROTATE:0,DOLLY:1,PAN:2},Qr={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},df=0,ru=1,ff=2,Vh=1,Hh=2,Ri=3,ir=0,Fn=1,pi=2,Ji=0,is=1,su=2,ou=3,au=4,pf=5,_r=100,mf=101,gf=102,vf=103,_f=104,xf=200,yf=201,bf=202,Mf=203,lc=204,uc=205,Sf=206,Ef=207,wf=208,Tf=209,Af=210,Rf=211,Cf=212,Pf=213,Lf=214,hc=0,dc=1,fc=2,ls=3,pc=4,mc=5,gc=6,vc=7,Gh=0,Df=1,If=2,Qi=0,Uf=1,Nf=2,Of=3,Wh=4,Ff=5,kf=6,zf=7,$h=300,us=301,hs=302,_c=303,xc=304,ra=306,yc=1e3,br=1001,bc=1002,ci=1003,Bf=1004,co=1005,si=1006,Sa=1007,Ki=1008,_i=1009,qh=1010,Xh=1011,Hs=1012,hl=1013,wr=1014,Ii=1015,Qs=1016,dl=1017,fl=1018,Gs=1020,Yh=35902,jh=35899,Zh=1021,Kh=1022,oi=1023,Ws=1026,$s=1027,Jh=1028,pl=1029,Qh=1030,ml=1031,gl=1033,zo=33776,Bo=33777,Vo=33778,Ho=33779,Mc=35840,Sc=35841,Ec=35842,wc=35843,Tc=36196,Ac=37492,Rc=37496,Cc=37808,Pc=37809,Lc=37810,Dc=37811,Ic=37812,Uc=37813,Nc=37814,Oc=37815,Fc=37816,kc=37817,zc=37818,Bc=37819,Vc=37820,Hc=37821,Gc=36492,Wc=36494,$c=36495,qc=36283,Xc=36284,Yc=36285,jc=36286,Vf=3200,Hf=3201,ed=0,Gf=1,Zi="",Mn="srgb",ds="srgb-linear",$o="linear",It="srgb",Fr=7680,cu=519,Wf=512,$f=513,qf=514,td=515,Xf=516,Yf=517,jf=518,Zf=519,lu=35044,uu="300 es",gi=2e3,qo=2001;class Cr{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const r=i[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}}const xn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let hu=1234567;const rs=Math.PI/180,qs=180/Math.PI;function Pr(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(xn[n&255]+xn[n>>8&255]+xn[n>>16&255]+xn[n>>24&255]+"-"+xn[e&255]+xn[e>>8&255]+"-"+xn[e>>16&15|64]+xn[e>>24&255]+"-"+xn[t&63|128]+xn[t>>8&255]+"-"+xn[t>>16&255]+xn[t>>24&255]+xn[i&255]+xn[i>>8&255]+xn[i>>16&255]+xn[i>>24&255]).toLowerCase()}function at(n,e,t){return Math.max(e,Math.min(t,n))}function vl(n,e){return(n%e+e)%e}function Kf(n,e,t,i,r){return i+(n-e)*(r-i)/(t-e)}function Jf(n,e,t){return n!==e?(t-n)/(e-n):0}function Os(n,e,t){return(1-t)*n+t*e}function Qf(n,e,t,i){return Os(n,e,1-Math.exp(-t*i))}function ep(n,e=1){return e-Math.abs(vl(n,e*2)-e)}function tp(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function np(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function ip(n,e){return n+Math.floor(Math.random()*(e-n+1))}function rp(n,e){return n+Math.random()*(e-n)}function sp(n){return n*(.5-Math.random())}function op(n){n!==void 0&&(hu=n);let e=hu+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function ap(n){return n*rs}function cp(n){return n*qs}function lp(n){return(n&n-1)===0&&n!==0}function up(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function hp(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function dp(n,e,t,i,r){const s=Math.cos,o=Math.sin,a=s(t/2),c=o(t/2),l=s((e+i)/2),u=o((e+i)/2),h=s((e-i)/2),d=o((e-i)/2),f=s((i-e)/2),g=o((i-e)/2);switch(r){case"XYX":n.set(a*u,c*h,c*d,a*l);break;case"YZY":n.set(c*d,a*u,c*h,a*l);break;case"ZXZ":n.set(c*h,c*d,a*u,a*l);break;case"XZX":n.set(a*u,c*g,c*f,a*l);break;case"YXY":n.set(c*f,a*u,c*g,a*l);break;case"ZYZ":n.set(c*g,c*f,a*u,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function Jr(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Rn(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const dn={DEG2RAD:rs,RAD2DEG:qs,generateUUID:Pr,clamp:at,euclideanModulo:vl,mapLinear:Kf,inverseLerp:Jf,lerp:Os,damp:Qf,pingpong:ep,smoothstep:tp,smootherstep:np,randInt:ip,randFloat:rp,randFloatSpread:sp,seededRandom:op,degToRad:ap,radToDeg:cp,isPowerOfTwo:lp,ceilPowerOfTwo:up,floorPowerOfTwo:hp,setQuaternionFromProperEuler:dp,normalize:Rn,denormalize:Jr};class xe{constructor(e=0,t=0){xe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=at(this.x,e.x,t.x),this.y=at(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=at(this.x,e,t),this.y=at(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(at(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(at(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class hn{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,s,o,a){let c=i[r+0],l=i[r+1],u=i[r+2],h=i[r+3];const d=s[o+0],f=s[o+1],g=s[o+2],v=s[o+3];if(a===0){e[t+0]=c,e[t+1]=l,e[t+2]=u,e[t+3]=h;return}if(a===1){e[t+0]=d,e[t+1]=f,e[t+2]=g,e[t+3]=v;return}if(h!==v||c!==d||l!==f||u!==g){let m=1-a;const p=c*d+l*f+u*g+h*v,_=p>=0?1:-1,x=1-p*p;if(x>Number.EPSILON){const M=Math.sqrt(x),w=Math.atan2(M,p*_);m=Math.sin(m*w)/M,a=Math.sin(a*w)/M}const y=a*_;if(c=c*m+d*y,l=l*m+f*y,u=u*m+g*y,h=h*m+v*y,m===1-a){const M=1/Math.sqrt(c*c+l*l+u*u+h*h);c*=M,l*=M,u*=M,h*=M}}e[t]=c,e[t+1]=l,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,i,r,s,o){const a=i[r],c=i[r+1],l=i[r+2],u=i[r+3],h=s[o],d=s[o+1],f=s[o+2],g=s[o+3];return e[t]=a*g+u*h+c*f-l*d,e[t+1]=c*g+u*d+l*h-a*f,e[t+2]=l*g+u*f+a*d-c*h,e[t+3]=u*g-a*h-c*d-l*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,c=Math.sin,l=a(i/2),u=a(r/2),h=a(s/2),d=c(i/2),f=c(r/2),g=c(s/2);switch(o){case"XYZ":this._x=d*u*h+l*f*g,this._y=l*f*h-d*u*g,this._z=l*u*g+d*f*h,this._w=l*u*h-d*f*g;break;case"YXZ":this._x=d*u*h+l*f*g,this._y=l*f*h-d*u*g,this._z=l*u*g-d*f*h,this._w=l*u*h+d*f*g;break;case"ZXY":this._x=d*u*h-l*f*g,this._y=l*f*h+d*u*g,this._z=l*u*g+d*f*h,this._w=l*u*h-d*f*g;break;case"ZYX":this._x=d*u*h-l*f*g,this._y=l*f*h+d*u*g,this._z=l*u*g-d*f*h,this._w=l*u*h+d*f*g;break;case"YZX":this._x=d*u*h+l*f*g,this._y=l*f*h+d*u*g,this._z=l*u*g-d*f*h,this._w=l*u*h-d*f*g;break;case"XZY":this._x=d*u*h-l*f*g,this._y=l*f*h-d*u*g,this._z=l*u*g+d*f*h,this._w=l*u*h+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],r=t[4],s=t[8],o=t[1],a=t[5],c=t[9],l=t[2],u=t[6],h=t[10],d=i+a+h;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(u-c)*f,this._y=(s-l)*f,this._z=(o-r)*f}else if(i>a&&i>h){const f=2*Math.sqrt(1+i-a-h);this._w=(u-c)/f,this._x=.25*f,this._y=(r+o)/f,this._z=(s+l)/f}else if(a>h){const f=2*Math.sqrt(1+a-i-h);this._w=(s-l)/f,this._x=(r+o)/f,this._y=.25*f,this._z=(c+u)/f}else{const f=2*Math.sqrt(1+h-i-a);this._w=(o-r)/f,this._x=(s+l)/f,this._y=(c+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(at(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,r=e._y,s=e._z,o=e._w,a=t._x,c=t._y,l=t._z,u=t._w;return this._x=i*u+o*a+r*l-s*c,this._y=r*u+o*c+s*a-i*l,this._z=s*u+o*l+i*c-r*a,this._w=o*u-i*a-r*c-s*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,o=this._w;let a=o*e._w+i*e._x+r*e._y+s*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=i,this._y=r,this._z=s,this;const c=1-a*a;if(c<=Number.EPSILON){const f=1-t;return this._w=f*o+t*this._w,this._x=f*i+t*this._x,this._y=f*r+t*this._y,this._z=f*s+t*this._z,this.normalize(),this}const l=Math.sqrt(c),u=Math.atan2(l,a),h=Math.sin((1-t)*u)/l,d=Math.sin(t*u)/l;return this._w=o*h+this._w*d,this._x=i*h+this._x*d,this._y=r*h+this._y*d,this._z=s*h+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class D{constructor(e=0,t=0,i=0){D.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(du.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(du.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){const t=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,c=e.w,l=2*(o*r-a*i),u=2*(a*t-s*r),h=2*(s*i-o*t);return this.x=t+c*l+o*h-a*u,this.y=i+c*u+a*l-s*h,this.z=r+c*h+s*u-o*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=at(this.x,e.x,t.x),this.y=at(this.y,e.y,t.y),this.z=at(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=at(this.x,e,t),this.y=at(this.y,e,t),this.z=at(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(at(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,r=e.y,s=e.z,o=t.x,a=t.y,c=t.z;return this.x=r*c-s*a,this.y=s*o-i*c,this.z=i*a-r*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Ea.copy(this).projectOnVector(e),this.sub(Ea)}reflect(e){return this.sub(Ea.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(at(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ea=new D,du=new hn;class ot{constructor(e,t,i,r,s,o,a,c,l){ot.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,c,l)}set(e,t,i,r,s,o,a,c,l){const u=this.elements;return u[0]=e,u[1]=r,u[2]=a,u[3]=t,u[4]=s,u[5]=c,u[6]=i,u[7]=o,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[3],c=i[6],l=i[1],u=i[4],h=i[7],d=i[2],f=i[5],g=i[8],v=r[0],m=r[3],p=r[6],_=r[1],x=r[4],y=r[7],M=r[2],w=r[5],A=r[8];return s[0]=o*v+a*_+c*M,s[3]=o*m+a*x+c*w,s[6]=o*p+a*y+c*A,s[1]=l*v+u*_+h*M,s[4]=l*m+u*x+h*w,s[7]=l*p+u*y+h*A,s[2]=d*v+f*_+g*M,s[5]=d*m+f*x+g*w,s[8]=d*p+f*y+g*A,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8];return t*o*u-t*a*l-i*s*u+i*a*c+r*s*l-r*o*c}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8],h=u*o-a*l,d=a*c-u*s,f=l*s-o*c,g=t*h+i*d+r*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return e[0]=h*v,e[1]=(r*l-u*i)*v,e[2]=(a*i-r*o)*v,e[3]=d*v,e[4]=(u*t-r*c)*v,e[5]=(r*s-a*t)*v,e[6]=f*v,e[7]=(i*c-l*t)*v,e[8]=(o*t-i*s)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,o,a){const c=Math.cos(s),l=Math.sin(s);return this.set(i*c,i*l,-i*(c*o+l*a)+o+e,-r*l,r*c,-r*(-l*o+c*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(wa.makeScale(e,t)),this}rotate(e){return this.premultiply(wa.makeRotation(-e)),this}translate(e,t){return this.premultiply(wa.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const wa=new ot;function nd(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Xo(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function fp(){const n=Xo("canvas");return n.style.display="block",n}const fu={};function Xs(n){n in fu||(fu[n]=!0,console.warn(n))}function pp(n,e,t){return new Promise(function(i,r){function s(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:i()}}setTimeout(s,t)})}const pu=new ot().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),mu=new ot().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function mp(){const n={enabled:!0,workingColorSpace:ds,spaces:{},convert:function(r,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===It&&(r.r=Oi(r.r),r.g=Oi(r.g),r.b=Oi(r.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===It&&(r.r=ss(r.r),r.g=ss(r.g),r.b=ss(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===Zi?$o:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,o){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return Xs("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return Xs("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[ds]:{primaries:e,whitePoint:i,transfer:$o,toXYZ:pu,fromXYZ:mu,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Mn},outputColorSpaceConfig:{drawingBufferColorSpace:Mn}},[Mn]:{primaries:e,whitePoint:i,transfer:It,toXYZ:pu,fromXYZ:mu,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Mn}}}),n}const wt=mp();function Oi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function ss(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let kr;class gp{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{kr===void 0&&(kr=Xo("canvas")),kr.width=e.width,kr.height=e.height;const r=kr.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=kr}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Xo("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=Oi(s[o]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Oi(t[i]/255)*255):t[i]=Oi(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let vp=0;class _l{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:vp++}),this.uuid=Pr(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(Ta(r[o].image)):s.push(Ta(r[o]))}else s=Ta(r);i.url=s}return t||(e.images[this.uuid]=i),i}}function Ta(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?gp.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let _p=0;const Aa=new D;class Dn extends Cr{constructor(e=Dn.DEFAULT_IMAGE,t=Dn.DEFAULT_MAPPING,i=br,r=br,s=si,o=Ki,a=oi,c=_i,l=Dn.DEFAULT_ANISOTROPY,u=Zi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:_p++}),this.uuid=Pr(),this.name="",this.source=new _l(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new xe(0,0),this.repeat=new xe(1,1),this.center=new xe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ot,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Aa).x}get height(){return this.source.getSize(Aa).y}get depth(){return this.source.getSize(Aa).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}r&&i&&r.isVector2&&i.isVector2||r&&i&&r.isVector3&&i.isVector3||r&&i&&r.isMatrix3&&i.isMatrix3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==$h)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case yc:e.x=e.x-Math.floor(e.x);break;case br:e.x=e.x<0?0:1;break;case bc:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case yc:e.y=e.y-Math.floor(e.y);break;case br:e.y=e.y<0?0:1;break;case bc:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Dn.DEFAULT_IMAGE=null;Dn.DEFAULT_MAPPING=$h;Dn.DEFAULT_ANISOTROPY=1;class Kt{constructor(e=0,t=0,i=0,r=1){Kt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*t+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*t+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*t+o[7]*i+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s;const c=e.elements,l=c[0],u=c[4],h=c[8],d=c[1],f=c[5],g=c[9],v=c[2],m=c[6],p=c[10];if(Math.abs(u-d)<.01&&Math.abs(h-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+v)<.1&&Math.abs(g+m)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const x=(l+1)/2,y=(f+1)/2,M=(p+1)/2,w=(u+d)/4,A=(h+v)/4,C=(g+m)/4;return x>y&&x>M?x<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(x),r=w/i,s=A/i):y>M?y<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(y),i=w/r,s=C/r):M<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(M),i=A/s,r=C/s),this.set(i,r,s,t),this}let _=Math.sqrt((m-g)*(m-g)+(h-v)*(h-v)+(d-u)*(d-u));return Math.abs(_)<.001&&(_=1),this.x=(m-g)/_,this.y=(h-v)/_,this.z=(d-u)/_,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=at(this.x,e.x,t.x),this.y=at(this.y,e.y,t.y),this.z=at(this.z,e.z,t.z),this.w=at(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=at(this.x,e,t),this.y=at(this.y,e,t),this.z=at(this.z,e,t),this.w=at(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(at(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class xp extends Cr{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:si,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new Kt(0,0,e,t),this.scissorTest=!1,this.viewport=new Kt(0,0,e,t);const r={width:e,height:t,depth:i.depth},s=new Dn(r);this.textures=[];const o=i.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:si,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i,this.textures[r].isArrayTexture=this.textures[r].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const r=Object.assign({},e.textures[t].image);this.textures[t].source=new _l(r)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Tr extends xp{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class id extends Dn{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=ci,this.minFilter=ci,this.wrapR=br,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class yp extends Dn{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=ci,this.minFilter=ci,this.wrapR=br,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class er{constructor(e=new D(1/0,1/0,1/0),t=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(ti.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(ti.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=ti.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,ti):ti.fromBufferAttribute(s,o),ti.applyMatrix4(e.matrixWorld),this.expandByPoint(ti);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),lo.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),lo.copy(i.boundingBox)),lo.applyMatrix4(e.matrixWorld),this.union(lo)}const r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ti),ti.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ws),uo.subVectors(this.max,ws),zr.subVectors(e.a,ws),Br.subVectors(e.b,ws),Vr.subVectors(e.c,ws),Hi.subVectors(Br,zr),Gi.subVectors(Vr,Br),hr.subVectors(zr,Vr);let t=[0,-Hi.z,Hi.y,0,-Gi.z,Gi.y,0,-hr.z,hr.y,Hi.z,0,-Hi.x,Gi.z,0,-Gi.x,hr.z,0,-hr.x,-Hi.y,Hi.x,0,-Gi.y,Gi.x,0,-hr.y,hr.x,0];return!Ra(t,zr,Br,Vr,uo)||(t=[1,0,0,0,1,0,0,0,1],!Ra(t,zr,Br,Vr,uo))?!1:(ho.crossVectors(Hi,Gi),t=[ho.x,ho.y,ho.z],Ra(t,zr,Br,Vr,uo))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ti).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ti).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Si[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Si[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Si[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Si[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Si[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Si[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Si[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Si[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Si),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Si=[new D,new D,new D,new D,new D,new D,new D,new D],ti=new D,lo=new er,zr=new D,Br=new D,Vr=new D,Hi=new D,Gi=new D,hr=new D,ws=new D,uo=new D,ho=new D,dr=new D;function Ra(n,e,t,i,r){for(let s=0,o=n.length-3;s<=o;s+=3){dr.fromArray(n,s);const a=r.x*Math.abs(dr.x)+r.y*Math.abs(dr.y)+r.z*Math.abs(dr.z),c=e.dot(dr),l=t.dot(dr),u=i.dot(dr);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>a)return!1}return!0}const bp=new er,Ts=new D,Ca=new D;class sa{constructor(e=new D,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):bp.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ts.subVectors(e,this.center);const t=Ts.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(Ts,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ca.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ts.copy(e.center).add(Ca)),this.expandByPoint(Ts.copy(e.center).sub(Ca))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const Ei=new D,Pa=new D,fo=new D,Wi=new D,La=new D,po=new D,Da=new D;class oa{constructor(e=new D,t=new D(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ei)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Ei.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Ei.copy(this.origin).addScaledVector(this.direction,t),Ei.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){Pa.copy(e).add(t).multiplyScalar(.5),fo.copy(t).sub(e).normalize(),Wi.copy(this.origin).sub(Pa);const s=e.distanceTo(t)*.5,o=-this.direction.dot(fo),a=Wi.dot(this.direction),c=-Wi.dot(fo),l=Wi.lengthSq(),u=Math.abs(1-o*o);let h,d,f,g;if(u>0)if(h=o*c-a,d=o*a-c,g=s*u,h>=0)if(d>=-g)if(d<=g){const v=1/u;h*=v,d*=v,f=h*(h+o*d+2*a)+d*(o*h+d+2*c)+l}else d=s,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*c)+l;else d=-s,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*c)+l;else d<=-g?(h=Math.max(0,-(-o*s+a)),d=h>0?-s:Math.min(Math.max(-s,-c),s),f=-h*h+d*(d+2*c)+l):d<=g?(h=0,d=Math.min(Math.max(-s,-c),s),f=d*(d+2*c)+l):(h=Math.max(0,-(o*s+a)),d=h>0?s:Math.min(Math.max(-s,-c),s),f=-h*h+d*(d+2*c)+l);else d=o>0?-s:s,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(Pa).addScaledVector(fo,d),f}intersectSphere(e,t){Ei.subVectors(e.center,this.origin);const i=Ei.dot(this.direction),r=Ei.dot(Ei)-i*i,s=e.radius*e.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=i-o,c=i+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,o,a,c;const l=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return l>=0?(i=(e.min.x-d.x)*l,r=(e.max.x-d.x)*l):(i=(e.max.x-d.x)*l,r=(e.min.x-d.x)*l),u>=0?(s=(e.min.y-d.y)*u,o=(e.max.y-d.y)*u):(s=(e.max.y-d.y)*u,o=(e.min.y-d.y)*u),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),h>=0?(a=(e.min.z-d.z)*h,c=(e.max.z-d.z)*h):(a=(e.max.z-d.z)*h,c=(e.min.z-d.z)*h),i>c||a>r)||((a>i||i!==i)&&(i=a),(c<r||r!==r)&&(r=c),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,Ei)!==null}intersectTriangle(e,t,i,r,s){La.subVectors(t,e),po.subVectors(i,e),Da.crossVectors(La,po);let o=this.direction.dot(Da),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Wi.subVectors(this.origin,e);const c=a*this.direction.dot(po.crossVectors(Wi,po));if(c<0)return null;const l=a*this.direction.dot(La.cross(Wi));if(l<0||c+l>o)return null;const u=-a*Wi.dot(Da);return u<0?null:this.at(u/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Vt{constructor(e,t,i,r,s,o,a,c,l,u,h,d,f,g,v,m){Vt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,c,l,u,h,d,f,g,v,m)}set(e,t,i,r,s,o,a,c,l,u,h,d,f,g,v,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=i,p[12]=r,p[1]=s,p[5]=o,p[9]=a,p[13]=c,p[2]=l,p[6]=u,p[10]=h,p[14]=d,p[3]=f,p[7]=g,p[11]=v,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Vt().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,r=1/Hr.setFromMatrixColumn(e,0).length(),s=1/Hr.setFromMatrixColumn(e,1).length(),o=1/Hr.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),c=Math.cos(r),l=Math.sin(r),u=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){const d=o*u,f=o*h,g=a*u,v=a*h;t[0]=c*u,t[4]=-c*h,t[8]=l,t[1]=f+g*l,t[5]=d-v*l,t[9]=-a*c,t[2]=v-d*l,t[6]=g+f*l,t[10]=o*c}else if(e.order==="YXZ"){const d=c*u,f=c*h,g=l*u,v=l*h;t[0]=d+v*a,t[4]=g*a-f,t[8]=o*l,t[1]=o*h,t[5]=o*u,t[9]=-a,t[2]=f*a-g,t[6]=v+d*a,t[10]=o*c}else if(e.order==="ZXY"){const d=c*u,f=c*h,g=l*u,v=l*h;t[0]=d-v*a,t[4]=-o*h,t[8]=g+f*a,t[1]=f+g*a,t[5]=o*u,t[9]=v-d*a,t[2]=-o*l,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){const d=o*u,f=o*h,g=a*u,v=a*h;t[0]=c*u,t[4]=g*l-f,t[8]=d*l+v,t[1]=c*h,t[5]=v*l+d,t[9]=f*l-g,t[2]=-l,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){const d=o*c,f=o*l,g=a*c,v=a*l;t[0]=c*u,t[4]=v-d*h,t[8]=g*h+f,t[1]=h,t[5]=o*u,t[9]=-a*u,t[2]=-l*u,t[6]=f*h+g,t[10]=d-v*h}else if(e.order==="XZY"){const d=o*c,f=o*l,g=a*c,v=a*l;t[0]=c*u,t[4]=-h,t[8]=l*u,t[1]=d*h+v,t[5]=o*u,t[9]=f*h-g,t[2]=g*h-f,t[6]=a*u,t[10]=v*h+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Mp,e,Sp)}lookAt(e,t,i){const r=this.elements;return Bn.subVectors(e,t),Bn.lengthSq()===0&&(Bn.z=1),Bn.normalize(),$i.crossVectors(i,Bn),$i.lengthSq()===0&&(Math.abs(i.z)===1?Bn.x+=1e-4:Bn.z+=1e-4,Bn.normalize(),$i.crossVectors(i,Bn)),$i.normalize(),mo.crossVectors(Bn,$i),r[0]=$i.x,r[4]=mo.x,r[8]=Bn.x,r[1]=$i.y,r[5]=mo.y,r[9]=Bn.y,r[2]=$i.z,r[6]=mo.z,r[10]=Bn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[4],c=i[8],l=i[12],u=i[1],h=i[5],d=i[9],f=i[13],g=i[2],v=i[6],m=i[10],p=i[14],_=i[3],x=i[7],y=i[11],M=i[15],w=r[0],A=r[4],C=r[8],S=r[12],E=r[1],L=r[5],O=r[9],H=r[13],B=r[2],Y=r[6],$=r[10],W=r[14],I=r[3],le=r[7],oe=r[11],K=r[15];return s[0]=o*w+a*E+c*B+l*I,s[4]=o*A+a*L+c*Y+l*le,s[8]=o*C+a*O+c*$+l*oe,s[12]=o*S+a*H+c*W+l*K,s[1]=u*w+h*E+d*B+f*I,s[5]=u*A+h*L+d*Y+f*le,s[9]=u*C+h*O+d*$+f*oe,s[13]=u*S+h*H+d*W+f*K,s[2]=g*w+v*E+m*B+p*I,s[6]=g*A+v*L+m*Y+p*le,s[10]=g*C+v*O+m*$+p*oe,s[14]=g*S+v*H+m*W+p*K,s[3]=_*w+x*E+y*B+M*I,s[7]=_*A+x*L+y*Y+M*le,s[11]=_*C+x*O+y*$+M*oe,s[15]=_*S+x*H+y*W+M*K,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],c=e[9],l=e[13],u=e[2],h=e[6],d=e[10],f=e[14],g=e[3],v=e[7],m=e[11],p=e[15];return g*(+s*c*h-r*l*h-s*a*d+i*l*d+r*a*f-i*c*f)+v*(+t*c*f-t*l*d+s*o*d-r*o*f+r*l*u-s*c*u)+m*(+t*l*h-t*a*f-s*o*h+i*o*f+s*a*u-i*l*u)+p*(-r*a*u-t*c*h+t*a*d+r*o*h-i*o*d+i*c*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8],h=e[9],d=e[10],f=e[11],g=e[12],v=e[13],m=e[14],p=e[15],_=h*m*l-v*d*l+v*c*f-a*m*f-h*c*p+a*d*p,x=g*d*l-u*m*l-g*c*f+o*m*f+u*c*p-o*d*p,y=u*v*l-g*h*l+g*a*f-o*v*f-u*a*p+o*h*p,M=g*h*c-u*v*c-g*a*d+o*v*d+u*a*m-o*h*m,w=t*_+i*x+r*y+s*M;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/w;return e[0]=_*A,e[1]=(v*d*s-h*m*s-v*r*f+i*m*f+h*r*p-i*d*p)*A,e[2]=(a*m*s-v*c*s+v*r*l-i*m*l-a*r*p+i*c*p)*A,e[3]=(h*c*s-a*d*s-h*r*l+i*d*l+a*r*f-i*c*f)*A,e[4]=x*A,e[5]=(u*m*s-g*d*s+g*r*f-t*m*f-u*r*p+t*d*p)*A,e[6]=(g*c*s-o*m*s-g*r*l+t*m*l+o*r*p-t*c*p)*A,e[7]=(o*d*s-u*c*s+u*r*l-t*d*l-o*r*f+t*c*f)*A,e[8]=y*A,e[9]=(g*h*s-u*v*s-g*i*f+t*v*f+u*i*p-t*h*p)*A,e[10]=(o*v*s-g*a*s+g*i*l-t*v*l-o*i*p+t*a*p)*A,e[11]=(u*a*s-o*h*s-u*i*l+t*h*l+o*i*f-t*a*f)*A,e[12]=M*A,e[13]=(u*v*r-g*h*r+g*i*d-t*v*d-u*i*m+t*h*m)*A,e[14]=(g*a*r-o*v*r-g*i*c+t*v*c+o*i*m-t*a*m)*A,e[15]=(o*h*r-u*a*r+u*i*c-t*h*c-o*i*d+t*a*d)*A,this}scale(e){const t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),r=Math.sin(t),s=1-i,o=e.x,a=e.y,c=e.z,l=s*o,u=s*a;return this.set(l*o+i,l*a-r*c,l*c+r*a,0,l*a+r*c,u*a+i,u*c-r*o,0,l*c-r*a,u*c+r*o,s*c*c+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){const r=this.elements,s=t._x,o=t._y,a=t._z,c=t._w,l=s+s,u=o+o,h=a+a,d=s*l,f=s*u,g=s*h,v=o*u,m=o*h,p=a*h,_=c*l,x=c*u,y=c*h,M=i.x,w=i.y,A=i.z;return r[0]=(1-(v+p))*M,r[1]=(f+y)*M,r[2]=(g-x)*M,r[3]=0,r[4]=(f-y)*w,r[5]=(1-(d+p))*w,r[6]=(m+_)*w,r[7]=0,r[8]=(g+x)*A,r[9]=(m-_)*A,r[10]=(1-(d+v))*A,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){const r=this.elements;let s=Hr.set(r[0],r[1],r[2]).length();const o=Hr.set(r[4],r[5],r[6]).length(),a=Hr.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],ni.copy(this);const l=1/s,u=1/o,h=1/a;return ni.elements[0]*=l,ni.elements[1]*=l,ni.elements[2]*=l,ni.elements[4]*=u,ni.elements[5]*=u,ni.elements[6]*=u,ni.elements[8]*=h,ni.elements[9]*=h,ni.elements[10]*=h,t.setFromRotationMatrix(ni),i.x=s,i.y=o,i.z=a,this}makePerspective(e,t,i,r,s,o,a=gi,c=!1){const l=this.elements,u=2*s/(t-e),h=2*s/(i-r),d=(t+e)/(t-e),f=(i+r)/(i-r);let g,v;if(c)g=s/(o-s),v=o*s/(o-s);else if(a===gi)g=-(o+s)/(o-s),v=-2*o*s/(o-s);else if(a===qo)g=-o/(o-s),v=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=h,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,r,s,o,a=gi,c=!1){const l=this.elements,u=2/(t-e),h=2/(i-r),d=-(t+e)/(t-e),f=-(i+r)/(i-r);let g,v;if(c)g=1/(o-s),v=o/(o-s);else if(a===gi)g=-2/(o-s),v=-(o+s)/(o-s);else if(a===qo)g=-1/(o-s),v=-s/(o-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=0,l[12]=d,l[1]=0,l[5]=h,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=g,l[14]=v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const Hr=new D,ni=new Vt,Mp=new D(0,0,0),Sp=new D(1,1,1),$i=new D,mo=new D,Bn=new D,gu=new Vt,vu=new hn;class kn{constructor(e=0,t=0,i=0,r=kn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const r=e.elements,s=r[0],o=r[4],a=r[8],c=r[1],l=r[5],u=r[9],h=r[2],d=r[6],f=r[10];switch(t){case"XYZ":this._y=Math.asin(at(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-at(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(at(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,f),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-at(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(at(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-at(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return gu.makeRotationFromQuaternion(e),this.setFromRotationMatrix(gu,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return vu.setFromEuler(this),this.setFromQuaternion(vu,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}kn.DEFAULT_ORDER="XYZ";class xl{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Ep=0;const _u=new D,Gr=new hn,wi=new Vt,go=new D,As=new D,wp=new D,Tp=new hn,xu=new D(1,0,0),yu=new D(0,1,0),bu=new D(0,0,1),Mu={type:"added"},Ap={type:"removed"},Wr={type:"childadded",child:null},Ia={type:"childremoved",child:null};class on extends Cr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Ep++}),this.uuid=Pr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=on.DEFAULT_UP.clone();const e=new D,t=new kn,i=new hn,r=new D(1,1,1);function s(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new Vt},normalMatrix:{value:new ot}}),this.matrix=new Vt,this.matrixWorld=new Vt,this.matrixAutoUpdate=on.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=on.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new xl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Gr.setFromAxisAngle(e,t),this.quaternion.multiply(Gr),this}rotateOnWorldAxis(e,t){return Gr.setFromAxisAngle(e,t),this.quaternion.premultiply(Gr),this}rotateX(e){return this.rotateOnAxis(xu,e)}rotateY(e){return this.rotateOnAxis(yu,e)}rotateZ(e){return this.rotateOnAxis(bu,e)}translateOnAxis(e,t){return _u.copy(e).applyQuaternion(this.quaternion),this.position.add(_u.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(xu,e)}translateY(e){return this.translateOnAxis(yu,e)}translateZ(e){return this.translateOnAxis(bu,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(wi.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?go.copy(e):go.set(e,t,i);const r=this.parent;this.updateWorldMatrix(!0,!1),As.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?wi.lookAt(As,go,this.up):wi.lookAt(go,As,this.up),this.quaternion.setFromRotationMatrix(wi),r&&(wi.extractRotation(r.matrixWorld),Gr.setFromRotationMatrix(wi),this.quaternion.premultiply(Gr.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Mu),Wr.child=e,this.dispatchEvent(Wr),Wr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Ap),Ia.child=e,this.dispatchEvent(Ia),Ia.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),wi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),wi.multiply(e.parent.matrixWorld)),e.applyMatrix4(wi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Mu),Wr.child=e,this.dispatchEvent(Wr),Wr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(As,e,wp),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(As,Tp,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(a=>({...a})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){const h=c[l];s(e.shapes,h)}else s(e.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(s(e.materials,this.material[c]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];r.animations.push(s(e.animations,c))}}if(t){const a=o(e.geometries),c=o(e.materials),l=o(e.textures),u=o(e.images),h=o(e.shapes),d=o(e.skeletons),f=o(e.animations),g=o(e.nodes);a.length>0&&(i.geometries=a),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),u.length>0&&(i.images=u),h.length>0&&(i.shapes=h),d.length>0&&(i.skeletons=d),f.length>0&&(i.animations=f),g.length>0&&(i.nodes=g)}return i.object=r,i;function o(a){const c=[];for(const l in a){const u=a[l];delete u.metadata,c.push(u)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}on.DEFAULT_UP=new D(0,1,0);on.DEFAULT_MATRIX_AUTO_UPDATE=!0;on.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const ii=new D,Ti=new D,Ua=new D,Ai=new D,$r=new D,qr=new D,Su=new D,Na=new D,Oa=new D,Fa=new D,ka=new Kt,za=new Kt,Ba=new Kt;class jn{constructor(e=new D,t=new D,i=new D){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),ii.subVectors(e,t),r.cross(ii);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){ii.subVectors(r,t),Ti.subVectors(i,t),Ua.subVectors(e,t);const o=ii.dot(ii),a=ii.dot(Ti),c=ii.dot(Ua),l=Ti.dot(Ti),u=Ti.dot(Ua),h=o*l-a*a;if(h===0)return s.set(0,0,0),null;const d=1/h,f=(l*c-a*u)*d,g=(o*u-a*c)*d;return s.set(1-f-g,g,f)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,Ai)===null?!1:Ai.x>=0&&Ai.y>=0&&Ai.x+Ai.y<=1}static getInterpolation(e,t,i,r,s,o,a,c){return this.getBarycoord(e,t,i,r,Ai)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,Ai.x),c.addScaledVector(o,Ai.y),c.addScaledVector(a,Ai.z),c)}static getInterpolatedAttribute(e,t,i,r,s,o){return ka.setScalar(0),za.setScalar(0),Ba.setScalar(0),ka.fromBufferAttribute(e,t),za.fromBufferAttribute(e,i),Ba.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(ka,s.x),o.addScaledVector(za,s.y),o.addScaledVector(Ba,s.z),o}static isFrontFacing(e,t,i,r){return ii.subVectors(i,t),Ti.subVectors(e,t),ii.cross(Ti).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ii.subVectors(this.c,this.b),Ti.subVectors(this.a,this.b),ii.cross(Ti).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return jn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return jn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,r,s){return jn.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return jn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return jn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,r=this.b,s=this.c;let o,a;$r.subVectors(r,i),qr.subVectors(s,i),Na.subVectors(e,i);const c=$r.dot(Na),l=qr.dot(Na);if(c<=0&&l<=0)return t.copy(i);Oa.subVectors(e,r);const u=$r.dot(Oa),h=qr.dot(Oa);if(u>=0&&h<=u)return t.copy(r);const d=c*h-u*l;if(d<=0&&c>=0&&u<=0)return o=c/(c-u),t.copy(i).addScaledVector($r,o);Fa.subVectors(e,s);const f=$r.dot(Fa),g=qr.dot(Fa);if(g>=0&&f<=g)return t.copy(s);const v=f*l-c*g;if(v<=0&&l>=0&&g<=0)return a=l/(l-g),t.copy(i).addScaledVector(qr,a);const m=u*g-f*h;if(m<=0&&h-u>=0&&f-g>=0)return Su.subVectors(s,r),a=(h-u)/(h-u+(f-g)),t.copy(r).addScaledVector(Su,a);const p=1/(m+v+d);return o=v*p,a=d*p,t.copy(i).addScaledVector($r,o).addScaledVector(qr,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const rd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},qi={h:0,s:0,l:0},vo={h:0,s:0,l:0};function Va(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class _t{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Mn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,wt.colorSpaceToWorking(this,t),this}setRGB(e,t,i,r=wt.workingColorSpace){return this.r=e,this.g=t,this.b=i,wt.colorSpaceToWorking(this,r),this}setHSL(e,t,i,r=wt.workingColorSpace){if(e=vl(e,1),t=at(t,0,1),i=at(i,0,1),t===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+t):i+t-i*t,o=2*i-s;this.r=Va(o,s,e+1/3),this.g=Va(o,s,e),this.b=Va(o,s,e-1/3)}return wt.colorSpaceToWorking(this,r),this}setStyle(e,t=Mn){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Mn){const i=rd[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Oi(e.r),this.g=Oi(e.g),this.b=Oi(e.b),this}copyLinearToSRGB(e){return this.r=ss(e.r),this.g=ss(e.g),this.b=ss(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Mn){return wt.workingToColorSpace(yn.copy(this),e),Math.round(at(yn.r*255,0,255))*65536+Math.round(at(yn.g*255,0,255))*256+Math.round(at(yn.b*255,0,255))}getHexString(e=Mn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=wt.workingColorSpace){wt.workingToColorSpace(yn.copy(this),t);const i=yn.r,r=yn.g,s=yn.b,o=Math.max(i,r,s),a=Math.min(i,r,s);let c,l;const u=(a+o)/2;if(a===o)c=0,l=0;else{const h=o-a;switch(l=u<=.5?h/(o+a):h/(2-o-a),o){case i:c=(r-s)/h+(r<s?6:0);break;case r:c=(s-i)/h+2;break;case s:c=(i-r)/h+4;break}c/=6}return e.h=c,e.s=l,e.l=u,e}getRGB(e,t=wt.workingColorSpace){return wt.workingToColorSpace(yn.copy(this),t),e.r=yn.r,e.g=yn.g,e.b=yn.b,e}getStyle(e=Mn){wt.workingToColorSpace(yn.copy(this),e);const t=yn.r,i=yn.g,r=yn.b;return e!==Mn?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(qi),this.setHSL(qi.h+e,qi.s+t,qi.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(qi),e.getHSL(vo);const i=Os(qi.h,vo.h,t),r=Os(qi.s,vo.s,t),s=Os(qi.l,vo.l,t);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*r,this.g=s[1]*t+s[4]*i+s[7]*r,this.b=s[2]*t+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const yn=new _t;_t.NAMES=rd;let Rp=0;class ms extends Cr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Rp++}),this.uuid=Pr(),this.name="",this.type="Material",this.blending=is,this.side=ir,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=lc,this.blendDst=uc,this.blendEquation=_r,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new _t(0,0,0),this.blendAlpha=0,this.depthFunc=ls,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=cu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Fr,this.stencilZFail=Fr,this.stencilZPass=Fr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==is&&(i.blending=this.blending),this.side!==ir&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==lc&&(i.blendSrc=this.blendSrc),this.blendDst!==uc&&(i.blendDst=this.blendDst),this.blendEquation!==_r&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==ls&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==cu&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Fr&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Fr&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Fr&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const o=[];for(const a in s){const c=s[a];delete c.metadata,o.push(c)}return o}if(t){const s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Xn extends ms{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new _t(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new kn,this.combine=Gh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Qt=new D,_o=new xe;let Cp=0;class Kn{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Cp++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=lu,this.updateRanges=[],this.gpuType=Ii,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)_o.fromBufferAttribute(this,t),_o.applyMatrix3(e),this.setXY(t,_o.x,_o.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Qt.fromBufferAttribute(this,t),Qt.applyMatrix3(e),this.setXYZ(t,Qt.x,Qt.y,Qt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Qt.fromBufferAttribute(this,t),Qt.applyMatrix4(e),this.setXYZ(t,Qt.x,Qt.y,Qt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Qt.fromBufferAttribute(this,t),Qt.applyNormalMatrix(e),this.setXYZ(t,Qt.x,Qt.y,Qt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Qt.fromBufferAttribute(this,t),Qt.transformDirection(e),this.setXYZ(t,Qt.x,Qt.y,Qt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Jr(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Rn(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Jr(t,this.array)),t}setX(e,t){return this.normalized&&(t=Rn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Jr(t,this.array)),t}setY(e,t){return this.normalized&&(t=Rn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Jr(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Rn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Jr(t,this.array)),t}setW(e,t){return this.normalized&&(t=Rn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Rn(t,this.array),i=Rn(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=Rn(t,this.array),i=Rn(i,this.array),r=Rn(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=Rn(t,this.array),i=Rn(i,this.array),r=Rn(r,this.array),s=Rn(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==lu&&(e.usage=this.usage),e}}class sd extends Kn{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class od extends Kn{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class Dt extends Kn{constructor(e,t,i){super(new Float32Array(e),t,i)}}let Pp=0;const $n=new Vt,Ha=new on,Xr=new D,Vn=new er,Rs=new er,un=new D;class an extends Cr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Pp++}),this.uuid=Pr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(nd(e)?od:sd)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new ot().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return $n.makeRotationFromQuaternion(e),this.applyMatrix4($n),this}rotateX(e){return $n.makeRotationX(e),this.applyMatrix4($n),this}rotateY(e){return $n.makeRotationY(e),this.applyMatrix4($n),this}rotateZ(e){return $n.makeRotationZ(e),this.applyMatrix4($n),this}translate(e,t,i){return $n.makeTranslation(e,t,i),this.applyMatrix4($n),this}scale(e,t,i){return $n.makeScale(e,t,i),this.applyMatrix4($n),this}lookAt(e){return Ha.lookAt(e),Ha.updateMatrix(),this.applyMatrix4(Ha.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Xr).negate(),this.translate(Xr.x,Xr.y,Xr.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const o=e[r];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Dt(i,3))}else{const i=Math.min(e.length,t.count);for(let r=0;r<i;r++){const s=e[r];t.setXYZ(r,s.x,s.y,s.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new er);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){const s=t[i];Vn.setFromBufferAttribute(s),this.morphTargetsRelative?(un.addVectors(this.boundingBox.min,Vn.min),this.boundingBox.expandByPoint(un),un.addVectors(this.boundingBox.max,Vn.max),this.boundingBox.expandByPoint(un)):(this.boundingBox.expandByPoint(Vn.min),this.boundingBox.expandByPoint(Vn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new sa);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(e){const i=this.boundingSphere.center;if(Vn.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){const a=t[s];Rs.setFromBufferAttribute(a),this.morphTargetsRelative?(un.addVectors(Vn.min,Rs.min),Vn.expandByPoint(un),un.addVectors(Vn.max,Rs.max),Vn.expandByPoint(un)):(Vn.expandByPoint(Rs.min),Vn.expandByPoint(Rs.max))}Vn.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)un.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(un));if(t)for(let s=0,o=t.length;s<o;s++){const a=t[s],c=this.morphTargetsRelative;for(let l=0,u=a.count;l<u;l++)un.fromBufferAttribute(a,l),c&&(Xr.fromBufferAttribute(e,l),un.add(Xr)),r=Math.max(r,i.distanceToSquared(un))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Kn(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),a=[],c=[];for(let C=0;C<i.count;C++)a[C]=new D,c[C]=new D;const l=new D,u=new D,h=new D,d=new xe,f=new xe,g=new xe,v=new D,m=new D;function p(C,S,E){l.fromBufferAttribute(i,C),u.fromBufferAttribute(i,S),h.fromBufferAttribute(i,E),d.fromBufferAttribute(s,C),f.fromBufferAttribute(s,S),g.fromBufferAttribute(s,E),u.sub(l),h.sub(l),f.sub(d),g.sub(d);const L=1/(f.x*g.y-g.x*f.y);isFinite(L)&&(v.copy(u).multiplyScalar(g.y).addScaledVector(h,-f.y).multiplyScalar(L),m.copy(h).multiplyScalar(f.x).addScaledVector(u,-g.x).multiplyScalar(L),a[C].add(v),a[S].add(v),a[E].add(v),c[C].add(m),c[S].add(m),c[E].add(m))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let C=0,S=_.length;C<S;++C){const E=_[C],L=E.start,O=E.count;for(let H=L,B=L+O;H<B;H+=3)p(e.getX(H+0),e.getX(H+1),e.getX(H+2))}const x=new D,y=new D,M=new D,w=new D;function A(C){M.fromBufferAttribute(r,C),w.copy(M);const S=a[C];x.copy(S),x.sub(M.multiplyScalar(M.dot(S))).normalize(),y.crossVectors(w,S);const L=y.dot(c[C])<0?-1:1;o.setXYZW(C,x.x,x.y,x.z,L)}for(let C=0,S=_.length;C<S;++C){const E=_[C],L=E.start,O=E.count;for(let H=L,B=L+O;H<B;H+=3)A(e.getX(H+0)),A(e.getX(H+1)),A(e.getX(H+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Kn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);const r=new D,s=new D,o=new D,a=new D,c=new D,l=new D,u=new D,h=new D;if(e)for(let d=0,f=e.count;d<f;d+=3){const g=e.getX(d+0),v=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,g),s.fromBufferAttribute(t,v),o.fromBufferAttribute(t,m),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),a.fromBufferAttribute(i,g),c.fromBufferAttribute(i,v),l.fromBufferAttribute(i,m),a.add(u),c.add(u),l.add(u),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(v,c.x,c.y,c.z),i.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,f=t.count;d<f;d+=3)r.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),i.setXYZ(d+0,u.x,u.y,u.z),i.setXYZ(d+1,u.x,u.y,u.z),i.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)un.fromBufferAttribute(e,t),un.normalize(),e.setXYZ(t,un.x,un.y,un.z)}toNonIndexed(){function e(a,c){const l=a.array,u=a.itemSize,h=a.normalized,d=new l.constructor(c.length*u);let f=0,g=0;for(let v=0,m=c.length;v<m;v++){a.isInterleavedBufferAttribute?f=c[v]*a.data.stride+a.offset:f=c[v]*u;for(let p=0;p<u;p++)d[g++]=l[f++]}return new Kn(d,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new an,i=this.index.array,r=this.attributes;for(const a in r){const c=r[a],l=e(c,i);t.setAttribute(a,l)}const s=this.morphAttributes;for(const a in s){const c=[],l=s[a];for(let u=0,h=l.length;u<h;u++){const d=l[u],f=e(d,i);c.push(f)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const c in i){const l=i[c];e.data.attributes[c]=l.toJSON(e.data)}const r={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],u=[];for(let h=0,d=l.length;h<d;h++){const f=l[h];u.push(f.toJSON(e.data))}u.length>0&&(r[c]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const r=e.attributes;for(const l in r){const u=r[l];this.setAttribute(l,u.clone(t))}const s=e.morphAttributes;for(const l in s){const u=[],h=s[l];for(let d=0,f=h.length;d<f;d++)u.push(h[d].clone(t));this.morphAttributes[l]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let l=0,u=o.length;l<u;l++){const h=o[l];this.addGroup(h.start,h.count,h.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Eu=new Vt,fr=new oa,xo=new sa,wu=new D,yo=new D,bo=new D,Mo=new D,Ga=new D,So=new D,Tu=new D,Eo=new D;class En extends on{constructor(e=new an,t=new Xn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(r,e);const a=this.morphTargetInfluences;if(s&&a){So.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const u=a[c],h=s[c];u!==0&&(Ga.fromBufferAttribute(h,e),o?So.addScaledVector(Ga,u):So.addScaledVector(Ga.sub(t),u))}t.add(So)}return t}raycast(e,t){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),xo.copy(i.boundingSphere),xo.applyMatrix4(s),fr.copy(e.ray).recast(e.near),!(xo.containsPoint(fr.origin)===!1&&(fr.intersectSphere(xo,wu)===null||fr.origin.distanceToSquared(wu)>(e.far-e.near)**2))&&(Eu.copy(s).invert(),fr.copy(e.ray).applyMatrix4(Eu),!(i.boundingBox!==null&&fr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,fr)))}_computeIntersections(e,t,i){let r;const s=this.geometry,o=this.material,a=s.index,c=s.attributes.position,l=s.attributes.uv,u=s.attributes.uv1,h=s.attributes.normal,d=s.groups,f=s.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=o[m.materialIndex],_=Math.max(m.start,f.start),x=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let y=_,M=x;y<M;y+=3){const w=a.getX(y),A=a.getX(y+1),C=a.getX(y+2);r=wo(this,p,e,i,l,u,h,w,A,C),r&&(r.faceIndex=Math.floor(y/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const g=Math.max(0,f.start),v=Math.min(a.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const _=a.getX(m),x=a.getX(m+1),y=a.getX(m+2);r=wo(this,o,e,i,l,u,h,_,x,y),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=o[m.materialIndex],_=Math.max(m.start,f.start),x=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let y=_,M=x;y<M;y+=3){const w=y,A=y+1,C=y+2;r=wo(this,p,e,i,l,u,h,w,A,C),r&&(r.faceIndex=Math.floor(y/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const g=Math.max(0,f.start),v=Math.min(c.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const _=m,x=m+1,y=m+2;r=wo(this,o,e,i,l,u,h,_,x,y),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}}}function Lp(n,e,t,i,r,s,o,a){let c;if(e.side===Fn?c=i.intersectTriangle(o,s,r,!0,a):c=i.intersectTriangle(r,s,o,e.side===ir,a),c===null)return null;Eo.copy(a),Eo.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(Eo);return l<t.near||l>t.far?null:{distance:l,point:Eo.clone(),object:n}}function wo(n,e,t,i,r,s,o,a,c,l){n.getVertexPosition(a,yo),n.getVertexPosition(c,bo),n.getVertexPosition(l,Mo);const u=Lp(n,e,t,i,yo,bo,Mo,Tu);if(u){const h=new D;jn.getBarycoord(Tu,yo,bo,Mo,h),r&&(u.uv=jn.getInterpolatedAttribute(r,a,c,l,h,new xe)),s&&(u.uv1=jn.getInterpolatedAttribute(s,a,c,l,h,new xe)),o&&(u.normal=jn.getInterpolatedAttribute(o,a,c,l,h,new D),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const d={a,b:c,c:l,normal:new D,materialIndex:0};jn.getNormal(yo,bo,Mo,d.normal),u.face=d,u.barycoord=h}return u}class Xt extends an{constructor(e=1,t=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const c=[],l=[],u=[],h=[];let d=0,f=0;g("z","y","x",-1,-1,i,t,e,o,s,0),g("z","y","x",1,-1,i,t,-e,o,s,1),g("x","z","y",1,1,e,i,t,r,o,2),g("x","z","y",1,-1,e,i,-t,r,o,3),g("x","y","z",1,-1,e,t,i,r,s,4),g("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(c),this.setAttribute("position",new Dt(l,3)),this.setAttribute("normal",new Dt(u,3)),this.setAttribute("uv",new Dt(h,2));function g(v,m,p,_,x,y,M,w,A,C,S){const E=y/A,L=M/C,O=y/2,H=M/2,B=w/2,Y=A+1,$=C+1;let W=0,I=0;const le=new D;for(let oe=0;oe<$;oe++){const K=oe*L-H;for(let Ie=0;Ie<Y;Ie++){const et=Ie*E-O;le[v]=et*_,le[m]=K*x,le[p]=B,l.push(le.x,le.y,le.z),le[v]=0,le[m]=0,le[p]=w>0?1:-1,u.push(le.x,le.y,le.z),h.push(Ie/A),h.push(1-oe/C),W+=1}}for(let oe=0;oe<C;oe++)for(let K=0;K<A;K++){const Ie=d+K+Y*oe,et=d+K+Y*(oe+1),Ue=d+(K+1)+Y*(oe+1),ct=d+(K+1)+Y*oe;c.push(Ie,et,ct),c.push(et,Ue,ct),I+=6}a.addGroup(f,I,S),f+=I,d+=W}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Xt(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function fs(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const r=n[t][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone():Array.isArray(r)?e[t][i]=r.slice():e[t][i]=r}}return e}function Cn(n){const e={};for(let t=0;t<n.length;t++){const i=fs(n[t]);for(const r in i)e[r]=i[r]}return e}function Dp(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function ad(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:wt.workingColorSpace}const Ip={clone:fs,merge:Cn};var Up=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Np=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class rr extends ms{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Up,this.fragmentShader=Np,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=fs(e.uniforms),this.uniformsGroups=Dp(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?t.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[r]={type:"m4",value:o.toArray()}:t.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class cd extends on{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Vt,this.projectionMatrix=new Vt,this.projectionMatrixInverse=new Vt,this.coordinateSystem=gi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Xi=new D,Au=new xe,Ru=new xe;class Yn extends cd{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=qs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(rs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return qs*2*Math.atan(Math.tan(rs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Xi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Xi.x,Xi.y).multiplyScalar(-e/Xi.z),Xi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Xi.x,Xi.y).multiplyScalar(-e/Xi.z)}getViewSize(e,t){return this.getViewBounds(e,Au,Ru),t.subVectors(Ru,Au)}setViewOffset(e,t,i,r,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(rs*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;s+=o.offsetX*r/c,t-=o.offsetY*i/l,r*=o.width/c,i*=o.height/l}const a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Yr=-90,jr=1;class Op extends on{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Yn(Yr,jr,e,t);r.layers=this.layers,this.add(r);const s=new Yn(Yr,jr,e,t);s.layers=this.layers,this.add(s);const o=new Yn(Yr,jr,e,t);o.layers=this.layers,this.add(o);const a=new Yn(Yr,jr,e,t);a.layers=this.layers,this.add(a);const c=new Yn(Yr,jr,e,t);c.layers=this.layers,this.add(c);const l=new Yn(Yr,jr,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,r,s,o,a,c]=t;for(const l of t)this.remove(l);if(e===gi)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===qo)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,c,l,u]=this.children,h=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(t,s),e.setRenderTarget(i,1,r),e.render(t,o),e.setRenderTarget(i,2,r),e.render(t,a),e.setRenderTarget(i,3,r),e.render(t,c),e.setRenderTarget(i,4,r),e.render(t,l),i.texture.generateMipmaps=v,e.setRenderTarget(i,5,r),e.render(t,u),e.setRenderTarget(h,d,f),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class ld extends Dn{constructor(e=[],t=us,i,r,s,o,a,c,l,u){super(e,t,i,r,s,o,a,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Fp extends Tr{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new ld(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new Xt(5,5,5),s=new rr({name:"CubemapFromEquirect",uniforms:fs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Fn,blending:Ji});s.uniforms.tEquirect.value=t;const o=new En(r,s),a=t.minFilter;return t.minFilter===Ki&&(t.minFilter=si),new Op(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,i=!0,r=!0){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,r);e.setRenderTarget(s)}}class Zt extends on{constructor(){super(),this.isGroup=!0,this.type="Group"}}const kp={type:"move"};class Wa{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Zt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Zt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Zt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){o=!0;for(const v of e.hand.values()){const m=t.getJointPose(v,i),p=this._getHandJoint(l,v);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const u=l.joints["index-finger-tip"],h=l.joints["thumb-tip"],d=u.position.distanceTo(h.position),f=.02,g=.005;l.inputState.pinching&&d>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&d<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(kp)))}return a!==null&&(a.visible=r!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Zt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class yl{constructor(e,t=1,i=1e3){this.isFog=!0,this.name="",this.color=new _t(e),this.near=t,this.far=i}clone(){return new yl(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class zp extends on{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new kn,this.environmentIntensity=1,this.environmentRotation=new kn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const $a=new D,Bp=new D,Vp=new ot;class Pi{constructor(e=new D(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const r=$a.subVectors(i,t).cross(Bp.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta($a),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||Vp.getNormalMatrix(e),r=this.coplanarPoint($a).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const pr=new sa,Hp=new xe(.5,.5),To=new D;class bl{constructor(e=new Pi,t=new Pi,i=new Pi,r=new Pi,s=new Pi,o=new Pi){this.planes=[e,t,i,r,s,o]}set(e,t,i,r,s,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=gi,i=!1){const r=this.planes,s=e.elements,o=s[0],a=s[1],c=s[2],l=s[3],u=s[4],h=s[5],d=s[6],f=s[7],g=s[8],v=s[9],m=s[10],p=s[11],_=s[12],x=s[13],y=s[14],M=s[15];if(r[0].setComponents(l-o,f-u,p-g,M-_).normalize(),r[1].setComponents(l+o,f+u,p+g,M+_).normalize(),r[2].setComponents(l+a,f+h,p+v,M+x).normalize(),r[3].setComponents(l-a,f-h,p-v,M-x).normalize(),i)r[4].setComponents(c,d,m,y).normalize(),r[5].setComponents(l-c,f-d,p-m,M-y).normalize();else if(r[4].setComponents(l-c,f-d,p-m,M-y).normalize(),t===gi)r[5].setComponents(l+c,f+d,p+m,M+y).normalize();else if(t===qo)r[5].setComponents(c,d,m,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),pr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),pr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(pr)}intersectsSprite(e){pr.center.set(0,0,0);const t=Hp.distanceTo(e.center);return pr.radius=.7071067811865476+t,pr.applyMatrix4(e.matrixWorld),this.intersectsSphere(pr)}intersectsSphere(e){const t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const r=t[i];if(To.x=r.normal.x>0?e.max.x:e.min.x,To.y=r.normal.y>0?e.max.y:e.min.y,To.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(To)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Yo extends ms{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new _t(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const jo=new D,Zo=new D,Cu=new Vt,Cs=new oa,Ao=new sa,qa=new D,Pu=new D;class Zc extends on{constructor(e=new an,t=new Yo){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let r=1,s=t.count;r<s;r++)jo.fromBufferAttribute(t,r-1),Zo.fromBufferAttribute(t,r),i[r]=i[r-1],i[r]+=jo.distanceTo(Zo);e.setAttribute("lineDistance",new Dt(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Ao.copy(i.boundingSphere),Ao.applyMatrix4(r),Ao.radius+=s,e.ray.intersectsSphere(Ao)===!1)return;Cu.copy(r).invert(),Cs.copy(e.ray).applyMatrix4(Cu);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,u=i.index,d=i.attributes.position;if(u!==null){const f=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let v=f,m=g-1;v<m;v+=l){const p=u.getX(v),_=u.getX(v+1),x=Ro(this,e,Cs,c,p,_,v);x&&t.push(x)}if(this.isLineLoop){const v=u.getX(g-1),m=u.getX(f),p=Ro(this,e,Cs,c,v,m,g-1);p&&t.push(p)}}else{const f=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let v=f,m=g-1;v<m;v+=l){const p=Ro(this,e,Cs,c,v,v+1,v);p&&t.push(p)}if(this.isLineLoop){const v=Ro(this,e,Cs,c,g-1,f,g-1);v&&t.push(v)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function Ro(n,e,t,i,r,s,o){const a=n.geometry.attributes.position;if(jo.fromBufferAttribute(a,r),Zo.fromBufferAttribute(a,s),t.distanceSqToSegment(jo,Zo,qa,Pu)>i)return;qa.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(qa);if(!(l<e.near||l>e.far))return{distance:l,point:Pu.clone().applyMatrix4(n.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:n}}const Lu=new D,Du=new D;class Gp extends Zc{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let r=0,s=t.count;r<s;r+=2)Lu.fromBufferAttribute(t,r),Du.fromBufferAttribute(t,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+Lu.distanceTo(Du);e.setAttribute("lineDistance",new Dt(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Kc extends Dn{constructor(e,t,i,r,s,o,a,c,l){super(e,t,i,r,s,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class ud extends Dn{constructor(e,t,i=wr,r,s,o,a=ci,c=ci,l,u=Ws,h=1){if(u!==Ws&&u!==$s)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:t,depth:h};super(d,r,s,o,a,c,u,i,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new _l(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class hd extends Dn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Ml extends an{constructor(e=1,t=1,i=4,r=8,s=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:i,radialSegments:r,heightSegments:s},t=Math.max(0,t),i=Math.max(1,Math.floor(i)),r=Math.max(3,Math.floor(r)),s=Math.max(1,Math.floor(s));const o=[],a=[],c=[],l=[],u=t/2,h=Math.PI/2*e,d=t,f=2*h+d,g=i*2+s,v=r+1,m=new D,p=new D;for(let _=0;_<=g;_++){let x=0,y=0,M=0,w=0;if(_<=i){const S=_/i,E=S*Math.PI/2;y=-u-e*Math.cos(E),M=e*Math.sin(E),w=-e*Math.cos(E),x=S*h}else if(_<=i+s){const S=(_-i)/s;y=-u+S*t,M=e,w=0,x=h+S*d}else{const S=(_-i-s)/i,E=S*Math.PI/2;y=u+e*Math.sin(E),M=e*Math.cos(E),w=e*Math.sin(E),x=h+d+S*h}const A=Math.max(0,Math.min(1,x/f));let C=0;_===0?C=.5/r:_===g&&(C=-.5/r);for(let S=0;S<=r;S++){const E=S/r,L=E*Math.PI*2,O=Math.sin(L),H=Math.cos(L);p.x=-M*H,p.y=y,p.z=M*O,a.push(p.x,p.y,p.z),m.set(-M*H,w,M*O),m.normalize(),c.push(m.x,m.y,m.z),l.push(E+C,A)}if(_>0){const S=(_-1)*v;for(let E=0;E<r;E++){const L=S+E,O=S+E+1,H=_*v+E,B=_*v+E+1;o.push(L,O,H),o.push(O,B,H)}}}this.setIndex(o),this.setAttribute("position",new Dt(a,3)),this.setAttribute("normal",new Dt(c,3)),this.setAttribute("uv",new Dt(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ml(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}}class st extends an{constructor(e=1,t=1,i=1,r=32,s=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:r,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:c};const l=this;r=Math.floor(r),s=Math.floor(s);const u=[],h=[],d=[],f=[];let g=0;const v=[],m=i/2;let p=0;_(),o===!1&&(e>0&&x(!0),t>0&&x(!1)),this.setIndex(u),this.setAttribute("position",new Dt(h,3)),this.setAttribute("normal",new Dt(d,3)),this.setAttribute("uv",new Dt(f,2));function _(){const y=new D,M=new D;let w=0;const A=(t-e)/i;for(let C=0;C<=s;C++){const S=[],E=C/s,L=E*(t-e)+e;for(let O=0;O<=r;O++){const H=O/r,B=H*c+a,Y=Math.sin(B),$=Math.cos(B);M.x=L*Y,M.y=-E*i+m,M.z=L*$,h.push(M.x,M.y,M.z),y.set(Y,A,$).normalize(),d.push(y.x,y.y,y.z),f.push(H,1-E),S.push(g++)}v.push(S)}for(let C=0;C<r;C++)for(let S=0;S<s;S++){const E=v[S][C],L=v[S+1][C],O=v[S+1][C+1],H=v[S][C+1];(e>0||S!==0)&&(u.push(E,L,H),w+=3),(t>0||S!==s-1)&&(u.push(L,O,H),w+=3)}l.addGroup(p,w,0),p+=w}function x(y){const M=g,w=new xe,A=new D;let C=0;const S=y===!0?e:t,E=y===!0?1:-1;for(let O=1;O<=r;O++)h.push(0,m*E,0),d.push(0,E,0),f.push(.5,.5),g++;const L=g;for(let O=0;O<=r;O++){const B=O/r*c+a,Y=Math.cos(B),$=Math.sin(B);A.x=S*$,A.y=m*E,A.z=S*Y,h.push(A.x,A.y,A.z),d.push(0,E,0),w.x=Y*.5+.5,w.y=$*.5*E+.5,f.push(w.x,w.y),g++}for(let O=0;O<r;O++){const H=M+O,B=L+O;y===!0?u.push(B,B+1,H):u.push(B+1,B,H),C+=3}l.addGroup(p,C,y===!0?1:2),p+=C}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new st(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Sl extends st{constructor(e=1,t=1,i=32,r=1,s=!1,o=0,a=Math.PI*2){super(0,e,t,i,r,s,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:r,openEnded:s,thetaStart:o,thetaLength:a}}static fromJSON(e){return new Sl(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}const Co=new D,Po=new D,Xa=new D,Lo=new jn;class Wp extends an{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){const r=Math.pow(10,4),s=Math.cos(rs*t),o=e.getIndex(),a=e.getAttribute("position"),c=o?o.count:a.count,l=[0,0,0],u=["a","b","c"],h=new Array(3),d={},f=[];for(let g=0;g<c;g+=3){o?(l[0]=o.getX(g),l[1]=o.getX(g+1),l[2]=o.getX(g+2)):(l[0]=g,l[1]=g+1,l[2]=g+2);const{a:v,b:m,c:p}=Lo;if(v.fromBufferAttribute(a,l[0]),m.fromBufferAttribute(a,l[1]),p.fromBufferAttribute(a,l[2]),Lo.getNormal(Xa),h[0]=`${Math.round(v.x*r)},${Math.round(v.y*r)},${Math.round(v.z*r)}`,h[1]=`${Math.round(m.x*r)},${Math.round(m.y*r)},${Math.round(m.z*r)}`,h[2]=`${Math.round(p.x*r)},${Math.round(p.y*r)},${Math.round(p.z*r)}`,!(h[0]===h[1]||h[1]===h[2]||h[2]===h[0]))for(let _=0;_<3;_++){const x=(_+1)%3,y=h[_],M=h[x],w=Lo[u[_]],A=Lo[u[x]],C=`${y}_${M}`,S=`${M}_${y}`;S in d&&d[S]?(Xa.dot(d[S].normal)<=s&&(f.push(w.x,w.y,w.z),f.push(A.x,A.y,A.z)),d[S]=null):C in d||(d[C]={index0:l[_],index1:l[x],normal:Xa.clone()})}}for(const g in d)if(d[g]){const{index0:v,index1:m}=d[g];Co.fromBufferAttribute(a,v),Po.fromBufferAttribute(a,m),f.push(Co.x,Co.y,Co.z),f.push(Po.x,Po.y,Po.z)}this.setAttribute("position",new Dt(f,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class xi{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){const i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let i,r=this.getPoint(0),s=0;t.push(0);for(let o=1;o<=e;o++)i=this.getPoint(o/e),s+=i.distanceTo(r),t.push(s),r=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const i=this.getLengths();let r=0;const s=i.length;let o;t?o=t:o=e*i[s-1];let a=0,c=s-1,l;for(;a<=c;)if(r=Math.floor(a+(c-a)/2),l=i[r]-o,l<0)a=r+1;else if(l>0)c=r-1;else{c=r;break}if(r=c,i[r]===o)return r/(s-1);const u=i[r],d=i[r+1]-u,f=(o-u)/d;return(r+f)/(s-1)}getTangent(e,t){let r=e-1e-4,s=e+1e-4;r<0&&(r=0),s>1&&(s=1);const o=this.getPoint(r),a=this.getPoint(s),c=t||(o.isVector2?new xe:new D);return c.copy(a).sub(o).normalize(),c}getTangentAt(e,t){const i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){const i=new D,r=[],s=[],o=[],a=new D,c=new Vt;for(let f=0;f<=e;f++){const g=f/e;r[f]=this.getTangentAt(g,new D)}s[0]=new D,o[0]=new D;let l=Number.MAX_VALUE;const u=Math.abs(r[0].x),h=Math.abs(r[0].y),d=Math.abs(r[0].z);u<=l&&(l=u,i.set(1,0,0)),h<=l&&(l=h,i.set(0,1,0)),d<=l&&i.set(0,0,1),a.crossVectors(r[0],i).normalize(),s[0].crossVectors(r[0],a),o[0].crossVectors(r[0],s[0]);for(let f=1;f<=e;f++){if(s[f]=s[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(r[f-1],r[f]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(at(r[f-1].dot(r[f]),-1,1));s[f].applyMatrix4(c.makeRotationAxis(a,g))}o[f].crossVectors(r[f],s[f])}if(t===!0){let f=Math.acos(at(s[0].dot(s[e]),-1,1));f/=e,r[0].dot(a.crossVectors(s[0],s[e]))>0&&(f=-f);for(let g=1;g<=e;g++)s[g].applyMatrix4(c.makeRotationAxis(r[g],f*g)),o[g].crossVectors(r[g],s[g])}return{tangents:r,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class El extends xi{constructor(e=0,t=0,i=1,r=1,s=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=r,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(e,t=new xe){const i=t,r=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=r;for(;s>r;)s-=r;s<Number.EPSILON&&(o?s=0:s=r),this.aClockwise===!0&&!o&&(s===r?s=-r:s=s-r);const a=this.aStartAngle+e*s;let c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const u=Math.cos(this.aRotation),h=Math.sin(this.aRotation),d=c-this.aX,f=l-this.aY;c=d*u-f*h+this.aX,l=d*h+f*u+this.aY}return i.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class $p extends El{constructor(e,t,i,r,s,o){super(e,t,i,i,r,s,o),this.isArcCurve=!0,this.type="ArcCurve"}}function wl(){let n=0,e=0,t=0,i=0;function r(s,o,a,c){n=s,e=a,t=-3*s+3*o-2*a-c,i=2*s-2*o+a+c}return{initCatmullRom:function(s,o,a,c,l){r(o,a,l*(a-s),l*(c-o))},initNonuniformCatmullRom:function(s,o,a,c,l,u,h){let d=(o-s)/l-(a-s)/(l+u)+(a-o)/u,f=(a-o)/u-(c-o)/(u+h)+(c-a)/h;d*=u,f*=u,r(o,a,d,f)},calc:function(s){const o=s*s,a=o*s;return n+e*s+t*o+i*a}}}const Do=new D,Ya=new wl,ja=new wl,Za=new wl;class Fs extends xi{constructor(e=[],t=!1,i="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=r}getPoint(e,t=new D){const i=t,r=this.points,s=r.length,o=(s-(this.closed?0:1))*e;let a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/s)+1)*s:c===0&&a===s-1&&(a=s-2,c=1);let l,u;this.closed||a>0?l=r[(a-1)%s]:(Do.subVectors(r[0],r[1]).add(r[0]),l=Do);const h=r[a%s],d=r[(a+1)%s];if(this.closed||a+2<s?u=r[(a+2)%s]:(Do.subVectors(r[s-1],r[s-2]).add(r[s-1]),u=Do),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(h),f),v=Math.pow(h.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(u),f);v<1e-4&&(v=1),g<1e-4&&(g=v),m<1e-4&&(m=v),Ya.initNonuniformCatmullRom(l.x,h.x,d.x,u.x,g,v,m),ja.initNonuniformCatmullRom(l.y,h.y,d.y,u.y,g,v,m),Za.initNonuniformCatmullRom(l.z,h.z,d.z,u.z,g,v,m)}else this.curveType==="catmullrom"&&(Ya.initCatmullRom(l.x,h.x,d.x,u.x,this.tension),ja.initCatmullRom(l.y,h.y,d.y,u.y,this.tension),Za.initCatmullRom(l.z,h.z,d.z,u.z,this.tension));return i.set(Ya.calc(c),ja.calc(c),Za.calc(c)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(r.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const r=this.points[t];e.points.push(r.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(new D().fromArray(r))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function Iu(n,e,t,i,r){const s=(i-e)*.5,o=(r-t)*.5,a=n*n,c=n*a;return(2*t-2*i+s+o)*c+(-3*t+3*i-2*s-o)*a+s*n+t}function qp(n,e){const t=1-n;return t*t*e}function Xp(n,e){return 2*(1-n)*n*e}function Yp(n,e){return n*n*e}function ks(n,e,t,i){return qp(n,e)+Xp(n,t)+Yp(n,i)}function jp(n,e){const t=1-n;return t*t*t*e}function Zp(n,e){const t=1-n;return 3*t*t*n*e}function Kp(n,e){return 3*(1-n)*n*n*e}function Jp(n,e){return n*n*n*e}function zs(n,e,t,i,r){return jp(n,e)+Zp(n,t)+Kp(n,i)+Jp(n,r)}class dd extends xi{constructor(e=new xe,t=new xe,i=new xe,r=new xe){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=r}getPoint(e,t=new xe){const i=t,r=this.v0,s=this.v1,o=this.v2,a=this.v3;return i.set(zs(e,r.x,s.x,o.x,a.x),zs(e,r.y,s.y,o.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Qp extends xi{constructor(e=new D,t=new D,i=new D,r=new D){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=r}getPoint(e,t=new D){const i=t,r=this.v0,s=this.v1,o=this.v2,a=this.v3;return i.set(zs(e,r.x,s.x,o.x,a.x),zs(e,r.y,s.y,o.y,a.y),zs(e,r.z,s.z,o.z,a.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class fd extends xi{constructor(e=new xe,t=new xe){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new xe){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new xe){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class em extends xi{constructor(e=new D,t=new D){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new D){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new D){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class pd extends xi{constructor(e=new xe,t=new xe,i=new xe){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new xe){const i=t,r=this.v0,s=this.v1,o=this.v2;return i.set(ks(e,r.x,s.x,o.x),ks(e,r.y,s.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Tl extends xi{constructor(e=new D,t=new D,i=new D){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new D){const i=t,r=this.v0,s=this.v1,o=this.v2;return i.set(ks(e,r.x,s.x,o.x),ks(e,r.y,s.y,o.y),ks(e,r.z,s.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class md extends xi{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new xe){const i=t,r=this.points,s=(r.length-1)*e,o=Math.floor(s),a=s-o,c=r[o===0?o:o-1],l=r[o],u=r[o>r.length-2?r.length-1:o+1],h=r[o>r.length-3?r.length-1:o+2];return i.set(Iu(a,c.x,l.x,u.x,h.x),Iu(a,c.y,l.y,u.y,h.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(r.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const r=this.points[t];e.points.push(r.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(new xe().fromArray(r))}return this}}var Ko=Object.freeze({__proto__:null,ArcCurve:$p,CatmullRomCurve3:Fs,CubicBezierCurve:dd,CubicBezierCurve3:Qp,EllipseCurve:El,LineCurve:fd,LineCurve3:em,QuadraticBezierCurve:pd,QuadraticBezierCurve3:Tl,SplineCurve:md});class tm extends xi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Ko[i](t,e))}return this}getPoint(e,t){const i=e*this.getLength(),r=this.getCurveLengths();let s=0;for(;s<r.length;){if(r[s]>=i){const o=r[s]-i,a=this.curves[s],c=a.getLength(),l=c===0?0:1-o/c;return a.getPointAt(l,t)}s++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let i=0,r=this.curves.length;i<r;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let i;for(let r=0,s=this.curves;r<s.length;r++){const o=s[r],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,c=o.getPoints(a);for(let l=0;l<c.length;l++){const u=c[l];i&&i.equals(u)||(t.push(u),i=u)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const r=e.curves[t];this.curves.push(r.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){const r=this.curves[t];e.curves.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const r=e.curves[t];this.curves.push(new Ko[r.type]().fromJSON(r))}return this}}class Uu extends tm{constructor(e){super(),this.type="Path",this.currentPoint=new xe,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const i=new fd(this.currentPoint.clone(),new xe(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,r){const s=new pd(this.currentPoint.clone(),new xe(e,t),new xe(i,r));return this.curves.push(s),this.currentPoint.set(i,r),this}bezierCurveTo(e,t,i,r,s,o){const a=new dd(this.currentPoint.clone(),new xe(e,t),new xe(i,r),new xe(s,o));return this.curves.push(a),this.currentPoint.set(s,o),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),i=new md(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,r,s,o){const a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+a,t+c,i,r,s,o),this}absarc(e,t,i,r,s,o){return this.absellipse(e,t,i,i,r,s,o),this}ellipse(e,t,i,r,s,o,a,c){const l=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(e+l,t+u,i,r,s,o,a,c),this}absellipse(e,t,i,r,s,o,a,c){const l=new El(e,t,i,r,s,o,a,c);if(this.curves.length>0){const h=l.getPoint(0);h.equals(this.currentPoint)||this.lineTo(h.x,h.y)}this.curves.push(l);const u=l.getPoint(1);return this.currentPoint.copy(u),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class gd extends Uu{constructor(e){super(e),this.uuid=Pr(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let i=0,r=this.holes.length;i<r;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const r=e.holes[t];this.holes.push(r.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){const r=this.holes[t];e.holes.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const r=e.holes[t];this.holes.push(new Uu().fromJSON(r))}return this}}function nm(n,e,t=2){const i=e&&e.length,r=i?e[0]*t:n.length;let s=vd(n,0,r,t,!0);const o=[];if(!s||s.next===s.prev)return o;let a,c,l;if(i&&(s=am(n,e,s,t)),n.length>80*t){a=1/0,c=1/0;let u=-1/0,h=-1/0;for(let d=t;d<r;d+=t){const f=n[d],g=n[d+1];f<a&&(a=f),g<c&&(c=g),f>u&&(u=f),g>h&&(h=g)}l=Math.max(u-a,h-c),l=l!==0?32767/l:0}return Ys(s,o,t,a,c,l,0),o}function vd(n,e,t,i,r){let s;if(r===_m(n,e,t,i)>0)for(let o=e;o<t;o+=i)s=Nu(o/i|0,n[o],n[o+1],s);else for(let o=t-i;o>=e;o-=i)s=Nu(o/i|0,n[o],n[o+1],s);return s&&ps(s,s.next)&&(Zs(s),s=s.next),s}function Ar(n,e){if(!n)return n;e||(e=n);let t=n,i;do if(i=!1,!t.steiner&&(ps(t,t.next)||jt(t.prev,t,t.next)===0)){if(Zs(t),t=e=t.prev,t===t.next)break;i=!0}else t=t.next;while(i||t!==e);return e}function Ys(n,e,t,i,r,s,o){if(!n)return;!o&&s&&dm(n,i,r,s);let a=n;for(;n.prev!==n.next;){const c=n.prev,l=n.next;if(s?rm(n,i,r,s):im(n)){e.push(c.i,n.i,l.i),Zs(n),n=l.next,a=l.next;continue}if(n=l,n===a){o?o===1?(n=sm(Ar(n),e),Ys(n,e,t,i,r,s,2)):o===2&&om(n,e,t,i,r,s):Ys(Ar(n),e,t,i,r,s,1);break}}}function im(n){const e=n.prev,t=n,i=n.next;if(jt(e,t,i)>=0)return!1;const r=e.x,s=t.x,o=i.x,a=e.y,c=t.y,l=i.y,u=Math.min(r,s,o),h=Math.min(a,c,l),d=Math.max(r,s,o),f=Math.max(a,c,l);let g=i.next;for(;g!==e;){if(g.x>=u&&g.x<=d&&g.y>=h&&g.y<=f&&Is(r,a,s,c,o,l,g.x,g.y)&&jt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function rm(n,e,t,i){const r=n.prev,s=n,o=n.next;if(jt(r,s,o)>=0)return!1;const a=r.x,c=s.x,l=o.x,u=r.y,h=s.y,d=o.y,f=Math.min(a,c,l),g=Math.min(u,h,d),v=Math.max(a,c,l),m=Math.max(u,h,d),p=Jc(f,g,e,t,i),_=Jc(v,m,e,t,i);let x=n.prevZ,y=n.nextZ;for(;x&&x.z>=p&&y&&y.z<=_;){if(x.x>=f&&x.x<=v&&x.y>=g&&x.y<=m&&x!==r&&x!==o&&Is(a,u,c,h,l,d,x.x,x.y)&&jt(x.prev,x,x.next)>=0||(x=x.prevZ,y.x>=f&&y.x<=v&&y.y>=g&&y.y<=m&&y!==r&&y!==o&&Is(a,u,c,h,l,d,y.x,y.y)&&jt(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;x&&x.z>=p;){if(x.x>=f&&x.x<=v&&x.y>=g&&x.y<=m&&x!==r&&x!==o&&Is(a,u,c,h,l,d,x.x,x.y)&&jt(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;y&&y.z<=_;){if(y.x>=f&&y.x<=v&&y.y>=g&&y.y<=m&&y!==r&&y!==o&&Is(a,u,c,h,l,d,y.x,y.y)&&jt(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function sm(n,e){let t=n;do{const i=t.prev,r=t.next.next;!ps(i,r)&&xd(i,t,t.next,r)&&js(i,r)&&js(r,i)&&(e.push(i.i,t.i,r.i),Zs(t),Zs(t.next),t=n=r),t=t.next}while(t!==n);return Ar(t)}function om(n,e,t,i,r,s){let o=n;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&mm(o,a)){let c=yd(o,a);o=Ar(o,o.next),c=Ar(c,c.next),Ys(o,e,t,i,r,s,0),Ys(c,e,t,i,r,s,0);return}a=a.next}o=o.next}while(o!==n)}function am(n,e,t,i){const r=[];for(let s=0,o=e.length;s<o;s++){const a=e[s]*i,c=s<o-1?e[s+1]*i:n.length,l=vd(n,a,c,i,!1);l===l.next&&(l.steiner=!0),r.push(pm(l))}r.sort(cm);for(let s=0;s<r.length;s++)t=lm(r[s],t);return t}function cm(n,e){let t=n.x-e.x;if(t===0&&(t=n.y-e.y,t===0)){const i=(n.next.y-n.y)/(n.next.x-n.x),r=(e.next.y-e.y)/(e.next.x-e.x);t=i-r}return t}function lm(n,e){const t=um(n,e);if(!t)return e;const i=yd(t,n);return Ar(i,i.next),Ar(t,t.next)}function um(n,e){let t=e;const i=n.x,r=n.y;let s=-1/0,o;if(ps(n,t))return t;do{if(ps(n,t.next))return t.next;if(r<=t.y&&r>=t.next.y&&t.next.y!==t.y){const h=t.x+(r-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(h<=i&&h>s&&(s=h,o=t.x<t.next.x?t:t.next,h===i))return o}t=t.next}while(t!==e);if(!o)return null;const a=o,c=o.x,l=o.y;let u=1/0;t=o;do{if(i>=t.x&&t.x>=c&&i!==t.x&&_d(r<l?i:s,r,c,l,r<l?s:i,r,t.x,t.y)){const h=Math.abs(r-t.y)/(i-t.x);js(t,n)&&(h<u||h===u&&(t.x>o.x||t.x===o.x&&hm(o,t)))&&(o=t,u=h)}t=t.next}while(t!==a);return o}function hm(n,e){return jt(n.prev,n,e.prev)<0&&jt(e.next,n,n.next)<0}function dm(n,e,t,i){let r=n;do r.z===0&&(r.z=Jc(r.x,r.y,e,t,i)),r.prevZ=r.prev,r.nextZ=r.next,r=r.next;while(r!==n);r.prevZ.nextZ=null,r.prevZ=null,fm(r)}function fm(n){let e,t=1;do{let i=n,r;n=null;let s=null;for(e=0;i;){e++;let o=i,a=0;for(let l=0;l<t&&(a++,o=o.nextZ,!!o);l++);let c=t;for(;a>0||c>0&&o;)a!==0&&(c===0||!o||i.z<=o.z)?(r=i,i=i.nextZ,a--):(r=o,o=o.nextZ,c--),s?s.nextZ=r:n=r,r.prevZ=s,s=r;i=o}s.nextZ=null,t*=2}while(e>1);return n}function Jc(n,e,t,i,r){return n=(n-t)*r|0,e=(e-i)*r|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,n|e<<1}function pm(n){let e=n,t=n;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==n);return t}function _d(n,e,t,i,r,s,o,a){return(r-o)*(e-a)>=(n-o)*(s-a)&&(n-o)*(i-a)>=(t-o)*(e-a)&&(t-o)*(s-a)>=(r-o)*(i-a)}function Is(n,e,t,i,r,s,o,a){return!(n===o&&e===a)&&_d(n,e,t,i,r,s,o,a)}function mm(n,e){return n.next.i!==e.i&&n.prev.i!==e.i&&!gm(n,e)&&(js(n,e)&&js(e,n)&&vm(n,e)&&(jt(n.prev,n,e.prev)||jt(n,e.prev,e))||ps(n,e)&&jt(n.prev,n,n.next)>0&&jt(e.prev,e,e.next)>0)}function jt(n,e,t){return(e.y-n.y)*(t.x-e.x)-(e.x-n.x)*(t.y-e.y)}function ps(n,e){return n.x===e.x&&n.y===e.y}function xd(n,e,t,i){const r=Uo(jt(n,e,t)),s=Uo(jt(n,e,i)),o=Uo(jt(t,i,n)),a=Uo(jt(t,i,e));return!!(r!==s&&o!==a||r===0&&Io(n,t,e)||s===0&&Io(n,i,e)||o===0&&Io(t,n,i)||a===0&&Io(t,e,i))}function Io(n,e,t){return e.x<=Math.max(n.x,t.x)&&e.x>=Math.min(n.x,t.x)&&e.y<=Math.max(n.y,t.y)&&e.y>=Math.min(n.y,t.y)}function Uo(n){return n>0?1:n<0?-1:0}function gm(n,e){let t=n;do{if(t.i!==n.i&&t.next.i!==n.i&&t.i!==e.i&&t.next.i!==e.i&&xd(t,t.next,n,e))return!0;t=t.next}while(t!==n);return!1}function js(n,e){return jt(n.prev,n,n.next)<0?jt(n,e,n.next)>=0&&jt(n,n.prev,e)>=0:jt(n,e,n.prev)<0||jt(n,n.next,e)<0}function vm(n,e){let t=n,i=!1;const r=(n.x+e.x)/2,s=(n.y+e.y)/2;do t.y>s!=t.next.y>s&&t.next.y!==t.y&&r<(t.next.x-t.x)*(s-t.y)/(t.next.y-t.y)+t.x&&(i=!i),t=t.next;while(t!==n);return i}function yd(n,e){const t=Qc(n.i,n.x,n.y),i=Qc(e.i,e.x,e.y),r=n.next,s=e.prev;return n.next=e,e.prev=n,t.next=r,r.prev=t,i.next=t,t.prev=i,s.next=i,i.prev=s,i}function Nu(n,e,t,i){const r=Qc(n,e,t);return i?(r.next=i.next,r.prev=i,i.next.prev=r,i.next=r):(r.prev=r,r.next=r),r}function Zs(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Qc(n,e,t){return{i:n,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function _m(n,e,t,i){let r=0;for(let s=e,o=t-i;s<t;s+=i)r+=(n[o]-n[s])*(n[s+1]+n[o+1]),o=s;return r}class xm{static triangulate(e,t,i=2){return nm(e,t,i)}}class es{static area(e){const t=e.length;let i=0;for(let r=t-1,s=0;s<t;r=s++)i+=e[r].x*e[s].y-e[s].x*e[r].y;return i*.5}static isClockWise(e){return es.area(e)<0}static triangulateShape(e,t){const i=[],r=[],s=[];Ou(e),Fu(i,e);let o=e.length;t.forEach(Ou);for(let c=0;c<t.length;c++)r.push(o),o+=t[c].length,Fu(i,t[c]);const a=xm.triangulate(i,r);for(let c=0;c<a.length;c+=3)s.push(a.slice(c,c+3));return s}}function Ou(n){const e=n.length;e>2&&n[e-1].equals(n[0])&&n.pop()}function Fu(n,e){for(let t=0;t<e.length;t++)n.push(e[t].x),n.push(e[t].y)}class Al extends an{constructor(e=new gd([new xe(.5,.5),new xe(-.5,.5),new xe(-.5,-.5),new xe(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const i=this,r=[],s=[];for(let a=0,c=e.length;a<c;a++){const l=e[a];o(l)}this.setAttribute("position",new Dt(r,3)),this.setAttribute("uv",new Dt(s,2)),this.computeVertexNormals();function o(a){const c=[],l=t.curveSegments!==void 0?t.curveSegments:12,u=t.steps!==void 0?t.steps:1,h=t.depth!==void 0?t.depth:1;let d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:f-.1,v=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3;const p=t.extrudePath,_=t.UVGenerator!==void 0?t.UVGenerator:ym;let x,y=!1,M,w,A,C;p&&(x=p.getSpacedPoints(u),y=!0,d=!1,M=p.computeFrenetFrames(u,!1),w=new D,A=new D,C=new D),d||(m=0,f=0,g=0,v=0);const S=a.extractPoints(l);let E=S.shape;const L=S.holes;if(!es.isClockWise(E)){E=E.reverse();for(let me=0,de=L.length;me<de;me++){const se=L[me];es.isClockWise(se)&&(L[me]=se.reverse())}}function H(me){const se=10000000000000001e-36;let ce=me[0];for(let Ee=1;Ee<=me.length;Ee++){const pe=Ee%me.length,Me=me[pe],Qe=Me.x-ce.x,tt=Me.y-ce.y,U=Qe*Qe+tt*tt,T=Math.max(Math.abs(Me.x),Math.abs(Me.y),Math.abs(ce.x),Math.abs(ce.y)),j=se*T*T;if(U<=j){me.splice(pe,1),Ee--;continue}ce=Me}}H(E),L.forEach(H);const B=L.length,Y=E;for(let me=0;me<B;me++){const de=L[me];E=E.concat(de)}function $(me,de,se){return de||console.error("THREE.ExtrudeGeometry: vec does not exist"),me.clone().addScaledVector(de,se)}const W=E.length;function I(me,de,se){let ce,Ee,pe;const Me=me.x-de.x,Qe=me.y-de.y,tt=se.x-me.x,U=se.y-me.y,T=Me*Me+Qe*Qe,j=Me*U-Qe*tt;if(Math.abs(j)>Number.EPSILON){const ee=Math.sqrt(T),fe=Math.sqrt(tt*tt+U*U),ne=de.x-Qe/ee,Ne=de.y+Me/ee,ye=se.x-U/fe,Ge=se.y+tt/fe,ze=((ye-ne)*U-(Ge-Ne)*tt)/(Me*U-Qe*tt);ce=ne+Me*ze-me.x,Ee=Ne+Qe*ze-me.y;const Z=ce*ce+Ee*Ee;if(Z<=2)return new xe(ce,Ee);pe=Math.sqrt(Z/2)}else{let ee=!1;Me>Number.EPSILON?tt>Number.EPSILON&&(ee=!0):Me<-Number.EPSILON?tt<-Number.EPSILON&&(ee=!0):Math.sign(Qe)===Math.sign(U)&&(ee=!0),ee?(ce=-Qe,Ee=Me,pe=Math.sqrt(T)):(ce=Me,Ee=Qe,pe=Math.sqrt(T/2))}return new xe(ce/pe,Ee/pe)}const le=[];for(let me=0,de=Y.length,se=de-1,ce=me+1;me<de;me++,se++,ce++)se===de&&(se=0),ce===de&&(ce=0),le[me]=I(Y[me],Y[se],Y[ce]);const oe=[];let K,Ie=le.concat();for(let me=0,de=B;me<de;me++){const se=L[me];K=[];for(let ce=0,Ee=se.length,pe=Ee-1,Me=ce+1;ce<Ee;ce++,pe++,Me++)pe===Ee&&(pe=0),Me===Ee&&(Me=0),K[ce]=I(se[ce],se[pe],se[Me]);oe.push(K),Ie=Ie.concat(K)}let et;if(m===0)et=es.triangulateShape(Y,L);else{const me=[],de=[];for(let se=0;se<m;se++){const ce=se/m,Ee=f*Math.cos(ce*Math.PI/2),pe=g*Math.sin(ce*Math.PI/2)+v;for(let Me=0,Qe=Y.length;Me<Qe;Me++){const tt=$(Y[Me],le[Me],pe);qe(tt.x,tt.y,-Ee),ce===0&&me.push(tt)}for(let Me=0,Qe=B;Me<Qe;Me++){const tt=L[Me];K=oe[Me];const U=[];for(let T=0,j=tt.length;T<j;T++){const ee=$(tt[T],K[T],pe);qe(ee.x,ee.y,-Ee),ce===0&&U.push(ee)}ce===0&&de.push(U)}}et=es.triangulateShape(me,de)}const Ue=et.length,ct=g+v;for(let me=0;me<W;me++){const de=d?$(E[me],Ie[me],ct):E[me];y?(A.copy(M.normals[0]).multiplyScalar(de.x),w.copy(M.binormals[0]).multiplyScalar(de.y),C.copy(x[0]).add(A).add(w),qe(C.x,C.y,C.z)):qe(de.x,de.y,0)}for(let me=1;me<=u;me++)for(let de=0;de<W;de++){const se=d?$(E[de],Ie[de],ct):E[de];y?(A.copy(M.normals[me]).multiplyScalar(se.x),w.copy(M.binormals[me]).multiplyScalar(se.y),C.copy(x[me]).add(A).add(w),qe(C.x,C.y,C.z)):qe(se.x,se.y,h/u*me)}for(let me=m-1;me>=0;me--){const de=me/m,se=f*Math.cos(de*Math.PI/2),ce=g*Math.sin(de*Math.PI/2)+v;for(let Ee=0,pe=Y.length;Ee<pe;Ee++){const Me=$(Y[Ee],le[Ee],ce);qe(Me.x,Me.y,h+se)}for(let Ee=0,pe=L.length;Ee<pe;Ee++){const Me=L[Ee];K=oe[Ee];for(let Qe=0,tt=Me.length;Qe<tt;Qe++){const U=$(Me[Qe],K[Qe],ce);y?qe(U.x,U.y+x[u-1].y,x[u-1].x+se):qe(U.x,U.y,h+se)}}}te(),he();function te(){const me=r.length/3;if(d){let de=0,se=W*de;for(let ce=0;ce<Ue;ce++){const Ee=et[ce];Ve(Ee[2]+se,Ee[1]+se,Ee[0]+se)}de=u+m*2,se=W*de;for(let ce=0;ce<Ue;ce++){const Ee=et[ce];Ve(Ee[0]+se,Ee[1]+se,Ee[2]+se)}}else{for(let de=0;de<Ue;de++){const se=et[de];Ve(se[2],se[1],se[0])}for(let de=0;de<Ue;de++){const se=et[de];Ve(se[0]+W*u,se[1]+W*u,se[2]+W*u)}}i.addGroup(me,r.length/3-me,0)}function he(){const me=r.length/3;let de=0;Te(Y,de),de+=Y.length;for(let se=0,ce=L.length;se<ce;se++){const Ee=L[se];Te(Ee,de),de+=Ee.length}i.addGroup(me,r.length/3-me,1)}function Te(me,de){let se=me.length;for(;--se>=0;){const ce=se;let Ee=se-1;Ee<0&&(Ee=me.length-1);for(let pe=0,Me=u+m*2;pe<Me;pe++){const Qe=W*pe,tt=W*(pe+1),U=de+ce+Qe,T=de+Ee+Qe,j=de+Ee+tt,ee=de+ce+tt;rt(U,T,j,ee)}}}function qe(me,de,se){c.push(me),c.push(de),c.push(se)}function Ve(me,de,se){Tt(me),Tt(de),Tt(se);const ce=r.length/3,Ee=_.generateTopUV(i,r,ce-3,ce-2,ce-1);k(Ee[0]),k(Ee[1]),k(Ee[2])}function rt(me,de,se,ce){Tt(me),Tt(de),Tt(ce),Tt(de),Tt(se),Tt(ce);const Ee=r.length/3,pe=_.generateSideWallUV(i,r,Ee-6,Ee-3,Ee-2,Ee-1);k(pe[0]),k(pe[1]),k(pe[3]),k(pe[1]),k(pe[2]),k(pe[3])}function Tt(me){r.push(c[me*3+0]),r.push(c[me*3+1]),r.push(c[me*3+2])}function k(me){s.push(me.x),s.push(me.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,i=this.parameters.options;return bm(t,i,e)}static fromJSON(e,t){const i=[];for(let s=0,o=e.shapes.length;s<o;s++){const a=t[e.shapes[s]];i.push(a)}const r=e.options.extrudePath;return r!==void 0&&(e.options.extrudePath=new Ko[r.type]().fromJSON(r)),new Al(i,e.options)}}const ym={generateTopUV:function(n,e,t,i,r){const s=e[t*3],o=e[t*3+1],a=e[i*3],c=e[i*3+1],l=e[r*3],u=e[r*3+1];return[new xe(s,o),new xe(a,c),new xe(l,u)]},generateSideWallUV:function(n,e,t,i,r,s){const o=e[t*3],a=e[t*3+1],c=e[t*3+2],l=e[i*3],u=e[i*3+1],h=e[i*3+2],d=e[r*3],f=e[r*3+1],g=e[r*3+2],v=e[s*3],m=e[s*3+1],p=e[s*3+2];return Math.abs(a-u)<Math.abs(o-l)?[new xe(o,1-c),new xe(l,1-h),new xe(d,1-g),new xe(v,1-p)]:[new xe(a,1-c),new xe(u,1-h),new xe(f,1-g),new xe(m,1-p)]}};function bm(n,e,t){if(t.shapes=[],Array.isArray(n))for(let i=0,r=n.length;i<r;i++){const s=n[i];t.shapes.push(s.uuid)}else t.shapes.push(n.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class Rl extends an{constructor(e=[new xe(0,-.5),new xe(.5,0),new xe(0,.5)],t=12,i=0,r=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:i,phiLength:r},t=Math.floor(t),r=at(r,0,Math.PI*2);const s=[],o=[],a=[],c=[],l=[],u=1/t,h=new D,d=new xe,f=new D,g=new D,v=new D;let m=0,p=0;for(let _=0;_<=e.length-1;_++)switch(_){case 0:m=e[_+1].x-e[_].x,p=e[_+1].y-e[_].y,f.x=p*1,f.y=-m,f.z=p*0,v.copy(f),f.normalize(),c.push(f.x,f.y,f.z);break;case e.length-1:c.push(v.x,v.y,v.z);break;default:m=e[_+1].x-e[_].x,p=e[_+1].y-e[_].y,f.x=p*1,f.y=-m,f.z=p*0,g.copy(f),f.x+=v.x,f.y+=v.y,f.z+=v.z,f.normalize(),c.push(f.x,f.y,f.z),v.copy(g)}for(let _=0;_<=t;_++){const x=i+_*u*r,y=Math.sin(x),M=Math.cos(x);for(let w=0;w<=e.length-1;w++){h.x=e[w].x*y,h.y=e[w].y,h.z=e[w].x*M,o.push(h.x,h.y,h.z),d.x=_/t,d.y=w/(e.length-1),a.push(d.x,d.y);const A=c[3*w+0]*y,C=c[3*w+1],S=c[3*w+0]*M;l.push(A,C,S)}}for(let _=0;_<t;_++)for(let x=0;x<e.length-1;x++){const y=x+_*e.length,M=y,w=y+e.length,A=y+e.length+1,C=y+1;s.push(M,w,C),s.push(A,C,w)}this.setIndex(s),this.setAttribute("position",new Dt(o,3)),this.setAttribute("uv",new Dt(a,2)),this.setAttribute("normal",new Dt(l,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Rl(e.points,e.segments,e.phiStart,e.phiLength)}}class Ui extends an{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};const s=e/2,o=t/2,a=Math.floor(i),c=Math.floor(r),l=a+1,u=c+1,h=e/a,d=t/c,f=[],g=[],v=[],m=[];for(let p=0;p<u;p++){const _=p*d-o;for(let x=0;x<l;x++){const y=x*h-s;g.push(y,-_,0),v.push(0,0,1),m.push(x/a),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let _=0;_<a;_++){const x=_+l*p,y=_+l*(p+1),M=_+1+l*(p+1),w=_+1+l*p;f.push(x,y,w),f.push(y,M,w)}this.setIndex(f),this.setAttribute("position",new Dt(g,3)),this.setAttribute("normal",new Dt(v,3)),this.setAttribute("uv",new Dt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ui(e.width,e.height,e.widthSegments,e.heightSegments)}}class Ci extends an{constructor(e=1,t=32,i=16,r=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:r,phiLength:s,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const c=Math.min(o+a,Math.PI);let l=0;const u=[],h=new D,d=new D,f=[],g=[],v=[],m=[];for(let p=0;p<=i;p++){const _=[],x=p/i;let y=0;p===0&&o===0?y=.5/t:p===i&&c===Math.PI&&(y=-.5/t);for(let M=0;M<=t;M++){const w=M/t;h.x=-e*Math.cos(r+w*s)*Math.sin(o+x*a),h.y=e*Math.cos(o+x*a),h.z=e*Math.sin(r+w*s)*Math.sin(o+x*a),g.push(h.x,h.y,h.z),d.copy(h).normalize(),v.push(d.x,d.y,d.z),m.push(w+y,1-x),_.push(l++)}u.push(_)}for(let p=0;p<i;p++)for(let _=0;_<t;_++){const x=u[p][_+1],y=u[p][_],M=u[p+1][_],w=u[p+1][_+1];(p!==0||o>0)&&f.push(x,y,w),(p!==i-1||c<Math.PI)&&f.push(y,M,w)}this.setIndex(f),this.setAttribute("position",new Dt(g,3)),this.setAttribute("normal",new Dt(v,3)),this.setAttribute("uv",new Dt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ci(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class ji extends an{constructor(e=1,t=.4,i=12,r=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:r,arc:s},i=Math.floor(i),r=Math.floor(r);const o=[],a=[],c=[],l=[],u=new D,h=new D,d=new D;for(let f=0;f<=i;f++)for(let g=0;g<=r;g++){const v=g/r*s,m=f/i*Math.PI*2;h.x=(e+t*Math.cos(m))*Math.cos(v),h.y=(e+t*Math.cos(m))*Math.sin(v),h.z=t*Math.sin(m),a.push(h.x,h.y,h.z),u.x=e*Math.cos(v),u.y=e*Math.sin(v),d.subVectors(h,u).normalize(),c.push(d.x,d.y,d.z),l.push(g/r),l.push(f/i)}for(let f=1;f<=i;f++)for(let g=1;g<=r;g++){const v=(r+1)*f+g-1,m=(r+1)*(f-1)+g-1,p=(r+1)*(f-1)+g,_=(r+1)*f+g;o.push(v,m,_),o.push(m,p,_)}this.setIndex(o),this.setAttribute("position",new Dt(a,3)),this.setAttribute("normal",new Dt(c,3)),this.setAttribute("uv",new Dt(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ji(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class Ks extends an{constructor(e=new Tl(new D(-1,-1,0),new D(-1,1,0),new D(1,1,0)),t=64,i=1,r=8,s=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:i,radialSegments:r,closed:s};const o=e.computeFrenetFrames(t,s);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;const a=new D,c=new D,l=new xe;let u=new D;const h=[],d=[],f=[],g=[];v(),this.setIndex(g),this.setAttribute("position",new Dt(h,3)),this.setAttribute("normal",new Dt(d,3)),this.setAttribute("uv",new Dt(f,2));function v(){for(let x=0;x<t;x++)m(x);m(s===!1?t:0),_(),p()}function m(x){u=e.getPointAt(x/t,u);const y=o.normals[x],M=o.binormals[x];for(let w=0;w<=r;w++){const A=w/r*Math.PI*2,C=Math.sin(A),S=-Math.cos(A);c.x=S*y.x+C*M.x,c.y=S*y.y+C*M.y,c.z=S*y.z+C*M.z,c.normalize(),d.push(c.x,c.y,c.z),a.x=u.x+i*c.x,a.y=u.y+i*c.y,a.z=u.z+i*c.z,h.push(a.x,a.y,a.z)}}function p(){for(let x=1;x<=t;x++)for(let y=1;y<=r;y++){const M=(r+1)*(x-1)+(y-1),w=(r+1)*x+(y-1),A=(r+1)*x+y,C=(r+1)*(x-1)+y;g.push(M,w,C),g.push(w,A,C)}}function _(){for(let x=0;x<=t;x++)for(let y=0;y<=r;y++)l.x=x/t,l.y=y/r,f.push(l.x,l.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new Ks(new Ko[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}}class Cl extends ms{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new _t(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new _t(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ed,this.normalScale=new xe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new kn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Mm extends ms{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Vf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Sm extends ms{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Em extends Yo{constructor(e){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}}class bd extends on{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new _t(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class wm extends bd{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(on.DEFAULT_UP),this.updateMatrix(),this.groundColor=new _t(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Ka=new Vt,ku=new D,zu=new D;class Tm{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new xe(512,512),this.mapType=_i,this.map=null,this.mapPass=null,this.matrix=new Vt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new bl,this._frameExtents=new xe(1,1),this._viewportCount=1,this._viewports=[new Kt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;ku.setFromMatrixPosition(e.matrixWorld),t.position.copy(ku),zu.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(zu),t.updateMatrixWorld(),Ka.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ka,t.coordinateSystem,t.reversedDepth),t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Ka)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class Md extends cd{constructor(e=-1,t=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,o=i+e,a=r+t,c=r-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,o=s+l*this.view.width,a-=u*this.view.offsetY,c=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Am extends Tm{constructor(){super(new Md(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Bu extends bd{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(on.DEFAULT_UP),this.updateMatrix(),this.target=new on,this.shadow=new Am}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Rm extends Yn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const Vu=new Vt;class Cm{constructor(e,t,i=0,r=1/0){this.ray=new oa(e,t),this.near=i,this.far=r,this.camera=null,this.layers=new xl,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Vu.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Vu),this}intersectObject(e,t=!0,i=[]){return el(e,this,i,t),i.sort(Hu),i}intersectObjects(e,t=!0,i=[]){for(let r=0,s=e.length;r<s;r++)el(e[r],this,i,t);return i.sort(Hu),i}}function Hu(n,e){return n.distance-e.distance}function el(n,e,t,i){let r=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(r=!1),r===!0&&i===!0){const s=n.children;for(let o=0,a=s.length;o<a;o++)el(s[o],e,t,!0)}}class Gu{constructor(e=1,t=0,i=0){this.radius=e,this.phi=t,this.theta=i}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=at(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(at(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class Pm extends Cr{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function Wu(n,e,t,i){const r=Lm(i);switch(t){case Zh:return n*e;case Jh:return n*e/r.components*r.byteLength;case pl:return n*e/r.components*r.byteLength;case Qh:return n*e*2/r.components*r.byteLength;case ml:return n*e*2/r.components*r.byteLength;case Kh:return n*e*3/r.components*r.byteLength;case oi:return n*e*4/r.components*r.byteLength;case gl:return n*e*4/r.components*r.byteLength;case zo:case Bo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Vo:case Ho:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Sc:case wc:return Math.max(n,16)*Math.max(e,8)/4;case Mc:case Ec:return Math.max(n,8)*Math.max(e,8)/2;case Tc:case Ac:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Rc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Cc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Pc:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Lc:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Dc:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Ic:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Uc:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Nc:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Oc:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Fc:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case kc:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case zc:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Bc:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case Vc:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Hc:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Gc:case Wc:case $c:return Math.ceil(n/4)*Math.ceil(e/4)*16;case qc:case Xc:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Yc:case jc:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Lm(n){switch(n){case _i:case qh:return{byteLength:1,components:1};case Hs:case Xh:case Qs:return{byteLength:2,components:1};case dl:case fl:return{byteLength:2,components:4};case wr:case hl:case Ii:return{byteLength:4,components:1};case Yh:case jh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ul}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ul);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Sd(){let n=null,e=!1,t=null,i=null;function r(s,o){t(s,o),i=n.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function Dm(n){const e=new WeakMap;function t(a,c){const l=a.array,u=a.usage,h=l.byteLength,d=n.createBuffer();n.bindBuffer(c,d),n.bufferData(c,l,u),a.onUploadCallback();let f;if(l instanceof Float32Array)f=n.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=n.HALF_FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=n.SHORT;else if(l instanceof Uint32Array)f=n.UNSIGNED_INT;else if(l instanceof Int32Array)f=n.INT;else if(l instanceof Int8Array)f=n.BYTE;else if(l instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:h}}function i(a,c,l){const u=c.array,h=c.updateRanges;if(n.bindBuffer(l,a),h.length===0)n.bufferSubData(l,0,u);else{h.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<h.length;f++){const g=h[d],v=h[f];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++d,h[d]=v)}h.length=d+1;for(let f=0,g=h.length;f<g;f++){const v=h[f];n.bufferSubData(l,v.start*u.BYTES_PER_ELEMENT,u,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=e.get(a);c&&(n.deleteBuffer(c.buffer),e.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const l=e.get(a);if(l===void 0)e.set(a,t(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,a,c),l.version=a.version}}return{get:r,remove:s,update:o}}var Im=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Um=`#ifdef USE_ALPHAHASH
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
#endif`,Nm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Om=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Fm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,km=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,zm=`#ifdef USE_AOMAP
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
#endif`,Bm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Vm=`#ifdef USE_BATCHING
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
#endif`,Hm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Gm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Wm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,$m=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,qm=`#ifdef USE_IRIDESCENCE
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
#endif`,Xm=`#ifdef USE_BUMPMAP
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
#endif`,Ym=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,jm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Zm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Km=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Jm=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Qm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,e0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,t0=`#if defined( USE_COLOR_ALPHA )
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
#endif`,n0=`#define PI 3.141592653589793
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
} // validated`,i0=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,r0=`vec3 transformedNormal = objectNormal;
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
#endif`,s0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,o0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,a0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,c0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,l0="gl_FragColor = linearToOutputTexel( gl_FragColor );",u0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,h0=`#ifdef USE_ENVMAP
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
#endif`,d0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,f0=`#ifdef USE_ENVMAP
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
#endif`,p0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,m0=`#ifdef USE_ENVMAP
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
#endif`,g0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,v0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,_0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,x0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,y0=`#ifdef USE_GRADIENTMAP
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
}`,b0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,M0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,S0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,E0=`uniform bool receiveShadow;
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
#endif`,w0=`#ifdef USE_ENVMAP
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
#endif`,T0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,A0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,R0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,C0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,P0=`PhysicalMaterial material;
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
#endif`,L0=`struct PhysicalMaterial {
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
}`,D0=`
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
#endif`,I0=`#if defined( RE_IndirectDiffuse )
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
#endif`,U0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,N0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,O0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,F0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,k0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,z0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,B0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,V0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,H0=`#if defined( USE_POINTS_UV )
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
#endif`,G0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,W0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,$0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,q0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,X0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Y0=`#ifdef USE_MORPHTARGETS
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
#endif`,j0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Z0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,K0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,J0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Q0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,eg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,tg=`#ifdef USE_NORMALMAP
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
#endif`,ng=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,ig=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,rg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,sg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,og=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,ag=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,cg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,lg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,ug=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,hg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,dg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,fg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,pg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,mg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,gg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,vg=`float getShadowMask() {
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
}`,_g=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,xg=`#ifdef USE_SKINNING
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
#endif`,yg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,bg=`#ifdef USE_SKINNING
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
#endif`,Mg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Sg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Eg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,wg=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Tg=`#ifdef USE_TRANSMISSION
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
#endif`,Ag=`#ifdef USE_TRANSMISSION
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
#endif`,Rg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Cg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Pg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Lg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Dg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Ig=`uniform sampler2D t2D;
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
}`,Ug=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ng=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Og=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Fg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,kg=`#include <common>
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
}`,zg=`#if DEPTH_PACKING == 3200
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
}`,Bg=`#define DISTANCE
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
}`,Vg=`#define DISTANCE
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
}`,Hg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Gg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Wg=`uniform float scale;
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
}`,$g=`uniform vec3 diffuse;
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
}`,qg=`#include <common>
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
}`,Xg=`uniform vec3 diffuse;
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
}`,Yg=`#define LAMBERT
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
}`,jg=`#define LAMBERT
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
}`,Zg=`#define MATCAP
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
}`,Kg=`#define MATCAP
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
}`,Jg=`#define NORMAL
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
}`,Qg=`#define NORMAL
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
}`,ev=`#define PHONG
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
}`,tv=`#define PHONG
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
}`,nv=`#define STANDARD
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
}`,iv=`#define STANDARD
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
}`,rv=`#define TOON
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
}`,sv=`#define TOON
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
}`,ov=`uniform float size;
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
}`,av=`uniform vec3 diffuse;
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
}`,cv=`#include <common>
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
}`,lv=`uniform vec3 color;
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
}`,uv=`uniform float rotation;
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
}`,hv=`uniform vec3 diffuse;
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
}`,ht={alphahash_fragment:Im,alphahash_pars_fragment:Um,alphamap_fragment:Nm,alphamap_pars_fragment:Om,alphatest_fragment:Fm,alphatest_pars_fragment:km,aomap_fragment:zm,aomap_pars_fragment:Bm,batching_pars_vertex:Vm,batching_vertex:Hm,begin_vertex:Gm,beginnormal_vertex:Wm,bsdfs:$m,iridescence_fragment:qm,bumpmap_pars_fragment:Xm,clipping_planes_fragment:Ym,clipping_planes_pars_fragment:jm,clipping_planes_pars_vertex:Zm,clipping_planes_vertex:Km,color_fragment:Jm,color_pars_fragment:Qm,color_pars_vertex:e0,color_vertex:t0,common:n0,cube_uv_reflection_fragment:i0,defaultnormal_vertex:r0,displacementmap_pars_vertex:s0,displacementmap_vertex:o0,emissivemap_fragment:a0,emissivemap_pars_fragment:c0,colorspace_fragment:l0,colorspace_pars_fragment:u0,envmap_fragment:h0,envmap_common_pars_fragment:d0,envmap_pars_fragment:f0,envmap_pars_vertex:p0,envmap_physical_pars_fragment:w0,envmap_vertex:m0,fog_vertex:g0,fog_pars_vertex:v0,fog_fragment:_0,fog_pars_fragment:x0,gradientmap_pars_fragment:y0,lightmap_pars_fragment:b0,lights_lambert_fragment:M0,lights_lambert_pars_fragment:S0,lights_pars_begin:E0,lights_toon_fragment:T0,lights_toon_pars_fragment:A0,lights_phong_fragment:R0,lights_phong_pars_fragment:C0,lights_physical_fragment:P0,lights_physical_pars_fragment:L0,lights_fragment_begin:D0,lights_fragment_maps:I0,lights_fragment_end:U0,logdepthbuf_fragment:N0,logdepthbuf_pars_fragment:O0,logdepthbuf_pars_vertex:F0,logdepthbuf_vertex:k0,map_fragment:z0,map_pars_fragment:B0,map_particle_fragment:V0,map_particle_pars_fragment:H0,metalnessmap_fragment:G0,metalnessmap_pars_fragment:W0,morphinstance_vertex:$0,morphcolor_vertex:q0,morphnormal_vertex:X0,morphtarget_pars_vertex:Y0,morphtarget_vertex:j0,normal_fragment_begin:Z0,normal_fragment_maps:K0,normal_pars_fragment:J0,normal_pars_vertex:Q0,normal_vertex:eg,normalmap_pars_fragment:tg,clearcoat_normal_fragment_begin:ng,clearcoat_normal_fragment_maps:ig,clearcoat_pars_fragment:rg,iridescence_pars_fragment:sg,opaque_fragment:og,packing:ag,premultiplied_alpha_fragment:cg,project_vertex:lg,dithering_fragment:ug,dithering_pars_fragment:hg,roughnessmap_fragment:dg,roughnessmap_pars_fragment:fg,shadowmap_pars_fragment:pg,shadowmap_pars_vertex:mg,shadowmap_vertex:gg,shadowmask_pars_fragment:vg,skinbase_vertex:_g,skinning_pars_vertex:xg,skinning_vertex:yg,skinnormal_vertex:bg,specularmap_fragment:Mg,specularmap_pars_fragment:Sg,tonemapping_fragment:Eg,tonemapping_pars_fragment:wg,transmission_fragment:Tg,transmission_pars_fragment:Ag,uv_pars_fragment:Rg,uv_pars_vertex:Cg,uv_vertex:Pg,worldpos_vertex:Lg,background_vert:Dg,background_frag:Ig,backgroundCube_vert:Ug,backgroundCube_frag:Ng,cube_vert:Og,cube_frag:Fg,depth_vert:kg,depth_frag:zg,distanceRGBA_vert:Bg,distanceRGBA_frag:Vg,equirect_vert:Hg,equirect_frag:Gg,linedashed_vert:Wg,linedashed_frag:$g,meshbasic_vert:qg,meshbasic_frag:Xg,meshlambert_vert:Yg,meshlambert_frag:jg,meshmatcap_vert:Zg,meshmatcap_frag:Kg,meshnormal_vert:Jg,meshnormal_frag:Qg,meshphong_vert:ev,meshphong_frag:tv,meshphysical_vert:nv,meshphysical_frag:iv,meshtoon_vert:rv,meshtoon_frag:sv,points_vert:ov,points_frag:av,shadow_vert:cv,shadow_frag:lv,sprite_vert:uv,sprite_frag:hv},Pe={common:{diffuse:{value:new _t(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ot},alphaMap:{value:null},alphaMapTransform:{value:new ot},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ot}},envmap:{envMap:{value:null},envMapRotation:{value:new ot},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ot}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ot}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ot},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ot},normalScale:{value:new xe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ot},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ot}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ot}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ot}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new _t(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new _t(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ot},alphaTest:{value:0},uvTransform:{value:new ot}},sprite:{diffuse:{value:new _t(16777215)},opacity:{value:1},center:{value:new xe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ot},alphaMap:{value:null},alphaMapTransform:{value:new ot},alphaTest:{value:0}}},di={basic:{uniforms:Cn([Pe.common,Pe.specularmap,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.fog]),vertexShader:ht.meshbasic_vert,fragmentShader:ht.meshbasic_frag},lambert:{uniforms:Cn([Pe.common,Pe.specularmap,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.fog,Pe.lights,{emissive:{value:new _t(0)}}]),vertexShader:ht.meshlambert_vert,fragmentShader:ht.meshlambert_frag},phong:{uniforms:Cn([Pe.common,Pe.specularmap,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.fog,Pe.lights,{emissive:{value:new _t(0)},specular:{value:new _t(1118481)},shininess:{value:30}}]),vertexShader:ht.meshphong_vert,fragmentShader:ht.meshphong_frag},standard:{uniforms:Cn([Pe.common,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.roughnessmap,Pe.metalnessmap,Pe.fog,Pe.lights,{emissive:{value:new _t(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ht.meshphysical_vert,fragmentShader:ht.meshphysical_frag},toon:{uniforms:Cn([Pe.common,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.gradientmap,Pe.fog,Pe.lights,{emissive:{value:new _t(0)}}]),vertexShader:ht.meshtoon_vert,fragmentShader:ht.meshtoon_frag},matcap:{uniforms:Cn([Pe.common,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.fog,{matcap:{value:null}}]),vertexShader:ht.meshmatcap_vert,fragmentShader:ht.meshmatcap_frag},points:{uniforms:Cn([Pe.points,Pe.fog]),vertexShader:ht.points_vert,fragmentShader:ht.points_frag},dashed:{uniforms:Cn([Pe.common,Pe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ht.linedashed_vert,fragmentShader:ht.linedashed_frag},depth:{uniforms:Cn([Pe.common,Pe.displacementmap]),vertexShader:ht.depth_vert,fragmentShader:ht.depth_frag},normal:{uniforms:Cn([Pe.common,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,{opacity:{value:1}}]),vertexShader:ht.meshnormal_vert,fragmentShader:ht.meshnormal_frag},sprite:{uniforms:Cn([Pe.sprite,Pe.fog]),vertexShader:ht.sprite_vert,fragmentShader:ht.sprite_frag},background:{uniforms:{uvTransform:{value:new ot},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ht.background_vert,fragmentShader:ht.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ot}},vertexShader:ht.backgroundCube_vert,fragmentShader:ht.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ht.cube_vert,fragmentShader:ht.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ht.equirect_vert,fragmentShader:ht.equirect_frag},distanceRGBA:{uniforms:Cn([Pe.common,Pe.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ht.distanceRGBA_vert,fragmentShader:ht.distanceRGBA_frag},shadow:{uniforms:Cn([Pe.lights,Pe.fog,{color:{value:new _t(0)},opacity:{value:1}}]),vertexShader:ht.shadow_vert,fragmentShader:ht.shadow_frag}};di.physical={uniforms:Cn([di.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ot},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ot},clearcoatNormalScale:{value:new xe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ot},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ot},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ot},sheen:{value:0},sheenColor:{value:new _t(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ot},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ot},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ot},transmissionSamplerSize:{value:new xe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ot},attenuationDistance:{value:0},attenuationColor:{value:new _t(0)},specularColor:{value:new _t(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ot},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ot},anisotropyVector:{value:new xe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ot}}]),vertexShader:ht.meshphysical_vert,fragmentShader:ht.meshphysical_frag};const No={r:0,b:0,g:0},mr=new kn,dv=new Vt;function fv(n,e,t,i,r,s,o){const a=new _t(0);let c=s===!0?0:1,l,u,h=null,d=0,f=null;function g(x){let y=x.isScene===!0?x.background:null;return y&&y.isTexture&&(y=(x.backgroundBlurriness>0?t:e).get(y)),y}function v(x){let y=!1;const M=g(x);M===null?p(a,c):M&&M.isColor&&(p(M,1),y=!0);const w=n.xr.getEnvironmentBlendMode();w==="additive"?i.buffers.color.setClear(0,0,0,1,o):w==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||y)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(x,y){const M=g(y);M&&(M.isCubeTexture||M.mapping===ra)?(u===void 0&&(u=new En(new Xt(1,1,1),new rr({name:"BackgroundCubeMaterial",uniforms:fs(di.backgroundCube.uniforms),vertexShader:di.backgroundCube.vertexShader,fragmentShader:di.backgroundCube.fragmentShader,side:Fn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(w,A,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),mr.copy(y.backgroundRotation),mr.x*=-1,mr.y*=-1,mr.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(mr.y*=-1,mr.z*=-1),u.material.uniforms.envMap.value=M,u.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(dv.makeRotationFromEuler(mr)),u.material.toneMapped=wt.getTransfer(M.colorSpace)!==It,(h!==M||d!==M.version||f!==n.toneMapping)&&(u.material.needsUpdate=!0,h=M,d=M.version,f=n.toneMapping),u.layers.enableAll(),x.unshift(u,u.geometry,u.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new En(new Ui(2,2),new rr({name:"BackgroundMaterial",uniforms:fs(di.background.uniforms),vertexShader:di.background.vertexShader,fragmentShader:di.background.fragmentShader,side:ir,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,l.material.toneMapped=wt.getTransfer(M.colorSpace)!==It,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(h!==M||d!==M.version||f!==n.toneMapping)&&(l.material.needsUpdate=!0,h=M,d=M.version,f=n.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function p(x,y){x.getRGB(No,ad(n)),i.buffers.color.setClear(No.r,No.g,No.b,y,o)}function _(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(x,y=1){a.set(x),c=y,p(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(x){c=x,p(a,c)},render:v,addToRenderList:m,dispose:_}}function pv(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=d(null);let s=r,o=!1;function a(E,L,O,H,B){let Y=!1;const $=h(H,O,L);s!==$&&(s=$,l(s.object)),Y=f(E,H,O,B),Y&&g(E,H,O,B),B!==null&&e.update(B,n.ELEMENT_ARRAY_BUFFER),(Y||o)&&(o=!1,y(E,L,O,H),B!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(B).buffer))}function c(){return n.createVertexArray()}function l(E){return n.bindVertexArray(E)}function u(E){return n.deleteVertexArray(E)}function h(E,L,O){const H=O.wireframe===!0;let B=i[E.id];B===void 0&&(B={},i[E.id]=B);let Y=B[L.id];Y===void 0&&(Y={},B[L.id]=Y);let $=Y[H];return $===void 0&&($=d(c()),Y[H]=$),$}function d(E){const L=[],O=[],H=[];for(let B=0;B<t;B++)L[B]=0,O[B]=0,H[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:O,attributeDivisors:H,object:E,attributes:{},index:null}}function f(E,L,O,H){const B=s.attributes,Y=L.attributes;let $=0;const W=O.getAttributes();for(const I in W)if(W[I].location>=0){const oe=B[I];let K=Y[I];if(K===void 0&&(I==="instanceMatrix"&&E.instanceMatrix&&(K=E.instanceMatrix),I==="instanceColor"&&E.instanceColor&&(K=E.instanceColor)),oe===void 0||oe.attribute!==K||K&&oe.data!==K.data)return!0;$++}return s.attributesNum!==$||s.index!==H}function g(E,L,O,H){const B={},Y=L.attributes;let $=0;const W=O.getAttributes();for(const I in W)if(W[I].location>=0){let oe=Y[I];oe===void 0&&(I==="instanceMatrix"&&E.instanceMatrix&&(oe=E.instanceMatrix),I==="instanceColor"&&E.instanceColor&&(oe=E.instanceColor));const K={};K.attribute=oe,oe&&oe.data&&(K.data=oe.data),B[I]=K,$++}s.attributes=B,s.attributesNum=$,s.index=H}function v(){const E=s.newAttributes;for(let L=0,O=E.length;L<O;L++)E[L]=0}function m(E){p(E,0)}function p(E,L){const O=s.newAttributes,H=s.enabledAttributes,B=s.attributeDivisors;O[E]=1,H[E]===0&&(n.enableVertexAttribArray(E),H[E]=1),B[E]!==L&&(n.vertexAttribDivisor(E,L),B[E]=L)}function _(){const E=s.newAttributes,L=s.enabledAttributes;for(let O=0,H=L.length;O<H;O++)L[O]!==E[O]&&(n.disableVertexAttribArray(O),L[O]=0)}function x(E,L,O,H,B,Y,$){$===!0?n.vertexAttribIPointer(E,L,O,B,Y):n.vertexAttribPointer(E,L,O,H,B,Y)}function y(E,L,O,H){v();const B=H.attributes,Y=O.getAttributes(),$=L.defaultAttributeValues;for(const W in Y){const I=Y[W];if(I.location>=0){let le=B[W];if(le===void 0&&(W==="instanceMatrix"&&E.instanceMatrix&&(le=E.instanceMatrix),W==="instanceColor"&&E.instanceColor&&(le=E.instanceColor)),le!==void 0){const oe=le.normalized,K=le.itemSize,Ie=e.get(le);if(Ie===void 0)continue;const et=Ie.buffer,Ue=Ie.type,ct=Ie.bytesPerElement,te=Ue===n.INT||Ue===n.UNSIGNED_INT||le.gpuType===hl;if(le.isInterleavedBufferAttribute){const he=le.data,Te=he.stride,qe=le.offset;if(he.isInstancedInterleavedBuffer){for(let Ve=0;Ve<I.locationSize;Ve++)p(I.location+Ve,he.meshPerAttribute);E.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=he.meshPerAttribute*he.count)}else for(let Ve=0;Ve<I.locationSize;Ve++)m(I.location+Ve);n.bindBuffer(n.ARRAY_BUFFER,et);for(let Ve=0;Ve<I.locationSize;Ve++)x(I.location+Ve,K/I.locationSize,Ue,oe,Te*ct,(qe+K/I.locationSize*Ve)*ct,te)}else{if(le.isInstancedBufferAttribute){for(let he=0;he<I.locationSize;he++)p(I.location+he,le.meshPerAttribute);E.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=le.meshPerAttribute*le.count)}else for(let he=0;he<I.locationSize;he++)m(I.location+he);n.bindBuffer(n.ARRAY_BUFFER,et);for(let he=0;he<I.locationSize;he++)x(I.location+he,K/I.locationSize,Ue,oe,K*ct,K/I.locationSize*he*ct,te)}}else if($!==void 0){const oe=$[W];if(oe!==void 0)switch(oe.length){case 2:n.vertexAttrib2fv(I.location,oe);break;case 3:n.vertexAttrib3fv(I.location,oe);break;case 4:n.vertexAttrib4fv(I.location,oe);break;default:n.vertexAttrib1fv(I.location,oe)}}}}_()}function M(){C();for(const E in i){const L=i[E];for(const O in L){const H=L[O];for(const B in H)u(H[B].object),delete H[B];delete L[O]}delete i[E]}}function w(E){if(i[E.id]===void 0)return;const L=i[E.id];for(const O in L){const H=L[O];for(const B in H)u(H[B].object),delete H[B];delete L[O]}delete i[E.id]}function A(E){for(const L in i){const O=i[L];if(O[E.id]===void 0)continue;const H=O[E.id];for(const B in H)u(H[B].object),delete H[B];delete O[E.id]}}function C(){S(),o=!0,s!==r&&(s=r,l(s.object))}function S(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:C,resetDefaultState:S,dispose:M,releaseStatesOfGeometry:w,releaseStatesOfProgram:A,initAttributes:v,enableAttribute:m,disableUnusedAttributes:_}}function mv(n,e,t){let i;function r(l){i=l}function s(l,u){n.drawArrays(i,l,u),t.update(u,i,1)}function o(l,u,h){h!==0&&(n.drawArraysInstanced(i,l,u,h),t.update(u,i,h))}function a(l,u,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,u,0,h);let f=0;for(let g=0;g<h;g++)f+=u[g];t.update(f,i,1)}function c(l,u,h,d){if(h===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<l.length;g++)o(l[g],u[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(i,l,0,u,0,d,0,h);let g=0;for(let v=0;v<h;v++)g+=u[v]*d[v];t.update(g,i,1)}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function gv(n,e,t,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");r=n.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(A){return!(A!==oi&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(A){const C=A===Qs&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==_i&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Ii&&!C)}function c(A){if(A==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const u=c(l);u!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);const h=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),_=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),x=n.getParameter(n.MAX_VARYING_VECTORS),y=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),M=g>0,w=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:h,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:_,maxVaryings:x,maxFragmentUniforms:y,vertexTextures:M,maxSamples:w}}function vv(n){const e=this;let t=null,i=0,r=!1,s=!1;const o=new Pi,a=new ot,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const f=h.length!==0||d||i!==0||r;return r=d,i=h.length,f},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,d){t=u(h,d,0)},this.setState=function(h,d,f){const g=h.clippingPlanes,v=h.clipIntersection,m=h.clipShadows,p=n.get(h);if(!r||g===null||g.length===0||s&&!m)s?u(null):l();else{const _=s?0:i,x=_*4;let y=p.clippingState||null;c.value=y,y=u(g,d,x,f);for(let M=0;M!==x;++M)y[M]=t[M];p.clippingState=y,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=_}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(h,d,f,g){const v=h!==null?h.length:0;let m=null;if(v!==0){if(m=c.value,g!==!0||m===null){const p=f+v*4,_=d.matrixWorldInverse;a.getNormalMatrix(_),(m===null||m.length<p)&&(m=new Float32Array(p));for(let x=0,y=f;x!==v;++x,y+=4)o.copy(h[x]).applyMatrix4(_,a),o.normal.toArray(m,y),m[y+3]=o.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,m}}function _v(n){let e=new WeakMap;function t(o,a){return a===_c?o.mapping=us:a===xc&&(o.mapping=hs),o}function i(o){if(o&&o.isTexture){const a=o.mapping;if(a===_c||a===xc)if(e.has(o)){const c=e.get(o).texture;return t(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new Fp(c.height);return l.fromEquirectangularTexture(n,o),e.set(o,l),o.addEventListener("dispose",r),t(l.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const c=e.get(a);c!==void 0&&(e.delete(a),c.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}const ts=4,$u=[.125,.215,.35,.446,.526,.582],xr=20,Ja=new Md,qu=new _t;let Qa=null,ec=0,tc=0,nc=!1;const vr=(1+Math.sqrt(5))/2,Zr=1/vr,Xu=[new D(-vr,Zr,0),new D(vr,Zr,0),new D(-Zr,0,vr),new D(Zr,0,vr),new D(0,vr,-Zr),new D(0,vr,Zr),new D(-1,1,-1),new D(1,1,-1),new D(-1,1,1),new D(1,1,1)],xv=new D;class Yu{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,r=100,s={}){const{size:o=256,position:a=xv}=s;Qa=this._renderer.getRenderTarget(),ec=this._renderer.getActiveCubeFace(),tc=this._renderer.getActiveMipmapLevel(),nc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,i,r,c,a),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ku(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Zu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Qa,ec,tc),this._renderer.xr.enabled=nc,e.scissorTest=!1,Oo(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===us||e.mapping===hs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Qa=this._renderer.getRenderTarget(),ec=this._renderer.getActiveCubeFace(),tc=this._renderer.getActiveMipmapLevel(),nc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:si,minFilter:si,generateMipmaps:!1,type:Qs,format:oi,colorSpace:ds,depthBuffer:!1},r=ju(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ju(e,t,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=yv(s)),this._blurMaterial=bv(s,e,t)}return r}_compileMaterial(e){const t=new En(this._lodPlanes[0],e);this._renderer.compile(t,Ja)}_sceneToCubeUV(e,t,i,r,s){const c=new Yn(90,1,t,i),l=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,f=h.toneMapping;h.getClearColor(qu),h.toneMapping=Qi,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(r),h.clearDepth(),h.setRenderTarget(null));const v=new Xn({name:"PMREM.Background",side:Fn,depthWrite:!1,depthTest:!1}),m=new En(new Xt,v);let p=!1;const _=e.background;_?_.isColor&&(v.color.copy(_),e.background=null,p=!0):(v.color.copy(qu),p=!0);for(let x=0;x<6;x++){const y=x%3;y===0?(c.up.set(0,l[x],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x+u[x],s.y,s.z)):y===1?(c.up.set(0,0,l[x]),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y+u[x],s.z)):(c.up.set(0,l[x],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y,s.z+u[x]));const M=this._cubeSize;Oo(r,y*M,x>2?M:0,M,M),h.setRenderTarget(r),p&&h.render(m,c),h.render(e,c)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=f,h.autoClear=d,e.background=_}_textureToCubeUV(e,t){const i=this._renderer,r=e.mapping===us||e.mapping===hs;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ku()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Zu());const s=r?this._cubemapMaterial:this._equirectMaterial,o=new En(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=e;const c=this._cubeSize;Oo(t,0,0,3*c,2*c),i.setRenderTarget(t),i.render(o,Ja)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=Xu[(r-s-1)%Xu.length];this._blur(e,s-1,s,o,a)}t.autoClear=i}_blur(e,t,i,r,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,i,r,"latitudinal",s),this._halfBlur(o,e,i,i,r,"longitudinal",s)}_halfBlur(e,t,i,r,s,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new En(this._lodPlanes[r],l),d=l.uniforms,f=this._sizeLods[i]-1,g=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*xr-1),v=s/g,m=isFinite(s)?1+Math.floor(u*v):xr;m>xr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${xr}`);const p=[];let _=0;for(let A=0;A<xr;++A){const C=A/v,S=Math.exp(-C*C/2);p.push(S),A===0?_+=S:A<m&&(_+=2*S)}for(let A=0;A<p.length;A++)p[A]=p[A]/_;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:x}=this;d.dTheta.value=g,d.mipInt.value=x-i;const y=this._sizeLods[r],M=3*y*(r>x-ts?r-x+ts:0),w=4*(this._cubeSize-y);Oo(t,M,w,3*y,2*y),c.setRenderTarget(t),c.render(h,Ja)}}function yv(n){const e=[],t=[],i=[];let r=n;const s=n-ts+1+$u.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);t.push(a);let c=1/a;o>n-ts?c=$u[o-n+ts-1]:o===0&&(c=0),i.push(c);const l=1/(a-2),u=-l,h=1+l,d=[u,u,h,u,h,h,u,u,h,h,u,h],f=6,g=6,v=3,m=2,p=1,_=new Float32Array(v*g*f),x=new Float32Array(m*g*f),y=new Float32Array(p*g*f);for(let w=0;w<f;w++){const A=w%3*2/3-1,C=w>2?0:-1,S=[A,C,0,A+2/3,C,0,A+2/3,C+1,0,A,C,0,A+2/3,C+1,0,A,C+1,0];_.set(S,v*g*w),x.set(d,m*g*w);const E=[w,w,w,w,w,w];y.set(E,p*g*w)}const M=new an;M.setAttribute("position",new Kn(_,v)),M.setAttribute("uv",new Kn(x,m)),M.setAttribute("faceIndex",new Kn(y,p)),e.push(M),r>ts&&r--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function ju(n,e,t){const i=new Tr(n,e,t);return i.texture.mapping=ra,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Oo(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function bv(n,e,t){const i=new Float32Array(xr),r=new D(0,1,0);return new rr({name:"SphericalGaussianBlur",defines:{n:xr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Pl(),fragmentShader:`

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
		`,blending:Ji,depthTest:!1,depthWrite:!1})}function Zu(){return new rr({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Pl(),fragmentShader:`

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
		`,blending:Ji,depthTest:!1,depthWrite:!1})}function Ku(){return new rr({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Pl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ji,depthTest:!1,depthWrite:!1})}function Pl(){return`

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
	`}function Mv(n){let e=new WeakMap,t=null;function i(a){if(a&&a.isTexture){const c=a.mapping,l=c===_c||c===xc,u=c===us||c===hs;if(l||u){let h=e.get(a);const d=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return t===null&&(t=new Yu(n)),h=l?t.fromEquirectangular(a,h):t.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),h.texture;if(h!==void 0)return h.texture;{const f=a.image;return l&&f&&f.height>0||u&&f&&r(f)?(t===null&&(t=new Yu(n)),h=l?t.fromEquirectangular(a):t.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),a.addEventListener("dispose",s),h.texture):null}}}return a}function r(a){let c=0;const l=6;for(let u=0;u<l;u++)a[u]!==void 0&&c++;return c===l}function s(a){const c=a.target;c.removeEventListener("dispose",s);const l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:o}}function Sv(n){const e={};function t(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=n.getExtension(i)}return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const r=t(i);return r===null&&Xs("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function Ev(n,e,t,i){const r={},s=new WeakMap;function o(h){const d=h.target;d.index!==null&&e.remove(d.index);for(const g in d.attributes)e.remove(d.attributes[g]);d.removeEventListener("dispose",o),delete r[d.id];const f=s.get(d);f&&(e.remove(f),s.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function a(h,d){return r[d.id]===!0||(d.addEventListener("dispose",o),r[d.id]=!0,t.memory.geometries++),d}function c(h){const d=h.attributes;for(const f in d)e.update(d[f],n.ARRAY_BUFFER)}function l(h){const d=[],f=h.index,g=h.attributes.position;let v=0;if(f!==null){const _=f.array;v=f.version;for(let x=0,y=_.length;x<y;x+=3){const M=_[x+0],w=_[x+1],A=_[x+2];d.push(M,w,w,A,A,M)}}else if(g!==void 0){const _=g.array;v=g.version;for(let x=0,y=_.length/3-1;x<y;x+=3){const M=x+0,w=x+1,A=x+2;d.push(M,w,w,A,A,M)}}else return;const m=new(nd(d)?od:sd)(d,1);m.version=v;const p=s.get(h);p&&e.remove(p),s.set(h,m)}function u(h){const d=s.get(h);if(d){const f=h.index;f!==null&&d.version<f.version&&l(h)}else l(h);return s.get(h)}return{get:a,update:c,getWireframeAttribute:u}}function wv(n,e,t){let i;function r(d){i=d}let s,o;function a(d){s=d.type,o=d.bytesPerElement}function c(d,f){n.drawElements(i,f,s,d*o),t.update(f,i,1)}function l(d,f,g){g!==0&&(n.drawElementsInstanced(i,f,s,d*o,g),t.update(f,i,g))}function u(d,f,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,s,d,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];t.update(m,i,1)}function h(d,f,g,v){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)l(d[p]/o,f[p],v[p]);else{m.multiDrawElementsInstancedWEBGL(i,f,0,s,d,0,v,0,g);let p=0;for(let _=0;_<g;_++)p+=f[_]*v[_];t.update(p,i,1)}}this.setMode=r,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function Tv(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(s/3);break;case n.LINES:t.lines+=a*(s/2);break;case n.LINE_STRIP:t.lines+=a*(s-1);break;case n.LINE_LOOP:t.lines+=a*s;break;case n.POINTS:t.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function Av(n,e,t){const i=new WeakMap,r=new Kt;function s(o,a,c){const l=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0;let d=i.get(a);if(d===void 0||d.count!==h){let E=function(){C.dispose(),i.delete(a),a.removeEventListener("dispose",E)};var f=E;d!==void 0&&d.texture.dispose();const g=a.morphAttributes.position!==void 0,v=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],_=a.morphAttributes.normal||[],x=a.morphAttributes.color||[];let y=0;g===!0&&(y=1),v===!0&&(y=2),m===!0&&(y=3);let M=a.attributes.position.count*y,w=1;M>e.maxTextureSize&&(w=Math.ceil(M/e.maxTextureSize),M=e.maxTextureSize);const A=new Float32Array(M*w*4*h),C=new id(A,M,w,h);C.type=Ii,C.needsUpdate=!0;const S=y*4;for(let L=0;L<h;L++){const O=p[L],H=_[L],B=x[L],Y=M*w*4*L;for(let $=0;$<O.count;$++){const W=$*S;g===!0&&(r.fromBufferAttribute(O,$),A[Y+W+0]=r.x,A[Y+W+1]=r.y,A[Y+W+2]=r.z,A[Y+W+3]=0),v===!0&&(r.fromBufferAttribute(H,$),A[Y+W+4]=r.x,A[Y+W+5]=r.y,A[Y+W+6]=r.z,A[Y+W+7]=0),m===!0&&(r.fromBufferAttribute(B,$),A[Y+W+8]=r.x,A[Y+W+9]=r.y,A[Y+W+10]=r.z,A[Y+W+11]=B.itemSize===4?r.w:1)}}d={count:h,texture:C,size:new xe(M,w)},i.set(a,d),a.addEventListener("dispose",E)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const v=a.morphTargetsRelative?1:1-g;c.getUniforms().setValue(n,"morphTargetBaseInfluence",v),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",d.texture,t),c.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:s}}function Rv(n,e,t,i){let r=new WeakMap;function s(c){const l=i.render.frame,u=c.geometry,h=e.get(c,u);if(r.get(h)!==l&&(e.update(h),r.set(h,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),r.get(c)!==l&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),r.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;r.get(d)!==l&&(d.update(),r.set(d,l))}return h}function o(){r=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:s,dispose:o}}const Ed=new Dn,Ju=new ud(1,1),wd=new id,Td=new yp,Ad=new ld,Qu=[],eh=[],th=new Float32Array(16),nh=new Float32Array(9),ih=new Float32Array(4);function gs(n,e,t){const i=n[0];if(i<=0||i>0)return n;const r=e*t;let s=Qu[r];if(s===void 0&&(s=new Float32Array(r),Qu[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(s,a)}return s}function cn(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function ln(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function aa(n,e){let t=eh[e];t===void 0&&(t=new Int32Array(e),eh[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function Cv(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function Pv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(cn(t,e))return;n.uniform2fv(this.addr,e),ln(t,e)}}function Lv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(cn(t,e))return;n.uniform3fv(this.addr,e),ln(t,e)}}function Dv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(cn(t,e))return;n.uniform4fv(this.addr,e),ln(t,e)}}function Iv(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(cn(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),ln(t,e)}else{if(cn(t,i))return;ih.set(i),n.uniformMatrix2fv(this.addr,!1,ih),ln(t,i)}}function Uv(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(cn(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),ln(t,e)}else{if(cn(t,i))return;nh.set(i),n.uniformMatrix3fv(this.addr,!1,nh),ln(t,i)}}function Nv(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(cn(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),ln(t,e)}else{if(cn(t,i))return;th.set(i),n.uniformMatrix4fv(this.addr,!1,th),ln(t,i)}}function Ov(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function Fv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(cn(t,e))return;n.uniform2iv(this.addr,e),ln(t,e)}}function kv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(cn(t,e))return;n.uniform3iv(this.addr,e),ln(t,e)}}function zv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(cn(t,e))return;n.uniform4iv(this.addr,e),ln(t,e)}}function Bv(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function Vv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(cn(t,e))return;n.uniform2uiv(this.addr,e),ln(t,e)}}function Hv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(cn(t,e))return;n.uniform3uiv(this.addr,e),ln(t,e)}}function Gv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(cn(t,e))return;n.uniform4uiv(this.addr,e),ln(t,e)}}function Wv(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let s;this.type===n.SAMPLER_2D_SHADOW?(Ju.compareFunction=td,s=Ju):s=Ed,t.setTexture2D(e||s,r)}function $v(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||Td,r)}function qv(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||Ad,r)}function Xv(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||wd,r)}function Yv(n){switch(n){case 5126:return Cv;case 35664:return Pv;case 35665:return Lv;case 35666:return Dv;case 35674:return Iv;case 35675:return Uv;case 35676:return Nv;case 5124:case 35670:return Ov;case 35667:case 35671:return Fv;case 35668:case 35672:return kv;case 35669:case 35673:return zv;case 5125:return Bv;case 36294:return Vv;case 36295:return Hv;case 36296:return Gv;case 35678:case 36198:case 36298:case 36306:case 35682:return Wv;case 35679:case 36299:case 36307:return $v;case 35680:case 36300:case 36308:case 36293:return qv;case 36289:case 36303:case 36311:case 36292:return Xv}}function jv(n,e){n.uniform1fv(this.addr,e)}function Zv(n,e){const t=gs(e,this.size,2);n.uniform2fv(this.addr,t)}function Kv(n,e){const t=gs(e,this.size,3);n.uniform3fv(this.addr,t)}function Jv(n,e){const t=gs(e,this.size,4);n.uniform4fv(this.addr,t)}function Qv(n,e){const t=gs(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function e_(n,e){const t=gs(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function t_(n,e){const t=gs(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function n_(n,e){n.uniform1iv(this.addr,e)}function i_(n,e){n.uniform2iv(this.addr,e)}function r_(n,e){n.uniform3iv(this.addr,e)}function s_(n,e){n.uniform4iv(this.addr,e)}function o_(n,e){n.uniform1uiv(this.addr,e)}function a_(n,e){n.uniform2uiv(this.addr,e)}function c_(n,e){n.uniform3uiv(this.addr,e)}function l_(n,e){n.uniform4uiv(this.addr,e)}function u_(n,e,t){const i=this.cache,r=e.length,s=aa(t,r);cn(i,s)||(n.uniform1iv(this.addr,s),ln(i,s));for(let o=0;o!==r;++o)t.setTexture2D(e[o]||Ed,s[o])}function h_(n,e,t){const i=this.cache,r=e.length,s=aa(t,r);cn(i,s)||(n.uniform1iv(this.addr,s),ln(i,s));for(let o=0;o!==r;++o)t.setTexture3D(e[o]||Td,s[o])}function d_(n,e,t){const i=this.cache,r=e.length,s=aa(t,r);cn(i,s)||(n.uniform1iv(this.addr,s),ln(i,s));for(let o=0;o!==r;++o)t.setTextureCube(e[o]||Ad,s[o])}function f_(n,e,t){const i=this.cache,r=e.length,s=aa(t,r);cn(i,s)||(n.uniform1iv(this.addr,s),ln(i,s));for(let o=0;o!==r;++o)t.setTexture2DArray(e[o]||wd,s[o])}function p_(n){switch(n){case 5126:return jv;case 35664:return Zv;case 35665:return Kv;case 35666:return Jv;case 35674:return Qv;case 35675:return e_;case 35676:return t_;case 5124:case 35670:return n_;case 35667:case 35671:return i_;case 35668:case 35672:return r_;case 35669:case 35673:return s_;case 5125:return o_;case 36294:return a_;case 36295:return c_;case 36296:return l_;case 35678:case 36198:case 36298:case 36306:case 35682:return u_;case 35679:case 36299:case 36307:return h_;case 35680:case 36300:case 36308:case 36293:return d_;case 36289:case 36303:case 36311:case 36292:return f_}}class m_{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Yv(t.type)}}class g_{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=p_(t.type)}}class v_{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(e,t[a.id],i)}}}const ic=/(\w+)(\])?(\[|\.)?/g;function rh(n,e){n.seq.push(e),n.map[e.id]=e}function __(n,e,t){const i=n.name,r=i.length;for(ic.lastIndex=0;;){const s=ic.exec(i),o=ic.lastIndex;let a=s[1];const c=s[2]==="]",l=s[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===r){rh(t,l===void 0?new m_(a,n,e):new g_(a,n,e));break}else{let h=t.map[a];h===void 0&&(h=new v_(a),rh(t,h)),t=h}}}class Go{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(t,r),o=e.getUniformLocation(t,s.name);__(s,o,this)}}setValue(e,t,i,r){const s=this.map[t];s!==void 0&&s.setValue(e,i,r)}setOptional(e,t,i){const r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let s=0,o=t.length;s!==o;++s){const a=t[s],c=i[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,r)}}static seqWithValue(e,t){const i=[];for(let r=0,s=e.length;r!==s;++r){const o=e[r];o.id in t&&i.push(o)}return i}}function sh(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const x_=37297;let y_=0;function b_(n,e){const t=n.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let o=r;o<s;o++){const a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}const oh=new ot;function M_(n){wt._getMatrix(oh,wt.workingColorSpace,n);const e=`mat3( ${oh.elements.map(t=>t.toFixed(4))} )`;switch(wt.getTransfer(n)){case $o:return[e,"LinearTransferOETF"];case It:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function ah(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),s=(n.getShaderInfoLog(e)||"").trim();if(i&&s==="")return"";const o=/ERROR: 0:(\d+)/.exec(s);if(o){const a=parseInt(o[1]);return t.toUpperCase()+`

`+s+`

`+b_(n.getShaderSource(e),a)}else return s}function S_(n,e){const t=M_(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function E_(n,e){let t;switch(e){case Uf:t="Linear";break;case Nf:t="Reinhard";break;case Of:t="Cineon";break;case Wh:t="ACESFilmic";break;case kf:t="AgX";break;case zf:t="Neutral";break;case Ff:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Fo=new D;function w_(){wt.getLuminanceCoefficients(Fo);const n=Fo.x.toFixed(4),e=Fo.y.toFixed(4),t=Fo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function T_(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Us).join(`
`)}function A_(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function R_(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=n.getActiveAttrib(e,r),o=s.name;let a=1;s.type===n.FLOAT_MAT2&&(a=2),s.type===n.FLOAT_MAT3&&(a=3),s.type===n.FLOAT_MAT4&&(a=4),t[o]={type:s.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function Us(n){return n!==""}function ch(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function lh(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const C_=/^[ \t]*#include +<([\w\d./]+)>/gm;function tl(n){return n.replace(C_,L_)}const P_=new Map;function L_(n,e){let t=ht[e];if(t===void 0){const i=P_.get(e);if(i!==void 0)t=ht[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return tl(t)}const D_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function uh(n){return n.replace(D_,I_)}function I_(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function hh(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}function U_(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Vh?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===Hh?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Ri&&(e="SHADOWMAP_TYPE_VSM"),e}function N_(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case us:case hs:e="ENVMAP_TYPE_CUBE";break;case ra:e="ENVMAP_TYPE_CUBE_UV";break}return e}function O_(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case hs:e="ENVMAP_MODE_REFRACTION";break}return e}function F_(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Gh:e="ENVMAP_BLENDING_MULTIPLY";break;case Df:e="ENVMAP_BLENDING_MIX";break;case If:e="ENVMAP_BLENDING_ADD";break}return e}function k_(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function z_(n,e,t,i){const r=n.getContext(),s=t.defines;let o=t.vertexShader,a=t.fragmentShader;const c=U_(t),l=N_(t),u=O_(t),h=F_(t),d=k_(t),f=T_(t),g=A_(s),v=r.createProgram();let m,p,_=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Us).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Us).join(`
`),p.length>0&&(p+=`
`)):(m=[hh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Us).join(`
`),p=[hh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Qi?"#define TONE_MAPPING":"",t.toneMapping!==Qi?ht.tonemapping_pars_fragment:"",t.toneMapping!==Qi?E_("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",ht.colorspace_pars_fragment,S_("linearToOutputTexel",t.outputColorSpace),w_(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Us).join(`
`)),o=tl(o),o=ch(o,t),o=lh(o,t),a=tl(a),a=ch(a,t),a=lh(a,t),o=uh(o),a=uh(a),t.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===uu?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===uu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const x=_+m+o,y=_+p+a,M=sh(r,r.VERTEX_SHADER,x),w=sh(r,r.FRAGMENT_SHADER,y);r.attachShader(v,M),r.attachShader(v,w),t.index0AttributeName!==void 0?r.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(v,0,"position"),r.linkProgram(v);function A(L){if(n.debug.checkShaderErrors){const O=r.getProgramInfoLog(v)||"",H=r.getShaderInfoLog(M)||"",B=r.getShaderInfoLog(w)||"",Y=O.trim(),$=H.trim(),W=B.trim();let I=!0,le=!0;if(r.getProgramParameter(v,r.LINK_STATUS)===!1)if(I=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,v,M,w);else{const oe=ah(r,M,"vertex"),K=ah(r,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(v,r.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+Y+`
`+oe+`
`+K)}else Y!==""?console.warn("THREE.WebGLProgram: Program Info Log:",Y):($===""||W==="")&&(le=!1);le&&(L.diagnostics={runnable:I,programLog:Y,vertexShader:{log:$,prefix:m},fragmentShader:{log:W,prefix:p}})}r.deleteShader(M),r.deleteShader(w),C=new Go(r,v),S=R_(r,v)}let C;this.getUniforms=function(){return C===void 0&&A(this),C};let S;this.getAttributes=function(){return S===void 0&&A(this),S};let E=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=r.getProgramParameter(v,x_)),E},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=y_++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=M,this.fragmentShader=w,this}let B_=0;class V_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new H_(e),t.set(e,i)),i}}class H_{constructor(e){this.id=B_++,this.code=e,this.usedTimes=0}}function G_(n,e,t,i,r,s,o){const a=new xl,c=new V_,l=new Set,u=[],h=r.logarithmicDepthBuffer,d=r.vertexTextures;let f=r.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(S){return l.add(S),S===0?"uv":`uv${S}`}function m(S,E,L,O,H){const B=O.fog,Y=H.geometry,$=S.isMeshStandardMaterial?O.environment:null,W=(S.isMeshStandardMaterial?t:e).get(S.envMap||$),I=W&&W.mapping===ra?W.image.height:null,le=g[S.type];S.precision!==null&&(f=r.getMaxPrecision(S.precision),f!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",f,"instead."));const oe=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,K=oe!==void 0?oe.length:0;let Ie=0;Y.morphAttributes.position!==void 0&&(Ie=1),Y.morphAttributes.normal!==void 0&&(Ie=2),Y.morphAttributes.color!==void 0&&(Ie=3);let et,Ue,ct,te;if(le){const dt=di[le];et=dt.vertexShader,Ue=dt.fragmentShader}else et=S.vertexShader,Ue=S.fragmentShader,c.update(S),ct=c.getVertexShaderID(S),te=c.getFragmentShaderID(S);const he=n.getRenderTarget(),Te=n.state.buffers.depth.getReversed(),qe=H.isInstancedMesh===!0,Ve=H.isBatchedMesh===!0,rt=!!S.map,Tt=!!S.matcap,k=!!W,me=!!S.aoMap,de=!!S.lightMap,se=!!S.bumpMap,ce=!!S.normalMap,Ee=!!S.displacementMap,pe=!!S.emissiveMap,Me=!!S.metalnessMap,Qe=!!S.roughnessMap,tt=S.anisotropy>0,U=S.clearcoat>0,T=S.dispersion>0,j=S.iridescence>0,ee=S.sheen>0,fe=S.transmission>0,ne=tt&&!!S.anisotropyMap,Ne=U&&!!S.clearcoatMap,ye=U&&!!S.clearcoatNormalMap,Ge=U&&!!S.clearcoatRoughnessMap,ze=j&&!!S.iridescenceMap,Z=j&&!!S.iridescenceThicknessMap,Re=ee&&!!S.sheenColorMap,Ke=ee&&!!S.sheenRoughnessMap,Xe=!!S.specularMap,Ae=!!S.specularColorMap,Ye=!!S.specularIntensityMap,G=fe&&!!S.transmissionMap,_e=fe&&!!S.thicknessMap,Se=!!S.gradientMap,De=!!S.alphaMap,ge=S.alphaTest>0,ue=!!S.alphaHash,We=!!S.extensions;let Je=Qi;S.toneMapped&&(he===null||he.isXRRenderTarget===!0)&&(Je=n.toneMapping);const At={shaderID:le,shaderType:S.type,shaderName:S.name,vertexShader:et,fragmentShader:Ue,defines:S.defines,customVertexShaderID:ct,customFragmentShaderID:te,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:f,batching:Ve,batchingColor:Ve&&H._colorsTexture!==null,instancing:qe,instancingColor:qe&&H.instanceColor!==null,instancingMorph:qe&&H.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:he===null?n.outputColorSpace:he.isXRRenderTarget===!0?he.texture.colorSpace:ds,alphaToCoverage:!!S.alphaToCoverage,map:rt,matcap:Tt,envMap:k,envMapMode:k&&W.mapping,envMapCubeUVHeight:I,aoMap:me,lightMap:de,bumpMap:se,normalMap:ce,displacementMap:d&&Ee,emissiveMap:pe,normalMapObjectSpace:ce&&S.normalMapType===Gf,normalMapTangentSpace:ce&&S.normalMapType===ed,metalnessMap:Me,roughnessMap:Qe,anisotropy:tt,anisotropyMap:ne,clearcoat:U,clearcoatMap:Ne,clearcoatNormalMap:ye,clearcoatRoughnessMap:Ge,dispersion:T,iridescence:j,iridescenceMap:ze,iridescenceThicknessMap:Z,sheen:ee,sheenColorMap:Re,sheenRoughnessMap:Ke,specularMap:Xe,specularColorMap:Ae,specularIntensityMap:Ye,transmission:fe,transmissionMap:G,thicknessMap:_e,gradientMap:Se,opaque:S.transparent===!1&&S.blending===is&&S.alphaToCoverage===!1,alphaMap:De,alphaTest:ge,alphaHash:ue,combine:S.combine,mapUv:rt&&v(S.map.channel),aoMapUv:me&&v(S.aoMap.channel),lightMapUv:de&&v(S.lightMap.channel),bumpMapUv:se&&v(S.bumpMap.channel),normalMapUv:ce&&v(S.normalMap.channel),displacementMapUv:Ee&&v(S.displacementMap.channel),emissiveMapUv:pe&&v(S.emissiveMap.channel),metalnessMapUv:Me&&v(S.metalnessMap.channel),roughnessMapUv:Qe&&v(S.roughnessMap.channel),anisotropyMapUv:ne&&v(S.anisotropyMap.channel),clearcoatMapUv:Ne&&v(S.clearcoatMap.channel),clearcoatNormalMapUv:ye&&v(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ge&&v(S.clearcoatRoughnessMap.channel),iridescenceMapUv:ze&&v(S.iridescenceMap.channel),iridescenceThicknessMapUv:Z&&v(S.iridescenceThicknessMap.channel),sheenColorMapUv:Re&&v(S.sheenColorMap.channel),sheenRoughnessMapUv:Ke&&v(S.sheenRoughnessMap.channel),specularMapUv:Xe&&v(S.specularMap.channel),specularColorMapUv:Ae&&v(S.specularColorMap.channel),specularIntensityMapUv:Ye&&v(S.specularIntensityMap.channel),transmissionMapUv:G&&v(S.transmissionMap.channel),thicknessMapUv:_e&&v(S.thicknessMap.channel),alphaMapUv:De&&v(S.alphaMap.channel),vertexTangents:!!Y.attributes.tangent&&(ce||tt),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,pointsUvs:H.isPoints===!0&&!!Y.attributes.uv&&(rt||De),fog:!!B,useFog:S.fog===!0,fogExp2:!!B&&B.isFogExp2,flatShading:S.flatShading===!0&&S.wireframe===!1,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:Te,skinning:H.isSkinnedMesh===!0,morphTargets:Y.morphAttributes.position!==void 0,morphNormals:Y.morphAttributes.normal!==void 0,morphColors:Y.morphAttributes.color!==void 0,morphTargetsCount:K,morphTextureStride:Ie,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:S.dithering,shadowMapEnabled:n.shadowMap.enabled&&L.length>0,shadowMapType:n.shadowMap.type,toneMapping:Je,decodeVideoTexture:rt&&S.map.isVideoTexture===!0&&wt.getTransfer(S.map.colorSpace)===It,decodeVideoTextureEmissive:pe&&S.emissiveMap.isVideoTexture===!0&&wt.getTransfer(S.emissiveMap.colorSpace)===It,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===pi,flipSided:S.side===Fn,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:We&&S.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(We&&S.extensions.multiDraw===!0||Ve)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return At.vertexUv1s=l.has(1),At.vertexUv2s=l.has(2),At.vertexUv3s=l.has(3),l.clear(),At}function p(S){const E=[];if(S.shaderID?E.push(S.shaderID):(E.push(S.customVertexShaderID),E.push(S.customFragmentShaderID)),S.defines!==void 0)for(const L in S.defines)E.push(L),E.push(S.defines[L]);return S.isRawShaderMaterial===!1&&(_(E,S),x(E,S),E.push(n.outputColorSpace)),E.push(S.customProgramCacheKey),E.join()}function _(S,E){S.push(E.precision),S.push(E.outputColorSpace),S.push(E.envMapMode),S.push(E.envMapCubeUVHeight),S.push(E.mapUv),S.push(E.alphaMapUv),S.push(E.lightMapUv),S.push(E.aoMapUv),S.push(E.bumpMapUv),S.push(E.normalMapUv),S.push(E.displacementMapUv),S.push(E.emissiveMapUv),S.push(E.metalnessMapUv),S.push(E.roughnessMapUv),S.push(E.anisotropyMapUv),S.push(E.clearcoatMapUv),S.push(E.clearcoatNormalMapUv),S.push(E.clearcoatRoughnessMapUv),S.push(E.iridescenceMapUv),S.push(E.iridescenceThicknessMapUv),S.push(E.sheenColorMapUv),S.push(E.sheenRoughnessMapUv),S.push(E.specularMapUv),S.push(E.specularColorMapUv),S.push(E.specularIntensityMapUv),S.push(E.transmissionMapUv),S.push(E.thicknessMapUv),S.push(E.combine),S.push(E.fogExp2),S.push(E.sizeAttenuation),S.push(E.morphTargetsCount),S.push(E.morphAttributeCount),S.push(E.numDirLights),S.push(E.numPointLights),S.push(E.numSpotLights),S.push(E.numSpotLightMaps),S.push(E.numHemiLights),S.push(E.numRectAreaLights),S.push(E.numDirLightShadows),S.push(E.numPointLightShadows),S.push(E.numSpotLightShadows),S.push(E.numSpotLightShadowsWithMaps),S.push(E.numLightProbes),S.push(E.shadowMapType),S.push(E.toneMapping),S.push(E.numClippingPlanes),S.push(E.numClipIntersection),S.push(E.depthPacking)}function x(S,E){a.disableAll(),E.supportsVertexTextures&&a.enable(0),E.instancing&&a.enable(1),E.instancingColor&&a.enable(2),E.instancingMorph&&a.enable(3),E.matcap&&a.enable(4),E.envMap&&a.enable(5),E.normalMapObjectSpace&&a.enable(6),E.normalMapTangentSpace&&a.enable(7),E.clearcoat&&a.enable(8),E.iridescence&&a.enable(9),E.alphaTest&&a.enable(10),E.vertexColors&&a.enable(11),E.vertexAlphas&&a.enable(12),E.vertexUv1s&&a.enable(13),E.vertexUv2s&&a.enable(14),E.vertexUv3s&&a.enable(15),E.vertexTangents&&a.enable(16),E.anisotropy&&a.enable(17),E.alphaHash&&a.enable(18),E.batching&&a.enable(19),E.dispersion&&a.enable(20),E.batchingColor&&a.enable(21),E.gradientMap&&a.enable(22),S.push(a.mask),a.disableAll(),E.fog&&a.enable(0),E.useFog&&a.enable(1),E.flatShading&&a.enable(2),E.logarithmicDepthBuffer&&a.enable(3),E.reversedDepthBuffer&&a.enable(4),E.skinning&&a.enable(5),E.morphTargets&&a.enable(6),E.morphNormals&&a.enable(7),E.morphColors&&a.enable(8),E.premultipliedAlpha&&a.enable(9),E.shadowMapEnabled&&a.enable(10),E.doubleSided&&a.enable(11),E.flipSided&&a.enable(12),E.useDepthPacking&&a.enable(13),E.dithering&&a.enable(14),E.transmission&&a.enable(15),E.sheen&&a.enable(16),E.opaque&&a.enable(17),E.pointsUvs&&a.enable(18),E.decodeVideoTexture&&a.enable(19),E.decodeVideoTextureEmissive&&a.enable(20),E.alphaToCoverage&&a.enable(21),S.push(a.mask)}function y(S){const E=g[S.type];let L;if(E){const O=di[E];L=Ip.clone(O.uniforms)}else L=S.uniforms;return L}function M(S,E){let L;for(let O=0,H=u.length;O<H;O++){const B=u[O];if(B.cacheKey===E){L=B,++L.usedTimes;break}}return L===void 0&&(L=new z_(n,E,S,s),u.push(L)),L}function w(S){if(--S.usedTimes===0){const E=u.indexOf(S);u[E]=u[u.length-1],u.pop(),S.destroy()}}function A(S){c.remove(S)}function C(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:y,acquireProgram:M,releaseProgram:w,releaseShaderCache:A,programs:u,dispose:C}}function W_(){let n=new WeakMap;function e(o){return n.has(o)}function t(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function r(o,a,c){n.get(o)[a]=c}function s(){n=new WeakMap}return{has:e,get:t,remove:i,update:r,dispose:s}}function $_(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function dh(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function fh(){const n=[];let e=0;const t=[],i=[],r=[];function s(){e=0,t.length=0,i.length=0,r.length=0}function o(h,d,f,g,v,m){let p=n[e];return p===void 0?(p={id:h.id,object:h,geometry:d,material:f,groupOrder:g,renderOrder:h.renderOrder,z:v,group:m},n[e]=p):(p.id=h.id,p.object=h,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=h.renderOrder,p.z=v,p.group=m),e++,p}function a(h,d,f,g,v,m){const p=o(h,d,f,g,v,m);f.transmission>0?i.push(p):f.transparent===!0?r.push(p):t.push(p)}function c(h,d,f,g,v,m){const p=o(h,d,f,g,v,m);f.transmission>0?i.unshift(p):f.transparent===!0?r.unshift(p):t.unshift(p)}function l(h,d){t.length>1&&t.sort(h||$_),i.length>1&&i.sort(d||dh),r.length>1&&r.sort(d||dh)}function u(){for(let h=e,d=n.length;h<d;h++){const f=n[h];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:i,transparent:r,init:s,push:a,unshift:c,finish:u,sort:l}}function q_(){let n=new WeakMap;function e(i,r){const s=n.get(i);let o;return s===void 0?(o=new fh,n.set(i,[o])):r>=s.length?(o=new fh,s.push(o)):o=s[r],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function X_(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new D,color:new _t};break;case"SpotLight":t={position:new D,direction:new D,color:new _t,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new D,color:new _t,distance:0,decay:0};break;case"HemisphereLight":t={direction:new D,skyColor:new _t,groundColor:new _t};break;case"RectAreaLight":t={color:new _t,position:new D,halfWidth:new D,halfHeight:new D};break}return n[e.id]=t,t}}}function Y_(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xe,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let j_=0;function Z_(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function K_(n){const e=new X_,t=Y_(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new D);const r=new D,s=new Vt,o=new Vt;function a(l){let u=0,h=0,d=0;for(let S=0;S<9;S++)i.probe[S].set(0,0,0);let f=0,g=0,v=0,m=0,p=0,_=0,x=0,y=0,M=0,w=0,A=0;l.sort(Z_);for(let S=0,E=l.length;S<E;S++){const L=l[S],O=L.color,H=L.intensity,B=L.distance,Y=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)u+=O.r*H,h+=O.g*H,d+=O.b*H;else if(L.isLightProbe){for(let $=0;$<9;$++)i.probe[$].addScaledVector(L.sh.coefficients[$],H);A++}else if(L.isDirectionalLight){const $=e.get(L);if($.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const W=L.shadow,I=t.get(L);I.shadowIntensity=W.intensity,I.shadowBias=W.bias,I.shadowNormalBias=W.normalBias,I.shadowRadius=W.radius,I.shadowMapSize=W.mapSize,i.directionalShadow[f]=I,i.directionalShadowMap[f]=Y,i.directionalShadowMatrix[f]=L.shadow.matrix,_++}i.directional[f]=$,f++}else if(L.isSpotLight){const $=e.get(L);$.position.setFromMatrixPosition(L.matrixWorld),$.color.copy(O).multiplyScalar(H),$.distance=B,$.coneCos=Math.cos(L.angle),$.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),$.decay=L.decay,i.spot[v]=$;const W=L.shadow;if(L.map&&(i.spotLightMap[M]=L.map,M++,W.updateMatrices(L),L.castShadow&&w++),i.spotLightMatrix[v]=W.matrix,L.castShadow){const I=t.get(L);I.shadowIntensity=W.intensity,I.shadowBias=W.bias,I.shadowNormalBias=W.normalBias,I.shadowRadius=W.radius,I.shadowMapSize=W.mapSize,i.spotShadow[v]=I,i.spotShadowMap[v]=Y,y++}v++}else if(L.isRectAreaLight){const $=e.get(L);$.color.copy(O).multiplyScalar(H),$.halfWidth.set(L.width*.5,0,0),$.halfHeight.set(0,L.height*.5,0),i.rectArea[m]=$,m++}else if(L.isPointLight){const $=e.get(L);if($.color.copy(L.color).multiplyScalar(L.intensity),$.distance=L.distance,$.decay=L.decay,L.castShadow){const W=L.shadow,I=t.get(L);I.shadowIntensity=W.intensity,I.shadowBias=W.bias,I.shadowNormalBias=W.normalBias,I.shadowRadius=W.radius,I.shadowMapSize=W.mapSize,I.shadowCameraNear=W.camera.near,I.shadowCameraFar=W.camera.far,i.pointShadow[g]=I,i.pointShadowMap[g]=Y,i.pointShadowMatrix[g]=L.shadow.matrix,x++}i.point[g]=$,g++}else if(L.isHemisphereLight){const $=e.get(L);$.skyColor.copy(L.color).multiplyScalar(H),$.groundColor.copy(L.groundColor).multiplyScalar(H),i.hemi[p]=$,p++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Pe.LTC_FLOAT_1,i.rectAreaLTC2=Pe.LTC_FLOAT_2):(i.rectAreaLTC1=Pe.LTC_HALF_1,i.rectAreaLTC2=Pe.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=h,i.ambient[2]=d;const C=i.hash;(C.directionalLength!==f||C.pointLength!==g||C.spotLength!==v||C.rectAreaLength!==m||C.hemiLength!==p||C.numDirectionalShadows!==_||C.numPointShadows!==x||C.numSpotShadows!==y||C.numSpotMaps!==M||C.numLightProbes!==A)&&(i.directional.length=f,i.spot.length=v,i.rectArea.length=m,i.point.length=g,i.hemi.length=p,i.directionalShadow.length=_,i.directionalShadowMap.length=_,i.pointShadow.length=x,i.pointShadowMap.length=x,i.spotShadow.length=y,i.spotShadowMap.length=y,i.directionalShadowMatrix.length=_,i.pointShadowMatrix.length=x,i.spotLightMatrix.length=y+M-w,i.spotLightMap.length=M,i.numSpotLightShadowsWithMaps=w,i.numLightProbes=A,C.directionalLength=f,C.pointLength=g,C.spotLength=v,C.rectAreaLength=m,C.hemiLength=p,C.numDirectionalShadows=_,C.numPointShadows=x,C.numSpotShadows=y,C.numSpotMaps=M,C.numLightProbes=A,i.version=j_++)}function c(l,u){let h=0,d=0,f=0,g=0,v=0;const m=u.matrixWorldInverse;for(let p=0,_=l.length;p<_;p++){const x=l[p];if(x.isDirectionalLight){const y=i.directional[h];y.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),y.direction.sub(r),y.direction.transformDirection(m),h++}else if(x.isSpotLight){const y=i.spot[f];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),y.direction.sub(r),y.direction.transformDirection(m),f++}else if(x.isRectAreaLight){const y=i.rectArea[g];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(m),o.identity(),s.copy(x.matrixWorld),s.premultiply(m),o.extractRotation(s),y.halfWidth.set(x.width*.5,0,0),y.halfHeight.set(0,x.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),g++}else if(x.isPointLight){const y=i.point[d];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(m),d++}else if(x.isHemisphereLight){const y=i.hemi[v];y.direction.setFromMatrixPosition(x.matrixWorld),y.direction.transformDirection(m),v++}}}return{setup:a,setupView:c,state:i}}function ph(n){const e=new K_(n),t=[],i=[];function r(u){l.camera=u,t.length=0,i.length=0}function s(u){t.push(u)}function o(u){i.push(u)}function a(){e.setup(t)}function c(u){e.setupView(t,u)}const l={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:l,setupLights:a,setupLightsView:c,pushLight:s,pushShadow:o}}function J_(n){let e=new WeakMap;function t(r,s=0){const o=e.get(r);let a;return o===void 0?(a=new ph(n),e.set(r,[a])):s>=o.length?(a=new ph(n),o.push(a)):a=o[s],a}function i(){e=new WeakMap}return{get:t,dispose:i}}const Q_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,ex=`uniform sampler2D shadow_pass;
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
}`;function tx(n,e,t){let i=new bl;const r=new xe,s=new xe,o=new Kt,a=new Mm({depthPacking:Hf}),c=new Sm,l={},u=t.maxTextureSize,h={[ir]:Fn,[Fn]:ir,[pi]:pi},d=new rr({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new xe},radius:{value:4}},vertexShader:Q_,fragmentShader:ex}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new an;g.setAttribute("position",new Kn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new En(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Vh;let p=this.type;this.render=function(w,A,C){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;const S=n.getRenderTarget(),E=n.getActiveCubeFace(),L=n.getActiveMipmapLevel(),O=n.state;O.setBlending(Ji),O.buffers.depth.getReversed()===!0?O.buffers.color.setClear(0,0,0,0):O.buffers.color.setClear(1,1,1,1),O.buffers.depth.setTest(!0),O.setScissorTest(!1);const H=p!==Ri&&this.type===Ri,B=p===Ri&&this.type!==Ri;for(let Y=0,$=w.length;Y<$;Y++){const W=w[Y],I=W.shadow;if(I===void 0){console.warn("THREE.WebGLShadowMap:",W,"has no shadow.");continue}if(I.autoUpdate===!1&&I.needsUpdate===!1)continue;r.copy(I.mapSize);const le=I.getFrameExtents();if(r.multiply(le),s.copy(I.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/le.x),r.x=s.x*le.x,I.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/le.y),r.y=s.y*le.y,I.mapSize.y=s.y)),I.map===null||H===!0||B===!0){const K=this.type!==Ri?{minFilter:ci,magFilter:ci}:{};I.map!==null&&I.map.dispose(),I.map=new Tr(r.x,r.y,K),I.map.texture.name=W.name+".shadowMap",I.camera.updateProjectionMatrix()}n.setRenderTarget(I.map),n.clear();const oe=I.getViewportCount();for(let K=0;K<oe;K++){const Ie=I.getViewport(K);o.set(s.x*Ie.x,s.y*Ie.y,s.x*Ie.z,s.y*Ie.w),O.viewport(o),I.updateMatrices(W,K),i=I.getFrustum(),y(A,C,I.camera,W,this.type)}I.isPointLightShadow!==!0&&this.type===Ri&&_(I,C),I.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(S,E,L)};function _(w,A){const C=e.update(v);d.defines.VSM_SAMPLES!==w.blurSamples&&(d.defines.VSM_SAMPLES=w.blurSamples,f.defines.VSM_SAMPLES=w.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new Tr(r.x,r.y)),d.uniforms.shadow_pass.value=w.map.texture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,n.setRenderTarget(w.mapPass),n.clear(),n.renderBufferDirect(A,null,C,d,v,null),f.uniforms.shadow_pass.value=w.mapPass.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,n.setRenderTarget(w.map),n.clear(),n.renderBufferDirect(A,null,C,f,v,null)}function x(w,A,C,S){let E=null;const L=C.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(L!==void 0)E=L;else if(E=C.isPointLight===!0?c:a,n.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){const O=E.uuid,H=A.uuid;let B=l[O];B===void 0&&(B={},l[O]=B);let Y=B[H];Y===void 0&&(Y=E.clone(),B[H]=Y,A.addEventListener("dispose",M)),E=Y}if(E.visible=A.visible,E.wireframe=A.wireframe,S===Ri?E.side=A.shadowSide!==null?A.shadowSide:A.side:E.side=A.shadowSide!==null?A.shadowSide:h[A.side],E.alphaMap=A.alphaMap,E.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,E.map=A.map,E.clipShadows=A.clipShadows,E.clippingPlanes=A.clippingPlanes,E.clipIntersection=A.clipIntersection,E.displacementMap=A.displacementMap,E.displacementScale=A.displacementScale,E.displacementBias=A.displacementBias,E.wireframeLinewidth=A.wireframeLinewidth,E.linewidth=A.linewidth,C.isPointLight===!0&&E.isMeshDistanceMaterial===!0){const O=n.properties.get(E);O.light=C}return E}function y(w,A,C,S,E){if(w.visible===!1)return;if(w.layers.test(A.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&E===Ri)&&(!w.frustumCulled||i.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,w.matrixWorld);const H=e.update(w),B=w.material;if(Array.isArray(B)){const Y=H.groups;for(let $=0,W=Y.length;$<W;$++){const I=Y[$],le=B[I.materialIndex];if(le&&le.visible){const oe=x(w,le,S,E);w.onBeforeShadow(n,w,A,C,H,oe,I),n.renderBufferDirect(C,null,H,oe,w,I),w.onAfterShadow(n,w,A,C,H,oe,I)}}}else if(B.visible){const Y=x(w,B,S,E);w.onBeforeShadow(n,w,A,C,H,Y,null),n.renderBufferDirect(C,null,H,Y,w,null),w.onAfterShadow(n,w,A,C,H,Y,null)}}const O=w.children;for(let H=0,B=O.length;H<B;H++)y(O[H],A,C,S,E)}function M(w){w.target.removeEventListener("dispose",M);for(const C in l){const S=l[C],E=w.target.uuid;E in S&&(S[E].dispose(),delete S[E])}}}const nx={[hc]:dc,[fc]:gc,[pc]:vc,[ls]:mc,[dc]:hc,[gc]:fc,[vc]:pc,[mc]:ls};function ix(n,e){function t(){let G=!1;const _e=new Kt;let Se=null;const De=new Kt(0,0,0,0);return{setMask:function(ge){Se!==ge&&!G&&(n.colorMask(ge,ge,ge,ge),Se=ge)},setLocked:function(ge){G=ge},setClear:function(ge,ue,We,Je,At){At===!0&&(ge*=Je,ue*=Je,We*=Je),_e.set(ge,ue,We,Je),De.equals(_e)===!1&&(n.clearColor(ge,ue,We,Je),De.copy(_e))},reset:function(){G=!1,Se=null,De.set(-1,0,0,0)}}}function i(){let G=!1,_e=!1,Se=null,De=null,ge=null;return{setReversed:function(ue){if(_e!==ue){const We=e.get("EXT_clip_control");ue?We.clipControlEXT(We.LOWER_LEFT_EXT,We.ZERO_TO_ONE_EXT):We.clipControlEXT(We.LOWER_LEFT_EXT,We.NEGATIVE_ONE_TO_ONE_EXT),_e=ue;const Je=ge;ge=null,this.setClear(Je)}},getReversed:function(){return _e},setTest:function(ue){ue?he(n.DEPTH_TEST):Te(n.DEPTH_TEST)},setMask:function(ue){Se!==ue&&!G&&(n.depthMask(ue),Se=ue)},setFunc:function(ue){if(_e&&(ue=nx[ue]),De!==ue){switch(ue){case hc:n.depthFunc(n.NEVER);break;case dc:n.depthFunc(n.ALWAYS);break;case fc:n.depthFunc(n.LESS);break;case ls:n.depthFunc(n.LEQUAL);break;case pc:n.depthFunc(n.EQUAL);break;case mc:n.depthFunc(n.GEQUAL);break;case gc:n.depthFunc(n.GREATER);break;case vc:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}De=ue}},setLocked:function(ue){G=ue},setClear:function(ue){ge!==ue&&(_e&&(ue=1-ue),n.clearDepth(ue),ge=ue)},reset:function(){G=!1,Se=null,De=null,ge=null,_e=!1}}}function r(){let G=!1,_e=null,Se=null,De=null,ge=null,ue=null,We=null,Je=null,At=null;return{setTest:function(dt){G||(dt?he(n.STENCIL_TEST):Te(n.STENCIL_TEST))},setMask:function(dt){_e!==dt&&!G&&(n.stencilMask(dt),_e=dt)},setFunc:function(dt,Gn,Wn){(Se!==dt||De!==Gn||ge!==Wn)&&(n.stencilFunc(dt,Gn,Wn),Se=dt,De=Gn,ge=Wn)},setOp:function(dt,Gn,Wn){(ue!==dt||We!==Gn||Je!==Wn)&&(n.stencilOp(dt,Gn,Wn),ue=dt,We=Gn,Je=Wn)},setLocked:function(dt){G=dt},setClear:function(dt){At!==dt&&(n.clearStencil(dt),At=dt)},reset:function(){G=!1,_e=null,Se=null,De=null,ge=null,ue=null,We=null,Je=null,At=null}}}const s=new t,o=new i,a=new r,c=new WeakMap,l=new WeakMap;let u={},h={},d=new WeakMap,f=[],g=null,v=!1,m=null,p=null,_=null,x=null,y=null,M=null,w=null,A=new _t(0,0,0),C=0,S=!1,E=null,L=null,O=null,H=null,B=null;const Y=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let $=!1,W=0;const I=n.getParameter(n.VERSION);I.indexOf("WebGL")!==-1?(W=parseFloat(/^WebGL (\d)/.exec(I)[1]),$=W>=1):I.indexOf("OpenGL ES")!==-1&&(W=parseFloat(/^OpenGL ES (\d)/.exec(I)[1]),$=W>=2);let le=null,oe={};const K=n.getParameter(n.SCISSOR_BOX),Ie=n.getParameter(n.VIEWPORT),et=new Kt().fromArray(K),Ue=new Kt().fromArray(Ie);function ct(G,_e,Se,De){const ge=new Uint8Array(4),ue=n.createTexture();n.bindTexture(G,ue),n.texParameteri(G,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(G,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let We=0;We<Se;We++)G===n.TEXTURE_3D||G===n.TEXTURE_2D_ARRAY?n.texImage3D(_e,0,n.RGBA,1,1,De,0,n.RGBA,n.UNSIGNED_BYTE,ge):n.texImage2D(_e+We,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,ge);return ue}const te={};te[n.TEXTURE_2D]=ct(n.TEXTURE_2D,n.TEXTURE_2D,1),te[n.TEXTURE_CUBE_MAP]=ct(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),te[n.TEXTURE_2D_ARRAY]=ct(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),te[n.TEXTURE_3D]=ct(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),he(n.DEPTH_TEST),o.setFunc(ls),se(!1),ce(ru),he(n.CULL_FACE),me(Ji);function he(G){u[G]!==!0&&(n.enable(G),u[G]=!0)}function Te(G){u[G]!==!1&&(n.disable(G),u[G]=!1)}function qe(G,_e){return h[G]!==_e?(n.bindFramebuffer(G,_e),h[G]=_e,G===n.DRAW_FRAMEBUFFER&&(h[n.FRAMEBUFFER]=_e),G===n.FRAMEBUFFER&&(h[n.DRAW_FRAMEBUFFER]=_e),!0):!1}function Ve(G,_e){let Se=f,De=!1;if(G){Se=d.get(_e),Se===void 0&&(Se=[],d.set(_e,Se));const ge=G.textures;if(Se.length!==ge.length||Se[0]!==n.COLOR_ATTACHMENT0){for(let ue=0,We=ge.length;ue<We;ue++)Se[ue]=n.COLOR_ATTACHMENT0+ue;Se.length=ge.length,De=!0}}else Se[0]!==n.BACK&&(Se[0]=n.BACK,De=!0);De&&n.drawBuffers(Se)}function rt(G){return g!==G?(n.useProgram(G),g=G,!0):!1}const Tt={[_r]:n.FUNC_ADD,[mf]:n.FUNC_SUBTRACT,[gf]:n.FUNC_REVERSE_SUBTRACT};Tt[vf]=n.MIN,Tt[_f]=n.MAX;const k={[xf]:n.ZERO,[yf]:n.ONE,[bf]:n.SRC_COLOR,[lc]:n.SRC_ALPHA,[Af]:n.SRC_ALPHA_SATURATE,[wf]:n.DST_COLOR,[Sf]:n.DST_ALPHA,[Mf]:n.ONE_MINUS_SRC_COLOR,[uc]:n.ONE_MINUS_SRC_ALPHA,[Tf]:n.ONE_MINUS_DST_COLOR,[Ef]:n.ONE_MINUS_DST_ALPHA,[Rf]:n.CONSTANT_COLOR,[Cf]:n.ONE_MINUS_CONSTANT_COLOR,[Pf]:n.CONSTANT_ALPHA,[Lf]:n.ONE_MINUS_CONSTANT_ALPHA};function me(G,_e,Se,De,ge,ue,We,Je,At,dt){if(G===Ji){v===!0&&(Te(n.BLEND),v=!1);return}if(v===!1&&(he(n.BLEND),v=!0),G!==pf){if(G!==m||dt!==S){if((p!==_r||y!==_r)&&(n.blendEquation(n.FUNC_ADD),p=_r,y=_r),dt)switch(G){case is:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case su:n.blendFunc(n.ONE,n.ONE);break;case ou:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case au:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",G);break}else switch(G){case is:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case su:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case ou:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case au:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",G);break}_=null,x=null,M=null,w=null,A.set(0,0,0),C=0,m=G,S=dt}return}ge=ge||_e,ue=ue||Se,We=We||De,(_e!==p||ge!==y)&&(n.blendEquationSeparate(Tt[_e],Tt[ge]),p=_e,y=ge),(Se!==_||De!==x||ue!==M||We!==w)&&(n.blendFuncSeparate(k[Se],k[De],k[ue],k[We]),_=Se,x=De,M=ue,w=We),(Je.equals(A)===!1||At!==C)&&(n.blendColor(Je.r,Je.g,Je.b,At),A.copy(Je),C=At),m=G,S=!1}function de(G,_e){G.side===pi?Te(n.CULL_FACE):he(n.CULL_FACE);let Se=G.side===Fn;_e&&(Se=!Se),se(Se),G.blending===is&&G.transparent===!1?me(Ji):me(G.blending,G.blendEquation,G.blendSrc,G.blendDst,G.blendEquationAlpha,G.blendSrcAlpha,G.blendDstAlpha,G.blendColor,G.blendAlpha,G.premultipliedAlpha),o.setFunc(G.depthFunc),o.setTest(G.depthTest),o.setMask(G.depthWrite),s.setMask(G.colorWrite);const De=G.stencilWrite;a.setTest(De),De&&(a.setMask(G.stencilWriteMask),a.setFunc(G.stencilFunc,G.stencilRef,G.stencilFuncMask),a.setOp(G.stencilFail,G.stencilZFail,G.stencilZPass)),pe(G.polygonOffset,G.polygonOffsetFactor,G.polygonOffsetUnits),G.alphaToCoverage===!0?he(n.SAMPLE_ALPHA_TO_COVERAGE):Te(n.SAMPLE_ALPHA_TO_COVERAGE)}function se(G){E!==G&&(G?n.frontFace(n.CW):n.frontFace(n.CCW),E=G)}function ce(G){G!==df?(he(n.CULL_FACE),G!==L&&(G===ru?n.cullFace(n.BACK):G===ff?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Te(n.CULL_FACE),L=G}function Ee(G){G!==O&&($&&n.lineWidth(G),O=G)}function pe(G,_e,Se){G?(he(n.POLYGON_OFFSET_FILL),(H!==_e||B!==Se)&&(n.polygonOffset(_e,Se),H=_e,B=Se)):Te(n.POLYGON_OFFSET_FILL)}function Me(G){G?he(n.SCISSOR_TEST):Te(n.SCISSOR_TEST)}function Qe(G){G===void 0&&(G=n.TEXTURE0+Y-1),le!==G&&(n.activeTexture(G),le=G)}function tt(G,_e,Se){Se===void 0&&(le===null?Se=n.TEXTURE0+Y-1:Se=le);let De=oe[Se];De===void 0&&(De={type:void 0,texture:void 0},oe[Se]=De),(De.type!==G||De.texture!==_e)&&(le!==Se&&(n.activeTexture(Se),le=Se),n.bindTexture(G,_e||te[G]),De.type=G,De.texture=_e)}function U(){const G=oe[le];G!==void 0&&G.type!==void 0&&(n.bindTexture(G.type,null),G.type=void 0,G.texture=void 0)}function T(){try{n.compressedTexImage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function j(){try{n.compressedTexImage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function ee(){try{n.texSubImage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function fe(){try{n.texSubImage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function ne(){try{n.compressedTexSubImage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Ne(){try{n.compressedTexSubImage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function ye(){try{n.texStorage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Ge(){try{n.texStorage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function ze(){try{n.texImage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Z(){try{n.texImage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Re(G){et.equals(G)===!1&&(n.scissor(G.x,G.y,G.z,G.w),et.copy(G))}function Ke(G){Ue.equals(G)===!1&&(n.viewport(G.x,G.y,G.z,G.w),Ue.copy(G))}function Xe(G,_e){let Se=l.get(_e);Se===void 0&&(Se=new WeakMap,l.set(_e,Se));let De=Se.get(G);De===void 0&&(De=n.getUniformBlockIndex(_e,G.name),Se.set(G,De))}function Ae(G,_e){const De=l.get(_e).get(G);c.get(_e)!==De&&(n.uniformBlockBinding(_e,De,G.__bindingPointIndex),c.set(_e,De))}function Ye(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),u={},le=null,oe={},h={},d=new WeakMap,f=[],g=null,v=!1,m=null,p=null,_=null,x=null,y=null,M=null,w=null,A=new _t(0,0,0),C=0,S=!1,E=null,L=null,O=null,H=null,B=null,et.set(0,0,n.canvas.width,n.canvas.height),Ue.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:he,disable:Te,bindFramebuffer:qe,drawBuffers:Ve,useProgram:rt,setBlending:me,setMaterial:de,setFlipSided:se,setCullFace:ce,setLineWidth:Ee,setPolygonOffset:pe,setScissorTest:Me,activeTexture:Qe,bindTexture:tt,unbindTexture:U,compressedTexImage2D:T,compressedTexImage3D:j,texImage2D:ze,texImage3D:Z,updateUBOMapping:Xe,uniformBlockBinding:Ae,texStorage2D:ye,texStorage3D:Ge,texSubImage2D:ee,texSubImage3D:fe,compressedTexSubImage2D:ne,compressedTexSubImage3D:Ne,scissor:Re,viewport:Ke,reset:Ye}}function rx(n,e,t,i,r,s,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new xe,u=new WeakMap;let h;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(U,T){return f?new OffscreenCanvas(U,T):Xo("canvas")}function v(U,T,j){let ee=1;const fe=tt(U);if((fe.width>j||fe.height>j)&&(ee=j/Math.max(fe.width,fe.height)),ee<1)if(typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&U instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&U instanceof ImageBitmap||typeof VideoFrame<"u"&&U instanceof VideoFrame){const ne=Math.floor(ee*fe.width),Ne=Math.floor(ee*fe.height);h===void 0&&(h=g(ne,Ne));const ye=T?g(ne,Ne):h;return ye.width=ne,ye.height=Ne,ye.getContext("2d").drawImage(U,0,0,ne,Ne),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+fe.width+"x"+fe.height+") to ("+ne+"x"+Ne+")."),ye}else return"data"in U&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+fe.width+"x"+fe.height+")."),U;return U}function m(U){return U.generateMipmaps}function p(U){n.generateMipmap(U)}function _(U){return U.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:U.isWebGL3DRenderTarget?n.TEXTURE_3D:U.isWebGLArrayRenderTarget||U.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function x(U,T,j,ee,fe=!1){if(U!==null){if(n[U]!==void 0)return n[U];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+U+"'")}let ne=T;if(T===n.RED&&(j===n.FLOAT&&(ne=n.R32F),j===n.HALF_FLOAT&&(ne=n.R16F),j===n.UNSIGNED_BYTE&&(ne=n.R8)),T===n.RED_INTEGER&&(j===n.UNSIGNED_BYTE&&(ne=n.R8UI),j===n.UNSIGNED_SHORT&&(ne=n.R16UI),j===n.UNSIGNED_INT&&(ne=n.R32UI),j===n.BYTE&&(ne=n.R8I),j===n.SHORT&&(ne=n.R16I),j===n.INT&&(ne=n.R32I)),T===n.RG&&(j===n.FLOAT&&(ne=n.RG32F),j===n.HALF_FLOAT&&(ne=n.RG16F),j===n.UNSIGNED_BYTE&&(ne=n.RG8)),T===n.RG_INTEGER&&(j===n.UNSIGNED_BYTE&&(ne=n.RG8UI),j===n.UNSIGNED_SHORT&&(ne=n.RG16UI),j===n.UNSIGNED_INT&&(ne=n.RG32UI),j===n.BYTE&&(ne=n.RG8I),j===n.SHORT&&(ne=n.RG16I),j===n.INT&&(ne=n.RG32I)),T===n.RGB_INTEGER&&(j===n.UNSIGNED_BYTE&&(ne=n.RGB8UI),j===n.UNSIGNED_SHORT&&(ne=n.RGB16UI),j===n.UNSIGNED_INT&&(ne=n.RGB32UI),j===n.BYTE&&(ne=n.RGB8I),j===n.SHORT&&(ne=n.RGB16I),j===n.INT&&(ne=n.RGB32I)),T===n.RGBA_INTEGER&&(j===n.UNSIGNED_BYTE&&(ne=n.RGBA8UI),j===n.UNSIGNED_SHORT&&(ne=n.RGBA16UI),j===n.UNSIGNED_INT&&(ne=n.RGBA32UI),j===n.BYTE&&(ne=n.RGBA8I),j===n.SHORT&&(ne=n.RGBA16I),j===n.INT&&(ne=n.RGBA32I)),T===n.RGB&&(j===n.UNSIGNED_INT_5_9_9_9_REV&&(ne=n.RGB9_E5),j===n.UNSIGNED_INT_10F_11F_11F_REV&&(ne=n.R11F_G11F_B10F)),T===n.RGBA){const Ne=fe?$o:wt.getTransfer(ee);j===n.FLOAT&&(ne=n.RGBA32F),j===n.HALF_FLOAT&&(ne=n.RGBA16F),j===n.UNSIGNED_BYTE&&(ne=Ne===It?n.SRGB8_ALPHA8:n.RGBA8),j===n.UNSIGNED_SHORT_4_4_4_4&&(ne=n.RGBA4),j===n.UNSIGNED_SHORT_5_5_5_1&&(ne=n.RGB5_A1)}return(ne===n.R16F||ne===n.R32F||ne===n.RG16F||ne===n.RG32F||ne===n.RGBA16F||ne===n.RGBA32F)&&e.get("EXT_color_buffer_float"),ne}function y(U,T){let j;return U?T===null||T===wr||T===Gs?j=n.DEPTH24_STENCIL8:T===Ii?j=n.DEPTH32F_STENCIL8:T===Hs&&(j=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):T===null||T===wr||T===Gs?j=n.DEPTH_COMPONENT24:T===Ii?j=n.DEPTH_COMPONENT32F:T===Hs&&(j=n.DEPTH_COMPONENT16),j}function M(U,T){return m(U)===!0||U.isFramebufferTexture&&U.minFilter!==ci&&U.minFilter!==si?Math.log2(Math.max(T.width,T.height))+1:U.mipmaps!==void 0&&U.mipmaps.length>0?U.mipmaps.length:U.isCompressedTexture&&Array.isArray(U.image)?T.mipmaps.length:1}function w(U){const T=U.target;T.removeEventListener("dispose",w),C(T),T.isVideoTexture&&u.delete(T)}function A(U){const T=U.target;T.removeEventListener("dispose",A),E(T)}function C(U){const T=i.get(U);if(T.__webglInit===void 0)return;const j=U.source,ee=d.get(j);if(ee){const fe=ee[T.__cacheKey];fe.usedTimes--,fe.usedTimes===0&&S(U),Object.keys(ee).length===0&&d.delete(j)}i.remove(U)}function S(U){const T=i.get(U);n.deleteTexture(T.__webglTexture);const j=U.source,ee=d.get(j);delete ee[T.__cacheKey],o.memory.textures--}function E(U){const T=i.get(U);if(U.depthTexture&&(U.depthTexture.dispose(),i.remove(U.depthTexture)),U.isWebGLCubeRenderTarget)for(let ee=0;ee<6;ee++){if(Array.isArray(T.__webglFramebuffer[ee]))for(let fe=0;fe<T.__webglFramebuffer[ee].length;fe++)n.deleteFramebuffer(T.__webglFramebuffer[ee][fe]);else n.deleteFramebuffer(T.__webglFramebuffer[ee]);T.__webglDepthbuffer&&n.deleteRenderbuffer(T.__webglDepthbuffer[ee])}else{if(Array.isArray(T.__webglFramebuffer))for(let ee=0;ee<T.__webglFramebuffer.length;ee++)n.deleteFramebuffer(T.__webglFramebuffer[ee]);else n.deleteFramebuffer(T.__webglFramebuffer);if(T.__webglDepthbuffer&&n.deleteRenderbuffer(T.__webglDepthbuffer),T.__webglMultisampledFramebuffer&&n.deleteFramebuffer(T.__webglMultisampledFramebuffer),T.__webglColorRenderbuffer)for(let ee=0;ee<T.__webglColorRenderbuffer.length;ee++)T.__webglColorRenderbuffer[ee]&&n.deleteRenderbuffer(T.__webglColorRenderbuffer[ee]);T.__webglDepthRenderbuffer&&n.deleteRenderbuffer(T.__webglDepthRenderbuffer)}const j=U.textures;for(let ee=0,fe=j.length;ee<fe;ee++){const ne=i.get(j[ee]);ne.__webglTexture&&(n.deleteTexture(ne.__webglTexture),o.memory.textures--),i.remove(j[ee])}i.remove(U)}let L=0;function O(){L=0}function H(){const U=L;return U>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+U+" texture units while this GPU supports only "+r.maxTextures),L+=1,U}function B(U){const T=[];return T.push(U.wrapS),T.push(U.wrapT),T.push(U.wrapR||0),T.push(U.magFilter),T.push(U.minFilter),T.push(U.anisotropy),T.push(U.internalFormat),T.push(U.format),T.push(U.type),T.push(U.generateMipmaps),T.push(U.premultiplyAlpha),T.push(U.flipY),T.push(U.unpackAlignment),T.push(U.colorSpace),T.join()}function Y(U,T){const j=i.get(U);if(U.isVideoTexture&&Me(U),U.isRenderTargetTexture===!1&&U.isExternalTexture!==!0&&U.version>0&&j.__version!==U.version){const ee=U.image;if(ee===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ee.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{te(j,U,T);return}}else U.isExternalTexture&&(j.__webglTexture=U.sourceTexture?U.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,j.__webglTexture,n.TEXTURE0+T)}function $(U,T){const j=i.get(U);if(U.isRenderTargetTexture===!1&&U.version>0&&j.__version!==U.version){te(j,U,T);return}t.bindTexture(n.TEXTURE_2D_ARRAY,j.__webglTexture,n.TEXTURE0+T)}function W(U,T){const j=i.get(U);if(U.isRenderTargetTexture===!1&&U.version>0&&j.__version!==U.version){te(j,U,T);return}t.bindTexture(n.TEXTURE_3D,j.__webglTexture,n.TEXTURE0+T)}function I(U,T){const j=i.get(U);if(U.version>0&&j.__version!==U.version){he(j,U,T);return}t.bindTexture(n.TEXTURE_CUBE_MAP,j.__webglTexture,n.TEXTURE0+T)}const le={[yc]:n.REPEAT,[br]:n.CLAMP_TO_EDGE,[bc]:n.MIRRORED_REPEAT},oe={[ci]:n.NEAREST,[Bf]:n.NEAREST_MIPMAP_NEAREST,[co]:n.NEAREST_MIPMAP_LINEAR,[si]:n.LINEAR,[Sa]:n.LINEAR_MIPMAP_NEAREST,[Ki]:n.LINEAR_MIPMAP_LINEAR},K={[Wf]:n.NEVER,[Zf]:n.ALWAYS,[$f]:n.LESS,[td]:n.LEQUAL,[qf]:n.EQUAL,[jf]:n.GEQUAL,[Xf]:n.GREATER,[Yf]:n.NOTEQUAL};function Ie(U,T){if(T.type===Ii&&e.has("OES_texture_float_linear")===!1&&(T.magFilter===si||T.magFilter===Sa||T.magFilter===co||T.magFilter===Ki||T.minFilter===si||T.minFilter===Sa||T.minFilter===co||T.minFilter===Ki)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(U,n.TEXTURE_WRAP_S,le[T.wrapS]),n.texParameteri(U,n.TEXTURE_WRAP_T,le[T.wrapT]),(U===n.TEXTURE_3D||U===n.TEXTURE_2D_ARRAY)&&n.texParameteri(U,n.TEXTURE_WRAP_R,le[T.wrapR]),n.texParameteri(U,n.TEXTURE_MAG_FILTER,oe[T.magFilter]),n.texParameteri(U,n.TEXTURE_MIN_FILTER,oe[T.minFilter]),T.compareFunction&&(n.texParameteri(U,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(U,n.TEXTURE_COMPARE_FUNC,K[T.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===ci||T.minFilter!==co&&T.minFilter!==Ki||T.type===Ii&&e.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||i.get(T).__currentAnisotropy){const j=e.get("EXT_texture_filter_anisotropic");n.texParameterf(U,j.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,r.getMaxAnisotropy())),i.get(T).__currentAnisotropy=T.anisotropy}}}function et(U,T){let j=!1;U.__webglInit===void 0&&(U.__webglInit=!0,T.addEventListener("dispose",w));const ee=T.source;let fe=d.get(ee);fe===void 0&&(fe={},d.set(ee,fe));const ne=B(T);if(ne!==U.__cacheKey){fe[ne]===void 0&&(fe[ne]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,j=!0),fe[ne].usedTimes++;const Ne=fe[U.__cacheKey];Ne!==void 0&&(fe[U.__cacheKey].usedTimes--,Ne.usedTimes===0&&S(T)),U.__cacheKey=ne,U.__webglTexture=fe[ne].texture}return j}function Ue(U,T,j){return Math.floor(Math.floor(U/j)/T)}function ct(U,T,j,ee){const ne=U.updateRanges;if(ne.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,T.width,T.height,j,ee,T.data);else{ne.sort((Z,Re)=>Z.start-Re.start);let Ne=0;for(let Z=1;Z<ne.length;Z++){const Re=ne[Ne],Ke=ne[Z],Xe=Re.start+Re.count,Ae=Ue(Ke.start,T.width,4),Ye=Ue(Re.start,T.width,4);Ke.start<=Xe+1&&Ae===Ye&&Ue(Ke.start+Ke.count-1,T.width,4)===Ae?Re.count=Math.max(Re.count,Ke.start+Ke.count-Re.start):(++Ne,ne[Ne]=Ke)}ne.length=Ne+1;const ye=n.getParameter(n.UNPACK_ROW_LENGTH),Ge=n.getParameter(n.UNPACK_SKIP_PIXELS),ze=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,T.width);for(let Z=0,Re=ne.length;Z<Re;Z++){const Ke=ne[Z],Xe=Math.floor(Ke.start/4),Ae=Math.ceil(Ke.count/4),Ye=Xe%T.width,G=Math.floor(Xe/T.width),_e=Ae,Se=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,Ye),n.pixelStorei(n.UNPACK_SKIP_ROWS,G),t.texSubImage2D(n.TEXTURE_2D,0,Ye,G,_e,Se,j,ee,T.data)}U.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,ye),n.pixelStorei(n.UNPACK_SKIP_PIXELS,Ge),n.pixelStorei(n.UNPACK_SKIP_ROWS,ze)}}function te(U,T,j){let ee=n.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(ee=n.TEXTURE_2D_ARRAY),T.isData3DTexture&&(ee=n.TEXTURE_3D);const fe=et(U,T),ne=T.source;t.bindTexture(ee,U.__webglTexture,n.TEXTURE0+j);const Ne=i.get(ne);if(ne.version!==Ne.__version||fe===!0){t.activeTexture(n.TEXTURE0+j);const ye=wt.getPrimaries(wt.workingColorSpace),Ge=T.colorSpace===Zi?null:wt.getPrimaries(T.colorSpace),ze=T.colorSpace===Zi||ye===Ge?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,T.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,T.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ze);let Z=v(T.image,!1,r.maxTextureSize);Z=Qe(T,Z);const Re=s.convert(T.format,T.colorSpace),Ke=s.convert(T.type);let Xe=x(T.internalFormat,Re,Ke,T.colorSpace,T.isVideoTexture);Ie(ee,T);let Ae;const Ye=T.mipmaps,G=T.isVideoTexture!==!0,_e=Ne.__version===void 0||fe===!0,Se=ne.dataReady,De=M(T,Z);if(T.isDepthTexture)Xe=y(T.format===$s,T.type),_e&&(G?t.texStorage2D(n.TEXTURE_2D,1,Xe,Z.width,Z.height):t.texImage2D(n.TEXTURE_2D,0,Xe,Z.width,Z.height,0,Re,Ke,null));else if(T.isDataTexture)if(Ye.length>0){G&&_e&&t.texStorage2D(n.TEXTURE_2D,De,Xe,Ye[0].width,Ye[0].height);for(let ge=0,ue=Ye.length;ge<ue;ge++)Ae=Ye[ge],G?Se&&t.texSubImage2D(n.TEXTURE_2D,ge,0,0,Ae.width,Ae.height,Re,Ke,Ae.data):t.texImage2D(n.TEXTURE_2D,ge,Xe,Ae.width,Ae.height,0,Re,Ke,Ae.data);T.generateMipmaps=!1}else G?(_e&&t.texStorage2D(n.TEXTURE_2D,De,Xe,Z.width,Z.height),Se&&ct(T,Z,Re,Ke)):t.texImage2D(n.TEXTURE_2D,0,Xe,Z.width,Z.height,0,Re,Ke,Z.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){G&&_e&&t.texStorage3D(n.TEXTURE_2D_ARRAY,De,Xe,Ye[0].width,Ye[0].height,Z.depth);for(let ge=0,ue=Ye.length;ge<ue;ge++)if(Ae=Ye[ge],T.format!==oi)if(Re!==null)if(G){if(Se)if(T.layerUpdates.size>0){const We=Wu(Ae.width,Ae.height,T.format,T.type);for(const Je of T.layerUpdates){const At=Ae.data.subarray(Je*We/Ae.data.BYTES_PER_ELEMENT,(Je+1)*We/Ae.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ge,0,0,Je,Ae.width,Ae.height,1,Re,At)}T.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ge,0,0,0,Ae.width,Ae.height,Z.depth,Re,Ae.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,ge,Xe,Ae.width,Ae.height,Z.depth,0,Ae.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else G?Se&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,ge,0,0,0,Ae.width,Ae.height,Z.depth,Re,Ke,Ae.data):t.texImage3D(n.TEXTURE_2D_ARRAY,ge,Xe,Ae.width,Ae.height,Z.depth,0,Re,Ke,Ae.data)}else{G&&_e&&t.texStorage2D(n.TEXTURE_2D,De,Xe,Ye[0].width,Ye[0].height);for(let ge=0,ue=Ye.length;ge<ue;ge++)Ae=Ye[ge],T.format!==oi?Re!==null?G?Se&&t.compressedTexSubImage2D(n.TEXTURE_2D,ge,0,0,Ae.width,Ae.height,Re,Ae.data):t.compressedTexImage2D(n.TEXTURE_2D,ge,Xe,Ae.width,Ae.height,0,Ae.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):G?Se&&t.texSubImage2D(n.TEXTURE_2D,ge,0,0,Ae.width,Ae.height,Re,Ke,Ae.data):t.texImage2D(n.TEXTURE_2D,ge,Xe,Ae.width,Ae.height,0,Re,Ke,Ae.data)}else if(T.isDataArrayTexture)if(G){if(_e&&t.texStorage3D(n.TEXTURE_2D_ARRAY,De,Xe,Z.width,Z.height,Z.depth),Se)if(T.layerUpdates.size>0){const ge=Wu(Z.width,Z.height,T.format,T.type);for(const ue of T.layerUpdates){const We=Z.data.subarray(ue*ge/Z.data.BYTES_PER_ELEMENT,(ue+1)*ge/Z.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,ue,Z.width,Z.height,1,Re,Ke,We)}T.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,Z.width,Z.height,Z.depth,Re,Ke,Z.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Xe,Z.width,Z.height,Z.depth,0,Re,Ke,Z.data);else if(T.isData3DTexture)G?(_e&&t.texStorage3D(n.TEXTURE_3D,De,Xe,Z.width,Z.height,Z.depth),Se&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,Z.width,Z.height,Z.depth,Re,Ke,Z.data)):t.texImage3D(n.TEXTURE_3D,0,Xe,Z.width,Z.height,Z.depth,0,Re,Ke,Z.data);else if(T.isFramebufferTexture){if(_e)if(G)t.texStorage2D(n.TEXTURE_2D,De,Xe,Z.width,Z.height);else{let ge=Z.width,ue=Z.height;for(let We=0;We<De;We++)t.texImage2D(n.TEXTURE_2D,We,Xe,ge,ue,0,Re,Ke,null),ge>>=1,ue>>=1}}else if(Ye.length>0){if(G&&_e){const ge=tt(Ye[0]);t.texStorage2D(n.TEXTURE_2D,De,Xe,ge.width,ge.height)}for(let ge=0,ue=Ye.length;ge<ue;ge++)Ae=Ye[ge],G?Se&&t.texSubImage2D(n.TEXTURE_2D,ge,0,0,Re,Ke,Ae):t.texImage2D(n.TEXTURE_2D,ge,Xe,Re,Ke,Ae);T.generateMipmaps=!1}else if(G){if(_e){const ge=tt(Z);t.texStorage2D(n.TEXTURE_2D,De,Xe,ge.width,ge.height)}Se&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,Re,Ke,Z)}else t.texImage2D(n.TEXTURE_2D,0,Xe,Re,Ke,Z);m(T)&&p(ee),Ne.__version=ne.version,T.onUpdate&&T.onUpdate(T)}U.__version=T.version}function he(U,T,j){if(T.image.length!==6)return;const ee=et(U,T),fe=T.source;t.bindTexture(n.TEXTURE_CUBE_MAP,U.__webglTexture,n.TEXTURE0+j);const ne=i.get(fe);if(fe.version!==ne.__version||ee===!0){t.activeTexture(n.TEXTURE0+j);const Ne=wt.getPrimaries(wt.workingColorSpace),ye=T.colorSpace===Zi?null:wt.getPrimaries(T.colorSpace),Ge=T.colorSpace===Zi||Ne===ye?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,T.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,T.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ge);const ze=T.isCompressedTexture||T.image[0].isCompressedTexture,Z=T.image[0]&&T.image[0].isDataTexture,Re=[];for(let ue=0;ue<6;ue++)!ze&&!Z?Re[ue]=v(T.image[ue],!0,r.maxCubemapSize):Re[ue]=Z?T.image[ue].image:T.image[ue],Re[ue]=Qe(T,Re[ue]);const Ke=Re[0],Xe=s.convert(T.format,T.colorSpace),Ae=s.convert(T.type),Ye=x(T.internalFormat,Xe,Ae,T.colorSpace),G=T.isVideoTexture!==!0,_e=ne.__version===void 0||ee===!0,Se=fe.dataReady;let De=M(T,Ke);Ie(n.TEXTURE_CUBE_MAP,T);let ge;if(ze){G&&_e&&t.texStorage2D(n.TEXTURE_CUBE_MAP,De,Ye,Ke.width,Ke.height);for(let ue=0;ue<6;ue++){ge=Re[ue].mipmaps;for(let We=0;We<ge.length;We++){const Je=ge[We];T.format!==oi?Xe!==null?G?Se&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,We,0,0,Je.width,Je.height,Xe,Je.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,We,Ye,Je.width,Je.height,0,Je.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):G?Se&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,We,0,0,Je.width,Je.height,Xe,Ae,Je.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,We,Ye,Je.width,Je.height,0,Xe,Ae,Je.data)}}}else{if(ge=T.mipmaps,G&&_e){ge.length>0&&De++;const ue=tt(Re[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,De,Ye,ue.width,ue.height)}for(let ue=0;ue<6;ue++)if(Z){G?Se&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0,0,0,Re[ue].width,Re[ue].height,Xe,Ae,Re[ue].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0,Ye,Re[ue].width,Re[ue].height,0,Xe,Ae,Re[ue].data);for(let We=0;We<ge.length;We++){const At=ge[We].image[ue].image;G?Se&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,We+1,0,0,At.width,At.height,Xe,Ae,At.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,We+1,Ye,At.width,At.height,0,Xe,Ae,At.data)}}else{G?Se&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0,0,0,Xe,Ae,Re[ue]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0,Ye,Xe,Ae,Re[ue]);for(let We=0;We<ge.length;We++){const Je=ge[We];G?Se&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,We+1,0,0,Xe,Ae,Je.image[ue]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,We+1,Ye,Xe,Ae,Je.image[ue])}}}m(T)&&p(n.TEXTURE_CUBE_MAP),ne.__version=fe.version,T.onUpdate&&T.onUpdate(T)}U.__version=T.version}function Te(U,T,j,ee,fe,ne){const Ne=s.convert(j.format,j.colorSpace),ye=s.convert(j.type),Ge=x(j.internalFormat,Ne,ye,j.colorSpace),ze=i.get(T),Z=i.get(j);if(Z.__renderTarget=T,!ze.__hasExternalTextures){const Re=Math.max(1,T.width>>ne),Ke=Math.max(1,T.height>>ne);fe===n.TEXTURE_3D||fe===n.TEXTURE_2D_ARRAY?t.texImage3D(fe,ne,Ge,Re,Ke,T.depth,0,Ne,ye,null):t.texImage2D(fe,ne,Ge,Re,Ke,0,Ne,ye,null)}t.bindFramebuffer(n.FRAMEBUFFER,U),pe(T)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ee,fe,Z.__webglTexture,0,Ee(T)):(fe===n.TEXTURE_2D||fe>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&fe<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ee,fe,Z.__webglTexture,ne),t.bindFramebuffer(n.FRAMEBUFFER,null)}function qe(U,T,j){if(n.bindRenderbuffer(n.RENDERBUFFER,U),T.depthBuffer){const ee=T.depthTexture,fe=ee&&ee.isDepthTexture?ee.type:null,ne=y(T.stencilBuffer,fe),Ne=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ye=Ee(T);pe(T)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ye,ne,T.width,T.height):j?n.renderbufferStorageMultisample(n.RENDERBUFFER,ye,ne,T.width,T.height):n.renderbufferStorage(n.RENDERBUFFER,ne,T.width,T.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Ne,n.RENDERBUFFER,U)}else{const ee=T.textures;for(let fe=0;fe<ee.length;fe++){const ne=ee[fe],Ne=s.convert(ne.format,ne.colorSpace),ye=s.convert(ne.type),Ge=x(ne.internalFormat,Ne,ye,ne.colorSpace),ze=Ee(T);j&&pe(T)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,ze,Ge,T.width,T.height):pe(T)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ze,Ge,T.width,T.height):n.renderbufferStorage(n.RENDERBUFFER,Ge,T.width,T.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Ve(U,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,U),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ee=i.get(T.depthTexture);ee.__renderTarget=T,(!ee.__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),Y(T.depthTexture,0);const fe=ee.__webglTexture,ne=Ee(T);if(T.depthTexture.format===Ws)pe(T)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,fe,0,ne):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,fe,0);else if(T.depthTexture.format===$s)pe(T)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,fe,0,ne):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,fe,0);else throw new Error("Unknown depthTexture format")}function rt(U){const T=i.get(U),j=U.isWebGLCubeRenderTarget===!0;if(T.__boundDepthTexture!==U.depthTexture){const ee=U.depthTexture;if(T.__depthDisposeCallback&&T.__depthDisposeCallback(),ee){const fe=()=>{delete T.__boundDepthTexture,delete T.__depthDisposeCallback,ee.removeEventListener("dispose",fe)};ee.addEventListener("dispose",fe),T.__depthDisposeCallback=fe}T.__boundDepthTexture=ee}if(U.depthTexture&&!T.__autoAllocateDepthBuffer){if(j)throw new Error("target.depthTexture not supported in Cube render targets");const ee=U.texture.mipmaps;ee&&ee.length>0?Ve(T.__webglFramebuffer[0],U):Ve(T.__webglFramebuffer,U)}else if(j){T.__webglDepthbuffer=[];for(let ee=0;ee<6;ee++)if(t.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer[ee]),T.__webglDepthbuffer[ee]===void 0)T.__webglDepthbuffer[ee]=n.createRenderbuffer(),qe(T.__webglDepthbuffer[ee],U,!1);else{const fe=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ne=T.__webglDepthbuffer[ee];n.bindRenderbuffer(n.RENDERBUFFER,ne),n.framebufferRenderbuffer(n.FRAMEBUFFER,fe,n.RENDERBUFFER,ne)}}else{const ee=U.texture.mipmaps;if(ee&&ee.length>0?t.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer===void 0)T.__webglDepthbuffer=n.createRenderbuffer(),qe(T.__webglDepthbuffer,U,!1);else{const fe=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ne=T.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ne),n.framebufferRenderbuffer(n.FRAMEBUFFER,fe,n.RENDERBUFFER,ne)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function Tt(U,T,j){const ee=i.get(U);T!==void 0&&Te(ee.__webglFramebuffer,U,U.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),j!==void 0&&rt(U)}function k(U){const T=U.texture,j=i.get(U),ee=i.get(T);U.addEventListener("dispose",A);const fe=U.textures,ne=U.isWebGLCubeRenderTarget===!0,Ne=fe.length>1;if(Ne||(ee.__webglTexture===void 0&&(ee.__webglTexture=n.createTexture()),ee.__version=T.version,o.memory.textures++),ne){j.__webglFramebuffer=[];for(let ye=0;ye<6;ye++)if(T.mipmaps&&T.mipmaps.length>0){j.__webglFramebuffer[ye]=[];for(let Ge=0;Ge<T.mipmaps.length;Ge++)j.__webglFramebuffer[ye][Ge]=n.createFramebuffer()}else j.__webglFramebuffer[ye]=n.createFramebuffer()}else{if(T.mipmaps&&T.mipmaps.length>0){j.__webglFramebuffer=[];for(let ye=0;ye<T.mipmaps.length;ye++)j.__webglFramebuffer[ye]=n.createFramebuffer()}else j.__webglFramebuffer=n.createFramebuffer();if(Ne)for(let ye=0,Ge=fe.length;ye<Ge;ye++){const ze=i.get(fe[ye]);ze.__webglTexture===void 0&&(ze.__webglTexture=n.createTexture(),o.memory.textures++)}if(U.samples>0&&pe(U)===!1){j.__webglMultisampledFramebuffer=n.createFramebuffer(),j.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,j.__webglMultisampledFramebuffer);for(let ye=0;ye<fe.length;ye++){const Ge=fe[ye];j.__webglColorRenderbuffer[ye]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,j.__webglColorRenderbuffer[ye]);const ze=s.convert(Ge.format,Ge.colorSpace),Z=s.convert(Ge.type),Re=x(Ge.internalFormat,ze,Z,Ge.colorSpace,U.isXRRenderTarget===!0),Ke=Ee(U);n.renderbufferStorageMultisample(n.RENDERBUFFER,Ke,Re,U.width,U.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ye,n.RENDERBUFFER,j.__webglColorRenderbuffer[ye])}n.bindRenderbuffer(n.RENDERBUFFER,null),U.depthBuffer&&(j.__webglDepthRenderbuffer=n.createRenderbuffer(),qe(j.__webglDepthRenderbuffer,U,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ne){t.bindTexture(n.TEXTURE_CUBE_MAP,ee.__webglTexture),Ie(n.TEXTURE_CUBE_MAP,T);for(let ye=0;ye<6;ye++)if(T.mipmaps&&T.mipmaps.length>0)for(let Ge=0;Ge<T.mipmaps.length;Ge++)Te(j.__webglFramebuffer[ye][Ge],U,T,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,Ge);else Te(j.__webglFramebuffer[ye],U,T,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0);m(T)&&p(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ne){for(let ye=0,Ge=fe.length;ye<Ge;ye++){const ze=fe[ye],Z=i.get(ze);let Re=n.TEXTURE_2D;(U.isWebGL3DRenderTarget||U.isWebGLArrayRenderTarget)&&(Re=U.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(Re,Z.__webglTexture),Ie(Re,ze),Te(j.__webglFramebuffer,U,ze,n.COLOR_ATTACHMENT0+ye,Re,0),m(ze)&&p(Re)}t.unbindTexture()}else{let ye=n.TEXTURE_2D;if((U.isWebGL3DRenderTarget||U.isWebGLArrayRenderTarget)&&(ye=U.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ye,ee.__webglTexture),Ie(ye,T),T.mipmaps&&T.mipmaps.length>0)for(let Ge=0;Ge<T.mipmaps.length;Ge++)Te(j.__webglFramebuffer[Ge],U,T,n.COLOR_ATTACHMENT0,ye,Ge);else Te(j.__webglFramebuffer,U,T,n.COLOR_ATTACHMENT0,ye,0);m(T)&&p(ye),t.unbindTexture()}U.depthBuffer&&rt(U)}function me(U){const T=U.textures;for(let j=0,ee=T.length;j<ee;j++){const fe=T[j];if(m(fe)){const ne=_(U),Ne=i.get(fe).__webglTexture;t.bindTexture(ne,Ne),p(ne),t.unbindTexture()}}}const de=[],se=[];function ce(U){if(U.samples>0){if(pe(U)===!1){const T=U.textures,j=U.width,ee=U.height;let fe=n.COLOR_BUFFER_BIT;const ne=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Ne=i.get(U),ye=T.length>1;if(ye)for(let ze=0;ze<T.length;ze++)t.bindFramebuffer(n.FRAMEBUFFER,Ne.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ze,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Ne.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ze,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Ne.__webglMultisampledFramebuffer);const Ge=U.texture.mipmaps;Ge&&Ge.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ne.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ne.__webglFramebuffer);for(let ze=0;ze<T.length;ze++){if(U.resolveDepthBuffer&&(U.depthBuffer&&(fe|=n.DEPTH_BUFFER_BIT),U.stencilBuffer&&U.resolveStencilBuffer&&(fe|=n.STENCIL_BUFFER_BIT)),ye){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Ne.__webglColorRenderbuffer[ze]);const Z=i.get(T[ze]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Z,0)}n.blitFramebuffer(0,0,j,ee,0,0,j,ee,fe,n.NEAREST),c===!0&&(de.length=0,se.length=0,de.push(n.COLOR_ATTACHMENT0+ze),U.depthBuffer&&U.resolveDepthBuffer===!1&&(de.push(ne),se.push(ne),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,se)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,de))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),ye)for(let ze=0;ze<T.length;ze++){t.bindFramebuffer(n.FRAMEBUFFER,Ne.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ze,n.RENDERBUFFER,Ne.__webglColorRenderbuffer[ze]);const Z=i.get(T[ze]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Ne.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ze,n.TEXTURE_2D,Z,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ne.__webglMultisampledFramebuffer)}else if(U.depthBuffer&&U.resolveDepthBuffer===!1&&c){const T=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[T])}}}function Ee(U){return Math.min(r.maxSamples,U.samples)}function pe(U){const T=i.get(U);return U.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function Me(U){const T=o.render.frame;u.get(U)!==T&&(u.set(U,T),U.update())}function Qe(U,T){const j=U.colorSpace,ee=U.format,fe=U.type;return U.isCompressedTexture===!0||U.isVideoTexture===!0||j!==ds&&j!==Zi&&(wt.getTransfer(j)===It?(ee!==oi||fe!==_i)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",j)),T}function tt(U){return typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement?(l.width=U.naturalWidth||U.width,l.height=U.naturalHeight||U.height):typeof VideoFrame<"u"&&U instanceof VideoFrame?(l.width=U.displayWidth,l.height=U.displayHeight):(l.width=U.width,l.height=U.height),l}this.allocateTextureUnit=H,this.resetTextureUnits=O,this.setTexture2D=Y,this.setTexture2DArray=$,this.setTexture3D=W,this.setTextureCube=I,this.rebindTextures=Tt,this.setupRenderTarget=k,this.updateRenderTargetMipmap=me,this.updateMultisampleRenderTarget=ce,this.setupDepthRenderbuffer=rt,this.setupFrameBufferTexture=Te,this.useMultisampledRTT=pe}function sx(n,e){function t(i,r=Zi){let s;const o=wt.getTransfer(r);if(i===_i)return n.UNSIGNED_BYTE;if(i===dl)return n.UNSIGNED_SHORT_4_4_4_4;if(i===fl)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Yh)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===jh)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===qh)return n.BYTE;if(i===Xh)return n.SHORT;if(i===Hs)return n.UNSIGNED_SHORT;if(i===hl)return n.INT;if(i===wr)return n.UNSIGNED_INT;if(i===Ii)return n.FLOAT;if(i===Qs)return n.HALF_FLOAT;if(i===Zh)return n.ALPHA;if(i===Kh)return n.RGB;if(i===oi)return n.RGBA;if(i===Ws)return n.DEPTH_COMPONENT;if(i===$s)return n.DEPTH_STENCIL;if(i===Jh)return n.RED;if(i===pl)return n.RED_INTEGER;if(i===Qh)return n.RG;if(i===ml)return n.RG_INTEGER;if(i===gl)return n.RGBA_INTEGER;if(i===zo||i===Bo||i===Vo||i===Ho)if(o===It)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===zo)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Bo)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Vo)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Ho)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===zo)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Bo)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Vo)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Ho)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Mc||i===Sc||i===Ec||i===wc)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Mc)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Sc)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Ec)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===wc)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Tc||i===Ac||i===Rc)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Tc||i===Ac)return o===It?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Rc)return o===It?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Cc||i===Pc||i===Lc||i===Dc||i===Ic||i===Uc||i===Nc||i===Oc||i===Fc||i===kc||i===zc||i===Bc||i===Vc||i===Hc)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Cc)return o===It?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Pc)return o===It?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Lc)return o===It?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Dc)return o===It?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Ic)return o===It?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Uc)return o===It?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Nc)return o===It?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Oc)return o===It?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Fc)return o===It?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===kc)return o===It?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===zc)return o===It?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Bc)return o===It?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Vc)return o===It?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Hc)return o===It?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Gc||i===Wc||i===$c)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===Gc)return o===It?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Wc)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===$c)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===qc||i===Xc||i===Yc||i===jc)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===qc)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Xc)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Yc)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===jc)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Gs?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const ox=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,ax=`
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

}`;class cx{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new hd(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new rr({vertexShader:ox,fragmentShader:ax,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new En(new Ui(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class lx extends Cr{constructor(e,t){super();const i=this;let r=null,s=1,o=null,a="local-floor",c=1,l=null,u=null,h=null,d=null,f=null,g=null;const v=typeof XRWebGLBinding<"u",m=new cx,p={},_=t.getContextAttributes();let x=null,y=null;const M=[],w=[],A=new xe;let C=null;const S=new Yn;S.viewport=new Kt;const E=new Yn;E.viewport=new Kt;const L=[S,E],O=new Rm;let H=null,B=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(te){let he=M[te];return he===void 0&&(he=new Wa,M[te]=he),he.getTargetRaySpace()},this.getControllerGrip=function(te){let he=M[te];return he===void 0&&(he=new Wa,M[te]=he),he.getGripSpace()},this.getHand=function(te){let he=M[te];return he===void 0&&(he=new Wa,M[te]=he),he.getHandSpace()};function Y(te){const he=w.indexOf(te.inputSource);if(he===-1)return;const Te=M[he];Te!==void 0&&(Te.update(te.inputSource,te.frame,l||o),Te.dispatchEvent({type:te.type,data:te.inputSource}))}function $(){r.removeEventListener("select",Y),r.removeEventListener("selectstart",Y),r.removeEventListener("selectend",Y),r.removeEventListener("squeeze",Y),r.removeEventListener("squeezestart",Y),r.removeEventListener("squeezeend",Y),r.removeEventListener("end",$),r.removeEventListener("inputsourceschange",W);for(let te=0;te<M.length;te++){const he=w[te];he!==null&&(w[te]=null,M[te].disconnect(he))}H=null,B=null,m.reset();for(const te in p)delete p[te];e.setRenderTarget(x),f=null,d=null,h=null,r=null,y=null,ct.stop(),i.isPresenting=!1,e.setPixelRatio(C),e.setSize(A.width,A.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(te){s=te,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(te){a=te,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(te){l=te},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return h===null&&v&&(h=new XRWebGLBinding(r,t)),h},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(te){if(r=te,r!==null){if(x=e.getRenderTarget(),r.addEventListener("select",Y),r.addEventListener("selectstart",Y),r.addEventListener("selectend",Y),r.addEventListener("squeeze",Y),r.addEventListener("squeezestart",Y),r.addEventListener("squeezeend",Y),r.addEventListener("end",$),r.addEventListener("inputsourceschange",W),_.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(A),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let Te=null,qe=null,Ve=null;_.depth&&(Ve=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Te=_.stencil?$s:Ws,qe=_.stencil?Gs:wr);const rt={colorFormat:t.RGBA8,depthFormat:Ve,scaleFactor:s};h=this.getBinding(),d=h.createProjectionLayer(rt),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new Tr(d.textureWidth,d.textureHeight,{format:oi,type:_i,depthTexture:new ud(d.textureWidth,d.textureHeight,qe,void 0,void 0,void 0,void 0,void 0,void 0,Te),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const Te={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(r,t,Te),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new Tr(f.framebufferWidth,f.framebufferHeight,{format:oi,type:_i,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await r.requestReferenceSpace(a),ct.setContext(r),ct.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function W(te){for(let he=0;he<te.removed.length;he++){const Te=te.removed[he],qe=w.indexOf(Te);qe>=0&&(w[qe]=null,M[qe].disconnect(Te))}for(let he=0;he<te.added.length;he++){const Te=te.added[he];let qe=w.indexOf(Te);if(qe===-1){for(let rt=0;rt<M.length;rt++)if(rt>=w.length){w.push(Te),qe=rt;break}else if(w[rt]===null){w[rt]=Te,qe=rt;break}if(qe===-1)break}const Ve=M[qe];Ve&&Ve.connect(Te)}}const I=new D,le=new D;function oe(te,he,Te){I.setFromMatrixPosition(he.matrixWorld),le.setFromMatrixPosition(Te.matrixWorld);const qe=I.distanceTo(le),Ve=he.projectionMatrix.elements,rt=Te.projectionMatrix.elements,Tt=Ve[14]/(Ve[10]-1),k=Ve[14]/(Ve[10]+1),me=(Ve[9]+1)/Ve[5],de=(Ve[9]-1)/Ve[5],se=(Ve[8]-1)/Ve[0],ce=(rt[8]+1)/rt[0],Ee=Tt*se,pe=Tt*ce,Me=qe/(-se+ce),Qe=Me*-se;if(he.matrixWorld.decompose(te.position,te.quaternion,te.scale),te.translateX(Qe),te.translateZ(Me),te.matrixWorld.compose(te.position,te.quaternion,te.scale),te.matrixWorldInverse.copy(te.matrixWorld).invert(),Ve[10]===-1)te.projectionMatrix.copy(he.projectionMatrix),te.projectionMatrixInverse.copy(he.projectionMatrixInverse);else{const tt=Tt+Me,U=k+Me,T=Ee-Qe,j=pe+(qe-Qe),ee=me*k/U*tt,fe=de*k/U*tt;te.projectionMatrix.makePerspective(T,j,ee,fe,tt,U),te.projectionMatrixInverse.copy(te.projectionMatrix).invert()}}function K(te,he){he===null?te.matrixWorld.copy(te.matrix):te.matrixWorld.multiplyMatrices(he.matrixWorld,te.matrix),te.matrixWorldInverse.copy(te.matrixWorld).invert()}this.updateCamera=function(te){if(r===null)return;let he=te.near,Te=te.far;m.texture!==null&&(m.depthNear>0&&(he=m.depthNear),m.depthFar>0&&(Te=m.depthFar)),O.near=E.near=S.near=he,O.far=E.far=S.far=Te,(H!==O.near||B!==O.far)&&(r.updateRenderState({depthNear:O.near,depthFar:O.far}),H=O.near,B=O.far),O.layers.mask=te.layers.mask|6,S.layers.mask=O.layers.mask&3,E.layers.mask=O.layers.mask&5;const qe=te.parent,Ve=O.cameras;K(O,qe);for(let rt=0;rt<Ve.length;rt++)K(Ve[rt],qe);Ve.length===2?oe(O,S,E):O.projectionMatrix.copy(S.projectionMatrix),Ie(te,O,qe)};function Ie(te,he,Te){Te===null?te.matrix.copy(he.matrixWorld):(te.matrix.copy(Te.matrixWorld),te.matrix.invert(),te.matrix.multiply(he.matrixWorld)),te.matrix.decompose(te.position,te.quaternion,te.scale),te.updateMatrixWorld(!0),te.projectionMatrix.copy(he.projectionMatrix),te.projectionMatrixInverse.copy(he.projectionMatrixInverse),te.isPerspectiveCamera&&(te.fov=qs*2*Math.atan(1/te.projectionMatrix.elements[5]),te.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(te){c=te,d!==null&&(d.fixedFoveation=te),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=te)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(O)},this.getCameraTexture=function(te){return p[te]};let et=null;function Ue(te,he){if(u=he.getViewerPose(l||o),g=he,u!==null){const Te=u.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let qe=!1;Te.length!==O.cameras.length&&(O.cameras.length=0,qe=!0);for(let k=0;k<Te.length;k++){const me=Te[k];let de=null;if(f!==null)de=f.getViewport(me);else{const ce=h.getViewSubImage(d,me);de=ce.viewport,k===0&&(e.setRenderTargetTextures(y,ce.colorTexture,ce.depthStencilTexture),e.setRenderTarget(y))}let se=L[k];se===void 0&&(se=new Yn,se.layers.enable(k),se.viewport=new Kt,L[k]=se),se.matrix.fromArray(me.transform.matrix),se.matrix.decompose(se.position,se.quaternion,se.scale),se.projectionMatrix.fromArray(me.projectionMatrix),se.projectionMatrixInverse.copy(se.projectionMatrix).invert(),se.viewport.set(de.x,de.y,de.width,de.height),k===0&&(O.matrix.copy(se.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),qe===!0&&O.cameras.push(se)}const Ve=r.enabledFeatures;if(Ve&&Ve.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&v){h=i.getBinding();const k=h.getDepthInformation(Te[0]);k&&k.isValid&&k.texture&&m.init(k,r.renderState)}if(Ve&&Ve.includes("camera-access")&&v){e.state.unbindTexture(),h=i.getBinding();for(let k=0;k<Te.length;k++){const me=Te[k].camera;if(me){let de=p[me];de||(de=new hd,p[me]=de);const se=h.getCameraImage(me);de.sourceTexture=se}}}}for(let Te=0;Te<M.length;Te++){const qe=w[Te],Ve=M[Te];qe!==null&&Ve!==void 0&&Ve.update(qe,he,l||o)}et&&et(te,he),he.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:he}),g=null}const ct=new Sd;ct.setAnimationLoop(Ue),this.setAnimationLoop=function(te){et=te},this.dispose=function(){}}}const gr=new kn,ux=new Vt;function hx(n,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,ad(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function r(m,p,_,x,y){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(m,p):p.isMeshToonMaterial?(s(m,p),h(m,p)):p.isMeshPhongMaterial?(s(m,p),u(m,p)):p.isMeshStandardMaterial?(s(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,y)):p.isMeshMatcapMaterial?(s(m,p),g(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),v(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?c(m,p,_,x):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Fn&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Fn&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const _=e.get(p),x=_.envMap,y=_.envMapRotation;x&&(m.envMap.value=x,gr.copy(y),gr.x*=-1,gr.y*=-1,gr.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(gr.y*=-1,gr.z*=-1),m.envMapRotation.value.setFromMatrix4(ux.makeRotationFromEuler(gr)),m.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,_,x){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*_,m.scale.value=x*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function u(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function h(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,_){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Fn&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=_.texture,m.transmissionSamplerSize.value.set(_.width,_.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function v(m,p){const _=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(_.matrixWorld),m.nearDistance.value=_.shadow.camera.near,m.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function dx(n,e,t,i){let r={},s={},o=[];const a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(_,x){const y=x.program;i.uniformBlockBinding(_,y)}function l(_,x){let y=r[_.id];y===void 0&&(g(_),y=u(_),r[_.id]=y,_.addEventListener("dispose",m));const M=x.program;i.updateUBOMapping(_,M);const w=e.render.frame;s[_.id]!==w&&(d(_),s[_.id]=w)}function u(_){const x=h();_.__bindingPointIndex=x;const y=n.createBuffer(),M=_.__size,w=_.usage;return n.bindBuffer(n.UNIFORM_BUFFER,y),n.bufferData(n.UNIFORM_BUFFER,M,w),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,x,y),y}function h(){for(let _=0;_<a;_++)if(o.indexOf(_)===-1)return o.push(_),_;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(_){const x=r[_.id],y=_.uniforms,M=_.__cache;n.bindBuffer(n.UNIFORM_BUFFER,x);for(let w=0,A=y.length;w<A;w++){const C=Array.isArray(y[w])?y[w]:[y[w]];for(let S=0,E=C.length;S<E;S++){const L=C[S];if(f(L,w,S,M)===!0){const O=L.__offset,H=Array.isArray(L.value)?L.value:[L.value];let B=0;for(let Y=0;Y<H.length;Y++){const $=H[Y],W=v($);typeof $=="number"||typeof $=="boolean"?(L.__data[0]=$,n.bufferSubData(n.UNIFORM_BUFFER,O+B,L.__data)):$.isMatrix3?(L.__data[0]=$.elements[0],L.__data[1]=$.elements[1],L.__data[2]=$.elements[2],L.__data[3]=0,L.__data[4]=$.elements[3],L.__data[5]=$.elements[4],L.__data[6]=$.elements[5],L.__data[7]=0,L.__data[8]=$.elements[6],L.__data[9]=$.elements[7],L.__data[10]=$.elements[8],L.__data[11]=0):($.toArray(L.__data,B),B+=W.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,O,L.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(_,x,y,M){const w=_.value,A=x+"_"+y;if(M[A]===void 0)return typeof w=="number"||typeof w=="boolean"?M[A]=w:M[A]=w.clone(),!0;{const C=M[A];if(typeof w=="number"||typeof w=="boolean"){if(C!==w)return M[A]=w,!0}else if(C.equals(w)===!1)return C.copy(w),!0}return!1}function g(_){const x=_.uniforms;let y=0;const M=16;for(let A=0,C=x.length;A<C;A++){const S=Array.isArray(x[A])?x[A]:[x[A]];for(let E=0,L=S.length;E<L;E++){const O=S[E],H=Array.isArray(O.value)?O.value:[O.value];for(let B=0,Y=H.length;B<Y;B++){const $=H[B],W=v($),I=y%M,le=I%W.boundary,oe=I+le;y+=le,oe!==0&&M-oe<W.storage&&(y+=M-oe),O.__data=new Float32Array(W.storage/Float32Array.BYTES_PER_ELEMENT),O.__offset=y,y+=W.storage}}}const w=y%M;return w>0&&(y+=M-w),_.__size=y,_.__cache={},this}function v(_){const x={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(x.boundary=4,x.storage=4):_.isVector2?(x.boundary=8,x.storage=8):_.isVector3||_.isColor?(x.boundary=16,x.storage=12):_.isVector4?(x.boundary=16,x.storage=16):_.isMatrix3?(x.boundary=48,x.storage=48):_.isMatrix4?(x.boundary=64,x.storage=64):_.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",_),x}function m(_){const x=_.target;x.removeEventListener("dispose",m);const y=o.indexOf(x.__bindingPointIndex);o.splice(y,1),n.deleteBuffer(r[x.id]),delete r[x.id],delete s[x.id]}function p(){for(const _ in r)n.deleteBuffer(r[_]);o=[],r={},s={}}return{bind:c,update:l,dispose:p}}class fx{constructor(e={}){const{canvas:t=fp(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let f;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=i.getContextAttributes().alpha}else f=o;const g=new Uint32Array(4),v=new Int32Array(4);let m=null,p=null;const _=[],x=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Qi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const y=this;let M=!1;this._outputColorSpace=Mn;let w=0,A=0,C=null,S=-1,E=null;const L=new Kt,O=new Kt;let H=null;const B=new _t(0);let Y=0,$=t.width,W=t.height,I=1,le=null,oe=null;const K=new Kt(0,0,$,W),Ie=new Kt(0,0,$,W);let et=!1;const Ue=new bl;let ct=!1,te=!1;const he=new Vt,Te=new D,qe=new Kt,Ve={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let rt=!1;function Tt(){return C===null?I:1}let k=i;function me(P,q){return t.getContext(P,q)}try{const P={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${ul}`),t.addEventListener("webglcontextlost",Se,!1),t.addEventListener("webglcontextrestored",De,!1),t.addEventListener("webglcontextcreationerror",ge,!1),k===null){const q="webgl2";if(k=me(q,P),k===null)throw me(q)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(P){throw console.error("THREE.WebGLRenderer: "+P.message),P}let de,se,ce,Ee,pe,Me,Qe,tt,U,T,j,ee,fe,ne,Ne,ye,Ge,ze,Z,Re,Ke,Xe,Ae,Ye;function G(){de=new Sv(k),de.init(),Xe=new sx(k,de),se=new gv(k,de,e,Xe),ce=new ix(k,de),se.reversedDepthBuffer&&d&&ce.buffers.depth.setReversed(!0),Ee=new Tv(k),pe=new W_,Me=new rx(k,de,ce,pe,se,Xe,Ee),Qe=new _v(y),tt=new Mv(y),U=new Dm(k),Ae=new pv(k,U),T=new Ev(k,U,Ee,Ae),j=new Rv(k,T,U,Ee),Z=new Av(k,se,Me),ye=new vv(pe),ee=new G_(y,Qe,tt,de,se,Ae,ye),fe=new hx(y,pe),ne=new q_,Ne=new J_(de),ze=new fv(y,Qe,tt,ce,j,f,c),Ge=new tx(y,j,se),Ye=new dx(k,Ee,se,ce),Re=new mv(k,de,Ee),Ke=new wv(k,de,Ee),Ee.programs=ee.programs,y.capabilities=se,y.extensions=de,y.properties=pe,y.renderLists=ne,y.shadowMap=Ge,y.state=ce,y.info=Ee}G();const _e=new lx(y,k);this.xr=_e,this.getContext=function(){return k},this.getContextAttributes=function(){return k.getContextAttributes()},this.forceContextLoss=function(){const P=de.get("WEBGL_lose_context");P&&P.loseContext()},this.forceContextRestore=function(){const P=de.get("WEBGL_lose_context");P&&P.restoreContext()},this.getPixelRatio=function(){return I},this.setPixelRatio=function(P){P!==void 0&&(I=P,this.setSize($,W,!1))},this.getSize=function(P){return P.set($,W)},this.setSize=function(P,q,J=!0){if(_e.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}$=P,W=q,t.width=Math.floor(P*I),t.height=Math.floor(q*I),J===!0&&(t.style.width=P+"px",t.style.height=q+"px"),this.setViewport(0,0,P,q)},this.getDrawingBufferSize=function(P){return P.set($*I,W*I).floor()},this.setDrawingBufferSize=function(P,q,J){$=P,W=q,I=J,t.width=Math.floor(P*J),t.height=Math.floor(q*J),this.setViewport(0,0,P,q)},this.getCurrentViewport=function(P){return P.copy(L)},this.getViewport=function(P){return P.copy(K)},this.setViewport=function(P,q,J,Q){P.isVector4?K.set(P.x,P.y,P.z,P.w):K.set(P,q,J,Q),ce.viewport(L.copy(K).multiplyScalar(I).round())},this.getScissor=function(P){return P.copy(Ie)},this.setScissor=function(P,q,J,Q){P.isVector4?Ie.set(P.x,P.y,P.z,P.w):Ie.set(P,q,J,Q),ce.scissor(O.copy(Ie).multiplyScalar(I).round())},this.getScissorTest=function(){return et},this.setScissorTest=function(P){ce.setScissorTest(et=P)},this.setOpaqueSort=function(P){le=P},this.setTransparentSort=function(P){oe=P},this.getClearColor=function(P){return P.copy(ze.getClearColor())},this.setClearColor=function(){ze.setClearColor(...arguments)},this.getClearAlpha=function(){return ze.getClearAlpha()},this.setClearAlpha=function(){ze.setClearAlpha(...arguments)},this.clear=function(P=!0,q=!0,J=!0){let Q=0;if(P){let X=!1;if(C!==null){const ve=C.texture.format;X=ve===gl||ve===ml||ve===pl}if(X){const ve=C.texture.type,we=ve===_i||ve===wr||ve===Hs||ve===Gs||ve===dl||ve===fl,Oe=ze.getClearColor(),ke=ze.getClearAlpha(),je=Oe.r,Be=Oe.g,He=Oe.b;we?(g[0]=je,g[1]=Be,g[2]=He,g[3]=ke,k.clearBufferuiv(k.COLOR,0,g)):(v[0]=je,v[1]=Be,v[2]=He,v[3]=ke,k.clearBufferiv(k.COLOR,0,v))}else Q|=k.COLOR_BUFFER_BIT}q&&(Q|=k.DEPTH_BUFFER_BIT),J&&(Q|=k.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),k.clear(Q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Se,!1),t.removeEventListener("webglcontextrestored",De,!1),t.removeEventListener("webglcontextcreationerror",ge,!1),ze.dispose(),ne.dispose(),Ne.dispose(),pe.dispose(),Qe.dispose(),tt.dispose(),j.dispose(),Ae.dispose(),Ye.dispose(),ee.dispose(),_e.dispose(),_e.removeEventListener("sessionstart",Wn),_e.removeEventListener("sessionend",Lr),li.stop()};function Se(P){P.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),M=!0}function De(){console.log("THREE.WebGLRenderer: Context Restored."),M=!1;const P=Ee.autoReset,q=Ge.enabled,J=Ge.autoUpdate,Q=Ge.needsUpdate,X=Ge.type;G(),Ee.autoReset=P,Ge.enabled=q,Ge.autoUpdate=J,Ge.needsUpdate=Q,Ge.type=X}function ge(P){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",P.statusMessage)}function ue(P){const q=P.target;q.removeEventListener("dispose",ue),We(q)}function We(P){Je(P),pe.remove(P)}function Je(P){const q=pe.get(P).programs;q!==void 0&&(q.forEach(function(J){ee.releaseProgram(J)}),P.isShaderMaterial&&ee.releaseShaderCache(P))}this.renderBufferDirect=function(P,q,J,Q,X,ve){q===null&&(q=Ve);const we=X.isMesh&&X.matrixWorld.determinant()<0,Oe=io(P,q,J,Q,X);ce.setMaterial(Q,we);let ke=J.index,je=1;if(Q.wireframe===!0){if(ke=T.getWireframeAttribute(J),ke===void 0)return;je=2}const Be=J.drawRange,He=J.attributes.position;let ft=Be.start*je,Ct=(Be.start+Be.count)*je;ve!==null&&(ft=Math.max(ft,ve.start*je),Ct=Math.min(Ct,(ve.start+ve.count)*je)),ke!==null?(ft=Math.max(ft,0),Ct=Math.min(Ct,ke.count)):He!=null&&(ft=Math.max(ft,0),Ct=Math.min(Ct,He.count));const Gt=Ct-ft;if(Gt<0||Gt===1/0)return;Ae.setup(X,Q,Oe,J,ke);let Rt,Et=Re;if(ke!==null&&(Rt=U.get(ke),Et=Ke,Et.setIndex(Rt)),X.isMesh)Q.wireframe===!0?(ce.setLineWidth(Q.wireframeLinewidth*Tt()),Et.setMode(k.LINES)):Et.setMode(k.TRIANGLES);else if(X.isLine){let Ze=Q.linewidth;Ze===void 0&&(Ze=1),ce.setLineWidth(Ze*Tt()),X.isLineSegments?Et.setMode(k.LINES):X.isLineLoop?Et.setMode(k.LINE_LOOP):Et.setMode(k.LINE_STRIP)}else X.isPoints?Et.setMode(k.POINTS):X.isSprite&&Et.setMode(k.TRIANGLES);if(X.isBatchedMesh)if(X._multiDrawInstances!==null)Xs("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Et.renderMultiDrawInstances(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount,X._multiDrawInstances);else if(de.get("WEBGL_multi_draw"))Et.renderMultiDraw(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount);else{const Ze=X._multiDrawStarts,Ot=X._multiDrawCounts,xt=X._multiDrawCount,pn=ke?U.get(ke).bytesPerElement:1,mn=pe.get(Q).currentProgram.getUniforms();for(let gn=0;gn<xt;gn++)mn.setValue(k,"_gl_DrawID",gn),Et.render(Ze[gn]/pn,Ot[gn])}else if(X.isInstancedMesh)Et.renderInstances(ft,Gt,X.count);else if(J.isInstancedBufferGeometry){const Ze=J._maxInstanceCount!==void 0?J._maxInstanceCount:1/0,Ot=Math.min(J.instanceCount,Ze);Et.renderInstances(ft,Gt,Ot)}else Et.render(ft,Gt)};function At(P,q,J){P.transparent===!0&&P.side===pi&&P.forceSinglePass===!1?(P.side=Fn,P.needsUpdate=!0,ui(P,q,J),P.side=ir,P.needsUpdate=!0,ui(P,q,J),P.side=pi):ui(P,q,J)}this.compile=function(P,q,J=null){J===null&&(J=P),p=Ne.get(J),p.init(q),x.push(p),J.traverseVisible(function(X){X.isLight&&X.layers.test(q.layers)&&(p.pushLight(X),X.castShadow&&p.pushShadow(X))}),P!==J&&P.traverseVisible(function(X){X.isLight&&X.layers.test(q.layers)&&(p.pushLight(X),X.castShadow&&p.pushShadow(X))}),p.setupLights();const Q=new Set;return P.traverse(function(X){if(!(X.isMesh||X.isPoints||X.isLine||X.isSprite))return;const ve=X.material;if(ve)if(Array.isArray(ve))for(let we=0;we<ve.length;we++){const Oe=ve[we];At(Oe,J,X),Q.add(Oe)}else At(ve,J,X),Q.add(ve)}),p=x.pop(),Q},this.compileAsync=function(P,q,J=null){const Q=this.compile(P,q,J);return new Promise(X=>{function ve(){if(Q.forEach(function(we){pe.get(we).currentProgram.isReady()&&Q.delete(we)}),Q.size===0){X(P);return}setTimeout(ve,10)}de.get("KHR_parallel_shader_compile")!==null?ve():setTimeout(ve,10)})};let dt=null;function Gn(P){dt&&dt(P)}function Wn(){li.stop()}function Lr(){li.start()}const li=new Sd;li.setAnimationLoop(Gn),typeof self<"u"&&li.setContext(self),this.setAnimationLoop=function(P){dt=P,_e.setAnimationLoop(P),P===null?li.stop():li.start()},_e.addEventListener("sessionstart",Wn),_e.addEventListener("sessionend",Lr),this.render=function(P,q){if(q!==void 0&&q.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;if(P.matrixWorldAutoUpdate===!0&&P.updateMatrixWorld(),q.parent===null&&q.matrixWorldAutoUpdate===!0&&q.updateMatrixWorld(),_e.enabled===!0&&_e.isPresenting===!0&&(_e.cameraAutoUpdate===!0&&_e.updateCamera(q),q=_e.getCamera()),P.isScene===!0&&P.onBeforeRender(y,P,q,C),p=Ne.get(P,x.length),p.init(q),x.push(p),he.multiplyMatrices(q.projectionMatrix,q.matrixWorldInverse),Ue.setFromProjectionMatrix(he,gi,q.reversedDepth),te=this.localClippingEnabled,ct=ye.init(this.clippingPlanes,te),m=ne.get(P,_.length),m.init(),_.push(m),_e.enabled===!0&&_e.isPresenting===!0){const ve=y.xr.getDepthSensingMesh();ve!==null&&Jn(ve,q,-1/0,y.sortObjects)}Jn(P,q,0,y.sortObjects),m.finish(),y.sortObjects===!0&&m.sort(le,oe),rt=_e.enabled===!1||_e.isPresenting===!1||_e.hasDepthSensing()===!1,rt&&ze.addToRenderList(m,P),this.info.render.frame++,ct===!0&&ye.beginShadows();const J=p.state.shadowsArray;Ge.render(J,P,q),ct===!0&&ye.endShadows(),this.info.autoReset===!0&&this.info.reset();const Q=m.opaque,X=m.transmissive;if(p.setupLights(),q.isArrayCamera){const ve=q.cameras;if(X.length>0)for(let we=0,Oe=ve.length;we<Oe;we++){const ke=ve[we];ki(Q,X,P,ke)}rt&&ze.render(P);for(let we=0,Oe=ve.length;we<Oe;we++){const ke=ve[we];to(m,P,ke,ke.viewport)}}else X.length>0&&ki(Q,X,P,q),rt&&ze.render(P),to(m,P,q);C!==null&&A===0&&(Me.updateMultisampleRenderTarget(C),Me.updateRenderTargetMipmap(C)),P.isScene===!0&&P.onAfterRender(y,P,q),Ae.resetDefaultState(),S=-1,E=null,x.pop(),x.length>0?(p=x[x.length-1],ct===!0&&ye.setGlobalState(y.clippingPlanes,p.state.camera)):p=null,_.pop(),_.length>0?m=_[_.length-1]:m=null};function Jn(P,q,J,Q){if(P.visible===!1)return;if(P.layers.test(q.layers)){if(P.isGroup)J=P.renderOrder;else if(P.isLOD)P.autoUpdate===!0&&P.update(q);else if(P.isLight)p.pushLight(P),P.castShadow&&p.pushShadow(P);else if(P.isSprite){if(!P.frustumCulled||Ue.intersectsSprite(P)){Q&&qe.setFromMatrixPosition(P.matrixWorld).applyMatrix4(he);const we=j.update(P),Oe=P.material;Oe.visible&&m.push(P,we,Oe,J,qe.z,null)}}else if((P.isMesh||P.isLine||P.isPoints)&&(!P.frustumCulled||Ue.intersectsObject(P))){const we=j.update(P),Oe=P.material;if(Q&&(P.boundingSphere!==void 0?(P.boundingSphere===null&&P.computeBoundingSphere(),qe.copy(P.boundingSphere.center)):(we.boundingSphere===null&&we.computeBoundingSphere(),qe.copy(we.boundingSphere.center)),qe.applyMatrix4(P.matrixWorld).applyMatrix4(he)),Array.isArray(Oe)){const ke=we.groups;for(let je=0,Be=ke.length;je<Be;je++){const He=ke[je],ft=Oe[He.materialIndex];ft&&ft.visible&&m.push(P,we,ft,J,qe.z,He)}}else Oe.visible&&m.push(P,we,Oe,J,qe.z,null)}}const ve=P.children;for(let we=0,Oe=ve.length;we<Oe;we++)Jn(ve[we],q,J,Q)}function to(P,q,J,Q){const X=P.opaque,ve=P.transmissive,we=P.transparent;p.setupLightsView(J),ct===!0&&ye.setGlobalState(y.clippingPlanes,J),Q&&ce.viewport(L.copy(Q)),X.length>0&&sr(X,q,J),ve.length>0&&sr(ve,q,J),we.length>0&&sr(we,q,J),ce.buffers.depth.setTest(!0),ce.buffers.depth.setMask(!0),ce.buffers.color.setMask(!0),ce.setPolygonOffset(!1)}function ki(P,q,J,Q){if((J.isScene===!0?J.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[Q.id]===void 0&&(p.state.transmissionRenderTarget[Q.id]=new Tr(1,1,{generateMipmaps:!0,type:de.has("EXT_color_buffer_half_float")||de.has("EXT_color_buffer_float")?Qs:_i,minFilter:Ki,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:wt.workingColorSpace}));const ve=p.state.transmissionRenderTarget[Q.id],we=Q.viewport||L;ve.setSize(we.z*y.transmissionResolutionScale,we.w*y.transmissionResolutionScale);const Oe=y.getRenderTarget(),ke=y.getActiveCubeFace(),je=y.getActiveMipmapLevel();y.setRenderTarget(ve),y.getClearColor(B),Y=y.getClearAlpha(),Y<1&&y.setClearColor(16777215,.5),y.clear(),rt&&ze.render(J);const Be=y.toneMapping;y.toneMapping=Qi;const He=Q.viewport;if(Q.viewport!==void 0&&(Q.viewport=void 0),p.setupLightsView(Q),ct===!0&&ye.setGlobalState(y.clippingPlanes,Q),sr(P,J,Q),Me.updateMultisampleRenderTarget(ve),Me.updateRenderTargetMipmap(ve),de.has("WEBGL_multisampled_render_to_texture")===!1){let ft=!1;for(let Ct=0,Gt=q.length;Ct<Gt;Ct++){const Rt=q[Ct],Et=Rt.object,Ze=Rt.geometry,Ot=Rt.material,xt=Rt.group;if(Ot.side===pi&&Et.layers.test(Q.layers)){const pn=Ot.side;Ot.side=Fn,Ot.needsUpdate=!0,no(Et,J,Q,Ze,Ot,xt),Ot.side=pn,Ot.needsUpdate=!0,ft=!0}}ft===!0&&(Me.updateMultisampleRenderTarget(ve),Me.updateRenderTargetMipmap(ve))}y.setRenderTarget(Oe,ke,je),y.setClearColor(B,Y),He!==void 0&&(Q.viewport=He),y.toneMapping=Be}function sr(P,q,J){const Q=q.isScene===!0?q.overrideMaterial:null;for(let X=0,ve=P.length;X<ve;X++){const we=P[X],Oe=we.object,ke=we.geometry,je=we.group;let Be=we.material;Be.allowOverride===!0&&Q!==null&&(Be=Q),Oe.layers.test(J.layers)&&no(Oe,q,J,ke,Be,je)}}function no(P,q,J,Q,X,ve){P.onBeforeRender(y,q,J,Q,X,ve),P.modelViewMatrix.multiplyMatrices(J.matrixWorldInverse,P.matrixWorld),P.normalMatrix.getNormalMatrix(P.modelViewMatrix),X.onBeforeRender(y,q,J,Q,P,ve),X.transparent===!0&&X.side===pi&&X.forceSinglePass===!1?(X.side=Fn,X.needsUpdate=!0,y.renderBufferDirect(J,q,Q,X,P,ve),X.side=ir,X.needsUpdate=!0,y.renderBufferDirect(J,q,Q,X,P,ve),X.side=pi):y.renderBufferDirect(J,q,Q,X,P,ve),P.onAfterRender(y,q,J,Q,X,ve)}function ui(P,q,J){q.isScene!==!0&&(q=Ve);const Q=pe.get(P),X=p.state.lights,ve=p.state.shadowsArray,we=X.state.version,Oe=ee.getParameters(P,X.state,ve,q,J),ke=ee.getProgramCacheKey(Oe);let je=Q.programs;Q.environment=P.isMeshStandardMaterial?q.environment:null,Q.fog=q.fog,Q.envMap=(P.isMeshStandardMaterial?tt:Qe).get(P.envMap||Q.environment),Q.envMapRotation=Q.environment!==null&&P.envMap===null?q.environmentRotation:P.envMapRotation,je===void 0&&(P.addEventListener("dispose",ue),je=new Map,Q.programs=je);let Be=je.get(ke);if(Be!==void 0){if(Q.currentProgram===Be&&Q.lightsStateVersion===we)return vs(P,Oe),Be}else Oe.uniforms=ee.getUniforms(P),P.onBeforeCompile(Oe,y),Be=ee.acquireProgram(Oe,ke),je.set(ke,Be),Q.uniforms=Oe.uniforms;const He=Q.uniforms;return(!P.isShaderMaterial&&!P.isRawShaderMaterial||P.clipping===!0)&&(He.clippingPlanes=ye.uniform),vs(P,Oe),Q.needsLights=zi(P),Q.lightsStateVersion=we,Q.needsLights&&(He.ambientLightColor.value=X.state.ambient,He.lightProbe.value=X.state.probe,He.directionalLights.value=X.state.directional,He.directionalLightShadows.value=X.state.directionalShadow,He.spotLights.value=X.state.spot,He.spotLightShadows.value=X.state.spotShadow,He.rectAreaLights.value=X.state.rectArea,He.ltc_1.value=X.state.rectAreaLTC1,He.ltc_2.value=X.state.rectAreaLTC2,He.pointLights.value=X.state.point,He.pointLightShadows.value=X.state.pointShadow,He.hemisphereLights.value=X.state.hemi,He.directionalShadowMap.value=X.state.directionalShadowMap,He.directionalShadowMatrix.value=X.state.directionalShadowMatrix,He.spotShadowMap.value=X.state.spotShadowMap,He.spotLightMatrix.value=X.state.spotLightMatrix,He.spotLightMap.value=X.state.spotLightMap,He.pointShadowMap.value=X.state.pointShadowMap,He.pointShadowMatrix.value=X.state.pointShadowMatrix),Q.currentProgram=Be,Q.uniformsList=null,Be}function or(P){if(P.uniformsList===null){const q=P.currentProgram.getUniforms();P.uniformsList=Go.seqWithValue(q.seq,P.uniforms)}return P.uniformsList}function vs(P,q){const J=pe.get(P);J.outputColorSpace=q.outputColorSpace,J.batching=q.batching,J.batchingColor=q.batchingColor,J.instancing=q.instancing,J.instancingColor=q.instancingColor,J.instancingMorph=q.instancingMorph,J.skinning=q.skinning,J.morphTargets=q.morphTargets,J.morphNormals=q.morphNormals,J.morphColors=q.morphColors,J.morphTargetsCount=q.morphTargetsCount,J.numClippingPlanes=q.numClippingPlanes,J.numIntersection=q.numClipIntersection,J.vertexAlphas=q.vertexAlphas,J.vertexTangents=q.vertexTangents,J.toneMapping=q.toneMapping}function io(P,q,J,Q,X){q.isScene!==!0&&(q=Ve),Me.resetTextureUnits();const ve=q.fog,we=Q.isMeshStandardMaterial?q.environment:null,Oe=C===null?y.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:ds,ke=(Q.isMeshStandardMaterial?tt:Qe).get(Q.envMap||we),je=Q.vertexColors===!0&&!!J.attributes.color&&J.attributes.color.itemSize===4,Be=!!J.attributes.tangent&&(!!Q.normalMap||Q.anisotropy>0),He=!!J.morphAttributes.position,ft=!!J.morphAttributes.normal,Ct=!!J.morphAttributes.color;let Gt=Qi;Q.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(Gt=y.toneMapping);const Rt=J.morphAttributes.position||J.morphAttributes.normal||J.morphAttributes.color,Et=Rt!==void 0?Rt.length:0,Ze=pe.get(Q),Ot=p.state.lights;if(ct===!0&&(te===!0||P!==E)){const tn=P===E&&Q.id===S;ye.setState(Q,P,tn)}let xt=!1;Q.version===Ze.__version?(Ze.needsLights&&Ze.lightsStateVersion!==Ot.state.version||Ze.outputColorSpace!==Oe||X.isBatchedMesh&&Ze.batching===!1||!X.isBatchedMesh&&Ze.batching===!0||X.isBatchedMesh&&Ze.batchingColor===!0&&X.colorTexture===null||X.isBatchedMesh&&Ze.batchingColor===!1&&X.colorTexture!==null||X.isInstancedMesh&&Ze.instancing===!1||!X.isInstancedMesh&&Ze.instancing===!0||X.isSkinnedMesh&&Ze.skinning===!1||!X.isSkinnedMesh&&Ze.skinning===!0||X.isInstancedMesh&&Ze.instancingColor===!0&&X.instanceColor===null||X.isInstancedMesh&&Ze.instancingColor===!1&&X.instanceColor!==null||X.isInstancedMesh&&Ze.instancingMorph===!0&&X.morphTexture===null||X.isInstancedMesh&&Ze.instancingMorph===!1&&X.morphTexture!==null||Ze.envMap!==ke||Q.fog===!0&&Ze.fog!==ve||Ze.numClippingPlanes!==void 0&&(Ze.numClippingPlanes!==ye.numPlanes||Ze.numIntersection!==ye.numIntersection)||Ze.vertexAlphas!==je||Ze.vertexTangents!==Be||Ze.morphTargets!==He||Ze.morphNormals!==ft||Ze.morphColors!==Ct||Ze.toneMapping!==Gt||Ze.morphTargetsCount!==Et)&&(xt=!0):(xt=!0,Ze.__version=Q.version);let pn=Ze.currentProgram;xt===!0&&(pn=ui(Q,q,X));let mn=!1,gn=!1,zn=!1;const Pt=pn.getUniforms(),wn=Ze.uniforms;if(ce.useProgram(pn.program)&&(mn=!0,gn=!0,zn=!0),Q.id!==S&&(S=Q.id,gn=!0),mn||E!==P){ce.buffers.depth.getReversed()&&P.reversedDepth!==!0&&(P._reversedDepth=!0,P.updateProjectionMatrix()),Pt.setValue(k,"projectionMatrix",P.projectionMatrix),Pt.setValue(k,"viewMatrix",P.matrixWorldInverse);const $t=Pt.map.cameraPosition;$t!==void 0&&$t.setValue(k,Te.setFromMatrixPosition(P.matrixWorld)),se.logarithmicDepthBuffer&&Pt.setValue(k,"logDepthBufFC",2/(Math.log(P.far+1)/Math.LN2)),(Q.isMeshPhongMaterial||Q.isMeshToonMaterial||Q.isMeshLambertMaterial||Q.isMeshBasicMaterial||Q.isMeshStandardMaterial||Q.isShaderMaterial)&&Pt.setValue(k,"isOrthographic",P.isOrthographicCamera===!0),E!==P&&(E=P,gn=!0,zn=!0)}if(X.isSkinnedMesh){Pt.setOptional(k,X,"bindMatrix"),Pt.setOptional(k,X,"bindMatrixInverse");const tn=X.skeleton;tn&&(tn.boneTexture===null&&tn.computeBoneTexture(),Pt.setValue(k,"boneTexture",tn.boneTexture,Me))}X.isBatchedMesh&&(Pt.setOptional(k,X,"batchingTexture"),Pt.setValue(k,"batchingTexture",X._matricesTexture,Me),Pt.setOptional(k,X,"batchingIdTexture"),Pt.setValue(k,"batchingIdTexture",X._indirectTexture,Me),Pt.setOptional(k,X,"batchingColorTexture"),X._colorsTexture!==null&&Pt.setValue(k,"batchingColorTexture",X._colorsTexture,Me));const Tn=J.morphAttributes;if((Tn.position!==void 0||Tn.normal!==void 0||Tn.color!==void 0)&&Z.update(X,J,pn),(gn||Ze.receiveShadow!==X.receiveShadow)&&(Ze.receiveShadow=X.receiveShadow,Pt.setValue(k,"receiveShadow",X.receiveShadow)),Q.isMeshGouraudMaterial&&Q.envMap!==null&&(wn.envMap.value=ke,wn.flipEnvMap.value=ke.isCubeTexture&&ke.isRenderTargetTexture===!1?-1:1),Q.isMeshStandardMaterial&&Q.envMap===null&&q.environment!==null&&(wn.envMapIntensity.value=q.environmentIntensity),gn&&(Pt.setValue(k,"toneMappingExposure",y.toneMappingExposure),Ze.needsLights&&_s(wn,zn),ve&&Q.fog===!0&&fe.refreshFogUniforms(wn,ve),fe.refreshMaterialUniforms(wn,Q,I,W,p.state.transmissionRenderTarget[P.id]),Go.upload(k,or(Ze),wn,Me)),Q.isShaderMaterial&&Q.uniformsNeedUpdate===!0&&(Go.upload(k,or(Ze),wn,Me),Q.uniformsNeedUpdate=!1),Q.isSpriteMaterial&&Pt.setValue(k,"center",X.center),Pt.setValue(k,"modelViewMatrix",X.modelViewMatrix),Pt.setValue(k,"normalMatrix",X.normalMatrix),Pt.setValue(k,"modelMatrix",X.matrixWorld),Q.isShaderMaterial||Q.isRawShaderMaterial){const tn=Q.uniformsGroups;for(let $t=0,Ir=tn.length;$t<Ir;$t++){const yi=tn[$t];Ye.update(yi,pn),Ye.bind(yi,pn)}}return pn}function _s(P,q){P.ambientLightColor.needsUpdate=q,P.lightProbe.needsUpdate=q,P.directionalLights.needsUpdate=q,P.directionalLightShadows.needsUpdate=q,P.pointLights.needsUpdate=q,P.pointLightShadows.needsUpdate=q,P.spotLights.needsUpdate=q,P.spotLightShadows.needsUpdate=q,P.rectAreaLights.needsUpdate=q,P.hemisphereLights.needsUpdate=q}function zi(P){return P.isMeshLambertMaterial||P.isMeshToonMaterial||P.isMeshPhongMaterial||P.isMeshStandardMaterial||P.isShadowMaterial||P.isShaderMaterial&&P.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(P,q,J){const Q=pe.get(P);Q.__autoAllocateDepthBuffer=P.resolveDepthBuffer===!1,Q.__autoAllocateDepthBuffer===!1&&(Q.__useRenderToTexture=!1),pe.get(P.texture).__webglTexture=q,pe.get(P.depthTexture).__webglTexture=Q.__autoAllocateDepthBuffer?void 0:J,Q.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(P,q){const J=pe.get(P);J.__webglFramebuffer=q,J.__useDefaultFramebuffer=q===void 0};const ar=k.createFramebuffer();this.setRenderTarget=function(P,q=0,J=0){C=P,w=q,A=J;let Q=!0,X=null,ve=!1,we=!1;if(P){const ke=pe.get(P);if(ke.__useDefaultFramebuffer!==void 0)ce.bindFramebuffer(k.FRAMEBUFFER,null),Q=!1;else if(ke.__webglFramebuffer===void 0)Me.setupRenderTarget(P);else if(ke.__hasExternalTextures)Me.rebindTextures(P,pe.get(P.texture).__webglTexture,pe.get(P.depthTexture).__webglTexture);else if(P.depthBuffer){const He=P.depthTexture;if(ke.__boundDepthTexture!==He){if(He!==null&&pe.has(He)&&(P.width!==He.image.width||P.height!==He.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Me.setupDepthRenderbuffer(P)}}const je=P.texture;(je.isData3DTexture||je.isDataArrayTexture||je.isCompressedArrayTexture)&&(we=!0);const Be=pe.get(P).__webglFramebuffer;P.isWebGLCubeRenderTarget?(Array.isArray(Be[q])?X=Be[q][J]:X=Be[q],ve=!0):P.samples>0&&Me.useMultisampledRTT(P)===!1?X=pe.get(P).__webglMultisampledFramebuffer:Array.isArray(Be)?X=Be[J]:X=Be,L.copy(P.viewport),O.copy(P.scissor),H=P.scissorTest}else L.copy(K).multiplyScalar(I).floor(),O.copy(Ie).multiplyScalar(I).floor(),H=et;if(J!==0&&(X=ar),ce.bindFramebuffer(k.FRAMEBUFFER,X)&&Q&&ce.drawBuffers(P,X),ce.viewport(L),ce.scissor(O),ce.setScissorTest(H),ve){const ke=pe.get(P.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_CUBE_MAP_POSITIVE_X+q,ke.__webglTexture,J)}else if(we){const ke=q;for(let je=0;je<P.textures.length;je++){const Be=pe.get(P.textures[je]);k.framebufferTextureLayer(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0+je,Be.__webglTexture,J,ke)}}else if(P!==null&&J!==0){const ke=pe.get(P.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,ke.__webglTexture,J)}S=-1},this.readRenderTargetPixels=function(P,q,J,Q,X,ve,we,Oe=0){if(!(P&&P.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ke=pe.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&we!==void 0&&(ke=ke[we]),ke){ce.bindFramebuffer(k.FRAMEBUFFER,ke);try{const je=P.textures[Oe],Be=je.format,He=je.type;if(!se.textureFormatReadable(Be)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!se.textureTypeReadable(He)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}q>=0&&q<=P.width-Q&&J>=0&&J<=P.height-X&&(P.textures.length>1&&k.readBuffer(k.COLOR_ATTACHMENT0+Oe),k.readPixels(q,J,Q,X,Xe.convert(Be),Xe.convert(He),ve))}finally{const je=C!==null?pe.get(C).__webglFramebuffer:null;ce.bindFramebuffer(k.FRAMEBUFFER,je)}}},this.readRenderTargetPixelsAsync=async function(P,q,J,Q,X,ve,we,Oe=0){if(!(P&&P.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ke=pe.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&we!==void 0&&(ke=ke[we]),ke)if(q>=0&&q<=P.width-Q&&J>=0&&J<=P.height-X){ce.bindFramebuffer(k.FRAMEBUFFER,ke);const je=P.textures[Oe],Be=je.format,He=je.type;if(!se.textureFormatReadable(Be))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!se.textureTypeReadable(He))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ft=k.createBuffer();k.bindBuffer(k.PIXEL_PACK_BUFFER,ft),k.bufferData(k.PIXEL_PACK_BUFFER,ve.byteLength,k.STREAM_READ),P.textures.length>1&&k.readBuffer(k.COLOR_ATTACHMENT0+Oe),k.readPixels(q,J,Q,X,Xe.convert(Be),Xe.convert(He),0);const Ct=C!==null?pe.get(C).__webglFramebuffer:null;ce.bindFramebuffer(k.FRAMEBUFFER,Ct);const Gt=k.fenceSync(k.SYNC_GPU_COMMANDS_COMPLETE,0);return k.flush(),await pp(k,Gt,4),k.bindBuffer(k.PIXEL_PACK_BUFFER,ft),k.getBufferSubData(k.PIXEL_PACK_BUFFER,0,ve),k.deleteBuffer(ft),k.deleteSync(Gt),ve}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(P,q=null,J=0){const Q=Math.pow(2,-J),X=Math.floor(P.image.width*Q),ve=Math.floor(P.image.height*Q),we=q!==null?q.x:0,Oe=q!==null?q.y:0;Me.setTexture2D(P,0),k.copyTexSubImage2D(k.TEXTURE_2D,J,0,0,we,Oe,X,ve),ce.unbindTexture()};const Bi=k.createFramebuffer(),Dr=k.createFramebuffer();this.copyTextureToTexture=function(P,q,J=null,Q=null,X=0,ve=null){ve===null&&(X!==0?(Xs("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ve=X,X=0):ve=0);let we,Oe,ke,je,Be,He,ft,Ct,Gt;const Rt=P.isCompressedTexture?P.mipmaps[ve]:P.image;if(J!==null)we=J.max.x-J.min.x,Oe=J.max.y-J.min.y,ke=J.isBox3?J.max.z-J.min.z:1,je=J.min.x,Be=J.min.y,He=J.isBox3?J.min.z:0;else{const Tn=Math.pow(2,-X);we=Math.floor(Rt.width*Tn),Oe=Math.floor(Rt.height*Tn),P.isDataArrayTexture?ke=Rt.depth:P.isData3DTexture?ke=Math.floor(Rt.depth*Tn):ke=1,je=0,Be=0,He=0}Q!==null?(ft=Q.x,Ct=Q.y,Gt=Q.z):(ft=0,Ct=0,Gt=0);const Et=Xe.convert(q.format),Ze=Xe.convert(q.type);let Ot;q.isData3DTexture?(Me.setTexture3D(q,0),Ot=k.TEXTURE_3D):q.isDataArrayTexture||q.isCompressedArrayTexture?(Me.setTexture2DArray(q,0),Ot=k.TEXTURE_2D_ARRAY):(Me.setTexture2D(q,0),Ot=k.TEXTURE_2D),k.pixelStorei(k.UNPACK_FLIP_Y_WEBGL,q.flipY),k.pixelStorei(k.UNPACK_PREMULTIPLY_ALPHA_WEBGL,q.premultiplyAlpha),k.pixelStorei(k.UNPACK_ALIGNMENT,q.unpackAlignment);const xt=k.getParameter(k.UNPACK_ROW_LENGTH),pn=k.getParameter(k.UNPACK_IMAGE_HEIGHT),mn=k.getParameter(k.UNPACK_SKIP_PIXELS),gn=k.getParameter(k.UNPACK_SKIP_ROWS),zn=k.getParameter(k.UNPACK_SKIP_IMAGES);k.pixelStorei(k.UNPACK_ROW_LENGTH,Rt.width),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,Rt.height),k.pixelStorei(k.UNPACK_SKIP_PIXELS,je),k.pixelStorei(k.UNPACK_SKIP_ROWS,Be),k.pixelStorei(k.UNPACK_SKIP_IMAGES,He);const Pt=P.isDataArrayTexture||P.isData3DTexture,wn=q.isDataArrayTexture||q.isData3DTexture;if(P.isDepthTexture){const Tn=pe.get(P),tn=pe.get(q),$t=pe.get(Tn.__renderTarget),Ir=pe.get(tn.__renderTarget);ce.bindFramebuffer(k.READ_FRAMEBUFFER,$t.__webglFramebuffer),ce.bindFramebuffer(k.DRAW_FRAMEBUFFER,Ir.__webglFramebuffer);for(let yi=0;yi<ke;yi++)Pt&&(k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,pe.get(P).__webglTexture,X,He+yi),k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,pe.get(q).__webglTexture,ve,Gt+yi)),k.blitFramebuffer(je,Be,we,Oe,ft,Ct,we,Oe,k.DEPTH_BUFFER_BIT,k.NEAREST);ce.bindFramebuffer(k.READ_FRAMEBUFFER,null),ce.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else if(X!==0||P.isRenderTargetTexture||pe.has(P)){const Tn=pe.get(P),tn=pe.get(q);ce.bindFramebuffer(k.READ_FRAMEBUFFER,Bi),ce.bindFramebuffer(k.DRAW_FRAMEBUFFER,Dr);for(let $t=0;$t<ke;$t++)Pt?k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,Tn.__webglTexture,X,He+$t):k.framebufferTexture2D(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,Tn.__webglTexture,X),wn?k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,tn.__webglTexture,ve,Gt+$t):k.framebufferTexture2D(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,tn.__webglTexture,ve),X!==0?k.blitFramebuffer(je,Be,we,Oe,ft,Ct,we,Oe,k.COLOR_BUFFER_BIT,k.NEAREST):wn?k.copyTexSubImage3D(Ot,ve,ft,Ct,Gt+$t,je,Be,we,Oe):k.copyTexSubImage2D(Ot,ve,ft,Ct,je,Be,we,Oe);ce.bindFramebuffer(k.READ_FRAMEBUFFER,null),ce.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else wn?P.isDataTexture||P.isData3DTexture?k.texSubImage3D(Ot,ve,ft,Ct,Gt,we,Oe,ke,Et,Ze,Rt.data):q.isCompressedArrayTexture?k.compressedTexSubImage3D(Ot,ve,ft,Ct,Gt,we,Oe,ke,Et,Rt.data):k.texSubImage3D(Ot,ve,ft,Ct,Gt,we,Oe,ke,Et,Ze,Rt):P.isDataTexture?k.texSubImage2D(k.TEXTURE_2D,ve,ft,Ct,we,Oe,Et,Ze,Rt.data):P.isCompressedTexture?k.compressedTexSubImage2D(k.TEXTURE_2D,ve,ft,Ct,Rt.width,Rt.height,Et,Rt.data):k.texSubImage2D(k.TEXTURE_2D,ve,ft,Ct,we,Oe,Et,Ze,Rt);k.pixelStorei(k.UNPACK_ROW_LENGTH,xt),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,pn),k.pixelStorei(k.UNPACK_SKIP_PIXELS,mn),k.pixelStorei(k.UNPACK_SKIP_ROWS,gn),k.pixelStorei(k.UNPACK_SKIP_IMAGES,zn),ve===0&&q.generateMipmaps&&k.generateMipmap(Ot),ce.unbindTexture()},this.initRenderTarget=function(P){pe.get(P).__webglFramebuffer===void 0&&Me.setupRenderTarget(P)},this.initTexture=function(P){P.isCubeTexture?Me.setTextureCube(P,0):P.isData3DTexture?Me.setTexture3D(P,0):P.isDataArrayTexture||P.isCompressedArrayTexture?Me.setTexture2DArray(P,0):Me.setTexture2D(P,0),ce.unbindTexture()},this.resetState=function(){w=0,A=0,C=null,ce.reset(),Ae.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return gi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=wt._getDrawingBufferColorSpace(e),t.unpackColorSpace=wt._getUnpackColorSpace()}}const mh={type:"change"},Ll={type:"start"},Rd={type:"end"},ko=new oa,gh=new Pi,px=Math.cos(70*dn.DEG2RAD),rn=new D,Un=2*Math.PI,Nt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},rc=1e-6;class mx extends Pm{constructor(e,t=null){super(e,t),this.state=Nt.NONE,this.target=new D,this.cursor=new D,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:ns.ROTATE,MIDDLE:ns.DOLLY,RIGHT:ns.PAN},this.touches={ONE:Qr.ROTATE,TWO:Qr.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new D,this._lastQuaternion=new hn,this._lastTargetPosition=new D,this._quat=new hn().setFromUnitVectors(e.up,new D(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Gu,this._sphericalDelta=new Gu,this._scale=1,this._panOffset=new D,this._rotateStart=new xe,this._rotateEnd=new xe,this._rotateDelta=new xe,this._panStart=new xe,this._panEnd=new xe,this._panDelta=new xe,this._dollyStart=new xe,this._dollyEnd=new xe,this._dollyDelta=new xe,this._dollyDirection=new D,this._mouse=new xe,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=vx.bind(this),this._onPointerDown=gx.bind(this),this._onPointerUp=_x.bind(this),this._onContextMenu=wx.bind(this),this._onMouseWheel=bx.bind(this),this._onKeyDown=Mx.bind(this),this._onTouchStart=Sx.bind(this),this._onTouchMove=Ex.bind(this),this._onMouseDown=xx.bind(this),this._onMouseMove=yx.bind(this),this._interceptControlDown=Tx.bind(this),this._interceptControlUp=Ax.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(mh),this.update(),this.state=Nt.NONE}update(e=null){const t=this.object.position;rn.copy(t).sub(this.target),rn.applyQuaternion(this._quat),this._spherical.setFromVector3(rn),this.autoRotate&&this.state===Nt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,r=this.maxAzimuthAngle;isFinite(i)&&isFinite(r)&&(i<-Math.PI?i+=Un:i>Math.PI&&(i-=Un),r<-Math.PI?r+=Un:r>Math.PI&&(r-=Un),i<=r?this._spherical.theta=Math.max(i,Math.min(r,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+r)/2?Math.max(i,this._spherical.theta):Math.min(r,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let s=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),s=o!=this._spherical.radius}if(rn.setFromSpherical(this._spherical),rn.applyQuaternion(this._quatInverse),t.copy(this.target).add(rn),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){const a=rn.length();o=this._clampDistance(a*this._scale);const c=a-o;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),s=!!c}else if(this.object.isOrthographicCamera){const a=new D(this._mouse.x,this._mouse.y,0);a.unproject(this.object);const c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),s=c!==this.object.zoom;const l=new D(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(a),this.object.updateMatrixWorld(),o=rn.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(ko.origin.copy(this.object.position),ko.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(ko.direction))<px?this.object.lookAt(this.target):(gh.setFromNormalAndCoplanarPoint(this.object.up,this.target),ko.intersectPlane(gh,this.target))))}else if(this.object.isOrthographicCamera){const o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),s=!0)}return this._scale=1,this._performCursorZoom=!1,s||this._lastPosition.distanceToSquared(this.object.position)>rc||8*(1-this._lastQuaternion.dot(this.object.quaternion))>rc||this._lastTargetPosition.distanceToSquared(this.target)>rc?(this.dispatchEvent(mh),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Un/60*this.autoRotateSpeed*e:Un/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){rn.setFromMatrixColumn(t,0),rn.multiplyScalar(-e),this._panOffset.add(rn)}_panUp(e,t){this.screenSpacePanning===!0?rn.setFromMatrixColumn(t,1):(rn.setFromMatrixColumn(t,0),rn.crossVectors(this.object.up,rn)),rn.multiplyScalar(e),this._panOffset.add(rn)}_pan(e,t){const i=this.domElement;if(this.object.isPerspectiveCamera){const r=this.object.position;rn.copy(r).sub(this.target);let s=rn.length();s*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*s/i.clientHeight,this.object.matrix),this._panUp(2*t*s/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),r=e-i.left,s=t-i.top,o=i.width,a=i.height;this._mouse.x=r/o*2-1,this._mouse.y=-(s/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Un*this._rotateDelta.x/t.clientHeight),this._rotateUp(Un*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(Un*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-Un*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(Un*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-Un*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._rotateStart.set(i,r)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panStart.set(i,r)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,r=e.pageY-t.y,s=Math.sqrt(i*i+r*r);this._dollyStart.set(0,s)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),r=.5*(e.pageX+i.x),s=.5*(e.pageY+i.y);this._rotateEnd.set(r,s)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Un*this._rotateDelta.x/t.clientHeight),this._rotateUp(Un*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panEnd.set(i,r)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,r=e.pageY-t.y,s=Math.sqrt(i*i+r*r);this._dollyEnd.set(0,s),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const o=(e.pageX+t.x)*.5,a=(e.pageY+t.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new xe,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function gx(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n)))}function vx(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function _x(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Rd),this.state=Nt.NONE;break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function xx(n){let e;switch(n.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case ns.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=Nt.DOLLY;break;case ns.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=Nt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=Nt.ROTATE}break;case ns.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=Nt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=Nt.PAN}break;default:this.state=Nt.NONE}this.state!==Nt.NONE&&this.dispatchEvent(Ll)}function yx(n){switch(this.state){case Nt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case Nt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case Nt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function bx(n){this.enabled===!1||this.enableZoom===!1||this.state!==Nt.NONE||(n.preventDefault(),this.dispatchEvent(Ll),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(Rd))}function Mx(n){this.enabled!==!1&&this._handleKeyDown(n)}function Sx(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case Qr.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=Nt.TOUCH_ROTATE;break;case Qr.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=Nt.TOUCH_PAN;break;default:this.state=Nt.NONE}break;case 2:switch(this.touches.TWO){case Qr.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=Nt.TOUCH_DOLLY_PAN;break;case Qr.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=Nt.TOUCH_DOLLY_ROTATE;break;default:this.state=Nt.NONE}break;default:this.state=Nt.NONE}this.state!==Nt.NONE&&this.dispatchEvent(Ll)}function Ex(n){switch(this._trackPointer(n),this.state){case Nt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case Nt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case Nt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case Nt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=Nt.NONE}}function wx(n){this.enabled!==!1&&n.preventDefault()}function Tx(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Ax(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const Ps=new D;function qn(n,e,t,i,r,s){const o=2*Math.PI*r/4,a=Math.max(s-2*r,0),c=Math.PI/4;Ps.copy(e),Ps[i]=0,Ps.normalize();const l=.5*o/(o+a),u=1-Ps.angleTo(n)/c;return Math.sign(Ps[t])===1?u*l:a/(o+a)+l+l*(1-u)}class ca extends Xt{constructor(e=1,t=1,i=1,r=2,s=.1){const o=r*2+1;if(s=Math.min(e/2,t/2,i/2,s),super(1,1,1,o,o,o),this.type="RoundedBoxGeometry",this.parameters={width:e,height:t,depth:i,segments:r,radius:s},o===1)return;const a=this.toNonIndexed();this.index=null,this.attributes.position=a.attributes.position,this.attributes.normal=a.attributes.normal,this.attributes.uv=a.attributes.uv;const c=new D,l=new D,u=new D(e,t,i).divideScalar(2).subScalar(s),h=this.attributes.position.array,d=this.attributes.normal.array,f=this.attributes.uv.array,g=h.length/6,v=new D,m=.5/o;for(let p=0,_=0;p<h.length;p+=3,_+=2)switch(c.fromArray(h,p),l.copy(c),l.x-=Math.sign(l.x)*m,l.y-=Math.sign(l.y)*m,l.z-=Math.sign(l.z)*m,l.normalize(),h[p+0]=u.x*Math.sign(c.x)+l.x*s,h[p+1]=u.y*Math.sign(c.y)+l.y*s,h[p+2]=u.z*Math.sign(c.z)+l.z*s,d[p+0]=l.x,d[p+1]=l.y,d[p+2]=l.z,Math.floor(p/g)){case 0:v.set(1,0,0),f[_+0]=qn(v,l,"z","y",s,i),f[_+1]=1-qn(v,l,"y","z",s,t);break;case 1:v.set(-1,0,0),f[_+0]=1-qn(v,l,"z","y",s,i),f[_+1]=1-qn(v,l,"y","z",s,t);break;case 2:v.set(0,1,0),f[_+0]=1-qn(v,l,"x","z",s,e),f[_+1]=qn(v,l,"z","x",s,i);break;case 3:v.set(0,-1,0),f[_+0]=1-qn(v,l,"x","z",s,e),f[_+1]=1-qn(v,l,"z","x",s,i);break;case 4:v.set(0,0,1),f[_+0]=1-qn(v,l,"x","y",s,e),f[_+1]=1-qn(v,l,"y","x",s,t);break;case 5:v.set(0,0,-1),f[_+0]=qn(v,l,"x","y",s,e),f[_+1]=1-qn(v,l,"y","x",s,t);break}}static fromJSON(e){return new ca(e.width,e.height,e.depth,e.segments,e.radius)}}const vh=Math.PI*2;function Rx(n,e){const t=e.clone().normalize();let i=2*Math.atan2(n.x*t.x+n.y*t.y+n.z*t.z,n.w);for(;i>Math.PI;)i-=vh;for(;i<-Math.PI;)i+=vh;return i}function Cx(n,e,t,i=.168){const r=e.clone().multiply(t.clone().invert()).normalize(),s=Math.min(i*.6,.1),o=new D(0,s,0).applyQuaternion(r);return{position:n.clone().sub(o),quaternion:r}}function Wo(n,e,t=.055){if(!n)return null;let i=null,r=t;for(const s of e){const o=n.distanceTo(s.position);o<=r&&(i=s,r=o)}return i}function Px({getModel:n=()=>({}),getTerminals:e=()=>[],onProbe:t=()=>{},onBeforeConnect:i=()=>{},onConnect:r=()=>{},onDisconnect:s=()=>{},onChange:o=()=>{},onAction:a=()=>{},onGraphCursor:c=()=>{},onHold:l=()=>{},snapRadius:u=.055}={}){const h=new Map,d=new Set,f=new Map;function g(_,x,y={}){var C,S,E,L;if(!x||d.has(_)||h.has(_))return!1;const M=x.resource||`${x.kind}:${x.channel||x.id}`;if(f.has(M))return!1;const w=n(),A={input:_,target:x,resource:M,position:(C=y.position)==null?void 0:C.clone(),startPosition:(S=y.position)==null?void 0:S.clone(),turn:0,lastValue:void 0};if(x.kind==="dial"){if(A.startValue=(E=w.parameters)==null?void 0:E[x.parameter],A.values=x.values||((L=w.options)==null?void 0:L[x.parameter]),!A.values&&!Number.isFinite(A.startValue))return!1;A.values&&!A.values.includes(A.startValue)&&(A.startValue=A.values[0]),A.lastValue=A.startValue}return h.set(_,A),f.set(M,_),l("start",A),x.kind==="probe"&&t(x.channel,null),x.kind==="plug"&&Number.isInteger(x.wireIndex)&&s(x.wireIndex),(x.kind==="button"||x.kind==="switch")&&a(x.action),x.kind==="screen"&&Number.isFinite(y.fraction)&&c(dn.clamp(y.fraction,0,1),y.panelIndex||0),!0}function v(_,x={}){var M;const y=h.get(_);if(!y)return!1;if(x.position&&(y.position=x.position.clone()),x.quaternion&&(y.quaternion=x.quaternion.clone()),y.target.kind==="dial"&&Number.isFinite(x.turn)){y.turn+=x.turn;const w=y.target;let A;if((M=y.values)!=null&&M.length){const C=Math.round(y.turn/(w.detentRadians||Math.PI/12)),S=dn.clamp(y.values.indexOf(y.startValue)+C,0,y.values.length-1);A=y.values[S]}else{const C=w.step||1;A=dn.clamp(y.startValue+Math.round(y.turn/(w.detentRadians||Math.PI/12))*C,w.min??-1/0,w.max??1/0),A=Number(A.toPrecision(12))}A!==y.lastValue&&(y.lastValue=A,o(w.parameter,A))}return y.target.kind==="screen"&&Number.isFinite(x.fraction)&&c(dn.clamp(x.fraction,0,1),x.panelIndex||0),l("move",y),!0}function m(_,x={},y=!1){d.delete(_);const M=h.get(_);if(!M)return null;x.position&&(M.position=x.position.clone()),h.delete(_),f.delete(M.resource);const w=y?null:Wo(M.position,e(),u);let A={kind:y?"cancelled":"released",terminal:null};if(M.target.kind==="probe"&&(t(M.target.channel,(w==null?void 0:w.id)||null),A={kind:w?"connected":"loose",terminal:(w==null?void 0:w.id)||null}),M.target.kind==="terminal"||M.target.kind==="plug"){const C=M.target.from||M.target.terminal;if(!y&&w&&w.id!==C)i(C,w,M),r(C,w.id),A={kind:"connected",terminal:w.id};else{const S=M.startPosition&&M.position&&M.startPosition.distanceTo(M.position)<.018;A={kind:M.target.kind==="terminal"&&S?"cancelled":"loose",terminal:null}}}return l("end",M,A),A}function p(){const _=[...h.keys()];for(const x of _)m(x,{},!0),d.add(x)}return{begin:g,move:v,end:(_,x)=>m(_,x),cancelAll:p,release(_){d.delete(_)},block(_){h.has(_)&&m(_,{},!0),d.add(_)},hold:_=>h.get(_),holds:h,isHeld:_=>f.has(_)}}function Lx(n,e,{bounds:t={minX:-3.2,maxX:3.2,minZ:-3.8,maxZ:2.4},obstacles:i=[],radius:r=.19}={}){const s=n.clone(),o=Math.max(1,Math.ceil(Math.hypot(e.x,e.z)/.04)),a=e.x/o,c=e.z/o,l=(h,d,f)=>{const g=[h-(f.minX-r),f.maxX+r-h,d-(f.minZ-r),f.maxZ+r-d];return Math.max(0,Math.min(...g))},u=(h,d)=>i.some(f=>{const g=l(h,d,f),v=l(s.x,s.z,f);if(g<=0)return!1;if(v<=0)return!0;if(g<v-1e-10)return!1;const m=(f.minX+f.maxX)/2,p=(f.minZ+f.maxZ)/2,_=(s.x-m)**2+(s.z-p)**2,x=(h-m)**2+(d-p)**2;return g>v+1e-10||x<=_+1e-10});for(let h=0;h<o;h++){const d=dn.clamp(s.x+a,t.minX+r,t.maxX-r);u(d,s.z)||(s.x=d);const f=dn.clamp(s.z+c,t.minZ+r,t.maxZ-r);u(s.x,f)||(s.z=f)}return s}function Dx(n,e,t){const i=new hn().setFromAxisAngle(new D(0,1,0),t);n.position.sub(e).applyQuaternion(i).add(e),n.quaternion.premultiply(i),n.updateMatrixWorld(!0)}function Ix({speed:n=.8,snapAngle:e=Math.PI/6,...t}={}){let i=!1,r=!1;return{reset(){i=!1,r=!0},update({rig:s,headPosition:o,headQuaternion:a,left:c=[0,0],right:l=0,dt:u=0,enabled:h=!0}){if(!h)return i=!1,r=!0,!1;const d=Math.max(Math.abs(c[0]||0),Math.abs(c[1]||0),Math.abs(l))<.2;if(!i){if(!d)return!1;i=!0}Math.abs(l)<.25&&(r=!1);let f=0;Math.abs(l)>.7&&!r&&(f=-Math.sign(l)*e,Dx(s,o,f),r=!0);const g=Math.abs(c[0]||0)>.18?c[0]:0,v=Math.abs(c[1]||0)>.18?c[1]:0;if(!g&&!v)return!1;const m=new D(0,0,-1).applyQuaternion(a).applyAxisAngle(new D(0,1,0),f);m.y=0,m.lengthSq()<.001?m.set(0,0,-1):m.normalize();const _=new D(-m.z,0,m.x).multiplyScalar(g).addScaledVector(m,-v);_.length()>1&&_.normalize(),_.multiplyScalar(n*dn.clamp(u,0,.05));const x=Lx(o,_,t);return s.position.add(x.sub(o)),s.updateMatrixWorld(!0),!0}}}function _h(n,e=!1){const t=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),r=new Set(Object.keys(n[0].morphAttributes)),s={},o={},a=n[0].morphTargetsRelative,c=new an;let l=0;for(let u=0;u<n.length;++u){const h=n[u];let d=0;if(t!==(h.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const f in h.attributes){if(!i.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;s[f]===void 0&&(s[f]=[]),s[f].push(h.attributes[f]),d++}if(d!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(a!==h.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const f in h.morphAttributes){if(!r.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;o[f]===void 0&&(o[f]=[]),o[f].push(h.morphAttributes[f])}if(e){let f;if(t)f=h.index.count;else if(h.attributes.position!==void 0)f=h.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,f,u),l+=f}}if(t){let u=0;const h=[];for(let d=0;d<n.length;++d){const f=n[d].index;for(let g=0;g<f.count;++g)h.push(f.getX(g)+u);u+=n[d].attributes.position.count}c.setIndex(h)}for(const u in s){const h=xh(s[u]);if(!h)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;c.setAttribute(u,h)}for(const u in o){const h=o[u][0].length;if(h===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[u]=[];for(let d=0;d<h;++d){const f=[];for(let v=0;v<o[u].length;++v)f.push(o[u][v][d]);const g=xh(f);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;c.morphAttributes[u].push(g)}}return c}function xh(n){let e,t,i,r=-1,s=0;for(let l=0;l<n.length;++l){const u=n[l];if(e===void 0&&(e=u.array.constructor),e!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=u.itemSize),t!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=u.normalized),i!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(r===-1&&(r=u.gpuType),r!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;s+=u.count*t}const o=new e(s),a=new Kn(o,t,i);let c=0;for(let l=0;l<n.length;++l){const u=n[l];if(u.isInterleavedBufferAttribute){const h=c/t;for(let d=0,f=u.count;d<f;d++)for(let g=0;g<t;g++){const v=u.getComponent(d,g);a.setComponent(d+h,g,v)}}else o.set(u.array,c);c+=u.count*t}return r!==void 0&&(a.gpuType=r),a}const Bt={case:"#d5d6d1",face:"#e8e8e2",dark:"#262a2c",rubber:"#363b3c",metal:"#a5aaab",red:"#ad2f2c",black:"#25292b",ch1:"#d5b348",ch2:"#64a5b5"},en=(n,e=3)=>Number.isFinite(Number(n))&&n!==null?Number(n).toFixed(e).replace(/\.?0+$/,"")||"0":"—",Cd=n=>Number(n)>=1e3?`${en(Number(n)/1e3,2)} kΩ`:`${en(Number(n),1)} Ω`,nl=n=>n!=null&&n.isVector3?n.clone():Array.isArray(n)?new D(...n):new D((n==null?void 0:n.x)||0,(n==null?void 0:n.y)||0,(n==null?void 0:n.z)||0);function Wt(n,e,t,i,{size:r,width:s,align:o="left",weight:a=700,family:c="Arial, sans-serif"}){const l=String(e);let u=r;n.font=`${a} ${u}px ${c}`,s&&n.measureText(l).width>s&&(u*=s/n.measureText(l).width,n.font=`${a} ${u}px ${c}`),n.textAlign=o,n.fillText(l,t,i)}function Ux(n,e,t){const i=[];for(const r of String(e).split(/\s+/)){const s=i.length-1;s>=0&&n.measureText(`${i[s]} ${r}`).width<=t?i[s]+=` ${r}`:i.push(r)}return i}function Fi(n){const e=new Zt;e.name=n;const t=[],i={},r=new Set,s=new Set,o=new Set;let a=!1;const c=(C,S={})=>{const E=new Cl({color:C,roughness:.66,metalness:.03,...S});return r.add(E),E},l={case:c(Bt.case),face:c(Bt.face),dark:c(Bt.dark),rubber:c(Bt.rubber,{roughness:.87}),metal:c(Bt.metal,{metalness:.8,roughness:.27}),red:c(Bt.red),black:c(Bt.black)};function u(C,S,E=e,L=[0,0,0]){s.add(C);const O=new En(C,S);return O.position.copy(nl(L)),O.castShadow=!0,O.receiveShadow=!0,E.add(O),O}const h=(C,S,E,L,O,H,B=.002)=>u(B<=5e-4?new Xt(C,S,E):new ca(C,S,E,2,Math.min(B,C/4,S/4,E/4)),L,O,H);function d(C,S,E,L,O,H=24){const B=new st(C,C,S,H);return B.rotateX(Math.PI/2),u(B,E,L,O)}function f(C,S,E=e){const L=new on;return L.name=C,L.position.copy(nl(S)),E.add(L),i[C]=L,L}function g(C,S){const E={object:C,id:`${n}:${t.length}`,axis:"z",...S};return C.userData.equipmentTarget=E,t.push(E),E}function v(C,S,E,{pixels:L=[768,320],background:O="#dbe6cb",foreground:H="#102018"}={}){const B=document.createElement("canvas");B.width=L[0],B.height=Math.round(L[0]*S/C);const Y=B.getContext("2d"),$=new Kc(B);$.colorSpace=Mn,$.anisotropy=8;const W=new Xn({map:$,toneMapped:!1});r.add(W),o.add($);const I=u(new Ui(C,S),W,e,E);I.castShadow=!1;let le=null;return{object:I,canvas:B,ctx:Y,texture:$,draw(oe,K){const Ie=JSON.stringify(oe);Ie!==le&&(le=Ie,Y.fillStyle=O,Y.fillRect(0,0,B.width,B.height),Y.fillStyle=H,Y.textBaseline="middle",Y.textAlign="left",K(Y,B.width,B.height),$.needsUpdate=!0)}}}function m(C,S,E,L,{size:O=52,color:H="#172120",background:B="#e8e8e2",align:Y="center"}={}){const $=v(S,E,L,{pixels:[Math.round(128*S/E),128],background:B,foreground:H});return $.draw(C,(W,I,le)=>{Wt(W,C,Y==="center"?I/2:8,le/2,{size:le*.88,width:I-16,align:Y})}),$}function p(C,S,E,L=e){d(.0022,.001,l.metal,L,[C,S,E],12);const O=h(.003,5e-4,3e-4,l.dark,L,[C,S,E+65e-5],1e-4);O.rotation.z=.5}function _(C,S,E){h(C,S-.008,E,l.case,e,[0,S/2+.004,0],.008),h(C-.008,S-.014,.006,l.face,e,[0,S/2+.005,E/2],.004);for(const L of[-C/2+.014,C/2-.014]){for(const O of[.024,S-.018])p(L,O,E/2+.0038);for(const O of[-E/2+.02,E/2-.02])h(.025,.009,.032,l.rubber,e,[L,.0045,O],.002)}for(let L=0;L<12;L++)h(.035,6e-4,.002,l.dark,e,[C/2-.042,S+4e-4,-E/2+.022+L*.006],15e-5);return E/2+.004}function x(C,S,E,L,O,{bnc:H=!1,action:B,channel:Y}={}){const $=c(O);if(d(H?.0083:.007,H?.008:.003,$,e,[S,E,L+.002]),d(H?.0065:.0048,H?.009:.002,l.metal,e,[S,E,L+.006]),d(H?.0042:.0031,.001,l.dark,e,[S,E,L+(H?.011:.0075)]),H)for(const I of[-1,1])d(.001,.004,l.metal,e,[S+I*.006,E,L+.009],10);const W=f(C,[S,E,L+.012]);if(B){const I=d(.012,.007,l.face,e,[S,E,L+.004]);I.visible=!1,g(I,{kind:"probe",label:C,action:B,channel:Y}),g(e.children[e.children.indexOf(W)-1],{kind:"probe",label:C,action:B,channel:Y})}return W}function y(C,S,E,L,O,{radius:H=.011,values:B=Ut[S],min:Y,max:$,step:W=1,color:I=Bt.dark}={}){const le=new Zt;le.position.set(E,L,O),e.add(le),d(H+.003,.0016,l.metal,le,[0,0,0]);const oe=new Zt;oe.position.z=.003,oe.userData.equipmentMoving=!0,le.add(oe);const K=c(I,{roughness:.79}),Ie=d(H,.016,K,oe,[0,0,.008],32),et=[];for(let te=0;te<28;te++){const he=te/28*Math.PI*2,Te=new st(5e-4,5e-4,.012,6);Te.rotateX(Math.PI/2),Te.translate(Math.cos(he)*H,Math.sin(he)*H,.008),et.push(Te)}u(_h(et),K,oe),et.forEach(te=>te.dispose()),h(.0014,H*.65,7e-4,l.face,oe,[0,H*.49,.0164],15e-5);for(let te=0;te<11;te++){const he=-Math.PI*.75+te/10*Math.PI*1.5,Te=h(6e-4,te%5===0?.003:.0018,3e-4,l.dark,le,[Math.sin(he)*(H+.006),Math.cos(he)*(H+.006),8e-4],1e-4);Te.rotation.z=-he}const Ue=g(Ie,{kind:"dial",label:C,parameter:S,values:B,min:Y??(B==null?void 0:B[0]),max:$??(B==null?void 0:B.at(-1)),step:W});Ie.userData.equipmentTarget=Ue,oe.traverse(te=>{te.isMesh&&(te.userData.equipmentTarget=Ue)});function ct(te){const he=B==null?void 0:B.indexOf(te),Te=B&&he>=0?he/Math.max(1,B.length-1):Number.isFinite(te)&&Number.isFinite(Ue.min)&&Number.isFinite(Ue.max)?dn.clamp((te-Ue.min)/(Ue.max-Ue.min||1),0,1):.5;oe.rotation.z=(.75-Te*1.5)*Math.PI,Ue.value=te}return{descriptor:Ue,set:ct,rotor:oe}}function M(C,S,E,L,O,{color:H="#6f7974",width:B=.025,height:Y=.012}={}){const $=h(B,Y,.007,c(H),e,[E,L,O+.004],.002);return g($,{kind:"button",label:C,action:S}),$}function w(){if(!a){a=!0;for(const C of[...s,...r,...o])C.dispose();e.removeFromParent()}}function A(){var L;const C=new Set(t.map(O=>O.object)),S=new Map;e.updateMatrixWorld(!0);const E=e.matrixWorld.clone().invert();e.traverse(O=>{if(!O.isMesh||C.has(O)||Array.isArray(O.material))return;for(let B=O.parent;B&&B!==e;B=B.parent)if(B.userData.equipmentMoving)return;const H=S.get(O.material)||[];H.push(O),S.set(O.material,H)});for(const[O,H]of S){if(H.length<2)continue;const B=H.map(I=>{const le=I.geometry.index?I.geometry.toNonIndexed():I.geometry.clone();return le.applyMatrix4(new Vt().multiplyMatrices(E,I.matrixWorld)),le}),Y=_h(B);if(B.forEach(I=>I.dispose()),!Y)continue;const $=u(Y,O),W=(L=H.find(I=>I.userData.equipmentTarget))==null?void 0:L.userData.equipmentTarget;W&&($.userData.equipmentTarget=W);for(const I of H)I.removeFromParent(),I.geometry.dispose(),s.delete(I.geometry)}}return{group:e,targets:t,anchors:i,m:l,material:c,mesh:u,box:h,cylinder:d,screen:v,text:m,screw:p,enclosure:_,socket:x,dial:y,button:M,anchor:f,target:g,finish:A,dispose:w}}function Nx({id:n="multimeter",label:e="DIGITAL MULTIMETER"}={}){const t=Fi(n),{group:i,m:r}=t;t.box(.11,.213,.046,t.material("#b49a49",{roughness:.88}),i,[0,.112,0],.012),t.box(.096,.198,.008,r.dark,i,[0,.112,.024],.008),t.box(.09,.063,.004,r.black,i,[0,.172,.03],.003);const s=t.screen(.084,.057,[0,.172,.0325],{pixels:[840,570]});t.text("MULTIMETER",.084,.01,[0,.209,.029],{background:Bt.dark,color:"#f5f7ef"});const o=t.dial("Meter","meterMode",0,.106,.031,{radius:.02,values:["off","vdc"]});t.text("OFF",.024,.01,[-.027,.078,.031],{background:Bt.dark,color:"#d7d9d1"}),t.text("V⎓",.023,.011,[.028,.078,.031],{background:Bt.dark,color:"#d7d9d1"}),t.socket("COM",-.025,.042,.031,Bt.black),t.socket("V",.025,.042,.031,Bt.red),t.text("COM          V",.085,.011,[0,.023,.031],{background:Bt.dark,color:"#e0e1d8"});const a=t.box(.067,.1,.006,r.dark,i,[0,.055,-.061],.003);a.rotation.x=-.4;for(const l of[-.044,.044])t.box(.014,.044,.006,r.rubber,i,[l,.022,.025],.003);function c(l={}){const u=l.measurement||{},h=l.meterMode||"vdc";o.set(h);const d=u.probeReady?u.probeVoltage:null;s.draw([h,d,l.module],(f,g,v)=>{h!=="off"&&(Wt(f,l.module==="opamp"?"V SAMPLE":"DC V",28,v*.14,{size:v*.16,width:g-56}),Wt(f,d===null?"— —":en(d,3),g-26,v*.54,{size:v*.55,width:g-52,align:"right",family:"Arial, sans-serif"}),d===null&&Wt(f,"CONNECT PROBES",g/2,v*.87,{size:v*.13,width:g-40,align:"center"}))})}return t.finish(),c(),{group:i,targets:t.targets,anchors:t.anchors,update:c,dispose:t.dispose}}function Dl(n,e,t){const i={l:100,r:30,t:78,b:138},r=52,s=(e-i.t-i.b-r*(t-1))/t;return Array.from({length:t},(o,a)=>({panel:a,left:i.l/n,top:(i.t+a*(s+r))/e,width:(n-i.l-i.r)/n,height:s/e}))}function Ox(n){return`${{"Capacitor voltage":"V","Inductor voltage":"V","Storage current":"I","Stored energy":"E","Calculated load power":"P"}[n.name]||n.name||""} ${en(n.value,3)} ${n.unit||""}`.trim()}function Pd(n,e,t,i,r){var p,_,x,y,M;n.fillStyle="#071015",n.fillRect(0,0,e,t);const o=((p=i==null?void 0:i.panels)!=null&&p.length?i.panels:[i]).filter(Boolean).slice(0,3),a=Dl(e,t,o.length||1),c=r.recorder?r.recorder==="transient"?r.playing?"ACQUIRING":"PAUSED":"CALCULATED · WIRING":r.scopeRunning===!1?r.scopeStale?"HOLD · OLD SETTINGS":"HOLD":"RUN";n.fillStyle="#f1faf5",Wt(n,c,20,29,{size:30,width:e*.56});const l=Number.isFinite(r.timeDiv)?`${en(r.timeDiv,3)} ms/div`:((i==null?void 0:i.xLabel)||"TIME").replace("Elapsed circuit time","Time").replace("Load resistance","Load");if(Wt(n,l,e-22,29,{size:30,width:e*.41,align:"right"}),!o.length){Wt(n,"CONNECT THE CHANNELS",e/2,t/2,{size:36,width:e-60,align:"center"});return}const u=["#ffe27b","#79e4f6","#dfbfff"];for(let w=0;w<o.length;w++){const A=o[w],C=a[w],S=C.left*e,E=C.top*t,L=C.width*e,O=C.height*t;n.strokeStyle="#344750",n.lineWidth=1.5;const H=A.xDivisions||4,B=A.yDivisions||4;for(let I=0;I<=H;I++)n.beginPath(),n.moveTo(S+L*I/H,E),n.lineTo(S+L*I/H,E+O),n.stroke();for(let I=0;I<=B;I++)n.beginPath(),n.moveTo(S,E+O*I/B),n.lineTo(S+L,E+O*I/B),n.stroke();n.fillStyle="#f1faf5";const Y=A.yTicks||[];for(const[I,le]of Y.entries())o.length>1&&I!==0&&I!==Math.floor(Y.length/2)&&I!==Y.length-1||Wt(n,le.label,S-12,E+(1-le.position)*O,{size:32,width:S-20,align:"right"});for(const[I,le]of(A.xTicks||[]).entries())n.fillStyle=i.interaction==="source"?u[I%u.length]:"#f1faf5",Wt(n,le.label,S+le.position*L,E+O+24,{size:31,width:Math.max(150,L/5),align:"center"});const $=r.recorder?A.yLabel:A.title;n.fillStyle=u[w%u.length],Wt(n,$||A.yLabel||"",S+12,E-22,{size:31,width:L-24}),n.save(),n.beginPath(),n.rect(S,E,L,O),n.clip();for(const[I,le]of(A.series||[]).entries()){n.strokeStyle=u[o.length>1?w:I%u.length],n.lineWidth=i.interaction==="source"?12:5,n.lineCap="round",n.lineJoin="round",n.beginPath();let oe=!1;for(const K of le.points||[]){if(!Number.isFinite(K[0])||!Number.isFinite(K[1])){oe=!1;continue}const Ie=S+K[0]*L,et=E+(1-K[1])*O;oe?n.lineTo(Ie,et):(n.moveTo(Ie,et),oe=!0)}if(n.stroke(),((_=le.points)==null?void 0:_.length)===1){const[K,Ie]=le.points[0];Number.isFinite(K)&&Number.isFinite(Ie)&&(n.fillStyle=n.strokeStyle,n.beginPath(),n.arc(S+K*L,E+(1-Ie)*O,6,0,Math.PI*2),n.fill())}}if(Number.isFinite((x=A.reference)==null?void 0:x.x)){const I=S+A.reference.x*L;n.strokeStyle="#bacabb",n.lineWidth=2,n.setLineDash([8,6]),n.beginPath(),n.moveTo(I,E),n.lineTo(I,E+O),n.stroke(),n.setLineDash([]),n.fillStyle="#d5e5d7",Wt(n,A.reference.label||"",Math.min(S+L-60,I+12),E+25,{size:28,width:100})}if(!(A.series||[]).some(I=>{var le;return(le=I.points)==null?void 0:le.length})){n.fillStyle="#f5faf4",n.font="700 32px Arial, sans-serif";const I=Ux(n,r.scopeError||A.subtitle||"No acquired signal",L-44).slice(0,2);for(const[le,oe]of I.entries())Wt(n,oe,S+L/2,E+O/2+(le-(I.length-1)/2)*38,{size:32,align:"center"})}const W=A.cursor||A.marker;if(W&&Number.isFinite(W.x)){const I=S+dn.clamp(W.x,0,1)*L;n.strokeStyle="#f4fff7",n.lineWidth=3,n.setLineDash([9,7]),n.beginPath(),n.moveTo(I,E),n.lineTo(I,E+O),n.stroke(),n.setLineDash([]),Number.isFinite(W.y)&&(n.fillStyle="#f4fff7",n.beginPath(),n.arc(I,E+(1-W.y)*O,7,0,Math.PI*2),n.fill())}n.restore()}const h=(i==null?void 0:i.cursor)||((y=o.find(w=>w.cursor))==null?void 0:y.cursor),d=(M=h==null?void 0:h.readings)!=null&&M.length?h.readings.map(Ox):r.readings||[],f=t-94;n.fillStyle="#172b31",n.fillRect(0,f,e,94),n.fillStyle="#f6fff7";const g=h==null?void 0:h.xLabel,m=(g?[g,d.join("   ·   ")]:d.length>2?[d.slice(0,2).join("   ·   "),d.slice(2).join("   ·   ")]:[...d]).slice(0,2);m.length||m.push(r.scopeError?"CHECK CONNECTIONS":r.recorder?"Select a point to read it":"CONNECT THE CHANNELS"),m.forEach((w,A)=>Wt(n,w,22,f+(m.length===1?47:25+A*43),{size:35,width:e-44}))}function Fx({id:n="oscilloscope",label:e="OSCILLOSCOPE"}={}){const t=Fi(n),i=t.enclosure(.43,.245,.18);t.text(e,.27,.014,[-.044,.224,i+7e-4],{align:"left",size:45}),t.box(.278,.18,.007,t.m.dark,t.group,[-.066,.127,i+.0015],.004);const r=t.screen(.266,.17,[-.066,.128,i+.0055],{pixels:[1064,680],background:"#071015"}),s=t.target(r.object,{kind:"screen",label:"Scope",action:"scope-screen",bounds:[]}),o=t.dial("Time/div","timeDiv",.108,.182,i,{radius:.014});t.text("TIME / DIV",.074,.011,[.109,.213,i+5e-4]);const a=t.dial("CH1 volts/div","ch1Scale",.099,.104,i,{color:"#807341"}),c=t.dial("CH2 volts/div","ch2Scale",.163,.104,i,{color:"#3f6e7b"});t.text("CH1",.038,.012,[.099,.137,i+6e-4]),t.text("CH2",.038,.012,[.163,.137,i+6e-4]),t.text("VOLTS / DIV",.1,.011,[.13,.077,i+6e-4]);const l=t.dial("Trigger level","triggerLevel",.171,.182,i,{radius:.008});t.text("TRIGGER",.052,.011,[.17,.212,i+6e-4]);const u=t.button("Trigger edge","set:triggerEdge:falling",.171,.148,i,{width:.028}),h=t.screen(.043,.01,[.171,.16,i+7e-4],{pixels:[400,100],background:Bt.face});t.button("Run / Hold","scope-toggle",-.054,.02,i,{width:.03,color:"#5f7567"}),t.text("RUN / HOLD",.066,.008,[-.055,.04,i+5e-4],{size:42}),t.button("Autoscale","scope-autoscale",.014,.02,i,{width:.026}),t.text("AUTO",.042,.008,[.014,.04,i+5e-4],{size:48}),t.socket("CH1",.1,.037,i,Bt.ch1,{bnc:!0,action:"tool:ch1",channel:"ch1"}),t.socket("CH2",.164,.037,i,Bt.ch2,{bnc:!0,action:"tool:ch2",channel:"ch2"});function d(f={}){var p,_,x,y,M;const g=f.parameters||{};o.set(g.timeDiv),a.set(g.ch1Scale),c.set(g.ch2Scale),l.set(g.triggerLevel),u.userData.equipmentTarget.action=`set:triggerEdge:${g.triggerEdge==="falling"?"rising":"falling"}`,h.draw(g.triggerEdge,(w,A,C)=>Wt(w,g.triggerEdge==="falling"?"FALL":"RISE",A/2,C/2,{size:C*.85,width:A-16,align:"center"})),s.bounds=Dl(r.canvas.width,r.canvas.height,Math.min(3,((_=(p=f.graph)==null?void 0:p.panels)==null?void 0:_.length)||1));const v=(x=f.rawGraph)==null?void 0:x.scope,m=v?{...g,timeDiv:v.timeDiv,ch1Scale:v.channels.ch1.scale,ch2Scale:v.channels.ch2.scale,scopeRunning:v.running,scopeStale:v.stale,scopeError:v.error,readings:[`CH1 ${en(v.channels.ch1.peak,2)} V pk  ·  CH2 ${en(v.channels.ch2.peak,2)} V pk`,`TRIGGER ${((y=v.trigger)==null?void 0:y.edge)==="falling"?"↓":"↑"} ${en((M=v.trigger)==null?void 0:M.level,2)} V`]}:g;r.draw([f.graph,m.timeDiv,m.ch1Scale,m.ch2Scale,m.scopeRunning,m.scopeStale,m.scopeError,m.readings],(w,A,C)=>Pd(w,A,C,f.graph,m))}return t.finish(),d(),{group:t.group,targets:t.targets,anchors:t.anchors,screen:r,update:d,dispose:t.dispose}}function yh({id:n="lab-recorder",module:e="thevenin"}={}){const t=Fi(n),i=t.enclosure(.43,.245,.18);t.text("LAB RECORDER",.3,.014,[-.038,.224,i+7e-4],{align:"left"}),t.box(.402,.187,.007,t.m.dark,t.group,[0,.119,i+.0015],.004);const r=t.screen(.391,.177,[0,.119,i+.0055],{pixels:[1280,580],background:"#071015"}),s=t.target(r.object,{kind:"screen",label:"Lab recorder",action:"scope-screen",bounds:[]});let o=0,a={},c=[];if(e==="transient")for(const[h,d]of["VOLTAGE","CURRENT","ENERGY"].entries()){const f=-.135+h*.135,g=t.button(d,`recorder-panel:${h}`,f,.013,i,{width:.11,color:"#47565b"}),v=t.screen(.102,.009,[f,.013,i+.0077],{pixels:[1020,90],background:"#47565b",foreground:"#ffffff"});v.object.userData.equipmentTarget=g.userData.equipmentTarget,c.push({text:v,label:d,index:h})}function l(h={}){var _,x,y;a=h;const d=h.parameters||{},f=h.measurement||{};let g=h.graph;e==="transient"&&((_=g==null?void 0:g.panels)!=null&&_.length)&&(o=Math.min(o,g.panels.length-1),g={...g.panels[o],panels:void 0}),s.bounds=Dl(r.canvas.width,r.canvas.height,1).map(M=>({...M,panel:e==="transient"?o:0}));const v=M=>`${M>=0?"+":""}${en(M,2)}`;let m=[];if(e==="thevenin"&&(m=f.ok?[`${Cd(d.load)}  ·  ${en(f.voltage,3)} V`,`${en(f.current*1e3,3)} mA  ·  ${en(f.power*1e3,3)} mW`]:["CONNECT CIRCUIT"]),e==="superposition"){const M=((x=h.rawGraph)==null?void 0:x.bars)||[];m=[M.slice(0,2).map((w,A)=>`${A?"B":"A"} ${Number.isFinite(w.value)?v(w.value):"—"} mA`).join("  ·  "),`BOTH ${Number.isFinite((y=M[2])==null?void 0:y.value)?v(M[2].value):"—"} mA`]}if(e==="transient"){const M=[f.voltage,f.current*1e3,f.energy*1e3],w=["V","mA","mJ"];m=f.ok?[`${en(d.time*1e3,3)} ms  ·  ${en(M[o],3)} ${w[o]}`,`${d.charging?"SOURCE":"RETURN"}  ·  ${en((d.acquiredTime||0)*1e3,3)} ms acquired`]:["CONNECT CIRCUIT"]}for(const M of c)M.text.draw(o===M.index,(w,A,C)=>{w.fillStyle=o===M.index?"#ecf7ec":"#47565b",w.fillRect(0,0,A,C),w.fillStyle=o===M.index?"#14251d":"#ffffff",Wt(w,M.label,A/2,C/2,{size:C*.88,width:A-20,align:"center"})});const p={recorder:e,playing:d.playing,readings:m};r.draw([g,p],(M,w,A)=>Pd(M,w,A,g,p))}function u(h){return e!=="transient"||!Number.isInteger(h)||h<0||h>2?!1:(o=h,l(a),!0)}return t.finish(),l(),{group:t.group,targets:t.targets,anchors:t.anchors,screen:r,module:e,selectPanel:u,update:l,dispose:t.dispose}}function kx({id:n="power-supply",label:e="DC POWER SUPPLY",parameter:t="equivalentVoltage",fixedValue:i=null,polarity:r=1,positiveTerminal:s="+",negativeTerminal:o="−"}={}){const a=Fi(n),c=a.enclosure(.22,.186,.2);a.text(e,.183,.014,[0,.168,c+5e-4],{size:46}),a.box(.194,.071,.004,a.m.dark,a.group,[0,.124,c],.003);const l=a.screen(.186,.063,[0,.124,c+.0025],{background:"#071612",foreground:"#d8ffe0",pixels:[1116,378]}),u=t==="nortonCurrent",h=i===null?a.dial(u?"Current":"Voltage",t,.059,.059,c,{radius:.014}):null;a.text(i===null?u?"CURRENT":"VOLTAGE":"FIXED",.07,.009,[.057,.083,c+4e-4]),a.socket(o,-.067,.046,c,Bt.black),a.socket(s,-.02,.046,c,Bt.red),a.text("−        +",.09,.011,[-.044,.026,c+5e-4],{size:64});function d(f={}){var y;const g=i??((y=f.parameters)==null?void 0:y[t])??f.value;h==null||h.set(g);const v=f.parameters||{},m=t==="v1"?"a":t==="v2"?"b":null,p=f.module==="superposition"&&m&&v.sourceMode&&v.sourceMode!=="both"&&v.sourceMode!==m,_=p&&v.replacement==="open",x=p?0:Number.isFinite(g)?g*r:g;l.draw([x,t,p,_],(M,w,A)=>{Wt(M,_?"OPEN":`${en(x,2)} ${u?"mA":"V"}`,w/2,A*.43,{size:A*.72,width:w-48,align:"center"}),Wt(M,_?"DISCONNECTED":p?"SHORT":t==="rail"?"LINKED RAILS":"OUTPUT",w/2,A*.86,{size:A*.17,width:w-40,align:"center"})})}return a.finish(),d(),{group:a.group,targets:a.targets,anchors:a.anchors,update:d,dispose:a.dispose}}function zx({id:n="generator",label:e="FUNCTION GENERATOR"}={}){const t=Fi(n),i=t.enclosure(.28,.135,.16);t.text(e,.238,.012,[0,.118,i+5e-4],{size:48}),t.box(.167,.086,.004,t.m.dark,t.group,[-.049,.064,i],.003);const r=t.screen(.159,.078,[-.049,.064,i+.0025],{pixels:[954,468],background:"#071612",foreground:"#e5ffe5"}),s=t.dial("Frequency","frequency",.064,.078,i,{radius:.012}),o=t.dial("Amplitude","amplitude",.112,.078,i,{radius:.01});t.text("Hz",.027,.009,[.063,.104,i+7e-4]),t.text("V pk",.032,.009,[.111,.104,i+7e-4]),t.socket("OUT",.082,.028,i,Bt.metal,{bnc:!0}),t.text("SINE OUT",.055,.008,[.082,.011,i+6e-4],{size:45});function a(c={}){const l=c.parameters||{};s.set(l.frequency),o.set(l.amplitude),r.draw([l.frequency,l.amplitude],(u,h,d)=>{Wt(u,`${en(l.frequency,1)} Hz`,h/2,d*.27,{size:d*.35,width:h-44,align:"center"}),Wt(u,`${en(l.amplitude,2)} V pk`,h/2,d*.65,{size:d*.33,width:h-44,align:"center"}),Wt(u,"SINE · 0 V OFFSET",h/2,d*.92,{size:d*.1,width:h-40,align:"center"})})}return t.finish(),a(),{group:t.group,targets:t.targets,anchors:t.anchors,update:a,dispose:t.dispose}}function Bx({id:n="resistance-box",label:e="RESISTANCE",parameter:t="load",values:i=Ut[t]}={}){const r=Fi(n),s=r.enclosure(.18,.14,.11),o=String(e).toLowerCase().replace(/[ₜₕₙ]/g,h=>({"ₜ":"t","ₕ":"h","ₙ":"n"})[h]),a=t==="rf"?"Rf":t==="rin"?"Rin":t==="load"?"RL":t==="equivalentResistance"?/norton|rn|r_n|rₙ/.test(o)?"Rn":"Rth":t==="resistance"?"R":e;r.text(a,.144,.032,[0,.116,s+7e-4]);const c=r.dial(a,t,.052,.059,s,{radius:.023,values:i});r.box(.096,.041,.003,r.m.dark,r.group,[-.03,.067,s],.002);const l=r.screen(.09,.035,[-.03,.067,s+.0017],{pixels:[900,350],background:"#e1ead5"});r.socket("A",-.06,.025,s,Bt.red),r.socket("B",-.014,.025,s,Bt.black);function u(h={}){var f;const d=((f=h.parameters)==null?void 0:f[t])??h.value;c.set(d),l.draw(d,(g,v,m)=>Wt(g,Cd(d),v/2,m/2,{size:m*.86,width:v-24,align:"center"}))}return r.finish(),u(),{group:r.group,targets:r.targets,anchors:r.anchors,width:.18,height:.14,update:u,dispose:r.dispose}}function Vx({id:n="experiment-controls",module:e="thevenin"}={}){const t=Fi(n),i=t.enclosure(.56,.34,.16),r=[],s=[],o=["thevenin","superposition","opamp","transient"],a=5+Math.max(0,o.indexOf(e)),c=t.screen(.49,.03,[0,.315,i+7e-4],{pixels:[1470,90],background:Bt.face});function l(m,p,_,x,y){t.text(m,y,.03,[x,.281,i+7e-4]);const M=t.dial(m,p,x,.235,i,{radius:.023,values:_,min:p==="timeCursor"?0:void 0,max:p==="timeCursor"?1:void 0,step:p==="timeCursor"?.001:1});t.box(y,.04,.003,t.m.dark,t.group,[x,.184,i],.002);const w=t.screen(y-.008,.034,[x,.184,i+.0017],{pixels:[Math.round((y-.008)*5e3),170],background:"#e1ead5"});r.push({...M,parameter:p,display:w,label:m})}function u(m,p,_,x,y,M=.04,w="#354b45"){const A=t.button(m,p,_,x,i,{width:y,height:M,color:w}),C=A.userData.equipmentTarget,S=t.screen(y-.008,M-.008,[_,x,i+.0078],{pixels:[Math.round((y-.008)*5e3),160],background:w,foreground:"#f7fff8"});S.object.userData.equipmentTarget=C;const E={object:A,descriptor:C,display:S,color:w,label:m};return s.push(E),E}e==="thevenin"&&l("Circuit","representation",["original","thevenin","norton"],0,.34),e==="superposition"&&(l("Sources","sourceMode",["a","both","b"],-.14,.23),l("Inactive source","replacement",["short","open"],.14,.23)),e==="opamp"&&l("Amplifier","configuration",["inverting","noninverting"],0,.34);let h,d;e==="transient"&&(l("Circuit","kind",["RC","RL"],-.18,.156),l("Speed","speed",Ut.speed,0,.156),l("Time","timeCursor",void 0,.18,.156),h=u("Run","play",-.208,.13,.124,.036),u("Replay","replay",-.069,.13,.124,.036),d=u("Return","switch",.069,.13,.124,.036),u("New run","reset-energy",.208,.13,.124,.036));const f=u("Build","build",-.18,.077,.156);u("Reset lab","reset-experiment",0,.077,.156),u("Undo","undo",.18,.077,.156);for(const[m,p]of o.entries())u(`Lab ${5+m}`,`module:${p}`,-.2025+m*.135,.022,.124,.036,p===e?"#e3eee0":"#485658");const g={original:"Original",thevenin:"Thévenin",norton:"Norton",both:"Both",a:"A only",b:"B only",short:"Short",open:"Open",inverting:"Inverting",noninverting:"Non-inverting"};function v(m={}){const p=m.parameters||{},_=m.mode==="build";f.descriptor.action=_?"explore":"build",f.descriptor.label=_?"Explore reference":"Build circuit",f.label=_?"Explore":"Build",c.draw(_,(x,y,M)=>Wt(x,`Lab ${a} · ${_?"Build circuit":"Explore"}`,y/2,M/2,{size:M*.88,width:y-24,align:"center"}));for(const x of r){const y=x.parameter==="timeCursor"?p.time:p[x.parameter];x.parameter==="timeCursor"&&(x.descriptor.max=Math.max(0,p.acquiredTime||0),x.descriptor.step=Math.max(1e-6,x.descriptor.max/100)),x.set(y);const M=x.parameter==="timeCursor"?`${en((y||0)*1e3,3)} ms`:x.parameter==="speed"?`${en(y,2)}×`:g[y]||String(y||x.label);x.display.draw(M,(w,A,C)=>Wt(w,M,A/2,C/2,{size:C*.9,width:A-20,align:"center"}))}h&&(h.label=p.playing?"Pause":"Run",h.descriptor.label=h.label),d&&(d.label=p.charging?"Return":"Source",d.descriptor.label=p.charging?"Switch to return loop":"Switch to source");for(const x of s)x.display.draw(x.label,(y,M,w)=>{y.fillStyle=x.color==="#e3eee0"?"#10251b":"#f7fff8",Wt(y,x.label,M/2,w/2,{size:w*.9,width:M-16,align:"center"})})}return t.finish(),v(),{group:t.group,targets:t.targets,anchors:t.anchors,module:e,width:.56,height:.34,update:v,dispose:t.dispose}}function Hx({id:n="probe",color:e=Bt.red,channel:t="red",label:i="Probe",action:r=/ground/i.test(t)?`scope-ground:${t.slice(0,3)}`:`tool:${t}`,ground:s=/ground/i.test(t)}={}){if(s)return Gx({id:n,color:e,channel:t,label:i,action:r});const o=Fi(n),{group:a,m:c}=o,l=o.material(e,{roughness:.76}),u=o.mesh(new st(.005,.0043,.113,24),l,a,[0,.091,0]);o.mesh(new st(.0021,.0038,.019,20),l,a,[0,.0255,0]),o.mesh(new st(75e-5,75e-5,.016,14),c.metal,a,[0,.01,0]),o.mesh(new Sl(75e-5,.0025,14),c.metal,a,[0,.00125,0]).rotation.z=Math.PI,o.mesh(new st(.012,.012,.0027,32),l,a,[0,.036,0]);for(let f=0;f<13;f++)o.mesh(new st(.0054,.0054,.0015,24),l,a,[0,.048+f*.0064,0]);o.mesh(new st(.0022,.0045,.024,20),c.rubber,a,[0,.156,0]);for(let f=0;f<5;f++)o.mesh(new st(.0035-f*25e-5,.0035-f*25e-5,.001,18),c.rubber,a,[0,.149+f*.0035,0]);o.anchor("tip",[0,0,0]),o.anchor("cable",[0,.168,0]);const h=o.target(u,{kind:"probe",id:n,label:i,channel:t,action:r});a.traverse(f=>{f.isMesh&&(f.userData.equipmentTarget=h)});function d(f={}){h.connected=!!f.connected,a.visible=f.visible!==!1}return o.finish(),{group:a,targets:o.targets,anchors:o.anchors,channel:t,length:.168,update:d,dispose:o.dispose}}function Gx({id:n="ground-clip",color:e=Bt.black,channel:t="ch1Ground",label:i="Ground clip",action:r="scope-ground:ch1"}={}){const s=Fi(n),{group:o,m:a}=s,c=s.material(e,{roughness:.86});s.box(.007,.021,.0016,a.metal,o,[0,.01,-.0022],4e-4);const l=s.box(.007,.022,.0016,a.metal,o,[0,.012,.0022],4e-4);l.rotation.x=-.1;for(let f=0;f<5;f++)s.box(.006,.001,.0014,a.metal,o,[0,.003+f*.003,-.001],1e-4),s.box(.006,.001,.0014,a.metal,o,[0,.003+f*.003,.001],1e-4);const u=s.cylinder(.0034,.009,a.metal,o,[0,.021,0],16);u.rotation.y=Math.PI/2;const h=s.box(.011,.025,.01,c,o,[0,.032,0],.003);s.mesh(new st(.0017,.0032,.009,16),a.rubber,o,[0,.048,0]),s.anchor("tip",[0,0,0]),s.anchor("cable",[0,.053,0]);const d=s.target(h,{kind:"probe",id:n,label:i,channel:t,action:r});return o.traverse(f=>{f.isMesh&&(f.userData.equipmentTarget=d)}),s.finish(),{group:o,targets:s.targets,anchors:s.anchors,channel:t,length:.053,update(f={}){d.connected=!!f.connected,o.visible=f.visible!==!1},dispose:s.dispose}}function bh({points:n=[[0,0,0],[0,.01,-.03],[.02,.01,-.06]],color:e=Bt.black,radius:t=.0018}={}){const i=new Zt;i.name="insulated-lead";const r=new Cl({color:e,roughness:.82,metalness:0});let s=null,o="",a=!1;function c(l){const h=(Array.isArray(l)?l:(l==null?void 0:l.points)||n).map(nl);if(h.length<2)return;const d=h.map(v=>v.toArray().map(m=>m.toFixed(5)).join(",")).join(";");if(o===d)return;o=d;const f=new Fs(h,!1,"centripetal"),g=new Ks(f,48,t,7,!1);s?(s.geometry.dispose(),s.geometry=g):(s=new En(g,r),s.castShadow=!0,s.receiveShadow=!0,i.add(s))}return c(n),{group:i,targets:[],anchors:{},update:c,dispose(){a||(a=!0,s==null||s.geometry.dispose(),r.dispose(),i.removeFromParent())}}}function Wx({xrManager:n,navigatorXR:e,isSecureContext:t=!0,visibilityTarget:i=null,onStatus:r=()=>{},onBeforeSession:s=()=>{},onSessionStarted:o=()=>{},onSessionEnded:a=()=>{}}){var B,Y;let c=!1,l=!1,u=!1,h=!1,d=null,f=!1,g=!1,v=null,m=0,p={kind:"checking",supported:!1,active:!1,message:"Checking headset…"};const _=()=>typeof e=="function"?e():e,x=()=>typeof t=="function"?t():t;function y($,W){p={kind:$,supported:c,active:l,message:W},h||r({...p})}function M($="ended"){if(!d&&!f&&!l)return;const W=d,I=f;d=null,f=!1,l=!1,u=!1,I&&a({session:W,floorReference:g,reason:$}),y(c?"ready":"unavailable",c?"VR ready. Enter the lab to connect leads and take readings.":"Open the lab’s HTTPS link in your headset browser.")}const w=()=>M(h?"disposed":"ended");(B=n.addEventListener)==null||B.call(n,"sessionend",w);const A=()=>{E()},C=()=>{(!(i!=null&&i.visibilityState)||i.visibilityState==="visible")&&E()};(Y=i==null?void 0:i.addEventListener)==null||Y.call(i,"visibilitychange",C);function S($){var W,I;$!==v&&((W=v==null?void 0:v.removeEventListener)==null||W.call(v,"devicechange",A),v=$,(I=v==null?void 0:v.addEventListener)==null||I.call(v,"devicechange",A))}async function E(){if(h||u||l)return c;const $=++m,W=_();if(S(W),c=!1,!x())return y("unavailable","VR needs HTTPS. Open the lab’s HTTPS link in your headset browser."),!1;if(!(W!=null&&W.isSessionSupported))return y("unavailable","No headset found here. Open the lab’s HTTPS link in your headset browser."),!1;y("checking","Checking headset…");try{const I=await W.isSessionSupported("immersive-vr");if(h||u||l||$!==m)return c;c=!!I,y(c?"ready":"unavailable",c?"VR ready. Enter the lab to connect leads and take readings.":"No headset found here. Open the lab’s HTTPS link in your headset browser.")}catch(I){!h&&!u&&!l&&$===m&&y("unavailable",`VR support could not be checked: ${(I==null?void 0:I.message)||(I==null?void 0:I.name)||"unknown error"}.`)}return c}async function L(){if(h||u)return!1;if(l)return!0;const $=_();if(S($),!x()||!($!=null&&$.requestSession))return y("unavailable",x()?"No headset found here. Open the lab’s HTTPS link in your headset browser.":"VR needs HTTPS. Open the lab’s HTTPS link in your headset browser."),!1;u=!0,m++,y("entering","Accept the headset’s request to enter VR.");let W;try{if(W=await $.requestSession("immersive-vr",{optionalFeatures:["local-floor","bounded-floor"]}),h)return await W.end().catch(()=>{}),!1;d=W,g=!1;try{await W.requestReferenceSpace("local-floor"),g=!0}catch{}return n.setReferenceSpaceType(g?"local-floor":"local"),f=!0,s({session:W,floorReference:g}),await n.setSession(W),h||d!==W?(await W.end().catch(()=>{}),!1):(c=!0,l=!0,u=!1,o({session:W,floorReference:g}),y("active","VR active. Grip probes and dials. Left stick moves; right stick turns. Click a stick to return to the bench."),!0)}catch(I){return W&&await W.end().catch(()=>{}),M("error"),u=!1,y("error",(I==null?void 0:I.name)==="NotAllowedError"?"The VR request was declined. Select Try VR again when you are ready.":`VR could not start: ${(I==null?void 0:I.message)||(I==null?void 0:I.name)||"headset unavailable"}. Check the headset and try again.`),!1}}async function O(){if(!d)return!1;const $=d;try{return await $.end(),d===$&&M(h?"disposed":"ended"),!0}catch(W){return y("error",`VR could not exit: ${(W==null?void 0:W.message)||(W==null?void 0:W.name)||"unknown error"}. Use the headset system menu to exit.`),!1}}async function H(){var $,W,I;h||(h=!0,m++,d&&await O(),f&&M("disposed"),($=v==null?void 0:v.removeEventListener)==null||$.call(v,"devicechange",A),(W=i==null?void 0:i.removeEventListener)==null||W.call(i,"visibilitychange",C),(I=n.removeEventListener)==null||I.call(n,"sessionend",w))}return E(),{enter:L,exit:O,refreshSupport:E,dispose:H,toggle:()=>l?O():L(),get state(){return{...p}},get active(){return l},get entering(){return u},get supported(){return c}}}function $x(n,e){return{position:n.position.clone(),quaternion:n.quaternion.clone(),scale:n.scale.clone(),near:n.near,far:n.far,fov:n.fov,aspect:n.aspect,zoom:n.zoom,target:e.target.clone(),controlsEnabled:e.enabled}}function qx(n,e,t,i){i&&(t.position.set(0,0,0),t.quaternion.identity(),t.scale.set(1,1,1),n.position.copy(i.position),n.quaternion.copy(i.quaternion),n.scale.copy(i.scale),Object.assign(n,{near:i.near,far:i.far,fov:i.fov,aspect:i.aspect,zoom:i.zoom}),n.updateProjectionMatrix(),e.target.copy(i.target),e.enabled=i.controlsEnabled,e.update(),n.updateMatrixWorld(!0))}function Xx(n,e,{floorReference:t=!0,eyeHeight:i=1.6}={}){var u,h;const r=(u=e==null?void 0:e.transform)==null?void 0:u.position,s=(h=e==null?void 0:e.transform)==null?void 0:h.orientation;if(!r||!s||![r.x,r.y,r.z,s.x,s.y,s.z,s.w].every(Number.isFinite))return!1;const o=new hn(s.x,s.y,s.z,s.w).normalize(),a=new D(0,0,-1).applyQuaternion(o),c=Math.hypot(a.x,a.z)>.001?Math.atan2(a.x,-a.z):-new kn().setFromQuaternion(o,"YXZ").y;n.quaternion.setFromAxisAngle(new D(0,1,0),c);const l=new D(r.x,r.y,r.z).applyQuaternion(n.quaternion);return n.position.set(-l.x,t?0:i-r.y,-l.z),n.updateMatrixWorld(!0),!0}const Yt=n=>({x:n.x,y:n.y,z:n.z}),On=(n,e,t)=>({x:n.x+(e.x-n.x)*t,y:n.y+(e.y-n.y)*t,z:n.z+(e.z-n.z)*t}),mi=(n,e)=>Math.hypot(n.x-e.x,n.z-e.z),sc=(n,e,t=0)=>n.x>e.minX-t&&n.x<e.maxX+t&&n.z>e.minZ-t&&n.z<e.maxZ+t;class Yx{constructor(){Ma(this,"items",[]);Ma(this,"serial",0)}push(e,t){const i={value:e,score:t,order:this.serial++};let r=this.items.length;for(this.items.push(i);r>0;){const s=r-1>>1;if(this.less(this.items[s],i))break;this.items[r]=this.items[s],r=s}this.items[r]=i}less(e,t){return e.score<t.score||e.score===t.score&&e.order<t.order}pop(){const e=this.items[0],t=this.items.pop();if(this.items.length){let i=0;for(;i*2+1<this.items.length;){let r=i*2+1;if(r+1<this.items.length&&this.less(this.items[r+1],this.items[r])&&r++,this.less(t,this.items[r]))break;this.items[i]=this.items[r],i=r}this.items[i]=t}return e==null?void 0:e.value}}function il(n){const e=[n[0]];for(let t=1;t<n.length-1;t++){const i=n[t-1],r=n[t],s=n[t+1];Math.abs((r.x-i.x)*(s.z-r.z)-(r.z-i.z)*(s.x-r.x))>1e-8&&e.push(r)}return n.length>1&&e.push(n.at(-1)),e}function Jo(n,e){if(n.length<3)return n.map(Yt);const t=[Yt(n[0])];for(let i=1;i<n.length-1;i++){const r=n[i-1],s=n[i],o=n[i+1],a=mi(r,s),c=mi(s,o);if(a<1e-6||c<1e-6){t.push(Yt(s));continue}const l=Math.min(e,a*.3,c*.3),u=On(s,r,l/a),h=On(s,o,l/c);t.push(u);for(const d of[.25,.5,.75])t.push(On(On(u,s,d),On(s,h,d),d));t.push(h)}return t.push(Yt(n.at(-1))),t}function rl(n,e,{bounds:t,obstacles:i=[],step:r,padding:s,reserved:o=new Map,preferred:a=null}){const c=Math.floor(t.minX/r)*r,l=Math.floor(t.minZ/r)*r,u=Math.ceil((t.maxX-c)/r)+1,h=Math.ceil((t.maxZ-l)/r)+1,d=O=>({x:Math.max(0,Math.min(u-1,Math.round((O.x-c)/r))),z:Math.max(0,Math.min(h-1,Math.round((O.z-l)/r)))}),f=(O,H)=>H*u+O,g=O=>({x:c+O%u*r,y:0,z:l+Math.floor(O/u)*r}),v=d(n),m=d(e),p=f(v.x,v.z),_=f(m.x,m.z),x=O=>{if(O===p||O===_)return!1;const H=g(O);return i.some(B=>sc(H,B,s)&&!(sc(n,B,s)&&mi(H,n)<r*1.8)&&!(sc(e,B,s)&&mi(H,e)<r*1.8))},y=O=>(Math.abs(g(O).x-g(_).x)+Math.abs(g(O).z-g(_).z))/r,M=new Yx,w=new Map([[p,0]]),A=new Map,C=new Map,S=new Set;for(M.push(p,y(p));M.items.length;){const O=M.pop();if(S.has(O))continue;if(O===_)break;S.add(O);const H=O%u,B=Math.floor(O/u);for(const[Y,[$,W]]of[[1,0],[0,1],[-1,0],[0,-1]].entries()){const I=H+$,le=B+W;if(I<0||le<0||I>=u||le>=h)continue;const oe=f(I,le);if(S.has(oe)||x(oe))continue;const K=g(oe),Ie=o.get(`${I},${le}`)||0,et=Math.min(K.x-t.minX,t.maxX-K.x,K.z-t.minZ,t.maxZ-K.z),Ue=a==="perimeter"?Math.max(0,et/r)*.2:0,ct=C.has(O)&&C.get(O)!==Y?.32:0,te=w.get(O)+1+Ie*14+ct+Ue;te>=(w.get(oe)??1/0)||(w.set(oe,te),A.set(oe,O),C.set(oe,Y),M.push(oe,te+y(oe)))}}if(p!==_&&!A.has(_))return null;const E=[_];for(;E.at(-1)!==p;)E.push(A.get(E.at(-1)));E.reverse();const L=E.map(g);return L[0]=Yt(n),L[L.length-1]=Yt(e),{points:L,cells:E.map(O=>({x:O%u,z:Math.floor(O/u)})),cols:u,rows:h}}function jx(n,e,t,i,r){const s=t.maxZ+i;return[Yt(n),{x:n.x,y:r,z:n.z},{x:n.x,y:r,z:s},{x:e.x,y:r,z:s},{x:e.x,y:r,z:e.z},Yt(e)]}const Mh=new WeakMap;function Zx(n,{obstacles:e=[],bounds:t={minX:-1.64,maxX:1.64,minZ:-.94,maxZ:.94},step:i=.045,floor:r=.95,previousRoutes:s,layoutKey:o=null}={}){const a=new Map,c=new Map,l=new Map,u=new Map,h=JSON.stringify([o,[t.minX,t.maxX,t.minZ,t.maxZ],i,r,e.map(p=>[p.minX,p.maxX,p.minZ,p.maxZ,p.top??null]).sort((p,_)=>JSON.stringify(p).localeCompare(JSON.stringify(_)))]),d=s&&Mh.get(s),f=(p,_)=>p&&_&&p.x===_.x&&p.y===_.y&&p.z===_.z;function g(p,_){for(const[x,y]of p.entries()){if(x<=1||x>=p.length-2)continue;const M=`${y.x},${y.z}`;c.set(M,[...c.get(M)||[],_]);for(let w=-1;w<=1;w++)for(let A=-1;A<=1;A++){const C=`${y.x+w},${y.z+A}`;a.set(C,(a.get(C)||0)+(w||A?.45:1))}}}function v(p){var M,w;const _=Math.floor(t.minX/i)*i,x=Math.floor(t.minZ/i)*i,y=[];for(let A=1;A<p.length;A++){const C=Math.max(1,Math.ceil(mi(p[A-1],p[A])/(i/2)));for(let S=0;S<=C;S++){const E=On(p[A-1],p[A],S/C),L={x:Math.round((E.x-_)/i),z:Math.round((E.z-x)/i)};(((M=y.at(-1))==null?void 0:M.x)!==L.x||((w=y.at(-1))==null?void 0:w.z)!==L.z)&&y.push(L)}}return y}if((d==null?void 0:d.signature)===h)for(const p of n){const _=d.records.get(p.id),x=s.get(p.id);_&&x&&f(p.start,_.start)&&f(p.end,_.end)&&(l.set(p.id,x),u.set(p.id,_),g(_.cells,_.layer))}const m=[...n].sort((p,_)=>mi(p.start,p.end)-mi(_.start,_.end)||p.id.localeCompare(_.id));for(const p of m){if(l.has(p.id))continue;const{start:_,end:x}=p,y=rl(_,x,{bounds:t,obstacles:e,step:i,padding:i*1.15,reserved:a});if(!y){const B=Math.max(_.y,x.y,...e.map(I=>I.top||r))+.06,Y=Jo(jx(_,x,t,i,B),i),$=v(Y),W=Math.round((B-r)/.027);l.set(p.id,Y),u.set(p.id,{start:Yt(_),end:Yt(x),cells:$,layer:W}),g($,W);continue}const M=new Set;for(const B of y.cells.slice(2,-2))for(const Y of c.get(`${B.x},${B.z}`)||[])M.add(Y);let w=0;for(;M.has(w);)w++;const A=r+w*.027;g(y.cells,w);const C=il(y.points.map(B=>({...B,y:A}))),S=Jo(C,i*.75),E=S[1]||S[0],L=S.at(-2)||S.at(-1),O=On({..._,y:A},E,Math.min(.1/Math.max(mi(_,E),1e-6),.3)),H=On({...x,y:A},L,Math.min(.1/Math.max(mi(x,L),1e-6),.3));l.set(p.id,[Yt(_),O,...S.slice(1,-1),H,Yt(x)]),u.set(p.id,{start:Yt(_),end:Yt(x),cells:y.cells,layer:w})}return Mh.set(l,{signature:h,records:u}),l}function Sh(n,e,{lane:t=0,bounds:i={minX:-.6,maxX:.6,minZ:-1.15,maxZ:-.38},obstacles:r=[],floor:s=.833,boardTop:o=.874,exit:a={x:0,y:0,z:1},branch:c=!1}={}){const l=C=>({...C,y:C.x>i.minX&&C.x<i.maxX&&C.z>i.minZ&&C.z<i.maxZ?o:s});if(c){const C=On(n,e,.5);C.y=Math.max(o+.025,Math.min(n.y,e.y)-.025),C.x+=(t%2?-1:1)*.025;const S=Math.min(n.y,e.y,C.y);if(!r.some(B=>(B.top||o)>S-.005&&Math.max(n.x,C.x,e.x)+.035>B.minX&&Math.min(n.x,C.x,e.x)-.035<B.maxX&&Math.max(n.z,e.z)+.035>B.minZ&&Math.min(n.z,e.z)-.035<B.maxZ)&&mi(n,e)<.25)return[Yt(n),On(n,C,.35),C,On(C,e,.65),Yt(e)];const L={minX:Math.min(i.minX-.04,n.x-.04,e.x-.04),maxX:Math.max(i.maxX+.04,n.x+.04,e.x+.04),minZ:Math.min(i.minZ-.04,n.z-.04,e.z-.04),maxZ:Math.max(i.maxZ+.04,n.z+.04,e.z+.04)},O=rl(n,e,{bounds:L,obstacles:r,step:.016,padding:.025});if(O){const B=Jo(il(O.points.map(Y=>({...Y,y:o+.025}))),.018);return B.length===2&&B.splice(1,0,On(B[0],B[1],.5)),B[0]=Yt(n),B[B.length-1]=Yt(e),B}const H=Math.max(n.y,e.y,...r.map(B=>B.top||o))+.06;return[Yt(n),{...n,y:H},{...On(n,e,.33),y:H},{...On(n,e,.67),y:H},{...e,y:H},Yt(e)]}const u=.045+t*.014,h=i.maxZ+u,d=n.x<(i.minX+i.maxX)/2?i.minX-u:i.maxX+u,f={x:n.x+a.x*.045,y:n.y+a.y*.045,z:n.z+a.z*.045},g=Math.abs(a.z)>=Math.abs(a.x),v=(Math.max(0,n.y-s)*Math.max(0,a.y)+.035)/Math.max(Math.abs(a.z),.25),m=g?a.z>=0?Math.max(h,n.z+v):Math.min(h,n.z-v):h,p={x:d,y:s,z:m},_={minX:Math.min(i.minX-u,e.x-.035),maxX:Math.max(i.maxX+u,e.x+.035),minZ:Math.min(i.minZ-u,e.z-.035),maxZ:Math.max(h+.035,m+.035,e.z+.035)},x=l(e),y=rl(p,x,{bounds:_,obstacles:r,step:.018,padding:.011,preferred:"perimeter"}),M=Math.max(e.y,...r.map(C=>C.top||s))+.04,w=y?il(y.points.map(l)):[{...p,y:M},{...x,y:M}],A=[Yt(n),f,{x:f.x,y:s,z:m},p,...w,{...Yt(e),y:Math.max(o+.025,e.y-.03)},Yt(e)];return Jo(A.filter((C,S)=>S===0||Math.hypot(C.x-A[S-1].x,C.y-A[S-1].y,C.z-A[S-1].z)>1e-5),.028)}const ai=n=>({x:n.x,y:n.y,z:n.z}),Ld=(n,e)=>Math.hypot(n.x-e.x,n.y-e.y,n.z-e.z),Dd=(n,e,t)=>({x:n.x+(e.x-n.x)*t,y:n.y+(e.y-n.y)*t,z:n.z+(e.z-n.z)*t});function Id(n){const e=[0];for(let t=1;t<n.length;t++)e.push(e[t-1]+Ld(n[t-1],n[t]));return e}function Eh(n,e=48){if(!Number.isInteger(e)||e<2)throw new RangeError("Cable sample count must be an integer of at least two.");if(!n.length)return[];const t=Id(n),i=t.at(-1);if(i===0)return Array.from({length:e},()=>ai(n[0]));const r=[ai(n[0])];let s=1;for(let o=1;o<e-1;o++){const a=i*o/(e-1);for(;s<n.length-1&&t[s]<a;)s++;const c=t[s]-t[s-1];r.push(Dd(n[s-1],n[s],c>0?(a-t[s-1])/c:0))}return r.push(ai(n.at(-1))),r}function oc(n,e,t,{falloff:i=3}={}){if(!n.length)return[];if(n.length===1)return[ai(e),ai(t)];const r=Id(n),s=r.at(-1),o=n[0],a=n.at(-1),c=Math.max(1,i),l=n.map((u,h)=>{const d=s>0?r[h]/s:h/(n.length-1),f=(1-d)**c,g=d**c;return{x:u.x+(e.x-o.x)*f+(t.x-a.x)*g,y:u.y+(e.y-o.y)*f+(t.y-a.y)*g,z:u.z+(e.z-o.z)*f+(t.z-a.z)*g}});return l[0]=ai(e),l[l.length-1]=ai(t),l}function Kx(n,e,t,i){const r=i/t;if(n<=r)return n*Math.exp(-t*e);const s=(n-r)/i;return e<=s?n-i*e:r*Math.exp(-t*(e-s))}function wh(n,e,t,{response:i=10,maxSpeed:r=1.2,maxDelta:s=.05}={}){if(!e.length)return n.map(ai);if(!n.length)return e.map(ai);const o=Math.max(2,n.length),a=n.length===o?n:Eh(n,o),c=e.length===o?e:Eh(e,o),l=Number.isFinite(t)?Math.min(Math.max(t,0),Math.max(s,0)):0;return a.map((h,d)=>{if(d===0||d===o-1)return ai(c[d]);const f=Ld(h,c[d]);if(f===0||l===0||i<=0||r<=0)return ai(h);const g=Kx(f,l,i,r);return Dd(h,c[d],Math.max(0,Math.min(1,(f-g)/f)))})}function Ls(n,e,t){return`wire:${[n,e].sort().join("|")}:${t}`}function Th(n,e){return n==="gnd"?{x:-1.1+e%8*.3,z:.79-Math.floor(e/8)*.16}:n==="out"?{x:.53+e%3*.27,z:-.22-Math.floor(e/3)*.18}:null}function Jx(){const n=new Map;function e(t,i){const r=[...new Set(i)].sort((a,c)=>+!a.startsWith("wire:")-+!c.startsWith("wire:")||a.localeCompare(c));let s=n.get(t);s||(s=new Map,n.set(t,s));for(const a of s.keys())r.includes(a)||s.delete(a);const o=new Set(s.values());for(const a of r){if(s.has(a))continue;let c=0;for(;o.has(c);)c++;s.set(a,c),o.add(c)}return s}return{resolve(t,i,r){const s=e(t,i?[...r,i]:r);return i?s.get(i):0},prefer(t,i,r,s){const o=e(t,[...s,i]);return Number.isInteger(r)&&r>=0&&![...o].some(([a,c])=>a!==i&&c===r)&&o.set(i,r),o.get(i)},transfer(t,i,r,s){const o=n.get(t),a=o==null?void 0:o.get(i);return a===void 0||!r||i!==r&&o.has(r)?null:(i!==r&&(o.delete(i),o.set(r,a)),e(t,[...s.filter(c=>c!==i),r]),a)},clear(){n.clear()}}}function Qx({container:n,onTerminal:e=()=>{},onWire:t=()=>{},onAction:i=()=>{},onPart:r=()=>{},onHover:s=()=>{},onPanelPreviewChange:o=()=>{},onXRStatus:a=()=>{},onFrame:c=()=>{},onChange:l=()=>{},onProbe:u=()=>{},onConnect:h=()=>{},onDisconnect:d=()=>{},onWireMove:f=()=>{},onGraphCursor:g=()=>{},onManipulation:v=()=>{}}){const m=new zp;m.background=new _t("#c6c9c9"),m.fog=new yl("#c6c9c9",14,30);const p=new Yn(39,1,.05,35),_=new fx({antialias:!0,alpha:!1});_.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),_.setClearColor("#c6c9c9"),_.outputColorSpace=Mn,_.toneMapping=Wh,_.toneMappingExposure=1,_.shadowMap.enabled=!0,_.shadowMap.type=Hh,_.shadowMap.autoUpdate=!1,_.shadowMap.needsUpdate=!0,_.xr.enabled=!0,_.xr.setFoveation(0),_.domElement.setAttribute("aria-label","Circuit lab. Drag probe tips onto terminals. Drag a terminal to another terminal to connect a lead; pull a plug out to disconnect it. Drag equipment knobs to turn them. Click switches and drag across the scope screen. Drag empty space to look around and scroll to zoom."),_.domElement.style.touchAction="none",n.appendChild(_.domElement);const x=new mx(p,_.domElement);x.enableDamping=!0,x.dampingFactor=.09,x.minDistance=.55,x.maxDistance=12,x.minPolarAngle=.08,x.maxPolarAngle=Math.PI*.47,x.enablePan=!0;const y=new Zt;m.add(y),y.add(p);const M=new D(.8,.883,-.1),w=new hn().setFromEuler(new kn(-.62,-Math.atan2(.8,.1),0,"YXZ")),A=new D(-.8,.895,-.1),C=new hn().setFromEuler(new kn(-.62,Math.atan2(.8,.1),0,"YXZ")),S=1.35,E=new D(-.25,3,3.25).normalize(),L=new D(0,.97,-.77);let O=0;function H(){if(_.xr.isPresenting)return;y.position.set(0,0,0),p.aspect=Math.max(1,n.clientWidth)/Math.max(1,n.clientHeight),p.updateProjectionMatrix(),x.target.copy(L);let b=4.5;const R=[];for(const N of[-.97,.97])for(const z of[.81,1.16])for(const F of[-1.3,-.31])R.push(new D(N,z,F));for(const N of[-.3,.3])for(const z of[0,.35])for(const F of[-.1,.1])R.push(new D(N,z,F).applyQuaternion(w).add(M));for(const N of[-.32,.32])for(const z of[0,.36])for(const F of[-.13,.13])R.push(new D(N,z,F).applyQuaternion(C).add(A));for(const N of[-1.22,-.55,.55,1.22])for(const z of[-.46,.25])R.push(new D(N,.82,z));for(let N=0;N<7;N++){p.position.copy(x.target).addScaledVector(E,b),p.lookAt(x.target),p.updateMatrixWorld();const z=R.map(nt=>nt.clone().project(p)),F=Math.min(...z.map(nt=>nt.x)),V=Math.max(...z.map(nt=>nt.x)),re=Math.min(...z.map(nt=>nt.y)),ie=Math.max(...z.map(nt=>nt.y)),be=Math.max((V-F)/1.72,(ie-re)/1.72),Fe=b*Math.tan(dn.degToRad(p.fov/2)),gt=new D().setFromMatrixColumn(p.matrixWorld,0),vt=new D().setFromMatrixColumn(p.matrixWorld,1);x.target.addScaledVector(gt,(F+V)*.5*Fe*p.aspect),x.target.addScaledVector(vt,(re+ie)*.5*Fe),b*=Math.max(.78,Math.min(1.3,be))}p.position.copy(x.target).addScaledVector(E,b),p.lookAt(x.target),O=p.aspect,x.update()}H(),m.add(new wm("#ffffff","#777b79",1.35));const B=new Bu("#fffdf8",2.7);B.position.set(-3,7,3),B.castShadow=!0,B.shadow.mapSize.set(2048,2048),Object.assign(B.shadow.camera,{left:-4,right:4,top:4,bottom:-4,near:.1,far:16}),B.shadow.normalBias=.004,m.add(B);const Y=new Bu("#eef2f4",.65);Y.position.set(4,3,-4),m.add(Y);const $={navy:"#2b2c2d",teal:"#414646",brass:"#b59a60",metal:"#b9baba",board:"#246648",copper:"#ad653c"},W=(b,R={})=>new Cl({color:b,roughness:.56,metalness:.08,...R}),I={navy:W($.navy),teal:W($.teal),metal:W($.metal,{metalness:.7,roughness:.3}),brass:W($.brass,{metalness:.65,roughness:.3}),copper:W($.copper,{metalness:.65,roughness:.3}),board:W($.board,{roughness:.58}),pale:W("#b9bcb8"),black:W("#171819",{roughness:.72}),resistor:W("#c8b082",{roughness:.74}),trace:W("#3f7952",{roughness:.68}),solder:W("#bfc3c0",{metalness:.82,roughness:.34}),red:W("#922724",{roughness:.67}),mat:W("#353b3d",{roughness:.95}),pcbEdge:W("#73764e",{roughness:.92})},le=new Set(Object.values(I)),oe=new Zt;oe.position.set(0,.52,-.77),oe.scale.setScalar(.36),m.add(oe);const K=(b,R,N,z=0,F=0,V=0)=>{const re=new En(b,R);return re.position.set(z,F,V),re.castShadow=!0,re.receiveShadow=!0,N.add(re),re},Ie=(b,R,N,z=.035)=>new ca(b,R,N,3,z);K(Ie(3.65,.025,2.32,.018),I.mat,oe,0,.843),K(Ie(3.32,.022,2.02,.018),I.pcbEdge,oe,0,.907),K(Ie(3.319,.007,2.019,.018),I.board,oe,0,.921);for(const b of[-1.54,1.54])for(const R of[-.89,.89])K(new st(.024,.024,.055,6),I.brass,oe,b,.88,R),K(new st(.04,.04,.004,24),I.metal,oe,b,.929,R),K(new st(.023,.023,.009,24),I.solder,oe,b,.934,R),K(new Xt(.029,.0015,.005),I.black,oe,b,.94,R),K(new Xt(.005,.0015,.029),I.black,oe,b,.94,R);const et=K(new Ui(80,80),W("#b9bcba",{roughness:.94}),m,0,.815,0);et.rotation.x=-Math.PI/2,et.visible=!1,et.castShadow=!1;const Ue=new Zt;Ue.visible=!0,m.add(Ue);const ct=K(new Ui(14,14),W("#a5a8a5",{roughness:.96}),Ue,0,-.003,-1.4);ct.rotation.x=-Math.PI/2,ct.castShadow=!1;const te=K(new Ui(10,3.4),W("#d2d3cd",{roughness:.94}),Ue,0,1.7,-5.1);te.castShadow=!1,K(new Xt(10,.1,.025),W("#9c9f9b",{roughness:.84}),Ue,0,.05,-5.08);const he=K(Ie(2.12,.04,1.42,.009),W("#a7aaa5",{roughness:.83}),Ue,0,.8,-.985);for(const b of[-.91,.91])for(const R of[-1.57,-.4])K(new Xt(.055,.765,.055),W("#858b8c",{metalness:.62,roughness:.43}),Ue,b,.3975,R),K(new st(.04,.04,.027,20),I.black,Ue,b,.0135,R);for(const b of[-1.57,-.4])K(new Xt(1.85,.065,.035),I.metal,Ue,0,.729,b);for(const b of[-.91,.91])K(new Xt(.035,.065,1.2),I.metal,Ue,b,.729,-.985);K(Ie(.67,.04,.525,.004),he.material,Ue,.885,.8,-.0125),K(Ie(.16,.04,.185,.004),he.material,Ue,1.14,.8,-.3675);for(const b of[-.37,.16])K(new Xt(.045,.765,.045),I.metal,Ue,1.16,.3975,b),K(new st(.034,.034,.027,20),I.black,Ue,1.16,.0135,b);K(new Xt(.58,.065,.035),I.metal,Ue,.87,.729,.16);const Te=new Zt;Te.position.copy(M),Te.quaternion.copy(w),Ue.add(Te),K(Ie(.6,.012,.195,.006),I.metal,Te,0,-.01,0);for(const b of[-.23,.23])for(const R of[-.066,.066]){const N=new D(b,-.018,R).applyQuaternion(w).add(M),z=Math.max(.01,N.y-.821);K(new st(.008,.008,z,16),I.metal,Ue,N.x,.821+z/2,N.z),K(new st(.019,.019,.003,20),I.black,Ue,N.x,.822,N.z)}K(Ie(.67,.04,.71,.004),he.material,Ue,-.885,.8,-.105);for(const b of[-.37,.16])K(new Xt(.045,.765,.045),I.metal,Ue,-1.16,.3975,b),K(new st(.034,.034,.027,20),I.black,Ue,-1.16,.0135,b);K(new Xt(.58,.065,.035),I.metal,Ue,-.87,.729,.16);const qe=new Zt;qe.position.copy(A),qe.quaternion.copy(C),Ue.add(qe),K(Ie(.64,.012,.27,.006),I.metal,qe,0,-.01,0);for(const b of[-.24,.24])for(const R of[-.1,.1]){const N=new D(b,-.018,R).applyQuaternion(C).add(A),z=Math.max(.01,N.y-.821);K(new st(.008,.008,z,16),I.metal,Ue,N.x,.821+z/2,N.z),K(new st(.019,.019,.003,20),I.black,Ue,N.x,.822,N.z)}function Ve(b,R,N,z){const F=document.createElement("canvas");F.width=b,F.height=R;const V=F.getContext("2d"),re=new Kc(F);re.colorSpace=Mn,re.anisotropy=Math.min(_.capabilities.getMaxAnisotropy(),16),re.magFilter=si,re.minFilter=Ki,re.generateMipmaps=!0;const ie=new Xn({map:re,transparent:!0,side:pi,depthWrite:!1,toneMapped:!1}),be=new En(new Ui(N,z),ie);return{canvas:F,context:V,texture:re,object:be}}function rt(b,R,N,z,F){const V=String(R??"");if(b.measureText(V).width<=F){b.fillText(V,N,z);return}let re=V;for(;re.length&&b.measureText(`${re}…`).width>F;)re=re.slice(0,-1);b.fillText(`${re}…`,N,z)}function Tt(b,R,N,z,F,V,re=3){const ie=String(R??"").split(/\s+/);let be="",Fe=0;for(let gt=0;gt<ie.length;gt++){const vt=be?`${be} ${ie[gt]}`:ie[gt];if(b.measureText(vt).width>F&&be){if(b.fillText(be,N,z+Fe*V),be=ie[gt],Fe++,Fe===re-1)return rt(b,ie.slice(gt).join(" "),N,z+Fe*V,F),Fe+1}else be=vt}return be&&b.fillText(be,N,z+Fe*V),Fe+1}function k(b,R="",N=.44,z=.14){const F=Ve(512,160,N,z),V=(re,ie)=>{const be=F.context;be.clearRect(0,0,512,160),be.textAlign="center",be.fillStyle="#ffffff",be.font=ie?"600 72px monospace":"600 104px monospace",rt(be,re,256,ie?67:113,496),be.fillStyle="#f0f4ed",be.font="600 59px monospace",rt(be,ie,256,142,496),F.texture.needsUpdate=!0};return V(b,R),F.object.rotation.x=-Math.PI/2,{...F,draw:V}}const me=k("TRAINER PCB","DC / ANALOG",.68,.15);me.object.position.set(-1.11,.932,-.84),oe.add(me.object);const de=k("ELEN 221","PATCH TERMINALS",.45,.13);de.object.position.set(1.17,.932,-.86),oe.add(de.object);const se=new Zt,ce=new Zt,Ee=new Zt;oe.add(se,ce),m.add(Ee);const pe=new Map,Me=Jx(),Qe=new Map;let tt=[],U=[],T=[],j=[];const ee=[],fe=[],ne=new Map,Ne=new Set,ye=new Zt;m.add(ye);let Ge="",ze="vdc",Z={components:[],wires:[],actions:[],live:{title:"Circuit bench",lines:[]}},Re="",Ke="",Xe="",Ae="",Ye=null,G="",_e=!1,Se=null,De="status",ge="",ue=null,We=0,Je=!1;function At(b){b.traverse(R=>{var z,F;(z=R.geometry)==null||z.dispose();const N=Array.isArray(R.material)?R.material:R.material?[R.material]:[];for(const V of N)le.has(V)||((F=V.map)==null||F.dispose(),V.dispose())}),b.clear()}function dt(b,R,N,z,F=32){return K(new Ks(new Fs(b),F,R,7,!1),N,z)}function Gn(b,R,N){K(new st(.027,.027,.003,24),I.copper,b,R,.929,N),K(new st(.018,.023,.008,24),I.solder,b,R,.934,N),K(new st(.005,.005,.001,12),I.black,b,R,.939,N)}function Wn(b,R,N,z,F,V,re=0,ie="#dddcd4"){const be=Ve(512,256,z,F),Fe=be.context;return Fe.fillStyle=ie,Fe.textAlign="center",Fe.font="600 76px monospace",rt(Fe,R,256,112,490),Fe.font="48px monospace",rt(Fe,N,256,190,490),be.texture.needsUpdate=!0,be.object.rotation.x=-Math.PI/2,be.object.position.set(0,V,re),b.add(be.object),be}const Lr=["#171718","#65432b","#922a25","#bb6726","#d7c24c","#3d6542","#31516d","#725475","#797b79","#dddcd0"];function li(b){const R=String(b).match(/([\d.]+)\s*(k|M)?/),N=R?Number(R[1])*(R[2]==="k"?1e3:R[2]==="M"?1e6:1):1e3,z=Math.floor(Math.log10(Math.max(N,.01)))-1,F=Math.round(N/10**z),V=z===-1?"#ac9456":z===-2?"#aeb1ae":Lr[Math.max(0,Math.min(9,z))];return[Lr[Math.floor(F/10)],Lr[F%10],V,"#b09a60"]}function Jn(b){var R;if(b.type==="ground")return"GND";if(b.type==="C")return"C1";if(b.type==="L")return"L1";if(b.type==="opamp")return"U1";if(b.type==="switch")return"S1";if(b.type==="R"){const N={load:"RL",rin:"Rin",rf:"Rf",r:"R",r1:"R1",r2:"R2"}[b.id];if(N)return N;if(b.id==="req")return((R=Z.parameters)==null?void 0:R.representation)==="norton"?"Rn":"Rth"}return String(b.label).replace("DC SOURCE","DC SUPPLY").replace("REFERENCE","GND")}function to(b){return Z.module==="thevenin"?{load:"load",req:"equivalentResistance"}[b.id]:Z.module==="opamp"?{rin:"rin",rf:"rf"}[b.id]:Z.module==="transient"&&b.id==="r"?"resistance":null}function ki(b,R=fe){for(const z of b.targets)if(z.object.userData.direct=z,z.kind==="dial"){const F=new En(new Ci(.022,12,8),new Xn({transparent:!0,opacity:0,depthWrite:!1}));F.userData.direct=z,z.object.add(F),z.pickSleeve=F}const N=b.dispose;return b.dispose=()=>{for(const z of b.targets)z.pickSleeve&&(z.pickSleeve.geometry.dispose(),z.pickSleeve.material.dispose(),z.pickSleeve.removeFromParent(),z.pickSleeve=null);N()},R.push(b),b}function sr(b,R,N,z=-.53){return ki(b,ee),b.group.scale.setScalar(1/.36),b.group.rotation.x=z,R.add(b.group),R.updateWorldMatrix(!0,!0),(b.anchors["+"]?[b.anchors["+"],b.anchors["−"]]:b.anchors.A?[b.anchors.A,b.anchors.B]:Object.values(b.anchors).slice(0,2)).forEach(V=>N.push(R.worldToLocal(V.getWorldPosition(new D)))),b.anchors.OUT&&N.length===1&&N.push(N[0].clone().add(new D(.007/.36,0,0))),b.update({...Z,meterMode:ze}),b}function no(b){var R,N,z;for(const F of ee)F.dispose();ee.length=0,At(se),pe.clear(),Qe.clear(),tt=[],U=[];for(const F of b){const V=new Zt;V.position.set(F.x,.955,F.z),["V","I"].includes(F.type)&&V.position.set(((R=F.benchPosition)==null?void 0:R[0])??Math.sign(F.x||-1)*2.15,.842,((N=F.benchPosition)==null?void 0:N[1])??F.z),se.add(V);const re=F.pins||[];re.length===2&&["R","L","C"].includes(F.type)&&(V.rotation.y=-Math.atan2(re[1].z-re[0].z,re[1].x-re[0].x));const ie=[];let be=()=>{};switch(F.type){case"R":{const Le=to(F);if(Le){V.rotation.y=0;const $e=sr(Bx({id:F.id,label:Jn(F),parameter:Le}),V,ie,-.18);be=()=>$e.update(Z);break}const Ce=[[.014,-.13],[.026,-.115],[.035,-.098],[.034,-.073],[.032,-.045],[.032,.045],[.034,.073],[.035,.098],[.026,.115],[.014,.13]],lt=K(new Rl(Ce.map(([$e,pt])=>new xe($e,pt)),32),I.resistor,V,0,.046);lt.rotation.z=Math.PI/2;const ut=[];for(const[$e,pt]of[-.079,-.035,.011,.085].entries()){const qt=$e===0||$e===3?.0354:.0328,zt=K(new st(qt,qt,.014,32),W(li(F.value)[$e],{roughness:.74}),V,pt,.046);zt.rotation.z=Math.PI/2,ut.push(zt)}be=$e=>li($e).forEach((pt,qt)=>ut[qt].material.color.set(pt)),ie.push(new D(-.13,.046,0),new D(.13,.046,0));break}case"C":{const Le=document.createElement("canvas");Le.width=768,Le.height=512;const Ce=Le.getContext("2d");Ce.fillStyle="#202427",Ce.fillRect(0,0,768,512),Ce.fillStyle="#c6c9be",Ce.fillRect(145,0,110,512),Ce.fillStyle="#333835",Ce.font="bold 82px monospace",Ce.textAlign="center";for(const ut of[105,245,385])Ce.fillText("−",200,ut);Ce.fillStyle="#d2d4c8",Ce.font="bold 78px monospace",Ce.fillText("100µF",520,165),Ce.fillText("25V",520,285),Ce.font="48px monospace",Ce.fillText("105°C",520,391);const lt=new Kc(Le);lt.colorSpace=Mn,K(new st(.07,.07,.166,48),W("#ffffff",{map:lt,roughness:.67}),V,0,.094),K(new st(.064,.064,.008,48),I.metal,V,0,.181),K(new ji(.065,.005,8,48),I.metal,V,0,.184).rotation.x=-Math.PI/2;for(const ut of[Math.PI/4,-Math.PI/4]){const $e=K(new Xt(.1,.0015,.003),I.navy,V,0,.186);$e.rotation.y=ut}K(new st(.061,.061,.013,32),I.black,V,0,.007),ie.push(new D(-.03,.003,0),new D(.03,.003,0));break}case"L":{K(new st(.03,.03,.29,24),I.black,V,0,.06).rotation.z=Math.PI/2;for(const Ce of[-.145,.145])K(new st(.058,.058,.015,32),I.black,V,Ce,.06).rotation.z=Math.PI/2;const Le=[];for(let Ce=0;Ce<=560;Ce++){const lt=Ce/560*Math.PI*28;Le.push(new D(-.131+Ce/560*.262,.06+Math.sin(lt)*.041,Math.cos(lt)*.041))}dt(Le,.0077,I.copper,V,560),ie.push(new D(-.151,.052,0),new D(.151,.052,0));break}case"opamp":{const Le=new gd;Le.moveTo(-.083,-.135),Le.lineTo(-.027,-.135),Le.absarc(0,-.135,.027,Math.PI,0,!0),Le.lineTo(.083,-.135),Le.lineTo(.083,.135),Le.lineTo(-.083,.135),Le.closePath();const Ce=K(new Al(Le,{depth:.052,bevelEnabled:!0,bevelSegments:2,steps:1,bevelSize:.003,bevelThickness:.003}),I.black,V,0,.079);Ce.rotation.x=Math.PI/2;for(const ut of[-.105,.105])for(const $e of[-.099,-.033,.033,.099]){K(new Xt(.056,.009,.019),I.metal,V,ut,.036,$e),K(new Xt(.009,.052,.019),I.metal,V,Math.sign(ut)*.133,.01,$e);const pt=new D(Math.sign(ut)*.133,-.02,$e).add(V.position);Gn(se,pt.x,pt.z)}K(new st(.009,.009,.001,16),W("#85877f"),V,-.052,.084,-.103),Wn(V,"OP AMP","DIP-8",.115,.143,.084,.024);const lt={"op+":[-.133,-.016,.033],"op-":[-.133,-.016,-.033],out:[.133,-.016,.033],vp:[.133,-.016,-.033],vn:[-.133,-.016,.099]};re.forEach(ut=>ie.push(new D(...lt[ut.id]||[0,0,0])));break}case"switch":{K(Ie(.155,.056,.13,.004),I.black,V,0,.015),K(new Xt(.167,.01,.143),I.metal,V,0,.049),K(new st(.036,.036,.044,32),I.metal,V,0,.075),K(new st(.049,.049,.017,6),I.metal,V,0,.074),K(new ji(.037,.003,6,32),I.navy,V,0,.092).rotation.x=-Math.PI/2;const Le=new Zt;Le.position.y=.09,V.add(Le),K(new st(.011,.013,.125,20),I.metal,Le,0,.06),K(new Ci(.014,20,12),I.metal,Le,0,.123),be=Ce=>{Le.rotation.x=String(Ce).toUpperCase().includes("RETURN")?.39:-.39},be(F.value),ie.push(new D(-.046,-.012,-.047),new D(.056,-.012,0),new D(-.046,-.012,.047));for(const Ce of ie)K(new Xt(.022,.025,.011),I.brass,V,Ce.x,Ce.y,Ce.z);break}case"ground":{ie.push(new D(0,-.021,0));break}default:{let Le="equivalentVoltage",Ce=null,lt=1;Z.module==="thevenin"?((z=Z.parameters)==null?void 0:z.representation)==="original"?Ce=12:F.type==="I"&&(Le="nortonCurrent"):Z.module==="superposition"?(Le=F.id==="a"?"v1":"v2",lt=F.id==="b"?-1:1):Z.module==="opamp"?Le="rail":Ce=5;const ut=F.id==="signal"?zx({id:F.id}):kx({id:F.id,label:Jn(F),parameter:Le,fixedValue:Ce,polarity:lt});sr(ut,V,ie),be=()=>ut.update(Z);break}}const Fe=Z.module==="opamp"&&F.type==="ground",gt=k(Jn(F),Fe?"":F.value,Fe?.4:.5,.16),nt=re.length===2&&Math.abs(re[1].z-re[0].z)>Math.abs(re[1].x-re[0].x)?Math.max(...re.map(Le=>Le.z))+.22:F.z+(F.type==="switch"?.4:.22);if(gt.object.position.set(Fe?1.32:F.x,.933,Fe?.79:nt),se.add(gt.object),Qe.set(F.id,{value:F.value,label:F.label,draw:(Le,Ce)=>gt.draw(Jn(F),Fe?"":Ce),body:V,type:F.type,updateHardware:be}),F.type!=="ground"){const Le=["V","I"].includes(F.type)?[.46,.19,.34]:F.type==="C"?[.18,.23,.18]:F.type==="L"?[.35,.15,.17]:F.type==="opamp"?[.3,.12,.32]:F.type==="switch"?[.2,.23,.21]:[.3,.11,.12],Ce=new Xt(...Le),lt=K(Ce,new Xn({transparent:!0,opacity:0,depthWrite:!1}),V,0,Le[1]/2-.025,0);lt.castShadow=!1,lt.receiveShadow=!1,lt.userData={kind:"part",id:F.id,label:`${Jn(F)} · ${F.value}`,type:F.type},F.type==="switch"&&(lt.userData.direct={object:lt,kind:"switch",id:F.id,label:"Source / Return",action:"switch"});const ut=new Gp(new Wp(Ce),new Yo({color:"#cfb862",transparent:!0,opacity:.85}));ut.position.copy(lt.position),ut.visible=!1,V.add(ut),Qe.get(F.id).outline=ut,Qe.get(F.id).hit=lt,U.push(lt)}for(const[Le,Ce]of re.entries()){const ut=(ie[Le]||new D(0,0,0)).clone().applyAxisAngle(new D(0,1,0),V.rotation.y).add(V.position),$e=new D(Ce.x-ut.x,0,Ce.z-ut.z).normalize(),pt=ut.clone().addScaledVector($e,["R","L"].includes(F.type)?.052:.014);if(pt.y=.938,["V","I"].includes(F.type)){const bt=new D(Ce.x,.995,Ce.z),Ht=ut.clone().lerp(bt,.5);Ht.y=Math.max(.95,Ht.y),dt([ut,ut.clone().lerp(Ht,.3),Ht,bt],.008,Le===0?I.red:I.black,se,24)}else if(F.type!=="ground"){ut.distanceTo(pt)>.006&&dt([ut,ut.clone().lerp(pt,.55).add(new D(0,.006,0)),pt],.006,I.metal,se,14),Gn(se,pt.x,pt.z);const bt=new D(Ce.x,.929,Ce.z),Ht=pt.clone().lerp(bt,.5);Ht.y=.929,dt([new D(pt.x,.929,pt.z),Ht,bt],.007,I.trace,se,12)}const qt=["V","I","C"].includes(F.type)&&Le===0||Ce.label==="5 V"||Ce.label==="V+",zt=Z.module==="opamp"&&["gnd","out"].includes(Ce.id),nn={x:Ce.x,z:Ce.z,red:qt,label:`${Jn(F)} ${Ce.label||Ce.id}`,common:zt,sockets:[]};nn.addSocket=({x:bt,z:Ht})=>{const Mi=nn.sockets.length;if(zt&&Mi>0){const Nr=nn.sockets[Mi-1];dt([new D(Nr.x,.942,Nr.z),new D(bt,.942,Ht)],.013,I.brass,se,8)}K(new st(.044,.044,.006,6),I.metal,se,bt,.934,Ht),K(new st(.037,.041,.017,32),qt?I.red:I.black,se,bt,.946,Ht),K(new st(.032,.032,.028,32),qt?I.red:I.black,se,bt,.968,Ht);for(const Nr of[.956,.964,.972])K(new ji(.032,.0018,5,32),qt?I.red:I.navy,se,bt,Nr,Ht).rotation.x=-Math.PI/2;K(new ji(.018,.004,8,32),I.metal,se,bt,.984,Ht).rotation.x=-Math.PI/2,K(new st(.014,.014,.005,24),I.black,se,bt,.982,Ht);const Vi=K(new ji(.054,.0035,6,32),W("#ece6bd",{roughness:.6}),se,bt,.928,Ht);Vi.rotation.x=-Math.PI/2,Vi.visible=!1;const ei=K(new Ci(.068,12,8),new Xn({transparent:!0,opacity:0,depthWrite:!1}),se,bt,.984,Ht);ei.castShadow=!1,ei.receiveShadow=!1,ei.userData={kind:"terminal",id:Ce.id,socket:Mi,label:nn.label},ei.userData.direct={object:ei,kind:"terminal",id:Ce.id,terminal:Ce.id,socket:Mi,label:nn.label},tt.push(ei),nn.sockets.push({x:bt,z:Ht,socket:Mi,ring:Vi,hit:ei}),Mi||Object.assign(nn,{ring:Vi,hit:ei})};const _n=zt?Ce.id==="gnd"?8:3:1;for(let bt=0;bt<_n;bt++)nn.addSocket(zt?Th(Ce.id,bt):Ce);if(pe.set(Ce.id,nn),!Fe){const bt=k(Ce.label||Ce.id,"",zt?.25:.15,zt?.08:.063);bt.object.position.set(zt?.8:Ce.x,.932,zt?-.36:Ce.z+.086),se.add(bt.object)}}}}let ui=null,or=0,vs=0;const io=new WeakMap;let _s=new Map,zi=new Map;const ar=new Map,Bi=b=>b.map(R=>new D(R.x,R.y,R.z)),Dr=b=>new Fs(Bi(b)).getSpacedPoints(47),P=(b,R)=>Math.max(...b.map((N,z)=>Math.hypot(N.x-R[z].x,N.y-R[z].y,N.z-R[z].z)));function q(b){const R=Bi(b.points).map(z=>oe.worldToLocal(z)),N=new Fs(R);for(const[z,F]of[[b.wire,.009],[b.hit,.019]])z.geometry.dispose(),z.geometry=new Ks(N,96,F,7,!1)}function J(b){for(const R of zi.values()){if(!R.settling)continue;const N=(b-R.time)/1e3;R.time=b,R.points=wh(R.points,R.target,N,{maxSpeed:.3}),P(R.points,R.target)<1e-4&&(R.points=R.target,R.settling=!1),q(R),_.shadowMap.needsUpdate=!0}}function Q(b=!1){if(!ui){oe.updateWorldMatrix(!0,!0);const R=[...Qe.values()].filter(F=>F.type!=="ground").flatMap(F=>{const V=new er().setFromObject(F.body);return V.isEmpty()?[]:[V]}),N=(F,V)=>({minX:F.x,maxX:V.x,minZ:F.z,maxZ:V.z,top:V.y}),z=[je,Be].map(F=>(F.group.updateWorldMatrix(!0,!0),new er().setFromObject(F.group))).filter(F=>!F.isEmpty());ui={world:[...R,...z].map(F=>N(F.min,F.max)),local:R.map(F=>N(oe.worldToLocal(F.min.clone()),oe.worldToLocal(F.max.clone())))}}return ui[b?"world":"local"]}function X(b){const R=zi;zi=new Map,At(ce),T=[],j=[],oe.updateWorldMatrix(!0,!1);const N=b.flatMap(([F,V],re)=>{const ie=pe.get(F),be=pe.get(V);if(!ie||!be)return[];const Fe=[F,V].sort().join("|"),gt=Oe(F,`wire:${Fe}:${F}`),vt=Oe(V,`wire:${Fe}:${V}`);return!gt||!vt?[]:[{id:Fe,a:F,b:V,index:re,startPin:ie,endPin:be,start:oe.worldToLocal(gt),end:oe.worldToLocal(vt)}]}),z=Zx(N,{obstacles:Q(),previousRoutes:_s,layoutKey:vs});_s=z,N.forEach(({id:F,a:V,b:re,index:ie,startPin:be,endPin:Fe,start:gt,end:vt})=>{const nt=V==="gnd"||re==="gnd"||V.endsWith("-")||re.endsWith("-")||V==="return"||re==="return",Le=W(nt?"#202121":"#8b2925",{roughness:.79}),Ce=z.get(F),lt=R.get(F),ut=(lt==null?void 0:lt.route)===Ce?lt.target:Dr(Ce).map(bt=>oe.localToWorld(bt)),$e=ar.get(F);ar.delete(F);const qt=($e?$e.from===V?$e.points:[...$e.points].reverse():null)||((lt==null?void 0:lt.route)===Ce?lt.points:ut),zt=Bi(qt).map(bt=>oe.worldToLocal(bt)),nn=dt(zt,.009,Le,ce,96);nn.userData={kind:"wire",index:ie};const _n=dt(zt,.019,new Xn({transparent:!0,opacity:0,depthWrite:!1}),ce,96);zi.set(F,{a:V,b:re,route:Ce,points:qt,target:ut,wire:nn,hit:_n,time:performance.now(),settling:qt!==ut}),_n.castShadow=!1,_n.receiveShadow=!1,_n.userData={kind:"wire",index:ie,id:String(ie),label:`${be.label} → ${Fe.label}`,wire:nn,color:Le.color.getHex()},T.push(_n);for(const[bt,Ht]of[gt,vt].entries()){const Mi=K(new st(.023,.026,.055,24),Le,ce,Ht.x,1.012,Ht.z),Vi=K(new Ci(.037,12,8),new Xn({transparent:!0,opacity:0,depthWrite:!1}),ce,Ht.x,1.03,Ht.z),ei={object:Vi,kind:"plug",id:`wire:${ie}:${bt}`,resource:`wire:${[V,re].sort().join("|")}`,wireIndex:ie,wirePair:[V,re],endpoint:bt,terminal:bt?re:V,from:bt?V:re,label:`Pull ${bt?Fe.label:be.label} plug`,color:Le.color.getHex()};Mi.userData.direct=ei,Vi.userData.direct=ei,j.push(Vi,Mi);for(const Nr of[.988,.996,1.004])K(new ji(.023,.0018,6,24),Le,ce,Ht.x,Nr,Ht.z).rotation.x=-Math.PI/2}})}function ve(b){const R=Z.wires.filter(N=>N.includes(b)).map(([N,z])=>Ls(N,z,b));for(const N of["red","black","ch1","ch2","ch1Ground","ch2Ground"])ke(N)===b&&R.push(`probe:${N}`);for(const N of Ne)N.from===b&&R.push(N.resource);return R}function we(){return oe.updateWorldMatrix(!0,!1),[...pe].flatMap(([b,R])=>R.sockets.map(N=>({id:b,socket:N.socket,hit:N.hit,position:oe.localToWorld(new D(N.x,1.002,N.z))})))}function Oe(b,R){const N=pe.get(b);if(!N)return null;const z=N.common?Me.resolve(b,R,ve(b)):0;for(;N.sockets.length<=z;)N.addSocket(Th(b,N.sockets.length));const F=N.sockets[z];return oe.updateWorldMatrix(!0,!1),oe.localToWorld(new D(F.x,1.002,F.z))}function ke(b){var N,z,F;if(b==="red"||b==="black")return((N=Z.probes)==null?void 0:N[b])||null;const R=b.slice(0,3);return((F=(z=Z.scope)==null?void 0:z[R])==null?void 0:F[b.endsWith("Ground")?"ground":"signal"])||null}const je=ki(Nx());je.group.position.set(-.43,.823,-.3),je.group.rotation.x=-.56,ye.add(je.group);let Be=ki(yh({module:"thevenin"}));Be.group.position.copy(A),Be.group.quaternion.copy(C),Be.group.scale.setScalar(S),ye.add(Be.group);let He=null;const ft=[["red","#b52e2b","Meter V",-.52],["black","#252829","Meter COM",-.35],["ch1","#d5b348","CH1",.1],["ch2","#64a5b5","CH2",.26],["ch1Ground","#a68e42","CH1 ground",.41],["ch2Ground","#477d8c","CH2 ground",.53]];for(const[b,R,N,z]of ft){const F=Hx({id:`probe:${b}`,channel:b,color:R,label:N}),V=new D(z,.831,-.345);F.group.position.copy(V),F.group.rotation.x=-Math.PI/2;const re=new En(new Ml(.014,/Ground/.test(b)?.024:.12,4,8),new Xn({transparent:!0,opacity:0,depthWrite:!1}));re.position.y=/Ground/.test(b)?.027:.087,re.userData.direct=F.targets[0],F.group.add(re),F.targets[0].object=re,F.targets[0].resource=`probe:${b}`;const ie=bh({color:R,radius:.0019});m.add(F.group,ie.group),ne.set(b,{unit:F,pick:re,cable:ie,home:V,connected:void 0,channel:b,color:R,loose:!1})}function Ct(b=!1){for(const N of[...Ne])![...kt.holds.values()].some(F=>F.lead===N)&&N.originalPair&&Z.wires.some(F=>F.includes(N.originalPair[0])&&F.includes(N.originalPair[1]))&&xs(N);const R=Z.module||"thevenin";if(R!==Ge){if(R.split(":")[0]!==Ge.split(":")[0]){const N=fe.indexOf(Be);N>=0&&fe.splice(N,1),Be.dispose(),Be=ki(Z.module==="opamp"?Fx():yh({module:Z.module||"thevenin"})),Be.group.position.copy(A),Be.group.quaternion.copy(C),Be.group.scale.setScalar(S),ye.add(Be.group),ui=null,or++}Ge=R,He==null||He.dispose(),He=Vx({module:Z.module||"thevenin"}),ki(He,[]),He.group.position.copy(M),He.group.quaternion.copy(w),ye.add(He.group)}for(const N of[...fe,...ee,He].filter(Boolean))N.update({...Z,meterMode:ze});for(const N of ne.values()){const z=!N.channel.startsWith("ch")||Z.module==="opamp";if(N.unit.group.visible=N.cable.group.visible=z,kt.isHeld(`probe:${N.channel}`))continue;const F=ke(N.channel);if(F!==N.connected||b){delete N.restPose,N.connected=F;const V=Oe(F,`probe:${N.channel}`);V?(N.unit.group.position.copy(V),N.unit.group.rotation.set(-.24,0,N.channel.includes("2")?-.28:.28),N.loose=!1):N.loose||(N.unit.group.position.copy(N.home),N.unit.group.rotation.set(-Math.PI/2,0,0))}}Rt()}function Gt(b,R,N,z,F=!1){const V=performance.now(),re=[...b.toArray(),...R.toArray()].map(be=>be.toFixed(5)).join(":");let ie=io.get(z);if(!ie||ie.revision!==or){const be=Dr(Sh(b,R,N));ie={points:be,target:be,reference:be,signature:re,held:F,time:V,revision:or},io.set(z,ie)}return F?(ie.held||(ie.reference=ie.points),(!ie.held||ie.signature!==re)&&(ie.points=oc(ie.reference,b,R))):((ie.held||ie.signature!==re)&&(ie.target=Dr(Sh(b,R,N))),ie.points!==ie.target&&(ie.points=wh(ie.points,ie.target,(V-ie.time)/1e3,{maxSpeed:.3}),P(ie.points,ie.target)<1e-4&&(ie.points=ie.target),_.shadowMap.needsUpdate=!0)),ie.signature=re,ie.held=F,ie.time=V,ie.points}function Rt(){const b=performance.now();J(b);const R=Q(!0);for(const N of ne.values()){if(!N.unit.group.visible)continue;if(N.restPose){const nt=Math.min((b-N.restPose.time)/1e3,.05);N.restPose.time=b;const Le=N.unit.group.position.distanceTo(N.restPose.position);N.unit.group.position.lerp(N.restPose.position,Le?Math.min(1,.4*nt/Le):1),N.unit.group.quaternion.slerp(N.restPose.quaternion,1-Math.exp(-10*nt)),Le<1e-4&&N.unit.group.quaternion.angleTo(N.restPose.quaternion)<.001&&delete N.restPose,_.shadowMap.needsUpdate=!0}const z=N.channel,F=z.endsWith("Ground"),V=z==="red"?je.anchors.V:z==="black"?je.anchors.COM:Be.anchors[z.startsWith("ch1")?"CH1":"CH2"],re=F?ne.get(z.slice(0,3)):null,ie=re?re.unit.group.localToWorld(new D(0,.055,0)):V==null?void 0:V.getWorldPosition(new D),be=N.unit.anchors.cable.getWorldPosition(new D),Fe={red:0,black:1,ch1:2,ch2:3,ch1Ground:0,ch2Ground:1}[z]||0,gt=V?new D(0,0,1).applyQuaternion(V.getWorldQuaternion(new hn)):new D(0,0,1),vt=kt.isHeld(`probe:${z}`)||!!N.restPose||!!(re&&(kt.isHeld(`probe:${re.channel}`)||re.restPose));ie&&N.cable.update(Gt(ie,be,{lane:Fe,exit:gt,obstacles:R,branch:F},N.cable,vt))}for(const N of Ne){if(N.restPosition){const F=Math.min((b-N.restTime)/1e3,.05);N.restTime=b;const V=N.plug.position.distanceTo(N.restPosition);N.plug.position.lerp(N.restPosition,V?Math.min(1,.4*F/V):1),V<1e-4&&delete N.restPosition,_.shadowMap.needsUpdate=!0}const z=Oe(N.from,N.resource);if(!z){N.cable.group.visible=N.plug.visible=!1;continue}N.points=oc(N.reference,z,N.plug.position),N.cable.update(N.points)}}const Et=new an;Et.setAttribute("position",new Kn(new Float32Array(48),3));const Ze=new Zc(Et,new Em({color:"#e9df9a",dashSize:.035,gapSize:.025,depthTest:!1}));Ze.visible=!1,Ze.renderOrder=8,oe.add(Ze);let Ot=null;const xt=new Pi(new D(0,1,0),-.88072);function pn(){for(const[R,N]of pe){const z=R===Z.selectedTerminal;for(const F of N.sockets){const V=(Ye==null?void 0:Ye.kind)==="terminal"&&Ye.id===R&&(Ye.socket??0)===F.socket;F.ring.visible=z||V,F.ring.material.color.set(z?"#f4d973":"#e6eef5"),F.ring.scale.setScalar(z?1.27:1.12)}}for(const[R,N]of Qe)N.outline&&(N.outline.visible=Z.selectedPart===R||(Ye==null?void 0:Ye.kind)==="part"&&Ye.id===R);for(const R of T){const N=R.userData;N.wire.material.color.set((Ye==null?void 0:Ye.kind)==="wire"&&Ye.id===String(N.index)&&Z.tool==="remove"?"#d57937":N.color)}const b=pe.get(Z.selectedTerminal);if(Ze.visible=!!b&&(Z.tool||"wire")==="wire",b){const R=(Ye==null?void 0:Ye.kind)==="terminal"?pe.get(Ye.id):null,N=R?new D(R.x,1.013,R.z):Ot?oe.worldToLocal(Ot.clone()):new D(b.x+.16,1.013,b.z+.16);N.y=Math.max(.988,Math.min(1.1,N.y));const z=new D(b.x,1.013,b.z),F=z.clone().lerp(N,.5);F.y+=.075;const V=new Tl(z,F,N),re=Et.attributes.position;for(let ie=0;ie<16;ie++){const be=V.getPoint(ie/15);re.setXYZ(ie,be.x,be.y,be.z)}re.needsUpdate=!0,Et.computeBoundingSphere(),Ze.computeLineDistances()}}const mn=new Zt;mn.visible=!1,m.add(mn);function gn(b,R,N,z,F=0){const V=new Zt;V.position.set(R,N,z),V.rotation.y=F,mn.add(V);const re=K(Ie(b.object.geometry.parameters.width+.045,b.object.geometry.parameters.height+.045,.042,.02),I.navy,V,0,0,-.026);return re.castShadow=!1,re.receiveShadow=!1,b.object.castShadow=!1,b.object.receiveShadow=!1,V.add(b.object),V}const zn=Ve(1152,768,.96,.64),Pt=Ve(840,1280,.68,1.036),wn=gn(zn,0,1.72,-1.8),Tn=gn(Pt,1.24,1.62,-1.02,-.88),tn=[];function $t(){const{context:b,canvas:R}=zn,N=Z.diagnostic||{level:"info",title:"Circuit ready",message:"Use the equipment to take readings."},z=N.level==="error"?"#893e25":N.level==="warning"?"#7b551e":"#25483d";b.fillStyle="#f7f8f3",b.fillRect(0,0,R.width,R.height),b.textAlign="left",b.textBaseline="alphabetic",b.fillStyle="#344b43",b.font="600 40px Arial",b.fillText(De==="schematic"?"Circuit diagram":"Circuit check",42,68),tn.length=0;const F=(V,re,ie,be,Fe,gt,vt=!1)=>{b.fillStyle=vt?"#29463b":"#e1e8e0",b.fillRect(V,re,ie,be),b.fillStyle=vt?"#fff":"#273b32",b.font="600 36px Arial",b.textAlign="center",rt(b,Fe,V+ie/2,re+be/2+12,ie-24),b.textAlign="left",tn.push({x:V,y:re,w:ie,h:be,action:gt})};for(const[V,[re,ie]]of[["status","Status"],["schematic","Diagram"]].entries())F(740+V*185,26,170,62,ie,()=>{De=re,$t()},De===re);if(De==="schematic")if(ue){const V={x:22,y:115,w:1108,h:518},re=Math.min(V.w/ue.width,V.h/ue.height),ie=ue.width*re,be=ue.height*re;b.drawImage(ue,V.x+(V.w-ie)/2,V.y+(V.h-be)/2,ie,be)}else b.fillStyle="#344b43",b.font="42px Arial",b.fillText("Loading the circuit diagram…",48,260);else b.fillStyle=z,b.fillRect(42,132,8,454),b.font="700 64px Arial",Tt(b,N.title,78,193,1026,75,2),b.fillStyle="#22382e",b.font="48px Arial",Tt(b,N.message,78,367,1026,60,3),b.fillStyle="#526258",b.font="38px Arial",Tt(b,N.detail||"",78,565,1026,48,2);F(42,667,335,66,"Recenter",()=>ya()),F(775,667,335,66,_.xr.isPresenting?"Exit VR":"Close preview",()=>_.xr.isPresenting?void oo.exit():fa(!1)),zn.texture.needsUpdate=!0}zn.object.userData={kind:"panel",activate:b=>{var z;const R=b.uv.x*zn.canvas.width,N=(1-b.uv.y)*zn.canvas.height;(z=tn.find(F=>R>=F.x&&R<=F.x+F.w&&N>=F.y&&N<=F.y+F.h))==null||z.action()}};function Ir(b){if(!Number.isFinite(Number(b))||b===null||b==="")return String(b??"—");const R=Number(b);return R!==0&&(Math.abs(R)>=1e5||Math.abs(R)<1e-4)?R.toExponential(2):Number(R.toPrecision(4)).toString()}function yi(){var re,ie,be;const b=Pt.context,R=Pt.canvas.width;b.fillStyle="#f9faf6",b.fillRect(0,0,R,1280),b.textAlign="left",b.textBaseline="alphabetic",b.fillStyle="#14211f",b.font="700 62px Arial",b.fillText("Live readings",48,88),b.fillStyle="#45524e",b.font="38px Arial";const N={thevenin:"Load circuit",superposition:"Selected sources",opamp:"Amplifier",transient:`${((re=Z.parameters)==null?void 0:re.kind)||"RC"} circuit`};b.fillText(N[Z.module]||"Circuit bench",48,139);const z=(Z.metrics||[]).slice(0,3),F={Voltmeter:"Meter voltage","Voltage sample":"Voltage at input peak","Linear gain":"Gain"};z.forEach((Fe,gt)=>{const vt=180+gt*271;b.strokeStyle="#bdc8c2",b.lineWidth=2,b.beginPath(),b.moveTo(48,vt-16),b.lineTo(R-48,vt-16),b.stroke(),b.fillStyle="#34433e",b.font="600 47px Arial",rt(b,F[Fe.label]||Fe.label,48,vt+42,R-96);const nt=Ir(Fe.value),Le=Fe.unit||"";b.fillStyle="#101c18",b.font="700 142px Arial";const Ce=R-206;let lt=142;for(;b.measureText(nt).width>Ce&&lt>86;)lt-=4,b.font=`700 ${lt}px Arial`;b.fillText(nt,48,vt+185);const ut=b.measureText(nt).width;b.font="600 54px Arial",b.fillText(Le,Math.min(R-151,48+ut+22),vt+182),b.fillStyle="#4b5852",b.font="34px Arial";const $e=Fe.label==="Voltmeter"||Fe.label==="Voltage sample"?Fe.value==="—"?Fe.detail||"Place both probes":"V tip − COM tip":Fe.label==="Branch current"||Fe.label==="Storage current"?"Current: top → ground":Fe.label==="Load power"?"From load voltage × current":Fe.label==="Linear gain"?"Output / input, before clipping":"";rt(b,$e,48,vt+238,R-96)});const V=Z.measurement||{};V.ok===!1?(b.fillStyle="#f4e6d6",b.fillRect(28,1012,R-56,236),b.fillStyle="#6b341b",b.font="700 43px Arial",b.fillText("Check connections",48,1066),b.font="37px Arial",Tt(b,V.error||"Complete the circuit to take a reading.",48,1121,R-96,47,3)):Z.module==="transient"?(b.fillStyle="#243b32",b.font="600 44px Arial",b.fillText((ie=Z.parameters)!=null&&ie.playing?"Running":"Paused",48,1076),b.font="700 75px Arial",b.fillText(`${Ir((((be=Z.parameters)==null?void 0:be.time)||0)*1e3)} ms`,48,1172,R-96),b.font="34px Arial",b.fillText("Elapsed circuit time",48,1226)):Z.module==="opamp"&&V.clipped?(b.fillStyle="#f4e6d6",b.fillRect(28,1035,R-56,128),b.fillStyle="#6b341b",b.font="700 48px Arial",b.fillText("Output is clipping",48,1117)):(b.fillStyle="#46564c",b.font="37px Arial",b.fillText("Readings follow the circuit.",48,1096)),Pt.texture.needsUpdate=!0}Pt.object.userData={kind:"panel",activate:()=>!0};function Bd(b,R){var gt,vt;const N=bh({color:b.color||"#862926",radius:.00324}),z=new Zt;K(new st(.009,.011,.038,20),W(b.color||"#862926"),z,0,.015,0),K(new st(.003,.003,.013,16),I.metal,z,0,-.009,0);const F=K(new Ci(.023,12,8),new Xn({transparent:!0,opacity:0,depthWrite:!1}),z,0,.013,0);z.position.copy(R);const V={from:b.from||b.terminal,cable:N,plug:z,originalPair:((gt=b.wirePair)==null?void 0:gt.slice())||null},re=`loose:${Math.random().toString(36).slice(2)}`;V.resource=V.originalPair?Ls(...V.originalPair,V.from):re,Ne.add(V),!V.originalPair&&((vt=pe.get(V.from))!=null&&vt.common)&&Me.prefer(V.from,V.resource,b.socket,ve(V.from));const ie=b.wirePair&&zi.get([...b.wirePair].sort().join("|")),be=Oe(V.from,V.resource);V.reference=ie?Bi(ie.a===V.from?ie.points:[...ie.points].reverse()):Dr([be||R,R]),V.points=oc(V.reference,be||R,R),N.update(V.points);const Fe={object:F,kind:"plug",id:re,from:V.from,label:"Grab loose plug",lead:V,color:b.color};return F.userData.direct=Fe,V.target=Fe,m.add(z,N.group),V}function xs(b){b&&(Ne.delete(b),b.cable.dispose(),At(b.plug),b.plug.removeFromParent())}const kt=Px({getModel:()=>{var b;return{...Z,parameters:{...Z.parameters,meterMode:ze,timeCursor:(b=Z.parameters)==null?void 0:b.time}}},getTerminals:we,onProbe:u,onBeforeConnect:(b,R,N)=>{var re,ie;const z=N.lead;if(!z)return;z.plug.position.copy(N.position),Rt();const F=[b,R.id],V=[...F].sort().join("|");Z.wires.some(be=>be.includes(b)&&be.includes(R.id))||((re=pe.get(b))!=null&&re.common&&Me.transfer(b,z.resource,Ls(...F,b),ve(b)),z.originalPair=F,z.resource=Ls(...F,b),(ie=pe.get(R.id))!=null&&ie.common&&Me.prefer(R.id,Ls(...F,R.id),R.socket,ve(R.id)),ar.set(V,{from:b,points:Bi(z.points)}),N.pendingPair=V)},onConnect:h,onDisconnect:d,onGraphCursor:g,onChange:(b,R)=>{var N;b==="meterMode"?(ze=R,je.update({...Z,meterMode:ze}),l(b,R)):b==="timeCursor"?i(`scrub:${Math.min(R,((N=Z.parameters)==null?void 0:N.acquiredTime)||0)*1e3}`):l(b,R)},onAction:b=>{var R;if(String(b).startsWith("recorder-panel:")){const N=Number(String(b).split(":")[1]);Number.isInteger(N)&&N>=0&&((R=Be.selectPanel)==null||R.call(Be,N))}else i(b)},onHold:(b,R,N)=>{var F,V,re;const z=R.target;if(b==="start")if(["probe","plug","terminal"].includes(z.kind)&&v("begin",R),z.kind==="probe"){const ie=ne.get(z.channel);ie&&(delete ie.restPose,ie.loose=!0,R.probe=ie,R.position=ie.unit.group.position.clone())}else(z.kind==="terminal"||z.kind==="plug")&&(R.lead=z.lead||Bd(z,R.position||Oe(z.terminal)),delete R.lead.restPosition,R.lead.reference=Bi(R.lead.points));if(b==="move"&&(R.probe&&R.position&&(R.probe.unit.group.position.copy(R.position),R.quaternion?R.probe.unit.group.quaternion.copy(R.quaternion):R.probe.unit.group.rotation.set(-.25,0,.18)),R.lead&&R.position&&R.lead.plug.position.copy(R.position),_.shadowMap.needsUpdate=!0),b==="end"){if(R.probe){const ie=R.probe;ie.connected=N.terminal;const be=`probe:${ie.channel}`;if((F=pe.get(N.terminal))!=null&&F.common&&R.position){const gt=Wo(R.position,we().filter(vt=>vt.id===N.terminal),.055);gt&&Me.prefer(N.terminal,be,gt.socket,ve(N.terminal))}const Fe=Oe(N.terminal,be);Fe?(ie.unit.group.position.copy(Fe),ie.unit.group.rotation.set(-.24,0,.25),ie.loose=!1):(ie.restPose={position:new D(dn.clamp(((V=R.position)==null?void 0:V.x)??ie.home.x,-.88,.88),.87,dn.clamp(((re=R.position)==null?void 0:re.z)??ie.home.z,-1.2,-.34)),quaternion:new hn().setFromEuler(new kn(-Math.PI/2,0,0)),time:performance.now()},ie.loose=!0)}R.pendingPair&&ar.delete(R.pendingPair),R.lead&&(N.kind==="connected"||N.kind==="cancelled"||z.kind==="terminal"?xs(R.lead):(R.lead.restPosition=new D(dn.clamp(R.lead.plug.position.x,-.58,.58),.87,dn.clamp(R.lead.plug.position.z,-1.1,-.41)),R.lead.restTime=performance.now())),["probe","plug","terminal"].includes(z.kind)&&v("end",R),_.shadowMap.needsUpdate=!0}}});function Ol(b){var re,ie,be,Fe,gt,vt;b.module&&b.module!==Z.module&&(De="status"),Z={...Z,...b};const R=JSON.stringify(Z.components.map(({value:nt,...Le})=>Le));let N=!1;if(R!==Re){Re=R,kt.cancelAll();for(const nt of[...Ne])xs(nt);ui=null,or++,vs++,_s=new Map,zi=new Map,ar.clear();for(const nt of ne.values())delete nt.restPose;no(Z.components),N=!0,_.shadowMap.needsUpdate=!0}for(const nt of Z.components){const Le=Qe.get(nt.id);Le&&Le.value!==nt.value&&(Le.draw(nt.label,nt.value),Le.value=nt.value,(re=Le.updateHardware)==null||re.call(Le,nt.value),Le.hit&&(Le.hit.userData.label=`${Jn(nt)} · ${nt.value}`),_.shadowMap.needsUpdate=!0)}const z=JSON.stringify(Z.wires);(N||z!==Ke)&&(Ke=z,X(Z.wires),_.shadowMap.needsUpdate=!0),pn(),Ct(N);const F=JSON.stringify([Z.module,Z.metrics,(ie=Z.measurement)==null?void 0:ie.ok,(be=Z.measurement)==null?void 0:be.error,(Fe=Z.measurement)==null?void 0:Fe.clipped,(gt=Z.parameters)==null?void 0:gt.time,(vt=Z.parameters)==null?void 0:vt.playing]);F!==Xe&&(Xe=F,yi());const V=JSON.stringify(Z.diagnostic);if(V!==Ae&&(Ae=V,$t()),Z.schematicDataURL!==void 0&&Z.schematicDataURL!==ge){ge=Z.schematicDataURL,ue=null;const nt=++We;if(/^data:image\/(svg\+xml|png|jpeg|webp)[;,]/.test(ge||"")){const Le=new Image;Le.onload=()=>{!Je&&nt===We&&(ue=Le,$t())},Le.onerror=()=>{!Je&&nt===We&&$t()},Le.src=ge}$t()}}const cr=new Cm,Fl=new xe;let vn=null;function kl(b){for(let R=b;R;R=R.parent)if(!R.visible)return!1;return!0}function ro(b){for(let R=b;R;R=R.parent){const N=R.userData.direct||R.userData.equipmentTarget;if(N)return N}return null}function zl(){const b=[...fe,...ee,He].filter(Boolean).map(z=>z.group),R=[...ne.values()].map(z=>z.unit.group),N=[...Ne].map(z=>z.plug);return[...tt,...U,...T,...j,...b,...R,...N,...mn.visible?[zn.object,Pt.object]:[]]}function so(){const b=cr.intersectObjects(zl(),!0).filter(z=>kl(z.object)&&(ro(z.object)||z.object.userData.kind));for(const z of b)z.direct=ro(z.object);const R=b[0];return b.find(z=>{var F;return["probe","plug","dial","button","screen","switch"].includes((F=z.direct)==null?void 0:F.kind)&&z.distance<((R==null?void 0:R.distance)??1/0)+.065})||R}function lr(b,R=null){var V;const N=(b==null?void 0:b.direct)||(b==null?void 0:b.object.userData),z=N&&["terminal","part","wire","probe","plug","dial","button","switch","screen"].includes(N.kind)?{kind:N.kind,id:N.id??String(N.index),label:N.label||N.id,socket:N.socket}:null,F=JSON.stringify([z,Z.tool,Z.selectedTerminal]);Ye=z,Ot=((V=b==null?void 0:b.point)==null?void 0:V.clone())||(R==null?void 0:R.clone())||null,F!==G&&(G=F,s(_.xr.isPresenting?null:z)),pn()}function ua(b){const R=_.domElement.getBoundingClientRect();Fl.set((b.clientX-R.left)/R.width*2-1,-(b.clientY-R.top)/R.height*2+1),cr.setFromCamera(Fl,p)}function ha(b,R){if(!(b!=null&&b.uv))return{};const N=b.uv.x,z=1-b.uv.y,F=R.bounds||[];let V=F.find(re=>z>=re.top&&z<=re.top+re.height);return V||(V=F[0]||{left:0,width:1,panel:0}),{fraction:dn.clamp((N-V.left)/V.width,0,1),panelIndex:V.panel||0}}function da(){return cr.ray.intersectPlane(xt,new D)}function Bl(b,R,N={}){var V,re,ie,be;if(!R||R.object.userData.kind==="panel"&&R.object.userData.activate(R)!==!1)return!1;const z=R.direct||ro(R.object);if(!z||z.kind==="probe"&&!((V=ne.get(z.channel))!=null&&V.unit.group.visible))return!1;z.kind==="dial"&&(z.resource=`parameter:${z.parameter}`),z.kind==="plug"&&z.wirePair&&(z.wireIndex=Z.wires.findIndex(Fe=>Fe.includes(z.wirePair[0])&&Fe.includes(z.wirePair[1]))),z.parameter==="timeCursor"&&(z.max=((re=Z.parameters)==null?void 0:re.acquiredTime)||0,z.min=0,z.step=Math.max(z.max/100,1e-6));const F=z.kind==="probe"?(ie=ne.get(z.channel))==null?void 0:ie.unit.group.position:z.kind==="terminal"?(be=we().find(Fe=>Fe.id===z.terminal&&Fe.socket===(z.socket??0)))==null?void 0:be.position:R.point;return kt.begin(b,z,{position:F,...ha(R,z),...N})}function Vl(b){if(b.button!==0||_.xr.isPresenting)return;kt.release("mouse"),ua(b);const R=so();vn={x:b.clientX,y:b.clientY,lastX:b.clientX,lastY:b.clientY,time:performance.now(),hit:R},(R!=null&&R.direct||(R==null?void 0:R.object.userData.kind)==="panel")&&(x.enabled=!1,_.domElement.setPointerCapture(b.pointerId),Bl("mouse",R),b.stopImmediatePropagation(),b.preventDefault())}function Hl(b){var z,F;if(_.xr.isPresenting)return;ua(b);const R=kt.hold("mouse"),N=so();if(R){const V={position:da()};if(R.target.kind==="dial"&&(V.turn=(b.clientX-vn.lastX-(b.clientY-vn.lastY))*.024),R.target.kind==="screen"){const be=cr.intersectObject(R.target.object,!0)[0];Object.assign(V,ha(be,R.target))}kt.move("mouse",V),vn&&(vn.lastX=b.clientX,vn.lastY=b.clientY);const re=["probe","terminal","plug"].includes(R.target.kind)?Wo(R.position,we(),.055):null,ie=re?{object:re.hit,direct:re.hit.userData.direct,point:re.position}:N;lr(ie,V.position),Rt()}else vn||(_.domElement.style.cursor=((z=N==null?void 0:N.direct)==null?void 0:z.kind)==="dial"?"ns-resize":((F=N==null?void 0:N.direct)==null?void 0:F.kind)==="screen"?"crosshair":"grab",lr(N,da()))}function Gl(b){var R;if(!vn){kt.release("mouse");return}ua(b),kt.hold("mouse")?kt.end("mouse",{position:da()}):Math.hypot(b.clientX-vn.x,b.clientY-vn.y)<5&&((R=vn.hit)==null?void 0:R.object.userData.kind)==="part"&&r(vn.hit.object.userData.id),vn=null,kt.release("mouse"),x.enabled=!0,_.domElement.hasPointerCapture(b.pointerId)&&_.domElement.releasePointerCapture(b.pointerId),Rt()}function Wl(){kt.hold("mouse")&&kt.block("mouse"),vn=null,x.enabled=!_.xr.isPresenting,lr(null)}const $l=()=>{vn||lr(null)};_.domElement.addEventListener("pointerdown",Vl,!0),_.domElement.addEventListener("pointermove",Hl),_.domElement.addEventListener("pointerup",Gl),_.domElement.addEventListener("pointercancel",Wl),_.domElement.addEventListener("pointerleave",$l);function ql(){mn.updateWorldMatrix(!0,!0);const b=new er().setFromObject(mn),R=b.getCenter(new D),N=[];for(const V of[b.min.x,b.max.x])for(const re of[b.min.y,b.max.y])for(const ie of[b.min.z,b.max.z])N.push(new D(V,re,ie));const z=new D(0,.12,1).normalize();let F=4;for(let V=0;V<9;V++){p.position.copy(R).addScaledVector(z,F),p.lookAt(R),p.updateMatrixWorld();const re=N.map(nt=>nt.clone().project(p)),ie=Math.min(...re.map(nt=>nt.x)),be=Math.max(...re.map(nt=>nt.x)),Fe=Math.min(...re.map(nt=>nt.y)),gt=Math.max(...re.map(nt=>nt.y)),vt=F*Math.tan(dn.degToRad(p.fov/2));R.addScaledVector(new D().setFromMatrixColumn(p.matrixWorld,0),(ie+be)*.5*vt*p.aspect),R.addScaledVector(new D().setFromMatrixColumn(p.matrixWorld,1),(Fe+gt)*.5*vt),F=Math.max(x.minDistance,F*Math.max(.75,Math.min(1.35,Math.max((be-ie)/1.78,(gt-Fe)/1.78))))}x.target.copy(R),p.position.copy(R).addScaledVector(z,F),p.lookAt(R),x.update()}function fa(b){if(_.xr.isPresenting||Je)return;b=!!b;const R=b!==_e;b&&!_e&&(Se={position:p.position.clone(),quaternion:p.quaternion.clone(),target:x.target.clone()}),_e=b,mn.visible=b,_.shadowMap.needsUpdate=!0,b?(xa(1.6),ql()):Se&&(p.position.copy(Se.position),p.quaternion.copy(Se.quaternion),x.target.copy(Se.target),x.update(),Se=null),lr(null),$t(),R&&o(b)}const Ur=[],Xl=new Vt,Yl=Ix({obstacles:[{minX:-1.07,maxX:1.07,minZ:-1.7,maxZ:-.27},{minX:.55,maxX:1.22,minZ:-.46,maxZ:.25},{minX:-1.22,maxX:-.55,minZ:-.46,maxZ:.25}],bounds:{minX:-3.1,maxX:3.1,minZ:-4.6,maxZ:2.4}});let Qn=!1,pa=0,An=null;function bi(){kt.cancelAll(),Yl.reset(),vn=null;for(const b of Ur)b.armed=!1,b.lastQuaternion=null,b.stickPressed=!1;x.enabled=!_.xr.isPresenting}function ys(){Qn=document.visibilityState==="hidden"||!!(An!=null&&An.visibilityState)&&An.visibilityState!=="visible",bi()}const jl=()=>{_.xr.isPresenting||(Qn=!0,bi())},Zl=()=>{_.xr.isPresenting||(Qn=!1,bi())};window.addEventListener("blur",jl),window.addEventListener("focus",Zl),document.addEventListener("visibilitychange",ys);function ma(b){b.controller.updateWorldMatrix(!0,!1),Xl.extractRotation(b.controller.matrixWorld),cr.ray.origin.setFromMatrixPosition(b.controller.matrixWorld),cr.ray.direction.set(0,0,-1).applyMatrix4(Xl)}function ga(b,R){const N=b.grip.getWorldQuaternion(new hn),z=b.grip.getWorldPosition(new D),F=new D(0,0,-1).applyQuaternion(N),V=N.clone().multiply(new hn().setFromAxisAngle(new D(1,0,0),Math.PI/2)),re=R!=null&&R.probe?Cx(z,N,R.probePickupQuaternion,R.probe.unit.length):{position:z.addScaledVector(F,.08),quaternion:V};if((R==null?void 0:R.target.kind)==="dial"){const ie=new D(...R.target.axis==="y"?[0,1,0]:R.target.axis==="x"?[1,0,0]:[0,0,1]).applyQuaternion(R.target.object.getWorldQuaternion(new hn));re.turn=b.lastQuaternion?-Rx(N.clone().multiply(b.lastQuaternion.clone().invert()),ie):0}return(R==null?void 0:R.target.kind)==="screen"&&(ma(b),Object.assign(re,ha(cr.intersectObject(R.target.object,!0)[0],R.target))),b.lastQuaternion=N,re}function Kl(b,R){if(!b.armed||Qn||!_.xr.isPresenting||kt.hold(b.id))return;ma(b);let N=so();if(R==="grip"){const z=b.grip.getWorldPosition(new D),F=zl().flatMap(V=>{const re=[];return V.traverse(ie=>{const be=ro(ie);be&&["probe","plug","dial","terminal","button","switch"].includes(be.kind)&&kl(ie)&&re.push({node:ie,target:be,point:ie.getWorldPosition(new D)})}),re}).sort((V,re)=>V.point.distanceTo(z)-re.point.distanceTo(z));if(!F.length||F[0].point.distanceTo(z)>.12)return;N={object:F[0].node,direct:F[0].target,point:F[0].point}}if(b.button=R,b.lastQuaternion=b.grip.getWorldQuaternion(new hn),Bl(b.id,N)){const z=kt.hold(b.id);z!=null&&z.probe&&(z.probePickupQuaternion=b.lastQuaternion.clone()),z&&["probe","plug","terminal"].includes(z.target.kind)&&kt.move(b.id,ga(b,z))}}function Jl(b,R){if(b.button===R){const N=kt.hold(b.id);N&&kt.end(b.id,ga(b,N)),b.button=null,b.lastQuaternion=null}kt.release(b.id)}for(let b=0;b<2;b++){const R=_.xr.getController(b),N=_.xr.getControllerGrip(b),z=new Zc(new an().setFromPoints([new D,new D(0,0,-1)]),new Yo({color:"#bbc8c8",transparent:!0,opacity:.55}));R.add(z),z.scale.z=2;const F=new En(new Ci(.007,12,8),new Xn({color:"#d7c98b",depthTest:!1}));F.visible=!1,m.add(F);const V={id:`controller:${b}`,controller:R,grip:N,ray:z,cursor:F,source:null,armed:!1,button:null,stickPressed:!1,lastQuaternion:null};R.addEventListener("connected",ie=>{V.source=ie.data,V.armed=!1,R.visible=!0}),R.addEventListener("disconnected",()=>{kt.block(V.id),V.source=null,V.armed=!1,R.visible=!1,F.visible=!1}),R.addEventListener("selectstart",()=>Kl(V,"trigger")),R.addEventListener("selectend",()=>Jl(V,"trigger")),R.addEventListener("squeezestart",()=>Kl(V,"grip")),R.addEventListener("squeezeend",()=>Jl(V,"grip"));const re=K(Ie(.037,.075,.045,.013),I.navy,N,0,-.017,.015);re.rotation.x=-.35,K(new Ci(.022,12,8),I.teal,N,0,.019,-.012),y.add(R,N),Ur.push(V)}let va=null,bs=!1,_a=!0;function xa(b){const R=new D(0,b,0);Tn.position.set(1.24,Math.max(1.61,b-.01),-1.02),wn.position.set(0,Math.max(1.58,b+.04),-1.45),Tn.lookAt(R),wn.lookAt(R)}function ya(){return _.xr.isPresenting?(bi(),bs=!0,!0):!1}const oo=Wx({xrManager:_.xr,navigatorXR:()=>navigator.xr,isSecureContext:()=>window.isSecureContext,visibilityTarget:document,onStatus:a,onBeforeSession:({floorReference:b})=>{bi(),va=$x(p,x),_a=b,x.enabled=!1,y.position.set(0,b?0:1.6,0),y.quaternion.identity(),p.position.set(0,0,0),p.quaternion.identity()},onSessionStarted:({session:b})=>{An=b,Qn=!1,An==null||An.addEventListener("visibilitychange",ys),bi(),et.visible=!1,Ue.visible=!0,mn.visible=!0,s(null),bs=!0,_.shadowMap.needsUpdate=!0,$t()},onSessionEnded:()=>{bi(),An==null||An.removeEventListener("visibilitychange",ys),An=null,Qn=!1,bs=!1,et.visible=!1,Ue.visible=!0,mn.visible=_e,qx(p,x,y,va),va=null;for(const b of Ur)b.cursor.visible=!1,b.stickPressed=!1;lr(null),xa(1.6),_.shadowMap.needsUpdate=!0,ba(),$t()}});function Vd(){return Je?Promise.resolve(!1):(_e&&fa(!1),oo.toggle())}function Hd(){return oo.refreshSupport()}function ba(){if(_.xr.isPresenting||Je)return;const b=Math.max(1,n.clientWidth),R=Math.max(1,n.clientHeight);p.aspect=b/R,p.updateProjectionMatrix(),_.setSize(b,R,!1),_e?ql():(!O||Math.abs(p.aspect/O-1)>.12)&&H()}const Ql=new ResizeObserver(ba);Ql.observe(n),ba(),Ol(Z),_.setAnimationLoop(b=>{var R,N,z,F,V,re,ie,be;if(!Je&&(c(b),!Je)){if(_.xr.isPresenting){if(bs){const $e=_.xr.getFrame(),pt=_.xr.getReferenceSpace(),qt=$e&&pt?$e.getViewerPose(pt):null;qt&&Xx(y,qt,{floorReference:_a,eyeHeight:1.6})&&(xa(_a?qt.transform.position.y:1.6),bs=!1)}const Fe=_.xr.getCamera(),gt=Fe.getWorldPosition(new D),vt=Fe.getWorldQuaternion(new hn),nt=(N=(R=Ur.find($e=>{var pt;return((pt=$e.source)==null?void 0:pt.handedness)==="left"}))==null?void 0:R.source)==null?void 0:N.gamepad,Le=(F=(z=Ur.find($e=>{var pt;return((pt=$e.source)==null?void 0:pt.handedness)==="right"}))==null?void 0:z.source)==null?void 0:F.gamepad,Ce=$e=>{var pt,qt,zt;return((pt=$e==null?void 0:$e.axes)==null?void 0:pt.length)>=4?[$e.axes[2],$e.axes[3]]:[((qt=$e==null?void 0:$e.axes)==null?void 0:qt[0])||0,((zt=$e==null?void 0:$e.axes)==null?void 0:zt[1])||0]};Yl.update({rig:y,headPosition:gt,headQuaternion:vt,left:Ce(nt),right:Ce(Le)[0],dt:pa?(b-pa)/1e3:0,enabled:!Qn});let lt=null,ut=null;for(const $e of Ur){const pt=(V=$e.source)==null?void 0:V.gamepad;!Qn&&!$e.armed&&pt&&!((re=pt.buttons[0])!=null&&re.pressed)&&!((ie=pt.buttons[1])!=null&&ie.pressed)&&($e.armed=!0,kt.release($e.id));const qt=$e.armed&&!!((be=pt==null?void 0:pt.buttons[3])!=null&&be.pressed);qt&&!$e.stickPressed&&ya(),$e.stickPressed=qt,ma($e);const zt=!Qn&&$e.controller.visible?so():null;$e.ray.visible=!Qn,$e.ray.scale.z=zt?zt.distance:2;const nn=kt.hold($e.id);nn&&!Qn&&kt.move($e.id,ga($e,nn));const _n=nn&&["probe","terminal","plug"].includes(nn.target.kind)?Wo(nn.position,we(),.055):null;$e.cursor.visible=!!zt||!!_n,_n?($e.cursor.position.copy(_n.position),$e.cursor.material.color.set("#88c39e")):zt&&($e.cursor.position.copy(zt.point),$e.cursor.material.color.set("#d7c98b")),_n?(lt={object:_n.hit,direct:_n.hit.userData.direct,point:_n.position},ut=_n.position):zt&&!lt&&(lt=zt,ut=zt.point)}lr(lt,ut)}else x.update();pa=b,Rt(),_.render(m,p)}});function Gd(){bi(),Je=!0,An==null||An.removeEventListener("visibilitychange",ys),window.removeEventListener("blur",jl),window.removeEventListener("focus",Zl),document.removeEventListener("visibilitychange",ys),oo.dispose(),_.setAnimationLoop(null),Ql.disconnect(),x.dispose(),_.domElement.removeEventListener("pointerdown",Vl,!0),_.domElement.removeEventListener("pointermove",Hl),_.domElement.removeEventListener("pointerup",Gl),_.domElement.removeEventListener("pointercancel",Wl),_.domElement.removeEventListener("pointerleave",$l);for(const b of ne.values())b.pick.geometry.dispose(),b.pick.material.dispose(),b.unit.dispose(),b.cable.dispose();for(const b of Ne)xs(b);for(const b of[...fe,...ee,He].filter(Boolean))b.dispose();At(m);for(const b of le)b.dispose();_.dispose(),_.domElement.remove()}function Wd(){var b;eu(),ze="vdc",Me.clear(),Re="",Ke="",Ae="",De="status",(b=Be.selectPanel)==null||b.call(Be,0);for(const R of ne.values())R.loose=!1,R.connected=null,delete R.restPose}function eu(){bi();for(const b of[...Ne])xs(b)}return{cancelInteractions:eu,resetExperiment:Wd,update:Ol,enterVR:Vd,refreshVRSupport:Hd,recenterVR:ya,resetView:H,setPanelPreview:fa,dispose:Gd,renderer:_}}const Qo="#182630",Yi=n=>String(n).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),In=n=>Number.isFinite(Number(n))?Number(Number(n).toPrecision(6)).toLocaleString("en-US",{maximumFractionDigits:6}):"—",Ah=n=>Math.abs(n)>=1e3?`${In(n/1e3)} kΩ`:`${In(n)} Ω`,ey=n=>n>=.001?`${In(n*1e3)} mF`:n>=1e-6?`${In(n*1e6)} μF`:`${In(n*1e9)} nF`,ty=n=>n>=1?`${In(n)} H`:`${In(n*1e3)} mH`;function ny(){const n=[],e=(h,d="")=>n.push(`<path d="${h.map(([f,g],v)=>`${v?"L":"M"} ${f} ${g}`).join(" ")}" ${d}/>`),t=(h,d,f,g)=>e([[h,d],[f,g]]),i=(h,d,f,g="middle",v=18)=>n.push(`<text x="${h}" y="${d}" text-anchor="${g}" font-size="${v}">${Yi(f)}</text>`),r=(h,d)=>n.push(`<circle cx="${h}" cy="${d}" r="4" fill="${Qo}" stroke="none"/>`),s=(h,d)=>n.push(`<circle cx="${h}" cy="${d}" r="4" fill="white"/>`),o=(h,d,f)=>n.push(`<circle data-pin="${Yi(h)}" cx="${d}" cy="${f}" r="7" fill="transparent" stroke="none"><title>${Yi(h)}</title></circle>`);return{elements:n,path:e,line:t,text:i,dot:r,contact:s,pins:h=>Object.entries(h).forEach(([d,[f,g]])=>o(d,f,g)),pin:o,ground:(h,d)=>{n.push('<g data-symbol="ground">'),t(h,d,h,d+12),t(h-15,d+12,h+15,d+12),t(h-10,d+18,h+10,d+18),t(h-4,d+24,h+4,d+24),n.push("</g>")},resistor:(h,d,f,g,v,m,p)=>{n.push(`<g data-component="${Yi(h)}" data-symbol="resistor">`);const _=d===g,x=_?(f+v)/2:(d+g)/2,y=_?[[d,f],[d,x-35]]:[[d,f],[x-35,f]];for(let M=0;M<7;M+=1){const w=x-30+M*10,A=M%2?-8:8;y.push(_?[d+A,w]:[w,f+A])}y.push(_?[d,x+35]:[x+35,f]),y.push([g,v]),e(y),_?(i(d+24,x-8,m,"start"),i(d+24,x+18,Ah(p),"start",16)):(i(x,f-24,m),i(x,f+30,Ah(p),"middle",16)),n.push("</g>")},source:({id:h,x:d,y:f,top:g,bottom:v,name:m,value:p,polarity:_=1,kind:x="voltage",state:y="active",labelSide:M=-1,frequency:w})=>{n.push(`<g data-component="${Yi(h)}" data-symbol="${Yi(x)}-source" data-source-state="${Yi(y)}" data-polarity="${_}">`);const A=d+M*56;y==="short"?(t(d,g,d,v),i(A,f-7,m),i(A,f+18,"0 V","middle",16)):y==="open"?(t(d,g,d,f-15),t(d,f+15,d,v),s(d,f-15),s(d,f+15),i(A,f-7,m),i(A,f+18,"open","middle",16)):(t(d,g,d,f-28),t(d,f+28,d,v),n.push(`<circle cx="${d}" cy="${f}" r="28" fill="white"/>`),x==="current"?(t(d,f+15,d,f-14),n.push(`<path d="M ${d} ${f-16} L ${d-5} ${f-7} L ${d+5} ${f-7} Z" fill="${Qo}" stroke="none"/>`)):x==="sine"?n.push(`<path d="M ${d-16} ${f} C ${d-11} ${f-16}, ${d-5} ${f-16}, ${d} ${f} C ${d+5} ${f+16}, ${d+11} ${f+16}, ${d+16} ${f}"/>`):(t(d-6,f-10,d+6,f-10),t(d-6,f+10,d+6,f+10),t(d,f+(_>0?-16:4),d,f+(_>0?-4:16))),i(A,f-8,m),i(A,f+18,p,"middle",16),w!==void 0&&i(A,f+42,`${In(w)} Hz`,"middle",14)),n.push("</g>")}}}function iy(n,e){const{line:t,path:i,source:r,resistor:s,ground:o,dot:a,text:c,pins:l}=n,u=120,h=330;if(e.representation==="original")r({id:"s",x:110,y:225,top:u,bottom:h,name:"Vs",value:"12 V"}),t(110,u,210,u),s("r1",210,u,370,u,"R₁",1e3),t(370,u,650,u),s("r2",440,u,440,h,"R₂",1e3),s("load",650,u,650,h,"RL",e.load),t(110,h,650,h),a(440,u),a(440,h),a(300,h),o(300,h),c(448,96,"A","start"),l({"s+":[110,u],"s-":[110,h],r1a:[210,u],r1b:[370,u],r2a:[440,u],r2b:[440,h],loada:[650,u],loadb:[650,h],gnd:[300,h]});else if(e.representation==="thevenin")r({id:"s",x:170,y:225,top:u,bottom:h,name:"VTh",value:`${In(e.equivalentVoltage)} V`}),t(170,u,280,u),s("req",280,u,480,u,"RTh",e.equivalentResistance),t(480,u,620,u),s("load",620,u,620,h,"RL",e.load),t(170,h,620,h),o(395,h),a(395,h),c(630,100,"A","start"),l({"s+":[170,u],"s-":[170,h],reqa:[280,u],reqb:[480,u],loada:[620,u],loadb:[620,h],gnd:[395,h]});else if(e.representation==="norton")r({id:"s",x:140,y:225,top:u,bottom:h,name:"IN",value:`${In(e.nortonCurrent)} mA`,kind:"current"}),t(140,u,650,u),s("req",395,u,395,h,"RN",e.equivalentResistance),s("load",650,u,650,h,"RL",e.load),t(140,h,650,h),a(395,u),a(395,h),a(270,h),o(270,h),c(405,96,"A","start"),l({"s+":[140,u],"s-":[140,h],reqa:[395,u],reqb:[395,h],loada:[650,u],loadb:[650,h],gnd:[270,h]});else throw new RangeError("Unknown equivalent circuit representation.")}function ry(n,e){const{line:t,source:i,resistor:r,ground:s,dot:o,text:a,pins:c}=n,l=u=>u?"active":e.replacement==="open"?"open":"short";i({id:"a",x:120,y:225,top:120,bottom:330,name:"V₁",value:`${In(e.v1)} V`,state:l(e.sourceMode!=="b")}),i({id:"b",x:660,y:225,top:120,bottom:330,name:"V₂",value:`${In(e.v2)} V`,polarity:-1,labelSide:1,state:l(e.sourceMode!=="a")}),t(120,120,200,120),r("r1",200,120,320,120,"R₁",1e3),t(320,120,460,120),r("r2",460,120,580,120,"R₂",1e3),t(580,120,660,120),r("load",390,120,390,330,"R₃",1e3),t(120,330,660,330),o(390,120),o(390,330),o(250,330),s(250,330),a(400,96,"A","start"),c({"a+":[120,120],"a-":[120,330],"b+":[660,120],"b-":[660,330],r1a:[200,120],r1b:[320,120],r2a:[460,120],r2b:[580,120],loada:[390,120],loadb:[390,330],gnd:[250,330]})}function sy(n,e){const{elements:t,line:i,path:r,source:s,resistor:o,ground:a,dot:c,contact:l,text:u,pins:h}=n,d=e.configuration==="inverting",f=d?180:230;s({id:"signal",x:90,y:285,top:f,bottom:345,name:"Vin",value:`${In(e.amplitude)} Vpk`,kind:"sine",frequency:e.frequency}),d?(i(90,180,150,180),o("rin",150,180,300,180,"Rin",e.rin),i(300,180,400,180),r([[400,230],[370,230],[370,345],[90,345]]),a(230,345),c(230,345)):(i(90,230,400,230),o("rin",170,180,300,180,"Rin",e.rin),i(300,180,400,180),a(170,180),a(90,345)),r([[340,180],[340,80],[400,80]]),o("rf",400,80,550,80,"Rf",e.rf),r([[550,80],[620,80],[620,205]]),i(550,205,660,205),c(340,180),c(620,205),t.push('<g data-component="op" data-symbol="op-amp">'),t.push('<path d="M 400 140 L 400 270 L 550 205 Z" fill="white"/>'),i(410,180,420,180),i(410,230,420,230),i(415,225,415,235),u(447,212,"U₁","middle",16),i(480,147,480,175),i(480,235,480,285),u(480,130,`+${In(e.rail)} V`,"middle",16),u(480,309,`−${In(e.rail)} V`,"middle",16),t.push("</g>"),l(660,205),u(671,210,"Vout","start");const g=d?[230,345]:[90,345];h({"signal+":[90,f],"signal-":[90,345],rina:[d?150:170,180],rinb:[300,180],rfa:[400,80],rfb:[550,80],"op-":[400,180],"op+":[400,230],out:[550,205],vp:[480,147],vn:[480,285],"plus+":[480,147],"minus-":[480,285],"plus-":g,"minus+":g,gnd:g})}function oy(n,e){const{elements:t,line:i,path:r,source:s,resistor:o,ground:a,dot:c,contact:l,text:u,pins:h}=n;s({id:"s",x:100,y:235,top:120,bottom:340,name:"Vs",value:"5 V"}),i(100,120,235,120),r([[235,200],[190,200],[190,340]]),i(300,160,365,160),o("r",365,160,535,160,"R",e.resistance),i(535,160,650,160),i(100,340,650,340),a(390,340),c(390,340),c(190,340),t.push(`<g data-component="sw" data-symbol="spdt" data-switch-position="${e.charging?"source":"return"}">`),i(300,160,235,e.charging?120:200),l(235,120),l(235,200),l(300,160),u(280,90,"S₁"),u(222,103,"5 V","end",15),u(222,224,"0 V","end",15),t.push("</g>"),e.kind==="RC"?(t.push('<g data-component="storage" data-symbol="capacitor">'),i(650,160,650,242),i(626,242,674,242),i(626,258,674,258),i(650,258,650,340),u(692,242,"C","start"),u(692,269,ey(e.capacitance),"start",16),t.push("</g>")):(t.push('<g data-component="storage" data-symbol="inductor">'),i(650,160,650,218),t.push('<path d="M 650 218 c -18 0 -18 16 0 16 c -18 0 -18 16 0 16 c -18 0 -18 16 0 16 c -18 0 -18 16 0 16"/>'),i(650,282,650,340),u(682,242,"L","start"),u(682,269,ty(e.inductance),"start",16),t.push("</g>")),u(660,143,"A","start"),h({"s+":[100,120],"s-":[100,340],supply:[235,120],return:[235,200],common:[300,160],ra:[365,160],rb:[535,160],storagea:[650,160],storageb:[650,340],gnd:[390,340]})}function Ud(n,e={},{voltages:t}={}){if(!fn[n])throw new RangeError(`Unknown schematic module: ${n}`);const i={...fn[n].defaults,...e},r=ny();n==="thevenin"?iy(r,i):n==="superposition"?ry(r,i):n==="opamp"?sy(r,i):oy(r,i);const s={thevenin:`${i.representation==="original"?"Original voltage-divider":i.representation==="thevenin"?"Thévenin equivalent":"Norton equivalent"} circuit`,superposition:"Two-source superposition circuit; source two has its positive terminal grounded",opamp:`${i.configuration==="inverting"?"Inverting":"Non-inverting"} amplifier circuit with separate positive and negative supply pins`,transient:`Series ${i.kind} circuit with an SPDT source and closed return path`},o=Yi(s[n]);return`<svg xmlns="http://www.w3.org/2000/svg" class="ee-schematic" viewBox="0 0 780 430" width="100%" style="display:block;height:auto;aspect-ratio:780 / 430" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${o}"><title>${o}</title><rect width="780" height="430" fill="white"/><g fill="none" stroke="${Qo}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" font-family="Arial, Helvetica, sans-serif"><style>.ee-schematic text{fill:${Qo};stroke:none;font-weight:400}</style>${r.elements.join("")}</g></svg>`}const yt=(n,e,t,i)=>({level:n,title:e,message:t,...i?{detail:i}:{}});function ay(n){return{...n,wireSets:{...n.wireSets},probeSets:{...n.probeSets},scopeSets:{...n.scopeSets}}}function cy(n,e,t){const i=it(n),s=(n.module==="opamp"?[["plus+","plus-",i.rail,"+ supply"],["minus+","minus-",i.rail,"− supply"],["signal+","signal-",i.amplitude,"Signal source"]]:n.module==="transient"?[["s+","s-",5,"DC source"]]:e.electrical.filter(o=>o.type==="V").map(o=>[o.a,o.b,o.value,o.id==="a"?"Source A":o.id==="b"?"Source B":"DC source"])).find(([o,a,c])=>c!==0&&t(o,a));return s?yt("error","Source shorted",`${s[3]} terminals are joined. Remove the short between + and −.`):null}function ly(n,e,t,i){const r=nr(t,e.pins),s=(l,u,h,d)=>{const f=l.filter(([v,m])=>!i(v,m));return f.length?f.flat().some(v=>Object.values(r).filter(m=>m===r[v]).length===1)?yt("error",h,d):yt("error",`${u} wiring differs`,"This model requires the selected circuit diagram. Check these leads."):null};let o;if(n.module==="opamp"){if((o=s([["plus+","vp"],["plus-","gnd"]],"+ supply","+ supply disconnected","Connect the + supply to V+ and common."))||(o=s([["minus-","vn"],["minus+","gnd"]],"− supply","− supply disconnected","Connect the − supply to V− and common."))||(o=s([["rfa","op-"],["rfb","out"]],"Feedback","Feedback disconnected","Complete the path through Rf from OUT to the − input."))||(o=s([["signal-","gnd"]],"Signal common","Signal common disconnected","Connect the signal source return to common.")))return o}else if((o=s([["s+","supply"],["s-","gnd"]],"Source","Source disconnected","Connect the DC source to the switch and common."))||(o=s([["return","gnd"]],"Return","Return path open","Connect the switch Return contact to common."))||(o=s([["common","ra"]],"Switch","Switch disconnected","Connect the switch common to the resistor."))||(o=s([["rb","storagea"],["storageb","gnd"]],"Storage","Storage loop open","Complete the path through the resistor and storage component.")))return o;const a=nr(e.wires,e.pins);return t.find(([l,u])=>a[l]!==a[u])?yt("error","Unexpected connection","A lead joins separate nodes in the selected schematic.","Check that lead before running this circuit."):yt("error","Circuit incomplete","Check the remaining leads against the selected schematic.")}function uy(n,e,t){const i=n.error||"";if(/reference/i.test(i)&&!t.some(r=>r.includes("gnd")))return yt("error","Common disconnected","Connect the circuit common to GND.");if(/inconsistent/i.test(i))return yt("error","Source conflict","Check source polarity, direct source joins and the return path.");if(/singular|floating/i.test(i)){const r=e.components.find(s=>s.type!=="ground"&&s.pins.some(o=>!t.some(a=>a.includes(o.id))));return yt("error","Floating connection","A part of the circuit has no defined voltage reference.",r?`Check the leads at ${r.label} and the common return.`:"Check common returns and redundant source connections.")}return yt("error","Circuit cannot be solved","Check the leads, source connections and component values.")}function hy(n,e,t){for(const i of["ch1","ch2"]){const{signal:r,ground:s}=n.scope[i],o=i.toUpperCase();if(!r&&!s)return yt("warning",`${o} not connected`,`Place the ${o} signal tip and connect its ground to GND.`);if(!r)return yt("warning",`${o} tip disconnected`,`Place the ${o} signal tip on a circuit contact.`);if(!s)return yt("warning",`${o} ground disconnected`,`Connect the ${o} ground clip to GND.`);if(!t(s,"gnd"))return yt("warning",`${o} ground misplaced`,`Move the ${o} ground clip to GND.`);if(!Number.isFinite(e.voltages[r]))return yt("warning",`${o} signal unavailable`,`Place the ${o} tip on a connected circuit contact.`)}return null}function dy(n){if(n.stale)return yt("warning","Held trace is old","Press Run on the scope to measure the current circuit.");if(n.timebaseTooWide)return yt("warning","Timebase too wide","Reduce ms/div or use Auto to show the signal.");if(n.trigger&&!n.trigger.found)return yt("warning","No trigger crossing","Set the trigger level within the CH1 signal and check its edge.");const e=Object.entries(n.channels||{}).filter(([,t])=>t.cropped).map(([t])=>t.toUpperCase());return e.length?yt("warning","Trace outside screen",`Increase ${e.join(" and ")} V/div or use Auto.`,"The display scale is too small; this alone does not mean clipping."):/complete period/i.test(n.error||"")?yt("info","Short time window","Increase ms/div to see a full cycle."):n.error?yt("warning","Check scope settings",n.error):n.running===!1?yt("info","Scope on Hold","The trace is frozen. Press Run to resume acquisition."):null}function fy(n,{measurement:e,acquisition:t,meterMode:i="vdc"}={}){const r=ay(n),s=Mt(r),o=it(r),a=nr(s.wires,s.circuit.pins),c=(h,d)=>a[h]!==void 0&&a[d]!==void 0&&a[h]===a[d];if(!s.wires.length)return yt("info","Wire the circuit","Connect the components with patch leads.","Check the circuit diagram.");const l=cy(r,s.circuit,c);if(l)return l;const u=e||Ni(r);if(!u.ok)return["opamp","transient"].includes(r.module)?ly(r,s.circuit,s.wires,c):uy(u,s.circuit,s.wires);if(r.module==="opamp"){const h=hy(s,u,c);if(h)return h;const d=t||vi(r),f=dy(d);if(f)return f;if(u.clipped)return yt("warning","Output clipping","The output has reached its supply limit.","Reduce input amplitude to return to a clean waveform.")}if(r.module==="superposition"&&o.replacement==="open")return yt("warning",o.sourceMode==="both"?"Comparison uses Open":"Inactive source set to Open","Open changes the network. The separate contributions may not add.","Use Short to deactivate an ideal voltage source.");if(i==="off")return yt("info","Meter is off","Turn the meter dial to V to read the voltage.");if(!u.probeReady){const{red:h,black:d}=s.probes;return!h&&!d?yt("info","Meter not connected","Place both meter tips on circuit contacts to measure voltage."):!h||!d?yt("info",`${h?"Black":"Red"} meter tip disconnected`,`Place the ${h?"black":"red"} tip on a circuit contact.`):yt("warning","Meter contact unavailable","Move the meter tips onto connected circuit contacts.")}return r.module==="transient"?o.playing?yt("ok","Transient running","Voltage, current and energy are being acquired."):o.acquiredTime>0?o.time<o.acquiredTime?yt("info","Reviewing recorded time","The cursor is inside the acquired trace. Press Run to continue."):o.time>=5*u.tau?yt("ok","Run complete","Five time constants acquired. Replay or switch to observe the next response."):yt("info","Transient paused","Press Run to continue, or move the time cursor through the acquired trace."):yt("info","Ready to run","Press Run to acquire the switching response."):yt("ok","Circuit connected",r.module==="opamp"?"The scope is acquiring the connected signals.":"Readings follow the current leads and component settings.")}const la=document.querySelector("#app"),ae=Zd();let Mr={kind:"checking",supported:!1,active:!1,message:"Checking headset…"},mt,Il=!1,Rr=null,fi=!1,sn={fraction:.5,panel:0,active:!1},Sr=null,ea="vdc";const St=n=>String(n??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),py=n=>({circuit:'<path d="M3 8h5l3-5 5 10 3-5h5M7 18h15M7 15v6M22 15v6"/>',vr:'<path d="M4 6h20l2 13h-7l-5-4-5 4H2Z"/><circle cx="9" cy="11" r="2"/><circle cx="19" cy="11" r="2"/>',book:'<path d="M4 4h8a4 4 0 0 1 4 3v17a4 4 0 0 0-4-3H4Zm12 3a4 4 0 0 1 4-3h5v17h-5a4 4 0 0 0-4 3"/>',reset:'<path d="M6 8a9 9 0 1 1-1 10M6 3v6h6"/>',arrow:'<path d="M7 21 21 7M7 7h14v14"/>',play:'<path d="m10 5 13 9-13 9Z"/>',check:'<path d="m6 14 5 5L23 7"/>'})[n]||"",Li=n=>`<svg viewBox="0 0 28 28" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${py(n)}</svg>`;la.innerHTML=`
  <aside class="sidebar">
    <a class="brand" href="#" aria-label="MetaHub Circuits lab">${Li("circuit")}<span>MetaHub<span class="brand-sub">Circuits lab</span></span></a>
    <div class="sidebar-caption">Electrical Circuits I</div>
    <nav aria-label="Laboratory modules">${Object.entries(fn).map(([n,e])=>`<button class="module-link" data-action="module:${n}" data-module="${n}"><span class="lab-number">${e.number}</span><span><strong>${e.name}</strong><small>${e.short}</small></span><span class="module-status" aria-hidden="true"></span></button>`).join("")}</nav>
    <div class="sidebar-bottom"><div class="course-mark">ELEN <strong>221</strong></div><button class="text-button" id="guide-button">Help ${Li("arrow")}</button><span class="prototype-tag">Lab build · v0.10</span></div>
  </aside>
  <main class="workspace">
    <header class="topbar"><div class="breadcrumb">Lab <span id="lab-number">05</span><span class="slash">/</span><span id="topic-label"></span></div><div class="header-actions"><button class="button vr-button" id="vr-button">${Li("vr")} Checking VR…</button></div></header>
    <div class="vr-status-row"><span id="vr-status" role="status">Checking headset…</span><button id="headset-help" class="text-button">Open on a headset</button></div>
    <section class="intro"><div><h1 id="module-title"></h1><p id="module-description"></p></div><div class="mode-switch" aria-label="Learning mode"><button data-action="explore" class="active">Explore</button><button data-action="build">Build circuit</button></div></section>
    <section class="experiment-brief" aria-label="Experiment aim"><span>Your experiment</span><p id="experiment-aim"></p><details><summary>Experiment steps</summary><div id="experiment-steps"></div></details></section>
    <div class="lab-layout">
      <section class="bench-panel" aria-label="Interactive circuit experiment">
        <div class="panel-header"><div class="bench-tabs"><button id="bench-tab" class="active">3D bench</button><button id="reference-tab">Schematic</button><button id="vr-preview-tab" hidden title="Desktop check of panel layout only">Panel preview</button></div><div class="bench-toolbar"><span id="circuit-status" class="status-tag">Circuit connected</span><button class="button subtle" data-action="reset-experiment" title="Restore this lab's original Explore circuit, values and probes">Reset experiment</button><button class="icon-button" id="reset-view" aria-label="Reset 3D view">${Li("reset")}</button></div></div>
        <div class="stage-wrap"><div id="bench"></div><div id="schematic" hidden></div><div class="stage-top"><span id="bench-caption">Original circuit</span><span id="hover-label" hidden></span></div><div class="stage-bottom"><span>Drag empty space to look around · Scroll to zoom</span><span>Drag a probe to a contact · Drag a dial to turn it</span></div></div>
        <div class="bench-strip"><p id="object-help">Use the equipment on the bench. The meter reads the voltage between its two test tips.</p><button class="button subtle" data-action="undo" title="Undo last wire or probe change">Undo</button><button class="button subtle" data-action="cancel" id="cancel-wire" title="Cancel selection (Esc)">Cancel lead</button></div>
        <div class="bench-help"><span id="bench-help"></span></div>
        <div id="readings" class="readings"></div>
      </section>
      <aside class="controls-panel"><details id="keyboard-controls"><summary>Keyboard controls</summary><p class="hint">The same equipment settings, for keyboard and touch use.</p><div class="patch-toolbar" aria-label="Keyboard bench tools"><button data-action="tool:select" data-tool="select">Select</button><button data-action="tool:wire" data-tool="wire">Connect contacts</button><button data-action="tool:red" data-tool="red">Move V tip</button><button data-action="tool:black" data-tool="black">Move COM tip</button><button data-action="tool:remove" data-tool="remove">Remove lead</button></div><div class="control-heading"><div><h2>Equipment settings</h2></div><span class="small-circuit">${Li("circuit")}</span></div><div id="part-controls" hidden></div><div id="controls"></div><div id="model-note" class="model-note"></div></details></aside>
    </div>
    <div class="lower-layout">
      <section class="chart-panel"><div class="chart-heading"><div><h2 id="chart-title"></h2></div><div id="chart-legend"></div></div><p id="chart-subtitle"></p><p id="chart-use" class="chart-use"></p><div id="source-comparison" hidden></div><div id="scope-controls" hidden></div><div id="chart" tabindex="0" aria-label="Interactive measurement graph"></div><output id="trace-reading" class="trace-reading" aria-live="polite"></output></section>
      <section class="challenge-panel"><h2>At the bench</h2><div id="activity-controls"></div><div class="challenge-actions"><button class="button subtle" data-action="check-wiring">Check connections</button><button class="button subtle" id="new-attempt" data-action="reset-circuit" hidden>Clear circuit</button></div><p class="feedback" id="feedback" role="status" aria-live="polite"></p></section>
    </div>
    <section class="connection-panel"><details><summary>Wiring list and keyboard connections</summary><div class="connection-content"><div><h3>Connect a patch lead</h3><div class="wiring-form"><label>From<select id="wire-from"></select></label><label>To<select id="wire-to"></select></label><button class="button primary" id="add-wire">Connect</button></div><div class="wiring-form"><label>Meter V tip (red)<select id="red-probe"></select></label><label>Meter COM tip (black)<select id="black-probe"></select></label></div><div class="connection-buttons"><button class="button subtle" data-action="check-wiring">Check connections</button><button class="button subtle" data-action="clear">Clear leads</button><button class="button subtle" data-action="restore" id="restore-button">Use shown circuit</button></div></div><div><h3>Connected leads</h3><div id="wire-list"></div></div></div></details></section>
    <footer class="workspace-footer"><span><i class="footer-dot"></i> Desktop 3D / VR</span><span>Ideal circuit models</span><button id="model-guide">Model limits ${Li("arrow")}</button></footer>
  </main>
  <dialog id="headset-dialog" aria-labelledby="headset-title"><div class="dialog-header"><h2 id="headset-title">Open the lab in VR</h2><button class="icon-button" data-close aria-label="Close VR setup">×</button></div><p>Open this lab in your headset’s browser, then select <strong>Enter VR</strong>. The circuit bench and all four experiments open around you.</p><div id="headset-address" class="headset-address"></div><ol class="headset-steps"><li>Choose a lab and Explore or Build circuit.</li><li>Enter VR and accept the headset’s request.</li><li>Grip a probe to pick it up. Bring its tip to a contact and release. Hold a dial and turn your wrist to adjust it.</li><li>Use the left stick to move and the right stick to turn. You can also walk around within your play area.</li></ol><p id="headset-status" class="headset-status" role="status"></p><p>Your circuit and readings stay when you leave VR.</p><div class="dialog-actions"><button class="button primary" id="headset-enter" hidden>Enter VR</button><button class="button subtle" id="headset-check">Check headset</button><a id="headset-fullscreen" class="button subtle" target="_blank" rel="noopener" hidden>Open lab full screen</a></div></dialog>
  <dialog id="guide-dialog"><div class="dialog-header"><div><span class="eyebrow">ELEN 221</span><h2>Lab guide</h2></div><button class="icon-button" data-close aria-label="Close guide">×</button></div><div class="guide-body"><h3>Use the equipment</h3><p>Explore starts with a wired circuit. Build circuit starts with loose connections. Follow the experiment steps above the bench. Reset experiment (Reset lab on the control box) returns this lab to its original Explore circuit, values and probes.</p><ol><li>Drag from one contact to another to add a lead. Grab an existing lead to move or remove it. Undo puts the last connection back.</li><li>Pick up a test probe and put its metal tip on a contact. The red lead runs to V and the black lead to COM on the meter. The reading is V minus COM. Swap the tips to reverse the sign.</li><li>Turn the dials on the equipment to change values. Flip the circuit switch to change its state. In the amplifier lab, use the two scope probes to compare input and output.</li><li>Drag on a graph to choose a load or inspect an acquired trace. The graph labels state what is being calculated or measured. Put your answers on paper.</li></ol><h3>In VR</h3><p id="vr-help-status"></p><p>Open the HTTPS link in your headset browser and select Enter VR. Grip a probe to pick it up, move it to a contact, and release. Hold a dial and turn your wrist. Use the left stick to move and the right stick to turn. You can also walk within your play area. Recenter brings you back to the bench. Read graphs on the left device, readings on the right, and circuit errors on the centre panel. The Diagram tab shows the target circuit.</p><h3>Keyboard and mouse</h3><p>Drag empty space to orbit and scroll to zoom. Drag equipment to use it. Keyboard controls below the bench offer the same settings without dragging. Focus the graph and use the arrow keys to move its cursor.</p><h3>Model limits</h3><p>DC resistor circuits are solved from your connections. The amplifier and transient labs support the shown circuit layouts. Disconnected or invalid circuits do not produce valid traces.</p><p>The amplifier uses ideal gain with adjustable supply rails. Its output stays 1 V inside each rail. This model does not include device bandwidth, slew rate, input common-mode limits, component tolerances or output current limits.</p><p>RC and RL models preserve capacitor voltage and inductor current at switching. New run resets stored energy. The instructor must confirm the amplifier configurations against the lab handout, which was not included in the email.</p><p><a href="./docs/module-designs.md" target="_blank" rel="noopener">Instructor guide ↗</a></p></div></dialog>
`;const bn=(n,e,t,i=r=>r)=>`<label class="control-label" for="param-${n}">${e}</label><select id="param-${n}" data-param="${n}">${t.map(r=>`<option value="${St(r)}" ${it(ae)[n]===r?"selected":""}>${St(i(r))}</option>`).join("")}</select>`,Ds=(n,e,t)=>`<div class="control-label">${e}</div><div class="segmented">${t.map(([i,r])=>`<button data-action="set:${n}:${i}" class="${it(ae)[n]===i?"active":""}">${r}</button>`).join("")}</div>`,Jt=n=>`<div class="control-block">${n}</div>`;function Nd(){var c,l;const n=document.activeElement,e=(n==null?void 0:n.id)||null,t=n==null?void 0:n.dataset.scopeChannel,i=n==null?void 0:n.dataset.scopeField,r=it(ae),s=ae.module;let o="",a="";s==="thevenin"&&(o+=Jt(Ds("representation","Circuit",[["original","Original"],["thevenin","Thévenin"],["norton","Norton"]])),o+=Jt(bn("load","Load",Ut.load,u=>`${u} Ω`)+`<div class="range-labels"><span>Smaller load</span><span>Larger load</span></div><input aria-label="Load resistance slider" type="range" min="0" max="6" step="1" value="${Ut.load.indexOf(r.load)}" id="load-slider">`),r.representation==="thevenin"&&(o+=Jt(bn("equivalentVoltage","Vth",Ut.equivalentVoltage,u=>`${u} V`))),r.representation==="norton"&&(o+=Jt(bn("nortonCurrent","In",Ut.nortonCurrent,u=>`${u} mA`))),r.representation!=="original"?o+=Jt(bn("equivalentResistance","Equivalent resistance",Ut.equivalentResistance,u=>`${u} Ω`)):o+='<div class="fixed-values"><span>Source<strong>12 V</strong></span><span>R₁ / R₂<strong>1 kΩ / 1 kΩ</strong></span></div>',a="Use the same loads in each circuit. Peak power and peak efficiency occur at different loads."),s==="superposition"&&(o+=Jt(Ds("sourceMode","Active sources",[["both","Both"],["a","A alone"],["b","B alone"]])),o+=Jt(bn("v1","Source A",Ut.v1,u=>`+${u} V`)),o+=Jt(bn("v2","Source B",Ut.v2,u=>`−${u} V`)),o+=Jt(Ds("replacement","Inactive source",[["short","Short circuit"],["open","Open circuit"]])),a="An inactive ideal voltage source is a short circuit. Compare it with an open circuit. All resistors are 1 kΩ."),s==="opamp"&&(o+=Jt(Ds("configuration","Circuit",[["inverting","Inverting"],["noninverting","Non-inverting"]])),o+=`<div class="paired-controls">${Jt(bn("rin",r.configuration==="inverting"?"Input resistor":"Ground resistor",Ut.rin,u=>`${u/1e3} kΩ`))}${Jt(bn("rf","Feedback resistor",Ut.rf,u=>`${u/1e3} kΩ`))}</div>`,o+=Jt(bn("amplitude","Input amplitude",Ut.amplitude,u=>`${u} V peak`)),o+=`<div class="paired-controls">${Jt(bn("rail","Supply rails",Ut.rail,u=>`±${u} V`))}${Jt(bn("frequency","Signal frequency",Ut.frequency,u=>`${u} Hz`))}</div>`,a=`Sine input · 1 V output headroom · ±${r.rail-1} V output limit. Ideal gain. Bandwidth and slew rate are not modelled.`),s==="transient"&&(o+=Jt(Ds("kind","Circuit",[["RC","RC · capacitor"],["RL","RL · inductor"]])),o+=Jt(bn("resistance","Series resistance",Ut.resistance,u=>`${u} Ω`)),o+=`<div class="fixed-values"><span>Source<strong>5 V</strong></span><span>${r.kind==="RC"?"Capacitance":"Inductance"}<strong>${r.kind==="RC"?"100 μF":"100 mH"}</strong></span></div>`,o+=Jt(`<div class="control-label">Switch position</div><button class="switch-button ${r.charging?"charging":""}" data-action="switch"><span class="switch-track"><i></i></span>${r.charging?"Source connected":"Closed return loop"}</button>`),o+=`<div class="transient-buttons"><button class="button primary" data-action="play" id="play-button">${Li("play")}${r.playing?"Pause":"Run"}</button><button class="button subtle" data-action="reset-energy">New run</button></div><div class="time-control"><div><span>Time</span><strong id="simulation-time">${Ft(r.time*1e3)} ms</strong></div><input id="time-slider" aria-label="Simulation time in time constants" type="range" min="0" max="5" step="0.01" value="${r.time/Hn({...r,source:5}).tau}"><div class="time-shortcuts"><button data-action="one-tau">Go to 1 τ</button><button data-action="five-tau">Go to 5 τ</button><button data-action="replay">Replay</button></div></div>`,o+=Jt(bn("speed","Playback speed",Ut.speed,u=>`${u}×`)),a="Voltage, current and energy share one clock. Changing R keeps the same playback scale. New run resets stored energy."),document.querySelector("#controls").innerHTML=o,gy(),vy(),yy(),document.querySelector("#model-note").textContent=a,e?(c=document.getElementById(e))==null||c.focus({preventScroll:!0}):t&&((l=document.querySelector(`[data-scope-channel="${t}"][data-scope-field="${i}"]`))==null||l.focus({preventScroll:!0}))}function Od(){const n=it(ae);return(ae.module==="thevenin"?{load:["load"],req:["equivalentResistance"],s:n.representation==="norton"?["nortonCurrent"]:n.representation==="thevenin"?["equivalentVoltage"]:[]}:ae.module==="superposition"?{a:["v1"],b:["v2"]}:ae.module==="opamp"?{signal:["amplitude","frequency"],rin:["rin"],rf:["rf"],plus:["rail"],minus:["rail"],op:["configuration"]}:{r:["resistance"],sw:["charging"],storage:["kind"]})[Rr]||[]}function my(){const n=Od();return Bh(ae).filter(e=>n.some(t=>e.id.startsWith(`cycle:${t}`)||e.id.startsWith(`set:${t}:`)||t==="charging"&&e.id==="switch")).map(e=>e.id)}function gy(){const n=document.querySelector("#part-controls"),e=Mt(ae).circuit.components.find(i=>i.id===Rr);if(n.hidden=!e,!e)return;const t=Od();n.innerHTML=`<div class="part-title"><strong>${St(e.label)} · ${St(e.value)}</strong><button id="close-part" aria-label="Close part settings">×</button></div>`+(t.length?t.map(i=>{var a;const r=document.querySelector(`[data-param="${i}"]`);r&&((a=r.closest(".control-block"))==null||a.classList.add("selected-control"));const s={load:"Load",equivalentResistance:"Resistance",equivalentVoltage:"Vth",nortonCurrent:"In",v1:"Source A",v2:"Source B",resistance:"Resistance",rail:"Supply",frequency:"Frequency",amplitude:"Input",rin:"Rin",rf:"Rf"}[i]||i,o={load:"Ω",equivalentResistance:"Ω",equivalentVoltage:"V",nortonCurrent:"mA",v1:"V",v2:"V",resistance:"Ω",rail:"V",frequency:"Hz",amplitude:"V peak",rin:"Ω",rf:"Ω"}[i]||"";return Ut[i]?`<div class="part-adjust"><button data-action="cycle:${i}:-1" aria-label="Decrease ${St(i)}">−</button><span>${St(s)}: ${St(it(ae)[i])} ${o}</span><button data-action="cycle:${i}" aria-label="Increase ${St(i)}">+</button></div>`:i==="charging"?'<button class="button" data-action="switch">Flip switch</button>':i==="configuration"?`<button class="button" data-action="set:configuration:${it(ae).configuration==="inverting"?"noninverting":"inverting"}">Change amplifier</button>`:i==="kind"?`<button class="button" data-action="set:kind:${it(ae).kind==="RC"?"RL":"RC"}">Use ${it(ae).kind==="RC"?"RL":"RC"}</button>`:""}).join(""):"<p>Fixed part. Connect its terminals with the Connect tool.</p>")}function vy(){const n=fn[ae.module],t=`<ol class="experiment-steps">${(n.steps||[]).map(i=>`<li>${St(i)}</li>`).join("")}</ol>`;document.querySelector("#experiment-steps").innerHTML=t,document.querySelector("#experiment-aim").textContent=n.purpose||n.challenge,document.querySelector("#activity-controls").innerHTML=`<p>${St(n.principle)}</p><p class="paper-note">Use the equipment to test each step. Keep readings and answers on paper.</p>`}function _y(){const n=al(ae),e=it(ae);document.querySelector("#source-comparison").innerHTML=`<p>Live circuit values at +${e.v1} V / −${e.v2} V. Each view uses your wiring. Select a case to switch the sources on the bench.</p><div class="source-cases">${[["a","A alone"],["b","B alone"],["both","Both sources"]].map(([t,i])=>{var s;const r=(s=n.live)==null?void 0:s[t];return`<button data-action="set:sourceMode:${t}" class="source-case ${e.sourceMode===t?"active":""}"><span>${i}</span><strong>${r!=null&&r.valid?`${Ft(r.current*1e3)} mA`:"—"}</strong><small>${r!=null&&r.valid?`${Ft(r.voltage)} V`:"Connect the circuit"}</small></button>`}).join("")}</div>`}function xy(){if(ae.module==="superposition"){const n=al(ae).live;return["a","b","both"].map(e=>{var t;return`${{a:"A alone",b:"B alone",both:"Both sources"}[e]}: ${(t=n==null?void 0:n[e])!=null&&t.valid?Ft(n[e].current*1e3)+" mA":"Connect the circuit"}`})}if(ae.module==="opamp"){const n=vi(ae);return[n.ok?`Scope: ${n.running?"Run":"Hold"}${n.stale?" · earlier settings":""}`:`Scope: ${n.error}`]}return[]}function yy(){var o;const n=document.querySelector("#scope-controls"),e=((o=n.querySelector("details"))==null?void 0:o.open)||!1;if(n.hidden=ae.module!=="opamp",ae.module!=="opamp")return;const t=it(ae),i=Mt(ae),r=vi(ae),s=(a,c,l)=>`<label>${l}<select data-scope-channel="${a}" data-scope-field="${c}" aria-label="${l}"><option value="">Disconnected</option>${i.circuit.pins.map(u=>`<option value="${St(u.id)}" ${i.scope[a][c]===u.id?"selected":""}>${St(u.name)}</option>`).join("")}</select></label>`;n.innerHTML=`<details class="scope-keyboard" ${e?"open":""}><summary>Scope keyboard controls</summary><div class="scope-top"><strong>Scope</strong><div><button class="button" data-action="scope-toggle">${t.scopeRunning?"Hold":"Run scope"}</button><button class="button" data-action="scope-autoscale">Auto scale</button></div></div><p class="scope-status ${r.error?"warning":""}">${St(r.error||(r.ok?`${r.running?"Running":"Held capture"}${r.stale?" · settings have changed":""} · ${r.trigger.found?"Triggered":"No trigger crossing"}`:"Connect the scope probes."))}</p>
    <div class="scope-channels">${["ch1","ch2"].map((a,c)=>`<fieldset><legend>${a.toUpperCase()} · ${c?"output":"input"}</legend><p class="hint">Move the probe and ground clip on the bench.</p>${s(a,"signal",`${a.toUpperCase()} tip`)}${s(a,"ground",`${a.toUpperCase()} ground`)}${bn(`${a}Scale`,"V / div",Ut[`${a}Scale`],l=>`${l} V`)}</fieldset>`).join("")}</div>
    <div class="scope-time">${Jt(bn("timeDiv","Time / div",Ut.timeDiv,a=>`${a} ms`))}${Jt(bn("triggerEdge","Trigger edge",["rising","falling"],a=>a==="rising"?"Rising":"Falling"))}<label class="control-block"><span class="control-label">Trigger level · CH1</span><div class="number-unit"><input data-param="triggerLevel" aria-label="Trigger level" type="number" step="0.1" min="-15" max="15" value="${t.triggerLevel}"><span>V</span></div></label></div><p class="hint">Both ground clips share circuit GND. Scales change the view, not the circuit.</p></details>`}function Rh(n,e=sn.panel){const t=sn.active?zh(ae,sn.fraction,e):null,i=t?{x:sn.fraction,label:t.text,xLabel:t.xLabel,readings:t.readings}:null,r=n.interaction||{thevenin:"load",superposition:"source",opamp:"scope",transient:"time"}[ae.module];if(n.bars){const s=Math.max(...n.bars.map(o=>Math.abs(o.value??0)),1)*1.25;return{title:n.title,interaction:r,cursor:i,subtitle:n.subtitle,xLabel:"Source case",yLabel:"Current (mA)",xTicks:n.bars.map((o,a)=>({position:.18+a*.3,label:o.name})),yTicks:[-s,0,s].map(o=>({position:.5+o/(2*s),label:Ft(o,2)})),series:n.bars.filter(o=>Number.isFinite(o.value)).map(o=>{const a=n.bars.indexOf(o);return{color:o.color,points:[[.18+a*.3,.5],[.18+a*.3,.5+o.value/(2*s)]]}})}}return{title:n.title,interaction:r,cursor:i,id:n.id,subtitle:n.subtitle,xLabel:n.xLabel,yLabel:n.yLabel,xDivisions:ae.module==="opamp"?10:4,yDivisions:ae.module==="opamp"?8:4,xTicks:Array.from({length:ae.module==="opamp"?6:5},(s,o)=>{const a=ae.module==="opamp"?5:4;return{position:o/a,label:Ft(n.xMax*o/a,2)}}),yTicks:Array.from({length:5},(s,o)=>({position:o/4,label:Ft(n.yMin+(n.yMax-n.yMin)*o/4,2)})),marker:n.marker?{x:n.marker.x/n.xMax,y:(n.marker.y-n.yMin)/(n.yMax-n.yMin)}:null,reference:n.tau?{x:n.tau/n.xMax,label:"1 τ"}:null,series:n.series.map(s=>({name:s.name,color:s.color,points:s.points.map(([o,a])=>[o/n.xMax,(a-n.yMin)/(n.yMax-n.yMin)])}))}}function ta(n,e=0,t=!0){const i=ia(ae);if(sn={fraction:Math.min(1,Math.max(0,n)),panel:e,active:!0},t&&ae.module==="thevenin"){const r=sn.fraction*i.xMax,s=Ut.load.reduce((o,a)=>Math.abs(a-r)<Math.abs(o-r)?a:o);ri(ae,"load",s),sn.fraction=s/i.xMax}else t&&ae.module==="transient"?(kh(ae,`scrub:${sn.fraction*i.xMax}`),sn.fraction=it(ae).time*1e3/i.xMax):t&&ae.module==="superposition"&&ri(ae,"sourceMode",["a","b","both"][Math.min(2,Math.floor(sn.fraction*3))]);Nd(),Ul(),tr()}function Fd(n,e=Sr){if(!e)return;const t=(n.clientX-e.bounds.left)/e.bounds.width*640;ta((t-52)/568,e.panel)}const os=document.querySelector("#chart");os.addEventListener("pointerdown",n=>{const e=n.target.closest("svg[data-plot-index]");!e||n.button!==0||(n.preventDefault(),Sr={panel:Number(e.dataset.plotIndex),bounds:e.getBoundingClientRect(),pointerId:n.pointerId},os.setPointerCapture(n.pointerId),os.focus({preventScroll:!0}),Fd(n))});os.addEventListener("pointermove",n=>{(Sr==null?void 0:Sr.pointerId)===n.pointerId&&Fd(n)});for(const n of["pointerup","pointercancel","lostpointercapture"])os.addEventListener(n,()=>{Sr=null});os.addEventListener("keydown",n=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(n.key))return;if(n.preventDefault(),ae.module==="thevenin"){const t=Ut.load,i=t.indexOf(it(ae).load),r=n.key==="Home"?0:n.key==="End"?t.length-1:Math.max(0,Math.min(t.length-1,i+(n.key==="ArrowRight"?1:-1)));ta(t[r]/ia(ae).xMax,0);return}const e=n.key==="Home"?0:n.key==="End"?1:sn.fraction+(n.key==="ArrowRight"?.02:-.02);ta(e,sn.panel)});function by(){const{circuit:n,wires:e,probes:t}=Mt(ae),i=n.pins.map(r=>`<option value="${St(r.id)}">${St(r.name)} [${St(r.id)}]</option>`).join("");for(const r of["wire-from","wire-to"]){const s=document.getElementById(r),o=s.value;s.innerHTML=i,n.pins.some(a=>a.id===o)&&(s.value=o)}for(const r of["red","black"]){const s=document.getElementById(`${r}-probe`);s.innerHTML='<option value="">Disconnected</option>'+i,s.value=t[r]||""}document.querySelector("#wire-list").innerHTML=e.length?e.map(([r,s],o)=>`<div class="wire-row"><span><code>${St(r)}</code> <span>↔</span> <code>${St(s)}</code></span><button data-remove-wire="${o}" aria-label="Remove connection ${St(r)} to ${St(s)}">Remove</button></div>`).join(""):'<p class="empty-wires">No leads connected. Start with the common ground connections.</p>',document.querySelector("#restore-button").hidden=ae.mode!=="explore"}function Ch(n,e=0){if(n.bars){const v=Math.max(...n.bars.map(_=>Math.abs(_.value??0)),1)*1.25,m=18+162/2,p=162/(2*v);return`<svg data-plot-index="${e}" viewBox="0 0 640 218" role="img" aria-label="${St(n.title)}">${[-v,0,v].map(_=>`<line x1="52" y1="${m-_*p}" x2="620" y2="${m-_*p}" class="grid-line"/><text x="43" y="${m-_*p+4}" text-anchor="end">${Ft(_,1)}</text>`).join("")}${n.bars.map((_,x)=>{const y=127+x*175,M=m-(_.value??0)*p;return Number.isFinite(_.value)?`<rect x="${y}" y="${Math.min(m,M)}" width="72" height="${Math.max(1,Math.abs(_.value*p))}" rx="3" fill="${_.color}"/><text x="${y+36}" y="${_.value>=0?M-9:M+17}" text-anchor="middle" class="bar-value">${Ft(_.value)} mA</text><text x="${y+36}" y="203" text-anchor="middle">${_.name}</text>`:`<text x="${y+36}" y="${m-8}" text-anchor="middle">—</text><text x="${y+36}" y="203" text-anchor="middle">${St(_.name)}</text>`}).join("")}</svg>`}const u=v=>52+v/n.xMax*568,h=v=>180-(v-n.yMin)/(n.yMax-n.yMin)*162;let d=`<svg data-plot-index="${e}" viewBox="0 0 640 218" role="img" aria-label="${St(n.title)}"><defs><clipPath id="plot-clip-${e}"><rect x="52" y="18" width="568" height="162"/></clipPath></defs>`;const f=ae.module==="opamp"?10:4,g=ae.module==="opamp"?8:4;for(let v=0;v<=f;v++){const m=n.xMax*v/f;d+=`<line x1="${u(m)}" y1="18" x2="${u(m)}" y2="180" class="grid-line"/>`,(f===4||v%2===0)&&(d+=`<text x="${u(m)}" y="196" text-anchor="middle">${Ft(m,2)}</text>`)}for(let v=0;v<=g;v++){const m=n.yMin+(n.yMax-n.yMin)*v/g;d+=`<line x1="52" y1="${h(m)}" x2="620" y2="${h(m)}" class="grid-line"/>`,(g===4||v%2===0)&&(d+=`<text x="42" y="${h(m)+4}" text-anchor="end">${Ft(m,2)}</text>`)}if(d+=`<g clip-path="url(#plot-clip-${e})">`,n.limits)for(const v of n.limits)d+=`<line x1="52" y1="${h(v)}" x2="620" y2="${h(v)}" stroke="#c6a885" stroke-dasharray="4 5"/>`;n.tau&&(d+=`<line x1="${u(n.tau)}" y1="18" x2="${u(n.tau)}" y2="180" stroke="#bb7549" stroke-dasharray="4 5"/><text x="${u(n.tau)+5}" y="30">1 τ</text>`);for(const v of n.series)d+=`<path d="${v.points.map(([m,p],_)=>`${_?"L":"M"}${u(m).toFixed(2)},${h(p).toFixed(2)}`).join(" ")}" fill="none" stroke="${v.color}" stroke-width="2.6"/>`;if(n.marker&&Number.isFinite(n.marker.y)&&(d+=`<circle cx="${u(n.marker.x)}" cy="${h(n.marker.y)}" r="5" fill="#fff" stroke="#b77636" stroke-width="2.5"/>`),sn.active){const v=u(sn.fraction*n.xMax);d+=`<line x1="${v}" y1="18" x2="${v}" y2="180" class="trace-cursor"/><rect x="${v-5}" y="18" width="10" height="7" fill="#263e50"/>`}return d+=`</g><text x="${52+568/2}" y="215" text-anchor="middle" class="axis-label">${St(n.xLabel)}</text><text x="52" y="11" class="axis-label">${St(n.yLabel)}</text></svg>`,d}function Ul(){document.querySelector("#schematic").innerHTML='<div class="schematic-heading"><strong>Reference circuit</strong><span>Values follow the settings.</span></div>'+Ud(ae.module,it(ae))+"<p>This is the target wiring. Your leads and voltage probes are on the 3D bench.</p>"}function tr(){var h,d,f;const n=Ni(ae),e=it(ae),t=Mt(ae),i=ia(ae),r=hf(ae).map((g,v)=>v===0&&ea==="off"?{...g,value:"—",unit:"",detail:"Meter off"}:g),s=fy(ae,{measurement:n,acquisition:i.scope,meterMode:ea});document.querySelector("#readings").innerHTML=r.map(g=>`<div class="reading"><span>${g.label}</span><div>${St(g.value)}<small>${g.unit}</small></div><p>${St(g.detail)}</p></div>`).join("");const o=document.querySelector("#circuit-status");o.textContent=n.ok?t.correct?"Circuit connected":"Different wiring":"Connect the circuit",o.classList.toggle("warning",!n.ok||!t.correct),document.querySelector("#chart-title").textContent=i.title,document.querySelector("#chart-subtitle").textContent=i.subtitle,document.querySelector("#chart-use").textContent={thevenin:"Drag along the graph to set the load. Watch the meter and power change together.",superposition:"Select a source view to switch the circuit. The signed currents show how the sources add or cancel.",opamp:"Drag along the trace to read voltage at a chosen time. Turn the scope dials to change its scale.",transient:"The trace grows while the circuit runs. Drag on the trace to pause and inspect voltage, current and energy at the same instant."}[ae.module],document.querySelector("#chart-legend").innerHTML=i.series.map(g=>`<span><i style="background:${g.color}"></i>${St(g.name)}</span>`).join(""),document.querySelector("#chart").innerHTML=(h=i.panels)!=null&&h.length?i.panels.map((g,v)=>`<div class="trace-panel"><h3>${St(g.title)}</h3>${Ch(g,v)}${g.subtitle?`<p>${St(g.subtitle)}</p>`:""}</div>`).join(""):Ch(i);const a=sn.active?zh(ae,sn.fraction,sn.panel):null;if(document.querySelector("#trace-reading").textContent=(a==null?void 0:a.text)||"Use the graph to inspect a reading. Arrow keys also move the cursor.",document.querySelector("#feedback").textContent=!n.ok&&ae.mode==="explore"?n.error:ae.feedback,ae.module==="transient"){document.querySelector("#simulation-time").textContent=`${Ft(e.time*1e3)} ms`;const g=document.querySelector("#time-slider");document.activeElement!==g&&(g.value=e.time/Hn({...e,source:5}).tau),document.querySelector("#play-button").innerHTML=Li("play")+(e.playing?"Pause":"Run")}for(const g of document.querySelectorAll("[data-tool]"))g.classList.toggle("active",g.dataset.tool===ae.tool);const c=Rh(i);(d=i.panels)!=null&&d.length&&(c.panels=i.panels.map(Rh));const l={select:"Drag a dial to change its value. Drag a probe onto a contact to take a reading.",wire:ae.selectedTerminal?`From ${((f=t.circuit.pins.find(g=>g.id===ae.selectedTerminal))==null?void 0:f.name)||ae.selectedTerminal} → select the next terminal. Esc cancels.`:"Drag from one contact to another to connect a lead. Drag a test probe onto a contact to measure voltage.",red:"Keyboard placement: choose the contact for the meter’s V tip.",black:"Keyboard placement: choose the contact for the meter’s COM tip.",remove:"Click a lead to remove it. Undo restores the last change.",ch1:"Click a terminal for the CH1 scope tip.",ch2:"Click a terminal for the CH2 scope tip.",scopeGround:"Click circuit ground for the selected scope ground lead."};document.querySelector("#bench-help").textContent=ae.tool!=="wire"||ae.selectedTerminal?l[ae.tool]||ae.feedback:`${s.title}. ${s.message}${s.detail?" "+s.detail:""}`,document.querySelector("#cancel-wire").hidden=!ae.selectedTerminal,document.querySelector("#source-comparison").hidden=ae.module!=="superposition",ae.module==="superposition"&&_y();const u=[...r.map(g=>`${g.label}: ${g.value} ${g.unit}`),"Grip a probe, bring its tip to a contact, then release. Hold and turn a dial to adjust it.","Left stick: move. Right stick: turn. Walk within your play area to inspect the bench.",ae.module==="transient"?`Time: ${Ft(e.time*1e3)} ms | playback ${e.speed}×`:"",n.ok?"":n.error,`Experiment: ${fn[ae.module].challenge}`,`Feedback: ${ae.feedback}`,...xy()].filter(Boolean);mt==null||mt.update({module:ae.module,mode:ae.mode,parameters:{...e},measurement:n,diagnostic:s,metrics:r,options:Ut,experiment:{challenge:fn[ae.module].challenge,steps:fn[ae.module].steps||[]},components:t.circuit.components,wires:t.wires,probes:t.probes,selectedTerminal:ae.selectedTerminal,tool:ae.tool,scope:t.scope,selectedPart:Rr,partActions:my(),schematicDataURL:`data:image/svg+xml;charset=utf-8,${encodeURIComponent(Ud(ae.module,e))}`,live:{title:`Lab ${fn[ae.module].number} · ${fn[ae.module].name}`,lines:u},actions:Bh(ae),graph:c,rawGraph:i})}function Ln(){const n=fn[ae.module],e=it(ae);document.querySelector(".lower-layout").classList.toggle("scope-layout",ae.module==="opamp"),document.querySelector("#lab-number").textContent=n.number,document.querySelector("#topic-label").textContent=n.topic,document.querySelector("#module-title").textContent=n.title,document.querySelector("#module-description").textContent=n.description,document.querySelector("#new-attempt").hidden=ae.mode!=="build",document.querySelector("#bench-caption").textContent=e.representation?`${e.representation} circuit`:e.configuration?`${e.configuration} amplifier`:e.kind?`${e.kind} circuit`:"Two-source circuit";for(const t of document.querySelectorAll(".module-link")){const i=t.dataset.module===ae.module;t.classList.toggle("active",i),t.setAttribute("aria-current",i?"page":"false")}for(const t of document.querySelectorAll(".mode-switch button"))t.classList.toggle("active",t.dataset.action===ae.mode),t.setAttribute("aria-pressed",t.dataset.action===ae.mode?"true":"false");Nd(),by(),Ul(),tr()}function Js(n){var e;/^(module:|explore$|build$|undo$|clear$|restore$|reset-circuit$|reset-experiment$|set:(representation|kind|configuration):)/.test(n)&&((e=mt==null?void 0:mt.cancelInteractions)==null||e.call(mt)),(n.startsWith("module:")||/set:(representation|kind|configuration):/.test(n))&&(Rr=null,sn.active=!1),n==="reset-experiment"&&(Rr=null,sn={fraction:.5,panel:0,active:!1},Sr=null,ea="vdc",mt==null||mt.resetExperiment()),kh(ae,n),Ln(),/^(tool:ch[12]|scope-ground:)/.test(n)&&!Mr.active&&!fi&&(eo(!1),document.querySelector("#bench").scrollIntoView({block:"center",behavior:"instant"}))}la.addEventListener("click",n=>{if(n.target.closest("#close-part")){Rr=null,Ln();return}const e=n.target.closest("[data-action]");if(e){Js(e.dataset.action);return}const t=n.target.closest("[data-remove-wire]");if(t){const i=ae.tool;ae.tool="remove",cl(ae,Number(t.dataset.removeWire)),ae.tool=i,Ln();return}n.target.closest("[data-close]")&&n.target.closest("dialog").close()});la.addEventListener("change",n=>{var t;const e=n.target;if(e.dataset.param&&(["representation","kind","configuration"].includes(e.dataset.param)&&((t=mt==null?void 0:mt.cancelInteractions)==null||t.call(mt)),ri(ae,e.dataset.param,Number.isNaN(Number(e.value))?e.value:Number(e.value)),Ln()),e.dataset.scopeChannel){const i=e.dataset.scopeField;cs(ae,`${e.dataset.scopeChannel}${i==="ground"?"Ground":""}`,e.value||null),Ln()}(e.id==="red-probe"||e.id==="black-probe")&&(cs(ae,e.id.split("-")[0],e.value||null),tr())});la.addEventListener("input",n=>{const e=n.target;if(e.dataset.param&&e.type==="number"&&e.value!==""&&(ri(ae,e.dataset.param,Number(e.value)),tr()),n.target.id==="load-slider"&&(ri(ae,"load",Ut.load[Number(n.target.value)]),document.querySelector("#param-load").value=it(ae).load,tr(),Ul()),n.target.id==="time-slider"){const t=it(ae);t.playing=!1,ri(ae,"time",Number(n.target.value)*Hn({...t,source:5}).tau),tr()}});document.querySelector("#add-wire").addEventListener("click",()=>{const n=document.querySelector("#wire-from").value,e=document.querySelector("#wire-to").value;ae.tool="wire",ae.selectedTerminal=null,Ns(ae,n),Ns(ae,e),Ln()});document.querySelector(".brand").addEventListener("click",n=>{n.preventDefault(),Js("module:thevenin")});document.addEventListener("keydown",n=>{if(n.target.closest("input,textarea,select,button")||document.querySelector("dialog[open]"))return;const e={1:"tool:select",2:"tool:wire",3:"tool:red",4:"tool:black",5:"tool:remove",Escape:"cancel"};e[n.key]&&(n.preventDefault(),Js(e[n.key])),(n.ctrlKey||n.metaKey)&&n.key==="z"&&(n.preventDefault(),Js("undo"))});document.querySelector("#vr-preview-tab").addEventListener("click",()=>{const n=!fi;eo(!1),fi=n,document.querySelector(".lab-layout").classList.toggle("vr-preview",fi),mt==null||mt.setPanelPreview(fi),document.querySelector("#vr-preview-tab").classList.toggle("active",fi),document.querySelector("#bench-tab").classList.toggle("active",!fi&&!Il)});document.querySelector("#reset-view").addEventListener("click",()=>mt==null?void 0:mt.resetView());function eo(n){fi&&(fi=!1,mt==null||mt.setPanelPreview(!1),document.querySelector("#vr-preview-tab").classList.remove("active")),document.querySelector(".lab-layout").classList.remove("vr-preview"),Il=n,document.querySelector("#schematic").hidden=!n,document.querySelector("#bench-tab").classList.toggle("active",!n),document.querySelector("#reference-tab").classList.toggle("active",n),document.querySelector("#bench").style.visibility=n?"hidden":"visible",document.querySelector(".stage-bottom").hidden=n,document.querySelector(".stage-top").hidden=n}document.querySelector("#bench-tab").addEventListener("click",()=>eo(!1));document.querySelector("#reference-tab").addEventListener("click",()=>eo(!0));function My(){document.querySelector("#vr-help-status").textContent=Mr.message,document.querySelector("#guide-dialog").showModal()}for(const n of["guide-button","model-guide"])document.getElementById(n).addEventListener("click",My);function Sy(){try{const e=new URL((window.location.protocol==="https:",window.location.href));return e.hash="",e.searchParams.delete("inspect-vr"),e.protocol==="https:"?e.href:null}catch{return null}}function Ph(n){Mr=n;const e={checking:"Checking VR…",entering:"Opening VR…",active:"Exit VR",ready:"Enter VR",error:"Try VR again"},t=n.active?"Exit VR":e[n.kind]||(n.supported?"Enter VR":"Use a headset"),i=document.querySelector("#vr-button");i.innerHTML=Li("vr")+" "+t,i.title=n.message,i.disabled=n.kind==="checking"||n.kind==="entering",i.classList.toggle("vr-ready",n.supported);for(const s of["vr-status","headset-status","vr-help-status"])document.getElementById(s).textContent=n.message;const r=document.querySelector("#headset-enter");if(r.hidden=!n.supported||n.active,r.disabled=n.kind==="entering"||n.kind==="checking",document.querySelector("#headset-check").disabled=n.kind==="checking"||n.kind==="entering"||n.active,document.body.classList.toggle("in-vr",n.active),n.active)for(const s of document.querySelectorAll("dialog[open]"))s.close()}function kd(){var i;const n=Sy(),e=document.querySelector("#headset-address");e.innerHTML=n?`<span>Headset link</span><a href="${St(n)}" target="_blank" rel="noopener">${St(n)}</a><button class="button subtle" id="copy-headset-link">Copy link</button><small id="copy-headset-status" role="status"></small>`:"<p>This local address works on this computer. A standalone headset needs the lab’s HTTPS link.</p>",(i=document.querySelector("#copy-headset-link"))==null||i.addEventListener("click",async()=>{const r=document.querySelector("#copy-headset-status");try{await navigator.clipboard.writeText(n),r.textContent="Link copied"}catch{r.textContent="Select and copy the link above."}});const t=document.querySelector("#headset-fullscreen");t.hidden=window.self===window.top,t.href=window.location.href,document.querySelector("#headset-status").textContent=Mr.message,document.querySelector("#headset-dialog").showModal()}function zd(){!mt||Mr.kind==="entering"||(Mr.supported||Mr.active?(eo(!1),mt.enterVR()):kd())}document.querySelector("#vr-button").addEventListener("click",zd);document.querySelector("#headset-enter").addEventListener("click",zd);document.querySelector("#headset-help").addEventListener("click",kd);document.querySelector("#headset-check").addEventListener("click",()=>mt==null?void 0:mt.refreshVRSupport());document.querySelector("#vr-preview-tab").hidden=!new URLSearchParams(window.location.search).has("inspect-vr");for(const n of document.querySelectorAll("dialog"))n.addEventListener("click",e=>{if(e.target===n){const t=n.getBoundingClientRect();(e.clientX<t.left||e.clientX>t.right||e.clientY<t.top||e.clientY>t.bottom)&&n.close()}});try{mt=Qx({container:document.querySelector("#bench"),onFrame:Nl,onPanelPreviewChange:n=>{fi=n,document.querySelector(".lab-layout").classList.toggle("vr-preview",n),document.querySelector("#vr-preview-tab").classList.toggle("active",n),document.querySelector("#bench-tab").classList.toggle("active",!n&&!Il)},onTerminal:n=>{Ns(ae,n),Ln()},onWire:n=>{cl(ae,n),Ln()},onWireMove:(n,e,t)=>{nu(ae,n,e,t),Ln()},onManipulation:(n,e)=>{n==="begin"?Jd(ae,e.input):n==="end"&&Qd(ae,e.input)},onDisconnect:n=>{nu(ae,n,0,null),Ln()},onConnect:(n,e)=>{const t=ae.tool;ae.tool="wire",ae.selectedTerminal=null,Ns(ae,n),Ns(ae,e),ae.tool=t,Ln()},onProbe:(n,e)=>{cs(ae,n,e),Ln()},onChange:(n,e)=>{var t;if(n==="meterMode"){ea=e,tr();return}["representation","kind","configuration"].includes(n)&&((t=mt==null?void 0:mt.cancelInteractions)==null||t.call(mt)),ri(ae,n,e),Ln()},onGraphCursor:ta,onPart:n=>{Rr=n,Ln()},onHover:n=>{const e=document.querySelector("#hover-label");e.hidden=!n,e.textContent=n?n.label:""},onAction:Js,onXRStatus:Ph})}catch(n){Ph({kind:"unavailable",supported:!1,active:!1,message:"3D could not start in this browser. Open the lab in a headset browser."}),document.querySelector("#bench").innerHTML=`<div class="webgl-error"><h2>3D rendering is unavailable</h2><p>${St(n.message)}</p><p>You can still use the circuit reference and terminal controls below.</p></div>`}Ln();let Lh=performance.now(),Dh=0;function Nl(n){const e=Math.min((n-Lh)/1e3,.1);Lh=n;const t=ae.params.transient;t.playing&&ae.module==="transient"&&Mt(ae).correct&&(rf(ae,e),(!t.playing||n-Dh>100)&&(Dh=n,tr())),mt||requestAnimationFrame(Nl)}mt||requestAnimationFrame(Nl);
