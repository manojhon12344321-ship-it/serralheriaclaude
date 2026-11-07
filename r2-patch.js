(async function(){
  const R2_URL='https://pub-809552f3b06e437abec2dd924c2a9407.r2.dev/.gz';
  const MAP_ORIG={};
  (window.PERFIS||[]).forEach(p=>{
    const c=String(p.cod||'').toUpperCase();
    MAP_ORIG[c]=p.imagem||p.img||p.image||p.svg||p.desenho||null;
  });
  try{
    const resp=await fetch(R2_URL);
    const buf=await resp.arrayBuffer();
    const stream=new Blob([buf]).stream().pipeThrough(new DecompressionStream('gzip'));
    const text=await new Response(stream).text();
    let arr=JSON.parse(text);
    if(!Array.isArray(arr)) arr=arr.perfis||arr.data||Object.values(arr);
    const lista=arr.map((it,i)=>{
      const cod=String(it.cod||it.codigo||'').toUpperCase();
      const imgOrig=MAP_ORIG[cod]||it.imagem||it.img||it.image||it.svg||null;
      return {
        cod: cod,
        nome: it.nome||it.name||cod,
        cat: it.cat||'Perfis',
        linha: it.linha||'SUPREMA',
        acab: it.acab||'BR',
        kgBarra: Number(it.kgBarra||it.peso||2.5),
        kgm: Number(it.kgm||0.4),
        barLen: Number(it.barLen||7000),
        imagem: imgOrig, img: imgOrig, image: imgOrig, svg: imgOrig,
        seed: i, sug:45.03, unit:'KG', ...it, cod:cod
      };
    });
    window.PERFIS.length=0;
    lista.forEach(x=>window.PERFIS.push(x));
    if(window.renderTcTable) window.renderTcTable();
    console.log('R2 com imagens:',lista.length);
  }catch(e){ console.log('R2 falhou, mantendo original',e); }
})();
