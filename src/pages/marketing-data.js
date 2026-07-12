export const images = {
  radial: 'https://hk03-1251009151.file.myqcloud.com/smthelp.com/shop_imgs/2023-6-29-16879999218660.png',
  oddform: 'https://hk03-1251009151.file.myqcloud.com/smthelp.com/desc/2019/05/%E5%9B%BE%E7%89%872-1.png',
  terminal: 'https://hk03-1251009151.file.myqcloud.com/smthelp.com/shop_imgs/2023-5-3-168308528515214.png',
  wave: 'https://www.smthelp.net/wp-content/uploads/2021/01/S-WS450C-450x450.jpg',
  line: 'https://ph.smthelp.com/images/2025/12/06/THT-Auto-Insertion-production-line-1.md.png',
  loader: 'https://ph.smthelp.com/images/2023/05/05/PCB-loader-SLD-400B---1.md.jpg',
  buffer: 'https://ph.smthelp.com/images/2023/05/05/Southern-Machinery-Board-Handling-System-NGOK-buffer.md.jpg'
};

export const machines = [
  {model:'S7900',category:'Odd Form',application:'Transformers, connectors and large electrolytic capacitors',speed:'Application dependent',image:images.oddform},
  {model:'S-70LD',category:'Odd Form',application:'LED driver and mixed odd-form insertion',speed:'Application dependent',image:images.oddform},
  {model:'S4000',category:'Axial',application:'Diodes, resistors and axial components',speed:'13,000 CPH',image:images.radial},
  {model:'S3010A',category:'Radial',application:'Radial capacitors, LEDs and transistors',speed:'12,000 CPH',image:images.radial},
  {model:'S7020T',category:'Terminal',application:'Reel and bowl-fed terminal insertion',speed:'Configuration dependent',image:images.terminal},
  {model:'S7020',category:'Pin / Eyelet',application:'Pin, eyelet and terminal insertion families',speed:'Configuration dependent',image:images.terminal},
  {model:'S7000P',category:'Pin',application:'Eyelet and pin terminal rows',speed:'Configuration dependent',image:images.terminal},
  {model:'S-WS450',category:'Wave Soldering',application:'Lead-free through-hole soldering process',speed:'Process dependent',image:images.wave}
];

export function machineCards(items = machines) {
  return items.map(m=>`<article class="card machine-card"><img src="${m.image}" alt="${m.model} ${m.category} machine" loading="lazy" width="640" height="480"><div class="card-body"><span class="meta">${m.category}</span><h3>${m.model}</h3><p>${m.application}</p><div class="metric"><strong>${m.speed}</strong><span>Published or configuration-qualified output</span></div><div class="card-actions"><a class="btn btn-primary" href="/contact?model=${encodeURIComponent(m.model)}">Request quote</a><a class="btn btn-secondary" href="https://file.autoinsertion.com" target="_blank" rel="noopener">Resources</a></div></div></article>`).join('');
}
