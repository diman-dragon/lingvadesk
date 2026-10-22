import sys, json
from playwright.sync_api import sync_playwright
INIT = """
window.Capacitor = { nativePromise: async (name, m, a) => {
  const r = await fetch('/__bridge', {method:'POST', body: JSON.stringify({name, a})}); const j = await r.json();
  if (j.err) throw new Error(j.err); return j.r; } };
"""
CHECK = """
() => {
  const out = [], vw = innerWidth, vh = innerHeight;
  const path = e => { const p=[]; while(e && e.id!=='app' && p.length<5){ p.unshift(e.tagName.toLowerCase()+(e.className&&typeof e.className==='string'?'.'+e.className.trim().split(/\\s+/).join('.'):'')); e=e.parentElement;} return p.join('>'); };
  const vis = e => { const r=e.getBoundingClientRect(); const cs=getComputedStyle(e); return r.width>0 && r.height>0 && cs.visibility!=='hidden' && cs.display!=='none' && !e.closest('[hidden]') && !e.closest('.back[style*="hidden"]'); };
  for (const e of document.querySelectorAll('#app *')) {
    if (!vis(e) || e.closest('svg')) continue;
    if (e.closest('.face') && getComputedStyle(e.closest('.face')).visibility==='hidden') continue;
    const r = e.getBoundingClientRect(), cs = getComputedStyle(e);
    const txt = [...e.childNodes].some(n => n.nodeType===3 && n.textContent.trim());
    if (r.right > vw+1 || r.left < -1) out.push(['offscreen-x', path(e), Math.round(r.left), Math.round(r.right)]);
    if (r.bottom > vh+1 && !e.closest('.sheet-list') && !e.closest('.view.form')) out.push(['offscreen-y', path(e), Math.round(r.bottom), vh]);
    if (txt && e.scrollWidth > e.clientWidth+1 && cs.display!=='inline') out.push(['scroll-x', path(e), e.scrollWidth, e.clientWidth, (e.textContent||'').trim().slice(0,30)]);
    // clipped by overflow ancestor
    if (txt && !e.closest('.sheet')) { let a = e.parentElement; while (a && a.id!=='app') { const ac=getComputedStyle(a); if (ac.overflow!=='visible' || ac.overflowX!=='visible' || ac.overflowY!=='visible') { const ar=a.getBoundingClientRect(); const scrolls = a.matches('.sheet-list,.view.form,.opts'); if (scrolls) break; if (!scrolls && (r.bottom>ar.bottom+1 || r.right>ar.right+1 || r.top<ar.top-1 || r.left<ar.left-1) && !a.matches('.pager')) { out.push(['clipped', path(e), path(a), Math.round(r.bottom), Math.round(ar.bottom), (e.textContent||'').trim().slice(0,30)]); break; } } a=a.parentElement; } }
    if (txt && (cs.overflow==='hidden') && e.scrollHeight > e.clientHeight+1) out.push(['scroll-y', path(e), e.scrollHeight, e.clientHeight]);
  }
  // pager pages: все ли элементы страницы внутри .pager
  const pg = document.getElementById('pager');
  if (pg) { const pr = pg.getBoundingClientRect(); for (const c of pg.querySelectorAll('.page > *')) { const r=c.getBoundingClientRect(); if (r.bottom > pr.bottom+1 && !pg.classList.contains('fixed')) out.push(['page-overflow', path(c), Math.round(r.bottom), Math.round(pr.bottom)]); } }
  // flip faces / big
  for (const f of document.querySelectorAll('.face')) { if (getComputedStyle(f).visibility==='hidden') continue; if (f.scrollHeight>f.clientHeight+1) out.push(['face-scroll', path(f), f.scrollHeight, f.clientHeight]); }
  return out;
}
"""
def run(vw, vh, font, shots):
    probs = []
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=__import__('os').environ.get('CHROMIUM', '/opt/pw-browsers/chromium'), args=['--no-sandbox'])
        ctx = b.new_context(viewport={'width': vw, 'height': vh}, device_scale_factor=1, has_touch=True, is_mobile=True)
        ctx.add_init_script(INIT)
        page = ctx.new_page(); errs=[]
        page.on('pageerror', lambda e: errs.append(str(e)))
        page.goto('http://localhost:8765/'); page.wait_for_selector('.tabs')
        page.evaluate("async f => { const m = await import('/js/settings/savePref.js'); await m.default('font', f); const a = await import('/js/settings/applyPrefs.js'); a.default(); const r = await import('/js/nav/render.js'); await r.default(); }", font)
        def chk(label):
            page.wait_for_timeout(350)
            res = page.evaluate(CHECK)
            for r in res: probs.append((label, r))
            if shots: page.screenshot(path=f'shots/{vw}x{vh}-{font}-{label}.png')
        def act(a, **d):
            sel = f'[data-act="{a}"]' + ''.join(f'[data-{k}="{v}"]' for k, v in d.items())
            if page.locator(sel).count() == 0:
                page.evaluate("async ([a, d]) => (await import('/js/actions/' + a + '.js')).default(d)", [a, {k: str(v) for k, v in d.items()}]); page.wait_for_timeout(250); return
            try: page.locator(sel).first.click(timeout=3000)
            except Exception as ex:
                probs.append(('act', ['click-failed', sel, str(ex).split('\n')[-3][:120] if '\n' in str(ex) else str(ex)[:120]]))
                page.locator(sel).first.dispatch_event('click', timeout=2000)
            page.wait_for_timeout(250)
        def pages(label):
            n = page.evaluate("document.querySelectorAll('#dots .dot').length || 1")
            for i in range(n):
                if i: act('gotoPage', i=i)
                chk(f'{label}-p{i}')
            if n > 1: act('gotoPage', i=0)
        for lay in ('list', 'grid'):
            if lay == 'grid': act('toggleLayout')
            act('goLibrary'); pages(f'lib-{lay}')
            act('goProject', id=1); pages(f'proj-{lay}')
            act('goDeck', id=1); pages(f'deck-{lay}')
            act('goStudy'); pages(f'study-{lay}')
            act('openMode', id='srs'); pages(f'modeprojects-{lay}')
            act('openProjectDecks', id=1); pages(f'modedecks-{lay}')
            act('goStats'); pages(f'stats-{lay}')
            for i in range(12):
                page.evaluate("async i => (await import('/js/actions/openStat.js')).default({id:i})", i); page.wait_for_timeout(250); chk(f'stat{i}-{lay}'); page.locator('button[data-act="closeSheet"]').click(timeout=3000); page.wait_for_timeout(200)
        act('toggleLayout')  # back to list
        act('goSettings'); pages('settings')
        # forms
        act('goLibrary'); act('newProject'); chk('projectForm'); act('back')
        act('goProject', id=1); act('newDeck'); chk('deckForm'); act('back')
        act('goDeck', id=1); act('newCard'); chk('cardForm'); act('back')
        page.evaluate("async () => (await import('/js/actions/editCard.js')).default({id:4})"); page.wait_for_timeout(250); chk('cardForm-long'); act('back')
        # sessions
        for mode in ('srs', 'cards', 'listen', 'speak'):
            act('goStudy'); act('openMode', id=mode); act('openProjectDecks', id=1); act('pickScope', id='d:1')
            page.wait_for_timeout(300)
            for k in range(7):
                chk(f'{mode}-c{k}-front')
                # перевернуть/показать ответ
                if mode in ('srs',) :
                    page.evaluate("document.querySelector('.flip')?.click()"); page.wait_for_timeout(300); chk(f'{mode}-c{k}-back')
                elif mode == 'cards':
                    page.evaluate("document.querySelector('.flip')?.click()"); page.wait_for_timeout(300); chk(f'{mode}-c{k}-back')
                elif mode == 'listen':
                    act('showText'); chk(f'{mode}-c{k}-shown')
                    opt = page.locator('[data-act="pick"]'); 
                    if opt.count(): act('pick', i=0); page.wait_for_timeout(300); chk(f'{mode}-c{k}-answered')
                if page.locator('[data-act="skip"]').count(): act('skip')
                else:
                    page.evaluate("document.querySelector('.flip')?.click()"); 
                    page.evaluate("window.dispatchEvent(new Event('x'))")
                    break_ = page.locator('[data-act="giveUp"]'); 
                    if break_.count(): act('giveUp'); chk(f'{mode}-c{k}-giveup'); act('skip')
            act('back'); 
        # game
        act('goStudy'); act('openMode', id='game'); act('openGameKind', id='blitz'); act('openProjectDecks', id=1); act('pickScope', id='d:1'); page.wait_for_timeout(300)
        for k in range(3):
            chk(f'game-q{k}'); page.locator('[data-act="gamePick"]').first.click(timeout=3000); page.wait_for_timeout(1000)
        # игры и квест
        act('goStudy'); act('openMode', id='game'); pages('games')
        act('openGameKind', id='quest'); act('openProjectDecks', id=1); act('pickScope', id='d:1'); page.wait_for_timeout(300)
        for k in range(7):
            chk(f'quest-s{k}')
            if page.locator('[data-act="questPick"]').count(): act('questPick', i=0)
            elif page.locator('#ans').count():
                page.fill('#ans', 'x'); act('questCheck')
            else: break
            chk(f'quest-s{k}-answered')
            if page.locator('[data-act="questNext"]').count(): act('questNext')
        chk('quest-end')
        b.close()
    return probs, errs
CONF = {(360,640,'m'),(360,640,'l'),(320,568,'m')}
if __name__ == '__main__':
    seen = set(); total = 0
    for (vw, vh) in [(360, 640), (320, 568), (412, 915)]:
        for font in ('m', 'l'):
            if (vw, vh, font) not in CONF: continue
            probs, errs = run(vw, vh, font, shots=(vw==360 and font=='m'))
            print(f'== {vw}x{vh} font={font}: {len(probs)} проблем, js-ошибок: {errs[:3]}')
            for lab, r in probs:
                key = (r[0], r[1])
                if key in seen: continue
                seen.add(key); print('  ', lab, r)
