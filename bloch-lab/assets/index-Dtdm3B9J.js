(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const Ha="178",Gi={ROTATE:0,DOLLY:1,PAN:2},Hi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},jl=0,so=1,$l=2,_l=1,Kl=2,Hn=3,si=0,on=1,_n=2,ni=0,ki=1,ro=2,ao=3,oo=4,Jl=5,pi=100,Ql=101,ec=102,tc=103,nc=104,ic=200,sc=201,rc=202,ac=203,Jr=204,Qr=205,oc=206,lc=207,cc=208,uc=209,hc=210,dc=211,fc=212,pc=213,mc=214,ea=0,ta=1,na=2,qi=3,ia=4,sa=5,ra=6,aa=7,vl=0,gc=1,_c=2,ii=0,vc=1,xc=2,Mc=3,Sc=4,Ec=5,yc=6,bc=7,xl=300,Yi=301,Zi=302,oa=303,la=304,or=306,ca=1e3,gi=1001,ua=1002,Tn=1003,Tc=1004,ys=1005,Cn=1006,fr=1007,_i=1008,Dn=1009,Ml=1010,Sl=1011,fs=1012,Va=1013,xi=1014,kn=1015,vs=1016,Ga=1017,ka=1018,ps=1020,El=35902,yl=1021,bl=1022,bn=1023,ms=1026,gs=1027,Tl=1028,Wa=1029,Al=1030,Xa=1031,qa=1033,js=33776,$s=33777,Ks=33778,Js=33779,ha=35840,da=35841,fa=35842,pa=35843,ma=36196,ga=37492,_a=37496,va=37808,xa=37809,Ma=37810,Sa=37811,Ea=37812,ya=37813,ba=37814,Ta=37815,Aa=37816,wa=37817,Ra=37818,Ca=37819,Pa=37820,Da=37821,Qs=36492,La=36494,Ua=36495,wl=36283,Ia=36284,Na=36285,Fa=36286,Ac=3200,wc=3201,Rl=0,Rc=1,ti="",an="srgb",ji="srgb-linear",tr="linear",Mt="srgb",bi=7680,lo=519,Cc=512,Pc=513,Dc=514,Cl=515,Lc=516,Uc=517,Ic=518,Nc=519,co=35044,uo="300 es",Wn=2e3,nr=2001;class Si{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const s=n[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const Yt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let ho=1234567;const us=Math.PI/180,_s=180/Math.PI;function Ki(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Yt[i&255]+Yt[i>>8&255]+Yt[i>>16&255]+Yt[i>>24&255]+"-"+Yt[e&255]+Yt[e>>8&255]+"-"+Yt[e>>16&15|64]+Yt[e>>24&255]+"-"+Yt[t&63|128]+Yt[t>>8&255]+"-"+Yt[t>>16&255]+Yt[t>>24&255]+Yt[n&255]+Yt[n>>8&255]+Yt[n>>16&255]+Yt[n>>24&255]).toLowerCase()}function et(i,e,t){return Math.max(e,Math.min(t,i))}function Ya(i,e){return(i%e+e)%e}function Fc(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Oc(i,e,t){return i!==e?(t-i)/(e-i):0}function hs(i,e,t){return(1-t)*i+t*e}function Bc(i,e,t,n){return hs(i,e,1-Math.exp(-t*n))}function zc(i,e=1){return e-Math.abs(Ya(i,e*2)-e)}function Hc(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Vc(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Gc(i,e){return i+Math.floor(Math.random()*(e-i+1))}function kc(i,e){return i+Math.random()*(e-i)}function Wc(i){return i*(.5-Math.random())}function Xc(i){i!==void 0&&(ho=i);let e=ho+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function qc(i){return i*us}function Yc(i){return i*_s}function Zc(i){return(i&i-1)===0&&i!==0}function jc(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function $c(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Kc(i,e,t,n,s){const r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+n)/2),d=a((e+n)/2),h=r((e-n)/2),f=a((e-n)/2),m=r((n-e)/2),x=a((n-e)/2);switch(s){case"XYX":i.set(o*d,l*h,l*f,o*c);break;case"YZY":i.set(l*f,o*d,l*h,o*c);break;case"ZXZ":i.set(l*h,l*f,o*d,o*c);break;case"XZX":i.set(o*d,l*x,l*m,o*c);break;case"YXY":i.set(l*m,o*d,l*x,o*c);break;case"ZYZ":i.set(l*x,l*m,o*d,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Bi(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Kt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Za={DEG2RAD:us,RAD2DEG:_s,generateUUID:Ki,clamp:et,euclideanModulo:Ya,mapLinear:Fc,inverseLerp:Oc,lerp:hs,damp:Bc,pingpong:zc,smoothstep:Hc,smootherstep:Vc,randInt:Gc,randFloat:kc,randFloatSpread:Wc,seededRandom:Xc,degToRad:qc,radToDeg:Yc,isPowerOfTwo:Zc,ceilPowerOfTwo:jc,floorPowerOfTwo:$c,setQuaternionFromProperEuler:Kc,normalize:Kt,denormalize:Bi};class qe{constructor(e=0,t=0){qe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=et(this.x,e.x,t.x),this.y=et(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=et(this.x,e,t),this.y=et(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(et(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(et(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class un{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],c=n[s+1],d=n[s+2],h=n[s+3];const f=r[a+0],m=r[a+1],x=r[a+2],S=r[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=d,e[t+3]=h;return}if(o===1){e[t+0]=f,e[t+1]=m,e[t+2]=x,e[t+3]=S;return}if(h!==S||l!==f||c!==m||d!==x){let p=1-o;const u=l*f+c*m+d*x+h*S,w=u>=0?1:-1,T=1-u*u;if(T>Number.EPSILON){const F=Math.sqrt(T),D=Math.atan2(F,u*w);p=Math.sin(p*D)/F,o=Math.sin(o*D)/F}const y=o*w;if(l=l*p+f*y,c=c*p+m*y,d=d*p+x*y,h=h*p+S*y,p===1-o){const F=1/Math.sqrt(l*l+c*c+d*d+h*h);l*=F,c*=F,d*=F,h*=F}}e[t]=l,e[t+1]=c,e[t+2]=d,e[t+3]=h}static multiplyQuaternionsFlat(e,t,n,s,r,a){const o=n[s],l=n[s+1],c=n[s+2],d=n[s+3],h=r[a],f=r[a+1],m=r[a+2],x=r[a+3];return e[t]=o*x+d*h+l*m-c*f,e[t+1]=l*x+d*f+c*h-o*m,e[t+2]=c*x+d*m+o*f-l*h,e[t+3]=d*x-o*h-l*f-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),d=o(s/2),h=o(r/2),f=l(n/2),m=l(s/2),x=l(r/2);switch(a){case"XYZ":this._x=f*d*h+c*m*x,this._y=c*m*h-f*d*x,this._z=c*d*x+f*m*h,this._w=c*d*h-f*m*x;break;case"YXZ":this._x=f*d*h+c*m*x,this._y=c*m*h-f*d*x,this._z=c*d*x-f*m*h,this._w=c*d*h+f*m*x;break;case"ZXY":this._x=f*d*h-c*m*x,this._y=c*m*h+f*d*x,this._z=c*d*x+f*m*h,this._w=c*d*h-f*m*x;break;case"ZYX":this._x=f*d*h-c*m*x,this._y=c*m*h+f*d*x,this._z=c*d*x-f*m*h,this._w=c*d*h+f*m*x;break;case"YZX":this._x=f*d*h+c*m*x,this._y=c*m*h+f*d*x,this._z=c*d*x-f*m*h,this._w=c*d*h-f*m*x;break;case"XZY":this._x=f*d*h-c*m*x,this._y=c*m*h-f*d*x,this._z=c*d*x+f*m*h,this._w=c*d*h+f*m*x;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],d=t[6],h=t[10],f=n+o+h;if(f>0){const m=.5/Math.sqrt(f+1);this._w=.25/m,this._x=(d-l)*m,this._y=(r-c)*m,this._z=(a-s)*m}else if(n>o&&n>h){const m=2*Math.sqrt(1+n-o-h);this._w=(d-l)/m,this._x=.25*m,this._y=(s+a)/m,this._z=(r+c)/m}else if(o>h){const m=2*Math.sqrt(1+o-n-h);this._w=(r-c)/m,this._x=(s+a)/m,this._y=.25*m,this._z=(l+d)/m}else{const m=2*Math.sqrt(1+h-n-o);this._w=(a-s)/m,this._x=(r+c)/m,this._y=(l+d)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(et(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,d=t._w;return this._x=n*d+a*o+s*c-r*l,this._y=s*d+a*l+r*o-n*c,this._z=r*d+a*c+n*l-s*o,this._w=a*d-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,s=this._y,r=this._z,a=this._w;let o=a*e._w+n*e._x+s*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const m=1-t;return this._w=m*a+t*this._w,this._x=m*n+t*this._x,this._y=m*s+t*this._y,this._z=m*r+t*this._z,this.normalize(),this}const c=Math.sqrt(l),d=Math.atan2(c,o),h=Math.sin((1-t)*d)/c,f=Math.sin(t*d)/c;return this._w=a*h+this._w*f,this._x=n*h+this._x*f,this._y=s*h+this._y*f,this._z=r*h+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class P{constructor(e=0,t=0,n=0){P.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(fo.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(fo.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*n),d=2*(o*t-r*s),h=2*(r*n-a*t);return this.x=t+l*c+a*h-o*d,this.y=n+l*d+o*c-r*h,this.z=s+l*h+r*d-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=et(this.x,e.x,t.x),this.y=et(this.y,e.y,t.y),this.z=et(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=et(this.x,e,t),this.y=et(this.y,e,t),this.z=et(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(et(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return pr.copy(this).projectOnVector(e),this.sub(pr)}reflect(e){return this.sub(pr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(et(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const pr=new P,fo=new un;class Ke{constructor(e,t,n,s,r,a,o,l,c){Ke.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c)}set(e,t,n,s,r,a,o,l,c){const d=this.elements;return d[0]=e,d[1]=s,d[2]=o,d[3]=t,d[4]=r,d[5]=l,d[6]=n,d[7]=a,d[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],d=n[4],h=n[7],f=n[2],m=n[5],x=n[8],S=s[0],p=s[3],u=s[6],w=s[1],T=s[4],y=s[7],F=s[2],D=s[5],C=s[8];return r[0]=a*S+o*w+l*F,r[3]=a*p+o*T+l*D,r[6]=a*u+o*y+l*C,r[1]=c*S+d*w+h*F,r[4]=c*p+d*T+h*D,r[7]=c*u+d*y+h*C,r[2]=f*S+m*w+x*F,r[5]=f*p+m*T+x*D,r[8]=f*u+m*y+x*C,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8];return t*a*d-t*o*c-n*r*d+n*o*l+s*r*c-s*a*l}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8],h=d*a-o*c,f=o*l-d*r,m=c*r-a*l,x=t*h+n*f+s*m;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const S=1/x;return e[0]=h*S,e[1]=(s*c-d*n)*S,e[2]=(o*n-s*a)*S,e[3]=f*S,e[4]=(d*t-s*l)*S,e[5]=(s*r-o*t)*S,e[6]=m*S,e[7]=(n*l-c*t)*S,e[8]=(a*t-n*r)*S,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(mr.makeScale(e,t)),this}rotate(e){return this.premultiply(mr.makeRotation(-e)),this}translate(e,t){return this.premultiply(mr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const mr=new Ke;function Pl(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function ir(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Jc(){const i=ir("canvas");return i.style.display="block",i}const po={};function Wi(i){i in po||(po[i]=!0,console.warn(i))}function Qc(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}function eu(i){const e=i.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function tu(i){const e=i.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const mo=new Ke().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),go=new Ke().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function nu(){const i={enabled:!0,workingColorSpace:ji,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===Mt&&(s.r=Xn(s.r),s.g=Xn(s.g),s.b=Xn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===Mt&&(s.r=Xi(s.r),s.g=Xi(s.g),s.b=Xi(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ti?tr:this.spaces[s].transfer},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Wi("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Wi("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[ji]:{primaries:e,whitePoint:n,transfer:tr,toXYZ:mo,fromXYZ:go,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:an},outputColorSpaceConfig:{drawingBufferColorSpace:an}},[an]:{primaries:e,whitePoint:n,transfer:Mt,toXYZ:mo,fromXYZ:go,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:an}}}),i}const ut=nu();function Xn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Xi(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Ti;class iu{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Ti===void 0&&(Ti=ir("canvas")),Ti.width=e.width,Ti.height=e.height;const s=Ti.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=Ti}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=ir("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Xn(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Xn(t[n]/255)*255):t[n]=Xn(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let su=0;class ja{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:su++}),this.uuid=Ki(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(gr(s[a].image)):r.push(gr(s[a]))}else r=gr(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function gr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?iu.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let ru=0;const _r=new P;class en extends Si{constructor(e=en.DEFAULT_IMAGE,t=en.DEFAULT_MAPPING,n=gi,s=gi,r=Cn,a=_i,o=bn,l=Dn,c=en.DEFAULT_ANISOTROPY,d=ti){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:ru++}),this.uuid=Ki(),this.name="",this.source=new ja(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new qe(0,0),this.repeat=new qe(1,1),this.center=new qe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ke,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(_r).x}get height(){return this.source.getSize(_r).y}get depth(){return this.source.getSize(_r).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==xl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case ca:e.x=e.x-Math.floor(e.x);break;case gi:e.x=e.x<0?0:1;break;case ua:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case ca:e.y=e.y-Math.floor(e.y);break;case gi:e.y=e.y<0?0:1;break;case ua:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}en.DEFAULT_IMAGE=null;en.DEFAULT_MAPPING=xl;en.DEFAULT_ANISOTROPY=1;class Lt{constructor(e=0,t=0,n=0,s=1){Lt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const l=e.elements,c=l[0],d=l[4],h=l[8],f=l[1],m=l[5],x=l[9],S=l[2],p=l[6],u=l[10];if(Math.abs(d-f)<.01&&Math.abs(h-S)<.01&&Math.abs(x-p)<.01){if(Math.abs(d+f)<.1&&Math.abs(h+S)<.1&&Math.abs(x+p)<.1&&Math.abs(c+m+u-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const T=(c+1)/2,y=(m+1)/2,F=(u+1)/2,D=(d+f)/4,C=(h+S)/4,O=(x+p)/4;return T>y&&T>F?T<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(T),s=D/n,r=C/n):y>F?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=D/s,r=O/s):F<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(F),n=C/r,s=O/r),this.set(n,s,r,t),this}let w=Math.sqrt((p-x)*(p-x)+(h-S)*(h-S)+(f-d)*(f-d));return Math.abs(w)<.001&&(w=1),this.x=(p-x)/w,this.y=(h-S)/w,this.z=(f-d)/w,this.w=Math.acos((c+m+u-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=et(this.x,e.x,t.x),this.y=et(this.y,e.y,t.y),this.z=et(this.z,e.z,t.z),this.w=et(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=et(this.x,e,t),this.y=et(this.y,e,t),this.z=et(this.z,e,t),this.w=et(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(et(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class au extends Si{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Cn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Lt(0,0,e,t),this.scissorTest=!1,this.viewport=new Lt(0,0,e,t);const s={width:e,height:t,depth:n.depth},r=new en(s);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){const t={minFilter:Cn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new ja(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Mi extends au{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Dl extends en{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Tn,this.minFilter=Tn,this.wrapR=gi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class ou extends en{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Tn,this.minFilter=Tn,this.wrapR=gi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class xs{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(vn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(vn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=vn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,vn):vn.fromBufferAttribute(r,a),vn.applyMatrix4(e.matrixWorld),this.expandByPoint(vn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),bs.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),bs.copy(n.boundingBox)),bs.applyMatrix4(e.matrixWorld),this.union(bs)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,vn),vn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ss),Ts.subVectors(this.max,ss),Ai.subVectors(e.a,ss),wi.subVectors(e.b,ss),Ri.subVectors(e.c,ss),Zn.subVectors(wi,Ai),jn.subVectors(Ri,wi),oi.subVectors(Ai,Ri);let t=[0,-Zn.z,Zn.y,0,-jn.z,jn.y,0,-oi.z,oi.y,Zn.z,0,-Zn.x,jn.z,0,-jn.x,oi.z,0,-oi.x,-Zn.y,Zn.x,0,-jn.y,jn.x,0,-oi.y,oi.x,0];return!vr(t,Ai,wi,Ri,Ts)||(t=[1,0,0,0,1,0,0,0,1],!vr(t,Ai,wi,Ri,Ts))?!1:(As.crossVectors(Zn,jn),t=[As.x,As.y,As.z],vr(t,Ai,wi,Ri,Ts))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,vn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(vn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Nn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Nn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Nn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Nn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Nn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Nn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Nn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Nn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Nn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Nn=[new P,new P,new P,new P,new P,new P,new P,new P],vn=new P,bs=new xs,Ai=new P,wi=new P,Ri=new P,Zn=new P,jn=new P,oi=new P,ss=new P,Ts=new P,As=new P,li=new P;function vr(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){li.fromArray(i,r);const o=s.x*Math.abs(li.x)+s.y*Math.abs(li.y)+s.z*Math.abs(li.z),l=e.dot(li),c=t.dot(li),d=n.dot(li);if(Math.max(-Math.max(l,c,d),Math.min(l,c,d))>o)return!1}return!0}const lu=new xs,rs=new P,xr=new P;class Ji{constructor(e=new P,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):lu.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;rs.subVectors(e,this.center);const t=rs.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(rs,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(xr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(rs.copy(e.center).add(xr)),this.expandByPoint(rs.copy(e.center).sub(xr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const Fn=new P,Mr=new P,ws=new P,$n=new P,Sr=new P,Rs=new P,Er=new P;class lr{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Fn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Fn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Fn.copy(this.origin).addScaledVector(this.direction,t),Fn.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Mr.copy(e).add(t).multiplyScalar(.5),ws.copy(t).sub(e).normalize(),$n.copy(this.origin).sub(Mr);const r=e.distanceTo(t)*.5,a=-this.direction.dot(ws),o=$n.dot(this.direction),l=-$n.dot(ws),c=$n.lengthSq(),d=Math.abs(1-a*a);let h,f,m,x;if(d>0)if(h=a*l-o,f=a*o-l,x=r*d,h>=0)if(f>=-x)if(f<=x){const S=1/d;h*=S,f*=S,m=h*(h+a*f+2*o)+f*(a*h+f+2*l)+c}else f=r,h=Math.max(0,-(a*f+o)),m=-h*h+f*(f+2*l)+c;else f=-r,h=Math.max(0,-(a*f+o)),m=-h*h+f*(f+2*l)+c;else f<=-x?(h=Math.max(0,-(-a*r+o)),f=h>0?-r:Math.min(Math.max(-r,-l),r),m=-h*h+f*(f+2*l)+c):f<=x?(h=0,f=Math.min(Math.max(-r,-l),r),m=f*(f+2*l)+c):(h=Math.max(0,-(a*r+o)),f=h>0?r:Math.min(Math.max(-r,-l),r),m=-h*h+f*(f+2*l)+c);else f=a>0?-r:r,h=Math.max(0,-(a*f+o)),m=-h*h+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(Mr).addScaledVector(ws,f),m}intersectSphere(e,t){Fn.subVectors(e.center,this.origin);const n=Fn.dot(this.direction),s=Fn.dot(Fn)-n*n,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l;const c=1/this.direction.x,d=1/this.direction.y,h=1/this.direction.z,f=this.origin;return c>=0?(n=(e.min.x-f.x)*c,s=(e.max.x-f.x)*c):(n=(e.max.x-f.x)*c,s=(e.min.x-f.x)*c),d>=0?(r=(e.min.y-f.y)*d,a=(e.max.y-f.y)*d):(r=(e.max.y-f.y)*d,a=(e.min.y-f.y)*d),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),h>=0?(o=(e.min.z-f.z)*h,l=(e.max.z-f.z)*h):(o=(e.max.z-f.z)*h,l=(e.min.z-f.z)*h),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Fn)!==null}intersectTriangle(e,t,n,s,r){Sr.subVectors(t,e),Rs.subVectors(n,e),Er.crossVectors(Sr,Rs);let a=this.direction.dot(Er),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;$n.subVectors(this.origin,e);const l=o*this.direction.dot(Rs.crossVectors($n,Rs));if(l<0)return null;const c=o*this.direction.dot(Sr.cross($n));if(c<0||l+c>a)return null;const d=-o*$n.dot(Er);return d<0?null:this.at(d/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class wt{constructor(e,t,n,s,r,a,o,l,c,d,h,f,m,x,S,p){wt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c,d,h,f,m,x,S,p)}set(e,t,n,s,r,a,o,l,c,d,h,f,m,x,S,p){const u=this.elements;return u[0]=e,u[4]=t,u[8]=n,u[12]=s,u[1]=r,u[5]=a,u[9]=o,u[13]=l,u[2]=c,u[6]=d,u[10]=h,u[14]=f,u[3]=m,u[7]=x,u[11]=S,u[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new wt().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,s=1/Ci.setFromMatrixColumn(e,0).length(),r=1/Ci.setFromMatrixColumn(e,1).length(),a=1/Ci.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),d=Math.cos(r),h=Math.sin(r);if(e.order==="XYZ"){const f=a*d,m=a*h,x=o*d,S=o*h;t[0]=l*d,t[4]=-l*h,t[8]=c,t[1]=m+x*c,t[5]=f-S*c,t[9]=-o*l,t[2]=S-f*c,t[6]=x+m*c,t[10]=a*l}else if(e.order==="YXZ"){const f=l*d,m=l*h,x=c*d,S=c*h;t[0]=f+S*o,t[4]=x*o-m,t[8]=a*c,t[1]=a*h,t[5]=a*d,t[9]=-o,t[2]=m*o-x,t[6]=S+f*o,t[10]=a*l}else if(e.order==="ZXY"){const f=l*d,m=l*h,x=c*d,S=c*h;t[0]=f-S*o,t[4]=-a*h,t[8]=x+m*o,t[1]=m+x*o,t[5]=a*d,t[9]=S-f*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const f=a*d,m=a*h,x=o*d,S=o*h;t[0]=l*d,t[4]=x*c-m,t[8]=f*c+S,t[1]=l*h,t[5]=S*c+f,t[9]=m*c-x,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const f=a*l,m=a*c,x=o*l,S=o*c;t[0]=l*d,t[4]=S-f*h,t[8]=x*h+m,t[1]=h,t[5]=a*d,t[9]=-o*d,t[2]=-c*d,t[6]=m*h+x,t[10]=f-S*h}else if(e.order==="XZY"){const f=a*l,m=a*c,x=o*l,S=o*c;t[0]=l*d,t[4]=-h,t[8]=c*d,t[1]=f*h+S,t[5]=a*d,t[9]=m*h-x,t[2]=x*h-m,t[6]=o*d,t[10]=S*h+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(cu,e,uu)}lookAt(e,t,n){const s=this.elements;return ln.subVectors(e,t),ln.lengthSq()===0&&(ln.z=1),ln.normalize(),Kn.crossVectors(n,ln),Kn.lengthSq()===0&&(Math.abs(n.z)===1?ln.x+=1e-4:ln.z+=1e-4,ln.normalize(),Kn.crossVectors(n,ln)),Kn.normalize(),Cs.crossVectors(ln,Kn),s[0]=Kn.x,s[4]=Cs.x,s[8]=ln.x,s[1]=Kn.y,s[5]=Cs.y,s[9]=ln.y,s[2]=Kn.z,s[6]=Cs.z,s[10]=ln.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],d=n[1],h=n[5],f=n[9],m=n[13],x=n[2],S=n[6],p=n[10],u=n[14],w=n[3],T=n[7],y=n[11],F=n[15],D=s[0],C=s[4],O=s[8],E=s[12],M=s[1],L=s[5],k=s[9],H=s[13],X=s[2],$=s[6],W=s[10],ee=s[14],q=s[3],me=s[7],ye=s[11],De=s[15];return r[0]=a*D+o*M+l*X+c*q,r[4]=a*C+o*L+l*$+c*me,r[8]=a*O+o*k+l*W+c*ye,r[12]=a*E+o*H+l*ee+c*De,r[1]=d*D+h*M+f*X+m*q,r[5]=d*C+h*L+f*$+m*me,r[9]=d*O+h*k+f*W+m*ye,r[13]=d*E+h*H+f*ee+m*De,r[2]=x*D+S*M+p*X+u*q,r[6]=x*C+S*L+p*$+u*me,r[10]=x*O+S*k+p*W+u*ye,r[14]=x*E+S*H+p*ee+u*De,r[3]=w*D+T*M+y*X+F*q,r[7]=w*C+T*L+y*$+F*me,r[11]=w*O+T*k+y*W+F*ye,r[15]=w*E+T*H+y*ee+F*De,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],d=e[2],h=e[6],f=e[10],m=e[14],x=e[3],S=e[7],p=e[11],u=e[15];return x*(+r*l*h-s*c*h-r*o*f+n*c*f+s*o*m-n*l*m)+S*(+t*l*m-t*c*f+r*a*f-s*a*m+s*c*d-r*l*d)+p*(+t*c*h-t*o*m-r*a*h+n*a*m+r*o*d-n*c*d)+u*(-s*o*d-t*l*h+t*o*f+s*a*h-n*a*f+n*l*d)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8],h=e[9],f=e[10],m=e[11],x=e[12],S=e[13],p=e[14],u=e[15],w=h*p*c-S*f*c+S*l*m-o*p*m-h*l*u+o*f*u,T=x*f*c-d*p*c-x*l*m+a*p*m+d*l*u-a*f*u,y=d*S*c-x*h*c+x*o*m-a*S*m-d*o*u+a*h*u,F=x*h*l-d*S*l-x*o*f+a*S*f+d*o*p-a*h*p,D=t*w+n*T+s*y+r*F;if(D===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const C=1/D;return e[0]=w*C,e[1]=(S*f*r-h*p*r-S*s*m+n*p*m+h*s*u-n*f*u)*C,e[2]=(o*p*r-S*l*r+S*s*c-n*p*c-o*s*u+n*l*u)*C,e[3]=(h*l*r-o*f*r-h*s*c+n*f*c+o*s*m-n*l*m)*C,e[4]=T*C,e[5]=(d*p*r-x*f*r+x*s*m-t*p*m-d*s*u+t*f*u)*C,e[6]=(x*l*r-a*p*r-x*s*c+t*p*c+a*s*u-t*l*u)*C,e[7]=(a*f*r-d*l*r+d*s*c-t*f*c-a*s*m+t*l*m)*C,e[8]=y*C,e[9]=(x*h*r-d*S*r-x*n*m+t*S*m+d*n*u-t*h*u)*C,e[10]=(a*S*r-x*o*r+x*n*c-t*S*c-a*n*u+t*o*u)*C,e[11]=(d*o*r-a*h*r-d*n*c+t*h*c+a*n*m-t*o*m)*C,e[12]=F*C,e[13]=(d*S*s-x*h*s+x*n*f-t*S*f-d*n*p+t*h*p)*C,e[14]=(x*o*s-a*S*s-x*n*l+t*S*l+a*n*p-t*o*p)*C,e[15]=(a*h*s-d*o*s+d*n*l-t*h*l-a*n*f+t*o*f)*C,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,d=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,d*o+n,d*l-s*a,0,c*l-s*o,d*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,d=a+a,h=o+o,f=r*c,m=r*d,x=r*h,S=a*d,p=a*h,u=o*h,w=l*c,T=l*d,y=l*h,F=n.x,D=n.y,C=n.z;return s[0]=(1-(S+u))*F,s[1]=(m+y)*F,s[2]=(x-T)*F,s[3]=0,s[4]=(m-y)*D,s[5]=(1-(f+u))*D,s[6]=(p+w)*D,s[7]=0,s[8]=(x+T)*C,s[9]=(p-w)*C,s[10]=(1-(f+S))*C,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;let r=Ci.set(s[0],s[1],s[2]).length();const a=Ci.set(s[4],s[5],s[6]).length(),o=Ci.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],xn.copy(this);const c=1/r,d=1/a,h=1/o;return xn.elements[0]*=c,xn.elements[1]*=c,xn.elements[2]*=c,xn.elements[4]*=d,xn.elements[5]*=d,xn.elements[6]*=d,xn.elements[8]*=h,xn.elements[9]*=h,xn.elements[10]*=h,t.setFromRotationMatrix(xn),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,s,r,a,o=Wn){const l=this.elements,c=2*r/(t-e),d=2*r/(n-s),h=(t+e)/(t-e),f=(n+s)/(n-s);let m,x;if(o===Wn)m=-(a+r)/(a-r),x=-2*a*r/(a-r);else if(o===nr)m=-a/(a-r),x=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=d,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=x,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=Wn){const l=this.elements,c=1/(t-e),d=1/(n-s),h=1/(a-r),f=(t+e)*c,m=(n+s)*d;let x,S;if(o===Wn)x=(a+r)*h,S=-2*h;else if(o===nr)x=r*h,S=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*d,l[9]=0,l[13]=-m,l[2]=0,l[6]=0,l[10]=S,l[14]=-x,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Ci=new P,xn=new wt,cu=new P(0,0,0),uu=new P(1,1,1),Kn=new P,Cs=new P,ln=new P,_o=new wt,vo=new un;class Ln{constructor(e=0,t=0,n=0,s=Ln.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],d=s[9],h=s[2],f=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(et(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,m),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-et(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(et(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-h,m),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-et(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(f,m),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(et(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,c),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-et(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-d,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return _o.makeRotationFromQuaternion(e),this.setFromRotationMatrix(_o,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return vo.setFromEuler(this),this.setFromQuaternion(vo,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ln.DEFAULT_ORDER="XYZ";class $a{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let hu=0;const xo=new P,Pi=new un,On=new wt,Ps=new P,as=new P,du=new P,fu=new un,Mo=new P(1,0,0),So=new P(0,1,0),Eo=new P(0,0,1),yo={type:"added"},pu={type:"removed"},Di={type:"childadded",child:null},yr={type:"childremoved",child:null};class Bt extends Si{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:hu++}),this.uuid=Ki(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Bt.DEFAULT_UP.clone();const e=new P,t=new Ln,n=new un,s=new P(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new wt},normalMatrix:{value:new Ke}}),this.matrix=new wt,this.matrixWorld=new wt,this.matrixAutoUpdate=Bt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Bt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new $a,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Pi.setFromAxisAngle(e,t),this.quaternion.multiply(Pi),this}rotateOnWorldAxis(e,t){return Pi.setFromAxisAngle(e,t),this.quaternion.premultiply(Pi),this}rotateX(e){return this.rotateOnAxis(Mo,e)}rotateY(e){return this.rotateOnAxis(So,e)}rotateZ(e){return this.rotateOnAxis(Eo,e)}translateOnAxis(e,t){return xo.copy(e).applyQuaternion(this.quaternion),this.position.add(xo.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Mo,e)}translateY(e){return this.translateOnAxis(So,e)}translateZ(e){return this.translateOnAxis(Eo,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(On.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ps.copy(e):Ps.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),as.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?On.lookAt(as,Ps,this.up):On.lookAt(Ps,as,this.up),this.quaternion.setFromRotationMatrix(On),s&&(On.extractRotation(s.matrixWorld),Pi.setFromRotationMatrix(On),this.quaternion.premultiply(Pi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(yo),Di.child=e,this.dispatchEvent(Di),Di.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(pu),yr.child=e,this.dispatchEvent(yr),yr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),On.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),On.multiply(e.parent.matrixWorld)),e.applyMatrix4(On),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(yo),Di.child=e,this.dispatchEvent(Di),Di.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(as,e,du),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(as,fu,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,d=l.length;c<d;c++){const h=l[c];r(e.shapes,h)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),d=a(e.images),h=a(e.shapes),f=a(e.skeletons),m=a(e.animations),x=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),d.length>0&&(n.images=d),h.length>0&&(n.shapes=h),f.length>0&&(n.skeletons=f),m.length>0&&(n.animations=m),x.length>0&&(n.nodes=x)}return n.object=s,n;function a(o){const l=[];for(const c in o){const d=o[c];delete d.metadata,l.push(d)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}Bt.DEFAULT_UP=new P(0,1,0);Bt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Bt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Mn=new P,Bn=new P,br=new P,zn=new P,Li=new P,Ui=new P,bo=new P,Tr=new P,Ar=new P,wr=new P,Rr=new Lt,Cr=new Lt,Pr=new Lt;class yn{constructor(e=new P,t=new P,n=new P){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Mn.subVectors(e,t),s.cross(Mn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Mn.subVectors(s,t),Bn.subVectors(n,t),br.subVectors(e,t);const a=Mn.dot(Mn),o=Mn.dot(Bn),l=Mn.dot(br),c=Bn.dot(Bn),d=Bn.dot(br),h=a*c-o*o;if(h===0)return r.set(0,0,0),null;const f=1/h,m=(c*l-o*d)*f,x=(a*d-o*l)*f;return r.set(1-m-x,x,m)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,zn)===null?!1:zn.x>=0&&zn.y>=0&&zn.x+zn.y<=1}static getInterpolation(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,zn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,zn.x),l.addScaledVector(a,zn.y),l.addScaledVector(o,zn.z),l)}static getInterpolatedAttribute(e,t,n,s,r,a){return Rr.setScalar(0),Cr.setScalar(0),Pr.setScalar(0),Rr.fromBufferAttribute(e,t),Cr.fromBufferAttribute(e,n),Pr.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Rr,r.x),a.addScaledVector(Cr,r.y),a.addScaledVector(Pr,r.z),a}static isFrontFacing(e,t,n,s){return Mn.subVectors(n,t),Bn.subVectors(e,t),Mn.cross(Bn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Mn.subVectors(this.c,this.b),Bn.subVectors(this.a,this.b),Mn.cross(Bn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return yn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return yn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return yn.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return yn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return yn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let a,o;Li.subVectors(s,n),Ui.subVectors(r,n),Tr.subVectors(e,n);const l=Li.dot(Tr),c=Ui.dot(Tr);if(l<=0&&c<=0)return t.copy(n);Ar.subVectors(e,s);const d=Li.dot(Ar),h=Ui.dot(Ar);if(d>=0&&h<=d)return t.copy(s);const f=l*h-d*c;if(f<=0&&l>=0&&d<=0)return a=l/(l-d),t.copy(n).addScaledVector(Li,a);wr.subVectors(e,r);const m=Li.dot(wr),x=Ui.dot(wr);if(x>=0&&m<=x)return t.copy(r);const S=m*c-l*x;if(S<=0&&c>=0&&x<=0)return o=c/(c-x),t.copy(n).addScaledVector(Ui,o);const p=d*x-m*h;if(p<=0&&h-d>=0&&m-x>=0)return bo.subVectors(r,s),o=(h-d)/(h-d+(m-x)),t.copy(s).addScaledVector(bo,o);const u=1/(p+S+f);return a=S*u,o=f*u,t.copy(n).addScaledVector(Li,a).addScaledVector(Ui,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Ll={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Jn={h:0,s:0,l:0},Ds={h:0,s:0,l:0};function Dr(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class lt{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=an){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ut.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=ut.workingColorSpace){return this.r=e,this.g=t,this.b=n,ut.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=ut.workingColorSpace){if(e=Ya(e,1),t=et(t,0,1),n=et(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=Dr(a,r,e+1/3),this.g=Dr(a,r,e),this.b=Dr(a,r,e-1/3)}return ut.colorSpaceToWorking(this,s),this}setStyle(e,t=an){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=an){const n=Ll[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Xn(e.r),this.g=Xn(e.g),this.b=Xn(e.b),this}copyLinearToSRGB(e){return this.r=Xi(e.r),this.g=Xi(e.g),this.b=Xi(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=an){return ut.workingToColorSpace(Zt.copy(this),e),Math.round(et(Zt.r*255,0,255))*65536+Math.round(et(Zt.g*255,0,255))*256+Math.round(et(Zt.b*255,0,255))}getHexString(e=an){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ut.workingColorSpace){ut.workingToColorSpace(Zt.copy(this),t);const n=Zt.r,s=Zt.g,r=Zt.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let l,c;const d=(o+a)/2;if(o===a)l=0,c=0;else{const h=a-o;switch(c=d<=.5?h/(a+o):h/(2-a-o),a){case n:l=(s-r)/h+(s<r?6:0);break;case s:l=(r-n)/h+2;break;case r:l=(n-s)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=d,e}getRGB(e,t=ut.workingColorSpace){return ut.workingToColorSpace(Zt.copy(this),t),e.r=Zt.r,e.g=Zt.g,e.b=Zt.b,e}getStyle(e=an){ut.workingToColorSpace(Zt.copy(this),e);const t=Zt.r,n=Zt.g,s=Zt.b;return e!==an?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Jn),this.setHSL(Jn.h+e,Jn.s+t,Jn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Jn),e.getHSL(Ds);const n=hs(Jn.h,Ds.h,t),s=hs(Jn.s,Ds.s,t),r=hs(Jn.l,Ds.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Zt=new lt;lt.NAMES=Ll;let mu=0;class Qi extends Si{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:mu++}),this.uuid=Ki(),this.name="",this.type="Material",this.blending=ki,this.side=si,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Jr,this.blendDst=Qr,this.blendEquation=pi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new lt(0,0,0),this.blendAlpha=0,this.depthFunc=qi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=lo,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=bi,this.stencilZFail=bi,this.stencilZPass=bi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ki&&(n.blending=this.blending),this.side!==si&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Jr&&(n.blendSrc=this.blendSrc),this.blendDst!==Qr&&(n.blendDst=this.blendDst),this.blendEquation!==pi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==qi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==lo&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==bi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==bi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==bi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Ft extends Qi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new lt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ln,this.combine=vl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Nt=new P,Ls=new qe;let gu=0;class Pn{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:gu++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=co,this.updateRanges=[],this.gpuType=kn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Ls.fromBufferAttribute(this,t),Ls.applyMatrix3(e),this.setXY(t,Ls.x,Ls.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Nt.fromBufferAttribute(this,t),Nt.applyMatrix3(e),this.setXYZ(t,Nt.x,Nt.y,Nt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Nt.fromBufferAttribute(this,t),Nt.applyMatrix4(e),this.setXYZ(t,Nt.x,Nt.y,Nt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Nt.fromBufferAttribute(this,t),Nt.applyNormalMatrix(e),this.setXYZ(t,Nt.x,Nt.y,Nt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Nt.fromBufferAttribute(this,t),Nt.transformDirection(e),this.setXYZ(t,Nt.x,Nt.y,Nt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Bi(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Kt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Bi(t,this.array)),t}setX(e,t){return this.normalized&&(t=Kt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Bi(t,this.array)),t}setY(e,t){return this.normalized&&(t=Kt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Bi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Kt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Bi(t,this.array)),t}setW(e,t){return this.normalized&&(t=Kt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Kt(t,this.array),n=Kt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=Kt(t,this.array),n=Kt(n,this.array),s=Kt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=Kt(t,this.array),n=Kt(n,this.array),s=Kt(s,this.array),r=Kt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==co&&(e.usage=this.usage),e}}class Ul extends Pn{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Il extends Pn{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class tn extends Pn{constructor(e,t,n){super(new Float32Array(e),t,n)}}let _u=0;const fn=new wt,Lr=new Bt,Ii=new P,cn=new xs,os=new xs,Gt=new P;class Ct extends Si{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:_u++}),this.uuid=Ki(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Pl(e)?Il:Ul)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ke().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return fn.makeRotationFromQuaternion(e),this.applyMatrix4(fn),this}rotateX(e){return fn.makeRotationX(e),this.applyMatrix4(fn),this}rotateY(e){return fn.makeRotationY(e),this.applyMatrix4(fn),this}rotateZ(e){return fn.makeRotationZ(e),this.applyMatrix4(fn),this}translate(e,t,n){return fn.makeTranslation(e,t,n),this.applyMatrix4(fn),this}scale(e,t,n){return fn.makeScale(e,t,n),this.applyMatrix4(fn),this}lookAt(e){return Lr.lookAt(e),Lr.updateMatrix(),this.applyMatrix4(Lr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ii).negate(),this.translate(Ii.x,Ii.y,Ii.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new tn(n,3))}else{const n=Math.min(e.length,t.count);for(let s=0;s<n;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new xs);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];cn.setFromBufferAttribute(r),this.morphTargetsRelative?(Gt.addVectors(this.boundingBox.min,cn.min),this.boundingBox.expandByPoint(Gt),Gt.addVectors(this.boundingBox.max,cn.max),this.boundingBox.expandByPoint(Gt)):(this.boundingBox.expandByPoint(cn.min),this.boundingBox.expandByPoint(cn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ji);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(e){const n=this.boundingSphere.center;if(cn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];os.setFromBufferAttribute(o),this.morphTargetsRelative?(Gt.addVectors(cn.min,os.min),cn.expandByPoint(Gt),Gt.addVectors(cn.max,os.max),cn.expandByPoint(Gt)):(cn.expandByPoint(os.min),cn.expandByPoint(os.max))}cn.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)Gt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Gt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,d=o.count;c<d;c++)Gt.fromBufferAttribute(o,c),l&&(Ii.fromBufferAttribute(e,c),Gt.add(Ii)),s=Math.max(s,n.distanceToSquared(Gt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Pn(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let O=0;O<n.count;O++)o[O]=new P,l[O]=new P;const c=new P,d=new P,h=new P,f=new qe,m=new qe,x=new qe,S=new P,p=new P;function u(O,E,M){c.fromBufferAttribute(n,O),d.fromBufferAttribute(n,E),h.fromBufferAttribute(n,M),f.fromBufferAttribute(r,O),m.fromBufferAttribute(r,E),x.fromBufferAttribute(r,M),d.sub(c),h.sub(c),m.sub(f),x.sub(f);const L=1/(m.x*x.y-x.x*m.y);isFinite(L)&&(S.copy(d).multiplyScalar(x.y).addScaledVector(h,-m.y).multiplyScalar(L),p.copy(h).multiplyScalar(m.x).addScaledVector(d,-x.x).multiplyScalar(L),o[O].add(S),o[E].add(S),o[M].add(S),l[O].add(p),l[E].add(p),l[M].add(p))}let w=this.groups;w.length===0&&(w=[{start:0,count:e.count}]);for(let O=0,E=w.length;O<E;++O){const M=w[O],L=M.start,k=M.count;for(let H=L,X=L+k;H<X;H+=3)u(e.getX(H+0),e.getX(H+1),e.getX(H+2))}const T=new P,y=new P,F=new P,D=new P;function C(O){F.fromBufferAttribute(s,O),D.copy(F);const E=o[O];T.copy(E),T.sub(F.multiplyScalar(F.dot(E))).normalize(),y.crossVectors(D,E);const L=y.dot(l[O])<0?-1:1;a.setXYZW(O,T.x,T.y,T.z,L)}for(let O=0,E=w.length;O<E;++O){const M=w[O],L=M.start,k=M.count;for(let H=L,X=L+k;H<X;H+=3)C(e.getX(H+0)),C(e.getX(H+1)),C(e.getX(H+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Pn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,m=n.count;f<m;f++)n.setXYZ(f,0,0,0);const s=new P,r=new P,a=new P,o=new P,l=new P,c=new P,d=new P,h=new P;if(e)for(let f=0,m=e.count;f<m;f+=3){const x=e.getX(f+0),S=e.getX(f+1),p=e.getX(f+2);s.fromBufferAttribute(t,x),r.fromBufferAttribute(t,S),a.fromBufferAttribute(t,p),d.subVectors(a,r),h.subVectors(s,r),d.cross(h),o.fromBufferAttribute(n,x),l.fromBufferAttribute(n,S),c.fromBufferAttribute(n,p),o.add(d),l.add(d),c.add(d),n.setXYZ(x,o.x,o.y,o.z),n.setXYZ(S,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let f=0,m=t.count;f<m;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),d.subVectors(a,r),h.subVectors(s,r),d.cross(h),n.setXYZ(f+0,d.x,d.y,d.z),n.setXYZ(f+1,d.x,d.y,d.z),n.setXYZ(f+2,d.x,d.y,d.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Gt.fromBufferAttribute(e,t),Gt.normalize(),e.setXYZ(t,Gt.x,Gt.y,Gt.z)}toNonIndexed(){function e(o,l){const c=o.array,d=o.itemSize,h=o.normalized,f=new c.constructor(l.length*d);let m=0,x=0;for(let S=0,p=l.length;S<p;S++){o.isInterleavedBufferAttribute?m=l[S]*o.data.stride+o.offset:m=l[S]*d;for(let u=0;u<d;u++)f[x++]=c[m++]}return new Pn(f,d,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Ct,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,n);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let d=0,h=c.length;d<h;d++){const f=c[d],m=e(f,n);l.push(m)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],d=[];for(let h=0,f=c.length;h<f;h++){const m=c[h];d.push(m.toJSON(e.data))}d.length>0&&(s[l]=d,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const s=e.attributes;for(const c in s){const d=s[c];this.setAttribute(c,d.clone(t))}const r=e.morphAttributes;for(const c in r){const d=[],h=r[c];for(let f=0,m=h.length;f<m;f++)d.push(h[f].clone(t));this.morphAttributes[c]=d}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,d=a.length;c<d;c++){const h=a[c];this.addGroup(h.start,h.count,h.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const To=new wt,ci=new lr,Us=new Ji,Ao=new P,Is=new P,Ns=new P,Fs=new P,Ur=new P,Os=new P,wo=new P,Bs=new P;class gt extends Bt{constructor(e=new Ct,t=new Ft){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){Os.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const d=o[l],h=r[l];d!==0&&(Ur.fromBufferAttribute(h,e),a?Os.addScaledVector(Ur,d):Os.addScaledVector(Ur.sub(t),d))}t.add(Os)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Us.copy(n.boundingSphere),Us.applyMatrix4(r),ci.copy(e.ray).recast(e.near),!(Us.containsPoint(ci.origin)===!1&&(ci.intersectSphere(Us,Ao)===null||ci.origin.distanceToSquared(Ao)>(e.far-e.near)**2))&&(To.copy(r).invert(),ci.copy(e.ray).applyMatrix4(To),!(n.boundingBox!==null&&ci.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,ci)))}_computeIntersections(e,t,n){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,d=r.attributes.uv1,h=r.attributes.normal,f=r.groups,m=r.drawRange;if(o!==null)if(Array.isArray(a))for(let x=0,S=f.length;x<S;x++){const p=f[x],u=a[p.materialIndex],w=Math.max(p.start,m.start),T=Math.min(o.count,Math.min(p.start+p.count,m.start+m.count));for(let y=w,F=T;y<F;y+=3){const D=o.getX(y),C=o.getX(y+1),O=o.getX(y+2);s=zs(this,u,e,n,c,d,h,D,C,O),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const x=Math.max(0,m.start),S=Math.min(o.count,m.start+m.count);for(let p=x,u=S;p<u;p+=3){const w=o.getX(p),T=o.getX(p+1),y=o.getX(p+2);s=zs(this,a,e,n,c,d,h,w,T,y),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let x=0,S=f.length;x<S;x++){const p=f[x],u=a[p.materialIndex],w=Math.max(p.start,m.start),T=Math.min(l.count,Math.min(p.start+p.count,m.start+m.count));for(let y=w,F=T;y<F;y+=3){const D=y,C=y+1,O=y+2;s=zs(this,u,e,n,c,d,h,D,C,O),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const x=Math.max(0,m.start),S=Math.min(l.count,m.start+m.count);for(let p=x,u=S;p<u;p+=3){const w=p,T=p+1,y=p+2;s=zs(this,a,e,n,c,d,h,w,T,y),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}}}function vu(i,e,t,n,s,r,a,o){let l;if(e.side===on?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===si,o),l===null)return null;Bs.copy(o),Bs.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(Bs);return c<t.near||c>t.far?null:{distance:c,point:Bs.clone(),object:i}}function zs(i,e,t,n,s,r,a,o,l,c){i.getVertexPosition(o,Is),i.getVertexPosition(l,Ns),i.getVertexPosition(c,Fs);const d=vu(i,e,t,n,Is,Ns,Fs,wo);if(d){const h=new P;yn.getBarycoord(wo,Is,Ns,Fs,h),s&&(d.uv=yn.getInterpolatedAttribute(s,o,l,c,h,new qe)),r&&(d.uv1=yn.getInterpolatedAttribute(r,o,l,c,h,new qe)),a&&(d.normal=yn.getInterpolatedAttribute(a,o,l,c,h,new P),d.normal.dot(n.direction)>0&&d.normal.multiplyScalar(-1));const f={a:o,b:l,c,normal:new P,materialIndex:0};yn.getNormal(Is,Ns,Fs,f.normal),d.face=f,d.barycoord=h}return d}class qt extends Ct{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],d=[],h=[];let f=0,m=0;x("z","y","x",-1,-1,n,t,e,a,r,0),x("z","y","x",1,-1,n,t,-e,a,r,1),x("x","z","y",1,1,e,n,t,s,a,2),x("x","z","y",1,-1,e,n,-t,s,a,3),x("x","y","z",1,-1,e,t,n,s,r,4),x("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new tn(c,3)),this.setAttribute("normal",new tn(d,3)),this.setAttribute("uv",new tn(h,2));function x(S,p,u,w,T,y,F,D,C,O,E){const M=y/C,L=F/O,k=y/2,H=F/2,X=D/2,$=C+1,W=O+1;let ee=0,q=0;const me=new P;for(let ye=0;ye<W;ye++){const De=ye*L-H;for(let je=0;je<$;je++){const Ge=je*M-k;me[S]=Ge*w,me[p]=De*T,me[u]=X,c.push(me.x,me.y,me.z),me[S]=0,me[p]=0,me[u]=D>0?1:-1,d.push(me.x,me.y,me.z),h.push(je/C),h.push(1-ye/O),ee+=1}}for(let ye=0;ye<O;ye++)for(let De=0;De<C;De++){const je=f+De+$*ye,Ge=f+De+$*(ye+1),K=f+(De+1)+$*(ye+1),ue=f+(De+1)+$*ye;l.push(je,Ge,ue),l.push(Ge,K,ue),q+=6}o.addGroup(m,q,E),m+=q,f+=ee}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new qt(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function $i(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function Jt(i){const e={};for(let t=0;t<i.length;t++){const n=$i(i[t]);for(const s in n)e[s]=n[s]}return e}function xu(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Nl(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ut.workingColorSpace}const Mu={clone:$i,merge:Jt};var Su=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Eu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ri extends Qi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Su,this.fragmentShader=Eu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=$i(e.uniforms),this.uniformsGroups=xu(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Fl extends Bt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new wt,this.projectionMatrix=new wt,this.projectionMatrixInverse=new wt,this.coordinateSystem=Wn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Qn=new P,Ro=new qe,Co=new qe;class gn extends Fl{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=_s*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(us*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return _s*2*Math.atan(Math.tan(us*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Qn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Qn.x,Qn.y).multiplyScalar(-e/Qn.z),Qn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Qn.x,Qn.y).multiplyScalar(-e/Qn.z)}getViewSize(e,t){return this.getViewBounds(e,Ro,Co),t.subVectors(Co,Ro)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(us*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Ni=-90,Fi=1;class yu extends Bt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new gn(Ni,Fi,e,t);s.layers=this.layers,this.add(s);const r=new gn(Ni,Fi,e,t);r.layers=this.layers,this.add(r);const a=new gn(Ni,Fi,e,t);a.layers=this.layers,this.add(a);const o=new gn(Ni,Fi,e,t);o.layers=this.layers,this.add(o);const l=new gn(Ni,Fi,e,t);l.layers=this.layers,this.add(l);const c=new gn(Ni,Fi,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===Wn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===nr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,d]=this.children,h=e.getRenderTarget(),f=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),x=e.xr.enabled;e.xr.enabled=!1;const S=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,a),e.setRenderTarget(n,2,s),e.render(t,o),e.setRenderTarget(n,3,s),e.render(t,l),e.setRenderTarget(n,4,s),e.render(t,c),n.texture.generateMipmaps=S,e.setRenderTarget(n,5,s),e.render(t,d),e.setRenderTarget(h,f,m),e.xr.enabled=x,n.texture.needsPMREMUpdate=!0}}class Ol extends en{constructor(e=[],t=Yi,n,s,r,a,o,l,c,d){super(e,t,n,s,r,a,o,l,c,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class bu extends Mi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Ol(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new qt(5,5,5),r=new ri({name:"CubemapFromEquirect",uniforms:$i(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:on,blending:ni});r.uniforms.tEquirect.value=t;const a=new gt(s,r),o=t.minFilter;return t.minFilter===_i&&(t.minFilter=Cn),new yu(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}}class Qt extends Bt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Tu={type:"move"};class Ir{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Qt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Qt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Qt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const S of e.hand.values()){const p=t.getJointPose(S,n),u=this._getHandJoint(c,S);p!==null&&(u.matrix.fromArray(p.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=p.radius),u.visible=p!==null}const d=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],f=d.position.distanceTo(h.position),m=.02,x=.005;c.inputState.pinching&&f>m+x?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=m-x&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Tu)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Qt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class Au extends Bt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ln,this.environmentIntensity=1,this.environmentRotation=new Ln,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Nr=new P,wu=new P,Ru=new Ke;class ei{constructor(e=new P(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=Nr.subVectors(n,t).cross(wu.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Nr),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Ru.getNormalMatrix(e),s=this.coplanarPoint(Nr).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ui=new Ji,Cu=new qe(.5,.5),Hs=new P;class Ka{constructor(e=new ei,t=new ei,n=new ei,s=new ei,r=new ei,a=new ei){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Wn){const n=this.planes,s=e.elements,r=s[0],a=s[1],o=s[2],l=s[3],c=s[4],d=s[5],h=s[6],f=s[7],m=s[8],x=s[9],S=s[10],p=s[11],u=s[12],w=s[13],T=s[14],y=s[15];if(n[0].setComponents(l-r,f-c,p-m,y-u).normalize(),n[1].setComponents(l+r,f+c,p+m,y+u).normalize(),n[2].setComponents(l+a,f+d,p+x,y+w).normalize(),n[3].setComponents(l-a,f-d,p-x,y-w).normalize(),n[4].setComponents(l-o,f-h,p-S,y-T).normalize(),t===Wn)n[5].setComponents(l+o,f+h,p+S,y+T).normalize();else if(t===nr)n[5].setComponents(o,h,S,T).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ui.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ui.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ui)}intersectsSprite(e){ui.center.set(0,0,0);const t=Cu.distanceTo(e.center);return ui.radius=.7071067811865476+t,ui.applyMatrix4(e.matrixWorld),this.intersectsSphere(ui)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(Hs.x=s.normal.x>0?e.max.x:e.min.x,Hs.y=s.normal.y>0?e.max.y:e.min.y,Hs.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Hs)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Gn extends Qi{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new lt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const sr=new P,rr=new P,Po=new wt,ls=new lr,Vs=new Ji,Fr=new P,Do=new P;class Vn extends Bt{constructor(e=new Ct,t=new Gn){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)sr.fromBufferAttribute(t,s-1),rr.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=sr.distanceTo(rr);e.setAttribute("lineDistance",new tn(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Vs.copy(n.boundingSphere),Vs.applyMatrix4(s),Vs.radius+=r,e.ray.intersectsSphere(Vs)===!1)return;Po.copy(s).invert(),ls.copy(e.ray).applyMatrix4(Po);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,d=n.index,f=n.attributes.position;if(d!==null){const m=Math.max(0,a.start),x=Math.min(d.count,a.start+a.count);for(let S=m,p=x-1;S<p;S+=c){const u=d.getX(S),w=d.getX(S+1),T=Gs(this,e,ls,l,u,w,S);T&&t.push(T)}if(this.isLineLoop){const S=d.getX(x-1),p=d.getX(m),u=Gs(this,e,ls,l,S,p,x-1);u&&t.push(u)}}else{const m=Math.max(0,a.start),x=Math.min(f.count,a.start+a.count);for(let S=m,p=x-1;S<p;S+=c){const u=Gs(this,e,ls,l,S,S+1,S);u&&t.push(u)}if(this.isLineLoop){const S=Gs(this,e,ls,l,x-1,m,x-1);S&&t.push(S)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Gs(i,e,t,n,s,r,a){const o=i.geometry.attributes.position;if(sr.fromBufferAttribute(o,s),rr.fromBufferAttribute(o,r),t.distanceSqToSegment(sr,rr,Fr,Do)>n)return;Fr.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(Fr);if(!(c<e.near||c>e.far))return{distance:c,point:Do.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}class Pu extends en{constructor(e,t,n,s,r,a,o,l,c){super(e,t,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Bl extends en{constructor(e,t,n=xi,s,r,a,o=Tn,l=Tn,c,d=ms,h=1){if(d!==ms&&d!==gs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:e,height:t,depth:h};super(f,s,r,a,o,l,d,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new ja(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class cr extends Ct{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const d=[],h=[],f=[],m=[];let x=0;const S=[],p=n/2;let u=0;w(),a===!1&&(e>0&&T(!0),t>0&&T(!1)),this.setIndex(d),this.setAttribute("position",new tn(h,3)),this.setAttribute("normal",new tn(f,3)),this.setAttribute("uv",new tn(m,2));function w(){const y=new P,F=new P;let D=0;const C=(t-e)/n;for(let O=0;O<=r;O++){const E=[],M=O/r,L=M*(t-e)+e;for(let k=0;k<=s;k++){const H=k/s,X=H*l+o,$=Math.sin(X),W=Math.cos(X);F.x=L*$,F.y=-M*n+p,F.z=L*W,h.push(F.x,F.y,F.z),y.set($,C,W).normalize(),f.push(y.x,y.y,y.z),m.push(H,1-M),E.push(x++)}S.push(E)}for(let O=0;O<s;O++)for(let E=0;E<r;E++){const M=S[E][O],L=S[E+1][O],k=S[E+1][O+1],H=S[E][O+1];(e>0||E!==0)&&(d.push(M,L,H),D+=3),(t>0||E!==r-1)&&(d.push(L,k,H),D+=3)}c.addGroup(u,D,0),u+=D}function T(y){const F=x,D=new qe,C=new P;let O=0;const E=y===!0?e:t,M=y===!0?1:-1;for(let k=1;k<=s;k++)h.push(0,p*M,0),f.push(0,M,0),m.push(.5,.5),x++;const L=x;for(let k=0;k<=s;k++){const X=k/s*l+o,$=Math.cos(X),W=Math.sin(X);C.x=E*W,C.y=p*M,C.z=E*$,h.push(C.x,C.y,C.z),f.push(0,M,0),D.x=$*.5+.5,D.y=W*.5*M+.5,m.push(D.x,D.y),x++}for(let k=0;k<s;k++){const H=F+k,X=L+k;y===!0?d.push(X,X+1,H):d.push(X+1,X,H),O+=3}c.addGroup(u,O,y===!0?1:2),u+=O}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new cr(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Ja extends cr{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new Ja(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class vi extends Ct{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,d=l+1,h=e/o,f=t/l,m=[],x=[],S=[],p=[];for(let u=0;u<d;u++){const w=u*f-a;for(let T=0;T<c;T++){const y=T*h-r;x.push(y,-w,0),S.push(0,0,1),p.push(T/o),p.push(1-u/l)}}for(let u=0;u<l;u++)for(let w=0;w<o;w++){const T=w+c*u,y=w+c*(u+1),F=w+1+c*(u+1),D=w+1+c*u;m.push(T,y,D),m.push(y,F,D)}this.setIndex(m),this.setAttribute("position",new tn(x,3)),this.setAttribute("normal",new tn(S,3)),this.setAttribute("uv",new tn(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new vi(e.width,e.height,e.widthSegments,e.heightSegments)}}class ds extends Ct{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const d=[],h=new P,f=new P,m=[],x=[],S=[],p=[];for(let u=0;u<=n;u++){const w=[],T=u/n;let y=0;u===0&&a===0?y=.5/t:u===n&&l===Math.PI&&(y=-.5/t);for(let F=0;F<=t;F++){const D=F/t;h.x=-e*Math.cos(s+D*r)*Math.sin(a+T*o),h.y=e*Math.cos(a+T*o),h.z=e*Math.sin(s+D*r)*Math.sin(a+T*o),x.push(h.x,h.y,h.z),f.copy(h).normalize(),S.push(f.x,f.y,f.z),p.push(D+y,1-T),w.push(c++)}d.push(w)}for(let u=0;u<n;u++)for(let w=0;w<t;w++){const T=d[u][w+1],y=d[u][w],F=d[u+1][w],D=d[u+1][w+1];(u!==0||a>0)&&m.push(T,y,D),(u!==n-1||l<Math.PI)&&m.push(y,F,D)}this.setIndex(m),this.setAttribute("position",new tn(x,3)),this.setAttribute("normal",new tn(S,3)),this.setAttribute("uv",new tn(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ds(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Or extends Qi{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new lt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new lt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Rl,this.normalScale=new qe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ln,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Du extends Qi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Ac,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Lu extends Qi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Lo extends Gn{constructor(e){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}}class zl extends Bt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new lt(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class Uu extends zl{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Bt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new lt(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Br=new wt,Uo=new P,Io=new P;class Iu{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new qe(512,512),this.mapType=Dn,this.map=null,this.mapPass=null,this.matrix=new wt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ka,this._frameExtents=new qe(1,1),this._viewportCount=1,this._viewports=[new Lt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Uo.setFromMatrixPosition(e.matrixWorld),t.position.copy(Uo),Io.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Io),t.updateMatrixWorld(),Br.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Br),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Br)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class Hl extends Fl{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=d*this.view.offsetY,l=o-d*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Nu extends Iu{constructor(){super(new Hl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Fu extends zl{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Bt.DEFAULT_UP),this.updateMatrix(),this.target=new Bt,this.shadow=new Nu}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Ou extends gn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const No=new wt;class Bu{constructor(e,t,n=0,s=1/0){this.ray=new lr(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new $a,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return No.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(No),this}intersectObject(e,t=!0,n=[]){return Oa(e,this,n,t),n.sort(Fo),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)Oa(e[s],this,n,t);return n.sort(Fo),n}}function Fo(i,e){return i.distance-e.distance}function Oa(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let a=0,o=r.length;a<o;a++)Oa(r[a],e,t,!0)}}class Oo{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=et(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(et(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const Bo=new P;let ks,zr;class Ws extends Bt{constructor(e=new P(0,0,1),t=new P(0,0,0),n=1,s=16776960,r=n*.2,a=r*.2){super(),this.type="ArrowHelper",ks===void 0&&(ks=new Ct,ks.setAttribute("position",new tn([0,0,0,0,1,0],3)),zr=new Ja(.5,1,5,1),zr.translate(0,-.5,0)),this.position.copy(t),this.line=new Vn(ks,new Gn({color:s,toneMapped:!1})),this.line.matrixAutoUpdate=!1,this.add(this.line),this.cone=new gt(zr,new Ft({color:s,toneMapped:!1})),this.cone.matrixAutoUpdate=!1,this.add(this.cone),this.setDirection(e),this.setLength(n,r,a)}setDirection(e){if(e.y>.99999)this.quaternion.set(0,0,0,1);else if(e.y<-.99999)this.quaternion.set(1,0,0,0);else{Bo.set(e.z,0,-e.x).normalize();const t=Math.acos(e.y);this.quaternion.setFromAxisAngle(Bo,t)}}setLength(e,t=e*.2,n=t*.2){this.line.scale.set(1,Math.max(1e-4,e-t),1),this.line.updateMatrix(),this.cone.scale.set(n,t,n),this.cone.position.y=e,this.cone.updateMatrix()}setColor(e){this.line.material.color.set(e),this.cone.material.color.set(e)}copy(e){return super.copy(e,!1),this.line.copy(e.line),this.cone.copy(e.cone),this}dispose(){this.line.geometry.dispose(),this.line.material.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}}class zu extends Si{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function zo(i,e,t,n){const s=Hu(n);switch(t){case yl:return i*e;case Tl:return i*e/s.components*s.byteLength;case Wa:return i*e/s.components*s.byteLength;case Al:return i*e*2/s.components*s.byteLength;case Xa:return i*e*2/s.components*s.byteLength;case bl:return i*e*3/s.components*s.byteLength;case bn:return i*e*4/s.components*s.byteLength;case qa:return i*e*4/s.components*s.byteLength;case js:case $s:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Ks:case Js:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case da:case pa:return Math.max(i,16)*Math.max(e,8)/4;case ha:case fa:return Math.max(i,8)*Math.max(e,8)/2;case ma:case ga:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case _a:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case va:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case xa:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Ma:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Sa:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Ea:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case ya:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case ba:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Ta:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Aa:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case wa:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Ra:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Ca:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Pa:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Da:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Qs:case La:case Ua:return Math.ceil(i/4)*Math.ceil(e/4)*16;case wl:case Ia:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Na:case Fa:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Hu(i){switch(i){case Dn:case Ml:return{byteLength:1,components:1};case fs:case Sl:case vs:return{byteLength:2,components:1};case Ga:case ka:return{byteLength:2,components:4};case xi:case Va:case kn:return{byteLength:4,components:1};case El:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ha}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ha);function Vl(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Vu(i){const e=new WeakMap;function t(o,l){const c=o.array,d=o.usage,h=c.byteLength,f=i.createBuffer();i.bindBuffer(l,f),i.bufferData(l,c,d),o.onUploadCallback();let m;if(c instanceof Float32Array)m=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)m=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?m=i.HALF_FLOAT:m=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=i.SHORT;else if(c instanceof Uint32Array)m=i.UNSIGNED_INT;else if(c instanceof Int32Array)m=i.INT;else if(c instanceof Int8Array)m=i.BYTE;else if(c instanceof Uint8Array)m=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:h}}function n(o,l,c){const d=l.array,h=l.updateRanges;if(i.bindBuffer(c,o),h.length===0)i.bufferSubData(c,0,d);else{h.sort((m,x)=>m.start-x.start);let f=0;for(let m=1;m<h.length;m++){const x=h[f],S=h[m];S.start<=x.start+x.count+1?x.count=Math.max(x.count,S.start+S.count-x.start):(++f,h[f]=S)}h.length=f+1;for(let m=0,x=h.length;m<x;m++){const S=h[m];i.bufferSubData(c,S.start*d.BYTES_PER_ELEMENT,d,S.start,S.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const d=e.get(o);(!d||d.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var Gu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,ku=`#ifdef USE_ALPHAHASH
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
#endif`,Wu=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Xu=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,qu=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Yu=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Zu=`#ifdef USE_AOMAP
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
#endif`,ju=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,$u=`#ifdef USE_BATCHING
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
#endif`,Ku=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Ju=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Qu=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,eh=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,th=`#ifdef USE_IRIDESCENCE
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
#endif`,nh=`#ifdef USE_BUMPMAP
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
#endif`,ih=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,sh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,rh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,ah=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,oh=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,lh=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,ch=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,uh=`#if defined( USE_COLOR_ALPHA )
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
#endif`,hh=`#define PI 3.141592653589793
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
} // validated`,dh=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,fh=`vec3 transformedNormal = objectNormal;
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
#endif`,ph=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,mh=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,gh=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,_h=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,vh="gl_FragColor = linearToOutputTexel( gl_FragColor );",xh=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Mh=`#ifdef USE_ENVMAP
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
#endif`,Sh=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Eh=`#ifdef USE_ENVMAP
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
#endif`,yh=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,bh=`#ifdef USE_ENVMAP
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
#endif`,Th=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Ah=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,wh=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Rh=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Ch=`#ifdef USE_GRADIENTMAP
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
}`,Ph=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Dh=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Lh=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Uh=`uniform bool receiveShadow;
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
#endif`,Ih=`#ifdef USE_ENVMAP
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
#endif`,Nh=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Fh=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Oh=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Bh=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,zh=`PhysicalMaterial material;
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
#endif`,Hh=`struct PhysicalMaterial {
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
}`,Vh=`
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
#endif`,Gh=`#if defined( RE_IndirectDiffuse )
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
#endif`,kh=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Wh=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Xh=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,qh=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Yh=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Zh=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,jh=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,$h=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Kh=`#if defined( USE_POINTS_UV )
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
#endif`,Jh=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Qh=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ed=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,td=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,nd=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,id=`#ifdef USE_MORPHTARGETS
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
#endif`,sd=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,rd=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,ad=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,od=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ld=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,cd=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,ud=`#ifdef USE_NORMALMAP
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
#endif`,hd=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,dd=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,fd=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,pd=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,md=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,gd=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,_d=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,vd=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,xd=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Md=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Sd=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Ed=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,yd=`#if NUM_SPOT_LIGHT_COORDS > 0
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
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
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
#endif`,bd=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Td=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Ad=`float getShadowMask() {
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
}`,wd=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Rd=`#ifdef USE_SKINNING
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
#endif`,Cd=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Pd=`#ifdef USE_SKINNING
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
#endif`,Dd=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Ld=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Ud=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Id=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Nd=`#ifdef USE_TRANSMISSION
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
#endif`,Fd=`#ifdef USE_TRANSMISSION
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
#endif`,Od=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Bd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,zd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Hd=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Vd=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Gd=`uniform sampler2D t2D;
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
}`,kd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Wd=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Xd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,qd=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Yd=`#include <common>
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
}`,Zd=`#if DEPTH_PACKING == 3200
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
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,jd=`#define DISTANCE
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
}`,$d=`#define DISTANCE
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
}`,Kd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Jd=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Qd=`uniform float scale;
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
}`,ef=`uniform vec3 diffuse;
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
}`,tf=`#include <common>
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
}`,nf=`uniform vec3 diffuse;
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
}`,sf=`#define LAMBERT
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
}`,rf=`#define LAMBERT
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
}`,af=`#define MATCAP
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
}`,of=`#define MATCAP
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
}`,lf=`#define NORMAL
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
}`,cf=`#define NORMAL
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
}`,uf=`#define PHONG
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
}`,hf=`#define PHONG
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
}`,df=`#define STANDARD
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
}`,ff=`#define STANDARD
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
}`,pf=`#define TOON
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
}`,mf=`#define TOON
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
}`,gf=`uniform float size;
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
}`,_f=`uniform vec3 diffuse;
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
}`,vf=`#include <common>
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
}`,xf=`uniform vec3 color;
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
}`,Mf=`uniform float rotation;
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
}`,Sf=`uniform vec3 diffuse;
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
}`,Je={alphahash_fragment:Gu,alphahash_pars_fragment:ku,alphamap_fragment:Wu,alphamap_pars_fragment:Xu,alphatest_fragment:qu,alphatest_pars_fragment:Yu,aomap_fragment:Zu,aomap_pars_fragment:ju,batching_pars_vertex:$u,batching_vertex:Ku,begin_vertex:Ju,beginnormal_vertex:Qu,bsdfs:eh,iridescence_fragment:th,bumpmap_pars_fragment:nh,clipping_planes_fragment:ih,clipping_planes_pars_fragment:sh,clipping_planes_pars_vertex:rh,clipping_planes_vertex:ah,color_fragment:oh,color_pars_fragment:lh,color_pars_vertex:ch,color_vertex:uh,common:hh,cube_uv_reflection_fragment:dh,defaultnormal_vertex:fh,displacementmap_pars_vertex:ph,displacementmap_vertex:mh,emissivemap_fragment:gh,emissivemap_pars_fragment:_h,colorspace_fragment:vh,colorspace_pars_fragment:xh,envmap_fragment:Mh,envmap_common_pars_fragment:Sh,envmap_pars_fragment:Eh,envmap_pars_vertex:yh,envmap_physical_pars_fragment:Ih,envmap_vertex:bh,fog_vertex:Th,fog_pars_vertex:Ah,fog_fragment:wh,fog_pars_fragment:Rh,gradientmap_pars_fragment:Ch,lightmap_pars_fragment:Ph,lights_lambert_fragment:Dh,lights_lambert_pars_fragment:Lh,lights_pars_begin:Uh,lights_toon_fragment:Nh,lights_toon_pars_fragment:Fh,lights_phong_fragment:Oh,lights_phong_pars_fragment:Bh,lights_physical_fragment:zh,lights_physical_pars_fragment:Hh,lights_fragment_begin:Vh,lights_fragment_maps:Gh,lights_fragment_end:kh,logdepthbuf_fragment:Wh,logdepthbuf_pars_fragment:Xh,logdepthbuf_pars_vertex:qh,logdepthbuf_vertex:Yh,map_fragment:Zh,map_pars_fragment:jh,map_particle_fragment:$h,map_particle_pars_fragment:Kh,metalnessmap_fragment:Jh,metalnessmap_pars_fragment:Qh,morphinstance_vertex:ed,morphcolor_vertex:td,morphnormal_vertex:nd,morphtarget_pars_vertex:id,morphtarget_vertex:sd,normal_fragment_begin:rd,normal_fragment_maps:ad,normal_pars_fragment:od,normal_pars_vertex:ld,normal_vertex:cd,normalmap_pars_fragment:ud,clearcoat_normal_fragment_begin:hd,clearcoat_normal_fragment_maps:dd,clearcoat_pars_fragment:fd,iridescence_pars_fragment:pd,opaque_fragment:md,packing:gd,premultiplied_alpha_fragment:_d,project_vertex:vd,dithering_fragment:xd,dithering_pars_fragment:Md,roughnessmap_fragment:Sd,roughnessmap_pars_fragment:Ed,shadowmap_pars_fragment:yd,shadowmap_pars_vertex:bd,shadowmap_vertex:Td,shadowmask_pars_fragment:Ad,skinbase_vertex:wd,skinning_pars_vertex:Rd,skinning_vertex:Cd,skinnormal_vertex:Pd,specularmap_fragment:Dd,specularmap_pars_fragment:Ld,tonemapping_fragment:Ud,tonemapping_pars_fragment:Id,transmission_fragment:Nd,transmission_pars_fragment:Fd,uv_pars_fragment:Od,uv_pars_vertex:Bd,uv_vertex:zd,worldpos_vertex:Hd,background_vert:Vd,background_frag:Gd,backgroundCube_vert:kd,backgroundCube_frag:Wd,cube_vert:Xd,cube_frag:qd,depth_vert:Yd,depth_frag:Zd,distanceRGBA_vert:jd,distanceRGBA_frag:$d,equirect_vert:Kd,equirect_frag:Jd,linedashed_vert:Qd,linedashed_frag:ef,meshbasic_vert:tf,meshbasic_frag:nf,meshlambert_vert:sf,meshlambert_frag:rf,meshmatcap_vert:af,meshmatcap_frag:of,meshnormal_vert:lf,meshnormal_frag:cf,meshphong_vert:uf,meshphong_frag:hf,meshphysical_vert:df,meshphysical_frag:ff,meshtoon_vert:pf,meshtoon_frag:mf,points_vert:gf,points_frag:_f,shadow_vert:vf,shadow_frag:xf,sprite_vert:Mf,sprite_frag:Sf},_e={common:{diffuse:{value:new lt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ke},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ke}},envmap:{envMap:{value:null},envMapRotation:{value:new Ke},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ke}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ke}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ke},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ke},normalScale:{value:new qe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ke},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ke}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ke}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ke}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new lt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new lt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0},uvTransform:{value:new Ke}},sprite:{diffuse:{value:new lt(16777215)},opacity:{value:1},center:{value:new qe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ke},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0}}},Rn={basic:{uniforms:Jt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.fog]),vertexShader:Je.meshbasic_vert,fragmentShader:Je.meshbasic_frag},lambert:{uniforms:Jt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,_e.lights,{emissive:{value:new lt(0)}}]),vertexShader:Je.meshlambert_vert,fragmentShader:Je.meshlambert_frag},phong:{uniforms:Jt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,_e.lights,{emissive:{value:new lt(0)},specular:{value:new lt(1118481)},shininess:{value:30}}]),vertexShader:Je.meshphong_vert,fragmentShader:Je.meshphong_frag},standard:{uniforms:Jt([_e.common,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.roughnessmap,_e.metalnessmap,_e.fog,_e.lights,{emissive:{value:new lt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Je.meshphysical_vert,fragmentShader:Je.meshphysical_frag},toon:{uniforms:Jt([_e.common,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.gradientmap,_e.fog,_e.lights,{emissive:{value:new lt(0)}}]),vertexShader:Je.meshtoon_vert,fragmentShader:Je.meshtoon_frag},matcap:{uniforms:Jt([_e.common,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,{matcap:{value:null}}]),vertexShader:Je.meshmatcap_vert,fragmentShader:Je.meshmatcap_frag},points:{uniforms:Jt([_e.points,_e.fog]),vertexShader:Je.points_vert,fragmentShader:Je.points_frag},dashed:{uniforms:Jt([_e.common,_e.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Je.linedashed_vert,fragmentShader:Je.linedashed_frag},depth:{uniforms:Jt([_e.common,_e.displacementmap]),vertexShader:Je.depth_vert,fragmentShader:Je.depth_frag},normal:{uniforms:Jt([_e.common,_e.bumpmap,_e.normalmap,_e.displacementmap,{opacity:{value:1}}]),vertexShader:Je.meshnormal_vert,fragmentShader:Je.meshnormal_frag},sprite:{uniforms:Jt([_e.sprite,_e.fog]),vertexShader:Je.sprite_vert,fragmentShader:Je.sprite_frag},background:{uniforms:{uvTransform:{value:new Ke},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Je.background_vert,fragmentShader:Je.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ke}},vertexShader:Je.backgroundCube_vert,fragmentShader:Je.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Je.cube_vert,fragmentShader:Je.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Je.equirect_vert,fragmentShader:Je.equirect_frag},distanceRGBA:{uniforms:Jt([_e.common,_e.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Je.distanceRGBA_vert,fragmentShader:Je.distanceRGBA_frag},shadow:{uniforms:Jt([_e.lights,_e.fog,{color:{value:new lt(0)},opacity:{value:1}}]),vertexShader:Je.shadow_vert,fragmentShader:Je.shadow_frag}};Rn.physical={uniforms:Jt([Rn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ke},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ke},clearcoatNormalScale:{value:new qe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ke},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ke},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ke},sheen:{value:0},sheenColor:{value:new lt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ke},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ke},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ke},transmissionSamplerSize:{value:new qe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ke},attenuationDistance:{value:0},attenuationColor:{value:new lt(0)},specularColor:{value:new lt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ke},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ke},anisotropyVector:{value:new qe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ke}}]),vertexShader:Je.meshphysical_vert,fragmentShader:Je.meshphysical_frag};const Xs={r:0,b:0,g:0},hi=new Ln,Ef=new wt;function yf(i,e,t,n,s,r,a){const o=new lt(0);let l=r===!0?0:1,c,d,h=null,f=0,m=null;function x(T){let y=T.isScene===!0?T.background:null;return y&&y.isTexture&&(y=(T.backgroundBlurriness>0?t:e).get(y)),y}function S(T){let y=!1;const F=x(T);F===null?u(o,l):F&&F.isColor&&(u(F,1),y=!0);const D=i.xr.getEnvironmentBlendMode();D==="additive"?n.buffers.color.setClear(0,0,0,1,a):D==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||y)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function p(T,y){const F=x(y);F&&(F.isCubeTexture||F.mapping===or)?(d===void 0&&(d=new gt(new qt(1,1,1),new ri({name:"BackgroundCubeMaterial",uniforms:$i(Rn.backgroundCube.uniforms),vertexShader:Rn.backgroundCube.vertexShader,fragmentShader:Rn.backgroundCube.fragmentShader,side:on,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(D,C,O){this.matrixWorld.copyPosition(O.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(d)),hi.copy(y.backgroundRotation),hi.x*=-1,hi.y*=-1,hi.z*=-1,F.isCubeTexture&&F.isRenderTargetTexture===!1&&(hi.y*=-1,hi.z*=-1),d.material.uniforms.envMap.value=F,d.material.uniforms.flipEnvMap.value=F.isCubeTexture&&F.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(Ef.makeRotationFromEuler(hi)),d.material.toneMapped=ut.getTransfer(F.colorSpace)!==Mt,(h!==F||f!==F.version||m!==i.toneMapping)&&(d.material.needsUpdate=!0,h=F,f=F.version,m=i.toneMapping),d.layers.enableAll(),T.unshift(d,d.geometry,d.material,0,0,null)):F&&F.isTexture&&(c===void 0&&(c=new gt(new vi(2,2),new ri({name:"BackgroundMaterial",uniforms:$i(Rn.background.uniforms),vertexShader:Rn.background.vertexShader,fragmentShader:Rn.background.fragmentShader,side:si,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=F,c.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,c.material.toneMapped=ut.getTransfer(F.colorSpace)!==Mt,F.matrixAutoUpdate===!0&&F.updateMatrix(),c.material.uniforms.uvTransform.value.copy(F.matrix),(h!==F||f!==F.version||m!==i.toneMapping)&&(c.material.needsUpdate=!0,h=F,f=F.version,m=i.toneMapping),c.layers.enableAll(),T.unshift(c,c.geometry,c.material,0,0,null))}function u(T,y){T.getRGB(Xs,Nl(i)),n.buffers.color.setClear(Xs.r,Xs.g,Xs.b,y,a)}function w(){d!==void 0&&(d.geometry.dispose(),d.material.dispose(),d=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(T,y=1){o.set(T),l=y,u(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(T){l=T,u(o,l)},render:S,addToRenderList:p,dispose:w}}function bf(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null);let r=s,a=!1;function o(M,L,k,H,X){let $=!1;const W=h(H,k,L);r!==W&&(r=W,c(r.object)),$=m(M,H,k,X),$&&x(M,H,k,X),X!==null&&e.update(X,i.ELEMENT_ARRAY_BUFFER),($||a)&&(a=!1,y(M,L,k,H),X!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(X).buffer))}function l(){return i.createVertexArray()}function c(M){return i.bindVertexArray(M)}function d(M){return i.deleteVertexArray(M)}function h(M,L,k){const H=k.wireframe===!0;let X=n[M.id];X===void 0&&(X={},n[M.id]=X);let $=X[L.id];$===void 0&&($={},X[L.id]=$);let W=$[H];return W===void 0&&(W=f(l()),$[H]=W),W}function f(M){const L=[],k=[],H=[];for(let X=0;X<t;X++)L[X]=0,k[X]=0,H[X]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:k,attributeDivisors:H,object:M,attributes:{},index:null}}function m(M,L,k,H){const X=r.attributes,$=L.attributes;let W=0;const ee=k.getAttributes();for(const q in ee)if(ee[q].location>=0){const ye=X[q];let De=$[q];if(De===void 0&&(q==="instanceMatrix"&&M.instanceMatrix&&(De=M.instanceMatrix),q==="instanceColor"&&M.instanceColor&&(De=M.instanceColor)),ye===void 0||ye.attribute!==De||De&&ye.data!==De.data)return!0;W++}return r.attributesNum!==W||r.index!==H}function x(M,L,k,H){const X={},$=L.attributes;let W=0;const ee=k.getAttributes();for(const q in ee)if(ee[q].location>=0){let ye=$[q];ye===void 0&&(q==="instanceMatrix"&&M.instanceMatrix&&(ye=M.instanceMatrix),q==="instanceColor"&&M.instanceColor&&(ye=M.instanceColor));const De={};De.attribute=ye,ye&&ye.data&&(De.data=ye.data),X[q]=De,W++}r.attributes=X,r.attributesNum=W,r.index=H}function S(){const M=r.newAttributes;for(let L=0,k=M.length;L<k;L++)M[L]=0}function p(M){u(M,0)}function u(M,L){const k=r.newAttributes,H=r.enabledAttributes,X=r.attributeDivisors;k[M]=1,H[M]===0&&(i.enableVertexAttribArray(M),H[M]=1),X[M]!==L&&(i.vertexAttribDivisor(M,L),X[M]=L)}function w(){const M=r.newAttributes,L=r.enabledAttributes;for(let k=0,H=L.length;k<H;k++)L[k]!==M[k]&&(i.disableVertexAttribArray(k),L[k]=0)}function T(M,L,k,H,X,$,W){W===!0?i.vertexAttribIPointer(M,L,k,X,$):i.vertexAttribPointer(M,L,k,H,X,$)}function y(M,L,k,H){S();const X=H.attributes,$=k.getAttributes(),W=L.defaultAttributeValues;for(const ee in $){const q=$[ee];if(q.location>=0){let me=X[ee];if(me===void 0&&(ee==="instanceMatrix"&&M.instanceMatrix&&(me=M.instanceMatrix),ee==="instanceColor"&&M.instanceColor&&(me=M.instanceColor)),me!==void 0){const ye=me.normalized,De=me.itemSize,je=e.get(me);if(je===void 0)continue;const Ge=je.buffer,K=je.type,ue=je.bytesPerElement,Ue=K===i.INT||K===i.UNSIGNED_INT||me.gpuType===Va;if(me.isInterleavedBufferAttribute){const fe=me.data,Ne=fe.stride,nt=me.offset;if(fe.isInstancedInterleavedBuffer){for(let ze=0;ze<q.locationSize;ze++)u(q.location+ze,fe.meshPerAttribute);M.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=fe.meshPerAttribute*fe.count)}else for(let ze=0;ze<q.locationSize;ze++)p(q.location+ze);i.bindBuffer(i.ARRAY_BUFFER,Ge);for(let ze=0;ze<q.locationSize;ze++)T(q.location+ze,De/q.locationSize,K,ye,Ne*ue,(nt+De/q.locationSize*ze)*ue,Ue)}else{if(me.isInstancedBufferAttribute){for(let fe=0;fe<q.locationSize;fe++)u(q.location+fe,me.meshPerAttribute);M.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=me.meshPerAttribute*me.count)}else for(let fe=0;fe<q.locationSize;fe++)p(q.location+fe);i.bindBuffer(i.ARRAY_BUFFER,Ge);for(let fe=0;fe<q.locationSize;fe++)T(q.location+fe,De/q.locationSize,K,ye,De*ue,De/q.locationSize*fe*ue,Ue)}}else if(W!==void 0){const ye=W[ee];if(ye!==void 0)switch(ye.length){case 2:i.vertexAttrib2fv(q.location,ye);break;case 3:i.vertexAttrib3fv(q.location,ye);break;case 4:i.vertexAttrib4fv(q.location,ye);break;default:i.vertexAttrib1fv(q.location,ye)}}}}w()}function F(){O();for(const M in n){const L=n[M];for(const k in L){const H=L[k];for(const X in H)d(H[X].object),delete H[X];delete L[k]}delete n[M]}}function D(M){if(n[M.id]===void 0)return;const L=n[M.id];for(const k in L){const H=L[k];for(const X in H)d(H[X].object),delete H[X];delete L[k]}delete n[M.id]}function C(M){for(const L in n){const k=n[L];if(k[M.id]===void 0)continue;const H=k[M.id];for(const X in H)d(H[X].object),delete H[X];delete k[M.id]}}function O(){E(),a=!0,r!==s&&(r=s,c(r.object))}function E(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:O,resetDefaultState:E,dispose:F,releaseStatesOfGeometry:D,releaseStatesOfProgram:C,initAttributes:S,enableAttribute:p,disableUnusedAttributes:w}}function Tf(i,e,t){let n;function s(c){n=c}function r(c,d){i.drawArrays(n,c,d),t.update(d,n,1)}function a(c,d,h){h!==0&&(i.drawArraysInstanced(n,c,d,h),t.update(d,n,h))}function o(c,d,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,d,0,h);let m=0;for(let x=0;x<h;x++)m+=d[x];t.update(m,n,1)}function l(c,d,h,f){if(h===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let x=0;x<c.length;x++)a(c[x],d[x],f[x]);else{m.multiDrawArraysInstancedWEBGL(n,c,0,d,0,f,0,h);let x=0;for(let S=0;S<h;S++)x+=d[S]*f[S];t.update(x,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function Af(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(C){return!(C!==bn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){const O=C===vs&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==Dn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==kn&&!O)}function l(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const d=l(c);d!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",d,"instead."),c=d);const h=t.logarithmicDepthBuffer===!0,f=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),m=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),S=i.getParameter(i.MAX_TEXTURE_SIZE),p=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),u=i.getParameter(i.MAX_VERTEX_ATTRIBS),w=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),T=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),F=x>0,D=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:h,reverseDepthBuffer:f,maxTextures:m,maxVertexTextures:x,maxTextureSize:S,maxCubemapSize:p,maxAttributes:u,maxVertexUniforms:w,maxVaryings:T,maxFragmentUniforms:y,vertexTextures:F,maxSamples:D}}function wf(i){const e=this;let t=null,n=0,s=!1,r=!1;const a=new ei,o=new Ke,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,f){const m=h.length!==0||f||n!==0||s;return s=f,n=h.length,m},this.beginShadows=function(){r=!0,d(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,f){t=d(h,f,0)},this.setState=function(h,f,m){const x=h.clippingPlanes,S=h.clipIntersection,p=h.clipShadows,u=i.get(h);if(!s||x===null||x.length===0||r&&!p)r?d(null):c();else{const w=r?0:n,T=w*4;let y=u.clippingState||null;l.value=y,y=d(x,f,T,m);for(let F=0;F!==T;++F)y[F]=t[F];u.clippingState=y,this.numIntersection=S?this.numPlanes:0,this.numPlanes+=w}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function d(h,f,m,x){const S=h!==null?h.length:0;let p=null;if(S!==0){if(p=l.value,x!==!0||p===null){const u=m+S*4,w=f.matrixWorldInverse;o.getNormalMatrix(w),(p===null||p.length<u)&&(p=new Float32Array(u));for(let T=0,y=m;T!==S;++T,y+=4)a.copy(h[T]).applyMatrix4(w,o),a.normal.toArray(p,y),p[y+3]=a.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=S,e.numIntersection=0,p}}function Rf(i){let e=new WeakMap;function t(a,o){return o===oa?a.mapping=Yi:o===la&&(a.mapping=Zi),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===oa||o===la)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new bu(l.height);return c.fromEquirectangularTexture(i,a),e.set(a,c),a.addEventListener("dispose",s),t(c.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}const Vi=4,Ho=[.125,.215,.35,.446,.526,.582],mi=20,Hr=new Hl,Vo=new lt;let Vr=null,Gr=0,kr=0,Wr=!1;const fi=(1+Math.sqrt(5))/2,Oi=1/fi,Go=[new P(-fi,Oi,0),new P(fi,Oi,0),new P(-Oi,0,fi),new P(Oi,0,fi),new P(0,fi,-Oi),new P(0,fi,Oi),new P(-1,1,-1),new P(1,1,-1),new P(-1,1,1),new P(1,1,1)],Cf=new P;class ko{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100,r={}){const{size:a=256,position:o=Cf}=r;Vr=this._renderer.getRenderTarget(),Gr=this._renderer.getActiveCubeFace(),kr=this._renderer.getActiveMipmapLevel(),Wr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=qo(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Xo(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Vr,Gr,kr),this._renderer.xr.enabled=Wr,e.scissorTest=!1,qs(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Yi||e.mapping===Zi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Vr=this._renderer.getRenderTarget(),Gr=this._renderer.getActiveCubeFace(),kr=this._renderer.getActiveMipmapLevel(),Wr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Cn,minFilter:Cn,generateMipmaps:!1,type:vs,format:bn,colorSpace:ji,depthBuffer:!1},s=Wo(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Wo(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Pf(r)),this._blurMaterial=Df(r,e,t)}return s}_compileMaterial(e){const t=new gt(this._lodPlanes[0],e);this._renderer.compile(t,Hr)}_sceneToCubeUV(e,t,n,s,r){const l=new gn(90,1,t,n),c=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,m=h.toneMapping;h.getClearColor(Vo),h.toneMapping=ii,h.autoClear=!1;const x=new Ft({name:"PMREM.Background",side:on,depthWrite:!1,depthTest:!1}),S=new gt(new qt,x);let p=!1;const u=e.background;u?u.isColor&&(x.color.copy(u),e.background=null,p=!0):(x.color.copy(Vo),p=!0);for(let w=0;w<6;w++){const T=w%3;T===0?(l.up.set(0,c[w],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+d[w],r.y,r.z)):T===1?(l.up.set(0,0,c[w]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+d[w],r.z)):(l.up.set(0,c[w],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+d[w]));const y=this._cubeSize;qs(s,T*y,w>2?y:0,y,y),h.setRenderTarget(s),p&&h.render(S,l),h.render(e,l)}S.geometry.dispose(),S.material.dispose(),h.toneMapping=m,h.autoClear=f,e.background=u}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===Yi||e.mapping===Zi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=qo()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Xo());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new gt(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;qs(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,Hr)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=Go[(s-r-1)%Go.length];this._blur(e,r-1,r,a,o)}t.autoClear=n}_blur(e,t,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,h=new gt(this._lodPlanes[s],c),f=c.uniforms,m=this._sizeLods[n]-1,x=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*mi-1),S=r/x,p=isFinite(r)?1+Math.floor(d*S):mi;p>mi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${mi}`);const u=[];let w=0;for(let C=0;C<mi;++C){const O=C/S,E=Math.exp(-O*O/2);u.push(E),C===0?w+=E:C<p&&(w+=2*E)}for(let C=0;C<u.length;C++)u[C]=u[C]/w;f.envMap.value=e.texture,f.samples.value=p,f.weights.value=u,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:T}=this;f.dTheta.value=x,f.mipInt.value=T-n;const y=this._sizeLods[s],F=3*y*(s>T-Vi?s-T+Vi:0),D=4*(this._cubeSize-y);qs(t,F,D,3*y,2*y),l.setRenderTarget(t),l.render(h,Hr)}}function Pf(i){const e=[],t=[],n=[];let s=i;const r=i-Vi+1+Ho.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);t.push(o);let l=1/o;a>i-Vi?l=Ho[a-i+Vi-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),d=-c,h=1+c,f=[d,d,h,d,h,h,d,d,h,h,d,h],m=6,x=6,S=3,p=2,u=1,w=new Float32Array(S*x*m),T=new Float32Array(p*x*m),y=new Float32Array(u*x*m);for(let D=0;D<m;D++){const C=D%3*2/3-1,O=D>2?0:-1,E=[C,O,0,C+2/3,O,0,C+2/3,O+1,0,C,O,0,C+2/3,O+1,0,C,O+1,0];w.set(E,S*x*D),T.set(f,p*x*D);const M=[D,D,D,D,D,D];y.set(M,u*x*D)}const F=new Ct;F.setAttribute("position",new Pn(w,S)),F.setAttribute("uv",new Pn(T,p)),F.setAttribute("faceIndex",new Pn(y,u)),e.push(F),s>Vi&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Wo(i,e,t){const n=new Mi(i,e,t);return n.texture.mapping=or,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function qs(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function Df(i,e,t){const n=new Float32Array(mi),s=new P(0,1,0);return new ri({name:"SphericalGaussianBlur",defines:{n:mi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Qa(),fragmentShader:`

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
		`,blending:ni,depthTest:!1,depthWrite:!1})}function Xo(){return new ri({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Qa(),fragmentShader:`

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
		`,blending:ni,depthTest:!1,depthWrite:!1})}function qo(){return new ri({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Qa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ni,depthTest:!1,depthWrite:!1})}function Qa(){return`

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
	`}function Lf(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===oa||l===la,d=l===Yi||l===Zi;if(c||d){let h=e.get(o);const f=h!==void 0?h.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return t===null&&(t=new ko(i)),h=c?t.fromEquirectangular(o,h):t.fromCubemap(o,h),h.texture.pmremVersion=o.pmremVersion,e.set(o,h),h.texture;if(h!==void 0)return h.texture;{const m=o.image;return c&&m&&m.height>0||d&&m&&s(m)?(t===null&&(t=new ko(i)),h=c?t.fromEquirectangular(o):t.fromCubemap(o),h.texture.pmremVersion=o.pmremVersion,e.set(o,h),o.addEventListener("dispose",r),h.texture):null}}}return o}function s(o){let l=0;const c=6;for(let d=0;d<c;d++)o[d]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function Uf(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&Wi("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function If(i,e,t,n){const s={},r=new WeakMap;function a(h){const f=h.target;f.index!==null&&e.remove(f.index);for(const x in f.attributes)e.remove(f.attributes[x]);f.removeEventListener("dispose",a),delete s[f.id];const m=r.get(f);m&&(e.remove(m),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(h,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,t.memory.geometries++),f}function l(h){const f=h.attributes;for(const m in f)e.update(f[m],i.ARRAY_BUFFER)}function c(h){const f=[],m=h.index,x=h.attributes.position;let S=0;if(m!==null){const w=m.array;S=m.version;for(let T=0,y=w.length;T<y;T+=3){const F=w[T+0],D=w[T+1],C=w[T+2];f.push(F,D,D,C,C,F)}}else if(x!==void 0){const w=x.array;S=x.version;for(let T=0,y=w.length/3-1;T<y;T+=3){const F=T+0,D=T+1,C=T+2;f.push(F,D,D,C,C,F)}}else return;const p=new(Pl(f)?Il:Ul)(f,1);p.version=S;const u=r.get(h);u&&e.remove(u),r.set(h,p)}function d(h){const f=r.get(h);if(f){const m=h.index;m!==null&&f.version<m.version&&c(h)}else c(h);return r.get(h)}return{get:o,update:l,getWireframeAttribute:d}}function Nf(i,e,t){let n;function s(f){n=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function l(f,m){i.drawElements(n,m,r,f*a),t.update(m,n,1)}function c(f,m,x){x!==0&&(i.drawElementsInstanced(n,m,r,f*a,x),t.update(m,n,x))}function d(f,m,x){if(x===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,m,0,r,f,0,x);let p=0;for(let u=0;u<x;u++)p+=m[u];t.update(p,n,1)}function h(f,m,x,S){if(x===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let u=0;u<f.length;u++)c(f[u]/a,m[u],S[u]);else{p.multiDrawElementsInstancedWEBGL(n,m,0,r,f,0,S,0,x);let u=0;for(let w=0;w<x;w++)u+=m[w]*S[w];t.update(u,n,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=d,this.renderMultiDrawInstances=h}function Ff(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function Of(i,e,t){const n=new WeakMap,s=new Lt;function r(a,o,l){const c=a.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=d!==void 0?d.length:0;let f=n.get(o);if(f===void 0||f.count!==h){let M=function(){O.dispose(),n.delete(o),o.removeEventListener("dispose",M)};var m=M;f!==void 0&&f.texture.dispose();const x=o.morphAttributes.position!==void 0,S=o.morphAttributes.normal!==void 0,p=o.morphAttributes.color!==void 0,u=o.morphAttributes.position||[],w=o.morphAttributes.normal||[],T=o.morphAttributes.color||[];let y=0;x===!0&&(y=1),S===!0&&(y=2),p===!0&&(y=3);let F=o.attributes.position.count*y,D=1;F>e.maxTextureSize&&(D=Math.ceil(F/e.maxTextureSize),F=e.maxTextureSize);const C=new Float32Array(F*D*4*h),O=new Dl(C,F,D,h);O.type=kn,O.needsUpdate=!0;const E=y*4;for(let L=0;L<h;L++){const k=u[L],H=w[L],X=T[L],$=F*D*4*L;for(let W=0;W<k.count;W++){const ee=W*E;x===!0&&(s.fromBufferAttribute(k,W),C[$+ee+0]=s.x,C[$+ee+1]=s.y,C[$+ee+2]=s.z,C[$+ee+3]=0),S===!0&&(s.fromBufferAttribute(H,W),C[$+ee+4]=s.x,C[$+ee+5]=s.y,C[$+ee+6]=s.z,C[$+ee+7]=0),p===!0&&(s.fromBufferAttribute(X,W),C[$+ee+8]=s.x,C[$+ee+9]=s.y,C[$+ee+10]=s.z,C[$+ee+11]=X.itemSize===4?s.w:1)}}f={count:h,texture:O,size:new qe(F,D)},n.set(o,f),o.addEventListener("dispose",M)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let x=0;for(let p=0;p<c.length;p++)x+=c[p];const S=o.morphTargetsRelative?1:1-x;l.getUniforms().setValue(i,"morphTargetBaseInfluence",S),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function Bf(i,e,t,n){let s=new WeakMap;function r(l){const c=n.render.frame,d=l.geometry,h=e.get(l,d);if(s.get(h)!==c&&(e.update(h),s.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;s.get(f)!==c&&(f.update(),s.set(f,c))}return h}function a(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:a}}const Gl=new en,Yo=new Bl(1,1),kl=new Dl,Wl=new ou,Xl=new Ol,Zo=[],jo=[],$o=new Float32Array(16),Ko=new Float32Array(9),Jo=new Float32Array(4);function es(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=Zo[s];if(r===void 0&&(r=new Float32Array(s),Zo[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function zt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Ht(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function ur(i,e){let t=jo[e];t===void 0&&(t=new Int32Array(e),jo[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function zf(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Hf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(zt(t,e))return;i.uniform2fv(this.addr,e),Ht(t,e)}}function Vf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(zt(t,e))return;i.uniform3fv(this.addr,e),Ht(t,e)}}function Gf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(zt(t,e))return;i.uniform4fv(this.addr,e),Ht(t,e)}}function kf(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(zt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Ht(t,e)}else{if(zt(t,n))return;Jo.set(n),i.uniformMatrix2fv(this.addr,!1,Jo),Ht(t,n)}}function Wf(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(zt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Ht(t,e)}else{if(zt(t,n))return;Ko.set(n),i.uniformMatrix3fv(this.addr,!1,Ko),Ht(t,n)}}function Xf(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(zt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Ht(t,e)}else{if(zt(t,n))return;$o.set(n),i.uniformMatrix4fv(this.addr,!1,$o),Ht(t,n)}}function qf(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Yf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(zt(t,e))return;i.uniform2iv(this.addr,e),Ht(t,e)}}function Zf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(zt(t,e))return;i.uniform3iv(this.addr,e),Ht(t,e)}}function jf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(zt(t,e))return;i.uniform4iv(this.addr,e),Ht(t,e)}}function $f(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Kf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(zt(t,e))return;i.uniform2uiv(this.addr,e),Ht(t,e)}}function Jf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(zt(t,e))return;i.uniform3uiv(this.addr,e),Ht(t,e)}}function Qf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(zt(t,e))return;i.uniform4uiv(this.addr,e),Ht(t,e)}}function ep(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Yo.compareFunction=Cl,r=Yo):r=Gl,t.setTexture2D(e||r,s)}function tp(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Wl,s)}function np(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||Xl,s)}function ip(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||kl,s)}function sp(i){switch(i){case 5126:return zf;case 35664:return Hf;case 35665:return Vf;case 35666:return Gf;case 35674:return kf;case 35675:return Wf;case 35676:return Xf;case 5124:case 35670:return qf;case 35667:case 35671:return Yf;case 35668:case 35672:return Zf;case 35669:case 35673:return jf;case 5125:return $f;case 36294:return Kf;case 36295:return Jf;case 36296:return Qf;case 35678:case 36198:case 36298:case 36306:case 35682:return ep;case 35679:case 36299:case 36307:return tp;case 35680:case 36300:case 36308:case 36293:return np;case 36289:case 36303:case 36311:case 36292:return ip}}function rp(i,e){i.uniform1fv(this.addr,e)}function ap(i,e){const t=es(e,this.size,2);i.uniform2fv(this.addr,t)}function op(i,e){const t=es(e,this.size,3);i.uniform3fv(this.addr,t)}function lp(i,e){const t=es(e,this.size,4);i.uniform4fv(this.addr,t)}function cp(i,e){const t=es(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function up(i,e){const t=es(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function hp(i,e){const t=es(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function dp(i,e){i.uniform1iv(this.addr,e)}function fp(i,e){i.uniform2iv(this.addr,e)}function pp(i,e){i.uniform3iv(this.addr,e)}function mp(i,e){i.uniform4iv(this.addr,e)}function gp(i,e){i.uniform1uiv(this.addr,e)}function _p(i,e){i.uniform2uiv(this.addr,e)}function vp(i,e){i.uniform3uiv(this.addr,e)}function xp(i,e){i.uniform4uiv(this.addr,e)}function Mp(i,e,t){const n=this.cache,s=e.length,r=ur(t,s);zt(n,r)||(i.uniform1iv(this.addr,r),Ht(n,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||Gl,r[a])}function Sp(i,e,t){const n=this.cache,s=e.length,r=ur(t,s);zt(n,r)||(i.uniform1iv(this.addr,r),Ht(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Wl,r[a])}function Ep(i,e,t){const n=this.cache,s=e.length,r=ur(t,s);zt(n,r)||(i.uniform1iv(this.addr,r),Ht(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||Xl,r[a])}function yp(i,e,t){const n=this.cache,s=e.length,r=ur(t,s);zt(n,r)||(i.uniform1iv(this.addr,r),Ht(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||kl,r[a])}function bp(i){switch(i){case 5126:return rp;case 35664:return ap;case 35665:return op;case 35666:return lp;case 35674:return cp;case 35675:return up;case 35676:return hp;case 5124:case 35670:return dp;case 35667:case 35671:return fp;case 35668:case 35672:return pp;case 35669:case 35673:return mp;case 5125:return gp;case 36294:return _p;case 36295:return vp;case 36296:return xp;case 35678:case 36198:case 36298:case 36306:case 35682:return Mp;case 35679:case 36299:case 36307:return Sp;case 35680:case 36300:case 36308:case 36293:return Ep;case 36289:case 36303:case 36311:case 36292:return yp}}class Tp{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=sp(t.type)}}class Ap{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=bp(t.type)}}class wp{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],n)}}}const Xr=/(\w+)(\])?(\[|\.)?/g;function Qo(i,e){i.seq.push(e),i.map[e.id]=e}function Rp(i,e,t){const n=i.name,s=n.length;for(Xr.lastIndex=0;;){const r=Xr.exec(n),a=Xr.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Qo(t,c===void 0?new Tp(o,i,e):new Ap(o,i,e));break}else{let h=t.map[o];h===void 0&&(h=new wp(o),Qo(t,h)),t=h}}}class er{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);Rp(r,a,this)}}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&n.push(a)}return n}}function el(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const Cp=37297;let Pp=0;function Dp(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const tl=new Ke;function Lp(i){ut._getMatrix(tl,ut.workingColorSpace,i);const e=`mat3( ${tl.elements.map(t=>t.toFixed(4))} )`;switch(ut.getTransfer(i)){case tr:return[e,"LinearTransferOETF"];case Mt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function nl(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),s=i.getShaderInfoLog(e).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const a=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+Dp(i.getShaderSource(e),a)}else return s}function Up(i,e){const t=Lp(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Ip(i,e){let t;switch(e){case vc:t="Linear";break;case xc:t="Reinhard";break;case Mc:t="Cineon";break;case Sc:t="ACESFilmic";break;case yc:t="AgX";break;case bc:t="Neutral";break;case Ec:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Ys=new P;function Np(){ut.getLuminanceCoefficients(Ys);const i=Ys.x.toFixed(4),e=Ys.y.toFixed(4),t=Ys.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Fp(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(cs).join(`
`)}function Op(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Bp(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function cs(i){return i!==""}function il(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function sl(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const zp=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ba(i){return i.replace(zp,Vp)}const Hp=new Map;function Vp(i,e){let t=Je[e];if(t===void 0){const n=Hp.get(e);if(n!==void 0)t=Je[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Ba(t)}const Gp=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function rl(i){return i.replace(Gp,kp)}function kp(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function al(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Wp(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===_l?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Kl?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Hn&&(e="SHADOWMAP_TYPE_VSM"),e}function Xp(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Yi:case Zi:e="ENVMAP_TYPE_CUBE";break;case or:e="ENVMAP_TYPE_CUBE_UV";break}return e}function qp(i){let e="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===Zi&&(e="ENVMAP_MODE_REFRACTION"),e}function Yp(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case vl:e="ENVMAP_BLENDING_MULTIPLY";break;case gc:e="ENVMAP_BLENDING_MIX";break;case _c:e="ENVMAP_BLENDING_ADD";break}return e}function Zp(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function jp(i,e,t,n){const s=i.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=Wp(t),c=Xp(t),d=qp(t),h=Yp(t),f=Zp(t),m=Fp(t),x=Op(r),S=s.createProgram();let p,u,w=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(cs).join(`
`),p.length>0&&(p+=`
`),u=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(cs).join(`
`),u.length>0&&(u+=`
`)):(p=[al(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(cs).join(`
`),u=[al(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+d:"",t.envMap?"#define "+h:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==ii?"#define TONE_MAPPING":"",t.toneMapping!==ii?Je.tonemapping_pars_fragment:"",t.toneMapping!==ii?Ip("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Je.colorspace_pars_fragment,Up("linearToOutputTexel",t.outputColorSpace),Np(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(cs).join(`
`)),a=Ba(a),a=il(a,t),a=sl(a,t),o=Ba(o),o=il(o,t),o=sl(o,t),a=rl(a),o=rl(o),t.isRawShaderMaterial!==!0&&(w=`#version 300 es
`,p=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,u=["#define varying in",t.glslVersion===uo?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===uo?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+u);const T=w+p+a,y=w+u+o,F=el(s,s.VERTEX_SHADER,T),D=el(s,s.FRAGMENT_SHADER,y);s.attachShader(S,F),s.attachShader(S,D),t.index0AttributeName!==void 0?s.bindAttribLocation(S,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(S,0,"position"),s.linkProgram(S);function C(L){if(i.debug.checkShaderErrors){const k=s.getProgramInfoLog(S).trim(),H=s.getShaderInfoLog(F).trim(),X=s.getShaderInfoLog(D).trim();let $=!0,W=!0;if(s.getProgramParameter(S,s.LINK_STATUS)===!1)if($=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,S,F,D);else{const ee=nl(s,F,"vertex"),q=nl(s,D,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(S,s.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+k+`
`+ee+`
`+q)}else k!==""?console.warn("THREE.WebGLProgram: Program Info Log:",k):(H===""||X==="")&&(W=!1);W&&(L.diagnostics={runnable:$,programLog:k,vertexShader:{log:H,prefix:p},fragmentShader:{log:X,prefix:u}})}s.deleteShader(F),s.deleteShader(D),O=new er(s,S),E=Bp(s,S)}let O;this.getUniforms=function(){return O===void 0&&C(this),O};let E;this.getAttributes=function(){return E===void 0&&C(this),E};let M=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=s.getProgramParameter(S,Cp)),M},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(S),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Pp++,this.cacheKey=e,this.usedTimes=1,this.program=S,this.vertexShader=F,this.fragmentShader=D,this}let $p=0;class Kp{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new Jp(e),t.set(e,n)),n}}class Jp{constructor(e){this.id=$p++,this.code=e,this.usedTimes=0}}function Qp(i,e,t,n,s,r,a){const o=new $a,l=new Kp,c=new Set,d=[],h=s.logarithmicDepthBuffer,f=s.vertexTextures;let m=s.precision;const x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function S(E){return c.add(E),E===0?"uv":`uv${E}`}function p(E,M,L,k,H){const X=k.fog,$=H.geometry,W=E.isMeshStandardMaterial?k.environment:null,ee=(E.isMeshStandardMaterial?t:e).get(E.envMap||W),q=ee&&ee.mapping===or?ee.image.height:null,me=x[E.type];E.precision!==null&&(m=s.getMaxPrecision(E.precision),m!==E.precision&&console.warn("THREE.WebGLProgram.getParameters:",E.precision,"not supported, using",m,"instead."));const ye=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,De=ye!==void 0?ye.length:0;let je=0;$.morphAttributes.position!==void 0&&(je=1),$.morphAttributes.normal!==void 0&&(je=2),$.morphAttributes.color!==void 0&&(je=3);let Ge,K,ue,Ue;if(me){const at=Rn[me];Ge=at.vertexShader,K=at.fragmentShader}else Ge=E.vertexShader,K=E.fragmentShader,l.update(E),ue=l.getVertexShaderID(E),Ue=l.getFragmentShaderID(E);const fe=i.getRenderTarget(),Ne=i.state.buffers.depth.getReversed(),nt=H.isInstancedMesh===!0,ze=H.isBatchedMesh===!0,Et=!!E.map,yt=!!E.matcap,Ye=!!ee,R=!!E.aoMap,st=!!E.lightMap,rt=!!E.bumpMap,ft=!!E.normalMap,Pe=!!E.displacementMap,tt=!!E.emissiveMap,Fe=!!E.metalnessMap,Xe=!!E.roughnessMap,Pt=E.anisotropy>0,b=E.clearcoat>0,g=E.dispersion>0,z=E.iridescence>0,Z=E.sheen>0,J=E.transmission>0,Y=Pt&&!!E.anisotropyMap,Re=b&&!!E.clearcoatMap,se=b&&!!E.clearcoatNormalMap,ae=b&&!!E.clearcoatRoughnessMap,xe=z&&!!E.iridescenceMap,te=z&&!!E.iridescenceThicknessMap,Me=Z&&!!E.sheenColorMap,Be=Z&&!!E.sheenRoughnessMap,Oe=!!E.specularMap,he=!!E.specularColorMap,Ce=!!E.specularIntensityMap,U=J&&!!E.transmissionMap,oe=J&&!!E.thicknessMap,ne=!!E.gradientMap,be=!!E.alphaMap,ie=E.alphaTest>0,j=!!E.alphaHash,Se=!!E.extensions;let He=ii;E.toneMapped&&(fe===null||fe.isXRRenderTarget===!0)&&(He=i.toneMapping);const _t={shaderID:me,shaderType:E.type,shaderName:E.name,vertexShader:Ge,fragmentShader:K,defines:E.defines,customVertexShaderID:ue,customFragmentShaderID:Ue,isRawShaderMaterial:E.isRawShaderMaterial===!0,glslVersion:E.glslVersion,precision:m,batching:ze,batchingColor:ze&&H._colorsTexture!==null,instancing:nt,instancingColor:nt&&H.instanceColor!==null,instancingMorph:nt&&H.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:fe===null?i.outputColorSpace:fe.isXRRenderTarget===!0?fe.texture.colorSpace:ji,alphaToCoverage:!!E.alphaToCoverage,map:Et,matcap:yt,envMap:Ye,envMapMode:Ye&&ee.mapping,envMapCubeUVHeight:q,aoMap:R,lightMap:st,bumpMap:rt,normalMap:ft,displacementMap:f&&Pe,emissiveMap:tt,normalMapObjectSpace:ft&&E.normalMapType===Rc,normalMapTangentSpace:ft&&E.normalMapType===Rl,metalnessMap:Fe,roughnessMap:Xe,anisotropy:Pt,anisotropyMap:Y,clearcoat:b,clearcoatMap:Re,clearcoatNormalMap:se,clearcoatRoughnessMap:ae,dispersion:g,iridescence:z,iridescenceMap:xe,iridescenceThicknessMap:te,sheen:Z,sheenColorMap:Me,sheenRoughnessMap:Be,specularMap:Oe,specularColorMap:he,specularIntensityMap:Ce,transmission:J,transmissionMap:U,thicknessMap:oe,gradientMap:ne,opaque:E.transparent===!1&&E.blending===ki&&E.alphaToCoverage===!1,alphaMap:be,alphaTest:ie,alphaHash:j,combine:E.combine,mapUv:Et&&S(E.map.channel),aoMapUv:R&&S(E.aoMap.channel),lightMapUv:st&&S(E.lightMap.channel),bumpMapUv:rt&&S(E.bumpMap.channel),normalMapUv:ft&&S(E.normalMap.channel),displacementMapUv:Pe&&S(E.displacementMap.channel),emissiveMapUv:tt&&S(E.emissiveMap.channel),metalnessMapUv:Fe&&S(E.metalnessMap.channel),roughnessMapUv:Xe&&S(E.roughnessMap.channel),anisotropyMapUv:Y&&S(E.anisotropyMap.channel),clearcoatMapUv:Re&&S(E.clearcoatMap.channel),clearcoatNormalMapUv:se&&S(E.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ae&&S(E.clearcoatRoughnessMap.channel),iridescenceMapUv:xe&&S(E.iridescenceMap.channel),iridescenceThicknessMapUv:te&&S(E.iridescenceThicknessMap.channel),sheenColorMapUv:Me&&S(E.sheenColorMap.channel),sheenRoughnessMapUv:Be&&S(E.sheenRoughnessMap.channel),specularMapUv:Oe&&S(E.specularMap.channel),specularColorMapUv:he&&S(E.specularColorMap.channel),specularIntensityMapUv:Ce&&S(E.specularIntensityMap.channel),transmissionMapUv:U&&S(E.transmissionMap.channel),thicknessMapUv:oe&&S(E.thicknessMap.channel),alphaMapUv:be&&S(E.alphaMap.channel),vertexTangents:!!$.attributes.tangent&&(ft||Pt),vertexColors:E.vertexColors,vertexAlphas:E.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,pointsUvs:H.isPoints===!0&&!!$.attributes.uv&&(Et||be),fog:!!X,useFog:E.fog===!0,fogExp2:!!X&&X.isFogExp2,flatShading:E.flatShading===!0&&E.wireframe===!1,sizeAttenuation:E.sizeAttenuation===!0,logarithmicDepthBuffer:h,reverseDepthBuffer:Ne,skinning:H.isSkinnedMesh===!0,morphTargets:$.morphAttributes.position!==void 0,morphNormals:$.morphAttributes.normal!==void 0,morphColors:$.morphAttributes.color!==void 0,morphTargetsCount:De,morphTextureStride:je,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:E.dithering,shadowMapEnabled:i.shadowMap.enabled&&L.length>0,shadowMapType:i.shadowMap.type,toneMapping:He,decodeVideoTexture:Et&&E.map.isVideoTexture===!0&&ut.getTransfer(E.map.colorSpace)===Mt,decodeVideoTextureEmissive:tt&&E.emissiveMap.isVideoTexture===!0&&ut.getTransfer(E.emissiveMap.colorSpace)===Mt,premultipliedAlpha:E.premultipliedAlpha,doubleSided:E.side===_n,flipSided:E.side===on,useDepthPacking:E.depthPacking>=0,depthPacking:E.depthPacking||0,index0AttributeName:E.index0AttributeName,extensionClipCullDistance:Se&&E.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Se&&E.extensions.multiDraw===!0||ze)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:E.customProgramCacheKey()};return _t.vertexUv1s=c.has(1),_t.vertexUv2s=c.has(2),_t.vertexUv3s=c.has(3),c.clear(),_t}function u(E){const M=[];if(E.shaderID?M.push(E.shaderID):(M.push(E.customVertexShaderID),M.push(E.customFragmentShaderID)),E.defines!==void 0)for(const L in E.defines)M.push(L),M.push(E.defines[L]);return E.isRawShaderMaterial===!1&&(w(M,E),T(M,E),M.push(i.outputColorSpace)),M.push(E.customProgramCacheKey),M.join()}function w(E,M){E.push(M.precision),E.push(M.outputColorSpace),E.push(M.envMapMode),E.push(M.envMapCubeUVHeight),E.push(M.mapUv),E.push(M.alphaMapUv),E.push(M.lightMapUv),E.push(M.aoMapUv),E.push(M.bumpMapUv),E.push(M.normalMapUv),E.push(M.displacementMapUv),E.push(M.emissiveMapUv),E.push(M.metalnessMapUv),E.push(M.roughnessMapUv),E.push(M.anisotropyMapUv),E.push(M.clearcoatMapUv),E.push(M.clearcoatNormalMapUv),E.push(M.clearcoatRoughnessMapUv),E.push(M.iridescenceMapUv),E.push(M.iridescenceThicknessMapUv),E.push(M.sheenColorMapUv),E.push(M.sheenRoughnessMapUv),E.push(M.specularMapUv),E.push(M.specularColorMapUv),E.push(M.specularIntensityMapUv),E.push(M.transmissionMapUv),E.push(M.thicknessMapUv),E.push(M.combine),E.push(M.fogExp2),E.push(M.sizeAttenuation),E.push(M.morphTargetsCount),E.push(M.morphAttributeCount),E.push(M.numDirLights),E.push(M.numPointLights),E.push(M.numSpotLights),E.push(M.numSpotLightMaps),E.push(M.numHemiLights),E.push(M.numRectAreaLights),E.push(M.numDirLightShadows),E.push(M.numPointLightShadows),E.push(M.numSpotLightShadows),E.push(M.numSpotLightShadowsWithMaps),E.push(M.numLightProbes),E.push(M.shadowMapType),E.push(M.toneMapping),E.push(M.numClippingPlanes),E.push(M.numClipIntersection),E.push(M.depthPacking)}function T(E,M){o.disableAll(),M.supportsVertexTextures&&o.enable(0),M.instancing&&o.enable(1),M.instancingColor&&o.enable(2),M.instancingMorph&&o.enable(3),M.matcap&&o.enable(4),M.envMap&&o.enable(5),M.normalMapObjectSpace&&o.enable(6),M.normalMapTangentSpace&&o.enable(7),M.clearcoat&&o.enable(8),M.iridescence&&o.enable(9),M.alphaTest&&o.enable(10),M.vertexColors&&o.enable(11),M.vertexAlphas&&o.enable(12),M.vertexUv1s&&o.enable(13),M.vertexUv2s&&o.enable(14),M.vertexUv3s&&o.enable(15),M.vertexTangents&&o.enable(16),M.anisotropy&&o.enable(17),M.alphaHash&&o.enable(18),M.batching&&o.enable(19),M.dispersion&&o.enable(20),M.batchingColor&&o.enable(21),M.gradientMap&&o.enable(22),E.push(o.mask),o.disableAll(),M.fog&&o.enable(0),M.useFog&&o.enable(1),M.flatShading&&o.enable(2),M.logarithmicDepthBuffer&&o.enable(3),M.reverseDepthBuffer&&o.enable(4),M.skinning&&o.enable(5),M.morphTargets&&o.enable(6),M.morphNormals&&o.enable(7),M.morphColors&&o.enable(8),M.premultipliedAlpha&&o.enable(9),M.shadowMapEnabled&&o.enable(10),M.doubleSided&&o.enable(11),M.flipSided&&o.enable(12),M.useDepthPacking&&o.enable(13),M.dithering&&o.enable(14),M.transmission&&o.enable(15),M.sheen&&o.enable(16),M.opaque&&o.enable(17),M.pointsUvs&&o.enable(18),M.decodeVideoTexture&&o.enable(19),M.decodeVideoTextureEmissive&&o.enable(20),M.alphaToCoverage&&o.enable(21),E.push(o.mask)}function y(E){const M=x[E.type];let L;if(M){const k=Rn[M];L=Mu.clone(k.uniforms)}else L=E.uniforms;return L}function F(E,M){let L;for(let k=0,H=d.length;k<H;k++){const X=d[k];if(X.cacheKey===M){L=X,++L.usedTimes;break}}return L===void 0&&(L=new jp(i,M,E,r),d.push(L)),L}function D(E){if(--E.usedTimes===0){const M=d.indexOf(E);d[M]=d[d.length-1],d.pop(),E.destroy()}}function C(E){l.remove(E)}function O(){l.dispose()}return{getParameters:p,getProgramCacheKey:u,getUniforms:y,acquireProgram:F,releaseProgram:D,releaseShaderCache:C,programs:d,dispose:O}}function em(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function tm(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function ol(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function ll(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(h,f,m,x,S,p){let u=i[e];return u===void 0?(u={id:h.id,object:h,geometry:f,material:m,groupOrder:x,renderOrder:h.renderOrder,z:S,group:p},i[e]=u):(u.id=h.id,u.object=h,u.geometry=f,u.material=m,u.groupOrder=x,u.renderOrder=h.renderOrder,u.z=S,u.group=p),e++,u}function o(h,f,m,x,S,p){const u=a(h,f,m,x,S,p);m.transmission>0?n.push(u):m.transparent===!0?s.push(u):t.push(u)}function l(h,f,m,x,S,p){const u=a(h,f,m,x,S,p);m.transmission>0?n.unshift(u):m.transparent===!0?s.unshift(u):t.unshift(u)}function c(h,f){t.length>1&&t.sort(h||tm),n.length>1&&n.sort(f||ol),s.length>1&&s.sort(f||ol)}function d(){for(let h=e,f=i.length;h<f;h++){const m=i[h];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:o,unshift:l,finish:d,sort:c}}function nm(){let i=new WeakMap;function e(n,s){const r=i.get(n);let a;return r===void 0?(a=new ll,i.set(n,[a])):s>=r.length?(a=new ll,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function im(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new P,color:new lt};break;case"SpotLight":t={position:new P,direction:new P,color:new lt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new lt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new lt,groundColor:new lt};break;case"RectAreaLight":t={color:new lt,position:new P,halfWidth:new P,halfHeight:new P};break}return i[e.id]=t,t}}}function sm(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new qe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new qe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new qe,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let rm=0;function am(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function om(i){const e=new im,t=sm(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new P);const s=new P,r=new wt,a=new wt;function o(c){let d=0,h=0,f=0;for(let E=0;E<9;E++)n.probe[E].set(0,0,0);let m=0,x=0,S=0,p=0,u=0,w=0,T=0,y=0,F=0,D=0,C=0;c.sort(am);for(let E=0,M=c.length;E<M;E++){const L=c[E],k=L.color,H=L.intensity,X=L.distance,$=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)d+=k.r*H,h+=k.g*H,f+=k.b*H;else if(L.isLightProbe){for(let W=0;W<9;W++)n.probe[W].addScaledVector(L.sh.coefficients[W],H);C++}else if(L.isDirectionalLight){const W=e.get(L);if(W.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const ee=L.shadow,q=t.get(L);q.shadowIntensity=ee.intensity,q.shadowBias=ee.bias,q.shadowNormalBias=ee.normalBias,q.shadowRadius=ee.radius,q.shadowMapSize=ee.mapSize,n.directionalShadow[m]=q,n.directionalShadowMap[m]=$,n.directionalShadowMatrix[m]=L.shadow.matrix,w++}n.directional[m]=W,m++}else if(L.isSpotLight){const W=e.get(L);W.position.setFromMatrixPosition(L.matrixWorld),W.color.copy(k).multiplyScalar(H),W.distance=X,W.coneCos=Math.cos(L.angle),W.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),W.decay=L.decay,n.spot[S]=W;const ee=L.shadow;if(L.map&&(n.spotLightMap[F]=L.map,F++,ee.updateMatrices(L),L.castShadow&&D++),n.spotLightMatrix[S]=ee.matrix,L.castShadow){const q=t.get(L);q.shadowIntensity=ee.intensity,q.shadowBias=ee.bias,q.shadowNormalBias=ee.normalBias,q.shadowRadius=ee.radius,q.shadowMapSize=ee.mapSize,n.spotShadow[S]=q,n.spotShadowMap[S]=$,y++}S++}else if(L.isRectAreaLight){const W=e.get(L);W.color.copy(k).multiplyScalar(H),W.halfWidth.set(L.width*.5,0,0),W.halfHeight.set(0,L.height*.5,0),n.rectArea[p]=W,p++}else if(L.isPointLight){const W=e.get(L);if(W.color.copy(L.color).multiplyScalar(L.intensity),W.distance=L.distance,W.decay=L.decay,L.castShadow){const ee=L.shadow,q=t.get(L);q.shadowIntensity=ee.intensity,q.shadowBias=ee.bias,q.shadowNormalBias=ee.normalBias,q.shadowRadius=ee.radius,q.shadowMapSize=ee.mapSize,q.shadowCameraNear=ee.camera.near,q.shadowCameraFar=ee.camera.far,n.pointShadow[x]=q,n.pointShadowMap[x]=$,n.pointShadowMatrix[x]=L.shadow.matrix,T++}n.point[x]=W,x++}else if(L.isHemisphereLight){const W=e.get(L);W.skyColor.copy(L.color).multiplyScalar(H),W.groundColor.copy(L.groundColor).multiplyScalar(H),n.hemi[u]=W,u++}}p>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=_e.LTC_FLOAT_1,n.rectAreaLTC2=_e.LTC_FLOAT_2):(n.rectAreaLTC1=_e.LTC_HALF_1,n.rectAreaLTC2=_e.LTC_HALF_2)),n.ambient[0]=d,n.ambient[1]=h,n.ambient[2]=f;const O=n.hash;(O.directionalLength!==m||O.pointLength!==x||O.spotLength!==S||O.rectAreaLength!==p||O.hemiLength!==u||O.numDirectionalShadows!==w||O.numPointShadows!==T||O.numSpotShadows!==y||O.numSpotMaps!==F||O.numLightProbes!==C)&&(n.directional.length=m,n.spot.length=S,n.rectArea.length=p,n.point.length=x,n.hemi.length=u,n.directionalShadow.length=w,n.directionalShadowMap.length=w,n.pointShadow.length=T,n.pointShadowMap.length=T,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=w,n.pointShadowMatrix.length=T,n.spotLightMatrix.length=y+F-D,n.spotLightMap.length=F,n.numSpotLightShadowsWithMaps=D,n.numLightProbes=C,O.directionalLength=m,O.pointLength=x,O.spotLength=S,O.rectAreaLength=p,O.hemiLength=u,O.numDirectionalShadows=w,O.numPointShadows=T,O.numSpotShadows=y,O.numSpotMaps=F,O.numLightProbes=C,n.version=rm++)}function l(c,d){let h=0,f=0,m=0,x=0,S=0;const p=d.matrixWorldInverse;for(let u=0,w=c.length;u<w;u++){const T=c[u];if(T.isDirectionalLight){const y=n.directional[h];y.direction.setFromMatrixPosition(T.matrixWorld),s.setFromMatrixPosition(T.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(p),h++}else if(T.isSpotLight){const y=n.spot[m];y.position.setFromMatrixPosition(T.matrixWorld),y.position.applyMatrix4(p),y.direction.setFromMatrixPosition(T.matrixWorld),s.setFromMatrixPosition(T.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(p),m++}else if(T.isRectAreaLight){const y=n.rectArea[x];y.position.setFromMatrixPosition(T.matrixWorld),y.position.applyMatrix4(p),a.identity(),r.copy(T.matrixWorld),r.premultiply(p),a.extractRotation(r),y.halfWidth.set(T.width*.5,0,0),y.halfHeight.set(0,T.height*.5,0),y.halfWidth.applyMatrix4(a),y.halfHeight.applyMatrix4(a),x++}else if(T.isPointLight){const y=n.point[f];y.position.setFromMatrixPosition(T.matrixWorld),y.position.applyMatrix4(p),f++}else if(T.isHemisphereLight){const y=n.hemi[S];y.direction.setFromMatrixPosition(T.matrixWorld),y.direction.transformDirection(p),S++}}}return{setup:o,setupView:l,state:n}}function cl(i){const e=new om(i),t=[],n=[];function s(d){c.camera=d,t.length=0,n.length=0}function r(d){t.push(d)}function a(d){n.push(d)}function o(){e.setup(t)}function l(d){e.setupView(t,d)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function lm(i){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new cl(i),e.set(s,[o])):r>=a.length?(o=new cl(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const cm=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,um=`uniform sampler2D shadow_pass;
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
}`;function hm(i,e,t){let n=new Ka;const s=new qe,r=new qe,a=new Lt,o=new Du({depthPacking:wc}),l=new Lu,c={},d=t.maxTextureSize,h={[si]:on,[on]:si,[_n]:_n},f=new ri({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new qe},radius:{value:4}},vertexShader:cm,fragmentShader:um}),m=f.clone();m.defines.HORIZONTAL_PASS=1;const x=new Ct;x.setAttribute("position",new Pn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const S=new gt(x,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=_l;let u=this.type;this.render=function(D,C,O){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||D.length===0)return;const E=i.getRenderTarget(),M=i.getActiveCubeFace(),L=i.getActiveMipmapLevel(),k=i.state;k.setBlending(ni),k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);const H=u!==Hn&&this.type===Hn,X=u===Hn&&this.type!==Hn;for(let $=0,W=D.length;$<W;$++){const ee=D[$],q=ee.shadow;if(q===void 0){console.warn("THREE.WebGLShadowMap:",ee,"has no shadow.");continue}if(q.autoUpdate===!1&&q.needsUpdate===!1)continue;s.copy(q.mapSize);const me=q.getFrameExtents();if(s.multiply(me),r.copy(q.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(r.x=Math.floor(d/me.x),s.x=r.x*me.x,q.mapSize.x=r.x),s.y>d&&(r.y=Math.floor(d/me.y),s.y=r.y*me.y,q.mapSize.y=r.y)),q.map===null||H===!0||X===!0){const De=this.type!==Hn?{minFilter:Tn,magFilter:Tn}:{};q.map!==null&&q.map.dispose(),q.map=new Mi(s.x,s.y,De),q.map.texture.name=ee.name+".shadowMap",q.camera.updateProjectionMatrix()}i.setRenderTarget(q.map),i.clear();const ye=q.getViewportCount();for(let De=0;De<ye;De++){const je=q.getViewport(De);a.set(r.x*je.x,r.y*je.y,r.x*je.z,r.y*je.w),k.viewport(a),q.updateMatrices(ee,De),n=q.getFrustum(),y(C,O,q.camera,ee,this.type)}q.isPointLightShadow!==!0&&this.type===Hn&&w(q,O),q.needsUpdate=!1}u=this.type,p.needsUpdate=!1,i.setRenderTarget(E,M,L)};function w(D,C){const O=e.update(S);f.defines.VSM_SAMPLES!==D.blurSamples&&(f.defines.VSM_SAMPLES=D.blurSamples,m.defines.VSM_SAMPLES=D.blurSamples,f.needsUpdate=!0,m.needsUpdate=!0),D.mapPass===null&&(D.mapPass=new Mi(s.x,s.y)),f.uniforms.shadow_pass.value=D.map.texture,f.uniforms.resolution.value=D.mapSize,f.uniforms.radius.value=D.radius,i.setRenderTarget(D.mapPass),i.clear(),i.renderBufferDirect(C,null,O,f,S,null),m.uniforms.shadow_pass.value=D.mapPass.texture,m.uniforms.resolution.value=D.mapSize,m.uniforms.radius.value=D.radius,i.setRenderTarget(D.map),i.clear(),i.renderBufferDirect(C,null,O,m,S,null)}function T(D,C,O,E){let M=null;const L=O.isPointLight===!0?D.customDistanceMaterial:D.customDepthMaterial;if(L!==void 0)M=L;else if(M=O.isPointLight===!0?l:o,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const k=M.uuid,H=C.uuid;let X=c[k];X===void 0&&(X={},c[k]=X);let $=X[H];$===void 0&&($=M.clone(),X[H]=$,C.addEventListener("dispose",F)),M=$}if(M.visible=C.visible,M.wireframe=C.wireframe,E===Hn?M.side=C.shadowSide!==null?C.shadowSide:C.side:M.side=C.shadowSide!==null?C.shadowSide:h[C.side],M.alphaMap=C.alphaMap,M.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,M.map=C.map,M.clipShadows=C.clipShadows,M.clippingPlanes=C.clippingPlanes,M.clipIntersection=C.clipIntersection,M.displacementMap=C.displacementMap,M.displacementScale=C.displacementScale,M.displacementBias=C.displacementBias,M.wireframeLinewidth=C.wireframeLinewidth,M.linewidth=C.linewidth,O.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const k=i.properties.get(M);k.light=O}return M}function y(D,C,O,E,M){if(D.visible===!1)return;if(D.layers.test(C.layers)&&(D.isMesh||D.isLine||D.isPoints)&&(D.castShadow||D.receiveShadow&&M===Hn)&&(!D.frustumCulled||n.intersectsObject(D))){D.modelViewMatrix.multiplyMatrices(O.matrixWorldInverse,D.matrixWorld);const H=e.update(D),X=D.material;if(Array.isArray(X)){const $=H.groups;for(let W=0,ee=$.length;W<ee;W++){const q=$[W],me=X[q.materialIndex];if(me&&me.visible){const ye=T(D,me,E,M);D.onBeforeShadow(i,D,C,O,H,ye,q),i.renderBufferDirect(O,null,H,ye,D,q),D.onAfterShadow(i,D,C,O,H,ye,q)}}}else if(X.visible){const $=T(D,X,E,M);D.onBeforeShadow(i,D,C,O,H,$,null),i.renderBufferDirect(O,null,H,$,D,null),D.onAfterShadow(i,D,C,O,H,$,null)}}const k=D.children;for(let H=0,X=k.length;H<X;H++)y(k[H],C,O,E,M)}function F(D){D.target.removeEventListener("dispose",F);for(const O in c){const E=c[O],M=D.target.uuid;M in E&&(E[M].dispose(),delete E[M])}}}const dm={[ea]:ta,[na]:ra,[ia]:aa,[qi]:sa,[ta]:ea,[ra]:na,[aa]:ia,[sa]:qi};function fm(i,e){function t(){let U=!1;const oe=new Lt;let ne=null;const be=new Lt(0,0,0,0);return{setMask:function(ie){ne!==ie&&!U&&(i.colorMask(ie,ie,ie,ie),ne=ie)},setLocked:function(ie){U=ie},setClear:function(ie,j,Se,He,_t){_t===!0&&(ie*=He,j*=He,Se*=He),oe.set(ie,j,Se,He),be.equals(oe)===!1&&(i.clearColor(ie,j,Se,He),be.copy(oe))},reset:function(){U=!1,ne=null,be.set(-1,0,0,0)}}}function n(){let U=!1,oe=!1,ne=null,be=null,ie=null;return{setReversed:function(j){if(oe!==j){const Se=e.get("EXT_clip_control");j?Se.clipControlEXT(Se.LOWER_LEFT_EXT,Se.ZERO_TO_ONE_EXT):Se.clipControlEXT(Se.LOWER_LEFT_EXT,Se.NEGATIVE_ONE_TO_ONE_EXT),oe=j;const He=ie;ie=null,this.setClear(He)}},getReversed:function(){return oe},setTest:function(j){j?fe(i.DEPTH_TEST):Ne(i.DEPTH_TEST)},setMask:function(j){ne!==j&&!U&&(i.depthMask(j),ne=j)},setFunc:function(j){if(oe&&(j=dm[j]),be!==j){switch(j){case ea:i.depthFunc(i.NEVER);break;case ta:i.depthFunc(i.ALWAYS);break;case na:i.depthFunc(i.LESS);break;case qi:i.depthFunc(i.LEQUAL);break;case ia:i.depthFunc(i.EQUAL);break;case sa:i.depthFunc(i.GEQUAL);break;case ra:i.depthFunc(i.GREATER);break;case aa:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}be=j}},setLocked:function(j){U=j},setClear:function(j){ie!==j&&(oe&&(j=1-j),i.clearDepth(j),ie=j)},reset:function(){U=!1,ne=null,be=null,ie=null,oe=!1}}}function s(){let U=!1,oe=null,ne=null,be=null,ie=null,j=null,Se=null,He=null,_t=null;return{setTest:function(at){U||(at?fe(i.STENCIL_TEST):Ne(i.STENCIL_TEST))},setMask:function(at){oe!==at&&!U&&(i.stencilMask(at),oe=at)},setFunc:function(at,nn,hn){(ne!==at||be!==nn||ie!==hn)&&(i.stencilFunc(at,nn,hn),ne=at,be=nn,ie=hn)},setOp:function(at,nn,hn){(j!==at||Se!==nn||He!==hn)&&(i.stencilOp(at,nn,hn),j=at,Se=nn,He=hn)},setLocked:function(at){U=at},setClear:function(at){_t!==at&&(i.clearStencil(at),_t=at)},reset:function(){U=!1,oe=null,ne=null,be=null,ie=null,j=null,Se=null,He=null,_t=null}}}const r=new t,a=new n,o=new s,l=new WeakMap,c=new WeakMap;let d={},h={},f=new WeakMap,m=[],x=null,S=!1,p=null,u=null,w=null,T=null,y=null,F=null,D=null,C=new lt(0,0,0),O=0,E=!1,M=null,L=null,k=null,H=null,X=null;const $=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,ee=0;const q=i.getParameter(i.VERSION);q.indexOf("WebGL")!==-1?(ee=parseFloat(/^WebGL (\d)/.exec(q)[1]),W=ee>=1):q.indexOf("OpenGL ES")!==-1&&(ee=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),W=ee>=2);let me=null,ye={};const De=i.getParameter(i.SCISSOR_BOX),je=i.getParameter(i.VIEWPORT),Ge=new Lt().fromArray(De),K=new Lt().fromArray(je);function ue(U,oe,ne,be){const ie=new Uint8Array(4),j=i.createTexture();i.bindTexture(U,j),i.texParameteri(U,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(U,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Se=0;Se<ne;Se++)U===i.TEXTURE_3D||U===i.TEXTURE_2D_ARRAY?i.texImage3D(oe,0,i.RGBA,1,1,be,0,i.RGBA,i.UNSIGNED_BYTE,ie):i.texImage2D(oe+Se,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ie);return j}const Ue={};Ue[i.TEXTURE_2D]=ue(i.TEXTURE_2D,i.TEXTURE_2D,1),Ue[i.TEXTURE_CUBE_MAP]=ue(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Ue[i.TEXTURE_2D_ARRAY]=ue(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Ue[i.TEXTURE_3D]=ue(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),fe(i.DEPTH_TEST),a.setFunc(qi),rt(!1),ft(so),fe(i.CULL_FACE),R(ni);function fe(U){d[U]!==!0&&(i.enable(U),d[U]=!0)}function Ne(U){d[U]!==!1&&(i.disable(U),d[U]=!1)}function nt(U,oe){return h[U]!==oe?(i.bindFramebuffer(U,oe),h[U]=oe,U===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=oe),U===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=oe),!0):!1}function ze(U,oe){let ne=m,be=!1;if(U){ne=f.get(oe),ne===void 0&&(ne=[],f.set(oe,ne));const ie=U.textures;if(ne.length!==ie.length||ne[0]!==i.COLOR_ATTACHMENT0){for(let j=0,Se=ie.length;j<Se;j++)ne[j]=i.COLOR_ATTACHMENT0+j;ne.length=ie.length,be=!0}}else ne[0]!==i.BACK&&(ne[0]=i.BACK,be=!0);be&&i.drawBuffers(ne)}function Et(U){return x!==U?(i.useProgram(U),x=U,!0):!1}const yt={[pi]:i.FUNC_ADD,[Ql]:i.FUNC_SUBTRACT,[ec]:i.FUNC_REVERSE_SUBTRACT};yt[tc]=i.MIN,yt[nc]=i.MAX;const Ye={[ic]:i.ZERO,[sc]:i.ONE,[rc]:i.SRC_COLOR,[Jr]:i.SRC_ALPHA,[hc]:i.SRC_ALPHA_SATURATE,[cc]:i.DST_COLOR,[oc]:i.DST_ALPHA,[ac]:i.ONE_MINUS_SRC_COLOR,[Qr]:i.ONE_MINUS_SRC_ALPHA,[uc]:i.ONE_MINUS_DST_COLOR,[lc]:i.ONE_MINUS_DST_ALPHA,[dc]:i.CONSTANT_COLOR,[fc]:i.ONE_MINUS_CONSTANT_COLOR,[pc]:i.CONSTANT_ALPHA,[mc]:i.ONE_MINUS_CONSTANT_ALPHA};function R(U,oe,ne,be,ie,j,Se,He,_t,at){if(U===ni){S===!0&&(Ne(i.BLEND),S=!1);return}if(S===!1&&(fe(i.BLEND),S=!0),U!==Jl){if(U!==p||at!==E){if((u!==pi||y!==pi)&&(i.blendEquation(i.FUNC_ADD),u=pi,y=pi),at)switch(U){case ki:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ro:i.blendFunc(i.ONE,i.ONE);break;case ao:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case oo:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case ki:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ro:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case ao:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case oo:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}w=null,T=null,F=null,D=null,C.set(0,0,0),O=0,p=U,E=at}return}ie=ie||oe,j=j||ne,Se=Se||be,(oe!==u||ie!==y)&&(i.blendEquationSeparate(yt[oe],yt[ie]),u=oe,y=ie),(ne!==w||be!==T||j!==F||Se!==D)&&(i.blendFuncSeparate(Ye[ne],Ye[be],Ye[j],Ye[Se]),w=ne,T=be,F=j,D=Se),(He.equals(C)===!1||_t!==O)&&(i.blendColor(He.r,He.g,He.b,_t),C.copy(He),O=_t),p=U,E=!1}function st(U,oe){U.side===_n?Ne(i.CULL_FACE):fe(i.CULL_FACE);let ne=U.side===on;oe&&(ne=!ne),rt(ne),U.blending===ki&&U.transparent===!1?R(ni):R(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),a.setFunc(U.depthFunc),a.setTest(U.depthTest),a.setMask(U.depthWrite),r.setMask(U.colorWrite);const be=U.stencilWrite;o.setTest(be),be&&(o.setMask(U.stencilWriteMask),o.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),o.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),tt(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?fe(i.SAMPLE_ALPHA_TO_COVERAGE):Ne(i.SAMPLE_ALPHA_TO_COVERAGE)}function rt(U){M!==U&&(U?i.frontFace(i.CW):i.frontFace(i.CCW),M=U)}function ft(U){U!==jl?(fe(i.CULL_FACE),U!==L&&(U===so?i.cullFace(i.BACK):U===$l?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Ne(i.CULL_FACE),L=U}function Pe(U){U!==k&&(W&&i.lineWidth(U),k=U)}function tt(U,oe,ne){U?(fe(i.POLYGON_OFFSET_FILL),(H!==oe||X!==ne)&&(i.polygonOffset(oe,ne),H=oe,X=ne)):Ne(i.POLYGON_OFFSET_FILL)}function Fe(U){U?fe(i.SCISSOR_TEST):Ne(i.SCISSOR_TEST)}function Xe(U){U===void 0&&(U=i.TEXTURE0+$-1),me!==U&&(i.activeTexture(U),me=U)}function Pt(U,oe,ne){ne===void 0&&(me===null?ne=i.TEXTURE0+$-1:ne=me);let be=ye[ne];be===void 0&&(be={type:void 0,texture:void 0},ye[ne]=be),(be.type!==U||be.texture!==oe)&&(me!==ne&&(i.activeTexture(ne),me=ne),i.bindTexture(U,oe||Ue[U]),be.type=U,be.texture=oe)}function b(){const U=ye[me];U!==void 0&&U.type!==void 0&&(i.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function g(){try{i.compressedTexImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function z(){try{i.compressedTexImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Z(){try{i.texSubImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function J(){try{i.texSubImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Y(){try{i.compressedTexSubImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Re(){try{i.compressedTexSubImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function se(){try{i.texStorage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ae(){try{i.texStorage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function xe(){try{i.texImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function te(){try{i.texImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Me(U){Ge.equals(U)===!1&&(i.scissor(U.x,U.y,U.z,U.w),Ge.copy(U))}function Be(U){K.equals(U)===!1&&(i.viewport(U.x,U.y,U.z,U.w),K.copy(U))}function Oe(U,oe){let ne=c.get(oe);ne===void 0&&(ne=new WeakMap,c.set(oe,ne));let be=ne.get(U);be===void 0&&(be=i.getUniformBlockIndex(oe,U.name),ne.set(U,be))}function he(U,oe){const be=c.get(oe).get(U);l.get(oe)!==be&&(i.uniformBlockBinding(oe,be,U.__bindingPointIndex),l.set(oe,be))}function Ce(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),d={},me=null,ye={},h={},f=new WeakMap,m=[],x=null,S=!1,p=null,u=null,w=null,T=null,y=null,F=null,D=null,C=new lt(0,0,0),O=0,E=!1,M=null,L=null,k=null,H=null,X=null,Ge.set(0,0,i.canvas.width,i.canvas.height),K.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:fe,disable:Ne,bindFramebuffer:nt,drawBuffers:ze,useProgram:Et,setBlending:R,setMaterial:st,setFlipSided:rt,setCullFace:ft,setLineWidth:Pe,setPolygonOffset:tt,setScissorTest:Fe,activeTexture:Xe,bindTexture:Pt,unbindTexture:b,compressedTexImage2D:g,compressedTexImage3D:z,texImage2D:xe,texImage3D:te,updateUBOMapping:Oe,uniformBlockBinding:he,texStorage2D:se,texStorage3D:ae,texSubImage2D:Z,texSubImage3D:J,compressedTexSubImage2D:Y,compressedTexSubImage3D:Re,scissor:Me,viewport:Be,reset:Ce}}function pm(i,e,t,n,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new qe,d=new WeakMap;let h;const f=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(b,g){return m?new OffscreenCanvas(b,g):ir("canvas")}function S(b,g,z){let Z=1;const J=Pt(b);if((J.width>z||J.height>z)&&(Z=z/Math.max(J.width,J.height)),Z<1)if(typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&b instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&b instanceof ImageBitmap||typeof VideoFrame<"u"&&b instanceof VideoFrame){const Y=Math.floor(Z*J.width),Re=Math.floor(Z*J.height);h===void 0&&(h=x(Y,Re));const se=g?x(Y,Re):h;return se.width=Y,se.height=Re,se.getContext("2d").drawImage(b,0,0,Y,Re),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+Y+"x"+Re+")."),se}else return"data"in b&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),b;return b}function p(b){return b.generateMipmaps}function u(b){i.generateMipmap(b)}function w(b){return b.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:b.isWebGL3DRenderTarget?i.TEXTURE_3D:b.isWebGLArrayRenderTarget||b.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function T(b,g,z,Z,J=!1){if(b!==null){if(i[b]!==void 0)return i[b];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+b+"'")}let Y=g;if(g===i.RED&&(z===i.FLOAT&&(Y=i.R32F),z===i.HALF_FLOAT&&(Y=i.R16F),z===i.UNSIGNED_BYTE&&(Y=i.R8)),g===i.RED_INTEGER&&(z===i.UNSIGNED_BYTE&&(Y=i.R8UI),z===i.UNSIGNED_SHORT&&(Y=i.R16UI),z===i.UNSIGNED_INT&&(Y=i.R32UI),z===i.BYTE&&(Y=i.R8I),z===i.SHORT&&(Y=i.R16I),z===i.INT&&(Y=i.R32I)),g===i.RG&&(z===i.FLOAT&&(Y=i.RG32F),z===i.HALF_FLOAT&&(Y=i.RG16F),z===i.UNSIGNED_BYTE&&(Y=i.RG8)),g===i.RG_INTEGER&&(z===i.UNSIGNED_BYTE&&(Y=i.RG8UI),z===i.UNSIGNED_SHORT&&(Y=i.RG16UI),z===i.UNSIGNED_INT&&(Y=i.RG32UI),z===i.BYTE&&(Y=i.RG8I),z===i.SHORT&&(Y=i.RG16I),z===i.INT&&(Y=i.RG32I)),g===i.RGB_INTEGER&&(z===i.UNSIGNED_BYTE&&(Y=i.RGB8UI),z===i.UNSIGNED_SHORT&&(Y=i.RGB16UI),z===i.UNSIGNED_INT&&(Y=i.RGB32UI),z===i.BYTE&&(Y=i.RGB8I),z===i.SHORT&&(Y=i.RGB16I),z===i.INT&&(Y=i.RGB32I)),g===i.RGBA_INTEGER&&(z===i.UNSIGNED_BYTE&&(Y=i.RGBA8UI),z===i.UNSIGNED_SHORT&&(Y=i.RGBA16UI),z===i.UNSIGNED_INT&&(Y=i.RGBA32UI),z===i.BYTE&&(Y=i.RGBA8I),z===i.SHORT&&(Y=i.RGBA16I),z===i.INT&&(Y=i.RGBA32I)),g===i.RGB&&z===i.UNSIGNED_INT_5_9_9_9_REV&&(Y=i.RGB9_E5),g===i.RGBA){const Re=J?tr:ut.getTransfer(Z);z===i.FLOAT&&(Y=i.RGBA32F),z===i.HALF_FLOAT&&(Y=i.RGBA16F),z===i.UNSIGNED_BYTE&&(Y=Re===Mt?i.SRGB8_ALPHA8:i.RGBA8),z===i.UNSIGNED_SHORT_4_4_4_4&&(Y=i.RGBA4),z===i.UNSIGNED_SHORT_5_5_5_1&&(Y=i.RGB5_A1)}return(Y===i.R16F||Y===i.R32F||Y===i.RG16F||Y===i.RG32F||Y===i.RGBA16F||Y===i.RGBA32F)&&e.get("EXT_color_buffer_float"),Y}function y(b,g){let z;return b?g===null||g===xi||g===ps?z=i.DEPTH24_STENCIL8:g===kn?z=i.DEPTH32F_STENCIL8:g===fs&&(z=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):g===null||g===xi||g===ps?z=i.DEPTH_COMPONENT24:g===kn?z=i.DEPTH_COMPONENT32F:g===fs&&(z=i.DEPTH_COMPONENT16),z}function F(b,g){return p(b)===!0||b.isFramebufferTexture&&b.minFilter!==Tn&&b.minFilter!==Cn?Math.log2(Math.max(g.width,g.height))+1:b.mipmaps!==void 0&&b.mipmaps.length>0?b.mipmaps.length:b.isCompressedTexture&&Array.isArray(b.image)?g.mipmaps.length:1}function D(b){const g=b.target;g.removeEventListener("dispose",D),O(g),g.isVideoTexture&&d.delete(g)}function C(b){const g=b.target;g.removeEventListener("dispose",C),M(g)}function O(b){const g=n.get(b);if(g.__webglInit===void 0)return;const z=b.source,Z=f.get(z);if(Z){const J=Z[g.__cacheKey];J.usedTimes--,J.usedTimes===0&&E(b),Object.keys(Z).length===0&&f.delete(z)}n.remove(b)}function E(b){const g=n.get(b);i.deleteTexture(g.__webglTexture);const z=b.source,Z=f.get(z);delete Z[g.__cacheKey],a.memory.textures--}function M(b){const g=n.get(b);if(b.depthTexture&&(b.depthTexture.dispose(),n.remove(b.depthTexture)),b.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(g.__webglFramebuffer[Z]))for(let J=0;J<g.__webglFramebuffer[Z].length;J++)i.deleteFramebuffer(g.__webglFramebuffer[Z][J]);else i.deleteFramebuffer(g.__webglFramebuffer[Z]);g.__webglDepthbuffer&&i.deleteRenderbuffer(g.__webglDepthbuffer[Z])}else{if(Array.isArray(g.__webglFramebuffer))for(let Z=0;Z<g.__webglFramebuffer.length;Z++)i.deleteFramebuffer(g.__webglFramebuffer[Z]);else i.deleteFramebuffer(g.__webglFramebuffer);if(g.__webglDepthbuffer&&i.deleteRenderbuffer(g.__webglDepthbuffer),g.__webglMultisampledFramebuffer&&i.deleteFramebuffer(g.__webglMultisampledFramebuffer),g.__webglColorRenderbuffer)for(let Z=0;Z<g.__webglColorRenderbuffer.length;Z++)g.__webglColorRenderbuffer[Z]&&i.deleteRenderbuffer(g.__webglColorRenderbuffer[Z]);g.__webglDepthRenderbuffer&&i.deleteRenderbuffer(g.__webglDepthRenderbuffer)}const z=b.textures;for(let Z=0,J=z.length;Z<J;Z++){const Y=n.get(z[Z]);Y.__webglTexture&&(i.deleteTexture(Y.__webglTexture),a.memory.textures--),n.remove(z[Z])}n.remove(b)}let L=0;function k(){L=0}function H(){const b=L;return b>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+b+" texture units while this GPU supports only "+s.maxTextures),L+=1,b}function X(b){const g=[];return g.push(b.wrapS),g.push(b.wrapT),g.push(b.wrapR||0),g.push(b.magFilter),g.push(b.minFilter),g.push(b.anisotropy),g.push(b.internalFormat),g.push(b.format),g.push(b.type),g.push(b.generateMipmaps),g.push(b.premultiplyAlpha),g.push(b.flipY),g.push(b.unpackAlignment),g.push(b.colorSpace),g.join()}function $(b,g){const z=n.get(b);if(b.isVideoTexture&&Fe(b),b.isRenderTargetTexture===!1&&b.version>0&&z.__version!==b.version){const Z=b.image;if(Z===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Ue(z,b,g);return}}t.bindTexture(i.TEXTURE_2D,z.__webglTexture,i.TEXTURE0+g)}function W(b,g){const z=n.get(b);if(b.version>0&&z.__version!==b.version){Ue(z,b,g);return}t.bindTexture(i.TEXTURE_2D_ARRAY,z.__webglTexture,i.TEXTURE0+g)}function ee(b,g){const z=n.get(b);if(b.version>0&&z.__version!==b.version){Ue(z,b,g);return}t.bindTexture(i.TEXTURE_3D,z.__webglTexture,i.TEXTURE0+g)}function q(b,g){const z=n.get(b);if(b.version>0&&z.__version!==b.version){fe(z,b,g);return}t.bindTexture(i.TEXTURE_CUBE_MAP,z.__webglTexture,i.TEXTURE0+g)}const me={[ca]:i.REPEAT,[gi]:i.CLAMP_TO_EDGE,[ua]:i.MIRRORED_REPEAT},ye={[Tn]:i.NEAREST,[Tc]:i.NEAREST_MIPMAP_NEAREST,[ys]:i.NEAREST_MIPMAP_LINEAR,[Cn]:i.LINEAR,[fr]:i.LINEAR_MIPMAP_NEAREST,[_i]:i.LINEAR_MIPMAP_LINEAR},De={[Cc]:i.NEVER,[Nc]:i.ALWAYS,[Pc]:i.LESS,[Cl]:i.LEQUAL,[Dc]:i.EQUAL,[Ic]:i.GEQUAL,[Lc]:i.GREATER,[Uc]:i.NOTEQUAL};function je(b,g){if(g.type===kn&&e.has("OES_texture_float_linear")===!1&&(g.magFilter===Cn||g.magFilter===fr||g.magFilter===ys||g.magFilter===_i||g.minFilter===Cn||g.minFilter===fr||g.minFilter===ys||g.minFilter===_i)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(b,i.TEXTURE_WRAP_S,me[g.wrapS]),i.texParameteri(b,i.TEXTURE_WRAP_T,me[g.wrapT]),(b===i.TEXTURE_3D||b===i.TEXTURE_2D_ARRAY)&&i.texParameteri(b,i.TEXTURE_WRAP_R,me[g.wrapR]),i.texParameteri(b,i.TEXTURE_MAG_FILTER,ye[g.magFilter]),i.texParameteri(b,i.TEXTURE_MIN_FILTER,ye[g.minFilter]),g.compareFunction&&(i.texParameteri(b,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(b,i.TEXTURE_COMPARE_FUNC,De[g.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(g.magFilter===Tn||g.minFilter!==ys&&g.minFilter!==_i||g.type===kn&&e.has("OES_texture_float_linear")===!1)return;if(g.anisotropy>1||n.get(g).__currentAnisotropy){const z=e.get("EXT_texture_filter_anisotropic");i.texParameterf(b,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(g.anisotropy,s.getMaxAnisotropy())),n.get(g).__currentAnisotropy=g.anisotropy}}}function Ge(b,g){let z=!1;b.__webglInit===void 0&&(b.__webglInit=!0,g.addEventListener("dispose",D));const Z=g.source;let J=f.get(Z);J===void 0&&(J={},f.set(Z,J));const Y=X(g);if(Y!==b.__cacheKey){J[Y]===void 0&&(J[Y]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,z=!0),J[Y].usedTimes++;const Re=J[b.__cacheKey];Re!==void 0&&(J[b.__cacheKey].usedTimes--,Re.usedTimes===0&&E(g)),b.__cacheKey=Y,b.__webglTexture=J[Y].texture}return z}function K(b,g,z){return Math.floor(Math.floor(b/z)/g)}function ue(b,g,z,Z){const Y=b.updateRanges;if(Y.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,g.width,g.height,z,Z,g.data);else{Y.sort((te,Me)=>te.start-Me.start);let Re=0;for(let te=1;te<Y.length;te++){const Me=Y[Re],Be=Y[te],Oe=Me.start+Me.count,he=K(Be.start,g.width,4),Ce=K(Me.start,g.width,4);Be.start<=Oe+1&&he===Ce&&K(Be.start+Be.count-1,g.width,4)===he?Me.count=Math.max(Me.count,Be.start+Be.count-Me.start):(++Re,Y[Re]=Be)}Y.length=Re+1;const se=i.getParameter(i.UNPACK_ROW_LENGTH),ae=i.getParameter(i.UNPACK_SKIP_PIXELS),xe=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,g.width);for(let te=0,Me=Y.length;te<Me;te++){const Be=Y[te],Oe=Math.floor(Be.start/4),he=Math.ceil(Be.count/4),Ce=Oe%g.width,U=Math.floor(Oe/g.width),oe=he,ne=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Ce),i.pixelStorei(i.UNPACK_SKIP_ROWS,U),t.texSubImage2D(i.TEXTURE_2D,0,Ce,U,oe,ne,z,Z,g.data)}b.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,se),i.pixelStorei(i.UNPACK_SKIP_PIXELS,ae),i.pixelStorei(i.UNPACK_SKIP_ROWS,xe)}}function Ue(b,g,z){let Z=i.TEXTURE_2D;(g.isDataArrayTexture||g.isCompressedArrayTexture)&&(Z=i.TEXTURE_2D_ARRAY),g.isData3DTexture&&(Z=i.TEXTURE_3D);const J=Ge(b,g),Y=g.source;t.bindTexture(Z,b.__webglTexture,i.TEXTURE0+z);const Re=n.get(Y);if(Y.version!==Re.__version||J===!0){t.activeTexture(i.TEXTURE0+z);const se=ut.getPrimaries(ut.workingColorSpace),ae=g.colorSpace===ti?null:ut.getPrimaries(g.colorSpace),xe=g.colorSpace===ti||se===ae?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,g.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,g.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,xe);let te=S(g.image,!1,s.maxTextureSize);te=Xe(g,te);const Me=r.convert(g.format,g.colorSpace),Be=r.convert(g.type);let Oe=T(g.internalFormat,Me,Be,g.colorSpace,g.isVideoTexture);je(Z,g);let he;const Ce=g.mipmaps,U=g.isVideoTexture!==!0,oe=Re.__version===void 0||J===!0,ne=Y.dataReady,be=F(g,te);if(g.isDepthTexture)Oe=y(g.format===gs,g.type),oe&&(U?t.texStorage2D(i.TEXTURE_2D,1,Oe,te.width,te.height):t.texImage2D(i.TEXTURE_2D,0,Oe,te.width,te.height,0,Me,Be,null));else if(g.isDataTexture)if(Ce.length>0){U&&oe&&t.texStorage2D(i.TEXTURE_2D,be,Oe,Ce[0].width,Ce[0].height);for(let ie=0,j=Ce.length;ie<j;ie++)he=Ce[ie],U?ne&&t.texSubImage2D(i.TEXTURE_2D,ie,0,0,he.width,he.height,Me,Be,he.data):t.texImage2D(i.TEXTURE_2D,ie,Oe,he.width,he.height,0,Me,Be,he.data);g.generateMipmaps=!1}else U?(oe&&t.texStorage2D(i.TEXTURE_2D,be,Oe,te.width,te.height),ne&&ue(g,te,Me,Be)):t.texImage2D(i.TEXTURE_2D,0,Oe,te.width,te.height,0,Me,Be,te.data);else if(g.isCompressedTexture)if(g.isCompressedArrayTexture){U&&oe&&t.texStorage3D(i.TEXTURE_2D_ARRAY,be,Oe,Ce[0].width,Ce[0].height,te.depth);for(let ie=0,j=Ce.length;ie<j;ie++)if(he=Ce[ie],g.format!==bn)if(Me!==null)if(U){if(ne)if(g.layerUpdates.size>0){const Se=zo(he.width,he.height,g.format,g.type);for(const He of g.layerUpdates){const _t=he.data.subarray(He*Se/he.data.BYTES_PER_ELEMENT,(He+1)*Se/he.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ie,0,0,He,he.width,he.height,1,Me,_t)}g.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ie,0,0,0,he.width,he.height,te.depth,Me,he.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ie,Oe,he.width,he.height,te.depth,0,he.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else U?ne&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,ie,0,0,0,he.width,he.height,te.depth,Me,Be,he.data):t.texImage3D(i.TEXTURE_2D_ARRAY,ie,Oe,he.width,he.height,te.depth,0,Me,Be,he.data)}else{U&&oe&&t.texStorage2D(i.TEXTURE_2D,be,Oe,Ce[0].width,Ce[0].height);for(let ie=0,j=Ce.length;ie<j;ie++)he=Ce[ie],g.format!==bn?Me!==null?U?ne&&t.compressedTexSubImage2D(i.TEXTURE_2D,ie,0,0,he.width,he.height,Me,he.data):t.compressedTexImage2D(i.TEXTURE_2D,ie,Oe,he.width,he.height,0,he.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):U?ne&&t.texSubImage2D(i.TEXTURE_2D,ie,0,0,he.width,he.height,Me,Be,he.data):t.texImage2D(i.TEXTURE_2D,ie,Oe,he.width,he.height,0,Me,Be,he.data)}else if(g.isDataArrayTexture)if(U){if(oe&&t.texStorage3D(i.TEXTURE_2D_ARRAY,be,Oe,te.width,te.height,te.depth),ne)if(g.layerUpdates.size>0){const ie=zo(te.width,te.height,g.format,g.type);for(const j of g.layerUpdates){const Se=te.data.subarray(j*ie/te.data.BYTES_PER_ELEMENT,(j+1)*ie/te.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,j,te.width,te.height,1,Me,Be,Se)}g.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,te.width,te.height,te.depth,Me,Be,te.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Oe,te.width,te.height,te.depth,0,Me,Be,te.data);else if(g.isData3DTexture)U?(oe&&t.texStorage3D(i.TEXTURE_3D,be,Oe,te.width,te.height,te.depth),ne&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,te.width,te.height,te.depth,Me,Be,te.data)):t.texImage3D(i.TEXTURE_3D,0,Oe,te.width,te.height,te.depth,0,Me,Be,te.data);else if(g.isFramebufferTexture){if(oe)if(U)t.texStorage2D(i.TEXTURE_2D,be,Oe,te.width,te.height);else{let ie=te.width,j=te.height;for(let Se=0;Se<be;Se++)t.texImage2D(i.TEXTURE_2D,Se,Oe,ie,j,0,Me,Be,null),ie>>=1,j>>=1}}else if(Ce.length>0){if(U&&oe){const ie=Pt(Ce[0]);t.texStorage2D(i.TEXTURE_2D,be,Oe,ie.width,ie.height)}for(let ie=0,j=Ce.length;ie<j;ie++)he=Ce[ie],U?ne&&t.texSubImage2D(i.TEXTURE_2D,ie,0,0,Me,Be,he):t.texImage2D(i.TEXTURE_2D,ie,Oe,Me,Be,he);g.generateMipmaps=!1}else if(U){if(oe){const ie=Pt(te);t.texStorage2D(i.TEXTURE_2D,be,Oe,ie.width,ie.height)}ne&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,Me,Be,te)}else t.texImage2D(i.TEXTURE_2D,0,Oe,Me,Be,te);p(g)&&u(Z),Re.__version=Y.version,g.onUpdate&&g.onUpdate(g)}b.__version=g.version}function fe(b,g,z){if(g.image.length!==6)return;const Z=Ge(b,g),J=g.source;t.bindTexture(i.TEXTURE_CUBE_MAP,b.__webglTexture,i.TEXTURE0+z);const Y=n.get(J);if(J.version!==Y.__version||Z===!0){t.activeTexture(i.TEXTURE0+z);const Re=ut.getPrimaries(ut.workingColorSpace),se=g.colorSpace===ti?null:ut.getPrimaries(g.colorSpace),ae=g.colorSpace===ti||Re===se?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,g.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,g.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ae);const xe=g.isCompressedTexture||g.image[0].isCompressedTexture,te=g.image[0]&&g.image[0].isDataTexture,Me=[];for(let j=0;j<6;j++)!xe&&!te?Me[j]=S(g.image[j],!0,s.maxCubemapSize):Me[j]=te?g.image[j].image:g.image[j],Me[j]=Xe(g,Me[j]);const Be=Me[0],Oe=r.convert(g.format,g.colorSpace),he=r.convert(g.type),Ce=T(g.internalFormat,Oe,he,g.colorSpace),U=g.isVideoTexture!==!0,oe=Y.__version===void 0||Z===!0,ne=J.dataReady;let be=F(g,Be);je(i.TEXTURE_CUBE_MAP,g);let ie;if(xe){U&&oe&&t.texStorage2D(i.TEXTURE_CUBE_MAP,be,Ce,Be.width,Be.height);for(let j=0;j<6;j++){ie=Me[j].mipmaps;for(let Se=0;Se<ie.length;Se++){const He=ie[Se];g.format!==bn?Oe!==null?U?ne&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Se,0,0,He.width,He.height,Oe,He.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Se,Ce,He.width,He.height,0,He.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):U?ne&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Se,0,0,He.width,He.height,Oe,he,He.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Se,Ce,He.width,He.height,0,Oe,he,He.data)}}}else{if(ie=g.mipmaps,U&&oe){ie.length>0&&be++;const j=Pt(Me[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,be,Ce,j.width,j.height)}for(let j=0;j<6;j++)if(te){U?ne&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,Me[j].width,Me[j].height,Oe,he,Me[j].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,Ce,Me[j].width,Me[j].height,0,Oe,he,Me[j].data);for(let Se=0;Se<ie.length;Se++){const _t=ie[Se].image[j].image;U?ne&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Se+1,0,0,_t.width,_t.height,Oe,he,_t.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Se+1,Ce,_t.width,_t.height,0,Oe,he,_t.data)}}else{U?ne&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,Oe,he,Me[j]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,Ce,Oe,he,Me[j]);for(let Se=0;Se<ie.length;Se++){const He=ie[Se];U?ne&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Se+1,0,0,Oe,he,He.image[j]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Se+1,Ce,Oe,he,He.image[j])}}}p(g)&&u(i.TEXTURE_CUBE_MAP),Y.__version=J.version,g.onUpdate&&g.onUpdate(g)}b.__version=g.version}function Ne(b,g,z,Z,J,Y){const Re=r.convert(z.format,z.colorSpace),se=r.convert(z.type),ae=T(z.internalFormat,Re,se,z.colorSpace),xe=n.get(g),te=n.get(z);if(te.__renderTarget=g,!xe.__hasExternalTextures){const Me=Math.max(1,g.width>>Y),Be=Math.max(1,g.height>>Y);J===i.TEXTURE_3D||J===i.TEXTURE_2D_ARRAY?t.texImage3D(J,Y,ae,Me,Be,g.depth,0,Re,se,null):t.texImage2D(J,Y,ae,Me,Be,0,Re,se,null)}t.bindFramebuffer(i.FRAMEBUFFER,b),tt(g)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Z,J,te.__webglTexture,0,Pe(g)):(J===i.TEXTURE_2D||J>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Z,J,te.__webglTexture,Y),t.bindFramebuffer(i.FRAMEBUFFER,null)}function nt(b,g,z){if(i.bindRenderbuffer(i.RENDERBUFFER,b),g.depthBuffer){const Z=g.depthTexture,J=Z&&Z.isDepthTexture?Z.type:null,Y=y(g.stencilBuffer,J),Re=g.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,se=Pe(g);tt(g)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,se,Y,g.width,g.height):z?i.renderbufferStorageMultisample(i.RENDERBUFFER,se,Y,g.width,g.height):i.renderbufferStorage(i.RENDERBUFFER,Y,g.width,g.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Re,i.RENDERBUFFER,b)}else{const Z=g.textures;for(let J=0;J<Z.length;J++){const Y=Z[J],Re=r.convert(Y.format,Y.colorSpace),se=r.convert(Y.type),ae=T(Y.internalFormat,Re,se,Y.colorSpace),xe=Pe(g);z&&tt(g)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,xe,ae,g.width,g.height):tt(g)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,xe,ae,g.width,g.height):i.renderbufferStorage(i.RENDERBUFFER,ae,g.width,g.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function ze(b,g){if(g&&g.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,b),!(g.depthTexture&&g.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Z=n.get(g.depthTexture);Z.__renderTarget=g,(!Z.__webglTexture||g.depthTexture.image.width!==g.width||g.depthTexture.image.height!==g.height)&&(g.depthTexture.image.width=g.width,g.depthTexture.image.height=g.height,g.depthTexture.needsUpdate=!0),$(g.depthTexture,0);const J=Z.__webglTexture,Y=Pe(g);if(g.depthTexture.format===ms)tt(g)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,J,0,Y):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,J,0);else if(g.depthTexture.format===gs)tt(g)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,J,0,Y):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,J,0);else throw new Error("Unknown depthTexture format")}function Et(b){const g=n.get(b),z=b.isWebGLCubeRenderTarget===!0;if(g.__boundDepthTexture!==b.depthTexture){const Z=b.depthTexture;if(g.__depthDisposeCallback&&g.__depthDisposeCallback(),Z){const J=()=>{delete g.__boundDepthTexture,delete g.__depthDisposeCallback,Z.removeEventListener("dispose",J)};Z.addEventListener("dispose",J),g.__depthDisposeCallback=J}g.__boundDepthTexture=Z}if(b.depthTexture&&!g.__autoAllocateDepthBuffer){if(z)throw new Error("target.depthTexture not supported in Cube render targets");const Z=b.texture.mipmaps;Z&&Z.length>0?ze(g.__webglFramebuffer[0],b):ze(g.__webglFramebuffer,b)}else if(z){g.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)if(t.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer[Z]),g.__webglDepthbuffer[Z]===void 0)g.__webglDepthbuffer[Z]=i.createRenderbuffer(),nt(g.__webglDepthbuffer[Z],b,!1);else{const J=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Y=g.__webglDepthbuffer[Z];i.bindRenderbuffer(i.RENDERBUFFER,Y),i.framebufferRenderbuffer(i.FRAMEBUFFER,J,i.RENDERBUFFER,Y)}}else{const Z=b.texture.mipmaps;if(Z&&Z.length>0?t.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer),g.__webglDepthbuffer===void 0)g.__webglDepthbuffer=i.createRenderbuffer(),nt(g.__webglDepthbuffer,b,!1);else{const J=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Y=g.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,Y),i.framebufferRenderbuffer(i.FRAMEBUFFER,J,i.RENDERBUFFER,Y)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function yt(b,g,z){const Z=n.get(b);g!==void 0&&Ne(Z.__webglFramebuffer,b,b.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),z!==void 0&&Et(b)}function Ye(b){const g=b.texture,z=n.get(b),Z=n.get(g);b.addEventListener("dispose",C);const J=b.textures,Y=b.isWebGLCubeRenderTarget===!0,Re=J.length>1;if(Re||(Z.__webglTexture===void 0&&(Z.__webglTexture=i.createTexture()),Z.__version=g.version,a.memory.textures++),Y){z.__webglFramebuffer=[];for(let se=0;se<6;se++)if(g.mipmaps&&g.mipmaps.length>0){z.__webglFramebuffer[se]=[];for(let ae=0;ae<g.mipmaps.length;ae++)z.__webglFramebuffer[se][ae]=i.createFramebuffer()}else z.__webglFramebuffer[se]=i.createFramebuffer()}else{if(g.mipmaps&&g.mipmaps.length>0){z.__webglFramebuffer=[];for(let se=0;se<g.mipmaps.length;se++)z.__webglFramebuffer[se]=i.createFramebuffer()}else z.__webglFramebuffer=i.createFramebuffer();if(Re)for(let se=0,ae=J.length;se<ae;se++){const xe=n.get(J[se]);xe.__webglTexture===void 0&&(xe.__webglTexture=i.createTexture(),a.memory.textures++)}if(b.samples>0&&tt(b)===!1){z.__webglMultisampledFramebuffer=i.createFramebuffer(),z.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let se=0;se<J.length;se++){const ae=J[se];z.__webglColorRenderbuffer[se]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,z.__webglColorRenderbuffer[se]);const xe=r.convert(ae.format,ae.colorSpace),te=r.convert(ae.type),Me=T(ae.internalFormat,xe,te,ae.colorSpace,b.isXRRenderTarget===!0),Be=Pe(b);i.renderbufferStorageMultisample(i.RENDERBUFFER,Be,Me,b.width,b.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+se,i.RENDERBUFFER,z.__webglColorRenderbuffer[se])}i.bindRenderbuffer(i.RENDERBUFFER,null),b.depthBuffer&&(z.__webglDepthRenderbuffer=i.createRenderbuffer(),nt(z.__webglDepthRenderbuffer,b,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Y){t.bindTexture(i.TEXTURE_CUBE_MAP,Z.__webglTexture),je(i.TEXTURE_CUBE_MAP,g);for(let se=0;se<6;se++)if(g.mipmaps&&g.mipmaps.length>0)for(let ae=0;ae<g.mipmaps.length;ae++)Ne(z.__webglFramebuffer[se][ae],b,g,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+se,ae);else Ne(z.__webglFramebuffer[se],b,g,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+se,0);p(g)&&u(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Re){for(let se=0,ae=J.length;se<ae;se++){const xe=J[se],te=n.get(xe);t.bindTexture(i.TEXTURE_2D,te.__webglTexture),je(i.TEXTURE_2D,xe),Ne(z.__webglFramebuffer,b,xe,i.COLOR_ATTACHMENT0+se,i.TEXTURE_2D,0),p(xe)&&u(i.TEXTURE_2D)}t.unbindTexture()}else{let se=i.TEXTURE_2D;if((b.isWebGL3DRenderTarget||b.isWebGLArrayRenderTarget)&&(se=b.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(se,Z.__webglTexture),je(se,g),g.mipmaps&&g.mipmaps.length>0)for(let ae=0;ae<g.mipmaps.length;ae++)Ne(z.__webglFramebuffer[ae],b,g,i.COLOR_ATTACHMENT0,se,ae);else Ne(z.__webglFramebuffer,b,g,i.COLOR_ATTACHMENT0,se,0);p(g)&&u(se),t.unbindTexture()}b.depthBuffer&&Et(b)}function R(b){const g=b.textures;for(let z=0,Z=g.length;z<Z;z++){const J=g[z];if(p(J)){const Y=w(b),Re=n.get(J).__webglTexture;t.bindTexture(Y,Re),u(Y),t.unbindTexture()}}}const st=[],rt=[];function ft(b){if(b.samples>0){if(tt(b)===!1){const g=b.textures,z=b.width,Z=b.height;let J=i.COLOR_BUFFER_BIT;const Y=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Re=n.get(b),se=g.length>1;if(se)for(let xe=0;xe<g.length;xe++)t.bindFramebuffer(i.FRAMEBUFFER,Re.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+xe,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Re.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+xe,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Re.__webglMultisampledFramebuffer);const ae=b.texture.mipmaps;ae&&ae.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Re.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Re.__webglFramebuffer);for(let xe=0;xe<g.length;xe++){if(b.resolveDepthBuffer&&(b.depthBuffer&&(J|=i.DEPTH_BUFFER_BIT),b.stencilBuffer&&b.resolveStencilBuffer&&(J|=i.STENCIL_BUFFER_BIT)),se){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Re.__webglColorRenderbuffer[xe]);const te=n.get(g[xe]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,te,0)}i.blitFramebuffer(0,0,z,Z,0,0,z,Z,J,i.NEAREST),l===!0&&(st.length=0,rt.length=0,st.push(i.COLOR_ATTACHMENT0+xe),b.depthBuffer&&b.resolveDepthBuffer===!1&&(st.push(Y),rt.push(Y),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,rt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,st))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),se)for(let xe=0;xe<g.length;xe++){t.bindFramebuffer(i.FRAMEBUFFER,Re.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+xe,i.RENDERBUFFER,Re.__webglColorRenderbuffer[xe]);const te=n.get(g[xe]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Re.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+xe,i.TEXTURE_2D,te,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Re.__webglMultisampledFramebuffer)}else if(b.depthBuffer&&b.resolveDepthBuffer===!1&&l){const g=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[g])}}}function Pe(b){return Math.min(s.maxSamples,b.samples)}function tt(b){const g=n.get(b);return b.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&g.__useRenderToTexture!==!1}function Fe(b){const g=a.render.frame;d.get(b)!==g&&(d.set(b,g),b.update())}function Xe(b,g){const z=b.colorSpace,Z=b.format,J=b.type;return b.isCompressedTexture===!0||b.isVideoTexture===!0||z!==ji&&z!==ti&&(ut.getTransfer(z)===Mt?(Z!==bn||J!==Dn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",z)),g}function Pt(b){return typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement?(c.width=b.naturalWidth||b.width,c.height=b.naturalHeight||b.height):typeof VideoFrame<"u"&&b instanceof VideoFrame?(c.width=b.displayWidth,c.height=b.displayHeight):(c.width=b.width,c.height=b.height),c}this.allocateTextureUnit=H,this.resetTextureUnits=k,this.setTexture2D=$,this.setTexture2DArray=W,this.setTexture3D=ee,this.setTextureCube=q,this.rebindTextures=yt,this.setupRenderTarget=Ye,this.updateRenderTargetMipmap=R,this.updateMultisampleRenderTarget=ft,this.setupDepthRenderbuffer=Et,this.setupFrameBufferTexture=Ne,this.useMultisampledRTT=tt}function mm(i,e){function t(n,s=ti){let r;const a=ut.getTransfer(s);if(n===Dn)return i.UNSIGNED_BYTE;if(n===Ga)return i.UNSIGNED_SHORT_4_4_4_4;if(n===ka)return i.UNSIGNED_SHORT_5_5_5_1;if(n===El)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Ml)return i.BYTE;if(n===Sl)return i.SHORT;if(n===fs)return i.UNSIGNED_SHORT;if(n===Va)return i.INT;if(n===xi)return i.UNSIGNED_INT;if(n===kn)return i.FLOAT;if(n===vs)return i.HALF_FLOAT;if(n===yl)return i.ALPHA;if(n===bl)return i.RGB;if(n===bn)return i.RGBA;if(n===ms)return i.DEPTH_COMPONENT;if(n===gs)return i.DEPTH_STENCIL;if(n===Tl)return i.RED;if(n===Wa)return i.RED_INTEGER;if(n===Al)return i.RG;if(n===Xa)return i.RG_INTEGER;if(n===qa)return i.RGBA_INTEGER;if(n===js||n===$s||n===Ks||n===Js)if(a===Mt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===js)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===$s)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Ks)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Js)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===js)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===$s)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Ks)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Js)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ha||n===da||n===fa||n===pa)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===ha)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===da)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===fa)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===pa)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===ma||n===ga||n===_a)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===ma||n===ga)return a===Mt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===_a)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===va||n===xa||n===Ma||n===Sa||n===Ea||n===ya||n===ba||n===Ta||n===Aa||n===wa||n===Ra||n===Ca||n===Pa||n===Da)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===va)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===xa)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ma)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Sa)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ea)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ya)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ba)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Ta)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Aa)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===wa)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ra)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Ca)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Pa)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Da)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Qs||n===La||n===Ua)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Qs)return a===Mt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===La)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Ua)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===wl||n===Ia||n===Na||n===Fa)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Qs)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Ia)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Na)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Fa)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ps?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const gm=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,_m=`
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

}`;class vm{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const s=new en,r=e.properties.get(s);r.__webglTexture=t.texture,(t.depthNear!==n.depthNear||t.depthFar!==n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new ri({vertexShader:gm,fragmentShader:_m,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new gt(new vi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class xm extends Si{constructor(e,t){super();const n=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,d=null,h=null,f=null,m=null,x=null;const S=new vm,p=t.getContextAttributes();let u=null,w=null;const T=[],y=[],F=new qe;let D=null;const C=new gn;C.viewport=new Lt;const O=new gn;O.viewport=new Lt;const E=[C,O],M=new Ou;let L=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let ue=T[K];return ue===void 0&&(ue=new Ir,T[K]=ue),ue.getTargetRaySpace()},this.getControllerGrip=function(K){let ue=T[K];return ue===void 0&&(ue=new Ir,T[K]=ue),ue.getGripSpace()},this.getHand=function(K){let ue=T[K];return ue===void 0&&(ue=new Ir,T[K]=ue),ue.getHandSpace()};function H(K){const ue=y.indexOf(K.inputSource);if(ue===-1)return;const Ue=T[ue];Ue!==void 0&&(Ue.update(K.inputSource,K.frame,c||a),Ue.dispatchEvent({type:K.type,data:K.inputSource}))}function X(){s.removeEventListener("select",H),s.removeEventListener("selectstart",H),s.removeEventListener("selectend",H),s.removeEventListener("squeeze",H),s.removeEventListener("squeezestart",H),s.removeEventListener("squeezeend",H),s.removeEventListener("end",X),s.removeEventListener("inputsourceschange",$);for(let K=0;K<T.length;K++){const ue=y[K];ue!==null&&(y[K]=null,T[K].disconnect(ue))}L=null,k=null,S.reset(),e.setRenderTarget(u),m=null,f=null,h=null,s=null,w=null,Ge.stop(),n.isPresenting=!1,e.setPixelRatio(D),e.setSize(F.width,F.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){r=K,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){o=K,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(K){c=K},this.getBaseLayer=function(){return f!==null?f:m},this.getBinding=function(){return h},this.getFrame=function(){return x},this.getSession=function(){return s},this.setSession=async function(K){if(s=K,s!==null){if(u=e.getRenderTarget(),s.addEventListener("select",H),s.addEventListener("selectstart",H),s.addEventListener("selectend",H),s.addEventListener("squeeze",H),s.addEventListener("squeezestart",H),s.addEventListener("squeezeend",H),s.addEventListener("end",X),s.addEventListener("inputsourceschange",$),p.xrCompatible!==!0&&await t.makeXRCompatible(),D=e.getPixelRatio(),e.getSize(F),typeof XRWebGLBinding<"u"&&"createProjectionLayer"in XRWebGLBinding.prototype){let Ue=null,fe=null,Ne=null;p.depth&&(Ne=p.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Ue=p.stencil?gs:ms,fe=p.stencil?ps:xi);const nt={colorFormat:t.RGBA8,depthFormat:Ne,scaleFactor:r};h=new XRWebGLBinding(s,t),f=h.createProjectionLayer(nt),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),w=new Mi(f.textureWidth,f.textureHeight,{format:bn,type:Dn,depthTexture:new Bl(f.textureWidth,f.textureHeight,fe,void 0,void 0,void 0,void 0,void 0,void 0,Ue),stencilBuffer:p.stencil,colorSpace:e.outputColorSpace,samples:p.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const Ue={antialias:p.antialias,alpha:!0,depth:p.depth,stencil:p.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,t,Ue),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),w=new Mi(m.framebufferWidth,m.framebufferHeight,{format:bn,type:Dn,colorSpace:e.outputColorSpace,stencilBuffer:p.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}w.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Ge.setContext(s),Ge.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return S.getDepthTexture()};function $(K){for(let ue=0;ue<K.removed.length;ue++){const Ue=K.removed[ue],fe=y.indexOf(Ue);fe>=0&&(y[fe]=null,T[fe].disconnect(Ue))}for(let ue=0;ue<K.added.length;ue++){const Ue=K.added[ue];let fe=y.indexOf(Ue);if(fe===-1){for(let nt=0;nt<T.length;nt++)if(nt>=y.length){y.push(Ue),fe=nt;break}else if(y[nt]===null){y[nt]=Ue,fe=nt;break}if(fe===-1)break}const Ne=T[fe];Ne&&Ne.connect(Ue)}}const W=new P,ee=new P;function q(K,ue,Ue){W.setFromMatrixPosition(ue.matrixWorld),ee.setFromMatrixPosition(Ue.matrixWorld);const fe=W.distanceTo(ee),Ne=ue.projectionMatrix.elements,nt=Ue.projectionMatrix.elements,ze=Ne[14]/(Ne[10]-1),Et=Ne[14]/(Ne[10]+1),yt=(Ne[9]+1)/Ne[5],Ye=(Ne[9]-1)/Ne[5],R=(Ne[8]-1)/Ne[0],st=(nt[8]+1)/nt[0],rt=ze*R,ft=ze*st,Pe=fe/(-R+st),tt=Pe*-R;if(ue.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(tt),K.translateZ(Pe),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert(),Ne[10]===-1)K.projectionMatrix.copy(ue.projectionMatrix),K.projectionMatrixInverse.copy(ue.projectionMatrixInverse);else{const Fe=ze+Pe,Xe=Et+Pe,Pt=rt-tt,b=ft+(fe-tt),g=yt*Et/Xe*Fe,z=Ye*Et/Xe*Fe;K.projectionMatrix.makePerspective(Pt,b,g,z,Fe,Xe),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}}function me(K,ue){ue===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(ue.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(s===null)return;let ue=K.near,Ue=K.far;S.texture!==null&&(S.depthNear>0&&(ue=S.depthNear),S.depthFar>0&&(Ue=S.depthFar)),M.near=O.near=C.near=ue,M.far=O.far=C.far=Ue,(L!==M.near||k!==M.far)&&(s.updateRenderState({depthNear:M.near,depthFar:M.far}),L=M.near,k=M.far),C.layers.mask=K.layers.mask|2,O.layers.mask=K.layers.mask|4,M.layers.mask=C.layers.mask|O.layers.mask;const fe=K.parent,Ne=M.cameras;me(M,fe);for(let nt=0;nt<Ne.length;nt++)me(Ne[nt],fe);Ne.length===2?q(M,C,O):M.projectionMatrix.copy(C.projectionMatrix),ye(K,M,fe)};function ye(K,ue,Ue){Ue===null?K.matrix.copy(ue.matrixWorld):(K.matrix.copy(Ue.matrixWorld),K.matrix.invert(),K.matrix.multiply(ue.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(ue.projectionMatrix),K.projectionMatrixInverse.copy(ue.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=_s*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(f===null&&m===null))return l},this.setFoveation=function(K){l=K,f!==null&&(f.fixedFoveation=K),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=K)},this.hasDepthSensing=function(){return S.texture!==null},this.getDepthSensingMesh=function(){return S.getMesh(M)};let De=null;function je(K,ue){if(d=ue.getViewerPose(c||a),x=ue,d!==null){const Ue=d.views;m!==null&&(e.setRenderTargetFramebuffer(w,m.framebuffer),e.setRenderTarget(w));let fe=!1;Ue.length!==M.cameras.length&&(M.cameras.length=0,fe=!0);for(let ze=0;ze<Ue.length;ze++){const Et=Ue[ze];let yt=null;if(m!==null)yt=m.getViewport(Et);else{const R=h.getViewSubImage(f,Et);yt=R.viewport,ze===0&&(e.setRenderTargetTextures(w,R.colorTexture,R.depthStencilTexture),e.setRenderTarget(w))}let Ye=E[ze];Ye===void 0&&(Ye=new gn,Ye.layers.enable(ze),Ye.viewport=new Lt,E[ze]=Ye),Ye.matrix.fromArray(Et.transform.matrix),Ye.matrix.decompose(Ye.position,Ye.quaternion,Ye.scale),Ye.projectionMatrix.fromArray(Et.projectionMatrix),Ye.projectionMatrixInverse.copy(Ye.projectionMatrix).invert(),Ye.viewport.set(yt.x,yt.y,yt.width,yt.height),ze===0&&(M.matrix.copy(Ye.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),fe===!0&&M.cameras.push(Ye)}const Ne=s.enabledFeatures;if(Ne&&Ne.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&h){const ze=h.getDepthInformation(Ue[0]);ze&&ze.isValid&&ze.texture&&S.init(e,ze,s.renderState)}}for(let Ue=0;Ue<T.length;Ue++){const fe=y[Ue],Ne=T[Ue];fe!==null&&Ne!==void 0&&Ne.update(fe,ue,c||a)}De&&De(K,ue),ue.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ue}),x=null}const Ge=new Vl;Ge.setAnimationLoop(je),this.setAnimationLoop=function(K){De=K},this.dispose=function(){}}}const di=new Ln,Mm=new wt;function Sm(i,e){function t(p,u){p.matrixAutoUpdate===!0&&p.updateMatrix(),u.value.copy(p.matrix)}function n(p,u){u.color.getRGB(p.fogColor.value,Nl(i)),u.isFog?(p.fogNear.value=u.near,p.fogFar.value=u.far):u.isFogExp2&&(p.fogDensity.value=u.density)}function s(p,u,w,T,y){u.isMeshBasicMaterial||u.isMeshLambertMaterial?r(p,u):u.isMeshToonMaterial?(r(p,u),h(p,u)):u.isMeshPhongMaterial?(r(p,u),d(p,u)):u.isMeshStandardMaterial?(r(p,u),f(p,u),u.isMeshPhysicalMaterial&&m(p,u,y)):u.isMeshMatcapMaterial?(r(p,u),x(p,u)):u.isMeshDepthMaterial?r(p,u):u.isMeshDistanceMaterial?(r(p,u),S(p,u)):u.isMeshNormalMaterial?r(p,u):u.isLineBasicMaterial?(a(p,u),u.isLineDashedMaterial&&o(p,u)):u.isPointsMaterial?l(p,u,w,T):u.isSpriteMaterial?c(p,u):u.isShadowMaterial?(p.color.value.copy(u.color),p.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function r(p,u){p.opacity.value=u.opacity,u.color&&p.diffuse.value.copy(u.color),u.emissive&&p.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(p.map.value=u.map,t(u.map,p.mapTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,t(u.alphaMap,p.alphaMapTransform)),u.bumpMap&&(p.bumpMap.value=u.bumpMap,t(u.bumpMap,p.bumpMapTransform),p.bumpScale.value=u.bumpScale,u.side===on&&(p.bumpScale.value*=-1)),u.normalMap&&(p.normalMap.value=u.normalMap,t(u.normalMap,p.normalMapTransform),p.normalScale.value.copy(u.normalScale),u.side===on&&p.normalScale.value.negate()),u.displacementMap&&(p.displacementMap.value=u.displacementMap,t(u.displacementMap,p.displacementMapTransform),p.displacementScale.value=u.displacementScale,p.displacementBias.value=u.displacementBias),u.emissiveMap&&(p.emissiveMap.value=u.emissiveMap,t(u.emissiveMap,p.emissiveMapTransform)),u.specularMap&&(p.specularMap.value=u.specularMap,t(u.specularMap,p.specularMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest);const w=e.get(u),T=w.envMap,y=w.envMapRotation;T&&(p.envMap.value=T,di.copy(y),di.x*=-1,di.y*=-1,di.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(di.y*=-1,di.z*=-1),p.envMapRotation.value.setFromMatrix4(Mm.makeRotationFromEuler(di)),p.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=u.reflectivity,p.ior.value=u.ior,p.refractionRatio.value=u.refractionRatio),u.lightMap&&(p.lightMap.value=u.lightMap,p.lightMapIntensity.value=u.lightMapIntensity,t(u.lightMap,p.lightMapTransform)),u.aoMap&&(p.aoMap.value=u.aoMap,p.aoMapIntensity.value=u.aoMapIntensity,t(u.aoMap,p.aoMapTransform))}function a(p,u){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,u.map&&(p.map.value=u.map,t(u.map,p.mapTransform))}function o(p,u){p.dashSize.value=u.dashSize,p.totalSize.value=u.dashSize+u.gapSize,p.scale.value=u.scale}function l(p,u,w,T){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,p.size.value=u.size*w,p.scale.value=T*.5,u.map&&(p.map.value=u.map,t(u.map,p.uvTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,t(u.alphaMap,p.alphaMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest)}function c(p,u){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,p.rotation.value=u.rotation,u.map&&(p.map.value=u.map,t(u.map,p.mapTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,t(u.alphaMap,p.alphaMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest)}function d(p,u){p.specular.value.copy(u.specular),p.shininess.value=Math.max(u.shininess,1e-4)}function h(p,u){u.gradientMap&&(p.gradientMap.value=u.gradientMap)}function f(p,u){p.metalness.value=u.metalness,u.metalnessMap&&(p.metalnessMap.value=u.metalnessMap,t(u.metalnessMap,p.metalnessMapTransform)),p.roughness.value=u.roughness,u.roughnessMap&&(p.roughnessMap.value=u.roughnessMap,t(u.roughnessMap,p.roughnessMapTransform)),u.envMap&&(p.envMapIntensity.value=u.envMapIntensity)}function m(p,u,w){p.ior.value=u.ior,u.sheen>0&&(p.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),p.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(p.sheenColorMap.value=u.sheenColorMap,t(u.sheenColorMap,p.sheenColorMapTransform)),u.sheenRoughnessMap&&(p.sheenRoughnessMap.value=u.sheenRoughnessMap,t(u.sheenRoughnessMap,p.sheenRoughnessMapTransform))),u.clearcoat>0&&(p.clearcoat.value=u.clearcoat,p.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(p.clearcoatMap.value=u.clearcoatMap,t(u.clearcoatMap,p.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,t(u.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(p.clearcoatNormalMap.value=u.clearcoatNormalMap,t(u.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===on&&p.clearcoatNormalScale.value.negate())),u.dispersion>0&&(p.dispersion.value=u.dispersion),u.iridescence>0&&(p.iridescence.value=u.iridescence,p.iridescenceIOR.value=u.iridescenceIOR,p.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(p.iridescenceMap.value=u.iridescenceMap,t(u.iridescenceMap,p.iridescenceMapTransform)),u.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=u.iridescenceThicknessMap,t(u.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),u.transmission>0&&(p.transmission.value=u.transmission,p.transmissionSamplerMap.value=w.texture,p.transmissionSamplerSize.value.set(w.width,w.height),u.transmissionMap&&(p.transmissionMap.value=u.transmissionMap,t(u.transmissionMap,p.transmissionMapTransform)),p.thickness.value=u.thickness,u.thicknessMap&&(p.thicknessMap.value=u.thicknessMap,t(u.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=u.attenuationDistance,p.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(p.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(p.anisotropyMap.value=u.anisotropyMap,t(u.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=u.specularIntensity,p.specularColor.value.copy(u.specularColor),u.specularColorMap&&(p.specularColorMap.value=u.specularColorMap,t(u.specularColorMap,p.specularColorMapTransform)),u.specularIntensityMap&&(p.specularIntensityMap.value=u.specularIntensityMap,t(u.specularIntensityMap,p.specularIntensityMapTransform))}function x(p,u){u.matcap&&(p.matcap.value=u.matcap)}function S(p,u){const w=e.get(u).light;p.referencePosition.value.setFromMatrixPosition(w.matrixWorld),p.nearDistance.value=w.shadow.camera.near,p.farDistance.value=w.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Em(i,e,t,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(w,T){const y=T.program;n.uniformBlockBinding(w,y)}function c(w,T){let y=s[w.id];y===void 0&&(x(w),y=d(w),s[w.id]=y,w.addEventListener("dispose",p));const F=T.program;n.updateUBOMapping(w,F);const D=e.render.frame;r[w.id]!==D&&(f(w),r[w.id]=D)}function d(w){const T=h();w.__bindingPointIndex=T;const y=i.createBuffer(),F=w.__size,D=w.usage;return i.bindBuffer(i.UNIFORM_BUFFER,y),i.bufferData(i.UNIFORM_BUFFER,F,D),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,T,y),y}function h(){for(let w=0;w<o;w++)if(a.indexOf(w)===-1)return a.push(w),w;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(w){const T=s[w.id],y=w.uniforms,F=w.__cache;i.bindBuffer(i.UNIFORM_BUFFER,T);for(let D=0,C=y.length;D<C;D++){const O=Array.isArray(y[D])?y[D]:[y[D]];for(let E=0,M=O.length;E<M;E++){const L=O[E];if(m(L,D,E,F)===!0){const k=L.__offset,H=Array.isArray(L.value)?L.value:[L.value];let X=0;for(let $=0;$<H.length;$++){const W=H[$],ee=S(W);typeof W=="number"||typeof W=="boolean"?(L.__data[0]=W,i.bufferSubData(i.UNIFORM_BUFFER,k+X,L.__data)):W.isMatrix3?(L.__data[0]=W.elements[0],L.__data[1]=W.elements[1],L.__data[2]=W.elements[2],L.__data[3]=0,L.__data[4]=W.elements[3],L.__data[5]=W.elements[4],L.__data[6]=W.elements[5],L.__data[7]=0,L.__data[8]=W.elements[6],L.__data[9]=W.elements[7],L.__data[10]=W.elements[8],L.__data[11]=0):(W.toArray(L.__data,X),X+=ee.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,k,L.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(w,T,y,F){const D=w.value,C=T+"_"+y;if(F[C]===void 0)return typeof D=="number"||typeof D=="boolean"?F[C]=D:F[C]=D.clone(),!0;{const O=F[C];if(typeof D=="number"||typeof D=="boolean"){if(O!==D)return F[C]=D,!0}else if(O.equals(D)===!1)return O.copy(D),!0}return!1}function x(w){const T=w.uniforms;let y=0;const F=16;for(let C=0,O=T.length;C<O;C++){const E=Array.isArray(T[C])?T[C]:[T[C]];for(let M=0,L=E.length;M<L;M++){const k=E[M],H=Array.isArray(k.value)?k.value:[k.value];for(let X=0,$=H.length;X<$;X++){const W=H[X],ee=S(W),q=y%F,me=q%ee.boundary,ye=q+me;y+=me,ye!==0&&F-ye<ee.storage&&(y+=F-ye),k.__data=new Float32Array(ee.storage/Float32Array.BYTES_PER_ELEMENT),k.__offset=y,y+=ee.storage}}}const D=y%F;return D>0&&(y+=F-D),w.__size=y,w.__cache={},this}function S(w){const T={boundary:0,storage:0};return typeof w=="number"||typeof w=="boolean"?(T.boundary=4,T.storage=4):w.isVector2?(T.boundary=8,T.storage=8):w.isVector3||w.isColor?(T.boundary=16,T.storage=12):w.isVector4?(T.boundary=16,T.storage=16):w.isMatrix3?(T.boundary=48,T.storage=48):w.isMatrix4?(T.boundary=64,T.storage=64):w.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",w),T}function p(w){const T=w.target;T.removeEventListener("dispose",p);const y=a.indexOf(T.__bindingPointIndex);a.splice(y,1),i.deleteBuffer(s[T.id]),delete s[T.id],delete r[T.id]}function u(){for(const w in s)i.deleteBuffer(s[w]);a=[],s={},r={}}return{bind:l,update:c,dispose:u}}class ym{constructor(e={}){const{canvas:t=Jc(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:h=!1,reverseDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=a;const x=new Uint32Array(4),S=new Int32Array(4);let p=null,u=null;const w=[],T=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ii,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const y=this;let F=!1;this._outputColorSpace=an;let D=0,C=0,O=null,E=-1,M=null;const L=new Lt,k=new Lt;let H=null;const X=new lt(0);let $=0,W=t.width,ee=t.height,q=1,me=null,ye=null;const De=new Lt(0,0,W,ee),je=new Lt(0,0,W,ee);let Ge=!1;const K=new Ka;let ue=!1,Ue=!1;const fe=new wt,Ne=new wt,nt=new P,ze=new Lt,Et={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let yt=!1;function Ye(){return O===null?q:1}let R=n;function st(_,N){return t.getContext(_,N)}try{const _={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:d,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Ha}`),t.addEventListener("webglcontextlost",be,!1),t.addEventListener("webglcontextrestored",ie,!1),t.addEventListener("webglcontextcreationerror",j,!1),R===null){const N="webgl2";if(R=st(N,_),R===null)throw st(N)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(_){throw console.error("THREE.WebGLRenderer: "+_.message),_}let rt,ft,Pe,tt,Fe,Xe,Pt,b,g,z,Z,J,Y,Re,se,ae,xe,te,Me,Be,Oe,he,Ce,U;function oe(){rt=new Uf(R),rt.init(),he=new mm(R,rt),ft=new Af(R,rt,e,he),Pe=new fm(R,rt),ft.reverseDepthBuffer&&f&&Pe.buffers.depth.setReversed(!0),tt=new Ff(R),Fe=new em,Xe=new pm(R,rt,Pe,Fe,ft,he,tt),Pt=new Rf(y),b=new Lf(y),g=new Vu(R),Ce=new bf(R,g),z=new If(R,g,tt,Ce),Z=new Bf(R,z,g,tt),Me=new Of(R,ft,Xe),ae=new wf(Fe),J=new Qp(y,Pt,b,rt,ft,Ce,ae),Y=new Sm(y,Fe),Re=new nm,se=new lm(rt),te=new yf(y,Pt,b,Pe,Z,m,l),xe=new hm(y,Z,ft),U=new Em(R,tt,ft,Pe),Be=new Tf(R,rt,tt),Oe=new Nf(R,rt,tt),tt.programs=J.programs,y.capabilities=ft,y.extensions=rt,y.properties=Fe,y.renderLists=Re,y.shadowMap=xe,y.state=Pe,y.info=tt}oe();const ne=new xm(y,R);this.xr=ne,this.getContext=function(){return R},this.getContextAttributes=function(){return R.getContextAttributes()},this.forceContextLoss=function(){const _=rt.get("WEBGL_lose_context");_&&_.loseContext()},this.forceContextRestore=function(){const _=rt.get("WEBGL_lose_context");_&&_.restoreContext()},this.getPixelRatio=function(){return q},this.setPixelRatio=function(_){_!==void 0&&(q=_,this.setSize(W,ee,!1))},this.getSize=function(_){return _.set(W,ee)},this.setSize=function(_,N,V=!0){if(ne.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}W=_,ee=N,t.width=Math.floor(_*q),t.height=Math.floor(N*q),V===!0&&(t.style.width=_+"px",t.style.height=N+"px"),this.setViewport(0,0,_,N)},this.getDrawingBufferSize=function(_){return _.set(W*q,ee*q).floor()},this.setDrawingBufferSize=function(_,N,V){W=_,ee=N,q=V,t.width=Math.floor(_*V),t.height=Math.floor(N*V),this.setViewport(0,0,_,N)},this.getCurrentViewport=function(_){return _.copy(L)},this.getViewport=function(_){return _.copy(De)},this.setViewport=function(_,N,V,G){_.isVector4?De.set(_.x,_.y,_.z,_.w):De.set(_,N,V,G),Pe.viewport(L.copy(De).multiplyScalar(q).round())},this.getScissor=function(_){return _.copy(je)},this.setScissor=function(_,N,V,G){_.isVector4?je.set(_.x,_.y,_.z,_.w):je.set(_,N,V,G),Pe.scissor(k.copy(je).multiplyScalar(q).round())},this.getScissorTest=function(){return Ge},this.setScissorTest=function(_){Pe.setScissorTest(Ge=_)},this.setOpaqueSort=function(_){me=_},this.setTransparentSort=function(_){ye=_},this.getClearColor=function(_){return _.copy(te.getClearColor())},this.setClearColor=function(){te.setClearColor(...arguments)},this.getClearAlpha=function(){return te.getClearAlpha()},this.setClearAlpha=function(){te.setClearAlpha(...arguments)},this.clear=function(_=!0,N=!0,V=!0){let G=0;if(_){let I=!1;if(O!==null){const re=O.texture.format;I=re===qa||re===Xa||re===Wa}if(I){const re=O.texture.type,ge=re===Dn||re===xi||re===fs||re===ps||re===Ga||re===ka,Te=te.getClearColor(),Ee=te.getClearAlpha(),ke=Te.r,Ve=Te.g,Ie=Te.b;ge?(x[0]=ke,x[1]=Ve,x[2]=Ie,x[3]=Ee,R.clearBufferuiv(R.COLOR,0,x)):(S[0]=ke,S[1]=Ve,S[2]=Ie,S[3]=Ee,R.clearBufferiv(R.COLOR,0,S))}else G|=R.COLOR_BUFFER_BIT}N&&(G|=R.DEPTH_BUFFER_BIT),V&&(G|=R.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),R.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",be,!1),t.removeEventListener("webglcontextrestored",ie,!1),t.removeEventListener("webglcontextcreationerror",j,!1),te.dispose(),Re.dispose(),se.dispose(),Fe.dispose(),Pt.dispose(),b.dispose(),Z.dispose(),Ce.dispose(),U.dispose(),J.dispose(),ne.dispose(),ne.removeEventListener("sessionstart",ts),ne.removeEventListener("sessionend",Un),dn.stop()};function be(_){_.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),F=!0}function ie(){console.log("THREE.WebGLRenderer: Context Restored."),F=!1;const _=tt.autoReset,N=xe.enabled,V=xe.autoUpdate,G=xe.needsUpdate,I=xe.type;oe(),tt.autoReset=_,xe.enabled=N,xe.autoUpdate=V,xe.needsUpdate=G,xe.type=I}function j(_){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",_.statusMessage)}function Se(_){const N=_.target;N.removeEventListener("dispose",Se),He(N)}function He(_){_t(_),Fe.remove(_)}function _t(_){const N=Fe.get(_).programs;N!==void 0&&(N.forEach(function(V){J.releaseProgram(V)}),_.isShaderMaterial&&J.releaseShaderCache(_))}this.renderBufferDirect=function(_,N,V,G,I,re){N===null&&(N=Et);const ge=I.isMesh&&I.matrixWorld.determinant()<0,Te=Ms(_,N,V,G,I);Pe.setMaterial(G,ge);let Ee=V.index,ke=1;if(G.wireframe===!0){if(Ee=z.getWireframeAttribute(V),Ee===void 0)return;ke=2}const Ve=V.drawRange,Ie=V.attributes.position;let Ze=Ve.start*ke,ot=(Ve.start+Ve.count)*ke;re!==null&&(Ze=Math.max(Ze,re.start*ke),ot=Math.min(ot,(re.start+re.count)*ke)),Ee!==null?(Ze=Math.max(Ze,0),ot=Math.min(ot,Ee.count)):Ie!=null&&(Ze=Math.max(Ze,0),ot=Math.min(ot,Ie.count));const Tt=ot-Ze;if(Tt<0||Tt===1/0)return;Ce.setup(I,G,Te,V,Ee);let vt,ht=Be;if(Ee!==null&&(vt=g.get(Ee),ht=Oe,ht.setIndex(vt)),I.isMesh)G.wireframe===!0?(Pe.setLineWidth(G.wireframeLinewidth*Ye()),ht.setMode(R.LINES)):ht.setMode(R.TRIANGLES);else if(I.isLine){let v=G.linewidth;v===void 0&&(v=1),Pe.setLineWidth(v*Ye()),I.isLineSegments?ht.setMode(R.LINES):I.isLineLoop?ht.setMode(R.LINE_LOOP):ht.setMode(R.LINE_STRIP)}else I.isPoints?ht.setMode(R.POINTS):I.isSprite&&ht.setMode(R.TRIANGLES);if(I.isBatchedMesh)if(I._multiDrawInstances!==null)Wi("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ht.renderMultiDrawInstances(I._multiDrawStarts,I._multiDrawCounts,I._multiDrawCount,I._multiDrawInstances);else if(rt.get("WEBGL_multi_draw"))ht.renderMultiDraw(I._multiDrawStarts,I._multiDrawCounts,I._multiDrawCount);else{const v=I._multiDrawStarts,A=I._multiDrawCounts,B=I._multiDrawCount,Q=Ee?g.get(Ee).bytesPerElement:1,de=Fe.get(G).currentProgram.getUniforms();for(let ve=0;ve<B;ve++)de.setValue(R,"_gl_DrawID",ve),ht.render(v[ve]/Q,A[ve])}else if(I.isInstancedMesh)ht.renderInstances(Ze,Tt,I.count);else if(V.isInstancedBufferGeometry){const v=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,A=Math.min(V.instanceCount,v);ht.renderInstances(Ze,Tt,A)}else ht.render(Ze,Tt)};function at(_,N,V){_.transparent===!0&&_.side===_n&&_.forceSinglePass===!1?(_.side=on,_.needsUpdate=!0,Dt(_,N,V),_.side=si,_.needsUpdate=!0,Dt(_,N,V),_.side=_n):Dt(_,N,V)}this.compile=function(_,N,V=null){V===null&&(V=_),u=se.get(V),u.init(N),T.push(u),V.traverseVisible(function(I){I.isLight&&I.layers.test(N.layers)&&(u.pushLight(I),I.castShadow&&u.pushShadow(I))}),_!==V&&_.traverseVisible(function(I){I.isLight&&I.layers.test(N.layers)&&(u.pushLight(I),I.castShadow&&u.pushShadow(I))}),u.setupLights();const G=new Set;return _.traverse(function(I){if(!(I.isMesh||I.isPoints||I.isLine||I.isSprite))return;const re=I.material;if(re)if(Array.isArray(re))for(let ge=0;ge<re.length;ge++){const Te=re[ge];at(Te,V,I),G.add(Te)}else at(re,V,I),G.add(re)}),u=T.pop(),G},this.compileAsync=function(_,N,V=null){const G=this.compile(_,N,V);return new Promise(I=>{function re(){if(G.forEach(function(ge){Fe.get(ge).currentProgram.isReady()&&G.delete(ge)}),G.size===0){I(_);return}setTimeout(re,10)}rt.get("KHR_parallel_shader_compile")!==null?re():setTimeout(re,10)})};let nn=null;function hn(_){nn&&nn(_)}function ts(){dn.stop()}function Un(){dn.start()}const dn=new Vl;dn.setAnimationLoop(hn),typeof self<"u"&&dn.setContext(self),this.setAnimationLoop=function(_){nn=_,ne.setAnimationLoop(_),_===null?dn.stop():dn.start()},ne.addEventListener("sessionstart",ts),ne.addEventListener("sessionend",Un),this.render=function(_,N){if(N!==void 0&&N.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(F===!0)return;if(_.matrixWorldAutoUpdate===!0&&_.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),ne.enabled===!0&&ne.isPresenting===!0&&(ne.cameraAutoUpdate===!0&&ne.updateCamera(N),N=ne.getCamera()),_.isScene===!0&&_.onBeforeRender(y,_,N,O),u=se.get(_,T.length),u.init(N),T.push(u),Ne.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),K.setFromProjectionMatrix(Ne),Ue=this.localClippingEnabled,ue=ae.init(this.clippingPlanes,Ue),p=Re.get(_,w.length),p.init(),w.push(p),ne.enabled===!0&&ne.isPresenting===!0){const re=y.xr.getDepthSensingMesh();re!==null&&Ut(re,N,-1/0,y.sortObjects)}Ut(_,N,0,y.sortObjects),p.finish(),y.sortObjects===!0&&p.sort(me,ye),yt=ne.enabled===!1||ne.isPresenting===!1||ne.hasDepthSensing()===!1,yt&&te.addToRenderList(p,_),this.info.render.frame++,ue===!0&&ae.beginShadows();const V=u.state.shadowsArray;xe.render(V,_,N),ue===!0&&ae.endShadows(),this.info.autoReset===!0&&this.info.reset();const G=p.opaque,I=p.transmissive;if(u.setupLights(),N.isArrayCamera){const re=N.cameras;if(I.length>0)for(let ge=0,Te=re.length;ge<Te;ge++){const Ee=re[ge];An(G,I,_,Ee)}yt&&te.render(_);for(let ge=0,Te=re.length;ge<Te;ge++){const Ee=re[ge];ns(p,_,Ee,Ee.viewport)}}else I.length>0&&An(G,I,_,N),yt&&te.render(_),ns(p,_,N);O!==null&&C===0&&(Xe.updateMultisampleRenderTarget(O),Xe.updateRenderTargetMipmap(O)),_.isScene===!0&&_.onAfterRender(y,_,N),Ce.resetDefaultState(),E=-1,M=null,T.pop(),T.length>0?(u=T[T.length-1],ue===!0&&ae.setGlobalState(y.clippingPlanes,u.state.camera)):u=null,w.pop(),w.length>0?p=w[w.length-1]:p=null};function Ut(_,N,V,G){if(_.visible===!1)return;if(_.layers.test(N.layers)){if(_.isGroup)V=_.renderOrder;else if(_.isLOD)_.autoUpdate===!0&&_.update(N);else if(_.isLight)u.pushLight(_),_.castShadow&&u.pushShadow(_);else if(_.isSprite){if(!_.frustumCulled||K.intersectsSprite(_)){G&&ze.setFromMatrixPosition(_.matrixWorld).applyMatrix4(Ne);const ge=Z.update(_),Te=_.material;Te.visible&&p.push(_,ge,Te,V,ze.z,null)}}else if((_.isMesh||_.isLine||_.isPoints)&&(!_.frustumCulled||K.intersectsObject(_))){const ge=Z.update(_),Te=_.material;if(G&&(_.boundingSphere!==void 0?(_.boundingSphere===null&&_.computeBoundingSphere(),ze.copy(_.boundingSphere.center)):(ge.boundingSphere===null&&ge.computeBoundingSphere(),ze.copy(ge.boundingSphere.center)),ze.applyMatrix4(_.matrixWorld).applyMatrix4(Ne)),Array.isArray(Te)){const Ee=ge.groups;for(let ke=0,Ve=Ee.length;ke<Ve;ke++){const Ie=Ee[ke],Ze=Te[Ie.materialIndex];Ze&&Ze.visible&&p.push(_,ge,Ze,V,ze.z,Ie)}}else Te.visible&&p.push(_,ge,Te,V,ze.z,null)}}const re=_.children;for(let ge=0,Te=re.length;ge<Te;ge++)Ut(re[ge],N,V,G)}function ns(_,N,V,G){const I=_.opaque,re=_.transmissive,ge=_.transparent;u.setupLightsView(V),ue===!0&&ae.setGlobalState(y.clippingPlanes,V),G&&Pe.viewport(L.copy(G)),I.length>0&&wn(I,N,V),re.length>0&&wn(re,N,V),ge.length>0&&wn(ge,N,V),Pe.buffers.depth.setTest(!0),Pe.buffers.depth.setMask(!0),Pe.buffers.color.setMask(!0),Pe.setPolygonOffset(!1)}function An(_,N,V,G){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;u.state.transmissionRenderTarget[G.id]===void 0&&(u.state.transmissionRenderTarget[G.id]=new Mi(1,1,{generateMipmaps:!0,type:rt.has("EXT_color_buffer_half_float")||rt.has("EXT_color_buffer_float")?vs:Dn,minFilter:_i,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ut.workingColorSpace}));const re=u.state.transmissionRenderTarget[G.id],ge=G.viewport||L;re.setSize(ge.z*y.transmissionResolutionScale,ge.w*y.transmissionResolutionScale);const Te=y.getRenderTarget(),Ee=y.getActiveCubeFace(),ke=y.getActiveMipmapLevel();y.setRenderTarget(re),y.getClearColor(X),$=y.getClearAlpha(),$<1&&y.setClearColor(16777215,.5),y.clear(),yt&&te.render(V);const Ve=y.toneMapping;y.toneMapping=ii;const Ie=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),u.setupLightsView(G),ue===!0&&ae.setGlobalState(y.clippingPlanes,G),wn(_,V,G),Xe.updateMultisampleRenderTarget(re),Xe.updateRenderTargetMipmap(re),rt.has("WEBGL_multisampled_render_to_texture")===!1){let Ze=!1;for(let ot=0,Tt=N.length;ot<Tt;ot++){const vt=N[ot],ht=vt.object,v=vt.geometry,A=vt.material,B=vt.group;if(A.side===_n&&ht.layers.test(G.layers)){const Q=A.side;A.side=on,A.needsUpdate=!0,Vt(ht,V,G,v,A,B),A.side=Q,A.needsUpdate=!0,Ze=!0}}Ze===!0&&(Xe.updateMultisampleRenderTarget(re),Xe.updateRenderTargetMipmap(re))}y.setRenderTarget(Te,Ee,ke),y.setClearColor(X,$),Ie!==void 0&&(G.viewport=Ie),y.toneMapping=Ve}function wn(_,N,V){const G=N.isScene===!0?N.overrideMaterial:null;for(let I=0,re=_.length;I<re;I++){const ge=_[I],Te=ge.object,Ee=ge.geometry,ke=ge.group;let Ve=ge.material;Ve.allowOverride===!0&&G!==null&&(Ve=G),Te.layers.test(V.layers)&&Vt(Te,N,V,Ee,Ve,ke)}}function Vt(_,N,V,G,I,re){_.onBeforeRender(y,N,V,G,I,re),_.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,_.matrixWorld),_.normalMatrix.getNormalMatrix(_.modelViewMatrix),I.onBeforeRender(y,N,V,G,_,re),I.transparent===!0&&I.side===_n&&I.forceSinglePass===!1?(I.side=on,I.needsUpdate=!0,y.renderBufferDirect(V,N,G,I,_,re),I.side=si,I.needsUpdate=!0,y.renderBufferDirect(V,N,G,I,_,re),I.side=_n):y.renderBufferDirect(V,N,G,I,_,re),_.onAfterRender(y,N,V,G,I,re)}function Dt(_,N,V){N.isScene!==!0&&(N=Et);const G=Fe.get(_),I=u.state.lights,re=u.state.shadowsArray,ge=I.state.version,Te=J.getParameters(_,I.state,re,N,V),Ee=J.getProgramCacheKey(Te);let ke=G.programs;G.environment=_.isMeshStandardMaterial?N.environment:null,G.fog=N.fog,G.envMap=(_.isMeshStandardMaterial?b:Pt).get(_.envMap||G.environment),G.envMapRotation=G.environment!==null&&_.envMap===null?N.environmentRotation:_.envMapRotation,ke===void 0&&(_.addEventListener("dispose",Se),ke=new Map,G.programs=ke);let Ve=ke.get(Ee);if(Ve!==void 0){if(G.currentProgram===Ve&&G.lightsStateVersion===ge)return ai(_,Te),Ve}else Te.uniforms=J.getUniforms(_),_.onBeforeCompile(Te,y),Ve=J.acquireProgram(Te,Ee),ke.set(Ee,Ve),G.uniforms=Te.uniforms;const Ie=G.uniforms;return(!_.isShaderMaterial&&!_.isRawShaderMaterial||_.clipping===!0)&&(Ie.clippingPlanes=ae.uniform),ai(_,Te),G.needsLights=Ss(_),G.lightsStateVersion=ge,G.needsLights&&(Ie.ambientLightColor.value=I.state.ambient,Ie.lightProbe.value=I.state.probe,Ie.directionalLights.value=I.state.directional,Ie.directionalLightShadows.value=I.state.directionalShadow,Ie.spotLights.value=I.state.spot,Ie.spotLightShadows.value=I.state.spotShadow,Ie.rectAreaLights.value=I.state.rectArea,Ie.ltc_1.value=I.state.rectAreaLTC1,Ie.ltc_2.value=I.state.rectAreaLTC2,Ie.pointLights.value=I.state.point,Ie.pointLightShadows.value=I.state.pointShadow,Ie.hemisphereLights.value=I.state.hemi,Ie.directionalShadowMap.value=I.state.directionalShadowMap,Ie.directionalShadowMatrix.value=I.state.directionalShadowMatrix,Ie.spotShadowMap.value=I.state.spotShadowMap,Ie.spotLightMatrix.value=I.state.spotLightMatrix,Ie.spotLightMap.value=I.state.spotLightMap,Ie.pointShadowMap.value=I.state.pointShadowMap,Ie.pointShadowMatrix.value=I.state.pointShadowMatrix),G.currentProgram=Ve,G.uniformsList=null,Ve}function is(_){if(_.uniformsList===null){const N=_.currentProgram.getUniforms();_.uniformsList=er.seqWithValue(N.seq,_.uniforms)}return _.uniformsList}function ai(_,N){const V=Fe.get(_);V.outputColorSpace=N.outputColorSpace,V.batching=N.batching,V.batchingColor=N.batchingColor,V.instancing=N.instancing,V.instancingColor=N.instancingColor,V.instancingMorph=N.instancingMorph,V.skinning=N.skinning,V.morphTargets=N.morphTargets,V.morphNormals=N.morphNormals,V.morphColors=N.morphColors,V.morphTargetsCount=N.morphTargetsCount,V.numClippingPlanes=N.numClippingPlanes,V.numIntersection=N.numClipIntersection,V.vertexAlphas=N.vertexAlphas,V.vertexTangents=N.vertexTangents,V.toneMapping=N.toneMapping}function Ms(_,N,V,G,I){N.isScene!==!0&&(N=Et),Xe.resetTextureUnits();const re=N.fog,ge=G.isMeshStandardMaterial?N.environment:null,Te=O===null?y.outputColorSpace:O.isXRRenderTarget===!0?O.texture.colorSpace:ji,Ee=(G.isMeshStandardMaterial?b:Pt).get(G.envMap||ge),ke=G.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,Ve=!!V.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),Ie=!!V.morphAttributes.position,Ze=!!V.morphAttributes.normal,ot=!!V.morphAttributes.color;let Tt=ii;G.toneMapped&&(O===null||O.isXRRenderTarget===!0)&&(Tt=y.toneMapping);const vt=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,ht=vt!==void 0?vt.length:0,v=Fe.get(G),A=u.state.lights;if(ue===!0&&(Ue===!0||_!==M)){const dt=_===M&&G.id===E;ae.setState(G,_,dt)}let B=!1;G.version===v.__version?(v.needsLights&&v.lightsStateVersion!==A.state.version||v.outputColorSpace!==Te||I.isBatchedMesh&&v.batching===!1||!I.isBatchedMesh&&v.batching===!0||I.isBatchedMesh&&v.batchingColor===!0&&I.colorTexture===null||I.isBatchedMesh&&v.batchingColor===!1&&I.colorTexture!==null||I.isInstancedMesh&&v.instancing===!1||!I.isInstancedMesh&&v.instancing===!0||I.isSkinnedMesh&&v.skinning===!1||!I.isSkinnedMesh&&v.skinning===!0||I.isInstancedMesh&&v.instancingColor===!0&&I.instanceColor===null||I.isInstancedMesh&&v.instancingColor===!1&&I.instanceColor!==null||I.isInstancedMesh&&v.instancingMorph===!0&&I.morphTexture===null||I.isInstancedMesh&&v.instancingMorph===!1&&I.morphTexture!==null||v.envMap!==Ee||G.fog===!0&&v.fog!==re||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==ae.numPlanes||v.numIntersection!==ae.numIntersection)||v.vertexAlphas!==ke||v.vertexTangents!==Ve||v.morphTargets!==Ie||v.morphNormals!==Ze||v.morphColors!==ot||v.toneMapping!==Tt||v.morphTargetsCount!==ht)&&(B=!0):(B=!0,v.__version=G.version);let Q=v.currentProgram;B===!0&&(Q=Dt(G,N,I));let de=!1,ve=!1,We=!1;const Ae=Q.getUniforms(),we=v.uniforms;if(Pe.useProgram(Q.program)&&(de=!0,ve=!0,We=!0),G.id!==E&&(E=G.id,ve=!0),de||M!==_){Pe.buffers.depth.getReversed()?(fe.copy(_.projectionMatrix),eu(fe),tu(fe),Ae.setValue(R,"projectionMatrix",fe)):Ae.setValue(R,"projectionMatrix",_.projectionMatrix),Ae.setValue(R,"viewMatrix",_.matrixWorldInverse);const Qe=Ae.map.cameraPosition;Qe!==void 0&&Qe.setValue(R,nt.setFromMatrixPosition(_.matrixWorld)),ft.logarithmicDepthBuffer&&Ae.setValue(R,"logDepthBufFC",2/(Math.log(_.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&Ae.setValue(R,"isOrthographic",_.isOrthographicCamera===!0),M!==_&&(M=_,ve=!0,We=!0)}if(I.isSkinnedMesh){Ae.setOptional(R,I,"bindMatrix"),Ae.setOptional(R,I,"bindMatrixInverse");const dt=I.skeleton;dt&&(dt.boneTexture===null&&dt.computeBoneTexture(),Ae.setValue(R,"boneTexture",dt.boneTexture,Xe))}I.isBatchedMesh&&(Ae.setOptional(R,I,"batchingTexture"),Ae.setValue(R,"batchingTexture",I._matricesTexture,Xe),Ae.setOptional(R,I,"batchingIdTexture"),Ae.setValue(R,"batchingIdTexture",I._indirectTexture,Xe),Ae.setOptional(R,I,"batchingColorTexture"),I._colorsTexture!==null&&Ae.setValue(R,"batchingColorTexture",I._colorsTexture,Xe));const bt=V.morphAttributes;if((bt.position!==void 0||bt.normal!==void 0||bt.color!==void 0)&&Me.update(I,V,Q),(ve||v.receiveShadow!==I.receiveShadow)&&(v.receiveShadow=I.receiveShadow,Ae.setValue(R,"receiveShadow",I.receiveShadow)),G.isMeshGouraudMaterial&&G.envMap!==null&&(we.envMap.value=Ee,we.flipEnvMap.value=Ee.isCubeTexture&&Ee.isRenderTargetTexture===!1?-1:1),G.isMeshStandardMaterial&&G.envMap===null&&N.environment!==null&&(we.envMapIntensity.value=N.environmentIntensity),ve&&(Ae.setValue(R,"toneMappingExposure",y.toneMappingExposure),v.needsLights&&hr(we,We),re&&G.fog===!0&&Y.refreshFogUniforms(we,re),Y.refreshMaterialUniforms(we,G,q,ee,u.state.transmissionRenderTarget[_.id]),er.upload(R,is(v),we,Xe)),G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(er.upload(R,is(v),we,Xe),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&Ae.setValue(R,"center",I.center),Ae.setValue(R,"modelViewMatrix",I.modelViewMatrix),Ae.setValue(R,"normalMatrix",I.normalMatrix),Ae.setValue(R,"modelMatrix",I.matrixWorld),G.isShaderMaterial||G.isRawShaderMaterial){const dt=G.uniformsGroups;for(let Qe=0,It=dt.length;Qe<It;Qe++){const At=dt[Qe];U.update(At,Q),U.bind(At,Q)}}return Q}function hr(_,N){_.ambientLightColor.needsUpdate=N,_.lightProbe.needsUpdate=N,_.directionalLights.needsUpdate=N,_.directionalLightShadows.needsUpdate=N,_.pointLights.needsUpdate=N,_.pointLightShadows.needsUpdate=N,_.spotLights.needsUpdate=N,_.spotLightShadows.needsUpdate=N,_.rectAreaLights.needsUpdate=N,_.hemisphereLights.needsUpdate=N}function Ss(_){return _.isMeshLambertMaterial||_.isMeshToonMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isShadowMaterial||_.isShaderMaterial&&_.lights===!0}this.getActiveCubeFace=function(){return D},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return O},this.setRenderTargetTextures=function(_,N,V){const G=Fe.get(_);G.__autoAllocateDepthBuffer=_.resolveDepthBuffer===!1,G.__autoAllocateDepthBuffer===!1&&(G.__useRenderToTexture=!1),Fe.get(_.texture).__webglTexture=N,Fe.get(_.depthTexture).__webglTexture=G.__autoAllocateDepthBuffer?void 0:V,G.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(_,N){const V=Fe.get(_);V.__webglFramebuffer=N,V.__useDefaultFramebuffer=N===void 0};const In=R.createFramebuffer();this.setRenderTarget=function(_,N=0,V=0){O=_,D=N,C=V;let G=!0,I=null,re=!1,ge=!1;if(_){const Ee=Fe.get(_);if(Ee.__useDefaultFramebuffer!==void 0)Pe.bindFramebuffer(R.FRAMEBUFFER,null),G=!1;else if(Ee.__webglFramebuffer===void 0)Xe.setupRenderTarget(_);else if(Ee.__hasExternalTextures)Xe.rebindTextures(_,Fe.get(_.texture).__webglTexture,Fe.get(_.depthTexture).__webglTexture);else if(_.depthBuffer){const Ie=_.depthTexture;if(Ee.__boundDepthTexture!==Ie){if(Ie!==null&&Fe.has(Ie)&&(_.width!==Ie.image.width||_.height!==Ie.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Xe.setupDepthRenderbuffer(_)}}const ke=_.texture;(ke.isData3DTexture||ke.isDataArrayTexture||ke.isCompressedArrayTexture)&&(ge=!0);const Ve=Fe.get(_).__webglFramebuffer;_.isWebGLCubeRenderTarget?(Array.isArray(Ve[N])?I=Ve[N][V]:I=Ve[N],re=!0):_.samples>0&&Xe.useMultisampledRTT(_)===!1?I=Fe.get(_).__webglMultisampledFramebuffer:Array.isArray(Ve)?I=Ve[V]:I=Ve,L.copy(_.viewport),k.copy(_.scissor),H=_.scissorTest}else L.copy(De).multiplyScalar(q).floor(),k.copy(je).multiplyScalar(q).floor(),H=Ge;if(V!==0&&(I=In),Pe.bindFramebuffer(R.FRAMEBUFFER,I)&&G&&Pe.drawBuffers(_,I),Pe.viewport(L),Pe.scissor(k),Pe.setScissorTest(H),re){const Ee=Fe.get(_.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_CUBE_MAP_POSITIVE_X+N,Ee.__webglTexture,V)}else if(ge){const Ee=Fe.get(_.texture),ke=N;R.framebufferTextureLayer(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,Ee.__webglTexture,V,ke)}else if(_!==null&&V!==0){const Ee=Fe.get(_.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,Ee.__webglTexture,V)}E=-1},this.readRenderTargetPixels=function(_,N,V,G,I,re,ge,Te=0){if(!(_&&_.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ee=Fe.get(_).__webglFramebuffer;if(_.isWebGLCubeRenderTarget&&ge!==void 0&&(Ee=Ee[ge]),Ee){Pe.bindFramebuffer(R.FRAMEBUFFER,Ee);try{const ke=_.textures[Te],Ve=ke.format,Ie=ke.type;if(!ft.textureFormatReadable(Ve)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ft.textureTypeReadable(Ie)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=_.width-G&&V>=0&&V<=_.height-I&&(_.textures.length>1&&R.readBuffer(R.COLOR_ATTACHMENT0+Te),R.readPixels(N,V,G,I,he.convert(Ve),he.convert(Ie),re))}finally{const ke=O!==null?Fe.get(O).__webglFramebuffer:null;Pe.bindFramebuffer(R.FRAMEBUFFER,ke)}}},this.readRenderTargetPixelsAsync=async function(_,N,V,G,I,re,ge,Te=0){if(!(_&&_.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ee=Fe.get(_).__webglFramebuffer;if(_.isWebGLCubeRenderTarget&&ge!==void 0&&(Ee=Ee[ge]),Ee)if(N>=0&&N<=_.width-G&&V>=0&&V<=_.height-I){Pe.bindFramebuffer(R.FRAMEBUFFER,Ee);const ke=_.textures[Te],Ve=ke.format,Ie=ke.type;if(!ft.textureFormatReadable(Ve))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ft.textureTypeReadable(Ie))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ze=R.createBuffer();R.bindBuffer(R.PIXEL_PACK_BUFFER,Ze),R.bufferData(R.PIXEL_PACK_BUFFER,re.byteLength,R.STREAM_READ),_.textures.length>1&&R.readBuffer(R.COLOR_ATTACHMENT0+Te),R.readPixels(N,V,G,I,he.convert(Ve),he.convert(Ie),0);const ot=O!==null?Fe.get(O).__webglFramebuffer:null;Pe.bindFramebuffer(R.FRAMEBUFFER,ot);const Tt=R.fenceSync(R.SYNC_GPU_COMMANDS_COMPLETE,0);return R.flush(),await Qc(R,Tt,4),R.bindBuffer(R.PIXEL_PACK_BUFFER,Ze),R.getBufferSubData(R.PIXEL_PACK_BUFFER,0,re),R.deleteBuffer(Ze),R.deleteSync(Tt),re}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(_,N=null,V=0){const G=Math.pow(2,-V),I=Math.floor(_.image.width*G),re=Math.floor(_.image.height*G),ge=N!==null?N.x:0,Te=N!==null?N.y:0;Xe.setTexture2D(_,0),R.copyTexSubImage2D(R.TEXTURE_2D,V,0,0,ge,Te,I,re),Pe.unbindTexture()};const dr=R.createFramebuffer(),Ei=R.createFramebuffer();this.copyTextureToTexture=function(_,N,V=null,G=null,I=0,re=null){re===null&&(I!==0?(Wi("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),re=I,I=0):re=0);let ge,Te,Ee,ke,Ve,Ie,Ze,ot,Tt;const vt=_.isCompressedTexture?_.mipmaps[re]:_.image;if(V!==null)ge=V.max.x-V.min.x,Te=V.max.y-V.min.y,Ee=V.isBox3?V.max.z-V.min.z:1,ke=V.min.x,Ve=V.min.y,Ie=V.isBox3?V.min.z:0;else{const bt=Math.pow(2,-I);ge=Math.floor(vt.width*bt),Te=Math.floor(vt.height*bt),_.isDataArrayTexture?Ee=vt.depth:_.isData3DTexture?Ee=Math.floor(vt.depth*bt):Ee=1,ke=0,Ve=0,Ie=0}G!==null?(Ze=G.x,ot=G.y,Tt=G.z):(Ze=0,ot=0,Tt=0);const ht=he.convert(N.format),v=he.convert(N.type);let A;N.isData3DTexture?(Xe.setTexture3D(N,0),A=R.TEXTURE_3D):N.isDataArrayTexture||N.isCompressedArrayTexture?(Xe.setTexture2DArray(N,0),A=R.TEXTURE_2D_ARRAY):(Xe.setTexture2D(N,0),A=R.TEXTURE_2D),R.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,N.flipY),R.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),R.pixelStorei(R.UNPACK_ALIGNMENT,N.unpackAlignment);const B=R.getParameter(R.UNPACK_ROW_LENGTH),Q=R.getParameter(R.UNPACK_IMAGE_HEIGHT),de=R.getParameter(R.UNPACK_SKIP_PIXELS),ve=R.getParameter(R.UNPACK_SKIP_ROWS),We=R.getParameter(R.UNPACK_SKIP_IMAGES);R.pixelStorei(R.UNPACK_ROW_LENGTH,vt.width),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,vt.height),R.pixelStorei(R.UNPACK_SKIP_PIXELS,ke),R.pixelStorei(R.UNPACK_SKIP_ROWS,Ve),R.pixelStorei(R.UNPACK_SKIP_IMAGES,Ie);const Ae=_.isDataArrayTexture||_.isData3DTexture,we=N.isDataArrayTexture||N.isData3DTexture;if(_.isDepthTexture){const bt=Fe.get(_),dt=Fe.get(N),Qe=Fe.get(bt.__renderTarget),It=Fe.get(dt.__renderTarget);Pe.bindFramebuffer(R.READ_FRAMEBUFFER,Qe.__webglFramebuffer),Pe.bindFramebuffer(R.DRAW_FRAMEBUFFER,It.__webglFramebuffer);for(let At=0;At<Ee;At++)Ae&&(R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,Fe.get(_).__webglTexture,I,Ie+At),R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,Fe.get(N).__webglTexture,re,Tt+At)),R.blitFramebuffer(ke,Ve,ge,Te,Ze,ot,ge,Te,R.DEPTH_BUFFER_BIT,R.NEAREST);Pe.bindFramebuffer(R.READ_FRAMEBUFFER,null),Pe.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else if(I!==0||_.isRenderTargetTexture||Fe.has(_)){const bt=Fe.get(_),dt=Fe.get(N);Pe.bindFramebuffer(R.READ_FRAMEBUFFER,dr),Pe.bindFramebuffer(R.DRAW_FRAMEBUFFER,Ei);for(let Qe=0;Qe<Ee;Qe++)Ae?R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,bt.__webglTexture,I,Ie+Qe):R.framebufferTexture2D(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,bt.__webglTexture,I),we?R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,dt.__webglTexture,re,Tt+Qe):R.framebufferTexture2D(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,dt.__webglTexture,re),I!==0?R.blitFramebuffer(ke,Ve,ge,Te,Ze,ot,ge,Te,R.COLOR_BUFFER_BIT,R.NEAREST):we?R.copyTexSubImage3D(A,re,Ze,ot,Tt+Qe,ke,Ve,ge,Te):R.copyTexSubImage2D(A,re,Ze,ot,ke,Ve,ge,Te);Pe.bindFramebuffer(R.READ_FRAMEBUFFER,null),Pe.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else we?_.isDataTexture||_.isData3DTexture?R.texSubImage3D(A,re,Ze,ot,Tt,ge,Te,Ee,ht,v,vt.data):N.isCompressedArrayTexture?R.compressedTexSubImage3D(A,re,Ze,ot,Tt,ge,Te,Ee,ht,vt.data):R.texSubImage3D(A,re,Ze,ot,Tt,ge,Te,Ee,ht,v,vt):_.isDataTexture?R.texSubImage2D(R.TEXTURE_2D,re,Ze,ot,ge,Te,ht,v,vt.data):_.isCompressedTexture?R.compressedTexSubImage2D(R.TEXTURE_2D,re,Ze,ot,vt.width,vt.height,ht,vt.data):R.texSubImage2D(R.TEXTURE_2D,re,Ze,ot,ge,Te,ht,v,vt);R.pixelStorei(R.UNPACK_ROW_LENGTH,B),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,Q),R.pixelStorei(R.UNPACK_SKIP_PIXELS,de),R.pixelStorei(R.UNPACK_SKIP_ROWS,ve),R.pixelStorei(R.UNPACK_SKIP_IMAGES,We),re===0&&N.generateMipmaps&&R.generateMipmap(A),Pe.unbindTexture()},this.copyTextureToTexture3D=function(_,N,V=null,G=null,I=0){return Wi('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(_,N,V,G,I)},this.initRenderTarget=function(_){Fe.get(_).__webglFramebuffer===void 0&&Xe.setupRenderTarget(_)},this.initTexture=function(_){_.isCubeTexture?Xe.setTextureCube(_,0):_.isData3DTexture?Xe.setTexture3D(_,0):_.isDataArrayTexture||_.isCompressedArrayTexture?Xe.setTexture2DArray(_,0):Xe.setTexture2D(_,0),Pe.unbindTexture()},this.resetState=function(){D=0,C=0,O=null,Pe.reset(),Ce.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Wn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=ut._getDrawingBufferColorSpace(e),t.unpackColorSpace=ut._getUnpackColorSpace()}}class bm{constructor(e,t=.5,n=1.8){this.object=e,this.min=t,this.max=n,this.hands=new Map}begin(e,t){this.hands.set(e,t.clone()),this.capture()}end(e){this.hands.delete(e),this.capture()}clear(){this.hands.clear(),this.start=null}capture(){const e=[...this.hands.values()];if(!e.length){this.start=null;return}if(this.object.updateWorldMatrix(!0,!1),e.length===1){this.start={offset:e[0].clone().invert().multiply(this.object.matrixWorld)};return}const t=new P().setFromMatrixPosition(e[0]),n=new P().setFromMatrixPosition(e[1]);this.start={position:this.object.position.clone(),quaternion:this.object.quaternion.clone(),scale:this.object.scale.x,midpoint:t.clone().add(n).multiplyScalar(.5),direction:n.clone().sub(t).normalize(),distance:Math.max(.08,t.distanceTo(n))}}update(e){for(const[n,s]of e)this.hands.has(n)&&this.hands.set(n,s.clone());if(!this.start)return;const t=[...this.hands.values()];if(t.length===1){const n=t[0].clone().multiply(this.start.offset);this.object.parent&&(this.object.parent.updateWorldMatrix(!0,!1),n.premultiply(this.object.parent.matrixWorld.clone().invert())),n.decompose(this.object.position,this.object.quaternion,this.object.scale)}else{const n=new P().setFromMatrixPosition(t[0]),s=new P().setFromMatrixPosition(t[1]),r=n.distanceTo(s);if(r<.08)return;const a=n.clone().add(s).multiplyScalar(.5),o=new un().setFromUnitVectors(this.start.direction,s.clone().sub(n).normalize()),l=Za.clamp(this.start.scale*r/this.start.distance,this.min,this.max),c=l/this.start.scale;this.object.position.copy(this.start.position).sub(this.start.midpoint).applyQuaternion(o).multiplyScalar(c).add(a),this.object.quaternion.copy(o).multiply(this.start.quaternion),this.object.scale.setScalar(l)}this.object.updateMatrixWorld(!0)}}function qr(i,e,t){e.updateWorldMatrix(!0,!1);const n=new Ji(e.getWorldPosition(new P),t*e.getWorldScale(new P).x);return i.intersectSphere(n,new P)}class Tm{constructor(){this.reset()}reset(){this.armed=!1,this.stepHeld=!1,this.turnHeld=!1,this.smooth=!1}update(e,t,n=[0,0],s=0,r=0,a=!0){if(!a){this.armed=!1;return}if(Math.max(...n.map(Math.abs),Math.abs(s))<.2&&(this.armed=!0,this.stepHeld=!1,this.turnHeld=!1),!this.armed)return;if(Math.abs(s)<.25&&(this.turnHeld=!1),Math.hypot(...n)<.25&&(this.stepHeld=!1),Math.abs(s)>.7&&!this.turnHeld){const h=new un().setFromAxisAngle(new P(0,1,0),-Math.sign(s)*Math.PI/6),f=t.getWorldPosition(new P);e.position.sub(f).applyQuaternion(h).add(f),e.quaternion.premultiply(h),e.updateMatrixWorld(!0),this.turnHeld=!0}const o=Math.hypot(...n);if(o<.65||!this.smooth&&this.stepHeld)return;const l=t.getWorldDirection(new P);if(l.y=0,l.lengthSq()<.001)return;l.normalize();const c=new P(-l.z,0,l.x),d=this.smooth?.65*Math.min(.05,Math.max(0,r)):.4;e.position.addScaledVector(c,n[0]/o*d).addScaledVector(l,-n[1]/o*d),e.updateMatrixWorld(!0),this.stepHeld=!0}}const ul={type:"change"},eo={type:"start"},ql={type:"end"},Zs=new lr,hl=new ei,Am=Math.cos(70*Za.DEG2RAD),Ot=new P,sn=2*Math.PI,St={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Yr=1e-6;class wm extends zu{constructor(e,t=null){super(e,t),this.state=St.NONE,this.target=new P,this.cursor=new P,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Gi.ROTATE,MIDDLE:Gi.DOLLY,RIGHT:Gi.PAN},this.touches={ONE:Hi.ROTATE,TWO:Hi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new P,this._lastQuaternion=new un,this._lastTargetPosition=new P,this._quat=new un().setFromUnitVectors(e.up,new P(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Oo,this._sphericalDelta=new Oo,this._scale=1,this._panOffset=new P,this._rotateStart=new qe,this._rotateEnd=new qe,this._rotateDelta=new qe,this._panStart=new qe,this._panEnd=new qe,this._panDelta=new qe,this._dollyStart=new qe,this._dollyEnd=new qe,this._dollyDelta=new qe,this._dollyDirection=new P,this._mouse=new qe,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Cm.bind(this),this._onPointerDown=Rm.bind(this),this._onPointerUp=Pm.bind(this),this._onContextMenu=Om.bind(this),this._onMouseWheel=Um.bind(this),this._onKeyDown=Im.bind(this),this._onTouchStart=Nm.bind(this),this._onTouchMove=Fm.bind(this),this._onMouseDown=Dm.bind(this),this._onMouseMove=Lm.bind(this),this._interceptControlDown=Bm.bind(this),this._interceptControlUp=zm.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(ul),this.update(),this.state=St.NONE}update(e=null){const t=this.object.position;Ot.copy(t).sub(this.target),Ot.applyQuaternion(this._quat),this._spherical.setFromVector3(Ot),this.autoRotate&&this.state===St.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=sn:n>Math.PI&&(n-=sn),s<-Math.PI?s+=sn:s>Math.PI&&(s-=sn),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(Ot.setFromSpherical(this._spherical),Ot.applyQuaternion(this._quatInverse),t.copy(this.target).add(Ot),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const o=Ot.length();a=this._clampDistance(o*this._scale);const l=o-a;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){const o=new P(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;const c=new P(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(o),this.object.updateMatrixWorld(),a=Ot.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(Zs.origin.copy(this.object.position),Zs.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Zs.direction))<Am?this.object.lookAt(this.target):(hl.setFromNormalAndCoplanarPoint(this.object.up,this.target),Zs.intersectPlane(hl,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Yr||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Yr||this._lastTargetPosition.distanceToSquared(this.target)>Yr?(this.dispatchEvent(ul),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?sn/60*this.autoRotateSpeed*e:sn/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){Ot.setFromMatrixColumn(t,0),Ot.multiplyScalar(-e),this._panOffset.add(Ot)}_panUp(e,t){this.screenSpacePanning===!0?Ot.setFromMatrixColumn(t,1):(Ot.setFromMatrixColumn(t,0),Ot.crossVectors(this.object.up,Ot)),Ot.multiplyScalar(e),this._panOffset.add(Ot)}_pan(e,t){const n=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;Ot.copy(s).sub(this.target);let r=Ot.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/n.clientHeight,this.object.matrix),this._panUp(2*t*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),s=e-n.left,r=t-n.top,a=n.width,o=n.height;this._mouse.x=s/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(sn*this._rotateDelta.x/t.clientHeight),this._rotateUp(sn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(sn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-sn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(sn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-sn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(n,s)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),s=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(sn*this._rotateDelta.x/t.clientHeight),this._rotateUp(sn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new qe,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}function Rm(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function Cm(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function Pm(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(ql),this.state=St.NONE;break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function Dm(i){let e;switch(i.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Gi.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=St.DOLLY;break;case Gi.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=St.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=St.ROTATE}break;case Gi.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=St.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=St.PAN}break;default:this.state=St.NONE}this.state!==St.NONE&&this.dispatchEvent(eo)}function Lm(i){switch(this.state){case St.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case St.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case St.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function Um(i){this.enabled===!1||this.enableZoom===!1||this.state!==St.NONE||(i.preventDefault(),this.dispatchEvent(eo),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(ql))}function Im(i){this.enabled!==!1&&this._handleKeyDown(i)}function Nm(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case Hi.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=St.TOUCH_ROTATE;break;case Hi.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=St.TOUCH_PAN;break;default:this.state=St.NONE}break;case 2:switch(this.touches.TWO){case Hi.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=St.TOUCH_DOLLY_PAN;break;case Hi.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=St.TOUCH_DOLLY_ROTATE;break;default:this.state=St.NONE}break;default:this.state=St.NONE}this.state!==St.NONE&&this.dispatchEvent(eo)}function Fm(i){switch(this._trackPointer(i),this.state){case St.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case St.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case St.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case St.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=St.NONE}}function Om(i){this.enabled!==!1&&i.preventDefault()}function Bm(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function zm(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const rn={0:[0,0,1],1:[0,0,-1],"+":[1,0,0],"−":[-1,0,0],"+i":[0,1,0],"−i":[0,-1,0]},dl=Math.SQRT1_2,mn={H:{axis:[dl,0,dl],angle:Math.PI},X:{axis:[1,0,0],angle:Math.PI},Y:{axis:[0,1,0],angle:Math.PI},Z:{axis:[0,0,1],angle:Math.PI},S:{axis:[0,0,1],angle:Math.PI/2},T:{axis:[0,0,1],angle:Math.PI/4}};function ar(i,e,t){const n=Math.cos(t),s=Math.sin(t),r=i.reduce((o,l,c)=>o+l*e[c],0),a=[e[1]*i[2]-e[2]*i[1],e[2]*i[0]-e[0]*i[2],e[0]*i[1]-e[1]*i[0]];return i.map((o,l)=>o*n+a[l]*s+e[l]*r*(1-n))}function Zr(i){return{theta:Math.acos(Math.max(-1,Math.min(1,i[2]))),phi:Math.hypot(i[0],i[1])<1e-10?0:(Math.atan2(i[1],i[0])%(2*Math.PI)+2*Math.PI)%(2*Math.PI)}}function jr(i,e){let t=[i[1]*e[2]-i[2]*e[1],i[2]*e[0]-i[0]*e[2],i[0]*e[1]-i[1]*e[0]],n=Math.hypot(...t);if(n<1e-8){const s=Math.abs(i[0])<.9?[1,0,0]:[0,1,0];t=[i[1]*s[2]-i[2]*s[1],i[2]*s[0]-i[0]*s[2],i[0]*s[1]-i[1]*s[0]],n=Math.hypot(...t)}return{axis:t.map(s=>s/n),angle:Math.acos(Math.max(-1,Math.min(1,i.reduce((s,r,a)=>s+r*e[a],0))))}}function Hm(i,e,t){return Math.max(0,Math.min(1,(i-e)/t))}const za=8;class Vm{constructor(){this.queue=[],this.base=[0,0,1],this.restart()}restart(){return this.cursor=0,this.snapshots=[],this.status="idle",this.single=!1,[...this.base]}capture(e){return this.base=[...e],this.restart()}editable(){return this.status==="idle"||this.status==="complete"}append(e,t){return!mn[e]||!this.editable()||this.queue.length>=za?!1:(this.queue.length||(this.base=[...t]),this.queue.push(e),this.restart(),!0)}remove(e){return!this.editable()||e<0||e>=this.queue.length?!1:(this.queue.splice(e,1),this.restart(),!0)}clear(){return this.queue=[],this.restart()}begin(e=!1){return this.queue.length?(this.status==="complete"&&this.restart(),this.single=e,this.status="running",this.queue[this.cursor]):null}pause(){this.status==="running"&&(this.status="paused")}finish(e){this.snapshots.push([...e]),this.cursor++,this.status=this.cursor===this.queue.length?"complete":this.single?"paused":"running"}expected(){return this.queue.reduce((e,t)=>ar(e,mn[t].axis,mn[t].angle),[...this.base])}}function $r(i,e,t,n=1,s=70){const r=Math.max(0,Math.min(1,n)),a=Math.max(2,Math.ceil(r*s)+1);return Array.from({length:a},(o,l)=>ar(i,e,t*r*l/(a-1)))}const zi={X:[1,0,0],Y:[0,1,0],Z:[0,0,1]};function En(i,e="Z"){return Math.max(0,Math.min(1,(1+i.reduce((t,n,s)=>t+n*zi[e][s],0))/2))}function Gm(i,e="Z",t=Math.random){return t()<En(i,e)?0:1}function jt(i){if(i<=1e-12)return"0%";if(i>=1-1e-12)return"100%";if(i<5e-5)return"<0.01%";if(i>.99995)return">99.99%";const e=Math.round(i*1e4)/100;return(Math.abs(e-i*100)>1e-9?"≈":"")+e+"%"}const km={start:{title:"One arrow. Two possible results.",context:"This arrow describes a qubit’s preparation. Z measures along the vertical axis, with results labeled 0 or 1. Pointing up predicts every result will be 0. The arrow maps possibilities; it is not a moving particle.",next:"Measure the upright preparation",operation:"sample",after:"up-observed"},"up-observed":{title:"Certain means every copy agrees.",context:"Every dot measured a newly prepared copy: all gave 0. The blue arrow stays because it is the preparation we repeat for each copy.",next:"Now tilt the arrow",operation:"tilt",after:"tilt"},tilt:{title:"Change the preparation.",context:"Hold the trigger on the sphere and move the arrow away from the top. On desktop, drag the sphere. Watch the tilt angle and the chance bar change together.",next:"Predict from this tilted arrow",operation:"advance",after:"chance"},chance:{title:"Chance before counting.",context:"The bar predicts the chance of 0 for each copy. Before sampling, predict roughly how many of 100 copies will give 0. A chance is not a guarantee for a whole batch.",next:"Sample 100 copies at this tilt",operation:"sample",after:"sampled"},sampled:{title:"Prediction and observation are different.",context:"The blue bar is the predicted chance. The dots and brown bar are actual counts. Repeating with fresh copies gives different counts; more copies make the frequency more stable.",next:"Turn sideways at the same tilt",operation:"advance",after:"turn-phase"},"turn-phase":{title:"Direction can change without height changing.",context:"A quarter-turn around Z moves the arrow sideways while keeping its tilt. Predict: will the Z chance change? Watch the angle and blue bar during the turn.",next:"Turn a quarter-turn around Z",operation:"gate:S",after:"phase-shown"},"phase-shown":{title:"Same height, same Z chance.",context:"The direction changed, but the chance of 0 did not. Z reads height, so it cannot see this sideways change. That extra direction is called relative phase.",next:"Next: how two rotations combine",operation:"prepare",after:"undo-first"},"undo-first":{title:"Can a rotation undo itself?",context:"Start again at the top. H is a half-turn around the slanted axis. Apply it once and watch the arrow move to equal chances of 0 and 1.",next:"Apply the first H turn",operation:"gate:H",after:"undo-second"},"undo-second":{title:"Halfway: two outcomes are equally likely.",context:"The first H made a 50/50 preparation. Apply the same H again. Predict whether the arrow returns to the top before watching the trail.",next:"Apply H again",operation:"gate:H",after:"undo-result"},"undo-result":{title:"Two H turns return to certain 0.",context:"The full path returns to the top: H then H gives 0 with certainty. Now try a Z turn between them. This tests whether a sideways change can affect a later rotation.",next:"Start again with the first H",operation:"prepare:H",after:"phase-middle"},"phase-middle":{title:"Change direction before the return turn.",context:"We have the same 50/50 starting point as before. This Z turn changes the sideways direction while keeping the chance 50/50. No copy is being measured here.",next:"Apply the middle Z turn",operation:"gate:Z",after:"phase-last"},"phase-last":{title:"The bar stayed 50/50. The arrow did not.",context:"Z moved the arrow to the opposite side. The grey arrow marks its earlier direction. Apply H now: the same return turn acts on a different preparation.",next:"Apply the final H turn",operation:"gate:H",after:"phase-result"},"phase-result":{title:"A sideways change became a different outcome.",context:"H then H returned to 0. H then Z then H points down, so every Z measurement now gives 1. The middle Z changed how the two H turns combined: this is interference.",next:"Measure this certain-1 preparation",operation:"sample",after:"phase-measured"},"phase-measured":{title:"The copies confirm the new preparation.",context:"Every fresh copy gave 1. The difference came from rotations, not a measurement between them. Next, test whether changing the order of rotations also changes direction.",next:"Next: does rotation order matter?",operation:"prepare",after:"order-start"},"order-start":{title:"Do the same turns in a different order.",context:"From the top, first apply H, then Z. Watch the two path segments. Z keeps the final chance 50/50, but changes which side the arrow points toward.",next:"First H, then Z",operation:"program:HZ",after:"order-reverse"},"order-reverse":{title:"Keep that direction as a comparison.",context:"The grey arrow saves the H-then-Z result. Start at the top again, but reverse the order. Predict whether Z-then-H reaches the same direction.",next:"Reverse it: first Z, then H",operation:"program:ZH",after:"order-check"},"order-check":{title:"Same Z chance does not mean the same state.",context:"Both results have 50/50 Z chances, yet point in opposite X directions. A measurement along X can distinguish them. The purple arrow shows this new measurement axis.",next:"Measure Z-then-H copies along X",operation:"sample:X",after:"order-plus"},"order-plus":{title:"X sees what Z could not see.",context:"The Z-then-H copies all gave + along X. Now measure the saved H-then-Z preparation along X. It points the other way, so predict the opposite outcome.",next:"Measure H-then-Z copies along X",operation:"sample:minus",after:"order-result"},"order-result":{title:"Order changed the preparation.",context:"H-then-Z gave − along X; Z-then-H gave +. Their Z chances were identical. A qubit needs both tilt and sideways direction to describe all measurement chances.",next:"Restart the guided path",operation:"restart",after:"start"}};class Wm{constructor(){this.reset()}reset(){this.stage="start",this.active=!0,this.totals=[0,0],this.prepared=null,this.expected=null,this.last=null,this.waiting=null}step(){return km[this.stage]}begin(e){const t=this.step();return this.waiting||this.stage==="tilt"&&(Math.acos(Math.max(-1,Math.min(1,e[2])))<Math.PI/18||Math.abs(e[2])>.985)?null:(this.waiting=t.after,t.operation)}finish(){return this.waiting?(this.stage=this.waiting,this.waiting=null,!0):!1}record(e,t,n){this.prepared&&this.prepared.basis===t&&this.prepared.vector.every((r,a)=>Math.abs(r-e[a])<1e-7)||(this.totals=[0,0]),this.prepared={vector:[...e],basis:t},this.expected=En(e,t),this.totals=this.totals.map((r,a)=>r+n[a]),this.last=[...n]}observation(){if(!this.last)return"No copies measured yet.";const e=this.totals[0]+this.totals[1],t=this.prepared.basis==="Z"?"0":"+";return`Chance: ${jt(this.expected)} ${t}. Observed: ${this.totals[0]}/${e} = ${jt(this.totals[0]/e)} ${t}.`}}const Kr=Math.PI*2,fl=1e-10;function Yl(i,e){if(!Number.isFinite(i)||!Number.isFinite(e))throw new TypeError("Bloch angles must be finite numbers.");return{theta:Math.min(Math.PI,Math.max(0,i)),phi:(e%Kr+Kr)%Kr}}function pl(i,e){const t=Yl(i,e),n=Math.sin(t.theta);return{x:n*Math.cos(t.phi),y:n*Math.sin(t.phi),z:Math.cos(t.theta)}}function ml(i,e){const t=Yl(i,e);if(t.theta<fl)return"|0⟩";if(Math.PI-t.theta<fl)return"|1⟩";const n=Math.cos(t.theta/2).toFixed(3),s=Math.sin(t.theta/2).toFixed(3);return`≈ ${n}|0⟩ + e^(i${t.phi.toFixed(3)})${s}|1⟩`}const le=i=>document.querySelector(i),gl=matchMedia("(prefers-reduced-motion: reduce)").matches;let $e=[0,0,1],Le=null,pt=null,kt=[0,0],pn=!1,Wt="Ready at |0⟩";const pe=new Vm,ce=new Wm;let ct="Z",xt=null,Sn=!0,Xt=[];const $t=i=>new P(i[0],i[2],-i[1]);let mt;try{mt=new ym({canvas:le("#scene"),antialias:!0})}catch{le("#error").hidden=!1,le("#error").textContent="3D could not start. Enable hardware acceleration or try another WebGL browser.",le("#vr").textContent="3D unavailable",document.querySelectorAll("aside button,aside input,#recenter").forEach(e=>e.disabled=!0)}if(mt){let h=function(v,A=.55,B=.13,Q="#202428",de=0){const ve=document.createElement("canvas");ve.width=1024,ve.height=Math.round(1024*B/A);const We=ve.getContext("2d"),Ae=new Pu(ve);Ae.colorSpace=an;const we=new Qt;for(const Qe of[0,Math.PI]){const It=new gt(new vi(1,1),new Ft({map:Ae,transparent:!0,depthWrite:!1}));It.rotation.y=Qe,we.add(It)}we.userData.label=!0,we.scale.set(A,B,1),we.renderOrder=5;let bt;const dt=Qe=>{if(Qe===bt)return;bt=Qe,We.clearRect(0,0,ve.width,ve.height),We.fillStyle=Q;const It=[];if(de){let At="";for(const qn of Qe.split(" "))(At+" "+qn).length>de&&At?(It.push(At),At=qn):At+=(At?" ":"")+qn;At&&It.push(At)}else It.push(Qe);We.font=`500 ${Math.floor(ve.height*(de?.7/Math.max(2,It.length):.43))}px Arial`,We.textAlign="center",We.textBaseline="middle",It.forEach((At,qn)=>We.fillText(At,512,ve.height*(qn+.5)/It.length,990)),Ae.needsUpdate=!0};return dt(v),we.userData.set=dt,we},M=function(){for(const v of[...O.children])v.geometry.dispose(),O.remove(v);C.visible=!1,C.geometry.dispose(),C.geometry=new Ct},L=function(v){const A=$r(v.from,v.axis,v.angle),B=new Vn(new Ct().setFromPoints(A.map(Q=>$t(Q).multiplyScalar(s*1.005))),E);B.userData={gate:v.gate,points:A},O.add(B),C.visible=!1},$=function(v,A,B,Q,de=.24){const ve=new gt(new qt(de,.12,.025),new Ft({color:14805229}));ve.position.set(B,Q,.025),ve.userData.action=A,H.add(ve);const We=h(v,de-.01,.105);We.position.set(B,Q,.045),H.add(We),X.push(ve)},ee=function(v,A,B,Q,de=.34){const ve=new gt(new qt(de,.12,.025),new Ft({color:14805229}));ve.position.set(B,Q,.025),ve.userData.action=A,W.add(ve);const We=h(v,de-.01,.105);return We.position.set(B,Q,.045),W.add(We),ve.userData.caption=We,X.push(ve),ve},fe=function(v,A,B,Q,de=.24){const ve=new gt(new qt(de,.12,.025),new Ft({color:14805229}));ve.position.set(B,Q,.025),ve.userData.action=A,Ge.add(ve);const We=h(v,de-.01,.105);return We.position.set(B,Q,.045),Ge.add(We),ve.userData.caption=We,X.push(ve),ve},g=function(v){$e=[...v],m.setDirection($t($e).normalize());const A=jr([0,0,1],$e);u.geometry.dispose(),u.geometry=new Ct().setFromPoints($r([0,0,1],A.axis,A.angle).map(de=>$t(de).multiplyScalar(s*.84))),w.userData.set("Tilt "+Math.round(A.angle*180/Math.PI)+"°"),w.position.copy($t(ar([0,0,1],A.axis,A.angle/2)).multiplyScalar(s*.73)).add(new P(.12,.02,0)),u.visible=ce.active,w.visible=ce.active,x.position.copy($t($e).multiplyScalar(s));const B=En($e,ct),Q=Math.max(.001,2*s*B);y.scale.y=Q,y.position.y=-s+Q/2,F.userData.set("Chance "+jt(B)+" "+(ct==="Z"?"0":"+")),D.geometry.dispose(),D.geometry=new Ct().setFromPoints([x.position.clone(),new P(-.76,(2*B-1)*s,.02)]),D.computeLineDistances()},z=function(){st.visible=!1,pt=null,kt=[0,0],Pe.forEach(v=>v.visible=!1),b.visible=!1},Z=function(v,A,B){z(),Le={from:[...$e],axis:v,angle:A,start:performance.now(),duration:gl?0:1100},Wt=B,k.geometry.dispose(),k.geometry=new Ct().setFromPoints([$t(v).multiplyScalar(-.85),$t(v).multiplyScalar(.85)]),k.computeLineDistances(),k.visible=!0,ae()},J=function(){I(),Le=null,ce.reset(),le("#exploration").open=!1,ct="Z",xt=null,p.visible=!1,pe.clear(),pe.capture(rn[0]),Xt=[],Sn=!0,z(),pn=!1,le("#touch").setAttribute("aria-pressed","false"),le("#touch").textContent="Touch sphere: off",he(),Ce.forEach(v=>v.userData.preparing=!1),g(rn[0]),k.visible=!1,M(),Wt="Ready at |0⟩",ae()},Y=function(v=!1,A=!1){if(!pe.queue.length||pt)return;if((A||pe.status==="complete")&&(Le=null,M(),g(pe.restart()),Xt=[]),Le?.sequence){Le.pausedAt!==void 0&&(Le.start+=performance.now()-Le.pausedAt,delete Le.pausedAt,pe.begin(v),Wt=`${pe.cursor+1}/${pe.queue.length} · ${Le.gate} gate`,ae());return}const B=pe.begin(v);B&&(Z(mn[B].axis,mn[B].angle,`${pe.cursor+1}/${pe.queue.length} · ${B} gate`),Le.sequence=!0,Le.gate=B,ae())},Re=function(v={vector:[...$e],basis:ct,p:En($e,ct),counts:[...kt],program:[...Xt],input:[...pe.base]}){xt=v,p.setDirection($t(v.vector)),p.visible=!0},se=function(v){if(v.startsWith("palette:")){dn=v.slice(8),_();return}if(v==="palette-toggle"){N();return}if(v==="lesson-next"&&!ce.active){J();return}if(v==="lesson-restart"){J(),ae();return}if(v==="lesson-explore"){Le=null,z(),ce.active=!1,ce.waiting=null,pn=!1,le("#exploration").open=!0,ae();return}if(v==="lesson-helper"&&ce.active&&!Le&&!pt){if(ce.stage==="tilt"){const A=pl(Math.PI/3,0),B=jr($e,[A.x,A.y,A.z]);Z(B.axis,B.angle,"Tilt toward 60°"),Le.preparation=!0}else ce.stage==="sampled"&&se("measure");return}if(v==="lesson-next"&&ce.active&&!Le&&!pt){const A=ce.begin($e);if(!A)return;if(A==="restart"){J();return}if(A==="advance"){pn=!1,ce.finish(),ae();return}if(A==="tilt"){Re(),ce.finish(),pn=!0,ae();return}if(A==="prepare"){M(),z(),Xt=[],pe.clear(),pe.capture(rn[0]),ct="Z",g(rn[0]),ce.finish(),ae();return}if(A.startsWith("sample")){A==="sample:X"&&(ct="X",g($e)),A==="sample:minus"&&(ct="X",g(rn["−"]),pe.capture($e)),se("measure");return}if(A.startsWith("program:")){A==="program:ZH"&&Re(),M(),z(),Xt=[],pe.clear(),pe.capture(rn[0]),ct="Z",g(rn[0]),A.slice(8).split("").forEach(Q=>pe.append(Q,$e)),Y(!1,!0),Le.lesson=!0;return}let B=A.slice(5);A==="prepare:H"&&(M(),z(),Xt=[],pe.clear(),ct="Z",g(rn[0]),pe.capture($e),B="H"),A==="gate:Z"&&Re(),Z(mn[B].axis,mn[B].angle,"Watch the "+B+" rotation"),Le.gate=B,Le.lesson=!0;return}if(v==="sequence-run"){Le?.sequence&&Le.pausedAt===void 0?(Le.pausedAt=performance.now(),pe.pause(),Wt="Sequence paused",ae()):Y(!1);return}if(v==="sequence-step"){Y(!0);return}if(v==="sequence-replay"){Y(!1,!0);return}if(v==="sequence-clear"){pe.queue.length&&(Le=null,z(),M(),g(pe.clear()),Xt=[],k.visible=!1,C.visible=!1,Wt="Sequence cleared",ae());return}if(v==="queue-mode"){if(Le||pt||pe.status==="paused")return;Sn=!Sn,ae();return}if(v.startsWith("remove:")){if(Le||pt)return;pe.remove(Number(v.slice(7)))&&(M(),g(pe.base),Xt=[],z(),Wt="Sequence edited",ae());return}if(!((Le||pt||pe.status==="paused")&&v!=="reset"&&v!=="guide"&&!v.startsWith("view:")&&v!=="recenter")){if(v.startsWith("view:")){Ee(v.slice(5));return}if(v==="recenter"){Ze();return}if(v==="reset"){J();return}if(v==="guide"){J(),Sn=!1,ae();return}if(v.startsWith("basis:")){if(!zi[v.slice(6)])return;ct=v.slice(6),z(),g($e),ae();return}if(v==="pin-baseline"){Re(),ae();return}if(v==="measure"){Le=null,z(),k.visible=!1,st.visible=!0,pt={prepared:[...$e],outcomes:Array.from({length:100},()=>Gm($e,ct)),basis:ct,input:[...pe.base],program:[...Xt],start:performance.now(),shown:0},Wt="Measuring fresh preparations in "+ct,ae();return}if(v.startsWith("preset:")){M();const A=v.slice(7),B=jr($e,rn[A]);Z(B.axis,B.angle,"Prepare |"+A+"⟩"),Le.preparation=!0,Xt=[],ae();return}if(v.startsWith("gate:")){const A=v.slice(5);if(Sn){pe.append(A,$e)&&(M(),g(pe.base),z(),Xt=[],Wt="Queued "+A),ae();return}pe.capture($e),Z(mn[A].axis,mn[A].angle,A+" gate · rotating"),Le.gate=A,ae()}}},ae=function(){ce.active&&["order-check","order-plus","order-result"].includes(ce.stage)&&ct!=="X"&&(ct="X",g($e),xt&&(xt.basis="X",xt.p=En(xt.vector,"X"),xt.counts=[0,0]));const v=!!(Le||pt),A=!!Le?.sequence&&Le.pausedAt===void 0,B=pe.status==="paused",Q=pe.queue.length>0;le("#queue-mode").textContent="Queue gates: "+(Sn?"on":"off"),le("#queue-mode").setAttribute("aria-pressed",Sn),le("#queue-mode").disabled=v||B,le("#sequence-run").textContent=A?"Pause":B?"Resume":"Run",le("#sequence-run").disabled=!Q||!!pt||!!(Le&&!Le.sequence),le("#sequence-step").disabled=!Q||A||!!pt||!!(Le&&!Le.sequence),le("#sequence-replay").disabled=!Q||!!pt||!!(Le&&!Le.sequence),le("#sequence-clear").disabled=!Q;const de=Object.keys(rn).find(it=>rn[it].every((Rt,Es)=>Math.abs(Rt-pe.base[Es])<1e-7)),ve=de===void 0?"saved state":"|"+de+"⟩",We=Q?pe.status==="complete"?"Complete · measure the result":`From ${ve} · ${pe.cursor}/${pe.queue.length} complete · ${pe.status}`:"Add gates, then run. Tap a gate to remove it.";le("#sequence-status").textContent=We,le("#gate-history").textContent="Applied: "+(Xt.length?Xt.join(" → "):"none");const Ae=le("#sequence-list"),we=JSON.stringify([pe.queue,pe.cursor,pe.status,v,!!Le?.sequence]);Ae.dataset.signature!==we&&(Ae.dataset.signature=we,Ae.replaceChildren(),pe.queue.forEach((it,Rt)=>{const Es=document.createElement("li"),Yn=document.createElement("button");Yn.textContent=`${Rt+1} · ${it}`,Yn.setAttribute("aria-label",`Remove gate ${Rt+1} ${it}`),Yn.disabled=v||B,Yn.className=Rt<pe.cursor?"completed":Rt===pe.cursor&&Le?.sequence?"current":"",Yn.className==="current"&&Yn.setAttribute("aria-current","step"),Yn.onclick=()=>se("remove:"+Rt),Es.append(Yn),Ae.append(Es)})),Ue.forEach((it,Rt)=>{it.visible=Rt<pe.queue.length,it.userData.caption.visible=it.visible,it.userData.caption.userData.set(`${Rt+1} · ${pe.queue[Rt]||""}`),it.userData.completed=Rt<pe.cursor,it.userData.current=Rt===pe.cursor&&!!Le?.sequence}),Ne.userData.caption.userData.set(Sn?"Queue on":"Apply now"),nt.userData.set(Q?`${ve} → ${pe.cursor}/${pe.queue.length} · ${pe.status}`:"Add gates, then run"),X.find(it=>it.userData.action==="sequence-run").userData.caption.userData.set(A?"Pause":B?"Resume":"Run"),X.forEach(it=>{const Rt=it.userData.action;Rt==="sequence-run"?it.userData.disabled=le("#sequence-run").disabled:Rt==="sequence-step"?it.userData.disabled=le("#sequence-step").disabled:Rt==="sequence-replay"?it.userData.disabled=le("#sequence-replay").disabled:Rt==="sequence-clear"?it.userData.disabled=!Q:Rt==="queue-mode"||Rt.startsWith("remove:")?it.userData.disabled=v||B:it.userData.disabled=(v||B)&&!Rt.startsWith("view:")&&!["reset","guide","recenter"].includes(Rt)}),le("#theta").disabled=v||B,le("#phi").disabled=v||B,le("#touch").disabled=v||B,le("#counts").setAttribute("aria-live",v?"off":"polite"),le("#scene").setAttribute("aria-label",`Pure qubit Bloch sphere. ${ct} positive outcome ${jt(En($e,ct))}. ${Wt}.`),document.querySelectorAll("#gates button,#presets button,#measure").forEach(it=>it.disabled=v||B||it.parentElement.id==="gates"&&Sn&&pe.queue.length>=za);const dt=Zr($e),Qe=En($e,ct);le("#p0").textContent=jt(Qe),le("#p1").textContent=jt(1-Qe),le("#theta").value=dt.theta*180/Math.PI,le("#phi").value=dt.phi*180/Math.PI,le("#ket").textContent=ml(dt.theta,dt.phi),le("#action").textContent=Wt;const It=ct==="Z"?"0":"+",At=ct==="Z"?"1":"−";tt.userData.set(`Latest 100 copies: blue ${It} / brown ${At}`),le("#positive-label").textContent=ct+": "+It,le("#negative-label").textContent=ct+": "+At,le("#counts").textContent=kt[0]+kt[1]?`${ct}: ${kt[0]} ${It} · ${kt[1]} ${At} / ${kt[0]+kt[1]} fresh copies`:"No trials yet";const qn=En($e,"Z");le("#amplitude-link").textContent=`Z: |α|² = ${jt(qn)} · |β|² = ${jt(1-qn)} (up to global phase)`,ze.userData.set(xt?`${xt.basis} baseline: ${jt(xt.p)} +; ${xt.counts[0]+xt.counts[1]?xt.counts[0]+"/"+(xt.counts[0]+xt.counts[1])+" copies":"not sampled"}`:"Keep a baseline to compare a changed state"),le("#baseline-readout").textContent=xt?`Baseline ${xt.basis}: ${jt(xt.p)} positive; ${xt.counts[0]+xt.counts[1]?xt.counts[0]+"/"+(xt.counts[0]+xt.counts[1])+" observed":"not sampled"}. Input ${ml(Zr(xt.input).theta,Zr(xt.input).phi)}; ${xt.program.join(" → ")||"no gates"}`:"Keep a baseline to compare a changed run.",S.setDirection($t(zi[ct])),document.querySelectorAll("#bases button").forEach(it=>{it.setAttribute("aria-pressed",it.dataset.basis===ct),it.disabled=v||B}),le("#pin-baseline").disabled=v||B;const yi=ce.step(),to=Math.acos(Math.max(-1,Math.min(1,$e[2])))*180/Math.PI,Zl=ce.stage.startsWith("order")?"3 · Why order matters":["undo-first","undo-second","undo-result","phase-middle","phase-last","phase-result","phase-measured"].includes(ce.stage)?"2 · How rotations combine":"1 · From an arrow to measured copies";le("#lesson-progress").textContent=Zl,le("#lesson-title").textContent=yi.title,le("#lesson-context").textContent=yi.context,le("#lesson-card").hidden=!ce.active,le("#lesson-next").textContent=yi.next,le("#lesson-next").disabled=v||B||ce.stage==="tilt"&&(to<10||Math.abs($e[2])>.985);const no=ce.active?`Tilt ${Math.round(to)}° → chance ${jt(En($e,"Z"))} of 0. `+(["chance","sampled"].includes(ce.stage)?`Expect about ${Math.round(En($e,"Z")*100)} zeros per 100 copies.`:""):"";le("#lesson-live").textContent=no,le("#lesson-helper").hidden=!["tilt","sampled"].includes(ce.stage),le("#lesson-helper").disabled=v||B,le("#lesson-helper").textContent=ce.stage==="sampled"?"Sample 100 more copies":"Tilt to 60° for me";const io=ce.prepared?.basis===ct&&ce.prepared.vector.every((it,Rt)=>Math.abs(it-$e[Rt])<1e-7)?ce.observation():"This preparation has not been measured yet.";le("#lesson-observation").textContent=io,le(".hint").textContent=ce.active?ce.stage==="tilt"?"Drag the sphere to change the preparation · Hold the trigger in VR":"Follow the next action · Drag to look around":"Drag to look around · Select Touch sphere to prepare a state",le("#touch").textContent="Touch sphere: "+(pn?"on":"off"),le("#touch").setAttribute("aria-pressed",pn),q.userData.set(yi.title),me.userData.set(yi.context),ye.userData.caption.userData.set(yi.next),ye.userData.disabled=le("#lesson-next").disabled,De.visible=!le("#lesson-helper").hidden,De.userData.caption.visible=De.visible,De.userData.caption.userData.set(le("#lesson-helper").textContent),De.userData.disabled=v||B,je.userData.set(["tilt","chance","turn-phase","phase-shown"].includes(ce.stage)?no:io),X.forEach(it=>{it.userData.action.startsWith("basis:")&&(it.userData.current=it.userData.action.slice(6)===ct,it.userData.disabled=v||B)}),(W.visible||mt.xr.isPresenting)&&(W.visible=ce.active,H.visible=!ce.active,ts(),Ge.visible=!ce.active||pe.queue.length>0),u.visible=ce.active,w.visible=ce.active,Et.userData.set(`${ct} basis: ${It} ${jt(Qe)} · ${At} ${jt(1-Qe)}`),yt.userData.set(kt[0]+kt[1]?`Fresh: ${kt[0]} ${It} · ${kt[1]} ${At}; blue stays prepared`:"Fresh copies; blue keeps the preparation"),Ye.userData.set(ce.active?"Blue arrow: preparation · brown bar: observed copies":"Prepare → rotate → measure fresh copies"),_(),R.userData.set(ce.active?`Predicted chance: ${jt(Qe)} ${It} · ${jt(1-Qe)} ${At}`:Wt)},Me=function(){if(ce.active&&ce.stage!=="tilt")return!1;const v=qr(xe.ray,l,s);if(!v)return!1;Le=null,z(),k.visible=!1,M();const A=l.worldToLocal(v.clone()).normalize();return g([A.x,-A.z,A.y]),pe.capture($e),Xt=[],Wt="Prepared on sphere",ae(),!0},Be=function(v){const A=le("#scene").getBoundingClientRect();te.set((v.clientX-A.left)/A.width*2-1,-(v.clientY-A.top)/A.height*2+1),xe.setFromCamera(te,e)},he=function(){Oe=!1,a.enabled=!mt.xr.isPresenting},ts=function(){at!==ce.active&&(at=ce.active,Ge.position.copy(new P(ce.active?1.45:-1.45,ce.active?1.65:1.85,-2).applyQuaternion(hn).add(nn)))},Vt=function(v,A,B,Q,de,ve=.3){const We=new gt(new qt(ve,.115,.025),new Ft({color:14805229}));We.position.set(Q,de,.026),We.userData.action=B;const Ae=h(A,ve-.015,.09);return Ae.position.set(Q,de,.046),We.userData.caption=Ae,v.add(We,Ae),X.push(We),wn.push(We),We},Ei=function(v){for(let A=v;A;A=A.parent)if(!A.visible)return!1;return!0},_=function(){if(Un){for(const v of[H,W,Ge,oe,Ye,R])v.visible=!1;In.visible=!0,st.visible=kt[0]+kt[1]>0,In.userData.set(ce.active?dr[ce.stage]+"  A: next · X: controls":"Grip: turn / move. Trigger: arrow. A: run / pause. X: controls.");for(const[v,A]of An)A.visible=v===dn;is.userData.caption.userData.set(ce.active?ce.step().next:"Start guided path"),is.userData.disabled=ce.active&&le("#lesson-next").disabled,ai.visible=ce.active&&["tilt","sampled"].includes(ce.stage),ai.userData.caption.visible=ai.visible,ai.userData.caption.userData.set(ce.stage==="tilt"?"Try a 60° tilt":"Sample more"),wn.find(v=>v.userData.action==="sequence-run").userData.caption.userData.set(pe.status==="running"?"Pause":pe.status==="paused"?"Resume":"Run"),wn.find(v=>v.userData.action==="queue-mode").userData.caption.userData.set(Sn?"Queue on":"Queue off"),wn.find(v=>v.userData.action==="view:movement").userData.caption.userData.set(j.smooth?"Move: smooth":"Move: step"),hr.forEach((v,A)=>{v.visible=A<pe.queue.length,v.userData.caption.visible=v.visible,v.userData.caption.userData.set(pe.queue[A]?"× "+pe.queue[A]:"")})}},N=function(){if(I(),Ut.visible){Ut.visible=!1;return}const v=mt.xr.isPresenting?mt.xr.getCamera():e,A=v.getWorldPosition(new P),B=v.getWorldDirection(new P),Q=new un().setFromAxisAngle(new P(0,1,0),Math.atan2(-B.x,-B.z));Ut.position.copy(new P(-.8,-.08,-1.35).applyQuaternion(Q).add(A)),Ut.quaternion.copy(Q),Ut.scale.setScalar(1),Ut.visible=!0,_()},V=function(){return He.size>0},G=function(v){const A=v.userData.source&&v.userData.grip.visible?v.userData.grip:v;return A.updateWorldMatrix(!0,!1),A.matrixWorld.clone()},I=function(){for(const v of Se.values())v.clear();He.clear(),j.armed=!1;for(const v of Ce)v.userData.preparing=!1,v.userData.stateGrab=null,v.userData.buttonsArmed=!1},re=function(v,A){Ve(v);const B=[W,Ge,H,oe,Ut].filter(we=>we.visible),Q=xe.intersectObjects(B,!0)[0],de=qr(xe.ray,l,s),ve=xe.ray.origin.distanceTo(l.getWorldPosition(new P))<s*l.scale.x+.2;let Ae=[...He.values()].includes(l)?l:Q&&(!de||Q.distance<xe.ray.origin.distanceTo(de))?B.find(we=>{let bt=Q.object;for(;bt;){if(bt===we)return!0;bt=bt.parent}return!1}):de||ve?l:null;if(Ae){for(const we of Ce)we.userData.preparing=!1,we.userData.stateGrab=null;Se.has(Ae)||Se.set(Ae,new bm(Ae)),He.set(A,Ae),Se.get(Ae).begin(A,G(v)),c.material.opacity=.25}},ge=function(v){const A=He.get(v);A&&Se.get(A).end(v),He.delete(v),c.material.opacity=.16},Te=function(v){if(!v.userData.stateGrab||V())return;v.updateWorldMatrix(!0,!1);const A=v.userData.stateGrab.offset.clone().applyMatrix4(v.matrixWorld),B=l.worldToLocal(A).normalize();B.lengthSq()&&(z(),M(),k.visible=!1,g([B.x,-B.z,B.y]),pe.capture($e),Xt=[],Wt="Arrow preparation",ae())},Ee=function(v){I(),(v==="smaller"||v==="larger")&&l.scale.setScalar(Za.clamp(l.scale.x*(v==="larger"?1.15:1/1.15),.5,1.8)),v==="movement"&&(j.smooth=!j.smooth),X.find(B=>B.userData.action==="view:movement").userData.caption.userData.set(j.smooth?"Move: smooth":"Move: step"),ie.userData.set(j.smooth?"Left stick: move · right: snap · Y: center":"Left stick: step · right: snap · Y: center"),l.updateMatrixWorld(!0),_()},ke=function(v){const A=Math.min(.05,Math.max(0,(v-_t)/1e3));_t=v;const B=Ce.find(we=>we.userData.source?.handedness==="left"),Q=Ce.find(we=>we.userData.source?.handedness==="right"),de=we=>we?.userData.source?.gamepad?.mapping==="xr-standard"&&we.userData.source.gamepad.axes.length>=4?we.userData.source.gamepad.axes:null,ve=de(B),We=de(Q);j.update(r,mt.xr.getCamera(),ve?[ve[2],ve[3]]:[0,0],We?We[2]:0,A,!V()&&!Ce.some(we=>we.userData.preparing)),mt.xr.updateCamera(e);for(const we of Ce){const bt=we.userData.source,dt=bt?.gamepad;if(dt?.mapping!=="xr-standard")continue;const Qe={primary:!!dt.buttons[4]?.pressed,secondary:!!dt.buttons[5]?.pressed,stick:!!dt.buttons[3]?.pressed};!Qe.primary&&!Qe.secondary&&!Qe.stick&&(we.userData.buttonsArmed=!0),we.userData.buttonsArmed&&(bt.handedness==="left"&&Qe.primary&&!we.userData.lastPrimary&&N(),bt.handedness==="right"&&(Qe.stick&&!we.userData.lastStick&&N(),Qe.primary&&!we.userData.lastPrimary&&se(ce.active?"lesson-next":"sequence-run"),Qe.secondary&&!we.userData.lastSecondary&&se(ce.active?"lesson-helper":"measure"))),we.userData.lastPrimary=Qe.primary,we.userData.lastSecondary=Qe.secondary,we.userData.lastStick=Qe.stick}const Ae=B?.userData.source?.gamepad?.mapping==="xr-standard"&&B.userData.source.gamepad.buttons[5]?.pressed;if(B&&(Ae&&!B.userData.yPressed&&B.userData.buttonsArmed&&Ze(),B.userData.yPressed=!!Ae),Ce.some(we=>we.userData.source&&!we.visible)){I();return}for(const we of Se.values())we.update(Ce.map((bt,dt)=>[dt,G(bt)]))},Ve=function(v){v.updateWorldMatrix(!0,!1),U.extractRotation(v.matrixWorld),xe.ray.origin.setFromMatrixPosition(v.matrixWorld),xe.ray.direction.set(0,0,-1).applyMatrix4(U).normalize()},Ie=function(v,A){const B=Math.atan2(-A.x,-A.z),Q=new un().setFromAxisAngle(new P(0,1,0),B),de=new P(v.x,v.y-1.65,v.z);Ut.visible=!1,nn.copy(de),hn.copy(Q),at=ce.active;for(const[ve,We]of[[l,[0,1.65,-2]],[R,[0,2.75,-2]],[Ye,[0,2.95,-2]],[H,[1.65,1.45,-2]],[st,[-1.45,.72,-2]],[W,[-1.45,1.85,-2]],[Ge,[ce.active?1.45:-1.45,ce.active?1.65:1.85,-2]],[oe,[0,.68,-1.7]],[In,[0,2.78,-2]]])ve.position.copy(new P(...We).applyQuaternion(Q).add(de)),ve.quaternion.copy(Q),ve.userData.label||ve.scale.setScalar(1)},Ze=function(){if(I(),mt.xr.isPresenting){const v=mt.xr.getCamera(),A=new P,B=new P;v.getWorldPosition(A),v.getWorldDirection(B),Ie(A,B)}else e.position.copy(t),a.target.copy(l.position),a.update()};var Xm=h,qm=M,Ym=L,Zm=$,jm=ee,$m=fe,Km=g,Jm=z,Qm=Z,eg=J,tg=Y,ng=Re,ig=se,sg=ae,rg=Me,ag=Be,og=he,lg=ts,cg=Vt,ug=Ei,hg=_,dg=N,fg=V,pg=G,mg=I,gg=re,_g=ge,vg=Te,xg=Ee,Mg=ke,Sg=Ve,Eg=Ie,yg=Ze;mt.setPixelRatio(Math.min(devicePixelRatio,2)),mt.xr.enabled=!0,mt.setClearColor(15659249),mt.outputColorSpace=an;const i=new Au,e=new gn(42,1,.05,40),t=new P(1.5,2.3,1.1),n=new P(0,1.65,-2),s=.65,r=new Qt;i.add(r),r.add(e),e.position.copy(t);const a=new wm(e,le("#scene"));a.target.copy(n),a.enableDamping=!0,a.minDistance=1.8,a.maxDistance=7,i.add(new Uu(16777215,6715272,3));const o=new Fu(16777215,2);o.position.set(2,4,2),i.add(o);const l=new Qt;l.position.copy(n),i.add(l);const c=new gt(new ds(s,64,32),new Or({color:12899809,transparent:!0,opacity:.16,roughness:.8,depthWrite:!1,side:_n}));l.add(c);const d=new Gn({color:10794175,transparent:!0,opacity:.48});for(let v=0;v<3;v++){const A=Array.from({length:129},(B,Q)=>{const de=Q/128*Math.PI*2;return v===0?new P(s*Math.cos(de),0,s*Math.sin(de)):v===1?new P(s*Math.cos(de),s*Math.sin(de),0):new P(0,s*Math.cos(de),s*Math.sin(de))});l.add(new Vn(new Ct().setFromPoints(A),d))}for(const[v,A,B]of[[[-.83,0,0],[.83,0,0],"+X / |+⟩"],[[0,-.83,0],[0,.83,0],"+Z / |0⟩"],[[0,0,.83],[0,0,-.83],"+Y / |+i⟩"]]){l.add(new Vn(new Ct().setFromPoints([new P(...v),new P(...A)]),new Gn({color:8886951})));const Q=h(B);Q.position.set(...A).multiplyScalar(1.08),l.add(Q)}const f=h("−Z / |1⟩");f.position.set(-.3,-.88,0),l.add(f);const m=new Ws(new P(0,1,0),new P,s,1596305,.13,.07);l.add(m);const x=new gt(new ds(.042,20,12),new Or({color:1596305}));l.add(x);const S=new Ws($t(zi.Z),new P,s*1.15,7954069,.065,.035);l.add(S);const p=new Ws($t(zi.Z),new P,s*.94,11051185,.065,.035);p.visible=!1,l.add(p);const u=new Vn(new Ct,new Gn({color:10122308}));l.add(u);const w=h("Tilt 0°",.4,.11,"#74552f");l.add(w);const T=new gt(new qt(.045,s*2,.035),new Ft({color:13226713}));T.position.x=-.76,l.add(T);const y=new gt(new qt(.047,1,.038),new Ft({color:1596305}));y.position.x=-.76,l.add(y);const F=h("0: 100%",.44,.14);F.position.set(-.76,-.82,.05),l.add(F);const D=new Vn(new Ct,new Lo({color:1596305,dashSize:.025,gapSize:.02,transparent:!0,opacity:.7}));l.add(D);const C=new Vn(new Ct,new Gn({color:1596305}));C.visible=!1,l.add(C);const O=new Qt;l.add(O);const E=new Gn({color:6457765,transparent:!0,opacity:.9}),k=new Vn(new Ct,new Lo({color:9331515,dashSize:.045,gapSize:.025}));l.add(k),k.visible=!1;const H=new Qt;i.add(H),H.position.set(0,.72,-1.48),H.visible=!1,H.add(new gt(new qt(1.76,1.12,.025),new Ft({color:16448508})));const X=[];Object.keys(rn).forEach((v,A)=>$("|"+v+"⟩","preset:"+v,-.67+A*.268,.27)),Object.keys(mn).forEach((v,A)=>$(v,"gate:"+v,-.67+A*.268,.11)),$("Fresh ×100","measure",-.51,-.065,.62),$("Reset","reset",-.02,-.065,.3),$("Guide","guide",.32,-.065,.3),$("Center","recenter",.67,-.065,.3),["X","Y","Z"].forEach((v,A)=>$(v+" basis","basis:"+v,-.55+A*.55,-.48,.48));const W=new Qt;W.position.set(-1.45,1.85,-2),W.visible=!1,i.add(W),W.add(new gt(new qt(1.15,1.65,.025),new Ft({color:16448508})));const q=h("One arrow. Two possible results.",1.06,.16,"#202428",32);q.position.set(0,.63,.04),W.add(q);const me=h("",1.06,.36,"#202428",34);me.position.set(0,.34,.04),W.add(me);const ye=ee("Measure the upright preparation","lesson-next",0,.02,1.06),De=ee("Tilt to 60° for me","lesson-helper",0,-.16,1.06),je=h("",1.06,.2,"#202428",32);je.position.set(0,-.36,.04),W.add(je),ee("Start over","lesson-restart",-.28,-.64,.52),ee("Explore freely","lesson-explore",.28,-.64,.52);const Ge=new Qt;Ge.position.set(1.45,1.65,-2),Ge.visible=!1,i.add(Ge);const K=new gt(new qt(1.1,1.5,.025),new Ft({color:16448508}));K.position.y=-.14,Ge.add(K);const ue=h("Your sequence",1,.1);ue.position.set(0,.36,.04),Ge.add(ue);const Ue=[];for(let v=0;v<za;v++)Ue.push(fe("","remove:"+v,-.39+v%4*.26,.2-Math.floor(v/4)*.15));fe("Run","sequence-run",-.39,-.12),fe("Step","sequence-step",-.13,-.12),fe("Replay","sequence-replay",.13,-.12),fe("Clear","sequence-clear",.39,-.12);const Ne=fe("Queue on","queue-mode",0,-.29,1.02),nt=h("",1.02,.09);nt.position.set(0,-.4,.045),Ge.add(nt),fe("Keep baseline","pin-baseline",0,-.55,1.02);const ze=h("No baseline yet",1.02,.16,"#202428",32);ze.position.set(0,-.74,.045),Ge.add(ze);const Et=h("",1.62,.1);Et.position.set(0,-.235,.045),H.add(Et);const yt=h("",1.62,.09);yt.position.set(0,-.335,.045),H.add(yt);const Ye=h("",2.1,.13);Ye.position.set(0,2.95,-2),i.add(Ye),Ye.visible=!1;const R=h("",1.65,.16);R.position.set(0,2.75,-2),i.add(R);const st=new Qt;st.position.set(0,.55,-2),i.add(st),st.visible=!1;const rt=new ds(.012,8,6),ft=[new Ft({color:1596305}),new Ft({color:9331515})],Pe=Array.from({length:100},(v,A)=>{const B=new gt(rt,ft[0]);return B.visible=!1,B.position.set((A%20-9.5)*.036,Math.floor(A/20)*.036,0),st.add(B),B}),tt=h("Fresh qubits: blue 0 / brown 1",.9,.095);tt.position.set(0,.25,0),st.add(tt);const Fe=new gt(new qt(.72,.025,.02),new Ft({color:13226713}));Fe.position.y=-.08,st.add(Fe);const Xe=new gt(new qt(1,.027,.023),new Ft({color:9331515}));Xe.position.y=-.08,st.add(Xe);const Pt=h("",1.05,.13,"#74552f",34);Pt.position.set(0,-.2,0),st.add(Pt);const b=new Ws(new P(0,1,0),new P,s*.96,9331515,.12,.055);l.add(b),b.visible=!1;for(const[v,A,B]of[["#presets",rn,"preset:"],["#gates",mn,"gate:"]])for(const Q of Object.keys(A)){const de=document.createElement("button");de.textContent=B==="preset:"?"|"+Q+"⟩":Q,de.addEventListener("click",()=>se(B+Q)),le(v).append(de)}for(const v of["queue-mode","sequence-run","sequence-step","sequence-replay","sequence-clear"])le("#"+v).onclick=()=>se(v);for(const v of["lesson-next","lesson-helper","lesson-restart","lesson-explore"])le("#"+v).onclick=()=>se(v);document.querySelectorAll("#bases button").forEach(v=>v.onclick=()=>se("basis:"+v.dataset.basis)),le("#pin-baseline").onclick=()=>se("pin-baseline"),le("#reset").onclick=()=>se("reset"),le("#measure").onclick=()=>se("measure"),le("#exploration").addEventListener("toggle",()=>{le("#exploration").open&&ce.active&&se("lesson-explore")}),le("#touch").onclick=()=>{pn=!pn,le("#touch").setAttribute("aria-pressed",pn),le("#touch").textContent="Touch sphere: "+(pn?"on":"off")};for(const v of["theta","phi"])le("#"+v).oninput=()=>{Le=null,z(),k.visible=!1,M();const A=pl(Number(le("#theta").value)*Math.PI/180,Number(le("#phi").value)*Math.PI/180);g([A.x,A.y,A.z]),pe.capture($e),Xt=[],Wt="Prepared with angles",ae()};const xe=new Bu,te=new qe;let Oe=!1;le("#scene").addEventListener("pointerdown",v=>{!pn||Le||pt||pe.status==="paused"||mt.xr.isPresenting||(Be(v),Me()&&(Oe=!0,a.enabled=!1,le("#scene").setPointerCapture(v.pointerId)))}),le("#scene").addEventListener("pointermove",v=>{Oe&&(Be(v),Me())});for(const v of["pointerup","pointercancel","lostpointercapture"])le("#scene").addEventListener(v,he);const Ce=[],U=new wt,oe=new Qt;oe.visible=!1,oe.position.set(0,.68,-1.7),i.add(oe);const ne=new gt(new vi(1.55,.45),new Ft({color:16317179,side:_n}));oe.add(ne);const be=h("Grip: move / turn · two grips: size",1.48,.09);be.position.set(0,.15,.01),oe.add(be);const ie=h("Left stick: step · right: snap · Y: center",1.48,.09);ie.position.set(0,.05,.01),oe.add(ie);for(const[v,A,B]of[["Smaller","view:smaller",-.57],["Larger","view:larger",-.19],["Move: step","view:movement",.19],["Center","recenter",.57]]){const Q=new gt(new vi(.36,.1),new Ft({color:14805229,side:_n}));Q.position.set(B,-.12,.005),Q.userData.action=A;const de=h(v,.35,.085);de.position.set(B,-.12,.012),Q.userData.caption=de,oe.add(Q,de),X.push(Q)}const j=new Tm,Se=new Map,He=new Map;let _t=0,at=ce.active;const nn=new P,hn=new un;let Un=!1,dn="lesson";const Ut=new Qt;Ut.visible=!1,i.add(Ut),Ut.add(new gt(new qt(1.38,1.48,.025),new Ft({color:16317179})));const ns=h("Controls · X to close",1.25,.1);ns.position.set(0,.62,.03),Ut.add(ns);const An=new Map,wn=[];["lesson","state","gates","view"].forEach((v,A)=>{Vt(Ut,{lesson:"Learn",state:"State",gates:"Gates",view:"View"}[v],"palette:"+v,(A-1.5)*.325,.44);const B=new Qt;B.name=v,Ut.add(B),An.set(v,B)});let Dt=An.get("lesson");const is=Vt(Dt,"Next","lesson-next",0,.2,1.2),ai=Vt(Dt,"Try a tilt","lesson-helper",0,-.02,1.2);Vt(Dt,"Restart","lesson-restart",-.32,-.25,.58),Vt(Dt,"Explore","lesson-explore",.32,-.25,.58);const Ms=h("Grip moves the view. Trigger edits the arrow.",1.2,.17,"#202428",36);Ms.position.set(0,-.48,.03),Dt.add(Ms),Dt=An.get("state"),Object.keys(rn).forEach((v,A)=>Vt(Dt,"|"+v+"⟩","preset:"+v,(A%3-1)*.4,.22-Math.floor(A/3)*.17,.37)),["X","Y","Z"].forEach((v,A)=>Vt(Dt,v+" basis","basis:"+v,(A-1)*.4,-.17,.37)),Vt(Dt,"Fresh ×100","measure",-.31,-.37,.59),Vt(Dt,"Keep state","pin-baseline",.31,-.37,.59),Dt=An.get("gates"),Object.keys(mn).forEach((v,A)=>Vt(Dt,v,"gate:"+v,(A%3-1)*.4,.22-Math.floor(A/3)*.17,.37)),["sequence-run","sequence-step","sequence-replay","sequence-clear"].forEach((v,A)=>Vt(Dt,["Run","Step","Replay","Clear"][A],v,(A-1.5)*.325,-.17)),Vt(Dt,"Queue on","queue-mode",0,-.34,1.2);const hr=Array.from({length:8},(v,A)=>Vt(Dt,"","remove:"+A,(A%4-1.5)*.325,-.51-Math.floor(A/4)*.15));Dt=An.get("view"),[["Smaller","view:smaller"],["Larger","view:larger"],["Move: step","view:movement"],["Center","recenter"],["Reset state","reset"]].forEach(([v,A],B)=>Vt(Dt,v,A,(B%2-.5)*.62,.2-Math.floor(B/2)*.2,.58));const Ss=h("Grip: move / turn. Two grips: size. Left stick: step. Right stick: snap. Y: center.",1.2,.22,"#202428",36);Ss.position.set(0,-.5,.03),Dt.add(Ss);const In=h("",1.85,.18,"#202428",48);In.position.set(0,2.78,-2),In.visible=!1,i.add(In);const dr={start:"Arrow up predicts 0. Measure fresh copies.","up-observed":"All copies gave 0. Now prepare a tilted arrow.",tilt:"Trigger and move the arrow. Watch chance change.",chance:"Predict the number of zeros before sampling.",sampled:"Brown counts are observed; blue chance is predicted.","turn-phase":"Turn sideways. Predict whether Z chance changes.","phase-shown":"Same height: same Z chance. Sideways direction is phase.","undo-first":"H is a half-turn. Watch the arrow leave the top.","undo-second":"Apply H again. Predict whether it returns.","undo-result":"HH returned to 0. Now insert Z between the turns.","phase-middle":"Z changes sideways direction, without measuring.","phase-last":"Chance stayed equal. Try the final H.","phase-result":"HZH reached 1 instead of 0: interference.","phase-measured":"Fresh copies confirm 1. Next: reverse gate order.","order-start":"First H, then Z. Watch the path.","order-reverse":"Reverse the order. Predict the final direction.","order-check":"Opposite directions need an X measurement.","order-plus":"Z then H gave +. Measure the saved other direction.","order-result":"Reversing order changed X outcomes."};for(let v=0;v<2;v++){const A=mt.xr.getController(v);A.add(new Vn(new Ct().setFromPoints([new P,new P(0,0,-3)]),new Gn({color:1596305}))),r.add(A);const B=mt.xr.getControllerGrip(v);B.add(new gt(new cr(.018,.025,.12,12),new Or({color:6715272}))),r.add(B),A.userData.grip=B,A.addEventListener("connected",Q=>{A.userData.source=Q.data}),A.addEventListener("selectstart",()=>{if(V())return;Ve(A);const Q=xe.intersectObjects(X.filter(Ei))[0],de=qr(xe.ray,l,s);if(Q&&(!de||Q.distance<xe.ray.origin.distanceTo(de))){Q.object.userData.disabled||(ce.active&&["state","gates"].includes(Q.object.parent.name)&&se("lesson-explore"),se(Q.object.userData.action));return}if(Le||pt||pe.status==="paused")return;const ve=x.getWorldPosition(new P),We=.12*l.scale.x,Ae=xe.ray.intersectSphere(new Ji(ve,We),new P);if(!Ae&&!de)return;ce.active&&ce.stage!=="tilt"&&se("lesson-explore"),Ae||Me();const we=l.localToWorld($t($e).multiplyScalar(s));A.updateWorldMatrix(!0,!1),A.userData.stateGrab={offset:we.applyMatrix4(A.matrixWorld.clone().invert())},A.userData.preparing=!0}),A.addEventListener("selectend",()=>{A.userData.preparing=!1,A.userData.stateGrab=null}),A.addEventListener("squeezestart",()=>re(A,v)),A.addEventListener("squeezeend",()=>ge(v)),A.addEventListener("disconnected",()=>{A.userData.source=null,I()}),Ce.push(A)}let ot=!1;le("#recenter").onclick=Ze,le("#vr").onclick=async()=>{try{if(mt.xr.isPresenting){await mt.xr.getSession().end();return}const v=await navigator.xr.requestSession("immersive-vr",{optionalFeatures:["local-floor"]});try{await v.requestReferenceSpace("local-floor"),mt.xr.setReferenceSpaceType("local-floor")}catch{throw await v.end(),new Error("This experience needs floor-level tracking.")}e.position.set(0,0,0),e.quaternion.identity(),a.enabled=!1,r.position.set(0,0,0),r.quaternion.identity(),j.reset(),await mt.xr.setSession(v),Un=!0,oe.visible=!0,H.visible=!ce.active,Ye.visible=!0,Ge.visible=!ce.active||pe.queue.length>0,W.visible=ce.active,_(),ot=!0,le("#vr").textContent="Exit VR",v.addEventListener("visibilitychange",I)}catch(v){a.enabled=!0,e.position.copy(t),le("#status").textContent="VR could not start: "+v.message}},mt.xr.addEventListener("sessionend",()=>{ot=!1,I(),Un=!1,Ut.visible=!1,In.visible=!1,st.visible=!0,R.visible=!0,oe.visible=!1,r.position.set(0,0,0),r.quaternion.identity(),l.scale.setScalar(1),e.fov=42,e.updateProjectionMatrix(),Ce.forEach(v=>v.userData.preparing=!1),H.visible=!1,Ye.visible=!1,Ge.visible=!1,W.visible=!1,W.position.set(-1.45,1.85,-2),W.quaternion.identity(),Ge.position.set(1.45,1.65,-2),Ge.quaternion.identity(),l.position.copy(n),l.quaternion.identity(),R.position.set(0,2.75,-2),R.quaternion.identity(),Ye.position.set(0,2.95,-2),Ye.quaternion.identity(),H.position.set(0,.72,-1.48),H.quaternion.identity(),st.position.set(0,.55,-2),st.quaternion.identity(),e.quaternion.identity(),a.enabled=!0,e.position.copy(t),a.target.copy(l.position),le("#vr").textContent="Enter VR"}),(async()=>{const v=le("#vr");if(!isSecureContext){v.textContent="VR needs HTTPS";return}if(!navigator.xr){v.textContent="VR unavailable here";return}try{await navigator.xr.isSessionSupported("immersive-vr")?(v.disabled=!1,v.textContent="Enter VR"):v.textContent="No headset detected"}catch{v.textContent="VR unavailable here"}})();let Tt=0,vt=0,ht=0;mt.setAnimationLoop(v=>{if(X.forEach(A=>A.material.color.setHex(A.userData.current?9681107:A.userData.completed?12835048:A.userData.disabled?13817303:14805229)),mt.xr.isPresenting){ot&&(mt.xr.updateCamera(e),Ze(),ot=!1),ke(v);for(const A of Ce){Ve(A);const B=xe.intersectObjects(X.filter(Ei))[0];B&&!B.object.userData.disabled&&B.object.material.color.setHex(11849184),A.userData.preparing&&Te(A)}}else{const A=le("#scene").clientWidth,B=le("#scene").clientHeight;(Tt!==A||vt!==B)&&(Tt=A,vt=B,mt.setSize(A,B,!1),e.aspect=A/Math.max(B,1),e.updateProjectionMatrix(),A<760?st.position.set(0,.6,-2):st.position.set(0,.55,-2)),a.update()}if(Le&&Le.pausedAt===void 0){const A=Le.duration?Math.max(0,Math.min(1,(v-Le.start)/Le.duration)):1,B=A*A*(3-2*A);g(ar(Le.from,Le.axis,Le.angle*B));const Q=$r(Le.from,Le.axis,Le.angle,B).map(de=>$t(de).multiplyScalar(s*1.005));if(C.geometry.dispose(),C.geometry=new Ct().setFromPoints(Q),C.visible=!0,A===1){const de=Le;de.gate?(Xt.push(de.gate),L(de)):C.visible=!1,Le=null,de.preparation&&pe.capture($e),de.sequence?(pe.finish($e),Wt=pe.status==="complete"?"Sequence complete":`Step ${pe.cursor} complete`,pe.status==="running"?Y(!1):pe.status==="complete"&&ce.active&&ce.waiting&&(ce.finish(),ae())):(Wt=Wt.replace(" · rotating"," · complete"),de.gate&&pe.capture($e),de.lesson&&ce.finish()),ae()}}if(pt){const A=gl?100:Math.floor(100*Hm(v,pt.start,3e3));for(let Ae=pt.shown;Ae<A;Ae++){const we=pt.outcomes[Ae];kt[we]++,Pe[Ae].material=ft[we],Pe[Ae].visible=!0,b.visible=!0,b.setDirection($t(zi[pt.basis]).multiplyScalar(we===0?1:-1))}pt.shown=A;const Q=ce.active&&ce.prepared?.basis===ct&&ce.prepared.vector.every((Ae,we)=>Math.abs(Ae-$e[we])<1e-7)?ce.totals:[0,0],de=Q[0]+kt[0],ve=Q[0]+Q[1]+A,We=ve?de/ve:0;if(Xe.scale.x=.72*We,Xe.position.x=-.36+.36*We,Pt.userData.set(`Observed: ${de}/${ve} = ${jt(We)} `+(ct==="Z"?"zeros":"+")),A===100){const Ae={vector:[...pt.prepared],basis:pt.basis,p:En(pt.prepared,pt.basis),counts:[...kt],input:[...pt.input],program:[...pt.program]};ce.active&&(ce.record(Ae.vector,Ae.basis,Ae.counts),ce.finish()),pt=null,b.visible=!1,Wt="100 fresh qubits measured in "+Ae.basis,ae()}}v-ht>100&&(Le||pt)&&(ae(),ht=v),mt.render(i,e)}),g($e),ae(),window.__BLOCH_API__={act:se,getState:()=>({vector:[...$e],counts:[...kt],touch:pn,cameraPosition:e.position.toArray(),immersive:{active:Un,paletteOpen:Ut.visible,mode:dn,visiblePanels:[H,W,Ge,oe].filter(v=>v.visible).length},view:{position:l.position.toArray(),quaternion:l.quaternion.toArray(),scale:l.scale.x,rig:r.position.toArray(),grabbing:V()},animating:!!Le,measuring:!!pt,queueMode:Sn,basis:ct,baseline:xt?structuredClone(xt):null,lesson:{stage:ce.stage,active:ce.active,waiting:ce.waiting,totals:[...ce.totals],observation:ce.observation()},history:[...Xt],trails:O.children.map(v=>({gate:v.userData.gate,points:v.userData.points.map(A=>[...A])})),activeTrail:C.visible,sequence:{queue:[...pe.queue],base:[...pe.base],cursor:pe.cursor,status:pe.status,snapshots:pe.snapshots.map(v=>[...v])}}),vrControlLayout:()=>X.map(v=>({id:v.userData.action,parent:v.parent===W?"activity":v.parent===Ge?"sequence":"main",x:v.position.x,y:v.position.y,width:v.geometry.parameters.width,height:v.geometry.parameters.height})),simulateViewGrip(v,A,B=[0,0,0,1],Q="move"){const de=Ce[v];de.position.set(...A),de.quaternion.set(...B),de.updateMatrix(),de.updateMatrixWorld(!0),Q==="start"&&de.dispatchEvent({type:"squeezestart"});for(const ve of Se.values())ve.update(Ce.map((We,Ae)=>[Ae,G(We)]));Q==="end"&&de.dispatchEvent({type:"squeezeend"})},simulateArrowGrip(v,A,B){const Q=Ce[0];Q.position.set(...v),Q.quaternion.set(...A),Q.updateMatrix(),Q.updateMatrixWorld(!0),B==="start"&&Q.dispatchEvent({type:"selectstart"}),B==="move"&&Te(Q),B==="end"&&Q.dispatchEvent({type:"selectend"})},labelTransforms(){const v=[];return i.traverse(A=>{A.userData.label&&v.push({position:A.getWorldPosition(new P).toArray(),quaternion:A.getWorldQuaternion(new un).toArray(),type:A.type})}),v},simulateNavigation(v,A,B=.016,Q=!0){j.update(r,e,v,A,B,Q)},simulateControllerPrepare(v,A=[0,1.65,0]){const B=Ce[0],Q=l.localToWorld($t(v).multiplyScalar(s));return B.position.set(...A),B.quaternion.setFromUnitVectors(new P(0,0,-1),Q.sub(B.position).normalize()),B.updateMatrix(),B.dispatchEvent({type:"selectstart"}),B.dispatchEvent({type:"selectend"}),[...$e]},vrActions:X.map(v=>v.userData.action),anchorFromPose(v,A){return Ie(new P(...v),new P(...A)),l.position.toArray()},simulateControllerSelect(v,A=[0,1.65,0]){if(Un){const ve=wn.find(We=>We.userData.action===v);ve&&(Ut.visible||N(),An.has(ve.parent.name)&&(dn=ve.parent.name),_())}const B=X.find(ve=>ve.userData.action===v&&Ei(ve));if(!B)return!1;const Q=Ce[0],de=new P;return B.getWorldPosition(de),Q.position.set(...A),Q.quaternion.setFromUnitVectors(new P(0,0,-1),de.sub(Q.position).normalize()),Q.updateMatrix(),Q.dispatchEvent({type:"selectstart"}),Q.dispatchEvent({type:"selectend"}),!0},previewVRLayout(){Un=!0,Ie(new P(0,1.65,0),new P(0,0,-1)),oe.visible=!0,H.visible=!ce.active,Ye.visible=!0,Ge.visible=!ce.active||pe.queue.length>0,W.visible=ce.active,st.position.set(-1.45,.72,-2),e.fov=100,e.updateProjectionMatrix(),a.enableDamping=!1,e.position.set(0,1.65,0),a.target.set(0,1.5,-2),a.update(),_()}},document.addEventListener("visibilitychange",()=>{document.visibilityState!=="visible"&&I()}),window.addEventListener("beforeunload",()=>{mt.setAnimationLoop(null),a.dispose(),mt.dispose()})}
