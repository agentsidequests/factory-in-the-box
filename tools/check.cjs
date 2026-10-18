const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(process.argv[2]||path.join(__dirname,'..')),pub=path.join(root,'public');const read=name=>fs.readFileSync(path.join(pub,name),'utf8');
const html=read('index.html'),css=read('style.css'),app=read('app.js'),model=read('model.js'),scene=read('scene.js');
for(const code of [app,model,scene])new vm.Script(code);const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
for(const m of html.matchAll(/(?:src|href)="([^"]+)"/g)){const t=m[1];if(t.startsWith('#'))assert.ok(ids.includes(t.slice(1)),`Anchor ${t}`);else if(!/^(https?:|data:)/.test(t))assert.ok(fs.existsSync(path.join(pub,t)),`Asset ${t}`);}
for(const m of app.matchAll(/\$\('([^']+)'\)/g))assert.ok(ids.includes(m[1]),`Script target ${m[1]}`);
for(const s of [html,css,app,model]){assert.ok(!s.includes('\u2014'),'No em dashes in authored public copy');assert.ok(!/[A-Z]:[\\/]Users[\\/]|gh[pousr]_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9_-]{24,}/i.test(s),'No local user paths or credential-like values');}
assert.ok(!/fetch\(|XMLHttpRequest|sendBeacon|geolocation\./.test(app));assert.ok(css.includes('prefers-reduced-motion'));assert.ok(html.includes('draft guidance'));assert.ok(html.includes('INVENTED NUMBERS'));assert.ok(read('third-party-licenses.txt').includes('MIT License'));
const rooms=['start','pod','scale','one','evidence'];for(const r of rooms){assert.ok(html.includes(`id="tab-${r}"`));assert.ok(html.includes(`aria-controls="${r}"`));assert.ok(html.includes(`aria-labelledby="tab-${r}"`));}
assert.ok(!html.match(/<title>[^<]*Paul|class="brand"[^\n]*Paul|class="intro-copy"[^\n]*Paul/i),'No author in top identity');assert.ok(app.includes("e.key==='ArrowRight'"));assert.ok(html.includes('<dialog id="reader"'));assert.ok(css.includes('100dvh'));
assert.ok(html.includes('id="guided-controls"')&&html.includes('id="free-controls"'),'Both guided and free paths exist');
assert.ok(app.includes('FactoryModel.compare(')&&app.includes('FactoryModel.WALKTHROUGH['),'UI uses tested comparison and guided states');
assert.ok(!/setInterval\(|requestAnimationFrame\(/.test(app),'No automatic experiment advancement or motion');
const c=JSON.parse(fs.readFileSync(path.join(root,'vercel.json'),'utf8'));assert.equal(c.outputDirectory,'public');assert.equal(c.buildCommand,'');
console.log(`Static checks passed: ${ids.length} unique IDs, sources/assets/anchors, scripts, privacy, model labels and license.`);
