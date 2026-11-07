// r2-patch.js - Patch R2 para Suprema Serralheria
// Busca o JSON gzipado do R2, descompacta e expoe em window.PERFIS_R2.
// Nao altera HTML, CSS, layout ou funcoes existentes.
(function () {
  var R2_URL = 'https://pub-809552f3b06e437abec2dd924c2a9407.r2.dev/.gz';

  function done(data) {
    window.PERFIS_R2 = data;
    if (typeof window.renderTcTable === 'function') {
      try { window.renderTcTable(); } catch (e) { console.warn('[r2-patch] renderTcTable falhou:', e); }
    }
  }

  fetch(R2_URL, { cache: 'no-store' })
    .then(function (res) {
      if (!res.ok) throw new Error('R2 respondeu HTTP ' + res.status);
      if (!res.body || typeof DecompressionStream === 'undefined') {
        throw new Error('DecompressionStream nao suportado neste navegador');
      }
      var stream = res.body.pipeThrough(new DecompressionStream('gzip'));
      return new Response(stream).text();
    })
    .then(function (text) {
      done(JSON.parse(text));
    })
    .catch(function (err) {
      console.warn('[r2-patch] Falha ao carregar perfis do R2:', err);
    });
})();
