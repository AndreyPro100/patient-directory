// run via run_script: await (new (Object.getPrototypeOf(async function(){}).constructor)('readFile','readFileBinary','saveFile','log', await readFile('spec/build-tz.js')))(readFile, readFileBinary, saveFile, log)
// prerequisite: copy "Спецификация/ТЗ по сценариям.dc.html" to spec/tz-src.html; output spec/tz-web.html (then move to Cyrillic name)
const b64 = async blob => { const buf = new Uint8Array(await blob.arrayBuffer()); let s = ''; for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000)); return btoa(s); };
const src = await readFile('spec/tz-src.html');
let body = src.slice(src.indexOf('</template>') + '</template>'.length, src.indexOf('<sc-if value="{{ lbOpen }}"'));
body = body.replace(/ style-hover="[^"]*"/g, '');
const re = /src="\.\.\/spec\/shots\/(\d+)-g\.jpg"/g, cache = {};
for (const m of [...body.matchAll(re)]) if (!cache[m[1]]) cache[m[1]] = 'data:image/jpeg;base64,' + await b64(await readFileBinary('spec/shots/' + m[1] + '-g.jpg'));
body = body.replace(re, (a, n) => 'src="' + cache[n] + '"');
let ff = '';
for (const [n, w] of [['Regular', 400], ['Medium', 500], ['Semibold', 600], ['Bold', 700]]) ff += '@font-face{font-family:"Graphik LCG";src:url(data:font/woff2;base64,' + await b64(await readFileBinary('_ds/design-system-1a266e44-7ce8-47b0-9885-e2f5793bcb72/fonts/GraphikLCG-' + n + '.woff2')) + ') format("woff2");font-weight:' + w + ';font-style:normal;font-display:swap}\n';
const css = ff + `html,body{margin:0;padding:0;background:#f9f4f4;font-family:"Graphik LCG",-apple-system,"Segoe UI",sans-serif;color:#212223;font-size:15px;line-height:1.55}
a{color:#d6006d;text-decoration:none}a:hover{color:#a80056;text-decoration:underline}
p{margin:0;text-wrap:pretty}ol,ul{margin:0;padding-left:22px}li{margin:4px 0}
img{display:block;width:100%;height:auto;border:1px solid #e6dfe0;border-radius:12px;cursor:zoom-in}
#lb{position:fixed;inset:0;z-index:100;background:rgba(33,34,35,.1);display:none;align-items:center;justify-content:center;padding:76px 96px 32px;box-sizing:border-box}
#lb.on{display:flex}
#lb .box{position:relative;display:flex;flex-direction:column;align-items:center;gap:12px;max-width:100%;max-height:100%}
#lb .box img{width:auto;max-width:100%;max-height:calc(100vh - 150px);border:none;cursor:default;box-shadow:0 8px 32px rgba(0,0,0,.18);background:#fff}
#lb .cap{padding:4px 12px;border-radius:8px;background:#fff;font-size:14px;line-height:20px;white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:ellipsis;box-sizing:border-box}
#lb button{border:none;border-radius:50%;background:#fff;color:#212223;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.12);padding:0}
#lb button:hover{background:#f3eced}
#lb .x{position:absolute;top:-52px;right:0;width:40px;height:40px}
#lb .nav{position:fixed;top:50%;transform:translateY(-50%);width:48px;height:48px}
#lb .prev{left:24px}#lb .next{right:24px}`;
const lb = `<div id="lb"><div class="box"><button class="x" aria-label="Закрыть"><svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></button><img alt=""><div class="cap"></div></div><button class="nav prev" aria-label="Предыдущая"><svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg></button><button class="nav next" aria-label="Следующая"><svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg></button></div>
<script>(function(){var lb=document.getElementById('lb'),im=lb.querySelector('.box img'),cap=lb.querySelector('.cap'),list=[].slice.call(document.querySelectorAll('img')).filter(function(x){return !lb.contains(x)}),i=-1;
function show(n){i=(n+list.length)%list.length;im.src=list[i].src;cap.textContent=(list[i].alt||'')+' · '+(i+1)+' из '+list.length;lb.classList.add('on');document.body.style.overflow='hidden'}
function close(){lb.classList.remove('on');document.body.style.overflow='';i=-1}
list.forEach(function(x,k){x.addEventListener('click',function(){show(k)})});
lb.addEventListener('click',function(e){if(e.target===lb)close()});
lb.querySelector('.x').addEventListener('click',close);
lb.querySelector('.prev').addEventListener('click',function(){show(i-1)});
lb.querySelector('.next').addEventListener('click',function(){show(i+1)});
document.addEventListener('keydown',function(e){if(i<0)return;if(e.key==='Escape')close();else if(e.key==='ArrowRight'){e.preventDefault();show(i+1)}else if(e.key==='ArrowLeft'){e.preventDefault();show(i-1)}});})();</script>`;
const html = '<!DOCTYPE html>\n<html lang="ru">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>ТЗ по сценариям — Справочник пациентов</title>\n<style>' + css + '</style>\n</head>\n<body>\n' + body.trim() + '\n' + lb + '\n</body>\n</html>';
await saveFile('spec/tz-web.html', html);
log('MB', (html.length / 1048576).toFixed(2), 'holes', (html.match(/\{\{/g) || []).length);
