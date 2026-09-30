(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();const En={thevenin:{number:"05",short:"Equivalent circuits",title:"Thévenin and Norton",name:"Thévenin & Norton",topic:"Thévenin, Norton & maximum power transfer",description:"Compare load voltage, current and power.",purpose:"Build equivalent circuits, verify the same load behaviour, and find maximum load power.",steps:["Wire the original network. Measure load voltage, current and power at 250, 500 and 1000 Ω.","Switch to Thévenin and Norton. Set their source and resistance values, then wire each equivalent.","Repeat the same loads. Compare all three circuits using your paper measurements.","Vary the load and inspect the calculated power sweep. Find the load that receives maximum power."],challenge:"Wire the original circuit and its Thévenin and Norton equivalents. Compare readings at 250, 500 and 1000 Ω, then vary the load to find maximum power. Write your results on paper.",principle:"Equivalent circuits preserve voltage and current at the load terminals. Their internal behaviour can differ.",defaults:{representation:"original",load:500,equivalentVoltage:6,equivalentResistance:500,nortonCurrent:12}},superposition:{number:"06",short:"Source contributions",title:"Superposition",name:"Superposition",topic:"Superposition in linear DC circuits",description:"Measure each source’s contribution.",purpose:"Add signed source contributions and explain how two active sources can cancel one branch current.",steps:["Wire the network with A at +6 V and B at −3 V. Read the branch current with both sources active.","Select A alone, then B alone. Replace each inactive ideal voltage source with a short.","Compare the signed contributions with the complete circuit. Add currents on paper, not powers.","Keep both sources active and adjust B until branch current is zero. Check which other branches still carry current."],challenge:"Compare A alone, B alone and both at +6 V / −3 V. Short each inactive voltage source. Adjust source B until the branch current is zero, then compare the signed contributions. Write your explanation on paper.",principle:"Add signed voltage or current contributions. Power must be calculated from the combined result.",defaults:{v1:6,v2:3,sourceMode:"both",replacement:"short",sumMilliamp:null,explanation:"unset"}},opamp:{number:"07",short:"Gain & clipping",title:"Operational amplifiers",name:"Operational amplifiers",topic:"Closed-loop gain & output clipping",description:"Set the gain and check for clipping.",purpose:"Design a gain with resistors, then find the largest input before output clipping.",steps:["Choose the amplifier circuit assigned in your lab sheet. For this example, start with the inverting circuit.","For a first design, use the inverting circuit at gain −3. Set Rin and Rf, wire feedback, and connect both supplies.","Connect CH1 to input and CH2 to output, with both grounds at GND. Set a readable timebase and voltage scales.","Increase input amplitude until clipping begins. Change the supplies or signal frequency and compare the traces."],challenge:"At ±12 V and 100 Hz, build an inverting amplifier with gain −3. Connect CH1 to Vin and CH2 to Vout, with both grounds at GND. Increase the input until clipping appears. Put measurements and calculations on paper.",principle:"Negative feedback sets the gain only while the amplifier operates within its limits.",defaults:{configuration:"inverting",rin:1e4,rf:2e4,amplitude:1,rail:12,frequency:100,prediction:0,timeDiv:2,ch1Scale:1,ch2Scale:5,triggerEdge:"rising",triggerLevel:0,scopeRunning:!0,scopeGroundChannel:"ch1"}},transient:{number:"08",short:"Energy & time",title:"RC and RL response",name:"RC & RL transients",topic:"First-order RC & RL transient response",description:"Measure charging and decay.",purpose:"Predict how resistance changes response speed, then test both RC and RL circuits.",steps:["Wire RC. On paper, predict whether increasing R makes the response faster or slower.","Run from zero energy. Watch voltage, current and stored energy; pause, slow, replay or drag through the acquired trace.","Increase R and repeat from zero energy. Use the same playback speed and compare the time to reach the same fraction of the final value.","Repeat with RL, then switch each circuit to Return to observe decay. Compare both trends with your predictions."],challenge:"Wire the RC and RL circuits. Run charging and decay, compare voltage and current, and change R to see its effect on response time. Use pause, replay and the time cursor. Put predictions and measurements on paper.",principle:"Capacitor voltage and inductor current remain continuous through switching in these ideal circuits.",defaults:{kind:"RC",resistance:1e3,capacitance:1e-4,inductance:.1,charging:!0,initial:0,time:0,acquiredTime:0,playing:!1,speed:1,predictionChoice:"unset"}}},ln=(n,e,t,i)=>({id:n,label:e,x:t,z:i}),Xi=(n,e,t,i,r,s,o)=>({id:n,label:e,type:t,value:i,x:r,z:s,pins:o}),wr=()=>Xi("ground","GND","ground","0 V",-.7,.69,[ln("gnd","GND",-.7,.61)]),Fi=(n,e,t,i,r)=>Xi(n,e,"V",t,i,r,[ln(`${n}+`,"+",i,r-.22),ln(`${n}-`,"−",i,r+.22)]),nr=(n,e,t,i,r)=>Xi(n,e,"R",t,i,r,[ln(`${n}a`,"A",i-.29,r),ln(`${n}b`,"B",i+.29,r)]),Ar=(n,e,t,i,r)=>Xi(n,e,"R",t,i,r,[ln(`${n}a`,"+",i,r-.26),ln(`${n}b`,"−",i,r+.26)]),ui=(n,e)=>({id:n,type:"R",a:`${n}a`,b:`${n}b`,value:e}),js=(n,e)=>({id:n,type:"V",a:`${n}+`,b:`${n}-`,value:e});function zl(n,e){let t,i,r=[],s,o;if(n==="thevenin"&&(e.representation==="original"?(t=[Fi("s","DC SOURCE","12 V",-1.14,-.03),nr("r1","R₁","1 kΩ",-.36,-.46),Ar("r2","R₂","1 kΩ",.23,.08),Ar("load","LOAD",`${e.load} Ω`,1.1,.08),wr()],i=[["s+","r1a"],["r1b","r2a"],["r2a","loada"],["r2b","gnd"],["loadb","gnd"],["s-","gnd"]],r=[js("s",12),ui("r1",1e3),ui("r2",1e3),ui("load",e.load)]):e.representation==="thevenin"?(t=[Fi("s","Vth",`${e.equivalentVoltage} V`,-1,-.02),nr("req","Rth",`${e.equivalentResistance} Ω`,0,-.46),Ar("load","LOAD",`${e.load} Ω`,1,.02),wr()],i=[["s+","reqa"],["reqb","loada"],["loadb","gnd"],["s-","gnd"]],r=[js("s",e.equivalentVoltage),ui("req",e.equivalentResistance),ui("load",e.load)]):(t=[Xi("s","In ↑","I",`${e.nortonCurrent} mA`,-1,-.02,[ln("s+","OUT",-1,-.28),ln("s-","IN",-1,.24)]),Ar("req","Rn",`${e.equivalentResistance} Ω`,0,.02),Ar("load","LOAD",`${e.load} Ω`,1,.02),wr()],i=[["s+","reqa"],["reqa","loada"],["reqb","gnd"],["loadb","gnd"],["s-","gnd"]],r=[{id:"s",type:"I",a:"s-",b:"s+",value:e.nortonCurrent/1e3},ui("req",e.equivalentResistance),ui("load",e.load)]),s="loada",o="load"),n==="superposition"){const a=e.sourceMode!=="b",l=e.sourceMode!=="a";t=[Fi("a","SOURCE A",a?`+${e.v1} V`:e.replacement==="short"?"0 V · SHORT":"OPEN",-1.18,-.08),Fi("b","SOURCE B",l?`−${e.v2} V`:e.replacement==="short"?"0 V · SHORT":"OPEN",1.18,-.08),nr("r1","R₁","1 kΩ",-.51,-.55),nr("r2","R₂","1 kΩ",.51,-.55),Ar("load","BRANCH","1 kΩ",0,.17),wr()],i=[["a+","r1a"],["r1b","loada"],["r2a","loada"],["r2b","b+"],["a-","gnd"],["b-","gnd"],["loadb","gnd"]],r=[ui("r1",1e3),ui("r2",1e3),ui("load",1e3)],(a||e.replacement==="short")&&r.push(js("a",a?e.v1:0)),(l||e.replacement==="short")&&r.push(js("b",l?-e.v2:0)),s="loada",o="load"}return n==="opamp"&&(t=[Fi("signal","INPUT",`${e.amplitude} Vpk`,-1.18,-.19),nr("rin","Rin",`${e.rin/1e3} kΩ`,-.54,-.5),Xi("op","OP AMP","opamp",`±${e.rail} V`,.15,-.07,[ln("op+","+",-.12,.06),ln("op-","−",-.12,-.22),ln("out","OUT",.55,-.07),ln("vp","V+",.2,-.42),ln("vn","V−",.2,.26)]),nr("rf","Rf",`${e.rf/1e3} kΩ`,.43,.54),Fi("plus","+ SUPPLY",`${e.rail} V`,1.12,-.41),Fi("minus","− SUPPLY",`${e.rail} V`,1.12,.37),wr()],i=[["signal-","gnd"],["rfb","out"],["rfa","op-"],["rinb","op-"],["plus+","vp"],["plus-","gnd"],["minus+","gnd"],["minus-","vn"]],i.push(...e.configuration==="inverting"?[["signal+","rina"],["op+","gnd"]]:[["signal+","op+"],["rina","gnd"]]),s="out"),n==="transient"&&(t=[Fi("s","DC SOURCE","5 V",-1.19,.06),Xi("sw","SPDT SWITCH","switch",e.charging?"SOURCE":"RETURN",-.62,-.39,[ln("supply","5 V",-.83,-.58),ln("common","COM",-.36,-.39),ln("return","0 V",-.75,-.18)]),nr("r","RESISTOR",`${e.resistance} Ω`,.2,-.46),Xi("storage",e.kind==="RC"?"CAPACITOR":"INDUCTOR",e.kind==="RC"?"C":"L",e.kind==="RC"?"100 μF":"100 mH",1.03,.1,[ln("storagea","+",1.03,-.17),ln("storageb","−",1.03,.37)]),wr()],i=[["s+","supply"],["s-","gnd"],["return","gnd"],["common","ra"],["rb","storagea"],["storageb","gnd"]],s="storagea"),{components:t,wires:i,electrical:r,positive:s,negative:"gnd",sensor:o,pins:t.flatMap(a=>a.pins.map(l=>({...l,name:`${a.label} ${l.label}`})))}}function Rs(n,e){const t=Object.fromEntries(e.map(r=>[typeof r=="string"?r:r.id,typeof r=="string"?r:r.id])),i=r=>t[r]===r||t[r]===void 0?r:t[r]=i(t[r]);for(const[r,s]of n)r in t&&s in t&&(t[i(r)]=i(s));return Object.fromEntries(Object.keys(t).map(r=>[r,i(r)]))}function gd(n,e){const t=Rs(n.wires,n.pins),i=Rs(e,n.pins);return n.pins.every(r=>n.pins.every(s=>t[r.id]===t[s.id]==(i[r.id]===i[s.id])))}const Ot={load:[100,250,500,750,1e3,1500,2e3],equivalentVoltage:[2,3,4,5,6,7,8,9,10,12],equivalentResistance:[100,250,500,750,1e3,1500,2e3],nortonCurrent:[4,6,8,10,12,14,16,18,20],v1:[0,1,2,3,4,5,6,7,8,9,10,11,12],v2:[0,1,2,3,4,5,6,7,8,9,10,11,12],rin:[5e3,1e4,2e4],rf:[1e4,2e4,3e4,4e4,5e4,1e5],rail:[5,9,12,15],frequency:[10,50,100,500,1e3],amplitude:[.25,.5,1,2,3,3.5,3.6,3.7,4,5,6],prediction:Array.from({length:101},(n,e)=>e/10),resistance:[100,200,250,500,1e3,2e3,5e3,1e4],speed:[.25,.5,1,2],sumMilliamp:Array.from({length:161},(n,e)=>(e-80)/10),explanation:["unset","opposing","sources-off","whole-circuit-zero"],predictionChoice:["unset","slower","faster","same"],timeDiv:[.02,.05,.1,.2,.4,.5,1,2,4,5,10,20,50],ch1Scale:[.1,.2,.5,1,2,5,10],ch2Scale:[.1,.2,.5,1,2,5,10],triggerLevel:[-10,-5,-2,-1,-.5,0,.5,1,2,5,10],triggerEdge:["rising","falling"]},Cs=(n,e)=>{if(typeof n!="number"||!Number.isFinite(n))throw new RangeError(`${e} must be a finite number.`);return n},fr=(n,e)=>{if(Cs(n,e),n<=0)throw new RangeError(`${e} must be greater than zero.`);return n},Hr=(n,e)=>{if(Cs(n,e),n<0)throw new RangeError(`${e} cannot be negative.`);return n},Ps=n=>Object.is(n,-0)?0:n;function vd(n,e){const t=e.length;if(!t)return[];const i=n.map((l,c)=>{const u=Math.max(...l.map(Math.abs));return u?[...l.map(h=>h/u),e[c]/u]:[...l,e[c]]}),r=1e-12;let s=0;const o=[];for(let l=0;l<t&&s<t;l+=1){let c=s;for(let h=s+1;h<t;h+=1)Math.abs(i[h][l])>Math.abs(i[c][l])&&(c=h);if(Math.abs(i[c][l])<=r)continue;[i[s],i[c]]=[i[c],i[s]];const u=i[s][l];for(let h=l;h<=t;h+=1)i[s][h]/=u;for(let h=s+1;h<t;h+=1){const d=i[h][l];for(let f=l;f<=t;f+=1)i[h][f]-=d*i[s][f];i[h][l]=0}o.push(l),s+=1}for(let l=s;l<t;l+=1)if(i[l].slice(0,t).every(c=>Math.abs(c)<=r)&&Math.abs(i[l][t])>1e-9)throw new Error("Inconsistent circuit: check for a shorted voltage source, conflicting ideal voltage sources, or a current source without a return path.");if(s<t)throw new Error("Singular circuit: connect floating nodes to a reference and remove redundant ideal voltage sources. Voltages or source currents are not uniquely determined.");const a=Array(t).fill(0);for(let l=t-1;l>=0;l-=1){const c=o[l];a[c]=i[l][t];for(let u=c+1;u<t;u+=1)a[c]-=i[l][u]*a[u]}if(a.some(l=>!Number.isFinite(l)))throw new Error("Numerical failure: check component values and circuit connections.");for(let l=0;l<t;l+=1){const c=n[l].reduce((h,d,f)=>h+d*a[f],0),u=Math.abs(e[l])+n[l].reduce((h,d,f)=>h+Math.abs(d*a[f]),0);if(Math.abs(c-e[l])>1e-8*Math.max(u,1e-12))throw new Error("Numerically unstable circuit: use a well-conditioned network with a valid reference.")}return a}function Vl({components:n=[],wires:e=[]}={}){try{if(!Array.isArray(n)||!n.length)throw new Error("Add at least one component to the circuit.");if(!Array.isArray(e))throw new Error("Wires must be an array of pin pairs.");const t=new Map([["gnd","gnd"]]),i=S=>{if(typeof S!="string"||!S.length)throw new Error("Every terminal must have a nonempty string pin name.");return t.has(S)||t.set(S,S),S},r=S=>{let w=S;for(;t.get(w)!==w;)w=t.get(w);for(;t.get(S)!==S;){const R=t.get(S);t.set(S,w),S=R}return w},s=new Set;let o=!1;for(const S of n){if(!S||typeof S.id!="string"||!S.id.length||s.has(S.id))throw new Error("Each component requires a unique, nonempty id.");if(s.add(S.id),!["R","V","I"].includes(S.type))throw new Error(`Unsupported component type: ${S.type}.`);i(S.a),i(S.b),o||(o=S.a==="gnd"||S.b==="gnd"),Cs(S.value,`${S.id} value`),S.type==="R"&&fr(S.value,`${S.id} resistance`)}for(const S of e){if(!Array.isArray(S)||S.length!==2)throw new Error("Each wire must contain exactly two pin names.");const w=i(S[0]),R=i(S[1]);o||(o=w==="gnd"||R==="gnd"),t.set(r(w),r(R))}if(!o)throw new Error("Missing reference: connect the circuit common node to 'gnd'.");const a=r("gnd"),l=[...new Set([...t.keys()].map(r))].filter(S=>S!==a),c=new Map(l.map((S,w)=>[S,w])),u=S=>c.get(r(S)),h=n.filter(S=>S.type==="V"),d=new Map(h.map((S,w)=>[S.id,l.length+w])),f=l.length+h.length,g=Array.from({length:f},()=>Array(f).fill(0)),v=Array(f).fill(0),m=(S,w,R)=>{S!==void 0&&w!==void 0&&(g[S][w]+=R)};for(const S of n){const w=u(S.a),R=u(S.b);if(S.type==="R"){const P=1/S.value;if(!Number.isFinite(P))throw new Error("Resistance is outside the supported numerical range.");m(w,w,P),m(R,R,P),m(w,R,-P),m(R,w,-P)}else if(S.type==="I")w!==void 0&&(v[w]-=S.value),R!==void 0&&(v[R]+=S.value);else{const P=d.get(S.id);m(w,P,1),m(R,P,-1),m(P,w,1),m(P,R,-1),v[P]=S.value}}const p=vd(g,v),x=S=>r(S)===a?0:Ps(p[u(S)]),y=Object.fromEntries([...t.keys()].map(S=>[S,x(S)])),b=Object.fromEntries(n.map(S=>[S.id,Ps(S.type==="R"?(x(S.a)-x(S.b))/S.value:S.type==="I"?S.value:p[d.get(S.id)])]));return{ok:!0,voltages:y,currents:b,error:null}}catch(t){return{ok:!1,voltages:{},currents:{},error:t.message}}}function _d({configuration:n="inverting",rin:e=1e4,rf:t=2e4,amplitude:i=1,rail:r=12,headroom:s=1,frequency:o=100,time:a=0,powered:l=!0,feedback:c=!0}={}){fr(e,"Input resistance"),Hr(t,"Feedback resistance"),Hr(i,"Input amplitude"),Hr(r,"Supply rail magnitude"),Hr(s,"Output headroom"),fr(o,"Frequency"),Hr(a,"Time");let u;if(n==="inverting")u=-t/e;else if(n==="noninverting"||n==="non-inverting")u=1+t/e;else if(n==="follower")u=1;else throw new RangeError("Configuration must be inverting, noninverting, or follower.");const h=i*Math.sin(2*Math.PI*o*a),d=Math.max(0,r-s),f=Math.abs(u)*i,g=n==="inverting"?-1:1;let v=0,m=0,p=!1,x="powered-off";return l&&d>0&&(c?(v=Math.max(-d,Math.min(d,u*h)),m=Math.min(d,f),p=f>d,x=p?"saturated":"linear"):(v=Math.sign(g*h)*d,m=i>0?d:0,p=i>0,x="open-loop")),{gain:u,input:h,output:Ps(v),limit:d,maxInput:c?u===0?1/0:d/Math.abs(u):0,clipped:p,peakOutput:m,modelState:x}}function zn({kind:n="RC",resistance:e=1e3,capacitance:t=1e-4,inductance:i=.1,source:r=5,time:s=0,initial:o=0,charging:a=!0}={}){if(fr(e,"Resistance"),Cs(r,"Source voltage"),Cs(o,"Initial storage value"),Hr(s,"Time"),!["RC","RL"].includes(n))throw new RangeError("Transient kind must be RC or RL.");const l=a?r:0,c=n==="RC"?fr(t,"Capacitance"):fr(i,"Inductance"),u=n==="RC"?e*c:c/e;fr(u,"Time constant");const h=n==="RC"?l:l/e,d=h+(o-h)*Math.exp(-s/u),f=n==="RC"?d:l-e*d,g=n==="RC"?(l-d)/e:d;return{tau:u,voltage:Ps(f),current:Ps(g),energy:.5*c*d*d,final:h,storageValue:d}}const Bt=(n,e=3)=>Number.isFinite(n)?Number(n.toFixed(e)).toLocaleString("en-US",{maximumFractionDigits:e}):"—",ir=(n,e,t=.01)=>Number.isFinite(n)&&Math.abs(n-e)<=Math.max(Math.abs(e)*t,1e-8);function xd(){return{module:"thevenin",mode:"explore",params:Object.fromEntries(Object.entries(En).map(([n,e])=>[n,{...e.defaults}])),wireSets:{},probeSets:{},scopeSets:{},scopeHolds:{},history:{},predictions:{},sumSubmissions:{},tool:"wire",selectedTerminal:null,records:[],attempts:Object.fromEntries(Object.keys(En).map(n=>[n,0])),challengeStarted:{},feedback:"Drag a lead between contacts; place the meter tips to measure.",checks:{},showGuide:!1,sequence:0}}const ct=n=>n.params[n.module];function bd(n){const e=ct(n);return e.representation||e.configuration||e.kind||"main"}const Pn=n=>`${n.mode}:${n.module}:${bd(n)}`;function Dt(n){const e=zl(n.module,ct(n)),t=Pn(n);return n.wireSets[t]||(n.wireSets[t]=n.mode==="explore"?e.wires.map(i=>[...i]):[]),n.probeSets[t]||(n.probeSets[t]=n.mode==="explore"?{red:e.positive,black:"gnd"}:{red:null,black:null}),n.scopeSets[t]||(n.scopeSets[t]=Wa(n)),{circuit:e,wires:n.wireSets[t],probes:n.probeSets[t],scope:n.scopeSets[t],correct:gd(e,n.wireSets[t])}}const ii=n=>structuredClone(n);function Wa(n){const e=n.mode==="explore"&&n.module==="opamp";return{ch1:{signal:e?"signal+":null,ground:e?"gnd":null},ch2:{signal:e?"out":null,ground:e?"gnd":null}}}const Ls=new WeakMap,ah=n=>({wires:ii(n.wires),probes:ii(n.probes),scope:ii(n.scope)});function lh(n,e,t){var i;((i=n.history)[e]||(i[e]=[])).push(t),n.history[e].length>80&&n.history[e].splice(0,n.history[e].length-80)}function yd(n,e){if(e==null)return!1;let t=Ls.get(n);if(t||(t=new Map,Ls.set(n,t)),[...t.values()].some(o=>o.tokens.has(e)))return!1;const i=Dt(n),r=Pn(n);let s=t.get(r);return s||(s={tokens:new Set,snapshot:ah(i)},t.set(r,s)),s.tokens.add(e),!0}function Md(n,e){const t=Ls.get(n);if(!t)return!1;const i=[...t.entries()].find(([,a])=>a.tokens.has(e));if(!i)return!1;const[r,s]=i;if(s.tokens.delete(e),s.tokens.size||(t.delete(r),t.size||Ls.delete(n),!n.wireSets[r]||!n.probeSets[r]||!n.scopeSets[r]))return!0;const o={wires:n.wireSets[r],probes:n.probeSets[r],scope:n.scopeSets[r]};return JSON.stringify(s.snapshot)!==JSON.stringify(o)&&lh(n,r,s.snapshot),!0}function Qr(n){var i;const e=Dt(n),t=Pn(n);(i=Ls.get(n))!=null&&i.has(t)||lh(n,t,ah(e))}const Vo=(n,e=ct(n).kind)=>`${n.mode}:${n.attempts.transient}:${e}`;function Sn(n,e=ct(n).kind){return n.predictions[Vo(n,e)]||{choice:"unset",locked:!1,late:!1,correct:!1,run:0,tested:!1}}function Pi(n){var t;if(n.module!=="transient")return;const e=Vo(n);n.predictions[e]={...Sn(n),tested:!0,late:!((t=n.predictions[e])!=null&&t.locked)}}function Sd(n){if(n.module!=="transient")return!1;const e=ct(n),t=Sn(n);return t.locked?(n.feedback="Prediction already locked for this circuit.",!1):t.late?(n.feedback="The trial has already started. Begin a new attempt to make a prediction first.",!1):["slower","faster","same"].includes(e.predictionChoice)?(n.predictions[Vo(n)]={choice:e.predictionChoice,locked:!0,late:!1,tested:!1,run:t.run,correct:e.predictionChoice===(e.kind==="RC"?"slower":"faster"),kind:e.kind,resistance:e.resistance,sequence:++n.sequence},n.feedback="Prediction saved. Now change R and test it.",!0):(n.feedback="Choose slower, faster or unchanged, then lock your prediction.",!1)}const ch=(n,e,t)=>`${n.mode}:${n.attempts.superposition}:${e}:${t}`;function Ed(n,e=n.module){return n.records.filter(t=>t.module===e&&t.mode===n.mode&&t.attempt===n.attempts[e]&&t.measurement.correct&&t.measurement.probesCorrect)}function uh(n,e=n.params.superposition.v1,t=n.params.superposition.v2){const i=Ed(n,"superposition").filter(r=>r.params.v1===e&&r.params.v2===t&&(r.params.sourceMode==="both"||r.params.replacement==="short"));return Object.fromEntries(["a","b","both"].map(r=>[r,i.find(s=>s.params.sourceMode===r)||null]))}function Td(n){if(n.module!=="superposition")return!1;const e=ct(n),t=uh(n);if(!t.a||!t.b||!t.both)return n.feedback="Record A alone, B alone and both at the same source settings first.",!1;if(!Number.isFinite(e.sumMilliamp))return n.feedback="Enter the signed sum in mA.",!1;const i=(t.a.measurement.current+t.b.measurement.current)*1e3,r=t.both.measurement.current*1e3,s=Math.abs(e.sumMilliamp-i)<=.01&&Math.abs(e.sumMilliamp-r)<=.01;return n.sumSubmissions[ch(n,e.v1,e.v2)]={answerMilliamp:e.sumMilliamp,sumMilliamp:i,measuredMilliamp:r,passed:s,v1:e.v1,v2:e.v2,recordIds:Object.fromEntries(Object.entries(t).map(([o,a])=>[o,a.id])),sequence:++n.sequence},n.feedback=s?"The signed sum matches the measured current with both sources.":"Check the signs. Add currents, then compare with the both-source reading.",s}function hh(n){const e=ct(n),{wires:t,correct:i}=Dt(n),r=Object.fromEntries(["a","b","both"].map(a=>{const l=zl("superposition",{...e,sourceMode:a}),c=Vl({components:l.electrical,wires:t});if(!c.ok)return[a,{valid:!1,current:null,voltage:null,power:null,error:c.error}];const u=c.voltages[l.positive]-c.voltages.loadb,h=c.currents.load;return[a,{valid:!0,current:h,voltage:u,power:u*h,branchCurrents:{r1:c.currents.r1,r2:c.currents.r2,load:h},error:null}]})),s=Object.values(r).every(a=>a.valid),o=[...new Set(Object.values(r).map(a=>a.error).filter(Boolean))];return i||o.push("Current wiring differs from the circuit diagram."),e.replacement!=="short"&&o.push("Open replacements do not give additive contributions. Select Short."),{live:r,valid:s,topologyCorrect:i,superpositionValid:s&&e.replacement==="short",error:o.join(" ")||null}}function Hl(n){const e=ct(n);if(n.module==="superposition"){const t=uh(n),i=n.sumSubmissions[ch(n,e.v1,e.v2)]||null;return{kind:"superposition",...hh(n),recorded:Object.fromEntries(Object.entries(t).map(([r,s])=>[r,s?{id:s.id,current:s.measurement.current,voltage:s.measurement.voltage,power:s.measurement.power}:null])),sumMilliamp:e.sumMilliamp,explanation:e.explanation,sumSubmitted:!!i,submission:i}}return n.module==="transient"?{kind:"transient",prediction:{...Sn(n),choice:Sn(n).locked?Sn(n).choice:e.predictionChoice,expected:Sn(n).tested?e.kind==="RC"?"slower":"faster":null},predictions:{RC:Sn(n,"RC"),RL:Sn(n,"RL")},playback:{speed:e.speed,baselineTau:e.kind==="RC"?.1:.001,secondsPerBaselineTau:2}}:n.module==="opamp"?{kind:"opamp",scope:Ui(n)}:{kind:n.module}}function wd(n,e){const t=n.params.transient;if(n.module!=="transient"||!t.playing||!Number.isFinite(e)||e<=0||!Dt(n).correct)return t.time;Pi(n);const i=t.kind==="RC"?.1:.001;return t.time=Math.min(t.time+e*i*t.speed/2,5*zn({...t,source:5}).tau),t.acquiredTime=Math.max(t.acquiredTime||0,t.time),t.time>=5*zn({...t,source:5}).tau&&(t.playing=!1),t.time}function Ic(n,e,t){const i=Rs(e,n.pins),r={};for(const[s,o]of Object.entries(t))for(const[a,l]of Object.entries(i))l===i[s]&&(r[a]=o);return r}function ji(n,e){const t=ct(n),{circuit:i,wires:r,probes:s,correct:o}=Dt(n);let a,l={},c,u,h,d,f,g,v,m,p;if(n.module==="thevenin"||n.module==="superposition")a=Vl({components:i.electrical,wires:r}),l=a.voltages||{},a.ok&&(c=l[i.positive]-l.loadb,u=a.currents.load,h=c*u);else if(n.module==="opamp")if(!o)a={ok:!1,error:"Connect the amplifier, feedback and both supplies."};else{a={..._d({...t,headroom:1,time:e??1/(4*t.frequency)}),ok:!0},{gain:d,maxInput:g}=a,f=a.peakOutput;const w=t.configuration==="inverting"?(a.input/t.rin+a.output/t.rf)/(1/t.rin+1/t.rf):a.output*t.rin/(t.rin+t.rf);l=Ic(i,r,{gnd:0,"signal+":a.input,out:a.output,"op-":w,vp:t.rail,vn:-t.rail}),c=a.output}else o?(a={...zn({...t,source:5,time:e??t.time}),ok:!0},{voltage:c,current:u,tau:v,energy:m,storageValue:p}=a,l=Ic(i,r,{gnd:0,"s+":5,common:t.charging?5:0,storagea:c})):a={ok:!1,error:"Connect the source, switch, resistor and storage loop."};const x=a.ok&&s.red&&s.black&&Number.isFinite(l[s.red])&&Number.isFinite(l[s.black]),y=x?l[s.red]-l[s.black]:null,b=Rs(r,i.pins),S=!!x&&b[s.red]===b[i.positive]&&b[s.black]===b[i.negative];return{...a,voltage:c,current:u,power:h,gain:d,peak:f,maxInput:g,tau:v,energy:m,storageValue:p,voltages:l,probeVoltage:y,probeReady:x,probesCorrect:S,correct:o}}const Uc=new WeakMap;function Ad(n){const e=ct(n),t=Dt(n);return JSON.stringify({configuration:e.configuration,rin:e.rin,rf:e.rf,amplitude:e.amplitude,rail:e.rail,frequency:e.frequency,timeDiv:e.timeDiv,ch1Scale:e.ch1Scale,ch2Scale:e.ch2Scale,triggerEdge:e.triggerEdge,triggerLevel:e.triggerLevel,wires:t.wires,scope:t.scope})}function Ui(n){if(n.module!=="opamp")return{ok:!1,correct:!1,error:"The scope is available in the amplifier lab.",channels:{},running:!1,stale:!1};const e=ct(n),t=Dt(n),i=Ad(n),r=n.scopeHolds[Pn(n)];if(!e.scopeRunning&&r){const y=r.signature!==i;return{...ii(r),running:!1,stale:y,correct:r.correct&&!y,error:y?"Held trace is from different settings. Run the scope to acquire the current circuit.":r.error}}const s=Uc.get(n);if((s==null?void 0:s.signature)===i)return{...s,running:e.scopeRunning};const o=ji(n,0),a=Rs(t.wires,t.circuit.pins),l=Object.fromEntries(["ch1","ch2"].map(y=>{const b=t.scope[y],S=b.signal,w=b.ground,R=!!(o.ok&&S&&w&&Number.isFinite(o.voltages[S])&&Number.isFinite(o.voltages[w])&&a[w]===a.gnd),P=y==="ch1"?"signal+":"out",T=R&&a[S]===a[P],E=o.ok?!S||!w?`${y.toUpperCase()}: connect signal and ground.`:a[w]!==a.gnd?`${y.toUpperCase()} ground must connect to GND.`:Number.isFinite(o.voltages[S])?null:`${y.toUpperCase()}: signal is floating or unavailable.`:o.error;return[y,{signal:S,ground:w,valid:R,correct:T,error:E,scale:e[`${y}Scale`],points:[]}]})),c=(y,b)=>y.voltages[l[b].signal]-y.voltages[l[b].ground],u=1/e.frequency,h={edge:e.triggerEdge,level:e.triggerLevel,found:!1,time:0};if(l.ch1.valid){let y=c(o,"ch1");for(let b=1;b<=200;b++){const S=b*u/200,w=c(ji(n,S),"ch1"),R=y<=e.triggerLevel&&w>e.triggerLevel,P=y>=e.triggerLevel&&w<e.triggerLevel;if(e.triggerEdge==="rising"&&R||e.triggerEdge==="falling"&&P){const T=(e.triggerLevel-y)/(w-y);h.found=!0,h.time=(b-1+T)*u/200;break}y=w}}const d=e.timeDiv*10/1e3,f=d>u*20*1.000001,g=Math.max(200,Math.ceil(d/u*64));for(let y=0;!f&&y<=g&&!(!l.ch1.valid&&!l.ch2.valid);y++){const b=y*d/g,S=ji(n,b+h.time);for(const w of["ch1","ch2"])l[w].valid&&l[w].points.push([b*1e3,c(S,w)])}for(const y of["ch1","ch2"]){const b=l[y];b.peak=b.points.length?Math.max(...b.points.map(([,S])=>Math.abs(S))):null,b.cropped=b.valid&&b.peak>b.scale*4*1.001}const v=!f&&l.ch1.correct&&l.ch2.correct&&!l.ch1.cropped&&!l.ch2.cropped&&h.found&&d>=u*.999,p=[...new Set(Object.values(l).map(y=>y.error).filter(Boolean))].join(" ")||(f?"Timebase exceeds 20 periods. Reduce ms/div or use Autoscale to avoid undersampling.":h.found?l.ch1.cropped||l.ch2.cropped?"A trace exceeds the display. Increase V/div or use Autoscale.":d<u?"Increase time/div to show a complete period.":null:"Waiting for the selected CH1 trigger crossing."),x={ok:!f&&(l.ch1.valid||l.ch2.valid),correct:v,error:p,channels:l,timeDiv:e.timeDiv,trigger:h,running:e.scopeRunning,stale:!1,signature:i,timebaseTooWide:f,acquisition:{params:ii(e),wires:ii(t.wires),scope:ii(t.scope),sequence:n.sequence},duration:d,clipped:o.clipped,limits:[-e.rail+1,e.rail-1]};return Uc.set(n,x),x}function es(n,e,t){var s;const i=Dt(n);if(t!==null&&!i.circuit.pins.some(o=>o.id===t)||!["red","black","ch1","ch2","ch1Ground","ch2Ground"].includes(e)||!["red","black"].includes(e)&&n.module!=="opamp")return!1;if(Qr(n),e==="red"||e==="black")i.probes[e]=t;else{const o=e.startsWith("ch1")?"ch1":"ch2";i.scope[o][e.endsWith("Ground")?"ground":"signal"]=t}const r=((s=i.circuit.pins.find(o=>o.id===t))==null?void 0:s.name)||"disconnected";return n.feedback=`${e==="red"?"Meter V tip":e==="black"?"Meter COM tip":e}: ${r}.`,n.selectedTerminal=null,n.checks[n.module]=null,n.sequence++,!0}function Nc(n,e,t,i){const r=Dt(n);if(!Number.isInteger(e)||e<0||e>=r.wires.length||![0,1].includes(t)||i!==null&&!r.circuit.pins.some(l=>l.id===i))return!1;const s=r.wires[e],o=[...s];if(o[t]=i,i!==null&&(i===s[t]||o[0]===o[1]||r.wires.some(([l,c],u)=>u!==e&&(l===o[0]&&c===o[1]||l===o[1]&&c===o[0]))))return!1;Qr(n),i===null?r.wires.splice(e,1):r.wires[e]=o,n.selectedTerminal=null,n.checks[n.module]=null,n.module==="transient"&&(n.params.transient.playing=!1),n.sequence++;const a=l=>{var c;return((c=r.circuit.pins.find(u=>u.id===l))==null?void 0:c.name)||l};return n.feedback=i===null?`Removed lead from ${a(s[0])} to ${a(s[1])}.`:`Lead connected from ${a(o[0])} to ${a(o[1])}.`,!0}function Gl(n,e){if(n.tool!=="remove")return n.feedback="Choose Remove before selecting a lead.",!1;const t=Dt(n);if(!Number.isInteger(e)||e<0||e>=t.wires.length)return!1;Qr(n);const[i,r]=t.wires.splice(e,1)[0],s=o=>{var a;return((a=t.circuit.pins.find(l=>l.id===o))==null?void 0:a.name)||o};return n.feedback=`Removed ${s(i)} → ${s(r)}.`,n.selectedTerminal=null,n.checks[n.module]=null,n.sequence++,!0}function ri(n,e,t){const i=ct(n),r=["load","equivalentResistance","rin","rf","rail","frequency","resistance","capacitance","inductance","timeDiv","ch1Scale","ch2Scale","speed"],s=["amplitude","v1","v2","time","prediction"];if([...r,...s,"equivalentVoltage","nortonCurrent","triggerLevel","sumMilliamp","initial"].includes(e)&&!(e==="sumMilliamp"&&t===null)&&(!Number.isFinite(t)||r.includes(e)&&t<=0||s.includes(e)&&t<0))return n.feedback=`Enter a valid ${e} value.`,!1;if(e==="predictionChoice"&&n.module==="transient"&&Sn(n).locked)return n.feedback="Prediction is locked. Use Retry prediction to start a fresh comparison.",!1;if(n.module==="transient"&&e==="resistance"&&t!==i.resistance){t!==i.resistance&&Pi(n);const a=zn({...i,source:5});i.initial=a.storageValue,i.time=0,i.acquiredTime=0}return i[e]=t,n.module==="transient"&&e==="time"&&(t>0&&Pi(n),Dt(n).correct&&(i.acquiredTime=Math.max(i.acquiredTime||0,t))),e==="kind"&&(i.resistance=t==="RC"?1e3:100,i.initial=0,i.time=0,i.acquiredTime=0,i.playing=!1,i.charging=!0,i.predictionChoice=Sn(n,t).choice),["representation","configuration","kind"].includes(e)&&(n.selectedTerminal=null,Dt(n)),n.checks[n.module]=null,n.sequence++,!0}function Rd(n,e){En[e]&&(n.params.transient.playing=!1,n.module=e,n.selectedTerminal=null,n.tool="wire",n.mode==="challenge"&&Wl(n),Dt(n),n.feedback=En[e].principle,n.sequence++)}function Cd(n,e){n.mode=e,n.selectedTerminal=null,n.tool="wire",n.params.transient.playing=!1,e==="challenge"&&Wl(n),Dt(n),n.feedback=e!=="explore"?"Connect the circuit with patch leads, then place the probes. Use the circuit diagram as a guide.":"Explore the connected circuit. Change a setting and observe the result.",n.sequence++}function Wl(n){n.challengeStarted[n.module]||(n.challengeStarted[n.module]=!0,n.params[n.module]={...En[n.module].defaults},n.module==="thevenin"&&Object.assign(n.params.thevenin,{equivalentVoltage:4,equivalentResistance:750,nortonCurrent:8}))}function Es(n,e){var r;const{circuit:t,wires:i}=Dt(n);if(t.pins.some(s=>s.id===e)){if(["red","black","ch1","ch2"].includes(n.tool)){es(n,n.tool,e);return}if(n.tool==="scopeGround"){es(n,`${ct(n).scopeGroundChannel||"ch1"}Ground`,e);return}if(n.tool==="remove"){n.feedback="Select a lead to remove it.";return}if(n.tool==="select"){n.selectedTerminal=e,n.feedback=t.pins.find(s=>s.id===e).name;return}if(!n.selectedTerminal)n.selectedTerminal=e,n.feedback=`${t.pins.find(s=>s.id===e).name} selected. Choose the other terminal.`;else{const s=n.selectedTerminal;n.selectedTerminal!==e&&!i.some(([o,a])=>o===e&&a===n.selectedTerminal||o===n.selectedTerminal&&a===e)&&(Qr(n),i.push([n.selectedTerminal,e])),n.selectedTerminal=null,n.feedback=s===e?"Connection cancelled.":`${(r=t.pins.find(o=>o.id===s))==null?void 0:r.name} → ${t.pins.find(o=>o.id===e).name}.`}n.checks[n.module]=null,n.sequence++}}function Pd(n){n.module==="transient"&&Pi(n);const e=ji(n),t=ct(n);if(!e.ok)return n.feedback=e.error||"Complete a valid circuit before recording.",!1;const i=n.module==="opamp"?Ui(n):null;return n.module==="opamp"&&!i.ok?(n.feedback=i.error||"Connect the scope signals and grounds first.",!1):n.module!=="opamp"&&!e.probeReady?(n.feedback="Connect both voltage probes before recording a measurement.",!1):(n.records.unshift({id:++n.sequence,module:n.module,mode:n.mode,attempt:n.attempts[n.module],when:new Date().toISOString(),params:JSON.parse(JSON.stringify(t)),measurement:JSON.parse(JSON.stringify(e)),wires:Dt(n).wires.map(r=>[...r]),probes:{...Dt(n).probes},scope:i?ii(i):null,prediction:n.module==="transient"?ii(Sn(n)):null,activity:n.module==="superposition"||n.module==="transient"?ii(Hl(n)):null}),n.feedback=`Reading ${n.records.length} saved to your notebook${i?i.correct?"":`. ${i.error||"Check CH1 at Vin and CH2 at Vout, with both grounds at GND"}`:e.probesCorrect?"":". Check the probe locations: these are not across the requested output"}.`,!0)}function Ld(n){const e=ji(n),t=ct(n),i=n.records.filter(o=>{var a;return o.module===n.module&&o.mode==="challenge"&&o.attempt===n.attempts[n.module]&&o.measurement.correct&&(n.module==="opamp"?((a=o.scope)==null?void 0:a.correct)&&!o.scope.stale:o.measurement.probesCorrect)});let r=[];if(n.module==="thevenin"){for(const o of["original","thevenin","norton"])r.push({label:`${o==="original"?"Original":o==="thevenin"?"Thévenin":"Norton"} verified at 250, 500 and 1000 Ω`,pass:[250,500,1e3].every(a=>i.some(l=>l.params.representation===o&&l.params.load===a&&ir(l.measurement.voltage,6*a/(500+a))))});r.push({label:"Maximum power verified at 500 Ω (18 mW)",pass:i.some(o=>o.params.load===500&&ir(o.measurement.power,.018))&&t.load===500&&e.correct&&ir(e.power,.018)})}else if(n.module==="superposition"){for(const l of["both","a","b"])r.push({label:`Baseline recorded: ${l==="both"?"both sources":l==="a"?"A alone, B shorted":"B alone, A shorted"}`,pass:i.some(c=>c.params.v1===6&&c.params.v2===3&&c.params.sourceMode===l&&(l==="both"||c.params.replacement==="short")&&ir(c.measurement.current,l==="both"?.001:l==="a"?.002:-.001))});r.push({label:"Both nonzero sources active with zero branch current",pass:i.some(l=>l.params.sourceMode==="both"&&l.params.v1>0&&l.params.v2>0&&Math.abs(l.measurement.current)<1e-7)});const o=n.sumSubmissions[`challenge:${n.attempts.superposition}:6:3`];r.push({label:"Submitted the signed sum of measured A and B currents at +6 V / −3 V",pass:!!(o!=null&&o.passed)});const a=i.find(l=>l.params.sourceMode==="both"&&l.params.v1>0&&l.params.v2>0&&Math.abs(l.measurement.current)<1e-7&&["a","b"].every(c=>i.some(u=>u.params.sourceMode===c&&u.params.replacement==="short"&&u.params.v1===l.params.v1&&u.params.v2===l.params.v2)));r.push({label:"Cancellation verified with each source's signed contribution",pass:!!a}),r.push({label:"Explained cancellation: equal and opposite branch contributions; current can flow elsewhere",pass:!!a&&t.explanation==="opposing"})}else if(n.module==="opamp"){const o=i.filter(a=>a.params.configuration==="inverting"&&a.params.rail===12&&a.params.frequency===100&&ir(a.measurement.gain,-3));r=[{label:"Gain −3 at ±12 V and 100 Hz with correct wiring",pass:e.correct&&t.configuration==="inverting"&&t.rail===12&&t.frequency===100&&ir(e.gain,-3)},{label:"Recorded an unclipped waveform at the target settings",pass:o.some(a=>!a.measurement.clipped)},{label:"Recorded a clipped waveform at the target settings",pass:o.some(a=>a.measurement.clipped)},{label:"Predicted the maximum input within 0.1 V of 11/3 Vpk",pass:Math.abs(t.prediction-11/3)<=.1},{label:"Scope channels measure Vin and Vout with grounded references",pass:Ui(n).channels.ch1.correct&&Ui(n).channels.ch2.correct}]}else{for(const o of["RC","RL"])for(const[a,l]of[["baseline",o==="RC"?1e3:100],["half time constant",o==="RC"?500:200]])r.push({label:`${o}: ${a}, measured at one τ`,pass:i.some(c=>{var u;return c.params.kind===o&&c.params.resistance===l&&c.params.charging&&Math.abs(c.params.initial)<1e-9&&((u=c.prediction)==null?void 0:u.locked)&&!c.prediction.late&&c.prediction.run===Sn(n,o).run&&c.prediction.sequence<c.id&&ir(c.params.time,c.measurement.tau,.02)})});for(const o of["RC","RL"])r.push({label:`${o}: predicted the effect of increasing R before testing`,pass:Sn(n,o).locked&&!Sn(n,o).late&&Sn(n,o).correct})}n.checks[n.module]=r;const s=r.filter(o=>o.pass).length;return n.feedback=s===r.length?"All checks passed. Add your explanation to the exported notebook for instructor review.":`${s} of ${r.length} checks passed. Review the remaining items below.`,r}function dh(n,e){var t;if(e.startsWith("scrub:")&&n.module==="transient"){const i=Number(e.slice(6));if(!Number.isFinite(i)||!Dt(n).correct)return!1;const r=ct(n);return r.time=Math.max(0,Math.min(i/1e3,r.acquiredTime||0)),r.playing=!1,n.sequence++,n.feedback=`Trace cursor at ${Bt(r.time*1e3)} ms. Run to continue the response.`,!0}if(e.startsWith("probe:")){const[,i,r]=e.split(":");return es(n,i,r||null)}if(e.startsWith("remove-wire:"))return Gl(n,Number(e.split(":")[1]));if(e.startsWith("scope-ground:")){const i=e.split(":")[1];n.module==="opamp"&&["ch1","ch2"].includes(i)&&(ct(n).scopeGroundChannel=i,n.tool="scopeGround",n.selectedTerminal=null,n.feedback=`Place ${i.toUpperCase()} ground at GND.`);return}if(e==="cancel"){n.selectedTerminal=null,n.feedback="Selection cancelled.";return}if(e==="undo"){const i=(t=n.history[Pn(n)])==null?void 0:t.pop();if(!i){n.feedback="No wiring or probe change to undo.";return}n.wireSets[Pn(n)]=i.wires,n.probeSets[Pn(n)]=i.probes,n.scopeSets[Pn(n)]=i.scope,n.selectedTerminal=null,n.checks[n.module]=null,n.sequence++,n.feedback="Last wiring or probe change undone.";return}if(e==="submit-sum")return Td(n);if(e==="lock-prediction")return Sd(n);if(e==="restart-prediction"&&n.module==="transient"){const i=ct(n),r=Sn(n).run+1;n.predictions[Vo(n)]={choice:"unset",locked:!1,late:!1,tested:!1,correct:!1,run:r},Object.assign(i,{resistance:i.kind==="RC"?1e3:100,time:0,initial:0,acquiredTime:0,charging:!0,playing:!1,predictionChoice:"unset"}),n.checks.transient=null,n.sequence++,n.feedback="New prediction for this circuit. Earlier readings stay in the notebook but do not count for this comparison.";return}if(e==="scope-toggle"&&n.module==="opamp"){const i=ct(n);i.scopeRunning&&(n.scopeHolds[Pn(n)]=ii(Ui(n))),i.scopeRunning=!i.scopeRunning,n.sequence++,n.feedback=i.scopeRunning?"Scope running.":"Scope held. Measurements retain their acquisition settings.";return}if(e==="scope-autoscale"&&n.module==="opamp"){const i=ct(n);i.scopeRunning=!0,i.timeDiv=200/i.frequency;const r=Ui(n);for(const s of["ch1","ch2"]){const o=(r.channels[s].peak||0)*1.15/4;i[`${s}Scale`]=Ot[`${s}Scale`].find(a=>a>=o)||Math.max(10,o)}n.sequence++,n.feedback=r.ok?"Two periods fitted to the scope. Adjust the trigger if needed.":r.error;return}if(e.startsWith("module:")){Rd(n,e.slice(7));return}if(e.startsWith("set:")){const[,i,r]=e.split(":");ri(n,i,r==="true"?!0:r==="false"?!1:Number.isNaN(Number(r))?r:Number(r));return}if(e.startsWith("adjust:")){const[,i,r]=e.split(":"),s=Number(r),o=ct(n),a=n.module==="superposition"&&i==="sumMilliamp"||n.module==="opamp"&&i==="prediction",l=o[i]===null?0:o[i];if(!a||r===""||!Number.isFinite(s)||!Number.isFinite(l))return n.feedback="Choose a valid numeric answer adjustment.",!1;const c=Ot[i],u=Math.min(...c),h=Math.max(...c);return ri(n,i,Number(Math.min(h,Math.max(u,l+s)).toFixed(6)))}if(e.startsWith("cycle:")){const[,i,r="1"]=e.split(":"),s=ct(n),o=Ot[i];if(o&&i in s&&Number.isFinite(Number(r))&&Number(r)!==0){const a=Math.sign(Number(r));if(o.every(l=>typeof l=="number")){const l=s[i]===null?0:s[i];if(!Number.isFinite(l))return!1;const c=a>0?o.find(u=>u>l+1e-10)??o.at(-1):[...o].reverse().find(u=>u<l-1e-10)??o[0];ri(n,i,c)}else{const l=Math.max(0,o.indexOf(s[i]));ri(n,i,o[(l+a+o.length)%o.length])}}return}if(e.startsWith("tool:")){n.tool=e.slice(5),n.selectedTerminal=null,n.feedback=n.tool==="remove"?"Select a lead to remove it.":n.tool==="select"?"Select a component or terminal.":`${n.tool==="wire"?"Patch lead":n.tool==="red"?"Meter V tip":n.tool==="black"?"Meter COM tip":n.tool+" probe"} selected. Choose a terminal on the bench.`;return}if(e==="explore"||e==="build"||e==="challenge"){Cd(n,e);return}if(e==="record"){Pd(n);return}if(e==="check"){Ld(n);return}if(e==="check-wiring"){n.feedback=Dt(n).correct?"The terminal connections match the reference circuit. Now connect the probes and take a reading.":"The wiring does not yet match the reference circuit. Use Schematic to compare connections; open and shorted paths change the result.";return}if(e==="clear"||e==="reset-circuit"){Qr(n),n.wireSets[Pn(n)]=[],n.probeSets[Pn(n)]={red:null,black:null},n.scopeSets[Pn(n)]=Wa({...n,mode:"challenge"}),n.selectedTerminal=null,n.params.transient.playing=!1,n.feedback="Leads and probes cleared. Select two terminals to add each connection.";return}if(e==="restore"){if(n.mode!=="explore"){n.feedback="Connect the circuit with patch leads, or switch to Explore to use the connected circuit.";return}const i=zl(n.module,ct(n));Qr(n),n.wireSets[Pn(n)]=i.wires.map(r=>[...r]),n.probeSets[Pn(n)]={red:i.positive,black:"gnd"},n.scopeSets[Pn(n)]=Wa(n),n.feedback="Reference circuit connected.";return}if(e==="reset-attempt"){n.attempts[n.module]++;for(const i of Object.keys(n.wireSets))i.startsWith(`challenge:${n.module}:`)&&(delete n.wireSets[i],delete n.probeSets[i],delete n.scopeSets[i],delete n.scopeHolds[i],delete n.history[i]);n.challengeStarted[n.module]=!1,n.selectedTerminal=null,n.mode==="challenge"&&Wl(n),n.checks[n.module]=null,n.feedback="A new challenge attempt has started. Earlier readings remain in the notebook.",Dt(n);return}if(n.module==="transient"){const i=ct(n);if(e==="play"){if(!Dt(n).correct){n.feedback="Complete the circuit before running the transient.";return}i.playing=!i.playing,i.playing&&Pi(n)}e==="switch"&&(Pi(n),i.initial=zn({...i,source:5}).storageValue,i.time=0,i.acquiredTime=0,i.charging=!i.charging,n.feedback=i.charging?"Switch connected to the 5 V source. Stored state is preserved.":"Switch connected to the closed return loop. Stored state is preserved."),e==="replay"&&(Dt(n).correct&&Pi(n),i.time=0,i.acquiredTime=0,i.playing=Dt(n).correct,n.feedback="Replaying this switching segment from its stored initial condition."),e==="reset-energy"&&(i.initial=0,i.time=0,i.acquiredTime=0,i.charging=!0,i.playing=!1,n.feedback="New experiment: initial stored energy set to zero."),e==="one-tau"&&(Pi(n),i.time=zn({...i,source:5}).tau,Dt(n).correct&&(i.acquiredTime=Math.max(i.acquiredTime||0,i.time)),i.playing=!1),e==="five-tau"&&(Pi(n),i.time=zn({...i,source:5}).tau*5,Dt(n).correct&&(i.acquiredTime=Math.max(i.acquiredTime||0,i.time)),i.playing=!1)}n.sequence++}function Dd(n){const e=ji(n),t=e.ok,i={label:"Voltmeter",value:e.probeReady?Bt(e.probeVoltage):"—",unit:"V",detail:e.probeReady?"V tip − COM tip":"Place both probes"};return n.module==="opamp"?[{...i,label:"Voltage sample",detail:`At input +peak · ${Bt(250/ct(n).frequency)} ms · V tip − COM tip`},{label:"Linear gain",value:t?Bt(e.gain):"—",unit:"V/V",detail:t?e.clipped?"Output is clipping":"Within output limits":"Connect feedback & supplies"},{label:"Output peak",value:t?Bt(e.peak):"—",unit:"Vpk",detail:`Teaching model: ±${ct(n).rail-1} V limit`}]:n.module==="transient"?[i,{label:"Storage current",value:t?Bt(e.current*1e3):"—",unit:"mA",detail:"Fixed sensor · top → ground"},{label:"Stored energy",value:t?Bt(e.energy*1e3,4):"—",unit:"mJ",detail:t?`τ = ${Bt(e.tau*1e3)} ms`:"Complete the storage loop"}]:[i,{label:"Branch current",value:t?Bt(e.current*1e3):"—",unit:"mA",detail:"Fixed sensor · top → ground"},{label:"Load power",value:t?Bt(e.power*1e3):"—",unit:"mW",detail:"Computed from V × I"}]}const Oc=new WeakMap;function Ho(n){const e=ct(n),t=ji(n);if(n.module==="thevenin"){const{circuit:l,wires:c,correct:u}=Dt(n),h=Math.max(2e3,e.load),d=[...new Set([...Array.from({length:100},(p,x)=>(x+1)*h/100),...Ot.load.filter(p=>p<=h),e.load])].sort((p,x)=>p-x),f=JSON.stringify([l.electrical,c,e.load]),g=Oc.get(n),v=(g==null?void 0:g.signature)===f?g.points:[];if((g==null?void 0:g.signature)!==f&&t.ok)for(const p of d){const x=Vl({components:l.electrical.map(y=>y.id==="load"?{...y,value:p}:y),wires:c});x.ok&&v.push([p,(x.voltages.loada-x.voltages.loadb)*x.currents.load*1e3])}(g==null?void 0:g.signature)!==f&&Oc.set(n,{signature:f,points:v});const m=v.reduce((p,[x,y])=>!p||y>p.y?{x,y}:p,null);return{title:"Load power sweep",subtitle:t.ok?`Calculated sweep · current wiring${u?"":" differs from the diagram"} · select a load to test it`:t.error,series:v.length?[{name:"Calculated load power",color:"#17788d",unit:"mW",points:v}]:[],interaction:"load",calculated:!0,valid:t.ok,error:t.ok?null:t.error,xMax:h,yMin:0,yMax:Math.max((m==null?void 0:m.y)||0,.001)*1.12,xLabel:"Load resistance (Ω)",yLabel:"Power (mW)",xUnit:"Ω",yUnit:"mW",peak:m,marker:t.ok?{x:e.load,y:t.power*1e3}:null}}if(n.module==="superposition"){const l=hh(n),c=l.live;return{title:l.superpositionValid?"Signed source contributions":"Source states",interaction:"source",calculated:!0,subtitle:l.error||"Calculated from current wiring · positive current flows top → ground",bars:[{name:"A alone",sourceMode:"a",value:c.a.valid?c.a.current*1e3:null,missing:!c.a.valid,color:"#17788d"},{name:"B alone",sourceMode:"b",value:c.b.valid?c.b.current*1e3:null,missing:!c.b.valid,color:"#b77739"},{name:"Both",sourceMode:"both",value:c.both.valid?c.both.current*1e3:null,missing:!c.both.valid,color:"#294a61"}],yLabel:"Current (mA)",yUnit:"mA",series:[]}}if(n.module==="opamp"){const l=Ui(n),c=["ch1","ch2"].map((u,h)=>{const d=l.channels[u],f=h?"#17788d":"#b77739";return{id:u,interaction:"scope",title:`${u.toUpperCase()} · ${d.scale} V/div`,subtitle:d.error||l.error||`${d.signal} − ${d.ground} · ${l.running?"Run":"Hold"}${l.stale?" · old settings":""}`,series:d.valid&&d.points.length?[{name:u.toUpperCase(),color:f,points:d.points}]:[],xMax:l.timeDiv*10,yMin:-d.scale*4,yMax:d.scale*4,xLabel:"Time (ms)",yLabel:"Voltage (V)",xUnit:"ms",yUnit:"V",limits:u==="ch2"&&d.correct?l.limits:[]}});return{title:"Oscilloscope",interaction:"scope",subtitle:l.error||`${e.frequency} Hz · ${l.trigger.edge} trigger at ${l.trigger.level} V · ${l.running?"Run":"Hold"}`,series:c.flatMap(u=>u.series),panels:c,xMax:l.timeDiv*10,yMin:-Math.max(l.channels.ch1.scale,l.channels.ch2.scale)*4,yMax:Math.max(l.channels.ch1.scale,l.channels.ch2.scale)*4,xLabel:"Time (ms)",yLabel:"Voltage (V)",limits:l.limits,scope:l}}const i=zn({...e,source:5}).tau,r=t.ok?Math.max(0,e.acquiredTime||0):0,s=Math.max((e.kind==="RC"?.1:.001)*5e3,r*1e3),o=t.ok?Array.from({length:r>0?121:1},(l,c)=>{const u=r>0?c/120*r:0,h=zn({...e,source:5,time:u});return{time:u*1e3,voltage:h.voltage,current:h.current*1e3,energy:h.energy*1e3}}):[],a=["voltage","current","energy"].map((l,c)=>{const u=o.map(v=>[v.time,v[l]]),h=u.map(v=>v[1]),d=l==="voltage"?`${e.kind==="RC"?"Capacitor":"Inductor"} voltage`:l==="current"?"Storage current":"Stored energy",f=zn({...e,source:5,time:0}),g=l==="voltage"?Math.max(5,Math.abs(f.voltage)):l==="current"?Math.max(5e3/e.resistance,Math.abs(f.current*1e3)):Math.max(f.energy*1e3,e.kind==="RC"?12500*e.capacitance:12500*e.inductance/e.resistance**2);return{id:l,title:d,subtitle:t.ok?`${e.charging?"Source connected":"Closed return"} · ${e.playing?"Acquiring":r?"Paused":"Press Run"} · ${Bt(r*1e3)} ms acquired`:t.error,series:u.length?[{name:d,color:["#17788d","#b77739","#735782"][c],unit:["V","mA","mJ"][c],points:u}]:[],interaction:"time",valid:t.ok,acquiredMax:r*1e3,xMax:s,yMin:Math.min(0,...h)*1.12,yMax:Math.max(g,...h,.001)*1.12,xLabel:"Elapsed circuit time (ms)",yLabel:["Voltage (V)","Current (mA)","Energy (mJ)"][c],xUnit:"ms",yUnit:["V","mA","mJ"][c],marker:t.ok?{x:e.time*1e3,y:l==="voltage"?t.voltage:l==="current"?t.current*1e3:t.energy*1e3}:null,tau:i*1e3}});return{...a[e.kind==="RC"?0:1],panels:a}}function fh(n,e,t=0){var h;const i=Ho(n),r=((h=i.panels)==null?void 0:h[t])||i,s=Number.isFinite(e)?Math.max(0,Math.min(1,e)):0;if(i.bars){const d=i.bars[Math.min(i.bars.length-1,Math.floor(s*i.bars.length))];return{x:null,xLabel:d.name,readings:d.missing?[]:[{name:d.name,value:d.value,unit:i.yUnit,color:d.color}],text:d.missing?`${d.name}: circuit unavailable`:`${d.name}: ${Bt(d.value)} ${i.yUnit}`,sourceMode:d.sourceMode}}const o=s*r.xMax,a=r.yUnit||"V",l=i.panels||[r],c=[];if(!(r.acquiredMax!==void 0&&o>r.acquiredMax+1e-8))for(const d of l)for(const f of d.series||[]){const g=f.points;if(!g.length||o<g[0][0]-1e-8||o>g.at(-1)[0]+1e-8)continue;let v=g.findIndex(([S])=>S>=o);v<0&&(v=g.length-1);const[m,p]=g[Math.max(0,v-1)],[x,y]=g[v],b=m===x?y:p+(o-m)/(x-m)*(y-p);c.push({name:f.name,value:b,unit:f.unit||d.yUnit||a,color:f.color})}const u=`${Bt(o)} ${r.xUnit||"ms"}`;return{x:o,xLabel:u,readings:c,text:c.length?`${u} · ${c.map(d=>`${d.name} ${Bt(d.value)} ${d.unit}`).join(" · ")}`:`${u} · ${r.acquiredMax!==void 0&&o>r.acquiredMax?"not acquired; run the circuit":"no trace at this point"}`}}function ph(n){const e=ct(n),t=[],i=(s,o,a,l="")=>t.push({group:s,id:o,label:a,value:l}),r=(s,o,a,l="Settings")=>{i(l,`cycle:${s}`,`${o} +`,a),i(l,`cycle:${s}:-1`,`${o} −`,a)};i("Guide",n.mode==="explore"?"build":"explore",n.mode==="explore"?"Build circuit":"Explore"),i("Guide","reset-circuit","Clear circuit");for(const[s,o]of[["select","Select"],["wire","Wire"],["remove","Remove"],["red","Meter V tip"],["black","Meter COM tip"]])i("Bench",`tool:${s}`,o,n.tool===s?"Selected":"");if(i("Bench","undo","Undo"),i("Bench","cancel","Cancel selection"),i("Bench","check-wiring","Check wiring"),n.module==="thevenin"){for(const s of["original","thevenin","norton"])i("Settings",`set:representation:${s}`,s==="thevenin"?"Thévenin":s==="norton"?"Norton":"Original",e.representation===s?"Selected":"");r("load","Load",`${e.load} Ω`),e.representation==="thevenin"&&r("equivalentVoltage","Vth",`${e.equivalentVoltage} V`),e.representation==="norton"&&r("nortonCurrent","In",`${e.nortonCurrent} mA`),e.representation!=="original"&&r("equivalentResistance","Equivalent R",`${e.equivalentResistance} Ω`)}if(n.module==="superposition"){for(const[s,o]of[["both","Both sources"],["a","A alone"],["b","B alone"]])i("Settings",`set:sourceMode:${s}`,o,e.sourceMode===s?"Selected":"");r("v1","Source A",`+${e.v1} V`),r("v2","Source B",`−${e.v2} V`),i("Settings",`set:replacement:${e.replacement==="short"?"open":"short"}`,"Inactive source",e.replacement)}if(n.module==="opamp"){i("Settings",`set:configuration:${e.configuration==="inverting"?"noninverting":"inverting"}`,"Configuration",e.configuration),r("rin","Rin",`${e.rin/1e3} kΩ`),r("rf","Rf",`${e.rf/1e3} kΩ`),r("amplitude","Input",`${e.amplitude} Vpk`),r("rail","Supply",`±${e.rail} V`),r("frequency","Frequency",`${e.frequency} Hz`);for(const s of["ch1","ch2"])i("Bench",`tool:${s}`,`${s.toUpperCase()} signal`,n.tool===s?"Selected":""),i("Bench",`scope-ground:${s}`,`${s.toUpperCase()} ground`,n.tool==="scopeGround"&&e.scopeGroundChannel===s?"Selected":""),r(`${s}Scale`,`${s.toUpperCase()} scale`,`${e[`${s}Scale`]} V/div`);r("timeDiv","Timebase",`${e.timeDiv} ms/div`),r("triggerLevel","Trigger level",`${e.triggerLevel} V`),i("Settings",`set:triggerEdge:${e.triggerEdge==="rising"?"falling":"rising"}`,"Trigger edge",e.triggerEdge),i("Bench","scope-toggle",e.scopeRunning?"Hold scope":"Run scope"),i("Bench","scope-autoscale","Autoscale")}n.module==="transient"&&(i("Settings",`set:kind:${e.kind==="RC"?"RL":"RC"}`,"Circuit",e.kind),r("resistance","Resistance",`${e.resistance} Ω`),r("speed","Playback",`${e.speed}×`),i("Bench","switch","Switch",e.charging?"Source":"Return"),i("Bench","play",e.playing?"Pause":"Run"),i("Bench","one-tau","Cursor at 1 τ"),i("Bench","five-tau","Cursor at 5 τ"),i("Bench","reset-energy","Zero energy"),i("Bench","replay","Replay")),n.mode==="explore"&&i("Bench","restore","Connect reference");for(const[s,o]of Object.entries(En))i("Labs",`module:${s}`,`Lab ${o.number}: ${o.name}`,n.module===s?"Current":"");return t}/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const $l="180",Xr={ROTATE:0,DOLLY:1,PAN:2},Wr={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Id=0,Fc=1,Ud=2,mh=1,gh=2,wi=3,Qi=0,Fn=1,fi=2,Zi=0,Yr=1,kc=2,Bc=3,zc=4,Nd=5,hr=100,Od=101,Fd=102,kd=103,Bd=104,zd=200,Vd=201,Hd=202,Gd=203,$a=204,qa=205,Wd=206,$d=207,qd=208,Xd=209,Yd=210,jd=211,Zd=212,Kd=213,Jd=214,Xa=0,Ya=1,ja=2,ts=3,Za=4,Ka=5,Ja=6,Qa=7,vh=0,Qd=1,ef=2,Ki=0,tf=1,nf=2,rf=3,_h=4,sf=5,of=6,af=7,xh=300,ns=301,is=302,el=303,tl=304,Go=306,nl=1e3,pr=1001,il=1002,ai=1003,lf=1004,Zs=1005,si=1006,la=1007,Yi=1008,mi=1009,bh=1010,yh=1011,Ds=1012,ql=1013,gr=1014,Li=1015,Hs=1016,Xl=1017,Yl=1018,Is=1020,Mh=35902,Sh=35899,Eh=1021,Th=1022,oi=1023,Us=1026,Ns=1027,wh=1028,jl=1029,Ah=1030,Zl=1031,Kl=1033,Ao=33776,Ro=33777,Co=33778,Po=33779,rl=35840,sl=35841,ol=35842,al=35843,ll=36196,cl=37492,ul=37496,hl=37808,dl=37809,fl=37810,pl=37811,ml=37812,gl=37813,vl=37814,_l=37815,xl=37816,bl=37817,yl=37818,Ml=37819,Sl=37820,El=37821,Tl=36492,wl=36494,Al=36495,Rl=36283,Cl=36284,Pl=36285,Ll=36286,cf=3200,uf=3201,Rh=0,hf=1,qi="",Mn="srgb",rs="srgb-linear",Do="linear",Nt="srgb",Rr=7680,Vc=519,df=512,ff=513,pf=514,Ch=515,mf=516,gf=517,vf=518,_f=519,Hc=35044,Gc="300 es",pi=2e3,Io=2001;class xr{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const r=i[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}}const xn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Wc=1234567;const jr=Math.PI/180,Os=180/Math.PI;function br(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(xn[n&255]+xn[n>>8&255]+xn[n>>16&255]+xn[n>>24&255]+"-"+xn[e&255]+xn[e>>8&255]+"-"+xn[e>>16&15|64]+xn[e>>24&255]+"-"+xn[t&63|128]+xn[t>>8&255]+"-"+xn[t>>16&255]+xn[t>>24&255]+xn[i&255]+xn[i>>8&255]+xn[i>>16&255]+xn[i>>24&255]).toLowerCase()}function ft(n,e,t){return Math.max(e,Math.min(t,n))}function Jl(n,e){return(n%e+e)%e}function xf(n,e,t,i,r){return i+(n-e)*(r-i)/(t-e)}function bf(n,e,t){return n!==e?(t-n)/(e-n):0}function Ts(n,e,t){return(1-t)*n+t*e}function yf(n,e,t,i){return Ts(n,e,1-Math.exp(-t*i))}function Mf(n,e=1){return e-Math.abs(Jl(n,e*2)-e)}function Sf(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function Ef(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function Tf(n,e){return n+Math.floor(Math.random()*(e-n+1))}function wf(n,e){return n+Math.random()*(e-n)}function Af(n){return n*(.5-Math.random())}function Rf(n){n!==void 0&&(Wc=n);let e=Wc+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Cf(n){return n*jr}function Pf(n){return n*Os}function Lf(n){return(n&n-1)===0&&n!==0}function Df(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function If(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function Uf(n,e,t,i,r){const s=Math.cos,o=Math.sin,a=s(t/2),l=o(t/2),c=s((e+i)/2),u=o((e+i)/2),h=s((e-i)/2),d=o((e-i)/2),f=s((i-e)/2),g=o((i-e)/2);switch(r){case"XYX":n.set(a*u,l*h,l*d,a*c);break;case"YZY":n.set(l*d,a*u,l*h,a*c);break;case"ZXZ":n.set(l*h,l*d,a*u,a*c);break;case"XZX":n.set(a*u,l*g,l*f,a*c);break;case"YXY":n.set(l*f,a*u,l*g,a*c);break;case"ZYZ":n.set(l*g,l*f,a*u,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function Gr(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Rn(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const _n={DEG2RAD:jr,RAD2DEG:Os,generateUUID:br,clamp:ft,euclideanModulo:Jl,mapLinear:xf,inverseLerp:bf,lerp:Ts,damp:yf,pingpong:Mf,smoothstep:Sf,smootherstep:Ef,randInt:Tf,randFloat:wf,randFloatSpread:Af,seededRandom:Rf,degToRad:Cf,radToDeg:Pf,isPowerOfTwo:Lf,ceilPowerOfTwo:Df,floorPowerOfTwo:If,setQuaternionFromProperEuler:Uf,normalize:Rn,denormalize:Gr};class xe{constructor(e=0,t=0){xe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ft(this.x,e.x,t.x),this.y=ft(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ft(this.x,e,t),this.y=ft(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ft(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(ft(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class On{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,s,o,a){let l=i[r+0],c=i[r+1],u=i[r+2],h=i[r+3];const d=s[o+0],f=s[o+1],g=s[o+2],v=s[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h;return}if(a===1){e[t+0]=d,e[t+1]=f,e[t+2]=g,e[t+3]=v;return}if(h!==v||l!==d||c!==f||u!==g){let m=1-a;const p=l*d+c*f+u*g+h*v,x=p>=0?1:-1,y=1-p*p;if(y>Number.EPSILON){const S=Math.sqrt(y),w=Math.atan2(S,p*x);m=Math.sin(m*w)/S,a=Math.sin(a*w)/S}const b=a*x;if(l=l*m+d*b,c=c*m+f*b,u=u*m+g*b,h=h*m+v*b,m===1-a){const S=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=S,c*=S,u*=S,h*=S}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,i,r,s,o){const a=i[r],l=i[r+1],c=i[r+2],u=i[r+3],h=s[o],d=s[o+1],f=s[o+2],g=s[o+3];return e[t]=a*g+u*h+l*f-c*d,e[t+1]=l*g+u*d+c*h-a*f,e[t+2]=c*g+u*f+a*d-l*h,e[t+3]=u*g-a*h-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),u=a(r/2),h=a(s/2),d=l(i/2),f=l(r/2),g=l(s/2);switch(o){case"XYZ":this._x=d*u*h+c*f*g,this._y=c*f*h-d*u*g,this._z=c*u*g+d*f*h,this._w=c*u*h-d*f*g;break;case"YXZ":this._x=d*u*h+c*f*g,this._y=c*f*h-d*u*g,this._z=c*u*g-d*f*h,this._w=c*u*h+d*f*g;break;case"ZXY":this._x=d*u*h-c*f*g,this._y=c*f*h+d*u*g,this._z=c*u*g+d*f*h,this._w=c*u*h-d*f*g;break;case"ZYX":this._x=d*u*h-c*f*g,this._y=c*f*h+d*u*g,this._z=c*u*g-d*f*h,this._w=c*u*h+d*f*g;break;case"YZX":this._x=d*u*h+c*f*g,this._y=c*f*h+d*u*g,this._z=c*u*g-d*f*h,this._w=c*u*h-d*f*g;break;case"XZY":this._x=d*u*h-c*f*g,this._y=c*f*h-d*u*g,this._z=c*u*g+d*f*h,this._w=c*u*h+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],r=t[4],s=t[8],o=t[1],a=t[5],l=t[9],c=t[2],u=t[6],h=t[10],d=i+a+h;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(u-l)*f,this._y=(s-c)*f,this._z=(o-r)*f}else if(i>a&&i>h){const f=2*Math.sqrt(1+i-a-h);this._w=(u-l)/f,this._x=.25*f,this._y=(r+o)/f,this._z=(s+c)/f}else if(a>h){const f=2*Math.sqrt(1+a-i-h);this._w=(s-c)/f,this._x=(r+o)/f,this._y=.25*f,this._z=(l+u)/f}else{const f=2*Math.sqrt(1+h-i-a);this._w=(o-r)/f,this._x=(s+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ft(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,r=e._y,s=e._z,o=e._w,a=t._x,l=t._y,c=t._z,u=t._w;return this._x=i*u+o*a+r*c-s*l,this._y=r*u+o*l+s*a-i*c,this._z=s*u+o*c+i*l-r*a,this._w=o*u-i*a-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,o=this._w;let a=o*e._w+i*e._x+r*e._y+s*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=i,this._y=r,this._z=s,this;const l=1-a*a;if(l<=Number.EPSILON){const f=1-t;return this._w=f*o+t*this._w,this._x=f*i+t*this._x,this._y=f*r+t*this._y,this._z=f*s+t*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,a),h=Math.sin((1-t)*u)/c,d=Math.sin(t*u)/c;return this._w=o*h+this._w*d,this._x=i*h+this._x*d,this._y=r*h+this._y*d,this._z=s*h+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class D{constructor(e=0,t=0,i=0){D.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion($c.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion($c.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){const t=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*r-a*i),u=2*(a*t-s*r),h=2*(s*i-o*t);return this.x=t+l*c+o*h-a*u,this.y=i+l*u+a*c-s*h,this.z=r+l*h+s*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ft(this.x,e.x,t.x),this.y=ft(this.y,e.y,t.y),this.z=ft(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ft(this.x,e,t),this.y=ft(this.y,e,t),this.z=ft(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ft(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,r=e.y,s=e.z,o=t.x,a=t.y,l=t.z;return this.x=r*l-s*a,this.y=s*o-i*l,this.z=i*a-r*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return ca.copy(this).projectOnVector(e),this.sub(ca)}reflect(e){return this.sub(ca.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(ft(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ca=new D,$c=new On;class dt{constructor(e,t,i,r,s,o,a,l,c){dt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,l,c)}set(e,t,i,r,s,o,a,l,c){const u=this.elements;return u[0]=e,u[1]=r,u[2]=a,u[3]=t,u[4]=s,u[5]=l,u[6]=i,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],u=i[4],h=i[7],d=i[2],f=i[5],g=i[8],v=r[0],m=r[3],p=r[6],x=r[1],y=r[4],b=r[7],S=r[2],w=r[5],R=r[8];return s[0]=o*v+a*x+l*S,s[3]=o*m+a*y+l*w,s[6]=o*p+a*b+l*R,s[1]=c*v+u*x+h*S,s[4]=c*m+u*y+h*w,s[7]=c*p+u*b+h*R,s[2]=d*v+f*x+g*S,s[5]=d*m+f*y+g*w,s[8]=d*p+f*b+g*R,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return t*o*u-t*a*c-i*s*u+i*a*l+r*s*c-r*o*l}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=u*o-a*c,d=a*l-u*s,f=c*s-o*l,g=t*h+i*d+r*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return e[0]=h*v,e[1]=(r*c-u*i)*v,e[2]=(a*i-r*o)*v,e[3]=d*v,e[4]=(u*t-r*l)*v,e[5]=(r*s-a*t)*v,e[6]=f*v,e[7]=(i*l-c*t)*v,e[8]=(o*t-i*s)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,o,a){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-r*c,r*l,-r*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(ua.makeScale(e,t)),this}rotate(e){return this.premultiply(ua.makeRotation(-e)),this}translate(e,t){return this.premultiply(ua.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const ua=new dt;function Ph(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Uo(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Nf(){const n=Uo("canvas");return n.style.display="block",n}const qc={};function Fs(n){n in qc||(qc[n]=!0,console.warn(n))}function Of(n,e,t){return new Promise(function(i,r){function s(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:i()}}setTimeout(s,t)})}const Xc=new dt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Yc=new dt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Ff(){const n={enabled:!0,workingColorSpace:rs,spaces:{},convert:function(r,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===Nt&&(r.r=Ii(r.r),r.g=Ii(r.g),r.b=Ii(r.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===Nt&&(r.r=Zr(r.r),r.g=Zr(r.g),r.b=Zr(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===qi?Do:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,o){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return Fs("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return Fs("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[rs]:{primaries:e,whitePoint:i,transfer:Do,toXYZ:Xc,fromXYZ:Yc,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Mn},outputColorSpaceConfig:{drawingBufferColorSpace:Mn}},[Mn]:{primaries:e,whitePoint:i,transfer:Nt,toXYZ:Xc,fromXYZ:Yc,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Mn}}}),n}const Lt=Ff();function Ii(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Zr(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Cr;class kf{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Cr===void 0&&(Cr=Uo("canvas")),Cr.width=e.width,Cr.height=e.height;const r=Cr.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=Cr}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Uo("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=Ii(s[o]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Ii(t[i]/255)*255):t[i]=Ii(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Bf=0;class Ql{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Bf++}),this.uuid=br(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(ha(r[o].image)):s.push(ha(r[o]))}else s=ha(r);i.url=s}return t||(e.images[this.uuid]=i),i}}function ha(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?kf.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let zf=0;const da=new D;class Dn extends xr{constructor(e=Dn.DEFAULT_IMAGE,t=Dn.DEFAULT_MAPPING,i=pr,r=pr,s=si,o=Yi,a=oi,l=mi,c=Dn.DEFAULT_ANISOTROPY,u=qi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:zf++}),this.uuid=br(),this.name="",this.source=new Ql(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new xe(0,0),this.repeat=new xe(1,1),this.center=new xe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new dt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(da).x}get height(){return this.source.getSize(da).y}get depth(){return this.source.getSize(da).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}r&&i&&r.isVector2&&i.isVector2||r&&i&&r.isVector3&&i.isVector3||r&&i&&r.isMatrix3&&i.isMatrix3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==xh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case nl:e.x=e.x-Math.floor(e.x);break;case pr:e.x=e.x<0?0:1;break;case il:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case nl:e.y=e.y-Math.floor(e.y);break;case pr:e.y=e.y<0?0:1;break;case il:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Dn.DEFAULT_IMAGE=null;Dn.DEFAULT_MAPPING=xh;Dn.DEFAULT_ANISOTROPY=1;class Yt{constructor(e=0,t=0,i=0,r=1){Yt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*t+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*t+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*t+o[7]*i+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s;const l=e.elements,c=l[0],u=l[4],h=l[8],d=l[1],f=l[5],g=l[9],v=l[2],m=l[6],p=l[10];if(Math.abs(u-d)<.01&&Math.abs(h-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+v)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const y=(c+1)/2,b=(f+1)/2,S=(p+1)/2,w=(u+d)/4,R=(h+v)/4,P=(g+m)/4;return y>b&&y>S?y<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(y),r=w/i,s=R/i):b>S?b<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(b),i=w/r,s=P/r):S<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(S),i=R/s,r=P/s),this.set(i,r,s,t),this}let x=Math.sqrt((m-g)*(m-g)+(h-v)*(h-v)+(d-u)*(d-u));return Math.abs(x)<.001&&(x=1),this.x=(m-g)/x,this.y=(h-v)/x,this.z=(d-u)/x,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ft(this.x,e.x,t.x),this.y=ft(this.y,e.y,t.y),this.z=ft(this.z,e.z,t.z),this.w=ft(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ft(this.x,e,t),this.y=ft(this.y,e,t),this.z=ft(this.z,e,t),this.w=ft(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ft(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Vf extends xr{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:si,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new Yt(0,0,e,t),this.scissorTest=!1,this.viewport=new Yt(0,0,e,t);const r={width:e,height:t,depth:i.depth},s=new Dn(r);this.textures=[];const o=i.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:si,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i,this.textures[r].isArrayTexture=this.textures[r].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const r=Object.assign({},e.textures[t].image);this.textures[t].source=new Ql(r)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class vr extends Vf{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Lh extends Dn{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=ai,this.minFilter=ai,this.wrapR=pr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Hf extends Dn{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=ai,this.minFilter=ai,this.wrapR=pr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class as{constructor(e=new D(1/0,1/0,1/0),t=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(ei.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(ei.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=ei.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,ei):ei.fromBufferAttribute(s,o),ei.applyMatrix4(e.matrixWorld),this.expandByPoint(ei);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ks.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Ks.copy(i.boundingBox)),Ks.applyMatrix4(e.matrixWorld),this.union(Ks)}const r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ei),ei.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ms),Js.subVectors(this.max,ms),Pr.subVectors(e.a,ms),Lr.subVectors(e.b,ms),Dr.subVectors(e.c,ms),ki.subVectors(Lr,Pr),Bi.subVectors(Dr,Lr),rr.subVectors(Pr,Dr);let t=[0,-ki.z,ki.y,0,-Bi.z,Bi.y,0,-rr.z,rr.y,ki.z,0,-ki.x,Bi.z,0,-Bi.x,rr.z,0,-rr.x,-ki.y,ki.x,0,-Bi.y,Bi.x,0,-rr.y,rr.x,0];return!fa(t,Pr,Lr,Dr,Js)||(t=[1,0,0,0,1,0,0,0,1],!fa(t,Pr,Lr,Dr,Js))?!1:(Qs.crossVectors(ki,Bi),t=[Qs.x,Qs.y,Qs.z],fa(t,Pr,Lr,Dr,Js))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ei).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ei).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(yi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),yi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),yi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),yi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),yi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),yi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),yi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),yi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(yi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const yi=[new D,new D,new D,new D,new D,new D,new D,new D],ei=new D,Ks=new as,Pr=new D,Lr=new D,Dr=new D,ki=new D,Bi=new D,rr=new D,ms=new D,Js=new D,Qs=new D,sr=new D;function fa(n,e,t,i,r){for(let s=0,o=n.length-3;s<=o;s+=3){sr.fromArray(n,s);const a=r.x*Math.abs(sr.x)+r.y*Math.abs(sr.y)+r.z*Math.abs(sr.z),l=e.dot(sr),c=t.dot(sr),u=i.dot(sr);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const Gf=new as,gs=new D,pa=new D;class Wo{constructor(e=new D,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):Gf.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;gs.subVectors(e,this.center);const t=gs.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(gs,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(pa.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(gs.copy(e.center).add(pa)),this.expandByPoint(gs.copy(e.center).sub(pa))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const Mi=new D,ma=new D,eo=new D,zi=new D,ga=new D,to=new D,va=new D;class $o{constructor(e=new D,t=new D(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Mi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Mi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Mi.copy(this.origin).addScaledVector(this.direction,t),Mi.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){ma.copy(e).add(t).multiplyScalar(.5),eo.copy(t).sub(e).normalize(),zi.copy(this.origin).sub(ma);const s=e.distanceTo(t)*.5,o=-this.direction.dot(eo),a=zi.dot(this.direction),l=-zi.dot(eo),c=zi.lengthSq(),u=Math.abs(1-o*o);let h,d,f,g;if(u>0)if(h=o*l-a,d=o*a-l,g=s*u,h>=0)if(d>=-g)if(d<=g){const v=1/u;h*=v,d*=v,f=h*(h+o*d+2*a)+d*(o*h+d+2*l)+c}else d=s,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;else d=-s,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;else d<=-g?(h=Math.max(0,-(-o*s+a)),d=h>0?-s:Math.min(Math.max(-s,-l),s),f=-h*h+d*(d+2*l)+c):d<=g?(h=0,d=Math.min(Math.max(-s,-l),s),f=d*(d+2*l)+c):(h=Math.max(0,-(o*s+a)),d=h>0?s:Math.min(Math.max(-s,-l),s),f=-h*h+d*(d+2*l)+c);else d=o>0?-s:s,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(ma).addScaledVector(eo,d),f}intersectSphere(e,t){Mi.subVectors(e.center,this.origin);const i=Mi.dot(this.direction),r=Mi.dot(Mi)-i*i,s=e.radius*e.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return c>=0?(i=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(i=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),u>=0?(s=(e.min.y-d.y)*u,o=(e.max.y-d.y)*u):(s=(e.max.y-d.y)*u,o=(e.min.y-d.y)*u),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),h>=0?(a=(e.min.z-d.z)*h,l=(e.max.z-d.z)*h):(a=(e.max.z-d.z)*h,l=(e.min.z-d.z)*h),i>l||a>r)||((a>i||i!==i)&&(i=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,Mi)!==null}intersectTriangle(e,t,i,r,s){ga.subVectors(t,e),to.subVectors(i,e),va.crossVectors(ga,to);let o=this.direction.dot(va),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;zi.subVectors(this.origin,e);const l=a*this.direction.dot(to.crossVectors(zi,to));if(l<0)return null;const c=a*this.direction.dot(ga.cross(zi));if(c<0||l+c>o)return null;const u=-a*zi.dot(va);return u<0?null:this.at(u/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ht{constructor(e,t,i,r,s,o,a,l,c,u,h,d,f,g,v,m){Ht.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,l,c,u,h,d,f,g,v,m)}set(e,t,i,r,s,o,a,l,c,u,h,d,f,g,v,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=i,p[12]=r,p[1]=s,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=u,p[10]=h,p[14]=d,p[3]=f,p[7]=g,p[11]=v,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ht().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,r=1/Ir.setFromMatrixColumn(e,0).length(),s=1/Ir.setFromMatrixColumn(e,1).length(),o=1/Ir.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){const d=o*u,f=o*h,g=a*u,v=a*h;t[0]=l*u,t[4]=-l*h,t[8]=c,t[1]=f+g*c,t[5]=d-v*c,t[9]=-a*l,t[2]=v-d*c,t[6]=g+f*c,t[10]=o*l}else if(e.order==="YXZ"){const d=l*u,f=l*h,g=c*u,v=c*h;t[0]=d+v*a,t[4]=g*a-f,t[8]=o*c,t[1]=o*h,t[5]=o*u,t[9]=-a,t[2]=f*a-g,t[6]=v+d*a,t[10]=o*l}else if(e.order==="ZXY"){const d=l*u,f=l*h,g=c*u,v=c*h;t[0]=d-v*a,t[4]=-o*h,t[8]=g+f*a,t[1]=f+g*a,t[5]=o*u,t[9]=v-d*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){const d=o*u,f=o*h,g=a*u,v=a*h;t[0]=l*u,t[4]=g*c-f,t[8]=d*c+v,t[1]=l*h,t[5]=v*c+d,t[9]=f*c-g,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){const d=o*l,f=o*c,g=a*l,v=a*c;t[0]=l*u,t[4]=v-d*h,t[8]=g*h+f,t[1]=h,t[5]=o*u,t[9]=-a*u,t[2]=-c*u,t[6]=f*h+g,t[10]=d-v*h}else if(e.order==="XZY"){const d=o*l,f=o*c,g=a*l,v=a*c;t[0]=l*u,t[4]=-h,t[8]=c*u,t[1]=d*h+v,t[5]=o*u,t[9]=f*h-g,t[2]=g*h-f,t[6]=a*u,t[10]=v*h+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Wf,e,$f)}lookAt(e,t,i){const r=this.elements;return kn.subVectors(e,t),kn.lengthSq()===0&&(kn.z=1),kn.normalize(),Vi.crossVectors(i,kn),Vi.lengthSq()===0&&(Math.abs(i.z)===1?kn.x+=1e-4:kn.z+=1e-4,kn.normalize(),Vi.crossVectors(i,kn)),Vi.normalize(),no.crossVectors(kn,Vi),r[0]=Vi.x,r[4]=no.x,r[8]=kn.x,r[1]=Vi.y,r[5]=no.y,r[9]=kn.y,r[2]=Vi.z,r[6]=no.z,r[10]=kn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],u=i[1],h=i[5],d=i[9],f=i[13],g=i[2],v=i[6],m=i[10],p=i[14],x=i[3],y=i[7],b=i[11],S=i[15],w=r[0],R=r[4],P=r[8],T=r[12],E=r[1],I=r[5],B=r[9],k=r[13],q=r[2],H=r[6],U=r[10],$=r[14],V=r[3],ae=r[7],ye=r[11],Le=r[15];return s[0]=o*w+a*E+l*q+c*V,s[4]=o*R+a*I+l*H+c*ae,s[8]=o*P+a*B+l*U+c*ye,s[12]=o*T+a*k+l*$+c*Le,s[1]=u*w+h*E+d*q+f*V,s[5]=u*R+h*I+d*H+f*ae,s[9]=u*P+h*B+d*U+f*ye,s[13]=u*T+h*k+d*$+f*Le,s[2]=g*w+v*E+m*q+p*V,s[6]=g*R+v*I+m*H+p*ae,s[10]=g*P+v*B+m*U+p*ye,s[14]=g*T+v*k+m*$+p*Le,s[3]=x*w+y*E+b*q+S*V,s[7]=x*R+y*I+b*H+S*ae,s[11]=x*P+y*B+b*U+S*ye,s[15]=x*T+y*k+b*$+S*Le,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],h=e[6],d=e[10],f=e[14],g=e[3],v=e[7],m=e[11],p=e[15];return g*(+s*l*h-r*c*h-s*a*d+i*c*d+r*a*f-i*l*f)+v*(+t*l*f-t*c*d+s*o*d-r*o*f+r*c*u-s*l*u)+m*(+t*c*h-t*a*f-s*o*h+i*o*f+s*a*u-i*c*u)+p*(-r*a*u-t*l*h+t*a*d+r*o*h-i*o*d+i*l*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=e[9],d=e[10],f=e[11],g=e[12],v=e[13],m=e[14],p=e[15],x=h*m*c-v*d*c+v*l*f-a*m*f-h*l*p+a*d*p,y=g*d*c-u*m*c-g*l*f+o*m*f+u*l*p-o*d*p,b=u*v*c-g*h*c+g*a*f-o*v*f-u*a*p+o*h*p,S=g*h*l-u*v*l-g*a*d+o*v*d+u*a*m-o*h*m,w=t*x+i*y+r*b+s*S;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/w;return e[0]=x*R,e[1]=(v*d*s-h*m*s-v*r*f+i*m*f+h*r*p-i*d*p)*R,e[2]=(a*m*s-v*l*s+v*r*c-i*m*c-a*r*p+i*l*p)*R,e[3]=(h*l*s-a*d*s-h*r*c+i*d*c+a*r*f-i*l*f)*R,e[4]=y*R,e[5]=(u*m*s-g*d*s+g*r*f-t*m*f-u*r*p+t*d*p)*R,e[6]=(g*l*s-o*m*s-g*r*c+t*m*c+o*r*p-t*l*p)*R,e[7]=(o*d*s-u*l*s+u*r*c-t*d*c-o*r*f+t*l*f)*R,e[8]=b*R,e[9]=(g*h*s-u*v*s-g*i*f+t*v*f+u*i*p-t*h*p)*R,e[10]=(o*v*s-g*a*s+g*i*c-t*v*c-o*i*p+t*a*p)*R,e[11]=(u*a*s-o*h*s-u*i*c+t*h*c+o*i*f-t*a*f)*R,e[12]=S*R,e[13]=(u*v*r-g*h*r+g*i*d-t*v*d-u*i*m+t*h*m)*R,e[14]=(g*a*r-o*v*r-g*i*l+t*v*l+o*i*m-t*a*m)*R,e[15]=(o*h*r-u*a*r+u*i*l-t*h*l-o*i*d+t*a*d)*R,this}scale(e){const t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),r=Math.sin(t),s=1-i,o=e.x,a=e.y,l=e.z,c=s*o,u=s*a;return this.set(c*o+i,c*a-r*l,c*l+r*a,0,c*a+r*l,u*a+i,u*l-r*o,0,c*l-r*a,u*l+r*o,s*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){const r=this.elements,s=t._x,o=t._y,a=t._z,l=t._w,c=s+s,u=o+o,h=a+a,d=s*c,f=s*u,g=s*h,v=o*u,m=o*h,p=a*h,x=l*c,y=l*u,b=l*h,S=i.x,w=i.y,R=i.z;return r[0]=(1-(v+p))*S,r[1]=(f+b)*S,r[2]=(g-y)*S,r[3]=0,r[4]=(f-b)*w,r[5]=(1-(d+p))*w,r[6]=(m+x)*w,r[7]=0,r[8]=(g+y)*R,r[9]=(m-x)*R,r[10]=(1-(d+v))*R,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){const r=this.elements;let s=Ir.set(r[0],r[1],r[2]).length();const o=Ir.set(r[4],r[5],r[6]).length(),a=Ir.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],ti.copy(this);const c=1/s,u=1/o,h=1/a;return ti.elements[0]*=c,ti.elements[1]*=c,ti.elements[2]*=c,ti.elements[4]*=u,ti.elements[5]*=u,ti.elements[6]*=u,ti.elements[8]*=h,ti.elements[9]*=h,ti.elements[10]*=h,t.setFromRotationMatrix(ti),i.x=s,i.y=o,i.z=a,this}makePerspective(e,t,i,r,s,o,a=pi,l=!1){const c=this.elements,u=2*s/(t-e),h=2*s/(i-r),d=(t+e)/(t-e),f=(i+r)/(i-r);let g,v;if(l)g=s/(o-s),v=o*s/(o-s);else if(a===pi)g=-(o+s)/(o-s),v=-2*o*s/(o-s);else if(a===Io)g=-o/(o-s),v=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,r,s,o,a=pi,l=!1){const c=this.elements,u=2/(t-e),h=2/(i-r),d=-(t+e)/(t-e),f=-(i+r)/(i-r);let g,v;if(l)g=1/(o-s),v=o/(o-s);else if(a===pi)g=-2/(o-s),v=-(o+s)/(o-s);else if(a===Io)g=-1/(o-s),v=-s/(o-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=h,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const Ir=new D,ti=new Ht,Wf=new D(0,0,0),$f=new D(1,1,1),Vi=new D,no=new D,kn=new D,jc=new Ht,Zc=new On;class li{constructor(e=0,t=0,i=0,r=li.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const r=e.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],u=r[9],h=r[2],d=r[6],f=r[10];switch(t){case"XYZ":this._y=Math.asin(ft(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ft(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(ft(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-ft(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(ft(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-ft(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return jc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(jc,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Zc.setFromEuler(this),this.setFromQuaternion(Zc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}li.DEFAULT_ORDER="XYZ";class ec{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let qf=0;const Kc=new D,Ur=new On,Si=new Ht,io=new D,vs=new D,Xf=new D,Yf=new On,Jc=new D(1,0,0),Qc=new D(0,1,0),eu=new D(0,0,1),tu={type:"added"},jf={type:"removed"},Nr={type:"childadded",child:null},_a={type:"childremoved",child:null};class un extends xr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:qf++}),this.uuid=br(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=un.DEFAULT_UP.clone();const e=new D,t=new li,i=new On,r=new D(1,1,1);function s(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new Ht},normalMatrix:{value:new dt}}),this.matrix=new Ht,this.matrixWorld=new Ht,this.matrixAutoUpdate=un.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=un.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ec,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ur.setFromAxisAngle(e,t),this.quaternion.multiply(Ur),this}rotateOnWorldAxis(e,t){return Ur.setFromAxisAngle(e,t),this.quaternion.premultiply(Ur),this}rotateX(e){return this.rotateOnAxis(Jc,e)}rotateY(e){return this.rotateOnAxis(Qc,e)}rotateZ(e){return this.rotateOnAxis(eu,e)}translateOnAxis(e,t){return Kc.copy(e).applyQuaternion(this.quaternion),this.position.add(Kc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Jc,e)}translateY(e){return this.translateOnAxis(Qc,e)}translateZ(e){return this.translateOnAxis(eu,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Si.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?io.copy(e):io.set(e,t,i);const r=this.parent;this.updateWorldMatrix(!0,!1),vs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Si.lookAt(vs,io,this.up):Si.lookAt(io,vs,this.up),this.quaternion.setFromRotationMatrix(Si),r&&(Si.extractRotation(r.matrixWorld),Ur.setFromRotationMatrix(Si),this.quaternion.premultiply(Ur.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(tu),Nr.child=e,this.dispatchEvent(Nr),Nr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(jf),_a.child=e,this.dispatchEvent(_a),_a.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Si.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Si.multiply(e.parent.matrixWorld)),e.applyMatrix4(Si),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(tu),Nr.child=e,this.dispatchEvent(Nr),Nr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(vs,e,Xf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(vs,Yf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(a=>({...a})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];s(e.shapes,h)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];r.animations.push(s(e.animations,l))}}if(t){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),h=o(e.shapes),d=o(e.skeletons),f=o(e.animations),g=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),h.length>0&&(i.shapes=h),d.length>0&&(i.skeletons=d),f.length>0&&(i.animations=f),g.length>0&&(i.nodes=g)}return i.object=r,i;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}un.DEFAULT_UP=new D(0,1,0);un.DEFAULT_MATRIX_AUTO_UPDATE=!0;un.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const ni=new D,Ei=new D,xa=new D,Ti=new D,Or=new D,Fr=new D,nu=new D,ba=new D,ya=new D,Ma=new D,Sa=new Yt,Ea=new Yt,Ta=new Yt;class Yn{constructor(e=new D,t=new D,i=new D){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),ni.subVectors(e,t),r.cross(ni);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){ni.subVectors(r,t),Ei.subVectors(i,t),xa.subVectors(e,t);const o=ni.dot(ni),a=ni.dot(Ei),l=ni.dot(xa),c=Ei.dot(Ei),u=Ei.dot(xa),h=o*c-a*a;if(h===0)return s.set(0,0,0),null;const d=1/h,f=(c*l-a*u)*d,g=(o*u-a*l)*d;return s.set(1-f-g,g,f)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,Ti)===null?!1:Ti.x>=0&&Ti.y>=0&&Ti.x+Ti.y<=1}static getInterpolation(e,t,i,r,s,o,a,l){return this.getBarycoord(e,t,i,r,Ti)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Ti.x),l.addScaledVector(o,Ti.y),l.addScaledVector(a,Ti.z),l)}static getInterpolatedAttribute(e,t,i,r,s,o){return Sa.setScalar(0),Ea.setScalar(0),Ta.setScalar(0),Sa.fromBufferAttribute(e,t),Ea.fromBufferAttribute(e,i),Ta.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(Sa,s.x),o.addScaledVector(Ea,s.y),o.addScaledVector(Ta,s.z),o}static isFrontFacing(e,t,i,r){return ni.subVectors(i,t),Ei.subVectors(e,t),ni.cross(Ei).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ni.subVectors(this.c,this.b),Ei.subVectors(this.a,this.b),ni.cross(Ei).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Yn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Yn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,r,s){return Yn.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return Yn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Yn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,r=this.b,s=this.c;let o,a;Or.subVectors(r,i),Fr.subVectors(s,i),ba.subVectors(e,i);const l=Or.dot(ba),c=Fr.dot(ba);if(l<=0&&c<=0)return t.copy(i);ya.subVectors(e,r);const u=Or.dot(ya),h=Fr.dot(ya);if(u>=0&&h<=u)return t.copy(r);const d=l*h-u*c;if(d<=0&&l>=0&&u<=0)return o=l/(l-u),t.copy(i).addScaledVector(Or,o);Ma.subVectors(e,s);const f=Or.dot(Ma),g=Fr.dot(Ma);if(g>=0&&f<=g)return t.copy(s);const v=f*c-l*g;if(v<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(i).addScaledVector(Fr,a);const m=u*g-f*h;if(m<=0&&h-u>=0&&f-g>=0)return nu.subVectors(s,r),a=(h-u)/(h-u+(f-g)),t.copy(r).addScaledVector(nu,a);const p=1/(m+v+d);return o=v*p,a=d*p,t.copy(i).addScaledVector(Or,o).addScaledVector(Fr,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Dh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Hi={h:0,s:0,l:0},ro={h:0,s:0,l:0};function wa(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class Et{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Mn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Lt.colorSpaceToWorking(this,t),this}setRGB(e,t,i,r=Lt.workingColorSpace){return this.r=e,this.g=t,this.b=i,Lt.colorSpaceToWorking(this,r),this}setHSL(e,t,i,r=Lt.workingColorSpace){if(e=Jl(e,1),t=ft(t,0,1),i=ft(i,0,1),t===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+t):i+t-i*t,o=2*i-s;this.r=wa(o,s,e+1/3),this.g=wa(o,s,e),this.b=wa(o,s,e-1/3)}return Lt.colorSpaceToWorking(this,r),this}setStyle(e,t=Mn){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Mn){const i=Dh[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ii(e.r),this.g=Ii(e.g),this.b=Ii(e.b),this}copyLinearToSRGB(e){return this.r=Zr(e.r),this.g=Zr(e.g),this.b=Zr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Mn){return Lt.workingToColorSpace(bn.copy(this),e),Math.round(ft(bn.r*255,0,255))*65536+Math.round(ft(bn.g*255,0,255))*256+Math.round(ft(bn.b*255,0,255))}getHexString(e=Mn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Lt.workingColorSpace){Lt.workingToColorSpace(bn.copy(this),t);const i=bn.r,r=bn.g,s=bn.b,o=Math.max(i,r,s),a=Math.min(i,r,s);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const h=o-a;switch(c=u<=.5?h/(o+a):h/(2-o-a),o){case i:l=(r-s)/h+(r<s?6:0);break;case r:l=(s-i)/h+2;break;case s:l=(i-r)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=Lt.workingColorSpace){return Lt.workingToColorSpace(bn.copy(this),t),e.r=bn.r,e.g=bn.g,e.b=bn.b,e}getStyle(e=Mn){Lt.workingToColorSpace(bn.copy(this),e);const t=bn.r,i=bn.g,r=bn.b;return e!==Mn?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(Hi),this.setHSL(Hi.h+e,Hi.s+t,Hi.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Hi),e.getHSL(ro);const i=Ts(Hi.h,ro.h,t),r=Ts(Hi.s,ro.s,t),s=Ts(Hi.l,ro.l,t);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*r,this.g=s[1]*t+s[4]*i+s[7]*r,this.b=s[2]*t+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const bn=new Et;Et.NAMES=Dh;let Zf=0;class ls extends xr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Zf++}),this.uuid=br(),this.name="",this.type="Material",this.blending=Yr,this.side=Qi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=$a,this.blendDst=qa,this.blendEquation=hr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Et(0,0,0),this.blendAlpha=0,this.depthFunc=ts,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Vc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Rr,this.stencilZFail=Rr,this.stencilZPass=Rr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Yr&&(i.blending=this.blending),this.side!==Qi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==$a&&(i.blendSrc=this.blendSrc),this.blendDst!==qa&&(i.blendDst=this.blendDst),this.blendEquation!==hr&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==ts&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Vc&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Rr&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Rr&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Rr&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(t){const s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class qn extends ls{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Et(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new li,this.combine=vh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const nn=new D,so=new xe;let Kf=0;class jn{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Kf++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Hc,this.updateRanges=[],this.gpuType=Li,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)so.fromBufferAttribute(this,t),so.applyMatrix3(e),this.setXY(t,so.x,so.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)nn.fromBufferAttribute(this,t),nn.applyMatrix3(e),this.setXYZ(t,nn.x,nn.y,nn.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)nn.fromBufferAttribute(this,t),nn.applyMatrix4(e),this.setXYZ(t,nn.x,nn.y,nn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)nn.fromBufferAttribute(this,t),nn.applyNormalMatrix(e),this.setXYZ(t,nn.x,nn.y,nn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)nn.fromBufferAttribute(this,t),nn.transformDirection(e),this.setXYZ(t,nn.x,nn.y,nn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Gr(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Rn(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Gr(t,this.array)),t}setX(e,t){return this.normalized&&(t=Rn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Gr(t,this.array)),t}setY(e,t){return this.normalized&&(t=Rn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Gr(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Rn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Gr(t,this.array)),t}setW(e,t){return this.normalized&&(t=Rn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Rn(t,this.array),i=Rn(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=Rn(t,this.array),i=Rn(i,this.array),r=Rn(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=Rn(t,this.array),i=Rn(i,this.array),r=Rn(r,this.array),s=Rn(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Hc&&(e.usage=this.usage),e}}class Ih extends jn{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Uh extends jn{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class It extends jn{constructor(e,t,i){super(new Float32Array(e),t,i)}}let Jf=0;const Wn=new Ht,Aa=new un,kr=new D,Bn=new as,_s=new as,mn=new D;class hn extends xr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Jf++}),this.uuid=br(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Ph(e)?Uh:Ih)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new dt().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Wn.makeRotationFromQuaternion(e),this.applyMatrix4(Wn),this}rotateX(e){return Wn.makeRotationX(e),this.applyMatrix4(Wn),this}rotateY(e){return Wn.makeRotationY(e),this.applyMatrix4(Wn),this}rotateZ(e){return Wn.makeRotationZ(e),this.applyMatrix4(Wn),this}translate(e,t,i){return Wn.makeTranslation(e,t,i),this.applyMatrix4(Wn),this}scale(e,t,i){return Wn.makeScale(e,t,i),this.applyMatrix4(Wn),this}lookAt(e){return Aa.lookAt(e),Aa.updateMatrix(),this.applyMatrix4(Aa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(kr).negate(),this.translate(kr.x,kr.y,kr.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const o=e[r];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new It(i,3))}else{const i=Math.min(e.length,t.count);for(let r=0;r<i;r++){const s=e[r];t.setXYZ(r,s.x,s.y,s.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new as);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){const s=t[i];Bn.setFromBufferAttribute(s),this.morphTargetsRelative?(mn.addVectors(this.boundingBox.min,Bn.min),this.boundingBox.expandByPoint(mn),mn.addVectors(this.boundingBox.max,Bn.max),this.boundingBox.expandByPoint(mn)):(this.boundingBox.expandByPoint(Bn.min),this.boundingBox.expandByPoint(Bn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Wo);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(e){const i=this.boundingSphere.center;if(Bn.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){const a=t[s];_s.setFromBufferAttribute(a),this.morphTargetsRelative?(mn.addVectors(Bn.min,_s.min),Bn.expandByPoint(mn),mn.addVectors(Bn.max,_s.max),Bn.expandByPoint(mn)):(Bn.expandByPoint(_s.min),Bn.expandByPoint(_s.max))}Bn.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)mn.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(mn));if(t)for(let s=0,o=t.length;s<o;s++){const a=t[s],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)mn.fromBufferAttribute(a,c),l&&(kr.fromBufferAttribute(e,c),mn.add(kr)),r=Math.max(r,i.distanceToSquared(mn))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new jn(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let P=0;P<i.count;P++)a[P]=new D,l[P]=new D;const c=new D,u=new D,h=new D,d=new xe,f=new xe,g=new xe,v=new D,m=new D;function p(P,T,E){c.fromBufferAttribute(i,P),u.fromBufferAttribute(i,T),h.fromBufferAttribute(i,E),d.fromBufferAttribute(s,P),f.fromBufferAttribute(s,T),g.fromBufferAttribute(s,E),u.sub(c),h.sub(c),f.sub(d),g.sub(d);const I=1/(f.x*g.y-g.x*f.y);isFinite(I)&&(v.copy(u).multiplyScalar(g.y).addScaledVector(h,-f.y).multiplyScalar(I),m.copy(h).multiplyScalar(f.x).addScaledVector(u,-g.x).multiplyScalar(I),a[P].add(v),a[T].add(v),a[E].add(v),l[P].add(m),l[T].add(m),l[E].add(m))}let x=this.groups;x.length===0&&(x=[{start:0,count:e.count}]);for(let P=0,T=x.length;P<T;++P){const E=x[P],I=E.start,B=E.count;for(let k=I,q=I+B;k<q;k+=3)p(e.getX(k+0),e.getX(k+1),e.getX(k+2))}const y=new D,b=new D,S=new D,w=new D;function R(P){S.fromBufferAttribute(r,P),w.copy(S);const T=a[P];y.copy(T),y.sub(S.multiplyScalar(S.dot(T))).normalize(),b.crossVectors(w,T);const I=b.dot(l[P])<0?-1:1;o.setXYZW(P,y.x,y.y,y.z,I)}for(let P=0,T=x.length;P<T;++P){const E=x[P],I=E.start,B=E.count;for(let k=I,q=I+B;k<q;k+=3)R(e.getX(k+0)),R(e.getX(k+1)),R(e.getX(k+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new jn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);const r=new D,s=new D,o=new D,a=new D,l=new D,c=new D,u=new D,h=new D;if(e)for(let d=0,f=e.count;d<f;d+=3){const g=e.getX(d+0),v=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,g),s.fromBufferAttribute(t,v),o.fromBufferAttribute(t,m),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),a.fromBufferAttribute(i,g),l.fromBufferAttribute(i,v),c.fromBufferAttribute(i,m),a.add(u),l.add(u),c.add(u),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(v,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)r.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),i.setXYZ(d+0,u.x,u.y,u.z),i.setXYZ(d+1,u.x,u.y,u.z),i.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)mn.fromBufferAttribute(e,t),mn.normalize(),e.setXYZ(t,mn.x,mn.y,mn.z)}toNonIndexed(){function e(a,l){const c=a.array,u=a.itemSize,h=a.normalized,d=new c.constructor(l.length*u);let f=0,g=0;for(let v=0,m=l.length;v<m;v++){a.isInterleavedBufferAttribute?f=l[v]*a.data.stride+a.offset:f=l[v]*u;for(let p=0;p<u;p++)d[g++]=c[f++]}return new jn(d,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new hn,i=this.index.array,r=this.attributes;for(const a in r){const l=r[a],c=e(l,i);t.setAttribute(a,c)}const s=this.morphAttributes;for(const a in s){const l=[],c=s[a];for(let u=0,h=c.length;u<h;u++){const d=c[u],f=e(d,i);l.push(f)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,d=c.length;h<d;h++){const f=c[h];u.push(f.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const r=e.attributes;for(const c in r){const u=r[c];this.setAttribute(c,u.clone(t))}const s=e.morphAttributes;for(const c in s){const u=[],h=s[c];for(let d=0,f=h.length;d<f;d++)u.push(h[d].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,u=o.length;c<u;c++){const h=o[c];this.addGroup(h.start,h.count,h.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const iu=new Ht,or=new $o,oo=new Wo,ru=new D,ao=new D,lo=new D,co=new D,Ra=new D,uo=new D,su=new D,ho=new D;class Tn extends un{constructor(e=new hn,t=new qn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(r,e);const a=this.morphTargetInfluences;if(s&&a){uo.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=a[l],h=s[l];u!==0&&(Ra.fromBufferAttribute(h,e),o?uo.addScaledVector(Ra,u):uo.addScaledVector(Ra.sub(t),u))}t.add(uo)}return t}raycast(e,t){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),oo.copy(i.boundingSphere),oo.applyMatrix4(s),or.copy(e.ray).recast(e.near),!(oo.containsPoint(or.origin)===!1&&(or.intersectSphere(oo,ru)===null||or.origin.distanceToSquared(ru)>(e.far-e.near)**2))&&(iu.copy(s).invert(),or.copy(e.ray).applyMatrix4(iu),!(i.boundingBox!==null&&or.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,or)))}_computeIntersections(e,t,i){let r;const s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,h=s.attributes.normal,d=s.groups,f=s.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=o[m.materialIndex],x=Math.max(m.start,f.start),y=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let b=x,S=y;b<S;b+=3){const w=a.getX(b),R=a.getX(b+1),P=a.getX(b+2);r=fo(this,p,e,i,c,u,h,w,R,P),r&&(r.faceIndex=Math.floor(b/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const g=Math.max(0,f.start),v=Math.min(a.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const x=a.getX(m),y=a.getX(m+1),b=a.getX(m+2);r=fo(this,o,e,i,c,u,h,x,y,b),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=o[m.materialIndex],x=Math.max(m.start,f.start),y=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let b=x,S=y;b<S;b+=3){const w=b,R=b+1,P=b+2;r=fo(this,p,e,i,c,u,h,w,R,P),r&&(r.faceIndex=Math.floor(b/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const g=Math.max(0,f.start),v=Math.min(l.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const x=m,y=m+1,b=m+2;r=fo(this,o,e,i,c,u,h,x,y,b),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}}}function Qf(n,e,t,i,r,s,o,a){let l;if(e.side===Fn?l=i.intersectTriangle(o,s,r,!0,a):l=i.intersectTriangle(r,s,o,e.side===Qi,a),l===null)return null;ho.copy(a),ho.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(ho);return c<t.near||c>t.far?null:{distance:c,point:ho.clone(),object:n}}function fo(n,e,t,i,r,s,o,a,l,c){n.getVertexPosition(a,ao),n.getVertexPosition(l,lo),n.getVertexPosition(c,co);const u=Qf(n,e,t,i,ao,lo,co,su);if(u){const h=new D;Yn.getBarycoord(su,ao,lo,co,h),r&&(u.uv=Yn.getInterpolatedAttribute(r,a,l,c,h,new xe)),s&&(u.uv1=Yn.getInterpolatedAttribute(s,a,l,c,h,new xe)),o&&(u.normal=Yn.getInterpolatedAttribute(o,a,l,c,h,new D),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const d={a,b:l,c,normal:new D,materialIndex:0};Yn.getNormal(ao,lo,co,d.normal),u.face=d,u.barycoord=h}return u}class cn extends hn{constructor(e=1,t=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],u=[],h=[];let d=0,f=0;g("z","y","x",-1,-1,i,t,e,o,s,0),g("z","y","x",1,-1,i,t,-e,o,s,1),g("x","z","y",1,1,e,i,t,r,o,2),g("x","z","y",1,-1,e,i,-t,r,o,3),g("x","y","z",1,-1,e,t,i,r,s,4),g("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new It(c,3)),this.setAttribute("normal",new It(u,3)),this.setAttribute("uv",new It(h,2));function g(v,m,p,x,y,b,S,w,R,P,T){const E=b/R,I=S/P,B=b/2,k=S/2,q=w/2,H=R+1,U=P+1;let $=0,V=0;const ae=new D;for(let ye=0;ye<U;ye++){const Le=ye*I-k;for(let Je=0;Je<H;Je++){const je=Je*E-B;ae[v]=je*x,ae[m]=Le*y,ae[p]=q,c.push(ae.x,ae.y,ae.z),ae[v]=0,ae[m]=0,ae[p]=w>0?1:-1,u.push(ae.x,ae.y,ae.z),h.push(Je/R),h.push(1-ye/P),$+=1}}for(let ye=0;ye<P;ye++)for(let Le=0;Le<R;Le++){const Je=d+Le+H*ye,je=d+Le+H*(ye+1),ht=d+(Le+1)+H*(ye+1),pt=d+(Le+1)+H*ye;l.push(Je,je,pt),l.push(je,ht,pt),V+=6}a.addGroup(f,V,T),f+=V,d+=$}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new cn(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function ss(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const r=n[t][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone():Array.isArray(r)?e[t][i]=r.slice():e[t][i]=r}}return e}function Cn(n){const e={};for(let t=0;t<n.length;t++){const i=ss(n[t]);for(const r in i)e[r]=i[r]}return e}function ep(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Nh(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Lt.workingColorSpace}const tp={clone:ss,merge:Cn};var np=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ip=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class er extends ls{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=np,this.fragmentShader=ip,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ss(e.uniforms),this.uniformsGroups=ep(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?t.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[r]={type:"m4",value:o.toArray()}:t.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class Oh extends un{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ht,this.projectionMatrix=new Ht,this.projectionMatrixInverse=new Ht,this.coordinateSystem=pi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Gi=new D,ou=new xe,au=new xe;class Xn extends Oh{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Os*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(jr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Os*2*Math.atan(Math.tan(jr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Gi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Gi.x,Gi.y).multiplyScalar(-e/Gi.z),Gi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Gi.x,Gi.y).multiplyScalar(-e/Gi.z)}getViewSize(e,t){return this.getViewBounds(e,ou,au),t.subVectors(au,ou)}setViewOffset(e,t,i,r,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(jr*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,t-=o.offsetY*i/c,r*=o.width/l,i*=o.height/c}const a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Br=-90,zr=1;class rp extends un{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Xn(Br,zr,e,t);r.layers=this.layers,this.add(r);const s=new Xn(Br,zr,e,t);s.layers=this.layers,this.add(s);const o=new Xn(Br,zr,e,t);o.layers=this.layers,this.add(o);const a=new Xn(Br,zr,e,t);a.layers=this.layers,this.add(a);const l=new Xn(Br,zr,e,t);l.layers=this.layers,this.add(l);const c=new Xn(Br,zr,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,r,s,o,a,l]=t;for(const c of t)this.remove(c);if(e===pi)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Io)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,l,c,u]=this.children,h=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(t,s),e.setRenderTarget(i,1,r),e.render(t,o),e.setRenderTarget(i,2,r),e.render(t,a),e.setRenderTarget(i,3,r),e.render(t,l),e.setRenderTarget(i,4,r),e.render(t,c),i.texture.generateMipmaps=v,e.setRenderTarget(i,5,r),e.render(t,u),e.setRenderTarget(h,d,f),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class Fh extends Dn{constructor(e=[],t=ns,i,r,s,o,a,l,c,u){super(e,t,i,r,s,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class sp extends vr{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new Fh(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new cn(5,5,5),s=new er({name:"CubemapFromEquirect",uniforms:ss(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Fn,blending:Zi});s.uniforms.tEquirect.value=t;const o=new Tn(r,s),a=t.minFilter;return t.minFilter===Yi&&(t.minFilter=si),new rp(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,i=!0,r=!0){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,r);e.setRenderTarget(s)}}class rn extends un{constructor(){super(),this.isGroup=!0,this.type="Group"}}const op={type:"move"};class Ca{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new rn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new rn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new rn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const v of e.hand.values()){const m=t.getJointPose(v,i),p=this._getHandJoint(c,v);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],d=u.position.distanceTo(h.position),f=.02,g=.005;c.inputState.pinching&&d>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(op)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new rn;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class tc{constructor(e,t=1,i=1e3){this.isFog=!0,this.name="",this.color=new Et(e),this.near=t,this.far=i}clone(){return new tc(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class ap extends un{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new li,this.environmentIntensity=1,this.environmentRotation=new li,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Pa=new D,lp=new D,cp=new dt;class Ri{constructor(e=new D(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const r=Pa.subVectors(i,t).cross(lp.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(Pa),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||cp.getNormalMatrix(e),r=this.coplanarPoint(Pa).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ar=new Wo,up=new xe(.5,.5),po=new D;class nc{constructor(e=new Ri,t=new Ri,i=new Ri,r=new Ri,s=new Ri,o=new Ri){this.planes=[e,t,i,r,s,o]}set(e,t,i,r,s,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=pi,i=!1){const r=this.planes,s=e.elements,o=s[0],a=s[1],l=s[2],c=s[3],u=s[4],h=s[5],d=s[6],f=s[7],g=s[8],v=s[9],m=s[10],p=s[11],x=s[12],y=s[13],b=s[14],S=s[15];if(r[0].setComponents(c-o,f-u,p-g,S-x).normalize(),r[1].setComponents(c+o,f+u,p+g,S+x).normalize(),r[2].setComponents(c+a,f+h,p+v,S+y).normalize(),r[3].setComponents(c-a,f-h,p-v,S-y).normalize(),i)r[4].setComponents(l,d,m,b).normalize(),r[5].setComponents(c-l,f-d,p-m,S-b).normalize();else if(r[4].setComponents(c-l,f-d,p-m,S-b).normalize(),t===pi)r[5].setComponents(c+l,f+d,p+m,S+b).normalize();else if(t===Io)r[5].setComponents(l,d,m,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ar.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ar.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ar)}intersectsSprite(e){ar.center.set(0,0,0);const t=up.distanceTo(e.center);return ar.radius=.7071067811865476+t,ar.applyMatrix4(e.matrixWorld),this.intersectsSphere(ar)}intersectsSphere(e){const t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const r=t[i];if(po.x=r.normal.x>0?e.max.x:e.min.x,po.y=r.normal.y>0?e.max.y:e.min.y,po.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(po)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class No extends ls{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Et(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Oo=new D,Fo=new D,lu=new Ht,xs=new $o,mo=new Wo,La=new D,cu=new D;class Dl extends un{constructor(e=new hn,t=new No){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let r=1,s=t.count;r<s;r++)Oo.fromBufferAttribute(t,r-1),Fo.fromBufferAttribute(t,r),i[r]=i[r-1],i[r]+=Oo.distanceTo(Fo);e.setAttribute("lineDistance",new It(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),mo.copy(i.boundingSphere),mo.applyMatrix4(r),mo.radius+=s,e.ray.intersectsSphere(mo)===!1)return;lu.copy(r).invert(),xs.copy(e.ray).applyMatrix4(lu);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=i.index,d=i.attributes.position;if(u!==null){const f=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let v=f,m=g-1;v<m;v+=c){const p=u.getX(v),x=u.getX(v+1),y=go(this,e,xs,l,p,x,v);y&&t.push(y)}if(this.isLineLoop){const v=u.getX(g-1),m=u.getX(f),p=go(this,e,xs,l,v,m,g-1);p&&t.push(p)}}else{const f=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let v=f,m=g-1;v<m;v+=c){const p=go(this,e,xs,l,v,v+1,v);p&&t.push(p)}if(this.isLineLoop){const v=go(this,e,xs,l,g-1,f,g-1);v&&t.push(v)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function go(n,e,t,i,r,s,o){const a=n.geometry.attributes.position;if(Oo.fromBufferAttribute(a,r),Fo.fromBufferAttribute(a,s),t.distanceSqToSegment(Oo,Fo,La,cu)>i)return;La.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(La);if(!(c<e.near||c>e.far))return{distance:c,point:cu.clone().applyMatrix4(n.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:n}}const uu=new D,hu=new D;class hp extends Dl{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let r=0,s=t.count;r<s;r+=2)uu.fromBufferAttribute(t,r),hu.fromBufferAttribute(t,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+uu.distanceTo(hu);e.setAttribute("lineDistance",new It(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Il extends Dn{constructor(e,t,i,r,s,o,a,l,c){super(e,t,i,r,s,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class kh extends Dn{constructor(e,t,i=gr,r,s,o,a=ai,l=ai,c,u=Us,h=1){if(u!==Us&&u!==Ns)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:t,depth:h};super(d,r,s,o,a,l,u,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Ql(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Bh extends Dn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class ic extends hn{constructor(e=1,t=1,i=4,r=8,s=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:i,radialSegments:r,heightSegments:s},t=Math.max(0,t),i=Math.max(1,Math.floor(i)),r=Math.max(3,Math.floor(r)),s=Math.max(1,Math.floor(s));const o=[],a=[],l=[],c=[],u=t/2,h=Math.PI/2*e,d=t,f=2*h+d,g=i*2+s,v=r+1,m=new D,p=new D;for(let x=0;x<=g;x++){let y=0,b=0,S=0,w=0;if(x<=i){const T=x/i,E=T*Math.PI/2;b=-u-e*Math.cos(E),S=e*Math.sin(E),w=-e*Math.cos(E),y=T*h}else if(x<=i+s){const T=(x-i)/s;b=-u+T*t,S=e,w=0,y=h+T*d}else{const T=(x-i-s)/i,E=T*Math.PI/2;b=u+e*Math.sin(E),S=e*Math.cos(E),w=e*Math.sin(E),y=h+d+T*h}const R=Math.max(0,Math.min(1,y/f));let P=0;x===0?P=.5/r:x===g&&(P=-.5/r);for(let T=0;T<=r;T++){const E=T/r,I=E*Math.PI*2,B=Math.sin(I),k=Math.cos(I);p.x=-S*k,p.y=b,p.z=S*B,a.push(p.x,p.y,p.z),m.set(-S*k,w,S*B),m.normalize(),l.push(m.x,m.y,m.z),c.push(E+P,R)}if(x>0){const T=(x-1)*v;for(let E=0;E<r;E++){const I=T+E,B=T+E+1,k=x*v+E,q=x*v+E+1;o.push(I,B,k),o.push(B,q,k)}}}this.setIndex(o),this.setAttribute("position",new It(a,3)),this.setAttribute("normal",new It(l,3)),this.setAttribute("uv",new It(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ic(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}}class yt extends hn{constructor(e=1,t=1,i=1,r=32,s=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:r,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:l};const c=this;r=Math.floor(r),s=Math.floor(s);const u=[],h=[],d=[],f=[];let g=0;const v=[],m=i/2;let p=0;x(),o===!1&&(e>0&&y(!0),t>0&&y(!1)),this.setIndex(u),this.setAttribute("position",new It(h,3)),this.setAttribute("normal",new It(d,3)),this.setAttribute("uv",new It(f,2));function x(){const b=new D,S=new D;let w=0;const R=(t-e)/i;for(let P=0;P<=s;P++){const T=[],E=P/s,I=E*(t-e)+e;for(let B=0;B<=r;B++){const k=B/r,q=k*l+a,H=Math.sin(q),U=Math.cos(q);S.x=I*H,S.y=-E*i+m,S.z=I*U,h.push(S.x,S.y,S.z),b.set(H,R,U).normalize(),d.push(b.x,b.y,b.z),f.push(k,1-E),T.push(g++)}v.push(T)}for(let P=0;P<r;P++)for(let T=0;T<s;T++){const E=v[T][P],I=v[T+1][P],B=v[T+1][P+1],k=v[T][P+1];(e>0||T!==0)&&(u.push(E,I,k),w+=3),(t>0||T!==s-1)&&(u.push(I,B,k),w+=3)}c.addGroup(p,w,0),p+=w}function y(b){const S=g,w=new xe,R=new D;let P=0;const T=b===!0?e:t,E=b===!0?1:-1;for(let B=1;B<=r;B++)h.push(0,m*E,0),d.push(0,E,0),f.push(.5,.5),g++;const I=g;for(let B=0;B<=r;B++){const q=B/r*l+a,H=Math.cos(q),U=Math.sin(q);R.x=T*U,R.y=m*E,R.z=T*H,h.push(R.x,R.y,R.z),d.push(0,E,0),w.x=H*.5+.5,w.y=U*.5*E+.5,f.push(w.x,w.y),g++}for(let B=0;B<r;B++){const k=S+B,q=I+B;b===!0?u.push(q,q+1,k):u.push(q+1,q,k),P+=3}c.addGroup(p,P,b===!0?1:2),p+=P}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new yt(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class rc extends yt{constructor(e=1,t=1,i=32,r=1,s=!1,o=0,a=Math.PI*2){super(0,e,t,i,r,s,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:r,openEnded:s,thetaStart:o,thetaLength:a}}static fromJSON(e){return new rc(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}const vo=new D,_o=new D,Da=new D,xo=new Yn;class dp extends hn{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){const r=Math.pow(10,4),s=Math.cos(jr*t),o=e.getIndex(),a=e.getAttribute("position"),l=o?o.count:a.count,c=[0,0,0],u=["a","b","c"],h=new Array(3),d={},f=[];for(let g=0;g<l;g+=3){o?(c[0]=o.getX(g),c[1]=o.getX(g+1),c[2]=o.getX(g+2)):(c[0]=g,c[1]=g+1,c[2]=g+2);const{a:v,b:m,c:p}=xo;if(v.fromBufferAttribute(a,c[0]),m.fromBufferAttribute(a,c[1]),p.fromBufferAttribute(a,c[2]),xo.getNormal(Da),h[0]=`${Math.round(v.x*r)},${Math.round(v.y*r)},${Math.round(v.z*r)}`,h[1]=`${Math.round(m.x*r)},${Math.round(m.y*r)},${Math.round(m.z*r)}`,h[2]=`${Math.round(p.x*r)},${Math.round(p.y*r)},${Math.round(p.z*r)}`,!(h[0]===h[1]||h[1]===h[2]||h[2]===h[0]))for(let x=0;x<3;x++){const y=(x+1)%3,b=h[x],S=h[y],w=xo[u[x]],R=xo[u[y]],P=`${b}_${S}`,T=`${S}_${b}`;T in d&&d[T]?(Da.dot(d[T].normal)<=s&&(f.push(w.x,w.y,w.z),f.push(R.x,R.y,R.z)),d[T]=null):P in d||(d[P]={index0:c[x],index1:c[y],normal:Da.clone()})}}for(const g in d)if(d[g]){const{index0:v,index1:m}=d[g];vo.fromBufferAttribute(a,v),_o.fromBufferAttribute(a,m),f.push(vo.x,vo.y,vo.z),f.push(_o.x,_o.y,_o.z)}this.setAttribute("position",new It(f,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class gi{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){const i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let i,r=this.getPoint(0),s=0;t.push(0);for(let o=1;o<=e;o++)i=this.getPoint(o/e),s+=i.distanceTo(r),t.push(s),r=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const i=this.getLengths();let r=0;const s=i.length;let o;t?o=t:o=e*i[s-1];let a=0,l=s-1,c;for(;a<=l;)if(r=Math.floor(a+(l-a)/2),c=i[r]-o,c<0)a=r+1;else if(c>0)l=r-1;else{l=r;break}if(r=l,i[r]===o)return r/(s-1);const u=i[r],d=i[r+1]-u,f=(o-u)/d;return(r+f)/(s-1)}getTangent(e,t){let r=e-1e-4,s=e+1e-4;r<0&&(r=0),s>1&&(s=1);const o=this.getPoint(r),a=this.getPoint(s),l=t||(o.isVector2?new xe:new D);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,t){const i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){const i=new D,r=[],s=[],o=[],a=new D,l=new Ht;for(let f=0;f<=e;f++){const g=f/e;r[f]=this.getTangentAt(g,new D)}s[0]=new D,o[0]=new D;let c=Number.MAX_VALUE;const u=Math.abs(r[0].x),h=Math.abs(r[0].y),d=Math.abs(r[0].z);u<=c&&(c=u,i.set(1,0,0)),h<=c&&(c=h,i.set(0,1,0)),d<=c&&i.set(0,0,1),a.crossVectors(r[0],i).normalize(),s[0].crossVectors(r[0],a),o[0].crossVectors(r[0],s[0]);for(let f=1;f<=e;f++){if(s[f]=s[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(r[f-1],r[f]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(ft(r[f-1].dot(r[f]),-1,1));s[f].applyMatrix4(l.makeRotationAxis(a,g))}o[f].crossVectors(r[f],s[f])}if(t===!0){let f=Math.acos(ft(s[0].dot(s[e]),-1,1));f/=e,r[0].dot(a.crossVectors(s[0],s[e]))>0&&(f=-f);for(let g=1;g<=e;g++)s[g].applyMatrix4(l.makeRotationAxis(r[g],f*g)),o[g].crossVectors(r[g],s[g])}return{tangents:r,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class sc extends gi{constructor(e=0,t=0,i=1,r=1,s=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=r,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(e,t=new xe){const i=t,r=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=r;for(;s>r;)s-=r;s<Number.EPSILON&&(o?s=0:s=r),this.aClockwise===!0&&!o&&(s===r?s=-r:s=s-r);const a=this.aStartAngle+e*s;let l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const u=Math.cos(this.aRotation),h=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*u-f*h+this.aX,c=d*h+f*u+this.aY}return i.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class fp extends sc{constructor(e,t,i,r,s,o){super(e,t,i,i,r,s,o),this.isArcCurve=!0,this.type="ArcCurve"}}function oc(){let n=0,e=0,t=0,i=0;function r(s,o,a,l){n=s,e=a,t=-3*s+3*o-2*a-l,i=2*s-2*o+a+l}return{initCatmullRom:function(s,o,a,l,c){r(o,a,c*(a-s),c*(l-o))},initNonuniformCatmullRom:function(s,o,a,l,c,u,h){let d=(o-s)/c-(a-s)/(c+u)+(a-o)/u,f=(a-o)/u-(l-o)/(u+h)+(l-a)/h;d*=u,f*=u,r(o,a,d,f)},calc:function(s){const o=s*s,a=o*s;return n+e*s+t*o+i*a}}}const bo=new D,Ia=new oc,Ua=new oc,Na=new oc;class ac extends gi{constructor(e=[],t=!1,i="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=r}getPoint(e,t=new D){const i=t,r=this.points,s=r.length,o=(s-(this.closed?0:1))*e;let a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/s)+1)*s:l===0&&a===s-1&&(a=s-2,l=1);let c,u;this.closed||a>0?c=r[(a-1)%s]:(bo.subVectors(r[0],r[1]).add(r[0]),c=bo);const h=r[a%s],d=r[(a+1)%s];if(this.closed||a+2<s?u=r[(a+2)%s]:(bo.subVectors(r[s-1],r[s-2]).add(r[s-1]),u=bo),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(h),f),v=Math.pow(h.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(u),f);v<1e-4&&(v=1),g<1e-4&&(g=v),m<1e-4&&(m=v),Ia.initNonuniformCatmullRom(c.x,h.x,d.x,u.x,g,v,m),Ua.initNonuniformCatmullRom(c.y,h.y,d.y,u.y,g,v,m),Na.initNonuniformCatmullRom(c.z,h.z,d.z,u.z,g,v,m)}else this.curveType==="catmullrom"&&(Ia.initCatmullRom(c.x,h.x,d.x,u.x,this.tension),Ua.initCatmullRom(c.y,h.y,d.y,u.y,this.tension),Na.initCatmullRom(c.z,h.z,d.z,u.z,this.tension));return i.set(Ia.calc(l),Ua.calc(l),Na.calc(l)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(r.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const r=this.points[t];e.points.push(r.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(new D().fromArray(r))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function du(n,e,t,i,r){const s=(i-e)*.5,o=(r-t)*.5,a=n*n,l=n*a;return(2*t-2*i+s+o)*l+(-3*t+3*i-2*s-o)*a+s*n+t}function pp(n,e){const t=1-n;return t*t*e}function mp(n,e){return 2*(1-n)*n*e}function gp(n,e){return n*n*e}function ws(n,e,t,i){return pp(n,e)+mp(n,t)+gp(n,i)}function vp(n,e){const t=1-n;return t*t*t*e}function _p(n,e){const t=1-n;return 3*t*t*n*e}function xp(n,e){return 3*(1-n)*n*n*e}function bp(n,e){return n*n*n*e}function As(n,e,t,i,r){return vp(n,e)+_p(n,t)+xp(n,i)+bp(n,r)}class zh extends gi{constructor(e=new xe,t=new xe,i=new xe,r=new xe){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=r}getPoint(e,t=new xe){const i=t,r=this.v0,s=this.v1,o=this.v2,a=this.v3;return i.set(As(e,r.x,s.x,o.x,a.x),As(e,r.y,s.y,o.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class yp extends gi{constructor(e=new D,t=new D,i=new D,r=new D){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=r}getPoint(e,t=new D){const i=t,r=this.v0,s=this.v1,o=this.v2,a=this.v3;return i.set(As(e,r.x,s.x,o.x,a.x),As(e,r.y,s.y,o.y,a.y),As(e,r.z,s.z,o.z,a.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Vh extends gi{constructor(e=new xe,t=new xe){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new xe){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new xe){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Mp extends gi{constructor(e=new D,t=new D){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new D){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new D){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Hh extends gi{constructor(e=new xe,t=new xe,i=new xe){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new xe){const i=t,r=this.v0,s=this.v1,o=this.v2;return i.set(ws(e,r.x,s.x,o.x),ws(e,r.y,s.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class lc extends gi{constructor(e=new D,t=new D,i=new D){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new D){const i=t,r=this.v0,s=this.v1,o=this.v2;return i.set(ws(e,r.x,s.x,o.x),ws(e,r.y,s.y,o.y),ws(e,r.z,s.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Gh extends gi{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new xe){const i=t,r=this.points,s=(r.length-1)*e,o=Math.floor(s),a=s-o,l=r[o===0?o:o-1],c=r[o],u=r[o>r.length-2?r.length-1:o+1],h=r[o>r.length-3?r.length-1:o+2];return i.set(du(a,l.x,c.x,u.x,h.x),du(a,l.y,c.y,u.y,h.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(r.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const r=this.points[t];e.points.push(r.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(new xe().fromArray(r))}return this}}var ko=Object.freeze({__proto__:null,ArcCurve:fp,CatmullRomCurve3:ac,CubicBezierCurve:zh,CubicBezierCurve3:yp,EllipseCurve:sc,LineCurve:Vh,LineCurve3:Mp,QuadraticBezierCurve:Hh,QuadraticBezierCurve3:lc,SplineCurve:Gh});class Sp extends gi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new ko[i](t,e))}return this}getPoint(e,t){const i=e*this.getLength(),r=this.getCurveLengths();let s=0;for(;s<r.length;){if(r[s]>=i){const o=r[s]-i,a=this.curves[s],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,t)}s++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let i=0,r=this.curves.length;i<r;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let i;for(let r=0,s=this.curves;r<s.length;r++){const o=s[r],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,l=o.getPoints(a);for(let c=0;c<l.length;c++){const u=l[c];i&&i.equals(u)||(t.push(u),i=u)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const r=e.curves[t];this.curves.push(r.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){const r=this.curves[t];e.curves.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const r=e.curves[t];this.curves.push(new ko[r.type]().fromJSON(r))}return this}}class fu extends Sp{constructor(e){super(),this.type="Path",this.currentPoint=new xe,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const i=new Vh(this.currentPoint.clone(),new xe(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,r){const s=new Hh(this.currentPoint.clone(),new xe(e,t),new xe(i,r));return this.curves.push(s),this.currentPoint.set(i,r),this}bezierCurveTo(e,t,i,r,s,o){const a=new zh(this.currentPoint.clone(),new xe(e,t),new xe(i,r),new xe(s,o));return this.curves.push(a),this.currentPoint.set(s,o),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),i=new Gh(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,r,s,o){const a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+a,t+l,i,r,s,o),this}absarc(e,t,i,r,s,o){return this.absellipse(e,t,i,i,r,s,o),this}ellipse(e,t,i,r,s,o,a,l){const c=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(e+c,t+u,i,r,s,o,a,l),this}absellipse(e,t,i,r,s,o,a,l){const c=new sc(e,t,i,r,s,o,a,l);if(this.curves.length>0){const h=c.getPoint(0);h.equals(this.currentPoint)||this.lineTo(h.x,h.y)}this.curves.push(c);const u=c.getPoint(1);return this.currentPoint.copy(u),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class Wh extends fu{constructor(e){super(e),this.uuid=br(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let i=0,r=this.holes.length;i<r;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const r=e.holes[t];this.holes.push(r.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){const r=this.holes[t];e.holes.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const r=e.holes[t];this.holes.push(new fu().fromJSON(r))}return this}}function Ep(n,e,t=2){const i=e&&e.length,r=i?e[0]*t:n.length;let s=$h(n,0,r,t,!0);const o=[];if(!s||s.next===s.prev)return o;let a,l,c;if(i&&(s=Cp(n,e,s,t)),n.length>80*t){a=1/0,l=1/0;let u=-1/0,h=-1/0;for(let d=t;d<r;d+=t){const f=n[d],g=n[d+1];f<a&&(a=f),g<l&&(l=g),f>u&&(u=f),g>h&&(h=g)}c=Math.max(u-a,h-l),c=c!==0?32767/c:0}return ks(s,o,t,a,l,c,0),o}function $h(n,e,t,i,r){let s;if(r===zp(n,e,t,i)>0)for(let o=e;o<t;o+=i)s=pu(o/i|0,n[o],n[o+1],s);else for(let o=t-i;o>=e;o-=i)s=pu(o/i|0,n[o],n[o+1],s);return s&&os(s,s.next)&&(zs(s),s=s.next),s}function _r(n,e){if(!n)return n;e||(e=n);let t=n,i;do if(i=!1,!t.steiner&&(os(t,t.next)||$t(t.prev,t,t.next)===0)){if(zs(t),t=e=t.prev,t===t.next)break;i=!0}else t=t.next;while(i||t!==e);return e}function ks(n,e,t,i,r,s,o){if(!n)return;!o&&s&&Up(n,i,r,s);let a=n;for(;n.prev!==n.next;){const l=n.prev,c=n.next;if(s?wp(n,i,r,s):Tp(n)){e.push(l.i,n.i,c.i),zs(n),n=c.next,a=c.next;continue}if(n=c,n===a){o?o===1?(n=Ap(_r(n),e),ks(n,e,t,i,r,s,2)):o===2&&Rp(n,e,t,i,r,s):ks(_r(n),e,t,i,r,s,1);break}}}function Tp(n){const e=n.prev,t=n,i=n.next;if($t(e,t,i)>=0)return!1;const r=e.x,s=t.x,o=i.x,a=e.y,l=t.y,c=i.y,u=Math.min(r,s,o),h=Math.min(a,l,c),d=Math.max(r,s,o),f=Math.max(a,l,c);let g=i.next;for(;g!==e;){if(g.x>=u&&g.x<=d&&g.y>=h&&g.y<=f&&Ms(r,a,s,l,o,c,g.x,g.y)&&$t(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function wp(n,e,t,i){const r=n.prev,s=n,o=n.next;if($t(r,s,o)>=0)return!1;const a=r.x,l=s.x,c=o.x,u=r.y,h=s.y,d=o.y,f=Math.min(a,l,c),g=Math.min(u,h,d),v=Math.max(a,l,c),m=Math.max(u,h,d),p=Ul(f,g,e,t,i),x=Ul(v,m,e,t,i);let y=n.prevZ,b=n.nextZ;for(;y&&y.z>=p&&b&&b.z<=x;){if(y.x>=f&&y.x<=v&&y.y>=g&&y.y<=m&&y!==r&&y!==o&&Ms(a,u,l,h,c,d,y.x,y.y)&&$t(y.prev,y,y.next)>=0||(y=y.prevZ,b.x>=f&&b.x<=v&&b.y>=g&&b.y<=m&&b!==r&&b!==o&&Ms(a,u,l,h,c,d,b.x,b.y)&&$t(b.prev,b,b.next)>=0))return!1;b=b.nextZ}for(;y&&y.z>=p;){if(y.x>=f&&y.x<=v&&y.y>=g&&y.y<=m&&y!==r&&y!==o&&Ms(a,u,l,h,c,d,y.x,y.y)&&$t(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;b&&b.z<=x;){if(b.x>=f&&b.x<=v&&b.y>=g&&b.y<=m&&b!==r&&b!==o&&Ms(a,u,l,h,c,d,b.x,b.y)&&$t(b.prev,b,b.next)>=0)return!1;b=b.nextZ}return!0}function Ap(n,e){let t=n;do{const i=t.prev,r=t.next.next;!os(i,r)&&Xh(i,t,t.next,r)&&Bs(i,r)&&Bs(r,i)&&(e.push(i.i,t.i,r.i),zs(t),zs(t.next),t=n=r),t=t.next}while(t!==n);return _r(t)}function Rp(n,e,t,i,r,s){let o=n;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&Fp(o,a)){let l=Yh(o,a);o=_r(o,o.next),l=_r(l,l.next),ks(o,e,t,i,r,s,0),ks(l,e,t,i,r,s,0);return}a=a.next}o=o.next}while(o!==n)}function Cp(n,e,t,i){const r=[];for(let s=0,o=e.length;s<o;s++){const a=e[s]*i,l=s<o-1?e[s+1]*i:n.length,c=$h(n,a,l,i,!1);c===c.next&&(c.steiner=!0),r.push(Op(c))}r.sort(Pp);for(let s=0;s<r.length;s++)t=Lp(r[s],t);return t}function Pp(n,e){let t=n.x-e.x;if(t===0&&(t=n.y-e.y,t===0)){const i=(n.next.y-n.y)/(n.next.x-n.x),r=(e.next.y-e.y)/(e.next.x-e.x);t=i-r}return t}function Lp(n,e){const t=Dp(n,e);if(!t)return e;const i=Yh(t,n);return _r(i,i.next),_r(t,t.next)}function Dp(n,e){let t=e;const i=n.x,r=n.y;let s=-1/0,o;if(os(n,t))return t;do{if(os(n,t.next))return t.next;if(r<=t.y&&r>=t.next.y&&t.next.y!==t.y){const h=t.x+(r-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(h<=i&&h>s&&(s=h,o=t.x<t.next.x?t:t.next,h===i))return o}t=t.next}while(t!==e);if(!o)return null;const a=o,l=o.x,c=o.y;let u=1/0;t=o;do{if(i>=t.x&&t.x>=l&&i!==t.x&&qh(r<c?i:s,r,l,c,r<c?s:i,r,t.x,t.y)){const h=Math.abs(r-t.y)/(i-t.x);Bs(t,n)&&(h<u||h===u&&(t.x>o.x||t.x===o.x&&Ip(o,t)))&&(o=t,u=h)}t=t.next}while(t!==a);return o}function Ip(n,e){return $t(n.prev,n,e.prev)<0&&$t(e.next,n,n.next)<0}function Up(n,e,t,i){let r=n;do r.z===0&&(r.z=Ul(r.x,r.y,e,t,i)),r.prevZ=r.prev,r.nextZ=r.next,r=r.next;while(r!==n);r.prevZ.nextZ=null,r.prevZ=null,Np(r)}function Np(n){let e,t=1;do{let i=n,r;n=null;let s=null;for(e=0;i;){e++;let o=i,a=0;for(let c=0;c<t&&(a++,o=o.nextZ,!!o);c++);let l=t;for(;a>0||l>0&&o;)a!==0&&(l===0||!o||i.z<=o.z)?(r=i,i=i.nextZ,a--):(r=o,o=o.nextZ,l--),s?s.nextZ=r:n=r,r.prevZ=s,s=r;i=o}s.nextZ=null,t*=2}while(e>1);return n}function Ul(n,e,t,i,r){return n=(n-t)*r|0,e=(e-i)*r|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,n|e<<1}function Op(n){let e=n,t=n;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==n);return t}function qh(n,e,t,i,r,s,o,a){return(r-o)*(e-a)>=(n-o)*(s-a)&&(n-o)*(i-a)>=(t-o)*(e-a)&&(t-o)*(s-a)>=(r-o)*(i-a)}function Ms(n,e,t,i,r,s,o,a){return!(n===o&&e===a)&&qh(n,e,t,i,r,s,o,a)}function Fp(n,e){return n.next.i!==e.i&&n.prev.i!==e.i&&!kp(n,e)&&(Bs(n,e)&&Bs(e,n)&&Bp(n,e)&&($t(n.prev,n,e.prev)||$t(n,e.prev,e))||os(n,e)&&$t(n.prev,n,n.next)>0&&$t(e.prev,e,e.next)>0)}function $t(n,e,t){return(e.y-n.y)*(t.x-e.x)-(e.x-n.x)*(t.y-e.y)}function os(n,e){return n.x===e.x&&n.y===e.y}function Xh(n,e,t,i){const r=Mo($t(n,e,t)),s=Mo($t(n,e,i)),o=Mo($t(t,i,n)),a=Mo($t(t,i,e));return!!(r!==s&&o!==a||r===0&&yo(n,t,e)||s===0&&yo(n,i,e)||o===0&&yo(t,n,i)||a===0&&yo(t,e,i))}function yo(n,e,t){return e.x<=Math.max(n.x,t.x)&&e.x>=Math.min(n.x,t.x)&&e.y<=Math.max(n.y,t.y)&&e.y>=Math.min(n.y,t.y)}function Mo(n){return n>0?1:n<0?-1:0}function kp(n,e){let t=n;do{if(t.i!==n.i&&t.next.i!==n.i&&t.i!==e.i&&t.next.i!==e.i&&Xh(t,t.next,n,e))return!0;t=t.next}while(t!==n);return!1}function Bs(n,e){return $t(n.prev,n,n.next)<0?$t(n,e,n.next)>=0&&$t(n,n.prev,e)>=0:$t(n,e,n.prev)<0||$t(n,n.next,e)<0}function Bp(n,e){let t=n,i=!1;const r=(n.x+e.x)/2,s=(n.y+e.y)/2;do t.y>s!=t.next.y>s&&t.next.y!==t.y&&r<(t.next.x-t.x)*(s-t.y)/(t.next.y-t.y)+t.x&&(i=!i),t=t.next;while(t!==n);return i}function Yh(n,e){const t=Nl(n.i,n.x,n.y),i=Nl(e.i,e.x,e.y),r=n.next,s=e.prev;return n.next=e,e.prev=n,t.next=r,r.prev=t,i.next=t,t.prev=i,s.next=i,i.prev=s,i}function pu(n,e,t,i){const r=Nl(n,e,t);return i?(r.next=i.next,r.prev=i,i.next.prev=r,i.next=r):(r.prev=r,r.next=r),r}function zs(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Nl(n,e,t){return{i:n,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function zp(n,e,t,i){let r=0;for(let s=e,o=t-i;s<t;s+=i)r+=(n[o]-n[s])*(n[s+1]+n[o+1]),o=s;return r}class Vp{static triangulate(e,t,i=2){return Ep(e,t,i)}}class $r{static area(e){const t=e.length;let i=0;for(let r=t-1,s=0;s<t;r=s++)i+=e[r].x*e[s].y-e[s].x*e[r].y;return i*.5}static isClockWise(e){return $r.area(e)<0}static triangulateShape(e,t){const i=[],r=[],s=[];mu(e),gu(i,e);let o=e.length;t.forEach(mu);for(let l=0;l<t.length;l++)r.push(o),o+=t[l].length,gu(i,t[l]);const a=Vp.triangulate(i,r);for(let l=0;l<a.length;l+=3)s.push(a.slice(l,l+3));return s}}function mu(n){const e=n.length;e>2&&n[e-1].equals(n[0])&&n.pop()}function gu(n,e){for(let t=0;t<e.length;t++)n.push(e[t].x),n.push(e[t].y)}class cc extends hn{constructor(e=new Wh([new xe(.5,.5),new xe(-.5,.5),new xe(-.5,-.5),new xe(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const i=this,r=[],s=[];for(let a=0,l=e.length;a<l;a++){const c=e[a];o(c)}this.setAttribute("position",new It(r,3)),this.setAttribute("uv",new It(s,2)),this.computeVertexNormals();function o(a){const l=[],c=t.curveSegments!==void 0?t.curveSegments:12,u=t.steps!==void 0?t.steps:1,h=t.depth!==void 0?t.depth:1;let d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:f-.1,v=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3;const p=t.extrudePath,x=t.UVGenerator!==void 0?t.UVGenerator:Hp;let y,b=!1,S,w,R,P;p&&(y=p.getSpacedPoints(u),b=!0,d=!1,S=p.computeFrenetFrames(u,!1),w=new D,R=new D,P=new D),d||(m=0,f=0,g=0,v=0);const T=a.extractPoints(c);let E=T.shape;const I=T.holes;if(!$r.isClockWise(E)){E=E.reverse();for(let ue=0,oe=I.length;ue<oe;ue++){const re=I[ue];$r.isClockWise(re)&&(I[ue]=re.reverse())}}function k(ue){const re=10000000000000001e-36;let ie=ue[0];for(let Me=1;Me<=ue.length;Me++){const fe=Me%ue.length,be=ue[fe],it=be.x-ie.x,rt=be.y-ie.y,L=it*it+rt*rt,M=Math.max(Math.abs(be.x),Math.abs(be.y),Math.abs(ie.x),Math.abs(ie.y)),j=re*M*M;if(L<=j){ue.splice(fe,1),Me--;continue}ie=be}}k(E),I.forEach(k);const q=I.length,H=E;for(let ue=0;ue<q;ue++){const oe=I[ue];E=E.concat(oe)}function U(ue,oe,re){return oe||console.error("THREE.ExtrudeGeometry: vec does not exist"),ue.clone().addScaledVector(oe,re)}const $=E.length;function V(ue,oe,re){let ie,Me,fe;const be=ue.x-oe.x,it=ue.y-oe.y,rt=re.x-ue.x,L=re.y-ue.y,M=be*be+it*it,j=be*L-it*rt;if(Math.abs(j)>Number.EPSILON){const Q=Math.sqrt(M),he=Math.sqrt(rt*rt+L*L),ee=oe.x-it/Q,$e=oe.y+be/Q,de=re.x-L/he,Ge=re.y+rt/he,Ne=((de-ee)*L-(Ge-$e)*rt)/(be*L-it*rt);ie=ee+be*Ne-ue.x,Me=$e+it*Ne-ue.y;const pe=ie*ie+Me*Me;if(pe<=2)return new xe(ie,Me);fe=Math.sqrt(pe/2)}else{let Q=!1;be>Number.EPSILON?rt>Number.EPSILON&&(Q=!0):be<-Number.EPSILON?rt<-Number.EPSILON&&(Q=!0):Math.sign(it)===Math.sign(L)&&(Q=!0),Q?(ie=-it,Me=be,fe=Math.sqrt(M)):(ie=be,Me=it,fe=Math.sqrt(M/2))}return new xe(ie/fe,Me/fe)}const ae=[];for(let ue=0,oe=H.length,re=oe-1,ie=ue+1;ue<oe;ue++,re++,ie++)re===oe&&(re=0),ie===oe&&(ie=0),ae[ue]=V(H[ue],H[re],H[ie]);const ye=[];let Le,Je=ae.concat();for(let ue=0,oe=q;ue<oe;ue++){const re=I[ue];Le=[];for(let ie=0,Me=re.length,fe=Me-1,be=ie+1;ie<Me;ie++,fe++,be++)fe===Me&&(fe=0),be===Me&&(be=0),Le[ie]=V(re[ie],re[fe],re[be]);ye.push(Le),Je=Je.concat(Le)}let je;if(m===0)je=$r.triangulateShape(H,I);else{const ue=[],oe=[];for(let re=0;re<m;re++){const ie=re/m,Me=f*Math.cos(ie*Math.PI/2),fe=g*Math.sin(ie*Math.PI/2)+v;for(let be=0,it=H.length;be<it;be++){const rt=U(H[be],ae[be],fe);He(rt.x,rt.y,-Me),ie===0&&ue.push(rt)}for(let be=0,it=q;be<it;be++){const rt=I[be];Le=ye[be];const L=[];for(let M=0,j=rt.length;M<j;M++){const Q=U(rt[M],Le[M],fe);He(Q.x,Q.y,-Me),ie===0&&L.push(Q)}ie===0&&oe.push(L)}}je=$r.triangulateShape(ue,oe)}const ht=je.length,pt=g+v;for(let ue=0;ue<$;ue++){const oe=d?U(E[ue],Je[ue],pt):E[ue];b?(R.copy(S.normals[0]).multiplyScalar(oe.x),w.copy(S.binormals[0]).multiplyScalar(oe.y),P.copy(y[0]).add(R).add(w),He(P.x,P.y,P.z)):He(oe.x,oe.y,0)}for(let ue=1;ue<=u;ue++)for(let oe=0;oe<$;oe++){const re=d?U(E[oe],Je[oe],pt):E[oe];b?(R.copy(S.normals[ue]).multiplyScalar(re.x),w.copy(S.binormals[ue]).multiplyScalar(re.y),P.copy(y[ue]).add(R).add(w),He(P.x,P.y,P.z)):He(re.x,re.y,h/u*ue)}for(let ue=m-1;ue>=0;ue--){const oe=ue/m,re=f*Math.cos(oe*Math.PI/2),ie=g*Math.sin(oe*Math.PI/2)+v;for(let Me=0,fe=H.length;Me<fe;Me++){const be=U(H[Me],ae[Me],ie);He(be.x,be.y,h+re)}for(let Me=0,fe=I.length;Me<fe;Me++){const be=I[Me];Le=ye[Me];for(let it=0,rt=be.length;it<rt;it++){const L=U(be[it],Le[it],ie);b?He(L.x,L.y+y[u-1].y,y[u-1].x+re):He(L.x,L.y,h+re)}}}J(),le();function J(){const ue=r.length/3;if(d){let oe=0,re=$*oe;for(let ie=0;ie<ht;ie++){const Me=je[ie];We(Me[2]+re,Me[1]+re,Me[0]+re)}oe=u+m*2,re=$*oe;for(let ie=0;ie<ht;ie++){const Me=je[ie];We(Me[0]+re,Me[1]+re,Me[2]+re)}}else{for(let oe=0;oe<ht;oe++){const re=je[oe];We(re[2],re[1],re[0])}for(let oe=0;oe<ht;oe++){const re=je[oe];We(re[0]+$*u,re[1]+$*u,re[2]+$*u)}}i.addGroup(ue,r.length/3-ue,0)}function le(){const ue=r.length/3;let oe=0;_e(H,oe),oe+=H.length;for(let re=0,ie=I.length;re<ie;re++){const Me=I[re];_e(Me,oe),oe+=Me.length}i.addGroup(ue,r.length/3-ue,1)}function _e(ue,oe){let re=ue.length;for(;--re>=0;){const ie=re;let Me=re-1;Me<0&&(Me=ue.length-1);for(let fe=0,be=u+m*2;fe<be;fe++){const it=$*fe,rt=$*(fe+1),L=oe+ie+it,M=oe+Me+it,j=oe+Me+rt,Q=oe+ie+rt;nt(L,M,j,Q)}}}function He(ue,oe,re){l.push(ue),l.push(oe),l.push(re)}function We(ue,oe,re){wt(ue),wt(oe),wt(re);const ie=r.length/3,Me=x.generateTopUV(i,r,ie-3,ie-2,ie-1);F(Me[0]),F(Me[1]),F(Me[2])}function nt(ue,oe,re,ie){wt(ue),wt(oe),wt(ie),wt(oe),wt(re),wt(ie);const Me=r.length/3,fe=x.generateSideWallUV(i,r,Me-6,Me-3,Me-2,Me-1);F(fe[0]),F(fe[1]),F(fe[3]),F(fe[1]),F(fe[2]),F(fe[3])}function wt(ue){r.push(l[ue*3+0]),r.push(l[ue*3+1]),r.push(l[ue*3+2])}function F(ue){s.push(ue.x),s.push(ue.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,i=this.parameters.options;return Gp(t,i,e)}static fromJSON(e,t){const i=[];for(let s=0,o=e.shapes.length;s<o;s++){const a=t[e.shapes[s]];i.push(a)}const r=e.options.extrudePath;return r!==void 0&&(e.options.extrudePath=new ko[r.type]().fromJSON(r)),new cc(i,e.options)}}const Hp={generateTopUV:function(n,e,t,i,r){const s=e[t*3],o=e[t*3+1],a=e[i*3],l=e[i*3+1],c=e[r*3],u=e[r*3+1];return[new xe(s,o),new xe(a,l),new xe(c,u)]},generateSideWallUV:function(n,e,t,i,r,s){const o=e[t*3],a=e[t*3+1],l=e[t*3+2],c=e[i*3],u=e[i*3+1],h=e[i*3+2],d=e[r*3],f=e[r*3+1],g=e[r*3+2],v=e[s*3],m=e[s*3+1],p=e[s*3+2];return Math.abs(a-u)<Math.abs(o-c)?[new xe(o,1-l),new xe(c,1-h),new xe(d,1-g),new xe(v,1-p)]:[new xe(a,1-l),new xe(u,1-h),new xe(f,1-g),new xe(m,1-p)]}};function Gp(n,e,t){if(t.shapes=[],Array.isArray(n))for(let i=0,r=n.length;i<r;i++){const s=n[i];t.shapes.push(s.uuid)}else t.shapes.push(n.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class uc extends hn{constructor(e=[new xe(0,-.5),new xe(.5,0),new xe(0,.5)],t=12,i=0,r=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:i,phiLength:r},t=Math.floor(t),r=ft(r,0,Math.PI*2);const s=[],o=[],a=[],l=[],c=[],u=1/t,h=new D,d=new xe,f=new D,g=new D,v=new D;let m=0,p=0;for(let x=0;x<=e.length-1;x++)switch(x){case 0:m=e[x+1].x-e[x].x,p=e[x+1].y-e[x].y,f.x=p*1,f.y=-m,f.z=p*0,v.copy(f),f.normalize(),l.push(f.x,f.y,f.z);break;case e.length-1:l.push(v.x,v.y,v.z);break;default:m=e[x+1].x-e[x].x,p=e[x+1].y-e[x].y,f.x=p*1,f.y=-m,f.z=p*0,g.copy(f),f.x+=v.x,f.y+=v.y,f.z+=v.z,f.normalize(),l.push(f.x,f.y,f.z),v.copy(g)}for(let x=0;x<=t;x++){const y=i+x*u*r,b=Math.sin(y),S=Math.cos(y);for(let w=0;w<=e.length-1;w++){h.x=e[w].x*b,h.y=e[w].y,h.z=e[w].x*S,o.push(h.x,h.y,h.z),d.x=x/t,d.y=w/(e.length-1),a.push(d.x,d.y);const R=l[3*w+0]*b,P=l[3*w+1],T=l[3*w+0]*S;c.push(R,P,T)}}for(let x=0;x<t;x++)for(let y=0;y<e.length-1;y++){const b=y+x*e.length,S=b,w=b+e.length,R=b+e.length+1,P=b+1;s.push(S,w,P),s.push(R,P,w)}this.setIndex(s),this.setAttribute("position",new It(o,3)),this.setAttribute("uv",new It(a,2)),this.setAttribute("normal",new It(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new uc(e.points,e.segments,e.phiStart,e.phiLength)}}class Di extends hn{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};const s=e/2,o=t/2,a=Math.floor(i),l=Math.floor(r),c=a+1,u=l+1,h=e/a,d=t/l,f=[],g=[],v=[],m=[];for(let p=0;p<u;p++){const x=p*d-o;for(let y=0;y<c;y++){const b=y*h-s;g.push(b,-x,0),v.push(0,0,1),m.push(y/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let x=0;x<a;x++){const y=x+c*p,b=x+c*(p+1),S=x+1+c*(p+1),w=x+1+c*p;f.push(y,b,w),f.push(b,S,w)}this.setIndex(f),this.setAttribute("position",new It(g,3)),this.setAttribute("normal",new It(v,3)),this.setAttribute("uv",new It(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Di(e.width,e.height,e.widthSegments,e.heightSegments)}}class Ai extends hn{constructor(e=1,t=32,i=16,r=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:r,phiLength:s,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const l=Math.min(o+a,Math.PI);let c=0;const u=[],h=new D,d=new D,f=[],g=[],v=[],m=[];for(let p=0;p<=i;p++){const x=[],y=p/i;let b=0;p===0&&o===0?b=.5/t:p===i&&l===Math.PI&&(b=-.5/t);for(let S=0;S<=t;S++){const w=S/t;h.x=-e*Math.cos(r+w*s)*Math.sin(o+y*a),h.y=e*Math.cos(o+y*a),h.z=e*Math.sin(r+w*s)*Math.sin(o+y*a),g.push(h.x,h.y,h.z),d.copy(h).normalize(),v.push(d.x,d.y,d.z),m.push(w+b,1-y),x.push(c++)}u.push(x)}for(let p=0;p<i;p++)for(let x=0;x<t;x++){const y=u[p][x+1],b=u[p][x],S=u[p+1][x],w=u[p+1][x+1];(p!==0||o>0)&&f.push(y,b,w),(p!==i-1||l<Math.PI)&&f.push(b,S,w)}this.setIndex(f),this.setAttribute("position",new It(g,3)),this.setAttribute("normal",new It(v,3)),this.setAttribute("uv",new It(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ai(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class $i extends hn{constructor(e=1,t=.4,i=12,r=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:r,arc:s},i=Math.floor(i),r=Math.floor(r);const o=[],a=[],l=[],c=[],u=new D,h=new D,d=new D;for(let f=0;f<=i;f++)for(let g=0;g<=r;g++){const v=g/r*s,m=f/i*Math.PI*2;h.x=(e+t*Math.cos(m))*Math.cos(v),h.y=(e+t*Math.cos(m))*Math.sin(v),h.z=t*Math.sin(m),a.push(h.x,h.y,h.z),u.x=e*Math.cos(v),u.y=e*Math.sin(v),d.subVectors(h,u).normalize(),l.push(d.x,d.y,d.z),c.push(g/r),c.push(f/i)}for(let f=1;f<=i;f++)for(let g=1;g<=r;g++){const v=(r+1)*f+g-1,m=(r+1)*(f-1)+g-1,p=(r+1)*(f-1)+g,x=(r+1)*f+g;o.push(v,m,x),o.push(m,p,x)}this.setIndex(o),this.setAttribute("position",new It(a,3)),this.setAttribute("normal",new It(l,3)),this.setAttribute("uv",new It(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new $i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class qo extends hn{constructor(e=new lc(new D(-1,-1,0),new D(-1,1,0),new D(1,1,0)),t=64,i=1,r=8,s=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:i,radialSegments:r,closed:s};const o=e.computeFrenetFrames(t,s);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;const a=new D,l=new D,c=new xe;let u=new D;const h=[],d=[],f=[],g=[];v(),this.setIndex(g),this.setAttribute("position",new It(h,3)),this.setAttribute("normal",new It(d,3)),this.setAttribute("uv",new It(f,2));function v(){for(let y=0;y<t;y++)m(y);m(s===!1?t:0),x(),p()}function m(y){u=e.getPointAt(y/t,u);const b=o.normals[y],S=o.binormals[y];for(let w=0;w<=r;w++){const R=w/r*Math.PI*2,P=Math.sin(R),T=-Math.cos(R);l.x=T*b.x+P*S.x,l.y=T*b.y+P*S.y,l.z=T*b.z+P*S.z,l.normalize(),d.push(l.x,l.y,l.z),a.x=u.x+i*l.x,a.y=u.y+i*l.y,a.z=u.z+i*l.z,h.push(a.x,a.y,a.z)}}function p(){for(let y=1;y<=t;y++)for(let b=1;b<=r;b++){const S=(r+1)*(y-1)+(b-1),w=(r+1)*y+(b-1),R=(r+1)*y+b,P=(r+1)*(y-1)+b;g.push(S,w,P),g.push(w,R,P)}}function x(){for(let y=0;y<=t;y++)for(let b=0;b<=r;b++)c.x=y/t,c.y=b/r,f.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new qo(new ko[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}}class hc extends ls{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Et(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Et(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Rh,this.normalScale=new xe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new li,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Wp extends ls{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=cf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class $p extends ls{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class qp extends No{constructor(e){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}}class jh extends un{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Et(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class Xp extends jh{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(un.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Et(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Oa=new Ht,vu=new D,_u=new D;class Yp{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new xe(512,512),this.mapType=mi,this.map=null,this.mapPass=null,this.matrix=new Ht,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new nc,this._frameExtents=new xe(1,1),this._viewportCount=1,this._viewports=[new Yt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;vu.setFromMatrixPosition(e.matrixWorld),t.position.copy(vu),_u.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(_u),t.updateMatrixWorld(),Oa.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Oa,t.coordinateSystem,t.reversedDepth),t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Oa)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class Zh extends Oh{constructor(e=-1,t=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,o=i+e,a=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class jp extends Yp{constructor(){super(new Zh(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class xu extends jh{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(un.DEFAULT_UP),this.updateMatrix(),this.target=new un,this.shadow=new jp}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Zp extends Xn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const bu=new Ht;class Kp{constructor(e,t,i=0,r=1/0){this.ray=new $o(e,t),this.near=i,this.far=r,this.camera=null,this.layers=new ec,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return bu.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(bu),this}intersectObject(e,t=!0,i=[]){return Ol(e,this,i,t),i.sort(yu),i}intersectObjects(e,t=!0,i=[]){for(let r=0,s=e.length;r<s;r++)Ol(e[r],this,i,t);return i.sort(yu),i}}function yu(n,e){return n.distance-e.distance}function Ol(n,e,t,i){let r=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(r=!1),r===!0&&i===!0){const s=n.children;for(let o=0,a=s.length;o<a;o++)Ol(s[o],e,t,!0)}}class Mu{constructor(e=1,t=0,i=0){this.radius=e,this.phi=t,this.theta=i}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=ft(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(ft(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class Jp extends xr{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function Su(n,e,t,i){const r=Qp(i);switch(t){case Eh:return n*e;case wh:return n*e/r.components*r.byteLength;case jl:return n*e/r.components*r.byteLength;case Ah:return n*e*2/r.components*r.byteLength;case Zl:return n*e*2/r.components*r.byteLength;case Th:return n*e*3/r.components*r.byteLength;case oi:return n*e*4/r.components*r.byteLength;case Kl:return n*e*4/r.components*r.byteLength;case Ao:case Ro:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Co:case Po:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case sl:case al:return Math.max(n,16)*Math.max(e,8)/4;case rl:case ol:return Math.max(n,8)*Math.max(e,8)/2;case ll:case cl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case ul:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case hl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case dl:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case fl:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case pl:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case ml:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case gl:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case vl:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case _l:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case xl:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case bl:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case yl:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Ml:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case Sl:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case El:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Tl:case wl:case Al:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Rl:case Cl:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Pl:case Ll:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Qp(n){switch(n){case mi:case bh:return{byteLength:1,components:1};case Ds:case yh:case Hs:return{byteLength:2,components:1};case Xl:case Yl:return{byteLength:2,components:4};case gr:case ql:case Li:return{byteLength:4,components:1};case Mh:case Sh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:$l}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=$l);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Kh(){let n=null,e=!1,t=null,i=null;function r(s,o){t(s,o),i=n.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function em(n){const e=new WeakMap;function t(a,l){const c=a.array,u=a.usage,h=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,u),a.onUploadCallback();let f;if(c instanceof Float32Array)f=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=n.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=n.SHORT;else if(c instanceof Uint32Array)f=n.UNSIGNED_INT;else if(c instanceof Int32Array)f=n.INT;else if(c instanceof Int8Array)f=n.BYTE;else if(c instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:h}}function i(a,l,c){const u=l.array,h=l.updateRanges;if(n.bindBuffer(c,a),h.length===0)n.bufferSubData(c,0,u);else{h.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<h.length;f++){const g=h[d],v=h[f];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++d,h[d]=v)}h.length=d+1;for(let f=0,g=h.length;f<g;f++){const v=h[f];n.bufferSubData(c,v.start*u.BYTES_PER_ELEMENT,u,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);l&&(n.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:r,remove:s,update:o}}var tm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,nm=`#ifdef USE_ALPHAHASH
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
#endif`,im=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,rm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,sm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,om=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,am=`#ifdef USE_AOMAP
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
#endif`,lm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,cm=`#ifdef USE_BATCHING
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
#endif`,um=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,hm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,dm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,fm=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,pm=`#ifdef USE_IRIDESCENCE
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
#endif`,mm=`#ifdef USE_BUMPMAP
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
#endif`,gm=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,vm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,_m=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,xm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,bm=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,ym=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Mm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Sm=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Em=`#define PI 3.141592653589793
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
} // validated`,Tm=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,wm=`vec3 transformedNormal = objectNormal;
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
#endif`,Am=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Rm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Cm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Pm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Lm="gl_FragColor = linearToOutputTexel( gl_FragColor );",Dm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Im=`#ifdef USE_ENVMAP
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
#endif`,Um=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Nm=`#ifdef USE_ENVMAP
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
#endif`,Om=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Fm=`#ifdef USE_ENVMAP
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
#endif`,km=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Bm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,zm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Vm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Hm=`#ifdef USE_GRADIENTMAP
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
}`,Gm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Wm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,$m=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,qm=`uniform bool receiveShadow;
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
#endif`,Xm=`#ifdef USE_ENVMAP
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
#endif`,Ym=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,jm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Zm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Km=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Jm=`PhysicalMaterial material;
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
#endif`,Qm=`struct PhysicalMaterial {
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
}`,e0=`
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
#endif`,t0=`#if defined( RE_IndirectDiffuse )
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
#endif`,n0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,i0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,r0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,s0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,o0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,a0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,l0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,c0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,u0=`#if defined( USE_POINTS_UV )
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
#endif`,h0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,d0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,f0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,p0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,m0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,g0=`#ifdef USE_MORPHTARGETS
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
#endif`,v0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,_0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,x0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,b0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,y0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,M0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,S0=`#ifdef USE_NORMALMAP
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
#endif`,E0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,T0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,w0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,A0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,R0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,C0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,P0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,L0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,D0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,I0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,U0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,N0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,O0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,F0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,k0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,B0=`float getShadowMask() {
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
}`,z0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,V0=`#ifdef USE_SKINNING
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
#endif`,H0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,G0=`#ifdef USE_SKINNING
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
#endif`,W0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,$0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,q0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,X0=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Y0=`#ifdef USE_TRANSMISSION
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
#endif`,j0=`#ifdef USE_TRANSMISSION
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
#endif`,Z0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,K0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,J0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Q0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const eg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,tg=`uniform sampler2D t2D;
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
}`,ng=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ig=`#ifdef ENVMAP_TYPE_CUBE
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
}`,rg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,sg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,og=`#include <common>
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
}`,ag=`#if DEPTH_PACKING == 3200
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
}`,lg=`#define DISTANCE
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
}`,cg=`#define DISTANCE
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
}`,ug=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,hg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,dg=`uniform float scale;
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
}`,fg=`uniform vec3 diffuse;
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
}`,pg=`#include <common>
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
}`,mg=`uniform vec3 diffuse;
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
}`,gg=`#define LAMBERT
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
}`,vg=`#define LAMBERT
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
}`,_g=`#define MATCAP
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
}`,xg=`#define MATCAP
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
}`,bg=`#define NORMAL
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
}`,yg=`#define NORMAL
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
}`,Mg=`#define PHONG
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
}`,Sg=`#define PHONG
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
}`,Eg=`#define STANDARD
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
}`,Tg=`#define STANDARD
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
}`,wg=`#define TOON
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
}`,Ag=`#define TOON
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
}`,Rg=`uniform float size;
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
}`,Cg=`uniform vec3 diffuse;
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
}`,Pg=`#include <common>
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
}`,Lg=`uniform vec3 color;
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
}`,Dg=`uniform float rotation;
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
}`,Ig=`uniform vec3 diffuse;
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
}`,gt={alphahash_fragment:tm,alphahash_pars_fragment:nm,alphamap_fragment:im,alphamap_pars_fragment:rm,alphatest_fragment:sm,alphatest_pars_fragment:om,aomap_fragment:am,aomap_pars_fragment:lm,batching_pars_vertex:cm,batching_vertex:um,begin_vertex:hm,beginnormal_vertex:dm,bsdfs:fm,iridescence_fragment:pm,bumpmap_pars_fragment:mm,clipping_planes_fragment:gm,clipping_planes_pars_fragment:vm,clipping_planes_pars_vertex:_m,clipping_planes_vertex:xm,color_fragment:bm,color_pars_fragment:ym,color_pars_vertex:Mm,color_vertex:Sm,common:Em,cube_uv_reflection_fragment:Tm,defaultnormal_vertex:wm,displacementmap_pars_vertex:Am,displacementmap_vertex:Rm,emissivemap_fragment:Cm,emissivemap_pars_fragment:Pm,colorspace_fragment:Lm,colorspace_pars_fragment:Dm,envmap_fragment:Im,envmap_common_pars_fragment:Um,envmap_pars_fragment:Nm,envmap_pars_vertex:Om,envmap_physical_pars_fragment:Xm,envmap_vertex:Fm,fog_vertex:km,fog_pars_vertex:Bm,fog_fragment:zm,fog_pars_fragment:Vm,gradientmap_pars_fragment:Hm,lightmap_pars_fragment:Gm,lights_lambert_fragment:Wm,lights_lambert_pars_fragment:$m,lights_pars_begin:qm,lights_toon_fragment:Ym,lights_toon_pars_fragment:jm,lights_phong_fragment:Zm,lights_phong_pars_fragment:Km,lights_physical_fragment:Jm,lights_physical_pars_fragment:Qm,lights_fragment_begin:e0,lights_fragment_maps:t0,lights_fragment_end:n0,logdepthbuf_fragment:i0,logdepthbuf_pars_fragment:r0,logdepthbuf_pars_vertex:s0,logdepthbuf_vertex:o0,map_fragment:a0,map_pars_fragment:l0,map_particle_fragment:c0,map_particle_pars_fragment:u0,metalnessmap_fragment:h0,metalnessmap_pars_fragment:d0,morphinstance_vertex:f0,morphcolor_vertex:p0,morphnormal_vertex:m0,morphtarget_pars_vertex:g0,morphtarget_vertex:v0,normal_fragment_begin:_0,normal_fragment_maps:x0,normal_pars_fragment:b0,normal_pars_vertex:y0,normal_vertex:M0,normalmap_pars_fragment:S0,clearcoat_normal_fragment_begin:E0,clearcoat_normal_fragment_maps:T0,clearcoat_pars_fragment:w0,iridescence_pars_fragment:A0,opaque_fragment:R0,packing:C0,premultiplied_alpha_fragment:P0,project_vertex:L0,dithering_fragment:D0,dithering_pars_fragment:I0,roughnessmap_fragment:U0,roughnessmap_pars_fragment:N0,shadowmap_pars_fragment:O0,shadowmap_pars_vertex:F0,shadowmap_vertex:k0,shadowmask_pars_fragment:B0,skinbase_vertex:z0,skinning_pars_vertex:V0,skinning_vertex:H0,skinnormal_vertex:G0,specularmap_fragment:W0,specularmap_pars_fragment:$0,tonemapping_fragment:q0,tonemapping_pars_fragment:X0,transmission_fragment:Y0,transmission_pars_fragment:j0,uv_pars_fragment:Z0,uv_pars_vertex:K0,uv_vertex:J0,worldpos_vertex:Q0,background_vert:eg,background_frag:tg,backgroundCube_vert:ng,backgroundCube_frag:ig,cube_vert:rg,cube_frag:sg,depth_vert:og,depth_frag:ag,distanceRGBA_vert:lg,distanceRGBA_frag:cg,equirect_vert:ug,equirect_frag:hg,linedashed_vert:dg,linedashed_frag:fg,meshbasic_vert:pg,meshbasic_frag:mg,meshlambert_vert:gg,meshlambert_frag:vg,meshmatcap_vert:_g,meshmatcap_frag:xg,meshnormal_vert:bg,meshnormal_frag:yg,meshphong_vert:Mg,meshphong_frag:Sg,meshphysical_vert:Eg,meshphysical_frag:Tg,meshtoon_vert:wg,meshtoon_frag:Ag,points_vert:Rg,points_frag:Cg,shadow_vert:Pg,shadow_frag:Lg,sprite_vert:Dg,sprite_frag:Ig},Pe={common:{diffuse:{value:new Et(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new dt},alphaMap:{value:null},alphaMapTransform:{value:new dt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new dt}},envmap:{envMap:{value:null},envMapRotation:{value:new dt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new dt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new dt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new dt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new dt},normalScale:{value:new xe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new dt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new dt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new dt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new dt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Et(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Et(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new dt},alphaTest:{value:0},uvTransform:{value:new dt}},sprite:{diffuse:{value:new Et(16777215)},opacity:{value:1},center:{value:new xe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new dt},alphaMap:{value:null},alphaMapTransform:{value:new dt},alphaTest:{value:0}}},hi={basic:{uniforms:Cn([Pe.common,Pe.specularmap,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.fog]),vertexShader:gt.meshbasic_vert,fragmentShader:gt.meshbasic_frag},lambert:{uniforms:Cn([Pe.common,Pe.specularmap,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.fog,Pe.lights,{emissive:{value:new Et(0)}}]),vertexShader:gt.meshlambert_vert,fragmentShader:gt.meshlambert_frag},phong:{uniforms:Cn([Pe.common,Pe.specularmap,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.fog,Pe.lights,{emissive:{value:new Et(0)},specular:{value:new Et(1118481)},shininess:{value:30}}]),vertexShader:gt.meshphong_vert,fragmentShader:gt.meshphong_frag},standard:{uniforms:Cn([Pe.common,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.roughnessmap,Pe.metalnessmap,Pe.fog,Pe.lights,{emissive:{value:new Et(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:gt.meshphysical_vert,fragmentShader:gt.meshphysical_frag},toon:{uniforms:Cn([Pe.common,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.gradientmap,Pe.fog,Pe.lights,{emissive:{value:new Et(0)}}]),vertexShader:gt.meshtoon_vert,fragmentShader:gt.meshtoon_frag},matcap:{uniforms:Cn([Pe.common,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.fog,{matcap:{value:null}}]),vertexShader:gt.meshmatcap_vert,fragmentShader:gt.meshmatcap_frag},points:{uniforms:Cn([Pe.points,Pe.fog]),vertexShader:gt.points_vert,fragmentShader:gt.points_frag},dashed:{uniforms:Cn([Pe.common,Pe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:gt.linedashed_vert,fragmentShader:gt.linedashed_frag},depth:{uniforms:Cn([Pe.common,Pe.displacementmap]),vertexShader:gt.depth_vert,fragmentShader:gt.depth_frag},normal:{uniforms:Cn([Pe.common,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,{opacity:{value:1}}]),vertexShader:gt.meshnormal_vert,fragmentShader:gt.meshnormal_frag},sprite:{uniforms:Cn([Pe.sprite,Pe.fog]),vertexShader:gt.sprite_vert,fragmentShader:gt.sprite_frag},background:{uniforms:{uvTransform:{value:new dt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:gt.background_vert,fragmentShader:gt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new dt}},vertexShader:gt.backgroundCube_vert,fragmentShader:gt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:gt.cube_vert,fragmentShader:gt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:gt.equirect_vert,fragmentShader:gt.equirect_frag},distanceRGBA:{uniforms:Cn([Pe.common,Pe.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:gt.distanceRGBA_vert,fragmentShader:gt.distanceRGBA_frag},shadow:{uniforms:Cn([Pe.lights,Pe.fog,{color:{value:new Et(0)},opacity:{value:1}}]),vertexShader:gt.shadow_vert,fragmentShader:gt.shadow_frag}};hi.physical={uniforms:Cn([hi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new dt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new dt},clearcoatNormalScale:{value:new xe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new dt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new dt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new dt},sheen:{value:0},sheenColor:{value:new Et(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new dt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new dt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new dt},transmissionSamplerSize:{value:new xe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new dt},attenuationDistance:{value:0},attenuationColor:{value:new Et(0)},specularColor:{value:new Et(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new dt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new dt},anisotropyVector:{value:new xe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new dt}}]),vertexShader:gt.meshphysical_vert,fragmentShader:gt.meshphysical_frag};const So={r:0,b:0,g:0},lr=new li,Ug=new Ht;function Ng(n,e,t,i,r,s,o){const a=new Et(0);let l=s===!0?0:1,c,u,h=null,d=0,f=null;function g(y){let b=y.isScene===!0?y.background:null;return b&&b.isTexture&&(b=(y.backgroundBlurriness>0?t:e).get(b)),b}function v(y){let b=!1;const S=g(y);S===null?p(a,l):S&&S.isColor&&(p(S,1),b=!0);const w=n.xr.getEnvironmentBlendMode();w==="additive"?i.buffers.color.setClear(0,0,0,1,o):w==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||b)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(y,b){const S=g(b);S&&(S.isCubeTexture||S.mapping===Go)?(u===void 0&&(u=new Tn(new cn(1,1,1),new er({name:"BackgroundCubeMaterial",uniforms:ss(hi.backgroundCube.uniforms),vertexShader:hi.backgroundCube.vertexShader,fragmentShader:hi.backgroundCube.fragmentShader,side:Fn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(w,R,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),lr.copy(b.backgroundRotation),lr.x*=-1,lr.y*=-1,lr.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(lr.y*=-1,lr.z*=-1),u.material.uniforms.envMap.value=S,u.material.uniforms.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Ug.makeRotationFromEuler(lr)),u.material.toneMapped=Lt.getTransfer(S.colorSpace)!==Nt,(h!==S||d!==S.version||f!==n.toneMapping)&&(u.material.needsUpdate=!0,h=S,d=S.version,f=n.toneMapping),u.layers.enableAll(),y.unshift(u,u.geometry,u.material,0,0,null)):S&&S.isTexture&&(c===void 0&&(c=new Tn(new Di(2,2),new er({name:"BackgroundMaterial",uniforms:ss(hi.background.uniforms),vertexShader:hi.background.vertexShader,fragmentShader:hi.background.fragmentShader,side:Qi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=S,c.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,c.material.toneMapped=Lt.getTransfer(S.colorSpace)!==Nt,S.matrixAutoUpdate===!0&&S.updateMatrix(),c.material.uniforms.uvTransform.value.copy(S.matrix),(h!==S||d!==S.version||f!==n.toneMapping)&&(c.material.needsUpdate=!0,h=S,d=S.version,f=n.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null))}function p(y,b){y.getRGB(So,Nh(n)),i.buffers.color.setClear(So.r,So.g,So.b,b,o)}function x(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(y,b=1){a.set(y),l=b,p(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(y){l=y,p(a,l)},render:v,addToRenderList:m,dispose:x}}function Og(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=d(null);let s=r,o=!1;function a(E,I,B,k,q){let H=!1;const U=h(k,B,I);s!==U&&(s=U,c(s.object)),H=f(E,k,B,q),H&&g(E,k,B,q),q!==null&&e.update(q,n.ELEMENT_ARRAY_BUFFER),(H||o)&&(o=!1,b(E,I,B,k),q!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(q).buffer))}function l(){return n.createVertexArray()}function c(E){return n.bindVertexArray(E)}function u(E){return n.deleteVertexArray(E)}function h(E,I,B){const k=B.wireframe===!0;let q=i[E.id];q===void 0&&(q={},i[E.id]=q);let H=q[I.id];H===void 0&&(H={},q[I.id]=H);let U=H[k];return U===void 0&&(U=d(l()),H[k]=U),U}function d(E){const I=[],B=[],k=[];for(let q=0;q<t;q++)I[q]=0,B[q]=0,k[q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:B,attributeDivisors:k,object:E,attributes:{},index:null}}function f(E,I,B,k){const q=s.attributes,H=I.attributes;let U=0;const $=B.getAttributes();for(const V in $)if($[V].location>=0){const ye=q[V];let Le=H[V];if(Le===void 0&&(V==="instanceMatrix"&&E.instanceMatrix&&(Le=E.instanceMatrix),V==="instanceColor"&&E.instanceColor&&(Le=E.instanceColor)),ye===void 0||ye.attribute!==Le||Le&&ye.data!==Le.data)return!0;U++}return s.attributesNum!==U||s.index!==k}function g(E,I,B,k){const q={},H=I.attributes;let U=0;const $=B.getAttributes();for(const V in $)if($[V].location>=0){let ye=H[V];ye===void 0&&(V==="instanceMatrix"&&E.instanceMatrix&&(ye=E.instanceMatrix),V==="instanceColor"&&E.instanceColor&&(ye=E.instanceColor));const Le={};Le.attribute=ye,ye&&ye.data&&(Le.data=ye.data),q[V]=Le,U++}s.attributes=q,s.attributesNum=U,s.index=k}function v(){const E=s.newAttributes;for(let I=0,B=E.length;I<B;I++)E[I]=0}function m(E){p(E,0)}function p(E,I){const B=s.newAttributes,k=s.enabledAttributes,q=s.attributeDivisors;B[E]=1,k[E]===0&&(n.enableVertexAttribArray(E),k[E]=1),q[E]!==I&&(n.vertexAttribDivisor(E,I),q[E]=I)}function x(){const E=s.newAttributes,I=s.enabledAttributes;for(let B=0,k=I.length;B<k;B++)I[B]!==E[B]&&(n.disableVertexAttribArray(B),I[B]=0)}function y(E,I,B,k,q,H,U){U===!0?n.vertexAttribIPointer(E,I,B,q,H):n.vertexAttribPointer(E,I,B,k,q,H)}function b(E,I,B,k){v();const q=k.attributes,H=B.getAttributes(),U=I.defaultAttributeValues;for(const $ in H){const V=H[$];if(V.location>=0){let ae=q[$];if(ae===void 0&&($==="instanceMatrix"&&E.instanceMatrix&&(ae=E.instanceMatrix),$==="instanceColor"&&E.instanceColor&&(ae=E.instanceColor)),ae!==void 0){const ye=ae.normalized,Le=ae.itemSize,Je=e.get(ae);if(Je===void 0)continue;const je=Je.buffer,ht=Je.type,pt=Je.bytesPerElement,J=ht===n.INT||ht===n.UNSIGNED_INT||ae.gpuType===ql;if(ae.isInterleavedBufferAttribute){const le=ae.data,_e=le.stride,He=ae.offset;if(le.isInstancedInterleavedBuffer){for(let We=0;We<V.locationSize;We++)p(V.location+We,le.meshPerAttribute);E.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=le.meshPerAttribute*le.count)}else for(let We=0;We<V.locationSize;We++)m(V.location+We);n.bindBuffer(n.ARRAY_BUFFER,je);for(let We=0;We<V.locationSize;We++)y(V.location+We,Le/V.locationSize,ht,ye,_e*pt,(He+Le/V.locationSize*We)*pt,J)}else{if(ae.isInstancedBufferAttribute){for(let le=0;le<V.locationSize;le++)p(V.location+le,ae.meshPerAttribute);E.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=ae.meshPerAttribute*ae.count)}else for(let le=0;le<V.locationSize;le++)m(V.location+le);n.bindBuffer(n.ARRAY_BUFFER,je);for(let le=0;le<V.locationSize;le++)y(V.location+le,Le/V.locationSize,ht,ye,Le*pt,Le/V.locationSize*le*pt,J)}}else if(U!==void 0){const ye=U[$];if(ye!==void 0)switch(ye.length){case 2:n.vertexAttrib2fv(V.location,ye);break;case 3:n.vertexAttrib3fv(V.location,ye);break;case 4:n.vertexAttrib4fv(V.location,ye);break;default:n.vertexAttrib1fv(V.location,ye)}}}}x()}function S(){P();for(const E in i){const I=i[E];for(const B in I){const k=I[B];for(const q in k)u(k[q].object),delete k[q];delete I[B]}delete i[E]}}function w(E){if(i[E.id]===void 0)return;const I=i[E.id];for(const B in I){const k=I[B];for(const q in k)u(k[q].object),delete k[q];delete I[B]}delete i[E.id]}function R(E){for(const I in i){const B=i[I];if(B[E.id]===void 0)continue;const k=B[E.id];for(const q in k)u(k[q].object),delete k[q];delete B[E.id]}}function P(){T(),o=!0,s!==r&&(s=r,c(s.object))}function T(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:P,resetDefaultState:T,dispose:S,releaseStatesOfGeometry:w,releaseStatesOfProgram:R,initAttributes:v,enableAttribute:m,disableUnusedAttributes:x}}function Fg(n,e,t){let i;function r(c){i=c}function s(c,u){n.drawArrays(i,c,u),t.update(u,i,1)}function o(c,u,h){h!==0&&(n.drawArraysInstanced(i,c,u,h),t.update(u,i,h))}function a(c,u,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,u,0,h);let f=0;for(let g=0;g<h;g++)f+=u[g];t.update(f,i,1)}function l(c,u,h,d){if(h===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)o(c[g],u[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(i,c,0,u,0,d,0,h);let g=0;for(let v=0;v<h;v++)g+=u[v]*d[v];t.update(g,i,1)}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function kg(n,e,t,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");r=n.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(R){return!(R!==oi&&i.convert(R)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(R){const P=R===Hs&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==mi&&i.convert(R)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==Li&&!P)}function l(R){if(R==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const h=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),x=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),y=n.getParameter(n.MAX_VARYING_VECTORS),b=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),S=g>0,w=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:h,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:x,maxVaryings:y,maxFragmentUniforms:b,vertexTextures:S,maxSamples:w}}function Bg(n){const e=this;let t=null,i=0,r=!1,s=!1;const o=new Ri,a=new dt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const f=h.length!==0||d||i!==0||r;return r=d,i=h.length,f},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,d){t=u(h,d,0)},this.setState=function(h,d,f){const g=h.clippingPlanes,v=h.clipIntersection,m=h.clipShadows,p=n.get(h);if(!r||g===null||g.length===0||s&&!m)s?u(null):c();else{const x=s?0:i,y=x*4;let b=p.clippingState||null;l.value=b,b=u(g,d,y,f);for(let S=0;S!==y;++S)b[S]=t[S];p.clippingState=b,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(h,d,f,g){const v=h!==null?h.length:0;let m=null;if(v!==0){if(m=l.value,g!==!0||m===null){const p=f+v*4,x=d.matrixWorldInverse;a.getNormalMatrix(x),(m===null||m.length<p)&&(m=new Float32Array(p));for(let y=0,b=f;y!==v;++y,b+=4)o.copy(h[y]).applyMatrix4(x,a),o.normal.toArray(m,b),m[b+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,m}}function zg(n){let e=new WeakMap;function t(o,a){return a===el?o.mapping=ns:a===tl&&(o.mapping=is),o}function i(o){if(o&&o.isTexture){const a=o.mapping;if(a===el||a===tl)if(e.has(o)){const l=e.get(o).texture;return t(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new sp(l.height);return c.fromEquirectangularTexture(n,o),e.set(o,c),o.addEventListener("dispose",r),t(c.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}const qr=4,Eu=[.125,.215,.35,.446,.526,.582],dr=20,Fa=new Zh,Tu=new Et;let ka=null,Ba=0,za=0,Va=!1;const ur=(1+Math.sqrt(5))/2,Vr=1/ur,wu=[new D(-ur,Vr,0),new D(ur,Vr,0),new D(-Vr,0,ur),new D(Vr,0,ur),new D(0,ur,-Vr),new D(0,ur,Vr),new D(-1,1,-1),new D(1,1,-1),new D(-1,1,1),new D(1,1,1)],Vg=new D;class Au{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,r=100,s={}){const{size:o=256,position:a=Vg}=s;ka=this._renderer.getRenderTarget(),Ba=this._renderer.getActiveCubeFace(),za=this._renderer.getActiveMipmapLevel(),Va=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,r,l,a),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Pu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Cu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(ka,Ba,za),this._renderer.xr.enabled=Va,e.scissorTest=!1,Eo(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ns||e.mapping===is?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ka=this._renderer.getRenderTarget(),Ba=this._renderer.getActiveCubeFace(),za=this._renderer.getActiveMipmapLevel(),Va=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:si,minFilter:si,generateMipmaps:!1,type:Hs,format:oi,colorSpace:rs,depthBuffer:!1},r=Ru(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ru(e,t,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Hg(s)),this._blurMaterial=Gg(s,e,t)}return r}_compileMaterial(e){const t=new Tn(this._lodPlanes[0],e);this._renderer.compile(t,Fa)}_sceneToCubeUV(e,t,i,r,s){const l=new Xn(90,1,t,i),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,f=h.toneMapping;h.getClearColor(Tu),h.toneMapping=Ki,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(r),h.clearDepth(),h.setRenderTarget(null));const v=new qn({name:"PMREM.Background",side:Fn,depthWrite:!1,depthTest:!1}),m=new Tn(new cn,v);let p=!1;const x=e.background;x?x.isColor&&(v.color.copy(x),e.background=null,p=!0):(v.color.copy(Tu),p=!0);for(let y=0;y<6;y++){const b=y%3;b===0?(l.up.set(0,c[y],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+u[y],s.y,s.z)):b===1?(l.up.set(0,0,c[y]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+u[y],s.z)):(l.up.set(0,c[y],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+u[y]));const S=this._cubeSize;Eo(r,b*S,y>2?S:0,S,S),h.setRenderTarget(r),p&&h.render(m,l),h.render(e,l)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=f,h.autoClear=d,e.background=x}_textureToCubeUV(e,t){const i=this._renderer,r=e.mapping===ns||e.mapping===is;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Pu()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Cu());const s=r?this._cubemapMaterial:this._equirectMaterial,o=new Tn(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=e;const l=this._cubeSize;Eo(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(o,Fa)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=wu[(r-s-1)%wu.length];this._blur(e,s-1,s,o,a)}t.autoClear=i}_blur(e,t,i,r,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,i,r,"latitudinal",s),this._halfBlur(o,e,i,i,r,"longitudinal",s)}_halfBlur(e,t,i,r,s,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new Tn(this._lodPlanes[r],c),d=c.uniforms,f=this._sizeLods[i]-1,g=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*dr-1),v=s/g,m=isFinite(s)?1+Math.floor(u*v):dr;m>dr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${dr}`);const p=[];let x=0;for(let R=0;R<dr;++R){const P=R/v,T=Math.exp(-P*P/2);p.push(T),R===0?x+=T:R<m&&(x+=2*T)}for(let R=0;R<p.length;R++)p[R]=p[R]/x;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:y}=this;d.dTheta.value=g,d.mipInt.value=y-i;const b=this._sizeLods[r],S=3*b*(r>y-qr?r-y+qr:0),w=4*(this._cubeSize-b);Eo(t,S,w,3*b,2*b),l.setRenderTarget(t),l.render(h,Fa)}}function Hg(n){const e=[],t=[],i=[];let r=n;const s=n-qr+1+Eu.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);t.push(a);let l=1/a;o>n-qr?l=Eu[o-n+qr-1]:o===0&&(l=0),i.push(l);const c=1/(a-2),u=-c,h=1+c,d=[u,u,h,u,h,h,u,u,h,h,u,h],f=6,g=6,v=3,m=2,p=1,x=new Float32Array(v*g*f),y=new Float32Array(m*g*f),b=new Float32Array(p*g*f);for(let w=0;w<f;w++){const R=w%3*2/3-1,P=w>2?0:-1,T=[R,P,0,R+2/3,P,0,R+2/3,P+1,0,R,P,0,R+2/3,P+1,0,R,P+1,0];x.set(T,v*g*w),y.set(d,m*g*w);const E=[w,w,w,w,w,w];b.set(E,p*g*w)}const S=new hn;S.setAttribute("position",new jn(x,v)),S.setAttribute("uv",new jn(y,m)),S.setAttribute("faceIndex",new jn(b,p)),e.push(S),r>qr&&r--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function Ru(n,e,t){const i=new vr(n,e,t);return i.texture.mapping=Go,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Eo(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function Gg(n,e,t){const i=new Float32Array(dr),r=new D(0,1,0);return new er({name:"SphericalGaussianBlur",defines:{n:dr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:dc(),fragmentShader:`

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
		`,blending:Zi,depthTest:!1,depthWrite:!1})}function Cu(){return new er({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:dc(),fragmentShader:`

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
		`,blending:Zi,depthTest:!1,depthWrite:!1})}function Pu(){return new er({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:dc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Zi,depthTest:!1,depthWrite:!1})}function dc(){return`

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
	`}function Wg(n){let e=new WeakMap,t=null;function i(a){if(a&&a.isTexture){const l=a.mapping,c=l===el||l===tl,u=l===ns||l===is;if(c||u){let h=e.get(a);const d=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return t===null&&(t=new Au(n)),h=c?t.fromEquirectangular(a,h):t.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),h.texture;if(h!==void 0)return h.texture;{const f=a.image;return c&&f&&f.height>0||u&&f&&r(f)?(t===null&&(t=new Au(n)),h=c?t.fromEquirectangular(a):t.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),a.addEventListener("dispose",s),h.texture):null}}}return a}function r(a){let l=0;const c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function s(a){const l=a.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:o}}function $g(n){const e={};function t(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=n.getExtension(i)}return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const r=t(i);return r===null&&Fs("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function qg(n,e,t,i){const r={},s=new WeakMap;function o(h){const d=h.target;d.index!==null&&e.remove(d.index);for(const g in d.attributes)e.remove(d.attributes[g]);d.removeEventListener("dispose",o),delete r[d.id];const f=s.get(d);f&&(e.remove(f),s.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function a(h,d){return r[d.id]===!0||(d.addEventListener("dispose",o),r[d.id]=!0,t.memory.geometries++),d}function l(h){const d=h.attributes;for(const f in d)e.update(d[f],n.ARRAY_BUFFER)}function c(h){const d=[],f=h.index,g=h.attributes.position;let v=0;if(f!==null){const x=f.array;v=f.version;for(let y=0,b=x.length;y<b;y+=3){const S=x[y+0],w=x[y+1],R=x[y+2];d.push(S,w,w,R,R,S)}}else if(g!==void 0){const x=g.array;v=g.version;for(let y=0,b=x.length/3-1;y<b;y+=3){const S=y+0,w=y+1,R=y+2;d.push(S,w,w,R,R,S)}}else return;const m=new(Ph(d)?Uh:Ih)(d,1);m.version=v;const p=s.get(h);p&&e.remove(p),s.set(h,m)}function u(h){const d=s.get(h);if(d){const f=h.index;f!==null&&d.version<f.version&&c(h)}else c(h);return s.get(h)}return{get:a,update:l,getWireframeAttribute:u}}function Xg(n,e,t){let i;function r(d){i=d}let s,o;function a(d){s=d.type,o=d.bytesPerElement}function l(d,f){n.drawElements(i,f,s,d*o),t.update(f,i,1)}function c(d,f,g){g!==0&&(n.drawElementsInstanced(i,f,s,d*o,g),t.update(f,i,g))}function u(d,f,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,s,d,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];t.update(m,i,1)}function h(d,f,g,v){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)c(d[p]/o,f[p],v[p]);else{m.multiDrawElementsInstancedWEBGL(i,f,0,s,d,0,v,0,g);let p=0;for(let x=0;x<g;x++)p+=f[x]*v[x];t.update(p,i,1)}}this.setMode=r,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function Yg(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(s/3);break;case n.LINES:t.lines+=a*(s/2);break;case n.LINE_STRIP:t.lines+=a*(s-1);break;case n.LINE_LOOP:t.lines+=a*s;break;case n.POINTS:t.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function jg(n,e,t){const i=new WeakMap,r=new Yt;function s(o,a,l){const c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0;let d=i.get(a);if(d===void 0||d.count!==h){let E=function(){P.dispose(),i.delete(a),a.removeEventListener("dispose",E)};var f=E;d!==void 0&&d.texture.dispose();const g=a.morphAttributes.position!==void 0,v=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],x=a.morphAttributes.normal||[],y=a.morphAttributes.color||[];let b=0;g===!0&&(b=1),v===!0&&(b=2),m===!0&&(b=3);let S=a.attributes.position.count*b,w=1;S>e.maxTextureSize&&(w=Math.ceil(S/e.maxTextureSize),S=e.maxTextureSize);const R=new Float32Array(S*w*4*h),P=new Lh(R,S,w,h);P.type=Li,P.needsUpdate=!0;const T=b*4;for(let I=0;I<h;I++){const B=p[I],k=x[I],q=y[I],H=S*w*4*I;for(let U=0;U<B.count;U++){const $=U*T;g===!0&&(r.fromBufferAttribute(B,U),R[H+$+0]=r.x,R[H+$+1]=r.y,R[H+$+2]=r.z,R[H+$+3]=0),v===!0&&(r.fromBufferAttribute(k,U),R[H+$+4]=r.x,R[H+$+5]=r.y,R[H+$+6]=r.z,R[H+$+7]=0),m===!0&&(r.fromBufferAttribute(q,U),R[H+$+8]=r.x,R[H+$+9]=r.y,R[H+$+10]=r.z,R[H+$+11]=q.itemSize===4?r.w:1)}}d={count:h,texture:P,size:new xe(S,w)},i.set(a,d),a.addEventListener("dispose",E)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const v=a.morphTargetsRelative?1:1-g;l.getUniforms().setValue(n,"morphTargetBaseInfluence",v),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:s}}function Zg(n,e,t,i){let r=new WeakMap;function s(l){const c=i.render.frame,u=l.geometry,h=e.get(l,u);if(r.get(h)!==c&&(e.update(h),r.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),r.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;r.get(d)!==c&&(d.update(),r.set(d,c))}return h}function o(){r=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:s,dispose:o}}const Jh=new Dn,Lu=new kh(1,1),Qh=new Lh,ed=new Hf,td=new Fh,Du=[],Iu=[],Uu=new Float32Array(16),Nu=new Float32Array(9),Ou=new Float32Array(4);function cs(n,e,t){const i=n[0];if(i<=0||i>0)return n;const r=e*t;let s=Du[r];if(s===void 0&&(s=new Float32Array(r),Du[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(s,a)}return s}function dn(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function fn(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Xo(n,e){let t=Iu[e];t===void 0&&(t=new Int32Array(e),Iu[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function Kg(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function Jg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(dn(t,e))return;n.uniform2fv(this.addr,e),fn(t,e)}}function Qg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(dn(t,e))return;n.uniform3fv(this.addr,e),fn(t,e)}}function ev(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(dn(t,e))return;n.uniform4fv(this.addr,e),fn(t,e)}}function tv(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(dn(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),fn(t,e)}else{if(dn(t,i))return;Ou.set(i),n.uniformMatrix2fv(this.addr,!1,Ou),fn(t,i)}}function nv(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(dn(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),fn(t,e)}else{if(dn(t,i))return;Nu.set(i),n.uniformMatrix3fv(this.addr,!1,Nu),fn(t,i)}}function iv(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(dn(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),fn(t,e)}else{if(dn(t,i))return;Uu.set(i),n.uniformMatrix4fv(this.addr,!1,Uu),fn(t,i)}}function rv(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function sv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(dn(t,e))return;n.uniform2iv(this.addr,e),fn(t,e)}}function ov(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(dn(t,e))return;n.uniform3iv(this.addr,e),fn(t,e)}}function av(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(dn(t,e))return;n.uniform4iv(this.addr,e),fn(t,e)}}function lv(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function cv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(dn(t,e))return;n.uniform2uiv(this.addr,e),fn(t,e)}}function uv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(dn(t,e))return;n.uniform3uiv(this.addr,e),fn(t,e)}}function hv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(dn(t,e))return;n.uniform4uiv(this.addr,e),fn(t,e)}}function dv(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let s;this.type===n.SAMPLER_2D_SHADOW?(Lu.compareFunction=Ch,s=Lu):s=Jh,t.setTexture2D(e||s,r)}function fv(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||ed,r)}function pv(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||td,r)}function mv(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||Qh,r)}function gv(n){switch(n){case 5126:return Kg;case 35664:return Jg;case 35665:return Qg;case 35666:return ev;case 35674:return tv;case 35675:return nv;case 35676:return iv;case 5124:case 35670:return rv;case 35667:case 35671:return sv;case 35668:case 35672:return ov;case 35669:case 35673:return av;case 5125:return lv;case 36294:return cv;case 36295:return uv;case 36296:return hv;case 35678:case 36198:case 36298:case 36306:case 35682:return dv;case 35679:case 36299:case 36307:return fv;case 35680:case 36300:case 36308:case 36293:return pv;case 36289:case 36303:case 36311:case 36292:return mv}}function vv(n,e){n.uniform1fv(this.addr,e)}function _v(n,e){const t=cs(e,this.size,2);n.uniform2fv(this.addr,t)}function xv(n,e){const t=cs(e,this.size,3);n.uniform3fv(this.addr,t)}function bv(n,e){const t=cs(e,this.size,4);n.uniform4fv(this.addr,t)}function yv(n,e){const t=cs(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function Mv(n,e){const t=cs(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function Sv(n,e){const t=cs(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function Ev(n,e){n.uniform1iv(this.addr,e)}function Tv(n,e){n.uniform2iv(this.addr,e)}function wv(n,e){n.uniform3iv(this.addr,e)}function Av(n,e){n.uniform4iv(this.addr,e)}function Rv(n,e){n.uniform1uiv(this.addr,e)}function Cv(n,e){n.uniform2uiv(this.addr,e)}function Pv(n,e){n.uniform3uiv(this.addr,e)}function Lv(n,e){n.uniform4uiv(this.addr,e)}function Dv(n,e,t){const i=this.cache,r=e.length,s=Xo(t,r);dn(i,s)||(n.uniform1iv(this.addr,s),fn(i,s));for(let o=0;o!==r;++o)t.setTexture2D(e[o]||Jh,s[o])}function Iv(n,e,t){const i=this.cache,r=e.length,s=Xo(t,r);dn(i,s)||(n.uniform1iv(this.addr,s),fn(i,s));for(let o=0;o!==r;++o)t.setTexture3D(e[o]||ed,s[o])}function Uv(n,e,t){const i=this.cache,r=e.length,s=Xo(t,r);dn(i,s)||(n.uniform1iv(this.addr,s),fn(i,s));for(let o=0;o!==r;++o)t.setTextureCube(e[o]||td,s[o])}function Nv(n,e,t){const i=this.cache,r=e.length,s=Xo(t,r);dn(i,s)||(n.uniform1iv(this.addr,s),fn(i,s));for(let o=0;o!==r;++o)t.setTexture2DArray(e[o]||Qh,s[o])}function Ov(n){switch(n){case 5126:return vv;case 35664:return _v;case 35665:return xv;case 35666:return bv;case 35674:return yv;case 35675:return Mv;case 35676:return Sv;case 5124:case 35670:return Ev;case 35667:case 35671:return Tv;case 35668:case 35672:return wv;case 35669:case 35673:return Av;case 5125:return Rv;case 36294:return Cv;case 36295:return Pv;case 36296:return Lv;case 35678:case 36198:case 36298:case 36306:case 35682:return Dv;case 35679:case 36299:case 36307:return Iv;case 35680:case 36300:case 36308:case 36293:return Uv;case 36289:case 36303:case 36311:case 36292:return Nv}}class Fv{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=gv(t.type)}}class kv{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Ov(t.type)}}class Bv{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(e,t[a.id],i)}}}const Ha=/(\w+)(\])?(\[|\.)?/g;function Fu(n,e){n.seq.push(e),n.map[e.id]=e}function zv(n,e,t){const i=n.name,r=i.length;for(Ha.lastIndex=0;;){const s=Ha.exec(i),o=Ha.lastIndex;let a=s[1];const l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){Fu(t,c===void 0?new Fv(a,n,e):new kv(a,n,e));break}else{let h=t.map[a];h===void 0&&(h=new Bv(a),Fu(t,h)),t=h}}}class Lo{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(t,r),o=e.getUniformLocation(t,s.name);zv(s,o,this)}}setValue(e,t,i,r){const s=this.map[t];s!==void 0&&s.setValue(e,i,r)}setOptional(e,t,i){const r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let s=0,o=t.length;s!==o;++s){const a=t[s],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,t){const i=[];for(let r=0,s=e.length;r!==s;++r){const o=e[r];o.id in t&&i.push(o)}return i}}function ku(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const Vv=37297;let Hv=0;function Gv(n,e){const t=n.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let o=r;o<s;o++){const a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}const Bu=new dt;function Wv(n){Lt._getMatrix(Bu,Lt.workingColorSpace,n);const e=`mat3( ${Bu.elements.map(t=>t.toFixed(4))} )`;switch(Lt.getTransfer(n)){case Do:return[e,"LinearTransferOETF"];case Nt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function zu(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),s=(n.getShaderInfoLog(e)||"").trim();if(i&&s==="")return"";const o=/ERROR: 0:(\d+)/.exec(s);if(o){const a=parseInt(o[1]);return t.toUpperCase()+`

`+s+`

`+Gv(n.getShaderSource(e),a)}else return s}function $v(n,e){const t=Wv(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function qv(n,e){let t;switch(e){case tf:t="Linear";break;case nf:t="Reinhard";break;case rf:t="Cineon";break;case _h:t="ACESFilmic";break;case of:t="AgX";break;case af:t="Neutral";break;case sf:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const To=new D;function Xv(){Lt.getLuminanceCoefficients(To);const n=To.x.toFixed(4),e=To.y.toFixed(4),t=To.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Yv(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ss).join(`
`)}function jv(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function Zv(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=n.getActiveAttrib(e,r),o=s.name;let a=1;s.type===n.FLOAT_MAT2&&(a=2),s.type===n.FLOAT_MAT3&&(a=3),s.type===n.FLOAT_MAT4&&(a=4),t[o]={type:s.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function Ss(n){return n!==""}function Vu(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Hu(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Kv=/^[ \t]*#include +<([\w\d./]+)>/gm;function Fl(n){return n.replace(Kv,Qv)}const Jv=new Map;function Qv(n,e){let t=gt[e];if(t===void 0){const i=Jv.get(e);if(i!==void 0)t=gt[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Fl(t)}const e_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Gu(n){return n.replace(e_,t_)}function t_(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Wu(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}function n_(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===mh?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===gh?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===wi&&(e="SHADOWMAP_TYPE_VSM"),e}function i_(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case ns:case is:e="ENVMAP_TYPE_CUBE";break;case Go:e="ENVMAP_TYPE_CUBE_UV";break}return e}function r_(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case is:e="ENVMAP_MODE_REFRACTION";break}return e}function s_(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case vh:e="ENVMAP_BLENDING_MULTIPLY";break;case Qd:e="ENVMAP_BLENDING_MIX";break;case ef:e="ENVMAP_BLENDING_ADD";break}return e}function o_(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function a_(n,e,t,i){const r=n.getContext(),s=t.defines;let o=t.vertexShader,a=t.fragmentShader;const l=n_(t),c=i_(t),u=r_(t),h=s_(t),d=o_(t),f=Yv(t),g=jv(s),v=r.createProgram();let m,p,x=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ss).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ss).join(`
`),p.length>0&&(p+=`
`)):(m=[Wu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ss).join(`
`),p=[Wu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Ki?"#define TONE_MAPPING":"",t.toneMapping!==Ki?gt.tonemapping_pars_fragment:"",t.toneMapping!==Ki?qv("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",gt.colorspace_pars_fragment,$v("linearToOutputTexel",t.outputColorSpace),Xv(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ss).join(`
`)),o=Fl(o),o=Vu(o,t),o=Hu(o,t),a=Fl(a),a=Vu(a,t),a=Hu(a,t),o=Gu(o),a=Gu(a),t.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===Gc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Gc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const y=x+m+o,b=x+p+a,S=ku(r,r.VERTEX_SHADER,y),w=ku(r,r.FRAGMENT_SHADER,b);r.attachShader(v,S),r.attachShader(v,w),t.index0AttributeName!==void 0?r.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(v,0,"position"),r.linkProgram(v);function R(I){if(n.debug.checkShaderErrors){const B=r.getProgramInfoLog(v)||"",k=r.getShaderInfoLog(S)||"",q=r.getShaderInfoLog(w)||"",H=B.trim(),U=k.trim(),$=q.trim();let V=!0,ae=!0;if(r.getProgramParameter(v,r.LINK_STATUS)===!1)if(V=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,v,S,w);else{const ye=zu(r,S,"vertex"),Le=zu(r,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(v,r.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+H+`
`+ye+`
`+Le)}else H!==""?console.warn("THREE.WebGLProgram: Program Info Log:",H):(U===""||$==="")&&(ae=!1);ae&&(I.diagnostics={runnable:V,programLog:H,vertexShader:{log:U,prefix:m},fragmentShader:{log:$,prefix:p}})}r.deleteShader(S),r.deleteShader(w),P=new Lo(r,v),T=Zv(r,v)}let P;this.getUniforms=function(){return P===void 0&&R(this),P};let T;this.getAttributes=function(){return T===void 0&&R(this),T};let E=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=r.getProgramParameter(v,Vv)),E},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Hv++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=S,this.fragmentShader=w,this}let l_=0;class c_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new u_(e),t.set(e,i)),i}}class u_{constructor(e){this.id=l_++,this.code=e,this.usedTimes=0}}function h_(n,e,t,i,r,s,o){const a=new ec,l=new c_,c=new Set,u=[],h=r.logarithmicDepthBuffer,d=r.vertexTextures;let f=r.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(T){return c.add(T),T===0?"uv":`uv${T}`}function m(T,E,I,B,k){const q=B.fog,H=k.geometry,U=T.isMeshStandardMaterial?B.environment:null,$=(T.isMeshStandardMaterial?t:e).get(T.envMap||U),V=$&&$.mapping===Go?$.image.height:null,ae=g[T.type];T.precision!==null&&(f=r.getMaxPrecision(T.precision),f!==T.precision&&console.warn("THREE.WebGLProgram.getParameters:",T.precision,"not supported, using",f,"instead."));const ye=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,Le=ye!==void 0?ye.length:0;let Je=0;H.morphAttributes.position!==void 0&&(Je=1),H.morphAttributes.normal!==void 0&&(Je=2),H.morphAttributes.color!==void 0&&(Je=3);let je,ht,pt,J;if(ae){const At=hi[ae];je=At.vertexShader,ht=At.fragmentShader}else je=T.vertexShader,ht=T.fragmentShader,l.update(T),pt=l.getVertexShaderID(T),J=l.getFragmentShaderID(T);const le=n.getRenderTarget(),_e=n.state.buffers.depth.getReversed(),He=k.isInstancedMesh===!0,We=k.isBatchedMesh===!0,nt=!!T.map,wt=!!T.matcap,F=!!$,ue=!!T.aoMap,oe=!!T.lightMap,re=!!T.bumpMap,ie=!!T.normalMap,Me=!!T.displacementMap,fe=!!T.emissiveMap,be=!!T.metalnessMap,it=!!T.roughnessMap,rt=T.anisotropy>0,L=T.clearcoat>0,M=T.dispersion>0,j=T.iridescence>0,Q=T.sheen>0,he=T.transmission>0,ee=rt&&!!T.anisotropyMap,$e=L&&!!T.clearcoatMap,de=L&&!!T.clearcoatNormalMap,Ge=L&&!!T.clearcoatRoughnessMap,Ne=j&&!!T.iridescenceMap,pe=j&&!!T.iridescenceThicknessMap,Ae=Q&&!!T.sheenColorMap,Qe=Q&&!!T.sheenRoughnessMap,Oe=!!T.specularMap,Re=!!T.specularColorMap,tt=!!T.specularIntensityMap,z=he&&!!T.transmissionMap,me=he&&!!T.thicknessMap,we=!!T.gradientMap,Fe=!!T.alphaMap,ge=T.alphaTest>0,ce=!!T.alphaHash,Ue=!!T.extensions;let at=Ki;T.toneMapped&&(le===null||le.isXRRenderTarget===!0)&&(at=n.toneMapping);const Pt={shaderID:ae,shaderType:T.type,shaderName:T.name,vertexShader:je,fragmentShader:ht,defines:T.defines,customVertexShaderID:pt,customFragmentShaderID:J,isRawShaderMaterial:T.isRawShaderMaterial===!0,glslVersion:T.glslVersion,precision:f,batching:We,batchingColor:We&&k._colorsTexture!==null,instancing:He,instancingColor:He&&k.instanceColor!==null,instancingMorph:He&&k.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:le===null?n.outputColorSpace:le.isXRRenderTarget===!0?le.texture.colorSpace:rs,alphaToCoverage:!!T.alphaToCoverage,map:nt,matcap:wt,envMap:F,envMapMode:F&&$.mapping,envMapCubeUVHeight:V,aoMap:ue,lightMap:oe,bumpMap:re,normalMap:ie,displacementMap:d&&Me,emissiveMap:fe,normalMapObjectSpace:ie&&T.normalMapType===hf,normalMapTangentSpace:ie&&T.normalMapType===Rh,metalnessMap:be,roughnessMap:it,anisotropy:rt,anisotropyMap:ee,clearcoat:L,clearcoatMap:$e,clearcoatNormalMap:de,clearcoatRoughnessMap:Ge,dispersion:M,iridescence:j,iridescenceMap:Ne,iridescenceThicknessMap:pe,sheen:Q,sheenColorMap:Ae,sheenRoughnessMap:Qe,specularMap:Oe,specularColorMap:Re,specularIntensityMap:tt,transmission:he,transmissionMap:z,thicknessMap:me,gradientMap:we,opaque:T.transparent===!1&&T.blending===Yr&&T.alphaToCoverage===!1,alphaMap:Fe,alphaTest:ge,alphaHash:ce,combine:T.combine,mapUv:nt&&v(T.map.channel),aoMapUv:ue&&v(T.aoMap.channel),lightMapUv:oe&&v(T.lightMap.channel),bumpMapUv:re&&v(T.bumpMap.channel),normalMapUv:ie&&v(T.normalMap.channel),displacementMapUv:Me&&v(T.displacementMap.channel),emissiveMapUv:fe&&v(T.emissiveMap.channel),metalnessMapUv:be&&v(T.metalnessMap.channel),roughnessMapUv:it&&v(T.roughnessMap.channel),anisotropyMapUv:ee&&v(T.anisotropyMap.channel),clearcoatMapUv:$e&&v(T.clearcoatMap.channel),clearcoatNormalMapUv:de&&v(T.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ge&&v(T.clearcoatRoughnessMap.channel),iridescenceMapUv:Ne&&v(T.iridescenceMap.channel),iridescenceThicknessMapUv:pe&&v(T.iridescenceThicknessMap.channel),sheenColorMapUv:Ae&&v(T.sheenColorMap.channel),sheenRoughnessMapUv:Qe&&v(T.sheenRoughnessMap.channel),specularMapUv:Oe&&v(T.specularMap.channel),specularColorMapUv:Re&&v(T.specularColorMap.channel),specularIntensityMapUv:tt&&v(T.specularIntensityMap.channel),transmissionMapUv:z&&v(T.transmissionMap.channel),thicknessMapUv:me&&v(T.thicknessMap.channel),alphaMapUv:Fe&&v(T.alphaMap.channel),vertexTangents:!!H.attributes.tangent&&(ie||rt),vertexColors:T.vertexColors,vertexAlphas:T.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,pointsUvs:k.isPoints===!0&&!!H.attributes.uv&&(nt||Fe),fog:!!q,useFog:T.fog===!0,fogExp2:!!q&&q.isFogExp2,flatShading:T.flatShading===!0&&T.wireframe===!1,sizeAttenuation:T.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:_e,skinning:k.isSkinnedMesh===!0,morphTargets:H.morphAttributes.position!==void 0,morphNormals:H.morphAttributes.normal!==void 0,morphColors:H.morphAttributes.color!==void 0,morphTargetsCount:Le,morphTextureStride:Je,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:T.dithering,shadowMapEnabled:n.shadowMap.enabled&&I.length>0,shadowMapType:n.shadowMap.type,toneMapping:at,decodeVideoTexture:nt&&T.map.isVideoTexture===!0&&Lt.getTransfer(T.map.colorSpace)===Nt,decodeVideoTextureEmissive:fe&&T.emissiveMap.isVideoTexture===!0&&Lt.getTransfer(T.emissiveMap.colorSpace)===Nt,premultipliedAlpha:T.premultipliedAlpha,doubleSided:T.side===fi,flipSided:T.side===Fn,useDepthPacking:T.depthPacking>=0,depthPacking:T.depthPacking||0,index0AttributeName:T.index0AttributeName,extensionClipCullDistance:Ue&&T.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ue&&T.extensions.multiDraw===!0||We)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:T.customProgramCacheKey()};return Pt.vertexUv1s=c.has(1),Pt.vertexUv2s=c.has(2),Pt.vertexUv3s=c.has(3),c.clear(),Pt}function p(T){const E=[];if(T.shaderID?E.push(T.shaderID):(E.push(T.customVertexShaderID),E.push(T.customFragmentShaderID)),T.defines!==void 0)for(const I in T.defines)E.push(I),E.push(T.defines[I]);return T.isRawShaderMaterial===!1&&(x(E,T),y(E,T),E.push(n.outputColorSpace)),E.push(T.customProgramCacheKey),E.join()}function x(T,E){T.push(E.precision),T.push(E.outputColorSpace),T.push(E.envMapMode),T.push(E.envMapCubeUVHeight),T.push(E.mapUv),T.push(E.alphaMapUv),T.push(E.lightMapUv),T.push(E.aoMapUv),T.push(E.bumpMapUv),T.push(E.normalMapUv),T.push(E.displacementMapUv),T.push(E.emissiveMapUv),T.push(E.metalnessMapUv),T.push(E.roughnessMapUv),T.push(E.anisotropyMapUv),T.push(E.clearcoatMapUv),T.push(E.clearcoatNormalMapUv),T.push(E.clearcoatRoughnessMapUv),T.push(E.iridescenceMapUv),T.push(E.iridescenceThicknessMapUv),T.push(E.sheenColorMapUv),T.push(E.sheenRoughnessMapUv),T.push(E.specularMapUv),T.push(E.specularColorMapUv),T.push(E.specularIntensityMapUv),T.push(E.transmissionMapUv),T.push(E.thicknessMapUv),T.push(E.combine),T.push(E.fogExp2),T.push(E.sizeAttenuation),T.push(E.morphTargetsCount),T.push(E.morphAttributeCount),T.push(E.numDirLights),T.push(E.numPointLights),T.push(E.numSpotLights),T.push(E.numSpotLightMaps),T.push(E.numHemiLights),T.push(E.numRectAreaLights),T.push(E.numDirLightShadows),T.push(E.numPointLightShadows),T.push(E.numSpotLightShadows),T.push(E.numSpotLightShadowsWithMaps),T.push(E.numLightProbes),T.push(E.shadowMapType),T.push(E.toneMapping),T.push(E.numClippingPlanes),T.push(E.numClipIntersection),T.push(E.depthPacking)}function y(T,E){a.disableAll(),E.supportsVertexTextures&&a.enable(0),E.instancing&&a.enable(1),E.instancingColor&&a.enable(2),E.instancingMorph&&a.enable(3),E.matcap&&a.enable(4),E.envMap&&a.enable(5),E.normalMapObjectSpace&&a.enable(6),E.normalMapTangentSpace&&a.enable(7),E.clearcoat&&a.enable(8),E.iridescence&&a.enable(9),E.alphaTest&&a.enable(10),E.vertexColors&&a.enable(11),E.vertexAlphas&&a.enable(12),E.vertexUv1s&&a.enable(13),E.vertexUv2s&&a.enable(14),E.vertexUv3s&&a.enable(15),E.vertexTangents&&a.enable(16),E.anisotropy&&a.enable(17),E.alphaHash&&a.enable(18),E.batching&&a.enable(19),E.dispersion&&a.enable(20),E.batchingColor&&a.enable(21),E.gradientMap&&a.enable(22),T.push(a.mask),a.disableAll(),E.fog&&a.enable(0),E.useFog&&a.enable(1),E.flatShading&&a.enable(2),E.logarithmicDepthBuffer&&a.enable(3),E.reversedDepthBuffer&&a.enable(4),E.skinning&&a.enable(5),E.morphTargets&&a.enable(6),E.morphNormals&&a.enable(7),E.morphColors&&a.enable(8),E.premultipliedAlpha&&a.enable(9),E.shadowMapEnabled&&a.enable(10),E.doubleSided&&a.enable(11),E.flipSided&&a.enable(12),E.useDepthPacking&&a.enable(13),E.dithering&&a.enable(14),E.transmission&&a.enable(15),E.sheen&&a.enable(16),E.opaque&&a.enable(17),E.pointsUvs&&a.enable(18),E.decodeVideoTexture&&a.enable(19),E.decodeVideoTextureEmissive&&a.enable(20),E.alphaToCoverage&&a.enable(21),T.push(a.mask)}function b(T){const E=g[T.type];let I;if(E){const B=hi[E];I=tp.clone(B.uniforms)}else I=T.uniforms;return I}function S(T,E){let I;for(let B=0,k=u.length;B<k;B++){const q=u[B];if(q.cacheKey===E){I=q,++I.usedTimes;break}}return I===void 0&&(I=new a_(n,E,T,s),u.push(I)),I}function w(T){if(--T.usedTimes===0){const E=u.indexOf(T);u[E]=u[u.length-1],u.pop(),T.destroy()}}function R(T){l.remove(T)}function P(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:b,acquireProgram:S,releaseProgram:w,releaseShaderCache:R,programs:u,dispose:P}}function d_(){let n=new WeakMap;function e(o){return n.has(o)}function t(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function r(o,a,l){n.get(o)[a]=l}function s(){n=new WeakMap}return{has:e,get:t,remove:i,update:r,dispose:s}}function f_(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function $u(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function qu(){const n=[];let e=0;const t=[],i=[],r=[];function s(){e=0,t.length=0,i.length=0,r.length=0}function o(h,d,f,g,v,m){let p=n[e];return p===void 0?(p={id:h.id,object:h,geometry:d,material:f,groupOrder:g,renderOrder:h.renderOrder,z:v,group:m},n[e]=p):(p.id=h.id,p.object=h,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=h.renderOrder,p.z=v,p.group=m),e++,p}function a(h,d,f,g,v,m){const p=o(h,d,f,g,v,m);f.transmission>0?i.push(p):f.transparent===!0?r.push(p):t.push(p)}function l(h,d,f,g,v,m){const p=o(h,d,f,g,v,m);f.transmission>0?i.unshift(p):f.transparent===!0?r.unshift(p):t.unshift(p)}function c(h,d){t.length>1&&t.sort(h||f_),i.length>1&&i.sort(d||$u),r.length>1&&r.sort(d||$u)}function u(){for(let h=e,d=n.length;h<d;h++){const f=n[h];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:i,transparent:r,init:s,push:a,unshift:l,finish:u,sort:c}}function p_(){let n=new WeakMap;function e(i,r){const s=n.get(i);let o;return s===void 0?(o=new qu,n.set(i,[o])):r>=s.length?(o=new qu,s.push(o)):o=s[r],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function m_(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new D,color:new Et};break;case"SpotLight":t={position:new D,direction:new D,color:new Et,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new D,color:new Et,distance:0,decay:0};break;case"HemisphereLight":t={direction:new D,skyColor:new Et,groundColor:new Et};break;case"RectAreaLight":t={color:new Et,position:new D,halfWidth:new D,halfHeight:new D};break}return n[e.id]=t,t}}}function g_(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xe,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let v_=0;function __(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function x_(n){const e=new m_,t=g_(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new D);const r=new D,s=new Ht,o=new Ht;function a(c){let u=0,h=0,d=0;for(let T=0;T<9;T++)i.probe[T].set(0,0,0);let f=0,g=0,v=0,m=0,p=0,x=0,y=0,b=0,S=0,w=0,R=0;c.sort(__);for(let T=0,E=c.length;T<E;T++){const I=c[T],B=I.color,k=I.intensity,q=I.distance,H=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)u+=B.r*k,h+=B.g*k,d+=B.b*k;else if(I.isLightProbe){for(let U=0;U<9;U++)i.probe[U].addScaledVector(I.sh.coefficients[U],k);R++}else if(I.isDirectionalLight){const U=e.get(I);if(U.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){const $=I.shadow,V=t.get(I);V.shadowIntensity=$.intensity,V.shadowBias=$.bias,V.shadowNormalBias=$.normalBias,V.shadowRadius=$.radius,V.shadowMapSize=$.mapSize,i.directionalShadow[f]=V,i.directionalShadowMap[f]=H,i.directionalShadowMatrix[f]=I.shadow.matrix,x++}i.directional[f]=U,f++}else if(I.isSpotLight){const U=e.get(I);U.position.setFromMatrixPosition(I.matrixWorld),U.color.copy(B).multiplyScalar(k),U.distance=q,U.coneCos=Math.cos(I.angle),U.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),U.decay=I.decay,i.spot[v]=U;const $=I.shadow;if(I.map&&(i.spotLightMap[S]=I.map,S++,$.updateMatrices(I),I.castShadow&&w++),i.spotLightMatrix[v]=$.matrix,I.castShadow){const V=t.get(I);V.shadowIntensity=$.intensity,V.shadowBias=$.bias,V.shadowNormalBias=$.normalBias,V.shadowRadius=$.radius,V.shadowMapSize=$.mapSize,i.spotShadow[v]=V,i.spotShadowMap[v]=H,b++}v++}else if(I.isRectAreaLight){const U=e.get(I);U.color.copy(B).multiplyScalar(k),U.halfWidth.set(I.width*.5,0,0),U.halfHeight.set(0,I.height*.5,0),i.rectArea[m]=U,m++}else if(I.isPointLight){const U=e.get(I);if(U.color.copy(I.color).multiplyScalar(I.intensity),U.distance=I.distance,U.decay=I.decay,I.castShadow){const $=I.shadow,V=t.get(I);V.shadowIntensity=$.intensity,V.shadowBias=$.bias,V.shadowNormalBias=$.normalBias,V.shadowRadius=$.radius,V.shadowMapSize=$.mapSize,V.shadowCameraNear=$.camera.near,V.shadowCameraFar=$.camera.far,i.pointShadow[g]=V,i.pointShadowMap[g]=H,i.pointShadowMatrix[g]=I.shadow.matrix,y++}i.point[g]=U,g++}else if(I.isHemisphereLight){const U=e.get(I);U.skyColor.copy(I.color).multiplyScalar(k),U.groundColor.copy(I.groundColor).multiplyScalar(k),i.hemi[p]=U,p++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Pe.LTC_FLOAT_1,i.rectAreaLTC2=Pe.LTC_FLOAT_2):(i.rectAreaLTC1=Pe.LTC_HALF_1,i.rectAreaLTC2=Pe.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=h,i.ambient[2]=d;const P=i.hash;(P.directionalLength!==f||P.pointLength!==g||P.spotLength!==v||P.rectAreaLength!==m||P.hemiLength!==p||P.numDirectionalShadows!==x||P.numPointShadows!==y||P.numSpotShadows!==b||P.numSpotMaps!==S||P.numLightProbes!==R)&&(i.directional.length=f,i.spot.length=v,i.rectArea.length=m,i.point.length=g,i.hemi.length=p,i.directionalShadow.length=x,i.directionalShadowMap.length=x,i.pointShadow.length=y,i.pointShadowMap.length=y,i.spotShadow.length=b,i.spotShadowMap.length=b,i.directionalShadowMatrix.length=x,i.pointShadowMatrix.length=y,i.spotLightMatrix.length=b+S-w,i.spotLightMap.length=S,i.numSpotLightShadowsWithMaps=w,i.numLightProbes=R,P.directionalLength=f,P.pointLength=g,P.spotLength=v,P.rectAreaLength=m,P.hemiLength=p,P.numDirectionalShadows=x,P.numPointShadows=y,P.numSpotShadows=b,P.numSpotMaps=S,P.numLightProbes=R,i.version=v_++)}function l(c,u){let h=0,d=0,f=0,g=0,v=0;const m=u.matrixWorldInverse;for(let p=0,x=c.length;p<x;p++){const y=c[p];if(y.isDirectionalLight){const b=i.directional[h];b.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),b.direction.sub(r),b.direction.transformDirection(m),h++}else if(y.isSpotLight){const b=i.spot[f];b.position.setFromMatrixPosition(y.matrixWorld),b.position.applyMatrix4(m),b.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),b.direction.sub(r),b.direction.transformDirection(m),f++}else if(y.isRectAreaLight){const b=i.rectArea[g];b.position.setFromMatrixPosition(y.matrixWorld),b.position.applyMatrix4(m),o.identity(),s.copy(y.matrixWorld),s.premultiply(m),o.extractRotation(s),b.halfWidth.set(y.width*.5,0,0),b.halfHeight.set(0,y.height*.5,0),b.halfWidth.applyMatrix4(o),b.halfHeight.applyMatrix4(o),g++}else if(y.isPointLight){const b=i.point[d];b.position.setFromMatrixPosition(y.matrixWorld),b.position.applyMatrix4(m),d++}else if(y.isHemisphereLight){const b=i.hemi[v];b.direction.setFromMatrixPosition(y.matrixWorld),b.direction.transformDirection(m),v++}}}return{setup:a,setupView:l,state:i}}function Xu(n){const e=new x_(n),t=[],i=[];function r(u){c.camera=u,t.length=0,i.length=0}function s(u){t.push(u)}function o(u){i.push(u)}function a(){e.setup(t)}function l(u){e.setupView(t,u)}const c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:a,setupLightsView:l,pushLight:s,pushShadow:o}}function b_(n){let e=new WeakMap;function t(r,s=0){const o=e.get(r);let a;return o===void 0?(a=new Xu(n),e.set(r,[a])):s>=o.length?(a=new Xu(n),o.push(a)):a=o[s],a}function i(){e=new WeakMap}return{get:t,dispose:i}}const y_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,M_=`uniform sampler2D shadow_pass;
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
}`;function S_(n,e,t){let i=new nc;const r=new xe,s=new xe,o=new Yt,a=new Wp({depthPacking:uf}),l=new $p,c={},u=t.maxTextureSize,h={[Qi]:Fn,[Fn]:Qi,[fi]:fi},d=new er({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new xe},radius:{value:4}},vertexShader:y_,fragmentShader:M_}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new hn;g.setAttribute("position",new jn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new Tn(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=mh;let p=this.type;this.render=function(w,R,P){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;const T=n.getRenderTarget(),E=n.getActiveCubeFace(),I=n.getActiveMipmapLevel(),B=n.state;B.setBlending(Zi),B.buffers.depth.getReversed()===!0?B.buffers.color.setClear(0,0,0,0):B.buffers.color.setClear(1,1,1,1),B.buffers.depth.setTest(!0),B.setScissorTest(!1);const k=p!==wi&&this.type===wi,q=p===wi&&this.type!==wi;for(let H=0,U=w.length;H<U;H++){const $=w[H],V=$.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",$,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;r.copy(V.mapSize);const ae=V.getFrameExtents();if(r.multiply(ae),s.copy(V.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/ae.x),r.x=s.x*ae.x,V.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/ae.y),r.y=s.y*ae.y,V.mapSize.y=s.y)),V.map===null||k===!0||q===!0){const Le=this.type!==wi?{minFilter:ai,magFilter:ai}:{};V.map!==null&&V.map.dispose(),V.map=new vr(r.x,r.y,Le),V.map.texture.name=$.name+".shadowMap",V.camera.updateProjectionMatrix()}n.setRenderTarget(V.map),n.clear();const ye=V.getViewportCount();for(let Le=0;Le<ye;Le++){const Je=V.getViewport(Le);o.set(s.x*Je.x,s.y*Je.y,s.x*Je.z,s.y*Je.w),B.viewport(o),V.updateMatrices($,Le),i=V.getFrustum(),b(R,P,V.camera,$,this.type)}V.isPointLightShadow!==!0&&this.type===wi&&x(V,P),V.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(T,E,I)};function x(w,R){const P=e.update(v);d.defines.VSM_SAMPLES!==w.blurSamples&&(d.defines.VSM_SAMPLES=w.blurSamples,f.defines.VSM_SAMPLES=w.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new vr(r.x,r.y)),d.uniforms.shadow_pass.value=w.map.texture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,n.setRenderTarget(w.mapPass),n.clear(),n.renderBufferDirect(R,null,P,d,v,null),f.uniforms.shadow_pass.value=w.mapPass.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,n.setRenderTarget(w.map),n.clear(),n.renderBufferDirect(R,null,P,f,v,null)}function y(w,R,P,T){let E=null;const I=P.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(I!==void 0)E=I;else if(E=P.isPointLight===!0?l:a,n.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const B=E.uuid,k=R.uuid;let q=c[B];q===void 0&&(q={},c[B]=q);let H=q[k];H===void 0&&(H=E.clone(),q[k]=H,R.addEventListener("dispose",S)),E=H}if(E.visible=R.visible,E.wireframe=R.wireframe,T===wi?E.side=R.shadowSide!==null?R.shadowSide:R.side:E.side=R.shadowSide!==null?R.shadowSide:h[R.side],E.alphaMap=R.alphaMap,E.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,E.map=R.map,E.clipShadows=R.clipShadows,E.clippingPlanes=R.clippingPlanes,E.clipIntersection=R.clipIntersection,E.displacementMap=R.displacementMap,E.displacementScale=R.displacementScale,E.displacementBias=R.displacementBias,E.wireframeLinewidth=R.wireframeLinewidth,E.linewidth=R.linewidth,P.isPointLight===!0&&E.isMeshDistanceMaterial===!0){const B=n.properties.get(E);B.light=P}return E}function b(w,R,P,T,E){if(w.visible===!1)return;if(w.layers.test(R.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&E===wi)&&(!w.frustumCulled||i.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,w.matrixWorld);const k=e.update(w),q=w.material;if(Array.isArray(q)){const H=k.groups;for(let U=0,$=H.length;U<$;U++){const V=H[U],ae=q[V.materialIndex];if(ae&&ae.visible){const ye=y(w,ae,T,E);w.onBeforeShadow(n,w,R,P,k,ye,V),n.renderBufferDirect(P,null,k,ye,w,V),w.onAfterShadow(n,w,R,P,k,ye,V)}}}else if(q.visible){const H=y(w,q,T,E);w.onBeforeShadow(n,w,R,P,k,H,null),n.renderBufferDirect(P,null,k,H,w,null),w.onAfterShadow(n,w,R,P,k,H,null)}}const B=w.children;for(let k=0,q=B.length;k<q;k++)b(B[k],R,P,T,E)}function S(w){w.target.removeEventListener("dispose",S);for(const P in c){const T=c[P],E=w.target.uuid;E in T&&(T[E].dispose(),delete T[E])}}}const E_={[Xa]:Ya,[ja]:Ja,[Za]:Qa,[ts]:Ka,[Ya]:Xa,[Ja]:ja,[Qa]:Za,[Ka]:ts};function T_(n,e){function t(){let z=!1;const me=new Yt;let we=null;const Fe=new Yt(0,0,0,0);return{setMask:function(ge){we!==ge&&!z&&(n.colorMask(ge,ge,ge,ge),we=ge)},setLocked:function(ge){z=ge},setClear:function(ge,ce,Ue,at,Pt){Pt===!0&&(ge*=at,ce*=at,Ue*=at),me.set(ge,ce,Ue,at),Fe.equals(me)===!1&&(n.clearColor(ge,ce,Ue,at),Fe.copy(me))},reset:function(){z=!1,we=null,Fe.set(-1,0,0,0)}}}function i(){let z=!1,me=!1,we=null,Fe=null,ge=null;return{setReversed:function(ce){if(me!==ce){const Ue=e.get("EXT_clip_control");ce?Ue.clipControlEXT(Ue.LOWER_LEFT_EXT,Ue.ZERO_TO_ONE_EXT):Ue.clipControlEXT(Ue.LOWER_LEFT_EXT,Ue.NEGATIVE_ONE_TO_ONE_EXT),me=ce;const at=ge;ge=null,this.setClear(at)}},getReversed:function(){return me},setTest:function(ce){ce?le(n.DEPTH_TEST):_e(n.DEPTH_TEST)},setMask:function(ce){we!==ce&&!z&&(n.depthMask(ce),we=ce)},setFunc:function(ce){if(me&&(ce=E_[ce]),Fe!==ce){switch(ce){case Xa:n.depthFunc(n.NEVER);break;case Ya:n.depthFunc(n.ALWAYS);break;case ja:n.depthFunc(n.LESS);break;case ts:n.depthFunc(n.LEQUAL);break;case Za:n.depthFunc(n.EQUAL);break;case Ka:n.depthFunc(n.GEQUAL);break;case Ja:n.depthFunc(n.GREATER);break;case Qa:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Fe=ce}},setLocked:function(ce){z=ce},setClear:function(ce){ge!==ce&&(me&&(ce=1-ce),n.clearDepth(ce),ge=ce)},reset:function(){z=!1,we=null,Fe=null,ge=null,me=!1}}}function r(){let z=!1,me=null,we=null,Fe=null,ge=null,ce=null,Ue=null,at=null,Pt=null;return{setTest:function(At){z||(At?le(n.STENCIL_TEST):_e(n.STENCIL_TEST))},setMask:function(At){me!==At&&!z&&(n.stencilMask(At),me=At)},setFunc:function(At,Zn,Vn){(we!==At||Fe!==Zn||ge!==Vn)&&(n.stencilFunc(At,Zn,Vn),we=At,Fe=Zn,ge=Vn)},setOp:function(At,Zn,Vn){(ce!==At||Ue!==Zn||at!==Vn)&&(n.stencilOp(At,Zn,Vn),ce=At,Ue=Zn,at=Vn)},setLocked:function(At){z=At},setClear:function(At){Pt!==At&&(n.clearStencil(At),Pt=At)},reset:function(){z=!1,me=null,we=null,Fe=null,ge=null,ce=null,Ue=null,at=null,Pt=null}}}const s=new t,o=new i,a=new r,l=new WeakMap,c=new WeakMap;let u={},h={},d=new WeakMap,f=[],g=null,v=!1,m=null,p=null,x=null,y=null,b=null,S=null,w=null,R=new Et(0,0,0),P=0,T=!1,E=null,I=null,B=null,k=null,q=null;const H=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let U=!1,$=0;const V=n.getParameter(n.VERSION);V.indexOf("WebGL")!==-1?($=parseFloat(/^WebGL (\d)/.exec(V)[1]),U=$>=1):V.indexOf("OpenGL ES")!==-1&&($=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),U=$>=2);let ae=null,ye={};const Le=n.getParameter(n.SCISSOR_BOX),Je=n.getParameter(n.VIEWPORT),je=new Yt().fromArray(Le),ht=new Yt().fromArray(Je);function pt(z,me,we,Fe){const ge=new Uint8Array(4),ce=n.createTexture();n.bindTexture(z,ce),n.texParameteri(z,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(z,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Ue=0;Ue<we;Ue++)z===n.TEXTURE_3D||z===n.TEXTURE_2D_ARRAY?n.texImage3D(me,0,n.RGBA,1,1,Fe,0,n.RGBA,n.UNSIGNED_BYTE,ge):n.texImage2D(me+Ue,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,ge);return ce}const J={};J[n.TEXTURE_2D]=pt(n.TEXTURE_2D,n.TEXTURE_2D,1),J[n.TEXTURE_CUBE_MAP]=pt(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),J[n.TEXTURE_2D_ARRAY]=pt(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),J[n.TEXTURE_3D]=pt(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),le(n.DEPTH_TEST),o.setFunc(ts),re(!1),ie(Fc),le(n.CULL_FACE),ue(Zi);function le(z){u[z]!==!0&&(n.enable(z),u[z]=!0)}function _e(z){u[z]!==!1&&(n.disable(z),u[z]=!1)}function He(z,me){return h[z]!==me?(n.bindFramebuffer(z,me),h[z]=me,z===n.DRAW_FRAMEBUFFER&&(h[n.FRAMEBUFFER]=me),z===n.FRAMEBUFFER&&(h[n.DRAW_FRAMEBUFFER]=me),!0):!1}function We(z,me){let we=f,Fe=!1;if(z){we=d.get(me),we===void 0&&(we=[],d.set(me,we));const ge=z.textures;if(we.length!==ge.length||we[0]!==n.COLOR_ATTACHMENT0){for(let ce=0,Ue=ge.length;ce<Ue;ce++)we[ce]=n.COLOR_ATTACHMENT0+ce;we.length=ge.length,Fe=!0}}else we[0]!==n.BACK&&(we[0]=n.BACK,Fe=!0);Fe&&n.drawBuffers(we)}function nt(z){return g!==z?(n.useProgram(z),g=z,!0):!1}const wt={[hr]:n.FUNC_ADD,[Od]:n.FUNC_SUBTRACT,[Fd]:n.FUNC_REVERSE_SUBTRACT};wt[kd]=n.MIN,wt[Bd]=n.MAX;const F={[zd]:n.ZERO,[Vd]:n.ONE,[Hd]:n.SRC_COLOR,[$a]:n.SRC_ALPHA,[Yd]:n.SRC_ALPHA_SATURATE,[qd]:n.DST_COLOR,[Wd]:n.DST_ALPHA,[Gd]:n.ONE_MINUS_SRC_COLOR,[qa]:n.ONE_MINUS_SRC_ALPHA,[Xd]:n.ONE_MINUS_DST_COLOR,[$d]:n.ONE_MINUS_DST_ALPHA,[jd]:n.CONSTANT_COLOR,[Zd]:n.ONE_MINUS_CONSTANT_COLOR,[Kd]:n.CONSTANT_ALPHA,[Jd]:n.ONE_MINUS_CONSTANT_ALPHA};function ue(z,me,we,Fe,ge,ce,Ue,at,Pt,At){if(z===Zi){v===!0&&(_e(n.BLEND),v=!1);return}if(v===!1&&(le(n.BLEND),v=!0),z!==Nd){if(z!==m||At!==T){if((p!==hr||b!==hr)&&(n.blendEquation(n.FUNC_ADD),p=hr,b=hr),At)switch(z){case Yr:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case kc:n.blendFunc(n.ONE,n.ONE);break;case Bc:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case zc:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",z);break}else switch(z){case Yr:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case kc:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case Bc:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case zc:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",z);break}x=null,y=null,S=null,w=null,R.set(0,0,0),P=0,m=z,T=At}return}ge=ge||me,ce=ce||we,Ue=Ue||Fe,(me!==p||ge!==b)&&(n.blendEquationSeparate(wt[me],wt[ge]),p=me,b=ge),(we!==x||Fe!==y||ce!==S||Ue!==w)&&(n.blendFuncSeparate(F[we],F[Fe],F[ce],F[Ue]),x=we,y=Fe,S=ce,w=Ue),(at.equals(R)===!1||Pt!==P)&&(n.blendColor(at.r,at.g,at.b,Pt),R.copy(at),P=Pt),m=z,T=!1}function oe(z,me){z.side===fi?_e(n.CULL_FACE):le(n.CULL_FACE);let we=z.side===Fn;me&&(we=!we),re(we),z.blending===Yr&&z.transparent===!1?ue(Zi):ue(z.blending,z.blendEquation,z.blendSrc,z.blendDst,z.blendEquationAlpha,z.blendSrcAlpha,z.blendDstAlpha,z.blendColor,z.blendAlpha,z.premultipliedAlpha),o.setFunc(z.depthFunc),o.setTest(z.depthTest),o.setMask(z.depthWrite),s.setMask(z.colorWrite);const Fe=z.stencilWrite;a.setTest(Fe),Fe&&(a.setMask(z.stencilWriteMask),a.setFunc(z.stencilFunc,z.stencilRef,z.stencilFuncMask),a.setOp(z.stencilFail,z.stencilZFail,z.stencilZPass)),fe(z.polygonOffset,z.polygonOffsetFactor,z.polygonOffsetUnits),z.alphaToCoverage===!0?le(n.SAMPLE_ALPHA_TO_COVERAGE):_e(n.SAMPLE_ALPHA_TO_COVERAGE)}function re(z){E!==z&&(z?n.frontFace(n.CW):n.frontFace(n.CCW),E=z)}function ie(z){z!==Id?(le(n.CULL_FACE),z!==I&&(z===Fc?n.cullFace(n.BACK):z===Ud?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):_e(n.CULL_FACE),I=z}function Me(z){z!==B&&(U&&n.lineWidth(z),B=z)}function fe(z,me,we){z?(le(n.POLYGON_OFFSET_FILL),(k!==me||q!==we)&&(n.polygonOffset(me,we),k=me,q=we)):_e(n.POLYGON_OFFSET_FILL)}function be(z){z?le(n.SCISSOR_TEST):_e(n.SCISSOR_TEST)}function it(z){z===void 0&&(z=n.TEXTURE0+H-1),ae!==z&&(n.activeTexture(z),ae=z)}function rt(z,me,we){we===void 0&&(ae===null?we=n.TEXTURE0+H-1:we=ae);let Fe=ye[we];Fe===void 0&&(Fe={type:void 0,texture:void 0},ye[we]=Fe),(Fe.type!==z||Fe.texture!==me)&&(ae!==we&&(n.activeTexture(we),ae=we),n.bindTexture(z,me||J[z]),Fe.type=z,Fe.texture=me)}function L(){const z=ye[ae];z!==void 0&&z.type!==void 0&&(n.bindTexture(z.type,null),z.type=void 0,z.texture=void 0)}function M(){try{n.compressedTexImage2D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function j(){try{n.compressedTexImage3D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Q(){try{n.texSubImage2D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function he(){try{n.texSubImage3D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function ee(){try{n.compressedTexSubImage2D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function $e(){try{n.compressedTexSubImage3D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function de(){try{n.texStorage2D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Ge(){try{n.texStorage3D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Ne(){try{n.texImage2D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function pe(){try{n.texImage3D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Ae(z){je.equals(z)===!1&&(n.scissor(z.x,z.y,z.z,z.w),je.copy(z))}function Qe(z){ht.equals(z)===!1&&(n.viewport(z.x,z.y,z.z,z.w),ht.copy(z))}function Oe(z,me){let we=c.get(me);we===void 0&&(we=new WeakMap,c.set(me,we));let Fe=we.get(z);Fe===void 0&&(Fe=n.getUniformBlockIndex(me,z.name),we.set(z,Fe))}function Re(z,me){const Fe=c.get(me).get(z);l.get(me)!==Fe&&(n.uniformBlockBinding(me,Fe,z.__bindingPointIndex),l.set(me,Fe))}function tt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),u={},ae=null,ye={},h={},d=new WeakMap,f=[],g=null,v=!1,m=null,p=null,x=null,y=null,b=null,S=null,w=null,R=new Et(0,0,0),P=0,T=!1,E=null,I=null,B=null,k=null,q=null,je.set(0,0,n.canvas.width,n.canvas.height),ht.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:le,disable:_e,bindFramebuffer:He,drawBuffers:We,useProgram:nt,setBlending:ue,setMaterial:oe,setFlipSided:re,setCullFace:ie,setLineWidth:Me,setPolygonOffset:fe,setScissorTest:be,activeTexture:it,bindTexture:rt,unbindTexture:L,compressedTexImage2D:M,compressedTexImage3D:j,texImage2D:Ne,texImage3D:pe,updateUBOMapping:Oe,uniformBlockBinding:Re,texStorage2D:de,texStorage3D:Ge,texSubImage2D:Q,texSubImage3D:he,compressedTexSubImage2D:ee,compressedTexSubImage3D:$e,scissor:Ae,viewport:Qe,reset:tt}}function w_(n,e,t,i,r,s,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new xe,u=new WeakMap;let h;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(L,M){return f?new OffscreenCanvas(L,M):Uo("canvas")}function v(L,M,j){let Q=1;const he=rt(L);if((he.width>j||he.height>j)&&(Q=j/Math.max(he.width,he.height)),Q<1)if(typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&L instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&L instanceof ImageBitmap||typeof VideoFrame<"u"&&L instanceof VideoFrame){const ee=Math.floor(Q*he.width),$e=Math.floor(Q*he.height);h===void 0&&(h=g(ee,$e));const de=M?g(ee,$e):h;return de.width=ee,de.height=$e,de.getContext("2d").drawImage(L,0,0,ee,$e),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+he.width+"x"+he.height+") to ("+ee+"x"+$e+")."),de}else return"data"in L&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+he.width+"x"+he.height+")."),L;return L}function m(L){return L.generateMipmaps}function p(L){n.generateMipmap(L)}function x(L){return L.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:L.isWebGL3DRenderTarget?n.TEXTURE_3D:L.isWebGLArrayRenderTarget||L.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function y(L,M,j,Q,he=!1){if(L!==null){if(n[L]!==void 0)return n[L];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+L+"'")}let ee=M;if(M===n.RED&&(j===n.FLOAT&&(ee=n.R32F),j===n.HALF_FLOAT&&(ee=n.R16F),j===n.UNSIGNED_BYTE&&(ee=n.R8)),M===n.RED_INTEGER&&(j===n.UNSIGNED_BYTE&&(ee=n.R8UI),j===n.UNSIGNED_SHORT&&(ee=n.R16UI),j===n.UNSIGNED_INT&&(ee=n.R32UI),j===n.BYTE&&(ee=n.R8I),j===n.SHORT&&(ee=n.R16I),j===n.INT&&(ee=n.R32I)),M===n.RG&&(j===n.FLOAT&&(ee=n.RG32F),j===n.HALF_FLOAT&&(ee=n.RG16F),j===n.UNSIGNED_BYTE&&(ee=n.RG8)),M===n.RG_INTEGER&&(j===n.UNSIGNED_BYTE&&(ee=n.RG8UI),j===n.UNSIGNED_SHORT&&(ee=n.RG16UI),j===n.UNSIGNED_INT&&(ee=n.RG32UI),j===n.BYTE&&(ee=n.RG8I),j===n.SHORT&&(ee=n.RG16I),j===n.INT&&(ee=n.RG32I)),M===n.RGB_INTEGER&&(j===n.UNSIGNED_BYTE&&(ee=n.RGB8UI),j===n.UNSIGNED_SHORT&&(ee=n.RGB16UI),j===n.UNSIGNED_INT&&(ee=n.RGB32UI),j===n.BYTE&&(ee=n.RGB8I),j===n.SHORT&&(ee=n.RGB16I),j===n.INT&&(ee=n.RGB32I)),M===n.RGBA_INTEGER&&(j===n.UNSIGNED_BYTE&&(ee=n.RGBA8UI),j===n.UNSIGNED_SHORT&&(ee=n.RGBA16UI),j===n.UNSIGNED_INT&&(ee=n.RGBA32UI),j===n.BYTE&&(ee=n.RGBA8I),j===n.SHORT&&(ee=n.RGBA16I),j===n.INT&&(ee=n.RGBA32I)),M===n.RGB&&(j===n.UNSIGNED_INT_5_9_9_9_REV&&(ee=n.RGB9_E5),j===n.UNSIGNED_INT_10F_11F_11F_REV&&(ee=n.R11F_G11F_B10F)),M===n.RGBA){const $e=he?Do:Lt.getTransfer(Q);j===n.FLOAT&&(ee=n.RGBA32F),j===n.HALF_FLOAT&&(ee=n.RGBA16F),j===n.UNSIGNED_BYTE&&(ee=$e===Nt?n.SRGB8_ALPHA8:n.RGBA8),j===n.UNSIGNED_SHORT_4_4_4_4&&(ee=n.RGBA4),j===n.UNSIGNED_SHORT_5_5_5_1&&(ee=n.RGB5_A1)}return(ee===n.R16F||ee===n.R32F||ee===n.RG16F||ee===n.RG32F||ee===n.RGBA16F||ee===n.RGBA32F)&&e.get("EXT_color_buffer_float"),ee}function b(L,M){let j;return L?M===null||M===gr||M===Is?j=n.DEPTH24_STENCIL8:M===Li?j=n.DEPTH32F_STENCIL8:M===Ds&&(j=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===gr||M===Is?j=n.DEPTH_COMPONENT24:M===Li?j=n.DEPTH_COMPONENT32F:M===Ds&&(j=n.DEPTH_COMPONENT16),j}function S(L,M){return m(L)===!0||L.isFramebufferTexture&&L.minFilter!==ai&&L.minFilter!==si?Math.log2(Math.max(M.width,M.height))+1:L.mipmaps!==void 0&&L.mipmaps.length>0?L.mipmaps.length:L.isCompressedTexture&&Array.isArray(L.image)?M.mipmaps.length:1}function w(L){const M=L.target;M.removeEventListener("dispose",w),P(M),M.isVideoTexture&&u.delete(M)}function R(L){const M=L.target;M.removeEventListener("dispose",R),E(M)}function P(L){const M=i.get(L);if(M.__webglInit===void 0)return;const j=L.source,Q=d.get(j);if(Q){const he=Q[M.__cacheKey];he.usedTimes--,he.usedTimes===0&&T(L),Object.keys(Q).length===0&&d.delete(j)}i.remove(L)}function T(L){const M=i.get(L);n.deleteTexture(M.__webglTexture);const j=L.source,Q=d.get(j);delete Q[M.__cacheKey],o.memory.textures--}function E(L){const M=i.get(L);if(L.depthTexture&&(L.depthTexture.dispose(),i.remove(L.depthTexture)),L.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(M.__webglFramebuffer[Q]))for(let he=0;he<M.__webglFramebuffer[Q].length;he++)n.deleteFramebuffer(M.__webglFramebuffer[Q][he]);else n.deleteFramebuffer(M.__webglFramebuffer[Q]);M.__webglDepthbuffer&&n.deleteRenderbuffer(M.__webglDepthbuffer[Q])}else{if(Array.isArray(M.__webglFramebuffer))for(let Q=0;Q<M.__webglFramebuffer.length;Q++)n.deleteFramebuffer(M.__webglFramebuffer[Q]);else n.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&n.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&n.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let Q=0;Q<M.__webglColorRenderbuffer.length;Q++)M.__webglColorRenderbuffer[Q]&&n.deleteRenderbuffer(M.__webglColorRenderbuffer[Q]);M.__webglDepthRenderbuffer&&n.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const j=L.textures;for(let Q=0,he=j.length;Q<he;Q++){const ee=i.get(j[Q]);ee.__webglTexture&&(n.deleteTexture(ee.__webglTexture),o.memory.textures--),i.remove(j[Q])}i.remove(L)}let I=0;function B(){I=0}function k(){const L=I;return L>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+L+" texture units while this GPU supports only "+r.maxTextures),I+=1,L}function q(L){const M=[];return M.push(L.wrapS),M.push(L.wrapT),M.push(L.wrapR||0),M.push(L.magFilter),M.push(L.minFilter),M.push(L.anisotropy),M.push(L.internalFormat),M.push(L.format),M.push(L.type),M.push(L.generateMipmaps),M.push(L.premultiplyAlpha),M.push(L.flipY),M.push(L.unpackAlignment),M.push(L.colorSpace),M.join()}function H(L,M){const j=i.get(L);if(L.isVideoTexture&&be(L),L.isRenderTargetTexture===!1&&L.isExternalTexture!==!0&&L.version>0&&j.__version!==L.version){const Q=L.image;if(Q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{J(j,L,M);return}}else L.isExternalTexture&&(j.__webglTexture=L.sourceTexture?L.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,j.__webglTexture,n.TEXTURE0+M)}function U(L,M){const j=i.get(L);if(L.isRenderTargetTexture===!1&&L.version>0&&j.__version!==L.version){J(j,L,M);return}t.bindTexture(n.TEXTURE_2D_ARRAY,j.__webglTexture,n.TEXTURE0+M)}function $(L,M){const j=i.get(L);if(L.isRenderTargetTexture===!1&&L.version>0&&j.__version!==L.version){J(j,L,M);return}t.bindTexture(n.TEXTURE_3D,j.__webglTexture,n.TEXTURE0+M)}function V(L,M){const j=i.get(L);if(L.version>0&&j.__version!==L.version){le(j,L,M);return}t.bindTexture(n.TEXTURE_CUBE_MAP,j.__webglTexture,n.TEXTURE0+M)}const ae={[nl]:n.REPEAT,[pr]:n.CLAMP_TO_EDGE,[il]:n.MIRRORED_REPEAT},ye={[ai]:n.NEAREST,[lf]:n.NEAREST_MIPMAP_NEAREST,[Zs]:n.NEAREST_MIPMAP_LINEAR,[si]:n.LINEAR,[la]:n.LINEAR_MIPMAP_NEAREST,[Yi]:n.LINEAR_MIPMAP_LINEAR},Le={[df]:n.NEVER,[_f]:n.ALWAYS,[ff]:n.LESS,[Ch]:n.LEQUAL,[pf]:n.EQUAL,[vf]:n.GEQUAL,[mf]:n.GREATER,[gf]:n.NOTEQUAL};function Je(L,M){if(M.type===Li&&e.has("OES_texture_float_linear")===!1&&(M.magFilter===si||M.magFilter===la||M.magFilter===Zs||M.magFilter===Yi||M.minFilter===si||M.minFilter===la||M.minFilter===Zs||M.minFilter===Yi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(L,n.TEXTURE_WRAP_S,ae[M.wrapS]),n.texParameteri(L,n.TEXTURE_WRAP_T,ae[M.wrapT]),(L===n.TEXTURE_3D||L===n.TEXTURE_2D_ARRAY)&&n.texParameteri(L,n.TEXTURE_WRAP_R,ae[M.wrapR]),n.texParameteri(L,n.TEXTURE_MAG_FILTER,ye[M.magFilter]),n.texParameteri(L,n.TEXTURE_MIN_FILTER,ye[M.minFilter]),M.compareFunction&&(n.texParameteri(L,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(L,n.TEXTURE_COMPARE_FUNC,Le[M.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===ai||M.minFilter!==Zs&&M.minFilter!==Yi||M.type===Li&&e.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||i.get(M).__currentAnisotropy){const j=e.get("EXT_texture_filter_anisotropic");n.texParameterf(L,j.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,r.getMaxAnisotropy())),i.get(M).__currentAnisotropy=M.anisotropy}}}function je(L,M){let j=!1;L.__webglInit===void 0&&(L.__webglInit=!0,M.addEventListener("dispose",w));const Q=M.source;let he=d.get(Q);he===void 0&&(he={},d.set(Q,he));const ee=q(M);if(ee!==L.__cacheKey){he[ee]===void 0&&(he[ee]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,j=!0),he[ee].usedTimes++;const $e=he[L.__cacheKey];$e!==void 0&&(he[L.__cacheKey].usedTimes--,$e.usedTimes===0&&T(M)),L.__cacheKey=ee,L.__webglTexture=he[ee].texture}return j}function ht(L,M,j){return Math.floor(Math.floor(L/j)/M)}function pt(L,M,j,Q){const ee=L.updateRanges;if(ee.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,M.width,M.height,j,Q,M.data);else{ee.sort((pe,Ae)=>pe.start-Ae.start);let $e=0;for(let pe=1;pe<ee.length;pe++){const Ae=ee[$e],Qe=ee[pe],Oe=Ae.start+Ae.count,Re=ht(Qe.start,M.width,4),tt=ht(Ae.start,M.width,4);Qe.start<=Oe+1&&Re===tt&&ht(Qe.start+Qe.count-1,M.width,4)===Re?Ae.count=Math.max(Ae.count,Qe.start+Qe.count-Ae.start):(++$e,ee[$e]=Qe)}ee.length=$e+1;const de=n.getParameter(n.UNPACK_ROW_LENGTH),Ge=n.getParameter(n.UNPACK_SKIP_PIXELS),Ne=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,M.width);for(let pe=0,Ae=ee.length;pe<Ae;pe++){const Qe=ee[pe],Oe=Math.floor(Qe.start/4),Re=Math.ceil(Qe.count/4),tt=Oe%M.width,z=Math.floor(Oe/M.width),me=Re,we=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,tt),n.pixelStorei(n.UNPACK_SKIP_ROWS,z),t.texSubImage2D(n.TEXTURE_2D,0,tt,z,me,we,j,Q,M.data)}L.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,de),n.pixelStorei(n.UNPACK_SKIP_PIXELS,Ge),n.pixelStorei(n.UNPACK_SKIP_ROWS,Ne)}}function J(L,M,j){let Q=n.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(Q=n.TEXTURE_2D_ARRAY),M.isData3DTexture&&(Q=n.TEXTURE_3D);const he=je(L,M),ee=M.source;t.bindTexture(Q,L.__webglTexture,n.TEXTURE0+j);const $e=i.get(ee);if(ee.version!==$e.__version||he===!0){t.activeTexture(n.TEXTURE0+j);const de=Lt.getPrimaries(Lt.workingColorSpace),Ge=M.colorSpace===qi?null:Lt.getPrimaries(M.colorSpace),Ne=M.colorSpace===qi||de===Ge?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,M.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,M.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ne);let pe=v(M.image,!1,r.maxTextureSize);pe=it(M,pe);const Ae=s.convert(M.format,M.colorSpace),Qe=s.convert(M.type);let Oe=y(M.internalFormat,Ae,Qe,M.colorSpace,M.isVideoTexture);Je(Q,M);let Re;const tt=M.mipmaps,z=M.isVideoTexture!==!0,me=$e.__version===void 0||he===!0,we=ee.dataReady,Fe=S(M,pe);if(M.isDepthTexture)Oe=b(M.format===Ns,M.type),me&&(z?t.texStorage2D(n.TEXTURE_2D,1,Oe,pe.width,pe.height):t.texImage2D(n.TEXTURE_2D,0,Oe,pe.width,pe.height,0,Ae,Qe,null));else if(M.isDataTexture)if(tt.length>0){z&&me&&t.texStorage2D(n.TEXTURE_2D,Fe,Oe,tt[0].width,tt[0].height);for(let ge=0,ce=tt.length;ge<ce;ge++)Re=tt[ge],z?we&&t.texSubImage2D(n.TEXTURE_2D,ge,0,0,Re.width,Re.height,Ae,Qe,Re.data):t.texImage2D(n.TEXTURE_2D,ge,Oe,Re.width,Re.height,0,Ae,Qe,Re.data);M.generateMipmaps=!1}else z?(me&&t.texStorage2D(n.TEXTURE_2D,Fe,Oe,pe.width,pe.height),we&&pt(M,pe,Ae,Qe)):t.texImage2D(n.TEXTURE_2D,0,Oe,pe.width,pe.height,0,Ae,Qe,pe.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){z&&me&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Fe,Oe,tt[0].width,tt[0].height,pe.depth);for(let ge=0,ce=tt.length;ge<ce;ge++)if(Re=tt[ge],M.format!==oi)if(Ae!==null)if(z){if(we)if(M.layerUpdates.size>0){const Ue=Su(Re.width,Re.height,M.format,M.type);for(const at of M.layerUpdates){const Pt=Re.data.subarray(at*Ue/Re.data.BYTES_PER_ELEMENT,(at+1)*Ue/Re.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ge,0,0,at,Re.width,Re.height,1,Ae,Pt)}M.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ge,0,0,0,Re.width,Re.height,pe.depth,Ae,Re.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,ge,Oe,Re.width,Re.height,pe.depth,0,Re.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else z?we&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,ge,0,0,0,Re.width,Re.height,pe.depth,Ae,Qe,Re.data):t.texImage3D(n.TEXTURE_2D_ARRAY,ge,Oe,Re.width,Re.height,pe.depth,0,Ae,Qe,Re.data)}else{z&&me&&t.texStorage2D(n.TEXTURE_2D,Fe,Oe,tt[0].width,tt[0].height);for(let ge=0,ce=tt.length;ge<ce;ge++)Re=tt[ge],M.format!==oi?Ae!==null?z?we&&t.compressedTexSubImage2D(n.TEXTURE_2D,ge,0,0,Re.width,Re.height,Ae,Re.data):t.compressedTexImage2D(n.TEXTURE_2D,ge,Oe,Re.width,Re.height,0,Re.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):z?we&&t.texSubImage2D(n.TEXTURE_2D,ge,0,0,Re.width,Re.height,Ae,Qe,Re.data):t.texImage2D(n.TEXTURE_2D,ge,Oe,Re.width,Re.height,0,Ae,Qe,Re.data)}else if(M.isDataArrayTexture)if(z){if(me&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Fe,Oe,pe.width,pe.height,pe.depth),we)if(M.layerUpdates.size>0){const ge=Su(pe.width,pe.height,M.format,M.type);for(const ce of M.layerUpdates){const Ue=pe.data.subarray(ce*ge/pe.data.BYTES_PER_ELEMENT,(ce+1)*ge/pe.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,ce,pe.width,pe.height,1,Ae,Qe,Ue)}M.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,pe.width,pe.height,pe.depth,Ae,Qe,pe.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Oe,pe.width,pe.height,pe.depth,0,Ae,Qe,pe.data);else if(M.isData3DTexture)z?(me&&t.texStorage3D(n.TEXTURE_3D,Fe,Oe,pe.width,pe.height,pe.depth),we&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,pe.width,pe.height,pe.depth,Ae,Qe,pe.data)):t.texImage3D(n.TEXTURE_3D,0,Oe,pe.width,pe.height,pe.depth,0,Ae,Qe,pe.data);else if(M.isFramebufferTexture){if(me)if(z)t.texStorage2D(n.TEXTURE_2D,Fe,Oe,pe.width,pe.height);else{let ge=pe.width,ce=pe.height;for(let Ue=0;Ue<Fe;Ue++)t.texImage2D(n.TEXTURE_2D,Ue,Oe,ge,ce,0,Ae,Qe,null),ge>>=1,ce>>=1}}else if(tt.length>0){if(z&&me){const ge=rt(tt[0]);t.texStorage2D(n.TEXTURE_2D,Fe,Oe,ge.width,ge.height)}for(let ge=0,ce=tt.length;ge<ce;ge++)Re=tt[ge],z?we&&t.texSubImage2D(n.TEXTURE_2D,ge,0,0,Ae,Qe,Re):t.texImage2D(n.TEXTURE_2D,ge,Oe,Ae,Qe,Re);M.generateMipmaps=!1}else if(z){if(me){const ge=rt(pe);t.texStorage2D(n.TEXTURE_2D,Fe,Oe,ge.width,ge.height)}we&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,Ae,Qe,pe)}else t.texImage2D(n.TEXTURE_2D,0,Oe,Ae,Qe,pe);m(M)&&p(Q),$e.__version=ee.version,M.onUpdate&&M.onUpdate(M)}L.__version=M.version}function le(L,M,j){if(M.image.length!==6)return;const Q=je(L,M),he=M.source;t.bindTexture(n.TEXTURE_CUBE_MAP,L.__webglTexture,n.TEXTURE0+j);const ee=i.get(he);if(he.version!==ee.__version||Q===!0){t.activeTexture(n.TEXTURE0+j);const $e=Lt.getPrimaries(Lt.workingColorSpace),de=M.colorSpace===qi?null:Lt.getPrimaries(M.colorSpace),Ge=M.colorSpace===qi||$e===de?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,M.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,M.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ge);const Ne=M.isCompressedTexture||M.image[0].isCompressedTexture,pe=M.image[0]&&M.image[0].isDataTexture,Ae=[];for(let ce=0;ce<6;ce++)!Ne&&!pe?Ae[ce]=v(M.image[ce],!0,r.maxCubemapSize):Ae[ce]=pe?M.image[ce].image:M.image[ce],Ae[ce]=it(M,Ae[ce]);const Qe=Ae[0],Oe=s.convert(M.format,M.colorSpace),Re=s.convert(M.type),tt=y(M.internalFormat,Oe,Re,M.colorSpace),z=M.isVideoTexture!==!0,me=ee.__version===void 0||Q===!0,we=he.dataReady;let Fe=S(M,Qe);Je(n.TEXTURE_CUBE_MAP,M);let ge;if(Ne){z&&me&&t.texStorage2D(n.TEXTURE_CUBE_MAP,Fe,tt,Qe.width,Qe.height);for(let ce=0;ce<6;ce++){ge=Ae[ce].mipmaps;for(let Ue=0;Ue<ge.length;Ue++){const at=ge[Ue];M.format!==oi?Oe!==null?z?we&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ce,Ue,0,0,at.width,at.height,Oe,at.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ce,Ue,tt,at.width,at.height,0,at.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):z?we&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ce,Ue,0,0,at.width,at.height,Oe,Re,at.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ce,Ue,tt,at.width,at.height,0,Oe,Re,at.data)}}}else{if(ge=M.mipmaps,z&&me){ge.length>0&&Fe++;const ce=rt(Ae[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,Fe,tt,ce.width,ce.height)}for(let ce=0;ce<6;ce++)if(pe){z?we&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ce,0,0,0,Ae[ce].width,Ae[ce].height,Oe,Re,Ae[ce].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ce,0,tt,Ae[ce].width,Ae[ce].height,0,Oe,Re,Ae[ce].data);for(let Ue=0;Ue<ge.length;Ue++){const Pt=ge[Ue].image[ce].image;z?we&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ce,Ue+1,0,0,Pt.width,Pt.height,Oe,Re,Pt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ce,Ue+1,tt,Pt.width,Pt.height,0,Oe,Re,Pt.data)}}else{z?we&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ce,0,0,0,Oe,Re,Ae[ce]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ce,0,tt,Oe,Re,Ae[ce]);for(let Ue=0;Ue<ge.length;Ue++){const at=ge[Ue];z?we&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ce,Ue+1,0,0,Oe,Re,at.image[ce]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ce,Ue+1,tt,Oe,Re,at.image[ce])}}}m(M)&&p(n.TEXTURE_CUBE_MAP),ee.__version=he.version,M.onUpdate&&M.onUpdate(M)}L.__version=M.version}function _e(L,M,j,Q,he,ee){const $e=s.convert(j.format,j.colorSpace),de=s.convert(j.type),Ge=y(j.internalFormat,$e,de,j.colorSpace),Ne=i.get(M),pe=i.get(j);if(pe.__renderTarget=M,!Ne.__hasExternalTextures){const Ae=Math.max(1,M.width>>ee),Qe=Math.max(1,M.height>>ee);he===n.TEXTURE_3D||he===n.TEXTURE_2D_ARRAY?t.texImage3D(he,ee,Ge,Ae,Qe,M.depth,0,$e,de,null):t.texImage2D(he,ee,Ge,Ae,Qe,0,$e,de,null)}t.bindFramebuffer(n.FRAMEBUFFER,L),fe(M)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Q,he,pe.__webglTexture,0,Me(M)):(he===n.TEXTURE_2D||he>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&he<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,Q,he,pe.__webglTexture,ee),t.bindFramebuffer(n.FRAMEBUFFER,null)}function He(L,M,j){if(n.bindRenderbuffer(n.RENDERBUFFER,L),M.depthBuffer){const Q=M.depthTexture,he=Q&&Q.isDepthTexture?Q.type:null,ee=b(M.stencilBuffer,he),$e=M.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,de=Me(M);fe(M)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,de,ee,M.width,M.height):j?n.renderbufferStorageMultisample(n.RENDERBUFFER,de,ee,M.width,M.height):n.renderbufferStorage(n.RENDERBUFFER,ee,M.width,M.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,$e,n.RENDERBUFFER,L)}else{const Q=M.textures;for(let he=0;he<Q.length;he++){const ee=Q[he],$e=s.convert(ee.format,ee.colorSpace),de=s.convert(ee.type),Ge=y(ee.internalFormat,$e,de,ee.colorSpace),Ne=Me(M);j&&fe(M)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ne,Ge,M.width,M.height):fe(M)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ne,Ge,M.width,M.height):n.renderbufferStorage(n.RENDERBUFFER,Ge,M.width,M.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function We(L,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,L),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Q=i.get(M.depthTexture);Q.__renderTarget=M,(!Q.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),H(M.depthTexture,0);const he=Q.__webglTexture,ee=Me(M);if(M.depthTexture.format===Us)fe(M)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,he,0,ee):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,he,0);else if(M.depthTexture.format===Ns)fe(M)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,he,0,ee):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,he,0);else throw new Error("Unknown depthTexture format")}function nt(L){const M=i.get(L),j=L.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==L.depthTexture){const Q=L.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),Q){const he=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,Q.removeEventListener("dispose",he)};Q.addEventListener("dispose",he),M.__depthDisposeCallback=he}M.__boundDepthTexture=Q}if(L.depthTexture&&!M.__autoAllocateDepthBuffer){if(j)throw new Error("target.depthTexture not supported in Cube render targets");const Q=L.texture.mipmaps;Q&&Q.length>0?We(M.__webglFramebuffer[0],L):We(M.__webglFramebuffer,L)}else if(j){M.__webglDepthbuffer=[];for(let Q=0;Q<6;Q++)if(t.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer[Q]),M.__webglDepthbuffer[Q]===void 0)M.__webglDepthbuffer[Q]=n.createRenderbuffer(),He(M.__webglDepthbuffer[Q],L,!1);else{const he=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ee=M.__webglDepthbuffer[Q];n.bindRenderbuffer(n.RENDERBUFFER,ee),n.framebufferRenderbuffer(n.FRAMEBUFFER,he,n.RENDERBUFFER,ee)}}else{const Q=L.texture.mipmaps;if(Q&&Q.length>0?t.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=n.createRenderbuffer(),He(M.__webglDepthbuffer,L,!1);else{const he=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ee=M.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ee),n.framebufferRenderbuffer(n.FRAMEBUFFER,he,n.RENDERBUFFER,ee)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function wt(L,M,j){const Q=i.get(L);M!==void 0&&_e(Q.__webglFramebuffer,L,L.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),j!==void 0&&nt(L)}function F(L){const M=L.texture,j=i.get(L),Q=i.get(M);L.addEventListener("dispose",R);const he=L.textures,ee=L.isWebGLCubeRenderTarget===!0,$e=he.length>1;if($e||(Q.__webglTexture===void 0&&(Q.__webglTexture=n.createTexture()),Q.__version=M.version,o.memory.textures++),ee){j.__webglFramebuffer=[];for(let de=0;de<6;de++)if(M.mipmaps&&M.mipmaps.length>0){j.__webglFramebuffer[de]=[];for(let Ge=0;Ge<M.mipmaps.length;Ge++)j.__webglFramebuffer[de][Ge]=n.createFramebuffer()}else j.__webglFramebuffer[de]=n.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){j.__webglFramebuffer=[];for(let de=0;de<M.mipmaps.length;de++)j.__webglFramebuffer[de]=n.createFramebuffer()}else j.__webglFramebuffer=n.createFramebuffer();if($e)for(let de=0,Ge=he.length;de<Ge;de++){const Ne=i.get(he[de]);Ne.__webglTexture===void 0&&(Ne.__webglTexture=n.createTexture(),o.memory.textures++)}if(L.samples>0&&fe(L)===!1){j.__webglMultisampledFramebuffer=n.createFramebuffer(),j.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,j.__webglMultisampledFramebuffer);for(let de=0;de<he.length;de++){const Ge=he[de];j.__webglColorRenderbuffer[de]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,j.__webglColorRenderbuffer[de]);const Ne=s.convert(Ge.format,Ge.colorSpace),pe=s.convert(Ge.type),Ae=y(Ge.internalFormat,Ne,pe,Ge.colorSpace,L.isXRRenderTarget===!0),Qe=Me(L);n.renderbufferStorageMultisample(n.RENDERBUFFER,Qe,Ae,L.width,L.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+de,n.RENDERBUFFER,j.__webglColorRenderbuffer[de])}n.bindRenderbuffer(n.RENDERBUFFER,null),L.depthBuffer&&(j.__webglDepthRenderbuffer=n.createRenderbuffer(),He(j.__webglDepthRenderbuffer,L,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ee){t.bindTexture(n.TEXTURE_CUBE_MAP,Q.__webglTexture),Je(n.TEXTURE_CUBE_MAP,M);for(let de=0;de<6;de++)if(M.mipmaps&&M.mipmaps.length>0)for(let Ge=0;Ge<M.mipmaps.length;Ge++)_e(j.__webglFramebuffer[de][Ge],L,M,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+de,Ge);else _e(j.__webglFramebuffer[de],L,M,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+de,0);m(M)&&p(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if($e){for(let de=0,Ge=he.length;de<Ge;de++){const Ne=he[de],pe=i.get(Ne);let Ae=n.TEXTURE_2D;(L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(Ae=L.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(Ae,pe.__webglTexture),Je(Ae,Ne),_e(j.__webglFramebuffer,L,Ne,n.COLOR_ATTACHMENT0+de,Ae,0),m(Ne)&&p(Ae)}t.unbindTexture()}else{let de=n.TEXTURE_2D;if((L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(de=L.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(de,Q.__webglTexture),Je(de,M),M.mipmaps&&M.mipmaps.length>0)for(let Ge=0;Ge<M.mipmaps.length;Ge++)_e(j.__webglFramebuffer[Ge],L,M,n.COLOR_ATTACHMENT0,de,Ge);else _e(j.__webglFramebuffer,L,M,n.COLOR_ATTACHMENT0,de,0);m(M)&&p(de),t.unbindTexture()}L.depthBuffer&&nt(L)}function ue(L){const M=L.textures;for(let j=0,Q=M.length;j<Q;j++){const he=M[j];if(m(he)){const ee=x(L),$e=i.get(he).__webglTexture;t.bindTexture(ee,$e),p(ee),t.unbindTexture()}}}const oe=[],re=[];function ie(L){if(L.samples>0){if(fe(L)===!1){const M=L.textures,j=L.width,Q=L.height;let he=n.COLOR_BUFFER_BIT;const ee=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,$e=i.get(L),de=M.length>1;if(de)for(let Ne=0;Ne<M.length;Ne++)t.bindFramebuffer(n.FRAMEBUFFER,$e.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ne,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,$e.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ne,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,$e.__webglMultisampledFramebuffer);const Ge=L.texture.mipmaps;Ge&&Ge.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,$e.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,$e.__webglFramebuffer);for(let Ne=0;Ne<M.length;Ne++){if(L.resolveDepthBuffer&&(L.depthBuffer&&(he|=n.DEPTH_BUFFER_BIT),L.stencilBuffer&&L.resolveStencilBuffer&&(he|=n.STENCIL_BUFFER_BIT)),de){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,$e.__webglColorRenderbuffer[Ne]);const pe=i.get(M[Ne]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,pe,0)}n.blitFramebuffer(0,0,j,Q,0,0,j,Q,he,n.NEAREST),l===!0&&(oe.length=0,re.length=0,oe.push(n.COLOR_ATTACHMENT0+Ne),L.depthBuffer&&L.resolveDepthBuffer===!1&&(oe.push(ee),re.push(ee),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,re)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,oe))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),de)for(let Ne=0;Ne<M.length;Ne++){t.bindFramebuffer(n.FRAMEBUFFER,$e.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ne,n.RENDERBUFFER,$e.__webglColorRenderbuffer[Ne]);const pe=i.get(M[Ne]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,$e.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ne,n.TEXTURE_2D,pe,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,$e.__webglMultisampledFramebuffer)}else if(L.depthBuffer&&L.resolveDepthBuffer===!1&&l){const M=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[M])}}}function Me(L){return Math.min(r.maxSamples,L.samples)}function fe(L){const M=i.get(L);return L.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function be(L){const M=o.render.frame;u.get(L)!==M&&(u.set(L,M),L.update())}function it(L,M){const j=L.colorSpace,Q=L.format,he=L.type;return L.isCompressedTexture===!0||L.isVideoTexture===!0||j!==rs&&j!==qi&&(Lt.getTransfer(j)===Nt?(Q!==oi||he!==mi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",j)),M}function rt(L){return typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement?(c.width=L.naturalWidth||L.width,c.height=L.naturalHeight||L.height):typeof VideoFrame<"u"&&L instanceof VideoFrame?(c.width=L.displayWidth,c.height=L.displayHeight):(c.width=L.width,c.height=L.height),c}this.allocateTextureUnit=k,this.resetTextureUnits=B,this.setTexture2D=H,this.setTexture2DArray=U,this.setTexture3D=$,this.setTextureCube=V,this.rebindTextures=wt,this.setupRenderTarget=F,this.updateRenderTargetMipmap=ue,this.updateMultisampleRenderTarget=ie,this.setupDepthRenderbuffer=nt,this.setupFrameBufferTexture=_e,this.useMultisampledRTT=fe}function A_(n,e){function t(i,r=qi){let s;const o=Lt.getTransfer(r);if(i===mi)return n.UNSIGNED_BYTE;if(i===Xl)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Yl)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Mh)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Sh)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===bh)return n.BYTE;if(i===yh)return n.SHORT;if(i===Ds)return n.UNSIGNED_SHORT;if(i===ql)return n.INT;if(i===gr)return n.UNSIGNED_INT;if(i===Li)return n.FLOAT;if(i===Hs)return n.HALF_FLOAT;if(i===Eh)return n.ALPHA;if(i===Th)return n.RGB;if(i===oi)return n.RGBA;if(i===Us)return n.DEPTH_COMPONENT;if(i===Ns)return n.DEPTH_STENCIL;if(i===wh)return n.RED;if(i===jl)return n.RED_INTEGER;if(i===Ah)return n.RG;if(i===Zl)return n.RG_INTEGER;if(i===Kl)return n.RGBA_INTEGER;if(i===Ao||i===Ro||i===Co||i===Po)if(o===Nt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Ao)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Ro)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Co)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Po)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Ao)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Ro)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Co)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Po)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===rl||i===sl||i===ol||i===al)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===rl)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===sl)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===ol)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===al)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===ll||i===cl||i===ul)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===ll||i===cl)return o===Nt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===ul)return o===Nt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===hl||i===dl||i===fl||i===pl||i===ml||i===gl||i===vl||i===_l||i===xl||i===bl||i===yl||i===Ml||i===Sl||i===El)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===hl)return o===Nt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===dl)return o===Nt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===fl)return o===Nt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===pl)return o===Nt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===ml)return o===Nt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===gl)return o===Nt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===vl)return o===Nt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===_l)return o===Nt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===xl)return o===Nt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===bl)return o===Nt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===yl)return o===Nt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Ml)return o===Nt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Sl)return o===Nt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===El)return o===Nt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Tl||i===wl||i===Al)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===Tl)return o===Nt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===wl)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Al)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Rl||i===Cl||i===Pl||i===Ll)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===Rl)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Cl)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Pl)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Ll)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Is?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const R_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,C_=`
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

}`;class P_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new Bh(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new er({vertexShader:R_,fragmentShader:C_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Tn(new Di(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class L_ extends xr{constructor(e,t){super();const i=this;let r=null,s=1,o=null,a="local-floor",l=1,c=null,u=null,h=null,d=null,f=null,g=null;const v=typeof XRWebGLBinding<"u",m=new P_,p={},x=t.getContextAttributes();let y=null,b=null;const S=[],w=[],R=new xe;let P=null;const T=new Xn;T.viewport=new Yt;const E=new Xn;E.viewport=new Yt;const I=[T,E],B=new Zp;let k=null,q=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let le=S[J];return le===void 0&&(le=new Ca,S[J]=le),le.getTargetRaySpace()},this.getControllerGrip=function(J){let le=S[J];return le===void 0&&(le=new Ca,S[J]=le),le.getGripSpace()},this.getHand=function(J){let le=S[J];return le===void 0&&(le=new Ca,S[J]=le),le.getHandSpace()};function H(J){const le=w.indexOf(J.inputSource);if(le===-1)return;const _e=S[le];_e!==void 0&&(_e.update(J.inputSource,J.frame,c||o),_e.dispatchEvent({type:J.type,data:J.inputSource}))}function U(){r.removeEventListener("select",H),r.removeEventListener("selectstart",H),r.removeEventListener("selectend",H),r.removeEventListener("squeeze",H),r.removeEventListener("squeezestart",H),r.removeEventListener("squeezeend",H),r.removeEventListener("end",U),r.removeEventListener("inputsourceschange",$);for(let J=0;J<S.length;J++){const le=w[J];le!==null&&(w[J]=null,S[J].disconnect(le))}k=null,q=null,m.reset();for(const J in p)delete p[J];e.setRenderTarget(y),f=null,d=null,h=null,r=null,b=null,pt.stop(),i.isPresenting=!1,e.setPixelRatio(P),e.setSize(R.width,R.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){s=J,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){a=J,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(J){c=J},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return h===null&&v&&(h=new XRWebGLBinding(r,t)),h},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(J){if(r=J,r!==null){if(y=e.getRenderTarget(),r.addEventListener("select",H),r.addEventListener("selectstart",H),r.addEventListener("selectend",H),r.addEventListener("squeeze",H),r.addEventListener("squeezestart",H),r.addEventListener("squeezeend",H),r.addEventListener("end",U),r.addEventListener("inputsourceschange",$),x.xrCompatible!==!0&&await t.makeXRCompatible(),P=e.getPixelRatio(),e.getSize(R),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let _e=null,He=null,We=null;x.depth&&(We=x.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,_e=x.stencil?Ns:Us,He=x.stencil?Is:gr);const nt={colorFormat:t.RGBA8,depthFormat:We,scaleFactor:s};h=this.getBinding(),d=h.createProjectionLayer(nt),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),b=new vr(d.textureWidth,d.textureHeight,{format:oi,type:mi,depthTexture:new kh(d.textureWidth,d.textureHeight,He,void 0,void 0,void 0,void 0,void 0,void 0,_e),stencilBuffer:x.stencil,colorSpace:e.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const _e={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(r,t,_e),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),b=new vr(f.framebufferWidth,f.framebufferHeight,{format:oi,type:mi,colorSpace:e.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),pt.setContext(r),pt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function $(J){for(let le=0;le<J.removed.length;le++){const _e=J.removed[le],He=w.indexOf(_e);He>=0&&(w[He]=null,S[He].disconnect(_e))}for(let le=0;le<J.added.length;le++){const _e=J.added[le];let He=w.indexOf(_e);if(He===-1){for(let nt=0;nt<S.length;nt++)if(nt>=w.length){w.push(_e),He=nt;break}else if(w[nt]===null){w[nt]=_e,He=nt;break}if(He===-1)break}const We=S[He];We&&We.connect(_e)}}const V=new D,ae=new D;function ye(J,le,_e){V.setFromMatrixPosition(le.matrixWorld),ae.setFromMatrixPosition(_e.matrixWorld);const He=V.distanceTo(ae),We=le.projectionMatrix.elements,nt=_e.projectionMatrix.elements,wt=We[14]/(We[10]-1),F=We[14]/(We[10]+1),ue=(We[9]+1)/We[5],oe=(We[9]-1)/We[5],re=(We[8]-1)/We[0],ie=(nt[8]+1)/nt[0],Me=wt*re,fe=wt*ie,be=He/(-re+ie),it=be*-re;if(le.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(it),J.translateZ(be),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),We[10]===-1)J.projectionMatrix.copy(le.projectionMatrix),J.projectionMatrixInverse.copy(le.projectionMatrixInverse);else{const rt=wt+be,L=F+be,M=Me-it,j=fe+(He-it),Q=ue*F/L*rt,he=oe*F/L*rt;J.projectionMatrix.makePerspective(M,j,Q,he,rt,L),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function Le(J,le){le===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(le.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(r===null)return;let le=J.near,_e=J.far;m.texture!==null&&(m.depthNear>0&&(le=m.depthNear),m.depthFar>0&&(_e=m.depthFar)),B.near=E.near=T.near=le,B.far=E.far=T.far=_e,(k!==B.near||q!==B.far)&&(r.updateRenderState({depthNear:B.near,depthFar:B.far}),k=B.near,q=B.far),B.layers.mask=J.layers.mask|6,T.layers.mask=B.layers.mask&3,E.layers.mask=B.layers.mask&5;const He=J.parent,We=B.cameras;Le(B,He);for(let nt=0;nt<We.length;nt++)Le(We[nt],He);We.length===2?ye(B,T,E):B.projectionMatrix.copy(T.projectionMatrix),Je(J,B,He)};function Je(J,le,_e){_e===null?J.matrix.copy(le.matrixWorld):(J.matrix.copy(_e.matrixWorld),J.matrix.invert(),J.matrix.multiply(le.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(le.projectionMatrix),J.projectionMatrixInverse.copy(le.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=Os*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return B},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(J){l=J,d!==null&&(d.fixedFoveation=J),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=J)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(B)},this.getCameraTexture=function(J){return p[J]};let je=null;function ht(J,le){if(u=le.getViewerPose(c||o),g=le,u!==null){const _e=u.views;f!==null&&(e.setRenderTargetFramebuffer(b,f.framebuffer),e.setRenderTarget(b));let He=!1;_e.length!==B.cameras.length&&(B.cameras.length=0,He=!0);for(let F=0;F<_e.length;F++){const ue=_e[F];let oe=null;if(f!==null)oe=f.getViewport(ue);else{const ie=h.getViewSubImage(d,ue);oe=ie.viewport,F===0&&(e.setRenderTargetTextures(b,ie.colorTexture,ie.depthStencilTexture),e.setRenderTarget(b))}let re=I[F];re===void 0&&(re=new Xn,re.layers.enable(F),re.viewport=new Yt,I[F]=re),re.matrix.fromArray(ue.transform.matrix),re.matrix.decompose(re.position,re.quaternion,re.scale),re.projectionMatrix.fromArray(ue.projectionMatrix),re.projectionMatrixInverse.copy(re.projectionMatrix).invert(),re.viewport.set(oe.x,oe.y,oe.width,oe.height),F===0&&(B.matrix.copy(re.matrix),B.matrix.decompose(B.position,B.quaternion,B.scale)),He===!0&&B.cameras.push(re)}const We=r.enabledFeatures;if(We&&We.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&v){h=i.getBinding();const F=h.getDepthInformation(_e[0]);F&&F.isValid&&F.texture&&m.init(F,r.renderState)}if(We&&We.includes("camera-access")&&v){e.state.unbindTexture(),h=i.getBinding();for(let F=0;F<_e.length;F++){const ue=_e[F].camera;if(ue){let oe=p[ue];oe||(oe=new Bh,p[ue]=oe);const re=h.getCameraImage(ue);oe.sourceTexture=re}}}}for(let _e=0;_e<S.length;_e++){const He=w[_e],We=S[_e];He!==null&&We!==void 0&&We.update(He,le,c||o)}je&&je(J,le),le.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:le}),g=null}const pt=new Kh;pt.setAnimationLoop(ht),this.setAnimationLoop=function(J){je=J},this.dispose=function(){}}}const cr=new li,D_=new Ht;function I_(n,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,Nh(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function r(m,p,x,y,b){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(m,p):p.isMeshToonMaterial?(s(m,p),h(m,p)):p.isMeshPhongMaterial?(s(m,p),u(m,p)):p.isMeshStandardMaterial?(s(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,b)):p.isMeshMatcapMaterial?(s(m,p),g(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),v(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,x,y):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Fn&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Fn&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const x=e.get(p),y=x.envMap,b=x.envMapRotation;y&&(m.envMap.value=y,cr.copy(b),cr.x*=-1,cr.y*=-1,cr.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(cr.y*=-1,cr.z*=-1),m.envMapRotation.value.setFromMatrix4(D_.makeRotationFromEuler(cr)),m.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,x,y){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*x,m.scale.value=y*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function u(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function h(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,x){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Fn&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function v(m,p){const x=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function U_(n,e,t,i){let r={},s={},o=[];const a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,y){const b=y.program;i.uniformBlockBinding(x,b)}function c(x,y){let b=r[x.id];b===void 0&&(g(x),b=u(x),r[x.id]=b,x.addEventListener("dispose",m));const S=y.program;i.updateUBOMapping(x,S);const w=e.render.frame;s[x.id]!==w&&(d(x),s[x.id]=w)}function u(x){const y=h();x.__bindingPointIndex=y;const b=n.createBuffer(),S=x.__size,w=x.usage;return n.bindBuffer(n.UNIFORM_BUFFER,b),n.bufferData(n.UNIFORM_BUFFER,S,w),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,y,b),b}function h(){for(let x=0;x<a;x++)if(o.indexOf(x)===-1)return o.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(x){const y=r[x.id],b=x.uniforms,S=x.__cache;n.bindBuffer(n.UNIFORM_BUFFER,y);for(let w=0,R=b.length;w<R;w++){const P=Array.isArray(b[w])?b[w]:[b[w]];for(let T=0,E=P.length;T<E;T++){const I=P[T];if(f(I,w,T,S)===!0){const B=I.__offset,k=Array.isArray(I.value)?I.value:[I.value];let q=0;for(let H=0;H<k.length;H++){const U=k[H],$=v(U);typeof U=="number"||typeof U=="boolean"?(I.__data[0]=U,n.bufferSubData(n.UNIFORM_BUFFER,B+q,I.__data)):U.isMatrix3?(I.__data[0]=U.elements[0],I.__data[1]=U.elements[1],I.__data[2]=U.elements[2],I.__data[3]=0,I.__data[4]=U.elements[3],I.__data[5]=U.elements[4],I.__data[6]=U.elements[5],I.__data[7]=0,I.__data[8]=U.elements[6],I.__data[9]=U.elements[7],I.__data[10]=U.elements[8],I.__data[11]=0):(U.toArray(I.__data,q),q+=$.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,B,I.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(x,y,b,S){const w=x.value,R=y+"_"+b;if(S[R]===void 0)return typeof w=="number"||typeof w=="boolean"?S[R]=w:S[R]=w.clone(),!0;{const P=S[R];if(typeof w=="number"||typeof w=="boolean"){if(P!==w)return S[R]=w,!0}else if(P.equals(w)===!1)return P.copy(w),!0}return!1}function g(x){const y=x.uniforms;let b=0;const S=16;for(let R=0,P=y.length;R<P;R++){const T=Array.isArray(y[R])?y[R]:[y[R]];for(let E=0,I=T.length;E<I;E++){const B=T[E],k=Array.isArray(B.value)?B.value:[B.value];for(let q=0,H=k.length;q<H;q++){const U=k[q],$=v(U),V=b%S,ae=V%$.boundary,ye=V+ae;b+=ae,ye!==0&&S-ye<$.storage&&(b+=S-ye),B.__data=new Float32Array($.storage/Float32Array.BYTES_PER_ELEMENT),B.__offset=b,b+=$.storage}}}const w=b%S;return w>0&&(b+=S-w),x.__size=b,x.__cache={},this}function v(x){const y={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(y.boundary=4,y.storage=4):x.isVector2?(y.boundary=8,y.storage=8):x.isVector3||x.isColor?(y.boundary=16,y.storage=12):x.isVector4?(y.boundary=16,y.storage=16):x.isMatrix3?(y.boundary=48,y.storage=48):x.isMatrix4?(y.boundary=64,y.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),y}function m(x){const y=x.target;y.removeEventListener("dispose",m);const b=o.indexOf(y.__bindingPointIndex);o.splice(b,1),n.deleteBuffer(r[y.id]),delete r[y.id],delete s[y.id]}function p(){for(const x in r)n.deleteBuffer(r[x]);o=[],r={},s={}}return{bind:l,update:c,dispose:p}}class N_{constructor(e={}){const{canvas:t=Nf(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let f;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=i.getContextAttributes().alpha}else f=o;const g=new Uint32Array(4),v=new Int32Array(4);let m=null,p=null;const x=[],y=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Ki,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const b=this;let S=!1;this._outputColorSpace=Mn;let w=0,R=0,P=null,T=-1,E=null;const I=new Yt,B=new Yt;let k=null;const q=new Et(0);let H=0,U=t.width,$=t.height,V=1,ae=null,ye=null;const Le=new Yt(0,0,U,$),Je=new Yt(0,0,U,$);let je=!1;const ht=new nc;let pt=!1,J=!1;const le=new Ht,_e=new D,He=new Yt,We={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let nt=!1;function wt(){return P===null?V:1}let F=i;function ue(A,G){return t.getContext(A,G)}try{const A={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${$l}`),t.addEventListener("webglcontextlost",we,!1),t.addEventListener("webglcontextrestored",Fe,!1),t.addEventListener("webglcontextcreationerror",ge,!1),F===null){const G="webgl2";if(F=ue(G,A),F===null)throw ue(G)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let oe,re,ie,Me,fe,be,it,rt,L,M,j,Q,he,ee,$e,de,Ge,Ne,pe,Ae,Qe,Oe,Re,tt;function z(){oe=new $g(F),oe.init(),Oe=new A_(F,oe),re=new kg(F,oe,e,Oe),ie=new T_(F,oe),re.reversedDepthBuffer&&d&&ie.buffers.depth.setReversed(!0),Me=new Yg(F),fe=new d_,be=new w_(F,oe,ie,fe,re,Oe,Me),it=new zg(b),rt=new Wg(b),L=new em(F),Re=new Og(F,L),M=new qg(F,L,Me,Re),j=new Zg(F,M,L,Me),pe=new jg(F,re,be),de=new Bg(fe),Q=new h_(b,it,rt,oe,re,Re,de),he=new I_(b,fe),ee=new p_,$e=new b_(oe),Ne=new Ng(b,it,rt,ie,j,f,l),Ge=new S_(b,j,re),tt=new U_(F,Me,re,ie),Ae=new Fg(F,oe,Me),Qe=new Xg(F,oe,Me),Me.programs=Q.programs,b.capabilities=re,b.extensions=oe,b.properties=fe,b.renderLists=ee,b.shadowMap=Ge,b.state=ie,b.info=Me}z();const me=new L_(b,F);this.xr=me,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){const A=oe.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=oe.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return V},this.setPixelRatio=function(A){A!==void 0&&(V=A,this.setSize(U,$,!1))},this.getSize=function(A){return A.set(U,$)},this.setSize=function(A,G,Z=!0){if(me.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}U=A,$=G,t.width=Math.floor(A*V),t.height=Math.floor(G*V),Z===!0&&(t.style.width=A+"px",t.style.height=G+"px"),this.setViewport(0,0,A,G)},this.getDrawingBufferSize=function(A){return A.set(U*V,$*V).floor()},this.setDrawingBufferSize=function(A,G,Z){U=A,$=G,V=Z,t.width=Math.floor(A*Z),t.height=Math.floor(G*Z),this.setViewport(0,0,A,G)},this.getCurrentViewport=function(A){return A.copy(I)},this.getViewport=function(A){return A.copy(Le)},this.setViewport=function(A,G,Z,K){A.isVector4?Le.set(A.x,A.y,A.z,A.w):Le.set(A,G,Z,K),ie.viewport(I.copy(Le).multiplyScalar(V).round())},this.getScissor=function(A){return A.copy(Je)},this.setScissor=function(A,G,Z,K){A.isVector4?Je.set(A.x,A.y,A.z,A.w):Je.set(A,G,Z,K),ie.scissor(B.copy(Je).multiplyScalar(V).round())},this.getScissorTest=function(){return je},this.setScissorTest=function(A){ie.setScissorTest(je=A)},this.setOpaqueSort=function(A){ae=A},this.setTransparentSort=function(A){ye=A},this.getClearColor=function(A){return A.copy(Ne.getClearColor())},this.setClearColor=function(){Ne.setClearColor(...arguments)},this.getClearAlpha=function(){return Ne.getClearAlpha()},this.setClearAlpha=function(){Ne.setClearAlpha(...arguments)},this.clear=function(A=!0,G=!0,Z=!0){let K=0;if(A){let W=!1;if(P!==null){const ve=P.texture.format;W=ve===Kl||ve===Zl||ve===jl}if(W){const ve=P.texture.type,Ce=ve===mi||ve===gr||ve===Ds||ve===Is||ve===Xl||ve===Yl,Be=Ne.getClearColor(),Ie=Ne.getClearAlpha(),et=Be.r,Ze=Be.g,Xe=Be.b;Ce?(g[0]=et,g[1]=Ze,g[2]=Xe,g[3]=Ie,F.clearBufferuiv(F.COLOR,0,g)):(v[0]=et,v[1]=Ze,v[2]=Xe,v[3]=Ie,F.clearBufferiv(F.COLOR,0,v))}else K|=F.COLOR_BUFFER_BIT}G&&(K|=F.DEPTH_BUFFER_BIT),Z&&(K|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),F.clear(K)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",we,!1),t.removeEventListener("webglcontextrestored",Fe,!1),t.removeEventListener("webglcontextcreationerror",ge,!1),Ne.dispose(),ee.dispose(),$e.dispose(),fe.dispose(),it.dispose(),rt.dispose(),j.dispose(),Re.dispose(),tt.dispose(),Q.dispose(),me.dispose(),me.removeEventListener("sessionstart",Vn),me.removeEventListener("sessionend",Ws),Hn.stop()};function we(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),S=!0}function Fe(){console.log("THREE.WebGLRenderer: Context Restored."),S=!1;const A=Me.autoReset,G=Ge.enabled,Z=Ge.autoUpdate,K=Ge.needsUpdate,W=Ge.type;z(),Me.autoReset=A,Ge.enabled=G,Ge.autoUpdate=Z,Ge.needsUpdate=K,Ge.type=W}function ge(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function ce(A){const G=A.target;G.removeEventListener("dispose",ce),Ue(G)}function Ue(A){at(A),fe.remove(A)}function at(A){const G=fe.get(A).programs;G!==void 0&&(G.forEach(function(Z){Q.releaseProgram(Z)}),A.isShaderMaterial&&Q.releaseShaderCache(A))}this.renderBufferDirect=function(A,G,Z,K,W,ve){G===null&&(G=We);const Ce=W.isMesh&&W.matrixWorld.determinant()<0,Be=Mr(A,G,Z,K,W);ie.setMaterial(K,Ce);let Ie=Z.index,et=1;if(K.wireframe===!0){if(Ie=M.getWireframeAttribute(Z),Ie===void 0)return;et=2}const Ze=Z.drawRange,Xe=Z.attributes.position;let _t=Ze.start*et,Rt=(Ze.start+Ze.count)*et;ve!==null&&(_t=Math.max(_t,ve.start*et),Rt=Math.min(Rt,(ve.start+ve.count)*et)),Ie!==null?(_t=Math.max(_t,0),Rt=Math.min(Rt,Ie.count)):Xe!=null&&(_t=Math.max(_t,0),Rt=Math.min(Rt,Xe.count));const Vt=Rt-_t;if(Vt<0||Vt===1/0)return;Re.setup(W,K,Be,Z,Ie);let kt,Ut=Ae;if(Ie!==null&&(kt=L.get(Ie),Ut=Qe,Ut.setIndex(kt)),W.isMesh)K.wireframe===!0?(ie.setLineWidth(K.wireframeLinewidth*wt()),Ut.setMode(F.LINES)):Ut.setMode(F.TRIANGLES);else if(W.isLine){let qe=K.linewidth;qe===void 0&&(qe=1),ie.setLineWidth(qe*wt()),W.isLineSegments?Ut.setMode(F.LINES):W.isLineLoop?Ut.setMode(F.LINE_LOOP):Ut.setMode(F.LINE_STRIP)}else W.isPoints?Ut.setMode(F.POINTS):W.isSprite&&Ut.setMode(F.TRIANGLES);if(W.isBatchedMesh)if(W._multiDrawInstances!==null)Fs("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Ut.renderMultiDrawInstances(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount,W._multiDrawInstances);else if(oe.get("WEBGL_multi_draw"))Ut.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else{const qe=W._multiDrawStarts,Gt=W._multiDrawCounts,xt=W._multiDrawCount,bt=Ie?L.get(Ie).bytesPerElement:1,xi=fe.get(K).currentProgram.getUniforms();for(let Zt=0;Zt<xt;Zt++)xi.setValue(F,"_gl_DrawID",Zt),Ut.render(qe[Zt]/bt,Gt[Zt])}else if(W.isInstancedMesh)Ut.renderInstances(_t,Vt,W.count);else if(Z.isInstancedBufferGeometry){const qe=Z._maxInstanceCount!==void 0?Z._maxInstanceCount:1/0,Gt=Math.min(Z.instanceCount,qe);Ut.renderInstances(_t,Vt,Gt)}else Ut.render(_t,Vt)};function Pt(A,G,Z){A.transparent===!0&&A.side===fi&&A.forceSinglePass===!1?(A.side=Fn,A.needsUpdate=!0,yr(A,G,Z),A.side=Qi,A.needsUpdate=!0,yr(A,G,Z),A.side=fi):yr(A,G,Z)}this.compile=function(A,G,Z=null){Z===null&&(Z=A),p=$e.get(Z),p.init(G),y.push(p),Z.traverseVisible(function(W){W.isLight&&W.layers.test(G.layers)&&(p.pushLight(W),W.castShadow&&p.pushShadow(W))}),A!==Z&&A.traverseVisible(function(W){W.isLight&&W.layers.test(G.layers)&&(p.pushLight(W),W.castShadow&&p.pushShadow(W))}),p.setupLights();const K=new Set;return A.traverse(function(W){if(!(W.isMesh||W.isPoints||W.isLine||W.isSprite))return;const ve=W.material;if(ve)if(Array.isArray(ve))for(let Ce=0;Ce<ve.length;Ce++){const Be=ve[Ce];Pt(Be,Z,W),K.add(Be)}else Pt(ve,Z,W),K.add(ve)}),p=y.pop(),K},this.compileAsync=function(A,G,Z=null){const K=this.compile(A,G,Z);return new Promise(W=>{function ve(){if(K.forEach(function(Ce){fe.get(Ce).currentProgram.isReady()&&K.delete(Ce)}),K.size===0){W(A);return}setTimeout(ve,10)}oe.get("KHR_parallel_shader_compile")!==null?ve():setTimeout(ve,10)})};let At=null;function Zn(A){At&&At(A)}function Vn(){Hn.stop()}function Ws(){Hn.start()}const Hn=new Kh;Hn.setAnimationLoop(Zn),typeof self<"u"&&Hn.setContext(self),this.setAnimationLoop=function(A){At=A,me.setAnimationLoop(A),A===null?Hn.stop():Hn.start()},me.addEventListener("sessionstart",Vn),me.addEventListener("sessionend",Ws),this.render=function(A,G){if(G!==void 0&&G.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(S===!0)return;if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),G.parent===null&&G.matrixWorldAutoUpdate===!0&&G.updateMatrixWorld(),me.enabled===!0&&me.isPresenting===!0&&(me.cameraAutoUpdate===!0&&me.updateCamera(G),G=me.getCamera()),A.isScene===!0&&A.onBeforeRender(b,A,G,P),p=$e.get(A,y.length),p.init(G),y.push(p),le.multiplyMatrices(G.projectionMatrix,G.matrixWorldInverse),ht.setFromProjectionMatrix(le,pi,G.reversedDepth),J=this.localClippingEnabled,pt=de.init(this.clippingPlanes,J),m=ee.get(A,x.length),m.init(),x.push(m),me.enabled===!0&&me.isPresenting===!0){const ve=b.xr.getDepthSensingMesh();ve!==null&&vi(ve,G,-1/0,b.sortObjects)}vi(A,G,0,b.sortObjects),m.finish(),b.sortObjects===!0&&m.sort(ae,ye),nt=me.enabled===!1||me.isPresenting===!1||me.hasDepthSensing()===!1,nt&&Ne.addToRenderList(m,A),this.info.render.frame++,pt===!0&&de.beginShadows();const Z=p.state.shadowsArray;Ge.render(Z,A,G),pt===!0&&de.endShadows(),this.info.autoReset===!0&&this.info.reset();const K=m.opaque,W=m.transmissive;if(p.setupLights(),G.isArrayCamera){const ve=G.cameras;if(W.length>0)for(let Ce=0,Be=ve.length;Ce<Be;Ce++){const Ie=ve[Ce];_i(K,W,A,Ie)}nt&&Ne.render(A);for(let Ce=0,Be=ve.length;Ce<Be;Ce++){const Ie=ve[Ce];$s(m,A,Ie,Ie.viewport)}}else W.length>0&&_i(K,W,A,G),nt&&Ne.render(A),$s(m,A,G);P!==null&&R===0&&(be.updateMultisampleRenderTarget(P),be.updateRenderTargetMipmap(P)),A.isScene===!0&&A.onAfterRender(b,A,G),Re.resetDefaultState(),T=-1,E=null,y.pop(),y.length>0?(p=y[y.length-1],pt===!0&&de.setGlobalState(b.clippingPlanes,p.state.camera)):p=null,x.pop(),x.length>0?m=x[x.length-1]:m=null};function vi(A,G,Z,K){if(A.visible===!1)return;if(A.layers.test(G.layers)){if(A.isGroup)Z=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(G);else if(A.isLight)p.pushLight(A),A.castShadow&&p.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||ht.intersectsSprite(A)){K&&He.setFromMatrixPosition(A.matrixWorld).applyMatrix4(le);const Ce=j.update(A),Be=A.material;Be.visible&&m.push(A,Ce,Be,Z,He.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||ht.intersectsObject(A))){const Ce=j.update(A),Be=A.material;if(K&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),He.copy(A.boundingSphere.center)):(Ce.boundingSphere===null&&Ce.computeBoundingSphere(),He.copy(Ce.boundingSphere.center)),He.applyMatrix4(A.matrixWorld).applyMatrix4(le)),Array.isArray(Be)){const Ie=Ce.groups;for(let et=0,Ze=Ie.length;et<Ze;et++){const Xe=Ie[et],_t=Be[Xe.materialIndex];_t&&_t.visible&&m.push(A,Ce,_t,Z,He.z,Xe)}}else Be.visible&&m.push(A,Ce,Be,Z,He.z,null)}}const ve=A.children;for(let Ce=0,Be=ve.length;Ce<Be;Ce++)vi(ve[Ce],G,Z,K)}function $s(A,G,Z,K){const W=A.opaque,ve=A.transmissive,Ce=A.transparent;p.setupLightsView(Z),pt===!0&&de.setGlobalState(b.clippingPlanes,Z),K&&ie.viewport(I.copy(K)),W.length>0&&jt(W,G,Z),ve.length>0&&jt(ve,G,Z),Ce.length>0&&jt(Ce,G,Z),ie.buffers.depth.setTest(!0),ie.buffers.depth.setMask(!0),ie.buffers.color.setMask(!0),ie.setPolygonOffset(!1)}function _i(A,G,Z,K){if((Z.isScene===!0?Z.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[K.id]===void 0&&(p.state.transmissionRenderTarget[K.id]=new vr(1,1,{generateMipmaps:!0,type:oe.has("EXT_color_buffer_half_float")||oe.has("EXT_color_buffer_float")?Hs:mi,minFilter:Yi,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Lt.workingColorSpace}));const ve=p.state.transmissionRenderTarget[K.id],Ce=K.viewport||I;ve.setSize(Ce.z*b.transmissionResolutionScale,Ce.w*b.transmissionResolutionScale);const Be=b.getRenderTarget(),Ie=b.getActiveCubeFace(),et=b.getActiveMipmapLevel();b.setRenderTarget(ve),b.getClearColor(q),H=b.getClearAlpha(),H<1&&b.setClearColor(16777215,.5),b.clear(),nt&&Ne.render(Z);const Ze=b.toneMapping;b.toneMapping=Ki;const Xe=K.viewport;if(K.viewport!==void 0&&(K.viewport=void 0),p.setupLightsView(K),pt===!0&&de.setGlobalState(b.clippingPlanes,K),jt(A,Z,K),be.updateMultisampleRenderTarget(ve),be.updateRenderTargetMipmap(ve),oe.has("WEBGL_multisampled_render_to_texture")===!1){let _t=!1;for(let Rt=0,Vt=G.length;Rt<Vt;Rt++){const kt=G[Rt],Ut=kt.object,qe=kt.geometry,Gt=kt.material,xt=kt.group;if(Gt.side===fi&&Ut.layers.test(K.layers)){const bt=Gt.side;Gt.side=Fn,Gt.needsUpdate=!0,Un(Ut,Z,K,qe,Gt,xt),Gt.side=bt,Gt.needsUpdate=!0,_t=!0}}_t===!0&&(be.updateMultisampleRenderTarget(ve),be.updateRenderTargetMipmap(ve))}b.setRenderTarget(Be,Ie,et),b.setClearColor(q,H),Xe!==void 0&&(K.viewport=Xe),b.toneMapping=Ze}function jt(A,G,Z){const K=G.isScene===!0?G.overrideMaterial:null;for(let W=0,ve=A.length;W<ve;W++){const Ce=A[W],Be=Ce.object,Ie=Ce.geometry,et=Ce.group;let Ze=Ce.material;Ze.allowOverride===!0&&K!==null&&(Ze=K),Be.layers.test(Z.layers)&&Un(Be,G,Z,Ie,Ze,et)}}function Un(A,G,Z,K,W,ve){A.onBeforeRender(b,G,Z,K,W,ve),A.modelViewMatrix.multiplyMatrices(Z.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),W.onBeforeRender(b,G,Z,K,A,ve),W.transparent===!0&&W.side===fi&&W.forceSinglePass===!1?(W.side=Fn,W.needsUpdate=!0,b.renderBufferDirect(Z,G,K,W,A,ve),W.side=Qi,W.needsUpdate=!0,b.renderBufferDirect(Z,G,K,W,A,ve),W.side=fi):b.renderBufferDirect(Z,G,K,W,A,ve),A.onAfterRender(b,G,Z,K,W,ve)}function yr(A,G,Z){G.isScene!==!0&&(G=We);const K=fe.get(A),W=p.state.lights,ve=p.state.shadowsArray,Ce=W.state.version,Be=Q.getParameters(A,W.state,ve,G,Z),Ie=Q.getProgramCacheKey(Be);let et=K.programs;K.environment=A.isMeshStandardMaterial?G.environment:null,K.fog=G.fog,K.envMap=(A.isMeshStandardMaterial?rt:it).get(A.envMap||K.environment),K.envMapRotation=K.environment!==null&&A.envMap===null?G.environmentRotation:A.envMapRotation,et===void 0&&(A.addEventListener("dispose",ce),et=new Map,K.programs=et);let Ze=et.get(Ie);if(Ze!==void 0){if(K.currentProgram===Ze&&K.lightsStateVersion===Ce)return hs(A,Be),Ze}else Be.uniforms=Q.getUniforms(A),A.onBeforeCompile(Be,b),Ze=Q.acquireProgram(Be,Ie),et.set(Ie,Ze),K.uniforms=Be.uniforms;const Xe=K.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Xe.clippingPlanes=de.uniform),hs(A,Be),K.needsLights=tr(A),K.lightsStateVersion=Ce,K.needsLights&&(Xe.ambientLightColor.value=W.state.ambient,Xe.lightProbe.value=W.state.probe,Xe.directionalLights.value=W.state.directional,Xe.directionalLightShadows.value=W.state.directionalShadow,Xe.spotLights.value=W.state.spot,Xe.spotLightShadows.value=W.state.spotShadow,Xe.rectAreaLights.value=W.state.rectArea,Xe.ltc_1.value=W.state.rectAreaLTC1,Xe.ltc_2.value=W.state.rectAreaLTC2,Xe.pointLights.value=W.state.point,Xe.pointLightShadows.value=W.state.pointShadow,Xe.hemisphereLights.value=W.state.hemi,Xe.directionalShadowMap.value=W.state.directionalShadowMap,Xe.directionalShadowMatrix.value=W.state.directionalShadowMatrix,Xe.spotShadowMap.value=W.state.spotShadowMap,Xe.spotLightMatrix.value=W.state.spotLightMatrix,Xe.spotLightMap.value=W.state.spotLightMap,Xe.pointShadowMap.value=W.state.pointShadowMap,Xe.pointShadowMatrix.value=W.state.pointShadowMatrix),K.currentProgram=Ze,K.uniformsList=null,Ze}function qs(A){if(A.uniformsList===null){const G=A.currentProgram.getUniforms();A.uniformsList=Lo.seqWithValue(G.seq,A.uniforms)}return A.uniformsList}function hs(A,G){const Z=fe.get(A);Z.outputColorSpace=G.outputColorSpace,Z.batching=G.batching,Z.batchingColor=G.batchingColor,Z.instancing=G.instancing,Z.instancingColor=G.instancingColor,Z.instancingMorph=G.instancingMorph,Z.skinning=G.skinning,Z.morphTargets=G.morphTargets,Z.morphNormals=G.morphNormals,Z.morphColors=G.morphColors,Z.morphTargetsCount=G.morphTargetsCount,Z.numClippingPlanes=G.numClippingPlanes,Z.numIntersection=G.numClipIntersection,Z.vertexAlphas=G.vertexAlphas,Z.vertexTangents=G.vertexTangents,Z.toneMapping=G.toneMapping}function Mr(A,G,Z,K,W){G.isScene!==!0&&(G=We),be.resetTextureUnits();const ve=G.fog,Ce=K.isMeshStandardMaterial?G.environment:null,Be=P===null?b.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:rs,Ie=(K.isMeshStandardMaterial?rt:it).get(K.envMap||Ce),et=K.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,Ze=!!Z.attributes.tangent&&(!!K.normalMap||K.anisotropy>0),Xe=!!Z.morphAttributes.position,_t=!!Z.morphAttributes.normal,Rt=!!Z.morphAttributes.color;let Vt=Ki;K.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(Vt=b.toneMapping);const kt=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,Ut=kt!==void 0?kt.length:0,qe=fe.get(K),Gt=p.state.lights;if(pt===!0&&(J===!0||A!==E)){const pn=A===E&&K.id===T;de.setState(K,A,pn)}let xt=!1;K.version===qe.__version?(qe.needsLights&&qe.lightsStateVersion!==Gt.state.version||qe.outputColorSpace!==Be||W.isBatchedMesh&&qe.batching===!1||!W.isBatchedMesh&&qe.batching===!0||W.isBatchedMesh&&qe.batchingColor===!0&&W.colorTexture===null||W.isBatchedMesh&&qe.batchingColor===!1&&W.colorTexture!==null||W.isInstancedMesh&&qe.instancing===!1||!W.isInstancedMesh&&qe.instancing===!0||W.isSkinnedMesh&&qe.skinning===!1||!W.isSkinnedMesh&&qe.skinning===!0||W.isInstancedMesh&&qe.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&qe.instancingColor===!1&&W.instanceColor!==null||W.isInstancedMesh&&qe.instancingMorph===!0&&W.morphTexture===null||W.isInstancedMesh&&qe.instancingMorph===!1&&W.morphTexture!==null||qe.envMap!==Ie||K.fog===!0&&qe.fog!==ve||qe.numClippingPlanes!==void 0&&(qe.numClippingPlanes!==de.numPlanes||qe.numIntersection!==de.numIntersection)||qe.vertexAlphas!==et||qe.vertexTangents!==Ze||qe.morphTargets!==Xe||qe.morphNormals!==_t||qe.morphColors!==Rt||qe.toneMapping!==Vt||qe.morphTargetsCount!==Ut)&&(xt=!0):(xt=!0,qe.__version=K.version);let bt=qe.currentProgram;xt===!0&&(bt=yr(K,G,W));let xi=!1,Zt=!1,Oi=!1;const mt=bt.getUniforms(),wn=qe.uniforms;if(ie.useProgram(bt.program)&&(xi=!0,Zt=!0,Oi=!0),K.id!==T&&(T=K.id,Zt=!0),xi||E!==A){ie.buffers.depth.getReversed()&&A.reversedDepth!==!0&&(A._reversedDepth=!0,A.updateProjectionMatrix()),mt.setValue(F,"projectionMatrix",A.projectionMatrix),mt.setValue(F,"viewMatrix",A.matrixWorldInverse);const on=mt.map.cameraPosition;on!==void 0&&on.setValue(F,_e.setFromMatrixPosition(A.matrixWorld)),re.logarithmicDepthBuffer&&mt.setValue(F,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(K.isMeshPhongMaterial||K.isMeshToonMaterial||K.isMeshLambertMaterial||K.isMeshBasicMaterial||K.isMeshStandardMaterial||K.isShaderMaterial)&&mt.setValue(F,"isOrthographic",A.isOrthographicCamera===!0),E!==A&&(E=A,Zt=!0,Oi=!0)}if(W.isSkinnedMesh){mt.setOptional(F,W,"bindMatrix"),mt.setOptional(F,W,"bindMatrixInverse");const pn=W.skeleton;pn&&(pn.boneTexture===null&&pn.computeBoneTexture(),mt.setValue(F,"boneTexture",pn.boneTexture,be))}W.isBatchedMesh&&(mt.setOptional(F,W,"batchingTexture"),mt.setValue(F,"batchingTexture",W._matricesTexture,be),mt.setOptional(F,W,"batchingIdTexture"),mt.setValue(F,"batchingIdTexture",W._indirectTexture,be),mt.setOptional(F,W,"batchingColorTexture"),W._colorsTexture!==null&&mt.setValue(F,"batchingColorTexture",W._colorsTexture,be));const vn=Z.morphAttributes;if((vn.position!==void 0||vn.normal!==void 0||vn.color!==void 0)&&pe.update(W,Z,bt),(Zt||qe.receiveShadow!==W.receiveShadow)&&(qe.receiveShadow=W.receiveShadow,mt.setValue(F,"receiveShadow",W.receiveShadow)),K.isMeshGouraudMaterial&&K.envMap!==null&&(wn.envMap.value=Ie,wn.flipEnvMap.value=Ie.isCubeTexture&&Ie.isRenderTargetTexture===!1?-1:1),K.isMeshStandardMaterial&&K.envMap===null&&G.environment!==null&&(wn.envMapIntensity.value=G.environmentIntensity),Zt&&(mt.setValue(F,"toneMappingExposure",b.toneMappingExposure),qe.needsLights&&Sr(wn,Oi),ve&&K.fog===!0&&he.refreshFogUniforms(wn,ve),he.refreshMaterialUniforms(wn,K,V,$,p.state.transmissionRenderTarget[A.id]),Lo.upload(F,qs(qe),wn,be)),K.isShaderMaterial&&K.uniformsNeedUpdate===!0&&(Lo.upload(F,qs(qe),wn,be),K.uniformsNeedUpdate=!1),K.isSpriteMaterial&&mt.setValue(F,"center",W.center),mt.setValue(F,"modelViewMatrix",W.modelViewMatrix),mt.setValue(F,"normalMatrix",W.normalMatrix),mt.setValue(F,"modelMatrix",W.matrixWorld),K.isShaderMaterial||K.isRawShaderMaterial){const pn=K.uniformsGroups;for(let on=0,Kn=pn.length;on<Kn;on++){const Jn=pn[on];tt.update(Jn,bt),tt.bind(Jn,bt)}}return bt}function Sr(A,G){A.ambientLightColor.needsUpdate=G,A.lightProbe.needsUpdate=G,A.directionalLights.needsUpdate=G,A.directionalLightShadows.needsUpdate=G,A.pointLights.needsUpdate=G,A.pointLightShadows.needsUpdate=G,A.spotLights.needsUpdate=G,A.spotLightShadows.needsUpdate=G,A.rectAreaLights.needsUpdate=G,A.hemisphereLights.needsUpdate=G}function tr(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(A,G,Z){const K=fe.get(A);K.__autoAllocateDepthBuffer=A.resolveDepthBuffer===!1,K.__autoAllocateDepthBuffer===!1&&(K.__useRenderToTexture=!1),fe.get(A.texture).__webglTexture=G,fe.get(A.depthTexture).__webglTexture=K.__autoAllocateDepthBuffer?void 0:Z,K.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(A,G){const Z=fe.get(A);Z.__webglFramebuffer=G,Z.__useDefaultFramebuffer=G===void 0};const ds=F.createFramebuffer();this.setRenderTarget=function(A,G=0,Z=0){P=A,w=G,R=Z;let K=!0,W=null,ve=!1,Ce=!1;if(A){const Ie=fe.get(A);if(Ie.__useDefaultFramebuffer!==void 0)ie.bindFramebuffer(F.FRAMEBUFFER,null),K=!1;else if(Ie.__webglFramebuffer===void 0)be.setupRenderTarget(A);else if(Ie.__hasExternalTextures)be.rebindTextures(A,fe.get(A.texture).__webglTexture,fe.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){const Xe=A.depthTexture;if(Ie.__boundDepthTexture!==Xe){if(Xe!==null&&fe.has(Xe)&&(A.width!==Xe.image.width||A.height!==Xe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");be.setupDepthRenderbuffer(A)}}const et=A.texture;(et.isData3DTexture||et.isDataArrayTexture||et.isCompressedArrayTexture)&&(Ce=!0);const Ze=fe.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(Ze[G])?W=Ze[G][Z]:W=Ze[G],ve=!0):A.samples>0&&be.useMultisampledRTT(A)===!1?W=fe.get(A).__webglMultisampledFramebuffer:Array.isArray(Ze)?W=Ze[Z]:W=Ze,I.copy(A.viewport),B.copy(A.scissor),k=A.scissorTest}else I.copy(Le).multiplyScalar(V).floor(),B.copy(Je).multiplyScalar(V).floor(),k=je;if(Z!==0&&(W=ds),ie.bindFramebuffer(F.FRAMEBUFFER,W)&&K&&ie.drawBuffers(A,W),ie.viewport(I),ie.scissor(B),ie.setScissorTest(k),ve){const Ie=fe.get(A.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+G,Ie.__webglTexture,Z)}else if(Ce){const Ie=G;for(let et=0;et<A.textures.length;et++){const Ze=fe.get(A.textures[et]);F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0+et,Ze.__webglTexture,Z,Ie)}}else if(A!==null&&Z!==0){const Ie=fe.get(A.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,Ie.__webglTexture,Z)}T=-1},this.readRenderTargetPixels=function(A,G,Z,K,W,ve,Ce,Be=0){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ie=fe.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Ce!==void 0&&(Ie=Ie[Ce]),Ie){ie.bindFramebuffer(F.FRAMEBUFFER,Ie);try{const et=A.textures[Be],Ze=et.format,Xe=et.type;if(!re.textureFormatReadable(Ze)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!re.textureTypeReadable(Xe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}G>=0&&G<=A.width-K&&Z>=0&&Z<=A.height-W&&(A.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+Be),F.readPixels(G,Z,K,W,Oe.convert(Ze),Oe.convert(Xe),ve))}finally{const et=P!==null?fe.get(P).__webglFramebuffer:null;ie.bindFramebuffer(F.FRAMEBUFFER,et)}}},this.readRenderTargetPixelsAsync=async function(A,G,Z,K,W,ve,Ce,Be=0){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ie=fe.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Ce!==void 0&&(Ie=Ie[Ce]),Ie)if(G>=0&&G<=A.width-K&&Z>=0&&Z<=A.height-W){ie.bindFramebuffer(F.FRAMEBUFFER,Ie);const et=A.textures[Be],Ze=et.format,Xe=et.type;if(!re.textureFormatReadable(Ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!re.textureTypeReadable(Xe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const _t=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,_t),F.bufferData(F.PIXEL_PACK_BUFFER,ve.byteLength,F.STREAM_READ),A.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+Be),F.readPixels(G,Z,K,W,Oe.convert(Ze),Oe.convert(Xe),0);const Rt=P!==null?fe.get(P).__webglFramebuffer:null;ie.bindFramebuffer(F.FRAMEBUFFER,Rt);const Vt=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await Of(F,Vt,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,_t),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,ve),F.deleteBuffer(_t),F.deleteSync(Vt),ve}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(A,G=null,Z=0){const K=Math.pow(2,-Z),W=Math.floor(A.image.width*K),ve=Math.floor(A.image.height*K),Ce=G!==null?G.x:0,Be=G!==null?G.y:0;be.setTexture2D(A,0),F.copyTexSubImage2D(F.TEXTURE_2D,Z,0,0,Ce,Be,W,ve),ie.unbindTexture()};const Zo=F.createFramebuffer(),Xs=F.createFramebuffer();this.copyTextureToTexture=function(A,G,Z=null,K=null,W=0,ve=null){ve===null&&(W!==0?(Fs("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ve=W,W=0):ve=0);let Ce,Be,Ie,et,Ze,Xe,_t,Rt,Vt;const kt=A.isCompressedTexture?A.mipmaps[ve]:A.image;if(Z!==null)Ce=Z.max.x-Z.min.x,Be=Z.max.y-Z.min.y,Ie=Z.isBox3?Z.max.z-Z.min.z:1,et=Z.min.x,Ze=Z.min.y,Xe=Z.isBox3?Z.min.z:0;else{const vn=Math.pow(2,-W);Ce=Math.floor(kt.width*vn),Be=Math.floor(kt.height*vn),A.isDataArrayTexture?Ie=kt.depth:A.isData3DTexture?Ie=Math.floor(kt.depth*vn):Ie=1,et=0,Ze=0,Xe=0}K!==null?(_t=K.x,Rt=K.y,Vt=K.z):(_t=0,Rt=0,Vt=0);const Ut=Oe.convert(G.format),qe=Oe.convert(G.type);let Gt;G.isData3DTexture?(be.setTexture3D(G,0),Gt=F.TEXTURE_3D):G.isDataArrayTexture||G.isCompressedArrayTexture?(be.setTexture2DArray(G,0),Gt=F.TEXTURE_2D_ARRAY):(be.setTexture2D(G,0),Gt=F.TEXTURE_2D),F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,G.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,G.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,G.unpackAlignment);const xt=F.getParameter(F.UNPACK_ROW_LENGTH),bt=F.getParameter(F.UNPACK_IMAGE_HEIGHT),xi=F.getParameter(F.UNPACK_SKIP_PIXELS),Zt=F.getParameter(F.UNPACK_SKIP_ROWS),Oi=F.getParameter(F.UNPACK_SKIP_IMAGES);F.pixelStorei(F.UNPACK_ROW_LENGTH,kt.width),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,kt.height),F.pixelStorei(F.UNPACK_SKIP_PIXELS,et),F.pixelStorei(F.UNPACK_SKIP_ROWS,Ze),F.pixelStorei(F.UNPACK_SKIP_IMAGES,Xe);const mt=A.isDataArrayTexture||A.isData3DTexture,wn=G.isDataArrayTexture||G.isData3DTexture;if(A.isDepthTexture){const vn=fe.get(A),pn=fe.get(G),on=fe.get(vn.__renderTarget),Kn=fe.get(pn.__renderTarget);ie.bindFramebuffer(F.READ_FRAMEBUFFER,on.__webglFramebuffer),ie.bindFramebuffer(F.DRAW_FRAMEBUFFER,Kn.__webglFramebuffer);for(let Jn=0;Jn<Ie;Jn++)mt&&(F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,fe.get(A).__webglTexture,W,Xe+Jn),F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,fe.get(G).__webglTexture,ve,Vt+Jn)),F.blitFramebuffer(et,Ze,Ce,Be,_t,Rt,Ce,Be,F.DEPTH_BUFFER_BIT,F.NEAREST);ie.bindFramebuffer(F.READ_FRAMEBUFFER,null),ie.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else if(W!==0||A.isRenderTargetTexture||fe.has(A)){const vn=fe.get(A),pn=fe.get(G);ie.bindFramebuffer(F.READ_FRAMEBUFFER,Zo),ie.bindFramebuffer(F.DRAW_FRAMEBUFFER,Xs);for(let on=0;on<Ie;on++)mt?F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,vn.__webglTexture,W,Xe+on):F.framebufferTexture2D(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,vn.__webglTexture,W),wn?F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,pn.__webglTexture,ve,Vt+on):F.framebufferTexture2D(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,pn.__webglTexture,ve),W!==0?F.blitFramebuffer(et,Ze,Ce,Be,_t,Rt,Ce,Be,F.COLOR_BUFFER_BIT,F.NEAREST):wn?F.copyTexSubImage3D(Gt,ve,_t,Rt,Vt+on,et,Ze,Ce,Be):F.copyTexSubImage2D(Gt,ve,_t,Rt,et,Ze,Ce,Be);ie.bindFramebuffer(F.READ_FRAMEBUFFER,null),ie.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else wn?A.isDataTexture||A.isData3DTexture?F.texSubImage3D(Gt,ve,_t,Rt,Vt,Ce,Be,Ie,Ut,qe,kt.data):G.isCompressedArrayTexture?F.compressedTexSubImage3D(Gt,ve,_t,Rt,Vt,Ce,Be,Ie,Ut,kt.data):F.texSubImage3D(Gt,ve,_t,Rt,Vt,Ce,Be,Ie,Ut,qe,kt):A.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,ve,_t,Rt,Ce,Be,Ut,qe,kt.data):A.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,ve,_t,Rt,kt.width,kt.height,Ut,kt.data):F.texSubImage2D(F.TEXTURE_2D,ve,_t,Rt,Ce,Be,Ut,qe,kt);F.pixelStorei(F.UNPACK_ROW_LENGTH,xt),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,bt),F.pixelStorei(F.UNPACK_SKIP_PIXELS,xi),F.pixelStorei(F.UNPACK_SKIP_ROWS,Zt),F.pixelStorei(F.UNPACK_SKIP_IMAGES,Oi),ve===0&&G.generateMipmaps&&F.generateMipmap(Gt),ie.unbindTexture()},this.initRenderTarget=function(A){fe.get(A).__webglFramebuffer===void 0&&be.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?be.setTextureCube(A,0):A.isData3DTexture?be.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?be.setTexture2DArray(A,0):be.setTexture2D(A,0),ie.unbindTexture()},this.resetState=function(){w=0,R=0,P=null,ie.reset(),Re.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return pi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Lt._getDrawingBufferColorSpace(e),t.unpackColorSpace=Lt._getUnpackColorSpace()}}const Yu={type:"change"},fc={type:"start"},nd={type:"end"},wo=new $o,ju=new Ri,O_=Math.cos(70*_n.DEG2RAD),an=new D,Nn=2*Math.PI,Ft={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Ga=1e-6;class F_ extends Jp{constructor(e,t=null){super(e,t),this.state=Ft.NONE,this.target=new D,this.cursor=new D,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Xr.ROTATE,MIDDLE:Xr.DOLLY,RIGHT:Xr.PAN},this.touches={ONE:Wr.ROTATE,TWO:Wr.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new D,this._lastQuaternion=new On,this._lastTargetPosition=new D,this._quat=new On().setFromUnitVectors(e.up,new D(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Mu,this._sphericalDelta=new Mu,this._scale=1,this._panOffset=new D,this._rotateStart=new xe,this._rotateEnd=new xe,this._rotateDelta=new xe,this._panStart=new xe,this._panEnd=new xe,this._panDelta=new xe,this._dollyStart=new xe,this._dollyEnd=new xe,this._dollyDelta=new xe,this._dollyDirection=new D,this._mouse=new xe,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=B_.bind(this),this._onPointerDown=k_.bind(this),this._onPointerUp=z_.bind(this),this._onContextMenu=X_.bind(this),this._onMouseWheel=G_.bind(this),this._onKeyDown=W_.bind(this),this._onTouchStart=$_.bind(this),this._onTouchMove=q_.bind(this),this._onMouseDown=V_.bind(this),this._onMouseMove=H_.bind(this),this._interceptControlDown=Y_.bind(this),this._interceptControlUp=j_.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Yu),this.update(),this.state=Ft.NONE}update(e=null){const t=this.object.position;an.copy(t).sub(this.target),an.applyQuaternion(this._quat),this._spherical.setFromVector3(an),this.autoRotate&&this.state===Ft.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,r=this.maxAzimuthAngle;isFinite(i)&&isFinite(r)&&(i<-Math.PI?i+=Nn:i>Math.PI&&(i-=Nn),r<-Math.PI?r+=Nn:r>Math.PI&&(r-=Nn),i<=r?this._spherical.theta=Math.max(i,Math.min(r,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+r)/2?Math.max(i,this._spherical.theta):Math.min(r,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let s=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),s=o!=this._spherical.radius}if(an.setFromSpherical(this._spherical),an.applyQuaternion(this._quatInverse),t.copy(this.target).add(an),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){const a=an.length();o=this._clampDistance(a*this._scale);const l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),s=!!l}else if(this.object.isOrthographicCamera){const a=new D(this._mouse.x,this._mouse.y,0);a.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),s=l!==this.object.zoom;const c=new D(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=an.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(wo.origin.copy(this.object.position),wo.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(wo.direction))<O_?this.object.lookAt(this.target):(ju.setFromNormalAndCoplanarPoint(this.object.up,this.target),wo.intersectPlane(ju,this.target))))}else if(this.object.isOrthographicCamera){const o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),s=!0)}return this._scale=1,this._performCursorZoom=!1,s||this._lastPosition.distanceToSquared(this.object.position)>Ga||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Ga||this._lastTargetPosition.distanceToSquared(this.target)>Ga?(this.dispatchEvent(Yu),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Nn/60*this.autoRotateSpeed*e:Nn/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){an.setFromMatrixColumn(t,0),an.multiplyScalar(-e),this._panOffset.add(an)}_panUp(e,t){this.screenSpacePanning===!0?an.setFromMatrixColumn(t,1):(an.setFromMatrixColumn(t,0),an.crossVectors(this.object.up,an)),an.multiplyScalar(e),this._panOffset.add(an)}_pan(e,t){const i=this.domElement;if(this.object.isPerspectiveCamera){const r=this.object.position;an.copy(r).sub(this.target);let s=an.length();s*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*s/i.clientHeight,this.object.matrix),this._panUp(2*t*s/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),r=e-i.left,s=t-i.top,o=i.width,a=i.height;this._mouse.x=r/o*2-1,this._mouse.y=-(s/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Nn*this._rotateDelta.x/t.clientHeight),this._rotateUp(Nn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(Nn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-Nn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(Nn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-Nn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._rotateStart.set(i,r)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panStart.set(i,r)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,r=e.pageY-t.y,s=Math.sqrt(i*i+r*r);this._dollyStart.set(0,s)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),r=.5*(e.pageX+i.x),s=.5*(e.pageY+i.y);this._rotateEnd.set(r,s)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Nn*this._rotateDelta.x/t.clientHeight),this._rotateUp(Nn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panEnd.set(i,r)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,r=e.pageY-t.y,s=Math.sqrt(i*i+r*r);this._dollyEnd.set(0,s),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const o=(e.pageX+t.x)*.5,a=(e.pageY+t.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new xe,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function k_(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n)))}function B_(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function z_(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(nd),this.state=Ft.NONE;break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function V_(n){let e;switch(n.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Xr.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=Ft.DOLLY;break;case Xr.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=Ft.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=Ft.ROTATE}break;case Xr.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=Ft.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=Ft.PAN}break;default:this.state=Ft.NONE}this.state!==Ft.NONE&&this.dispatchEvent(fc)}function H_(n){switch(this.state){case Ft.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case Ft.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case Ft.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function G_(n){this.enabled===!1||this.enableZoom===!1||this.state!==Ft.NONE||(n.preventDefault(),this.dispatchEvent(fc),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(nd))}function W_(n){this.enabled!==!1&&this._handleKeyDown(n)}function $_(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case Wr.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=Ft.TOUCH_ROTATE;break;case Wr.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=Ft.TOUCH_PAN;break;default:this.state=Ft.NONE}break;case 2:switch(this.touches.TWO){case Wr.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=Ft.TOUCH_DOLLY_PAN;break;case Wr.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=Ft.TOUCH_DOLLY_ROTATE;break;default:this.state=Ft.NONE}break;default:this.state=Ft.NONE}this.state!==Ft.NONE&&this.dispatchEvent(fc)}function q_(n){switch(this._trackPointer(n),this.state){case Ft.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case Ft.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case Ft.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case Ft.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=Ft.NONE}}function X_(n){this.enabled!==!1&&n.preventDefault()}function Y_(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function j_(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const bs=new D;function $n(n,e,t,i,r,s){const o=2*Math.PI*r/4,a=Math.max(s-2*r,0),l=Math.PI/4;bs.copy(e),bs[i]=0,bs.normalize();const c=.5*o/(o+a),u=1-bs.angleTo(n)/l;return Math.sign(bs[t])===1?u*c:a/(o+a)+c+c*(1-u)}class Yo extends cn{constructor(e=1,t=1,i=1,r=2,s=.1){const o=r*2+1;if(s=Math.min(e/2,t/2,i/2,s),super(1,1,1,o,o,o),this.type="RoundedBoxGeometry",this.parameters={width:e,height:t,depth:i,segments:r,radius:s},o===1)return;const a=this.toNonIndexed();this.index=null,this.attributes.position=a.attributes.position,this.attributes.normal=a.attributes.normal,this.attributes.uv=a.attributes.uv;const l=new D,c=new D,u=new D(e,t,i).divideScalar(2).subScalar(s),h=this.attributes.position.array,d=this.attributes.normal.array,f=this.attributes.uv.array,g=h.length/6,v=new D,m=.5/o;for(let p=0,x=0;p<h.length;p+=3,x+=2)switch(l.fromArray(h,p),c.copy(l),c.x-=Math.sign(c.x)*m,c.y-=Math.sign(c.y)*m,c.z-=Math.sign(c.z)*m,c.normalize(),h[p+0]=u.x*Math.sign(l.x)+c.x*s,h[p+1]=u.y*Math.sign(l.y)+c.y*s,h[p+2]=u.z*Math.sign(l.z)+c.z*s,d[p+0]=c.x,d[p+1]=c.y,d[p+2]=c.z,Math.floor(p/g)){case 0:v.set(1,0,0),f[x+0]=$n(v,c,"z","y",s,i),f[x+1]=1-$n(v,c,"y","z",s,t);break;case 1:v.set(-1,0,0),f[x+0]=1-$n(v,c,"z","y",s,i),f[x+1]=1-$n(v,c,"y","z",s,t);break;case 2:v.set(0,1,0),f[x+0]=1-$n(v,c,"x","z",s,e),f[x+1]=$n(v,c,"z","x",s,i);break;case 3:v.set(0,-1,0),f[x+0]=1-$n(v,c,"x","z",s,e),f[x+1]=1-$n(v,c,"z","x",s,i);break;case 4:v.set(0,0,1),f[x+0]=1-$n(v,c,"x","y",s,e),f[x+1]=1-$n(v,c,"y","x",s,t);break;case 5:v.set(0,0,-1),f[x+0]=$n(v,c,"x","y",s,e),f[x+1]=1-$n(v,c,"y","x",s,t);break}}static fromJSON(e){return new Yo(e.width,e.height,e.depth,e.segments,e.radius)}}const Zu=Math.PI*2;function Z_(n,e){const t=e.clone().normalize();let i=2*Math.atan2(n.x*t.x+n.y*t.y+n.z*t.z,n.w);for(;i>Math.PI;)i-=Zu;for(;i<-Math.PI;)i+=Zu;return i}function kl(n,e,t=.055){if(!n)return null;let i=null,r=t;for(const s of e){const o=n.distanceTo(s.position);o<=r&&(i=s,r=o)}return i}function K_({getModel:n=()=>({}),getTerminals:e=()=>[],onProbe:t=()=>{},onConnect:i=()=>{},onDisconnect:r=()=>{},onChange:s=()=>{},onAction:o=()=>{},onGraphCursor:a=()=>{},onHold:l=()=>{},snapRadius:c=.055}={}){const u=new Map,h=new Set,d=new Map;function f(p,x,y={}){var R,P,T,E;if(!x||h.has(p)||u.has(p))return!1;const b=x.resource||`${x.kind}:${x.channel||x.id}`;if(d.has(b))return!1;const S=n(),w={input:p,target:x,resource:b,position:(R=y.position)==null?void 0:R.clone(),startPosition:(P=y.position)==null?void 0:P.clone(),turn:0,lastValue:void 0};if(x.kind==="dial"){if(w.startValue=(T=S.parameters)==null?void 0:T[x.parameter],w.values=x.values||((E=S.options)==null?void 0:E[x.parameter]),!w.values&&!Number.isFinite(w.startValue))return!1;w.values&&!w.values.includes(w.startValue)&&(w.startValue=w.values[0]),w.lastValue=w.startValue}return u.set(p,w),d.set(b,p),l("start",w),x.kind==="probe"&&t(x.channel,null),x.kind==="plug"&&Number.isInteger(x.wireIndex)&&r(x.wireIndex),(x.kind==="button"||x.kind==="switch")&&o(x.action),x.kind==="screen"&&Number.isFinite(y.fraction)&&a(_n.clamp(y.fraction,0,1),y.panelIndex||0),!0}function g(p,x={}){var b;const y=u.get(p);if(!y)return!1;if(x.position&&(y.position=x.position.clone()),x.quaternion&&(y.quaternion=x.quaternion.clone()),y.target.kind==="dial"&&Number.isFinite(x.turn)){y.turn+=x.turn;const S=y.target;let w;if((b=y.values)!=null&&b.length){const R=Math.round(y.turn/(S.detentRadians||Math.PI/12)),P=_n.clamp(y.values.indexOf(y.startValue)+R,0,y.values.length-1);w=y.values[P]}else{const R=S.step||1;w=_n.clamp(y.startValue+Math.round(y.turn/(S.detentRadians||Math.PI/12))*R,S.min??-1/0,S.max??1/0),w=Number(w.toPrecision(12))}w!==y.lastValue&&(y.lastValue=w,s(S.parameter,w))}return y.target.kind==="screen"&&Number.isFinite(x.fraction)&&a(_n.clamp(x.fraction,0,1),x.panelIndex||0),l("move",y),!0}function v(p,x={},y=!1){h.delete(p);const b=u.get(p);if(!b)return null;x.position&&(b.position=x.position.clone()),u.delete(p),d.delete(b.resource);const S=y?null:kl(b.position,e(),c);let w={kind:y?"cancelled":"released",terminal:null};if(b.target.kind==="probe"&&(t(b.target.channel,(S==null?void 0:S.id)||null),w={kind:S?"connected":"loose",terminal:(S==null?void 0:S.id)||null}),b.target.kind==="terminal"||b.target.kind==="plug"){const R=b.target.from||b.target.terminal;if(!y&&S&&S.id!==R)i(R,S.id),w={kind:"connected",terminal:S.id};else{const P=b.startPosition&&b.position&&b.startPosition.distanceTo(b.position)<.018;w={kind:b.target.kind==="terminal"&&P?"cancelled":"loose",terminal:null}}}return l("end",b,w),w}function m(){const p=[...u.keys()];for(const x of p)v(x,{},!0),h.add(x)}return{begin:f,move:g,end:(p,x)=>v(p,x),cancelAll:m,release(p){h.delete(p)},block(p){u.has(p)&&v(p,{},!0),h.add(p)},hold:p=>u.get(p),holds:u,isHeld:p=>d.has(p)}}function J_(n,e,{bounds:t={minX:-3.2,maxX:3.2,minZ:-3.8,maxZ:2.4},obstacles:i=[],radius:r=.19}={}){const s=n.clone(),o=Math.max(1,Math.ceil(Math.hypot(e.x,e.z)/.04)),a=e.x/o,l=e.z/o,c=(h,d,f)=>{const g=[h-(f.minX-r),f.maxX+r-h,d-(f.minZ-r),f.maxZ+r-d];return Math.max(0,Math.min(...g))},u=(h,d)=>i.some(f=>{const g=c(h,d,f),v=c(s.x,s.z,f);if(g<=0)return!1;if(v<=0)return!0;if(g<v-1e-10)return!1;const m=(f.minX+f.maxX)/2,p=(f.minZ+f.maxZ)/2,x=(s.x-m)**2+(s.z-p)**2,y=(h-m)**2+(d-p)**2;return g>v+1e-10||y<=x+1e-10});for(let h=0;h<o;h++){const d=_n.clamp(s.x+a,t.minX+r,t.maxX-r);u(d,s.z)||(s.x=d);const f=_n.clamp(s.z+l,t.minZ+r,t.maxZ-r);u(s.x,f)||(s.z=f)}return s}function Q_(n,e,t){const i=new On().setFromAxisAngle(new D(0,1,0),t);n.position.sub(e).applyQuaternion(i).add(e),n.quaternion.premultiply(i),n.updateMatrixWorld(!0)}function ex({speed:n=.8,snapAngle:e=Math.PI/6,...t}={}){let i=!1,r=!1;return{reset(){i=!1,r=!0},update({rig:s,headPosition:o,headQuaternion:a,left:l=[0,0],right:c=0,dt:u=0,enabled:h=!0}){if(!h)return i=!1,r=!0,!1;const d=Math.max(Math.abs(l[0]||0),Math.abs(l[1]||0),Math.abs(c))<.2;if(!i){if(!d)return!1;i=!0}Math.abs(c)<.25&&(r=!1);let f=0;Math.abs(c)>.7&&!r&&(f=-Math.sign(c)*e,Q_(s,o,f),r=!0);const g=Math.abs(l[0]||0)>.18?l[0]:0,v=Math.abs(l[1]||0)>.18?l[1]:0;if(!g&&!v)return!1;const m=new D(0,0,-1).applyQuaternion(a).applyAxisAngle(new D(0,1,0),f);m.y=0,m.lengthSq()<.001?m.set(0,0,-1):m.normalize();const x=new D(-m.z,0,m.x).multiplyScalar(g).addScaledVector(m,-v);x.length()>1&&x.normalize(),x.multiplyScalar(n*_n.clamp(u,0,.05));const y=J_(o,x,t);return s.position.add(y.sub(o)),s.updateMatrixWorld(!0),!0}}}function Ku(n,e=!1){const t=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),r=new Set(Object.keys(n[0].morphAttributes)),s={},o={},a=n[0].morphTargetsRelative,l=new hn;let c=0;for(let u=0;u<n.length;++u){const h=n[u];let d=0;if(t!==(h.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const f in h.attributes){if(!i.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;s[f]===void 0&&(s[f]=[]),s[f].push(h.attributes[f]),d++}if(d!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(a!==h.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const f in h.morphAttributes){if(!r.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;o[f]===void 0&&(o[f]=[]),o[f].push(h.morphAttributes[f])}if(e){let f;if(t)f=h.index.count;else if(h.attributes.position!==void 0)f=h.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,f,u),c+=f}}if(t){let u=0;const h=[];for(let d=0;d<n.length;++d){const f=n[d].index;for(let g=0;g<f.count;++g)h.push(f.getX(g)+u);u+=n[d].attributes.position.count}l.setIndex(h)}for(const u in s){const h=Ju(s[u]);if(!h)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;l.setAttribute(u,h)}for(const u in o){const h=o[u][0].length;if(h===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[u]=[];for(let d=0;d<h;++d){const f=[];for(let v=0;v<o[u].length;++v)f.push(o[u][v][d]);const g=Ju(f);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;l.morphAttributes[u].push(g)}}return l}function Ju(n){let e,t,i,r=-1,s=0;for(let c=0;c<n.length;++c){const u=n[c];if(e===void 0&&(e=u.array.constructor),e!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=u.itemSize),t!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=u.normalized),i!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(r===-1&&(r=u.gpuType),r!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;s+=u.count*t}const o=new e(s),a=new jn(o,t,i);let l=0;for(let c=0;c<n.length;++c){const u=n[c];if(u.isInterleavedBufferAttribute){const h=l/t;for(let d=0,f=u.count;d<f;d++)for(let g=0;g<t;g++){const v=u.getComponent(d,g);a.setComponent(d+h,g,v)}}else o.set(u.array,l);l+=u.count*t}return r!==void 0&&(a.gpuType=r),a}const zt={case:"#d5d6d1",face:"#e8e8e2",dark:"#262a2c",rubber:"#363b3c",metal:"#a5aaab",red:"#ad2f2c",black:"#25292b",ch1:"#d5b348",ch2:"#64a5b5"},sn=(n,e=3)=>Number.isFinite(Number(n))&&n!==null?Number(n).toFixed(e).replace(/\.?0+$/,"")||"0":"—",id=n=>Number(n)>=1e3?`${sn(Number(n)/1e3,2)} kΩ`:`${sn(Number(n),1)} Ω`,Bl=n=>n!=null&&n.isVector3?n.clone():Array.isArray(n)?new D(...n):new D((n==null?void 0:n.x)||0,(n==null?void 0:n.y)||0,(n==null?void 0:n.z)||0);function Xt(n,e,t,i,{size:r,width:s,align:o="left",weight:a=700,family:l="Arial, sans-serif"}){const c=String(e);let u=r;n.font=`${a} ${u}px ${l}`,s&&n.measureText(c).width>s&&(u*=s/n.measureText(c).width,n.font=`${a} ${u}px ${l}`),n.textAlign=o,n.fillText(c,t,i)}function tx(n,e,t){const i=[];for(const r of String(e).split(/\s+/)){const s=i.length-1;s>=0&&n.measureText(`${i[s]} ${r}`).width<=t?i[s]+=` ${r}`:i.push(r)}return i}function Ni(n){const e=new rn;e.name=n;const t=[],i={},r=new Set,s=new Set,o=new Set;let a=!1;const l=(P,T={})=>{const E=new hc({color:P,roughness:.66,metalness:.03,...T});return r.add(E),E},c={case:l(zt.case),face:l(zt.face),dark:l(zt.dark),rubber:l(zt.rubber,{roughness:.87}),metal:l(zt.metal,{metalness:.8,roughness:.27}),red:l(zt.red),black:l(zt.black)};function u(P,T,E=e,I=[0,0,0]){s.add(P);const B=new Tn(P,T);return B.position.copy(Bl(I)),B.castShadow=!0,B.receiveShadow=!0,E.add(B),B}const h=(P,T,E,I,B,k,q=.002)=>u(q<=5e-4?new cn(P,T,E):new Yo(P,T,E,2,Math.min(q,P/4,T/4,E/4)),I,B,k);function d(P,T,E,I,B,k=24){const q=new yt(P,P,T,k);return q.rotateX(Math.PI/2),u(q,E,I,B)}function f(P,T,E=e){const I=new un;return I.name=P,I.position.copy(Bl(T)),E.add(I),i[P]=I,I}function g(P,T){const E={object:P,id:`${n}:${t.length}`,axis:"z",...T};return P.userData.equipmentTarget=E,t.push(E),E}function v(P,T,E,{pixels:I=[768,320],background:B="#dbe6cb",foreground:k="#102018"}={}){const q=document.createElement("canvas");q.width=I[0],q.height=Math.round(I[0]*T/P);const H=q.getContext("2d"),U=new Il(q);U.colorSpace=Mn,U.anisotropy=8;const $=new qn({map:U,toneMapped:!1});r.add($),o.add(U);const V=u(new Di(P,T),$,e,E);V.castShadow=!1;let ae=null;return{object:V,canvas:q,ctx:H,texture:U,draw(ye,Le){const Je=JSON.stringify(ye);Je!==ae&&(ae=Je,H.fillStyle=B,H.fillRect(0,0,q.width,q.height),H.fillStyle=k,H.textBaseline="middle",H.textAlign="left",Le(H,q.width,q.height),U.needsUpdate=!0)}}}function m(P,T,E,I,{size:B=52,color:k="#172120",background:q="#e8e8e2",align:H="center"}={}){const U=v(T,E,I,{pixels:[Math.round(128*T/E),128],background:q,foreground:k});return U.draw(P,($,V,ae)=>{Xt($,P,H==="center"?V/2:8,ae/2,{size:ae*.88,width:V-16,align:H})}),U}function p(P,T,E,I=e){d(.0022,.001,c.metal,I,[P,T,E],12);const B=h(.003,5e-4,3e-4,c.dark,I,[P,T,E+65e-5],1e-4);B.rotation.z=.5}function x(P,T,E){h(P,T-.008,E,c.case,e,[0,T/2+.004,0],.008),h(P-.008,T-.014,.006,c.face,e,[0,T/2+.005,E/2],.004);for(const I of[-P/2+.014,P/2-.014]){for(const B of[.024,T-.018])p(I,B,E/2+.0038);for(const B of[-E/2+.02,E/2-.02])h(.025,.009,.032,c.rubber,e,[I,.0045,B],.002)}for(let I=0;I<12;I++)h(.035,6e-4,.002,c.dark,e,[P/2-.042,T+4e-4,-E/2+.022+I*.006],15e-5);return E/2+.004}function y(P,T,E,I,B,{bnc:k=!1,action:q,channel:H}={}){const U=l(B);if(d(k?.0083:.007,k?.008:.003,U,e,[T,E,I+.002]),d(k?.0065:.0048,k?.009:.002,c.metal,e,[T,E,I+.006]),d(k?.0042:.0031,.001,c.dark,e,[T,E,I+(k?.011:.0075)]),k)for(const V of[-1,1])d(.001,.004,c.metal,e,[T+V*.006,E,I+.009],10);const $=f(P,[T,E,I+.012]);if(q){const V=d(.012,.007,c.face,e,[T,E,I+.004]);V.visible=!1,g(V,{kind:"probe",label:P,action:q,channel:H}),g(e.children[e.children.indexOf($)-1],{kind:"probe",label:P,action:q,channel:H})}return $}function b(P,T,E,I,B,{radius:k=.011,values:q=Ot[T],min:H,max:U,step:$=1,color:V=zt.dark}={}){const ae=new rn;ae.position.set(E,I,B),e.add(ae),d(k+.003,.0016,c.metal,ae,[0,0,0]);const ye=new rn;ye.position.z=.003,ye.userData.equipmentMoving=!0,ae.add(ye);const Le=l(V,{roughness:.79}),Je=d(k,.016,Le,ye,[0,0,.008],32),je=[];for(let J=0;J<28;J++){const le=J/28*Math.PI*2,_e=new yt(5e-4,5e-4,.012,6);_e.rotateX(Math.PI/2),_e.translate(Math.cos(le)*k,Math.sin(le)*k,.008),je.push(_e)}u(Ku(je),Le,ye),je.forEach(J=>J.dispose()),h(.0014,k*.65,7e-4,c.face,ye,[0,k*.49,.0164],15e-5);for(let J=0;J<11;J++){const le=-Math.PI*.75+J/10*Math.PI*1.5,_e=h(6e-4,J%5===0?.003:.0018,3e-4,c.dark,ae,[Math.sin(le)*(k+.006),Math.cos(le)*(k+.006),8e-4],1e-4);_e.rotation.z=-le}const ht=g(Je,{kind:"dial",label:P,parameter:T,values:q,min:H??(q==null?void 0:q[0]),max:U??(q==null?void 0:q.at(-1)),step:$});Je.userData.equipmentTarget=ht,ye.traverse(J=>{J.isMesh&&(J.userData.equipmentTarget=ht)});function pt(J){const le=q==null?void 0:q.indexOf(J),_e=q&&le>=0?le/Math.max(1,q.length-1):Number.isFinite(J)&&Number.isFinite(ht.min)&&Number.isFinite(ht.max)?_n.clamp((J-ht.min)/(ht.max-ht.min||1),0,1):.5;ye.rotation.z=(.75-_e*1.5)*Math.PI,ht.value=J}return{descriptor:ht,set:pt,rotor:ye}}function S(P,T,E,I,B,{color:k="#6f7974",width:q=.025}={}){const H=h(q,.012,.007,l(k),e,[E,I,B+.004],.002);return g(H,{kind:"button",label:P,action:T}),H}function w(){if(!a){a=!0;for(const P of[...s,...r,...o])P.dispose();e.removeFromParent()}}function R(){var I;const P=new Set(t.map(B=>B.object)),T=new Map;e.updateMatrixWorld(!0);const E=e.matrixWorld.clone().invert();e.traverse(B=>{if(!B.isMesh||P.has(B)||Array.isArray(B.material))return;for(let q=B.parent;q&&q!==e;q=q.parent)if(q.userData.equipmentMoving)return;const k=T.get(B.material)||[];k.push(B),T.set(B.material,k)});for(const[B,k]of T){if(k.length<2)continue;const q=k.map(V=>{const ae=V.geometry.index?V.geometry.toNonIndexed():V.geometry.clone();return ae.applyMatrix4(new Ht().multiplyMatrices(E,V.matrixWorld)),ae}),H=Ku(q);if(q.forEach(V=>V.dispose()),!H)continue;const U=u(H,B),$=(I=k.find(V=>V.userData.equipmentTarget))==null?void 0:I.userData.equipmentTarget;$&&(U.userData.equipmentTarget=$);for(const V of k)V.removeFromParent(),V.geometry.dispose(),s.delete(V.geometry)}}return{group:e,targets:t,anchors:i,m:c,material:l,mesh:u,box:h,cylinder:d,screen:v,text:m,screw:p,enclosure:x,socket:y,dial:b,button:S,anchor:f,target:g,finish:R,dispose:w}}function nx({id:n="multimeter",label:e="DIGITAL MULTIMETER"}={}){const t=Ni(n),{group:i,m:r}=t;t.box(.11,.213,.046,t.material("#b49a49",{roughness:.88}),i,[0,.112,0],.012),t.box(.096,.198,.008,r.dark,i,[0,.112,.024],.008),t.box(.09,.063,.004,r.black,i,[0,.172,.03],.003);const s=t.screen(.084,.057,[0,.172,.0325],{pixels:[840,570]});t.text("MULTIMETER",.084,.01,[0,.209,.029],{background:zt.dark,color:"#f5f7ef"});const o=t.dial("Meter","meterMode",0,.106,.031,{radius:.02,values:["off","vdc"]});t.text("OFF",.024,.01,[-.027,.078,.031],{background:zt.dark,color:"#d7d9d1"}),t.text("V⎓",.023,.011,[.028,.078,.031],{background:zt.dark,color:"#d7d9d1"}),t.socket("COM",-.025,.042,.031,zt.black),t.socket("V",.025,.042,.031,zt.red),t.text("COM          V",.085,.011,[0,.023,.031],{background:zt.dark,color:"#e0e1d8"});const a=t.box(.067,.1,.006,r.dark,i,[0,.055,-.061],.003);a.rotation.x=-.4;for(const c of[-.044,.044])t.box(.014,.044,.006,r.rubber,i,[c,.022,.025],.003);function l(c={}){const u=c.measurement||{},h=c.meterMode||"vdc";o.set(h);const d=u.probeReady?u.probeVoltage:null;s.draw([h,d,c.module],(f,g,v)=>{h!=="off"&&(Xt(f,c.module==="opamp"?"V SAMPLE":"DC V",28,v*.14,{size:v*.16,width:g-56}),Xt(f,d===null?"— —":sn(d,3),g-26,v*.54,{size:v*.55,width:g-52,align:"right",family:"Arial, sans-serif"}),d===null&&Xt(f,"CONNECT PROBES",g/2,v*.87,{size:v*.13,width:g-40,align:"center"}))})}return t.finish(),l(),{group:i,targets:t.targets,anchors:t.anchors,update:l,dispose:t.dispose}}function pc(n,e,t){const i={l:100,r:30,t:78,b:138},r=52,s=(e-i.t-i.b-r*(t-1))/t;return Array.from({length:t},(o,a)=>({panel:a,left:i.l/n,top:(i.t+a*(s+r))/e,width:(n-i.l-i.r)/n,height:s/e}))}function ix(n){return`${{"Capacitor voltage":"V","Inductor voltage":"V","Storage current":"I","Stored energy":"E","Calculated load power":"P"}[n.name]||n.name||""} ${sn(n.value,3)} ${n.unit||""}`.trim()}function rd(n,e,t,i,r){var p,x,y;n.fillStyle="#071015",n.fillRect(0,0,e,t);const o=((p=i==null?void 0:i.panels)!=null&&p.length?i.panels:[i]).filter(Boolean).slice(0,3),a=pc(e,t,o.length||1),l=r.recorder?r.recorder==="transient"?r.playing?"ACQUIRING":"PAUSED":"CALCULATED · WIRING":r.scopeRunning===!1?r.scopeStale?"HOLD · OLD SETTINGS":"HOLD":"RUN";n.fillStyle="#f1faf5",Xt(n,l,20,29,{size:30,width:e*.56});const c=Number.isFinite(r.timeDiv)?`${sn(r.timeDiv,3)} ms/div`:((i==null?void 0:i.xLabel)||"TIME").replace("Elapsed circuit time","Time").replace("Load resistance","Load");if(Xt(n,c,e-22,29,{size:30,width:e*.41,align:"right"}),!o.length){Xt(n,"CONNECT THE CHANNELS",e/2,t/2,{size:36,width:e-60,align:"center"});return}const u=["#ffe27b","#79e4f6","#dfbfff"];for(let b=0;b<o.length;b++){const S=o[b],w=a[b],R=w.left*e,P=w.top*t,T=w.width*e,E=w.height*t;n.strokeStyle="#344750",n.lineWidth=1.5;const I=S.xDivisions||4,B=S.yDivisions||4;for(let U=0;U<=I;U++)n.beginPath(),n.moveTo(R+T*U/I,P),n.lineTo(R+T*U/I,P+E),n.stroke();for(let U=0;U<=B;U++)n.beginPath(),n.moveTo(R,P+E*U/B),n.lineTo(R+T,P+E*U/B),n.stroke();n.fillStyle="#f1faf5";const k=S.yTicks||[];for(const[U,$]of k.entries())o.length>1&&U!==0&&U!==Math.floor(k.length/2)&&U!==k.length-1||Xt(n,$.label,R-12,P+(1-$.position)*E,{size:32,width:R-20,align:"right"});for(const[U,$]of(S.xTicks||[]).entries())n.fillStyle=i.interaction==="source"?u[U%u.length]:"#f1faf5",Xt(n,$.label,R+$.position*T,P+E+24,{size:31,width:Math.max(150,T/5),align:"center"});const q=r.recorder?S.yLabel:S.title;n.fillStyle=u[b%u.length],Xt(n,q||S.yLabel||"",R+12,P-22,{size:31,width:T-24}),n.save(),n.beginPath(),n.rect(R,P,T,E),n.clip();for(const[U,$]of(S.series||[]).entries()){n.strokeStyle=u[o.length>1?b:U%u.length],n.lineWidth=i.interaction==="source"?12:5,n.lineCap="round",n.lineJoin="round",n.beginPath();let V=!1;for(const ae of $.points||[]){if(!Number.isFinite(ae[0])||!Number.isFinite(ae[1])){V=!1;continue}const ye=R+ae[0]*T,Le=P+(1-ae[1])*E;V?n.lineTo(ye,Le):(n.moveTo(ye,Le),V=!0)}n.stroke()}if(!(S.series||[]).some(U=>{var $;return($=U.points)==null?void 0:$.length})){n.fillStyle="#f5faf4",n.font="700 32px Arial, sans-serif";const U=tx(n,r.scopeError||S.subtitle||"No acquired signal",T-44).slice(0,2);for(const[$,V]of U.entries())Xt(n,V,R+T/2,P+E/2+($-(U.length-1)/2)*38,{size:32,align:"center"})}const H=S.cursor||S.marker;if(H&&Number.isFinite(H.x)){const U=R+_n.clamp(H.x,0,1)*T;n.strokeStyle="#f4fff7",n.lineWidth=3,n.setLineDash([9,7]),n.beginPath(),n.moveTo(U,P),n.lineTo(U,P+E),n.stroke(),n.setLineDash([]),Number.isFinite(H.y)&&(n.fillStyle="#f4fff7",n.beginPath(),n.arc(U,P+(1-H.y)*E,7,0,Math.PI*2),n.fill())}n.restore()}const h=(i==null?void 0:i.cursor)||((x=o.find(b=>b.cursor))==null?void 0:x.cursor),d=(y=h==null?void 0:h.readings)!=null&&y.length?h.readings.map(ix):r.readings||[],f=t-94;n.fillStyle="#172b31",n.fillRect(0,f,e,94),n.fillStyle="#f6fff7";const g=h==null?void 0:h.xLabel,m=(g?[g,d.join("   ·   ")]:d.length>2?[d.slice(0,2).join("   ·   "),d.slice(2).join("   ·   ")]:[...d]).slice(0,2);m.length||m.push(r.scopeError?"CHECK CONNECTIONS":r.recorder?"Select a point to read it":"CONNECT THE CHANNELS"),m.forEach((b,S)=>Xt(n,b,22,f+(m.length===1?47:25+S*43),{size:35,width:e-44}))}function rx({id:n="oscilloscope",label:e="OSCILLOSCOPE"}={}){const t=Ni(n),i=t.enclosure(.43,.245,.18);t.text(e,.27,.014,[-.044,.224,i+7e-4],{align:"left",size:45}),t.box(.278,.18,.007,t.m.dark,t.group,[-.066,.127,i+.0015],.004);const r=t.screen(.266,.17,[-.066,.128,i+.0055],{pixels:[1064,680],background:"#071015"}),s=t.target(r.object,{kind:"screen",label:"Scope",action:"scope-screen",bounds:[]}),o=t.dial("Time/div","timeDiv",.108,.182,i,{radius:.014});t.text("TIME / DIV",.074,.011,[.109,.213,i+5e-4]);const a=t.dial("CH1 volts/div","ch1Scale",.099,.104,i,{color:"#807341"}),l=t.dial("CH2 volts/div","ch2Scale",.163,.104,i,{color:"#3f6e7b"});t.text("CH1",.038,.012,[.099,.137,i+6e-4]),t.text("CH2",.038,.012,[.163,.137,i+6e-4]),t.text("VOLTS / DIV",.1,.011,[.13,.077,i+6e-4]);const c=t.dial("Trigger level","triggerLevel",.171,.182,i,{radius:.008});t.text("TRIGGER",.052,.011,[.17,.212,i+6e-4]);const u=t.button("Trigger edge","set:triggerEdge:falling",.171,.148,i,{width:.028}),h=t.screen(.043,.01,[.171,.16,i+7e-4],{pixels:[400,100],background:zt.face});t.button("Run / Hold","scope-toggle",-.054,.02,i,{width:.03,color:"#5f7567"}),t.text("RUN / HOLD",.066,.008,[-.055,.04,i+5e-4],{size:42}),t.button("Autoscale","scope-autoscale",.014,.02,i,{width:.026}),t.text("AUTO",.042,.008,[.014,.04,i+5e-4],{size:48}),t.socket("CH1",.1,.037,i,zt.ch1,{bnc:!0,action:"tool:ch1",channel:"ch1"}),t.socket("CH2",.164,.037,i,zt.ch2,{bnc:!0,action:"tool:ch2",channel:"ch2"});function d(f={}){var p,x,y,b,S;const g=f.parameters||{};o.set(g.timeDiv),a.set(g.ch1Scale),l.set(g.ch2Scale),c.set(g.triggerLevel),u.userData.equipmentTarget.action=`set:triggerEdge:${g.triggerEdge==="falling"?"rising":"falling"}`,h.draw(g.triggerEdge,(w,R,P)=>Xt(w,g.triggerEdge==="falling"?"FALL":"RISE",R/2,P/2,{size:P*.85,width:R-16,align:"center"})),s.bounds=pc(r.canvas.width,r.canvas.height,Math.min(3,((x=(p=f.graph)==null?void 0:p.panels)==null?void 0:x.length)||1));const v=(y=f.rawGraph)==null?void 0:y.scope,m=v?{...g,timeDiv:v.timeDiv,ch1Scale:v.channels.ch1.scale,ch2Scale:v.channels.ch2.scale,scopeRunning:v.running,scopeStale:v.stale,scopeError:v.error,readings:[`CH1 ${sn(v.channels.ch1.peak,2)} V pk  ·  CH2 ${sn(v.channels.ch2.peak,2)} V pk`,`TRIGGER ${((b=v.trigger)==null?void 0:b.edge)==="falling"?"↓":"↑"} ${sn((S=v.trigger)==null?void 0:S.level,2)} V`]}:g;r.draw([f.graph,m.timeDiv,m.ch1Scale,m.ch2Scale,m.scopeRunning,m.scopeStale,m.scopeError,m.readings],(w,R,P)=>rd(w,R,P,f.graph,m))}return t.finish(),d(),{group:t.group,targets:t.targets,anchors:t.anchors,screen:r,update:d,dispose:t.dispose}}function Qu({id:n="lab-recorder",module:e="thevenin"}={}){const t=Ni(n),i=t.enclosure(.43,.245,.18);t.text("LAB RECORDER",.3,.014,[-.038,.224,i+7e-4],{align:"left"}),t.box(.402,.187,.007,t.m.dark,t.group,[0,.119,i+.0015],.004);const r=t.screen(.391,.177,[0,.119,i+.0055],{pixels:[1280,580],background:"#071015"}),s=t.target(r.object,{kind:"screen",label:"Lab recorder",action:"scope-screen",bounds:[]});let o=0,a={},l=[];if(e==="transient")for(const[h,d]of["VOLTAGE","CURRENT","ENERGY"].entries()){const f=-.135+h*.135,g=t.button(d,`recorder-panel:${h}`,f,.013,i,{width:.11,color:"#47565b"}),v=t.screen(.102,.009,[f,.013,i+.0077],{pixels:[1020,90],background:"#47565b",foreground:"#ffffff"});v.object.userData.equipmentTarget=g.userData.equipmentTarget,l.push({text:v,label:d,index:h})}function c(h={}){var x,y,b;a=h;const d=h.parameters||{},f=h.measurement||{};let g=h.graph;e==="transient"&&((x=g==null?void 0:g.panels)!=null&&x.length)&&(o=Math.min(o,g.panels.length-1),g={...g.panels[o],panels:void 0}),s.bounds=pc(r.canvas.width,r.canvas.height,1).map(S=>({...S,panel:e==="transient"?o:0}));const v=S=>`${S>=0?"+":""}${sn(S,2)}`;let m=[];if(e==="thevenin"&&(m=f.ok?[`${id(d.load)}  ·  ${sn(f.voltage,3)} V`,`${sn(f.current*1e3,3)} mA  ·  ${sn(f.power*1e3,3)} mW`]:["CONNECT CIRCUIT"]),e==="superposition"){const S=((y=h.rawGraph)==null?void 0:y.bars)||[];m=[S.slice(0,2).map((w,R)=>`${R?"B":"A"} ${Number.isFinite(w.value)?v(w.value):"—"} mA`).join("  ·  "),`BOTH ${Number.isFinite((b=S[2])==null?void 0:b.value)?v(S[2].value):"—"} mA`]}if(e==="transient"){const S=[f.voltage,f.current*1e3,f.energy*1e3],w=["V","mA","mJ"];m=f.ok?[`${sn(d.time*1e3,3)} ms  ·  ${sn(S[o],3)} ${w[o]}`,`${d.charging?"SOURCE":"RETURN"}  ·  ${sn((d.acquiredTime||0)*1e3,3)} ms acquired`]:["CONNECT CIRCUIT"]}for(const S of l)S.text.draw(o===S.index,(w,R,P)=>{w.fillStyle=o===S.index?"#ecf7ec":"#47565b",w.fillRect(0,0,R,P),w.fillStyle=o===S.index?"#14251d":"#ffffff",Xt(w,S.label,R/2,P/2,{size:P*.88,width:R-20,align:"center"})});const p={recorder:e,playing:d.playing,readings:m};r.draw([g,p],(S,w,R)=>rd(S,w,R,g,p))}function u(h){return e!=="transient"||!Number.isInteger(h)||h<0||h>2?!1:(o=h,c(a),!0)}return t.finish(),c(),{group:t.group,targets:t.targets,anchors:t.anchors,screen:r,module:e,selectPanel:u,update:c,dispose:t.dispose}}function sx({id:n="power-supply",label:e="DC POWER SUPPLY",parameter:t="equivalentVoltage",fixedValue:i=null,polarity:r=1,positiveTerminal:s="+",negativeTerminal:o="−"}={}){const a=Ni(n),l=a.enclosure(.22,.186,.2);a.text(e,.183,.014,[0,.168,l+5e-4],{size:46}),a.box(.194,.071,.004,a.m.dark,a.group,[0,.124,l],.003);const c=a.screen(.186,.063,[0,.124,l+.0025],{background:"#071612",foreground:"#d8ffe0",pixels:[1116,378]}),u=t==="nortonCurrent",h=i===null?a.dial(u?"Current":"Voltage",t,.059,.059,l,{radius:.014}):null;a.text(i===null?u?"CURRENT":"VOLTAGE":"FIXED",.07,.009,[.057,.083,l+4e-4]),a.socket(o,-.067,.046,l,zt.black),a.socket(s,-.02,.046,l,zt.red),a.text("−        +",.09,.011,[-.044,.026,l+5e-4],{size:64});function d(f={}){var b;const g=i??((b=f.parameters)==null?void 0:b[t])??f.value;h==null||h.set(g);const v=f.parameters||{},m=t==="v1"?"a":t==="v2"?"b":null,p=f.module==="superposition"&&m&&v.sourceMode&&v.sourceMode!=="both"&&v.sourceMode!==m,x=p&&v.replacement==="open",y=p?0:Number.isFinite(g)?g*r:g;c.draw([y,t,p,x],(S,w,R)=>{Xt(S,x?"OPEN":`${sn(y,2)} ${u?"mA":"V"}`,w/2,R*.43,{size:R*.72,width:w-48,align:"center"}),Xt(S,x?"DISCONNECTED":p?"SHORT":t==="rail"?"LINKED RAILS":"OUTPUT",w/2,R*.86,{size:R*.17,width:w-40,align:"center"})})}return a.finish(),d(),{group:a.group,targets:a.targets,anchors:a.anchors,update:d,dispose:a.dispose}}function ox({id:n="generator",label:e="FUNCTION GENERATOR"}={}){const t=Ni(n),i=t.enclosure(.28,.135,.16);t.text(e,.238,.012,[0,.118,i+5e-4],{size:48}),t.box(.167,.086,.004,t.m.dark,t.group,[-.049,.064,i],.003);const r=t.screen(.159,.078,[-.049,.064,i+.0025],{pixels:[954,468],background:"#071612",foreground:"#e5ffe5"}),s=t.dial("Frequency","frequency",.064,.078,i,{radius:.012}),o=t.dial("Amplitude","amplitude",.112,.078,i,{radius:.01});t.text("Hz",.027,.009,[.063,.104,i+7e-4]),t.text("V pk",.032,.009,[.111,.104,i+7e-4]),t.socket("OUT",.082,.028,i,zt.metal,{bnc:!0}),t.text("SINE OUT",.055,.008,[.082,.011,i+6e-4],{size:45});function a(l={}){const c=l.parameters||{};s.set(c.frequency),o.set(c.amplitude),r.draw([c.frequency,c.amplitude],(u,h,d)=>{Xt(u,`${sn(c.frequency,1)} Hz`,h/2,d*.27,{size:d*.35,width:h-44,align:"center"}),Xt(u,`${sn(c.amplitude,2)} V pk`,h/2,d*.65,{size:d*.33,width:h-44,align:"center"}),Xt(u,"SINE · 0 V OFFSET",h/2,d*.92,{size:d*.1,width:h-40,align:"center"})})}return t.finish(),a(),{group:t.group,targets:t.targets,anchors:t.anchors,update:a,dispose:t.dispose}}function ax({id:n="resistance-box",label:e="RESISTANCE",parameter:t="load",values:i=Ot[t]}={}){const r=Ni(n),s=r.enclosure(.133,.097,.093);r.text(e,.11,.01,[0,.083,s+5e-4],{size:48});const o=r.dial(e,t,.028,.039,s,{radius:.015,values:i}),a=r.screen(.064,.029,[-.03,.059,s+6e-4],{pixels:[768,348],background:"#e1ead5"});r.socket("A",-.045,.024,s,zt.red),r.socket("B",-.016,.024,s,zt.black);function l(c={}){var h;const u=((h=c.parameters)==null?void 0:h[t])??c.value;o.set(u),a.draw(u,(d,f,g)=>{Xt(d,id(u),f/2,g/2,{size:g*.72,width:f-28,align:"center"})})}return r.finish(),l(),{group:r.group,targets:r.targets,anchors:r.anchors,update:l,dispose:r.dispose}}function lx({id:n="experiment-controls",module:e="thevenin"}={}){const t=Ni(n),i=t.enclosure(.34,.172,.13),r=[],s={thevenin:"EQUIVALENT CIRCUITS",superposition:"SOURCE CONTROL",opamp:"AMPLIFIER CONTROL",transient:"TRANSIENT CONTROL"};t.text(s[e]||"CIRCUIT CONTROL",.29,.013,[0,.151,i+5e-4],{size:47});function o(g,v,m,p,x=.1,{min:y,max:b,step:S,radius:w=.012}={}){const R=t.dial(g,v,p,x,i,{radius:w,values:m,min:y,max:b,step:S}),P=t.screen(.074,.016,[p,x+.03,i+6e-4],{pixels:[740,160],background:zt.face});return r.push({...R,parameter:v,display:P,label:g}),R}function a(g,v,m,p,x=.032){const y=t.button(g,v,m,p,i,{width:x});return t.text(g,x+.006,.01,[m,p-.014,i+5e-4]),y}const l=a("MODE","build",-.132,.028);a("CLEAR","reset-circuit",-.089,.028),a("UNDO","undo",-.046,.028);for(const[g,v]of["thevenin","superposition","opamp","transient"].entries())a(String(5+g).padStart(2,"0"),`module:${v}`,.016+g*.037,.028,.024);const c=t.screen(.108,.014,[.103,.05,i+7e-4],{pixels:[620,120],background:zt.face});let u,h;e==="thevenin"&&o("Circuit","representation",["original","thevenin","norton"],-.064),e==="superposition"&&(o("Sources","sourceMode",["a","both","b"],-.08),o("Inactive source","replacement",["short","open"],.063)),e==="opamp"&&o("Amplifier","configuration",["inverting","noninverting"],-.064),e==="transient"&&(o("Circuit","kind",["RC","RL"],-.117,.106),o("Speed","speed",Ot.speed,-.04,.106),o("Cursor","timeCursor",void 0,.039,.106,{min:0,max:1,step:.001}),u=a("RUN / PAUSE","play",.121,.112,.045),a("REPLAY","replay",.121,.073,.039),h=a("SOURCE / RETURN","switch",-.112,.062,.05),a("ZERO ENERGY","reset-energy",-.031,.062,.045));const d={original:"ORIGINAL",thevenin:"THÉVENIN",norton:"NORTON",both:"BOTH",a:"A ONLY",b:"B ONLY",short:"SHORT",open:"OPEN",inverting:"INVERTING",noninverting:"NON-INVERTING"};function f(g={}){const v=g.parameters||{};l.userData.equipmentTarget.action=g.mode==="build"?"explore":"build",l.userData.equipmentTarget.label=g.mode==="build"?"Explore reference":"Build circuit",c.object.visible=e!=="transient",c.draw([g.mode,v.charging,v.playing],(m,p,x)=>{Xt(m,e==="transient"?`${v.playing?"RUN":"PAUSED"} · ${v.charging?"SOURCE":"RETURN"}`:g.mode==="build"?"BUILD CIRCUIT":"REFERENCE",p/2,x/2,{size:x*.85,width:p-16,align:"center"})});for(const m of r){const p=m.parameter==="timeCursor"?v.time:v[m.parameter];m.parameter==="timeCursor"&&(m.descriptor.max=Math.max(0,v.acquiredTime||0),m.descriptor.step=Math.max(1e-6,m.descriptor.max/100)),m.set(p),m.display.draw(p,(x,y,b)=>{const S=m.parameter==="timeCursor"?`${sn((p||0)*1e3,3)} ms`:m.parameter==="speed"?`${sn(p,2)}×`:d[p]||String(p||m.label);Xt(x,S,y/2,b/2,{size:b*.85,width:y-16,align:"center"})})}u&&(u.userData.equipmentTarget.label=v.playing?"Pause":"Run"),h&&(h.userData.equipmentTarget.label=v.charging?"Switch to return loop":"Switch to source")}return t.finish(),f(),{group:t.group,targets:t.targets,anchors:t.anchors,module:e,width:.34,height:.172,update:f,dispose:t.dispose}}function cx({id:n="probe",color:e=zt.red,channel:t="red",label:i="Probe",action:r=/ground/i.test(t)?`scope-ground:${t.slice(0,3)}`:`tool:${t}`,ground:s=/ground/i.test(t)}={}){if(s)return ux({id:n,color:e,channel:t,label:i,action:r});const o=Ni(n),{group:a,m:l}=o,c=o.material(e,{roughness:.76}),u=o.mesh(new yt(.005,.0043,.113,24),c,a,[0,.091,0]);o.mesh(new yt(.0021,.0038,.019,20),c,a,[0,.0255,0]),o.mesh(new yt(75e-5,75e-5,.016,14),l.metal,a,[0,.01,0]),o.mesh(new rc(75e-5,.0025,14),l.metal,a,[0,.00125,0]).rotation.z=Math.PI,o.mesh(new yt(.012,.012,.0027,32),c,a,[0,.036,0]);for(let f=0;f<13;f++)o.mesh(new yt(.0054,.0054,.0015,24),c,a,[0,.048+f*.0064,0]);o.mesh(new yt(.0022,.0045,.024,20),l.rubber,a,[0,.156,0]);for(let f=0;f<5;f++)o.mesh(new yt(.0035-f*25e-5,.0035-f*25e-5,.001,18),l.rubber,a,[0,.149+f*.0035,0]);o.anchor("tip",[0,0,0]),o.anchor("cable",[0,.168,0]);const h=o.target(u,{kind:"probe",id:n,label:i,channel:t,action:r});a.traverse(f=>{f.isMesh&&(f.userData.equipmentTarget=h)});function d(f={}){h.connected=!!f.connected,a.visible=f.visible!==!1}return o.finish(),{group:a,targets:o.targets,anchors:o.anchors,channel:t,length:.168,update:d,dispose:o.dispose}}function ux({id:n="ground-clip",color:e=zt.black,channel:t="ch1Ground",label:i="Ground clip",action:r="scope-ground:ch1"}={}){const s=Ni(n),{group:o,m:a}=s,l=s.material(e,{roughness:.86});s.box(.007,.021,.0016,a.metal,o,[0,.01,-.0022],4e-4);const c=s.box(.007,.022,.0016,a.metal,o,[0,.012,.0022],4e-4);c.rotation.x=-.1;for(let f=0;f<5;f++)s.box(.006,.001,.0014,a.metal,o,[0,.003+f*.003,-.001],1e-4),s.box(.006,.001,.0014,a.metal,o,[0,.003+f*.003,.001],1e-4);const u=s.cylinder(.0034,.009,a.metal,o,[0,.021,0],16);u.rotation.y=Math.PI/2;const h=s.box(.011,.025,.01,l,o,[0,.032,0],.003);s.mesh(new yt(.0017,.0032,.009,16),a.rubber,o,[0,.048,0]),s.anchor("tip",[0,0,0]),s.anchor("cable",[0,.053,0]);const d=s.target(h,{kind:"probe",id:n,label:i,channel:t,action:r});return o.traverse(f=>{f.isMesh&&(f.userData.equipmentTarget=d)}),s.finish(),{group:o,targets:s.targets,anchors:s.anchors,channel:t,length:.053,update(f={}){d.connected=!!f.connected,o.visible=f.visible!==!1},dispose:s.dispose}}function eh({points:n=[[0,0,0],[0,.01,-.03],[.02,.01,-.06]],color:e=zt.black,radius:t=.0018}={}){const i=new rn;i.name="insulated-lead";const r=new hc({color:e,roughness:.82,metalness:0});let s=null,o="",a=!1;function l(c){const h=(Array.isArray(c)?c:(c==null?void 0:c.points)||n).map(Bl);if(h.length<2)return;const d=h.map(v=>v.toArray().map(m=>m.toFixed(5)).join(",")).join(";");if(o===d)return;o=d;const f=new ac(h,!1,"centripetal"),g=new qo(f,48,t,7,!1);s?(s.geometry.dispose(),s.geometry=g):(s=new Tn(g,r),s.castShadow=!0,s.receiveShadow=!0,i.add(s))}return l(n),{group:i,targets:[],anchors:{},update:l,dispose(){a||(a=!0,s==null||s.geometry.dispose(),r.dispose(),i.removeFromParent())}}}function hx({xrManager:n,navigatorXR:e,isSecureContext:t=!0,visibilityTarget:i=null,onStatus:r=()=>{},onBeforeSession:s=()=>{},onSessionStarted:o=()=>{},onSessionEnded:a=()=>{}}){var q,H;let l=!1,c=!1,u=!1,h=!1,d=null,f=!1,g=!1,v=null,m=0,p={kind:"checking",supported:!1,active:!1,message:"Checking headset…"};const x=()=>typeof e=="function"?e():e,y=()=>typeof t=="function"?t():t;function b(U,$){p={kind:U,supported:l,active:c,message:$},h||r({...p})}function S(U="ended"){if(!d&&!f&&!c)return;const $=d,V=f;d=null,f=!1,c=!1,u=!1,V&&a({session:$,floorReference:g,reason:U}),b(l?"ready":"unavailable",l?"VR ready. Enter the lab to connect leads and take readings.":"Open the lab’s HTTPS link in your headset browser.")}const w=()=>S(h?"disposed":"ended");(q=n.addEventListener)==null||q.call(n,"sessionend",w);const R=()=>{E()},P=()=>{(!(i!=null&&i.visibilityState)||i.visibilityState==="visible")&&E()};(H=i==null?void 0:i.addEventListener)==null||H.call(i,"visibilitychange",P);function T(U){var $,V;U!==v&&(($=v==null?void 0:v.removeEventListener)==null||$.call(v,"devicechange",R),v=U,(V=v==null?void 0:v.addEventListener)==null||V.call(v,"devicechange",R))}async function E(){if(h||u||c)return l;const U=++m,$=x();if(T($),l=!1,!y())return b("unavailable","VR needs HTTPS. Open the lab’s HTTPS link in your headset browser."),!1;if(!($!=null&&$.isSessionSupported))return b("unavailable","No headset found here. Open the lab’s HTTPS link in your headset browser."),!1;b("checking","Checking headset…");try{const V=await $.isSessionSupported("immersive-vr");if(h||u||c||U!==m)return l;l=!!V,b(l?"ready":"unavailable",l?"VR ready. Enter the lab to connect leads and take readings.":"No headset found here. Open the lab’s HTTPS link in your headset browser.")}catch(V){!h&&!u&&!c&&U===m&&b("unavailable",`VR support could not be checked: ${(V==null?void 0:V.message)||(V==null?void 0:V.name)||"unknown error"}.`)}return l}async function I(){if(h||u)return!1;if(c)return!0;const U=x();if(T(U),!y()||!(U!=null&&U.requestSession))return b("unavailable",y()?"No headset found here. Open the lab’s HTTPS link in your headset browser.":"VR needs HTTPS. Open the lab’s HTTPS link in your headset browser."),!1;u=!0,m++,b("entering","Accept the headset’s request to enter VR.");let $;try{if($=await U.requestSession("immersive-vr",{optionalFeatures:["local-floor","bounded-floor"]}),h)return await $.end().catch(()=>{}),!1;d=$,g=!1;try{await $.requestReferenceSpace("local-floor"),g=!0}catch{}return n.setReferenceSpaceType(g?"local-floor":"local"),f=!0,s({session:$,floorReference:g}),await n.setSession($),h||d!==$?(await $.end().catch(()=>{}),!1):(l=!0,c=!0,u=!1,o({session:$,floorReference:g}),b("active","VR active. Grip probes and dials. Left stick moves; right stick turns. Click a stick to return to the bench."),!0)}catch(V){return $&&await $.end().catch(()=>{}),S("error"),u=!1,b("error",(V==null?void 0:V.name)==="NotAllowedError"?"The VR request was declined. Select Try VR again when you are ready.":`VR could not start: ${(V==null?void 0:V.message)||(V==null?void 0:V.name)||"headset unavailable"}. Check the headset and try again.`),!1}}async function B(){if(!d)return!1;const U=d;try{return await U.end(),d===U&&S(h?"disposed":"ended"),!0}catch($){return b("error",`VR could not exit: ${($==null?void 0:$.message)||($==null?void 0:$.name)||"unknown error"}. Use the headset system menu to exit.`),!1}}async function k(){var U,$,V;h||(h=!0,m++,d&&await B(),f&&S("disposed"),(U=v==null?void 0:v.removeEventListener)==null||U.call(v,"devicechange",R),($=i==null?void 0:i.removeEventListener)==null||$.call(i,"visibilitychange",P),(V=n.removeEventListener)==null||V.call(n,"sessionend",w))}return E(),{enter:I,exit:B,refreshSupport:E,dispose:k,toggle:()=>c?B():I(),get state(){return{...p}},get active(){return c},get entering(){return u},get supported(){return l}}}function dx(n,e){return{position:n.position.clone(),quaternion:n.quaternion.clone(),scale:n.scale.clone(),near:n.near,far:n.far,fov:n.fov,aspect:n.aspect,zoom:n.zoom,target:e.target.clone(),controlsEnabled:e.enabled}}function fx(n,e,t,i){i&&(t.position.set(0,0,0),t.quaternion.identity(),t.scale.set(1,1,1),n.position.copy(i.position),n.quaternion.copy(i.quaternion),n.scale.copy(i.scale),Object.assign(n,{near:i.near,far:i.far,fov:i.fov,aspect:i.aspect,zoom:i.zoom}),n.updateProjectionMatrix(),e.target.copy(i.target),e.enabled=i.controlsEnabled,e.update(),n.updateMatrixWorld(!0))}function px(n,e,{floorReference:t=!0,eyeHeight:i=1.6}={}){var u,h;const r=(u=e==null?void 0:e.transform)==null?void 0:u.position,s=(h=e==null?void 0:e.transform)==null?void 0:h.orientation;if(!r||!s||![r.x,r.y,r.z,s.x,s.y,s.z,s.w].every(Number.isFinite))return!1;const o=new On(s.x,s.y,s.z,s.w).normalize(),a=new D(0,0,-1).applyQuaternion(o),l=Math.hypot(a.x,a.z)>.001?Math.atan2(a.x,-a.z):-new li().setFromQuaternion(o,"YXZ").y;n.quaternion.setFromAxisAngle(new D(0,1,0),l);const c=new D(r.x,r.y,r.z).applyQuaternion(n.quaternion);return n.position.set(-c.x,t?0:i-r.y,-c.z),n.updateMatrixWorld(!0),!0}function mx({container:n,onTerminal:e=()=>{},onWire:t=()=>{},onAction:i=()=>{},onPart:r=()=>{},onHover:s=()=>{},onPanelPreviewChange:o=()=>{},onXRStatus:a=()=>{},onFrame:l=()=>{},onChange:c=()=>{},onProbe:u=()=>{},onConnect:h=()=>{},onDisconnect:d=()=>{},onWireMove:f=()=>{},onGraphCursor:g=()=>{},onManipulation:v=()=>{}}){const m=new ap;m.background=new Et("#c6c9c9"),m.fog=new tc("#c6c9c9",14,30);const p=new Xn(39,1,.05,35),x=new N_({antialias:!0,alpha:!1});x.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),x.setClearColor("#c6c9c9"),x.outputColorSpace=Mn,x.toneMapping=_h,x.toneMappingExposure=1,x.shadowMap.enabled=!0,x.shadowMap.type=gh,x.shadowMap.autoUpdate=!1,x.shadowMap.needsUpdate=!0,x.xr.enabled=!0,x.xr.setFoveation(0),x.domElement.setAttribute("aria-label","Circuit lab. Drag probe tips onto terminals. Drag a terminal to another terminal to connect a lead; pull a plug out to disconnect it. Drag equipment knobs to turn them. Click switches and drag across the scope screen. Drag empty space to look around and scroll to zoom."),x.domElement.style.touchAction="none",n.appendChild(x.domElement);const y=new F_(p,x.domElement);y.enableDamping=!0,y.dampingFactor=.09,y.minDistance=.55,y.maxDistance=12,y.minPolarAngle=.08,y.maxPolarAngle=Math.PI*.47,y.enablePan=!0;const b=new rn;m.add(b),b.add(p);const S=new D(.3,2.6,2.9).normalize(),w=new D(0,.97,-1);let R=0;function P(){if(x.xr.isPresenting)return;b.position.set(0,0,0),p.aspect=Math.max(1,n.clientWidth)/Math.max(1,n.clientHeight),p.updateProjectionMatrix(),y.target.copy(w);let _=4.5;const C=[];for(const N of[-.97,.97])for(const O of[.81,1.16])for(const X of[-1.62,-.31])C.push(new D(N,O,X));for(let N=0;N<7;N++){p.position.copy(y.target).addScaledVector(S,_),p.lookAt(y.target),p.updateMatrixWorld();const O=C.map(De=>De.clone().project(p)),X=Math.min(...O.map(De=>De.x)),Y=Math.max(...O.map(De=>De.x)),ne=Math.min(...O.map(De=>De.y)),Te=Math.max(...O.map(De=>De.y)),Se=Math.max((Y-X)/1.72,(Te-ne)/1.72),ze=_*Math.tan(_n.degToRad(p.fov/2)),Ee=new D().setFromMatrixColumn(p.matrixWorld,0),se=new D().setFromMatrixColumn(p.matrixWorld,1);y.target.addScaledVector(Ee,(X+Y)*.5*ze*p.aspect),y.target.addScaledVector(se,(ne+Te)*.5*ze),_*=Math.max(.78,Math.min(1.3,Se))}p.position.copy(y.target).addScaledVector(S,_),p.lookAt(y.target),R=p.aspect,y.update()}P(),m.add(new Xp("#ffffff","#777b79",1.35));const T=new xu("#fffdf8",2.7);T.position.set(-3,7,3),T.castShadow=!0,T.shadow.mapSize.set(2048,2048),Object.assign(T.shadow.camera,{left:-4,right:4,top:4,bottom:-4,near:.1,far:16}),T.shadow.normalBias=.004,m.add(T);const E=new xu("#eef2f4",.65);E.position.set(4,3,-4),m.add(E);const I={navy:"#2b2c2d",teal:"#414646",brass:"#b59a60",metal:"#b9baba",board:"#246648",copper:"#ad653c"},B=(_,C={})=>new hc({color:_,roughness:.56,metalness:.08,...C}),k={navy:B(I.navy),teal:B(I.teal),metal:B(I.metal,{metalness:.7,roughness:.3}),brass:B(I.brass,{metalness:.65,roughness:.3}),copper:B(I.copper,{metalness:.65,roughness:.3}),board:B(I.board,{roughness:.58}),pale:B("#b9bcb8"),black:B("#171819",{roughness:.72}),resistor:B("#c8b082",{roughness:.74}),trace:B("#3f7952",{roughness:.68}),solder:B("#bfc3c0",{metalness:.82,roughness:.34}),red:B("#922724",{roughness:.67}),mat:B("#353b3d",{roughness:.95}),pcbEdge:B("#73764e",{roughness:.92})},q=new Set(Object.values(k)),H=new rn;H.position.set(0,.52,-.77),H.scale.setScalar(.36),m.add(H);const U=(_,C,N,O=0,X=0,Y=0)=>{const ne=new Tn(_,C);return ne.position.set(O,X,Y),ne.castShadow=!0,ne.receiveShadow=!0,N.add(ne),ne},$=(_,C,N,O=.035)=>new Yo(_,C,N,3,O);U($(3.65,.025,2.32,.018),k.mat,H,0,.843),U($(3.32,.022,2.02,.018),k.pcbEdge,H,0,.907),U($(3.319,.007,2.019,.018),k.board,H,0,.921);for(const _ of[-1.54,1.54])for(const C of[-.89,.89])U(new yt(.024,.024,.055,6),k.brass,H,_,.88,C),U(new yt(.04,.04,.004,24),k.metal,H,_,.929,C),U(new yt(.023,.023,.009,24),k.solder,H,_,.934,C),U(new cn(.029,.0015,.005),k.black,H,_,.94,C),U(new cn(.005,.0015,.029),k.black,H,_,.94,C);const V=U(new Di(80,80),B("#b9bcba",{roughness:.94}),m,0,.815,0);V.rotation.x=-Math.PI/2,V.visible=!1,V.castShadow=!1;const ae=new rn;ae.visible=!0,m.add(ae);const ye=U(new Di(14,14),B("#a5a8a5",{roughness:.96}),ae,0,-.003,-1.4);ye.rotation.x=-Math.PI/2,ye.castShadow=!1;const Le=U(new Di(10,3.4),B("#d2d3cd",{roughness:.94}),ae,0,1.7,-5.1);Le.castShadow=!1,U(new cn(10,.1,.025),B("#9c9f9b",{roughness:.84}),ae,0,.05,-5.08),U($(2.12,.04,1.42,.009),B("#a7aaa5",{roughness:.83}),ae,0,.8,-.985);for(const _ of[-.91,.91])for(const C of[-1.57,-.4])U(new cn(.055,.765,.055),B("#858b8c",{metalness:.62,roughness:.43}),ae,_,.3975,C),U(new yt(.04,.04,.027,20),k.black,ae,_,.0135,C);for(const _ of[-1.57,-.4])U(new cn(1.85,.065,.035),k.metal,ae,0,.729,_);for(const _ of[-.91,.91])U(new cn(.035,.065,1.2),k.metal,ae,_,.729,-.985);function Je(_,C,N,O){const X=document.createElement("canvas");X.width=_,X.height=C;const Y=X.getContext("2d"),ne=new Il(X);ne.colorSpace=Mn,ne.anisotropy=Math.min(x.capabilities.getMaxAnisotropy(),16),ne.magFilter=si,ne.minFilter=Yi,ne.generateMipmaps=!0;const Te=new qn({map:ne,transparent:!0,side:fi,depthWrite:!1,toneMapped:!1}),Se=new Tn(new Di(N,O),Te);return{canvas:X,context:Y,texture:ne,object:Se}}function je(_,C,N,O,X){const Y=String(C??"");if(_.measureText(Y).width<=X){_.fillText(Y,N,O);return}let ne=Y;for(;ne.length&&_.measureText(`${ne}…`).width>X;)ne=ne.slice(0,-1);_.fillText(`${ne}…`,N,O)}function ht(_,C,N,O,X,Y,ne=3){const Te=String(C??"").split(/\s+/);let Se="",ze=0;for(let Ee=0;Ee<Te.length;Ee++){const se=Se?`${Se} ${Te[Ee]}`:Te[Ee];if(_.measureText(se).width>X&&Se){if(_.fillText(Se,N,O+ze*Y),Se=Te[Ee],ze++,ze===ne-1)return je(_,Te.slice(Ee).join(" "),N,O+ze*Y,X),ze+1}else Se=se}return Se&&_.fillText(Se,N,O+ze*Y),ze+1}function pt(_,C="",N=.44,O=.14){const X=Je(512,160,N,O),Y=(ne,Te)=>{const Se=X.context;Se.clearRect(0,0,512,160),Se.textAlign="center",Se.fillStyle="#ffffff",Se.font=Te?"600 72px monospace":"600 104px monospace",je(Se,ne,256,Te?67:113,496),Se.fillStyle="#f0f4ed",Se.font="600 59px monospace",je(Se,Te,256,142,496),X.texture.needsUpdate=!0};return Y(_,C),X.object.rotation.x=-Math.PI/2,{...X,draw:Y}}const J=pt("TRAINER PCB","DC / ANALOG",.68,.15);J.object.position.set(-1.11,.932,-.84),H.add(J.object);const le=pt("ELEN 221","PATCH TERMINALS",.45,.13);le.object.position.set(1.17,.932,-.86),H.add(le.object);const _e=new rn,He=new rn,We=new rn;H.add(_e,He),m.add(We);const nt=new Map,wt=new Map;let F=[],ue=[],oe=[],re=[];const ie=[],Me=[],fe=new Map,be=new Set,it=new rn;m.add(it);let rt="",L="vdc",M={components:[],wires:[],actions:[],live:{title:"Circuit bench",lines:[]}},j="",Q="",he="",ee="",$e="",de=null,Ge="",Ne=!1,pe=null,Ae="graph",Qe="",Oe=null,Re=0,tt=!1;function z(_){_.traverse(C=>{var O,X;(O=C.geometry)==null||O.dispose();const N=Array.isArray(C.material)?C.material:C.material?[C.material]:[];for(const Y of N)q.has(Y)||((X=Y.map)==null||X.dispose(),Y.dispose())}),_.clear()}function me(_,C,N,O,X=32){return U(new qo(new ac(_),X,C,7,!1),N,O)}function we(_,C,N){U(new yt(.027,.027,.003,24),k.copper,_,C,.929,N),U(new yt(.018,.023,.008,24),k.solder,_,C,.934,N),U(new yt(.005,.005,.001,12),k.black,_,C,.939,N)}function Fe(_,C,N,O,X,Y,ne=0,Te="#dddcd4"){const Se=Je(512,256,O,X),ze=Se.context;return ze.fillStyle=Te,ze.textAlign="center",ze.font="600 76px monospace",je(ze,C,256,112,490),ze.font="48px monospace",je(ze,N,256,190,490),Se.texture.needsUpdate=!0,Se.object.rotation.x=-Math.PI/2,Se.object.position.set(0,Y,ne),_.add(Se.object),Se}const ge=["#171718","#65432b","#922a25","#bb6726","#d7c24c","#3d6542","#31516d","#725475","#797b79","#dddcd0"];function ce(_){const C=String(_).match(/([\d.]+)\s*(k|M)?/),N=C?Number(C[1])*(C[2]==="k"?1e3:C[2]==="M"?1e6:1):1e3,O=Math.floor(Math.log10(Math.max(N,.01)))-1,X=Math.round(N/10**O),Y=O===-1?"#ac9456":O===-2?"#aeb1ae":ge[Math.max(0,Math.min(9,O))];return[ge[Math.floor(X/10)],ge[X%10],Y,"#b09a60"]}function Ue(_){return _.type==="ground"?"GND":_.type==="C"?"C1":_.type==="L"?"L1":_.type==="opamp"?"U1":_.type==="switch"?"S1":_.type==="R"&&(_.label==="LOAD"||_.label==="BRANCH")?"RL":String(_.label).replace("DC SOURCE","DC SUPPLY").replace("REFERENCE","GND")}function at(_){return M.module==="thevenin"?{load:"load",req:"equivalentResistance"}[_.id]:M.module==="opamp"?{rin:"rin",rf:"rf"}[_.id]:M.module==="transient"&&_.id==="r"?"resistance":null}function Pt(_,C=Me){for(const O of _.targets)if(O.object.userData.direct=O,O.kind==="dial"){const X=new Tn(new Ai(.022,12,8),new qn({transparent:!0,opacity:0,depthWrite:!1}));X.userData.direct=O,O.object.add(X),O.pickSleeve=X}const N=_.dispose;return _.dispose=()=>{for(const O of _.targets)O.pickSleeve&&(O.pickSleeve.geometry.dispose(),O.pickSleeve.material.dispose(),O.pickSleeve.removeFromParent(),O.pickSleeve=null);N()},C.push(_),_}function At(_,C,N){return Pt(_,ie),_.group.scale.setScalar(1/.36),_.group.rotation.x=-.53,C.add(_.group),C.updateWorldMatrix(!0,!0),(_.anchors["+"]?[_.anchors["+"],_.anchors["−"]]:_.anchors.A?[_.anchors.A,_.anchors.B]:Object.values(_.anchors).slice(0,2)).forEach(X=>N.push(C.worldToLocal(X.getWorldPosition(new D)))),_.anchors.OUT&&N.length===1&&N.push(N[0].clone().add(new D(.007/.36,0,0))),_.update({...M,meterMode:L}),_}function Zn(_){var C;for(const N of ie)N.dispose();ie.length=0,z(_e),nt.clear(),wt.clear(),F=[],ue=[];for(const N of _){const O=new rn;O.position.set(N.x,.955,N.z),["V","I"].includes(N.type)&&O.position.set(Math.sign(N.x||-1)*2.15,.842,N.z),_e.add(O);const X=N.pins||[];X.length===2&&["R","L","C"].includes(N.type)&&(O.rotation.y=-Math.atan2(X[1].z-X[0].z,X[1].x-X[0].x));const Y=[];let ne=()=>{};switch(N.type){case"R":{const Ee=at(N);if(Ee){O.rotation.y=0;const vt=At(ax({id:N.id,label:Ue(N),parameter:Ee}),O,Y);ne=()=>vt.update(M);break}const se=[[.014,-.13],[.026,-.115],[.035,-.098],[.034,-.073],[.032,-.045],[.032,.045],[.034,.073],[.035,.098],[.026,.115],[.014,.13]],De=U(new uc(se.map(([vt,Ye])=>new xe(vt,Ye)),32),k.resistor,O,0,.046);De.rotation.z=Math.PI/2;const Ke=[];for(const[vt,Ye]of[-.079,-.035,.011,.085].entries()){const ot=vt===0||vt===3?.0354:.0328,Ve=U(new yt(ot,ot,.014,32),B(ce(N.value)[vt],{roughness:.74}),O,Ye,.046);Ve.rotation.z=Math.PI/2,Ke.push(Ve)}ne=vt=>ce(vt).forEach((Ye,ot)=>Ke[ot].material.color.set(Ye)),Y.push(new D(-.13,.046,0),new D(.13,.046,0));break}case"C":{const Ee=document.createElement("canvas");Ee.width=768,Ee.height=512;const se=Ee.getContext("2d");se.fillStyle="#202427",se.fillRect(0,0,768,512),se.fillStyle="#c6c9be",se.fillRect(145,0,110,512),se.fillStyle="#333835",se.font="bold 82px monospace",se.textAlign="center";for(const Ke of[105,245,385])se.fillText("−",200,Ke);se.fillStyle="#d2d4c8",se.font="bold 78px monospace",se.fillText("100µF",520,165),se.fillText("25V",520,285),se.font="48px monospace",se.fillText("105°C",520,391);const De=new Il(Ee);De.colorSpace=Mn,U(new yt(.07,.07,.166,48),B("#ffffff",{map:De,roughness:.67}),O,0,.094),U(new yt(.064,.064,.008,48),k.metal,O,0,.181),U(new $i(.065,.005,8,48),k.metal,O,0,.184).rotation.x=-Math.PI/2;for(const Ke of[Math.PI/4,-Math.PI/4]){const vt=U(new cn(.1,.0015,.003),k.navy,O,0,.186);vt.rotation.y=Ke}U(new yt(.061,.061,.013,32),k.black,O,0,.007),Y.push(new D(-.03,.003,0),new D(.03,.003,0));break}case"L":{U(new yt(.03,.03,.29,24),k.black,O,0,.06).rotation.z=Math.PI/2;for(const se of[-.145,.145])U(new yt(.058,.058,.015,32),k.black,O,se,.06).rotation.z=Math.PI/2;const Ee=[];for(let se=0;se<=560;se++){const De=se/560*Math.PI*28;Ee.push(new D(-.131+se/560*.262,.06+Math.sin(De)*.041,Math.cos(De)*.041))}me(Ee,.0077,k.copper,O,560),Y.push(new D(-.151,.052,0),new D(.151,.052,0));break}case"opamp":{const Ee=new Wh;Ee.moveTo(-.083,-.135),Ee.lineTo(-.027,-.135),Ee.absarc(0,-.135,.027,Math.PI,0,!0),Ee.lineTo(.083,-.135),Ee.lineTo(.083,.135),Ee.lineTo(-.083,.135),Ee.closePath();const se=U(new cc(Ee,{depth:.052,bevelEnabled:!0,bevelSegments:2,steps:1,bevelSize:.003,bevelThickness:.003}),k.black,O,0,.079);se.rotation.x=Math.PI/2;for(const Ke of[-.105,.105])for(const vt of[-.099,-.033,.033,.099]){U(new cn(.056,.009,.019),k.metal,O,Ke,.036,vt),U(new cn(.009,.052,.019),k.metal,O,Math.sign(Ke)*.133,.01,vt);const Ye=new D(Math.sign(Ke)*.133,-.02,vt).add(O.position);we(_e,Ye.x,Ye.z)}U(new yt(.009,.009,.001,16),B("#85877f"),O,-.052,.084,-.103),Fe(O,"OP AMP","DIP-8",.115,.143,.084,.024);const De={"op+":[-.133,-.016,.033],"op-":[-.133,-.016,-.033],out:[.133,-.016,.033],vp:[.133,-.016,-.033],vn:[-.133,-.016,.099]};X.forEach(Ke=>Y.push(new D(...De[Ke.id]||[0,0,0])));break}case"switch":{U($(.155,.056,.13,.004),k.black,O,0,.015),U(new cn(.167,.01,.143),k.metal,O,0,.049),U(new yt(.036,.036,.044,32),k.metal,O,0,.075),U(new yt(.049,.049,.017,6),k.metal,O,0,.074),U(new $i(.037,.003,6,32),k.navy,O,0,.092).rotation.x=-Math.PI/2;const Ee=new rn;Ee.position.y=.09,O.add(Ee),U(new yt(.011,.013,.125,20),k.metal,Ee,0,.06),U(new Ai(.014,20,12),k.metal,Ee,0,.123),ne=se=>{Ee.rotation.x=String(se).toUpperCase().includes("RETURN")?.39:-.39},ne(N.value),Y.push(new D(-.046,-.012,-.047),new D(.056,-.012,0),new D(-.046,-.012,.047));for(const se of Y)U(new cn(.022,.025,.011),k.brass,O,se.x,se.y,se.z);break}case"ground":{Y.push(new D(0,-.021,0));break}default:{let Ee="equivalentVoltage",se=null,De=1;M.module==="thevenin"?((C=M.parameters)==null?void 0:C.representation)==="original"?se=12:N.type==="I"&&(Ee="nortonCurrent"):M.module==="superposition"?(Ee=N.id==="a"?"v1":"v2",De=N.id==="b"?-1:1):M.module==="opamp"?Ee="rail":se=5;const Ke=N.id==="signal"?ox({id:N.id}):sx({id:N.id,label:Ue(N),parameter:Ee,fixedValue:se,polarity:De});At(Ke,O,Y),ne=()=>Ke.update(M);break}}const Te=pt(Ue(N),N.value,.5,.16),ze=X.length===2&&Math.abs(X[1].z-X[0].z)>Math.abs(X[1].x-X[0].x)?Math.max(...X.map(Ee=>Ee.z))+.22:N.z+(N.type==="switch"?.4:.22);if(Te.object.position.set(N.x,.933,ze),_e.add(Te.object),wt.set(N.id,{value:N.value,label:N.label,draw:(Ee,se)=>Te.draw(Ue(N),se),body:O,type:N.type,updateHardware:ne}),N.type!=="ground"){const Ee=["V","I"].includes(N.type)?[.46,.19,.34]:N.type==="C"?[.18,.23,.18]:N.type==="L"?[.35,.15,.17]:N.type==="opamp"?[.3,.12,.32]:N.type==="switch"?[.2,.23,.21]:[.3,.11,.12],se=new cn(...Ee),De=U(se,new qn({transparent:!0,opacity:0,depthWrite:!1}),O,0,Ee[1]/2-.025,0);De.castShadow=!1,De.receiveShadow=!1,De.userData={kind:"part",id:N.id,label:`${Ue(N)} · ${N.value}`,type:N.type},N.type==="switch"&&(De.userData.direct={object:De,kind:"switch",id:N.id,label:"Source / Return",action:"switch"});const Ke=new hp(new dp(se),new No({color:"#cfb862",transparent:!0,opacity:.85}));Ke.position.copy(De.position),Ke.visible=!1,O.add(Ke),wt.get(N.id).outline=Ke,wt.get(N.id).hit=De,ue.push(De)}for(const[Ee,se]of X.entries()){const Ke=(Y[Ee]||new D(0,0,0)).clone().applyAxisAngle(new D(0,1,0),O.rotation.y).add(O.position),vt=new D(se.x-Ke.x,0,se.z-Ke.z).normalize(),Ye=Ke.clone().addScaledVector(vt,["R","L"].includes(N.type)?.052:.014);if(Ye.y=.938,["V","I"].includes(N.type)){const St=new D(se.x,.995,se.z),qt=Ke.clone().lerp(St,.5);qt.y=Math.max(.95,qt.y),me([Ke,Ke.clone().lerp(qt,.3),qt,St],.008,Ee===0?k.red:k.black,_e,24)}else if(N.type!=="ground"){Ke.distanceTo(Ye)>.006&&me([Ke,Ke.clone().lerp(Ye,.55).add(new D(0,.006,0)),Ye],.006,k.metal,_e,14),we(_e,Ye.x,Ye.z);const St=new D(se.x,.929,se.z),qt=Ye.clone().lerp(St,.5);qt.y=.929,me([new D(Ye.x,.929,Ye.z),qt,St],.007,k.trace,_e,12)}const ot=["V","I","C"].includes(N.type)&&Ee===0||se.label==="5 V"||se.label==="V+";U(new yt(.044,.044,.006,6),k.metal,_e,se.x,.934,se.z),U(new yt(.037,.041,.017,32),ot?k.red:k.black,_e,se.x,.946,se.z),U(new yt(.032,.032,.028,32),ot?k.red:k.black,_e,se.x,.968,se.z);for(const St of[.956,.964,.972])U(new $i(.032,.0018,5,32),ot?k.red:k.navy,_e,se.x,St,se.z).rotation.x=-Math.PI/2;U(new $i(.018,.004,8,32),k.metal,_e,se.x,.984,se.z).rotation.x=-Math.PI/2,U(new yt(.014,.014,.005,24),k.black,_e,se.x,.982,se.z);const Ve=U(new $i(.054,.0035,6,32),B("#ece6bd",{roughness:.6}),_e,se.x,.928,se.z);Ve.rotation.x=-Math.PI/2,Ve.visible=!1;const Mt=U(new Ai(.068,12,8),new qn({transparent:!0,opacity:0,depthWrite:!1}),_e,se.x,.984,se.z);Mt.castShadow=!1,Mt.receiveShadow=!1,Mt.userData={kind:"terminal",id:se.id,label:`${Ue(N)} ${se.label||se.id}`},Mt.userData.direct={object:Mt,kind:"terminal",id:se.id,terminal:se.id,label:Mt.userData.label},F.push(Mt),nt.set(se.id,{x:se.x,z:se.z,ring:Ve,hit:Mt,red:ot,label:Mt.userData.label});const Jt=pt(se.label||se.id,"",.15,.063);Jt.object.position.set(se.x,.932,se.z+.086),_e.add(Jt.object)}}}function Vn(_,C){const Te=ut=>({x:Math.max(0,Math.min(79,Math.round((ut.x- -1.58)/.04))),z:Math.max(0,Math.min(46,Math.round((ut.z- -.92)/.04)))}),Se=Te(_),ze=Te(C),Ee=(ut,en)=>en*80+ut,se=Ee(Se.x,Se.z),De=Ee(ze.x,ze.z),Ke=M.components.filter(ut=>ut.type!=="ground").map(ut=>{var ke;let en=.1,tn=.1;if(["V","I"].includes(ut.type))en=.265,tn=.195;else if(ut.type==="R"||ut.type==="L"){const st=((ke=ut.pins)==null?void 0:ke.length)===2&&Math.abs(ut.pins[1].z-ut.pins[0].z)>Math.abs(ut.pins[1].x-ut.pins[0].x);en=st?.085:.19,tn=st?.19:.085}else ut.type==="opamp"?(en=.16,tn=.18):ut.type==="switch"&&(en=.12,tn=.1);return{cx:ut.x,cz:ut.z,x:en,z:tn}}),vt=(ut,en)=>{const tn=Ee(ut,en);if(tn===se||tn===De)return!1;const ke=-1.58+ut*.04,st=-.92+en*.04;return Ke.some(lt=>Math.abs(ke-lt.cx)<lt.x&&Math.abs(st-lt.cz)<lt.z)},Ye=[se],ot=new Map([[se,0]]),Ve=new Map,Mt=new Set,Jt=ut=>Math.hypot(ut%80-ze.x,Math.floor(ut/80)-ze.z);for(let ut=0;Ye.length&&ut<3760;ut++){let en=0;for(let lt=1;lt<Ye.length;lt++)ot.get(Ye[lt])+Jt(Ye[lt])<ot.get(Ye[en])+Jt(Ye[en])&&(en=lt);const tn=Ye.splice(en,1)[0];if(tn===De)break;Mt.add(tn);const ke=tn%80,st=Math.floor(tn/80);for(const[lt,Wt]of[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){const Gn=ke+lt,Tr=st+Wt;if(Gn<0||Gn>=80||Tr<0||Tr>=47||vt(Gn,Tr)||lt&&Wt&&(vt(ke+lt,st)||vt(ke,st+Wt)))continue;const ci=Ee(Gn,Tr),Dc=ot.get(tn)+(lt&&Wt?Math.SQRT2:1);Mt.has(ci)||ot.has(ci)&&ot.get(ci)<=Dc||(ot.set(ci,Dc),Ve.set(ci,tn),Ye.includes(ci)||Ye.push(ci))}}if(!Ve.has(De))return[_.clone(),_.clone().lerp(C,.5),C.clone()];const St=[];let qt=De;for(;qt!==se;)St.push(new D(-1.58+qt%80*.04,.953,-.92+Math.floor(qt/80)*.04)),qt=Ve.get(qt);St.push(new D(_.x,.953,_.z)),St.reverse();const Qt=[St[0]];for(let ut=1;ut<St.length-1;ut++){const en=St[ut].clone().sub(St[ut-1]).normalize(),tn=St[ut+1].clone().sub(St[ut]).normalize();en.distanceTo(tn)>.1&&Qt.push(St[ut])}if(Qt.push(St.at(-1)),Qt[0]=_.clone(),Qt[Qt.length-1]=C.clone(),Qt.length===2){const ut=_.clone().lerp(C,.5);ut.y=.953,Qt.splice(1,0,ut)}return Qt}function Ws(_){z(He),oe=[],re=[],_.forEach(([C,N],O)=>{const X=nt.get(C),Y=nt.get(N);if(!X||!Y)return;const ne=C==="gnd"||N==="gnd"||C.endsWith("-")||N.endsWith("-")||C==="return"||N==="return",Te=B(ne?"#202121":"#8b2925",{roughness:.79}),Se=new D(X.x,1.002,X.z),ze=new D(Y.x,1.002,Y.z),Ee=Vn(Se,ze);for(let Ke=1;Ke<Ee.length-1;Ke++)Ee[Ke].y=.948+O%3*.004;const se=me(Ee,.009,Te,He,Math.max(32,Ee.length*6));se.userData={kind:"wire",index:O};const De=me(Ee,.019,new qn({transparent:!0,opacity:0,depthWrite:!1}),He,Math.max(32,Ee.length*6));De.castShadow=!1,De.receiveShadow=!1,De.userData={kind:"wire",index:O,id:String(O),label:`${X.label} → ${Y.label}`,wire:se,color:Te.color.getHex()},oe.push(De);for(const[Ke,vt]of[Se,ze].entries()){const Ye=U(new yt(.023,.026,.055,24),Te,He,vt.x,1.012,vt.z),ot=U(new Ai(.037,12,8),new qn({transparent:!0,opacity:0,depthWrite:!1}),He,vt.x,1.03,vt.z),Ve={object:ot,kind:"plug",id:`wire:${O}:${Ke}`,resource:`wire:${[C,N].sort().join("|")}`,wireIndex:O,wirePair:[C,N],endpoint:Ke,terminal:Ke?N:C,from:Ke?C:N,label:`Pull ${Ke?Y.label:X.label} plug`,color:Te.color.getHex()};Ye.userData.direct=Ve,ot.userData.direct=Ve,re.push(ot,Ye);for(const Mt of[.988,.996,1.004])U(new $i(.023,.0018,6,24),Te,He,vt.x,Mt,vt.z).rotation.x=-Math.PI/2}})}function Hn(){return H.updateWorldMatrix(!0,!1),[...nt].map(([_,C])=>({id:_,position:H.localToWorld(new D(C.x,1.002,C.z))}))}function vi(_){var C;return((C=Hn().find(N=>N.id===_))==null?void 0:C.position)||null}function $s(_){var N,O,X;if(_==="red"||_==="black")return((N=M.probes)==null?void 0:N[_])||null;const C=_.slice(0,3);return((X=(O=M.scope)==null?void 0:O[C])==null?void 0:X[_.endsWith("Ground")?"ground":"signal"])||null}const _i=Pt(nx());_i.group.position.set(-.68,.823,-1.4),_i.group.rotation.x=-.56,it.add(_i.group);let jt=Pt(Qu({module:"thevenin"}));jt.group.position.set(.45,.823,-1.42),jt.group.rotation.x=-.32,it.add(jt.group);let Un=null;const yr=[["red","#b52e2b","Meter V",-.52],["black","#252829","Meter COM",-.35],["ch1","#d5b348","CH1",.1],["ch2","#64a5b5","CH2",.26],["ch1Ground","#a68e42","CH1 ground",.41],["ch2Ground","#477d8c","CH2 ground",.53]];for(const[_,C,N,O]of yr){const X=cx({id:`probe:${_}`,channel:_,color:C,label:N}),Y=new D(O,.831,-.345);X.group.position.copy(Y),X.group.rotation.x=-Math.PI/2;const ne=new Tn(new ic(.014,/Ground/.test(_)?.024:.12,4,8),new qn({transparent:!0,opacity:0,depthWrite:!1}));ne.position.y=/Ground/.test(_)?.027:.087,ne.userData.direct=X.targets[0],X.group.add(ne),X.targets[0].object=ne,X.targets[0].resource=`probe:${_}`;const Te=eh({color:C,radius:.0019});m.add(X.group,Te.group),fe.set(_,{unit:X,pick:ne,cable:Te,home:Y,connected:void 0,channel:_,color:C,loose:!1})}function qs(_=!1){for(const N of[...be])![...bt.holds.values()].some(X=>X.lead===N)&&N.originalPair&&M.wires.some(X=>X.includes(N.originalPair[0])&&X.includes(N.originalPair[1]))&&xt(N);const C=M.module||"thevenin";if(C!==rt){if(C.split(":")[0]!==rt.split(":")[0]){const N=Me.indexOf(jt);N>=0&&Me.splice(N,1),jt.dispose(),jt=Pt(M.module==="opamp"?rx():Qu({module:M.module||"thevenin"})),jt.group.position.set(.45,.823,-1.42),jt.group.rotation.x=-.32,it.add(jt.group)}rt=C,Un==null||Un.dispose(),Un=lx({module:M.module||"thevenin"}),Pt(Un,[]),Un.group.position.set(-.2,.823,-1.4),Un.group.rotation.x=-.42,it.add(Un.group)}for(const N of[...Me,...ie,Un].filter(Boolean))N.update({...M,meterMode:L});for(const N of fe.values()){const O=!N.channel.startsWith("ch")||M.module==="opamp";if(N.unit.group.visible=N.cable.group.visible=O,bt.isHeld(`probe:${N.channel}`))continue;const X=$s(N.channel);if(X!==N.connected||_){N.connected=X;const Y=vi(X);Y?(N.unit.group.position.copy(Y),N.unit.group.rotation.set(-.24,0,N.channel.includes("2")?-.28:.28),N.loose=!1):N.loose||(N.unit.group.position.copy(N.home),N.unit.group.rotation.set(-Math.PI/2,0,0))}}Mr()}function hs(_,C,N=0){const O=[_.clone()];for(const X of[.16,.34,.56,.78,.91]){const Y=_.clone().lerp(C,X),ne=Math.abs(Y.x)<.603&&Y.z>-1.14&&Y.z<-.39;Y.y=Math.max(ne?.87:.828,Y.y-Math.sin(Math.PI*X)*.11),Y.x+=Math.sin(Math.PI*X)*N,O.push(Y)}return O.push(C.clone()),O}function Mr(){for(const _ of fe.values()){if(!_.unit.group.visible)continue;const C=_.channel,N=C==="red"?_i.anchors.V:C==="black"?_i.anchors.COM:jt.anchors[C.startsWith("ch1")?"CH1":"CH2"],O=N==null?void 0:N.getWorldPosition(new D),X=_.unit.anchors.cable.getWorldPosition(new D);O&&_.cable.update(hs(O,X,C==="black"?-.08:.04))}for(const _ of be){const C=vi(_.from);if(!C){_.cable.group.visible=_.plug.visible=!1;continue}_.cable.update(hs(C,_.plug.position))}}const Sr=new hn;Sr.setAttribute("position",new jn(new Float32Array(48),3));const tr=new Dl(Sr,new qp({color:"#e9df9a",dashSize:.035,gapSize:.025,depthTest:!1}));tr.visible=!1,tr.renderOrder=8,H.add(tr);let ds=null;const Zo=new Ri(new D(0,1,0),-.88072);function Xs(){for(const[C,N]of nt){const O=C===M.selectedTerminal,X=(de==null?void 0:de.kind)==="terminal"&&de.id===C;N.ring.visible=O||X,N.ring.material.color.set(O?"#f4d973":"#e6eef5"),N.ring.scale.setScalar(O?1.27:1.12)}for(const[C,N]of wt)N.outline&&(N.outline.visible=M.selectedPart===C||(de==null?void 0:de.kind)==="part"&&de.id===C);for(const C of oe){const N=C.userData;N.wire.material.color.set((de==null?void 0:de.kind)==="wire"&&de.id===String(N.index)&&M.tool==="remove"?"#d57937":N.color)}const _=nt.get(M.selectedTerminal);if(tr.visible=!!_&&(M.tool||"wire")==="wire",_){const C=(de==null?void 0:de.kind)==="terminal"?nt.get(de.id):null,N=C?new D(C.x,1.013,C.z):ds?H.worldToLocal(ds.clone()):new D(_.x+.16,1.013,_.z+.16);N.y=Math.max(.988,Math.min(1.1,N.y));const O=new D(_.x,1.013,_.z),X=O.clone().lerp(N,.5);X.y+=.075;const Y=new lc(O,X,N),ne=Sr.attributes.position;for(let Te=0;Te<16;Te++){const Se=Y.getPoint(Te/15);ne.setXYZ(Te,Se.x,Se.y,Se.z)}ne.needsUpdate=!0,Sr.computeBoundingSphere(),tr.computeLineDistances()}}const A=new rn;A.visible=!1,m.add(A);function G(_,C,N,O,X=0){const Y=new rn;Y.position.set(C,N,O),Y.rotation.y=X,A.add(Y);const ne=U($(_.object.geometry.parameters.width+.045,_.object.geometry.parameters.height+.045,.042,.02),k.navy,Y,0,0,-.026);return ne.castShadow=!1,ne.receiveShadow=!1,_.object.castShadow=!1,_.object.receiveShadow=!1,Y.add(_.object),Y}const Z=Je(1024,1200,.9,1.055),K=Je(840,1280,.68,1.036),W=Je(1600,1008,1.62,1.02),ve=G(Z,-1.26,1.63,-1.07,.85),Ce=G(K,1.24,1.62,-1.02,-.88),Be=G(W,0,1.72,-1.8),Ie=[],et=[];let Ze=0;const Xe={object:W.object,kind:"screen",id:"large-graph",label:"Graph cursor",bounds:[]};function _t(_,C,N){const{context:O,canvas:X}=_;return O.fillStyle="#eff0ed",O.fillRect(0,0,X.width,X.height),O.fillStyle="#495a66",O.font="600 30px Arial, sans-serif",O.fillText(C,48,57),O.fillStyle="#193743",O.font="600 52px Arial, sans-serif",je(O,N,48,119,X.width-96),O}function Rt(){const _=_t(Z,"LAB GUIDE","Experiments");Ie.length=0;const C=(Y,ne,Te,Se,ze,Ee)=>{_.fillStyle="#fff",_.fillRect(Y,ne,Te,Se),_.strokeStyle="#a0aaa8",_.strokeRect(Y,ne,Te,Se),_.fillStyle="#273b42",_.font="600 40px Arial",_.textAlign="center",je(_,ze,Y+Te/2,ne+Se/2+10,Te-20),_.textAlign="left",Ie.push({x:Y,y:ne,w:Te,h:Se,action:Ee})};(M.actions||[]).filter(Y=>String(Y.group).toLowerCase()==="labs").forEach((Y,ne)=>C(42,148+ne*78,940,65,Y.label,()=>i(Y.id))),(M.actions||[]).filter(Y=>String(Y.group).toLowerCase()==="guide"||["undo","check-wiring"].includes(Y.id)).slice(0,4).forEach((Y,ne)=>C(42+ne%2*478,480+Math.floor(ne/2)*77,462,64,Y.label,()=>i(Y.id))),_.fillStyle="#273b42",_.font="40px Arial",(x.xr.isPresenting?["Grip: pick up probes and plugs.","Release at a terminal to connect.","Trigger: turn knobs or use switches.","Left stick: move. Right stick: turn.","Stick click: recenter at the bench."]:["Drag probes onto terminals.","Drag between terminals to wire.","Pull a plug out to disconnect it.","Drag knobs. Click switches.","Drag empty space to look around."]).forEach((Y,ne)=>_.fillText(Y,48,692+ne*55)),C(42,1010,458,64,"Recenter",()=>oa()),C(520,1010,462,64,x.xr.isPresenting?"Exit VR":"Close guide",()=>x.xr.isPresenting?void Ys.exit():Qo(!1)),Z.texture.needsUpdate=!0}Z.object.userData={kind:"panel",activate:_=>{var O;const C=_.uv.x*Z.canvas.width,N=(1-_.uv.y)*Z.canvas.height;(O=Ie.find(X=>C>=X.x&&C<=X.x+X.w&&N>=X.y&&N<=X.y+X.h))==null||O.action()}};function Vt(_){if(!Number.isFinite(Number(_))||_===null||_==="")return String(_??"—");const C=Number(_);return C!==0&&(Math.abs(C)>=1e5||Math.abs(C)<1e-4)?C.toExponential(2):Number(C.toPrecision(4)).toString()}function kt(){var ne,Te,Se;const _=K.context,C=K.canvas.width;_.fillStyle="#f9faf6",_.fillRect(0,0,C,1280),_.textAlign="left",_.textBaseline="alphabetic",_.fillStyle="#14211f",_.font="700 62px Arial",_.fillText("Live readings",48,88),_.fillStyle="#45524e",_.font="38px Arial";const N={thevenin:"Load circuit",superposition:"Selected sources",opamp:"Amplifier",transient:`${((ne=M.parameters)==null?void 0:ne.kind)||"RC"} circuit`};_.fillText(N[M.module]||"Circuit bench",48,139);const O=(M.metrics||[]).slice(0,3),X={Voltmeter:"Meter voltage","Voltage sample":"Voltage at input peak","Linear gain":"Gain"};O.forEach((ze,Ee)=>{const se=180+Ee*271;_.strokeStyle="#bdc8c2",_.lineWidth=2,_.beginPath(),_.moveTo(48,se-16),_.lineTo(C-48,se-16),_.stroke(),_.fillStyle="#34433e",_.font="600 47px Arial",je(_,X[ze.label]||ze.label,48,se+42,C-96);const De=Vt(ze.value),Ke=ze.unit||"";_.fillStyle="#101c18",_.font="700 142px Arial";const vt=C-206;let Ye=142;for(;_.measureText(De).width>vt&&Ye>86;)Ye-=4,_.font=`700 ${Ye}px Arial`;_.fillText(De,48,se+185);const ot=_.measureText(De).width;_.font="600 54px Arial",_.fillText(Ke,Math.min(C-151,48+ot+22),se+182),_.fillStyle="#4b5852",_.font="34px Arial";const Ve=ze.label==="Voltmeter"||ze.label==="Voltage sample"?ze.value==="—"?ze.detail||"Place both probes":"V tip − COM tip":ze.label==="Branch current"||ze.label==="Storage current"?"Current: top → ground":ze.label==="Load power"?"From load voltage × current":ze.label==="Linear gain"?"Output / input, before clipping":"";je(_,Ve,48,se+238,C-96)});const Y=M.measurement||{};Y.ok===!1?(_.fillStyle="#f4e6d6",_.fillRect(28,1012,C-56,236),_.fillStyle="#6b341b",_.font="700 43px Arial",_.fillText("Check connections",48,1066),_.font="37px Arial",ht(_,Y.error||"Complete the circuit to take a reading.",48,1121,C-96,47,3)):M.module==="transient"?(_.fillStyle="#243b32",_.font="600 44px Arial",_.fillText((Te=M.parameters)!=null&&Te.playing?"Running":"Paused",48,1076),_.font="700 75px Arial",_.fillText(`${Vt((((Se=M.parameters)==null?void 0:Se.time)||0)*1e3)} ms`,48,1172,C-96),_.font="34px Arial",_.fillText("Elapsed circuit time",48,1226)):M.module==="opamp"&&Y.clipped?(_.fillStyle="#f4e6d6",_.fillRect(28,1035,C-56,128),_.fillStyle="#6b341b",_.font="700 48px Arial",_.fillText("Output is clipping",48,1117)):(_.fillStyle="#46564c",_.font="37px Arial",_.fillText("Readings follow the circuit.",48,1096)),K.texture.needsUpdate=!0}K.object.userData={kind:"panel",activate:()=>!0};function Ut(_,C){return{voltage:"Voltage",current:"Current",energy:"Energy",ch1:"CH1",ch2:"CH2"}[_.id]||_.title||`Graph ${C+1}`}function qe(){var ut,en,tn;const _=W.context,C=1600,N=1008,O=M.graph||{},X=(ut=O.panels)!=null&&ut.length?O.panels:[O];Ze=Math.max(0,Math.min(Ze,X.length-1));const Y=X[Ze]||O;_.fillStyle="#fafbf8",_.fillRect(0,0,C,N),_.textAlign="left",_.textBaseline="alphabetic",et.length=0,_.fillStyle="#172720",_.font="700 53px Arial";const ne=Ae==="schematic"?"Circuit schematic":{thevenin:"Load power",superposition:"Source contributions",opamp:"Oscilloscope",transient:`${((en=M.parameters)==null?void 0:en.kind)||"RC"} response`}[M.module]||"Circuit graph";_.fillText(ne,48,89);const Te=(ke,st,lt,Wt,Gn,Tr,ci=!1)=>{_.fillStyle=ci?"#263e34":"#e4ebe5",_.fillRect(ke,st,lt,Wt),_.fillStyle=ci?"#fff":"#22392c",_.font="600 39px Arial",_.textAlign="center",je(_,Gn,ke+lt/2,st+Wt/2+14,lt-24),_.textAlign="left",et.push({x:ke,y:st,w:lt,h:Wt,action:Tr})};if(Te(1110,35,180,68,"Graph",()=>{Ae="graph",qe()},Ae==="graph"),Te(1310,35,242,68,"Schematic",()=>{Ae="schematic",qe()},Ae==="schematic"),Ae==="schematic"){if(Xe.bounds=[],Oe){const ke={x:30,y:135,w:1540,h:840},st=Math.min(ke.w/Oe.width,ke.h/Oe.height),lt=Oe.width*st,Wt=Oe.height*st;_.drawImage(Oe,ke.x+(ke.w-lt)/2,ke.y+(ke.h-Wt)/2,lt,Wt)}else _.fillStyle="#44564a",_.font="46px Arial",_.fillText("Circuit reference is loading.",48,246);W.texture.needsUpdate=!0;return}if(X.length>1){const ke=(1504-14*(X.length-1))/X.length;X.forEach((st,lt)=>Te(48+lt*(ke+14),141,ke,70,Ut(st,lt),()=>{var Wt;Ze=lt,(Wt=jt.selectPanel)==null||Wt.call(jt,lt),qe()},lt===Ze))}else _.fillStyle="#43544a",_.font="39px Arial",je(_,O.subtitle||"Current circuit values",48,185,C-96);const Se=182,ze=1534,Ee=280,se=720,De=ke=>Se+ke*(ze-Se),Ke=ke=>se-ke*(se-Ee);Xe.bounds=[{left:Se/C,top:Ee/N,width:(ze-Se)/C,height:(se-Ee)/N,panel:Ze}],_.fillStyle="#263b2e",_.font="600 43px Arial",je(_,Y.yLabel||"Response",Se,256,ze-Se);const vt=Y.xDivisions||O.xDivisions||4,Ye=Y.yDivisions||O.yDivisions||4;_.strokeStyle="#c9d3cc",_.lineWidth=1.8;for(let ke=0;ke<=vt;ke++){const st=De(ke/vt);_.beginPath(),_.moveTo(st,Ee),_.lineTo(st,se),_.stroke()}for(let ke=0;ke<=Ye;ke++){const st=Ke(ke/Ye);_.beginPath(),_.moveTo(Se,st),_.lineTo(ze,st),_.stroke()}_.strokeStyle="#607166",_.lineWidth=2.5,_.strokeRect(Se,Ee,ze-Se,se-Ee),_.save(),_.beginPath(),_.rect(Se-3,Ee-3,ze-Se+6,se-Ee+6),_.clip();const ot=Y.series||[];for(const ke of ot){_.strokeStyle=ke.color||"#147587",_.lineWidth=6,_.lineJoin="round",_.lineCap="round",_.beginPath();let st=!1;for(const[lt,Wt]of ke.points||[]){if(!Number.isFinite(lt)||!Number.isFinite(Wt)){st=!1;continue}st?_.lineTo(De(lt),Ke(Wt)):_.moveTo(De(lt),Ke(Wt)),st=!0}_.stroke(),((tn=ke.points)==null?void 0:tn.length)===1&&(_.beginPath(),_.arc(De(ke.points[0][0]),Ke(ke.points[0][1]),6,0,Math.PI*2),_.fillStyle=ke.color||"#147587",_.fill())}if(Y.reference&&Number.isFinite(Y.reference.x)){const ke=De(Y.reference.x);_.strokeStyle="#805528",_.lineWidth=3,_.setLineDash([12,9]),_.beginPath(),_.moveTo(ke,Ee),_.lineTo(ke,se),_.stroke(),_.setLineDash([]),_.fillStyle="#654117",_.font="600 37px Arial",_.fillText(Y.reference.label||"",Math.max(Se+10,Math.min(ke+14,ze-105)),Ee+47)}const Ve=Y.cursor||O.cursor;if(Ve&&Number.isFinite(Ve.x)){const ke=De(Ve.x);_.strokeStyle="#263e34",_.lineWidth=3,_.setLineDash([8,7]),_.beginPath(),_.moveTo(ke,Ee),_.lineTo(ke,se),_.stroke(),_.setLineDash([])}Y.marker&&Number.isFinite(Y.marker.x)&&Number.isFinite(Y.marker.y)&&(_.beginPath(),_.arc(De(Y.marker.x),Ke(Y.marker.y),9,0,Math.PI*2),_.fillStyle="#fff",_.fill(),_.lineWidth=5,_.strokeStyle="#83432b",_.stroke()),_.restore(),_.fillStyle="#283d31",_.font="600 40px Arial";const Mt=ke=>{const st=(ke||[]).filter(Wt=>Number.isFinite(Wt.position));if(st.length<=3)return st;const lt=st.reduce((Wt,Gn)=>Math.abs(Gn.position-.5)<Math.abs(Wt.position-.5)?Gn:Wt,st[0]);return[...new Set([st[0],lt,st.at(-1)])]},Jt=Mt(Y.xTicks);_.textAlign="center",Jt.forEach((ke,st)=>{Jt.length>6&&st!==0&&st!==Jt.length-1&&st%2||je(_,String(ke.label),De(ke.position),772,Math.min(260,(ze-Se)/Math.max(3,Jt.length-1)))}),_.textAlign="right";const St=Mt(Y.yTicks);St.forEach((ke,st)=>{St.length>5&&st!==0&&st!==St.length-1&&st%2||je(_,String(ke.label),Se-20,Ke(ke.position)+13,149)}),_.textAlign="center",_.font="600 42px Arial",je(_,Y.xLabel||O.xLabel||"Time",(Se+ze)/2,827,ze-Se),_.textAlign="left",_.fillStyle="#e5ede6",_.fillRect(30,862,1540,120);const qt=new Set(ot.map(ke=>ke.name).filter(Boolean)),Qt=((Ve==null?void 0:Ve.readings)||[]).filter(ke=>!qt.size||qt.has(ke.name));if(Ve&&(Ve.xLabel||Qt.length)){const ke=[{label:"Cursor",value:Ve.xLabel||"—"},...Qt.map(lt=>({label:lt.name,value:`${Vt(lt.value)} ${lt.unit||""}`}))],st=1500/Math.max(1,ke.length);ke.forEach((lt,Wt)=>{const Gn=50+Wt*st;_.fillStyle="#3f5447",_.font="32px Arial",je(_,lt.label,Gn,904,st-22),_.fillStyle="#13271b",_.font="700 53px Arial",je(_,lt.value,Gn,963,st-22)})}else{_.fillStyle="#2b4234",_.font="600 43px Arial";const ke=!ot.some(st=>{var lt;return(lt=st.points)==null?void 0:lt.length});je(_,ke?Y.subtitle||O.subtitle||"Connect the circuit to acquire a trace.":"Point at the graph and hold the trigger to inspect a reading.",52,936,1496)}W.texture.needsUpdate=!0}W.object.userData={kind:"panel",direct:Xe,activate:_=>{const C=_.uv.x*1600,N=(1-_.uv.y)*1008,O=et.find(Y=>C>=Y.x&&C<=Y.x+Y.w&&N>=Y.y&&N<=Y.y+Y.h);if(O)return O.action(),!0;const X=Xe.bounds[0];return Ae!=="graph"||!X||C<X.left*1600||C>(X.left+X.width)*1600||N<X.top*1008||N>(X.top+X.height)*1008}};function Gt(_,C){var Te;const N=eh({color:_.color||"#862926",radius:.0038}),O=new rn;U(new yt(.009,.011,.038,20),B(_.color||"#862926"),O,0,.015,0),U(new yt(.003,.003,.013,16),k.metal,O,0,-.009,0);const X=U(new Ai(.023,12,8),new qn({transparent:!0,opacity:0,depthWrite:!1}),O,0,.013,0);O.position.copy(C);const Y={from:_.from||_.terminal,cable:N,plug:O,originalPair:((Te=_.wirePair)==null?void 0:Te.slice())||null},ne={object:X,kind:"plug",id:`loose:${Math.random().toString(36).slice(2)}`,from:Y.from,label:"Grab loose plug",lead:Y,color:_.color};return X.userData.direct=ne,Y.target=ne,m.add(O,N.group),be.add(Y),Y}function xt(_){_&&(be.delete(_),_.cable.dispose(),z(_.plug),_.plug.removeFromParent())}const bt=K_({getModel:()=>{var _;return{...M,parameters:{...M.parameters,meterMode:L,timeCursor:(_=M.parameters)==null?void 0:_.time}}},getTerminals:Hn,onProbe:u,onConnect:h,onDisconnect:d,onGraphCursor:g,onChange:(_,C)=>{var N;_==="meterMode"?(L=C,_i.update({...M,meterMode:L}),c(_,C)):_==="timeCursor"?i(`scrub:${Math.min(C,((N=M.parameters)==null?void 0:N.acquiredTime)||0)*1e3}`):c(_,C)},onAction:_=>{var C;if(String(_).startsWith("recorder-panel:")){const N=Number(String(_).split(":")[1]);Number.isInteger(N)&&N>=0&&((C=jt.selectPanel)==null||C.call(jt,N),Ze=N,qe())}else i(_)},onHold:(_,C,N)=>{var X,Y;const O=C.target;if(_==="start")if(["probe","plug","terminal"].includes(O.kind)&&v("begin",C),O.kind==="probe"){const ne=fe.get(O.channel);ne&&(ne.loose=!0,C.probe=ne,C.position=ne.unit.group.position.clone())}else(O.kind==="terminal"||O.kind==="plug")&&(C.lead=O.lead||Gt(O,C.position||vi(O.terminal)));if(_==="move"&&(C.probe&&C.position&&(C.probe.unit.group.position.copy(C.position),C.quaternion?C.probe.unit.group.quaternion.copy(C.quaternion):C.probe.unit.group.rotation.set(-.25,0,.18)),C.lead&&C.position&&C.lead.plug.position.copy(C.position),x.shadowMap.needsUpdate=!0),_==="end"){if(C.probe){const ne=C.probe;ne.connected=N.terminal;const Te=vi(N.terminal);Te?(ne.unit.group.position.copy(Te),ne.unit.group.rotation.set(-.24,0,.25),ne.loose=!1):(ne.unit.group.position.set(_n.clamp(((X=C.position)==null?void 0:X.x)??ne.home.x,-.88,.88),.87,_n.clamp(((Y=C.position)==null?void 0:Y.z)??ne.home.z,-1.2,-.34)),ne.unit.group.rotation.set(-Math.PI/2,0,0),ne.loose=!0)}C.lead&&(N.kind==="connected"||N.kind==="cancelled"||O.kind==="terminal"?xt(C.lead):(C.lead.plug.position.y=.87,C.lead.plug.position.x=_n.clamp(C.lead.plug.position.x,-.58,.58),C.lead.plug.position.z=_n.clamp(C.lead.plug.position.z,-1.1,-.41))),["probe","plug","terminal"].includes(O.kind)&&v("end",C),x.shadowMap.needsUpdate=!0}}});function xi(_){var Te,Se,ze,Ee,se,De,Ke,vt;_.module&&_.module!==M.module&&(Ze=0),(Te=_.live)!=null&&Te.title&&(_.live.title,(Se=M.live)==null||Se.title),_.selectedPart&&(_.selectedPart,M.selectedPart),M={...M,..._};const C=JSON.stringify(M.components.map(({value:Ye,...ot})=>ot));let N=!1;if(C!==j){j=C,bt.cancelAll();for(const Ye of[...be])xt(Ye);Zn(M.components),N=!0,x.shadowMap.needsUpdate=!0}for(const Ye of M.components){const ot=wt.get(Ye.id);ot&&ot.value!==Ye.value&&(ot.draw(Ye.label,Ye.value),ot.value=Ye.value,(ze=ot.updateHardware)==null||ze.call(ot,Ye.value),ot.hit&&(ot.hit.userData.label=`${Ue(Ye)} · ${Ye.value}`),x.shadowMap.needsUpdate=!0)}const O=JSON.stringify(M.wires);(N||O!==Q)&&(Q=O,Ws(M.wires),x.shadowMap.needsUpdate=!0),Xs(),qs(N);const X=JSON.stringify([M.module,M.metrics,(Ee=M.measurement)==null?void 0:Ee.ok,(se=M.measurement)==null?void 0:se.error,(De=M.measurement)==null?void 0:De.clipped,(Ke=M.parameters)==null?void 0:Ke.time,(vt=M.parameters)==null?void 0:vt.playing]);X!==he&&(he=X,kt());const Y=JSON.stringify([M.actions,M.tool,M.selectedTerminal,M.selectedPart,M.partActions]);Y!==ee&&(ee=Y,Rt());const ne=JSON.stringify(M.graph);if(ne!==$e&&($e=ne,qe()),M.schematicDataURL!==void 0&&M.schematicDataURL!==Qe){Qe=M.schematicDataURL,Oe=null;const Ye=++Re;if(/^data:image\/(svg\+xml|png|jpeg|webp)[;,]/.test(Qe||"")){const ot=new Image;ot.onload=()=>{!tt&&Ye===Re&&(Oe=ot,qe())},ot.onerror=()=>{!tt&&Ye===Re&&qe()},ot.src=Qe}qe()}}const Zt=new Kp,Oi=new xe;let mt=null;function wn(_){for(let C=_;C;C=C.parent)if(!C.visible)return!1;return!0}function vn(_){for(let C=_;C;C=C.parent){const N=C.userData.direct||C.userData.equipmentTarget;if(N)return N}return null}function pn(){const _=[...Me,...ie,Un].filter(Boolean).map(O=>O.group),C=[...fe.values()].map(O=>O.unit.group),N=[...be].map(O=>O.plug);return[...F,...ue,...oe,...re,..._,...C,...N,...A.visible?[Z.object,K.object,W.object]:[]]}function on(){const _=Zt.intersectObjects(pn(),!0).filter(O=>wn(O.object)&&(vn(O.object)||O.object.userData.kind));for(const O of _)O.direct=vn(O.object);const C=_[0];return _.find(O=>{var X;return["probe","plug","dial","button","screen","switch"].includes((X=O.direct)==null?void 0:X.kind)&&O.distance<((C==null?void 0:C.distance)??1/0)+.065})||C}function Kn(_,C=null){var Y;const N=(_==null?void 0:_.direct)||(_==null?void 0:_.object.userData),O=N&&["terminal","part","wire","probe","plug","dial","button","switch","screen"].includes(N.kind)?{kind:N.kind,id:N.id??String(N.index),label:N.label||N.id}:null,X=JSON.stringify([O,M.tool,M.selectedTerminal]);de=O,ds=((Y=_==null?void 0:_.point)==null?void 0:Y.clone())||(C==null?void 0:C.clone())||null,X!==Ge&&(Ge=X,s(x.xr.isPresenting?null:O)),Xs()}function Jn(_){const C=x.domElement.getBoundingClientRect();Oi.set((_.clientX-C.left)/C.width*2-1,-(_.clientY-C.top)/C.height*2+1),Zt.setFromCamera(Oi,p)}function Ko(_,C){if(!(_!=null&&_.uv))return{};const N=_.uv.x,O=1-_.uv.y,X=C.bounds||[];let Y=X.find(ne=>O>=ne.top&&O<=ne.top+ne.height);return Y||(Y=X[0]||{left:0,width:1,panel:0}),{fraction:_n.clamp((N-Y.left)/Y.width,0,1),panelIndex:Y.panel||0}}function Jo(){return Zt.ray.intersectPlane(Zo,new D)}function _c(_,C,N={}){var Y,ne,Te;if(!C||C.object.userData.kind==="panel"&&C.object.userData.activate(C)!==!1)return!1;const O=C.direct||vn(C.object);if(!O||O.kind==="probe"&&!((Y=fe.get(O.channel))!=null&&Y.unit.group.visible))return!1;O.kind==="dial"&&(O.resource=`parameter:${O.parameter}`),O.kind==="plug"&&O.wirePair&&(O.wireIndex=M.wires.findIndex(Se=>Se.includes(O.wirePair[0])&&Se.includes(O.wirePair[1]))),O.parameter==="timeCursor"&&(O.max=((ne=M.parameters)==null?void 0:ne.acquiredTime)||0,O.min=0,O.step=Math.max(O.max/100,1e-6));const X=O.kind==="probe"?(Te=fe.get(O.channel))==null?void 0:Te.unit.group.position:O.kind==="terminal"?vi(O.terminal):C.point;return bt.begin(_,O,{position:X,...Ko(C,O),...N})}function xc(_){if(_.button!==0||x.xr.isPresenting)return;bt.release("mouse"),Jn(_);const C=on();mt={x:_.clientX,y:_.clientY,lastX:_.clientX,lastY:_.clientY,time:performance.now(),hit:C},(C!=null&&C.direct||(C==null?void 0:C.object.userData.kind)==="panel")&&(y.enabled=!1,x.domElement.setPointerCapture(_.pointerId),_c("mouse",C),_.stopImmediatePropagation(),_.preventDefault())}function bc(_){var O,X;if(x.xr.isPresenting)return;Jn(_);const C=bt.hold("mouse"),N=on();if(C){const Y={position:Jo()};if(C.target.kind==="dial"&&(Y.turn=(_.clientX-mt.lastX-(_.clientY-mt.lastY))*.024),C.target.kind==="screen"){const Se=Zt.intersectObject(C.target.object,!0)[0];Object.assign(Y,Ko(Se,C.target))}bt.move("mouse",Y),mt&&(mt.lastX=_.clientX,mt.lastY=_.clientY);const ne=["probe","terminal","plug"].includes(C.target.kind)?kl(C.position,Hn(),.055):null,Te=ne?{object:nt.get(ne.id).hit,direct:nt.get(ne.id).hit.userData.direct,point:ne.position}:N;Kn(Te,Y.position),Mr()}else mt||(x.domElement.style.cursor=((O=N==null?void 0:N.direct)==null?void 0:O.kind)==="dial"?"ns-resize":((X=N==null?void 0:N.direct)==null?void 0:X.kind)==="screen"?"crosshair":"grab",Kn(N,Jo()))}function yc(_){var C;if(!mt){bt.release("mouse");return}Jn(_),bt.hold("mouse")?bt.end("mouse",{position:Jo()}):Math.hypot(_.clientX-mt.x,_.clientY-mt.y)<5&&((C=mt.hit)==null?void 0:C.object.userData.kind)==="part"&&r(mt.hit.object.userData.id),mt=null,bt.release("mouse"),y.enabled=!0,x.domElement.hasPointerCapture(_.pointerId)&&x.domElement.releasePointerCapture(_.pointerId),Mr()}function Mc(){bt.hold("mouse")&&bt.block("mouse"),mt=null,y.enabled=!x.xr.isPresenting,Kn(null)}const Sc=()=>{mt||Kn(null)};x.domElement.addEventListener("pointerdown",xc,!0),x.domElement.addEventListener("pointermove",bc),x.domElement.addEventListener("pointerup",yc),x.domElement.addEventListener("pointercancel",Mc),x.domElement.addEventListener("pointerleave",Sc);function Ec(){A.updateWorldMatrix(!0,!0);const _=new as().setFromObject(A),C=_.getCenter(new D),N=[];for(const Y of[_.min.x,_.max.x])for(const ne of[_.min.y,_.max.y])for(const Te of[_.min.z,_.max.z])N.push(new D(Y,ne,Te));const O=new D(0,.12,1).normalize();let X=4;for(let Y=0;Y<9;Y++){p.position.copy(C).addScaledVector(O,X),p.lookAt(C),p.updateMatrixWorld();const ne=N.map(De=>De.clone().project(p)),Te=Math.min(...ne.map(De=>De.x)),Se=Math.max(...ne.map(De=>De.x)),ze=Math.min(...ne.map(De=>De.y)),Ee=Math.max(...ne.map(De=>De.y)),se=X*Math.tan(_n.degToRad(p.fov/2));C.addScaledVector(new D().setFromMatrixColumn(p.matrixWorld,0),(Te+Se)*.5*se*p.aspect),C.addScaledVector(new D().setFromMatrixColumn(p.matrixWorld,1),(ze+Ee)*.5*se),X=Math.max(y.minDistance,X*Math.max(.75,Math.min(1.35,Math.max((Se-Te)/1.78,(Ee-ze)/1.78))))}y.target.copy(C),p.position.copy(C).addScaledVector(O,X),p.lookAt(C),y.update()}function Qo(_){if(x.xr.isPresenting||tt)return;_=!!_;const C=_!==Ne;_&&!Ne&&(pe={position:p.position.clone(),quaternion:p.quaternion.clone(),target:y.target.clone()}),Ne=_,A.visible=_,x.shadowMap.needsUpdate=!0,_?(sa(1.6),Ec()):pe&&(p.position.copy(pe.position),p.quaternion.copy(pe.quaternion),y.target.copy(pe.target),y.update(),pe=null),Kn(null),Rt(),C&&o(_)}const Er=[],Tc=new Ht,wc=ex({obstacles:[{minX:-1.07,maxX:1.07,minZ:-1.7,maxZ:-.27}],bounds:{minX:-3.1,maxX:3.1,minZ:-4.6,maxZ:2.4}});let Qn=!1,ea=0,An=null;function bi(){bt.cancelAll(),wc.reset(),mt=null;for(const _ of Er)_.armed=!1,_.lastQuaternion=null,_.stickPressed=!1;y.enabled=!x.xr.isPresenting}function fs(){Qn=document.visibilityState==="hidden"||!!(An!=null&&An.visibilityState)&&An.visibilityState!=="visible",bi()}const Ac=()=>{x.xr.isPresenting||(Qn=!0,bi())},Rc=()=>{x.xr.isPresenting||(Qn=!1,bi())};window.addEventListener("blur",Ac),window.addEventListener("focus",Rc),document.addEventListener("visibilitychange",fs);function ta(_){_.controller.updateWorldMatrix(!0,!1),Tc.extractRotation(_.controller.matrixWorld),Zt.ray.origin.setFromMatrixPosition(_.controller.matrixWorld),Zt.ray.direction.set(0,0,-1).applyMatrix4(Tc)}function na(_,C){var Se;const N=_.grip.getWorldQuaternion(new On),O=_.grip.getWorldPosition(new D),X=new D(0,0,-1).applyQuaternion(N),Y=O.addScaledVector(X,((Se=C==null?void 0:C.probe)==null?void 0:Se.unit.length)||.08),ne=N.clone().multiply(new On().setFromAxisAngle(new D(1,0,0),Math.PI/2)),Te={position:Y,quaternion:ne};if((C==null?void 0:C.target.kind)==="dial"){const ze=new D(...C.target.axis==="y"?[0,1,0]:C.target.axis==="x"?[1,0,0]:[0,0,1]).applyQuaternion(C.target.object.getWorldQuaternion(new On));Te.turn=_.lastQuaternion?-Z_(N.clone().multiply(_.lastQuaternion.clone().invert()),ze):0}return(C==null?void 0:C.target.kind)==="screen"&&(ta(_),Object.assign(Te,Ko(Zt.intersectObject(C.target.object,!0)[0],C.target))),_.lastQuaternion=N,Te}function Cc(_,C){if(!_.armed||Qn||!x.xr.isPresenting||bt.hold(_.id))return;ta(_);let N=on();if(C==="grip"){const O=_.grip.getWorldPosition(new D),X=pn().flatMap(Y=>{const ne=[];return Y.traverse(Te=>{const Se=vn(Te);Se&&["probe","plug","dial","terminal","button","switch"].includes(Se.kind)&&wn(Te)&&ne.push({node:Te,target:Se,point:Te.getWorldPosition(new D)})}),ne}).sort((Y,ne)=>Y.point.distanceTo(O)-ne.point.distanceTo(O));if(!X.length||X[0].point.distanceTo(O)>.12)return;N={object:X[0].node,direct:X[0].target,point:X[0].point}}if(_.button=C,_.lastQuaternion=_.grip.getWorldQuaternion(new On),_c(_.id,N)){const O=bt.hold(_.id);O&&["probe","plug","terminal"].includes(O.target.kind)&&bt.move(_.id,na(_,O))}}function Pc(_,C){if(_.button===C){const N=bt.hold(_.id);N&&bt.end(_.id,na(_,N)),_.button=null,_.lastQuaternion=null}bt.release(_.id)}for(let _=0;_<2;_++){const C=x.xr.getController(_),N=x.xr.getControllerGrip(_),O=new Dl(new hn().setFromPoints([new D,new D(0,0,-1)]),new No({color:"#bbc8c8",transparent:!0,opacity:.55}));C.add(O),O.scale.z=2;const X=new Tn(new Ai(.007,12,8),new qn({color:"#d7c98b",depthTest:!1}));X.visible=!1,m.add(X);const Y={id:`controller:${_}`,controller:C,grip:N,ray:O,cursor:X,source:null,armed:!1,button:null,stickPressed:!1,lastQuaternion:null};C.addEventListener("connected",Te=>{Y.source=Te.data,Y.armed=!1,C.visible=!0}),C.addEventListener("disconnected",()=>{bt.block(Y.id),Y.source=null,Y.armed=!1,C.visible=!1,X.visible=!1}),C.addEventListener("selectstart",()=>Cc(Y,"trigger")),C.addEventListener("selectend",()=>Pc(Y,"trigger")),C.addEventListener("squeezestart",()=>Cc(Y,"grip")),C.addEventListener("squeezeend",()=>Pc(Y,"grip"));const ne=U($(.037,.075,.045,.013),k.navy,N,0,-.017,.015);ne.rotation.x=-.35,U(new Ai(.022,12,8),k.teal,N,0,.019,-.012),b.add(C,N),Er.push(Y)}let ia=null,ps=!1,ra=!0;function sa(_){const C=new D(0,_,0);Be.position.set(0,Math.max(1.66,_+.12),-1.8),Ce.position.set(1.24,Math.max(1.61,_-.01),-1.02),ve.position.set(-1.26,Math.max(1.63,_+.01),-1.07),Be.lookAt(C),Ce.lookAt(C),ve.lookAt(C)}function oa(){return x.xr.isPresenting?(bi(),ps=!0,!0):!1}const Ys=hx({xrManager:x.xr,navigatorXR:()=>navigator.xr,isSecureContext:()=>window.isSecureContext,visibilityTarget:document,onStatus:a,onBeforeSession:({floorReference:_})=>{bi(),ia=dx(p,y),ra=_,y.enabled=!1,b.position.set(0,_?0:1.6,0),b.quaternion.identity(),p.position.set(0,0,0),p.quaternion.identity()},onSessionStarted:({session:_})=>{An=_,Qn=!1,An==null||An.addEventListener("visibilitychange",fs),bi(),V.visible=!1,ae.visible=!0,A.visible=!0,s(null),ps=!0,x.shadowMap.needsUpdate=!0,Rt()},onSessionEnded:()=>{bi(),An==null||An.removeEventListener("visibilitychange",fs),An=null,Qn=!1,ps=!1,V.visible=!1,ae.visible=!0,A.visible=Ne,fx(p,y,b,ia),ia=null;for(const _ of Er)_.cursor.visible=!1,_.stickPressed=!1;Kn(null),sa(1.6),x.shadowMap.needsUpdate=!0,aa(),Rt()}});function dd(){return tt?Promise.resolve(!1):(Ne&&Qo(!1),Ys.toggle())}function fd(){return Ys.refreshSupport()}function aa(){if(x.xr.isPresenting||tt)return;const _=Math.max(1,n.clientWidth),C=Math.max(1,n.clientHeight);p.aspect=_/C,p.updateProjectionMatrix(),x.setSize(_,C,!1),Ne?Ec():(!R||Math.abs(p.aspect/R-1)>.12)&&P()}const Lc=new ResizeObserver(aa);Lc.observe(n),aa(),xi(M),x.setAnimationLoop(_=>{var C,N,O,X,Y,ne,Te,Se;if(!tt&&(l(_),!tt)){if(x.xr.isPresenting){if(ps){const Ve=x.xr.getFrame(),Mt=x.xr.getReferenceSpace(),Jt=Ve&&Mt?Ve.getViewerPose(Mt):null;Jt&&px(b,Jt,{floorReference:ra,eyeHeight:1.6})&&(sa(ra?Jt.transform.position.y:1.6),ps=!1)}const ze=x.xr.getCamera(),Ee=ze.getWorldPosition(new D),se=ze.getWorldQuaternion(new On),De=(N=(C=Er.find(Ve=>{var Mt;return((Mt=Ve.source)==null?void 0:Mt.handedness)==="left"}))==null?void 0:C.source)==null?void 0:N.gamepad,Ke=(X=(O=Er.find(Ve=>{var Mt;return((Mt=Ve.source)==null?void 0:Mt.handedness)==="right"}))==null?void 0:O.source)==null?void 0:X.gamepad,vt=Ve=>{var Mt,Jt,St;return((Mt=Ve==null?void 0:Ve.axes)==null?void 0:Mt.length)>=4?[Ve.axes[2],Ve.axes[3]]:[((Jt=Ve==null?void 0:Ve.axes)==null?void 0:Jt[0])||0,((St=Ve==null?void 0:Ve.axes)==null?void 0:St[1])||0]};wc.update({rig:b,headPosition:Ee,headQuaternion:se,left:vt(De),right:vt(Ke)[0],dt:ea?(_-ea)/1e3:0,enabled:!Qn});let Ye=null,ot=null;for(const Ve of Er){const Mt=(Y=Ve.source)==null?void 0:Y.gamepad;!Qn&&!Ve.armed&&Mt&&!((ne=Mt.buttons[0])!=null&&ne.pressed)&&!((Te=Mt.buttons[1])!=null&&Te.pressed)&&(Ve.armed=!0,bt.release(Ve.id));const Jt=Ve.armed&&!!((Se=Mt==null?void 0:Mt.buttons[3])!=null&&Se.pressed);Jt&&!Ve.stickPressed&&oa(),Ve.stickPressed=Jt,ta(Ve);const St=!Qn&&Ve.controller.visible?on():null;Ve.ray.visible=!Qn,Ve.ray.scale.z=St?St.distance:2;const qt=bt.hold(Ve.id);qt&&!Qn&&bt.move(Ve.id,na(Ve,qt));const Qt=qt&&["probe","terminal","plug"].includes(qt.target.kind)?kl(qt.position,Hn(),.055):null;Ve.cursor.visible=!!St||!!Qt,Qt?(Ve.cursor.position.copy(Qt.position),Ve.cursor.material.color.set("#88c39e")):St&&(Ve.cursor.position.copy(St.point),Ve.cursor.material.color.set("#d7c98b")),Qt?(Ye={object:nt.get(Qt.id).hit,direct:nt.get(Qt.id).hit.userData.direct,point:Qt.position},ot=Qt.position):St&&!Ye&&(Ye=St,ot=St.point)}Kn(Ye,ot)}else y.update();ea=_,Mr(),x.render(m,p)}});function pd(){bi(),tt=!0,An==null||An.removeEventListener("visibilitychange",fs),window.removeEventListener("blur",Ac),window.removeEventListener("focus",Rc),document.removeEventListener("visibilitychange",fs),Ys.dispose(),x.setAnimationLoop(null),Lc.disconnect(),y.dispose(),x.domElement.removeEventListener("pointerdown",xc,!0),x.domElement.removeEventListener("pointermove",bc),x.domElement.removeEventListener("pointerup",yc),x.domElement.removeEventListener("pointercancel",Mc),x.domElement.removeEventListener("pointerleave",Sc);for(const _ of fe.values())_.pick.geometry.dispose(),_.pick.material.dispose(),_.unit.dispose(),_.cable.dispose();for(const _ of be)xt(_);for(const _ of[...Me,...ie,Un].filter(Boolean))_.dispose();z(m);for(const _ of q)_.dispose();x.dispose(),x.domElement.remove()}function md(){bi();for(const _ of[...be])xt(_)}return{cancelInteractions:md,update:xi,enterVR:dd,refreshVRSupport:fd,recenterVR:oa,resetView:P,setPanelPreview:Qo,dispose:pd,renderer:x}}const Bo="#182630",Wi=n=>String(n).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),In=n=>Number.isFinite(Number(n))?Number(Number(n).toPrecision(6)).toLocaleString("en-US",{maximumFractionDigits:6}):"—",th=n=>Math.abs(n)>=1e3?`${In(n/1e3)} kΩ`:`${In(n)} Ω`,gx=n=>n>=.001?`${In(n*1e3)} mF`:n>=1e-6?`${In(n*1e6)} μF`:`${In(n*1e9)} nF`,vx=n=>n>=1?`${In(n)} H`:`${In(n*1e3)} mH`;function _x(){const n=[],e=(h,d="")=>n.push(`<path d="${h.map(([f,g],v)=>`${v?"L":"M"} ${f} ${g}`).join(" ")}" ${d}/>`),t=(h,d,f,g)=>e([[h,d],[f,g]]),i=(h,d,f,g="middle",v=18)=>n.push(`<text x="${h}" y="${d}" text-anchor="${g}" font-size="${v}">${Wi(f)}</text>`),r=(h,d)=>n.push(`<circle cx="${h}" cy="${d}" r="4" fill="${Bo}" stroke="none"/>`),s=(h,d)=>n.push(`<circle cx="${h}" cy="${d}" r="4" fill="white"/>`),o=(h,d,f)=>n.push(`<circle data-pin="${Wi(h)}" cx="${d}" cy="${f}" r="7" fill="transparent" stroke="none"><title>${Wi(h)}</title></circle>`);return{elements:n,path:e,line:t,text:i,dot:r,contact:s,pins:h=>Object.entries(h).forEach(([d,[f,g]])=>o(d,f,g)),pin:o,ground:(h,d)=>{n.push('<g data-symbol="ground">'),t(h,d,h,d+12),t(h-15,d+12,h+15,d+12),t(h-10,d+18,h+10,d+18),t(h-4,d+24,h+4,d+24),n.push("</g>")},resistor:(h,d,f,g,v,m,p)=>{n.push(`<g data-component="${Wi(h)}" data-symbol="resistor">`);const x=d===g,y=x?(f+v)/2:(d+g)/2,b=x?[[d,f],[d,y-35]]:[[d,f],[y-35,f]];for(let S=0;S<7;S+=1){const w=y-30+S*10,R=S%2?-8:8;b.push(x?[d+R,w]:[w,f+R])}b.push(x?[d,y+35]:[y+35,f]),b.push([g,v]),e(b),x?(i(d+24,y-8,m,"start"),i(d+24,y+18,th(p),"start",16)):(i(y,f-24,m),i(y,f+30,th(p),"middle",16)),n.push("</g>")},source:({id:h,x:d,y:f,top:g,bottom:v,name:m,value:p,polarity:x=1,kind:y="voltage",state:b="active",labelSide:S=-1,frequency:w})=>{n.push(`<g data-component="${Wi(h)}" data-symbol="${Wi(y)}-source" data-source-state="${Wi(b)}" data-polarity="${x}">`);const R=d+S*56;b==="short"?(t(d,g,d,v),i(R,f-7,m),i(R,f+18,"0 V","middle",16)):b==="open"?(t(d,g,d,f-15),t(d,f+15,d,v),s(d,f-15),s(d,f+15),i(R,f-7,m),i(R,f+18,"open","middle",16)):(t(d,g,d,f-28),t(d,f+28,d,v),n.push(`<circle cx="${d}" cy="${f}" r="28" fill="white"/>`),y==="current"?(t(d,f+15,d,f-14),n.push(`<path d="M ${d} ${f-16} L ${d-5} ${f-7} L ${d+5} ${f-7} Z" fill="${Bo}" stroke="none"/>`)):y==="sine"?n.push(`<path d="M ${d-16} ${f} C ${d-11} ${f-16}, ${d-5} ${f-16}, ${d} ${f} C ${d+5} ${f+16}, ${d+11} ${f+16}, ${d+16} ${f}"/>`):(t(d-6,f-10,d+6,f-10),t(d-6,f+10,d+6,f+10),t(d,f+(x>0?-16:4),d,f+(x>0?-4:16))),i(R,f-8,m),i(R,f+18,p,"middle",16),w!==void 0&&i(R,f+42,`${In(w)} Hz`,"middle",14)),n.push("</g>")}}}function xx(n,e){const{line:t,path:i,source:r,resistor:s,ground:o,dot:a,text:l,pins:c}=n,u=120,h=330;if(e.representation==="original")r({id:"s",x:110,y:225,top:u,bottom:h,name:"Vs",value:"12 V"}),t(110,u,210,u),s("r1",210,u,370,u,"R₁",1e3),t(370,u,650,u),s("r2",440,u,440,h,"R₂",1e3),s("load",650,u,650,h,"RL",e.load),t(110,h,650,h),a(440,u),a(440,h),a(300,h),o(300,h),l(448,96,"A","start"),c({"s+":[110,u],"s-":[110,h],r1a:[210,u],r1b:[370,u],r2a:[440,u],r2b:[440,h],loada:[650,u],loadb:[650,h],gnd:[300,h]});else if(e.representation==="thevenin")r({id:"s",x:170,y:225,top:u,bottom:h,name:"VTh",value:`${In(e.equivalentVoltage)} V`}),t(170,u,280,u),s("req",280,u,480,u,"RTh",e.equivalentResistance),t(480,u,620,u),s("load",620,u,620,h,"RL",e.load),t(170,h,620,h),o(395,h),a(395,h),l(630,100,"A","start"),c({"s+":[170,u],"s-":[170,h],reqa:[280,u],reqb:[480,u],loada:[620,u],loadb:[620,h],gnd:[395,h]});else if(e.representation==="norton")r({id:"s",x:140,y:225,top:u,bottom:h,name:"IN",value:`${In(e.nortonCurrent)} mA`,kind:"current"}),t(140,u,650,u),s("req",395,u,395,h,"RN",e.equivalentResistance),s("load",650,u,650,h,"RL",e.load),t(140,h,650,h),a(395,u),a(395,h),a(270,h),o(270,h),l(405,96,"A","start"),c({"s+":[140,u],"s-":[140,h],reqa:[395,u],reqb:[395,h],loada:[650,u],loadb:[650,h],gnd:[270,h]});else throw new RangeError("Unknown equivalent circuit representation.")}function bx(n,e){const{line:t,source:i,resistor:r,ground:s,dot:o,text:a,pins:l}=n,c=u=>u?"active":e.replacement==="open"?"open":"short";i({id:"a",x:120,y:225,top:120,bottom:330,name:"V₁",value:`${In(e.v1)} V`,state:c(e.sourceMode!=="b")}),i({id:"b",x:660,y:225,top:120,bottom:330,name:"V₂",value:`${In(e.v2)} V`,polarity:-1,labelSide:1,state:c(e.sourceMode!=="a")}),t(120,120,200,120),r("r1",200,120,320,120,"R₁",1e3),t(320,120,460,120),r("r2",460,120,580,120,"R₂",1e3),t(580,120,660,120),r("load",390,120,390,330,"R₃",1e3),t(120,330,660,330),o(390,120),o(390,330),o(250,330),s(250,330),a(400,96,"A","start"),l({"a+":[120,120],"a-":[120,330],"b+":[660,120],"b-":[660,330],r1a:[200,120],r1b:[320,120],r2a:[460,120],r2b:[580,120],loada:[390,120],loadb:[390,330],gnd:[250,330]})}function yx(n,e){const{elements:t,line:i,path:r,source:s,resistor:o,ground:a,dot:l,contact:c,text:u,pins:h}=n,d=e.configuration==="inverting",f=d?180:230;s({id:"signal",x:90,y:285,top:f,bottom:345,name:"Vin",value:`${In(e.amplitude)} Vpk`,kind:"sine",frequency:e.frequency}),d?(i(90,180,150,180),o("rin",150,180,300,180,"Rin",e.rin),i(300,180,400,180),r([[400,230],[370,230],[370,345],[90,345]]),a(230,345),l(230,345)):(i(90,230,400,230),o("rin",170,180,300,180,"Rin",e.rin),i(300,180,400,180),a(170,180),a(90,345)),r([[340,180],[340,80],[400,80]]),o("rf",400,80,550,80,"Rf",e.rf),r([[550,80],[620,80],[620,205]]),i(550,205,660,205),l(340,180),l(620,205),t.push('<g data-component="op" data-symbol="op-amp">'),t.push('<path d="M 400 140 L 400 270 L 550 205 Z" fill="white"/>'),i(410,180,420,180),i(410,230,420,230),i(415,225,415,235),u(447,212,"U₁","middle",16),i(480,147,480,175),i(480,235,480,285),u(480,130,`+${In(e.rail)} V`,"middle",16),u(480,309,`−${In(e.rail)} V`,"middle",16),t.push("</g>"),c(660,205),u(671,210,"Vout","start");const g=d?[230,345]:[90,345];h({"signal+":[90,f],"signal-":[90,345],rina:[d?150:170,180],rinb:[300,180],rfa:[400,80],rfb:[550,80],"op-":[400,180],"op+":[400,230],out:[550,205],vp:[480,147],vn:[480,285],"plus+":[480,147],"minus-":[480,285],"plus-":g,"minus+":g,gnd:g})}function Mx(n,e){const{elements:t,line:i,path:r,source:s,resistor:o,ground:a,dot:l,contact:c,text:u,pins:h}=n;s({id:"s",x:100,y:235,top:120,bottom:340,name:"Vs",value:"5 V"}),i(100,120,235,120),r([[235,200],[190,200],[190,340]]),i(300,160,365,160),o("r",365,160,535,160,"R",e.resistance),i(535,160,650,160),i(100,340,650,340),a(390,340),l(390,340),l(190,340),t.push(`<g data-component="sw" data-symbol="spdt" data-switch-position="${e.charging?"source":"return"}">`),i(300,160,235,e.charging?120:200),c(235,120),c(235,200),c(300,160),u(280,90,"S₁"),u(222,103,"5 V","end",15),u(222,224,"0 V","end",15),t.push("</g>"),e.kind==="RC"?(t.push('<g data-component="storage" data-symbol="capacitor">'),i(650,160,650,242),i(626,242,674,242),i(626,258,674,258),i(650,258,650,340),u(692,242,"C","start"),u(692,269,gx(e.capacitance),"start",16),t.push("</g>")):(t.push('<g data-component="storage" data-symbol="inductor">'),i(650,160,650,218),t.push('<path d="M 650 218 c -18 0 -18 16 0 16 c -18 0 -18 16 0 16 c -18 0 -18 16 0 16 c -18 0 -18 16 0 16"/>'),i(650,282,650,340),u(682,242,"L","start"),u(682,269,vx(e.inductance),"start",16),t.push("</g>")),u(660,143,"A","start"),h({"s+":[100,120],"s-":[100,340],supply:[235,120],return:[235,200],common:[300,160],ra:[365,160],rb:[535,160],storagea:[650,160],storageb:[650,340],gnd:[390,340]})}function sd(n,e={},{voltages:t}={}){if(!En[n])throw new RangeError(`Unknown schematic module: ${n}`);const i={...En[n].defaults,...e},r=_x();n==="thevenin"?xx(r,i):n==="superposition"?bx(r,i):n==="opamp"?yx(r,i):Mx(r,i);const s={thevenin:`${i.representation==="original"?"Original voltage-divider":i.representation==="thevenin"?"Thévenin equivalent":"Norton equivalent"} circuit`,superposition:"Two-source superposition circuit; source two has its positive terminal grounded",opamp:`${i.configuration==="inverting"?"Inverting":"Non-inverting"} amplifier circuit with separate positive and negative supply pins`,transient:`Series ${i.kind} circuit with an SPDT source and closed return path`},o=Wi(s[n]);return`<svg xmlns="http://www.w3.org/2000/svg" class="ee-schematic" viewBox="0 0 780 430" width="100%" style="display:block;height:auto;aspect-ratio:780 / 430" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${o}"><title>${o}</title><rect width="780" height="430" fill="white"/><g fill="none" stroke="${Bo}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" font-family="Arial, Helvetica, sans-serif"><style>.ee-schematic text{fill:${Bo};stroke:none;font-weight:400}</style>${r.elements.join("")}</g></svg>`}const jo=document.querySelector("#app"),te=xd();let mr={kind:"checking",supported:!1,active:!1,message:"Checking headset…"},Tt,mc=!1,us=null,di=!1,gn={fraction:.5,panel:0,active:!1},Kr=null,od="vdc";const Ct=n=>String(n??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),Sx=n=>({circuit:'<path d="M3 8h5l3-5 5 10 3-5h5M7 18h15M7 15v6M22 15v6"/>',vr:'<path d="M4 6h20l2 13h-7l-5-4-5 4H2Z"/><circle cx="9" cy="11" r="2"/><circle cx="19" cy="11" r="2"/>',book:'<path d="M4 4h8a4 4 0 0 1 4 3v17a4 4 0 0 0-4-3H4Zm12 3a4 4 0 0 1 4-3h5v17h-5a4 4 0 0 0-4 3"/>',reset:'<path d="M6 8a9 9 0 1 1-1 10M6 3v6h6"/>',arrow:'<path d="M7 21 21 7M7 7h14v14"/>',play:'<path d="m10 5 13 9-13 9Z"/>',check:'<path d="m6 14 5 5L23 7"/>'})[n]||"",Ci=n=>`<svg viewBox="0 0 28 28" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${Sx(n)}</svg>`;jo.innerHTML=`
  <aside class="sidebar">
    <a class="brand" href="#" aria-label="MetaHub Circuits lab">${Ci("circuit")}<span>MetaHub<span class="brand-sub">Circuits lab</span></span></a>
    <div class="sidebar-caption">Electrical Circuits I</div>
    <nav aria-label="Laboratory modules">${Object.entries(En).map(([n,e])=>`<button class="module-link" data-action="module:${n}" data-module="${n}"><span class="lab-number">${e.number}</span><span><strong>${e.name}</strong><small>${e.short}</small></span><span class="module-status" aria-hidden="true"></span></button>`).join("")}</nav>
    <div class="sidebar-bottom"><div class="course-mark">ELEN <strong>221</strong></div><button class="text-button" id="guide-button">Help ${Ci("arrow")}</button><span class="prototype-tag">Lab build · v0.6</span></div>
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
`;const yn=(n,e,t,i=r=>r)=>`<label class="control-label" for="param-${n}">${e}</label><select id="param-${n}" data-param="${n}">${t.map(r=>`<option value="${Ct(r)}" ${ct(te)[n]===r?"selected":""}>${Ct(i(r))}</option>`).join("")}</select>`,ys=(n,e,t)=>`<div class="control-label">${e}</div><div class="segmented">${t.map(([i,r])=>`<button data-action="set:${n}:${i}" class="${ct(te)[n]===i?"active":""}">${r}</button>`).join("")}</div>`,Kt=n=>`<div class="control-block">${n}</div>`;function ad(){var l,c;const n=document.activeElement,e=(n==null?void 0:n.id)||null,t=n==null?void 0:n.dataset.scopeChannel,i=n==null?void 0:n.dataset.scopeField,r=ct(te),s=te.module;let o="",a="";s==="thevenin"&&(o+=Kt(ys("representation","Circuit",[["original","Original"],["thevenin","Thévenin"],["norton","Norton"]])),o+=Kt(yn("load","Load",Ot.load,u=>`${u} Ω`)+`<div class="range-labels"><span>Smaller load</span><span>Larger load</span></div><input aria-label="Load resistance slider" type="range" min="0" max="6" step="1" value="${Ot.load.indexOf(r.load)}" id="load-slider">`),r.representation==="thevenin"&&(o+=Kt(yn("equivalentVoltage","Vth",Ot.equivalentVoltage,u=>`${u} V`))),r.representation==="norton"&&(o+=Kt(yn("nortonCurrent","In",Ot.nortonCurrent,u=>`${u} mA`))),r.representation!=="original"?o+=Kt(yn("equivalentResistance","Equivalent resistance",Ot.equivalentResistance,u=>`${u} Ω`)):o+='<div class="fixed-values"><span>Source<strong>12 V</strong></span><span>R₁ / R₂<strong>1 kΩ / 1 kΩ</strong></span></div>',a="Use the same loads in each circuit. Peak power and peak efficiency occur at different loads."),s==="superposition"&&(o+=Kt(ys("sourceMode","Active sources",[["both","Both"],["a","A alone"],["b","B alone"]])),o+=Kt(yn("v1","Source A",Ot.v1,u=>`+${u} V`)),o+=Kt(yn("v2","Source B",Ot.v2,u=>`−${u} V`)),o+=Kt(ys("replacement","Inactive source",[["short","Short circuit"],["open","Open circuit"]])),a="An inactive ideal voltage source is a short circuit. Compare it with an open circuit. All resistors are 1 kΩ."),s==="opamp"&&(o+=Kt(ys("configuration","Circuit",[["inverting","Inverting"],["noninverting","Non-inverting"]])),o+=`<div class="paired-controls">${Kt(yn("rin",r.configuration==="inverting"?"Input resistor":"Ground resistor",Ot.rin,u=>`${u/1e3} kΩ`))}${Kt(yn("rf","Feedback resistor",Ot.rf,u=>`${u/1e3} kΩ`))}</div>`,o+=Kt(yn("amplitude","Input amplitude",Ot.amplitude,u=>`${u} V peak`)),o+=`<div class="paired-controls">${Kt(yn("rail","Supply rails",Ot.rail,u=>`±${u} V`))}${Kt(yn("frequency","Signal frequency",Ot.frequency,u=>`${u} Hz`))}</div>`,a=`Sine input · 1 V output headroom · ±${r.rail-1} V output limit. Ideal gain. Bandwidth and slew rate are not modelled.`),s==="transient"&&(o+=Kt(ys("kind","Circuit",[["RC","RC · capacitor"],["RL","RL · inductor"]])),o+=Kt(yn("resistance","Series resistance",Ot.resistance,u=>`${u} Ω`)),o+=`<div class="fixed-values"><span>Source<strong>5 V</strong></span><span>${r.kind==="RC"?"Capacitance":"Inductance"}<strong>${r.kind==="RC"?"100 μF":"100 mH"}</strong></span></div>`,o+=Kt(`<div class="control-label">Switch position</div><button class="switch-button ${r.charging?"charging":""}" data-action="switch"><span class="switch-track"><i></i></span>${r.charging?"Source connected":"Closed return loop"}</button>`),o+=`<div class="transient-buttons"><button class="button primary" data-action="play" id="play-button">${Ci("play")}${r.playing?"Pause":"Run"}</button><button class="button subtle" data-action="reset-energy">New run</button></div><div class="time-control"><div><span>Time</span><strong id="simulation-time">${Bt(r.time*1e3)} ms</strong></div><input id="time-slider" aria-label="Simulation time in time constants" type="range" min="0" max="5" step="0.01" value="${r.time/zn({...r,source:5}).tau}"><div class="time-shortcuts"><button data-action="one-tau">Go to 1 τ</button><button data-action="five-tau">Go to 5 τ</button><button data-action="replay">Replay</button></div></div>`,o+=Kt(yn("speed","Playback speed",Ot.speed,u=>`${u}×`)),a="Voltage, current and energy share one clock. Changing R keeps the same playback scale. New run resets stored energy."),document.querySelector("#controls").innerHTML=o,Tx(),wx(),Cx(),document.querySelector("#model-note").textContent=a,e?(l=document.getElementById(e))==null||l.focus({preventScroll:!0}):t&&((c=document.querySelector(`[data-scope-channel="${t}"][data-scope-field="${i}"]`))==null||c.focus({preventScroll:!0}))}function ld(){const n=ct(te);return(te.module==="thevenin"?{load:["load"],req:["equivalentResistance"],s:n.representation==="norton"?["nortonCurrent"]:n.representation==="thevenin"?["equivalentVoltage"]:[]}:te.module==="superposition"?{a:["v1"],b:["v2"]}:te.module==="opamp"?{signal:["amplitude","frequency"],rin:["rin"],rf:["rf"],plus:["rail"],minus:["rail"],op:["configuration"]}:{r:["resistance"],sw:["charging"],storage:["kind"]})[us]||[]}function Ex(){const n=ld();return ph(te).filter(e=>n.some(t=>e.id.startsWith(`cycle:${t}`)||e.id.startsWith(`set:${t}:`)||t==="charging"&&e.id==="switch")).map(e=>e.id)}function Tx(){const n=document.querySelector("#part-controls"),e=Dt(te).circuit.components.find(i=>i.id===us);if(n.hidden=!e,!e)return;const t=ld();n.innerHTML=`<div class="part-title"><strong>${Ct(e.label)} · ${Ct(e.value)}</strong><button id="close-part" aria-label="Close part settings">×</button></div>`+(t.length?t.map(i=>{var a;const r=document.querySelector(`[data-param="${i}"]`);r&&((a=r.closest(".control-block"))==null||a.classList.add("selected-control"));const s={load:"Load",equivalentResistance:"Resistance",equivalentVoltage:"Vth",nortonCurrent:"In",v1:"Source A",v2:"Source B",resistance:"Resistance",rail:"Supply",frequency:"Frequency",amplitude:"Input",rin:"Rin",rf:"Rf"}[i]||i,o={load:"Ω",equivalentResistance:"Ω",equivalentVoltage:"V",nortonCurrent:"mA",v1:"V",v2:"V",resistance:"Ω",rail:"V",frequency:"Hz",amplitude:"V peak",rin:"Ω",rf:"Ω"}[i]||"";return Ot[i]?`<div class="part-adjust"><button data-action="cycle:${i}:-1" aria-label="Decrease ${Ct(i)}">−</button><span>${Ct(s)}: ${Ct(ct(te)[i])} ${o}</span><button data-action="cycle:${i}" aria-label="Increase ${Ct(i)}">+</button></div>`:i==="charging"?'<button class="button" data-action="switch">Flip switch</button>':i==="configuration"?`<button class="button" data-action="set:configuration:${ct(te).configuration==="inverting"?"noninverting":"inverting"}">Change amplifier</button>`:i==="kind"?`<button class="button" data-action="set:kind:${ct(te).kind==="RC"?"RL":"RC"}">Use ${ct(te).kind==="RC"?"RL":"RC"}</button>`:""}).join(""):"<p>Fixed part. Connect its terminals with the Connect tool.</p>")}function wx(){const n=En[te.module],t=`<ol class="experiment-steps">${(n.steps||[]).map(i=>`<li>${Ct(i)}</li>`).join("")}</ol>`;document.querySelector("#experiment-steps").innerHTML=t,document.querySelector("#experiment-aim").textContent=n.purpose||n.challenge,document.querySelector("#activity-controls").innerHTML=`<p>${Ct(n.principle)}</p><p class="paper-note">Use the equipment to test each step. Keep readings and answers on paper.</p>`}function Ax(){const n=Hl(te),e=ct(te);document.querySelector("#source-comparison").innerHTML=`<p>Live circuit values at +${e.v1} V / −${e.v2} V. Each view uses your wiring. Select a case to switch the sources on the bench.</p><div class="source-cases">${[["a","A alone"],["b","B alone"],["both","Both sources"]].map(([t,i])=>{var s;const r=(s=n.live)==null?void 0:s[t];return`<button data-action="set:sourceMode:${t}" class="source-case ${e.sourceMode===t?"active":""}"><span>${i}</span><strong>${r!=null&&r.valid?`${Bt(r.current*1e3)} mA`:"—"}</strong><small>${r!=null&&r.valid?`${Bt(r.voltage)} V`:"Connect the circuit"}</small></button>`}).join("")}</div>`}function Rx(){if(te.module==="superposition"){const n=Hl(te).live;return["a","b","both"].map(e=>{var t;return`${{a:"A alone",b:"B alone",both:"Both sources"}[e]}: ${(t=n==null?void 0:n[e])!=null&&t.valid?Bt(n[e].current*1e3)+" mA":"Connect the circuit"}`})}if(te.module==="opamp"){const n=Ui(te);return[n.ok?`Scope: ${n.running?"Run":"Hold"}${n.stale?" · earlier settings":""}`:`Scope: ${n.error}`]}return[]}function Cx(){var o;const n=document.querySelector("#scope-controls"),e=((o=n.querySelector("details"))==null?void 0:o.open)||!1;if(n.hidden=te.module!=="opamp",te.module!=="opamp")return;const t=ct(te),i=Dt(te),r=Ui(te),s=(a,l,c)=>`<label>${c}<select data-scope-channel="${a}" data-scope-field="${l}" aria-label="${c}"><option value="">Disconnected</option>${i.circuit.pins.map(u=>`<option value="${Ct(u.id)}" ${i.scope[a][l]===u.id?"selected":""}>${Ct(u.name)}</option>`).join("")}</select></label>`;n.innerHTML=`<details class="scope-keyboard" ${e?"open":""}><summary>Scope keyboard controls</summary><div class="scope-top"><strong>Scope</strong><div><button class="button" data-action="scope-toggle">${t.scopeRunning?"Hold":"Run scope"}</button><button class="button" data-action="scope-autoscale">Auto scale</button></div></div><p class="scope-status ${r.error?"warning":""}">${Ct(r.error||(r.ok?`${r.running?"Running":"Held capture"}${r.stale?" · settings have changed":""} · ${r.trigger.found?"Triggered":"No trigger crossing"}`:"Connect the scope probes."))}</p>
    <div class="scope-channels">${["ch1","ch2"].map((a,l)=>`<fieldset><legend>${a.toUpperCase()} · ${l?"output":"input"}</legend><p class="hint">Move the probe and ground clip on the bench.</p>${s(a,"signal",`${a.toUpperCase()} tip`)}${s(a,"ground",`${a.toUpperCase()} ground`)}${yn(`${a}Scale`,"V / div",Ot[`${a}Scale`],c=>`${c} V`)}</fieldset>`).join("")}</div>
    <div class="scope-time">${Kt(yn("timeDiv","Time / div",Ot.timeDiv,a=>`${a} ms`))}${Kt(yn("triggerEdge","Trigger edge",["rising","falling"],a=>a==="rising"?"Rising":"Falling"))}<label class="control-block"><span class="control-label">Trigger level · CH1</span><div class="number-unit"><input data-param="triggerLevel" aria-label="Trigger level" type="number" step="0.1" min="-15" max="15" value="${t.triggerLevel}"><span>V</span></div></label></div><p class="hint">Both ground clips share circuit GND. Scales change the view, not the circuit.</p></details>`}function nh(n,e=gn.panel){const t=gn.active?fh(te,gn.fraction,e):null,i=t?{x:gn.fraction,label:t.text,xLabel:t.xLabel,readings:t.readings}:null,r=n.interaction||{thevenin:"load",superposition:"source",opamp:"scope",transient:"time"}[te.module];if(n.bars){const s=Math.max(...n.bars.map(o=>Math.abs(o.value??0)),1)*1.25;return{title:n.title,interaction:r,cursor:i,subtitle:n.subtitle,xLabel:"Source case",yLabel:"Current (mA)",xTicks:n.bars.map((o,a)=>({position:.18+a*.3,label:o.name})),yTicks:[-s,0,s].map(o=>({position:.5+o/(2*s),label:Bt(o,2)})),series:n.bars.filter(o=>Number.isFinite(o.value)).map(o=>{const a=n.bars.indexOf(o);return{color:o.color,points:[[.18+a*.3,.5],[.18+a*.3,.5+o.value/(2*s)]]}})}}return{title:n.title,interaction:r,cursor:i,id:n.id,subtitle:n.subtitle,xLabel:n.xLabel,yLabel:n.yLabel,xDivisions:te.module==="opamp"?10:4,yDivisions:te.module==="opamp"?8:4,xTicks:Array.from({length:te.module==="opamp"?6:5},(s,o)=>{const a=te.module==="opamp"?5:4;return{position:o/a,label:Bt(n.xMax*o/a,2)}}),yTicks:Array.from({length:5},(s,o)=>({position:o/4,label:Bt(n.yMin+(n.yMax-n.yMin)*o/4,2)})),marker:n.marker?{x:n.marker.x/n.xMax,y:(n.marker.y-n.yMin)/(n.yMax-n.yMin)}:null,reference:n.tau?{x:n.tau/n.xMax,label:"1 τ"}:null,series:n.series.map(s=>({name:s.name,color:s.color,points:s.points.map(([o,a])=>[o/n.xMax,(a-n.yMin)/(n.yMax-n.yMin)])}))}}function zo(n,e=0,t=!0){const i=Ho(te);if(gn={fraction:Math.min(1,Math.max(0,n)),panel:e,active:!0},t&&te.module==="thevenin"){const r=gn.fraction*i.xMax,s=Ot.load.reduce((o,a)=>Math.abs(a-r)<Math.abs(o-r)?a:o);ri(te,"load",s),gn.fraction=s/i.xMax}else t&&te.module==="transient"?(dh(te,`scrub:${gn.fraction*i.xMax}`),gn.fraction=ct(te).time*1e3/i.xMax):t&&te.module==="superposition"&&ri(te,"sourceMode",["a","b","both"][Math.min(2,Math.floor(gn.fraction*3))]);ad(),gc(),Ji()}function cd(n,e=Kr){if(!e)return;const t=(n.clientX-e.bounds.left)/e.bounds.width*640;zo((t-52)/568,e.panel)}const Jr=document.querySelector("#chart");Jr.addEventListener("pointerdown",n=>{const e=n.target.closest("svg[data-plot-index]");!e||n.button!==0||(n.preventDefault(),Kr={panel:Number(e.dataset.plotIndex),bounds:e.getBoundingClientRect(),pointerId:n.pointerId},Jr.setPointerCapture(n.pointerId),Jr.focus({preventScroll:!0}),cd(n))});Jr.addEventListener("pointermove",n=>{(Kr==null?void 0:Kr.pointerId)===n.pointerId&&cd(n)});for(const n of["pointerup","pointercancel","lostpointercapture"])Jr.addEventListener(n,()=>{Kr=null});Jr.addEventListener("keydown",n=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(n.key))return;if(n.preventDefault(),te.module==="thevenin"){const t=Ot.load,i=t.indexOf(ct(te).load),r=n.key==="Home"?0:n.key==="End"?t.length-1:Math.max(0,Math.min(t.length-1,i+(n.key==="ArrowRight"?1:-1)));zo(t[r]/Ho(te).xMax,0);return}const e=n.key==="Home"?0:n.key==="End"?1:gn.fraction+(n.key==="ArrowRight"?.02:-.02);zo(e,gn.panel)});function Px(){const{circuit:n,wires:e,probes:t}=Dt(te),i=n.pins.map(r=>`<option value="${Ct(r.id)}">${Ct(r.name)} [${Ct(r.id)}]</option>`).join("");for(const r of["wire-from","wire-to"]){const s=document.getElementById(r),o=s.value;s.innerHTML=i,n.pins.some(a=>a.id===o)&&(s.value=o)}for(const r of["red","black"]){const s=document.getElementById(`${r}-probe`);s.innerHTML='<option value="">Disconnected</option>'+i,s.value=t[r]||""}document.querySelector("#wire-list").innerHTML=e.length?e.map(([r,s],o)=>`<div class="wire-row"><span><code>${Ct(r)}</code> <span>↔</span> <code>${Ct(s)}</code></span><button data-remove-wire="${o}" aria-label="Remove connection ${Ct(r)} to ${Ct(s)}">Remove</button></div>`).join(""):'<p class="empty-wires">No leads connected. Start with the common ground connections.</p>',document.querySelector("#restore-button").hidden=te.mode!=="explore"}function ih(n,e=0){if(n.bars){const v=Math.max(...n.bars.map(x=>Math.abs(x.value??0)),1)*1.25,m=18+162/2,p=162/(2*v);return`<svg data-plot-index="${e}" viewBox="0 0 640 218" role="img" aria-label="${Ct(n.title)}">${[-v,0,v].map(x=>`<line x1="52" y1="${m-x*p}" x2="620" y2="${m-x*p}" class="grid-line"/><text x="43" y="${m-x*p+4}" text-anchor="end">${Bt(x,1)}</text>`).join("")}${n.bars.map((x,y)=>{const b=127+y*175,S=m-(x.value??0)*p;return Number.isFinite(x.value)?`<rect x="${b}" y="${Math.min(m,S)}" width="72" height="${Math.max(1,Math.abs(x.value*p))}" rx="3" fill="${x.color}"/><text x="${b+36}" y="${x.value>=0?S-9:S+17}" text-anchor="middle" class="bar-value">${Bt(x.value)} mA</text><text x="${b+36}" y="203" text-anchor="middle">${x.name}</text>`:`<text x="${b+36}" y="${m-8}" text-anchor="middle">—</text><text x="${b+36}" y="203" text-anchor="middle">${Ct(x.name)}</text>`}).join("")}</svg>`}const u=v=>52+v/n.xMax*568,h=v=>180-(v-n.yMin)/(n.yMax-n.yMin)*162;let d=`<svg data-plot-index="${e}" viewBox="0 0 640 218" role="img" aria-label="${Ct(n.title)}"><defs><clipPath id="plot-clip-${e}"><rect x="52" y="18" width="568" height="162"/></clipPath></defs>`;const f=te.module==="opamp"?10:4,g=te.module==="opamp"?8:4;for(let v=0;v<=f;v++){const m=n.xMax*v/f;d+=`<line x1="${u(m)}" y1="18" x2="${u(m)}" y2="180" class="grid-line"/>`,(f===4||v%2===0)&&(d+=`<text x="${u(m)}" y="196" text-anchor="middle">${Bt(m,2)}</text>`)}for(let v=0;v<=g;v++){const m=n.yMin+(n.yMax-n.yMin)*v/g;d+=`<line x1="52" y1="${h(m)}" x2="620" y2="${h(m)}" class="grid-line"/>`,(g===4||v%2===0)&&(d+=`<text x="42" y="${h(m)+4}" text-anchor="end">${Bt(m,2)}</text>`)}if(d+=`<g clip-path="url(#plot-clip-${e})">`,n.limits)for(const v of n.limits)d+=`<line x1="52" y1="${h(v)}" x2="620" y2="${h(v)}" stroke="#c6a885" stroke-dasharray="4 5"/>`;n.tau&&(d+=`<line x1="${u(n.tau)}" y1="18" x2="${u(n.tau)}" y2="180" stroke="#bb7549" stroke-dasharray="4 5"/><text x="${u(n.tau)+5}" y="30">1 τ</text>`);for(const v of n.series)d+=`<path d="${v.points.map(([m,p],x)=>`${x?"L":"M"}${u(m).toFixed(2)},${h(p).toFixed(2)}`).join(" ")}" fill="none" stroke="${v.color}" stroke-width="2.6"/>`;if(n.marker&&Number.isFinite(n.marker.y)&&(d+=`<circle cx="${u(n.marker.x)}" cy="${h(n.marker.y)}" r="5" fill="#fff" stroke="#b77636" stroke-width="2.5"/>`),gn.active){const v=u(gn.fraction*n.xMax);d+=`<line x1="${v}" y1="18" x2="${v}" y2="180" class="trace-cursor"/><rect x="${v-5}" y="18" width="10" height="7" fill="#263e50"/>`}return d+=`</g><text x="${52+568/2}" y="215" text-anchor="middle" class="axis-label">${Ct(n.xLabel)}</text><text x="52" y="11" class="axis-label">${Ct(n.yLabel)}</text></svg>`,d}function gc(){document.querySelector("#schematic").innerHTML='<div class="schematic-heading"><strong>Reference circuit</strong><span>Values follow the settings.</span></div>'+sd(te.module,ct(te))+"<p>This is the target wiring. Your leads and voltage probes are on the 3D bench.</p>"}function Ji(){var u,h,d;const n=ji(te),e=ct(te),t=Dt(te),i=Ho(te),r=Dd(te).map((f,g)=>g===0&&od==="off"?{...f,value:"—",unit:"",detail:"Meter off"}:f);document.querySelector("#readings").innerHTML=r.map(f=>`<div class="reading"><span>${f.label}</span><div>${Ct(f.value)}<small>${f.unit}</small></div><p>${Ct(f.detail)}</p></div>`).join("");const s=document.querySelector("#circuit-status");s.textContent=n.ok?t.correct?"Circuit connected":"Check wiring":"Connect the circuit",s.classList.toggle("warning",!n.ok||!t.correct),document.querySelector("#chart-title").textContent=i.title,document.querySelector("#chart-subtitle").textContent=i.subtitle,document.querySelector("#chart-use").textContent={thevenin:"Drag along the graph to set the load. Watch the meter and power change together.",superposition:"Select a source view to switch the circuit. The signed currents show how the sources add or cancel.",opamp:"Drag along the trace to read voltage at a chosen time. Turn the scope dials to change its scale.",transient:"The trace grows while the circuit runs. Drag on the trace to pause and inspect voltage, current and energy at the same instant."}[te.module],document.querySelector("#chart-legend").innerHTML=i.series.map(f=>`<span><i style="background:${f.color}"></i>${Ct(f.name)}</span>`).join(""),document.querySelector("#chart").innerHTML=(u=i.panels)!=null&&u.length?i.panels.map((f,g)=>`<div class="trace-panel"><h3>${Ct(f.title)}</h3>${ih(f,g)}${f.subtitle?`<p>${Ct(f.subtitle)}</p>`:""}</div>`).join(""):ih(i);const o=gn.active?fh(te,gn.fraction,gn.panel):null;if(document.querySelector("#trace-reading").textContent=(o==null?void 0:o.text)||"Use the graph to inspect a reading. Arrow keys also move the cursor.",document.querySelector("#feedback").textContent=!n.ok&&te.mode==="explore"?n.error:te.feedback,te.module==="transient"){document.querySelector("#simulation-time").textContent=`${Bt(e.time*1e3)} ms`;const f=document.querySelector("#time-slider");document.activeElement!==f&&(f.value=e.time/zn({...e,source:5}).tau),document.querySelector("#play-button").innerHTML=Ci("play")+(e.playing?"Pause":"Run")}for(const f of document.querySelectorAll("[data-tool]"))f.classList.toggle("active",f.dataset.tool===te.tool);const a=nh(i);(h=i.panels)!=null&&h.length&&(a.panels=i.panels.map(nh));const l={select:"Drag a dial to change its value. Drag a probe onto a contact to take a reading.",wire:te.selectedTerminal?`From ${((d=t.circuit.pins.find(f=>f.id===te.selectedTerminal))==null?void 0:d.name)||te.selectedTerminal} → select the next terminal. Esc cancels.`:"Drag from one contact to another to connect a lead. Drag a test probe onto a contact to measure voltage.",red:"Keyboard placement: choose the contact for the meter’s V tip.",black:"Keyboard placement: choose the contact for the meter’s COM tip.",remove:"Click a lead to remove it. Undo restores the last change.",ch1:"Click a terminal for the CH1 scope tip.",ch2:"Click a terminal for the CH2 scope tip.",scopeGround:"Click circuit ground for the selected scope ground lead."};document.querySelector("#bench-help").textContent=l[te.tool]||te.feedback,document.querySelector("#cancel-wire").hidden=!te.selectedTerminal,document.querySelector("#source-comparison").hidden=te.module!=="superposition",te.module==="superposition"&&Ax();const c=[...r.map(f=>`${f.label}: ${f.value} ${f.unit}`),"Grip a probe, bring its tip to a contact, then release. Hold and turn a dial to adjust it.","Left stick: move. Right stick: turn. Walk within your play area to inspect the bench.",te.module==="transient"?`Time: ${Bt(e.time*1e3)} ms | playback ${e.speed}×`:"",n.ok?"":n.error,`Experiment: ${En[te.module].challenge}`,`Feedback: ${te.feedback}`,...Rx()].filter(Boolean);Tt==null||Tt.update({module:te.module,mode:te.mode,parameters:{...e},measurement:n,metrics:r,options:Ot,experiment:{challenge:En[te.module].challenge,steps:En[te.module].steps||[]},components:t.circuit.components,wires:t.wires,probes:t.probes,selectedTerminal:te.selectedTerminal,tool:te.tool,scope:t.scope,selectedPart:us,partActions:Ex(),schematicDataURL:`data:image/svg+xml;charset=utf-8,${encodeURIComponent(sd(te.module,e))}`,live:{title:`Lab ${En[te.module].number} · ${En[te.module].name}`,lines:c},actions:ph(te),graph:a,rawGraph:i})}function Ln(){const n=En[te.module],e=ct(te);document.querySelector(".lower-layout").classList.toggle("scope-layout",te.module==="opamp"),document.querySelector("#lab-number").textContent=n.number,document.querySelector("#topic-label").textContent=n.topic,document.querySelector("#module-title").textContent=n.title,document.querySelector("#module-description").textContent=n.description,document.querySelector("#new-attempt").hidden=te.mode!=="build",document.querySelector("#bench-caption").textContent=e.representation?`${e.representation} circuit`:e.configuration?`${e.configuration} amplifier`:e.kind?`${e.kind} circuit`:"Two-source circuit";for(const t of document.querySelectorAll(".module-link")){const i=t.dataset.module===te.module;t.classList.toggle("active",i),t.setAttribute("aria-current",i?"page":"false")}for(const t of document.querySelectorAll(".mode-switch button"))t.classList.toggle("active",t.dataset.action===te.mode),t.setAttribute("aria-pressed",t.dataset.action===te.mode?"true":"false");ad(),Px(),gc(),Ji()}function Vs(n){var e;/^(module:|explore$|build$|undo$|clear$|restore$|reset-circuit$|set:(representation|kind|configuration):)/.test(n)&&((e=Tt==null?void 0:Tt.cancelInteractions)==null||e.call(Tt)),(n.startsWith("module:")||/set:(representation|kind|configuration):/.test(n))&&(us=null,gn.active=!1),dh(te,n),Ln(),/^(tool:ch[12]|scope-ground:)/.test(n)&&!mr.active&&!di&&(Gs(!1),document.querySelector("#bench").scrollIntoView({block:"center",behavior:"instant"}))}jo.addEventListener("click",n=>{if(n.target.closest("#close-part")){us=null,Ln();return}const e=n.target.closest("[data-action]");if(e){Vs(e.dataset.action);return}const t=n.target.closest("[data-remove-wire]");if(t){const i=te.tool;te.tool="remove",Gl(te,Number(t.dataset.removeWire)),te.tool=i,Ln();return}n.target.closest("[data-close]")&&n.target.closest("dialog").close()});jo.addEventListener("change",n=>{var t;const e=n.target;if(e.dataset.param&&(["representation","kind","configuration"].includes(e.dataset.param)&&((t=Tt==null?void 0:Tt.cancelInteractions)==null||t.call(Tt)),ri(te,e.dataset.param,Number.isNaN(Number(e.value))?e.value:Number(e.value)),Ln()),e.dataset.scopeChannel){const i=e.dataset.scopeField;es(te,`${e.dataset.scopeChannel}${i==="ground"?"Ground":""}`,e.value||null),Ln()}(e.id==="red-probe"||e.id==="black-probe")&&(es(te,e.id.split("-")[0],e.value||null),Ji())});jo.addEventListener("input",n=>{const e=n.target;if(e.dataset.param&&e.type==="number"&&e.value!==""&&(ri(te,e.dataset.param,Number(e.value)),Ji()),n.target.id==="load-slider"&&(ri(te,"load",Ot.load[Number(n.target.value)]),document.querySelector("#param-load").value=ct(te).load,Ji(),gc()),n.target.id==="time-slider"){const t=ct(te);t.playing=!1,ri(te,"time",Number(n.target.value)*zn({...t,source:5}).tau),Ji()}});document.querySelector("#add-wire").addEventListener("click",()=>{const n=document.querySelector("#wire-from").value,e=document.querySelector("#wire-to").value;te.tool="wire",te.selectedTerminal=null,Es(te,n),Es(te,e),Ln()});document.querySelector(".brand").addEventListener("click",n=>{n.preventDefault(),Vs("module:thevenin")});document.addEventListener("keydown",n=>{if(n.target.closest("input,textarea,select,button")||document.querySelector("dialog[open]"))return;const e={1:"tool:select",2:"tool:wire",3:"tool:red",4:"tool:black",5:"tool:remove",Escape:"cancel"};e[n.key]&&(n.preventDefault(),Vs(e[n.key])),(n.ctrlKey||n.metaKey)&&n.key==="z"&&(n.preventDefault(),Vs("undo"))});document.querySelector("#vr-preview-tab").addEventListener("click",()=>{const n=!di;Gs(!1),di=n,document.querySelector(".lab-layout").classList.toggle("vr-preview",di),Tt==null||Tt.setPanelPreview(di),document.querySelector("#vr-preview-tab").classList.toggle("active",di),document.querySelector("#bench-tab").classList.toggle("active",!di&&!mc)});document.querySelector("#reset-view").addEventListener("click",()=>Tt==null?void 0:Tt.resetView());function Gs(n){di&&(di=!1,Tt==null||Tt.setPanelPreview(!1),document.querySelector("#vr-preview-tab").classList.remove("active")),document.querySelector(".lab-layout").classList.remove("vr-preview"),mc=n,document.querySelector("#schematic").hidden=!n,document.querySelector("#bench-tab").classList.toggle("active",!n),document.querySelector("#reference-tab").classList.toggle("active",n),document.querySelector("#bench").style.visibility=n?"hidden":"visible",document.querySelector(".stage-bottom").hidden=n,document.querySelector(".stage-top").hidden=n}document.querySelector("#bench-tab").addEventListener("click",()=>Gs(!1));document.querySelector("#reference-tab").addEventListener("click",()=>Gs(!0));function Lx(){document.querySelector("#vr-help-status").textContent=mr.message,document.querySelector("#guide-dialog").showModal()}for(const n of["guide-button","model-guide"])document.getElementById(n).addEventListener("click",Lx);function Dx(){try{const e=new URL((window.location.protocol==="https:",window.location.href));return e.hash="",e.searchParams.delete("inspect-vr"),e.protocol==="https:"?e.href:null}catch{return null}}function rh(n){mr=n;const e={checking:"Checking VR…",entering:"Opening VR…",active:"Exit VR",ready:"Enter VR",error:"Try VR again"},t=n.active?"Exit VR":e[n.kind]||(n.supported?"Enter VR":"Use a headset"),i=document.querySelector("#vr-button");i.innerHTML=Ci("vr")+" "+t,i.title=n.message,i.disabled=n.kind==="checking"||n.kind==="entering",i.classList.toggle("vr-ready",n.supported);for(const s of["vr-status","headset-status","vr-help-status"])document.getElementById(s).textContent=n.message;const r=document.querySelector("#headset-enter");if(r.hidden=!n.supported||n.active,r.disabled=n.kind==="entering"||n.kind==="checking",document.querySelector("#headset-check").disabled=n.kind==="checking"||n.kind==="entering"||n.active,document.body.classList.toggle("in-vr",n.active),n.active)for(const s of document.querySelectorAll("dialog[open]"))s.close()}function ud(){var i;const n=Dx(),e=document.querySelector("#headset-address");e.innerHTML=n?`<span>Headset link</span><a href="${Ct(n)}" target="_blank" rel="noopener">${Ct(n)}</a><button class="button subtle" id="copy-headset-link">Copy link</button><small id="copy-headset-status" role="status"></small>`:"<p>This local address works on this computer. A standalone headset needs the lab’s HTTPS link.</p>",(i=document.querySelector("#copy-headset-link"))==null||i.addEventListener("click",async()=>{const r=document.querySelector("#copy-headset-status");try{await navigator.clipboard.writeText(n),r.textContent="Link copied"}catch{r.textContent="Select and copy the link above."}});const t=document.querySelector("#headset-fullscreen");t.hidden=window.self===window.top,t.href=window.location.href,document.querySelector("#headset-status").textContent=mr.message,document.querySelector("#headset-dialog").showModal()}function hd(){!Tt||mr.kind==="entering"||(mr.supported||mr.active?(Gs(!1),Tt.enterVR()):ud())}document.querySelector("#vr-button").addEventListener("click",hd);document.querySelector("#headset-enter").addEventListener("click",hd);document.querySelector("#headset-help").addEventListener("click",ud);document.querySelector("#headset-check").addEventListener("click",()=>Tt==null?void 0:Tt.refreshVRSupport());document.querySelector("#vr-preview-tab").hidden=!new URLSearchParams(window.location.search).has("inspect-vr");for(const n of document.querySelectorAll("dialog"))n.addEventListener("click",e=>{if(e.target===n){const t=n.getBoundingClientRect();(e.clientX<t.left||e.clientX>t.right||e.clientY<t.top||e.clientY>t.bottom)&&n.close()}});try{Tt=mx({container:document.querySelector("#bench"),onFrame:vc,onPanelPreviewChange:n=>{di=n,document.querySelector(".lab-layout").classList.toggle("vr-preview",n),document.querySelector("#vr-preview-tab").classList.toggle("active",n),document.querySelector("#bench-tab").classList.toggle("active",!n&&!mc)},onTerminal:n=>{Es(te,n),Ln()},onWire:n=>{Gl(te,n),Ln()},onWireMove:(n,e,t)=>{Nc(te,n,e,t),Ln()},onManipulation:(n,e)=>{n==="begin"?yd(te,e.input):n==="end"&&Md(te,e.input)},onDisconnect:n=>{Nc(te,n,0,null),Ln()},onConnect:(n,e)=>{const t=te.tool;te.tool="wire",te.selectedTerminal=null,Es(te,n),Es(te,e),te.tool=t,Ln()},onProbe:(n,e)=>{es(te,n,e),Ln()},onChange:(n,e)=>{var t;if(n==="meterMode"){od=e,Ji();return}["representation","kind","configuration"].includes(n)&&((t=Tt==null?void 0:Tt.cancelInteractions)==null||t.call(Tt)),ri(te,n,e),Ln()},onGraphCursor:zo,onPart:n=>{us=n,Ln()},onHover:n=>{const e=document.querySelector("#hover-label");e.hidden=!n,e.textContent=n?n.label:""},onAction:Vs,onXRStatus:rh})}catch(n){rh({kind:"unavailable",supported:!1,active:!1,message:"3D could not start in this browser. Open the lab in a headset browser."}),document.querySelector("#bench").innerHTML=`<div class="webgl-error"><h2>3D rendering is unavailable</h2><p>${Ct(n.message)}</p><p>You can still use the circuit reference and terminal controls below.</p></div>`}Ln();let sh=performance.now(),oh=0;function vc(n){const e=Math.min((n-sh)/1e3,.1);sh=n;const t=te.params.transient;t.playing&&te.module==="transient"&&Dt(te).correct&&(wd(te,e),(!t.playing||n-oh>100)&&(oh=n,Ji())),Tt||requestAnimationFrame(vc)}Tt||requestAnimationFrame(vc);
