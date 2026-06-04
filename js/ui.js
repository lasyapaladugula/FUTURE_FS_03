document.addEventListener('DOMContentLoaded',()=>{
  const toggle=document.querySelector('.nav-toggle');
  const nav=document.getElementById('siteNav');
  if(!toggle||!nav) return;

  toggle.addEventListener('click',()=>{
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('active');
  });

  nav.querySelectorAll('a').forEach(link=>{
    link.addEventListener('click',()=>{
      nav.classList.remove('active');
      toggle.setAttribute('aria-expanded','false');
    });
  });
});
