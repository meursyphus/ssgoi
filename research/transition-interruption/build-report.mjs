import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from '/Users/moon/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/marked/lib/marked.esm.js';

const dir = path.dirname(fileURLToPath(import.meta.url));
const assets = path.join(dir, 'assets');
fs.mkdirSync(assets, { recursive: true });
const escape = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const tx = (x,y,label,size=16,color='#20252b',anchor='start') => `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" text-anchor="${anchor}">${escape(label)}</text>`;
const box = (x,y,w,h,lines,accent=false) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${accent?'#eef4fc':'#f7f8fa'}" stroke="${accent?'#3265a8':'#bdc4cd'}"/>`+lines.map((s,i)=>tx(x+w/2,y+h/2+(i-(lines.length-1)/2)*24+6,s,16,accent?'#214f8a':'#20252b','middle')).join('');
const arrow = (x1,y1,x2,y2,label='') => `<path d="M${x1},${y1} L${x2},${y2}" fill="none" stroke="#687583" stroke-width="1.5" marker-end="url(#arrow)"/>`+(label?tx((x1+x2)/2,(y1+y2)/2-9,label,13,'#4c5867','middle'):'');
function svg(name,w,h,title,desc,body){
  const text=`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title desc"><title id="title">${escape(title)}</title><desc id="desc">${escape(desc)}</desc><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="#687583"/></marker></defs><rect width="100%" height="100%" fill="#fff"/><g font-family="Arial, Apple SD Gothic Neo, Noto Sans KR, sans-serif">${body}</g></svg>`;
  fs.writeFileSync(path.join(assets,name+'.svg'),text+'\n');
}

svg('scene',860,370,'최신 탐색과 계속 살아 있는 운동','최신 탐색 A에서 B, 이어 C는 새 목표를 만들고 MotionScene은 대상별 현재 운동 상태를 유지한다.',
  tx(26,30,'탐색 의도',16)+box(26,50,220,58,['A → B → C'])+arrow(246,79,340,79,'새 목표')+box(340,50,220,58,['효과 / 목적지 계획'])+arrow(450,108,450,150)+
  box(26,150,808,185,[],true)+tx(48,181,'MotionScene · ID별 상태와 소유권',19,'#214f8a')+
  box(48,205,168,90,['A surface','퇴장 상태 유지'])+box(244,205,168,90,['B surface','입장 → 퇴장'])+box(440,205,168,90,['C surface','최신 목적지'])+box(636,205,174,90,['photo:42','연속 flight'])+
  tx(26,359,'탐색은 최신 의도를 따른다. 화면의 모든 대상이 동시에 끝날 필요는 없다.',15));

svg('reverse',860,315,'역전환 좌표와 화면 속도','p 0.4에서 현재 B 위치는 240px이며 속도는 -800px/s다. q 0.6과 q 속도 -2로 재매개화하면 두 값 모두 보존된다.',
  box(25,45,240,88,['기존 진입 · p = 0.4','x = 400(1 − p)'])+arrow(265,89,325,89)+box(325,45,220,88,['현재 B','240px, −800px/s'],true)+arrow(545,89,610,89)+box(610,45,225,88,['새 퇴장 · q = 0.6','x = 400q'])+
  tx(25,27,'같은 물체, 다른 매개화',18)+tx(430,169,'q = 1 − p     /     q̇ = −ṗ',18,'#214f8a','middle')+
  `<line x1="60" y1="229" x2="798" y2="229" stroke="#b9c0c8"/><circle cx="502" cy="229" r="12" fill="#3265a8"/>`+arrow(482,229,372,229)+tx(502,205,'B · 화면 속도는 여전히 왼쪽',15,'#214f8a','middle')+tx(60,257,'A 쪽',14)+tx(798,257,'B 쪽',14,'#20252b','end')+
  tx(25,296,'좌표를 바꾸면 scalar 속도의 부호가 바뀔 수 있다. 화면 속도를 뒤집는 것과 다르다.',15));

svg('matching',860,462,'ID로 요소별 track 연결','기존 A B photo42 overlay와 새 B C photo42 dim 중 B와 photo42만 이어받으며 나머지는 각각 입장 또는 퇴장한다.',
  tx(26,30,'이전 MultiAnimation',19)+tx(572,30,'새 MultiAnimation',19)+
  box(26,53,240,55,['A / surface'])+box(26,129,240,55,['B / surface'],true)+box(26,205,240,55,['photo:42 / media'],true)+box(26,281,240,55,['zoom / backdrop'])+
  box(574,53,260,55,['C / surface'])+box(574,129,260,55,['photo:42 / media'],true)+box(574,205,260,55,['B / surface'],true)+box(574,281,260,55,['drill / dim'])+
  `<path d="M266,156 C390,156 438,232 574,232" fill="none" stroke="#3265a8" stroke-width="2" marker-end="url(#arrow)"/><path d="M266,232 C390,232 438,156 574,156" fill="none" stroke="#3265a8" stroke-width="2" marker-end="url(#arrow)"/>`+
  tx(420,117,'key + role + schema',15,'#214f8a','middle')+tx(299,84,'retire',14)+tx(534,84,'enter',14,'#20252b','end')+tx(299,314,'retire',14)+tx(534,314,'enter',14,'#20252b','end')+
  box(26,368,808,67,['배열 순서와 child 수가 달라도, 같은 ID의 대상은 운동을 이어받는다.','ID 매칭 다음에는 채널 · 좌표 · solver 호환성을 검사한다.']));

svg('lifecycle',860,365,'A B C의 surface 생애','A에서 B로 갈 때 A는 퇴장하고 B는 입장한다. C 입력 후 A는 retire를 마치며 B는 입장에서 퇴장으로, C는 새 입장으로 이어진다.',
  tx(150,28,'A → B 시작',15)+tx(424,28,'C 입력',15,'#214f8a')+tx(705,28,'C 정착',15)+
  `<line x1="443" y1="44" x2="443" y2="292" stroke="#3265a8" stroke-dasharray="5 5"/>`+
  tx(28,104,'A',20)+box(150,70,293,50,['exiting'])+box(443,70,152,50,['retiring'])+tx(617,101,'해제',15)+
  tx(28,184,'B',20)+box(150,150,293,50,['entering'],true)+box(443,150,292,50,['현재 pose에서 exiting'],true)+
  tx(28,264,'C',20)+box(443,230,292,50,['entering'],true)+arrow(150,306,799,306)+tx(799,332,'시각적 시간 →',14,'#4c5867','end')+
  tx(28,355,'C 입력 시점에 B를 완성된 중간 화면으로 만들지 않는다. A도 즉시 제거할 필요는 없다.',15));

svg('inertialization',860,430,'새 경로와 잔차의 합','기존 화면의 pose와 velocity를 새 효과의 초기 출력과 비교해 잔차를 만든다. 새 효과 경로는 직접 출력에 더하고, 초기 잔차만 spring으로 감쇠한다.',
  box(26,28,235,90,['이전의 최종 화면','y_old, v_old'],true)+arrow(261,73,325,73)+box(325,28,300,90,['초기 차이 계산','r₀ = y_old − d(0)','ṙ₀ = v_old − ḋ(0)'])+
  box(26,186,235,80,['새 효과의 경로','d(τ), ḋ(τ)'])+box(325,186,300,80,['잔차의 spring 감쇠','r(τ), ṙ(τ)'],true)+arrow(625,226,674,226)+box(674,176,160,100,['최종 출력','d(τ) + r(τ)'],true)+
  `<path d="M261,215 L292,215 L292,102 L325,102" fill="none" stroke="#687583" stroke-width="1.5" marker-end="url(#arrow)"/><path d="M144,266 L144,310 L754,310 L754,276" fill="none" stroke="#687583" stroke-width="1.5" marker-end="url(#arrow)"/>`+
  arrow(475,118,475,186)+tx(410,302,'새 경로 d(τ)는 출력에 직접 합산',14,'#4c5867','middle')+
  tx(26,359,'접합 순간: 위치와 속도는 이전 화면과 같다.',17,'#214f8a')+tx(26,389,'이후: 잔차가 줄어들며 새 효과의 연출로 수렴한다.',17)+tx(26,418,'다시 interrupt되면 d + r의 최종 출력에서 새 잔차 하나를 만든다.',15));

svg('handoff',860,435,'인계 트랜잭션','새 intent와 generation을 만들고 비동기 prepare, 최신 pose 재샘플, ID 매칭을 거쳐 새 writer 준비 후 소유권을 교체하고 이전 writer를 해제한다.',
  box(26,32,240,65,['새 intent / generation'])+arrow(266,64,309,64)+box(309,32,245,65,['비동기 prepare / layout'])+arrow(554,64,600,64)+box(600,32,234,65,['최신 pose 재샘플'],true)+
  arrow(717,97,717,156)+box(600,156,234,65,['ID별 인계 계획'],true)+arrow(600,188,554,188)+box(309,156,245,65,['새 writer 첫 출력 준비'])+arrow(309,188,266,188)+box(26,156,240,65,['ownership 교체'],true)+
  arrow(146,221,146,280)+box(26,280,240,65,['old writer detach'])+arrow(266,312,309,312)+box(309,280,245,65,['source-only retire'])+arrow(554,312,600,312)+box(600,280,234,65,['lease = 0 → dispose'])+
  tx(26,388,'기존 화면은 인계 준비가 끝날 때까지 보존한다.',17,'#214f8a')+tx(26,417,'각 비동기 경계에서 generation 확인. 이전 endpoint를 쓰는 complete는 인계 수단으로 쓰지 않는다.',14));

let content = fs.readFileSync(path.join(dir,'REPORT.ko.md'),'utf8');
marked.setOptions({ gfm: true, breaks: false });
let body = marked.parse(content);
// Make the report self-contained while the Markdown keeps ordinary asset links.
body = body.replace(/<img src="([^"]+\.svg)"([^>]*)>/g,(_m,src,rest)=>{
  return `<figure><img src="data:image/svg+xml;base64,${fs.readFileSync(decodeURI(src)).toString('base64')}"${rest}></figure>`;
});
const headings=[];
let idx=0;
body = body.replace(/<h2>(.*?)<\/h2>/g,(_m,label)=>{
  const id='section-'+(++idx); headings.push({id,label});return `<h2 id="${id}">${label}</h2>`;
});
body=body.replace(/<table>/g,'<div class="table-wrap"><table>').replace(/<\/table>/g,'</table></div>');
// A browser cannot open the Codex editor's :line path suffix. Keep the file
// link usable and preserve the line hint in a title; the Markdown retains it.
body=body.replace(/href="(\/Users\/[^"\n]+):(\d+)"/g,'href="$1" title="원문 $2행"');
const sim = fs.readFileSync(path.join(dir,'simulation.html'),'utf8');
body=body.replace('<h2 id="section-2">',sim+'<h2 id="section-2">');
const toc = headings.map(h=>`<a href="#${h.id}">${h.label}</a>`).join('\n');
const html=`<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>SSGOI의 연속적인 페이지 전환 설계</title><style>
*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:30px}body{margin:0;background:#fff;color:#20252b;font-family:-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Noto Sans KR",sans-serif;font-size:17px;line-height:1.85;word-break:keep-all;overflow-wrap:anywhere}a{color:#245b9c;text-underline-offset:4px}a:hover{text-decoration-thickness:2px}main{max-width:960px;padding:60px 42px 110px;margin:0 auto 0 max(250px,calc((100vw - 1360px)/2 + 250px))}h1{font-size:42px;line-height:1.35;letter-spacing:-1.2px;font-weight:650;margin:0 0 32px}h2{font-size:27px;line-height:1.45;letter-spacing:-.6px;margin:76px 0 26px;padding-top:24px;border-top:1px solid #bbc3cc;font-weight:650}h3{font-size:21px;line-height:1.6;margin:40px 0 16px;font-weight:620}p{margin:16px 0}strong{font-weight:650}ul,ol{padding-left:25px;margin:20px 0}li{margin:10px 0}code{font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:.85em;background:#f3f5f7;padding:2px 4px}pre{font-size:14px;line-height:1.8;background:#f5f6f8;padding:22px;overflow:auto;white-space:pre-wrap;word-break:normal}pre code{padding:0;background:none;font-size:inherit}figure{margin:32px 0}figure img{display:block;width:100%;height:auto;border:1px solid #d7dde4}figure::after{content:attr(aria-label)}.table-wrap{width:100%;overflow-x:auto;margin:25px 0}table{border-collapse:collapse;width:100%;font-size:14px;line-height:1.75;min-width:640px}th{font-weight:650;text-align:left;border-top:1px solid #aeb7c1;border-bottom:1px solid #aeb7c1;background:#f1f3f6}th,td{padding:12px 13px;vertical-align:top;border-bottom:1px solid #d9dee5}tr:nth-child(even){background:#fafbfc}td code{white-space:normal}nav{position:fixed;top:45px;left:max(18px,calc((100vw - 1360px)/2));width:224px;max-height:calc(100vh - 90px);overflow:auto;border-right:1px solid #e0e4e9;padding:0 20px 10px 0;font-size:13px;line-height:1.55}nav p{font-size:14px;font-weight:650;margin:0 0 18px}nav a{display:block;margin:12px 0;text-decoration:none;color:#485464}nav a:hover{color:#245b9c}.sim-section{margin:38px 0 20px;padding:24px 0;border-block:1px solid #d9dee5}.sim-title{font-size:19px;font-weight:600;margin:0 0 10px}.sim-note{font-size:14px;color:#596673;margin:12px 0}.sim-controls{display:flex;gap:8px;flex-wrap:wrap}.sim-controls button{font:inherit;font-size:15px;background:#fff;border:1px solid #8c9baa;color:#25394e;padding:7px 18px;cursor:pointer}.sim-controls button[aria-pressed=true]{background:#edf3fb;border-color:#245b9c;color:#245b9c}.sim-controls button:focus-visible{outline:3px solid #7cabec;outline-offset:3px}.sim-section svg{width:100%;height:auto;display:block}.sim-status{font-size:14px;color:#425364;min-height:25px}.sim-section p{word-break:keep-all}
@media(max-width:1130px){nav{position:static;width:auto;max-height:none;border-right:0;border-bottom:1px solid #d9dee5;margin:30px 30px 0;padding:0 0 22px;display:grid;grid-template-columns:repeat(3,1fr);gap:8px 16px}nav p{grid-column:1/-1}nav a{margin:0}main{margin:0 auto;padding-top:38px;max-width:960px}}@media(max-width:650px){body{font-size:16px;line-height:1.85}nav{grid-template-columns:1fr 1fr;margin:22px 20px 0;font-size:12px}main{padding:32px 20px 65px}h1{font-size:32px}h2{font-size:24px;margin-top:55px}h3{font-size:19px}pre{padding:14px;font-size:12px}figure{overflow-x:auto}figure img{min-width:700px}table{min-width:620px}.sim-controls button{padding:7px 17px}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}@media print{nav,.sim-section{display:none}main{margin:0;padding:0;max-width:none}body{font-size:10pt;line-height:1.7}h1{font-size:25pt}h2{font-size:17pt;margin-top:28pt;break-after:avoid}h3{font-size:13pt;break-after:avoid}figure,pre,tr{break-inside:avoid}figure img{min-width:0}table{font-size:9pt;min-width:0}a{color:inherit}pre{font-size:8pt}.table-wrap{overflow:visible}}
</style></head><body><nav aria-label="보고서 목차"><p>목차</p>${toc}</nav><main>${body}</main></body></html>`;
fs.writeFileSync(path.join(dir,'report.html'),html);
console.log(JSON.stringify({headings:headings.length,words:content.split(/\s+/).length,markdownBytes:Buffer.byteLength(content),htmlBytes:Buffer.byteLength(html),figures:6}));
