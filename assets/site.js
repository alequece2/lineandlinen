// intro da home — mesma sequência da referência:
// clique -> playing (som, letras do meio somem, cortinas abrem 90px, fotos piscam a cada 200ms)
// +0.8s -> sliding (as duas letras vão para as pontas, cortinas abrem até 142px)
// +1.8s -> finishing (cortina direita fecha, as letras somem, overlay desaparece e ficam ART | SPACES)
(function(){
  var intro=document.getElementById('intro');
  if(!intro)return;
  var btn=intro.querySelector('.introbtn'),wm=btn.querySelector('.wm'),audio=intro.querySelector('audio');
  var L=wm.querySelectorAll('i'),A=L[0],B=L[9];           // "L" de LINE e "L" de LINEN (como o R e o L da referência)
  A.classList.add('ka');B.classList.add('kb');
  var imgs=intro.querySelectorAll('.win img'),m=0,flick=null,started=false;
  // ?som=N escolhe outra música da intro (ver musica.html)
  try{var q=new URLSearchParams(location.search).get('som');if(audio&&q&&/^([1-9]|10)$/.test(q))audio.src='assets/som/'+q+'.mp3'}catch(e){}
  function ready(ms){setTimeout(function(){document.body.classList.add('ready')},ms)}
  function x(el){return el.getBoundingClientRect().left}
  function mv(el,dx){el.style.transform='translate3d('+dx+'px,0,0)'}
  btn.addEventListener('click',function(){
    if(started)return;started=true;
    var a0=x(A),b0=x(B),last=x(L[L.length-1]),vw=window.innerWidth,bw=B.getBoundingClientRect().width;
    intro.classList.add('playing');
    if(audio){try{audio.volume=.8;var pr=audio.play();if(pr&&pr.catch)pr.catch(function(){})}catch(e){}}
    if(vw<1024){ready(500);return}                            // no telemóvel a referência só faz fade
    mv(B,last-b0);
    flick=setInterval(function(){imgs[m].classList.remove('on');m=(m+1)%imgs.length;imgs[m].classList.add('on')},200);
    setTimeout(function(){
      intro.classList.add('sliding');
      mv(A,100-a0);mv(B,(vw-100-bw)-b0);                     // as duas letras vão para onde ficam ART e SPACES
      setTimeout(function(){
        intro.classList.add('finishing');
        ready(900);
        setTimeout(function(){clearInterval(flick)},1400);
      },1800);
    },800);
  });
})();

// ART | SPACES: SPACES abre o menu cor-de-rosa com um véu da mesma cor; ART ainda não existe
(function(){
  var sp=document.querySelector('.choice .spaces'),art=document.querySelector('.choice .art');
  if(sp)sp.addEventListener('click',function(e){
    e.preventDefault();document.body.classList.add('go');
    setTimeout(function(){location.href=sp.getAttribute('href')},600);
  });
  if(art)art.addEventListener('click',function(e){e.preventDefault();art.classList.add('tap');setTimeout(function(){art.classList.remove('tap')},1800)});
})();

// página musica.html: ouvir cada opção
(function(){
  var cur=null,btn=null;
  document.querySelectorAll('.slist .play').forEach(function(b){
    b.addEventListener('click',function(){
      if(cur){cur.pause();btn.classList.remove('on');btn.textContent='▶'}
      if(btn===b){cur=btn=null;return}
      cur=new Audio(b.dataset.src);cur.volume=.8;btn=b;b.classList.add('on');b.textContent='■';
      cur.addEventListener('ended',function(){b.classList.remove('on');b.textContent='▶';cur=btn=null});
      cur.play().catch(function(){});
    });
  });
})();

// menu: "Projetos" abre o submenu (Residencial / Comercial) na coluna 4
document.querySelectorAll('.mproj').forEach(function(b){
  b.addEventListener('click',function(){b.parentNode.classList.toggle('open')});
});

// listagem: ao passar num projeto mostra a foto atrás
document.querySelectorAll('.plist li').forEach(function(li){
  li.addEventListener('mouseenter',function(){document.body.classList.add('peek')});
  li.addEventListener('mouseleave',function(){document.body.classList.remove('peek')});
});

// imagens aparecem com fade de 0.3s quando carregam (componente Image da referência)
document.querySelectorAll('.phero img,.cell img,.ratio img').forEach(function(im){
  if(im.complete&&im.naturalWidth)return;
  im.classList.add('ld');
  im.addEventListener('load',function(){im.classList.remove('ld')});
});

// menu mobile
(function(){
  var b=document.querySelector('.burger');
  if(!b)return;
  b.addEventListener('click',function(){document.body.classList.toggle('menu-open')});
})();

// PT / EN
function setLang(l){
  document.documentElement.lang=l;
  document.querySelectorAll('[data-'+l+']').forEach(function(el){el.innerHTML=el.dataset[l]});
  document.querySelectorAll('.lang button').forEach(function(b){b.classList.toggle('on',b.dataset.l===l)});
  try{localStorage.setItem('ll-lang',l)}catch(e){}
}
document.querySelectorAll('.lang button').forEach(function(b){b.onclick=function(){setLang(b.dataset.l)}});
try{var s=localStorage.getItem('ll-lang');if(s&&s!=='pt')setLang(s)}catch(e){}

// projeto: clicar na foto grande desce para o conteúdo (botão "Scroll down" da referência)
(function(){
  var h=document.querySelector('.phero');
  if(!h)return;
  h.style.cursor='pointer';
  h.addEventListener('click',function(){window.scrollTo({top:h.offsetTop+h.offsetHeight,behavior:'smooth'})});
})();
