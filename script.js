(function(){
  const display = document.getElementById('display');
  // try to get elements with .btn first, otherwise fall back to all buttons
  let buttons = document.querySelectorAll('.btn');
  if (!buttons || buttons.length === 0) buttons = document.querySelectorAll('button');

  if (!display) {
    console.error('Display element with id="display" not found.');
    return;
  }
  if (!buttons || buttons.length === 0) {
    console.error('No buttons found. Ensure your <button> elements exist and script is loaded after them.');
    return;
  }

  let expr = '';

  function update(){
    display.value = expr === '' ? '0' : expr;
  }

  function safeEval(s){
    if (!/^[0-9+\-*/().%\s]+$/.test(s)) throw new Error('Invalid characters in expression');
    const replaced = s.replace(/(\d+(\.\d+)?)%/g, '($1/100)');
    return Function('"use strict";return (' + replaced + ')')();
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.textContent.trim();

      if (val === '='){
        try {
          if (/[\+\-\*\/]$/.test(expr)) expr = expr.slice(0,-1);
          const res = safeEval(expr);
          expr = String(res);
          update();
        } catch (e) {
          console.error('Eval error:', e);
          display.value = 'Error';
          expr = '';
        }
        return;
      }

      if (val === 'AC' || val === 'C'){
        expr = '';
        update();
        return;
      }

      if (val === 'DEL' || val === '←'){
        expr = expr.slice(0,-1);
        update();
        return;
      }

      if (val === '.'){
        const last = expr.split(/[\+\-\*\/]/).pop();
        if (last.includes('.')) return;
      }

      if (/^[+\*\/]$/.test(val) && expr === '') return;

      if (/^[+\-*/]$/.test(val) && /[+\-*/]$/.test(expr)){
        expr = expr.slice(0,-1) + val;
        update();
        return;
      }

      expr += val;
      update();
    });
  });

  // expose for debugging in console
  window.__calculator_expr = () => expr;

  update();
})();
